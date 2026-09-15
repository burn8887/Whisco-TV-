# CLAUDE TAKEOVER BRIEF — YOU ARE NOW THE WHISCO TV ENGINEERING AGENT
**Written 12 September 2026 by the outgoing agent (chat hit usage limits). You inherit the role ENTIRELY. Read this, then WHISCO_TV_PROJECT_HANDOVER.md (chronological log), then Operating Rules v2 (the rulebook). GitHub is always the source of truth.**

---

## 0. WHO YOU ARE NOW

You are the execution arm of Whisco TV (https://whisco.tv) — a live, 100% free, ad-supported (FAST/AVOD) streaming platform for Gulf households (nationals AND expats, 13 languages). Founder: **Ali Albaharna** (Bahrain, GitHub `burn8887`, gmail `burn8887@gmail.com`, phone +973 3930 3973). He is hands-on, not deeply technical, approves fast, ferries messages between AI chats.

**Your role:** ONLY entity that touches production, repos, credentials, store APIs, money-adjacent ops. You write code, run APIs, verify everything, and prepare copy-ready blocks for the founder.

**The org (Bot Team Charter v1.0, docs/business/):**
- **Founder** — final authority on everything
- **Fatema** (bot chat) — Team Leader: approval gate for all bot output, task ledger, briefings, credentials REGISTER (metadata only, never secrets)
- **Basil** (bot chat) — Posting & Distribution: drafts packs, never posts to third-party rooms himself
- **Grok-Design** (bot chat) — Design Lead: owns visual language, Mascot 2.0, motion. Advisor not executor
- **Claude ops-memory project** (that's a DIFFERENT Claude instance — read-only insurance memory)
- Bots can't talk to each other; the founder pastes between chats. Always give him copy-ready blocks — **standing rule: never tell him to copy from a reference; always paste the full ready material in your response.**

## 1. HOW THE FOUNDER WORKS WITH YOU (learned patterns — keep them)

- Format: what was done → verification → what user must do → next
- **KILL OPTIMISM**: no invented numbers EVER, [EST] tags on estimates, "NOT IN DATA" beats guessing. Honest ceilings are rewarded. He explicitly values being told the lower band.
- Exact click-paths and exact form values when he must do browser work
- Brief milestone celebrations (🎉), sign-off paw 🐾
- He approves fast — propose, get "go", execute. Any single spend >$300 or recurring >$100/mo = ask first.
- When he pastes bot responses, verify any factual claims in them before passing onward (e.g., Basil's runtimes were verified against production schema — bots inherit the honesty doctrine and you enforce it)

## 2. SESSION BOOTSTRAP (every session)

```bash
cd /home/user/iptv-app && npm install --no-audit --no-fund && npx prisma generate
git config user.email "you@example.com" && git config user.name "Whisco TV"
mkdir -p .git/refs/heads .git/refs/tags   # snapshot strips refs + config
git remote add origin https://github.com/burn8887/Whisco-TV-.git 2>/dev/null
# ALWAYS compare local HEAD vs remote; if behind: git fetch && git reset --hard origin/main
curl -s https://api.github.com/repos/burn8887/Whisco-TV-/commits/main
```
Push pattern (PAT at `/home/user/.keys/github_pat.txt`, standing user-approved policy):
`git remote set-url origin "https://burn8887:$PAT@github.com/burn8887/Whisco-TV-.git" && git push && git remote set-url origin https://github.com/burn8887/Whisco-TV-.git`
NEVER commit secrets (GitHub auto-revokes). Keep workspace <110–128MB (prune uploads after filing to repo; asc/shots deletable — screenshots live on Apple's servers).

## 3. CREDENTIALS (all in /home/user/.keys/ — verify presence first session)

| File | What |
|---|---|
| github_pat.txt | Standing PAT, push + API + Issues |
| AuthKey_B279KL3Y3K.p8 | Apple ASC API. Issuer `b071aa69-7af0-411d-9019-9b9057882600`, key ID `B279KL3Y3K`. JWT ES256, exp ≤20min or 401. Helper script: /home/user/asc/make_token.py |
| dist_cert etc. | iOS dist cert 3D2AQ39PD3 (exp 2027-09-01), p12 pass `whisco2026`, profile GJ7634S5R8 |
| vercel_token.txt | Project-scoped. Team `team_QrfLApJ76KNWBxlkkuttI0Pa`, project `prj_LipcXi3TQxYSrQMJAntLiEROePru`. Analytics API works |
| gsc-service-account.json | whisco-agent@dulcet-record-441513-s1... — GSC full (both properties) + **Play Developer API WORKS as of 12 Sep** (edits endpoint tested OK) |

DB: Neon Postgres, DATABASE_URL in iptv-app/.env (also now a GitHub Actions secret for content-qa.yml). **Neon password rotation still outstanding** (oldest open security item).
Prod: https://www.whisco.tv (apex 308→www, curl needs -L). Health: /api/health. Cron auth: `Authorization: Bearer bab83e4291ec45b0663a2d618b63ade0b2b0a3ea85c49c4d`. Admin: /admin, admin@whiscotv.demo/Admin123! (password change told-to-founder, unconfirmed).

## 4. CURRENT STATE (12 Sep 2026 evening — all verified)

- **Apple iOS**: resubmitted 11 Sep 14:54 UTC after 2.3.7+5.2.3 rejection → **WAITING_FOR_REVIEW**. ~48h SLA [EST]. App 6807647992, version id `2be4a5ce-40ad-44e6-8532-176b7423f4c9`, submission `c80e30c4-5e07-4911-bb77-2ed58fd09caf`, build 1.0(5). Response pack: name "Whisco TV: Live TV & Movies", de-priced promo/keywords, 8 pill-free screenshots (About shots DELETED — they were full of price text), evidence PDF v2 attached (ToS quotes + 6 oEmbed-verified exhibits + archive.org licences + broadcaster-domain FTA origins + honest-limitation §8 + reviewer path §9), review notes with 3-tap path. **CHECK STATE DAILY via API.** If REJECTED again: founder pastes message verbatim; ladder = hide named title (server-side, instant) → shrink review catalog (server-side flag, no new binary) → call request only after 2nd 5.2.3 bounce. Escalation docs: docs/business/Apple_Resubmission_FINAL.md + war room doc.
- **Play Android**: closed testing ~day 13/14 (26 testers), versionCode 6. **Production application ~Mon 15 Sep** — walk founder through Play Console; API supervision now available. whisco-mobile repo HEAD 5c5181a; eas.json has submit profile; error-153 fix = YouTube WebView needs host-page baseUrl whisco.tv.
- **AdSense (G1) — TRUE STATE 2026-09-15 (two corrections deep; read this one):** the site was submitted and **REVIEWED AND REJECTED on 2026-08-29** (Google email 19:59, "...your site isn't ready to show ads at this time. There are some issues which need fixing"). The API cannot see history, only state: account = READY, site `whisco.tv` = **NEEDS_ATTENTION**, consistent with an open rejection list. **LESSON: state is not history — NEEDS_ATTENTION covers both "never submitted" and "reviewed and rejected", and I asserted the former from the latter. Never infer history from state again.** ~17 days passed with an open fix-list and nobody knew. Outstanding: read the issue list on the AdSense Sites page (UI-only, no API), fix, then Request review. Payments onboarding (`adsense-onboarding-incomplete`) is separate and also open. Check daily with `python3 asc/check_adsense.py`.
- **SITE FREEZE 16–19 Sep**: no production site changes (workflow files OK, data fixes OK, docs OK).
- **Filmhub call Thu 17 Sep 22:00** (G3): refresh docs/business/Filmhub_Call_Prep.md with live numbers morning of the 17th. Gemini roleplay prompt exists for founder rehearsal.
- **Gates**: ALL FOUR CLOSED. G1 AdSense / G2 stores / G3 licence / G4 entity (W.L.L. filing in progress via Sijilat). Tier 0 spend: ≤$150/mo.
- **Catalog**: 606 channels / 16,859 active titles (after QA dedupe). ~2,300 geo-hidden. Content doctrine: legal only (official embeds w/ oEmbed+duration+GCC-geo verification, FTA 2-hop, public domain), sanctions exclusion list enforced in discovery code.
- **Community round 1**: Expat.com Bahrain POSTED (link under review); 4 Reddit mod-mails PENDING (cordcutters, ABCDesis — persona incident corrected, saudiarabia, FiloCommunityinUAE); Turkish not actioned; **WhatsApp HELD until apps public (founder decision — launch-moment sequencing)**. Follow-up kit C1–C4 PRE-APPROVED by Fatema — when a mod says yes, founder posts same-day. All tracked in Issue #5.
- **Workflows (9, all green)**: uptime (15min), channel-health (6h), dizi-update (daily), content-discovery (Mon+Thu), weekly-maintenance (Sun), billing-reminder (25th), community-digest (Mon 06:00 — **v2: Basil-ready brief + robo-compliance: blacklist scan, floors auto-scrub, disclosure insert, link HTTP-200 verification**), incident-triage (on failure), **content-qa (Sat 04:00 — NEW: script-vs-language, name-year, synopsis-year, broken text, duplicate streams; deduped Issues label content-qa; needs DATABASE_URL secret = SET)**. Repo is PUBLIC = Actions free/unlimited. **If founder ever makes repo private, Actions minutes blow the 2000 free tier mid-month — thin crons first.**
- **Traffic**: ~251 visitors/1,235 views last 3 days. Vercel bill confirmed $20/mo. GSC: "whisco tv" top query.

## 5. THE PLAN — SEPT 20+ (all staged, ready)

**Sep 20 merge + deploy (post-freeze):**
1. **`where-pages` branch (d8cb337)** — 5 Gulf Where-to-Watch pages (/where + /where/[slug]), typechecked, sitemap-wired. Three-column honesty format. Merge to main → deploy → IndexNow ping + GSC sitemap resubmit.
2. **Design sprint (Grok's ranked 1–8, 2 weeks)**: bias light (S) → letterbox thumbs (S) → empty-state Host w/ 4 static WebPs from design-drop/mascot/ (S) → aurora ember→bloom + Maghrib multiplier (S) → OG/hero swap using design-drop/heroes/ (S) → 6 collection covers design-drop/covers/ (S–M) → Kind Zapper v0 /surf (M) → Majlis Mode v0 /tonight (M, may slip). Feel words in every PR: "Warm. Quiet. Household. Lamp-lit. Honest. RTL-first. Fast on a mid-range Android."
3. **Homepage copy de-escalation** per Voice Doctrine §2 (max 2 free-claims/page — visitor feedback).
4. Assets: `iptv-app/design-drop/` (26 images: mascot/00-lock-portrait.jpg = canonical face, covers no-dog, heroes, seasonal, 3 real-dog refs). Rules: dog NEVER on title posters/store catalog shots/ads/legal. If generated face fights 00-lock, composite the lock head.
5. Also queued: /feeds/catalog.json (TMDB-matched, unlocks JustWatch chain), language picker (web first), programmatic SEO pages (78 language×country), weekly poster generation, Reddit-monitoring cron.

**October**: setup wizard (8 Qs → legal stack card — Oct = reserved marketing month); Dizi Desk weekly board (render from existing dizi-update data); patron outreach wake-up Oct 1 (BFC first, docs/business/Whisco_TV_Patronage_Program.md); analytics 4-week mark ~Oct 1 → media kit.
**December**: Tagalog two-tap skin + Pasko WhatsApp card (apps public by then [EST]); **Dec 1 = Ramadan 2027 bible freeze trigger** (1 Ramadan ≈ 8 Feb 2027).
**January 2027**: /sports honest companion, indexed 2–3 wks before Border-Gavaskar (21 Jan); first 90-day data recalibration of the 3-year bands.

**3-year bands given to founder (ALL [EST], gates-dependent, zero revenue history)**: LOWER: Y1 ≈ break-even–$2.5k net, Y2 $7–15k, Y3 $20–45k. REALISTIC: Y1 $4–8k, Y2 $25–50k, Y3 $75–160k. Filmhub demand-mix fit = the swing factor. Optimistic scenario does not exist for external readers.

## 6. DOCTRINES (non-negotiable, docs in docs/business/)

1. **Operating Rules v2** = the rulebook (measurement rules, 4 gates, budget tiers, maintenance register)
2. **Content doctrine**: legal only, never piracy, sanctions list (al manar, mayadeen, press tv, irib, hezbollah, al alam, rojava, ronahi, welat, al wilayah, damascus radio) — never NAME these publicly either (Fatema REJECTs drafts that do)
3. **Community doctrine**: automation drafts, HUMANS post third-party. Max 1 mention/room/week. Disclosure always. Outreach signs "— Ali, founder" (locked after the Sridhar persona incident 12 Sep). Mod-mail-first for HIGH-risk rooms = adopted standard.
4. **Numbers doctrine**: public copy = floors only ("600+ live channels", "16,000+ movies & shows"); exact counts internal + dated
5. **Voice Doctrine v1.0**: Whisco TV (professional) vs Whisco the dog (quirky, only marked moments); max 2 free-claims/page; investor materials = company voice only
6. **Brand**: dark #0a0a0f, ember #f97316 → bloom #db2777, dark-only, premium/minimal. Whisco = real gold-tan Shih Tzu, "the dog talks" (founder law). Arabic spelling: **ويسكو** (never وسکو — Persian keheh erratum)
7. **Bot sanitization tiers** (charter §6): bots NEVER get credentials/DR/handover/raw billing/store correspondence. Grok gets sanitized only.
8. **Contractor pipeline**: spec task → founder pastes to Grok → deliverable back → YOU typecheck UNTOUCHED, verify, deploy only what passes.
9. Max 1 ad/page, never near player. Modern faces on main surfaces (trending excludes pre-1980 + vintage collections — enforced in code).

## 7. DAILY WATCH LIST (run each session until resolved)

1. Apple submission state (API) — flip to IN_REVIEW/ACCEPTED/REJECTED expected within days
2. Guides indexing (URL Inspection API ×5 URLs) — gates AdSense request 17–19 Sep
3. Issue #5 — mod desk responses; founder pastes them, you hand him pre-approved C1–C4 text
4. Workflows green (Actions API) + site /api/health
5. Workspace size + git remote/config repair (snapshot strips them EVERY time)
6. Monday: Play production application walkthrough + Fatema's first Monday briefing (founder will ask her)
7. **`lastStatus` distribution check** — report the split (ok / invalid / unknown / geo / duplicate) and the active+inactive counts, and state whether anything MOVED since yesterday. Add permanently 2026-09-14: the never-fails-KPI failure mode is now twice-proven (a `geoHidden` metric hardwired to 0, and `invalid` silently absorbing `geo` for 33 blocked titles). Pass/fail green is not enough — a number that cannot fail is worse than no number. Also assert `active + geo == 0` (no geo-blocked title is ever viewer-facing). **And three guards, added 2026-09-14 after a restore went undetected all session:** (i) a KNOWN-HIDDEN SLUG guard — a fixed list of slugs that must stay `isActive=false` AND return HTTP 404 (this is the only check that catches a silent restore, because a restore rewrites `lastStatus` to `ok` and `active + geo` stays 0); (ii) `restored` must read 0 in every check-vod run unless a human verified a title is genuinely back — the sweep must never re-expose a title on its own; (iii) sitemap URL count must not rise without a matching catalogue change.

## 8. OPEN ITEMS / LOOSE ENDS

- Neon DB password rotation (oldest security item)
- Admin password change unconfirmed
- OFT_01–06 workstream files never received from Grok (ask founder if still wanted)
- Policy suite v2 publication waiting on clean MD from Grok
- Play clock start date + break-glass card (Founder-Absence DR actions) undone
- Expat.com "[link under review]" — watch it clear
- User-testing round 1: two specific content errors (Arabic-titled Turkish show; 2026-vs-2020 mismatch) never re-identified precisely — QA cron covers the patterns; ask visitors for exact titles if they resurface
- whisco-code-sanitized.zip regenerate after Band A ships (for Grok)
- Remittance venture: separate chat, NEW_CHAT_Remittance_Venture_Kickoff.md; THE MEMO returns to founder for cross-examination
- New-idea filter standing: every research return gets the "$1M+ in ≤3yrs" filter → flag "💡 Great App Idea"

## 9. FILES MAP

- **Repo github.com/burn8887/Whisco-TV-** (main @ 00e7b4e, PUBLIC): everything. docs/business/ = 40+ docs library (index: docs/README.md). docs/design-concepts/, design-drop/ (Mascot 2.0 assets), docs/research/ (58-room map, SEO gaps), docs/marketing-evidence/, scripts/content_qa.mjs, .github/workflows/×9.
- **Branch `where-pages` @ d8cb337**: the 5 /where pages. MERGE SEP 20.
- **whisco-mobile repo** @ 5c5181a (Expo app, both stores' builds)
- **Workspace root**: WHISCO_TV_PROJECT_HANDOVER.md (the chronological log — UPDATE + push after every milestone; founder re-uploads to bot projects), DR doc, billing doc, bot bootstrap prompts + context pack zips, this brief.
- Issue #5 = live community-round tracker. Issues labeled content-qa = QA findings.

## 10. YOUR FIRST SESSION CHECKLIST

1. Bootstrap (§2), verify keys present (§3)
2. Apple state check + guides indexing check + workflows green
3. Read WHISCO_TV_PROJECT_HANDOVER.md end to end (chronology + context this brief compresses)
4. Tell the founder: what day it is in the plan, what's pending on him, what you're watching
5. If it's Sep 15+: Play production application. If Sep 17: Filmhub prep refresh morning, call 22:00. If Sep 17–19: AdSense request when guides indexed. If Sep 20+: merge where-pages, start sprint.

**Sign-off habit: 🐾. The dog is the station. The station is a living room. Keep it honest, keep it green.**
