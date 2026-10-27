/* ================= "write your own" for every story-steering feature =================
   Director events (jealousy / secret / fight / confession / drunk / alone / 2AM / place / third person),
   event cards, gifts and dates: the reader can still tap a preset, but can also type exactly what happens. */
const DIR_HINTS={
 jealous:{zh:["他看到对方在给别人擦头发","有人往对方口袋里塞了电话号码","他听见对方叫别人“宝贝”"],en:["He sees them drying someone else's hair","Someone slips a phone number into their pocket","He hears them call someone else 'babe'"],ph:{zh:"他看到了什么？比如：Theo 在给 Rowan 擦头发",en:"What does he see? e.g. Theo drying Rowan's hair"}},
 secret:{zh:["他一直留着对方五年前的演出票根","他早就知道合同的事，一直没说","他手机里存着一张不敢发出去的照片"],en:["He kept their ticket stub from five years ago","He knew about the contract all along","There's a photo on his phone he never dared send"],ph:{zh:"写下这个秘密，比如：他偷偷留着对方的旧外套",en:"Write the secret, e.g. he still has their old jacket"}},
 fight:{zh:["为了那晚他没来","为了谁先不联系谁","为了一句说出口就收不回的话"],en:["Over the night he didn't show","Over who stopped calling first","Over something that can't be unsaid"],ph:{zh:"为了什么吵？比如：为了五年前那张没寄出的信",en:"What's the fight about?"}},
 confess:{zh:["借着酒劲说：“我等你等了五年”","写在杯垫上推过去","话说一半被人打断"],en:["Drunk: 'I've waited five years for you'","Writes it on a coaster and slides it over","Gets cut off halfway"],ph:{zh:"他会怎么说？可以直接写台词",en:"How does he say it? You can write the exact line"}},
 drunk:{zh:["说出他其实不想走","赖在对方肩上不肯起来","把对方的名字叫成了昵称"],en:["Admits he doesn't want to leave","Won't get off their shoulder","Calls them by a pet name"],ph:{zh:"喝醉后他说了/做了什么？",en:"What does he say or do drunk?"}},
 alone:{zh:["被锁在储藏间里","只剩一把伞，一起走回家","停电，只剩一支蜡烛"],en:["Locked in the storeroom","One umbrella, walking home together","Blackout, one candle left"],ph:{zh:"他们俩在哪、怎么独处？",en:"Where are they, and how?"}},
 night:{zh:["两个人都睡不着，在吧台碰见","他发来一条只有“在吗”的消息","窗外雨停了，谁都没走"],en:["Neither can sleep — they meet at the bar","He texts just 'you up?'","The rain stops. Nobody leaves."],ph:{zh:"凌晨 2 点发生了什么？",en:"What happens at 2 AM?"}},
 place:{zh:[],en:[],ph:{zh:"在这里会发生什么？（可不填）",en:"What happens here? (optional)"}},
 third:{zh:["他是其中一个人的前任","他手里拿着一份合同","他一进门就叫了某人的小名"],en:["He's one of their exes","He's holding a contract","He walks in calling someone by a nickname"],ph:{zh:"这个人是谁、来干什么？",en:"Who is he, and why is he here?"}}};
let DIR_DETAIL="";
const _dirRun7=dirRun;
dirRun=function(v,who,extra){const H=DIR_HINTS[v.k]||{},L=S.lang==="zh"?"zh":"en",n=who&&ch(who)?first(ch(who).n):"";dirRun.s={v,who,extra};
 sheet('<div class="eyebrow" style="color:var(--gold)">🎬 '+t("dr.h")+'</div><h2 style="margin-top:4px">'+t("dr."+v.k)+(n?' · '+esc(n):'')+(extra?' · '+esc(extra):'')+'</h2>'+
  '<p class="xs dim" style="margin-top:6px">'+t("cu.how")+'</p><textarea id="drDetail" rows="3" class="cutxt" placeholder="'+esc((H.ph||{})[L]||t("dr.own"))+'"></textarea>'+
  ((H[L]||[]).length?'<div class="cuchips">'+H[L].map(x=>'<button data-cufill="'+esc(x)+'">'+esc(x)+'</button>').join("")+'</div>':'')+
  '<div class="row" style="gap:8px;margin-top:14px"><button class="btn btn-g grow" data-drgo="0">'+t("cu.surprise")+'</button><button class="btn btn-p grow" data-drgo="1">🎬 '+t("cu.go")+'</button></div>')};
