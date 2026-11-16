# -*- coding: utf-8 -*-
from pathlib import Path
import re,json,csv,hashlib
from urllib.parse import quote
R=Path(__file__).resolve().parents[1];D=R/'content/official/only-me-v2';A=R/'art/official/only-me-v2';S=R/'scripts/only-me-v2';rel=json.loads((D/'release.json').read_text());raw=(S/'ONLY_ME_EU_只准看我_逐字剧本_播放器版.md').read_text();s=raw.replace('\\_','_').replace('**','');profiles=(S/'ONLY_ME_EU_角色卡_详细版.md').read_text().replace('\\_','_').replace('**','');s='# CHAPTER 1'+s.split('# CHAPTER 1',1)[1]
bi=lambda x:{'zh':x,'en':x}
info=[('me','你',27,'f','雷恩·卡洛威，播客《The Slow Hour》主理人','neutral'),('elias','伊莱亚斯',36,'m','建筑师，雷恩街11号三楼住户','neutral'),('jude','裘德',25,'m','The Undertow乐队主唱与修车技工，阁楼住户','quiet'),('silas','赛拉斯',34,'m','急诊科医生，半地下住户','calm')];cast=[]
for i,(key,name,age,g,role,state) in enumerate(info):
 if i:bio=profiles.split(['## 第一节','## 第二节','## 第三节'][i-1],1)[1].split('## 第',1)[0];public='\n'.join(re.search(r'### '+section+r'[^\n]*\n(.*?)(?=\n### |$)',bio,re.S)[1] for section in ['03','04','05','06','07']);public='\n'.join(l for l in public.splitlines() if not any(k in l for k in ['签错','阅读障碍','读长句会卡','最不想被人发现']));public=re.sub(r'^###.*$|^\|.*$|\n---','',public,flags=re.M).strip()
 else:public='Wren Calloway，27岁，深夜播客《The Slow Hour》主理人。继承母亲留下的雷恩街11号旧楼，需要了解信托附加条款、处理共同居住与修缮，并调查母亲火灾旧事；姓名外貌可自定义。'
 cast.append(dict(key=key,name=name,age=age,gender=g,lead=bool(i),role=role,bio=public[:2200],art='/art/official/only-me-v2/characters/char_'+key+'__'+state+'.png'))
