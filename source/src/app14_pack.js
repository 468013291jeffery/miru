/* ================= STORY PACKS — chapters, choices, endings, Story Pack purchase, AI turns =================
   What people buy (see DOG_FRIDAYS_COMMERCE_V2 / SYSTEM_SPEC):
   ┌ Free ─ chapters 1–2 of every story (official scenes + choices) · 24 AI turns, once per account, shared by every story
   ├ Story Pack (💎 50 ≈ $8.99, one time, per story) ─ chapters 3–8 · all three endings · replay any chapter · +120 AI turns
   ├ AI turns top-up (💎 24 ≈ $3.99) ─ +100 turns, never expire
   └ MIRU+ ─ 250 AI turns every month (used first, don't roll over) · long memory · unlimited voice read-aloud
   Rules: an official choice never costs anything; an AI turn = one successful reply to free input, however many lines;
   a failed or offline reply is never charged; running out of turns never blocks the official story; love is never sold. */
function PCN(w){return (w&&w.pack&&w.pack.chapters&&w.pack.chapters.length)||8}
const PACK_PRICE=MIRU_TUNE.pay.packPrice,TOPUP={n:MIRU_TUNE.pay.topupUnits,cost:MIRU_TUNE.pay.topupCost},TRIAL_UNITS=MIRU_TUNE.pay.trialUnits,PLUS_UNITS=MIRU_TUNE.pay.plusUnits,PACK_UNITS=MIRU_TUNE.pay.packUnits,FREE_CH=MIRU_TUNE.pay.freeChapters,ENDING_NEED=MIRU_TUNE.pay.endingNeed;
function isPack(w){return !!(w&&w.pack)}
function packSt(wid){S.packs=S.packs||{};return S.packs[wid]=S.packs[wid]||{own:0,end:{}}}
function owns(wid){return !!(S.packs&&S.packs[wid]&&S.packs[wid].own)}
function chLocked(wid,n){return n>FREE_CH&&!owns(wid)}
function endingsFound(wid){const p=S.packs&&S.packs[wid];return p?Object.keys(p.end||{}).length:0}

/* ---------- AI turns ---------- */
function uState(){S.units=S.units||{trial:TRIAL_UNITS,pack:0,pm:"",pl:0};const u=S.units,m=new Date().toISOString().slice(0,7);
 if(S.plus&&u.pm!==m){u.pm=m;u.pl=PLUS_UNITS}if(!S.plus)u.pl=0;return u}
function unitsLeft(){const u=uState();return u.trial+u.pack+u.pl}
/* spend the turns that expire first: this month's MIRU+ turns, then the free trial, then purchased turns (never expire) */
function useUnits(n){const u=uState();let k=n;for(const f of ["pl","trial","pack"]){const d=Math.min(u[f],k);u[f]-=d;k-=d}save();unitChip();return k===0}
function unitChip(){$$(".uchip").forEach(el=>el.textContent="✦ "+unitsLeft())}
function aiCost(){return S.tier==="deep"?MIRU_TUNE.ai.costDeep:MIRU_TUNE.ai.costNormal}
/* checked BEFORE the user's message is added, so nothing is left hanging */
function aiGate(){if(!liveOn())return true;if(unitsLeft()>=aiCost())return true;unitsSheet(true);return false}
function unitsSheet(out){const u=uState();
 sheet('<div class="eyebrow" style="color:var(--gold)">✦ '+t("u.h")+'</div><h2 style="margin-top:6px">'+(out?t("u.outH"):t("u.left",{n:unitsLeft()}))+'</h2>'+
  '<p class="sm dim" style="margin-top:6px;line-height:1.55">'+t("u.what")+'</p>'+
  '<div class="ubreak">'+[["u.trial",u.trial],["u.pack",u.pack],["u.plus",u.pl]].map(([k,n])=>'<div><b class="num">'+n+'</b><span>'+t(k)+'</span></div>').join("")+'</div>'+
  (S.tier==="deep"?'<p class="xs" style="color:var(--gold);margin-top:8px">'+t("u.deep")+'</p>':"")+
  '<button class="btn btn-p btn-block" style="margin-top:14px" data-ubuy="1">'+t("u.buy",{n:TOPUP.n})+' · 💎 '+TOPUP.cost+'</button>'+
  '<p class="xs faint" style="text-align:center;margin-top:6px">💎 '+S.keys+' · '+t("u.buyS")+'</p>'+
  (S.plus?"":'<button class="plusc mini" data-paysheet="1"><b>MIRU+</b><span>'+t("u.plusLine",{n:PLUS_UNITS})+'</span></button>')+
  '<p class="xs faint" style="margin-top:12px;line-height:1.55">'+t("u.free")+'</p>')}
document.addEventListener("click",e=>{
 if(e.target.closest("[data-units]")){unitsSheet(false);return}
 if(e.target.closest("[data-ubuy]")){if(!spend(TOPUP.cost,"units"))return;uState().pack+=TOPUP.n;save();closeSheet();unitChip();toast(t("u.got",{n:TOPUP.n}));return}});

/* ---------- starting a story ---------- */
function packAsName(w,as){if(!as||as==="watch")return t("pk.watch");if(as==="side")return t("pk.side");const c=ch(as);return c?t("pk.as",{n:first(c.n)}):""}
function packModes(w){const P=w.pack,L=[{as:"watch",t:T("Watch them — direct from outside the scene","旁观——在场外当导演")}];
 (P.join||[]).forEach(j=>L.push({as:j.as,t:j.t}));return L}
function startSheet(wid,fresh){const w=wd(wid);if(!w)return;
 const ex=fresh?null:Object.values(S.threads).filter(th=>th.wid===wid&&th.pk).sort((a,b)=>b.at-a.at)[0];
 sheet('<div class="row" style="gap:12px">'+img(w.cover?w.id:w.cast[0],"art sthumb")+'<div class="grow" style="min-width:0"><div class="eyebrow">'+t("pk.howPlay")+'</div><h2 style="margin-top:4px;font-size:20px">'+esc(Lz(w.title))+'</h2><p class="xs faint" style="margin-top:4px">'+t("pk.chN",{n:PCN(w)})+' · '+(owns(wid)?t("pk.owned"):t("pk.free2"))+'</p></div></div>'+
  (ex?'<button class="btn btn-p btn-block" style="margin-top:14px" data-open="'+ex.id+'">▶ '+t("pk.continue",{n:ex.pk.ch,m:packAsName(w,ex.pk.as)})+'</button><div class="eyebrow" style="margin-top:14px">'+t("pk.newRun")+'</div>':'')+
  '<div class="stack" style="gap:8px;margin-top:10px">'+packModes(w).map(m=>'<button class="opt" data-pkgo="'+wid+'|'+m.as+'"><span class="ic">'+(m.as==="watch"?"👁":m.as==="side"?"🚪":"▶")+'</span><span class="grow"><b>'+esc(packAsName(w,m.as))+'</b><span>'+esc(Lz(m.t))+'</span></span><span style="color:var(--gold)">›</span></button>').join("")+'</div>'+
  '<p class="xs faint" style="margin-top:12px;line-height:1.5">'+t("pk.modesNote")+'</p>')}
function packStart(wid,as,fromCh,picks){const w=wd(wid);const th=newThread(null,wid,null,{as,fromCh,picks});closeSheet();openThread(th.id);return th}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-pkstart]")){startSheet(x.dataset.pkstart);return}
 if(x=e.target.closest("[data-pkgo]")){const[w,as]=x.dataset.pkgo.split("|");packStart(w,as);return}});

/* called by newThread for pack worlds */
function packInit(th,w,extra){extra=extra||{};th.pk={ch:0,picks:{},as:extra.as||"watch",st:"choose"};
 const from=extra.fromCh||1;
 if(from>1){/* replay from a checkpoint: earlier official choices are re-applied, story state after it is rebuilt */
  const P=extra.picks||{};th.msgs.push({who:"sys",k:"card",title:"⟲ "+t("pk.replayH",{n:from}),txt:t("pk.replayS"),at:Date.now()});
  for(let i=1;i<from;i++){const k=P[i]||"B";th.pk.picks[i]=k;const c=w.pack.chapters[i-1].choices.find(x=>x.k===k);th.mem.push(Lz(c.mem));packLove(th,k);try{pkSet(th,c.set)}catch(_){}}}
 if(th.pk.as!=="watch"&&th.pk.as!=="side"&&!th.cast.includes(th.pk.as))th.pk.as="watch";
 packOpen(th,from,true)}
