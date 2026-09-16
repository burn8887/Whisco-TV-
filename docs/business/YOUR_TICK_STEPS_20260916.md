# YOUR STEP-BY-STEP — the four TRUE ticks
**2026-09-16 · everything below is verified as of this message. Nothing is cleared yet.**

---

# THE FOUR IDS

| # | What it is | The ID | What you'll see in the app |
|---|---|---|---|
| 1 | **France 24 English** (live) | `cmu4b0gpy000011a19c6r66q0` | Live row |
| 2 | **DW News** (live) | `cmu4b0hup000111a1qeev0ylr` | Live row |
| 3 | **American Look (Part I)** (1958) | `cmsor4dia00x0nn71q6mhzvyi` | On Demand — **the reviewer tap** |
| 4 | **A Word to the Wives** (1955) | `cmsor4ecn015cnn71sderx8st` | On Demand |

**Two more, optional — only if you want them in the app too:**
| 5 | Park Conscious (1938) | `cmsor4cjo00ilnn71136dsun0` |
| 6 | All About Polymorphics (1959) | `cmsor4ecn015jnn715ddootoy` |

---

# STEP 1 — Look at four links

## ROWS 3 AND 4: DONE — you verified these
Video + audio on both, and both item pages showed **"Public Domain"**. That is the whole test. **Confirmed.**

## ROWS 1 AND 2 — test them on YOUR OWN SITE (this is the correct test)

Open these **in your phone's browser**. They are live on whisco.tv right now, on the real player, with the same referer policy as the row you already watched working. No deploy, no build, no sandbox.

**First, the CONTROL — the row you already confirmed works:**
```
https://www.whisco.tv/live/cmsor42mm00e7nn71p24aui9q
```
Somoy TV. You have seen this play with YouTube chrome + LIVE. If this fails today, something changed on YouTube's side and we stop.

**Then the two rows being ticked:**
```
https://www.whisco.tv/live/cmu4b0gpy000011a19c6r66q0      <- France 24 English
https://www.whisco.tv/live/cmu4b0hup000111a1qeev0ylr      <- DW News
```

| What you see | Meaning |
|---|---|
| All three play with YouTube chrome | rows 1 and 2 confirmed, send TRUE |
| Somoy plays, France 24 / DW do not | the channel ids are wrong, I fix them, nothing gets ticked |
| None play | YouTube changed something, we stop and reassess |

All three use the identical URL shape — `youtube.com/embed/live_stream?channel=UC...` — so any difference between them is about the **channel id**, which is exactly what needs testing.

### Why my earlier instructions failed (three mistakes, all mine)
1. **Direct `/embed/` link in the address bar** sends no referer, so YouTube returns error 153 for *every* embed, including your working Somoy row.
2. **The file preview in the chat window** is a sandboxed iframe with **no network**, so anything external is blocked by design.
3. **The served sandbox URL** needs a **traffic access token**, so plain browser navigation is refused.

Your own site has none of those problems, and it is the closest thing to the reviewer's iPad we can reach today.

# STEP 2 — Reply TRUE

Copy-paste one of these:

**For the four** (3 and 4 already verified by you — this confirms all four):
```
TRUE 1 2 3 4
```

**If you'd rather confirm 1 and 2 separately once the preview loads:**
```
TRUE 3 4
```
*(then `TRUE 1 2` after the preview passes)*

**For the four plus the two extra Prelinger shorts:**
```
TRUE 1 2 3 4 5 6
```

**If something fails**, tell me which number and what you saw. Nothing gets cleared and I fix it.

That reply **is** your tick. It's the human decision the App Store fix requires — no automation makes it. I'll record it as `clearedBy: Ali` with today's date, so it's auditable.

---

# STEP 3 — What I do the moment you reply TRUE

1. Run the tick for each id you named, and confirm each row reads `clearedForApp=true, clearedBy=Ali`.
2. Run your acceptance test and paste the raw output:
   `curl -s -H "X-Whisco-Store: ios" https://www.whisco.tv/api/mobile/v1/live`
   **It must return exactly 2 live rows — France 24 English and DW News — with `facets: null`.**
   *(This has to happen after a production deploy, which is the only thing that makes the row real to the live API. Say the word and I'll do that deploy — it is not the homepage and not a site change, it's the API route your own rules authorised.)*
3. Commit the whisco-mobile half in one commit: `X-Whisco-Store: ios` on the API calls, the Source line, and the `legal@whisco.tv` rights link.

---

# STEP 4 — Your build (only after step 3 passes)

From `whisco-mobile` on `main` (the 2.5.4 audio fix is already in `d39aefd`):

```
cd /home/user/whisco-mobile
npx eas build --platform ios --profile production
```

**Do not assume build 6.** Read the counter: `eas.json` uses `appVersionSource: "remote"` + `autoIncrement`, so **EAS assigns the number**. Whatever it says is the truth.

Then unzip the IPA and confirm the audio key is gone:
```
unzip -o <build>.ipa -d /tmp/ipa
python3 -c "import plistlib,glob;f=glob.glob('/tmp/ipa/Payload/*.app/Info.plist')[0];print(plistlib.load(open(f,'rb')).get('UIBackgroundModes','ABSENT'))"
```
**Must print `ABSENT`.** Only then `eas submit`.

---

# WHAT IS *NOT* BEING ASKED OF YOU
No `eas build` yet. No Apple reply. No homepage deploy. No credentials. Nothing is cleared until you send TRUE.
