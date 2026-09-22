# APPLE — ISSUE WITH THE iOS SUBMISSION · 22 SEPTEMBER 2026

**Status: STOPPED, per the standing rule.** A store letter arrived. I have taken **no action**,
replied to nothing, resubmitted nothing, and changed nothing in App Store Connect.

**UPDATE — the reason is now known** (founder supplied the App Store Connect PDFs, 22 Sep):
**Guideline 5.2.2 — Legal: Intellectual Property — Third Party Sites/Services.** Full text and
diagnosis in §7 below.

---

## 1 · What arrived

| | |
|---|---|
| From | App Store Connect `<no_reply@email.apple.com>` |
| Subject | **"There's an issue with your Whisco TV (iOS) submission."** |
| Received | 2026-09-22 ~**02:50 Asia/Bahrain** (≈23:50 UTC 21 Sep) |
| Submitted | Sep 17, 2026 04:43 PM PDT = **2026-09-17T23:43:22.775Z** |
| Submitted by | Ali Albaharna |
| Items submitted | **1** |
| Submission ID | **`c80e30c4-5e07-4911-bb77-2ed58fd09caf`** |
| App / version | **Whisco TV · 1.0 for iOS** |

The email body says only: *"We noticed an issue with your submission that requires your attention …
For details, next steps, and to ask questions about these issues, please visit the App Review page in
App Store Connect."*

**The email does not state the reason.** No guideline number, no quotation, no summary.

---

## 2 · What the read-only API confirms

Read-only pass via `/home/user/asc/check_apple.py` (ES256 token, 15-minute expiry, GETs only):

| object | state |
|---|---|
| App | `Whisco TV` · id `6807647992` · bundle `tv.whisco.app` · sku `whisco-tv-ios-001` |
| App Store version 1.0 | **`REJECTED`** · platform IOS · created 2026-09-01 |
| Review submission `c80e30c4…` | **`UNRESOLVED_ISSUES`** · submitted 2026-09-17T23:43:22.775Z |
| Submission item | **`REJECTED`** |
| Build attached | **7** · `processingState: VALID` · not expired · uploaded 2026-09-17 |
| Release type | `AFTER_APPROVAL` |

So this is a **rejection with unresolved issues**, not a processing or compliance request. Build 7 is
still valid and not expired — which matters, because it means the binary is still usable if the fix is
on the metadata side.

**The reason is not in the API.** I probed six endpoints (`appStoreReviewDetail`,
`reviewSubmissions`, submission `items`, `appStoreVersionPhasedRelease`, version localizations,
`betaAppReviewDetail`) — state is exposed, **the reviewer's message is not.** It lives only in the
**Resolution Center** in App Store Connect. **`NOT IN DATA` — I will not guess the guideline.**

---

## 3 · Our side checks out (so the reason is genuinely unknown)

Checked read-only, so a metadata rejection can be ruled in or out once we know more:

- **iOS description** — 1,277 chars · opens *"Whisco TV shows eight live news channels and eight
  public-domain films…"* · closes *"Rights holders: legal@whisco.tv…"* ·
  **banned-string scan clean**: no `500+`, `14,000`, `dizi`, `Bollywood`, `free-to-air`, `HLS`,
  `iptv`, `movies`, `cinema`.
