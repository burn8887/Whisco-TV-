# ALL-SYSTEMS CHECK — 2026-09-27

Run 2026-09-27 12:4x Asia/Bahrain · **read-only everywhere** · agent clicks: **0**

---

## VERDICT: 🟢 ALL SYSTEMS GREEN — 5 items to know about, none of them broken

---

## 1 · Site — production

| check | result |
|---|---|
| Routes | `/` `/guides` `/live` `/vod` `/about` `/contact` `/privacy` `/terms` `/browse` `/new` `/sitemap.xml` `/robots.txt` → **200 (12/12)** |
| Bad URL | `/definitely-not-a-page` → **404** branded |
| Canonical chain | `http://whisco.tv` →308→ `https://whisco.tv` →308→ **`https://www.whisco.tv` (200)** ✅ one host |
| Sitemap | **2,767 URLs** · **2,111 `/title/`** (rule: never shrink) ✅ · 27 guides |
| Health endpoint | `status: ok` · **`warnings: []`** · DB reachable |
| DB latency | 161–165 ms warm (1,268 ms first cold hit) |
| Catalogue | **621 channels · 16,784 titles** · 28 shelves · 613 live |

## 2 · Store gate (`X-Whisco-Store`) — the Apple-critical surface

| probe | result |
|---|---|
| `[ios]` / `[android]` home rows | `docs` **8** · `publicdomain` **8** · **no `live` row** ✅ · `featuredChannels` **8** |
| `[ios]` uncleared title | `/title/cennetin-cocuklari` → **404** ✅ (`{"error":"not-found"}`) |
| `[ios]` cleared title | `/title/out-of-this-world-2` → **200** with `rightsBasis` + `evidenceUrl` ✅ |
| `[ios]` cleared channel | `/channel/cmu4il9zu…` (ABC News AU) → **200** with `rightsBasis` + broadcaster URL ✅ |
| `[ios]` live | **8** channels, language facets empty |
| Public (no header) | untouched: full catalogue, `/browse` 200, `/title/*` 200 |
| `hero` count | **0** on cleared stores — pre-existing, out of scope, previously flagged |

