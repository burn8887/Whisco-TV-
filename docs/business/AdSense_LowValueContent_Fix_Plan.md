# AdSense "Low value content" — confirmed diagnosis and fix plan (2026-09-15)

## The verdict, verbatim from the AdSense Sites page
> **We found some policy violations — Low value content**
> "Your site does not yet meet the criteria of use in the Google publisher network."
> (resources linked: Minimum content requirements · unique high quality content · thin content guidelines)
> Checkbox: *"I confirm I have fixed the issues"* → button: **Request review**

Site ownership: **verified ✓**. So verification is not the problem; content is.

**DO NOT tick the box or press Request review until the fix is LIVE.** Nothing has changed since the 2026-08-29 rejection, a second rejection on unchanged content is worse than waiting, and the confirmation is an assertion that must be true when made.

## Measured diagnosis (live DB, 2026-09-15)

| Metric | Value | Read |
|---|---|---|
| Titles | 16,920 | 12,973 movie · 3,553 documentary · 394 series |
| Titles with a synopsis | 16,920 (100%) | present, but… |
| Average synopsis length | **24 words** | a caption, not a description |
| Under 40 words | **16,220 (96%)** | the bulk of the site is a one-liner |
| Templated boilerplate | **14,802 (87%)** | "…from X's official channel. Free and ad-supported on Whisco TV." |
| Exact duplicate strings | 252 (1.5%) | so the complaint is **thin**, not copy-paste |
| `cast` populated | **13 (0%)** | a major content lever, unused |
| `director` | 15,196 (90%) | good |
| country / language / year / genres / rating | 100% | good, but these are metadata, not content |
| Episode rows | 10,769 | ultra-thin pages sitting under series |

**Reading:** this is the classic programmatic-catalogue profile — thousands of structurally identical pages whose only unique text is a 24-word templated blurb, plus a player. Google's guidance calls that thin/low-value. The 7 guides (336–732 words) and the 5 staged `/where` pages are the *right instinct* but 12 editorial pages cannot outweigh 16,920 thin ones.

## Fix plan — content first, then hygiene, then request

**Phase 1 — real per-title text at scale (highest leverage, near-zero cost).**
Pull each title's own description from the **YouTube Data API v3** (`videos.list?part=snippet`, 50 ids per call → ~340 calls for the catalogue, against a 10,000 units/day free quota). That yields real, unique text per title — the uploader's own description — plus tags and publish dates. Compose an original 120–200 word synopsis per title from that + existing metadata (never a single template; vary structure by genre/era/type). TMDB (free, attribution) as the second source for synopses, cast and crew where a title matches.
*Requires: one API key in the existing GCP project (founder, ~1 min), restricted to YouTube Data API v3.*

**Phase 2 — rebuild the title page template** to carry: the long synopsis, cast + crew (where known), full episode list with real episode titles for series, collection/country context, related titles, and Movie/TVSeries JSON-LD. Depth target ≥150 words of unique text on every page.

**Phase 3 — thin-page hygiene.** Episodes (10,769) are thinner than titles: `noindex` them and drop them from the sitemap until they carry real content. Same rule for any title page that still fails a content threshold after Phases 1–2 — better absent from search than counted as a thin page.

**Phase 4 — deploy after the freeze (Sep 20), alongside the `where-pages` merge.** Then verify a sample (word counts, template output, sitemap), then Request review.

## Honest risks (not optimism)

1. **Enrichment materially improves the odds; it does not guarantee approval.** AdSense's "unique high quality content" test is subjective, and embed-heavy aggregators are sometimes rejected on principle because the underlying video is not ours.
2. **Plan for two cycles.** Submit → wait → if rejected again, read the new issue list and iterate. First review took ~8 days (21 → 29 Aug); budget similar.
3. **Do not buy LLM-written blurbs at 16,920 scale.** Cost is real and "AI-written catalogue text" is exactly the pattern reviewers are trained to spot. Use the source's own words + real credits instead.

## Effort [EST]
Phase 1 data harvest ~1 day · Phase 2 template ~1 day · Phase 3 hygiene ~half day · verification ~half day → **deployable by Sep 20**, which is already the post-freeze date.
