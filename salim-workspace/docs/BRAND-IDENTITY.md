# Salim — brand identity (working system, v1)

Status: **founder-selected name, applied to the demonstration apps.** This document records the
system as implemented. It is not a claim of trademark, domain or store-name availability — see
[NAME-CLEARANCE.md](NAME-CLEARANCE.md).

## 0. Approved decisions

| Decision | Value | Approved | Consequence |
| --- | --- | --- | --- |
| Product name | **Salim — سليم** | 20 Oct 2026 | Applied to code, icons and CI |
| Store title | **Salim — Road Awareness** | 20 Oct 2026 | Screenshots, listings and keywords are built around this |
| Brand domain | **www.salimdrive.com** | 20 Oct 2026 | Privacy and support pages authored in `site/`; **not live yet** |

The domain was chosen but did not resolve in DNS on 20 October 2026, and no page was reachable.
Store review requires working HTTPS URLs, so the pages must be published before submission. See
`site/README.md` for the publication checklist and `tools/check_site.py` for the pre-publish check.

## 1. The name

**Salim** · **سليم** · pronounced *sa-LEEM* (Arabic: /saˈliːm/).

From the Arabic root **س-ل-م (s-l-m)**: safe, sound, whole, unblemished, free of defect. The same
root gives *salām* (peace), *salāma* (safety) and *Islam*. It is one of the most widely understood
words in the region and reads naturally in Arabic, English and Urdu/Persian-influenced markets.

Why it fits this product:

| Quality we need | How the name carries it |
| --- | --- |
| Reassurance without alarm | The word itself means *sound, unharmed* — the opposite of a siren |
| Awareness, not speed | Nothing in the name implies velocity, radar or evasion |
| A companion, not a gadget | It is a personal name, spoken like a companion |
| Bahrain/GCC roots, international reach | Arabic origin, three syllables, no difficult consonants |
| Short, ownable wordmark | Six letters; a clean lowercase `salim.` signature |

It also fixes the problem that ended the previous working name: *Sahm* reads as “share” in finance
and collides with a large Saudi trading app. Salim carries no finance association.

**Known weakness, stated openly:** Salim is an extremely common given name across the Arab world,
and “safe/sound” is a laudatory meaning for a road-safety product. That makes the *word* weak as a
trademark on its own and hard to own in app-store search. The identity therefore relies on a
distinctive **mark**, a consistent **signature** (`salim.`), and a **descriptive store title**
(see §7 and NAME-CLEARANCE.md). Salim should be treated as a brand to build equity in, not a
shortcut to exclusivity.

## 2. Positioning

> **Salim is the calm co-pilot for the road ahead.**
> It tells you what is coming — cameras, hazards, bumps, average-speed sections — for your
> direction of travel, in your language, without taking over the drive.

**Promise:** *Know what's ahead. Keep your calm.*

Three commitments that every screen and alert must honour:

1. **Relevant** — only what applies to the driver's direction and route, never every camera nearby.
2. **Considerate** — alerts that coexist with navigation, music and conversation; no shouting.
3. **Honest** — clear about coverage, freshness and uncertainty. No implied guarantee of safety,
   no promise of avoiding a fine, no claim of official endorsement.

**What Salim is not:** a radar detector, a police-alert network, a navigation replacement, an
emergency service, or a guarantee of any outcome on the road.

## 3. Voice

Calm, brief, adult, specific. Speak the way a good passenger speaks: one sentence, then silence.

| Do | Don't |
| --- | --- |
| “Camera ahead, your direction. 300 metres.” | “⚠️ SPEED CAMERA DETECTED!! SLOW DOWN NOW” |
| “Section ends in 400 metres. Average 78.” | “You are beating the average!” |
| “No updates for this area since Tuesday.” | “Fully verified live coverage.” |
| “Follow the posted sign.” | “Guaranteed ticket-free driving.” |

Alert grammar: **[what] · [where/how far] · [one qualifier]**. Then stop. Never stack three alerts;
merge or drop the least relevant.

## 4. Visual identity

### 4.1 The mark — “the road S”

A single continuous ribbon folds into an **S**: the initial of Salim, and the shape of a road seen
from above. A thin centre line runs its whole length as a lane marking. The line is unbroken —
awareness that continues — and the ends are rounded, so nothing points, shouts or resembles an
arrow, chevron or police insignia.

- Full-bleed square icon: cream ribbon on deep Salim green.
- Adaptive Android icon: same ribbon inside the 66 dp safe zone.
- Minimum size tested at **48 px**; the ribbon and lane line remain legible.
- Do not rotate, outline, add a siren, add a speedometer, or place the mark on a busy photograph.

### 4.2 Colour

| Role | Name | Hex | Use |
| --- | --- | --- | --- |
| Primary | **Salim Green** | `#1F5C47` | Icon ground, primary actions, brand type |
| Secondary | **Sand** | `#F5F1E6` | Mark ribbon, cards on dark ground |
| Surface | **Calm Canvas** | `#F5F7F0` | App background |
| Accent | **Amber** | `#D99A2B` | Caution states only — never decorative |
| Ink | **Deep Ink** | `#293D2F` | Body text |

