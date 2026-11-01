# Salim — Road Awareness: Monetization Roadmap

**Version:** 1.0
**Snapshot:** 2026-10-28
**Commercial status:** Pre-launch; no product revenue evidence, published price, tested conversion or ad settlement. Actual revenue is `$0` until verified and reconciled under G4.
**Authority:** This roadmap proposes experiments; it does not authorize spending, ads, a release, store changes, or data processing.

## 1. Monetization thesis

Keep an honest, useful baseline available without requiring payment; test a subscription only for demonstrable recurring value. Advertising is a secondary candidate, limited to eligible non-driving contexts and subject to consent, store rules, privacy review and actual user-experience testing. Neither model is yet proven for Salim. Competitors' existence of free/ad-supported and premium plans is evidence of category patterns, not evidence of Salim demand or profitability.

**Non-negotiable:** No ad on an active-drive screen or during a driving session; no ad delays, obscures, or suppresses an alert; demo remains ad-free; user/location/report data is not a monetization asset; no police/patrol/covert/radar-emission detection. The Founder’s signed-off product rules and current Operating Rules remain controlling.

## 2. Candidate revenue streams

| Stream | Candidate value exchange | Readiness / missing evidence | Actual revenue rule | Decision |
|---|---|---|---|---|
| Monthly subscription | Recurring access to a specific, defined premium feature bundle | Feature boundary, Bahrain price, willingness to pay, console product, renewal/refund flow and local fee/tax handling all NOT IN DATA | `$0 actual` until a real purchase/settlement qualifies and reconciles under G4 | Test only after useful baseline, G2/G3 as applicable, legal/store readiness and written Founder approval |
| Annual subscription | Lower-friction annual option only if users perceive durable value and renewal terms are transparent | Same gaps as monthly; annual discount economics and churn are NOT IN DATA | `$0 actual` until verified settlement | Do not set annual price/discount before measured price research and cost model |
| Contextual/non-personalized or consented advertising | Network/advertiser pays for permitted, non-driving inventory | Ad eligibility, consent/CMP, eCPM, fill, impressions, geography mix, privacy disclosures and retention impact NOT IN DATA | `$0 actual` until ad settlement is received and reconciled | Optional later experiment; no ad load on drive or demo screens; no assumed yield |
| Fleet/B2B subscription, sponsorship, referral | No approved product, buyer or contract offer | Customer interviews, legal/accounting, service capability and pricing NOT IN DATA | `$0 actual`; no forecast | Deferred; separate Founder approval and diligence required |
| Sale/licensing of personal location, trip, account, community reports | Not an acceptable current model | Not approved; privacy/security risk | Prohibited | Do not pursue. Aggregate analytics are not automatically anonymous; counsel review would be required for any changed proposal |

## 3. Pricing research plan (no public price set)

1. Establish a meaningful baseline and verify availability/quality for Bahrain; no willingness-to-pay test on a placeholder feature.
2. Interview drivers about their current alternatives and what recurring value they would need. Avoid leading questions and do not treat stated willingness as a purchase.
3. Present a small, Founder-approved concept/price range in BHD; comparison structure, range and sample design are **NOT IN DATA** until user/customer access and budget are approved.
4. When product/store/legal conditions permit, run a controlled, disclosed test with real store price display and purchase/refund support. No dark patterns, fake scarcity, surprise trial, or ambiguous auto-renewal.
5. Report exposed sample, geography, platform, time window, displayed price, conversion denominator, paid starts, cancellations, refunds and confidence/limitations. Separate intent survey from real payments.
6. Set price only after contribution model includes localized display/settlement, fees, applicable tax, refunds, support, hosting and licensed data costs.

No final price, free-trial duration, introductory offer or renewal cadence is approved by this document. Store product IDs exist in source, but their configuration, status and territory pricing are **NOT IN DATA**.

## 4. Ads and consent controls

