# Salim Design System v1

**Version:** 1.0
**Date:** 2026-10-28
**Source basis:** `BRAND-IDENTITY.md` plus current Android Compose, iOS SwiftUI and web source
**Status:** Native instrument-panel system implemented in source; not a complete design QA sign-off

## 1. Brand rails (laws)

1. Product name is **Salim**; Arabic is **سالم**. Never use سليم. Approved store title: **Salim — Road Awareness**.
2. The visual metaphor is a calm instrument panel, not a wellness clinic, police console, racing game, or navigation replacement.
3. Numerical readouts (speed, distance, time) use aligned/tabular or monospaced numerals. Values must not jump in width as they change.
4. Safety/caution color is semantic. Amber is not decoration; red is reserved for error/danger. If everything is a warning color, nothing is.
5. Use short labels and hairline separators; avoid decorative gradients and high-radius “soft card” language in the drive interface.
6. The road-S mark is never rotated, turned into a siren/arrow, placed on a busy photo, or altered with police insignia.
7. Arabic lockup order is Latin first, then Arabic (`salim.` — **سالم**). RTL direction and native-market typography must be reviewed, not inferred from English layout.
8. Current product supports system/light/dark appearance in source. Dark-only is **not** a brand law; text and alert contrast must hold in each theme.
9. No mascot/character is currently approved. Do not invent one or add a face/character to safety alerts or legal surfaces.
10. Do not put advertising, subscription promotion, or reporting tasks on the active-drive screen.

## 2. Color tokens

### Current native tokens

| Token | Hex | Use | Guard |
|---|---|---|---|
| Signal / primary dark-theme | `#4ADE9B` | Positive readiness, active accent, selected state | Dark surfaces; do not use as body text on light surfaces without contrast check |
| Signal Deep / light-theme primary | `#146B4C` | Primary actions and accent on light background | Use with suitable white/on-primary text |
| Warn | `#FFC24B` | Caution/approximate indicator on dark surfaces | Not decoration; verify on target component |
| Warn Ink | `#7A5A10` | Caution on light surfaces | Do not use bright Warn on white |
| Danger | `#FF6B5A` | Error/danger on dark surfaces | Never use as routine brand color |
| Danger Ink | `#A32E1C` | Error/danger on light surfaces | Pair and test for contrast |
| Night Ground | `#0A0D0B` | Dark-theme canvas | Main dark background |
| Night Surface | `#121715` | Main panel | Separate with line, not shadow-only |
| Night Raised | `#1A211D` | Raised panel | Use sparingly |
| Night Line | `#27332C` | Hairline/border | Structural separator |
| Night Ink | `#E9F1EA` | Primary dark-theme text | Body and readout |
| Night Muted | `#94A79B` | Secondary dark-theme text | Code comment reports 6.9:1 on NightSurface; re-audit final components |
| Day Ground | `#EFF2EC` | Light-theme canvas | Main background |
| Day Surface | `#FFFFFF` | Light-theme panel | Card/panel |
| Day Raised | `#F7F9F5` | Light raised panel | Subtle, retain borders |
| Day Line | `#CBD4C6` | Light hairline/border | Structural separator |
| Day Ink | `#0E1712` | Light primary text | Body/readout |
| Day Muted | `#4E5E54` | Light secondary text | Code comment reports 7.2:1 on white; re-audit final components |
| Sand / brand mark | `#F5F1E6` | Road-S ribbon and selected brand artwork | Brand asset only unless component contrast verified |

The values are copied from current source/brand docs. Contrast comments in source are implementation claims, not an independent audit; CI does not prove WCAG compliance.

## 3. Typography and spacing

- Native body typography uses platform defaults (SF/SwiftUI and Roboto/Compose); numeric labels use monospace/readout treatment.
- Web brand guidance names Manrope for Latin and IBM Plex Sans Arabic or Noto Sans Arabic for possible Arabic marketing work. Font binaries are not bundled; licensing and rendering need approval before distribution.
- Android common layout currently uses 18 dp horizontal/14 dp vertical list insets; common component gaps include 8–14 dp; corner shapes are 4, 6 and 8 dp. Treat these as observed implementation values, not a locked universal spacing scale.
- No font-size below 10 sp/pt for critical driving information. Dense legal/support content may differ but must be scalable and accessible. Verify dynamic type/large-text behavior per platform.
- Minimum touch-target sizes, map-label minimums, safe-area behavior and reduced-motion tokens still need formal measurement and native acceptance evidence.

## 4. Components and behavior

| Component | Rule |
|---|---|
| Active-drive readout | Highest hierarchy; legible at a glance; stable monospaced numerals; never compete with map or alert |
| Alert banner | One relevant alert, what/where/distance; brief and directional; no stacked noisy banners |
| Approximate camera marker | Hollow/otherwise visibly qualified; never style approximate point as a surveyed exact pin |
| Status / freshness | State waiting, acquired, stale or unavailable plainly; do not use a green “live” badge without current evidence |
| Hairline separator | Organizes instrument-panel sections; do not substitute shadow and decoration for hierarchy |
| Primary action | One clear parked setup/start/stop action; destructive history deletion requires confirmation |
| Ads | Idle eligible screens only, outside active session; must not delay or obscure warning; demo builds ad-free |
| Error state | Explains retry/permission/data problem and safe fallback; no false “all clear” from missing data |

## 5. Do / don't gallery (textual)

| Do | Don't |
|---|---|
| Near-black or calm light canvas, sharp panel edges, a single signal accent, clear readouts | Pastel gradients, soft-pill cards everywhere, decorative number animations |
| `CAMERA AHEAD · 300 M · APPROXIMATE` where the source warrants it | “Radar detected”, “guaranteed”, flashing urgency, or invented exact marker |
| Show coverage caveat in the map/data context and accessible help | Hide coverage limitations in terms only or use a full-GCC green shield |
| Use calm, one-sentence speech and return to silence | Shout, repeat, gamify speed, or talk over navigation |
| Use local system type and native controls | Add unlicensed bundled fonts or tiny contrast-poor labels |
| Keep ads/purchases off the drive surface | Place an ad, paywall, confirmation prompt, or report form over an alert |

## 6. Accessibility and verification

- Target WCAG 2.2 AA for web and equivalent platform accessibility practice; verify text and essential graphical contrast against actual surfaces.
- Every icon-only action needs an accessibility label; color is never the only state signal.
- Test VoiceOver and TalkBack, large text, bold text, reduce motion, display zoom, high contrast, landscape/rotation, tablet layouts, and Arabic RTL.
- Keep touch interaction to a minimum while driving; setup and report entry are parked-only.
- CI test success is not a visual or accessibility certification. Store screenshots must come from the final signed, real app, with no simulation passed off as production coverage.

## 7. Known drift to resolve

The legacy web style guide uses brand green `#1F5C47` and cream, while the native instrument-panel screens use dark/light semantic surfaces and signal green. The brand mark can retain its green, but site and native screenshots should be reviewed together before public launch. Current public home copy also describes a bundled Bahrain pack although static packs are empty; correct that mismatch before publishing the website or store materials.
