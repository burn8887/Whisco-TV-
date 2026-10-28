# Salim Company Dossier

**Version:** 1.0
**Snapshot date:** 2026-10-28
**Status:** Founder-input-based; legal, market, and commercial claims remain unverified
**Audience:** Founder, successor agents, advisers, and diligence reviewers

> **Contains no credentials by design.** This dossier intentionally records no passwords, tokens, private keys, keystore contents, recovery codes, personal account identifiers, or private customer data. It points only to approved storage locations where relevant.

## 1. Identity and scope

| Field | Current record | Evidence / confidence |
|---|---|---|
| Product | **Salim — Road Awareness**; Latin brand **Salim**, Arabic **سالم** | Founder-approved project context; spelling is a hard rail |
| Product purpose | Road and driver awareness assistant, beginning with warnings about known fixed road cameras | Founder input; scope excludes police/patrol detection and radar-emission detection |
| Founder | Ali Albaharna, Manama, Bahrain (full legal name in project context: Ali Sameer Sadeq Mohamed Albaharna) | Founder-supplied; verify exact legal name and authority before filing or external use |
| Candidate operating company | “Whisco Media W.L.L” | Founder input, exact spelling/registration/ownership not independently verified; do not represent as a registered entity until evidence is checked |
| Jurisdiction | Bahrain base; intended GCC-wide product | Founder input; legal entity status, permitted activities, and operating licences are **NOT IN DATA** |
| Domain | www.salimdrive.com | Founder-designated; **not live as of 2026-10-28**. Do not substitute another domain in published material |
| Contact addresses | support@salimdrive.com and legal@salimdrive.com | Founder-designated; deliverability and mailbox ownership **NOT IN DATA** |
| Repository boundary | Salim work lives under `salim-workspace/` in the current checkout | This is a repository layout, not proof of a separate legal entity or repository |

Salim is a distinct product workstream. No Salim change may modify, deploy, sign, advertise, or otherwise affect Whisco TV, Whisco Mobile, or another application. Do not interpret the parent repository name as Salim's legal identity.

## 2. Mission and problem

Drivers in GCC countries can encounter newly installed fixed speed or seatbelt cameras with little notice. A sudden surprise may trigger an abrupt reaction; Salim's intended role is to give advance awareness of **known, mapped fixed installations** so the driver can respond calmly and lawfully. It must not encourage speeding, evasion, distraction, or interference with enforcement. A warning is not a guarantee that every camera is known, current, or correctly positioned.

## 3. Current product and technology inventory

**As of 2026-10-28**, the repository contains:

- Native Android source using Kotlin and Jetpack Compose; native iOS source using Swift and SwiftUI; a browser demonstrator under `salim-workspace/site/`.
- Android and iOS camera-feed/map code that queries OpenStreetMap (OSM) data. OSM coverage is approximate, incomplete, and not an official register.
- Deliberately empty bundled static camera packs: no GCC dataset with both verified coordinates and confirmed redistribution rights is approved for shipping.
- A source-only shared camera-report API and moderator console under `salim-workspace/report-service/`. It is **not deployed**; no live moderator is connected; production reporting is inactive.
- Store/payment and advertising code in source. Console products, trial offers, consent behavior, and end-to-end purchases still require verification in the respective store consoles and on real devices.
- Automated CI evidence for commit `2055538`: Android compilation/lint/packaging and emulator checks passed (24 tests, 0 failures; 16 KB alignment checked); iOS simulator tests passed (10 tests, 0 failures) and an unsigned device archive compiled. These artifacts are not a signed Play upload.
- Python verification as recorded for the current work: report-service tests and project-tool tests pass; native CI results are the authoritative evidence for the build above.

### What is not established

