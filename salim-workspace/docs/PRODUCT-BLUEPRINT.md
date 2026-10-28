# Salim Product Requirements & App Blueprint

**Version:** 1.0
**Snapshot:** 2026-10-28
**Product:** Salim — Road Awareness (سالم)
**Status:** Source-based blueprint; test evidence and external services are called out explicitly

## 1. Product job

Give a driver a calm, direction-relevant heads-up about known mapped road hazards, starting with fixed cameras. Salim is an **awareness assistant**, not a navigation replacement, emergency service, official camera register, or guarantee that a camera will be detected.

### Primary user and situation

A driver in Bahrain (then other GCC markets) wants to know whether a mapped fixed speed, red-light, seatbelt/phone, or other supported camera is ahead on their direction of travel. The app must be set up while parked. During a session, the driver should not need to touch the screen to receive an alert.

## 2. Platforms and code organization

| Surface | Current implementation | Build evidence (2026-10-28) | Limitation |
|---|---|---|---|
| Android | Kotlin, Jetpack Compose, native location/service code; application ID `com.salimdrive.app` | CI compilation/lint/package/emulator passed on current code commit; 24 Android tests, 0 failures | Signed release still separate; physical device matrix required |
| iOS | Swift, SwiftUI, CoreLocation, MapKit; bundle ID `com.salimdrive.app` | Simulator build and XCTest passed (10 tests); unsigned device archive compiled | Not installable through TestFlight until signed and uploaded; physical device matrix required |
| Browser demonstrator | Static HTML/CSS/JavaScript under `site/` | Site checks pass | Not a native app or evidence of production coverage; audit current public copy before publishing |
| Shared report backend | Python HTTP service + moderator console in `report-service/` | 5 service tests pass | Source only; not deployed, moderator not connected, native client is not wired into active user flow |

The native apps remain separately implemented. Shared behavior must be tested on both; do not substitute a cross-platform framework without Founder approval.

## 3. Screen and flow map

| Screen / flow | Current behavior in source | Acceptance / status |
|---|---|---|
| **Dashboard / Overview** | Brand, readiness/data status, country context, map/nearby hazards, simulation and GPS-drive entry, possible map-opening action | Must disclose coverage and setup while parked; never make stale data look current |
| **Location permission / GPS start** | Explains precise/background location use, asks permission, begins a GPS session; state distinguishes waiting/acquiring from valid fix | Must remain useful when permission denied; never fabricate a location or silently restart a session |
| **Simulation** | Test-only simulated drive; foreground-only; leaves no claim that simulated alerts are live | Must be visibly marked simulated and excluded from paid/coverage claims |
| **Active Drive** | Full-screen instrument panel; speed, session time, next alert/distance, muted/voice/tone controls, end/minimize as implemented by platform | No ad, purchase prompt, report form, or required touch interaction while a session is running |
| **Trips / Session log** | Local summaries include time, duration, alert count and interrupted/demo state; user can delete local history | No precise route history is intended to be stored or uploaded; deletion must actually clear persisted records |
| **Community** | Local draft form for road conditions; draft label says local/unverified | Not a shared camera-report queue: camera reporting, votes, server-side moderation and verification are inactive pending integration, endpoint, and operations approval |
| **Settings** | Appearance, voice/tone, country, privacy notice, ad privacy choices where applicable, premium entry point, system permissions | Ads only in eligible idle screens in store builds; safety alerts remain free; purchase and consent claims require live store/device test |
| **Premium purchase** | Native billing/StoreKit source with monthly/yearly product IDs | Source presence is not console configuration; validate products, purchase, restore, expiry, refund and trial metadata before describing as available |
| **Map** | OSM-derived/MapKit or OSM tiles as implemented per platform; camera nodes shown with approximate/incomplete caveat | Tile/data availability, attribution, accessibility, cache and offline behavior require device testing; no complete-GCC implication |

## 4. MVP boundary

### MVP required for a credible closed test

