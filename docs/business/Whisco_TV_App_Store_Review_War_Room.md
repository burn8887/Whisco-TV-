# Whisco TV — App Store Review War Room
**Playbook v1.0 · 7 September 2026 · Internal only**

iOS submitted **2 September 2026**. This document is the IF/THEN book for that review and every review after it.

Do not invent traffic numbers in any reply to Apple. Do not compare Whisco to pirate IPTV as a “competitor we beat.” Do not claim licences we do not have. Do not attach falsified documents — Apple’s Program License Agreement §3.2(f) makes that an account-termination event.

---

## 0. How to use this book

1. Identify the exact guideline number in the Resolution Center message. Apple often cites more than one. Answer each citation in its own block.
2. Open the matching section below. Copy the template. Fill the bracketed facts. Attach the evidence pack listed for that citation.
3. Decide the **channel**: Resolution Center reply (default), new binary + reply (if the build must change), App Review Board appeal (only after a second identical rejection on a clean argument), or status inquiry (only on the calendar in §4).
4. Tone rule for every message: short, factual, no emotion, no “other apps do this,” no accusation that the reviewer is wrong. Reviewers read thousands of these. Evidence wins. Argument loses.

**Default posture for Whisco:** we are not an IPTV playlist player and we must never sound like one. BYOP/M3U apps survive 5.2.3 by saying “we ship no content.” Whisco ships a curated catalogue. Our defence is the opposite: official FTA streams, official YouTube embeds of videos the rights holder set to embeddable, public-domain titles, automated geo/rights checks, no save/download/convert, and a working takedown desk at legal@whisco.tv.

---

## 1. What Apple actually rejects in this category (2024–2026)

Apple does not publish a streaming-app rejection table. The pattern below is compiled from the current App Review Guidelines (June 2026 text), Developer Forums threads, r/iosdev and r/iOSProgramming posts in 2025–2026, radio-app vendor playbooks, and 2026 appeal guides.

### 1.1 Guideline 5.2.3 — Audio/Video Downloading / unauthorised third-party streaming

**The text Apple uses.** Apps must not facilitate illegal file sharing or include the ability to save, convert, or download media from third-party sources (YouTube, Apple Music, SoundCloud, Vimeo, etc.) without explicit authorisation. Streaming of audio/video may also violate a source’s Terms of Use. Authorisation must be provided upon request.

**The canned rejection** (seen across radio, movie, and “live TV” apps since at least 2022 and still live in 2026):

> Your app contains content or features that may violate the rights of one or more third parties. Specifically, your app provides potentially unauthorized access to third-party audio or video streaming, catalogs, and discovery services.
>
> Next Steps: attach documentary evidence in the App Review Information section evidencing that you have all necessary rights or permissions to the third-party audio or video streaming, catalogs, and discovery services in your app.

**Why it fires on free live-TV / VOD apps**

| Pattern reviewers actually saw | Real examples (forums / Reddit) | What Apple asked for |
|---|---|---|
| Public radio-station directory (Radio-Browser.info, Icecast/Shoutcast lists) with no per-station licences | Radio Player Mini (macOS, Aug 2026, Board upheld 5.2.3); Radio-Browser iOS apps Sep 2024 and Feb 2026 (r/iosdev); FM-station update Jan 2026 (r/iOSProgramming) | Direct licensing with each station, or proof the directory conveys redistribution rights, or restrict the app to “open-source stations only” |
| Movie / series catalogue on Cloudflare or similar CDN with no licences attached | Movie app, Mar 2025, Developer Forums thread 776749 | “Evidence that you have a right to stream the content” — licences |
| YouTube-hosted films/TV shown inside an app, even via official embed / Data API | Kids curated-YouTube app, 2018–2020 thread 111383 (pattern still cited); Vision Pro Juno removed 2024 after Google complaint | Documentary evidence of right to use the titles, plus YouTube ToS compliance; brand/trademark issues separately |
| Download / save / convert of third-party media | Instagram saver (2019, still the textbook 5.2.3); Facebook video downloaders | Signed authorisation from the platform — which those platforms will not give |
| “We only play public URLs” with no rights theory | Generic 5.2.3 binary rejections 2020–2025 | Documentary evidence. A public URL is not a licence |

**What does *not* work as a 5.2.3 answer**

- “Other radio / IPTV / YouTube apps are on the store.” Reviewers and Forum staff repeat this: another app’s presence is not a defence.
- A directory ToS that licences *metadata*, not the audio/video (Radio-Browser.info is the current case study; the Board rejected that package in Aug 2026).
- A founder affidavit that says “I believe this is legal” with no source-by-source theory.
- Pointing at pirate-adjacent IPTV players. Those apps survive by shipping **no catalogue**. Whisco ships a catalogue.

**What has worked, when it has worked**

