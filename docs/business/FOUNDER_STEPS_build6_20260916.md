# YOUR STEPS — build 6, in order
**2026-09-16 · seven tasks. Everything you need to paste is in this document. Nothing else is required.**

**The rules for tonight:** do the tasks in order · do not press **Submit** · do not touch the **Resolution Center** ·
that letter is Grok's to write after this checklist is finished.

---

## TASK 0 — Set up the Linux terminal you already have (no Mac needed)

**You do not need a Mac, and you never did.** Build 5 was not made on a Mac either — EAS builds the iOS binary on
**Expo's own cloud servers**. The computer you type the command on only has to send it. Your Chromebook's Linux
terminal is a perfectly good place to do that.

That terminal said `git: command not found`, `eas: command not found` and `cd whisco-mobile: No such file or
directory` because nothing has been installed in it yet. One setup, about ten minutes, and it is done for good.

### 0.1 Install the four tools

```
sudo apt update
sudo apt install -y git openssl unzip curl
node -v
```

If `node -v` prints **v20** (or higher), skip to 0.2. If it prints nothing, or v18 or lower, run:

```
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
```

`node -v` must now print **v20.x**.

### 0.2 Get the project

```
cd ~
git clone https://github.com/burn8887/whisco-mobile.git
cd whisco-mobile
git log --oneline -1
```

The repo is public, so no password is needed. `git log` must print **`3669584`** or later.

### 0.3 Log in to Expo

```
npx eas-cli@latest login
```

Use your Expo account for **burn8887s-team**. This is the one password in the whole process that only you have.

### 0.4 Build the signing files

The project signs with **local** credentials, and those files are deliberately not in git. The old copies belonged
to a sandbox that no longer exists — but the certificate, its private key and the App Store profile are all in the
workspace, so you make a fresh signing file with **a password you choose**.

I put clean copies in one folder so they are easy to find: **`download-keys/`** in the workspace.

```
download-keys/dist_key.pem
download-keys/dist_cert.pem
download-keys/whisco_appstore.mobileprovision
```

**First — are they already on the machine?** Your Files sidebar showed a "whisco tv keys" folder and a synced
workspace folder, so check before downloading anything:

```
find ~ -maxdepth 5 \( -iname "dist_key.pem" -o -iname "*.mobileprovision" \) 2>/dev/null
```

If that finds them, skip to step 3 and use those paths.

**Step 1 — download the three files.** Open each in the workspace and press download. They land in
**My files > Downloads**.

**Step 2 — get them into Linux.** `/mnt/chromeos/MyFiles/Downloads` is **not reachable** from your terminal — that
is why every `cp` failed, even for the file that was sitting in Downloads. In the ChromeOS **Files** app instead:
drag the three files onto **Linux files** in the left sidebar, or right-click each → **Copy to…** → **Linux files**.
Then check:

```
ls ~/dist_key.pem ~/dist_cert.pem ~/whisco_appstore.mobileprovision
```

All three must be listed.

**Step 3 — make the signing file.** ⚠️ **Do not let openssl prompt you for a password** — its hidden prompt
fails on this terminal ("Verify failure / Can't read Password"), and typing with nothing appearing is normal but
useless here. This captures the password first, where you can see it:

```
cd ~/whisco-mobile
mkdir -p credentials
read -p "Type a password, then press Enter: " P12PW
openssl pkcs12 -export -legacy \
  -inkey ~/dist_key.pem \
  -in ~/dist_cert.pem \
  -out credentials/dist.p12 \
  -passout pass:"$P12PW" \
  -name "Apple Distribution: Ali Albaharna (X2UPN4792Y)"
cp ~/whisco_appstore.mobileprovision credentials/
```

*If `openssl` says `legacy` is not supported, run the same command with `-legacy` deleted.* The `-legacy` flag is
deliberate: it produces the older PKCS#12 format, and I tested the output against **node-forge**, the parser EAS
uses — it reads it cleanly (1 certificate, 1 key). A modern-format file is not guaranteed to work.

**Step 4 — point EAS at it.** The same `$P12PW` variable fills in the password, so you never retype it:

```
cat > credentials.json <<JSON
{
  "ios": {
    "provisioningProfilePath": "credentials/whisco_appstore.mobileprovision",
    "distributionCertificate": { "path": "credentials/dist.p12", "password": "$P12PW" }
  }
}
JSON
```

Both `credentials.json` and `credentials/` are already ignored by git.

**Step 5 — prove it works:**

```
openssl pkcs12 -legacy -in credentials/dist.p12 -nokeys -passin pass:"$P12PW" | grep subject=
```

A line beginning **`subject=UID=X2UPN4792Y, CN=Apple Distribution: Ali Albaharna (X2UPN4792Y)`** means you are done.
Nothing printed means the file did not open — tell me before going further.

