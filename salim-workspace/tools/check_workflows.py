#!/usr/bin/env python3
"""Check the Salim workflows reference files that actually exist.

The capsule was renamed from an earlier internal name, and now moves again from
`salim-workspace/` into its own repository. A stale path in a workflow is invisible until
that job runs, which for the manual signed-release workflow could be months later. This
check catches the whole class of mistake at commit time.

It runs in both layouts: inside the capsule (`salim-workspace/tools/`) and in the
generated standalone repository (`tools/`). The repository root is found by walking up to
the directory that holds `.github/workflows`, never by counting parents.

Also enforces the agreed guard rails: the signed-release workflow must stay manual-only,
must run in the `salim-release` environment, and must not contain any store-upload step.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

TOOLS = Path(__file__).resolve().parent


def _find_root(start: Path) -> Path:
    for candidate in (start, *start.parents):
        if (candidate / ".github" / "workflows").is_dir():
            return candidate
    return start.parent


ROOT = _find_root(TOOLS)
WORKFLOWS = ROOT / ".github" / "workflows"
# Inside the capsule the tree lives under salim-workspace/; standalone it is the root.
IS_CAPSULE = (ROOT / "salim-workspace").is_dir()

# Every kind of Salim workflow that must exist, under either naming scheme.
REQUIRED_KINDS = ("android", "ios", "release-signing")
KIND_NAMES = {
    "android": ("salim-android-build", "android"),
    "ios": ("salim-ios-build", "ios"),
    "release-signing": ("salim-release-signing", "release-signing"),
}

# Repository-relative paths mentioned in a workflow that must resolve on disk. The
# lookbehind keeps `$RUNNER_TEMP/x/apps/...` and URLs out of the results.
PATH_RE = re.compile(
    r"(?<![\w/$.\-])"
    r"((?:(?:salim|sahm)-workspace/)?(?:apps|packages|tools|site|deploy|docs|web)/[\w./\-]+)"
)
WORKFLOW_REF_RE = re.compile(r"\.github/workflows/[\w.\-]+")
# Build outputs and generated reports do not exist at commit time, so they are exempt from
# the existence check. Only source paths must resolve.
GENERATED_MARKERS = ("/build/", "native-test-summary.json", "/DerivedData/")
# Anything that would push an artifact to a store. None of these may appear.
FORBIDDEN_UPLOAD = (
    "r0adkll/upload-google-play",
    "altool",
    "notarytool",
    "xcrun altool",
    "publishReleaseBundle",
    "google-play-github-action",
    "fastlane supply",
    "fastlane pilot",
)


def workflow_kind(path: Path) -> str | None:
    """Which required workflow kind this file is, under either naming scheme."""
    for kind, names in KIND_NAMES.items():
        if path.stem in names:
            return kind
    return None


def salim_workflows(directory: Path = WORKFLOWS) -> dict[str, Path]:
    found: dict[str, Path] = {}
    if not directory.is_dir():
        return found
    for path in sorted(directory.glob("*.yml")):
        kind = workflow_kind(path)
        if kind and kind not in found:
            found[kind] = path
    return found


def check(workflows_dir: Path = WORKFLOWS) -> list[str]:
    problems: list[str] = []
    found = salim_workflows(workflows_dir)

    for kind in REQUIRED_KINDS:
        if kind not in found:
            problems.append(f"missing workflow for: {kind}")
    if not found:
        return problems

    for kind, path in sorted(found.items()):
        name = path.name
        text = path.read_text(encoding="utf-8")
        lowered = text.lower()

        # The pre-rename name is never valid. The capsule name is valid only inside the
        # capsule, where it is the real location of every file.
        if "sahm-workspace/" in text:
            problems.append(f"{name}: references the pre-rename capsule path")
        if not IS_CAPSULE and "salim-workspace/" in text:
            problems.append(f"{name}: references the pre-migration capsule path")

        for candidate in sorted(set(PATH_RE.findall(text))):
            if any(marker in candidate for marker in GENERATED_MARKERS):
                continue
            target = re.sub(r"/\*+$", "", candidate)
            if target.endswith("/"):
                target = target.rstrip("/")
            if not (ROOT / target).exists():
                problems.append(f"{name}: path does not exist: {candidate}")

        for reference in sorted(set(WORKFLOW_REF_RE.findall(text))):
            if not (ROOT / reference).is_file():
                problems.append(f"{name}: workflow reference does not exist: {reference}")

        for term in FORBIDDEN_UPLOAD:
            if term.lower() in lowered:
                problems.append(f"{name}: contains a store-upload command: {term}")

        if kind == "release-signing":
            if "workflow_dispatch" not in text:
                problems.append(f"{name}: must remain workflow_dispatch triggered")
            # A push/pull_request/schedule trigger would run signing without a human.
            if re.search(r"^\s{2}(push|pull_request|schedule):", text, re.MULTILINE):
                problems.append(f"{name}: must not run on push, pull_request or schedule")
            # Both signing jobs must be environment-gated; one unprotected job is enough
            # to expose signing material, so require every job to carry it.
            if text.count("environment: salim-release") < 2:
                problems.append(
                    f"{name}: every signing job must run in the salim-release environment"
                )
    return problems


def main() -> int:
    problems = check()
    layout = "capsule" if IS_CAPSULE else "standalone"
    for problem in problems:
        print(f"FAIL {problem}", file=sys.stderr)
    if problems:
        return 1
    print(
        f"Workflow check passed ({layout}): {len(REQUIRED_KINDS)} workflows, "
        "paths resolve, manual-only signing."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
