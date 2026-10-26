/* ================= THREADS ================= */
const STAGE_MIN=MIRU_TUNE.love.stageMin;
function stageOf(th,cid){const lv=(th&&th.love&&th.love[cid])||0;let k=0;STAGE_MIN.forEach((m,i)=>{if(lv>=m)k=i});return k}
function mainOf(th){return th.focus&&th.cast.includes(th.focus)?th.focus:th.cast[0]}
function parseSolo(txt){/* "*act* say (think)" → beats */
 const out=[];String(txt).split(/(\*[^*]+\*|（[^）]+）|\([^)]+\))/).forEach(p=>{p=p.trim();if(!p)return;
  if(/^\*.*\*$/.test(p))out.push(["act",p.slice(1,-1)]);else if(/^[(（].*[)）]$/.test(p))out.push(["think",p.slice(1,-1)]);else out.push(["say",p])});return out}
function newThread(kind,id,openId,extra){
 const now=Date.now();let th;
 if(kind==="solo"){const c=ch(id),w=wd(c.w);
  th={id:"c:"+id,kind:"solo",wid:c.w,cast:[id],title:c.n,msgs:[],love:{[id]:5},rounds:0,status:w?{time:Lz(w.status.time),place:Lz(w.status.place),mood:{}}:{time:"",place:"",mood:{}},tasks:{},mem:[],created:now,at:now};
  parseSolo(Lz(c.solo||T("*"+first(c.n)+" looks up.* Hey. You came.","*"+first(c.n)+" 抬起头。* 嘿，你来了。"))).forEach(([k,x])=>th.msgs.push({who:id,k,txt:x,at:now}));}
 else if(kind==="group"){th=Object.assign({id:"g:"+now,kind:"group",wid:null,msgs:[],love:{},rounds:0,status:{time:"",place:"",mood:{}},tasks:{},mem:[],created:now,at:now},extra);
  th.cast.forEach(c=>loveWrite(th,c,0,"init",{absolute:5}));th.msgs.push({who:"n",k:"act",txt:extra.setting,at:now});}
 else{const w=wd(id),quest=kind==="quest";const op=(w.openings||[]).find(o=>o.id===openId)||(w.openings||[])[0];
  th={id:(quest?"q:":"w:")+id+":"+now,kind:quest?"quest":w.kind==="ensemble"?"group":"story",wid:id,cast:w.cast.slice(),title:quest?Lz(w.quest.qtitle):Lz(w.title),msgs:[],love:{},rounds:0,
   status:{time:Lz(w.status.time),place:Lz(w.status.place),mood:{}},tasks:{},mem:[],created:now,at:now};
  w.cast.forEach(c=>loveWrite(th,c,0,"init",{absolute:5}));
  if(w.pack&&!quest)packInit(th,w,extra);
  else if(op)(op.beats[CL()]||op.beats.en).forEach(([who,k,x])=>th.msgs.push({who,k:who==="n"?"act":k,txt:x,at:now}));
  if(quest)th.quest={turns:w.quest.turns,goals:w.quest.goals.map(g=>({t:Lz(g),done:false})),hidden:{t:Lz(w.quest.hidden),done:false},over:false};}
 th.persona=Object.assign({},persona());S.threads[th.id]=th;save();return th;}
function sendDM(cid,txt){const th=S.threads["c:"+cid]||newThread("solo",cid);th.msgs.push({who:"me",k:"say",txt,at:Date.now()});th.rounds++;th.unread=true;save();
 reply(th,{kind:"user"},true);toast(t("post.sent",{n:first(ch(cid).n)}));}

/* ================= CHAT SCREEN ================= */
let curT=null,cmode="say",sugg=[],busy=false,openTools=-1;
const SENDQ=[];   // 忙时点下的选项排在这里（2026-10-27）
function openThread(id){const th=S.threads[id];if(!th)return;curT=id;th.unread=false;cmode="say";sugg=th.sugg||[];openTools=-1;save();renderChat();show("s-chat");scrollChat();}
function renderChat(){
 const th=S.threads[curT];if(!th)return;const mid=mainOf(th),st=stageOf(th,mid);
 const avs=th.cast.length>1?'<div class="row chavs" style="gap:0;flex:none">'+th.cast.slice(0,3).map((c,i)=>'<div style="flex:0 0 auto;margin-left:'+(i?-9:0)+'px;border-radius:50%;box-shadow:0 0 0 2px var(--bg)">'+avatar(c,30)+'</div>').join("")+'</div>':avatar(th.cast[0],32);
 let h='<div class="chead"><div class="row" style="gap:10px;align-items:center;margin-bottom:10px"><button class="ibtn" data-back="1">'+ic("back")+'</button>'+avs+'<div class="grow" data-us="1" style="cursor:pointer"><b>'+esc(th.title)+'</b></div><button class="ibtn" data-cmenu="1">'+ic("dots")+'</button></div>'+
  '<div class="row" style="gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px"><span class="stagechip">'+t("stage."+st)+'</span><span class="livechip stagechip" style="color:var(--mint);border-color:rgba(127,196,166,.35)"></span><span class="num">'+(th.pk?'<span data-chmap="'+th.wid+'" style="text-decoration:underline dotted;cursor:pointer">'+t("pk.chShort",{n:th.pk.ch})+' / '+PCN(wd(th.wid))+'</span> · '+esc(packAsName(wd(th.wid),th.pk.as)):t("cx.turns",{n:th.rounds}))+'</span><button class="uchip" data-units="1">✦ '+unitsLeft()+'</button></div></div>';
 const s=th.status||{};
 h+='<div class="status">'+(s.time?'<span style="display:flex;gap:4px;align-items:center">🕰 <span>'+esc(s.time)+'</span></span>':"")+(s.place?'<span style="display:flex;gap:4px;align-items:center">📍 <span>'+esc(s.place)+'</span></span>':"")+
  speakersOf(th).map(c=>'<span style="display:flex;gap:4px;align-items:center"><b>'+esc(first(ch(c).n))+'</b><span>'+esc((s.mood||{})[c]||"—")+' · ♥ <span class="num">'+Math.round(th.love[c]||0)+'</span></span></span>').join("")+
  (th.quest?'<span style="color:#FFD08A;display:flex;gap:4px;align-items:center" data-qsheet="1">🎯 <span>'+th.quest.goals.filter(g=>g.done).length+'/'+th.quest.goals.length+' · '+t("q.turns",{a:th.rounds,b:th.quest.turns})+'</span></span>':"")+'</div>';
 h+='<button class="livebanner" data-livetest="1" hidden><span></span> · <b>'+t("live.test")+'</b></button>';
 h+='<div class="msgs" id="msgs">'+th.msgs.map((m,i)=>msgHTML(m,i,th)).join("")+'</div>';
 h+='<div class="suggest" id="sugg">'+sugg.map(x=>'<button data-sg="'+esc(x)+'">'+esc(x)+'</button>').join("")+'</div>';
 if(th.pk)h+='<div id="pkwrap">'+packPanel(th)+'</div>';
 const watch=th.pk&&th.pk.as==="watch";if(watch)cmode="dir";
 /* primary row: the 3–4 ways to talk, always full-size, never wraps. Everything else (watch, games, ideas, continue, script library)
    lives in a collapsible tray below (#modes2) opened with the ⋯ toggle — fixes the squished/wrapped buttons on narrow phones. */
 h+='<div class="composer"><div class="modes">'+(watch?'<button data-mode="dir" class="dir on">🎬 '+t("pk.direct")+'</button><button class="tool" data-cont="1">⏩ '+t("cx.cont")+'</button><button class="tool" data-stepin="1">🚪 '+t("pk.stepIn")+'</button><span class="sp"></span>':[["say","cx.say"],["act","cx.act"],["think","cx.think"]].map(([k,l])=>'<button data-mode="'+k+'" class="'+(cmode===k?"on":"")+'">'+(k==="act"?"✱ ":k==="think"?"💭 ":"")+t(l)+'</button>').join("")+
  '<button data-mode="dir" class="dir '+(cmode==="dir"?"on":"")+'">🎬 '+t("cx.dir")+'</button>'+(th.pk?'<button class="tool" data-stepin="1">🚪</button>':'')+'<span class="sp"></span>')+
  '<button class="tool" data-modemore="1" id="modeMoreBtn">⋯ '+t("cx.more")+'</button></div>'+
  '<div class="modes2" id="modes2" hidden>'+
   '<button class="tool gamebtn" data-games="1">🎮 '+t("gh.btn")+'</button><button class="tool" data-ideas="1">✦ '+t("cx.suggest")+'</button><button class="tool" data-cont="1">⏩ '+t("cx.cont")+'</button><button class="tool" data-cs="1">📖 '+t("cs.h")+'</button></div>'+
  '<div class="inrow"><button class="plus" data-plus="1">'+ic("plus")+'</button><textarea id="cin" rows="1" class="'+(cmode==="dir"?"dir":"")+'" placeholder="'+esc(t("cx.ph."+cmode))+'"></textarea><button class="send" data-send="1">'+ic("send")+'</button></div></div>';
 const lastWho=([...th.msgs].reverse().find(m=>ch(m.who))||{}).who||mainOf(th);
 h='<div class="chatbg" id="chatBg"><div class="cbimg" id="cbImg"></div><canvas id="cbFx"></canvas><div class="cbveil"></div></div>'+h;
 screen("s-chat",h,"chatscreen");refreshLive();setTimeout(()=>chatFx(th),30);const lm=[...th.msgs].reverse().find(m=>ch(m.who));/* the scene is alive from the first second, before anyone speaks */if(lm)chatBgSet(lm.who,poseOf(lm));else{const c0=(th.cast||[]).find(x=>ch(x));if(c0)chatBgSet(c0,"idle")}}
/* ---------- living backdrop: the character who's talking, slowly moving, plus the weather of their world ---------- */
const POSES=["idle","smile","close","angry","sad","away","surprised","think"];
/* delivered pose art: "id:pose" → file in art/poses/. Missing poses are acted out with camera + light. */
const POSE_ART={};
function poseOf(m){if(m.pose&&POSES.includes(m.pose))return m.pose;const x=String(m.txt||"").toLowerCase();
 if(m.k==="think")return "think";
 if(/turn(s|ed)? away|look(s)? away|back to|won't look|不看|转过身|背对|別|背を/.test(x))return "away";
 if(/kiss|closer|lean(s)? in|touch|hand|close the distance|靠近|凑近|吻|牵|手腕|抱/.test(x))return "close";
 if(/laugh|grin|smile|haha|笑/.test(x))return "smile";
 if(/damn|stop|don't you dare|shut up|!|！|怒|滚|不许/.test(x))return "angry";
 if(/sorry|lost|tired|can't|hurt|miss|抱歉|累|失去|疼|想你/.test(x))return "sad";
 if(/what\?|wait|—$|……？|什么？|等等/.test(x))return "surprised";
 return "idle"}
/* ---------- living scene: the chat background follows the story ----------
   1. If this story has delivered video clips, the background is a muted loop of the clip that best
      matches who is talking and how (their body language), so the people on screen actually move and change.
   2. Otherwise the scene shows one or two characters: the speaker steps forward, the other drops back,
      and the speaker's body language (close / angry / turns away / sad / surprised / thinking) plays out. */
const V_=(w,c)=>"video/"+w+"_ep01_c0"+c+".mp4";
const SCENE={
 ice:[[1,["mason","ethan"],"idle"],[2,["mason","ethan"],"surprised"],[3,["ethan","mason"],"angry"],[4,["mason","ethan"],"away"],[5,["ethan"],"close"],[6,["mason"],"think"],[7,["mason","ethan"],"close"]],
 pact:[[2,["nico","jamie"],"surprised"],[3,["nico"],"sad"],[4,["jamie"],"angry"],[5,["jamie","nico"],"close"],[7,["jamie","nico"],"surprised"]],
 unseelie:[[4,["caelan"],"surprised"],[5,["caelan"],"angry"],[6,["thorne"],"close"],[7,["caelan","thorne"],"angry"],[1,[],"idle"]],
 crimson:[[1,["adrian","lucien"],"angry"],[2,["lucien"],"smile"],[3,["adrian"],"angry"],[5,["lucien","adrian"],"close"],[6,["adrian"],"surprised"],[7,["adrian","lucien"],"sad"]],
 made:[[1,["cass","dante"],"angry"],[2,["dante"],"idle"],[3,["cass"],"angry"],[4,["cass"],"surprised"],[6,["dante","cass"],"sad"],[7,["cass","dante"],"close"]],
 pole:[[1,["luca"],"idle"],[3,["jack"],"angry"],[4,["jack","luca"],"angry"],[5,["jack"],"sad"],[7,["jack","luca"],"close"]],
 fourth:[[3,["brody"],"sad"],[4,["ezra","brody"],"surprised"],[6,["brody","ezra"],"sad"]],
 night:[[1,["elijah","rowan"],"idle"],[2,["rowan","elijah"],"surprised"],[3,["elijah"],"sad"],[4,["rowan","elijah"],"smile"],[5,["elijah","rowan"],"close"],[6,["rowan"],"away"],[7,["elijah","rowan"],"close"]],
 light:[[1,["wren"],"idle"],[2,["sasha"],"think"],[3,["wren"],"smile"],[4,["wren"],"surprised"],[5,["wren"],"think"],[6,["wren","sasha"],"surprised"],[7,["sasha","wren"],"close"]],
 split:[[1,["noor","iris"],"angry"],[2,["noor","iris"],"close"],[3,["iris","noor"],"sad"],[4,["iris","noor"],"away"],[5,["noor","iris"],"surprised"],[6,["noor","iris"],"close"],[7,["iris","noor"],"surprised"]],
 roomies:[[1,["marisol","dakota"],"smile"],[5,["marisol","dakota"],"surprised"],[6,["dakota","marisol"],"close"],[7,["marisol","dakota"],"close"]],
 offbook:[[1,["theo","nora"],"idle"],[2,["theo","nora"],"angry"],[3,["theo","nora"],"think"],[4,["nora","theo"],"close"],[5,["theo","nora"],"surprised"],[6,["theo","nora"],"smile"],[7,["theo","nora"],"close"]],
 bratva:[[1,["nikolai"],"idle"],[2,["nikolai"],"smile"],[3,["nikolai"],"close"],[4,["nikolai"],"angry"],[5,["nikolai"],"sad"],[6,["nikolai"],"close"],[7,["nikolai"],"surprised"]],
 lowseason:[[1,["june","callum"],"surprised"],[2,["june","callum"],"angry"],[3,["june","callum"],"away"],[4,["callum","june"],"surprised"],[5,["june","callum"],"smile"],[6,["callum","june"],"close"],[7,["june","callum"],"sad"]],
 pack:[[1,["ronan","kai","silas"],"idle"],[2,["kai"],"smile"],[3,["silas"],"angry"],[4,["ronan","kai","silas"],"surprised"],[5,["ronan"],"close"],[6,["kai","silas"],"think"],[7,["ronan"],"angry"]],
 afterhours:[[1,["nico","mason","ethan"],"idle"],[2,["ethan","mason","wren"],"smile"],[3,["rowan","nico","wren"],"surprised"],[4,["theo","rowan"],"think"],[5,["nico","mason","ethan"],"surprised"],[6,["wren","rowan","theo"],"close"],[7,["nico","mason","ethan","wren","rowan","theo"],"surprised"]]};
const BADV=new Set();
function sceneClip(wid,who,pose,cur){const L=SCENE[wid];if(!L)return null;let best=null,bs=-1;
 L.forEach(([c,ws,p])=>{if(BADV.has(V_(wid,c)))return;let sc=(ws[0]===who?4:0)+(ws.includes(who)?2:0)+(p===pose?3:0)+Math.random()*.9;if(cur&&cur===V_(wid,c))sc-=2.5;if(sc>bs){bs=sc;best=V_(wid,c)}});return best}
function chatBgSet(who,pose){const box=$("#cbImg");if(!box||!ch(who))return;pose=pose||"idle";const th=S.threads[curT];
 POSES.forEach(p=>box.classList.toggle("p-"+p,p===pose));
 const wid=th&&th.wid,src=wid&&SCENE[wid]?sceneClip(wid,who,pose,box.dataset.clip):null;box.dataset.who=who;
 if(src){box.classList.add("vmode");box.classList.remove("duo");POSES.forEach(p=>box.classList.remove("p-"+p));if(box.dataset.clip===src)return;box.dataset.clip=src;
  const v=document.createElement("video");v.muted=true;v.loop=true;v.playsInline=true;v.setAttribute("playsinline","");v.autoplay=true;v.className="cbv";v.poster=artSrc(who);v.src=vidSrc(src);box.appendChild(v);
  /* never leave the scene black: a clip that fails is skipped, and with no clips left the characters themselves are shown */
  v.addEventListener("error",()=>{BADV.add(src);if(box.dataset.clip===src){box.dataset.clip="";v.remove();chatBgSet(who,pose)}},{once:true});
  const go=()=>{if(!v.isConnected||box.dataset.clip!==src)return;v.classList.add("on");[...box.children].forEach(x=>{if(x!==v)x.classList.remove("on")});setTimeout(()=>{if(box.dataset.clip===src)[...box.children].forEach(x=>{if(x!==v)x.remove()})},1300)};
  v.addEventListener("loadeddata",go,{once:true});setTimeout(()=>{if(!v.classList.contains("on"))go()},1500);const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{});return}
 box.classList.remove("vmode");box.dataset.clip="";
 /* one or two people on screen */
 const cast=(th&&th.cast)||[who],other=cast.length>1?(cast.find(c=>c!==who&&c===box.dataset.last)||cast.find(c=>c!==who)):null;
 box.classList.toggle("duo",!!other);
 const want=[who].concat(other?[other]:[]);
 [...box.querySelectorAll("video")].forEach(x=>x.remove());
 want.forEach(id=>{let im=box.querySelector('img[data-who="'+id+'"]');const pa=POSE_ART[id+":"+(id===who?pose:"idle")],src2=pa?"art/poses/"+pa:artSrc(id);
  if(!im){im=document.createElement("img");im.dataset.who=id;im.alt="";box.appendChild(im);requestAnimationFrame(()=>requestAnimationFrame(()=>im.classList.add("on")))}
  if(im.getAttribute("src")!==src2)im.src=src2;
  im.classList.toggle("front",id===who);im.classList.toggle("back",id!==who);im.classList.toggle("sideL",cast.indexOf(id)%2===0);im.classList.toggle("sideR",cast.indexOf(id)%2===1)});
 [...box.querySelectorAll("img")].forEach(x=>{if(!want.includes(x.dataset.who)){x.classList.remove("on");setTimeout(()=>x.remove(),1200)}});
 const f=box.querySelector("img.front");if(f){f.classList.remove("pulse");void f.offsetWidth;f.classList.add("pulse")}
 box.dataset.last=who}
const FX={ice:"snow",pack:"snow",unseelie:"frost",bratva:"snow",lowseason:"snow",crimson:"embers",made:"rain",night:"rain",afterhours:"rain",light:"beam",pole:"bokeh",split:"neon",fourth:"dust",pact:"fireflies",roomies:"dust",offbook:"dust"};
let fxRaf=0;
function chatFx(th){cancelAnimationFrame(fxRaf);const cv=$("#cbFx");if(!cv)return;const kind=FX[th.wid]||(th.kind==="group"?"dust":"bokeh");
 const r=cv.getBoundingClientRect(),W=cv.width=Math.max(1,r.width),H=cv.height=Math.max(1,r.height),x=cv.getContext("2d");
 const N={snow:90,frost:70,embers:40,rain:110,beam:30,bokeh:26,neon:24,dust:40,fireflies:28}[kind]||30;
 const P=[...Array(N)].map(()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random(),v:Math.random(),p:Math.random()*6.28}));
 const pal={bokeh:["255,196,140","255,120,150","140,170,255"],neon:["156,132,224","238,111,151","111,200,255"]};let tt=0;
 const step=()=>{if(!document.body.contains(cv))return;tt+=1;x.clearRect(0,0,W,H);
  if(kind==="beam"){const a=(tt*.006)%(Math.PI*2),g=x.createRadialGradient(W*.8,H*.2,0,W*.8,H*.2,W*1.2);x.save();x.translate(W*.8,H*.2);x.rotate(a);x.fillStyle="rgba(255,235,180,"+(.07+.05*Math.max(0,Math.cos(a)))+")";x.beginPath();x.moveTo(0,0);x.lineTo(W*1.4,-60);x.lineTo(W*1.4,60);x.fill();x.restore()}
  P.forEach(q=>{
   if(kind==="snow"||kind==="frost"){q.y+=.4+q.v*1.1;q.x+=Math.sin(tt*.01+q.p)*.5;if(q.y>H){q.y=-5;q.x=Math.random()*W}x.fillStyle="rgba(255,255,255,"+(.35+q.r*.45)+")";x.beginPath();x.arc(q.x,q.y,.8+q.r*2.2,0,7);x.fill();
    if(kind==="frost"&&q.r>.9){x.fillStyle="rgba(170,230,255,"+(.3+.3*Math.sin(tt*.05+q.p))+")";x.fillRect(q.x-1,q.y-6,2,12);x.fillRect(q.x-6,q.y-1,12,2)}}
   else if(kind==="rain"){q.y+=6+q.v*6;q.x-=1.2;if(q.y>H){q.y=-20;q.x=Math.random()*W*1.2}x.strokeStyle="rgba(190,210,255,"+(.12+q.r*.2)+")";x.lineWidth=1;x.beginPath();x.moveTo(q.x,q.y);x.lineTo(q.x+2,q.y-14-q.v*10);x.stroke()}
   else if(kind==="embers"){q.y-=.3+q.v*.9;q.x+=Math.sin(tt*.02+q.p)*.6;if(q.y<-5){q.y=H+5;q.x=Math.random()*W}const a=.3+.5*Math.abs(Math.sin(tt*.03+q.p));x.fillStyle="rgba(255,"+(90+q.r*80|0)+",60,"+a+")";x.beginPath();x.arc(q.x,q.y,1+q.r*1.6,0,7);x.fill()}
   else if(kind==="bokeh"||kind==="neon"){q.x+=Math.sin(tt*.004+q.p)*.3;q.y+=Math.cos(tt*.003+q.p)*.2;const c=pal[kind][(q.p*10|0)%3],rr=8+q.r*26,a=.05+.07*Math.abs(Math.sin(tt*.01+q.p));const g=x.createRadialGradient(q.x,q.y,0,q.x,q.y,rr);g.addColorStop(0,"rgba("+c+","+a*2+")");g.addColorStop(1,"rgba("+c+",0)");x.fillStyle=g;x.beginPath();x.arc(q.x,q.y,rr,0,7);x.fill()}
   else if(kind==="fireflies"){q.x+=Math.sin(tt*.01+q.p)*.6;q.y+=Math.cos(tt*.013+q.p)*.5;const a=Math.max(0,Math.sin(tt*.04+q.p*3));x.fillStyle="rgba(255,220,120,"+a*.8+")";x.beginPath();x.arc(q.x,q.y,1.6,0,7);x.fill()}
   else{q.y+=Math.sin(tt*.005+q.p)*.15;q.x+=.15+q.v*.2;if(q.x>W)q.x=0;x.fillStyle="rgba(255,236,200,"+(.1+q.r*.25)+")";x.beginPath();x.arc(q.x,q.y,.6+q.r*1.3,0,7);x.fill()}});
  fxRaf=requestAnimationFrame(step)};step()}
