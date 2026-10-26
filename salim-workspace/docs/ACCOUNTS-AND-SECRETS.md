# Salim — accounts, secrets and store identifiers

Everything on this page is entered **by you**, in GitHub, Google or Apple. Nothing here is
pasted into a chat, and nothing here should be.

That is not a formality: a chat transcript is stored, synced and searchable. A keystore
password in it is a leaked keystore password. The whole point of a GitHub secret is that it is
written once, sealed, and only ever expanded into a runner that is destroyed minutes later.

---

## 1. The one-time GitHub environment

**Settings → Environments → New environment → name it exactly `salim-release` → Configure.**

- **Required reviewers:** add yourself. Every signed build then waits for a human click.
- **Deployment branches:** *Selected branches* → `main` and `arena/74afd701-whisco-tv`.
- Leave the wait timer empty.

Do this **before** the first signing run. If a workflow names a missing environment, GitHub
creates an unprotected one silently, and it is easy to miss.

Then, inside `salim-release` and nowhere else: **Add secret** for each of the ten below.

---

## 2. The five Android secrets

Run these on your own machine. Keep `salim-upload.jks` and both passwords offline — losing an
upload key before Play App Signing is enrolled can permanently block updates to the listing.

```sh
keytool -genkeypair -v -keystore salim-upload.jks -alias salim-upload \
  -keyalg RSA -keysize 4096 -validity 10000 \
  -dname "CN=Salim, O=Ali Sameer Sadeq Mohamed Albaharna, C=BH"

base64 -w0 salim-upload.jks > salim-upload.jks.b64
keytool -list -v -keystore salim-upload.jks -alias salim-upload | grep -iE 'sha-?256'

The filter is deliberately loose: some JDK builds print `SHA256:` and others print
`SHA-256:`. A stale JDK is also why the bare `grep SHA256` from an earlier draft of these
notes printed nothing on a keystore that was perfectly good.
```

| Secret name (exact) | Value |
| --- | --- |
| `SALIM_ANDROID_KEYSTORE_BASE64` | entire contents of `salim-upload.jks.b64` |
| `SALIM_ANDROID_KEYSTORE_PASSWORD` | keystore password you typed |
| `SALIM_ANDROID_KEY_ALIAS` | `salim-upload` |
| `SALIM_ANDROID_KEY_PASSWORD` | key password (same as keystore unless set separately) |
| `SALIM_ANDROID_CERT_SHA256` | the `SHA256:` line from `keytool -list -v`, colons included |

The workflow checks the fingerprint against the keystore before building, so a wrong key fails
immediately instead of producing an AAB that cannot be uploaded.

**Clickpath:** GitHub → this repository → **Settings** → **Environments** → `salim-release` →
**Add secret** → paste name → paste value → **Add secret**. Repeat five times.

---

## 3. The five Apple secrets

**Developer portal (developer.apple.com/account):**

1. **Certificates, Identifiers & Profiles → Identifiers → ＋** → App IDs → App → bundle ID
   **`com.salimdrive.app`** → enable *In-App Purchase* (needed for subscriptions) and *Push*
   is **not** needed → Register.
2. **Certificates → ＋** → *Apple Distribution* → follow the CSR prompts → download →
   double-click to install in Keychain.
3. **Profiles → ＋** → *App Store* → App ID `com.salimdrive.app` → select the distribution
   certificate → download the `.mobileprovision`.
4. In Keychain Access, export the certificate **and its private key** as `distribution.p12`
   with a password you choose.

```sh
base64 -w0 distribution.p12 > distribution.b64
base64 -w0 Salim_AppStore.mobileprovision > profile.b64
```

The team ID is the 10-character identifier at the top right of the portal.

| Secret name (exact) | Value |
| --- | --- |
| `SALIM_APPLE_TEAM_ID` | 10-character team identifier |
| `SALIM_APPLE_CERT_P12_BASE64` | contents of `distribution.b64` |
| `SALIM_APPLE_CERT_PASSWORD` | the password chosen when exporting the `.p12` |
| `SALIM_APPLE_PROFILE_BASE64` | contents of `profile.b64` |
| `SALIM_APPLE_PROFILE_NAME` | the profile name exactly as shown in the portal |

**Clickpath:** same place as the Android ones — `salim-release` → **Add secret** ×5.

---

## 4. Advertising: the network and its IDs

**Recommendation: Google AdMob.** One account covers both stores, it is the network the Play
and App Store review teams expect to see declared, and its consent SDK is the one that
satisfies the EEA/UK prompt requirement without a second vendor.

**AdMob account → Apps → Add app** (twice):

