# BRIEFING FOR GROK — BUILD 6 STATUS

**2026-09-16 night +03 · facts only · everything below was checked by command in this session**
**NOT VERIFIED** marks anything I did not check. No vibes, no new plan. Build 6 lock not reopened.

---

## 0. TEN LINES FIRST

**1. whisco-mobile HEAD** — `4510adb` · `main`
`"live candidate verification: 12 official broadcaster live streams confirmed embeddable"`
*(contains `d39aefd`, the 2.5.4 audio fix — verified an ancestor of HEAD. Working tree clean.)*
**Remote push: NOT VERIFIED.** `git ls-remote` came back empty on two attempts — the shell's remote config is being stripped between turns. The commit exists locally; I cannot confirm it is on GitHub from here.

**2. iptv-app** — `main` @ `249eefc` · `build6-store-gate` @ `5de0866`
`"tick steps: use the founder's own site for the live test, three sandbox methods failed"`
Working tree clean. **Pushed** (remote ref confirmed at each push).

**3. Production API deployed?** **YES.**
`https://www.whisco.tv/api/mobile/v1/live` → HTTP 200, 49 KB, `total=625`.
**But it is serving the pre-build-6 code.** The store gate and the public exclusion are **on the branch only**. See §1.4 — this now has a visible consequence.

**4. `clearedForApp` counts NOW** — channels **0/638** · titles **0/16920** (active 0/16788)
Rows carrying any clearance or `clearedBy` stamp: **channels 0 · titles 0.** No GATE-TEST residue.

**5. iOS `/live` with header** → **0 rows, total=0, `facets: null`, `cache-control: private, no-store`.** Correct: nothing is cleared. The gate is proven to open and close (temp-clear test, earlier session).

**6. `X-Whisco-Store: ios` in whisco-mobile `src/api.ts` on HEAD?** **NO.** Single choke point identified: `async function get<T>(path)` at line 81, `fetch(\`${BASE}${path}\`, { headers: { Accept: "application/json" } })`. One-line change, deliberately **not** made — held for the same commit as the ticks.

**7. Source line + `legal@` in the iOS app?** **PARTIAL.** `legal@whisco.tv` exists at `app/about.tsx:11` as a contact row ("Rights Holders & Legal"). **No "Source" line exists** — `grep` for it returns nothing outside that contact.

**8. `UIBackgroundModes` plugin first in `plugins[]`?** **YES.** `[0] ./plugins/withNoBackgroundAudio` · `[1] expo-router` · `[2] expo-video`. `UIBackgroundModes` does not appear anywhere in `app.json`. Build-time plist verified ABSENT earlier; **no rebuild has happened since**, so the plist check is evidence from the earlier prebuild, not from a fresh build.

**9. `eas build` 6 run?** **NO.** `eas-cli` not installed, `~/.expo` absent (not authenticated). **No EAS build id.** Separately: `eas.json` has `cli.appVersionSource: "remote"` + `production.autoIncrement: true`, so **EAS assigns the build number** — any manual bump is a no-op.

**10. Anything pushed to the production website homepage?** **NO.** `https://www.whisco.tv/` → 200, and it contains **0** occurrences of the new row and **0** of the new embed id. The homepage is untouched.
**But production output HAS changed, via data, not code — see §1.4.**

---

## 1. GRID AGAINST THE LOCK

| # | Task | Status | Evidence | Blocker |
|---|---|---|---|---|
| 1 | Schema + `clearedForApp` default false | **DONE** | branches `e6ebc66`+`7df413b`; counts read 0/638, 0/16920 | — |
| 2 | Cron cannot mark new rows iOS-cleared | **DONE** | `discover-channels/route.ts:194` `clearedForApp: false`; refresh job's guard refuses the column (proven by test) | — |
| 3 | Route gate: no header fat · header cleared-only · uncleared deep link 404 | **DONE, on branch** | see curls in §1.3 | not deployed |
| 4 | NEW `youtube-live` rows F24 EN + DW, hidden from public `/live` | **DONE on branch — but WEAK on production** | row ids §2 | §1.4 |
| 5 | `live_stream?channel=UC…` vs pinned id + refresh job | **DONE — channel form + job** | `.github/workflows/refresh-yt-live.yml`, cron `0 */6 * * *`; guard verified, job leaves channel-form URLs alone | job not yet run in Actions (workflow is on branch) |
| 6 | Class B pointing at H.264 only | **DONE** | title ids §2; the one defect (`_edit.mp4` Part 2) corrected | — |
| 7 | Topper / Part-2 / cinema / dizi / Somoy / Bangla NOT cleared | **DONE** | 0 titles cleared at all; Topper `cleared=false`; Somoy `cleared=false, sourceKind=null`; Bengali channels cleared = 0 | — |
| 8 | whisco-mobile header + Source + `legal@` | **NOT STARTED** | §0.6, §0.7 | waits on the ticks |
| 9 | Plugin first; plist ABSENT | **DONE (prebuild evidence)** | §0.8 | fresh build will re-confirm |
| 10 | Listing draft: no Movies, no 615, Marketing URL off the catalogue | **NOT DONE — and the file that exists is the OLD draft** | §1.10 — this is the sharpest finding below | needs a rewrite |
| 11 | Rights pack tables filled with the play-tested URLs | **PARTIAL — and now WRONG in two ways** | §1.11 | needs a rewrite before it can be attached |
| 12 | `eas build` / IPA plist check | **NOT STARTED** | §0.9 | needs the ticks + EAS auth |

