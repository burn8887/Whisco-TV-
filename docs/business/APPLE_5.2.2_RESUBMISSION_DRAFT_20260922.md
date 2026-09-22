# APPLE 5.2.2 — RESUBMISSION DRAFT SET
**For Desk edit before the founder clicks. Prepared 22 September 2026, 00:50 UTC.**
Submission `c80e30c4-5e07-4911-bb77-2ed58fd09caf` · Version 1.0 (build 7) · Resubmitting the SAME binary.

Three parts: **(A)** cover note for App Review Information · **(B)** 16-row evidence appendix (goes with
the build-7 rights statement as one attachment) · **(C)** Resolution Center letter.

**Desk constraints honoured throughout:** build 7 named explicitly · the 8+8 gate stated · the
15 September 615-channel screenshot identified as the old binary · the banned content-free
phrasing (see Desk ruling 22 Sep, item 2) appears in none of the three parts · no claim we
cannot point a reviewer at.

---
---

# (A) COVER NOTE — paste into App Review Information → Notes

```
WHISCO TV 1.0 (BUILD 7) — RESPONSE TO GUIDELINE 5.2.2
Submission ID: c80e30c4-5e07-4911-bb77-2ed58fd09caf
Version under review: 1.0 (build 7)

Attachments:
  1. This cover note.
  2. Whisco_TV_Content_Rights_Statement_build7.pdf — the rights statement for this
     build, with a 16-row per-item evidence appendix (8 live channels, 8 films).


1. WHICH BINARY IS IN FRONT OF YOU

Build 7, uploaded 17 September 2026 at 05:18 PT (12:18 UTC) and submitted the same
day at 23:43 UTC. It carries eight live news channels and eight public-domain films.
That upper bound is enforced by the server the app talks to, not by hiding screens:
this build identifies itself to our API, and the API returns only rows a person has
cleared and evidenced.

Measured on the production API this week, using the same header build 7 sends
(X-Whisco-Store: ios):

  /live                                  -> 8 items
  /vod                                   -> 8 titles
  /home                                  -> reports 8 channels, 8 titles
  /title/cennetin-cocuklari              -> HTTP 404  (a title outside the cleared set)
  /title/kurulus-osman                   -> HTTP 404
  Web requests without that header       -> the public website, unaffected


2. THE 615-CHANNEL SCREENSHOT FROM 15 SEPTEMBER IS THE OLDER BINARY

The screenshot attached to the 15 September rejection shows the Live TV tab reading
"615 channels" — Bahrain TV, Bahrain International, Bahrain Quran, Bahrain Sports 1
and 2, ATN Bangla, NTV, Ekushey TV, Bangla Vision, Green TV — with language filters
for Arabic (164), Hindi (142), English (72), Turkish (50), Urdu (31), Indonesian (27)
and Vietnamese (26).

That was build 5, and the finding was correct for build 5. Build 7 cannot show that
screen. None of those rows are in the catalogue this build is served, the iOS live
list carries no language filters, and the Home screen's own counts read "8+ live
channels · 8+ free titles".


3. WHAT THIS BUILD DOES WITH VIDEO

The eight live channels are the broadcasters' own 24/7 streams, played inside
YouTube's embedded player. They are addressed as
youtube.com/embed/live_stream?channel=<CHANNEL_ID>, where each <CHANNEL_ID> is the
broadcaster's own verified channel. Playback happens in YouTube's player, with
YouTube's chrome and the broadcaster's own controls and monetisation intact. No
broadcaster file is copied, stored, re-encoded or re-served by us, and there is no
function in the app to save, rip, convert or export anything.

The eight films stream from archive.org's own servers. Each item page states that the
work is in the public domain, and the app's Source row opens that page so a viewer can
read the statement in the library's own words.

There is no playlist import, no M3U/Xtream screen and no user-supplied stream URL
field. This build contains no free-to-air HLS stream and no stream URL extracted from
another player.


4. EVIDENCE

Attachment 2 is the rights statement for build 7, followed by a per-item appendix
covering all sixteen rows. For each row it gives the basis on which the item is shown,
the exact file that plays, the measured format, and a public URL that anyone can open
to check the claim independently — the broadcaster's own channel, or the archive.org
item page with its licence line.


5. A CORRECTION TO THE PREVIOUS SUBMISSION

The 15 September submission carried the rights statement written for build 6. It
described the same sixteen rows, but it named the wrong build. Attachment 2 replaces
it with the statement written for build 7, which is the binary under review here.


6. GUIDELINE 2.5.4 (previous round)

The audio value has been removed from UIBackgroundModes in this build's Info.plist.
The app does not play audio while backgrounded.


Contact: Ali Albaharna — legal@whisco.tv
```