- Ads remain excluded from the demo and active-drive experience; implementation must match the Founder’s instruction “Ads out of demo but in the play build and ios build,” while respecting the stricter rule that no ad is displayed during a drive/session. The exact safe non-driving placements and production ad behavior require a product/technical review.
- Do not place ads in alert cards, camera details, a moving map, active route, or any screen that could distract during a trip. Do not gate an alert behind an ad.
- Do not personalize ads from precise location, trip route or report content without explicit legal/privacy approval and appropriate consent. The ad data path, SDK behavior, retention and subprocessors must be reviewed.
- Verify regional consent requirements and current platform/network rules before serving. Google's AdMob guidance requires certified CMP/TCF compliance for personalized ads in EEA/UK/Switzerland; if Salim ever serves users there, confirm current requirements. This does not substitute for Bahrain/GCC privacy review. [AdMob CMP guidance](https://support.google.com/admob/answer/13554116?hl=en).
- Store test ad-unit IDs and production IDs separately; never expose credentials or secrets in docs. Verify test-device/test-ad behavior and prevent accidental live traffic during QA.
- Measure ad impressions, eligible sessions, request/fill, realized eCPM, consent state, country, placement, latency, crashes, support complaints and retained use. A network dashboard estimate is not cash revenue.

## 5. Binary operating gates and allowed progression

Use the five existing Operating Rules gates, not calendar dates:

| Gate | Binary pass condition (documentary) | Commercial consequence |
|---|---|---|
| G1 — Entity authority | Exact entity, active registration, permitted activities, signatory authority and payment recipient verified | Needed before commercial contracts, tax/payment setup and public entity claims |
| G2 — Beta distribution | Signed build accepted on intended test track; app ID and privacy/data-safety/location/ads declarations match build | Enables a controlled test only; no public monetization claim |
| G3 — Production eligibility | Store production eligibility/review granted plus separate Founder release authorization | Only then may any production monetization experiment be considered |
| G4 — First verified receipt | Real customer/store settlement reaches designated business account and reconciles after fees/refunds | Actual revenue may then be recorded; still no scale until unit economics are measured |
| G5 — Camera-data rights | Written permission/provenance and documented quality/update process for named country | Only country-specific data included in authorized product/claims; no country-wide completeness inference |

**State on 2026-10-28:** G1 NOT VERIFIED; G2 NOT OPEN; G3 NOT OPEN; G4 NOT OPEN (`$0` actual revenue); G5 NOT OPEN. The source-only report service is not a live community monetization or verification capability.

## 6. Unit-economics model

Use actual observed values only. Forecasts must be labeled `[EST]`, show method and sensitivity, and present conservative and realistic bands only. No optimistic scenario is permitted.

### Subscription

`Net subscription proceeds = gross paid renewals − refunds/chargebacks − platform service fees − applicable taxes/withholding.`

`Contribution per paid subscriber = net proceeds − variable hosting/data/support/moderation cost attributable to that subscriber.`

### Ads

`Net ad proceeds = eligible measured impressions ÷ 1,000 × actual country/placement eCPM − ad serving/consent/measurement costs − applicable taxes.`

Use the settled value, not a forecast or ad-network dashboard estimate. Exclude sessions or impressions where consent, placement safety, store policy, or measurement is uncertain.

### Combined break-even

`Break-even monthly paid users = (verified fixed monthly cost − verified net ad contribution) ÷ verified net contribution per paid user.`

If any input is missing, denominator is non-positive, or costs cannot be attributed, numeric break-even is **NOT IN DATA**. User acquisition cost and lifetime value remain **NOT IN DATA** until properly attributed, retained cohorts mature, and refunds/support costs are included.

## 7. Platform, tax and currency checks