### 1.3 Latest curls (local, branch code, run just now)

```
(1) no header            -> 200 | total=623 | rows=58  | facets languages=17   FAT
(2) X-Whisco-Store: ios  -> 200 | total=0   | rows=0   | facets=null | private, no-store
(3) /channel/<uncleared> no header -> 200   |  ios -> 404
    /title/<uncleared>   no header -> 200   |  ios -> 404
```
Local, not production. Your acceptance curl hits `whisco.tv`, where (2) cannot be true until a deploy.

### 1.4 ⚠️ PRODUCTION NOW SHOWS FRANCE 24 AND DW TWICE — data, not code

Seeding wrote to the shared production database. The exclusion that hides those rows from the public listing lives in `src/lib/store-public.ts`, **only on the branch**. So:

```
production /api/mobile/v1/live          -> total=625
production page 1 duplicates            -> {'France 24 English': 2, 'DW English': 2}
production ?q=France 24                 -> cmu4b0gpy… (embed=True)   <- new row
                                           cmsor42mf… (embed=False)  <- original HLS row
```

**A visitor to whisco.tv right now sees each of those broadcasters twice.** I caused this by seeding ahead of the exclusion being live. It is not a homepage change and no code was deployed — but it is a real, live, visitor-visible defect and I am not going to bury it.

**Two ways out:** (a) deploy the branch so the exclusion goes live — that is a production deploy and needs your word; (b) leave it and deploy with the rest. **I have not touched anything to paper over it.** Also note the freeze: this is a data change with a visible effect, which is arguably outside "data fixes only".

### 1.10 The listing draft is the pre-rejection version

`whisco-mobile/store/ios-listing.md` still says:
- `Marketing URL: https://whisco.tv` — the lock requires off-catalogue
- `500+ free live TV channels and 14,000+ movies & shows`
- `Turkish series (dizi) including Forbidden Love, Esaret, Emanet`
- keywords include `turkish series,bollywood,pakistani drama,dizi`
- review notes: "free-to-air public HLS broadcasts"

**Every one of those contradicts the build-6 lock and the shipped binary.** Build 6 carries 2 live rows and 2–4 public-domain shorts. Submitting this text against that binary is a fresh 2.3.1/5.2.2 problem. The file exists; the *work* is not done.

### 1.11 The rights pack no longer matches the build

Pages 3–4 list **12 live broadcasters using `youtube-nocookie.com/embed/<id>`**. Build 6 ships **2** rows using **`youtube.com/embed/live_stream?channel=UC…`**. Wrong count *and* wrong URL form — and `nocookie` is the form the shipped player's `src.includes("youtube.com/embed")` test does **not** match. Pages 5–6 (Class B) are correct and codec-verified.

**A rights pack that disagrees with the binary is worse than no pack**, because the reviewer can diff them.

---

## 2. SEED STATE — every row, verbatim

**Created. All `clearedForApp=false`, `clearedBy=null`.**

### Live (`sourceKind = youtube-live`)

| Field | France 24 English | DW News |
|---|---|---|
| id | `cmu4b0gpy000011a19c6r66q0` | `cmu4b0hup000111a1qeev0ylr` |
| streamUrl | `https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5VrQ8yKZ-UWmAEFg` | `https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aegoMqRaCZg` |
| evidenceUrl | `https://www.youtube.com/@France24_en` | `https://www.youtube.com/@dwnews` |
| sourceKind | `youtube-live` | `youtube-live` |
| clearedForApp | **false** | **false** |
| public /live | **YES on production, NO locally** (§1.4) | same |
| active | true | true |

