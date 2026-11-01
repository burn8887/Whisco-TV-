# Salim release signing and upload runbook

**Updated:** 2026-10-28 (Asia/Bahrain)
**Scope:** `.github/workflows/salim-release-signing.yml` in `burn8887/Whisco-TV-`. This is a Salim-only, manual workflow.
**Authoritative latest run:** [40677950530](https://github.com/burn8887/Whisco-TV-/actions/runs/40677950530). For full current project state see [`AGENT-TAKEOVER-BRIEF.md`](AGENT-TAKEOVER-BRIEF.md).

## Current release status

| Item | Current evidence-based state |
|---|---|
| Manual workflow | Present; guarded by `salim-release` environment and typed identity `com.salimdrive.app`. |
| ASC API secret names | Founder screenshot confirms `SALIM_ASC_KEY_ID`, `SALIM_ASC_ISSUER_ID`, `SALIM_ASC_PRIVATE_KEY_P8`. The workflow accepts these exact names and common aliases. Values are not recorded here. |
| iOS signed build | Run `40677950530` succeeded: Xcode 26.3 archive, signed IPA export, signature/bundle-ID validation all passed. |
| iOS App Store Connect upload | The workflow step **“Upload the verified IPA to App Store Connect”** succeeded in run `40677950530`. Apple processing/TestFlight state has not been checked. This is not evidence of approval or public release. |
| Android Billing 8 code | Android source uses Billing Library 8.0.0; default version code is 8; Android CI passed run `40671995018`. |
| Signed Android code-8 AAB | Not yet evidenced. Latest successful signed release was iOS-only; Android was skipped. Run the workflow for Android to create the signed AAB. |
| Play Console upload | Not performed by this workflow. Download the signed AAB artifact and upload it to the Salim Play Console testing track. |
| Xcode version caveat | The Founder temporarily deferred the Xcode 27.1/iPhone Duo requirement. Latest iOS release used Xcode 26.3; do not claim it satisfies the deferred requirement. |

## Run the workflow

GitHub → **Actions → Salim signed release → Run workflow**. Choose the current branch `arena/74afd701-whisco-tv` and provide:

- `version_name`: intended marketing version (use the version approved for the release; do not infer it from Billing Library 8.0.0).
- `version_code`: a positive integer, never previously used in the target store. The immediate Android replacement needs **8**. The workflow also passes this value as the iOS build number; check the intended ASC build-number policy before an iOS run.
- `platform`: `android`, `ios`, or `both`.
- `confirm_identity`: exactly `com.salimdrive.app`.

### Android output and Play upload

The Android job checks the dedicated upload certificate fingerprint, materializes only Salim, builds a signed AAB and APK with the supplied inputs, verifies signatures and packaging, and retains artifact `salim-android-signed` for 14 days. For Play, download the `.aab`, verify package identity/version/signature, and manually upload it in Play Console. This workflow contains no Google Play Publisher/API upload step. A green push-triggered test build is not a substitute: it is not the signed store artifact.

### iOS output and App Store Connect upload

The iOS job uses Xcode 26.3, checks the Apple distribution certificate/profile and production configuration, archives and exports an App Store IPA, verifies its signature and `com.salimdrive.app` bundle identity, then uploads that verified IPA to App Store Connect with `xcrun altool`. Artifact `salim-ios-signed` is retained for 14 days. After a successful upload, check App Store Connect → **My Apps → Salim → TestFlight → iOS Builds** for processing completion and any warnings. A successful Actions upload step is not App Review approval, TestFlight review completion, or release.

## Environment and secret names

The workflow uses the `salim-release` GitHub environment. Never copy secret values into this repository, a workflow output, a terminal transcript, a chat, or an issue. The environment must contain the established Salim-specific signing material. Names used by the workflow include:

**Android signing**

- `SALIM_ANDROID_KEYSTORE_BASE64`
- `SALIM_ANDROID_KEYSTORE_PASSWORD`
- `SALIM_ANDROID_KEY_ALIAS`
- `SALIM_ANDROID_KEY_PASSWORD`
- `SALIM_ANDROID_CERT_SHA256`

**Apple signing**

- `SALIM_APPLE_TEAM_ID`
- `SALIM_APPLE_CERT_P12_BASE64`
- `SALIM_APPLE_CERT_PASSWORD`
- `SALIM_APPLE_PROFILE_BASE64`
- `SALIM_APPLE_PROFILE_NAME`

**App Store Connect API**

- Founder-confirmed names: `SALIM_ASC_KEY_ID`, `SALIM_ASC_ISSUER_ID`, `SALIM_ASC_PRIVATE_KEY_P8`.
- Also accepted by the workflow: `APP_STORE_CONNECT_KEY_ID`, `APP_STORE_CONNECT_ISSUER_ID`, `APP_STORE_CONNECT_PRIVATE_KEY`; `ASC_API_KEY_ID`, `ASC_API_ISSUER_ID`, `ASC_API_PRIVATE_KEY`; and `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_PRIVATE_KEY`.
- The private-key secret can be raw PEM or base64-encoded PEM. The workflow writes it to a temporary key location and deletes it during cleanup. Never put it in source control.

A successful secret guard proves that required values were available to that run; it does not expose or independently validate their provenance. No credential values are recorded in this library.

## Store and safety boundaries

- Android signed artifacts are for the Salim Play Console only. No other Whisco app, signing key, listing, account, or store record may be changed.
- iOS upload authorization for the current build was given by the Founder and the App Store Connect upload step succeeded in run `40677950530`. Do not infer blanket authorization for future submissions.
- This runbook does not authorize public release, store metadata changes, Play upload, new spend, or legal/publication claims.
- Store readiness still requires privacy/data-flow and SDK audit against the exact binaries, accurate store declarations, lawful data provenance and coverage statements, app records/listings, reviewer information, and physical-device acceptance. See [`STORE-RELEASE-CHECKLIST.md`](STORE-RELEASE-CHECKLIST.md).
- Environment secret names are safe to document; secret values, private keys, keystores, passwords, provisioning profiles, and API credentials are not.
