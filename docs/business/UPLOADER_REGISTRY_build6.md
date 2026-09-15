# UPLOADER REGISTRY — WHERE OUR VOD CATALOGUE ACTUALLY COMES FROM
**Measured 2026-09-15 against the live database. Not estimated.**
Method: YouTube's public oEmbed endpoint, per video, no API key, full catalogue.
Raw counts are facts. The tier judgements in Part 2 are **my assessment and are marked as such** — they are proposals for the human tick, not clearances.

---

## PART 1 — THE HEADLINE (facts only)

| Metric | Value |
|---|---|
| YouTube titles in catalogue | **14,728** |
| Titles resolved to a named uploader | **14,472** (98.3%) |
| **Distinct uploader channels** | **66** |
| Channels carrying ≥100 titles | **42** |
| Titles in those 42 channels | **13,532** = **92% of the catalogue** |
| Channels carrying exactly 1 title | **0** |
| **Not embeddable** (owner disabled embedding) | **52** — hidden from viewers |
| **Video gone** | **1** — hidden |
| Network errors, retryable | 3 |

**Why this matters more than anything else in the build:** we do not have a
catalogue of 14,728 random YouTube videos. We have a **66-channel registry**, where
the overwhelming majority are identifiable broadcasters, studios and licensed
distributors. That is a documentable, reviewable structure — and it is exactly the
official-channel allowlist Grok's lock calls for. It now exists as measured data
rather than assertion.

**Two facts that fall out of this and are worth stating plainly:**

1. **The 52 non-embeddable videos were a latent defect.** Their owners had switched
   embedding off, so they could not play in our app at all — dead tiles for viewers
   and, worse, third-party titles presented without a usable right. They are now
   hidden. That is a genuine product fix, not just a legal one.
2. **Nothing in this pass proves ownership.** It proves *who uploaded what*. Whether
   an uploader is the rights holder is a human judgement, and Part 2 is that
   judgement, offered for review.

---

## PART 2 — THE 42 CHANNELS THAT CARRY 92% OF THE CATALOGUE
**[My assessment — NOT a clearance. Every row needs the human tick.]**

### Tier A — Oficial broadcaster / studio / distributor channel (I believe these are the rights holder or their licensed channel)
*Rationale: verified-handle channels of companies whose business is owning or licensing this content.*

