#!/usr/bin/env python3
"""Verify Salim changes do not alter the pre-existing host application's tracked tree.

Also guards against two workspace hazards seen in practice:
  * the checkout being silently re-cloned at the baseline commit, which would make the
    capsule look empty and could produce a misleadingly clean push;
  * compiled Python or other generated files being force-added into the capsule.
"""
from pathlib import Path
import subprocess
ROOT=Path(__file__).resolve().parents[2]
BASE='32c4749660862852fd4b59cc53d8aa4acb30aed9'
BRANCH='arena/74afd701-whisco-tv'
def git(*args):return subprocess.check_output(['git','-C',str(ROOT),*args],text=True)
# The capsule was renamed from sahm-workspace/ to salim-workspace/ after the founder chose the
# Salim brand. Historical commits still reference the old prefix; both are Salim-only content.
CAPSULE_PREFIXES=('salim-workspace/','sahm-workspace/')
# Only these Salim-specific workflows may change; general host workflows remain protected.
APPROVED_WORKFLOWS={
    '.github/workflows/salim-android-build.yml',
    '.github/workflows/salim-ios-build.yml',
    '.github/workflows/salim-release-signing.yml',
    '.github/workflows/sahm-android-build.yml',
    '.github/workflows/sahm-ios-build.yml',
}
GENERATED_SUFFIXES={'.pyc','.pyo'}
GENERATED_PARTS={'__pycache__','node_modules','.gradle','build','dist'}
EXPLICIT_CAPSULE_FILES={'salim-workspace/apps/salim-android/app/src/main/java/app/salim/AdMob.kt','salim-workspace/apps/salim-ios/Salim/Ads.swift'}
def allowed(path):return path.startswith(CAPSULE_PREFIXES) or path in APPROVED_WORKFLOWS

# Guard 1: the branch tip must still contain the capsule. A re-cloned checkout sits at BASE.
tracked=git('ls-files','--','salim-workspace').splitlines()
assert len(tracked)>=70,f'Capsule looks incomplete ({len(tracked)} tracked files); the checkout may have reverted to baseline.'
assert git('rev-parse','HEAD').strip()!=BASE,'HEAD is the baseline commit; fetch and rebase onto the remote branch tip before verifying.'

# Guard 2: local history must not be behind the pushed branch. Being behind means a re-clone or
# reset discarded commits; pushing from here would attempt to rewrite published history.
remote_ref=f'origin/{BRANCH}'
if subprocess.run(['git','-C',str(ROOT),'rev-parse','--verify','--quiet',remote_ref],capture_output=True).returncode==0:
    ancestor=subprocess.run(['git','-C',str(ROOT),'merge-base','--is-ancestor',remote_ref,'HEAD']).returncode==0
    assert ancestor,f'{remote_ref} is not an ancestor of HEAD; local history is behind or diverged. Recover with git reset --mixed {remote_ref} and recommit.'

# Guard 3: no generated files may be tracked inside the capsule.
for path in tracked:
    parts=set(Path(path).parts)
    assert not (parts & GENERATED_PARTS),f'Generated directory tracked in the capsule: {path}'
    assert Path(path).suffix not in GENERATED_SUFFIXES,f'Compiled file tracked in the capsule: {path}'

changed=git('diff','--name-only',BASE,'HEAD').splitlines()
assert all(allowed(p) for p in changed),f'Host application change detected: {changed}'
for path in git('diff','--name-only','HEAD').splitlines():
    assert allowed(path),f'Uncommitted host change: {path}'
for path in tracked:
    assert Path(path).suffix not in {'.js','.jsx','.mjs','.cjs','.ts','.tsx','.mts','.cts'},f'Executable JS/TS exposed to host scanners: {path}'
    if path not in EXPLICIT_CAPSULE_FILES:
        subprocess.run(['git','-C',str(ROOT),'check-ignore','--no-index','-q',path],check=True)
print(f'Isolation verified: {len(changed)} changed paths and {len(tracked)} tracked capsule files, only Salim source and explicitly approved new Salim build workflows; existing host files unchanged.')