function packBeats(o){return (o&&(o[CL()]||o.en))||[]}
/* ---------- interactive stops inside a chapter ----------
   A beat like [who,"line"|"gift"|"photo"|"video"|"game"|"call"|"voice",{...}] pauses the scene and waits for the reader:
   line  → it's YOUR turn to speak (pick a line or type your own)      gift  → give him something, right now, in the scene
   photo → unlock & generate a picture of this exact moment            video → unlock a filmed clip of the scene
   game  → a story game that plays this moment (and earns a clue)      call  → he calls you, mid-scene
   voice → a locked voice note.  Each stop carries "then" (what happens after) and "skip" (if you pass). */
const STOPK=new Set(["line","gift","photo","video","game","call","voice","start"]);
function isStop(b){return Array.isArray(b)&&STOPK.has(b[1])&&b[2]&&typeof b[2]==="object"}
function beatMsg(b){return Array.isArray(b)?{who:b[0],k:b[0]==="n"?"act":b[1],txt:b[2],at:Date.now(),pk:1}:b}
function packPov(th){const w=wd(th.wid);return (w.pack&&w.pack.pov)||w.cast[w.cast.length-1]}
function packOpen(th,n,instant){const w=wd(th.wid),c=w.pack.chapters[n-1];if(!c)return Promise.resolve();th.pk.ch=n;th.pk.st="busy";th.pk.min=false;th.pk.stop=null;
 th.status.time=Lz(c.time);th.status.place=Lz(c.place);
 const card={who:"sys",k:"chap",n,title:Lz(c.t),txt:Lz(c.goal),at:Date.now()};
 const beats=packBeats(c.beats).slice();
 if(instant&&n===1&&w.pack.intro){th.msgs.push({who:"sys",k:"intro",at:Date.now()});th.msgs.push(card);th.pk.q=[["sys","start",{}]].concat(beats);th.pk.after="choose";save();PKPLAY[th.id]=1;setTimeout(()=>packRun(th),300);return Promise.resolve()}
 if(instant){th.msgs.push(card);let k=0;while(k<beats.length&&k<3&&!isStop(beats[k])){th.msgs.push(beatMsg(beats[k]));k++}
  th.pk.q=beats.slice(k);th.pk.after="choose";save();PKPLAY[th.id]=1;setTimeout(()=>packRun(th),700);return Promise.resolve()}
 appendMsg(th,card);th.pk.q=beats;th.pk.after="choose";save();return packRun(th)}
const PKPLAY={},PKSKIP={},PKWAIT={},PKNEXT={};
/* reading time for the line on screen: long enough to actually read it (CJK ≈ 7 chars/s, latin ≈ 20 chars/s) */
function readMs(m){if(!m)return 1500;const x=String(m.txt||m.title||"");const cjk=/[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]/.test(x);
 return Math.min(7000,Math.max(1700,(cjk?1000+x.length*105:1000+x.length*34)))}
function pkSpd(){const v=S.pkSpd;return v===0?0:(v||1)}
function stopAuto(th,b){const d=b[2],k=b[1],as=th.pk.as,inScene=as&&as!=="watch"&&as!=="side",speaker=ch(b[0])?b[0]:packPov(th);
 if(k==="line"&&as!==speaker){const o=d.opts[0];if(typeof dimApply==="function"){const P=dimPairs(th);if(o.rd)dimApply(th,o.rd,Lz(o.t));else if(P){const m=P.find(p=>p.main)||P[0];dimApply(th,{[m.a+"|"+m.b]:dimRule(o)},Lz(o.t))}}return [[speaker,o.k||"say",o.t]].concat(o.then||[])}
 if((k==="gift"||k==="call"||k==="voice")&&(!inScene||as===(k==="call"?d.cid:stopWho(th,d))))return d.skip||[];
 if(k==="video"&&!stopClip(th,d))return d.then||[];
 if(k==="game"&&!GAMEF[d.k])return d.skip||[];
 return null}
const PKPAUSE={};   // 每个线程：玩家正在说话 ⇒ 剧本队列暂停
async function packRun(th){const live=()=>curT===th.id&&$("#s-chat")&&!$("#s-chat").hidden;if(PKPLAY[th.id]===2)return;PKPLAY[th.id]=2;packRefresh(th);
 try{while(th.pk.q&&th.pk.q.length){const b=th.pk.q[0];
  /* 2026-10-27 Ann：玩家一开口，剧本队列先停 —— 他得先接住她的话，
     而不是自己按定时器往下念。回完（PKPAUSE 清掉）再继续。 */
  while(PKPAUSE[th.id])await new Promise(r=>setTimeout(r,250));
   if(pkDirective(th,b))continue;
   if(isStop(b)){let extra=stopAuto(th,b);
    if(!extra){delete PKSKIP[th.id];th.pk.stop=b;th.pk.go=0;th.pk.min=false;save();packRefresh(th);if(live())scrollChat();
     extra=await new Promise(r=>PKWAIT[th.id]=r);delete PKWAIT[th.id]}
    th.pk.stop=null;th.pk.go=0;th.pk.q.shift();th.pk.q.unshift(...(extra||[]));save();packRefresh(th);continue}
   while(!live())await new Promise(r=>setTimeout(r,500));
   if(!PKSKIP[th.id]){const prev=th.msgs[th.msgs.length-1],spd=pkSpd(),ms=readMs(prev)*(spd||1);
    await pkWait(th,prev,spd,ms);delete PKNEXT[th.id];if(!th.pk.q||th.pk.q[0]!==b)continue}
   th.pk.q.shift();pkAppend(th,beatMsg(b));save()}}
 finally{delete PKPLAY[th.id];delete PKSKIP[th.id]}
 const a=th.pk.after;th.pk.after=null;th.pk.q=null;save();try{pkLockComposer(th)}catch(_){}
 if(a==="choose"){th.pk.st="choose";save();packRefresh(th);if(curT===th.id)scrollChat()}
 else if(a&&a.indexOf("pick:")===0)packAfterPick(th,a.slice(5))}
function stopResolve(th,extra){if(!th||!th.pk||!th.pk.stop)return;if(PKWAIT[th.id]){PKWAIT[th.id](extra||[]);return}
 th.pk.q=th.pk.q||[];th.pk.q.shift();th.pk.q.unshift(...(extra||[]));th.pk.stop=null;th.pk.go=0;save();packRun(th)}
function packLove(th,k){const d={A:9,B:4,C:-4}[k]||0;th.cast.filter(c=>c!==th.pk.as).forEach(c=>{loveWrite(th,c,d,"pack:"+k)})}
function aCount(th){const L=PCN(wd(th.wid));return Object.entries(th.pk.picks).filter(([n,k])=>+n<L&&k==="A").length}
function EN(th){return Math.min(ENDING_NEED,Math.max(0,PCN(wd(th.wid))-1))}

