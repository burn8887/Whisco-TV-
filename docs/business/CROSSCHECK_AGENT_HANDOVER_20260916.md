# Cross-check — the retired agent's handover, verified 2026-09-16

Every claim below was tested against the current workspace, the live App Store Connect record, or a real
`expo prebuild` run. Verdicts: **VERIFIED** · **OUT OF DATE** · **WRONG** · **UNVERIFIED**.

---

## The one that matters most — his credential claim vs. reality

| His claim | Verdict | Evidence |
|---|---|---|
| B7/B8 — `credentials.json` and `credentials/` **exist now** | **OUT OF DATE** | Neither exists anywhere on this filesystem. A full find returns only the masters in `.keys/`: `dist.p12`, `dist_aes.p12`, `dist_3des.p12`, `dist_cert.pem`, `dist_key.pem`, `whisco_appstore.mobileprovision`. They existed in the old chat's sandbox, which did not persist. |
| B9 — the `.p12` password "is recorded and verified working… documented in the DR/handover docs — the one ending in 2026" | **NOT VERIFIED** | I extracted every password-shaped string from every document in both repos and tried each against all three `.p12` files, legacy and modern modes. **None opens any of them.** The password is not in this workspace. |
| B9 — fallback: "`dist_key.pem` + `dist_cert.pem` are both in `.keys/`, so a fresh p12 is one openssl command" | **VERIFIED, and I proved it** | The key's modulus hash equals the certificate's — they are a genuine pair. I exported a fresh `.p12` from them here: it contains **1 certificate and 1 private key**, and the certificate inside it carries fingerprint `2C:3F:82:1D:F2:A5:9C:96:AB:F2:34:D8:3F:44:17:F6:2D:FD:F7:E5` — identical to the certificate embedded in the App Store provisioning profile. **The founder can sign a build tonight with a password he chooses, without ever recovering the old one.** |

## Claims that check out

| # | Claim | Verdict | Evidence |
|---|---|---|---|
| A4 | ASC holds only build 5: uploaded 2026-09-01T21:17, VALID, expired=false, minOS 16.4 | **VERIFIED** | Read from the ASC API: exactly one build, uploaded `2026-09-01T21:17:54-07:00`, `processingState=VALID`, `expired=False`, `minOsVersion=16.4`. Version 1.0, state `REJECTED`. |
| A5 | "The next build gets 6" | **UNVERIFIED** | EAS's remote `buildNumber` counter is *not* the ASC upload list. The ASC record proves only that build 5 was uploaded. It is a reasonable inference, not a fact — read it with `npx eas-cli build:version:get -p ios` after login. |
| B10 | Credentials were never uploaded to EAS servers (why `local` exists) | **UNVERIFIED** | Needs an EAS session. Check with `npx eas-cli credentials -p ios` — if it shows nothing EAS-managed, this is confirmed. |
| B11 | Certificate valid to Sep 1 2027, SHA-1 `2C:3F:82:…:F5` | **VERIFIED** | `notAfter=Sep 1 20:20:36 2027 GMT`; fingerprint matches my independent computation exactly. |
| B11 | Certificate id `3D2AQ39PD3`, profile id `GJ7634S5R8` | **UNVERIFIED** | Neither string appears anywhere inside the `.mobileprovision`. The profile's UUID is `23dc429a-43d9-4025-b431-a382dc011336`, created 2026-09-01 20:30:49. Treat his ids as portal-side labels, not file facts. |
| C14 (second half) | UIBackgroundModes has never been verified on a real IPA | **VERIFIED** | He is right that the artifact check has never been done. Task 2 of the checklist closes it. |
| C15 | `CFBundleShortVersionString` 1.0, `CFBundleVersion` 5 | **VERIFIED** | From ASC. (Locally prebuild writes `1.0.0` / build `1`; the remote counter governs on EAS, exactly as he says.) |
| C16 | `ITSAppUsesNonExemptEncryption: false`, so no compliance prompt | **VERIFIED** | Present in `app.json`; build 5 processed to VALID with no compliance block. |
| D18 | `eas submit` uploads to TestFlight and does **not** submit for App Review | **VERIFIED** | Expo's own documentation states it plainly: "A TestFlight build is not automatically released to the App Store… you still submit it for App Review from App Store Connect." This answers the gap I flagged — the command is not the review submission. Grok should still confirm, because his ruling named the command. |
| D19 | TestFlight internal group "Whisco Internal" exists | **VERIFIED** | ASC API: `Whisco Internal`, `isInternalGroup=true`, id `03e7edb4-d884-4c3f…`, created 2026-09-02. |
| E21 (Android) | Keystore is EAS-managed, server-side | **CONSISTENT** | `eas.json` sets no `credentialsSource` for android, so it defaults to `remote` — EAS manages it. His "local copy NOT IN DATA" stands. |
| B12 | Node 20 LTS | **VERIFIED** | Expo SDK 57, `expo-video` 57.0.2, `eas-cli >= 13`, and this sandbox builds the config with Node 20.20.2 without complaint. |

## Claims that are wrong

| # | Claim | Verdict | Evidence |
|---|---|---|---|
| C14 | "`UIBackgroundModes: ["audio"]` **is declared in app.json** and prebuild copies it in" | **OUT OF DATE** | It was true at his last known commit `5c5181a`. Commit `d39aefd` removed the key from `app.json` and added the plugin. I ran a real `npx expo prebuild --platform ios` on the current tree: the generated `ios/WhiscoTV/Info.plist` has **`UIBackgroundModes` ABSENT**. The plugin wins despite being listed first — Expo applies the *last*-listed plugin's mod first, so `withNoBackgroundAudio` gets the final write. **His snapshot predates the fix; he flagged that himself.** |
| E20 | ".gitignore (real, full)" — six lines | **INCOMPLETE** | The current file also ignores `ios/` and `android/`, added in the same later commit. His list matches `5c5181a`. |
| E22 | "bundle id registered with **Associated Domains** capability (the profile includes it)" | **WRONG** | `app.json` sets `"associatedDomains": []` — an empty list — and the profile's entitlements contain no associated-domains key at all (they are `application-identifier`, `beta-reports-active`, `team-identifier`, `get-task-allow`, `keychain-access-groups`). Nothing in this build uses associated domains. |

## My own error, acknowledged

He caught a real typo of mine: the handover prompt read `b071aa69-af70-…`; `eas.json` says
`b071aa69-7af0-…`. My version was wrong. Corrected in that file. Everything else I asserted about the signing set
held up.

## What this changes for tonight

1. **Credentials must be rebuilt, not copied.** There is nothing to copy — `credentials/` does not exist. The
   founder creates it from the `.keys/` masters with a password of his own choosing. Procedure in the checklist,
   Task 0.5.
2. **The password hunt is over.** Nobody needs it. Do not spend another minute on it.
3. **The plist check is still mandatory**, because the artifact has never been opened. But the config is now
   verified good by a real prebuild, so the expectation is a clean pass.
4. **`eas submit` for TestFlight is available** as the route to get the build on the phone, on the documentation
   above. Get Grok's one-line confirmation because his bar named the command.
5. **Read the build number, do not assume 6.**
