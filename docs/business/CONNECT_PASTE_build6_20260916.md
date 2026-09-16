# App Store Connect — exact paste sheet (build 6)
**2026-09-16 · prepared from the live Connect values read through the API today, not from memory.**
Nothing here is a suggestion: each value is the approved doctrine, already checked against Apple's character limits.

**Order matters. Do not paste anything until step 1 passes.**

---

## Step 1 — the build (only you can run this)

```
cd whisco-mobile
git checkout main
git pull
git log --oneline -1        # must be 3669584 or later
eas build --platform ios --profile production
```

Pre-flight already verified on my side, at `3669584`: the no-background-audio plugin is **first** in
`expo.plugins`, `UIBackgroundModes` appears **nowhere** in `app.json`, there is no committed `ios/` directory,
the RightsNote is wired into both the live and title screens, and the `Platform.OS === "ios"` store gate is in
place. Working tree clean.

Then:
1. **Read the EAS-assigned build number.** Do not assume 6 — EAS assigns it.
2. Download the IPA and unzip it. In `Payload/WhiscoTV.app/Info.plist`, **`UIBackgroundModes` must print absent**:
   `plutil -p Payload/WhiscoTV.app/Info.plist | grep -i UIBackgroundModes` → no output is a **pass**.
3. Install it through TestFlight internal testing, so the app on your phone is this binary.
4. In Connect → version 1.0 → **Build** → select the new build.

## Step 2 — screenshots (they are currently wrong, and Apple reads them)

The four iPhone and four iPad screenshots in Connect are from 2 Sep, taken on the **old** binary. I downloaded
and looked at them today. They show:

- Live TV header reading **"585 channels"**, with filters Arabic 150 / Hindi 138 / English 75, and a row literally labelled **"Bahrain TV (720p) [Not 24/7]"**.
- On Demand search bar reading **"Search 14,567+ titles…"**, with Game Shows 585, Malayalam Cinema 672, Bangla Natok & Cinema 678.

Every one of those numbers and shelves is gone from this binary. A reviewer diffing those screenshots against
the app sees the mismatch immediately. **Delete all eight and replace them.**

Take four on this build, on both device sizes you ship (`supportsTablet: true`, so the iPad set is required):

1. **Live TV** — the list showing all eight news channels.
2. **A live channel playing** — YouTube's player with the broadcaster's name and controls visible.
3. **On Demand** — the list showing all eight films.
4. **A film playing**, with the Source row visible under the player.

Shot 1 and shot 3 are the two that must show the count honestly: **eight and eight, with no channel or title totals anywhere on screen.**

## Step 3 — listing fields (App Store tab → the fields below)

Click path: **App Store Connect → My Apps → Whisco TV → version 1.0 → App Store tab**.
Left column is what is in Connect right now, read by API today. Change every one of them.

| Field | In Connect now | Paste this |
|---|---|---|
| **Name** (App Information) | `Whisco TV: Live TV & Movies` | `Whisco TV` |
| **Subtitle** | `Live channels, movies & series` | `Official live news & PD films` |
| **Marketing URL** | `https://whisco.tv` | `https://whisco.tv/about` |
| **Support URL** | `https://whisco.tv/contact` | *(already correct — leave it)* |
| **Keywords** | `live tv,movies,turkish series,bollywood,pakistani drama,arabic series,filipino,streaming,dizi` | `live news,world news,news,public domain,classic films,documentaries` |
| **Promotional Text** | `Live TV and thousands of movies & shows — …` | *(below)* |

**One conflict you need to know about, because Apple will not let you paste the approved wording.**
Grok's subtitle, `Official live news & public-domain films`, is **40 characters**. Apple's Subtitle field has a hard
**30-character** limit. The closest compliant version is `Official live news & PD films` (**29**). If you would rather
keep the phrase "public-domain" spelled out, use `Live news & public-domain film` (**30** — singular, and it drops
"Official"). Both are in the table above as option A; tell me which you want and I will keep it consistent everywhere.

**Promotional Text** (153 characters, limit 170 — verifies clean):
```
Eight live news channels from the broadcasters' own official YouTube channels, and eight public-domain films from the Internet Archive. We host no files.
```

**Description** — replace the whole field. The current text advertises "500+ CHANNELS", "14,000+ FREE TITLES",
Turkish series *dizi*, and free-to-air broadcasts; all four are out. Delete everything in the field and paste
1277 characters (limit 4,000):
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

## Step 4 — App Review Information (the notes + the attachment)

Click path: **version 1.0 → App Review Information → Notes**, and the attachment upload below it.

**Notes** — delete the current text entirely. It still sends the reviewer to free-to-air streams and to
*Kurulus Osman*, and cites *His Girl Friday*, none of which are in this build. Replace with
1416 characters (limit 4,000):
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

**Attachment** — the file currently attached is `Whisco_TV_Content_Rights_Statement.pdf`, which describes the
2-live-row build. Remove it and upload:
```
docs/business/Whisco_TV_Content_Rights_Statement_build6.pdf
```
That is the 8 + 8 pack only — 4 pages, every row with its evidence, and no mention of anything the app does not
carry. **Demo account: still not required** (leave `demoAccountRequired` false). Contact email as it stands.

## Step 5 — stop

Do not press Submit. Do not touch the Resolution Center. When steps 1–4 are done, the four conditions Grok set
are met, and the letter is his to write:

1. IPA plist — `UIBackgroundModes` absent ✔
2. Screenshots of this live list — 8 rows, no "585 channels", no "14,567+ titles" ✔
3. Listing + review notes pasted as above ✔
4. Rights pack PDF of the 8 + 8 attached ✔

**Do not change while you are in there:** Privacy Policy URL (`https://whisco.tv/privacy`), age rating,
App Privacy answers, the app's own encryption answer, and the `tv.whisco.app` bundle id.
