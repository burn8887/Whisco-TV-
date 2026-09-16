# DRAFT — APPLE RESUBMISSION ACTION PLAN
**Status: DRAFT v1 — NOT COMMITTED, NOT PUSHED. Awaiting founder + Grok cross-check before any code or repo change.**
Filed 2026-09-15 · version 1.0 (build 5) · app `6807647992` · submission `c80e30c4-…`

---

## 0. WHAT APPLE'S OWN EVIDENCE PROVES

Apple attached `Screenshot-0915-110345.png` to the rejection. It is **the app's Live TV tab**, showing the channel list: 615 channels · filters Arabic 164 / Hindi 142 / English 72 / Turkish 50 / Urdu 31 / Indonesian 27 / Vietnamese 26 · and the visible channels — **Bahrain TV (720p) [Not 24/7], Bahrain International, Bahrain Quran, Bahrain Sports 1, Bahrain Sports 2, ATN Bangla, NTV, Ekushey TV, Bangla Vision, Green TV**.

Three conclusions:

1. **The challenged third-party content is anchored in the live channel catalogue.** Apple's wording says "movies or TV shows", but the evidence they chose to attach is the broadcast channel list. The live channels are the visible exposure.
2. **Every channel in their screenshot is a third-party broadcaster we have no permission from** — Bahraini state television and Bangladeshi private commercial channels.
3. **This screenshot is also our live production UI** (identical layout, "615 channels", the "100% Free" pill). So it is reproducible evidence of what a reviewer saw, and it tells us exactly what to remove from view.

---

## 1. THE FINDING THAT DECIDES THE STRATEGY

We audited where our channels actually come from:

> **Our own discovery cron's source comment: "Pulls the community-maintained iptv-org index."**

Our 613 active live channels were harvested from a **public community IPTV index**, then filtered only for (a) technical playability and (b) an exclusion list. No permission was ever obtained from any broadcaster.

Measured today:

| Class | Channels | Share | Verdict |
|---|---|---|---|
| **Recognised commercial / pay-TV brands** — Colors, Asianet, CNBC, MBC, Nick Jr., B4U, Dangal, KTV Sport… | **51** | **8.3%** | **Indefensible. Cannot ship.** |
| **Public broadcasters** — Doordarshan (×many), Al Jazeera Mubasher, DW, etc. | 47 | 7.7% | The only near-term defensible class |
| **Unclassified** — incl. every channel in Apple's screenshot | **515** | **84.0%** | Unknown rights; must be treated as unlicensed until proven |

And the detail that should worry us most: **`raw.githubusercontent.com` is a live stream host for 8 channels.** Those streams are served directly from the iptv-org GitHub repository. Our rejected statement told Apple our content comes from *"free-to-air streams published on originating-broadcaster infrastructure."* For those 8 channels that sentence is simply false — the infrastructure is a GitHub file server.

**Hypothesis, labelled as such [not proven]:** if a reviewer spot-checked even one stream and found a community-index URL, our whole evidence document read as unreliable. That would explain why Apple accepted the attachment existed and *still* asked for documentation. **We will not know unless we ask**, and we are not asking — we are fixing it.

---

## 2. WHY THE PREVIOUS RESUBMISSION FAILED, IN ONE LINE

We sent a **persuasive document about a catalogue we had not verified**. Apple asked for *evidence of rights*. The gap was never the wording — it was that we cannot currently prove a single item's rights basis, because we store no provenance at all (no channel ID, no official flag, no licence field on `Title` or `Channel`).

**Therefore: any plan that is "write a better letter and resubmit" will fail. The plan must change what is in the app.**

---

## 3. TIERS OF DEFENSIBILITY (what we can and cannot argue)

| Tier | Content | Basis we can actually show | Ship? |
|---|---|---|---|
| **1** | archive.org public-domain works (1,724 titles) | Per-item public-domain determination + the item page URL | **Yes**, with per-item evidence |
| **1** | YouTube embeds where the **uploader is the official rights holder** (of 14,728) | YouTube Data API: channel ID, channel title, verified status, `embeddable`, licence. Plus the official-player mechanism: we host nothing, we extract nothing, the rights holder keeps control and monetisation | **Yes** — biggest single win |
| **2** | Public broadcasters whose published terms permit embedding/redistribution | The broadcaster's own terms page or written permission | **Yes** if evidenced; otherwise request permission |
| **3** | YouTube embeds from **re-upload/aggregator channels** | Nothing — the uploader isn't the rights holder | **No** |
| **4** | The 515 unclassified live channels | Nothing | **No, until permitted** |
| **5** | The 51 pay-TV brands | Nothing, and no realistic route | **No** |
| **—** | 389 titles with **no stream URL at all** | Nothing — and they display third-party artwork/synopsis in the app | **Remove now** (pure liability, zero loss) |

