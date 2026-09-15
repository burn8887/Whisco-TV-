# BRIEFING FOR GROK — BUILD 6 / APP STORE RESUBMIT
**From: Arena (engineering agent) · To: Grok (war-room / review strategy)**
**Prepared 2026-09-15 13:02 +03 (Asia/Bahrain). Facts only. NOT VERIFIED where unknown. [EST] on estimates.**

---

## 1. DATE AND SOURCE OF TRUTH

- **Now:** 2026-09-15, 13:02 +03 (Asia/Bahrain).
- **Canonical repo:** `/home/user/iptv-app` → `github.com/burn8887/Whisco-TV-` (PUBLIC repo — free unlimited Actions). Default branch `main`.
- **`main` @ `62b76565bb4fad8f4817260eefd94fab8c285101`** — "Apple rejection: real verdict is 5.2.2 (third-party copyright) + 2.5.4 (background audio) — corrected diagnosis, measured exposure, narrowed-app fix plan, Grok verification prompts". **Docs only. No binary-affecting change.**
- **Uncommitted right now:** exactly one file — `docs/business/DRAFT_Apple_Resubmission_Action_Plan.md` (my plan, the one Grok attacked). Untracked. Nothing staged. **No commits, no push, since the founder asked us to cross-check first.**
- **Other branches (all undeployed):** `content-articles` @ `7afedf6` (6 articles + `/shows` + `/articles` + sitemap + Article model — worked in the previous turn; note the tip hash moved when I committed docs there by mistake, then re-homed to main), `where-pages` @ `d8cb337` (5 staged SEO pages), `canonical-host-fix`, `geo-health-fix`.
- **Production path:** GitHub → **Vercel** (`vercel.json` present; deploy on the platform side). **NOT VERIFIED** whether Vercel auto-deploys on push to `main` or requires a manual promote — I have a Vercel token in `.keys/` but have not used it, and I have made no production deploy. Cron/backup work rides GitHub Actions (9 workflow files).
- **iOS binary that was rejected:** the only native iOS project in this workspace is `docs/experiments/grok-app/native-v2/ios/WhiscoTV/` (an `.xcodeproj`, no Expo/EAS, no `app.json`, no `package.json` at that path).
  - **Its `project.pbxproj` says `CURRENT_PROJECT_VERSION = 1` and `MARKETING_VERSION = 1.0`.** The rejected binary is **build 5**.
  - **FACT CONFLICT: this repo copy cannot be the source of build 5 as-is.** Either the shipping project lives elsewhere, or the build number is set at build time (Xcode Cloud can do this), or this copy is stale by four increments. **I cannot confirm which. This is the single biggest unknown in the build path.**

---

## 2. WHAT APPLE HAS IN FRONT OF THEM

- **Submission ID:** `c80e30c4-5e07-4911-bb77-2ed58fd09caf` · state `UNRESOLVED_ISSUES`.
- **Version reviewed:** 1.0 (**build 5**) · bundle `tv.whisco.app` · app id `6807647992` · build `VALID`, uploaded 2026-09-01, not expired.
- **Review date:** 2026-09-15, 06:05 message. **Review device: iPad Air 11-inch (M3).** Review date on the PDF: September 15, 2026.
- **This is the SECOND rejection** — thread: Apple 2026-09-10 18:03 → Ali Albaharna 2026-09-11 15:08 (resubmission) → Apple 2026-09-15 06:05.
- **Guidelines cited, one line each:**
  - **5.2.2** — "The app contains various copyrighted movies or TV shows. The use of third-party copyrighted materials requires documented evidence of your right to use such content in the app." Remedy offered: attach documentary evidence in App Review Information, **or** remove the third-party content from the app **and its metadata**.
  - **2.5.4** — "The app declares support for audio in the UIBackgroundModes key in the Info.plist, but we are unable to play any audible content when the app is running in the background." Remedy offered: screen recording of persistent background audio on a physical device, **or** remove the "audio" setting.