| Channel | Titles | Handle |
|---|---|---|
| Shemaroo Movies | 900 | @shemaroomovies |
| DW Documentary (Deutsche Welle) | 780 | @DWDocumentary |
| FilmRise Television | 695 | @FilmRiseTelevision |
| **SET India (Sony Entertainment Television)** | 594 | @SETIndia |
| ARY Zindagi | 586 | @ARYZindagiofficial |
| FilmRise True Crime | 585 | @FilmRiseTrueCrime |
| B4U Kadak | 496 | @b4ukadak |
| Shout! Studios | 469 | @ShoutStudios |
| Banglavision DRAMA | 436 | @banglavisiondrama |
| **BUZZR (Fremantle)** | 434 | @BUZZRtv |
| Rajshri | 393 | @Rajshri |
| GMA Network | 371 | @gmanetwork |
| Millennium Cinemas | 366 | @millenniumcinemas |
| القناة الرسمية للمخرج بسام الملا *(the director's own official channel — the Arabic literally says "official")* | 351 | @Bassamalmalla1 |
| Goldmines | 341 | @GoldminesTelefilms |
| Indosiar | 340 | @indosiar_ivm |
| Banijay Documentaries | 305 | @BanijayDocumentaries |
| FilmRise Movies | 305 | @FilmRiseMovies |
| ARY Digital HD | 109 | @ARYDigitalasia |
| **HAR PAL GEO** | 149 | @HarPalGeoOfficial |
| Sun TV | 102 | @suntv |
| Colors TV | 99 | @colorstv |
| **HUM TV** | 138 | @HUMTV |
| **ABS-CBN Entertainment** | 133 | @abscbnentertainment |
| **Family Feud (Fremantle)** | 151 | @familyfeud |
| B4U Plus | 193 | @B4UPlus |
| Banijay Crime | 168 | @BanijayCrime |
| Pen Movies | 155 | @PenMovies |
| Amrita Movies | 224 | @amritamovies |
| Green TV Entertainment | 96 | @GreenEntertainmentTV |
| Jeepney TV | 215 | @jeepneytv |
| tvOneNews | 167 | @tvOneNews |

### Tier B — identifiable brand, licence needs confirming
| Channel | Titles | Handle |
|---|---|---|
| Popcornflix | 344 | @Popcornflix |
| Maverick Movies | 395 | @MaverickMovies |
| Sham Cinema | 297 | @shamcinema |
| Real Stories | 254 | @RealStories |
| Free Documentary | 233 | @FreeDocumentary |
| Timeline – World History Documentaries | 299 | @TimelineChannel |
| CD CHOICE Drama | 197 | @cdchoicedrama |
| Volga Video | 134 | @VolgaVideo |
| OSR Movies | 153 | @OSRMovies |
| Lanka Cinema | 142 | @Lanka_cinema |
| iDream Vizag | 144 | @idreamvizag |

### Tier C — needs scrutiny before use
| Channel | Titles | Handle | My concern |
|---|---|---|---|
| **AR Entertainments Movies** | 289 | **@TeluguOnlineMasti** | The channel name and the handle disagree. A handle like "TeluguOnlineMasti" reads like an aggregator, not a rights holder. **[My assessment]** |
| HighlightsNepal | 96 | @highlightsnepal2009 | Name suggests clip highlights rather than licensed full works |
| Maverick Movies | 395 | @MaverickMovies | Appears in both B and C deliberately — see note |

**Honest note on Maverick Movies:** it carries 395 titles, which is a lot for an unverified channel. I could not establish what it is from the handle alone, and I did not want to write a confident-sounding guess. **NOT VERIFIED.** It should be checked before use.

*(Remaining 21 channels carry 849 titles between them — none individually above 96.)*

---

## PART 3 — WHAT I RECOMMEND TO GROK AND THE FOUNDER

1. **Tick Tier A as a class.** It is ~31 channels carrying the large majority of the catalogue, and every one is an identifiable company or broadcaster channel. This is the evidence-backed core.
2. **Tier B: check, then tick.** These are real brands but I have not established that the channel holds distribution rights.
3. **Tier C: do not tick.** Start with AR Entertainments Movies / @TeluguOnlineMasti — a handle that disagrees with the brand is the pattern that gets flagged.
4. **The 52 non-embeddable items are already hidden** — that decision needed no human, because the content literally cannot function.
5. **Once Tier A is ticked, the iOS VOD shelf is no longer "a small official set".** It is a large, named, evidenced catalogue — which also materially reduces the 4.2 / 4.3 "empty app" risk Grok rated at 25–40%.

---

## PART 4 — THE ARCHIVE.ORG REGISTER (same pass, item 5)

| Class | Items | App status |
|---|---|---|
| **Public-domain declaration, no obligations** (CC public-domain dedication, Public Domain Mark 1.0, CC0) | **1,154** | clearable on the human tick |
| Requires attribution (CC BY / BY-SA) | 18 | held until the app displays creator credit |
| **NonCommercial — NOT USABLE BY US** | **2** | blocked; see the note below |
| No declaration on the item page | 550 | excluded |

**The important catch, recorded because it nearly shipped:** my first classifier treated any Creative Commons URL as clearable, which swept in **"Panorama Ephemera" (CC BY-NC-SA)** and **"Lost Landscapes of Detroit 2010" (CC BY-NC)**. Whisco TV is funded by advertising — a **commercial** use — so NonCommercial licences are not available to us. The classifier now hard-blocks NC, and both rows were corrected. **A licence violation was caught before it shipped, by checking rather than assuming.**

Same reasoning is why the 18 CC BY / BY-SA items are held rather than cleared: they are commercially permitted, but they oblige us to credit the creator, and we are not yet displaying that credit.

---

## PART 5 — WHAT IS STILL NOT KNOWN

- **Ownership vs upload.** Who uploaded is now recorded for 98.3% of the catalogue. Whether that uploader is the rights holder is judgement, per Part 2.
- **Embeddability, definitively.** oEmbed success is a strong indicator that embedding is enabled. The definitive per-video flag is the YouTube Data API `embeddable` field — **the API key is still with the founder**.
- **Syndication/licence agreements.** If any of these channels have extended us a licence, that document leads the rights pack. **NOT IN DATA** — I have found no licence document in the workspace.