function who(m,th){const c=ch(m.who);return c?first(c.n):""}
function msgHTML(m,i,th){
 if(m.k==="chap"){const w=wd(th.wid);return '<div class="m-chap"><span class="eyebrow">'+t("pk.chapter",{n:m.n})+' / '+PCN(w)+'</span><h3>'+esc(m.title||"")+'</h3><p>🎯 '+esc(m.txt||"")+'</p></div>'}
 if(m.k==="dec")return '<div class="m-dec"><span>'+t("pk.decided")+' · '+m.c+'</span><b>'+esc(m.txt)+'</b></div>';
 if(m.k==="end"){const w=wd(th.wid),e=w&&w.pack&&w.pack.endings[m.e];if(!e)return "";const ln=e.line;
  return '<div class="m-end"><div class="eyebrow" style="color:var(--gold)">🏁 '+t("pk.endingH",{k:m.e})+'</div><h3>'+esc(Lz(e.t))+'</h3><p>'+esc(Lz(e.txt))+'</p>'+
   (ln&&ch(ln.who)?'<div class="m-endl">'+avatar(ln.who,30)+'<q>'+esc(S.lang==="zh"?ln.zh:ln.en)+'</q></div>':'')+'<p class="xs faint" style="margin-top:10px">'+t("pk.endFound",{a:endingsFound(th.wid),b:3})+'</p></div>'}
 if(th.pk&&m.who===th.pk.as&&th.pk.as!=="watch"&&th.pk.as!=="side"&&m.who!=="me"){const c0=ch(m.who),lab='<small class="asme">'+esc(t("pk.youAre",{n:first(c0.n)}))+'</small>';
  if(m.k==="act")return '<div class="m-act me" data-mi="'+i+'">'+lab+esc(m.txt)+'</div>';
  if(m.k==="think")return '<div class="m-think me" data-mi="'+i+'"><small>💭 '+esc(first(c0.n))+'</small>'+esc(m.txt)+'</div>';
  return '<div class="m-row me" data-mi="'+i+'" data-wc style="--wc:var(--fg)"><div>'+lab+'<div class="bub">'+esc(m.txt)+'</div></div></div>'}
 const quick=(m.who!=="me"&&m.txt&&m.k!=="card"&&m.k!=="img"&&m.k!=="dir")?'<div class="mquick'+(m.who==="n"?" c":"")+'"><button data-mt="play|'+i+'" title="'+t("msg.play")+'">🔊'+(hasVoice(m.txt,m.who)?'':'')+'</button>'+(m.who!=="n"?'<button data-mt="snap|'+i+'" title="'+t("msg.img")+'">🖼</button>':"")+'<button data-shline="'+i+'" title="'+t("shr.h")+'">📤</button></div>':"";
 const tools=quick+(openTools===i?'<div class="mtools">'+(m.who!=="me"&&m.who!=="n"?'<button data-mt="play|'+i+'">🔊 '+t("msg.play")+'</button><button data-mt="snap|'+i+'">📷 '+t("msg.snap")+'</button>':"")+
  '<button data-mt="save|'+i+'">🔖 '+t("msg.save")+'</button>'+(i>=th.msgs.length-4&&m.who!=="me"&&m.ai?'<button data-mt="redo|'+i+'">↻ '+t("msg.redo")+'</button>':"")+'</div>':"");
 if(m.k==="react")return '<div class="m-react" style="margin:6px 0 10px;padding-left:10px;border-left:2px solid var(--line);opacity:.72;font-size:13px">'+esc(m.txt)+'</div>';
 if(m.k==="card")return '<div class="m-card"><div class="eyebrow">'+esc(m.title||"")+'</div><p class="sm" style="margin-top:6px;line-height:1.5">'+esc(m.txt||"")+'</p>'+(m.btn?'<button class="btn btn-p btn-sm" style="margin-top:10px" data-cardbtn="'+i+'">'+esc(m.btn)+'</button>':"")+'</div>';
 if(m.k==="pic")return '<div class="m-pic'+(m.locked?" lk":"")+'"><img src="'+esc(m.src)+'" alt="">'+(m.locked?'<button class="pk" data-unpic="'+i+'"><b>📷 '+t("pay.pic",{n:who(m,th)})+'</b><span>💎 1 · '+t("pay.unlock")+'</span></button>':'')+'</div>';
 if(m.locked&&m.who!=="me")return '<div class="m-row"><div class="av" style="width:30px;height:30px"><img src="'+artSrc(m.who)+'" alt=""></div><div><div class="m-who" style="color:'+(ch(m.who)?ch(m.who).pal[0]:"")+'">'+esc(who(m,th))+'</div><button class="bub lkb" data-unmsg="'+i+'"><span class="blur">'+esc(m.txt)+'</span><em>🔒 '+t("pay.line")+' · 💎 1</em></button></div></div>';
 if(m.k==="img"){const a=S.album.find(y=>y.id===m.aid);return a?'<div class="m-img" data-mi="'+i+'">'+albumHtml(a)+'</div><div class="mquick c"><button data-shimg="'+a.id+'">📤</button></div>'+tools:""}
 if(m.who==="n")return '<div class="m-narr" data-mi="'+i+'">'+esc(m.txt)+'</div>'+tools;
 if(m.k==="dir")return '<div class="m-dir">🎬 '+esc(m.txt)+'</div>';
 const isMe=m.who==="me",c=isMe?null:ch(m.who);
 if(m.k==="act")return '<div class="m-act'+(isMe?" me":"")+'" data-mi="'+i+'">'+(isMe?"":'<b style="color:'+(c?c.pal[0]:"")+';font-size:11px">'+esc(who(m,th))+'</b> ')+esc(m.txt)+'</div>'+tools;
 if(m.k==="think")return '<div class="m-think'+(isMe?" me":"")+'" data-mi="'+i+'"><small>'+(isMe?"💭 "+esc(me()):"💭 "+esc(who(m,th)))+'</small>'+esc(m.txt)+'</div>'+tools;
 return '<div class="m-row'+(isMe?" me":"")+'" data-mi="'+i+'" data-wc style="--wc:'+(isMe?"var(--fg)":((c&&c.pal&&c.pal[0])||"var(--line)"))+'">'+(isMe?"":avatar(m.who,30))+'<div>'+(isMe||th.cast.length<2?"":'<div class="m-who" style="color:'+(c?c.pal[0]:"")+'">'+esc(who(m,th))+'</div>')+'<div class="bub">'+esc(m.txt)+'</div></div></div>'+tools;}
/* 2026-10-27 补的三条视觉（Ann 试玩反馈）：
   ① 每个角色一条他自己的色条 + 淡底（原来只有名字颜色，认不出谁在说）
   ② 点过的选项反色（原来点下去毫无反馈）
   ③ AI 失败那行是警告色，不能和正常叙述混在一起 */
(function(){try{
 if(typeof MIRU_TUNE!=="undefined"&&MIRU_TUNE.chat&&MIRU_TUNE.chat.playerSide==="left")document.body.classList.add("miru-player-left");
 const st=document.createElement("style");
 st.textContent=[
  '.m-row[data-wc]{border-left:3px solid var(--wc);background:color-mix(in srgb,var(--wc) 9%,transparent);border-radius:12px;padding-left:9px}',
  '.m-row.me[data-wc]{border-left:3px solid var(--fg);background:color-mix(in srgb,var(--fg) 10%,transparent)}',
  '.suggest button.sel{background:var(--fg)!important;color:var(--bg)!important;border-color:var(--fg)!important}',
  '.m-warn{margin:6px 0 10px;padding:8px 10px;border-radius:10px;background:color-mix(in srgb,#ff8a5b 16%,transparent);border-left:3px solid #ff8a5b;font-size:12.5px;opacity:.95}',
  /* 「玩家在哪一侧」开关（默认：玩家在右、角色在左，聊天软件惯例）。
     MIRU_TUNE.chat.playerSide = "left" 时整盘翻过来：玩家在左、角色在右。 */
  'body.miru-player-left .m-row.me{align-self:flex-start;flex-direction:row}',
  'body.miru-player-left .m-row:not(.me):not(.m-narr){align-self:flex-end;flex-direction:row-reverse}',
  'body.miru-player-left .m-row.me .bub{border-bottom-right-radius:18px;border-bottom-left-radius:6px}'
 ].join('\n');
 document.head.appendChild(st);
}catch(_){}})();
function scrollChat(){const m=$("#msgs");if(m)m.scrollTop=m.scrollHeight}
function appendMsg(th,m){
 /* 2026-10-27：同一个人、同一句、4 秒内，只落一次。
    存档里出现过「我（动作）: 我接过你手里的咖啡。」连续两条 —— 点击被派发了两次。 */
 try{const last=th.msgs&&th.msgs[th.msgs.length-1];
  if(last&&last.who===m.who&&last.txt===m.txt&&(Date.now()-(last.at||0))<4000)return}catch(_){}if(ch(m.who)&&m.ai){payHooks(th,m);storyHooks(th,m)}
 /* 玩家原话单独留档（2026-10-25 Ann）：模型生成的内容可以随窗口滑走，但**玩家自己说的话**要留住。
    这里逐字收进 th.said（去掉 *动作* 的星号噪音），按 chat.saidKeep 截断。 */
 try{ if(m&&m.who==="me"&&(m.k==="say"||m.k==="act"||m.k==="think"||m.k==="dir")&&String(m.txt||"").trim()){
   const line=String(m.txt).trim();
   th.said=Array.isArray(th.said)?th.said:[];th.said.push(line);
   const cap=(typeof MIRU_TUNE!=="undefined"&&MIRU_TUNE.chat&&MIRU_TUNE.chat.saidKeep)||50;
   if(th.said.length>cap)th.said=th.said.slice(-cap);
   /* 手打的单独一档（Ann 2026-10-25）：系统给的候选句也算"玩家说的"，但**不是玩家写的**。
      珍贵的是亲手敲的 —— 这些单独存，存得更多，进 prompt 时排在"我们自己的话"那一段。 */
   if(m.typed){
     th.typed=Array.isArray(th.typed)?th.typed:[];th.typed.push(line);
     const capT=(typeof MIRU_TUNE!=="undefined"&&MIRU_TUNE.chat&&MIRU_TUNE.chat.typedKeep)||120;
     if(th.typed.length>capT)th.typed=th.typed.slice(-capT);
   }
 }}catch(_){}
if(m&&m.seen===undefined)m.seen=(th.present||th.cast||[]).slice();th.msgs.push(m);th.at=Date.now();save();if(curT===th.id&&ch(m.who))chatBgSet(m.who,poseOf(m));
 if(curT===th.id&&$("#msgs")&&!$("#s-chat").hidden){$("#msgs").insertAdjacentHTML("beforeend",msgHTML(m,th.msgs.length-1,th));scrollChat()}}
/* 2026-10-27：模型偶尔把 suggest 返成对象（{text:…} / {say:…}），直接 String() 就会显示
   「[object Object]」，而且点击时会把那串字发出去。统一在这里取成人话。 */
function asText70(x){
 if(x==null)return "";
 if(typeof x==="string")return x;
 if(typeof x==="number"||typeof x==="boolean")return String(x);
 if(typeof x==="object")return String(x.text||x.line||x.t||x.say||x.act||x.value||"");
 return String(x);
}
function setSugg(list){sugg=(list||[]).map(asText70).map(s=>s.trim()).filter(Boolean).slice(0,3);const th=S.threads[curT];if(th){th.sugg=sugg;save()}
 const el=$("#sugg");if(el)el.innerHTML=sugg.map(x=>'<button data-sg="'+esc(x)+'">'+esc(x)+'</button>').join("")}
function typing(on){const el=$("#msgs");if(!el)return;$$(".typing",el).forEach(x=>x.remove());if(on){el.insertAdjacentHTML("beforeend",'<div class="typing"><i></i><i></i><i></i></div>');scrollChat()}}
/* 流式预览（2026-10-25）：等整段最长要 ~9.5 秒，而首字 ~2.0 秒就到了（LATENCY.md 实测 4.8×）。
   这里把已到达的片段先塞进"正在输入"那一行，让玩家 2 秒内就看见有东西在动。
   只影响观感：解析仍然等完整 JSON（ask 的 json() 会在流结束时统一解析）。
   ⚠️ 必须容错 —— 任何一个 DOM 错误都不能把整轮回复弄丢。 */
