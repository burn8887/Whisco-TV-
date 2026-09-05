# WHISCO TV — GCC STREAMING REGULATORY ENVIRONMENT
**Working research memo for the compliance roadmap**  
**Date:** 5 September 2026  
**Operator:** Whisco TV (whisco.tv), founder-operated, Kingdom of Bahrain; intended contracting entity Whisco Media W.L.L. (under formation)  
**Scope:** licensing, content standards, advertising, data protection, and 2025–2026 pending legislation across the six GCC states  
**Status:** research synthesis, not legal advice. Every conclusion below that turns on statutory construction must be confirmed by a Bahrain-licensed lawyer (and, for KSA and UAE extra-territorial questions, local counsel). Sources are cited in §8. Where the public record is thin, that is marked **UNCERTAIN**.

---

## 0. How to use this memo

Whisco is a Bahrain-based free AVOD/FAST aggregator: official/FTA/public-domain sources, mostly official YouTube embeds, cookieless Vercel analytics on the website, apps labelled “Data Not Collected,” no signup, no subscriptions, max one display ad per page. Audience is GCC expats. There is no meaningful MAU yet. Do not invent traffic.

This memo answers one operational question first, then walks each state.

**The operational question:** does a Bahrain-based free AVOD site that is *reachable* in the other five GCC states need a media licence *in each of those states*?

**Short answer, with the honesty the roadmap needs:**

| State | Need a local media / OTT licence *today*, solely because the site is reachable there? | Real risk if you stay unlicensed there | What actually happens to small foreign platforms |
|---|---|---|---|
| **Bahrain (home)** | **Possibly yes** — Law 41/2025 created an electronic-media-site licence. Whether Whisco is in the closed list, or only if the Minister later names “streaming aggregators,” is the single highest-priority counsel question. | Administrative: regularise within the six-month window; unlicensed operation is a statutory offence. | Home regulator can reach the founder. This is not a foreign-site problem. |
| **Saudi Arabia** | **Not a full licence at current scale.** CST Video-OTT *registration* applies to local *and* international providers serving KSA users, but **Appendix 3 exempts Video OTT platforms with fewer than 35,000 KSA subscribers (trailing 12-month average).** GAMR also publishes a SAR 2,000 “unscheduled audiovisual broadcast / AVOD-OTT” licence that assumes a KSA commercial registration — dual-track **UNCERTAIN**. | Low-to-medium *licence* risk while under 35k KSA users; medium *content* risk (blocking / takedown) at any scale. | Warnings, CST correspondence, GAMR content classification pressure, ISP blocking. Prosecution of a Bahraini founder with no KSA entity is uncommon for small AVOD sites. |
| **UAE** | **Probably not**, if you have no UAE entity, no UAE office, no UAE-based staff creating ads, and you are not “practising media activities in the State.” Federal Decree-Law 55/2023 expressly lists OTT/VOD as a media activity, and Article 12(6) attaches liability to digital publishers. Extra-territorial reach to a foreign website is **UNCERTAIN**. | Medium content / blocking risk. Low licensing-prosecution risk at current scale. Child Digital Safety Law 26/2025 *does* claim platforms “directed at” UAE users, including children. | NMA / TDRA blocking, app-store pressure, advertiser-permit enforcement against *people physically in the UAE*. Netflix-scale players localise; micro-platforms generally do not. |
| **Kuwait** | **No local licence required of a foreign website with no Kuwait office** under Law 8/2016 (current) or the incoming unified Media Regulation Law (Cabinet-approved 1 Sep 2026). Both licence *Kuwaiti* electronic media outlets and foreign *offices/correspondents*. Personal/non-professional sites are carved out. | Low licence risk. Medium content-blocking risk if a title crosses a red line. | Site blocking; action against a local office if one existed. New law’s implementing regulation is not out — watch it. |
| **Qatar** | **No**, absent a Qatar establishment (Ministry of Culture or Media City Qatar licence). Foreign OTT services have historically been accessible without a Qatar media licence. Influencer / digital-creator licences are a different regime and do not fit Whisco. | Low licence risk. Medium content-blocking risk. | Blocking and CRA/telecom tools. Local production houses are the ones who licence. |
| **Oman** | **No** for a foreign website. Media Law 58/2024 + Ministerial Decision 165/2025 licence Omani (or Omani-owned) electronic media. Article 81 of the executive regulation as reported requires the online media company to be Omani or Omani-owned. “Re-broadcast of any media activity inside Oman” is a separately licensed activity (OMR 10,000) aimed at local retransmission, not at a foreign URL. | Low licence risk. Medium-low content-blocking risk. | Blocking. Enforcement energy is on Omani licensees and local re-broadcasters. |

**Do not read “no local licence” as “no law applies.”** Content standards, cybercrime statutes, copyright, and (in KSA/UAE/Bahrain/Qatar/Oman) personal-data statutes can apply to a foreign controller that targets residents. The practical enforcement tool against a small foreign AVOD site is almost always **blocking + app-store + ad-network**, not a criminal file in a destination capital.

---

## 1. Cross-GCC picture in one page

There is **no GCC-wide OTT licence**. Each state licences media on its own statute. A 2022 GCC electronic-media committee statement that asked Netflix to remove content contrary to “Islamic and social values” shows political coordination on *content*, not a single permit. treat every national catalogue shelf as its own compliance object.

Common red lines across all six (statutory language differs; the operational test does not):

1. Insult to Islam, the Prophet, the Quran, or other divine religions.  
2. Insult to the ruling family, the state, or public officials in their official capacity.  
3. Pornography and explicit sexual content.  
4. Material treated as contrary to public morals — in practice this is how most GCC regulators handle LGBTQ-themed programming, even where the statute never uses those words.  
5. Incitement to violence, terrorism, or sectarian hatred.  
6. Gambling and real-money betting as a service, and (in most states) advertising of the same.  
7. Alcohol and tobacco advertising.  
8. Child sexual abuse material — zero tolerance, criminal everywhere.  
9. False news / harm to public order, drafted broadly.  
10. Unlicensed political campaigning.

Whisco’s existing sourcing doctrine (official/FTA/PD/contract only; no piracy; no porn; sanctions exclusions; GCC geo-gate) already covers most of this. The residual content risk is **imported third-party catalogue**: a legally sourced official YouTube embed can still be a title a destination regulator does not want on a shelf aimed at *its* residents. That is a geo-hide problem, not a sourcing problem.

Advertising, for a site that only runs Google display inventory at one unit per page and never overlays the player:

