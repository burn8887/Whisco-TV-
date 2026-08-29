# WHISCO TV — COMPLETE PROJECT HANDOVER
*Last updated: 2026-08-29 (Play Console LIVE: app created, internal-testing release publishing with versionCode 6; iOS code-complete awaiting Apple enrollment; app iterated to v0.4 through two user review rounds). Purpose: allow any future conversation/agent to resume this project with zero context loss. Read fully before acting.*

---

## 1. WHAT WHISCO TV IS

- **100% free, ad-supported (FAST/AVOD) streaming platform** — live TV + on-demand video for **GCC expatriate communities** (Bahrain, Saudi, UAE, Kuwait, Qatar, Oman): South Asian (Hindi/Urdu/Malayalam/Tamil/Telugu/Bengali/Punjabi/Nepali/Sinhala), Filipino, Indonesian, Arab audiences + Turkish dizi fans.
- **No subscriptions ever** — monetization via ads only. Core brand decision.
- Named after the owner's real Shih Tzu "Whisco" — mascot central to branding.
- Owner ("user", GitHub: burn8887, Gmail: burn8887@gmail.com, location: Bahrain) is hands-on, non-deeply-technical, direct; expects real working fixes and honest limits. Angel investor contributes **$200/month** (nothing in return) — see §9 budget.

## 2. INFRASTRUCTURE (ALL PAID TIERS NOW — Aug 2026)

| Thing | Value |
|---|---|
| Domain | **whisco.tv** (registrar: **Spaceship**; primary host `www.whisco.tv`, apex 308→www) |
| Legacy URL | whisco-tv.vercel.app (still serves) |
| Hosting | **Vercel PRO ($20/mo — upgraded Aug 22 after 75% Fluid CPU warning from crawler load)**. Watch for the $10/mo Speed Insights add-on Vercel sneaks into checkout — user was advised to remove/disable it; verify billing shows $20 not $30 |
| DB | **Neon Postgres LAUNCH plan ($19/mo — upgraded Aug 22 after 5GB transfer cap suspension)**. Pooled endpoint `ep-fragrant-salad-za6qb2v7-pooler.c-2.eu-west-2.aws.neon.tech` |
| DNS | Spaceship nameservers. A @ → 216.198.79.1 (Vercel), CNAME www → 2ddb537b3c610afb.vercel-dns-017.com, MX → mx1/mx2.efwd.spaceship.net, SPF TXT `v=spf1 include:spf.efwd.spaceship.net ~all` |
| **Email (WORKING as of Aug 22)** | partnerships@ / legal@ / privacy@whisco.tv → all forward to burn8887@gmail.com via Spaceship email forwarding. (Initial 554 Relay-denied issue resolved after Spaceship support / propagation.) |
| Repo | https://github.com/burn8887/Whisco-TV-.git (trailing hyphen). GH Actions secret CRON_SECRET set |
| Local root | `/home/user/iptv-app` |
| Stack | Next.js 16.3.0 App Router, React 19, Tailwind v4, **Prisma 5.22.0 PINNED (v7 broke datasource env)**, NextAuth v5 beta, yt-dlp for harvesting |

**.env** (persists): DATABASE_URL (pooled Neon), AUTH_SECRET, CRON_SECRET=`bab83e4291ec45b0663a2d618b63ade0b2b0a3ea85c49c4d`.
Vercel env vars: same + `ADS_TXT` = `google.com, pub-7207533964778777, DIRECT, f08c47fec0942fa0`.

### Sandbox session bootstrap (workspace resets between turns)
```bash
cd /home/user/iptv-app && npm install --no-audit --no-fund && npx prisma generate \
  && git config user.email "you@example.com" && git config user.name "Whisco TV"
```
- Sandbox DNS sometimes can't resolve Neon → resolve via https://dns.google/resolve, connect by IP with `?sslmode=require&options=endpoint%3Dep-fragrant-salad-za6qb2v7-pooler`.
- Git push (user supplies PAT each session; **strip after, remind to revoke**):
  `git remote remove origin; git remote add origin "https://<TOKEN>@github.com/burn8887/Whisco-TV-.git" && git push -u origin main; git remote set-url origin "https://github.com/burn8887/Whisco-TV-.git"`
- Node scripts using @prisma/client must run from `/home/user/iptv-app` (copy script in, run, delete).
- Always call cron endpoints on **www.whisco.tv** (apex 308s; curl needs -L).

