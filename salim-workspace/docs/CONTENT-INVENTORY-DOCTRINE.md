# Salim Content & Camera-Data Inventory Doctrine

**Version:** 1.0
**Date:** 2026-10-28
**Scope:** Static camera packs, live OSM results, future community reports, maps and other road-alert records

## 1. Governing principle

A road-alert record can change a driver's behavior. It is therefore safety-relevant inventory, not casual user-generated content. A record may enter the production alert catalog only when its identity, source, territory, coordinate meaning, date, rights, review status, and correction path are known. Missing evidence means **hold**, not guess.

## 2. Allowed source classes

| Class | May display? | Conditions |
|---|---|---|
| Official government / road authority | Potentially | Source is public and current; reuse/redistribution terms are documented; point meaning and precision verified; no implication of endorsement without permission |
| Licensed data provider | Potentially | Written commercial, territory, update, attribution, derived-data, caching and termination rights; source quality and update process audited; G5 open |
| OpenStreetMap | Yes, with limits | OSM contributor data is approximate/incomplete and not an official register; retain required attribution and comply with ODbL and any derivative database obligations after legal review; do not represent as complete |
| Community proposal | No, pending | Private submission held for moderation; no user-submitted record reaches public map/alerts automatically |
| Human-reviewed community addition/correction | Potentially | Moderator documents evidence, decision, scope, timestamp, reviewer and change history; only reviewed/approved records publish; easy correction/removal path exists |
| Demo/synthetic record | Demo only | Clearly marked TEST/SIMULATED; never appears as real camera data in a store build or screenshot |

No verified, redistribution-cleared static GCC camera dataset is currently approved. Android and iOS static packs are deliberately empty as of 2026-10-28.

## 3. Required record metadata

For each internal source record, retain at minimum:

- Stable source ID and Salim record ID; country/territory; record kind (fixed speed, red-light, seatbelt/phone, etc.); coordinates and coordinate reference system.
- Source URL/reference and source organization/contributor; source licence/terms and evidence that the intended processing and distribution are allowed.
- Source observation/update timestamp; Salim ingestion timestamp; reviewer and review decision; version/revision history; status (pending/active/disputed/removed).
- Precision semantics: exact only when the source states or method supports a surveyed point; otherwise approximate. Record what the coordinate means (camera pole, enforcement zone, road segment or approximate site).
- For user submissions: declared GPS accuracy must be within the app/backend's accepted 1–50 m submission range, but this is a self-reported measurement, not verified identity or proof the submitter was physically present. Do not collect unnecessary name, phone, plate, image, or route history.

If a required field cannot be safely recorded, do not publish the item.

## 4. Verification and publication flow

1. **Ingest privately.** Validate country bounds, point range, supported kind, ID, metadata and licence. Reject unsupported mobile/patrol/covert records.
2. **Deduplicate.** Compare stable IDs and close spatial duplicates; keep the source and record of any merge. Do not merge two sites solely because coordinates are close.
3. **Assess source quality.** Check official/provider documentation, OSM tags/history where relevant, timestamp, road correspondence and coordinate precision. OSM metadata describes edits, not ground truth.
4. **Human decision.** A trained moderator accepts, requests more evidence, disputes, corrects or rejects the record. Community confirmations/disputes inform but never replace the human decision.
5. **Publish only reviewed status.** Store decision, evidence reference, reviewer, time, version and expiry/recheck rule. Additions/overrides are visible in clients only after the service is live and integrated.
6. **Monitor and correct.** Provide an accessible report/correction route, rate limits, abuse controls, audit history, takedown path and a recheck schedule appropriate to the source.
7. **Remove safely.** A credible dispute, broken rights, stale source, wrong coordinate or unsafe interpretation triggers immediate hold/removal pending review; do not wait for a product release if the public feed can be corrected.

This repository's source-only API includes human moderation and audit concepts, but the service is not deployed and no live moderation operation exists. Do not claim the flow is operational.

## 5. Exclusion list

- Police cars, patrol locations, tripods, mobile enforcement units, covert cameras, radar/LIDAR/RF detection, enforcement avoidance, or inferred patrol behavior.
- Guessed, geocoded-from-road-name, interpolated, or copied coordinates without record-level support.
- Records whose licence prohibits display, commercial use, redistribution, caching, derived database, or public disclosure as applicable.
- Unreviewed community additions, vote-only approvals, spam, personal data, licence plates, faces, accusations, dangerous/illegal user notes, or reports intended to identify a person.
- Records presented as exact when the source is an area/road/zone; alerts that imply legal speed limit if none was sourced.
- Static or screenshot datasets whose provenance, date, and rights are unknown.

## 6. OSM and map obligations

- Attribute OpenStreetMap and its contributors in every user-facing context required by OSM terms; link the applicable attribution/licence notice.
- Keep OSM data clearly distinguished from official, licensed or moderator-reviewed data.
- ODbL is not a blanket permission to ignore attribution or share-alike obligations. Before distributing a compiled regional database or derivative work, obtain qualified legal review of the exact database, transformations, distribution model and current OSM terms.
- Respect Overpass service limits and appropriate User-Agent/query behavior; cache results; avoid sending a precise route or repeated high-resolution location trail.
- If tiles fail, retain an honest non-map fallback; map availability is not an alert guarantee.

## 7. Report/user verification language

The current implementation generates a pseudonymous installation ID for rate-limiting and vote de-duplication. It does **not** verify a legal identity, unique human, device integrity, physical presence, or independence of reporters. Accuracy fields may be self-reported. Do not describe votes as “verified users.”

If higher assurance is ever needed, define the threat model, privacy impact and lawful basis first; prefer independent evidence/source corroboration over collection of identity documents or continuous location. Any change requires Founder and privacy/legal approval.

## 8. Audit and quality metrics

Track only measured, dated values: pending queue count, review age, approval/rejection/correction counts, overturned decisions, duplicate rate, source/licence coverage by country, stale-data corrections, user reports resolved, and incidents. Until the service is live, those operational measurements are **NOT IN DATA**. Do not publish a “camera accuracy” score until the sampling method, denominator, geography and confidence interval are defensible.

## 9. Entry checklist

- [ ] Source, timestamp, country and legal reuse basis recorded.
- [ ] Coordinate semantics and precision known; no fabricated exact point.
- [ ] Type is allowed and record is not mobile/police/covert detection.
- [ ] Duplicate and nearby-road checks completed.
- [ ] Human decision and evidence reference logged.
- [ ] Expiry/recheck and correction route set.
- [ ] OSM attribution/licence obligations satisfied if applicable.
- [ ] User-facing language does not imply completeness, official approval, or identity verification.