- Network policies (AdSense) are the first filter.  
- Local statutes still prohibit categories the network sometimes misses (alcohol, gambling, dating, political).  
- An advertiser *permit* (UAE Mu’lin, KSA Mawthooq, Kuwait incoming influencer licence) attaches to the **person creating the ad from inside that state**, not to a Bahrain publisher displaying a third-party display unit. Do not confuse the two.

Data protection, for a cookieless-analytics free platform with “Data Not Collected” apps:

- Website Vercel Web Analytics is cookieless but may still process IP / coarse device signals that several GCC statutes treat as personal data.  
- Apps currently collect nothing — keep that label honest. Adding an analytics SDK before v1.1 would change the analysis in every state at once.  
- Extra-territorial statutes (Saudi PDPL, UAE PDPL, arguably Qatar and Oman) can reach a Bahrain controller that “targets” their residents. Bahrain PDPL applies because the controller is there.

---

## 2. Bahrain (home state)

**Risk rating (Whisco as currently operated):**  
Licence / administrative: **HIGH until counsel maps Law 41/2025 onto the product, then likely MEDIUM**.  
Content: **MEDIUM** (home-state standards apply to everything published).  
Data protection: **MEDIUM** (PDPL is live; PDPA notification / DPO question is already an open item in the policy suite).  
Enforcement against a small local platform: **REAL** — the founder is in jurisdiction.

### 2.1 Licensing

Primary instruments:

- Decree-Law 47/2002 on the Press, Printing and Publishing, retitled by **Law 41 of 2025** (ratified 30 October 2025, effective 31 October 2025) to “Regulation of the Press and Digital Media.”  
- Older broadcast architecture: Legislative Decree 1/1993 (Radio and Television Corporation); copyright framing in Law 22/2006. Lexis Middle East practice note (July 2025) still states that **online streaming is not “broadcasting”** under Law 22/2006 — useful, but it does not answer the new electronic-media chapter.

Law 41/2025 added a new chapter on electronic media. The publicly reported text (Al Bilad / official summaries) is:

- Art. 67 bis: electronic media is part of the national media system; **no prior censorship** of content circulated on electronic media sites.  
- Art. 67 bis (1): the chapter applies to (1) electronic publishing houses, (2) electronic newspapers with no print edition, (3) websites of print newspapers, and **(4) any other electronic media sites specified by ministerial decision**.  
- Art. 67 bis (2): **no person may establish, operate or manage an electronic media site in Bahrain, or manage offices/branches of electronic media sites that operate from outside the Kingdom, without a licence from the Ministry of Information.** Print-newspaper websites are exempt from the *new* licence (they already hold a press licence). The Minister is to issue the conditions.  
- Art. 67 bis (3): Bahrainis may own such sites, subject to civil-capacity and good-character conditions.  
- Art. 67 bis (4): the applicant must appoint a responsible manager who is fully liable for published content, whether originated by the site or by others.  
- Art. 67 bis (6): decision within 30 days; silence is a deemed refusal.  
- Transitional: existing digital media platforms must **regularise within six months** of entry into force (i.e. a window that, on the face of the Ministry’s English summary, ran to about **30 April 2026**). Whether that window is still open, was extended, or has lapsed is **UNCERTAIN as of 5 Sep 2026** and must be checked with the Ministry / counsel on the first call.

**What this means for Whisco, honestly:**

Whisco is not a newspaper. It is not an “electronic publishing house” in the ordinary sense. The live question is item (4): has the Minister issued a decision that pulls **AVOD/FAST aggregators, streaming portals, or “media websites” generally** into the licensed class?

- If **yes**, Whisco needs the Ministry licence (and a responsible manager — the founder), and operating without it after the regularisation window is a statutory breach.  
- If **no decision yet**, the conservative reading is: you are in a grey zone the Ministry can close by decision at any time. Do not assume silence equals exemption.  
- If counsel’s reading is that an AVOD aggregator of third-party official embeds is **not** an “electronic media site” of the kinds listed, document that opinion and revisit the moment the ministerial decision appears.

Separately, **do not put “Television” in the registered company name** (already the formation-guide recommendation). A commercial-registration activity code for software / web portal / VOD is a MOIC matter; it is not a substitute for a Ministry of Information media licence if one is required.

TRA (Telecommunications Regulatory Authority) licences *telecommunications*. An OTT website delivered over the public internet is not, on current TRA practice, a telecom service. TRA spectrum / D2D decisions in late 2025 are irrelevant to whisco.tv.

Internet-only radio/TV *institutions* under the older press-law architecture (the four-category scheme that included “television institutions broadcasting exclusively on the internet”) required Cabinet-level approval and Bahraini-owned companies. That regime targeted *broadcasters*, not aggregators. **UNCERTAIN** whether Law 41/2025 silently overlays or replaces parts of it. Counsel must map both.

### 2.2 Content standards

No prior censorship of electronic-media content under the new chapter, but the prohibited-publication list in the press law (insult to the official religion, the King, public order, etc.) and the Penal Code still apply. Law 41/2025 removed imprisonment from *press-law* publication offences and replaced it with fines for two named crimes (official religion; the King), while preserving “any stricter penalty in other laws.” Human-rights groups treat this as a tightening of administrative control, not a liberalisation. For a family AVOD service the operational rule is the same as the sourcing policy already drafted: no porn, no incitement, no insult to Islam or the state, no CSAM, hide-don’t-fight on a Ministry notice.

Bahrain does not operate a consumer-facing age-rating bureau comparable to KSA GAMR or UAE classification for VOD catalogues. There is no public, title-by-title VOD classification obligation for a foreign-sourced embed catalogue that we can cite. **UNCERTAIN** whether a future ministerial decision under Art. 67 bis (1)(4) will invent one.

### 2.3 Advertising

Press/digital-media law plus consumer-protection and cybercrime rules. Prohibited categories track the GCC list above. Whisco’s “max one ad per page, never near the player, no pop-unders” is stricter than the statute and should stay that way — it is also the AdSense-remediation posture.

### 2.4 Data protection

**Law 30 of 2018 (PDPL)**, in force 1 August 2019, plus 2022 resolutions (notably 43, 44 and 48) on transfers, security and notification. Regulator: Personal Data Protection Authority (PDPA).

Applies to the Bahrain controller regardless of where the servers sit. Vercel (US) and Google (US) are cross-border transfers. Bahrain uses an adequacy-list model (publicly described as covering a large set of countries) plus PDPA authorisation or contractual safeguards for the rest. US transfer basis is already flagged as an open counsel item in Policy Suite v2.0.