let STREAM_TXT="";
function streamPreview(piece){
  try{
    STREAM_TXT+=String(piece||"");
    const el=$("#msgs");if(!el)return;
    const box=$(".typing",el);if(!box)return;
    const tail=STREAM_TXT.replace(/\s+/g," ").slice(-46);
    let s=box.querySelector(".spv");
    if(!s){s=document.createElement("span");s.className="spv";s.style.cssText="margin-left:8px;opacity:.6;font-size:12px";box.appendChild(s)}
    s.textContent=tail;
    try{scrollChat()}catch(_){}
  }catch(_){}
}

/* send from composer */
function doSend(txt,mode,typed){   // typed=手打（2026-10-25）：只有玩家自己敲的才算「珍贵」
 const th=S.threads[curT];if(!th)return;txt=(txt||"").trim();if(!txt)return;
 /* 2026-10-27 Ann 试玩：上一轮还没说完时点选项，原来**静默丢弃**（选项已清空、话没发出）。
    她看到的就是「我选了，他毫无反应」。改成排队，等这一轮结束自动发出去。 */
 if(busy){SENDQ.push({txt:txt,mode:mode||cmode,typed:!!typed});try{toast(S.lang==="zh"?"记下了，这一轮说完就发":"Queued - sends after this reply")}catch(_){}return}
 if(!aiGate()){const ta=$("#cin");if(ta)ta.value=txt;return}
 if(th.quest&&th.quest.over){questEnd(th);return}
 mode=mode||cmode;
 if(mode==="dir"){appendMsg(th,{who:"me",k:"dir",txt,typed:!!typed,at:Date.now()});reply(th,{kind:"dir",txt});return}
 appendMsg(th,{who:"me",k:mode,txt,typed:!!typed,at:Date.now()});th.rounds++;
 reply(th,{kind:"user",txt,mode});}

/* ================= AI ENGINE ================= */
function castCard(th,cid){const c=ch(cid),st=stageOf(th,cid),A=x=>Lz(x);
 const w0=th.wid&&wd(th.wid),au=w0&&w0.pack&&w0.pack.au&&w0.pack.au[cid];
 return "- id="+cid+" · "+c.n+", "+c.age+", "+(au?"in this story: "+A(au):A(c.role))+". Looks: "+A(c.looks)+" Personality: "+A(c.vibe)+
  " How feelings show: "+(c.tells?(c.tells[CL()]||c.tells.en).join(" / "):"")+" Contradiction: "+A(c.twist)+" Likes: "+A(c.likes)+
  " Secret (never state it outright"+(st>=3?"; may now be revealed if the moment earns it":"; hint only")+"): "+A(c.secret)+
  " · Closeness to "+me()+": "+Math.round(th.love[cid]||0)+"/100 (stage: "+I18N.en["stage."+st]+"). Current mood: "+((th.status.mood||{})[cid]||"unknown")+"."+
  (function(){try{const chNow=(th.pk&&th.pk.ch)||th.ch||1;const memo=(typeof cardMemo==="function")?cardMemo(th,cid,chNow):"";return memo?" He remembers: "+memo+".":""}catch(_){return ""}})()+
  // 非恋爱对象（2026-10-25 Ann 改）：**只关掉恋爱线，不关掉人的魅力**。
  // 原来这句写的是 "never flirt with them or imply attraction"——那是把角色的性张力当成了一个开关，
  // 而「一个因为标签就突然变得没有魅力的人」正是这个项目一开始要修的病（人不能变成另一个人）。
  // 现在明确分开：不给好感、不进恋爱阶段、不做亲密戏；但斗嘴、撩、被人撩时的反应，全都在。
  (c.romanceable===false?" Not a romance route: affection and intimacy do not progress with them, and this never becomes a love story. But they are still fully a person — their own magnetism, teasing, banter and reactions to being wanted stay exactly as they are. Do not make them cold, flat or sexless just because the route is closed.":"");}
function castCardPublic(th,cid){const c=ch(cid),st=stageOf(th,cid),A=x=>Lz(x);
 const w0=th.wid&&wd(th.wid),au=w0&&w0.pack&&w0.pack.au&&w0.pack.au[cid];
 const _wants=(function(){try{
  /* 2026-10-28 Ann 问：「要不要把下面要发生的事情告诉他？」——答法：不预告事件，给他**想要的**。
     现状：只有 lead 那张卡带 want/fear（privateCards 默认 1），其余在场的人只有长相/性格/雷点
     ⇒ 一屋子人没有一个有理由动，场景当然原地打转（实测 5/5 轮同一张桌子）。
     所以每个在场角色的卡上都补一句他自己的动机，并写明"别人不知道"——给推力，但不让全场全知。 */
  if(typeof MIRU_TUNE!=="undefined"&&MIRU_TUNE.chat&&MIRU_TUNE.chat.publicWants===false)return "";
  const w=c.want?A(c.want):"",f=c.fear?A(c.fear):"";
  if(!w&&!f)return "";
  return " Wants (his own — other characters do not know this): "+(w||"\u2014")+(f?" Afraid of: "+f:"")+".";
 }catch(_){return ""}})();
 return "- id="+cid+" · "+c.n+", "+c.age+", "+(au?"in this story: "+A(au):A(c.role))+". Looks: "+A(c.looks)+" Personality: "+A(c.vibe)+
  " How feelings show: "+(c.tells?(c.tells[CL()]||c.tells.en).join(" / "):"")+" Likes: "+A(c.likes)+_wants+
  
  " · Closeness to "+me()+": "+Math.round(th.love[cid]||0)+"/100 (stage: "+I18N.en["stage."+st]+"). Current mood: "+((th.status.mood||{})[cid]||"unknown")+".";}
/* 谁的卡带私密面：默认只给这一拍上场的那个人（mainOf 优先，否则第一个开口的）。
   为什么：共享 prompt 下如果所有人都带秘密，等于同屋全知 —— 把跨场景的全知换了个位置。
   数量由 MIRU_TUNE.chat.privateCards 控制（1 = 收敛版；调大即放开）。 */
function castCardFace(th,id){try{
  const sp=speakersOf(th);
  const self=(typeof mainOf==="function")?mainOf(th):null;
  const lead=(self&&sp.includes(self))?self:sp[0];
  const n=Math.max(1,Number(MIRU_TUNE.chat.privateCards)||1);
  if(id===lead) return castCard(th,id);
  if(sp.slice(0,n).includes(id)) return castCard(th,id);
  return castCardPublic(th,id);
}catch(_){return castCard(th,id)}}
function transcript(th){return th.msgs.slice(S.plus?-MIRU_TUNE.chat.transcriptPlus:-MIRU_TUNE.chat.transcript).map(m=>{
 if(m.k==="react")return "[THEN] "+m.txt; if(m.k==="card")return "[EVENT] "+(m.title||"")+": "+(m.txt||"");if(m.k==="chap")return "[CHAPTER "+m.n+": "+(m.title||"")+" — goal: "+(m.txt||"")+"]";if(m.k==="dec")return "[OFFICIAL CHOICE "+m.c+"] "+m.txt;if(m.k==="end")return "[ENDING "+m.e+" reached]";if(m.k==="img")return "[A photo was taken]";
 if(m.who==="n")return "(narration) "+m.txt;if(m.k==="dir")return "[DIRECTOR NOTE from "+me()+"] "+m.txt;
 const nm=m.who==="me"?(th.pk&&ch(th.pk.as)?ch(th.pk.as).n+" (the user)":me()):ch(m.who)?ch(m.who).n:m.who;
 return nm+(m.k==="act"?" (does)":m.k==="think"?(m.who==="me"?" (private thought — nobody can hear this, but characters may sense the mood)":" (private thought)"):" (says)")+": "+m.txt}).join("\n")}
const CTX={
 user:"Respond to "+"{u}"+"'s latest input directly. At least one character reacts to their exact words.",
 cont:"{u} stays silent this turn. Move the scene forward on your own: someone does or says something that raises the stakes or shifts the mood.",
 ff:"Fast-forward: wrap up the current moment in one line of narration that keeps the emotional aftertaste, then jump to the very next beat in time.",
 skip:"Skip the scene: jump to a new time or place (a few hours or days later) with a new mood. Open the new scene with narration, update status time/place.",
 event:"Something unexpected happens now: a crisis, an interruption or a close call that raises tension. Make it specific to this world.",
 dir:"{u} is directing, not speaking. Follow this direction literally and play it out in this world: \"{x}\"",
 third:"{x} walks into the scene right now. Introduce them with narration and let them change the dynamic; others react.",
 card:"Event card played: \"{x}\". Make it happen now, specific to this world.",
 gift:"{u} just gave {c} this gift: \"{x}\". {c} reacts in character — the reaction should reveal something.",
 date:"{u} takes {c} out: \"{x}\". Start this as a real scene: arrive, set the place with one concrete detail, something small goes unexpectedly.",
 truth:"{u} asks {c} an honest question and {c} MUST answer truthfully, no jokes or deflection. The question: \"{x}\". The answer can cost them something; let a piece of their secret show.",
 redo:"Rewrite the last reply differently: different angle, different first line."};
async function reply(th,ctx,silent){
 let LLMERR=null;   // 这一轮 AI 失败的原因（给玩家看，不要吞）
 if(!silent){if(busy)return;if(!aiGate())return;busy=true;typing(true)}
 const mid=mainOf(th),c=ch(ctx.cid||mid),w=th.wid?wd(th.wid):null,p=th.persona||persona();
 const goals=th.quest?th.quest.goals.map((g,i)=>i+": "+g.t+(g.done?" (done)":"")).concat([th.quest.goals.length+": HIDDEN — "+th.quest.hidden.t+(th.quest.hidden.done?" (done)":"")]).join("\n"):"";
 const inst=(CTX[ctx.kind]||CTX.user).split("{u}").join(p.name||"the user").split("{x}").join(ctx.txt||"").split("{c}").join(c?c.n:"them");
 const deep=S.tier==="deep";
 const prompt=[
  "You write MIRU, an interactive romance story app for adult readers in the United States. You play the narrator and every character except the user. All characters are fictional adults (21+).",
  w?("STORY: "+Lz(w.title)+" — "+Lz(w.premise)):("SCENE: "+(th.setting||"")),
  w?("THE USER'S ROLE: "+Lz(w.you)):("THE USER'S ROLE: "+(th.you||"themselves")),
  w?("WHAT'S AT STAKE: "+Lz(w.warn)):"",
  "STATUS: "+(th.status.time||"")+" · "+(th.status.place||""),
  "CAST (only these ids may speak):\n"+speakersOf(th).map(id=>castCardFace(th,id)).join("\n"),
  packPrompt(th),
  (th.pk&&th.pk.as!=="side")?"":"THE USER: "+(p.name||"the user")+" ("+(p.pron==="he"?"he/him":p.pron==="she"?"she/her":"they/them")+")"+(p.look?". "+p.look:"")+". Never write the user's lines, actions or feelings.",
  memBlock(th),
  goals?("QUEST GOALS (the user is trying to achieve these; only mark one done if it clearly happened in THIS reply):\n"+goals):"",
  "STORY SO FAR:\n"+transcript(th),
  // 玩家原话（2026-10-25）：窗口会滑走，但"你说过什么"要一直在。
  // 只放玩家自己的话，逐字，不加工；空的时候整行不出现（不让模型看见空标题）。
  // 手打的那一档（Ann 2026-10-25）：系统的候选句也是"玩家说的"，但不是"玩家写的"。
  // 这一块只放亲手敲的 —— 语气、用词、习惯都在里面，比任何状态字段都更能让角色认得这个人。
  // 手打的那一档（Ann 2026-10-25）：系统的候选句也是"玩家说的"，但不是"玩家写的"。
  // 这一块只放亲手敲的 —— 语气、用词、习惯都在里面，比任何状态字段都更能让角色认得这个人。
  (function(){try{
    const arr=(Array.isArray(th.typed)?th.typed:[]);
    if(!arr.length)return "";
    return "THE PLAYER TYPED THESE THEMSELVES (their own voice and word choice \u2014 weigh these above the rest; a character who knows them would notice how they write):\n"+arr.slice(-40).map((s,i)=>(i+1)+". "+s).join("\n");
  }catch(_){return ""}})(),
  (function(){try{
    const arr=(Array.isArray(th.said)?th.said:[]);
    if(!arr.length)return "";
    return "THE PLAYER'S OWN WORDS (verbatim, oldest first — some are from much earlier than STORY SO FAR; treat them as things this person really said):\n"+arr.map((s,i)=>(i+1)+". "+s).join("\n");
  }catch(_){return ""}})(),
  "",
  "NOW: "+inst,
  // 情绪合同（T01–T04）：heat 先过一遍白名单，非法值回落到缺省；合法值原样通过（37 部剧本一个字节都不改）
  "HEAT CEILING — "+(function(){try{const raw=(typeof emotionNorm==="function"?emotionNorm({heat:S.heat}).heat:String(S.heat||"steamy"));const g=(typeof heatGated==="function")?heatGated(raw):raw;return String(g).toUpperCase()}catch(_){return String(S.heat||"steamy").toUpperCase()}})()+": "+HEAT_RULE[(typeof emotionNorm==="function"?(function(){try{return emotionNorm({heat:S.heat}).heat}catch(_){return S.heat}})():S.heat)],
  "HOW TO WRITE (this is what makes it feel human):",
  "- React to the exact words just used; quote or twist one. Never a generic reply that would fit any message.",
  "- What a character says and what they feel should not match: the spoken line guards, the private thought gives them away.",
  "- One concrete sensory detail from THIS world per reply. No abstract emotion words.",
  "- Each character sounds different, follows their profile, wants something, and may disagree or interrupt.",
  "- Contemporary American voice: contractions, fragments, dry humor. Mild swearing is fine unless heat is FLUFF.",
  "- End on something the user can answer: a question, a dare, a half-said thing. Never wrap the moment up. Never repeat an earlier line.",
  "LANGUAGE: write every text field only in "+LANG_NAME[S.lang]+".",
  "",
  'Reply with ONLY this JSON: {"beats":[{"who":"<cast id or n for narration>","kind":"say|act|think","text":"...","pose":"idle|smile|close|angry|sad|away|surprised|think"}],"status":{"time":"...","place":"...","mood":{"<cast id>":"1-3 words"}},"love":{"<cast id>":0-6},"suggest":["...","...","..."],"reaction":"<one short line the player SEES as feedback - what just changed in the room or in him, no numbers>","goals":[<indexes of quest goals completed in this reply>]}',
  "beats: "+(deep?"5 to 9":"3 to 6")+" items, each under "+(deep?"45":"32")+" words; pose = that speaker's body language in the beat (it animates their portrait). act lines are first-person from that character (\"I …\"). suggest: exactly 3 items the PLAYER could tap next. They are the user\u2019s own words or actions - never a line, a decision, or anything only a character could do. Do NOT label them: no say:, no act:, no type word at the front, no label in brackets. Punctuation alone carries the type - one plain sentence (the user speaks); one starting with * (the user acts); one in ( ) parentheses (the user stays silent or moves without speaking). Never a name prefix. reaction (REQUIRED on every single reply - never omit this key, never leave it empty) = one short line the player actually sees after this beat, describing what visibly changed (a movement, a silence, something in his face). No numbers, no inner monologue, no summary."
 ].filter(Boolean).join("\n");
 let r=null;
 if(liveOn()){
  // 流式预览：首字 ~2s 就到，整段要 ~9.5s（LATENCY.md）。开关见 MIRU_TUNE.chat.streamPreview。
  const _prev=(typeof MIRU_TUNE!=="undefined"&&MIRU_TUNE.chat&&MIRU_TUNE.chat.streamPreview!==false&&typeof streamPreview==="function");
  try{
   STREAM_TXT="";
   r=await ask(prompt,{modelTier:deep?"complex":"default",onText:_prev?(function(x){streamPreview(x)}):undefined});
  }catch(e){r=null;LLMERR=e||{code:"unknown"};try{track&&track("llm_fail",{code:(e&&(e.code||e.message))||"unknown"})}catch(_){}}
  if(r&&Array.isArray(r.beats)&&r.beats.length)useUnits(aiCost());}
 // 台词守门（他们 v8.2.3 的「台词检查」）：说了本章他还不该知道的事 ⇒ 带约束重写一次 ⇒ 仍不行就换保守句。
 // 禁区词 = 未来章节的 reveals/breaks + 在场角色卡上还没揭露的 secret/twist。开关见 MIRU_TUNE.chat.replyGuard。
 if(r&&Array.isArray(r.beats)&&r.beats.length&&typeof guardReply==="function"&&
    !(typeof MIRU_TUNE!=="undefined"&&MIRU_TUNE.chat&&MIRU_TUNE.chat.replyGuard===false)){
  try{
   const _chNo=(th.pk&&th.pk.ch)||th.ch||1;
   const _ids=(typeof speakersOf==="function"?speakersOf(th):[]);
   const _words=(typeof marksForbidden==="function"?marksForbidden(th.wid,_chNo):[])
     .concat(typeof cardForbidden==="function"?cardForbidden(th,_ids):[]);
   if(_words.length){
    const _g=await guardReply({reply:r,words:_words,
      ask:async(extra)=>await ask(prompt+"\n\n"+extra,{modelTier:"default"}),
      fallback:()=>fallback(th,ctx)});
    if(_g.retried){try{track&&track("reply_guard",{wid:th.wid,ch:_chNo,leaks:_g.leaked.length,fellBack:!!_g.fellBack})}catch(_){}}
    if(_g.reply&&Array.isArray(_g.reply.beats)&&_g.reply.beats.length)r=_g.reply;
   }
  }catch(_){}
 }
 if(!r||!Array.isArray(r.beats)||!r.beats.length){
  r=fallback(th,ctx);
  /* 2026-10-27 Ann 试玩：AI 挂了，界面**一个字都不说**，她读到的是「他不理我」。
     沉默不等于正常 —— 失败必须带原因露出来，而且要说明下方是兜底文案。 */
  if(liveOn()&&!silent){
   try{const why=(LLMERR&&(LLMERR.code||LLMERR.message))||"unknown";
    appendMsg(th,{who:"sys",k:"warn",txt:"⚠︎ AI 没接通（"+why+"）· 下面这轮是兜底文案，不是他在敷衍你",at:Date.now()})}catch(_){}
  }
 }
 // 计划层入口（Ann 2026-10-25：留个入口位置）。**只观测**：判断这一场本来会不会需要续写、
 // 需要就记一条事件；不生成、不改写这一场。返回值目前无人消费，等要真接生成器时改 plotGate 一处。
 try{ if(typeof plotGate==="function") plotGate(th); }catch(_){}
 if(!silent)typing(false);
 await playBeats(th,r,ctx,silent);
 if(!silent){busy=false;
  /* 排队里的话：这一轮结束后自动发出去（同一时刻只跑一轮） */
  try{if(SENDQ.length){const q=SENDQ.shift();setTimeout(()=>{try{doSend(q.txt,q.mode,q.typed)}catch(_){}},60)}}catch(_){}
 }}