/* ---------- the panel under the scene ---------- */
function packPanel(th){if(!th.pk)return "";const running=!!PKPLAY[th.id],hasQ=!!(th.pk.q&&th.pk.q.length);
 if(th.pk.st==="busy"&&!running&&!hasQ&&!th.pk.stop&&!busy)th.pk.st="choose";const w=wd(th.wid),P=w.pack,n=th.pk.ch,c=P.chapters[n-1];if(!c)return "";
 if(th.pk.min&&!th.pk.stop)return '<button class="pkmini" data-pkmin="0">📖 '+t("pk.chShort",{n})+' · '+(th.pk.st==="choose"?t("pk.yourMove"):th.pk.st==="end"?t("pk.ended"):t("pk.nextUp"))+' ▴</button>';
 let h='<div class="pkpanel'+(th.pk.stop?" stop":"")+'"><div class="pkhd"><span class="eyebrow">'+t("pk.chShort",{n})+' / '+P.chapters.length+' · '+esc(Lz(c.t))+'</span>'+(th.pk.stop?'':'<button class="pkx" data-pkmin="1" aria-label="hide">▾</button>')+'</div>';
 if(th.pk.stop)h+=stopHTML(th);
 else if(th.pk.st==="busy"&&running){if(!PKSKIP[th.id]){const v=pkSpd();
  h+='<div class="pkplay"><button class="pkspd" data-pkspd="1">'+(v===0?'👆 '+t("pk.spdTap"):v>1?'🐢 '+t("pk.spdSlow"):'▶ '+t("pk.spdNorm"))+'</button><button class="pkskip" data-pknextl="1">'+t("pk.nextLine")+' ›</button><button class="pkskip" data-pkskip="1">⏩ '+t("pk.skip")+'</button></div><p class="pkhint">'+t("pk.tapHint")+'</p>'}}
 else if(th.pk.st==="busy"&&hasQ){h+='<button class="btn btn-p btn-block" data-pkresume="1">▶ '+t("pk.resume")+'</button>'}
 else if(th.pk.st==="choose"){const need=n===PCN(wd(th.wid))?Math.max(0,EN(th)-aCount(th)):0;
  h+='<p class="pkask">'+esc(Lz(c.ask))+'</p><div class="pkopts">'+c.choices.map(x=>{const lock=x.k==="A"&&need>0;
   return '<button class="pkopt'+(lock?" lk":"")+'" data-pkpick="'+x.k+'"><i>'+x.k+'</i><span>'+esc(Lz(x.t))+(lock?'<small>🔒 '+t("pk.needA",{n:EN(th),h:aCount(th)})+'</small>':'')+'</span></button>'}).join("")+'</div>'+
   '<p class="pkhint">'+t(liveOn()?"pk.orType":"pk.orTypeOff")+'</p>'}
 else if(th.pk.st==="next"){const nx=P.chapters[n],lock=chLocked(th.wid,n+1);
  h+='<button class="btn btn-p btn-block" data-pknext="1">'+(lock?'🔓 '+t("pk.unlockNext",{n:n+1}):'▶ '+t("pk.next",{n:n+1}))+' · '+esc(Lz(nx.t))+'</button>'+
   '<p class="pkhint">'+t("pk.stay")+'</p>'}
 else if(th.pk.st==="end"){const e=P.endings[th.pk.end];
  h+='<p class="pkask">🏁 '+esc(Lz(e.t))+' · '+t("pk.endN",{a:endingsFound(th.wid),b:3})+'</p><div class="row" style="gap:8px"><button class="btn btn-g btn-sm grow" data-pkreplay="1">⟲ '+t("pk.replay")+'</button><button class="btn btn-g btn-sm grow" data-pkbonus="'+th.wid+'">✦ '+t("pk.bonus")+'</button></div>'}
 return h+'</div>'}
function packRefresh(th){const el=$("#pkwrap");if(el&&curT===th.id)el.innerHTML=packPanel(th);try{pkLockComposer(th)}catch(_){}}

/* 2026-10-27 Ann 的设计：**剧情段里不让打字**。
   「里面有强制对话的选项。出现强制对话走剧情，把底下的输入框熄灭。」
   ⇒ 剧本队列在播时，输入框熄灭并显示「剧情进行中」；队列走完（或进入等玩家决定）再亮回来。 */
function pkBusy(th){try{
 /* ⚠️ th.pk.stop 有值时 = 游戏正**等玩家动作**（等 PKWAIT）⇒ 这时绝不能锁输入框，
    否则「锁着输入框等玩家输入」= 死锁。 */
 if(th&&th.pk&&th.pk.stop)return false;
 return !!(th&&th.pk&&th.pk.q&&th.pk.q.length&&PKPLAY[th.id]===2)
}catch(_){return false}}
function pkLockComposer(th){
 if(!th||curT!==th.id)return;
 const cin=$("#cin"),box=cin&&cin.closest?cin.closest(".composer,form,div"):null;
 const lock=pkBusy(th);
 if(cin){
  cin.disabled=lock;
  cin.placeholder=lock?(S.lang==="zh"?"剧情进行中……":(S.lang==="ja"?"物語進行中……":(S.lang==="ko"?"이야기 진행 중……":"Story in progress…"))):t("cx.ph."+cmode);
 }
 const send=document.querySelector("[data-send]");if(send)send.disabled=lock;
 if(box)box.classList.toggle("pk-locked",lock);
}

/* ---- ledger telemetry for the pack flow (contract: LEDGER.md §2) ----
   Four events, no gameplay change: chapter_open / choice_pick / chapter_done / story_end.
   Everything hangs off th.pk, so a replay or a second device starts a new session id. */
function pkSess(th){if(!th.pk._sess){th.pk._sess=Date.now().toString(36)+Math.random().toString(36).slice(2,7)}return th.pk._sess}
function pkTrack(th,name,extra){try{track(name,Object.assign({wid:th.wid,sess:pkSess(th),t:Date.now()},extra||{}))}catch(_){}}
function pkOpenMark(th,n){try{
  // a genuinely new run = chapter 1 with no session yet, right after an ending, or after having
  // been past chapter 1 (replay). Re-entering the SAME chapter must not count as a second open.
  if(n===1&&(!th.pk._sess||th.pk.st==="end"||th.pk._opened>1)){th.pk._sess=null;th.pk._opened=0}
  if(th.pk._opened===n)return                          // same chapter re-entered: one opening, not two
  th.pk._opened=n;th.pk._chAt=Date.now();
  pkTrack(th,"chapter_open",{ch:n});
}catch(_){}}
function pkDone(th,n){try{pkTrack(th,"chapter_done",{ch:n,ms:th.pk._chAt?Date.now()-th.pk._chAt:null})}catch(_){}}
/* 每幕在场名单（03.6）：优先用章节自带的 present，其次用旁档 MIRU_PRESENT，都没有就 null
   （null ⇒ appendMsg 退回 th.cast，与加这个字段之前完全一致）。 */
function pkSetPresent(th,n){try{
  const ch=wd(th.wid).pack.chapters[n-1];
  let list=null;
  if(ch&&Array.isArray(ch.present)&&ch.present.length)list=ch.present.slice();
  else if(typeof MIRU_PRESENT!=="undefined"&&MIRU_PRESENT[th.wid])list=(MIRU_PRESENT[th.wid][n-1]||null);
  th.present=(list&&list.length)?list:null;
}catch(_){th.present=null}}
function packPick(k){const th=S.threads[curT];if(!th||!th.pk||th.pk.st!=="choose"||busy)return;
 const w=wd(th.wid),n=th.pk.ch,c=w.pack.chapters[n-1],x=c.choices.find(y=>y.k===k);if(!x)return;
 if(n===PCN(w)&&k==="A"&&aCount(th)<EN(th)){toast(t("pk.needA",{n:EN(th),h:aCount(th)}));return}
 pkTrack(th,"choice_pick",{ch:n,key:k,ms:th.pk._chAt?Date.now()-th.pk._chAt:null});
 th.pk.picks[n]=k;pkSet(th,x.set);th.pk.st="busy";th.pk.before={};th.cast.forEach(cid=>th.pk.before[cid]=stageOf(th,cid));setSugg([]);
 appendMsg(th,{who:"sys",k:"dec",n,c:k,txt:Lz(x.t),at:Date.now()});
 th.pk.q=packBeats(x.then).slice();th.pk.after="pick:"+k;save();packRefresh(th);packRun(th)}
function packAfterPick(th,k){const w=wd(th.wid),n=th.pk.ch,c=w.pack.chapters[n-1],x=c.choices.find(y=>y.k===k);if(!x)return;
 th.mem.push(Lz(x.mem));packLove(th,k);th.rounds++;
 pkDone(th,n);
 if(n===PCN(w)){th.pk.st="end";th.pk.end=k;const ps=packSt(th.wid);ps.end[k]=1;
  pkTrack(th,"story_end",{ch:n,ending:k});
  if(k==="A")th.cast.filter(cid=>cid!==th.pk.as).forEach(cid=>loveWrite(th,cid,0,"ending:A",{floor:80}));
  appendMsg(th,{who:"sys",k:"end",e:k,at:Date.now()});
  if(typeof taskClaimOnce==="function"&&taskClaimOnce("ending_"+th.wid,3))setTimeout(()=>toast(t("pk.endBonus")),900)}
 else th.pk.st="next";
 if(n===1&&typeof taskClaimOnce==="function"&&taskClaimOnce("firstCh",2))setTimeout(()=>toast(t("pk.firstBonus")),700);
 try{if(typeof cardCommitChapter==="function")cardCommitChapter(th,n,k)}catch(_){}
 try{
  if(typeof cardChanges==="function"){
    const d=cardChanges(th,n), lines=[];
    for (const x of d.slice(0,3)) {
      const bits=[];
      if (x.loveDelta) bits.push(t("cd.love",{d:(x.loveDelta>0?"+":"")+x.loveDelta}));
      if (x.stance) Object.keys(x.stance).forEach(s=>bits.push(t("cd.stance",{s:s})));
      if (x.knows) bits.push(t("cd.knows",{n:x.knows}));
      if (x.revealed) bits.push(t("cd.revealed",{n:x.revealed}));
      if (bits.length) lines.push(first(ch(x.cid).n)+" · "+bits.join(" · "));
    }
    if (lines.length) appendMsg(th,{who:"sys",k:"card",title:"🃏 "+t("cd.title"),txt:lines.join("\n"),at:Date.now()});
  }
 }catch(_){}
 const before=th.pk.before||{};delete th.pk.before;save();
 if(curT===th.id&&!$("#s-chat").hidden){renderChat();scrollChat()}
 levelUpCheck(th,before)}
