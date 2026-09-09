# WHISCO TV — Design System
**v1.0 · 10 September 2026 · operator spec, not a rebrand**  
whisco.tv · Bahrain · `design@` does not exist; this file is the design desk.

This is the document that makes the next screen, poster, and pixel recognisably ours. It evolves what is already live (20 Aug 2026): the near-black field, the orange→pink wordmark, the circular photo of the real dog, the pill CTA. It does not invent a new brand. It does not hire a studio. One engineer ships it incrementally; the ranked backlog in §7 is the only queue.

Companions: `Whisco_TV_Originals_Strategy.md` (mascot = announcer, no public LoRA), `Whisco_TV_Arabic_Localization_Pack.md` (lock-up `وسکو تي في`), `Whisco_TV_Patronage_Program.md` (quiet underwrite), `Whisco_TV_Marketing_Playbook.md` (festival calendar), `Whisco_TV_Press_Kit.md` (dog is a fact, not a punchline).

**Hard doctrines that override taste**

- Dark product. No light mode on the watch surfaces. Argument in §6.
- Max one ad per page, never adjacent to the player, never a pop-under.
- No piracy visual language. No “Firestick”, no skull, no “free IPTV” badge.
- No invented traffic, ratings, or “trending in Bahrain” chips until first-party data exists.
- No Sign in in primary chrome while the product promise is “no account required.” Optional accounts, if they ever exist, live behind an overflow. Live-site drift (“Sign in”, “Free Profiles”, “6 profiles”) is retired by this spec, not blessed by it.
- Community posts are human. Automation drafts posters; a person publishes.
- Apps stay “Data Not Collected” in v1. No analytics SDK chrome. No cookie-wall modal.
- Executable by ≤2 people. If a recommendation needs a motion designer and a brand film, it is the wrong recommendation.

**What we keep from the live site**

| Keep | Why |
|---|---|
| Canvas `#0a0a0f` | Already the brand. Matches evening rooms and OLED phones. |
| Ember `#f97316` → Bloom `#db2777` on the wordmark and primary CTA | The only chromatic signature. |
| Circular crop of the *real* dog as the app icon / favicon / nav mark | True, cheap, distinctive. |
| Pill primary button, 999px radius | Already taught. Do not invent a new button. |
| Quiet purple/amber *aurora* behind the marketing hero | Ambient only. Not a third brand colour in chrome. |
| “No catch.” as a marketing line | Honest. Keep it off catalog pages. |

**What we retire or constrain**

| Retire / constrain | Replacement |
|---|---|
| Cartoon Whisco with headphones on every marketing block | Allowed on **one** official Announcer drawing, marketing landing + empty states only. Never on catalog, player, legal, patron credits. |
| “Woof! I’m Whisco 🐾” speech bubble on the homepage | Press kit rule: the dog is a fact, not a punchline. Keep the line for the About page and the Announcer empty-state. Kill it as a persistent hero chrome. |
| Primary-nav “Sign in” | Watch is the default. Overflow later. |
| “Free Profiles / 6 profiles per account” as a feature tile | On-device list. Do not design a profile-picker for v1. |
| Stretching 16:9 YouTube thumbs into 2:3 poster slots | Letterbox onto the dark field. Spec in §3.1. |
| Purple as a fill colour on chips, badges, or buttons | Aurora wash only. Ember/Bloom or ink. |
| Public LoRA / generated “new poses” of Whisco | Forbidden. Use the photo set in `artifacts/whisco-refs/`. |

---

## 0. How to implement this file

1. Copy §2 tokens into `app/styles/tokens.css` and wire them in `tailwind.config.ts`. Ship that first. Everything else reads the tokens.
2. Convert one component at a time in the order in §7. Do not restyle the whole site in one PR.
3. Posters in §5 are SVG strings the agent fills from catalog JSON. Do not open Figma.
4. Arabic is a first-class direction, not a stylesheet afterthought. Every component spec has an RTL note.
5. If a rule here fights a live page, this file wins — except catalog *facts* (counts, geo, legality), which the database wins.

---

# 1. Brand foundation

## 1.1 The dog is the brand, not a costume

Whisco is a real gold-tan mask Shih Tzu. Coat: warm cream to sand, darker muzzle, black nose, dark round eye. Bearing: posh-minimal, slightly unimpressed, loyal. He lives in a Bahrain apartment and has been photographed on a beige throw, on a Gulf beach, and in a car wearing a black “Dream Angel” tank. Those photographs are the source of truth. They sit in `artifacts/whisco-refs/`.

Personality we take from him, and from the product:

| Trait | Product translation |
|---|---|
| Loyal | The catalog self-heals. Dead rows hide. We do not strand you on a broken play button. |
| Unpretentious | No “cinematic universe” copy. No whoosh pack. One ad, named as an ad. |
| Fast | LCP budget. Skeletons, not spinners. Home in one tap. |
| Posh-minimal | Dark field, tight type, almost no decoration. The gradient is the jewellery. |
| Household animal | This is a living-room product for mixed-language apartments, not a startup landing. |

## 1.2 Two approved depictions

We keep **two** depictions. Not three. Not a generator.

### A. Photo Whisco (canonical)

Circular or soft-rect crop of a real photograph. No sunglasses overlay, no party hat, no “CDO” title, no composite onto a throne.

**Use on:** app icon, favicon, nav lock-up, About, press kit, originals bumpers, WhatsApp Channel avatar, empty-state *portrait* variant, founder+dog press stills.

**Do not use on:** title posters, patron credits, legal pages, the player, AdSense-adjacent slots (a dog face next to an ad looks like an endorsement of the advertiser).

**Crops**

| Name | Ratio | Anchor | Surfaces |
|---|---|---|---|
| `face-1x1` | 1:1 | Eyes on the optical centre | Icon, nav, avatar |
| `bust-4x5` | 4:5 | Chest-up, room to sit on a dark field | About, empty state |
| `wide-16x9` | 16:9 | Face left or right third, never centre-cropped into a smear | Marketing OG only |

Approved files today: `whisco-face.jpg`, `whisco-sit-front.jpg`, `whisco-sit-tan.jpg`, `whisco-posh-bed.jpg`, `whisco-outdoor.jpg`, `whisco-marble.jpg`. `whisco-portrait-raw.png` is archive, not a public asset (resolution + compression). The “Dream Angel” tank photo is **internal / Channel-only** — it is charming and off-brand for the product chrome.

### B. Announcer Whisco (the existing cartoon, locked)

The live-site line-and-fill drawing — gold-tan coat, dark ears, sitting, one paw up, optional headphones — is the **Announcer**. He introduces the room. He does not review films. He does not wink at an advertiser. He does not spawn variants.

**Use on:** marketing landing hero (one instance), app splash, catalog empty states, 404, “channel offline” kindness.

**Do not use on:** player, title pages, hub heroes, patron lock-ups, store screenshots of the *catalog* (Apple 2.3.7 / 2.3.10 will read a cartoon over posters as another app’s content), legal, policy.

**Rules from the originals bible, restated as design law**

1. Announcer, not critic. He does not hold a scorecard.
2. No public LoRA. No “Whisco as a djinn / astronaut / iftar guest.” Festival posters use type + motif, not a costumed dog.
3. One official drawing file. If we redraw, we replace the file; we do not accumulate styles.
4. Speech-bubble copy is optional and rare. Allowed lines: “The list is empty.” / “This channel is hiding until it’s healthy.” / “Hi. I’m Whisco.” Forbidden: jokes about piracy, “woof means play,” anything that makes the product a meme page.

## 1.3 Logotype

