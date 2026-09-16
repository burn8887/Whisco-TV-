# PLAY-TEST SHEET + GATE CONFIRMATION — BUILD 6
**2026-09-15 · for the founder · play-test off Bahrain Wi-Fi, then off a US VPN IP.**
Rule applied: if either class dies outside the GCC, it does not go in the PDF.

---

# PART 1 — THE FOUR ROWS TO PLAY

## Class A — LIVE (2 rows)

### Row A1 — France 24 English
| | |
|---|---|
| **Play this (browser or app)** | `https://www.youtube.com/embed/HvZt-nh9sGg` |
| Also as a normal page | `https://www.youtube.com/watch?v=HvZt-nh9sGg` |
| Official site | https://www.france24.com/en/ |
| Official channel | https://www.youtube.com/@France24_en |

**PASS =** the France 24 live feed plays and you can see **YouTube's own player and the channel name "FRANCE 24 English."**
**FAIL =** a black box, an error, "Video unavailable", or a player with no YouTube chrome.

### Row A2 — DW News
| | |
|---|---|
| **Play this** | `https://www.youtube.com/embed/LuKwFajn37U` |
| Also as a normal page | `https://www.youtube.com/watch?v=LuKwFajn37U` |
| Official site | https://www.dw.com/ |
| Official channel | https://www.youtube.com/@dwnews |

**PASS =** DW's live feed plays, YouTube player visible, channel name **"DW News."**

> **If either fails, use this backup instead of dropping the row:** Al Jazeera English — `https://www.youtube.com/embed/gCNeDWCI0vo` (also passed the US-vantage check).

## Class B — ARCHIVE (2 rows)

### Row B1 — Topper: Henrietta Sells The House
| | |
|---|---|
| **Read the rights line here** | https://archive.org/details/Topper-HenriettaSellsTheHouse |
| **Play this file** | `https://archive.org/download/Topper-HenriettaSellsTheHouse/TopperHenriettaSellsTheHouse.mp4` |
| Rights text on the page | **"Public Domain Mark 1.0"** |

**PASS =** the file plays and you can find the **"Public Domain Mark 1.0"** line on the item page.
*(The app plays this exact file itself in its own player — it does not open the item page.)*

### Row B2 — A Word to the Wives (1955)
| | |
|---|---|
| **Read the rights line here** | https://archive.org/details/Wordtoth1955 |
| **Play this file** | `https://archive.org/download/Wordtoth1955/Wordtoth1955_edit.mp4` |
| Rights text on the page | **"Public Domain"** |

**PASS =** plays, and the page says **"Public Domain."**

---

# PART 2 — WHAT I ALREADY VERIFIED FROM HERE (US IP)

The sandbox this work runs in is a **US IP (The Dalles, Oregon)** — the closest thing we have to the review environment. From there:

| Check | Result |
|---|---|
| France 24 live stream resolved to current broadcast | ✅ `HvZt-nh9sGg` |
| DW News live stream resolved | ✅ `LuKwFajn37U` |
| Both **embeddable** (public oEmbed 200, official channel name returned) | ✅ |
| All 4 archive.org files serve real video bytes (`HTTP 206`, 200 KB range) | ✅ |
| 12 of 14 candidate broadcasters passed; Euronews + CGTN dropped | ✅ |

**What I could NOT verify from here, and am not claiming:** on-screen chrome and regional playback. YouTube answers this datacenter IP with `LOGIN_REQUIRED — "Sign in to confirm you're not a bot"`. That is about *my IP*, not the videos. **Only your device test settles it** — which is why this sheet exists.

---

# PART 3 — ⚠️ TWO THINGS TO KNOW BEFORE YOU TEST

### 1. Test the live rows TODAY, and expect the URL to age
`HvZt-nh9sGg` is France 24's **current broadcast**, not a permanent link. When that 24/7 stream restarts, YouTube issues a **new video id and the stored embed URL goes dead.** DW is the same.

This is a real risk for a reviewer opening the app weeks later. Two facts:
- Our catalogue **already contains the channel-level pattern** on two channels: `https://www.youtube.com/embed/live_stream?channel=UC…`
- **I could not confirm that legacy pattern still works.** I tested it against a real-looking channel id and a bogus one; both returned identical, inconclusive responses. **I am not going to claim it works.**

**Recommendation:** seed the **pinned ids** (verifiable today, and your test proves them), then add a small refresh job that re-resolves each channel's current live id and updates `streamUrl`. That job changes only `streamUrl`. **It never touches `clearedForApp`** — clearance stays with you.

### 2. Use `youtube.com/embed/`, never `youtube-nocookie.com/embed/`
I checked the shipped player's detection:

```
src.includes("youtube.com/embed")
  youtube.com/embed/id            -> true    ← must use this
  youtube-nocookie.com/embed/id   -> false   ← would break live playback
```

My first candidate list used **nocookie**. Every one of those would have fallen through to the native video player and failed. Caught before seeding. The catalogue already agrees: **14,802 titles use `youtube.com/embed/`, zero use nocookie.**

**So test the exact URLs in Part 1** — they are the `youtube.com/embed/` form, which is what will ship.

---

# PART 4 — GATE CONFIRMATION (for Grok)

Run against the real routes on 2026-09-15. Raw evidence, no interpretation.

### Ask 1 — no header → fat catalogue ✅
```
GET /api/mobile/v1/live                      (no header)
  200 · 60 rows on page 1 · total=625 · filteredCount=625
  cache-control: public, s-maxage=300, stale-while-revalidate=600
  vary: x-whisco-store
```
**Not empty.** Website and Android see the full catalogue, unchanged.

### Ask 3 — iOS deep link to an uncleared id → 404 ✅
```
GET /api/mobile/v1/channel/cmtgptcg000005d854o93u6at   (no header)  ->  200
GET /api/mobile/v1/channel/cmtgptcg000005d854o93u6at   (ios header) -> 404
```

### Ask 2 — `X-Whisco-Store: ios` → only `clearedForApp=true` ⚠️ READ THIS
```
GET /api/mobile/v1/live   (X-Whisco-Store: ios)
  200 · rows=0 · total=0
  cache-control: private, no-store
  vary: x-whisco-store
  ?store=ios  ->  rows=0  total=0
```

**It returns 0 — and on its own that proves nothing,** because **nothing is cleared yet** (0 channels, 0 titles). A gate that returns empty for every input is indistinguishable from a gate that is broken. So I ran a **controlled discrimination test**:

| Step | iOS `/live` | public `/live` | iOS deep link |
|---|---|---|---|
| One channel temporarily cleared | **rows=1** `Bahrain TV (720p) [Not 24/7]` | rows=60, total=625 | **200** |
| Reverted | **rows=0** | rows=60, total=625 | **404** |

**The gate opens, shows exactly the cleared row and nothing else, and closes again.**

**Full disclosure:** I set `clearedForApp=true` on exactly one channel for this test, marked `clearedBy: GATE-TEST-TEMP-REVERTED` so it is auditable. It has been reverted to `false`, and `clearedBy`/`clearedAt` back to `null`. Final DB state, read back after the revert:

```
channels 0/636 cleared   ·   titles 0/16788 cleared
```

**Nothing is seeded. Nothing is cleared. The human tick remains yours alone.**

---

# STANDING, UNCHANGED
No `eas build` yet · no production homepage deploy · no Apple reply · no credentials in chat · build number read from the EAS counter, not assumed.
