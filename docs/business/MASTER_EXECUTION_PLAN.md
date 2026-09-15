# WHISCO TV — MASTER EXECUTION PLAN (issued 2026-09-15)

**Founder's mandate:** be the #1 platform on the planet for customised content — in-house written content fused with VOD and live TV, in a personalised experience no legacy competitor can match. Speed is now a requirement, not a preference.

**The reframe that changes everything:** AdSense rejected us for **"low value content"** on 2026-08-29. The mandate to write original content for every episode is not a separate track from revenue — **it is the same fix.** Original, passionate, in-house writing is exactly the "unique high quality content" Google is asking for. One body of work clears the gate AND builds the moat. That is why this plan puts articles first.

---

## 1. THE TEAM AND WHAT EACH ONE ACTUALLY DOES

| Owner | Role | Can do | Cannot do |
|---|---|---|---|
| **Ali (founder)** | Decisions, money, third-party posting, account creation | Approve spend, post in communities by hand, create accounts, sign agreements | — |
| **The Agent** (me) | Execution arm: code, infra, data, APIs, stores, production | Build, deploy, migrate, write content engine, run audits, touch credentials | Publish third-party posts |
| **Grok / Grok Bot / Cursor** | Heavy model + code assistance | Bulk drafting, long-form generation under a spec, parallel code work | Nothing reaches production without my verification |
| **Fatema** | Team leader: approval gate, ledger, briefing, credential register, **community moderation once forums exist** | Approve/reject drafts, hold the task ledger, moderate | Post third-party, touch production |
| **Basil** | Drafts: community replies, owned-channel calendar, outreach | Draft everything, publish nothing | Publish without Fatema's approval |
| **Grok-Design** | Design lead | Design packs, themes, graphics | Overrule brand doctrine |

---

## 2. WORKSTREAMS — MANDATE BY MANDATE

### W1 · Hyper-targeted personalisation — *"the platform reacts to the user's world"*
**Build:** an events engine — occasion/lunar/celestial calendar (Ramadan, both Eids, Nowruz, Diwali, Onam, Pongal, Chinese New Year, Christmas, national days for all six GCC states, solar/lunar eclipses, meteor showers, World Cup windows) → geo-scoped theme override → forced dark variant, live countdown, themed hero, Whisco mascot state, themed shelf ("Tonight in Manama").
**Why it's cheap:** geo detection is already provided by Vercel headers; the whole thing is a data table + a theme-token provider + one component set. No new vendor.
**Owner:** Agent (build) · Grok-Design (theme palettes) · Basil (copy per occasion)
**Deliverable:** engine + 4 launch themes (Ramadan, Eid al-Fitr, Diwali, a solar-eclipse demo) → **Sep 24**; first live theme at the next occasion.

### W2 · Articles for every episode — *the flagship differentiator and the AdSense answer*
Two tiers, because one cannot honestly be done at the other's speed:

**Tier A — flagship editorial (in-house voice, human-quality).** Deep pieces on the shows people actually watch: where-to-start guides, character maps, season-arc explainers, single-episode essays. Written in the house voice, accurate, fan-passionate. This is what ships for Filmhub.
**Tier B — catalogue-wide enrichment (scale).** Source-derived unique text for all 16,920 titles + 10,769 episodes, built from each video's own description via the YouTube Data API, composed into genuine 120–200 word synopses. **Blocked on one thing: a YouTube Data API key (founder, ~1 minute).**
**Owner:** Agent (engine, Tier A writing, Tier B pipeline) · Grok (bulk drafting under spec) · Fatema (quality gate + fact check) · Basil (distribution of published pieces)
**Deliverable:** content engine + 6 flagship articles live on a preview URL **within 48h**; Tier B catalogue pass once the key lands; every episode covered in waves by show popularity.

### W3 · Community forums for every major show
**Recommendation: do not build forums from scratch.** Four options assessed; the honest ranking is (1) **self-hosted open-source forum** (NodeBB/Discourse) on our own subdomain — full control, no per-user cost, needs moderation labour; (2) hosted Discourse — fastest, ~$100/mo (needs founder approval, Tier 0); (3) in-house build — slowest, highest risk; (4) **read-only "fan wall" first** — comments on articles, no accounts, near-zero abuse surface, ships in days.
**Opinion, and I'll defend it:** start with (4) + (1) for **10 flagship shows only**. 394 empty forums is a ghost town and a spam magnet; ten living ones is a community. Fatema moderates; Basil drafts seed threads; **Ali posts in third-party spaces, never bots.**
**Owner:** Agent (investigation + platform setup) · Fatema (moderation + rules) · Basil (seed content)
**Deliverable:** platform decision by **Sep 18**, fan-wall live **Sep 21**, forums live **Sep 28**.

