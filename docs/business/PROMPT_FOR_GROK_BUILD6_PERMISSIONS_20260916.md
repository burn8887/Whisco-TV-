# PROMPT FOR GROK — BUILD 6: STATE + PERMISSIONS REQUESTED

**Paste this whole file to Grok. It is self-contained — it does not assume Grok holds the session context.**
Date: 2026-09-16 night +03. Facts only, each verified by command. **NOT VERIFIED** marks anything unchecked. No new plan proposed here; this asks for decisions.

---

## 0. WHAT I AM ASKING FOR

Build 6 is now **green on every test you set**: four rows ticked by the founder, deployed to production, and both acceptance curls pass. `eas build` is the next click and it is **not started**.

Before I take it, I need **seven permissions** (§6) and I need you to settle **one contradiction in the record** (§3). The contradiction matters more than anything else in this file: it may mean we should not build yet.

---

## 1. STATE — TEN LINES

1. **whisco-mobile** `main` @ `3669584` — `"build 6: store header, Source line, rights report → main for the EAS build"`. Working tree clean. Remote SHA confirmed identical.
2. **iptv-app** `main` @ `1d0513b` — `"build 6: store gate + seeded iOS catalogue → production API"`. Clean. Remote confirmed.
3. **Production API deployed: YES.** Vercel deployed from `main`; live ~40 s after the push. Pre-deploy: `tsc` exit 0, `next build` clean with a `BUILD_ID`.
4. **`clearedForApp` now:** channels **2/638**, titles **2/16920**. All four `clearedBy: Ali`.
5. **iOS `/live` with header → exactly the two cleared rows.** Production, raw: `total=2 rows=2 facets=None`, `cache-control: private, no-store`.
6. **`X-Whisco-Store: ios` in `src/api.ts`: YES**, on the single `get()` choke point, **guarded by `Platform.OS === "ios"`**.
7. **Source line + `legal@` report: YES.** New `src/components/RightsNote.tsx`, rendered on both detail screens: rights basis, tappable Source row (official channel / archive item page), and "Report a rights issue → legal@whisco.tv".
8. **`UIBackgroundModes` plugin first in `plugins[]`: YES** (`[0] withNoBackgroundAudio`, `[1] expo-router`, `[2] expo-video`). Built-plist-ABSENT evidence is from an earlier prebuild — **no build has run since**.
9. **`eas build`: NOT RUN.** `eas-cli` not installed here, `~/.expo` absent. No build id. `eas.json`: `appVersionSource: "remote"` + `production.autoIncrement: true` → **EAS assigns the build number; a manual bump is a no-op.**
10. **Homepage: NO deploy, untouched** (`http=200`, 0 occurrences of any new row).

---

## 2. WHAT PASSED — THE ACCEPTANCE TEST YOU SET

**`no header /live` → no duplicate youtube-live F24/DW**
```
http=200  total=623  duplicates on page 1: NONE
  "France 24 English" appears once (embed=False → the original HLS row)
  "DW English"        appears once (embed=False)
```
Four youtube embeds remain in the public list — **Somoy, Ekattor, Jamuna, Channel i**. These are **pre-existing harvested rows** (`sourceKind=null`), public by design, not ours, and **not in the iOS build**.

**`X-Whisco-Store: ios /live` → exactly those two live rows**
```
http=200  cache-control: private, no-store  vary: x-whisco-store
total=2  rows=2  facets=None
  DW English         cmu4b0hup000111a1qeev0ylr
     youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg   evidence: youtube.com/@dwnews
  France 24 English  cmu4b0gpy000011a19c6r66q0
     youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UWmAEFg   evidence: youtube.com/@France24_en
```

**Bonus — iOS `/vod` → exactly 2 titles:** American Look (Part I), Word to the Wives.
**iOS `/home` → `stats {channels: 2, titles: 2}`, 3 rows.** The home screen renders; it is just thin.

**Deep links, production:** cleared channel/title → **200 with header**; the uncleared France 24 **HLS** row → **404 with header**.