- Per-partner broadcast licences or written permissions, dated, named, signed, attached as PDF (podcast app example in 2026 appeal write-ups: 2024 partner licences + DRM note + “contact us for rights verification”).
- A signed letter from the rights holder on letterhead naming the developer account, the app, the territory, and the scope (stream only / no download).
- For a *single-station* radio app: the station’s own broadcast licence plus a letter that the developer account is the station or is authorised by the station (Nobex vendor playbook).
- For official-embed products: proof the player is the official YouTube IFrame Player (not a custom downloader), that embeds are only of videos the owner marked embeddable, that ads are not blocked, and that YouTube ToS is followed. This is necessary but **not always sufficient** if the catalogue *looks like* a movie store of copyrighted films.

**Whisco-specific risk grade: HIGH.** We ship ~600 live channels and ~15.7k VOD titles. A reviewer who opens “Hindi cinema” or a Turkish series shelf will assume unlicensed catalogue unless the notes and the evidence pack make the sourcing doctrine obvious in under two minutes.

### 1.2 Guideline 5.2.2 — Third-party sites / services

**The text.** If the app uses, accesses, monetises access to, or displays content from a third-party service, it must be specifically permitted under that service’s terms. Authorisation on request.

**How it hits streaming apps.** YouTube, a national broadcaster’s site, or an official live page is a “third-party service.” Embedding is allowed only inside that service’s ToS. Juno (Vision Pro YouTube client, removed Oct 2024 after Google complained) is the cautionary tale: a WebView of youtube.com plus “unofficial” in the subtitle was not enough once the rights holder objected.

**Whisco-specific risk grade: MEDIUM-HIGH** on the YouTube-embed VOD shelf; LOW on FTA streams that we do not wrap in a third-party API we are not allowed to use.

### 1.3 Guideline 5.2.1 — General IP / trademarks / who submits

**How it hits.** Channel logos, show artwork, “Zee / Shahid / Netflix / YouTube” in the name, subtitle, keywords, or screenshots; submitting from an account that does not own the product; copycat chrome.

November 2025 added 4.1(c): you cannot use another developer’s icon, brand, or product name in your icon or name without approval.

**Whisco-specific risk grade: MEDIUM.** Our name and dog-mark are original. The risk is channel bugs, title-card artwork scraped from TMDB/TVDB without a licence, and any screenshot that shows a third-party wordmark as if it were ours. TV Time was pulled in Nov 2024 over user-uploaded cover art after a rights complaint reached Apple — even after a DMCA process. Artwork is not a small issue.

### 1.4 Guideline 4.2 / 4.2.2 — Minimum functionality / not a website in a wrapper

**The text.** The app must elevate beyond a repackaged website. Other than catalogues, apps should not primarily be marketing materials, web clippings, content aggregators, or a collection of links.

**The canned rejection:**

> We noticed that your app only includes links, images, or content aggregated from the Internet with limited or no native iOS functionality… since it does not sufficiently differ from a mobile web browsing experience, it is not appropriate for the App Store.

**What reviewers actually test**

- Airplane Mode on first launch. A white WKWebView or Safari error = wrapper.
- Whether push, share sheet, or Core Location were bolted on as a fig leaf. Apple’s own rejection text says those are not enough.
- Whether the UI is native navigation (tabs, native search, native player chrome, PiP, AirPlay, on-device watchlist) or a full-screen WebView of whisco.tv.

**Real examples.** News/video aggregators rejected even with offline downloads and push (Developer Forums, historical but the wording is unchanged). 2026 compliance write-ups still treat “WKWebView of the marketing site” as the #1 4.2 failure.

**Whisco-specific risk grade: HIGH if the iOS binary is a WebView of whisco.tv; LOW-MEDIUM if it is a native shell with on-device watchlist/resume, native player or official embed player, search, favorites, and a native empty/offline state.** Do not argue 4.2 by listing “we have a website too.” Argue the native work the website cannot do.

### 1.5 Guideline 2.3 and 2.3.x — Accurate metadata

Common 2025–2026 metadata hits for media apps:

| Sub-rule | Typical trigger | Streaming-app flavour |
|---|---|---|
| 2.3 / 2.3.1 | Description or screenshots promise features not in the build; “coming soon” as a core claim | “600 live channels / 15k titles” if the reviewer build is empty or geo-blocked to zero |
| 2.3.3 | Screenshots are splash, login, or marketing art, not the app in use | Lifestyle living-room photos instead of the actual player |
| 2.3.7 | Keywords or subtitle stuffed with competitor names, trademarks, prices, “#1” | “better than Shahid / OSN / ZEE5”, “free Netflix”, channel brand names in keywords |
| 2.3.8 | Screenshot not 4+ safe | A paused frame from an adult-adjacent title |
| 2.3.9 | No rights to screenshot artwork; real people’s accounts in shots | TMDB/TVDB art in listing screenshots |
| 2.3.10 | Android chrome, Play Store badges, “also on Android” in iOS metadata | Dual-platform marketing copy in the iOS listing |

