# First device feedback — 22 October 2026

The Founder installed `0.2.0-demo` on a physical Android device. This is the first time
Salim ran on real hardware. Five findings, what each turned out to be, and what is done.

## 1. "The app seems too empty, lacks branding. The header is 'salim.' — no graphics, no design, theme is weak."

Confirmed. The home header was a single `Text("salim.")` at 29sp, and the only theme was
`lightColorScheme(primary=Forest)`. There was no mark, no wordmark, no Arabic lockup in
the chrome, and no dark scheme at all.

Done in `0.3.0-demo`:

- A brand mark — the Arabic initial **س** in a rounded gradient tile — and a lockup of
  **Salim** over **سالم**. Drawn in Compose, so it is sharp at every density and needs no
  bitmap asset.
- A gradient hero carrying the positioning line and the Arabic strapline, replacing four
  loose text elements.
- A full dark scheme, verified against the same contrast floor: `#E4EDE6` ink, `#A8BBAE`
  muted (7.6:1), `#7FC3A3` mint (8.9:1), `#E8C07A` amber (11.4:1) on `#0F1512`.
- All surfaces now come from `MaterialTheme.colorScheme` instead of hard-coded `Color.White`,
  so a card cannot stay white in dark mode.

## 2. "Settings only have 2 controls — no alert tone, no alert voice, no light/dark."

Fair. Settings offered a voice toggle and a country picker. Now:

| Control | Options |
| --- | --- |
| Appearance | System / Light / Dark |
| Voice alerts | on / off |
| Alert tone | on / off (short chime before the voice) |
| Country | BH, SA, AE, QA, KW, OM |
| System permissions, privacy notice | buttons |

A line of explanatory text under the alert switches states plainly what the current
combination does, including "Both are off, so alerts arrive as a notification only."

## 3–4. "Could not get a GPS fix. Could not try a real drive."

**This was a bug, and a bad one.** The service forwarded Android's "not reported" value
straight through:

```kotlin
if(location.hasSpeed()) location.speed.toDouble() else -1.0
if(location.hasAccuracy()) location.accuracy.toDouble() else -1.0
```

and `Geo.usable()` rejects any negative value:

```kotlin
fix.accuracy in 0.0..accuracy && fix.speed in 0.0..70.0
```

Android omits speed on many fixes, and omits it on almost all early fixes. So every real
fix was discarded, `receive()` cleared the position, and the UI said "Weak or stale GPS"
while the phone had a perfectly good fix. Three separate defects compounded it:

1. **`-1.0` for "unknown"** made valid fixes invalid. Fixed by deriving speed from
   consecutive positions (`distance / elapsed`) and bearing from the compass course
   between them, which is what navigation apps do when the chip does not report either.
2. **A 15-second stale timer ran from the moment the test started**, so a cold start —
   which legitimately needs 30–60 seconds outdoors — was declared dead after 15. Now the
   timer only applies *after* a first fix, and the UI reports "Acquiring GPS satellites…
   Ns", then after 25 seconds "No fix yet · move near a window or outdoors".
3. **GPS provider only.** Indoors or in a car park that never fixes. A network provider is
   now requested alongside it: coarse, but it proves the pipeline works while satellites
   lock.

The new `acquired` flag drives a visible acquisition card with elapsed seconds and progress
toward the minute a cold fix can take. Previously there was no way to tell "working on it"
from "broken".

## 5. "Could not preview a map."

Correct, and nothing was deceptively labelled: the card always said "Illustrative map · No
live navigation". The `Illustration()` composable is a `Canvas` sketch of roads — there is
no map engine in the Android app at all. iOS already uses MapKit; Android has nothing.

**Not done. This is the next substantial piece of work.** A real map needs a map SDK and
tiles, which is a dependency change and deserves its own verified build rather than being
bundled into a UI pass. The recommendation stands from `PRODUCT-DECISIONS.md`: MapLibre GL
with a keyless vector style, falling back to the illustration if tiles fail. Android only —
iOS already has MapKit.

