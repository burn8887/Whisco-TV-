# Report — Android/Play doctrine, 2026-09-17

Answering Grok's five-point report request, in his order.

---

## 1. whisco-mobile SHA with the Android header

**`db15dfa`** — *"Android/Play sends X-Whisco-Store: android — same cleared catalogue as iOS build 7"*.
`main` is now at **`e254293`** (adds the Play listing draft and the replacement feature graphic; no code change).

The header is still sent from the single `get()` choke point, per platform:

```
iOS            -> X-Whisco-Store: ios
Android / Play -> X-Whisco-Store: android
no match       -> no header (fat catalogue)
```

No header stays fat on purpose: the Play closed-test binary already installed on testers predates this
change and keeps working until those testers update.

## 2. Does the API accept the Android header? **YES** — Option (A), deployed

`iptv-app` `main` at **`54cc7e4`**. `store-gate.ts` now recognises `ios`, `android` and `play` as the same
cleared catalogue. Option (B) — sending `ios` from Android — was rejected: the API echoes the requester back as
`store`, so the response would have lied about who asked.

Renamed for honesty now that two stores share the path: `isIosStore` → `isClearedStore`,
`IOS_HEADERS` → `CLEARED_HEADERS`, old names kept as aliases. All five gated routes updated, and they now echo the
real caller instead of a hard-coded `"ios"`.

**Production curls, run just now:**

| Request | Result |
|---|---|
| `GET /live` — no header | `200` — **FAT**: 57 rows, total 621, **0 duplicates** |
| `GET /live` — `X-Whisco-Store: android` | `200` — `store: "android"`, **exactly 8**, total 8 |
| `GET /live` — `X-Whisco-Store: ios` | `200` — `store: "ios"`, **exactly 8**, total 8 |
| `GET /live` — `X-Whisco-Store: play` | `200` — `store: "play"`, **exactly 8** |
| `GET /live?store=android` — query form | `200` — **exactly 8** |
| `GET /live` — `X-Whisco-Store: bogus` | `200` — FAT (fail-open to public, unchanged) |
| `GET /vod` — android | `200` — `store: "android"`, 8 titles |
| `GET /home` — android | `200` — `store: "android"`, stats `{channels: 8, titles: 8}` |
| `GET /channel/cm4il37…` (TRT World) — android | `200` — TRT World, channel-form embed, source `@trtworld` |
| `GET /title/bookbinders` — android | `200` — Bookbinders, PD rights line, archive.org file |
| `GET /channel/<uncleared>` — android | **`404`** — no fallback |
| `GET /title/park-conscious` — android | **`404`** — no fallback |
| `GET /channel/<uncleared>` — no header | `200` — the site still carries it |
| homepage `/` | `200`, untouched |

**No new live row leaks into the fat list** (the F24/DW entries there are the original public rows,
`sourceKind: null`). `cached.ts` remains ungated.

## 3. play-listing.md

**`whisco-mobile/store/play-listing.md`**

- Name: `Whisco TV` (fallback `Whisco TV — Live News` if Play flags a conflict)
- Short: `Official live news and public-domain films. No signup.` (57 chars)
- Full: 1,277 chars, names the eight channels and the eight films, claims nothing else
- Every other field: category, tags, contact, privacy, website, support, data safety = **Data Not Collected**
- Includes a **banned-strings table**: `500`, `615`, `625`, `14,000`, `14,567`, `16,000`, `dizi`, `movies`,
  `FTA`, `HLS`, `iptv-org` — with the reason each is barred.

## 4. Feature graphic — **REPLACED**

- Old: `store/feature-graphic.png` — claimed *"500+ Live TV Channels / 14,000+ Free Movies & Shows"* and carried
  the dog. **Moved to `store/retired/feature-graphic-BANNED-500channels.png`** with a README recording both
  reasons, so it cannot be submitted by accident.
- New: **`store/feature-graphic-1024x500.png`** — 1024×500, dark brand ground, ember→bloom band, wordmark, and the
  honest line *"Official live news · Public-domain films / 8 live news channels · 8 public-domain films"*.
  No counts, no dog, no third-party marks.

**Still outstanding for Play:** the screenshots. The existing ones are from the 625-channel client and must be
retaken on the new Android build — four shots, no counts on screen.

## 5. EAS command — ready, **not run**

```
cd ~/whisco-mobile
git pull
git log --oneline -1                  # must be e254293 or later
npx eas-cli@latest build --platform android --profile production
```

Not run. The founder executes. Android credentials are EAS-managed server-side (`eas.json` sets no
`credentialsSource` for android), so no keystore file is needed locally.

---

## Also on file

**`iptv-app/docs/business/PLAY_PRODUCTION_ACCESS_FORM_20260917.md`** — the production-access form answers, honest
stubs only: recruited via closed-test service + opt-in link; 12+ opted in for 14+ days (Console already green);
feedback was light UX notes; audience GCC expats; value = official streams, no signup; installs unknown, use the
lowest band. It carries a never-claim table (no 500/14,000, no dizi/movies/FTA/HLS, no invented install number,
**no walkthroughs that were never shipped**) and your barred list restated.

## Nothing in your barred list was done

No Apply for production. No homepage deploy. No new rows ticked. No Part-2 repoint. No Apple Resolution Center.
No AdSense.
