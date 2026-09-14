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

---

# ADDENDUM — AUDIT EXECUTED 2026-09-14 (founder Option 1)

## What was done

**1. Hidden, verified, freeze-safe (5 titles total):**

| Slug | Title | Channel | How verified |
|---|---|---|---|
| `leyla` | Leyla | Leyla: Hayat...Aşk...Adalet... | 2 probes BLOCKED |
| `sahipsizler` | Sahipsizler | (series channel) | 2 probes BLOCKED |
| `kizilcik-serbeti` | Kızılcık Şerbeti | Kızılcık Şerbeti | 2 probes BLOCKED |
| `security` | Security | Shout! Studios | 3 probes BLOCKED |
| `carpinti` | Çarpıntı (Heartbeat) | Çarpıntı Dizisi | channel double-probe + per-title probe |

All written as `isActive=false, lastStatus="geo", failCount=0`. DB now: **5 geo rows, 65 inactive titles.**

Note on `carpinti`: it was added 2026-08-31 as one of the new Turkish dizi and recorded as "all 6 GCC countries geo-verified". It is GCC-blocked now. **Geo availability changes over time** — which is the whole argument for continuous re-checking, not a one-off audit.

**2. Method found, then corrected twice (recorded so nobody repeats it):**

- A per-title brute force over all ~8,400 stale titles **cannot work**. YouTube rate-limits the watch page (HTTP 429) after roughly 340 rapid fetches from one IP. Observed independently from the sandbox *and* from a GitHub Actions runner. The first sandbox attempt aborted at 549 ok / 651 unknown; a GitHub run aborted at 354 titles.
- **oEmbed is a different service and is NOT rate-limited** (8,378 titles -> 110 channels in ~30 seconds). Channel-level narrowing turns ~8,400 probes into ~110.
- **But a channel verdict cannot certify a channel's titles.** "Shout! Studios" (428 titles) probes *ok* at channel level, while its title `security` is genuinely GCC-blocked. **Geo-restriction is applied per video, not per uploader.** So the channel pass is a targeting filter only — every write still required per-title verification.
- A 28-title targeted sample across Turkish Dizi / Hindi Cinema / Pakistani Dramas found 0 additional blocked titles. Cumulative: ~990 titles directly probed today with 0 blocked among them, against 1 blocked in a 27-title random sample. **True catalog-wide count remains UNDETERMINED [EST]** — the honest read is "low base rate, with per-video exceptions that a channel-level scan cannot rule out."

