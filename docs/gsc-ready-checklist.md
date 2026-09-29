# GSC-Ready Technical Checklist

Last updated: 2026-04-30

## Canonical and Indexation
- Home canonical points to `https://aibusiness.vc/` (not `/index`).
- Section/article pages self-canonicalize.
- Noindex is enabled only for private routes (`/labs/*`, leads/admin/login, audit result pages).
- Sitemap excludes private/noindex routes.

## Sitemap and Robots
- `https://aibusiness.vc/sitemap.xml` returns 200 and contains key hubs + article URLs.
- `robots.txt` references sitemap and allows major search/AI bots intentionally.
- New content paths are added to sitemap on publish.

## Metadata Consistency
- Each article has unique `title`, `description`, `date`, `author`, `image`, `keywords`.
- OG/Twitter image is available and crawlable.
- Dates and bylines are visible in page content.

## Content Quality Signals
- No thin pages in priority clusters.
- No duplicate topic clusters within the last 7 days.
- Each new post includes 3+ relevant internal links.
- Money/ROI angle is explicit and supported with facts.

## Performance and UX
- Mobile rendering is clean on homepage and article pages.
- LCP media uses optimized dimensions and stable layout.
- Broken links and image 404s are checked weekly.

## GSC Weekly Routine
1. Check `Indexing > Pages` for new errors and spikes in excluded URLs.
2. Check `Performance > Search results`:
   - Top queries by impressions with low CTR.
   - Pages with declining clicks week-over-week.
3. Submit important new URLs via URL Inspection when needed.
4. Refresh titles/descriptions for low-CTR, high-impression pages.
5. Track growth by section (`solo`, `startups`, `b2b`, `vc`, `government`, `learn`, `materials`).

## Working Files in This Repo
- `docs/seo-priority-board.csv` — active URL backlog (P0/P1/P2).
- `docs/seo-priority-summary.md` — generated section coverage summary.
- `docs/gsc-weekly-review-template.md` — weekly review template for operations.
- `scripts/generate-seo-priority-board.js` — regenerate URL backlog after publishing waves.

## Targets (60 Days)
- +40% non-brand clicks.
- +30% pages in Top 10 positions.
- CTR uplift on top 50 impression pages by +20%.
- 0 critical canonical/indexation errors.
