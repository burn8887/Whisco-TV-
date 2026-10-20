#!/usr/bin/env python3
"""Verify 64-bit ELF load alignment inside an APK; zipalign separately checks ZIP offsets."""
import argparse
import json
from pathlib import Path
import struct
import zipfile

def load_alignments(data):
    if len(data)<64 or data[:6]!=b'\x7fELF\x02\x01':
        raise ValueError('Expected a complete little-endian 64-bit ELF header')
    offset=struct.unpack_from('<Q',data,32)[0]
    stride,count=struct.unpack_from('<HH',data,54)
    if stride<56 or count==0 or offset+stride*count>len(data):
        raise ValueError('Invalid ELF program header table')
    values=[]
    for i in range(count):
        at=offset+i*stride
        if struct.unpack_from('<I',data,at)[0]==1:
            values.append(struct.unpack_from('<Q',data,at+48)[0])
    if not values:raise ValueError('ELF has no LOAD segments')
    if any(v<16384 or v & (v-1) for v in values):
        raise ValueError(f'LOAD segments require power-of-two alignment >= 16 KB, found {values}')
    return values

def inspect(path):
    results={}
    with zipfile.ZipFile(path) as apk:
        for name in apk.namelist():
            if name.startswith(('lib/arm64-v8a/','lib/x86_64/')) and name.endswith('.so'):
                try:results[name]=load_alignments(apk.read(name))
                except ValueError as error:raise ValueError(f'{name}: {error}') from error
    return results

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('apk',type=Path)
    args=parser.parse_args()
    try:print('::notice title=Salim 16 KB ELF alignment::'+json.dumps(inspect(args.apk)))
    except (ValueError,OSError,zipfile.BadZipFile) as error:
        print('::error title=Salim native library alignment::'+str(error).replace('%','%25').replace('\n','%0A'))
        raise SystemExit(1)
