# WHISCO TV — Mascot 2.0 Arena drop
**11 September 2026 · upload this zip to Arena Agent Mode**  
Unzip. Read this file first. Then `Whisco_TV_Design_Vision_Mascot_2.md`.  
Do not invent a second dog. Do not put the dog on title posters or App Store catalog screenshots.

Site freeze **16–19 Sep 2026**. Land on a staging branch. Ship after **20 Sep**.

---

## What this zip is

Every binary the Grok design pack referenced, plus the three real-dog photographs used as likeness source. Paths below are relative to the zip root.

| Count | Folder | Role |
|---|---|---|
| 3 | `refs/` | Real photographs. Source of truth for likeness. |
| 11 | `mascot/` | Illustrated Host. `00-lock-portrait.jpg` is canonical. |
| 3 | `heroes/` | Marketing / OG. Dog allowed. |
| 6 | `covers/` | Collection atmospheres. **No dog.** |
| 3 | `seasonal/` | Ramadan / Eid / compound. Marketing only. |
| 2 | root | This readme + the full vision memo |

No secrets. No repo. No env. Images only + operator copy.

---

## Likeness order (do not invert)

1. `refs/01-face-tile-closeup.jpg` — real face (was mislabelled `whisco-marble.jpg` in the Grok workspace). White blaze, black nose, dark round eyes.
2. `refs/02-living-room-throw.jpg` — real body / household bearing (was `whisco-sit-front.jpg`).
3. `refs/03-compound-lawn.jpg` — real silhouette, plume tail, collar (was `whisco-outdoor.jpg`).
4. `mascot/00-lock-portrait.jpg` — illustrated face lock, edited from (1). **Use this for any illustrated chrome.**
5. Other `mascot/01–10` frames — directional. If a face fights `00`, composite `00` onto the body. Do not ship a second dog.

Photo Whisco (the three refs, circular crop) stays on: app icon, favicon, nav, About, press, WhatsApp avatar.  
Illustrated Host (`00` + poses) stays on: empty states, loading, marketing, seasonal boards.  
Neither goes on: player, title posters, legal, ad slots, store screenshots of the catalog.

---

## File register

### refs/ — real dog

| File | Shot | Use |
|---|---|---|
| `refs/01-face-tile-closeup.jpg` | Overhead face on white tile | `face-1x1` crop. Best real icon source. |
| `refs/02-living-room-throw.jpg` | Standing on beige throw, apartment | `bust-4x5`. About / empty-state photo variant. |
| `refs/03-compound-lawn.jpg` | Full body, leash, compound grass | Silhouette, tail, coat. Not an icon. |

Dream Angel tank / kitchen birthday / beach / generated white-bg bust are **not** in this zip on purpose.

### mascot/ — Illustrated Host

| File | State | Product moment |
|---|---|---|
| `mascot/00-lock-portrait.jpg` | Face lock | Any illustrated crop. Canonical. |
| `mascot/01-character-sheet.jpg` | 9-pose sheet | Direction only. Puppy drift — do not ship poses as chrome. |
| `mascot/02-welcome-wave.jpg` | Wave + headphones | Welcome / first paint / language change. |
| `mascot/03-idle-sleep.jpg` | Loaf, eyes shut | Idle >45s, late night. |
| `mascot/04-watching.jpg` | Watching blank TV glow | Tonight empty, marketing. Screen must stay blank (no posters). |
| `mascot/05-empty-list.jpg` | Hope + empty shelf | My List empty. |
| `mascot/06-search-empty.jpg` | Head tilt | Search zero. |
| `mascot/07-loading.jpg` | Calm + ember-pink ring | Loading / health check. |
| `mascot/08-error.jpg` | Care + broken-link sparks | 404 / channel offline. |
| `mascot/09-celebrate-list.jpg` | Spark | Added to My List. Face drifted — composite `00` if shipping. |
| `mascot/10-announcer-headphones.jpg` | Wave, aurora | Marketing hero only. |

### heroes/

| File | Target crop | Notes |
|---|---|---|
| `heroes/hero-desktop-living-room.jpg` | 1920×1080 | Dog left third. Type on the dark right. |
| `heroes/hero-mobile.jpg` | 828×1792 | Dog lower third. Type in the upper dark. |
| `heroes/og-share-card.jpg` | 1200×630 | Bust left, aurora right. Overlay wordmark in code, not in the bitmap. |

Generated resolution is ~1176×784 (landscape) / ~784×1176 (portrait). Upscale with Sharp. Do not stretch thumbs.

### covers/ — no dog

| File | Shelf |
|---|---|
| `covers/turkish-dizi.jpg` | Turkish Dizi |
| `covers/bollywood.jpg` | Bollywood |
| `covers/pakistani-drama.jpg` | Pakistani Drama |
| `covers/arabic-classics.jpg` | Arabic Classics |
| `covers/filipino-hits.jpg` | Filipino Hits |
| `covers/kids.jpg` | Kids |

Type recipe is in the vision memo §3.2. Facts only on the subtitle (counts from the DB). Never “trending.”

### seasonal/ — marketing only

| File | Occasion | Caution |
|---|---|---|
| `seasonal/ramadan-iftar.jpg` | Ramadan 2027 | Respectful. Not a costume. Not chrome. |
| `seasonal/eid-dates.jpg` | Eid | Same. |
| `seasonal/compound-cricket.jpg` | Social only | Do **not** imply we carry live cricket. Honesty doctrine: pay TOD for that. |

---

## Agent jobs this pack is for

Allowed without a new founder decision:

- Copy approved stills into `/public/mascot2/` on a **staging** branch after 20 Sep.
- Wire empty-state `<img>` fallbacks to `00`, `03`, `05`, `06`, `07`, `08`.
- Overlay type on covers / heroes via CSS. Do not bake English into the JPG.
- Letterbox existing YouTube thumbs. Bias-light CSS from the memo.

Needs founder gate:

- Treating Illustrated Host as depiction C in Design System v1.0 (this pack proposes it; v1.0 forbade a third depiction).
- Rive rig.
- Any mascot on a store screenshot.
- Shipping seasonal boards during the iOS 5.2.3 war-room.

Forbidden:

- Public LoRA / “new poses” generator in prod.
- Dog on title posters, player, ads, legal.
- Secrets in this chat or this zip (there are none; keep it that way).

---

## Style recipe (if you must regenerate)

See `Whisco_TV_Design_Vision_Mascot_2.md` §2.5. Reference order: `refs/01` → `refs/02` → `refs/03` → `mascot/00`.
