# ARENA AGENT — HANDOVER

**For the next Arena Agent Mode chat. Possibly tonight, possibly in a month.**
**Written:** 2026-09-21 21:11 UTC · **2026-09-22 00:11 Asia/Bahrain**
**Last measured:** 2026-09-21 21:11 UTC — the iOS row in §6 was updated **2026-09-22 00:40 UTC** (rejection); otherwise the §6 `main` row deliberately names the last **site-affecting** merge, not `HEAD`, so it stays true as docs commit on top of it (a docs-only commit still triggers a Vercel build; the site itself is unchanged).

Everything here is either **standing law** (does not expire) or a **dated snapshot** (re-measure it —
the repo wins over this document). Where something is unchecked it says `NOT IN DATA`. There are **no
secret values in this file** — names and locations only.

---

## 0 · How to start

1. **Connect GitHub first.** OAuth to `github.com/burn8887`. Two repos matter:
   - `burn8887/Whisco-TV-` — the website. **PUBLIC.**
   - `burn8887/whisco-mobile` — the Expo/Android/iOS app. **PUBLIC.**
2. **Clone both.** If a zip of this workspace was also provided: **GitHub wins over the zip, always.**
   The zip may be stale, and the zip is not authoritative for anything except the artefacts that live
   only in the workspace (`/home/user/tools`, `/home/user/proof`, `/home/user/gsc_weekly`, the dated
   briefing docs). Those are not in any repo.
3. **`.git/config` never survives a snapshot** (sensitive-path exclusion). Before any git command:
   ```bash
   cd repo && cat > .git/config <<'EOF'
   [core]
       repositoryformatversion = 0
       filemode = true
       bare = false
       logallrefupdates = true
   [remote "origin"]
       url = https://github.com/burn8887/Whisco-TV-
       fetch = +refs/heads/*:refs/remotes/origin/*
   EOF
   mkdir -p .git/refs/heads .git/refs/tags .git/refs/remotes/origin
   ```
   (Empty dirs do not persist either. Without `refs/`, git refuses to see the repo at all.)
4. **Never `git reset --hard` while `git status --porcelain` shows `M` entries.** This already cost a
   merge and a night of confusion — see §7. Commit, then inspect the staged list, then push.
5. **Push needs an inline token URL** (trailing whitespace in the token file breaks the credential
   path): read the token, `tr -d '\n\r '`, and push to
   `https://x-access-token:${PAT}@github.com/<repo>.git`. Never echo it.
6. **Re-measure production before acting on anything.** The site deploys from `main` automatically, so
   this document is out of date the moment someone merges. Run the snapshot commands in §6 first.
7. **Do not `npm run build` / `next build`** — it OOMs this sandbox. Use `npx next dev -p 3000` and
   `./node_modules/.bin/tsc --noEmit`. `node_modules` is stripped between turns: `npm ci` first.

---

## 1 · Roles

| role | who | owns |
|---|---|---|
| **Engineer** | you (Arena Agent) | code, commits, PRs, deploys, measurement, evidence, docs. Ships on the founder's word |
| **Doctrine / Desk** | **Grok** | product law, rulings, GO / NO-GO on anything ambiguous. Route decisions to the Desk — never self-authorise |
| **Clicks** | **the founder** | Play Console, App Store Connect, AdSense, Search Console, EAS builds. **All of them. Always.** |
| **The Desk's Desk** | Desk rulings file in the repo | where Grok's rulings land in writing |

**The hard line:** you never click in a store console, never press AdSense review, never submit to
Apple, never tick a review checkbox, never run an EAS build. You prepare, verify, and hand over a
numbered click path. If a task needs a click, it is a hand-off, not a TODO for you.

---

## 2 · Product law (standing — does not expire)