**Whisco-specific risk grade: MEDIUM.** Easy to fix. Do it before a resubmit so it does not burn a review cycle.

### 1.6 Other citations that travel with this category

- **2.1 Completeness.** Broken streams on the reviewer’s network, placeholder rows, demo account missing, backend down during review. First-app 2.1 “gift packs” (several issues at once) are common.
- **5.1.1 Privacy.** Privacy Nutrition Labels must match the binary. Whisco doctrine is “Data Not Collected” on both stores and no analytics SDKs until v1.1. If the binary contains anything that collects, the label is a lie and this citation is earned.
- **1.2 UGC.** Only if users can publish. Community posting is human-only on our side; if the app has no user-publish surface, say so.
- **3.1.1 Payments.** We are free forever. Do not mention tips, paid unlocks, or external paywalls in notes.

---

## 2. Evidence packages that have cleared 5.2.x — and the Whisco pack to pre-build

Apple’s Legal queue does not want a brief. It wants **documents a second reviewer can file**: named parties, dates, scope, territory, signature or official URL.

### 2.1 What successful 5.2.3 packages contained (observed)

1. **Licence or permission PDF** — broadcast licence, content licence, or letter of authorisation. On letterhead. Names the developer / app / territory / rights (stream, no download). Dated. Signed.
2. **Architecture note (1 page)** — we do not save, convert, or download; player is official embed or our licensed player; no stream ripping.
3. **Takedown / rights-verification contact** published in-app and on the site. The 2026 podcast example explicitly cited this and it was treated as supporting, not sufficient on its own.
4. **Partner list or source schedule** if the catalogue is large — not 15,000 rows. A representative schedule plus the *rule* that generates the rest.
5. **Demo path** so the reviewer hits a clearly legal title in two taps (public-domain short, official FTA news channel, official broadcaster YouTube embed with the YouTube chrome visible).

### 2.2 What failed

- Radio-Browser.info ToS + “stations add themselves.” Board, Aug 2026: documentation did not prove rights to stream the audio.
- “I own my recordings” without studio/work-for-hire paper, when the reviewer thought the files were third-party.
- YouTube Data API access alone, when the catalogue was copyrighted movies/TV.

### 2.3 Whisco evidence pack — build this now, attach on first 5.2.x bounce

Prepare as a single PDF, max 12 pages, plus a short screen recording. File name: `WhiscoTV_Content_Rights_Pack_2026-09.pdf`.

**Page 1 — Cover statement (founder signed)**

- App name, bundle ID, Apple ID, developer account legal name.
- One paragraph: Whisco TV is a free AVOD/FAST service. It does not sell subscriptions, does not ship M3U playlists, does not geo-unblock pay-TV, and does not provide a download or convert function.
- Sourcing rule in four bullets: official broadcaster streams and official embeds; free-to-air; public domain; later, written licences (Filmhub and others). Nothing else is listed.
- Takedown: legal@whisco.tv. Response target: 48 hours. Confirmed URL of the public policy page.
- Signature block: Ali Albaharna, founder, Bahrain, date.

**Page 2 — How a title reaches the catalogue (the rule, not the dump)**

1. Source must be an official broadcaster page, official live stream, official YouTube/embed with embed permitted by the owner, FTA transmission, public-domain file, or a written licence.
2. Automated checks before display: embeddability, duration sanity, per-country geo for BH / SA / AE / KW / QA / OM, sanctioned-source blacklist.
3. Fail = hide, never show broken.
4. Health check of live streams every 6 hours; dead streams delisted automatically.
5. Humans do not paste random m3u URLs into production.

**Page 3 — Live TV theory**

- Live shelf is free-to-air and official streams, not paid bouquets.
- We do not decrypt, do not proxy pay-TV, do not bundle user-supplied playlists.
- Representative 8–12 channels with: channel name, official source page URL, stream type (official HLS / official embed / FTA), GCC geo note.
- Do not attach 581 rows.

**Page 4 — VOD theory, YouTube embeds**

- Most current VOD plays in the **official YouTube IFrame Player**.
- We do not use a custom extractor, do not call googlevideo progressive URLs, do not offer Save to Camera Roll, do not block ads in the YouTube player.
- YouTube’s own terms permit embedding of videos the uploader has allowed to be embedded. We only list videos that pass an embeddability check.
- In those plays the originating channel earns in-player ads; Whisco earns page display ads only. State this plainly so the reviewer does not think we are monetising YouTube’s bytes.
- Attach: link to YouTube API / IFrame Player ToS and the Required Minimum Functionality page (identification via Referer / bundle ID). Confirm the iOS player sends the required client identity.

**Page 5 — VOD theory, public domain and official libraries**

- Named public-domain or official-library examples (2–4 titles) with the source page.
- Statement that copyrighted cinema is listed only when the file or embed is official and embeddable, or when a written licence exists.
- Filmhub: “application in progress; no Filmhub titles are in the current review binary unless a licence is in hand.” Do not preview unlicensed Filmhub titles to the reviewer.