Cookieless analytics: if the only processing is aggregated, non-identifying traffic counts, the PDPL burden is lighter. If IP addresses or device identifiers are stored and can identify a natural person, that is personal data — privacy notice, lawful basis (consent or another listed basis), security measures, and possibly **PDPA notification / DPO appointment**. Resolutions 43/44/48 of 2022 are the instruments counsel must read against the actual Vercel payload.

Apps: “Data Not Collected” must remain true. A future analytics SDK is a PDPL event.

### 2.5 Pending / 2025–2026

Law 41/2025 *is* the pending item that landed. Watch for: (i) the Minister’s decision specifying “other electronic media sites,” (ii) the licence-conditions decision promised by Art. 67 bis (2), (iii) any TRA or iGA guidance on aggregation of third-party streams. No separate “VOD bill” is visible.

### 2.6 Recommended posture (Bahrain)

1. Counsel memo, this month: is whisco.tv an Art. 67 bis (1) site today? Has the six-month regularisation window closed? What is the application form and fee?  
2. If the answer is yes, file. Appoint the founder as responsible manager. Do not wait for a complaint.  
3. If the answer is “not until the Minister names the class,” diary a monthly check of the Ministry circulars and keep the entity name / CR activity codes away from “broadcasting.”  
4. Close the PDPA notification / DPO / US-transfer questions in the same counsel engagement.  
5. Keep the public policies (sourcing, takedown, ads, privacy, ToS) aligned with whatever licence conditions emerge.

---

## 3. Saudi Arabia

**Risk rating:**  
Licence at current scale: **LOW-to-MEDIUM**, driven by the 35,000-subscriber CST exemption, with a residual dual-authority mess.  
Content: **HIGH relative to the other five** — most active classification and values machinery in the GCC.  
Data protection: **MEDIUM-HIGH** on paper (extra-territorial PDPL, active SDAIA); **LOW-MEDIUM in practice** for a no-account cookieless site with no KSA entity.  
Enforcement against a small foreign AVOD: **content blocking and correspondence, not a Riyadh prosecution**, unless the catalogue becomes a political or religious incident.

### 3.1 Licensing — two authorities, do not mix them up

**A. CST — Regulations for Providing Digital Content Platform Services**  
Issued by the Communications, Space and Technology Commission. Adopted 1 January 2024; widely reported as **in force 8 October 2024**. Apply to **local and international** providers that offer the listed services to users in the Kingdom.

Regulatory tools (Art. 5 / Annexes, as published on Qanoniah and Lexis Middle East):

| Service | Tool | Exemption (Annex 3) | Application fee | Annual fee |
|---|---|---|---|---|
| Satellite pay-TV | Licence | None | SAR 10,000 | SAR 50,000 |
| IPTV | Licence | None | SAR 10,000 | SAR 50,000 |
| **Video OTT** | **Registration** | **< 35,000 KSA subscribers, trailing 12-month average → no tool required** | SAR 5,000 | SAR 50,000 |
| Audio-on-demand / internet radio | Registration | Same small-platform carve-out (confirm exact threshold in Annex 3 for audio) | SAR 5,000 | SAR 50,000 |
| Social media / video-sharing | Notification | Annex 3 carve-outs exist | none | none |

Definition that matters: a **Video OTT platform** is a platform that provides linear or on-demand video to users over the public internet on a path the platform does not own, **with a major role in determining the content available**, content predominantly **not user-generated**. That is Whisco, not YouTube. YouTube is the “video-sharing” bucket.

Whisco today has no meaningful MAU and therefore no 35,000 KSA subscribers. On the face of Annex 3, **CST registration is not required today**. The moment a trailing-twelve-month average of KSA subscribers crosses 35,000, registration is mandatory *before* continuing to serve KSA users. “Subscriber” for a free no-account AVOD is **UNCERTAIN** — unique KSA users? registered accounts? paying subscribers? Counsel must get CST’s working definition in writing; do not guess. Until then treat unique KSA visitors as the conservative proxy and instrument country-level analytics so the crossing is visible.

CST enforcement tools stated by counsel summaries: warnings, suspension or cancellation of the tool, and the general CST penalty framework. Failure to hold the required tool can also support blocking.

**B. GAMR (formerly GCAM) — Audiovisual Media Law (Royal Decree M/33, 2017) and the Elaam / gmedia.gov.sa licence catalogue**

GAMR licences traditional broadcast, cinema, production, import/distribution of audiovisual content, and — on the current service card — **“unscheduled audiovisual or audio broadcast services”** described as distributing VOD via SVOD / AVOD / TVOD / OTT / apps or a platform, servers inside *or outside* the Kingdom, plus MCN-style networks. Fee on the national-platform card: **SAR 2,000**, term **3 years**, requires a KSA commercial registration with the media activity and a national address. Applicant must be owner or company manager.

This is the dual-track problem. Chambers TMT 2026 and Hammad & Al-Mehdar describe CST as the digital-platform regulator and GAMR as the traditional-broadcast / production / classification regulator. GAMR’s own service catalogue still sells an OTT/AVOD licence that looks like it wants a local company. **Which tool a foreign, no-entity, sub-threshold AVOD must hold is UNCERTAIN and is the #1 KSA counsel question.** Working hypothesis, to be confirmed: CST Annex 3 is the live extra-territorial rule for foreign OTTs; the GAMR SAR 2,000 product is for KSA-registered media companies that want to operate VOD as a licensed media activity. Do not apply for the GAMR product without a KSA entity — you will be asked for a CR you do not have.

MISA investment licence is required to *establish* a foreign-owned media company in KSA. That is a market-entry decision, not a condition of remaining a foreign website under the 35k exemption.

### 3.2 Content standards

GAMR classifies audiovisual works (cinema, games, and in practice much of what licensed platforms carry). Pre-clearance for a foreign SVOD catalogue is measured in weeks, not days (industry side-by-sides vs UAE). Values tests: Islam, public morals, national security, no insult to the state. A 2022 GCC electronic-media statement specifically named Netflix. CST regulations add operational / content-compliance duties on registered platforms (local representative is mentioned in some 2025 practitioner notes — **UNCERTAIN** whether that duty attaches only to registered, above-threshold OTTs).

For Whisco: do not attempt title-by-title GAMR classification of 15k YouTube embeds. That is not how official-embed aggregators are processed, and it is not executable by two people. The executable control is the existing **GCC geo-gate + prohibited-category hide + human override**, plus a written rule that any GAMR / CST notice hides the title in KSA within one verification cycle.

New **Copyright Law** (Royal Decree M/169, Gazette 13 February 2026, in force **12 August 2026**): broadcasting no longer includes computer-network transmission; streaming sits under a “making-available” right. Safe harbour for internet content providers is introduced, with conditions. Implementing regulation due from SAIP within 180 days. This is good news for a diligent aggregator with a takedown policy; it is not a licence.

