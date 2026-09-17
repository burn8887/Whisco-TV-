# Play Console — production access form, honest answers

**Paste these into the form. They are truthful and they are deliberately short.** Grok's instruction: do not paste
the testers/community answers, do not claim a catalogue the app does not carry, and do not claim walkthroughs or
content you never shipped.

The short version of the situation, for your own reference: Play's closed test ran a binary that showed the fat
catalogue (625 channels). **The app you are applying with is different** — it ships 8 live news channels and 8
public-domain films, because that is what is evidenced. Say that plainly if any field invites it. The smaller,
provable app is the whole point of this pass.

---

## How did you recruit testers for your closed test?

```
Recruited through a closed-testing service and a direct opt-in link shared with the Gulf expat community this app
is built for. No paid installs and no incentivised sign-ups.
```

## How many testers opted in, and for how long?

```
12 or more testers opted in, and the closed test ran for 14 days or longer. Google Play Console shows this
requirement as met. The exact install count is not something I can state precisely — a number of testers opted in
through the testing service rather than directly, so the installs figure is best read from Console.
```

**Do not invent a number here.** If the form demands a figure and Console shows one, use Console's figure.

## What feedback did you receive?

```
Light, practical UX notes — navigation, search behaviour and playback clarity. No crashes were reported by testers.
The feedback shaped the current build's list layout and the source links shown under each item.
```

## Who is the target audience?

```
Gulf expatriate households — viewers in Bahrain, Saudi Arabia, the UAE, Kuwait, Qatar and Oman who want news from
home and trustworthy free films, in English and Arabic.
```

## What value does the app provide?

```
It plays official live news channels from the broadcasters' own YouTube channels, and public-domain films from the
Internet Archive. It hosts no video files of its own and carries nothing whose rights are not documented. No signup
and no subscription are required to watch.
```

## Volume / installs question, if asked

```
Unknown. The closed test ran through a testing service, so a precise install number is not available to me. Please
use the lowest band rather than an estimate.
```

---

## Do NOT write any of these — check before submitting the form

| Never claim | Why |
|---|---|
| `500 channels`, `625`, `615`, `14,000 titles` | the app carries 8 and 8; a mismatch here is the exact thing that got the iOS build rejected |
| `Turkish series`, `dizi`, `Bollywood`, `movies` | none of it is in this build |
| `free-to-air` / `FTA` / `HLS` | no such source is used in this build |
| Any specific install number you are not reading off Console | an invented number is a false statement to Google |
| "guided testers through a walkthrough", "onboarding script", "test plan documents" | none of that was shipped; do not claim it |
| `iptv-org` or any directory name | standing rule — never cite it on any surface |

## What Grok still bars, so nothing here jumps the queue

- **Do not tap Apply for production** — he wants the new AAB on the closed track first, then the apply.
- **No homepage deploy.**
- **No ticking more catalogue rows.**
- **No Part-2 production repoint.**
- **No Apple Resolution Center contact.**
- **No AdSense re-request.**

## The order of play

1. Build the Android AAB from `whisco-mobile` `main` at **`db15dfa` or later** (that commit sends
   `X-Whisco-Store: android`).
2. Put the AAB on the **closed track** first, if Console still asks for a test release.
3. Replace the feature graphic with `store/feature-graphic-1024x500.png` and the screenshots with shots of the new
   build (see `store/play-listing.md`).
4. Paste the listing from `store/play-listing.md`.
5. This form — the answers above.
6. **Then** the Apply for production tap, which is the founder's, not mine.
