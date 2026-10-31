#!/usr/bin/env python3
"""Build the free GitHub Pages bundle for www.salimdrive.com (privacy, support, home).

Output: a folder (default /tmp/salimdrive-site) containing index.html, privacy.html,
support.html with the stylesheet inlined, plus CNAME and .nojekyll. Upload its contents to
the root of a public GitHub repository and enable Pages; see the step-by-step guide.

    python3 salim-workspace/tools/build_pages.py [--out DIR] [--domain www.salimdrive.com]
"""
from __future__ import annotations
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build_deploy as b  # noqa: E402
from check_site import check  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=Path("/tmp/salimdrive-site"))
    parser.add_argument("--domain", default="www.salimdrive.com")
    args = parser.parse_args()
    problems = check(b.SITE)
    if problems:
        print("\n".join(problems), file=sys.stderr)
        return 1
    args.out.mkdir(parents=True, exist_ok=True)
    for name in ("index.html", "privacy.html", "support.html"):
        html = b.inline_style(b.SITE / name)
        issues = b.check_no_external_assets(name, html)
        if issues:
            print("\n".join(issues), file=sys.stderr)
            return 1
        (args.out / name).write_text(html, encoding="utf-8")
    (args.out / "CNAME").write_text(args.domain + "\n", encoding="utf-8")
    (args.out / ".nojekyll").write_text("", encoding="utf-8")
    print(f"GitHub Pages bundle written to {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
