# GROK HEAVY-TRIAL WORKFORCE — PROMPT PACK v2
*~4,290 minutes of heavy-model/bot time. Strategy: aim Grok at research-heavy and drafting-heavy deliverables that need NO repo/production access. Everything returns as documents → paste back → the main agent (me) verifies, corrects against live data, and integrates. Grok drafts; we ratify.*

**Run order matters.** Tier 1 = highest business value. Each prompt is self-contained — paste one per bot/session. Give every bot the FACTS BLOCK (bottom of this file) as context.

---

## TIER 1 — BUSINESS FOUNDATION (run these first)

### PROMPT W1 — Full Business Plan + 5-Year P&L Model (the flagship task — give it the most time)

You are a senior media-industry business analyst. Using the FACTS BLOCK provided, produce a complete, investor-grade business plan for Whisco TV with a 5-year financial model (2026–2031). Required sections:

1. **Executive summary** (1 page)
2. **Market analysis**: GCC expat population by nationality and country (use real census/statistics estimates with sources); TAM/SAM/SOM for free ad-supported streaming to this audience; MENA AVOD market size and CAGR (cite Mordor/Statista-class sources); competitive landscape (Shahid, OSN+, StarzPlay, Viu, Weyyak, ZEE5/YuppTV, pirate IPTV as the true incumbent)
3. **Business model deep-dive**: AVOD unit economics — display RPM vs video pre-roll CPM in GCC ($2–8 display, $8–20 video pre-roll ranges), fill-rate assumptions by year, revenue per MAU benchmarks (Tubi ~$30-40/yr US as ceiling reference, discount for MENA)
4. **5-year P&L**: three scenarios (conservative / base / optimistic) with monthly granularity for year 1, quarterly for years 2–3, annual for 4–5. Line items: ad revenue (display + video separately), sponsorship revenue, infra costs (current: ~$25-35/mo scaling with traffic), content costs (rev-share = % of revenue, not fixed), marketing ($110/mo Meta initially), Apple/Google fees, future staff. State every assumption explicitly in an assumptions table. Include break-even analysis and cash-need curve given $200/mo investor funding.
5. **Growth strategy**: the four engines (SEO, app-store discovery, community/WhatsApp, paid ads) with realistic MAU trajectories per scenario
6. **Risk register**: 15+ risks (platform dependency on YouTube embeds, AdSense policy, geo-rights volatility, competitor response, key-person risk, regulatory) each with likelihood, impact, and mitigation
7. **Exit/expansion options** at year 5: lifestyle business vs. acquisition targets vs. regional expansion

Format: clean Markdown with tables. Where you use industry figures, name the source. Where you estimate, mark [EST]. No hype — this document must survive a skeptical investor's read.

### PROMPT W2 — Company Formation & Governance Pack (Bahrain)

You are a corporate services consultant specializing in Bahrain. Produce a practical company-formation guide + draft documents for Whisco TV:

1. **Entity comparison for this business**: Bahrain SPC (Single Person Company) vs WLL vs sole proprietorship vs staying unregistered — costs (CR fees, Sijilat process, LMRA, address requirements), liability, banking access, ability to sign international content-licensing contracts (Filmhub!), AdSense/Stripe payout implications, investor-readiness. Recommend one with reasoning. Include realistic total setup cost and annual running cost in BHD.
2. **Step-by-step Sijilat registration walkthrough** for the recommended entity, including business activity codes appropriate for streaming/media/advertising.
3. **Draft documents** (mark all as templates requiring local legal review): founder's resolution, basic articles suited to SPC, IP assignment memo (assigning the founder's platform IP to the company), investor side-letter template for the current $200/mo angel arrangement (non-equity gift vs convertible note options explained).
4. **Company profile document** (2 pages, polished): the kind sent to partners like Filmhub — company overview, mission, platform stats, leadership, contact. Write it ready-to-use.
5. **Banking + payments map**: which Bahrain banks are startup-friendly, what AdSense/app-store payouts need, currency considerations.

### PROMPT W3 — Policy & Compliance Documentation Suite

You are a media-law-literate compliance drafter. Draft the full policy suite for Whisco TV (all as templates marked "requires qualified legal review"). Use the FACTS BLOCK. Documents:

1. **Content Sourcing & Verification Policy** — formalizing what we already do: official-broadcaster/public-domain/licensed-only, automated geo/embeddability verification, sanctions-list exclusions, prohibited-content categories
2. **DMCA / Rights-holder Takedown Policy + procedure** (we already honor takedowns via legal@whisco.tv — formalize SLA, counter-notice handling)
3. **Advertising Standards Policy** (max ad density, no ads near player, no pop-unders/redirects ever, child-directed content ad rules)
4. **Privacy Policy v2** — current state: web has optional accounts + Vercel cookieless analytics; apps collect nothing. Cover GDPR-style rights, GCC PDPL (Bahrain PDPL specifically), children's privacy, future analytics/ads SDK disclosures
5. **Terms of Service v2** — free service, no warranties, territorial availability, account rules, acceptable use
6. **Data Protection & Security Policy** (internal) — secrets handling, access control, breach response aligned with Bahrain PDPL
7. **Editorial Independence & Curation Guidelines** — how featured content is chosen, no pay-for-placement without disclosure
8. **Partner Code of Conduct** — what we require from content partners/licensors