## 3. CONTENT CATALOG (all legal — non-negotiable discipline)

- **Live: 518+ channels** (~490-500 active; auto-managed). Free-to-air HLS + 7 official YouTube-live embeds.
- **VOD: ~16,900 titles, ~14,550 active**: 1,732 Internet Archive public-domain; ~13k official-channel YouTube embeds (FilmRise, Shout!, Popcornflix, Fremantle/Family Feud/BUZZR, DW, Timeline, Real Stories, Banijay, Goldmines, Shemaroo, B4U, Pen, Rajshri, SET India, Colors, Dangal, HAR PAL GEO, ARY, HUM, Express, Green TV, Banglavision, CD Choice, Zee Bangla, Maasranga, Matinee Now, Millennium, Amrita, Sun TV/NXT, Ayngaran, AP Intl, AR Ent, iDream, SriBalaji, Volga, ABS-CBN, GMA, Jeepney, TV5, Indosiar, tvOne, MNCTV, OSR, Budha Subba, HighlightsNepal, Sirasa, ITN, Lanka Cinema, Yellow/Omjee Punjabi, Melody Aflam, El Sobky, Sham, Rotana Classic, Bab Al-Hara/Bassam Al Mulla…).
- **Turkish Dizi: 56 series** (~3,400 eps) incl. Aşk-ı Memnu/Forbidden Love, Esaret, Emanet, Kuruluş Osman, Ezel, Çukur, Hercai, Kara Sevda, Yargı, Kızıl Goncalar, Aile.
- **Arabic series: 333** (~7,100 eps): Kuwait 121, Syria 73, Lebanon 52 (Al-Hayba/Cedars), UAE 42, Jordan 26, Qatar 15, Bahrain 1.
- **~2,360 geo-hidden** (lastStatus='geo'): GCC-blocked (Kızılcık Şerbeti, Leyla, Sahipsizler, most FilmRise/Shout, Sham Cinema). Geo-aware cron can auto-restore.
- **Featured on Demand (homepage) — user-mandated modern lineup (Aug 22)**: Esaret, Emanet, Kuruluş Osman, Kızıl Goncalar, Aile, Hercai, Aşk-ı Memnu, Chatrapathi (2024). **User explicitly dislikes old/black-and-white titles being featured** — keep featured modern/recognizable.
- Excluded forever (sanctions/politics): al manar, mayadeen, press tv, irib, al alam, rojava/ronahi/welat, al wilayah.
- Source-of-truth JSONs in `prisma/`; `seed.ts` seeds everything.

## 4. AUTOMATION SUITE (fully built — the ops backbone)

All API crons auth via `Authorization: Bearer <CRON_SECRET>`; all on www host.

| Job | Schedule | What it does |
|---|---|---|
| **Uptime monitor** (`uptime-monitor.yml`) | GH Actions **every 15 min** | Checks /, /live, /vod, /browse return 200 + `/api/health` returns ok. Fails workflow → GitHub emails owner. Catches Neon/Vercel suspensions, bad deploys within 15 min |
| **Channel health** (`channel-health-check.yml`) | GH 0,6,12,18 UTC + Vercel 03:00 | `/api/cron/check-channels`: 518 channels, 2-hop HLS validation, hide @2 fails, auto-restore |
| **VOD health** (same workflow) | GH 6-hourly + Vercel 03:30 | `/api/cron/check-vod`: rotating 120-title batches; archive.org metadata; YouTube oEmbed + **GCC geo check**; batched writes |
| **Dizi updater** (`dizi-update.yml`) | GH daily 05:00 | `/api/cron/update-dizi`: official RSS → new episodes of ongoing dizi (verified). Geo-hidden shows collect silently (patch Aug 22) |
| **Content discovery** (`content-discovery.yml`) | GH **Mon+Thu 04:00** | `/api/cron/discover-channels`: iptv-org country files (17 target countries, 4/run rotating), 2-hop verify, max 25 new/run, exclusion lists. `/api/cron/discover-vod`: RSS of 16 vetted GCC-clean official channels → newest full-length uploads (oEmbed + duration + GCC verified) |
| **Weekly maintenance** (`weekly-maintenance.yml`) | GH Sun 05:00 | `/api/cron/maintenance`: ages NEW badges >14d, prunes channels dead 8+ checks, rotates Trending (newest from spotlight collections), emits full stats report in workflow log |
| **Health endpoint** | on demand | `/api/health` (public): DB latency, active counts, cron staleness alarms (>36h), thresholds (channels<400, titles<10k → degraded) |

