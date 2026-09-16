# RIGHTS PACK — iOS BUILD 6
**Version 2 · 2026-09-15 · skeleton accepted by Grok, fixes applied, URLs pinned.**
Attachment target: App Review Information. Written **only about what build 6 contains**.

**GATE STATUS — the PDF is written only when all three are green:**
| # | Gate | Status |
|---|---|---|
| 1 | 8–15 live YouTube rows verified from a non-GCC IP, chrome visible | **PARTIAL** — 12 rows resolved and confirmed **embeddable** from a US IP (oEmbed 200 + official channel name). On-screen chrome **not yet visually confirmed** — that needs a device screenshot |
| 2 | 4 archive.org rows with verbatim rights text from the item page | **MET** — see pages 5–6 |
| 3 | Page 8 taps equal the binary | **WAITING** — depends on seeding, so the taps cannot be written until then |

---

## PAGE 1 — WHAT THIS BUILD DOES WITH VIDEO

- We **host no media files**.
- We **do not download, copy, store, transcode, re-encode or mirror** any video or audio.
- We **do not extract, decrypt or restructure** stream URLs from any player.
- We **do not circumvent DRM or any access control**.
- The app **cannot save, rip, convert or export** anything — there is no such function.
- There is **no playlist import and no M3U/Xtream screen**. It is not an IPTV player.
- **Class A content plays in YouTube's own player**, embedded from the rights holder's own YouTube channel, with the holder's controls and monetisation intact.
- **Class B content plays in the app's native player, streaming the file served by archive.org** from archive.org's own servers.

*(One honest note, because the two classes work differently: for Class A we hand playback to YouTube entirely. For Class B we play the file ourselves, which is why Class B is limited to material the library has declared public domain.)*

---

## PAGE 2 — WHAT IS IN THIS BUILD, AND WHAT IS NOT

| Class | Content | Count | Playback mechanism |
|---|---|---|---|
| **A** | Official broadcaster **live news** channels, embedded from each broadcaster's own YouTube channel | **12** | YouTube's embeddable player |
| **B** | Public-domain works from the Internet Archive | *(seed pending)* | In-app native player, streaming archive.org's file |

**Not in this build** *(each phrase below means: not in this binary)*:
- Any channel carried only because a third-party HLS URL was not published on the broadcaster's own site.
- Any commercial free-to-air channel without written permission.
- Any re-upload, aggregator or clip channel.
- Any cinema, dizi or musalsal storefront.
- Any item whose source could not be evidenced.

---

## PAGES 3–4 — CLASS A: OFFICIAL BROADCASTER LIVE EMBEDS
**Every live row is hosted on youtube.com.** Verified embeddable from a **US IP** on 2026-09-15.

| # | Broadcaster | Primary official URL | Official channel | Live embed URL |
|---|---|---|---|---|
| 1 | France 24 English | france24.com/en/ | youtube.com/@France24_en | youtube-nocookie.com/embed/HvZt-nh9sGg |
| 2 | DW News | dw.com | youtube.com/@dwnews | youtube-nocookie.com/embed/LuKwFajn37U |
| 3 | TRT World | trtworld.com | youtube.com/@trtworld | youtube-nocookie.com/embed/9CucucyxECM |
| 4 | Al Jazeera English | aljazeera.com | youtube.com/@aljazeeraenglish | youtube-nocookie.com/embed/gCNeDWCI0vo |
| 5 | Sky News | news.sky.com | youtube.com/@SkyNews | youtube-nocookie.com/embed/xDWQ3LkccY8 |
| 6 | CNA (Channel NewsAsia) | channelnewsasia.com | youtube.com/@channelnewsasia | youtube-nocookie.com/embed/XWq5kBlakcQ |
| 7 | ABC News (Australia) | abc.net.au/news | youtube.com/@abcnewsaustralia | youtube-nocookie.com/embed/vOTiJkg1voo |
| 8 | NHK WORLD-JAPAN | nhk.or.jp/nhkworld | youtube.com/@NHKWORLDJAPAN | youtube-nocookie.com/embed/IimtbuqYIE8 |
| 9 | Africanews | africanews.com | youtube.com/@africanews | youtube-nocookie.com/embed/NQjabLGdP5g |
| 10 | Bloomberg Television | bloomberg.com/live | youtube.com/@markets | youtube-nocookie.com/embed/QB5BNdBFujE |
| 11 | Reuters | reuters.com | youtube.com/@Reuters | youtube-nocookie.com/embed/VeVnHdK3Sbs |
| 12 | DW Documentary | dw.com/en/tv/docfilm/s-3610 | youtube.com/@DWDocumentary | youtube-nocookie.com/embed/eiqLBV35fzc |