---
---

# (B) 16-ROW EVIDENCE APPENDIX

*Attach immediately after the build-7 rights statement. Every URL below was opened on
22 September 2026 and returned HTTP 200. Format, size and checksum for the films come from
archive.org's own metadata service for the exact file the app streams.*

## B.1 — Eight live channels

All eight play as `youtube.com/embed/live_stream?channel=<ID>`. The ID is the broadcaster's own
channel; the link in the last column is that channel, openable by anyone.

| # | Channel | Country | Broadcaster channel ID | Embed | Evidence (open this) |
|---|---|---|---|---|---|
| 1 | France 24 English | France | `UCQfwfsi5VrQ8yKZ-UWmAEFg` | `youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UWmAEFg` | https://www.youtube.com/@France24_en |
| 2 | DW English | Germany | `UCknLrEdhRCp1aegoMqRaCZg` | `youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg` | https://www.youtube.com/@dwnews |
| 3 | TRT World | Türkiye | `UC7fWeaHhqgM4Ry-RMpM2YYw` | `youtube.com/embed/live_stream?channel=UC7fWeaHhqgM4Ry-RMpM2YYw` | https://www.youtube.com/@trtworld |
| 4 | Al Jazeera English | Qatar | `UCNye-wNBqNL5ZzHSJj3l8Bg` | `youtube.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg` | https://www.youtube.com/@aljazeeraenglish |
| 5 | CNA | Singapore | `UC83jt4dlz1Gjl58fzQrrKZg` | `youtube.com/embed/live_stream?channel=UC83jt4dlz1Gjl58fzQrrKZg` | https://www.youtube.com/@channelnewsasia |
| 6 | NHK WORLD-JAPAN | Japan | `UCSPEjw8F2nQDtmUKPFNF7_A` | `youtube.com/embed/live_stream?channel=UCSPEjw8F2nQDtmUKPFNF7_A` | https://www.youtube.com/@NHKWORLDJAPAN |
| 7 | Africanews | Pan-African | `UC1_E8NeF5QHY2dtdLRBCCLA` | `youtube.com/embed/live_stream?channel=UC1_E8NeF5QHY2dtdLRBCCLA` | https://www.youtube.com/@africanews |
| 8 | ABC News (Australia) | Australia | `UCVgO39Bk5sMo66-6o6Spn6Q` | `youtube.com/embed/live_stream?channel=UCVgO39Bk5sMo66-6o6Spn6Q` | https://www.youtube.com/@abcnewsaustralia |

**Basis, stated plainly:** each channel is a national or public broadcaster publishing its own
round-the-clock news stream on its own verified channel, with embedding made available by that
broadcaster. We do not hold carriage agreements with them, and we do not claim to. The app hands
playback to the broadcaster's stream and shows whose stream it is: the player chrome, the channel
name and a **Source** row that opens the channel itself. If a broadcaster objects, one email to
legal@whisco.tv removes the row.

## B.2 — Eight public-domain films

All eight stream the exact `.mp4` file that the Internet Archive publishes for the item, from
archive.org's own servers. Licence and format below come from the Archive's metadata for that file.

| # | Title | Year | Identifier | Item page (open this) | Licence declared on the item | Format | Size (bytes) | MD5 |
|---|---|---|---|---|---|---|---|---|
| 1 | American Look (Part I) | 1958 | `American1958` | https://archive.org/details/American1958 | CC Public Domain (`creativecommons.org/licenses/publicdomain/`) | h.264, 640×480, 491 s | 51,110,003 | `34a2312a7d3cefe85db6415ca51cc17a` |
| 2 | Word to the Wives, A | 1955 | `Wordtoth1955` | https://archive.org/details/Wordtoth1955 | CC Public Domain | h.264, 640×480, 809 s | 84,013,067 | `d9116ac558bb92d150a0d1f6f56c67f5` |
| 3 | Bookbinders | 1961 | `Bookbind1961` | https://archive.org/details/Bookbind1961 | CC Public Domain | h.264, 640×480, 804 s | 83,900,696 | `41c20deb573006809f762cac114eda57` |
| 4 | Out of This World | 1964 | `out_of_this_world` | https://archive.org/details/out_of_this_world | CC Public Domain | h.264, 640×480, 796 s | 82,893,771 | `77a51753382c4304a711d44193262120` |
| 5 | Design for Dreaming | 1956 | `Designfo1956` | https://archive.org/details/Designfo1956 | CC Public Domain | h.264, 640×480, 557 s | 57,947,878 | `c1aedd09afdb71018155977eee48e689` |
| 6 | Skateboard Sense | 1950 | `skateboard_sense` | https://archive.org/details/skateboard_sense | CC Public Domain | h.264, 640×480, 554 s | 57,682,001 | `eaa061e38203654600dfe02fc1e3c09b` |
| 7 | More Dangerous Than Dynamite | 1950 | `more_dangerous_then_dynamite` | https://archive.org/details/more_dangerous_then_dynamite | CC Public Domain | h.264, 640×480, 589 s | 61,414,346 | `3fe711a21db3bea33057db6ce7b7900b` |
| 8 | San Francisco Earthquake Aftermath, Part 3 | 1906 | `SanFranc1906_3` | https://archive.org/details/SanFranc1906_3 | CC Public Domain | h.264, 640×480, 464 s | 48,400,722 | `675e6f9fb3749cc5ef3597220af90f1b` |

