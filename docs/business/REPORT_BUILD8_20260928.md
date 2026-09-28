# BUILD 8 — REPORT TO DESK · 2026-09-28

**Steps 1, 2, 3, 5 done and verified. Step 4 (EAS build) is the one thing this session cannot do — two
commands at the bottom, and I stopped there as instructed. Nothing was submitted, no RC message sent.**

---

## SHAs

| repo | branch | SHA |
|---|---|---|
| `burn8887/Whisco-TV-` | `main` | **`97dc225`** (PR #23, squash) — *"api: iOS build 8 — eight allow-listed live streams, zero on-demand"* |
| `burn8887/whisco-mobile` | `main` | **`dfe0a24`** (PR #1, squash) — *"app: build 8 — live news only (Apple 5.2.2)"* |

Both pushed, GitHub-verified, **0 open PRs on either repo**. Vercel deployed `97dc225` — state **READY**.

## STEP 1 + 2 — curl counts, production, after the patch

| header | `/live` | `/vod` | `/home` |
|---|---|---|---|
| **`ios`** | **8** — France 24 English · DW English · TRT World · Al Jazeera English · CNA · NHK WORLD-JAPAN · Africanews · ABC News (Australia) | **200 · 0 items · 0 shelves · `total 0`** | **rows `[]` · hero `[]` · featured 8 · `stats {channels: 8, titles: 0}`** |
| `android` | 8 (unchanged) | 8 films (unchanged) | `docs=8, publicdomain=8` (unchanged) |
| `play` | 8 (unchanged) | 8 films (unchanged) | unchanged |
| none | 57 | 16,784 / 28 shelves | 5 rails, hero 5 — **the website, untouched** |

**18/18 acceptance checks pass** on production, including: every iOS live row is a YouTube `live_stream` embed;
`/title/out-of-this-world-2` → **404** (was 200 on build 7); `/title/bookbinders` → **404**;
`/channel/<allow-listed>` → **200**; `/channel/<harvested>` → **404**; `cached.ts` untouched; Android unchanged.

**How the gate works.** `isIosStore` is **strictly** `ios`; `isAndroidStore` is `android|play`. The live eight are
an **allow-list of YouTube channel ids** (`src/lib/store-ios-live.ts`), not a `clearedForApp` flag — a row is
dropped unless its `streamUrl` is that broadcaster's own YouTube live embed, and a missing row is **never
backfilled**. The legacy `isIosStore = isClearedStore` alias was **deleted**: the name now means the narrower
thing, and an alias meaning both is how a gate leaks.

## STEP 3 — app

`ios.buildNumber` **1 → 8**; android `versionCode` **untouched at 1**. On Demand + My List removed from the tab
bar (`href: null`, routes kept, both render one empty state: *"Live news only in this version."*). Home is the
live eight: hero, shelf rails and the *"N+ channels · N+ free titles"* count claim are gone; subtitle now
**"Free live news"**; the §1.4-forbidden tagline is replaced (a new binary was the only way to ship that fix);
`about.tsx` lost *"hundreds of live channels and thousands of movies"*. `store/ios-listing.md` rewritten for
build 8 — name `Whisco TV`, subtitle `Free live news`, no "movies", no film section, no public-domain keywords.

**Verified locally:** `tsc --noEmit` clean · `npx expo export --platform ios` bundles · `npx expo prebuild
--platform ios` then reading the generated plist:
**`CFBundleVersion` = 8** · **`UIBackgroundModes` — key ABSENT entirely** · **`TARGETED_DEVICE_FAMILY` = "1"**
(iPhone only) · `withNoBackgroundAudio` still **first** in plugins.

## STEP 4 — EAS: THIS SESSION CANNOT RUN IT

```
$ npx eas-cli whoami
Not logged in
```
No EAS/EXPO token exists anywhere in this workspace, and the standing rule is that I never install one or write
to `~/.expo`. iOS builds cannot be produced locally either — this host is Linux, not macOS, so there is no
`xcodebuild` path. **Per your instruction I stopped here rather than inventing a workaround.**

**Two commands, for the founder — run from `/home/user/whisco-mobile` after `git pull`:**

```
npx eas-cli login
npx eas-cli build --platform ios --profile production
```

Then, to put the artifact on Connect in the same thread:

```
npx eas-cli submit --platform ios --profile production --latest
```

**One thing to watch, because it decides whether this is build 8 or something else.** `eas.json` has
`"appVersionSource": "remote"` and `production.autoIncrement: true`. Build 7 shipped as **1.0 (7)** while
`app.json` read `buildNumber "1"` — proof the **remote** counter is authoritative. The remote iOS build number
should therefore increment 7 → **8**. **If the build finishes as anything other than 8, stop and tell me** — do
not submit it, because the evidence PDF and the Connect notes both name build 8 by number.

**What I will verify the moment the artifact exists** (I cannot until then): download the IPA from expo.dev,
unzip, `plutil -p Info.plist` → `CFBundleVersion 8`, no `UIBackgroundModes audio`, `UIDeviceFamily` iPhone-only.
Everything in that list is already proven at the prebuild stage; the IPA check is the same claim against the
shipped artifact.

## STEP 5 — evidence PDF

`Whisco_TV_Build8_5.2.2_evidence.pdf` — **1 page, 5,542 B**, your wording verbatim, eight-row table
(name / channel id / official URL), 8 clickable links. Checks: `8+` 0 · "play" 0 · AdSense 0 · Filmhub 0 ·
"movies" 0 · `14,000` 0 · `iptv` 0. Also committed to `whisco-mobile/store/`.

## STEP 6 — waiting on the build, by your instruction

No Resolution Center message written or sent. No Connect edit. The notes block and the RC text from your order
are transcribed in `whisco-mobile/store/ios-listing.md` and ready to paste **after** build 8 is in Connect.

## Connect state right now (read-only)

version 1.0 **`REJECTED`** · submission `c80e30c4…` **`UNRESOLVED_ISSUES`** · build on the version **7** ·
`WAITING_FOR_REVIEW` 0 · `IN_REVIEW` 0. Nothing queued, nothing uploaded — as expected until Step 4 runs.

## Not touched

Play Console never opened, no AAB, no listing edit on Play, `AD_UNIT_LIVE` still false, no AdSense request,
website catalogue not emptied (`/`, `/browse`, `/guides`, 2,111 `/title/` pages all still 200), `cached.ts`
ungated, cron unchanged. No secret values appear in this report or in either commit.

## DONE-LOOKS-LIKE scorecard

| criterion | state |
|---|---|
| production ios API: 8 named lives, 0 vod, home has no films | ✅ |
| production android API: unchanged 8+8 | ✅ |
| IPA Info.plist: no audio background mode | ⏳ prebuild-verified; **IPA check pending the build** |
| `whisco-mobile` 1.0 (8) uploaded | ⏳ **Step 4 — needs EAS login** |
| PDF attached, notes pasted, RC pasted, listing cleaned | ⏳ after Step 4 |
| Play Console not opened | ✅ |
| website catalogue not emptied | ✅ |
