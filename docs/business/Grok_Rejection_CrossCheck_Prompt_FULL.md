# PROMPT FOR GROK — ADVERSARIAL CROSS-CHECK OF OUR APPLE REJECTION RESPONSE
*SELF-CONTAINED VERSION — everything you need is inside this one message. Nothing else will be pasted.*

---

You are an App Store review consultant who has handled hundreds of Guideline 5.2.3 and 2.3.7 rejections for streaming apps. We received a first-submission rejection for Whisco TV (free legal AVOD app for Gulf audiences; you have full project context) and prepared a response. Your job: **attack our response before Apple does.** Kill optimism; assume a skeptical reviewer on their worst day.

## THE REJECTION, VERBATIM (received 10 Sep 2026, 18:03; Review Device: iPhone 17 Pro Max; Version 1.0 (5))

1. **Guideline 2.3.7 — Performance — Accurate Metadata:**
   > "The app name include references to the price of the app or the service it provides… Note that references to free or discounted services are considered a price reference and are not appropriate for app metadata. Next Steps: remove any references to pricing from the app's metadata. If you would like to advertise changes to the app's price, consider including this information in the app description."

   (Our app name at submission was **"Whisco TV: Free Live TV & VOD"**.)

2. **Guideline 5.2.3 — Legal: Intellectual Property:**
   > "The app contains content or features that may violate the rights of one or more third parties. Specifically, the app provides potentially unauthorized access to third-party audio or video streaming, catalogs, and discovery services… To resolve this issue, please attach documentary evidence in the App Review Information section in App Store Connect evidencing that you have all necessary rights or permissions to the third-party audio or video streaming, catalogs, and discovery services in the app. Once we have reviewed your documentation and confirmed its validity, we will proceed with the review of the app."

Submission state: UNRESOLVED_ISSUES; version REJECTED; "Reply to App Review" available in Resolution Center. Same build 1.0 (5) remains valid for resubmission — this is a metadata + documentation cycle, no new binary.

**Relevant context:** Apple's day-7 status inquiry (case 102956986441) got a reply from Developer Support on Sep 10 saying the app was "proceeding through the review process" — the rejection landed one hour later the same day, after the state moved WAITING_FOR_REVIEW → IN_REVIEW → REJECTED.

## OUR PLANNED RESPONSE (both documents follow in full below)

