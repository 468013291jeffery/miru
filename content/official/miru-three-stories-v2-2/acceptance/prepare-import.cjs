const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const base=path.resolve(__dirname,'..'),prefix='content/official/miru-three-stories-v2-2';
const specs={
 A_Forbidden_Brother:[['damian','Damian','达米安','達米安'],['ethan','Ethan','伊森','伊森'],['eleanor','Eleanor','埃莉诺','埃莉諾'],['mia','Mia','米娅','米婭'],['claire','Claire','克莱尔','克萊爾']],
 B_Devil_Knows_My_Name:[['roman','Roman','罗曼','羅曼'],['luca','Luca','卢卡','盧卡'],['nadia','Nadia','娜迪娅','娜迪婭'],['lawyer','Lawyer','独立律师','獨立律師']],
 C_Midnight_Confession:[['lucian','Lucian','卢西安','盧西安'],['agnes','Agnes','阿格妮丝','阿格妮絲'],['nora','Nora','诺拉','諾拉'],['mara','Mara','玛拉','瑪拉']]
};
const locales=['zh-CN','zh-TW','en-US','ja-JP','ko-KR','es-ES'];
const narration=new Set(['旁白','Narration','Narrator','Narración','ナレーション','내레이션','나레이션']);
const tag=(key,parts)=>'⟦'+key+'|'+parts.map((p,i)=>key==='CHAR'&&i===0?String(p):encodeURIComponent(String(p))).join('|')+'⟧';
const sum=s=>crypto.createHash('sha256').update(s).digest('hex');
for(const [story,roles] of Object.entries(specs)){
 const dir=path.join(base,story),letter=story[0].toLowerCase(),cards=JSON.parse(fs.readFileSync(path.join(dir,'production/character_bible_v2_2.json'))),assets=JSON.parse(fs.readFileSync(path.join(dir,'production/asset_manifest.json')));
 const out=path.join(dir,'integration');fs.mkdirSync(out,{recursive:true});const manifest={kind:'derived_import_files',source_preserved:true,canonical_speaker_keys:true,source_character_bible:'production/character_bible_v2_2.json',reserved_engine_marker:'cast_all',locales:[]};
 for(const locale of locales){
  const aliasesPath=path.join(dir,'locales',locale,'speaker_aliases.json'),aliases=fs.existsSync(aliasesPath)?JSON.parse(fs.readFileSync(aliasesPath)):{};
  const display=en=>Object.keys(aliases).find(k=>aliases[k]===en)||en;
  const cast=roles.map(([key,en,cn,tw])=>{const card=cards.find(c=>c.asset_id==='char_'+letter+'_'+key);assert(card,key);return {key,name:cn,display:locale==='zh-CN'?cn:locale==='zh-TW'?tw:display(en),tw,english:en,card};});
  const map=Object.fromEntries(assets.map(a=>[a.id,prefix+'/'+story+'/'+a.file]));map.cover=map['cover_'+letter];map['char_你']=map['char_'+letter+'_player'];
  const player=cards.find(c=>c.asset_id==='char_'+letter+'_player');
  const headers=[tag('ORIENT',['bg']),tag('SET',['native_v2']),tag('SET',['authored~miru_v22']),tag('CHAR',['你','f',(player.visual_anchor_zh.match(/(\d+)岁/)||[])[1]||28,'f2','Player',player.visual_anchor_zh])];
  for(const c of cast){const a=c.card.visual_anchor_zh;headers.push(tag('CHAR',[c.name,a.includes('成年男性')?'m':'f',(a.match(/(\d+)岁/)||[])[1]||30,a.includes('成年男性')?'m2':'f2',c.english,a,c.display]));map['char_'+c.name]=map[c.card.asset_id];}
  headers.push(tag('SET',['cast_all']));
  const sceneIndex=JSON.parse(fs.readFileSync(path.join(dir,'production/scene_index.json')));
  map.scene_present=Object.fromEntries(sceneIndex.map(s=>[s.id,(s.visual_cast_zh||[]).map(n=>cast.find(c=>c.name===n)?.name||n)]));
  map.leads=cast.filter(c=>c.card.type==='B').map(c=>c.name);
  for(const a of assets.filter(a=>a.kind==='bgm'||a.id.startsWith('bgm_')))map[a.id]=prefix+'/'+story+'/'+a.runtime_mp3;
  for(const a of assets.filter(a=>a.id.startsWith('sfx_')))map[a.id]=prefix+'/'+story+'/'+a.runtime_mp3;
  let sceneNumber=0,chapterNumber=0;
  const rename=new Map(cast.flatMap(c=>[[c.name,c.name],[c.tw,c.name],[c.display,c.name],[c.english,c.name]]));
  const more=story[0]==='A'?{'助理米娅':'mia','助理米婭':'mia','女演员克莱尔':'claire','女演員克萊爾':'claire'}:story[0]==='B'?{'律师':'lawyer','律師':'lawyer'}:{'阿格妮丝律师':'agnes','阿格妮絲律師':'agnes','艾格尼丝':'agnes','艾格尼絲':'agnes'};
  for(const [old,key] of Object.entries(more))rename.set(old,cast.find(c=>c.key===key).name);
  const raw=fs.readFileSync(path.join(dir,'locales',locale,'script.md'),'utf8');let injected=false,renamed=0;
  let converted=raw.split('\n').map(line=>{
   if(/^# CHAPTER\s+\d+[｜|]/.test(line))chapterNumber=+(line.match(/CHAPTER\s+(\d+)/)||[])[1];
   if(/^# CHAPTER\s+1[｜|]/.test(line)){assert(!injected);injected=true;return line+'\n'+headers.join('\n');}
   const m=/^⟦([A-Z/]+)((?:\|[^|⟧]*)*)⟧$/.exec(line.trim());if(m){if(m[1]==='DONE'){const parts=m[2].slice(1).split('|');parts[parts.length-1]=parts[parts.length-1].replace(/^(?:Narration|Narrator|Narración|ナレーション|내레이션|나레이션)\s*[:：]\s*/, '旁白：');return '⟦DONE|'+parts.join('|')+'⟧';}
    if(m[1]==='OPT'){const parts=m[2].slice(1).split('|');parts[1]=parts[1].replace(/set:([^;]+)/,(_,flags)=>'set:'+flags+',authored~'+flags.replace(/,/g,'_')); if(chapterNumber===16&&parts[0]==='C')parts[1]+= ',ending_open';return tag('OPT',parts);}
    if(m[1]==='BG'){const row=sceneIndex[sceneNumber++];assert(row?.id===m[2].slice(1).split('|')[0]);return tag('BG',m[2].slice(1).split('|'))+'\n'+tag('BGM',[row.bgm_id.slice(4)]);}return '⟦'+m[1]+(m[2]?'|'+m[2].slice(1).split('|').map(p=>encodeURIComponent(p)).join('|'):'')+'⟧';}
   const s=/^([^：:]+)([：:])(.*)$/.exec(line);if(!s)return line;
   const old=s[1].trim(),paren=/^(.+?)([（(][^）)]*[）)])$/.exec(old),name=paren?paren[1]:old;
   let n=narration.has(name)?'旁白':rename.get(name)||name;
   if(name==='Gallery owner')n='GalleryOwner';if(name==='갤러리 관장')n='관장';if(name==='Responsable de la galería')n='Galerista';
   if(n!==name)renamed++;
   // Only speaker/narration labels change; the text after the separator is identical.
   return n+(paren?paren[2]:'')+s[2]+s[3];
  }).join('\n');assert(injected);
  let sharedHooks=0;
  converted=converted.split(/(?=^# CHAPTER\s+\d+)/m).map(ch=>{
   const dot=ch.lastIndexOf('\n# ·'),choice=ch.lastIndexOf('\n# CHOICE');if(dot<0||choice<0)return ch;
   const end=ch.indexOf('\n',dot+1),tail=end<0?'':ch.slice(end+1).trim();if(!tail)return ch;
   assert(tail.split('\n').filter(Boolean).every(l=>/^旁白[：:]/.test(l)),story+'/'+locale+' Unexpected chapter tail: '+tail.slice(0,300));
   const p=ch.slice(choice,dot).split(/(?=^#### [A-E][｜|])/m);assert.equal(p.length,4);
   sharedHooks++;
   // The core builder treats a choice as chapter-ending only when it is last.
   // Keep the same post-choice hook once on each route, inside its branch.
   return ch.slice(0,choice)+p[0]+p.slice(1).map(s=>s.trimEnd()+'\n'+tail+'\n').join('')+'\n# ·\n\n';
  }).join('');
  fs.writeFileSync(path.join(out,'script.'+locale+'.md'),converted);
  fs.writeFileSync(path.join(out,'assets.'+locale+'.json'),JSON.stringify(map,null,2)+'\n');
  manifest.locales.push({locale,script:'script.'+locale+'.md',assets:'assets.'+locale+'.json',source:'../locales/'+locale+'/script.md',source_sha256:sum(raw),import_sha256:sum(converted),speaker_labels_normalized:renamed,chapter_hooks_moved_into_each_route:sharedHooks,characters:cast.map(c=>({key:c.key,name:c.name,asset_id:c.card.asset_id,romanceable:c.card.type==='B',source_type:c.card.type,display:c.display}))});
 }
 fs.writeFileSync(path.join(out,'import-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 fs.writeFileSync(path.join(out,'README.md'),'# 正式导入稿\n\nscript.<locale>.md 由修订后的六语言源稿生成。导入稿统一使用中文角色键，第七个人物字段保留本地化名字，以兼容现行多语言合并器；指令参数经 URI 编码，DONE 保持原始规范。原稿位于 ../locales。\n\n导入稿启用 native_v2 和 authored 标记，保留逐场在场人物、两项章目标、三项章末选择和条件留痕；章节尾钩子置于各互斥分支内，仅显示所选路线。assets.<locale>.json 提供封面、人物、背景、原创配乐和音效映射。正式作品ID及在线验收见 release.json 与总验收报告。\n');
}
console.log('Prepared 18 derived import scripts with URI-safe directives and cast/asset bindings.');
