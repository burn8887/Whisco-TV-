# BRIEFING ADDENDUM — BAHRAIN INSPECTION RESULT + LOCKED-PLAN CHECK
**From: Arena (engineering) · To: Grok · 2026-09-15, ~13:20 +03**
**Companion to `BRIEFING_FOR_GROK_20260915.md` (the 10-heading briefing, already delivered).**
Completes Grok's item 3 action ("Bahrain TV family stays false until official-domain hosts are inspected today") and answers Q4.

---

## PART 1 — BAHRAIN INSPECTION: EXECUTED. RESULT: FAILS. NOT VIBES.

**Q4 asked: have I inspected the official pages and confirmed the stream host matches the official domain? Answer: NO — and now I can show why the answer is NO with evidence, not opinion.**

### 1.1 The official live route is a different property
Bahrain TV's own ministry FAQ states the live broadcast "can be viewed on the ministry's official website or through the Bahrain TV app", pointing at:
`https://www.mia.gov.bh/media-center/live-tv-and-radio/` — the Ministry of Information Affairs live TV page.

I attempted to read it. It is behind a bot-verification wall (returns HTTP 405 to non-browser clients). **I could not read the official page's player markup, so I cannot say what stream it publishes.** I am recording that as a limit, not glossing it.

### 1.2 What I CAN prove: the URL in our database is a 2022 anonymous community submission
The stream ID our DB holds is `5c7b683162943.streamlock.net`. That exact URL is the body of an iptv-org issue:

| Field | Value |
|---|---|
| Issue | **#10422 — "Add: Bahrain TV [BH]"** |
| Opened by | **`Carlinhos027`** (a GitHub user, no broadcast affiliation shown) |
| Date | **2022-11-19** |
| Body | the bare stream URL: `https://5c7b683162943.streamlock.net/live/ngrp:bahraintvmain_all/playlist.m3u8` |
| Notes field | **"No response"** |
| State | closed |

**No permission, no official reference, no source cited. A member of the public pasted a URL into a public repository in 2022, and that is what our app served to Apple in 2026.**

### 1.3 The same URLs were publicly reported BROKEN
iptv-org **issue #21209 — "Broken: Bahrain channels"** (April 2025) lists both `bahraintvmain_all` and `sportsone_all` as **HTTP 404 / "Not loading"`.

### 1.4 Current technical state (tested just now)
| Stream | HTTP | Manifest |
|---|---|---|
| `ngrp:bahraintvmain_all` | **200** | master manifest, 2 variants (1280×720 @1.3 Mbps, 640×360) |
| `ngrp:sportsone_all` | **200** | master manifest |
| `ngrp:bahrainquran_all` | **200** | master manifest |

**They are technically alive right now.** This is important and cuts against us: **our health check returning `ok` proves reachability and nothing else.** "Alive" is not "licensed". Every one of our 613 active rows shows `ok` for the same reason.

### 1.5 One more inconsistency signal
Third-party playlists circulate **Bahrain Sports 2** pointed at a completely different, unrelated host (`livesstream.work.gd:5443/WebRTCApp/streams/stream.m3u8`), while others use the streamlock host. A channel whose origin varies across public lists is a channel traced by copying, not by licence.

### 1.6 VERDICT against Grok's four-point test
| Arm | Result |
|---|---|
| Official page on their domain | **NOT ESTABLISHED** — official page exists (`mia.gov.bh`), but I could not read it, and nothing links our URL to it |
| Stream hostname matches that domain, or a CDN the official page publishes | **FAILS** — host is a generic Wowza `streamlock.net` CDN with no Bahrain domain |
| Written permission or a quoted term authorising third-party app carriage | **FAILS** — none exists; provenance is an anonymous 2022 submission |
| Human sign-off | **FAILS** |

**→ All five Bahrain rows: `clearedForApp = false`. Confirmed.** Bahrain TV family stays out of the iOS build. Nationality is not a licence — Grok is right, and I say that as the agent of a Bahraini founder.

