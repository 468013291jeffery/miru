/* ================= GAME CENTER (BL first) — story games, each one moves the relationship BETWEEN the two leads =================
   Found Phone · Love Letter Rush · Heartbeat Capsule · Who Remembers Wrong · + Game Night party games.
   Every result feeds S.rel["a|b"] (the pair's bond) and lands back in their story. */
const BLP=[["ice","mason","ethan"],["crimson","lucien","adrian"],["made","dante","cass"],["pole","luca","jack"],["fourth","brody","ezra"],["unseelie","caelan","thorne"],["pact","nico","jamie"],["night","elijah","rowan"]];
const REL_ST=[[0,"rel.s0"],[20,"rel.s1"],[40,"rel.s2"],[60,"rel.s3"],[80,"rel.s4"],[95,"rel.s5"]];
function curPair(){const k=S.gpair;const p=BLP.find(x=>x[0]===k);if(p)return p;const th=Object.values(S.threads).filter(t0=>BLP.some(b=>b[0]===t0.wid)).sort((a,b)=>b.at-a.at)[0];return BLP.find(b=>th&&b[0]===th.wid)||BLP[0]}
function relKey(p){return p[1]+"|"+p[2]}
function relV(p){S.rel=S.rel||{};return S.rel[relKey(p)]||12}
function relStage(v){let s=REL_ST[0][1];REL_ST.forEach(([n,k])=>{if(v>=n)s=k});return t(s)}
function relAdd(p,n,why){const before=relV(p);S.rel[relKey(p)]=Math.max(0,Math.min(100,before+n));save();
 const th=Object.values(S.threads).filter(x=>x.wid===p[0]).sort((a,b)=>b.at-a.at)[0];if(th&&why){th.mem.push(why);th.msgs.push({who:"sys",k:"card",title:"🎮 "+t("gc.h"),txt:why,at:Date.now()});save()}
 return {before,after:S.rel[relKey(p)]}}
function relBar(p,from){const v=relV(p);return '<div class="relb"><div class="row" style="gap:8px">'+avatar(p[1],26)+'<span class="xs" style="font-weight:800">'+esc(first(ch(p[1]).n))+' ↔ '+esc(first(ch(p[2]).n))+'</span>'+avatar(p[2],26)+'<b class="grow" style="text-align:right;color:var(--gold);font-size:12px">'+relStage(v)+'</b></div><div class="relm"><i style="width:'+(from!=null?from:v)+'%" data-to="'+v+'"></i></div></div>'}
function animRel(){setTimeout(()=>$$(".relm i[data-to]").forEach(i=>i.style.width=i.dataset.to+"%"),80)}
const GC=[
 {k:"phone",bg:"night",title:"gc.phone",tag:"Solo",font:"'Georgia',serif",c1:"#E9D9FF",c2:"#8E6CF0",sub:"gc.phoneS"},
 {k:"rush",bg:"pact",title:"gc.rush",tag:"Solo",font:"'Brush Script MT','Snell Roundhand',cursive",c1:"#FFE3C2",c2:"#EE6F97",sub:"gc.rushS"},
 {k:"capsule",bg:"ice",title:"gc.capsule",tag:"Daily",font:"'Arial Black',system-ui",c1:"#FFF0B3",c2:"#F08A3C",sub:"gc.capsuleS"},
 {k:"remember",bg:"crimson",title:"gc.remember",tag:"Solo",font:"'Courier New',monospace",c1:"#F2E6D0",c2:"#B0304A",sub:"gc.rememberS"},
 {k:"party",bg:"afterhours",title:"gc.party",tag:"Party",font:"'Georgia',serif",c1:"#FFE7A8",c2:"#D8A24A",sub:"gc.partyS"}];