background=[
'你是雷恩·卡洛威（Wren Calloway），27岁，深夜朗读播客《The Slow Hour》的主理人。四万名订阅者熟悉你的声音，却未必知道你自己的生活。母亲玛戈在十年前的一场火灾中去世，如今她留下的房产和文件让你重新回到罗得岛州普罗维登斯。你可以使用自己的姓名与外貌进入故事，但播客主理人、继承人和调查者是你此刻的身份。',
'雷恩街11号位于旧港边的Fox Point，是一栋有半地下室、阁楼和共用厨房的老砖楼。你住在二楼后间。三楼的建筑师伊莱亚斯习惯用修理和图纸代替解释；阁楼的裘德白天修车、晚上在乐队唱歌；半地下的急诊科医生赛拉斯上夜班，习惯把每件事记下来。三个人都和这栋楼有自己的关系，你需要逐个了解，不能把他们的沉默当成同一种答案。',
'母亲把房子放进家族信托。按照故事中的信托文件，三位住户各有5%的受益权，出售、抵押与改建还牵涉共同决定。附件另列了三项为期一年的居住条件：每晚十点为三楼住户朗读一小时、每周三和阁楼住户共进晚餐、每月和半地下住户谈话五十分钟。这些条件将从你27岁生日开始生效。你要先看清文件、询问真实情况，再判断自己愿意接受怎样的安排。',
'房屋里的旧报告、改建痕迹、母亲的档案箱和住户们不同的说法，会把十年前的火灾带回眼前。你需要区分亲耳听到的证词、已经找到的物证和未经核实的猜测。亲近任何一个人，都不能代替核实他说的话；知道一部分旧事，也不等于已经知道完整真相。',
'你的总任务是处理房屋与共同居住的现实问题，查清母亲留下文件和旧火灾的关联，并自己决定这栋楼与个人生活的未来。你可以靠近某个人、保留距离或选择独立生活；邀请和触碰都需要当下的明确意愿，信托条款不代表亲密许可。每章都有公开目标与完成标准，经历相应事件并作出自己的决定后才结束本章。此刻是雨夜23:47，你正在录音棚朗读，三条来自住户的留言几乎同时到来。先听清他们说了什么，再决定先回哪一条。'
]
titles=['三条留言','楼上的住户','十点的朗读','周三晚餐','五十分钟','保险丝盒','附件的背面','屋顶上的雨','一把尺子','处方与边界','火灾的说法','有人在说谎','生日','封楼','最后一盘磁带','离开前夜','谁先放手','只准看我']
goals=['听清三条留言并了解新住处，决定先回应哪位住户。','了解三位住户与房屋的关系，决定先向谁核实墙里的报告。','完成或协商首次朗读，明确自己愿意保持的距离。','参加共同晚餐，了解三人的相处方式，并决定如何回应桌上的空碗。','面对第一次五十分钟谈话，听取赛拉斯的说法并明确后续边界。','处理停电中的安全与求助，决定向谁开门或选择独处。','检查信托附件背面的信息，决定先向哪位当事人追问。','面对屋顶上的相处与邀请，决定是否靠近或保持距离。','了解房间测量与房屋情况，在伊莱亚斯的靠近前明确许可与界线。','回应赛拉斯的关心与警告，自主决定亲近或停止。','听取关于火灾的不同说法，决定先跟随谁继续核实。','检查地下室录音中的信息，决定把录音交给谁。','面对生日晚餐和三份礼物，选择自己的回应与拆礼物的顺序。','应对房屋被封的现实处境，决定与谁共处或独自度过夜晚。','听完母亲留下的磁带，形成自己的理解并回应三位住户。','面对三人的离开安排，决定是否会面以及前往哪一层。','在离开之前明确关系选择，可以敲门，也可以回自己的房间。','回顾已经查明的事情和自己的选择，亲自决定最终关系与独立生活的方向。']
criteria=[['听清三条留言并认识住户', '选定第一位回应对象'], ['了解住户和墙内报告', '决定先向谁核实报告'], ['处理首次朗读安排', '明确自己的距离与许可'], ['完成共同晚餐的交流', '回应桌上的空碗'], ['听取赛拉斯的说法', '明确后续谈话边界'], ['处理停电中的安全问题', '决定开门对象或独处'], ['检查附件背面的信息', '确定首先追问的当事人'], ['回应屋顶上的相处与邀请', '决定靠近或保持距离'], ['了解房间测量与房屋情况', '回应测量结束后的邀请'], ['面对关心与边界提醒', '明确亲近或停止的选择'], ['听取火灾的不同说法', '选定下一步核实方向'], ['检查地下室录音', '决定录音的交付对象'], ['参与生日晚餐与交流', '确定先拆哪份礼物'], ['应对房屋被封的处境', '决定共处对象或独处'], ['听完母亲的最后一盘磁带', '说出自己的回应与理解'], ['了解三人的离开安排', '决定会面的时间与对象'], ['面对离开前的关系选择', '选择敲门或回自己房间'], ['面对房屋与生活的最终安排', '亲自选择并完成对应结局']]
chapters=[];notes=[];lines=[];ch=0;scene=0;route=False;aloneBlock=False;examples=[]
for l in s.splitlines():
 l=l.strip();m=re.match(r'# CHAPTER (\d+)',l)
 if m:
  ch=int(m[1]);scene=0;lines.append('# CHAPTER %d｜%s'%(ch,titles[ch-1]));
  if ch==1:
   lines+=['⟦ORIENT|bg⟧','⟦SET|cast_all⟧','⟦SET|only_me_v2⟧']
   for sid,fact,knows,when in [('fire_signoff','伊莱亚斯是2016年改建验收报告的签字人。','伊莱亚斯',11),('lost_brother','裘德的哥哥卡尔死于那场火。','裘德',11),('closed_door','赛拉斯当年的证词遗漏了门已关闭这一细节。','赛拉斯',12),('last_tapes','玛戈已经逃出火场，却为取回留给女儿的生日磁带再次返回。','',15),('clause_purpose','三条居住条件也牵涉玛戈对三名住户各自处境的安排。','',15)]:lines.append('⟦SECRET|'+ '|'.join(quote(str(v),safe='') for v in [sid,fact,'knows:'+knows,'reveal_from:'+str(when)])+'⟧')
   for c in cast:lines.append('⟦CHAR|'+ '|'.join(quote(str(v),safe='') for v in [c['name'],c['gender'],c['age'],'f2' if c['gender']=='f' else 'm3',c['role'],c['bio']])+'⟧')
  continue
 if l.startswith('# SCENE'):
  scene+=1
  if route:lines.append('⟦/IF⟧');route=False
  if ch==17 and scene==3:lines.append('⟦IF|om_companion17⟧');aloneBlock=True
  if ch==17 and scene==7 and aloneBlock:lines.append('⟦/IF⟧');aloneBlock=False
 if l.startswith('# CHOICE'):lines.append('⟦SET|omscene_c%02d⟧'%ch)
 if l.startswith('你：'):examples.append({'chapter':ch,'scene':scene,'sample':l[2:]});continue
 m=re.match(r'⟦([A-Z/]+)(?:\|(.*))?⟧$',l)
 if m:
  kind=m[1];a=(m[2] or '').split('|');notes.append(dict(chapter=ch,scene=scene,kind=kind,args=a))
  if kind in ['CHAR','ORIENT','VIDEO','FX']:continue
  if kind=='GOAL':lines+=['⟦DONE|flag|omscene_c%02d|%s⟧'%(ch,criteria[ch-1][0]),'⟦DONE|flag|omchoice_c%02d|%s⟧'%(ch,criteria[ch-1][1])];l='⟦GOAL|'+goals[ch-1]+'⟧'
  elif kind in ['BG','CG']:l='⟦'+kind+'|'+a[0]+'⟧'
  elif kind=='BGM':l='⟦BGM|'+('tense' if ch in [6,11,12,14] else 'warm')+'⟧'
  elif kind=='OPT':
   flags=['omchoice_c%02d'%ch]
   for part in a[1].split(';'):
    k,v=part.split(':',1)
    if k=='set':flags+=v.split(',')
    else:flags.append('omdelta~c%02d~%s~%s'%(ch,k,v))
   if ch==17:flags.append('om_companion17' if a[0]!='D' else 'om_alone17')
   if ch==18:flags.append(dict(A='route_thorne',B='route_ferreira',C='route_reidy',D='route_herself')[a[0]])
   l='⟦OPT|'+a[0]+'|set:'+','.join(flags)+'⟧'
  elif kind=='IF':route=True
 if l.startswith('⟦') and not l.startswith('⟦DONE|'):
  mm=re.match(r'^⟦([A-Z/]+)(.*?)⟧$',l)
  if mm:l='⟦'+mm[1]+''.join('|'+quote(v,safe='') for v in mm[2].split('|')[1:])+'⟧'
 lines.append(l)
