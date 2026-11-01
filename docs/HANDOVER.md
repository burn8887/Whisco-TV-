# Salim — Road Awareness: Engineering Handover for Claude

**Prepared:** 2026-10-28 (Asia/Bahrain)
**Evidence rule:** Every operational claim is tagged **VERIFIED**, **FROM-CHAT**, **UNSURE**, or **UNKNOWN**. “Verified” means checked in the current checkout/configuration or a dashboard queried on the preparation date; it does not mean independently audited or production-tested. Historical documents are explicitly called out when stale.
**Never include or request secrets.** This document lists environment-variable *names* only. No keys, tokens, passwords, private keys, certificates, keystores, fingerprints, connection strings, or `.env` values are copied here.

## A. Ten-line summary

1. **VERIFIED:** Salim — Road Awareness (سالم) is a native Kotlin/Jetpack Compose Android app and a native SwiftUI iOS app; it is not Expo, React Native, or Flutter.
2. **VERIFIED:** Current GitHub repo is public `burn8887/Whisco-TV-`, default branch `main`; current work branch is `arena/74afd701-whisco-tv`, HEAD `34d87df8764a15f7b87c9480bc1b78504388914b`, clean at handover.
3. **VERIFIED:** Open draft PR #37 targets `main`: https://github.com/burn8887/Whisco-TV-/pull/37 . Do not merge it or touch `main` without the Founder’s direct approval.
4. **VERIFIED:** Current checked-in native demo versions are Android `0.7.0-demo` / code 7 and iOS `0.7.0` / build 7; the permanent package/bundle ID is `com.salimdrive.app`.
5. **VERIFIED:** Latest native CI at commit `2055538` passed on 2026-10-28: Android run `40627499812`; iOS run `40627499907`. These are unsigned CI outputs, not store submissions.
6. **VERIFIED:** A manual Android signed-artifact workflow succeeded once (run `40311763923`, 2026-10-26); its iOS job was skipped. No Play upload, TestFlight upload, or store release was verified.
7. **VERIFIED:** App camera queries use OSM/Overpass from the device; no bundled verified camera pack exists and no country-level coverage audit or redistribution clearance is complete.
8. **VERIFIED:** Shared-report service/admin code exists but is not deployed or connected to active native reporting; its planned database is persistent SQLite, not Neon.
9. **VERIFIED:** Vercel `salim` project exists but has no deployments, no project env vars, and no `www.salimdrive.com` custom-domain assignment. The approved domain is **FROM-CHAT** recorded as not live.
10. **FROM-CHAT:** Founder-approved hard rails: Bahrain first/GCC ambition, real native iOS+Android, fixed cameras only (no police/patrol/covert/radar-emission detection), ads in store builds but not demos, no unsafe basemap, shared reports/moderation desired, no secrets in chat, and no changes to other Whisco products.

## 1. Snapshot: product, audience, scope, and readiness

### Product

**VERIFIED:** Store/brand title approved in project records: **“Salim — Road Awareness”**; Latin brand **Salim**, Arabic **سالم**. Do not use Arabic **سليم**. Native display label is “Salim”. The app is a road-awareness assistant, not an emergency service, navigation replacement, official camera registry, or guarantee that every camera is known or current.

**FROM-CHAT:** Intended first market is Bahrain, with GCC-wide scope/ambition. Founder explicitly said on 2026-10-26 that all GCC camera coverage must be real and complete, with no corner-cutting. That requirement is **not achieved**: current data is live OSM volunteer mapping, not comprehensive official/licensed country datasets. Do not describe the app as having complete GCC data.

### Features by implementation state

| Feature | State | Evidence / limitation |
|---|---|---|
| Native Android app | **In progress** | Kotlin/Compose source; CI builds/tests; no verified physical-device acceptance or store distribution. |
| Native iOS app | **In progress** | SwiftUI/CoreLocation/MapKit source; CI tests and unsigned archive; no verified physical-device acceptance or TestFlight distribution. |
| GPS drive session | **Implemented in source; device acceptance incomplete** | Explicit user-started foreground location flow, visible status and local/audio alerts. Background/minimized operation is declared/implemented but not validated on physical devices. |
| Direction-aware alerts | **Implemented in source** | Core proximity engine requires fresh/usable fix and heading; more detail in §4. OSM coordinates may be missing/wrong/stale. |
| Live camera data | **Partial** | Both native apps query Overpass at `https://overpass-api.de/api/interpreter`; volunteer mapping coverage varies. The query sends a location-derived bounding box to the service. |
| Offline camera data | **Partial cache only** | On-device cached OSM responses can be reused while unexpired; bundled `CameraPack` is deliberately empty. No verified complete offline pack. |
| Maps | **Partial / platform asymmetric** | Android requests OSM raster tiles at `https://tile.openstreetmap.org/{z}/{x}/{y}.png`; iOS uses MapKit. Network, licensing/attribution, offline and UX behavior still need release-device validation. |
| Audio warnings | **Implemented in source** | Synthesized tone/speech; device/audio interruption and safe driving validation incomplete. |
| Community reporting | **Requested, not operational** | Local drafts/source client and separate service skeleton exist; no deployed backend, active native submissions/overlays, or staffed moderation verified. |
| Subscriptions | **Source only** | Android Play Billing and iOS StoreKit 2 code/product IDs exist; store product setup/purchase/restore/refund/renewal behavior not verified. |
| Advertising | **Source/config only** | Founder decision: no ads in demo, ads in Play/iOS store builds; only eligible idle screens, never active drive. Signed release paths require production AdMob variables; live serving/consent and store disclosures remain unverified. |
| Account/authentication | **Not implemented for consumers** | Product docs/code indicate no Salim user account or route-upload backend. Moderator auth token is only for future operator service. |
| Push notifications | **Not implemented / UNKNOWN as a feature** | No FCM/APNs registration flow found; local alerts/Android notifications are distinct. |
| Arabic UI | **Not implemented/UNKNOWN** | Brand Arabic spelling is approved; no localized strings/resource catalogs were found in inspected native trees. Native-market Arabic review remains pending. |

### What “production-ready” means here

**VERIFIED in project doctrine / FROM-CHAT requirements:** A green compile is not production readiness. At minimum, require: (1) Founder-approved verified legal operator and app identities; (2) genuinely usable, lawful, provenance-recorded camera data by country, with coverage/freshness limits honestly shown; (3) complete data-rights/ODbL and country legal review; (4) full privacy/data-flow/SDK and store declaration audit against exact signed binaries; (5) HTTPS privacy/support pages with verified monitored contacts; (6) store records, metadata, age/content ratings, privacy forms, subscriptions, ad configuration and review notes; (7) dedicated, verified signing artifacts; (8) physical iOS/Android drive, background, audio, battery, permission-denial, accessibility, weak-network and offline testing; (9) security, backups, moderation/complaints if reports enabled; (10) explicit Founder approval for signed artifact distribution and separately for store uploads. No single checklist item proves platform approval.

## 2. Status now

**Where we are:** Salim source remains a tracked capsule inside the public Whisco TV repository. Two native platforms compile and test in hosted CI. Live OSM/Overpass queries are present, but coverage is incomplete and legally/operationally unverified; the shipped static packs are empty. A report API/admin console exists only as source. Store signing produced a successful Android artifact historically, but no store upload or TestFlight processing is evidenced. Phase 4 company/legal documents were pushed on this branch; they explicitly block publication/filing until entity, contacts, data handling and counsel are verified. The current PR is draft and open. Current Vercel Salim project has no deployments.

| Area | State | What is actually known |
|---|---|---|
| Mobile app | **In progress** | Native Kotlin/Compose + SwiftUI sources; current CI green; store builds/device acceptance incomplete. |
| Backend/API | **Blocked** | Python report-service code and admin HTML exist; not deployed, not integrated into active reporting UI, endpoint unset. |
| Database | **Blocked** | Native local cache stores exist; report service has SQLite schema. No Salim-managed production DB, Neon project, hosted database, migrations or seed pipeline verified. |
| Camera data pipeline | **Blocked** | Live on-device OSM queries exist, but no validated country dataset or automated ingestion/rights/freshness process; cannot satisfy the Founder’s complete-data requirement. |
| Web/admin/landing | **In progress** | Static `site/`, `deploy/`, Vite browser demo, and report admin source exist. Salim Vercel project has no deployments; no live domain verified. |
| Store listings | **Blocked** | Developer accounts are **FROM-CHAT** active; Play/App Store app records, store URLs/listings/products/tester tracks and submissions are **UNKNOWN**. No upload verified. |
| Legal pages | **Blocked** | Drafts only. `site/privacy.html` names an individual, `deploy/privacy.html` has entity placeholder; neither identity/contact claim is verified. Domain/mailboxes are not verified live. |
| CI/CD | **In progress** | Two native push workflows + manual signed-only workflow. No EAS. Latest native CI green at `2055538`; current later documentation commits did not match native workflow path filters. PR checks show Vercel pass. |

## 3. History, decisions, and reversals

