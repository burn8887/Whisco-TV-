# GSC FULL CHECK — 2026-09-27 · REPORT BACK

Owner: Arena · Doctrine: Desk · **Clicks by agent: 0** (no logged-in GSC session exists for an agent)
Data: read-only APIs — Search Console (sitemaps + URL Inspection + **Search Analytics**) and public HTTP.

---

## PROPERTY

- **name used:** `https://www.whisco.tv/` — the read-only service account `whisco-agent@…` has
  `siteFullUser` on **two** properties and I read from the www one only:
  - `https://www.whisco.tv/` ← **the one used**
  - `https://whisco.tv/` ← **apex, present, untouched**
- **apex property present?** yes — last sitemap download `2026-09-26T09:27:08Z`, submitted 2,767 URLs on
  **2026-08-30**, `isPending: false`, **0 errors**. Nothing submitted, nothing touched.
- The Recommendations signal you saw (`https://www.whisco.tv/about`) is on the www property ✅ — consistent.

## SITEMAP

| field | value |
|---|---|
| submitted URL | `https://www.whisco.tv/sitemap.xml` (single entry, no index file) |
| **last read** | **2026-09-26T10:50:05Z** — ~26 h before this check (**fresh, <48 h**) |
| last submitted | 2026-09-21T12:21:52Z |
| discovered | **2,772** (www property) — not stuck on ~2,752 |
| **live count** | **2,767 `<loc>`** |
| errors / warnings | **0 / 0** · `isPending: false` |
| **resubmitted?** | **NO** — Desk rule: fresh read + 0 errors + guides present → do nothing |

**Live-file breakdown, measured:**

| prefix | count |
|---|---|
| `/title/` | **2,111** ✅ (rule: never shrink) |
| `/live/` | **621** |
| `/guides/` | **27 slugs** + the `/guides` hub = **28** ✅ |
| core | `/` `/about` `/contact` `/browse` `/new` `/vod` `/live` `/guides` — **all present** ✅ |
| trailing-slash variants | 0 |
| apex URLs inside the file | 0 |

- **All 27 guide slugs are in the live file** ✅ → no engineering ticket, no PR.
- Root `<loc>` is published as `https://www.whisco.tv` (no trailing slash). Valid; Google normalises; the
  property reports 0 errors.
- **One arithmetic note for the Desk:** the live file carries **621** `/live/` URLs, not 622. My breakdown
  2,111 + 621 + 27 + 8 = **2,767** reconciles exactly with the live count you quoted. The 622 figure is one
  high — likely a snapshot taken before the channel-health job pruned a dead stream (613 are currently
  active per the live API, so pruning is ongoing).

## PUBLISHER TABLE

Read-only inspection, today 12:43 Asia/Bahrain. `cut-the-pirate-box` inspected only, **not** requested.

**Group A — known indexed 21 Sep (glance only):**

| URL | state | last crawl | notes |
|---|---|---|---|
| `/` | indexed | 2026-09-15 | brand hub |
| `/about` | indexed | 2026-09-09 | 246 impressions in 28d, pos 2.3 |
| `/guides` | indexed | 2026-08-31 | |
| `/guides/turkish-series-guide` | indexed | 2026-08-30 | |
| `/guides/free-tv-for-expats-gulf` | indexed | 2026-08-30 | |
| `/guides/pakistani-dramas-guide` | indexed | 2026-09-03 | |

**Group B — requested 21 Sep:**

| URL | state | last crawl | notes |
|---|---|---|---|
| `…/free-legal-hd-turkish-series-english-subtitles` | **discovered – not indexed** | — | ⬅ REQUEST |
| `…/hindi-serials-firestick-uae-legal` | indexed | 2026-09-21 | |
| `…/telugu-live-tv-dubai-apartment-no-dish` | **unknown – not on Google** | — | ⬅ REQUEST (regressed from discovered) |
| `…/indonesian-tv-qatar-legal` | indexed | 2026-09-21 | |
| `…/free-legal-arabic-series-smart-tv-gulf` | **unknown – not on Google** | — | ⬅ REQUEST (regressed) |
| `…/sen-cal-kapimi-english-subtitles-legal` | indexed | 2026-09-21 | |
| `…/shahid-vs-netflix-turkish-gulf` | indexed | 2026-09-21 | |
| `…/jiohotstar-vpn-uae` | indexed | 2026-09-21 | |
| `…/yupptv-vs-zee5-hindi-ksa` | indexed | 2026-09-21 | |
| `…/manoramamax-vs-saina-play-gulf` | indexed | 2026-09-21 | |
| `…/malayalam-ott-smart-tv-bahrain` | indexed | 2026-09-21 | |
| `…/sun-nxt-saudi-without-indian-number` | **unknown – not on Google** | — | ⬅ REQUEST (regressed) |
| `…/aha-uae-app-store` | indexed | 2026-09-23 | |

**Group C — requested 22–23 Sep:**

| URL | state | last crawl | notes |
|---|---|---|---|
| `…/punjabi-movies-english-subtitles-uae` | **discovered – not indexed** | — | ⬅ REQUEST |
| `…/hoichoi-vs-zee5-bengali-gulf` | indexed | 2026-09-23 | |
| `…/geo-dramas-bahrain-legal` | indexed | 2026-09-23 | |
| `…/channel-i-ntv-dubai-legal` | indexed | 2026-09-23 | |
| `…/sinhala-teledrama-gulf` | indexed | 2026-09-23 | |
| `…/syrian-lebanese-series-gulf-legal` | indexed | 2026-09-23 | |
| `…/egyptian-films-gulf-legal` | indexed | 2026-09-23 | |
| `…/bollywood-classics-free` | **discovered – not indexed** | — | ⬅ REQUEST |
| `…/malayalam-movies-gulf` | **discovered – not indexed** | — | ⬅ REQUEST |
| `…/arabic-series-guide` | indexed | 2026-09-23 | |