### 3.3 Advertising

No single statutory advertising code that we can cite as “the” KSA AVOD ad code. Working rules from GAMR consultations and practitioner summaries: no alcohol, tobacco, gambling, betting-tipsters, weapons; no offence to Islam; no misleading claims. Social-media advertising by *in-Kingdom creators* goes through GAMR’s Mawthooq product (reported SAR 15,000 / 3 years) — that is not Whisco’s display-ad unit. AdSense category exclusions should be set to the GCC-prohibited list and reviewed quarterly.

### 3.4 Data protection

**PDPL**, Royal Decree M/19 of 2021, amended 2023, in force 14 September 2023, enforced by **SDAIA**. Extra-territorial: processing personal data of KSA residents can pull a foreign controller in. SDAIA has been issuing violation decisions through 2025–2026 (practitioner count of 48 decisions across those cycles — treat the number as directional, not audited).

Cookies: no standalone cookie statute. Practitioner view (Chambers 2026): consent expected for advertising cookies / SDKs / cross-site identifiers. Cookieless first-party analytics is the right design. If Vercel logs are not tied to an identifiable KSA resident, the PDPL exposure is small; if they are, a privacy notice in Arabic and English, a lawful basis, and a transfer mechanism (adequacy / SCCs / SDAIA-approved safeguards after the 2023 amendments) are required.

Marketing use of personal data requires prior consent. Whisco does not do email marketing today. Do not start.

Penalties: up to SAR 5 million per violation, doublable; criminal exposure for disclosing sensitive data. Those numbers are for serious controllers, not a cookieless brochure site — but they are why the apps must stay “Data Not Collected.”

### 3.5 Pending / 2025–2026

CST regulations already in force. Copyright Law in force August 2026; SAIP implementing regulation pending. No public draft of a “Netflix law” that would abolish the 35k exemption. Watch CST FAQ updates for the definition of “subscriber” on free services.

### 3.6 Recommended posture (KSA)

1. Do **not** incorporate in KSA and do **not** buy the GAMR SAR 2,000 product until counsel says the CST exemption is the wrong tool.  
2. Instrument KSA unique-user counts. Diary the 35,000 line.  
3. Before crossing it: CST registration pack, local-representative question, Arabic disclosures.  
4. Geo-hide on any CST/GAMR notice within one 6-hour cycle.  
5. Arabic+English privacy notice on the site; no KSA marketing lists.  
6. Counsel letter on: Annex 3 “subscriber” definition; GAMR vs CST; whether a local representative is required below the threshold (expected answer: no).

---

## 4. United Arab Emirates

**Risk rating:**  
Licence for a foreign website with no UAE footprint: **LOW-to-MEDIUM (grey)**.  
Content / blocking: **MEDIUM-HIGH** — well-resourced, newly centralised NMA, AI monitoring partnership reported in 2025.  
Child-safety statute: **MEDIUM** and new.  
Data protection: **MEDIUM** on paper; executive regulations of the federal PDPL still incomplete, which dampens enforcement but does not erase the statute.  
Enforcement against a small foreign AVOD: **blocking, not a Dubai prosecution**. Enforcement energy in 2026 is on in-country influencers and the Advertiser Permit.

### 4.1 Licensing

Primary instruments:

- **Federal Decree-Law 55 of 2023** Regulating Media (Media Law), in force December 2023.  
- Cabinet Decision 68/2024 (implementing regulation).  
- Cabinet Decision 42/2025 (administrative violations and penalties) — first-offence fines reported up to **AED 1 million**.  
- Cabinet Resolution 41/2025 (media services fees).  
- **Federal Decree-Law 11/2025** establishing the **National Media Authority (NMA)**, signed 30 September 2025, in force **1 January 2026**. NMA absorbs the UAE Media Council, National Media Office and WAM for licensing and content supervision, including digital media and free zones.

Article 8 of the Media Law defines media activities to include radio and television broadcasting **including IPTV, OTT or VOD**, paid or unpaid. Article 12(6) (practitioner reconstruction): a party engaging in electronic or digital media activities is liable for published content whether or not the activity is licensed. Article 5: media activities require a licence or permit. Article 16: foreign *media offices* in the State need a licence. Article 12(3): competent authority, with the Council/NMA, licences **smart applications that display foreign media content**.

Fees relevant to digital platforms (Cabinet 41/2025, selected): legal-entity licence for electronic/digital media platform activities offering audio-visual blogging — AED 5,000 issue / AED 5,000 renew; similar AED 5,000 band for news or advertising platform activities. These are products for persons establishing a media outlet **in the UAE**.

**Does a Bahrain website need one?** The Media Law’s scope clause applies to persons and institutions “involved in media activities **within the State**.” A foreign URL that UAE residents can open is not automatically “within the State.” Indicators that a service is *directed at* the UAE (local marketing, UAE-specific commercial terms, a .ae app store listing with UAE targeting, UAE staff, UAE bank collection) would strengthen the NMA’s hand. Whisco’s honest description — GCC-wide expat catalogue, no UAE entity, no UAE ads sales house — sits on the safer side of that line but is not a formal exemption.

**UNCERTAIN, and material:** whether the “smart applications displaying foreign media content” permit is being applied to foreign iOS/Android apps in the UAE storefronts. iOS was submitted 2 September 2026. If NMA/TDRA starts treating App Store availability as “display of foreign media content in the State,” the analysis changes. Watch the first year of NMA practice.

### 4.2 Content standards

Article 17 Media Content Standards (religion, public morals, national unity, no fake news, no prejudice to the state, respect for other states, etc.). No official local-content quota for foreign programming. Classification exists for theatrical and, in industry practice, for SVOD catalogues; UAE pre-clearance is faster than KSA (days vs weeks) on the same master.

**Federal Decree-Law 26 of 2025 on Child Digital Safety**, in force **1 January 2026**, covers websites, apps, live-streaming and on-demand video that operate in the UAE *or are directed at UAE users*. Obligations (age-assurance, child-default safety, parental tools) will be fleshed out by TDRA technical standards and NMA content rules. For a family AVOD with no accounts and no child-directed product surface, the near-term executable steps are: honest age-gating language in the store listings, no child-directed ad categories, ability to hide a title on an NMA child-safety notice. Building an age-assurance stack is not executable by two people and is not required until the technical standards say it is; **do not volunteer a half-built age gate**.

NMA + Presight AI content-monitoring platform (2025 industry reporting): treat it as a reason to keep the catalogue boring, not as a reason to hire a 10-person moderation team.