## Still unverified

The Kotlin in `0.3.0-demo` was written without a compiler. No JDK, Android SDK or Xcode
exists in the environment that produced it. The Founder's Chromebook now builds locally,
so `bash tools/setup-android-linux*` is the check, and CI builds on push.

---

# Second review — 22 October 2026

> "Pathetic. The app is really lacking. It looks like a startup dentist clinic next to a
> giant competitor like Radarbot."

The design language survives that comparison; the *emptiness* does not. Dark scheme,
contrast and type are holding up in the screenshots. What is missing is a product: four
static fictional alerts and a hand-drawn road grid, with no map and nothing live.

## A rule was being broken in the shipped build

The Founder said **"Drop police detection for now."** The `0.2.0-demo` and `0.3.0-demo`
builds still shipped two speed cameras (`static:demo-camera-1`, `-2`), and the Community
tab still offered "Speed camera" as a report type. The website guard rejected radar
language while the app quietly did the thing the guard exists to prevent.

Fixed: the demo pack is now roadwork, hazard, traffic and road bump; the report options are
road hazard, roadworks, traffic congestion and road bump. `Kind.CAMERA` and
`Kind.MOBILE_CAMERA` remain in the core enum because removing them touches the engine and
its tests, but nothing in the app can produce or display one.

## The structural gap

The web demo has had a full-screen drive view since `46f06ae`. The Android app never did:
a running drive stayed inside the scrolling card dashboard, which reads as a settings form.
A navigation product is map-first, and ours was list-first.

`DriveScreen` now takes the whole screen while a session runs: full-bleed road view, speed
at 78sp, elapsed time, alert banner, end and minimise. Minimising keeps the session running
and returns to the dashboard. The map is still an illustration, and the drive screen says
so in the corner rather than implying otherwise.

## What is honestly missing

**A real map.** Everything else is cosmetic next to this. The "Your surroundings" card is a
`Canvas` grid; Radarbot is a live vector map with a speed overlay. No amount of colour,
type or spacing closes that gap.

Deferred three times now, for a legitimate reason and an illegitimate one. The legitimate
reason: a tile source is a network dependency, and the demo has no map engine at all. The
illegitimate one: it kept being easier to polish something else.

The blocker is narrow and worth stating plainly. MapLibre GL needs a style URL. This
environment reaches GitHub, npm and PyPI only, so no tile endpoint can be verified from
here — and shipping an unverified URL is how a build works in testing and fails in a car.

---

# Third pass — 0.4.0-demo, 22 October 2026

> "Style itself being too soft and generic... I want to see a working app with full view map,
> real location and real radar warnings."

## Style: from wellness app to instrument panel

The criticism was specific and correct. The old system was soft by construction: 13–22dp
corner radii, a gradient hero, pastel greens, no lines anywhere, and generous empty space.
That vocabulary belongs to a health app.

The new system is the opposite in every dimension that matters:

| | 0.3.0 | 0.4.0 |
| --- | --- | --- |
| Corner radius | 13–22dp | 4–8dp |
| Separation | white space | 1dp hairline rules |
| Ground | `#F5F7F0` | `#0A0D0B` (dark) |
| Accent | muted forest | `#4ADE9B` signal green |
| Numerals | default proportional | monospace, tabular |
| Headings | gradient card | type on ground, no container |

Measurements moved into a bordered metric strip rather than three floating cards. Alerts
became dense rows with a 3dp colour bar. Section labels are monospace uppercase with 2sp
tracking. The brand mark is a square tile, not a rounded one.

## Map: real, and no new dependency

The blocker was stated as: a map engine is a dependency whose exact coordinates could not
be verified from the environment that writes this code. Every unverified dependency so far
cost a failed build.

