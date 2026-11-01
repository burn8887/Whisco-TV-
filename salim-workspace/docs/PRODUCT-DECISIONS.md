# Product decisions

A short record of choices that shape the app, with the reasoning, so a later session does
not have to re-litigate them or guess why something is missing.

_Last updated 21 October 2026._

## Legibility remediation — 21 Oct 2026

**Problem.** The Founder reviewed the browser demonstrator and reported that thin text on a
white background was hard to read. Measured, the complaint was exact: the design used 95
distinct text colours, and 84 of them failed the WCAG AA contrast floor of 4.5:1 on the
lightest surfaces (some as low as 1.36:1). Body text was 13px, and 61 of the ~140 size
declarations were below 10px, down to 5px.

**What changed.**

| Area | Before | After |
| --- | --- | --- |
| Text colours | 95, mostly pale greens | 18, all ≥ 4.7:1 on the worst surface |
| Smallest type | 5px | 7px (map attribution only) |
| Label scale | 8–10px | 10–11px |
| Body / base | 13px | 14px |
| Android ink | `Color.Gray` (3.54:1) ×16 | `Muted #55655A` (6.2:1) |
| iOS secondary | `.secondary` (~3.5:1) ×14 | `Color.muted #55655A` (6.2:1) |

Colours were mapped into five deliberate inks rather than darkened one by one, so the
palette stops drifting: `#2f5d45`, `#456a53`, `#55655a`, `#6b5320`, `#7c4835`. The three
colours on the dark toast were protected and left alone; they already measured 5.6–9.7:1
against it and would have become invisible if "fixed".

The `DESIGN.md` aesthetic is unchanged: same greens, same airy layout, same hierarchy —
only the ink got dark enough to read.

## Full-screen drive view — 21 Oct 2026

**Problem.** Starting a drive left the user on the dashboard with a map in a card; the
Founder expected the road to fill the screen, the way a navigation app behaves.

**Cause.** `drive()` ended with `navigate("Overview")`. Nothing was wired to open a drive
view, so the behaviour was intentional but wrong.

**What changed (web).** Starting a drive now opens a full-viewport view: the road edge to
edge, a next-alert banner, a large speed readout with the limit, elapsed time, mute, and
End drive. `Escape` leaves the view without ending the session; End drive closes it and
banks the trip. The dashboard stays live underneath.

**Not yet done (native).** Android and iOS still show the map inside their scroll views.
Both need the equivalent, and neither can be compiled in this environment — no Android SDK
and no Xcode — so it has to land as a change the CI proves, not a change that looks right.

## Basemap — deferred, conditionally approved

The Founder's condition: **only if it will be professional and the user experience is not
affected.** On that test, a real basemap is not ready to ship yet:

- The browser demonstrator is a **single self-contained HTML file** whose contract, enforced
  by `tools/build_deploy.py`, is *no external asset requests*. Tiles are external requests.
  A real basemap breaks that property outright.
- Tiles mean a runtime third-party dependency. No tile host could be reached from the build
  environment to verify delivery, so shipping one would be shipping something unverified.
- The demo would grow from ~709 KiB to well over 1.5 MiB for a page that currently opens
  instantly and works offline.

**Recommendation when it is done:**

| Option | Verdict |
| --- | --- |
| **MapLibre GL + self-hosted PMTiles** | Preferred. Same vector rendering and 3D pitch as Mapbox, no licence fee, no key in the repo, tile hosting under our control. |
| Mapbox | Best tooling, but a metered bill and a token that must never be committed. Their Navigation SDK is priced per trip, which is hostile to a free tier. |
| Google Maps SDK | Only for Google POI data. No meaningful custom styling, no offline packs. |

**Rule if it lands:** the basemap must degrade to the existing illustration when tiles are
slow, blocked or offline. A blank grey canvas is worse than the current drawing.

Note the platform asymmetry: iOS already has a **real** `MapKit` map — Apple's own, no key,
no cost. Android has a Compose `Canvas` illustration. That is the honest reason the two
platforms look different in this area.

## Ads — out of the demo, in the release builds

Approved 21 Oct 2026: **no advertising in the browser demonstrator; advertising permitted in
the Play and App Store builds.**

Consequences that must be handled in the same change as the ad SDK, not afterwards:

- The privacy policy and support pages currently promise minimal collection. AdMob collects
  advertising identifiers. Both pages need rewriting first.
- Google Play **Data Safety** and Apple's **App Privacy** labels must declare the ad SDK.
- iOS requires **App Tracking Transparency** for identifier-based tracking, and the prompt
  has to be justified in review.
- Ad SDKs want network access and initialisation; a driving app should initialise them late
  and never on the drive screen.
- Do not put ads on the full-screen drive view. Distraction is a safety issue and an
  obvious store-review risk.

## Cameras — dropped, then reinstated, and the line that stays

**21 Oct 2026:** "Drop police detection for now." Speed cameras were removed from the demo
pack in `fde77d2`.

**22 Oct 2026:** the Founder reinstated them: *"warnings for fixed speed and seatbelt
cameras should be in the app"*. That is the ruling in force. The 21 October instruction is
superseded for **fixed installations**, and only for those.

What is now built, and what still is not:

| | Status |
| --- | --- |
| Fixed speed cameras | In, from `assets/cameras.csv` |
| Seatbelt / phone multi-offence cameras | In, same pack |
| Red-light cameras | In, same pack |
| Reported mobile camera units | Supported by the data format, no live source |
| Detecting police cars, patrols or tripods | **Still out.** No covert detection, no radar-emission detection, no "police nearby" |
| Radar *detection* (hardware or RF) | **Still out.** We read a list; we do not sense anything |

The distinction that matters, and the reason `check_site.py` still fails the build on
"radar detector" and "jammer": **a camera map is information; a radar detector is
counter-surveillance.** The first tells a driver what is publicly known about the road.
The second defeats enforcement. Salim only ever does the first.

### A correction to what this file said before

It previously claimed there was no reliable public dataset of Bahrain camera locations.
That was wrong. The General Directorate of Traffic has published camera positions through
the **eTraffic** app since 2019, and GDT has announced a smart-camera rollout reaching 258
installations with more planned. There is an official locator; it is simply not machine
readable from this project.

That changes the conclusion, not the caution: the pack is now a data file that can be
corrected without a rebuild, and every row must carry a `source`.

### On precision

Each row is `exact` or `approximate`. Approximate sites draw as hollow rings on the map and
carry a `≈` in the list, because a filled dot reads to a driver as certainty, and a wrong
camera claim is worse than no camera claim. The shipped eight rows are all marked
approximate: they come from published announcements naming roads and districts, not from
surveyed coordinates.

## Cross-platform framework — rejected

A Flutter or React Native rewrite was proposed. Rejected: the Founder's requirement is two
fully native apps, and the native code currently passes 24 JUnit and 9 XCTest cases. If
shared logic is wanted later, the right move is a **Kotlin Multiplatform** core module, which
shares the engine while leaving both UIs native and keeps a JS bridge out of the location
path.

## Overlay and Live Activity — research, not a promise

- **iOS:** Apple does not allow drawing over other apps. A Picture-in-Picture hack to show a
  speedometer is a known rejection. The legitimate route is **Live Activities / Dynamic
  Island** via ActivityKit: speed and the next alert, visible while Maps or Waze is open.
- **Android:** `SYSTEM_ALERT_WINDOW` overlay is legitimate for a driving HUD, but it is a
  sensitive permission with a Play declaration requirement.

Neither exists yet. Do not describe either as a current feature.
