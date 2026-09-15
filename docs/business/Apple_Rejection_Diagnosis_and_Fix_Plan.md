# APP STORE REJECTION — VERDICT, DIAGNOSIS & FIX PLAN
**Filed 2026-09-15 · version 1.0 (build 5) · app `6807647992` · bundle `tv.whisco.app`**
**Source: founder's App Store Connect PDF (attached) — verbatim Apple text, not inference.**
Supersedes the pre-PDF draft of this document, which contained a wrong hypothesis (it guessed Guideline 5.1.1(v) account deletion). Apple did **not** cite that. See §6.

---

## 1. WHAT APPLE ACTUALLY SAID (verbatim)

**This is the SECOND rejection.** Message thread:
| When | Who |
|---|---|
| 2026-09-10 6:03 PM | Apple — first rejection |
| 2026-09-11 3:08 PM | Ali Albaharna — reply / resubmission |
| **2026-09-15 6:05 AM** | **Apple — rejection of the resubmission (this one)** |

> "Thank you for your resubmission. Upon further review, we identified additional issues that need your attention."

**Review environment:** Review date **September 15, 2026** · Review device **iPad Air 11-inch (M3)** · Version reviewed **1.0 (5)** · Submission `c80e30c4-5e07-4911-bb77-2ed58fd09caf`

### Guideline 5.2.2 — Legal — Intellectual Property — Third Party Sites/Services
> "The app contains various copyrighted movies or TV shows. The use of third-party copyrighted materials requires documented evidence of your right to use such content in the app.
> The app and its contents should not infringe upon the rights of another party. In the event the app infringes another party's rights, you are responsible for any liability to Apple because of a claim."

**Next steps Apple gives:** *attach documentary evidence in the App Review Information section*, **or** *remove the third-party content from the app and its metadata.*

**Apple attached evidence:** `Screenshot-0915-110345.png` — downloadable from the rejection. **It shows exactly which content they flagged.**

### Guideline 2.5.4 — Performance — Software Requirements
> "The app declares support for audio in the UIBackgroundModes key in the Info.plist, but we are unable to play any audible content when the app is running in the background."

**Next steps Apple gives:** *reply with a screen recording showing persistent background audio on a physical device (navigate to the Home Screen)*, **or** *remove the "audio" setting from the UIBackgroundModes key.*

---

## 2. CRITICAL OBSERVATION — OUR EVIDENCE WAS ALREADY SUBMITTED AND REJECTED

Confirmed through the API (`/appStoreReviewDetails/48f87c34-…/appStoreReviewAttachments` → `total: 1`): **we attached one document**, `Whisco_TV_Content_Rights_Statement.pdf`, and the reviewer notes spelled out the three content paths.

Apple read it and **still** asked for "documented evidence." That means:

> **Our content rights statement was judged insufficient — not missing.**

So the fix is not "attach a PDF." The fix is "make the claim true and provable per title, then document it." Shipping the same statement again with a longer attachment is the single most likely way to get a third rejection.

---

## 3. THE MEASURED EXPOSURE (our own audit, 2026-09-15)

Queried live against the production database:

| On-demand mechanism | Titles | Share |
|---|---|---|
| **YouTube embeds** | **14,728** | **87.5%** |
| archive.org | 1,724 | 10.2% |
| **no stream URL at all** | **389** | **2.3%** |
| **TOTAL active** | **16,841** | |

| Live TV mechanism | Channels | Share |
|---|---|---|
| direct HLS | 606 | 98.9% |
| youtube | 7 | 1.1% |