**Page 6 — What the app must not do (and does not)**

Checklist with a “not present in this binary” line for each: save/download/convert; M3U import; Xtream/Stalker login; VPN/unblocker; torrent/P2P; stream-rip; sideload of third-party playlists.

**Page 7 — Takedown desk**

- Paste the public takedown URL and the legal@ address.
- One-paragraph process: notice in → title hidden → source reviewed → restore only if the listing was a false positive.
- Offer to add a public “Report rights issue” link in the iOS app if it is not already there. If it is not there, add it before the next binary.

**Page 8 — Reviewer path (two taps to a clean title)**

Write the exact taps:

1. Open app → Live → [named FTA news channel].
2. Open app → On Demand → [named official embed or public-domain title] → confirm YouTube chrome is visible.

Attach a 60–90 second screen recording of that path.

**Do not include** traffic claims, fundraising language, pirate-IPTV market-size slides, or competitor-bashing. Apple Legal is not an investor.

### 2.4 How to attach

- Resolution Center: Attach File under the reply.
- Also upload the same PDF in App Store Connect → App Review Information → Notes, and paste a 6–8 line summary in Notes so a reviewer who never opens the PDF still sees the doctrine.
- Keep a copy. 5.2.3 often repeats on later updates (radio developers treat the pack as a standing file).

---

## 3. Resolution Center: tone, length, structure, templates

### 3.1 Rules that held up in 2025–2026 write-ups

- **Channel.** Resolution Center first. Board appeal only after the same citation comes back on a complete evidence pack.
- **Length.** 150–350 words per cited guideline. Under 400 words for a Board letter. Reviewers punish walls of text.
- **Tone.** Thank you / here is the fact / here is the document / here is the tap path / we are available. No sarcasm, no “you are inconsistent,” no “JioCinema is allowed so we should be.”
- **Structure.**
  1. Thanks + guideline number.
  2. What the app is, in one sentence.
  3. Why this guideline is met, in bullets.
  4. What is attached.
  5. Reviewer path (taps).
  6. Offer of a call if they want one.
- **Binary rule.** If the fix is a code or metadata change, upload the new build *before* or *with* the reply and name the new version/build. A reply without a new binary, when the binary is the problem, bounces the same citation.
- **One appeal per rejected submission** on the Board form. Do not stack appeals.

### 3.2 IF rejected for 5.2.3 → respond with this

**When to use.** First 5.2.3 on the current binary, catalogue unchanged.

```
Hello App Review,

Thank you for reviewing Whisco TV (version [X.Y], build [N]).

The rejection cites Guideline 5.2.3. Whisco TV does not provide unauthorised access to third-party media, does not include save/download/convert, and does not ship user-supplied IPTV playlists.

What the app streams
• Live: official free-to-air and official broadcaster streams only. Dead endpoints are health-checked every six hours and hidden automatically.
• On demand: official broadcaster embeds (YouTube IFrame Player on videos the rights holder has allowed to be embedded), public-domain titles, and titles under written licence. Titles that fail embeddability or GCC geo checks are hidden, not shown broken.

What the app does not do
The binary has no M3U/Xtream import, no download or conversion, no stream ripping, and no geo-unblock of pay television.

Rights and notices
Sourcing rules, a representative source schedule, the YouTube IFrame Player / Terms position, and our takedown process are in the attached PDF (WhiscoTV_Content_Rights_Pack_2026-09.pdf). Rights-holder notices: legal@whisco.tv.

Reviewer path (no account required)
1. Live → [NAME OF FTA CHANNEL] — official source.
2. On Demand → [NAME OF OFFICIAL EMBED OR PUBLIC-DOMAIN TITLE] — official player chrome visible.

Please let us know if you need a specific title pulled from this build or additional documents on a named source. We will remove any title on request while the underlying source is reviewed.

Thank you,
Ali Albaharna
Whisco TV
legal@whisco.tv
```

**Attach:** the rights pack PDF + 60–90s screen recording.

**If they reply “still unauthorised” and name a shelf or title:** do not re-argue the doctrine. Hide the named shelf or title in a new build, say so in one paragraph, and resubmit. Offer to restore only with a written licence. That is how radio apps eventually ship: they shrink the catalogue to what they can paper.

**If they reply “limit to open-source / public-domain only”** (the Radio-Browser formulation): take it. Ship a “review-safe” catalogue (FTA news + public domain + official embeds with the YouTube chrome unmistakable) and grow licensed shelves after approval. Getting onto the store beats winning the philosophy argument.

### 3.3 IF rejected for 5.2.2 (YouTube / third-party service) → respond with this