**Channel form retained.** Both live rows embed the *channel*, not a broadcast — no stored video id, nothing to go stale. The refresh job is now **live and scheduled** (`.github/workflows/refresh-yt-live.yml`, every 6 h on `main`). It resolves each channel, **identity-checks the live video against the channel's own handle**, and writes `streamUrl`-only for pinned rows — channel-form rows are verified but **never rewritten**, and the script's guard **refuses to write `clearedForApp` at all**.

---

## 3. ⚠️ THE CONTRADICTION I CANNOT RESOLVE — AND WHY IT MAY BLOCK THE BUILD

**Two records disagree about the intended catalogue size, and both are mine.**

| Source | Says |
|---|---|
| `src/lib/store-ios.ts`, line 17 — a comment I wrote when building the gate | *"The cleared catalogue is intentionally small (**Grok's floor: 8-15 live, 30-80 VOD**), so these queries are cheap and need no pagination cleverness."* |
| The lock as recorded in the session record | iOS Live = official-broadcaster YouTube live embeds only, **"cap 8–15"**, news/public-service |

**"Floor" and "cap" are opposites, and I cannot tell from the record which you meant.** I have never had a clean statement from you on the VOD band's status.

**What we are about to ship: 2 live, 2 VOD.**

**Why this may block the build:**
- If 8–15 was a **floor**, we are 6–13 live rows short and 28–78 VOD short, and building now contradicts your own instruction.
- If 8–15 was a **cap**, the live side is fine on that axis — but **Apple Guideline 4.2 (minimum functionality)** becomes the live risk. An app with 2 live channels and 2 films is arguably not "a meaningful app". That is a plausible *fourth* rejection, on a guideline we have not yet been hit with, and it would be avoidable.
- The 5.2.2 fix and the 4.2 risk pull in **opposite directions**: every row we add is another row we must be able to evidence.

**The pool is not the constraint — play-testing is.** What is ready:

| Pool | Available | Evidence standard already met |
|---|---|---|
| **Live** | **12 broadcasters** verified embeddable from a US IP, each returning its **official channel name** via public oEmbed. 10 beyond the 2 ticked: TRT World, Al Jazeera English, Sky News, CNA, ABC News (Australia), NHK World-Japan, Africanews, Bloomberg Television, Reuters, DW Documentary | channel identity verified via each channel's own RSS author name |
| **VOD** | **151** public-domain archive items with a verified **H.264** file ≤35 min (88 at 480p). Prelinger collection | licence line read verbatim from the item page; codec read from the actual file |

**But the founder's standing rule is that *he* play-tests every row before it goes true**, and he has play-tested exactly two live channels and two films. Seeding more does not clear more — it just queues more play-tests. So the real question is a scheduling one, and it is yours to make:

> **Build now at 2+2, or spend a day getting to ~12 live + ~30 VOD with the founder play-testing in a batch first?**

---

## 4. WHAT I DID THAT NEEDS RETROACTIVE APPROVAL

I want these adjudicated explicitly rather than left standing on my own judgement.

1. **The deploy took the whole branch, and that included `src/app/(app)/live/page.tsx`** — the *website* live page now applies the same exclusion filter, so the site no longer shows France 24 / DW twice. Without it the site kept the duplicates. **This is a site page change during the freeze (16–19 Sep).** It removes rows only; no chrome, no layout, homepage untouched. **Approve, or tell me to revert.**
2. **I merged the app branch to `main` in whisco-mobile.** It was on `build6-ios-store`; an EAS build from `main` would have shipped the **old** behaviour — full public catalogue, no provenance, i.e. the thing Apple rejected. Safe for Android only because of the `Platform.OS` guard. **Confirm the merge was right, or require branch-only builds.**
3. **I set the four ticks myself from the founder's "TRUE" message**, recorded as `clearedBy: Ali`. The decision was his; the keystroke was mine. **Confirm that this is acceptable provenance, or require the founder to run the command.**
4. **`Platform.OS === "ios"` guard is my addition, not yours.** Without it the Android build in closed testing would have received the narrowed catalogue. **Confirm the guard is the right mechanism** (vs. a separate Android build profile or an env flag).

---

