import importlib.util
import shutil
import tempfile
import unittest
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
PRE_RENAME = "sahm" + "-workspace"


def _find_repo(start: Path) -> Path:
    for candidate in (start, *start.parents):
        if (candidate / ".github" / "workflows").is_dir():
            return candidate
    return start.parent


# Workflows live beside the tools in the standalone repository and one level above them
# inside the capsule. Probe for `.github/workflows` rather than counting parents.
REPO = _find_repo(TOOLS)

spec = importlib.util.spec_from_file_location("check_workflows", TOOLS / "check_workflows.py")
check_workflows = importlib.util.module_from_spec(spec)
spec.loader.exec_module(check_workflows)


class WorkflowCheckTests(unittest.TestCase):
    """The checks must hold under both the capsule and the standalone naming scheme."""

    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp()) / "workflows"
        shutil.copytree(REPO / ".github" / "workflows", self.tmp)

    def tearDown(self):
        shutil.rmtree(self.tmp.parent, ignore_errors=True)

    def workflow(self, kind: str) -> Path:
        for path in sorted(self.tmp.glob("*.yml")):
            if check_workflows.workflow_kind(path) == kind:
                return path
        raise AssertionError(
            f"no {kind} workflow in {sorted(p.name for p in self.tmp.glob('*.yml'))}"
        )

    def test_repository_workflows_are_valid(self):
        self.assertEqual(check_workflows.check(), [])

    def test_pre_rename_path_is_rejected(self):
        path = self.workflow("android")
        path.write_text(path.read_text().replace("tools/", PRE_RENAME + "/tools/", 1))
        problems = check_workflows.check(self.tmp)
        self.assertTrue(any("pre-rename" in p for p in problems), problems)

    def test_missing_path_is_rejected(self):
        path = self.workflow("android")
        path.write_text(
            path.read_text().replace("tools/check_android_apk.py", "tools/does_not_exist.py", 1)
        )
        problems = check_workflows.check(self.tmp)
        self.assertTrue(any("does not exist" in p for p in problems), problems)

    def test_automatic_play_upload_is_rejected(self):
        path = self.workflow("release-signing")
        path.write_text(path.read_text() + "\n# uses: r0adkll/upload-google-play@v1\n")
        problems = check_workflows.check(self.tmp)
        self.assertTrue(any("Google Play upload" in p for p in problems), problems)

    def test_app_store_upload_must_follow_identity_verification(self):
        path = self.workflow("release-signing")
        text = path.read_text()
        text = text.replace("      - name: Verify the IPA signature and identity\n", "", 1)
        path.write_text(text)
        problems = check_workflows.check(self.tmp)
        self.assertTrue(any("must follow IPA signature" in p for p in problems), problems)

    def test_signing_workflow_must_not_trigger_on_push(self):
        path = self.workflow("release-signing")
        path.write_text(
            path.read_text().replace(
                "on:\n  workflow_dispatch:", "on:\n  push:\n  workflow_dispatch:", 1
            )
        )
        problems = check_workflows.check(self.tmp)
        self.assertTrue(any("must not run on push" in p for p in problems), problems)

    def test_signing_workflow_must_use_the_environment(self):
        path = self.workflow("release-signing")
        path.write_text(path.read_text().replace("environment: salim-release", "environment: other"))
        problems = check_workflows.check(self.tmp)
        self.assertTrue(any("salim-release environment" in p for p in problems), problems)

    def test_one_ungated_signing_job_is_rejected(self):
        path = self.workflow("release-signing")
        path.write_text(
            path.read_text().replace("environment: salim-release", "environment: other", 1)
        )
        problems = check_workflows.check(self.tmp)
        self.assertTrue(any("salim-release environment" in p for p in problems), problems)

    def test_missing_workflow_is_reported(self):
        self.workflow("ios").unlink()
        problems = check_workflows.check(self.tmp)
        self.assertTrue(any("missing workflow for: ios" in p for p in problems), problems)


if __name__ == "__main__":
    unittest.main()