Dates below are **FROM-CHAT or repository-history evidence**; inspect linked files before changing a ruling.

| Date / milestone | Decision / event | Rationale / current status |
|---|---|---|
| 2026-10-14 onward | Salim isolated beneath `salim-workspace/` in host repo; runtime materialized outside checkout; tracked source kept out of host automatic scanners. | Loss of prior disposable workspaces; preserve isolation and durable Git checkpoints. See `salim-workspace/README.md`, `tools/materialize.py`, `tools/promote.py`. |
| 2026-10-20 | Permanent ID `com.salimdrive.app`; store title “Salim — Road Awareness”; private standalone repository name `salim-drive` discussed. | **VERIFIED in source:** current IDs; separate `burn8887/salim-drive` repository availability/access **UNKNOWN** (GitHub call returned “Resource not accessible by integration”). |
| 2026-10-21 | Founder: “Drop police detection for now.” | Final hard rail remains: no police/patrol/covert/radar-emission detection. |
| 2026-10-21 | Ads permitted in Play/App Store builds, excluded from browser/demo; no ads during active drive. | Founder decision; current signing workflow enables ads for release builds, but production IDs/consent/store behavior still need audit. |
| 2026-10-21 | Basemap only if professional and user experience is not affected. | Founder condition. Android now uses OSM raster tile source and iOS MapKit; still test network/offline/attribution/accessibility. No paid Mapbox/MapLibre dependency was verified. |
| 2026-10-22 | Founder reinstated **fixed speed and seatbelt camera warnings** after prior removal. | Fixed mapped installations only; not an instruction to detect enforcement vehicles or RF. Current user restated broader fixed-camera GCC objective 2026-10-26. |
| 2026-10-22 | Native platform decision: no Flutter/React Native rewrite. | Two fully native apps is an explicit Founder requirement; share logic only if native/platform-safe. |
| 2026-10-22 onward | Real GPS alerts, clear acquisition/stale status, heading/distance filtering; full-screen drive UI. | Based on reported GPS/UX defects; see `DEVICE-FEEDBACK.md`. |
| 2026-10-22 to 2026-10-26 | Camera dataset strategy shifted from fictional/demo rows toward real mapped OSM data; no guessed coordinates in released pack. | Data provenance/safety claims; current code uses OSM queries and empty static `CameraPack`. Historical docs claim eight approximate Bahrain rows and `cameras.csv`; those claims conflict with current checkout and are stale. |
| 2026-10-26 | Founder: all GCC cameras, real data, real build; “don't cut corners.” | Requirement remains unmet; OSM coverage is not exhaustive and no approved country-by-country official/licensed dataset is bundled. |
| 2026-10-27 | Founder directly requested shared reports, moderation, community/user camera verification and a live agent operating review/backend. | Desired feature is approved at the product-intent level; current backend is still source-only and native flow inactive. Do not claim it is live. |
| 2026-10-26 to 2026-10-28 | Native CI and signing attempts; one signed Android build succeeded (run `40311763923`). | Signed artifact generation is not store upload. Later docs saying signing workflow “never ran” are stale. iOS job in that successful run was skipped. |
| 2026-10-28 | PR #37 draft and docs phases pushed; latest native CI green at 2055538. | Current branch work remains draft; no merge/publish authorization. |
| 2026-10-28 | Company/legal Phase 4 documents written, incorporating Bahrain 2025 Companies Law amendment research. | Drafts only; no lawyer approval, entity filing, web/app code change or publication. See document index. |

Other significant constraints: all financial documents treat actual revenue as `$0` until reconciled evidence; Founder input is USD 20,000/month available spending during Year 1 and no Founder salary until Year 5. This is **FROM-CHAT**, not evidence of cash, spending permission, or a transaction authorization.

## 4. Architecture and stack

### Text diagram

```text
Android (native Kotlin/Compose)                  iOS (native SwiftUI)
  LocationManager + explicit FGS                    CoreLocation + background location mode
  DriveService / DriveStore                         DriveModel / AlertEngine
  Geo + alert engine in Android core               Geo + alert engine in Swift
  CameraFeed ─────── HTTPS bbox query ───────────── CameraFeed
                         │
                         ▼
               OpenStreetMap Overpass API
               overpass-api.de (volunteer map data)

Android OSM raster tile requests ───────────────► tile.openstreetmap.org
 iOS MapKit (Apple map service) ─────────────────► Apple platform service

On-device persistence: Android SharedPreferences + local SQLite-backed hazard/trip stores
                     iOS UserDefaults + local SQLite OfflineStore

Separate future service (not deployed / no active client path):
Native app (not currently wired) ── HTTPS, if configured ──► Python report API
                                                              ├─ persistent SQLite
                                                              └─ token-protected moderator page

Separate Vite browser demo + static site/deploy artifacts (not the native app).
```

### Frameworks, versions and absence of frameworks

| Component | Current checked-in configuration |
|---|---|
| Android | **VERIFIED:** Android Gradle Plugin 8.13.2; Kotlin 2.2.21; Compose BOM 2025.10.01; Java/JVM toolchain 17; compile SDK 36; min SDK 26; target SDK 36; CI Gradle 8.13. |
| Android libraries | **VERIFIED:** Activity Compose 1.11.0; Lifecycle runtime Compose 2.9.4; AndroidX Core 1.17.0; coroutines Android 1.10.2; Play Billing KTX 7.1.1; Google Mobile Ads 25.5.0; UMP 4.0.0. |
| iOS | **VERIFIED:** Swift 5.0 setting; iOS deployment target 17.0; XcodeGen project; CoreLocation, SwiftUI, MapKit; SQLite3. CI selects Xcode 26.3 on macOS 15. |
| iOS ad SDKs | **VERIFIED:** Google Mobile Ads Swift package from 13.11.0; Google User Messaging Platform from 3.1.0. |
| Browser demonstrator | **VERIFIED:** React 19.2.0, Vite 6.4.4, plugin-react 4.3.4; Node 20+ documented. Separate from native apps. |
| Expo / React Native / EAS | **VERIFIED absent in inspected checkout:** no `app.json`, `app.config.*`, `eas.json`, Expo dependencies or EAS configuration. Do not invent EAS profiles/channels/commands. |
| Routing | Native screen/state composition; no React Navigation. Browser demo uses React app source. |
| State | Android `DriveStore`/Compose state; iOS `DriveModel` (`ObservableObject`); no cloud account state. |
| Maps | Android custom Compose map/tile rendering with OSM raster tiles; iOS MapKit. No Mapbox key/MapLibre package identified in current native dependencies. |
| Auth/push | No consumer auth or remote push system verified. Local Android notification/audio behavior exists. |
| Backend/database | Python standard-library HTTP server + SQLite for the dormant reporting service. No Neon/Prisma schema belongs to Salim; root Prisma belongs to host Whisco TV. |

### Location, alerts, foreground/background and offline

- **Android manifest:** `INTERNET`, fine/coarse location, `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_LOCATION`, `POST_NOTIFICATIONS`, and Play billing permission. No `ACCESS_BACKGROUND_LOCATION` observed. `DriveService` is non-exported, `foregroundServiceType="location"`, `stopWithTask="false"`, and user-started; it returns `START_NOT_STICKY`, requests GPS plus network provider, posts an ongoing notification and explicitly stops on session end/revoked precise permission/stale fix.
- **iOS:** `NSLocationWhenInUseUsageDescription` explains session location; `UIBackgroundModes` includes `location` and `audio`; code sets `allowsBackgroundLocationUpdates=true` during a user-started GPS session and turns it off at end. No Always authorization prompt observed. Must validate actual iOS behavior and App Review rules on devices.
- **Alert filter:** native core validates plausible coordinates, accuracy (default max 50 m), fix freshness/elapsed time and speed; real alert requires speed at least 2 m/s, course, country match, non-expired hazard, within dynamic 400–1000 m (`speed × 30 s`, clamped), forward bearing within 55°, and hazard heading if known within 55°. Duplicate suppression is engine-managed. Treat as code behavior, not independently safety-validated.
- **Session stale/weak fix:** Android/iOS suspend alerts when fix is stale/invalid; test cold-start, OS suspension, permission revocation and background execution. Do not claim reliable life-safety behavior.
- **Offline:** cached OSM responses are stored locally and expire after 30 days; recent-area query throttling is 30 minutes; query radius is 12 km, returned/cache proximity is bounded to 25 km, and cache is capped at 5,000 items in code. This is not an offline GCC data pack. Map tile and MapKit behavior still depends on provider/network/platform caching.

## 5. Repository, branch and structure

### Git facts