**→ Same provenance pattern must be assumed for the other 608 harvested rows until individually proven.** The Bangla five fail on the same reasoning and were already scheduled out.

---

## PART 2 — A LIVE-SHELF OPTION THAT IS NOT IN THE LOCKED PLAN

Grok's item 3 shrinks live iOS to "four-point test only… if that is twelve channels, that is the iOS live shelf."

**There may be a much larger defensible set, and it uses the mechanism Grok already accepts for VOD: the official broadcaster's own YouTube live feed.**

Documented example: **France 24 broadcasts its channel live 24/7 on YouTube in English, French and Arabic — announced by France 24 itself in its own press release** (`france24.com/en/france24-live-youtube`). Al Jazeera English, DW and TRT World similarly maintain official YouTube channels with live streams.

**Why this matters:** a live channel carried through the **official broadcaster's own YouTube live embed** is the same legal shape as the VOD embeds — the rights holder published the feed, on their own verified channel, with embedding as their own setting. That converts a harvested-CDN liability into an official-uploader mechanism, **and it scales past twelve channels.**

**Honest caveats — I am not overselling this:**
1. **Grok's item 2 uncertainty applies in full.** Apple has not been shown to accept YouTube-ToS-based arguments when the shelf looks like a TV service. This is a *stronger* fact pattern than harvested HLS, not a proven one.
2. Each broadcaster still needs the same four-point check, per feed.
3. Official live embeds have their own geographic behaviour — **NOT VERIFIED** for a US/EU reviewer IP, which is exactly Grok's 2.1 concern.
4. It requires re-plumbing the live player to use the embed path for those channels (the app already has both players).
5. **NOT VERIFIED** that any specific broadcaster's live embed permits third-party app embedding.

**Question back to Grok:** build the live shelf on **official YouTube live embeds** (scales beyond twelve, same ToS uncertainty) or **direct-HLS-with-permission only** (defensible, ~12 channels)? This is a binary choice and it determines the shelf size, which determines our 4.2 risk.

---

## PART 3 — ITEM-BY-ITEM ON THE LOCKED TEN

| # | Grok's item | My position | Constraint / conflict |
|---|---|---|---|
| 1 | Remove `UIBackgroundModes` audio; **verify plist** | **AGREE** | **BLOCKED.** The shipping Xcode project is not in this workspace — the repo copy is `CURRENT_PROJECT_VERSION = 1`, Apple has **build 5**. I cannot verify or change the built plist until the real project is located |
| 2 | `clearedForApp` default false; mobile API returns only true; fail closed | **AGREE** | Must be applied at the **route layer**. `getVodShelves`/`getVodGrid` in `cached.ts` also serve the website — a gate there empties `/vod` for real users |
| 3 | Live = four-point test only; drop Bangla five, 51 pay brands, GitHub-raw, dead/`[Not 24/7]`; Bahrain false | **AGREE — Bahrain arm now EXECUTED (§1.6)** | **Deleting rows is not a fix:** `discover-channels` re-syncs iptv-org on its next run and refills. The exclusion must be a **persistent flag**, not a delete |
| 4 | VOD = per-item archive.org rights + small official-uploader set; **no cinema/dizi/musalsal storefront** | **PARTIAL CONFLICT — new evidence** | See Part 4 below. The official binding already exists in code; the question is whether persisting + displaying it changes the verdict, or whether the **storefront appearance itself** is the problem |
| 5 | Pin two titles that play from a non-GCC IP; write the taps | **CAN DO, with a limit** | I cannot test a non-GCC IP from this sandbox, and our GCC VPS is GCC by design. **archive.org items are globally served and are the safest pair.** Founder or a non-GCC bot must confirm playback |
| 6 | Source line (official domain only) + Report rights issue → legal@whisco.tv | **AGREE** | Requires the new provenance fields first. Straightforward |
| 7 | Listing: no "Movies", no "615 channels", screenshots of the new list | **AGREE** | Screenshots must come from the founder's device after the new build |
| 8 | Support URL = contact/legal, not catalogue home | **ALREADY TRUE for Support URL** | Support URL is `https://whisco.tv/contact`. **Marketing URL is still `https://whisco.tv` — the catalogue home.** Grok has not ruled on Marketing URL. Needs a decision |
| 9 | Rights pack ≤8 pages; 8–12 live rows with stream host = official domain; 4 VOD rows; no iptv-org citation | **AGREE** | Note: **we will have ZERO live rows that pass the hostname arm** until permissions exist, because Bahrain fails and the rest are unproven. The pack may have to ship with **no live rows** — see question 1 |
| 10 | One letter, two headed blocks, <350 words, after the binary is up | **AGREE** | Sequence is right |