### 4.3 Advertising

Same content standards apply to ads. Ads must be identifiable as ads, factual, not contrary to public interest. TDRA consumer-protection / anti-spam rules sit on top for electronic marketing.

**Advertiser Permit (Mu’lin)** from 1 February 2026: required of individuals who create advertising content *from within the UAE*, paid or unpaid. Visitor permit for non-residents who come in to shoot. This is not a licence Whisco needs in order to display a Google ad unit served to a UAE IP. It would become relevant only if the founder physically produces promotional content inside the UAE, or if Whisco hired UAE-based creators. Do not ignore it on founder travel; do not over-read it as an OTT licence.

Prohibited ad categories: alcohol, tobacco, (mainland) gambling — note the separate GCGRA advertising standards that apply to licensed commercial gaming operators, which Whisco will never be. Political advertising is tightly controlled.

### 4.4 Data protection

**Federal Decree-Law 45 of 2021 (UAE PDPL)**, in force 2 January 2022. Regulator: UAE Data Office (still not fully operational in public reporting; executive regulations still outstanding as of late-2025 practitioner notes — **UNCERTAIN whether they landed in 2026**). Extra-territorial if goods/services are offered to UAE residents. Free-zone overlays (DIFC, ADGM) do not apply to Whisco.

Cookieless analytics + no accounts + apps that collect nothing is the correct design. If the site targets UAE residents (Arabic/English GCC copy, UAE-available apps), assume the PDPL can be argued to apply and keep the privacy notice honest. Transfers: adequacy or safeguards once the executive regulations specify them.

Child Digital Safety Law is the newer, sharper instrument for a streaming product.

### 4.5 Pending / 2025–2026

NMA stood up 1 January 2026. Cabinet 42/2025 penalty schedule is live. Child Digital Safety Law live. Watch: executive regulations of the PDPL; any NMA circular on foreign OTT apps; TDRA child-safety technical standards.

### 4.6 Recommended posture (UAE)

1. Do not open a UAE media company or free-zone media licence at this scale.  
2. Do not run UAE-specific paid user-acquisition that would look like “directing the service at the UAE” until the NMA foreign-app question is answered. Organic GCC SEO is different from a Dubai campaign.  
3. Store listings: family service, no child-directed claim you cannot operationalise, “Data Not Collected” kept true.  
4. Hide-on-notice for NMA.  
5. Founder travel: if shooting promotional content on UAE soil, the Advertiser Permit question is live.  
6. Counsel question list: extra-territorial application of Art. 8 to a foreign URL; smart-app permit for Play/App Store; Child Digital Safety technical standards timeline.

---

## 5. Kuwait

**Risk rating:**  
Licence for a foreign website: **LOW**.  
Content: **MEDIUM** (conservative public-morals enforcement; blocking is used).  
Data protection: **LOW-MEDIUM** — no comprehensive PDPL yet; sectoral + cybercrime + 2026 e-commerce law.  
Enforcement against a small foreign AVOD: **LOW**. Watch the new unified media law’s implementing regulation.

### 5.1 Licensing

**Current (until the new law repeals it):** Law 8 of 2016 on Electronic Media. Professional electronic media outlets need a Ministry of Information licence (historically 10-year term). Applicant must be Kuwaiti, 21+, good character. Personal / non-professional accounts are outside the law (Art. 5). Unlicensed professional activity: fine KWD 500–5,000 and possible permanent blocking (Art. 19). Foreign *offices and correspondents* are a separate licensed class.

**Incoming:** Cabinet approved a unified **Media Regulation Law** on 1 September 2026 (draft decree-law). It repeals Law 3/2006 (publications), Law 61/2007 (audiovisual) and Law 8/2016 (electronic media), and adds advertising, content-creation, artistic production and broadcast services. Reported features:

- Licence term 5 years; Ministry decision in 60 days or deemed acceptance.  
- Natural persons may hold most licences except print newspapers and satellite TV/radio; Kuwaiti nationality still required for those personal licences.  
- Electronic media of listed kinds needs a licence and a content-responsible person.  
- Art. 30 (draft as reported): law does **not** apply to a personal site/account that is not “professionally specialised”; executive regulation will define the line.  
- Art. 31: operating a listed electronic media means requires a licence.  
- Foreign media offices/correspondents: 2-year renewable licence, content standards bind them, Ministry can warn / cancel / close the office.  
- First-time integrated rules for influencers, ad disclosure (paid or unpaid) directed at the Kuwait public, embedded ads, reviews, giveaways, AI-generated content. False ads and unlicensed political funding are criminalised.

**Whisco is not a Kuwaiti person, has no Kuwait office, and is not an influencer.** Neither the 2016 law nor the incoming draft, on the published summaries, requires a foreign AVOD website to hold a Kuwait media licence. The incoming law *does* reach advertising *directed at the Kuwait public*. Display ads served by Google to a Kuwaiti IP are not, in any published draft we have, converted into a Whisco influencer licence — but a Whisco-originated sponsored campaign targeting Kuwait would be. Do not run one.

Implementing regulation is **not published as of 5 September 2026**. Status of the draft (Cabinet-approved vs issued as a decree-law vs in force) should be confirmed before relying on any article number.

### 5.2 Content standards

The prohibited list in the publications / audiovisual / electronic-media statutes (public order, religion, the Amir, morals, relations with other states) carries forward into the unified law’s reported 15 prohibitions, including news that harms the public interest. No consumer VOD classification bureau comparable to GAMR. Blocking is the working tool.

### 5.3 Advertising

Ministerial Decree 992/2022 (TV ads) as amended by Minister of Media Decree 2/2025 (published January 2026) regulates *television* advertising — not a foreign website. The new media law is the instrument that will matter for digital ads directed at Kuwait. Consumer-protection and the 2026 digital-commerce law (Decree-Law 10/2026) catch misleading commercial communications. Standard GCC prohibitions (alcohol, gambling, indecency) apply.

### 5.4 Data protection

No comprehensive PDPL. CITRA Decision 42/2021 (data-privacy regulation) is sectoral (telecom). Cybercrime statute + e-transactions + Decree-Law 10/2026 (digital commerce — defines personal data and treats streaming/video as a digital-commerce “store” when you *sell* digital services). A free AVOD that does not sell and does not collect accounts sits at the edge of 10/2026. **UNCERTAIN** how aggressively the Ministry of Commerce will read “store.” Keep the no-account, no-collection posture.

A full Kuwait PDPL has been “anticipated” for years. Do not plan on it landing this quarter; do not ignore it if it does.

### 5.5 Pending / 2025–2026

