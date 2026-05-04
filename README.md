# Space Intel by EVONA

Bloomberg-style intelligence terminal for the space industry. Static site
hosted on Netlify, with daily/weekly auto-refresh via GitHub Actions.

## Architecture

- **Frontend** — `index.html`, `styles.css`, `app.js` are vanilla.
  No bundler. `app.js` fetches `data/*.json` on load and falls back
  to the seed data in `data.js` if any file is missing or malformed.
- **Live market data** — stocks and ETFs are pulled client-side from
  Stooq (primary) and Yahoo Finance via CORS proxies (fallback). Refreshes
  every 5 minutes; refresh button in the topbar forces a re-fetch.
- **Cached data** — news, SBIR awards, funding rounds, and jobs live
  in `data/*.json` and are baked into the deploy.

## Refresh schedule

| What | Where | When | How |
|---|---|---|---|
| Stocks + ETFs | client | every 5 min | direct fetch from Stooq / Yahoo |
| News + digest | `data/news.json`, `data/digest.json` | daily 9am EDT | `.github/workflows/refresh-news.yml` |
| SBIR awards | `data/sbir.json` | Mon 10am EDT | `.github/workflows/refresh-sbir.yml` |
| Funding rounds | `data/funding.json` | manual | edit JSON and push |
| Jobs | `data/jobs.json` | manual | edit JSON and push (page is Cloudflare-protected) |

## GitHub Actions secrets

Set these once in **Settings → Secrets and variables → Actions**:

- `ANTHROPIC_API_KEY` — optional. If present, news summaries are rewritten
  in the dry analyst voice and the daily digest panel is regenerated. If
  absent, summaries fall back to the RSS excerpt and the digest stays
  whatever was last written.

## Manual triggers

Either workflow can be run on demand from **Actions → (workflow) → Run workflow**.

## Local dev

```bash
# any static file server works; Python or Node
python -m http.server 8000
# or
npx serve .
```

## Deploy

Pushed to `main` → Netlify auto-deploys. `netlify.toml` pins the publish
directory to the repo root and adds a couple of security headers.