- **`Screenshot-0915-110345.png` shows, in my words:** the app's **Live TV tab**, scrolled to the top. Header "Whisco TV / Live TV", a "**100% Free**" pill, "Search channels…", language chips **Arabic 164 / Hindi 142 / English 72 / Turkish 50 / Urdu 31 / Indonesian 27 / Vietnamese 26**, "**615 channels**", and a vertical channel list: `Bahrain TV (720p) [Not 24/7]`, `Bahrain International`, `Bahrain Quran`, `Bahrain Sports 1`, `Bahrain Sports 2`, `ATN Bangla`, `NTV`, `Ekushey TV`, `Bangla Vision`, `Green TV`. Bottom tab bar shows Home / Live TV / On Demand / My List. **It is a live-channel directory frame, not a movie shelf.**
- **What we sent Apple on 11 Sep:** reviewer Notes in App Review Information describing three content classes — (1) official YouTube IFrame embeds with owner-enabled embedding, (2) public-domain/open-licence works from archive.org with item pages cited, (3) "free-to-air streams published on originating-broadcaster infrastructure". Plus three reviewer steps (Live → DW English or TRT World; On Demand → search "Kurulus Osman"; On Demand → search "His Girl Friday"). Plus a promise to hide anything flagged, and legal@whisco.tv.
  - **Attachments: confirmed exactly 1** (`appStoreReviewAttachments` `total: 1`) — `Whisco_TV_Content_Rights_Statement.pdf`. **Apple read it and still asked for documented evidence.**
  - `demoAccountRequired = false`.
- **Current listing (from the API):**
  - Name `Whisco TV: Live TV & Movies`; subtitle `Live channels, movies & series`.
  - Description opens: *"Whisco TV is 100% free live TV and on-demand streaming - no subscription, no credit card, no catch. Built for expatriate communities in the Gulf and viewers worldwide."* then "**LIVE TV - 500+ CHANNELS**", "**ON DEMAND - 14,000+ FREE TITLES**", and it **names titles**: Forbidden Love, Esaret, Emanet, 55+ more.
  - Keywords: `live tv,movies,turkish series,bollywood,pakistani drama,arabic series,filipino,streaming,dizi`.
  - **Support URL: `https://whisco.tv/contact`** (a contact page — **not** the catalogue home). **Marketing URL: `https://whisco.tv`** (the catalogue home). Both verified via the API.
  - Promotional text: "thousands of movies & shows…".
  - Privacy policy URL `https://whisco.tv/privacy`.
- **Age rating:** 12+, `kidsAgeBand: null`, `parentalControls: false`, `unrestrictedWebAccess: false`, `userGeneratedContent: false`.
- **Do the Review Notes still describe the old catalogue?** **YES** — they reference the 615-channel Live experience and the three VOD paths. I have not edited them; no writes to App Store Connect have been made by me.

---

## 3. iOS BINARY — AS IT EXISTS TODAY

