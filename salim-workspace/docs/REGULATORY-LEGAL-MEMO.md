# Bahrain & GCC Regulatory Issues Memo — Salim

**Version:** 1.0
**Snapshot date:** 2026-10-28
**Status:** Preliminary issue-spotting from official sources; not legal advice, a compliance opinion, or launch approval.
**Audience:** Founder and Bahrain/GCC counsel.
**Scope:** Salim — Road Awareness: fixed-camera awareness, map/data sourcing, advertising/subscriptions, privacy, community reports, and intended Bahrain-first/GCC scope.

## Executive summary

There is not enough verified information to conclude that Salim’s current build, data supply, operator, privacy disclosures, advertising, or planned reporting service is legally ready in Bahrain or any GCC country. The product has no verified registered operator in the project record; the domain is not live; the shared-reporting service is not deployed; and the inspected source files are not a complete inventory of every SDK, provider, data flow, retention rule, or released binary.

The most important legal research update is **Legislative Decree No. 38 of 2025**, which amended Bahrain’s Commercial Companies Law after the 2020 amendment. The official LLOC amendment listing records the decree in Gazette issue 3832 dated 11 September 2025 and links the Arabic text. It must be included in entity/corporate advice; the 2001 law or 2024 procedures guide alone is not a sufficient current-law basis. Obtain counsel’s advice from the Arabic official text and current MOIC implementing rules.

Until counsel and the relevant authorities resolve the listed questions, keep community reporting disabled, do not claim legal compliance or complete GCC coverage, and do not publish either existing privacy-page version as verified.

## 1. Company law, entity, activities and public identity

- **Operator unknown:** “Whisco Media W.L.L” is an unverified candidate in older project notes, not proven to be the Salim operator. No CR extract, ownership, UBO record, activity list or authority evidence has been reviewed.
- **2020/2024 conflict:** LLOC’s English guidance translation of Legislative Decree No. 28 of 2020 says amended Article 261 allows an LLC owned by one natural or legal person. MOIC’s 2024 Procedures Guide says a W.L.L. has 2–50 partners. Do not infer current Sijilat treatment from either in isolation. Ask MOIC/Sijilat for written confirmation and Bahrain counsel for a current-law opinion before selecting or filing a one-member W.L.L.
- **2025 amendment:** Legislative Decree No. 38 of 2025 further amended the Companies Law. LLOC records the official decree and Arabic text; a secondary overview flags expanded liability for actual managers, electronic corporate meetings/voting and other changes. Review the Gazette text and all implementing decisions with counsel. Do not extrapolate shareholding-company provisions to a W.L.L. without checking the precise article and form.
- **Activity classification:** Ask MOIC/Sijilat to classify the app operator, digital service, subscription, advertising, community submissions/moderation, and any future transaction features. MOIC’s eCommerce materials distinguish 4791 online retail from 6312 operation of eMarketplaces/websites/web portals. Those are reference categories, not a determination that either is Salim’s proper activity.
- **Public-facing claims:** company identity, CR, legal form, address, activity, support/legal contacts, and contracting party must match verified records. Do not present the product brand as a registered company without evidence.

## 2. Fixed-camera alerts and road-awareness product claims

The intended product scope is advance awareness of known, mapped **fixed cameras only**. It excludes police/patrol, covert enforcement, radar-emission detection and evasion features. The product’s claims must remain narrower than its evidence:

- OSM/Overpass map data is not an official or complete camera register; camera points can be missing, stale, approximate or incorrectly classified.
- No verified comprehensive GCC camera dataset with approved redistribution rights is established in the current project record.
- A warning is not a guarantee that a camera is present, absent, active, correctly located, or lawfully classified. Avoid “all cameras,” “real-time verified,” “official,” “fine-proof,” or guaranteed-avoidance claims absent specific proof and legal review.
- Human review is a proposed control for any future public user report; a community vote, app installation identifier, or claimed location accuracy does not prove identity, physical presence, or truth.
- Bahrain consumer-protection requirements make accurate representations important. A disclaimer does not cure misleading product claims or remove statutory duties. Review marketing, Arabic localization and app-store copy with Bahrain counsel.