function openGameCenter(){const p=curPair();
 const h='<div class="gc-hero"><div class="gc-heroimg">'+BLP.slice(0,4).map(b=>'<img src="'+artSrc(b[1])+'" alt="">').join("")+'</div><div class="gc-heroveil"></div><button class="ibtn backbtn" data-back="1">'+ic("back")+'</button>'+
  '<div class="gc-herocap"><h1>GAME CENTER</h1><p>'+t("gc.sub")+'</p></div></div><div class="gc-body"><div class="gc-pair"><div class="eyebrow">'+t("gc.pair")+'</div><div class="gc-pairs">'+BLP.map(b=>'<button class="gc-pb'+(b[0]===p[0]?" on":"")+'" data-gcpair="'+b[0]+'">'+avatar(b[1],30)+avatar(b[2],30)+'</button>').join("")+'</div>'+relBar(p)+'</div>'+
  '<div class="gc-grid">'+GC.map(g=>'<button class="gc-card" data-gc="'+g.k+'"><div class="gc-poster"><img src="'+gcArt(g,p)+'" alt=""><div class="gc-pv"></div><b class="gc-pt" style="font-family:'+g.font+';background:linear-gradient(180deg,'+g.c1+','+g.c2+');-webkit-background-clip:text;background-clip:text">'+t(g.title)+'</b></div><div class="gc-info"><b>'+t(g.title)+'</b><p>'+esc(t(g.sub,{a:first(ch(p[1]).n),b:first(ch(p[2]).n)}))+'</p><span class="gc-tag '+g.tag.toLowerCase()+'">'+g.tag+'</span></div></button>').join("")+'</div></div>';
 screen("s-gc",'<div class="scroll gcscr">'+h+'</div>');show("s-gc");animRel()}
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-gcenter]")){closeSheet();openGameCenter();return}
 if(x=e.target.closest("[data-gcpair]")){S.gpair=x.dataset.gcpair;save();openGameCenter();return}
 if(x=e.target.closest("[data-gc]")){const k=x.dataset.gc;({phone:gPhone,rush:gRush,capsule:gCapsule,remember:gRemember,party:gParty})[k]()}});
function gScreen(title,body,cls){screen("s-game",'<div class="topbar"><button class="ibtn" data-back="1">'+ic("back")+'</button><h2 class="grow" style="font-size:18px">'+title+'</h2></div><div class="scroll gscr '+(cls||"")+'">'+body+'</div>');show("s-game")}
function gResult(p,n,why,extra){const r=relAdd(p,n,why);const el=$("#gRes");if(!el)return;
 el.innerHTML='<div class="gres"><div class="eyebrow" style="color:var(--gold)">'+t("gc.result")+'</div>'+(extra||"")+relBar(p,r.before)+'<p class="xs faint" style="margin-top:6px">'+(r.after>r.before?"+"+(r.after-r.before):"±0")+' · '+t("gc.movesStory")+'</p><div class="row" style="gap:8px;margin-top:10px"><button class="btn btn-g grow" data-gcenter="1">'+t("gc.more")+'</button><button class="btn btn-p grow" data-gcstory="'+p[0]+'">'+t("gc.toStory")+'</button></div></div>';animRel();el.scrollIntoView({behavior:"smooth",block:"end"})}
document.addEventListener("click",e=>{const x=e.target.closest("[data-gcstory]");if(!x)return;const w=x.dataset.gcstory,th=Object.values(S.threads).filter(y=>y.wid===w).sort((a,b)=>b.at-a.at)[0]||newThread(null,w);save();openThread(th.id)});
/* ---------- 1. FOUND PHONE ---------- */
function gPhone(){const p=curPair(),A=ch(p[1]),B=ch(p[2]),code=String(1000+hash(p[0])%9000);gPhone.st={p,code,typed:"",open:false};
 gScreen(t("gc.phone"),'<div class="ph"><div class="ph-scr" id="phScr"></div></div><div id="gRes"></div>');phLock()}
