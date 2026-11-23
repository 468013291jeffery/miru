"""Original procedural New York suspense score and foley for M119. No sampled recordings."""
import json, pathlib, subprocess, wave, hashlib, shutil
import numpy as np
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'art/official/m119-breakup-v2/audio'
OUT.mkdir(parents=True,exist_ok=True)
SR=44100
rng=np.random.default_rng(119153)
ffmpeg=shutil.which('ffmpeg')
assert ffmpeg
def freq(n):return 440*2**((n-69)/12)
def pluck(n,dur,kind='harp'):
 t=np.arange(int(dur*SR))/SR;f=freq(n);y=np.zeros(len(t))
 for h in range(1,9):
  decay=(1.7 if kind=='harp' else .8)/(h**.44)
  y+=np.sin(2*np.pi*f*h*(1+.00013*h*h)*t)*np.exp(-t/decay)/(h**(1.7 if kind=='harp' else 2.1))
 return y*(1-np.exp(-t/.006))*np.minimum(1,np.maximum(0,(dur-t)/.09))
def bow(n,dur):
 t=np.arange(int(dur*SR))/SR;f=freq(n)
 y=sum(np.sin(2*np.pi*f*(1+det)*t+.08*np.sin(2*np.pi*(4.7+det)*t))/(i+1) for i,det in enumerate([-.0022,.0015,.0031]))
 env=np.minimum(1,t/.7)*np.minimum(1,(dur-t)/.9)
 return y*env*.25
def add(buf,y,start,level,pan=.5):
 k=int(start*SR);ix=(np.arange(len(y))+k)%len(buf)
 buf[ix,0]+=y*level*np.cos(pan*np.pi/2);buf[ix,1]+=y*level*np.sin(pan*np.pi/2)
def room(buf):
 wet=buf.copy()
 for seconds,level in [(.073,.12),(.137,.09),(.239,.075),(.419,.05),(.683,.025)]:wet+=np.roll(buf,int(seconds*SR),axis=0)[:,::-1]*level
 return wet
manifest={'version':1,'rights':'Original procedural composition and synthesized foley; no third-party samples.','music':[],'sfx':[]}
def save(name,buf,group,extra):
 if buf.ndim==1:buf=np.stack([buf,buf],axis=1)
 buf=room(buf);peak=float(np.max(np.abs(buf)));buf*=.78/max(peak,.001)
 wav=OUT/(name+'.wav')
 with wave.open(str(wav),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((buf*32767).astype('<i2').tobytes())
 target=OUT/(name+'.ogg')
 subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-i',str(wav),'-c:a','libvorbis','-q:a','5',str(target)],check=True)
 wav.unlink()
 entry={'id':name,'file':name+'.ogg','seconds':round(len(buf)/SR,3),'channels':2,'sampleRate':SR,'peak':round(float(np.max(np.abs(buf))),5),'rms':round(float(np.sqrt(np.mean(buf**2))),5),'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),**extra}
 manifest[group].append(entry);print(name,entry['seconds'],flush=True)

import re
source=(ROOT/'content/official/m119-breakup-v2/source/assets/16首原创BGM_中英提示词.md').read_text(encoding='utf8')
titles=re.findall(r'^## (BGM_\d+)｜(.+?) ·',source,re.M)
assert len(titles)==16
for number,(id,title) in enumerate(titles):
 bpm=[76,80,72,78,82,84,74,77,75,79,73,83,81,78,80,84][number]
 beat=60/bpm;bar=beat*4;bars=32;buf=np.zeros((int(bars*bar*SR),2),dtype=np.float64)
 root=[45,48,43,47,42,50,44,46,41,49,40,48,45,43,47,48][number]
 major=number in [7,11,15]
 intervals=[0,4 if major else 3,7,11 if major else 10]
 roots=[root,root-5,root-3 if major else root+3,root-2]
 motif=[12,14,15 if not major else 16,19,17,15 if not major else 16,14,12]
 for b in range(bars):
  chord=[roots[b%4]+x for x in intervals];at=b*bar
  for j,note in enumerate(chord):add(buf,bow(note,bar+1),at,.07,.2+j*.18)
  add(buf,pluck(chord[0]-12,bar+.8,'piano'),at,.16,.5)
  for k in range(4):add(buf,pluck(chord[k%4]+12,2.7,'piano'),at+k*beat,.09,.25+(k%3)*.2)
  if b%8>=2:
   for k in [0,2]:add(buf,pluck(roots[b%4]+motif[(b+k+number)%8],2.2,'piano'),at+k*beat,.08,.6)
  if number in [1,4,8,9,12,13,14]:
   for k in [0,2]:
    tt=np.arange(int(.18*SR))/SR;pulse=np.sin(2*np.pi*53*tt)*np.exp(-tt*28)
    add(buf,pulse,at+k*beat,.045,.5)
 save(id,buf,'music',{'title':title,'bpm':bpm,'bars':bars,'loop':True,'instruments':['additive felt piano','bowed cello and strings','soft analog pulse'],'production':'original procedural synthesis, no third-party samples'})
D=json.loads((ROOT/'content/official/m119-breakup-v2/data.json').read_text(encoding='utf8'))
for i,scene in enumerate(D['nodes']['nodes']):
 dur=4.2;tt=np.arange(int(dur*SR))/SR
 noise=rng.normal(size=len(tt));roomtone=np.convolve(noise,np.ones(150)/150,'same')*.18
 paper=rng.normal(size=len(tt));paper=paper-np.convolve(paper,np.ones(22)/22,'same')
 envelope=np.exp(-((tt-.9)/.25)**2)+.6*np.exp(-((tt-2.1)/.19)**2)
 y=roomtone+paper*envelope*.12
 if any(w in scene['narrative_segments']['entry'] for w in ['门','走','站','转身']):
  for k in [0,1]:
   t=np.arange(int(.22*SR))/SR;tap=np.sin(t*2*np.pi*(82+i%7))*np.exp(-t*30)*.14
   p=int((.3+k*.55)*SR);y[p:p+len(tap)]+=tap
 if any(w in scene['narrative_segments']['entry']+scene['location'] for w in ['雨','门外','街']):y+=np.convolve(noise,np.ones(10)/10,'same')*.11
 save('SFX_'+scene['node_id'],y,'sfx',{'title':scene['title'],'synthesized':True,'loop':False,'components':['paper handling','room tone','contextual footsteps or rain']})
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
