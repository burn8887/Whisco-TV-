# WHISCO TV — GEO-EXPOSURE & HEALTH-SWEEP FINDING
**Found:** 2026-09-14 (Monday), by the incoming engineering agent during the §10 first-session checklist.
**Status:** OPEN — awaiting founder go/no-go on the two fixes below.
**Severity:** Medium. Not an outage. Viewer-facing content defect on a small set + an ops-visibility blind spot.
**Evidence:** all figures below are measured live on 2026-09-14 (ASC API, GSC API, production DB, live YouTube probe, live site fetch). Nothing invented; estimates are tagged [EST].

---

## 1. WHAT'S WRONG (headline)

**Titles that are geo-blocked for the Gulf are live and playable-looking on the site — including the exact three titles from the 2026 Leyla incident.**

A GCC viewer who opens them clicks Play and gets YouTube's "Video unavailable in your country".

Verified by probing YouTube's own availability list (the same `availableCountries` field the health cron uses) from the sandbox:

| Title | DB `isActive` | DB `lastStatus` | Live YouTube verdict | GCC countries in allow-list |
|---|---|---|---|---|
| Leyla (`/title/leyla`) | **true** | `ok` | **GEO-BLOCKED** | 0 of 6 (223 countries listed) |
| Sahipsizler (`/title/sahipsizler`) | **true** | `ok` | **GEO-BLOCKED** | 0 of 6 (231 countries listed) |
| Kızılcık Şerbeti (`/title/kizilcik-serbeti`) | **true** | `ok` | **GEO-BLOCKED** | 0 of 6 (227 countries listed) |
| Security (Free Movies & TV) | **true** | `ok` | **GEO-BLOCKED** | found by random sample |

**Site-level proof (not just DB):**
- `/title/leyla` → HTTP 200, lists 76 clickable episodes.
- `/watch/episode/cmsvwo3bj01hf4q2rt16xm6f8` → HTTP 200, serves `youtube.com/embed/CZAXD7VwYVk` — a video verified GCC-blocked.
- All three titles are **in `sitemap.xml`** (so Google can surface them to Gulf users).

**Scale:** random catalog-wide sample of 27 active titles → 1 GCC-blocked (3.7% ±7.1pp, n=27 — wide). A 24-title targeted sample across Turkish Dizi / Hindi Cinema / Pakistani Dramas found 0 additional. Honest read: **at least 4 confirmed titles; true count unknown, plausibly in the tens-to-low-hundreds [EST]**. This is NOT a return of the original 2,414-title problem — the catalog is largely clean — but it is the same failure mode, on the same titles.

## 2. ROOT CAUSES

**(a) The `geo` status no longer exists as a state.** The 2026-08 fix (`79029b6`) hid 2,414 GCC-blocked titles and made the health checker "auto-restore any hidden title that is actually watchable in the Gulf". But the current `checkYouTubeVideo()` returns only `ok | invalid | unknown` — a GCC block is returned as **`invalid`**, and nothing in the live code path ever writes `lastStatus = "geo"`. Live DB confirms: **0 rows** with a `geo*` status; only 60 inactive titles total remain.

**(b) The ops KPI is therefore permanently blind.** `maintenance/route.ts` still reports `geoHidden: prisma.title.count({ where: { lastStatus: "geo" } })` — which can only ever print `0`. The 2026-09-13 maintenance run log does exactly that: `"geoHidden": 0`. That number reads "healthy" but means "not measured". This is precisely the "KILL OPTIMISM / NOT IN DATA beats guessing" failure the doctrines warn about — a metric that cannot fail is worse than no metric.

**(c) Auto-restore flips blocked titles back on.** In `check-vod`, an `ok` verdict on an inactive title writes `isActive: true, failCount: 0, lastStatus: "ok"`. Any title whose sampled episodes happened to be GCC-available at that moment comes back — and if availability later flips (or if only the sampled episodes were available while others are blocked), the title stays live until the sweep revisits it. Leyla/Sahipsizler were last checked 2026-09-04–06.

**(d) The sweep is too slow to self-heal.** `BATCH_SIZE = 250`, four runs/day (GitHub 0/6/12/18 UTC + Vercel 03:00 → ~1,000/day). Full sweep of 16,859 active titles ≈ **17 days**. Measured now: **8,495 active titles unchecked for more than 7 days**; oldest check is 2026-08-31. So a wrong verdict can sit live for ~2 weeks. `FAIL_THRESHOLD = 2` means a re-flagged title needs two more sweep passes — up to ~5 weeks — to auto-hide.

## 3. RECOMMENDED FIX

**Fix 1 — immediate (data only, allowed under the Sep 16–19 freeze):**
Hide the 4 confirmed GCC-blocked titles server-side (`isActive: false, lastStatus: "geo"`), exactly the escalation-ladder action already pre-approved for these titles. Instant, reversible, no deploy. Optionally extend to a full geo re-audit of the 8,495 stalest titles, run from the sandbox (no Vercel 300s limit).

**Fix 2 — code (stage for the Sep 20 deploy window):**
1. `checkYouTubeVideo()`: return a distinct **`geo`** status when `availableCountries` has no GCC hit, instead of `invalid`.
2. `check-vod` write path: persist `lastStatus: "geo"` + `isActive: false`, no `failCount` increment (the `startsWith("geo")` guard already exists for this — it just never triggers today).
3. `maintenance`: report a **real** split (ok / invalid / geo / unknown) and raise the alert if `geo + invalid` moves sharply.
4. Sweep budget: raise `BATCH_SIZE` (or add a 5th/6th daily run) to bring the full sweep under ~7 days.
5. Partial-availability: for multi-episode series, treat "some episodes blocked, some available" explicitly rather than letting 2-of-3 samples return `ok` and re-expose a partly-dead series.

**Do NOT:** batch-hide on a single probe. Rate-limiting makes YouTube return consent stubs (`unknown`), and a bulk write on `unknown` would hide thousands of good titles. Verify per title before writing.

## 4. WHY THIS WASN'T CAUGHT EARLIER

The `geo` mechanism was believed to be operating (the takeover brief still records "~2,300 geo-hidden"). It is not, and hasn't been since the status string stopped being written. Two independent metrics were available to catch it — `geoHidden` in the weekly maintenance log and the `lastStatus` distribution — but the first is hard-wired to 0 and the second wasn't being eyeballed. **Standing recommendation: the agent's daily watch list should include a `lastStatus` distribution check, not just pass/fail.**

---

*Filed by the engineering agent, 2026-09-14. Companion entry appended to WHISCO_TV_PROJECT_HANDOVER.md.*