Source: [Bahrain Consumer Protection Law No. 35 of 2012 (official Arabic text)](https://www.legalaffairs.gov.bh/Legislation/HTM/K3512). Also see [Content / Inventory Doctrine](CONTENT-INVENTORY-DOCTRINE.md) and [Product Blueprint](PRODUCT-BLUEPRINT.md) for internal product controls.

## 3. Personal data and privacy (Bahrain PDPA)

Bahrain Personal Data Protection Law No. 30 of 2018 and its implementing orders apply analysis to the actual controller, purposes, data, processing methods and exemptions. The app’s location permission and location-based alert function make a documented data-protection assessment important even if precise route samples are intended to remain on-device.

Before launch, counsel/privacy lead should:

1. Identify the controller, processor(s), service providers and any joint-controller roles from the verified entity and contracts.
2. Inventory app/store/service data, permissions, identifiers, analytics/diagnostics, ad SDK behavior, map requests, IP/network metadata, purchase data, support messages, backups, logs, and all local/cloud storage.
3. Map purpose, legal basis, necessity, access, retention/deletion, security controls, user rights workflow and privacy notice for each data set.
4. Assess whether automated-processing notification is required or an Article 14 exemption applies under Order No. 44 of 2022; determine whether any Article 15 processing requires prior written authorization. Do not assume no-account or on-device design automatically exempts the controller.
5. Map all storage/processing/remote-access locations and apply Order No. 42 of 2022’s adequacy/transfer mechanism requirements. Consent alone should not be described as automatically resolving cross-border transfer obligations.
6. Implement breach response and assess Order No. 43 of 2022 safeguards and conditional notification timing (including its up-to-72-hour Authority notification requirement where applicable); confirm the exact trigger and clock with counsel.
7. Provide a functioning privacy contact, request/deletion route and complaint process before collection begins.

Official sources: [PDPA regulations](https://www.pdp.gov.bh/en/regulations.html); [Authority overview](https://www.pdp.gov.bh/en/about-PDPA.html); [Order 44/2022 — notification](https://www.pdp.gov.bh/en/assets/pdf/executive-decisions/eng/trans-order-submission-of-notifications-en.pdf); [Order 42/2022 — adequate-protection countries/transfers](https://www.pdp.gov.bh/en/assets/pdf/executive-decisions/eng/trans-order-countries-and-territories-with-adequate-protection-en.pdf); [Order 43/2022 — safeguards and breach notification](https://www.pdp.gov.bh/en/assets/pdf/executive-decisions/eng/the_be_met_in_the_technical.pdf); [Authority forms](https://www.pdp.gov.bh/en/forms.html).

### Source and product-state limits

A limited source inspection found Android fine/coarse location declarations and foreground location-service permission, an iOS location usage description, Google Mobile Ads dependency, and an iOS notice describing AdMob banners on Overview/Settings only while no drive is active plus UMP consent handling. This is **not** a complete review of current Android/iOS binaries, all transitive SDKs, server operations, app-store forms, map-provider logs, retention, transfers or real device behavior. Repeat a version-specific technical audit before publication and submission.

### Community reports: additional gate

The reporting API source is not deployed and the app client is not active for shared reporting, according to the current repository handover. Keep it disabled until the responsible entity, controller/processor roles, lawful basis, user notice, moderation staffing, complaint/appeal process, safety and abuse handling, retention/deletion, security test, provider contracts, cross-border assessment and incident response are approved. Consider location sensitivity, false reports, accusations, harassment, and requests for access or correction. Do not collect report data merely because the source code exists.

## 4. Advertising, subscriptions, consumers and taxation

- **Ads:** verify exact ad SDK and mediation inventory in each signed store binary; record personalization/consent behavior, regions, identifiers, IP/diagnostic data, and opt-out/restriction behavior. Do not promise ads appear only in specified screens until tested in the production build and the provider configuration is verified. Keep ads out of demo/debug builds as instructed; production monetization still needs the Founder’s existing approved product scope and platform/legal checks.
- **Subscriptions:** verify that app-store product terms, billing period, price, trial/renewal/cancellation, refund handling, restore flow, eligibility and disclosures are accurate in each storefront. Do not state that Salim receives no payment data without checking the actual developer/payment arrangement and support telemetry.
- **Consumer rights:** review subscription disclosures, cancellation/refund process, complaint channel, Arabic/English representations and customer-support obligations under applicable Bahrain rules and app-store terms. A disclaimer cannot waive mandatory rights.
- **VAT:** NBR lists BHD 37,500 as the resident mandatory taxable-supplies registration threshold and BHD 18,750 as the optional threshold. Determine the taxable supplier and treatment of Apple/Google marketplace settlements, ad receipts, foreign customers and cross-border digital services with a Bahrain tax adviser. Thresholds are not a conclusion that registration is or is not required.
- **Banking/e-payment:** MOIC describes Resolution No. 43 of 2024 on commercial transactions/bank accounts and e-payment. Confirm applicability to the selected operator and exact model; avoid categorical statements until reviewed.
- **Recordkeeping/CR:** verify annual CR renewal, bookkeeping, audit, invoice, UBO and filing duties for the chosen entity/activity from current primary sources and adviser.

Sources: [NBR VAT registration](https://www.nbr.gov.bh/vat_registration); [MOIC bank/payment announcement](https://www.moic.gov.bh/en/node/5732); [Bahrain CR renewal service](https://www.bahrain.bh/wps/portal/en/BNP/ServicesCatalogue/GSX-UI-PServiceDetails?psID=2036); [MOIC UBO information](https://www.moic.gov.bh/en/node/2778).

## 5. GCC rollout

A Bahrain CR or Bahrain privacy analysis does not establish permission to operate, advertise, collect/report location data, use camera data, or sell subscriptions in Saudi Arabia, Kuwait, Qatar, the UAE or Oman. Before entering each country, obtain country-specific advice on entity/licensing, road/enforcement-related content, data protection and transfers, consumer/subscription rules, advertising, tax, data-provider rights, localization, store disclosures, and complaints. Bahrain-first is a product sequencing intent, not a legal passport for the GCC.

## 6. Existing privacy page inconsistency and publication block

- `salim-workspace/site/privacy.html` names an individual operator and lists `legal@salimdrive.com` and `support@salimdrive.com`.
- `salim-workspace/deploy/privacy.html` still identifies the operating entity with a placeholder.
- Neither statement has been verified against a CR, approved public identity, mailbox ownership/deliverability, or a live domain. The domain is recorded as not live. The two pages must not be treated as matching or publication-ready.
- This Phase 4 produces a fresh **draft** policy with explicit placeholders; it does not edit either HTML file, configure a domain, test mailboxes, publish, or approve a legal text.

## 7. Required sign-offs before launch

| Gate | Evidence needed | Owner |
|---|---|---|
| Legal operator and authority | CR extract, activities, ownership/UBO, manager/signatory proof | Founder + Bahrain counsel |
| Activity/licensing | Written Sijilat/MOIC classification and all NOCs | Founder + counsel |
| Company-law currentness | Advice on Decree-Laws 28/2020 and 38/2025 and current implementing measures | Bahrain counsel |
| Data protection | End-to-end data map, PDPA notification/authorization/transfer assessment, rights process | Privacy lead + counsel |
| Binary/provider facts | Version-specific SDK/data-flow and store-form audit for Android and iOS | Engineering + privacy lead |
| Reports service | Security, moderation, complaints, retention, processor terms, activation decision | Founder + technical/privacy owners |
| Consumer/tax/payment | Store disclosures/refunds, VAT and payment-provider analysis | Bahrain tax/legal advisers |
| GCC entry | Country-by-country legal and data-rights approval | Local counsel before each launch |

## Official/primary references

- [LLOC Commercial Companies Law amendment record](https://www.lloc.gov.bh/en/Legislation/Amendments/L2101) — includes 2025 Decree-Law No. 38 of 2025 (Gazette issue 3832, 11 September 2025), 2021 and 2020 amendments.
- [LLOC Arabic text of Decree-Law No. 38 of 2025](https://www.lloc.gov.bh/Legislation/HTM/L3825).
- [LLOC English guidance translation of Decree-Law No. 28 of 2020](https://www.lloc.gov.bh/FullEn/L2820.docx); Arabic Official Gazette text prevails per LLOC disclaimer.
- [MOIC Procedures Guide (2024)](https://www.moic.gov.bh/sites/default/files/2024-03/Procedures%20Guide%20for%20Establishments%20and%20Commercial%20Companies.pdf) — includes the unresolved W.L.L. partner-count conflict noted above.
- [Library of Congress 2025 amendment overview](https://www.loc.gov/item/global-legal-monitor/2026-05-13/bahrain-updated-commercial-companies-law-takes-effect) — secondary overview only; not legal authority.

## Counsel questions

1. What is the current legal effect and Sijilat implementation of the 2020 single-owner W.L.L. amendment given the 2024 MOIC guide’s contrary count?
2. What provisions of Decree-Law 38/2025 and later implementing decisions apply to the intended form and proposed governance? Is there an authoritative consolidated Arabic text?
3. Which activity codes, approvals and ownership conditions apply to the exact app/subscription/advertising/reporting model?
4. Which PDPA notification, authorization, transfer, security, breach, rights and retention duties apply to the verified data inventory and providers?
5. What Bahrain and country-specific GCC restrictions or disclosures apply to fixed-camera awareness and user-submitted reports?
6. What entity, store-seller, consumer, VAT, e-payment and refund disclosures are required before monetization?
