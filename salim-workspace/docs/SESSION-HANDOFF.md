# Session hand-off — Salim / سالم

_Written 21 October 2026 so a new chat can continue without the old conversation. Read this
first, then `PROJECT-HISTORY.md` and `MIGRATION-TO-OWN-REPO.md`._

## 1. What the product is

**Salim** — a Bahrain-first, GCC-wide road-awareness app. Two native apps (SwiftUI iOS,
Kotlin/Compose Android) plus a React browser demonstrator and a shared geospatial engine.
Positioning: calm, direction-aware alerts for cameras, hazards, speed bumps and average-speed
sections. **All alert data is fictional.** Nothing has been published, signed for distribution or
tested on a physical device.

| Fact | Value |
| --- | --- |
| English name | **Salim** (unchanged, approved) |
| Arabic name | **سالم** (corrected 21 Oct 2026 from the wrong spelling سليم) |
| Bundle identifier, both platforms | **`com.salimdrive.app`** — permanent, not yet registered with Google or Apple |
| Store title | **Salim — Road Awareness** |
| Domain | `www.salimdrive.com` — **not live**, no A record as of 21 Oct 2026 |
| Support email | `support@salimdrive.com` |
| Legal / privacy email | `legal@salimdrive.com` |
| Operating entity | **Ali Sameer Sadeq Mohamed Albaharna** (an individual, not a company) |
| Repositories | `burn8887/Whisco-TV-` (public, contains the capsule) and `burn8887/salim-drive` (**private, unreachable from the sandbox**) |

## 2. Where the code lives

Salim still lives **inside `burn8887/Whisco-TV-`** under `salim-workspace/`, because the private
target repository cannot be written to from this environment.

| Ref | State |
| --- | --- |
| `main` | `82a6fc5` — the merged capsule (93 Salim files, 3 workflows). Untouched. |
| Working branch | `arena/c7456ad8-whisco-tv` — pushed, **not merged**, no PR opened |

Nothing outside `salim-workspace/` and the three Salim workflow files has ever been modified. Verify
with:

```sh
git diff --stat 82a6fc5..HEAD -- . ':(exclude)salim-workspace'
```

It must print nothing. That is the guarantee the Founder cares about most.

## 3. The regenerable migration (the important part)

The standalone tree is **generated**, not copied:

```sh
cd Whisco-TV-
python3 salim-workspace/tools/promote.py --output /home/user/salim-drive --verify
```

Expected: `Verification passed.` Failures are printed as `FAIL …`.
The script writes a fresh tree, refuses to clear a directory that does not look like a previous
promotion, and preserves an existing `.git`.

It performs, in order: copy the four app trees, drop `materialize.py` / `verify_isolation.py`,
strip `.source` suffixes, move the Android package from `app/salim` to `com/salimdrive`, rewrite
identifiers and documentation paths, rewrite the three workflows line-by-line (no regex on YAML
quoting), then verify.

**Never hand-edit the generated tree** — a workspace reset destroys it and the edit is lost. Change
the capsule, regenerate.

## 4. Verified, and not verified

Verified on the generated tree (`--verify`, plus a separate `npm` run):

- 18 Python tests in `tools/`
- `tools/check_workflows.py` — three workflows, paths resolve, signed release manual-only
- `tools/check_site.py site` — 3 pages, no forbidden claims, **no placeholders left**
- 6 browser engine tests, production web build, `deploy/index.html` ≈ 708 KiB

**Not verified — never quote these as current:**

- No native build has run in the new layout. The green Android run `39418531146` (24 JUnit, 16 KB
  ZIP alignment) and iOS run `39418444930` (9 XCTest) were built from the capsule.
- No signing, no upload, no device test, no store record.
- `www.salimdrive.com` is not serving anything.

## 5. The blocker

`git push` to `burn8887/salim-drive` returns **403 "Write access to repository not granted."**
Diagnosed: the session credential can reach `Whisco-TV-` and `whisco-mobile`, and **both are
public**; it cannot reach the private repository. Adding the repo to the GitHub App installation
did not change it, because the limit is in the credential, not the selection.

Three routes, all needing the Founder's decision:

1. **Manual push** from a machine with write access, using the bundle:
   ```sh
   git clone -b main salim-drive-migration.bundle salim-drive
   cd salim-drive
   git remote set-url origin https://github.com/burn8887/salim-drive.git
   git push -u origin main
   ```
