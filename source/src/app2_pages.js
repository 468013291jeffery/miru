/* ================= ONBOARDING ================= */
let obStep=0,obAge=false;
function renderOB(){
 const steps=6;
 if(obStep===0){
  const cols=[["mason","lucien","wren","ethan"],["iris","adrian","nico","sasha"],["rowan","theo","noor","elijah"]];
  screen("s-ob",'<div class="ob-art"><div class="cols">'+cols.map(c=>'<div class="col">'+c.concat(c).map(id=>'<img src="'+artSrc(id)+'" alt="">').join("")+'</div>').join("")+'</div><div class="fade"></div></div>'+
   '<div class="scroll pad stack" style="gap:14px;padding-block:0 20px">'+
   '<div class="row" style="justify-content:space-between"><div class="brand" style="font-size:30px">MI<b>RU</b></div>'+langPicker()+'</div>'+
   '<h1 style="font-size:28px;line-height:1.15">'+t("ob.h1")+'</h1><p class="dim" style="font-size:13.5px;line-height:1.6">'+t("ob.sub")+'</p>'+
   '<button class="bigopt'+(obAge?" on":"")+'" id="obAge"><span class="check">'+(obAge?"✓":"")+'</span><span style="font-size:12px;color:var(--dim)">'+t("ob.age")+'</span></button>'+
   '<button class="btn btn-p btn-block" id="obGo">'+t("ob.start")+'</button></div>');}
 else{
  let body="";
  if(obStep===1){if(!S.or)S.or="bl";const on=k=>S.or===k?" on":"";
   body='<h1 style="font-size:25px">'+t("ob.q1")+'</h1><p class="dim sm" style="margin-top:6px">'+t("ob.q1s")+'</p>'+
   '<button class="orT big orBL'+on("bl")+'" data-or="bl"><div class="orI"><img src="art/ice.jpg" alt=""><img src="art/crimson.jpg" alt=""><img src="art/heir.jpg" alt=""></div><div class="orV"></div><span class="orHot">🔥 '+t("ob.hot")+'</span><span class="orC">✓</span><div class="orL"><b>BL</b><span>'+t("ob.blS")+'</span></div></button>'+
   '<div class="orRow3"><button class="orT sm'+on("gl")+'" data-or="gl"><div class="orI"><img src="art/light.jpg" alt=""></div><div class="orV"></div><span class="orC">✓</span><div class="orL"><b>'+t("ob.gl")+'</b><span>'+t("ob.glS")+'</span></div></button>'+
   '<button class="orT sm'+on("bg")+'" data-or="bg"><div class="orI"><img src="art/offbook.jpg" alt=""></div><div class="orV"></div><span class="orC">✓</span><div class="orL"><b>'+t("ob.bg")+'</b><span>'+t("ob.bgS")+'</span></div></button>'+
   '<button class="orT sm'+on("all")+'" data-or="all"><div class="orI"><img src="art/pact.jpg" alt=""></div><div class="orV"></div><span class="orC">✓</span><div class="orL"><b>'+t("ob.both")+'</b><span>'+t("ob.bothS")+'</span></div></button></div>'}
  if(obStep===2){body='<h1 style="font-size:25px">'+t("ob.q2")+'</h1><p class="dim sm" style="margin-top:6px">'+t("ob.q2s")+'</p><div class="row wrap" style="gap:8px;margin-top:18px">'+
   TAGS.trope.map(x=>'<button class="chip'+(S.tropes.includes(x)?" on":"")+'" data-tr="'+esc(x)+'">'+esc(tagName(x))+'</button>').join("")+'</div>'}
  if(obStep===3){body='<h1 style="font-size:25px">'+t("ob.q3")+'</h1><p class="dim sm" style="margin-top:6px">'+t("ob.q3s")+'</p><div class="stack" style="gap:10px;margin-top:18px">'+
   ["fluff","slow","steamy","mature"].map(k=>'<button class="bigopt'+(S.heat===k?" on":"")+'" data-heat="'+k+'"><span class="grow"><b>'+t("heat."+k)+'</b><span>'+t("heat."+k+"S")+'</span></span><span class="check">'+(S.heat===k?"✓":"")+'</span></button>').join("")+'</div>'}
  if(obStep===4){const p=persona();body='<h1 style="font-size:25px">'+t("ob.q4")+'</h1><p class="dim sm" style="margin-top:6px">'+t("ob.q4s")+'</p><div class="stack" style="gap:14px;margin-top:18px">'+
   '<div class="field"><label for="pName">'+t("ob.name")+'</label><input id="pName" maxlength="24" value="'+esc(p.name)+'" placeholder="Alex"></div>'+
   '<div class="field"><label>'+t("ob.pron")+'</label><div class="seg" id="pPron">'+["he","she","they"].map(k=>'<button data-pron="'+k+'" class="'+(p.pron===k?"on":"")+'">'+{he:"he/him",she:"she/her",they:"they/them"}[k]+'</button>').join("")+'</div></div>'+
   '<div class="field"><label for="pLook">'+t("ob.look")+'</label><input id="pLook" maxlength="80" value="'+esc(p.look)+'" placeholder="'+esc(t("ob.lookPh"))+'"></div></div>'}
  if(obStep===5){screen("s-ob",'<div class="topbar"><button class="ibtn" id="obBack">'+ic("back")+'</button><div class="progress"><i style="width:100%"></i></div><span class="xs faint num">5 / 5</span></div><div class="scroll" style="padding-bottom:16px">'+obRecHTML()+'</div>');show("s-ob");obRecWire();return}
  screen("s-ob",'<div class="topbar"><button class="ibtn" id="obBack">'+ic("back")+'</button><div class="progress"><i style="width:'+(obStep/steps*100)+'%"></i></div><span class="xs faint num">'+obStep+' / '+(steps-1)+'</span></div>'+
   '<div class="scroll pad" style="padding-bottom:20px">'+body+'</div>'+
   '<div class="startbar"><button class="btn btn-p btn-block" id="obNext">'+(obStep===4?t("ob.done"):t("ob.next"))+'</button></div>');}
 show("s-ob");}
