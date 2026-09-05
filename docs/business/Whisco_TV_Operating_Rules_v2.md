# WHISCO TV — OPERATING RULES v2 (post-hostile-diligence)
*Adopted 2026-09-06 after the adversarial pass on the W1 financial model. These rules govern how the engineering agent and founder plan, spend, and report. They supersede the W1 plan's assumptions for all operating decisions. The W1 plan remains filed as narrative context; the hostile memo as the risk picture; THIS document as the rulebook.*

---

## 1. Measurement rules (the hostile model's rebuild, adopted)

1. **Projected MAU = 0** until both apps are public AND AdSense is live. Forecasts may only use *measured* weekly installs and 4-week retention cohorts once they exist.
2. **Sessions/user assumption = 1.5–3.0** until Vercel Analytics proves otherwise with ≥4 weeks of data.
3. **Display RPM planning band = $1–3, fill 15–35%** for year one. The $2–8 band is retired until an actual AdSense payment report exists.
4. **Video revenue = $0 in all plans** until a signed, GCC-cleared, demand-mix-relevant licence exists with files playing in our player.
5. **Sponsor revenue = $0 in all plans** until 90 days of analytics history exists.
6. **Angel $200/mo = toggle**, never a 60-month certainty, in any cash model. (Form A signing improves this to "documented gift" — still cancellable.)
7. **KPI honesty split:** all reporting distinguishes (a) own-player monetizable hours/titles from (b) embed counts. Catalog size is an operations metric, not a traction metric.
8. **The optimistic scenario is dead for external readers.** Documents shown to investors/partners carry conservative + base only.
9. **Formation/legal budgeted as $5–15k envelope** (BHD 2–6k) until actual invoices prove less — not $400–800.
10. **Founder labour** is a named line ($0 by choice, disclosed) in anything external.

## 2. The four gates (nothing revenue-related is "on track" until its gate OPENS)

| Gate | State 2026-09-06 | Opens when |
|---|---|---|
| G1 AdSense | Re-review pending | First ad payment report visible |
| G2 Stores | iOS in review; Android clock running | BOTH apps publicly installable |
| G3 Licensed content | Filmhub call pending | Signed licence + first GCC-cleared files playing in OUR player |
| G4 Entity | Formation approved by founder | CR number issued, bank account open |

**Spending rule:** growth spend scales with OPEN gates, not with budget availability.

## 3. Budget governance — the $3,000/month authorization (2026-09-06)

Founder authorized up to $3,000/month at agent discretion. **The agent's discipline, adopted as policy:**

- **Baseline burn stays ~$45–60/mo** (infra + Apple amortized). Nothing changes day-to-day.
- **Spend tiers unlock by gates, not by calendar:**
  - **Tier 0 (now, 0–1 gates open): ≤ $150/mo.** Infra + small one-offs (e.g., Bunny ingest the day Filmhub says yes; policy-suite legal review; formation filing fees when founder files).
  - **Tier 1 (G1+G2 open): ≤ $500/mo.** First Meta ad experiments ($110–200 learning budget under the playbook's kill rules), CDN growth, WhatsApp Channel assets.
  - **Tier 2 (G1+G2+G3 open): ≤ $1,500/mo.** Scale what has measured cost-per-retained-viewer; sponsor-kit production; more licensed-content ops.
  - **Tier 3 (all four gates + 90 days of retention data): up to $3,000/mo** only into channels with proven payback math.
- **Any single spend > $300 or any new recurring commitment > $100/mo:** agent proposes, founder confirms in chat before commit. No exceptions.
- **One-off strategic spends** (formation ~BHD 700–1,400, legal review of policy suite, Bunny setup) come out of the envelope when their moment arrives — these are approved in principle now.
- **Never funded regardless of budget:** paid traffic before G1 (unmonetizable), content MGs (doctrine), pop-under/incentivized-install networks (doctrine), any spend whose only justification is "we have budget."

**Why not just spend $3k/mo now:** money cannot open any of the four gates (they're approval/signature events), and traffic bought before G1 monetizes at $0 and can't even be retention-measured properly pre-stores. The budget's power is SPEED AFTER the gates open — committed in advance so there is zero lag between "gates green" and "growth engine funded."

## 4. Standing maintenance register (what the agent keeps alive — reviewed every session)

**Production automations (GitHub Actions, iptv-app repo):**
| Workflow | Cadence | Health check |
|---|---|---|
| uptime-monitor | 15 min | must stay green; hardened w/ retries + DoH |
| channel-health-check (+VOD step) | 6-hourly | catalog self-healing |
| dizi-update | daily 05:00 | new episodes flow |
| content-discovery | Mon+Thu 04:00 | +channels/VOD, IndexNow pings |
| weekly-maintenance | Sun 05:00 | prune/trending/stats + evergreen IndexNow |
| billing-reminder | 25th monthly | Issue → email; annual escalations Jul/Aug 2027 |
| community-digest | Mon 06:00 | Issue with 5 post drafts → HUMAN posts |

**Site features requiring occasional attention:** /new page + feed.xml (auto), OG share cards (auto), Copy-message captions (extend languages as shelves grow), IndexNow key file (never delete from public/).

**Recurring agent duties:** verify workflow greens each session · fact-check + adapt SEO-pack drafts into /guides (~2/week target) · refresh dossier + handover on milestones · re-export DB snapshots after big catalog changes · monthly billing Issue closure follow-up · sponsor-pack activation ~Oct (after 4 weeks analytics) · Ramadan campaign prep from marketing playbook (~Jan 2027).

**Calendar triggers registered:** AdSense re-review (~15 Sep) · Play 14-day clock end (~mid-Sep) · Apple verdict watch (daily API check if silent past 8 Sep) · analytics 4-week mark (~1 Oct) → media kit + sponsor wake-up · budget tier review at each gate opening.

## 5. Decisions log (running)

| Date | Decision |
|---|---|
| 2026-09-06 | W.L.L. formation GO ("Whisco Media W.L.L.", ISIC 6312+6201+6311) — founder files via Sijilat |
| 2026-09-06 | Form A gift side-letter GO — founder signs with supporter |
| 2026-09-06 | Policy suite v2 publication GO — pending clean MD source from Grok, then agent fact-checks & publishes |
| 2026-09-06 | Budget authorization $3,000/mo — governed by §3 tiers; agent discretion within rules |
| 2026-09-06 | Hostile-diligence rebuild rules ADOPTED (§1) |