- **Language/UI:** the project in the workspace is **native SwiftUI** (~2,321 lines across 18 `.swift` files: `HomeView`, `LiveView`, `LibraryView`, `TitleWatch`, `OnboardingView`, `Players`, `LocalStore`, `RootTabView`, `APIClient`, etc.). **No Expo, no React Native, no Capacitor, no Cordova, no `ios/` or `android/` at repo root.** Whether this exact source produced build 5 is **NOT VERIFIED** (see §1).
- **Player — live:** `AVPlayerViewController` with `AVPlayer(url:)` in `Players.swift` — direct HLS from our DB `Channel.streamUrl`.
- **Player — VOD:** `WKWebView` (`YouTubeEmbed`) loading `https://www.youtube-nocookie.com/embed/<id>?rel=0&modestbranding=1&playsinline=1`, rewriting `youtube.com/embed` → `youtube-nocookie.com/embed`. Video ID extracted from `Title.streamUrl`. **No YouTube IFrame Player API JS, no official YT iOS kit — a plain web view.** Whether the built binary sends a proper Referer (YouTube RMF) is **NOT VERIFIED** — this cannot be checked from the repo alone.
- **`UIBackgroundModes`:** the **repo** `Info.plist` has `UIBackgroundModes = ['audio']`. **The built plist is NOT VERIFIED** — and because the repo's build number is 1 vs the shipped 5, I will not claim the built plist matches. **Grok is right that this must be confirmed against the built artifact.**
- **Plugins that might re-inject "audio":** none found in this repo (no Expo/RN, no PiP plugin, no `expo-av`). **NOT VERIFIED** for the actual shipping project.
- **First launch from a non-GCC IP:** the app is an API client; onboarding collects country + faces locally. **I found no geolocation-based availability filter anywhere** — `country` is stored/displayed and is a user-selected filter param only (`/api/mobile/v1/live?country=`). **So a US iPad would see the FULL catalogue, not a subset.**
  - **FACT THAT MATTERS TO GROK:** our reviewer notes told Apple *"if a shelf appears smaller from your review location, regional-availability filtering is active."* **I cannot find that feature in the code.** We may have described a capability we do not have.
- **Download / save / convert / M3U / Xtream / playlist import:** **absent.** `LocalStore.swift` persists only `onboarded`, `country`, `sound`, `activeFace`, `faces`, `watchlist` in `UserDefaults`. No file export, no URL import screen. (`PrivacyInfo.xcprivacy` declares only `UserDefaults` `CA92.1`, no tracking, no collected data types — and the app has **no sign-in, no ads SDK, no analytics SDK**; I verified by grep.)
- **In-app "Report rights issue" / per-item "Source" line:** **absent** — nothing of the kind exists in the Swift sources.
- **My List / resume:** **yes, on-device** (`UserDefaults`), no account required.

---

## 4. CATALOGUE — LIVE

- **How a row gets in:** `src/app/api/cron/discover-channels/route.ts` pulls the **community-maintained iptv-org index** (country files), filters for playability, applies `EXCLUDE` (sanctioned/political names) and `EXCLUDE_JUNK` (adult, casino, shopping). Its own header comment says so. **No permission is obtained from any broadcaster.**
- **Columns that exist on a channel row (`Channel`):** `id, name, logoUrl, streamUrl, country, countryCode, language, category, isHD, isFeatured, isActive, failCount, lastCheckedAt, lastStatus, number, epg`.
  **Fields that do NOT exist:** no source/index provenance, no official-domain field, no licence, no permission document, no `embeddable`, no `clearedForApp`, no `clearedBy/At`. `streamUrl` carries the comment *"Free-to-air / ad-supported public HLS stream"* — an **assertion in a comment, not evidence**.
- **Counts (live DB, today):** total rows **636**; **active 613**; `lastStatus`: **`ok` 613 / `unreachable` 23** (so all *active* rows pass our own manifest reachability check — but "ok" means the HLS manifest responds, **not** that the channel is licensed or 24/7).
  - `[Not 24/7]` in name: **21**. `[Geo-blocked]` in name: **4**. Distinct stream hosts: **311**; **233 hosts carry exactly one channel (38% of the catalogue)**.
  - **`raw.githubusercontent.com` / githubusercontent hosts: 8** (the stream is served from the community index repo itself).
  - Brand classes [EST — name-pattern regex, not legal review]: commercial/pay brands **51**; public broadcasters **47**; unclassified **515**.
- **Every channel in Apple's screenshot, one row each** (hostname only):