**What each row is:** the broadcaster's own 24/7 live stream, published by the broadcaster on its own channel, played through YouTube's embeddable player.

**Supporting evidence:**
- **YouTube's Terms of Service** permit playback of embeddable videos through the embeddable player, and the uploader grants a licence *as enabled by a feature of the Service (such as video playback or embeds)*.
- **Embeddability is the rights holder's own setting.** We cannot embed a video whose owner has disabled embedding.
- **France 24's own press release** announces that it broadcasts live 24/7 on YouTube — cited **for the France 24 row only**; it says nothing about any other broadcaster.
- The uploader recorded for each row above was obtained from **YouTube's public oEmbed response** (no API key) and independently confirmed by the channel's own live page.

*(This audit was performed once, offline, to choose what to include. The app runs no verification code at runtime; it simply embeds these channels.)*

---

## PAGES 5–6 — CLASS B: PUBLIC DOMAIN, WITH VERBATIM RIGHTS TEXT
**Playback is in-app** — the app's native player streams the file that archive.org serves. It does not open the item page.

**Every file below was verified on the actual file, not on the library's label.** We requested each file and read its real codec. This was necessary: many Internet Archive items offer several file versions, and several of the versions we originally selected turned out to be **MPEG-4 Part 2**, a format iOS decodes the audio of but **not** the picture. Those were removed. Every file below is **H.264 (`avc1`), Constrained Baseline, 640×480** — the most compatible video profile in existence.

| # | Title | Year | Rights text on the item page | Duration | Item page |
|---|---|---|---|---|---|
| 1 | **American Look (Part I)** | 1958 | **"Public Domain"** | 8.2 min | archive.org/details/American1958 |
| 2 | **Park Conscious** | 1938 | **"Public Domain"** | 7.7 min | archive.org/details/ParkCons1938 |
| 3 | **A Word to the Wives** | 1955 | **"Public Domain"** | ~14 min | archive.org/details/Wordtoth1955 |
| 4 | **All About Polymorphics** | 1959 | **"Public Domain"** | 7.4 min | archive.org/details/AllAboutPolymorphics |

All four are from the Prelinger Archives, the well-known public-domain moving-image collection. Each is a **sponsored documentary or educational film** — none is a cinema feature, a series, or a television entertainment property.

**To verify any row:** open the item page. The licence line is displayed on the page itself, in the library's own words.

**Scope note, stated plainly:** across the whole archive.org set in our catalogue — 1,724 items — we found 811 whose file is in a format iOS can play, of which **492 also carry a public-domain declaration.** We also found 18 items requiring attribution we do not yet display, and 2 under a NonCommercial licence. **The NonCommercial items are excluded** — Whisco TV is funded by advertising, which is a commercial use, and those licences do not permit it. Attribution-required items are held until the app displays creator credit. Items whose file has no playable video track are excluded entirely.

## PAGE 7 — WHAT WE REMOVED, AND WHAT WE WILL REMOVE NEXT

**Removed from iOS build 6:**
- Every channel that was carried only because a third-party HLS URL was **not published on the broadcaster's own site**.
- Channels whose stream is served from a file host rather than a broadcaster.
- Channels marked as not operating 24/7.
- **52 titles whose owners had disabled embedding** — they could not play in the app at all.
- Titles with no playable source.
- The cinema, dizi and musalsal shelves.

**Held out pending written permission:** broadcasters we would like to carry, held back rather than included because a stream happened to be publicly reachable.

**Commitment:** if anything in this build is a concern, tell us and **we will remove it within 24 hours**, without argument, and tell you what changed.

---

## PAGE 8 — HOW TO CHECK US
*(Draft. The final taps are written once seeding is complete, so that every step matches the shipped binary exactly.)*

1. Open **Live**. You will see the news broadcasters listed on pages 3–4.
2. Tap **one**. YouTube's own player loads, showing the official channel's name and its native controls. You are watching the broadcaster's own feed.
3. Open **On Demand**. No cinema or series storefront.
4. Tap **a public-domain title**. It plays in the app's player from archive.org.
5. Open the corresponding item page from pages 5–6 and read the rights line for yourself.
6. **Report a rights issue** → `legal@whisco.tv`.

---

## NOT STATED IN THIS DOCUMENT
- No third-party HLS directory is named or cited as a source or a defence, at any point.
- No free-to-air argument. A broadcaster publishing its own stream is not a licence for us to redistribute it.
- No claim of permission we do not hold, and no implication of a partnership that does not exist.
- No case law.
- No API-key-based verification claim, because no such code exists in the build.