if route or aloneBlock:lines.append('⟦/IF⟧')
text='# 只准看我\n\n'+'\n'.join(lines)+'\n';(D/'script.md').write_text(text)
personalities={'me':'玩家的决定与发言由本人掌握。','elias':'寡言、精确，习惯用修缮和留出空间表达关心；靠近前停下等待许可，不替对方作决定。','jude':'语速快，常用反问，先低头再笑；熟悉修车与吉他，热心邀请但接受拒绝。','silas':'语速慢，完整句与细节多，习惯观察和记录；触碰前先询问，不能用专业身份替对方作感情决定。'}
for c in cast:c['lead']=c['key']!='me';c['personality']=personalities[c['key']]
(D/'cast.json').write_text(json.dumps(cast,ensure_ascii=False,indent=2)+'\n');(D/'production-notes.json').write_text(json.dumps(notes,ensure_ascii=False,indent=2)+'\n');(D/'player-examples.json').write_text(json.dumps(examples,ensure_ascii=False,indent=2)+'\n')
M={};missing=[];manifest=list(csv.DictReader((A/'manifest.csv').open(encoding='utf-8-sig')))
for r in manifest:
 f=A/r['path']
 if f.is_file():assert hashlib.sha256(f.read_bytes()).hexdigest()==r['sha256'],r['path'];M[r['slot']]='/art/official/only-me-v2/'+r['path']
 else:missing.append(r['path'])