function pickNR(arr,key){const k="_u_"+key;const u=(pickNR[k]=pickNR[k]||[]);if(u.length>=arr.length)u.length=0;const free=arr.map((_,i)=>i).filter(i=>!u.includes(i));const i=free[Math.floor(Math.random()*free.length)];u.push(i);return arr[i]}
const SUGG_FB={en:["Why are you really here?","*I sit down next to you, closer than I need to.*","Say that again. Slower.","(I shouldn't want this.)","Tell me the truth for once.","*I reach for your hand and stop halfway.*","You're doing the thing again.","What happens if I stay?","*I take the coffee from your hands.*"],
 zh:["你到底为什么来？","*我在你旁边坐下，靠得比需要的近。*","再说一遍。慢一点。","（我不该想要这个的。）","就这一次，说实话。","*我伸手去牵你，停在半路。*","你又来了。","如果我留下会怎样？","*我接过你手里的咖啡。*"]};
const FBN={en:{cont:"Nobody says anything for a second. Then someone does.",ff:"Later. The feeling from before hasn't left the room.",skip:"Hours later, somewhere else. The mood has shifted.",event:"Something crashes somewhere close. Everyone freezes.",third:"The door opens.",card:"And then it happens."},
 zh:{cont:"一时间谁都没说话。然后有人开口了。",ff:"稍后。刚才的情绪还留在屋里。",skip:"几个小时后，换了个地方。气氛变了。",event:"附近有什么东西摔碎了。所有人都僵住了。",third:"门开了。",card:"然后，它发生了。"}};
function fallback(th,ctx){
 const lang=CL(),words=(ctx.txt||"").replace(/[*()（）]/g,"").trim().split(/\s+/),w=lang==="zh"?(ctx.txt||"").replace(/[*()（）]/g,"").slice(-8):words.slice(-3).join(" ");
 const u=me();let speakers=[];
 if(ctx.cid)speakers=[ctx.cid];
 else{const named=th.cast.filter(id=>(ctx.txt||"").toLowerCase().includes(first(ch(id).n).toLowerCase()));
  const sc=speakersOf(th);speakers=named.filter(x=>sc.includes(x)).length?named.filter(x=>sc.includes(x)).slice(0,2):sc.length>1?[pickNR(sc,"sp"+th.id),pickNR(sc,"sp"+th.id)].filter((x,i,a)=>a.indexOf(x)===i):[sc[0]];}
 const beats=[];
 const N=FBN[lang]||FBN.en;
 if(N[ctx.kind])beats.push({who:"n",kind:"act",text:N[ctx.kind]+(ctx.kind==="card"||ctx.kind==="third"?" "+(ctx.txt||""):"")});
 if(ctx.kind==="dir")beats.push({who:"n",kind:"act",text:(lang==="zh"?"——":"— ")+ctx.txt});
 const recent=new Set(th.msgs.slice(-40).map(m=>m.txt));
 const fresh=(arr,key,f)=>{for(let k=0;k<arr.length*2;k++){const x=f(pickNR(arr,key));if(!recent.has(x)){recent.add(x);return x}}return null};
 speakers.forEach(id=>{const c=ch(id),bank=(BANK[c.a]||BANK.guard)[lang],love=th.love[id]||0,f=s=>s.split("{u}").join(u).split("{w}").join(w||"…");
  let x;if(Math.random()<.65&&(x=fresh(bank.act,th.id+id+"a",f)))beats.push({who:id,kind:"act",text:x});
  if(x=fresh(bank.say,th.id+id+"s",f))beats.push({who:id,kind:"say",text:x});
  if(love>10&&Math.random()<.6&&(x=fresh(bank.think,th.id+id+"t",f)))beats.push({who:id,kind:"think",text:x});});
 const lv={};speakers.forEach(id=>lv[id]=ctx.kind==="user"?2:1);
 const sg=[],pool=SUGG_FB[lang]||SUGG_FB.en;for(let i=0;i<3;i++)sg.push(pickNR(pool,"sg"));
 const gl={};if(th.quest){const m=mainOf(th);th.quest.goals.forEach((g,i)=>{if(!g.done&&(th.love[m]||0)>=25+i*18&&th.rounds>=4+i*5)gl[i]=1})}
 return {beats,love:lv,suggest:sg,goals:Object.keys(gl).map(Number),status:null};}
async function playBeats(th,r,ctx,silent){
 const valid=new Set(speakersOf(th).concat(["n"]));
 const beats=r.beats.filter(b=>b&&b.text&&valid.has(b.who)).slice(0,10);
 const before={};th.cast.forEach(c=>before[c]=stageOf(th,c));
 const toSpeak=[];
 for(const b of beats){if(!String(b.text||"").trim())continue;   // 空拍不播（2026-10-27：存档里出现过一条空台词）
  const m={who:b.who,k:b.who==="n"?"act":(["say","act","think"].includes(b.kind)?b.kind:"say"),txt:asText70(b.text).slice(0,500),at:Date.now(),ai:1};if(b.pose&&POSES.includes(b.pose))m.pose=b.pose;
  if(!silent)await new Promise(res=>setTimeout(res,(typeof MIRU_TUNE!=="undefined"&&MIRU_TUNE.chat&&MIRU_TUNE.chat.beatMs)||700));  // 380 → 700（2026-10-27 Ann：全闪过去）
  appendMsg(th,m);if(m.k!=="think")toSpeak.push(m);}
 if(r.status){th.status.time=r.status.time||th.status.time;th.status.place=r.status.place||th.status.place;th.status.mood=Object.assign(th.status.mood||{},r.status.mood||{})}
 if(r.love)Object.keys(r.love).forEach(id=>{if(th.love[id]!=null){const d=Math.max(0,Math.min(6,+r.love[id]||0));if(!loveAllowed(th,id)){loveLog(th,{id,from:th.love[id],to:th.love[id],delta:0,reason:"model:absent",at:Date.now()});return}loveWrite(th,id,d,"model:proposal")}});
 if(ctx.kind==="user"&&!Object.keys(r.love||{}).length){const m=mainOf(th);if(loveAllowed(th,m))loveWrite(th,m,1,"model:implicit")}
 if(typeof MIRU_TUNE==="undefined"||!MIRU_TUNE.chat||MIRU_TUNE.chat.reaction!==false){try{if(r&&r.reaction&&String(r.reaction).trim()&&!silent)appendMsg(th,{who:"sys",k:"react",txt:String(r.reaction).slice(0,160),at:Date.now()})}catch(_){}}
 if(!silent)setSugg(r.suggest);else th.sugg=(r.suggest||[]).slice(0,3);
 /* quest goals */
 if(th.quest&&Array.isArray(r.goals)){r.goals.forEach(i=>{i=+i;if(th.quest.goals[i]&&!th.quest.goals[i].done){th.quest.goals[i].done=true;appendMsg(th,{who:"sys",k:"card",title:"🎯 "+t("q.goals"),txt:t("q.found",{g:th.quest.goals[i].t}),at:Date.now()})}
  else if(i===th.quest.goals.length&&!th.quest.hidden.done){th.quest.hidden.done=true;appendMsg(th,{who:"sys",k:"card",title:"✨ "+t("q.hidden"),txt:t("q.hiddenF")+" "+th.quest.hidden.t,at:Date.now()})}})}
 /* stage-ups and the couple moment */
 th.cast.forEach(c=>{const s=stageOf(th,c);if(s>before[c]){if(th._stDown)delete th._stDown[c];appendMsg(th,{who:"sys",k:"card",title:first(ch(c).n)+" · "+t("stage."+s),txt:t("stage."+s+"w"),at:Date.now()})}
  else if(s<before[c]){th._stDown=th._stDown||{};if(th._stDown[c]!==s){th._stDown[c]=s;appendMsg(th,{who:"sys",k:"card",title:first(ch(c).n)+" · "+t("stage."+s),txt:t("st.down",{s:t("stage."+s)}),at:Date.now()})}}});
 if(!silent)levelUpCheck(th,before);
 const m=mainOf(th);
 if(th.rounds>=30&&(th.love[m]||0)>=60&&!S.couples[m]&&!th.cpAsked){th.cpAsked=1;appendMsg(th,{who:"sys",k:"card",title:"💞 "+t("cp.ready"),txt:t("cp.readyS"),btn:t("cp.go"),act:"couple|"+m,at:Date.now()})}
 if(th.quest&&th.rounds>=th.quest.turns&&!th.quest.over){th.quest.over=true;save();setTimeout(()=>questEnd(th),900)}
 save();
 /* 2026-10-27 Ann：语音还在生成/播放时，界面就已经结束这一轮了 —— 读没读完、听没听完都不管。
    现在把「生成中」多留一会儿：直到语音队列播完（最多再等 25 秒，防止卡死）。 */
 try{
  if(!silent && S.voice && S.voice.auto && typeof voiceAutoOK==="function" && voiceAutoOK()){
   typing(true);
   const t0=Date.now();
   const tick=()=>{ const done=VOICE_BUSY<=0; if(done||Date.now()-t0>25000){typing(false);return} setTimeout(tick,250) };
   setTimeout(tick,250);
  }
 }catch(_){}
 if(curT===th.id&&!silent){const cur=$("#s-chat");if(cur&&!cur.hidden){const sc=$("#msgs").scrollTop;renderChat();scrollChat()}}
 if(S.voice.auto&&!silent&&voiceAutoOK()){voiceCount(toSpeak.length);speakQueue(toSpeak)}}
let VOICE_BUSY=0;   // 正在播/正在生成的语音条数（2026-10-27）
function speakQueue(list){VOICE_BUSY++;let i=0;const next=()=>{if(i>=list.length){VOICE_BUSY=Math.max(0,VOICE_BUSY-1);return}const m=list[i++];speak(m.txt,m.who,next)};next()}

/* ================= COMPOSER EVENTS ================= */
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-mode]")){cmode=x.dataset.mode;$$("[data-mode]").forEach(y=>y.classList.toggle("on",y===x));const ta=$("#cin");ta.placeholder=t("cx.ph."+cmode);ta.classList.toggle("dir",cmode==="dir");if(cmode==="dir")toast(t("cx.dirOn"));ta.focus();return}
 if(e.target.closest("[data-send]")){const ta=$("#cin");const v=ta.value;ta.value="";doSend(v,null,true);return}
 if(x=e.target.closest("[data-sg]")){
  /* 2026-10-27：① 点下去立刻反色（原来点完毫无反馈）② （…）是玩家「不吭声」，属于动作，不是内心话
     ③ 先落消息再清选项；忙则排队（见 doSend），绝不静默丢 */
  let v=String(x.dataset.sg||"").trim(),m="say";
  if(v==="[object Object]")return;   // 已经坏掉的选项不发送
  if(/^\*[\s\S]*\*$/.test(v)){m="act";v=v.slice(1,-1)}
  else if(/^[(（][\s\S]*[)）]$/.test(v)){m="act";v=v.slice(1,-1)}
  v=v.trim(); if(!v)return;
  x.classList.add("sel");
  setSugg([]);
  doSend(v,m,false);
  return}
 if(e.target.closest("[data-ideas]")){const th=S.threads[curT];if(sugg.length){setSugg(sugg);return}
  const lang=CL();setSugg([0,1,2].map(()=>pickNR(SUGG_FB[lang],"sg")));return}
 if(e.target.closest("[data-cont]")){const th=S.threads[curT];th.rounds++;reply(th,{kind:"cont"});return}
 if(e.target.closest("[data-cs]")){csSheet();return}
 if(x=e.target.closest("[data-modemore]")){const m2=$("#modes2");if(!m2)return;const open=m2.hidden;m2.hidden=!open;x.classList.toggle("on",open);return}
 if(e.target.closest("[data-plus]")){plusSheet();return}
 if(e.target.closest("[data-cmenu]")){menuSheet();return}
 if(e.target.closest("[data-us]")){usSheet();return}
 if(e.target.closest("[data-qsheet]")){questSheet();return}
 if(x=e.target.closest("[data-mi]")){const i=+x.dataset.mi;openTools=openTools===i?-1:i;renderChat();const el=$('[data-mi="'+i+'"]');el&&el.scrollIntoView({block:"nearest"});return}
 if(x=e.target.closest("[data-mt]")){const[a,i]=x.dataset.mt.split("|");const th=S.threads[curT],m=th.msgs[+i];
  if(a==="play")speak(m.txt,m.who);
  if(a==="save"){S.saved.unshift({tid:th.id,txt:m.txt,who:m.who,at:Date.now()});save();toast(t("msg.saved"))}
  if(a==="snap")imgSheet(th,m);
  if(a==="redo"){let j=th.msgs.length;while(j>0&&th.msgs[j-1].ai)j--;th.msgs=th.msgs.slice(0,j);openTools=-1;save();renderChat();reply(th,{kind:"redo"})}
  return}
 if(x=e.target.closest("[data-cardbtn]")){const th=S.threads[curT],m=th.msgs[+x.dataset.cardbtn];if(m&&m.act&&m.act.startsWith("couple|"))makeCouple(m.act.split("|")[1],th);if(m&&m.act&&m.act.startsWith("call|"))startCall(m.act.split("|")[1]);return}});
document.addEventListener("keydown",e=>{if(e.target.id==="cin"&&e.key==="Enter"&&!e.shiftKey){e.preventDefault();const v=e.target.value;e.target.value="";doSend(v,null,true)}});
document.addEventListener("input",e=>{if(e.target.id==="cin"){e.target.style.height="auto";e.target.style.height=Math.min(120,e.target.scrollHeight)+"px"}});

/* ================= SHEETS: + menu, continue-story, menu, relationship path ================= */
const UNLOCK={games:0,gift:0,quiz:0,date:1,snap:1,truth:2,invite:0,bottle:0,lie:0,heart:0};
function plusSheet(){const th=S.threads[curT],m=mainOf(th),st=stageOf(th,m);
 const it=[["games","🎮","gh.btn"],["gift","🎁","cx.m.gift"],["snap","📷","cx.m.snap"],["date","🌙","cx.m.date"],["quiz","💞","cx.m.quiz"],["truth","🗝","cx.m.truth"],["invite","🚪","cx.m.invite"]];
 sheet('<h2>'+t("cx.more")+'</h2><p class="xs faint" style="margin-top:4px">'+esc(first(ch(m).n))+' · '+t("stage."+st)+'</p><div class="stack" style="margin-top:6px">'+it.map(([k,i,l])=>{const lock=st<UNLOCK[k];
  return '<button class="opt'+(lock?" locked":"")+'" data-pm="'+k+'"><span class="ic">'+i+'</span><span class="grow"><b>'+t(l)+'</b><span>'+(lock?"🔒 "+t("path.lock",{s:t("stage."+UNLOCK[k])}):"")+'</span></span></button>'}).join("")+'</div>')}
function csSheet(){sheet('<h2>'+t("cs.h")+'</h2><p class="sm dim" style="margin-top:4px">'+t("cs.sub")+'</p><div class="stack" style="margin-top:6px">'+
 [["natural","▶️"],["ff","⏩"],["skip","⏳"],["event","✨"],["third","👥"]].map(([k,i])=>'<button class="opt" data-csk="'+k+'"><span class="ic">'+i+'</span><span class="grow"><b>'+t("cs."+k)+'</b><span>'+t("cs."+k+"S")+'</span></span></button>').join("")+
 '<div class="row" style="margin:10px 0 2px"><span class="grow" style="height:1px;background:var(--line)"></span><span class="xs faint">'+t("cs.paid")+'</span><span class="grow" style="height:1px;background:var(--line)"></span></div>'+
 '<button class="opt" data-csk="card"><span class="ic">🎬</span><span class="grow"><b>'+t("cs.card")+' <span class="pill">💎 '+PRICES.card+'</span></b><span>'+t("cs.cardS")+'</span></span></button></div>'+
 '<p class="xs faint" style="text-align:center;margin-top:10px">'+t("cs.note")+'</p>')}
function menuSheet(){const th=S.threads[curT];
 sheet('<div class="stack">'+
  '<button class="opt" data-us="1"><span class="ic">💞</span><span class="grow"><b>'+t("cx.m.us")+'</b></span></button>'+
  (th.wid&&wd(th.wid)?'<button class="opt" data-rxfork="1"><span class="ic">⑂</span><span class="grow"><b>'+t("rx.fromHere")+'</b><span>'+t("rx.fromHereS")+'</span></span></button>':"")+'<button class="opt" data-guide="1"><span class="ic">📘</span><span class="grow"><b>'+t("cx.m.guide")+'</b></span></button>'+
  '<button class="opt" data-voiceplay="1"><span class="ic">🔊</span><span class="grow"><b>'+t("cx.m.voice")+'</b></span><span class="check'+(S.voice.auto?" on":"")+'">'+(S.voice.auto?"✓":"")+'</span></button>'+
  '<button class="opt" data-tier="1"><span class="ic">✦</span><span class="grow"><b>'+(S.tier==="deep"?t("cx.deep"):t("cx.std"))+'</b><span>'+t("cx.deepS")+'</span></span><span class="check'+(S.tier==="deep"?" on":"")+'">'+(S.tier==="deep"?"✓":"")+'</span></button>'+
  (th.quest?'<button class="opt" data-qsheet="1"><span class="ic">🎯</span><span class="grow"><b>'+t("q.goals")+'</b></span></button>':"")+'</div>')}