**Latin wordmark.** `Whisco` in the display face, regular or medium, not ultra-black. `TV` in the same face, same size, filled with the Ember→Bloom gradient. Tracking on `TV` is +0.04em so the two letters do not collide at small sizes.

**Arabic lock-up.** `وسکو تي في` — already locked in the localization pack. Do not write `ويسكو`. Do not write `ويسکو`. The letter *kāf* is ک (Persian/Urdu-style) in the founder lock-up; if a system font renders ک poorly, fall back to `وسكو تي في` with Arabic kāf. Test in IBM Plex Sans Arabic and Noto Naskh Arabic before shipping.

**Clear-space.** One cap-height of `W` on all four sides of the lock-up. Do not put the mark over a busy poster without a 60% scrim.

**Minimum sizes**

| Surface | Mark | Wordmark |
|---|---|---|
| Nav | 32px circle | 18px cap-height |
| Favicon | 32 / 180 / 512 | wordmark omitted |
| Poster footer | 24px circle | 14px |
| WhatsApp Status | 48px circle | 22px |
| Print / press | 64px circle | 28px |

**Do not** outline the wordmark. Do not add a drop shadow to the type. Do not set `TV` in a different family. Do not stack the Arabic under the Latin in the nav — pick one per `dir`.

```svg
<!-- Wordmark, 240×32. Gradient is the brand. Use as <svg> inline so the CSS variables resolve. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 32" role="img" aria-label="Whisco TV">
  <defs>
    <linearGradient id="w-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f97316"/>
      <stop offset="1" stop-color="#db2777"/>
    </linearGradient>
  </defs>
  <text x="0" y="24"
        font-family="Geist, Inter, 'IBM Plex Sans Arabic', sans-serif"
        font-size="22" font-weight="600" fill="#f5f5f7" letter-spacing="-0.02em">Whisco</text>
  <text x="86" y="24"
        font-family="Geist, Inter, sans-serif"
        font-size="22" font-weight="700" fill="url(#w-grad)" letter-spacing="0.04em">TV</text>
</svg>
```

```svg
<!-- Arabic lock-up. dir is baked in. 220×36. -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 36" role="img" aria-label="وسکو تي في">
  <defs>
    <linearGradient id="w-grad-ar" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stop-color="#f97316"/>
      <stop offset="1" stop-color="#db2777"/>
    </linearGradient>
  </defs>
  <text x="220" y="26" text-anchor="end" direction="rtl"
        font-family="'IBM Plex Sans Arabic', 'Noto Naskh Arabic', sans-serif"
        font-size="22" font-weight="600" fill="#f5f5f7">وسکو</text>
  <text x="148" y="26" text-anchor="end" direction="rtl"
        font-family="'IBM Plex Sans Arabic', sans-serif"
        font-size="22" font-weight="700" fill="url(#w-grad-ar)">تي في</text>
</svg>
```

## 1.4 Voice / tone matrix

Tone is honest, expat-first, anti-hype. The matrix is the difference between surfaces, not a new personality per page.

| Surface | Voice | Allowed | Forbidden |
|---|---|---|---|
| **Catalog chrome** (nav, shelves, chips, player frame) | Utility. Short verbs. | “Watch now.” “This channel is offline.” “Not available in your country.” | Jokes. “Woof.” Emoji in chrome except the existing 🐾 on Announcer empty-states. |
| **Title page** | Honest availability. | “Official embed.” “Free-to-air.” “We do not have live cricket — pay TOD.” | Star ratings we did not measure. “Binge-worthy.” “Hidden gem.” |
| **Marketing landing** | Warm, one smile. | “No catch.” “Free. Legal. No signup.” Announcer may appear once. | “Life’s better at full speed” energy-drink copy. “Huge library you won’t find anywhere else” if we cannot defend the claim. Prefer “official Hindi cinema, Turkish runs, Arabic series — in one room.” |
| **Guides / SEO** | Editor in a kitchen. | Specific, sourced, “as of [date].” | Listicle clichés. Fake “top 10 in Dubai.” |
| **Originals** | Founder-as-editor. | One rule per episode. Refusal is part of the show. | Clip montages. Host-as-critic roasting a film we do not own. |
| **WhatsApp Channel** | Spoken, human. | “Tonight, three things that actually play.” | Hashtag walls. Affiliate codes. |
| **Patron credit** | PBS underwrite. | “This shelf is made possible by [Name]. [Quiet line.]” | “Presented by” on the player. Price talk. “Visit today.” |
| **Legal / policy** | Plain. | “Requires qualified legal review” where true. | Brand voice. The dog does not appear. |
| **Empty / error** | Kind, specific. | “Your list lives on this device. Add something from On Demand.” | “Oopsie.” “Whoof happened.” |
| **Ads frame** | Neutral label. | “Advertisement · one per page.” | “Support us by clicking.” |
| **Store listings** | ASO, still honest. | Locked strings from the localization pack. | Screenshots that look like we produced the films. |

**Register notes already locked**

- English: short, concrete, Gulf-apartment. No Silicon Valley “unlock.”
- Arabic: MSA with a Gulf living-room register. Singular أنت. No Egyptian street, no news-anchor classical. Digits stay Western.
- Taglish / Hinglish: WhatsApp drafts only, never chrome.

---

# 2. Design tokens as code

Ship as CSS custom properties first. Tailwind reads the same variables. Prefer OKLCH for *computed* tints so hover/disabled mix in perceptual space; keep the hex primitives so a mid-range Android WebView that does not know OKLCH still paints the brand.

## 2.1 Color

