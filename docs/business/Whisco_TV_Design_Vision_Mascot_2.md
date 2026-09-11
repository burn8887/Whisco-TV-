# WHISCO TV — Design Vision + Mascot 2.0
**Creative direction pack · 11 September 2026 · staging only**  
whisco.tv · Bahrain · ship window after 20 Sep 2026 (store-review freeze 16–19 Sep)

This file is the creative brief made real. Images live in `artifacts/whisco-mascot-2/`.  
Real-dog source of truth remains `artifacts/whisco-refs/`.  
This pack **proposes** a third depiction (Illustrated Host) that Design System v1.0 forbade. It does not silently overwrite v1.0. Section 0 says how the two documents should fight.

Companions: `Whisco_TV_Design_System.md`, `Whisco_TV_Originals_Strategy.md`, `Whisco_TV_Arabic_Localization_Pack.md`, `Whisco_TV_App_Store_Review_War_Room.md`, `Whisco_TV_Ramadan_2027_Campaign_Bible.md`.

---

## 0. How this fights the current rails

| v1.0 law | This pack | Decision needed |
|---|---|---|
| Two depictions only (photo + one locked cartoon). No public LoRA. No “Whisco as iftar guest.” | Illustrated Host + scene pack, including Ramadan tea and Eid dates. | Founder accepts Illustrated Host as depiction **C**, or this pack stays moodboard. |
| Cartoon off catalog, player, store screenshots of catalog (Apple 2.3.7 / 2.3.10). | Still law. Collection covers in this pack have **no dog**. | Do not put any generated Whisco on title posters or App Store catalog shots. |
| Announcer, not critic. | Host, not critic. He greets, waits, sleeps, celebrates a *user* action. He never scores a film. | Keep. |
| Solo founder + agent. Freeze 16–19 Sep. | Ranked shortlist in §7. Nothing in this file is a ship order. | Staging branch only. |

Honesty: generated likeness is **good, not identical**. The lock portrait (`mascot/00-lock-portrait.jpg`) was edited from the tiled-floor photograph. Other frames drifted toward a generic cute Shih Tzu. Until a Rive rig exists, **crop the lock portrait** rather than mixing faces in chrome.

---

# 1. Design Vision Memo

**One sentence.**  
Whisco TV should feel like the lamp already on in a Gulf living room — dark glass, one warm gradient, a real dog who runs the station and talks to the household in their language.

**What that sentence forbids.**  
Template card grids with no gravity. Stretched YouTube thumbs as “posters.” Mascot-as-favicon-only. Casino neon. Sarcasm. “Trending in Bahrain” chips with no data. A second brand colour fighting ember→bloom.

**Three signature visual moments to build first**

1. **The Host in the corner.** A 120×120 Rive/Lottie Whisco on empty states and the marketing hero. He blinks. After 45s idle he sleeps. On “added to My List” he lifts a paw. One voice line per state, 13 languages as *text* first (audio later). This is the Duo move: the product has a creature who notices you.
2. **Bias light from the story.** Every poster and the player radiate a 24–40px sampled glow onto the `#0a0a0f` field. The room is lit by what you are watching. Zero new assets. Pure CSS. This is the Apple TV+ feeling we can ship without a studio.
3. **Maghrib hour.** Between local sunset and +90 minutes the ember side of the gradient warms ~8% and the aurora behind the hero thickens. Home Time clocks already prove we know where the household is from. Now the *chrome* knows what time it is in the Gulf.

**What to kill from the current approach**

- Persistent “Woof! I’m Whisco 🐾” as hero chrome. The dog is a fact. One greeting, then quiet.
- Cartoon Whisco sitting on top of catalog posters. Apple already read a crowded name + third-party catalogs as a problem (iOS v1.0 (5), 2.3.7 + 5.2.3, 10 Sep 2026). Do not give Review another cartoon-over-posters screenshot.
- Purple as a fill. Aurora wash only.
- Card hover that does nothing. If it cannot tilt 4° and lift a 1px ember edge, it is a static tile — treat it as one.
- Light-mode experiments. Dark is the living room.

**Feel words for the agent (use these in every PR description)**  
Warm. Quiet. Household. Lamp-lit. Honest. RTL-first. Fast on a mid-range Android.

---

# 2. Whisco Mascot 2.0

## 2.1 Three depictions (proposed)

