/* ================= STORY TOOLKIT v5 (built for "The Heir He Came Back For", usable by any story) =================
   Stops:
     [pov,"pick",{hint,title,items:[{ic,t,sub,then,rd,set}]}]   — big card choices (gift guess, styling, verification, group-chat move…)
   Features (["x","feature",{k,…}] with win/lose/then):
     feed  — security-camera puzzle: 4 CCTV feeds with a scrubbable timeline, tap the one that's wrong   {cams:[{id,t,clue}],answer}
     phone — snoop his phone: Messages / LOCK / Hidden Album / Drafts / Calendar / Deleted             {owner,apps:[{id,ic,t,items:[[from,text]]}]}
     match — memory-match quiz, you answer what he'd say; {pct} fills the result                     {qs:[{q,opts,a}]}
     group — family group chat: messages roll in, then you choose your move                          {name,msgs:[[who,text]],items:[{ic,t,then,rd}]}
   Directives:
     ["sys","title",{t,sub}]            cinematic title card
     ["sys","money",{from,to,label}]    balance flips from $32.18 to $4.8B+ with a counter
     ["sys","post",{who,handle,txt,img,likes,cm:[[name,text]]}]  a trending post; "save to my moments" posts it
     ["sys","anchor",{t,sub}]           FUTURE ANCHOR SAVED card */