/* the detail rides along with whichever path the original director uses (normal chat or watch mode) */
const _doSend7=doSend;doSend=function(txt,mode){if(DIR_DETAIL&&mode==="dir")txt=txt+(S.lang==="zh"?" 具体：":" Specifically: ")+DIR_DETAIL;return _doSend7(txt,mode)};
const _reply7=reply;reply=function(th,ctx,silent){if(DIR_DETAIL&&ctx&&ctx.kind==="watch")ctx=Object.assign({},ctx,{txt:ctx.txt+" Specifically: "+DIR_DETAIL});return _reply7(th,ctx,silent)};
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-cufill]")){const ta=$("#drDetail,#cuTxt");if(ta){ta.value=x.dataset.cufill;ta.focus()}return}
 if(x=e.target.closest("[data-drgo]")){const s=dirRun.s;if(!s)return;DIR_DETAIL=x.dataset.drgo==="1"?(($("#drDetail")||{}).value||"").trim():"";
  try{_dirRun7(s.v,s.who,s.extra)}finally{DIR_DETAIL=""}return}},true);
/* own place / own newcomer */
const _dirPlace7=dirPlace;dirPlace=function(cb){_dirPlace7(cb);const g=$(".drplaces");if(g)g.insertAdjacentHTML("afterend",'<div class="drfree"><input id="cuPlace" placeholder="'+esc(t("cu.place"))+'"><button class="btn btn-p btn-sm" data-cuplace="1">→</button></div>')};
const _dirThird7=dirThird;dirThird=function(cb){_dirThird7(cb);const g=$(".drpick");if(g)g.insertAdjacentHTML("afterend",'<div class="drfree"><input id="cuThird" placeholder="'+esc(t("cu.third"))+'"><button class="btn btn-p btn-sm" data-cuthird="1">→</button></div>')};
document.addEventListener("click",e=>{
 if(e.target.closest("[data-cuplace]")){const v=(($("#cuPlace")||{}).value||"").trim();if(v&&dirPlace.cb)dirPlace.cb(v);return}
 if(e.target.closest("[data-cuthird]")){const v=(($("#cuThird")||{}).value||"").trim();if(v&&dirThird.cb){const s=DIR_EV.find(d=>d.k==="third");dirRun(s,null,v)}return}});