| Name | DB id | Stream host | Country | Rights basis we currently claim | Cleared for iOS? |
|---|---|---|---|---|---|
| Bahrain TV (720p) [Not 24/7] | *(row present; id not captured)* | `5c7b683162943.streamlock.net` | Bahrain | none stored | **NO** |
| Bahrain International | `cmsor42mf0019nn717no2ab5c` | `5c7b683162943.streamlock.net` | Bahrain | none stored | **NO** |
| Bahrain Quran | `cmsor42mf001ann71bif65edt` | `5c7b683162943.streamlock.net` | Bahrain | none stored | **NO** |
| Bahrain Sports 1 | `cmsor42mf001bnn71g7a1rbyq` | `5c7b683162943.streamlock.net` | Bahrain | none stored | **NO** |
| Bahrain Sports 2 | `cmsor42mf001cnn71h97dmz02` | `5c7b683162943.streamlock.net` | Bahrain | none stored | **NO** |
| ATN Bangla | `cmsor42mg003cnn7160b9ssrh` | `tvsen5.aynaott.com` | Bangladesh | none stored | **NO** |
| NTV | `cmsor42mg003dnn71hxudqa8r` | `tvsen5.aynaott.com` | Bangladesh | none stored | **NO** |
| Ekushey TV | `cmsor42mg003enn71fk15ydta` | `ekusheyserver.com` | Bangladesh | none stored | **NO** |
| Bangla Vision | `cmsor42mg003fnn71ybe9bocu` | `tvsen5.aynaott.com` | Bangladesh | none stored | **NO** |
| Green TV | `cmsor42mg003gnn71du5obr3m` | `app.ncare.live` | Bangladesh | none stored | **NO** |

- **Bahrain channels — official-domain inspection: NO, not done.** I have **not** opened the official pages. What I can state as fact: **all five Bahrain rows share one host, `5c7b683162943.streamlock.net`, which is a generic Wowza streamlock CDN hostname — it contains no Bahrain government or broadcaster domain.** Whether that stream is published on an official Bahrain TV page is **NOT VERIFIED**. I did not want to give Grok a vibe, so I am giving it this instead: host does not match any official domain, and no inspection has been performed.

---

## 5. CATALOGUE — VOD

- **Counts (active titles, today):** **YouTube 14,728 (87.5%)** · **archive.org 1,724 (10.2%)** · **no stream URL at all 389 (2.3%)** · total **16,841**.
- **How YouTube rows are chosen — this is better than I assume Grok expects, and it matters:**
  - `discover-vod` does **not** scrape search. It walks **17 hardcoded, named official distributor channels** via their public RSS feeds: Goldmines, Shemaroo Movies, B4U Plus, HAR PAL GEO, ARY Digital, HUM TV, Banglavision Drama, ABS-CBN Entertainment, GMA Network, Indosiar, **Family Feud (Fremantle)**, **BUZZR (Fremantle)**, DW Documentary, Real Stories, Melody Aflam, Millennium Cinemas. The file header describes them as *"distributor channels we have already vetted (official, embeddable, GCC-clean per the geo audit)"*, with per-channel `minDur` and language/country.
  - `update-dizi` walks **official broadcaster channel IDs per show via public RSS**, with per-show episode patterns — e.g. Kızılcık Şerbeti, Kuruluş Osman, Emanet, Teşkilat, Cennetin Çocukları, Esaret.
  - **The 222,000-foot-tall consequence: our VOD ingestion is already official-channel-bound in code. What is missing is that this binding is never persisted on the title row and never shown to a reviewer.**
  - **NOT VERIFIED:** whether all 14,728 YouTube titles trace to just those ~23 channels, or whether other ingestion paths exist. I cannot answer it without a per-title channel binding — which does not exist. **[EST]** a channel-RSS re-walk could reconstruct it **without the YouTube Data API key**, because channel RSS feeds are public.
- **Do we store, per title:** uploader channel ID — **NO**. `embeddable` — **NO**. licence — **NO**. evidence URL — **NO**. A per-title channel relation — **NO** (`Title` has no `channelId`; confirmed by reading the model).
- **What On Demand home looks like in the rejected binary:** a **poster wall of shelves** — I reviewed the submitted screenshot: "Game Shows (585)", "Malayalam Cinema (672)", "Bangla Natak & Cinema (678)", with film posters and star ratings. Visually it reads as a **cinema storefront**.
- **Filmhub titles in this binary:** **NO.** No Filmhub deal is signed; nothing ingested.

