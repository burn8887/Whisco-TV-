# Whisco TV — Engineering Handover Briefing

**For:** lead coordinating AI assistant
**From:** the build/agent domain (web + iOS + Android)
**Date:** 2026-09-18
**Method:** every claim below read from the repos, the GitHub API, the App Store Connect API, the Google Play API
or live production this session. Anything unverified is labelled. No number is estimated.

---

## 0. Read this first — four premises in the brief are wrong

The briefing asked about things that are not the things. Correcting before answering, because answering the
questions as asked would produce a report that misdescribes the project.

| Brief says | Reality | Evidence |
|---|---|---|
| "Guidelines **5.2.3** and **2.3.7**" | The two rejections were **5.2.2** (third-party content / per-title provability) and **2.5.4** (UIBackgroundModes audio). 2.3.7 is an *adjacent* risk, never cited. 5.2.3 (audio/video download) was never cited. | Apple's submission detail, second rejection 2026-09-15, submission `c80e30c4-…`; recorded in `RIGHTS_PACK_build6.md` and `SCREENSHOT_FIX_20260918.md` |
| "Mascot **2.0** placement" as a review fix | Mascot 2.0 is a **staging-only creative pack**. Its own text: *"Nothing in this file is a ship order"*, *"Staging branch only."* There is no Mascot 2.0 code in the shipped app. | [`Whisco_TV_Design_Vision_Mascot_2.md`](https://github.com/burn8887/Whisco-TV-/blob/d85628c/docs/business/Whisco_TV_Design_Vision_Mascot_2.md) |
| "Capacitor wrapper vs native modules" | **Neither.** Expo managed workflow + React Native + EAS Build, with one local Expo config plugin that edits the native project at prebuild. No Capacitor anywhere. | [`mobile/package.json`](https://github.com/burn8887/whisco-mobile/blob/e254293/package.json), [`plugins/withNoBackgroundAudio.js`](https://github.com/burn8887/whisco-mobile/blob/e254293/plugins/withNoBackgroundAudio.js) |
| "Android TV / remote navigation support" | **Not implemented.** One vestigial `EXPO_TV: "1"` env var in an unused build profile; no television manifest, no leanback launcher, no `react-native-tvos`. | grep across repo finds exactly one `EXPO_TV` hit, in `eas.json` only |

One further correction to our own record, found this session: **AdSense is live in production** and the AdSense API
reports the site as `NEEDS_ATTENTION`. Our session record said "rejected, no Request review made". See §2.4 — this is
the most consequential open item in the web domain.

---

## 1. Repository & branch state

Two repos, **both public** (confirmed via GitHub API — public matters: it is what gives us free unlimited GitHub
Actions; making either private forces the cron thinning documented in `INTERNAL` notes).

| Repo | Purpose | `main` | Local ↔ remote |
|---|---|---|---|
| [`burn8887/Whisco-TV-`](https://github.com/burn8887/Whisco-TV-) | Next.js web app + API + all business docs | **`d85628c`** | in sync |
| [`burn8887/whisco-mobile`](https://github.com/burn8887/whisco-mobile) | Expo/React Native app (iOS + Android) | **`e254293`** | in sync |

**No open pull requests on either repo.** All integration is done by local branch → merge to `main` → push.

### 1.1 Staged vs committed

**Nothing is staged.** Both working trees are clean of tracked changes. The web repo carries 11 untracked scratch
files (`.mjs` brand-experiment scripts) that are not part of any deliverable and can be deleted.

### 1.2 Branches in the web repo

Nine local branches; **four are not merged into `main` and are not redundant:**

| Branch | Status | Real content | Why it matters |
|---|---|---|---|
| `where-pages` | **UNMERGED** | `src/lib/where.ts` (159 lines) + 5 Gulf "Where to Watch" pages + index + sitemap entries | Genuinely absent from `main` — verified `src/lib/where.ts` does not exist on main. **Staged for post-freeze deploy.** |
| `content-articles` | **UNMERGED** | Editorial engine: `Article` model, publisher, show hub, article pages, sitemap coverage + 2 commits | Part of the AdSense low-value-content fix. Not on main. |
| `geo-health-fix` | **UNMERGED** | `check-vod` real `geo` status + confirm-before-restore guard; maintenance status-split KPI; sweep budget 250→700 | Fixes a live data bug where GCC-blocked titles were recorded `invalid` and restored `ok`, leaving Kaya/Leyla-class titles live. Not on main. |
| `canonical-host-fix` | **REDUNDANT** | apex `whisco.tv` → `www.whisco.tv` across 10 files | **Already in `main` by other means** — all five key files on main show 0 apex references, 19 `www` references. Branch can be deleted. |
| `android-header-gate`, `build6-store-gate`, `fix-about-reviewer-copy`, `fix-guides-inventory-brags`, `fix-ios-live-facets` | all **MERGED** | — | Safe to prune. |

**Method note for whoever audits this:** `git diff main <branch>` on these branches is *misleading* — they are based
on an older `main`, so the raw diff reads as massive deletions (including deleting `store-gate.ts`). The correct
comparison is `git log <branch> --not main`.

### 1.3 Branches in the mobile repo

| Branch | Status |
|---|---|
| `build6-ios-store` | merged-equivalent, pruneable |
| `fix-live-facets-guard` | merged-equivalent, pruneable |
| `main` @ `e254293` | live |

### 1.4 Latest commits on `main` (web)

```
d85628c  submission state: iOS in review on build 7; Play closed track holds versionCode 7 but production is empty
ffa7472  RC letter placement for build 7, plus a build-7 rights pack
adc1abf  screenshots: the 1179x2556 files belong in the 6.3-inch slot, and the 6.9-inch slot still
         holds four shots showing 655 channels
101636b  merge: fix-guides-inventory-brags — /guides carries no catalogue counts
51de9d6  /guides stops quoting an inventory: no counts anywhere on the guides surface
ef3f7cc  merge: fix-about-reviewer-copy — /about and site-wide head metadata state no catalogue counts
da10534  /about stops contradicting the apps: no catalogue counts anywhere on the page
3bebaac  report: Android gate live on production, play-listing.md, feature graphic replaced,
         EAS android command ready and not run
4e659b3  Play production access form: honest answers only, with an explicit never-claim list
54cc7e4  every gated route reports the real requester, not a hard-coded "ios"
346339f  merge: android-header-gate — Play gets the cleared catalogue via the same gate as iOS
```

### 1.5 Latest commits on `main` (mobile)

```
e254293  Play listing draft + replacement feature graphic; the 500-channel graphic is retired
db15dfa  Android/Play sends X-Whisco-Store: android — same cleared catalogue as iOS build 7
15075f7  build 7: iPhone-only for this pass (Grok 2026-09-17)
8092b70  merge: guard facets access in the live screen
f1eb9a1  guard the facets access: data?.facets?.languages
3669584  build 6: store header, Source line, rights report → main for the EAS build
d39aefd  iOS 2.5.4: strip UIBackgroundModes audio for real, without breaking Android PiP
```

---

## 2. Web platform — [www.whisco.tv](https://www.whisco.tv)

### 2.1 Stack

| Layer | Version |
|---|---|
| Next.js | **16.3.0** (App Router, Turbopack) |
| React | 19.2.8 |
| Prisma | 5.22.0 — provider `postgresql` |
| Database | **Neon Postgres**, pooled endpoint `ep-fragrant-salad-za6qb2v7-pooler.c-2.eu-west-2.aws.neon.tech`, db `neondb`, LAUNCH plan ~$19/mo |
| HLS | `hls.js` ^1.6.17 |
| Auth | `next-auth` ^5.0.0-beta.32 (optional accounts only — no billing anywhere) |
| Hosting | Vercel, with two cron entries in `vercel.json` (`check-channels` 03:00, `check-vod` 03:30) |

**Build caveat, important for anyone running this locally:** `npx next build` **OOMs at 1.9 GB** (exit 137) in this
environment. Use `npx next dev`. Typecheck with `./node_modules/.bin/tsc --noEmit` after `npm install` — a bare
`npx tsc` prompts to download and will mislead you. `node_modules` is stripped between sessions, so `npm install`
first, every time.

### 2.2 Active patches / unmerged code

Covered in §1.2. In short: **three branches carry real undeployed work** (`where-pages`, `content-articles`,
`geo-health-fix`), and all three are being deliberately held. Two of them (`where-pages`, `content-articles`) add new
URLs, and adding URLs during the AdSense review window is the specific thing we are avoiding. `geo-health-fix` is a
bug fix with no URL change and is the cheapest to ship.

### 2.3 Players / HLS — current state

Three distinct playback paths, and they are not interchangeable:

1. **Web live + VOD** — `src/components/VideoPlayer.tsx`, `hls.js` for HLS, YouTube iframe for `youtube-live` rows.
   **Ship `youtube.com/embed/`, never `nocookie`** — the `nocookie` host breaks the player's own `src.includes()` test.
2. **YouTube error 153** — embed requires a referer. Fix lives in the mobile player
   (`whisco-mobile/src/components/Player.tsx`).
3. **iOS app** — plays YouTube embeds and archive.org H.264 files. Codec wall noted for Part-2: audio-only on iOS.

**Locked decision still in force:** `cached.ts` is **not** to be gated. Grok's lock, restated in the Android brief.
The website intentionally stays "fat" (57 public live rows / 621 total) while the store-facing API returns exactly 8.

### 2.4 AdSense — live, and our record disagrees with Google's

**This is the item I would escalate first.** Verified this session:

- **Ad code is serving in production.** `https://www.whisco.tv/` HTML contains `ca-pub-7207533964778777` ×2 and
  `adsbygoogle` ×2.
- **`/ads.txt` returns 200** (route `src/app/ads.txt/route.ts` serves `ADS_TXT` env var; 404s when unset).
- **`AdSlot` is mounted on four routes:** `/live`, `/title/[slug]`, `/vod` (×2). One slot per page, never inside the
  player area — the placement doctrine holds.
- **The component has a hardcoded fallback:** `process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-7207533964778777"`.
  The comment above it says the component should *render nothing* when the env var is unset. **The fallback defeats
  that guard** — the env var being unset produces live ads, not an empty slot. That is a code-level bug relative to
  the stated intent.
- **AdSense API read:** account `accounts/pub-7207533964778777` state `READY`; site **`whisco.tv`** state
  **`NEEDS_ATTENTION`**; alerts: `adsense-onboarding-incomplete — "To start earning from AdSense, you need to add your
  payment info and connect your site"`, plus a generic `ua-conflict-policy-update` notice.
- **Note the host:** AdSense has the site registered as the **apex** `whisco.tv`, while the site is served on
  **`www.whisco.tv`** and the apex 308-redirects. That mismatch may be why it reads as "not connected".

Our session record said AdSense was **rejected for "Low value content" and no Request review was made**. Google's API
says the site needs connecting and payment info. **These are hard to reconcile and I am not going to guess which is
current.** What is certain and actionable: ad code is live on a site Google does not currently consider fully
connected, and there is a code fallback that makes "off" impossible. Both need a decision.

Per standing instruction, **Request review has not been pressed and must not be.**

### 2.5 Fixes shipped to production this week

| What | Commit | Verified live |
|---|---|---|
| `/about` stopped contradicting the apps — four live-counted stat tiles (556+ channels / 16,787+ titles / 36+ countries / 13 languages) removed; site-wide `description`, `og:description`, `twitter:description` and the PWA manifest de-counted | `ef3f7cc` | ✅ 0 hits for 556 / 629 / 16,787 / 14,000 |
| `/guides` index and all 7 guides de-counted (600+ / 500+ / 14,000+ / 2,500+ / "50 series" / "close to 700" / "300 Arabic" / "over a thousand") | `101636b` | ✅ 0 hits across index + 7 routes |
| Android/Play gate — API accepts `ios`, `android`, `play` as the same cleared catalogue; every gated route reports the real caller | `346339f`, `54cc7e4` | ✅ ios 8, android 8, play 8, no header 57 |

**Both deploys were made inside the 16–19 Sep site freeze**, on explicit instruction, as a deliberate exception —
the same exception pattern as the earlier `facets` fix. Flagging it because the freeze is otherwise still in force.

### 2.6 Live production state, checked this session

```
/       200        /live  200      /vod  200
/about  200        /guides 200     /new  200
ads.txt 200

api /live  X-Whisco-Store: ios      -> 8 rows,  store="ios"
api /live  X-Whisco-Store: android  -> 8 rows,  store="android"
api /live  no header                -> 57 rows (fat, total 621)
```

---

## 3. Mobile platforms

### 3.1 Framework — answering the actual question

**Expo managed workflow, not Capacitor, not bare React Native.**

| Item | Value |
|---|---|
| Expo SDK | ~57.0.15 |
| React Native | 0.86.2 |
| React | 19.2.3 |
| Router | expo-router ~57.0.15 |
| Video | **expo-video** ~57.0.2 (Primary), `react-native-webview` 13.16.1 (YouTube embeds) |
| Storage | `@react-native-async-storage/async-storage` 2.2.0 |
| Bundle ID / package | `tv.whisco.app` (both platforms) |
| Build system | **EAS Build**, `autoIncrement: true` on `production` |
| Native modification | **One local Expo config plugin:** `plugins/withNoBackgroundAudio.js` |
| Committed native dirs | **None.** No `ios/`, no `android/` in the repo, by explicit decision (Q8 closed) |
| New architecture | Not explicitly enabled in `app.json` |

**The plugin is worth understanding, because it is the fix for one of the two rejections.** `expo-video`'s own config
plugin *re-adds* `UIBackgroundModes: ["audio"]` at prebuild whenever `supportsPictureInPicture: true` — which we set.
Deleting the key from `app.json` does not work; it was tested and the key came back. Setting
`supportsPictureInPicture: false` would fix iOS but would silently delete
`android:supportsPictureInPicture` from the Android manifest, breaking PiP in the Android app already in closed
testing. So the plugin runs **after** `expo-video` (plugin array order, last writer wins) and strips `"audio"` on iOS
only. The file documents all of this in-line. Do not remove it.

### 3.2 iOS — build status

| Field | Value |
|---|---|
| Current build under review | **7** |
| App Store Connect state | **WAITING_FOR_REVIEW** |
| Submitted | 2026-09-17T23:43:22Z |
| Build 7 uploaded | 2026-09-17T05:18:12-07:00, `VALID` |
| Older builds visible | 6 (VALID, do **not** submit — declares iPad), 5 (VALID) |
| Version | 1.0 — previously REJECTED twice, now resubmitted |
| Screenshots | `APP_IPHONE_61` ×4 @ 1179×2556 · `APP_IPHONE_67` ×4 @ 1290×2796 |
| Review notes | 2,875 characters |
| Attachment | `Whisco tv content rights statement build 6 .pdf` |
| Contact | burn8887@gmail.com · +973 3930 3973 · demo account not required |
| `supportsTablet` | **false** — iPad dropped this pass (build 7 is iPhone-only, `TARGETED_DEVICE_FAMILY="1"`) |

**Video player stability.** Build 6 shipped with a real crash: the iOS branch of the live API returned `facets: null`
and the app dereferences `data?.facets.languages`. Fixed on both sides — API returns an empty object
(`{"countries":[],"categories":[],"languages":[]}`, deployed and verified in production), and the app guards the
access (`data?.facets?.languages`). **Build 7 carries both fixes.** The lesson recorded: never return `null` for a
field the client dereferences.

**Background audio.** `UIBackgroundModes` is **ABSENT** from build 7's built `Info.plist` — verified by downloading
the real IPA and parsing it, not by inference. The app does not play audio when backgrounded. iOS picture-in-picture
is unaffected (PiP is a runtime `AVPlayerViewController` presentation, not a background mode).

Picture-in-picture is configured `true` in `app.json` for `expo-video`, which is what keeps Android PiP working.

**TestFlight readiness: done.** Build 7 is uploaded, processed, VALID, and attached to the submission. The founder
took the screenshots on build 7 in TestFlight. There is no Mac anywhere in this workflow and none is needed — the
machine is a Chromebook Linux terminal (`burn8887@penguin`).

**Credential state (no values here, by standing rule).** Distribution certificate → 2027-09-01, issuer
`b071aa69-7af0-…`, team `X2UPN4792Y`; provisioning profile "Whisco TV App Store" UUID `23dc429a-…`; ASC API key
`B279KL3Y3K`. `eas.json` points at the key **by absolute path** — eas-cli does not expand `~`, and the path comes
from `eas.json` only (`EXPO_ASC_*` env vars do **not** override `eas submit`). One known gap:
`DATABASE_URL`/Neon password rotation is still outstanding per
[`WHISCO_TV_DISASTER_RECOVERY.md`](https://github.com/burn8887/Whisco-TV-/blob/d85628c/WHISCO_TV_DISASTER_RECOVERY.md),
because an old password appeared in early chat.

### 3.3 App Store review fixes — the correct mapping

The brief's guideline numbers were wrong; here is what was actually fixed and against what.

| Cited guideline | Was it cited by Apple? | Status |
|---|---|---|
| **5.2.2** — third-party content / per-title provability | **YES** — rejection #2, 2026-09-15, submission `c80e30c4-5e07-4911-bb77-2ed58fd09caf` | **Addressed in build 7.** Catalogue narrowed to 16 fully documented items: 8 `youtube-live` official broadcaster channels (embedding each broadcaster's own official YouTube live stream, YouTube chrome and channel name visible) + 8 Prelinger/archive.org public-domain shorts, each with its own Public Domain declaration. Every item shows a Source row. Rights pack attached. |
| **2.5.4** — UIBackgroundModes audio | **YES** — same rejection | **Addressed in build 7.** Key stripped from the built plist; verified by parsing the real IPA. |
| 2.3.7 — accurate metadata | **NO** — never cited | Handled pre-emptively, not reactively: the entire count-free rewrite of `/about`, `/guides`, site-wide head metadata, the PWA manifest and the API's store-facing shape. |
| 5.2.3 — audio/video download | **NO** — never cited | Not applicable; there is no download, save or convert function. |

**Catalog screenshots.** This is where the brief's question actually lands, and there was a real problem, now fixed.
The 6.9″ slot had been holding **four shots from 2026-09-02 showing the old app**: "655 channels", filters
Arabic 150 / Hindi 138 / English 75, "Search 14,567+ titles", Bahrain TV, DW English, Sky News Arabia, Malayalam
Cinema 672 — none of which exists in build 7, whose home screen reads "8+ live channels · 8+ free titles".
Those were a 2.3.7-shaped mismatch sitting in the slot Apple treats as required. They were deleted and replaced with
four shots taken on build 7. Two sizing traps were hit and resolved along the way: the founder's 1179×2556 files
belong in the **6.3″** slot (not 6.1″, which takes 1170×2532 / 1125×2436 / 1080×2340), and emptying the 6.9″ slot
*creates* a 6.5″ requirement, because Apple only requires 6.5″ when 6.9″ is absent. Full write-up:
[`SCREENSHOT_FIX_20260918.md`](https://github.com/burn8887/Whisco-TV-/blob/d85628c/docs/business/SCREENSHOT_FIX_20260918.md).

**Player chrome.** The in-app item page shows the media type, language, HD flag, a **Source** row that opens the
rights holder's own page, and **"Report a rights issue → legal@whisco.tv"** on every title. This is the visible
implementation of the 5.2.2 answer and is deliberately present on both live and VOD pages.

**Mascot 2.0 placement — the honest answer.** Mascot 2.0 is **not** implemented and was **not** a review fix. It is a
staging creative pack. But there is a live judgment call worth surfacing, because the brief's instinct was not
entirely misplaced:

- The shipped app's home screen carries a **hero banner of the real dog** (`/whisco-zoom-banner.mp4`, poster
  `/whisco-zoom-banner-poster.jpg`, label *"Life's better at full speed — and full free."*), gated by
  `SHOW_MASCOT_VIDEOS = true` in `src/config/features.ts`. It is served live and appears in App Store screenshot #2.
- The Mascot 2.0 doctrine says: *"Cartoon off catalog, player, store screenshots of catalog (Apple 2.3.7 / 2.3.10).
  … Do not put any generated Whisco on title posters or App Store catalog shots."*
- The hero is the **real-dog photograph/video** depiction, not a generated cartoon, and it is brand chrome rather
  than a catalog row — so on a literal reading it is allowed.
- **But** the standing brand constraint recorded for this project is broader: *"Dog never on posters, catalog shots,
  ads, legal."* Screenshot #2 shows the hero immediately above catalog shelves.

**I am flagging this rather than ruling on it.** It is a live submission that is already in review. If the
coordinating assistant or Grok reads the brand constraint as covering that screenshot, the remedy is to swap
screenshot #2 for a hero-free shot — but while in `WAITING_FOR_REVIEW` screenshots cannot be edited, so acting on it
means withdrawing the submission. That trade-off is a human call, not mine.

### 3.4 Android — build status

| Field | Value |
|---|---|
| Package | `tv.whisco.app` |
| Build type | `app-bundle` (AAB) |
| Latest versionCode | **7** — the same 8 live + 8 VOD shape as iOS build 7 |
| Bundles uploaded | versionCode **5, 6, 7** |
| Android credentials | **EAS-managed server-side.** `eas.json` sets no `credentialsSource` for android. No keystore file needed locally. |

**Play track state, read from the API today:**

| Track | Release | versionCode | Status |
|---|---|---|---|
| `production` | — | — | **EMPTY** |
| `beta` | — | — | EMPTY |
| `alpha` | — | — | EMPTY |
| `internal` | `5 (1.0.0)` | 5 | completed |
| `build 7` | `build 7` | **7** | completed |
| `whisco.tv test ` | `6 (1.0.0)` | 6 | completed |

**The production track has no release in it.** An empty production track is *expected* if the founder tapped
**Apply for production access** — that is a Console form, and forms do not appear in the Play API; it would show as
"waiting for review" in the Console UI. It would **not** be expected if he believed a production release had been
created, because none exists. **This has been raised with him and is the one question outstanding** before anyone
touches Play again.

**The gate that makes the new binary correct.** The old Play closed binary was the 625-channel client, and applying
with it would have contradicted the 8+8 listing. The mobile client now sends `X-Whisco-Store: android` from a single
`get()` choke point (`src/api.ts`), and the API returns the cleared 8+8 catalogue for `android` and `play`. Missing
header deliberately falls through to the fat catalogue, so **the already-installed closed-test binary keeps working
until testers update.** Production curls confirmed: android 8/8, ios 8/8, play 8/8, no header 57/621, uncleared rows
404 under a store header and 200 without one.

**Android TV / remote navigation: not supported, and not close.** The evidence:

- `eas.json` has a `production-tv` profile whose only content is `env: { EXPO_TV: "1" }`.
- That is the **only** occurrence of `EXPO_TV` in the repository.
- `app.json` has no `react-native-tvos` dependency, no `android.intent.category.LEANBACK_LAUNCHER` intent filter, no
  TV banner asset, no leanback manifest configuration.
- `EXPO_TV=1` alone does not produce a TV-capable build; Expo's TV support requires the `react-native-tvos` fork
  and a TV-aware manifest.

**Treat the profile as a placeholder, not a feature.** Remote/D-pad navigation is untested and by inspection would
not work — the app uses touch-oriented components throughout. If TV is a real roadmap item, it is a fresh workstream,
not a configuration toggle.

**Store listing assets.** `store/play-listing.md` is written and paste-ready (name, short description 57 chars, full
description 1,277 chars, every field, plus an explicit banned-strings table for 500 / 615 / 625 / 14,000 / dizi /
movies / FTA / HLS / iptv-org). The feature graphic that claimed "500+ Live TV Channels / 14,000+ Free Movies" **and
carried the dog** was retired to `store/retired/` with a README recording both reasons, and replaced with
`store/feature-graphic-1024x500.png` at Play's exact 1024×500. **Play screenshots are still outstanding** — the
existing ones are from the 625-channel client.

---

## 4. Blockers & immediate queue

### 4.1 Next three tasks

**1. Answer the Play production question, then do nothing until it is answered.**
Ask the founder plainly: *did you tap "Apply for production access" (a form) or create a production release?* If it
was the form, the state in §3.4 is exactly right and Play is finished pending Google. If it was not, a production
release still has to be created — deliberately, with the versionCode-7 AAB, after the listing and screenshots are
replaced. **Do not tap Apply. Do not create a production release.** The standing bar on applying is not mine to lift.

**2. Ship `geo-health-fix`, and deploy `where-pages` + `content-articles` when the window opens.**
`geo-health-fix` is a genuine data-correctness bug with no new URLs and no reason to wait beyond the freeze. The
other two add URLs and are correctly parked until the AdSense situation in §2.4 is settled — adding pages while a
site's AdSense state is unsettled is the wrong order. `where-pages` was authored for a post-freeze (Sep 20+) deploy.

**3. Reconcile the AdSense contradiction and put a decision in front of the founder.**
Ad code is live on an unconnected site, and `AdSlot`'s hardcoded fallback makes "off" unreachable even when the env
var is unset. Either the env var is set and this is intentional, or the fallback needs removing so the documented
behaviour is true. Separately: AdSense has the site registered at the apex while the site serves on `www`. **Request
review stays barred.**

### 4.2 Blockers

| Blocker | Severity | Detail |
|---|---|---|
| Play production state unknown | **blocks Play completion** | Question in §4.1 item 1. Everything else on Android is ready. |
| AdSense record vs Google's API disagree | **blocks the AdSense workstream** | §2.4. Cannot plan the re-review request until we know whether the site is rejected-for-content or merely unconnected. |
| Neon DB password rotation outstanding | medium | Old credential appeared in early chat. Rotate from the Neon console. |
| Mascot hero in App Store screenshot #2 | low, but time-sensitive | §3.3. Only actionable by withdrawing the submission. Needs a human ruling. |
| Attachment named "build 6" while build 7 is under review | cosmetic | Content is identical between the packs; only the label differs. A build-7-named replacement exists at `Whisco_TV_Content_Rights_Statement_build7.pdf`. **Do not touch the submission to fix this** unless Apple asks. |

### 4.3 Environment issues — read before running anything

These have all bitten me and will bite the next person:

- **`npx next build` OOMs (exit 137) at 1.9 GB.** Use `npx next dev`.
- **`node_modules` is stripped between sessions.** `npm install` first, always. A fresh clone has none.
- **`npx tsc` prompts to install and will mislead you.** Use `./node_modules/.bin/tsc --noEmit`.
- **Git identity is stripped between turns.** Set `whisco` / `dev@whisco.tv` before committing.
- **`origin` is stripped from `.git/config`** (it is on the snapshot's sensitive-path exclusion list). Remotes must
  be re-added each session — and **a stale local `origin/main` ref will report "in sync" when it is not.** Fetch
  before trusting any local-vs-remote comparison. This bit me this session: local read `adc1abf` as in-sync when the
  truth was two commits behind at `d85628c`.
- **Secrets live in `.keys/`** and are never printed, echoed or committed. `.p8` keys, `credentials.json` and the
  GitHub PAT for pushing are all in there.
- **`/mnt/chromeos/MyFiles/Downloads` does not exist** from the Linux terminal. Files come via Files → "Linux files".
- **`npx expo prebuild` mutates the workspace.** Check `git status` after running it.
- **A combined multi-command bash call can hit a tool validation error and execute nothing.** Verify state rather
  than assuming a command ran.

---

## 5. Standing bars — unchanged

No `eas build` run by the agent. No Apply for production tapped by the agent. No catalogue row ticked — ever. No
homepage deploy beyond the two explicitly-ordered exceptions. No Part-2 production repoint. No AdSense Request
review. No direct contact with Grok or Apple. No `Submit for Review` / `Update Review` / `Add for Review` /
`Resubmit` pressed by the agent.

Catalogue is **RELEASED** at 8 live + 8 VOD. It is not to be reopened.

---

## 6. Reference index

| What | Where |
|---|---|
| Web repo | [github.com/burn8887/Whisco-TV-](https://github.com/burn8887/Whisco-TV-) |
| Mobile repo | [github.com/burn8887/whisco-mobile](https://github.com/burn8887/whisco-mobile) |
| Live site | [www.whisco.tv](https://www.whisco.tv) |
| Submission state record | [`SUBMISSION_STATE_20260918.md`](https://github.com/burn8887/Whisco-TV-/blob/d85628c/docs/business/SUBMISSION_STATE_20260918.md) |
| Screenshot diagnosis | [`SCREENSHOT_FIX_20260918.md`](https://github.com/burn8887/Whisco-TV-/blob/d85628c/docs/business/SCREENSHOT_FIX_20260918.md) |
| RC letter + placement | [`RC_LETTER_build7_20260918.md`](https://github.com/burn8887/Whisco-TV-/blob/d85628c/docs/business/RC_LETTER_build7_20260918.md) |
| Build-7 rights pack | [`RIGHTS_PACK_build7.pdf`](https://github.com/burn8887/Whisco-TV-/blob/d85628c/docs/business/RIGHTS_PACK_build7.pdf) |
| Android gate report | [`REPORT_ANDROID_GATE_20260917.md`](https://github.com/burn8887/Whisco-TV-/blob/d85628c/docs/business/REPORT_ANDROID_GATE_20260917.md) |
| Play listing paste sheet | [`store/play-listing.md`](https://github.com/burn8887/whisco-mobile/blob/e254293/store/play-listing.md) |
| Play production-access answers | [`PLAY_PRODUCTION_ACCESS_FORM_20260917.md`](https://github.com/burn8887/Whisco-TV-/blob/d85628c/docs/business/PLAY_PRODUCTION_ACCESS_FORM_20260917.md) |
| Ops / incident / DR | [`WHISCO_TV_DISASTER_RECOVERY.md`](https://github.com/burn8887/Whisco-TV-/blob/d85628c/WHISCO_TV_DISASTER_RECOVERY.md) · [`WHISCO_TV_PROJECT_HANDOVER.md`](https://github.com/burn8887/Whisco-TV-/blob/d85628c/WHISCO_TV_PROJECT_HANDOVER.md) |

**Workspace paths** (this environment): [`/home/user/iptv-app`](/home/user/iptv-app) · [`/home/user/whisco-mobile`](/home/user/whisco-mobile) · [`/home/user/asc-screenshots`](/home/user/asc-screenshots) · `/home/user/.keys/` (secrets — never print).
