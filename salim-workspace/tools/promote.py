#!/usr/bin/env python3
"""Promote the Salim capsule into a standalone repository tree.

The capsule under `salim-workspace/` exists only because Salim had to live inside an
unrelated application's repository. This script performs the one-way transformation into
the layout used by `burn8887/salim-drive`:

    salim-workspace/apps/salim-android  ->  apps/android
    salim-workspace/apps/salim-ios      ->  apps/ios
    salim-workspace/apps/salim-web      ->  web            (real filenames)
    salim-workspace/packages/salim-core ->  packages/core  (real filenames)
    salim-workspace/{site,deploy,docs}  ->  same names at the root

It drops the capsule-only scaffolding (materialize.py, verify_isolation.py and their
tests), moves the Android package to `com.salimdrive.app`, and rewrites the three
workflows to trigger on `main` with no copy-out step.

Keeping this as a script rather than a copied directory means a lost workspace costs
nothing: the migration is one command away and is checked mechanically.

Usage:
    python3 salim-workspace/tools/promote.py --output /home/user/salim-drive --verify
"""
from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
CAPSULE = HERE.parent
REPO = CAPSULE.parent

# Capsule-only scaffolding: meaningless once there is no host application to protect.
DROP_TOOLS = {"materialize.py", "test_materialize.py", "verify_isolation.py"}
KEEP_TOOLS = {
    "build_deploy.py",
    "check_android_apk.py",
    "check_site.py",
    "check_workflows.py",
    "promote.py",
    "report_native_tests.py",
    "test_android_apk.py",
    "test_check_site.py",
    "test_check_workflows.py",
}

# Documents that describe the capsule itself. Their old identifiers and old paths are the
# subject matter, so rewriting them would falsify the record.
NO_REWRITE = {"MIGRATION-TO-OWN-REPO.md", "PROJECT-HISTORY.md"}

WORKFLOW_FILES = (
    ("salim-android-build.yml", "android.yml"),
    ("salim-ios-build.yml", "ios.yml"),
    ("salim-release-signing.yml", "release-signing.yml"),
)

# Applied to every copied text file except the historical documents. Order matters:
# precise rewrites run before the catch-all.
IDENTIFIERS: list[tuple[str, str]] = [
    ("package app.salim.core", "package com.salimdrive.core"),
    ("import app.salim.core", "import com.salimdrive.core"),
    ("package app.salim", "package com.salimdrive.app"),
    ("import app.salim.", "import com.salimdrive."),
    ('namespace = "app.salim"', 'namespace = "com.salimdrive.app"'),
    ('applicationId = "app.salim.android.demo"', 'applicationId = "com.salimdrive.app"'),
    ('versionName = releaseVersionName ?: "0.2.0-demo"',
     'versionName = releaseVersionName ?: "0.3.0-demo"'),
    ("versionCode = releaseVersionCode ?: 2", "versionCode = releaseVersionCode ?: 3"),
    ('rootProject.name = "Salim"', 'rootProject.name = "SalimDrive"'),
    ("bundleIdPrefix: app.salim", "bundleIdPrefix: com.salimdrive"),
    ("PRODUCT_BUNDLE_IDENTIFIER: app.salim.ios.demo",
     "PRODUCT_BUNDLE_IDENTIFIER: com.salimdrive.app"),
    ("MARKETING_VERSION: '0.2.0'", "MARKETING_VERSION: '0.3.0'"),
    ("CURRENT_PROJECT_VERSION: 2", "CURRENT_PROJECT_VERSION: 3"),
    ('"name": "salim-preview"', '"name": "@salimdrive/web"'),
    ('"version": "0.2.0"', '"version": "0.3.0"'),
    ('"test": "node --test ../../packages/salim-core/*.test.mjs"',
     '"test": "node --test ../packages/core/*.test.mjs"'),
    ("app.salim.android.demo", "com.salimdrive.app"),
    ("app.salim.ios.demo", "com.salimdrive.app"),
    ("app.salim.*", "com.salimdrive.*"),
]