1. Android app, name *Salim*, **not** listed on a store yet, package `com.salimdrive.app`.
2. iOS app, name *Salim*, **not** listed yet, bundle ID `com.salimdrive.app`.

Then **Ad units → Add ad unit → Banner** for each app. Copy four identifiers:

| GitHub Actions **variable** (exact) | Where it comes from |
| --- | --- |
| `SALIM_ADMOB_APP_ID_ANDROID` | AdMob → Apps → Salim (Android) → App ID, `ca-app-pub-…~…` |
| `SALIM_ADMOB_APP_ID_IOS` | AdMob → Apps → Salim (iOS) → App ID |
| `SALIM_ADMOB_BANNER_ANDROID` | AdMob → Ad units → the Android banner, `ca-app-pub-…/…` |
| `SALIM_ADMOB_BANNER_IOS` | AdMob → Ad units → the iOS banner |

**Clickpath:** GitHub → **Settings** → **Secrets and variables** → **Actions** →
**Variables** tab → **New repository variable** ×4.

These are not secrets — an AdMob unit ID is public the moment the app ships. They are
variables so they stay out of the source tree and can be swapped without a commit.

Until they exist, the build uses Google's official **test** IDs (`ca-app-pub-3940256099942544/…`),
which serve test ads only. A release built without the four variables will refuse to sign, so a
test ID can never reach a store by accident.

Ads appear in the free tier only, never on the drive screen, and never inside a running session.

---

## 5. Free tier and subscriptions

**The line, stated once: no safety alert is ever behind the paywall.** Salim that withholds a
camera warning from a driver who has not paid is not a product worth shipping, and both stores
would treat it badly in review.

| | Free | Salim Premium |
| --- | --- | --- |
| Camera and hazard alerts | Yes | Yes |
| Live cameras within 12 km | Yes | Yes |
| Bundled Bahrain pack | Yes | Yes |
| GCC-wide offline pack | — | Yes |
| Advertising | On the overview and settings screens | None |
| Trip history | Last 20 trips | Unlimited |
| Alert lead time | Standard | Adjustable 300–1000 m |

Product IDs — these exact strings must exist in both stores or the app will show an empty
paywall:

- `salim_premium_monthly`
- `salim_premium_yearly`

**Play Console:** Monetise → Products → **Subscriptions** → Create subscription →
product ID `salim_premium_monthly` → add a base plan (auto-renewing, monthly) → set price in
BHD → Activate. Repeat for `salim_premium_yearly`. Subscriptions can only be tested once the
build is on a closed track, so this is done alongside the first closed-testing upload.

**App Store Connect:** My Apps → Salim → **Subscriptions** → create a group named
`Salim Premium` → **Create Subscription** for each ID, with a monthly and an annual duration,
localised display names, and a price. Add both to the app's first version so review can see them.

Neither store needs a server from us: entitlement is read from StoreKit 2 on iOS and the Play
Billing client on Android, and cached on the device.

---

## 6. Privacy and support URLs

`www.salimdrive.com` still does not resolve. Play will not accept a listing without a public
privacy URL, so two pages are already live on Google Docs, publicly readable without an account:

- Privacy policy — https://docs.google.com/document/d/1gv7tD1tYx3aMiLptPBw4nXSRWDwqexy_Tk_e6WcaSHY/view
- Support — https://docs.google.com/document/d/1JlPEh8gLyLd2P93smaYkhe2GuuwXpnIn6d9pH1kut5E/view

Both are generated from `salim-workspace/site/*.html`, which is the source of truth. When the
domain is live, point the store fields at `https://www.salimdrive.com/privacy` and
`https://www.salimdrive.com/support` and keep the Docs up as a mirror for a few weeks.

A Vercel project named **salim** already exists in your account, configured to serve
`salim-workspace/site` as a static site. It has no deployment yet, because the deployment API
refused the first one without an interactive framework confirmation. Connecting it to this
repository once (Vercel → salim → Settings → Git → Connect) gives a proper hosted site and
automatic deploys; the Docs links remain valid until then.

---

## 7. Before you press "run" on the signing workflow

- The release workflow used to build the **capsule** tree, whose IDs are
  `app.salim.android.demo` / `app.salim.ios.demo`. An application ID cannot be changed after
  the first upload, so this was a trap. It now builds the **promoted** tree, which carries
  **`com.salimdrive.app`**, and both the guard and the archive checks assert that ID. The
  `confirm_identity` value to pass is therefore `com.salimdrive.app`.
- The signing keystore must live in `salim-release`. Nothing else in this runbook is secret
  except the Apple `.p12` password.
- The advertising SDK and the subscription purchases are not wired into the apps yet. The
  free-tier limits above are the specification they will be built against.