function pathTasks(th,cid){const r=th.rounds,tk=th.tasks||{};return [
 {st:0,k:"chat",done:r>=10,l:t("task.chat",{a:Math.min(r,10)})},{st:0,k:"quiz",done:!!tk.quiz,l:t("task.quiz")},
 {st:1,k:"date",done:!!tk.date,l:t("task.date")},{st:1,k:"gift",done:!!tk.gift,l:t("task.gift")},
 {st:2,k:"snap",done:!!tk.snap,l:t("task.snap")},{st:2,k:"truth",done:!!tk.truth,l:t("task.truth")},
 {st:3,k:"30",done:r>=30,l:t("task.30",{a:Math.min(r,30)})}]}
function usSheet(){const th=S.threads[curT];closeSheet();
 const tabs=th.cast.length>1?'<div class="hs" style="margin-top:10px">'+th.cast.map(c=>'<button class="chip'+(mainOf(th)===c?" on":"")+'" data-focus-c="'+c+'">'+esc(first(ch(c).n))+'</button>').join("")+'</div>':"";
 const cid=mainOf(th),c=ch(cid),st=stageOf(th,cid),lv=Math.round(th.love[cid]||0),nx=STAGE_MIN[st+1];
 const tasks=pathTasks(th,cid).filter(x=>x.st<=st),next=tasks.find(x=>!x.done);
 sheet('<div class="row">'+avatar(cid,44)+'<div class="grow"><h2>'+t("path.h",{n:esc(first(c.n))})+'</h2><p class="xs faint">'+t("path.stage",{a:st+1})+'</p></div></div>'+tabs+
  '<div class="steps">'+[0,1,2,3,4].map(i=>'<div class="'+(i<st?"past":i===st?"on":"")+'"><i></i><span>'+t("stage."+i)+'</span></div>').join("")+'</div>'+
  '<p class="sm" style="margin-top:12px;line-height:1.6">'+t("stage."+st+"w")+'</p>'+
  (nx!=null?'<p class="xs dim" style="margin-top:10px">'+t("path.next",{s:t("stage."+(st+1))})+' · '+t("path.love",{a:lv,b:nx})+'</p><div class="meter" style="margin-top:6px"><i style="width:'+Math.min(100,(lv-STAGE_MIN[st])/(nx-STAGE_MIN[st])*100)+'%"></i></div>':'<p class="xs" style="color:var(--gold);margin-top:10px">'+t("path.max")+'</p>')+
  '<div class="eyebrow" style="margin-top:16px">'+t("path.do")+'</div><div class="stack" style="gap:6px;margin-top:8px">'+tasks.map(x=>'<button class="task'+(x.done?" done":"")+(x===next?" next":"")+'" data-task="'+x.k+'"><span class="ck">'+(x.done?"✓":"")+'</span><span class="grow">'+esc(x.l)+'</span>'+(x.done?"":'<span style="color:var(--gold)">›</span>')+'</button>').join("")+'</div>'+
  (st>=3?'<div class="card" style="margin-top:14px"><div class="eyebrow">'+t(fem(c)?"ch.secretF":"ch.secret")+'</div><p class="sm" style="margin-top:6px;line-height:1.55">'+esc(Lz(c.secret))+'</p></div>':""))}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-focus-c]")){S.threads[curT].focus=x.dataset.focusC;save();usSheet();return}
 if(x=e.target.closest("[data-task]")){const k=x.dataset.task;closeSheet();if(k==="chat"||k==="30"){$("#cin")&&$("#cin").focus();return}runPlus(k);return}
 if(x=e.target.closest("[data-pm]")){const k=x.dataset.pm,th=S.threads[curT],st=stageOf(th,mainOf(th));if(st<UNLOCK[k]){toast(t("path.lock",{s:t("stage."+UNLOCK[k])}));return}closeSheet();runPlus(k);return}
 if(x=e.target.closest("[data-csk]")){const k=x.dataset.csk,th=S.threads[curT];closeSheet();
  if(k==="natural"){th.rounds++;reply(th,{kind:"cont"})}else if(k==="ff"||k==="skip"||k==="event")reply(th,{kind:k});
  else if(k==="third")inviteSheet();else if(k==="card")cardSheet();return}
 if(e.target.closest("[data-rxfork]")){const th=S.threads[curT];closeSheet();createRemix(th.wid,th.msgs.filter(m=>m.txt&&m.k!=="card"));return}
 if(e.target.closest("[data-guide]")){sheet('<h2>'+t("st.guide")+'</h2><p class="sm" style="margin-top:10px;line-height:1.7">'+t("st.guideT")+'</p>');return}
 if(e.target.closest("[data-voiceauto]")){S.voice.auto=!S.voice.auto;save();menuSheet();return}
 if(e.target.closest("[data-tier]")){if(S.tier!=="deep"&&!S.plus&&S.keys<1){toast(t("g.nokeys"));return}S.tier=S.tier==="deep"?"std":"deep";save();menuSheet();return}});
function runPlus(k){({gift:giftSheet,snap:()=>booth(mainOf(S.threads[curT])),date:dateSheet,quiz:()=>quiz(mainOf(S.threads[curT])),truth:truthSheet,invite:inviteSheet,bottle:bottleGame,lie:lieGame,heart:heartGame,games:gameHub}[k]||(()=>{}))()}
function giftSheet(){sheet('<h2>'+t("gift.h")+'</h2><p class="xs faint" style="margin-top:4px">💎 '+S.keys+'</p><div class="stack" style="margin-top:6px">'+GIFTS.map(g=>'<button class="opt" data-gift="'+g.id+'"><span class="ic">'+g.ic+'</span><span class="grow"><b>'+esc(Lz(g.n))+'</b><span>♥ +'+g.love+'</span></span><span class="pill">'+(g.cost?"💎 "+g.cost:t("gift.free"))+'</span></button>').join("")+'</div>')}
function dateSheet(){sheet('<h2>'+t("date.h")+'</h2><div class="stack" style="margin-top:6px">'+["diner","roof","drive","water"].map((k,i)=>'<button class="opt" data-date="'+k+'"><span class="ic">'+["🍳","🌃","🚗","🌊"][i]+'</span><span class="grow"><b>'+t("date."+k)+'</b></span></button>').join("")+'</div>')}
function truthSheet(){sheet('<h2>'+t("truth.h")+'</h2><p class="sm dim" style="margin-top:6px">'+t("truth.sub")+'</p><div class="field" style="margin-top:12px"><textarea id="truthQ" rows="3" placeholder="'+esc(t("truth.ph"))+'"></textarea></div><button class="btn btn-p btn-block" style="margin-top:10px" data-truthgo="1">'+t("truth.ask")+'</button>')}
function inviteSheet(){const th=S.threads[curT];const ids=allChars().filter(id=>!th.cast.includes(id));
 sheet('<h2>'+t("inv.h")+'</h2><p class="sm dim" style="margin-top:4px">'+t("inv.sub")+'</p>'+pickSearch("invPickQ","invPickGrid")+'<div class="pick" id="invPickGrid" style="margin-top:14px">'+ids.map(id=>'<button data-inv="'+id+'">'+avatar(id,56)+'<span>'+esc(first(ch(id).n))+'</span></button>').join("")+'</div>')}
function cardSheet(){if(S.keys<PRICES.card){paySheet("event");return}
 sheet('<h2>'+t("cs.card")+'</h2><div class="row" style="gap:8px;margin-top:12px">'+["romance","drama","angst"].map(k=>'<button class="chip" data-ctype="'+k+'">'+{romance:"💗 Romance",drama:"🔥 Drama",angst:"🌧 Angst"}[k]+'</button>').join("")+'</div><div id="cards" class="stack" style="gap:8px;margin-top:12px"></div>')}
document.addEventListener("click",e=>{let x;const th=S.threads[curT];
 if(x=e.target.closest("[data-gift]")){const g=GIFTS.find(y=>y.id===x.dataset.gift);if(!toolGate(th,'gift',{perScene:MIRU_TUNE.tools.giftPerScene,cooldownMs:MIRU_TUNE.tools.cooldownMs}).ok)return;if(g.cost&&!spend(g.cost,"gift"))return;
  const m=mainOf(th);loveWrite(th,m,g.love,"gift");toolUse(th,'gift');th.tasks.gift=1;th.mem.push(me()+" gave "+ch(m).n+" "+Lz(g.n));closeSheet();
  appendMsg(th,{who:"sys",k:"card",title:g.ic+" "+t("cx.m.gift"),txt:t("gift.given",{n:first(ch(m).n),g:Lz(g.n)}),at:Date.now()});reply(th,{kind:"gift",txt:Lz(g.n),cid:m});return}
 if(x=e.target.closest("[data-date]")){if(!toolGate(th,'date',{perScene:MIRU_TUNE.tools.datePerScene,cooldownMs:MIRU_TUNE.tools.cooldownMs}).ok)return;const m=mainOf(th),pl=t("date."+x.dataset.date);th.tasks.date=1;toolUse(th,'date');loveWrite(th,m,6,"date");th.status.place=pl;th.mem.push(me()+" took "+ch(m).n+" to "+pl);closeSheet();
  appendMsg(th,{who:"sys",k:"card",title:"🌙 "+t("cx.m.date"),txt:t("date.go",{n:first(ch(m).n),p:pl}),at:Date.now()});reply(th,{kind:"date",txt:pl,cid:m});return}
 if(e.target.closest("[data-truthgo]")){const q=($("#truthQ").value||"").trim();if(!q)return;if(!toolGate(th,'truth',{perScene:MIRU_TUNE.tools.truthPerScene,cooldownMs:MIRU_TUNE.tools.cooldownMs}).ok)return;const m=mainOf(th);th.tasks.truth=1;toolUse(th,'truth');loveWrite(th,m,5,"truth");closeSheet();
  appendMsg(th,{who:"me",k:"say",txt:q,at:Date.now()});th.rounds++;th.mem.push(me()+" asked "+ch(m).n+" an honest question: "+q);reply(th,{kind:"truth",txt:q,cid:m});return}
 if(x=e.target.closest("[data-inv]")){const id=x.dataset.inv,c=ch(id);th.cast.push(id);loveWrite(th,id,0,"invite",{absolute:5});closeSheet();
  appendMsg(th,{who:"sys",k:"card",title:"🚪 "+t("cs.third"),txt:t("inv.done",{n:c.n}),at:Date.now()});th.mem.push(c.n+" ("+Lz(c.role)+") walked in from another story");reply(th,{kind:"third",txt:c.n+", "+Lz(c.role)});return}
 if(x=e.target.closest("[data-ctype]")){const k=x.dataset.ctype;const pool=EVENTS.filter(v=>v.k===k).concat(EVENTS.filter(v=>v.k!==k)).slice(0,3);
  $("#cards").innerHTML=pool.map(v=>'<button class="opt" data-card="'+v.id+'"><span class="ic">🃏</span><span class="grow"><b>'+esc(Lz(v.t))+'</b><span>'+esc(Lz(v.d))+'</span></span></button>').join("");return}
 if(x=e.target.closest("[data-card]")){const v=EVENTS.find(y=>y.id===x.dataset.card);if(!spend(PRICES.card,"event"))return;closeSheet();
  appendMsg(th,{who:"sys",k:"card",title:"🃏 "+Lz(v.t),txt:Lz(v.d),at:Date.now()});reply(th,{kind:"card",txt:Lz(v.t)+" — "+Lz(v.d)});return}});

/* ================= QUIZ ================= */
let qz=null;
function quiz(cid){qz={cid,i:0,score:0};quizStep()}
function quizStep(){const c=ch(qz.cid);
 if(qz.i>=QUIZ.length){const th=S.threads[curT];th.tasks.quiz=1;loveWrite(th,qz.cid,qz.score*2,"quiz");th.mem.push("Sync quiz with "+c.n+": "+qz.score+"/5 matched");closeSheet();
  appendMsg(th,{who:"sys",k:"card",title:"💞 "+t("quiz.h"),txt:t("quiz.res",{n:qz.score}),at:Date.now()});reply(th,{kind:"user",txt:"(We just finished a sync quiz: "+qz.score+"/5 answers matched. React to that.)"});return}
 const q=QUIZ[qz.i];
 sheet('<div class="row"><div class="eyebrow grow">'+t("quiz.h")+' · '+(qz.i+1)+'/5</div><span class="xs faint">'+t("quiz.res",{n:qz.score})+'</span></div><h2 style="margin-top:10px;font-size:22px">'+esc(Lz(q[0]))+'</h2>'+
  '<div class="stack" style="gap:8px;margin-top:14px">'+[1,2].map(k=>'<button class="bigopt" data-qa="'+k+'"><span class="grow"><b>'+esc(Lz(q[k]))+'</b></span></button>').join("")+'</div><div id="qres"></div>')}
document.addEventListener("click",async e=>{const x=e.target.closest("[data-qa]");if(!x||!qz)return;
 const mine=+x.dataset.qa,th=S.threads[curT],lv=th.love[qz.cid]||0;$$("[data-qa]").forEach(b=>b.disabled=true);x.classList.add("on");
 let his=Math.random()<(.45+lv*.004)?mine:(mine===1?2:1),line="";
 if(liveOn()){try{const c=ch(qz.cid),q=QUIZ[qz.i];const r=await ask("You are "+c.n+" ("+Lz(c.vibe)+"). Two-option question from "+me()+": \""+Lz(q[0])+"\" A) "+Lz(q[1])+" B) "+Lz(q[2])+". Closeness "+Math.round(lv)+"/100. Pick honestly for your character. Reply only JSON {\"pick\":\"A\"|\"B\",\"line\":\"one short in-character sentence, in "+LANG_NAME[S.lang]+"\"}",{modelTier:"quick"});
  if(r&&(r.pick==="A"||r.pick==="B")){his=r.pick==="A"?1:2;line=r.line||""}}catch(_){}}
 const hit=his===mine;if(hit)qz.score++;
 $("#qres").innerHTML='<div class="card" style="margin-top:12px"><div class="eyebrow" style="color:'+(hit?"var(--mint)":"var(--rose)")+'">'+(hit?t("quiz.match"):t("quiz.miss"))+'</div><p class="sm" style="margin-top:6px">'+t("quiz.said",{n:esc(first(ch(qz.cid).n))})+' <b>'+esc(Lz(QUIZ[qz.i][his]))+'</b></p>'+(line?'<p class="sm dim" style="margin-top:6px;font-style:italic">“'+esc(line)+'”</p>':"")+
  '<button class="btn btn-p btn-sm" style="margin-top:10px" data-qnext="1">'+t("ob.next")+'</button></div>';});
document.addEventListener("click",e=>{if(e.target.closest("[data-qnext]")){qz.i++;quizStep()}});

/* ================= POLAROID ================= */
const LOOKS=[{z:1.9,x:.5,y:.28,rot:-2,tint:"rgba(255,196,150,.18)"},{z:1.35,x:.42,y:.34,rot:3,tint:"rgba(255,120,150,.14)"},{z:2.3,x:.55,y:.24,rot:-4,tint:"rgba(0,0,0,0)",mono:1},{z:1.6,x:.62,y:.32,rot:2,tint:"rgba(120,150,255,.14)"}];
function loadImg(src){return new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=src})}
async function frame(cid,i,size){const im=await loadImg(artSrc(cid)),L0=LOOKS[i%4],S0=size||320,cv=document.createElement("canvas");cv.width=S0;cv.height=S0;const x=cv.getContext("2d");
 x.fillStyle="#111";x.fillRect(0,0,S0,S0);x.save();x.translate(S0/2,S0/2);x.rotate(L0.rot*Math.PI/180);
 const sw=im.width/L0.z,sx=Math.max(0,Math.min(im.width-sw,im.width*L0.x-sw/2)),sy=Math.max(0,Math.min(im.height-sw,im.height*L0.y-sw/2));
 if(L0.mono)x.filter="grayscale(1) contrast(1.15)";x.drawImage(im,sx,sy,sw,sw,-S0*.56,-S0*.56,S0*1.12,S0*1.12);x.restore();x.filter="none";
 x.fillStyle=L0.tint;x.fillRect(0,0,S0,S0);let g=x.createRadialGradient(S0*.5,S0*.35,S0*.05,S0*.5,S0*.4,S0*.75);g.addColorStop(0,"rgba(255,250,240,.22)");g.addColorStop(.55,"rgba(255,255,255,0)");g.addColorStop(1,"rgba(0,0,0,.55)");x.fillStyle=g;x.fillRect(0,0,S0,S0);
 const d=x.getImageData(0,0,S0,S0),p=d.data;for(let k=0;k<p.length;k+=4){const n=(Math.random()-.5)*24;p[k]+=n;p[k+1]+=n;p[k+2]+=n}x.putImageData(d,0,0);
 const dt=new Date();x.font="bold 14px monospace";x.fillStyle="rgba(255,150,60,.9)";x.textAlign="right";x.fillText("'"+String(dt.getFullYear()).slice(2)+" "+(dt.getMonth()+1)+" "+dt.getDate(),S0-10,S0-10);return cv}
let bFrames=[];
function booth(cid){bFrames=[null,null,null,null];boothUI(cid)}
function boothUI(cid){sheet('<h2>'+t("snap.h")+'</h2><p class="sm dim" style="margin-top:4px">'+t("snap.sub")+'</p><div class="strip">'+bFrames.map(f=>'<div class="fr">'+(f?'<img src="'+f.toDataURL("image/jpeg",.8)+'">':'')+'</div>').join("")+'</div>'+
 '<div class="row" style="margin-top:14px"><button class="btn btn-g grow" data-shoot="'+cid+'">'+(bFrames[0]?t("snap.again"):t("snap.take"))+'</button><button class="btn btn-p grow" data-keep="'+cid+'"'+(bFrames[3]?"":" disabled")+'>'+t("snap.keep")+'</button></div>')}