Channel ids identity-verified via each channel's own RSS `<author><name>` — *not* scraped (scraping produced France 24's **French** channel and an unrelated **InfoMigrants** as candidates).

### Class B (`sourceKind = archive-org`)

| Title | id | streamUrl (verbatim) | cleared | public /vod |
|---|---|---|---|---|
| American Look (Part I) | `cmsor4dia00x0nn71q6mhzvyi` | `https://archive.org/download/American1958/American1958.mp4` | false | **YES** |
| A Word to the Wives, A | `cmsor4ecn015cnn71sderx8st` | `https://archive.org/download/Wordtoth1955/Wordtoth1955.mp4` | false | **YES** |
| Park Conscious | `cmsor4cjo00ilnn71136dsun0` | `https://archive.org/download/ParkCons1938/ParkCons1938.mp4` | false | YES |
| All About Polymorphics | `cmsor4ecn015jnn715ddootoy` | `https://archive.org/download/AllAboutPolymorphics/AllAboutPolymorphics.mp4` | false | YES |

`word-to-the-wives-a` **was corrected** from `Wordtoth1955_edit.mp4` (MPEG-4 Part 2 — the founder's audio-only file) to `Wordtoth1955.mp4` (H.264). All four verified `avc1` Constrained Baseline 640×480 by ffprobe on the real files.

**Nothing was cleared in producing this briefing.**

---

## 3. DRIFT CHECK

| Check | Result |
|---|---|
| No GATE-TEST row left true | **CONFIRMED** — 0 rows with any `clearedBy` stamp, channels or titles |
| `cached.ts` still ungated | **CONFIRMED** — `grep` for `clearedForApp`/`isIosStore` returns **0 matches** |
| Android / no-header still fat | **CONFIRMED** — 623 local, 625 production |
| No Apple Resolution Center reply drafted or sent | **CONFIRMED** — no reply file exists, nothing sent |
| No Play production request | **CONFIRMED** — nothing initiated |
| No credentials in this reply | **CONFIRMED** |

---

## 4. HONEST LEFTOVERS

**Blocker before the founder can type TRUE on the four rows:** *Nothing in the system.* The rows exist, are verified, and the tick script works. What is missing is **the live-row play-test** — the founder's own confirmation that the two `live_stream?channel=` rows play when loaded on a real page. Three of my test methods failed (address-bar embed → error 153 on *every* embed including his working Somoy row; chat file preview → sandboxed, no network; served sandbox URL → needs a traffic token). **The correct test is `https://www.whisco.tv/live/<row id>` on his phone, with his working Somoy row as the control.** Evidence needed: nothing further from me.

**Blocker after TRUE before `eas build`:** **three items, not one.**
1. The `X-Whisco-Store: ios` header + Source line + the missing `legal@` "Source" affordance in whisco-mobile, in the tick commit.
2. **The acceptance curl must pass against production** — which needs a deploy of the branch. That deploy is also what fixes §1.4's duplicate listing, so the two are the same click.
3. **The listing rewrite** (§1.10) and **the rights pack rewrite** (§1.11). Submitting the current text against this binary repeats the mistake that produced rejection #2.

**If Grok says nothing, I would do this:** rewrite the rights pack to match the shipped binary exactly (2 live rows, channel-form URLs, 4 codec-verified shorts), rewrite `store/ios-listing.md` with no Movies/dizi/counts and Marketing URL off the catalogue, drop the Source affordance into whisco-mobile on a branch — **all of it text and code on branches, no deploy, no build, no tick** — then hand the founder one page: five links to tap and one word to reply. Because the only thing standing between today and a build is his play-test, and my last three attempts at delivering that test were wrong in three different ways.

---

## 5. PLAY STORE — one paragraph, and I stop

Android is on the **closed test** channel (vc6); the personal-account rule requires **≥12 testers opted in continuously for 14 days**, internal testing does **not** count, so the production-access application cannot be made before roughly **Sep 23–27 [EST]**, and a single tester dropping out resets the clock. The Play binary calls **the same `/api/mobile/v1` endpoints** and does **not** send `X-Whisco-Store`, so it reads the fat catalogue — the pre-build-6 behaviour, unchanged, which is why the store gate must stay header-based rather than becoming the default. **No production-access application has been submitted**, and per the lock I am not starting one; Play production follows the iOS submission on the same catalogue doctrine. Not touching the Play listing.

---

**No `eas build`. No homepage deploy. No Apple click. No Play production click. Nothing cleared.**
