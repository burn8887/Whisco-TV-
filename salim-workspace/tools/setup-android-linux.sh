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
#   openjdk-17-jdk          AGP 8.13 and Kotlin 2.2 compile against Java 17
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
APT_PACKAGES=(zip unzip curl openjdk-17-jdk)

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

# ---------------------------------------------------------------- prerequisites

version_of() {
  # zip and unzip both print banners rather than clean versions, so report the path.
  case "$1" in
    java)  java -version 2>&1 | head -1 | sed 's/.*version "\([^"]*\)".*/\1/' ;;
    curl)  curl --version | head -1 | cut -d' ' -f2 ;;
    *)     command -v "$1" ;;
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
  check_command zip   "needed by SDKMAN and by unzip tooling: apt install zip"
  check_command unzip "apt install unzip"
  check_command java  "apt install openjdk-17-jdk"
  check_command curl  "apt install curl"

  head2 "Android SDK"
  if [ -n "${ANDROID_HOME:-}" ] && [ -d "${ANDROID_HOME}" ]; then
    ok "ANDROID_HOME=${ANDROID_HOME}"
  elif [ -d "${ANDROID_HOME_DEFAULT}" ]; then
    ok "Android SDK found at ${ANDROID_HOME_DEFAULT} (not yet on PATH)"
  else
    if [ -n "${ANDROID_HOME:-}" ]; then
      fail "ANDROID_HOME=${ANDROID_HOME} does not exist"
    else
      fail "no Android SDK: ANDROID_HOME unset and ${ANDROID_HOME_DEFAULT} absent"
    fi
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

install_apt() {
  head2 "System packages"
  local missing=()
  for pkg in "${APT_PACKAGES[@]}"; do
    if dpkg -s "${pkg}" >/dev/null 2>&1; then
      ok "${pkg}"
    else
      missing+=("${pkg}")
    fi
  done
  if [ "${#missing[@]}" -eq 0 ]; then
    return 0
  fi
  say "installing: ${missing[*]}"
  if [ -z "${SUDO}" ] && [ "$(id -u)" -ne 0 ]; then
    echo "need root or sudo to install: ${missing[*]}" >&2
    exit 1
  fi
  ${SUDO} apt-get update -qq
  DEBIAN_FRONTEND=noninteractive ${SUDO} apt-get install -y -qq "${missing[@]}"
  ok "installed ${missing[*]}"
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
  cat > "${ENV_FILE}" <<ENV
# Salim Android build environment. Add this to ~/.bashrc:
#   . "${ENV_FILE}"
export ANDROID_HOME="${sdk}"
export ANDROID_SDK_ROOT="${sdk}"
export PATH="\${ANDROID_HOME}/cmdline-tools/latest/bin:\${ANDROID_HOME}/platform-tools:${gradle_bin}:\${PATH}"
ENV
  ok "wrote ${ENV_FILE}"
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
  ( cd "${ANDROID_MODULE}" && gradle --no-daemon :core:test :app:assembleDebug )
  local apk="${ANDROID_MODULE}/app/build/outputs/apk/debug/app-debug.apk"
  if [ -f "${apk}" ]; then
    ok "APK: ${apk} ($(du -h "${apk}" | cut -f1))"
    say "install on a phone with: adb install -r ${apk}"
  else
    warn "build finished but no debug APK was produced"
  fi
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

install_apt
install_sdk
install_gradle
write_env
maybe_wrapper

if [ "${NO_BUILD}" -eq 1 ]; then
  head2 "Done"
  ok "toolchain installed; build with: cd ${ANDROID_MODULE} && gradle :core:test :app:assembleDebug"
  exit 0
fi

smoke_build

head2 "Done"
ok "Android builds locally"
say "JVM tests and lint run here. Instrumented tests need a phone: adb install the APK,"
say "or a machine with /dev/kvm for the emulator."
