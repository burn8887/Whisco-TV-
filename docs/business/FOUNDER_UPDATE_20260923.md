# FOUNDER UPDATE — 23 SEPTEMBER 2026 · VERIFICATION RECEIPT

**What the founder sent** (screenshots, ~14:46 Asia/Bahrain, also shared with the Desk):

1. **Play Console home** — account `burn8887` (personal, ID 6630636640590292266) · 1 app · **Whisco TV
   `tv.whisco.app`** · installed audience **4** · App status **Closed testing** · Update status **In review** ·
   last updated **Sep 21, 2026**. Banner: *"All of your apps have been successfully registered to meet Android
   developer verification requirements."*
2. **App Store Connect app list** — Whisco TV · **"iOS 1.0 Ready for Review"** · a red **`1`** badge on the app
   icon · link *"View App Review Issues & Messages"*.
3. **Gmail — Neon Alerts** (Tue, Sep 22, 23:17) — *"You've reached your monthly spending alert limit … has used
   **100% of its $20.00 monthly spending notification threshold** … This is just an alert, so nothing has changed.
   Your projects are still running and charges will continue to accrue."*

**GSC indexing submissions, as reported:** 23 URLs submitted (Priority A ×5, Priority B ×8, batch 3 ×10) ·
**1 not yet submitted — `cut-the-pirate-box` — quota exceeded, submit tomorrow.**

---

## Verified read-only, 2026-09-23 (ASC API · Play API · production · GSC inspection API)

### ✅ APPLE — SUBMITTED (resolved at 15:32, minutes after the first read)

**Status now: with Apple.** `c80e30c4…` = **`WAITING_FOR_REVIEW`** · `submittedDate`
**2026-09-23T12:32:39.246Z = 15:32 Asia/Bahrain** · version + item `WAITING_FOR_REVIEW` ·
`UNRESOLVED_ISSUES` = 0 · attachment `Whisco_TV_Build7_5.2.2_evidence.pdf` 32,098 B `COMPLETE`.

The same submission ID was reused (Apple re-queues the existing object rather than creating a new one).

**The finding below was measured at 15:20 — ten minutes before the click — and was true then.**

### (15:20) APPLE — nothing was queued at that moment

| probe | result |
|---|---|
| `appStoreVersions` 1.0 | `appStoreState` **READY_FOR_REVIEW** · `appVersionState` **READY_FOR_REVIEW** |
| review submissions **in `WAITING_FOR_REVIEW`** | **0** |
| review submissions **in `IN_REVIEW`** | **0** |
| review submissions **in `READY_FOR_REVIEW`** | **0** |
| the only submission, `c80e30c4…` | state **`UNRESOLVED_ISSUES`** · `submittedDate` **2026-09-17T23:43:22.775Z** |
| its single item | state **`READY_FOR_REVIEW`** |
| build on the version | **7** · `processingState` VALID · expired False |
| attachment | **`Whisco_TV_Build7_5.2.2_evidence.pdf`** · 32,098 B · `COMPLETE` |

**Reading:** the risk pack and the Resolution Center letter are in place, but **no submission has been sent
since 17 September**. In Apple's model `READY_FOR_REVIEW` means *prepared, awaiting the developer's submit
click* — it is **not** a queue state, and the app-list label the founder screenshotted shows exactly that state.
`UNRESOLVED_ISSUES` on the submission has not been cleared, and no new submission object exists.

**ACTION TAKEN — 2026-09-23 15:32 Asia/Bahrain.** The founder pressed Submit for Review; the API confirms the
queue state above. **Nothing further to press.** Do not reply in the Resolution Center. Do not inquire about
timing. Wait.

*Not proven by the API:* the label on the button itself. The API cannot show the UI. Everything above is what
Apple's records say.

**Also in that screenshot / the App Review page (23 Sep 15:33):** Messages = **5** — Apple 10 Sep · Ali 11 Sep ·
Apple 15 Sep (with the 615-channel screenshot attached) · Apple 22 Sep 02:50 (the 5.2.2 rejection) · **Ali 22 Sep
04:44 (the Desk letter)**. **No new Apple message today** — the red `1` badge is the 22 Sep thread. The page
shows *iOS Submission · Waiting for Review · Items Submitted (1) · iOS App 1.0 · 1.0 (7) · Waiting for Review*.

### ✅ PLAY — matches the screenshot

| probe | result |
|---|---|
| production | release **`1.0.0 (7)`** · vc 7 · status `completed` (submitted, awaiting Google) |
| internal | `5 (1.0.0)` vc 5 · completed |
| test tracks | `build 7` vc 7 · `whisco.tv test` vc 7 · completed |
| public URL | still **404** — the gate on all promotion is unchanged |
| developer verification | registered — Google's new requirement is satisfied for all apps |