### Why our statement failed — ranked honestly
1. **The FTA claim is the weakest thing we wrote, and probably the most damaging.** Our notes said: *"free-to-air streams published on originating-broadcaster infrastructure."* A broadcaster publishing its own stream **is not a licence for us to redistribute it**. Free-to-air means free to *receive*, not free to *re-transmit*. This is the claim a reviewer is most likely to reject, and having it in the same document as our strong claims weakens everything else.
2. **We asserted "officially-owned channels" without per-title proof.** 87.5% of the catalogue rests on that assertion. We have **no provenance field in the database** — I searched: there is no `channelId`, `official`, `verified` or `license` field on `Title`. So we currently *cannot* prove a single title's source is official, even though many probably are.
3. **The archive.org position is genuinely strong — but it is 10% of the catalogue**, and our statement did not prove public-domain status per item.
4. **The app displays metadata and posters for 389 titles it cannot even play.** The app's API filters on `isActive: true` only — it does not filter on `streamUrl` being present. Those render as "movies and shows" with artwork and synopses: third-party copyrighted material presented in the app with no playback and no rights basis. This is exactly the kind of thing a screenshot would capture.

---

## 4. THE STRATEGIC LEVER — APPLE GOVERNS THE APP, NOT THE WEBSITE

**The fastest honest path is not to defend 16,841 titles. It is to ship an *evidenced* app.**

Apple's requirement applies to the binary we submit. The website is not under Apple's jurisdiction. So:

- **The app ships a curated catalogue: only content whose rights position we can document.**
- **The website keeps the full catalogue** — no loss of the web product, no AdSense impact, no SEO impact.
- Optionally ship the full catalogue to the app again later, source by source, as evidence for each is built.

This is also a **better story for the Filmhub call on Sep 17**: a distributor wants to see cleared content and a provenance register. An app that carries only documented content is a materially stronger asset than one carrying 87% unproven embeds.

---

## 5. FIX PLAN

### P0 — 2.5.4 (guaranteed resolution, near-zero effort)

**Recommended: REMOVE `audio` from `UIBackgroundModes`.** Apple explicitly offers this as the resolution, it needs no evidence, and it is 100% guaranteed to close the issue.

Why not the recording route:
- Apple reviewed on an **iPad Air**. Background audio via `AVAudioSession(.playback)` is reliable for `AVPlayer` (our live HLS channels) but **unreliable for `WKWebView`/YouTube embeds** — and the reviewer was focused on VOD content. There is a real chance a recording still fails if they retest an embed.
- The repo's iOS project (`docs/experiments/grok-app/native-v2/…/Info.plist`) declares `UIBackgroundModes: ['audio']`, and **no `AVAudioSession` is configured anywhere in the Swift sources** — so the key is currently a false declaration. Apple is right.

**Decision: remove the key. Re-introduce background audio later as a deliberate, recorded, tested release.** The lower-risk call, and the founder rewards the lower band.

| # | Change | Where |
|---|---|---|
| 1 | Delete the `UIBackgroundModes` array (or drop `audio`) | `native-v2/ios/WhiscoTV/WhiscoTV/Info.plist` |
| 2 | Rebuild + upload as build **6** | Xcode / Xcode Cloud |

### P0 — 5.2.2 (the real work)

| # | Fix | Owner | [EST] |
|---|---|---|---|
| 3 | **Download `Screenshot-0915-110345.png`** from the rejection — it names the flagged content | Founder | 1 min |
| 4 | **Get the YouTube Data API key** — verifies, per video: channel ID, channel title, embeddable flag, licence, and whether the channel is the official rights holder. **This one key unblocks BOTH the Apple evidence register AND the AdSense content fix.** | Founder | 10 min |
| 5 | **Add provenance fields** to `Title` (`sourceKind`, `sourceChannelId`, `sourceChannelTitle`, `sourceUrl`, `embeddable`, `rightsBasis`, `rightsEvidence`, `clearedForApp`) and backfill from the API | Agent/Cursor | 4–6 h |
| 6 | **Exclude from the app** every title that is not `clearedForApp` — starting with the **389 streamless titles** (immediate, cheap win) | Agent | 1 h |
| 7 | **Narrow live FTA to broadcasters whose published terms permit it** (public broadcasters with embed/direct-play programmes). Remove the rest from the app. Website unaffected | Agent + Founder call | 3–4 h |
| 8 | **Content Rights Statement v2** — mechanism-first, per-source evidence table, with explicit negative statements (no hosting, no downloads, no stream extraction, no DRM circumvention). Written to be *verifiable*, not persuasive | Agent drafts, Founder reviews | 3 h |
| 9 | **Reviewer notes v2** — point at the register, name the verified paths, restate the reconciliation offer | Agent drafts | 1 h |

