# PLAY-TEST v2 — CORRECTED AFTER YOUR DEVICE TEST
**2026-09-15 · supersedes v1. Your result was right, my file was wrong.**

---

# 1. WHAT YOU SAW, AND WHY

You were right on both counts. Both files were **MPEG-4 Part 2** (DivX/Xvid-era). iOS can decode their **audio track but not their video track** — which is exactly "audio only". Not a network problem, not a device problem.

**Proof, from the actual files** (I fetched and probed them):

| File I gave you | Codec | Result on iOS |
|---|---|---|
| `Wordtoth1955_edit.mp4` | **mpeg4** (`mp4v`) | **AUDIO ONLY** — your result |
| `TopperHenriettaSellsTheHouse.mp4` | **MPEG4** (`mp4v`) | **AUDIO ONLY** — your result |

archive.org labels these "HiRes MPEG4", "512Kb MPEG4" and "MPEG4". All three are Part 2. Only files labelled **"h.264"** carry an `avc1` track iOS can play.

### ⚠️ Your suggested retry would also have failed
You asked for `Wordtoth1955_512kb.mp4` **" / H.264"**. I checked: `Wordtoth1955_512kb.mp4` is **"512Kb MPEG4" → Part 2 → audio-only again.** The H.264 file on that item is **plain `Wordtoth1955.mp4`** — no `_512kb`, no `_edit`. Details below.

### Why Topper is unfixable
Topper has **no h.264 derivative at all** — only MPEG4, 512Kb MPEG4 and Ogg Video. There is no file in that item your phone can show. Dropping it wasn't just a taste call; it was the only option. (And your read on it was right for a second reason: the page even describes it as a 1950s TV sitcom.)

---

# 2. THE RETRY YOU ASKED FOR — ONE URL

### B2 corrected — A Word to the Wives (1955)
| | |
|---|---|
| **Play this** | `https://archive.org/download/Wordtoth1955/Wordtoth1955.mp4` |
| Item page (rights line) | https://archive.org/details/Wordtoth1955 |
| Verified codec | **h264 / `avc1` / Constrained Baseline / 640x480 / 84 MB** |
| Rights text on page | **"Public Domain"** |

Constrained Baseline is the most compatible H.264 profile that exists — this is the safest possible file for an iPad.

### Preferred replacement, if Word to the Wives doesn't sell it
### B-new — American Look (Part I) (1958)
| | |
|---|---|
| **Play this** | `https://archive.org/download/American1958/American1958.mp4` |
| Item page | https://archive.org/details/American1958 |
| Verified codec | **h264 / `avc1` / Constrained Baseline / 640x480 / 8.2 min** |
| Rights text on page | **"Public Domain"** |
| What it is | Prelinger, GM-sponsored. *"The definitive Populuxe film on 1950s automotive, industrial, interior and architectural design."* |

**This is the one I'd put in front of Apple.** It reads unmistakably as a documentary, it's a sponsored film rather than a TV property, and it doesn't look like a storefront.

---

# 3. THE FULL VERIFIED CLASS B SET (4 rows — Grok's gate still needs 4)

Every row below: **Prelinger · public domain verbatim on the item page · H.264 `avc1` Constrained Baseline · 640x480 · codec-verified on the real file.**

| # | Title | Year | Play URL | Rights line |
|---|---|---|---|---|
| 1 | **American Look (Part I)** | 1958 | `…/download/American1958/American1958.mp4` | "Public Domain" |
| 2 | **Park Conscious** | 1938 | `…/download/ParkCons1938/ParkCons1938.mp4` | "Public Domain" |
| 3 | **A Word to the Wives** | 1955 | `…/download/Wordtoth1955/Wordtoth1955.mp4` | "Public Domain" |
| 4 | **All About Polymorphics** | 1959 | `…/download/AllAboutPolymorphics/AllAboutPolymorphics.mp4` | "Public Domain" |

All four are `archive.org/details/<id>` for the page. None is cinema, dizi, a series, or a cartoon franchise. **Your test on any one of them settles the class** — they are all the same codec, from the same collection, at the same resolution.

