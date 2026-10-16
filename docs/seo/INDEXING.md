# Launch Indexing — Priority Pages (Gate G21)

Requirement: **Indexing request completed for priority pages.**

The requirement is met only when every priority URL has (a) passed preflight, (b) been
submitted via IndexNow, and (c) had "Request indexing" clicked in Google Search Console, with
each step recorded in the evidence log below. Tooling alone does not meet it.

Priority pages live in [`scripts/seo/priority-pages.json`](../../scripts/seo/priority-pages.json)
(10 URLs: home, start, brotherhood, code, four pillar pages, field notes, about). Articles are
discovered through `/sitemap.xml` and the `/field-notes` hub — they are not individually submitted.

---

## One-time setup

1. **Google Search Console** — add a Domain property for `liveaspartanlife.com` (DNS TXT
   verification) under the client's Google account, and add AIVH as an owner or full user.
   Submit `https://www.liveaspartanlife.com/sitemap.xml` under Sitemaps.
2. **Bing Webmaster Tools** — import the property from Search Console (one click) and submit the
   same sitemap. Bing's IndexNow submissions show up here.
3. **IndexNow key** — generate one (`openssl rand -hex 16`) and set `INDEXNOW_KEY` in Vercel,
   Production scope. Redeploy. Confirm `https://www.liveaspartanlife.com/indexnow-key.txt`
   returns exactly the key. The route returns 404 while the variable is unset.

## Run

```bash
# 1. Preflight only — fetches the live site, submits nothing.
npm run seo:indexing

# 2. Submit to IndexNow and write the evidence file.
INDEXNOW_KEY=<same key as Vercel> npm run seo:indexing -- --submit \
  --out docs/seo/evidence/$(date +%F).json
```

Preflight fails (exit 1, nothing submitted) if any priority URL is not a direct 200, carries
`noindex`, has a canonical pointing elsewhere, is disallowed by robots.txt, or if sitemap.xml
cannot be fetched or contains localhost URLs.

## Google "Request indexing" (manual)

Google's Indexing API covers only `JobPosting` and `BroadcastEvent` pages, so ordinary pages
have no API route. For each URL: Search Console → URL Inspection → paste URL → **Test live
URL** (must show "URL is available to Google") → **Request indexing**. Google allows roughly
10–12 requests per property per day, which covers this list in one sitting.

## Evidence log

Fill in as each step actually happens. Leave `PENDING` until it does — do not pre-fill.

| URL | Preflight | IndexNow | GSC requested (date / by) |
|---|---|---|---|
| https://www.liveaspartanlife.com/ | PENDING | PENDING | PENDING |
| https://www.liveaspartanlife.com/start | PENDING | PENDING | PENDING |
| https://www.liveaspartanlife.com/brotherhood | PENDING | PENDING | PENDING |
| https://www.liveaspartanlife.com/code | PENDING | PENDING | PENDING |
| https://www.liveaspartanlife.com/train | PENDING | PENDING | PENDING |
| https://www.liveaspartanlife.com/fuel | PENDING | PENDING | PENDING |
| https://www.liveaspartanlife.com/mind | PENDING | PENDING | PENDING |
| https://www.liveaspartanlife.com/provide | PENDING | PENDING | PENDING |
| https://www.liveaspartanlife.com/field-notes | PENDING | PENDING | PENDING |
| https://www.liveaspartanlife.com/about | PENDING | PENDING | PENDING |

Attach the `docs/seo/evidence/<date>.json` file and a Search Console screenshot per URL
showing "Indexing requested" when closing G21.