All eight items sit in the Archive's **Prelinger** collection. Each item page carries its own Public
Domain statement and licence URL — the link in column 5 is the checkable evidence, and it is the same
page the app's **Source** row opens for the viewer.

**Basis, stated plainly:** every film is a work the Internet Archive publishes as public domain, with
the declaration on the item's own page. The app plays the file the Archive serves and opens that page
so the declaration can be read in the library's own words.

## B.3 — What none of the sixteen rows is

Not a pay-TV or premium channel. Not a subscription service's catalogue. Not a sports rights holder's
protected content. No row was obtained by extracting a stream URL from another player, and none
requires circumventing an access control or DRM. There is no download, save, convert or export
function anywhere in the app.

---
---

# (C) RESOLUTION CENTER LETTER

*Paste into App Review → Resolution Center. The founder attaches the two documents in App Review
Information, pastes this, then resubmits the same build 7.*

```
Hello, and thank you for the specific and actionable note.

We are resubmitting the same binary — version 1.0, build 7. No new build is required
for this response: the issue is documentation, so we have supplied it rather than
changed the app.

What we have attached:

  1. A cover note describing this build.
  2. The content rights statement written for build 7, followed by a 16-row
     evidence appendix — one row per item the app can show, with the licence line,
     the exact file that plays, its measured format, and a public URL your reviewer
     can open to verify the claim independently.

Two things worth flagging, because they bear directly on the finding.

First, a correction. Our previous submission carried the rights statement written for
build 6. It described the same sixteen rows but named the wrong build, and we are sorry
for the confusion that may have caused. The document attached now is written for
build 7, the binary under review.

Second, the screenshot attached to the 15 September rejection shows the Live TV tab
reading "615 channels". That is the older binary. Build 7 cannot display that screen:
it is served a catalogue of eight cleared live channels and eight public-domain films,
a deep link to anything outside that set returns HTTP 404, and the home screen's own
counts read "8+ live channels · 8+ free titles". We also note that guideline 2.5.4
from the earlier round is closed — the audio value was removed from UIBackgroundModes
in this build.

On the eight live channels: each is a broadcaster publishing its own 24/7 news stream
on its own verified channel, played inside YouTube's embedded player. On the eight
films: each is a title the Internet Archive publishes as public domain, streaming from
the Archive's own servers, with the declaration printed on the item page the app links
to. The appendix gives both sets row by row.

If any single row still does not meet the bar, we would rather know than argue: tell us
which one and we will remove it. We will also remove any row a rights holder flags,
within 24 hours, at legal@whisco.tv.

Thank you for your time.

Ali Albaharna
Whisco TV
legal@whisco.tv
```

---

## Founder click path

1. App Store Connect → **Whisco TV** → **App Store** → version **1.0** → **App Review Information**.
2. Attach the **build-7 rights statement + appendix** (one PDF) and the **cover note**.
3. Open **Resolution Center** → paste **part (C)** → send.
4. Return to the version → **Resubmit to App Review** — **the same build 7**. Do not upload a build.
5. Reply with a screenshot of the submitted state.

---

## Open, flagged, not acted on

- **`app/(tabs)/index.tsx` still carries the banner line "Life's better at full speed — and full
  free."** That exact phrase is on the Design System §1.4 forbidden list, and it is live in build 7's
  Home screen. Left alone because fixing it needs a **new binary**, which is barred this round. It
  should be fixed in the next build regardless of how 5.2.2 resolves.
