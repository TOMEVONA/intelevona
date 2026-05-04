// Feed config for the news refresh job. Each source maps to one or more
// RSS/Atom URLs. Some sources don't publish RSS — those are flagged
// `manual: true` and are left untouched by the refresh script (the
// existing entries in data/news.json carry through).
export const SOURCES = [
  { id: "spacenews",  name: "SpaceNews",         category: "Space",        feeds: ["https://spacenews.com/feed/"] },
  { id: "tectonic",   name: "Tectonic Defense",  category: "Defense",      manual: true },
  { id: "piratewires",name: "Pirate Wires",      category: "Tech",         feeds: ["https://www.piratewires.com/feed.xml"] },
  { id: "resilience", name: "Resilience Media",  category: "Defense",      manual: true },
  { id: "tbpn",       name: "TBPN",              category: "Tech",         manual: true },
  { id: "ussf",       name: "U.S. Space Force",  category: "Government",   feeds: ["https://www.spaceforce.mil/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=1060&max=15"] },
  { id: "dod",        name: "Dept. of Defense",  category: "Government",   feeds: ["https://www.defense.gov/DesktopModules/ArticleCS/RSS.ashx?ContentType=1&Site=945&max=15"] },
  { id: "viasat",     name: "Via Satellite",     category: "Space",        feeds: ["https://www.satellitetoday.com/feed/"] },
  { id: "spacecom",   name: "Space.com",         category: "Space",        feeds: ["https://www.space.com/feeds/all"] },
  { id: "rspace",     name: "r/space",           category: "Space",        feeds: ["https://www.reddit.com/r/space/.rss"] },
  { id: "nga",        name: "NGA",               category: "Intelligence", manual: true },
  { id: "spacedaily", name: "Space Daily",       category: "Space",        feeds: ["https://www.spacedaily.com/spacedaily.xml"],
    // SpaceDaily mixes lifestyle and aerospace content — drop anything
    // whose title hits these keywords (case-insensitive substring match).
    excludeKeywords: ["health", "diet", "recipe", "celebrity", "hollywood", "fashion", "lifestyle", "horoscope", "gaming"] },
  { id: "nasa",       name: "NASA",              category: "Government",   feeds: ["https://www.nasa.gov/feed/"] }
];

// Minimum number of fresh articles to count as a successful fetch.
// If we end up with fewer than this many across all sources, abort
// and leave existing news.json alone. Lenient by design — feed 403s
// happen and we'd rather merge with existing than nuke the dataset.
export const MIN_TOTAL_ARTICLES = 5;
// Max articles per source kept in the final feed.
export const MAX_PER_SOURCE = 5;
