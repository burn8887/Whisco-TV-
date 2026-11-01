# Salim — Play closed testing / TestFlight release gates

This is a release-readiness checklist, not evidence of store approval. **Updated 2026-10-28:** Android Billing 8 source passed CI run `40671995018` (24 tests, zero failures, 16 KB alignment and emulator tests). A signed Android version-code-8 AAB has not yet been evidenced; Android is still pending a signed-release run and manual Play Console upload. iOS signed IPA upload succeeded in release run `40677950530` using Xcode 26.3; App Store Connect processing/TestFlight visibility is not yet verified. The Founder temporarily deferred the Xcode 27.1/iPhone Duo requirement. OSM coverage and an empty bundled camera pack do not prove complete GCC coverage. See [`AGENT-TAKEOVER-BRIEF.md`](AGENT-TAKEOVER-BRIEF.md) for the current evidence-labeled state.

## Independent app identity — Founder confirmation required

Brand: **Salim — سالم**. Store titles, taglines and clearance notes are in
[STORE-LISTING-DRAFT.md](STORE-LISTING-DRAFT.md), [BRAND-IDENTITY.md](BRAND-IDENTITY.md) and
[NAME-CLEARANCE.md](NAME-CLEARANCE.md). A bare “Salim” store title is unlikely to be available.