```css
/* app/styles/tokens.css */
:root {
  color-scheme: dark;

  /* --- primitives (do not use raw in components) --- */
  --w-hex-canvas: #0a0a0f;
  --w-hex-canvas-2: #12121a;
  --w-hex-canvas-3: #1a1a24;
  --w-hex-ink: #f5f5f7;
  --w-hex-ink-dim: #a1a1aa;
  --w-hex-ink-faint: #71717a;
  --w-hex-ember: #f97316;
  --w-hex-bloom: #db2777;
  --w-hex-live: #34d399;     /* healthy channel — not a brand colour */
  --w-hex-warn: #fbbf24;
  --w-hex-danger: #fb7185;
  --w-hex-legal: #7dd3fc;    /* "official / FTA / PD" chip text */

  /* --- OKLCH working copies (modern browsers) --- */
  --w-canvas: oklch(13.2% 0.014 285);
  --w-canvas-2: oklch(16.8% 0.016 285);
  --w-canvas-3: oklch(20.4% 0.018 285);
  --w-ink: oklch(96.7% 0.004 286);
  --w-ink-dim: oklch(71.2% 0.016 286);
  --w-ink-faint: oklch(55.4% 0.016 286);
  --w-ember: oklch(70.5% 0.186 47.6);
  --w-bloom: oklch(59.2% 0.214 355.4);
  --w-live: oklch(78.4% 0.141 164);
  --w-warn: oklch(83.7% 0.164 84);
  --w-danger: oklch(71.2% 0.176 15);
  --w-legal: oklch(84.2% 0.086 230);

  /* mixes — degrade to hex in @supports not */
  --w-ember-hover: color-mix(in oklch, var(--w-ember) 88%, white);
  --w-bloom-hover: color-mix(in oklch, var(--w-bloom) 88%, white);
  --w-ember-pressed: color-mix(in oklch, var(--w-ember) 82%, black);
  --w-chip: color-mix(in oklch, var(--w-canvas-3) 82%, var(--w-ember) 18%);
  --w-chip-border: color-mix(in oklch, var(--w-ink) 14%, transparent);
  --w-scrim: color-mix(in oklch, var(--w-canvas) 72%, transparent);
  --w-aurora-a: color-mix(in oklch, oklch(42% 0.18 300) 35%, transparent);
  --w-aurora-b: color-mix(in oklch, var(--w-ember) 22%, transparent);
  --w-aurora-c: color-mix(in oklch, var(--w-bloom) 18%, transparent);

  /* semantic */
  --w-bg: var(--w-canvas);
  --w-bg-elev-1: var(--w-canvas-2);
  --w-bg-elev-2: var(--w-canvas-3);
  --w-fg: var(--w-ink);
  --w-fg-muted: var(--w-ink-dim);
  --w-fg-faint: var(--w-ink-faint);
  --w-brand-from: var(--w-ember);
  --w-brand-to: var(--w-bloom);
  --w-focus: var(--w-ember);
  --w-ad-frame: color-mix(in oklch, var(--w-ink) 10%, transparent);

  /* gradients */
  --w-grad-brand: linear-gradient(90deg, var(--w-ember), var(--w-bloom));
  --w-grad-brand-180: linear-gradient(180deg, var(--w-ember), var(--w-bloom));
  --w-grad-cta: linear-gradient(90deg, #f97316 0%, #fb7185 52%, #db2777 100%);
  --w-grad-scrim: linear-gradient(
    180deg,
    transparent 0%,
    color-mix(in oklch, var(--w-canvas) 20%, transparent) 42%,
    color-mix(in oklch, var(--w-canvas) 92%, transparent) 100%
  );
  --w-grad-aurora: radial-gradient(80% 60% at 8% 0%, var(--w-aurora-a), transparent 60%),
                   radial-gradient(60% 50% at 92% 10%, var(--w-aurora-c), transparent 55%),
                   radial-gradient(50% 40% at 70% 100%, var(--w-aurora-b), transparent 50%);
}

@supports not (color: oklch(50% 0.1 0)) {
  :root {
    --w-canvas: #0a0a0f;
    --w-canvas-2: #12121a;
    --w-canvas-3: #1a1a24;
    --w-ink: #f5f5f7;
    --w-ink-dim: #a1a1aa;
    --w-ember: #f97316;
    --w-bloom: #db2777;
    --w-ember-hover: #fb923c;
    --w-bloom-hover: #e84a8c;
    --w-chip: #2a1c18;
    --w-scrim: rgba(10, 10, 15, 0.72);
  }
}

@media (prefers-contrast: more) {
  :root {
    --w-fg-muted: #d4d4d8;
    --w-chip-border: color-mix(in oklch, var(--w-ink) 40%, transparent);
  }
}

@media (prefers-reduced-transparency: reduce) {
  :root {
    --w-scrim: var(--w-canvas);
    --w-aurora-a: transparent;
    --w-aurora-b: transparent;
    --w-aurora-c: transparent;
  }
}
```

### Contrast ledger (WCAG 2.2, assumed sRGB)

Checked against canvas `#0a0a0f`. Use this table; do not invent a third orange.

| Pair | Ratio [EST] | Use |
|---|---|---|
| Ink `#f5f5f7` on canvas | ~18.6:1 | Body, titles |
| Ink-dim `#a1a1aa` on canvas | ~7.1:1 | Meta, clocks, secondary |
| Ink-faint `#71717a` on canvas | ~4.6:1 | Legal microcopy only. Not UI labels. |
| Ember `#f97316` on canvas | ~8.2:1 | Large text (≥18px / 14px bold), icons |
| Bloom `#db2777` on canvas | ~5.4:1 | Large text only. Never 12px nav. |
| Ember on canvas-3 `#1a1a24` | ~7.4:1 | Chip accents |
| Ink on Ember (button label, if solid) | fails at small | **Do not put dark ink on a solid Ember fill.** CTA label is `#0a0a0f` only if the fill is the *gradient* at full saturation *and* the type is ≥16px / semibold — still prefer white/`#fff7ed`. Spec: CTA label = `#fff7ed`. |
| `#fff7ed` on Ember | ~2.6:1 as a pair of flats | Combined-with-Bloom gradient + 16px semibold + button height 44px passes as large/UI component, not as 12px text. |
| Live `#34d399` on canvas | ~10.1:1 | 8px live dot + “LIVE” 11px caps is acceptable if the word is not the only cue (also a shape). |
| Legal `#7dd3fc` on canvas | ~10.8:1 | Source chips |

**Rule.** If a control is smaller than 16px, it is ink or ink-dim. Ember/Bloom are for the wordmark, the CTA, focus rings, and scrim accents.

## 2.2 Typography

Two loaded families. Everything else is a system fallback. Indic and CJK scripts ride on `Noto Sans` *only as `unicode-range` fallback* — do not preload 13 Noto cuts.

