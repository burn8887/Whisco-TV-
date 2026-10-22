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