- Store fee rates depend on current program, product, territory, user/transaction terms and rollout. Apple Small Business Program eligibility is not established for Salim; check current enrollment and App Store Connect terms. [Apple program](https://developer.apple.com/app-store/small-business-program/).
- Google Play documents varying service-fee structures and an evolving rollout; use the current terms applying to the Salim account, product and user's territory at the time of sale. Do not hard-code a single rate into external projections. [Google Play service fees](https://support.google.com/googleplay/android-developer/answer/112622?hl=en).
- Bahrain's official standard VAT rate is 10%; applicability/registration/collection treatment for this product and cross-border digital services needs qualified advice. [Official VAT portal](https://www.bahrain.bh/wps/portal/en/BNP/HomeNationalPortal/ContentDetailsPage/!ut/p/z1/jZHBTsJAEIZfZTn0aHYWSinHCinW2KjFat0L2dKlDNLd0l1QfHpr4gWjhbnN5Psmk38opxnlShywFBa1Etu2f-XegkVDuPEnAA9Ttw-Pz-PEu44ZxLMBfTkF2FMKLRAFyX04ZeAyyi_x4Z8K4DK_A-Dd6-dS0dtzUJtCv4kncUl5Lez6CtVK06zUKJofueOAVsbNbscDypdaWflhaZareiEaB0Su95bYtSRvqMpCVw7ke4NKGkOEKgiqgzS2kso60MitsLIgVte4NA4Y3GA7Id8Z8NMjxmkagufPQtf1_GQ0HP0G_njTuQzqKk2z9-Pg8241j8pe7wvexALg/?1dmy=&current=true&urile=wcm%3Apath%3A%2Fbnp_en%2Fabout+the+kingdom%2Fbusiness+and+investment%2Frelated+topics%2Fvalue+added+tax+%28vat%29+in+the+kingdom+of+bahrain).
- Base currency for Bahrain operations: BHD where evidence supports it. Preserve original settlement currency, conversion source/date and FX fees; finance FX policy remains NOT IN DATA.

## 8. Revenue recognition and reporting

Before G4, show revenue actuals as `$0` with the note “no verified receipts”; do not present a pipeline, forecast or store-console estimate as revenue. After G4, reconcile each period to source statements and business bank records; separate gross billed, taxes collected, fees, refunds, chargebacks, net cash received, deferred/renewal liabilities if applicable, and outstanding settlement. Keep non-public bank/private customer details out of Git; store safe evidence references and redacted reconciliation only.

Monthly monetization dashboard:

| Metric | Required breakdown | Current state |
|---|---|---|
| Paying users and renewals | Platform, country, product, cohort, period | NOT IN DATA |
| Realized price and gross billings | Local currency, storefront display, discounts | NOT IN DATA |
| Refunds/chargebacks | Reason, country, product, cohort | NOT IN DATA |
| Platform fees/tax | Actual statement and applicable rule | NOT IN DATA |
| Net proceeds / receipt date | Store statement reconciled to bank | `$0` actual / no evidence supplied |
| Ad inventory and proceeds | Placement, country, consent, request/fill, realized eCPM, payout | NOT IN DATA; `$0` actual |
| Retention / contribution | Cohort, support, infrastructure and data costs | NOT IN DATA |
| Complaints and experience harm | Ads, accidental driving display, alert delay, cancellation/refund | NOT IN DATA |

## 9. Stop, pause and rollback rules

Immediately pause the affected placement or offer if it interferes with alerts/driving, consent is misconfigured, an SDK transmits unapproved sensitive data, store rules are breached, refunds/support exceed the reviewed capacity, or a privacy/security incident is suspected. Preserve logs safely, follow incident response, notify the Founder and counsel as applicable, and do not resume until evidence and approval are documented. Do not continue an unprofitable or unmeasurable paid campaign because of sunk cost.

## 10. Founder inputs required

- Preferred model to test first: subscription, non-driving advertising, both sequentially, or neither — **NOT IN DATA**.
- Founder-approved premium feature boundary and price-test range — **NOT IN DATA**.
- Monthly and one-off test caps / available funds — **NOT IN DATA**.
- Legal entity, bank/payment recipient and tax adviser — **NOT VERIFIED**.
- Consent/CMP and regional rollout decision — **NOT IN DATA**.
- Permission to recruit drivers and run a real purchase test once gates permit — **NOT IN DATA**.

Until answered and gates are passed, no monetization experiment is authorized by this document.
