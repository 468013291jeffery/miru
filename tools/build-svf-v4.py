from pathlib import Path
import re,json,csv,hashlib
R=Path(__file__).resolve().parents[1];out=R/'content/official/svf-v4';rel=json.loads((out/'release.json').read_text());source=(R/'scripts/svf-v4/source.md').read_text();body='# CHAPTER 1｜Moving In'+source.split('# CHAPTER 1｜Moving In',1)[1];body=body.replace('\\_','_').replace('⟧⟧','⟧').replace('**','')
names={'cora':'你','rhys':'里斯','dorian':'多里安','kai':'凯','noah':'诺亚','matteo':'马泰奥','sasha':'萨沙','jonah':'乔纳','alastair':'阿利斯泰尔','hale':'黑尔','wren':'温'}
ages={'cora':24,'rhys':27,'dorian':29,'kai':26,'noah':25,'matteo':24,'sasha':24,'jonah':23,'alastair':61,'hale':29,'wren':31}
presentation=json.loads((out/'presentation.json').read_text())
profiles={}
for k in list(names)[1:8]:
 m=re.search(r'#### '+k+r' · (.*?)(?=\n#### |\n### 三、)',source,re.S);assert m,k
 profiles[k]=re.sub(r'\*\*|\n---','',m[1]).strip()
profiles['cora']=source.split('### 一、女主：Cora Vane',1)[1].split('### 二、七人卡',1)[0].replace('**','').strip()
for k,end in [('alastair','Hale'),('hale','Wren'),('wren','### 四、')]:
 a={'alastair':'**Alastair Vane','hale':'**Hale','wren':'**Wren'}[k];profiles[k]=source.split(a,1)[1].split(end,1)[0].replace('**','').strip()
casts=[{'key':k,'name':n,'age':ages[k],'gender':'f' if k in ['cora','wren'] else 'm','lead':k in list(names)[1:8],'bio':profiles[k]} for k,n in names.items()]
# Cast and production notes are typed metadata, never free narration.
notes=[];lines=[];ch=0;sample=0;scene=0;goals=set();decl=[]
from urllib.parse import quote
for c in casts:
 decl.append('⟦CHAR|'+ '|'.join(quote(str(v),safe='') for v in [c['name'],c['gender'],c['age'],'f2' if c['gender']=='f' else 'm3','玩家·经纪人' if c['key']=='cora' else '男主角' if c['lead'] else '配角',c['bio'][:1800]])+'⟧')
for raw in body.splitlines():
 l=raw.strip()
 m=re.match(r'# CHAPTER (\d+)',l)
 if m:
  ch=int(m[1]);scene=0;lines.append(l)
  if ch==1:lines+=['⟦ORIENT|bg⟧','⟦SET|cast_all⟧','⟦SET|svf_v4⟧']+decl
  continue
 if l.startswith('# CHOICE'):lines.append('⟦SET|svfscene_c%02d⟧'%ch)
 if l.startswith('# SCENE'):
  if lines and any(x.startswith('⟦IF|route_') for x in lines[-30:]):pass
  scene+=1
 if l.startswith('（示例·你'):
  sample+=1;continue
 m=re.match(r'⟦([A-Z/]+)(?:\|(.*?))?⟧$',l)
 if m:
  k=m[1];a=(m[2] or '').split('|');notes.append({'chapter':ch,'scene':scene,'kind':k,'args':a})
  if k in ['CHAR','ITEM','FX']:continue
  if k=='GOAL':
   if ch in goals:continue
   goals.add(ch);g=presentation['chapters'][ch-1];lines+=['⟦DONE|flag|svfscene_c%02d|%s⟧'%(ch,g['criteria'][0]),'⟦DONE|flag|svfchoice_c%02d|%s⟧'%(ch,g['criteria'][1])];l='⟦GOAL|'+g['goal']+'⟧'
  elif k=='BG':l='⟦BG|'+a[0]+'⟧'
  elif k=='CG':l='⟦CG|'+a[0]+'⟧'
  elif k=='BGM':l='⟦BGM|'+('tense' if ch in [8,11,14,17] else 'sport' if ch in [3,12,15] else 'warm')+'⟧'
  elif k=='OPT':
   flags=['svfchoice_c%02d'%ch]
   for part in a[1].split(';'):
    key,val=part.split(':',1)
    if key=='set':flags+=val.split(',')
    else:flags.append('svfdelta~c%02d~%s~%s'%(ch,key,val))
   if ch==18:flags.append({'A':'route_stay','B':'route_company','C':'route_stage'}[a[0]])
   l='⟦OPT|'+a[0]+'|set:'+','.join(flags)+'⟧'
  elif k=='IF':
   # Close the previous route before entering a different ending scene.
   l='⟦IF|'+a[0]+'⟧'
 if l.startswith('# SCENE') and any(x.startswith('⟦IF|route_') for x in lines) and not (lines and lines[-1]=='⟦/IF⟧'):lines.append('⟦/IF⟧')
 lines.append(l)