/* event card / gift / date: a custom line under the presets */
function cuRow(id,ph,btn){return '<div class="drfree"><input id="'+id+'" placeholder="'+esc(ph)+'"><button class="btn btn-p btn-sm" data-'+id+'="1">'+btn+'</button></div>'}
const _cardSheet7=cardSheet;cardSheet=function(){_cardSheet7();const c=$("#cards");if(c)c.insertAdjacentHTML("afterend",'<p class="xs dim" style="margin-top:12px">'+t("cu.cardH")+'</p>'+cuRow("cuCard",t("cu.cardPh"),"🎬 💎"+PRICES.card))};
const _giftSheet7=giftSheet;giftSheet=function(){_giftSheet7();const c=$(".sheet-card");if(c)c.insertAdjacentHTML("beforeend",'<p class="xs dim" style="margin-top:12px">'+t("cu.giftH")+'</p>'+cuRow("cuGift",t("cu.giftPh"),"🎁 💎1"))};
const _dateSheet7=dateSheet;dateSheet=function(){_dateSheet7();const c=$(".sheet-card");if(c)c.insertAdjacentHTML("beforeend",cuRow("cuDate",t("cu.datePh"),"🌙"))};
document.addEventListener("click",e=>{const th=S.threads[curT];if(!th)return;let v;
 if(e.target.closest("[data-cuCard],[data-cucard]")){v=(($("#cuCard")||{}).value||"").trim();if(!v)return;if(!spend(PRICES.card,"event"))return;closeSheet();
  appendMsg(th,{who:"sys",k:"card",title:"🃏 "+t("cu.cardT"),txt:v,at:Date.now()});reply(th,{kind:"card",txt:v});return}
 if(e.target.closest("[data-cuGift],[data-cugift]")){v=(($("#cuGift")||{}).value||"").trim();if(!v)return;if(!spend(1,"gift"))return;const m=mainOf(th);closeSheet();
  loveWrite(th,m,5,"gift");th.tasks.gift=1;th.mem.push(me()+" gave "+ch(m).n+" "+v);
  appendMsg(th,{who:"sys",k:"card",title:"🎁 "+t("cx.m.gift"),txt:t("gift.given",{n:first(ch(m).n),g:v}),at:Date.now()});reply(th,{kind:"gift",txt:v,cid:m});return}
 if(e.target.closest("[data-cuDate],[data-cudate]")){v=(($("#cuDate")||{}).value||"").trim();if(!v)return;const m=mainOf(th);closeSheet();
  th.tasks.date=1;loveWrite(th,m,6,"date");th.status.place=v;th.mem.push(me()+" took "+ch(m).n+" to "+v);
  appendMsg(th,{who:"sys",k:"card",title:"🌙 "+t("cx.m.date"),txt:t("date.go",{n:first(ch(m).n),p:v}),at:Date.now()});reply(th,{kind:"date",txt:v,cid:m});return}});
Object.assign(I18N.en,{"cu.how":"Tap a suggestion, write exactly what happens, or leave it empty and let the story surprise you.","cu.go":"Action","cu.surprise":"Surprise me","cu.place":"Or type any place…","cu.third":"Or describe someone new: who, and why they're here",
 "cu.cardH":"Or write your own twist","cu.cardPh":"e.g. His ex walks in holding a ring","cu.cardT":"Your twist","cu.giftH":"Or give something only you would think of","cu.giftPh":"e.g. The coaster I kept from our first night","cu.datePh":"Or anywhere you like…"});
Object.assign(I18N.zh,{"cu.how":"点一个建议、自己写具体发生什么，或者留空让剧情给你惊喜。","cu.go":"开演","cu.surprise":"随机发挥","cu.place":"或者自己写一个地点……","cu.third":"或者自己写一个新人物：是谁、来干嘛",
 "cu.cardH":"或者自己写一个突发事件","cu.cardPh":"比如：他的前任拿着戒指推门进来","cu.cardT":"你写的事件","cu.giftH":"或者送一样只有你想得到的东西","cu.giftPh":"比如：我们第一晚留下的那张杯垫","cu.datePh":"或者自己写想去的地方……"});

/* ================= one bubble per spoken line =================
   Everything that leads up to a line — narration, actions, inner voice, a sudden event — sits on top in small,
   lighter, colour-coded text; the line itself is at the bottom, big and bright. Context with no line after it
   (e.g. right before your choice) stays in a plain context box. */
function pkPart(th,part,txt){const i=th.msgs.length-1,L=th.msgs[i];
 if(L&&L.k==="box"&&L.pk&&!L.say&&L.parts.length<7){L.parts.push(part);L.txt+=" "+txt;th.at=Date.now();save();const el=$('#msgs [data-mi="'+i+'"]');if(el&&curT===th.id){el.outerHTML=msgHTML(L,i,th);scrollChat()}return}
 appendMsg(th,{who:"n",k:"box",pk:1,parts:[part],txt,last:txt,lastWho:part.who,at:Date.now()})}
