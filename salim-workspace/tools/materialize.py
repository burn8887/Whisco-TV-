#!/usr/bin/env python3
"""Materialize tracked Salim sources outside the host checkout without losing runtime edits."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

SOURCE = Path(__file__).resolve().parents[1]
HOST = SOURCE.parent
MARKER = '.salim-generated.json'
OWNER = 'salim-workspace-v1'
SKIP = {'node_modules', 'dist', 'build', '.gradle', 'DerivedData', '__pycache__', '.venv', '.git', 'xcuserdata', 'Salim.xcodeproj'}

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def collect(source):
    files = {}
    for path in source.rglob('*'):
        rel = path.relative_to(source)
        if any(part in SKIP for part in rel.parts):
            continue
        if path.is_symlink():
            raise ValueError(f'Source symlink blocked: {rel}')
        if not path.is_file():
            continue
        if path.name.endswith(('.tsbuildinfo', '.pyc', '.sqlite', '.sqlite-wal', '.sqlite-shm')):
            continue
        if (path.name.startswith('.env') and path.name != '.env.example') or path.name == 'local.properties':
            continue
        if path.suffix in {'.jks', '.keystore', '.p12', '.mobileprovision', '.pem'}:
            continue
        key = rel.as_posix()
        if key.endswith('.source'):
            key = key[:-7]
        if key in files:
            raise ValueError(f'Duplicate output: {key}')
        files[key] = path
    return files

def materialize(source, output, host):
    source, output, host = source.resolve(), output.resolve(), host.resolve()
    if output == host or host in output.parents or output in host.parents:
        raise ValueError('Runtime must be outside, and cannot contain, the host checkout.')
    marker = output / MARKER
    old = {}
    if output.exists() and any(output.iterdir()):
        if not marker.is_file():
            raise ValueError('Output contains unmanaged files. Choose an empty directory.')
        data = json.loads(marker.read_text())
        if data.get('owner') != OWNER:
            raise ValueError('Output belongs to another project.')
        old = data['files']
    files = collect(source)
    for key in set(files) | set(old):
        if Path(key).is_absolute() or '..' in Path(key).parts:
            raise ValueError(f'Unsafe manifest path: {key}')
        dest = output / key
        if dest.is_symlink() or any(p.is_symlink() for p in dest.parents):
            raise ValueError(f'Output symlink blocked: {key}')
        already_matches_source = key in files and dest.is_file() and digest(dest) == digest(files[key])
        if dest.exists() and not already_matches_source and (key not in old or digest(dest) != old[key]):
            raise ValueError(f'Edited or unmanaged runtime file: {key}. Recover the edit into tracked source first.')
    output.mkdir(parents=True, exist_ok=True)
    hashes = {}
    for key, path in files.items():
        dest = output / key
        dest.parent.mkdir(parents=True, exist_ok=True)
        with tempfile.NamedTemporaryFile(dir=dest.parent, delete=False) as temp:
            temp.write(path.read_bytes())
            temporary = Path(temp.name)
        shutil.copymode(path, temporary)
        os.replace(temporary, dest)
        hashes[key] = digest(dest)
    for key in set(old) - set(files):
        (output / key).unlink(missing_ok=True)
    marker.write_text(json.dumps({'owner': OWNER, 'source': str(source), 'files': hashes}, indent=2) + '\n')
    return len(files)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=Path('/home/user/Salim'))
    args = parser.parse_args()
    try:
        tracked = set(subprocess.check_output(['git', '-C', str(HOST), 'ls-files', '-z', '--', 'salim-workspace'], text=True).split('\0'))
        for file in collect(SOURCE).values():
            if file.relative_to(HOST).as_posix() not in tracked:
                raise ValueError(f'Source is not checkpointed in Git: {file.relative_to(HOST)}')
        print(f'Materialized {materialize(SOURCE, args.output, HOST)} source files into {args.output.resolve()}')
    except (ValueError, OSError, KeyError, json.JSONDecodeError) as error:
        parser.exit(1, f'Refusing to materialize: {error}\n')
