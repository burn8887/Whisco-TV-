#!/usr/bin/env bash
# Provision a Debian/Ubuntu machine to build the Salim Android app.
#
# Written for ChromeOS Crostini, where the toolchain is not present by default and
# several small packages are missing that most installers assume. On a normal Ubuntu
# machine the same steps apply.
#
# Usage:
#   tools/setup-android-linux.sh --check     report what is missing, change nothing
#   tools/setup-android-linux.sh             install everything, then run a smoke build
#   tools/setup-android-linux.sh --wrapper   also generate gradlew so system Gradle
#                                            is no longer needed afterwards
#   tools/setup-android-linux.sh --no-build  install only
#   tools/setup-android-linux.sh --print-module
#                                            print the Android module path, in either
#                                            layout, and exit (used by the docs)
#
# What it installs:
#   zip, unzip, curl        SDKMAN and unzip both need zip; its absence is the most
#                           common Crostini failure and stops SDKMAN at the first step
#   a JDK 17 or newer       any JDK already on the machine is used if it is new
#                           enough; otherwise openjdk-17-jdk, openjdk-17-jdk-headless
#                           and openjdk-21-jdk-headless are tried in turn, and if apt
#                           has none of them a Temurin build is unpacked into
#                           ~/.local/share/salim-tools. Package names differ between
#                           Debian releases, so a hard dependency on one apt package
#                           name is a bug.
#   Android command line tools, platforms;android-36, build-tools;36.0.0
#   Gradle 8.13             downloaded directly, not through SDKMAN
#
# It never touches the Salim source tree except, with --wrapper, to add gradlew.
set -euo pipefail

GRADLE_VERSION="8.13"
GRADLE_SHA256_URL="https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip.sha256"
GRADLE_URL="https://services.gradle.org/distributions/gradle-${GRADLE_VERSION}-bin.zip"
CMDLINE_TOOLS_ZIP="commandlinetools-linux-11076708_latest.zip"
CMDLINE_TOOLS_URL="https://dl.google.com/android/repository/${CMDLINE_TOOLS_ZIP}"
ANDROID_PACKAGES=("platforms;android-36" "build-tools;36.0.0" "platform-tools")
SYSTEM_PACKAGES=(zip unzip curl ca-certificates)
# Tried in order. Debian bookworm has openjdk-17-jdk; some images only expose the
# headless variant; anything 17 or newer is fine for AGP 8.13 and Kotlin 2.2.
JAVA_PACKAGES=(openjdk-17-jdk openjdk-17-jdk-headless openjdk-21-jdk-headless openjdk-21-jdk)

ANDROID_HOME_DEFAULT="${HOME}/android-sdk"
TOOLS_DIR="${HOME}/.local/share/salim-tools"
ENV_FILE="${HOME}/.salim-android-env"

CHECK_ONLY=0
NO_BUILD=0
MAKE_WRAPPER=0
PRINT_MODULE=0
for arg in "$@"; do
  case "${arg}" in
    --check)    CHECK_ONLY=1 ;;
    --no-build) NO_BUILD=1 ;;
    --wrapper)  MAKE_WRAPPER=1 ;;
    --print-module) PRINT_MODULE=1 ;;
    -h|--help)  sed -n '2,30p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "unknown option: ${arg} (try --help)" >&2; exit 2 ;;
  esac
done

say()  { printf '  %s\n' "$*"; }
ok()   { printf '  [ok]   %s\n' "$*"; }
warn() { printf '  [warn] %s\n' "$*"; }
fail() { printf '  [miss] %s\n' "$*"; MISSING=$((MISSING + 1)); }
head2() { printf '\n%s\n' "$*"; }

MISSING=0

# ---------------------------------------------------------------- repo location

find_android_module() {
  local dir
  dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  while [ "${dir}" != "/" ]; do
    # Standalone repository, then the capsule inside the host repository.
    for candidate in "${dir}/apps/android" "${dir}/salim-workspace/apps/salim-android"; do
      if [ -f "${candidate}/settings.gradle.kts" ]; then
        printf '%s\n' "${candidate}"
        return 0
      fi
    done
    dir="$(dirname "${dir}")"
  done
  return 1
}

