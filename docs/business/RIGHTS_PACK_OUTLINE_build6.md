# RIGHTS PACK — OUTLINE (build 6)
**Status: outline for founder/Grok review. Not final. Written to be checked, not believed.**
Per Grok's lock item 9: rights pack **≤8 pages**, **8–12 live rows with stream host = official domain**, **4 VOD rows**, **no iptv-org citation**.

Companion to the App Review Information attachment. Every claim in this document must be verifiable by tapping a link — the reviewer is our auditor, not our audience.

---

## PAGE 1 — WHAT THIS APP IS (mechanism, stated first)

The single most important page. Apple's objection was informational as much as legal: they could not tell what we actually do. Lead with the negatives, because they are absolute and provable.

- We **host no media files**. Playback is the rights holder's own player loading the rights holder's own asset from the rights holder's own servers.
- We **do not download, copy, store, transcode, re-encode or mirror** any video or audio.
- We **do not extract, decrypt, scrape or restructure** any stream URL from any player.
- We **do not circumvent DRM or any access control**.
- We **do not enable downloads, ripping, saving, converting** — the app has no such function.
- We are **not a torrent, Kodi, Xtream, M3U-import or IPTV-playlist app**. There is no playlist import screen anywhere in the binary.
- Where content plays, it plays **in the rights holder's player, with the rights holder's controls, branding, and monetisation intact** — we cannot and do not strip advertising or attribution.

**Why this page exists:** it is the difference between "a service that redistributes video" and "a service that links to videos, in the owner's own player". Only the second one is us.

---

## PAGE 2 — THE TWO CONTENT CLASSES IN THIS BUILD

Short table. No marketing.

| Class | What it is | Who controls playback | How a reviewer checks it |
|---|---|---|---|
| A. Official YouTube live embeds | The broadcaster's own 24/7 live channel, embedded from the broadcaster's own verified YouTube channel | YouTube, on the broadcaster's channel | Tap the row → YouTube's own player opens; the channel name and verification badge are visible |
| B. Public-domain works (archive.org) | Films whose copyright has lapsed, served by the Internet Archive | archive.org | Tap the row → opens the Internet Archive item page cited below |

**Explicitly not in this build:** any harvested IPTV stream, any free-to-air channel carried without written permission, any re-upload or aggregator channel, any commercial film or dizi from a third-party catalogue.

---

## PAGES 3–4 — CLASS A EVIDENCE: OFFICIAL BROADCASTER LIVE EMBEDS
*(8–12 rows. Host = youtube.com for every row. To be completed after the human play-test on a non-GCC IP.)*

| # | Channel | Broadcaster's own site | Official YouTube channel | Embed URL | Verified |
|---|---|---|---|---|---|
| 1 | France 24 English | france24.com | @France24_en | *(to pin)* | ☐ |
| 2 | DW English | dw.com | *(to pin)* | *(to pin)* | ☐ |
| 3 | TRT World | trtworld.com | *(to pin)* | *(to pin)* | ☐ |
| 4 | Al Jazeera English | aljazeera.com | *(to pin)* | *(to pin)* | ☐ |
| 5+ | *(to add, same class only: news / public-service broadcasters)* | | | | ☐ |

**Supporting evidence to cite on these pages:**
- **France 24's own press release** announcing that it broadcasts live 24/7 on YouTube in English, French and Arabic — the broadcaster publishing its own live feed on its own channel, in its own words.
- The **YouTube Terms of Service** clause permitting playback of embeddable videos through the embeddable player, and the uploader's grant of a licence *as enabled by a feature of the Service (such as video playback or embeds)*.
- A statement that **embeddability is the rights holder's own per-video setting**; we cannot and do not embed a video whose owner has disabled embedding.
- The **YouTube Data API fields** we check per video before it can be carried (`embeddable`, channel identity, licence) and where that check happens in our ingest.

**Per Grok item 2, the honest framing to include:** this document asserts the *mechanism* and shows the *broadcaster's own publication*. It does not claim a signed agreement with any broadcaster, because for this class there is none to show other than the broadcaster's own public act of publishing an embeddable live feed on their verified channel.

---

