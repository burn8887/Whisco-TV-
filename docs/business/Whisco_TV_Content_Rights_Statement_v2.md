# WHISCO TV — CONTENT SOURCING & RIGHTS STATEMENT

**Prepared for Apple App Review · App: Whisco TV (Apple ID 6807647992) · Version 1.0 (5) · 11 September 2026**
**Operator: Ali Albaharna (sole proprietor, Kingdom of Bahrain; company formation as Whisco Media W.L.L. in progress)**
**Rights contact: legal@whisco.tv**

---

## 1. Purpose and scope

This statement documents the rights basis for every category of content playable in Whisco TV, with named exhibits verified on 11 September 2026, the platform terms that authorize each mechanism, and a reviewer path for confirming each category on a device. Whisco TV hosts **no third-party media files**, provides **no downloading, saving, or format-conversion functionality**, and contains **no mechanism for users to add streams**.

## 2. The sourcing rule

Every item in the catalog is admitted under exactly one of three rules, enforced by automated verification before listing (§7):

1. **Owner-enabled official YouTube embeds** — playback exclusively inside YouTube's own embedded IFrame player, only for videos whose rights holders have enabled embedding on their official channels.
2. **Public-domain and openly licensed works** from the Internet Archive (archive.org), verified at item level.
3. **Free-to-air live streams** published by or on behalf of the originating broadcasters for free public reception.

**Excluded by policy:** pay-TV and premium channels, sports rights holders' protected content, subscription services' catalogs, and a maintained exclusion list of sanctioned broadcasters. There is no fourth category and no user-generated additions.

## 3. Category 1 — Owner-enabled official YouTube embeds

### 3.1 The authorizing terms

YouTube's Terms of Service (https://www.youtube.com/t/terms, "Permissions and Restrictions") state:

> "You may also show YouTube videos through the embeddable YouTube player."

And under the license each uploader grants ("License to Other Users"):

> "You also grant each other user of the Service a worldwide, non-exclusive, royalty-free license to access your Content through the Service, and to use that Content, including to reproduce, distribute, prepare derivative works, display, and perform it, **only as enabled by a feature of the Service (such as video playback or embeds)**."

Embedding is therefore a license mechanism operated by YouTube on behalf of its uploaders: a video is embeddable only while its owner leaves embedding enabled, and the embedded player is the feature through which the owner's license to other users flows. The rights holder keeps full control (they can disable embedding at any time, which immediately breaks playback in Whisco TV and triggers automatic removal, §7) and keeps their own monetization — the embedded player serves the owner's YouTube advertisements on every play.

Whisco TV never circumvents this mechanism: we do not rehost, proxy, cache, strip advertisements from, or extract streams from YouTube content. The IFrame player is loaded from youtube.com with YouTube branding and controls intact, and playback requests carry the app's identity as the IFrame API requires.

### 3.2 Verified exhibits (captured 11 September 2026 via YouTube's oEmbed endpoint)

Each row below is a title playable in the app today. "oEmbed author" is YouTube's own machine-readable attestation of the publishing channel; oEmbed returns a result **only for embeddable videos**.

| # | Title in app | Publishing channel (oEmbed author) | Channel URL (verified) |
|---|---|---|---|
| E1 | Kuruluş Osman, Episode 1 (Turkish series) | Kuruluş Osman (official series channel) | youtube.com/@KurulusOsman |
| E2 | K.G.F: Chapter 1 (Hindi) | Goldmines (official distributor) | youtube.com/@GoldminesTelefilms |
| E3 | Son of Satyamurthy (Hindi) | Goldmines (official distributor) | youtube.com/@GoldminesTelefilms |
| E4 | Shaidai, Episode 29 (Urdu drama) | HAR PAL GEO (official broadcaster) | youtube.com/@HarPalGeoOfficial |
| E5 | Someone, Someday (Filipino) | ABS-CBN Entertainment (official broadcaster) | youtube.com/@abscbnentertainment |
| E6 | Kalyanaraman (Malayalam) | Matinee Now (official distributor channel) | youtube.com/@MatineeNow |

These broadcasters and studios publish full-length content on their verified channels **with embedding enabled** as part of their own distribution strategy; the same pattern holds across the catalog (TRT, ATV, Kanal D, Shemaroo, Rajshri, B4U, HUM TV, ARY Digital, GMA, DW and similar official channels). Each exhibit above was additionally verified as playable in all six Gulf states and the United States on the capture date.

## 4. Category 2 — Internet Archive public-domain works

Classic films and television episodes are served from archive.org, the non-profit digital library. Each exhibit below carries an explicit public-domain license on its own Archive item page (metadata field `licenseurl`, verified 11 September 2026):