function langPicker(){return '<button class="chip" data-langsheet="1">'+ic("globe").replace('<svg','<svg style="width:14px;height:14px;vertical-align:-2px;stroke:currentColor;fill:none;stroke-width:1.7;margin-right:4px"')+(LANGS.find(l=>l[0]===S.lang)||LANGS[0])[1]+'</button>'}
document.addEventListener("click",e=>{
 const b=e.target;let x;
 if(b.closest("#obAge")){obAge=!obAge;renderOB();return}
 if(b.closest("#obGo")){if(!obAge){toast(t("ob.needAge"));return}obStep=1;renderOB();return}
 if(b.closest("#obBack")){obStep=Math.max(0,obStep-1);renderOB();return}
 if(x=b.closest("[data-or]")){S.or=x.dataset.or;renderOB();return}
 if(x=b.closest("[data-tr]")){const k=x.dataset.tr;S.tropes=S.tropes.includes(k)?S.tropes.filter(y=>y!==k):S.tropes.concat(k);x.classList.toggle("on");return}
 if(x=b.closest("[data-heat]")&&$("#s-ob")&&!$("#s-ob").hidden){S.heat=b.closest("[data-heat]").dataset.heat;renderOB();return}
 if(x=b.closest("[data-pron]")){persona().pron=x.dataset.pron;$$("#pPron button").forEach(y=>y.classList.toggle("on",y===x));return}
 if(b.closest("#obNext")){
  if(obStep===2&&S.tropes.length<3){toast(t("ob.q2s"));return}
  if(obStep===4){const p=persona();p.name=($("#pName").value||"").trim()||"Alex";p.look=($("#pLook").value||"").trim();obStep=5;save();renderOB();return}
  obStep++;save();renderOB();return}
 if(b.closest("[data-langsheet]")){sheet('<h2>'+t("me.lang")+'</h2><div class="stack" style="margin-top:10px">'+LANGS.map(([k,n])=>'<button class="opt" data-lang="'+k+'"><span class="grow"><b>'+n+'</b></span>'+(S.lang===k?'<span class="check on">✓</span>':"")+'</button>').join("")+'</div>');return}
 if(x=b.closest("[data-lang]")){S.lang=x.dataset.lang;save();closeSheet();rerender();return}});
function rerender(){
 const cur=$$(".screen").find(s=>!s.hidden);
 if(!S.ob){renderOB();return}
 renderMain();
 if(cur&&cur.id==="s-story"&&curStory)openStory(curStory,true);
 else if(cur&&cur.id==="s-char"&&curChar)openChar(curChar,true);
 else if(cur&&cur.id==="s-chat"&&curT)openThread(curT);
 else show("s-main");}

/* ================= MAIN / TABS ================= */
function renderMain(){
 screen("s-main",'<div id="tabv" class="stack" style="flex:1;min-height:0"></div>'+
  '<nav class="tabbar">'+[["home","home"],["discover","compass"],["create","create"],["chats","chat"],["me","me"]].map(([k,i])=>
   '<button data-tab="'+k+'" class="'+(S.lastTab===k?"on":"")+'">'+ic(i)+'<span>'+t("tab."+k)+'</span></button>').join("")+'</nav>');
 renderTab(S.lastTab);}