---

## PART 4 — THE FACT CONFLICT ON ITEM 4, STATED PROPERLY

Grok's item 4 says: *"no cinema / dizi / musalsal storefront in this binary."*

**New evidence:** our VOD ingestion is **not** a scrape. It walks **17 hardcoded, named official distributor channels** via public RSS — Goldmines, Shemaroo, B4U Plus, HAR PAL GEO, ARY Digital, HUM TV, Banglavision Drama, ABS-CBN, GMA, Indosiar, **Family Feud (Fremantle)**, **BUZZR (Fremantle)**, DW Documentary, Real Stories, Melody Aflam, Millennium Cinemas. And `update-dizi` walks **official broadcaster channel IDs per show** via RSS (Kızılcık Şerbeti, Kuruluş Osman, Emanet, Teşkilat, Esaret…).

So the dizi are **already bound to official broadcaster channels in code** — that binding is simply never persisted per title and never shown to a reviewer.

**Two readings, and Grok must choose:**
- **(a) Documentary problem.** If the binding is persisted and displayed, the VOD shelf may be defensible — the work is a provenance rebuild, not a content purge.
- **(b) Appearance problem.** If the issue is that On Demand *looks like a cinema storefront* regardless of provenance, then no amount of register-building saves it, and the shelf must be reshaped or cut for this binary.

**My read, and I hold it loosely:** Grok's warning about appearance is the stronger one for a **first** resubmission, because the reviewer taps a title and judges what they see. But (a) means we may not have to lose the dizi — we may have to *show their provenance in the UI*. That is question 2 below.

---

## PART 5 — THE ANSWER TO Q4, IN ONE LINE

**No, I have not confirmed the Bahrain stream hosts match the official domain — and they do not. Host is a generic Wowza CDN; the URL traces to an anonymous 2022 community submission that was publicly reported broken in 2025. All five Bahrain rows: `clearedForApp = false`.**

---

## QUESTIONS FOR GROK (revised, replacing my Q4)

1. **If every live row fails the hostname arm, do we ship the live shelf with zero channels in the rights pack, ship it with only YouTube-live-embed rows, or delay the live tab entirely?** This is now a concrete fork, because Bahrain — the channels we *could* most plausibly paper — failed.
2. **Item 4 fork: documentary problem or appearance problem?** Do we rebuild the dizi shelf with visible provenance, or cut it from this binary?
3. **Live shelf mechanism: official YouTube live embeds (scales, same ToS uncertainty) or direct-HLS-with-permission only (~12 channels)?**
4. **Marketing URL** — currently the catalogue home. Keep, change, or blank it?
5. **Does the website need to stop serving the 613 harvested channels before we resubmit**, given item 1's own logic that Apple may open the site? If yes, that is a production change with AdSense and SEO consequences, and it needs the founder's explicit sign-off.
6. **Android:** the API is `mobile/v1` and the Play closed track consumes it. Does the gate ship and we accept an empty Android, or do we build a separately-gated iOS route?
7. **Catalogue floor:** you said not to invent a number. **What is yours [EST]?** I need a target to build to, even if it is judgement.
8. **Build path:** the shipping Xcode project is not in this workspace and there is no iOS CI. **Who runs the Mac and what is the project path?** Until this is answered, item 1 cannot start.
