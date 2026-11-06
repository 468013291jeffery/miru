#!/usr/bin/env python3
"""Fingerprint release files, excluding generated public copies and dependencies."""
import hashlib,json,pathlib,sys
def snapshot(root):
    root=pathlib.Path(root).resolve(); result={}
    for p in sorted(root.rglob('*')):
        rel=p.relative_to(root)
        if rel.parts[0] in ('public','node_modules','.git') or any(x.startswith('.miru-') for x in rel.parts):continue
        if p.is_symlink() or not p.is_file():continue
        result[str(rel)]=hashlib.sha256(p.read_bytes()).hexdigest()
    return result
if __name__=='__main__':
    mode,root=sys.argv[1:3]; got=snapshot(root)
    if mode=='snapshot':print(json.dumps(got,sort_keys=True));sys.exit(0)
    expected=json.loads(pathlib.Path(sys.argv[3]).read_text())
    changed=[k for k in sorted(set(expected)|set(got)) if expected.get(k)!=got.get(k)]
    if changed:
        print('Production files changed outside deployment; merge before publishing: '+', '.join(changed[:20]),file=sys.stderr);sys.exit(73)