function renderTab(k){S.lastTab=k;save();
 $$(".tabbar button").forEach(b=>b.classList.toggle("on",b.dataset.tab===k));
 const v=$("#tabv");if(!v)return;
 try{({home:renderHome,discover:renderDiscover,chats:renderChats,create:renderCreate,me:renderMe}[k]||renderHome)(v)}
 catch(e){try{console.error(e)}catch(_){}v.innerHTML='<div class="empty" style="padding-top:80px">'+t("err.page")+'<br><code style="font-size:10px;opacity:.6">'+esc(String(e&&e.message||e).slice(0,140))+'</code><br><code style="font-size:9px;opacity:.45;display:block;max-width:92%;margin:4px auto 0;word-break:break-all">'+esc(String(e&&e.stack||'').split('\n').slice(1,4).map(x=>x.trim().replace(/https?:\/\/[^ )]*\//g,'')).join(' | ').slice(0,300))+'</code><br><button class="btn btn-g btn-sm" style="margin-top:12px" data-fixdata="1">'+t("err.fix")+'</button></div>'}}
document.addEventListener("click",e=>{if(e.target.closest("[data-fixdata]")){cleanState(true);renderTab(S.lastTab||"home")}});
document.addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(b){renderTab(b.dataset.tab);show("s-main")}});
function orOK(w){return S.or==="all"||w.or===S.or||w.or==="all"}
function tasteScore(w){return (w.tags||[]).filter(x=>S.tropes.includes(x)).length*10+(orOK(w)?50:0)+(S.or==='all'&&w.or==='bl'?30:0)+(w.cover?14:0)+Math.log10(w.stats?w.stats[0]:10)}
function worldsForYou(){return allWorlds().filter(orOK).sort((a,b)=>tasteScore(b)-tasteScore(a))}

/* ---------- HOME (stories + feed, Instagram-style) ---------- */
function feedPosts(){
 const ws=allWorlds().filter(orOK).map(w=>w.id);
 return dailyPosts().concat(POSTS.filter(p=>{const c=ch(p.who);return c&&ws.includes(c.w)}).map((p,i)=>Object.assign({id:"p"+i+"_"+p.who,at:Date.now()-(i*2+1)*36e5},p)));}
let homeFeed="all",homeTab="quest",dkTimer=null,dkObs=null;
/* renderHome → app15_home.js (vertical short-drama feed) */
function homeTabBody(ws){ws=ws||worldsForYou();
 if(homeTab==="play"){const pr=allWorlds().filter(w=>w.kind==="ensemble"&&orOK(w)).sort((a,b)=>(b.mineAt||0)-(a.mineAt||0)||b.cast.length-a.cast.length);
  return '<div class="sec" style="padding-top:12px"><p class="xs faint grow">'+t("pr.sub")+'</p><button class="more" data-playall="1">'+t("home.seeall")+'</button></div><div class="rail">'+pr.map(prCard).join("")+'<button class="prc prnew" data-cre="group"><span style="background:url(art/world_new.jpg) center/cover">&nbsp;</span><b>'+t("wd.new")+'</b><p>'+t("wd.newS")+'</p></button></div>'}
 if(homeTab==="games")return gcMini();
 if(homeTab==="rank")return rankHTML();
 if(homeTab==="earn")return tasksHTML();
 if(homeTab==="rankOld"){const cs=allChars().filter(id=>{const c=ch(id),w=wd(c.w);return w&&orOK(w)}).sort((a,b)=>((wd(ch(b).w).stats||[0])[0]+hash(b)%5e4)-((wd(ch(a).w).stats||[0])[0]+hash(a)%5e4)).slice(0,10);
  return '<div class="rank">'+cs.map((id,i)=>{const c=ch(id),w=wd(c.w);return '<button class="rrow" data-char="'+id+'"><span class="rn'+(i<3?" top":"")+'">'+(i+1)+'</span>'+avatar(id,48)+
   '<div class="grow" style="min-width:0"><b>'+esc(c.n)+'</b><p>'+esc(Lz(w.title))+' · '+esc(Lz(c.role))+'</p></div><span class="xs faint num">💬 '+fmtN(((w.stats||[0])[0]||0)+hash(id)%5e4)+'</span></button>'}).join("")+'</div>'}
 if(homeTab==="world"){const ws2=allWorlds().filter(w=>w.kind==="ensemble"&&orOK(w)).sort((a,b)=>(b.mineAt||0)-(a.mineAt||0));
  return '<div class="grid2" style="padding-top:12px"><button class="gcard wnew" data-cre="group"><div class="art"><img src="art/world_new.jpg" alt=""></div><div class="b"><b>'+t("wd.new")+'</b><p class="s">'+t("wd.newS")+'</p></div></button>'+
   ws2.map(w=>'<button class="gcard" data-story="'+w.id+'">'+((w.cover||S.art[w.id]||w.mine)?img(w.id,"art"):'<div class="art wcast">'+w.cast.slice(0,4).map(id=>'<img src="'+artSrc(id)+'" alt="">').join("")+'</div>')+'<div class="b"><b>'+esc(Lz(w.title))+'</b><p class="s">'+esc(Lz(w.hook))+'</p><div class="m">'+(w.mine?'✦ '+t("wd.mine"):'👥 '+w.cast.length)+' · 💬 '+fmtN(w.stats?w.stats[0]:0)+'</div></div></button>').join("")+'</div>'}
 if(homeTab==="quest"){const qs=allWorlds().filter(w=>w.quest&&orOK(w));if(!qs.length)return '<p class="empty">'+t("me.empty")+'</p>';
  const pts=qs.reduce((n,w)=>{const m=qBoard(w).find(r=>r.me);return n+(m?m.pt:0)},0),left=Math.max(0,pts-(S.ptsSpent||0));
  /* the "my points" bar used to sit above the quest cards, eating the first screen's height; it now trails the cards
     so the quest content itself (and the TONIGHT deck above) get first billing on a phone. */
  return '<p class="xs faint" style="padding:8px 16px 0">'+t("q.upd")+'</p>'+qs.map(w=>{const L=qBoard(w).slice(0,3);
   return '<div class="qcard"><button class="qhd" data-qboard="'+w.id+'">'+img(w.cover?w.id:w.cast[0],"art qart")+'<div class="grow" style="min-width:0"><div class="eyebrow" style="color:var(--gold)">'+t("st.quest")+'</div><b>'+esc(Lz(w.quest.qtitle))+'</b><p>'+esc(Lz(w.hook))+'</p></div><span class="faint">›</span></button>'+
    '<button class="qlist" style="width:100%;text-align:left" data-qboard2="'+w.id+'">'+L.map(qRow).join("")+'</button><button class="btn btn-p btn-block btn-sm" style="margin-top:10px" data-story="'+w.id+'" data-quest="1">'+t("q.go")+'</button></div>'}).join("")+
   '<div class="ptbar" style="margin:16px 16px 4px"><div class="grow"><div class="eyebrow">'+t("pt.mine")+'</div><b class="num">'+fmtN(left)+' pt</b><p class="xs faint">'+t("pt.how")+'</p></div><button class="btn btn-p btn-sm" data-redeem="1"'+(left<500?" disabled":"")+'>'+t("pt.redeem")+'</button></div>'}
 return '<div class="grid2" style="padding-top:12px">'+ws.slice(0,10).map(w=>wCardG(w)).join("")+'</div>'}
/* quest leaderboard: player × character, points; the viewer's own best run is ranked in with them */
const QNAMES=["Ken_the_rink","Maxiii","cool_anon","brave_heart","HonestFox","Cyrille","cool_pixie","cute_tiger","smart_owl","SilentMoon","velvetnoir","lunaticmarie"];
function qBoard(w){const cast=w.cast.filter(id=>ch(id)),rows=QNAMES.map((u,i)=>({u:"@"+u,cid:cast[(hash(u+w.id))%cast.length],pt:Math.round(7200-i*140-(hash(u+w.id)%120)/10)*1}));
 const mine=Object.values(S.threads).filter(th=>th.wid===w.id&&th.kind==="quest");if(mine.length){const th=mine.sort((a,b)=>(b.rounds||0)-(a.rounds||0))[0];const lv=Math.max(0,...Object.values(th.love||{}));
  rows.push({u:"@"+(me()||"you"),cid:th.cast[0],pt:Math.round((th.rounds||0)*180+lv*40+Object.keys(th.tasks||{}).length*300),me:1})}
 return rows.sort((a,b)=>b.pt-a.pt).map((r,i)=>Object.assign(r,{rk:i+1}))}
function qRow(r){return '<div class="qrow r'+(r.rk<=3?r.rk:0)+(r.me?" me":"")+'"><span class="rk">'+r.rk+'</span><span class="uav">'+(r.me?"★":"W")+'</span><b class="un">'+esc(r.u)+'</b><span class="x">×</span>'+avatar(r.cid,28)+'<b class="cn">'+esc(first(ch(r.cid).n))+'</b><span class="pt num">'+fmtN(r.pt)+' pt</span></div>'}
let qTab="task";
function openQuest(wid,tab){const w=wd(wid),q=w.quest;if(tab)qTab=tab;
 const body=qTab==="rank"?'<div class="pad" style="padding-top:14px"><div class="row"><h2 class="grow" style="font-size:20px">'+t("q.rank")+'</h2><span class="chip">'+t("q.all")+'</span></div><p class="xs faint" style="margin:8px 0 12px">'+t("q.upd")+'</p><div class="qlist">'+qBoard(w).map(qRow).join("")+'</div><button class="btn btn-g btn-block btn-sm" style="margin-top:12px" data-shq="'+w.id+'">📤 '+t("shr.rank")+'</button></div>'
  :'<div class="pad" style="padding-top:14px">'+img(w.cover?w.id:w.cast[0],"art","height:190px;border-radius:18px")+
   '<h2 style="font-size:19px;margin-top:16px">'+t("q.intro")+'</h2><p class="qintro">'+esc(Lz(w.premise||w.hook))+(w.status&&w.status.place?'\n\n📍 '+esc(Lz(w.status.place))+(w.status.time?' · '+esc(Lz(w.status.time)):""):"")+'\n\n'+esc(t("q.pitch",{a:first(ch(w.cast[0]).n)}))+'</p>'+
   '<p class="qtags">'+(w.tags||[]).map(x=>'#'+esc(tagName(x).replace(/\s+/g,""))).join(" ")+'</p>'+
   '<h2 style="font-size:19px;margin-top:18px">'+t("q.tasks")+'</h2><div class="qbanner">'+t("q.inN",{n:q.turns})+'</div>'+
   '<div class="qgoals">'+q.goals.map((g,i)=>'<div class="qg"><span class="qn">'+(i+1)+'</span><span>'+esc(Lz(g))+'</span></div>').join("")+
   '<div class="qg hid"><span class="qn">?</span><span>'+t("q.hidden")+'</span></div></div></div>';
 screen("s-quest",'<div class="topbar"><button class="ibtn" data-back="1">'+ic("back")+'</button><h2 class="grow" style="font-size:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(Lz(q.qtitle))+'</h2></div>'+
  '<div class="tabs"><button data-qtab="task" class="'+(qTab==="task"?"on":"")+'">'+t("q.task")+'</button><button data-qtab="rank" class="'+(qTab==="rank"?"on":"")+'">'+t("q.rank")+'</button></div>'+
  '<div class="scroll" style="padding-bottom:90px">'+body+'</div><div class="qcta"><button class="btn btn-p btn-block" data-story="'+w.id+'" data-quest="1">'+t("q.go")+'</button></div>');
 const sc=$("#s-quest");sc.dataset.wid=wid;show("s-quest")}
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-redeem]")){S.ptsSpent=(S.ptsSpent||0)+500;S.keys++;save();toast(t("pt.done"));const b=$("#htabBody");if(b)b.innerHTML=homeTabBody();const k=$(".topbar .chip.num");if(k)k.textContent="💎 "+S.keys;return}
 if(x=e.target.closest("[data-qboard2]")){openQuest(x.dataset.qboard2,"rank");return}
 if(x=e.target.closest("[data-qboard]")){openQuest(x.dataset.qboard,"task");return}
 if(x=e.target.closest("[data-qtab]")){openQuest($("#s-quest").dataset.wid,x.dataset.qtab);return}
 if(x=e.target.closest("[data-htag]")){const tg=x.dataset.htag;disc.sel={genre:[],setting:[],trope:[],char:[],gong:[],shou:[]};disc.q="";const r=Object.keys(TAGS).find(k=>TAGS[k].includes(tg));if(r)disc.sel[r]=[tg];renderTab("discover");show("s-main");return}
 if(x=e.target.closest("[data-hsearch]")){disc.sel={genre:[],setting:[],trope:[],char:[],gong:[],shou:[]};disc.q="";renderTab("discover");show("s-main");setTimeout(()=>{if(x.dataset.hsearch==="1"){const q=$("#discQ");q&&q.focus()}else{const r=$(".tagrows");r&&r.scrollIntoView({block:"start"})}},60);return}});