| Code | What | Surfaces | Forbidden |
|---|---|---|---|
| **P** Photo | Real photographs in `whisco-refs/` | Icon, favicon, nav, About, press, WhatsApp avatar | Player, ads, legal, title posters |
| **A** Announcer | Existing live-site line-and-fill drawing | Splash, 404, offline kindness, *one* marketing hero until C ships | Catalog, critic poses, costumes |
| **C** Illustrated Host | New painted-3D character locked from the marble-floor photo | Empty states, loading, marketing, seasonal boards, Rive companion | Title posters, store catalog screenshots, ad slots, legal |

Photo stays canonical for trust (“this is a real dog”). Illustrated Host is how he *acts*. Do not blend them on the same component.

## 2.2 Character sheet — proportions and face lock

Drawn from the real set, not from the earlier studio-topknot generations.

| Landmark | Spec |
|---|---|
| Breed read | Compact Shih Tzu. Not a Maltipoo. Not a show-groom. |
| Coat | Warm cream `#f3e0c4` → sand `#d4b48a`. Ear tips one step darker. |
| Mask | Tan-brown muzzle, **small white blaze** down the stop (from `whisco-marble.jpg`). |
| Nose | Matte black, slightly wide. |
| Eyes | Dark round, single catchlight at 10 o’clock. Never human eyelashes. |
| Ears | Floppy, no topknot elastic. The generated “show bow” portraits in `imagine_images/` from 7 Sep are retired. |
| Tail | Plume, carried over the back when standing (lawn photo). |
| Bearing | Posh-minimal, slightly unimpressed at rest, warm when he looks at you. |
| Clothes | None on product. Headphones around the neck are the *only* optional prop, Announcer states only. Dream Angel tank stays Channel-internal. |

**Expression range (product, not sticker pack)**

| Name | Face | Use |
|---|---|---|
| `rest` | Closed mouth, eyes open, one ear soft | Default chrome |
| `watch` | Eyes on the “screen,” head 8° tilt | Tonight module, player-adjacent empty (never on the player) |
| `wave` | One paw up, small smile | Welcome, first visit, language picked |
| `sleep` | Eyes shut, loaf | Idle >45s, late-night chrome |
| `hope` | Eyes up-left, still | Empty My List |
| `search` | Head tilt, ear tick | No results |
| `load` | Half-lids, calm | Skeleton / channel health check |
| `care` | Soft concern, no panic | 404, stream offline |
| `spark` | Ears forward, tiny ember motes | Added to My List, share card saved |
| `iftar` | Rest + warmer key | Ramadan marketing only |

He does not eat on-screen next to food brands. He does not hold a scorecard. He does not wink at an advertiser.

## 2.3 Pose library × product moment

| Product moment | Pose | Line (EN) | Line (AR, MSA Gulf) |
|---|---|---|---|
| First paint / welcome | `wave` | “Hi. I’m Whisco.” | «مرحبا. أنا وسکو.» |
| Empty My List | `hope` | “The list is empty.” | «القائمة فاضية.» |
| Search zero | `search` | “Nothing with that name. Try the language shelf.” | «ما في شيء بهذا الاسم. جرّب رف اللغة.» |
| Channel offline | `care` | “This channel is hiding until it’s healthy.” | «هذه القناة مختفية إلى أن تصير سليمة.» |
| Loading / health check | `load` | (no line, or “One moment.”) | «لحظة.» |
| Idle | `sleep` | (no line) | — |
| Added to My List | `spark` | “Kept.” | «محفوظ.» |
| 404 | `care` | “That page walked off.” | «هذي الصفحة راحت.» |
| Ramadan marketing | `iftar` | “Tonight’s room is ready.” | «غرفة الليلة جاهزة.» |

Copy rules stay from originals: no piracy jokes, no “woof means play,” no meme voice.

## 2.4 Generated scenes (what exists today)

Likeness lock = `00`. Prefer it over `01` when faces disagree.