- **VERIFIED:** GitHub URL `https://github.com/burn8887/Whisco-TV-` (public); default branch `main`; origin is `https://github.com/burn8887/Whisco-TV-.git`.
- **VERIFIED:** Working branch `arena/74afd701-whisco-tv`; base commit noted by session context `32c4749660862852fd4b59cc53d8aa4acb30aed9`; HEAD at handover `34d87df8764a15f7b87c9480bc1b78504388914b` (`Record Salim Phase 4 documentation push`); no uncommitted changes at inspection.
- **VERIFIED:** PR #37, title “Salim 0.6.0 — cameras on both platforms, real map, sharper build”, draft/open, base `main`, head `arena/74afd701-whisco-tv`, merge state CLEAN; URL https://github.com/burn8887/Whisco-TV-/pull/37 . Title version is stale relative to checked-in demo version 0.7.0.
- **VERIFIED:** Latest two commits are docs only: `f7fcaf8` Phase 4 legal/company docs; `34d87df` records Phase 4 push. Earlier Phase 3 and budget docs are `b6b4b89`, `5b708ec`, `364cadf`.
- **VERIFIED / hard rule:** never switch branches, rename this branch, push another branch, or push/commit to `main`. Use only `git push origin arena/74afd701-whisco-tv` if separately authorized. Do not merge/close PR #37 without the explicit PR operation and direct Founder authorization.
- **VERIFIED / caution:** push triggers connected Vercel previews on the host `whisco-tv` project. Two latest doc commits created READY preview deployments. No manual Vercel deployment or production target was created by this work. Avoid unrelated code and do not manipulate Vercel.
- **UNKNOWN:** private repository `burn8887/salim-drive` was named in older docs, but current `gh repo view burn8887/salim-drive` returned `GraphQL: Resource not accessible by integration`; do not assert the repo is gone or accessible. Current source of truth is this capsule unless the Founder provisions access.

### Annotated tree (Salim-focused)

```text
salim-workspace/
├── README.md                         capsule rules, isolation, materialize/build notes
├── .gitignore                        capsule-level ignore/allowlist rules
├── apps/
│   ├── salim-android/                native Android app + core module, tests, icons/resources
│   ├── salim-ios/                    native SwiftUI app, assets, privacy manifest, XCTest
│   └── salim-web/                    React/Vite browser demonstrator; JS sources use .source
├── packages/salim-core/              JS reference geospatial engine + Node tests (.source)
├── report-service/                   dormant Python API/admin + SQLite schema and tests
├── site/                             authored landing/privacy/support HTML/CSS
├── deploy/                           deployable static bundle, headers/redirects and HTML
├── docs/                             project, technical, product, store, legal, business docs/assets
└── tools/                             materialize/promote, QA, imports, checks, setup, asset scripts

.github/workflows/
├── salim-android-build.yml            approved Salim-only unsigned Android CI
├── salim-ios-build.yml                approved Salim-only unsigned iOS CI
└── salim-release-signing.yml          manual signed artifacts only; never store uploads
```

The repository root also contains the Whisco TV Next.js/Prisma project, its `package.json`, `.env.example`, `vercel.json`, and existing workflows. **Those are not Salim configuration.** Root `package.json` identifies `whisco-tv` and declares Next.js 16.3.0, React 19.2.8, Prisma 5.22.x, and host scripts including `db:push`/`db:seed`; root `vercel.json` defines Whisco cron routes. The root `.env.example` names `DATABASE_URL`, `AUTH_SECRET`, and `CRON_SECRET`. **Do not run root app/db commands, copy root environment names/values, or modify those files for Salim.** Root `docs/` is otherwise the existing Whisco TV documentation tree. At the Founder’s explicit request, this same secrets-free handover is also copied to `docs/HANDOVER.md`; keep the two copies synchronized. The canonical Salim library source remains `salim-workspace/docs/HANDOVER.md`.

### Key source/test/assets paths

- Android: `salim-workspace/apps/salim-android/app/src/main/java/app/salim/` (`MainActivity.kt`, `DriveService.kt`, `DriveStore.kt`, `CameraFeed.kt`, `CameraPack.kt`, `HazardDatabase.kt`, `HazardRepository.kt`, `OsmMap.kt`, `MapTiles.kt`, `AudioAlerts.kt`, `Billing.kt`, `AdMob.kt`, `PrivacyNotice.kt`, `CommunityReports.kt`). Core: `.../core/src/main/kotlin/app/salim/core/{Geo,Sections,Sync}.kt`.
- Android tests: `.../core/src/test/kotlin/app/salim/core/{EngineTest,SyncTest}.kt`; instrumentation: `.../app/src/androidTest/java/app/salim/{DriveLifecycleTest,HazardDatabaseTest}.kt`.
- iOS: `salim-workspace/apps/salim-ios/Salim/` (`SalimApp.swift`, `DriveModel.swift`, `Geo.swift`, `CameraFeed.swift`, `CameraPack.swift`, `OfflineStore.swift`, `Store.swift`, `Paywall.swift`, `Ads.swift`, `AudioAlerts.swift`, `PrivacyNotice.swift`, `Info.plist`, `PrivacyInfo.xcprivacy`). Tests: `SalimTests/EngineTests.swift`, `PackTests.swift`.
- Web: `salim-workspace/apps/salim-web/src/{App.jsx.source,Map.jsx.source,main.jsx.source,style.css}`; `vite.config.js.source`; package and lock files in app directory.
- Store assets: `salim-workspace/docs/store-icon-512.png`; `store-feature-1024x500.png`; native icons at Android `app/src/main/res/mipmap-*` and iOS `Salim/Assets.xcassets/AppIcon.appiconset/`.
- Data: no current checked-in `cameras.csv`, `.geojson`, `.pbf`, `.mbtiles`, or static real GCC pack was found. Android and iOS `CameraPack` return empty. Current live source is queried by `CameraFeed`.
- Tools: `tools/materialize.py` (capsule runtime); `tools/promote.py` (standalone-tree generation); `tools/verify_isolation.py`; `tools/check_workflows.py`; `tools/check_site.py`; `tools/build_deploy.py`; `tools/check_android_apk.py`; `tools/import-cameras.py`; `tools/report_native_tests.py`; `tools/setup-android-linux.sh`; `tools/make-store-assets.sh`; `tools/test_*.py`.

## 6. Accounts and services map (no secrets)

| Service | Verified status / names / IDs | Unknowns / safety boundary |
|---|---|---|
| GitHub | Repo `burn8887/Whisco-TV-`, public, default `main`; current branch and PR as §5. Three Salim workflow files. | Claude has no access by premise; Founder must use secure platform connection. Never request credentials in chat. |
| GitHub Actions release environment | Workflow names environment `salim-release`; signed Android run succeeded 2026-10-26, so required Android secrets were available for that run. | Current environment protection/reviewer, branch rules, current secret existence/rotation and Apple secret state not inspected. Values are never to be read/copied. |
| Vercel Salim project | **VERIFIED via connected Vercel dashboard:** project `salim`; project ID `prj_liHchOWtXIm6AeqmGhVAQ3rYIZ3L`; team/account ID `team_QrfLApJ76KNWBxlkkuttI0Pa`; root `salim-workspace/site`; framework unset; Node `24.x`; output `.`; function region `iad1`; generated project domain `salim-tan.vercel.app` verified; project `live=false`; deployment list empty; Salim project environment-variable list empty. | No custom domain attached. No Salim deployment URL serving a built page was found. Do not deploy without Founder approval. |
| Vercel host project (not Salim) | Recent READY preview deployments tied to PR #37 for commits `f7fcaf8` and `34d87df`; Vercel PR checks pass. | These are on Whisco project `whisco-tv`, not a Salim production deployment. Do not affect it. |
| Vercel host env names (not Salim) | Vercel list for `whisco-tv` showed names `ADS_TXT`, `AUTH_SECRET`, `DATABASE_URL`, marked sensitive; values intentionally not read. | They belong to host Whisco; never copy/use for Salim. |
| Expo / EAS | **VERIFIED absent in repo/config.** | No Expo account/project, EAS slug, profile, channel, build or credential exists in inspected configuration; exact dashboard status UNKNOWN. Do not provide EAS build commands. |
| Neon | No Salim Neon URL/config/migrations found. | Neon account/projects/branches/region/plan **UNKNOWN**; no Neon dashboard checked. Do not assume it exists. |
| Google Play Console | **FROM-CHAT:** Founder says Play developer account is active. | App listing/package ownership, account type, developer ID, test tracks, tester cohort, products, policy forms and upload history **UNKNOWN**; dashboard not accessed. |
| Apple Developer / App Store Connect | **FROM-CHAT:** Apple Developer account active. | Team ID, App Store Connect app record, product IDs, certificate/profile state, TestFlight groups/build history **UNKNOWN**; dashboard not accessed. |
| AdMob / Google UMP | SDKs in native code; source uses Google test ad IDs by default; signed build requires four GitHub Actions repository variables (names §8). | AdMob account/app/ad-unit values, consent regions and live serving **UNKNOWN**; values omitted. |
| OpenStreetMap / Overpass | Code calls `overpass-api.de`; Android raster map requests `tile.openstreetmap.org`; OSM data licensed ODbL and needs appropriate attribution/rights compliance. | No OSM account, SLA, quota or coverage guarantee; no agreement. Provider logs/IP processing need privacy review. |
| Maps / navigation | iOS MapKit, Android OSM raster tiles. | No Google Maps, Mapbox, MapLibre, HERE or Garmin account found in Salim native code/config. |
| Report service host | Compose file describes Docker service on loopback 8080 with persistent Docker volume `salim_reports` and TLS reverse proxy. | No host, DNS, backup, persistent production volume, TLS endpoint, monitoring, human moderator or deployed service identified. |
| Domain / DNS / email | **FROM-CHAT:** only approved domain `www.salimdrive.com`; intended addresses `support@salimdrive.com` and `legal@salimdrive.com`. | **FROM-CHAT / NOT VERIFIED:** domain not live; mailbox ownership, deliverability, monitoring and staffing unknown. Vercel domain list had no custom Salim domain. Do not substitute another domain or invent addresses. |
| Analytics/crash/reporting | No Salim analytics/crash SDK or consumer account backend was identified in inspected mobile dependency files. | Not a comprehensive binary audit. Root `@vercel/analytics` belongs to Whisco and is not evidence of Salim analytics. |
| Push/payment/storage | Local device stores; Play Billing and StoreKit source; no push or cloud storage service found. | Apple/Google product setup, server receipt validation, push credentials, external storage and analytics providers UNKNOWN. |

