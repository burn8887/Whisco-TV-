# Screenshots — the size error, and the four old shots that must not ship

**2026-09-18. Founder hit a red "dimensions are wrong" banner in Media Manager while loading the build-7
screenshots. Two separate problems, both now diagnosed from Apple's own API and Apple's specification table.**

---

## Problem 1 — his files are in the wrong slot, not the wrong size

The four files are **1179 × 2556**. Per Apple's screenshot specification
(`developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications`):

| Slot | Accepted portrait sizes |
|---|---|
| 6.9" Display | 1260×2736 · **1290×2796** · 1320×2868 |
| 6.3" Display | **1179×2556** · 1206×2622 |
| 6.1" Display | 1170×2532 · 1125×2436 · 1080×2340 |
| 5.5" Display | 1242×2208 |
| 4.7" Display | 750×1334 |

**1179 × 2556 is the exact accepted size for the 6.3" slot.** He dragged the files into the **6.1"** slot, whose
accepted list is 1170×2532 / 1125×2436 / 1080×2340 — hence the banner listing exactly those numbers.

Nothing is wrong with the screenshots. They are in the wrong box.

**Fix:** use the 6.3" slot with the files untouched. Optionally also fill 6.9" (that slot has to be replaced
anyway — see below). A 1170×2532 set has also been produced as a spare for the 6.1" slot.

## Problem 2 — the 6.9" slot currently holds four shots that contradict the app

Read from the API (`/v1/appStoreVersions/<ver>/appStoreVersionLocalizations` → `appScreenshotSets`), the only
populated set on version 1.0 is **APP_IPHONE_67**, four shots at 1290×2796, filenames `IMG-20260902-WA000*.png`.
Downloaded and reviewed. They show:

- **"655 channels"** with filters Arabic 150 / Hindi 138 / English 75
- **"Search 14,567+ titles..."**
- Bahrain TV (720p) [Not 24/7] · Bahrain International · Bahrain Quran · Bahrain Sports 1 · Bahrain Sports 2 · ATN Bangla
- DW English · France 24 English · France 24 Arabic · France 24 French · Sky News Arabia
- Game Shows · Malayalam Cinema 672 · Bangla Natok & Cinema 278
- One shot is an empty "My List"

**None of those channels or shelves exist in build 7.** The app's own home screen reads "8+ live channels ·
8+ free titles". The largest provided set is what App Store visitors see and it is the set Apple treats as the
required one (6.5" is only required when 6.9" is absent). Leaving those four shots in place hands the reviewer the
same mismatch that has been removed this week from the listing, the `/about` page, the `/guides` pages and the API.

**They must be deleted, not added to.**

## Replacement set

Four screens, taken on build 7 in TestFlight, in `asc-screenshots/`:

1. Live TV list — reads "8 channels", showing ABC News (Australia), Africanews, Al Jazeera English, CNA,
   NHK WORLD-JAPAN, TRT World
2. Home — "8+ live channels · 8+ free titles", Documentaries and Public Domain Classics shelves
3. Design for Dreaming — carries the evidence block: *"Public Domain — declared on the item's own Internet
   Archive page (https://archive.org/details/Designfo1956). Prelinger Archives."* with SOURCE and legal@ lines
4. ABC News (Australia) — a real live channel playing, with its official-channel source and legal@ line

Delivered at three sizes: `1179x2556-originals/` (untouched, for 6.3"), `1290x2796/` (for 6.9"),
`1170x2532/` (spare, for 6.1"). All RGB, no alpha channel — Apple rejects alpha.

## Build state read at the same time

`GET /v1/apps/6807647992/builds` now returns **three VALID builds: 5 (2026-09-01), 6 (2026-09-17 02:35),
7 (2026-09-17 05:18)**. Build 7 is uploaded and processed — the `eas submit` step is done. Build 6 must still
not be submitted: it declares iPad.

Version 1.0 remains **REJECTED**. Nothing has been submitted.
