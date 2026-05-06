#!/usr/bin/env node
/**
 * Daily news refresh.
 *
 *   1. Fetches RSS/Atom for every source in sources.mjs that has a feed URL
 *   2. Picks up to MAX_PER_SOURCE recent articles per source
 *   3. If ANTHROPIC_API_KEY is present, calls Claude to rewrite each
 *      summary in the dry-witty-analyst voice the brief asks for, plus a
 *      digest panel with 3-4 themes. Otherwise falls back to the RSS
 *      excerpt verbatim and leaves the existing digest panel alone.
 *   4. Writes data/news.json and (if applicable) data/digest.json
 *
 * Manual-only sources (no RSS) are passed through from the existing
 * data/news.json unchanged.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";
import { SOURCES, MIN_TOTAL_ARTICLES, MAX_PER_SOURCE } from "./sources.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, "..");
const NEWS_PATH   = path.join(ROOT, "data", "news.json");
const DIGEST_PATH = path.join(ROOT, "data", "digest.json");

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const GH_MODELS_TOKEN   = process.env.GH_MODELS_TOKEN || "";
const MODEL             = process.env.MODEL || (ANTHROPIC_API_KEY ? "claude-haiku-4-5-20251001" : "openai/gpt-4o-mini");

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  parseTagValue: true,
  trimValues: true,
  textNodeName: "_text"
});

const decodeEntities = s => String(s || "")
  .replace(/&#(\d+);/g,        (_, n) => String.fromCodePoint(+n))
  .replace(/&#x([0-9a-f]+);/gi,(_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&nbsp;/g,   " ")
  .replace(/&amp;/g,    "&")
  .replace(/&quot;/g,   '"')
  .replace(/&apos;/g,   "'")
  .replace(/&lt;/g,     "<")
  .replace(/&gt;/g,     ">")
  .replace(/&hellip;/g, "…")
  .replace(/&mdash;/g,  "—")
  .replace(/&ndash;/g,  "–")
  .replace(/&rsquo;/g,  "'").replace(/&lsquo;/g, "'")
  .replace(/&rdquo;/g,  '"').replace(/&ldquo;/g, '"');

const stripHtml = s => decodeEntities(String(s || "")
  .replace(/<!\[CDATA\[(.*?)\]\]>/gs, "$1")
  .replace(/<[^>]+>/g, " "))
  .replace(/\s*\[…\][\s\S]*$/, "")                        // [...] truncation marker + tail
  .replace(/\s*The post .* appeared first on.*$/i, "")          // standard WP RSS footer
  .replace(/\s*Continue reading[\s\S]*$/i, "")
  .replace(/\s+/g, " ")
  .trim();

// Trim to ~max chars but cut at the last sentence boundary if one exists
// in the back half; otherwise the last word boundary. Adds an ellipsis if
// we trimmed off content.
function smartTruncate(text, max) {
  if (!text) return "";
  if (text.length <= max) return text;
  const slice = text.slice(0, max);
  const lastSentence = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("! "),
    slice.lastIndexOf("? ")
  );
  if (lastSentence > max * 0.5) return slice.slice(0, lastSentence + 1).trim();
  const lastSpace = slice.lastIndexOf(" ");
  return (lastSpace > max * 0.5 ? slice.slice(0, lastSpace) : slice).trim() + "…";
}

const toISODate = s => {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d) ? null : d.toISOString().slice(0, 10);
};

async function fetchFeed(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "SpaceIntelByEVONA/1.0 (+https://github.com/TOMEVONA/intelevona)",
      "Accept": "application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.8"
    },
    redirect: "follow"
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function parseFeed(xml) {
  const obj = parser.parse(xml);
  // RSS 2.0
  if (obj.rss && obj.rss.channel) {
    const ch = obj.rss.channel;
    const items = Array.isArray(ch.item) ? ch.item : ch.item ? [ch.item] : [];
    return items.map(it => ({
      title:       stripHtml(it.title?._text ?? it.title),
      link:        typeof it.link === "string" ? it.link : (it.link?.href ?? it.link?._text ?? ""),
      description: stripHtml(it.description?._text ?? it.description ?? it["content:encoded"]?._text ?? it["content:encoded"] ?? ""),
      pubDate:     it.pubDate ?? it["dc:date"] ?? it.date ?? null
    }));
  }
  // Atom
  if (obj.feed && obj.feed.entry) {
    const entries = Array.isArray(obj.feed.entry) ? obj.feed.entry : [obj.feed.entry];
    return entries.map(e => {
      let link = "";
      if (Array.isArray(e.link)) {
        const alt = e.link.find(l => l.rel === "alternate" || !l.rel);
        link = alt ? alt.href : e.link[0].href;
      } else if (e.link) {
        link = e.link.href ?? e.link;
      }
      return {
        title:       stripHtml(e.title?._text ?? e.title),
        link,
        description: stripHtml(e.summary?._text ?? e.summary ?? e.content?._text ?? e.content ?? ""),
        pubDate:     e.published ?? e.updated ?? null
      };
    });
  }
  return [];
}

async function fetchSource(src) {
  if (src.manual || !src.feeds || !src.feeds.length) return null;
  for (const url of src.feeds) {
    try {
      const xml = await fetchFeed(url);
      let items = parseFeed(xml);

      if (src.excludeKeywords) {
        const kws = src.excludeKeywords.map(k => k.toLowerCase());
        items = items.filter(it => !kws.some(k => it.title.toLowerCase().includes(k)));
      }

      if (src.linkContains) {
        items = items.filter(it => (it.link || "").includes(src.linkContains));
      }

      // Sort newest first if pubDate is parseable
      items = items.filter(it => it.title && it.link);
      items.sort((a, b) => {
        const da = a.pubDate ? Date.parse(a.pubDate) : 0;
        const db = b.pubDate ? Date.parse(b.pubDate) : 0;
        return db - da;
      });
      items = items.slice(0, MAX_PER_SOURCE);

      console.log(`  [${src.id}] ${items.length} articles`);
      return items.map(it => ({
        sourceId: src.id,
        title:    it.title,
        summary:  smartTruncate(it.description, 280),
        date:     toISODate(it.pubDate) || new Date().toISOString().slice(0, 10),
        link:     it.link
      }));
    } catch (e) {
      console.warn(`  [${src.id}] feed failed (${url}): ${e.message}`);
    }
  }
  return null;
}

/* ---------- LLM helpers ---------------------------------------
   Tries Anthropic first (best at editorial voice); falls back to
   GitHub Models (free, OpenAI-compatible). callClaude is the unified
   entry point — name kept for backwards compatibility.
   ------------------------------------------------------------- */
