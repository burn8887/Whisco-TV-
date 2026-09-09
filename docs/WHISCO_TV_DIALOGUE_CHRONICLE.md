# WHISCO TV — PROJECT DIALOGUE CHRONICLE
*Reconstructed backup of the founder↔agent conversation arc, August–10 September 2026. Written 2026-09-10. This is a decision-and-event chronicle, not a verbatim transcript (verbatim logs live only in the Arena chat UI; this document preserves the substance if that history is ever lost). Companion to HANDOVER + DR docs — this adds the "how we got here."*

---

## PHASE 1 — FOUNDATION (early–mid August 2026)
- Project began as an IPTV-app concept; founder redirected from a piracy-adjacent idea to a **100% legal free-TV platform** — the anti-piracy stance became the brand's core doctrine (agent refuses pirate sources categorically; sanctions exclusion list established).
- Built: Next.js site (Vercel) + Neon Postgres catalog; channel/VOD harvest from legal sources (FTA HLS, official broadcaster YouTube, public domain); verification pipeline (2-hop HLS checks, oEmbed, duration, GCC geo-verification per country became mandatory after the Leyla geo-block incident).
- Whisco brand established: real Shih Tzu mascot (real name Whiskey — "couldn't keep calling him in front of kids"), dark #0a0a0f + orange→pink gradients, "Life's better at full speed — and full free."
- Early incidents that shaped architecture: Prisma 7 breakage (pinned 5.22), Neon 5GB suspension (→ caching layer cutting egress ~95% + Launch upgrade), Vercel CPU warning (→ Pro), France 24 stale manifest (→ 2-hop checks), demo content purged permanently.
- Domain whisco.tv bought (Spaceship, Aug 20), emails partnerships@/legal@/privacy@ working after 554-relay resolution. AdSense applied → "low value content" verdict → remediation: 12,437 thin pages noindexed, sitemap cut to ~2,680 quality URLs, guides section born.
- Automation suite built: uptime monitor (15-min), channel/VOD health, dizi updater, content discovery, weekly maintenance — GitHub Actions as free scheduler backbone.

## PHASE 2 — MOBILE APPS (late August 2026)
- Android app (Expo/RN) iterated v0.1→v0.4 through founder device-testing rounds: YouTube error-153 fix (host-page referer), custom tab icons to founder spec (paw/clapperboard-bone/play/collar-tag), SafeArea fixes. Play Console verified; closed testing started (22→26 testers, 14-day clock).
- iOS: config completed, blocked on Apple enrollment.

## PHASE 3 — TURKISH SHELF + iOS SPRINT (Aug 31–Sep 2)
- Founder: "look for latest Turkish series." Agent verified the entire 2025-26 wave per-episode (embeddable + full-length + all-6-GCC geo): ADDED Aynadaki Yabancı, Çarpıntı, Ben Leman, Cennetin Çocukları, Teşkilat (255 eps). REJECTED as GCC-geo-blocked: Uzak Şehir, Yalı Çapkını, Taşacak Bu Deniz, Kral Kaybederse + 5 more (documented for recheck).
- Founder enrolled Apple Developer → same-session sprint: ASC API key → bundle registered → cert/profile created via API (fixed Associated Domains blocker) → EAS build → TestFlight live → founder tested on iPhone 15 ("Excellent layout, all features work") → listing configured entirely via API (screenshots uploaded programmatically incl. composed iPad set, age rating, pricing 175 territories) → founder created app record + published privacy (Data Not Collected) → **SUBMITTED FOR REVIEW Sep 2, 08:05 UTC**.
- Uptime false-alarm incident (runner DNS): monitor hardened with retries + DoH cross-check + mobile API coverage. Founder mandate: "extensive maintenance, 100% uptime, up our game" → accepted as standing doctrine.

## PHASE 4 — BUSINESS LAYER (Sep 2–6)
- Standing GitHub PAT policy adopted (founder decision). Billing ledger + monthly reminder Issue (25th). Neon charge audited: usage-based pricing = CHEAPER, correct.
- Filmhub phone invitation received → full call-prep pack + Gemini hard-mode roleplay prompt written. Call later scheduled Sep 17 22:00.
- Grok trial workforce: dossier written as context anchor → W1–W10 outputs (business plan w/ 5yr P&L, Bahrain W.L.L. formation guide, policy suite, fundraising pack, marketing playbook, SEO content pack, sponsor prospects, ops/AI blueprint, Filmhub acquisition kit, GCC regulatory memo) all reviewed, fact-checked, filed in docs/business/.
- **Hostile diligence pass on W1** (agent-designed prompt): the adversarial memo attacked the financial model's assumptions; agent ADOPTED its 10 rebuild rules as Operating Rules v2 — measured-only forecasting, 4-gate model (G1 AdSense/G2 stores/G3 licence/G4 CR), KPI honesty (own-player vs embeds).
- **Founder decisions logged:** W.L.L. formation GO, Form A gift letter GO, policy v2 publication GO, **$3,000/mo budget authorized** — governed by agent-designed gate tiers (Tier 0 ≤$150 now; asks founder above $300 single/$100 recurring).
- check-vod timeout incident (catalog growth outran 300s window) → time-budgeted worker pool fix. Founder: "would you have caught it?" → honest answer (only at session start) → **incident-triage automation born**: auto-diagnosis on any workflow failure, known-cause rules, production-impact check, deduped Issues, auto-close.

