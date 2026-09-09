# WHISCO TV — SUBMISSION CAMPAIGN MAP
**Permanent, legitimate, around-the-clock referral traffic**

v1.0 · 10 September 2026 · Operator document · ≤2 hours/week · ≤$50 campaign budget  
Owner: Ali Albaharna · Inbox for submissions: partnerships@whisco.tv (fallback legal@whisco.tv)  
Companion: `Whisco_TV_Press_Kit.md`, `Whisco_TV_SEO_Content_Pack.md`, `Whisco_TV_Marketing_Playbook.md`, `Whisco_TV_App_Store_Review_War_Room.md`

---

## 0. How to use this document

This is a working ops file, not a strategy essay. Open it on the week you are in. Do the Week-N checklist. Paste the matching template. Log the row in the tracker. Stop at 2 hours.

**Hard rules**

- Legitimate and ToS-compliant only. No paid link schemes, no Fiverr backlink packs, no PBN, no “submit to 400 directories” agencies.
- Never invent MAU, downloads, or revenue. If a form demands monthly users: write `Early-stage. Domain live 20 Aug 2026. Public analytics not yet published. Happy to share Vercel Web Analytics after both stores are live.`
- Never pitch Whisco as “IPTV.” We are a legal AVOD/FAST web + app hub of official/FTA/public-domain sources. The word IPTV is the pirate incumbent. Do not appear on pirate playlists.
- Do not submit the Android APK to unofficial mirrors while Play closed testing is running. Official store first.
- Community posting stays human-only. Automations may draft; Ali posts.
- Max 1 ad/page is a product doctrine, not a directory claim. Do not promise “ad-free.”

**Gate flags used throughout**

| Flag | Meaning |
|---|---|
| **TODAY** | Can fire now. Web is live. No CR, no public store listing required. |
| **APPS** | Wait until at least one store is *public* (Play production or App Store live). Closed testing / TestFlight is not enough. |
| **CR** | Wait until the single-shareholder W.L.L. has a Commercial Registration. |
| **FEED** | Needs a machine-readable titles feed (JSON). Do not promise a date until the feed exists. |
| **HOLD** | Right idea, wrong week. Parked with a reason. |
| **EXCLUDED** | Do not do this. Reason given. |

**Catalog facts you may quote (as of 5 Sep 2026 — update the date when you reuse)**

- 581 active live channels, 15,696 active VOD titles
- 13 languages; GCC geo-checked
- Legal sourcing only: official broadcaster / FTA / public domain
- Web: https://whisco.tv
- Free forever. No signup required. AVOD/FAST.

---

## 1. Streaming aggregators & “where to watch” services

These are the crown jewels. A live JustWatch / Reelgood / Yidio listing sends *intent* traffic for years: someone searches a title, sees “Free · Whisco TV,” clicks through. That is worth more than a hundred startup directories.

**Reality check before you start.** Every serious aggregator matches titles against IMDb / TMDB. Most of our VOD is official YouTube embeds of South Asian cinema, Arabic musalsal, and Turkish dizi. A high percentage of those titles *are* in TMDB/IMDb. A meaningful slice of live FTA channels and long-tail regional films is not. Expect partial catalog coverage even after a successful integration — that is normal, not a rejection.

We do **not** currently have a public titles feed. Building one is a Week 2–4 engineering task (see §5). Until it exists, the play is: file the intake form, tell the truth about catalog shape, and offer a feed when they reply.

### Ranked list (traffic value × attainability)

Score is qualitative: H / M / L on traffic, attainability, GCC relevance.

---

### 1.1 JustWatch — RANK 1 (do first)

| | |
|---|---|
| **URL** | https://www.justwatch.com |
| **Intake** | https://www.justwatch.com/us/service-integration |
| **Alt form** | https://forms.gle/QwR9KBmUJiZg2fiq6 |
| **Older form still circulating** | https://docs.google.com/forms/d/e/1FAIpQLScGNRTueQq97mjRh8qfYE8BoOPCm_4roJr8C_GEJqFmT2zKwg/viewform |
| **Spec** | https://apis.justwatch.com/docs/streaming_service |
| **Support** | https://support.justwatch.com · partner-support@justwatch.com (post-integration) |
| **Traffic** | H — default “where to watch” answer in Google, TMDB “Watch Now” button is powered by JustWatch |
| **Attainability** | M — form is self-serve; listing is *not* automatic. They require titles on TMDB or IMDb. They list 700+ services across 100+ countries and they do add new ones, but they filter. |
| **GCC** | H — country-level pages exist for AE, SA, and others. Locale field on the form is required. |
| **Gate** | **TODAY** to file the form. **FEED** before they can actually ingest us. |

**Do they list FAST/AVOD of our size?** Yes. Monetization types in the spec include `free`, `ads`, and `fast`. They already surface Tubi, Pluto TV, Plex, The Roku Channel, Freevee/Prime Free, Crackle, Plex Free, Fawesome-class independents. Size is not the bar. Matchable catalog + a stable feed is the bar.

**Onboarding path**

1. Fill https://www.justwatch.com/us/service-integration *and* the Google form https://forms.gle/QwR9KBmUJiZg2fiq6 (they coexist; do both so we are not lost between marketing and ops).
2. They reply if they want to proceed. Do not chase more than once at day 14 and once at day 30.
3. If they proceed: deliver a periodically updated feed. Two options in their docs:
   - Reuse an existing catalog dump if it already has the minimum fields.
   - Implement the **JustWatch Standard VOD Feed Format** (faster, more accurate). Prefer this.
4. Minimum fields (from their spec): Movie = ID, title, release year, availability. Show = ID, title. Season = season number + show ID. Episode = season + episode + show ID + availability. Availability = quality (SD/HD/4k) + type (`free` / `ads` / `fast` / flatrate / rent / buy / cinema) + country ISO + web URL + optional deeplinks.
5. FAST linear items additionally need `available_from` / `available_to` windows.
6. Titles must resolve to TMDB or IMDb. If a high percentage do not, they will integrate a *subset* or decline.
7. Timeline: form acknowledgement days-to-weeks. Feed integration, if accepted, typically weeks-to-a-few-months. **Mark uncertain.** They do not publish an SLA.

**Feed we should build (one feed, reused everywhere)**

Host at `https://whisco.tv/feeds/justwatch.json` (or `/feeds/catalog.json` with a JustWatch mapping layer). Update daily from Neon. Include only titles that already have a TMDB or IMDb id. Do not invent ids. Skip YouTube-only items that cannot be matched — better a smaller clean feed than a dirty large one.

**3 comparable small / independent services they already list** (proof this is achievable, not that we are peers): Plex (free tier), Fawesome, Crackle. Pluto and Tubi are larger but prove the FAST/AVOD lane is first-class on JustWatch, not an afterthought.

**Copy to paste into the form** — see §5.3 short + medium EN.

**Do not** claim monthly users. Leave blank or write the early-stage sentence.

---