async function callAnthropic(prompt, maxTokens) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key":         ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type":      "application/json"
    },
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: maxTokens,
      messages:   [{ role: "user", content: prompt }]
    })
  });
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  return (json.content || []).find(c => c.type === "text")?.text || "";
}

async function callGitHubModels(prompt, maxTokens) {
  // Try the modern endpoint first; fall back to legacy Azure-hosted.
  const endpoints = [
    "https://models.github.ai/inference/chat/completions",
    "https://models.inference.ai.azure.com/chat/completions"
  ];
  let lastErr;
  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GH_MODELS_TOKEN}`,
          "Content-Type":  "application/json"
        },
        body: JSON.stringify({
          model:       MODEL,
          messages:    [{ role: "user", content: prompt }],
          max_tokens:  maxTokens,
          temperature: 0.4
        })
      });
      if (!res.ok) {
        lastErr = new Error(`GitHub Models ${res.status} at ${url.replace(/^https?:\/\//, "")}: ${(await res.text()).slice(0, 200)}`);
        continue;
      }
      const json = await res.json();
      return (json.choices?.[0]?.message?.content || "").trim();
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error("GitHub Models: all endpoints failed");
}

async function callClaude(prompt, maxTokens = 4096) {
  if (ANTHROPIC_API_KEY) return callAnthropic(prompt, maxTokens);
  if (GH_MODELS_TOKEN)   return callGitHubModels(prompt, maxTokens);
  return "";  // no LLM configured — caller falls back to RSS excerpt
}

