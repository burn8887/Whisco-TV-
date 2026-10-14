# Sahm — isolated, persistent source workspace

This folder belongs exclusively to Sahm. Existing Whisco application files, root configuration, dependencies and workflows must not be changed to build Sahm. The Founder approved exactly two new Sahm-only native build workflows; see the exception below.

## Recovery checkpoint — 14 October 2026

The earlier standalone `/home/user/Sahm` directory did not survive a session restart. A subsequent move to an ignored source folder was also lost before staging. This checkpoint corrects the persistence procedure. Native sources have since been rebuilt and checkpointed here. Only the current runner evidence below establishes their verification status; remembered historical builds are not evidence.

- Canonical source must be tracked under `sahm-workspace/` **before** starting long-running work.
- Runnable JavaScript/TypeScript is stored with a final `.source` suffix, so the host project's recursive compiler/linter cannot discover it.
- The subtree is ignored by automatic content scanners. New reviewed source must be explicitly staged with `git add -f` by exact path. Already tracked files remain versioned normally.
- `tools/materialize.py` reconstructs a disposable runtime outside the repository. Never make authoritative edits only in that runtime.
- Dependencies, generated outputs, credentials and signing assets are never committed.
- Do not merge this branch or deploy any existing project as part of Sahm's work.

## Reconstruct a runtime

```sh
python3 sahm-workspace/tools/materialize.py --output /home/user/Sahm
```

The materializer refuses to write inside the host repository or overwrite an unrelated directory. It refuses to discard edited runtime files. No cloud account operations occur.

## Release status

Native Android APK/unsigned-AAB packaging and iOS simulator/unsigned-device-archive builds are now exercised by isolated hosted runners. These are not signed Play/TestFlight releases. See [actual build/test evidence](docs/RECOVERY-AND-RELEASE.md) and the [store release checklist](docs/STORE-RELEASE-CHECKLIST.md) for results and remaining signing, privacy, store and device gates. All camera data remains explicitly fictional; no live provider is connected.

## Preview (restored and build-tested)

```sh
python3 sahm-workspace/tools/materialize.py --output /home/user/Sahm
cd /home/user/Sahm/apps/sahm-web
npm ci
npm run dev
# Listens on 0.0.0.0:5174; accepts Arena preview hosts.
```

`npm run build` builds only Sahm. `npm test` runs the reference geospatial tests. It is a browser demo, not a native binary. See `docs/RECOVERY-AND-RELEASE.md` for the actual recovery/release scope.

## Checkpoint discipline

Before materializing new source, explicitly stage it by exact path and commit it on the session branch. Do not use broad `git add -f .`. Run `python3 sahm-workspace/tools/verify_isolation.py` before pushing. Recreate the runtime after a reset; never assume it exists.

### Founder-approved native build workflow exception

The Founder explicitly approved adding new **Sahm-only Android and iOS build workflows**. These are the only authorized paths outside the source capsule: `.github/workflows/sahm-android-build.yml` and `.github/workflows/sahm-ios-build.yml`. They do not modify or invoke existing Whisco workflows, use other applications' signing secrets, upload to stores, or deploy production. The isolation checker now permits exactly these two new paths and checks they do not replace existing files.