# Path rewrites for documentation only. Never applied to tools/, whose source contains the
# literal capsule name it uses to detect the layout.
DOC_PATHS: list[tuple[str, str]] = [
    ("salim-workspace/apps/salim-android", "apps/android"),
    ("salim-workspace/apps/salim-ios", "apps/ios"),
    ("salim-workspace/apps/salim-web", "web"),
    ("salim-workspace/packages/salim-core", "packages/core"),
    ("salim-workspace/deploy", "deploy"),
    ("salim-workspace/site", "site"),
    ("salim-workspace/tools", "tools"),
    ("salim-workspace/docs", "docs"),
    ("salim-workspace/", ""),
]

# Artifact names and product-path nicknames that appear in prose. Markdown only, so tool
# sources keep their literal capsule name for layout detection.
DOC_TERMS: list[tuple[str, str]] = [
    ("salim-android-test-build", "android-test-build"),
    ("salim-android-device-tests", "android-device-tests"),
    ("salim-ios-simulator", "ios-simulator"),
    ("salim-android-signed", "android-signed"),
    ("salim-ios-signed", "ios-signed"),
    ("salim-android", "android"),
    ("salim-ios", "ios"),
]

# Workflow text substitutions, applied in order to every line of the three workflows.
# Order matters: strip the disposable-tree prefix first so the remaining paths can be
# renamed as ordinary repository paths.
WORKFLOW_SUBSTITUTIONS: list[tuple[str, str]] = [
    # 1. The copy-out step's output directory. Once removed, these are plain repo paths.
    ("${{ runner.temp }}/sahm/", ""),
    ("${{ runner.temp }}/salim/", ""),
    ("$RUNNER_TEMP/sahm/", ""),
    ("$RUNNER_TEMP/salim/", ""),
    # 2. Capsule prefix, for path filters and script invocations.
    ("salim-workspace/", ""),
    ("sahm-workspace/", ""),
    # 3. Application directories.
    ("apps/salim-android", "apps/android"),
    ("apps/salim-ios", "apps/ios"),
    ("apps/salim-web", "web"),
    # 4. Workflow self-references.
    ("salim-android-build.yml", "android.yml"),
    ("salim-ios-build.yml", "ios.yml"),
    ("salim-release-signing.yml", "release-signing.yml"),
    # 5. Bundle identifiers.
    ("app.salim.android.demo", "com.salimdrive.app"),
    ("app.salim.ios.demo", "com.salimdrive.app"),
    # 6. Artifact names.
    ("salim-android-test-build", "android-test-build"),
    ("salim-android-device-tests", "android-device-tests"),
    ("salim-ios-simulator", "ios-simulator"),
    ("salim-android-signed", "android-signed"),
    ("salim-ios-signed", "ios-signed"),
    ("salim-android-build.log", "android-build.log"),
    ("salim-ios-build.log", "ios-build.log"),
    ("salim-ios-archive.log", "ios-archive.log"),
    ("salim-ios-test-summary.json", "ios-test-summary.json"),
    ("salim-ios-results.xcresult", "ios-results.xcresult"),
    ("salim-derived", "derived"),
    # 7. Workflow display name, concurrency group and step titles.
    ("name: Salim Android build", "name: Android build"),
    ("name: Salim iOS simulator build", "name: iOS build"),
    ("name: Salim signed release", "name: Signed release"),
    ("group: salim-android-", "group: android-"),
    ("group: salim-ios-", "group: ios-"),
    ("name: Prepare Salim source and Xcode project", "name: Generate the Xcode project"),
    ("title=Salim ", "title="),
]

# The trigger pointed at the integration branch; the standalone repository uses main.
BRANCH_SUBSTITUTION = ("branches: [arena/3070ca80-whisco-tv]", "branches: [main]")


def _apply(text: str, rules: list[tuple[str, str]], regex: bool = False) -> str:
    for pattern, replacement in rules:
        if regex:
            text = re.sub(pattern, replacement, text)
        else:
            text = text.replace(pattern, replacement)
    return text