(function(){
const L=x=>Lz(x)||x||"";
/* ---------- pick ---------- */
STOPK.add("pick");
const _stopHTML23=stopHTML;
stopHTML=function(th){const b=th.pk.stop;if(!b||b[1]!=="pick")return _stopHTML23(th);const d=b[2];
 return '<div class="sttag you">'+(d.ic||"🎯")+' '+esc(L(d.title)||t("pk2.pick"))+'</div>'+(d.hint?'<p class="pkask">'+esc(L(d.hint))+'</p>':'')+
  '<div class="pkgrid'+(d.items.length>4?" five":"")+'">'+d.items.map((o,i)=>'<button data-pkpick2="'+i+'"><span>'+(o.ic||"•")+'</span><b>'+esc(L(o.t))+'</b>'+(o.sub?'<small>'+esc(L(o.sub))+'</small>':'')+'</button>').join("")+'</div>'};
document.addEventListener("click",e=>{const x=e.target.closest("[data-pkpick2]");if(!x)return;const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop||th.pk.stop[1]!=="pick")return;
 const d=th.pk.stop[2],o=d.items[+x.dataset.pkpick2];if(!o)return;if(o.cost&&!spend(o.cost,"event"))return;
 appendMsg(th,{who:"me",k:"act",txt:(o.ic?o.ic+" ":"")+L(o.t),at:Date.now()});pkSet(th,o.set);if(o.rd&&typeof dimApply==="function")dimApply(th,o.rd,L(o.t));
 stopResolve(th,L(o.then)||o.then||[])});
/* feature plumbing: our own games resolve straight into the script */
function featEnd(th,d,win,V,rd){PKFEAT=null;closeSheet();const m=typeof dimMain==="function"&&dimMain(th);if(rd&&m)dimAdd(th,m.a+"|"+m.b,rd,t("pk2.game"));
 const beats=(win?d.win:d.lose)||d.then||[];setTimeout(()=>stopResolve(th,fillVals(beats,V||{})),350)}
/* ---------- feed: security camera game ---------- */
let FD=null;
function feedRun(){const th=S.threads[curT],d=PKFEAT&&PKFEAT.d;if(!d)return;FD={th,d,tm:0,pick:null};
 sheet('<h2>📹 '+esc(L(d.title)||t("pk2.feedH"))+'</h2><p class="xs faint" style="margin-top:4px">'+esc(L(d.hint2)||t("pk2.feedS"))+'</p><div class="cctv">'+d.cams.map((c,i)=>'<button class="cam" data-cam="'+i+'"><canvas id="cam'+i+'" width="320" height="200"></canvas><span class="camid">CAM '+String.fromCharCode(65+i)+' · '+esc(L(c.t))+'</span><span class="camrec">● REC</span><span class="camtc" id="tc'+i+'">06:14:00</span></button>').join("")+'</div>'+
  '<input type="range" id="feedT" min="0" max="100" value="0" class="feedt"><div class="row" style="justify-content:space-between"><small class="faint">06:14:00</small><small class="faint">06:16:30</small></div>'+
  '<p class="sm" id="feedOut" style="min-height:2.6em;margin-top:8px"></p>');
 feedDraw()}
function feedDraw(){if(!FD||!$("#cam0"))return;const tt=+($("#feedT")||{}).value||0;FD.d.cams.forEach((c,i)=>{const cv=$("#cam"+i);if(!cv)return;const x=cv.getContext("2d"),W=cv.width,H=cv.height;
  x.fillStyle="#141816";x.fillRect(0,0,W,H);x.strokeStyle="rgba(180,200,190,.25)";x.lineWidth=2;/* room geometry */
  x.beginPath();x.moveTo(0,H*.75);x.lineTo(W*.3,H*.45);x.lineTo(W*.7,H*.45);x.lineTo(W,H*.75);x.moveTo(W*.3,H*.45);x.lineTo(W*.3,0);x.moveTo(W*.7,H*.45);x.lineTo(W*.7,0);x.stroke();
  const p=(tt/100+i*.17)%1,fx=W*(.15+.7*p),fy=H*.62;x.fillStyle="rgba(220,230,225,.75)";
  if(i===FD.d.answer){/* the man who never shows his face: always back to camera, hugging the blind spot */const bx=W*(.82-.5*tt/100);x.beginPath();x.arc(bx,fy-28,9,0,7);x.fill();x.fillRect(bx-9,fy-19,18,34);x.fillStyle="rgba(20,24,22,.85)";x.fillRect(bx-7,fy-34,14,8)}
  else{x.beginPath();x.arc(fx,fy-28,9,0,7);x.fill();x.fillRect(fx-9,fy-19,18,34);x.fillStyle="rgba(255,255,255,.9)";x.fillRect(fx-4,fy-31,2,2);x.fillRect(fx+2,fy-31,2,2)}
  for(let k=0;k<900;k++){x.fillStyle="rgba(255,255,255,"+Math.random()*.08+")";x.fillRect(Math.random()*W,Math.random()*H,1,1)}
  for(let y=0;y<H;y+=3){x.fillStyle="rgba(0,0,0,.18)";x.fillRect(0,y,W,1)}
  const s=Math.floor(tt*1.5),tc=$("#tc"+i);if(tc)tc.textContent="06:"+String(14+Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")})}
document.addEventListener("input",e=>{if(e.target.id==="feedT")feedDraw()});
document.addEventListener("click",e=>{const x=e.target.closest("[data-cam]");if(!x||!FD)return;const i=+x.dataset.cam,ok=i===FD.d.answer,o=$("#feedOut");
 $$(".cam").forEach((b,j)=>b.classList.toggle(j===FD.d.answer?"right":"no",j===i||j===FD.d.answer));
 if(o)o.innerHTML=(ok?'✅ ':'❌ ')+esc(L(FD.d.cams[FD.d.answer].clue));const f=FD;FD=null;setTimeout(()=>featEnd(f.th,f.d,ok,{},ok?{tru:3,ten:2}:{ten:2}),1800)});
/* ---------- phone: snoop his phone ---------- */
let PH=null;
function phoneRun(){const th=S.threads[curT],d=PKFEAT&&PKFEAT.d;if(!d)return;PH={th,d,seen:{}};phoneHome()}
function phoneHome(){const d=PH.d;sheet('<div class="phn"><div class="phbar"><span>21:14</span><span>'+esc(L(d.owner))+'</span><span>🔋</span></div><div class="phgrid">'+d.apps.map((a,i)=>'<button data-phapp="'+i+'" class="'+(PH.seen[i]?"seen":"")+'"><span>'+a.ic+(S.plus||(S.unlocked||{})["ph|"+a.id]?'':'<i class="phcost">💎'+(a.lock||1)+'</i>')+'</span><b>'+esc(L(a.t))+'</b></button>').join("")+'</div>'+
 '<p class="xs faint" style="text-align:center;margin-top:10px">'+t("pk2.phTip")+'</p><button class="btn btn-g btn-block" style="margin-top:8px" data-phdone="1">'+t("pk2.phPut")+'</button></div>')}
document.addEventListener("click",e=>{let x;if(!PH)return;
 if(x=e.target.closest("[data-phapp]")){const i=+x.dataset.phapp,a=PH.d.apps[i];
  if(!S.plus&&!(S.unlocked||{})["ph|"+a.id]){sheet('<div class="phn"><div class="phapp-h"><button data-phback="1">‹</button><b>'+a.ic+' '+esc(L(a.t))+'</b></div><div class="phlock">🔒<p>'+esc(L(a.lockTxt)||t("pk2.phLocked"))+'</p><button class="btn btn-p" data-phunlock="'+i+'">🔓 '+t("pk2.phUnlock",{n:a.lock||1})+'</button></div></div>');return}
  phoneApp(i);return}
 if(x=e.target.closest("[data-phunlock]")){const i=+x.dataset.phunlock,a=PH.d.apps[i];if(!spend(a.lock||1,"event"))return;S.unlocked=S.unlocked||{};S.unlocked["ph|"+a.id]=1;save();phoneApp(i);return}
 if(e.target.closest("[data-phback]")){phoneHome();return}
 if(e.target.closest("[data-phdone]")){const f=PH;PH=null;const n=Object.keys(f.seen).length;featEnd(f.th,f.d,n>=2,{n},n>=2?{tru:-1,ten:3,att:2}:{});return}});
function phoneApp(i){const a=PH.d.apps[i];if(!PH.seen[i]){PH.seen[i]=1;if(a.set)pkSet(PH.th,a.set)}sheet('<div class="phn"><div class="phapp-h"><button data-phback="1">‹</button><b>'+a.ic+' '+esc(L(a.t))+'</b></div><div class="phmsgs">'+
 (a.img?'<div class="phimg" style="background-image:url('+(SCENE_FILES[a.img]||artSrc(a.imgWho||""))+')"></div>':'')+(L(a.items)||a.items||[]).map(([w,tx])=>'<div class="phm '+(w==="me"?"me":"")+'">'+(w&&w!=="me"?'<small>'+esc(w)+'</small>':'')+'<p>'+esc(tx)+'</p></div>').join("")+'</div></div>')}
/* ---------- match: memory quiz ---------- */
let MQ=null;
function matchRun(){const th=S.threads[curT],d=PKFEAT&&PKFEAT.d;if(!d)return;MQ={th,d,i:0,ok:0};matchStep()}
function matchStep(){const q=MQ.d.qs[MQ.i];if(!q){const pct=Math.round(60+MQ.ok/MQ.d.qs.length*32+(MQ.ok===MQ.d.qs.length?0:-0));const f=MQ;MQ=null;
  sheet('<h2>'+t("pk2.mqH")+'</h2><div class="mqres"><b>'+pct+'%</b><span>MATCH</span></div><p class="sm dim" style="text-align:center">'+t(pct>=90?"pk2.mqHi":"pk2.mqLo")+'</p><button class="btn btn-p btn-block" style="margin-top:12px" data-mqdone="'+pct+'">'+t("g.backChat")+'</button>');MQ={f,pct};return}
 sheet('<div class="eyebrow">'+t("pk2.mqQ",{i:MQ.i+1,n:MQ.d.qs.length})+'</div><h2 style="margin-top:6px">'+esc(L(q.q))+'</h2><div class="stack" style="margin-top:10px">'+(L(q.opts)||q.opts).map((o,j)=>'<button class="opt" data-mqa="'+j+'"><span class="grow"><b>'+esc(o)+'</b></span></button>').join("")+'</div>');if(window.onMatchQ)window.onMatchQ(MQ.th,q)}
document.addEventListener("click",e=>{let x;
 if((x=e.target.closest("[data-mqa]"))&&MQ&&MQ.d){const q=MQ.d.qs[MQ.i],ok=+x.dataset.mqa===q.a;if(ok)MQ.ok++;x.classList.add(ok?"right":"wrong");$$("[data-mqa]").forEach(b=>{b.disabled=true;if(+b.dataset.mqa===q.a)b.classList.add("right")});setTimeout(()=>{MQ.i++;matchStep()},900);return}
 if((x=e.target.closest("[data-mqdone]"))&&MQ&&MQ.f){const {f,pct}=MQ;MQ=null;featEnd(f.th,f.d,pct>=85,{pct},pct>=85?{att:3,tru:4}:{tru:1})}});
/* ---------- group: family group chat ---------- */
let GR=null;
function groupRun(){const th=S.threads[curT],d=PKFEAT&&PKFEAT.d;if(!d)return;GR={th,d,n:0};
 sheet('<div class="grc"><div class="grh"><b>'+esc(L(d.name))+'</b><small id="grN">0</small></div><div class="grm" id="grM"></div><div id="grA"></div></div>');
 const M=L(d.msgs)||d.msgs;const tick=()=>{if(!GR||GR.d!==d)return;const box=$("#grM");if(!box)return;if(GR.n<M.length){const [w,tx]=M[GR.n++];box.insertAdjacentHTML("beforeend",'<div class="grx"><small>'+esc(w)+'</small><p>'+esc(tx)+'</p></div>');box.scrollTop=1e5;const n=$("#grN");if(n)n.textContent=(d.members||27)+" "+t("pk2.grMem");setTimeout(tick,900)}
  else{const a=$("#grA");if(a)a.innerHTML='<div class="pkgrid">'+d.items.map((o,i)=>'<button data-grp="'+i+'"><span>'+(o.ic||"💬")+'</span><b>'+esc(L(o.t))+'</b></button>').join("")+'</div>'}};setTimeout(tick,500)}
document.addEventListener("click",e=>{const x=e.target.closest("[data-grp]");if(!x||!GR)return;const o=GR.d.items[+x.dataset.grp],f=GR;GR=null;pkSet(f.th,o.set);if(o.rd&&typeof dimApply==="function")dimApply(f.th,o.rd,L(o.t));
 appendMsg(f.th,{who:"me",k:"act",txt:"💬 "+L(o.t),at:Date.now()});PKFEAT=null;closeSheet();setTimeout(()=>stopResolve(f.th,L(o.then)||o.then||[]),300)});
Object.assign(FEATK,{feed:{ic:"📹",run:()=>feedRun(),t:"pk2.feedH"},phone:{ic:"📱",run:()=>phoneRun(),t:"pk2.phH"},match:{ic:"💞",run:()=>matchRun(),t:"pk2.mqH"},group:{ic:"👥",run:()=>groupRun(),t:"pk2.grH"}});
/* ---------- directives with their own cards ---------- */
PKREG.add("app23_heir.js", function(th,b, next){if(Array.isArray(b)&&b[0]==="sys"&&["title","money","post","anchor"].includes(b[1])){th.pk.q.shift();appendMsg(th,Object.assign({who:"sys",k:"x"+b[1],at:Date.now()},JSON.parse(JSON.stringify(b[2]||{}))));return true}return next(th,b)});;
const _msgHTML23=msgHTML;
msgHTML=function(m,i,th){if(!m||!/^x(title|money|post|anchor)$/.test(m.k||""))return _msgHTML23(m,i,th);
 if(m.k==="xtitle")return '<div class="xtitle"><b>'+esc(L(m.t))+'</b>'+(m.sub?'<span>'+esc(L(m.sub))+'</span>':'')+'</div>';
 if(m.k==="xanchor")return '<div class="xanchor"><b>⚓ '+esc(L(m.t))+'</b>'+(m.sub?'<span>'+esc(L(m.sub))+'</span>':'')+'</div>';
 if(m.k==="xmoney")return '<div class="xmoney" data-mi="'+i+'"><div class="xm1"><small>'+t("pk2.yday")+'</small><s>'+esc(L(m.from))+'</s></div><div class="xm2"><small>'+t("pk2.today")+' · '+esc(L(m.label)||"")+'</small><b class="num" data-count="'+esc(L(m.to))+'">'+esc(L(m.to))+'</b></div>'+(m.welcome?'<div class="xmw">'+esc(L(m.welcome))+'</div>':'')+'</div>';
 if(m.k==="xpost"){const c=(L(m.cm)||m.cm||[]);return '<div class="xpost"><div class="xph"><b>'+esc(L(m.handle))+'</b><small>🔥 '+t("pk2.trend")+'</small></div><p>'+esc(L(m.txt))+'</p>'+(m.img?'<div class="xpi" style="background-image:url('+(SCENE_FILES[m.img]||"")+')"></div>':'')+
  '<div class="xpm">♥ '+esc(String(m.likes||"12.4K"))+' · 💬 '+c.length+'</div>'+c.slice(0,4).map(([n,x])=>'<div class="xpc"><b>'+esc(n)+'</b> '+esc(x)+'</div>').join("")+'<button class="xpsave" data-xpsave="'+i+'">'+(m.saved?"✓ "+t("pk2.saved"):"＋ "+t("pk2.saveMom"))+'</button></div>'}};
document.addEventListener("click",e=>{const x=e.target.closest("[data-xpsave]");if(!x)return;const th=S.threads[curT],m=th&&th.msgs[+x.dataset.xpsave];if(!m||m.saved)return;m.saved=1;
 const p={id:"m"+Date.now(),txt:L(m.txt),img:SCENE_FILES[m.img]||null,at:Date.now(),likes:0,cm:[],day:today()};S.moments=[p].concat(S.moments||[]).slice(0,40);save();if(typeof addComments==="function")addComments(p,[mainOf(th)].filter(Boolean));renderChat();toast(t("mom.posted"))});
/* money counter animation */
const mo=new MutationObserver(()=>{$$(".xmoney b[data-count]:not(.done)").forEach(el=>{el.classList.add("done");const target=el.dataset.count,num=parseFloat(String(target).replace(/[^0-9.]/g,""))||0,suf=String(target).replace(/^[^0-9]*[0-9.,]+/,""),pre=String(target).match(/^[^0-9]*/)[0];
 let k=0;const N=40;const iv=setInterval(()=>{k++;const v=num*Math.pow(k/N,3);el.textContent=pre+(num>=100?Math.round(v).toLocaleString():v.toFixed(1))+suf;if(k>=N){clearInterval(iv);el.textContent=target}},35)})});
mo.observe(document.body,{childList:true,subtree:true});
Object.assign(I18N.en,{"pk2.pick":"Your move","pk2.game":"Played it together","pk2.feedH":"Security feed","pk2.feedS":"Drag the timeline. One of these four feeds is wrong — tap it.","pk2.phH":"His phone","pk2.phTip":"He's in the front cabin. You have maybe a minute.","pk2.phPut":"Put it back","pk2.phLocked":"Locked.","pk2.phUnlock":"Open it · 💎{n}",
 "pk2.mqH":"Memory match","pk2.mqQ":"Question {i} / {n}","pk2.mqHi":"Nobody remembers someone this well by accident.","pk2.mqLo":"Ten years left a few gaps.","pk2.grH":"Family group","pk2.grMem":"members","pk2.yday":"YESTERDAY","pk2.today":"TODAY","pk2.trend":"Trending now","pk2.saveMom":"Save to my moments","pk2.saved":"In your moments"});
Object.assign(I18N.zh,{"pk2.pick":"轮到你了","pk2.game":"一起完成了小游戏","pk2.feedH":"监控画面","pk2.feedS":"拖动时间轴。四个画面里有一个不对劲——点它。","pk2.phH":"他的手机","pk2.phTip":"他在前舱。你大概只有一分钟。","pk2.phPut":"放回原位","pk2.phLocked":"已上锁。","pk2.phUnlock":"打开 · 💎{n}",
 "pk2.mqH":"默契问答","pk2.mqQ":"第 {i} / {n} 题","pk2.mqHi":"一个人不会无意间把另一个人记得这么细。","pk2.mqLo":"十年，还是留下了几处空白。","pk2.grH":"家族群","pk2.grMem":"位成员","pk2.yday":"昨天","pk2.today":"今天","pk2.trend":"正在热搜","pk2.saveMom":"保存到我的动态","pk2.saved":"已在你的动态里"});
})();