**Step 6 — clear the password from the session:**

```
unset P12PW
```

Nothing you typed lands in the shell history — the commands record `$P12PW`, never the password itself.

You can delete the leftovers whenever you like:

```
rm -rf ~/keys-src
```

---

## TASK 1 — Install the project's dependencies, then run the build

**First this — the repo was cloned but its dependencies were never installed**, which is why the build stopped with
`Unable to resolve a valid config plugin for ./plugins/withNoBackgroundAudio`. That plugin is part of the app, and it
needs the project's own packages to load. One command fixes it:

```
cd ~/whisco-mobile
npm install
```

This takes 1–3 minutes and prints a lot of noise. It is done when you get your prompt back. **Do not** run
`npm audit fix` or update anything — the repo pins exact versions for a reason.

**Check it before you spend a build on it:**

```
npx expo config --type public > /dev/null && echo "CONFIG OK"
```

`CONFIG OK` means the app's configuration and that plugin now resolve. If it errors instead, send me the message.

**Now the build:**

```
git checkout main
git pull
git log --oneline -1
npx eas-cli@latest build --platform ios --profile production
```

- The `git log` line must print **`3669584`** or later.
- The line *"Detected that your app uses Expo Go for development…"* is a **harmless warning** — Expo says it for
  every project. Nothing to fix. (If it bothers you:
  `export EAS_BUILD_NO_EXPO_GO_WARNING=true` first.)
- **Write down the build number EAS gives you.** It is not necessarily 6 — EAS assigns it.
- **Never run `eas submit`.** It is barred, and this project's submit profile points at a key path that only
  exists in my workspace, so it would fail anyway.
- It takes 15–25 minutes. You can close the terminal; the build runs on Expo's servers.

## TASK 2 — Prove the build is clean (the plist check)

When the build finishes, download the `.ipa` from the link EAS gives you, then paste:

```
```
cd ~
mkdir -p ipa-check && cd ipa-check
unzip -o ~/Downloads/*.ipa
python3 -c "import glob,plistlib; p=glob.glob('Payload/*.app/Info.plist')[0]; d=plistlib.load(open(p,'rb')); print('UIBackgroundModes:', d.get('UIBackgroundModes','ABSENT'))"
```

- **It must print `UIBackgroundModes: ABSENT`.** That is the pass.
- If it prints `UIBackgroundModes: ['audio']`, **stop and tell me** — do not upload.

*(`plutil` only exists on a Mac, so this uses Python instead. It reads the same file Apple reads.)*

## TASK 3 — Put it on your phone

1. App Store Connect → **TestFlight** → wait until the build shows **"Ready to Submit"** or finishes processing.
2. Install **TestFlight** from the App Store, sign in with your Apple ID, install **Whisco TV** from it.
3. Open the app and check the **Live TV** tab lists exactly these eight:

```
France 24 English · DW English · TRT World · Al Jazeera English
CNA · NHK WORLD-JAPAN · Africanews · ABC News (Australia)
```

4. Check **On Demand** lists exactly these eight:

```
American Look (Part I) · A Word to the Wives · Bookbinders · Out of This World
Design for Dreaming · San Francisco Earthquake Aftermath, Part 3
Skateboard Sense · More Dangerous Than Dynamite
```

If the lists match, the catalogue is right. If they do not, tell me before going further.

## TASK 4 — Replace the screenshots (they are currently wrong)

**Delete all four iPhone and all four iPad screenshots in Connect.** They are from 2 Sep and show
**"585 channels"** and **"Search 14,567+ titles"**, which is not this build.

Take these four, **twice** — once on an iPhone 6.7" (or 6.9") and once on an iPad:

1. **Live TV list** — all eight channels visible.
2. **A live channel playing** — YouTube's player, broadcaster's name and controls showing.
3. **On Demand list** — all eight films visible.
4. **A film playing** — with the **Source** row visible under the player.

Rules for the shots: **no channel count and no title count anywhere on screen**; no dog; nothing that is not in
this build. Shot 1 and shot 3 are the honest ones — eight and eight.

Where to put them: **version 1.0 → App Store tab → Screenshots** → delete the old set → drag in the new ones.

## TASK 5 — Paste the listing text

**App Store Connect → My Apps → Whisco TV → App Information / version 1.0 → App Store tab.**

| Field | What is there now | Paste this |
|---|---|---|
| **Name** | `Whisco TV: Live TV & Movies` | `Whisco TV` |
| **Subtitle** | `Live channels, movies & series` | `Official live news & PD films` |
| **Marketing URL** | `https://whisco.tv` | `https://whisco.tv/about` |
| **Support URL** | already correct | leave it — `https://whisco.tv/contact` |
| **Keywords** | ends in `…streaming,dizi` | `live news,world news,news,public domain,classic films,documentaries` |

**Note on the subtitle:** Grok's wording, *"Official live news & public-domain films"*, is **40 characters** and
Apple's box only accepts **30** — it cannot be pasted, it will just be cut. Use the version above (29 characters).
If you prefer keeping the phrase "public-domain" spelled out, use `Live news & public-domain film` (30 characters,
singular, and it drops "Official"). **Tell me which one you used** and I will match it everywhere.

**If Apple refuses the name `Whisco TV` as already taken**, use `Whisco TV — Live News` and tell me.

### Promotional Text — delete what is there, paste this

```
Eight live news channels from the broadcasters' own official YouTube channels, and eight public-domain films from the Internet Archive. We host no files.
```

### Description — delete everything in the field, paste this

```
Whisco TV shows eight live news channels and eight public-domain films. That is the entire catalogue, and every item in it is documented.

LIVE NEWS — 8 CHANNELS
Eight 24/7 news channels, each played from the broadcaster's own official YouTube channel, inside YouTube's own player, with the broadcaster's branding and controls intact:
• France 24 English
• DW English
• TRT World
• Al Jazeera English
• CNA
• NHK WORLD-JAPAN
• Africanews
• ABC News (Australia)

ON DEMAND — 8 PUBLIC-DOMAIN FILMS
Eight short films from the Internet Archive's Prelinger collection, streamed from archive.org's own servers. Each item's page carries its "Public Domain" declaration, and the app links to that page:
• American Look (Part I)
• A Word to the Wives
• Bookbinders
• Out of This World
• Design for Dreaming
• San Francisco Earthquake Aftermath, Part 3
• Skateboard Sense
• More Dangerous Than Dynamite

HOW IT WORKS
• We host no video files. Live channels play through YouTube's embeddable player; films stream from archive.org.
• No download, save or convert function — the app cannot export anything.
• Supported by advertising.
• No account needed to watch. Optional sign-in adds a watchlist and resume.

Rights holders: legal@whisco.tv — anything flagged is removed within 24 hours.
```

**Leave alone:** Privacy Policy URL, age rating, App Privacy, What's New (empty is fine), bundle id.

## TASK 6 — Review notes + the rights PDF

**version 1.0 → App Review Information.**

### Delete the Notes field completely — it still points the reviewer at free-to-air streams and at *Kurus Osman*. Paste this instead

```
Whisco TV v1.0 hands the reviewer a catalogue of sixteen documented items — eight live news channels and eight public-domain films. Nothing else is reachable in this build.

Reviewer path (no account needed):
1. Live TV — eight channels are listed: France 24 English, DW English, TRT World, Al Jazeera English, CNA, NHK WORLD-JAPAN, Africanews, ABC News (Australia). Tap any one: YouTube's own player loads, showing the broadcaster's channel name and YouTube's native controls. The stream is the broadcaster's own official channel feed.
2. Below the player, tap Source. It opens the broadcaster's own YouTube channel so you can see whose stream you are watching.
3. On Demand — eight public-domain films are listed. Tap one: it plays in the app's player, streamed from archive.org. Below it, Source opens the item's archive.org page, where the "Public Domain" line is printed.
4. Report a rights issue is on every title, and legal@whisco.tv reaches us directly. Anything you flag is removed within 24 hours.

Attached: Whisco_TV_Content_Rights_Statement_build6.pdf — per-item evidence for all sixteen items, including the licence line and the measured codec for each film.

We host no media files. There is no download, save or convert function, no playlist import and no IPTV screen. Live content plays through YouTube's embedded player; films stream from archive.org. No free-to-air streams are used in this build.
```

### Attachment

**Delete** the PDF that is attached now (`Whisco_TV_Content_Rights_Statement.pdf` — it describes the old two-channel build).
**Upload** this file instead — it is in the workspace, open it and download it:

```
docs/business/Whisco_TV_Content_Rights_Statement_build6.pdf
```

Demo account: **still not required** — leave that switch off.

## TASK 7 — Stop, and report these four things

Do **not** press Submit. Send me these four, and Grok writes the Resolution Center letter:

1. **The EAS build number**, and whether the plist check printed nothing.
2. **Screenshots uploaded?** — yes/no, both device sizes.
3. **Listing + notes pasted?** — and which subtitle version you used.
4. **The new PDF attached?** — yes/no.

---

## Links you will need

| What | Where |
|---|---|
| App Store Connect | https://appstoreconnect.apple.com |
| TestFlight (on your phone) | App Store → search **TestFlight** |
| Marketing page (confirm it loads) | https://whisco.tv/about |
| Support page (already in Connect) | https://whisco.tv/contact |
| The rights PDF to upload | `docs/business/Whisco_TV_Content_Rights_Statement_build6.pdf` |

**Screenshot sizes, if Connect complains:** iPhone 6.7" → 1290 × 2796 · iPad Pro 12.9" → 2048 × 2732.