def _rewrite_workflow(text: str) -> str:
    """Convert one capsule workflow into its standalone form."""
    lines = text.splitlines(keepends=True)
    kept: list[str] = []
    skipping_step = False

    for line in lines:
        # Substitute first, so the step-detection below sees repository paths, not capsule
        # paths. Getting this order wrong leaves the copy-out step in place.
        for old, new in WORKFLOW_SUBSTITUTIONS:
            line = line.replace(old, new)
        line = line.replace(*BRANCH_SUBSTITUTION)
        stripped = line.strip()

        if skipping_step:
            if re.match(r"^      - ", line):
                skipping_step = False  # this line belongs to the next step
            else:
                continue

        # The copy-out step protects the host repository; there is no host here.
        if stripped == "- name: Materialize only Salim outside the host checkout":
            skipping_step = True
            continue

        # Its script is gone, so its path filter must go too.
        if stripped in ("- 'tools/materialize.py'", '- "tools/materialize.py"'):
            continue

        # The invitation to run it, wherever it appears inside a run block.
        if re.match(r"^[ \t]*python3 tools/materialize\.py\b", line):
            continue

        kept.append(line)

    return "".join(kept)


def _flatten_package(root: Path) -> None:
    """Move the demo package tree to the permanent `com.salimdrive` identifiers.

    Kotlin requires the directory to match the package declaration, so the sources are
    relocated rather than merely rewritten.
    """
    moves = (
        ("app/src/main/java", "app"),
        ("app/src/androidTest/java", "app"),
        ("core/src/main/kotlin", "core"),
        ("core/src/test/kotlin", "core"),
    )
    for base, leaf in moves:
        source = root / base / "app" / "salim"
        if not source.is_dir():
            continue
        if leaf == "core":
            source = source / "core"
            if not source.is_dir():
                continue
        target = root / base / "com" / "salimdrive" / leaf
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists():
            shutil.rmtree(target)
        shutil.move(str(source), str(target))
        shutil.rmtree(root / base / "app", ignore_errors=True)


def _fix_deploy_readme(output: Path) -> None:
    """Replace the capsule-only rebuild recipe with one that works in place."""
    path = output / "deploy" / "README.md"
    if not path.is_file():
        return
    text = path.read_text(encoding="utf-8")
    replacement = (
        "```sh\ncd web && npm ci && npm run build\n"
        "cd .. && python3 tools/build_deploy.py\n```\n"
    )
    text = re.sub(
        r"```sh\n(python3 [^\n]*materialize[^\n]*\n)[^`]*?```\n",
        replacement,
        text,
        count=1,
        flags=re.S,
    )
    path.write_text(text, encoding="utf-8")


def _prepare(output: Path) -> None:
    """Create the output directory, clearing a previous promotion but never a stranger."""
    resolved = output.resolve()
    for protected in (REPO.resolve(), CAPSULE.resolve()):
        if resolved == protected or resolved in protected.parents or protected in resolved.parents:
            raise SystemExit(f"refusing to write into the source tree: {resolved}")
    if resolved.parent == Path(resolved.anchor):
        raise SystemExit(f"refusing to use a filesystem root as output: {resolved}")

    if output.exists():
        if not output.is_dir():
            raise SystemExit(f"output is not a directory: {output}")
        entries = list(output.iterdir())
        looks_promoted = (output / "apps" / "android").is_dir() or (output / "web").is_dir()
        if entries and not looks_promoted:
            raise SystemExit(f"refusing to clear {output}: it does not look like a promoted tree")
        for entry in entries:
            if entry.name == ".git":
                continue  # keep the history of a previous promotion
            if entry.is_symlink() or not entry.is_dir():
                entry.unlink()
            else:
                shutil.rmtree(entry)
    output.mkdir(parents=True, exist_ok=True)