| File | State | Ratio | Notes |
|---|---|---|---|
| `mascot/00-lock-portrait.jpg` | Face lock, edited from real marble photo | 1:1 | **Canonical C.** Use for icon-adjacent illustrated crops. |
| `mascot/01-character-sheet.jpg` | 9-pose sheet | 2:3 | Directional only. Puppy drift. Do not ship poses 4/6 as chrome. |
| `mascot/02-welcome-wave.jpg` | Wave + headphones | 1:1 | Best Announcer-C hybrid. |
| `mascot/03-idle-sleep.jpg` | Sleep loaf | 2:3 | Idle / late night. |
| `mascot/04-watching.jpg` | Watch + TV glow | 3:2 | Marketing / Tonight empty. Screen is blank on purpose. |
| `mascot/05-empty-list.jpg` | Hope + empty shelf | 2:3 | My List empty. |
| `mascot/06-search-empty.jpg` | Tilt | 2:3 | No-results. Halo is a motif, not a saint ring — restyle to a thin ember arc in motion. |
| `mascot/07-loading.jpg` | Calm + gradient ring | 2:3 | Loading personality. |
| `mascot/08-error.jpg` | Care + broken-link sparks | 2:3 | 404 / offline. Soften the “sad puppy” if it reads as pity. |
| `mascot/09-celebrate-list.jpg` | Spark | 2:3 | My List add. Face drifted — composite lock head if shipping. |
| `mascot/10-announcer-headphones.jpg` | Wave, city aurora | 2:3 | Marketing only. |
| `seasonal/ramadan-iftar.jpg` | Iftar ledge + mint tea | 3:2 | Marketing / Ramadan bible. Not a costume. |
| `seasonal/eid-dates.jpg` | Dates + lantern | 3:2 | Eid board. |
| `seasonal/compound-cricket.jpg` | Bat on the grass, not held | 3:2 | Social, not chrome. Honesty: we do not have live cricket. Do not imply we do. |

## 2.5 Style recipe (regenerate without soup)

Paste this block into any image model. Do not improvise a second style.

```
WHISCO HOST STYLE RECIPE v1
Subject: compact adult gold-tan Shih Tzu, cream-to-sand curly coat in painted clumps
(not strand-level photoreal hair), darker tan muzzle mask, small white blaze on the
stop, matte black nose, large dark round eyes, single catchlight at 10 o'clock,
floppy ears with slightly darker tips, no topknot, no clothes.
Bearing: posh-minimal, warm, slightly cheeky, never mean, never aloof.
Medium: restrained Pixar-adjacent 3D illustration, painted fur, cinematic.
Field: #0a0a0f. Key: warm soft light, upper left. Rim: 1–2px ember #f97316 to
bloom #db2777 on one ear or shoulder only. No second palette.
Composition: generous negative space, family-friendly, no text, no watermark,
no other animals, no people, no copyrighted posters, no logos.
Props allowed: dark cushion, blank TV glow, mint tea, dates, lantern, wooden
cricket bat on the ground (never swung as a joke about unlicensed sport).
Props forbidden: sunglasses, party hats, thrones, human outfits, scorecards.
```

**Reference order when prompting:** `whisco-marble.jpg` (face) → `whisco-sit-front.jpg` (body) → `whisco-outdoor.jpg` (tail/silhouette) → `00-lock-portrait.jpg` (illustrated lock).

## 2.6 Rigged animation plan

**Tool: Rive, not Lottie, for the companion.**  
State machines (idle → sleep → wave → spark) are the product. Lottie is a baked timeline; Rive is a tiny interactive file. Lottie still wins for the 5-second logo sting (export once, play once).

| Asset | Tool | Budget [EST] | Degrade |
|---|---|---|---|
| Companion `whisco-host.riv` | Rive, 1 artboard, 4 states | 80–160 KB | Static WebP of `rest` (20–40 KB) |
| Blink / breathe / tail | Rive listen loops | inside the same file | CSS `opacity` pulse 2.8s if no Rive |
| Logo sting | Lottie or MP4-H264 5s | Lottie <80 KB or MP4 <400 KB | Poster frame PNG |
| Channel zap wipe | CSS + View Transitions | 0 KB asset | Instant cut |

**Loops to rig, in order**

1. Blink — every 3.2–5.8s, slightly irregular.
2. Breathe — chest scale 1.00 → 1.03, 2.8s ease.
3. Tail tick — 8° at rest, only on `wave` and `spark`.
4. Sleep — eyelids close over 1.2s after `idleMs > 45000`.
5. Wave — 600ms, triggered on first paint and on language change.
6. Spark — 400ms ear-forward + 8 ember particles (CSS, not in the rig).

**Runtime sketch (Next.js, staging)**