The unified media law is the live item (Cabinet 1 Sep 2026). Digital-commerce Law 10/2026 is already in the picture. Watch the media-law implementing regulation for any attempt to pull foreign platforms into the licensed class — that would be a change from current practice and should be assumed *not* to have happened until the Arabic text says it has.

### 5.6 Recommended posture (Kuwait)

1. No Kuwait entity. No Kuwait office.  
2. No Kuwait-targeted ad campaigns originated by Whisco.  
3. Hide-on-notice.  
4. Counsel: confirm in-force status of the unified law and whether Art. 30/31 can be read onto a foreign URL. Re-read after the executive regulation.

---

## 6. Qatar

**Risk rating:**  
Licence for a foreign website: **LOW**.  
Content: **MEDIUM**.  
Data protection: **MEDIUM** on paper (Law 13/2016, extra-territorial flavours); enforcement historically guidance-first, firmer since late 2024 according to practitioner notes.  
Enforcement against a small foreign AVOD: **LOW**.

### 6.1 Licensing

No public extra-territorial OTT-registration regime comparable to Saudi CST. Local media / culture activity is licensed by the **Ministry of Culture** (fees cut in 2024; advertising/PR issue fee reported cut from QAR 25,000 to QAR 5,000). **Media City Qatar** (Law 13/2019) licences OTT, digital content, publishing and related activities *for companies established in that ecosystem*. CRA regulates telecoms, not foreign websites.

Foreign correspondents / media houses working *in Qatar* need a Ministry licence. That is a presence test.

Shura Council in early 2025 reviewed a digital-content-creator / influencer licensing framework (reported QAR 25,000 issue / QAR 10,000 renew; Qataris apply directly, non-Qataris through a sponsor). That regime, if issued, is about creators, not a Bahrain AVOD aggregator.

### 6.2 Content standards

Publications and audiovisual rules plus Penal Code: Islam, the Amir, public morals, public order. beIN / TOD and the state media system are the local incumbents; they are not the regulator of a foreign URL. No public title-by-title VOD classification duty on foreign aggregators that we can cite.

### 6.3 Advertising

Ministry of Culture advertising activity licence is for agencies established in Qatar. Standard GCC prohibitions. CRA / telecom consumer rules for electronic marketing.

### 6.4 Data protection

**Law 13 of 2016 on Personal Data Privacy Protection.** Transfers permitted unless they would cause “serious damage” to data subjects (more permissive than Bahrain’s adequacy list). Direct electronic marketing needs prior consent and an opt-out. QFC has a separate GDPR-style regime that does not apply to Whisco.

Cookieless + no accounts is again the right design. If the privacy notice is honest and there is no Qatar marketing list, the residual issue is whether IP logs of Qatari visitors are personal data (yes, if identifiable) and whether the US processors meet the exporter’s duty to avoid “serious damage.” Document the assessment.

### 6.5 Pending / 2025–2026

Influencer / digital-creator framework under review since early 2025 — confirm whether it was issued. No public “foreign OTT must register” draft found. E-commerce licensing rules (Ministerial Decision 25/2026) target online *commercial* activity and storefronts; a free AVOD is a poor fit, but if Whisco ever sold anything to a Qatari user the analysis flips.

### 6.6 Recommended posture (Qatar)

1. No Qatar entity unless a partner deal requires Media City presence.  
2. Hide-on-notice.  
3. No Qatar marketing lists.  
4. Counsel: confirm the influencer framework does not sweep platforms; confirm Law 13/2016 transfer assessment for Vercel/Google.

---

## 7. Oman

**Risk rating:**  
Licence for a foreign website: **LOW**.  
Content: **MEDIUM**.  
Data protection: **MEDIUM** (PDPL 6/2022 is consent-heavy).  
Enforcement against a small foreign AVOD: **LOW**.

### 7.1 Licensing

**Royal Decree 58/2024** (Media Law), in force the day after Gazette publication (10 November 2024), repealed the 1984 press law, the 1997 artistic-works censorship law and the 2004 private radio/TV establishments law. **Ministerial Decision 165/2025** (11 September 2025, Gazette 14 September 2025) is the executive regulation.

Licensable activities include newspapers, audiovisual channels, news agencies, publishing houses, **electronic press and websites**, media services/consultancies, advertising, social-media accounts classified as media, and **re-broadcast of any media activity inside Oman**.

Reported conditions that matter:

- Executive regulation Art. 81 (Oman Observer, 17 Sep 2025): an online media company must be **Omani or owned by an Omani citizen**.  
- Majority of published content on a licensed electronic outlet must be **original content produced by the licensee** (Art. 87 as reported). That sentence alone is a poor fit for an aggregator of third-party official embeds — which is evidence that the licence is aimed at Omani electronic newspapers/channels, not at every foreign URL.  
- Licensed electronic outlets must keep a 180-day archive.  
- Fee schedule (annex to 165/2025), selected: electronic audiovisual channel OMR 500 / 3 years + OMR 500 guarantee; electronic publishing house / e-library / e-ad agency OMR 100; **re-broadcast of any media activity inside Oman OMR 10,000 + OMR 6,000 guarantee**; terrestrial/satellite audiovisual channel OMR 10,000.

Foreign correspondents and foreign media houses may work in Oman *with a Ministry licence* (Arts. 22–23 of the Law). That is a presence test.

“Re-broadcast inside Oman” is the clause a cautious reader might worry about. On the fee level and the surrounding articles it is aimed at a local entity retransmitting a channel, not at a user in Muscat opening whisco.tv. **UNCERTAIN at the margin**; counsel should confirm in one paragraph so the file is clean.

### 7.2 Content standards

The Media Law’s publication prohibitions (misinformation harming the state, incitement, content contrary to public order and morals, insult to religions) plus the residual artistic-works sensibility. No GAMR-style public VOD rating duty on foreign aggregators that we can cite.

### 7.3 Advertising

Licensed advertising activity for Omani establishments. Standard GCC prohibitions. Media professionals need permission from their employer before appearing in paid ads (Art. 22-adjacent rules). Irrelevant to display inventory.

### 7.4 Data protection

**Sultani Decree 6/2022 (Oman PDPL)**, in force 13 February 2023. Regulator: Ministry of Transport, Communications and Information Technology. More consent-centric than the UAE/KSA models. Cross-border transfers restricted unless conditions are met. Direct marketing is consent-based.

Same cookieless / no-account design recommendation. If Vercel processing of Omani IPs is personal data, the consent-heavy statute is awkward — legitimate-interest style bases are weaker here than in KSA. Prefer: minimise (do not store IPs longer than the host’s security logs require), publish an honest notice, do not build Omani marketing lists.

