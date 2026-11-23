import pathlib,tempfile,subprocess,os,json,importlib.util,fcntl
root=pathlib.Path(__file__).resolve().parents[1];script=root/'ops/ovh-deploy-safe.sh'
spec=importlib.util.spec_from_file_location('state',root/'ops/deploy-state.py');state=importlib.util.module_from_spec(spec);spec.loader.exec_module(state)
with tempfile.TemporaryDirectory() as td:
 app=pathlib.Path(td);cur=app/'releases/old';cur.mkdir(parents=True);(app/'shared').mkdir();(app/'current').symlink_to(cur)
 (cur/'index.html').write_text('current version')
 env=dict(os.environ,MIRU_DEPLOY_APP=str(app))
 def run(*args):return subprocess.run(['bash',str(script),'--check-only',*args],env=env,capture_output=True,text=True).returncode
 assert run('--expected-current',str(app/'releases/stale'))==73,'Stale current pointer was accepted'
 assert run()==73,'Untracked baseline accepted without adoption'
 assert run('--adopt-current')==0,'Explicit baseline adoption failed'
 (cur/'.miru-files.json').write_text(json.dumps(state.snapshot(cur)))
 assert run()==0
 (cur/'index.html').write_text('uncommitted production patch')
 assert run()==73,'Manual production drift was silently overwritten'
 reviewed=state.snapshot(cur);review_file=app/'review.json';review_file.write_text(json.dumps(reviewed))
 assert run('--expected-current',str(cur),'--reconcile-current',str(review_file))==64,'Check-only reconciliation was accepted'
 target=app/'target';target.mkdir();(target/'index.html').write_text('rebuilt index')
 assert state.reconcile(target,cur,reviewed)==['index.html']
 (cur/'scene.js').write_text('other contributor source');reviewed=state.snapshot(cur)
 try:state.reconcile(target,cur,reviewed);raise AssertionError('Missing source change accepted')
 except ValueError:pass
 (target/'scene.js').write_text('other contributor source');assert 'scene.js' in state.reconcile(target,cur,reviewed)
 (target/'scene.js').write_text('older source')
 try:state.reconcile(target,cur,reviewed);raise AssertionError('Overwritten source change accepted')
 except ValueError:pass
 (cur/'.miru-files.json').write_text(json.dumps(state.snapshot(cur)))
 with open(app/'shared/deploy.lock','w') as lock:
  fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
  assert run()==75,'Concurrent deployment was accepted'
 assert (app/'current').resolve()==cur,'A preflight test changed production pointer'
print('Deployment guards: stale baseline, explicit adoption, file drift and concurrency passed.')

# Execute the production retention loop against isolated media directories.
with tempfile.TemporaryDirectory() as td:
 old=pathlib.Path(td)/'old';new=pathlib.Path(td)/'new'
 (old/'art').mkdir(parents=True);(new/'art').mkdir(parents=True)
 (old/'art/retained.jpg').write_bytes(b'immutable media')
 (old/'art/replaced.jpg').write_bytes(b'old media')
 (new/'art/replaced.jpg').write_bytes(b'new media')
 text=script.read_text();start=text.index('for d in art audio video scripts; do');end=text.index('\ndone',start)+len('\ndone')
 subprocess.run(['bash','-eu','-c',text[start:end]],env=dict(os.environ,CUR=str(old),NEW=str(new)),check=True)
 assert (new/'art/replaced.jpg').read_bytes()==b'new media','New repository media was overwritten'
 assert (old/'art/replaced.jpg').read_bytes()==b'old media','Previous release media was modified'
 assert (new/'art/retained.jpg').stat().st_ino==(old/'art/retained.jpg').stat().st_ino,'Unchanged media was duplicated on disk'
print('Retained media: shared immutable bytes, fresh media preserved, previous release unchanged.')
