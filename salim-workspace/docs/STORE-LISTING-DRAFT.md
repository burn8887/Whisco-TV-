# Demonstration store metadata — Founder review required

Brand system: [BRAND-IDENTITY.md](BRAND-IDENTITY.md). Name risks: [NAME-CLEARANCE.md](NAME-CLEARANCE.md).
Nothing here is published or reserved.

## Proposed store title

- Google Play: **Salim — Road Awareness**
- App Store: **Salim: Road Awareness**, subtitle **Know what's ahead.**

A bare “Salim” title is unlikely to be available or discoverable; same-name apps already exist on
both stores. Confirm the exact title in each console before designing screenshots.

## Short description (Play, 80 characters)

Calm, direction-aware alerts for the road ahead. Bahrain-first, offline-ready.

## Description / TestFlight beta description

Salim is a calm co-pilot for the road ahead. It tells you what is coming — cameras, hazards, speed
bumps and average-speed sections — for the direction you are actually travelling, without taking
over the drive.

This build is a demonstration. Run a simulated drive without granting location access, explore
heading-aware fictional alerts, see section-average calculations and keep local trip summaries.
Only Bahrain has a bundled pack, and every camera, hazard and section in it is fictional.

Optional device GPS testing requires precise location and is started explicitly while safely
parked. It may continue in the background until you end the test, subject to OS restrictions. Voice
prompts temporarily reduce other audio where supported. Report drafts stay on your device and are
not published.

Salim is not a radar detector, a navigation replacement, an emergency service or a guarantee of any
outcome. Always follow posted signs and road rules. Car-display/watch integrations, vehicle
automation, subscriptions and internal navigation are not enabled in this build.

## What to Test

1. Run the 75-second simulation without granting location access.
2. Observe sample speed, section average and demo alert; end the session and find its summary in My trips.
3. Save/delete a community draft while no session is active.
4. Review Settings → Privacy notice; change voice preference and country while idle.
5. Only when safely parked, start/stop a device GPS test; verify permission denial, background indicator and stopping behavior. Do not rely on fictional alerts on the road.

## Arabic listing draft — needs native review before use

- العنوان المقترح: **سليم — وعي بالطريق**
- وصف قصير: تنبيهات هادئة وموجّهة حسب اتجاه سيرك على الطريق. البداية من البحرين، وتعمل دون اتصال.
- الوصف: سليم رفيق هادئ على الطريق. يخبرك بما هو قادم — كاميرات، مخاطر، مطبات، ومقاطع متوسط
  السرعة — حسب اتجاه سيرك فقط، دون أن يستحوذ على القيادة. هذه النسخة تجريبية، وكل بياناتها
  افتراضية. لا تعتمد عليها في قرارات السلامة على الطريق، واتبع اللوحات المرورية دائمًا.

**Do not publish this Arabic copy until a native Bahraini/Gulf speaker has reviewed it aloud.**

## Keyword candidates (unverified; check against real store behaviour)

`road awareness`, `speed camera alert`, `Bahrain driving`, `Gulf roads`, `average speed`,
`road hazards`, `speed bumps`, `offline alerts`
Arabic: `تنبيهات الطريق`, `كاميرات السرعة`, `البحرين`, `الخليج`, `مطبات`

Avoid keywords that imply radar detection, evasion or guaranteed outcomes; they invite rejection
and misrepresent the product.

## Review notes

No login, subscription or purchase is required. Simulation is foreground-only and ends when the
app is backgrounded. Device GPS testing is separate and explicit. Location and audio background
modes support an active GPS test and short spoken alerts, not hidden tracking. Android uses an
ongoing location foreground-service notification. If location is denied, simulation remains
available. SQLite alert data is bundled; no live feed or user-report submission endpoint is
connected.

## Required before submission

Founder-confirmed permanent app identity, operating entity, published privacy/support URLs, review
contact, real screenshots from signed builds, platform declarations, tester group and approval to
upload. Do not fabricate contact details, coverage claims, testimonials or screenshots.