1. **Two products, two catalogues.**
   - **Store apps (Play + iOS):** exactly **8 live channels + 8 public-domain films**, gated by the
     `X-Whisco-Store` header (`ios` / `android` → 8 + 8). One production-capable AAB.
   - **Website:** ungated, the full index (thousands of titles). Same brand, different scope. Never
     let store copy describe the website's catalogue, or vice versa.
2. **No piracy. Ever.** Live = official broadcaster channels only; VOD = documented public-domain or
   official-source material. No harvested HLS, no re-streams, no directory-sourced channels, no
   "iptv" framing on any store surface.
3. **One ad per page, never near the player.** `#0a0a0f` ground, ember `#f97316` → bloom `#db2777`.
   Never on the player, never adjacent to it.
4. **No Play promo on the site until the public store URL returns 200.** The Play URL is currently a
   **404**. So: no store badge, no "on Google Play", no announcement, no OFT.
5. **`legal@whisco.tv` is the only contact address.** `privacy@` was removed from every surface
   (ruling, 21 Sep). `partnerships@whisco.tv` also exists and is fine on `/contact` + `/about`.
6. **Search Console: inspect only.** The API is read-only — **there is no Request Indexing endpoint and
   no write path.** Never drive a signed-in Google UI from a bot (**A8 Option 2 is locked**), never
   fake a submit, never touch `/title/*`, never Validate fix on the noindex bucket, never add a second
   sitemap. Clicks are the founder's, on a numbered list you produce.
7. **AdSense is gated.** Not requested. One attempt only, in the first week of October, and only if a
   solid share of `/guides` slugs read *"Submitted and indexed"*, after the Desk has seen a GSC
   screenshot. **Do not press Request review.**
8. **2 guides per week, 27 total.** Batch publishing stopped by ruling. The Desk names the slugs.
9. **Dark tokens only.** No light mode. Design System v1.0 is law: `docs/business/Whisco_TV_Design_System.md`.
   Its §1.4 voice list is binding — the phrase *"Life's better at full speed"* is **forbidden** and was
   found live on the homepage once.
10. **No LoRA.** Barred as a standing bar — recorded here so a new agent does not propose model
    fine-tuning / adapters. The Desk's rationale is Grok's to restate; the bar is not yours to lift.
11. **`cached.ts` stays ungated.** Never gate the cache layer behind the store header.
12. **The brand dog** is the mascot. It never appears on posters, catalogue art, store screenshots,
    ads, or legal pages, and it must never be the LCP element.
13. **Data safety = Email + User ID** on both stores. Never claim "no data collected" anywhere.

---

## 3 · Repos, deploy, and surfaces

| thing | value |
|---|---|
| Web repo | `github.com/burn8887/Whisco-TV-` (**public**) — Next.js App Router, Tailwind, Prisma |
| Mobile repo | `github.com/burn8887/whisco-mobile` (**public**) — Expo / EAS |
| Deploy | **Vercel project `whisco-tv`** (`prj_LipcXi3TQxYSrQMJAntLiEROePru`) — **auto-deploys `main`** |
| Prod | `https://www.whisco.tv` (canonical). `whisco.tv` apex **308 → www**. `http` → `https` |
| Robots | `Sitemap: https://www.whisco.tv/sitemap.xml` |
| Local dev | `npx next dev -p 3000` from `iptv-app` — bind `0.0.0.0`, never 127.0.0.1 |

**API paths that matter**

| path | what |
|---|---|
| `/api/mobile/v1/vod`, `/api/mobile/v1/live` | the gated catalogue. Header `X-Whisco-Store: ios` \| `android` → 8 + 8; no header → the full index |
| `/api/cron/*` | scheduled jobs (`check-vod`, `discover-vod`, `update-dizi`) — GitHub Actions, `CRON_SECRET` |
| `/api/og/guide/[slug]` | generated per-guide social card art |
| `/sitemap.xml` | 2,776 URLs |

