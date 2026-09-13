# THE FOUNDER'S AGENT OPERATING GUIDE
### How to run AI agents that build real products without losing your work, your money, or the truth
**v1.0 · September 2026 · Distilled from the Whisco TV build — battle-tested, not theoretical. Hand this to any agent on day one of any new venture.**

---

# PART I — THE FOUNDATIONS

## 1. GitHub is Truth (the first law)

Agent chats die. Workspaces reset. Context windows fill. **The repository is the only memory that survives everything.**

**Rules:**
1. Everything of value lives in a git repo pushed to a remote: code, business docs, decisions, prompts, evidence, assets. If it matters, it's committed. If it's not committed, it doesn't exist.
2. **Every session starts with a truth-sync:** compare local HEAD vs remote. If local is behind → `git reset --hard origin/main`. Never trust a workspace over the remote.
3. **Every milestone ends with a push.** The agent updates the running log (see §3), commits, pushes — before celebrating, before moving on. "Push, then party."
4. Work-in-progress that can't ship yet goes on a **named branch**, pushed. Staging on a branch survived our site-freeze week; uncommitted work would not have survived one workspace reset.
5. The repo may be public (free CI minutes, simpler tooling) **only if** secrets never touch it — see §5. Decide visibility deliberately; know what changes if you flip it (we relied on free unlimited Actions minutes for a public repo — flipping to private would have silently killed our cron monitoring mid-month).

## 2. Kill Optimism (the honesty doctrine)

AI agents drift toward pleasing you. Make honesty structurally mandatory:

1. **No invented numbers. Ever.** A number appears only with a source: an API response, a database query, a dated document.
2. **[EST] tags** on every estimate, projection, or judgment call. Readers must always know which numbers are measured and which are guessed.
3. **"NOT IN DATA" beats guessing.** An agent that says "I don't know" is more valuable than one that fills gaps confidently.
4. **Floors for public claims:** public copy uses rounded-DOWN figures ("600+ channels"), never exact counts. Exact counts change daily; stale screenshots become honesty liabilities. Exact numbers live in internal reports, always dated.
5. **The optimistic scenario does not exist for external readers.** Investors, partners, and reviewers see conservative + realistic bands only. Anything better must be earned by measured data first.
6. **Verify claims made by anyone — including other AIs.** When a bot reported video runtimes, the agent checked them against production before passing them on. Bots inherit the doctrine; the agent enforces it.
7. Reward honest ceilings. Tell your agent explicitly: "the lower band is what I want to hear first." Then it will actually tell you.

## 3. The Running Log (institutional memory)

Maintain ONE chronological handover document in the repo (`PROJECT_HANDOVER.md`):
- Updated after **every milestone** — what happened, what was verified, what's open, what's next
- Written so a total stranger (or the next agent) can resume operations from it alone
- Paired with a **Disaster Recovery doc**: where every credential lives, how every system restarts, what to do if the founder or the agent disappears

This is what makes agent succession a 10-minute ceremony instead of an archaeology dig.

## 4. Gates and Tiers (money discipline)

Enthusiasm spends money; gates make sure spending follows *reality*:

1. Define 3–5 **binary gates** — objective, externally-verifiable events (first ad payment received; both apps publicly installable; signed licence with files live; company registration issued). A gate is OPEN or CLOSED; there is no "almost".
2. **Spending tiers unlock by gates, not by calendar or budget availability.** Authorized budget ≠ spent budget. Our rule: baseline burn ~$50/mo at zero gates; each opened gate unlocks the next tier.
3. **Hard approval thresholds:** any single spend > $X or recurring > $Y/mo requires explicit founder confirmation in chat before commit. No exceptions, even inside an authorized budget.
4. A **never-fund list**: categories forbidden regardless of budget (for us: paid traffic before monetization exists, content minimum-guarantees, spam ad networks). Write yours down before temptation arrives.
5. Monthly billing check as an automated reminder (cron → Issue on the 25th). The founder confirms actual invoice amounts; discrepancies become tracked issues, not vague worries.

## 5. Secrets Doctrine (the property you can't re-earn)

1. Secrets live in exactly TWO places: the founder's password manager, and the agent's designated vault directory (outside the repo, e.g. `/home/user/.keys/`). Nowhere else — ever.
2. **NEVER commit secrets.** Modern platforms auto-revoke leaked tokens — a committed secret is a broken secret plus an incident.
3. Push pattern for authenticated remotes: inject the token into the remote URL for the push, then immediately reset the URL to tokenless. The token never persists in git config (workspace snapshots may capture config).
4. CI secrets go in the platform's encrypted secret store (e.g. GitHub Actions secrets, set via the encrypted API) — never in workflow files.
5. **Advisor AIs never receive secrets.** Not passwords, not tokens, not raw billing statements, not internal recovery docs. Define sanitization tiers (see §9) and hold them absolutely. If a bot is ever pasted a password, its standing instruction is to refuse it and demand rotation.
6. Rotation list with owners and dates in the DR doc. The oldest unrotated credential is your standing risk item — name it in every audit.
7. Identity honesty is a security control too: all outreach signs the founder's real name. Fake personas are a brand time-bomb (we learned this the day a draft went out signed with an invented name — caught, corrected, rule locked same day).

