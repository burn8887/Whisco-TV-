# RIGHTS PACK — iOS BUILD 6
**Rewritten 2026-09-16 to match the binary being submitted. This describes 2 live channels and 2 public-domain films — nothing else.**
Attachment target: App Review Information.

**Rule applied throughout:** if the app does not show it, this document does not claim it.
A rights pack that disagrees with the binary is worse than no pack, because the reviewer can diff them.

---

## PAGE 1 — WHAT THIS BUILD DOES WITH VIDEO

- We **host no media files**.
- We **do not download, copy, store, transcode, re-encode or mirror** any video or audio.
- We **do not extract, decrypt or restructure** stream URLs from any player.
- We **do not circumvent DRM or any access control**.
- The app **cannot save, rip, convert or export** anything — there is no such function.
- There is **no playlist import and no M3U/Xtream screen**. It is not an IPTV player.
- **The live channels play in YouTube's own player**, embedded from the broadcaster's own channel, with the broadcaster's controls and monetisation intact.
- **The films play in the app's native player, streaming the file served by archive.org** from archive.org's own servers.

*(One honest note, because the two behave differently: for live content we hand playback to YouTube entirely. For the films we play the file ourselves, which is why that set is limited to material the library has declared public domain.)*

---

## PAGE 2 — WHAT IS IN THIS BUILD, AND WHAT IS NOT

| Class | Content | Count | Playback |
|---|---|---|---|
| **A** | Official broadcaster **live news**, embedded from the broadcaster's own YouTube channel | **2** | YouTube's embeddable player |
| **B** | **Public-domain films**, streamed from the Internet Archive | **2** | In-app native player |

**Not in this build** *(each phrase means: not in this binary)*:
- Any channel carried only because a third-party HLS URL was not published on the broadcaster's own site.
- Any commercial free-to-air channel.
- Any re-upload, aggregator or clip channel.
- Any cinema, dizi or musalsal storefront.
- Any television entertainment series.
- Any item whose source could not be evidenced.

**This is deliberate.** The catalogue is small because every item in it is documented. Our website carries a larger catalogue; the app is not the website, and does not present itself as one.

---

## PAGE 3 — CLASS A: OFFICIAL BROADCASTER LIVE EMBEDS

**Both rows play in YouTube's own player, from the broadcaster's own YouTube channel.** We store the *channel*, not a broadcast — there is no video id in the app that can go stale.

| # | Broadcaster | Primary official URL | Official channel | Embedded as |
|---|---|---|---|---|
| 1 | **France 24 English** | `france24.com/en/` | `youtube.com/@France24_en` | `youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UWmAEFg` |
| 2 | **DW News** | `dw.com` | `youtube.com/@dwnews` | `youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg` |

Both were checked on **2026-09-16**: each channel was confirmed to have a live broadcast, and the broadcast was confirmed to belong to that channel before use.

**What each row is:** the broadcaster's own 24/7 news stream, published by the broadcaster on its own channel, played through YouTube's embeddable player.

**Supporting evidence:**
- **YouTube's Terms of Service** permit playback of embeddable videos through the embeddable player, and the uploader grants a licence *as enabled by a feature of the Service (such as video playback or embeds)*.
- **Embeddability is the rights holder's own setting.** A video whose owner has disabled embedding cannot be played in the app at all.
- **France 24's own press release** announces that it broadcasts live 24/7 on YouTube. It is cited **for the France 24 row only**; it says nothing about any other broadcaster.
- The official channel for each row was verified by reading the channel's own feed metadata and confirming the channel's name — not by scraping a page, which returns other channels' identifiers.

**The app shows this to the viewer.** Every live channel displays a Source line with a link to the broadcaster's own channel, and a one-tap way to report a rights issue.

---

## PAGE 4 — CLASS B: PUBLIC DOMAIN, WITH VERBATIM RIGHTS TEXT