function prCard(w){const cv=w.cover||S.art[w.id]||w.mine;return '<button class="prc" data-story="'+w.id+'"><div class="prart">'+(cv?'<img src="'+artSrc(w.id)+'" alt="">':'<div class="wcast">'+w.cast.slice(0,4).map(id=>'<img src="'+artSrc(id)+'" alt="">').join("")+'</div>')+
 '<span class="prn">👥 '+w.cast.length+'</span></div><b>'+esc(Lz(w.title))+'</b><p>'+esc(Lz(w.hook))+'</p><div class="prav">'+w.cast.slice(0,4).map(id=>avatar(id,26)).join("")+(w.cast.length>4?'<span>+'+(w.cast.length-4)+'</span>':"")+'</div></button>'}
function wCardG(w,quest){return '<button class="gcard" data-story="'+w.id+'"'+(quest?' data-quest="1"':"")+'>'+img(w.cover?w.id:w.cast[0],"art")+'<div class="b"><b>'+esc(quest&&w.quest?Lz(w.quest.qtitle):Lz(w.title))+'</b><p class="s">'+esc(Lz(w.hook))+'</p>'+
 '<div class="m">'+(quest?'<span class="badge q" style="position:static">'+t("st.quest")+'</span>':SHORTS[w.id]?'▶ '+(eps(w.id).length)+' EP · ':'')+'💬 '+fmtN(w.stats?w.stats[0]:0)+'</div></div></button>'}
function dkWire(){const dk=$("#dk");if(!dk)return;clearInterval(dkTimer);if(dkObs)dkObs.disconnect();
 const cards=[...dk.querySelectorAll(".dkc")];let cur=0,touch=0;
 const act=i=>{cur=i;const n=$("#dkn");if(n)n.textContent=(i+1)+" / "+cards.length;const id=cards[i].dataset.short,p=$("#dkPlay"),q=$("#dkIn");if(p)p.dataset.short=id;if(q)q.dataset.story=id;
  cards.forEach((c,j)=>{c.classList.toggle("on",j===i);const v=c.querySelector("video");if(!v)return;if(j===i){if(!v.src)v.src=v.dataset.src;const pr=v.play();pr&&pr.catch&&pr.catch(()=>{})}else v.pause()})};
 const near=()=>{const m=dk.scrollLeft+dk.clientWidth/2;let b=0,d=1e9;cards.forEach((c,j)=>{const x=Math.abs(c.offsetLeft+c.offsetWidth/2-m);if(x<d){d=x;b=j}});return b};let st;dk.addEventListener("scroll",()=>{clearTimeout(st);st=setTimeout(()=>{const n=near();if(n!==cur)act(n)},90)},{passive:true});
 act(0);dkWire.go=i=>{i=(i+cards.length)%cards.length;const c=cards[i];touch=Date.now();dk.scrollTo({left:c.offsetLeft-(dk.clientWidth-c.offsetWidth)/2,behavior:"smooth"})};dkWire.cur=()=>cur;
 ["touchstart","pointerdown","wheel"].forEach(ev=>dk.addEventListener(ev,()=>{touch=Date.now()},{passive:true}));
 dkTimer=setInterval(()=>{if(!document.body.contains(dk)){clearInterval(dkTimer);return}if(Date.now()-touch<9000||cards.length<2)return;const c=cards[(cur+1)%cards.length];dk.scrollTo({left:c.offsetLeft-(dk.clientWidth-c.offsetWidth)/2,behavior:"smooth"})},7000)}
document.addEventListener("click",e=>{const x=e.target.closest("[data-dkgo]");if(x&&dkWire.go)dkWire.go(dkWire.cur()+(+x.dataset.dkgo))});
document.addEventListener("click",e=>{if(e.target.closest("[data-playall]")){const sv=homeTab;homeTab="world";const body=homeTabBody();homeTab=sv;screen("s-play",'<div class="topbar"><button class="ibtn" data-back="1">'+ic("back")+'</button><div class="grow"><div class="eyebrow">Playroom</div><h2 style="font-size:20px">'+t("pr.h")+'</h2></div></div><div class="scroll" style="padding-bottom:24px">'+body+'</div>');show("s-play");return}const y=e.target.closest("[data-htab2]");if(y){homeTab=y.dataset.htab2;$$("[data-htab]").forEach(b=>b.classList.toggle("on",b.dataset.htab===homeTab));const b=$("#htabBody");if(b){b.innerHTML=homeTabBody();$(".htabs").scrollIntoView({behavior:"smooth"})}return}const x=e.target.closest("[data-htab]");if(!x)return;homeTab=x.dataset.htab;$$("[data-htab]").forEach(b=>b.classList.toggle("on",b===x));const b=$("#htabBody");if(b)b.innerHTML=homeTabBody()});
function postHTML(p){const c=ch(p.who),w=wd(c.w),liked=S.liked[p.id];
 return '<div class="post"><div class="hd">'+avatar(p.who,34)+'<div class="grow"><b class="sm">'+esc(c.n)+'</b><div class="xs faint">'+esc(Lz(w.title))+' · '+ago(p.at)+'</div></div><button class="ibtn" data-char="'+p.who+'" style="width:32px;height:32px">'+ic("dots")+'</button></div>'+
  '<button style="display:block;width:calc(100% - 32px);margin:0 16px" data-char="'+p.who+'">'+img(p.who,"art ph","aspect-ratio:4/5;border-radius:18px")+'</button>'+
  '<div class="acts"><button class="'+(liked?"liked":"")+'" data-like="'+p.id+'">'+ic("heart")+'<span class="num">'+fmtN(p.likes+(liked?1:0))+'</span></button><button data-focus="'+p.id+'">'+ic("msg")+'</button></div>'+
  '<p class="cap"><b>'+esc(first(c.n))+'</b> '+esc(Lz(p.cap))+'</p>'+
  '<div class="reply"><input id="r_'+p.id+'" placeholder="'+esc(t("post.reply",{n:first(c.n)}))+'"><button class="btn btn-g btn-sm" data-dm="'+p.who+'|'+p.id+'">'+t("post.send")+'</button></div></div>';}