```
Hello App Review,

Thank you for reviewing Whisco TV (version [X.Y], build [N]). The rejection cites Guideline 5.2.2.

Where the app displays YouTube-hosted video, it does so through the official YouTube IFrame Player, not a custom downloader. We only list videos that pass an embeddability check (the rights holder allowed embedding). We do not block ads in that player, do not override YouTube chrome, and do not offer save-to-device. Client identification is sent as required by YouTube’s Required Minimum Functionality rules.

YouTube’s Terms permit embedding of videos the uploader has marked embeddable. Authorisation to use the official player is the published YouTube IFrame Player / API Terms; we do not claim a separate content licence from YouTube for the underlying films or series. Those rights sit with the uploading official channel, which is why we only embed when that channel has enabled embedding.

Attached: one-page YouTube implementation note and a screen recording that shows the official YouTube player chrome on a sample title.

Live channels in the app are official FTA / official broadcaster endpoints, not YouTube scrapes.

Happy to walk through any named title.

Thank you,
Ali Albaharna
legal@whisco.tv
```

### 3.4 IF rejected for 5.2.1 (trademark / artwork / who submits) → respond with this

```
Hello App Review,

Thank you for reviewing Whisco TV (version [X.Y], build [N]). The rejection cites Guideline 5.2.1.

Whisco TV is an original mark (named after the founder’s dog). The developer account is the founder’s, and the product is not a white-label template.

If the concern is channel or title artwork: listing art is used only as source-identifying metadata for official streams and embeds, not as our brand. We will remove any named mark or image on request. A cleaned build [N+1] is attached if you identified a specific asset.

If the concern is the developer identity: I am Ali Albaharna, founder, submitting from this account. Bahrain company formation (single-shareholder W.L.L. trading as Whisco TV) is in progress. I am the rights holder of the app itself.

Please tell us which asset or string triggered 5.2.1 if the above does not resolve it.

Thank you,
Ali Albaharna
legal@whisco.tv
```

If they flagged a specific logo in a screenshot, replace the screenshot and the in-app asset. Do not argue fair use of a broadcaster’s mark in metadata; just stop using it in the listing.

### 3.5 IF rejected for 4.2 / 4.2.2 (wrapper / aggregator) → respond with this

**Only send this if the binary is actually native enough.** If the iOS app is a full-screen WKWebView of whisco.tv, do not send a letter. Ship a native shell first.

Native bar Whisco should be able to point at (only list what is true):

- Native navigation (tabs or equivalent), not one WebView.
- On-device watchlist and resume; no account required.
- Native empty and Airplane-Mode state (not a Safari error).
- Official embed player or AVPlayer; PiP / AirPlay if present.
- Native search and favorites.
- Health-checked live catalogue with dead streams hidden.
- In-app rights report.

```
Hello App Review,

Thank you for reviewing Whisco TV (version [X.Y], build [N]). The rejection cites Guideline 4.2.

Whisco TV is not a bookmark of whisco.tv. The iOS app is a native client for a free, legal live + on-demand catalogue:

• Native information architecture and search, including an offline / no-signal state that does not fall through to a browser error.
• On-device watchlist and resume (no account, no iCloud requirement for v1).
• Live streams health-checked every six hours; dead endpoints are removed in-app rather than shown as broken web pages.
• Official embed / native playback with [PiP and AirPlay — delete if untrue].
• In-app path to report a rights issue to legal@whisco.tv.

The website exists as a separate surface. The app is the living-room client: catalogue, playback, continue-watching, and a native empty state.

Reviewer path: [two taps into Live] then Airplane Mode to see the native empty state.

A 90-second recording of those paths is attached.

Thank you,
Ali Albaharna
legal@whisco.tv
```

If they still say “web browsing experience,” the next move is product, not prose: more native chrome, less WebView.

### 3.6 IF rejected for 2.3 / metadata → respond with this

Fix the listing first. Then:

```
Hello App Review,

Thank you for reviewing Whisco TV. The rejection cites Guideline [2.3.x].

We have updated the listing so it matches this binary:
• Screenshots are captures of the submitted build in use (not marketing art or another platform).
• Name, subtitle, description, and keywords contain no third-party marks, no prices, and no unverifiable rank claims.
• Description describes only features present in build [N].
• iOS metadata does not reference Android or other stores.

Please continue review of the current binary with the corrected metadata.

Thank you,
Ali Albaharna
legal@whisco.tv
```

### 3.7 IF rejected for 2.1 (completeness / crash / empty catalogue)

```
Hello App Review,

Thank you for the 2.1 notes on Whisco TV (version [X.Y], build [N]).

[If crash:] Build [N+1] fixes the crash on [device / iOS version]. Reproduced and tested on [devices].

[If empty / geo:] The catalogue is geo-filtered to the six GCC states. If review was performed from a non-GCC IP, the shelf can look empty. Please use [review notes instruction: connect from BH/AE/SA, or we temporarily allow reviewer IPs]. A reviewer walkthrough is in Notes: Live → [channel]; On Demand → [title]. No account is required.

[If broken URL:] The live health-check hides dead endpoints every six hours. Build [N+1] pins a known-good official FTA channel and a known-good official embed on first launch so the first tap always plays.

Backend will remain up during this review. Contact: legal@whisco.tv.

Thank you,
Ali Albaharna
```

