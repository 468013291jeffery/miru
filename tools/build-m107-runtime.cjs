const fs=require('fs'),path=require('path'),assert=require('assert/strict'),crypto=require('crypto');
const root=path.resolve(__dirname,'..'),dir=root+'/content/official/m107-v3',raw=fs.readFileSync(dir+'/source.md','utf8').replace(/\r\n?/g,'\n');
const main=raw.slice(raw.indexOf('## CH01｜'),raw.indexOf('# E. 30章之后'));
const bi=(zh,en)=>({zh,en}),names={KAEL:'凯尔',ROWAN:'罗文',LUCIEN:'卢西恩',MARA:'玛拉',IRIS:'艾瑞丝',EVELYN:'伊芙琳',DORIAN:'多里安',TESSA:'泰莎',GUARD:'守卫',AUNT_RECORDING:'姨母的录音',SCREEN:'屏幕',NARRATOR:'旁白',YOU:'你'};
const bgRows=raw.slice(raw.indexOf('# K. 50张')).split('\n').filter(l=>/^\| BG\d+/.test(l)).map(l=>{const a=l.split('|').map(x=>x.trim());return{id:a[1],description:a[2],weather:a[3],cast:/三男主|三人/.test(a[2])?['KAEL','ROWAN','LUCIEN']:['KAEL','ROWAN','LUCIEN'].filter(n=>a[2].includes(n[0]+n.slice(1).toLowerCase()))};});assert.equal(bgRows.length,50);
const locations=['庄园铁门','庄园门廊','月图书房','议会厅','森林边缘','银月温室','壁炉客厅','禁林栈桥','古老月井','庄园餐厅','训练场','山崖边缘','档案馆','家族照片墙','月议会厅','药剂铺','湖畔符文','环形石阵','医务室','旧车库','图书露台','星灯露台','河岸篝火','玻璃穹顶','月井洞口','晨雾广场','旧琴房','废弃瞭望塔','破镜预言室','银白审议台','玻璃廊桥','雪夜门廊','雪夜月池','庄园地图室','议会外厅','废教堂','红月避难所','冬季舞会收容区','公开审判厅','断桥','神谕树','雪后林地','归乡集市','观星台','月蚀圣坛','月井光柱','日出山脊','雨后公路','春夜月池','重建庄园庭院'];
const music=['standoff','heartbeat_close','midnight_jazz','old_letter','courtroom','clue','sunday_kitchen','chase_night','confession','good_morning'];
function clean(s){return String(s||'').replace(/```(?:text)?/g,'').replace(/`[^`]*`/g,'').replace(/\*\*/g,'').replace(/\[([^\]]*)\]/g,'').replace(/\*/g,'').trim();}
function narrative(s){return clean(s).replace('烤坏的饼干、听错的歌、那晚你笑了很久','烤坏的饼干、听错的歌，以及他邀请你核对的日常片段').split(/(?<=[。！？])\s*/).filter(t=>t&&!/程序|外包|玩家可|玩家选择|玩家主动|玩家决定|若玩家|如果玩家|只有玩家|选择任何|\bCH\d|\bFLAG_|\bMEM_|\bEVID_|\bYOU|触发|写入|存储|存档|镜头|特效|音效|字幕|播放|小游戏|分支|即时反馈|ENDING|WORLD_|剧情|导演|根据|回响|任何路线|互动：|避免不合理|游戏：|IF |若未|否则|可输入|可接受|可选择|可编辑|预置|绝不写|若你|如果你|若握|若离|若问|若选择|只有玩家|若是朋友|若玩家|若没有|若\s*FLAG|却没有.*公开/.test(t)).join('').replace(/你刚说[“「][^”」]*[”」][，,]?/g,'').replace(/你(?:感到|觉得|忍不住)[^。！？]*[。！？]?/g,'').replace(/(?:他|她|Kael|Rowan|Lucien)(?:回答|说|问)[：:]\s*$/,'').trim();}
const inlineQuotes=[
 ['Then freeze it.','KAEL'],['A promise made under fear is not a promise.','AUNT_RECORDING'],['You can be scared. I am, too.','KAEL',{flag:'M107_FEAR_EXPRESSED'}],
 ['you stayed while the storm passed','KAEL',{flag:'FLAG_STORM_KAEL'},'You stayed while the storm passed.'],['Tea was a dangerous idea. I might come back.','SCREEN',{flag:'FLAG_STORM_ROWAN'}],
 ['I still owe you a dance without half the valley watching.','KAEL',{flag:'FLAG_DANCE_K'}],['Would you like me to stay, or would you rather have the bridge to yourself?','KAEL',{notFlag:'FLAG_DANCE_K'}],['I remember the first time you asked me to look at you instead of tomorrow.','LUCIEN',{flag:'FLAG_L_HAND'}],
 ['I owe you the truth, even if it makes it harder to want me.','KAEL'],['I could get used to this. Only if you want to.','KAEL',{flag:'INT_K_HAND'}],
 ["I was. Then you showed up, and I started making plans where somebody else gets home alive.",'ROWAN',null,"I was planning to leave. Then you showed up, and I started making plans where somebody else gets home alive."],
 ["Would you like this dance? If not, I'll still walk you home.",'KAEL'],["Yes. And I won't turn that into a prophecy you have to obey.",'LUCIEN',{flag:'MEM_L_CONFESSION'}],
 ["You don't have to make me the good guy. Just don't let him use the same trap on someone else.",'ROWAN'],['Even if she never loves me, she gets to live free.','KAEL'],
 ['My power was never yours to carry.','KAEL'],['No more running for people who never chose the chase.','ROWAN'],['Let the future belong to the living.','LUCIEN'],
 ["I want to kiss you. I won't pretend the moon told me to.",'LUCIEN',{flag:'M107_L_DATE'}],['Then hot chocolate is our next great mystery.','LUCIEN',{flag:'M107_L_KISS_DECLINED'}],
 ['Can I kiss you now?','KAEL',{flag:'FLAG_K_READY',defer:27}],['I love the person you keep choosing to become. Would you like to see where that takes us?','LUCIEN',{flag:'FLAG_L_READY',defer:29}],['Then I would be lucky to know you that way.','LUCIEN',{flag:'FLAG_L_FRIEND',defer:29}]
];
function qualifier(q){if(/若CH01选A/.test(q))return{choice:[1,'A']};if(/否则/.test(q))return{notChoice:[1,'A']};if(/如果同场/.test(q))return{flag:'M107_K_PRESENT'};if(/if chosen/i.test(q))return{ending:true};if(/independent/i.test(q))return{independent:true};return null;}
function parseBeats(text){
 const tokens=[];const occupied=[];
 const add=(index,end,speaker,text,q='')=>{if(occupied.some(([a,b])=>index>=a&&index<b))return;occupied.push([index,end]);tokens.push({at:index,end,speaker:speaker.trim(),text:text.trim().replace(/^“|”$/g,''),qualifier:q,cond:qualifier(q),remote:/radio|comms|远程|录音/i.test(q)});};
 const bold=/\*\*([A-Z][A-Z_ ]*)(?:[（(]([^*\n]*?)[）)])?:\*\*\s*[“"]([^”"\n]+)[”"]/g;for(const m of text.matchAll(bold))add(m.index,m.index+m[0].length,m[1],m[3],m[2]||'');
 const code=/^([A-Z][A-Z_ ]*)(?:\s*\(([^\n)]*)\))?:\s*[“"]([^”"\n]+)[”"]/gm;for(const m of text.matchAll(code))add(m.index,m.index+m[0].length,m[1],m[3],m[2]||'');
 // Inline quoted player lines remain optional player stops, never automatic speech.
 const you=/\*\*YOU(?:[（(][^*\n]*[）)])?\*\*[^\n“"]{0,12}[“"]([^”"\n]+)[”"]/g;for(const m of text.matchAll(you))add(m.index,m.index+m[0].length,'YOU',m[1]);
 const free=/\*\*YOU[（(]([^*\n]*?)[）)]\*\*/g;for(const m of text.matchAll(free))add(m.index,m.index+m[0].length,'YOU','',m[1]);
 for(const [quoted,speaker,cond,replacement]of inlineQuotes){const at=text.indexOf('“'+quoted+'”');if(at>=0&&!occupied.some(([a,b])=>at>=a&&at<b)){add(at,at+quoted.length+2,speaker,replacement||quoted);const t=tokens[tokens.length-1];t.cond=cond||null;t.original=quoted;}}
 tokens.sort((a,b)=>a.at-b.at);const out=[];let at=0;
 for(const t of tokens){const before=narrative(text.slice(at,t.at));if(before)out.push({speaker:'NARRATOR',text:before,sourceLanguage:/[\u3400-\u9fff]/.test(before)?'zh':'en'});out.push({...t,sourceLanguage:'en'});at=t.end;}
 const tail=narrative(text.slice(at));if(tail)out.push({speaker:'NARRATOR',text:tail,sourceLanguage:/[\u3400-\u9fff]/.test(tail)?'zh':'en'});
 return out.map(({at,end,...b})=>b);
}
function scene(id,bg,text,bgm){const row=bgRows.find(r=>r.id===bg);assert(row,'Missing '+bg);let ambient=/暴雨|雷雨|雨夜|雨晨|阴雨/.test(row.weather)?'rain':/雪/.test(row.weather)?'snow':/风/.test(row.weather)?'wind':/烛|暖灯/.test(row.weather)?'candle':'none';return{id,bg,place:locations[+bg.slice(2)-1],time:row.weather,music:'m_'+music[(bgm||1)-1],ambient,beats:parseBeats(text)};}
const chunks=main.split(/(?=^## CH\d{2}｜)/m).filter(c=>/^## CH\d{2}｜/.test(c));assert.equal(chunks.length,30);
// Extensions are placed next to the event they elaborate, not in a chapter-end pile.
const extAAnchor={1:'B',2:'A',3:'A',4:'A',5:'A',6:'A',7:'A',8:'A',9:'A',10:'B',11:'A',12:'A',13:'A',14:'A',15:'A',16:'A',17:'A',18:'A',19:'A',20:'A',21:'A',22:'A',23:'A',24:'A',25:'B',26:'A',27:'B',28:'A',29:'A',30:'B'};
const extBAnchor={1:'B',2:'B',3:'B',4:'B',5:'B',6:'B',7:'C',8:'B',9:'B',10:'C',11:'B',12:'B',13:'B',14:'A',15:'B',16:'B',17:'B',18:'A',19:'B',20:'B',21:'B',22:'B',23:'B',24:'B',25:'B',26:'B',27:'C',28:'B',29:'B',30:'B'};
const chapters=chunks.map((chunk,i)=>{
 const n=i+1,id='CH'+String(n).padStart(2,'0'),h=chunk.match(/^## CH\d{2}｜(.+?) \/ (.+)$/m);assert(h,id+' title');const baseText=chunk.split('### '+id+'_EXT')[0],extText=chunk.split('### '+id+'_EXT')[1]?.split('### '+id+'_V3')[0]||'',v3Text=chunk.split('### '+id+'_V3')[1]||'';
 const base=[];const matches=[...baseText.matchAll(/^\*\*场景\d{2}([ABC])｜(BG\d{2})([^*]+)\*\*([^\n]*)\n/gm)];
 for(let j=0;j<matches.length;j++){const m=matches[j],body=baseText.slice(m.index+m[0].length,matches[j+1]?.index||baseText.length),bg=m[2],bm=+(m[4].match(/BGM(\d+)/)?.[1]||1);base.push({...scene(id+'_'+m[1],bg,body,bm),key:m[1]});}
 // Chapter 30C contains the five route epilogues, not a common pre-choice scene.
 assert.equal(base.length,n===30?2:3,id+' base scenes');
 const extras=[];for(const m of extText.matchAll(/\*\*新增场景 EXT_([AB])[^\n]*\n([\s\S]*?)(?=\*\*新增场景 EXT_|\*\*跨章分支|$)/g)){const anchor=(m[1]==='A'?extAAnchor:extBAnchor)[n],ref=base.find(s=>s.key===anchor)||base[0];let bg=ref.bg;if(n===5&&m[1]==='B')bg='BG19';if(n===22&&m[1]==='A')bg='BG41';extras.push({...scene(id+'_EXT_'+m[1],bg,m[2],+(extText.match(/BGM(\d+)/)?.[1]||1)),anchor,priority:m[1]==='A'?0:2});}assert.equal(extras.length,2,id+' extensions');
 const vhead=v3Text.match(/\*\*V3新增：([^\n]+)/)?.[1]||'',hint=vhead.match(/(\d{2})([ABC])(?:之后|后|与|前)/),letter=hint?hint[2]:'C',before=/\d{2}[ABC]前/.test(vhead),anchor=before?String.fromCharCode(letter.charCodeAt(0)-1):letter;
 const vbody=v3Text.split(/\n\*\*(?:CHOICE|分支|可玩|选择长尾|选择结果|条件化|互动|结局验证)/)[0].split('\n').slice(3).join('\n'),vbg=vhead.match(/BG\d{2}/)?.[0]||(base.find(s=>s.key===anchor)||base[0]).bg;
 const v3={...scene(id+'_V3',vbg,vbody,+(vhead.match(/BGM(\d+)/)?.[1]||1)),anchor,priority:1};
 const ordered=[];for(const b of base){ordered.push(b);ordered.push(...[...extras,v3].filter(x=>x.anchor===b.key).sort((a,b)=>a.priority-b.priority));}assert.equal(ordered.length,n===30?5:6,id+' scene order');
 const choiceLines=v3Text.split('\n').filter(l=>/^- \*\*[A-Z]+ /.test(l));const choices=choiceLines.map(line=>{const m=line.match(/^- \*\*([A-Z]+) (.*?)[：:]\*\*[“"]([^”"]+)[”"]/);assert(m,id+' choice parse');const after=line.slice(m[0].length),responses=parseBeats(after.replace(/`[^`]+`/g,'').split(/；CH\d|；\s*CH\d/)[0]).filter(b=>b.speaker!=='NARRATOR'&&b.speaker!=='YOU');return{k:m[1],label:bi(clean(m[2]).replace(/（需.+|（始终.+/,''),m[3]),said:m[3],responses,updates:[...line.matchAll(/`([^`]+)`/g)].map(x=>x[1]).filter(x=>!/^ENDING_/.test(x)).join(';'),source:line};});assert.equal(choices.length,n===30?5:3,id+' choice count');
 const game=v3Text.match(/\*\*(?:互动小游戏|互动)：\*\*([\s\S]*?)(?=\*\*章末|\*\*章末钩子|$)/)?.[1]?.replace(/\*\*/g,'').trim()||'';
 if(n===19){const b=ordered[0].beats.find(b=>b.speaker==='NARRATOR');if(b)b.text='工作人员把从排水沟取回的戒指放入证物盘。它不再授予凯尔指挥权。'+b.text;}
 const hook=v3Text.match(/\*\*章末(?:钩子)?：\*\*([^\n]+)/)?.[1]||'';
 return{n,id,title:bi(h[1],h[2]),scenes:ordered,choices,gameNote:game,hook:n<30?narrative(hook):'',v3Specification:v3Text,extSpecification:extText};
});
const endChunk=chunks[29].split('**场景30C')[1];const endings={};for(const m of endChunk.matchAll(/\*\*ENDING_(K|R|L|N|MORE)（([^）]+)）：\*\*([\s\S]*?)(?=\n\n\*\*ENDING_|\n\n\*\*互动|$)/g)){const bg=m[2].match(/BG\d{2}/)?.[0]||'BG50';endings[m[1]]=scene('ENDING_'+m[1],bg,m[3],10);}assert.equal(Object.keys(endings).length,5);
let release={work_id:null};try{release=JSON.parse(fs.readFileSync(dir+'/release.json'))}catch{}
let translations={zh:{},en:{}};try{translations=JSON.parse(fs.readFileSync(dir+'/translations.json'))}catch{}
const presentation=JSON.parse(fs.readFileSync(dir+'/presentation.json'));
const data={version:'m107-v3-20261108.1',work_id:release.work_id,sourceSha256:crypto.createHash('sha256').update(raw).digest('hex'),names,backgrounds:bgRows,chapters,endings,translations,presentation};
const target=root+'/art/official/m107-v3/runtime.json',out=JSON.stringify(data,null,2)+'\n';if(process.argv.includes('--check'))assert.equal(fs.readFileSync(target,'utf8').replace(/\r\n/g,'\n'),out);else fs.writeFileSync(target,out);
function tx(t,l){return translations[l]&&translations[l][t]||t;}
function normalize(l){const cast='⟦ORIENT|bg⟧\n'+[['你','f',25,'f1',presentation.you[l]],...Object.entries(presentation.characters).map(([key,p])=>[p.name.en,p.g,p.age,p.voice,p.role[l]])].map(a=>'⟦CHAR|'+a.join('|')+'|'+a[4]+'⟧').join('\n');return chapters.map(c=>{let md='# CHAPTER '+c.n+' | '+c.title[l]+'\n'+(c.n===1?cast+'\n':'');for(const s of c.scenes){md+='# SCENE | '+tx(s.place,l)+'\n⟦BG|'+s.bg+'⟧\n⟦TIME|'+tx(s.time,l)+'⟧\n';for(const beat of s.beats){if(beat.speaker==='YOU')continue;const co=beat.cond,flag=co?.choice?'m107_pick_'+co.choice.join('_'):co?.notChoice?'!m107_pick_'+co.notChoice.join('_'):co?.flag?co.flag:co?.notFlag?'!'+co.notFlag:co?.ending?'m107_ending_selected':co?.independent?'m107_ending_N':null;if(flag)md+='⟦IF|'+flag+'⟧\n';const p=presentation.characters[beat.speaker];md+=(p?p.name.en+': ':'')+tx(beat.text,l)+'\n';if(flag)md+='⟦/IF⟧\n';}}md+='# CHOICE | '+(l==='zh'?'你想怎么做？':'What do you choose?')+'\n';for(const [i,o]of c.choices.entries()){md+='#### '+'ABCDE'[i]+'｜'+(l==='zh'?tx(o.label.zh,l):o.label.en)+'\n你: “'+tx(o.said,l)+'”\n';for(const beat of o.responses){const p=presentation.characters[beat.speaker];md+=(p?p.name.en+': ':'')+tx(beat.text,l)+'\n';}md+='⟦SET|m107_choice_'+c.n+'_'+o.k+',m107_pick_'+c.n+'_'+o.k+'⟧\n';}md+='# ·\n';return{n:c.n,t:c.title[l],md};});}
if(!process.argv.includes('--check'))for(const l of ['zh','en']){const docs=normalize(l);fs.writeFileSync(dir+'/import-chapters.'+l+'.json',JSON.stringify(docs,null,2)+'\n');fs.writeFileSync(dir+'/normalized.'+l+'.md','# '+presentation.title[l]+'\n\n'+docs.map(c=>c.md).join('\n'));}
console.log(`M107: ${chapters.length} chapters, ${chapters.reduce((n,c)=>n+c.choices.length,0)} choices, ${chapters.reduce((n,c)=>n+c.scenes.length,0)} ordered pre-choice scenes, 5 separate endings.`);