function phLock(){const {p,code}=gPhone.st,B=ch(p[2]);$("#phScr").innerHTML='<div class="ph-lock" style="background-image:url('+artSrc(p[1])+')"><div class="ph-time">2:17</div><div class="ph-date">'+t("gc.phDate")+'</div>'+
 '<div class="ph-noti"><b>'+esc(first(B.n))+'</b><span>'+esc(t("gc.phHint",{c:code.slice(0,2)+"-"+code.slice(2)}))+'</span></div><div class="ph-dots" id="phDots">'+"○○○○"+'</div><div class="ph-pad">'+[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map(n=>n===""?"<i></i>":'<button data-phk="'+n+'">'+n+'</button>').join("")+'</div></div>'}
function phHome(){const {p}=gPhone.st,A=ch(p[1]),B=ch(p[2]),L=S.lang==="zh"?"zh":"en";
 $("#phScr").innerHTML='<div class="ph-app"><div class="ph-hd">'+t("gc.phMsgs")+'</div><button class="ph-row" data-pht="1">'+avatar(p[2],40)+'<div class="grow"><b>'+esc(first(B.n))+' 📌</b><span>'+esc(t("gc.phLast"))+'</span></div><i class="dot"></i></button>'+
  '<div class="ph-row dim">'+'<div class="av" style="width:40px;height:40px;display:grid;place-items:center;background:#333">C</div><div class="grow"><b>Coach</b><span>'+t("gc.phCoach")+'</span></div></div>'+
  '<div class="ph-sec">'+t("gc.phDrafts")+'</div><button class="ph-row lk" data-phd="1"><div class="av" style="width:40px;height:40px;display:grid;place-items:center;background:#4A2F5C">✎</div><div class="grow"><b>'+t("gc.phTo",{n:first(B.n)})+'</b><span class="blur">'+esc(Lz(A.secret))+'</span></div><em>🔒</em></button>'+
  '<div class="ph-sec">'+t("gc.phDeleted")+'</div><button class="ph-photo lk" data-php="1"><img src="'+artSrc(p[2])+'" alt=""><em>🔒 '+t("gc.phPhoto")+'</em></button></div>'}
function phThread(){const {p}=gPhone.st,A=ch(p[1]),B=ch(p[2]);const lines=S.lang==="zh"?[["b","你睡了吗？"],["a","没。"],["b","我也没。"],["b","今天的事……对不起。"],["a","……"],["a","明天见。"]]:[["b","You asleep?"],["a","No."],["b","Me neither."],["b","About today… I'm sorry."],["a","…"],["a","See you tomorrow."]];
 $("#phScr").innerHTML='<div class="ph-app"><button class="ph-hd back" data-phh="1">‹ '+esc(first(B.n))+'</button><div class="ph-th">'+lines.map(([w,x])=>'<div class="ph-b '+w+'">'+esc(x)+'</div>').join("")+'<div class="ph-typing">'+esc(first(A.n))+' '+t("gc.phTyping")+'</div></div></div>'}
document.addEventListener("click",e=>{let x;if(!gPhone.st)return;const st=gPhone.st;
 if(x=e.target.closest("[data-phk]")){const k=x.dataset.phk;if(k==="⌫")st.typed=st.typed.slice(0,-1);else if(st.typed.length<4)st.typed+=k;
  $("#phDots").textContent="●".repeat(st.typed.length)+"○".repeat(4-st.typed.length);
  if(st.typed.length===4){if(st.typed===st.code){setTimeout(phHome,250)}else{$("#phDots").classList.add("shake");setTimeout(()=>{st.typed="";const d=$("#phDots");if(d){d.classList.remove("shake");d.textContent="○○○○"}},450)}}return}
 if(e.target.closest("[data-pht]")){phThread();return}
 if(e.target.closest("[data-phh]")){phHome();return}
 if(x=e.target.closest("[data-phd]")){if(!x.classList.contains("lk"))return;if(!(freeToday("draft")||spend(1,"line")))return;x.classList.remove("lk");x.querySelector(".blur").classList.remove("blur");x.querySelector("em").textContent="👀";
  const A=ch(st.p[1]),B=ch(st.p[2]);gResult(st.p,8,S.lang==="zh"?"你在 "+A.n+" 的草稿箱里看到了一条没发给 "+B.n+" 的消息。":"You found an unsent draft to "+B.n+" in "+A.n+"'s phone.");return}
 if(x=e.target.closest("[data-php]")){if(!x.classList.contains("lk"))return;if(!spend(1,"pic"))return;x.classList.remove("lk");x.querySelector("em").textContent=t("gc.phRestored");relAdd(st.p,4);return}});
/* ---------- 2. LOVE LETTER RUSH ---------- */
function gRush(){const p=curPair(),A=ch(p[1]),B=ch(p[2]);
 gScreen(t("gc.rush"),'<p class="sm dim" style="padding:0 16px">'+esc(t("gc.rushHow",{a:first(A.n),b:first(B.n)}))+'</p><div class="rush" id="rush"><div class="rush-hud"><b id="rushS">0</b><span id="rushT">20s</span></div><button class="btn btn-p rush-go" data-rushgo="1">▶ '+t("gc.start")+'</button></div><div id="gRes"></div>')}
function rushRun(){const p=curPair(),A=ch(p[1]),box=$("#rush");let score=0,left=20,alive=true;$(".rush-go").remove();
 const fans=S.lang==="zh"?["来自粉丝","来自队友","来自经纪人","来自前任"]:["from a fan","from a teammate","from his agent","from an ex"];
 const tk=setInterval(()=>{left--;const e=$("#rushT");if(e)e.textContent=left+"s";if(left<=0||!$("#rush")){clearInterval(tk);clearInterval(sp);alive=false;$$(".lt").forEach(x=>x.remove());gResult(p,Math.min(12,Math.round(score/2)),S.lang==="zh"?"你抢回了 "+score+" 封 "+A.n+" 写的信。":"You caught "+score+" of "+A.n+"'s letters.",'<p class="sm" style="margin-top:6px">✉️ × '+score+'</p>')}},1000);
 const sp=setInterval(()=>{if(!alive)return;const real=Math.random()<.5,el=document.createElement("button");el.className="lt"+(real?" real":"");el.style.left=(8+Math.random()*70)+"%";el.style.animationDuration=(2.6+Math.random()*1.4)+"s";
  el.innerHTML=real?'<span style="color:'+A.pal[0]+'">♥ '+esc(first(A.n)[0])+'.</span>':'<span>'+esc(fans[Math.floor(Math.random()*fans.length)])+'</span>';
  el.onclick=()=>{if(el.dataset.hit)return;el.dataset.hit=1;if(real){score++;el.classList.add("got")}else{score=Math.max(0,score-1);el.classList.add("bad")}const s=$("#rushS");if(s)s.textContent=score;setTimeout(()=>el.remove(),250)};
  el.addEventListener("animationend",()=>el.remove());box.appendChild(el)},520)}
document.addEventListener("click",e=>{if(e.target.closest("[data-rushgo]"))rushRun()});
/* ---------- 3. HEARTBEAT CAPSULE (daily gacha) ---------- */
function gCapsule(){const p=curPair(),free=(S.capDay!==today());
 gScreen(t("gc.capsule"),'<div class="cap-m"><div class="cap-dome" id="capDome">'+Array.from({length:14},(_,i)=>'<i style="--h:'+(i*37%360)+';left:'+(8+i*6%80)+'%;top:'+(20+i*13%60)+'%"></i>').join("")+'</div><div class="cap-base"><button class="cap-knob" data-capspin="1" id="capKnob">'+(free?t("gc.capFree"):"💎 1")+'</button><div class="cap-slot" id="capOut"></div></div></div><p class="xs faint" style="text-align:center">'+t("gc.capHow")+'</p><div id="gRes"></div>')}
document.addEventListener("click",e=>{if(!e.target.closest("[data-capspin]"))return;const p=curPair();if(S.capDay===today()){if(!spend(1,"img"))return}else{S.capDay=today();save()}
 const d=$("#capDome"),k=$("#capKnob");d.classList.add("spin");k.disabled=true;k.style.transform="rotate(360deg)";
 setTimeout(()=>{d.classList.remove("spin");const who=Math.random()<.5?p[1]:p[2],c=ch(who),L=S.lang==="zh"?"zh":"en",kind=hash(who+Date.now())%3;
  const tells=(c.tells&&(c.tells[L]||c.tells.en))||[];const prize=kind===0?{i:"🔊",t:t("gc.capVoice"),x:Lz(c.pitch).replace(/[“”"]/g,"")}:kind===1?{i:"🤫",t:t("gc.capSecret"),x:tells[0]||Lz(c.twist)}:{i:"📸",t:t("gc.capPhoto"),img:artSrc(who)};
  $("#capOut").innerHTML='<div class="cap-ball" style="--h:'+(hash(who)%360)+'"></div>';
  setTimeout(()=>{gResult(p,3,(S.lang==="zh"?"扭蛋开出了 ":"Capsule: ")+c.n+" · "+prize.t,'<div class="cap-prize">'+(prize.img?'<img src="'+prize.img+'" alt="">':'')+'<b>'+prize.i+' '+esc(first(c.n))+' · '+prize.t+'</b>'+(prize.x?'<p>“'+esc(prize.x)+'”</p>':'')+'</div>');if(kind===0)speak(prize.x,who)},700)},1600)});
/* ---------- 4. WHO REMEMBERS WRONG ---------- */
const MEM={
 ice:{zh:[["我们进房间的时候是 1:52。","我们进房间的时候是 1:52。",0],["他先说他睡地上。","我先说我睡地上。",1],["暖气是半夜坏的。","暖气是半夜坏的。",0],["我整晚都没睡。","他三点就睡着了，还打呼。",1],["早上是我先醒的。","早上是我先醒的。",1]],
  en:[["We got to the room at 1:52.","We got to the room at 1:52.",0],["He offered to take the floor.","I offered to take the floor.",1],["The heat died around midnight.","The heat died around midnight.",0],["I didn't sleep at all.","He was asleep by three. Snoring.",1],["I woke up first.","I woke up first.",1]]},
 crimson:{zh:[["那晚他没点酒。","那晚我给他倒了一杯红酒。",1],["窗帘是我拉上的。","窗帘是我拉上的。",1],["他五点四十走的。","他五点四十走的。",0],["我没有回头。","他回头看了三次。",1]],
  en:[["He didn't order a drink.","I poured him a glass of red.",1],["I closed the curtains.","I closed the curtains.",1],["He left at 5:40.","He left at 5:40.",0],["I didn't look back.","He looked back three times.",1]]},
 made:{zh:[["生日宴在九点开始。","生日宴在九点开始。",0],["他全程站在门口。","他全程站在我身后。",1],["是我先看到枪手的。","是我先看到枪手的。",1],["他没有碰我。","他抓住了我的手腕。",1]],
  en:[["The party started at nine.","The party started at nine.",0],["He stayed by the door all night.","He stayed behind me all night.",1],["I saw the shooter first.","I saw the shooter first.",1],["He never touched me.","He grabbed my wrist.",1]]}};
function gRemember(){let p=curPair();if(!MEM[p[0]])p=BLP[0];const A=ch(p[1]),B=ch(p[2]),L=S.lang==="zh"?"zh":"en",rows=MEM[p[0]][L];gRemember.st={p,rows,found:0,need:rows.filter(r=>r[2]).length,miss:0};
 gScreen(t("gc.remember"),'<p class="sm dim" style="padding:0 16px">'+esc(t("gc.remHow",{a:first(A.n),b:first(B.n)}))+'</p><div class="rem"><div class="rem-h"><span>'+avatar(p[1],28)+esc(first(A.n))+'</span><span>'+avatar(p[2],28)+esc(first(B.n))+'</span></div>'+
  rows.map((r,i)=>'<button class="rem-r" data-rem="'+i+'"><p>'+esc(r[0])+'</p><p>'+esc(r[1])+'</p></button>').join("")+'</div><p class="xs faint" id="remC" style="text-align:center">0 / '+gRemember.st.need+'</p><div id="gRes"></div>')}
document.addEventListener("click",e=>{const x=e.target.closest("[data-rem]");if(!x||x.disabled)return;const st=gRemember.st,r=st.rows[+x.dataset.rem];x.disabled=true;
 if(r[2]){st.found++;x.classList.add("hit")}else{st.miss++;x.classList.add("miss")}$("#remC").textContent=st.found+" / "+st.need;
 if(st.found===st.need){const A=ch(st.p[1]),B=ch(st.p[2]);gResult(st.p,st.miss?5:9,S.lang==="zh"?"你发现 "+A.n+" 和 "+B.n+" 对那一晚的说法对不上——他们都在保护对方。":"You caught "+A.n+" and "+B.n+" remembering that night differently — each protecting the other.")}});
/* ---------- 5. PARTY (Game Night) ---------- */
function gParty(){const w=wd("afterhours");const th=Object.values(S.threads).filter(x=>x.wid==="afterhours").sort((a,b)=>b.at-a.at)[0]||newThread(null,"afterhours");save();openThread(th.id);setTimeout(gameHub,400)}

/* ================= PHONE CALLS — at story peaks he calls you ================= */
let call=null;
function callCard(th,cid){th.msgs.push({who:"sys",k:"card",title:"📞 "+t("call.in",{n:first(ch(cid).n)}),txt:t("call.inS"),btn:t("call.pick"),act:"call|"+cid,at:Date.now()});save();if(curT===th.id)renderChat()}
function startCall(cid){const c=ch(cid),th=S.threads[curT];call={cid,th,t0:Date.now(),muted:false,n:0};
 const el=document.createElement("div");el.className="callv";el.innerHTML='<div class="cv-bg" style="background-image:url('+artSrc(cid)+')"></div><div class="cv-veil"></div><div class="cv-top"><b>'+esc(c.n)+'</b><span id="cvT">00:00</span></div><div class="cv-av">'+avatar(cid,120)+'<div class="cv-wave" id="cvW"><i></i><i></i><i></i><i></i><i></i></div></div><p class="cv-line" id="cvL">…</p>'+
  '<div class="cv-rep" id="cvR"></div><div class="cv-bot"><button class="cv-b" data-cvmute="1">🎙<small>'+t("call.mute")+'</small></button><button class="cv-b end" data-cvend="1">✕<small>'+t("call.end")+'</small></button></div>';
 $("#dev").appendChild(el);call.tk=setInterval(()=>{const s=Math.floor((Date.now()-call.t0)/1000),e=$("#cvT");if(e)e.textContent=String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")},1000);callSay(null)}
async function callSay(user){if(!call)return;const c=ch(call.cid),L=S.lang==="zh",line=$("#cvL"),rep=$("#cvR");rep.innerHTML="";line.textContent="…";$("#cvW").classList.add("on");
 let say="",opts=[];
 if(SAMPLE){try{const r=await SAMPLE.json("You are "+c.n+" ("+Lz(c.vibe)+") on a late-night phone call with "+(me()||"the user")+", right after this story moment: "+(call.th?(call.th.mem||[]).slice(-3).join("; "):"")+". "+(user?"They just said: \""+user+"\".":"You called them first — say why, but not all of it.")+" Reply ONLY JSON {\"say\":\"one or two spoken sentences, natural, intimate, a little guarded\",\"options\":[\"3 short things they could say back\"]} in "+(L?"Simplified Chinese":"English")+".",{modelTier:"quick"});say=r.say;opts=r.options||[]}catch(_){}}
 if(!say){const P=L?[["睡不着。不想一个人待着。","你还在吗？"],["刚才的事……我不是那个意思。","别挂。"],["我在你楼下。你可以不下来。","就……再说一会儿。"]]:[["Couldn't sleep. Didn't want to be alone with it.","You still there?"],["What I said earlier… I didn't mean it like that.","Don't hang up."],["I'm outside your building. You don't have to come down.","Just… talk a little longer."]];const k=Math.min(call.n,2);say=P[k][0]+" "+P[k][1];opts=L?["我在。","你为什么现在打来？","我下去。"]:["I'm here.","Why are you calling now?","I'm coming down."]}
 call.n++;line.textContent=say;speak(say,call.cid,()=>{const w=$("#cvW");w&&w.classList.remove("on")});
 rep.innerHTML=opts.slice(0,3).map(o=>'<button data-cvo="'+esc(o)+'">'+esc(o)+'</button>').join("");call.last=say}
function endCall(){if(!call)return;clearInterval(call.tk);stopVoice();const s=Math.floor((Date.now()-call.t0)/1000),c=ch(call.cid),th=call.th;
 if(th){th.msgs.push({who:"sys",k:"card",title:"📞 "+t("call.ended",{n:first(c.n)}),txt:String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")+(call.last?" · “"+call.last+"”":""),at:Date.now()});th.mem.push("Late-night phone call with "+c.n+" ("+s+"s). Last thing he said: "+(call.last||""));th.love[call.cid]=Math.min(100,(th.love[call.cid]||0)+4);save();if(curT===th.id)renderChat()}
 $(".callv")&&$(".callv").remove();call=null}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-cvo]")){callSay(x.dataset.cvo);return}
 if(e.target.closest("[data-cvend]")){endCall();return}
 if(x=e.target.closest("[data-cvmute]")){x.classList.toggle("on");return}
 if(x=e.target.closest("[data-callnow]")){callGate(x.dataset.callnow);return}});

/* ================= FAN RANKING on character pages ================= */
const FAN_NAMES=["velvetnoir","hockeyhearts","lunaticmarie","nightowl_reads","ivywrites","cool_pixie","smart_owl","SilentMoon","HonestFox","Maxiii","cute_tiger","brave_heart"];
function fanBoard(id){const mine=Object.values(S.threads).filter(th=>th.cast.includes(id)).reduce((n,th)=>n+th.msgs.filter(m=>m.who==="me").length*10+Math.round((th.love[id]||0)*8),0)+((S.boost&&S.boost[id])||0)*52;
 const rows=FAN_NAMES.map((u,i)=>({u:"@"+u,pt:Math.round(3900-i*260-(hash(u+id)%180))}));if(mine)rows.push({u:"@"+(me()||"you"),pt:mine,me:1});return rows.sort((a,b)=>b.pt-a.pt).map((r,i)=>Object.assign(r,{rk:i+1}))}
function fanHTML(id){const c=ch(id),b=fanBoard(id),top=b.slice(0,3),mine=b.find(r=>r.me);const med=["🥇","🥈","🥉"],ord=[1,0,2];
 return '<div class="fanh"><p class="xs faint">'+t("fan.chatting",{n:fmtN(20000+hash(id)%480000)})+'</p><h2 style="font-size:22px;margin-top:4px">TOP 30</h2><div class="fan3">'+ord.map(i=>top[i]?'<div class="f3 r'+(i+1)+(top[i].me?" me":"")+'"><span>'+med[i]+'</span><div class="av mea" style="width:'+(i?46:56)+'px;height:'+(i?46:56)+'px">'+esc(top[i].u[1].toUpperCase())+'</div><b>'+esc(top[i].u)+'</b><em class="num">'+fmtN(top[i].pt)+'</em></div>':"").join("")+'</div>'+
  b.slice(3,12).map(r=>'<div class="frow'+(r.me?" me":"")+'"><span class="rk">'+r.rk+'</span><div class="av mea" style="width:32px;height:32px">'+esc(r.u[1].toUpperCase())+'</div><b class="grow">'+esc(r.u)+'</b><em class="num">'+fmtN(r.pt)+'</em></div>').join("")+
  (mine&&mine.rk>12?'<div class="frow me"><span class="rk">'+mine.rk+'</span><div class="av mea" style="width:32px;height:32px">★</div><b class="grow">'+esc(mine.u)+'</b><em class="num">'+fmtN(mine.pt)+'</em></div>':'')+
  '<p class="xs faint" style="margin-top:10px">'+t(mine?"fan.how":"fan.join",{n:first(c.n)})+'</p><button class="btn btn-g btn-block btn-sm" style="margin-top:8px" data-fanshare="'+id+'">📤 '+t("fan.share")+'</button></div>'}
document.addEventListener("click",e=>{const x=e.target.closest("[data-fanshare]");if(!x)return;const id=x.dataset.fanshare,c=ch(id),m=fanBoard(id).find(r=>r.me);
 openShare({tag:"TOP FAN",who:c.n,big:m?"#"+m.rk:"TOP 30",quote:m?t("fan.shareQ",{n:first(c.n),r:m.rk}):t("fan.shareQ2",{n:first(c.n)}),bg:artSrc(id),text:m?t("fan.shareQ",{n:first(c.n),r:m.rk})+" — MIRU":c.n+" — MIRU",link:shareURL("f",id)})});

/* story peaks: roughly every 22 replies in a story he calls you (never twice in a row, not in the first 10) */
function storyHooks(th,m){if(!th.wid)return;th.pkN=(th.pkN||0)+1;if(th.pkN>=10&&th.pkN-(th.lastCall||0)>=22&&m.k==="say"){th.lastCall=th.pkN;const cid=m.who;setTimeout(()=>callCard(th,cid),1400)}}
/* home "Games" tab — small poster strip into the Game Center */
function gcMini(){const p=curPair();return '<div class="gcm"><button class="gcm-hero" data-gcenter="1"><div class="gc-heroimg">'+BLP.slice(0,4).map(b=>'<img src="'+artSrc(b[1])+'" alt="">').join("")+'</div><div class="gc-heroveil"></div><div class="gc-herocap"><h1>GAME CENTER</h1><p>'+t("gc.sub")+'</p></div></button>'+
 '<div class="rail" style="padding-top:12px">'+GC.map(g=>'<button class="gc-card mini" data-gc="'+g.k+'"><div class="gc-poster"><img src="'+gcArt(g,p)+'" alt=""><div class="gc-pv"></div><b class="gc-pt" style="font-family:'+g.font+';background:linear-gradient(180deg,'+g.c1+','+g.c2+');-webkit-background-clip:text;background-clip:text">'+t(g.title)+'</b></div><span class="gc-tag '+g.tag.toLowerCase()+'">'+g.tag+'</span></button>').join("")+'</div></div>'}

function gcArt(g,p){return artSrc(g.k==="phone"?p[1]:g.k==="rush"?p[2]:g.k==="capsule"?p[0]:g.k==="remember"?(MEM[p[0]]&&p[0]!=="ice"?BLP[0][0]:"crimson"):g.bg)}
