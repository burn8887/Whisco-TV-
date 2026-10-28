# Salim — Play closed testing / TestFlight release gates

This is a production-build preparation checklist, not approval to upload. The CI results quoted in older handoffs are historical and do not verify this checkout: the current branch is based on `32c4749`, has uncommitted changes, and has not passed a complete Android/iOS build after those changes. No current signed artifacts exist. The shared report API/operator queue is source code only, not deployed; `www.salimdrive.com` is not live. There is currently no verified bundled camera dataset; live OpenStreetMap queries do not constitute complete GCC coverage. No store upload is authorized.

## Independent app identity — Founder confirmation required

Brand: **Salim — سالم**. Store titles, taglines and clearance notes are in
[STORE-LISTING-DRAFT.md](STORE-LISTING-DRAFT.md), [BRAND-IDENTITY.md](BRAND-IDENTITY.md) and
[NAME-CLEARANCE.md](NAME-CLEARANCE.md). A bare “Salim” store title is unlikely to be available.

Approved store title: **Salim — Road Awareness**. Approved brand domain: **www.salimdrive.com**
(not yet live). Public URLs: [STORE-LISTING-DRAFT.md](STORE-LISTING-DRAFT.md#public-urls).

| Platform | Development identifier | Store identifier | Display name | Current source version |
| --- | --- | --- | --- | --- |
| Android | `com.salimdrive.app` | `com.salimdrive.app` | Salim | `0.7.0` / 7 |
| Apple | `com.salimdrive.app` | `com.salimdrive.app` | Salim | `0.7.0` / 7 |

Both native project sources now declare the permanent ID; verify it again in each signed artifact. The signed Android build also requires `SALIM_REPORT_API_URL=https://www.salimdrive.com/v1`; that variable is not yet wired into the manual release workflow. The iOS project currently has an empty report-service build setting. Do not sign or submit until the service is live over HTTPS, privacy hosting is published, and both release builds receive the verified endpoint. Both developer accounts are active. Never change any Whisco app identity, listing, certificate, upload key or service configuration.

## Google Play closed testing

- [ ] Android CI green: 14 JVM contracts; 6 SQLite and 4 lifecycle instrumentation cases; lint; debug APK; unsigned release AAB. Use the actual run report, not source test counts.
- [ ] Dedicated Salim app created in Play Console, independent upload key and Play App Signing configured; upload certificate fingerprint recorded securely.
- [ ] Physical device testing completed below. Verify current Play target-SDK and 16 KB page-size requirements against the exact signed artifact, including Compose native dependencies.
- [ ] `https://www.salimdrive.com/privacy` and `/support` live over HTTPS, placeholders replaced and
      `python3 salim-workspace/tools/check_site.py salim-workspace/site` passing; contact address
      monitored. The domain did not resolve on 20 October 2026. Complete Data safety against actual behavior and all system/provider interactions; do not declare background location absent merely because `ACCESS_BACKGROUND_LOCATION` is not requested.
- [ ] Foreground-service `location` declaration/review evidence, prominent in-app disclosure, content rating, app access (no account), ads declaration (AdMob in store builds only; no ads in demos), countries, subscription products/trials and closed tester group configured in the **Salim** record only.
- [ ] Current store screenshots and graphic supplied from the final signed app. The present CI run does not capture store screenshots; add/capture them only after the release candidate is verified. Never use synthetic or incomplete coverage to imply comprehensive GCC data. `store-icon-512.png` is the Salim mark (road-S ribbon on `#1F5C47`). Brand system: [BRAND-IDENTITY.md](BRAND-IDENTITY.md).
- [ ] Bundle signed, signature verified against the Salim upload certificate, version code unused, then uploaded only with separate explicit authorization.
- [ ] Review approved; tester opt-in URL opened on an authorized Google account; installation from Play and update path confirmed.

A manual, environment-gated signed build exists: `.github/workflows/salim-release-signing.yml` with the `salim-release` environment. Earlier signed artifacts were produced, but predate the current AdMob/privacy/history changes and must not be uploaded. The workflow does not upload. It is manual-only and can be run against a selected branch after environment approval; see the current historical-artifact warning in [RELEASE-SIGNING.md](RELEASE-SIGNING.md).

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

- [ ] Xcode 26.3 simulator tests and unsigned arm64 device archive green; validate the current App Store Connect SDK requirement before submission.
- [ ] Separate Salim App ID, App Store Connect app record, Apple team ID, distribution certificate and matching App Store distribution profile confirmed. No existing app signing asset is reused without explicit approval.
- [ ] App icon catalog, iPad orientations, location disclosure, background modes and required-reason privacy manifest validated in the actual archive. The manifest declares UserDefaults (`CA92.1`) and monotonic interval measurements (`35F9.1`); re-audit after dependency changes.
- [ ] App Privacy answers, privacy/support URLs, age rating, export-compliance/encryption answers, beta description, What to Test and review contact completed. No export-compliance answer is inferred from an unsigned build.
- [ ] Signed archive exported and validated on an authorized isolated macOS machine, then uploaded only with separate authorization. Simulator ZIP and unsigned archive ZIP cannot be installed through TestFlight.
- [ ] TestFlight processing complete; marketing associates assigned as appropriate internal/external testers. External beta review, if required, is complete and invitation installation succeeds.

The simulator build/test workflow builds/archives **without signing**. The separate approved release workflow signs but never uploads to App Store Connect. The agent cannot dispatch the signing workflow; a fresh signed release run must be initiated through the authorized manual process. On an already authorized Mac with the dedicated certificate and profile installed, the archive step is conceptually:

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