def build(output: Path) -> None:
    _prepare(output)

    shutil.copytree(CAPSULE / "apps" / "salim-android", output / "apps" / "android")
    shutil.copytree(CAPSULE / "apps" / "salim-ios", output / "apps" / "ios")
    shutil.copytree(CAPSULE / "apps" / "salim-web", output / "web")
    shutil.copytree(CAPSULE / "packages" / "salim-core", output / "packages" / "core")
    for name in ("site", "deploy", "docs"):
        shutil.copytree(CAPSULE / name, output / name)

    (output / "tools").mkdir()
    for name in sorted(KEEP_TOOLS):
        source = CAPSULE / "tools" / name
        if source.is_file():
            shutil.copy2(source, output / "tools" / name)

    # .source exists only to hide modules from the host project's scanner.
    for directory in (output / "web" / "src", output / "web", output / "packages" / "core"):
        for path in list(directory.glob("*.source")):
            path.rename(path.with_suffix(""))

    _flatten_package(output / "apps" / "android")

    workflows = output / ".github" / "workflows"
    workflows.mkdir(parents=True)
    for source_name, target_name in WORKFLOW_FILES:
        text = (REPO / ".github" / "workflows" / source_name).read_text(encoding="utf-8")
        (workflows / target_name).write_text(_rewrite_workflow(text), encoding="utf-8")

    text_suffixes = {
        ".kt", ".kts", ".swift", ".yml", ".md", ".py", ".json", ".html", ".css",
        ".js", ".jsx", ".mjs", ".xml", ".plist", ".properties", ".txt",
    }
    for path in output.rglob("*"):
        if not path.is_file() or path.suffix not in text_suffixes:
            continue
        if workflows in path.parents:
            continue  # already rewritten above
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        if path.name in NO_REWRITE:
            continue
        original = text
        text = _apply(text, IDENTIFIERS)
        if "tools" not in path.relative_to(output).parts:
            text = _apply(text, DOC_PATHS)
        if path.suffix == ".md":
            text = _apply(text, DOC_TERMS)
        if text != original:
            path.write_text(text, encoding="utf-8")

    _fix_deploy_readme(output)

    (output / ".gitignore").write_text(GITIGNORE, encoding="utf-8")
    (output / "README.md").write_text(README, encoding="utf-8")


def verify(output: Path) -> list[str]:
    problems: list[str] = []
    text_suffixes = {
        ".kt", ".kts", ".swift", ".yml", ".md", ".py", ".json", ".html", ".js",
        ".jsx", ".mjs",
    }
    allowed_stale = NO_REWRITE | {
        "README.md", "check_workflows.py", "check_site.py", "promote.py"
    }

    for path in output.rglob("*"):
        if not path.is_file() or path.suffix not in text_suffixes:
            continue
        rel = path.relative_to(output)
        text = path.read_text(encoding="utf-8", errors="replace")
        for stale in (
            "salim-workspace",
            "sahm-workspace",
            "app.salim",
            "salim-android",
            "salim-ios",
            "materialize.py",
        ):
            if stale in text and rel.name not in allowed_stale:
                problems.append(f"{rel}: stale reference {stale!r}")

    for removed in DROP_TOOLS:
        if any(output.rglob(removed)):
            problems.append(f"capsule-only file survived: {removed}")

    expected = [
        "apps/android/app/build.gradle.kts",
        "apps/android/app/src/main/java/com/salimdrive/app/MainActivity.kt",
        "apps/android/core/src/main/kotlin/com/salimdrive/core/Geo.kt",
        "apps/ios/project.yml",
        "web/src/App.jsx",
        "web/src/main.jsx",
        "web/vite.config.js",
        "packages/core/index.mjs",
        "packages/core/core.test.mjs",
        ".github/workflows/android.yml",
        ".github/workflows/ios.yml",
        ".github/workflows/release-signing.yml",
        "site/index.html",
        "deploy/index.html",
        "deploy/README.md",
        "tools/check_workflows.py",
        "docs/PROJECT-HISTORY.md",
        "README.md",
        ".gitignore",
    ]
    for rel in expected:
        if not (output / rel).is_file():
            problems.append(f"missing expected file: {rel}")

    gradle = output / "apps/android/app/build.gradle.kts"
    if gradle.is_file() and 'applicationId = "com.salimdrive.app"' not in gradle.read_text():
        problems.append("Android applicationId was not updated")
    project = output / "apps/ios/project.yml"
    if project.is_file() and "PRODUCT_BUNDLE_IDENTIFIER: com.salimdrive.app" not in project.read_text():
        problems.append("iOS bundle identifier was not updated")

    for name in ("android.yml", "ios.yml", "release-signing.yml"):
        path = output / ".github" / "workflows" / name
        if not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        if "branches: [main]" not in text and "workflow_dispatch" not in text:
            problems.append(f"{name}: no main trigger")
        if "tools/materialize.py" in text:
            problems.append(f"{name}: still references the copy-out script")

    return problems