### 7.5 Pending / 2025–2026

The executive regulation landed September 2025. No separate foreign-OTT registration draft found. Watch Ministry circulars on electronic websites for any attempt to pull foreign platforms in — the Omani-ownership rule makes that legally clumsy, which is protective.

### 7.6 Recommended posture (Oman)

1. No Omani media company (you would not qualify on ownership, and the “majority original content” rule is the opposite of an aggregator).  
2. Do not market the service as an “Omani electronic channel.”  
3. Hide-on-notice.  
4. Counsel: one-page confirmation that a foreign AVOD URL is not “re-broadcast inside Oman.”

---

## 8. Data-protection comparison (cookieless free platform)

| | Bahrain | Saudi Arabia | UAE | Kuwait | Qatar | Oman |
|---|---|---|---|---|---|---|
| Statute | Law 30/2018 + 2022 resolutions | PDPL M/19 2021, amd. 2023 | Fed. Decree-Law 45/2021 | No comprehensive PDPL; CITRA 42/2021 (sectoral); cybercrime; Law 10/2026 e-commerce | Law 13/2016 | Decree 6/2022 |
| Regulator | PDPA | SDAIA | UAE Data Office (still maturing) | CITRA / MoCI / Public Prosecution as relevant | NCSA / National Data Privacy Office | MTCIT |
| Extra-territorial? | Controller is in Bahrain, so yes by default | Yes, KSA residents | Yes, if offering to UAE residents | Unclear / limited | Can reach processing of Qatari data | Can reach processing of Omani data |
| Cookie-specific rule | None standalone; consent / notice if personal data | None standalone; consent expected for ad/tracking cookies | None standalone; PDPL + TDRA spam rules | None | None standalone; e-marketing consent | Consent-heavy PDPL |
| Cookieless 1P analytics | Safer; still map the payload | Safer; still map the payload | Safer | Safer | Safer | Safer, but consent culture is stricter |
| Apps “Data Not Collected” | Keep true | Keep true | Keep true; Child Digital Safety is the add-on | Keep true | Keep true | Keep true |
| US processors (Vercel, Google, Apple) | Adequacy list + residual authorisation / contracts. Open counsel item. | Adequacy / SCCs / SDAIA safeguards after 2023 amendments | Waiting on executive regulations for operational detail | Limited statutory hook | Exporter risk assessment (“serious damage”) | Transfer conditions under PDPL |
| DPO / registration | Possible PDPA notification / DPO — open item | Registration duties scale with processing; not triggered by cookieless brochure site on current facts | Not operationally enforced against micro foreign sites | n/a | Not the near-term issue | Not the near-term issue |
| Practical priority | **High** (home regulator) | Medium (instrument KSA users; Arabic notice) | Medium (Child Safety + notice) | Low | Low-medium | Low-medium |

**Executable data posture for ≤2 people:**

1. Keep apps at Data Not Collected until v1.1, and treat any SDK as a six-jurisdiction event.  
2. Publish one honest bilingual (AR/EN) privacy notice that describes Vercel cookieless analytics, AdSense as a third-party on the *website only*, no sale of data, no accounts.  
3. Do not build marketing lists.  
4. Record a one-page transfer assessment for US processors under Bahrain PDPL (the controlling statute for the controller) and staple KSA/UAE extra-territorial notes to it.  
5. Do not appoint a theatrical DPO before counsel says the PDPA notification threshold is met.

---

## 9. Advertising — single operating rule

Set AdSense (and any future own-player SSP) category exclusions to at least:

- Alcohol and related  
- Tobacco and vaping  
- Gambling, lotteries, betting tipsters  
- Dating and adult  
- Politics / political advocacy  
- Weapons  
- Misleading health / weight-loss claims  
- Anything that would make the “family living-room” sentence in the sourcing policy false

Never place an ad adjacent to the player. Never use pop-under networks. Never run a Whisco-originated paid social campaign that turns the founder into an in-country “advertiser” under UAE Mu’lin, KSA Mawthooq, or the Kuwait incoming influencer rules without taking the local permit first — which, at this budget, means **do not run those campaigns**.

---

## 10. Content-standards operating rule (all six)

The catalogue already geo-verifies playability. Add a **compliance hide**, distinct from a geo-fail hide:

- Trigger: written notice from a GCC ministry / GAMR / NMA / CST / TRA-equivalent, or a well-founded user flag that a title crosses a red line in §1.  
- Action: hide in the named state within one verification cycle (target 6 hours for live, 24 hours for VOD).  
- Do not argue the merits with the ministry by tweet.  
- Log the notice and the hide. That log is what counsel hands over.

Do not build six parallel classified catalogues. That is not executable. One catalogue, six hide-flags, human override already in the sourcing policy.

Particularly sensitive imported categories to pre-flag for human review before they land on a KSA or Kuwait shelf: LGBTQ-themed drama marketed as such, explicit sexuality even if the source is an official YouTube channel, political satire aimed at a GCC ruling family, Israeli current-affairs channels, Iranian state channels already on the sanctions/exclusion list.

---

## 11. Does Whisco need six licences? Final working answer

**No.** It needs a clean Bahrain home-state answer on Law 41/2025, a watched CST 35,000-user line in Saudi Arabia, and a hide-on-notice discipline everywhere. Buying media licences in UAE, Kuwait, Qatar and Oman without a local company is, on the statutes we can read, either impossible (nationality / ownership gates) or a product designed for a different person.

The expensive mistake would be the opposite of caution: standing up five shell media companies to “be safe.” That is how a $200/month operation dies. The cheap, correct caution is counsel on the two live grey zones (Bahrain electronic-media class; KSA CST vs GAMR + “subscriber” definition) and a diary for the Kuwait implementing regulation and the UAE NMA foreign-app practice.

---

## 12. Counsel question list (take this to the first meeting)

Bahrain-licensed counsel, in the same engagement as the WLL formation and the policy-suite review:

1. Is whisco.tv an Art. 67 bis (1) “electronic media site” today, or only if and when the Minister names the class?  
2. Has the six-month regularisation window closed? What is the application, fee, and responsible-manager form?  
3. Do CR activity codes for software / web portal / video programme distribution create a separate Information Affairs or TRA issue?  
4. PDPA notification, DPO, and US-transfer basis for Vercel / Google / Apple.  
5. Written view on whether official-YouTube-embed aggregation is “broadcasting.”

KSA counsel (short memo, not a full retain):

6. Confirm Annex 3 applies to a no-account AVOD and define “subscriber.”  
7. Confirm GAMR unscheduled-broadcast licence is not required of a foreign website below the CST threshold.  
8. Confirm no local-representative duty below threshold.