**Pre-empt 2.1 now.** If the reviewer is outside the GCC, a geo-empty catalogue looks like a hollow app. Either pin a globally playable official sample for review, or put the exact network assumption in Review Notes in one paragraph.

### 3.8 IF rejected for 5.1.1 (privacy labels)

```
Hello App Review,

Thank you. Privacy Nutrition Labels for Whisco TV are “Data Not Collected.” The v1 binary contains no analytics SDK, no account system, and no third-party tracking library. Watchlist and resume stay on-device.

The privacy policy at [URL] matches that label. If a specific endpoint or framework was flagged, please name it and we will remove it in the next build.

Thank you,
Ali Albaharna
legal@whisco.tv
```

If the binary actually collects anything, fix the binary or fix the label. Do not argue.

### 3.9 Board appeal — only after a second 5.2.x on a complete pack

Use developer.apple.com/contact/app-store/ → Appeal a Rejection. One appeal per submission.

```
Hello App Review Board,

I am appealing the rejection of Whisco TV, version [X.Y] (build [N]), dated [date]. The Resolution Center cites Guideline [5.2.3], and the message reads: “[quote the sentence].”

Whisco TV is a free, ad-supported live and on-demand client. It does not import user playlists, does not download or convert third-party media, and does not geo-unblock pay television. Every listed live endpoint is an official FTA or official broadcaster stream. Every listed on-demand title is an official embed the rights holder allowed to be embedded, a public-domain file, or a title under written licence. Failed geo or embeddability checks hide the title.

The functionality flagged is catalogue playback. Distinguishing facts versus a 5.2.3 downloader or an unlicensed IPTV reseller: official player chrome on embeds; no save/convert; automated GCC geo and embeddability checks; public takedown desk at legal@whisco.tv; rights pack attached to this submission.

Demo path (no account): Live → [channel]; On Demand → [title]. A walkthrough recording is attached to App Review Information.

I ask the Board to re-evaluate this submission under Guideline 5.2.3.

Ali Albaharna
legal@whisco.tv
```

Do not attach the investor teaser.

---

## 4. Timelines — first apps, this category, and what “stuck” means

Apple’s public line is unchanged in 2026: **on average, 90% of submissions are reviewed in less than 24 hours** (developer.apple.com/distribute/app-review). That average hides the tail, and the tail grew in 2025–2026 as submission volume rose (industry trackers: roughly +24% submissions in 2025, a much larger jump in early-2026 releases).

### 4.1 What to expect by class of submission

| Class | Typical 2026 window | Notes |
|---|---|---|
| Update from an already-approved app | 12–24 hours common; 2–3 days not rare | Fastest path, once we have v1 |
| First app, ordinary utility | 1–3 days typical; 2–5 days commonly cited for new apps in 2026 process guides | New account + new app = full read |
| First app in a sensitive pattern (media catalogue, finance, health, kids) | 2–7 days common; longer if Legal is pulled in | 5.2.3 sends the binary to Legal after the reviewer writes the canned text. Legal has no published SLA |
| After a Resolution Center reply with no new binary | 24–72 hours often | Clarification tickets can be fast |
| After a new binary resubmit | Queue restarts | Do not resubmit to “get a new reviewer” |
| App Review Board | A week or more; no live status | Use sparingly |
| Expedited review | Discretionary; rationed | Only for a dated external emergency (legal, security). A first-app launch is not that |

Tracked third-party averages in mid-2026 (Waiting for Review often ~6–14 hours by month; In Review often ~1 hour when it starts) describe the *median* consumer app. They do not describe a first-time live-TV catalogue. Treat **2–7 calendar days** as normal for us. Treat **day 7 with zero status change and zero Resolution Center message** as the first moment a status inquiry is rational.

Whisco facts: submitted **2 September 2026**. As of **7 September 2026** this is calendar day 5. That is inside the first-app + media tail. It is not “stuck.”

### 4.2 What “stuck beyond 7 days” statistically means

It usually means one of four things, in this order:

1. **Queue tail / backlog week.** Forum threads in 2025–2026 document 15–30 calendar-day waits during heavy weeks. Volume, not a secret reject.
2. **In-depth / Legal review.** 5.2.3 catalogue apps get read by someone who is looking for a pirate IPTV pattern. Silence while Legal reads the notes is common. Status may sit on Waiting for Review or In Review for days.
3. **Incomplete submission.** Missing review notes, review-account confusion, privacy questionnaire, export compliance. These delay without a rejection email.
4. **Actually stuck.** No message, no status change, 14+ days. Then inquire. Not before.

“In Review” for more than ~48 hours is a deeper look, not a crash of the queue. Do not pull the build.