function packNext(){const th=S.threads[curT];if(!th||!th.pk||th.pk.st!=="next"||busy)return;const n=th.pk.ch+1;
 if(chLocked(th.wid,n)){packPaywall(th.wid,n);return}
 const w=wd(th.wid);if(w.pack.ready&&n>w.pack.ready){toast(t("st2.soon",{n}));return}
 th.pk.st="busy";packRefresh(th);packOpen(th,n,false)}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-pkpick]")){packPick(x.dataset.pkpick);return}
 if(e.target.closest("[data-pknext]")){packNext();return}
 if(x=e.target.closest("[data-pkmin]")){const th=S.threads[curT];if(th&&th.pk){th.pk.min=x.dataset.pkmin==="1";save();packRefresh(th)}return}
 if(e.target.closest("[data-pkreplay]")){replaySheet(S.threads[curT]);return}
 if(x=e.target.closest("[data-pkfrom]")){const th=S.threads[curT],n=+x.dataset.pkfrom;if(!th)return;if(chLocked(th.wid,n)){packPaywall(th.wid,n);return}packStart(th.wid,th.pk.as,n,th.pk.picks);return}
 if(x=e.target.closest("[data-pkbonus]")){bonusSheet(x.dataset.pkbonus);return}
 if(x=e.target.closest("[data-pkbuy]")){packBuy(x.dataset.pkbuy);return}
 if(x=e.target.closest("[data-pknotify]")){S.notify=S.notify||{};S.notify[x.dataset.pknotify]=1;save();closeSheet();toast(t("pk.notified"));return}
 if(e.target.closest("[data-stepin]")){stepInSheet();return}
 if(x=e.target.closest("[data-stepas]")){const th=S.threads[curT];if(!th||!th.pk)return;th.pk.as=x.dataset.stepas;closeSheet();
  appendMsg(th,{who:"sys",k:"card",title:"🚪 "+t("pk.steppedH"),txt:t("pk.steppedS",{n:packAsName(wd(th.wid),th.pk.as)}),at:Date.now()});cmode="say";save();renderChat();scrollChat();return}});
function replaySheet(th){if(!th||!th.pk)return;const w=wd(th.wid);
 sheet('<h2>'+t("pk.replayPick")+'</h2><p class="sm dim" style="margin-top:4px">'+t("pk.replayPickS")+'</p><div class="stack" style="gap:6px;margin-top:10px">'+
  w.pack.chapters.map((c,i)=>{const lock=chLocked(w.id,i+1);return '<button class="opt" data-pkfrom="'+(i+1)+'"><span class="ic num">'+(i+1)+'</span><span class="grow"><b>'+esc(Lz(c.t))+'</b><span>'+(th.pk.picks[i+1]?t("pk.youPicked",{k:th.pk.picks[i+1]}):esc(Lz(c.goal)))+'</span></span>'+(lock?'🔒':'')+'</button>'}).join("")+'</div>')}
function stepInSheet(){const th=S.threads[curT];if(!th||!th.pk)return;const w=wd(th.wid);
 sheet('<h2>'+t("pk.stepH")+'</h2><p class="sm dim" style="margin-top:4px">'+t("pk.stepS")+'</p><div class="stack" style="gap:8px;margin-top:10px">'+
  packModes(w).filter(m=>m.as!==th.pk.as).map(m=>'<button class="opt" data-stepas="'+m.as+'"><span class="ic">'+(m.as==="watch"?"👁":m.as==="side"?"🚪":"▶")+'</span><span class="grow"><b>'+esc(packAsName(w,m.as))+'</b><span>'+esc(Lz(m.t))+'</span></span></button>').join("")+'</div>')}

/* ---------- Story Pack purchase ---------- */
function packPaywall(wid,n){const w=wd(wid),c=w.pack.chapters[(n||3)-1];
 // the gate, measured: unlike "opened chapter 3", this tells "the wall was shown" from "they walked"
 try{const _th=S.threads[curT];if(_th&&_th.wid===wid)pkTrack(_th,"paywall",{ch:n||3})}catch(_){}
 sheet('<div class="eyebrow" style="color:var(--gold)">'+t("pk.packEyebrow",{m:PCN(w)})+'</div><h2 style="margin-top:6px">'+esc(t("pk.keepGoing",{t:Lz(c.t)}))+'</h2>'+
  '<p class="sm dim" style="margin-top:6px;line-height:1.55">'+esc(Lz(c.goal))+'</p>'+
  '<ul class="pkbuyl"><li>'+t("pk.b1",{k:PCN(w)-2})+'</li><li>'+t("pk.b2",{n:PACK_UNITS})+'</li><li>'+t("pk.b3")+'</li><li>'+t("pk.b4")+'</li></ul>'+
  '<button class="btn btn-p btn-block" style="margin-top:12px" data-pkbuy="'+wid+'">'+(S.keys>=PACK_PRICE?t("pk.unlock")+' · 💎 '+PACK_PRICE:t("pk.getGems",{n:PACK_PRICE}))+'</button>'+
  '<p class="xs faint" style="text-align:center;margin-top:6px">💎 '+S.keys+' · '+t("pk.oneTime")+'</p>'+
  '<button class="btn btn-q btn-block" style="margin-top:8px" data-close="1">'+t("pk.back")+'</button>'+
  '<p class="xs faint" style="margin-top:10px;line-height:1.5">'+t("pk.fine")+'</p>')}
function packBuy(wid){if(owns(wid)){closeSheet();return}if(S.keys<PACK_PRICE){paySheet("pack");return}
 if(!spend(PACK_PRICE,"pack"))return;const ps=packSt(wid);ps.own=1;ps.at=Date.now();uState().pack+=PACK_UNITS;save();closeSheet();unitChip();
 toast(t("pk.bought",{n:PACK_UNITS}));const th=S.threads[curT];
 if(th&&th.wid===wid&&th.pk&&th.pk.st==="next"&&$("#s-chat")&&!$("#s-chat").hidden)packNext();
 else if(curStory===wid&&$("#s-story")&&!$("#s-story").hidden)openStory(wid,true)}
function bonusSheet(wid){const w=wd(wid),b=w.pack.bonus;
 sheet('<div class="eyebrow" style="color:var(--gold)">✦ '+t("pk.bonus")+'</div><h2 style="margin-top:6px">'+esc(Lz(b.t))+'</h2><p class="sm dim" style="margin-top:8px;line-height:1.6">'+esc(Lz(b.d))+'</p>'+
  '<div class="card" style="margin-top:12px"><b class="sm">🛠 '+t("pk.inProd")+'</b><p class="xs faint" style="margin-top:4px;line-height:1.5">'+t("pk.inProdS")+'</p></div>'+
  ((S.notify||{})[wid]?'<p class="xs" style="color:var(--mint);margin-top:12px;text-align:center">✓ '+t("pk.notified")+'</p>':'<button class="btn btn-p btn-block" style="margin-top:12px" data-pknotify="'+wid+'">🔔 '+t("pk.notify")+'</button>'))}
document.addEventListener("click",e=>{if(e.target.closest("[data-close]"))closeSheet()});

