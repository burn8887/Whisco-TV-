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

## The terminal closes in the middle of a build

That is not a Gradle failure. Gradle exiting would print an error and leave the shell
prompt. A window that disappears means the process running it was killed - on ChromeOS
almost always because the Linux environment ran out of memory and was restarted.

The project's `gradle.properties` asks for `-Xmx3g`, and the Kotlin compiler starts a
second JVM on top. Peak is roughly 5-6 GB. Crostini is often given 4 GB. ChromeOS then
kills the container, and every terminal window goes with it.

The setup script checks `/proc/meminfo` and scales the build to the machine:

| Total memory | Heap | Workers | Kotlin |
| --- | --- | --- | --- |
| 7 GB or more | project default (3 GB) | default | daemon |
| 5–7 GB | 2048 MB | 2 | in-process |
| 3.5–5 GB | 1536 MB | 2 | in-process |
| under 3.5 GB | 1024 MB | 1 | in-process |

Those are command-line properties, so `gradle.properties` and CI are unchanged.

**Under 3.5 GB a full Compose build is marginal even with a small heap.** A Chromebook
that reports ~2.7 GB total is below what this project needs; expect the environment to be
killed at the dependency-download stage. Two honest ways out: close Chrome before
building, since Crostini's allocation is dynamic and Chrome is the largest consumer, or
build in CI and install the APK from the run's artifacts. Building is only a means to
testing on a device, and the artifact gets you there.

Every run also writes `~/salim-android-setup.log`, so the evidence survives a dead
terminal. After a crash:

```sh
tail -40 ~/salim-android-setup.log
free -h
```

If `free -h` shows a small total, giving the Linux environment more memory is the real
fix - ChromeOS allocates it from the machine, not from disk.

## Two JDK requirements, not one

Both Android modules pin `jvmToolchain(17)`, and CI installs Temurin 17. That means a
machine with **only** JDK 21 still fails, at configuration time:

```
No matching toolchains found for requested specification:
  {languageVersion=17, vendor=any, implementation=vendor-specific}
```

A toolchain request for 17 is not satisfied by 21. Gradle needs an actual 17, either
running Gradle itself (`JAVA_HOME`) or discoverable as an installation.

The setup script handles this: it uses a JDK 17 if one exists anywhere it can see,
including a tarball unpacked into `~/jdk`, otherwise it downloads Temurin 17 into
`~/.local/share/salim-tools` and points Gradle at it through
`-Dorg.gradle.java.installations.paths`. Editing the build files to match whatever
version happens to be installed would work locally and quietly diverge from CI, so the
script moves the machine instead of the project.

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

Enable USB debugging on the phone, and share the device with Linux when ChromeOS
prompts for it.

### `insufficient permissions for device: user is not in the plugdev group`

The phone is being seen — this is a permission on the device node, not a connection
problem. The account needs to be in `plugdev`, and group membership only applies to
sessions started *after* the change:

```sh
sudo usermod -aG plugdev $USER
adb kill-server
```

Then shut down the Linux environment completely (right-click the Terminal icon →
**Shut down Linux**), reopen it, and confirm:

```sh
groups | grep plugdev
adb devices
```

If `adb devices` now lists the phone as `device` rather than `no permissions` or
`unauthorized`, tap **Allow** on the phone's own prompt. The authorisation dialog only
appears once the permission problem is gone.

### `missing udev rules? user is in the plugdev group`

Group membership is necessary but not sufficient. Debian and Ubuntu grant USB access
through udev rules, and **Crostini runs no udev daemon** — the container has no `/run/udev`
and `udevadm` does nothing useful there. So the account can be in `plugdev` and still get
`no permissions` on the device node.

Check what the node looks like:

```sh
ls -l /dev/bus/usb/*/*
```

If it reads `crw-rw-r-- root root`, that is the problem: group `root`, and nobody in
`plugdev` can open it.

The immediate fix grants access to the USB nodes in the container — no udev needed, no
reboot:

```sh
sudo chmod -R 777 /dev/bus/usb
adb kill-server
adb devices
```

`777` rather than `666` because the bus directories need the execute bit to be traversed;
`666` on a directory removes it and breaks access further.

This is a container, and the USB nodes it exposes are transient devices, not files that
matter. The permission resets when the device is unplugged or the phone re-enumerates, so
run it again after replugging.

If `adb devices` then says `unauthorized` rather than `device`, the permission worked and
the phone is asking for consent — tap **Allow** on the phone.

A rule file can be written for the sake of completeness, but expect it to have no effect
until something triggers udev:

```sh
echo 'SUBSYSTEM=="usb", ATTR{idVendor}=="04e8", MODE="0666", GROUP="plugdev"' \
  | sudo tee /etc/udev/rules.d/51-android.rules
```

`04e8` is Samsung. For another vendor, read it from `lsusb`.

### `adb devices` is empty and `lsusb` does not list the phone

This is the ChromeOS side, not the container. `lsusb` shows only the devices ChromeOS
has handed to Linux, so a phone missing from that list was never shared and no permission
change inside Linux can reach it.

```sh
lsusb                          # is the phone here at all?
ls -l /dev/bus/usb/*/*         # is there a node for it?
```

A healthy passthrough looks like this — the phone appears as a device entry, not just a
root hub and peripherals:

```
Bus 001 Device 004: ID 18d1:4ee7 Google Inc. Nexus/Pixel Device (MTP + debug)
```

Fix it from ChromeOS:

1. Unlock the phone. A locked phone can refuse to enumerate.
2. Pull down the notification shade on the phone and set the USB mode to **File transfer**,
   not "Charging only".
3. Unplug and replug. ChromeOS raises a **"USB device detected"** notification — click it
   and choose **Connect to Linux**. Miss that notification and Linux never sees the phone.
4. If the notification never appears, restart the Linux environment and try again; the
   grant is lost whenever the container restarts.

### When USB refuses to cooperate: wireless debugging

Android 11 and later can be reached over the network, which sidesteps USB passthrough
entirely. On the phone: *Developer options → Wireless debugging → Pair device with
pairing code*. It shows an address, a port and a six-digit code.

```sh
adb pair 192.168.1.50:41234      # the pairing address and port from the dialog
adb connect 192.168.1.50:5555    # the connect address, a different port
adb devices
```

The phone and the Chromebook must be on the same network. This is often the faster route
on Crostini, and it keeps working with the phone on a charger across the room.

If `adb connect` hangs, the two devices are probably on different subnets, or the router
has client isolation enabled — common on guest networks. Check both are on the same
`192.168.x.*` range.

### Installing without adb at all

When the phone simply cannot be reached, the APK can be transferred any other way and
installed by tapping it. This gets a device test started without solving USB:

```sh
cp apps/android/app/build/outputs/apk/debug/app-debug.apk ~/Downloads/salim-0.3.0-demo.apk
```

Move that file to the phone by Google Drive, a USB stick, or email, then open it on the
phone and allow **Install unknown apps** for whichever app is doing the opening. Debug
signing is fine for this; the phone only warns that the installer is unknown.

The cost is `adb logcat`. If GPS misbehaves on the device, that log is the fastest way to
see whether fixes are arriving at all, so it is worth one more attempt at `adb pair`
before giving up on adb.

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
