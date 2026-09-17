# RC letter — where it goes, and the text itself

**Written 2026-09-18 for the build-7 submission that is now `WAITING_FOR_REVIEW`.**

---

## Placement — the short answer

| When | Where it goes | Still open? |
|---|---|---|
| **Before** you resubmit | App Review page → unresolved-issues link → In Progress → **Resolve** → **Reply to App Review** (4,000-char field + Attach File) | **No — closed.** Apple: *"You can correspond with Apple, and include attachments … until you resubmit to App Review."* The resubmission happened at 2026-09-17 23:43 UTC. |
| **After** you resubmit | Version page → **App Review Information** → **Notes** (4,000-char field) | **Yes — this is the live path.** Review notes travel with the submission and are read by the reviewer. |

So: **App Review Information → Notes**, on the version page. Notes currently hold **1,416 characters**; this letter is
**1,452**. Combined ≈ 2,880 — inside the 4,000 limit, so append rather than replace.

While `WAITING_FOR_REVIEW` you can edit certain information. You **cannot** upload or edit screenshots — both sets were
already in place before submission (6.3" at 1179×2556 and 6.9" at 1290×2796), so nothing is needed there.

## Two precision flags before you send it

The letter names two things differently from how the app itself labels them. A reviewer searching the app for the
letter's spelling will not find it:

| Letter says | App row actually says | Suggested form |
|---|---|---|
| `DW News` | `DW English` | `DW English (youtube.com/@dwnews)` |
| `A Word to the Wives` | `Word to the Wives, A` | `Word to the Wives, A` |
| `ABC News Australia` | `ABC News (Australia)` | `ABC News (Australia)` |

The eight live rows, verbatim from the app's own API: ABC News (Australia) · Africanews · Al Jazeera English · CNA ·
NHK WORLD-JAPAN · TRT World · DW English · France 24 English.

## Attachment

The review detail currently carries **`Whisco tv content rights statement build 6 .pdf`**, and the existing notes
reference it by that name — but the build under review is **7**. Content is identical between the two packs; only the
label differs. To remove the mismatch, replace it with:

- **`Whisco_TV_Content_Rights_Statement_build7.pdf`** (this repo, `docs/business/`)
- or **`RIGHTS_PACK_build7.pdf`** — same file, same bytes.

If you replace it, also change the line in the existing notes from
`Whisco_TV_Content_Rights_Statement_build6.pdf` to `Whisco_TV_Content_Rights_Statement_build7.pdf`.

**Do not attach `Whisco_TV_Content_Rights_Statement_v2.md` / its PDF.** That document is headed *"Version 1.0 (5)"* —
build 5. It is stale and would hand the reviewer a document describing a different submission.

---

## THE LETTER — verbatim, ready to paste

```
Guideline 5.2.2 — third-party content

This binary does not host, copy, transcode, or restream media. Playback is the rights holder's own player loading the rights holder's own file.

Live (8 rows): official 24/7 news channels embedded from the broadcaster's own verified YouTube channel, using youtube.com/embed/live_stream?channel=… (France 24 English, DW News, TRT World, Al Jazeera English, CNA, NHK WORLD-JAPAN, Africanews, ABC News Australia). YouTube chrome and the official channel name are visible. We have no signed carriage deal; the evidence is each broadcaster's own public, embeddable live channel. See the attached rights pack (official site + channel URL per row).

On Demand (8 rows): public-domain shorts from archive.org. Each file is H.264. Each item page states Public Domain in the item's own words. The Source row in the app opens that page. Reviewer path: American Look (Part I) and A Word to the Wives.

Removed from this binary: third-party HLS URLs, commercial entertainment networks, cinema/series storefronts, background-audio mode. We host no media. Report a rights issue → legal@whisco.tv. We will remove any row you flag within 24 hours.

Guideline 2.5.4 — UIBackgroundModes audio

The audio value has been removed from UIBackgroundModes in the built Info.plist of this IPA (build 7). The app does not play audio when backgrounded. A screen recording is not attached because we took the remove-the-key path you offered.
```

### With the naming corrections applied (optional variant)

```
Guideline 5.2.2 — third-party content

This binary does not host, copy, transcode, or restream media. Playback is the rights holder's own player loading the rights holder's own file.

Live (8 rows): official 24/7 news channels embedded from the broadcaster's own verified YouTube channel, using youtube.com/embed/live_stream?channel=… (France 24 English, DW English, TRT World, Al Jazeera English, CNA, NHK WORLD-JAPAN, Africanews, ABC News (Australia)). YouTube chrome and the official channel name are visible. We have no signed carriage deal; the evidence is each broadcaster's own public, embeddable live channel. See the attached rights pack (official site + channel URL per row).

On Demand (8 rows): public-domain shorts from archive.org. Each file is H.264. Each item page states Public Domain in the item's own words. The Source row in the app opens that page. Reviewer path: American Look (Part I) and Word to the Wives, A.

Removed from this binary: third-party HLS URLs, commercial entertainment networks, cinema/series storefronts, background-audio mode. We host no media. Report a rights issue → legal@whisco.tv. We will remove any row you flag within 24 hours.

Guideline 2.5.4 — UIBackgroundModes audio

The audio value has been removed from UIBackgroundModes in the built Info.plist of this IPA (build 7). The app does not play audio when backgrounded. A screen recording is not attached because we took the remove-the-key path you offered.
```

---

## State verified at the time of writing (App Store Connect API)

```
version 1.0   appStoreState = WAITING_FOR_REVIEW
              submitted 2026-09-17T23:43:22Z
              build attached: 7  (VALID, uploaded 2026-09-17T05:18:12-07:00)
screenshots   APP_IPHONE_61  count=4  1179x2556
              APP_IPHONE_67  count=4  1290x2796
review detail notes: 1416 chars
attachment:  "Whisco tv content rights statement build 6 .pdf"
contact:     burn8887@gmail.com / +973 3930 3973 / demo account not required
```

Both screenshot sets are populated. Build 7 is the build under review. Nothing else was changed.
