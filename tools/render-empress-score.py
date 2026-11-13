"""Original procedural chamber score and foley for Empress. No sampled recordings."""
import json, pathlib, subprocess, wave, hashlib, shutil
import numpy as np
ROOT=pathlib.Path(__file__).resolve().parents[1]
OUT=ROOT/'art/official/m110-empress/audio'
OUT.mkdir(parents=True,exist_ok=True)
SR=44100
rng=np.random.default_rng(110147)
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
tracks=[
 ('BGM-01','Royal Velvet',76,[[50,54,57,61],[47,50,54,57],[43,47,50,54],[45,49,52,57]],[7,9,11,14,11,9,7,4],'harp'),
 ('BGM-02','Jealous Hearts',104,[[48,52,55,59],[45,48,52,55],[41,45,48,52],[43,47,50,55]],[12,7,9,4,7,2,4,7],'celesta'),
 ('BGM-03','Midnight Invitation',60,[[52,56,59,63],[49,52,56,59],[45,49,52,56],[47,51,54,59]],[7,11,14,11,9,7,4,2],'harp'),
 ('BGM-04','Rose Garden Mist',68,[[50,53,57,60],[46,50,53,57],[48,52,55,60],[45,49,52,57]],[12,14,15,19,17,15,14,12],'celesta'),
 ('BGM-05','Banquet of Twenty',116,[[50,54,57,62],[43,47,50,55],[45,49,52,57],[50,54,57,61]],[12,16,19,16,14,17,21,19],'harp'),
 ('BGM-06','Crown Below',56,[[38,45,50,53],[37,44,49,52],[34,41,46,50],[33,40,45,49]],[12,13,19,18,12,10,13,12],'celesta'),
 ('BGM-07','Seventh Night',96,[[38,45,50,53],[34,41,46,50],[36,43,48,51],[33,40,45,49]],[12,19,24,19,22,19,17,15],'harp'),
 ('BGM-08','Golden Morning',82,[[48,52,55,60],[43,47,50,55],[45,48,52,57],[41,45,48,53]],[12,16,19,21,19,16,14,12],'harp')]
for number,(id,title,bpm,chords,motif,kind) in enumerate(tracks):
 beat=60/bpm;bar=beat*(3 if number==4 else 4);bars=16;buf=np.zeros((int(bars*bar*SR),2),dtype=np.float64)
 for b in range(bars):
  chord=chords[b%4];t=b*bar
  for j,n in enumerate(chord):add(buf,bow(n,bar+1.5),t,.11, .2+j*.18)
  add(buf,pluck(chord[0]-12,bar+.8),t,.23,.5)
  for k in range(6 if number==4 else 8):
   add(buf,pluck(chord[k%len(chord)]+12,2.1,kind),t+k*bar/(6 if number==4 else 8),.095,.25+(k%3)*.25)
  if b>=4:
   for k in range(4):
    n=chord[0]+motif[(b*4+k)%8];add(buf,pluck(n,1.8,kind),t+k*bar/4,.11 if number!=5 else .065,.58)
  if number in [1,4,6]:
   for k in range(3 if number==4 else 4):
    tt=np.arange(int(.2*SR))/SR;y=(np.sin(2*np.pi*(65*tt+35*.07*(1-np.exp(-tt/.07))))+.2*rng.normal(size=len(tt)))*np.exp(-tt*35)
    add(buf,y,t+k*beat,.075 if number!=6 else .15,.5)
 save(id,buf,'music',{'title':title,'bpm':bpm,'bars':bars,'loop':True,'instruments':['additive harp/celesta','bowed ensemble','bass','room reverb']})
def noise(d,decay=2):
 t=np.arange(int(d*SR))/SR;n=rng.normal(size=len(t));return t,n*np.exp(-t*decay)*np.minimum(t/.006,1)
for i,id in enumerate(['grape_plate','tea_cup','silk','boots','banquet_laughter','door','jade_tokens','harp','dragonfire','glass_break','crown_heartbeat','storm','teleport']):
 dur=[.65,1.1,1.2,2.3,2.8,1.5,1.2,2.8,3.4,1.8,3.2,4,2.6][i];t,n=noise(dur,2);y=np.zeros(len(t))
 if id in ['tea_cup','jade_tokens','glass_break','grape_plate']:
  for k,f in enumerate([1312,2181,3379,4673,5903] if id!='grape_plate' else [391,523,817]):y+=np.sin(2*np.pi*f*t)*np.exp(-t*(5+k*4))*.2
  if id=='glass_break':y+=n*.5
 elif id=='harp':
  for k,note in enumerate([60,64,67,72]):
   a=pluck(note,1.8);start=int(k*.15*SR);end=min(len(y),start+len(a));y[start:end]+=a[:end-start]*.3
 elif id=='boots':
  for k in range(4):
   tt=np.arange(int(.23*SR))/SR;a=(np.sin(2*np.pi*88*tt)*.5+rng.normal(size=len(tt))*.13)*np.exp(-tt*26);p=int(k*.5*SR);y[p:p+len(a)]+=a
 elif id=='crown_heartbeat':
  for k in range(3):
   for dt,v in [(0,.8),(.19,.5)]:
    tt=np.arange(int(.25*SR))/SR;a=np.sin(2*np.pi*(48*tt+2*np.sin(tt*7)))*np.exp(-tt*23)*v;p=int((k+dt)*SR);y[p:p+len(a)]+=a
 elif id=='silk':y=np.convolve(n,np.ones(35)/35,'same')*(.6+.4*np.sin(t*12))
 elif id=='door':y=np.sin(2*np.pi*(110*t+7*np.sin(t*3)))*np.exp(-t*2)*.4+np.convolve(n,np.ones(45)/45,'same')
 elif id in ['dragonfire','storm']:y=np.convolve(n,np.ones(140 if id=='storm' else 40)/(140 if id=='storm' else 40),'same')*2+np.sin(t*2*np.pi*36)*np.exp(-t)*.3
 elif id=='teleport':y=(np.sin(2*np.pi*(180*t+250*t*t))+np.sin(2*np.pi*(311*t+120*t*t)))*np.sin(np.pi*t/dur)**2*.3
 elif id=='banquet_laughter':
  # Wordless, synthesized crowd murmur; no recognizable human recording or spoken words.
  for f in [104,137,181,219,262]:y+=np.sin(2*np.pi*f*t+np.sin(t*6))*(np.sin(t*(3+f/90))**4)*.06
  y+=np.convolve(n,np.ones(30)/30,'same')*.2
 save('SFX-'+id,y,'sfx',{'synthesized':True,'loop':False})
(OUT/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
