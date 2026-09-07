# WHISCO TV — FOUNDER ABSENCE & AI-OUTAGE DISASTER RECOVERY
**Stress test v1.0 · 7 September 2026 · Internal only**  
**Simulation window A:** founder unreachable **Tuesday 8 September 2026 → Monday 28 September 2026** (21 days).  
**Simulation window B:** AI engineering-agent workflow unavailable for the same 21 days; founder is present.  
**Ground truth:** Company Dossier v1.1 (7 Sep), Operating Rules v2 (6 Sep), Ops/Org/AI Blueprint v1.0 (5 Sep), App Store Review War Room v1.0 (7 Sep), Policy Suite v2.0, Partnership one-pager, Data-Room Checklist. No invented traffic, no invented contacts, no fake credentials.

This is not a thought experiment. It is the list of things that actually stop, rot, or explode if Ali Albaharna cannot touch a keyboard, and the list of things that live only in the agent’s head if the agent goes dark.

**Blunt verdict up front**

- The **website can stay up for 21 days** if the founder’s card does not fail and GitHub Actions secrets do not expire. That is the only comfort.
- Every **open gate** (AdSense, App Store, Play production, Filmhub, W.L.L.) is a human-signature event. All four stay closed or go stale.
- There is **no named backup operator**. The angel is a $200/month goodwill line, not an on-call SRE. Family has zero runbook today.
- Secrets, 2FA, Apple, Google Play, AdSense, Vercel, Neon, GitHub (`burn8887`), domain registrar, and `legal@` / `partnerships@` are a single person. That is the company.
- Catalog automation will keep hiding dead FTA streams and adding VOD from the **already-vetted 16 official source channels**. That is not “the business running.” That is a fridge still cycling while the owner is in hospital.
- A rights-holder email to `legal@whisco.tv` that nobody opens is the one event that can turn a recoverable absence into a brand and store-account event.

---

## 0. What actually exists on 7 September 2026 (the only inventory this test may use)

| Surface | State | Who can touch it |
|---|---|---|
| whisco.tv (Next.js / Vercel Pro ~$20/mo) | Live | Founder. Agent may recommend rollback; founder clicks. |
| Neon Postgres ($5–15/mo) | Live catalog | Founder. Nightly snapshot to git. |
| GitHub Actions in `iptv-app` | 7 workflows, ~100% 30-day success | Run without a human. Failures open Issues nobody reads. |
| Android | Play closed testing, 26 testers, 14-day clock running toward production | Founder only (Play Console + 2FA). |
| iOS | Submitted **2 Sep 2026**. Calendar day 5 today. Day 7 = **9 Sep**. | Founder only (App Store Connect + 2FA). |
| AdSense | Re-review pending, expected **~15 Sep** | Founder only. |
| Filmhub | Application in. **Phone-call invitation received Sep 2026.** No licence. | Founder only. `legal@` / `partnerships@`. |
| Entity | Unincorporated. W.L.L. GO decided 6 Sep. Founder files Sijilat. Form A gift side-letter GO, unsigned in production. | Founder + notary/Sijilat. |
| Funding | Informal $200/mo angel + $300 one-time content/infra. Cards are personal. | Angel can keep paying. Cannot operate the stack. |
| Analytics | Vercel Web Analytics since 3 Sep. No meaningful MAU. | Nobody needs to touch this for 21 days. |
| Community | Weekly digest Issue → **human posts**. WhatsApp Channel planned, not assumed live as a staffed property. | Founder posts. Agent drafts only. |
| Policies / legal desk | Templates. `legal@whisco.tv` is the public takedown address. | Founder same-day on removal language. |
| Secrets | Founder-held. Not in git. Agents forbidden to request export. | Nobody else. |

**Production automations that keep running without a founder (if GitHub + Vercel + Neon stay paid and secrets stay valid)**

| Workflow | Cadence | What it does if nobody watches |
|---|---|---|
| `uptime-monitor` | 15 min | Emails / Issues on fail. Nobody triages. |
| `channel-health-check` (+ VOD step) | 6-hourly | Auto-hide / auto-restore live rows. Correct behaviour. |
| `dizi-update` | Daily 05:00 AST | New official Turkish episodes if gates pass. |
| `content-discovery` | Mon + Thu 04:00 | Up to 25 new live + VOD from 16 vetted official sources + IndexNow. |
| `weekly-maintenance` | Sun 05:00 | Prune / trending / stats + evergreen IndexNow. |
| `billing-reminder` | 25th of month | Opens a GitHub Issue. On **25 Sep** it will sit unread. |
| `community-digest` | Mon 06:00 | Opens an Issue with 5 post drafts. Nobody posts. Doctrine: that is correct. Do not “fix” it by letting a bot post. |

**What does *not* keep running**

Store Resolution Center replies. AdSense policy-centre responses. Filmhub calls and emails. Sijilat filing. Form A signature. Community publishes. Vercel rollback. Card updates. 2FA recovery. `legal@` reading. Partner emails. Spend. New source domains. Privacy-label changes. App resubmits. Counsel. Anything the Operating Rules put behind a founder confirm.

---

# PART 1 — FOUNDER UNREACHABLE 21 DAYS
**Assumption:** starting **08:00 AST Tuesday 8 September 2026**, Ali cannot be contacted. The AI conversational agent may still exist in a chat no family member can authenticate. GitHub Actions keep firing. No new human gate is approved.

Absence day numbering: Day 1 = Tue 8 Sep … Day 21 = Mon 28 Sep.

## 1.1 Day-by-day degradation (this stack, this calendar)

### Pre-day (Mon 7 Sep) — last useful hour
If this document is being read *before* the absence starts, the work in Part 2 and Part 3 should already have been done. It has not. That is the first finding: **we wrote excellent runbooks and left the keys in one pocket.**

### Day 1 — Tue 8 Sep (iOS review calendar day 6)
- Site: fine, unless a deploy from the last session is bad. Last-deploy rollback needs the Vercel dashboard.
- iOS: War Room says **do nothing** on day 6. Correct. Silence is not stuck.
- Play: testers keep testing. Clock keeps counting *only if ≥12 testers stay active*. If testers churn under 12, the 14-day clock **resets** and nobody notices.
- Filmhub: if they call the number on the application today, it rings out. First impression of a marketplace that already invited a call: unprofessional, not dead.
- `legal@`: unread.
- Community: no Sunday packet was human-reviewed yesterday if the founder left tonight; Monday digest job still fires **9 Sep**.
- Agent session: if one is mid-task (policy publish, rights-pack PDF, Sijilat packet), it stops at the human gate. Half-done work sits in `/artifacts` and chat logs.

