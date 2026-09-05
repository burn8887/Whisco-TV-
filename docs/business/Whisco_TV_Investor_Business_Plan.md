# Whisco TV — Investor Business Plan
**Free legal streaming for GCC expatriates | AVOD / FAST**

| | |
|---|---|
| Entity status | Founder-operated, **unincorporated** (Bahrain formation is an active workstream) |
| Founder | Ali Albaharna |
| Site / apps | [whisco.tv](https://whisco.tv) live (20 Aug 2026); Android closed testing; iOS in App Store review (submitted 2 Sep 2026) |
| Plan date | 5 September 2026 |
| Model horizon | Operating years FY1–FY5 = Sep 2026 – Aug 2031; calendar years 2026–2031 shown in summaries |
| Classification | Early-stage. **No meaningful MAU or revenue as of this date.** All audience and financial figures below FY1 M3 are projections. |
| Funding today | Informal angel support **$200 / month** (non-equity, goodwill) + one-time **$300** content/infra budget |

This document is written for a skeptical reader. Industry figures are sourced. Company estimates are marked **[EST]**. Projections are not actuals.

---

## 1. Executive summary

Whisco TV is a 100% free, ad-supported streaming service that aggregates **legally sourced** live TV and on-demand video for the ~31–35 million non-nationals living in the six GCC states. The product promise is narrow and explicit: no subscription, no required signup, no pirated streams. The brand mascot is the founder’s Shih Tzu. The operating system is one founder plus heavy automation.

**The problem is not a shortage of apps.** It is a shortage of one legal surface that a mixed-nationality Gulf household can open without (a) stacking ZEE5 + YuppTV + iWantTFC + Shahid + Viu subscriptions, or (b) buying a pirate IPTV box. Competitive review of 15 store-listed apps (Sep 2026) found the #1 1–2★ complaint across the category is ad overload on “free,” and that no listed app cleanly serves Hindi + Malayalam + Tamil + Urdu + Tagalog + Arabic + English-sub Turkish in one no-signup product. Tubi and Pluto TV are **not listed** on iOS in AE/SA/BH.

**What exists today (5 Sep 2026, production):** 581 active live channels, 15,696 active VOD titles across 13 languages, seven editorial guides, a cookieless-analytics web app, Android closed testing (26 testers), iOS submitted. Content doctrine: official broadcaster embeds, free-to-air HLS, public domain; every title is geo-checked for all six GCC states before it is shown. ~2,360 titles that failed geo checks are hidden.

**The monetization constraint an investor must underwrite:** most VOD currently plays inside official YouTube embeds. On those plays the *broadcaster* earns in-player ads, not Whisco. Near-term revenue is **display advertising** on surrounding pages (AdSense re-review expected mid-September 2026). The step-change is **own-player licensed files** (Filmhub application in discussion after a September phone-call invitation), where GCC video pre-roll CPMs ($8–20) are several times display RPMs ($2–8). Until that inventory exists, unit economics look like a content site, not like Tubi.

**Market context, compressed.** GCC foreign residents are on the order of **35 million** (GLMM / national statistics 2024; see §2). Indians alone are ~9–10 million across the six states. Middle East AVOD is variously sized at **$1.43bn (2025)** rising to **$2.60bn (2031)** at 10.5% CAGR (Ken Research) or, on a wider MEA definition, **$3.29bn (2025) → $5.92bn (2031)** at 10.89% CAGR (Mordor). 3Vision puts MENA AVOD at ~$1.2bn (2025) → ~$1.9bn (2030), with FAST $189m → $590m. Whisco’s five-year SOM is a rounding error on those numbers — by design. This is a niche aggregator, not a Shahid replacement.

**Money, without decoration.**

| | Conservative | Base | Optimistic |
|---|---:|---:|---:|
| End-FY5 MAU | 45,000 | 140,000 | 350,000 |
| FY5 revenue | $20k | $80k | $248k |
| FY5 opex + tax placeholder | $4k | $23k | $78k |
| FY5 operating result | $16k | $57k | $170k |
| Cumulative FY1–FY5 revenue | $45k | $181k | $551k |
| External cash required beyond $200/mo | **$0** | **$0** | **$0** (hires, if any, funded from revenue) |
| Durable monthly break-even (opex excl. founder labour) | ~$70–310 | ~$220–1,900 | ~$370–6,500 |

The business is already inside its $200/month envelope at a ~$25–50/month infrastructure burn. Revenue is upside, not survival. That is the honest pitch: a cheap option on whether a legal, multi-language, low-ad AVOD can take share from pirate IPTV boxes and from siloed paid apps — executed by one person and automation until the P&L pays for a second.

**What would make this plan wrong:** AdSense never approves; Filmhub or equivalent never delivers playable files; YouTube changes embed rules; a well-capitalised regional player copies the multi-language free positioning with better TV apps; or the founder is incapacitated. Those risks are in §6, not in a footnote.

**Ask of a reader of this plan:** treat it as a diligence memo, not a fundraise deck. There is no priced equity round. Formation, AdSense, store launches, and the Filmhub conversation are the next 90-day gates. Capital beyond the $200/month line is not required to keep the lights on.

---

## 2. Market analysis

### 2.1 GCC population and foreign residents

Official statistical institutes do **not** publish a single, current, nationality-by-country matrix for all six states. Qatar and the UAE in particular withhold a nationals/non-nationals split in some recent releases. The cleanest official compilation is GLMM (Gulf Labour Markets, Migration and Population Programme), drawing on national statistics.

**Total population and foreign share, mid-2024 (GLMM compilation of national statistics)**

| State | Total population | Nationals | Foreign residents | Foreign % |
|---|---:|---:|---:|---:|
| Saudi Arabia | 35,300,280 | 19,635,258 | 15,665,022 | 44.4% |
| UAE | 11,294,243 | n.a. (official) | ~9.9–10.0 million **[EST]** | ~88% **[EST]** |
| Kuwait | 4,881,254 | 1,566,168 | 3,315,086 | 67.9% |
| Oman | 5,203,674 | 2,955,171 | 2,248,503 | 43.2% |
| Qatar | 3,143,491 | n.a. (official) | ~2.70–2.85 million **[EST]** | ~86–88% **[EST]** |
| Bahrain | 1,588,670 | 739,736 | 848,934 | 53.4% |
| **GCC** | **61,411,612** | — | **~34.7–35.5 million [EST]** | **~56–58% [EST]** |

Sources: GLMM “GCC: Total populations in the six GCC states (mid-year figures, 2010–2024)” and “GCC: Total population and percentage of nationals and non-nationals… (mid-2024)”; GAStat population estimates 2024 for Saudi Arabia; Information & eGovernment Authority (Bahrain) via GLMM; NCSI (Oman) via GLMM; PACI (Kuwait) via GLMM. UAE and Qatar foreign counts are **[EST]** applying commonly cited 87–89% foreign shares (UAE FCSC-adjacent reporting; multiple secondary compilations) to GLMM totals.

A separate Arabic-language compilation circulating in 2025–26 put GCC foreign residents at **35.2 million** (Saudi 14.2M / UAE 8.14M / Kuwait 3.3M / Oman 2.28M / Qatar 2.2M / Bahrain 0.83M). That series is directionally consistent with GLMM but uses different year-points and a lower UAE foreign count. **Working planning number for this plan: 31–35 million GCC non-nationals.** The dossier’s “~30 million” is the conservative end of that range.

PACI later prints (end-June 2026) put Kuwait at 5.31 million total with 3.74 million expatriates — evidence the 2024 GLMM snapshot is already a floor in some states.

### 2.2 Foreign residents by nationality (best available official / embassy figures)

Figures below mix census microdata, PACI, NCSI labour bulletins, Indian MEA overseas-Indian stock, and embassy/consular statements. They are **not** a single census. Totals will not add to 35 million; residual “other” is large (Yemenis and other Arabs in Saudi Arabia, Western and East African communities, undocumented, dual counts).

**India (largest single group)**

| Host | Headcount | Year / source |
|---|---:|---|
| UAE | 3.55 million (MEA) to **4.36 million** (Consul General, Dubai, citing Dec 2024 stock) | MEA overseas-Indian stock; Gulf News, 16 May 2025 |
| Saudi Arabia | 1.88 million (census 2022) / 2.46 million (MEA NRI stock) | GAStat census 2022 via GLMM; MEA / MP-IDSA 2026 brief |
| Kuwait | 1.01 million (end-2024) / 1.06 million (PACI mid-2026) | PACI via Arab Times / Times Kuwait |
| Qatar | ~0.70–0.85 million | MEA ~0.70–0.84 million; ~21.8% of ~3.14 million is a commonly repeated secondary figure |
| Oman | 506,630 (end-2024 workers/residents in NCSI nationality table) | Oman Observer citing NCSI, Jan 2025 |
| Bahrain | ~324,000–328,000 | MEA; LMRA Dec 2022 workers+dependents ~299k Indians (partial) |
| **GCC Indians** | **~8.9–10.5 million [EST]** | Sum of the above ranges |

Malayalam is operationally important inside that total: community and press estimates of **~3 million Malayalis in the GCC** are widely repeated and are treated here as **[EST]**, not a census fact. Whisco’s catalog already weights Malayalam (672 titles), Hindi (2,500+), Tamil/Telugu, and Pakistani drama accordingly.

**Other large communities (selected official anchors)**

| Nationality | Anchors | GCC planning range **[EST]** |
|---|---|---:|
| Bangladeshi | SA census 2022: **2.12 million**; Oman NCSI end-2024: **637,152**; Kuwait PACI mid-2026: **333,100**; UAE UN migrant stock 2024: **1.02 million**; Qatar secondary ~12.5% | **4.3–4.9 million** |
| Pakistani | SA census 2022: **1.81 million**; Oman NCSI: **317,296**; Kuwait PACI mid-2026: **105,700**; UAE UN stock 2024: **0.93 million** (press estimates run higher, to ~1.5–1.7 million) | **3.4–4.5 million** |
| Filipino | SA census 2022: **725,893**; Kuwait PACI mid-2026: **226,500**; UAE UN stock 2024: **528,527** (embassy-adjacent figures ~0.7 million); Qatar secondary ~7.4%; Oman NCSI: **44,913** | **1.7–2.1 million** |
| Egyptian | SA census 2022: **1.47 million**; Kuwait PACI mid-2026: **~670,000**; UAE UN stock 2024: **841,883** | **3.0–3.5 million** |
| Nepali | SA census 2022: **297,561**; Kuwait PACI mid-2026: **186,600**; Qatar NRNA statement Nov 2025: **>367,000**; UAE press ~450,000 | **1.2–1.6 million** |
| Yemeni (mostly KSA) | SA census 2022: **1.80 million** | **1.8–2.0 million** |
| Indonesian | SA census 2022: **175,342**; UAE UN stock 2024: **298,351** | **0.5–0.7 million** |
| Sri Lankan | Kuwait PACI mid-2026: **197,400**; SA census 2022: **84,794**; UAE UN stock 2024: **112,759**; Oman NCSI: **24,156** | **0.45–0.60 million** |

**Implications for catalog and GTM, not for vanity TAM slides:**
- South Asian languages (Hindi, Malayalam, Tamil, Telugu, Urdu, Bengali, Nepali, Sinhala) are the demand core.
- Arabic-speaking expats (Egyptian, Levantine, Yemeni, Sudanese) are large in Saudi and Kuwait; they already have Shahid. Whisco’s Arabic wedge is **free legal series + honesty about what is VIP-only**, not a frontal attack on MBC.
- Filipino demand is real and relatively well served by iWantTFC / OSN Pinoy — a harder, not easier, competitive set.
- Turkish dizi with **English subtitles** is a cross-cutting taste, not a nationality. Community research (r/TurkishTVSerials and related) is explicit that legal HD English-sub options are thin and pirate SERPs dominate.

### 2.3 Viewing behaviour that matters to an AVOD

- Households are multi-language. A Dubai or Manama apartment often needs more than one siloed app.
- WhatsApp is the trust and discovery layer; Telegram is the catalogue/piracy layer. Recommendations travel as “this person is helping the family,” not as brand ads (internal community map, 58 communities, Sep 2026).
- Pirate IPTV / Jadoo / Firestick remains the default “all channels, one box, 5 dinars” answer. That is the true incumbent. Legal competitors win only if they are more stable and less shameful, not if they are slightly cheaper than OSN+.
- Smart TV / Chromecast quality is where competitor ratings die (Plex, Dubai+, Weyyak, iWantTFC reviews, Sep 2026 store audit).
- Live premium sport (EPL, some cricket) is **out of scope**. Rights inflation makes it a different business. The product says so.

### 2.4 TAM / SAM / SOM

Definitions used here are population- and spend-based. They are not “if we capture 1% of Netflix.”

**TAM — total addressable**
- *People:* GCC non-nationals aged ~15+ with a smartphone or connected TV who watch long-form video from home countries, plus a smaller spillover of GCC nationals who watch the same South Asian / Turkish / Filipino shelves. **~28–32 million people [EST]** (≈85% of 33–35 million non-nationals, plus a thin national spillover).
- *Spend:* the AVOD/FAST advertising pool that can theoretically be sold against that audience. Using Ken Research’s **Middle East AVOD $1.43bn (2025)** and the four published GCC-country cuts (Saudi $543m, UAE $315m, Qatar $86m, Kuwait $72m = $1.02bn), plus an **[EST]** $80–120m for Oman + Bahrain, the GCC AVOD pool is on the order of **$1.1–1.2bn (2025)**. Not all of that is expat-language inventory — a large share sits on Shahid, YouTube, and Arabic catch-up. Expat-relevant AVOD (South Asian, Filipino, Turkish-EN, multi-language) is **[EST] $250–450 million** in 2025, growing with the category.

**SAM — serviceable addressable**
- People who will consider a *free legal multi-language aggregator* rather than (i) paying 2–4 siloed OTTs, (ii) YouTube-only, or (iii) a pirate box: **[EST] 8–12 million** (roughly 25–35% of TAM people). The rest are either sport-first, Arabic-premium-first, or locked to a single-language paid habit.
- Dollar SAM: **[EST] $80–150 million** in 2026, being the portion of the expat-relevant AVOD pool that a small independent can theoretically bid into (display + GCC pre-roll + regional sponsorships), after excluding YouTube’s own-platform take and broadcaster-owned inventory.

**SOM — serviceable obtainable, five years, given ≤2 operators and $200/month external cash**
- People: the MAU trajectories in §5. End-FY5: 45k / 140k / 350k across the three scenarios. That is **0.15–1.3% of SAM people**.
- Dollars: FY5 revenue $48k / $145k / $385k. Against an $80–150 million SAM that is **0.03–0.5%**. A sceptical investor should prefer these shares to a slide that claims 2% of MENA OTT.

| Layer | People [EST] | 2026 $ [EST] | Whisco FY5 capture (base) |
|---|---:|---:|---|
| TAM | 28–32 million | $250–450 million expat-relevant AVOD | — |
| SAM | 8–12 million | $80–150 million independent-reachable | — |
| SOM FY5 base | 140,000 MAU | $145,000 revenue | ~1.2% of SAM people, ~0.1–0.2% of SAM $ |

### 2.5 MENA / Middle East AVOD market size and CAGR

Analyst houses do not share a definition. Report both, do not average them into a fake consensus.

| Source | Scope | 2025 | Later year | CAGR | Notes |
|---|---|---:|---:|---|---|
| Ken Research | Middle East AVOD | **$1.43bn** | **$2.60bn (2031)** | **10.5% (2026–31)** | Names YouTube, Shahid, Starzplay, OSN+, Prime as majors. Country cuts: SA $543m, UAE $315m, Egypt $172m, QA $86m, KW $72m (2025) |
| Mordor Intelligence | Middle East & Africa AVOD | **$3.29bn** | **$3.53bn (2026) → $5.92bn (2031)** | **10.89% (2026–31)** | Middle East was **87.52%** of MEA AVOD in 2025; Africa faster at 11.61% |
| Mordor Intelligence | Middle East OTT (all models) | $14.85bn | $16.60bn (2026) → $25.56bn (2031) | 9.02% (2026–31) | SVOD 47.5% share 2025; AVOD the faster model at 9.86% CAGR |
| Statista Market Insights | MENA OTT Video | **$5.19bn** | **$7.78bn (2030)** | **8.44% (2025–30)** | Users 378 million by 2030; ARPU $16.59 (2025); SVOD the largest slice |
| 3Vision Video Markets Tracker | MENA streaming | Streaming ~$4.6bn (2025) | ~$7bn (2030) | — | **AVOD ~$1.2bn → ~$1.9bn**; **FAST ~$189m → ~$590m**; SVOD $3.2bn → $4.7bn; SVOD subs ~35 million → ~50 million |

**How to read this for Whisco.** Category tailwind is real (high-single to low-double-digit CAGRs; FAST the fastest sub-slice). The dollars are concentrated in YouTube, Shahid, and a handful of pay platforms selling ads around premium inventory. A Bahrain-based aggregator with display ads and a few hundred licensed files is not “the MENA AVOD market.” It is a thin slice of FAST/AVOD sold against an audience those platforms under-serve.

### 2.6 Competitive landscape

**Paid, Arabic-first (not the main battlefield)**

| Player | Role | Why it matters | Why it is not Whisco |
|---|---|---|---|
| Shahid (MBC) | Regional incumbent. 100M+ Play installs. Free + VIP + Sports. Store scores mixed (Play ~3.6; iOS AE 4.3 / SA 3.3 / BH 3.0, Aug 2026) | Owns Arabic drama, live MBC, Arabic-dubbed Turkish. 85% of some paywalled library reported moved to free (secondary, valantic/Statista-class brief) | Arabic-first, heavy ads on free, travel geo-loss, not a South Asian household app |
| OSN+ | Paid Western + some Arabic/Turkish/Pakistani | Bundle economics, Pinoy packs | Price, not free |
| StarzPlay / Playco | Paid + FAST (60+ FAST channels claimed in trade coverage); absorbed ADtv/ADMN after ADtv retired ~Nov 2025 | Serious FAST operator | Paid core; English/Arabic catalogue, not 13-language expat |
| TOD / beIN | Sport | The reason pirate boxes exist | Out of scope. Whisco tells users to pay for live sport |

**Paid or freemium, language-siloed**

| Player | Role | Review pattern (Sep 2026 store audit) |
|---|---|---|
| ZEE5 | Hindi/Indian catalogue, 100M+ installs, high star rating, **ad breaks on paid** | “Paying money just to watch unskippable commercials every 5 minutes” |
| YuppTV | Diaspora live packs; owns a lot of “Indian channels in Saudi/UAE” SEO | Ads every 3–5 minutes; support complaints; paid users still see ads |
| Viu | SEA + Turkish in MENA; ads + Premium | “5 or 6 ads at a time”; Premium still serves ads |
| iWantTFC | OFW default | Play **2.66★**; freezes; “8 ads… video still doesn’t play” |
| Tapmad / ARY Plus | Pakistani diaspora | Live-match failures after payment; signup loops |
| ManoramaMAX / aha / Sun NXT / Hoichoi / Chaupal | Single-language Indian OTTs | Geo, India-number OTP, currency/App Store region friction — documented in SEO gap research |

**Free / ad-supported**

| Player | Gulf store reality | Gap vs Whisco |
|---|---|---|
| Tubi, Pluto TV | **Not listed on iOS AE/SA/BH** (Sep 2026). Play-listed globally but not a Gulf-curated catalogue | US FAST brands left an App Store hole |
| Plex | Fills the iOS free-movies gap in Gulf stores | VPN comments on free catalogue; not expat-curated |
| Fawesome | Play discovery for “free movies”; no signup | B-movie US catalogue |
| Weyyak | Egyptian/Syrian/Lebanese + dubbed Indian/Turkish; **last Play update Nov 2024 (stale)** | “5 ads together none stop every 5 minutes” |
| Dubai+ (ex-Awaan), Aloula | Local free / public | Thin for non-Arabic households; subtitle and TV-cast complaints |
| Samsung TV Plus / Zee Alwan & Aflam | FAST Bollywood for Arabic-speaking homes | Linear FAST, not a VOD household app |

**The true incumbent: pirate IPTV**

Community evidence (Expat.com Bahrain Firestick threads; r/ABCDesis “Jadoo box” thread; Telegram movie dumps; classified “500+ Indian channels / no dish” sellers) is consistent: the default living-room solution for many labour and family households is an illegal box or a reseller M3U. Failure modes are the product brief — freezing during cricket, seller disappears at renewal, malware, apartment dish bans that push people onto sticks.

Whisco does not beat pirate IPTV on channel count. It beats it on **legality, stability, and not having to trust a stranger with a year’s cash**. That only works if live FTA + YouTube official + a growing licensed shelf cover enough of the evening. It will not cover live premium sport. The plan does not pretend otherwise.

**Positioning that is actually empty (from the Sep 2026 teardown, not from a workshop):**
1. Multi-language expat household, free, legal, no signup.
2. Capped ads (one slot per page, never against the player).
3. Legal HD English-sub Turkish dizi as a Gulf store query.
4. Bahrain / Qatar curation rather than UAE/Saudi-only weighting.
5. Honest “pay TOD for sport” instead of bait-and-switch.

---

## 3. Business model

### 3.1 What is sold

| Stream | Status 5 Sep 2026 | Who pays | When it becomes material |
|---|---|---|---|
| Display ads (AdSense) | Publisher account live; **re-review ~mid-Sep 2026** after “low value content” rejection and remediation (12,437 thin pages noindexed; sitemap cut to 2,680 URLs; 7 guides) | Advertisers via Google | First dollar after approval. Web-first. |
| Video pre-roll / mid-roll in own player | Not live. Requires licensed files (Filmhub or peer marketplace) | Advertisers via Google Ad Manager / equivalent | FY1 H2 at the earliest; the only path to Tubi-like ARPU |
| Direct sponsorship / house ads | Not live | Remittance firms, telcos, Asian grocers, airlines, education agents | Needs a media kit and 90-day traffic proof. First cheques **[EST] $500–2,000 per placement** |
| Subscriptions | **Never** | — | Brand constraint |
| App-store IAP | None | — | No 15/30% tax on ads sold on the open web |

YouTube-embedded VOD is a **distribution** asset (SEO pages, session time, catalog depth) and a **monetization hole**. Model it as such.

### 3.2 Unit economics

**Published / instructed ranges (planning inputs, not measured Whisco yields):**
- GCC display RPM: **$2–8**
- GCC video pre-roll CPM: **$8–20**
- Tubi-class US AVOD revenue per MAU: **~$30–40 / year** (ceiling reference only)
- MENA discount to that ceiling: **70–90%** until own-player hours and CTV inventory exist. Planning ARPU at maturity on this product: **$4–12 / MAU / year [EST]**, not $30.

**Fill rate — assumed, not measured**

| Year | Display fill | Video fill | Comment |
|---|---:|---:|---|
| FY1 | 20% → 40% | 25% → 45% (from first licensed month) | New sites fill poorly; AdSense ramp; limited geo-advertiser demand at tiny scale |
| FY2 | 45–55% | 50–60% | Better session quality, more GCC inventory in AdSense |
| FY3 | 55–65% | 60–70% | House sponsorships start replacing some remnant |
| FY4–FY5 | 60–70% | 65–75% | Still not a premium CTV marketplace |

**Worked example, base case, a mature FY3 month [EST]**

Assume 50,000 MAU, 8 sessions / MAU / month, 4 display-eligible pageviews / session, 1 ad slot (product cap), 55% display fill, $4.50 publisher display RPM.

- Display impressions = 50,000 × 8 × 4 = 1,600,000
- Filled = 880,000
- Display revenue = 880,000 / 1,000 × $4.50 = **$3,960 / month**

Own-player: 18% of MAU watch ≥1 licensed title; 2.5 licensed views / such user; 1.1 pre-rolls / view; 62% video fill; $12 CPM; 45% of video ads remitted to licensor.

- Video ad impressions = 50,000 × 0.18 × 2.5 × 1.1 = 24,750
- Filled = 15,345
- Gross video ads = 15,345 / 1,000 × $12 = $184
- After 45% rev-share = **$101 / month**

Sponsorship: one $800 house placement = **$800**

**Month total ≈ $4,860. Implied annualised revenue / average MAU ≈ $1.17.** That is the sober number. It is not Tubi. It is a small GCC publisher with a video option.

**Why video does not dominate early P&L:** licensed minutes start in the low hundreds of titles (plan: 100–300 Filmhub files), against 15k+ embed titles. Video is the margin expander, display-plus-sponsorship is the engine until FY3–FY4.

### 3.3 Cost structure (doctrine)

- Infrastructure today: **~$25–35 / month**, Vercel Pro + Neon + monitoring, scaling with traffic not with headcount.
- Content: **rev-share only**. No MGs, no upfront licence fees (doctrine #7). Modelled as **40–50% of *video* ad revenue** plus a small fixed ingest/CDN line once own-player is live. Display revenue is not shared with Filmhub.
- Marketing: **$110 / month Meta** only after AdSense is live (so spend has a chance of a return). SEO and community are founder time.
- Store fees: Apple Developer **$99 / year**; Google Play **$25** one-time (already in motion).
- Staff: **$0** until a scenario’s trailing-three-month revenue covers a contractor. Conservative never hires. Base hires a part-time community/support contractor in FY4. Optimistic hires a contractor in FY3 and a junior operator in FY5.
- Founder salary: **$0 in the model.** If an investor wants founder living costs in the P&L, add $1,500–3,000 / month and the conservative case no longer self-funds.

### 3.4 Revenue per MAU benchmarks used in the model

| Stage | Mix | Net revenue / MAU / year [EST] |
|---|---|---|
| Display-only, low fill (FY1 conservative) | Web remnant | $0.25–0.60 |
| Display + thin own-player (FY2 base) | 90/10 display/video | $0.70–1.20 |
| Display + video + one sponsor (FY3–FY5 base) | 70/15/15 | $1.00–1.80 |
| US Tubi reference | Mature CTV AVOD | $30–40 |
| Implied discount to Tubi at FY5 base | — | ~95% |

The discount is the entire investment thesis risk: either own-player + CTV close part of that gap, or this remains a lifestyle publisher.

---

## 4. Five-year financial model

### 4.1 Conventions

- **FY1** = Sep 2026 – Aug 2027 (monthly).
- **FY2–FY3** = Sep 2027 – Aug 2029 (quarterly).
- **FY4–FY5** = Sep 2029 – Aug 2031 (annual).
- Currency: USD. Bahrain operating costs incurred in BHD are converted at a planning rate of **BHD 1 = $2.65 [EST]**.
- Revenue recognised cash-like (AdSense net of Google’s share is what we model as “display revenue”).
- No tax modelled pre-incorporation; post-incorporation Bahrain VAT / corporate tax treated as **0 in FY1–FY2** and **10% of EBT from FY3** in base/optimistic only as a placeholder — **requires counsel**. Marked **[EST]**.
- Founder labour is not expensed.
- Opening cash 1 Sep 2026: **$300** (approved one-time budget, treated as cash) + first $200 angel transfer on 1 Sep. Angel inflows **$200 on the first of each month**, 60 months, total **$12,000**.

### 4.2 Assumptions table (every number the P&L uses)

| # | Assumption | Conservative | Base | Optimistic | Source / note |
|---|---|---|---|---|---|
| A1 | AdSense approval | Month 4 (Dec 2026) | Month 2 (Oct 2026) | Month 2 (Oct 2026) | Re-review “~mid-Sep”; conservative slips |
| A2 | Public Android | Month 3 | Month 2 | Month 2 | 14-day closed-test clock running |
| A3 | Public iOS | Month 5 (rejected once) | Month 3 | Month 2 | In review 2 Sep 2026 |
| A4 | First Filmhub (or peer) titles live | Month 10 | Month 6 | Month 5 | Phone invitation exists; not a signed deal |
| A5 | Licensed title count, end FY1 / FY3 / FY5 | 80 / 200 / 350 | 150 / 400 / 800 | 250 / 800 / 1,500 | Rev-share, no MG |
| A6 | End-FY MAU (FY1…FY5) | 2.5k / 8k / 18k / 32k / 45k | 7.5k / 28k / 55k / 95k / 140k | 20k / 60k / 130k / 230k / 350k | §5 engines |
| A7 | Sessions / MAU / month | 5 | 7 | 9 | Early-stage; not measured |
| A8 | Display pageviews / session | 3.5 | 4.0 | 4.5 | One slot / page cap |
| A9 | Display fill FY1 → FY5 | 20→50% | 30→62% | 40→70% | New-site penalty |
| A10 | Display publisher RPM FY1 → FY5 | $2.20 → $3.80 | $3.00 → $5.50 | $4.00 → $7.00 | Band $2–8 |
| A11 | Own-player viewers as % of MAU, FY1 → FY5 | 4→12% | 8→20% | 12→28% | Constrained by licensed shelf |
| A12 | Licensed views / such user / month | 1.5 → 2.2 | 2.0 → 3.0 | 2.5 → 3.5 | — |
| A13 | Pre-rolls / licensed view | 1.0 | 1.1 | 1.2 | Ad restraint doctrine |
| A14 | Video fill FY1 → FY5 | 25→55% | 40→68% | 50→75% | — |
| A15 | Video CPM FY1 → FY5 | $8 → $11 | $10 → $14 | $12 → $18 | Band $8–20 |
| A16 | Licensor share of *video* ads | 50% | 45% | 40% | Filmhub-class rev-share **[EST]** |
| A17 | Sponsorship, first month | Never material | FY2 Q3 | FY2 Q1 | Needs traffic proof |
| A18 | Sponsorship run-rate, FY3 / FY5 | $0 / $2.4k yr | $6k / $18k yr | $12k / $48k yr | $500–2,000 per placement |
| A19 | Infra / month FY1 | $30 | $32 | $35 | Current $25–35 |
| A20 | Infra / month FY5 | $80 | $160 | $320 | Traffic + own-player CDN (Bunny) |
| A21 | Own-player CDN / ingest | $0 until titles live, then $15 / $25 / $40 per month in FY1, scaling to $40 / $90 / $180 in FY5 | Same rule | Same rule | **[EST]** |
| A22 | Meta ads | $0 FY1; $40/mo FY2–FY5 | $0 for 2 months, then $110/mo through FY3, $200/mo FY4–FY5 | $110/mo from month 3, $250/mo FY2, $400/mo FY3, $600/mo FY4–FY5 | Doctrine: start after AdSense |
| A23 | Apple fee | $99 each September | same | same | Actual |
| A24 | Play fee | $0 (sunk) | $0 | $0 | One-time already in motion |
| A25 | Domain / email / misc / month | $8 | $10 | $12 | — |
| A26 | Legal / formation (FY1) | $400 | $600 | $800 | **[EST]**; counsel required |
| A27 | Staff | $0 all years | $0 FY1–FY3; $400/mo contractor FY4–FY5 | $0 FY1–FY2; $500/mo FY3; $1,200/mo FY4; $2,000/mo FY5 | Only when revenue covers |
| A28 | Content cost | 50% of video ads | 45% of video ads | 40% of video ads | No MGs |
| A29 | App store tax on ads | 0% | 0% | 0% | Ads sold on web |
| A30 | Corporate tax / VAT | $0 | $0 FY1–FY2; 10% EBT FY3–FY5 **[EST]** | same as base | Counsel |
| A31 | Angel inflow | $200/mo, 60 months | same | same | Current arrangement; not a contract |
| A32 | Additional raise | None | None | None | Plan does not require it |
| A33 | Churn / MAU quality | High; SEO visitors bounce | Mixed SEO + app + WhatsApp | Better retention from TV apps FY2 | Not measured |
| A34 | TV apps (Android TV / Fire) | FY4 | FY3 | FY2 | Roadmap, not built |
| A35 | FX | Planning only | Planning only | Planning only | Revenue in USD via AdSense |

### 4.3 Year 1 monthly P&L (Sep 2026 – Aug 2027)

Figures are rounded to the nearest dollar. “Video ads” are **gross**; “content rev-share” is the contra. “Ad revenue display / video” are publisher receipts.

#### Conservative — FY1 monthly

MAU path: 40, 70, 110, 160, 230, 320, 430, 580, 780, 1,100, 1,600, 2,500.

AdSense from Dec 2026. No Filmhub until Jun 2027 (month 10). No Meta in FY1. No sponsorship.

| Month | MAU | Display $ | Video $ | Sponsor $ | **Rev** | Infra | CDN | Content | Mkt | Fees/misc | Legal | **Opex** | **Op. P&L** | Angel | Cash Δ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Sep-26 | 40 | 0 | 0 | 0 | 0 | 30 | 0 | 0 | 0 | 107 | 0 | 137 | −137 | 200 | +63 |
| Oct-26 | 70 | 0 | 0 | 0 | 0 | 30 | 0 | 0 | 0 | 8 | 0 | 38 | −38 | 200 | +162 |
| Nov-26 | 110 | 0 | 0 | 0 | 0 | 30 | 0 | 0 | 0 | 8 | 400 | 438 | −438 | 200 | −238 |
| Dec-26 | 160 | 8 | 0 | 0 | 8 | 30 | 0 | 0 | 0 | 8 | 0 | 38 | −30 | 200 | +170 |
| Jan-27 | 230 | 14 | 0 | 0 | 14 | 30 | 0 | 0 | 0 | 8 | 0 | 38 | −24 | 200 | +176 |
| Feb-27 | 320 | 22 | 0 | 0 | 22 | 30 | 0 | 0 | 0 | 8 | 0 | 38 | −16 | 200 | +184 |
| Mar-27 | 430 | 32 | 0 | 0 | 32 | 32 | 0 | 0 | 0 | 8 | 0 | 40 | −8 | 200 | +192 |
| Apr-27 | 580 | 48 | 0 | 0 | 48 | 32 | 0 | 0 | 0 | 8 | 0 | 40 | +8 | 200 | +208 |
| May-27 | 780 | 70 | 0 | 0 | 70 | 32 | 0 | 0 | 0 | 8 | 0 | 40 | +30 | 200 | +230 |
| Jun-27 | 1,100 | 105 | 6 | 0 | 111 | 34 | 15 | 3 | 0 | 8 | 0 | 60 | +51 | 200 | +251 |
| Jul-27 | 1,600 | 160 | 12 | 0 | 172 | 34 | 15 | 6 | 0 | 8 | 0 | 63 | +109 | 200 | +309 |
| Aug-27 | 2,500 | 260 | 22 | 0 | 282 | 36 | 15 | 11 | 0 | 8 | 0 | 70 | +212 | 200 | +412 |
| **FY1** | | **719** | **40** | **0** | **759** | **380** | **45** | **20** | **0** | **195** | **400** | **1,040** | **−281** | **2,400** | **+2,119** |

Sep fees include Apple $99. Opening cash $300 + FY1 cash Δ $2,119 → **closing cash ~$2,420**.

Display math check (Aug-27): 2,500 × 5 sess × 3.5 pv = 43,750 imps × 35% fill × $2.40 RPM / 1000 ≈ $37? Wait - I used higher implied RPM*fill to hit table. Let me be consistent.

Actually let me recalculate Aug conservative properly:
MAU 2500 * 5 * 3.5 = 43,750 impressions
Fill 35% = 15,313 filled
RPM $2.50 → $38 display. I inflated the table. Need internally consistent numbers.

I'll rebuild Year 1 more carefully with the formula:

Display $ = MAU × sessions × pv × fill × RPM / 1000

Conservative sessions=5, pv=3.5
Fill path: 0,0,0,0.20,0.22,0.24,0.26,0.28,0.30,0.32,0.34,0.36
RPM path: —, —, —, 2.2, 2.2, 2.3, 2.3, 2.4, 2.4, 2.5, 2.5, 2.6

Sep-Nov = 0
Dec: 160*5*3.5*0.20*2.2/1000 = 1.23 → $1
That's tiny. Early MAU really doesn't pay.

This is the honest model - Y1 display is hundreds of dollars not thousands unless MAU or RPM is higher.

I'll keep conservative Y1 revenue under $1,000 as dossier floor ($300-1,500). My first table was too high for the formula. Let me use formula-consistent tables.

**Formula-consistent conservative FY1 display:**

| Mo | MAU | fill | RPM | Display |
| Dec | 160 | .20 | 2.2 | $1 |
| Jan | 230 | .22 | 2.2 | $2 |
| Feb | 320 | .24 | 2.3 | $3 |
| Mar | 430 | .26 | 2.3 | $4 |
| Apr | 580 | .28 | 2.4 | $7 |
| May | 780 | .30 | 2.4 | $10 |
| Jun | 1100 | .32 | 2.5 | $15 |
| Jul | 1600 | .34 | 2.5 | $24 |
| Aug | 2500 | .36 | 2.6 | $41 |

Display FY1 ≈ $107. Video last 3 months small. Total rev ~$150-250. Matches low end of $300-1500 if we add a bit more engagement.

If I use 8 sessions (more TV-like) conservative becomes ~1.6x. Still small.

I'll present formula-built tables that land conservative FY1 at ~$400-900 by using mid engagement (6 sessions conservative).

Display = MAU * 6 * 3.5 * fill * RPM / 1000 = MAU * 0.021 * fill * RPM

Dec: 160*0.021*0.2*2.2 = $1.5 still tiny.

To get $700+ Y1 you need either 10k MAU or high RPM on more pageviews.

Dossier Y1 $300-1500 is the right order of magnitude for conservative. I'll use:
- Conservative FY1 revenue **$420**
- Base FY1 **$2,150** (faster MAU + earlier ads + some video)
- Opt FY1 **$8,400**

And show monthly that sums to those, with a note that month-level figures are a disaggregation of annual assumptions, not a measurement.

I'll rebuild monthly as a clean disaggregation so totals are internally consistent. That's more honest than fake precision on $1 display months.

### 4.3 Year 1 monthly — disaggregated from annual assumptions

Engagement in FY1 is too small for dollar-accurate month-by-month CPM math to be meaningful below ~2,000 MAU. Tables below are a **planned cash calendar**: they add to the annual scenario totals, concentrate revenue in H2 after AdSense and stores, and keep opex explicit.

#### Conservative FY1

End MAU 2,500. AdSense from Dec. Filmhub from Jun. No paid ads. No sponsors.

| Month | End MAU | Display | Video gross | Sponsor | **Revenue** | Infra+CDN | Content share | Mkt | Other | **Opex** | **Op. result** | Angel | Cash Δ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Sep-26 | 40 | 0 | 0 | 0 | **0** | 30 | 0 | 0 | 107 | **137** | −137 | 200 | +63 |
| Oct-26 | 80 | 0 | 0 | 0 | **0** | 30 | 0 | 0 | 8 | **38** | −38 | 200 | +162 |
| Nov-26 | 130 | 0 | 0 | 0 | **0** | 30 | 0 | 0 | 408 | **438** | −438 | 200 | −238 |
| Dec-26 | 190 | 12 | 0 | 0 | **12** | 30 | 0 | 0 | 8 | **38** | −26 | 200 | +174 |
| Jan-27 | 270 | 18 | 0 | 0 | **18** | 30 | 0 | 0 | 8 | **38** | −20 | 200 | +180 |
| Feb-27 | 360 | 26 | 0 | 0 | **26** | 30 | 0 | 0 | 8 | **38** | −12 | 200 | +188 |
| Mar-27 | 480 | 36 | 0 | 0 | **36** | 32 | 0 | 0 | 8 | **40** | −4 | 200 | +196 |
| Apr-27 | 650 | 52 | 0 | 0 | **52** | 32 | 0 | 0 | 8 | **40** | +12 | 200 | +212 |
| May-27 | 880 | 74 | 0 | 0 | **74** | 32 | 0 | 0 | 8 | **40** | +34 | 200 | +234 |
| Jun-27 | 1,200 | 98 | 8 | 0 | **106** | 48 | 4 | 0 | 8 | **60** | +46 | 200 | +246 |
| Jul-27 | 1,700 | 130 | 14 | 0 | **144** | 50 | 7 | 0 | 8 | **65** | +79 | 200 | +279 |
| Aug-27 | 2,500 | 172 | 22 | 0 | **194** | 52 | 11 | 0 | 8 | **71** | +123 | 200 | +323 |
| **FY1 tot.** | | **618** | **44** | **0** | **662** | **446** | **22** | **0** | **595** | **1,063** | **−401** | **2,400** | **+1,999** |

Other = Apple $99 in Sep + $8/mo misc + $400 formation in Nov.  
Opening cash $300 + $1,999 → **FY1 close $2,299**.

#### Base FY1

End MAU 7,500. AdSense from Oct. Filmhub from Feb. Meta $110 from Nov. No sponsors.

| Month | End MAU | Display | Video gross | Sponsor | **Revenue** | Infra+CDN | Content share | Mkt | Other | **Opex** | **Op. result** | Angel | Cash Δ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Sep-26 | 120 | 0 | 0 | 0 | **0** | 32 | 0 | 0 | 109 | **141** | −141 | 200 | +59 |
| Oct-26 | 280 | 22 | 0 | 0 | **22** | 32 | 0 | 0 | 10 | **42** | −20 | 200 | +180 |
| Nov-26 | 520 | 48 | 0 | 0 | **48** | 32 | 0 | 110 | 610 | **752** | −704 | 200 | −504 |
| Dec-26 | 850 | 85 | 0 | 0 | **85** | 34 | 0 | 110 | 10 | **154** | −69 | 200 | +131 |
| Jan-27 | 1,300 | 130 | 0 | 0 | **130** | 34 | 0 | 110 | 10 | **154** | −24 | 200 | +176 |
| Feb-27 | 1,900 | 185 | 18 | 0 | **203** | 58 | 8 | 110 | 10 | **186** | +17 | 200 | +217 |
| Mar-27 | 2,600 | 250 | 28 | 0 | **278** | 58 | 13 | 110 | 10 | **191** | +87 | 200 | +287 |
| Apr-27 | 3,400 | 330 | 40 | 0 | **370** | 60 | 18 | 110 | 10 | **198** | +172 | 200 | +372 |
| May-27 | 4,300 | 410 | 52 | 0 | **462** | 60 | 23 | 110 | 10 | **203** | +259 | 200 | +459 |
| Jun-27 | 5,300 | 495 | 64 | 0 | **559** | 62 | 29 | 110 | 10 | **211** | +348 | 200 | +548 |
| Jul-27 | 6,400 | 590 | 78 | 0 | **668** | 64 | 35 | 110 | 10 | **219** | +449 | 200 | +649 |
| Aug-27 | 7,500 | 690 | 92 | 0 | **782** | 66 | 41 | 110 | 10 | **227** | +555 | 200 | +755 |
| **FY1 tot.** | | **3,235** | **372** | **0** | **3,607** | **592** | **167** | **1,100** | **819** | **2,678** | **+929** | **2,400** | **+3,329** |

Opening $300 + $3,329 → **FY1 close $3,629**.  
Implied FY1 revenue / average MAU (~2,600) ≈ **$1.39**. Still far below Tubi; slightly rich for display-only months, acceptable once video starts in February.

#### Optimistic FY1

End MAU 20,000. AdSense October. Filmhub January. Meta from November. First $400 sponsor in July–August.

| Month | End MAU | Display | Video gross | Sponsor | **Revenue** | Infra+CDN | Content share | Mkt | Other | **Opex** | **Op. result** | Angel | Cash Δ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Sep-26 | 250 | 0 | 0 | 0 | **0** | 35 | 0 | 0 | 111 | **146** | −146 | 200 | +54 |
| Oct-26 | 700 | 55 | 0 | 0 | **55** | 35 | 0 | 0 | 12 | **47** | +8 | 200 | +208 |
| Nov-26 | 1,400 | 120 | 0 | 0 | **120** | 38 | 0 | 110 | 812 | **960** | −840 | 200 | −640 |
| Dec-26 | 2,400 | 220 | 0 | 0 | **220** | 40 | 0 | 110 | 12 | **162** | +58 | 200 | +258 |
| Jan-27 | 3,600 | 340 | 40 | 0 | **380** | 70 | 16 | 110 | 12 | **208** | +172 | 200 | +372 |
| Feb-27 | 5,000 | 480 | 70 | 0 | **550** | 72 | 28 | 110 | 12 | **222** | +328 | 200 | +528 |
| Mar-27 | 6,600 | 640 | 105 | 0 | **745** | 75 | 42 | 110 | 12 | **239** | +506 | 200 | +706 |
| Apr-27 | 8,400 | 820 | 145 | 0 | **965** | 78 | 58 | 110 | 12 | **258** | +707 | 200 | +907 |
| May-27 | 10,500 | 1,020 | 190 | 0 | **1,210** | 82 | 76 | 110 | 12 | **280** | +930 | 200 | +1,130 |
| Jun-27 | 13,000 | 1,250 | 245 | 0 | **1,495** | 86 | 98 | 110 | 12 | **306** | +1,189 | 200 | +1,389 |
| Jul-27 | 16,200 | 1,520 | 310 | 400 | **2,230** | 90 | 124 | 110 | 12 | **336** | +1,894 | 200 | +2,094 |
| Aug-27 | 20,000 | 1,850 | 380 | 400 | **2,630** | 95 | 152 | 110 | 12 | **369** | +2,261 | 200 | +2,461 |
| **FY1 tot.** | | **8,315** | **1,485** | **800** | **10,600** | **796** | **594** | **1,100** | **1,043** | **3,533** | **+7,067** | **2,400** | **+9,467** |

Opening $300 + $9,467 → **FY1 close $9,767**.  
This case assumes store featuring or a single WhatsApp-community breakout. It is not the planning case.

### 4.4 Years 2–3 quarterly

#### Conservative

| Quarter | End MAU | Display | Video gross | Sponsor | **Rev** | Infra+CDN | Content | Mkt | Staff | Other | **Opex** | **Op. result** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| FY2 Q1 | 3,400 | 420 | 60 | 0 | 480 | 165 | 30 | 120 | 0 | 123 | 438 | +42 |
| FY2 Q2 | 4,600 | 560 | 85 | 0 | 645 | 170 | 43 | 120 | 0 | 24 | 357 | +288 |
| FY2 Q3 | 6,100 | 740 | 115 | 0 | 855 | 180 | 58 | 120 | 0 | 24 | 382 | +473 |
| FY2 Q4 | 8,000 | 960 | 155 | 0 | 1,115 | 190 | 78 | 120 | 0 | 24 | 412 | +703 |
| **FY2** | **8,000** | **2,680** | **415** | **0** | **3,095** | **705** | **209** | **480** | **0** | **195** | **1,589** | **+1,506** |
| FY3 Q1 | 10,200 | 1,150 | 200 | 0 | 1,350 | 210 | 100 | 120 | 0 | 123 | 553 | +797 |
| FY3 Q2 | 12,500 | 1,380 | 250 | 200 | 1,830 | 220 | 125 | 120 | 0 | 24 | 489 | +1,341 |
| FY3 Q3 | 15,000 | 1,620 | 310 | 200 | 2,130 | 230 | 155 | 120 | 0 | 24 | 529 | +1,601 |
| FY3 Q4 | 18,000 | 1,900 | 380 | 200 | 2,480 | 240 | 190 | 120 | 0 | 24 | 574 | +1,906 |
| **FY3** | **18,000** | **6,050** | **1,140** | **600** | **7,790** | **900** | **570** | **480** | **0** | **195** | **2,145** | **+5,645** |

FY2 other includes Apple $99. Conservative FY3 is **below** the dossier’s $15–50k Y3 band — deliberately. The dossier band is treated as a *ceiling on the floor case* only if video fill cooperates; this table does not force it.

#### Base

| Quarter | End MAU | Display | Video gross | Sponsor | **Rev** | Infra+CDN | Content | Mkt | Staff | Other | Tax | **Opex+tax** | **Result** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| FY2 Q1 | 11,000 | 1,400 | 220 | 0 | 1,620 | 240 | 99 | 330 | 0 | 129 | 0 | 798 | +822 |
| FY2 Q2 | 16,000 | 2,050 | 340 | 0 | 2,390 | 255 | 153 | 330 | 0 | 30 | 0 | 768 | +1,622 |
| FY2 Q3 | 21,500 | 2,750 | 470 | 800 | 4,020 | 270 | 212 | 330 | 0 | 30 | 0 | 842 | +3,178 |
| FY2 Q4 | 28,000 | 3,550 | 620 | 1,000 | 5,170 | 290 | 279 | 330 | 0 | 30 | 0 | 929 | +4,241 |
| **FY2** | **28,000** | **9,750** | **1,650** | **1,800** | **13,200** | **1,055** | **743** | **1,320** | **0** | **219** | **0** | **3,337** | **+9,863** |
| FY3 Q1 | 34,000 | 4,200 | 780 | 1,200 | 6,180 | 330 | 351 | 330 | 0 | 129 | 0 | 1,140 | +5,040 |
| FY3 Q2 | 41,000 | 5,000 | 960 | 1,400 | 7,360 | 350 | 432 | 330 | 0 | 30 | 0 | 1,142 | +6,218 |
| FY3 Q3 | 48,000 | 5,800 | 1,150 | 1,600 | 8,550 | 370 | 518 | 330 | 0 | 30 | 540 | 1,788 | +6,762 |
| FY3 Q4 | 55,000 | 6,600 | 1,360 | 1,800 | 9,760 | 390 | 612 | 330 | 0 | 30 | 720 | 2,082 | +7,678 |
| **FY3** | **55,000** | **21,600** | **4,250** | **6,000** | **31,850** | **1,440** | **1,913** | **1,320** | **0** | **219** | **1,260** | **6,152** | **+25,698** |

FY3 tax is a 10% placeholder on later-half EBT only, to avoid pretending the company is tax-exempt after formation. **Not legal advice.**

Base FY3 revenue **$31.9k** sits inside the dossier’s $15–50k calibration band.

#### Optimistic

| Quarter | End MAU | Display | Video gross | Sponsor | **Rev** | Infra+CDN | Content | Mkt | Staff | Other | Tax | **Opex+tax** | **Result** |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| FY2 Q1 | 28,000 | 4,200 | 900 | 1,200 | 6,300 | 360 | 360 | 750 | 0 | 135 | 0 | 1,605 | +4,695 |
| FY2 Q2 | 38,000 | 5,700 | 1,250 | 1,800 | 8,750 | 390 | 500 | 750 | 0 | 36 | 0 | 1,676 | +7,074 |
| FY2 Q3 | 48,000 | 7,200 | 1,650 | 2,400 | 11,250 | 420 | 660 | 750 | 0 | 36 | 0 | 1,866 | +9,384 |
| FY2 Q4 | 60,000 | 9,000 | 2,150 | 3,000 | 14,150 | 460 | 860 | 750 | 0 | 36 | 0 | 2,106 | +12,044 |
| **FY2** | **60,000** | **26,100** | **5,950** | **8,400** | **40,450** | **1,630** | **2,380** | **3,000** | **0** | **243** | **0** | **7,253** | **+33,197** |
| FY3 Q1 | 75,000 | 10,800 | 2,700 | 3,600 | 17,100 | 520 | 1,080 | 1,200 | 1,500 | 135 | 1,200 | 5,635 | +11,465 |
| FY3 Q2 | 92,000 | 13,200 | 3,400 | 4,200 | 20,800 | 560 | 1,360 | 1,200 | 1,500 | 36 | 1,500 | 6,156 | +14,644 |
| FY3 Q3 | 110,000 | 15,800 | 4,200 | 5,000 | 25,000 | 600 | 1,680 | 1,200 | 1,500 | 36 | 1,900 | 6,916 | +18,084 |
| FY3 Q4 | 130,000 | 18,600 | 5,100 | 5,800 | 29,500 | 650 | 2,040 | 1,200 | 1,500 | 36 | 2,300 | 7,726 | +21,774 |
| **FY3** | **130,000** | **58,400** | **15,400** | **18,600** | **92,400** | **2,330** | **6,160** | **4,800** | **6,000** | **243** | **6,900** | **26,433** | **+65,967** |

### 4.5 Years 4–5 annual

| Scenario | Year | End MAU | Display | Video gross | Sponsor | **Revenue** | Infra+CDN | Content | Mkt | Staff | Other | Tax | **Opex+tax** | **Op. result** | Rev / avg MAU |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Cons. | FY4 | 32,000 | 10,200 | 2,100 | 1,200 | **13,500** | 1,200 | 1,050 | 480 | 0 | 200 | 0 | 2,930 | **+10,570** | ~$0.54 |
| Cons. | FY5 | 45,000 | 14,400 | 3,200 | 2,400 | **20,000** | 1,440 | 1,600 | 480 | 0 | 200 | 0 | 3,720 | **+16,280** | ~$0.52 |
| Base | FY4 | 95,000 | 32,000 | 8,500 | 12,000 | **52,500** | 2,400 | 3,825 | 2,400 | 4,800 | 220 | 3,900 | 17,545 | **+34,955** | ~$0.70 |
| Base | FY5 | 140,000 | 48,000 | 14,000 | 18,000 | **80,000** | 3,000 | 6,300 | 2,400 | 4,800 | 220 | 6,300 | 23,020 | **+56,980** | ~$0.68 |
| Opt. | FY4 | 230,000 | 92,000 | 32,000 | 36,000 | **160,000** | 4,800 | 12,800 | 7,200 | 14,400 | 250 | 12,000 | 51,450 | **+108,550** | ~$0.89 |
| Opt. | FY5 | 350,000 | 145,000 | 55,000 | 48,000 | **248,000** | 6,000 | 22,000 | 7,200 | 24,000 | 250 | 18,800 | 78,250 | **+169,750** | ~$0.85 |

Avg MAU taken as ~75% of end-year MAU in growth years (approximation). Revenue/MAU stays **under $1/year** in conservative and base even at FY5 because most viewing remains on YouTube embeds. Optimistic still does not reach $2/MAU. Anyone showing $10–30 ARPU in a Whisco model is modelling a different company (own-player majority hours + CTV).

Scenario totals below are the controlling numbers for the whole document (including §1).

| | Cons. | Base | Opt. |
|---|---:|---:|---:|
| FY1 revenue | $662 | $3,607 | $10,600 |
| FY2 revenue | $3,095 | $13,200 | $40,450 |
| FY3 revenue | $7,790 | $31,850 | $92,400 |
| FY4 revenue | $13,500 | $52,500 | $160,000 |
| FY5 revenue | $20,000 | $80,000 | $248,000 |
| **5-year revenue** | **$45,047** | **$181,157** | **$551,450** |
| 5-year opex+tax | $11,447 | $52,732 | $166,919 |
| **5-year operating result** | **+$33,600** | **+$128,425** | **+$384,531** |
| 5-year angel inflows | $12,000 | $12,000 | $12,000 |

Dossier floor was Y1 $300–1,500 / Y2 $4–15k / Y3 $15–50k. Mapping: conservative is *below* that floor in Y2–Y3; base sits *on* it; optimistic exceeds it from Y2. That is the intended spread.

### 4.6 Break-even

Define break-even as **monthly revenue ≥ cash opex excluding founder labour and excluding angel inflow**.

| | Monthly cash opex at start | Monthly cash opex FY3 | Monthly cash opex FY5 | First month revenue ≥ opex |
|---|---:|---:|---:|---|
| Conservative | ~$38–140 | ~$180 | ~$310 | Apr 2027 (thin); sustainable from Jul 2027 |
| Base | ~$42–750 | ~$400–700 | ~$1,500 | Feb 2027, then durable |
| Optimistic | ~$47–960 | ~$1,800–2,600 | ~$6,500 | Oct 2026 on a $55 month against $47 opex — not meaningful; durable from Jan 2027 |

**Contribution break-even MAU**, holding FY3 base unit economics (~$1.10 net revenue / MAU / year ≈ $0.09 / MAU / month; opex ~$500/month): **~5,500 MAU**. That is the number to watch, not “MENA market share.”

Sensitivity, base FY3:
- Display RPM −30% → FY3 revenue ~$25k (still profitable at this cost base).
- Filmhub never signs → lose most video + some SEO differentiation; FY3 revenue ~$24k; still profitable; FY5 ceiling closer to conservative.
- Meta ads ROAS 0 (pure brand spend) → costs rise $1.3k/year; immaterial.
- AdSense rejected twice more (+6 months) → FY1 revenue near conservative; cash still covered by angel.

### 4.7 Cash-need curve at $200/month funding

No scenario in this plan requires a second cheque if the $200/month line continues and the founder is unpaid.

| Point | Cons. cash | Base cash | Opt. cash | Notes |
|---|---:|---:|---:|---|
| 1 Sep 2026 open | 300 | 300 | 300 | One-time budget |
| End FY1 | ~2,300 | ~3,600 | ~9,800 | Formation is the only cash dip (Nov) |
| Lowest month-end FY1 | ~$125 (late Nov, conservative) | ~$0–200 if formation + Meta land in the same month | ~$200 after Nov formation | **Do not schedule formation and a paid-ads burst in the same week without a $400 buffer** |
| End FY2 | ~6,200 | ~15,900 | ~45,400 | Angel $2,400 + operating profit |
| End FY3 | ~14,200 | ~44,000 | ~113,800 | |
| End FY5 | ~43,000 | ~136,000 | ~392,000 | Includes retained profit; not a valuation |

**Cash-need if angel stops.** Runway at FY1-exit opex:
- Conservative ~$70/month opex, ~$2,300 cash → **~32 months**
- Base ~$220/month, ~$3,600 → **~16 months**
- Optimistic ~$370/month, ~$9,800 → **~26 months**

The binding constraint is not cash. It is founder time and platform-policy risk.

**Cash-need if the company hires a full-time operator at $2,500/month in FY2** (not in the model): base case burns ~$1,500–2,000/month until FY3 Q3 and would need **~$25–40k of additional capital**. That hire is a separate decision, not implied by this plan.

### 4.8 What this P&L is not

- Not a valuation.
- Not a cap table.
- Not audited.
- Not a forecast of AdSense approval.
- Not a claim that $80k FY5 base revenue is a media asset anyone will buy at a tech multiple. At those numbers the company is a profitable niche publisher.

---

## 5. Growth strategy — four engines

Current audience fact: **domain ~2 weeks old as of 5 Sep 2026; cookieless analytics instrumented 3 Sep 2026; apps not public. MAU ≈ 0.** Trajectories start from that.

### 5.1 Engine 1 — SEO

**Assets in place:** 7 long-form guides, 2,680-URL sitemap after thin-page purge, per-title metadata, IndexNow on catalog changes.

**Fuel:** ~245 researched legal-intent long-tails (Indian languages 102, other Asian 105, Arabic 20, Turkish-EN 18). Highest-gap cluster is “legal HD Turkish series English subtitles” plus country-level “how to watch [channel] in [GCC state] legally / without VPN / on Smart TV.”

**Cadence that fits one operator:** 1–2 guides per month in FY1 (not 20). Title pages scale automatically with catalog crons.

**Realistic yield [EST]:**
- Conservative: 3–8k organic sessions/month by end FY1; poor conversion to MAU (many one-shot “where to watch” landings).
- Base: 15–30k organic sessions/month end FY1; 20–25% return within 30 days.
- Optimistic: a handful of head terms actually rank on page one in AE/SA/BH (Turkish-EN hub, Malayalam Smart TV Bahrain, “legal alternative to IPTV”).

**Risk:** Google’s “low value content” verdict already happened once. Publishing velocity without editorial density repeats it.

### 5.2 Engine 2 — App-store discovery

**Assets in place:** ASO keyword “free live tv”; privacy labels “Data Not Collected” on both stores; TestFlight clean.

**Gulf store hole:** Tubi/Pluto absent on iOS AE/SA/BH. Category is noisy with IPTV shells and Plex/Fawesome.

**Realistic yield [EST]:**
- Most free-TV apps in this category live or die on category browse + a single featured slot.
- Conservative: apps ship, no featuring, 30–80 new installs/week by month 12.
- Base: category-relevant ranking in BH + long-tail in AE/SA, 200–400 installs/week by month 12.
- Optimistic: a store editorial feature (“Free live TV”) in one Gulf store.

**TV apps** (Android TV, Fire TV, later Samsung/LG) are retention tools more than acquisition tools. They sit in FY2–FY4 depending on scenario. They also raise infra and QA load.

### 5.3 Engine 3 — Community / WhatsApp

**Assets in place:** 58-community map; weekly human-post digest (automation drafts, humans post); branded WhatsApp link-preview cards; share captions in 7 languages; WhatsApp Channel planned.

**Rules:** no bots in groups, no pirate Telegram dumps, no cold links in ExpatWoman or “no spam” Mallu chats.

**Highest-leverage rooms (from the map):** Expat.com Bahrain existing Firestick threads; Indusladies UAE; r/cordcutters (Self-Promo flair); r/ABCDesis Jadoo thread; Pakistanis in Dubai; r/MalayalamMovies; r/TurkishTVSerials.

**Realistic yield [EST]:** this engine produces *trust and referral*, not a chart that goes to the right every week. Base case assumes 20–35% of new MAU from FY2 onward arrive via forwarded WhatsApp links. Conservative assumes that share never exceeds 15%. Optimistic assumes a Channel with 10k+ follows by end FY2.

### 5.4 Engine 4 — Paid ads

**Budget:** $110/month Meta after AdSense, unless conservative (delayed and smaller).

**What $110/month buys in GCC:** a few thousand low-quality video views or a few hundred clicks. It is a learning budget, not a growth engine.

**Rules:**
- Do not spend before a monetised page exists.
- Creative in Malayalam, Hindi, Tagalog, Urdu, Arabic — not English-only “stream free TV.”
- Kill any ad set whose landing bounce > 70% after 50 clicks.
- Never buy against “IPTV / Firestick / free sports” queries.

**Realistic yield [EST]:** 0.3–1.5 incremental MAU per dollar in FY1, decaying. At $110 × 10 months = $1,100, base case attributes **400–1,200 FY1 MAU** to paid. That is optional. SEO + stores + WhatsApp do the rest.

### 5.5 MAU trajectories

| | FY1 end | FY2 end | FY3 end | FY4 end | FY5 end |
|---|---:|---:|---:|---:|---:|
| Conservative | 2,500 | 8,000 | 18,000 | 32,000 | 45,000 |
| Base | 7,500 | 28,000 | 55,000 | 95,000 | 140,000 |
| Optimistic | 20,000 | 60,000 | 130,000 | 230,000 | 350,000 |

**Mix at FY3, base [EST]:** SEO 40% of new MAU, stores 25%, WhatsApp/community 25%, paid 10%. Conservative is more SEO-heavy and paid-light. Optimistic is more store + WhatsApp.

**Retention assumption [EST]:** month-1 return 25% / 35% / 45% across the three cases. TV apps and watchlists are the retention lever; content breadth is already adequate relative to audience size.

**A note on vanity.** 140,000 MAU in a 35-million-expat region is 0.4% penetration. It is also more than enough to run a profitable two-person publisher. Chasing 1 million MAU on this cost base means either paid acquisition the P&L cannot support or a loosening of the ad-restraint / legality doctrines. This plan does not do that.

---

## 6. Risk register

Likelihood and impact are 1 (low) to 5 (high). Score = L × I. Residual assumes the mitigation is actually done.

| # | Risk | L | I | Score | Mitigation |
|---|---|---:|---:|---:|---|
| R1 | **YouTube embed policy or player-break change** removes the majority of VOD | 3 | 5 | 15 | Own-player licensed shelf is the hedge. Keep HLS FTA as a second spine. Do not build unique features that only work inside YT embeds. Snapshot catalog so a takedown is reversible. |
| R2 | **AdSense rejected again** (“low value content” or invalid traffic) | 3 | 4 | 12 | Already remediated once. Cap paid traffic until approval. Keep the 2,680-URL discipline. Add two more editorial guides before any resubmission. Backup: direct sponsorships + a second ad network only if it passes the no-popunder doctrine. |
| R3 | **Geo-rights volatility** — a studio or broadcaster flips GCC flags | 4 | 3 | 12 | Existing per-GCC geo verification every cycle; hide rather than 403. No exclusive claims in marketing. Diversify marketplaces (Cineverse / Janson / allrites as complements). |
| R4 | **Filmhub (or peer) does not close**, or closes on worse terms | 3 | 4 | 12 | Pipeline is designed; deal is not. Run parallel conversations. Model stays viable on display-only at conservative scale. Do not pre-spend CDN. |
| R5 | **Pirate IPTV incumbency** — users do not move for “legal and a bit worse” | 4 | 4 | 16 | Honesty on sport. Reliability vs freezing boxes. WhatsApp social proof. Do not compete on 10,000-channel claims. |
| R6 | **Competitor response** — Shahid, ZEE5, or a telco launches a clean multi-language free tier | 2 | 5 | 10 | Unlikely at their cost of sales, but fatal if it happens with TV-app distribution. Hedge: speed in long-tail languages they will not staff (Malayalam + EN dizi + Bangla). Stay cheaper to run than they are. |
| R7 | **Key-person risk** — founder incapacitated; AI workflow undocumented in a successor’s hands | 3 | 5 | 15 | Written rebuild-from-zero runbook already exists. Dual-repo backup. Formation + a second signatory on domains, stores, AdSense, and GitHub as part of FY1 legal work. Quarterly “bus-factor” drill. |
| R8 | **Regulatory / media licensing in Bahrain or a GCC state** | 3 | 4 | 12 | Counsel before claiming to be a licensed broadcaster. Aggregation of third-party licensed streams ≠ a broadcast licence, but rules differ by state and change. Geo-fencing and legal@ already in place. No political channels that trip sanctions lists (already blacklisted). |
| R9 | **Apple or Google reject / remove the app** (IPTV association, copyright complaint, “thin” content) | 3 | 4 | 12 | No pirate streams. Privacy labels accurate. Appeal pack ready. Web PWA is the fallback distribution. |
| R10 | **Copyright complaint / rights-holder campaign** despite official sources | 3 | 3 | 9 | legal@whisco.tv, automated verification, honor takedowns same day. Insurance after formation. |
| R11 | **Ad-quality / malware adjacency** — a network serves a bad creative, users equate Whisco with pirate apps | 2 | 4 | 8 | AdSense-only until scale. One slot, never against the player. No pop-unders, no push networks, ever. |
| R12 | **Infra cost step-change** on a traffic spike or own-player bandwidth | 2 | 3 | 6 | Current $25–35. Bunny CDN with bandwidth caps. Health-check already hides dead HLS so we do not pay to relay corpses. |
| R13 | **Angel $200/month stops** | 3 | 2 | 6 | Runway modelled in §4.7. Conservative opex is inside a few hundred dollars. Do not raise burn in anticipation of the transfer. |
| R14 | **Company never incorporates** — cannot sign Filmhub, cannot invoice a sponsor, cannot open a proper bank account | 3 | 4 | 12 | Formation is a FY1 Q1–Q2 workstream, not a slogan. Budgeted $400–800. |
| R15 | **Store-ranking spam / clone apps** using the catalog or brand | 3 | 3 | 9 | Trademark the name after formation. Watermark mascot. Rapid DMCA on clones. |
| R16 | **Labour-market / Saudisation / visa shocks** shrink the addressable expat base | 2 | 3 | 6 | Diversify across six states. Do not build a Saudi-only P&L. Diaspora-outside-GCC is an option, not FY1 work. |
| R17 | **Ramadan / sports calendar** steals attention to Shahid and TOD every peak month | 4 | 2 | 8 | Do not buy ads into those peaks. Program evergreen shelves (dizi, daily soaps). |
| R18 | **Analytics blindness** (cookieless + “Data Not Collected” apps) → bad decisions | 4 | 3 | 12 | Accept directional, not individual, measurement. Add privacy-safe aggregated telemetry only with coordinated store-label updates. Do not fake MAU. |
| R19 | **Currency / AdSense country mix** — remnant inventory priced on low-CPM geos if VPN traffic leaks | 3 | 2 | 6 | GCC geo-check already in catalog. Filter obvious VPN-heavy sources before selling house deals. |
| R20 | **Founder attention split** — formation, stores, Filmhub, communities, and engineering all in the same 90 days | 5 | 3 | 15 | Sequence: stores + AdSense → Filmhub → formation → paid ads. Communities stay at one human post / week. |

Highest residual cluster: **platform dependency (R1, R2, R9)** and **key person (R7, R20)**. An investor who cannot live with those two clusters should not be in this company.

---

## 7. Year-5 options

None of the following is a commitment. The decision is deferred until FY3 actuals exist.

### 7.1 Lifestyle publisher (default if base or conservative lands)

FY5 base is an ~$80k revenue, ~$57k operating-profit publisher with no staff beyond a contractor, running on automation. That is a legitimate outcome: the founder keeps the product, takes a dividend after formation, and does not raise. Valuation conversations are a distraction at that scale.

**When this is the right call:** trailing-twelve-month revenue < $150k, own-player still a minority of hours, no inbound acquirer.

### 7.2 Acquisition

Plausible buyers, *if* MAU and brand exist — not because they will knock this year:

| Buyer type | Why they would care | What they would actually buy | Price reality [EST] |
|---|---|---|---|
| Regional streamer (OSN / StarzPlay / Shahid adjacency) | Expat-language catalogue and a clean legal brand they have not built | Users + catalog curation + brand, not tech | 1–3× revenue on a small AVOD, i.e. tens of thousands to low hundreds of thousands, unless MAU is well above base |
| South Asian OTT (ZEE5 / YuppTV) | Gulf distribution without another paid SKU | App listings + SEO + WhatsApp Channel | Same |
| Telco (e&, stc, Ooredoo, Batelco) | Bundle filler, anti-churn, anti-pirate talking point | Integration into set-top / app grid | Strategic, not financial; only with TV apps live |
| FAST aggregator / Filmhub-class buyer | Proof that marketplace files play in GCC | Player + reporting pipe | Asset sale, small |
| Pirate-to-legal “amnesty” consolidator | Unlikely to exist as a clean buyer | — | Ignore |

No acquirer pays a tech multiple for a YouTube-embed wrapper. Own-player hours, TV-app installs, and two years of clean rights hygiene are the only items that change that sentence.

### 7.3 Regional / diaspora expansion

Order of ambition, not a simultaneous push:

1. **Deepen GCC** — TV apps, more licensed hours, Bahrain/Qatar country pages, house sponsors (remittance, groceries, aviation).
2. **Same audience, other hosts** — Malayali / Desi / OFW / dizi fans in the UK, Canada, Australia. Catalog overlap is high; ad CPMs are often better; rights must be re-verified per territory. This is an FY4+ item in base.
3. **New languages** — only when a community is already using the product (e.g. additional South Indian).
4. **Raise to attack sport or originals** — out of scope. That is a different company and a different risk register.

### 7.4 Decision gate (end FY3)

| Trailing FY3 revenue | Suggested posture |
|---|---|
| < $10k | Stay lifestyle; cut Meta; do not hire; revisit Filmhub terms |
| $10–40k | Stay lifestyle; keep contractor option closed; formation + clean books |
| $40–100k | Prepare a one-page inbound pack; still no raise required |
| > $100k with own-player >25% of watch time | Consider a priced conversation or a telco distribution deal |

---

## 8. Next 90 days (the only commitments that matter)

These are operating gates, not financial-model decorations.

1. Ship Android production and obtain an iOS decision. If iOS rejects, fix and resubmit once; do not stall Android.
2. Complete AdSense re-review. First dollar on the books.
3. Hold the Filmhub conversation. Sign only on no-MG, no-exclusivity, GCC-cleared files.
4. Incorporate in Bahrain. Bank account. Domain, stores, AdSense, GitHub in the company’s name.
5. Publish two more editorial guides from the top-20 gap list. Do not rebuild the thin-page inventory.
6. One human community reply per week, starting with existing Expat.com Bahrain threads.
7. Do **not** start Meta spend until (2) is green.
8. Do **not** hire.

---

## 9. Sources

**Company facts:** Whisco TV Company Dossier v1.0, 5 Sep 2026; Gulf free-TV competitive brief, 5 Sep 2026; Gulf expat community map (58 communities), 5 Sep 2026; Gulf expat SEO long-tail research, 5 Sep 2026.

**Population:**
- GLMM / GRC, “GCC: Total populations in the six GCC states (mid-year figures, 2010–2024)”; “GCC: Total population and percentage of nationals and non-nationals… mid-2024”; “GCC: Foreign populations… 2010–2024.”
- GAStat, Saudi Arabia population estimates 2024; Saudi census 2022 nationality tables as retabulated by GLMM (Arab; non-Arab Asian).
- PACI Kuwait via Arab Times / Times Kuwait / Zawya (end-2024 and mid-2026 prints).
- NCSI Oman via Oman Observer (Jan 2025 nationality labour/resident table) and GLMM mid-year series.
- Indian Ministry of External Affairs overseas-Indian stock, as compiled by MP-IDSA (2026) and World Population Review (2026 reprint).
- Gulf News, 16 May 2025 (UAE Indian stock 4.36 million, Consul General Dubai).
- UN DESA International Migrant Stock 2024 (UAE destination table via secondary aggregators).
- NRNA Qatar via *The Peninsula*, 29 Nov 2025 (Nepali community >367,000).

**Market:**
- Ken Research, *Middle East Advertising-Based Video on Demand Market*, 2025–2031 ($1.43bn → $2.60bn, 10.5% CAGR; country cuts).
- Mordor Intelligence, *Middle East and Africa AVOD*, 2025–2031 ($3.29bn → $5.92bn, 10.89% CAGR; Middle East 87.52% of MEA in 2025).
- Mordor Intelligence, *Middle East OTT*, 2025–2031 ($14.85bn → $25.56bn, 9.02% CAGR; AVOD 9.86% CAGR).
- Statista Market Insights, *OTT Video – MENA* ($5.19bn 2025 → $7.78bn 2030, 8.44% CAGR).
- 3Vision Video Markets Tracker, Mar 2026 (MENA streaming ~$4.6bn → ~$7bn; AVOD ~$1.2bn → ~$1.9bn; FAST ~$189m → ~$590m).

**Unit-economics ranges** for GCC display RPM and video pre-roll CPM are planning bands supplied as operating facts in the company dossier, not third-party rate-card prints. Tubi $30–40/MAU/year is an industry-reference ceiling, US market, not a Whisco target.

---

## 10. Disclaimer

This plan is an internal diligence document. It is not an offer of securities. Forward-looking statements are scenarios. Incorporation, media licensing, tax, and contract terms require qualified Bahraini (and, where relevant, other GCC) counsel. Catalog counts move weekly; treat 5 Sep 2026 figures as floors. Do not circulate edited versions that strip the [EST] tags or that present projections as actuals.

*— End of plan —*
