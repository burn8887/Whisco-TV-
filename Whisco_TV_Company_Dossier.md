# WHISCO TV — COMPANY DOSSIER & KNOWLEDGE BASE
*Version 1.0 — 5 September 2026. Purpose: complete background for analysts, advisors, and AI assistants working on Whisco TV business tasks. This document is the authoritative context; where a task prompt conflicts with it, flag the conflict rather than guessing. Contains no credentials or secrets by design.*

---

# 1. IDENTITY — WHO WE ARE

**Whisco TV** (https://whisco.tv) is a 100% free, ad-supported (AVOD/FAST) streaming platform built for the ~30 million expatriates of the Gulf Cooperation Council countries (Bahrain, Saudi Arabia, UAE, Kuwait, Qatar, Oman) — and for anyone worldwide who wants TV from home without paying or pirating.

- **Founded:** 2026 (domain live 20 Aug 2026; platform development began mid-2026)
- **Base:** Bahrain. Founder-operated, currently unincorporated (formation is an active workstream)
- **Founder:** Ali Albaharna — hands-on operator; engineering executed by an AI agent workflow under his direction
- **Funding:** an angel supporter contributes **$200/month** (informal, non-equity, goodwill arrangement); plus a one-time approved content/infrastructure budget of $300
- **The name:** Whisco is the founder's real Shih Tzu. He is the mascot and the soul of the brand — the platform's personality is his: friendly, loyal, zero pretension. Tagline: *"Life's better at full speed — and full free."*
- **Core promise:** No subscription. No signup required. No pirated content. Ever.

## Mission
Give every expat household in the Gulf a legal, free, premium-feeling way to watch TV from home — and end the region's dependence on pirate IPTV boxes.

## The problem we solve
A Gulf expat family today chooses between: (a) paying for 3–5 siloed apps (ZEE5, YuppTV, iWantTFC, Shahid… each covering one slice of one language), (b) a pirate IPTV box — illegal, malware-prone, freezes during the cricket, seller vanishes with the renewal money, or (c) going without TV from home. An enormous share of home-country content is actually **legally free** (free-to-air broadcasts, official broadcaster channels, public domain) — but scattered and unfindable. Whisco TV aggregates, verifies, and organizes it into one premium experience.

---

# 2. WHAT WE HAVE — PLATFORM & ASSETS (verified 5 Sep 2026)

## 2.1 Catalog (live production numbers)
| Asset | Count | Notes |
|---|---|---|
| Live TV channels | **581 active** (~620 total) | Free-to-air HLS streams + official YouTube-live; auto-health-checked every 6 hours; dead channels auto-hidden, auto-restored when back |
| On-demand titles | **15,696 active** (~17k catalog) | Growing weekly via automated discovery |
| Turkish series (dizi) | 61 series / ~3,650 episodes | Incl. complete runs of Teşkilat (183 eps), Emanet (800+), latest 2025-26 wave (Aynadaki Yabancı, Çarpıntı, Ben Leman, Cennetin Çocukları) |
| Arabic series | 333 series / ~7,100 episodes | Kuwait 121, Syria 73, Lebanon 52, UAE 42, Jordan 26, Qatar 15, Bahrain 1 |
| Hindi cinema | 2,500+ titles | Goldmines, Shemaroo, Rajshri, B4U and other official studio channels |
| Other major shelves | Malayalam (672), Telugu (626), Bangla (678), Filipino (831), Pakistani dramas (1,163), Indonesian (517), documentaries (2,009), game shows (585) + more | 13 languages total |
| Editorial guides | 7 hand-written long-form articles | Turkish dizi, Pakistani dramas, Bollywood, Malayalam cinema, Arabic series, expat free-TV guide, "Cut the Pirate Box" |

**Content legality doctrine (non-negotiable):** every item is legally sourced — official broadcaster channels/embeds, free-to-air broadcasts, public domain. Every title passes automated verification before entering the catalog: embeddability check + duration check + **per-country geo-availability verification for all six GCC states**. ~2,360 titles that failed GCC geo checks are hidden, not shown broken. Sanctioned/politically-excluded channels are permanently blacklisted. No demo/fake content. Rights-holder takedowns honored via legal@whisco.tv.

**Monetization nuance (important for financial modeling):** most VOD is served via official YouTube embeds — in those plays, the *broadcaster* earns the in-player ad revenue, not us. Our current monetizable surface is display advertising on surrounding pages. The strategic unlock is **own-player licensed content** (see Filmhub, §4), where video pre-roll ads pay 5–10× display rates.

## 2.2 Distribution surfaces
| Surface | Status |
|---|---|
| Web (whisco.tv) | Live. Next.js app: browse, live TV with language filters, VOD shelves, per-title pages with SEO metadata, watchlists, resume-watching, PWA installable |
| Android app | **Google Play closed testing, 26 active testers**, mandatory 14-day clock running; production release follows |
| iOS app | **Submitted to App Store review 2 Sep 2026** — decision pending; TestFlight build live and tested clean ("Excellent layout. All features and pages work correctly," zero crashes) |
| Future | Android TV / Google TV build (config exists), Amazon Fire TV via Amazon Appstore, Samsung/LG TV apps — post-launch roadmap |

Both apps: native video player (ExoPlayer/AVPlayer) for HLS, YouTube content via official embedded player (ToS-compliant), local-first watchlist/resume (no login needed), 100% free, **"Data Not Collected" privacy labels on both stores** (zero analytics/ads SDKs in v1 by policy).

## 2.3 Technology & operations (the quiet moat)
- **Stack:** Next.js (Vercel Pro), Neon Postgres, React Native/Expo apps. Infra cost: **under $50/month total.**
- **Automation-first operations** — the reason one founder + one AI agent can run 600 channels:
  - Uptime monitoring every 15 minutes (site + APIs + mobile endpoints), with retry logic and DNS cross-checks; email alerts
  - Channel health checks every 6h (2-hop HLS validation); VOD checks in rotating batches (embeddability + geo)
  - Content discovery crons (Mon+Thu): scan vetted sources, verify, add up to 25 channels/run + new VOD from 16 vetted official channels
  - Daily Turkish-dizi episode updater from official broadcaster feeds
  - Weekly maintenance: prune dead content, rotate trending, stats report
  - IndexNow: instant search-engine pings on every catalog change
  - Monthly billing pre-check reminder (automated GitHub Issue)
  - Weekly community-post digest (drafts for human posting — automation never posts)
- **Track record:** 30-day workflow success rate ~100%; one false-positive uptime alarm (infrastructure blip on the monitor's side, site never down) led to same-day monitor hardening.
- **Disaster recovery:** full catalog snapshots committed to git (restorable to a fresh DB in ~1 hour); dual-repo code backup; documented rebuild-from-zero runbook.

## 2.4 Traffic & audience (honest status)
- **Early-stage. No meaningful MAU yet — do not invent numbers.** Domain is 2 weeks old; cookieless analytics (Vercel Web Analytics) instrumented 3 Sep 2026; apps not yet publicly launched.
- Growth engines in place: SEO (7 guides + 2,680-URL clean sitemap + per-title metadata), app-store discovery (ASO keyword: "free live tv"), WhatsApp share toolchain (branded link-preview cards + one-tap localized share captions in 7 languages), weekly community-posting playbook grounded in a 58-community research map.
- First real traffic data expected within weeks; all projections must be labeled as projections.

## 2.5 Brand
- Dark premium UI (#0a0a0f base, orange #f97316 → pink #db2777 gradients), minimal, deliberately un-cluttered.
- Whisco the Shih Tzu appears as mascot across web/app/social assets (transparent-background renders, video banner).
- Tone: honest, expat-first, anti-hype. We openly tell users what still needs a paid app (live cricket/EPL) — honesty is the trust wedge against both pirates and over-promising competitors.
- **Advertising doctrine:** maximum 1 ad slot per page, never adjacent to the player, no pop-unders/redirects/push-ad networks ever. (Market research confirms "ad overload on free apps" is the #1 user complaint against all regional competitors — our restraint is a designed differentiator.)

---

# 3. MONETIZATION — STATE & PLAN

| Stream | Status | Notes |
|---|---|---|
| Display ads (Google AdSense) | Re-review expected ~mid-Sept 2026 | Initial verdict was "low value content"; remediation complete (12,437 thin pages noindexed, sitemap cut to 2,680 quality URLs, 7 editorial guides published). Publisher account active. |
| Video pre-roll (own player) | Planned; unlocked by licensed content | The step-change: GCC video CPMs ($8–20) vs display ($2–8). Requires Filmhub-class licensed files in our own player. |
| Direct sponsorships | Future (needs traffic proof) | GCC prospects: remittance companies, telcos, Asian grocery chains, airlines. Realistic first revenue: $500–2,000/mo placements once analytics mature. |
| Subscriptions | **Never.** | Core brand promise. |

**Cost base:** ~$25–35/month infrastructure + $99/year Apple + ~$110/month planned Meta ads post-AdSense = total run-rate ≈ $43/month worst case against $200/month funding. The business survives indefinitely at current burn; revenue is upside, not survival.

**Conservative internal forecast (for calibration):** Y1 revenue $300–1,500 total; Y2 $4–15k; Y3 $15–50k/yr with own-player video inventory as the main variable. Treat as the floor scenario when building models.

---

# 4. ACTIVE STRATEGIC WORKSTREAMS (September 2026)

1. **Filmhub channel partnership** — application submitted; **received a phone-call invitation from Filmhub (Sept 2026)** — deal discussions upcoming. Filmhub = rights marketplace (a16z-backed) licensing indie films/series to streaming channels on revenue-share. Our plan: start with 100–300 titles (South Asian family drama proxies, family/faith, thriller/docs), GCC-territory-verified, rev-share only, **no minimum guarantees, no upfront fees, no exclusivity**. Delivery pipeline (S3-compatible ingest via Bunny CDN, own-player playback, automated monthly reporting) is designed and deployable within a day of acceptance.
2. **App store launches** — iOS decision imminent; Android 14-day testing clock running toward production access.
3. **AdSense re-review** — mid-September; first ad revenue follows approval.
4. **Community growth program** — weekly digest of human-posted, research-targeted helpful answers (Expat.com Bahrain, r/cordcutters, r/ABCDesis, Turkish-drama communities); WhatsApp Channel planned.
5. **Company formation (Bahrain)** — deciding entity type; needed for contracts, banking, investor-readiness.

---

# 5. MARKET CONTEXT

- **Audience:** 30M+ GCC expatriates — Indians (largest; Kerala/Malayalam heavily represented, ~3M Malayalis in GCC), Pakistanis, Bangladeshis, Filipinos (OFWs), Indonesians, Nepalis, Sri Lankans, Arab expats (Egyptian, Levantine), plus Turkish-drama audiences across all groups. Multi-language households are common.
- **Competitive landscape:** Paid Arabic-first platforms (Shahid VIP, OSN+, StarzPlay, TOD/beIN for sport); paid single-language silos (ZEE5, YuppTV, iWantTFC, Viu); free-with-heavy-ads regional apps (Weyyak, Aloula); global FAST absent or thin in Gulf app stores (Tubi/Pluto not on iOS AE/SA/BH). **The true incumbent is pirate IPTV** — the "10,000 channels for 5 dinars" box economy.
- **Verified market gaps we occupy** (from Sept 2026 competitive research mining 1–2★ reviews of 15 competitor apps): (1) no app cleanly serves multi-language expat households free and legally; (2) #1 complaint across ALL competitors is ad overload on "free"; (3) no-signup experiences are nearly nonexistent; (4) no one owns "legal HD English-sub Turkish dizi" in Gulf stores; (5) Bahrain/Qatar audiences underserved vs UAE/Saudi weighting.
- **Sharing culture:** WhatsApp is the trust layer (family/community groups drive discovery), Telegram is the catalog layer. Recommendations travel as "sender looks helpful to family," never as brand marketing. Our share toolchain is built around this.
- **What we deliberately do NOT compete for:** live premium sports rights (beIN-scale economics), day-one blockbusters (windowing makes them unavailable at any price to free platforms), Arabic-first premium originals (Shahid's turf). We tell users honestly to pay for TOD/beIN if live sport matters — that honesty differentiates us.

---

# 6. WHERE WE'RE GOING — ROADMAP

**Next 90 days (Q4 2026):** both apps live in stores → AdSense approved, first ad revenue → Filmhub deal signed, first 100–150 licensed titles in own player with video ads → analytics-backed media kit → Meta ads campaign starts ($110/mo) → WhatsApp Channel live → company formation completed.

**2027:** own-player content share grows (every licensed hour ≈ 10× embed revenue) → TV apps (Android TV, Fire TV) → first direct sponsorships → 20+ SEO guides → possible second content marketplace (Cineverse, Janson, allrites as Filmhub complements) → first revenue-positive quarter (base case).

**2028–2031 (direction, not commitment):** the recognized legal free-TV brand for Gulf expats; multi-marketplace licensed catalog; sponsorship-led revenue mix; potential expansion to diaspora audiences beyond GCC (UK, North America Gulf-style curation); optionality: sustainable lifestyle business, acquisition target for a regional media group, or raise for growth — decision deferred until data warrants it.

**Scaling constraint (design principle):** everything must remain executable by ≤2 people plus heavy automation until revenue justifies hires. Recommendations that assume a marketing team or ops staff are not actionable — automation-first alternatives are.

---

# 7. DOCTRINES — THE NON-NEGOTIABLES

1. **Legality absolutism:** no pirated content, no grey-area streams, ever. Verification before catalog entry, always. The anti-piracy stance IS the brand.
2. **Free forever:** no subscriptions, no paywalls, no "premium tiers." Ads only.
3. **Ad restraint:** max 1 slot/page, never near the player, no intrusive formats. Revenue never buys UX degradation.
4. **Privacy conservatism:** apps ship zero data collection; web analytics is cookieless; changes only with coordinated store-label updates.
5. **Honesty in marketing:** we say what we don't have (live sports, day-one movies). No invented numbers, no inflated claims — including in investor documents.
6. **Human-in-the-loop for communities:** automation drafts, researches, and measures; humans post. No bots in communities, no fake engagement, no spam.
7. **Rev-share only for content:** no minimum guarantees or upfront licensing fees at this stage.
8. **Budget discipline:** $200/mo envelope; any spend beyond ~$50/mo infra requires explicit founder decision.

---

# 8. HOW TO USE THIS DOSSIER (for AI assistants)

- Treat all figures dated 5 Sep 2026 as accurate as-of that date; catalog grows weekly (discovery automation), so treat counts as floors.
- Where you produce financial or growth projections: anchor to §3's conservative forecast as the floor, label all scenarios explicitly, and never present projections as actuals.
- Where a task requires data marked "early-stage/none yet" (traffic, revenue): say so honestly in the output rather than estimating around it.
- Where legal/regulatory drafting is requested: produce templates and mark them as requiring qualified local counsel review — particularly Bahrain company law and GCC media regulation.
- Deliverables should be Markdown, tables where useful, sources cited for external claims, [EST] markers on estimates.
- The operating workflow: **you draft/research → founder reviews → the engineering agent verifies against live systems and integrates.** Nothing you produce deploys directly.

*End of dossier. Companion documents that may also be provided: research outputs on Gulf expat communities (58-community map), SEO content-gap analysis (long-tail queries), competitive app teardown (15 apps), Filmhub/MENA licensing briefing, and WhatsApp sharing-culture study — all September 2026.*