```css
:root {
  --w-font-sans: "Geist", "Inter", ui-sans-serif, system-ui, "Segoe UI",
                 "IBM Plex Sans Arabic", "Noto Sans Arabic",
                 "Noto Sans Devanagari", "Noto Sans Malayalam",
                 "Noto Sans Tamil", "Noto Sans Telugu",
                 "Noto Sans Bengali", "Noto Naskh Arabic",
                 "Noto Sans Thai", sans-serif;
  --w-font-display: "Geist", "Inter Tight", var(--w-font-sans);
  --w-font-arabic: "IBM Plex Sans Arabic", "Noto Naskh Arabic", var(--w-font-sans);
  --w-font-mono: "Geist Mono", ui-monospace, "Cascadia Code", monospace;

  /* scale — 1.125 minor third from 16 */
  --w-fs-0: 0.75rem;    /* 12 — chips, clocks, ad label */
  --w-fs-1: 0.8125rem;  /* 13 — meta on cards */
  --w-fs-2: 0.875rem;   /* 14 — secondary UI */
  --w-fs-3: 1rem;       /* 16 — body, buttons */
  --w-fs-4: 1.125rem;   /* 18 — card titles */
  --w-fs-5: 1.375rem;   /* 22 — shelf titles */
  --w-fs-6: 1.75rem;    /* 28 — page titles */
  --w-fs-7: 2.25rem;    /* 36 — marketing H1 mobile */
  --w-fs-8: 3.25rem;    /* 52 — marketing H1 desktop */

  --w-lh-tight: 1.15;
  --w-lh-snug: 1.28;
  --w-lh-body: 1.55;
  --w-tracking-display: -0.03em;
  --w-tracking-caps: 0.08em;
}

html, body {
  font-family: var(--w-font-sans);
  font-size: 16px;
  line-height: var(--w-lh-body);
  color: var(--w-fg);
  background: var(--w-bg);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

[dir="rtl"] body { font-family: var(--w-font-arabic); }

.w-display {
  font-family: var(--w-font-display);
  letter-spacing: var(--w-tracking-display);
  line-height: var(--w-lh-tight);
  font-weight: 600;
}

.w-gradient-text {
  background-image: var(--w-grad-brand);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

**Loading rule.** Geist (or Inter) latin `woff2` + IBM Plex Sans Arabic `woff2` with `unicode-range: U+0600-06FF, U+0750-077F, U+0870-089F, U+08A0-08FF, U+FB50-FDFF, U+FE70-FEFF`. `font-display: swap`. No Google Fonts CSS that pulls seven files. Self-host on the Vercel domain.

**Arabic specifics.** Line-height +0.08 on body vs Latin. Do not italicise Arabic. Western digits. `font-feature-settings: "kern" 1` only.

## 2.3 Spacing, radii, elevation, motion

```css
:root {
  --w-space-1: 4px;
  --w-space-2: 8px;
  --w-space-3: 12px;
  --w-space-4: 16px;
  --w-space-5: 24px;
  --w-space-6: 32px;
  --w-space-7: 48px;
  --w-space-8: 64px;
  --w-space-page-x: clamp(16px, 4vw, 48px);
  --w-gutter-shelf: 12px;

  --w-radius-sm: 8px;
  --w-radius-md: 12px;
  --w-radius-lg: 16px;
  --w-radius-pill: 999px;
  --w-radius-card: 12px;

  --w-elev-0: none;
  --w-elev-1: 0 1px 0 color-mix(in oklch, var(--w-ink) 6%, transparent);
  --w-elev-2: 0 8px 24px -12px oklch(0% 0 0 / 0.55);
  --w-elev-focus: 0 0 0 2px var(--w-canvas), 0 0 0 4px var(--w-ember);

  --w-z-nav: 40;
  --w-z-banner: 45;
  --w-z-ad: 10;
  --w-z-player: 30;
  --w-z-toast: 60;

  /* motion */
  --w-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --w-ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
  --w-ease-snap: cubic-bezier(0.22, 1, 0.36, 1);
  --w-dur-1: 120ms;   /* hover color */
  --w-dur-2: 200ms;   /* hover lift, chip */
  --w-dur-3: 320ms;   /* page / view transition */
  --w-dur-4: 600ms;   /* skeleton shimmer loop */
  --w-dur-5: 900ms;   /* hero aurora idle */
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --w-dur-1: 0ms;
    --w-dur-2: 0ms;
    --w-dur-3: 0ms;
    --w-dur-4: 0ms;
    --w-dur-5: 0ms;
  }
}
```

## 2.4 Tailwind config (v3/v4 compatible shape)

```js
// tailwind.config.ts — extend only. Do not replace the default palette.
export default {
  darkMode: "class", // we force the class on <html>, we do not toggle it
  theme: {
    extend: {
      colors: {
        canvas: "var(--w-canvas)",
        ink: "var(--w-ink)",
        ember: "var(--w-ember)",
        bloom: "var(--w-bloom)",
        live: "var(--w-live)",
      },
      fontFamily: {
        sans: "var(--w-font-sans)",
        display: "var(--w-font-display)",
        arabic: "var(--w-font-arabic)",
      },
      borderRadius: {
        card: "var(--w-radius-card)",
        pill: "var(--w-radius-pill)",
      },
      boxShadow: {
        focus: "var(--w-elev-focus)",
      },
      transitionTimingFunction: {
        out: "var(--w-ease-out)",
        snap: "var(--w-ease-snap)",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
};
```

Force dark once:

```tsx
<html lang="en" className="dark" data-theme="whisco-dark">
```

There is no `data-theme="whisco-light"`.

---

# 3. Component specs

All measurements assume a 390px-wide mid-range Android as the primary canvas, then 1280px desktop. Touch targets ≥44px.

## 3.1 Poster card — the YouTube-thumbnail reality

Most VOD art is an official YouTube thumbnail: **16:9**, often 4:3-safe internally, frequently letterboxed already, sometimes a title card with burned-in type. Pretending these are Netflix 2:3 key art makes every shelf look cheap.

**Decision.** The card is a **3:4 frame** (portrait, scanable in a row) whose *image well* is a **16:9 letterbox** parked in the upper 60% on `#0a0a0f`, with a gradient scrim and type in the remaining field. Live-channel cards use a **16:9** frame instead (they *are* TV). Do not mix the two ratios in one shelf.

```
┌─────────────┐  3:4 VOD card          ┌──────────────┐ 16:9 LIVE card
│             │                        │              │
│   16:9 art  │  object-fit: contain   │   16:9 art   │ object-fit: cover
│   on canvas │  (never stretch)       │   + LIVE dot │
│─────────────│                        │              │
│ TITLE       │                        └──────────────┘
│ lang · year │
└─────────────┘
```

```html
<article class="w-card">
  <a href="/vod/[slug]" class="w-card-hit">
    <div class="w-card-well">
      <img
        class="w-card-art"
        src="[yt-thumb]"
        alt=""
        width="480" height="360"
        loading="lazy" decoding="async"
      />
      <div class="w-card-scrim"></div>
    </div>
    <h3 class="w-card-title">Kuruluş Osman</h3>
    <p class="w-card-meta">Turkish · series · official embed</p>
  </a>
</article>
```

```css
.w-card {
  container-type: inline-size;
  container-name: card;
  width: 100%;
}
.w-card-hit {
  display: grid;
  gap: 8px;
  color: inherit;
  text-decoration: none;
  border-radius: var(--w-radius-card);
}
.w-card-well {
  position: relative;
  aspect-ratio: 3 / 4;
  background: var(--w-canvas-2);
  border-radius: var(--w-radius-card);
  overflow: hidden;
  isolation: isolate;
}
.w-card-art {
  position: absolute;
  inset-inline: 0;
  top: 12%;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: contain;          /* letterbox, never cover-and-crop faces off */
  background: var(--w-canvas);
}
.w-card-scrim {
  position: absolute;
  inset: 0;
  background: var(--w-grad-scrim);
  pointer-events: none;
}
.w-card-title {
  font-size: var(--w-fs-2);
  font-weight: 600;
  line-height: var(--w-lh-snug);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.w-card-meta {
  font-size: var(--w-fs-0);
  color: var(--w-fg-muted);
}

/* When the card is wide enough (desktop hover preview, title-page related) */
@container card (min-width: 280px) {
  .w-card-title { font-size: var(--w-fs-4); }
}

.w-card-hit:focus-visible {
  outline: none;
  box-shadow: var(--w-elev-focus);
}
.w-card-hit:hover .w-card-well {
  transform: translateY(-2px);
  transition: transform var(--w-dur-2) var(--w-ease-out);
}

/* LIVE variant */
.w-card-live .w-card-well { aspect-ratio: 16 / 9; }
.w-card-live .w-card-art { inset: 0; top: 0; aspect-ratio: auto; height: 100%; object-fit: cover; }

@media (prefers-reduced-motion: reduce) {
  .w-card-hit:hover .w-card-well { transform: none; }
}
```

**Crop rules for the agent that generates well-images**

1. Prefer the official YouTube `hqdefault` / `maxresdefault` already on the title row. Do not scrape a third poster.
2. If the thumb is 4:3 (legacy YT), contain it the same way. The side pillars are canvas, not blur-upscaled pixels. Blur-upscale looks like a pirate skin.
3. If the thumb is a black 16:9 with a tiny title in the middle, still contain. Honesty > prettiness.
4. Never put our wordmark on the art. The art is theirs.
5. Geo-hidden titles are not shown as grey posters. They are omitted.

**RTL.** Meta line flips. The well does not mirror the image.

## 3.2 Shelf row

A labelled horizontal scroller. Peek of the next card is the affordance; a “See all” text button is the overflow.

```html
<section class="w-shelf" aria-labelledby="shelf-tr">
  <header class="w-shelf-head">
    <h2 id="shelf-tr">Turkish series</h2>
    <a href="/lang/tr" class="w-text-btn">See all</a>
  </header>
  <div class="w-shelf-track" tabindex="0">
    <!-- cards -->
  </div>
</section>
```

```css
.w-shelf { display: grid; gap: var(--w-space-3); }
.w-shelf-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-inline: var(--w-space-page-x);
}
.w-shelf-head h2 {
  font-size: var(--w-fs-5);
  font-weight: 600;
  letter-spacing: var(--w-tracking-display);
}
.w-shelf-track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 42%;
  gap: var(--w-gutter-shelf);
  overflow-x: auto;
  padding-inline: var(--w-space-page-x);
  scroll-snap-type: x mandatory;
  scroll-padding-inline: var(--w-space-page-x);
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.w-shelf-track > * { scroll-snap-align: start; }
@media (min-width: 768px) {
  .w-shelf-track { grid-auto-columns: 180px; }
}
@media (min-width: 1280px) {
  .w-shelf-track { grid-auto-columns: 200px; }
}
```

**Rules.** One language or one intent per shelf. Do not build “Because you watched” until we have first-party data. Patron chrome, if booked, is a single quiet line *under the heading*, never a logo on every card.

**RTL.** `scroll-snap` and padding-inline already flip. Test overflow direction in Safari iOS.

## 3.3 Language chip + Home Time

A language chip is a filter and a clock. Gulf apartments run on two clocks: the room (AST, UTC+3) and home (IST, PHT, TRT, WIB, PKT). Showing *home* time next to the language is the one piece of chrome that feels like us and like nobody else.

```html
<button class="w-chip" data-lang="ml" data-tz="Asia/Kolkata">
  <span class="w-chip-name">Malayalam</span>
  <time class="w-chip-clock" datetime="2026-09-10T04:33:00+05:30">04:33 IST</time>
</button>
```

```css
.w-chip {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  min-height: 36px;
  padding: 6px 12px;
  border-radius: var(--w-radius-pill);
  border: 1px solid var(--w-chip-border);
  background: var(--w-chip);
  color: var(--w-fg);
  font-size: var(--w-fs-2);
}
.w-chip-clock {
  font-variant-numeric: tabular-nums;
  font-size: var(--w-fs-0);
  color: var(--w-fg-muted);
  letter-spacing: 0.02em;
}
.w-chip[aria-pressed="true"] {
  border-color: color-mix(in oklch, var(--w-ember) 55%, transparent);
  background: color-mix(in oklch, var(--w-ember) 16%, var(--w-canvas-2));
}
.w-chip:focus-visible { box-shadow: var(--w-elev-focus); outline: none; }
```

```ts
// lib/homeTime.ts — one formatter, reused by chips and hub headers
export const HOME_TZ: Record<string, { tz: string; abbr: string }> = {
  ar: { tz: "Asia/Bahrain", abbr: "AST" },
  en: { tz: "Asia/Bahrain", abbr: "AST" },
  hi: { tz: "Asia/Kolkata", abbr: "IST" },
  ml: { tz: "Asia/Kolkata", abbr: "IST" },
  ta: { tz: "Asia/Kolkata", abbr: "IST" },
  te: { tz: "Asia/Kolkata", abbr: "IST" },
  bn: { tz: "Asia/Kolkata", abbr: "IST" },
  ne: { tz: "Asia/Kolkata", abbr: "IST" },
  si: { tz: "Asia/Kolkata", abbr: "IST" },
  ur: { tz: "Asia/Karachi", abbr: "PKT" },
  pa: { tz: "Asia/Kolkata", abbr: "IST" }, // Punjabi Gulf homes: IST default
  fil: { tz: "Asia/Manila", abbr: "PHT" },
  id: { tz: "Asia/Jakarta", abbr: "WIB" },
  tr: { tz: "Europe/Istanbul", abbr: "TRT" },
};

export function formatHomeTime(lang: string, now = new Date()) {
  const { tz, abbr } = HOME_TZ[lang] ?? HOME_TZ.en;
  const clock = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).format(now);
  return `${clock} ${abbr}`;
}
```

Update once a minute in the hub header; chips can be static at render plus a 60s tick on visible hubs only. Do not tick every chip on the homepage.

**Arabic name of the chip** uses the localization pack (`المالايالامية`, not a transliteration). Clock stays Western digits + Latin abbr — Gulf apps do this and it scans faster.

## 3.4 Hero banner

Two heroes. Do not invent a third.

**A. Marketing landing** (current `/`). Display type + one CTA + optional Announcer. Aurora wash. No catalog posters in the hero — they fight the dog and they date.

**B. Hub / `/new` / festival.** A 16:9 or 2.4:1 field of *type on canvas*, optional motif (crescent, diya, pookalam — see §5), one shelf peeking underneath. No collage of 12 posters. No Announcer.

```css
.w-hero {
  position: relative;
  min-height: min(72vh, 640px);
  padding: var(--w-space-7) var(--w-space-page-x);
  background: var(--w-bg);
  isolation: isolate;
}
.w-hero::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--w-grad-aurora);
  z-index: -1;
  pointer-events: none;
}
.w-hero-kicker {
  display: inline-flex;
  gap: 8px;
  padding: 4px 10px;
  border-radius: var(--w-radius-pill);
  border: 1px solid var(--w-chip-border);
  font-size: var(--w-fs-0);
  color: var(--w-fg-muted);
}
.w-hero h1 {
  font-family: var(--w-font-display);
  font-size: clamp(var(--w-fs-7), 6vw, var(--w-fs-8));
  letter-spacing: var(--w-tracking-display);
  max-width: 16ch;
}
.w-hero .w-gradient-text { /* "No catch." */ }
.w-hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }

.w-btn-primary {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 44px; padding: 0 20px;
  border-radius: var(--w-radius-pill);
  background-image: var(--w-grad-cta);
  color: #fff7ed;
  font-weight: 600;
  font-size: var(--w-fs-3);
  border: 0;
}
.w-btn-primary:hover { filter: brightness(1.06); }
.w-btn-ghost {
  display: inline-flex; align-items: center; justify-content: center;
  min-height: 44px; padding: 0 20px;
  border-radius: var(--w-radius-pill);
  border: 1px solid var(--w-chip-border);
  background: color-mix(in oklch, var(--w-canvas-2) 70%, transparent);
  color: var(--w-fg);
}
```

**Copy cap.** Headline ≤ 8 words. Subhead ≤ 40 words. One primary CTA (“Start watching — it’s free”). Secondary is a destination (“Browse live”), never a second promise.

**Live-site edit this spec authorises.** Retire persistent “Woof! I’m Whisco” bubble from the hero. Move the Announcer drawing down in visual weight (max 280px) or off the first fold on mobile so LCP is the headline, not the PNG.

## 3.5 The one-ad-slot frame

The ad is a guest in a living room. It gets a labelled, padded frame, far from the player. It does not get motion we do not control.

**Placement law**

| Page | Slot |
|---|---|
| Home | After the second shelf, never in the hero, never sticky. |
| Hub | After the first shelf. |
| Title | *Below* the description, with ≥160px clear space under the embed. Never a sibling of the player. |
| Player / watch | **No slot.** |
| Guides | Mid-article, after the second heading. |
| Legal / About | No slot. |

```html
<aside class="w-ad" aria-label="Advertisement">
  <p class="w-ad-label">Advertisement · one per page</p>
  <div class="w-ad-well">
    <!-- AdSense unit. Max width 336 or 300x250 on mobile; 728x90 only ≥1024px. -->
  </div>
</aside>
```

```css
.w-ad {
  margin-inline: var(--w-space-page-x);
  margin-block: var(--w-space-6);
  padding: var(--w-space-3);
  border: 1px solid var(--w-ad-frame);
  border-radius: var(--w-radius-md);
  background: var(--w-bg-elev-1);
  max-width: 728px;
}
.w-ad-label {
  font-size: 11px;
  letter-spacing: var(--w-tracking-caps);
  text-transform: uppercase;
  color: var(--w-fg-faint);
  margin-bottom: 8px;
}
.w-ad-well {
  min-height: 250px;
  display: grid;
  place-items: center;
  background: var(--w-canvas);
  border-radius: 8px;
  overflow: hidden;
}
.w-ad-well iframe { max-width: 100%; }
```

Arabic label: `إعلان · واحد في الصفحة`.

**Do not** auto-refresh the unit. Do not sticky it. Do not skin AdSense with our gradient (policy + taste). If the unit is empty (unfilled), collapse the `<aside>` — do not leave a 250px hole.

## 3.6 Skeleton loaders

No spinner in the middle of a black page. The shelf shape appears first.

```html
<div class="w-skel-card" aria-hidden="true">
  <div class="w-skel-well"></div>
  <div class="w-skel-line"></div>
  <div class="w-skel-line w-skel-line--short"></div>
</div>
```

```css
.w-skel-well,
.w-skel-line {
  position: relative;
  overflow: hidden;
  background: var(--w-canvas-2);
  border-radius: 8px;
}
.w-skel-well { aspect-ratio: 3 / 4; }
.w-skel-line { height: 12px; margin-top: 8px; }
.w-skel-line--short { width: 62%; }
.w-skel-well::after,
.w-skel-line::after {
  content: "";
  position: absolute; inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, color-mix(in oklch, var(--w-ink) 8%, transparent), transparent);
  animation: w-shimmer var(--w-dur-4) var(--w-ease-in-out) infinite;
}
@keyframes w-shimmer { to { transform: translateX(100%); } }

@media (prefers-reduced-motion: reduce) {
  .w-skel-well::after, .w-skel-line::after { animation: none; }
}
```

**Rule.** Skeleton count = the number of cards the shelf will actually show on that breakpoint. Do not paint twelve ghosts on a phone that will show 2.2.

## 3.7 Empty states (the mascot earns his keep here)

Three empties. Same layout: 120px depiction + one sentence + one action.

| State | Depiction | Copy EN | Copy AR | Action |
|---|---|---|---|---|
| My List empty | Photo bust, quiet | “Your list lives on this device. Add something from On Demand.” | localization pack | Button → `/vod` |
| Search zero | Announcer, seated | “Nothing matches. Try a title, a language, or a channel name.” | pack | Focus the input |
| Channel offline | Announcer, no headphones | “This channel is hiding until it’s healthy. We check every six hours.” | pack | “Try another channel” |
| Geo hide (page-level) | None. Type only. | “Not available in your country. We are not a VPN.” | pack | Home |
| 404 | Announcer | “That page is not a title we have.” | pack | Home |

```css
.w-empty {
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 12px;
  padding: 48px 24px;
}
.w-empty img { width: 120px; height: 120px; object-fit: cover; border-radius: 24px; }
.w-empty p { color: var(--w-fg-muted); max-width: 36ch; }
```

No speech bubble on geo or 404. Those are serious.

## 3.8 Nav, player frame, toast (short)

**Nav.** Sticky, 56px mobile / 64px desktop, `background: color-mix(in oklch, var(--w-canvas) 88%, transparent)` + `backdrop-filter: blur(12px)` with a solid fallback. Order: Mark · Live · On Demand · New · Search. Overflow: Guides, Languages, About, Legal. **No Sign in.** CTA on desktop only: `Start watching — it’s free` if the user is on marketing; omit on catalog.

**Player frame.** 16:9 well, 0 radius on mobile edge-to-edge, 12px on desktop. No Ember border — it looks like a casino. Buffering uses the skeleton shimmer, not a branded spinner over someone else’s YouTube chrome.

**Toast.** 12px radius, canvas-3, ink text, 4.5s, one line. Success does not use Bloom. Errors use danger text, not a red fill.

---

# 4. The ‘latest tech’ layer

Use modern CSS where it removes JavaScript we would otherwise have to maintain. Always degrade. Mid-range Android (a Redmi / Galaxy A / Tecno in a labour-camp or studio apartment, Chrome 2–3 versions behind) is the design target, not an M4 MacBook.

## 4.1 What we adopt

### Container queries
Already in the card spec. Use them for type size and meta visibility. Do not use them to hide whole shelves (SEO + CLS).

### View Transitions API
Only for same-origin catalog → title. Name the poster well.

```css
.w-card-well { view-transition-name: poster; }
::view-transition-old(poster),
::view-transition-new(poster) {
  animation-duration: var(--w-dur-3);
  animation-timing-function: var(--w-ease-snap);
}
```

```js
if (document.startViewTransition) {
  document.startViewTransition(() => router.push(href));
} else {
  router.push(href);
}
```

Degrade: instant navigation. Never block on the API.

### Scroll-driven animation
One use: the hub hero motif fades 100% → 40% over the first 24vh. No scroll-jacking. No pinned shelves.

```css
@supports (animation-timeline: scroll()) {
  .w-hero-motif {
    animation: w-hero-fade linear both;
    animation-timeline: scroll();
    animation-range: 0 24vh;
  }
  @keyframes w-hero-fade { to { opacity: 0.4; } }
}
```

Degrade: static motif.

### `color-mix` + OKLCH
Tokens already do this. Hover states are mixes, not extra hexes. Degrade block is in §2.1.

### `content-visibility: auto` on offscreen shelves
```css
.w-shelf { content-visibility: auto; contain-intrinsic-size: 0 320px; }
```
Measure CLS before leaving this on. If a shelf jumps, remove it.

### Subgrid (desktop title page)
Title + meta + actions share a column with the related shelf. Progressive. Flex fallback.

## 4.2 What we refuse

| Refuse | Why |
|---|---|
| 3D CSS / WebGL hero | Mid-range GPUs + heat + battery. Looks like every 2024 IPTV skin. |
| Scroll-jacked horizontal sliders | Breaks RTL and TalkBack. |
| Cursor-follow aurora | No cursor on our audience’s primary device. |
| Autoplaying muted trailers in cards | We usually do not have the licence; data cost; App Review. |
| Heavy Framer Motion on every card | JS budget. CSS hover is enough. |
| Theme toggle | §6. |

## 4.3 Performance budget

Audience hardware: mid-range Android, often on a GCC prepaid plan, often in the evening on hotel/apartment Wi-Fi that is worse than the brochure. Budget is a rule, not a hope.

| Metric | Budget | How we hit it |
|---|---|---|
| LCP | **< 2.5s** on a mid-range Android on 4G | LCP element = H1 or first poster *well*, never the Announcer PNG, never a webfont. Preload the first well image only. |
| INP | < 200ms | No JS on hover. Chips are buttons. |
| CLS | < 0.05 | Aspect-ratio on every well. Ad well has min-height *or* collapses when empty — pick one per page and keep it. |
| JS shipped (route) | ≤ 180 kB gzip catalog, ≤ 90 kB marketing | Next.js app router. No analytics SDK in apps v1. Vercel Web Analytics is the site script, cookieless. |
| Fonts | ≤ 2 files on first paint | Geist latin + Plex Arabic. The rest swap later. |
| Images | First fold ≤ 2 raster images | Hero Announcer is an SVG or a 280px WebP. Posters `loading="lazy"` except the first two in shelf one. |
| Third parties | AdSense on pages that have the slot, after first paint | Never on `/watch`. Never in apps v1. |

**Image pipeline.** YouTube thumbs are hotlinked only when the embed page already would; prefer a cached WebP on our domain for LCP candidates. `sizes="(max-width: 768px) 42vw, 200px"`.

**LCP kill-list for the current homepage.** The Announcer PNG + aurora + webfont + install banner is why the first fold feels heavy. Ranked fix: (1) make H1 the LCP, (2) SVG Announcer or 40kB WebP, (3) defer the install banner until `requestIdleCallback`, (4) do not load the sunglasses-dog photographic strip under the fold as a giant JPEG.

---

# 5. Poster / marketing asset system

All campaign art is **SVG with slots**. The agent fills slots from catalog JSON and writes a PNG via `resvg` / Satori / Playwright only when a raster is required (WhatsApp). No Figma file to drift.

Shared grammar:

- Field = `#0a0a0f`
- One Ember→Bloom hairline or wordmark `TV`
- Type in Geist / IBM Plex Sans Arabic
- Photo Whisco only as a small circular lock-up in the footer, never as the subject of a festival poster
- Announcer never on a festival poster
- No third-party title art composited into the poster unless that title is the *only* subject and the art is already on our title page (deep-link). Weekly-drop posters use **four type-only title lines**, not four stolen thumbs. (Originals bible: no ripped stills.)

## 5.1 Slot vocabulary

```ts
type PosterSlots = {
  kicker: string;          // "This week on Whisco" / "أمسيات وسکو"
  title: string;           // main line
  lines: string[];         // up to 4 titles or 3 beats
  footer: string;          // "Free. Legal. No signup.  whisco.tv"
  lang?: string;           // ISO for dir + home clock
  clock?: string;          // "21:40 IST"
  patron?: { name: string; line: string }; // quiet, optional
  motif?: "none" | "ramadan" | "eid" | "onam" | "diwali" | "pasko" | "pongal";
  format: "landscape" | "status"; // 16:9 or 9:16
};
```

## 5.2 Weekly-drop poster — 16:9

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080" role="img">
  <rect width="1920" height="1080" fill="#0a0a0f"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f97316"/><stop offset="1" stop-color="#db2777"/>
    </linearGradient>
    <radialGradient id="a" cx="8%" cy="0%" r="60%">
      <stop offset="0" stop-color="#6b21a8" stop-opacity="0.35"/>
      <stop offset="1" stop-color="#0a0a0f" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#a)"/>
  <rect x="0" y="0" width="8" height="1080" fill="url(#g)"/>

  <text x="96" y="160" fill="#a1a1aa" font-family="Geist, Inter, sans-serif"
        font-size="28" letter-spacing="4">THIS WEEK ON WHISCO</text>
  <text x="96" y="250" fill="#f5f5f7" font-family="Geist, Inter, sans-serif"
        font-size="72" font-weight="600" letter-spacing="-1.5">Four that actually play.</text>

  <!-- slots: title lines. Agent replaces tspan text. -->
  <text x="96" y="420" fill="#f5f5f7" font-family="Geist, Inter, sans-serif" font-size="40">
    <tspan fill="#f97316">01  </tspan>{{LINE_1}}
  </text>
  <text x="96" y="500" fill="#f5f5f7" font-family="Geist, Inter, sans-serif" font-size="40">
    <tspan fill="#f97316">02  </tspan>{{LINE_2}}
  </text>
  <text x="96" y="580" fill="#f5f5f7" font-family="Geist, Inter, sans-serif" font-size="40">
    <tspan fill="#f97316">03  </tspan>{{LINE_3}}
  </text>
  <text x="96" y="660" fill="#f5f5f7" font-family="Geist, Inter, sans-serif" font-size="40">
    <tspan fill="#f97316">04  </tspan>{{LINE_4}}
  </text>

  <text x="96" y="980" fill="#a1a1aa" font-family="Geist, Inter, sans-serif" font-size="28">
    Free. Legal. No signup.   whisco.tv
  </text>
  <text x="1824" y="980" text-anchor="end" fill="url(#g)"
        font-family="Geist, Inter, sans-serif" font-size="28" font-weight="700"
        letter-spacing="2">TV</text>
</svg>
```

Agent rules: pull four titles from `/new` that passed the morning health check. Language-mix the four if the week is mixed; otherwise one-language and change the kicker (`Malayalam this week`). Never print a count we have not recounted.

## 5.3 Festival motif — keep it quiet

Motifs are **geometry**, not clip-art people, not mosques as logos, not gods. One shape, Ember at 25% opacity, corner or header rule.

```svg
<!-- motif fragments; include inside any poster <defs>+use -->
<!-- RAMADAN / EID: single crescent, no star cluster, no lantern stock -->
<path id="motif-crescent" transform="translate(1680 120) scale(2.2)"
      fill="#f97316" fill-opacity="0.22"
      d="M32 4a28 28 0 1 0 0 56 22 22 0 1 1 0-56z"/>

<!-- DIWALI: three stacked arcs = a diya bowl, no flame bitmap -->
<g id="motif-diya" transform="translate(1660 120)" fill="none" stroke="#f97316" stroke-opacity="0.35" stroke-width="6">
  <path d="M20 80c40 28 140 28 180 0"/>
  <path d="M40 80c30-36 90-36 140 0"/>
  <path d="M110 28c0 18 8 28 8 28s8-10 8-28-16-20-16 0z"/>
</g>

<!-- ONAM: four concentric diamonds = a pookalam hint -->
<g id="motif-onam" transform="translate(1680 140)" fill="none" stroke="#db2777" stroke-opacity="0.32" stroke-width="5">
  <rect x="0" y="40" width="80" height="80" transform="rotate(45 40 80)"/>
  <rect x="16" y="56" width="48" height="48" transform="rotate(45 40 80)"/>
</g>
```

**Copy tone for festivals** is already in the marketing playbook: homesickness is real; do not write “celebrate like you’re in Mumbai.” The poster headline is availability (“Hindi films that play in this apartment”) plus the festival name as kicker, not as theology.

Dates: print a festival name only after the relevant committee / calendar confirmation. Ramadan 2027 expected first fast Mon 8 Feb (Umm al-Qura); Eid expected 9–10 Mar. Do not lock those numbers into a poster template.

## 5.4 Hub-sponsor / patronage lock-up

Quiet. PBS shape. Never on the player. Never on a title poster.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 80">
  <rect width="960" height="80" fill="#0a0a0f"/>
  <text x="0" y="48" fill="#a1a1aa" font-family="Geist, Inter, sans-serif" font-size="22">
    This Malayalam shelf is made possible by
    <tspan fill="#f5f5f7" font-weight="600"> {{PATRON_NAME}}</tspan>
    <tspan fill="#71717a">  ·  {{QUIET_LINE}}</tspan>
  </text>
</svg>
```

Arabic preamble from the pack: `يُقدَّم ركن المالايالامية بدعم من…`

**Refuse.** “Presented by” next to Play. Partner logo larger than 20px cap-height. Partner brand colour flooding our canvas. QR codes.

## 5.5 WhatsApp Status — 9:16

Safe area: top 96 and bottom 160 are eaten by WhatsApp chrome. Keep type in the middle third.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1920">
  <rect width="1080" height="1920" fill="#0a0a0f"/>
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#f97316"/><stop offset="1" stop-color="#db2777"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="1080" height="8" fill="url(#g)"/>

  <text x="80" y="280" fill="#a1a1aa" font-family="Geist, Inter, sans-serif"
        font-size="28" letter-spacing="3">TONIGHT</text>
  <text x="80" y="400" fill="#f5f5f7" font-family="Geist, Inter, sans-serif"
        font-size="64" font-weight="600">{{TITLE}}</text>
  <text x="80" y="490" fill="#a1a1aa" font-family="Geist, Inter, sans-serif"
        font-size="32">{{CLOCK}}  ·  {{LANG}}</text>

  <text x="80" y="1680" fill="#f5f5f7" font-family="Geist, Inter, sans-serif"
        font-size="32">whisco.tv</text>
  <text x="80" y="1736" fill="#71717a" font-family="Geist, Inter, sans-serif"
        font-size="24">Free. Legal. No signup.</text>
</svg>
```

Human publishes. The agent renders the PNG into the Sunday packet, not into the Channel.

## 5.6 Generation note for the agent

A single script is enough:

1. Read catalog row(s) + `PosterSlots`.
2. Fill the SVG string.
3. Write `public/og/[slug].svg` (inlined on site) and, if WhatsApp needs raster, `public/status/[date].png` at 1080×1920 via Satori or Playwright. Cap PNG at 400 kB.
4. Do not commit fifty festival variants “just in case.” Generate the week they ship.

---

# 6. Dark-only doctrine

**Ship dark only on every watch surface.** Do not build a light theme. Do not honour `prefers-color-scheme: light` for the product chrome. Honour it only if we ever ship a printable legal page.

### The case for dark-only

1. **The room is dark.** Primary session is evening, after shift or after tarawih, phone or a mid-range Android on a coffee table, often with the overhead off. A white app in that room is a torch.
2. **The incumbent visual language we are *not* copying still sits on black.** Pirate skins, YouTube embeds, Shahid after sunset — the living room already trained the eye on a dark bezel. Our job is to be the *calmer* dark, not a different day/night pair.
3. **Our art is dark-field art.** Letterboxed YouTube thumbs, Ember→Bloom, Photo Whisco on beige, aurora. A light canvas turns every 16:9 thumb into a dirty stamp and turns Ember into a children’s-app orange.
4. **The embed is not ours.** YouTube’s chrome is dark. A light Whisco frame around a dark embed is a halo of unpaid white.
5. **One engineer.** A second theme doubles tokens, doubles empty-state drawings, doubles posters, doubles QA on cheap Androids that already mishandle `color-scheme`. That work does not open G1–G4.
6. **Ads.** A light page next to AdSense display is a brighter invitation to look like a content-farm. Dark + one labelled slot is the honest version of the same unit.
7. **OLED / AMOLED.** Common on the devices that can actually play a stream without melting. Black pixels are free.

### The case against (and why it loses)

- Midday outdoor use, notifications shade. True, and rare for a 40-minute episode. Contrast-boost (`prefers-contrast: more`) raises ink-dim; it does not flip the canvas.
- “Accessibility means light mode.” Contrast is the accessibility feature. Ink on `#0a0a0f` is 18:1. A poorly-built light theme with Ember buttons on white fails more often than our dark.
- Store screenshots in a light App Store web UI. Use the marketing landing aurora; do not invent a light catalog.

### Allowed exceptions

| Exception | Treatment |
|---|---|
| Invoices, CR papers, partner one-pagers | White paper. Separate static templates. Not `data-theme`. |
| Email to a patron | White or client-default. |
| Legal PDF | White. |
| Forced inverse in a screenshot tool | Not our problem. |

`color-scheme: dark` is set on `:root` so form controls, scrollbars, and the embed’s expected ambient stay dark.

---

# 7. Impact / effort backlog

Everything below is sized for one engineer + the existing AI agent. Do not start a row until the row above it in the same band is done — except items marked *parallel*.

Impact: **H** changes recognition or performance for everyone · **M** tightens a surface · **L** polish.  
Effort: **S** < half a day · **M** 1–2 days · **L** a week of evenings.

### Band A — ship this week (tokens + honesty)

| # | Item | I | E | Notes |
|---|---|---|---|---|
| A1 | Land `tokens.css` + Tailwind extend + `class="dark"` on `<html>` | H | S | Unblocks every later row. |
| A2 | Replace stretched thumbs with the 3:4 letterbox well | H | M | The catalog will look like us instead of a scraped grid. |
| A3 | Retire primary-nav Sign in. Move account, if any, to overflow. | H | S | Doctrine. Live-site drift. |
| A4 | Ad frame component + placement law on title pages | H | S | Premium-looking slot; AdSense review optics. |
| A5 | Skeleton shelves instead of a centred spinner | M | S | Perceived speed. |
| A6 | LCP pass on `/`: H1 as LCP, compress Announcer, defer install banner | H | S | Budget in §4.3. |

### Band B — the room feels like a room

| # | Item | I | E | Notes |
|---|---|---|---|---|
| B1 | Language chips + Home Time on hubs (not every homepage chip ticking) | H | M | The distinctive chrome. |
| B2 | Empty states with Photo / Announcer split from §3.7 | M | S | Uses assets we already have. |
| B3 | Wordmark SVG inline in nav (gradient `TV`) | M | S | Sharper than a raster at 2×. |
| B4 | Patron quiet-line component under shelf heads | M | S | Needed before any paid hub. |
| B5 | View-transition on card → title | L | S | Degrades to push. |
| B6 | Hero: Announcer demoted; “Woof” bubble off the first fold | M | S | Press-kit alignment. |

### Band C — assets the agent can emit

| # | Item | I | E | Notes |
|---|---|---|---|---|
| C1 | Weekly-drop SVG renderer from `/new` | H | M | Sunday packet input. |
| C2 | 9:16 Status renderer | M | S | Same slots. |
| C3 | Festival motif fragments + one Ramadan 2027 master | M | S | Do not pre-draw Onam/Diwali until the month. |
| C4 | OG image for title pages (type + well, no stolen still) | M | M | Share cards already exist; bring them onto tokens. |

### Band D — later, after gates

| # | Item | I | E | Notes |
|---|---|---|---|---|
| D1 | Scroll-driven hero fade | L | S | After A6 so we do not animate a slow LCP. |
| D2 | Arabic `dir` full pass on every component here | H | M | Parallel with the localization pack, not instead of it. |
| D3 | Redraw Announcer once, lock the file, delete unofficial variants | L | M | Only if the current cartoon fights Photo Whisco on store screenshots. |
| D4 | Light mode | — | — | **Not scheduled.** Reopen only if a distributor contract requires it. |
| D5 | Motion library, 3D, cursor aurora | — | — | Refused. |

**Done definition for v1 of this system.** A1–A6 and B1–B3 are in production. Posters generate from C1. No Sign in in the primary nav. No stretched thumbs. No light theme. The dog appears where §1.2 says, and nowhere else.

---

## Appendix A — live-site audit, 10 Sep 2026

Recorded so the next pass does not argue with a ghost.

- Canvas near-black, header solid `#000`, wordmark `Whisco` + gradient `TV`, circular real-dog icon. **Keep.**
- Hero aurora purple/amber. **Keep as ambient, not as a fill.**
- Cartoon Announcer with headphones + “Woof! I’m Whisco 🐾”. **Constrain** to §1.2.B.
- Primary CTA pill Ember→Bloom. **Keep.**
- Nav includes Sign in + “Start Watching Free.” **Retire Sign in from primary.**
- Body copy claims “no account” and later “Free Profiles / 6 profiles.” **Contradiction. Design to the doctrine: no account required; on-device list.**
- Marketing lines “Life’s better at full speed”, “you won’t find anywhere else.” **Rewrite toward availability and honesty when that page is next touched.**
- Install banner bottom-right. **Defer for LCP; keep the pattern.**
- Catalog numbers on the landing (581+/585+, 16,878+) move. Design does not freeze them in SVG templates.

## Appendix B — file map for the engineer

```
app/styles/tokens.css          ← §2
tailwind.config.ts             ← §2.4
components/card/PosterCard.tsx ← §3.1
components/shelf/Shelf.tsx     ← §3.2
components/chips/LangChip.tsx  ← §3.3
components/ad/AdFrame.tsx      ← §3.5
components/empty/EmptyState.tsx← §3.7
lib/homeTime.ts                ← §3.3
lib/posters/weekly.svg.ts      ← §5.2
lib/posters/status.svg.ts      ← §5.5
public/brand/wordmark.svg
public/brand/wordmark-ar.svg
public/brand/announcer.svg     ← lock the one drawing
public/brand/whisco-face.webp  ← from whisco-refs
```

Do not add a `ThemeProvider`.

---

*End of spec. If a future screen cannot be described with these tokens, the screen is wrong — not the tokens.*
