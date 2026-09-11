# DESIGN REFRESH — GOVERNANCE + IMPLEMENTATION MAP
*Agent execution plan for Grok's "Design Vision + Mascot 2.0" pack · 11 Sep 2026*

## 1. Governance decisions (recorded from founder message, 11 Sep 2026)

| Decision | Status |
|---|---|
| **Grok = Design Lead.** Grok owns creative direction: visual language, mascot doctrine, motion grammar, page concepts. | ✅ ADOPTED (founder: "grok is officially in charge of design") |
| Pipeline unchanged: Grok designs → agent typechecks/verifies UNTOUCHED → founder approves previews → agent ships. Grok remains advisor-not-executor per Operating Rules v2; "in charge of design" = design authority, not deploy authority. | ✅ Standing |
| **Illustrated Host accepted as depiction C** (Design System v1.0 amendment — v1.0 allowed only Photo + Announcer). Grok's §0 required explicit founder acceptance; founder's approval message constitutes it. Rails: C never on title posters, store catalog screenshots, ad slots, or legal pages. | ✅ ADOPTED |
| Grok's kill-list supersedes earlier agent concepts where they conflict: persistent chatty hero chrome OUT ("one greeting, then quiet"), full-palette time-of-day retint OUT (subtle ember multiplier IN), purple fills OUT (aurora wash only), sunglasses/costume props OUT. Agent's Concept 1/2 demos remain as prototypes; surviving elements are the ones Grok ranked (bias light, aurora, zapper dial, empty-state host). | ✅ ADOPTED |
| Ship window: staging only until 20 Sep (store-review freeze 16–19). Nothing in the pack is a production PR before then. | ✅ Standing |

## 2. Two-week sprint (Sept 20 – Oct 3) — Grok ranks 1–8

| # | Item | Effort | Agent notes |
|---|---|---|---|
| 1 | **Bias light** home + title pages | S | `src/lib/biasLight.ts` per Grok sketch; sample on focus/route-change only, ember 8% fallback |
| 2 | **Letterbox thumbs** (Band A carry-over) | S | already queued — merge into this sprint |
| 3 | **Empty-state Host** (lock portrait + 4 static WebPs: rest/hope/search/care) | S | `WhiscoHost.tsx` image-fallback path first; Rive later; copy deck §8 keys |
| 4 | **Aurora ember→bloom + Maghrib multiplier** | S | `emberMul()` per Grok; civil sunset, Asia/Bahrain default |
| 5 | **OG + hero swap** to generated boards | S | BLOCKED on assets (see §4) |
| 6 | **Collection covers** ×6 shelves | S–M | BLOCKED on assets; type overlay per §3.2 recipe, native-script labels |
| 7 | **Kind Zapper v0** `/surf` | M | healthy-only channels from existing health data; CSS wipe §4.3; RTL dial side |
| 8 | **Majlis Mode v0** `/tonight` | M | builds on Tonight on Whisco module; may slip |

Quarter items (9–14): View Transitions, Rive companion, Letters Home, logo sting + store preview (ONLY after iOS approval), 13-language captions, scroll About.
Killed for 90 days: WebGL globe, photoreal talking dog, public LoRA, costume packs, mascot-on-ads/posters, "watching now" maps. Kids Night Light parked until stores public.

## 3. QA flags for Grok's pack (agent review — pack otherwise passes)

1. **Arabic copy bug:** the pack writes Whisco as «وسکو» using **Persian keheh ک (U+06A9)**, not Arabic ك — appears in §2.3 and §8. Must be corrected (e.g. «ويسكو») and the whole AR column human-reviewed before any AR string ships. Flagged, not fixed — copy is design-lead + human territory.
2. `useIdleSleep` sketch has a bug: timeout never re-arms after wake (`on` only sets false; `sleep` in dep array re-runs effect but pointerdown listener leak on repeated fires is possible). Agent will fix in implementation — noted so the shipped version differs from the sketch deliberately.
3. View Transitions + scroll-driven animations correctly marked NOT VERIFIED — agent will feature-detect and measure on store-baseline Safari before rank-9 lands.

## 4. ASSETS MISSING — request to founder

The pack references **14+ image files that live in Grok's workspace**, not ours:
`mascot/00-lock-portrait.jpg` (CANONICAL — most important), `01-character-sheet.jpg` … `10-announcer-headphones.jpg`, `seasonal/{ramadan-iftar,eid-dates,compound-cricket}.jpg`, `heroes/{hero-desktop-living-room,hero-mobile,og-share-card}.jpg`, `covers/{turkish-dizi,bollywood,pakistani-drama,arabic-classics,filipino-hits,kids}.jpg`.

**Founder action:** download from the Grok workspace and upload here. Without them, sprint items 5–6 are blocked and item 3 falls back to agent-generated WebPs using the §2.5 style recipe (acceptable per pack: "regenerate without soup", reference order honoured). Real-dog reference photos (`whisco-marble.jpg`, `whisco-sit-front.jpg`, `whisco-outdoor.jpg`) also requested — they are the face lock source.

## 5. Standing rails carried into every design PR

Feel words in every PR description: **Warm. Quiet. Household. Lamp-lit. Honest. RTL-first. Fast on a mid-range Android.**
Hard: catalog reads via `cached.ts` ≥900s · no new analytics SDK (Data Not Collected holds through v1.1) · companion never the LCP image · no Rive WASM on title/player routes · `prefers-reduced-motion` = static · one dog face (composite lock head if generation drifts).