```tsx
// src/components/WhiscoHost.tsx
'use client';
import { useEffect, useState } from 'react';

type HostState = 'rest' | 'wave' | 'sleep' | 'spark' | 'care' | 'load';

export function WhiscoHost({
  state,
  reduced,
}: {
  state: HostState;
  reduced: boolean;
}) {
  // Rive runtime is optional. Image fallback is the product.
  if (reduced) {
    return (
      <img
        src={`/mascot/whisco-${state}.webp`}
        width={120}
        height={120}
        alt=""
        className="h-[120px] w-[120px] object-contain"
      />
    );
  }
  return <RiveHost state={state} />; // agent wires @rive-app/react-canvas after review
}

export function useIdleSleep(ms = 45_000): boolean {
  const [sleep, setSleep] = useState(false);
  useEffect(() => {
    const on = () => setSleep(false);
    const id = window.setTimeout(() => setSleep(true), ms);
    window.addEventListener('pointerdown', on);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('pointerdown', on);
    };
  }, [ms, sleep]);
  return sleep;
}
```

**Perf rails (NOT VERIFIED in this pass — agent must measure)**

- Do not load the Rive WASM on the title page or the player route.
- Companion mounts only on `/`, `/live` empty, `/my-list` empty, `/search` zero, 404.
- `prefers-reduced-motion: reduce` → static WebP, no loops.
- Mid-range Android: if `navigator.hardwareConcurrency <= 4` **and** save-data, skip Rive. [EST heuristic, not a standard.]
- LCP: companion is not the LCP image. Hero poster or wordmark is.

**Voice later, not now.**  
“The dog talks” in v1 is **captions**. A 13-language audio pack is a quarter project (human AR VO, labelled EN tool-voice). Do not ship an English bark over an Arabic household.

---

# 3. Surface image pack

Generated frames are concept resolution (~1176×784 landscape, ~784×1176 portrait). Upscale / crop to spec in Sharp before production. Do not stretch.

## 3.1 Files

| Surface | Target | File | Dog? |
|---|---|---|---|
| Desktop hero | 1920×1080 | `heroes/hero-desktop-living-room.jpg` | Yes, left third |
| Mobile hero | 828×1792 | `heroes/hero-mobile.jpg` | Yes, lower third |
| OG / share | 1200×630 | `heroes/og-share-card.jpg` | Yes, left |
| Turkish Dizi | 1200×675 | `covers/turkish-dizi.jpg` | No |
| Bollywood | 1200×675 | `covers/bollywood.jpg` | No |
| Pakistani Drama | 1200×675 | `covers/pakistani-drama.jpg` | No |
| Arabic Classics | 1200×675 | `covers/arabic-classics.jpg` | No |
| Filipino Hits | 1200×675 | `covers/filipino-hits.jpg` | No |
| Kids | 1200×675 | `covers/kids.jpg` | No |
| Ramadan | 1920×1080 / OG | `seasonal/ramadan-iftar.jpg` | Yes |
| Eid | 1920×1080 / OG | `seasonal/eid-dates.jpg` | Yes |

Type goes on a 60% `#0a0a0f` scrim. Collection labels in the language of the shelf, not English-only.

## 3.2 Cover type recipe

```
Title 32/40: Geist / IBM Plex Sans Arabic / Noto Sans [script]
Weight 600. Color #f5f5f7.
Subtitle 14: “61 series · 3,650 episodes” — catalog facts only, never “trending.”
Gradient underline 2px ember→bloom, 48px wide, not full bleed.
```

National-day covers: same atmospheres + a 4px flag-colour hairline under the title, **not** a flag watermark. One hairline. No dog in costume.

## 3.3 Prompt recipes for missing sizes

**Hero 1920×1080 (regenerate / upscale)**  
`WHISCO HOST STYLE RECIPE v1. Wide living room, blank TV emitting ember-to-pink field, dog seated left third on a dark sofa, right two-thirds empty for wordmark. 16:9.`

**Mobile 828×1792**  
`Same recipe. Dog lower third on a cushion, aurora rising, upper two-thirds empty #0a0a0f.`

**OG 1200×630**  
`Same recipe. Illustrated bust left, aurora right, no type in the render.`

---

# 4. Video and motion