The mechanism argument for Tier 1 YouTube embeds is genuinely strong and worth stating precisely: **we do not host, store, copy, download, extract, re-stream or circumvent anything.** The video plays in YouTube's own official player, from YouTube's own servers, with the rights holder's own monetisation and controls intact. Embeddability is the rights holder's own per-video setting. What we must add is proof that the *uploader is the rights holder* — which is exactly what the API verifies.

---

## 4. THE PLAN

### PHASE 0 — Verify before building (today, [EST] 0–4h)
| # | Action | Owner |
|---|---|---|
| 0.1 | **Grok cross-checks this draft** (prompt in §8). Nothing is built until its challenges are answered | Founder |
| 0.2 | **YouTube Data API key** — unblocker for BOTH Apple provenance AND the AdSense content fix. Third time asked; it is now on the critical path of two rejections | Founder |
| 0.3 | Confirm `native-v2` is the shipping Xcode project and who can produce/upload build 6 | Founder |
| 0.4 | Founder approves the **app-vs-website catalogue split** (§7 Q1) — this is the strategic decision | Founder |

### PHASE 1 — Build the provenance register (Sep 16–17, [EST] 8–12h)
| # | Action | Detail |
|---|---|---|
| 1.1 | Schema: add to `Title` and `Channel` — `sourceKind`, `sourceUrl`, `sourceChannelId`, `sourceChannelTitle`, `channelVerified`, `embeddable`, `rightsBasis`, `rightsEvidenceUrl`, `clearedForApp`, `clearedAt`, `clearedBy` | Fail closed: `clearedForApp` defaults **false** |
| 1.2 | Backfill VOD via YouTube Data API: channel ID/title/verified, `embeddable`, licence | Only videos whose channel is on our **official-channel allowlist** clear |
| 1.3 | Build the **official-channel allowlist** (the production houses and broadcasters our dizi actually come from — ATV, Show TV, Ay Yapım and similar) | This, not a blanket embed claim, is the defensible core |
| 1.4 | Hide the **389 streamless titles** everywhere | Immediate, zero downside |
| 1.5 | Remove the **51 pay-TV brands** from the app | Immediate |
| 1.6 | Classify the 515 unclassified channels; keep only those with published permission or permissive terms | Fail closed |

### PHASE 2 — Gate the app catalogue (Sep 18, [EST] 2–3h)
| # | Action | Detail |
|---|---|---|
| 2.1 | `/api/mobile/v1/*` filters on `clearedForApp` | **The website is untouched** — Apple governs the app, not the site. No AdSense or SEO impact |
| 2.2 | In-app **"Source"** line per title/channel, linking to the official channel or archive.org item | Turns the reviewer into our auditor — self-serve verification, no email needed |
| 2.3 | Remove `NSAllowsArbitraryLoadsInWebContent` from ATS if the narrowed set permits | Removes a second reviewer question we don't need |

### PHASE 3 — Evidence documents and store metadata (Sep 18–19, [EST] 4–6h)
| # | Action | Detail |
|---|---|---|
| 3.1 | **Content Rights Statement v2** | Mechanism first (we host/extract/circumvent nothing), then a per-source evidence table with URLs a reviewer can click, then a scoped removal commitment |
| 3.2 | **Per-item register appendix** | The register exported — every shipped item, its mechanism, and its evidence |
| 3.3 | **Reviewer notes v2** | ≤400 words, with a 3-minute verification path |
| 3.4 | **Metadata rewrite** | Apple said "the app **and its metadata**". Remove specific title names from the description (naming Esaret/Emanet/Forbidden Love implies a catalogue we must evidence). Fix the counts: App Store says "14,000+ titles", OG tag says "1,700+", Twitter says "16,000+". Make the store text match the app and use floors only |
| 3.5 | **New screenshots** | Current ones showcase commercial films we may not ship (Wildest Family Feed Moments, Ithiri Neram, Aadhi Bhagavan). Screenshots are metadata — they must show only evidenced content |