### PROMPT W4 — Investor & Partnership Data-Room Checklist + Pitch Narrative

You are a startup fundraising advisor. Produce: (1) a complete data-room checklist for a pre-seed media startup (what documents investors expect, mapped against what Whisco TV has/lacks — use FACTS BLOCK); (2) a written pitch narrative (not slides — the 2,000-word story version) covering problem (pirate IPTV + fragmented legal options for 30M expats), solution, traction, moat (curation + automation + trust), model, ask; (3) a one-page teaser suitable for emailing; (4) a partnership one-pager variant aimed at content owners (Filmhub-class) instead of investors.

---

## TIER 2 — GROWTH & MARKETING ENGINES

### PROMPT W5 — 12-Month Marketing Calendar & Campaign Playbooks

Using the FACTS BLOCK + these research findings (community map: Expat.com Bahrain, r/cordcutters, r/ABCDesis best channels; WhatsApp = trust layer; complaints: ad overload, billing surprises, buffering), build:

1. **12-month marketing calendar** (Oct 2026–Sep 2027) keyed to the Gulf cultural calendar: Ramadan (huge TV season — plan a "Ramadan free drama" push), Eid al-Fitr/Adha, Onam, Diwali, Christmas/Simbang Gabi, IPL/cricket seasons, Turkish dizi season premieres (Sept), school holidays. For each moment: campaign concept, content assets needed, target community, KPI.
2. **Meta Ads playbook** for the $110/mo budget: campaign structures, audience definitions per expat community (interests/behaviors/languages available in Meta targeting for BH/SA/AE), creative angles per audience, CPM expectations, kill/scale rules at this micro-budget.
3. **ASO playbook**: keyword matrices for Play/App Store per GCC country around "free live tv" + language terms, A/B test plan for screenshots/icon, review-response templates.
4. **WhatsApp Channel content system**: weekly cadence template, poster formats, 8 weeks of example posts using real catalog items from FACTS BLOCK.

### PROMPT W6 — SEO Content Factory: 20 Article Briefs + 5 Full Drafts

