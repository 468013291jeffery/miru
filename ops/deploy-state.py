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
def reconcile(target, current, reviewed):
    target,current=map(pathlib.Path,(target,current))
    recorded=json.loads((current/'.miru-files.json').read_text())
    changed=[k for k in sorted(set(recorded)|set(reviewed)) if recorded.get(k)!=reviewed.get(k)]
    for rel in changed:
        p=pathlib.PurePosixPath(rel)
        if p.is_absolute() or '..' in p.parts:raise ValueError('Unsafe snapshot path: '+rel)
        if rel in ('index.html','source/all.js'):continue # rebuilt from merged source
        f=target/rel
        digest=hashlib.sha256(f.read_bytes()).hexdigest() if f.is_file() else None
        if digest!=reviewed.get(rel):raise ValueError('Uncommitted production change is missing from target commit: '+rel)
    return changed
if __name__=='__main__':
    mode,root=sys.argv[1:3]
    if mode=='reconcile':
        try:print('Reviewed production changes preserved in target commit: '+', '.join(reconcile(root,sys.argv[3],json.loads(pathlib.Path(sys.argv[4]).read_text()))))
        except ValueError as e:print(str(e),file=sys.stderr);sys.exit(73)
        sys.exit(0)
    if mode not in ('snapshot','verify'):raise SystemExit('Unknown mode')
    got=snapshot(root)
    if mode=='snapshot':print(json.dumps(got,sort_keys=True));sys.exit(0)
    expected=json.loads(pathlib.Path(sys.argv[3]).read_text())
    changed=[k for k in sorted(set(expected)|set(got)) if expected.get(k)!=got.get(k)]
    if changed:
        print('Production files changed outside deployment; merge before publishing: '+', '.join(changed[:20]),file=sys.stderr);sys.exit(73)