Approved store title: **Salim — Road Awareness**. Approved brand domain: **www.salimdrive.com**
(not yet live). Public URLs: [STORE-LISTING-DRAFT.md](STORE-LISTING-DRAFT.md#public-urls).

| Platform | Development identifier | Store identifier | Display name | Current source version |
| --- | --- | --- | --- | --- |
| Android | `app.salim.android.demo` | `com.salimdrive.app` | Salim | Default source: `0.7.0-demo` / code 8; release workflow takes explicit marketing version |
| Apple | `app.salim.ios.demo` | `com.salimdrive.app` | Salim | Release workflow injects version/build inputs; latest upload used inputs that must be confirmed in ASC |

The release workflow verified `com.salimdrive.app` in the exported iOS IPA. Do not infer store-record ownership/account status beyond the successful ASC upload. Never change any Whisco app identity, listing, certificate, upload key or service configuration.

## Google Play closed testing

- [x] Billing 8 Android CI green: run `40671995018` reports 24 tests passed, 0 failed/skipped, emulator tests passed and 16 KB alignment checks passed. This is CI validation, not a signed Play artifact.
- [ ] Dedicated Salim app created in Play Console, independent upload key and Play App Signing configured; upload certificate fingerprint recorded securely.
- [ ] Physical device testing completed below. Verify current Play target-SDK and 16 KB page-size requirements against the exact signed artifact, including Compose native dependencies.
- [ ] `https://www.salimdrive.com/privacy` and `/support` live over HTTPS, placeholders replaced and
      `python3 salim-workspace/tools/check_site.py salim-workspace/site` passing; contact address
      monitored. The domain did not resolve on 20 October 2026. Complete Data safety against actual behavior and all system/provider interactions; do not declare background location absent merely because `ACCESS_BACKGROUND_LOCATION` is not requested.
- [ ] Foreground-service `location` declaration/review evidence, prominent in-app disclosure, content rating, app access (no account), ads declaration (AdMob in store builds only; no ads in demos), countries, subscription products/trials and closed tester group configured in the **Salim** record only.
- [ ] Current store screenshots and graphic supplied from the final signed app. The present CI run does not capture store screenshots; add/capture them only after the release candidate is verified. Never use synthetic or incomplete coverage to imply comprehensive GCC data. `store-icon-512.png` is the Salim mark (road-S ribbon on `#1F5C47`). Brand system: [BRAND-IDENTITY.md](BRAND-IDENTITY.md).
- [ ] Run the manual signed-release workflow for Android with version code **8**; download `salim-android-signed`, verify package/version/signature, confirm code 8 is unused in Play Console, then manually upload the AAB to the Salim testing track. The workflow does not upload to Play.
- [ ] Review approved; tester opt-in URL opened on an authorized Google account; installation from Play and update path confirmed.

The manual, environment-gated workflow is `.github/workflows/salim-release-signing.yml`. It produces the Android signed artifact for manual Play upload; it does not publish to Play. Current Android Billing 8 source passed CI, but the signed code-8 AAB is still pending. See [RELEASE-SIGNING.md](RELEASE-SIGNING.md).

Signing support is opt-in. The push-triggered CI intentionally supplies **none** of these variables and creates an unsigned release AAB:

- `SALIM_ANDROID_KEYSTORE_PATH` — dedicated key outside all source checkouts/artifacts
- `SALIM_ANDROID_KEYSTORE_PASSWORD`
- `SALIM_ANDROID_KEY_ALIAS`
- `SALIM_ANDROID_KEY_PASSWORD`

Supply these through a secure secret mechanism on an isolated authorized release machine, never in chat, source, command logs or PR comments. Partial configuration fails rather than silently selecting another key. Run from the materialized Android directory with Java 17, Gradle 8.13 and Android SDK 36:

```sh
gradle --no-daemon :app:verifyReleaseSigning :app:bundleRelease
jarsigner -verify -certs app/build/outputs/bundle/release/app-release.aab
keytool -printcert -jarfile app/build/outputs/bundle/release/app-release.aab
```

`verifyReleaseSigning` deliberately fails without dedicated credentials. A successful unsigned CI bundle is **not** an uploadable Play release.

## Apple TestFlight

- [x] Signed iOS archive/IPA built with Xcode 26.3, identity/signature verified, and uploaded to App Store Connect in run `40677950530`. Xcode 27.1/iPhone Duo requirement was temporarily deferred by the Founder; this build does not satisfy that deferred requirement.
- [ ] Separate Salim App ID, App Store Connect app record, Apple team ID, distribution certificate and matching App Store distribution profile confirmed. No existing app signing asset is reused without explicit approval.
- [ ] App icon catalog, iPad orientations, location disclosure, background modes and required-reason privacy manifest validated in the actual archive. The manifest declares UserDefaults (`CA92.1`) and monotonic interval measurements (`35F9.1`); re-audit after dependency changes.
- [ ] App Privacy answers, privacy/support URLs, age rating, export-compliance/encryption answers, beta description, What to Test and review contact completed. No export-compliance answer is inferred from an unsigned build.
- [x] Signed IPA exported and validated in the isolated macOS workflow; App Store Connect upload step succeeded in run `40677950530`. The Founder authorized this upload. A downloaded IPA is not required to repeat the upload.
- [ ] Verify Apple processing completes and the build appears under TestFlight. Configure beta details/test groups as appropriate, then verify installability. External beta review, if required, remains a separate gate. No processing completion or approval is yet verified.

The simulator workflow remains unsigned. The separate manual release workflow signs and uploads the verified IPA to App Store Connect; run `40677950530` completed successfully. The current source uses Xcode 26.3. The agent's GitHub Actions dispatch call was denied, so the Founder initiated the run in the GitHub UI. On a future signed release, use the guarded workflow rather than the conceptual local archive command below; retain this command only as historical manual-build reference:

```sh
xcodegen generate
xcodebuild -project Salim.xcodeproj -scheme Salim -configuration Release \
  -destination 'generic/platform=iOS' -archivePath /secure-release/Salim.xcarchive \
  CODE_SIGNING_ALLOWED=YES CODE_SIGN_STYLE=Manual \
  DEVELOPMENT_TEAM="$SALIM_APPLE_TEAM_ID" \
  PROVISIONING_PROFILE_SPECIFIER="$SALIM_APPLE_PROFILE_NAME" \
  CODE_SIGN_IDENTITY='Apple Distribution' archive
```

Do not run this against another app's profile. Export via an approved App Store Connect configuration only after checking bundle/team/profile correspondence. No passwords, certificates or private keys belong in this repository.

## Physical-device acceptance matrix — currently unverified

Use a passenger/test rig on a lawful route. Set up while parked; never interact while driving.

| Scenario | Expected outcome | Evidence needed |
| --- | --- | --- |
| Fresh install, location denied | Simulation runs without GPS permission; GPS test is clearly blocked | Both platforms |
| Approximate-only / precise revoked | GPS awareness pauses/stops, no fabricated position or averages | Both platforms |
| Explicit GPS start, home screen, screen locked 20+ min | OS location indicator/Android ongoing notification; fresh fixes when allowed; clear stale pause otherwise | Device model/OS, timing, battery |
| End via app / Android notification | Location updates stop; ongoing notification clears; audio is restored | Both platforms |
| Force-stop / OS process termination / relaunch | No silent restart or fabricated trip duration; interrupted summary | Both platforms |
| Music and navigation, phone call, audio interruption, voice off | Bounded speech/ducking; competing audio resumes; no stuck audio focus | Spotify/Maps/Waze on devices |
| Airplane mode and expired cache | Previously cached mapped/approximate data may remain; no claim of complete coverage; map tiles may be unavailable | Both platforms |
| Reverse/parallel road, invalid heading, stale/poor fix, clock change | No opposite-direction proximity warning; invalid section measurement discarded | Reproducible test trace |
| Section entry, stops, exit | Continuous estimate, stopped time included, interpolated gate completion; no enforcement accuracy claim | Engine tests plus field replay |
| Reboot/update/delete history & drafts | No automatic tracking, durable bounded summaries, deletion works | Installed signed test build |
| Large text, VoiceOver/TalkBack, tablet, rotation | Controls readable/reachable, labels useful, no critical clipping | Screenshots and accessibility pass |

## Intentionally absent from this demonstration

Complete verified GCC camera datasets or official/licensed regional feeds; iOS regional remote delta sync; CarPlay/Android Auto; watchOS haptics; Bluetooth/vehicle automation; platform-console product/trial configuration; premium 3D maps and internal navigation. Native billing and ad SDK integration are in source but require successful CI and console verification. The Android delta adapter remains disabled by its empty feed URL. No account or server-uploaded route is used.