**Cost-control architecture** (why bills stay predictable):
- `src/lib/cached.ts` — unstable_cache on ALL catalog reads (title/episode/movie/channel pages, lists, shelves, stats, sitemap; 15min revalidate, 1h stats). Cut Neon egress ~95%. Personalization never cached. Crons revalidatePath after changes.
- VOD cron writes batched (updateMany for unchanged rows).
- Vercel Hobby cron limit was 2/day → GH Actions carries everything else (free). Now on Pro but architecture unchanged.
- If usage alerts still appear: Vercel Pro includes generous quotas; Neon Launch removes the 5GB wall. Crawler storm (Google indexing 17k pages) is the main load driver and settles post-index.

## 5. MONETIZATION STATE

- **AdSense**: publisher `ca-pub-7207533964778777`. Loader = plain <script> in layout head (next/script was invisible to verifier — fixed). ads.txt via ADS_TXT env. Site verified; **status: under review** (submitted ~Aug 21). Auto Ads OFF by advice — manual AdSlot placements only. On approval: ads render automatically, no code changes.
- **SEO**: per-title metadata + JSON-LD (TVSeries/Movie + WatchAction); sitemap ~17k URLs (dizi 0.9 priority); robots.txt; Search Console verified (2 meta tokens in layout). whisco.tv property + sitemap resubmission recommended.
- **Filmhub channel application**: guide + ready letter at `/home/user/Filmhub_Channel_Application_Guide.md`. **User filling the application NOW (Aug 22)** from partnerships@whisco.tv via filmhub.com/contact/buyer. After acceptance: build Bunny ingest (S3-compatible), playback path, monthly reporting automation. Bunny Stream ~$0.005/GB storage + ~$0.01/GB delivery.
- **Budget ($200/mo investor)**: Neon $19 + Vercel Pro $20 = $39 infrastructure; ~$50 future Bunny hosting; ~$110 Meta ads GCC (Bahrain CPM $4.5–8.5, avoid Ramadan +68%); ads launch after AdSense approval.

## 6. WEBSITE PAGES & BRAND RULES

- Pages: / (marketing home), /browse (app home), /live (+/live/[id]), /vod (shelves+grid), /title/[slug], /watch/episode|movie/[id], /watchlist, /account, /profiles, /login, /signup, /about, **/contact (NEW Aug 22 — 3 email cards)**, /privacy, /terms, /admin*, /api/health, sitemap.xml, robots.txt, ads.txt, manifest.
- **Footer (both footers)**: About · Contact Us · Privacy · Terms. Old "sample content/demo/README" fine print REMOVED (Aug 22) — never reintroduce demo-speak.
- Brand: dark #0a0a0f, orange→pink gradients, minimal/clutter-free. User rejects boxed/stamped-on visuals.
- Mascot: `/whisco-mascot-alpha.png` (transparent) everywhere. Hero = static alpha mascot w/ float + "Woof! I'm Whisco 🐾". Full-bleed cinematic strip below hero: whisco-zoom-banner.mp4 (~75% crop, brand grade, gradient blends, tagline "Life's better at full speed — and full free."). Clinic clip in Meet Whisco. Kill-switch: `SHOW_MASCOT_VIDEOS` in `src/config/features.ts`. Sources in `/home/user/whisco-videos/`.
- PWA live (manifest, sw.js — never intercepts video, offline.html, Android install prompt, iOS hint). Store plan: TWA ($25, 12 testers×14d) → Expo iOS ($99/yr).
- WhatsApp: sticker `/home/user/whisco-sticker.webp`; OG card `public/og-share-card.png` (whisco.tv branding).


## 6b. MOBILE APP (React Native / Expo) — FEATURE-COMPLETE, AWAITING PLAY ACCOUNT

**Decision history:** TWA was planned for a September deadline; user relaxed the deadline and chose viewers-first quality → **RN-first, TWA skipped entirely**. 22 testers recruited (Google requires 12 × 14 continuous days for personal accounts). Filmhub letter updated to "apps launching Q4 2026".