## 7. Release configuration, signing, permissions

### Identifiers and versions

- Android `namespace`: `app.salim`; **applicationId** `com.salimdrive.app`; min SDK 26; compile/target SDK 36; default `versionName="0.7.0-demo"`, `versionCode=7`.
- iOS bundle ID `com.salimdrive.app`; iOS deployment target 17.0; checked-in `MARKETING_VERSION=0.7.0`, `CURRENT_PROJECT_VERSION=7`; visible app name “Salim”.
- Store title decision: **Salim — Road Awareness**. The GitHub PR title’s “0.6.0” is not the current source version.

### Signing

- Android GitHub Environment secrets (names only): `SALIM_ANDROID_KEYSTORE_BASE64`, `SALIM_ANDROID_KEYSTORE_PASSWORD`, `SALIM_ANDROID_KEY_ALIAS`, `SALIM_ANDROID_KEY_PASSWORD`, `SALIM_ANDROID_CERT_SHA256`; job uses ephemeral runner path `SALIM_ANDROID_KEYSTORE_PATH`.
- Apple Environment secrets: `SALIM_APPLE_TEAM_ID`, `SALIM_APPLE_CERT_P12_BASE64`, `SALIM_APPLE_CERT_PASSWORD`, `SALIM_APPLE_PROFILE_BASE64`, `SALIM_APPLE_PROFILE_NAME`.
- **FROM-CHAT:** Founder keeps signing keys outside the repo in `~/salim-keys`; never stage keystores/certificates. Signing secrets belong only in GitHub Environment `salim-release`, never chat, terminal transcript, issue, repo, or Vercel.
- **VERIFIED:** Signed workflow verifies Android cert fingerprint and iOS profile identity, removes temporary key material, retains artifact 14 days, and does not upload to stores.
- **UNKNOWN:** Current secrets/profiles/Apple identity state; do not ask for values. Public certificate fingerprints may be shared only if genuinely needed; not included here.

### Ad variables (names only)

Four **GitHub repository Actions variables** expected for production signed builds: `SALIM_ADMOB_APP_ID_ANDROID`, `SALIM_ADMOB_BANNER_ANDROID`, `SALIM_ADMOB_APP_ID_IOS`, `SALIM_ADMOB_BANNER_IOS`. Do not paste values into chat or this document. Unsigned CI falls back to Google test identifiers. Android release sets ads enabled whenever a release version is supplied; iOS release workflow explicitly passes `SALIM_ADS_ENABLED=YES`. Confirm release UX and consent behavior before store submission.

### Permissions and user text

- Android: `INTERNET`; `ACCESS_FINE_LOCATION`; `ACCESS_COARSE_LOCATION`; `FOREGROUND_SERVICE`; `FOREGROUND_SERVICE_LOCATION`; `POST_NOTIFICATIONS`; `com.android.vending.BILLING`; TTS service query. No `ACCESS_BACKGROUND_LOCATION` observed.
- Android rationale in notification text: drive active; camera coverage varies; end drive to stop location. Need prominent pre-permission explanation, target-SDK declarations, policy review and actual-device tests.
- iOS: `NSLocationWhenInUseUsageDescription`: “During a drive session, Salim uses precise location, speed and heading to calculate nearby road alerts. Location updates stop when you end the session. Precise routes are not uploaded.” `UIBackgroundModes` contains `location` and `audio`. `DriveModel` requests When-In-Use and enables background location updates in an active session.
- **Important privacy mismatch to resolve:** Overpass query contains a derived 12 km bounding box; user’s precise route is not sent to Salim backend according to source design, but some location-derived map query is sent to a third-party endpoint. Do not publish blanket “location never leaves device” claims without network/provider audit.
- iOS `PrivacyInfo.xcprivacy` currently sets tracking false and collected data types empty while AdMob SDK is included. This must be reconciled against the SDK’s actual behavior and Apple privacy disclosures before submission.

## 8. Environments, variables, URLs, migrations

### Environments

| System | Dev | Preview/test | Production |
|---|---|---|---|
| Native Android/iOS | Materialized local runtime; test ad IDs; unsigned debug/simulator | GitHub Actions native tests on pushes to approved feature branches; artifacts 14-day retention | Manual GitHub `salim-release` signing only; artifact output, no store upload |
| Vercel `salim` | No deployment observed | No deployments observed | No production deployment observed; `salim-tan.vercel.app` assigned as project domain, but project deployment list empty |
| Reporting API | Local unit tests/temp SQLite | No shared staging API found | No deployed prod API found; `SALIM_REPORT_API_URL` empty in Android build config |
| Database | Local app caches; report-service test temp SQLite | None verified | None verified; no Neon branches/migrations/seed |
| Website | Static `site/` and generated `deploy/` files | Vercel Salim project configured to `salim-workspace/site`, no deployments | Approved `www.salimdrive.com` not live per Founder/project record |

### Variable names (no values)

**Salim native build / CI:**
- `SALIM_ANDROID_KEYSTORE_PATH`, `SALIM_ANDROID_KEYSTORE_PASSWORD`, `SALIM_ANDROID_KEY_ALIAS`, `SALIM_ANDROID_KEY_PASSWORD` (temporary signed-run inputs).
- GitHub secrets `SALIM_ANDROID_KEYSTORE_BASE64`, `SALIM_ANDROID_KEYSTORE_PASSWORD`, `SALIM_ANDROID_KEY_ALIAS`, `SALIM_ANDROID_KEY_PASSWORD`, `SALIM_ANDROID_CERT_SHA256`.
- GitHub secrets `SALIM_APPLE_TEAM_ID`, `SALIM_APPLE_CERT_P12_BASE64`, `SALIM_APPLE_CERT_PASSWORD`, `SALIM_APPLE_PROFILE_BASE64`, `SALIM_APPLE_PROFILE_NAME`.
- GitHub repository variables `SALIM_ADMOB_APP_ID_ANDROID`, `SALIM_ADMOB_BANNER_ANDROID`, `SALIM_ADMOB_APP_ID_IOS`, `SALIM_ADMOB_BANNER_IOS`.
- `SALIM_REPORT_API_URL` (empty by default; do not enable without service/legal gates); Android `FEED_URL` build field is empty, while `CameraFeed` currently uses hard-coded Overpass endpoint.

**Future report service (`report-service/.env`, not present/never commit):** `SALIM_REPORT_PEPPER`, `SALIM_MODERATOR_TOKEN`, `SALIM_REPORT_ORIGIN`; runtime `SALIM_REPORT_DB` (Compose sets `/app/data/reports.sqlite3`), `HOST` (Compose `0.0.0.0`), `PORT` (8080). The code defaults origin to `https://www.salimdrive.com`. These are not configured for production.

**Root `.env.example` / Vercel Whisco, NOT Salim:** names `DATABASE_URL`, `AUTH_SECRET`, `CRON_SECRET`. Root `.env.example` has placeholders only; Vercel `whisco-tv` lists `ADS_TXT`, `AUTH_SECRET`, `DATABASE_URL` sensitive. Never use these for Salim.

### URLs, migration, database

- No Salim production API URL or public privacy/support URL verified. Intended domain paths in docs: `https://www.salimdrive.com/privacy` and `/support`; not verified live.
- Report-service future API outline: `/health`, `/v1/reports`, `/v1/reports/{uuid}/votes`, `/v1/reports/{uuid}`, `/v1/cameras?country=BH`, `/v1/camera-overrides`, `/v1/admin/reports`, `/v1/admin/reports/{uuid}/decision`; not an active service contract until API deployed/versioned and client integrated.
- No Salim SQL migration system. Report service auto-creates SQLite tables/schema from `report-service/server.py`; native iOS has local SQLite `OfflineStore`, Android includes local hazard persistence. No production migration/seed/deploy job.
- No Neon branches or DB region/plan known. Do not create/change a DB without Founder approval.
- `salim-workspace/tools/promote.py` transforms the capsule into a standalone tree; do not hand-edit generated runtime output as canonical source.

