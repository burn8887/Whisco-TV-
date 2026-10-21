# Assessment: changing the brand from “Salim” to “Salem Drive”

_21 October 2026. Written after the Founder flagged that the Arabic must be **سالم** and asked
whether the Latin should therefore read **Salem**._

## 1. The Arabic was genuinely wrong; the Latin is a separate question

| | Before | Now |
| --- | --- | --- |
| Arabic | **سليم** (Salīm, “Saleem”) | **سالم** (Sālim) |
| Latin | Salim | Salim |

**سالم** and **سليم** are different words that share a root. The intended meaning — safe, sound,
healthy — and the ordinary Gulf given name are both **سالم**. The brand had been written with
**سليم**, which reads as *Saleem*. That was a real defect and it has been corrected throughout.

The Latin does **not** have to follow. **سالم** is transliterated as *Salim* at least as often as
*Salem*; the two are the same name. Keeping **Salim** costs nothing and breaks nothing, whereas
switching to **Salem** would touch every permanent identifier the project has.

**Decision taken: Arabic corrected to سالم, Latin kept as Salim.** The rest of this document is
the full cost of the alternative, kept for the record.

## 2. The blocking fact: `salemdrive.com` is taken

Checked on 21 October 2026 with DNS lookups:

| Domain | Result |
| --- | --- |
| `salemdrive.com` | A record `162.255.119.82` — a Namecheap parking page |
| `www.salemdrive.com` | `104.219.250.36`, `2.59.170.19` — `parkingpage.namecheap.com` |

The domain is registered and parked. It is **not** available at registration price, and buying it
from the holder would be a negotiation with an unknown asking price, not a purchase.

`salimdrive.com` still has no A record. That is consistent with the domain being held for this
project, but it is **not proof**: a registered domain with no DNS configured looks identical from
outside. Only the registrar account can confirm it.

The Founder's condition for renaming was that the domain be available. It is not, so the rename
was not performed.

## 3. What a “Salem Drive” rename would actually cost

Counted from the capsule as it stands today.

### 3.1 Text and UI

- **240 occurrences of “Salim”** in the capsule (231 as plain text), across 63 files.
- **18 occurrences of the Arabic wordmark**, all in documentation. The native apps and the web
  demonstrator show the Latin wordmark only; their Arabic strings are taglines and place names
  (“اعرف ما أمامك. قُد بهدوء.”, “الرفيق الهادئ”, “المنامة”) and would not change.
- Store-facing strings: Android `android:label="Salim Demo"`, iOS `CFBundleDisplayName`
  “Salim Demo”, site `<title>`, meta description, brand link `aria-label`, and the headings
  “What Salim does” / “Where Salim is going”.
- Arabic store listing in `STORE-LISTING-DRAFT.md` — title and body.

### 3.2 Code identifiers

| Item | Current | Would become |
| --- | --- | --- |
| Kotlin packages | `com.salimdrive.app`, `com.salimdrive.core` (12 source files, 4 directories) | `com.salemdrive.*` |
| Compose entry point | `Salim()` | `Salem()` |
| Gradle root | `rootProject.name = "SalimDrive"` | `SalemDrive` |
| Swift app struct | `SalimApp` | `SalemApp` |
| Xcode target, scheme, tests | `Salim`, `SalimTests`, `Salim.xcodeproj` | `Salem`, `SalemTests`, `Salem.xcodeproj` |
| iOS source directory | `apps/ios/Salim/` | `apps/ios/Salem/` |
| Web package | `@salimdrive/web` | `@salemdrive/web` |
| Web component | `SalimMark` | `SalemMark` |
| Host directories | `apps/salim-android`, `apps/salim-ios`, `apps/salim-web`, `packages/salim-core` | `apps/salem-*`, `packages/salem-core` |
| Android theme | `Theme.Salim` | `Theme.Salem` |

### 3.3 Permanent identifiers — the expensive part

| Item | Current | Note |
| --- | --- | --- |
| Android `applicationId` | `com.salimdrive.app` | Locks at first Play upload |
| iOS bundle ID | `com.salimdrive.app` | Locks at first TestFlight build |
| Signing environment | `salim-release` | Renaming means recreating it and re-entering every secret |
| Secret names | 10 × `SALIM_*` | Must be recreated and re-verified |
| Identity guard | workflow expects `com.salimdrive.app` | Fails closed until updated |
| Workflow files | `salim-android-build.yml`, `salim-ios-build.yml`, `salim-release-signing.yml` | Rename plus trigger-path updates |
| Artifacts | `salim-android-test-build`, `salim-ios-simulator`, etc. | Cosmetic, but every doc references them |
| Repository | `burn8887/salim-drive` | GitHub redirects old URLs, but the clone URL changes |
| Capsule directory | `salim-workspace/` | Every workflow path and every document |
| Emails | `support@`, `legal@salimdrive.com` | Must exist on the new domain |
| Domains | `salimdrive.com`, `www.` | New domain needed |

Every one of these is still changeable **today**, because nothing has been registered with Google
or Apple and no key has been generated. After the first Play upload or the first TestFlight build
the bundle identifiers become permanent.

### 3.4 Effort

A full rename is mechanical but not small: roughly 63 files of text, a package move on both
platforms, four directory renames, three workflow renames, a regenerated `promote.py` rule table,
a re-verified tree, and a rebuilt deploy bundle. It is a day of careful work with the verification
we already have, not a search-and-replace — the *verification* is what makes it safe.

## 4. What was actually done

1. Arabic **سليم → سالم** in all six documents that carried it.
2. Pronunciation corrected from *sa-LEEM* to *SAA-lim*, with the IPA updated.
3. A naming rule added: never write **سليم** for the product; it is a different word.
4. `NAME-CLEARANCE.md` records the spelling change, keeps the competitor table honest (those
   listings use **سليم**, quoted as found), and states plainly that a **fresh store search for
   سالم has not been run**.
5. `salemdrive.com` recorded as registered and parked.
6. No Latin identifier, bundle ID, email address, domain or repository name was touched.

## 5. If the Founder still wants “Salem Drive”

The name works; only the domain is blocked. In order of preference:

1. **Buy `salemdrive.com` from the holder** — unknown price; a parked domain is usually for sale.
2. **Use a different suffix** — `salemdrive.app`, `salemdrive.bh`, `salemdrive.co`,
   `getsalemdrive.com`. None of these resolved on 21 October 2026, which is **not** proof they are
   free; check at a registrar before committing.
3. **Keep Salim Drive** with the corrected Arabic — zero cost, zero risk, and the Founder's actual
   complaint (wrong Arabic) is already fixed.

Whichever is chosen, the change must happen before the first Play or TestFlight upload. After that
the bundle identifiers are permanent and a rename becomes a new app with no update path.