/* ---------- AI prompt context for a story pack ---------- */
function packPrompt(th){if(!th.pk)return "";const w=wd(th.wid),P=w.pack,c=P.chapters[th.pk.ch-1];if(!c)return "";
 const as=th.pk.as,lead=ch(as),past=Object.entries(th.pk.picks).map(([n,k])=>"Ch"+n+": "+P.chapters[n-1].choices.find(x=>x.k===k).mem.en).join(" | ");
 /* 2026-10-28 Ann 原话：「这句子删掉，只给他本节剧情做打底和背景，不要提到别的章…他一个对话者，需要知道这么多吗？未卜先知吗？他就是他，这种 chapter 的角色扮演给去掉」。
    删掉的三样都是**编剧视角**：第几章/共几章、Chapter goal、"读者接下来要做本章官方选择"。
    角色一旦知道自己"该推进到哪"，就会提前朝那个方向使劲，甚至说出还没发生的事。
    留下他真能知道的两样：① 此刻在哪、什么时间（背景，别念出来） ② 已经发生过的事（不许推翻）。
    开关 chat.characterMeta=true 回到旧文案（下面那条分支，一字未改）。 */
 const _canon=function(){try{const k=(typeof canonFacts==="function")?canonFacts(th.wid,th.pk.ch):[];return [past].concat(k).filter(Boolean).join(" | ")}catch(_){return past||""}};
 if(typeof MIRU_TUNE!=="undefined"&&MIRU_TUNE.chat&&MIRU_TUNE.chat.characterMeta===true){
  const _all=_canon();
  return ["CHAPTER "+th.pk.ch+"/"+P.chapters.length+" — \""+c.t.en+"\". Chapter goal: "+c.goal.en+". Place: "+c.place.en+", "+c.time.en+"."+((typeof MIRU_REV!=="undefined"&&MIRU_REV[th.wid])?" [script rev "+MIRU_REV[th.wid]+"]":""),
   _all?"WHAT HAS HAPPENED (official, canon — never contradict, never re-open a settled conflict): "+_all:"",
   th.pk.st==="choose"?("The reader is about to make this chapter's official choice ("+c.choices.map(x=>x.k+": "+x.t.en).join(" / ")+"). "
    +((typeof MIRU_TUNE!=="undefined"&&MIRU_TUNE.chat&&MIRU_TUNE.chat.chapterAdvance===false)
      ? "Stay inside this moment: do NOT make that decision for anyone, do NOT jump to later chapters, do NOT resolve the chapter goal."
      : "Do NOT make that decision for anyone and do NOT resolve the chapter goal — but you MAY move this chapter forward: end the beat, let minutes or hours pass, change rooms, bring someone in.")):
    "This chapter's choice is made. Play the aftermath of it; do not start the next chapter's events."
  ].filter(Boolean).concat(packTail(th,as,lead)).join("\n");
 }
 const _all=_canon();
 return [
  "WHERE YOU ARE: "+c.place.en+", "+c.time.en+". This is background for you to stand in — do not recite it back to the reader, just be in it.",
  _all?"ALREADY HAPPENED (you were there for these or heard about them; never contradict them, never re-open a settled argument): "+_all:"",
  "Time passes in real scenes: you may end a beat, let minutes go by, move to another corner of this place, or let something new happen that nobody announced. You do not know what comes next, and you must not act as if you do."
 ].filter(Boolean).concat(packTail(th,as,lead)).join("\n");
}
/* 与"章节"无关的共用尾部：谁在场 / 玩家扮演谁 / 边界。两种口径都走这里，避免两份漂移。 */
function packTail(th,as,lead){return [
 as==="watch"?"THE USER IS WATCHING, not in the scene: nobody addresses them or knows they exist. Their input is a director's note — play it out between the characters.":
  lead?"THE USER PLAYS "+lead.n+" ("+Lz(lead.role)+"). Never write "+first(lead.n)+"'s lines, actions or thoughts — only react to them. The user's private thoughts are never known by anyone.":"",
  "Respect every character's boundary: a refusal is a real answer. Nothing — gifts, money, persistence — buys consent or love."
];}
function speakersOf(th){return th.cast.filter(c=>!(th.pk&&c===th.pk.as))}

/* ---------- relationship level-up moment ---------- */
function levelUpCheck(th,before){const up=th.cast.filter(c=>!(th.pk&&c===th.pk.as)).map(c=>({c,a:before[c],b:stageOf(th,c)})).filter(x=>x.b>x.a);
 if(!up.length)return;const x=up.sort((p,q)=>(th.love[q.c]||0)-(th.love[p.c]||0))[0];setTimeout(()=>levelUp(x.c,x.a,x.b),700)}
function levelUp(cid,a,b){const c=ch(cid);if(!c||$(".lvup"))return;const d=document.createElement("div");d.className="lvup";
 const st=[Math.max(0,b-1),b,Math.min(4,b+1)];
 d.innerHTML='<div class="lvcard"><button class="lvx" data-lvx="1" aria-label="close">✕</button><div class="lvarrow">⬆︎</div><h2 class="lvh">'+t("lv.h")+'</h2>'+
  '<div class="lvnums"><b class="num">'+(a+1)+'</b><span>▸▸</span><b class="num on">'+(b+1)+'</b></div>'+
  '<h3 class="lvt">'+t("lv.rel",{n:esc(first(c.n))})+'</h3><p class="lvs">'+t("stage."+b+"w")+'</p>'+
  '<div class="lvstrip">'+st.map((s,i)=>'<div class="lvp s'+i+(s===b?" cur":"")+'"><img src="'+artSrc(cid)+'" alt=""><span>'+t("stage."+s)+'</span></div>').join("")+'</div>'+
  '<button class="btn btn-p lvok" data-lvx="1">'+t("lv.ok")+'</button></div>';
 $("#dev").appendChild(d)}
document.addEventListener("click",e=>{if(e.target.closest("[data-lvx]")||e.target.classList.contains("lvup")){$$(".lvup").forEach(x=>x.remove())}});

/* ---------- voice read-aloud: free daily allowance, MIRU+ unlimited, tapping a line is always free ---------- */
const VOICE_FREE=30;
function vDay(){S.vday=S.vday||{d:"",n:0};if(S.vday.d!==today()){S.vday={d:today(),n:0}}return S.vday}
function voiceAutoOK(){if(S.plus)return true;return vDay().n<VOICE_FREE}
function voiceCount(n){vDay().n+=n;save()}
function voicePlaySheet(){const d=vDay(),left=Math.max(0,VOICE_FREE-d.n);
 sheet('<h2>'+t("vp.h")+'</h2><div class="row" style="gap:12px;margin-top:12px"><p class="sm grow" style="line-height:1.5">'+t("vp.toggle")+'</p><button class="tgl'+(S.voice.auto?" on":"")+'" data-vptgl="1" aria-label="auto voice"><i></i></button></div>'+
  '<div class="vpbig">🔊 <b class="num">'+(S.plus?"∞":left)+'</b><span>'+(S.plus?t("vp.unl"):t("vp.left",{n:VOICE_FREE}))+'</span></div>'+
  '<p class="xs faint" style="text-align:center;line-height:1.5">'+t("vp.note")+'</p>'+
  (S.plus?"":'<div class="vpplus"><b>'+t("vp.plus")+'</b><button class="btn btn-p btn-sm" data-paysheet="1">MIRU+</button></div>'))}
document.addEventListener("click",e=>{if(e.target.closest("[data-vptgl]")){S.voice.auto=!S.voice.auto;save();voicePlaySheet();return}
 if(e.target.closest("[data-voiceplay]")){voicePlaySheet();return}});