## 9. Exact workflows and safe commands

### Rebuild browser demonstrator locally

Materialize outside the repo first; do not treat the generated directory as source of truth.

```sh
python3 salim-workspace/tools/materialize.py --output /home/user/Salim
cd /home/user/Salim/apps/salim-web
npm ci
npm test
npm run build
npm run dev
```

Vite serves at `0.0.0.0:5174`; browser demo is not a native build or live service. If the path `/home/user/Salim` already exists, do not overwrite/delete it; the materializer has safety checks.

### Android local

```sh
salim-workspace/tools/setup-android-linux.sh --check
salim-workspace/tools/setup-android-linux.sh
cd "$(salim-workspace/tools/setup-android-linux.sh --print-module)"
gradle :core:test :app:assembleDebug :app:lintDebug
```

Setup pins/installs JDK 17, Android platform 36/build-tools 36.0.0 and Gradle 8.13; it adapts memory settings. Current sandbox has no Android SDK/JDK/Xcode by project notes; hosted CI is the source of current compile evidence.

### iOS local (macOS with Xcode)

```sh
python3 salim-workspace/tools/materialize.py --output /path/outside/repo/Salim
cd /path/outside/repo/Salim/apps/salim-ios
brew install xcodegen
xcodegen generate
xcodebuild -project Salim.xcodeproj -scheme Salim -destination 'platform=iOS Simulator,name=iPhone 16 Pro' test
```

Use installed Xcode version appropriate to project; CI currently selects Xcode 26.3. Never put a distribution certificate/profile in the repo.

### Safe repo checks / tests

```sh
python3 -m unittest discover -s salim-workspace/tools -p 'test_*.py'
python3 -m unittest discover -s salim-workspace/report-service -p 'test_*.py'
python3 salim-workspace/tools/check_workflows.py
python3 salim-workspace/tools/verify_isolation.py
python3 salim-workspace/tools/check_site.py salim-workspace/site --allow-placeholders
```

No command above deploys or uploads. Static site checks may intentionally fail if entity placeholders remain; do not “fix” by inventing an entity.

### Hosted CI

- Android workflow: `.github/workflows/salim-android-build.yml`; push path filters cover Android source, materializer/test/report tools and workflow; manual `workflow_dispatch` also available. Ubuntu 24.04, Temurin 17, Gradle 8.13, SDK 36, JVM tests, debug APK, release AAB unsigned, lint, 16 KB alignment, API 35 emulator tests. Artifacts retained 14 days.
- iOS workflow: `.github/workflows/salim-ios-build.yml`; same branch/path-gated push and manual trigger. macOS 15/Xcode 26.3, generate Xcode project, simulator XCTest, unsigned generic-device archive; no signing/upload. Artifacts retained 14 days.
- Signed workflow: `.github/workflows/salim-release-signing.yml`, **manual `workflow_dispatch` only**; inputs `version_name`, `version_code`, `platform` (`both|android|ios`), `confirm_identity` (must equal `com.salimdrive.app`). Requires environment review/secrets. Builds/signs artifacts only and retains 14 days. **Never uploads**.
- Do not dispatch a release build until Founder authorizes that specific artifact; the prior authorization to prepare/sign workflows does not authorize store upload.

### Store upload, EAS, Vercel deploy, DB migration

- **EAS/OTA:** no EAS configuration and no OTA update process verified. Do not create `eas.json`, Expo config, or OTA channel without new Founder-approved technical decision.
- **Vercel:** no Salim deployment verified; do not run `vercel deploy`, Vercel connector deployment calls, or domain changes without direct Founder permission. Vercel project integration can auto-create Whisco preview builds on PR pushes; this is an existing integration side effect.
- **Database migrations:** no Salim migration command exists. Report DB schema auto-created in Python SQLite; production DB setup is pending and no migration should be invented.
- **TestFlight / Play upload:** no safe automated upload command exists in current approved workflow. Uploads are explicitly outside the signed workflow and require separate Founder authorization. Do not use any other app’s certificate, provisioning profile, keystore or listing.

## 10. Data inventory and GCC country-by-country status

### Data actually used

1. **Live OpenStreetMap camera nodes**, requested directly from each device through Overpass. Supported query tags: `highway=speed_camera`, or `highway=enforcement` with `enforcement=maxspeed|average_speed|traffic_signals|red_light|seatbelt|seat_belt`. Client maps these into broad camera kinds; OSM tag completeness and accuracy are volunteer-dependent.
2. **No approved static country pack.** `CameraPack` intentionally returns empty on both platforms. No checked-in `cameras.csv` found in current source. Older docs claiming eight approximate Bahrain cameras and a bundled `assets/cameras.csv` are inconsistent with current code and must be treated as stale until source is re-verified.
3. **OSM raster tiles** on Android, with OSM attribution; iOS MapKit. Tile map data is separate from camera-alert dataset.
4. **Fictional/demo road conditions** only in debug/simulation paths, not real-world camera truth. Do not include demo/synthetic coordinates in store build or describe them as actual installations.
5. **Local user data:** trips/preferences/local road-condition drafts/camera caches. No Salim account/backend route upload verified. Overpass map query reveals a 12km bounding box derived from current location to a third party; provider logging/retention is unknown.
6. **Future user reports:** not collected/shared yet. Planned service accepts BH/SA/AE/QA/KW/OM and fixed camera types, pseudonymous HMAC contributor IDs, mandatory human moderation and 365-day report/vote/audit deletion; these are design/source plans, not live operational facts.

### Country matrix

| Country | Current app query support | Verified live source/rights/freshness | Coverage and gap |
|---|---|---|---|
| Bahrain (BH) | OSM/Overpass bounding box | **VERIFIED code:** OSM nodes only; ODbL source. No verified permission/official feed agreement or per-record audit. **FROM-CHAT/research:** GDT eTraffic camera locator exists but machine-readable reuse has not been secured. | Unknown/incomplete. No valid bundled pack. Never claim full Bahrain camera coverage. |
| Saudi Arabia (SA) | OSM/Overpass bounding box | Same OSM source only; no Saudi authority feed ingested/licensed in repo. | Unknown/incomplete; no quantitative coverage/freshness audit. |
| United Arab Emirates (AE) | OSM/Overpass bounding box | Same OSM source only; no UAE authority feed ingested/licensed. | Unknown/incomplete; no quantitative coverage/freshness audit. |
| Qatar (QA) | OSM/Overpass bounding box | Same OSM source only; no Qatar authority feed ingested/licensed. | Unknown/incomplete; no quantitative coverage/freshness audit. |
| Kuwait (KW) | OSM/Overpass bounding box | Same OSM source only; no Kuwait authority feed ingested/licensed. | Unknown/incomplete; no quantitative coverage/freshness audit. |
| Oman (OM) | OSM/Overpass bounding box | Same OSM source only; no Oman authority feed ingested/licensed. | Unknown/incomplete; no quantitative coverage/freshness audit. |

**Critical:** “Country supported” means the app assigns a country code inside a coarse rectangular bounding box and queries nearby OSM nodes. It does **not** mean verified official data, country-wide coverage, map freshness, accuracy, or reuse rights have been established. No per-country source license/permission beyond OSM’s general database licensing has been cleared for the product. Seek legal review for ODbL, attribution and derivative database obligations before distribution.

### Ingestion/storage/delivery

- No automated data ingestion or ETL verified. `tools/import-cameras.py` is a manual import/validation helper; do not use it to add real records until each record has source, type, coordinate precision, date, legal reuse basis and review evidence.
- Both native `CameraFeed` clients POST Overpass QL with a location-derived bbox; app caches locally (Android SharedPreferences; iOS UserDefaults) and filters results by proximity/expiry. No first-party camera API is configured.
- Android raster tiles use `/z/x/y.png` from `tile.openstreetmap.org`; no custom tile host/key found. iOS MapKit uses Apple map service.
- Future report DB planned SQLite with human-approved camera additions/overrides; not deployed, no production data exists.
- No row count/freshness job/dataset checksum per country measured. **UNKNOWN.**

## 11. Release history (checked, no secrets)

### EAS / store submissions

- **EAS builds:** none found/configured in repo; dashboard status **UNKNOWN**.
- **Google Play uploads/releases:** none verified. Developer account active is **FROM-CHAT**, but app record/listing/build upload status **UNKNOWN**.
- **TestFlight/App Store submissions:** none verified. Developer account active is **FROM-CHAT**, but app record/build upload/status **UNKNOWN**.

### Relevant GitHub Actions builds