Using the TOP 20 content-gap queries from our keyword research (attached/pasted), produce: (1) full SEO briefs for all 20 (target query cluster, search intent, H1/H2 outline, entities to cover, internal links into whisco.tv catalog pages, honest-content angle — we ADMIT what needs paid apps, that's our trust signature); (2) complete 1,200–1,800-word drafts for the top 5 gaps: [1] legal HD English-sub Turkish series hub, [4] Hindi serials legally on Firestick UAE (not IPTV), [11] Telugu live TV in Dubai apartment without dish, [14] Indonesian TV in Qatar legally, [20] free legal Arabic series apps for Gulf Smart TVs. Tone: the existing Whisco guides (honest, expat-first, anti-pirate but never preachy). British-neutral English. Each draft ends with a soft CTA into the relevant whisco.tv shelf.

### PROMPT W7 — Sponsorship & Direct-Sales Kit

Research and draft: (1) a list of 30 realistic GCC sponsor prospects for an expat-audience streaming platform (remittance companies, telcos with expat SIM packs, money exchanges, Asian grocery chains, airlines with South Asia/SEA routes, education consultancies) with why-them notes; (2) a rate-card structure for a small platform (sponsored shelf, branded collection, homepage placement, newsletter/WhatsApp-channel mention) with GCC-realistic pricing tiers; (3) a media-kit template (to be filled with our analytics numbers when ready); (4) three cold-outreach email sequences (initial + 2 follow-ups) per prospect category, from partnerships@whisco.tv, honest about current audience stage but selling the audience quality + growth story.

---

## TIER 3 — OPERATIONS & FUTURE ARCHITECTURE

### PROMPT W8 — Operations Manual & Org Design (humans + AI agents)

Draft: (1) a complete Whisco TV operations manual — every recurring process (daily/weekly/monthly) as runbooks: content QA, incident response (uptime alert → triage tree), app release checklist (both stores), billing pre-check, community digest posting, backup/DR drills, partner reporting; (2) an org design for growth stages — Stage 0 (now: founder + AI agent), Stage 1 (first $1k/mo revenue), Stage 2 (first hire), Stage 3 (5 people) — with role definitions where each role explicitly states what stays automated vs. what the human owns; (3) an AI-agent workforce design: 6–8 specialized agent roles (content scout, QA monitor, community draft writer, reporting analyst, ASO optimizer, partnerships researcher), each with: mission, inputs, outputs, cadence, guardrails (what it must NEVER do autonomously — e.g., no posting, no spending, no catalog additions without verification pipeline), and escalation rules to the founder. This becomes our blueprint when multi-agent tooling matures.

### PROMPT W9 — Filmhub 150-Title Acquisition Scorecard (follow-up their briefing offered)

Building on the Filmhub/MENA briefing (attached/pasted), produce the operational acquisition kit: (1) a title-scoring rubric (0–100) weighting: GCC avails cleared, genre fit per our three bets (South Asian family drama proxy / family+faith / thriller+paranormal docs), runtime (features > shorts), production quality signals, subtitle/dub availability, cultural compliance for GCC (violence/sexual content thresholds); (2) kill criteria (auto-reject list); (3) quota table for the 150-title batch with tolerance ranges; (4) a 30-day post-launch performance review template (what metrics decide double-down vs drop per title); (5) negotiation guardrails cheat-sheet (rev-share only, no MGs, non-exclusive, territory verification mandatory).

### PROMPT W10 — Regulatory Horizon Scan: GCC Streaming (research-heavy)

Research the regulatory environment for streaming services across all six GCC states: licensing requirements for OTT/streaming platforms (does a Bahrain-based free AVOD site serving GCC audiences need media licenses in each state?), content-standards regimes (what content classifications/restrictions apply), advertising regulations, data-protection laws (PDPL Bahrain, PDPL Saudi, UAE data law) as they apply to a cookieless-analytics free platform, and any pending legislation on streaming/VOD in 2025–2026. For each state: current requirements, enforcement reality for small platforms, risk rating, and recommended posture. Cite sources. Mark uncertainty honestly — this feeds a real compliance roadmap.

---

## HOW TO RUN (practical)

1. **W1 first, on the heaviest model** — it's the anchor document and the slowest to produce well.
2. Then W2 + W3 in parallel bots.
3. W5/W6/W7 next (growth), W8/W9/W10 last.
4. Paste outputs back to the main agent one at a time. I will: verify numbers against live data, strip anything that contradicts our doctrine, merge into the canonical doc set, and turn action items into actual builds/automations.
5. If trial time remains: rerun W1's financial model with harder skepticism ("attack this model's assumptions as a hostile due-diligence analyst") — adversarial passes improve it more than polish passes.

---

## FACTS BLOCK (paste into every bot as context)

Whisco TV (whisco.tv) — free, 100% ad-supported (AVOD/FAST) streaming platform. Founded 2026, based in Bahrain, founder-operated (GitHub: burn8887), currently unincorporated; angel supporter contributes $200/month (informal, non-equity). Audience: 30M+ expatriates in GCC (Indian incl. Malayalam/Tamil/Telugu/Punjabi/Bengali, Pakistani, Bangladeshi, Filipino, Indonesian, Nepali, Sri Lankan, Arab expats, Turkish-drama fans) in 13 languages. Catalog: ~600 active live channels (free-to-air + official sources, auto-health-checked every 6h), ~14,500 active on-demand titles (~16.9k total) incl. 61 Turkish series (~3,650 eps), 333 Arabic series (~7,100 eps), 2,500+ Hindi cinema, 672 Malayalam, all legally sourced (public domain, official broadcaster channels/embeds) with automated legality/geo verification (GCC-specific, 6 countries). Most VOD = official YouTube embeds (broadcaster monetizes those; we monetize page display ads now, own-player video ads later via licensed content). Tech: Next.js on Vercel Pro ($20/mo), Neon Postgres (~$5–15/mo usage), fully automated ops (uptime 15-min checks, content discovery crons, self-healing catalog), infra <$50/mo total. Apps: Android in Play closed testing (26 testers, 14-day clock running), iOS submitted to App Store review (2026-09-02, decision pending). Monetization: AdSense re-review pending (~mid-Sept 2026, "low value content" remediation done: 7 hand-written guides, 2,680-URL clean sitemap); video pre-roll planned on own-player licensed content (Filmhub channel application in progress — phone invitation received Sep 2026; rev-share only, no MGs). Analytics: Vercel Web Analytics (cookieless) just instrumented; audience early-stage, no meaningful MAU yet — DO NOT invent traffic numbers, mark projections as projections. Budget: $200/mo investor + $300 approved content/infra budget. Hard doctrines: no piracy ever (anti-pirate positioning is the brand), max 1 ad/page never near player, no pop-under networks, no fake traffic, community posting is human-only (automation drafts, humans post), no subscriptions ever (free forever), privacy: apps collect zero data ("Data Not Collected" labels on both stores), no analytics SDKs in apps until v1.1 post-approval. Brand: named after founder's real Shih Tzu Whisco; dark premium UI (#0a0a0f, orange→pink gradients); tone = honest, expat-first, anti-hype. Competition reality: Shahid/OSN/StarzPlay (paid, Arabic-first), ZEE5/YuppTV (paid, siloed per language), pirate IPTV (the true incumbent — freezing, illegal, malware); our gap = multi-language free legal hub for expats, no-signup, honest ads. Team scaling constraint: solo founder + AI engineering agent; anything recommended must be executable by ≤2 people with heavy automation.

*End of prompt pack.*