document.addEventListener("click",async e=>{let x;
 if(x=e.target.closest("[data-shoot]")){const cid=x.dataset.shoot;bFrames=[null,null,null,null];x.disabled=true;
  for(let i=0;i<4;i++){for(let n=3;n>0;n--){const b=$("[data-shoot]");if(b)b.textContent=n+"…";await new Promise(r=>setTimeout(r,330))}
   const fl=document.createElement("div");fl.className="flash";$("#dev").appendChild(fl);setTimeout(()=>fl.remove(),450);
   try{bFrames[i]=await frame(cid,i)}catch(_){}boothUI(cid)}return}
 if(x=e.target.closest("[data-keep]")){const cid=x.dataset.keep,th=S.threads[curT];
  const W0=640,cv=document.createElement("canvas");cv.width=W0;cv.height=W0;const g=cv.getContext("2d");g.fillStyle="#0c0a10";g.fillRect(0,0,W0,W0);
  bFrames.forEach((f,i)=>{if(f)g.drawImage(f,(i%2)*(W0/2)+6,Math.floor(i/2)*(W0/2)+6,W0/2-12,W0/2-12)});
  const aid="a"+Date.now();S.album.unshift({id:aid,cid,src:mediaWrap("album:"+aid,cv.toDataURL("image/jpeg",.72)),at:Date.now()});if(S.album.length>12)S.album.length=12;th.tasks.snap=1;loveWrite(th,cid,5,"photobooth");th.mem.push("Took a photo-booth strip with "+ch(cid).n);closeSheet();
  appendMsg(th,{who:"me",k:"img",aid,at:Date.now()});toast(t("snap.saved"));reply(th,{kind:"user",txt:"(We just took a four-frame photo-booth strip together. React to seeing the photos.)"});}});
/* 生图: a 9:16 scene still built from this story's real footage (or the portrait) + the line as a subtitle.
   Works with no network/AI; if the canvas can't be exported it falls back to a live DOM card. */
function imgPrompt(th,m){const c=ch(m.who),w=th.wid?wd(th.wid):null,pose=poseOf(m);
 const P={idle:"standing still, looking at the viewer",smile:"a small reluctant smile",close:"leaning in close to the viewer, intimate framing",angry:"jaw clenched, eyes hard",sad:"eyes lowered, shoulders heavy",away:"turned half away from the viewer, looking over the shoulder",surprised:"caught off guard, eyes wide",think:"lost in thought, gaze unfocused"}[pose];
 return "Cinematic vertical 9:16 still, photoreal romance drama key art. "+c.n+", "+c.age+": "+Lz(c.looks)+" "+(fem(c)?"She is ":"He is ")+P+". Setting: "+(th.status.place||(w?Lz(w.status.place):""))+", "+(th.status.time||"")+". Moment: \""+m.txt+"\". Moody film lighting, shallow depth of field. Use the attached portrait as the face reference. No text, no logos. Adult."}
const IMG={n:0};
function imgSources(th,m){const pose=poseOf(m),out=[],wid=th.wid,L=wid&&SCENE[wid];
 if(L){const sc=L.map(([c,ws,p])=>({v:V_(wid,c),s:(ws[0]===m.who?4:0)+(ws.includes(m.who)?2:0)+(p===pose?3:0)})).sort((a,b)=>b.s-a.s);
  sc.forEach((o,k)=>{[2.2,4.6,6.4].forEach(tm=>out.push({v:o.v,tm:tm+(hash(m.txt)%7)/10}))})}
 const pa=POSE_ART[m.who+":"+pose];out.push({im:pa?"art/poses/"+pa:artSrc(m.who)});
 const c2=(th.cast||[]).find(x=>x!==m.who);if(c2)out.push({im:artSrc(c2)});return out}
function grabFrame(src,tm,noCors){return new Promise((res,rej)=>{const v=document.createElement("video");if(!noCors)v.crossOrigin="anonymous";v.muted=true;v.playsInline=true;v.preload="auto";v.src=vidSrc(src);
 const to=setTimeout(()=>rej("to"),6000);v.addEventListener("loadedmetadata",()=>{v.currentTime=Math.min(tm,(v.duration||8)-.3)},{once:true});
 v.addEventListener("seeked",()=>{clearTimeout(to);res(v)},{once:true});v.addEventListener("error",()=>{clearTimeout(to);rej("err")},{once:true});v.load()})}
function wrapLines(x,txt,maxW){const out=[];let line="";const toks=/[\u3000-\u9fff\uac00-\ud7af]/.test(txt)?[...txt]:txt.split(/(\s+)/);
 for(const w0 of toks){if(line&&x.measureText(line+w0).width>maxW){out.push(line.trim());line=""}line+=w0}if(line.trim())out.push(line.trim());return out}
async function sceneStill(th,m,o){const W0=540,H0=960,cv=document.createElement("canvas");cv.width=W0;cv.height=H0;const x=cv.getContext("2d");
 x.fillStyle="#0b0a0e";x.fillRect(0,0,W0,H0);let el,iw,ih;
 if(o.v){try{el=await grabFrame(o.v,o.tm)}catch(_){el=await grabFrame(o.v,o.tm,1)}iw=el.videoWidth;ih=el.videoHeight}else{el=await loadImg(o.im);iw=el.width;ih=el.height}
 const s=Math.max(W0/iw,H0/ih)*(o.v?1.04:1),dw=iw*s,dh=ih*s;x.filter="contrast(1.06) saturate(.92)";x.drawImage(el,(W0-dw)/2,o.v?(H0-dh)/2:Math.min(0,(H0-dh)*.25),dw,dh);x.filter="none";
 let g=x.createLinearGradient(0,H0*.55,0,H0);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.82)");x.fillStyle=g;x.fillRect(0,0,W0,H0);
 g=x.createRadialGradient(W0/2,H0*.42,W0*.2,W0/2,H0*.5,H0*.75);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.45)");x.fillStyle=g;x.fillRect(0,0,W0,H0);
 x.textAlign="center";x.font="600 26px -apple-system, 'PingFang SC', 'Noto Sans SC', sans-serif";x.shadowColor="rgba(0,0,0,.9)";x.shadowBlur=8;
 const ls=wrapLines(x,m.txt,W0-70).slice(0,4);let y=H0-60-(ls.length-1)*36;x.fillStyle="#fff";ls.forEach(l=>{x.fillText(l,W0/2,y);y+=36});
 x.shadowBlur=0;x.font="600 15px -apple-system, sans-serif";x.fillStyle="rgba(255,255,255,.7)";x.fillText(ch(m.who).n.toUpperCase()+(th.wid?"  ·  "+Lz(wd(th.wid).title||wd(th.wid).n||""):""),W0/2,H0-60-(ls.length-1)*36-44);
 x.textAlign="left";x.font="bold 13px monospace";x.fillStyle="rgba(255,255,255,.55)";x.fillText("MIRU",18,28);return cv}
function imgSheet(th,m){IMG.th=th;IMG.m=m;IMG.list=imgSources(th,m);IMG.n=0;IMG.cv=null;
 IMG.o=null;sheet('<h2>'+t("msg.img")+'</h2><p class="xs faint" style="margin-top:4px">'+t("img.sub")+'</p><div id="imgPrev" class="imgprev"><div class="spin"></div></div>'+
 '<div class="row" style="margin-top:12px"><button class="btn btn-g" data-imgnext="1">↻ '+t("img.next")+'</button><button class="btn btn-p grow" data-imgkeep="1">'+t("img.keep")+'</button></div>'+
 (AIG.mcp?'<button class="btn btn-p" style="width:100%;margin-top:8px" data-aigen="1">✨ '+t("ai.gen")+'</button><p id="aiSt" class="xs faint" style="margin-top:6px;text-align:center;min-height:14px"></p>':"")+
 '<div class="row" style="margin-top:8px"><button class="btn btn-g grow" data-imgshare="1">📤 '+t("shr.h")+'</button><button class="btn btn-g grow" data-imgcopy="1">'+t("img.copy")+'</button></div><div id="imgPr"></div>');IMG.tok=(IMG.tok||0)+1;IMG.busy=false;imgDraw();if(AIG.mcp)aiGenerate(1)}
async function imgDraw(){const L=IMG.list,pv=$("#imgPrev");if(!pv)return;if(IMG.o&&IMG.o.ai&&IMG.busy)return;pv.innerHTML='<div class="spin"></div>';IMG.cv=null;IMG.url=null;
 for(let k=0;k<L.length;k++){const o=L[(IMG.n+k)%L.length];try{const cv=await sceneStill(IMG.th,IMG.m,o);if(IMG.o&&IMG.o.ai)return;let url=null;try{url=cv.toDataURL("image/jpeg",.8)}catch(_){}
   IMG.o=o;IMG.cv=cv;IMG.url=url;IMG.n=(IMG.n+k)%L.length;
   if(url)pv.innerHTML='<img src="'+url+'" alt="">';else{pv.innerHTML="";cv.style.width="100%";cv.style.display="block";pv.appendChild(cv)}return}catch(_){}}
 pv.innerHTML='<p class="xs faint" style="padding:30px">'+t("img.fail")+'</p>'}
document.addEventListener("click",e=>{
 if(e.target.closest("[data-imgnext]")){IMG.tok++;IMG.busy=false;IMG.o=null;IMG.n=(IMG.n+1)%Math.max(1,(IMG.list||[]).length);imgDraw();return}
 if(e.target.closest("[data-imgkeep]")){if(!IMG.cv){toast(t("img.wait"));return}const th=IMG.th,m=IMG.m,aid="a"+Date.now();
  const it={id:aid,cid:m.who,at:Date.now()};if(IMG.url)it.src=IMG.url;else if(IMG.o.v){it.v=IMG.o.v;it.tm=IMG.o.tm;it.cap=m.txt}else it.src=IMG.o.im;
  S.album.unshift(it);if(S.album.length>12)S.album.length=12;closeSheet();appendMsg(th,{who:"me",k:"img",aid,at:Date.now()});toast(t("snap.saved"));return}
 if(e.target.closest("[data-imgcopy]")&&IMG.m){const p=imgPrompt(IMG.th,IMG.m),box=$("#imgPr");
  if(box){box.innerHTML='<textarea class="imgpr" readonly>'+esc(p)+'</textarea><p class="xs faint" style="margin-top:6px;line-height:1.5">'+t("img.note")+'</p>';const ta=box.querySelector("textarea");ta.focus();ta.select()}
  let ok=false;try{ok=document.execCommand("copy")}catch(_){}
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(p).then(()=>toast(t("sh.copied"))).catch(()=>{if(ok)toast(t("sh.copied"))});else if(ok)toast(t("sh.copied"));return}});
/* image messages are a fixed-size box painted with two layers — the photo, and the character's portrait underneath —
   so even if the photo can't be shown in this viewer, the card is never an empty strip */
function albumHtml(a){const fb=esc(artSrc(a.cid||""));
 if(a&&a.src)return '<div class="mimg" data-amid="'+a.id+'" style="background-image:url(&quot;'+esc(albumSrc(a))+'&quot;),url(&quot;'+fb+'&quot;)"></div>';
 if(a.v)return '<div class="alv"><video muted playsinline autoplay loop preload="auto" poster="'+fb+'" src="'+esc(vidSrc(a.v))+'#t='+(+a.tm||2)+'"></video><span>'+esc(a.cap||"")+'</span></div>';
 return '<div class="mimg" style="background-image:url(&quot;'+fb+'&quot;)"></div>'}
/* ---------- real AI image generation (FLUX.1 Krea via the viewer's "flux" Hugging Face connector) ---------- */
const AIG={srv:"flux",tool:"gr1_flux_1_krea_dev_infer",edit:"gr2_flux_1_kontext_dev_infer",tts:"gr3_chatterbox_generate_tts_audio",mcp:undefined};
(async()=>{try{if(window.claude&&typeof claude.use==="function"){AIG.mcp=(await claude.use("mcp"))||null}else AIG.mcp=null}catch(_){AIG.mcp=null}})();
const isAscii=s=>/^[\x00-\x7F—’“”]*$/.test(String(s||""));
function aiPromptBase(th,m){const c=ch(m.who),w=th.wid?wd(th.wid):null,pose=poseOf(m);
 const looks=(c.looks&&c.looks.en)||Lz(c.looks)||"";
 const P={idle:"standing still, looking straight at the camera",smile:"a small reluctant smile, eyes soft",close:"leaning in very close to the camera, intimate framing",angry:"jaw clenched, eyes hard, tense shoulders",sad:"eyes lowered, shoulders heavy, quiet",away:"turned half away, looking back over the shoulder",surprised:"caught off guard, eyes wide, lips parted",think:"lost in thought, gaze unfocused, hand near the mouth"}[pose];
 const place=isAscii(th.status.place)?th.status.place:(w&&w.status&&w.status.place&&w.status.place.en)||"a dimly lit room";
 const time=w&&w.status&&w.status.time&&w.status.time.en||"";
 return {c,looks:looks.replace(/scar[^,.]*[,.]?/gi,""),P,place,time,line:m.txt}}