| Run | Date | Commit | Result | Artifact / meaning |
|---|---|---|---|---|
| Android `40627499812` | 2026-10-28 | `20555383de7b862613ec2a00959bc01e6e76505c` | Success | Unsigned CI package/tests/lint/emulator/16 KB checks; not store upload. https://github.com/burn8887/Whisco-TV-/actions/runs/40627499812 |
| iOS `40627499907` | 2026-10-28 | same `2055538…` | Success | Simulator tests and unsigned device archive; not installable/uploaded. https://github.com/burn8887/Whisco-TV-/actions/runs/40627499907 |
| Android `40348165344` | 2026-10-26 | `8f48de95213b840c5764ae2f62e8cbc01f9265d6` | Success | Historical CI, unsigned. https://github.com/burn8887/Whisco-TV-/actions/runs/40348165344 |
| iOS `40348165651` | 2026-10-26 | same `8f48de9…` | Success | Historical simulator/unsigned archive. https://github.com/burn8887/Whisco-TV-/actions/runs/40348165651 |
| Android `40316308868` | 2026-10-26 | `0915dfa…` | Success | 24 Android tests; 16 KB ZIP/ELF alignment, emulator; unsigned. https://github.com/burn8887/Whisco-TV-/actions/runs/40316308868 |
| iOS `40316308926` | 2026-10-26 | `0915dfa…` | Success | 17 XCTest according to repo release checklist; unsigned device archive. https://github.com/burn8887/Whisco-TV-/actions/runs/40316308926 |
| Signed release `40311763923` | 2026-10-26 | `39eb48aa3a587f251dcc9d84a2fd765c4dc46f60` | Success | Android signing, packaging, signature check succeeded and artifact retained; iOS job was skipped. Workflow run metadata does not expose `version_name/version_code`; **UNKNOWN**. No store upload. https://github.com/burn8887/Whisco-TV-/actions/runs/40311763923 |
| Signed release `40310945230` | 2026-10-26 | `f9f2d29…` | Failed | Android failed at “Verify the signed bundle and APK”; exact log text unavailable in current sandbox. iOS skipped. |
| Signed release attempts `40310074370`, `40309764713`, `40309093068`, `40307024072`, `40306433081` | 2026-10-26 | several SHAs | Failed | Job metadata shows Android stopped at “Check the key matches the expected Salim certificate”; exact stderr not retrievable (GitHub log download EOF). No secret values included. |
| iOS native run `40315410964` | 2026-10-26 | `12756537013c7b337161ebf2393592dfc029b976` | Failed | Job failed; exact log not retrievable from this sandbox. Later native runs succeeded. |

**Build number caveat:** The checked-in demo config is 0.7.0/7, but workflow-dispatch input values for historical signed run are not exposed by the metadata retrieved. Do not infer that a given artifact is store-ready or current. Artifacts with 14-day retention may have expired; no binary download was verified.

## 12. Release readiness checklist

### Identity/legal/publication
- [ ] Verify exact legal operator, CR, ownership/UBO, authorized manager and licensed activities; resolve W.L.L single-owner current Sijilat treatment and 2025 Commercial Companies Law amendment with Bahrain counsel.
- [ ] Confirm exact store seller name and public Founder attribution; do not rely on unverified “Whisco Media W.L.L” or individual operator statements.
- [ ] Replace HTML privacy identity inconsistencies; complete `PRIVACY-POLICY-DRAFT.md` from verified data map and counsel review.
- [ ] Verify/live HTTPS `https://www.salimdrive.com/privacy` and `/support`, monitored support/legal contacts, domain ownership/DNS/TLS. Domain is not live per project record; no substitute domain allowed.
- [ ] Draft/approve Terms of Use, community conduct/report terms, subscription/refund/cancellation and cookie/web notices as appropriate; these are not all currently completed.
- [ ] Bahrain PDPA assessment: controller/processors, lawful bases, automated processing notice/exemption, prior authorization if applicable, transfer locations/mechanisms, user rights, breach process and safeguards; GCC country review before each market.

### App Store Connect / TestFlight
- [ ] App Store Connect Salim app record and bundle ownership confirmed; team ID/provisioning profile/device signing verified.
- [ ] Correct final signed archive, unique build number, App Privacy labels and privacy manifest reconciled with AdMob/UMP SDK facts and Overpass bbox disclosures.
- [ ] Age rating, content rights, export compliance/encryption questions, review contact, beta description/What to Test, screenshots, icon, description, keywords, support/privacy URLs completed.
- [ ] Background location purpose, UIBackgroundModes, in-app disclosure and review explanation accepted; real device behavior tested while backgrounded/locked.
- [ ] Subscription products, terms, localization, prices, billing state, purchase/restore/cancel/refund/expiry verified on sandbox/TestFlight.
- [ ] Upload only after separate explicit Founder authorization; current signed workflow does not upload.

### Google Play
- [ ] Play Console Salim app record, package, app-signing enrollment/upload key and version code confirmed.
- [ ] Data Safety form matches exact SDKs/network/data collection, including location permission and bounding-box requests; advertising ID/AdMob/UMP disclosures verified.
- [ ] Foreground service type/location use declarations, prominent disclosure, POST_NOTIFICATIONS behavior, target SDK requirements and any background-location review evidence completed.
- [ ] Content rating, ads declaration, target countries, screenshots, 512×512 icon, feature graphic, store description, review access/contact, privacy/support URLs complete.
- [ ] Closed/open/production testing track status, testers, account type/creation date, target-test requirements verified from current Play Console; old docs’ “12 testers/14 days” may be stale—check live policy rather than assume.
- [ ] Subscription product IDs/base plans/prices/trials/refunds/restore verified; no public pricing assumed.
- [ ] Upload only after separate explicit Founder approval.

### Product/security/quality
- [ ] Complete authoritative/licensed data inventory by all six GCC markets; measure coverage, false positives/negatives and freshness. Current OSM-only coverage fails the Founder’s stated complete-data requirement.
- [ ] OSM ODbL attribution and derivative database obligations reviewed; tile usage follows provider policy and app attribution.
- [ ] Shared report API is not enabled until security review, HTTPS, persistent storage/backups/restore, moderation staffing, abuse/rate-limit/complaint/appeal/deletion operations, data protection/cross-border review and client end-to-end QA pass.
- [ ] Physical iOS/Android testing: background/lock-screen, permissions, stale GPS, cold start, tunnels, weak network/offline, audio interruptions, battery/thermal, reboot/crash recovery, accessibility and supported devices.
- [ ] Privacy audit on exact signed binaries: every SDK, request, identifier, local DB/backup, endpoint, transfer, retention and data deletion.
- [ ] Performance/crash monitoring/privacy impact plan. No Salim crash telemetry provider verified; do not add without approval.
- [ ] Store images/text from actual app; no fictional/approximate points portrayed as official/complete, and no coverage promises.

## 13. Known issues, stale docs, failed runs

1. **Data completeness (P0):** OSM volunteer data is not “all GCC cameras” and no country authority data pipeline exists. User explicitly requires real GCC-wide camera data. Current product is not ready for broad launch.
2. **Static pack mismatch (P0):** `CameraPack` in both native codebases is empty and no `cameras.csv` exists, while `PRODUCT-DECISIONS.md`, `DEVICE-FEEDBACK.md`, store drafts and older docs describe eight Bahrain points or a bundled pack. Verify exact current source and correct stale docs only with Founder-approved docs scope; do not invent replacement coordinates.
3. **Privacy/data disclosure (P0):** iOS usage string says “Precise routes are not uploaded,” but a location-derived bbox is posted to Overpass. Clarify in disclosure and measure provider request/log behavior. `PrivacyInfo.xcprivacy` says collected data types empty despite AdMob/UMP; full review required.
4. **Privacy page identity mismatch (P0):** `site/privacy.html` names an individual and lists support/legal emails; `deploy/privacy.html` has an entity placeholder. Legal identity/mailboxes unverified and domain not live. Current Phase 4 documents explicitly block publication; neither page has been edited.
5. **Reports/moderation (P0 for user-report feature):** report API is only source, not deployed, and active native client flow absent. User’s request for community verification and live moderation remains unfulfilled.
6. **No registered/verified Salim operator:** Company dossier and legal notes mark operator, CR, activities, UBO and public contact as NOT IN DATA. “Whisco Media W.L.L” is an unverified candidate.
7. **No current store submission evidence:** Developer accounts said active by Founder, but listing/build/history unavailable. No TestFlight or Play upload verified.
8. **Historical docs conflict:** `RECOVERY-AND-RELEASE.md` says signed workflow never run; current Actions metadata shows Android signed success run 40311763923. `DEVICE-FEEDBACK.md` and older `PRODUCT-DECISIONS.md` say eight Bahrain rows/CSV; current code says pack empty. `SESSION-HANDOFF.md`, `SHIP-PATH.md`, `STORE-RELEASE-CHECKLIST.md` may include older repo, domain, identity, account, feature or version assumptions; use current config and date-stamped runs over narrative.
9. **Build failures:** On 2026-10-26, signed attempts failed at the Android cert fingerprint check, then one at signed bundle verification; later run 40311763923 succeeded for Android. Native iOS run 40315410964 failed before later successes. GitHub job metadata is verified; exact logs could not be downloaded (sandbox request returned EOF), so exact error text/cause is UNKNOWN. Earlier compile defects in `DEVICE-FEEDBACK.md` (Dp/Int width; labelled/positional test argument) are recorded as fixed.
10. **CI gaps:** Later docs-only commits do not trigger native workflows because of path filters. Current PR checks are Vercel (not mobile app test). CI build green does not verify physical devices, store signing/submission or real datasets.
11. **External services risk:** Every Git push to the connected repository currently produced Vercel Whisco preview deployments; last two commits had READY preview URLs. No intentional production deploy observed; still avoid touching Whisco paths.
12. **No approved self-hosted tile/data backend:** OSM tile/query availability and provider limits may affect quality. No custom caching proxy, paid map service or fallback provider is configured.
13. **No privacy rights/retention operations:** Mailboxes and backend are not live; cannot truthfully promise request handling or service-data deletion paths.

