# WHISCO TV — CONTENT SOURCING & RIGHTS STATEMENT
**Prepared for Apple App Review · Submission ID c80e30c4-5e07-4911-bb77-2ed58fd09caf · App: Whisco TV (Apple ID 6807647992) · 11 September 2026**
**Operator: Ali Albaharna (sole proprietor, Kingdom of Bahrain; company formation as Whisco Media W.L.L. in progress) · Rights contact: legal@whisco.tv**

---

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