const _pkAppend8=pkAppend;
pkAppend=function(th,m){const i=th.msgs.length-1,L=th.msgs[i];
 if(m&&m.pk&&m.k==="say"&&ch(m.who)&&m.who!=="me"&&L&&L.k==="box"&&L.pk&&!L.say){L.say={who:m.who,txt:m.txt};L.last=m.txt;L.lastWho=m.who;th.at=Date.now();save();
  if(curT===th.id){chatBgSet(m.who,poseOf(m));const el=$('#msgs [data-mi="'+i+'"]');if(el){el.outerHTML=msgHTML(L,i,th);scrollChat()}if(S.autoVoice&&m.k==="say"&&!m._voiced){m._voiced=1;speak(m.txt,m.who)}}return}
 return _pkAppend8(th,m)};
const _pkDir8=pkDirective;
pkDirective=function(th,b){if(Array.isArray(b)&&b[0]==="sys"&&b[1]==="event"){th.pk.q.shift();const d=b[2]||{};
  pkPart(th,{who:"sys",k:"event",icon:d.icon||"⚡",title:d.title||"",txt:d.txt||""},(d.title||"")+" "+(d.txt||""));try{navigator.vibrate&&navigator.vibrate(60)}catch(_){}save();return true}
 return _pkDir8(th,b)};
function partHTML(p){if(p.k==="event")return '<p class="tp ev"><span class="tpe">'+esc(p.icon)+' '+esc(p.title)+'</span>'+(p.txt?esc(p.txt):'')+'</p>';
 if(p.who==="n")return '<p class="tp n">'+esc(p.txt)+'</p>';const c=ch(p.who),nm=c?first(c.n):"";
 return p.k==="think"?'<p class="tp th"><span class="tpt">💭 '+esc(nm)+'</span>'+esc(p.txt)+'</p>':'<p class="tp ac"><span class="tpa">✱ '+esc(nm)+'</span>'+esc(p.txt)+'</p>'}
const _boxHTML8=boxHTML;
boxHTML=function(m,i,th){if(!m.say)return '<div class="m-box ctx" data-mi="'+i+'">'+m.parts.map(partHTML).join("")+'</div>';
 const c=ch(m.say.who);
 return '<div class="m-turn" data-mi="'+i+'">'+avatar(m.say.who,32)+'<div class="tb"><div class="tn" style="color:'+(c?c.pal[0]:"")+'">'+esc(c?first(c.n):"")+'</div>'+
  (m.parts.length?'<div class="tctx">'+m.parts.map(partHTML).join("")+'</div>':'')+'<div class="tsay">'+fmtMix(esc(m.say.txt))+'</div></div></div>'};
const _speakLine8=speakLine;speakLine=function(m,done){if(m&&m.k==="box"&&m.say){try{speak(m.say.txt,m.say.who,done)}catch(_){done()}return}return _speakLine8(m,done)};
Object.assign(I18N.zh,{"st3.lgSay":"台词气泡","st3.lgSayD":"一句话一个气泡：最下面大字是他说的话，上面小字是当时的动作、心声、旁白","st3.lgAct":"✱ 动作","st3.lgActD":"橙色斜体：谁做了什么","st3.lgThink":"心声","st3.lgThinkD":"紫色斜体：心里想的，别人听不见","st3.lgN":"旁白","st3.lgND":"灰色小字：在哪、发生了什么","st3.lgEv":"大事件","st3.lgEvD":"红色标签：剧情突然转折"});
Object.assign(I18N.en,{"st3.lgSay":"Line bubble","st3.lgSayD":"one bubble per line: the big text at the bottom is what they say, the small text above is what's happening","st3.lgAct":"✱ Action","st3.lgActD":"orange italics: what someone does","st3.lgThink":"Inner voice","st3.lgThinkD":"purple italics: what they think","st3.lgN":"Narration","st3.lgND":"small grey text: where, what happens","st3.lgEv":"Event","st3.lgEvD":"red tag: a sudden twist"});
/* plain story lines use the same bubble as lines with context */
const _msgHTML9=msgHTML;
msgHTML=function(m,i,th){if(m&&m.pk&&m.k==="say"&&ch(m.who)&&m.who!=="me"&&!(th&&th.pk&&m.who===th.pk.as))return boxHTML({k:"box",parts:[],say:{who:m.who,txt:m.txt}},i,th);return _msgHTML9(m,i,th)};

