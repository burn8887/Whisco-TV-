# PROMPT FOR GROK — WHISCO TV VISUAL REFRESH: CREATIVE DIRECTOR BRIEF
*SELF-CONTAINED — everything you need is in this one message. Nothing else will be pasted.*

---

## WHO YOU ARE FOR THIS TASK

You are the Creative Director + Motion Design Lead for Whisco TV. This is a **free-rein creative engagement**: we are explicitly asking you to go further than we have, propose things we haven't thought of, and bring 2025–2026-grade design technology to a product that is currently functional but visually utilitarian. Surprise us. The only walls are the brand rails below — inside them, the canvas is yours.

## WHAT WHISCO TV IS (context you need)

- **Product:** 100% free, ad-supported (FAST/AVOD) streaming — live TV channels + on-demand movies & series. Web app at whisco.tv (Next.js), iOS and Android apps in final store review.
- **Audience:** Gulf households — nationals AND expats. 13 languages (Arabic, Hindi, Urdu, Malayalam, Tamil, Telugu, Bengali, Filipino/Tagalog, Indonesian, Nepali, Sinhala, Turkish, English). Multi-generational: grandmothers watching Turkish dizi, kids watching cartoons, dads watching news from home. TV from home, for people far from home. Emotional core: **warmth, belonging, family evenings**.
- **The mascot — this is the heart of the brand:** Whisco is a REAL gold-tan Shih Tzu (the founder's dog; renamed from "Whiskey" to stay family-friendly). He is not a logo decoration — he is the host. Founder's law: **"the dog talks."** Whisco has a warm, playful, slightly cheeky voice and appears across the product (favicon, About page, empty states). We want him to become a world-class mascot on the level of Duolingo's owl — animated, expressive, alive.

## CURRENT VISUAL STATE (honest)

- Dark theme, works, but flat: standard cards, stretched YouTube thumbnails as posters (a letterbox fix is already queued), minimal motion, no signature visual moment anywhere. The site looks like a competent template. Nothing makes you feel anything yet.
- Shipped bright spots: "Home Time" (origin-city clocks per language on the Live page), "Tonight on Whisco" picks module, share cards. Good bones, no magic.

## BRAND RAILS (hard, non-negotiable)

1. **Dark-only.** Base #0a0a0f. Signature gradient: orange **#f97316 → pink #db2777**. Premium/minimal, never busy, never neon-casino. Think Apple TV+ ambience meets warm Gulf living room.
2. **Whisco the Shih Tzu is central and he TALKS** — warm, family-friendly, never sarcastic or mean. Never "kill the mascot," never make him cool-aloof. He's the family dog who runs a TV station.
3. Family-friendly everything. Multi-script by design: every concept must work in Arabic (RTL!), Devanagari, Tamil, Sinhala scripts — not just Latin.
4. **Performance is a feature:** most of our audience is on mid-range Android phones and modest connections. Every motion/graphic concept needs a graceful degradation story (prefers-reduced-motion, low-GPU fallback). LCP must not regress.
5. Max 1 ad per page, never near the player — design must never look ad-cluttered.
6. No dependence on heavyweight paid libraries without a strong case. Open tech preferred: CSS/SVG animation, Canvas/WebGL shaders, Lottie, Rive, View Transitions API, scroll-driven animations.

## OUR HIGH-TECH AMBITIONS (the direction — extend it)

We want Whisco TV to *feel* like advanced technology wrapped in warmth:

- **A living mascot:** rigged, animated Whisco (Rive/Lottie/SVG) — blinks, reacts, sleeps when you're idle, celebrates when you add to My List, greets you by time of day in your language. Mascot as UI companion, not sticker.
- **Ambient/live graphics:** aurora-gradient atmospheres, ambient light spill from posters and the player (bias-lighting effect), time-of-day-aware theming (maghrib warmth at sunset, cooler tones late night), animated Gulf skyline / majlis motifs, Ramadan & Eid live themes.
- **Modern interaction physics:** magnetic hover, 3D card tilt, spring transitions, shared-element page transitions (View Transitions API), scroll-driven storytelling on marketing pages, bento-grid layouts, glassmorphism done tastefully on dark.
- **Generative & AI-assisted art direction:** a consistent AI-image pipeline for hero art, collection covers, seasonal posters, Whisco scene packs (Whisco in a cinema, Whisco with iftar tea, Whisco with a cricket bat) — one recognizable illustrated style, not random AI soup.
- **Video/motion identity:** logo sting, channel-surf transition, loading personality, app-store preview videos, social-format teasers (9:16).

## YOUR DELIVERABLES (in order)

1. **Design Vision Memo (1 page):** what Whisco TV should FEEL like in one sentence, the 3 signature visual moments you'd build first, and what you'd kill from the current approach.
2. **Whisco Mascot 2.0 pack:**
   - Character sheet direction: proportions, expression range (happy/sleepy/excited/watching/eating/waving), pose library for real product moments (empty My List, error page, loading, search-no-results, welcome, Ramadan).
   - A set of **generated images**: Whisco in 8–10 product-usable scenes, consistent style. State the style recipe (lighting, palette, line quality) so we can regenerate consistently. Square + wide + tall variants where relevant.
   - Rigged-animation plan: which tool (Rive vs Lottie vs pure SVG/CSS), which loops (blink, breathe, tail wag, sleep, wave), file-size budget, and how it degrades on low-end devices.
3. **Image pack for surfaces** (generate what you can, prompt-recipes for the rest): homepage hero art, 6 collection covers (Turkish Dizi, Bollywood, Pakistani Drama, Arabic Classics, Filipino Hits, Kids), seasonal variants (Ramadan, Eid, National Days), OG/share card background. Sizes: hero 1920×1080 + 828×1792 mobile, covers 1200×675, OG 1200×630.
4. **Video & motion concepts:** storyboard (frame-by-frame text is fine) for (a) a 5-second logo sting with Whisco, (b) a 15–30s app-store preview video, (c) a channel-zapping transition. Include music/sfx direction.
5. **Live & interactive graphics concepts — minimum 5, with implementation sketches** (CSS/SVG/Canvas/WebGL/Rive, rough code welcome): e.g. ambient player glow, aurora hero, time-of-day theming engine, live "now playing across the Gulf" map/ticker, interactive language-picker globe, scroll-driven "how Whisco works" story page. Bring ideas we haven't listed.
6. **Fresh page concepts — 3 "wow" pages** we don't have: your call entirely. (Examples of the *kind* of thing: a cinematic "Tonight" lean-back page; a kids' mode hosted by Whisco; a "channel surf" full-screen zapper with dial UX — but propose YOUR ideas, don't just take these.)
7. **Prioritized shortlist:** rank everything you proposed by (impact × feasibility), tag each item S/M/L effort, flag what a solo founder + AI-agent team can realistically ship in 2 weeks vs a quarter.

## FORMAT & PIPELINE

- Deliver as structured markdown. Code sketches in fenced blocks (TypeScript/React/CSS preferred — the site is Next.js + Tailwind).
- Generate images directly where you can; otherwise give exact reusable prompt recipes (model-agnostic wording).
- Our standing pipeline: you deliver → our agent typechecks/verifies UNTOUCHED → only what passes review ships. A site freeze is in effect Sept 16–19 (store review window), so everything lands in a staging branch and ships after Sept 20. Design freely — implementation timing is our problem, not yours.
- Honesty rules apply: mark estimates [EST], say "NOT VERIFIED" instead of inventing browser-support or perf claims.

**Go. Free rein. Make the dog a star.**
