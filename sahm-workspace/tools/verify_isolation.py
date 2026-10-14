#!/usr/bin/env python3
"""Verify Sahm changes do not alter the pre-existing host application's tracked tree."""
from pathlib import Path
import subprocess
ROOT=Path(__file__).resolve().parents[2]
BASE='b18fd0129ed9c2b2a5e6eb4880c7171a8a252079'
def git(*args):return subprocess.check_output(['git','-C',str(ROOT),*args],text=True)
changed=git('diff','--name-only',BASE,'HEAD').splitlines()
assert all(p.startswith('sahm-workspace/') for p in changed),f'Host application change detected: {changed}'
for path in git('diff','--name-only','HEAD').splitlines():
    assert path.startswith('sahm-workspace/'),f'Uncommitted host change: {path}'
for path in git('ls-files','--','sahm-workspace').splitlines():
    assert Path(path).suffix not in {'.js','.jsx','.mjs','.cjs','.ts','.tsx','.mts','.cts'},f'Executable JS/TS exposed to host scanners: {path}'
    subprocess.run(['git','-C',str(ROOT),'check-ignore','--no-index','-q',path],check=True)
print(f'Isolation verified: {len(changed)} changed paths, all inside sahm-workspace; existing tracked host tree unchanged.')