function wCard(w,quest){const cover=w.cover||w.cast[0];
 return '<button class="wcard" data-story="'+w.id+'"'+(quest?' data-quest="1"':"")+'><div class="art" style="height:250px"><img src="'+artSrc(w.cover?w.id:w.cast[0])+'" alt=""><div class="veil"></div>'+
  (quest?'<span class="badge q">'+t("st.quest")+'</span>':SHORTS[w.id]?'<span class="dramab">▶ '+t("sp.drama")+(eps(w.id).length>1?' · '+eps(w.id).length+' EP':'')+'</span>':w.kind==="ensemble"?'<span class="badge g">'+t("st.ensemble")+'</span>':'<span class="badge">'+w.or.toUpperCase()+'</span>')+
  '<div class="cap"><h3>'+esc(quest&&w.quest?Lz(w.quest.qtitle):Lz(w.title))+'</h3><p class="hk">'+esc(Lz(w.hook))+'</p>'+
  '<div class="xs faint" style="margin-top:6px">💬 '+fmtN(w.stats?w.stats[0]:0)+' · '+esc(w.author)+'</div></div></div></button>';}
function cCard(id){const c=ch(id);return '<button class="gcard" data-char="'+id+'">'+img(id,"art")+'<div class="b"><b>'+esc(c.n)+'</b><p class="s">'+esc(Lz(c.role))+'</p>'+
 '<div class="m">'+(wd(c.w)?esc(Lz(wd(c.w).title)):"")+'</div></div></button>'}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-like]")){const id=x.dataset.like;S.liked[id]=!S.liked[id];save();x.classList.toggle("liked",!!S.liked[id]);
  const n=x.querySelector("span");const p=feedPosts().find(q=>q.id===id);if(p&&n)n.textContent=fmtN(p.likes+(S.liked[id]?1:0));return}
 if(x=e.target.closest("[data-focus]")){const i=$("#r_"+x.dataset.focus);i&&i.focus();return}
 if(x=e.target.closest("[data-dm]")){const[cid,pid]=x.dataset.dm.split("|");const i=$("#r_"+pid);const v=(i&&i.value||"").trim();if(!v)return;i.value="";sendDM(cid,v);
  if(typeof taskClaimDay==="function"&&taskClaimDay("reply",1))toast(t("task.gotReply"));return}});

/* ---------- DISCOVER (tag search, WHIF-style) ---------- */
let disc={mode:"stories",q:"",sel:{genre:[],setting:[],trope:[],char:[],gong:[],shou:[]},sort:"hot"};
/* renderDiscover → app15_home.js (shelves + search) */
function discMatch(tags,text,cast){const plain=(disc.sel.genre||[]).concat(disc.sel.setting||[],disc.sel.trope||[],disc.sel.char||[]);
 if(plain.some(x=>!tags.includes(x)))return false;
 const gs=(disc.sel.gong||[]).concat(disc.sel.shou||[]);
 if(gs.length&&!gs.every(x=>gsMatch(tags,cast||[],x)))return false;
 if(disc.q){const q=disc.q.toLowerCase();return text.toLowerCase().includes(q)||tags.some(x=>x.toLowerCase().includes(q)||tagName(x).includes(disc.q))}return true}
function renderDiscRes(){
 const host=$("#discRes");if(!host)return;let items=[];
 if(disc.mode==="stories"){items=allWorlds().filter(orOK).filter(w=>discMatch(w.tags||[],Lz(w.title)+" "+Lz(w.hook)+" "+w.cast.map(id=>ch(id).n).join(" ")+" "+w.author,w.cast));
  if(disc.sort==="hot")items.sort((a,b)=>(b.stats?b.stats[0]:0)-(a.stats?a.stats[0]:0));else items.reverse();}
 else{items=allChars().filter(id=>{const c=ch(id),w=wd(c.w);return w&&orOK(w)&&discMatch(w.tags||[],c.n+" "+Lz(c.role),[id])});}
 host.innerHTML='<div class="row" style="padding:14px 16px 10px;justify-content:space-between"><b class="sm">'+t("disc.results",{n:items.length})+'</b>'+
  '<div class="row">'+(Object.values(disc.sel).flat().length?'<button class="chip" data-dclear="1">'+t("disc.clear")+'</button>':"")+
  '<div class="seg"><button data-dsort="hot" class="'+(disc.sort==="hot"?"on":"")+'">'+t("disc.hot")+'</button><button data-dsort="new" class="'+(disc.sort==="new"?"on":"")+'">'+t("disc.new")+'</button></div></div></div>'+
  (items.length?'<div class="grid2" style="padding-bottom:24px">'+(disc.mode==="stories"?items.map(sCard).join(""):items.map(cCard).join(""))+'</div>':'<p class="empty">'+t("disc.none")+'</p>');}