## 14. Next steps and Founder dependencies

### P0 — immediate next action

1. **Claude cold start:** first inspect this handover and the current `salim-workspace/docs/README.md`, `PRODUCT-BLUEPRINT.md`, `PRODUCT-DECISIONS.md`, `RECOVERY-AND-RELEASE.md`, `STORE-RELEASE-CHECKLIST.md`, native `CameraFeed`/`CameraPack`, and latest workflow files. Report conflicts and verified HEAD/PR/check status before editing. The immediate engineering gap is a safe, rights-cleared, country-by-country camera-data plan; do not start by changing code or adding guessed data.
2. Confirm to the Founder that account/dev-store status from chat is remembered, and ask only for **unresolved evidence** when needed: verified operator/CR/activity and permission to publish identity; Sijilat/counsel resolution of one-member W.L.L. conflict and 2025 amendment; verified mailbox/domain operations; data-provider licenses/official endpoints; and any chosen authorized live human moderator. Do not ask again whether they want fixed cameras, GCC scope, native apps, ads in store builds, or community reports.
3. Run safe read-only checks and reconcile stale docs to actual current source; do not edit website/app code, workflows, environment settings, Vercel, domains, or stores without direct Founder authorization.
4. Design data provenance/freshness/legal gate before ingest; request authoritative or licensable source access. No public/production claims before legal/data review.

### P1 — after P0 evidence and explicit approval

- Full binary/provider data-flow and PDPA assessment; fix privacy discrepancy and prepare store disclosures.
- Choose/confirm the Salim-owned repo path (current capsule vs private `burn8887/salim-drive`) via secure GitHub connection, not chat credentials. `promote.py` is the current intended migration tool; validate carefully before any migration.
- End-to-end integrate reports only after secure host, persistent backups, real moderator staffing, privacy/retention decisions and Founder launch approval.
- Complete physical-device QA, accessibility and subscription/ad consent tests.
- Finish store records/listings and screenshots based on actual binaries, then request explicit upload approval.

### P2 — later / defer

- Arabic UI/localization and native-market review; more reliable maps/offline support if it meets “professional without UX impact”; broader GCC launch per-country legal readiness; account/push/navigation features only if separately approved.
- Marketing, paid acquisition, partnerships and scale claims wait for actual metrics/data rights/gates. No fabricated TAM/SAM/SOM or optimistic public forecast.

### Founder decisions already supplied (do not re-ask)

- Product = **Salim — Road Awareness**, Arabic **سالم**; permanent package/bundle `com.salimdrive.app`; store title “Salim — Road Awareness”.
- Two fully native iOS/Android apps; Bahrain primary with GCC scope.
- Fixed cameras are in scope; police/patrol/covert/radar-emission detection is out of scope.
- Ads out of demo; ads permitted in Play/App Store store builds; no ads during active drive.
- Basemap only if professional and user experience is not affected.
- Shared user reports, moderation and community camera verification are desired; live agent/backend operations desired, but not yet implemented.
- Approved domain exactly `www.salimdrive.com` (not live); intended contacts exactly `support@salimdrive.com` and `legal@salimdrive.com` (deliverability unknown); no substitutes.
- Google Play and Apple developer accounts are active (**FROM-CHAT**, not dashboard verified here).
- Year 1 spending availability input USD 20,000/month; no Founder salary before Year 5; not cash verification or spending authorization.
- No passwords, tokens, 2FA codes, wireless pairing codes, private keys, certificates or keystore values in chat. Keys kept outside repo under `~/salim-keys` (FROM-CHAT). No store upload authorized by the prior signing approval.

### Still unresolved (ask only when it blocks a task)

- Which entity is Salim’s legal operator; current CR, ownership/UBO, manager, activities, authority and public name; is “Whisco Media W.L.L” registered/usable or merely candidate? Past project notes mention “Ali Sameer Sadeq Mohamed Albaharna,” but publication/operator connection is not verified.
- Current Sijilat treatment of one-shareholder W.L.L. given Decree-Law 28/2020 vs MOIC Procedures Guide 2024 (2–50 partners), plus Decree-Law 38/2025 implementation and counsel position.
- Legal reusable camera datasets/authoritative feeds by six countries; OSM ODbL/data rights review; official map/provider use terms.
- Support/legal email ownership, monitoring, DNS/HTTPS/domain status; user-rights response owner.
- Whether GitHub private `salim-drive` repository is available to the Founder/Claude and approved migration timing.
- App Store Connect/Play listing identifiers/records/test tracks/products; current signing environment/profiles (inspect metadata only, never values); version/build numbers already consumed by stores.
- Report-service operator/hosting/backup/moderator identity and approval; no extra user interview/market access assumptions.

## 15. Document and asset index

All paths below are relative to repository root unless stated otherwise. This index names every tracked Salim docs file seen in the current tree plus the key code/asset folders; consult the files rather than relying on this synopsis.

### Core venture library (2026-10-28 index v1.5)

- `salim-workspace/docs/README.md` — 30-document library index, phase/status and Founder questions.
- `salim-workspace/docs/business/COMPANY-DOSSIER.md` — v1.1 entity/product snapshot; legal operator unresolved.
- `salim-workspace/docs/business/OPERATING-RULES.md` — measurement, gates, budget and spending controls.
- `salim-workspace/docs/business/MISSION-VISION.md` — v1.1 mission/vision/values, cautious fixed-camera scope.
- `salim-workspace/docs/PROJECT-HANDOVER-LOG.md` — phase history through Phase 4 and push hashes.
- `salim-workspace/docs/DISASTER-RECOVERY.md` — recovery and service/credential location pointers.
- `salim-workspace/docs/PRODUCT-BLUEPRINT.md` — screens, data model, current/non-goals and release gates.
- `salim-workspace/docs/DESIGN-SYSTEM.md` — visual system/accessibility rails.
- `salim-workspace/docs/VOICE-AND-BRAND-DOCTRINE.md` — terminology, claims, localization.
- `salim-workspace/docs/CONTENT-INVENTORY-DOCTRINE.md` — source quality, provenance, inclusion/exclusion, ODbL caution.
- `salim-workspace/docs/business/BUSINESS-PLAN.md` — gate-driven commercial plan.
- `salim-workspace/docs/business/MONETIZATION-ROADMAP.md` — subscription/ads hypotheses and gates.
- `salim-workspace/docs/business/MARKET-ANALYSIS.md` — source-based market research, not verified total addressable market.
- `salim-workspace/docs/business/HOSTILE-DILIGENCE-MEMO.md` — adversarial review and risk controls.
- `salim-workspace/docs/business/BILLING-REGISTER.md` — vendors/actual costs status.
- `salim-workspace/docs/business/CONSERVATIVE-3-YEAR-PROJECTION.md` — strict-input and estimated downside schedules.
- `salim-workspace/docs/ENTITY-FORMATION-GUIDE.md` — Phase 4 Bahrain formation decision/process; not legal advice.
- `salim-workspace/docs/REGULATORY-LEGAL-MEMO.md` — Bahrain/GCC regulatory issue spotting; includes 2025 amendment.
- `salim-workspace/docs/PRIVACY-POLICY-DRAFT.md` — placeholder-only, not publishable privacy draft.
- `salim-workspace/docs/PRIVACY-PUBLICATION-DRAFT.md` — HTML privacy inconsistency/source audit and publication hold.
- `salim-workspace/docs/WHO-WE-ARE-PROFILE.md` — unapproved profile draft.
- `salim-workspace/docs/PROJECT-HISTORY.md` — original capsule and native evidence timeline; contains stale claims, reconcile against current code.
- `salim-workspace/docs/SESSION-HANDOFF.md` — older session bootstrap; stale repository/branch/status information, do not treat as current.
- `salim-workspace/docs/MIGRATION-TO-OWN-REPO.md` — standalone repo migration plan/status; old access details may be stale.
- `salim-workspace/docs/PRODUCT-DECISIONS.md` — historical decision log; contains stale camera dataset/bundle assertions; current user decisions in §3 and current source take precedence.
- `salim-workspace/docs/DEVICE-FEEDBACK.md` — iterative UI/GPS feedback, tests, older camera/data assumptions; see stale-doc warnings.
- `salim-workspace/docs/BUILDING-LOCALLY.md` — local setup guide; verify commands against current scripts.
- `salim-workspace/docs/RELEASE-SIGNING.md` — manual signer instructions and variable names; historical “never run” text is stale after run 40311763923.
- `salim-workspace/docs/RECOVERY-AND-RELEASE.md` — CI/release state; stale signed-workflow paragraph superseded by current GitHub run metadata.
- `salim-workspace/docs/STORE-RELEASE-CHECKLIST.md` — store gates; recheck platform policy and account state live.
- `salim-workspace/docs/STORE-LISTING-DRAFT.md` — listing copy/URLs, not approved/published.
- `salim-workspace/docs/ACCOUNTS-AND-SECRETS.md` — secret names/how Founder enters them; never paste secret values into Claude/chat.
- `salim-workspace/docs/NAME-CLEARANCE.md` — name search, no clearance guarantee.
- `salim-workspace/docs/NAME-CHANGE-ASSESSMENT.md` — historical rename analysis.
- `salim-workspace/docs/BRAND-IDENTITY.md` — logo/name/colors and brand rails.
- `salim-workspace/docs/SHIP-PATH.md` — old release path assumptions; account/domain details may be stale.
- `salim-workspace/docs/HANDOVER.md` — this exhaustive Claude handover.

