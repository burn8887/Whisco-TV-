# Building Salim on your own machine

What can be built where, and the exact steps.

| Platform | Locally buildable? | How |
| --- | --- | --- |
| Android | **Yes**, on Linux, macOS or Windows (WSL) | `tools/setup-android-linux.sh` |
| iOS | **Only on macOS** with Xcode | Xcode, or GitHub Actions macOS runners |
| Web demonstrator | Yes, anywhere with Node 20+ | `cd web && npm ci && npm test && npm run build` |

The build environment that prepares this repository has **no JDK, no Android SDK and no
Xcode**, and cannot reach `dl.google.com`, `services.gradle.org` or Maven Central. It can run
the Python checks and build the web demo; it cannot compile Kotlin or Swift. That is why
native changes must be proven by CI or by you locally.

## The error that stops almost everyone on ChromeOS

```
Looking for zip...
Not found.
Please install zip on your system using your favourite package manager.
```

SDKMAN aborts, so `sdk` and `gradle` are then both `command not found`. `zip` is not
installed in Crostini by default. One line fixes it:

```sh
sudo apt update && sudo apt install -y zip unzip
```

Then re-run the SDKMAN installer. This is also why the setup script installs `zip` first and
downloads Gradle directly instead of going through SDKMAN — one less thing that can fail.

## If the JDK will not install

`E: Unable to locate package openjdk-17-jdk` means the package name does not exist in
whatever Debian release the container is running, or the package lists have never been
fetched. Package names move between releases. Check what this machine actually offers:

```sh
sudo apt-get update
apt-cache search openjdk | grep -E 'jdk|headless'
```

Then install any 17-or-newer package that appears, for example
`sudo apt-get install -y openjdk-21-jdk-headless`. Anything 17 or newer builds this
project; the exact version does not matter.

The setup script now handles this itself. It uses any JDK 17+ already on the machine,
including one unpacked into `~/jdk`, then tries four apt package names in turn, and if
apt offers none of them it downloads a Temurin 17 build into
`~/.local/share/salim-tools` — no apt, no administrator rights.

## Android on Linux, including ChromeOS Crostini

From the repository root:

```sh
salim-workspace/tools/setup-android-linux.sh --check    # see what is missing
salim-workspace/tools/setup-android-linux.sh            # install, then smoke build
```

The script installs the JDK, Android command line tools, `platforms;android-36`,
`build-tools;36.0.0`, and Gradle 8.13. It writes `~/.salim-android-env` and adds it to
`~/.bashrc`. It is safe to re-run: every step checks before acting.

Afterwards:

```sh
cd "$(salim-workspace/tools/setup-android-linux.sh --print-module)"
gradle :core:test :app:assembleDebug :app:lintDebug
```

Add `--wrapper` once to generate `gradlew`, commit it, and nobody needs the script again.

### Three Crostini limits, stated plainly

1. **Disk.** JDK, SDK and Gradle caches need roughly 6–8 GB. Crostini starts smaller.
   Resize at *Settings → About ChromeOS → Developers → Linux development environment →
   Disk size*. The script warns below 8 GB free.
2. **No `/dev/kvm`, so no emulator.** JVM tests and `lintDebug` run fine. The instrumented
   tests (`connectedDebugAndroidTest`) need a phone or a machine with KVM.
3. **No GPU acceleration for Compose previews** in some configurations. Builds work; the
   Preview pane in Android Studio may not.

### A real phone beats an emulator here

The project's largest untested surface is physical-device behaviour. CI has never verified:

- background location surviving Maps, Waze or Spotify in the foreground
- audio ducking against real playback
- battery drain over a real drive
- the 16 KB page-size assumption on actual hardware

```sh
adb devices
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

Enable USB debugging on the phone; Crostini passes the device through.

## iOS

Xcode exists only on macOS. There is no Linux, WSL or Crostini workaround — the toolchain is
not available, and no wrapper project changes that. Options, cheapest first:

| Option | Cost | Notes |
| --- | --- | --- |
| GitHub Actions `macos-15` runner | already in use | 1–2 minutes per run; private-repo minutes are metered and macOS bills at 10× |
| Borrow a Mac for an afternoon | free | enough to debug once, not for a working loop |
| Cloud Mac (MacStadium, MacinCloud) | ~$30–100/month | full Xcode, remote desktop |
| Used Mac mini (M1) | ~$400–500 once | best value if iOS is a serious target |

This repository's iOS job already builds and tests on every push to `main`, so iOS is not
blocked — it is only slower to iterate on, because you read a log instead of a simulator.

## What must never be committed

- `local.properties` (machine paths), `~/.gradle`, `build/`, `web/node_modules`, `web/dist`
- keystores, `.p12`, `.mobileprovision`, `*.p8`
- API tokens for any future map provider

`.gitignore` covers all of these. Signing material lives in the `salim-release` GitHub
environment, never in the repository.