**Playback is in-app** — the app's native player streams the file that archive.org serves. It does not open the item page. The rights text below is quoted **verbatim from each item's own details page**.

| # | Title | Year | Rights text on the item page | Duration | Item page | File the app streams |
|---|---|---|---|---|---|---|
| 1 | **American Look (Part I)** | 1958 | **"Public Domain"** | 8.2 min | `archive.org/details/American1958` | `archive.org/download/American1958/American1958.mp4` |
| 2 | **A Word to the Wives** | 1955 | **"Public Domain"** | ~14 min | `archive.org/details/Wordtoth1955` | `archive.org/download/Wordtoth1955/Wordtoth1955.mp4` |

Both file URLs were requested on **2026-09-16** and returned real video data (`HTTP 206`).

Both are from the **Prelinger Archives**, the well-known public-domain moving-image collection. Each is a **sponsored or educational short film** — neither is a cinema feature, a series, or a television entertainment property.

**Every file was verified on the actual file, not on the library's label.** We requested each file and read its real video codec. This mattered: the Internet Archive offers several versions of many items, and several versions we first selected turned out to be **MPEG-4 Part 2** — a format iOS decodes the audio of but **not** the picture. Those were removed. Both files above are **H.264 (`avc1`), Constrained Baseline, 640×480** — the most compatible video profile in existence, chosen so a reviewer on any device sees picture, not just sound.

**To verify any row:** open the item page. The licence line is printed on the page itself, in the library's own words. The app links to it from the "Source" row on the title.

**Scope note, stated plainly:** the archive set in our catalogue was audited in full. Of 1,721 items, 811 had a file in a format iOS can play, of which **492 also carry a public-domain declaration**. We found 18 items requiring attribution we do not yet display, and 2 under a NonCommercial licence. **The NonCommercial items are excluded** — Whisco TV is funded by advertising, which is a commercial use, and those licences do not permit it. Attribution-required items are held until the app displays creator credit. **This build carries only the two items above.**

---

## PAGE 5 — WHAT IS NOT IN THIS BUILD, AND WHAT WE REMOVED

**Removed from iOS build 6:**
- Every channel carried only because a third-party HLS URL **was not published on the broadcaster's own site**.
- Channels whose stream is served from a file host rather than a broadcaster.
- Channels marked as not operating 24/7.
- 52 titles whose owners had disabled embedding — they could not play in the app at all.
- Titles with no playable source.
- Items whose file iOS cannot decode.
- The cinema, dizi and musalsal shelves in their entirety.

**Held back pending written permission:** broadcasters we would like to carry, held out rather than included because a stream happened to be publicly reachable.

**Commitment:** if anything in this build is a concern, tell us and **we will remove it within 24 hours**, without argument, and tell you what changed. There is a **"Report a rights issue"** row inside the app on every title, and the address is `legal@whisco.tv`.

---

## PAGE 6 — HOW TO CHECK US

1. Open **Live TV**. Two news channels are listed.
2. Tap one. YouTube's own player loads, showing the broadcaster's channel name and its native controls. You are watching the broadcaster's own feed.
3. Below the channel, tap **Source**. It opens the broadcaster's own channel for you to check.
4. Open **On Demand**. Two public-domain films are listed. No cinema or series storefront.
5. Tap a film. It plays in the app's player from archive.org.
6. Below the title, tap **Source**. It opens the item's archive page — where the **"Public Domain"** line is printed.
7. Tap **Report a rights issue** on any title, or write to `legal@whisco.tv`.

---

## NOT STATED IN THIS DOCUMENT
- No third-party HLS directory is named or cited as a source or a defence, at any point.
- No free-to-air argument. A broadcaster publishing its own stream is not a licence for us to redistribute it.
- No claim of permission we do not hold, and no implication of a partnership that does not exist.
- No case law.
- **No API-key-based verification claim** — the audit above was performed offline when choosing what to include. The app runs no verification code at runtime; it embeds these two channels and plays these two files.
- No count of content the app does not carry.