**3. Dead videos found (16) — reported, NOT hidden (out of the approved scope; liveness is the sweep's job):**

The oEmbed liveness step surfaced 16 titles whose video is gone or non-embeddable (oEmbed 401/403/404). 15 are DW Documentary titles (e.g. `the-worlds-oldest-virus-research-lab`, `war-in-congo-trapped-in-a-spiral-of-violence`, `beirut-explosion-2020-the-unsolved-catastrophe`, `91-a-film-about-guns-in-america-sandy-hook`) plus one Arabic title (`ar-d3dce2c487` :: وراء الشمس). These are broken for viewers today and carry the *same* reviewer-risk as a geo-block. They were left in the stale queue deliberately (their `lastCheckedAt` was not refreshed), so the production sweep reaches them early and hides them properly after its 2-failure threshold.

## The decisive fix is the code change, not the audit

A bespoke audit cannot solve this at production pace. The production VOD sweep already probes GCC availability **per title** at a cadence YouTube tolerates (250/run, 5 runs/day, no 429s in months). It was simply throwing the answer away — recording a GCC block as `invalid` and never writing `geo`. Branch `geo-health-fix` (`48afa66`) fixes the writer, the KPI and the sweep budget:

- `checkYouTubeVideo()` returns a real **`geo`** status; series get `geo` (all samples blocked) or `geo-partial` (mixed, stays visible + flagged)
- write path hides on `geo` immediately (no FAIL_THRESHOLD wait — a licence block is not a flaky stream) and restores only after `confirmGeoAvailable()` second-opinion probe
- `maintenance` reports a real status split (`geoFullyHidden`, `geoPartialVisible`, `statusSplit`) and raises alarms, instead of a KPI hardwired to 0
- `BATCH_SIZE` 250 -> 700, bringing a full catalog pass under ~5 days

**Once deployed, the sweep becomes the continuous per-title geo audit.** Recommended deployment: a cron-route-only change (no page, no UI, no site structure), so it sits outside the freeze's intent and would complete a full pass inside the AdSense window (Sep 17-19).

## Still open

- `geo-partial` titles need a per-episode decision; the schema cannot express "this episode is blocked" yet. Flagged, not hidden.
- The 16 dead videos (above) need a founder decision on whether to hide them now rather than wait for the sweep.

## VERIFICATION (2026-09-14, post-fix)

All five titles confirmed delisted from the live site — each `/title/<slug>` now returns **HTTP 404** (they returned 200 while the 15-minute page cache held): `leyla`, `sahipsizler`, `kizilcik-serbeti`, `security`, `carpinti`. Catalog: active titles 16,859 -> 16,854. `/api/health` green, no warnings.

The sitemap still lists 4 of the 5 until its hourly revalidation fires, after which it drops them. No action needed.

---

# ADDENDUM 2 — FOUNDER DECISIONS EXECUTED 2026-09-14 (evening)

## (a) geo-health-fix DEPLOYED
Merged to `main` (`623182a`), Vercel deploy **READY** (commit `c6b5eba`).

**First three live sweep runs** (manually triggered against production; these are real runs, not a simulation):

| Run | checked | ok | invalid | unknown | **geo** | geo-partial | restored | newlyHidden | totalInactive |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 231 | 181 | 16 | 1 | **33** | 0 | 4 | 0 | 77 |
| 2 | 177 | 177 | 0 | 0 | **0** | 0 | 0 | 0 | 77 |
| 3 | 179 | 178 | 0 | 1 | **0** | 0 | 0 | 0 | 77 |

**No over-hiding.** Runs 2 and 3 were entirely clean. Run 1's 33 `geo` classifications are explained below — none of them introduced viewer exposure, verified by an explicit check that **zero ACTIVE titles carry a geo status** (`active + geo = 0`, `active + geo-partial = 0`).

**What run 1 actually proved (the most valuable result of the day):** the 33 geo titles were **already hidden as `invalid`** by the old code — which is the original bug in action. `invalid` fell 122 → 90 as those rows were correctly reclassified to `geo`. They were: **Free Movies & TV 22, Crime & Mystery 9** (Forensic Files, Untold Stories of the ER — brand catalogs, exactly the FilmRise/Shout pattern from the August audit), **Documentaries 1**, **Turkish Dizi 1** (Çarpıntı). Two consequences, both good:
1. The catalogue state is now **honest** — a licence block is recorded as a licence block, not as a dead stream.
2. Those 33 titles are now protected by the new **confirm-before-restore** guard. Previously a single flaky `ok` reading would have restored them to the site as "working", which is precisely how Leyla came back.

**Correction to my own earlier claim — the sweep is NOT under 5 days.** Run 1 completed **231 of 700** requested titles; runs 2 and 3 completed **177 and 179 of 700**. The **230-second time budget is the bottleneck, not the batch size**, so raising `BATCH_SIZE` bought nothing and wasted Neon egress (rows fetched with their episodes, never reached). Reverted to **250** with the measurements recorded in the code. Real sweep rate: **~1,150 titles/day → a full catalog pass takes ~15 days**, not the ~12 days the old code comment claimed and not the <5 days I previously stated. [Measured, not estimated.]
**The actual speed-up (designed, not built):** skip the per-episode watch-page probe for titles whose *channel* verdict is already known within the same run — whole brand catalogues share one geo verdict, so a run of 250 titles spanning ~50 channels needs ~50 watch-page probes instead of 250. Proposed for the Sep 20 sprint.

## (b) 16 dead videos HIDDEN — founder-approved scope extension
Each was re-verified with a **fresh oEmbed probe immediately before the write** (not on the earlier audit reading). All 16 confirmed dead (oEmbed 401/403/404) and written as `isActive=false, lastStatus="invalid"` — **kept honest as `invalid`, not `geo`**, per instruction. They were left un-refreshed in the rotation before this, which is why run 1 independently re-confirmed exactly **16 invalid** — an unplanned cross-validation of the write.

**Slugs (16):**
```
the-worlds-oldest-virus-research-lab
war-in-congo-trapped-in-a-spiral-of-violence
an-expensive-global-climate-experiment
cambodia-the-forgotten-temple-of-banteay-chhmar
vietnam-between-communism-and-capitalism
power-failure-in-germany-horror-scenario-or-genuine-possibility
on-the-trail-of-a-gigantic-nazi-raid
beirut-explosion-2020-the-unsolved-catastrophe
bullying-in-spain-s-schools
the-milwaukee-cannibal-my-friend-dahmer
plastic-waste-deforestation-and-floods-indonesias-environmental-disasters
israel-s-era-of-military-rule
endangered-amazon-why-the-earth-s-lungs-are-dying
91-a-film-about-guns-in-america-sandy-hook
mothers-in-the-boardroom-combining-children-and-career
ar-d3dce2c487   (وراء الشمس)
```
**One caught by hand, worth recording:** `ar-d3dce2c487` is a **SERIES** with `streamUrl: null` — its video IDs live on episodes. A naive `streamUrl`-only check skips it (my first pass did). It was verified properly: **3 of 30 episodes sampled, all 403 dead, none live** → hidden. Any future script touching titles must resolve video IDs from episodes for SERIES rows.

## (c) canonical-host-fix DEPLOYED
Merged to `main` (`c6b5eba`). Verified live:
- `/new` and `/guides/bollywood-classics-free` canonicals → **`https://www.whisco.tv/...`**
- sitemap → **2,718 URLs, all www**
- robots.txt `Sitemap:` → **www**
- `/title/kurulus-osman` canonical **and** JSON-LD `url` → **www**

Post-deploy actions completed:
- **GSC sitemap re-submitted** — HTTP 204; `lastSubmitted` now **2026-09-14T01:25:25Z**, 0 errors, 0 warnings.
- **IndexNow ping** — HTTP 200 accepted, 7 URLs (the 2 stuck pages plus the homepage, /guides and the 3 indexed guides).
- Remaining: **founder's manual Request Indexing clicks** on the 2 stuck URLs (Console-only action).

## Catalog state after all writes (measured 2026-09-14)
```
status split   ok 16032 | unknown 757 | invalid 90 | geo 33 | duplicate 3
active titles  16,838     inactive 81
active + geo status: 0    (no viewer-facing exposure)
```

## (d) Play — API read complete, two Console-only checks handed to the founder
- Closed track **`whisco.tv test `** holds **versionCode 6**, status *completed*; bundles on file: vc5, vc6.
- Tester list exists **only** on that track: Google Group **`testers-community@googlegroups.com`**. Production/beta/alpha tracks are empty.
- **The Play API cannot report the 14-day opt-in clock or the target-API banner** — both are Console-only. Verified by probing the bundles endpoints: they return only `versionCode` + `sha1` + `sha256`.
- **Target API 36: expected compliant.** Expo's compatibility table lists **SDK 57 → compileSdkVersion 36 / targetSdkVersion 36**, and whisco-mobile is Expo `~57.0.15`. The Console banner remains the authoritative check, so the walkthrough requires it before applying. (Honest limit: the target SDK of an already-uploaded bundle is not readable via API.)
- Full click-by-click walkthrough with copy-ready answers (all within Google's ~300-character limit, verified programmatically) filed at **`docs/business/Whisco_TV_Play_Production_Application.md`**.

## Standing process change (founder instruction)
**`lastStatus` distribution check added permanently to the daily watch list.** The KPI-that-cannot-fail failure mode is now twice-proven (the hardwired `geoHidden: 0`, and the `invalid`/`geo` conflation that hid 33 blocked titles behind a meaningless label). Daily check = the status-split line above, watched for movement in `geo` / `invalid` / `unknown`, not just pass/fail.

---

# ADDENDUM 3 — ⚠️ REGRESSION FOUND AND FIXED THE SAME SESSION (2026-09-14, 01:1x–01:35)

## What went wrong
**Sweep run #1 restored three GCC-blocked titles to the live site.** Leyla, Sahipsizler and Kızılcık Şerbeti were written back to `isActive=true, lastStatus="ok"` at **01:12** by the very code that was supposed to protect them.

**My earlier claim in Addendum 2 — that those titles "are now protected by the new confirm-before-restore guard" — was WRONG.** The guard existed, but it was defeated by the bug it was meant to guard against, because both it and the main path shared the same faulty assumption.

## Root cause (this is the important one)
**YouTube's watch page only carries the `availableCountries` list when the video is NOT playable from the requesting region.** If the requester's region can play it, the page contains no list at all.

The code did this:
```ts
if (!m) return "ok"; // no restriction list → worldwide
```
So a list-less page — which means *"playable where I'm asking from"*, and says **nothing** about the Gulf — was read as *"available in the GCC"*. The sweep therefore marked the three titles `ok` and restored them.

**Proven empirically, not inferred.** A targeted verify run from GitHub probed 4 titles × 3 episodes each:

| Title | Known GCC status | Availability list on the page |
|---|---|---|
| Leyla | blocked | **absent** |
| Sahipsizler | blocked | **absent** |
| Kızılcık Şerbeti | blocked | **absent** |
| **Kuruluş Osman (control)** | **available** | **absent** |

The control has no list either. So list-absence is **environmental, not a property of the video** — it cannot be used as evidence of anything. Twelve probes, zero lists, including the title we know works in the Gulf.

## The fix (`1975f5c`, deployed and verified)
Restore **only on positive evidence**: a list that **exists** AND **contains at least one GCC country**. Everything else means "could not verify" → the title **stays hidden**.

- explicit blocked reading → `lastStatus: "geo"`
- unreadable / list-less page → `lastStatus: "unknown"` and **stays hidden** (labelled honestly — it is not a proven geo block)
- applied to **every inactive YouTube-backed title**, not just `geo`-status ones, because the old code mislabelled geo-blocked titles as `invalid` and this same path would have restored them

**Accepted trade-off:** a false negative. A title whose block is genuinely lifted, but whose availability we cannot read at that moment, stays hidden until an audit verifies it. That is the correct side to fail on — a hidden title is invisible, an exposed one is a licensing and review risk.

**Verification (run #4, live code):** `checked 250/250, ok 242, invalid 1, unknown 0, geo 7, restored 0, newlyHidden 0, totalInactive 80`. **`restored: 0`** where the buggy run had restored 4. `active + geo = 0` holds. The three titles remain `isActive=false, lastStatus=geo`.

## The three titles
Re-hidden at 01:29 on the basis of **earlier same-day list-backed evidence** (each episode probed with the list present — 223/227/231 countries — and **zero** GCC countries in it), which is exactly the explicit-blocked criterion, and which matches the project's own August audit that classified all three as GCC-blocked. A fresh confirmation probe was not possible at that moment: the sandbox IP was HTTP-429 blocked and the GitHub vantage cannot see a list for these titles at all.

## Structural limitation now on the record
**A vantage point can only see a block if that vantage is itself blocked.** The production sweep runs from a US region, so it structurally **cannot detect Gulf-only blocks** (titles available in the US but not in the GCC — which is exactly what Leyla, Kızılcık Şerbeti and Sahipsizler are). It *can* detect titles blocked in both places (most of the FilmRise/Shout catalogues), which is why the August audit caught 2,414 titles.

Consequences and proposals:
- The production sweep is therefore a **guard against regression, not a detector**. The strict no-restore rule makes it safe in that role.
- Detection must come from a vantage where the target titles are blocked. The **sandbox vantage did see all three** Gulf-only blocks, so audits from there work — but the IP gets HTTP-429 limited after a few hundred probes, so runs must be chunked with pauses.
- **Paid option for the founder to consider:** a small GCC-region proxy or a GCC VPS (roughly $5–10/mo [EST]) would let the audit ask from inside the market we actually serve, turning the sweep into a genuine Gulf-side detector. That is a recurring spend, so it needs a decision, not a default.
- A better signal may exist — YouTube's InnerTube player endpoint accepts a region parameter — but the unauthenticated call **returned UNPLAYABLE for every title tested, including the known-good control**, so it needs visitor-data/PO-token handling to be usable. Tested, not adopted; recorded so the dead end is not re-explored blindly.

## Throughput correction (again — measured)
| Run | checked | wall time | geo | restored |
|---|---|---|---|---|
| 1 | 231 (of 700) | 251s | 33 | 4 |
| 2 | 177 (of 700) | 244s | 0 | 0 |
| 3 | 179 (of 700) | 247s | 0 | 0 |
| **4** | **250 (of 250)** | **48s** | 7 | **0** |

Run 4 completed its entire batch in **48 seconds**, against 244–251s for the three before it. So the sweep rate is **highly variable (roughly 180–250 titles per run depending on the title mix)** and the earlier "the time budget is the hard bottleneck" conclusion was too strong: with `BATCH_SIZE` back at 250 the batch now finishes with room to spare. The honest statement is the range, and the real lever remains the channel-verdict cache (one geo verdict reused across a brand's whole catalogue).

## Catalogue state (measured 2026-09-14 ~01:35)
```
ok 16,037 | unknown 754 | geo 43 | invalid 82 | duplicate 3
active 16,839 | inactive 80 | active + geo = 0
```

## SECOND BUG, same session — hidden titles kept serving their pages (`0d935e6`)
While verifying the fix, three titles sat at `isActive=false` in the database **and still returned full HTTP 200 pages** — title, metadata, canonical, player markup — and were still listed in the sitemap (2,726 URLs).

Not a cache artifact and not a database mismatch. Measured cause:
- `/title/[slug]` is `force-dynamic`, so the page renders per request, **but its data comes from `unstable_cache` with a 15-minute window**.
- The cron revalidated `/vod`, `/browse` and `/` after a run — **never the individual title paths**.
- So a title that was visible when its page was last rendered keeps serving that snapshot after being hidden again.

Proof it was slug-specific and not global: three geo-hidden titles that were **never reactivated** returned **404**, and the three that had been briefly restored returned **200**, from the same code and the same database.

**Fix:** every run now revalidates `/title/[slug]` for **every title it leaves hidden** (not only for titles whose visibility flipped during that run — the stale entries predate the fix), plus any title it restores, plus `/new` and `/sitemap.xml`. The run report now includes a `revalidated` count.

**Verified after deploy (run #5):** the three slugs were queued to the front of the sweep, re-checked, and revalidated — `revalidated: 3`, `restored: 0`.

| Check | Before | After |
|---|---|---|
| `/title/leyla` | 200 (stale) | **404** |
| `/title/sahipsizler` | 200 (stale) | **404** |
| `/title/kizilcik-serbeti` | 200 (stale) | **404** |
| Sitemap | 2,726 URLs, 3 hidden titles listed | **2,723 URLs, 0 hidden titles listed** |
| Control `/title/kurulus-osman` | 200 | 200 (unchanged) |
| 16 dead videos | 404 | 404 (unchanged) |

**Note on labels:** re-checking from the US vantage returns "no list" (unprovable), so those three now read `lastStatus: "unknown"` rather than `"geo"`. Both keep the title hidden; `unknown` is the honest label for what the production sweep can see from where it runs. That is the structural limitation described above, not a change in the licensing position.

## Watch-list hardening (proposed)
`active + geo == 0` cannot catch a restore, because a restore rewrites the status to `ok`. Add to the daily check:
1. **Known-hidden slug guard** — a fixed list of slugs that must stay `isActive=false` and return 404.
2. **Sitemap count guard** — the sitemap URL count must not rise without a corresponding catalogue change.
3. **`restored` must be 0** in every run unless a human has verified a title is genuinely back.

## ADDENDUM 4 — the bug had fired BEFORE, and one restore is still unattributed (2026-09-14)

### The same failure mode fired the previous evening
Diffing the tracked catalogue backup (`prisma/backup_titles_flat.json` — the only snapshot of a previous hidden state we hold, 44 titles marked hidden) against live state found **4 titles that the backup records as hidden and that are live again right now**:

| Slug | Name | Restored | Status now |
|---|---|---|---|
| `maniac-cop-2` | Maniac Cop 2 | 2026-09-13 20:43 | active, `ok` |
| `maniac-cop-iii-badge-of-silence` | Maniac Cop III: Badge of Silence | 2026-09-13 20:43 | active, `ok` |
| `the-dick-van-dyke-show-season-5-episode-26-…` | The Dick Van Dyke Show S5E26 | 2026-09-13 20:43 | active, `ok` |
| `the-man-from-elysian-fields` | The Man From Elysian Fields | 2026-09-13 20:43 | active, `ok` |

All four were re-activated at the same minute by a scheduled sweep, hours before today's runs — i.e. **the same ambiguous list-absent reading that re-exposed the three Turkish titles. This was not a single incident.** Whether these four are genuinely GCC-available today is **UNKNOWN**: they were hidden by an earlier audit, and we cannot positively re-verify them from any vantage we currently have (the sandbox IP is rate-limited; the US vantage cannot produce a list for these titles). They are viewer-facing in the meantime. This is logged as an open verification item, not as a claim in either direction.

### Run #1's fourth restore is still unattributed
Run #1 reported `restored: 4`. Three are the Turkish titles (identified, re-hidden, verified 404). The fourth is **not identifiable from any evidence we hold**:
- all 16 dead videos: still hidden (verified individually) ✗
- the 20 titles hidden before today and untouched by today's runs: all still hidden ✗
- the 3 duplicate and 17 invalid pre-existing hidden rows: all still hidden ✗
- run #1's own composition is fully accounted for (231 checked = 178 still active/ok + 16 invalid + 33 geo + 3 re-stamped + 1 unknown)

So one title that was inactive before 01:12 is active with `ok` now, and no snapshot of the pre-run hidden set was ever taken, so it cannot be named retroactively. **The lesson is in the tooling, not the number:** the run report gave a count and nothing else, which is exactly the "number that cannot fail" pattern again — a restore should never be a silent counter increment. `restored` is now covered by the strict guard (every inactive YouTube title requires list-backed proof), the run report exposes the count, and the watch list requires it to be **0**.

### Open item for the founder decision
Verifying these four (and continuously detecting Gulf-only blocks) needs a vantage **inside the GCC** — the production sweep runs from a US region and structurally cannot see a block it is not itself subject to. A small GCC proxy or VPS is roughly **$5–10/mo [EST]**; it needs a decision, not a default.