function aiTemplate(b){return ("Cinematic vertical film still from a romance drama. "+(fem(b.c)?"A beautiful woman":"A handsome man")+", "+b.c.age+" years old, "+b.looks+" "+b.P+". Setting: "+b.place+(b.time?", "+b.time.split("·")[0].trim():"")+". Moody practical lighting, 35mm lens, f/1.8, shallow depth of field, soft film grain, realistic skin texture. Adult, fully clothed. No text, no letters, no watermark.").replace(/\s+/g," ")}
async function aiPrompt(th,m){const b=aiPromptBase(th,m),base=aiTemplate(b);
 if(!SAMPLE)return base;
 try{const r=await SAMPLE("Write ONE English prompt (max 70 words) for the FLUX text-to-image model: a photoreal cinematic vertical still of this exact moment in a romance drama. Keep the character's look exactly; show the body language and setting; no dialogue, no text in image, adult, fully clothed. Output only the prompt.\n\nCharacter: "+b.c.n+", "+b.c.age+", "+(fem(b.c)?"woman":"man")+". Look: "+b.looks+"\nBody language: "+b.P+"\nSetting: "+b.place+" "+b.time+"\nThe line just spoken (may be Chinese): "+b.line+"\nBase prompt to improve: "+base,{modelTier:"quick"});
  const p=String((r&&r.text)||"").trim().replace(/^["'`]+|["'`]+$/g,"");return p.length>40?p+" No text, no watermark.":base}catch(_){return base}}
function aiRefUrl(cid){const a=artSrc(cid);if(!a||/^(data|blob):/.test(a))return null;try{const u=new URL(a,location.href);return /^https:/.test(u.href)&&!/localhost|127\.0\.0\.1/.test(u.host)?u.href:null}catch(_){return null}}
function aiKontextTemplate(b){return ("Keep this exact person's face, hair and build unchanged. Change the scene: "+b.P+". Setting: "+b.place+(b.time?", "+b.time.split("·")[0].trim():"")+". Cinematic vertical film still, moody practical lighting, shallow depth of field, photoreal, fully clothed. No text, no letters.").replace(/\s+/g," ")}
async function aiKontextPrompt(th,m){const b=aiPromptBase(th,m),base=aiKontextTemplate(b);if(!SAMPLE)return base;
 try{const r=await SAMPLE("Write ONE English image-EDIT instruction (max 55 words) for FLUX Kontext. The input image is the character's portrait. It must start with: Keep this exact person's face, hair and build unchanged. Then describe the new scene for this exact moment of a romance drama: body language, setting, lighting, camera. Photoreal, cinematic, adult, fully clothed, no text. Output only the instruction.\n\nCharacter: "+b.c.n+". Body language: "+b.P+"\nSetting: "+b.place+" "+b.time+"\nThe line just spoken (may be Chinese): "+b.line+"\nBase: "+base,{modelTier:"quick"});
  const p=String((r&&r.text)||"").trim().replace(/^["'`]+|["'`]+$/g,"");return p.length>40?p:base}catch(_){return base}}
function aiImgFrom(res){const c=(res&&res.content)||[];const im=c.find(x=>x&&x.type==="image"&&x.data);if(im)return "data:"+(im.mimeType||"image/webp")+";base64,"+im.data;
 const tx=c.filter(x=>x&&x.type==="text").map(x=>x.text).join("\n");const u=(tx.match(/https?:\/\/\S+?\.(?:webp|png|jpe?g)/i)||[])[0];return u||null}
function aiErrMsg(e,kind){const k=(e&&e.code)||"";const p=kind==="voice"?"voice.e.":"ai.e.";
 return k==="server_not_connected"||k==="server_not_found"?t(p+"conn"):k==="needs_reauth"?t(p+"reauth"):k==="not_in_manifest"||k==="consent_required"?t(p+"denied"):
 k==="server_unavailable"||k==="upstream_error"||k==="rate_limited"?t(p+"busy"):k==="tool_error"?t(p+"tool")+(e.message?" ("+String(e.message).slice(0,90)+")":""):t(p+"other")}
/* ---------- real AI voice generation (Chatterbox TTS via the "flux" connector) ----------
   Each character gets a fixed exaggeration/pace/seed "fingerprint" so the same character always
   sounds the same across lines, even though no two characters share a cloned reference voice yet. */
const VOICEFP={mason:{exaggeration:.55,cfgw:.5,temperature:.75,seed:101},ethan:{exaggeration:.4,cfgw:.55,temperature:.65,seed:202},
 lucien:{exaggeration:.7,cfgw:.4,temperature:.9,seed:303},wren:{exaggeration:.5,cfgw:.5,temperature:.8,seed:404},
 iris:{exaggeration:.6,cfgw:.5,temperature:.8,seed:505},dante:{exaggeration:.75,cfgw:.4,temperature:.95,seed:606},
 caelan:{exaggeration:.45,cfgw:.55,temperature:.7,seed:707},nikolai:{exaggeration:.5,cfgw:.5,temperature:.75,seed:808}};
const AIVOICE={busy:false,cache:{}};
function aiAudioFrom(res){const c=(res&&res.content)||[];const au=c.find(x=>x&&x.type==="audio"&&x.data);if(au)return "data:"+(au.mimeType||"audio/wav")+";base64,"+au.data;
 const im=c.find(x=>x&&x.type==="image"&&x.data);if(im)return "data:"+(im.mimeType||"audio/wav")+";base64,"+im.data;
 const tx=c.filter(x=>x&&x.type==="text").map(x=>x.text).join("\n");const u=(tx.match(/https?:\/\/\S+?\.(?:wav|mp3|flac|ogg)/i)||[])[0];return u||null}
async function aiSpeak(id,text,onDone,onErr,onSrc){
 try{if(AIG.mcp===undefined)await new Promise(r=>setTimeout(r,300));
  if(!AIG.mcp){if(onErr)onErr(t("voice.e.conn"));return false}
  if(AIVOICE.busy)return false;
  const clean=String(text||"").replace(/[*()（）]/g,"").slice(0,290);
  const k=id+"|"+clean;
  if(AIVOICE.cache[k]){if(onSrc)onSrc(AIVOICE.cache[k]);stopVoice();const a=new Audio(AIVOICE.cache[k]);AUD_CUR=a;if(onDone)a.onended=onDone;a.play().catch(()=>{});return true}
  AIVOICE.busy=true;const fp=VOICEFP[id]||{exaggeration:.5,cfgw:.5,temperature:.8,seed:0};
  const res=await AIG.mcp.callTool(AIG.srv,AIG.tts,{text_input:clean,exaggeration_input:fp.exaggeration,cfgw_input:fp.cfgw,temperature_input:fp.temperature,seed_num_input:fp.seed},{cache:false});
  const src=aiAudioFrom(res);if(!src)throw{code:"tool_error",message:"no audio"};
  AIVOICE.cache[k]=src;if(onSrc)onSrc(src);stopVoice();const a=new Audio(src);AUD_CUR=a;if(onDone)a.onended=onDone;a.play().catch(()=>{});return true}
 catch(e){if(onErr)onErr(aiErrMsg(e,"voice"));return false}
 finally{AIVOICE.busy=false}}
async function aiGenerate(auto){if(!AIG.mcp||IMG.busy)return;const d=today();S.imgDay=S.imgDay&&S.imgDay.d===d?S.imgDay:{d,n:0};
 if(S.imgDay.n>=(S.plus?10:1)){if(auto){const st=$("#aiSt");if(st)st.innerHTML=t("pay.imgFree");return}if(!spend(PRICES.img,"img"))return}else{S.imgDay.n++;save()}IMG.busy=true;const th=IMG.th,m=IMG.m,pv=$("#imgPrev"),st=$("#aiSt"),tk=IMG.tok=(IMG.tok||0)+1;
 const btn=$("[data-aigen]");if(btn)btn.disabled=true;if(st)st.textContent=t("ai.writing");if(pv)pv.classList.add("gen");
 try{let res=null,prompt="";const ref=aiRefUrl(m.who);
  if(ref){try{prompt=await aiKontextPrompt(th,m);if(st&&tk===IMG.tok)st.textContent=t("ai.painting");
    res=await AIG.mcp.callTool(AIG.srv,AIG.edit,{input_image:ref,prompt,steps:20,guidance_scale:2.5,randomize_seed:true},{cache:false})}
   catch(e1){const k=e1&&e1.code;if(k==="server_not_connected"||k==="needs_reauth"||k==="blocked_by_policy")throw e1;res=null}}
  if(!res||!aiImgFrom(res)){prompt=await aiPrompt(th,m);if(st&&tk===IMG.tok)st.textContent=t("ai.painting");
   res=await AIG.mcp.callTool(AIG.srv,AIG.tool,{prompt,width:576,height:1024,num_inference_steps:24,randomize_seed:true},{cache:false})}
  if(tk!==IMG.tok||IMG.m!==m)return;const src=aiImgFrom(res);if(!src)throw{code:"tool_error",message:"no image"};
  const cv=await sceneStill(th,m,{im:src});let url=null;try{url=cv.toDataURL("image/jpeg",.78)}catch(_){}
  IMG.o={im:src,ai:1};IMG.cv=cv;IMG.url=url;IMG.prompt=prompt;
  if(pv){pv.innerHTML=url?'<img src="'+url+'" alt="">':"";if(!url){cv.style.width="100%";pv.appendChild(cv)}}
  if(st)st.innerHTML='<span class="aibadge">✨ AI</span> '+t("ai.done");
  if(typeof taskClaimDay==="function"&&taskClaimDay("genimg",1))setTimeout(()=>toast(t("task.gotGenimg")),300)}
 catch(e){if(st&&tk===IMG.tok)st.textContent=aiErrMsg(e)}
 finally{IMG.busy=false;if(pv)pv.classList.remove("gen");const b2=$("[data-aigen]");if(b2){b2.disabled=false;b2.textContent="✨ "+t("ai.again")}}}
document.addEventListener("click",e=>{if(e.target.closest("[data-aigen]")){aiGenerate();return}});
async function snapMoment(th,m){try{const cv=await frame(m.who,hash(m.txt)%4,480),x=cv.getContext("2d");
 x.fillStyle="rgba(0,0,0,.55)";x.fillRect(0,cv.height-86,cv.width,86);x.fillStyle="#fff";x.font="17px Georgia, serif";x.textAlign="left";
 const words=m.txt.split(/(\s+)/);let line="",y=cv.height-58;for(const wd0 of words){if(x.measureText(line+wd0).width>cv.width-28){x.fillText(line,14,y);line="";y+=22;if(y>cv.height-8)break}line+=wd0}if(y<=cv.height-8)x.fillText(line,14,y);
 const aid="a"+Date.now();S.album.unshift({id:aid,cid:m.who,src:mediaWrap("album:"+aid,cv.toDataURL("image/jpeg",.74)),at:Date.now()});if(S.album.length>12)S.album.length=12;
 appendMsg(th,{who:"me",k:"img",aid,at:Date.now()});toast(t("snap.saved"))}catch(e){}}

/* ================= COUPLE / QUEST ================= */
function makeCouple(cid,th){S.couples[cid]={since:Date.now(),tid:th.id,ans:{}};save();appendMsg(th,{who:"sys",k:"card",title:"💍 "+t("cr.h"),txt:t("cp.done"),at:Date.now()});reply(th,{kind:"user",txt:"(We just made it official. This is the moment. React.)"})}
function questSheet(){const th=S.threads[curT],q=th.quest;sheet('<h2>'+esc(th.title)+'</h2><p class="xs faint" style="margin-top:4px">'+t("q.turns",{a:th.rounds,b:q.turns})+'</p><div class="stack" style="gap:6px;margin-top:12px">'+
 q.goals.map(g=>'<div class="task'+(g.done?" done":"")+'"><span class="ck">'+(g.done?"✓":"")+'</span>'+esc(g.t)+'</div>').join("")+
 '<div class="task'+(q.hidden.done?" done":"")+'"><span class="ck">'+(q.hidden.done?"✓":"?")+'</span>'+(q.hidden.done?esc(q.hidden.t):t("q.hidden")+" — ???")+'</div></div>')}
function questEnd(th){const q=th.quest,win=q.goals.every(g=>g.done),miss=q.goals.filter(g=>!g.done);
 sheet('<div class="eyebrow" style="color:'+(win?"var(--mint)":"var(--rose)")+'">'+(win?t("q.win"):t("q.fail"))+'</div><h2 style="margin-top:6px">'+esc(th.title)+'</h2>'+
  '<div class="stack" style="gap:6px;margin-top:12px">'+q.goals.map(g=>'<div class="task'+(g.done?" done":"")+'"><span class="ck">'+(g.done?"✓":"✕")+'</span>'+esc(g.t)+'</div>').join("")+
  '<div class="task'+(q.hidden.done?" done":"")+'"><span class="ck">'+(q.hidden.done?"✓":"?")+'</span>'+(q.hidden.done?esc(q.hidden.t):t("q.hidden"))+'</div></div>'+
  (win?"":'<p class="xs dim" style="margin-top:10px">'+t("q.missed")+' '+miss.map(g=>esc(g.t)).join(" · ")+'</p><button class="btn btn-p btn-block" style="margin-top:12px" data-qretry="'+th.wid+'">'+t("q.retry")+'</button>'))}
document.addEventListener("click",e=>{const x=e.target.closest("[data-qretry]");if(!x)return;if(!spend(PRICES.retry,"retry"))return;closeSheet();const th=newThread("quest",x.dataset.qretry);openThread(th.id)});

/* ================= MINI GAMES (in "More") — every result feeds the relationship and the chat ================= */
const DARES={en:["Send him the last photo in your camera roll (describe it).","Tell him one thing you noticed about him the first day.","Say his name the way you'd say it if you missed him.","Give him a nickname. He has to use it all night.","Describe your perfect night — he has to guess if he's in it."],
 zh:["把你相册里最后一张照片描述给他听。","告诉他，第一天你就注意到他身上的哪件事。","用想他时的语气叫一次他的名字。","给他起个外号，他今晚都得这么叫。","描述你理想中的一个夜晚——让他猜里面有没有他。"]};
const TRUTHS={en:["What's the one thing you've never told anyone about me?","When did you first think about kissing me?","What would you do if I left tonight?","Who in this story makes you jealous?","What's the lie you tell yourself most?"],
 zh:["关于我，你有什么从来没告诉过任何人？","你第一次想吻我是什么时候？","如果我今晚走了，你会怎么做？","这个故事里谁让你吃醋？","你最常骗自己的一句话是什么？"]};
function gLang(){return S.lang==="zh"?"zh":"en"}
function bottleGame(){const th=S.threads[curT],m=mainOf(th),c=ch(m);
 sheet('<h2>'+t("g.bottle")+'</h2><p class="xs faint" style="margin-top:4px">'+t("g.bottleS")+'</p><div class="btl"><div class="btl-p me">'+esc(me()||"You")+'</div><div class="btl-p him">'+avatar(m,54)+'<b>'+esc(first(c.n))+'</b></div><div class="bottle" id="btl">🍾</div></div><button class="btn btn-p btn-block" data-bspin="1">'+t("g.spin")+'</button><div id="btlOut"></div>')}
function lieGame(){const th=S.threads[curT],m=mainOf(th),c=ch(m),L=gLang();
 const tr=[(c.tells&&(c.tells[L]||c.tells.en)||[])[0],(Lz(c.likes)||"").split(/[,，、]/)[0]].filter(Boolean).map(x=>String(x).replace(/[.。]$/,""));
 const lies=L==="zh"?["我从来没哭过","我怕黑","我讨厌下雪天","我会弹竖琴","我从没说过谎"]:["I've never cried","I'm scared of the dark","I hate snow","I play the harp","I've never told a lie"];
 const lie=lies[hash(m+Date.now())%lies.length],opts=[tr[0]||"",tr[1]||"",lie].filter(Boolean).sort(()=>Math.random()-.5);lieGame.ans=lie;lieGame.m=m;
 sheet('<h2>'+t("g.lie")+'</h2><p class="xs faint" style="margin-top:4px">'+t("g.lieS",{n:first(c.n)})+'</p><div class="stack" style="margin-top:10px;gap:8px">'+opts.map(o=>'<button class="opt gopt" data-lie="'+esc(o)+'"><span class="ic">'+avatar(m,30)+'</span><span class="grow"><b>“'+esc(o)+'”</b></span></button>').join("")+'</div><div id="lieOut"></div>')}
let hg=null;
function heartGame(){const th=S.threads[curT],m=mainOf(th),c=ch(m);hg={m,score:0,t0:0,left:5,timer:null};
 sheet('<h2>'+t("g.heart")+'</h2><p class="xs faint" style="margin-top:4px">'+t("g.heartS",{n:first(c.n)})+'</p><div class="hgbox"><div class="hgav">'+avatar(m,120)+'</div><div class="hgbpm num" id="hgBpm">72 bpm</div><div class="hgbar"><i id="hgBar"></i></div><p class="xs faint" id="hgLeft">5s</p></div><button class="btn btn-p btn-block hgtap" data-hgtap="1">💓 '+t("g.tap")+'</button>')}
document.addEventListener("click",e=>{let x;const th=S.threads[curT];
 if(e.target.closest("[data-bspin]")){const b=$("#btl");if(!b)return;const him=Math.random()<.55,deg=1440+(him?0:180)+(Math.random()*30-15);b.style.transition="transform 2.2s cubic-bezier(.2,.8,.2,1)";b.style.transform="rotate("+deg+"deg)";e.target.closest("[data-bspin]").disabled=true;
  setTimeout(()=>{const m=mainOf(th),c=ch(m),L=gLang(),out=$("#btlOut");if(!out)return;
   if(him){const q=TRUTHS[L][hash(m+Date.now())%5];out.innerHTML='<div class="card" style="margin-top:12px"><div class="eyebrow" style="color:var(--gold)">'+t("g.himTruth",{n:first(c.n)})+'</div><p class="sm" style="margin-top:6px">“'+esc(q)+'”</p><button class="btn btn-p btn-sm" style="margin-top:10px" data-gask="'+esc(q)+'">'+t("g.askHim")+'</button></div>'}
   else{const d=DARES[L][hash(me()+Date.now())%5];out.innerHTML='<div class="card" style="margin-top:12px"><div class="eyebrow" style="color:var(--rose)">'+t("g.yourDare")+'</div><p class="sm" style="margin-top:6px">'+esc(d)+'</p><textarea id="dareIn" class="imgpr" placeholder="'+esc(t("g.dareIn"))+'"></textarea><button class="btn btn-p btn-sm" style="margin-top:8px" data-gdare="'+esc(d)+'">'+t("g.send")+'</button></div>'}},2300);return}
 if(x=e.target.closest("[data-gask]")){const m=mainOf(th),q=x.dataset.gask;closeSheet();appendMsg(th,{who:"sys",k:"card",title:"🍾 "+t("g.bottle"),txt:t("g.himTruth",{n:first(ch(m).n)}),at:Date.now()});appendMsg(th,{who:"me",k:"say",txt:q,at:Date.now()});th.rounds++;loveWrite(th,m,3,"truth:dare");th.mem.push("Truth or dare: "+me()+" asked "+ch(m).n+": "+q);reply(th,{kind:"truth",txt:q,cid:m});return}
 if(x=e.target.closest("[data-gdare]")){const m=mainOf(th),v=($("#dareIn").value||"").trim();if(!v){toast(t("g.dareIn"));return}closeSheet();appendMsg(th,{who:"sys",k:"card",title:"🍾 "+t("g.yourDare"),txt:x.dataset.gdare,at:Date.now()});appendMsg(th,{who:"me",k:"say",txt:v,at:Date.now()});th.rounds++;loveWrite(th,m,4,"dare");th.mem.push(me()+" did a dare for "+ch(m).n+": "+v);reply(th,{kind:"user",txt:"(Truth-or-dare: "+me()+" did this dare — \""+x.dataset.gdare+"\" — and said: "+v+". React to it.)"});return}
 if(x=e.target.closest("[data-lie]")){const ok=x.dataset.lie===lieGame.ans,m=lieGame.m,c=ch(m);$$("[data-lie]").forEach(b=>{b.disabled=true;b.classList.toggle("right",b.dataset.lie===lieGame.ans);b.classList.toggle("wrong",b===x&&!ok)});
  loveWrite(th,m,ok?6:1,"twotruths");th.mem.push("Two truths and a lie with "+c.n+": "+(ok?"guessed right":"guessed wrong"));save();
  $("#lieOut").innerHTML='<div class="card" style="margin-top:12px"><div class="eyebrow" style="color:'+(ok?"var(--mint)":"var(--rose)")+'">'+(ok?t("g.lieWin"):t("g.lieLose"))+' · ♥ +'+(ok?6:1)+'</div><button class="btn btn-p btn-sm" style="margin-top:10px" data-gback="'+(ok?"win":"lose")+'">'+t("g.backChat")+'</button></div>';return}
 if(x=e.target.closest("[data-gback]")){const m=lieGame.m;closeSheet();appendMsg(th,{who:"sys",k:"card",title:"🕵️ "+t("g.lie"),txt:x.dataset.gback==="win"?t("g.lieWin"):t("g.lieLose"),at:Date.now()});reply(th,{kind:"user",txt:"(We just played two truths and a lie. "+me()+(x.dataset.gback==="win"?" caught your lie immediately.":" fell for your lie.")+" React, teasing.)"});return}
 if(e.target.closest("[data-hgtap]")&&hg){if(!hg.t0){hg.t0=Date.now();hg.timer=setInterval(()=>{hg.left--;const l=$("#hgLeft");if(l)l.textContent=hg.left+"s";if(hg.left<=0){clearInterval(hg.timer);heartEnd()}},1000)}
  hg.score++;const bpm=Math.min(190,72+hg.score*5),b=$("#hgBpm"),bar=$("#hgBar");if(b)b.textContent=bpm+" bpm";if(bar)bar.style.width=Math.min(100,(bpm-72)/1.18)+"%";const av=$(".hgav");if(av){av.classList.remove("beat");void av.offsetWidth;av.classList.add("beat")}return}});
function heartEnd(){const th=S.threads[curT],m=hg.m,c=ch(m),bpm=Math.min(190,72+hg.score*5),win=bpm>=150;loveWrite(th,m,win?6:2,"heart");th.mem.push(me()+" made "+c.n+"'s heart race to "+bpm+" bpm");save();
 const btn=$("[data-hgtap]");if(btn){btn.outerHTML='<div class="card" style="margin-top:12px"><div class="eyebrow" style="color:var(--gold)">'+bpm+' bpm · ♥ +'+(win?6:2)+'</div><p class="sm" style="margin-top:6px">'+t(win?"g.heartWin":"g.heartLose",{n:first(c.n)})+'</p><button class="btn btn-p btn-sm" style="margin-top:10px" data-hgback="'+bpm+'">'+t("g.backChat")+'</button></div>'}}
document.addEventListener("click",e=>{const x=e.target.closest("[data-hgback]");if(!x)return;const th=S.threads[curT],m=hg.m;closeSheet();appendMsg(th,{who:"sys",k:"card",title:"💓 "+t("g.heart"),txt:x.dataset.hgback+" bpm",at:Date.now()});reply(th,{kind:"user",txt:"(Heartbeat game: "+me()+" got "+ch(m).n+"'s heart up to "+x.dataset.hgback+" bpm just by leaning closer and closer. If you mention the number it is exactly "+x.dataset.hgback+" bpm — never another number. React — flustered, trying to hide it.)"})});

/* ================= GAME HUB — one place for every game; group games light up when 3+ characters are in the scene ================= */
const GAMES=[
 {k:"bottle",i:"🍾",grad:"linear-gradient(135deg,#F0B77E,#EE6F97)",min:1},
 {k:"lie",i:"🕵️",grad:"linear-gradient(135deg,#6C8FC4,#9C84E0)",min:1},
 {k:"heart",i:"💓",grad:"linear-gradient(135deg,#EE6F97,#B0304A)",min:1},
 {k:"never",i:"🥂",grad:"linear-gradient(135deg,#D8A24A,#7A5B3A)",min:2,group:1},
 {k:"likely",i:"🗳️",grad:"linear-gradient(135deg,#4E8A6E,#1C2439)",min:2,group:1},
 {k:"anon",i:"💌",grad:"linear-gradient(135deg,#9C84E0,#EE6F97)",min:2,group:1}];
function gameHub(){const th=S.threads[curT],n=th.cast.filter(id=>ch(id)).length;
 sheet('<button class="gh-gc" data-gcenter="1"><span>🎮 GAME CENTER</span><small>'+t("gc.sub")+'</small><b>›</b></button><div class="eyebrow" style="color:var(--gold);margin-top:14px">GAME NIGHT</div><h2 style="margin-top:4px">'+t("gh.h")+'</h2><p class="xs faint" style="margin-top:4px">'+t("gh.sub",{n})+'</p>'+
  '<div class="gh-cast">'+th.cast.filter(id=>ch(id)).map(id=>avatar(id,34)).join("")+'<span>+ '+esc(me()||"You")+'</span></div>'+
  '<div class="ghgrid">'+GAMES.map(g=>{const lock=n<g.min;return '<button class="ghc'+(lock?" off":"")+'" data-gh="'+g.k+'" style="--g:'+g.grad+'"><i>'+g.i+'</i>'+(g.group?'<em>👥 '+t("gh.group")+'</em>':'')+'<b>'+t("gh."+g.k)+'</b><span>'+t("gh."+g.k+"S")+'</span>'+(lock?'<small>🔒 '+t("gh.need")+'</small>':'')+'</button>'}).join("")+'</div>')}
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-games]")){gameHub();return}
 if(x=e.target.closest("[data-gh]")){if(x.classList.contains("off")){toast(t("gh.need"));return}const k=x.dataset.gh;({bottle:gBottle2,lie:lieGame,heart:heartGame,never:neverGame,likely:likelyGame,anon:anonGame})[k]()}});
function castOf(th){return th.cast.filter(id=>ch(id))}
/* 🍾 bottle — around a circle of everyone at the table */
function gBottle2(){const th=S.threads[curT],cs=castOf(th);if(cs.length<2){bottleGame();return}
 const seats=cs.concat(["me"]),R=92;
 sheet('<h2>'+t("g.bottle")+'</h2><p class="xs faint" style="margin-top:4px">'+t("g.bottleS")+'</p><div class="ring2" id="ring2">'+seats.map((id,i)=>{const a=i/seats.length*2*Math.PI-Math.PI/2;return '<div class="seat" style="left:calc(50% + '+Math.round(Math.cos(a)*R)+'px);top:calc(50% + '+Math.round(Math.sin(a)*R)+'px)" data-seat="'+i+'">'+(id==="me"?'<div class="av mea" style="width:44px;height:44px">★</div><b>'+esc(me()||"You")+'</b>':avatar(id,44)+'<b>'+esc(first(ch(id).n))+'</b>')+'</div>'}).join("")+'<div class="bottle" id="btl2">🍾</div></div><button class="btn btn-p btn-block" data-b2spin="1">'+t("g.spin")+'</button><div id="btlOut"></div>');
 gBottle2.seats=seats}
/* 🥂 never have I ever */
const NEVER={en:["kissed someone in this room","lied to someone here tonight","thought about leaving and didn't","fallen for a rival","read someone's messages","said 'I love you' first","kept a gift from an ex","stayed up all night for someone"],
 zh:["亲过这屋里的某个人","今晚对这里的人撒过谎","想过离开却没走","爱上过自己的对手","偷看过别人的消息","先说过“我爱你”","留着前任送的礼物","为一个人熬过通宵"]};
function neverGame(){const th=S.threads[curT],cs=castOf(th),L=gLang(),i=neverGame.i=(neverGame.i||0)+1,q=NEVER[L][hash(th.id+i)%NEVER[L].length];
 sheet('<h2>'+t("gh.never")+'</h2><div class="nv-q"><small>'+t("nv.pre")+'</small>'+esc(q)+'</div><p class="xs faint" style="text-align:center">'+t("nv.how")+'</p><div class="nv-grid">'+cs.concat(["me"]).map(id=>'<div class="nv-p" data-nv="'+id+'">'+(id==="me"?'<div class="av mea" style="width:48px;height:48px">★</div><b>'+esc(me()||"You")+'</b>':avatar(id,48)+'<b>'+esc(first(ch(id).n))+'</b>')+'<span class="nv-g">🥂</span></div>').join("")+'</div>'+
  '<div class="row" style="gap:8px;margin-top:12px"><button class="btn btn-g grow" data-nvme="0">🙅 '+t("nv.never")+'</button><button class="btn btn-p grow" data-nvme="1">🥂 '+t("nv.have")+'</button></div><div id="nvOut"></div>');neverGame.q=q}
/* 🗳️ most likely to */
const LIKELY={en:["fall in love first","start a fight tonight","keep a secret forever","cry at a wedding","text their ex at 2am","get everyone kicked out","propose on a whim","lie about how they feel"],
 zh:["最先动心","今晚挑起一场争吵","把秘密带进坟墓","在婚礼上哭","凌晨两点给前任发消息","让大家被赶出去","一时冲动求婚","嘴硬不承认自己的感情"]};
function likelyGame(){const th=S.threads[curT],cs=castOf(th),L=gLang(),i=likelyGame.i=(likelyGame.i||0)+1,q=LIKELY[L][hash(th.id+"l"+i)%LIKELY[L].length];likelyGame.q=q;
 sheet('<h2>'+t("gh.likely")+'</h2><div class="nv-q"><small>'+t("lk.pre")+'</small>'+esc(q)+'?</div><p class="xs faint" style="text-align:center">'+t("lk.how")+'</p><div class="stack" style="gap:8px;margin-top:10px">'+cs.map(id=>'<button class="lk-o" data-lk="'+id+'">'+avatar(id,36)+'<b class="grow">'+esc(ch(id).n)+'</b><span class="lk-bar"><i></i></span><em class="num"></em></button>').join("")+'</div><div id="lkOut"></div>')}
/* 💌 anonymous confession */
function anonGame(){const th=S.threads[curT],cs=castOf(th),w=cs[Math.floor(Math.random()*cs.length)],c=ch(w),L=gLang();anonGame.w=w;
 const lines=(c.tells&&(c.tells[L]||c.tells.en))||[];const fallback=L==="zh"?"我每次都假装没在看你。其实我记得你今晚说的每一句话。":"I keep pretending I'm not looking at you. I remember every word you said tonight.";
 sheet('<h2>'+t("gh.anon")+'</h2><p class="xs faint" style="margin-top:4px">'+t("an.how")+'</p><div class="an-card"><span>💌</span><p id="anTxt">'+esc(fallback)+'</p></div><p class="xs faint" style="text-align:center">'+t("an.who")+'</p><div class="nv-grid">'+cs.map(id=>'<button class="nv-p" data-an="'+id+'">'+avatar(id,48)+'<b>'+esc(first(ch(id).n))+'</b></button>').join("")+'</div><div id="anOut"></div>');
 if(SAMPLE){SAMPLE("You are "+c.n+" ("+Lz(c.vibe)+"). In a party game, write ONE anonymous love note (max 2 sentences) to "+(me()||"the user")+" that only you could have written — hint at your personality or a detail from your story ("+Lz(c.role)+") without saying your name. Adult, not explicit. Reply in "+(L==="zh"?"Simplified Chinese":"English")+". Output only the note.",{modelTier:"quick"}).then(r=>{const tx=String((r&&r.text)||"").trim();const el=$("#anTxt");if(el&&tx.length>6&&anonGame.w===w)el.textContent=tx}).catch(()=>{})}
 else if(lines.length){const el=$("#anTxt");if(el)el.textContent=(L==="zh"?"猜猜我是谁：":"Guess who: ")+lines[0]}}
document.addEventListener("click",e=>{let x;const th=S.threads[curT];if(!th)return;
 if(e.target.closest("[data-b2spin]")){const seats=gBottle2.seats,k=Math.floor(Math.random()*seats.length),b=$("#btl2");e.target.closest("[data-b2spin]").disabled=true;
  const deg=1800+k/seats.length*360;b.style.transition="transform 2.6s cubic-bezier(.15,.85,.2,1)";b.style.transform="rotate("+deg+"deg)";
  setTimeout(()=>{$$(".seat").forEach(s0=>s0.classList.toggle("hit",+s0.dataset.seat===k));const id=seats[k],L=gLang(),out=$("#btlOut");if(!out)return;
   if(id==="me"){const d=DARES[L][hash(me()+Date.now())%5];out.innerHTML='<div class="card" style="margin-top:12px"><div class="eyebrow" style="color:var(--rose)">'+t("g.yourDare")+'</div><p class="sm" style="margin-top:6px">'+esc(d)+'</p><textarea id="dareIn" class="imgpr" placeholder="'+esc(t("g.dareIn"))+'"></textarea><button class="btn btn-p btn-sm" style="margin-top:8px" data-gdare="'+esc(d)+'">'+t("g.send")+'</button></div>'}
   else{const q=TRUTHS[L][hash(id+Date.now())%5];th.focus=id;out.innerHTML='<div class="card" style="margin-top:12px"><div class="eyebrow" style="color:var(--gold)">'+t("g.himTruth",{n:first(ch(id).n)})+'</div><p class="sm" style="margin-top:6px">“'+esc(q)+'”</p><button class="btn btn-p btn-sm" style="margin-top:10px" data-gask="'+esc(q)+'">'+t("g.askHim")+'</button></div>'}},2700);return}
 if(x=e.target.closest("[data-nvme]")){if(neverGame.done)return;neverGame.done=true;const mine=x.dataset.nvme==="1",cs=castOf(th),drank=[];
  cs.forEach((id,i)=>{const yes=(hash(id+neverGame.q)%100)<45;if(yes)drank.push(id);setTimeout(()=>{const el=$('[data-nv="'+id+'"]');if(el)el.classList.add(yes?"drink":"dry")},250+i*260)});
  setTimeout(()=>{const el=$('[data-nv="me"]');if(el)el.classList.add(mine?"drink":"dry");const out=$("#nvOut");if(!out)return;
   out.innerHTML='<div class="card" style="margin-top:12px"><div class="eyebrow" style="color:var(--gold)">'+t("nv.res",{n:drank.length})+'</div><p class="sm" style="margin-top:6px">'+(drank.length?drank.map(id=>esc(first(ch(id).n))).join(", ")+" 🥂":t("nv.none"))+'</p><div class="row" style="gap:8px;margin-top:10px"><button class="btn btn-g btn-sm" data-nvnext="1">↻ '+t("nv.next")+'</button><button class="btn btn-p btn-sm grow" data-nvback="'+drank.join(",")+'|'+(mine?1:0)+'">'+t("g.backChat")+'</button></div></div>'},300+cs.length*260);return}
 if(e.target.closest("[data-nvnext]")){neverGame.done=false;neverGame();return}
 if(x=e.target.closest("[data-nvback]")){const [d,mine]=x.dataset.nvback.split("|"),dr=d?d.split(","):[];closeSheet();neverGame.done=false;
  appendMsg(th,{who:"sys",k:"card",title:"🥂 "+t("gh.never"),txt:t("nv.pre")+" "+neverGame.q+" — 🥂 "+(dr.map(id=>first(ch(id).n)).concat(mine==="1"?[me()]:[]).join(", ")||"—"),at:Date.now()});
  dr.forEach(id=>loveWrite(th,id,2,"never"));th.mem.push("Never have I ever: \""+neverGame.q+"\" — drank: "+(dr.map(id=>ch(id).n).join(", ")||"nobody")+(mine==="1"?", and "+me():""));
  reply(th,{kind:"user",txt:"(Party game 'Never have I ever — "+neverGame.q+"'. Who drank: "+(dr.map(id=>ch(id).n).join(", ")||"nobody")+(mine==="1"?" and "+me():"")+". The others react — tease, accuse, get defensive, reveal a little.)"});return}
 if(x=e.target.closest("[data-lk]")){if(likelyGame.done)return;likelyGame.done=true;const pick=x.dataset.lk,cs=castOf(th),votes={};cs.forEach(id=>votes[id]=0);votes[pick]++;
  cs.forEach(v=>{const others=cs.filter(o=>o!==v);const to=others[hash(v+likelyGame.q)%others.length]||pick;votes[to]++});const tot=cs.length+1,top=Object.keys(votes).sort((a,b)=>votes[b]-votes[a])[0];
  $$("[data-lk]").forEach(b=>{const id=b.dataset.lk,pc=Math.round(votes[id]/tot*100);b.classList.toggle("mine",id===pick);b.classList.toggle("top",id===top);b.querySelector(".lk-bar i").style.width=pc+"%";b.querySelector("em").textContent=votes[id]});
  $("#lkOut").innerHTML='<div class="card" style="margin-top:12px"><div class="eyebrow" style="color:var(--gold)">'+t("lk.res",{n:first(ch(top).n)})+'</div><button class="btn btn-p btn-sm" style="margin-top:10px" data-lkback="'+top+'|'+pick+'">'+t("g.backChat")+'</button></div>';return}
 if(x=e.target.closest("[data-lkback]")){const [top,pick]=x.dataset.lkback.split("|");closeSheet();likelyGame.done=false;th.focus=top;
  appendMsg(th,{who:"sys",k:"card",title:"🗳️ "+t("gh.likely"),txt:t("lk.pre")+" "+likelyGame.q+"? → "+ch(top).n,at:Date.now()});th.mem.push("Most-likely-to vote: \""+likelyGame.q+"\" → "+ch(top).n+" (the user voted "+ch(pick).n+")");
  reply(th,{kind:"user",txt:"(Party game 'Who's most likely to "+likelyGame.q+"?' The table voted "+ch(top).n+"; "+me()+" voted "+ch(pick).n+". "+ch(top).n+" protests, the others pile on.)"});return}
 if(x=e.target.closest("[data-an]")){const g=x.dataset.an,w=anonGame.w,ok=g===w;$$("[data-an]").forEach(b=>{b.disabled=true;b.classList.toggle("drink",b.dataset.an===w);b.classList.toggle("dry",b===x&&!ok)});
  loveWrite(th,w,ok?7:3,"anon");save();$("#anOut").innerHTML='<div class="card" style="margin-top:12px"><div class="eyebrow" style="color:'+(ok?"var(--mint)":"var(--rose)")+'">'+(ok?t("an.win",{n:first(ch(w).n)}):t("an.lose",{n:first(ch(w).n)}))+' · ♥ +'+(ok?7:3)+'</div><button class="btn btn-p btn-sm" style="margin-top:10px" data-anback="'+w+'|'+(ok?1:0)+'">'+t("g.backChat")+'</button></div>';return}
 if(x=e.target.closest("[data-anback]")){const [w,ok]=x.dataset.anback.split("|"),note=($("#anTxt")||{}).textContent||"";closeSheet();th.focus=w;
  appendMsg(th,{who:"sys",k:"card",title:"💌 "+t("gh.anon"),txt:"“"+note+"” — "+ch(w).n,at:Date.now()});th.mem.push(ch(w).n+" wrote the user an anonymous note: "+note);
  reply(th,{kind:"user",txt:"(Anonymous-note game: "+ch(w).n+" wrote \""+note+"\" and "+me()+(ok==="1"?" guessed it was them.":" guessed wrong, so it was revealed.")+" "+ch(w).n+" reacts, exposed; the others react to that.)"});return}});
Object.assign(I18N.en,{"voice.e.conn":"AI voice needs the flux (Hugging Face) connector — add it in claude.ai Settings → Connectors.",
 "voice.e.reauth":"Reconnect flux in claude.ai Settings → Connectors.","voice.e.denied":"AI voice is turned off for this page.",
 "voice.e.busy":"The voice server is busy. Try again in a minute.","voice.e.tool":"The voice model couldn't finish","voice.e.other":"Couldn't generate that voice line this time."});
Object.assign(I18N.zh,{"voice.e.conn":"AI 语音生成需要 flux（Hugging Face）连接器，请在 claude.ai 设置 → 连接器 中添加。",
 "voice.e.reauth":"请在 claude.ai 设置 → 连接器 中重新连接 flux。","voice.e.denied":"这个页面的 AI 语音生成权限已关闭。",
 "voice.e.busy":"语音服务器正忙，一分钟后再试。","voice.e.tool":"语音模型没能完成","voice.e.other":"这次没能生成语音。"});
