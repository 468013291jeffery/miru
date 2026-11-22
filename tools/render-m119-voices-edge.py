"""Pre-record bilingual adult character lines using available Edge neural voices.
No API credentials; hashes and actual provider names accompany every recording.
"""
import asyncio, hashlib, json, os, pathlib, subprocess
import edge_tts
ROOT=pathlib.Path(__file__).resolve().parent.parent
D=json.loads((ROOT/'content/official/m119-breakup-v2/data.json').read_text('utf8'))
L=json.loads((ROOT/'content/official/m119-breakup-v2/locales.json').read_text('utf8'))
OUT=ROOT/'art/official/m119-breakup-v2/voice';OUT.mkdir(parents=True,exist_ok=True)
VOICES={
 'Gabriel':('zh-CN-YunxiNeural','en-US-GuyNeural'),
 'Theo':('zh-CN-YunjianNeural','en-US-AndrewNeural'),
 'Vivian':('zh-CN-XiaoxiaoNeural','en-US-AriaNeural'),
 'Olivia':('zh-CN-XiaoyiNeural','en-US-JennyNeural'),
 'Lena':('zh-CN-liaoning-XiaobeiNeural','en-US-MichelleNeural'),
 'Mara':('zh-CN-XiaoxiaoNeural','en-GB-SoniaNeural'),
 'Jonas':('zh-CN-YunjianNeural','en-US-EricNeural'),
 'Harper':('zh-CN-XiaoyiNeural','en-US-AriaNeural'),
 'Kira':('zh-CN-XiaoyiNeural','en-US-JennyNeural'),
 'Casey':('zh-CN-YunxiNeural','en-US-ChristopherNeural'),
 'Martin':('zh-CN-YunjianNeural','en-GB-RyanNeural')}
jobs={}
for n in D['nodes']['nodes']:
 for line in n['dialogue']:
  for ix,lang in enumerate(('zh','en')):
   actor=line['speaker'];text=L['voices'][line['en']] if lang=='zh' else line['en']
   id=hashlib.sha256((lang+'|'+actor+'|'+text).encode()).hexdigest()[:24]
   jobs[id]=dict(id=id,lang=lang,actor=actor,text=text,voice=D['cast'][actor]['voice'],providerVoice=VOICES[actor][ix],file=lang+'-'+id+'.mp3')
manifest=dict(version=2,provider='Microsoft Edge neural speech',languages=['zh','en'],clips=[],errors=[])
def write():
 (OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n','utf8')
async def main():
 sem=asyncio.Semaphore(3)
 async def render(j):
  async with sem:
   file=OUT/j['file']
   try:
    if not file.exists():
     error=None
     for attempt in range(3):
      try:
       await asyncio.wait_for(edge_tts.Communicate(j['text'],j['providerVoice'],rate='-4%').save(str(file)+'.source'),50)
       subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(file)+'.source','-af','loudnorm=I=-18:TP=-2:LRA=8','-ar','44100','-ac','1','-b:a','96k',str(file)],check=True,creationflags=subprocess.CREATE_NO_WINDOW)
       os.unlink(str(file)+'.source');error=None;break
      except Exception as e:error=e;await asyncio.sleep(2*(attempt+1))
     if error:raise error
    b=file.read_bytes()
    seconds=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(file)],creationflags=subprocess.CREATE_NO_WINDOW))
    if len(b)<2000 or seconds<.3:raise ValueError('Empty voice recording')
    manifest['clips'].append(dict(**j,bytes=len(b),seconds=seconds,sha256=hashlib.sha256(b).hexdigest()))
    if len(manifest['clips'])%20==0:print(str(len(manifest['clips']))+'/'+str(len(jobs))+' recordings ready',flush=True)
   except Exception as e:manifest['errors'].append(dict(id=j['id'],actor=j['actor'],error=str(e)))
   write()
 await asyncio.gather(*(render(j) for j in jobs.values()))
 print(json.dumps(dict(expected=len(jobs),ready=len(manifest['clips']),errors=manifest['errors'])),flush=True)
 if manifest['errors']:raise RuntimeError('Incomplete voice production')
asyncio.run(main())