2. **Brief public window** — flip the repo public, push, flip back. Needs explicit consent.
3. **Reconnect GitHub in a new chat** (this option, chosen 21 Oct 2026) — now safe because the
   capsule is committed and pushed, so a new session inherits everything.

Bundle path: `/home/user/salim-drive-migration.bundle`. A workspace reset deletes it; regenerate
the tree first, then `git bundle create <file> HEAD main`.

## 6. Standing instructions from the Founder

- **No change to any GitHub repository or workflow without the Founder's direct consent.**
- Nothing from Whisco TV, Whisco Mobile or any other app may be touched, disrupted or affected.
- **Never ask for or accept a token, password or 2FA code in chat.** Route access through the
  Arena GitHub connector or a manual push.
- The Founder cannot edit the GitHub connection inside a running chat; only in a new one.
- His overriding concern is **loss of context**. Anything that matters must be committed, not left
  in a chat.
- Exact-path tracked checkpoints only. No `git add -A` in the host repository.
- Emails: only `support@` and `legal@salimdrive.com`. Do not invent others.
- Never describe the signing workflow as working until it has actually run.

## 7. Naming rules

- English: **Salim**. Never "Salim App", "Salim Road" or "Salim Drive" in body copy.
- Arabic: **سالم**. Never **سليم** — that is a different word (*Saleem*). The product name takes no
  definite article.
- Bilingual lockup, Latin first: `salim.` **سالم** — used on the site header and the browser
  demonstrator. The native apps show the Latin wordmark only.
- Pronunciation: *SAA-lim*.
- A "Salem Drive" rename was assessed and rejected: `salemdrive.com` is registered and parked at
  Namecheap. Full cost table in `NAME-CHANGE-ASSESSMENT.md`.

## 8. Release secrets — nothing exists yet

The third workflow, `release-signing.yml` (capsule: `salim-release-signing.yml`), is manual-only
and **has never run**. With no environment and no secrets it fails closed at its first guard. When
the Founder is ready, in `burn8887/salim-drive` **only**:

Environment `salim-release`, required reviewer, branch `main`. Then 10 secrets:

- Android: `SALIM_ANDROID_KEYSTORE_BASE64`, `SALIM_ANDROID_KEYSTORE_PASSWORD`,
  `SALIM_ANDROID_KEY_ALIAS`, `SALIM_ANDROID_KEY_PASSWORD`, `SALIM_ANDROID_CERT_SHA256`
- Apple: `SALIM_APPLE_TEAM_ID`, `SALIM_APPLE_CERT_P12_BASE64`, `SALIM_APPLE_CERT_PASSWORD`,
  `SALIM_APPLE_PROFILE_BASE64`, `SALIM_APPLE_PROFILE_NAME`

Never reuse another app's keystore or certificate. Create the environment **before** the first
run, or GitHub silently creates an unprotected one. The manual run needs
`confirm_identity = com.salimdrive.app` exactly.

## 9. Next steps, in order

1. Get the tree into `burn8887/salim-drive` (route 1, 2 or 3 above).
2. Confirm the two build workflows go green **in the new layout** — the old green runs do not count.
3. Publish `www.salimdrive.com` (Netlify drag-and-drop of `deploy/`, then DNS), because both stores
   require working privacy and support URLs.
4. Create `salim-release` and the 10 secrets; run the signed build; download the artifacts.
5. Play closed testing, then TestFlight. The first upload locks `com.salimdrive.app` forever.
6. Optional and consent-gated: open a PR to merge `arena/c7456ad8-whisco-tv` into `main`; retire
   the capsule once the new repository is live.

## 10. Command reference

```sh
# capsule checks
python3 -m unittest discover -s salim-workspace/tools -p 'test_*.py'
python3 salim-workspace/tools/check_workflows.py
python3 salim-workspace/tools/check_site.py salim-workspace/site --allow-placeholders
python3 salim-workspace/tools/build_deploy.py --allow-placeholders

# regenerate and verify the standalone tree
rm -rf /home/user/salim-drive
python3 salim-workspace/tools/promote.py --output /home/user/salim-drive --verify
cd /home/user/salim-drive && npm --prefix web ci && npm --prefix web test && npm --prefix web run build
python3 tools/build_deploy.py

# commit the generated tree and package it
git init -q -b main && git add -A && git commit -m "Initial migration of Salim into its own repository"
git bundle create /home/user/salim-drive-migration.bundle HEAD main
```