---

## 6. API GATE

- **Routes the app calls** (all in `src/app/api/mobile/v1/`): `home`, `live`, `vod`, `channel/[id]`, `title/[slug]`. Plus `auth/[...nextauth]`, `health`, and cron routes.
- **Can `/api/mobile/v1/*` filter a subset today?** **NO — the capability does not exist.** There is no `clearedForApp` field and no allowlist filter. The only filters are `isActive` and user params (country/category/language/q).
- **Do website and app share one catalogue query? YES — confirmed.** `src/lib/cached.ts` exports `getVodShelves` and `getVodGrid`; **both** `src/app/api/mobile/v1/vod/route.ts` **and** `src/app/(app)/vod/page.tsx` import and call them.
  - **→ Consequence neither plan has accounted for: a gate placed inside `cached.ts` would strip the WEBSITE too.** The app-only gate must be applied **at the route layer** (or via a separate query path), not in the shared cache. This is a concrete engineering constraint, and it is also the mechanism by which Grok's point 1 becomes sharp: whatever we do in the route, the site keeps serving the same data from the same functions.
- **What happens if `clearedForApp` defaulted false right now?** Nothing — the field does not exist, so no code reads it. If we added it and gated naively, the app would return **an empty catalogue** (`vod` returns shelves/grid with zero items; `live` returns an empty list). **The app degrades to an empty shell, not a crash** — but an empty shell is exactly the 4.2 risk Grok flags.
- **Android impact — Grok's plan may break it:** the Play app is **not built from this repo** (no `android/` anywhere; **NOT VERIFIED** where its source lives). The API is literally named `mobile/v1` and serves a `whisco.tv test` closed track. **If Android consumes the same `/api/mobile/v1/*`, then gating those routes empties the Android app as well.** I cannot rule this out, and it is a fact Grok's locked plan needs before it locks.

---

## 7. WORK ALREADY IN FLIGHT (since the 15 Sep rejection)

- **Nothing that affects the iOS binary.** No Swift, no plist, no Xcode project touched. **The binary cannot ship from here without the shipping project** (§1).
- **Committed:** `main` @ `62b7656` (docs: diagnosis + Grok prompt file). Branch `content-articles` @ `7afedf6` (Article model, publisher script, `/shows/[slug]`, `/articles/[slug]`, sitemap additions, 6 flagship articles ≈ 2,867 words). Branches `where-pages`, `canonical-host-fix`, `geo-health-fix` — all staged, undeployed.
- **Schema migration already run against PRODUCTION:** `npx prisma db push` created the **`Article` table** and added `Title.articles` in the **live database**. Additive only; production code does not read it. **Grok should know this happened.**
- **Also written to production data:** **6 article rows** in the live `Article` table (published). Web pages for them are **not** deployed.
- **Undisclosed-to-Grok production state:** all of the above. No other production change.
- **FACT CONFLICTS with Grok's locked plan (evidence, not preference):**
  1. **VOD is allowlist-driven, not scrape-driven** (§5). Grok's item 4 ("a small official-uploader YouTube set… no cinema/dizi storefront") may be *more achievable than it thinks* — the official binding already exists in code and can be persisted, and 1,724 archive.org items are already a non-YouTube base. It is a **rebuild of provenance, not a rebuild of ingestion.**
  2. **The shared cached query** (§6) means "gate the app, not the site" is not a config flag — it is a route-level change. Both plans must specify it.
  3. **The `discover-channels` cron will re-import channels** we delete from the DB on its next run, because it syncs from iptv-org. **Deleting rows without a persistent exclusion is not a fix — the app refills.** Grok's item 3 needs a `clearedForApp`-style persistent flag, not a delete.
  4. **The built `Info.plist` cannot be confirmed from this repo** (build 1 vs shipped 5). Removing `audio` here may not remove it from the artifact that ships.
  5. **Our reviewer notes describe a geo-filtering feature I cannot find in the code** (§3) — a fact both plans should account for before we write another note.