### ✅ GUIDES — every URL the founder submitted resolves

**24 / 24 → HTTP 200**, real HTML, 51–70 KB each (23 submitted + `cut-the-pirate-box`).

### ✅ GSC — the submission push moved the needle hard

| measure | 21 Sep | **23 Sep** |
|---|---|---|
| indexed share | 14 / 30 = **47%** | **22 / 30 = 73%** |
| net change | — | **+8 indexed · 0 slipped out** |
| needing a founder click | 16 | **8** (all `Discovered – currently not indexed`) |

Guides that became indexed today: `arabic-series-guide`, `aha-uae-app-store`, `hoichoi-vs-zee5-bengali-gulf`,
`geo-dramas-bahrain-legal`, `channel-i-ntv-dubai-legal`, `sinhala-teledrama-gulf`,
`syrian-lebanese-series-gulf-legal`, `egyptian-films-gulf-legal`.

**Two properties both carry a sitemap** — `https://www.whisco.tv/` (2,772 URLs, last downloaded 2026-09-22
15:28 UTC) and **apex `https://whisco.tv/` (2,760 URLs, last downloaded 2026-09-23 06:27 UTC)**. The hygiene
rule is **one host**. Not touched — flagged for the Desk.

### ✅ NEON ALERT — site is healthy, cost is the open question

- Production is serving: `/browse` 200 (290 KB) · `/title/video-files-2010` 200 · sitemap **2,111 `/title/`
  lines intact** · mobile gate endpoints unaffected.
- **Which surfaces depend on the database:** `/browse`, `/title/*`, `/watch/*`, `/watchlist`, `/admin`, and
  the `cron/*` + `health` routes use Prisma. **The mobile `X-Whisco-Store` endpoints, `/guides`, `/live`,
  `/vod` and `/` do not.**
- **Risk to know about:** if the Neon org has a **spend cap** set near this level, the database can be
  suspended — that would take `/browse` and the 2,111-URL `/title/` surface down while the store gate kept
  answering. Worth confirming the cap setting on Neon's side.
- `$20/mo` is **under** the standing "ask first above $100/mo" line, so no gate is triggered — recorded as new
  recurring spend, not as a decision.

---

## Tomorrow (24 Sep) — the one reminder

**GSC → Request Indexing, property `https://www.whisco.tv/`**, top-down, stop when the button greys out
(quota ≈10–12/day and resets daily):

1. `https://www.whisco.tv/guides/cut-the-pirate-box` ← **the one that did not go today**
2. `https://www.whisco.tv/guides/bollywood-classics-free`
3. `https://www.whisco.tv/guides/malayalam-movies-gulf`
4. `https://www.whisco.tv/guides/free-legal-hd-turkish-series-english-subtitles`
5. `https://www.whisco.tv/guides/telugu-live-tv-dubai-apartment-no-dish`
6. `https://www.whisco.tv/guides/free-legal-arabic-series-smart-tv-gulf`
7. `https://www.whisco.tv/guides/sun-nxt-saudi-without-indian-number`
8. `https://www.whisco.tv/guides/punjabi-movies-english-subtitles-uae`

Machine list: `gsc_weekly/FOUNDERS_CLICK_LIST.md` (regenerated 23 Sep 15:20). Never `/title/*`. No *Validate
fix*. No AdSense request.

**Founder action still open, above everything else:** the Apple **Submit for Review** click.

---

## ⚠️ Agent-side blocker found while filing this (23 Sep)

**The GitHub PAT in `.keys/github_pat.txt` no longer authenticates.** REST returns **`401 Bad credentials`**
(both `Bearer` and `token` header styles); `git push` is rejected with *"Invalid username or token."* A
`git fetch` still "succeeds" only because the repo is **public** — anonymous read, not proof of auth.

- **Effect:** the handover update and this receipt are committed on **local `main`, unpushed**
  (`git log --oneline -1` in `/home/user/iptv-app`). GitHub `main` remains **`d39abfc`**.
- **Cause:** unknown — most likely the token expired or was rotated/auto-revoked. `ghp_`-length, 40 chars,
  classic-token shape, trailing newline. The value was never read aloud, echoed, or written anywhere.
- **Fix (founder):** create a replacement token with **contents: read + write** on `burn8887/Whisco-TV-` and
  save it to `/home/user/.keys/github_pat.txt` — plain text, one line, nothing else. Do not paste it in chat.
- **Unaffected:** App Store Connect, Play, GSC, AdSense, Vercel and the site itself — all of those read fine.
  Only GitHub writes are blocked.

*Nothing in this document was written by clicking anything: reads only, agent clicks 0.*