---

# 4. THIS IS NOT ONE BAD FILE — HALF THE ARCHIVE SET IS UNPLAYABLE

I audited **all 1,721** archive.org items behind our 1,724 active rows and read the format of the **exact file each row points at**:

| Codec of the file we point at | Rows | Plays on iOS? |
|---|---|---|
| **MPEG-4 Part 2** (`mp4v`) | **864** | ❌ **audio only** |
| **H.264** (`avc1`) | **811** | ✅ yes |
| Other | 46 | mixed |

**Of the 811 H.264 rows, 492 are also public domain** — that's the real Class B pool. The other 319 need attribution we don't yet display.

**And it isn't only an iOS problem.** No mainstream browser ships an MPEG-4 Part 2 decoder. Those **864 rows are silent-with-picture-at-best on our own website too.** That is a live site defect, 50% of the archive catalogue, and it is upstream of AdSense as well as the app.

**Fix, and it is a data fix only:** for each Part-2 row, look for an `h.264` derivative on the same item and repoint `streamUrl` at it. Where none exists (like Topper), the row can never play — those should stay out of iOS and be flagged. I have not touched any row. Say the word and I'll write the repoint job with a dry-run first.

---

# 5. THE LIVE ROTATION PROBLEM — AND A FREE TEST THAT MAY DELETE IT

You're right: **don't ship a frozen `HvZt-nh9sGg`.** Two ways to fix it, and one of them may need no new job at all.

**Option A — refresh job (works, more moving parts).** Re-resolve each channel's current live id on a schedule and update `streamUrl` only. Never touches `clearedForApp`. That's what I'll build if B doesn't pan out.

**Option B — ask YouTube for the channel, not the broadcast.** The catalogue **already does this on 7 channels**, including Somoy TV, Jamuna TV and PTV Sports:
```
https://www.youtube.com/embed/live_stream?channel=UC…
```
If that pattern still works, there is **no stored id to go stale** — the player always follows the channel's current broadcast. The rotation problem disappears and no refresh job is needed.

**I could not verify it from here.** Real and bogus channel ids returned identical, inconclusive responses from this datacenter IP. So I'm not claiming either way.

**Your 10-second check, no build needed:** open **whisco.tv** on your phone and play **Somoy TV** (or Jamuna TV, PTV Sports, Ektaattor TV — any of the 7). If the picture plays, Option B is live and I'll use it for every iOS live row. If it doesn't, I build the refresh job.

---

# 6. SEEDING A1 + A2 — ONE DECISION BEFORE I TOUCH DATA

France 24 and DW already exist in the catalogue with **direct HLS** streams (`live.france24.com/…`, `dwamdstream102.akamaized.net/…`). Per the lock, iOS Live is **YouTube embeds only** — so those existing rows cannot be the iOS rows.

That means iOS needs its **own** rows for the same broadcasters, which creates a choice:

| Option | Effect on the website |
|---|---|
| **(i)** Add iOS-only rows tagged `sourceKind='youtube-live'`, and exclude that tag from the public live route | Website keeps its exact current 613 index and channel count. **My recommendation.** |
| (ii) Add the rows and leave them public | The website starts showing France 24 and DW **twice**. |

Either way, **new rows are created with `clearedForApp: false`.** Seeding never clears anything — the tick stays yours.

---

# 7. CONFIRMED, AS ASKED

**No GATE-TEST row is left true.** Fresh read, just now:

```
channels with clearedForApp=true or any clearedBy stamp: 0
titles   with clearedForApp=true or any clearedBy stamp: 0
FINAL: channels 0/636 cleared  ·  titles 0/16788 cleared
```

The temporary test row is fully reverted — not just `clearedForApp=false`, but `clearedBy` and `clearedAt` back to `null`, so no trace of a test tick remains.

---

# STANDING
No `eas build` · no production homepage deploy · no Apple reply · no credentials in chat · build number read from the EAS counter, not assumed.