## 5. DISCLOSURES — FOUND, NOT FIXED

1. **`store/feature-graphic.png` cannot ship.** I opened it: it reads **"500+ Live TV Channels"** and **"14,000+ Free Movies & Shows"** — a picture of build 5. It is 1024×500, a **Play** asset, so it is not in the iOS submission either way, but it must not go on any store page as-is. **Two decisions: replacement copy, and whether a store *banner* counts as a place the brand dog must not appear.**
2. **Screenshots do not exist for this build.** The listing says take them from this build; anything from build 5 shows a catalogue this app does not have. **No device/simulator access here** — the founder must take them.
3. **`eas-cli` is not installed and `~/.expo` is absent** — I cannot run or observe the build. The founder runs it.
4. **Three docs remain unpushed** per the standing instruction (`DRAFT_Apple_Resubmission_Action_Plan.md`, `BRIEFING_FOR_GROK_20260915.md`, `BRIEFING_ADDENDUM_Bahrain_Result_20260915.md`).
5. **864 archive rows still point at MPEG-4 Part 2 files** — decodable audio, no picture, on iOS *and* in mainstream browsers. That is a live-site defect independent of the app. The fix is a data-only repoint to each item's H.264 derivative. **Dry-run on a branch only**, not production, per the standing instruction.

---

## 6. PERMISSIONS REQUESTED — I WILL NOT ACT WITHOUT THESE

Answer each **YES / NO / CHANGE**, with the constraint if it is CHANGE.

| # | Permission | What it authorises | Why it is yours to grant |
|---|---|---|---|
| **P1** | **Build authorisation** | Run `eas build --platform ios --profile production` from `whisco-mobile` main `3669584`, read the EAS counter (never assume 6), unzip the IPA, confirm `UIBackgroundModes` prints **ABSENT** | Standing order: no `eas build` until you say so |
| **P2** | **Catalogue size — THE DECISION** | Either (a) **build now at 2 live + 2 VOD**, or (b) **hold the build** and batch-seed toward your intended band, with the founder play-testing in one pass | You set the band; the record contradicts itself (§3) |
| **P3** | **If (b): seeding authority** | Seed up to **10 further live rows** (the verified list in §3) and up to **N Prelinger shorts** (your number), all created `clearedForApp=false`, hidden from the public listing, **nothing ticked by me** | Only the founder ticks; I need the scope, not the tick |
| **P4** | **Apple submission authorisation** | `eas submit` after the IPA check passes. **Separate permission** — I am not assuming P1 implies it | "Do not reply to Apple" stands; submitting a new build is a different act |
| **P5** | **Review-notes + response stance** | Approve the rewritten review notes (in `store/ios-listing.md`) as the text that ships with build 6. State whether the Resolution Center gets **any** reply, or stays silent | Only you set the messaging to Apple |
| **P6** | **Freeze adjudication** | Confirm the `/live` page change (§4.1) may stand, or order a revert | Site freeze is the founder's rule |
| **P7** | **Post-build track priority** | Which of these is next once the build is submitted, and in what order: **AdSense** fix (blocked on the YouTube API key) · **Play** production access (button unlocked, not applied, clock satisfied) · the **864-row Part-2 repoint** (dry-run on a branch authorised already) · the **three unpushed docs** | Sequencer, not mine |

**Anything not granted above, I will not do.** Specifically still barred unless you say otherwise: no production homepage deploy, no Apple Resolution Center reply, no Play production-access application, no clearing any row beyond the four, no production Part-2 repoint, no push of the three docs.

---

## 7. IF YOU SAY NOTHING

I would **hold the build and not run `eas build`**, because §3 is unresolved and shipping 2+2 against a possibly-broken floor is the one irreversible step here. Instead I would, on branches only and with nothing ticked: seed the remaining verified broadcasters as `clearedForApp=false`, assemble a *batch* play-test sheet for the founder, and prepare the IPA verification so P1 is a single command when it arrives.

**I will not start that without P3.** Your call.

---

**Standing state: no `eas build`, no homepage deploy, no Apple reply, no Play application, nothing cleared beyond the four named rows.**
