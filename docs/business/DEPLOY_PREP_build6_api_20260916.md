# DEPLOY PREP — build6-store-gate (API only)
**Prepared 2026-09-16. NOT RUN. Waiting on DEPLOY YES.**
Scope: the mobile API and the public-listing exclusion. **Not the homepage. Not chrome.**

---

## WHY THIS DEPLOY IS NEEDED (two reasons, both real)

1. **The acceptance test needs it.** The founder's curl hits `https://www.whisco.tv/api/mobile/v1/live`. Production currently runs the *pre-build-6* code, so the store gate is not live there and `X-Whisco-Store: ios` cannot return the cleared rows no matter what is ticked.

2. **It fixes a live defect I caused.** Seeding wrote to the shared production database. The exclusion that keeps App-Store-only rows out of the public listing lives only on the branch, so right now:
   ```
   production /api/mobile/v1/live  ->  total=625
   duplicates on page 1            ->  {'France 24 English': 2, 'DW English': 2}
   ```
   **A visitor to whisco.tv sees each broadcaster twice.** This deploy is the fix.

---

## WHAT SHIPS

Branch `build6-store-gate` @ `f2444c1` (plus the pack rewrite commit).

| File | Change |
|---|---|
| `src/lib/store-gate.ts` | `X-Whisco-Store: ios` detection; `IOS_HEADERS` (`private, no-store` + Vary); `PUBLIC_HEADERS` |
| `src/lib/store-ios.ts` | cleared-only queries for live, home, vod, channel, title |
| `src/lib/store-public.ts` | **NEW** — subtracts `sourceKind='youtube-live'` rows from the public listing, totals, facets and language chips |
| `src/app/api/mobile/v1/live/route.ts` | iOS branch + public exclusion |
| `src/app/api/mobile/v1/{home,vod}/route.ts` | iOS branch |
| `src/app/api/mobile/v1/channel/[id]/route.ts` | iOS branch, hard 404 when uncleared |
| `src/app/api/mobile/v1/title/[slug]/route.ts` | iOS branch, hard 404 when uncleared, adds `rightsBasis`/`evidenceUrl`/`uploaderUrl` |
| `src/app/(app)/live/page.tsx` | same public exclusion, so the website page matches the API |

**What this deploy does NOT include:**
- **No homepage change.** No chrome, no hero, no layout.
- No cron change, no schema change, no seeded-row change.
- `cached.ts` is **untouched** (the lock forbids gating it; `grep` for the gate in that file returns 0 matches).
- The Android app and the website continue to receive the **fat** catalogue — they send no header. This is the whole reason the gate is header-based rather than a default.

---

## PRE-DEPLOY CHECKLIST

| # | Check | Result |
|---|---|---|
| 1 | `npx tsc --noEmit` | **exit 0** (run on branch) |
| 2 | No header → fat, with the iOS-only rows excluded | **local 623** = 625 active − 2 |
| 3 | Header → cleared only | **local 0 rows** (nothing ticked yet) |
| 4 | iOS deep link to uncleared channel | **404** (no header: 200) |
| 5 | iOS deep link to uncleared title | **404** (no header: 200) |
| 6 | Public search "France 24" → no embed row | **3 HLS rows only, no duplicate** |
| 7 | `cached.ts` ungated | **0 matches** |
| 8 | Homepage contains no iOS-only row | **0 occurrences on production** |
| 9 | Freeze (16–19 Sep) compliance | **API + workflow files only. No production site chrome, no homepage.** |

---

## THE EXACT COMMAND SEQUENCE (for when DEPLOY YES arrives)

The founder runs the deploy; I do not have deploy credentials.

1. **Merge the branch to the deploy branch.**
   ```
   the branch is build6-store-gate @ <sha>
   ```
   If Vercel deploys from `main`, merge `build6-store-gate` → `main` (fast-forward if possible).

2. **Vercel picks it up automatically.** No manual step, unless the project is configured for manual promotion.

3. **Wait for the deployment to go READY**, then run the verification — *this is the acceptance test:*

```
# (a) public: no duplicates, and the iOS-only rows are gone from the listing
curl -s https://www.whisco.tv/api/mobile/v1/live | python3 -c "
import json,sys; d=json.load(sys.stdin)
n=[c['name'] for c in d['channels']]
print('total', d['total'], '| rows', len(n), '| dupes', len(n)-len(set(n)))
print('embed rows leaking:', sum(1 for c in d['channels'] if 'youtube.com/embed' in (c.get('streamUrl') or '')))"

# expected: total 623, dupes 0, embed rows leaking 0

# (b) iOS header: exactly the cleared rows
curl -s -H 'X-Whisco-Store: ios' https://www.whisco.tv/api/mobile/v1/live | python3 -c "
import json,sys; d=json.load(sys.stdin)
print('total', d['total'], 'rows', len(d['channels']))
print([c['name'] for c in d['channels']])"

# expected after the ticks: total 2, rows 2 -> ['DW English', 'France 24 English']

# (c) search still finds the original rows, exactly once each
curl -s 'https://www.whisco.tv/api/mobile/v1/live?q=France+24' | python3 -c "
import json,sys; d=json.load(sys.stdin)
print([(c['name'], 'youtube' in (c.get('streamUrl') or '')) for c in d['channels']])"
```

4. **If (a) shows duplicates or any youtube-live row**, the deploy did not take — stop and report; do not proceed to `eas build`.

---

## ROLLBACK

The deploy is a code deploy on one branch. Rollback = promote the previous Vercel deployment from the dashboard, or revert the merge commit and let it redeploy. **No data migration is involved, so rollback cannot lose anything**: the two seeded rows and the four title rows are data, and they survive either way.

---

## AFTER THE DEPLOY — ORDER OF OPERATIONS

1. Founder replies **TRUE** → tick exactly these four, `clearedBy: Ali`:
   - `cmu4b0gpy000011a19c6r66q0` (France 24 English)
   - `cmu4b0hup000111a1qeev0ylr` (DW News)
   - `cmsor4dia00x0nn71q6mhzvyi` (American Look)
   - `cmsor4ecn015cnn71sderx8st` (A Word to the Wives)
   **Park Conscious and All About Polymorphics stay false. Everything else stays false.**
2. Run the acceptance test above. Expect **2 live rows**.
3. Only then: `eas build --platform ios --profile production`, read the EAS counter (never assume 6), unzip the IPA, confirm `UIBackgroundModes` prints **ABSENT**.

**No homepage deploy. No Apple reply. No Play action.**