**Hubs:** language hubs resolve via **`?shelf=<slug>`** (`/vod?shelf=turkish`), never by passing a
collection name through a query param — names containing `&` silently break that. Verify a hub by
following the redirect and **counting rendered titles**, not by reading the config.

---

## 4 · Secret inventory — NAMES AND LOCATIONS ONLY

> Never print values. Never commit any of these. Never include `.keys/` in a zip.

**Founder vault — `/home/user/.keys/` (17 files, workspace only, snapshot-safe but never shared):**

`AuthKey_B279KL3Y3K.p8` · `adsense-oauth-client.json` · `adsense-oauth.json` · `cert_id.txt` ·
`dist.csr` · `dist.p12` · `dist_3des.p12` · `dist_aes.p12` · `dist_cert.cer` · `dist_cert.pem` ·
`dist_key.pem` · `gcc_vps_ed25519` · `gcc_vps_ed25519.pub` · `github_pat.txt` ·
`gsc-service-account.json` · `vercel_token.txt` · `whisco_appstore.mobileprovision`

**Vercel — project `whisco-tv` env var names:** `ADS_TXT` · `AUTH_SECRET` · `DATABASE_URL`
*(note: no `NEXT_PUBLIC_ADSENSE_SLOT` — that is why the ad slot is null, §6)*

**GitHub Actions secret names:** `CRON_SECRET` · `DATABASE_URL` · `GCC_VPS_HOST` · `GCC_VPS_PORT` ·
`GCC_VPS_SSH_KEY` · `GCC_VPS_USER` (12 workflows in `iptv-app/.github/workflows/`)

**Local `.env` names (`iptv-app/.env`, also mirrored in `.env.example`):** `DATABASE_URL` ·
`AUTH_SECRET` · `CRON_SECRET`

**EAS / mobile:** `eas.json` profiles `development` · `preview` · `production` · `production-tv`
(the last carries `EXPO_TV`). Keystores, Apple certs and store credentials live in **EAS + the
founder's vault**, not in the repo. `ios/` must never be committed. Never run `eas build`.

**Google service account (name only):** `whisco-agent@dulcet-record-441513-s1.iam.gserviceaccount.com`
— holds **read-only** Search Console (`webmasters.readonly`) and **read-only** Android Publisher
(create edit → GET → delete; `edits.commit` is never called).

---

## 5 · Actions, the Monday job, and what must never happen

**GitHub Actions (12, in `iptv-app/.github/workflows/`):** billing-reminder · community-digest ·
channel-health-check · content-discovery · content-qa · dizi-update · gcc-geo-probe · geo-reaudit ·
incident-triage · refresh-yt-live · uptime-monitor · weekly-maintenance.

**The Monday 10:30 Asia/Bahrain GSC job** — run it, then stop:
```bash
cd /home/user && pip install pyjwt cryptography requests      # deps do not persist
python3 weekly_gsc_index.py                                   # --refresh forces a same-day re-inspect
```
It writes `gsc_weekly/YYYY-MM-DD.json`, `.md`, and `FOUNDERS_CLICK_LIST.md` (the numbered founder
hand-off), and prints the indexed share, the click count and sitemap freshness. **Scope: `/`, `/about`,
`/guides` and the 27 guide slugs. Nothing else.**

**Never — no exceptions, no clever workarounds:**

- ❌ Request indexing for any `/title/*` URL (report-only, ~2,111 of them)
- ❌ Validate fix on the noindex bucket · ❌ lift a noindex
- ❌ Add a second sitemap to the www property · ❌ bulk submission tools
- ❌ Any signed-in Google/Play UI driven by a bot · ❌ fake a click or a submit
- ❌ Press AdSense → Request review · ❌ request an AdSense unit
- ❌ Click, tick, or submit anything in Play / App Store Connect / EAS
- ❌ `eas build` · ❌ commit `ios/` · ❌ install `~/.expo` or store tokens into the workspace
- ❌ Reply to Apple · ❌ apply to Play · ❌ announce · ❌ edit store listings without a Desk ruling
- ❌ Commit `.env`, `node_modules`, `.keys/`, or any credential into either repo