**Silent break:** none yet, if cards are current.

### Day 2 — Wed 9 Sep (iOS day 7 — first actionable store date)
- War Room calendar: **Day 7–14, if still Waiting for Review / In Review with no Resolution Center message → send one status inquiry.** Exact wording exists in War Room §5.3. **Nobody sends it.**
- Cost of missing it today: low. Cost of missing it *and* day 14: the paper trail the Board later wants does not exist.
- If Apple instead dropped a **5.2.3 / 5.2.2 / 4.2 / 2.1** rejection this morning: the reply window is implicit. Radio/media apps that sit on a 5.2.3 letter for two weeks look like they cannot produce rights paper. The rights-pack PDF was specified on 7 Sep; if it was not built and uploaded to App Review Information *before* absence, there is nothing to attach.
- Discovery cron is idle (runs Mon/Thu). Health checks continue.

**Silent break:** iOS inquiry SLA starts and is missed. Rejection letter, if any, ages.

### Day 3 — Thu 10 Sep
- `content-discovery` runs 04:00. Adds up to 25 live + VOD from the closed official list. Fine.
- IndexNow pings. Fine.
- Filmhub: second missed call or a “when are you free” email to `legal@` / the application mailbox. Marketplace AEs move on. The invitation is not a queue ticket; it is a courtesy with a half-life of days, not months.
- Uptime monitor: if a P4 false-positive fires (already happened once historically), an email goes to the founder address. Family sees a scary subject line and has no triage tree.

**Silent break:** Filmhub thread goes cold. Not visible on the site.

### Day 4 — Fri 11 Sep
- No human community post this week (Wed slot missed). Growth playbook cadence is broken. Not fatal. Brand is silent in the 58 mapped rooms.
- TestFlight testers may write feedback. Unread in App Store Connect.
- Play testers may churn. Unwatched.

### Day 5 — Sat 12 Sep
- Weekend. Crons still health-check. Catalog looks alive to a visitor.
- Doc staleness clock: dossier v1.0 (5 Sep) and v1.1 (7 Sep) already disagree on live-channel and VOD counts (581 / 15,696 vs 585 / 16,800+). No one reconciles. Anyone using the old file for a partner call will quote stale catalog numbers. Low damage while nobody is taking partner calls.

### Day 6 — Sun 13 Sep
- `weekly-maintenance` 05:00: prune, trending rotation (recency + language balance — analytics still too thin to be real popularity), stats note written somewhere the founder would have read in 15 minutes. Unread.
- `community-digest` is Monday, not today. Ops blueprint also wanted a Sunday human review of next week’s drafts. Does not happen.
- Even-month DR drill is **not** due (even months: Feb, Apr, Jun, Aug, Oct, Dec). October drill will be late if this absence pattern repeats. Not this window.

### Day 7 — Mon 14 Sep (iOS day 12)
- `content-discovery` 04:00 + `community-digest` 06:00.
- Digest Issue #N contains 5 drafts. Doctrine: **do not post them**. A well-meaning family member who “keeps the socials warm” would violate Operating Rules § community human-only *and* the mapped-room rules. Silence is the compliant failure mode.
- GitHub Issues now include: at least one digest, possibly uptime noise, possibly failed workflow retries. Pile begins.
- iOS: still inside day 7–14 inquiry window. Still unsent.

**Silent break:** issue tracker becomes a graveyard. Next human back will not know which Issues are crons vs real.

### Day 8 — Tue 15 Sep (AdSense expected-window midpoint + iOS day 13)
- Operating Rules calendar trigger: **AdSense re-review (~15 Sep)**.
- Three possible Google outcomes, all unread:
  1. **Approved.** Display ads may start rendering on web. Doctrine (max 1 slot, never near player) is already in the page template — good. Payment profile / PIN / address verification often follows approval. If Google mails a PIN to a residential address and nobody is home to treat it as a business event, payout setup slips weeks.
  2. **Rejected again / more information needed.** Policy Centre wants a reply. Silence = stay unpaid. A second “low value content” or “insufficient original content” with no reply teaches the reviewer the publisher is inactive.
  3. **No change.** Common. Harmless.
- If ads begin showing while apps still say “Data Not Collected” and contain **no ad SDK**, that is still consistent — web ≠ app. Do not “help” by flipping Play “Contains ads” without the founder. Wrong checkbox now is a later policy event.

**Silent break:** AdSense PIN / additional-info request expires or ages. Gate G1 does not open even if Google said yes.

### Day 9 — Wed 16 Sep (iOS day 14 — second store SLA)
- War Room: **Day 14–21, if still silent after the (unsent) inquiry → request a callback via App Review contact form.** Also unsent.
- Play 14-day clock: Operating Rules said “end ~mid-Sep.” Exact start date is **not in the dossier**. Treat mid-Sep as the earliest production-eligibility date. Eligibility is not auto-publish. Founder must promote the track. **Production does not go live.** Testers keep seeing a testing build. No public Android.
- If the clock already elapsed earlier in the window, same result: production button unpressed.

**Silent break:** G2 stays closed on both stores. Two weeks of “we would have been allowed to ship Android” evaporate.

### Day 10 — Thu 17 Sep
- Discovery cron again. Catalog grows. SEO URLs multiply. Sitemap / IndexNow keep up automatically. Fine.
- If a discovered official source *changes ToS* or starts failing embeddability in a new way, QA monitor hides. Correct.
- If a new official domain appears that would need a founder `REVIEW` to add to the 16-source list, it is dropped. Opportunity cost only.

### Day 11 — Fri 18 Sep
- Week 2 of community silence.
- If a mapped room already has an unanswered thread the founder promised to return to, that is a trust nick, not a system failure.
- WhatsApp family forwards of whisco.tv links still work (OG cards are auto). Sharing toolchain does not need a founder.

### Day 12 — Sat 19 Sep
- Neon usage: catalog growth + snapshots. Unlikely to blow the $15 band in 21 days at current rates. If it did, Neon does not “auto-upgrade” in our policy; it throttles or bills overage to the card on file. Agent is forbidden to change the plan. Founder is gone. **Card either pays or the DB becomes the outage.**
- Vercel Pro: similar. Bandwidth on a no-MAU site should stay inside Pro. A bot scrape could surprise. Nobody is watching the invoice preview.