**Project:** `/home/user/whisco-mobile` (own git repo, NOT pushed to GitHub yet — decide with user whether same repo subfolder or new repo `whisco-mobile`).
- Expo SDK 57 / RN 0.86, TypeScript, expo-router (tabs: Home / Live TV / On Demand / My List + /title/[slug] + /live/[id]).
- **Video**: expo-video (native ExoPlayer) for HLS/MP4 — fullscreen, PiP, resume, error copy matches site; YouTube embeds via react-native-webview official iframe (ToS-compliant, blocks link-outs).
- **Personalization local-first** (AsyncStorage, `src/store.ts`): watchlist + continue-watching with positions, saved every 10s, resume chip on title screen. No login needed (matches zero-friction philosophy; server sync can layer later).
- **Data**: `src/api.ts` → https://www.whisco.tv/api/mobile/v1/{home,live,vod,title/[slug],channel/[id]} — versioned, cached (zero DB load), verified live.
- **Branding**: `src/theme.ts` mirrors site (#0a0a0f, orange #f97316 → pink #db2777); icons/splash from brand assets.
- **Android**: package `tv.whisco.app`, adaptive icon, INTERNET permission only. `eas.json` profiles: production (.aab, autoIncrement), preview (.apk), production-tv (EXPO_TV=1).
- **Store kit** in `store/`: feature-graphic 1024x500, play-icon-512, `listing.md` with full copy-paste listing (name/short/full description, category, tags, privacy URL, data-safety answers = NO data collected in v1, content rating Teen, screenshot shot-list, Amazon Appstore note).
- **Device plan**: Android phones/tablets (Play) → Android TV/Google TV/Mi Box (production-tv build, D-pad focus states already on cards) → Fire Stick (same app → Amazon Appstore, free account) → Chromebooks (automatic via Play) → PCs (whisco.tv PWA already live).
- **Verified**: `npx tsc --noEmit` clean; `npx expo export --platform android` produces Hermes bundle.

**BUILD STATUS (2026-08-24): PRODUCTION .AAB SUCCESSFULLY BUILT.**
- EAS account: burn8887s-team (Expo project whisco-tv, id 0c4f0508-0c37-438c-a553-5016aa3aaba6; keystore generated & stored on Expo servers — critical asset, survives via Expo account).
- Successful build: 0cab58b0-9af0-487c-a3fc-0ebbceecfd3b, versionCode 4. Artifact (.aab) downloadable from expo.dev build page (URLs expire; regenerate from build list).
- Dependency lesson: use `npx expo install` for reanimated/worklets — manual pins break the C++ build (worklets 0.12 vs expo-modules-core; blessed combo = reanimated 4.5.1 + worklets 0.10.1).
- Preview .apk profile also available for direct tester installs.
- EAS auth: user provides Expo access token per session (EXPO_TOKEN env var); eas-cli installed via `npm install --prefix /home/user/.eas-cli eas-cli`.

**Launch sequence remaining:**
1. User's Play developer account finishes verification ($25 paid, in progress 2026-08-24).
2. ~~Build .aab~~ DONE — download from expo.dev or rebuild fresh when needed.
3. User uploads .aab to Play Console → closed testing → invite the 22 testers (need Gmail addresses or Google Group) → **14 continuous days**.
4. Screenshots per store/listing.md shot-list during testing.
5. Apply for production access → submit → review (3-7d) → LIVE.
6. Then: Amazon Appstore (Fire TV), then production-tv build for Android TV listing, then iOS (Apple $99/yr, EAS handles Mac-less builds).


## 6c. MOBILE APP STATUS — 2026-08-29 SNAPSHOT (supersedes older notes below)

**Play Console: VERIFIED & LIVE.** App created: name "Whisco TV: Free Live TV & VOD", package tv.whisco.app, free.
Content rating: Teen-track answers submitted (profanity/violence "yes, not focus"; no UGC/gambling/explicit).
**Advertising ID: declared NO** — and enforced in-manifest via android.blockedPermissions AD_ID (v1 has zero ad SDKs; flip BOTH together if ads SDK ever ships).
**Current store bundle: versionCode 6** (build 047dde90) — includes all fixes below. User uploading to internal testing (was mid-flow with vc5 draft; instructed to swap to vc6). Next: publish internal → CLOSED testing track with 22 testers (starts mandatory 14-day clock) → production access.

**App iterations from user device-testing rounds:**
- v0.3: FIXED YouTube error 153 (embeds load via host page with whisco.tv baseUrl so YouTube sees valid origin); Whisco branding everywhere (WhiscoHeader with mascot+gradient wordmark on all tabs, About screen with clinic video + contacts, Sign-in screen vs NextAuth, zoom-banner video strip on Home, gradient CTAs).
- v0.4: custom SVG tab icons TO USER SPEC (paw print=Home, clapperboard-with-bone-hinge=Live TV, play screen=On Demand, collar-tag-with-star=My List; sunset gradient active state); status-bar overlap FIXED (SafeAreaProvider + insets + translucent bar).
- versionCode 5→6: AD_ID manifest block.

**iOS: CODE-COMPLETE, config done** — bundle tv.whisco.app, ATS HTTPS-only (533/534 channels compliant), background audio + PiP, iPad support, premium 1024 icon, iOS Hermes bundle exports clean, full App Store listing kit in store/ios-listing.md (privacy label: no data collected; App Review notes re content sourcing). **Blocked ONLY on Apple Developer enrollment ($99/yr)** → then: eas credentials (interactive or via App Store Connect API key) → build → submit.

**Repos: BOTH ON GITHUB** — whisco-mobile pushed and current (through iOS-readiness commit 30a13c7+). Workspace cleaned 106→82MB (media originals removed, git gc; everything on GitHub).

**Continuity insurance:** user has set up a Claude.ai Project (knowledge = these 2 docs + Filmhub guide + store listings; custom instructions written). Docs there must be refreshed from GitHub after each milestone — that Claude's knowledge is a SNAPSHOT, staleness is the known failure mode (proven in first test: it reported Aug-24 state).

## 7. STANDING REMINDERS / OPEN ITEMS

1. **PAT hygiene**: last token was revoked by user ✅ (good). A commit may be local-unpushed if a session ended without a fresh token — ALWAYS check `git log origin/main..HEAD` equivalent at session start (fetch needs remote re-add).
2. **Rotate Neon DB password** — STILL OUTSTANDING (credentials appeared in early chat). Update Vercel env + .env after.
3. Verify Vercel billing is $20 (Speed Insights add-on removed/disabled).
4. Search Console: add whisco.tv property, submit sitemap.
5. AdSense: wait for review; if "site not ready" feedback, address specifics.
6. Filmhub: application in flight — watch partnerships@ inbox; on acceptance do §5 integration work.
7. Token policy: GitHub PAT = per-session throwaway (revoke after). Expo token = user decides policy (per-session fresh vs semi-standing) — ASK AND RECORD when next discussed.
7b. Mobile app: when Play verification completes → EAS build → testers (22 ready) → 14-day clock. Expo account needed for EAS (user creates or agent walks through).
8. After the new automation workflows first run: check github.com/burn8887/Whisco-TV-/actions for green.
8. Uptime monitor will email the owner on failures — if user reports such an email, check /api/health first, then Neon/Vercel dashboards.

## 8. INCIDENT LOG (why the architecture looks like this)

- **Prisma 7 breakage** → pinned 5.22. **Neon direct endpoint pool exhaustion** → pooled endpoint.
- **France 24 stale-manifest incident** → 2-hop HLS checks. **Cron 504** → maxDuration 300 + worker pool.
- **Vercel Hobby 2-cron limit** → GH Actions as scheduler backbone.
- **Leyla geo-block (user screenshot)** → GCC geo audit → 2,414 hidden → geo-aware VOD cron. oEmbed alone is insufficient (global-only).
- **AdSense couldn't verify** → next/script → plain <script>.
- **Neon 5GB cap suspension (Aug 22)** → caching layer (`src/lib/cached.ts`) + Neon Launch upgrade. Site survived on cache during outage.
- **Vercel 75% CPU warning (Aug 22)** → Pro upgrade. Root cause both: Google crawling 17k-page sitemap (a success symptom).
- **554 Relay denied on new forwards** → resolved (Spaceship provisioning); MX/SPF were correct from the start.
- **Workflows failed 6s after domain cutover** → apex 308s to www; workflows now use www + -L.
- Demo content fully purged (24 fake titles Aug 16); "sample content" footer text removed Aug 22 — never reintroduce either.

## 9. NEXT MAJOR MILESTONES

1. AdSense approval → ads live → first revenue.
2. Filmhub acceptance → licensed premium catalog (Bunny Stream pipeline to build).
3. Meta ads campaign (~$110/mo) once AdSense approved.
4. Play Store TWA, then iOS app.
5. Weekly ops: watch Actions dashboard; maintenance workflow log = weekly stats report.
