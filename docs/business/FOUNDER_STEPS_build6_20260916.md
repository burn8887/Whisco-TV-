# YOUR STEPS — build 6, in order
**2026-09-16 · seven tasks. Everything you need to paste is in this document. Nothing else is required.**

**The rules for tonight:** do the tasks in order · do not press **Submit** · do not touch the **Resolution Center** ·
that letter is Grok's to write after this checklist is finished.

---

## TASK 0 — Set up this Mac first (only needed once)

Your terminal said three things: **`git: command not found`**, **`eas: command not found`**, and
**`cd whisco-mobile: No such file or directory`**. That is one cause, not three: this Mac has never had the
developer tools installed, so nothing was ever cloned here.

**First — is the Mac you built build 5 on still around?** If it is, build there: it already has everything, and
you can skip to Task 1. Everything below is for setting up this one.

### 0.1 Install git (it comes with Apple's Command Line Tools)

```
xcode-select --install
```

A popup appears → click **Install** → agree → wait (5–15 minutes, it is a big download). When it finishes:

```
git --version
```

It must print something like `git version 2.39.5`. If it says `command not found` again, tell me.

### 0.2 Install Node (needed to run the build tool)

Download and run the macOS installer from **https://nodejs.org/en/download** — take the **LTS** version,
double-click the `.pkg`, click through it. Then check:

```
node -v
npm -v
```

Both must print a version number. (If you already have Homebrew, `brew install node` does the same thing faster.)

### 0.3 Get the project onto this Mac

```
cd ~
git clone https://github.com/burn8887/whisco-mobile.git
cd whisco-mobile
git log --oneline -1
```

The repo is public, so it needs no password. `git log` must print **`3669584`** or later — that is the build-6
commit with the store header, the Source line and the rights report.

### 0.4 Log in to Expo

```
npx eas-cli@latest login
```

Use your Expo account for **burn8887s-team** (the project is `whisco-tv`).

### 0.5 If the build complains about iOS credentials

The project is configured to use **local** signing credentials, and those files were deliberately kept out of
git — so a brand-new clone does not have them. If the build stops and mentions credentials, run:

```
npx eas-cli credentials -p ios
```

Choose the **production** profile, then accept the option to **set up a Distribution Certificate** and
**Provisioning Profile**. Creating a new distribution certificate is safe: Apple allows several, and it does not
touch the app, your existing TestFlight builds, or the App Store listing.

If it offers **Apple Service API Key** as the way to sign in, that is the easiest path — it skips the Apple ID
two-factor prompts. The key (`AuthKey_B279KL3Y3K.p8`) is in the workspace under `.keys/`; download it to this Mac
and point EAS at it.

Then run the build again.

---

## TASK 1 — Run the build (5 minutes of typing, then it runs on its own)

Open Terminal and paste this whole block:

```
cd whisco-mobile
git checkout main
git pull
git log --oneline -1
npx eas-cli@latest build --platform ios --profile production
```

*(Use `npx eas-cli@latest`, not plain `eas` — `eas` alone does not exist on a fresh Mac, and `npx` fetches the
tool without installing anything globally.)*

- The `git log` line must print `3669584` or later. If it prints anything else, stop and tell me.
- **Never run `eas submit`.** It is barred, and this project's submit profile points at a key path that only
  exists in my workspace, so it would fail anyway.
- **Write down the build number EAS gives you.** It is not necessarily 6 — EAS assigns it.
- Leave it running. It takes a while.

## TASK 2 — Prove the build is clean (the plist check)

When the build finishes, download the `.ipa` from the link EAS gives you, then paste:

```
cd ~/Downloads
mkdir -p ipa-check && cd ipa-check
unzip -o ~/Downloads/*.ipa
plutil -p Payload/WhiscoTV.app/Info.plist | grep -i UIBackgroundModes
```

- **No output at all = PASS.** That is what we want.
- If it prints `"UIBackgroundModes" => [...]`, **stop and tell me** — do not upload.

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
