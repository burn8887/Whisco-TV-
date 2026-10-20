#!/usr/bin/env python3
"""Validate the static salimdrive.com pages before they are published.

Checks structure (required pages, stylesheet, nav, viewport, language), unreplaced
publication placeholders, and claims the product must never make. Exits non-zero on
any failure so it can gate a release or be run locally before a deploy.
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REQUIRED_PAGES = ("index.html", "privacy.html", "support.html")
REQUIRED_FILES = REQUIRED_PAGES + ("style.css",)
PLACEHOLDER_RE = re.compile(r"<span class=\"placeholder\">([A-Z][A-Z ]*)</span>")
# Phrases that would misrepresent the build or invite store rejection.
FORBIDDEN_CLAIMS = (
    "guaranteed",
    "official partner",
    "officially endorsed",
    "100% accurate",
    "never miss",
    "avoid every fine",
    "avoid all fines",
    "police radar detector",
    "radar detector",
    "jammer",
)


def find_placeholders(text: str) -> list[str]:
    return sorted(set(PLACEHOLDER_RE.findall(text)))


def check(root: Path, allow_placeholders: bool = False) -> list[str]:
    problems: list[str] = []
    for name in REQUIRED_FILES:
        if not (root / name).is_file():
            problems.append(f"missing required file: {name}")
    if problems:
        return problems

    placeholders: set[str] = set()
    for name in REQUIRED_PAGES:
        text = (root / name).read_text(encoding="utf-8")
        if "<html lang=" not in text:
            problems.append(f"{name}: missing html lang attribute")
        if 'name="viewport"' not in text:
            problems.append(f"{name}: missing responsive viewport meta")
        if "<title>" not in text:
            problems.append(f"{name}: missing title")
        if 'rel="stylesheet" href="style.css"' not in text:
            problems.append(f"{name}: does not link style.css")
        if "<h1" not in text:
            problems.append(f"{name}: missing h1")
        for href in ("index.html", "privacy.html", "support.html"):
            if f'href="{href}"' not in text:
                problems.append(f"{name}: missing navigation link to {href}")
        lowered = text.lower()
        for claim in FORBIDDEN_CLAIMS:
            if claim in lowered:
                problems.append(f"{name}: forbidden claim {claim!r}")
        placeholders.update(find_placeholders(text))

    css = (root / "style.css").read_text(encoding="utf-8").lower()
    if "#1f5c47" not in css:
        problems.append("style.css: missing Salim Green #1f5c47")
    if not re.search(r"prefers-color-scheme", css):
        problems.append("style.css: missing dark-mode support")

    if placeholders and not allow_placeholders:
        joined = ", ".join(sorted(placeholders))
        problems.append(f"{len(placeholders)} publication placeholder(s) still to fill: {joined}")
    return problems


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("root", nargs="?", default="salim-workspace/site", type=Path)
    parser.add_argument(
        "--allow-placeholders",
        action="store_true",
        help="treat unfilled publication placeholders as warnings instead of errors",
    )
    args = parser.parse_args(argv)

    problems = check(args.root, allow_placeholders=args.allow_placeholders)
    placeholders = sorted(
        {
            item
            for name in REQUIRED_PAGES
            for item in find_placeholders((args.root / name).read_text(encoding="utf-8"))
        }
    ) if all((args.root / n).is_file() for n in REQUIRED_PAGES) else []

    for name in placeholders:
        stream = sys.stdout if args.allow_placeholders else sys.stderr
        print(f"placeholder to fill: {name}", file=stream)
    for problem in problems:
        print(f"FAIL {problem}", file=sys.stderr)
    if problems:
        return 1
    print(f"Site checked: {len(REQUIRED_PAGES)} pages, {len(REQUIRED_FILES)} files, no forbidden claims.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
