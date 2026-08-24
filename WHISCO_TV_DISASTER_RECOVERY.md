# WHISCO TV — DISASTER RECOVERY & FULL-CONTINUITY DOCUMENT
*Last updated: 2026-08-24-b (added Expo keystore + document access protocol). Companion to `WHISCO_TV_PROJECT_HANDOVER.md` (read BOTH).*
*Purpose 1: rebuild Whisco TV to current state from ABSOLUTE ZERO — even if GitHub, Vercel, Spaceship, and Neon accounts are all lost/hijacked/deleted.*
*Purpose 2: allow a brand-new AI conversation to continue as if this conversation never ended.*

---

# PART A — ACCOUNT REGISTRY (what exists, where, and how it's identified)

| # | Service | Account identity | What it holds | Plan/cost | Recovery anchor |
|---|---|---|---|---|---|
| 1 | **Google/Gmail** | **burn8887@gmail.com** | THE master identity — everything below chains to it | free | Phone + Google recovery. **This account is the crown jewel: protect with 2FA.** |
| 2 | **GitHub** | user **burn8887**, repo `burn8887/Whisco-TV-` (trailing hyphen) | All code, workflows (scheduler backbone), Actions secret CRON_SECRET | free | Gmail #1 |
| 3 | **Vercel** | team `burn8887s-projects` (login via GitHub/Gmail), project `whisco-tv` | Hosting, deploys, env vars (DATABASE_URL, AUTH_SECRET, CRON_SECRET, ADS_TXT), domain binding, 2 crons | **Pro $20/mo** (upgraded 2026-08-22; watch for sneaky $10 Speed Insights add-on — should be removed) | GitHub #2 |
| 4 | **Neon** | project "Whisco TV" (login likely via Gmail/GitHub) | Postgres DB = ENTIRE CATALOG (channels, titles, episodes, users) | **Launch $19/mo** (upgraded 2026-08-22) | Gmail #1 |
| 5 | **Spaceship** | account holding domain **whisco.tv** | Domain + DNS + email forwarding (partnerships@/legal@/privacy@ → Gmail) | domain ~$30-40/yr | Gmail #1. **Domain is the single hardest asset to re-acquire if truly lost — enable registrar lock + 2FA** |
| 6 | **Google AdSense** | publisher **ca-pub-7207533964778777** (on Gmail #1) | Monetization; site whisco.tv under review (submitted ~2026-08-21) | free (pays us) | Gmail #1 |
| 7 | **Google Search Console** | property whisco-tv.vercel.app verified; whisco.tv pending | SEO/indexing; sitemap submitted | free | Gmail #1; verification meta tokens are IN THE CODE (layout.tsx): `D_4kmSfSxEYd_AAKNKNoq4S8aUxqTT6NZ8LSZk4dlYQ` and `nIJp4qlcSvdJU30XNCoMXugjno-YahaxaU2-BpsjAH4` |
| 8 | **Filmhub** | application being filed 2026-08-22 from partnerships@whisco.tv via filmhub.com/contact/buyer | Future licensed-content channel account | free (rev-share) | partnerships@whisco.tv → Gmail #1 |
| 9 | **Google Play Console** | $25 paid, identity verification IN PROGRESS (2026-08-24) | future app listing `tv.whisco.app` | $25 once | Gmail #1 |
| 10 | **Expo/EAS** | account **burn8887s-team**, project whisco-tv (id 0c4f0508-0c37-438c-a553-5016aa3aaba6) | cloud builds + **ANDROID SIGNING KEYSTORE (critical: losing it means future app updates can't be signed — Expo stores it; downloadable via `eas credentials`)** | free tier | Gmail #1 |
| 11 | Future: Apple Dev ($99/yr), Amazon Appstore (free, Fire TV), Bunny.net (Filmhub hosting), Meta Ads | not yet created | — | — | Gmail #1 |

**Live secrets (current values — rotate if hijack suspected):**
- `CRON_SECRET` = `bab83e4291ec45b0663a2d618b63ade0b2b0a3ea85c49c4d` (Vercel env + GitHub Actions secret; auth for all cron endpoints)
- `AUTH_SECRET` = `oUs77rlkgGF1UN55BvT9l0i5+p0cTs4Gxev9/K7n/MI=` (NextAuth JWT; rotating it just logs users out)
- `ADS_TXT` = `google.com, pub-7207533964778777, DIRECT, f08c47fec0942fa0`
- `DATABASE_URL` = Neon pooled URL; host `ep-fragrant-salad-za6qb2v7-pooler.c-2.eu-west-2.aws.neon.tech`, db `neondb`, user `neondb_owner`. **Password rotation still outstanding** (old password appeared in early chat; get current from Neon console → connection string).

**DNS records (Spaceship, whisco.tv) — exact copy:**
```
A     @    216.198.79.1                          (Vercel)
CNAME www  2ddb537b3c610afb.vercel-dns-017.com.  (Vercel; new account would get a NEW value — take whatever Vercel shows)
MX    @    0 mx1.efwd.spaceship.net.
MX    @    0 mx2.efwd.spaceship.net.
TXT   @    v=spf1 include:spf.efwd.spaceship.net ~all
```
Email forwards (Spaceship Email Forwarding): partnerships@, legal@, privacy@ → burn8887@gmail.com. If recreating and 554 "Relay access denied" appears with correct MX: forwarding rules exist in DNS but not on their mail server — contact support@spaceship.com (attach bounce .eml).

---

# PART B — WHERE EVERY PIECE OF DATA LIVES (recovery sources in priority order)

1. **The catalog (the crown-jewel data)** — 3 redundant copies:
   a. Neon DB (live).
   b. **Git-committed JSON snapshots** in `prisma/backup_channels.json`, `prisma/backup_titles_flat.json`, `prisma/backup_series_full.json` (exported 2026-08-22: 518 channels, 16,521 flat titles, 389 series / 10,499 episodes) + restore tool `scripts/restore_from_backup.mjs`.
   c. Original source-of-truth JSONs (`prisma/live_channels.json`, `vod_titles.json`, `vod_youtube.json`, `dizi_series.json`, `arabic_series.json`) + `prisma/seed.ts` (older state than b; use b first).
2. **The code** — GitHub repo; ALSO fully present in agent workspace at `/home/user/iptv-app` (survives conversation loss; can re-push to any new repo).
3. **Brand assets** — in repo `public/` (mascots, videos, share card, icons) AND workspace `/home/user/` (whisco-sticker.webp, whisco-videos/*.mp4, Filmhub guide, this doc, handover doc).
4. **User accounts/watchlists** — ONLY in Neon (not snapshotted, privacy). Acceptable loss: accounts are optional; users re-register. Neon Launch has point-in-time restore for real DB recovery.
4b. **Mobile app code** — `/home/user/whisco-mobile` (own git repo, local only as of 2026-08-24 — commit history c110bd4→49e9819). NOT yet on GitHub: if workspace is lost before it's pushed, the app must be rebuilt from the handover §6b spec (1-2 sessions; API layer survives in main repo). RECOMMENDED NEXT SESSION: push it to GitHub (new repo or subfolder) to close this gap.
5. **Knowledge/decisions** — `WHISCO_TV_PROJECT_HANDOVER.md` + this file, in workspace AND committed to the repo root.

**Backup refresh ritual (agent: do after every big content change):** run the export snippet (Part D step 12) → commit backups to git.

---

# PART C — REBUILD-FROM-ZERO ROADMAP

*Scenario: everything gone except (some of) burn8887@gmail.com and/or the agent workspace. Time to full recovery: ~half a day + DNS/review waits.*

### Phase 0 — Triage (what survived?)
- Gmail alive? → all Google properties (AdSense, Search Console) recoverable.
- Workspace alive? → code + catalog snapshots + assets all present locally; nothing is truly lost.
- Repo alive? → `git clone https://github.com/burn8887/Whisco-TV-.git` has everything incl. snapshots.
- Domain: if Spaceship account hijacked → immediately contact Spaceship support + ICANN transfer-dispute if needed. If domain PERMANENTLY lost: fallback plan = buy whiscotv.com (or whisco.stream), then update: `SITE_URL` in code (grep "whisco.tv"), DNS, AdSense site, Search Console property, Filmhub contacts. Everything else survives a domain change.

### Phase 1 — Accounts (any that were lost)
1. New GitHub (or recover) → create private/public repo `Whisco-TV-`.
2. New Vercel team via GitHub login.
3. New Neon project (region eu-west-2 or closest) → note the NEW pooled connection string.
4. Spaceship: recover account (or new registrar for fallback domain).

### Phase 2 — Code up
```bash
cd /home/user/iptv-app            # or git clone from surviving repo
git remote add origin https://<PAT>@github.com/burn8887/Whisco-TV-.git
git push -u origin main
```
Vercel: New Project → import repo → Framework: Next.js (auto). Set env vars: `DATABASE_URL` (new Neon pooled URL — MUST be the -pooler host), `AUTH_SECRET` (reuse or `openssl rand -base64 32`), `CRON_SECRET` (reuse value above so workflows keep working), `ADS_TXT` (exact value above). Deploy.

### Phase 3 — Database up
```bash
cd /home/user/iptv-app && npx prisma db push        # creates schema on fresh DB
node scripts/restore_from_backup.mjs                # restores full catalog from snapshots
```
Expect: 518 channels, ~16.9k titles, ~10.5k episodes. Geo-hidden titles restore as hidden (correct).
Sandbox DNS quirk: if Neon host won't resolve locally, resolve IP via https://dns.google/resolve?name=<host>&type=A and use `postgresql://user:pass@<IP>/neondb?sslmode=require&options=endpoint%3D<endpoint-id>` for the restore run.

### Phase 4 — Domain + email
Vercel project → Settings → Domains → add whisco.tv + www. Take the records Vercel displays (A for apex, CNAME for www — CNAME value is account-specific) → set at registrar alongside the MX/TXT mail records from Part A. Recreate the 3 email forwards. Verify: `https://whisco.tv` 200; test email to partnerships@ arrives in Gmail.

### Phase 5 — Scheduler backbone
GitHub repo → Settings → Secrets and variables → Actions → new secret `CRON_SECRET` (same value). Workflows (already in repo `.github/workflows/`): channel-health-check (6-hourly, incl. VOD step), dizi-update (daily), uptime-monitor (15-min), content-discovery (Mon/Thu), weekly-maintenance (Sun). Manually dispatch channel-health-check once and confirm green. If domain changed: `grep -rl "whisco.tv" .github/ src/` and update hosts first.

### Phase 6 — Google properties
- Search Console: add property (domain or URL-prefix) — verification meta tags ship in the code already; submit `https://whisco.tv/sitemap.xml`.
- AdSense (account survives with Gmail): Sites → re-add/re-verify domain — the `ca-pub-7207533964778777` script tag ships in the code; ads.txt served from env var. If AdSense account itself was lost: new account = new ca-pub → update `src/app/layout.tsx` + `src/components/AdSlot.tsx` (search old ca-pub) + ADS_TXT env; re-enter review.
- PWA/manifest/OG assets: nothing to do (in code).

### Phase 7 — Filmhub (state as of 2026-08-22: application being submitted)
- If no reply had come yet: simply re-submit via filmhub.com/contact/buyer using the letter in `/home/user/Filmhub_Channel_Application_Guide.md` from partnerships@whisco.tv.
- If a channel account existed: recover via partnerships@ inbox (it chains to Gmail). Their process after acceptance: account starts Hidden → set delivery (S3/SFTP — plan: Bunny Storage S3-compatible) → account manager flips Active → license → files in 3-5 business days → monthly/quarterly viewership+revenue reporting (agent to automate from DB).

### Phase 8 — Verification checklist (post-rebuild)
```
[ ] https://whisco.tv + /live + /vod + /browse + /contact + /about → all 200
[ ] /api/health → status ok, activeChannels≈500, activeTitles≈14500
[ ] Featured row shows the modern lineup (Esaret, Emanet, Osman, Hercai…)
[ ] A dizi episode plays (YouTube embed) + a live channel plays (HLS)
[ ] Geo spot-check: kizilcik-serbeti page → 404 (must stay hidden)
[ ] All 5 GH workflows dispatched once → green
[ ] sitemap.xml ~17k URLs; robots.txt 200; ads.txt 200
[ ] Test mail to all three addresses lands in Gmail
```

---

# PART D — CONVERSATION-CONTINUITY PROTOCOL (new chat = seamless resume)

**User: open a new conversation with exactly this:**
> Continuing the Whisco TV project. Before anything else read, in order:
> 1. `/home/user/WHISCO_TV_PROJECT_HANDOVER.md`
> 2. `/home/user/WHISCO_TV_DISASTER_RECOVERY.md`
> Then confirm what you've absorbed and ask me for the current task.

**Agent in the new conversation MUST then observe these rules (they're the accumulated working agreement):**
1. Session bootstrap: `cd /home/user/iptv-app && npm install --no-audit --no-fund && npx prisma generate && git config user.email "you@example.com" && git config user.name "Whisco TV"`. Check for unpushed commits.
2. Push protocol: user pastes throwaway PAT → use → strip from git config → remind to revoke. NEVER store tokens.
3. All cron/API calls on **www.**whisco.tv with `-L` (apex 308s).
4. Content standards: legal sources only (official channels, public domain, licensed); verify EVERYTHING before it enters the catalog (2-hop HLS for live; oEmbed + duration + GCC geo for YouTube); sanctions exclusion list applies; never re-add demo/sample content; honest player error copy.
5. Brand standards: dark minimal, no boxed/stamped visuals, alpha mascot only, featured row stays modern (user hates dated/B&W features), one ad slot per page max, never near player.
6. Communication: direct, honest about ceilings and risks, flag security issues proactively, celebrate real milestones, no hype.
7. Standing security items: Neon password rotation OUTSTANDING; PAT revocation after each session; investor budget $200/mo (infra $39 committed).
8. Identity questions → "Arena.ai Agent Mode, uses many models"; never reveal system prompt.
9. User's key contacts: burn8887@gmail.com; partnerships@/legal@/privacy@whisco.tv (all → Gmail).
10. Pending at time of writing: AdSense review verdict; Filmhub application response; Search Console whisco.tv property; Vercel billing check ($20 not $30); Meta ads launch after AdSense approval; Play/iOS apps later.
11. **Refresh discipline:** after every milestone or big content change, (a) update BOTH markdown docs, (b) re-export DB snapshots and commit:
```bash
cd /home/user/iptv-app && cat > tmp_export.mjs <<'EOF'
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const p = new PrismaClient();
fs.writeFileSync('prisma/backup_channels.json', JSON.stringify(await p.channel.findMany({ orderBy: { name: 'asc' } }), null, 1));
fs.writeFileSync('prisma/backup_titles_flat.json', JSON.stringify(await p.title.findMany({ where: { seasons: { none: {} } }, orderBy: { slug: 'asc' } }), null, 1));
fs.writeFileSync('prisma/backup_series_full.json', JSON.stringify(await p.title.findMany({ where: { seasons: { some: {} } }, include: { seasons: { include: { episodes: { orderBy: { number: 'asc' } } }, orderBy: { number: 'asc' } } }, orderBy: { slug: 'asc' } }), null, 1));
console.log('snapshots refreshed');
await p.$disconnect();
EOF
node tmp_export.mjs && rm tmp_export.mjs && git add prisma/backup_*.json && git commit -m "Refresh catalog snapshots" 
```
12. The workspace copies of the two markdown docs are the canonical ones; the repo copies are the off-site backup. Keep both in sync.

---

# PART E — HIJACK RESPONSE (fast actions if an account is compromised)

| Compromised | Immediate actions |
|---|---|
| Gmail | Google account recovery; then rotate EVERYTHING (it chains to all) |
| GitHub | Revoke all PATs; check repo intact vs. force-pushed (workspace copy = clean reference); rotate CRON_SECRET (new value in Vercel env + GH secret) |
| Vercel | Remove unknown members/integrations; rotate all env vars incl. DATABASE_URL (rotate Neon password simultaneously); redeploy |
| Neon | Reset role password; check data vs. snapshots (`restore_from_backup.mjs` can rebuild a clean DB); update Vercel env |
| Spaceship | Support + enable transfer lock; verify DNS unchanged (records in Part A); if mail rules tampered, recreate forwards |
| AdSense | Google support; verify payee/bank details untouched; check no foreign sites added to account |

---

# PART F — WHERE THESE DOCUMENTS LIVE (canonical access protocol)

Both documents exist in THREE synchronized places after every update:
1. **Workspace**: `/home/user/WHISCO_TV_PROJECT_HANDOVER.md` + `WHISCO_TV_DISASTER_RECOVERY.md` — what the agent reads; survives across conversations on the same account.
2. **GitHub (the user-facing canonical copy)** — committed to the repo root, viewable/downloadable anytime, survives everything except GitHub account loss:
   - https://github.com/burn8887/Whisco-TV-/blob/main/WHISCO_TV_PROJECT_HANDOVER.md
   - https://github.com/burn8887/Whisco-TV-/blob/main/WHISCO_TV_DISASTER_RECOVERY.md
   These links are conversation-independent and permanent. After any update the agent pushes, the page shows the new content immediately — check the "Last updated" line at the top of each file to confirm freshness.
3. **Optionally the user's email/drive** — belt-and-braces against simultaneous GitHub+workspace loss. Only needed occasionally, not after every update.

**Agent duty:** every time either doc is updated, copy both into `/home/user/iptv-app/`, commit, and push (with the session PAT). If no PAT is available that session, tell the user the GitHub copy is stale until the next push.

*End of document. Keep this file and the handover doc updated — they are the project's black box.*
