# Salim — recovery and release status

**Updated:** 2026-10-28 (Asia/Bahrain). This document replaces the 20 October 2026 status snapshot. For the full dated facts block, links, pending gates, and continuation instructions, see [`AGENT-TAKEOVER-BRIEF.md`](AGENT-TAKEOVER-BRIEF.md).

## Current release evidence

- Repository: `burn8887/Whisco-TV-`; Salim source is isolated under `salim-workspace/`. Current work branch `arena/74afd701-whisco-tv`; PR #37 is open. Do not merge without separate Founder approval.
- Android Billing Library 8.0.0 and default version code 8 are committed. Native Android CI run [40671995018](https://github.com/burn8887/Whisco-TV-/actions/runs/40671995018) passed 24 tests, emulator tests, APK ZIP alignment, and 16 KB native-library alignment checks.
- A signed Android code-8 AAB has not yet been evidenced. Run the manual `Salim signed release` workflow with platform `android`, version code `8`, and identity `com.salimdrive.app`; download artifact `salim-android-signed` and manually upload the AAB to Play Console. The workflow does not publish to Play.
- The signed iOS IPA was built with Xcode 26.3, verified, and successfully uploaded to App Store Connect in run [40677950530](https://github.com/burn8887/Whisco-TV-/actions/runs/40677950530). The Founder temporarily deferred the Xcode 27.1/iPhone Duo requirement. App Store Connect processing/TestFlight state remains unknown pending dashboard check.
- ASC API secret names in the `salim-release` environment are documented in the agent brief and runbook only; secret values are not copied here. The latest iOS run's credential guard and upload step both succeeded.

## Persisted implementation and release separation

Canonical Salim source is under `salim-workspace/`; workflows materialize a separate build tree. Android is native Kotlin/Compose; iOS is native SwiftUI. The browser dashboard is a separate demonstrator, not a native app binary. Android's Billing 8 callback migration is included and CI-validated. The signed-release workflow is manual-only and isolated to Salim's environment.

The Android signed workflow produces a signed AAB/APK artifact for manual Play Console submission. The iOS signed workflow builds, validates, and submits its IPA to App Store Connect. Successful upload only confirms the upload step; it is not proof of store processing, beta approval, App Review approval, or public release.

## Still open before test/public release

- Check App Store Connect processing and TestFlight visibility for the successful iOS upload; record only what the dashboard actually shows.
- Produce the signed Android version-code-8 AAB and upload it to the correct Salim Play testing track. Confirm Play-side package, signing, version code, and processing status.
- Complete store metadata/privacy/data-safety/export compliance/reviewer fields as applicable. Verify live privacy and support URLs and monitored contacts before representing them as ready.
- Complete physical-device QA and accessibility review. Current OSM/Overpass camera data is not comprehensive GCC coverage; static packs are empty. Do not claim official or complete camera coverage.
- Resolve entity/operator, data provenance/rights, privacy disclosures, and qualified Bahrain legal/accounting review before public release.

## Recovery and safety rules

- Refresh current GitHub branch/PR and workflow state before acting; use `AGENT-TAKEOVER-BRIEF.md` as the current starting point, not old run IDs in archived material.
- Never request or expose passwords, tokens, 2FA codes, private keys, certificates, keystores, or API secret values. Use GitHub's secure environment and platform access.
- Keep changes strictly within Salim paths and approved Salim workflows. Do not modify Whisco TV, Whisco Mobile, or other app products.
- No merge, public release, new store submission, production deployment, spend, or legal filing without the relevant direct Founder authorization.
- Actual revenue stays `$0` until reconciled receipt evidence. See the linked conservative projection for the strict known-input view and separately labeled sensitivity; do not infer cash from budget availability.