/* ---------- strings ---------- */
Object.assign(I18N.en,{
 "u.h":"AI turns","u.left":"{n} AI turns left","u.outH":"You're out of AI turns","u.trial":"free trial","u.pack":"purchased","u.plus":"MIRU+ this month",
 "u.what":"An AI turn is one reply to anything you type or direct — however many characters answer. Official choices, replays, your photos and memories never use turns.",
 "u.buy":"Get {n} AI turns","u.buyS":"never expire","u.plusLine":"{n} AI turns every month + long memory + unlimited voice","u.got":"+{n} AI turns",
 "u.free":"Out of turns? Official story choices keep working, and your progress, photos and relationships stay exactly where they are.",
 "u.deep":"Deep replies are on: each costs 3 turns. Switch back to standard in the chat menu.",
 "pk.watch":"Watch","pk.side":"Join the scene","pk.as":"Play as {n}","pk.howPlay":"How do you want to play?","pk.chN":"{n} chapters","pk.owned":"Story Pack owned","pk.free2":"Chapters 1–2 free",
 "pk.continue":"Continue · Ch {n} · {m}","pk.newRun":"Or start a new run","pk.modesNote":"You can step in or step back at any time. Every mode shares the same story and the same choices.",
 "pk.replayH":"Replaying from Chapter {n}","pk.replayS":"Your earlier choices are kept. Everything after this point plays out again.",
 "pk.chShort":"Ch {n}","pk.yourMove":"your move","pk.ended":"ending","pk.nextUp":"next chapter",
 "pk.needA":"Needs {n} honest steps in chapters 1–7 · you have {h}","pk.orType":"Or type anything below to play the moment your way · ✦ 1 AI turn","pk.orTypeOff":"Or type anything below to play the moment your way.",
 "pk.unlockNext":"Chapter {n}","pk.next":"Chapter {n}","pk.stay":"Not ready? Stay in this moment and keep talking — the next chapter waits for you.",
 "pk.endN":"{a}/{b} endings","pk.replay":"Replay a chapter","pk.bonus":"Bonus episode","pk.replayPick":"Replay from…","pk.replayPickS":"A new run starts at that chapter. This one stays saved.","pk.youPicked":"You chose {k}",
 "pk.stepH":"Change how you play","pk.stepS":"The story keeps everything that happened. Only your place in it changes.","pk.steppedH":"You stepped in","pk.steppedS":"From here on: {n}.",
 "pk.packEyebrow":"STORY PACK · CHAPTERS 3–{m}","pk.keepGoing":"Keep going: {t}","pk.b1":"{k} more chapters and all three endings","pk.b2":"+{n} AI turns to make it your own — they never expire",
 "pk.b3":"Replay any chapter, collect every ending","pk.b4":"Official choices stay playable even when AI turns run out","pk.unlock":"Unlock the story","pk.getGems":"Get diamonds · needs 💎 {n}",
 "pk.oneTime":"one-time purchase · yours to keep","pk.back":"Back to the preview","pk.fine":"No timers, no countdowns, no fake discounts. Custom photos and calls are optional extras. Paying never changes how a character feels about you.",
 "pk.bought":"Story unlocked · +{n} AI turns","pk.inProd":"In production","pk.inProdS":"We only sell episodes that are written, cast and finished. Get a ping the day this one is ready.","pk.notify":"Notify me","pk.notified":"We'll tell you when it's ready.",
 "pk.endBonus":"+3 💎 · first ending in this story","pk.firstBonus":"+2 💎 · first chapter complete","pk.chapter":"Chapter {n}","pk.decided":"Your choice","pk.endingH":"Ending {k}","pk.endFound":"{a} of {b} endings found",
 "pk.stepIn":"Step in","pk.direct":"Direct","pk.youAre":"You: {n}",
 "lv.h":"LEVEL UP!","lv.rel":"{n} · relationship level up","lv.ok":"Close",
 "vp.h":"Voice play","vp.toggle":"When ON, characters read their lines aloud automatically.","vp.left":"of {n} free voiced lines left today · resets at midnight","vp.unl":"unlimited with MIRU+",
 "vp.note":"Tapping 🔊 on a single line is always free.","vp.plus":"Unlimited voice with MIRU+",
 "pay.why.pack":"Unlock the story","pay.why.units":"Get more AI turns"});
Object.assign(I18N.zh,{
 "u.h":"AI 回合","u.left":"剩余 {n} 个 AI 回合","u.outH":"AI 回合用完了","u.trial":"免费体验","u.pack":"已购买","u.plus":"本月 MIRU+",
 "u.what":"一个 AI 回合 = 对你输入或导演指令的一次回应——不管几个角色接话都只算一次。官方选项、重玩、你拥有的照片和记忆都不消耗回合。",
 "u.buy":"购买 {n} 个 AI 回合","u.buyS":"永久有效","u.plusLine":"每月 {n} 个 AI 回合 + 长记忆 + 无限语音","u.got":"+{n} 个 AI 回合",
 "u.free":"回合用完也没关系：官方剧情选项照常可玩，你的进度、照片和关系都原样保留。",
 "u.deep":"已开启深度回复：每次消耗 3 个回合。可在聊天菜单切回标准。",
 "pk.watch":"旁观","pk.side":"加入场景","pk.as":"扮演 {n}","pk.howPlay":"你想怎么玩？","pk.chN":"共 {n} 章","pk.owned":"已拥有故事包","pk.free2":"第 1–2 章免费",
 "pk.continue":"继续 · 第 {n} 章 · {m}","pk.newRun":"或者重新开一局","pk.modesNote":"随时可以入场或退回旁观。所有方式共用同一个故事和同样的选择。",
 "pk.replayH":"从第 {n} 章重玩","pk.replayS":"之前的选择都保留，这一章之后的剧情重新演。",
 "pk.chShort":"第 {n} 章","pk.yourMove":"轮到你选","pk.ended":"结局","pk.nextUp":"下一章",
 "pk.needA":"需要在 1–7 章做出 {n} 次坦诚的选择 · 目前 {h} 次","pk.orType":"也可以在下面随意输入，按你的方式演这一刻 · ✦ 1 个 AI 回合","pk.orTypeOff":"也可以在下面随意输入，按你的方式演这一刻。",
 "pk.unlockNext":"第 {n} 章","pk.next":"第 {n} 章","pk.stay":"还没准备好？可以留在这一刻继续聊——下一章会等你。",
 "pk.endN":"已收集 {a}/{b} 个结局","pk.replay":"重玩某一章","pk.bonus":"番外","pk.replayPick":"从哪一章重玩？","pk.replayPickS":"会从那一章开新的一局，这一局会保留。","pk.youPicked":"你选了 {k}",
 "pk.stepH":"换一种玩法","pk.stepS":"已经发生的一切都会保留，只是你在故事里的位置变了。","pk.steppedH":"你入场了","pk.steppedS":"从现在起：{n}。",
 "pk.packEyebrow":"故事包 · 第 3–{m} 章","pk.keepGoing":"继续：{t}","pk.b1":"再解锁 {k} 章和全部三个结局","pk.b2":"+{n} 个 AI 回合，按你的方式演——永久有效",
 "pk.b3":"任意章节重玩，收集每一个结局","pk.b4":"即使 AI 回合用完，官方选项依然可玩","pk.unlock":"解锁整个故事","pk.getGems":"去充值 · 需要 💎 {n}",
 "pk.oneTime":"一次购买 · 永久拥有","pk.back":"返回试玩","pk.fine":"没有倒计时，没有限时假折扣。定制照片和通话是可选的附加内容。付费永远不会改变角色对你的感情。",
 "pk.bought":"故事已解锁 · +{n} 个 AI 回合","pk.inProd":"制作中","pk.inProdS":"我们只出售已经写完、配好、做完的番外。做好的那天提醒你。","pk.notify":"上线提醒我","pk.notified":"做好了会第一时间告诉你。",
 "pk.endBonus":"+3 💎 · 本故事首个结局","pk.firstBonus":"+2 💎 · 完成第一章","pk.chapter":"第 {n} 章","pk.decided":"你的选择","pk.endingH":"结局 {k}","pk.endFound":"已收集 {a}/{b} 个结局",
 "pk.stepIn":"入场","pk.direct":"导演","pk.youAre":"你：{n}",
 "lv.h":"关系升级！","lv.rel":"{n} · 关系等级提升","lv.ok":"关闭",
 "vp.h":"语音播放","vp.toggle":"开启后，角色会自动读出自己的台词。","vp.left":"今日剩余免费语音条数（共 {n} 条）· 每天 0 点重置","vp.unl":"MIRU+ 无限畅听",
 "vp.note":"单独点某一句的 🔊 永远免费。","vp.plus":"开通 MIRU+ 无限语音",
 "pay.why.pack":"解锁整个故事","pay.why.units":"获取更多 AI 回合"});

document.addEventListener("click",e=>{const x=e.target.closest("[data-pkskip]");if(!x||!curT)return;PKSKIP[curT]=1;x.remove()});
Object.assign(I18N.en,{"pk.skip":"Skip ahead"});Object.assign(I18N.zh,{"pk.skip":"跳过这段"});

