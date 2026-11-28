from pathlib import Path
import sys, json, wave, hashlib, subprocess
sys.path[:0] = ['/Users/tiger/.cache/uv/archive-v0/1YD-5Z2uCXxvHi-1']
import numpy as np

ROOT = Path(__file__).resolve().parent
FF = '/private/tmp/alpha-video-tools/imageio_ffmpeg/binaries/ffmpeg-macos-aarch64-v9.0'
SR = 44100
OUT = ROOT / 'audio_production'
OUT.mkdir(exist_ok=True)

def write_audio(path, y):
    y = y - np.mean(y, axis=0)
    peak = np.max(np.abs(y))
    y *= 0.70 / max(peak, 1e-9)
    pcm = (np.clip(y, -1, 1) * 32767).astype('<i2')
    with wave.open(str(path), 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    return {'file': path.name, 'duration_seconds': round(len(y)/SR, 4),
            'sample_rate': SR, 'channels': 2, 'bits': 16,
            'peak_dbfs': round(float(20*np.log10(np.max(np.abs(y)))), 2),
            'rms_dbfs': round(float(20*np.log10(np.sqrt(np.mean(y*y)))), 2),
            'clipped_samples': int(np.count_nonzero(np.abs(y)>=1)),
            'sha256': hashlib.sha256(path.read_bytes()).hexdigest()}

def score(tonic, bpm, mode, seed):
    rng = np.random.default_rng(seed)
    beat = 60/bpm; dur = 24*4*beat
    y = np.zeros((round(dur*SR),2), np.float64)
    scale = [0,2,3,5,7,8,10] if mode != 'warm' else [0,2,4,5,7,9,11]
    chords = [[0,2,4], [5,0,2], [3,5,0], [4,6,1], [0,2,4], [3,5,0]]
    motif = [0,4,2,1, 3,2,4,1] if seed%2 else [4,2,1,0, 2,3,1,0]
    def note(midi, start, length, gain, kind, pan):
        a = round(start*SR); n = min(round(length*SR),len(y)-a)
        if n<=0: return
        t = np.arange(n)/SR; f = 440*2**((midi-69)/12)
        if kind == 'felt':
            env = (1-np.exp(-80*t))*np.exp(-t/1.7)*np.minimum((length-t)/.20,1).clip(0,1)
            z = (np.sin(2*np.pi*f*t)+.2*np.sin(2*np.pi*f*2.001*t)*np.exp(-2*t)+.06*np.sin(2*np.pi*f*3*t)*np.exp(-3*t))*env
        else:
            env = np.minimum(t/.65,1)*np.minimum((length-t)/.8,1).clip(0,1)
            z = (.65*np.sin(2*np.pi*f*t)+.23*np.sin(2*np.pi*f*1.002*t)+.06*np.sin(2*np.pi*f*2*t))*env
        y[a:a+n,0] += gain*z*np.sqrt((1-pan)/2)
        y[a:a+n,1] += gain*z*np.sqrt((1+pan)/2)
    for bar in range(24):
        start = bar*4*beat
        chord = chords[bar%6]
        dynamic = [.65,.8,1,.75][bar//6]
        for j,d in enumerate(chord):
            note(tonic+scale[d],start,4.4*beat,.065*dynamic,'pad',(j-1)*.6)
        note(tonic-12+scale[chord[0]],start,3.8*beat,.07*dynamic,'pad',0)
        for k in range(4):
            d = motif[(bar+k)%8]
            note(tonic+12+scale[d],start+(k+.03*rng.random())*beat,2.0*beat,.08*dynamic,'felt',(-1 if k%2 else 1)*.3)
        if mode=='tension':
            for k in [0,1.5,2.5]: note(tonic-12,start+k*beat,.6*beat,.045,'felt',0)
        if mode=='warm' and bar>=12:
            note(tonic+24+scale[chord[1]],start+2.5*beat,2*beat,.026,'felt',.45)
    for delay,gain in [(.113,.15),(.237,.09),(.389,.05)]:
        n=round(delay*SR); y[n:] += y[:-n,::-1]*gain
    # A whole musical phrase with quiet boundaries; player crossfades at repeat.
    t=np.arange(len(y))/SR
    y *= np.minimum(np.minimum(t/1.3,(dur-t)/1.8),1).clip(0,1)[:,None]
    return y

def effect(kind, seed):
    rng=np.random.default_rng(seed)
    dur=6 if kind=='rain_window' else 3 if kind=='bell' else 2.5 if kind=='record_noise' else 1.7
    t=np.arange(round(dur*SR))/SR; z=np.zeros(len(t))
    def hit(at, f, decay, gain=1):
        nonlocal z
        u=t-at; gate=(u>=0)
        z += gain*np.sin(2*np.pi*f*np.maximum(u,0))*np.exp(-np.maximum(u,0)/decay)*gate
    if kind=='bell' or kind=='door_chime':
        for f,g in [(523.25,1),(1047,.24),(1470,.13),(2180,.07)]:hit(0,f,1.1,g)
        if kind=='door_chime': hit(.22,659.25,.6,.6)
    elif kind=='rain_window':
        z=rng.normal(0,.13,len(t))
        z=np.convolve(z,np.ones(7)/7,mode='same')
        for _ in range(65):hit(float(rng.uniform(0,dur)),float(rng.uniform(1100,3600)),.012,.1)
    elif kind=='record_noise':
        z=rng.normal(0,.1,len(t))
        for at in [.18,.77,1.25,1.9]:hit(at,2000,.006,.8)
    elif kind=='paper_rustle':
        z=rng.normal(0,1,len(t))*(np.exp(-((t-.3)/.14)**2)+.7*np.exp(-((t-.8)/.20)**2))
        z-=np.convolve(z,np.ones(9)/9,mode='same')
    elif kind=='camera_shutter':
        z=rng.normal(0,1,len(t))*(np.exp(-np.maximum(t-.05,0)/.018)*(t>.05)+.6*np.exp(-np.maximum(t-.22,0)/.025)*(t>.22))
        hit(.05,180,.025,.8);hit(.22,260,.02,.7)
    else:
        for at in [.1,.28,.46]:
            hit(at,280 if kind=='ring_box' else 1800,.025,.6)
            hit(at,790 if kind=='ring_box' else 2700,.014,.3)
        z+=rng.normal(0,.12,len(t))*np.exp(-((t-.25)/.12)**2)
    fade=np.minimum(np.minimum(t/.01,(dur-t)/.15),1).clip(0,1)
    z*=fade
    return np.column_stack([z,.94*z])

params={
 'bgm_a_betrayal':(50,72,'dark'),'bgm_a_tension':(50,88,'tension'),'bgm_a_tenderness':(53,68,'warm'),
 'bgm_b_noir':(45,70,'dark'),'bgm_b_pursuit':(45,96,'tension'),'bgm_b_quiet':(48,66,'warm'),
 'bgm_c_gothic':(48,64,'dark'),'bgm_c_revelation':(48,84,'tension'),'bgm_c_morning':(55,72,'warm')}
records=[]
for si,story in enumerate(sorted((ROOT/'source').glob('[ABC]_*'))):
    folder=OUT/story.name;folder.mkdir(exist_ok=True)
    rows=json.loads((story/'production/asset_manifest.json').read_text())
    for ri,row in enumerate(rows):
        if row['kind'] not in ('bgm','sfx'):continue
        aid=row['id'];seed=si*100+ri
        y=score(*params[aid],seed) if aid in params else effect('_'.join(aid.split('_')[2:]),seed)
        p=folder/(aid+'.wav'); rec=write_audio(p,y)
        rec.update({'id':aid,'kind':row['kind'],'story':story.name,'provenance':'Original procedural composition/synthesis; build_audio.py',
                    'replaces_source_mockup':True,'listening_review':'pending',
                    'loop_crossfade_seconds':1.0 if row['kind']=='bgm' else 0})
        mp3=p.with_suffix('.mp3')
        subprocess.run([FF,'-hide_banner','-loglevel','error','-y','-i',str(p),'-codec:a','libmp3lame','-b:a','192k',str(mp3)],check=True)
        rec['runtime_mp3']=mp3.name;records.append(rec)
        print(aid,rec['duration_seconds'],flush=True)
(OUT/'audio_manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