function sCard(w){return '<button class="gcard" data-story="'+w.id+'"><div class="art" style="aspect-ratio:3/4"><img src="'+artSrc(w.cover?w.id:w.cast[0])+'" alt="">'+
 (w.pack?'<span class="dramab">📖 '+t("pk.chN",{n:PCN(w)})+'</span>':SHORTS[w.id]?'<span class="dramab">▶ '+t("hf.hook")+'</span>':w.kind==="ensemble"?'<span class="badge g">'+t("st.ensemble")+'</span>':w.quest?'<span class="badge q">'+t("st.quest")+'</span>':"")+'</div>'+
 '<div class="b"><b>'+esc(Lz(w.title))+'</b><p class="s">'+esc(Lz(w.hook))+'</p><div class="m">💬 '+fmtN(w.stats?w.stats[0]:0)+' · ♥ '+fmtN(w.stats?w.stats[1]:0)+'</div>'+
 '<div class="row wrap" style="gap:4px;margin-top:6px">'+(w.tags||[]).slice(0,2).map(x=>'<span class="tag">#'+esc(tagName(x))+'</span>').join("")+'</div><div class="xs faint" style="margin-top:6px">'+esc(w.author)+'</div></div></button>'}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-orf]")){S.or=x.dataset.orf;save();renderTab("discover");return}
 if(x=e.target.closest("[data-dmode]")){disc.mode=x.dataset.dmode;$$("[data-dmode]").forEach(y=>y.classList.toggle("on",y===x));renderDiscRes();return}
 if(x=e.target.closest("[data-dtag]")){const[r,k]=x.dataset.dtag.split("|");const a=disc.sel[r]||(disc.sel[r]=[]);disc.sel[r]=a.includes(k)?a.filter(y=>y!==k):a.concat(k);x.classList.toggle("on");renderDiscRes();return}
 if(x=e.target.closest("[data-dsort]")){disc.sort=x.dataset.dsort;renderDiscRes();return}
 if(e.target.closest("[data-dclear]")){disc.sel={genre:[],setting:[],trope:[],char:[],gong:[],shou:[]};renderTab("discover");return}});
document.addEventListener("input",e=>{if(e.target.id==="discQ"){disc.q=e.target.value.trim();renderDiscRes()}});

/* ---------- STORY PAGE (OOC / WHIF-style) ---------- */
let curStory=null,storyTab="intro",pickOpen=null,pickQuest=false;
function openStory(id,keep,quest){
 const w=wd(id);if(!w)return;if(w.pack&&!quest){storyPage(id,keep);return}curStory=id;if(!keep){storyTab="intro";pickOpen=w.openings?w.openings[0].id:null;pickQuest=!!quest}
 const op=(w.openings||[]).find(o=>o.id===pickOpen)||(w.openings||[])[0];
 const existing=Object.values(S.threads).filter(th=>th.wid===id&&th.kind===(pickQuest?"quest":w.kind==="ensemble"?"group":"story")).sort((a,b)=>b.at-a.at)[0];
 let h='<button class="ibtn backbtn" data-back="1">'+ic("back")+'</button><div class="scroll"><div class="hero">'+img(w.cover?w.id:w.cast[0])+'<div class="veil"></div>'+
  '<div class="cap"><div class="eyebrow" style="color:var(--gold)">'+(pickQuest?t("st.quest")+" · "+t("q.turns",{a:0,b:w.quest.turns}):w.or==="all"?t("st.ensemble"):w.or.toUpperCase())+'</div>'+
  '<h1 style="margin-top:6px">'+esc(pickQuest?Lz(w.quest.qtitle):Lz(w.title))+'</h1><p class="sm dim" style="margin-top:6px;line-height:1.5">'+esc(Lz(w.hook))+'</p></div></div>'+
  '<div class="pad"><div class="row" style="margin-top:10px"><span class="sm" style="font-weight:700">'+esc(w.author)+'</span><button class="chip'+(S.follow[w.author]?" on":"")+'" data-follow="'+esc(w.author)+'">'+(S.follow[w.author]?t("st.following"):t("st.follow"))+'</button><div class="grow"></div>'+
  '<div class="stats"><span>💬 '+fmtN(w.stats[0])+'</span><span>♥ '+fmtN(w.stats[1])+'</span><span>✎ '+fmtN(w.stats[2])+'</span></div></div>'+
  '<div class="row wrap" style="gap:6px;margin-top:12px">'+(w.tags||[]).map(x=>'<span class="tag">#'+esc(tagName(x))+'</span>').join("")+'</div></div>'+
  '<div class="tabs" style="margin-top:14px">'+["intro","cast","comments"].map(k=>'<button data-stab="'+k+'" class="'+(storyTab===k?"on":"")+'">'+t("st."+k)+'</button>').join("")+'</div><div class="pad stack" style="gap:12px;padding-block:14px 20px">';
 if(storyTab==="intro"){
  if(pickQuest)h+='<div class="card" style="border-color:rgba(255,208,138,.4)"><div class="eyebrow" style="color:#FFD08A">'+t("q.goals")+' · '+t("q.turns",{a:0,b:w.quest.turns})+'</div><div class="stack" style="gap:6px;margin-top:10px">'+
   w.quest.goals.map(g=>'<div class="task"><span class="ck"></span>'+esc(Lz(g))+'</div>').join("")+'<div class="task"><span class="ck">?</span><span class="faint">'+t("q.hidden")+' — ???</span></div></div></div>';
  h+='<div class="card" style="border-style:dashed"><div class="eyebrow">'+t("st.guide")+'</div><p class="sm dim" style="margin-top:8px;line-height:1.6">'+t("st.guideT")+'</p></div>'+
   '<p style="font-size:14px;line-height:1.7">'+esc(Lz(w.premise))+'</p>'+
   '<div class="card"><div class="eyebrow">'+t("st.you")+'</div><p class="sm" style="margin-top:8px;line-height:1.6">'+esc(Lz(w.you))+'</p></div>'+
   '<div class="card warn"><div class="eyebrow">'+t("st.warn")+'</div><p class="sm" style="margin-top:8px;line-height:1.6">'+esc(Lz(w.warn))+'</p></div>'+
   '<div class="eyebrow" style="margin-top:4px">'+t("st.rel")+'</div><div class="reltable">'+(w.rel||[]).map(([a,b,r])=>'<div><b>'+esc(a==="you"?me():first(ch(a).n))+' × '+esc(b==="you"?me():first(ch(b).n))+'</b><span>'+esc(Lz(r))+'</span></div>').join("")+'</div>'+
   '<div class="row" style="gap:8px;margin-top:4px">'+(SHORTS[w.id]?'<button class="btn btn-g btn-sm grow" data-short="'+w.id+'">▶ '+t("st.short")+'</button>':"")+'<button class="btn btn-g btn-sm grow" data-remix="'+w.id+'">⑂ '+t("st.remix")+'</button></div>';}
 if(storyTab==="cast")h+='<div class="grid2" style="padding:0">'+w.cast.map(cCard).join("")+'</div>';
 if(storyTab==="comments")h+='<p class="xs faint">'+t("st.sample")+'</p>'+COMMENTS.map(([u,c],i)=>'<div class="comment"><div class="av">'+esc(u[1].toUpperCase())+'</div><div class="grow"><b class="xs">'+esc(u)+'</b><p class="sm" style="margin-top:3px;line-height:1.5">'+esc(c)+'</p></div><button class="cmsh" data-shcm="'+id+'|'+i+'" aria-label="share">📤</button></div>').join("");
 h+='</div></div><div class="startbar">'+
  '<div class="selrow"><button class="sel" data-ppick="1"><span><small>'+t("st.persona")+'</small><span>'+esc(me())+'</span></span>▾</button>'+
  (w.openings&&w.openings.length>1&&!pickQuest?'<button class="sel" data-opick="1"><span><small>'+t("st.opening")+'</small><span>'+esc(Lz(op.t))+'</span></span>▾</button>':"")+'</div>'+
  (op?'<p class="preview">'+esc(Lz(op.beats)?"":"")+esc(((op.beats[CL()]||op.beats.en)[0]||[,,""])[2])+'</p>':"")+
  '<div class="row">'+(existing?'<button class="btn btn-g grow" data-open="'+existing.id+'">'+t("st.continue")+'</button>':"")+
  '<button class="btn btn-p grow" data-newt="'+w.id+'">'+(pickQuest?t("st.questGo",{n:w.quest.turns}):t("st.new"))+'</button></div></div>';
 screen("s-story",h);show("s-story");}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-story]")){openStory(x.dataset.story,false,!!x.dataset.quest);return}
 if(x=e.target.closest("[data-stab]")){storyTab=x.dataset.stab;openStory(curStory,true);return}
 if(x=e.target.closest("[data-follow]")){const k=x.dataset.follow;S.follow[k]=!S.follow[k];save();openStory(curStory,true);return}
 if(e.target.closest("[data-opick]")){const w=wd(curStory);sheet('<h2>'+t("st.opening")+'</h2><div class="stack" style="margin-top:8px">'+w.openings.map(o=>'<button class="opt" data-op="'+o.id+'"><span class="grow"><b>'+esc(Lz(o.t))+'</b><span>'+esc(((o.beats[CL()]||o.beats.en)[0]||[,,""])[2])+'</span></span>'+(pickOpen===o.id?'<span class="check on">✓</span>':"")+'</button>').join("")+'</div>');return}
 if(x=e.target.closest("[data-op]")){pickOpen=x.dataset.op;closeSheet();openStory(curStory,true);return}
 if(e.target.closest("[data-ppick]")){personaSheet();return}
 if(x=e.target.closest("[data-newt]")){const th=newThread(pickQuest?"quest":null,x.dataset.newt,pickOpen);openThread(th.id);return}});