### Store/design assets

- `salim-workspace/docs/store-icon-512.png` — Play icon source asset.
- `salim-workspace/docs/store-feature-1024x500.png` — feature graphic draft.
- Android launcher icons: `salim-workspace/apps/salim-android/app/src/main/res/mipmap-*/`.
- iOS icon: `salim-workspace/apps/salim-ios/Salim/Assets.xcassets/AppIcon.appiconset/AppIcon.png`.
- Static site pages: `salim-workspace/site/index.html`, `privacy.html`, `support.html`, `style.css`, `README.md`.
- Generated static deploy directory: `salim-workspace/deploy/index.html`, `privacy.html`, `support.html`, `_headers`, `_redirects`, `robots.txt`, `README.md`.
- Report service/admin assets: `salim-workspace/report-service/server.py`, `admin.html`, `admin.js`, `Dockerfile`, `compose.yaml`, `README.md`, `test_server.py`.
- No app-specific `migrations/`, `seed/`, `cameras.csv`, `GeoJSON`, `PMTiles` or MBTiles dataset was found in Salim subtree.

## 16. How the Founder works / operating rules for Claude

- **Consent:** “Do not re-write or make any changes to GitHub repositories or workflows without consent from me the Founder directly.” Current explicit consent covered Salim-only document library work/this handover; it does not authorize new app-code/workflow changes, production deploys, store uploads, or changes to Whisco TV, Whisco Mobile, or any other app.
- **Repository safety:** Work only on `arena/74afd701-whisco-tv`; never switch/rename branch, push to `main`, force-push, or merge/close PR without explicit approval. Use exact Salim paths. No broad staging. User values durable Git docs and commits/pushes by phase.
- **Secrets:** Never ask for or accept tokens/passwords/2FA/pairing codes in chat. Do not reveal or inspect `.env` values. Keep signing assets outside repo in `~/salim-keys` and secrets in GitHub Environment; leaked transcript password must be treated as compromised. Only public certificate fingerprints/subjects may be shared when needed, not included here.
- **No unrelated product impact:** Whisco TV, Whisco Mobile and others are out of scope. The host repo/Vercel project and its existing workflows are sensitive, even if a push automatically creates a preview.
- **Product quality:** Founder does not want corners cut or invented data. No guessed counts, coordinates, coverage, revenue, users, legal entity, provider permission, or production status. Separate measured fact, Founder input, estimate and unknown. Do not promise complete GCC coverage absent evidence.
- **Fixed enforcement scope:** fixed mapped cameras only; no police/patrol, tripods, covert enforcement, radar/RF detection or evasion. The Founder’s removal instruction was dated **2026-10-21**, followed by reinstatement of fixed-camera warnings on 2026-10-22; final decision stays fixed cameras in, police detection out.
- **Maps/ads:** “basemap only if it will be professional and user experience won’t be affected.” Ads are out of demo but in Play/iOS builds; keep ads off driving screen and safety flow.
- **Moderation:** Founder wants shared user reports, moderation and community verification with live human-agent operation; do not represent them as deployed until service is operational and staffed.
- **Finance:** Founder input USD 20,000/month Year 1 spending availability; no salary until Year 5; neither is cash-on-hand proof nor permission for any purchase. Require transaction-specific approval before spending.
- **Comms preferences:** exhaustive, candid, source-backed handovers; answer directly; preserve context in committed files; ask only genuine blockers. Arabic **سالم**; never **سليم**. Approved domain/contact strings are fixed and not substitutable.
- **Command formatting:** Founder has reported `>` becomes `&gt;` and Markdown fences leak into terminal. If sending commands directly, avoid `>`/`|` where possible; use e.g. `openssl base64 -A -in FILE -out FILE`. Never ask for wireless pairing code.
- **Autonomy:** continue low-risk, authorized documentation/research unless a genuine blocker; do not purchase, contact third parties, file entities, submit apps, deploy, or change signing/permissions without explicit Founder consent.

## 17. Risks, assumptions, and cold-start verification list

### Highest risks

1. The product’s central “real, all GCC cameras” requirement is not met by current OSM-only source.
2. Dataset licensing, official source access, positional truth, stale camera removals and type semantics are unresolved.
3. Location-derived bbox is transmitted to Overpass; policy wording must not claim zero third-party location disclosure.
4. Inconsistent privacy HTML and unverified entity/email identity make publication and store forms unsafe.
5. Ad SDK/provider data disclosures may conflict with iOS privacy manifest and platform forms.
6. User report backend has sensitive camera/location data but no operational host, backups, security, moderator or request handling.
7. Current work is in public repo that also hosts Whisco; docs-only push triggers Vercel preview builds in Whisco project. Maintain strict isolation.
8. Several project docs are internally inconsistent/stale. Prefer checked source/config, current GitHub Actions API, and current Founder decisions over old prose.
9. Store account/record/build history is not available in this environment; do not infer from an active developer membership or signed workflow.
10. “Production-ready” has no single objective acceptance threshold beyond gates described; do not claim ready until each evidence owner signs off.

### First cold checks when Claude gets real access

1. Verify `git status`, branch and `HEAD`; ensure it is still `arena/74afd701-whisco-tv`, clean, and inspect PR #37 before touching anything.
2. Read this file, `docs/README.md`, `PRODUCT-BLUEPRINT.md`, `PRODUCT-DECISIONS.md`, `RECOVERY-AND-RELEASE.md`, `STORE-RELEASE-CHECKLIST.md`, `DEVICE-FEEDBACK.md`, plus Android/iOS `CameraFeed` and `CameraPack` and all three Salim workflows.
3. Reconcile current build source with stale docs: no `cameras.csv`; current `CameraPack` empty; latest live query Overpass. Update status notes only under Founder-authorized doc scope.
4. Check Actions run list and PR checks live; latest known native run `40627499812` and `40627499907` is based on `2055538`, not later docs-only commits. Confirm whether workflow path filters skipped current head.
5. Check Vercel read-only: project `salim` has no deployment/envs; do not deploy. Note existing connected `whisco-tv` preview behavior; do not alter it.
6. Ask for no secrets. If GitHub/App Store/Play/Neon access is not connected, say which facts cannot be verified and request secure connection/access through the platform, not pasted credentials.
7. Do not ask again whether Founder wants native apps, GCC target, fixed cameras, ads in store builds, community reporting, the approved domain, or the spelling **سالم**.
8. Before any code/workflow/signing/store/domain change, obtain direct Founder consent for the exact scope. Before any store upload, obtain separate explicit authorization.

## B. Ready-to-paste first message to Claude

> You are taking over Salim — Road Awareness (سالم). Start by reading `salim-workspace/docs/HANDOVER.md` and the referenced current-source files; verify the GitHub branch/PR, native workflow status, Vercel Salim project and actual `CameraFeed`/`CameraPack` code using available secure integrations. Your immediate goal is to reconcile stale project docs with the checked-in native code and deliver a concise evidence-based readiness report, prioritizing the gap between the Founder’s requirement for real GCC-wide fixed-camera data and the current OSM-only/empty-static-pack implementation. Do not modify app code, workflows, website, Vercel settings, stores, domains or signing configuration; do not deploy, upload, file, spend, or ask for passwords/tokens. Work only on `arena/74afd701-whisco-tv` if/when the Founder authorizes a change, and ask only for genuinely unresolved evidence (legal operator/CR, data reuse rights, contact operations, and current store listing facts), not already-decided product requirements. Cite every assertion as VERIFIED, FROM-CHAT, UNSURE or UNKNOWN, and preserve Whisco TV/Whisco Mobile isolation.