**`/guides/cut-the-pirate-box`** — indexed, crawled **2026-09-27** (founder's request landed same-day) ✅

**Counts**

- **publisher indexed: 23/30**
- **requested this session: 0** (agent holds no GSC session — Requests are founder-only)
- **still needs founder click: 7** → `FOUNDERS_CLICK_LIST.md` (B then C order, misses marked)
- **quota hit? no** — no agent requests were attempted

## HYGIENE

- **soft 404 sample (58): SKIPPED.** Requires the logged-in "Why pages aren't indexed" rows. Not fabricated.
  Founder can paste up to 15 example URLs and I will fetch + classify each within minutes.
- **duplicate-without-canonical sample (77): SKIPPED** for the same reason. What I *could* verify publicly,
  and did — the mechanics look clean:
  | probe | result | class |
  |---|---|---|
  | `/guides/arabic-series-guide/` (trailing slash) | **308** → clean URL | SLASH_DUP auto-resolved |
  | `/Guides` (uppercase) | **404** | not a duplicate |
  | guide + `?utm_source=x` | 200, canonical present | FINE (Google dedupes) |
  | `/browse?page=2` | 200 | QUERY_DUP (canonical self-referential; GSC lag) |
  | `/turkish` `/hindi` (old hubs) | **308** → `/vod?shelf=turkish` / `hindi` | HUB_GHOST already redirected |
  | `https://whisco.tv/guides/…` (apex) | **308** → `https://www.whisco.tv/guides/…` | APEX_LEAK auto-resolved |
  | canonical tag on guide | `<link rel="canonical" href="https://www.whisco.tv/guides/arabic-series-guide"/>` ✅ | |
  | canonical tag on `/` | `<link rel="canonical" href="https://www.whisco.tv"/>` ✅ | |
- **Not found (404) ×3: SKIPPED** — the three URLs are only listed inside the GSC UI. No guessing.
- **robots.txt live check** ✅ exactly as expected:
  `User-Agent: *` · `Allow: /` · `Disallow: /admin` · `/api/` · `/account` · `/profiles` · `/watchlist` ·
  `Sitemap: https://www.whisco.tv/sitemap.xml`. The single blocked URL in GSC is inside that set — ignore.

## PERFORMANCE

**28 days (2026-08-30 → 2026-09-26, Web):** **438 clicks · 1,270 impressions · CTR 34.5% · avg pos 23.1**
**90 days, cross-check against your screenshot:** 469 clicks · 1,650 impressions · 28.4% · pos 28.5 ✅ matches

**Brand is the whole story:** `whisco tv` 374 c / 456 i @ pos **1.2** · `whisco` 6 c / 31 i · `whiscotv` 2 c / 3 i
→ **87% of all clicks are branded.**

**Non-brand: 150 queries, 3 clicks, 225 impressions total** (0.02 clicks/query). Every non-brand query is a
title/episode query landing on catalogue pages we do **not** push — e.g. `zalim istanbul streaming` (1 c),
`bareilly ke bachchan watch online` (1 c), `duy beni 1 bölüm izle`, `eşref rüya ep 1`, `watch reefer madness`,
`مسلسل مرحبا دولة`, `فيرسات كي جانغ` — plus documentary/film long tail. Full list in the API pull.
**None of the guides' target queries appear at all.** That is the honest picture: indexes are filling, the
guide demand is not being captured yet.

**Pages tab (28d), top:** `/` 427 c / 568 i @1.7 · **`/about` 5 c / 246 i @2.3 ✅ present** · `/terms` 1 c/56 i ·
`/live` 1 c/55 i · `/login` 1 c/37 i · `/browse` 0 c/13 i · `/live/cmsor42mg0…` 1 c/17 i ·
`/watch/movie/cmsvrcjd70…` 1 c/46 i · `/title/zalim-istanbul` 1 c/3 i.

**`/guides/*` on the Pages tab: 2 of 28** — `/guides/arabic-series-guide` (2 i) and
`/guides/egyptian-films-gulf-legal` (2 i). Both at position ≤3. Guide pages are indexed but essentially not
yet surfacing. No action taken, no titles requested.

Observation, no action: `/login` and `/watch/*` URLs draw impressions from brand-ish navigational intent —
they are not in the sitemap and are not in any push list.

## CODE

- **PRs opened: none.**
- **PRs not opened, and why:** nothing needed one.
  1. Sitemap completeness — all 27 slugs + hub + 8 core pages present in the live file → no `sitemap.ts` ticket.
  2. robots.txt — exactly the intended rule set, sitemap line correct.
  3. Apex → www chain — `http://whisco.tv` 308 → `https://whisco.tv` 308 → `https://www.whisco.tv` (200);
     apex guide paths 308 straight to www; old `/turkish` `/hindi` hubs 308 to `/vod?shelf=…`; trailing slash
     308 to the clean URL; canonicals self-referential on both `/` and a guide. Redirect/canonical hygiene is
     already correct, so no redirect PR is justified.
  4. Jobs 3, 4 and 5 sample URLs live only inside the GSC UI — no session, therefore no safe small fix to write.

## ONE LINE

AdSense still wait. Desk looks at GSC, not at the AdSense button.

## LOCKED CONFIRMATION

No Play. No iOS. No noindex lift. No `/title/*` Request. No Validate fix. No second sitemap.
`cut-the-pirate-box` not re-clicked. No new guide. No synopsis rewrite. Agent clicks: **0**.