function personaSheet(){sheet('<h2>'+t("me.personas")+'</h2><div class="stack" style="margin-top:8px">'+S.personas.map(p=>'<button class="opt" data-pid="'+p.id+'"><span class="ic">'+esc((p.name||"?")[0])+'</span><span class="grow"><b>'+esc(p.name||"—")+'</b><span>'+esc(p.pron)+(p.look?" · "+esc(p.look):"")+'</span></span>'+(S.pid===p.id?'<span class="check on">✓</span>':"")+'</button>').join("")+
 '<button class="opt" data-newp="1"><span class="ic">＋</span><span class="grow"><b>'+t("me.addp")+'</b></span></button></div>')}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-pid]")){S.pid=x.dataset.pid;save();closeSheet();rerender();return}
 if(e.target.closest("[data-newp]")){editPersona(null);return}
 if(e.target.closest("#pSave")){const id=$("#pSave").dataset.id;let p=S.personas.find(q=>q.id===id);if(!p){p={id:"p"+Date.now()};S.personas.push(p)}
  p.name=($("#peName").value||"").trim()||"Alex";p.look=($("#peLook").value||"").trim();p.pron=($(".seg#pePron .on")||{dataset:{pr:"they"}}).dataset.pr;S.pid=p.id;save();closeSheet();rerender();return}
 if(x=e.target.closest("[data-pr]")){$$("#pePron button").forEach(y=>y.classList.toggle("on",y===x));return}});
function editPersona(p){p=p||{id:"",name:"",pron:"they",look:""};sheet('<h2>'+t("me.addp")+'</h2><div class="stack" style="gap:12px;margin-top:12px">'+
 '<div class="field"><label for="peName">'+t("ob.name")+'</label><input id="peName" maxlength="24" value="'+esc(p.name)+'"></div>'+
 '<div class="field"><label>'+t("ob.pron")+'</label><div class="seg" id="pePron">'+["he","she","they"].map(k=>'<button data-pr="'+k+'" class="'+(p.pron===k?"on":"")+'">'+{he:"he/him",she:"she/her",they:"they/them"}[k]+'</button>').join("")+'</div></div>'+
 '<div class="field"><label for="peLook">'+t("ob.look")+'</label><input id="peLook" maxlength="80" value="'+esc(p.look)+'" placeholder="'+esc(t("ob.lookPh"))+'"></div>'+
 '<button class="btn btn-p" id="pSave" data-id="'+p.id+'">'+t("g.save")+'</button></div>')}