### PHASE 4 — Build, deploy, submit (Sep 20+, after freeze)
| # | Action |
|---|---|
| 4.1 | `Info.plist`: **remove `UIBackgroundModes: ['audio']`** (Apple's own offered fix; no evidence required; no `AVAudioSession` exists in the code, so the declaration is false) |
| 4.2 | Build **6**, upload, attach Statement v2 + register |
| 4.3 | Deploy the gated app API (freeze ends Sep 20) |
| 4.4 | **Reply in Resolution Center first**, then resubmit — Apple explicitly invited a reply |
| 4.5 | Do not resubmit until 1.1–3.5 are live. A third rejection on the same guideline is materially worse than waiting |

### PHASE 5 — Grow it back, durably (weeks, runs in parallel)
| # | Action | Why |
|---|---|---|
| 5.1 | **Filmhub call (Sep 17 22:00): add "can you supply licensed titles with documentation?"** | A licence agreement is the *only* true answer to "documented evidence of your right". This converts Thursday's call from a distribution conversation into a content-supply conversation — the single highest-leverage move available to us |
| 5.2 | **Broadcaster permission campaign** — written requests to public broadcasters we want to keep | Add channels back as permissions land, each with a document behind it |
| 5.3 | Extend archive.org public-domain holdings | Tier 1 content we can prove |
| 5.4 | Re-add VOD as official channels are verified | The catalogue grows on evidence, not on harvests |

---

## 5. HONEST ASSESSMENT — what "highest rate of success" actually means here

**What I can guarantee:** every item in build 6 will be individually provable, and the app's claims will match exactly what is in it. That is the only thing fully within our control, and it is what Apple is asking for.

**What I cannot guarantee:** approval. [EST] The evidenced-core path is the highest-probability route available to us without licence agreements, but YouTube-embed-based aggregation is a class of app that reviewers scrutinise and sometimes still refuse. I would put a first-pass approval at **moderate, not high** [EST], improving materially as licences (5.1) and permissions (5.2) land.

**The honest risk in this plan:** narrowing shrinks the catalogue. A markedly smaller catalogue invites a different question — 4.2 minimum functionality / 4.3 spam — and the app is literally named "Live TV & Movies". Mitigations: keep the app genuinely feature-rich (profiles, watchlist, resume, search, EPG, live), be transparent in the notes about the growth path, and do not strip live TV to nothing.

**The plan that fails:** rewording the statement, keeping the catalogue, resubmitting. Apple already read that document and refused it.

---

## 6. WHAT WE WILL NOT DO
1. Not resubmit the current statement or a reworded version of it.
2. Not claim free-to-air carriage is a licence — Apple already saw that argument fail.
3. Not keep the 51 pay-TV brands in the app.
4. Not keep any stream whose rights basis is unknown, merely because it plays.
5. Not overclaim in metadata or screenshots.
6. Not resubmit before the fixes are live.
7. Never name sanctioned entities anywhere.

---

## 7. DECISIONS ONLY THE FOUNDER CAN MAKE
1. **App-vs-website catalogue split** — app carries only evidenced content; the website keeps everything. Agree?
2. **Live TV in the app** — we may ship with [EST] low tens of channels rather than 613, and the app name says "Live TV". Accept, or rename/reframe?
3. **2.5.4** — remove the `audio` key (recommended, guaranteed) or attempt the recording route?
4. **Filmhub agenda** — add the licence-supply ask to Thursday's call?
5. **Who builds and uploads build 6** — the PDF shows an Xcode Cloud tab, so a pipeline exists; I need to know who runs it.

---

## 8. GROK CROSS-CHECK PROMPT — paste this now

> **Your job: break this action plan before we execute it. Be adversarial.**
>
> **Situation.** Our iOS app (Whisco TV, `tv.whisco.app`) was rejected twice. The second rejection (2026-09-15) cited:
>
> *Guideline 5.2.2 — Legal, IP, Third Party Sites/Services:* "The app contains various copyrighted movies or TV shows. The use of third-party copyrighted materials requires documented evidence of your right to use such content in the app." Next steps: attach documentary evidence in App Review Information, OR remove the third-party content from the app and its metadata.
>
> *Guideline 2.5.4:* "The app declares support for audio in the UIBackgroundModes key in the Info.plist, but we are unable to play any audible content when the app is running in the background." Next steps: reply with a screen recording proving persistent background audio, OR remove the "audio" setting.
>
> **What the app is:** native SwiftUI. Live channels play as direct HLS in `AVPlayerViewController`. On-demand plays as YouTube iframe embeds in `WKWebView` (youtube-nocookie). Public-domain films play from archive.org. We host no media files, have no download/save/convert function, extract no streams, circumvent no DRM.
>
> **What we already did that failed:** we attached a "Content Rights Statement" describing three sources — (1) official YouTube iframe embeds of owner-enabled videos, (2) public-domain works from archive.org, (3) "free-to-air streams published on originating-broadcaster infrastructure". Apple read it and still demanded documented evidence.
>
> **Apple's attached evidence screenshot** was our app's **Live TV channel list**: 615 channels, including Bahrain TV, Bahrain International, Bahrain Quran, Bahrain Sports 1 and 2, ATN Bangla, NTV, Ekushey TV, Bangla Vision, Green TV.
>
> **Our audit findings:**
> - 16,841 active on-demand titles: 14,728 YouTube embeds (87.5%), 1,724 archive.org (10.2%), 389 with no stream URL at all (2.3%).
> - 613 active live channels: sourced from the public community **iptv-org index**. 51 (8.3%) are recognised commercial/pay-TV brands (Colors, Asianet, CNBC, MBC, Nick Jr., B4U, Dangal). 47 (7.7%) are public broadcasters. 515 (84%) unknown.
> - 8 channels stream directly from `raw.githubusercontent.com` — i.e. from the community index itself.
> - We store **no provenance field at all**: no source channel ID, no official/verified flag, no licence record, on either titles or channels.
>
> **Our proposed plan:**
> 1. Build a provenance register (source mechanism, source URL, uploader channel ID, verified status, embeddable flag, licence, rights basis, evidence URL, `clearedForApp` — defaulting false).
> 2. VOD: keep only YouTube embeds whose uploader channel is on our **official-channel allowlist** (verified via the YouTube Data API), plus archive.org public-domain items with per-item determination.
> 3. Live: remove the 51 pay brands immediately; keep only public broadcasters with permissive terms or written permission; hold the rest out pending permission.
> 4. Remove the 389 streamless titles.
> 5. Gate the catalogue in `/api/mobile/v1/*` only — **the website keeps the full catalogue**, on the reasoning that Apple governs the app, not the site.
> 6. Add an in-app "Source" line per title/channel linking to the official channel or archive.org item.
> 7. Rewrite the Content Rights Statement with a mechanism-first argument and a clickable per-source evidence table.
> 8. Rewrite App Store metadata and screenshots to match the narrowed catalogue; remove specific title names.
> 9. Remove `UIBackgroundModes: ['audio']` and ship build 6.
> 10. Reply in the Resolution Center, then resubmit.
>
> **Attack this. Answer specifically:**
> 1. Is "Apple governs the app, not the website" correct? Or does App Review assess the app's content against the brand's website — and could a reviewer treat "the app is a subset of a site carrying far more content" as its own problem?
> 2. For YouTube-embed aggregation: does App Review accept "the uploader is the official rights holder and embeddability is their own setting" as documented evidence? What evidence exactly do they want — is a screenshot of the official channel enough, or does it require something from YouTube or the rights holder directly? Cite real precedent if you have it.
> 3. Is an official-channel allowlist actually verifiable by a reviewer in a few minutes, and how would you present it so it is obvious rather than argued?
> 4. What is the real risk that the narrowed catalogue triggers 4.2 (minimum functionality), 4.3 (spam), or a "no content / couldn't verify content" rejection instead? Is there a minimum catalogue size or feature bar we should clear before submitting?
> 5. For live FTA/public-broadcaster channels, what is genuinely accepted? Name specific broadcasters whose published terms permit third-party carriage or embedding, and say what the document is. Mark anything you cannot verify as NOT VERIFIED.
> 6. Is removing the `audio` key alone sufficient to close 2.5.4, or is a Resolution Center reply also required?
> 7. What have we missed? What is the single most likely reason we get rejected a THIRD time after executing this plan?
>
> **Rules:** no invented facts. Say "NOT VERIFIED" instead of guessing. Cite sources or precedent where possible. Label your own estimates [EST]. Do not reassure me — I want the lower band and the failure mode.

---

## 9. VERIFICATIONS COMPLETED TODAY (so Grok does not have to repeat them)
- ✅ App Store Connect API reachable; `appStoreState: REJECTED`; submission `UNRESOLVED_ISSUES`; build 5 `VALID`.
- ✅ Apple's rejection text is **not** available via the API (403 on `reviewSubmissionItems` `GET_INSTANCE`) — it came from the founder's PDF.
- ✅ Privacy manifest matches reality: native app has **no sign-in, no account, no email capture, no ads/analytics SDK**; only local `UserDefaults` prefs, correctly declared (`CA92.1`, no tracking, no collected data types). **Clean.**
- ✅ `Info.plist` false declaration confirmed: `UIBackgroundModes: ['audio']` with no `AVAudioSession` anywhere in the Swift sources.
- ✅ `NSAllowsArbitraryLoadsInWebContent: True` present — not cited, but a latent reviewer question.
- ✅ Search is diacritic-sensitive (`Kurulus Osman` → 0 results; `Kuruluş Osman` → 1). Not cited, latent, and a real user defect.
- ✅ `/signup` is live and in-app account deletion does not exist (privacy policy promises it). Not cited; latent 5.1.1(v) exposure.