| # | Title in app | Archive item page | Item license |
|---|---|---|---|
| E7 | His Girl Friday (1940) | archive.org/details/his_girl_friday | creativecommons.org/licenses/publicdomain |
| E8 | Suddenly (1954) | archive.org/details/suddenly | creativecommons.org/licenses/publicdomain |
| E9 | The Stranger (1946) | archive.org/details/TheStranger_0 | creativecommons.org/licenses/publicdomain |
| E10 | House on Haunted Hill (1959) | archive.org/details/house_on_haunted_hill_ipod | creativecommons.org/licenses/publicdomain |

The collection is drawn from the Archive's Feature Films / public-domain collections (pre-1964 US works with unrenewed copyright, government and ephemeral films, and openly licensed material). Whisco TV claims no ownership of these works. Any Archive item found not to be public-domain or openly licensed is removed on notice.

## 5. Category 3 — Free-to-air live streams from official origins

Live channels are HLS streams published for free public reception — the internet equivalent of free-to-air satellite/aerial broadcast. The exhibits below stream from infrastructure operated by or for the named broadcaster (origin hostname shown; verified reachable 11 September 2026):

| # | Channel in app | Broadcaster | Stream origin |
|---|---|---|---|
| E11 | TRT World | TRT (Türkiye, public broadcaster) | tv-trtworld.medya.**trt.com.tr** |
| E12 | DW English | Deutsche Welle (Germany, public broadcaster) | dwamdstream102.akamaized.net (DW's published stream, as on dw.com) |
| E13 | France 24 English / Arabic / French | France Médias Monde (public broadcaster) | live.**france24.com** |
| E14 | Al Arabiya | Al Arabiya News Channel | live.**alarabiya.net** |

We do not decrypt, do not bypass authentication or geo-controls, and carry no pay-TV, premium sports, or subscription channel. A channel whose stream ceases to be publicly available is automatically removed (§7).

## 6. No downloading, saving, or conversion — by architecture

The app contains no download, save-offline, record, or format-conversion capability, and no such code paths exist in the binary. YouTube content never leaves YouTube's player; live streams play in the player with no persistence. The scenario Guideline 5.2.3 targets — apps that facilitate unauthorized saving or conversion of third-party media — has no surface in this app.

## 7. Automated verification, before and after listing

- **Admission:** every YouTube title is verified for (a) embeddability via YouTube's oEmbed endpoint, (b) full-length duration (no clips), and (c) playback availability in each of the six Gulf states, before it becomes visible.
- **Continuous:** live channels are re-verified end-to-end every six hours (manifest and segment fetch); on-demand titles are re-verified in rotating batches around the clock. Anything that becomes unavailable — including any video whose owner disables embedding or deletes it — is **hidden automatically, without human intervention**.
- These systems demonstrably remove content: approximately 2,300 titles that failed regional-availability verification are currently hidden from all users.

## 8. Honest limitation and removal commitment

We state plainly: Whisco TV does not hold separately signed licence agreements with the broadcasters and studios named in §3. Those organizations' content appears in the app **only** through the owner-enabled embedding mechanism described in §3.1 — their own channels, their own player, their own monetization, their own kill-switch. Where that mechanism does not apply, the content is public-domain (§4) or a freely broadcast stream (§5).

If App Review or any rights holder identifies a specific title, channel, or source of concern, we will **hide it within hours of notice** — our systems can remove any item instantly — and keep it hidden unless and until documentary permission exists. Rights contact: **legal@whisco.tv** (published in the app's About screen, on every page of whisco.tv, and in our Terms).

## 9. Reviewer path (no account required)

1. **Live TV** tab → **DW English** or **TRT World** → stream plays (official public-broadcaster FTA, §5).
2. **On Demand** tab → search "**Kuruluş Osman**" → any episode → the YouTube IFrame player loads with YouTube branding and controls visible (owner-enabled embed, §3, exhibit E1).
3. **On Demand** tab → search "**His Girl Friday**" → plays from the Internet Archive (public domain, §4, exhibit E7).

All three paths were verified playable from both Gulf and United States IP addresses on 11 September 2026.

## 10. Operator declaration

I declare that the statements above are accurate as of 11 September 2026; that Whisco TV hosts no third-party media files; that all playback occurs via the mechanisms described (owner-enabled embedding, public-domain works, and freely broadcast streams); and that Whisco TV will promptly remove any content upon substantiated notice from a rights holder or upon request from App Review.

**Ali Albaharna**
Operator, Whisco TV — whisco.tv · legal@whisco.tv · Kingdom of Bahrain