if any(x.startswith('⟦IF|route_') for x in lines):lines.append('⟦/IF⟧')
# URI-encode directive arguments before the generic dialogue parser sees colons.
from urllib.parse import unquote
lines=[l if l.startswith('⟦DONE|') else re.sub(r'^⟦([A-Z/]+)(.*?)⟧$',lambda m:'⟦'+m[1]+''.join('|'+quote(unquote(a),safe='') for a in m[2].split('|')[1:])+'⟧',l) for l in lines]
text='# 我在男团当团宠\n\n'+'\n'.join(lines)+'\n';assert sample==205
(out/'script.md').write_text(text);(out/'cast.json').write_text(json.dumps(casts,ensure_ascii=False,indent=2)+'\n');(out/'production-notes.json').write_text(json.dumps(notes,ensure_ascii=False,indent=2)+'\n')
assets=R/'art/official/svf-v4';mapping={};manifest=list(csv.DictReader((assets/'manifest.csv').open(encoding='utf-8-sig',newline='')))
for row in manifest:
 p=assets/row['path'];assert p.is_file(),p;assert hashlib.sha256(p.read_bytes()).hexdigest()==row['sha256'],row['path'];mapping[row['slot']]='/art/official/svf-v4/'+row['path']
for c in casts:
 first=next(row for row in manifest if row['slot'].startswith('char_'+c['key']+'/'));mapping['char_'+c['name']]=mapping[first['slot']];c['art']=mapping[first['slot']]
cover=next(row for row in manifest if row['category']=='cover');mapping['cover']=mapping['poster']='/art/official/svf-v4/'+cover['path'];mapping['home_video']=mapping['vid_open']=mapping['opening_video']='/video/svf-opening-v4.mp4'
for n in range(1,24):mapping['hl_%02d'%n]=next(mapping[row['slot']] for row in manifest if row['path'].endswith('hl_%02d.jpg'%n))
(R/'art/official'/f'{rel["work_id"]}.json').write_text(json.dumps(mapping,ensure_ascii=False,indent=2)+'\n');(out/'cast.json').write_text(json.dumps(casts,ensure_ascii=False,indent=2)+'\n')
meta={'title':'我在男团当团宠','hook':'十八天，一栋别墅，七个男团成员都想留住你。那条“不许碰经纪人”的团规，正是队长亲手写下的。','premise':'\n\n'.join(presentation['background']),'you':presentation['identity'],'as':'你','orient':'bg','adult':True,'cover':'https://miru.plus'+mapping['cover'],'tags':['现代','娱乐圈','群像','慢热','自主选择']}
chs=re.split(r'(?=^# CHAPTER \d+)',text,flags=re.M);chapters=[]
for x in chs:
 m=re.match(r'# CHAPTER (\d+)[｜|](.*)',x)
 if m:chapters.append({'n':int(m[1]),'t':m[2].strip(),'md':x})
assert len(chapters)==18
payload={'id':rel['script_id'],'patch':{'title':meta['title'],'orient':'bg','lang':'zh','config':meta,'brief':'仅正文进入演出；原始合并稿、图片提示词、角色设定与样例玩家台词分别保留，不作为旁白。','chapters':chapters}}
(out/'admin-import.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'chapters':18,'sourceScenes':len(re.findall(r'^# SCENE',text,re.M)),'assets':len(manifest),'samplePlayerLinesRemoved':sample,'work_id':rel['work_id']},ensure_ascii=False))
