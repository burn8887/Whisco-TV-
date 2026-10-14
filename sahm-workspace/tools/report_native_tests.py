#!/usr/bin/env python3
"""Expose existing JUnit results through Actions notices; never substitute for a test run."""
import json
import os
from pathlib import Path
import sys
import xml.etree.ElementTree as ET

root=Path(sys.argv[1])
files=sorted((root/'core/build/test-results/test').glob('TEST-*.xml'))+sorted((root/'app/build/outputs/androidTest-results').rglob('TEST-*.xml'))
summary={'files':len(files),'tests':0,'failed':0,'skipped':0}
failures=[]
for path in files:
    for case in ET.parse(path).getroot().iter('testcase'):
        summary['tests']+=1
        if case.find('skipped') is not None:summary['skipped']+=1
        for tag in ('failure','error'):
            for error in case.findall(tag):
                summary['failed']+=1
                failures.append(f"{case.get('classname')}.{case.get('name')}: {error.get('message','')} {(error.text or '')[:3000]}")
summary['status']='not-run' if not files else 'failed' if failures else 'passed'
text=json.dumps(summary)
print('::notice title=Sahm JUnit evidence::'+text)
for failure in failures:
    print('::error title=Sahm test failure::'+failure.replace('%','%25').replace('\r','%0D').replace('\n','%0A'))
if os.environ.get('GITHUB_STEP_SUMMARY'):
    with open(os.environ['GITHUB_STEP_SUMMARY'],'a') as f:f.write('\n### Sahm native JUnit results\n```json\n'+text+'\n```\n')
(root/'native-test-summary.json').write_text(json.dumps(summary,indent=2)+'\n')