GITIGNORE = """# Build and dependency output
node_modules/
dist/
build/
.gradle/
local.properties
*.pyc
__pycache__/
.DS_Store
*.xcodeproj/
*.xcworkspace/
DerivedData/

# Secrets and signing material
*.jks
*.keystore
*.p12
*.mobileprovision
*.p8
.env
.env.*
!.env.example

# Local tooling
.idea/
.vscode/
"""

README = """# Salim / \u0633\u0644\u064a\u0645

**Know what's ahead. Keep your calm.**

Salim is a calm co-pilot for the road ahead: direction-aware alerts for speed cameras, road
hazards, speed bumps and average-speed sections, built for Bahrain first and the wider Gulf next.

| Path | What it is |
| --- | --- |
| `apps/android/` | Kotlin + Jetpack Compose app, SQLite offline store |
| `apps/ios/` | SwiftUI app, MapKit, SQLite (WAL) |
| `web/` | React browser demonstrator |
| `packages/core/` | Shared geospatial engine and its tests |
| `site/` | Home, privacy and support pages for `www.salimdrive.com` |
| `deploy/` | Uploadable static bundle |
| `docs/` | Brand, name clearance, store checklist, signing runbook |
| `tools/` | Build and verification scripts |

## Status, stated honestly

This is a **demonstration**, not a shipped product.

- **All alert data is fictional.** No live or verified provider is connected.
- **No app has been published.** No store record, no TestFlight build, no signed upload.
- **No physical-device validation** of background location, audio, battery or accessibility.
- CarPlay, Android Auto, watchOS, vehicle automation, billing and in-app navigation are not
  implemented.
- Bundle identifier `com.salimdrive.app` is chosen but not yet registered in either account.

## Verify

```sh
python3 -m unittest discover -s tools -p 'test_*.py'
python3 tools/check_workflows.py
python3 tools/check_site.py site
```

## Provenance

Generated from the Salim capsule in `burn8887/Whisco-TV-` by `tools/promote.py` in that
repository. See `docs/PROJECT-HISTORY.md`.
"""


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--verify", action="store_true", help="run the promoted tree's own checks")
    args = parser.parse_args(argv)

    build(args.output)
    print(f"Promoted capsule to {args.output}")

    problems = verify(args.output)
    if args.verify:
        for cmd in (
            [sys.executable, "-m", "unittest", "discover", "-s", "tools", "-p", "test_*.py"],
            [sys.executable, "tools/check_workflows.py"],
            [sys.executable, "tools/check_site.py", "site", "--allow-placeholders"],
        ):
            result = subprocess.run(cmd, cwd=args.output, text=True, capture_output=True)
            if result.returncode != 0:
                problems.append(
                    f"{' '.join(cmd[1:])} failed:\n{result.stdout[-1200:]}{result.stderr[-1200:]}"
                )

    if problems:
        for problem in problems:
            print(f"FAIL {problem}", file=sys.stderr)
        return 1
    print("Verification passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