# PART II — RUNNING THE MACHINE

## 6. Automate the Machine, Not the Judgment

The division that works:
- **Machines do:** monitoring (uptime, health checks), verification (link checking, geo-availability, schema audits), drafting inputs, compliance pre-checks, filing issues, reminders
- **Humans do:** publishing to third-party spaces, approving spend, signing anything, final quality judgment
- **Agents do:** everything in between — code, deploys, API calls, document production — under the doctrines

**The robo-compliance pattern (our best trick):** put the *mechanical* rules into code that runs BEFORE content reaches anyone. Our weekly digest cron scrubs forbidden words, enforces number floors, auto-inserts disclosure lines, and verifies every link returns HTTP 200 — so the human reviewers spend their attention on judgment, not typo-hunting. Any rule you can regex is a rule you should never enforce manually again.

**The self-healing catalog pattern:** every automated pipeline needs its reverse gear. Our discovery crons ADD content; our health-check crons REMOVE anything that dies, automatically. Systems that only grow accumulate rot. Prove your automation removes things — that fact even became evidence in our App Store defense.

**Incident triage automation:** a workflow that fires when any other workflow fails, applies known-cause rules, checks system health, and files deduplicated issues. The machine notices its own problems before the founder does.

## 7. The Approval Pipeline (nothing ships unreviewed)

Universal flow, whatever the deliverable:

```
DRAFT (agent or bot) → VERIFY (agent: typecheck / fact-check / link-check)
→ GATE (reviewer: APPROVE / REVISE / REJECT with reasons)
→ FOUNDER SIGN-OFF (for anything public, spent, or signed)
→ EXECUTE → LOG THE OUTCOME
```

- **The contractor pattern:** when an external AI (or human) delivers work, the agent verifies it UNTOUCHED first — typecheck exactly what was delivered, then review, then integrate only what passes. Never silently fix a contractor's work; if you must deviate, record why.
- Verdicts are structured: APPROVE / REVISE (with exact edits) / REJECT (with reason). "Looks fine" is not a verdict.
- **A SKIP recommendation is valued output.** Reviewers who only ever approve are decorations. Build the culture where "don't publish this week" wins praise.

## 8. Freeze Windows

Before any external review (app store, ad network, investor diligence): **declare a freeze** — no structural changes to the surface under review. Data fixes, docs, and workflow files stay allowed; new URLs, redesigns, and risky deploys wait. Stage everything on branches during the freeze, merge the day after. Reviewers want a stable target; give them one.

## 9. The AI Org Chart (multiple AIs without chaos)

When one agent becomes several AIs, structure or chaos — choose structure:

1. **One executor.** Exactly one agent touches production, money, and credentials. All other AIs are advisors: they draft, review, analyze — they never execute.
2. **Named roles with charters.** Each AI gets a written role card: what it owns, what it may never do, who it reports to. (Ours: a Team-Leader bot gating everything, a Distribution bot drafting posts, a Design-Lead bot owning visual language.)
3. **A single gatekeeper.** One AI (or human) is the approval gate and ledger-keeper the founder briefs with. Everything flows through it; it can reject anyone's work including the founder's own drafts when they break the rules — empower that explicitly.
4. **Sanitization tiers.** A written table of which document classes each AI may receive. Full-trust (executor only): credentials, DR, internals. Business tier: dossiers, playbooks, public materials. Never let convenience erode the tiers.
5. **The founder is the message bus.** Chat AIs can't talk to each other; every hop costs founder attention. Minimize hops: make every deliverable copy-ready for verbatim forwarding ("paste this to X" with the full block included — never "see the document above").
6. **Test the chain of command early.** Send an assignment to the wrong bot on purpose; the gatekeeper should bounce it. Ours did — that's how we knew the org was real.
7. **Doc-rot is the #1 failure mode of advisor AIs.** They know only what you last uploaded. Version your context packs, regenerate them on every major change, and make "re-upload to the bots" a standing post-milestone step. Cheap insurance: quiz a bot (15 questions with an answer key) after any big update.

## 10. Agent Succession (chats die; the company doesn't)

1. **Write the takeover brief BEFORE you need it.** Role, bootstrap commands, credential locations, current state, plans, doctrines, watch list, loose ends, first-session checklist. Commit it to the repo.
2. **Hand over at milestones, not at collapse.** Watch for the signals: compaction notices, memory slips, repeated questions, degraded precision. Two or more = plan succession now.
3. Succession ceremony: new chat → clone repo → restore keys → read brief → run first-session checklist → **verify the hands work** (real API results, not just talk).
4. Never feed a successor the raw transcript of the old chat — it burns context and teaches stale facts. The distilled docs are the memory; live APIs are the truth.
5. Keep the old chat's final state exportable (founder downloads workspace + saves transcript) as forensic backup — belt and braces, never the primary.

