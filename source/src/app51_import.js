/* ---- v151 · 上传剧本文件 → 可玩的剧 ----
   Upload .md / .txt / .docx (or paste text, or a Creator export .json). The MIRU standard script rules turn it into a story pack:
   # CHAPTER n｜标题 / 第n章 → chapter · # SCENE｜地点 → scene · 名字：“台词” → dialogue · 【心理】+ “……” → inner voice ·
   # CHOICE｜问题 + #### A｜“选项” + 后续内容 → a choice (last one in a chapter = chapter ending choice, earlier ones = in-scene choices) ·
   #### 入口A｜… → plays only if the previous chapter ended on A · [EN] blocks are skipped · everything else → narration.
   Rule-based conversion is free. Lines over the content line (explicit sexual wording) are left out and reported. */
const IM_EXPLICIT=["性器","勃起","硬物","插入","抽动","抽插","内裤","下身","鼓起","erection","crotch","groin","thrust","penetrat","bulge"];
const IM_NOTNAME=new Set(["地点","时间","注","备注","提示","场景","说明","状态","标题","第","目标","人物","角色","背景","Note","Time","Place"]);
function imChunks(s){s=s.trim();if(s.length<=150)return [s];const out=[];let cur="";s.split(/(?<=[。！？!?…」”])/).forEach(p=>{if((cur+p).length>150&&cur){out.push(cur);cur=p}else cur+=p});if(cur)out.push(cur);return out}
function imQ(s){return String(s||"").trim().replace(/^[“"「『]+|[”"」』]+$/g,"").trim()}
function imParse(text){text=String(text||"").replace(/\r/g,"").replace(/ /g," ");const doc={title:"",chapters:[],sp:{},spq:{},warn:[],omit:0,think:0,scenes:0};
 let chap=null,choice=null,opt=null,variant=null,mode="zh",think=false,seenBody=false;
 const nc=t=>{chap={t:t||"",items:[]};doc.chapters.push(chap);return chap};
 const sink=()=>opt?opt.then:variant?variant.then:(chap||nc("")).items;
 const closeChoice=()=>{if(choice){(chap||nc("")).items.push({choice});choice=null;opt=null}};
 const closeVar=()=>{if(variant){(chap||nc("")).items.push({variant});variant=null}};
 const push=b=>{const txt=String(b[2]||"");if(IM_EXPLICIT.some(w=>txt.toLowerCase().includes(w))){doc.omit++;const s=sink(),l=s[s.length-1];if(!(l&&l[3]==="omit"))s.push(["n","act",LL("（这一段已省略）","(This part is left out.)"),"omit"]);return}seenBody=true;sink().push(b)};
 const titleOf=h=>{const m=h.split(/[｜|]/);return (m.length>1?(m.slice(1).join(" ").match(/[\u4e00-\u9fff]/)||!m[0].match(/[\u4e00-\u9fff]/)?m.slice(1).join(" "):m[0]):h.replace(/^(CHAPTER|Chapter|SCENE|Scene|CHOICE|Choice)\s*[\d.]*\s*[:：]?\s*/,"").replace(/^第\s*[0-9一二三四五六七八九十百]+\s*[章幕场]\s*[:：]?\s*/,"")).trim()};
 for(const line of text.split("\n")){let raw=line.trim();if(!raw||/^[=\-*_~]{3,}$/.test(raw))continue;
  if(/^\[(EN|ENGLISH)\]$/i.test(raw)){mode="en";continue}if(/^\[(ZH|CN|中文)\]$/i.test(raw)){mode="zh";continue}
  let hm=raw.match(/^(#{1,6})\s*(.+)$/),lvl=hm?hm[1].length:0,h=hm?hm[2].replace(/\*+/g,"").trim():"";
  if(!hm&&raw.length<70&&/^(CHAPTER|SCENE|CHOICE)\b/i.test(raw)){hm=1;lvl=1;h=raw.replace(/^(\w+)/,w=>w.toUpperCase())}
  if(!hm&&choice&&/^([A-E])\s*[｜|]\s*\S/.test(raw)&&raw.length<80){hm=1;lvl=choice.lvl+3;h=raw}
  if(!hm&&/^入口\s*[A-E]\s*[｜|]/.test(raw)&&raw.length<60){hm=1;lvl=4;h=raw}
  if(!hm){const pc=raw.match(/^(第\s*[0-9一二三四五六七八九十百]+\s*章.{0,30})$/);if(pc){hm=1;lvl=1;h=pc[1]}else if(/^(【?(选择|抉择)】?[:：｜|]?.{0,40})$/.test(raw)&&raw.length<44){hm=1;lvl=1;h="CHOICE｜"+raw.replace(/^【?(选择|抉择)】?[:：｜|]?/,"")}}
  if(hm){mode="zh";think=false;
   if(/^(CHAPTER|Chapter|第\s*[0-9一二三四五六七八九十百]+\s*章)/.test(h)){closeVar();closeChoice();nc(titleOf(h));continue}
   if(/^(SCENE|Scene|场景|第\s*[0-9一二三四五六七八九十]+\s*[幕场])/.test(h)){closeVar();closeChoice();doc.scenes++;push(["sys","scene",{place:titleOf(h)||h}]);continue}
   if(/^(CHOICE|Choice|选择|抉择|选项)/.test(h)){closeVar();closeChoice();choice={q:titleOf(h),lvl,opts:[]};continue}
   let m=h.match(/^([A-Ea-e])\s*[｜|:：.、)）]\s*(.*)$/);if(m&&choice){opt={k:m[1].toUpperCase(),t:imQ(m[2]),then:[]};choice.opts.push(opt);continue}
   m=h.match(/^(入口|分支|如果之前选了|若)\s*([A-Ea-e])\s*[｜|:：]?\s*(.*)$/);if(m){closeChoice();closeVar();variant={k:m[2].toUpperCase(),t:m[3],then:[]};continue}
   if(!doc.chapters.length&&!seenBody&&lvl<=2){if(!doc.title||/[｜|]/.test(h)&&!/[｜|]/.test(doc.title0||""))doc.title0=h,doc.title=titleOf(h)||h;continue}
   if(choice&&lvl<=choice.lvl)closeChoice();closeVar();continue}
  if(mode==="en")continue;
  if(!seenBody&&!doc.chapters.length&&!doc.title&&raw.length<40&&!/[：:“”"]/.test(raw)&&!/[。！？]$/.test(raw)){doc.title=titleOf(raw)||raw;continue}
  if(raw.startsWith(">")){raw=raw.replace(/^>+\s*/,"");if(!raw)continue;if(!seenBody&&!doc.chapters.length&&!/[：:]\s*[“"「]/.test(raw))continue;if(/^(状态说明|本文件|不得据此|已完成部分|未完成部分)/.test(raw))continue}
  if(choice&&!opt||choice&&/^([A-E])[.．、:：)）]\s*\S/.test(raw)&&raw.length<60){const m=raw.match(/^([A-E])[.．、:：)）]\s*(.+)$/);if(m){opt={k:m[1],t:imQ(m[2]),then:[]};choice.opts.push(opt);continue}}
  let m=raw.match(/^【(心理|内心|心声|OS|独白|内心独白)】\s*(.*)$/i);if(m){think=true;if(m[2]){push(["@pov","think",imQ(m[2])]);doc.think++;think=false}continue}
  if(/^【[^】]{1,8}】$/.test(raw))continue;
  m=raw.match(/^\*{0,2}([^\s：:“”"「」（）()*]{1,16})\*{0,2}(?:\s*[（(]([^）)]{0,20})[）)])?\s*[：:]\s*(.+)$/);
  if(m&&!IM_NOTNAME.has(m[1])&&!/^\d/.test(m[1])&&(/[“"「]/.test(m[3].slice(0,2))||m[1].length<=8&&m[3].length<160)||m&&m[1]==="旁白"){const nm=m[1],tx=imQ(m[3]);if(nm==="旁白"){imChunks(tx).forEach(c=>push(["n","act",c]));continue}
   const isThink=think||/心声|内心|OS/.test(m[2]||"");doc.sp[nm]=(doc.sp[nm]||0)+1;if(/[“"「]/.test(m[3].slice(0,2)))doc.spq[nm]=(doc.spq[nm]||0)+1;push(["@"+nm,isThink?"think":"say",tx]);if(isThink)doc.think++;think=false;continue}
  if(think&&/^[“"「]/.test(raw)){push(["@pov","think",imQ(raw)]);doc.think++;think=false;continue}
  think=false;imChunks(raw.replace(/\*\*/g,"")).forEach(c=>push(["n","act",c]))}
 closeVar();closeChoice();
 doc.chapters=doc.chapters.filter(c=>c.items.some(x=>Array.isArray(x)?x[0]!=="sys":true));
 if(!doc.title)doc.title=LL("我上传的剧本","My uploaded script");
 /* who does the reader play? the speaker who opens the most choice branches, else the top speaker */
 const votes={};doc.chapters.forEach(c=>c.items.forEach(x=>{if(x.choice)x.choice.opts.forEach(o=>{const f=o.then.find(b=>/^@/.test(b[0])&&b[0]!=="@pov");if(f)votes[f[0].slice(1)]=(votes[f[0].slice(1)]||0)+1})}));
 const anyQ=Object.keys(doc.spq).length>0,top=Object.entries(doc.sp).filter(([n])=>!anyQ||doc.spq[n]||doc.sp[n]>=6).sort((a,b)=>b[1]-a[1]);doc.pov=(Object.entries(votes).sort((a,b)=>b[1]-a[1])[0]||top[0]||[null])[0];
 doc.cast=top.filter(([n,c])=>c>=2&&(!anyQ||doc.spq[n]||c>=6)).slice(0,6).map(x=>x[0]);if(doc.pov&&!doc.cast.includes(doc.pov))doc.cast.unshift(doc.pov);
 doc.lines=Object.values(doc.sp).reduce((a,b)=>a+b,0);doc.choices=doc.chapters.reduce((a,c)=>a+c.items.filter(x=>x.choice).length,0);
 if(!doc.chapters.length)doc.warn.push(LL("没有读到正文。","No story text found."));
 if(!doc.lines)doc.warn.push(LL("没认出对白。对白请写成「名字：“台词”」。","No dialogue found. Write lines as Name: \"line\"."));
 if(!doc.choices)doc.warn.push(LL("没有选择题，每章结尾会是「继续」。可以用「# CHOICE｜问题」加「#### A｜选项」。","No choices found — each chapter will end with Continue. Use # CHOICE｜question and #### A｜option."));
 if(doc.omit)doc.warn.push(LL(doc.omit+" 处露骨内容已省略。",doc.omit+" explicit passages were left out."));
 return doc}
/* ---------- build a MIRU world from the parsed doc ---------- */
function imBuild(doc,as){const now=Date.now(),wid="cw"+now,x0=s=>({en:s,zh:s}),lib=window.STUDIO_LIB||{},keys=Object.keys(lib);
 const ids={};doc.cast.forEach((nm,i)=>{const id="u"+(now+i);ids[nm]=id;
  S.mine.chars[id]={n:nm,age:28,g:"m",h:"",w:wid,pal:[["#C98A6B","#1B1520"],["#7A63C9","#141024"],["#5E9E96","#13212A"]][i%3],a:"charm",v:{pitch:1,rate:1},by:"@"+(me()||"you").toLowerCase(),
   role:x0(i===0&&nm===doc.pov?LL("主角","Lead"):""),looks:x0(""),vibe:x0(""),tells:{en:[],zh:[]},twist:x0(""),likes:x0(""),secret:x0(""),pitch:x0(""),solo:x0("…"),
   studio:{name:nm,age:"28",g:"m",callYou:"",role:"",rel:"",style:"",setting:"",looks:"",vibe:"",tells:"",secret:"",opening:"",gong:[],shou:[],pair:"bl",img:null,chat:[],step:99,filled:{},ver:1}};
  if(keys.length)S.art[id]=lib[keys[i%keys.length]]});
 const pov=as&&as!=="watch"?as:doc.pov,povId=ids[pov]||"n";
 const mapB=b=>{if(b[0]==="sys"){if(b[1]==="if")return ["sys","if",Object.assign({},b[2],{then:b[2].then.map(mapB).filter(Boolean)})];return b}
  if(b[0]==="n")return ["n","act",b[2]];if(b[0]==="@pov")return povId==="n"?["n","act","（"+b[2]+"）"]:[povId,"think",b[2]];
  const nm=b[0].slice(1),id=ids[nm];if(!id)return ["n","act",nm+"："+"“"+b[2]+"”"];return [id,b[1],b[2]]};
 let place="",ci=0;const chs=doc.chapters.map((c,i)=>{const items=c.items.slice();while(items.length&&Array.isArray(items[items.length-1])&&items[items.length-1][3]==="omit"&&false)items.pop();
  const lastIdx=(()=>{for(let j=items.length-1;j>=0;j--){if(items[j].choice)return j;if(Array.isArray(items[j])&&items[j][0]!=="sys")return -1}return -1})();
  const beats=[];let endC=null;items.forEach((x,j)=>{
   if(x.choice){const opts=x.choice.opts.filter(o=>o.t);if(!opts.length)return;if(j===lastIdx){endC=x.choice;return}
    beats.push([povId==="n"?(ids[doc.cast[0]]||"n"):povId,"line",{hint:x.choice.q||LL("你怎么做？","What do you do?"),opts:opts.slice(0,4).map(o=>({k:"say",t:o.t,then:o.then.map(mapB)}))}]);return}
   if(x.variant){if(i===0){if(x.variant.k==="A")x.variant.then.forEach(b=>beats.push(mapB(b)));return}beats.push(mapB(["sys","if",{cond:{pick:[i,x.variant.k]},then:x.variant.then}]));return}
   if(x[0]==="sys"&&x[1]==="scene"){place=x[2].place||place}beats.push(mapB(x))});
  if(!beats.length||beats[0][0]!=="sys"||beats[0][1]!=="scene")beats.unshift(["sys","scene",{place:place||doc.title,time:""}]);
  const opts=endC?endC.opts.filter(o=>o.t).slice(0,4):[];
  const choices=opts.length?opts.map((o,j)=>({k:"ABCD"[j],t:x0(o.t),then:{zh:o.then.map(mapB),en:o.then.map(mapB)},mem:x0(LL("你选择了：","You chose: ")+o.t)})):[{k:"A",t:x0(LL("继续","Continue")),then:{zh:[],en:[]},mem:x0("")}];
  return {t:x0(c.t||LL("第 "+(i+1)+" 章","Chapter "+(i+1))),goal:x0(endC&&endC.q||""),place:x0(place),time:x0(""),ask:x0(endC&&endC.q||LL("你怎么做？","What do you do?")),beats:{zh:beats,en:beats},choices,outline:false}});
 const cast=doc.cast.map(n=>ids[n]),L=ids[pov]&&cast.length>1?cast.find(id=>id!==ids[pov]):cast[0];
 const end=(zh,en)=>({t:{zh,en},txt:x0(""),line:x0("")});
 const firstTxt=(chs[0]&&chs[0].beats.zh.find(b=>b[0]==="n")||[,,""])[2];
 const pack={chapters:chs,endings:{A:end("在一起","Together"),B:end("各自安好","Apart, and okay"),C:end("反目","Enemies")},join:ids[pov]?[{as:ids[pov],t:x0(LL("扮演"+pov,"Play as "+pov))}]:[],pov:null,love:L,
  logline:x0(firstTxt.slice(0,60)),features:{game:x0(""),date:x0(""),gift:x0(""),photo:x0(""),voice:x0(""),room:x0("")},director:{allowed:[],au:[]},bonus:{t:x0(""),d:x0("")},ready:chs.length,mine:1,imported:{at:now,lines:doc.lines,omit:doc.omit},
  card:{title:doc.title,lead:{name:pov||"",role:""},sup:{name:L?S.mine.chars[L].n:"",role:""},place:place,time:"",obj:"",sec:"",con:"",hook:firstTxt.slice(0,60)},
  intro:{zh:{bg:[firstTxt.slice(0,80)].filter(Boolean),you:ids[pov]?"你扮演 "+pov+"。在关键时刻，由你决定他说什么、怎么做。":"你以自己的身份看这个故事。",cast:cast.map(id=>[id,Lz(S.mine.chars[id].role)||""])},
   en:{bg:[firstTxt.slice(0,80)].filter(Boolean),you:ids[pov]?"You play "+pov+". At key moments you decide what he says and does.":"You watch the story as yourself.",cast:cast.map(id=>[id,""])}}};
 S.mine.worlds[wid]={id:wid,or:"bl",pal:cast.length?S.mine.chars[cast[0]].pal:["#C98A6B","#1B1520"],author:"@"+(me()||"you").toLowerCase(),official:false,mine:1,mineAt:now,stats:[0,0,0],heat:"slow",cast,tags:[LL("上传剧本","Uploaded")],
  title:x0(doc.title),hook:x0(firstTxt.slice(0,60)),premise:x0(firstTxt.slice(0,80)),you:x0(ids[pov]?pov:LL("你自己","Yourself")),warn:x0(""),rel:L&&ids[pov]?[[ids[pov],L,x0("")]]:[],status:{time:x0(""),place:x0(place)},pack,cover:null};
 const ps=packSt(wid);ps.own=1;S.works.unshift({id:wid,kind:"story",title:doc.title,at:now,seed:0});save();return {wid,as:ids[pov]||"watch"}}
/* ---------- .docx reader (zip + deflate-raw, no library) ---------- */
async function imDocx(buf){const u8=new Uint8Array(buf),dv=new DataView(buf);let e=-1;for(let i=u8.length-22;i>=Math.max(0,u8.length-66000);i--){if(dv.getUint32(i,true)===0x06054b50){e=i;break}}if(e<0)throw "zip";
 const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);let hit=null;for(let k=0;k<n;k++){const nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true);const name=new TextDecoder().decode(u8.subarray(p+46,p+46+nl));
  if(name==="word/document.xml")hit={m:dv.getUint16(p+10,true),cs:dv.getUint32(p+20,true),off:dv.getUint32(p+42,true)};p+=46+nl+xl+cl}
 if(!hit)throw "nodoc";const lo=hit.off,data=u8.subarray(lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true),lo+30+dv.getUint16(lo+26,true)+dv.getUint16(lo+28,true)+hit.cs);
 let xml;if(hit.m===0)xml=new TextDecoder().decode(data);else{const ds=new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw")));xml=await ds.text()}
 const d=new DOMParser().parseFromString(xml,"application/xml"),W="http://schemas.openxmlformats.org/wordprocessingml/2006/main";
 return [...d.getElementsByTagNameNS(W,"p")].map(pp=>{const st=pp.getElementsByTagNameNS(W,"pStyle")[0],sv=st?st.getAttributeNS(W,"val")||st.getAttribute("w:val")||"":"";const tx=[...pp.getElementsByTagNameNS(W,"t")].map(t2=>t2.textContent).join("");
  const hm=sv.match(/(?:Heading|heading|标题)\s*(\d)/);return (hm&&tx.trim()?"#".repeat(+hm[1])+" ":"")+tx}).join("\n")}
/* ---------- UI ---------- */
let IM=null;
function imOpen(){IM={doc:null,as:null,name:""};imRender()}
function imRender(){const d=IM.doc;let b='<div class="scroll pad stack" style="gap:12px;padding-bottom:30px">';
 if(!d){b+='<label class="imdrop"><input type="file" id="imFile" accept=".md,.markdown,.txt,.docx,.doc,.pdf,.json" hidden><span style="font-size:34px">📄</span><b>'+LL("选择剧本文件","Choose a script file")+'</b><small>'+LL("支持 .md · .txt · .docx · .doc · .pdf · 创作中心导出的 .json，最大 10MB","Supports .md · .txt · .docx · .doc · .pdf · Creator .json, up to 10MB")+'</small></label>'+
  '<div class="card"><b style="font-size:14px">'+LL("或者直接粘贴","Or paste it")+'</b><textarea id="imTxt" rows="6" class="imta" placeholder="'+esc(LL("# CHAPTER 1｜标题\n# SCENE｜地点\n正文……\nRoman：“台词”\n# CHOICE｜问题\n#### A｜“选项”","# CHAPTER 1｜Title\n# SCENE｜Place\nNarration…\nRoman: \"line\"\n# CHOICE｜Question\n#### A｜\"Option\""))+'"></textarea><button class="btn btn-p btn-block" style="margin-top:8px" data-imparse="1">'+LL("解析","Convert")+'</button></div>'+
  '<button class="btn btn-g btn-block" data-imrules="1">📘 '+LL("MIRU 标准剧本格式 · 下载模板","MIRU script format · download template")+'</button>'+
  '<p class="xs faint" style="line-height:1.6">'+LL("按 MIRU 标准规则自动转换：章节、场景、对白、心声、选择和分支都会变成可玩的剧。转换免费。所有角色须为成年人；露骨内容会被省略。","Converted by MIRU's standard rules: chapters, scenes, dialogue, inner voice, choices and branches become a playable story. Free. All characters must be adults; explicit passages are left out.")+'</p>'}
 else{const chip=(v,l)=>'<button class="chip'+(IM.as===v?" on":"")+'" data-imas="'+esc(v)+'">'+esc(l)+'</button>';
  b+='<div class="card"><div class="eyebrow" style="color:var(--gold)">✓ '+LL("解析完成","Converted")+(IM.name?' · '+esc(IM.name):'')+'</div><input id="imTitle" class="iminp" value="'+esc(d.title)+'">'+
   '<div class="imstats">'+[[d.chapters.length,LL("章","chapters")],[d.scenes,LL("场景","scenes")],[d.lines,LL("句对白","lines")],[d.choices,LL("个选择","choices")],[d.think,LL("段心声","thoughts")]].map(([n,l])=>'<span><b>'+n+'</b>'+l+'</span>').join("")+'</div></div>'+
   '<div class="card"><b style="font-size:14px">'+LL("人物","Cast")+'</b><p class="xs faint" style="margin-top:3px">'+d.cast.map(n=>esc(n)+" ×"+d.sp[n]).join(" · ")+'</p><b style="font-size:14px;display:block;margin-top:10px">'+LL("你扮演谁？","Who do you play?")+'</b><div class="row" style="flex-wrap:wrap;gap:6px;margin-top:6px">'+d.cast.map(n=>chip(n,n)).join("")+chip("watch",LL("👁 旁观","👁 Watch"))+'</div></div>'+
   '<div class="card"><b style="font-size:14px">'+LL("章节","Chapters")+'</b>'+d.chapters.map((c,i)=>{const nb=c.items.length,nc2=c.items.filter(x=>x.choice).length;return '<div class="imch"><i>'+(i+1)+'</i><span class="grow">'+esc(c.t||LL("第 "+(i+1)+" 章","Chapter "+(i+1)))+'</span><small>'+nb+LL(" 段"," parts")+(nc2?' · '+nc2+LL(" 个选择"," choices"):'')+'</small></div>'}).join("")+'</div>'+
   (d.warn.length?'<div class="card imwarn">'+d.warn.map(w=>'<p>⚠️ '+esc(w)+'</p>').join("")+'</div>':'')+
   '<button class="btn btn-p btn-block" data-imgo="play">▶ '+LL("生成并试玩 · 免费","Build & play · free")+'</button><button class="btn btn-g btn-block" data-imgo="work">🛠 '+LL("生成后去工作台改","Build & open the Workbench")+'</button><button class="btn btn-g btn-block" data-imreset="1">↺ '+LL("换一个文件","Use another file")+'</button>'}
 screen("s-cimp",'<div class="topbar"><button class="ibtn" data-back="1">'+ic("back")+'</button><h2 class="grow" style="font-size:17px">📄 '+LL("上传剧本","Upload a script")+'</h2></div>'+b+'</div>');show("s-cimp")}
function imLoad(text,name){const d=imParse(text);if(!d.chapters.length){toast(LL("没读到正文，检查一下格式？","No story text found — check the format?"));return}IM.doc=d;IM.as=d.pov||"watch";IM.name=name||"";imRender()}
document.addEventListener("change",async e=>{if(e.target.id!=="imFile"||!e.target.files||!e.target.files[0])return;const f=e.target.files[0];
 if(f.size>10e6){toast(LL("文件太大（最大 10MB）","File too large (max 10MB)"));return}
 try{if(/\.docx$/i.test(f.name)){imLoad(await imDocx(await f.arrayBuffer()),f.name);return}
  const txt=await f.text();if(/\.json$/i.test(f.name)){const o=JSON.parse(txt);if(o&&o.story&&o.project){const wid=crPublish(o.story,o.project,o.sourcebook||[]);toast(LL("已导入创作中心作品","Creator project imported"));packStart(wid,crAs(o.project,wd(wid)));return}toast(LL("这个 JSON 不是创作中心导出的作品","This JSON isn't a Creator export"));return}
  imLoad(txt,f.name)}catch(_){toast(LL("读不出这个文件，可能已损坏或加了密码","Couldn't read this file — it may be damaged or password-protected"))}});
const IM_TPL="# 我的剧名｜MY STORY\n\n# CHAPTER 1｜第一章标题\n\n# SCENE 01｜纽约 · 深夜公寓\n\n门开了。他站在雨里，没有进来。\n\nRoman：“你还没睡。”\nAdrian：“你也没走。”\n\n【心理】\n> “他为什么偏偏今晚回来？”\n\n# CHOICE 01｜让他进来吗？\n\n#### A｜“进来吧。”\nAdrian侧身让开。\nRoman：“谢谢。”\n\n#### B｜“有话就在门口说。”\nRoman没有动。\nRoman：“好。”\n\n# CHAPTER 2｜第二章标题\n\n#### 入口A｜上一章让他进门了\n他坐在你的沙发上，外套还在滴水。\n\n#### 入口B｜上一章让他留在门口\n第二天早上，门口放着一把伞。\n\n# SCENE 02｜咖啡店\n……\n";
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-imparse]")){const v=($("#imTxt")||{}).value||"";if(v.trim().length<20){toast(LL("先粘贴剧本内容","Paste the script first"));return}imLoad(v,"");return}
 if(x=e.target.closest("[data-imas]")){IM.as=x.dataset.imas;imRender();return}
 if(e.target.closest("[data-imreset]")){IM={doc:null,as:null,name:""};imRender();return}
 if(e.target.closest("[data-imrules]")){sheet('<h2>📘 '+LL("MIRU 标准剧本格式","MIRU script format")+'</h2><div class="imrules">'+[
   ["# CHAPTER 1｜标题","第几章；也可以写「第一章 标题」"],["# SCENE 01｜地点","新场景，地点会显示在顶部"],["正文段落","旁白 / 动作描写，一段一个气泡"],["Roman：“台词”","对白；名字出现 2 次以上会自动成为角色"],
   ["【心理】 + 下一行 “……”","心声（你扮演的角色）"],["# CHOICE｜问题","选择题；一章里最后一个是章末选择，前面的是剧情中的选择"],["#### A｜“选项”","选项，下面的内容是选了之后发生的事"],["#### 入口A｜说明","只有上一章结尾选了 A 才会播放"],["[EN] … [ZH]","[EN] 段落会被跳过"]].map(r=>'<div><code>'+esc(r[0])+'</code><span>'+esc(r[1])+'</span></div>').join("")+'</div>'+
   '<button class="btn btn-p btn-block" style="margin-top:12px" data-imtpl="1">⬇ '+LL("下载格式模板 .md","Download template .md")+'</button><button class="btn btn-g btn-block" style="margin-top:8px" data-imtry="1">'+LL("用模板试一下","Try the template")+'</button>');return}
 if(e.target.closest("[data-imtpl]")){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([IM_TPL],{type:"text/markdown"}));a.download="MIRU_剧本模板.md";document.body.appendChild(a);a.click();a.remove();return}
 if(e.target.closest("[data-imtry]")){closeSheet();imLoad(IM_TPL,"MIRU_剧本模板.md");return}
 if(x=e.target.closest("[data-imgo]")){const d=IM.doc;if(!d)return;const ti=$("#imTitle");if(ti&&ti.value.trim())d.title=ti.value.trim();const r=imBuild(d,IM.as);IM=null;toast(LL("已生成《","Built “")+d.title+LL("》","”"));
  if(x.dataset.imgo==="work"){cWork(r.wid,"chs");return}packStart(r.wid,r.as);return}});
/* hub entry */
const _crHub51=crHub;crHub=function(){_crHub51();try{const st=$(".sheet .stack");const g=st&&st.querySelector('[data-crh="quick"]');if(g)g.insertAdjacentHTML("afterend",'<button class="opt crhopt" data-crh="upload"><span class="ic">📄</span><span class="grow"><b>'+LL("上传剧本文件","Upload a script")+'</b><span>'+LL(".md / .txt / .docx / .doc / .pdf，按 MIRU 标准规则转成能玩的剧 · 免费",".md / .txt / .docx → a playable story by MIRU's rules · free")+'</span></span><span style="color:var(--gold)">›</span></button>')}catch(_){}};
document.addEventListener("click",e=>{if(e.target.closest('[data-crh="upload"]')){e.stopImmediatePropagation();closeSheet();imOpen()}},true);
(function(){const st=document.createElement("style");st.textContent=`
.imdrop{display:flex;flex-direction:column;align-items:center;gap:6px;padding:26px 16px;border-radius:18px;border:1.5px dashed rgba(240,183,126,.55);background:rgba(240,183,126,.06);cursor:pointer;text-align:center}
.imdrop b{font-size:16px}.imdrop small{font-size:12px;color:#aaa}.imta{width:100%;margin-top:8px;background:var(--panel2);border:1px solid var(--line);border-radius:12px;color:#fff;padding:10px;font-size:13px;line-height:1.5;resize:vertical}
.iminp{width:100%;margin-top:6px;background:transparent;border:0;border-bottom:1px solid var(--line);color:#fff;font-size:19px;font-weight:800;padding:4px 0}
.imstats{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.imstats span{font-size:12px;color:#bbb;background:var(--panel2);border-radius:10px;padding:5px 9px}.imstats b{color:var(--gold);margin-right:3px;font-size:14px}
.imch{display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid var(--line);font-size:13px}.imch i{font-style:normal;font-weight:900;color:var(--gold);width:22px}.imch small{color:#999;font-size:11px;white-space:nowrap}
.imwarn p{font-size:12.5px;line-height:1.5;color:#F7D2A8;margin:2px 0}
.imrules{display:flex;flex-direction:column;gap:7px;margin-top:10px}.imrules div{display:flex;flex-direction:column;gap:2px;padding:8px 10px;border-radius:10px;background:var(--panel2)}.imrules code{font-size:12.5px;color:var(--gold)}.imrules span{font-size:12px;color:#bbb}`;document.head.appendChild(st)})();
