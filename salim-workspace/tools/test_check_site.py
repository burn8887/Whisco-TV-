import shutil
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import check_site  # noqa: E402

SITE = Path(__file__).resolve().parents[1] / "site"


class SiteCheckTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        for name in check_site.REQUIRED_FILES:
            shutil.copy(SITE / name, self.tmp / name)

    def tearDown(self):
        shutil.rmtree(self.tmp, ignore_errors=True)

    def test_repository_pages_structurally_valid(self):
        problems = check_site.check(SITE, allow_placeholders=True)
        self.assertEqual(problems, [], problems)

    def test_unfilled_placeholders_fail_by_default(self):
        problems = check_site.check(self.tmp)
        self.assertTrue(any("placeholder" in p for p in problems), problems)

    def test_placeholders_allowed_when_drafting(self):
        problems = [p for p in check_site.check(self.tmp, allow_placeholders=True) if "placeholder" in p]
        self.assertEqual(problems, [])

    def test_filled_placeholders_pass(self):
        for name in check_site.REQUIRED_PAGES:
            path = self.tmp / name
            text = check_site.PLACEHOLDER_RE.sub(lambda m: "Example", path.read_text())
            path.write_text(text)
        self.assertEqual(check_site.check(self.tmp), [])

    def test_forbidden_claim_is_rejected(self):
        path = self.tmp / "index.html"
        path.write_text(path.read_text().replace("Know what", "Guaranteed results. Know what", 1))
        problems = check_site.check(self.tmp, allow_placeholders=True)
        self.assertTrue(any("guaranteed" in p for p in problems), problems)

    def test_missing_page_is_rejected(self):
        (self.tmp / "privacy.html").unlink()
        problems = check_site.check(self.tmp, allow_placeholders=True)
        self.assertTrue(any("privacy.html" in p for p in problems), problems)


if __name__ == "__main__":
    unittest.main()
