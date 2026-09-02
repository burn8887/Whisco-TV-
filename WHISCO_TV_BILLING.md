# WHISCO TV — BILLING & SUBSCRIPTIONS LEDGER
*Last updated: 2026-09-02-b (unchanged amounts; iOS submitted for review — no new costs). Canonical copy in workspace + iptv-app repo root. Re-upload to Grok/Claude project after every change.*

## Monthly expenses

| # | Vendor | What it pays for | Amount | Billing day | Payment method | Status |
|---|--------|------------------|--------|-------------|----------------|--------|
| 1 | **Vercel** (Pro) | Website hosting, deploys, cron | **$20.00/mo** (⚠️ confirm no $10 Speed Insights add-on — user to verify a $20 not $30 charge) | ~22nd (user to confirm from invoice) | Card | Active |
| 2 | **Neon** (Launch) | Postgres DB — entire catalog | **~$5–15/mo usage-based** ($5 minimum + compute/storage; Sep 2026 charge ≈ $10) | 1st of month | Card | Active — ✅ Sep charge is CORRECT & CHEAPER than the old $19 flat plan (Neon moved Launch to usage-based pricing) |
| 3 | Expo / EAS | Mobile app cloud builds + keystore | $0 (free tier) | — | — | Active |
| 4 | GitHub | Repos + Actions automations | $0 (free tier) | — | — | Active |
| 5 | Google Search Console / AdSense | SEO + (pending) ad revenue | $0 | — | — | Active |
| **TOTAL monthly (committed)** | | | **~$25–35/mo** | | | |

## Annual expenses

| # | Vendor | What it pays for | Amount | Renewal date | Reminder month |
|---|--------|------------------|--------|--------------|----------------|
| A1 | **Apple Developer Program** | iOS App Store presence | **$99/yr** | ~2026-09-01 → renews **2027-09-01** | August 2027 |
| A2 | **Spaceship** (whisco.tv domain) | The domain itself + email forwarding | ~$25–35/yr (user to confirm exact from Spaceship invoice) | Registered 2026-08-20 → expires **2027-08-20** (verified via RDAP 2026-09-02) | July 2027 |

## One-time (already paid — for the record)

| Vendor | What | Amount |
|--------|------|--------|
| Google Play Console | Developer account | $25 (paid Aug 2026) |

## Budget context

- Investor budget: **$200/mo**
- Committed run-rate: ~$25–35/mo infra + $99/yr Apple (≈ $8/mo amortized) → **≈ $43/mo worst case**
- Headroom: ~$155/mo → earmarked: Meta ads ~$110/mo (post-AdSense approval) + content/CDN budget (see CONTENT BUDGET note)
- CONTENT BUDGET (approved 2026-09-02, up to $300): see handover §content-acquisition

## Reminder system (automated)

- GitHub Actions workflow `.github/workflows/billing-reminder.yml` in iptv-app repo opens a **GitHub Issue titled "🧾 Monthly billing pre-check"** on the **25th of every month at 05:00 UTC** → GitHub emails burn8887@gmail.com automatically.
- The issue contains the checklist: card has funds ≥ $40; Neon charge on the 1st (~$5–15); Vercel charge ~22nd ($20, flag if $30); annual items flagged in July/August 2027 issues.
- Agent duty each session that touches money/subscriptions: update THIS file, copy to repo, push.
- Grok/Claude project duty: user re-uploads this file (with the 2 continuity docs) after every update.

## Payment failure playbook (what actually breaks and how fast)

| Vendor | If payment fails | Grace | Recovery |
|--------|------------------|-------|----------|
| Vercel | Site + crons DOWN after grace emails | days | pay → auto-restores; DNS untouched |
| Neon | DB suspended (site shows errors, app APIs fail) | days | pay → instant resume; catalog snapshots in repo = worst-case rebuild |
| Spaceship | Domain expiry = TOTAL outage + email loss | 30-day grace + ~30-day redemption ($$) | renew BEFORE 2027-08-20; consider multi-year renewal |
| Apple | App REMOVED from App Store (not from installed phones) | ~30 days emails first | renew membership → app restored |
