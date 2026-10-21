# Salim — isolated, persistent source workspace

This folder belongs exclusively to Salim. Existing Whisco application files, root configuration, dependencies and workflows must not be changed to build Salim. The Founder approved exactly two new Salim-only native build workflows; see the exception below.

## Recovery checkpoint — 14 October 2026

The earlier standalone `/home/user/Salim` directory did not survive a session restart. A subsequent move to an ignored source folder was also lost before staging. This checkpoint corrects the persistence procedure. Native sources have since been rebuilt and checkpointed here. Only the current runner evidence below establishes their verification status; remembered historical builds are not evidence.

- Canonical source must be tracked under `salim-workspace/` **before** starting long-running work.
- Runnable JavaScript/TypeScript is stored with a final `.source` suffix, so the host project's recursive compiler/linter cannot discover it.
- The subtree is ignored by automatic content scanners. New reviewed source must be explicitly staged with `git add -f` by exact path. Already tracked files remain versioned normally.
- `tools/materialize.py` reconstructs a disposable runtime outside the repository. Never make authoritative edits only in that runtime.
- Dependencies, generated outputs, credentials and signing assets are never committed.
- Do not merge this branch or deploy any existing project as part of Salim's work.

## Reconstruct a runtime

```sh
python3 salim-workspace/tools/materialize.py --output /home/user/Salim
```

The materializer refuses to write inside the host repository or overwrite an unrelated directory. It refuses to discard edited runtime files. No cloud account operations occur.

## Brand

The product is **Salim — سالم** (“safe, sound”), positioned as the calm co-pilot for the road ahead:
*Know what's ahead. Keep your calm.* The visual system is an S-shaped road ribbon on Salim Green
`#1F5C47`. Read [the brand identity](docs/BRAND-IDENTITY.md) before writing copy, drawing screens or
naming anything, and [the name-clearance notes](docs/NAME-CLEARANCE.md) before making any public
claim about the name. No trademark, domain, handle or store title has been cleared.

## Release status

Native Android APK/unsigned-AAB packaging and iOS simulator/unsigned-device-archive builds are now exercised by isolated hosted runners. These are not signed Play/TestFlight releases. See [actual build/test evidence](docs/RECOVERY-AND-RELEASE.md) and the [store release checklist](docs/STORE-RELEASE-CHECKLIST.md) for results and remaining signing, privacy, store and device gates. All camera data remains explicitly fictional; no live provider is connected.

## Preview (restored and build-tested)

```sh
python3 salim-workspace/tools/materialize.py --output /home/user/Salim
cd /home/user/Salim/apps/salim-web
npm ci
npm run dev
# Listens on 0.0.0.0:5174; accepts Arena preview hosts.
```

`npm run build` builds only Salim. `npm test` runs the reference geospatial tests. It is a browser demo, not a native binary. See `docs/RECOVERY-AND-RELEASE.md` for the actual recovery/release scope.

## Checkpoint discipline

Before materializing new source, explicitly stage it by exact path and commit it on the session branch. Do not use broad `git add -f .`. Run `python3 salim-workspace/tools/verify_isolation.py` before pushing. Recreate the runtime after a reset; never assume it exists.

### Founder-approved native build workflow exception

The Founder explicitly approved adding new **Salim-only** workflows. These are the only authorized paths outside the source capsule:

| Workflow | Trigger | Purpose |
| --- | --- | --- |
| `.github/workflows/salim-android-build.yml` | push to this branch, manual | Compile, test, lint, emulator, unsigned artifacts |
| `.github/workflows/salim-ios-build.yml` | push to this branch, manual | Simulator tests, unsigned device archive |
| `.github/workflows/salim-release-signing.yml` | **manual only** | Signed AAB/APK and IPA via the `salim-release` environment |

They do not modify or invoke existing Whisco workflows, use other applications' signing secrets, upload to stores, or deploy production. The isolation checker permits exactly these three paths and verifies they do not replace existing files. The signed-release workflow has never run: it fails closed until the Founder creates the `salim-release` environment and Salim-specific secrets. See [docs/RELEASE-SIGNING.md](docs/RELEASE-SIGNING.md).