for c in cast:M['char_'+c['name']]=M['char_'+c['key']]=c['art']
for n in range(1,83):
 if (A/'highlights'/('hl_%02d.png'%n)).is_file():M['hl_%02d'%n]='/art/official/only-me-v2/highlights/hl_%02d.png'%n
if (A/'cover/cover.png').is_file():M['cover']=M['poster']='/art/official/only-me-v2/cover/cover.png'
if rel.get('cover') and (R/rel['cover'].lstrip('/')).is_file():M['cover']=M['poster']=rel['cover']
M['opening_video']=M['home_video']=M['vid_open']='/video/only-me-opening-v2.mp4'
(R/'art/official'/f'{rel["work_id"]}.json').write_text(json.dumps(M,ensure_ascii=False,indent=2)+'\n')
contexts=[]
for part in re.split(r'(?=^# CHAPTER \d+)',text,flags=re.M)[1:]:contexts.append(''.join(re.findall(r'^旁白：(.+)$',part,re.M)[:2]))
pres={'cover':M.get('cover'),'background':background,'identity':background[0],'chapters':[dict(n=i+1,title=titles[i],background=contexts[i],goal=g,criteria=criteria[i]) for i,g in enumerate(goals)]};(D/'presentation.json').write_text(json.dumps(pres,ensure_ascii=False,indent=2)+'\n')
leads=[dict(key=c['key'],n=bi(c['name']),g='m',age=c['age'],voice='m3',art=c['art'],role=bi(c['role']),looks=bi(c['bio']),vibe=bi(c['personality']),solo=bi('门没锁。' if c['key']=='elias' else '你吃饭了吗？' if c['key']=='jude' else '我看看。'),boundary=bi('尊重明确意愿；拒绝和独立生活不等于失败。')) for c in cast if c['lead']]
config={'title':'只准看我','hook':'母亲留下一栋楼、三个住户和三条奇怪的居住条款。你要查清那场火，也要决定谁能走进你的生活。','premise':'\n\n'.join(background),'you':background[0],'as':'你','orient':'bg','adult':True,'tags':['现代','悬疑','慢热','共同居住','自主选择'],'leads':leads,'cover':'https://miru.plus'+M['cover'] if M.get('cover') else ''}
chap=[]
for c in re.split(r'(?=^# CHAPTER \d+)',text,flags=re.M):
 m=re.match(r'# CHAPTER (\d+)｜([^\n]+)',c)
 if m:chap.append(dict(n=int(m[1]),t=m[2],md=c))
(D/'admin-import.json').write_text(json.dumps({'id':rel['script_id'],'patch':{'title':'只准看我','orient':'bg','lang':'zh','config':config,'chapters':chap}},ensure_ascii=False,indent=2)+'\n');(D/'validation.json').write_text(json.dumps({'chapters':len(chap),'scenes':len(re.findall('^# SCENE',text,re.M)),'player_examples':len(examples),'missing_assets':missing,'publish_ready':not missing},ensure_ascii=False,indent=2)+'\n');print(json.dumps({'chapters':len(chap),'scenes':len(re.findall('^# SCENE',text,re.M)),'images_present':261-len(missing),'images_missing':len(missing),'player_examples':len(examples)}))
