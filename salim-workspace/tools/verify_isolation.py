#!/usr/bin/env python3
"""Verify Salim changes do not alter the pre-existing host application's tracked tree."""
from pathlib import Path
import subprocess
ROOT=Path(__file__).resolve().parents[2]
BASE='b18fd0129ed9c2b2a5e6eb4880c7171a8a252079'
def git(*args):return subprocess.check_output(['git','-C',str(ROOT),*args],text=True)
# The capsule was renamed from sahm-workspace/ to salim-workspace/ after the founder chose the
# Salim brand. Historical commits still reference the old prefix; both are Salim-only content.
CAPSULE_PREFIXES=('salim-workspace/','sahm-workspace/')
# Exactly four Salim-only workflow paths exist: the current names plus the pre-rename names that
# remain in earlier commits on this branch. No host workflow may be added, edited or removed.
APPROVED_WORKFLOWS={
    '.github/workflows/salim-android-build.yml',
    '.github/workflows/salim-ios-build.yml',
    '.github/workflows/sahm-android-build.yml',
    '.github/workflows/sahm-ios-build.yml',
}
def allowed(path):return path.startswith(CAPSULE_PREFIXES) or path in APPROVED_WORKFLOWS
changed=git('diff','--name-only',BASE,'HEAD').splitlines()
assert all(allowed(p) for p in changed),f'Host application change detected: {changed}'
for path in git('diff','--name-only','HEAD').splitlines():
    assert allowed(path),f'Uncommitted host change: {path}'
for path in APPROVED_WORKFLOWS:
    assert not git('ls-tree',BASE,'--',path).strip(),f'Workflow path collides with an existing host file: {path}'
for path in git('ls-files','--','salim-workspace').splitlines():
    assert Path(path).suffix not in {'.js','.jsx','.mjs','.cjs','.ts','.tsx','.mts','.cts'},f'Executable JS/TS exposed to host scanners: {path}'
    subprocess.run(['git','-C',str(ROOT),'check-ignore','--no-index','-q',path],check=True)
print(f'Isolation verified: {len(changed)} changed paths, only Salim source and explicitly approved new Salim build workflows; existing host files unchanged.')
