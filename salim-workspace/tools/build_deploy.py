#!/usr/bin/env python3
"""Assemble the uploadable Netlify bundle in `salim-workspace/deploy/`.

`index.html` is the interactive Salim web demonstrator compiled to a single
self-contained document: CSS, JavaScript and fonts are inlined, so the file works
from a file:// URL, a drag-and-drop Netlify deploy or any static host with no
build step and no external asset requests.

`privacy.html` and `support.html` are the publication pages with the stylesheet
inlined, ready to serve at /privacy and /support for the app stores.

The script never invents contact details. It fails if the publication pages still
contain unreplaced placeholders, unless --allow-placeholders is passed (used while
drafting the preview).
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
WEB = CAPSULE / "apps" / "salim-web"
SITE = CAPSULE / "site"
OUT = CAPSULE / "deploy"

REDIRECTS = """/privacy    /privacy.html   200
/support    /support.html   200
/index.html /               200
"""

HEADERS = """/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
"""


def run(cmd: list[str], cwd: Path, env: dict | None = None) -> None:
    result = subprocess.run(cmd, cwd=cwd, env=env, text=True, capture_output=True)
    if result.returncode != 0:
        sys.stderr.write(result.stdout[-4000:] + result.stderr[-4000:])
        raise SystemExit(f"command failed: {' '.join(cmd)}")


def inline_web_build(dist: Path) -> str:
    """Return one HTML document with every script, stylesheet and font inlined."""
    html = (dist / "index.html").read_text(encoding="utf-8")

    css_tags = re.findall(r'<link[^>]+rel="stylesheet"[^>]*>', html)
    css = []
    for tag in css_tags:
        href = re.search(r'href="([^"]+)"', tag)
        if not href:
            continue
        path = dist / href.group(1).lstrip("/")
        if path.is_file():
            css.append(path.read_text(encoding="utf-8"))
        html = html.replace(tag, "")

    js_tags = re.findall(r'<script[^>]+src="([^"]+)"[^>]*>\s*</script>', html)
    js = []
    for src in js_tags:
        path = dist / src.lstrip("/")
        if path.is_file():
            js.append(path.read_text(encoding="utf-8"))
        html = re.sub(r'<script[^>]+src="' + re.escape(src) + r'"[^>]*>\s*</script>', "", html)

    bundle = "\n".join(js)
    # A literal </script> inside a string would close the tag early.
    bundle = bundle.replace("</script>", "<\\/script>")

    head = "<style>\n" + "\n".join(css) + "\n</style>\n" if css else ""
    body = "<script>\n" + bundle + "\n</script>\n" if js else ""
    html = html.replace("</head>", head + "</head>", 1)
    html = html.replace("</body>", body + "</body>", 1)
    return html


def inline_style(page: Path) -> str:
    """Inline style.css into a publication page and normalise its links."""
    html = page.read_text(encoding="utf-8")
    css = (SITE / "style.css").read_text(encoding="utf-8")
    html = html.replace(
        '<link rel="stylesheet" href="style.css" />',
        "<style>\n" + css + "\n</style>",
        1,
    )
    # Keep /privacy and /support canonical so the store URLs are stable.
    html = html.replace('href="privacy.html"', 'href="/privacy"')
    html = html.replace('href="support.html"', 'href="/support"')
    html = html.replace('href="index.html"', 'href="/"')
    return html


def check_no_external_assets(name: str, html: str) -> list[str]:
    problems = []
    if re.search(r'<link[^>]+rel="stylesheet"', html):
        problems.append(f"{name}: still links an external stylesheet")
    if re.search(r'<script[^>]+src=', html):
        problems.append(f"{name}: still loads an external script")
    if re.search(r'<(img|source)[^>]+src="/', html):
        problems.append(f"{name}: still references a root-relative image")
    return problems


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--allow-placeholders", action="store_true")
    parser.add_argument("--skip-build", action="store_true", help="reuse the previous dist/ output")
    args = parser.parse_args(argv)

    if not (WEB / "node_modules").is_dir():
        run(["npm", "ci", "--silent"], WEB)

    if not args.skip_build:
        import os

        env = dict(os.environ, SALIM_INLINE_ASSETS="100000000")
        run(["npm", "run", "build"], WEB, env=env)

    dist = WEB / "dist"
    if not (dist / "index.html").is_file():
        raise SystemExit("web build produced no index.html")

    if OUT.exists():
        shutil.rmtree(OUT)
    OUT.mkdir(parents=True)

    problems: list[str] = []

    app = inline_web_build(dist)
    problems += check_no_external_assets("index.html", app)
    (OUT / "index.html").write_text(app, encoding="utf-8")

    for page in ("privacy.html", "support.html"):
        html = inline_style(SITE / page)
        problems += check_no_external_assets(page, html)
        if "class=\"placeholder\"" in html and not args.allow_placeholders:
            problems.append(f"{page}: publication placeholders are still unfilled")
        (OUT / page).write_text(html, encoding="utf-8")

    (OUT / "_redirects").write_text(REDIRECTS, encoding="utf-8")
    (OUT / "_headers").write_text(HEADERS, encoding="utf-8")
    # These pages are the public store-facing privacy and support URLs, so they
    # must stay crawlable; only the app demo root is excluded from indexing.
    (OUT / "robots.txt").write_text(
        "User-agent: *\nAllow: /privacy\nAllow: /support\n", encoding="utf-8"
    )

    sizes = {p.name: p.stat().st_size for p in sorted(OUT.iterdir())}
    for problem in problems:
        print(f"FAIL {problem}", file=sys.stderr)
    if problems:
        return 1
    print("Deploy bundle ready in salim-workspace/deploy/")
    for name, size in sizes.items():
        print(f"  {name:14} {size / 1024:8.1f} KiB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