### W4 · Active gamification — quizzes, challenges, streaks
**Build:** per-show quiz banks tied to what users are watching, a live "watched this week" challenge board, streaks and badges, leaderboard by country. Content comes free from the same article pipeline — an episode article generates its quiz questions.
**Owner:** Agent (engine) · Grok (question drafting under spec) · Fatema (fact check — a wrong answer on a public quiz is a credibility hit)
**Deliverable:** quiz engine + 200 questions across 5 flagships → **Sep 26**; leaderboards **Oct 3**.

### W5 · Filmhub — what to show in 48 hours
The call is **Sep 17, 22:00**. Three fears to disarm (fraud · reporting flakiness · zero-revenue dead weight). What we bring:
1. **A live preview build** demonstrating original editorial content on a flagship series — proof we are a content platform, not a scraper.
2. **The catalogue facts** (600+ channels, 16,900+ titles, 13 languages, both app stores in review).
3. **The reporting promise made concrete** — automated monthly per-title reporting from our own database, which is already how our ops work.
4. **Entity answer decided in advance** (sole proprietor today, CR in progress — novate later). Never invent a company.
**Owner:** Agent (build + dossier) · Ali (delivery)
**Deliverable:** preview URL + one-page dossier **by Sep 16 end of day**.

---

## 3. TIMELINE

| Date | Milestone | Owner |
|---|---|---|
| **Sep 15 (today)** | Content engine + 6 flagship articles written; plan issued; bot briefs dispatched | Agent |
| **Sep 16** | Preview build live (no production change); Filmhub dossier ready; personalisation engine started | Agent |
| **Sep 17, 22:00** | **FILMHUB CALL** — preview URL + dossier in hand | Ali |
| Sep 18 | Forum platform decision; personalisation data model | Agent |
| **Sep 20** | Post-freeze production deploy: articles route live, `where-pages` merged, AdSense content fixes | Agent |
| Sep 21 | Fan-wall live; catalogue enrichment (Tier B) running | Agent |
| Sep 24 | Personalisation engine + 4 themes live | Agent |
| Sep 26 | Quiz engine + 200 questions | Agent |
| Sep 28 | Forums live (10 flagships) | Agent + Fatema |
| **~Sep 30** | **AdSense Request review** — only once the content work is live and verified | Ali (the click) |

## 4. THE FREEZE, HONESTLY

The freeze (Sep 16–19) exists to protect the **Apple submission currently in review**. It restricts *production*. It does not restrict:
- **preview deployments** (Vercel branch builds) — the Filmhub demo rides one of these;
- content authoring and data work;
- the `/where` pages, which were always landing Sep 20.

**So the freeze costs us nothing in this plan.** Everything that can be built is built; everything deploys Sep 20, which is also the day the Apple decision window closes. No exception needed, no risk taken.

## 5. WHAT I NEED FROM ALI

| # | Decision / asset | Why | When |
|---|---|---|---|
| 1 | **YouTube Data API key** (Credentials → Create credentials → API key; restrict to "YouTube Data API v3") | Unlocks Tier B: real unique text for 16,920 titles + 10,769 episodes. Without it, catalogue enrichment is a multi-day crawl instead of a one-day pass. | Sep 15 |
| 2 | **Freeze posture confirmed** — build on branches, deploy Sep 20 | Protects the Apple submission at zero cost to this plan | Sep 15 |
| 3 | **Forum platform spend** if we choose hosted Discourse (~$100/mo recurring) | Option 2 only; self-hosted avoids it | Sep 18 |
| 4 | **AdSense payee name** — personal or W.L.L.? | One field that is painful to change later | before payment info is entered |
| 5 | **"100% Free" pill — scrub site-wide?** | Voice Doctrine §2 caps free-claims at 2/page; Apple already scrubbed it | Sep 20 deploy |
| 6 | **Play Console**: production-access card + target-API banner | Still unverified from my side | this week |

## 6. GUARDRAILS THAT DO NOT BEND FOR SPEED

- Bots draft; **humans publish** in third-party spaces. No fake accounts, ever.
- Public copy: floors only ("600+ live channels", "16,000+ movies & shows"). Never a ceiling, never an invented number.
- No sanctioned-broadcaster names in any material.
- Max 1 ad per page; never near the player.
- Arabic spelling **ويسكو**; dark-only; RTL-first; the dog never on posters, catalogue shots, ads or legal pages.
- Every article carries a byline and a real source basis. No invented facts — if we can't verify it, we don't write it.