| Measure | Status |
|---|---|
| Registered entity / company number / ownership | **NOT IN DATA**; founder input names “Whisco Media W.L.L” but no registration evidence reviewed |
| Active production users, installs, trips, retention | **NOT IN DATA**; planning baseline is **0 until measured** |
| Revenue, subscriptions, sponsorships, advertising receipts | **$0 until measured**; no verified revenue evidence in the project record |
| Verified comprehensive GCC camera count or official dataset | **NOT IN DATA**; no completeness claim is permitted |
| Deployed reporting service, live moderation, real user submissions | **No** as of snapshot date |
| Production store approval or current Play closed-test clock | **NOT IN DATA**; no evidence that a current signed build has been uploaded |
| Legal counsel review / entity-specific legal memo | **NOT IN DATA** |

## 4. Business model — hypothesis, not actuals

The current product hypothesis is a free tier with safety alerts and a paid premium subscription. Founder-approved planning intent has included ads on eligible idle screens in store builds (never during an active drive), and premium benefits such as ad removal, broader GCC coverage, more trips, and shorter lead time. Product IDs in source are `salim_premium_monthly` and `salim_premium_yearly`.

This is not evidence that ads, premium entitlements, a trial, or any store product are configured or purchasable. **All revenue remains $0 in every plan until the relevant gate is met and a payment is reconciled.** No safety-critical alert may be paywalled. Do not present a trial unless the relevant store metadata actually provides it.

## 5. Market and alternatives

The target is drivers in Bahrain first, then other GCC markets, including daily commuters and intercity drivers who want advance awareness of mapped fixed cameras. No current count of addressable drivers, app users, willingness to pay, or market share is available. Those figures are **NOT IN DATA** until a reproducible counting basis and source are recorded in the Phase 3 market analysis.

The competitive set to research includes navigation products, speed-camera warning apps, local government traffic services, and free map/community data. No claim of superiority, exclusivity, full GCC coverage, or regulatory approval is made in this dossier.

## 6. Non-negotiable operating doctrines

1. Only fixed, publicly mapped road hazards are in scope. No police/patrol, covert, tripod, radar-emission, or enforcement-evasion detection.
2. No guessed exact coordinates. OSM is approximate/incomplete; never call it complete, official, or verified without evidence.
3. No static camera data enters a release until its source, coordinate confidence, update process, and redistribution rights are documented and approved.
4. No user report becomes public or an alert until human review; community votes support review but do not prove identity, presence, or truth.
5. Reporting stays disabled until hosting, moderator staffing, privacy review, backup, and endpoint verification are complete.
6. Ads never delay or obscure an alert and never appear on the active-drive screen or during a running session.
7. No store upload, signing-key change, policy claim, paid spend, or external partner commitment without the approvals defined in Operating Rules.
8. Whisco TV, Whisco Mobile, and every other product remain out of scope and untouched.

## 7. Source-of-truth map

- Product and repository status: `salim-workspace/docs/PRODUCT-DECISIONS.md`, `salim-workspace/docs/STORE-RELEASE-CHECKLIST.md`, and this dossier.
- Build and signing procedures: `salim-workspace/docs/BUILDING-LOCALLY.md`, `salim-workspace/docs/RELEASE-SIGNING.md`, `salim-workspace/docs/ACCOUNTS-AND-SECRETS.md`.
- Service source/status: `salim-workspace/report-service/README.md`.
- Public-facing website source: `salim-workspace/site/`; it is not proof the domain is live.
- This emerging venture library: `salim-workspace/docs/README.md` (index). Git is the durable record; chat is not.

## 8. Decisions still requiring founder evidence

- Confirm the exact registered legal name, company number, jurisdiction, ownership, and signatory authority. Is “Whisco Media W.L.L” already registered, being formed, or only a working name?
- Confirm whether “Ali Albaharna” and the full legal name in project context refer to the same founder and which name may be published.
- Supply an approved monthly and one-off spending ceiling, approval method, and the funded amount currently available; figures are **NOT IN DATA**.
- Confirm the developer-account type and creation date for Play; confirm the latest unused Play version code.
- Confirm the status of domain registration, DNS, support/legal mailboxes, app-store products, and the privacy-policy URLs.

---

**Change control:** Update this document only with dated evidence or an explicit founder decision. Preserve old snapshot values in the handover log rather than silently rewriting history.