### 4.3 Calendar — Whisco iOS 1.0 (submitted 2 Sep 2026)

| Elapsed | Date (2026) | Action |
|---|---|---|
| Day 0–3 | 2–5 Sep | Do nothing. Confirm Review Notes, support URL, privacy URL, and legal@ still work. Do not edit category or age rating. |
| Day 3–7 | 5–9 Sep | Watch status only. Build the rights pack PDF so it is ready the hour a 5.2.x lands. Do not inquire. |
| Day 7–14 | 9–16 Sep | If still Waiting for Review or In Review with **no** Resolution Center message: send **one** status inquiry (template §5.3). Then stop. |
| Day 14–21 | 16–23 Sep | If still silent after the inquiry: request a callback via the App Review contact form. Do not cancel-and-resubmit unless you have found a real binary defect. |
| Day 21+ | 23 Sep+ | Second contact, Board only if there is a written rejection to appeal. Pulling the binary restarts the queue at zero. |

---

## 5. Status inquiries — when they help, when they hurt, exact wording

### 5.1 When an inquiry helps

- Day 7+ of unchanged Waiting for Review or In Review, **and** no Resolution Center thread.
- After Apple posted “we are investigating” on a forum thread or contact case and then went silent for another week.
- When you must create a paper trail because a partner or store listing date is real (not a hoped-for launch week).

A polite inquiry does not move you to the front. It sometimes causes a human to look at the ticket. Developers who received a reply after a day-7 form often saw the status flip to In Review within a few days. That is the entire upside.

### 5.2 When an inquiry hurts

- Day 1–6. Reads as noise. Media apps already look like they will argue.
- Asking for expedite on a first-app launch with no dated legal/security event. Expedite is rationed; burning it here is waste.
- Cancel and resubmit to “reset” the reviewer. The new binary goes to the back. Apple has also treated identical resubmits as review-system abuse in 2026 write-ups.
- Editing primary category, age rating, or privacy answers while in queue. That can reroute the ticket.
- Stacking contacts every 48 hours. One inquiry per week maximum.
- Posting the Apple ID on public forums and @-ing App Review in anger. Forum staff will reply with the generic “contact us” blurb; it does not help Legal.
- Mentioning press, investors, or Ramadan in an inquiry. Not an emergency under Apple’s expedite rules.

### 5.3 Exact wording — day-7 status check

Channel: developer.apple.com/contact/app-store/ → App Review / status of a submission. Not the Board form. Not expedite.

```
Hello App Review,

I am requesting a status update on a first submission.

App name: Whisco TV
Apple ID: [APPLE ID]
Bundle ID: [BUNDLE ID]
Version / build: [X.Y] / [N]
Submitted: 2 September 2026
Current status in App Store Connect: [Waiting for Review / In Review]
Platform: iOS

There is no Resolution Center thread yet. Please let us know if any additional information would help complete the review. Review notes already describe our official-source / FTA / public-domain sourcing and the takedown contact legal@whisco.tv. I can attach a short content-rights PDF on request.

Thank you,
Ali Albaharna
legal@whisco.tv
```

Do not ask them to accelerate. Do not threaten a Board appeal. Do not attach the full investor pack.

### 5.4 Exact wording — day-14 follow-up (only if §5.3 had no useful reply)

```
Hello App Review,

Following up on my status request of [date] regarding Whisco TV (Apple ID [ID]), submitted 2 September 2026, currently [status] since submission.

Happy to provide a content-rights PDF, a reviewer walkthrough recording, or a call. Please advise if the submission is waiting on anything from our side.

Thank you,
Ali Albaharna
legal@whisco.tv
```

### 5.5 Exact wording — expedite (almost never, first app)

Use only if a dated, verifiable event exists (court order, active security incident, a live app already on the store that is crashing for production users). A first launch, a Filmhub call, or Ramadan 2027 is not an expedite event.

```
Hello App Review,

I am requesting expedited review of Whisco TV (Apple ID [ID], version [X.Y] build [N]) because [one sentence, dated fact].

Supporting date: [ISO date]. Submitted: [date]. Current status: [status].

Thank you,
Ali Albaharna
legal@whisco.tv
```

If you cannot fill the dated-fact sentence with something Apple would recognise as critical, do not send this form.

### 5.6 Phone call with App Review

Available from a rejection thread: “Request a call with an Apple representative.” Useful when 5.2.3 is abstract and you need them to watch the official YouTube chrome on a specific title. Book it only after the rights pack is attached so the call is a walkthrough, not a debate.

---

## 6. Pre-rejection work on the current submission (do this while we wait)

The 2 September binary is already in queue. Do **not** withdraw it to add notes unless the notes are empty or wrong. You *can* still check these:

