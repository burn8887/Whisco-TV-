# Salim — Agent Takeover Facts & Current Execution State

**As of:** 2026-10-28, Asia/Bahrain
**Purpose:** A durable, evidence-labeled state block for a successor AI/engineering agent.
**Primary rule:** This dated brief supersedes older release-status statements in `SESSION-HANDOFF.md`, `RELEASE-SIGNING.md`, `STORE-RELEASE-CHECKLIST.md`, and `RECOVERY-AND-RELEASE.md`. For product/legal/financial background, follow the linked library documents and verify current source before making claims.
**Secrets:** Never ask for, display, log, commit, or copy secret values. Only secret names and successful workflow checks are recorded here.

## 1. Executive status

- **VERIFIED — repo/branch:** Work is in public repository `burn8887/Whisco-TV-`, in the isolated `salim-workspace/` capsule and Salim-specific workflows. Current branch is `arena/74afd701-whisco-tv`, current HEAD at this brief's creation is `b4e7356` (`Match configured Salim ASC secret names`). The worktree was clean before this document was created.
- **VERIFIED — PR:** PR #37 is open from this branch to `main`: https://github.com/burn8887/Whisco-TV-/pull/37 . Do not merge it without a separate Founder instruction.
- **VERIFIED — Android Billing fix:** Play Billing dependency is 8.0.0, Android default version code is 8, and the Billing 8 product-details and purchases callbacks were updated. Android CI run [40671995018](https://github.com/burn8887/Whisco-TV-/actions/runs/40671995018) passed after a preceding failed compile was fixed: 24 tests passed, no failed/skipped tests, APK ZIP alignment and 16 KB native-library alignment checks passed, and emulator tests passed. The earlier run [40671355948](https://github.com/burn8887/Whisco-TV-/actions/runs/40671355948) failed because Billing 8 returns a query result object rather than the older product-details list directly; commit `b5ed5fc` fixed this.
- **VERIFIED — signed iOS build and ASC submission:** Release workflow run [40677950530](https://github.com/burn8887/Whisco-TV-/actions/runs/40677950530) succeeded on the iOS job, including signing, IPA export, bundle/signature verification, and **“Upload the verified IPA to App Store Connect”**. User reports the IPA was downloaded as well; downloading is not needed to repeat the upload. The workflow used Xcode 26.3. ASC accepted the upload step; Apple's subsequent processing/TestFlight visibility/review status has **not** been independently checked. Do not claim the app is approved, TestFlight-ready, or released.
- **VERIFIED — ASC secret names:** Founder supplied a screenshot showing these `salim-release` environment secret names: `SALIM_ASC_KEY_ID`, `SALIM_ASC_ISSUER_ID`, `SALIM_ASC_PRIVATE_KEY_P8`. The workflow now resolves those exact names (commit `b4e7356`) in addition to common aliases. Workflow credential-presence checks passed in run `40677950530`. No values were viewed or recorded.
- **PENDING — Android signed v8 artifact:** Latest successful release run was iOS-only; the Android job was skipped. Therefore a signed Android version-code-8 AAB has **not yet been evidenced**. Run the manual `Salim signed release` workflow with platform `android` and version code `8` (or `both` if a fresh iOS upload is also intended). It retains a signed AAB and APK as Actions artifacts for 14 days. The workflow does **not** publish to Google Play; download the AAB and upload it to the Salim Play Console testing track.
- **PENDING — store processing and readiness:** Check App Store Connect for processing completion, build presence under TestFlight, compliance questions, metadata, privacy answers, reviewer details, and any processing warnings. These facts are unknown until inspected in ASC. Play upload/testing is still pending. Physical-device acceptance, complete verified GCC camera data, legal/privacy publication, and public production release remain outstanding (see sections below and the linked checklist).

## 2. Release workflow, current behavior, and next actions

### Current workflow behavior

`.github/workflows/salim-release-signing.yml` is manual (`workflow_dispatch`) and gated by environment `salim-release` plus the explicit identity confirmation `com.salimdrive.app`.

- **Android:** verifies the dedicated upload-key fingerprint; builds/signs AAB and APK with the supplied version inputs; verifies signatures/packaging; retains artifacts as `salim-android-signed`. No Play Publisher/API upload step exists.
- **iOS:** selects Xcode 26.3; signs and exports an App Store IPA; verifies code signature and bundle ID; then uploads the verified IPA to App Store Connect using the API key. The key file is ephemeral and deleted after the job. Artifacts are retained as `salim-ios-signed`.
- **Version inputs:** `version_code` is supplied as the Android version code and iOS build number; `version_name` is supplied as the marketing version. The workflow guard requires a positive integer. Confirm store-side number availability before future runs.
- **Credentials:** Apple signing secrets and ASC API secrets are scoped to `salim-release`. ASC ID/issuer/private-key names accepted include `SALIM_ASC_KEY_ID`, `SALIM_ASC_ISSUER_ID`, `SALIM_ASC_PRIVATE_KEY_P8`; common `APP_STORE_CONNECT_*`, `ASC_API_*`, and `ASC_*` aliases are also accepted. ASC private key may be raw PEM or base64. Never paste it into a shell/chat or show it in logs.
- **Xcode constraint:** Founder has temporarily relaxed the prior Xcode 27.1/iPhone Duo requirement for this upload. Current successful iOS run used Xcode 26.3. Do not silently claim it meets the deferred Xcode 27.1 requirement.

### Immediate operator sequence

1. In GitHub Actions, use the newest `arena/74afd701-whisco-tv` branch revision; the specific ASC-secret-name compatibility fix is `b4e7356`.
2. To produce the Play v8 package, dispatch **Salim signed release**, platform `android`, version code `8`, intended marketing version, and identity `com.salimdrive.app`. Download the AAB from artifact `salim-android-signed`, verify it is the intended package/version/signature, then manually upload it to Play Console. Do not confuse the successful Android CI test artifact with a signed Play artifact.
3. In App Store Connect, inspect the upload from run `40677950530`; wait for processing. Do not upload the downloaded IPA again unless the first upload is absent/rejected or a new authorized build is required.
4. Record only observable outcomes (processing state, build/version shown, warnings, tester availability); do not infer approval from an Actions green check.
5. Before public distribution, complete every still-open gate in `STORE-RELEASE-CHECKLIST.md` and obtain any required Founder decisions/authorizations.

**Execution access note:** During this session, `gh workflow run` returned HTTP 403 `Resource not accessible by integration`; the Founder successfully started the manual workflow through the GitHub UI. The agent must not claim to have dispatched a run unless a run ID confirms it.

## 3. Code and recent Git changes

Relevant commits on this branch:

- `6254193` — upgraded Android Billing Library to 8.0.0 and default version code to 8.
- `b5ed5fc` — migrated Billing 8 query and purchase callbacks; this is the version validated by Android CI run `40671995018`.
- `3660d3e` — added verified iOS IPA upload to App Store Connect after signature/bundle verification.
- `b4e7356` — added the exact `SALIM_ASC_*` names shown by the Founder to the workflow's accepted aliases.

No secret values were committed. Do not stage unrelated changes or touch Whisco product files/workflows. Keep work on `arena/74afd701-whisco-tv`; PR #37 remains open.

## 4. Project facts and hard constraints

- **VERIFIED in source:** Native Android is Kotlin/Compose; native iOS is SwiftUI. Permanent store identifier in release workflow is `com.salimdrive.app`.
- **FROM-CHAT / documented product intent:** Bahrain first with GCC ambition; real, verified camera data is required. The current live OSM/Overpass mapping is incomplete volunteer data; static camera packs are empty. Do not claim comprehensive GCC coverage or official data.
- **Product safety:** fixed mapped camera/hazard awareness only; no police/patrol/covert/RF/radar-emission detection. No safety-critical alert may be paywalled. No ads during active driving; consent and store disclosures must match the shipped binary.
- **Backend/community reports:** source skeleton exists, but production deployment/integration/moderation has not been verified. Do not claim reports or verification are live.
- **Legal/publication:** company/operator identity, CR/activity, privacy/data-flow audit, public contact operations, privacy/support page publication, and qualified Bahrain legal/accounting review are unresolved. Existing drafts are not approved legal notices.
- **Store status:** iOS IPA upload step succeeded; post-upload App Store processing status unknown. No Play Console upload is evidenced. No public release is evidenced.
- **Founder isolation rule:** work only within Salim scope. Do not alter Whisco TV, Whisco Mobile, or unrelated apps, credentials, accounts, listings, workflows, or cloud configuration.

## 5. Monetization, finances, and honest projection boundary

See [Monetization Roadmap](business/MONETIZATION-ROADMAP.md), [Business Plan](business/BUSINESS-PLAN.md), and [Conservative 3-Year Income & Expense Projection](business/CONSERVATIVE-3-YEAR-PROJECTION.md).

- Actual product revenue remains **$0** until a real receipt reaches the designated business account and is reconciled under gate G4. No verified customer/store settlement, subscription price, paid-user cohort, or AdMob settlement is in the project evidence.
- Founder-provided planning input: **USD 20,000/month available in Year 1** (USD 240,000 annualized). This is not proof of cash on hand and does not authorize any particular expense. Founder salary is modeled at $0 in Years 1–4, per Founder direction.
- Strict input-based conservative downside: Year 1 assumes zero revenue and full consumption of the Year 1 envelope, giving a **net operating result before tax/financing of (USD 240,000)**. Years 2 and 3 net results are **NOT IN DATA** because no later-year budgets were provided.
- Separate `[EST]` flat-spend sensitivity repeats USD 240,000 expenses in Years 2 and 3 with zero revenue: **(USD 240,000) in each of Years 1, 2 and 3; (USD 720,000) total**. This is not a supplied budget, cash commitment, accounting forecast, or authorization. Do not call this an evidence-based expected outcome or actual net income.

## 6. First facts to refresh on continuation

1. Inspect PR #37 state and branch SHA; do not merge automatically.
2. Inspect latest Actions run. The run references above are verified at this brief's timestamp but can become stale.
3. Check whether Android platform `android` signed-release dispatch has occurred for version code 8; if not, the signed Play AAB remains pending.
4. Check App Store Connect processing/TestFlight state for the successful iOS upload; do not assume it is visible or accepted for distribution.
5. Refresh the finance model only if the Founder supplies actual settlements, expenses, later-year budgets, prices, conversion, or retention evidence. Do not invent revenue projections.

## 7. Source documents

- `SESSION-HANDOFF.md` — short pointer to this living brief.
- `HANDOVER.md` — broad engineering/product context; older release-status snapshots are superseded by this brief.
- `RELEASE-SIGNING.md` — current manual signing/upload runbook.
- `STORE-RELEASE-CHECKLIST.md` — remaining Play/TestFlight and production-readiness gates.
- `PROJECT-HANDOVER-LOG.md` — dated chronology.
- `business/CONSERVATIVE-3-YEAR-PROJECTION.md` — exact financial basis and limitations.