/* ================= interactive stops: UI + actions ================= */
const GAMEF={keepsake:()=>gKeep(),asleep:()=>gAsleep(),photo:()=>gPhoto(),shutter:()=>gShutter(),sync:()=>gSync(),order:()=>gOrder(),phone:()=>gPhone(),remember:()=>gRemember()};
const STOP_PRICE={photo:2,video:2,voice:1};
function stopClip(th,d){const L=CLIPS[th.wid+":1"]||{},c=L[d.clip!=null?d.clip:0];return c&&c.src}
function stopWho(th,d){return d.who||mainOf(th)}
function stopHTML(th){const b=th.pk.stop,k=b[1],d=b[2],L=x=>esc(Lz(x)),cost=n=>S.plus?t("st.free"):'💎 '+n;
 const hint=d.hint?'<p class="pkask">'+L(d.hint)+'</p>':'';
 const skip='<button class="stskip" data-stopskip="1">'+t(k==="call"?"st.decline":k==="gift"?"st.nogift":"st.later")+' ›</button>';
 if(k==="start")return '<button class="btn btn-p btn-block pkstartb" data-stopstart="1">▶ '+t("st2.start")+'</button>';
 if(k==="line"){const ic={say:"💬",act:"✱",think:"💭"};
  return '<div class="sttag you">🎭 '+t("st.yourTurn",{n:first(ch(th.pk.as)?ch(th.pk.as).n:"")})+'</div>'+hint+'<div class="pkopts">'+d.opts.map((o,i)=>'<button class="pkopt" data-stopline="'+i+'"><i>'+(ic[o.k||"say"])+'</i><span>'+L(o.t)+'</span></button>').join("")+'</div><p class="pkhint">'+t(liveOn()?"st.typeLive":"st.type")+'</p>'}
 if(k==="gift")return '<div class="sttag">🎁 '+t("st.giftH")+'</div>'+hint+'<div class="stgifts">'+GIFTS.map(g=>'<button data-stopgift="'+g.id+'"><span>'+g.ic+'</span><b>'+esc(Lz(g.n))+'</b><small>'+(g.cost?'💎 '+g.cost:t("st.free"))+'</small></button>').join("")+'</div>'+skip;
 if(k==="photo")return '<div class="sttag">📷 '+t("st.photoH")+'</div>'+hint+'<div class="stcard"><div class="stthumb" style="background-image:url('+artSrc(stopWho(th,d))+')"><i>🔒</i></div><div class="grow"><b>'+L(d.cap)+'</b><span>'+t("st.photoS")+'</span></div></div><button class="btn btn-p btn-block" data-stopphoto="1">📷 '+t("st.photoGo")+' · '+cost(STOP_PRICE.photo)+'</button>'+skip;
 if(k==="video")return '<div class="sttag">🎬 '+t("st.videoH")+'</div>'+hint+'<div class="stcard"><div class="stthumb v" style="background-image:url('+artSrc(stopWho(th,d))+')"><i>▶</i></div><div class="grow"><b>'+L(d.cap)+'</b><span>'+t("st.videoS")+'</span></div></div><button class="btn btn-p btn-block" data-stopvideo="1">🎬 '+t("st.videoGo")+' · '+cost(STOP_PRICE.video)+'</button>'+skip;
 if(k==="voice")return '<div class="sttag">🎙 '+t("st.voiceH",{n:first(ch(stopWho(th,d)).n)})+'</div>'+hint+'<div class="stcard">'+avatar(stopWho(th,d),44)+'<div class="grow"><div class="stwave"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><span>'+t("st.voiceS")+'</span></div></div><button class="btn btn-p btn-block" data-stopvoice="1">🔓 '+t("st.voiceGo")+' · '+cost(STOP_PRICE.voice)+'</button>'+skip;
 if(k==="game"){const g=GC.find(x=>x.k===d.k);
  return '<div class="sttag">🎮 '+t("st.gameH")+'</div>'+hint+(th.pk.go?'<button class="btn btn-p btn-block" data-stopdone="1">▶ '+t("pk.resume")+'</button>':'<button class="btn btn-p btn-block" data-stopgame="1">🎮 '+t("st.play")+' · '+(g?t(g.title):"")+'</button>'+skip)}
 if(k==="call"){const c=ch(d.cid||mainOf(th));
  return '<div class="sttag call">📞 '+t("st.callH",{n:first(c.n)})+'</div>'+hint+(th.pk.go?'<button class="btn btn-p btn-block" data-stopdone="1">▶ '+t("pk.resume")+'</button>':'<div class="stcall">'+avatar(d.cid||mainOf(th),52)+'<div class="row" style="gap:10px"><button class="stc no" data-stopskip="1">✕</button><button class="stc yes" data-stopcall="1">📞</button></div></div>')}
 return skip}
function stopPay(n,why){if(S.plus)return true;return spend(n,why)}
function imgOk(u){return new Promise(r=>{const i=new Image();i.onload=()=>r(true);i.onerror=()=>r(false);i.src=u})}
async function stopPhoto(th,d){const who=stopWho(th,d),cap=Lz(d.cap)||"";const pv=$(".pkpanel");if(pv)pv.classList.add("gen");
 let src=null;if(d.img&&await imgOk("art/scenes/"+d.img+".jpg"))src="art/scenes/"+d.img+".jpg";
 if(!src&&AIG.mcp&&d.prompt){try{const res=await AIG.mcp.callTool(AIG.srv,AIG.tool,{prompt:(d.prompt.en||d.prompt)+", cinematic film still, moody low light, 35mm, photorealistic, adult characters",width:576,height:1024,num_inference_steps:24,randomize_seed:true},{cache:false});src=aiImgFrom(res)}catch(_){src=null}}
 let url=null;try{const cv=await sceneStill(th,{who,txt:cap},src?{im:src}:{im:artSrc(who)});url=cv.toDataURL("image/jpeg",.8)}catch(_){url=src||artSrc(who)}
 const aid="a"+Date.now();S.album.unshift({id:aid,cid:who,src:mediaWrap("album:"+aid,url),at:Date.now()});if(S.album.length>24)S.album.length=24;
 appendMsg(th,{who:"me",k:"img",aid,at:Date.now()});save()}
function stopVideo(th,d){return new Promise(res=>{const src=stopClip(th,d);const el=document.createElement("div");el.className="stvid";
 el.innerHTML='<video playsinline autoplay src="'+esc(vidSrc(src))+'"></video><div class="stvcap">'+esc(Lz(d.cap)||"")+'</div><button class="stvx" aria-label="close">✕</button>';
 ($("#dev")||document.body).appendChild(el);const v=el.querySelector("video");v.muted=false;v.play().catch(()=>{v.muted=true;v.play().catch(()=>{})});
 const close=()=>{el.remove();res()};el.querySelector(".stvx").onclick=close;v.onended=()=>setTimeout(close,600);
 v.onerror=()=>{const f=document.createElement("div");f.className="stvfb";f.style.backgroundImage="url("+artSrc(stopWho(th,d))+")";v.replaceWith(f);setTimeout(close,6000)}})}
document.addEventListener("click",async e=>{let x;const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop)return;const k=th.pk.stop[1],d=th.pk.stop[2];
 if(e.target.closest("[data-stopstart]")){stopResolve(th,[]);return}
 if(e.target.closest("[data-stopskip]")){stopResolve(th,d.skip||[]);return}
 if(e.target.closest("[data-stopdone]")){stopResolve(th,d.then||[]);return}
 if(x=e.target.closest("[data-stopline]")){const o=d.opts[+x.dataset.stopline];appendMsg(th,{who:"me",k:o.k||"say",txt:Lz(o.t),at:Date.now()});th.rounds++;
  pkSet(th,o.set);if(typeof dimApply==="function"){const P=dimPairs(th);if(o.rd)dimApply(th,o.rd,Lz(o.t));else if(P){const m=P.find(p=>p.main)||P[0];dimApply(th,{[m.a+"|"+m.b]:dimRule(o)},Lz(o.t))}}if(o.love)th.cast.filter(c=>c!==th.pk.as).forEach(c=>loveWrite(th,c,o.love,"choice:love"));
  stopResolve(th,o.then||[]);return}
 if(x=e.target.closest("[data-stopgift]")){const g=GIFTS.find(y=>y.id===x.dataset.stopgift);if(!g)return;if(g.cost&&!spend(g.cost,"gift"))return;
  const m=stopWho(th,d);loveWrite(th,m,g.love,"gift");th.tasks.gift=1;th.mem.push(me()+" gave "+ch(m).n+" "+Lz(g.n));
  appendMsg(th,{who:"sys",k:"card",title:g.ic+" "+t("cx.m.gift"),txt:t("gift.given",{n:first(ch(m).n),g:Lz(g.n)}),at:Date.now()});
  stopResolve(th,(d.by&&d.by[g.id])||d.then||[]);return}
 if(e.target.closest("[data-stopphoto]")){if(!stopPay(STOP_PRICE.photo,"img"))return;const btn=e.target.closest("button");btn.disabled=true;btn.textContent="✨ "+t("ai.painting");
  await stopPhoto(th,d);stopResolve(th,d.then||[]);return}
 if(e.target.closest("[data-stopvideo]")){if(!stopPay(STOP_PRICE.video,"ep"))return;appendMsg(th,{who:"sys",k:"card",title:"🎬 "+t("st.videoH"),txt:Lz(d.cap)||"",at:Date.now()});
  await stopVideo(th,d);stopResolve(th,d.then||[]);return}
 if(e.target.closest("[data-stopvoice]")){if(!stopPay(STOP_PRICE.voice,"line"))return;const who=stopWho(th,d),txt=Lz(d.txt);
  appendMsg(th,{who,k:"say",txt:"🎙 "+txt,at:Date.now()});try{speak(txt,who)}catch(_){}stopResolve(th,d.then||[]);return}
 if(e.target.closest("[data-stopgame]")){const f=GAMEF[d.k];if(!f){stopResolve(th,d.then||[]);return}
  if(d.pair&&ch(d.pair[0])&&ch(d.pair[1])){const pid=th.wid+":"+d.pair.join("+");if(!BLP.find(b=>b[0]===pid))BLP.push([pid,d.pair[0],d.pair[1]]);S.gpair=pid}else S.gpair=th.wid;th.pk.go=1;save();packRefresh(th);f();return}
 if(e.target.closest("[data-stopcall]")){if(d.lines&&d.lines.length){await stopCallRun(th,d);stopResolve(th,d.then||[]);return}th.pk.go=1;save();packRefresh(th);callGate(d.cid||mainOf(th));return}});