- **What Grok's plan would break if executed as written:**
  - **Android** — if it shares `/api/mobile/v1/*` (§6), gating empties it.
  - **The website** — if the gate is applied in `cached.ts` instead of the route, `/vod` empties for real users, which collides with the AdSense "low value content" fix and with the Sep 20 deploy.
  - **Channel health crons** — they iterate `Channel` rows; removing rows wholesale changes their budgets and the never-fails `lastStatus` KPI distribution we watch permanently.
  - Nothing in Grok's plan breaks the article work or the AdSense plan.

---

## 8. BUILD AND SUBMIT PATH

- **Exact commands to produce build 6: NOT VERIFIED.** I do not have the shipping Xcode project in the workspace (§1), and there is no CI file for iOS (`.github/workflows/` contains only web/cron workflows — 9 files).
- **How build 5 was likely produced:** the App Store Connect UI screenshot the founder supplied showed an **"Xcode Cloud" tab**, which implies an Xcode Cloud pipeline exists. **This is an inference from a screenshot, not a verified build path.**
- **Who holds the Apple 2FA device:** **the founder, Ali Albaharna** (ASC contact `+973 3930 3973`, `burn8887@gmail.com`). **NOT VERIFIED** whether anyone else has 2FA access.
- **Upload path:** build 5 appears in TestFlight (`internalBuildState: IN_BETA_TESTING`, `externalBuildState: READY_FOR_BETA_SUBMISSION`), so previous uploads went **TestFlight → App Store Connect**. There is a `.p8` API key in `.keys/` (issuer/key id on file, **values never printed**) — an API key **can** drive uploads via `altool`/Transporter, **but only from a machine that can build**, which I do not have.
- **How long a new build takes [EST]:** building/archiving + Xcode Cloud processing ≈ **30–90 min** if the shipping project is to hand and credentials are live. **Uncertain by a wide margin because the project location is unconfirmed.**
- **Hard dependency:** someone with a Mac + the shipping project must change the plist, bump the build number, archive and upload. **I cannot do this from this workspace.**

---

## 9. OPEN TASK LIST

| # | Task | Owner | Status |
|---|---|---|---|
| 1 | Locate the shipping Xcode project (the one that produced build 5) | Founder | **NOT STARTED — top blocker** |
| 2 | Confirm the built `Info.plist` and remove `audio` there; bump build number | Founder/Cursor (Mac) | NOT STARTED — blocked on 1 |
| 3 | Add provenance fields + `clearedForApp` (default false) to `Title` and `Channel` | Arena/Cursor | NOT STARTED — awaiting Grok's locked shape |
| 4 | Persist the existing official-channel binding per title (RSS re-walk; no API key needed) [EST] | Arena | NOT STARTED |
| 5 | Route-level gate in `/api/mobile/v1/*` (NOT in `cached.ts`) | Arena | NOT STARTED |
| 6 | Decide + implement the live shelf: four-point test per channel | Arena + Founder | NOT STARTED — blocked on Grok's §5 standard |
| 7 | Remove the 389 no-stream titles | Arena | NOT STARTED |
| 8 | Determine whether Android shares `/api/mobile/v1/*` | Founder | NOT STARTED |
| 9 | Rights pack ≤8 pages incl. the ToS/IFrame/RMF URLs Grok requires | Arena drafts, Founder reviews | NOT STARTED |
| 10 | Support URL vs Marketing URL decision (Marketing URL currently = catalogue home) | Founder | NOT STARTED |
| 11 | Listing rewrite (drop "Movies", drop "615 channels", drop named titles) + new screenshots from the new list | Founder (ASC) | NOT STARTED |
| 12 | YouTube Data API key | Founder | **BLOCKED ON FOUNDER** — needed for AdSense fix; **not** strictly needed for 4 if the RSS re-walk works |
| 13 | Android content gating decision (same exposure as iOS) | Founder | NOT STARTED — I raised this on 15 Sep |