/* ================= games really feed the story =================
   1) the result of a game is written into the lines that follow ({bpm}, {mine}, {score} are filled with what you actually got)
   2) the story's truth-or-dare is the story's own bottle: it lands where the scene needs, and the question shown is the scene's question */
function fillVals(x,V){if(typeof x==="string")return x.replace(/\{(bpm|mine|score|pct|n)\}/g,(a,k)=>V[k]!=null?V[k]:a);if(Array.isArray(x))return x.map(y=>fillVals(y,V));if(x&&typeof x==="object"){const o={};for(const k in x)o[k]=fillVals(x[k],V);return o}return x}
featDone=function(th,ctx){const f=PKFEAT;if(!f||f.th!==th)return false;PKFEAT=null;const d=f.d,txt=String(ctx&&ctx.txt||"");let win=true,V={};
 if(f.k==="quiz"){V.score=qz?qz.score:0;win=V.score>=3}
 if(f.k==="lie")win=/caught/.test(txt);
 if(f.k==="heart"){const m=txt.match(/to (\d+) bpm/);V.bpm=m?+m[1]:150;V.mine=Math.max(88,Math.min(V.bpm-24,96+(V.bpm%17)));win=V.bpm>=150}
 const extra=fillVals((win?d.win:d.lose)||d.then||[],V);setTimeout(()=>stopResolve(th,extra),500);return true};
function storyBottle(th,d){const L=x=>Lz(x)||x,me=th.pk.as,lands=d.lands||me,asker=d.asker||d.cid,seat=th.cast.filter(c=>ch(c)).slice(0,6);
 const idx=Math.max(0,seat.indexOf(lands)),ang=360/seat.length;
 sheet('<h2>'+t("g.bottle")+'</h2><div class="sbtl">'+seat.map((c,i)=>{const a=(i*ang-90)*Math.PI/180;return '<div class="sbp" style="left:'+(50+40*Math.cos(a))+'%;top:'+(50+40*Math.sin(a))+'%">'+avatar(c,40)+'<b>'+esc(c===me?t("sb.you"):first(ch(c).n))+'</b></div>'}).join("")+
  '<div class="sbb" id="sbb">🍾</div></div><div id="sbOut" class="sbout"></div>');
 const b=$("#sbb");requestAnimationFrame(()=>{b.style.transition="transform 2.4s cubic-bezier(.2,.8,.2,1)";b.style.transform="translate(-50%,-50%) rotate("+(1440+idx*ang)+"deg)"});
 setTimeout(()=>{const o=$("#sbOut");if(!o)return;o.innerHTML='<p class="sm">'+t("sb.land",{n:lands===me?t("sb.you"):first(ch(lands).n)})+'</p>'+(d.q?'<div class="card" style="margin-top:8px"><div class="eyebrow" style="color:var(--gold)">'+esc(first(ch(asker).n))+' '+t("sb.asks")+'</div><p style="margin-top:6px;font-size:16px;font-weight:700">“'+esc(L(d.q))+'”</p></div>':'')+'<button class="btn btn-p btn-block" style="margin-top:12px" data-sbok="1">'+t("sb.ok")+'</button>'},2500)}