---

## 6 · Snapshot — measured 2026-09-21 21:11 UTC (2026-09-22 00:11 Bahrain)

> **2026-09-22 · iOS 5.2.2 RESUBMITTED — dated fact (founder-run, ~04:44 Asia/Bahrain = 01:44 UTC).**
> Same binary **1.0 (7)** — no IPA, no EAS, no version bump. The App Review Information attachment was
> **replaced**: was `Whisco tv content rights statement build 6 .pdf` → now
> **`Whisco_TV_Build7_5.2.2_evidence.pdf`** (32,098 B: cover + build-7 rights statement + 16-row appendix).
> The notes box keeps the reviewer path (8 live named + 8 PD films), with one optional line about the new PDF
> above it. The Resolution Center carries the Desk letter. Connect status: **`READY_FOR_REVIEW`**; submission
> `c80e30c4-5e07-4911-bb77-2ed58fd09caf` unchanged. Agent confirmed this **read-only via the ASC API** on
> 2026-09-22 (attachment `fileName` match, `fileSize` 32098, `assetDeliveryState` `COMPLETE`). **Nothing else on
> Apple was touched:** no upload, no RC reply, no listing/privacy/screenshot edit, no cancellation, no
> announcement. **Now waiting on Apple — no ETA, do not inquire.**

### SHAs

