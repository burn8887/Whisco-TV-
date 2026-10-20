import importlib.util
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

TOOLS = Path(__file__).resolve().parent
REPO = TOOLS.parents[1]
spec = importlib.util.spec_from_file_location("check_workflows", TOOLS / "check_workflows.py")
check_workflows = importlib.util.module_from_spec(spec)
spec.loader.exec_module(check_workflows)


class WorkflowCheckTests(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp()) / "workflows"
        shutil.copytree(REPO / ".github" / "workflows", self.tmp)

    def tearDown(self):
        shutil.rmtree(self.tmp.parent, ignore_errors=True)

    def test_repository_workflows_are_valid(self):
        self.assertEqual(check_workflows.check(), [])

    def test_stale_pre_rename_path_is_rejected(self):
        path = self.tmp / "salim-android-build.yml"
        path.write_text(path.read_text().replace("salim-workspace/", "sahm-workspace/", 1))
        problems = check_workflows.check(self.tmp)
        self.assertTrue(any("pre-rename" in p for p in problems), problems)

    def test_missing_capsule_path_is_rejected(self):
        path = self.tmp / "salim-ios-build.yml"
        path.write_text(
            path.read_text().replace(
                "salim-workspace/tools/materialize.py",
                "salim-workspace/tools/does_not_exist.py",
                1,
            )
        )
        problems = check_workflows.check(self.tmp)
        self.assertTrue(any("does not exist" in p for p in problems), problems)

    def test_store_upload_command_is_rejected(self):
        path = self.tmp / "salim-release-signing.yml"
        path.write_text(path.read_text() + "\n# run: xcrun altool --upload-app\n")
        problems = check_workflows.check(self.tmp)
        self.assertTrue(any("store-upload" in p for p in problems), problems)

    def test_signing_workflow_must_not_trigger_on_push(self):
        path = self.tmp / "salim-release-signing.yml"
        text = path.read_text().replace("on:\n  workflow_dispatch:", "on:\n  push:\n  workflow_dispatch:", 1)
        path.write_text(text)
        problems = check_workflows.check(self.tmp)
        self.assertTrue(any("must not run on push" in p for p in problems), problems)

    def test_signing_workflow_must_use_the_environment(self):
        path = self.tmp / "salim-release-signing.yml"
        path.write_text(path.read_text().replace("environment: salim-release", "environment: other"))
        problems = check_workflows.check(self.tmp)
        self.assertTrue(any("salim-release environment" in p for p in problems), problems)

    def test_one_ungated_signing_job_is_rejected(self):
        path = self.tmp / "salim-release-signing.yml"
        path.write_text(path.read_text().replace("environment: salim-release", "environment: other", 1))
        problems = check_workflows.check(self.tmp)
        self.assertTrue(any("salim-release environment" in p for p in problems), problems)

    def test_missing_workflow_is_reported(self):
        (self.tmp / "salim-ios-build.yml").unlink()
        problems = check_workflows.check(self.tmp)
        self.assertTrue(any("missing workflow" in p for p in problems), problems)


if __name__ == "__main__":
    unittest.main()