*Note on the claim in the submitted evidence pack:* the `/title/…` 404s are **API** behaviour
(`/api/mobile/v1/title/<slug>`), exactly as measured. The **website** `/title/<slug>` pages serve the public
catalogue to a browser — they are not gated, and the pack already says so ("a request without the app's header →
the public website, unaffected"). Verified today: both statements are true, they are about different surfaces.

## 3 · Automation — all scheduled jobs healthy

| check | result |
|---|---|
| GitHub Actions | **12 workflows, all `active`** |
| Last 12 runs | **12 success · 0 failure · 0 cancelled** |
| Running on schedule today | Uptime monitor 08:32 · Incident triage 08:33 · Channel health check 03:37 · Refresh iOS live embeds 02:17 |
| Cron recency | `channelsHoursAgo: 6` · `vodHoursAgo: 6` ✅ |
| Vercel | production deploy **READY** · renders `0d5cb91` |
| Repos | `Whisco-TV-` **`0d5cb91`** · `whisco-mobile` **`a7bd3e7`** · **open PRs 0 / 0** |

## 4 · Stores

| store | state |
|---|---|
| **Apple** | submission `c80e30c4…` **`WAITING_FOR_REVIEW`** — submitted **23 Sep 12:32:39 UTC** (4 days) · version 1.0 · build 7 VALID · attachment **`Whisco_TV_Build7_5.2.2_evidence.pdf` 32,098 B `COMPLETE`** ✅ · review notes 2,999 chars ✅ · contact email set ✅ · 2.5.4 closed |
| **Play** | production **`1.0.0 (7)`** vc 7 `completed` (with Google) · internal `5` · test tracks `build 7` / `whisco.tv test` vc 7 · public URL **404** (expected gate) · developer verification registered |

## 5 · Ads — rule holds

| check | result |
|---|---|
| Rendered ad units on a guide page | **0 `<ins>` tags** ✅ |
| `NEXT_PUBLIC_ADSENSE_SLOT` in Vercel | **absent** → `AD_UNIT_LIVE` evaluates false |
| `AdSlot` | returns `null` when not live ✅ |
| AdSense application | **not requested** (window: 1st week of Oct, only if the gate is met) |

## 6 · Search Console — improving

| measure | 21 Sep | 23 Sep | **27 Sep** |
|---|---|---|---|
| Indexed | 47% | 73% | **77% (23/30)** |
| Needs a founder click | 16 | 8 | **7** |
| Slipped out of the index | — | 0 | **0** |

**🎉 `cut-the-pirate-box` indexed itself** — crawled **2026-09-27**, no click needed.

---

## Maintenance performed in this check

1. **Weekly GSC inspection re-run** (read-only) → `gsc_weekly/2026-09-27.{json,md}` + regenerated
   `FOUNDERS_CLICK_LIST.md`.
2. **GitHub token verified** and the pending commit pushed; credential stripped from the local git remote URL.
3. **Workspace audit** — file count, size, repo integrity, credential inventory (names only).
4. Verified the Apple attachment, review notes and contact email are all still intact.

## Maintenance still open

1. **Founder — 7 GSC Request Indexing clicks** (list below).
2. **Founder — Neon spend cap**: eyeball the setting once; a cap that suspends the DB takes `/browse` and the
   2,111 `/title/` pages down while the store gate keeps answering.
3. **Desk — apex property** still carries a sitemap (`whisco.tv`, submitted 2,767, downloaded 26 Sep). Hygiene
   rule is one host. Untouched, as ruled.
4. **Workspace trim decision** — see amber #1.

---

# ⚠️ FIVE AMBER ITEMS — none is a break

### 1 · Workspace snapshot budget: **120 MB of ~128 MB (94%)**
File count is fine (**993 of 10,000**). The bulk is legitimate repo content: `iptv-app/prisma` **38 MB** (seed
corpus, all 10 files tracked in GitHub), `.git` packs **30 MB**, `public` 7 MB, mobile assets 7 MB, founder
evidence `uploads/` 6 MB. Nothing was deleted: the two screenshot folders are referenced by docs as evidence,
and pruning tracked seed files would create a 38 MB deletion diff a later `git add -A` could commit by mistake.
**If headroom is ever needed:** `git checkout -- prisma/` restores anything removed, so dropping those files
locally is reversible — but it needs a nod.

### 2 · Apple: 4 days in the queue
Normal. **No ETA, do not inquire, no RC reply.** The pack, the letter and the notes are all in place.

### 3 · GSC: 3 URLs went `discovered` → `unknown`
`telugu-live-tv-dubai-apartment-no-dish`, `free-legal-arabic-series-smart-tv-gulf`,
`sun-nxt-saudi-without-indian-number`. Google now reports no record of them (previously "discovered"). They sit
at the **top** of the click list — a fresh Request Indexing is the fix.

### 4 · GitHub token expires 2026-10-23
26 days. Works normally today (scopes include `delete_repo` — a fine-grained token limited to **Contents:
read+write** on the two repos would be safer; option, not a blocker).

### 5 · Catalogue drift: 630 → 621 channels
Expected pruning by the channel health job (dead streams marked inactive), `warnings: []`. Titles steady
(16,786 → 16,784). Not an incident.

---

## TODAY'S FOUNDER TASK LIST (7 clicks, ~5 minutes)

Property **`https://www.whisco.tv/`** → paste → **REQUEST INDEXING** → next. Stop when the button greys out.

**Never fetched by Google — do these first:**
1. `https://www.whisco.tv/guides/telugu-live-tv-dubai-apartment-no-dish`
2. `https://www.whisco.tv/guides/free-legal-arabic-series-smart-tv-gulf`
3. `https://www.whisco.tv/guides/sun-nxt-saudi-without-indian-number`

**Already in the queue:**
4. `https://www.whisco.tv/guides/bollywood-classics-free`
5. `https://www.whisco.tv/guides/malayalam-movies-gulf`
6. `https://www.whisco.tv/guides/free-legal-hd-turkish-series-english-subtitles`
7. `https://www.whisco.tv/guides/punjabi-movies-english-subtitles-uae`

**Never:** `/title/*` · *Validate fix* on the noindex bucket · AdSense **Request review**.

*Agent clicks on GSC: 0. Everything above was read with GET requests only.*
