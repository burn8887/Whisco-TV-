# FILMHUB CALL — FULL PREPARATION BRIEF
*Prepared 2026-09-03. Read once fully, then use the one-page cheat sheet at the end during the call.*

---

## 1. KNOW YOUR COUNTERPART (what Filmhub is and what THEY want)

**Their business:** Filmhub is a rights marketplace/aggregator (~$13.8M raised, a16z-backed, founded by Klaus Badelt — the Hollywood composer). Filmmakers list titles; channels like us license them **revenue-share, no upfront**. Filmhub takes ~20% of what the filmmaker earns. **They only make money when our ads make money.**

**What that means for you:** they are NOT gatekeeping like Netflix. They WANT more channels — every legitimate channel is free distribution for their catalog. The call is not "convince them to sell to you." It's **"convince them you're real, honest, and will still exist in two years."** Their three fears, in order:

1. **Fraud/piracy** — a fake "channel" that takes files and redistributes them
2. **Reporting flakiness** — channels that go dark on quarterly reports (their #1 operational headache; late reports = accounts put On Hold)
3. **Zero-revenue dead weight** — channels that license 500 titles and never generate a dollar

Every answer you give should quietly disarm one of these three.

---

## 2. YOUR NUMBERS (memorize these — all real, all current)

| Metric | Value | Notes if pressed |
|---|---|---|
| Live channels | **600+ active** (607 today) | auto-health-checked every 6h, dead streams auto-hidden |
| VOD titles | **14,500+ active** (16.9k catalog) | public domain + official broadcaster channels |
| Series | 394 series / ~10,800 episodes | incl. 61 Turkish dizi, 333 Arabic series |
| Languages | **13** | Hindi, Urdu, Malayalam, Tamil, Telugu, Bengali, Punjabi, Nepali, Sinhala, Filipino, Indonesian, Arabic, Turkish + English |
| Platforms | Web (whisco.tv) + **Android (26 testers, Play closed testing)** + **iOS (submitted, in App Store review NOW)** | "full app-store footprint within weeks" |
| Uptime/ops | 15-min uptime monitoring, 24/7 automated content QA | zero-failure record last 30 days |
| Market | GCC expat communities — 30M+ expatriates | Bahrain-based founder, lives in the market |
| Monetization | AVOD; AdSense display first (approval expected Sept), **video pre-roll on own-player content = exactly where Filmhub titles fit** | honest: revenue is early-stage |
| Traffic | Analytics just instrumented (Vercel); early-stage, growing via SEO + app launches | DO NOT invent numbers — see Scenario C |
| Team | Founder + automated ops + engineering agent | "content ops are 90% automated — that's why a small team runs 600 channels" |

**Your one-sentence identity:** *"Whisco TV is a free, ad-supported streaming platform for the 30 million expatriates in the Gulf — the largest underserved TV audience in the world — 600+ live channels and 14,500 titles in 13 languages, fully legal, fully automated, on web and both app stores."*

---

## 3. THE 15 QUESTIONS THEY MAY ASK — WITH YOUR ANSWERS

**Q1. "Tell us about Whisco TV."**
→ The one-sentence identity above, then ONE beat of story: "It's named after my Shih Tzu. I built it because every expat here either pays for 4 apps from home or buys pirate IPTV. We're the legal free alternative, and the pirate-IPTV problem in the Gulf is exactly why a licensed platform wins here."

**Q2. "What's your monthly traffic/viewership?"**
→ HONEST, framed forward: "We're early-stage on audience — the site went on its own domain three weeks ago, analytics went live this week, and both mobile apps hit the stores this month. I'd rather give you real numbers in 30 days than inflated ones today. What I can show now is the catalog scale, the automation, and the market size — and our reporting to you will come from the same analytics pipeline, so what we report is what we measure."
→ (This turns your weakest metric into a demonstration of reporting honesty — their fear #2.)

**Q3. "How do you monetize? What are your CPMs?"**
→ "AVOD. Display via AdSense now (approval expected this month), video ads on own-hosted content next — which is precisely where Filmhub titles come in: they'd run in OUR player with pre-roll, not embedded third-party players. GCC display CPMs run $2–8; video pre-roll in-region is meaningfully higher. Filmhub content would be our premium, best-monetized shelf from day one."

**Q4. "What entity signs the agreement?"**
→ [YOUR REAL ANSWER — decide before the call]: If you have a Bahrain CR: name it. If not: "Operating as a sole proprietor in Bahrain while the entity is being established; happy to contract as an individual initially and novate to the company later." NEVER invent a company.

**Q5. "How will you receive deliveries?"**
→ "S3-compatible ingest on Bunny — bucket and credentials can be live the day you flip us active. We already stream HLS and MP4 in our own player, so playback is a solved problem." (Confident, specific, short. This is fully true — the pipeline design is done, it deploys in a day.)

**Q6. "How do you report viewership and revenue?"**
→ "Automated monthly, from our database — per-title views, watch time, territory, and revenue attribution, in your template. Our whole operation is automation-first: 600 channels are health-checked every 6 hours without a human. Reporting will never be late — it's a cron job, not a chore." (Kills fear #2 dead.)

**Q7. "What content do you want?"**
→ Be surgical, not greedy: "Starting with 100–300 titles: genre film — action, thriller, horror — documentaries and true crime, and family films. English-language first; Hindi, Arabic or Filipino-relevant content is a bonus. We watch 30 days of data, then double down on what our audience proves it watches. We'd rather license 150 titles that earn than 1,500 that sit."

**Q8. "What territories?"**
→ "Primary: the six GCC countries. We're happy to take worldwide where avails allow, but we geo-restrict cleanly — we already run geo-verification on every YouTube title in our catalog per-country, so territory compliance is built into our DNA, not bolted on." (Quietly impressive — most small channels can't do this.)

**Q9. "How do you protect content? DRM?"**
→ "Token-signed URLs and geo-restriction via Bunny CDN at launch; DRM (Widevine/FairPlay) when a title requires it. And to say it plainly: we're the anti-piracy platform — our whole pitch to viewers is 'stop buying pirate IPTV.' We treat licensed files with the paranoia of people who built a legal business in a piracy-heavy market." (Kills fear #1.)

**Q10. "Revenue will be small at first — why should we bother?"**
→ "Three reasons. One: zero-cost bet for you — rev-share means our downside is ours alone. Two: nobody else is aggregating this audience — 30M expats the big AVODs treat as an afterthought; we're the beachhead. Three: we're building on both app stores plus web with TV apps on the roadmap — every surface multiplies your catalog's reach. Small now, but the reporting will show you the slope, not just the level."

**Q11. "Who's behind this? Team? Funding?"**
→ "Founder-led from Bahrain — I live inside the target market. Engineering and content ops are heavily automated. We're angel-backed for operating costs, deliberately lean — our infra bill is under $50 a month serving 600 channels, which means we don't need big revenue to be sustainable. We're built to still be here in five years." (Their fear #3: dead weight. Lean = survivable.)

**Q12. "What about your existing content — is it all licensed?"**
→ "Everything is legally sourced and verified before it enters the catalog: free-to-air broadcasts, official broadcaster channels and embeds, public domain. We enforce it with automated checks — embeddability, geo-availability per country. We've turned away entire categories that couldn't be verified. That discipline is exactly what we'll apply to your titles' avails."

**Q13. "What's your growth plan?"**
→ "Three engines: SEO (guide content + 2,700 indexed title pages), app-store discovery ('free live TV' in GCC stores), and community word-of-mouth — expat communities here share via WhatsApp at extraordinary rates. Paid Meta ads begin after AdSense approval. Filmhub content upgrades the premium shelf, which lifts retention across all three."

**Q14. "Have you worked with content licensors before?"**
→ Honest: "This would be our first marketplace relationship, which is why we've already built the delivery, playback, and reporting design before this call — I'd rather over-prepare than over-promise. Our automation record is public: the GitHub workflows that run our QA have a zero-failure record."

**Q15. "Any questions for us?"** → SEE SECTION 5. Always have questions. This is where you impress.

---

## 4. SCENARIO PLAYBOOK (how the call can go, and your move in each)

**Scenario A — The soft yes ("we'll set up your channel account")**
Move: lock logistics immediately. "Excellent — what do you need from us to go live? We can have S3 ingest ready within a day, and I'd love an intro to whoever will be our account manager." Get: timeline, onboarding steps, their reporting template, catalog access date. Send thank-you email same day from partnerships@ recapping commitments.

**Scenario B — The vetting call (mostly their questions)**
Move: answer from Section 3, keep answers under 60 seconds each, and land the three fear-killers (automation reporting Q6, anti-piracy Q9, lean sustainability Q11) even if not directly asked — weave them in.

**Scenario C — The numbers challenge ("your traffic is tiny")**
Move: never bluff. "Correct — audience is the thing we're youngest on. Catalog, apps, automation and market are what we've built first; audience is what this quarter is for. If it's more comfortable, start us with a smaller catalog tier and let the monthly reports earn the expansion." (Offering to start small REVERSES the pressure — you look like the responsible party.)

**Scenario D — They push a minimum guarantee (MG) or fees**
Move: polite hard line. "We're a rev-share partner by design — that's what makes us a zero-risk channel for you. MGs don't fit our stage, and honestly, a small channel promising MGs should worry you more than one that won't." (True, and they know it. Filmhub's standard model IS rev-share; if MG comes up it's a test or an upsell — decline warmly.)
**Budget guardrail: you have $300 approved. Bunny infra will use ~$20–50/mo of it. Commit to NOTHING beyond that on the call. Any paid ask = "let me review and come back to you."**

**Scenario E — Exclusivity ask ("would you take exclusive GCC rights?")**
Move: "Open to discussing exclusivity per-title where the economics justify it, but our default is non-exclusive — same as your marketplace's default. Happy to revisit once we have performance data." Never accept exclusivity obligations (marketing commitments, MGs) on a first call.

**Scenario F — The technical deep-dive (they bring an ops person)**
Move: specifics win. Delivery: S3-compatible (Bunny). Formats: HLS/MP4, we transcode via Bunny Stream. Player: own web player + native apps (ExoPlayer/AVPlayer). Geo: CDN-level per-territory blocking. Reporting: automated monthly from DB, per-title/per-territory. Metadata: we ingest posters/synopses/artwork into our catalog system with SEO pages per title. If asked something you don't know: "I'll confirm with engineering and email you today" — then tell me.

**Scenario G — The stall ("we'll get back to you")**
Move: create a concrete next step before hanging up. "What would you need to see from us to move forward — a traffic threshold, the entity paperwork, anything else? And can we agree to reconnect in 30 days when I'll have our first month of app-store and analytics data?" Get a named contact + a date. Follow up exactly then, with real numbers.

**Scenario H — The curveball ("why not just use YouTube?" / "aren't you competing with Tubi?")**
→ YouTube: "YouTube monetizes the broadcaster, not us — own-player content is how we build our own economics. That's exactly why we want your catalog."
→ Tubi: "Tubi ignores our audience — no Malayalam shelf, no Urdu dramas, thin GCC presence, and several big AVODs geo-block the region entirely. We're not out-bidding Tubi; we're serving who they skip."

---

## 5. YOUR QUESTIONS FOR THEM (pick 3–4 — this is where 'deep understanding' shows)

1. **"Which genres are over-performing on AVOD in MENA or with diaspora audiences across your other channels?"** (Shows data-driven thinking; gets you free market intel.)
2. **"How do avails work for GCC specifically — is Middle East rights coverage broad in the catalog, or should we expect to filter heavily?"** (Shows you understand territory licensing — most applicants don't.)
3. **"What does your reporting template look like, and do you prefer monthly or quarterly at our stage?"** (Signals you take their #1 pain point seriously.)
4. **"What separates the channels that succeed on Filmhub from the ones that stall?"** (Humble, smart, and their answer = your roadmap.)
5. **"Is there dubbed or subtitled content — Arabic subs, Hindi dubs — in the catalog? That doubles a title's value for us."** (Shows audience understanding.)
6. **"Who would be our account manager, and what does the path from Hidden to Active look like?"** (Shows you've done homework on their actual process.)

---

## 6. DO NOT SAY (self-inflicted wounds to avoid)

- ❌ Any invented traffic/revenue numbers (they may verify; one caught bluff = dead deal)
- ❌ "We want your whole catalog" (screams dead-weight channel — fear #3)
- ❌ Any mention of grey-area IPTV, "we can find any stream", etc. — our legality discipline is the brand
- ❌ Don't overexplain the YouTube-embed catalog if not asked; if asked, the Q12 answer is perfect
- ❌ Don't commit money beyond Bunny infra (~$50/mo) on the call — everything else: "let me review"
- ❌ Don't trash competitors (beIN, Shahid, Tubi) — position as "serving who they skip," never "beating them"
- ❌ Don't fill silences with concessions. State the answer, stop talking.

---

## 7. ONE-PAGE CHEAT SHEET (keep open during the call)

**Identity line:** Free AVOD platform for 30M Gulf expats · 600+ live channels · 14,500+ titles · 13 languages · web + both app stores (iOS in review now) · fully legal, fully automated · Bahrain-based founder.

**Their 3 fears → your 3 killers:**
1. Piracy → "We're the anti-piracy platform; token-signed URLs, geo-restriction, DRM-ready"
2. Flaky reporting → "Reporting is a cron job, not a chore — automated monthly from our DB"
3. Dead weight → "Infra under $50/mo — we don't need big revenue to survive; we compound"

**The ask:** 100–300 titles, rev-share, GCC-first territories, genre film + docs + family, start small → data → scale.

**Hard lines:** No MGs · No upfront fees · No exclusivity commitments · Nothing beyond ~$50/mo without review.

**If cornered on traffic:** "Real numbers in 30 days beat inflated ones today — and our reports to you come from the same pipeline."

**Always end with:** a named contact + a dated next step.

**After the call:** same-day recap email from partnerships@whisco.tv; tell me everything discussed → I build the Bunny pipeline / follow-ups / reporting automation as needed.
