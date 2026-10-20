# Migration to `burn8887/salim-drive` — 20 October 2026

Salim now lives in its own private repository. This capsule is the **archive** of how it was built,
not the working copy.

## Target repository

| | |
| --- | --- |
| Repository | `burn8887/salim-drive` (private) |
| Default branch | `main` |
| Initial commit | `036a50b` — "Initial migration of Salim into its own repository" |
| Bundle | `/home/user/salim-drive-migration.bundle` in the sandbox workspace |

## What moved

| Old (this capsule) | New repository |
| --- | --- |
| `apps/salim-android` | `apps/android` |
| `apps/salim-ios` | `apps/ios` |
| `apps/salim-web` | `web` (real filenames, no `.source`) |
| `packages/salim-core` | `packages/core` |
| `site/`, `deploy/`, `docs/`, `tools/` | same names, at the root |
| `sahm-android-build.yml` | `android.yml` |
| `sahm-ios-build.yml` | `ios.yml` |
| `sahm-release-signing.yml` | `release-signing.yml` |

## What was deleted, not ported

- `tools/materialize.py` and `test_materialize.py` — builds run in place.
- `tools/verify_isolation.py` — there is no host application to protect.
- Every `.source` suffix — the host scanner cannot see the new repository.
- The self-ignoring `.gitignore` (`*`).

## Permanent identity change

`app.salim.android.demo` / `app.salim.ios.demo` → **`com.salimdrive.app`** for both platforms.
Kotlin packages are now `com.salimdrive.app` and `com.salimdrive.core`. Versions went to
`0.3.0` / code `3`. This must be settled **before** the first Play or App Store upload, because
neither identifier can change afterwards.

## Status at hand-off

Verified locally in the new tree:

- 18 Python tests pass (ELF checker, site checker, workflow guard).
- 6 Node engine tests pass; `npm ci` and `npm run build` succeed.
- `build_deploy.py` regenerates the single-file `deploy/index.html` (708 KiB).
- `check_site.py` reports the one remaining `OPERATING ENTITY` placeholder, by design.
- `check_workflows.py` passes: all three workflows, paths resolve, signing manual-only.

**Not verified:** the native builds have not run in the new repository. The previous green Android
and iOS runs were in this repository, against the old layout. Do not quote those as current; wait
for the new workflows to pass.

## Blocker at hand-off

The sandbox GitHub connection is scoped to `burn8887/Whisco-TV-` and `burn8887/whisco-mobile` only,
so `git push` to `salim-drive` returns **403 "Write access to repository not granted."** The Arena
GitHub connection needs `salim-drive` added before the push can complete. The full tree is committed
locally and also packaged as a git bundle for manual import.

## Follow-up, requiring separate approval

- Close PR #32 on this repository with a pointer to the new one. **Not done** — it stays open and
  draft until the Founder says otherwise.
- Create the `salim-release` environment and signing secrets in the new repository (not here).
- Confirm the new repository is private, that Actions is enabled, and that branch protection is set
  on `main`.