/* a scripted, in-story phone call: his voice, line by line; the transcript lands in the chat afterwards */
function stopCallRun(th,d){return new Promise(res=>{const cid=d.cid||mainOf(th),c=ch(cid),lines=d.lines.map(x=>Array.isArray(x)?x:[cid,x]);let i=0,done=false;const t0=Date.now();
 const el=document.createElement("div");el.className="callv stcallv";
 el.innerHTML='<div class="cv-bg" style="background-image:url('+artSrc(cid)+')"></div><div class="cv-veil"></div><div class="cv-top"><b>'+esc(c.n)+'</b><span id="scT">00:00</span></div><div class="cv-av">'+avatar(cid,120)+'<div class="cv-wave on"><i></i><i></i><i></i><i></i><i></i></div></div><p class="cv-line" id="scL">…</p><p class="xs" style="text-align:center;opacity:.6;margin-top:6px">'+t("st.callTap")+'</p><div class="cv-bot"><button class="cv-b end" data-scend="1">✕<small>'+t("call.end")+'</small></button></div>';
 ($("#dev")||document.body).appendChild(el);const tk=setInterval(()=>{const s=Math.floor((Date.now()-t0)/1000),e=el.querySelector("#scT");if(e)e.textContent=String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")},1000);
 let tm=null;const fin=()=>{if(done)return;done=true;clearInterval(tk);clearTimeout(tm);try{stopVoice()}catch(_){}el.remove();const sec=Math.round((Date.now()-t0)/1000);
  appendMsg(th,{who:"sys",k:"card",title:"📞 "+t("st.callLog",{n:first(c.n)}),txt:String(Math.floor(sec/60))+":"+String(sec%60).padStart(2,"0"),at:Date.now()});
  lines.slice(0,i).forEach(([w,x])=>appendMsg(th,{who:ch(w)?w:cid,k:"say",txt:"📞 "+x,at:Date.now()}));save();res()};
 const next=()=>{if(done)return;clearTimeout(tm);if(i>=lines.length){fin();return}const [w,x]=lines[i++];const L=el.querySelector("#scL");if(L)L.textContent=x;
  let ended=false;const go=()=>{if(ended)return;ended=true;tm=setTimeout(next,500)};try{speak(x,ch(w)?w:cid,go)}catch(_){}
  tm=setTimeout(go,readMs({txt:x})+400)};
 el.addEventListener("click",e=>{if(e.target.closest("[data-scend]")){fin();return}try{stopVoice()}catch(_){}next()});next()})}
/* typing your own line at a "your turn" stop */
const _doSendPk=doSend;doSend=function(txt,mode){const th=S.threads[curT];
 if(th&&th.pk&&th.pk.stop&&th.pk.stop[1]==="line"&&!busy&&(mode||cmode)!=="dir"){txt=(txt||"").trim();if(!txt)return;const d=th.pk.stop[2];
  if(liveOn()){if(!aiGate()){const ta=$("#cin");if(ta)ta.value=txt;return}appendMsg(th,{who:"me",k:mode||cmode,txt,at:Date.now()});th.rounds++;
   Promise.resolve(reply(th,{kind:"user",txt,mode:mode||cmode})).then(()=>stopResolve(th,d.free||[]));return}
  appendMsg(th,{who:"me",k:mode||cmode,txt,at:Date.now()});th.rounds++;stopResolve(th,d.free||(d.opts[0]&&d.opts[0].then)||[]);return}
 return _doSendPk(txt,mode)};
document.addEventListener("click",e=>{if(!e.target.closest("[data-pkresume]"))return;const th=S.threads[curT];if(th&&th.pk)packRun(th)});
Object.assign(I18N.en,{"pk.resume":"Continue the scene","st.yourTurn":"Your turn — you're {n}","st.type":"Or type your own line below.","st.typeLive":"Or type anything below — he'll answer you, live.",
 "st.giftH":"A moment for a gift","st.nogift":"Not now","st.later":"Keep going","st.decline":"Decline","st.free":"Free",
 "st.photoH":"Capture this moment","st.photoS":"A photo of exactly this scene — kept in your album.","st.photoGo":"Unlock the photo",
 "st.videoH":"A filmed moment","st.videoS":"Watch this beat play out on screen.","st.videoGo":"Unlock the clip",
 "st.voiceH":"{n} left a voice note","st.voiceS":"Locked · tap to hear it in his voice","st.voiceGo":"Listen",
 "st.gameH":"Play this moment","st.play":"Play","st.callH":"{n} is calling…","st.callTap":"Tap for the next line","st.callLog":"Call with {n}"});
Object.assign(I18N.zh,{"pk.resume":"继续剧情","st.yourTurn":"轮到你了 · 你是 {n}","st.type":"也可以在下面自己打一句。","st.typeLive":"也可以在下面随便说——他会实时回应你。",
 "st.giftH":"这一刻，送他点什么","st.nogift":"先不送","st.later":"继续","st.decline":"拒接","st.free":"免费",
 "st.photoH":"定格这一刻","st.photoS":"生成这一幕的照片，存进你的相册。","st.photoGo":"解锁照片",
 "st.videoH":"影像片段","st.videoS":"看这一幕真正演出来。","st.videoGo":"解锁影像",
 "st.voiceH":"{n} 给你留了一条语音","st.voiceS":"已上锁 · 点开听他亲口说","st.voiceGo":"收听",
 "st.gameH":"亲手玩这一段","st.play":"去玩","st.callH":"{n} 来电…","st.callTap":"点一下听下一句","st.callLog":"和 {n} 的通话"});

document.addEventListener("click",e=>{if(e.target.closest("[data-pkspd]")){const v=pkSpd();S.pkSpd=v===1?1.6:v>1?0:1;save();const th=S.threads[curT];if(th){packRefresh(th);if(PKNEXT[curT]&&S.pkSpd)PKNEXT[curT]()}return}
 if(e.target.closest("[data-pknextl]")){if(PKNEXT[curT])PKNEXT[curT]();return}
 if(e.target.closest("#msgs")&&!e.target.closest("button,a,input,textarea,.m-img")&&PKNEXT[curT])PKNEXT[curT]()});
document.addEventListener("click",e=>{if(e.target.closest("[data-pkskip]")&&PKNEXT[curT])PKNEXT[curT]()});
Object.assign(I18N.en,{"pk.spdNorm":"Auto","pk.spdSlow":"Auto · slow","pk.spdTap":"Tap to continue","pk.nextLine":"Next","pk.tapHint":"Tap the story to see the next line sooner."});
Object.assign(I18N.zh,{"pk.spdNorm":"自动播放","pk.spdSlow":"自动 · 慢速","pk.spdTap":"点一下才继续","pk.nextLine":"下一句","pk.tapHint":"点一下聊天区域，就能马上看下一句。"});