Music/SFX: original or licensed-safe beds only. No film scores. No cricket stadium beds (we do not have the rights, and the honesty doctrine already says pay TOD for live sport).

## 4.1 Logo sting — 5 seconds

| t | Picture | Sound |
|---|---|---|
| 0.00 | Black `#0a0a0f` | Soft room tone, almost silence |
| 0.40 | A single ember point opens like an eye | 1-frame tick, 2 kHz, −18 dB |
| 1.10 | Lock portrait fades up, blink | Cloth-soft whoosh, no trailer boom |
| 2.20 | Wordmark `Whisco` in white, `TV` fills ember→bloom left-to-right | Two-note interval, warm, minor-second resolved |
| 3.40 | Tiny caption in active locale: “Free. No catch.” / «مجاناً. بدون خدعة.» | — |
| 5.00 | Hold, cut to app | — |

No bark. No headphones gag. Arabic sting is a separate render (`dir=rtl`, lock-up `وسکو تي في`).

## 4.2 App Store preview — 20 seconds (not 30)

Apple watches the first three seconds. Do not open on a cartoon over posters.

| t | Picture | VO / caption |
|---|---|---|
| 0–3 | Photo Whisco circular crop + wordmark on `#0a0a0f` | “Whisco TV. Free live TV and on-demand.” |
| 3–8 | Live grid, letterboxed thumbs, Home Time clocks visible | “Channels from home. Clocks from home.” |
| 8–13 | Tonight on Whisco module, three titles, no mascot overlay | “Tonight, already picked.” |
| 13–17 | Player on a title page. One ad slot **below the fold, never beside the player** — do not show an ad in the preview. | “No signup. One honest ad later.” |
| 17–20 | Illustrated Host `wave` + “Free forever.” | End card |

Do **not** show: pirate-looking playlists, “600 channels” stacked as a flex, cartoon sitting on a film poster, invented MAU.

## 4.3 Channel-zap transition — 280 ms

Not a 3D cube. A lamp dim.

1. Current frame desaturates 12% and drops opacity to 0.7 in 80ms.  
2. A 2px ember→bloom hairline wipes LTR (RTL: right-to-left) in 120ms.  
3. Next channel image fades in 80ms, bias-glow updates to the new poster’s sampled colour.  
4. Reduced motion: instant cut.  
5. If the next channel is unhealthy: skip the wipe, cut to Host `care` + “hiding until it’s healthy.”

SFX: a muffled tactile tick, not a CRT zap (CRT zap = pirate-box grammar).

```css
/* staging: view-transition names. Support NOT VERIFIED per browser — feature-detect. */
::view-transition-old(channel-frame) {
  animation: wh-out 180ms ease-in both;
}
::view-transition-new(channel-frame) {
  animation: wh-in 180ms ease-out both;
}
@keyframes wh-out {
  to { opacity: 0; filter: saturate(0.7); }
}
@keyframes wh-in {
  from { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(channel-frame),
  ::view-transition-new(channel-frame) { animation: none; }
}
```

---

# 5. Live and interactive graphics

Minimum five, plus two extras. All have a no-GPU story.

## 5.1 Bias light (ship first)

Sample the dominant colour of the focused poster / player poster, paint a radial gradient on the field.