- **(A)** A Content Sourcing & Rights Statement PDF attached in App Review Information (full text = DOCUMENT A below).
- **(B)** Metadata changes + a Resolution Center reply message (full text = DOCUMENT B below). Key changes: new app name **"Whisco TV: Live TV & Movies"**, promotional text scrubbed of "free", keywords scrubbed to `live tv,movies,turkish series,bollywood,pakistani drama,arabic series,filipino,streaming,dizi`. Description untouched (Apple's own text says price info may live in the description). Subtitle already compliant: "Live channels, movies & series".

## DELIVER, IN ORDER:

1. **Weakness audit of the evidence PDF (Document A)** — read it as a hostile reviewer: which claims are assertions rather than evidence? Where would a reviewer say "this describes your architecture, not your PERMISSIONS"? Is the YouTube-embedding-as-permission argument (embedding toggle = rights-holder grant, per YouTube ToS) persuasive to App Review based on real precedent — cite any known cases of embed-based catalog apps passing or failing 5.2.3 (2023–2026, forums/appeals). What SPECIFIC additions would strengthen it (e.g., screenshots of official channels with embedding enabled? YouTube ToS section quotes? archive.org license page citations? FTA definitions per broadcaster?).

2. **The trap questions** — list the 8 most likely follow-up questions/objections Apple could return with after reading our documents, and the strongest answer to each. Include the nightmare one: "provide written authorization from each broadcaster" — how do embed-catalog apps that survived answer this?

3. **Metadata sweep** — beyond name/promo/keywords, list every other metadata surface 2.3.7 could bite on resubmit (screenshots containing the old name or the word FREE, subtitle, description first line, what's-new text). For each: risk level and fix. **Flag especially: our uploaded screenshots (all 12 — iPhone 6.7" set and iPad 12.9" set) show the app UI with a visible "100% Free" pill/badge in the header. Is an APP UI ELEMENT shown in screenshots a metadata price reference under 2.3.7 precedent, or is it safe because it's the actual product UI?** Cite real cases if findable. (If it's a risk: we can regenerate and re-upload the screenshots with the pill masked via API within ~1 hour, so recommend explicitly whether to do it.)

4. **Message tone check** — critique our Resolution Center reply draft (in Document B): length, structure, anything that sounds argumentative or over-lawyered, anything missing (should we proactively offer a demo video? a call?). Rewrite any sentence you'd change.

5. **Strategic call** — reply-and-resubmit as planned, versus first replying WITHOUT resubmitting to ask if the documentation suffices (Apple's rejection email pattern says "simply make the changes and send us a message… you don't need to resubmit" for metadata/info cases — does that apply here where they said "Once we have reviewed your documentation… we will proceed with the review"?), versus requesting a call BEFORE resubmitting. Recommend one path with reasoning from real reviewer-behavior patterns.

6. **Probability estimate** — honest pass-likelihood on resubmission with our current pack, and with your recommended improvements. [EST] labels required. No invented statistics — if you don't have data, say so.

---
---

# DOCUMENT A — THE EVIDENCE PDF (full text as it will be attached)

# WHISCO TV — CONTENT SOURCING & RIGHTS STATEMENT
**Prepared for Apple App Review · Submission ID c80e30c4-5e07-4911-bb77-2ed58fd09caf · App: Whisco TV (Apple ID 6807647992) · 11 September 2026**
**Operator: Ali Albaharna (sole proprietor, Kingdom of Bahrain; company formation as Whisco Media W.L.L. in progress) · Rights contact: legal@whisco.tv**

## 1. Summary

Whisco TV is a free, advertising-supported catalog of legally accessible television and video for expatriate and national households in the Gulf. **The app hosts no third-party media files, provides no downloading, saving, or format-conversion functionality of any kind, and contains no mechanism for users to add streams.** Every item in the catalog falls into one of three source categories, each with a distinct legal basis, and every item is verified by automated systems before and continuously after it becomes visible.

Catalog composition on the date of this statement (production database export, 11 Sep 2026):

| Source category | Count | Share | Legal basis |
|---|---|---|---|
| Official YouTube embeds (on-demand titles) | 15,154 titles | 89.8% of VOD | Playback exclusively via YouTube's official embedded player (IFrame), which functions only for videos whose rights holders have enabled embedding; use per YouTube Terms of Service |
| Internet Archive public-domain films | 1,724 titles | 10.2% of VOD | Public-domain and openly licensed works served from archive.org, the recognized non-profit digital library |
| Free-to-air live channel streams | 600 channels | 98.7% of live | Publicly and freely broadcast HLS streams published by or for the originating broadcasters for unrestricted public reception |
| Official YouTube live channels | 8 channels | 1.3% of live | Same basis as YouTube embeds above |
| Self-hosted third-party media | **0** | 0% | — |

## 2. Source category detail

### 2.1 Official YouTube embeds — the permission mechanism is technical, not just contractual
All YouTube content in Whisco TV plays inside **YouTube's own embedded IFrame player**, loaded from youtube.com, with YouTube's branding, controls, and (where the rights holder runs them) YouTube's own advertisements intact — meaning **the rights holder, not Whisco TV, monetizes every play**.

Embedding on YouTube is an affirmative rights-holder choice: a video can only be embedded if its owner has left embedding enabled — that toggle *is* the permission grant, offered by YouTube to its uploaders precisely so their content can appear on third-party sites within YouTube's Terms of Service (which authorize the embeddable player for this purpose). Whisco TV never circumvents this mechanism: we do not rehost, proxy, cache, strip advertisements from, or extract streams from YouTube content. If an owner disables embedding, playback becomes impossible in our app and our automated checks (§3) remove the title, typically within hours.

The catalog draws overwhelmingly from the **official channels of broadcasters and studios** — examples spanning our shelves: TRT, ATV, Kanal D, Star TV, Show TV (Türkiye); Goldmines, Shemaroo, Rajshri, B4U (India); HUM TV, ARY Digital, HAR PAL GEO (Pakistan); ABS-CBN, GMA (Philippines); DW, plus official distributor channels for Arabic, Bangla, Malayalam, Telugu, Indonesian, Nepali and Sinhala content. These organizations publish full-length content on their verified channels with embedding enabled as part of their own distribution strategy.

### 2.2 Internet Archive public-domain collection
1,724 classic films and television episodes are served from archive.org, the non-profit digital library, from its public-domain and open-license collections. These works are outside copyright or carry licenses permitting redistribution. Playback references archive.org sources; Whisco TV does not claim ownership.

### 2.3 Free-to-air live streams
600 live channels are HLS streams **published openly by or on behalf of the originating broadcasters** for free public reception — the internet equivalent of free-to-air satellite/aerial broadcast (national broadcasters, news networks, public-service and religious channels across 17 countries). We do not decrypt, we do not bypass authentication or geo-controls, and we do not carry any pay-TV, premium sports, or subscription channel. Channels whose streams cease to be publicly available are automatically removed (§3).

**Exclusions by policy:** no premium/pay-TV channels, no sports rights holders' protected content, and a maintained exclusion list for sanctioned broadcasters.

## 3. Automated verification (before AND after listing)

- **Admission checks:** every YouTube title is verified for (a) embed availability via YouTube's oEmbed endpoint, (b) full-length duration (no clips), and (c) **playback availability in each of the six Gulf states** (our primary market) before it becomes visible. Items failing any check are not listed.
- **Continuous health checks:** live channels are re-verified every six hours end-to-end (manifest and segment fetch); on-demand titles are re-verified in rotating batches around the clock. Content that becomes unavailable — including any video whose owner disables embedding or deletes it — is **automatically hidden without human intervention**.
- Approximately 2,300 titles that failed regional-availability verification are currently hidden from all users as a result of these systems: the systems demonstrably remove content rather than merely adding it.

## 4. No downloading, saving, or conversion — by architecture

The app contains **no download, save-offline, record, or format-conversion capability** for any content, and no such code paths exist in the binary. YouTube content cannot be extracted because it never leaves YouTube's player. Live streams play in the native player with no persistence. Guideline 5.2.3's core concern — apps that facilitate saving or converting third-party media — has no surface in this app.

## 5. Rights-holder process (active, not theoretical)

- Dedicated rights contact **legal@whisco.tv**, published in the app (About), on every page footer of whisco.tv, in our Terms, and in this statement.
- Takedown policy: verified requests are honored promptly — our target is removal within 48 hours of a substantiated notice; the automated systems can hide any title or channel instantly.
- To date we have received **zero** rights-holder complaints; our proactive systems (§3) remove unavailable or restricted content before complaints can arise.
- We accept full responsibility, as the guideline provides, for claims arising from content in the app, and we maintain the operational capability to remove any item immediately.

## 6. Operator declaration

I declare that the descriptions above are accurate as of 11 September 2026; that Whisco TV hosts no third-party media files; that all playback occurs via the rights mechanisms described (rights-holder-enabled embedding, public-domain works, and freely broadcast streams); and that Whisco TV will promptly remove any content upon substantiated notice from a rights holder.

**Ali Albaharna**
Operator, Whisco TV — whisco.tv · legal@whisco.tv · Kingdom of Bahrain

---
---

# DOCUMENT B — METADATA CHANGES + RESOLUTION CENTER REPLY (exactly as planned)

## B.1 Metadata changes

| Surface | Current (rejected) | Planned new value |
|---|---|---|
| App name | Whisco TV: Free Live TV & VOD | **Whisco TV: Live TV & Movies** |
| Subtitle | Live channels, movies & series | unchanged (no price reference) |
| Promotional text | contained "free" | `500+ live TV channels and 16,000+ movies & shows — Turkish series, Bollywood, Pakistani dramas, Arabic series and more. No subscription, no signup — just press play.` |
| Keywords | began `live tv,free movies,...` | `live tv,movies,turkish series,bollywood,pakistani drama,arabic series,filipino,streaming,dizi` |
| Description | references "free" | **unchanged** — Apple's rejection text itself says price info may go in the description |
| App Review Information → Notes | — | `Content sourcing and rights documentation attached (Whisco_TV_Content_Rights_Statement.pdf). Summary: the app hosts no third-party media files; playback is exclusively (1) rights-holder-enabled official YouTube embeds via YouTube's own IFrame player, (2) public-domain works from archive.org, (3) freely broadcast FTA streams. No download/save/convert functionality exists. Takedown desk: legal@whisco.tv.` |
| App Review Information → Attachments | — | Whisco_TV_Content_Rights_Statement.pdf (Document A) |
| Screenshots | 12 screenshots showing app UI **with a visible "100% Free" pill in the header** | unchanged for now — YOUR CALL in section 3 above |

## B.2 Resolution Center reply (draft to critique)

```
Hello,

Thank you for the detailed review. We have addressed both issues:

Guideline 2.3.7 — Accurate Metadata:
We have removed all price references from the app's metadata. The app
name is now "Whisco TV: Live TV & Movies", the promotional text and
keywords no longer contain the word "free". Per your guidance, pricing
information now appears only in the app description.

Guideline 5.2.3 — Intellectual Property:
We have attached a Content Sourcing & Rights Statement in the App
Review Information section documenting our rights basis for all content:

1. The app hosts no third-party media files and contains no download,
   save, or conversion functionality.
2. On-demand titles (89.8%) play exclusively inside YouTube's official
   embedded IFrame player. Embedding is an affirmative, per-video
   rights-holder permission — the player only functions for videos whose
   owners enable embedding, and the rights holder retains their own
   monetization on every play. We never rehost, proxy, or extract streams.
   Sources are the verified official channels of broadcasters and studios
   (TRT, Kanal D, Goldmines, Shemaroo, HUM TV, ARY, ABS-CBN, GMA, DW and
   similar).
3. The remaining on-demand titles (10.2%) are public-domain works served
   from archive.org.
4. Live channels are freely broadcast FTA streams published for
   unrestricted public reception; we carry no pay-TV, premium, or sports
   rights holders' protected channels, and we never bypass encryption,
   authentication, or geo-controls.
5. Automated systems verify every item's availability before listing and
   re-verify continuously (6-hourly for live, rotating batches for VOD),
   automatically removing anything that becomes unavailable or whose
   owner disables embedding. Our rights contact legal@whisco.tv honors
   takedown requests within 48 hours; to date we have received none.

The attached statement provides the full detail. We are happy to answer
any further questions, provide additional documentation, or schedule a
call at your convenience.

Thank you,
Ali Albaharna
Whisco TV — legal@whisco.tv
```

## B.3 Planned order of operations (for your strategic-call section)
1. Edit app name on App Information page → Save.
2. Scrub promo text + keywords on the 1.0 version page → Save.
3. Attach the PDF + Notes text under App Review Information → Save.
4. Send the Resolution Center reply.
5. Click "Resubmit to App Review" (same build 1.0 (5); no new binary).

---

*End of materials. Deliver your six sections now. Remember: kill optimism, [EST] tags on every probability, "NOT IN DATA" beats guessing.*