FEATK.bottle.run=()=>{const th=S.threads[curT];if(th&&PKFEAT)storyBottle(th,PKFEAT.d)};
document.addEventListener("click",e=>{if(!e.target.closest("[data-sbok]"))return;const th=S.threads[curT];closeSheet();if(!th||!PKFEAT)return;const d=PKFEAT.d;PKFEAT=null;stopResolve(th,d.win||d.then||[])});
Object.assign(I18N.zh,{"sb.you":"你","sb.land":"瓶口停下，正对着——{n}。","sb.asks":"问你：","sb.ok":"回答"});
Object.assign(I18N.en,{"sb.you":"You","sb.land":"The bottle stops, pointing straight at… {n}.","sb.asks":"asks you:","sb.ok":"Answer"});

/* ================= relationship bar under the header =================
   The person you're falling for first (stage + bar + number), then everyone else, scrolling sideways.
   It moves the moment a choice / gift / game changes how they feel, with a floating +N. Tap to open the full relationship panel. */
function relList(th){const as=th.pk&&th.pk.as,w=wd(th.wid),lv=w&&w.pack&&w.pack.love;return th.cast.filter(c=>ch(c)&&c!==as).sort((a,b)=>(b===lv)-(a===lv)||(th.love[b]||0)-(th.love[a]||0))}
function relRowHTML(th){const L=relList(th);if(!L.length)return "";
 return '<div class="relrow" data-relrow="1">'+L.map((c,i)=>{const v=Math.round(th.love[c]||0),st=stageOf(th,c),nx=STAGE_MIN[st+1],pc=nx?Math.max(4,Math.min(100,(v-STAGE_MIN[st])/(nx-STAGE_MIN[st])*100)):100;
  return '<button class="relc'+(i?'':' main')+'" data-relc="'+c+'">'+avatar(c,22)+'<b>'+esc(first(ch(c).n))+'</b><em>'+t("stage."+st)+'</em><span class="rlb"><i style="width:'+pc+'%"></i></span><span class="relv num">'+v+'</span></button>'}).join("")+'</div>'}
function relSync(th){if(!th||curT!==th.id)return;const r=$(".relrow");const old={};if(r)$$(".relc",r).forEach(b=>old[b.dataset.relc]=+$(".relv",b).textContent);
 const h=relRowHTML(th);if(r)r.outerHTML=h;else{const s=$(".status");if(s)s.insertAdjacentHTML("beforebegin",h)}
 Object.keys(old).forEach(c=>{const d=Math.round(th.love[c]||0)-old[c];if(!d)return;const b=$('.relc[data-relc="'+c+'"]');if(!b)return;
  b.classList.add(d>0?"up":"down");b.insertAdjacentHTML("beforeend",'<span class="relf '+(d>0?"up":"down")+'">'+(d>0?"+":"")+d+'</span>');setTimeout(()=>{b.classList.remove("up","down");const f=$(".relf",b);if(f)f.remove()},1600)})}
const _renderChat10=renderChat;
renderChat=function(){_renderChat10.apply(this,arguments);const th=S.threads[curT];if(!th||!th.pk)return;
 const s=$(".status");if(s){[...s.children].forEach(x=>{if(!x.classList.contains("pairchip")&&/♥/.test(x.textContent))x.remove()});const pc=s.querySelector(".pairchip");if(pc)pc.remove()}
 relSync(th)};
const _stopResolve10=stopResolve;stopResolve=function(th,extra){const r=_stopResolve10(th,extra);setTimeout(()=>relSync(th),60);return r};
const _packAfterPick10=packAfterPick;packAfterPick=function(th,k){const r=_packAfterPick10(th,k);setTimeout(()=>relSync(th),60);return r};
document.addEventListener("click",e=>{const x=e.target.closest("[data-relc]");if(!x)return;const th=S.threads[curT];if(!th)return;const c=x.dataset.relc,v=Math.round(th.love[c]||0),st=stageOf(th,c),nx=STAGE_MIN[st+1];
 sheet('<div class="row" style="gap:12px">'+avatar(c,52)+'<div class="grow"><h2>'+esc(ch(c).n)+'</h2><p class="xs dim" style="margin-top:4px">'+t("stage."+st)+' · <span class="num">'+v+'</span>'+(nx?' · '+t("rb.next",{n:nx-v,s:t("stage."+(st+1))}):'')+'</p></div></div>'+
  '<div class="rlb big"><i style="width:'+(nx?Math.max(4,(v-STAGE_MIN[st])/(nx-STAGE_MIN[st])*100):100)+'%"></i></div><p class="sm dim" style="margin-top:12px;line-height:1.6">'+t("rb.how")+'</p>')});
