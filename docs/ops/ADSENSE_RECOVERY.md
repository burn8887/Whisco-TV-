# AdSense recovery — runbook (opened 5 Nov 2026)

AdSense rejected whisco.tv for "low value content" on 29 Aug and 3 Nov 2026.
Cause: reachable pages read like a templated aggregator of embedded video
(Google Publisher Policies, "replicated content": sites dedicated to embedding
other sites' video without substantial added value). Full plan: the Claude Doc
"Whisco TV — AdSense Recovery Plan & Maintenance Run".

## Gate — request review only when all four pass
1. Weekly readiness scan (adsense-readiness.yml): zero findings.
2. Database errors under 10 a day for 14 straight days (Vercel runtime errors).
3. At least 50 series write-ups (src/lib/series-notes.ts) and the guide merge live.
4. Four weeks since the last big template change.
Then Ali: AdSense → Sites → whisco.tv → Request review. Earliest: late Dec 2026.

## Standing rules this work introduced
- No "watch … online free / full movie / full series" wording anywhere.
- No rating shown or marked up unless it has a cited source; no aggregateRating.
- Title pages say where the video plays from (provenance block).
- Ad slot on a title page only when it has a series note (YouTube API policy III.G.1.d).
- Homepage and "Tonight" show curated series and named films, never single uploads.
- Series notes: drafted with sources, reviewed by a person, published by merging.

## Guide merge map — PROPOSED, needs Ali's approval before any merge (46 → 36)
| Merge this guide | Into | Why |
| --- | --- | --- |
| official-youtube-layer-gulf-expats | free-tv-for-expats-gulf | Same thesis |
| multi-language-living-room-gulf-legal | cut-the-pirate-box | Same thesis |
| first-week-gulf-flat-tv | cut-the-pirate-box | Same thesis |
| arabic-news-without-a-dish | arabic-news-current-affairs-gulf-legal | Same topic |
| sinhala-teledrama-gulf | sri-lankan-teledrama-news-gulf-legal | Same audience |
| punjabi-movies-english-subtitles-uae | punjabi-films-music-gulf-legal | Same audience |
| indonesian-tv-qatar-legal | indonesian-sinetron-gulf-legal | Same audience |
| telugu-live-tv-dubai-apartment-no-dish | telugu-cinema-serials-gulf-legal | Same audience |
| free-legal-hd-turkish-series-english-subtitles | turkish-series-guide | Same topic |
| free-legal-arabic-series-smart-tv-gulf | arabic-series-guide | Same topic |
Each merged URL gets a 301 to its target; the target keeps the best paragraphs of both.