| repo | branch | short | full | working tree |
|---|---|---|---|---|
| `Whisco-TV-` | `main` | last **site-affecting** merge **`9742914`** (PR #20 — `/home` cleared-store fix) | `main` = **`fc0544b`** (docs: resubmission draft set + Desk rulings log). **Do not compare this line to `HEAD`** — run `git log --oneline -10` and check whether anything after `9742914` touches `src/`; if it does, this document is stale | one known mode-only flap: `docs/business/make-signing-files.sh` (755→644, **zero content**) — never commit it |
| `whisco-mobile` | `main` | **`a7bd3e7`** | `a7bd3e7` (raw + API: `store/listing.md` deleted) | clean |
| Vercel prod | — | renders `07cc2cb` | — | READY |

**Today's web merges, for reference:** #8 `541e6c6` · #9 `eee89f4` · #10 `c75156c` · #11 `77b1ee2` ·
#12 `caeda32` · #13 `321591c` · #14 `628582a` · #16 `9cbbafc` (living-room layer, P0) · #17 `4d64c85`
(orphan mistake) · #18 `4833ac73` (P1 — the real change) · #19 `3378da2` (`legal@` everywhere).

**Open PRs: 0 on both repos.** Remote branches: **16** on `Whisco-TV-` (`build6-store-gate`,
`content-articles`, `feat/guides-desk-drafts`, `feat/guides-five-plus-chrome`, `feat/guides-wave2`,
`fix/gsc-crawl-hygiene`, `fix/home-design-system`, `fix/hub-shelf-alias`, `fix/privacy-deletion-route`,
`fix-ios-live-facets`, `geo-health-fix`, `main`, `web/living-room-layer`,
`web/p1-title-subgrid-adwell`, `web/p1-title-subgrid-adwell-v2`, `where-pages`) and **3** on
`whisco-mobile` (`build6-ios-store`, `fix-live-facets-guard`, `main`). `canonical-host-fix` was
**deleted** — do not recreate it.

### Site

| measure | value |
|---|---|
| Routes | `/` `/guides` `/vod` `/live` `/new` `/about` `/privacy` `/contact` `/terms` `/sitemap.xml` → **200**; a bad URL → **404** (branded) |
| Guides live | **27** |
| Sitemap | **2,776** = **2,111** `/title/` + **630** `/live/` + **27** `/guides/` + 8 core (`/`, `/live`, `/vod`, `/browse`, `/new`, `/guides`, `/about`, `/contact`) |
| White ad bar | **gone** — `/title` has no `Advertisement`, no `min-height:250px`; `w-title-layout` present |
| LCP (prod, measured earlier today) | H1 *"Free legal TV for Gulf households — no subscription."* @ **1,532 ms** · **CLS 0** · 0 page errors |

### Store gate (live, `X-Whisco-Store`)

| header | VOD total | shelves | live total |
|---|---|---|---|
| *none* | **16,786** | 28 | **622** |
| `ios` | **8** | 1 | **8** |
| `android` | **8** | 1 | **8** |

**`/home` re-measured 2026-09-22 with the `ios` header:** `rows` = `docs` **8** + `publicdomain` **8**, and
**no `live` row at all** — the empty labelled shelf was removed by `9742914`, so the count is **0 rows**
(the 8 live channels render as `featuredChannels` = **8**, headed "Featured live channels"). `hero` = **0**
(pre-existing, out of scope). Answer to "live row item count with the ios header": **0**.

### Ads

| measure | value |
|---|---|
| `AD_UNIT_LIVE` | **false** (no `NEXT_PUBLIC_ADSENSE_SLOT` in Vercel) |
| `AdSlot` behaviour | renders **`null`** — no ad unit anywhere on the site. **On-site ad revenue is zero, by ruling (9.2 HOLD)** |
| AdSense account | publisher id `pub-7207533964778777` · **READY**; site **NEEDS_ATTENTION** |
| AdSense last 28 days *(measured earlier today)* | 369 clicks · 1,497 impressions · avg position 30.9 |
| AdSense application | **not requested.** Gated to the 1st week of October, one attempt |

### Search Console — `https://www.whisco.tv/` (www property)

| measure | value |
|---|---|
| Indexed | **14 / 30 = 47%** — `/` · `/about` · `/guides` + **11 of 27** guide slugs |
| Needing a founder click | **16** — 11 *Discovered – currently not indexed*, 5 *URL is unknown to Google* |
| Crawled yet | **none of the 16** |
| Sitemap | **not stale** — www submitted 2,778, downloaded 2026-09-21 12:22 UTC |
| `Clicked by me` | **0 (permanent — no logged-in GSC session exists for an agent)** |

### Stores

| surface | state |
|---|---|
| Play — production access | **granted** · Dashboard 4/5 steps · last published 21 Sep 2026 |
| Play — production track | **`1.0.0 (7)`** vc 7, status `completed`; **full rollout + corrected listing copy both IN REVIEW** |
| Play — other tracks | internal `5 (1.0.0)` vc 5 · `build 7` vc 7 · `whisco.tv test` vc 7 — all `completed` |
| Play — Managed publishing | **OFF** → an approved change publishes with **no further click** |
| Play — public URL | **HTTP 404** (`tv.whisco.app`) → the gate on all promotion |
| Play — contact | website `whisco.tv/about` · email `legal@whisco.tv` · locale `en-US` |
| Play — Data safety | **Email + User ID** (unchanged, correct) |
| iOS | version 1.0 · submission `c80e30c4-5e07-4911-bb77-2ed58fd09caf` (unchanged) · **RESUBMITTED by the founder 2026-09-22 ~04:44 Asia/Bahrain on the same binary 1.0 (7)** — Connect **`READY_FOR_REVIEW`** · attachment replaced with **`Whisco_TV_Build7_5.2.2_evidence.pdf`** (32,098 B) · Desk letter pasted in the Resolution Center · **2.5.4 CLOSED** (cited 15 Sep only) · **waiting on Apple, no ETA, do not inquire** · if 5.2.2 returns: **STOP**, send the letter + any screenshot to the Desk; do not invent Option B. Brief: `/home/user/APPLE_REJECTION_20260922.md` |

---

## 7 · Standing backlog

1. **GSC click list — 16 URLs** awaiting founder clicks, quota ≈10–12/day, top-down. Machine list:
   `gsc_weekly/FOUNDERS_CLICK_LIST.md`; narrated path: `GSC_FOUNDER_CLICK_PATH_20260921.md`.
   The 5 *never-fetched* ones start the list.
2. **Next guides need Desk-named slugs.** 2 per week. **HOLD (9.8)** — nothing starts until Grok names
   them. Do not pick slugs yourself.
3. **Rive** — parked. No runtime animation work, no new dependency.
4. **`whisco-mobile/store/listing.md`** — line 27 and the Data safety rows were corrected (doc-only,
   `3ad78c8`). What remains: its **short description still carries the banned `500+` / `14,000+`
   counts**, and its body names `dizi`, `Bollywood`, `free-to-air` and an `iptv` tag. A
   **SUPERSEDED** banner now sits on the file. **Decision outstanding: delete the file, or rewrite it
   to the 8+8 catalogue.** Do not rewrite a whole description unilaterally.
5. **The `#17` orphan — closed, but remember the lesson.** `git reset --hard` after editing and before
   committing wiped four of five files; PR #17 shipped a 33-line orphan and prod stayed on old code
   while the merge read green. `#18` carries the real change. **A green merge says nothing about
   content — always confirm the deployed HTML.**
6. **APPLE 5.2.2 — RESUBMITTED, PARKED (2026-09-22).** Same binary **1.0 (7)**; App Review Information
   attachment replaced with the build-7 evidence PDF; Desk letter pasted in the Resolution Center; Connect
   `READY_FOR_REVIEW`. **Waiting on Apple — no ETA, do not inquire.** Barred: any RC reply, any build upload,
   any listing/privacy/screenshot change, cancelling the submission, announcing. **If 5.2.2 returns: STOP —
   send the letter + any screenshot to the Desk; do not invent Option B (dropping live news) unless the Desk
   says so.** Brief: `/home/user/APPLE_REJECTION_20260922.md`; draft set:
   `docs/business/APPLE_5.2.2_RESUBMISSION_DRAFT_20260922.md`.
7. **Filmhub** — outreach/call prep exists (`docs/business/Filmhub_Call_Prep.md`); no deal, no
   commitment, nothing to action from an engineering seat.
8. **W.L.L. (company formation)** — see
   `docs/business/Whisco_TV_Bahrain_Company_Formation_Guide.md`. Founder/legal workstream, not yours.
9. **Play review outcome** — unknown, no ETA, no API exposes it. Wait.
10. **`whisco-mobile/store/play-listing.md`** — corrected `cd92f2a`. Kept truthful; re-check before any
   future listing work.

---

## 8 · How a new agent ships

**Default: branch → PR → merge → verify prod.** One PR per change; keep it single-purpose.

1. Branch off fresh `main` (never work on a dirty tree).
2. Make the change. **Verify locally**: `tsc --noEmit` clean, dev server up, page 200, and the specific
   behaviour asserted with a script — not by eye.
3. **Commit, then read the staged list (`git diff --cached --stat`) before pushing.** Confirm the file
   count matches what you intended.
4. Push the branch, open the PR **with the reasoning in the body**, merge, then **poll Vercel until
   READY**, then **re-fetch the deployed HTML with a cache-buster** (`?cb=$RANDOM`) and assert the
   change is actually served. `state: READY` ≠ content live.
5. Direct-to-`main` is acceptable only for docs and for single-file fixes the Desk has explicitly
   scoped — still verify after the deploy.
6. Keep proof: screenshots and JSON asserted values, into `/home/user/proof/`. Quantise PNGs — the
   workspace snapshot cap is ~128 MB and proof folders grow fast.

**Stop and escalate — never decide these yourself:**

- Any **store letter** (Apple or Google), any rejection, any policy email → **stop, write it up, hand
  it to the founder + Desk.** Do not reply, do not "fix and resubmit".
- Anything touching Play/iOS binary, listing text, Data safety, EAS builds, AdSense.
- Any change to `/about`'s body, the tokens, the card system, the Maghrib phase, `ads.ts`,
  `X-Whisco-Store`, sitemap/noindex, or the privacy policy — all of these are under explicit holds or
  "do not touch again" rulings.
- Any new npm dependency, font, or paid service (spend > $300 one-off or > $100/mo needs the founder
  first).

---

## 9 · Read first (in this order)

1. `docs/business/Whisco_TV_Design_System.md` — **the design law** (voice rules §1.4, card spec §3.1,
   motion §2.3, perf budget §4.3)
2. `docs/business/Whisco_TV_Operating_Rules_v2.md` — how the business is run
3. `/home/user/GROK_RULINGS_20260921_EVENING.md` — the most recent rulings, verbatim + execution
4. `/home/user/DESK_RULINGS_20260921.md` — the day's ruling table
5. `/home/user/BRIEFING_FOR_GROK_WEBSITE_20260921.md` — everything the website did on 21 Sep
6. `/home/user/PLAY_LISTING_COPY_20260921.md` — listing copy state + the gate
7. `/home/user/GSC_FOUNDER_CLICK_PATH_20260921.md` — the click hand-off
8. `/home/user/proof/PROOF_PACK.md` — what was proven, and how
9. `/home/user/gsc_weekly/README.md` — the Monday job, scope, and the Option 2 lock
10. `docs/business/HANDOVER_BRIEF_20260918.md` — the prior handover (context; the file above is newer)

**Workspace-only artefacts not in any repo:** `/home/user/tools/{behaviour,shots,prod_proof,p1_proof,p1_prod_light}.js`
· `/home/user/proof/` · `/home/user/gsc_weekly/` · `/home/user/weekly_gsc_index.py` · `/home/user/*.md` briefings.

---

## 10 · First 30 minutes

1. **Clone both repos; fix `.git/config` (§0.3).** Confirm `git status --porcelain` shows only the
   `make-signing-files.sh` mode flap. If it shows anything else — someone left work uncommitted.
2. **Check the SHAs** against §6. If `main` has moved, assume this document is stale and re-measure.
3. **Prod smoke test:** the 10 routes in §6 → 200; a bad URL → 404. Then
   `curl "https://www.whisco.tv/title/cennetin-cocuklari?cb=$RANDOM"` and grep for
   `w-title-layout` (present) and `Advertisement` (**absent**).
4. **Store gate:** hit `/api/mobile/v1/vod` and `/live` with no header, `ios`, `android`. Expect
   `16,786 / 622`, `8 / 8`, `8 / 8`. Any other number means the gate broke — that is a P0.
5. **Search Console:** run `python3 weekly_gsc_index.py` and read the share. Do **not** click anything.
6. **Vercel:** confirm the newest deployment is READY and matches `main`.
7. **Read §9 items 1–4** before touching code.
8. **Report to the founder:** SHAs, gate numbers, indexed share, and the one-line answer to
   *"is production healthy?"* — then ask what to work on. The current gate on site work is
   **Play public URL 200**, or the **Desk naming two guide slugs**, or a **store letter**.

---

## Packing the zip (if a zip is produced)

**Include:** the two repos (working trees), `/home/user/tools`, `/home/user/proof`, `/home/user/gsc_weekly`,
the dated `/home/user/*.md` briefings, and this file.
**Exclude:** `.keys/` (**never**), any `.env` / `.env.*`, `node_modules/`, `.next/`, `.cache/`,
`.vercel/`, `dist/`, `build/`, and any signing material (`.p12`, `.p8`, `.mobileprovision`, `.pem`).

---

*End of handover. If you are reading this more than a few days after the timestamp above, re-measure
everything in §6 before acting — the repos and production are the source of truth, not this file.*
