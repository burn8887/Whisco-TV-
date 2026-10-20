# Native recovery and release status — 14 October 2026

## Persisted implementation

Canonical source is tracked under `salim-workspace/`; builds materialize a separate disposable tree. Android is native Kotlin/Compose; iOS is native SwiftUI. The browser dashboard remains a separate demonstrator, not a native binary.

Both native demos include heading-aware proximity filtering, sample section-control entry/exit gates and speed integration, explicit simulated versus device-GPS sessions, bounded spoken alerts/audio restoration, SQLite fictional alert packs, local trip summaries and report drafts, permission disclosures, app icons and in-app privacy notices. Android additionally contains a validated regional delta adapter, disabled by its empty feed URL. iOS remains offline demo-only and has no remote delta synchronization.

## Verified runner evidence

### Apple

- [Run 38559900113](https://github.com/burn8887/Whisco-TV-/actions/runs/38559900113), source commit `8880afd`: **passed**.
- Xcode **26.3**, **9 XCTest cases passed, 0 failed, 0 skipped**; iPhone 16 Pro / iOS 18.5 simulator.
- Unsigned arm64 device archive built successfully, in addition to the simulator app.
- Artifact `salim-ios-simulator` contains `Salim-simulator.zip`, `Salim-unsigned-device-archive.zip`, build logs, result bundle and machine-readable XCTest summary. Artifact retention is 14 days.
- No signing/provisioning, IPA export, TestFlight processing or physical-device verification has occurred. Neither ZIP is a TestFlight distribution.

### Android

- [Run 38561259145](https://github.com/burn8887/Whisco-TV-/actions/runs/38561259145), source commit `cb5ef28`: compilation, unit tests, lint, debug APK, unsigned release AAB and instrumentation APK packaging **passed**; ZIP/64-bit ELF 16 KB alignment checks **passed**.
- **Full run passed**, including API 35 emulator verification: **24 JUnit cases passed, 0 failed, 0 skipped** (14 JVM, 6 SQLite, 4 native lifecycle cases).
- The 64-bit native libraries for arm64-v8a and x86_64 each have 16,384-byte ELF LOAD alignment. APK ZIP alignment also passed. This is static packaging evidence, not testing on a physical 16 KB-page device.
- Artifacts are retained in GitHub Actions, not committed into this repository. `salim-android-test-build` contains native packages/reports; `salim-android-device-tests` contains the connected-test reports and exact JUnit summary.
- Debug signing is for direct developer testing only and may change between clean runners. The release AAB is **unsigned**, not Play-uploadable. Dedicated Salim signing remains unconfigured.

### Local tooling

- **13 Python tests passed**: 9 materializer safety/recovery cases and 4 ELF-checker cases.
- **6 browser-reference geospatial tests passed**.
- Apple plist/asset-catalog validation passed; iOS icon is 1024×1024 RGB without alpha.
- Isolation verifier and `git diff --check` pass. Existing host files remain identical to baseline.

Actions artifact/log downloads are blocked by this sandbox's outbound host restrictions. Runner status, exact test summaries and artifact metadata are available through the GitHub API; download retained files from the corresponding Actions run in your browser. No binary has been locally installed or tested in this Linux sandbox.

## Store-readiness gates

See [STORE-RELEASE-CHECKLIST.md](STORE-RELEASE-CHECKLIST.md) for dedicated identities/signing, store declarations and the physical-device acceptance matrix; [STORE-LISTING-DRAFT.md](STORE-LISTING-DRAFT.md) and [PRIVACY-PUBLICATION-DRAFT.md](PRIVACY-PUBLICATION-DRAFT.md) are review drafts, not submitted or published materials.

Still required: Founder-confirmed separate app IDs; dedicated upload/distribution signing material; separate Play/App Store Connect records; public privacy/support details; store questionnaires and review contacts; actual-device GPS/lock-screen/audio/battery/accessibility testing; screenshots; authorized signed export/upload and platform processing/review. Store acceptance is not guaranteed by a green CI result.

Verified feeds/licensing, iOS live deltas, CarPlay/Android Auto, watches, Bluetooth/vehicle automation, paid entitlements and internal premium navigation remain unfinished product work. Do not claim these integrations are enabled or that fictional Bahrain data is authoritative GCC coverage.

## Founder isolation constraint

Only the source capsule and the two **explicitly approved new Salim-only build workflows** differ from baseline. No pre-existing Whisco files/workflows, root dependencies, cloud services, secrets, store records, DNS or production configuration were edited. Existing GitHub/Vercel integrations may inspect pushes/PRs; they are not reconfigured. PR #32 remains draft and unmerged. No store upload or intentional production deployment has occurred.