Amber is reserved for genuine caution. If everything is amber, nothing is.

### 4.3 Typography

- **Latin:** Manrope (UI/web) or the platform default (SF Pro on iOS, Roboto on Android) for native
  screens; tight, humanist, low-contrast.
- **Arabic:** pair with a humanist Arabic face (IBM Plex Sans Arabic or Noto Sans Arabic) for
  marketing and future localisation. **No font binaries are bundled in this repository** — check
  licences before shipping one.
- Signature: lowercase `salim.` with a full stop. The stop is the brand's punctuation: end of
  message, calm full stop.

### 4.4 Icon files

| Asset | Path |
| --- | --- |
| iOS 1024 icon (RGB, no alpha) | `apps/salim-ios/Salim/Assets.xcassets/AppIcon.appiconset/AppIcon.png` |
| Android legacy launcher (mdpi–xxxhdpi) | `apps/salim-android/app/src/main/res/mipmap-*/ic_launcher.png` |
| Android adaptive foreground | `.../res/drawable/ic_launcher_foreground.xml` + `mipmap-*/ic_launcher_foreground.png` |
| Store graphic 512×512 | `docs/store-icon-512.png` |

## 5. Language and naming conventions

- **Product name:** Salim — never “Salim App”, “Salim Road” or “Salim Drive” in body copy.
- **Arabic:** سليم. Do not add the definite article (السليم) in the product name.
- **Signature:** `salim.` in the wordmark; “Salim” in running text.
- **Store title (approved):** `Salim — Road Awareness`.
- **Demo builds:** “Salim Demo”, so nobody mistakes a fictional-data build for a released product.

### Taglines

| Language | Line | Status |
| --- | --- | --- |
| English (primary) | **Know what's ahead. Keep your calm.** | In use in the demo apps |
| English (short) | The calm co-pilot. | Store subtitle candidate |
| Arabic (MSA) | **اعرف ما أمامك. قُد بهدوء.** | Draft — needs a native Bahraini/Gulf reviewer |
| Arabic (Gulf flavour) | اعرف اللي قدّامك، وسوق على راحتك. | Draft — colloquial, needs native review |

Do not publish an Arabic line that has not been read aloud by a native speaker from the target
market.

## 6. Expansion notes (GCC and beyond)

- **Saudi Arabia:** the largest market and the reason the previous name failed. Salim is common and
  neutral there; no finance, no state and no competing automotive brand is implied. Verify store
  search for `سليم` before launch — a diet app and medical apps already use the name in Arabic.
- **UAE/Qatar/Kuwait/Oman:** same pronunciation, same meaning, no dialect friction.
- **Türkiye and the Balkans:** *Selim* is a familiar form (including an Ottoman sultan’s name) —
  a curiosity, not a conflict; keep the Latin spelling `Salim`.
- **Indonesia/Malaysia:** *Salim* is a common surname and the name of a large conglomerate with
  automotive interests. Low risk for a Gulf driving app, but avoid imagery or claims that could
  look like a Salim Group product.
- **Global:** the name will always be read as a personal name, which is a strength for a companion
  product and a weakness for trademark distinctiveness. Build the mark and the descriptive
  subtitle, and file in the classes that matter (§7).

## 7. Recommendations before public launch

1. **Store title needs a descriptor.** A bare “Salim” is likely unavailable or unsearchable on both
   stores. Propose `Salim — Road Awareness` on Play and `Salim: Road Awareness` as the App Store
   title with the subtitle “Know what's ahead.”
2. **Register the composite, not just the word.** File the stylised wordmark/logo and, if possible,
   a compound mark. Word-only “Salim” in Class 9/42 faces descriptive/laudatory objections and
   prior common-law uses. Take local counsel in Bahrain (MOIC) and Saudi Arabia (SAIP).
3. **Publish the chosen domain before printing anything.** `www.salimdrive.com` is the brand domain.
   DNS did not resolve on 20 October 2026, so it must be confirmed as registered, pointed at a host
   and serving HTTPS before the URL appears in a store record, a screenshot or a press kit. Keep
   `/privacy` and `/support` stable once submitted.
4. **Use a consistent handle** matching the domain (`@salimdrive`) across platforms; `@salim` will
   not be available. Reserve before announcing.
5. **Keep the legal entity separate from the product name.** The operating company name does not
   have to be “Salim”; a distinct legal entity reduces exposure if the brand has to change.

## 8. What changed in this rename

Applied throughout the codebase and CI: package and module names (`app.salim.*`), iOS target and
scheme (`Salim`, `SalimTests`), bundle identifiers (`app.salim.ios.demo`, `app.salim.android.demo`),
display names (“Salim Demo”), workflow and artifact names, web demo branding and the icon set.

Provisional identifiers are **unchanged in structure** and remain demo-only until the founder
confirms the permanent reverse-DNS identity. Nothing in this document registers, reserves or
clears any name, domain, handle or trademark.