# ---------------------------------------------------------------- java discovery

# Prints the major version of the given java binary: 17, 21, 8, ...
java_major() {
  local bin="$1" version
  [ -x "${bin}" ] || return 1
  version="$("${bin}" -version 2>&1 | head -1 | sed -nE 's/.*version "([^"]+)".*/\1/p')"
  [ -n "${version}" ] || return 1
  case "${version}" in
    1.*) printf '%s\n' "${version#1.}" | cut -d. -f1 ;;
    *)   printf '%s\n' "${version}"   | cut -d. -f1 ;;
  esac
}

# Every java binary worth testing, one per line. Unmatched globs are filtered by
# the -x test in the callers, not here.
java_candidates() {
  if command -v java >/dev/null 2>&1; then
    command -v java
  fi
  if [ -n "${JAVA_HOME:-}" ] && [ -x "${JAVA_HOME}/bin/java" ]; then
    printf '%s\n' "${JAVA_HOME}/bin/java"
  fi
  printf '%s\n' "${TOOLS_DIR}/jdk-17/bin/java"
  local f
  for f in "${HOME}"/jdk/bin/java "${HOME}"/jdk/*/bin/java \
           "${HOME}"/jdk-*/bin/java "${HOME}"/jdk-*/*/bin/java; do
    printf '%s\n' "${f}"
  done
}

# Prints the first java binary with major version >= $1.
find_java() {
  local want="$1" candidate major
  while IFS= read -r candidate; do
    [ -x "${candidate}" ] || continue
    major="$(java_major "${candidate}" || true)"
    [ -n "${major}" ] || continue
    if [ "${major}" -ge "${want}" ] 2>/dev/null; then
      printf '%s\n' "${candidate}"
      return 0
    fi
  done < <(java_candidates)
  return 1
}

# Prints the first java binary with exactly major version $1. The project pins
# jvmToolchain(17), and a toolchain request for 17 is not satisfied by 21.
find_java_major() {
  local want="$1" candidate major
  while IFS= read -r candidate; do
    [ -x "${candidate}" ] || continue
    major="$(java_major "${candidate}" || true)"
    [ -n "${major}" ] || continue
    if [ "${major}" = "${want}" ]; then
      printf '%s\n' "${candidate}"
      return 0
    fi
  done < <(java_candidates)
  return 1
}

# Directory above bin/java, with symlinks resolved.
java_home_of() {
  local bin="$1" real
  real="$(readlink -f "${bin}" 2>/dev/null || printf '%s' "${bin}")"
  printf '%s\n' "${real%/bin/java}"
}

# ---------------------------------------------------------------- prerequisites

version_of() {
  case "$1" in
    curl) curl --version | head -1 | cut -d' ' -f2 ;;
    *)    command -v "$1" ;;
  esac
}

check_command() {
  local cmd="$1" hint="$2"
  if command -v "${cmd}" >/dev/null 2>&1; then
    ok "${cmd} $(version_of "${cmd}" | cut -c1-40)"
  else
    fail "${cmd} — ${hint}"
  fi
}

run_check() {
  head2 "Prerequisites"
  check_command zip   "apt install zip"
  check_command unzip "apt install unzip"
  check_command curl  "apt install curl"

  local java_bin
  if java_bin="$(find_java 17)"; then
    ok "java $(java_major "${java_bin}") at ${java_bin}"
  else
    fail "no JDK 17 or newer — the setup script installs one"
  fi
  local seventeen
  if seventeen="$(find_java_major 17)"; then
    ok "JDK 17 toolchain at ${seventeen} (both modules pin jvmToolchain(17))"
  else
    fail "no JDK 17 — the project pins jvmToolchain(17); the script provisions one"
  fi

  head2 "Android SDK"
  if [ -n "${ANDROID_HOME:-}" ] && [ -d "${ANDROID_HOME}" ]; then
    ok "ANDROID_HOME=${ANDROID_HOME}"
  elif [ -d "${ANDROID_HOME_DEFAULT}" ]; then
    ok "Android SDK found at ${ANDROID_HOME_DEFAULT} (not yet on PATH)"
  else
    fail "no Android SDK at ANDROID_HOME or ${ANDROID_HOME_DEFAULT}"
  fi

  head2 "Gradle"
  if command -v gradle >/dev/null 2>&1; then
    ok "gradle $(gradle --version 2>/dev/null | awk '/^Gradle /{print $2; exit}')"
  elif [ -x "${TOOLS_DIR}/gradle-${GRADLE_VERSION}/bin/gradle" ]; then
    ok "gradle ${GRADLE_VERSION} at ${TOOLS_DIR} (not yet on PATH)"
  elif [ -x "${ANDROID_MODULE}/gradlew" ]; then
    ok "project wrapper ${ANDROID_MODULE}/gradlew present"
  else
    fail "gradle ${GRADLE_VERSION} — run this script without --check to install it"
  fi

  head2 "Project"
  if [ -n "${ANDROID_MODULE}" ]; then
    ok "Android module: ${ANDROID_MODULE}"
  else
    fail "no apps/android or salim-workspace/apps/salim-android above this script"
  fi

  head2 "Hardware"
  if [ -w /dev/kvm ] 2>/dev/null; then
    ok "/dev/kvm available — the emulator can run"
  else
    warn "/dev/kvm unavailable — emulator cannot run here. JVM tests and a real"
    say  "phone over USB (adb) still work."
  fi
  local avail_gb
  avail_gb=$(df -BG --output=avail "${HOME}" 2>/dev/null | tail -1 | tr -dc '0-9')
  if [ -n "${avail_gb}" ] && [ "${avail_gb}" -lt 8 ]; then
    warn "only ${avail_gb} GB free; the SDK plus Gradle caches want roughly 6-8 GB."
    say  "ChromeOS: Settings > About ChromeOS > Developers > Linux > Disk size."
  else
    ok "${avail_gb:-?} GB free"
  fi
}

# ---------------------------------------------------------------- install steps

SUDO=""
if [ "$(id -u)" -ne 0 ]; then
  if command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
  fi
fi

apt_install() {
  local pkg="$1"
  if [ -z "${SUDO}" ] && [ "$(id -u)" -ne 0 ]; then
    return 1
  fi
  DEBIAN_FRONTEND=noninteractive ${SUDO} apt-get install -y -qq "${pkg}" >/dev/null 2>&1
}

apt_refresh() {
  say "refreshing package lists"
  if ! ${SUDO} apt-get update -qq 2>/dev/null; then
    warn "apt-get update failed; continuing with whatever lists are cached"
  fi
}

install_system_packages() {
  head2 "System packages"
  local missing=() pkg
  for pkg in "${SYSTEM_PACKAGES[@]}"; do
    if dpkg -s "${pkg}" >/dev/null 2>&1; then
      ok "${pkg}"
    else
      missing+=("${pkg}")
    fi
  done
  if [ "${#missing[@]}" -eq 0 ]; then
    return 0
  fi
  apt_refresh
  for pkg in "${missing[@]}"; do
    if apt_install "${pkg}"; then
      ok "installed ${pkg}"
    else
      warn "could not install ${pkg} from apt"
    fi
  done
}

install_java() {
  head2 "Java"
  local existing
  if existing="$(find_java 17)"; then
    ok "using java $(java_major "${existing}") at ${existing}"
  else
    apt_refresh
    local pkg
    for pkg in "${JAVA_PACKAGES[@]}"; do
      if apt_install "${pkg}"; then
        hash -r 2>/dev/null || true
        if existing="$(find_java 17)"; then
          ok "installed ${pkg} — java $(java_major "${existing}")"
          break
        fi
        warn "${pkg} installed but no java 17+ appeared on PATH"
      fi
    done
    if ! find_java 17 >/dev/null; then
      warn "apt offers no JDK here (package names vary by Debian release)"
      install_temurin || return 1
    fi
  fi

  # The project pins jvmToolchain(17) in both modules, so a machine with only a
  # newer JDK still fails to configure. Provision 17 explicitly.
  local seventeen
  if seventeen="$(find_java_major 17)"; then
    ok "JDK 17 toolchain: ${seventeen}"
  else
    warn "no JDK 17 found, and both modules ask for a 17 toolchain"
    say  "downloading one rather than editing the build to match this machine"
    if install_temurin; then
      ok "JDK 17 toolchain: $(java_major "${TOOLS_DIR}/jdk-17/bin/java") at ${TOOLS_DIR}/jdk-17"
    else
      warn "could not obtain JDK 17 — the build will fail at toolchain resolution"
    fi
  fi
}

install_temurin() {
  local arch
  case "$(uname -m)" in
    x86_64|amd64)  arch="x64" ;;
    aarch64|arm64) arch="aarch64" ;;
    *) warn "unsupported architecture $(uname -m)"; return 1 ;;
  esac

  local dest="${TOOLS_DIR}/jdk-17"
  if [ -x "${dest}/bin/java" ]; then
    ok "Temurin 17 already unpacked at ${dest}"
    return 0
  fi

  local tmp
  tmp="$(mktemp -d)"
  say "downloading Temurin 17 for ${arch} (~190 MB)"
  if ! curl -fsSL -o "${tmp}/jdk.tar.gz" \
      "https://api.adoptium.net/v3/binary/latest/17/ga/linux/${arch}/jdk/hotspot/normal/eclipse?project=jdk"; then
    warn "download failed — check the network, then re-run"
    rm -rf "${tmp}"
    return 1
  fi

  say "unpacking"
  if ! tar -xzf "${tmp}/jdk.tar.gz" -C "${tmp}" 2>/dev/null; then
    warn "the archive did not unpack"
    rm -rf "${tmp}"
    return 1
  fi

  local extracted
  extracted="$(find "${tmp}" -maxdepth 1 -mindepth 1 -type d | head -1)"
  if [ -z "${extracted}" ]; then
    warn "no directory inside the archive"
    rm -rf "${tmp}"
    return 1
  fi
  mkdir -p "${TOOLS_DIR}"
  rm -rf "${dest}"
  mv "${extracted}" "${dest}"
  rm -rf "${tmp}"

  if [ -x "${dest}/bin/java" ]; then
    ok "Temurin $(java_major "${dest}/bin/java") installed at ${dest}"
  else
    warn "unpacked, but no bin/java inside"
    return 1
  fi
}

install_sdk() {
  head2 "Android command line tools"
  local sdk="${ANDROID_HOME:-${ANDROID_HOME_DEFAULT}}"
  local sdkmanager="${sdk}/cmdline-tools/latest/bin/sdkmanager"
  if [ -x "${sdkmanager}" ]; then
    ok "already present at ${sdk}"
  else
    mkdir -p "${sdk}/cmdline-tools"
    local tmp
    tmp="$(mktemp -d)"
    say "downloading ${CMDLINE_TOOLS_ZIP}"
    curl -fsSL -o "${tmp}/tools.zip" "${CMDLINE_TOOLS_URL}"
    unzip -q "${tmp}/tools.zip" -d "${tmp}"
    rm -rf "${sdk}/cmdline-tools/latest"
    mv "${tmp}/cmdline-tools" "${sdk}/cmdline-tools/latest"
    rm -rf "${tmp}"
    ok "installed into ${sdk}"
  fi

  # sdkmanager is a Java program; make sure the JDK we found is visible to it.
  local java_bin home
  if java_bin="$(find_java 17)"; then
    home="$(cd "$(dirname "${java_bin}")/.." && pwd)"
    export JAVA_HOME="${home}"
    export PATH="${home}/bin:${PATH}"
  fi

  say "accepting SDK licences"
  # A rejected licence blocks every later Gradle build with an unrelated message.
  yes | "${sdkmanager}" --licenses >/dev/null 2>&1 || true
  say "installing ${ANDROID_PACKAGES[*]}"
  "${sdkmanager}" "${ANDROID_PACKAGES[@]}" >/dev/null
  ok "SDK packages installed"
}

install_gradle() {
  head2 "Gradle ${GRADLE_VERSION}"
  local dir="${TOOLS_DIR}/gradle-${GRADLE_VERSION}"
  if [ -x "${dir}/bin/gradle" ]; then
    ok "already present at ${dir}"
    return 0
  fi
  mkdir -p "${TOOLS_DIR}"
  local tmp
  tmp="$(mktemp -d)"
  say "downloading gradle-${GRADLE_VERSION}-bin.zip"
  curl -fsSL -o "${tmp}/gradle.zip" "${GRADLE_URL}"
  if command -v sha256sum >/dev/null 2>&1; then
    local expected actual
    expected="$(curl -fsSL "${GRADLE_SHA256_URL}" | awk '{print $1}')"
    actual="$(sha256sum "${tmp}/gradle.zip" | awk '{print $1}')"
    if [ -n "${expected}" ] && [ "${expected}" != "${actual}" ]; then
      echo "gradle download failed its checksum; refusing to install" >&2
      exit 1
    fi
    ok "checksum verified"
  fi
  unzip -q "${tmp}/gradle.zip" -d "${TOOLS_DIR}"
  rm -rf "${tmp}"
  ok "installed into ${dir}"
}

write_env() {
  head2 "Environment"
  local sdk="${ANDROID_HOME:-${ANDROID_HOME_DEFAULT}}"
  local gradle_bin="${TOOLS_DIR}/gradle-${GRADLE_VERSION}/bin"

  # JAVA_HOME should be the 17 the project asks for when it exists, because the
  # JDK running Gradle also satisfies its own toolchain request.
  local chosen="" seventeen="" runtime=""
  if seventeen="$(find_java_major 17)"; then
    chosen="${seventeen}"
  elif runtime="$(find_java 17)"; then
    chosen="${runtime}"
  fi
  local java_home="" installations=""
  if [ -n "${chosen}" ]; then
    java_home="$(java_home_of "${chosen}")"
    installations="${java_home}"
  fi
  if [ -n "${runtime}" ]; then
    local runtime_home
    runtime_home="$(java_home_of "${runtime}")"
    if [ -n "${installations}" ] && [ "${runtime_home}" != "${installations}" ]; then
      installations="${installations},${runtime_home}"
    elif [ -z "${installations}" ]; then
      installations="${runtime_home}"
    fi
  fi

  # GRADLE_OPTS is assigned outright, not appended to its previous value: the
  # file is re-sourced by every interactive shell, and appending would grow the
  # property list each time a child shell starts.
  local gradle_opts_line=""
  if [ -n "${installations}" ]; then
    gradle_opts_line="export GRADLE_OPTS=\"-Dorg.gradle.java.installations.paths=${installations}\""
  fi

  cat > "${ENV_FILE}" <<ENV
# Salim Android build environment. Add this to ~/.bashrc:
#   . "${ENV_FILE}"
export JAVA_HOME="${java_home}"
${gradle_opts_line}
export ANDROID_HOME="${sdk}"
export ANDROID_SDK_ROOT="${sdk}"
export PATH="\${JAVA_HOME}/bin:\${ANDROID_HOME}/cmdline-tools/latest/bin:\${ANDROID_HOME}/platform-tools:${gradle_bin}:\${PATH}"
ENV
  ok "wrote ${ENV_FILE}"
  if [ -n "${java_home}" ]; then
    ok "JAVA_HOME=${java_home}"
  fi
  # shellcheck disable=SC1090
  . "${ENV_FILE}"
  if ! grep -q "salim-android-env" "${HOME}/.bashrc" 2>/dev/null; then
    printf '\n. %s\n' "${ENV_FILE}" >> "${HOME}/.bashrc"
    ok "added it to ~/.bashrc"
  else
    ok "~/.bashrc already sources it"
  fi
}

maybe_wrapper() {
  [ "${MAKE_WRAPPER}" -eq 1 ] || return 0
  head2 "Gradle wrapper"
  if [ -x "${ANDROID_MODULE}/gradlew" ]; then
    ok "gradlew already committed"
    return 0
  fi
  ( cd "${ANDROID_MODULE}" && gradle wrapper --gradle-version "${GRADLE_VERSION}" --no-daemon -q )
  ok "generated ${ANDROID_MODULE}/gradlew — commit it so CI and teammates skip this script"
}

smoke_build() {
  head2 "Smoke build"
  say "cd ${ANDROID_MODULE} && gradle :core:test :app:assembleDebug"
  local log
  log="$(mktemp)"
  if ( cd "${ANDROID_MODULE}" && gradle --no-daemon :core:test :app:assembleDebug ) 2>&1 | tee "${log}"; then
    local apk="${ANDROID_MODULE}/app/build/outputs/apk/debug/app-debug.apk"
    if [ -f "${apk}" ]; then
      ok "APK: ${apk} ($(du -h "${apk}" | cut -f1))"
      say "install on a phone with: adb install -r ${apk}"
    else
      warn "build finished but no debug APK was produced"
    fi
    rm -f "${log}"
    return 0
  fi
  if grep -q "No matching toolchains" "${log}"; then
    warn "Gradle could not find the JDK 17 toolchain the project pins"
    say  "Fix: re-run this script so it provisions one, or point Gradle at a JDK 17"
    say  "with -Dorg.gradle.java.installations.paths=/path/to/jdk-17"
  elif grep -qE "Unresolved reference|e: file:" "${log}"; then
    warn "a Kotlin compilation error — the toolchain is fine, the source is not"
  fi
  rm -f "${log}"
  return 1
}

# ---------------------------------------------------------------- main

ANDROID_MODULE="$(find_android_module || true)"
export ANDROID_MODULE

if [ "${PRINT_MODULE}" -eq 1 ]; then
  [ -n "${ANDROID_MODULE}" ] || exit 1
  printf '%s\n' "${ANDROID_MODULE}"
  exit 0
fi

printf 'Salim Android setup — %s\n' "$(date +%Y-%m-%d)"

if [ "${CHECK_ONLY}" -eq 1 ]; then
  run_check
  head2 "Summary"
  if [ "${MISSING}" -eq 0 ]; then
    ok "everything needed is present"
    exit 0
  fi
  echo "  ${MISSING} item(s) missing — run this script without --check to install them."
  exit 1
fi

if [ -z "${ANDROID_MODULE}" ]; then
  echo "Could not find the Android module. Run this from inside the Salim repository." >&2
  exit 1
fi

install_system_packages
if ! install_java || ! find_java 17 >/dev/null; then
  echo >&2
  echo "No JDK 17 or newer could be installed, so nothing else can be built." >&2
  echo "Debian 13 ships openjdk-21 rather than 17, so this script provisions 17" >&2
  echo "itself when apt has none; that needs a working connection to" >&2
  echo "api.adoptium.net. Fix the network or install a JDK 17 by hand, then re-run." >&2
  exit 1
fi
install_sdk
install_gradle
write_env
maybe_wrapper

if [ "${NO_BUILD}" -eq 1 ]; then
  head2 "Done"
  ok "toolchain installed; build with: cd ${ANDROID_MODULE} && gradle :core:test :app:assembleDebug"
  exit 0
fi

if ! smoke_build; then
  echo >&2
  echo "Smoke build failed; the output above explains why." >&2
  exit 1
fi

head2 "Done"
ok "Android builds locally"
say "JVM tests and lint run here. Instrumented tests need a phone: adb install the APK,"
say "or a machine with /dev/kvm for the emulator."