async function rewriteWithClaude(articles) {
  if (!ANTHROPIC_API_KEY) return articles;
  const CHUNK = 12;
  for (let i = 0; i < articles.length; i += CHUNK) {
    const batch = articles.slice(i, i + CHUNK);
    const prompt = `You are an industry analyst writing one-sentence summaries of space and defense industry news.

VOICE: dry, slightly witty, never corporate. Think Bloomberg's Matt Levine on aerospace. State what happened in one sentence, then add one sharp observation. No hype, no marketing language, no "groundbreaking", no "revolutionary".

Length: max 240 chars per summary.

Return ONLY a JSON array of the same length as the input, in the same order, with each element being { "summary": "..." }. No prose, no markdown.

Articles:
${JSON.stringify(batch.map(a => ({ title: a.title, excerpt: a.summary.slice(0, 400) })), null, 2)}`;

    try {
      const text = await callClaude(prompt, 4096);
      const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
      const parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed) || parsed.length !== batch.length) throw new Error("array length mismatch");
      batch.forEach((a, idx) => {
        a.summary = String(parsed[idx]?.summary || a.summary).trim();
      });
    } catch (e) {
      console.warn(`  Claude rewrite failed for batch ${i / CHUNK}: ${e.message} — keeping original summaries`);
    }
  }
  return articles;
}

async function generateDigest(articles) {
  if (!ANTHROPIC_API_KEY) return null;
  const headlines = articles.slice(0, 40).map(a => `• ${a.title}`).join("\n");
  const prompt = `You are an industry analyst writing the daily intelligence digest for a Bloomberg-style space industry terminal.

Voice: dry, slightly witty, never corporate. Avoid hype words. Sharp, professional, slightly knowing.

From these recent headlines, write a digest with this exact JSON shape:
{
  "title": "Week in Orbit",
  "summary": "2-3 sentence overview of what is moving in the space/defense industry right now",
  "themes": [
    { "icon": "▣ or ◉ or ▲ or ◆", "title": "short theme title (4-6 words)", "body": "2 sentences of analysis on this theme" }
  ]
}

Use exactly 4 themes. Pick from these icons: ▣ ◉ ▲ ◆.

Headlines:
${headlines}

Return ONLY the JSON. No prose, no markdown.`;

  try {
    const text = await callClaude(prompt, 2048);
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
    const digest = JSON.parse(cleaned);
    digest.updated = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";
    return digest;
  } catch (e) {
    console.warn(`  Digest generation failed: ${e.message}`);
    return null;
  }
}

async function main() {
  console.log("Fetching RSS feeds…");
  const fetched = await Promise.all(SOURCES.map(fetchSource));

  // Load existing for fallbacks (manual sources, plus any source that failed)
  let existing = { articles: [] };
  try { existing = JSON.parse(await fs.readFile(NEWS_PATH, "utf8")); } catch {}

  let articles = [];
  SOURCES.forEach((src, i) => {
    const fresh = fetched[i];
    if (fresh && fresh.length) {
      articles.push(...fresh);
    } else {
      // keep prior articles for this source
      const prior = existing.articles.filter(a => a.sourceId === src.id);
      if (prior.length) {
        console.log(`  [${src.id}] keeping ${prior.length} prior articles`);
        articles.push(...prior);
      }
    }
  });

  if (articles.length < MIN_TOTAL_ARTICLES) {
    console.error(`Aborting: only ${articles.length} articles (min ${MIN_TOTAL_ARTICLES})`);
    process.exit(1);
  }

  console.log(`\nTotal articles: ${articles.length}`);

  const provider = ANTHROPIC_API_KEY ? "Anthropic" : (GH_MODELS_TOKEN ? "GitHub Models" : null);
  if (provider) {
    console.log(`Rewriting summaries with ${provider} (model: ${MODEL})…`);
    articles = await rewriteWithClaude(articles);

    console.log(`Generating digest with ${provider}…`);
    const digest = await generateDigest(articles);
    if (digest) {
      await fs.writeFile(DIGEST_PATH, JSON.stringify(digest, null, 2) + "\n");
      console.log(`Wrote ${DIGEST_PATH}`);
    }
  } else {
    console.log("No LLM configured (ANTHROPIC_API_KEY / GH_MODELS_TOKEN) — keeping RSS summaries");
  }

  const out = {
    updated: new Date().toISOString(),
    articles
  };
  await fs.writeFile(NEWS_PATH, JSON.stringify(out, null, 2) + "\n");
  console.log(`Wrote ${NEWS_PATH}`);
}

main().catch(err => { console.error(err); process.exit(1); });