# PART III — PRODUCT & CONDUCT RULES

## 11. Legality as Strategy (not compliance theater)

If your product touches content, rights, or regulated anything:
1. **Write the content doctrine before the first item enters the catalog:** exactly which legal bases are acceptable (for us: rights-holder-enabled embeds, free-to-air, public domain) and which are forbidden (everything else). Enforce it in code — an exclusion regex in the ingestion pipeline beats a policy PDF nobody reads.
2. **Verification before visibility:** every item passes automated legal/availability checks before users can see it, and re-checks forever after.
3. **Honesty as marketing:** say plainly what you DON'T have ("live sports needs a paid app — no free service can do that legally, including us"). It's the one claim competitors who lie cannot copy, and users feel the difference.
4. When a platform reviewer (Apple, Google, ad network) challenges you: respond with **evidence, not essays** — named exhibits, verifiable URLs, quoted terms of service, an honest-limitation statement, and a reviewer path ("tap here, see this"). Our rejection response went from architecture-essay to exhibit-schedule after adversarial review — that upgrade is the difference between arguing and demonstrating.
5. **Adversarial cross-check before any high-stakes submission:** have a second AI attack your response as a hostile reviewer before the real one does. It found our weaknesses every time.

## 12. Brand & Voice Doctrine

1. Write the voice rules down the moment you notice them: registers (professional company voice vs. mascot/personality voice), where each lives, how they're marked. Never mix them in one sentence.
2. **Cap your defensive claims.** If your product is free/fast/private, say it once or twice per page, then let the product speak. Over-claiming reads as insecurity (our first user-testing round caught exactly this).
3. All public numbers follow the floors rule (§2.4).
4. Assume every public surface is investor-visible at all times. The polish bar is "would this embarrass us in a data room?"
5. Design authority can be delegated to an AI (ours was) — deployment authority cannot. Designs are proposals until the pipeline (§7) passes them.

## 13. Community Conduct (growth without poison)

1. **Bots draft, humans post** in any space you don't own. Bot accounts in third-party communities are a permanent-reputation time bomb.
2. Research rooms before entering: a mapped list with rules, real user complaints (their words), and per-room risk ratings. Fit your message to their stated pain, not your feature list.
3. **Disclosure always.** "I built this — declared interest." Every mention, every platform, no exceptions.
4. Frequency caps (e.g., max 1 mention per room per week). One helpful answer beats five promos.
5. **Permission-first for high-risk rooms:** message the moderators BEFORE posting. It converts removal-risk into invited posts. (Founder-invented pattern; adopted as standard.)
6. Verify every link before it enters a draft. Machine job (§6).
7. Log outcomes honestly — unmeasured results are "NOT IN DATA", not "great engagement."

## 14. Feedback Loops

1. **Free user-testing first:** friends and family in the target segment before spending anything on research. Our first round independently confirmed the design AI's diagnosis and caught real content errors.
2. Every qualitative complaint becomes either a **doctrine** (if it's a rule) or a **cron** (if a machine can catch it). Visitors found content errors → a weekly automated QA sweep now exists → the next visitor can't find them.
3. New ideas pass a standing filter before earning work (ours: pain ≥1M people × payment event ≥$1/user/yr × a distribution wedge we own). Ideas that fail the filter get filed, not built.
4. Calendar triggers for future work live in the repo and the running log (campaign freezes, seasonal pushes, data-recalibration dates) — the machine remembers so the founder doesn't have to.

---

# THE ONE-PAGE VERSION (pin this)

1. **GitHub is truth.** Session starts with sync; milestone ends with push.
2. **No invented numbers.** [EST] or NOT IN DATA. Floors in public.
3. **One running log + one DR doc**, always current, always pushed.
4. **Gates open tiers.** Money follows reality, never enthusiasm. Thresholds need founder sign-off.
5. **Secrets in two places only.** Never in the repo, never in advisor chats.
6. **Machines verify, humans publish, agents execute** — one executor, everyone else advises.
7. **Draft → verify → gate → sign-off → execute → log.** SKIP is valued output.
8. **Freeze before reviews.** Stage on branches.
9. **Charters + sanitization tiers** for every AI in the org. Founder is the message bus — everything copy-ready.
10. **Write the takeover brief before you need it.** Hand over at milestones, not collapses.
11. **Legality enforced in code, honesty as marketing, evidence not essays.**
12. **Adversarial review before high-stakes submissions.**
13. **Disclosure always, bots never post in others' rooms, permission-first when risk is high.**
14. **Every complaint becomes a doctrine or a cron.**

*A company run this way survives any individual chat, agent, model, or bad week. The docs are the memory, the repo is the truth, the gates are the discipline — and the founder is always in command.* 🐾
