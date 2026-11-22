import asyncio,hashlib,json,pathlib,subprocess
import edge_tts
ROOT=pathlib.Path(__file__).resolve().parent.parent;TASK=ROOT.parent;OUT=TASK/'video-review'
lines=[('一百万美元，帮我结束婚姻。',.12,3.7),('你的前未婚夫，我的丈夫。他以为你死了。',4.52,5.25)]
def run(args):return subprocess.check_output(args,creationflags=subprocess.CREATE_NO_WINDOW)
async def main():
 for i,(text,start,window) in enumerate(lines):
  file=OUT/('trailer-zh-'+str(i)+'.mp3')
  if not file.exists():await edge_tts.Communicate(text,'zh-CN-XiaoxiaoNeural',rate='+5%').save(str(file))
 durations=[float(run(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(OUT/('trailer-zh-'+str(i)+'.mp3'))])) for i in range(2)]
 dest=ROOT/'video/m119-breakup-d37be3eb-zh.mp4'
 filters=[]
 for i,(_,start,window) in enumerate(lines):filters.append('['+str(i+1)+':a]atempo='+str(max(1,durations[i]/window))+',loudnorm=I=-17:TP=-2:LRA=7,adelay='+str(round(start*1000))+':all=1[v'+str(i)+']')
 filters+=['[3:a]atrim=duration=10,volume=0.10[bg]','[4:a]aloop=loop=-1:size=185220,atrim=duration=10,volume=0.08[room]','[v0][v1][bg][room]amix=inputs=4:duration=longest:normalize=0,alimiter=limit=0.90[a]']
 run(['ffmpeg','-v','error','-y','-i',str(ROOT/'video/m119-breakup-d37be3eb.mp4'),'-i',str(OUT/'trailer-zh-0.mp3'),'-i',str(OUT/'trailer-zh-1.mp3'),'-i',str(ROOT/'art/official/m119-breakup-v2/audio/BGM_01.ogg'),'-i',str(ROOT/'art/official/m119-breakup-v2/audio/SFX_CH01_S01.ogg'),'-filter_complex',';'.join(filters),'-map','0:v:0','-map','[a]','-c:v','copy','-c:a','aac','-b:a','160k','-t','10','-movflags','+faststart',str(dest)])
 meta=dict(original='video/m119-breakup-d37be3eb.mp4',chinese='video/'+dest.name,original_sha256=hashlib.sha256((ROOT/'video/m119-breakup-d37be3eb.mp4').read_bytes()).hexdigest(),chinese_sha256=hashlib.sha256(dest.read_bytes()).hexdigest(),seconds=10,chinese_voice='zh-CN-XiaoxiaoNeural',picture='original video stream copied unchanged',transcript_basis='Local Whisper transcription; first clause normalized from “and my marriage” to the contextually intended “end my marriage”.',chinese_dialogue=[t[0] for t in lines])
 (ROOT/'content/official/m119-breakup-v2/video.json').write_text(json.dumps(meta,ensure_ascii=False,indent=2)+'\n','utf8')
 print(json.dumps(meta,ensure_ascii=False),flush=True)
asyncio.run(main())
