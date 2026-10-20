#!/usr/bin/env python3
"""Check the Salim workflows reference files that actually exist.

The capsule was renamed from `sahm-workspace/` to `salim-workspace/`. A stale path in a
workflow is invisible until that job runs, which for the manual signed-release workflow
could be months later. This check catches the whole class of mistake at commit time.

Also enforces the agreed guard rails: the signed-release workflow must stay manual-only
and must not contain any upload step to a store.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WORKFLOWS = ROOT / ".github" / "workflows"
SALIM_WORKFLOWS = (
    "salim-android-build.yml",
    "salim-ios-build.yml",
    "salim-release-signing.yml",
)
# Repository-relative paths mentioned in a workflow that must resolve on disk.
PATH_RE = re.compile(r"(?<![\w/.-])((?:salim|sahm)-workspace/[\w./-]+)")
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


def check(workflows_dir: Path = WORKFLOWS) -> list[str]:
    problems: list[str] = []
    for name in SALIM_WORKFLOWS:
        path = workflows_dir / name
        if not path.is_file():
            problems.append(f"missing workflow: {name}")
            continue
        text = path.read_text(encoding="utf-8")
        lowered = text.lower()

        # Only the top-level checkout of the capsule may be referenced, never the old name.
        if "sahm-workspace/" in text:
            problems.append(f"{name}: references the pre-rename sahm-workspace/ path")

        for candidate in sorted(set(PATH_RE.findall(text))):
            # A trailing /** or /* glob refers to a directory that must still exist.
            target = re.sub(r"/\*+$", "", candidate)
            if not (ROOT / target).exists():
                problems.append(f"{name}: path does not exist: {candidate}")

        for term in FORBIDDEN_UPLOAD:
            if term.lower() in lowered:
                problems.append(f"{name}: contains a store-upload command: {term}")

        if name == "salim-release-signing.yml":
            if "workflow_dispatch" not in text:
                problems.append(f"{name}: must remain workflow_dispatch triggered")
            # A push/pull_request trigger would run signing without a human decision.
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
    for problem in problems:
        print(f"FAIL {problem}", file=sys.stderr)
    if problems:
        return 1
    print(f"Workflow check passed: {len(SALIM_WORKFLOWS)} Salim workflows, paths resolve, manual-only signing.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
