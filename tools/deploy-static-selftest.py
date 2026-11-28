from pathlib import Path
import tempfile,subprocess
source=(Path(__file__).resolve().parents[1]/'ops/ovh-deploy-safe.sh').read_text()
start=source.index('for f in "$NEW"/app.*.js')
end=source.index('for d in art audio video scripts icons stories; do',start)
with tempfile.TemporaryDirectory() as temp:
 p=Path(temp);new=p/'new';public=new/'public';public.mkdir(parents=True)
 for name in ['app.a123.js','app.b456.js','opencc-cn2t.js']:(new/name).write_text(name)
 subprocess.run(['bash','-c','NEW="$1"; P="$1/public"; '+source[start:end],'test',str(new)],check=True)
 for name in ['app.a123.js','app.b456.js','opencc-cn2t.js']:assert (public/name).read_bytes()==(new/name).read_bytes()
 print('Deployment static assets: current/retained main bundles and Traditional Chinese dictionary copied intact.')