Object.assign(I18N.zh,{"rb.next":"再 {n} 点到「{s}」","rb.how":"你的选择、送的礼物、小游戏的结果都会改变他对你的感觉。真心的话加分，伤人的话减分。"});
Object.assign(I18N.en,{"rb.next":"{n} more to “{s}”","rb.how":"Your choices, gifts and game results all change how he feels about you. Honest moments raise it; cruel ones drop it."});

/* ================= relationship map: who is what to whom ================= */
function relGraph(w){const R=(w.rel||[]).filter(r=>ch(r[0])&&ch(r[1]));if(!R.length)return "";
 const ids=[...new Set(R.flatMap(r=>[r[0],r[1]]))],W0=340,H0=300,cx=W0/2,cy=H0/2,rx=122,ry=108,P={};
 const lv=w.pack&&w.pack.love,pov=w.pack&&w.pack.pov;
 ids.forEach((id,i)=>{const a=-Math.PI/2+i*2*Math.PI/ids.length;P[id]=[cx+rx*Math.cos(a),cy+ry*Math.sin(a)]});
 const L=x=>esc(Lz(x)||"");
 let e="";R.forEach(([a,b,lab],k)=>{const[x1,y1]=P[a],[x2,y2]=P[b],main=(a===pov&&b===lv)||(a===lv&&b===pov),mx=(x1+x2)/2,my=(y1+y2)/2;
  e+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="rge'+(main?" main":"")+'"/>';
  e+='<foreignObject x="'+(mx-62)+'" y="'+(my-13)+'" width="124" height="26"><div class="rgl'+(main?" main":"")+'">'+L(lab)+'</div></foreignObject>'});
 let n="";ids.forEach(id=>{const[x,y]=P[id],c=ch(id),you=id===pov;
  n+='<foreignObject x="'+(x-34)+'" y="'+(y-30)+'" width="68" height="70"><div class="rgn'+(id===lv?" lv":"")+(you?" you":"")+'"><img src="'+esc(artSrc(id))+'" alt=""><b>'+esc(first(c.n))+(you?' · '+t("st2.isYou"):'')+'</b></div></foreignObject>'});
 return '<div class="rgraph"><div class="eyebrow">'+t("rg.h")+'</div><svg viewBox="0 0 '+W0+' '+H0+'" width="100%">'+e+n+'</svg></div>'}
const _introHTML11=introHTML;
introHTML=function(th){const h=_introHTML11(th),g=relGraph(wd(th.wid),th&&th.pk&&th.pk.as);if(!g)return h;const k=h.indexOf('<div class="mi-sec"><div class="eyebrow">'+t("st2.how"));
 return k>0?h.slice(0,k)+'<div class="mi-sec">'+g+'</div>'+h.slice(k):h};
const _openStory11=openStory;
openStory=function(id,keep,quest){const r=_openStory11.apply(this,arguments);try{const w=wd(id),g=relGraph(w);const card=$('#s-story .bonusc');
 if(g&&card&&!$("#s-story .rgraph"))card.insertAdjacentHTML("afterend",'<div style="margin-top:14px">'+g+'</div>')}catch(_){}return r};
Object.assign(I18N.zh,{"rg.h":"人物关系"});Object.assign(I18N.en,{"rg.h":"Who's who to whom"});
