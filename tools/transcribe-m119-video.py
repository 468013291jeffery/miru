import json,pathlib,subprocess,numpy as np
from faster_whisper import WhisperModel
ROOT=pathlib.Path(__file__).resolve().parent.parent;TASK=ROOT.parent
model=WhisperModel('tiny.en',device='cpu',compute_type='int8',download_root=str(TASK/'asr-models'))
audio=subprocess.check_output(['ffmpeg','-v','error','-i',str(ROOT/'video/m119-breakup-d37be3eb.mp4'),'-f','f32le','-ar','16000','-ac','1','pipe:1'],creationflags=subprocess.CREATE_NO_WINDOW)
segments,info=model.transcribe(np.frombuffer(audio,dtype=np.float32),beam_size=5,language='en',vad_filter=False)
rows=[dict(start=s.start,end=s.end,text=s.text.strip()) for s in segments]
(TASK/'video-review/transcript.json').write_text(json.dumps(rows,indent=2)+'\n','utf8')
print(json.dumps(rows),flush=True)