## PHASE 5 — EXPERIMENTS + CHANNELS (Sep 6–9)
- Clean-room experiment: Grok built rival "Whisco TV" apps from scratch. v1 = design sketch; v2 = credible native trees (xcodeproj+gradle, 4.3k lines, live API). ADOPTED: Home Time (shipped to web within a day), Gulf-household door (About copy fixed same day), hub-sponsorship revenue model; v1.1 shortlist: kids face, zapper, Gulf-first onboarding. REJECTED: killing the mascot voice ("the dog talks — that's doctrine").
- Store-swap mechanics explained: identity (bundle ID) owns approvals; absorb ideas, never restart. Grok patronage program (18 precedents, charter pricing $350-3,200, BFC/Batelco/Zain top-3) + Ramadan 2027 bible (Dec 1 trigger registered) + Arabic localization pack + App Store war room + press kit + originals strategy + ad-revenue atlas + founder-absence DR + Operation First Thousand (6 workstreams) — all filed.
- Claude insurance project tested with agent-designed 15-question trap test (incl. fabricated-hire sting): scored 14/15, and its "failures" exposed real doc-rot (Apple registry lost from DR; incident-triage missing from handover) — both fixed. Retest 3/3.
- Workspace over-budget incident (159MB): files dropped from snapshot incl. local commits — GitHub-is-truth rule established, workspace pruned, all recovered from remote.
- API supervision stack built: Vercel token (first real analytics: 358 visitors/1,837 views Sep 3-8, 5.1 pages/visitor, PK/AE deepest engagement, Speed Insights confirmed disabled), GSC service account (both properties Full; found 5 newest pages unknown to Google → moved AdSense re-review to Sept 17-19 evidence-based), Play API (granted, propagating). Apple day-7 status inquiry sent Sep 8 (case 102956986441) via exact war-room template.
- AdSense hardening: 8 exploitation-era PD titles deleted (Sex Madness etc., surfaced by analytics), 5 false-positive deletions caught + restored from snapshots, sensational docs verified noindexed.

## PHASE 6 — DESIGN SPRINT (Sep 9–10)
- Founder caught the **Vercel-logo favicon** ("embarrassing for our design claims") → replaced with mascot ICO, verified live. Command: purge B&W cover art from main surfaces → trending excludes pre-1980 + vintage collections, VOD shelves recency-first, applied immediately. Demo user deleted from production.
- Founder Qs answered: admin = /admin (change seeded password!), journals = /guides + /new + /feed.xml.
- **Contractor test**: agent-designed task (Tonight on Whisco widget) with hidden doctrine traps → Grok delivered → typechecked UNTOUCHED first try → deployed to production same day. Score 93/100. Contractor pipeline proven: agent specs → Grok builds → agent verifies+deploys.
- Design System v1.0 (OKLCH tokens, letterbox cards, dark-only doctrine adopted; agent amended: Sign-in stays in nav). Submission Campaign Map (JustWatch→TMDB chain, gated calendar, founder week-1 top-10). Language/region picker agreed (web first, apps v1.1). Catalog feed /feeds/catalog.json queued.

## STANDING STATE AT CHRONICLE TIME (2026-09-10)
Production: ~585 channels, ~16.9k titles, 13 languages. Apps: iOS in review day 8 (inquiry sent), Android 11/14 days. AdSense: re-review Sept 17-19 pending guide indexing (daily API checks). Filmhub: call Sep 17 22:00. Revenue: $0 (by design pre-gates). Costs: ~$45/mo. Budget: $3k/mo authorized, Tier 0 active. All 8 automations green. Docs library: 25+ business/research documents. Insurance: Claude (ops) + Grok (business) projects, tested.

## RECURRING DOCTRINES THE DIALOGUE ESTABLISHED
Legal-only content (verify before catalog). Free forever. Max 1 ad, never near player. Human-only community posting. No invented numbers anywhere. GitHub is truth. Automation prepares, humans approve spending/posting. Insurance AIs advise, never execute. Modern faces on all main surfaces. The dog talks (warm mascot voice is brand law). Honesty over polish in every external document.