Rather than accept a fourth failure, the map is built on raster tiles — 256px PNGs in the
standard z/x/y scheme — drawn straight into a Compose canvas. No SDK, no version to
resolve, no native library. Web Mercator projection, tile cache bounded at 24 MB, four
parallel fetches, a descriptive User-Agent and OSM attribution, all of which the OSM tile
policy requires.

What is given up: vector crispness when zooming and offline caching. What is gained: a real
map of real streets, panning and pinching, with the illustration grid showing through if
tiles cannot be fetched, so an offline phone degrades instead of going blank.

## Location

The idle map centres on the device's last known position from GPS, network or passive
providers rather than a hard-coded Manama point, and says "MANAMA · NO FIX" when it has
nothing, so the state is never guessed.

## "Real radar warnings"

Recorded here rather than acted on, because it reverses a written instruction.

On 21 October the instruction was **"Drop police detection for now."** Speed cameras were
removed from the app in `fde77d2` for exactly that reason, and `check_site.py` fails the
build on radar-detector language.

"Real radar warnings" can mean two different things:

1. **Warnings that fire from real position rather than a script.** This is what the engine
   now does — real GPS, real coordinates, the alert threshold crossed by actual movement.
   Delivered.
2. **Police and speed-camera detection, as Radarbot sells it.** Not delivered, because it
   contradicts the instruction above, and because it carries store-review and legal risk in
   several Gulf markets.

Point 1 is implemented. Point 2 needs the Founder to reverse the 21 October instruction in
writing; until then building it would be re-introducing something explicitly removed one
day earlier.

There is also a factual constraint worth stating plainly: **there is no reliable public
dataset of Bahrain speed-camera locations.** Radarbot's coverage there is community-supplied
and unverified. Even with the instruction reversed, the honest version is crowd-sourced
reporting with confidence decay, not a definitive camera map — and presenting unverified
camera positions to a driver is a safety claim, not a feature.

---

# Cameras — 0.5.0-demo, 22 October 2026

The Founder reinstated camera warnings with a source:
`reddit.com/r/Bahrain/comments/1wcxzdr/all_speed_cameras_mapped`.

## What I could and could not read

Reddit returns **403 to every route available here** — `www`, `old`, and the `.json` API.
The thread itself is therefore not in this build. Search surfaced the surrounding facts:
GDT's official eTraffic locator, the 258-camera smart rollout, the four King Fahd Causeway
cameras announced in 2019, and the districts named in official reporting.

## What is implemented

- `Kind.SEATBELT` and `Kind.RED_LIGHT` in the core enum, with every `when` branch covered —
  an added enum constant is a compile error in an exhaustive `when`, so this was the first
  thing checked.
- `assets/cameras.csv` — the entire camera dataset as a file, not code. Nine columns,
  validated on load. A malformed row costs one camera, not the drive.
- `CameraPack` parses it, seeds the existing hazard table at revision 2 so alerts flow
  through the engine unchanged, and keeps per-site metadata for display.
- `tools/import-cameras.py` converts any pasted table (CSV or TSV, any column order) into
  the pack, rejecting coordinates outside Bahrain, impossible speed limits, unknown kinds
  and duplicates. 15 tests, run as part of the suite.
- Map pins, hollow for approximate sites. A camera list separated from road conditions.

## The eight shipped rows are all approximate

Four on the King Fahd Causeway from the 2019 MOI announcement; one each for the Diplomatic
Area, Seef, Riffa and Muharraq from the 2026 smart-camera rollout. Those sources name roads
and districts, not surveyed coordinates, so the rows say `approximate` and the app shows a
`≈` and a hollow ring. Claiming metre accuracy from a press release would be a lie a driver
could act on.

## Loading the real list

```sh
python3 tools/import-cameras.py --input pasted.csv --output apps/salim-android/app/src/main/assets/cameras.csv
python3 tools/import-cameras.py --check
```

Columns are matched by name, so a copy-paste from a table works. Rows marked `exact` draw as
filled pins.