/* ---------- CHARACTER PAGE (WHIF-style profile card) ---------- */
let curChar=null,charTab="profile";
function openChar(id,keep){const c=ch(id);if(!c)return;curChar=id;if(!keep)charTab="profile";
 const w=wd(c.w),solo=S.threads["c:"+id],st=solo?stageOf(solo,id):0;
 const tags=(w&&w.tags||[]).slice(0,5);
 const lastTh=Object.values(S.threads).filter(th=>th.cast.includes(id)).sort((a,b)=>b.at-a.at)[0],lastLine=lastTh?[...lastTh.msgs].reverse().find(m=>m.who===id&&m.txt):null;
 let h='<button class="ibtn backbtn" data-back="1">'+ic("back")+'</button><div class="scroll"><div class="hero" style="height:360px">'+img(id)+'<div class="veil"></div>'+
  '<div class="cap"><h1>'+esc(c.n)+'</h1><p class="sm dim" style="margin-top:5px">'+esc(Lz(c.role))+'</p></div></div>'+
  '<div class="pad"><div class="chatnow">'+(lastLine?'<button class="lastl" data-chatnow="'+id+'">'+avatar(id,34)+'<span class="grow"><small>'+t("ch.lastSaid")+'</small>“'+esc(lastLine.txt.slice(0,70))+'”</span>'+(lastTh.unread?'<i class="dot"></i>':'')+'</button>':'')+
   '<div class="row" style="gap:8px"><button class="btn btn-p grow" data-chatnow="'+id+'">💬 '+t(lastTh?"ch.chatCont":"ch.chatNow")+'</button>'+(w&&w.short!==false&&SHORTS[w.id]?'<button class="btn btn-g" data-short="'+w.id+'">▶ '+t("ch.watch")+'</button>':'')+(w?'<button class="btn btn-g" data-remix="'+w.id+'">⑂ '+t("ch.remix")+'</button>':'')+'</div></div>'+
  '<div class="row" style="margin-top:12px"><span class="sm" style="font-weight:700">'+(c.by||"@miru")+'</span><button class="chip'+(S.follow["c:"+id]?" on":"")+'" data-cfollow="'+id+'">'+(S.follow["c:"+id]?"✓ "+t("ch.following"):"＋ "+t("ch.follow"))+'</button><span class="xs faint num">'+fmtN(20000+hash(id)%480000+(S.follow["c:"+id]?1:0))+' '+t("ch.fans")+'</span></div><div class="row" style="margin-top:8px">'+(w?'<button class="chip" data-story="'+w.id+'">'+esc(t("ch.from",{w:Lz(w.title)}))+'</button>':"")+'</div>'+
  '<p class="xs" style="margin-top:10px;color:var(--violet);font-weight:700">'+tags.map(x=>"#"+tagName(x).replace(/\s|\//g,"")).join(" ")+'</p>'+
  '<p class="pitch" style="margin-top:12px">'+esc(Lz(c.pitch))+'</p>'+
  (!hasOfficial(id)?'<p class="xs faint" style="margin-top:10px">'+t("ch.noart")+'</p>':"")+'</div>'+
  charRankCard(id)+'<div class="tabs" style="margin-top:14px"><button data-ctab="profile" class="'+(charTab==="profile"?"on":"")+'">'+t("ch.profile")+'</button><button data-ctab="moments" class="'+(charTab==="moments"?"on":"")+'">'+t("ch.moments")+'</button><button data-ctab="comments" class="'+(charTab==="comments"?"on":"")+'">'+t("st.comments")+'</button><button data-ctab="fans" class="'+(charTab==="fans"?"on":"")+'">'+t("ch.fansTab")+'</button></div><div class="pad" style="padding-block:6px 20px">';
 if(charTab==="profile"){const row=(k,v)=>v?'<div><b>'+t(k)+'</b><span>'+v+'</span></div>':"";
  const tr=c.traits;
  h+='<div class="profile">'+row("ch.age",esc(c.age))+row("ch.height",esc(c.h||""))+row("ch.looks",esc(Lz(c.looks)))+row("ch.vibe",esc(Lz(c.vibe)))+
   row("ch.tells",c.tells?(c.tells[CL()]||c.tells.en).map(esc).join("<br>"):"")+row("ch.twist",esc(Lz(c.twist)))+row("ch.likes",esc(Lz(c.likes)))+
   '<div><b>'+t(fem(c)?"ch.secretF":"ch.secret")+'</b><span>'+(st>=3?esc(Lz(c.secret)):'🔒 <span class="faint">'+t("ch.secretLock")+'</span>')+'</span></div></div>'+
   ((tr&&(tr.gong&&tr.gong.length||tr.shou&&tr.shou.length))?'<div style="margin-top:12px">'+
    (tr.gong&&tr.gong.length?'<div class="row wrap" style="gap:6px"><span class="xs faint" style="width:100%">'+t("f.traitGong")+'</span>'+tr.gong.map(x=>'<span class="chip on" style="pointer-events:none">'+esc(gsName(x))+'</span>').join("")+'</div>':"")+
    (tr.shou&&tr.shou.length?'<div class="row wrap" style="gap:6px;margin-top:8px"><span class="xs faint" style="width:100%">'+t("f.traitShou")+'</span>'+tr.shou.map(x=>'<span class="chip on" style="pointer-events:none">'+esc(gsName(x))+'</span>').join("")+'</div>':"")+
   '</div>':"")+
   '<div class="row" style="gap:8px;margin-top:14px"><label class="btn btn-g btn-sm" style="cursor:pointer">'+t("ch.upload")+'<input type="file" accept="image/*" id="artUp" hidden></label>'+
   '<button class="btn btn-g btn-sm" data-vai="'+id+'">✨ '+t("voice.aiBtn")+'</button></div>';}
 else if(charTab==="moments"){const ps=feedPosts().filter(p=>p.who===id);h+=(S.follow["c:"+id]?'':'<div class="card" style="margin-top:10px"><p class="sm">'+t("ch.followS",{n:first(c.n)})+'</p><button class="btn btn-p btn-sm" style="margin-top:8px" data-cfollow="'+id+'">＋ '+t("ch.follow")+'</button></div>')+(ps.length?ps.map(postHTML).join(""):'<p class="empty">'+t("me.empty")+'</p>')}
 else if(charTab==="fans")h+=fanHTML(id);
 else h+='<p class="xs faint" style="margin-top:8px">'+t("st.sample")+'</p>'+COMMENTS.slice(0,4).map(([u,cm])=>'<div class="comment"><div class="av">'+esc(u[1].toUpperCase())+'</div><div class="grow"><b class="xs">'+esc(u)+'</b><p class="sm" style="margin-top:3px">'+esc(cm)+'</p></div></div>').join("");
 h+='</div></div><div class="startbar"><div class="row"><button class="btn btn-g" data-like-c="'+id+'">♥</button><button class="btn btn-p grow" data-chatnow="'+id+'">💬 '+t(lastTh?"ch.chatCont":"ch.chatNow")+'</button>'+(w?'<button class="btn btn-g" data-story="'+w.id+'" title="'+esc(t("ch.enterStory"))+'">📖</button>':'')+'</div></div>';
 screen("s-char",h);show("s-char");}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-char]")){openChar(x.dataset.char);return}
 if(x=e.target.closest("[data-ctab]")){charTab=x.dataset.ctab;openChar(curChar,true);return}
 if(x=e.target.closest("[data-chatnow]")){const id=x.dataset.chatnow,c=ch(id),last=Object.values(S.threads).filter(th=>th.cast.includes(id)).sort((a,b)=>b.at-a.at)[0];
  if(last){openThread(last.id);return}const w=wd(c.w);if(w&&w.openings){const th=newThread(null,w.id);save();openThread(th.id);return}const th=S.threads["c:"+id]||newThread("solo",id);save();openThread(th.id);return}
 if(x=e.target.closest("[data-cfollow]")){const k="c:"+x.dataset.cfollow;S.follow[k]=!S.follow[k];save();if(S.follow[k]){dailyPosts(true);toast(t("ch.followT"))}openChar(curChar,true);return}
 if(x=e.target.closest("[data-solo]")){const id=x.dataset.solo;const th=S.threads["c:"+id]||newThread("solo",id);openThread(th.id);return}
 if(x=e.target.closest("[data-like-c]")){x.style.color="var(--rose)";toast("♥");return}});
document.addEventListener("change",e=>{if(e.target.id!=="artUp")return;const f=e.target.files&&e.target.files[0];if(!f)return;
 const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const cv=document.createElement("canvas"),sc=Math.min(1,560/im.width);cv.width=im.width*sc;cv.height=im.height*sc;
  cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);S.art[curChar]=mediaWrap("art:"+curChar,cv.toDataURL("image/jpeg",.84));save();toast(t("ch.saved"));openChar(curChar,true)};im.src=fr.result};fr.readAsDataURL(f)});
Object.assign(I18N.en,{"ch.remix":"Remix"});
Object.assign(I18N.zh,{"ch.remix":"二创TA"});
