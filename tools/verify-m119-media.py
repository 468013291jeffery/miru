"""Decode every release asset and verify its actual bytes against manifests."""
import concurrent.futures,datetime,hashlib,json,pathlib,subprocess
from PIL import Image
ROOT=pathlib.Path(__file__).resolve().parent.parent;DIR=ROOT/'content/official/m119-breakup-v2'
def read(p):return json.loads((ROOT/p).read_text('utf8'))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
images=read('art/official/m119-breakup-v2/images/manifest.json');voices=read('art/official/m119-breakup-v2/voice/manifest.json');audio=read('art/official/m119-breakup-v2/audio/manifest.json');video=read('content/official/m119-breakup-v2/video.json')
assert len(images)==76 and len(voices['clips'])==384 and not voices['errors']
assert len(audio['music'])==16 and len(audio['sfx'])==64
assert all(x['review']=='reviewed' for x in images)
files=[];decode=[]
for x in images:
 p=ROOT/x['file'];assert sha(p)==x['sha256'],p
 with Image.open(p) as im:im.load();assert im.width==x['width'] and im.height==x['height'];assert abs(im.width/im.height-9/16)<.005
 files.append(dict(file=x['file'],sha256=x['sha256'],bytes=p.stat().st_size))
for folder,items in [('voice',voices['clips']),('audio',audio['music']+audio['sfx'])]:
 for x in items:
  rel='art/official/m119-breakup-v2/'+folder+'/'+x['file'];p=ROOT/rel;assert sha(p)==x['sha256'],rel
  assert x['seconds']>.3
  decode.append(p);files.append(dict(file=rel,sha256=x['sha256'],bytes=p.stat().st_size))
for key in ('original','chinese'):
 rel=video[key];p=ROOT/rel;assert sha(p)==video[key+'_sha256'];decode.append(p);files.append(dict(file=rel,sha256=sha(p),bytes=p.stat().st_size))
assert len(files)==542 and len(set(x['file'] for x in files))==542
def check(p):
 r=subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','null','-'],capture_output=True,creationflags=subprocess.CREATE_NO_WINDOW)
 if r.returncode or r.stderr.strip():raise ValueError(str(p)+': '+r.stderr.decode('utf8','replace')[:300])
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:list(pool.map(check,decode))
streams=[]
for key in ('original','chinese'):
 streams.append(subprocess.check_output(['ffmpeg','-v','error','-i',str(ROOT/video[key]),'-map','0:v:0','-c','copy','-f','hash','-hash','sha256','-'],creationflags=subprocess.CREATE_NO_WINDOW).decode().strip())
assert streams[0]==streams[1],'Chinese trailer changed the original picture stream'
(DIR/'release-assets.json').write_text(json.dumps(files,indent=2)+'\n','utf8')
result=dict(at=datetime.datetime.now(datetime.timezone.utc).isoformat(),images=76,voice_clips=384,music=16,sfx=64,videos=2,total=542,bytes=sum(x['bytes'] for x in files),all_hashes_match=True,all_images_decoded=True,all_audio_video_decoded=True,original_video_unchanged=True,chinese_video_picture_unchanged=True)
(DIR/'media-validation.json').write_text(json.dumps(result,indent=2)+'\n','utf8')
print(json.dumps(result),flush=True)