**Blockers only I can see:**
- **The shipping Xcode project is missing from this workspace.** Until that is resolved, every plist/build statement any of us makes is unverified.
- **Website and app share `cached.ts`** — so "app-only gate" is a route change, not a cache change.
- **The channel cron re-imports** anything we delete — the fix must be a persistent flag.
- **Our reviewer notes claim geo-filtering we may not have.**

---

## 10. QUESTIONS FOR GROK (max 8, only where the answer changes the binary or the letter)

1. **Given VOD ingestion is already bound to 17 named official distributor channels + official broadcaster RSS for every dizi — do you still require removing the dizi/cinema storefront, or does *persisting and displaying* that existing official binding change your answer?** This is my biggest disagreement with your item 4; if the binding is documentary-able, the VOD shelf may be defensible rather than removable.
2. **Is a channel RSS re-walk (public, no API key, reproducible by the reviewer) acceptable as the evidence mechanism for the YouTube set, or does the letter require the YouTube Data API fields (`embeddable`, `license`) specifically?**
3. **Support URL is already `/contact`, not the catalogue home. Marketing URL is `whisco.tv`. Do you require the Marketing URL changed too, and to what?**
4. **Where do we draw the live line when the official broadcaster publishes the stream on a CDN host that does not match its domain (the Bahrain case: published plausibly from an official page, served from a generic streamlock host)?** Your three-part test fails them on hostname. Do they come out, or does a quoted official page satisfy the hostname arm?
5. **If Android shares `/api/mobile/v1/*`, does the gate ship anyway and we accept an empty Android pending its own rebuild — or do we build a separately-gated route for iOS?** Your plan currently breaks Android.
6. **You said "no published minimum catalogue size — do not invent one." Then what is the smallest live+VOD set you would put in front of a reviewer without inviting 2.1/4.2?** I need a number to build to, even if it is your judgement [EST].
7. **Our reviewer notes claimed regional-availability filtering that I cannot find in the code. Do we correct that in the new notes, and does admitting the miss help or hurt us?**
8. **Do you want the 389 streamless titles and the 23 unreachable rows removed in this build, or is that noise against the two cited guidelines?**

---

## IF GROK READS NOTHING ELSE

1. `main` @ `62b7656`; **one uncommitted file** (my draft plan). Nothing pushed. Freeze respected.
2. **The shipping Xcode project is not in this workspace** — repo copy is build 1, Apple has build 5. Every plist claim is unverified until that is located.
3. Rejection confirmed: **5.2.2 (rights evidence) + 2.5.4 (`audio` key)**, build 5, iPad Air 11-inch M3, second rejection.
4. **Apple's exhibit is Live TV** — 615 channels, Bahrain ×5, Bangla ×5. All **uncleared**; Bahrain rows all share a generic streamlock host, no official-domain inspection done.
5. **Live ingestion is the community iptv-org index** — no permissions; 8 streams served from `raw.githubusercontent.com`; 21 rows marked `[Not 24/7]`.
6. **VOD ingestion is NOT a scrape** — it is 17 named official distributor channels plus official broadcaster RSS for each dizi. The official binding exists in code but is **never persisted per title**.
7. **Website and app share `cached.ts`** — an app-only gate must be a route change, or the website empties too.
8. **The channel cron re-imports deleted channels** — the gate must be a persistent flag, not a delete.
9. **Grok's plan as written breaks Android and (if mis-scoped) the website** — both need an explicit answer.
10. **[EST] I agree with Grok's core rebuke:** a VOD-allowlist week does not answer a Live-TV exhibit, and my "the site is not Apple's jurisdiction" reasoning was too convenient. **My honest estimate of the plan-as-written clearing both citations: 20–35%, same as Grok's.** The evidence supports Live-first, paperable-only.
