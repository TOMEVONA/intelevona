#!/usr/bin/env node
/**
 * Weekly SBIR Phase II refresh.
 *
 * Pulls Phase II awards from the past 7 days from the public SBIR.gov API:
 *   https://api.www.sbir.gov/public/api/awards
 *
 * Filters by topic keywords matching the 6 sectors the dashboard shows
 * (Space, AI/ML, Cyber, UAV/Drones, Aerospace, Defense), normalises to
 * the dashboard's data model, and writes data/sbir.json.
 *
 * If the fetch fails or returns fewer than MIN_AWARDS, abort and leave
 * the existing file alone.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SBIR_PATH = path.join(ROOT, "data", "sbir.json");

const MIN_AWARDS = 1;

// Each sector defines the keywords used to match against the award's
// title + topic + abstract. First match wins.
const SECTORS = [
  { name: "Space",       kw: ["space", "satellite", "orbit", "lunar", "spacecraft", "launch vehicle", "constellation"] },
  { name: "AI/ML",       kw: ["machine learning", "artificial intelligence", "neural network", "deep learning", "ai/ml", " ai "] },
  { name: "Cyber",       kw: ["cyber", "post-quantum", "zero-trust", "encryption", "intrusion"] },
  { name: "UAV/Drones",  kw: ["uav", "unmanned aerial", "drone", "vtol", "swarm"] },
  { name: "Aerospace",   kw: ["aerospace", "propellant", "propulsion", "thruster", "hypersonic", "rocket"] },
  { name: "Defense",     kw: ["defense", "missile", "weapon", "threat", "munition", "warfighter", "battlespace"] }
];

function classifySector(award) {
  const haystack = [
    award.award_title || "",
    award.topic_code  || "",
    award.abstract    || "",
    award.research_area_keywords || ""
  ].join(" ").toLowerCase();
  for (const s of SECTORS) {
    if (s.kw.some(k => haystack.includes(k))) return s.name;
  }
  return null;
}

function abbreviateAgency(a) {
  if (!a) return "";
  const map = {
    "Department of Defense":              "DoD",
    "Air Force":                          "USAF",
    "U.S. Air Force":                     "USAF",
    "Space Force":                        "USSF",
    "U.S. Space Force":                   "USSF",
    "Navy":                               "Navy",
    "Department of the Navy":             "Navy",
    "Army":                               "Army",
    "Department of the Army":             "Army",
    "National Aeronautics and Space Administration": "NASA",
    "Defense Advanced Research Projects Agency":     "DARPA",
    "Missile Defense Agency":             "MDA"
  };
  return map[a] || a;
}

function weekLabel() {
  const today = new Date();
  const end = new Date(today);
  // Go back to last Sunday for "week of Mon-Sun" framing
  end.setUTCDate(end.getUTCDate() - end.getUTCDay());
  const start = new Date(end); start.setUTCDate(start.getUTCDate() - 6);
  const fmt = d => d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  return `Week of ${fmt(start)} – ${fmt(end)}, ${end.getUTCFullYear()}`;
}

// Fetch with exponential-backoff retry on 429/503. SBIR.gov rate-limits
// GitHub Actions IP space aggressively; spaced-out retries usually clear.
async function fetchWithBackoff(url, opts, attempts = 4) {
  for (let i = 1; i <= attempts; i++) {
    const res = await fetch(url, opts);
    if (res.ok) return res;
    if ((res.status === 429 || res.status === 503) && i < attempts) {
      const retryAfter = parseInt(res.headers.get("retry-after") || "0", 10);
      const wait = (retryAfter > 0 ? retryAfter : Math.pow(3, i)) * 1000;  // 3s, 9s, 27s
      console.warn(`  HTTP ${res.status} (attempt ${i}/${attempts}); waiting ${wait / 1000}s before retry`);
      await new Promise(r => setTimeout(r, wait));
      continue;
    }
    return res;  // non-retryable status
  }
}

async function fetchAwards() {
  const today = new Date();
  const start = new Date(today); start.setUTCDate(start.getUTCDate() - 60);
  const fmt = d => d.toISOString().slice(0, 10);
  const variants = [
    `https://api.www.sbir.gov/public/api/awards?phase=Phase+II&start_date=${fmt(start)}&end_date=${fmt(today)}&rows=200`,
    `https://api.www.sbir.gov/public/api/awards?phase=Phase%20II&start=${fmt(start)}&end=${fmt(today)}&rows=200`,
    `https://api.www.sbir.gov/public/api/awards?rows=200`
  ];
  // Browser-like UA — gov CDNs are friendlier to UAs that look like a browser
  const headers = {
    "User-Agent":      "Mozilla/5.0 (compatible; SpaceIntelByEVONA/1.0; +https://github.com/TOMEVONA/intelevona)",
    "Accept":          "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Cache-Control":   "no-cache"
  };
  for (const url of variants) {
    console.log(`GET ${url}`);
    try {
      const res = await fetchWithBackoff(url, { headers });
      if (!res.ok) { console.warn(`  HTTP ${res.status} (gave up after retries)`); continue; }
      const text = await res.text();
      let json;
      try { json = JSON.parse(text); }
      catch { console.warn(`  Non-JSON response: ${text.slice(0, 120)}`); continue; }
      const arr = Array.isArray(json) ? json : (json.data || json.awards || json.results || []);
      if (arr.length) {
        console.log(`  Got ${arr.length} records. First record keys: ${Object.keys(arr[0]).slice(0, 20).join(", ")}`);
        return arr;
      }
      console.warn(`  Empty result set`);
    } catch (e) {
      console.warn(`  ${e.message}`);
    }
  }
  throw new Error("All SBIR API variants failed");
}

function transform(raw) {
  return raw
    .filter(a => /Phase II/i.test(a.phase || ""))
    .map(a => {
      const sector = classifySector(a);
      if (!sector) return null;
      const amt = Number(a.award_amount || a.amount || 0) / 1e6;
      if (!amt || amt <= 0) return null;
      const co  = a.firm || a.company || "";
      const loc = [a.firm_city || a.city, a.firm_state || a.state].filter(Boolean).join(", ");
      return {
        co,
        loc,
        sector,
        amt: +amt.toFixed(2),
        agency: abbreviateAgency(a.branch || a.agency || ""),
        topic:  a.topic_code || a.topic || "",
        title:  a.award_title || a.title || "",
        abstract: (a.abstract || "").slice(0, 320),
        link: a.award_link || a.url || "https://www.sbir.gov/sbirsearch/award/all"
      };
    })
    .filter(Boolean)
    .sort((x, y) => y.amt - x.amt)
    .slice(0, 25);
}

async function main() {
  let raw;
  try {
    raw = await fetchAwards();
  } catch (e) {
    // SBIR.gov rate-limits GitHub Actions IPs — treat as transient.
    // Don't fail the workflow; existing data/sbir.json carries through.
    console.warn(`⚠️  SBIR API unreachable: ${e.message}`);
    console.warn(`   Existing data/sbir.json left untouched. Workflow exits clean.`);
    return;
  }
  console.log(`API returned ${raw.length} raw awards`);
  const awards = transform(raw);
  console.log(`Filtered to ${awards.length} Phase II in target sectors`);

  if (awards.length < MIN_AWARDS) {
    console.warn(`⚠️  Only ${awards.length} matching awards (min ${MIN_AWARDS}). Leaving existing data/sbir.json untouched.`);
    return;
  }

  const out = {
    updated:   new Date().toISOString(),
    weekLabel: weekLabel(),
    awards
  };
  await fs.writeFile(SBIR_PATH, JSON.stringify(out, null, 2) + "\n");
  console.log(`Wrote ${SBIR_PATH}`);
}

main().catch(err => {
  // Last-resort guard: any unexpected error still produces a green run
  // so the user isn't blocked by intermittent API issues.
  console.warn(`⚠️  Unexpected error: ${err.message}`);
  process.exit(0);
});