### Day 13 — Sun 20 Sep
- Weekly maintenance again. Stats note #3 unread.
- Trending shelves rotate on recency. Visitors still see a living catalog.
- Editorial guides (7) unchanged. SEO pack drafts for gaps 1/4/11/14/20 stay unpublished if they were not already on `/guides`. Content-gap capture pauses.

### Day 14 — Mon 21 Sep (iOS day 19)
- Third Monday digest Issue. Three weeks of drafts, zero posts.
- War Room day 21+ action date is **23 Sep**. Two days left for a second contact that will not be sent.
- Filmhub: treat the invitation as **dead** unless they are unusually patient. Re-opening later is a new cold thread, not a continuation.

### Day 15 — Tue 22 Sep
- Formation: Sijilat packet not filed. “W.L.L. GO” from 6 Sep is a decision without an application. Counterparties who asked for a CR this month get nothing. Partnership one-pager already told Filmhub we will not sign a personal-name licence as a workaround. Stalemate is the designed failure mode — better than a bad signature — and it still costs the month.

### Day 16 — Wed 23 Sep (iOS day 21)
- War Room: **Day 21+ second contact; Board only if there is a written rejection; do not pull the binary.** Nothing sent.
- If Apple approved at some point in the window and the email went to an unread inbox: the app may already be “Pending Developer Release” or live, depending on how the submission was configured. **Unknown, because release-type is not in the dossier.** If it auto-released, public iOS exists with nobody watching reviews, 1-star “doesn’t play in my country” reports, or a 5.2.3 complaint from a rights holder who found the store listing. If it is manual-release, approval sits until the founder taps Release.
- Either way, nobody replies to user reviews.

**Silent break (highest store risk in the window):** an approved-but-unwatched listing, or a rejected-and-unanswered 5.2.x letter now three weeks old.

### Day 17 — Thu 24 Sep
- Discovery cron. Catalog still self-heals.
- `billing-reminder` fires tomorrow.

### Day 18 — Fri 25 Sep — billing event
- GitHub Action `billing-reminder` opens the monthly Issue (Operating Rules: 25th). Checklist wants Vercel preview, Neon usage, Apple/Google cards, AdSense threshold, domain + `legal@` routing, angel $200 noted, $300 one-time balance.
- **Nobody closes it. Nobody looks at the card.**
- Real money movement this day is not the Issue. It is whatever auto-charges on the founder’s personal card (Vercel Pro cycle, Neon usage). Dates of those cycles are **not documented**. If a card expires in this window, this is the week the site dies, not day 1.
- Angel $200: goodwill, toggle, not a receivable. If the supporter usually waits for a ping, the ping does not come. One missed month is survivable (burn <$50). Two missed months plus a failed card is how thin companies die. Ops blueprint already said this.

**Silent break:** card-decline email in a personal inbox nobody is checking. Vercel grace then project sleep. Neon suspend. Site 404s. Apps that point at the API show empty shelves. Health-check then mass-hides live rows because origins look down from a dead worker — or the worker is also dead.

### Day 19 — Sat 26 Sep
- If the site is still up: public users notice nothing.
- If the site died yesterday: P1 with no page, no rollback, no status post. War Room and incident tree both say the founder writes public status. Family must not invent an ETA.

### Day 20 — Sun 27 Sep
- Fourth weekly maintenance, if Actions still have a paid GitHub account and working secrets.
- GitHub free/pro identity is the founder’s. If GitHub billing were to fail (not expected in 21 days on a normal plan), Actions stop and the self-healing catalog freezes in the last good state. Frozen-legal is acceptable. Frozen-broken is not — but health-check would have hidden broken rows before death.

### Day 21 — Mon 28 Sep — founder still gone
- Fourth community digest Issue.
- iOS submission is 26 calendar days old. Industry tail for first media apps includes 15–30 day waits, so this can still be “normal queue.” It can also be a dead ticket.
- AdSense window has been open ~13 days past the expected midpoint with no human in Policy Centre.
- Play production still off.
- Filmhub cold.
- CR not filed.
- Form A unsigned.
- `/artifacts` corpus is 3 weeks stale. Dossier catalog counts are a floor plus three weeks of unreviewed discovery.
- Incident Issues, digest Issues, billing Issue: unread pile.
- **What did not happen, and that is good:** no pirate source added, no bot-posted community spam, no Meta spend, no second ad slot, no SDK shoved into the apps, no MG signed.

### Day 22+ (just beyond the test, because it is honest)
- Returning founder faces: store inboxes first, `legal@` second, billing third, Filmhub fourth, formation fifth, community sixth. Not “check the new channels.”
- A 5.2.3 letter left unanswered for 21 days is answered with the rights pack and humility, not with anger about Apple’s queue.
- A Filmhub AE is re-approached as a new introduction, not “sorry I missed your call.”

---

## 1.2 What degrades vs what only looks like it degrades

| Thing | 21-day reality | Damage if ignored |
|---|---|---|
| Live catalog playability | Self-heals. Dead FTA hides. | Low. This is the one system that was designed for absence. |
| VOD embeds | Rotating re-check hides geo/embed fails. | Low. |
| New official episodes (dizi) | Daily updater if gates pass. | Low. Users miss a Thursday episode until restore. |
| New source classes | Blocked by design. | Opportunity cost only. |
| Site uptime | Fine until card / Vercel / Neon / DNS. | **Catastrophic if card fails.** |
| iOS review | Inquiry SLAs missed; rejection unanswered; approval possibly unreleased. | **High. Weeks of queue burned or a listing born unattended.** |
| Play production | Clock may complete; promote button unpressed; tester count may drop under 12 and reset the clock. | High for G2. Invisible. |
| AdSense | Approval or “more info” unread; PIN unread. | High for G1. Invisible. |
| Filmhub | Invitation expires socially. | High for G3. Reversible later, expensive in time. |
| Formation / Form A | Zero progress. | High for G4 and for any contract. |
| `legal@` takedown | Unread. | **Highest tail risk.** A statutory notice plus an untouched catalog is how you get a store strike and a lawyer. |
| Community | Silent. Compliant. | Low-medium. Rooms forget you. |
| SEO / guides | No new `/guides`. Discovery still IndexNows title URLs. | Low in 21 days. |
| Analytics | Collects cookieless. Unread. | None. |
| Docs | Stale the day you leave. | Medium for the next agent session and any partner who is handed a file. |
| GitHub Issues | Pile. | Medium operational debt on return. |
| Angel $200 | May or may not arrive without a ping. | Low for one cycle. |
| Reputation | Quiet product still legal. | Fine — unless `legal@` or App Review goes badly. |