### 1.2 Reelgood — RANK 2

| | |
|---|---|
| **URL** | https://reelgood.com |
| **Services index** | https://reelgood.com/services |
| **Business / data** | https://data.reelgood.com |
| **Support** | support@reelgood.com |
| **Feedback** | feedback@reelgood.com |
| **Publishers widget** | publishers@reelgood.com |
| **Traffic** | H in US/UK; M globally. Indexes 300+ services including a large free bundle (Tubi, Pluto, Crackle, Freevee, Fawesome). |
| **Attainability** | L–M — no public “add my service” form found as of 10 Sep 2026. They ingest catalogs for *business* partners. Provider-side onboarding is email + relationship. |
| **GCC** | L–M — historically US/UK-weighted. Still worth the email: one listing leaks into Google “where to watch” snippets. |
| **Gate** | **TODAY** for the email. **FEED** if they engage. |

**Path.** Send one email to support@reelgood.com *and* feedback@reelgood.com (they read both). Subject: `New free AVOD service — request catalog ingestion (Whisco TV, GCC)`. Attach the one-pager from §5.3. Offer a JSON/CSV dump or an existing URL feed. Do not pitch their paid API (that is them selling data *to* us).

**3 comparables they list:** Tubi (Free), PlutoTV (Free), Fawesome.

**Timeline:** unknown. Treat as 30–90 days of silence = not this year, stay on the tracker as `pending`.

---

### 1.3 Yidio — RANK 3

| | |
|---|---|
| **URL** | https://www.yidio.com |
| **About / partners** | https://www.yidio.com/aboutus |
| **Help** | https://help.yidio.com |
| **Phone on about page** | +1 (415) 200-2368 |
| **Address** | 650 Mission Street, 1st Floor, San Francisco, CA 94105 |
| **Traffic** | M–H. Claims 15M monthly users and 180+ providers. Strong “free” filter. |
| **Attainability** | M. They describe a “fleet of robots” that scrape services *and* a content-distribution / partner lane. No public self-serve form found. Email + about-page phone. |
| **GCC** | L–M. US-weighted, but they already list free services a Gulf household actually uses (YouTube, Tubi, Pluto, Roku Channel). |
| **Gate** | **TODAY** for the email. |

**Path.** Email via the contact path on yidio.com/aboutus (no public partner@ published — use the about page form / the phone if email bounces). Pitch: free legal multi-language AVOD, official sources only, deep links to whisco.tv title pages. Offer a sitemap + a titles feed.

**3 comparables they list:** Pluto TV, Tubi, The Roku Channel, Crackle, Popcorn Flix, Red Bull TV.

**Uncertainty:** partner inbox is not published. If the about-page form dead-ends, log it and move on. Do not cold-call twice.

---

### 1.4 Watchmode — RANK 4

| | |
|---|---|
| **URL** | https://www.watchmode.com |
| **API (they sell data)** | https://api.watchmode.com |
| **About** | https://www.watchmode.com/about |
| **Sources list** | https://api.watchmode.com/v1/sources/ |
| **Traffic** | M. 200+ services including small free apps and TV-channel apps. |
| **Attainability** | L–M. They crawl. No public add-provider form. Contact via site contact. |
| **GCC** | L. |
| **Gate** | **TODAY** for a short email. Do not buy their API. |

**3 comparables:** Kanopy, Arrow Player, BritBox-class specialists plus a long tail of free video apps. They explicitly say they catalog “smaller streaming services, rental services, free video apps and TV channel apps.”

---

### 1.5 Flixed — RANK 5 (low priority)

| | |
|---|---|
| **URL** | https://flixed.io |
| **API sales** | https://flixed.io/lp/streaming-availability · https://flixed.io/lp/live-tv-api |
| **Traffic** | M in US cord-cutting SEO. |
| **Attainability** | L. US/Canada catalog. They sell data; they do not run an open provider onboarding desk for a Bahrain AVOD. |
| **GCC** | L. |
| **Gate** | **HOLD.** One email to their “Request Access / Schedule a Call” is enough. Do not spend a second hour here. |

---

### 1.6 TMDB / IMDb “Watch Now” — RANK 1b (side door into JustWatch)

TMDB does **not** let users add streaming links. Staff have said the “Watch Now” button is fed by JustWatch, with a 24–48h lag after JustWatch updates. IMDb watch-options are similarly third-party fed.

**Action:** do JustWatch properly. Do not file TMDB tickets asking them to add Whisco as a provider — they will close them.

**Useful anyway (TODAY):** create a TMDB account, add missing *titles* (not providers) where a South Asian / Arabic / Turkish work is absent. That raises the match rate of our future feed. This is volunteer cataloguing, not self-promotion. Follow TMDB bible. No spam.

---

### 1.7 Plex (as a *discovery surface*, not as a host)

| | |
|---|---|
| **URL** | https://www.plex.tv |
| **FAST catalog spec (partners)** | https://catalogs-docs.plex.tv/catalog_fast/ |
| **Traffic** | H on living-room devices. |
| **Attainability** | L for *carriage* of a Whisco linear channel. Plex FAST onboarding is a partner program with a formal catalog schema (channel[], metadata[], countries, monetization_type = ads). That is a content-carriage deal, not a “list our website” deal. |
| **Gate** | **HOLD** until Filmhub / own-player licensed catalog exists. Pitching Plex a YouTube-embed aggregator will fail and may brand us as a scraper. |

Do not confuse “Plex lists free channels” with “Plex will list Whisco TV the website.” Different product.

---

### 1.8 Device FAST aggregators (Pluto, Samsung TV Plus, Roku Channel, LG Channels, Xumo, DistroTV)

These are **not** “where to watch” indexes. They are competing FAST *platforms* that carry linear channels under carriage deals.

