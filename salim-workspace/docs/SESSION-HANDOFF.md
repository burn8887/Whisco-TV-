# Salim session hand-off

**Current as of:** 2026-10-28, Asia/Bahrain. This file is deliberately a short routing note; older detailed session snapshots are not authoritative for current release status.

## Start here

Read [`AGENT-TAKEOVER-BRIEF.md`](AGENT-TAKEOVER-BRIEF.md) first. It is the current evidence-labeled facts block for another AI/engineering agent: branch and PR state, Billing 8 / Android version-code-8 status, the successful iOS App Store Connect upload, exact pending tasks, product constraints, and the financial projection boundary.

Then read:

1. [`RELEASE-SIGNING.md`](RELEASE-SIGNING.md) for the current manual build and upload workflow.
2. [`STORE-RELEASE-CHECKLIST.md`](STORE-RELEASE-CHECKLIST.md) for work still required before distribution.
3. [`HANDOVER.md`](HANDOVER.md) for broad product, architecture, privacy, data, and engineering context. Its older release-status text is superseded by the dated agent brief.
4. [`business/CONSERVATIVE-3-YEAR-PROJECTION.md`](business/CONSERVATIVE-3-YEAR-PROJECTION.md) for the strictly input-based downside view and separately labeled flat-spend sensitivity.

## Current verified hand-off facts

- Repo: `burn8887/Whisco-TV-`; Salim capsule: `salim-workspace/`.
- Working branch: `arena/74afd701-whisco-tv`; PR #37 is open. Do not merge without separate Founder authorization.
- Android Billing 8 source changes pass native CI (run `40671995018`). A signed version-code-8 AAB has not yet been evidenced; Android is still pending a manual signed-release run and Play Console upload.
- iOS signed IPA was uploaded to App Store Connect successfully in run `40677950530` using Xcode 26.3. The App Store Connect processing/TestFlight state has not been independently verified. The Founder temporarily deferred the Xcode 27.1/iPhone Duo requirement for this upload.
- The latest iOS run was iOS-only; Android job was skipped. The workflow retains Android AAB/APK artifacts but does not publish to Google Play.
- Current ASC environment secret names are `SALIM_ASC_KEY_ID`, `SALIM_ASC_ISSUER_ID`, and `SALIM_ASC_PRIVATE_KEY_P8`; their values are never to be shown or stored in documentation.
- Actual revenue remains `$0` until reconciled receipt evidence. The Founder-provided USD 20,000/month Year 1 amount is a spending-availability planning envelope, not transaction authorization.

See the agent brief for URLs, commit IDs, workflow details, confidence labels, remaining gates, and the exact net operating result figures. Refresh all run/PR/store states before relying on this snapshot.