UAE counsel (even shorter):

9. Extra-territorial reach of Decree-Law 55/2023 Art. 8 to a foreign URL and to a foreign app in the UAE storefront.  
10. Child Digital Safety Law: what, if anything, a no-account family AVOD must ship in 2026.

Watch-only (no retain until a text appears):

11. Kuwait unified media law implementing regulation.  
12. Oman “re-broadcast inside Oman” confirmation, one paragraph.  
13. Qatar influencer framework final text.

---

## 13. Sources

Secondary sources compress and sometimes lag the Arabic text. Where a conclusion turns on an article number, counsel must read the Gazette.

**Bahrain**  
- Law 41/2025 amending Decree-Law 47/2002. Ministry of Information English release, 30 Oct 2025: https://www.mia.gov.bh/2025/10/30/hm-king-ratifies-issues-law-41-of-2025-following-approval-by-shura-council-and-the-council-of-representatives/?lang=en  
- Official Gazette PDF of Law 41/2025: https://legalaffairs.gov.bh/PDF/K4125.pdf  
- Article-level reporting of Arts. 67 bis–67 bis (6): Al Bilad, https://www.albiladpress.com/news/2025/6225/bahrain/951630.html  
- Freedom House, Freedom on the Net 2025 (Bahrain), on the then-draft amendments: https://freedomhouse.org/country/bahrain/freedom-net/2025  
- Lexis Middle East, Bahrain media regulations practice note, 22 Jul 2025 (streaming ≠ broadcasting under Law 22/2006).

**Saudi Arabia**  
- CST, Regulations for Providing Digital Content Platform Services (decision 505/1445; adopted 1 Jan 2024; reported in force 8 Oct 2024): CST page https://www.cst.gov.sa/ar/business/regulations-and-licenses/regulations/Document-1549 and English text via Qanoniah / Lexis (Annex 3 35,000-subscriber exemption; fee table).  
- Digital Policy Alert chronology: https://digitalpolicyalert.org/change/11255  
- Hammad & Al-Mehdar, “Digital Streaming in KSA,” 14 May 2026: https://hmco.com.sa/digital-streaming-in-ksa-compliance-for-global-platforms/  
- GAMR unscheduled-broadcast service card: https://gmedia.gov.sa/ar/services/licensing-of-unscheduled-audio-or-visual-broadcasting-services and Elaam guide PDF https://elaam.gmedia.gov.sa/img/GCAMGuideArV5.pdf  
- Chambers TMT 2026, Saudi Arabia (GAMR vs CST split).  
- Baker McKenzie, new Copyright Law M/169, 12 Aug 2026 in-force date: https://www.bakermckenzie.com/en/insight/publications/2026/07/saudi-arabia-new-copyright-law-modernises-ksa-ip-framework  
- Chambers Data Protection 2026, Saudi Arabia (cookies; SDAIA).

**UAE**  
- Federal Decree-Law 55/2023: https://uaelegislation.gov.ae/en/legislations/2145  
- Federal Decree-Law 11/2025 (NMA), in force 1 Jan 2026: https://uaelegislation.gov.ae/en/legislations/3943  
- Cabinet Resolution 41/2025 (fees): https://uaelegislation.gov.ae/en/legislations/2869/download  
- Cabinet Decision 42/2025 (penalties) as reported by Lexology / BDO Legal / Gulf News.  
- Lexology, “In brief: media law and regulation in UAE,” 28 May 2026.  
- BDO Legal, “Content Liability Under UAE Media Law,” 27 Apr 2026.  
- Federal Decree-Law 26/2025 Child Digital Safety, in force 1 Jan 2026 (practitioner summary: https://kooch.co/en/post/uae-child-digital-safety-platform-age-assurance).  
- Gulf News, Advertiser Permit from 1 Feb 2026: https://gulfnews.com/uae/new-uae-law-advertiser-permit-now-mandatory-for-influencers-and-creators-for-social-media-1.500427938

**Kuwait**  
- Law 8/2016 on Electronic Media (current until repealed): practitioner text https://kuwaitlawyer.net/قانون-تنظيم-الإعلام-الإلكتروني/  
- Unified Media Regulation Law, Cabinet 1 Sep 2026: Times Kuwait https://timeskuwait.com/kuwait-unveils-draft-media-law-to-modernize-regulations-regulate-digital-content/ ; Al-Jarida 3–4 Sep 2026 article-level reporting including draft Arts. 30–31.  
- Decree-Law 10/2026 on digital commerce.

**Qatar**  
- Law 13/2016 (PDPPL).  
- Media City Qatar / Ministry of Culture licensing overview: https://www.qatarliving.com/en/article/media-city-qatar-licensing-media-creative-businesses  
- Mashael Alsulaiti, digital content-creation framework before the Shura Council, 12 Jan 2025: https://mas.com.qa/news/qatars-new-legal-framework-for-regulating-digital-content-creation

**Oman**  
- Royal Decree 58/2024: https://decree.om/2024/rd20240058/  
- Ministerial Decision 165/2025 executive regulation and fee annex: https://qanoon.om/p/2025/moi20250165/  
- Oman Observer, 17 Sep 2025, Arts. 81, 86–88 as reported: https://www.omanobserver.om/article/1176678/oman/moi-sets-rules-to-regulate-media-activities-in-oman and https://www.omanobserver.om/ampArticle/1176680

**Data protection cross-cut**  
- Axipro comparison of BH / UAE / KSA PDPL, Jun 2026: https://axipro.co/pdpl-bahrain-uae-saudi-arabia/  
- The Oath / HFW, “GCC data laws: one size doesn’t fit all,” Dec 2024 / May 2026 reprint: https://theoath-me.com/gcc-data-laws-one-size-doesnt-fit-all/  
- Kennedys overview of GCC DP laws, Mar 2026.  
- Chambers Data Protection 2026, Saudi Arabia.

**Industry context (not law)**  
- Mordor, Middle East OTT, 2026 (notes KSA 2025 media rules and UAE Cabinet 42/2025).  
- Molten Cloud, UAE vs MENA clearance times.

---

## 14. Document control

| Version | Date | Notes |
|---|---|---|
| 1.0 | 5 Sep 2026 | First research cut for the compliance roadmap. Not legal advice. Revisit on: Bahrain ministerial decision under Art. 67 bis (1)(4); CST subscriber definition; Kuwait implementing regulation; UAE NMA foreign-app practice; PDPL executive regulations in the UAE. |

Next review: on incorporation of the WLL, or on any of the watch-items above, whichever is first.
