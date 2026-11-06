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
 (cur/'.miru-files.json').write_text(json.dumps(state.snapshot(cur)))
 with open(app/'shared/deploy.lock','w') as lock:
  fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
  assert run()==75,'Concurrent deployment was accepted'
 assert (app/'current').resolve()==cur,'A preflight test changed production pointer'
print('Deployment guards: stale baseline, explicit adoption, file drift and concurrency passed.')
