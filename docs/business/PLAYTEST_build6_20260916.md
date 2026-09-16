# Build 6 · Play-test sheet — 16 Sep 2026

**Rule for this sheet: you play, you report, I tick. Nobody ticks anything tonight.**

Play on the **public site** (`www.whisco.tv`). These rows are hidden from the app on purpose — the app only
shows ticked rows, so the only way to play-test them is by direct link, which is what this page is for.
Nothing here is in the public `/live` listing, so none of it is visible to App Review or to other users.

PASS = picture **and** sound within ~10 seconds, red LIVE badge where noted, no black box,
no "Video unavailable", no error 153 screen.
FAIL = black/grey box, "Video unavailable", audio with no picture, or any error screen.

---

## A. Live — 6 rows · budget ~15 s each

Each of these is the broadcaster's own official YouTube live channel, embedded through YouTube's player.
**Official chrome to expect:** YouTube's own player, with the broadcaster's name as the uploader in the
player header and their own logo/bug inside the picture.

| # | Channel | Play URL | Expected chrome |
|---|---|---|---|
| 1 | TRT World | `www.whisco.tv/live/cmu4il3780000uk1wfqypyaqw` | uploader **TRT World**, red LIVE |
| 2 | Al Jazeera English | `www.whisco.tv/live/cmu4il4n80001uk1wnn6zewgy` | uploader **Al Jazeera English**, red LIVE |
| 3 | CNA | `www.whisco.tv/live/cmu4il6gd0002uk1wljpkyk8b` | uploader **CNA**, red LIVE |
| 4 | NHK WORLD-JAPAN | `www.whisco.tv/live/cmu4il7p80003uk1w5d99qxfq` | uploader **NHK WORLD-JAPAN**, red LIVE |
| 5 | Africanews | `www.whisco.tv/live/cmu4il8rj0004uk1wzx38yigs` | uploader **africanews**, red LIVE |
| 6 | ABC News (Australia) | `www.whisco.tv/live/cmu4il9zu0005uk1wgh6kiq99` | uploader **ABC News (Australia)**, red LIVE |

In the **app** (only after ticking) each of these also shows the rights line under the player:
*"Live via the broadcaster's official YouTube channel."* Not visible on the website — check that in the app.

## B. Films — 6 rows · the ones staged false, waiting for you

Public-domain Prelinger films, each verified on the real file as H.264 (the format your phone plays).
**PASS here means picture, not just audio** — that is exactly what the Part-2 rows failed.

| # | Film | Play URL | Length |
|---|---|---|---|
| 1 | Bookbinders (1961) | `www.whisco.tv/title/bookbinders` | 13 min |
| 2 | Out of This World (1964) | `www.whisco.tv/title/out-of-this-world-2` | 13 min |
| 3 | Design for Dreaming (1956) | `www.whisco.tv/title/design-for-dreaming` | 9 min |
| 4 | San Francisco Earthquake Aftermath, Part 3 (1906) | `www.whisco.tv/title/san-francisco-earthquake-aftermath-part-3` | 8 min |
| 5 | Skateboard Sense | `www.whisco.tv/title/skateboard-sense` | 9 min |
| 6 | More Dangerous Than Dynamite | `www.whisco.tv/title/more-dangerous-than-dynamite` | 10 min |

## C. Controls — if these fail, the fault is the phone or the network, not the row

| Control | Play URL | Why it is here |
|---|---|---|
| Somoy TV | `www.whisco.tv/live/cmsor42mm00e7nn71p24aui9q` | known-good live row — your own proof that the form plays |
| American Look (Part I) | `www.whisco.tv/title/american-look-part-i` | already ticked, so it plays in the app today |

## D. Withheld on purpose — do not play-test these

- **DW Documentary — rejected.** Its "live" is a one-off online discussion, not a 24/7 channel, which fails
  the condition set for this binary. Nothing was seeded.
- **Park Conscious**, **All About Polymorphics** — already staged false, still false, no action needed tonight.

## E. What I do when you report back

1. Tick **only** the ids you name, by hand, with `--by "Ali"`. Nothing else in the database moves.
2. Then re-verify the rights pack and the store listing against the final ticked set, and hand you the exact
   text for your approval before anything is submitted.
3. Still zero: no `eas build`, no `eas submit`, no reply to Apple, no Play application, no homepage deploy,
   and no row cleared by me.

*State at the time of writing: 8 live rows in the database, 2 ticked (France 24 English, DW English);
10 staged films, 2 ticked (American Look, A Word to the Wives). Public `/live` still 623 with 0 duplicates;
the iOS view still returns exactly 2 rows. Nothing in section A or B is visible to anyone but you.*