### P1 — before resubmitting
| # | Fix |
|---|---|
| 10 | Metadata accuracy: our own surfaces say **1,700+** (stale OG tag), **14,000+** (App Store description), **16,000+** (Twitter card). Unify to doctrine floors |
| 11 | Search is diacritic-sensitive: `Kurulus Osman` → 0 results, `Kuruluş Osman` → 1. Our reviewer path told them to type the version that returns nothing. A reviewer who cannot find content writes "content could not be verified" |
| 12 | `/signup` is live and there is **no in-app account deletion** (our privacy policy promises one). Not cited this round, but **Guideline 5.1.1(v) is triggered by account creation and this is a latent rejection** |
| 13 | Screenshot refresh (4 shots; shot 4 is an empty state) |

### Sequence
1. Founder: screenshot download + key + the 2.5.4 decision (§7).
2. Grok verification runs (prompt 1) → confirms or breaks this diagnosis **before** we spend hours.
3. Fixes 5–9 built on branch `apple-fix`, deployed in the **Sep 20** window (respects the 16–19 freeze).
4. Build **6** (key removed) uploaded.
5. Reviewer notes v2 + reply posted, **then resubmit**.

**Do not resubmit before 5–9 are live.** A third rejection on the same guideline narrows our room considerably.

---

## 6. CORRECTION TO MY EARLIER DRAFT — stated plainly

Before the PDF arrived I filed a diagnosis that led with **"account deletion does not exist"** as the most likely cited guideline, at HIGH confidence. **Apple did not cite it.** The honest summary of that draft: it found two real defects, but it guessed wrong about which one Apple cared about, and it did not identify 5.2.2 at all — because without the rejection text I could not know, and I presented a hypothesis as a near-certainty. That is the exact failure mode the founder's "KILL OPTIMISM" rule exists to prevent. The lesson is recorded, not buried.

What survives from that draft, correctly re-labelled:
- **Search diacritic bug** — real, confirmed on production, **not cited by Apple** (P1 #11).
- **Account deletion absent vs privacy policy promising it** — real, confirmed on production, **not cited by Apple** (P1 #12).
- The **metadata count inconsistency** finding (P1 #10).

---

## 7. FOUNDER — three quick things

**A. Download Apple's evidence (1 minute).**
1. appstoreconnect.apple.com → **My Apps** → **Whisco TV: Live TV & Movies**
2. Left sidebar → **iOS App 1.0** → the **App Review** / **Resolution Center** message from today
3. Click **`Screenshot-0915-110345.png`** → **Download**
4. Send it to me. It tells us which titles were flagged, which decides how hard we narrow.

**B. 2.5.4 decision.** I recommend **removing the `audio` key** (guaranteed, no evidence needed). Confirm or override.

**C. YouTube Data API key.** It was already the unblocker for the AdSense content fix. It is now **also** the unblocker for the Apple rights register. Two of the three open blockers, one key. Steps are in `docs/business/AdSense_LowValueContent_Fix_Plan.md` §5.

---

## 8. OPEN QUESTIONS
1. **Which content did Apple flag?** Blocked on the screenshot download (§7A).
2. **Is `native-v2` the shipping Xcode project?** The PDF shows an **Xcode Cloud** tab, so a cloud build pipeline exists. Need to confirm this repo's project is the one that produces build 5, and who can rebuild/upload.
3. **Do we have any actual written permission from any broadcaster or rights holder?** If yes, that must lead the v2 statement. **NOT IN DATA** — I have found no licence document in the workspace.
4. **Is a narrowed app catalogue acceptable product-wise**, with the full catalogue remaining on web? My recommendation is yes; it needs the founder's explicit agreement because it changes what the app is.