- **Keywords** — `live news, world news, news, public domain, classic films, documentaries`
- **Marketing URL** `https://whisco.tv/about` · **Support URL** `https://whisco.tv/contact`
- **App Review notes** (2,875 chars, ours) already pre-empt **Guideline 5.2.2** (third-party content)
  and **Guideline 2.5.4** (`UIBackgroundModes audio` removed in build 7's Info.plist), list the
  reviewer path for all 16 rows, and reference an attached rights pack
  (`Whisco_TV_Content_Rights_Statement_build6.pdf`).
- **Demo account not required**; contact Ali Albaharna with a phone number on file.

**Context, not a diagnosis:** this app has been rejected before over advertising counts it could not
honour (the 500+ channels era), and the 5.2.2 / 2.5.4 groundwork above came out of that. **That is not
evidence about this rejection.** The guideline number is the only thing that decides it.

---

## 4 · READ THIS FIRST — founder, in App Store Connect (no reply, no action)

1. Go to **https://appstoreconnect.apple.com** → **My Apps** → **Whisco TV**.
2. Open the **App Store** tab (the version list). **1.0** will read **Rejected**.
3. Open the **Resolution Center** — in the version's side panel, or via the **App Review** /
   *"There are issues"* banner above the version.
4. **Read the reviewer's message in full.** What matters:
   - the **guideline number(s)** (e.g. 2.1, 5.2.2, 4.2…)
   - the **quoted sentence or screenshot** they cite
   - whether it says a **new binary** is required, or whether the issue is **metadata only**
   - any **attachment** they included
5. **Screenshot it and paste it to me verbatim. Do not reply. Do not press anything.**

That message is the single unblocker. Everything downstream — whether this is a metadata fix in
Console, a code change, or a new build — is undecidable without it.

---

## 5 · Barred until the Desk rules

- ❌ **No reply to Apple** — not to the email, not in the Resolution Center.
- ❌ **No Resolution Center letter.** Grok's lock stands: an RC letter only goes out **after a new
  binary is in Connect**.
- ❌ **No resubmission**, no "Remove from review", no version withdraw.
- ❌ **No new binary / EAS build** — the founder runs EAS when a ruling says so, never me.
- ❌ **No App Store Connect edits** of any kind by me or by anyone, before a ruling.
- ❌ **No public statement** — no announcement, no OFT, no social, no "in review with Apple" line.

---

## 6 · What I need back

1. **The Resolution Center text, verbatim** — guideline number first.
2. Whether Console presents a **fix-and-resubmit without a new build** path (metadata issue) or
   demands a **new binary**.
3. Then the Desk rules the response. I will draft whatever it asks for — text, evidence pack, or a
   code change — and hand it back for the founder's click.

**Nothing else tonight.** The website freeze, `AD_UNIT_LIVE` false, no guides, no AdSense — all
unchanged. The Parked gate for site work is unaffected: **Play URL 200 · two Desk-named slugs · a store
letter** — and this is the third of those three.


---

# 7 · DIAGNOSIS — Guideline 5.2.2, and what actually changed between rounds

## 7.1 The rejection, verbatim

> **Guideline 5.2.2 - Legal — Intellectual Property — Third Party Sites/Services**
> **Issue Description:** *The app contains various copyrighted movies or TV shows. The use of
> third-party copyrighted materials requires documented evidence of your right to use such content in
> the app. The app and its contents should not infringe upon the rights of another party.*
> **Next Steps:** *To resolve this issue, please attach documentary evidence in the App Review
> Information section in App Store Connect. Once we have reviewed your documentation and confirmed its
> validity, we will proceed with the review of the app. **Alternatively, please remove the third-party
> content from the app and its metadata.***

Apple offers exactly two doors: **stronger evidence**, or **remove the content**.

## 7.2 Timeline — what each round closed

| date | version reviewed | guidelines cited | evidence Apple gave |
|---|---|---|---|
| Sep 10 | build 5 era | (first rejection) | — |
| Sep 11 | — | Ali replied | — |
| **Sep 15** | **1.0 (5)** | **2.5.4** + **5.2.2** | **screenshot attached** — `Screenshot-0915-110345.png` |
| Sep 17 | build 7 uploaded 05:18 PT, submitted 23:43 UTC | — | — |
| **Sep 21** | **1.0 (7)** | **5.2.2 only** | **no screenshot attached** |
| Sep 22 02:50 | email: *"some outstanding issues"* | — | — |

**Two facts fall out of that table:**

1. **2.5.4 is closed.** The Sept-15 rejection listed two guidelines; the Sept-21 rejection lists one.
   Removing the `audio` key from `UIBackgroundModes` worked. That thread is done.
2. **5.2.2 survived a narrowed binary.** Build 7 ships the gated 8 + 8 catalogue, and Apple rejected
   it again with the same boilerplate — and **attached no new screenshot**, so we cannot see which
   content they still object to. That is the single most important unknown.

## 7.3 Apple's own evidence, decoded

The Sept-15 screenshot shows the app's **Live TV tab reading "615 channels"** — Bahrain TV, Bahrain
International, Bahrain Quran, Bahrain Sports 1/2, ATN Bangla, NTV, Ekushey TV, Bangla Vision, Green TV,
with language pills *Arabic 164 · Hindi 142 · English 72 · Turkish 50 · Urdu 31 · Indonesian 27 ·
Vietnamese 26*.

That is **the pre-gate fat catalogue**. Apple screenshotted a 615-channel directory of third-party
broadcasters and cited 5.2.2. The complaint was accurate **for build 5**.

Build 7 does not show that. Measured against production today:

| probe (iOS header) | result |
|---|---|
| `/live` | **8** items — cleared channels only |
| `/vod` | **8** titles, **1** shelf |
| `/title/cennetin-cocuklari` (a non-cleared title) | **404** ✅ |
| `/title/kurulus-osman` | **404** ✅ |
| `/home` | `stats {channels: 8, titles: 8}` · `featuredChannels: 8` |
| No header | 630 channels / 16,786 titles — the website, unaffected |

Gate confirmed in build 7's own commit (`15075f7`): `Platform.OS === "ios" ? { "X-Whisco-Store": "ios" } : {}`.

## 7.4 THE GAP THAT MATTERS — we attached the wrong pack

Apple's instruction is to attach documentary evidence in **App Review Information**. We did attach one:

| attachment (measured via API) | file | size |
|---|---|---|
| `appStoreReviewAttachments` | **`Whisco tv content rights statement build 6 .pdf`** | 15,391 bytes |

**It is the build-6 pack, and build 7 is what Apple reviewed.** The repo also holds
`Whisco_TV_Content_Rights_Statement_build7.pdf` — rewritten 2026-09-17/18, explicitly *"to match the
binary actually under review"*, 11,205 chars vs the build-6 pack's 10,963 — and **it was never
attached.** The two packs describe the same 8 + 8 catalogue, so this is not a silver bullet, but it is
a real, checkable defect in the submission: the document Apple read is labelled with a build number
that does not match the binary in front of them.

## 7.5 A second defect I found tonight — the Home tab is broken on iOS

Not 5.2.2, but the reviewer sees it:

| `/home` row (iOS header) | items |
|---|---|
| **`live` — "Live News & Public Service"** | **0 — empty** |
| `docs` — Documentaries | 8 |
| `publicdomain` — Public Domain Classics | 8 |

The Live tab itself returns its 8 channels; the **Home tab's live shelf renders empty**, and the two
film rows carry the same 8 films. So the Home screen in build 7 shows eight films and an empty shelf —
while our review notes tell the reviewer *"Live TV — eight channels are listed… tap any one"*. A
reviewer who starts on Home gets a different app than the notes describe. `/home` row population is a
**server-side** fix (the endpoint filters by the gate), so it needs no new binary — but it also needs a
ruling before anyone touches it.

## 7.6 What is genuinely unclear

- **Which content Apple still objects to.** No screenshot this round. Two candidates by the text
  ("movies or TV shows"): the **8 live news channels** as embedded third-party services, or the
  **8 archive films**. The films are public-domain with per-item item pages; the live channels are the
  broadcaster's own YouTube embeds. Neither is a rights violation on its face — but 5.2.2 is also the
  *"apps that merely wrap third-party sites/services"* guideline, which is a different argument.
- **Whether Apple re-inspected the narrowed binary at all.** The boilerplate is byte-identical to
  Sept 15, and no new screenshot was attached. `[EST]` — it is possible the second review inherited
  the first finding. **Not a claim.**

## 7.7 Options — for the Desk, not for me

| | path | what it costs | risk |
|---|---|---|---|
| **A** | **Re-attach with the build-7 pack**, plus a per-item evidence appendix (16 rows, each with licence line + channel/item URL + measured codec), and a cover note naming the build | An hour of writing, no code change, no new binary | Apple may judge it insufficient again |
| **B** | **Remove third-party content** — Apple's own alternative. Narrowest version: drop the **live news set**, keep the 8 public-domain films (which carry archive.org licence lines) | The app loses its "live news" half | Shrinks the product; needs a new binary + new review |
| **C** | **Ask Apple a question in the Resolution Center** — the message explicitly invites it (*"Reply to this message… and let us know"*) | Nothing | **BARED** — Grok's lock: an RC letter only goes out **after a new binary is in Connect** |

I have taken **none** of these. **A is the cheapest and is what Apple's own "Next Steps" asks for**;
B is the guaranteed close; C is locked.

## 7.8 What I need decided

1. **A, B or C** — the Desk's call.
2. If **A**: confirm the pack should be the build-7 statement + a 16-row evidence appendix, and say
   whether the cover note may name the build number explicitly.
3. **The `/home` empty-shelf defect (§7.5)** — go/no-go to fix server-side, independent of the Apple
   answer. It is a one-endpoint change behind the existing gate.
4. **Founder**: nothing to click until a ruling. **Do not reply to Apple.**
