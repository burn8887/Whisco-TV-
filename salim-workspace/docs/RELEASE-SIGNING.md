# Salim release signing — Founder runbook

This describes the **third approved Salim workflow**, `.github/workflows/salim-release-signing.yml`.
It is manual-only and produces signed artifacts for download. **It never uploads to Google Play,
App Store Connect or TestFlight.**

## What exists

| Item | Status |
| --- | --- |
| `.github/workflows/salim-release-signing.yml` | Added, manual (`workflow_dispatch`) only |
| GitHub environment `salim-release` | **Must be created by the Founder** |
| Signing secrets | **None configured** — the workflow fails closed until they exist |
| Any signed artifact | None produced yet |
| Any store upload | None, by design |

Until the environment and secrets exist, the job stops in its first guard step and builds nothing.

## Create the environment

GitHub → repository **Settings → Environments → New environment → `salim-release`**.

Recommended settings:

- **Required reviewers:** add yourself. This means every signed build waits for a human click.
- **Deployment branches:** *Selected branches* → `arena/3070ca80-whisco-tv` and `main`.
- **Wait timer:** optional; a short delay makes accidental runs easy to cancel.

Do not reuse an environment, secret or certificate from any other application in this account.

> **Create it before the first run.** GitHub silently creates a missing environment the first time a
> workflow names it — with **no protection rules**. If that happens, delete the empty environment and
> recreate it with the reviewers and branch restrictions above, so a signed build always needs a
> human approval.

## Android secrets

Generate a **new upload key** for Salim. Never reuse another app's keystore.

```sh
keytool -genkeypair -v -keystore salim-upload.jks -alias salim-upload \
  -keyalg RSA -keysize 4096 -validity 10000 \
  -dname "CN=Salim, O=YOUR ENTITY, C=BH"
base64 -w0 salim-upload.jks > salim-upload.jks.b64
keytool -list -v -keystore salim-upload.jks -alias salim-upload | grep SHA256
```

| Secret | Value |
| --- | --- |
| `SALIM_ANDROID_KEYSTORE_BASE64` | Contents of `salim-upload.jks.b64` |
| `SALIM_ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `SALIM_ANDROID_KEY_ALIAS` | `salim-upload` |
| `SALIM_ANDROID_KEY_PASSWORD` | Key password |
| `SALIM_ANDROID_CERT_SHA256` | SHA-256 fingerprint from the `keytool -list` output |

The workflow compares the keystore's fingerprint with `SALIM_ANDROID_CERT_SHA256` before building,
so a wrong or substituted key fails immediately. Keep an offline backup of the keystore and its
passwords: losing an upload key before Play App Signing is enrolled can permanently block updates.

## Apple secrets

In the Apple Developer portal, with the Salim App ID (`app.salim.ios.demo` for now):

1. Create an **Apple Distribution** certificate; export it from Keychain as `.p12`.
2. Create an **App Store** distribution provisioning profile for that App ID.
3. Base64 both files.

```sh
base64 -w0 distribution.p12 > distribution.b64
base64 -w0 Salim_AppStore.mobileprovision > profile.b64
```

| Secret | Value |
| --- | --- |
| `SALIM_APPLE_TEAM_ID` | 10-character Apple team identifier |
| `SALIM_APPLE_CERT_P12_BASE64` | Base64 of the distribution `.p12` |
| `SALIM_APPLE_CERT_PASSWORD` | Password chosen when exporting the `.p12` |
| `SALIM_APPLE_PROFILE_BASE64` | Base64 of the `.mobileprovision` |
| `SALIM_APPLE_PROFILE_NAME` | Exact profile name as shown in the portal |

The workflow refuses to continue if the profile's `application-identifier` is not Salim's, so a
generic or wrong-app profile cannot silently sign the build.

## Running it

Actions → **Salim signed release** → *Run workflow*, filling in:

- `version_name` — e.g. `0.3.0`
- `version_code` — a positive integer never used before for this app
- `platform` — `both`, `android` or `ios`
- `confirm_identity` — must be exactly `app.salim.android.demo`; this is a deliberate speed bump so
  nobody signs the wrong product.

Outputs, retained for 14 days:

- `salim-android-signed` — signed `.aab` and `.apk`
- `salim-ios-signed` — signed `.ipa` and the `.xcarchive`

The run summary states plainly that nothing was uploaded.

## Safety properties

- **Manual only.** No push, schedule or pull request can start a signed build.
- **Environment-gated.** Secrets are unavailable unless the `salim-release` environment exists and
  any protection rules you set are satisfied.
- **Fail closed.** Missing secrets stop the job before checkout of build outputs.
- **Identity-checked.** Android fingerprint and iOS provisioning profile are verified before
  signing; bundle ID is re-checked on the exported IPA.
- **Ephemeral key material.** The keystore and keychain are written to `$RUNNER_TEMP`, deleted in an
  `always()` step, and never uploaded. Nothing is printed except the public certificate fingerprint.
- **No upload path.** There is no Play Publisher, `altool`, `notarytool` or `xcrun` upload step.

## Verification of the workflow itself

`python3 salim-workspace/tools/check_workflows.py` (7 tests) checks the three Salim workflows at
commit time: every `salim-workspace/` path they reference must exist, the pre-rename
`sahm-workspace/` name must not reappear, no store-upload command may be present, and the signing
workflow must stay `workflow_dispatch`-only with **every** job in `salim-release`. It was written
after a stale `sahm-workspace/` path was found in the Android verification step of this workflow.

## Activation: the workflow cannot be dispatched yet

GitHub registers a `workflow_dispatch` workflow only when the file exists on the repository's
**default branch** (`main`). This file currently lives only on `arena/3070ca80-whisco-tv`, so it does
**not** appear under Actions and the *Run workflow* button is absent. This was verified against the
API on 20 October 2026: only the Android and iOS build workflows are registered, and those appear
solely because they have already run.

It therefore cannot be executed until it reaches `main`. That is a Founder decision: PR #32 is
intentionally draft and unmerged, and merging is explicitly out of scope for this work.

When the time comes there are two clean routes:

1. **Merge PR #32** (or a trimmed PR containing only this workflow) into `main`. The workflow then
   registers and can be dispatched against any branch.
2. **Land only the workflow first**: open a small separate PR containing just
   `.github/workflows/salim-release-signing.yml`, merge that, and keep the rest of the capsule
   unmerged. `workflow_dispatch` accepts a `ref`, so the signed build can then be run against this
   feature branch once the file exists on `main`.

Until one of those happens, the signed-release path is **written and checked, but not operational**.

## Known limitations, stated honestly

- **No signed build has ever run.** This workflow is unexercised: it needs real secrets, and those
  have not been supplied. Treat the first execution as a test, not a release.
- Bundle identifiers are still the provisional `.demo` values. If permanent identifiers are chosen,
  update the guard, the `ExportOptions.plist` bundle ID, `project.yml` and the Android
  `applicationId` **before** installing new profiles, or signing will fail by design.
- The Apple export method `app-store-connect` matches current Xcode 26 tooling; confirm against the
  Xcode version on the runner if Apple renames it again.
- Play App Signing enrolment and App Store Connect app-record creation are **not** automated and
  are not authorised here.

## What still requires separate approval

Uploading a signed artifact to either store, creating store records, enrolling in Play App Signing,
distributing to testers, or changing any other application's signing assets.