```tsx
// src/lib/biasLight.ts
export function biasStyle(rgb: [number, number, number]): React.CSSProperties {
  const [r, g, b] = rgb;
  return {
    background: `radial-gradient(120% 80% at 50% 0%,
      rgba(${r},${g},${b},0.22),
      rgba(10,10,15,0) 55%), #0a0a0f`,
  };
}
```

Degrade: skip sampling, use ember at 8% opacity. Never run a canvas sampler on a low-end phone every frame — sample on `mouseenter` / focus / route change only.

## 5.2 Aurora hero wash

Already on the marketing hero as a quiet purple/amber. Constrain it to ember→bloom.

```css
.wh-aurora {
  background:
    radial-gradient(60% 50% at 20% 0%, rgba(249,115,22,0.18), transparent 60%),
    radial-gradient(50% 40% at 80% 10%, rgba(219,39,119,0.14), transparent 60%);
  animation: wh-aurora 16s ease-in-out infinite alternate;
}
@keyframes wh-aurora {
  from { transform: translate3d(0,0,0) scale(1); }
  to   { transform: translate3d(2%,1%,0) scale(1.04); }
}
@media (prefers-reduced-motion: reduce) {
  .wh-aurora { animation: none; }
}
```

## 5.3 Time-of-day engine (“Maghrib hour”)

Inputs: viewer IANA zone if we have it, else Asia/Bahrain; optional origin-city from Home Time.

| Window | Ember multiplier | Notes |
|---|---|---|
| Fajr–sunrise | 0.7 | Cooler, still dark |
| Day | 0.85 | Do not go light |
| Asr–maghrib | 1.0 | Default |
| Maghrib +90m | 1.08 | The signature |
| Late night | 0.75 | Sleepy Host allowed |

Prayer names are optional chrome on `/live` during Ramadan only, and only if we label the source (Umm al-Qura). Off-Ramadan, use civil sunset. Do not invent a second religious product.

```ts
export function emberMul(now: Date, sunset: Date): number {
  const t = now.getTime();
  const s = sunset.getTime();
  if (t >= s && t < s + 90 * 60_000) return 1.08;
  const h = now.getHours();
  if (h < 6) return 0.7;
  if (h >= 23 || h < 5) return 0.75;
  return 0.85;
}
```

## 5.4 “Now across the Gulf” ticker — not a map of people

A map of *users* implies surveillance we do not do (apps = Data Not Collected). Do this instead:

A horizontal ticker of **catalog facts we own**: channel health, “Malayalam live · 14 channels up,” “Turkish shelf · 61 series.” No flags-as-people-dots. No “2,401 watching.”

Implementation: CSS marquee on a `<ul>` of server-rendered facts from `cached.ts` (≥900s). Pause on hover/focus. RTL reverses direction.

## 5.5 Language rooms, not a globe

A spinning globe is tourist UX and a WebGL tax. Build **13 doorways**:

A bento of language tiles. Each tile is a 4:5 still from the matching cover atmosphere + native endonym. Focus = door opens (View Transition) onto that shelf. Arabic tile is first when `dir=rtl`.

This is the interactive picker. It works with thumbs. It works offline-cached.

## 5.6 Extra — Majlis rim light on the player page

A 16px inset box-shadow on the player chrome sampled from the title art, plus a 1px top hairline in ember→bloom at 40% opacity. Makes the watch page feel like a room. Ad slot stays below, never in the rim.

## 5.7 Extra — Scroll story on `/about`

Four pinned scenes, scroll-driven:

1. Photo of the real dog.  
2. “Named after a household animal.”  
3. “TV from home, for people far from home.”  
4. Illustrated Host `wave`.

`animation-timeline: scroll()` where supported; static stacked sections elsewhere. NOT VERIFIED: scroll-driven animations on Safari iOS versions in our store baseline — feature-detect, do not require.

---

# 6. Three wow pages we do not have

Not the examples in the brief. Adjacent, but ours.

## 6.1 Majlis Mode — `/tonight` lean-back

A page that assumes the phone is on the table and three people are on the sofa.

- Full-viewport Tonight pick, one title at a time, huge letterboxed art, bias light on the walls.
- A whisper row: “Also in the room” = two more titles, same language.
- Host sits in the bottom-left at 96px, `watch` pose, no speech unless the list is empty.
- Remote grammar: up/down changes the pick, enter plays, left opens the language door.
- Auto-advance every 20s, paused on focus. Reduced motion: no advance.
- No ads on this page. The rest of the site still has the one ad, elsewhere.

Why it is ours: we already wrote Tonight on Whisco. This is that module given a room.

## 6.2 Letters Home — `/home-time`

Home Time is clocks on Live. Promote it to a place.

- Thirteen origin rooms. Each room is a still (cover atmosphere) + the current time in that city + three live channels from that language that are *healthy right now*.
- Caption: “What the evening looks like in Kochi” — never “what 4 million expats are watching.”
- A single shared-element transition from the Live clock chip into the room.
- RTL, Devanagari, Tamil, Sinhala tested as first-class titles, not afterthoughts.

Why it is ours: clocks were the first thing on the site that felt like a household. Give them a door.

## 6.3 The Kind Zapper — `/surf`

Full-screen live, one channel, almost no chrome.

- A physical dial on the right (LTR) / left (RTL): language rings, then channel ticks.
- Only healthy streams are in the dial. Unhealthy ticks are gaps, not errors.
- Zap wipe from §4.3.
- Hold the dial 800ms = language jump.
- Host appears only when the stream fails, `care`, one line, next-healthy button.
- No recommendation score. No “up next because you watched.” Honesty over engagement theatre.

Why it is ours: pirate boxes already taught the hand this gesture. We steal the gesture and refuse the malware.

**Kids Night Light** is the obvious fourth. Park it until the store build is public. A kids mode in screenshots during a 5.2.3 review is extra surface. Design it in Q4, ship after approval.

---

# 7. Prioritized shortlist

Impact × feasibility for a solo founder + engineering agent. Effort S ≤ 1 day, M ≤ 1 week, L = quarter slice. Two-week window starts after 20 Sep 2026.

| Rank | Item | Effort | Window | Why |
|---|---|---|---|---|
| 1 | Bias light on home + title | S | 2 weeks | Biggest “not a template” change. Zero assets. |
| 2 | Letterbox thumbs (already queued) | S | 2 weeks | Kills the cheapest ugliness. |
| 3 | Empty-state Host using lock portrait + 4 static WebPs | S | 2 weeks | Duo-lite without Rive. |
| 4 | Aurora constrained to ember→bloom + Maghrib multiplier | S | 2 weeks | Time-of-day for free. |
| 5 | OG + hero swap using generated boards | S | 2 weeks | Marketing feel, no product risk. |
| 6 | Collection covers on 6 shelves | S–M | 2 weeks | Needs type overlay + alt text. Dog stays off. |
| 7 | Kind Zapper v0 (healthy-only live, CSS wipe) | M | 2 weeks | Uses live infrastructure we have. |
| 8 | Majlis Mode v0 on `/tonight` | M | 2 weeks / slip | Tonight module already exists. |
| 9 | View Transitions on title ↔ home | M | Quarter | Feature-detect. NOT VERIFIED store-baseline Safari. |
| 10 | Rive companion (blink/sleep/wave/spark) | M–L | Quarter | Needs one rig pass + WASM budget. |
| 11 | Letters Home rooms | M | Quarter | Home Time is the seed. |
| 12 | Logo sting + store preview | M | Quarter | After iOS is approved. Do not resubmit with new preview mid-war-room. |
| 13 | 13-language Host captions | M | Quarter | Text first. Human AR VO later. |
| 14 | Scroll-driven About | S | Quarter | Nice, not load-bearing. |
| 15 | Kids Night Light | L | After stores | Review surface. |
| 16 | Full scene-pack LoRA / public generator | L | Not this year | Still a doctrine risk. Keep the recipe private. |

**Kill / do not start in the next 90 days**

- WebGL globe.
- Photoreal talking-head video of the dog.
- Public LoRA.
- Costume festival packs (djinn, astronaut).
- Any mascot on an ad or on a title poster.
- Invented “watching now” maps.

---

# 8. Copy deck for the Host (ship-ready)

Use or delete. Do not expand into a joke book.

| Key | EN | AR |
|---|---|---|
| `hi` | Hi. I’m Whisco. | مرحبا. أنا وسکو. |
| `empty_list` | The list is empty. | القائمة فاضية. |
| `offline` | This channel is hiding until it’s healthy. | هذه القناة مختفية إلى أن تصير سليمة. |
| `zero_search` | Nothing with that name. | ما في شيء بهذا الاسم. |
| `kept` | Kept. | محفوظ. |
| `404` | That page walked off. | هذي الصفحة راحت. |
| `tonight` | The room is ready. | الغرفة جاهزة. |
| `free` | Free. No catch. | مجاناً. بدون خدعة. |

More locales: agent fills from the Arabic localization pack register, human posts.

---

# 9. Implementation notes for the engineering agent

- Catalog reads still go through `src/lib/cached.ts` (`unstable_cache` ≥900s). Cover art URLs are data; do not inline 1.4k-wide JPGs in the route.
- Serve pack images via `next/image` from `/public/mascot2/` after the agent copies what passes review. This folder is the design drop, not production.
- No new analytics SDK. Apps stay Data Not Collected through v1.1.
- Site freeze 16–19 Sep 2026. Land on a staging branch. Nothing here is a production PR until 20 Sep.
- If a generated face fights `00-lock-portrait.jpg`, composite the lock head. Do not ship a second dog.

---

*End of pack. The dog is the station. The station is a living room. Everything else is furniture.*