## PAGES 5–6 — CLASS B EVIDENCE: PUBLIC DOMAIN (archive.org)
*(4 rows minimum for the pack; the build may carry 30–80.)*

| # | Title | Year | Internet Archive item URL | Public-domain basis | How verified |
|---|---|---|---|---|---|
| 1 | *(to pin — the reviewer's first tap)* | | | | ☐ |
| 2 | *(to pin — second tap)* | | | | ☐ |
| 3 | | | | | ☐ |
| 4 | | | | | ☐ |

**For each row we must be able to state:** the work's publication date, the reason its copyright has lapsed in the relevant jurisdiction, and the Internet Archive item page that supports its use — with the item's own rights statement, not our paraphrase.

**Note to the founder and Grok — a real risk to resolve before this pack is written:** for pre-1929 US works the basis is straightforwardly publication date. For later works the basis is *not* simply "it is on archive.org" — the uploader's own rights statement on the item page governs, and some archive.org items are uploaded without a valid basis. **We should only clear items whose item page carries an explicit public-domain or permissive statement, and record that statement verbatim.** Anything else fails the "documentary evidence" test Apple set.

---

## PAGE 7 — WHAT WE REMOVED, AND WHAT WE WILL REMOVE NEXT

This page is deliberately here. Apple's remedy offered two paths — evidence, or removal — and showing that we exercised the second path unprompted is the strongest available signal of good faith.

- **Removed from the App Store build:** every harvested channel from the community index; the Bangladesh commercial networks in Apple's screenshot; every channel whose stream host does not match the broadcaster's own domain; channels marked not-24/7; channels whose stream resolves to a file server rather than a broadcaster.
- **Held out pending written permission:** broadcasters we would like to carry, held back rather than shipped on the argument that a stream was publicly reachable.
- **Removed entirely:** titles with no playable source.
- **Commitment:** if any item in this build is a concern to you, **tell us and we will remove it within 24 hours**, without argument, and tell you what we changed.

---

## PAGE 8 — HOW TO VERIFY US IN THREE MINUTES

Numbered taps, written for a reviewer holding an iPad, from a non-GCC IP.

1. Open **Live**. Two or three rows, each a news or public-service broadcaster.
2. Tap **one**. YouTube's own player loads. Note the channel name and the verification badge — you are watching the broadcaster's own feed, not our copy of it.
3. Open **On Demand**. No cinema posters, no dizi shelves. Documentaries and public-domain classics.
4. Tap **the public-domain title**. The Internet Archive page for that item opens, showing its own rights statement.
5. On any title, tap **Source** → the rights holder's own page opens.
6. If anything looks wrong, tap **Report a rights issue** → `legal@whisco.tv`.

---

## DELIBERATELY ABSENT FROM THIS DOCUMENT

Per Grok's lock:
- **No citation of iptv-org** or any other community index, anywhere, as a source or as a defence.
- **No Bahrain HLS rows.** The Bahrain family failed the four-point test on 2026-09-15 (stream host `5c7b683162943.streamlock.net` is a generic CDN, and the URL traces to an anonymous 2022 community submission that was publicly reported broken in 2025). They are out of the build and out of this pack.
- **No free-to-air argument.** A broadcaster publishing its own stream is not a licence for us to redistribute it. That sentence was in our last submission and it is the most likely reason Apple judged our document insufficient.
- **No case law.** Per Grok: do not cite Townsquare or US embed jurisprudence to App Review.
- **No claim of permission we do not hold**, and no implication of a partnership that does not exist.

---

## OPEN ITEMS BEFORE THIS PACK CAN BE FINALISED

1. **Human play-test on a non-GCC IP** for every Class A row — playback, and that the official player and channel identity are visible. Owner: founder or a non-GCC machine. Status: **not started**.
2. **Pin the two reviewer titles** (item 9 of the lock): one archive.org, one official documentary/news embed. Status: **not started — dependent on 1**.
3. **Reconcile Class B rights basis per item** (see the risk note on pages 5–6). Status: **not started**.
4. **Yahoo/Google verification of remaining broadcaster candidates** beyond the four named. Status: **not started**.
5. **Page count check** — the outline fits 8 pages only if the live table stays at 12 rows and the VOD table at 4. Status: **on track**.