1. **Review Notes** in App Store Connect still explain sourcing in ≤200 words, name legal@whisco.tv, and give the two-tap path. If notes were vague, a status-inquiry window is the moment to offer the PDF — not a reason to pull the build.
2. **Support URL and Privacy Policy URL** load, are mobile-readable, and match “Data Not Collected.”
3. **First-launch catalogue** is not empty from a US/EU reviewer IP. If it will be, add one sentence to Notes: “Catalogue is GCC-geo-filtered; sample official FTA channel X and official embed Y are pinned for review.” If they are not pinned, the next binary must pin them.
4. **No download button** anywhere in the player chrome.
5. **Screenshots** are the iOS app in use, 4+ safe, no Android badges, no competitor names.
6. **Rights pack PDF** drafted and sitting on disk so a 5.2.3 can be answered the same day.
7. **In-app “Report a rights issue”** that opens legal@ or a form. If missing, it goes in the next binary — it is one of the few concrete things Legal likes to see.

### Suggested Review Notes block (if you are allowed to edit notes without resetting, or for the next submit)

```
Whisco TV is a free AVOD/FAST client for GCC expatriate households. No account. No subscriptions. No downloads.

Live channels are official free-to-air / official broadcaster streams, health-checked every 6 hours. On-demand titles are official embeds (YouTube IFrame Player, embeddable videos only), public-domain files, or written-licence files. Automated embeddability + GCC geo checks hide anything that fails. We do not import M3U/Xtream playlists and we do not geo-unblock pay-TV.

Takedown and rights questions: legal@whisco.tv.

Reviewer path (no login):
1. Live → [CHANNEL]
2. On Demand → [TITLE]
If the catalogue looks empty, the review IP is outside the six GCC states; those two titles are pinned for review.
```

---

## 7. Decision tree (print this page)

```
Status = Waiting for Review or In Review, no message
  Day 0–6  → wait
  Day 7–13 → one status inquiry (§5.3)
  Day 14+  → one follow-up (§5.4); consider callback
  Never    → cancel to “get a new reviewer”
  Never    → expedite for launch anxiety

Rejected 5.2.3
  First time     → template §3.2 + rights pack. No new binary unless they named a title.
  They named titles → hide those titles, new binary, short reply.
  “Open-source only” → shrink catalogue, new binary, accept the limit.
  Second time, pack already sent → Board (§3.9) or shrink catalogue. Do not send a longer essay.

Rejected 5.2.2 (YouTube)
  → template §3.3 + IFrame/ToS note + recording of official chrome.

Rejected 5.2.1
  → remove the named asset; template §3.4.

Rejected 4.2
  Binary is WebView → do not write. Native-shell the app.
  Binary is native  → template §3.5 + recording of Airplane-Mode empty state.

Rejected 2.3.x
  → fix listing, template §3.6. Usually no new binary.

Rejected 2.1
  → fix crash / pin playable samples / explain GCC geo; template §3.7 + new binary if needed.

Rejected 5.1.1
  → labels must match binary; template §3.8.

Two different guidelines in one letter
  → one reply, separate headed blocks, one evidence set.
```

---

## 8. Sources and limits of this playbook

This is an operator document, not legal advice. Apple does not publish streaming-app approval rates. The patterns above come from:

- App Store Review Guidelines, current public text (5.2, 5.2.1–5.2.3, 4.2, 4.2.2, 2.3.1–2.3.10), including the June 2026 site text and the November 2025 4.1(c) copycat language.
- Apple’s App Review process page (90% in <24 hours; Resolution Center; appeals; expedite).
- Developer Forums: 5.2.3 radio-directory threads (763085, Sep 2024; 840914, Aug 2026, Board upheld); movie-app 776749 (Mar 2025); historical YouTube-embed 111383; generic 5.2.3 “attach documentary evidence” text reused for years.
- Reddit r/iosdev and r/iOSProgramming, Feb 2026 and Jan 2026 radio-app 5.2.3 threads — same ask: documentary evidence or shrink to open-source stations.
- Vendor playbook: Nobex “how to reply to a 5.2.3” (broadcast-licence PDF).
- 2025–2026 appeal / Resolution Center guides (structure, length, “evidence not argument,” Board vs Center).
- 2026 review-time trackers and process notes: median is still hours-to-a-day; first apps and Legal referrals sit in a 2–7 day (sometimes 2–3 week) tail; day 7 is the community threshold for a polite status check; cancel-and-resubmit restarts the queue.
- Cautionary removals: TV Time (Nov 2024, artwork complaint to Apple); Juno Vision Pro YouTube client (Oct 2024, rights-holder complaint).
- Contrast class: BYOP IPTV *players* approved in 2025–2026 by shipping no catalogue. That defence is unavailable to Whisco.

If a reviewer asks for a document we do not have (a signed licence from every FTA broadcaster), the honest move is to shrink the listed catalogue to what we can paper — official embeds with visible YouTube chrome, a short FTA list we can source-url, public domain — and keep Filmhub and similar shelves behind a licence date. That is how this category actually ships.

Contact for this playbook’s facts: legal@whisco.tv.
