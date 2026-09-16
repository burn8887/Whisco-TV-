# Handover prompt — for the agent that built the Whisco TV mobile app

*Paste the block below into the chat with the earlier agent. It is written so the agent reports from the actual
workspace files and from commands it can run, instead of from memory — and so it never prints a secret value.*

---

**Prompt — copy from here**

You built the Whisco TV iOS/Android app (`burn8887/whisco-mobile`, Expo managed + EAS, bundle id `tv.whisco.app`,
Expo project `burn8887s-team/whisco-tv`, EAS projectId `0c4f0508-0c37-438c-a553-5016aa3aaba6`). I am the founder.
I now need to produce build 6 from `main` @ `3669584` on a **clean Mac**, and I cannot: that Mac has no git, no
Node, no EAS CLI, and the project was never cloned there. Before I rebuild that environment from scratch, I need
everything only you know.

**Rules for your answer.** Never print a secret value — no private keys, no `.p8` or `.p12` contents, no
passwords, no tokens, no base64 blobs. Give me file names, locations, existence, dates and commands instead. If I
need a secret as a file, save it into the shared workspace and tell me the filename. If you do not know something
or never did it, write **NOT IN DATA** — do not fill the gap with a plausible answer. Where I ask for command
output, actually run the command in the workspace and paste the real output. Read `/home/user/whisco-mobile`,
`/home/user/.keys/` and `/home/user/asc/` before answering.

### A. How you produced the builds
1. Which environment built the iOS binaries — this workspace, my Mac, or somewhere else? Paste the exact commands
   you ran, in order, for the most recent iOS build.
2. Did you ever build locally (`--local`) or always on EAS servers? Which profile produced the TestFlight binary
   (`production`)?
3. How were you authenticated to EAS: interactive `eas login`, or an `EXPO_TOKEN`? If a token exists, where is it
   stored — **name and location only**.
4. Run `npx eas-cli build:list --platform ios --limit 10` and paste the output: every iOS build number, its ID,
   profile, status and date. Tell me plainly what number the next build will get.
5. `eas.json` sets `appVersionSource: "remote"` with `autoIncrement: true`. Run
   `npx eas-cli build:version:get -p ios` (or the equivalent) and tell me what the remote buildNumber currently
   is. If you set that counter by hand at any point, say when and to what.
6. Did any build fail along the way? What failed, and what fixed it? I want the failure modes so I do not spend an
   evening rediscovering them.

### B. Credentials — the part that actually blocks me
7. `eas.json` has `credentialsSource: "local"` for the `production` iOS profile. Is there a `credentials.json` in
   the project root? Paste its **structure with the password redacted** (keys and paths only). Which exact `.p12`
   and `.mobileprovision` files does it point at?
8. Were those files inside the project directory, or outside it? Give the paths.
9. Is the `.p12` password recorded anywhere I can still read? If it was generated and discarded, say so plainly —
   a fresh `.p12` can be exported from the key and certificate without the old password, and I would rather know
   that than hunt for a string that no longer exists.
10. Do you know whether the EAS account also holds credentials for `tv.whisco.app` server-side? If it does, the
    build can use those and the local files become unnecessary. If you can check
    (`npx eas-cli credentials -p ios`), report only whether a distribution certificate and provisioning profile
    exist there and whether they are EAS-managed.
11. The Apple Distribution certificate and the "Whisco TV App Store" provisioning profile in `.keys/` are valid
    until **2027-09-01** and the certificate inside the profile matches `dist_cert.pem` by fingerprint — I checked.
    Confirm the same, and tell me whether any *other* certificate or profile was used on the last build.
12. The ASC API key `AuthKey_B279KL3Y3K.p8` (key id `B279KL3Y3K`, issuer `b071aa69-7af0-411d-9019-9b9057882600`,
    team `X2UPN4792Y`) — was it used for the builds, and does it have the rights needed? Where should it live on a
    clean Mac?
13. `eas.json`'s submit profile points at `/home/user/.keys/AuthKey_B279KL3Y3K.p8` — an absolute path that only
    exists in this workspace. Confirm that, and tell me the correct path for my own Mac.

### C. The binary itself
14. Did you ever unzip a produced IPA and check `UIBackgroundModes`? Paste the exact command and its real output.
    If you never did, say **NOT IN DATA** — I need to know whether that check has ever actually passed.
15. On the last build, what were `CFBundleShortVersionString` and `CFBundleVersion` inside the IPA?
16. Was `ITSAppUsesNonExemptEncryption` set, and did App Store Connect ask you the export-compliance question?
    What did you answer? This blocks a TestFlight build if it is left unanswered.

### D. Getting the build onto my phone
17. How did the previous builds reach TestFlight? Paste the exact command (`eas submit`? Xcode? Transporter?) and
    which credentials it used.
18. Is `eas submit` for iOS actually working for this project, and what would the correct local command be with
    the ASC API key? Note: I am barred from running `eas submit` for store review right now — I only need it, or
    some alternative, to get the binary into TestFlight so I can take screenshots from it. If there is a
    non-`eas submit` route you would recommend, tell me which.
19. Are TestFlight internal testers or a testing group already configured, so a new build is visible to me
    automatically?

### E. Everything the build needs that is not in the repo
20. Paste the mobile repo's `.gitignore`, and the output of `git status --ignored --short | head -60` inside the
    project, so I can see every ignored file a build depends on.
21. List every file, secret or account the iOS build depends on that is **not** in the public repo, in one table:
    what it is, where it lives, whether it still exists. Then do the same for Android (keystore, any
    `google-services.json`) — Play is paused, so this is only to avoid the same surprise later.
22. Was anything else configured outside the repo — an environment variable, an EAS project setting, an Apple
    Developer Portal item (bundle id capability, App Group, a device registration) — that a clean machine would
    not have?

### F. The one answer I want most
23. If you had to produce build 6 on a clean Mac tomorrow, write the exact step-by-step you would follow: from
    installing the toolchain, through every prompt EAS will show me and the answer to give it, to the finished
    build. Include the credentials step explicitly, and say where each credential file should sit.

**End of prompt**

---

## Why this prompt asks what it asks

- **The blocker is credentials, not the code.** The app code is finished and on `main` at `3669584`; the build fails
  only because a fresh clone has no signing material. Questions 7–13 are the ones that matter.
- **There may be a shortcut.** The distribution certificate, its private key and the matching App Store profile are
  all present in this workspace and valid until September 2027, so a `.p12` can be regenerated with a password the
  founder chooses — without ever recovering the old password. If question 7 or 9 comes back clean, that is the path.
- **The build number is not guessable.** `appVersionSource: "remote"` means EAS holds the counter, so question 5 is
  the only way to know what the next build will be called.
- **TestFlight is a real gap in tonight's plan.** Build 6 has to be on the phone before screenshots can be taken
  from it, and the only route we have used is `eas submit` — which is barred for store submission. That is worth
  resolving with the old agent (questions 17–18) and with Grok before the build lands.