- Launch, permission denial/recovery, simulation, explicit GPS start/stop, current location validity, stale/poor-fix handling, and truthful active-drive status.
- Direction-aware alerts from currently mapped camera/hazard data with clear source/uncertainty; no safety warning paywall.
- Voice/tone controls that do not permanently steal audio focus; visible/accessible controls and a no-touch driving flow.
- Local, bounded trip summaries, explicit delete behavior, and accurate privacy copy.
- Store billing/ad behavior, consent, permissions, Data Safety/App Privacy, and app identity match the exact build—or the relevant feature is visibly disabled.
- Fresh build passes CI; signed artifact checksum and package/bundle IDs verified; real-device smoke test completed before closed-track upload.

### Not MVP / explicit non-goals

- Comprehensive official GCC camera coverage; static camera packs are empty until rights and quality are proven.
- Police/patrol/covert/tripod or radar-emission detection; enforcement evasion; guarantee of avoiding a fine.
- Full turn-by-turn navigation, emergency dispatch, CarPlay/Android Auto, wearable haptics, automatic vehicle control, or an AI driving companion.
- Live community reporting, votes, moderator operation, identity verification, or user camera overlays until service deployment, UI integration, privacy/security review and staffed moderation are complete.
- Automatic subscription trial unless the store supplies the offer and the user is eligible.

## 5. Data model sketch

The current hazard record includes a stable ID, country code, kind, latitude/longitude, optional heading, road label, expiry, source/revision or precision metadata depending on platform. The app also maintains a location fix (coordinates, speed, course, accuracy, wall-clock and monotonic time), alert match (hazard/distance/elapsed time), section-control state where demo/test data allows it, local trip summary, user preferences, and local road-condition drafts.

### Data boundaries

- Precise device position is used for on-device proximity and may be sent only as a coarsened area to the OSM query. The service is volunteer-run; query availability and coverage are not guaranteed.
- No Salim account or route-upload backend is established in the current product record. Community report client code is present but reporting is disabled and not wired into the active flow.
- Store purchase processing belongs to Google Play / Apple StoreKit. Salim must not store card numbers.
- Future report submissions may contain camera coordinates, road/country and a pseudonymous installation ID. That ID is not verified identity or proof of physical presence; full privacy and retention design is a launch gate.

## 6. Subscription/ads constraints

Founder-approved intended products: `salim_premium_monthly`, `salim_premium_yearly`. Proposed premium benefits: ad removal, GCC pack if legally sourced, unlimited trips, and shorter alert lead time. Proposed free includes all safety alerts, Bahrain-first functionality, 20 trips and standard lead time; actual source/store parity must be verified before publication. No safety alert can be withheld for payment.

AdMob may appear only in store builds and eligible idle Overview/Settings screens. No ad in the browser demo, active drive, running session, alert banner or safety-critical flow. EEA/UK consent requirements apply where relevant; verify current consent SDK behavior against actual target countries. The four AdMob IDs are reported configured in repository variables, but this dossier does not claim live ad serving.

## 7. Release acceptance checklist

- [ ] Exact app ID, build/version code, signing certificate and artifact checksum match Salim.
- [ ] Android and iOS CI green on the same source commit; on-device test matrix completed.
- [ ] Permission, background location, audio interruptions, OS process death, privacy/deletion, large text and accessibility tested on real devices.
- [ ] Camera source, attribution, bounds, freshness and incompleteness disclosed; no unsupported pack/coverage claim.
- [ ] Ad consent, ad placement and purchase lifecycle tested in store-signed build; trial wording conditional on store offer.
- [ ] Privacy policy/support URLs live and match actual behavior; Data Safety/App Privacy declarations reviewed.
- [ ] Reporting remains off unless the separate service activation checklist is passed and moderators are staffed.
- [ ] Store listing/screenshots captured from the final signed app, not the web demo or simulated data.
- [ ] Closed testers can install/update, provide feedback, and remain opted in; account-specific Google Play testing obligations verified.

## 8. Known requirements gaps

Physical-device acceptance is incomplete; user-facing community report/vote UI is not connected; report API is not deployed; no verified static GCC dataset is available; current public site copy needs reconciliation with the empty static pack; subscription catalog and free-trial metadata require console verification; budget, registered entity and market sizing are NOT IN DATA.