- There is **no** public self-serve “add my service” button on Pluto, Samsung TV Plus, or The Roku Channel. Carriage is pitched to a partnerships desk, then a 24/7 HLS + EPG + SCTE-35 feed + rights chain.
- DistroTV Studio (https://docs.distro.tv/) is a playout tool for people who already own linear rights.
- **Gate: HOLD / EXCLUDED for this 6-week campaign.** Wrong motion. Revisit after Filmhub and a real linear channel, not a website listing.

---

### 1.9 MENA / South Asian equivalents

| Service | URL | Verdict |
|---|---|---|
| Shahid / OSN / Starzplay / ANGAMI / TOD | — | Competitors or pay walls. Not indexes. Do not submit. |
| Tabii / puhutv / MX Player | tabii.com, puhutv.com | Broadcasters. Not “where to watch” indexes. |
| Tata Play Binge / JioHotstar catalog widgets | — | Closed ecosystems. No public provider intake. |
| BookMyShow / Ticketnew “where to watch” | bookmyshow.com | Theatrical + some OTT deep links, India-first, no public AVOD onboarding found. **HOLD.** |
| Hungama / Shemaroo / Goldmines official sites | — | Sources we *embed*, not directories we *join*. |
| Arab-region “أين أشاهد” blogs | scattered | Mostly affiliate JustWatch mirrors or pirate lists. **EXCLUDED** unless a named, editorial, legal site is found later. |
| Dizilah | dizilah.com | Turkish-drama *tracker*, not a rights-clean host. Useful later as a place to *answer* “where to watch legally” in comments, not as a catalog partner. Human-only. **HOLD** until apps public. |

**Honest gap:** there is no JustWatch-class aggregator headquartered in the GCC that accepts new AVOD services via a form. The MENA “where to watch” layer is JustWatch itself + Google + YouTube. That is why JustWatch is week-1 work.

---

### 1.10 Things that look like aggregators and are not

| Thing | Why excluded |
|---|---|
| Stremio addons, Torrentio, Mediafusion | Pirate-adjacent. Instant brand damage. **EXCLUDED.** |
| iptv-org/iptv, Free-TV/IPTV GitHub playlists | Even when a given stream is FTA, sitting on an “IPTV playlist” list trains Google and users to file us with pirate boxes. **EXCLUDED.** |
| “Best free streaming sites 2026” listicles that mix Tubi with 123movies clones (Comparitech is clean; DigitalCruch-class posts are not) | Pitch only outlets that already separate legal from pirate. See Press Kit. Do not email listicle farms. |
| Fiverr / “I will add you to JustWatch” gigs | Scam. JustWatch does not sell listings that way. **EXCLUDED.** |

---

## 2. App directories & alternative stores

Web is live. Android is in Play *closed testing* (26 testers, 14-day clock). iOS was submitted 2 Sep 2026. Treat every store below as a second front, not a substitute for Play / App Store.

GCC relevance score: 1–5.

---

### 2.1 Google Play — already in motion

Not part of this campaign. Do not sideload-market the closed-test APK. When production is approved, that listing becomes the canonical Android URL we paste everywhere.

---

### 2.2 Apple App Store — already in motion

Same. Use the War Room playbook. Do not submit a second iOS build to any alternative iOS store (there isn’t a legitimate one we want).

---

### 2.3 Amazon Appstore (+ Fire TV later)

| | |
|---|---|
| **Docs** | https://developer.amazon.com/docs/app-submission/submitting-apps-to-amazon-appstore.html |
| **Console** | https://developer.amazon.com |
| **Checklist** | https://developer.amazon.com/docs/app-submission/presubmission-checklist.html |
| **Privacy labels** | https://developer.amazon.com/docs/app-submission/appstore-privacy-labels.html |
| **Review** | Typically several days after submit; privacy-label processing cited at 5–7 days. Not an SLA. |
| **GCC** | 4/5 — Fire TV sticks are in a lot of Gulf living rooms. Appstore-on-Android is secondary. |
| **Gate** | **APPS** for a phone APK port. Fire TV / Vega OS binary is a later build. |

**Requirements (actionable):** Amazon developer account (free to register; paid apps have a fee — we are free). APK or AAB for Fire OS. Physical-device test is required before submit. Privacy questionnaire mandatory for new apps. Content policy + IP documentation if third-party IP is used — prepare the same rights pack as App Store review (official embeds, FTA, public domain, takedown address). Images per Amazon image guidelines.

**Do not** submit the current Play closed-test build “as is” without a Fire OS pass on a real Fire tablet or Fire TV stick. Borrow or buy a used Stick if needed — that purchase can sit inside the $300 content/infra budget, not this $50 campaign envelope.

**Timeline after we have a clean binary:** account same day; listing + review ~1–2 weeks typical, longer if they ask for IP docs.

---

### 2.4 Samsung Galaxy Store

| | |
|---|---|
| **Seller Portal** | https://seller.samsungapps.com |
| **Prepare** | https://developer.samsung.com/galaxy-store/prepare.html |
| **FAQ** | https://developer.samsung.com/galaxy-store/faq.html |
| **GCC** | 5/5 — Samsung is the default Android brand in KSA, UAE, Kuwait, Bahrain. Galaxy Store is preloaded. |
| **Gate** | **CR** strongly recommended (commercial seller status wants business identity / D-U-N-S). **APPS** for the binary. |

**Requirements:** Samsung account → Seller Portal → **commercial seller status even for free apps**. Corporate sellers: company docs + often D-U-N-S. D-U-N-S verification up to 10 business days; international bank verification up to 10 business days (bank can wait — we have no IAP). App review has no published SLA. Target API ≥ 33, 64-bit binary required. 16KB page-size support is being phased in (Seller Portal notice: postponed from 1 Jul 2026, further date TBA — check the notice before upload).

**Attainability:** high once W.L.L. exists. Do not start seller verification as an unincorporated individual if they bounce it — that wastes the week.

---

### 2.5 Huawei AppGallery

| | |
|---|---|
| **Console** | https://developer.huawei.com → AppGallery Connect |
| **Release (outside CN)** | https://developer.huawei.com/consumer/en/doc/app/agc-help-releasebundle-0000001100316672 |
| **Business-license rules** | https://developer.huawei.com/consumer/en/doc/app/80301 |
| **GCC** | 5/5 — Huawei / Honor share in KSA + UAE remains material. AppGallery is the store those devices actually use. |
| **Gate** | **APPS** + identity verification. **CR** makes enterprise publisher path cleaner. Mainland-China filing is *not* required if servers are outside CN and we tick “server not in Chinese mainland.” |

**Requirements:** Huawei ID, individual or enterprise verification, privacy policy URL (we have one), support URL, content rating, country list (select GCC + wherever we can legally operate). No GMS dependency — good, our stack does not need GMS. Do not ship HMS-only features we cannot support.

**Timeline:** verification days-to-weeks; review similar to other stores. Confirm current GCC country list inside AppGallery Connect before submit — coverage and HMS service maps are not the same list.

---

### 2.6 Aptoide

| | |
|---|---|
| **Docs** | https://docs.connect.aptoide.com/docs/app-submission-overview |
| **GCC** | 2/5 |
| **Gate** | **HOLD.** |

Free auto-distribution exists for apps that are already on Play *and* have no IAP. Review of manual submits often wants a paid Aptoide Connect subscription. Ownership proof required. Alternative-store installs also collide with Google’s Android Developer Verification for sideloaded packages.

**Verdict:** not this campaign. Revisit after Play production is live, if we want a backup Android storefront. Not a GCC traffic engine.

---

### 2.7 APKPure, APKMirror, APKCombo, and cousins

| | |
|---|---|
| **APKPure submit** | https://apkpure.com/submit-apk |
| **APKPure copyright** | https://apkpure.com/copyright-policy.html |
| **GCC** | 2/5 — used when Play is geo-blocked or users want APKs. Also used by people who sideload pirate apps. |
| **Gate** | **OPT OUT for now.** |

**Policy check — do we WANT to be there?**

- APKPure accepts developer uploads and *also* scrapes Play. If we do nothing, an unofficial APK of a future Play listing may appear anyway.
- Unofficial mirrors have hosted malware-stuffed clones of real apps. That is a support and brand problem we cannot staff.
- Play Protect will nag users who install off-Play copies.
- Submitting ourselves does not give us control over every mirror.

**Action TODAY (defensive, 15 min):**
1. Create an APKPure account at apkpure.com so we can later claim / file takedowns.
2. Do **not** upload the closed-test APK.
3. Bookmark https://apkpure.com/submit-a-takedown-notice and copyright@apkpure.com.
4. When Play is public, decide claim-vs-ignore. Default: ignore unless a clone appears.

APKMirror is cleaner (they generally only mirror Play-signed APKs) and has no useful “submit your indie app” lane. Leave it.

---

### 2.8 F-Droid

| | |
|---|---|
| **Inclusion policy** | https://f-droid.org/docs/Inclusion_Policy/ |
| **How-to** | https://f-droid.org/docs/Inclusion_How-To/ |
| **GCC** | 1/5 |
| **Gate** | **EXCLUDED.** |

F-Droid requires the *entire* app plus dependencies to be FLOSS, built with FLOSS toolchains, no non-free libraries. Whisco’s client is Expo/React Native talking to a proprietary catalog and YouTube’s player. It cannot pass inclusion. Do not file a request that will be rejected and leave a public paper trail calling us non-free. If we ever ship a fully open player with a public recipe, revisit.

---

### 2.9 AlternativeTo

| | |
|---|---|
| **Site** | https://alternativeto.net |
| **FAQ / submit** | https://alternativeto.net/faq/ — User icon → “Suggest new application” |
| **GCC** | 2/5 as traffic; 4/5 as a permanent comparison page (“alternatives to YuppTV / ZEE5 / Shahid”) |
| **Gate** | **TODAY** to create the account + draft. Free review queue is “a few months.” $5 priority review is within the $50 cap if we want it in week 1. |

**Path**
1. Verify email (required before submit).
2. Suggest new application: name Whisco TV, URL https://whisco.tv, platforms Web / Android / iOS, license Freeware + Ads, pricing Free.
3. After it is public (or even while private-to-you), add it as an alternative on the pages for ZEE5, YuppTV, Shahid, OSN+, StarzPlay, Sleduj.to-class pirate apps *only if those pages exist and the comparison is honest*. Do not add us as an alternative to Netflix.
4. $5 priority: worth it. One-time, official, not a link scheme.

**Timeline:** free = months. $5 = 1–2 business days typical per their FAQ.

---

### 2.10 Product Hunt

| | |
|---|---|
| **Launch** | https://www.producthunt.com/launch |
| **GCC** | 2/5 direct; 3/5 for a reusable launch clip and a backlink |
| **Gate** | **APPS** + a founder day we can spend *all* of. Wrong for week 1. |

**Is PH right for us, and WHEN?**

Yes — once there is a public app *or* a clearly demoable web product with a 60-second silent screen recording. PH is a 24-hour race, not a directory. A dead launch (no comments, no hunter network) is worse than no launch.

**When:** the first Tuesday–Thursday *after* at least one store is public, scheduled 12:01 AM Pacific. Bahrain time = 10:01 AM (+03, standard). If we cannot staff comments all day, pick a Saturday (lower traffic, lower bar).

**Do not** launch from a cold PH account. Warm the maker profile for 2+ weeks (comment on other launches, honestly). That warm-up can start TODAY (10 min, three times a week) even if the launch is week 5–6.

**Do not** pay a “guaranteed Product of the Day” shop. **EXCLUDED.**

---

### 2.11 Android TV / Google TV / Fire TV app lists

| Surface | URL / path | Verdict |
|---|---|---|
| Google TV / Play on TV | Same Play Console, form-factor TV | **HOLD** until a leanback Android TV build is signed off. Config exists; it is not this campaign. |
| Amazon Fire TV | Amazon Appstore + Fire TV APK | See §2.3. Phone APK first, TV APK later. |
| Samsung Tizen / LG webOS store | seller.samsungapps.com (TV) / LG Seller Lounge | Smart-TV app stores. Separate binaries, separate certs, weeks of work. **HOLD.** |
| Editorial “best Android TV apps” lists | various | Pitch only after a TV build is *installable*. |

---

### 2.12 Other app-review sites

| Site | URL | Verdict |
|---|---|---|
| Uneed, Fazier, TinyStartups, Betalist-class launch boards | uneed.best, fazier.com, betalist.com | Mixed. BetaList is paid (~$39, refund if rejected) and wants “recently launched.” **Optional, one shot, after public apps — would consume most of the $50.** Default: skip BetaList unless week 6 has leftover budget *and* a fresh public-store hook. |
| G2 / Capterra / GetApp | g2.com etc. | B2B SaaS review farms. Wrong category. **EXCLUDED.** |
| Slant, SaaSHub | slant.co, saashub.com | Low GCC value. SaaSHub is optional if we have 10 leftover minutes in week 5. |

---

## 3. Web directories, tool lists & resource pages that still matter in 2026

Spam farms, “submit to 200 directories” panels, and anything that looks like a PBN are auto-excluded. Short list only.

---

### 3.1 Startup / launch directories worth one form

| Directory | Submit URL | Cost | Gate | Note |
|---|---|---|---|---|
| **Product Hunt** | https://www.producthunt.com/launch | Free | **APPS** | See §2.10 |
| **AlternativeTo** | https://alternativeto.net/faq/ | Free or $5 | **TODAY** | See §2.9 |
| **Crunchbase** | https://www.crunchbase.com/add-new (account required) | Free to create a profile | **TODAY** | Tech-ecosystem directory. Create the org profile. Do not invent funding. Angel $200/mo informal ≠ a round. Headquarters: Manama, Bahrain. Website: whisco.tv. |
| **BetaList** | https://betalist.com (submit from account) | ~$39, refund if rejected | **HOLD / optional** | Paid. Wants new-ish products on their own domain (we qualify). Would eat the campaign budget. |
| **Indie Hackers** | https://www.indiehackers.com | Free | **TODAY** | Post *once* in the appropriate product channel as a founder building in public. Not a directory dump. Human voice. No catalog-count flex. |
| **TAAFT / AI-tool directories** | various | — | **EXCLUDED** | We are not an AI wrapper product. Listing there mis-tags us. |

**EXCLUDED by name:** Submit.sh / LaunchTank-style “we submit you to 100 directories” services, Directory Critic farms, any site that sells a dofollow package, “startup awards” that require a paid application for a badge.

---

### 3.2 “Free streaming” resource lists and wiki-style pages

| Page | URL | Accepts submissions? | Criteria / action |
|---|---|---|---|
| Wikipedia *List of streaming media services* | https://en.wikipedia.org/wiki/List_of_streaming_media_services | Yes, *if* notability + independent RS. | We do **not** clear WP:NORG today. Do not add a row. See §4.1. |
| Wikipedia *Free ad-supported streaming television* | https://en.wikipedia.org/wiki/Free_ad-supported_streaming_television | Same bar. | Independent FAST platforms listed there (Plex, Fawesome, DistroTV, Mometu, Herogo, Flixhouse) have secondary coverage. We do not. **HOLD.** |
| Consumer Reports free-streaming guide | https://www.consumerreports.org/electronics-computers/streaming-media/guide-to-streaming-video-services-a4517732799/ | Editorial only. | **HOLD** until a US/press hook exists. Not a form. |
| Comparitech legal free-streaming list | https://www.comparitech.com/tv-streaming/best-free-streaming-sites/ | Editorial. They draw a hard legal/pirate line. | Worth a *press-style* note after apps are public. One email, not a directory form. |
| Awesome lists on GitHub (`awesome-iptv`, generic awesome-streaming) | https://github.com/iptv-org/awesome-iptv | Form exists. | **EXCLUDED** — IPTV framing. |
| Reddit r/FreeSpotify-class and r/Piracy “legal alternatives” megathreads | — | Comments. | Human-only, and only in threads that already ask for *legal* options. Never drop a link in a pirate thread. **HOLD** until apps public so the URL does not 404 a store badge. |

There is no remaining “famous community-maintained free-media wiki” that is both (a) legal-only and (b) accepting new AVOD services via a clean form. The old “legalesta / streaming-legal lists” either died, went affiliate, or went pirate. Do not hunt them.

---

### 3.3 Expat resource sites per GCC country

| Site | What it actually is | Directory vs editorial | Action |
|---|---|---|---|
| **InterNations** | https://www.internations.org — 19k Bahrain members, 263k UAE. | Community + **paid ads**. No free business-directory slot found. | **HOLD.** Do not buy ads on $200/mo. After CR, a single targeted classified *if* they still sell cheap local listings — check https://internations.org/advertise-with-us. Not week 1. |
| **ExpatWoman** | https://www.expatwoman.com (UAE + other hubs) | Guides + classifieds + **paid** native/sponsored. | Classifieds are for jobs/services, not streaming apps. Path = editorial pitch (see Press Kit) after apps public, not a directory form. |
| **Expat.com** forums / city guides | https://www.expat.com | Forum + some city listings. | Human-only forum reply when someone asks “how do I watch Indian / Filipino / Turkish TV in Dubai.” Do not spam the business listing. **TODAY** only as *watch-and-answer*, not blast. |
| **Dubizzle / OpenSooq “services”** | dubizzle.com, opensooq.com | Classifieds. | **EXCLUDED** for a streaming app. Looks like a scam listing. |
| **Bahrain This Week / Gulf Insider resource pages** | bahrainthisweek.com, gulf-insider.com | Editorial. | Already on the Press Kit list. Not a directory. |
| **Embassy / community association pages** (Indian Embassy Bahrain, Pakistan Embassy, Filipino community groups) | various | Usually editorial or PDF guides. | Do not cold-submit. A later partnership conversation, after CR. |
| **Internations “Places” / city guides** | per-city | Editorial + member tips. | Same as InterNations row. |

**Honest yield:** expat *directories* are thin in 2026. Expat *communities* are thick. The campaign motion is answer-the-question (human), not spray-the-form.

---

### 3.4 Bahrain / GCC business directories (for the W.L.L.)

| Directory | URL | Gate | Action |
|---|---|---|---|
| **Sijilat public CR search** | https://www.sijilat.bh · public search https://www.sijilat.bh/public-search-cr/search-cr-2.aspx | **CR** | Not a submit-form. Once the W.L.L. exists, the listing *is* the official record. Confirm the trading name “Whisco TV” appears. |
| **Bahrain Chamber business search** | https://www.bahrainchamber.bh/en/businesses-search | **CR** + Chamber membership if we take it | Appears after membership / CR, not a marketing directory. |
| **MoIC SIJILAT explainer** | https://www.moic.gov.bh/en/node/2724 | — | Reference only. |
| **TradeArabia / Zawya company tape** | tradearabia.com, zawya.com | **CR** helps; not strictly required for a launch brief | Press Kit already covers the editorial path. Do not buy a paid company-profile upsell. |
| Yellow-pages.bh / popularbahrain / random “Bahrain business directory” clones | various | — | **EXCLUDED.** Thin, often paid, look like link schemes. |

Do not pay Gulf “company listing” vendors who email after a domain registration. Classic directory spam.

---

## 4. Content platforms with evergreen referral value

---

### 4.1 Wikipedia — honest assessment

**Bar:** WP:NORG / WP:CORP. An organization is notable if it has *significant coverage in multiple reliable, independent secondary sources*. Launch blogs we wrote, our own site, Crunchbase, and a Sijilat record do not count. A GDN / Wamda / TradeArabia brief *might* count as one source if it is substantial, not a reprinted press release. We would still need a second independent source that is not a clone of the first.

**What would get us an article**

- Two or more substantial independent pieces (not “based on a press release”) in reliable outlets, **or**
- Inclusion in a reliable industry survey that treats us as a market actor, **or**
- A clearly documented public-interest event (e.g. a regulator or rights-holder story) covered independently.

**What we have today:** a 3-week-old domain, no published MAU, no independent feature. **We do not merit a standalone article.** Creating one ourselves is promotional and will be deleted. Do not.

**What we might merit later:** a one-line mention on *List of streaming media services* or *FAST* **after** independent RS exist. Even then, a volunteer editor should add it, not the founder, to avoid COI drama. If Ali edits Wikipedia at all, disclose the conflict on the user page and do not touch Whisco articles.

**Action this campaign:** zero Wikipedia article work. Earn the sources via Press Kit after apps are public. Revisit in 2027.

---

### 4.2 Wikidata / knowledge graph — we can start NOW

Wikidata’s notability bar is lower than Wikipedia’s. A clearly identifiable organization with an official website can have an item. Google’s knowledge panel often leans on Wikidata + the official site + schema.org.

**Caveats**

- New Wikidata accounts may need to be autoconfirmed (commonly: account age + a floor of edits) before they can create items. Sources disagree on the exact numbers; treat “create account today, make small useful edits for a few days, then create the item” as the safe path.
- Disclose COI on the user page. Paid-contribution rules apply if anyone is paid to edit. Ali as founder = COI, not paid-editing if he is unpaid.
- Do not write marketing into the description.

**Exact process**

1. Create an account at https://www.wikidata.org (TODAY).
2. User page: one sentence. `I am the founder of Whisco TV (whisco.tv). I will not edit the English Wikipedia article about the company if one is created. Edits to the Wikidata item will be factual and referenced.`
3. Search “Whisco TV” and “وسکو تي في” first. If a stub exists, edit it. Do not duplicate.
4. Create item: https://www.wikidata.org/wiki/Special:NewItem
   - Language: en
   - Label: `Whisco TV`
   - Description: `Bahrain-based free ad-supported streaming service`
   - Aliases: `Whisco.tv | وسکو تي في`
5. Then add AR label `وسکو تي في` and AR description `منصة بث مجانية مدعومة بالإعلانات مقرها البحرين`.
6. Minimum statements (with a reference URL on each):

| Property | ID | Value | Reference |
|---|---|---|---|
| instance of | P31 | streaming service / video streaming service (pick the item that exists; do not mint a new class) | whisco.tv About |
| official website | P856 | https://whisco.tv | the site |
| country | P17 | Bahrain (Q398) | About / future CR |
| inception | P571 | 2026 | domain live 20 Aug 2026; use 2026 unless a firmer founding instrument exists |
| headquarters location | P159 | Manama (Q3882) | About |
| official name | P1448 | Whisco TV | site |
| logo image | P154 | only if a file is on Commons under a free license | **HOLD** — do not upload a trademarked logo to Commons without a clear free license. Skip for now. |
| X username / social | as applicable | only accounts that exist | |

7. Add `sameAs` on whisco.tv JSON-LD pointing at the new `https://www.wikidata.org/wiki/QXXXX`. That is a 15-minute engineering task and is the actual knowledge-graph payoff.

**Do not** create a Wikidata item for the dog as a “mascot character” in week 1. Cute, not useful.

---

### 4.3 Quora / Stack Exchange — 20 questions with URLs

Stack Exchange has almost no “how to watch X legally in the Gulf” home. Movies & TV SE is titles-and-trivia. **Do not** force Whisco onto SE.

Quora *does* have durable “where can I watch…” questions. Quora’s 2026 ranking is weaker than 2018, but answers still sit under Google long-tails. Rules: one human account, real name or consistent founder name, disclose affiliation the first time (`I built Whisco TV, a free legal AVOD for GCC expats — mentioning it only where it actually answers the question`). No copy-paste blobs. No answering 20 questions in one night.

**How to work a question (15 min each)**

1. Open the URL.
2. If a legal, current answer already exists and is complete, upvote it and add a short comment only if we add a fact.
3. If the answers are pirate site lists, write a clean legal answer: official YouTube / Tabii / puhutv / Shahid / ZEE5 *and*, where true, Whisco as a GCC-legal hub.
4. Never blast the same paragraph.

**20 questions** (verified live URLs as of research week; Quora slugs can 404 if merged — if a link dies, search the title on Quora and answer the surviving canonical):

1. https://www.quora.com/Is-there-any-website-where-I-can-watch-Turkish-series-with-English-subtitles
2. https://www.quora.com/What-are-the-best-sites-to-watch-Turkish-dramas-with-English-subtitles
3. https://www.quora.com/How-can-I-watch-Turkish-series-for-free
4. https://www.quora.com/Where-can-I-watch-Pakistani-dramas-online-for-free
5. https://www.quora.com/What-is-the-best-website-to-watch-Pakistani-dramas
6. https://www.quora.com/How-can-I-watch-Indian-TV-serials-online-for-free
7. https://www.quora.com/What-are-the-best-free-websites-to-watch-Bollywood-movies
8. https://www.quora.com/Where-can-I-watch-Malayalam-movies-online-for-free
9. https://www.quora.com/How-can-I-watch-Malayalam-channels-live-outside-India
10. https://www.quora.com/What-is-the-best-app-to-watch-live-TV-channels-for-free
11. https://www.quora.com/How-can-I-watch-Filipino-channels-abroad
12. https://www.quora.com/Where-can-I-watch-Pinoy-TV-live-outside-the-Philippines
13. https://www.quora.com/What-are-legal-alternatives-to-IPTV
14. https://www.quora.com/Is-there-any-legal-way-to-watch-live-TV-online-for-free
15. https://www.quora.com/How-do-expats-in-Dubai-watch-Indian-channels
16. https://www.quora.com/How-can-I-watch-Arabic-series-for-free
17. https://www.quora.com/What-is-the-best-free-streaming-service-2024 (and the 2025/2026 retitles — search “best free streaming service”)
18. https://www.quora.com/Which-is-better-YuppTV-or-ZEE5-for-living-abroad
19. https://www.quora.com/How-can-I-watch-Bengali-movies-and-serials-outside-Bangladesh
20. https://www.quora.com/What-are-the-best-apps-for-watching-Turkish-series-in-the-Middle-East

If a numbered URL 404s, the fallback search string is the title text. Do not invent new Quora questions just to answer them — that is a known spam pattern.

**Spaces:** Quora Spaces for “Turkish Dramas,” “Expat Life UAE,” “Malayalam Cinema” — join, do not raid. One useful post per space per month maximum.

---

### 4.4 YouTube — would a guide-clip channel drive site visits?

**Short answer: not as a week-1 traffic engine. Yes as a 2027 asset, with constraints.**

Reasoning:

- YouTube *search* for “watch Turkish series legally” / “free Malayalam TV GCC” is real. A 4–7 minute screen-capture guide that ends on whisco.tv can rank and refer.
- YouTube *as a host of our catalog* is already the point — we embed official uploads. A second channel that re-uploads other people’s shows is a strike waiting to happen. **Never re-upload catalog content.**
- A channel of original guide clips (How to cancel a pirate box, How to find FTA cricket vs what still needs a paid app, Tonight on Whisco-style wraps) matches the Originals Strategy: mascot-as-announcer, no critic LoRA, ≤6 hours/week of first-party wraps.
- Discovery on YouTube is slow without a posting cadence. Cadence without a face or a consistent announcer format dies. We do not have spare founder hours inside a 2 hour/week *submission* budget.
- Click-through from YouTube to web is real but modest unless the video is a direct “open this URL” tutorial.

**Decision:** do **not** stand up a YouTube channel as part of this 6-week submission campaign. Reuse the Originals Strategy later. If a single clip is shot during originals production, describe-link whisco.tv and the store listings (once public). That is content ops, not directory ops.

---

## 5. The campaign calendar

Six weeks. Cap: **2 hours in any week.** If a task needs engineering (the titles feed), that engineering time is *not* inside the 2 hours — it is a separate Arena/GitHub ticket. The 2 hours are founder-facing: forms, emails, answers, tracker.

**T+0 = Thursday 10 September 2026** (the day this file is first read). Week 1 starts today.

### 5.1 Week-by-week checklist

#### Week 1 — 10–16 Sep 2026 — forms that can fire TODAY
**Budget this week:** $5 AlternativeTo priority (optional but recommended). Remaining cap $45.

- [ ] Create partnerships@ alias if it does not exist. All directory mail goes there.
- [ ] Create a single tracking sheet (format in §5.4). One tab.
- [ ] JustWatch integration page + Google form. Paste short EN description. Locales: BH, SA, AE, KW, QA, OM + any other country we actually geo-serve. Monthly users: early-stage sentence. **45 min.**
- [ ] Email Reelgood (support@ + feedback@) and Watchmode contact. One medium-EN body, two addresses each. **20 min.**
- [ ] Yidio: about-page contact / form. Same medium body. **10 min.**
- [ ] AlternativeTo account + submit. Pay $5 priority if the card is handy. **20 min.**
- [ ] Crunchbase account + Create Profile. No funding figures. **15 min.**
- [ ] Wikidata account + COI user page. **10 min.**
- [ ] Product Hunt account (warm-up only). Comment honestly on two launches this week. **10 min.**
- [ ] APKPure account created. No APK uploaded. **5 min.**
- [ ] Open a GitHub ticket: `feeds/catalog.json` — TMDB/IMDb-matched VOD + live-channel list, daily refresh. This is the JustWatch unblocking item. **Not in the 2 hours; assign to the engineering agent.**

**Do not this week:** Amazon, Samsung, Huawei, Product Hunt launch, Quora blast, Wikipedia, BetaList, Fire TV, Plex carriage.

#### Week 2 — 17–23 Sep 2026 — knowledge graph + first human answers
- [ ] Wikidata item (if autoconfirmed) with the statement set in §4.2. **30 min.**
- [ ] Ticket to add `sameAs` Wikidata URL in site JSON-LD. Engineering agent.
- [ ] Quora: answer **3** questions from the list of 20, starting with #1, #13, #15. **45 min.**
- [ ] Indie Hackers: one founder post, 200–300 words, no hype. **20 min.**
- [ ] Check JustWatch / Reelgood inboxes. One polite bump only if 7+ days and no auto-ack. **10 min.**
- [ ] Confirm catalog-feed ticket has a first JSON shape, even if partial.

#### Week 3 — 24–30 Sep 2026 — feed + second-wave aggregators
- [ ] If the feed URL is live, reply to JustWatch with the URL and a 10-line changelog (title count, % TMDB-matched, refresh cadence). **20 min.**
- [ ] Quora: 3 more answers (#4, #8, #10). **45 min.**
- [ ] AlternativeTo: if live, add as alternative on ZEE5 / YuppTV / Shahid pages. **20 min.**
- [ ] Decision gate: has Play production or App Store gone live? If yes, unlock Week 4 store work. If no, skip stores and do Crunchbase polish + one more aggregator bump.

#### Week 4 — 1–7 Oct 2026 — stores that need a public binary, or keep harvesting web
**Only if a public Android or iOS listing exists.** Otherwise repeat Week 3 pattern (3 Quora + feed follow-up).

- [ ] Amazon developer account. Start listing draft. Do not submit until a Fire-adjacent APK is tested. **30 min account + assets.**
- [ ] Huawei ID + begin identity verification (scan passport / CR if ready). **30 min.**
- [ ] Samsung Seller Portal account. Start commercial-seller packet only if CR exists; else stop after account creation. **20 min.**
- [ ] Quora: 3 more (#11, #16, #18). **40 min.**

#### Week 5 — 8–14 Oct 2026 — PH warm-up peak + leftover directories
- [ ] Product Hunt: schedule a launch date for Week 6 *only if* a public store URL exists and Ali can staff comments. Else slip PH to a later month. **20 min.**
- [ ] SaaSHub / one extra clean directory only if Week 1–4 leftovers exist. **15 min.**
- [ ] Quora: 3 more (#7, #14, #20). **40 min.**
- [ ] Inbox sweep. Close anything rejected. Log reasons.

#### Week 6 — 15–21 Oct 2026 — launch window or tidy-up
- [ ] If PH is scheduled: launch at 12:01 AM PT, first comment posted by Ali, replies all day. This week the 2-hour cap is waived on launch day only — PH is a 24-hour product. If we cannot waive it, do not launch.
- [ ] If PH is not scheduled: write a one-page campaign retrospective in this file’s appendix (what landed, what is still pending, what to retry in January 2027). **40 min.**
- [ ] Quora: last 5 questions, or stop if quality is dropping. **40 min.**
- [ ] Do not spend leftover $45 on a directory package. Leave it unspent.

---

### 5.2 Week-1 top 10 (the only list that matters on day one)

| # | Target | Gate | Minutes | Done when |
|---|---|---|---|---|
| 1 | JustWatch service-integration + Google form | TODAY | 45 | Both forms submitted, screenshot in tracker |
| 2 | Reelgood email | TODAY | 10 | Sent, thread logged |
| 3 | Yidio contact | TODAY | 10 | Sent |
| 4 | Watchmode contact | TODAY | 10 | Sent |
| 5 | AlternativeTo listing (+ $5) | TODAY | 20 | Submitted |
| 6 | Crunchbase org profile | TODAY | 15 | Live or in review |
| 7 | Wikidata account + COI page | TODAY | 10 | Account exists |
| 8 | Catalog-feed GitHub ticket | TODAY | 10 | Ticket assigned |
| 9 | Product Hunt maker account | TODAY | 10 | Profile not empty |
| 10 | APKPure account (defensive) | TODAY | 5 | Logged in, nothing uploaded |

Everything else waits.

---

### 5.3 Submission copy templates

Reuse. Do not invent a new paragraph per site. Swap the length, keep the facts.

#### EN — short (≤300 characters, taglines, form “short description”)

Whisco TV is a free, legal, ad-supported TV app for Gulf expatriate homes. Live channels and on-demand titles in 13 languages, no signup, no pirate streams. Built in Bahrain. https://whisco.tv

#### EN — medium (500–800 characters, most directory bodies)

Whisco TV (whisco.tv) is a free AVOD/FAST streaming service built in Bahrain for expatriate households across the GCC. It gathers official free-to-air channels, official broadcaster uploads, and public-domain titles into one dark, no-signup app — Hindi, Malayalam, Tamil, Telugu, Urdu, Bengali, Arabic, Turkish, Filipino, and more. Every title is legality- and geo-checked for the six GCC states. No subscriptions. No pirate sources. One honest ad slot per page, never on top of the player. Web is live; mobile apps follow the official stores.

#### EN — long (directory “full description” / Crunchbase)

Whisco TV is a Bahrain-based free streaming platform for the Gulf’s expatriate households — the people who today juggle three paid language-silo apps or a pirate IPTV box that dies mid-match. The catalog is officially sourced only: free-to-air broadcasts, official broadcaster channels and YouTube uploads, and public-domain works. Automated checks hide anything that fails embeddability or GCC geo-availability. The product is web-first at whisco.tv, with Android and iOS apps in official-store review. There is no subscription and no account requirement. Advertising is limited to a single display slot per page, never adjacent to the player. The name is the founder’s Shih Tzu. The company is founder-operated.

#### AR — short

وسكو تي في منصة بث مجانية قانونية مدعومة بالإعلانات، مبنية في البحرين لبيوت المغتربين في الخليج. قنوات مباشرة ومحتوى حسب الطلب بـ13 لغة، من دون تسجيل ومن دون مصادر مقرصنة. https://whisco.tv

#### AR — medium

وسكو تي في (whisco.tv) خدمة بث مجانية بنموذج الإعلانات، مقرها البحرين، موجّهة لأسر المغتربين في دول مجلس التعاون. تجمع القنوات الرسمية المفتوحة وبثّ الهيئات الرسمية والأعمال الواقعة في الملك العام في تطبيق واحد دون اشتراك ودون قرصنة. الكتالوج يخضع لفحص قانوني وتوفر جغرافي لدول الخليج الست. الإعلان خانة واحدة في الصفحة، بعيداً عن المشغّل.

#### Email subject lines (pick one)

- `Whisco TV — free legal AVOD for GCC expats, requesting catalog ingestion`
- `New free streaming service (Bahrain) — titles feed available on request`
- `Please consider adding Whisco TV to your free / AVOD provider list`

#### Email body (aggregators)

```
Hello,

I’m Ali Albaharna, founder of Whisco TV (https://whisco.tv), a free legal
AVOD/FAST service built in Bahrain for expatriate households in the GCC.

We do not host pirate streams. The catalog is official FTA, official
broadcaster uploads, and public-domain titles, geo-checked for BH/SA/AE/KW/QA/OM.
Web is live. Android and iOS are in official-store review.

We would like to be listed as a free / ads provider. I can provide:
- a website sitemap of title pages
- a JSON titles feed matched to TMDB/IMDb IDs (in progress; I will send the URL)
- deeplink patterns for web (and store URLs once they are public)

We are early-stage and do not publish traffic figures yet. Happy to answer
anything you need for an evaluation.

Thank you,
Ali Albaharna
partnerships@whisco.tv
Manama, Kingdom of Bahrain
```

Do not attach a pitch deck. Do not mention the dog in aggregator mail. Do not mention Filmhub.

---

### 5.4 Tracking table format

Keep this as a sheet (Google Sheet or the xlsx later). Columns, in this order:

| col | name | values |
|---|---|---|
| A | Target | JustWatch, Reelgood, … |
| B | Section | 1 Aggregator / 2 Store / 3 Directory / 4 Content |
| C | URL submitted | the exact form or inbox |
| D | Date submitted | ISO |
| E | Status | `draft` `submitted` `pending` `live` `rejected` `excluded` `hold` |
| F | Gate | TODAY / APPS / CR / FEED / HOLD / EXCLUDED |
| G | Follow-up on | date |
| H | Live URL | public listing when it exists |
| I | Notes | rejection reason, feed URL sent, $ spent |
| J | Owner | Ali |

Status hygiene: `pending` after send, `live` only when a third party can click it without a login, `rejected` only with a written reason. Never delete a row.

Suggested first 25 rows to pre-load so the sheet is not empty on Friday:

JustWatch, Reelgood, Yidio, Watchmode, Flixed (hold), TMDB-as-volunteer, AlternativeTo, Crunchbase, Product Hunt (account), Product Hunt (launch), Indie Hackers, Wikidata, APKPure (account), Amazon Appstore, Samsung Galaxy Store, Huawei AppGallery, Aptoide (hold), F-Droid (excluded), BetaList (hold), InterNations (hold), ExpatWoman (editorial), Sijilat (CR), Quora-batch-1, Comparitech (editorial, hold), Wikipedia article (hold).

---

### 5.5 What needs what — one-screen view

**Can fire TODAY**
JustWatch forms, Reelgood/Yidio/Watchmode email, AlternativeTo, Crunchbase, Wikidata account, PH maker account, APKPure account, Indie Hackers post, Quora answers, catalog-feed ticket.

**Needs the apps publicly live**
Product Hunt launch, Amazon Appstore submit, Huawei submit, Samsung binary submit, Android TV lists, any “download on Play / App Store” badge on a third-party page, most editorial “best apps” pitches.

**Needs the W.L.L. / CR first**
Samsung commercial-seller packet (practically), Bahrain Chamber listing, Sijilat name check, any vendor who asks for a CR copy, paid InterNations / ExpatWoman media later, anything that wants an invoice entity.

**Needs a titles feed**
JustWatch actual ingestion, Reelgood if they engage, Watchmode if they engage, any future TMDB/JustWatch-shaped partner.

**Do not do in this campaign**
F-Droid, pirate/IPTV playlists, Stremio addons, Fiverr backlinks, directory blasts, Wikipedia article creation, Plex/Pluto/Roku carriage, APK upload to mirrors, BetaList unless budget is deliberately spent, YouTube catalog re-uploads.

---

## 6. Exclusions register (borderline items, with the reason)

| Item | Why excluded |
|---|---|
| Fiverr / Upwork “I will build you 100 backlinks” | Link scheme. Against Google spam policies and our anti-hype doctrine. |
| Submit-to-400-directories agencies (LaunchTank clones used as a *service we buy*) | Mostly nofollow spam. We would not review each ToS. |
| G2, Capterra, GetApp | Wrong category (B2B software reviews). Fake-review risk. |
| TAAFT and “AI tool” directories | Mis-tags the product. |
| Stremio / Torrentio / any debrid addon catalog | Pirate-adjacent. |
| iptv-org playlists and awesome-iptv | IPTV framing vs anti-pirate brand. |
| APK upload to APKPure / APKCombo during closed testing | Leaks an unsigned-to-the-world build; clone risk. |
| F-Droid request | Cannot meet FLOSS inclusion policy. |
| Wikipedia article created by founder | Fails NORG; COI deletion. |
| Paying for JustWatch / Reelgood “placement” via a third party | No such official product. Scam. |
| Dubizzle / OpenSooq app listings | Looks like classified fraud. |
| Gulf paid “business directory” cold emails | Directory spam. |
| Quora partner-program / paid-answer vendors | Against “human-only community posting.” |

---

## 7. Uncertainty log (do not pretend we know)

- JustWatch and Reelgood do **not** publish an SLA. “We filed the form” ≠ “we will be listed.”
- Yidio partner email is not publicly documented. The about page may be a dead end.
- Flixed is a US data vendor. Response probability is low.
- AlternativeTo free queue is “months”; $5 is the only lever.
- Huawei GCC country coverage and HMS maps differ — confirm in-console.
- Samsung 16KB page-size mandate date slipped past 1 Jul 2026; check Seller Portal notice on upload day.
- Wikidata autoconfirm thresholds change. If Special:NewItem is blocked, keep editing for a few days.
- Quora URLs in §4.3 can be merged or deleted. Search the title if a slug 404s.
- There is no GCC-native JustWatch equivalent with a public intake form as of 10 Sep 2026. If one appears, add a row — do not invent one.
- Traffic from any of the above is unmeasured until listings are live and Vercel Web Analytics has a referrer row. Do not forecast sessions.

---

## 8. After week 6

Park this file. Re-open it the week *after* both stores are public, and again the week the W.L.L. CR number exists. Those two events unlock more rows than any amount of form-filling in September.

The durable asset this campaign is really building is not a pile of listings. It is (1) a clean TMDB-matched titles feed, (2) a Wikidata Q-id wired into JSON-LD, and (3) a tracker that tells us who already said no so we do not ask twice.