---

# PART 2 — TEN SINGLE POINTS OF FAILURE
Ranked by **damage × likelihood in a 21-day founder blackout starting 8 Sep 2026**. Likelihood is about *this* calendar, not a generic startup.

Each mitigation is something that can be built **now in under two hours**. None of them require a hire. None of them put secrets in git or in this file.

### 1. `legal@whisco.tv` is a single unread mailbox
**Damage:** Extreme (takedown ignored → rights-holder complaint to Apple/Google/AdSense → account-level event).  
**Likelihood in 21 days:** Low-medium. Catalog is official/FTA/PD, but 16k VOD titles means someone, sometime, will write.  
**Mitigation (<2h):**
- Forward `legal@` to a second human inbox (supporter or family) **plus** the founder. Read-only is enough.
- Auto-reply (exact text in Part 3).
- Standing instruction: if the mail contains remove / infringe / lawyer / DMCA / Article 52, the backup does **not** argue. They send the pre-written hide request to the named technical contact (see #6) and reply with the holding text in Part 3.
- Publish on the public takedown page: “If this desk is slow, the title will still be hidden on request.” Hide-first is already doctrine.

### 2. App Store Connect is founder + 2FA only
**Damage:** High this fortnight (submitted 2 Sep; day-7 and day-14 SLAs fall inside the absence).  
**Likelihood of *some* store event in 21 days:** High. First media app. 5.2.3 is the predicted citation.  
**Mitigation (<2h):**
- Add the supporter as an App Store Connect user with **Customer Support / Marketing** *or* Admin if you actually trust them with release — default to **App Manager: no**, **Finance: no**, **Developer: no**. A read-only + Support role can *see* Rejection and can paste a pre-written Resolution Center reply you stored in Notes.
- Save War Room §5.3 and the 5.2.3 template in a draft email and in App Review Information notes *today*.
- Build the 12-page rights pack now, not after the letter. Attach it to the current submission while you are still reachable.
- Write the Apple ID, bundle ID, version/build on the paper break-glass card (Part 3). Not the password.

### 3. Personal card is the entire treasury
**Damage:** Extreme (Vercel sleep + Neon suspend = product disappears; apps become empty shells).  
**Likelihood in 21 days:** Low if the card is in date; **certain** if it expires or the bank flags a foreign SaaS burst.  
**Mitigation (<2h):**
- Put a second card on Vercel and Neon, or raise the backup card with the issuer.
- Turn on billing emails to the supporter address.
- Standing instruction: “If you see Vercel/Neon/Google/Apple decline, pay it. Do not upgrade the plan. Cap: $100 without a conversation.”
- Write vendor list + approximate amounts on the paper card: Vercel Pro ~$20, Neon $5–15, nothing else is due unless Apple anniversary (not this window; next noted Jul/Aug 2027).

### 4. Filmhub invitation has no deputy
**Damage:** High for G3 (own-player video ads stay $0; the one marketplace that already raised a hand goes quiet).  
**Likelihood:** Medium-high. They already invited a call. People who invite calls expect them inside a week.  
**Mitigation (<2h):**
- Send the holding email in Part 3 *before* you vanish, or leave it in drafts on `partnerships@` with the supporter instructed to send it if Filmhub writes.
- One-page “if they propose a call, offer these three slots after 29 Sep; do not negotiate MG/exclusivity/upfront; do not sign.”
- Do not give the supporter authority to accept a licence.

### 5. Google Play tester-count and production promote
**Damage:** High for G2 (14-day clock reset, or eligibility reached and unused).  
**Likelihood:** Medium. 26 testers is a buffer over 12; 21 days of silence still leaks testers.  
**Mitigation (<2h):**
- Add a second Play Console user (supporter) with **Release to production: no**. View-only + reply to review if you must.
- Standing instruction: “Do not press Promote. Do not add testers from random emails. If tester count on the closed-testing page is under 12, email the existing tester list the pre-written ‘please keep the app installed for two more weeks’ note. Do not recruit strangers.”
- Screenshot the current tester count and clock start date onto the break-glass card. **The start date is missing from the dossier — write it down today.**

### 6. No break-glass technical operator
**Damage:** Extreme on a P1 (bad deploy, Neon corrupt, Actions secret dead). Likelihood of a true P1 in 21 days is low; impact is total.  
**Likelihood:** Low.  
**Mitigation (<2h):**
- Name one technical deputy *or explicitly name none* and accept degraded mode (Ops blueprint already allowed this for >48h travel).
- If none: write that sentence in the family runbook so they do not phone a cousin who “knows IPTV.”
- If one: sealed 1Password Emergency Kit / printed recovery codes in an envelope. Deputy gets Vercel + GitHub read + deploy rollback only. Not AdSense. Not bank. Not store publish.
- One page: “Vercel → Project → Deployments → previous Ready → Promote.” That is the only 02:00 action.

### 7. GitHub Actions failures become invisible
**Damage:** Medium-high (health-check stops → dead FTA stay visible or, worse, a failed hide leaves a bad row; discovery stops; snapshots stop).  
**Likelihood:** Low-medium. 30-day success ~100%, but 21 more days is not a guarantee, and nobody is watching greens.  
**Mitigation (<2h):**
- Point workflow failure emails at the supporter. Subject filter: “do nothing if whisco.tv still opens on your phone.”
- Standing instruction: if the site is down AND Actions are red, follow the Vercel rollback page. If the site is up AND Actions are red, leave it. Do not “rerun with debug.”
- Confirm `GITHUB_TOKEN` / repo secrets are not on a 30-day PAT that expires mid-window. If any PAT expires in September, rotate *today* to a longer fine-grained token. **Expiry dates are not in the dossier — check today.**

### 8. AdSense Policy Centre is founder-only
**Damage:** High for G1 (the only near-term revenue surface).  
**Likelihood of a message in this window:** Medium (re-review scheduled mid-Sep).  
**Mitigation (<2h):**
- Add the supporter as an AdSense user with **Standard** or **Read-only** if Google allows; many accounts do not make this easy. Fallback: forward the AdSense email alias.
- Standing instruction: “If Google asks for more information, send the pre-written ‘publisher is travelling, original guides remain at /guides, we return 29 Sep’ note. Do not accept a new ad format. Do not raise ad density. Do not click ‘I have changed my site’ unless the founder already did.”
- Do not give anyone permission to change site-ads.txt or add a network.

### 9. Domain, DNS, and mail routing sit on a personal registrar
**Damage:** High (lose `whisco.tv` or `legal@` routing and the public desk dies).  
**Likelihood in 21 days:** Low unless a renewal is due. Domain live 20 Aug 2026; first-year renewal is not this window if paid annually — **confirm today**.  
**Mitigation (<2h):**
- Turn on registrar auto-renew with the backup card.
- Add a registrar account recovery contact / email the supporter already reads.
- Write nameserver host and “do not change DNS” in the family runbook. The most common family disaster is a helpful nephew “fixing” DNS.

### 10. Formation, Form A, and every contract wait on one signature
**Damage:** High for G4 and for any Filmhub paper that arrives. Likelihood of a CR issuing during absence is zero if it is not already in Sijilat.  
**Likelihood of needing the CR in this window:** Medium (Filmhub).  
**Mitigation (<2h):**
- If you can file the Sijilat name-reservation before you vanish, do that one click. Do not leave a half-notary.
- Sign Form A with the supporter *before* travel so the $200 line is a documented gift, not a myth. Operating Rules already said GO on 6 Sep.
- Standing instruction: “No one signs a licence, a SAFE, a vendor annual prepay, or a store paid-app add-on. The company is unincorporated. A signature now is a personal signature.”

**Honourable mentions (not top 10 only because likelihood or damage is lower in *this* 21-day window):** Apple Developer $99 anniversary (logged as Jul/Aug 2027); Meta ads (off until G1); WhatsApp Channel admin (not the current growth engine); IndexNow key file deletion (only happens if a human deploys a bad public/ wipe); dual-repo backup going out of sync (agent-side).

---

# PART 3 — FOUNDER ABSENCE RUNBOOK
**Audience:** the angel supporter and/or family.  
**Skill required:** can open a website, send an email, pay a bill you can see. No GitHub. No Vercel. No Neon. No “just install this app.”  
**Valid:** 8–28 September 2026, and reusable for any later 21-day gap once the blanks are filled.  
**Authority this runbook grants:** pay existing infra if it is declining; send the holding emails below; hide-request via the named technical deputy if one exists.  
**Authority this runbook does not grant:** publish apps, sign contracts, post in communities, add channels, change ads, change DNS, give anyone the 2FA phone.

Print this part. Put it with the envelope.

---

## 3.1 Who you are and what this company is

Whisco TV is a free legal TV website and app for people living in the Gulf who want channels from home. It is not a paid subscription. It is not a pirate IPTV box business. Ali built it. It runs on a small monthly bill (usually under $50). A supporter sometimes sends $200 to keep that bill paid.

If Ali is unreachable, **your job is to keep the lights on and not improve anything.**

Success after 21 days looks like: whisco.tv still opens, no angry lawyer email went unanswered, no contract was signed, no new app version was uploaded, the card did not bounce.

---

## 3.2 Fill these blanks once (Ali does this before he is away)

| Blank | Write it here in ink |
|---|---|
| Absence start / expected return | |
| Founder reachable-in-emergency via (or “none”) | |
| Supporter name + phone + email | |
| Technical deputy name + phone + email (or write **NONE**) | |
| `legal@whisco.tv` also forwards to | |
| `partnerships@whisco.tv` also forwards to | |
| Personal inbox where Vercel / Neon / Apple / Google / GitHub / registrar send mail | |
| App Store Apple ID number | |
| iOS bundle ID + version + build submitted 2 Sep 2026 | |
| Play Console package name | |
| Closed-testing start date and tester count on the day he left | |
| Filmhub contact name / email if known | |
| Registrar name (where whisco.tv is billed) | |
| Card last-4 that pays Vercel and Neon | |
| Envelope with 1Password Emergency Kit / recovery codes location | |
| “If I am not back by ____, do ____” | |

If a row is blank, treat that system as **do not touch**.

---

## 3.3 Every morning (5 minutes, phone is enough)

1. Open **https://whisco.tv** on your phone, not on Ali’s laptop.
2. Tap one Live channel and one On Demand title. You should see a player or an official YouTube player. If a single title fails, ignore it. If the **whole site** errors, go to §3.6.
3. Open the email inbox that receives `legal@` and the billing aliases.
4. Sort by sender. Deal only with the senders in §3.4. Everything else waits.

Do not open GitHub. Do not open Vercel. Do not “check the server.”

---

## 3.4 What to pay, what to ignore

### Pay, if a decline or invoice is in front of you

| Vendor | Normal amount | What you do |
|---|---|---|
| Vercel | ~$20/month | Pay the existing Pro invoice. Do not buy Enterprise. Do not add seats. |
| Neon | ~$5–15/month | Pay usage. Do not change plan. |
| Domain registrar for whisco.tv | only if a renewal notice | Pay renewal. Do not transfer the domain. Do not change nameservers. |
| Apple Developer | $99/year — **not due in Sep 2026** | Ignore unless a decline email says the account will lapse *this month*. |
| Google Play | nothing monthly | Ignore paid features. |
| Anything “upgrade and save 20%” | — | Ignore. |
| Anything “your ads are ready, add a second slot” | — | Ignore. |
| Crypto, IPTV panels, “premium streams,” Telegram sellers | — | Ignore. This is how the brand dies. |

Cap without Ali: **$100 total extra** in 21 days. If a bill is larger, pay only Vercel + Neon + domain and write the rest down.

Angel $200: send it if that is your existing habit. Do not increase it. Do not post about it.

### Ignore on purpose

- GitHub Issues, including “community-digest” and “billing-reminder.”
- Offers to advertise, guest-post, buy backlinks, or “submit your app to 50 stores.”
- Community groups asking for cricket, IPL, Netflix, Shahid VIP, or a playlist file. The answer is no, and you are not the person to say it.
- Press, investors, “we want to acquire you.” Reply with the holding text in §3.5 if they used a real mailbox; otherwise ignore.
- Requests to add a channel. No one adds channels except Ali.

---

## 3.5 Who to email, and the exact words

Send from `legal@whisco.tv` or `partnerships@whisco.tv` if you have that mailbox on a phone. If you only have forwarding, reply-all from the forwarded copy and keep Ali on CC.

### A. Auto-reply — put this on `legal@` and `partnerships@` before the absence (Ali sets it)

```
Thank you for writing to Whisco TV.

This desk is monitored. If your message is a rights-holder notice
(remove, infringe, licence, DMCA, or a demand letter), we will hide
the named title from public view while it is reviewed. Please include:
the URL on whisco.tv, the title name, and your relationship to the work.

For all other matters, a human will reply after [RETURN DATE].
We do not accept playlist files, paid-app logins, or subscription pitches.

Whisco TV — https://whisco.tv — Bahrain
```

### B. Rights-holder / lawyer / “take this down”

You send two things: (1) the hide request to the technical deputy if one exists, (2) this reply to the sender. If there is **no** technical deputy, you still send (2), and you write the URL in the envelope log so Ali hides it the hour he is back. You do not argue law.

```
Hello,

We have received your notice dated [DATE] regarding [TITLE / URL].

Whisco TV hides first and reviews second. The named title will be
removed from public view as soon as an operator can apply the hide
(same day if an operator is available; otherwise on the founder's
return on [RETURN DATE]). Please treat this as acknowledgement of
receipt, not as a concession of liability.

If you have additional URLs, send them in one list.

Ali Albaharna / authorised desk
legal@whisco.tv
https://whisco.tv
```

If the sender demands a signature, money, or a phone call today: do not sign, do not pay, do not call. Acknowledge and wait.

### C. App Review — only if you were given App Store Connect access and there is a Resolution Center message

If there is **no** message, and Ali left you the day-7 text, send it **once** on or after 9 September 2026, then stop.

```
Hello App Review,

I am requesting a status update on a first submission.

App name: Whisco TV
Apple ID: [APPLE ID]
Bundle ID: [BUNDLE ID]
Version / build: [X.Y] / [N]
Submitted: 2 September 2026
Current status in App Store Connect: [Waiting for Review / In Review]
Platform: iOS

There is no Resolution Center thread yet. Please let us know if any
additional information would help complete the review. Review notes
already describe our official-source / FTA / public-domain sourcing
and the takedown contact legal@whisco.tv. I can attach a short
content-rights PDF on request.

Thank you,
Ali Albaharna
legal@whisco.tv
```

If there **is** a rejection: do not improvise. If Ali attached the War Room 5.2.3 letter and the rights-pack PDF to this envelope, send those. If he did not, reply with one sentence — “We are preparing the documentary evidence requested and will reply by [RETURN DATE]” — and stop. A bad 5.2.3 essay is worse than a late good one.

Do not cancel the submission. Do not upload a new build. Do not mention investors, Filmhub, or Ramadan.

### D. Filmhub (or any rights marketplace)

```
Hello [Name if known; otherwise Hello],

Thank you for the invitation. The founder, Ali Albaharna, is
unreachable until [RETURN DATE] and is the only person who can
discuss terms.

Whisco TV remains interested in a non-exclusive, GCC AVOD,
revenue-share arrangement with no minimum guarantee and no
upfront fee. We will not sign a personal-name licence while
company formation is in progress.

Please propose a call on or after [RETURN DATE].

partnerships@whisco.tv
https://whisco.tv
```

Do not “keep them warm” with catalog boasts or traffic numbers. We have no MAU to quote. Inventing one is a firing offence and you are not staff.

### E. AdSense / Google “we need more information”

```
Hello,

The operator of this publisher account is travelling until
[RETURN DATE]. The site at https://whisco.tv continues to
serve the same original guides and catalogue. No new ad
formats will be added in this period.

We will respond in full on return. Thank you for your patience.

legal@whisco.tv
```

### F. Random vendor / “your website is down” / SEO agency

Ignore. If they are right and the site is down, you will already know from §3.3.

### G. The angel asking “should I still send $200”

```
Yes, same as usual, if you are willing. Nothing has changed.
Please do not send more. Please do not pay a new vendor.
```

---

## 3.6 If whisco.tv does not open

1. Try again on mobile data, not only Wi-Fi. Try https://whisco.tv (type it; do not trust a search ad).
2. If it still fails, email the technical deputy one line: “whisco.tv is down from my phone. Time: [local time]. I have not changed anything.”
3. If there is **no** deputy: pay any Vercel/Neon decline sitting in the billing inbox, wait four hours, try again. Do not buy a new host. Do not hire a recovery service from Twitter/X.
4. Do not post “we are down” on social media. Do not promise a time.
5. Write the time and what you tried on the paper log.

That is the entire incident process for a non-technical backup. The real incident tree (Ops Blueprint §1.2) is founder-only.

---

## 3.7 Community, WhatsApp, App Store reviews, testers

- Do not post in Reddit, Facebook, Expat.com, or Telegram rooms. Automation drafts; only Ali publishes. A helpful relative posting “we will be back soon, 600 channels free” reads as spam and can get the room banned.
- Do not reply to Play or App Store user reviews unless Ali left a one-line template. Default: no reply.
- Do not add Play testers. Do not remove Play testers.
- Do not text the 26 testers from your personal number.

---

## 3.8 Things that sound responsible and are forbidden

- “I’ll just add Crashlytics so we can see if the app is crashing.” That breaks the Data Not Collected label and can sink the store review.
- “I’ll turn on a free CDN / Cloudflare / new DNS.” You can take the domain down.
- “I’ll accept Filmhub’s standard paper so we don’t lose them.” Standard paper often has MGs. Doctrine forbids MGs. Also you would be signing as a person.
- “I’ll publish the Android app; the 14 days must be up.” Promote-to-production is a founder click with a checklist.
- “I’ll let the AI agent ship a fix.” The agent is not allowed to push production without Ali. If you cannot authenticate as Ali, the agent is a chatbot.
- “A man on Telegram has the missing sports channels.” That is the pirate market. We exist to be the opposite.

---

## 3.9 Paper log (copy this onto a sheet)

```
Date:
Site opened? Y/N
legal@ unread count:
Any take-down language? Y/N  (if Y, paste subject + URL on the back)
Any card decline? Y/N  vendor / amount / paid?
Store message? Y/N
Filmhub message? Y/N
What I sent, to whom:
What I did not do:
```

One line per day is enough. Ali will bless you for this and for nothing cleverer.

---

# PART 4 — INVERSE TEST: AI AGENT WORKFLOW GONE 21 DAYS
**Assumption:** GitHub Actions still exist as YAML in the repo. Vercel still deploys if the founder clicks. Neon is up. What is gone is the conversational engineering agent that currently holds operating context, writes the digest, adapts SEO drafts, watches workflow greens, drafts store replies, refreshes the dossier, and implements code.

The founder is a competent operator. He is not a second copy of the agent’s memory. This section is the list of things that today live in **agent context and chat logs**, not in a file a tired person can open at 02:00.

## 4.1 What the founder can still do alone

- Open whisco.tv, App Store Connect, Play Console, AdSense, Filmhub mailbox, Sijilat, `legal@`.
- Send every War Room template (they are in `Whisco_TV_App_Store_Review_War_Room.md`).
- File the W.L.L. from `Whisco_TV_Bahrain_Company_Formation_Guide.md`.
- Sign Form A.
- Hide a title if he knows *how the hide is done in production* (see gap list).
- Pay bills.
- Post community messages from his own head.
- Click Vercel rollback if he knows the project name and which deployment is last-good.

The company does not freeze. It loses its force-multiplier and its memory.

## 4.2 What degrades, day by day, without the agent

**Days 1–3.** Founder spends the timebox the agent used to spend: 15-min exception queue becomes a 90-min wander through Vercel, GitHub Actions, Neon, and four mailboxes. Uptime emails still arrive. Nobody pre-triages P4 vs P1. Risk: he treats a monitor blip as a deploy (the exact failure the incident tree was written to prevent).

**Days 4–7.** Monday/Thursday discovery still runs. Founder does not review the 25-new-channel cap output unless he knows which Action log to open. A bad official-looking source that passed automation would normally be a `REVIEW` the agent would surface. Now it only exists as a quiet catalog row. Daily dizi updater still runs. Sunday digest Issue still opens — as raw markdown the founder must rewrite from scratch if he wants to post. SEO cadence (~2 guides/week target) drops to zero; the pack exists (`Whisco_TV_SEO_Content_Pack.md`) but adapting a draft onto `/guides` in Next.js is agent work.

**Days 8–14.** AdSense window and iOS day-14 inquiry still need a human; those are founder jobs and survive. What slips: rights-pack PDF production if it was not already built; screenshot/ASO refresh; Arabic lock-up wiring from `Whisco_TV_Arabic_Localization_Pack.md`; Filmhub ingest pipeline “stand up in a day” — the blueprint says it is designed, the steps are not a founder-click runbook. Weekly stats note stops unless he copies the scorecard template from Ops Blueprint §1.8 by hand. Dossier drift accelerates.

**Days 15–21.** Billing Issue on 25 Sep opens with an empty table; agent used to pre-fill last month’s numbers. Founder can still pay. Catalog snapshots keep committing *if the Action is healthy*; if the Action fails, the founder must restore from the last git snapshot — procedure named, not written as commands he has rehearsed without the agent. Any production bug that needs a code change waits. App binary crash in TestFlight waits. No v1.1, no Bunny ingest, no new workflow.

**What does not degrade:** doctrines. The founder owns those. The risk is operational fatigue, not a sudden urge to add an m3u.

## 4.3 Highest-impact knowledge that currently lives only in agent context

These are the pages that must be written *out of chat* and into `/artifacts` or the repo README. Until they exist, the inverse outage is a real outage.

| # | Knowledge | Why it is not in the dossier today | Founder-alone note to write now (<2h each, or accept the gap) |
|---|---|---|---|
| 1 | Exact GitHub repo list, default branch, which repo Actions live in (`iptv-app` is named; dual-repo backup is named, second remote is not) | Blueprint says “dual-repo,” not URLs | One page: remotes, who has access, how to see workflow greens |
| 2 | How to hide / un-hide a title or channel in production (table, column, admin path, or SQL) | Doctrine says hide-first; no operator UI is documented | Six-line cheat sheet. This is the takedown desk. |
| 3 | How to read a health-check failure (what the Issue body means, where logs live) | Agent “verifies greens each session” | Screenshot + “red does not mean deploy” |
| 4 | Vercel project name, last-good deployment identification, rollback clicks | Incident tree assumes he knows | Three screenshots |
| 5 | Neon: project, branch, how to restore last nightly snapshot to a *scratch* DB, connection env var names (not values) | DR runbook exists at policy level | Commands or console clicks. Rehearse once. |
| 6 | The 16 vetted official VOD source channels, as a list | Named as a number, not as a list, in every doc we used | Paste the list into the dossier. If the agent is gone, discovery cannot be extended and cannot be audited. |
| 7 | Sanctions / political-exclusion list and where it lives in code | Policy §1.6 referenced, not excerpted here | File path + “do not edit without a second read” |
| 8 | IndexNow key file path under `public/` and the rule **never delete it** | Operating Rules mention it in passing | One line in the deploy checklist |
| 9 | App binaries: Expo profile names, version-code bump, store listing screenshots folder, privacy-label confirmation steps | App release checklist is prose; the buttons are in the agent’s last session | Founder can follow WT-OPS-APP-001 only if the repo path for `eas.json` / store assets is written |
| 10 | Where catalog snapshots land in git and the rebuild-from-zero command | Dossier claims “~1 hour” and “documented” — the command list is not in the files this test was allowed to use | If that runbook is in the repo, link it from the dossier. If it is only in chat, it does not exist. |
| 11 | Email / DNS map: which host serves `legal@`, `partnerships@`, MX, SPF | Policy publishes the addresses; routing is tribal knowledge | One table |
| 12 | Filmhub application login location, application ID, who phoned, what was said | “Phone-call invitation received” is a sentence, not a file note | Half-page contact log |
| 13 | AdSense publisher ID, site-ads.txt location, which domains are claimed | Remediation history is in the dossier; the console path is not | One paragraph |
| 14 | Play closed-testing **start date**, tester source list, how to message testers in-console | Clock is “running”; dates missing | Write the date. This test could not compute the end day. |
| 15 | Apple Team ID, bundle ID, submission ID of 2 Sep, release-type (auto vs manual) | War Room templates have placeholders | Fill the placeholders in a private appendix, not in git |
| 16 | Community accounts: which rooms he is already inside, under which name, WhatsApp Channel admin | 58-room map exists; login identities do not | A private list. Without it he will double-join or post as a stranger. |
| 17 | The live exception queue format the agent uses each session | Blueprint defines labels (`P1`, `LEGAL`, `SPEND`) | A pinned GitHub Issue template so the founder files the same way |
| 18 | What changed since 5 Sep that never hit the v1.0 dossier (v1.1 already moved channels 581→585 and VOD 15,696→16,800+) | Two dossier files now coexist | Pick one dossier, kill the other, date every catalog dump |
| 19 | Prompt / standing instructions the agent is running under (Operating Rules v2 + this DR + “do not invent MAU”) | They live in chat and `AGENTS.md` fragments | A single `OPERATOR.md` in the repo that a replacement agent can be pointed at |
| 20 | How SEO drafts become `/guides` pages (route, front-matter, noindex rules, sitemap) | Pack exists; publish path is agent work | A 15-line publish checklist |

Items 2, 5, 6, 10, 14, 15, 19 are the ones that turn a 21-day agent outage from “slow” into “founder cannot execute a takedown or a restore.” Do those first.

## 4.4 Founder-alone 21-day operating cadence (if the agent is dark)

Steal this and pin it. It replaces the agent’s “every session” loop.

**Daily (20–30 min, not 15)**  
Open whisco.tv. Open GitHub Actions for `iptv-app`. If red and site is up: note it, do not redeploy. If red and site is down: Vercel rollback, then stop. Open `legal@`. Open App Store Connect + Play + AdSense. File one line in a running log.

**Mon / Thu (15 min)**  
Open the discovery Action log. Count new visible rows. If anything looks unofficial, hide it with the cheat sheet. Do not add a source domain.

**Sunday (45 min)**  
Write your own community opener or skip the week. Skipping is legal. Bot-posting is not. Read weekly-maintenance output if you can find it.

**25th**  
Fill the billing Issue yourself from the vendor table in this document.

**Event days in *this* window**  
9 Sep: iOS inquiry if silent.  
15 Sep: AdSense Policy Centre glance.  
16 Sep: Play clock / tester count.  
23 Sep: iOS second contact only if still silent.

**Do not attempt in 21 days without the agent**  
New features, Bunny ingest, TV-app binaries, privacy-label changes, schema migrations, “while I’m here I’ll refactor.” Freeze the code. Operate the desk.

## 4.5 Replacement-agent brief (so a future session is not a blank mind)

If a new agent instance is all you have, point it at these files in this order and nowhere else for the first hour:

1. `Whisco_TV_Operating_Rules_v2.md` — measurement and spend law  
2. This file — failure modes  
3. `Whisco_TV_Company_Dossier.md` (after you merge v1.0/v1.1)  
4. `Whisco_TV_Operations_Org_AI_Blueprint.md` — runbooks  
5. `Whisco_TV_App_Store_Review_War_Room.md` — store  
6. `Whisco_TV_Policy_Suite.md` — legality  
7. `AGENTS.md` — voice and constraints  

Tell it: projected MAU = 0; video revenue = $0 until a signed GCC licence plays in our player; do not invent traffic; do not post; do not spend; do not add a source domain; hide-first; max one ad; Data Not Collected; GitHub `burn8887`; Bahrain; unincorporated.

If those files and that paragraph are all a new agent gets, it can be useful on day one. If the hide-SQL and the 16-source list are still only in the old chat, it will hallucinate both.

---

# PART 5 — FINDINGS AND THE WORK THAT IS ACTUALLY DUE

This test used only the written corpus. It is therefore also an audit of that corpus.

1. **The product can idle legally for 21 days.** Health-check + hide-on-fail + closed source list + human-gated publish are the right architecture for a solo founder. That part is real.
2. **The company cannot idle.** G1–G4 are all in motion in September 2026. Three of the four (AdSense, stores, Filmhub) have external clocks that do not pause.
3. **There is no deputy.** Ops Blueprint § event-driven list already required a named backup or an explicit accept-degraded-mode for >48h travel. That sentence was never executed.
4. **Dates that decision-making needs are not written down:** Play 14-day start, Apple release-type, Apple IDs, Filmhub interlocutor, registrar, card cycles, PAT expiries, the 16 source channels. A stress test that cannot name the Play clock end-date is the test telling you the dossier is incomplete.
5. **Two dossiers exist** (`Whisco_TV_Company_Dossier.md` dated 5 Sep and `Whisco_TV_Company_Dossier (1).md` dated 7 Sep) with different catalog counts. Staleness started before any absence.
6. **Rebuild-from-zero is claimed, not deposited in the files this test could read.** Treat that as a missing DR artefact, not as a solved problem.
7. **The family runbook cannot include secrets, and without a deputy it also cannot execute a hide.** Acknowledgement plus delay is the only honest takedown posture in a true blackout. That is acceptable for 48 hours. It is ugly at day 21.
8. **Community silence is the correct failure.** Anyone “keeping engagement warm” during an absence violates doctrine and risks the rooms. Write that on the fridge.
9. **The inverse test is the more likely disaster.** Conversational agents reset. Founders get flu. The hide cheat-sheet, the 16-source list, the snapshot restore commands, and a single `OPERATOR.md` are worth more than another strategy deck.
10. **Do the <2h mitigations before the next time Ali is on an aeroplane.** Not after.

**Minimum kit to assemble this week (half a day, not a project)**

- [ ] This runbook printed + blanks filled  
- [ ] `legal@` / `partnerships@` auto-reply + forward  
- [ ] App Review rights pack attached to the live iOS submission  
- [ ] Day-7 inquiry sitting in drafts  
- [ ] Filmhub holding mail in drafts  
- [ ] Second card or billing-email forward on Vercel + Neon  
- [ ] Play tester count + clock start date written down  
- [ ] Apple IDs and release-type written down (private)  
- [ ] Hide-title cheat sheet  
- [ ] 16 official source channels listed in the dossier  
- [ ] One dossier, one date  
- [ ] `OPERATOR.md` in the repo  
- [ ] Named deputy or the word NONE in ink  
- [ ] Form A signed  
- [ ] Envelope

Until those boxes are ticked, Whisco TV’s disaster recovery is a well-written wish.

---

*End of stress test. Companion files this document assumes: Operating Rules v2, Ops/Org/AI Blueprint, App Store Review War Room, Policy Suite v2, Partnership one-pager, Company Dossier, Bahrain formation guide, Data-Room Checklist. Classification: internal. Not legal advice. Not a delegation of signing authority.*
