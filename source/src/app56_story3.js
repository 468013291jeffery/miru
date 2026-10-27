/* ================= v2.3 · DYNAMIC NARRATIVE — items, long/short branches, convergence, character arcs, autonomous decisions =================
   The story engine used to be "a branching novel with state". These directives make it a world that changes:
   ITEMS     ["sys","item",{give:"key",n:1,name:{zh,en},icon:"🗝",desc}] · ["sys","item",{take:"key"}]
             ["sys","use",{item:"key",ask:{zh,en},then:[…],else:[…],keep:true}] — a STOP: use it, or solve it another way.
             No item never means "can't continue": without it the else-path plays (QA enforces an else).
             Chapter choices may carry give:"id" / need:"id" (need-locked choices always have a sibling without need).
   BRANCHES  ["sys","branch",{id,len:"short"|"long",then:[…]}] short = a few lines, rejoins at once; long = sets flag br_<id> that later chapters read.
             ["sys","join",{id}] — the branches converge here (QA checks every long branch reaches a join or an ending).
   ARCS      stage.min may also hold need:[flags] (a conflict that must have happened) and block:[flags] (an unrepaired event — e.g. broke_promise — locks the stage until <flag>_repaired is set: ordinary positive chat can't erase it).
             pack.arcs = {charId:[{id,name:{zh,en},min:{tru:0}},{id:"thaw",min:{tru:45}},…,{id:"relapse",regress:{gru:60}}]}
             stages are computed from the relationship meters (信任/吸引/张力/嫉妒/旧恨) + flags — a character can grow AND regress.
             Without pack.arcs every character uses the default 5-stage arc (封闭→试探→松动→交付→并肩, relapse = 退缩).
   DECIDE    ["sys","decide",{who,by:{guarded:[…],thaw:[…],open:[…]},else:[…]}] — the CHARACTER chooses, from who he is right now.
             The same moment early or late in the story plays differently.
   CONDITIONS (in ["sys","if"]) add {item:"key"} {noitem:"key"} {rel:["tru",">=",50]} {arc:["roman","open"]} {said:"钥匙"} {talked:3}.
   CHOICE EXTRAS: choices[].rd = {"a|b":{tru:+3}} (or {trust:3} on the main pair), give, need, len. */
const ARC_DEF=[{id:"closed",name:{zh:"封闭",en:"Closed off"},min:{}},{id:"probe",name:{zh:"试探",en:"Testing"},min:{tru:38}},{id:"thaw",name:{zh:"松动",en:"Thawing"},min:{tru:50,att:45}},
 {id:"give",name:{zh:"交付",en:"Letting in"},min:{tru:64,att:58}},{id:"side",name:{zh:"并肩",en:"Side by side"},min:{tru:78,att:70}},{id:"relapse",name:{zh:"退缩",en:"Pulling back"},regress:{gru:58}}];
const ARC_HOW={closed:"guarded; deflects with sarcasm or silence; never volunteers feelings; would choose duty/self-protection over the user",
 probe:"curious but defensive; asks more than he answers; small tells slip through",thaw:"lets one honest thing out per scene, then retreats a little; protective in action, not words",
 give:"chooses the user when it costs him; says true things plainly but briefly",side:"acts as a partner: shares plans, asks the user's opinion, fights for the relationship",
 relapse:"hurt and withdrawing; colder than before, keeps score; can be won back only by actions, not apologies"};
const DIMX={trust:"tru",attraction:"att",tension:"ten",jealousy:"jea",resentment:"gru",tru:"tru",att:"att",ten:"ten",jea:"jea",gru:"gru"};
function pkItems(th){th.pk.items=th.pk.items||{};return th.pk.items}
function itemDef(th,id){const w=wd(th.wid),I=(w&&w.pack&&w.pack.items)||{};return I[id]||{name:{zh:id,en:id},icon:"🎒"}}
function itemName(th,id){const d=itemDef(th,id);return (d.icon||"🎒")+" "+(Lz(d.name)||id)}
function pairRow(th,who){try{dimState(th);const P=dimPairs(th)||[];const p=P.find(x=>x.a===who||x.b===who)||P.find(x=>x.main)||P[0];return p?th.rdv[dimKey(p.a,p.b)]:null}catch(_){return null}}
function arcList(th,who){const w=wd(th.wid),A=w&&w.pack&&w.pack.arcs;return (A&&A[who])||ARC_DEF}
function arcOf(th,who){if(!th||!th.pk)return null;const L=arcList(th,who),r=pairRow(th,who)||{},F=th.pk.flags||{};
 const meets=m=>Object.keys(m||{}).every(k=>k==="flag"?!!F[m.flag]:k==="need"?[].concat(m.need).every(f=>F[f]):k==="block"?![].concat(m.block).some(f=>F[f]&&!F[f+"_repaired"]):(r[DIMX[k]||k]||0)>=m[k]);
 const reg=L.find(s=>s.regress&&meets(s.regress));if(reg)return reg;
 let cur=L[0];L.forEach(s=>{if(!s.regress&&meets(s.min))cur=s});return cur}
function arcCheck(th){if(!th||!th.pk)return;th.pk.arcs=th.pk.arcs||{};const zh=CL()==="zh";
 th.cast.filter(c=>ch(c)&&c!==th.pk.as).forEach(c=>{const s=arcOf(th,c);if(!s)return;const was=th.pk.arcs[c];if(was===s.id)return;th.pk.arcs[c]=s.id;if(!was)return;
  const L=arcList(th,c),wi=L.findIndex(x=>x.id===was),si=L.findIndex(x=>x.id===s.id),down=s.regress||si<wi,ws=L[wi];
  appendMsg(th,{who:"sys",k:"card",title:(down?"🥀 ":"🌱 ")+first(ch(c).n)+(zh?(down?" 退回了一步":" 变了"):(down?" pulled back":" changed")),txt:(ws?Lz(ws.name)+" → ":"")+Lz(s.name),at:Date.now()});
  if(th.mem)th.mem.push((zh?first(ch(c).n)+" 的状态：":first(ch(c).n)+" is now: ")+Lz(s.name))})}
/* ---- conditions ---- */
const _pkCond56=pkCond;
pkCond=function(th,c){if(!c)return false;const I=pkItems(th),r=pairRow(th,th.pk.as)||{};
 if(c.item)return (I[c.item]||0)>0;if(c.noitem)return !(I[c.noitem]>0);
 if(c.rel){const [k,op,n]=c.rel,v=r[DIMX[k]||k]||0;return op===">="?v>=n:op==="<="?v<=n:op===">"?v>n:op==="<"?v<n:v===n}
 if(c.arc){const s=arcOf(th,c.arc[0]);return !!s&&[].concat(c.arc[1]).includes(s.id)}
 if(c.said){const k=String(c.said).toLowerCase();return th.msgs.some(m=>m.who==="me"&&String(m.txt||"").toLowerCase().includes(k))}
 if(c.talked!=null)return (th.pk.talkN||0)>=c.talked;
 if(c.any)return c.any.some(x=>pkCond(th,x));if(c.all)return c.all.every(x=>pkCond(th,x));
 return _pkCond56(th,c)};
/* ---- directives ---- */
PKREG.add("app56_story3.js", function(th,b, next){if(!(Array.isArray(b)&&b[0]==="sys"))return next(th,b);const d=b[2]||{},zh=CL()==="zh";
 if(b[1]==="item"){th.pk.q.shift();const I=pkItems(th);
  if(d.give){I[d.give]=(I[d.give]||0)+(d.n||1);if(d.name||d.icon){const w=wd(th.wid);if(w&&w.pack){w.pack.items=w.pack.items||{};w.pack.items[d.give]=w.pack.items[d.give]||{name:d.name,icon:d.icon,desc:d.desc}}}
   appendMsg(th,{who:"sys",k:"card",title:(zh?"🎒 获得道具":"🎒 New item"),txt:itemName(th,d.give)+(d.desc?" · "+Lz(d.desc):""),at:Date.now()})}
  if(d.take&&I[d.take]){I[d.take]=Math.max(0,I[d.take]-(d.n||1));appendMsg(th,{who:"sys",k:"card",title:zh?"🎒 道具用掉了":"🎒 Item used",txt:itemName(th,d.take),at:Date.now()})}
  save();return true}
 if(b[1]==="branch"){th.pk.q.shift();th.pk.br=th.pk.br||[];th.pk.br.push({id:d.id,len:d.len||"short",ch:th.pk.ch});if(d.len==="long"&&d.id)pkSet(th,"br_"+d.id);th.pk.q.unshift(...(d.then||[]));save();return true}
 if(b[1]==="join"){th.pk.q.shift();th.pk.joins=th.pk.joins||[];if(d.id)th.pk.joins.push(d.id);save();return true}
 if(b[1]==="decide"){th.pk.q.shift();const who=d.who||mainOf(th),s=arcOf(th,who),by=d.by||{};const path=(s&&by[s.id])||d.else||[];
  if(ch(who))appendMsg(th,{who:"sys",k:"card",title:"⚖ "+first(ch(who).n)+(zh?" 自己做了决定":" decides for himself"),txt:(zh?"因为他现在是「":"Because right now he is \"")+(s?Lz(s.name):"")+(zh?"」":"\""),at:Date.now()});
  th.pk.q.unshift(...path);save();return true}
 if(b[1]==="arc"){th.pk.q.shift();arcCheck(th);save();return true}
 return next(th,b)});;
/* the "use an item" stop */
STOPK.add("use");
const _stopAuto56=stopAuto;
stopAuto=function(th,b){if(b&&b[1]==="use"){const d=b[2]||{};if(!(pkItems(th)[d.item]>0))return d.else||[];return null}return _stopAuto56(th,b)};
const _stopHTML56=stopHTML;
stopHTML=function(th){const b=th.pk.stop;if(!b||b[1]!=="use")return _stopHTML56(th);const d=b[2]||{},zh=CL()==="zh";
 return '<div class="sttag you">🎒 '+(zh?"你身上有能用的东西":"You have something that could help")+'</div>'+(d.ask?'<p class="pkask">'+esc(Lz(d.ask))+'</p>':'')+
  '<div class="pkopts"><button class="pkopt" data-useit="1"><i>🎒</i><span>'+(zh?"用 ":"Use ")+esc(itemName(th,d.item))+'</span></button>'+
  '<button class="pkopt" data-useno="1"><i>↻</i><span>'+(zh?"不用道具，换个办法":"Solve it another way")+'</span></button></div>'};
document.addEventListener("click",e=>{const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop||th.pk.stop[1]!=="use")return;const d=th.pk.stop[2]||{};
 if(e.target.closest("[data-useit]")){const ex=(d.then||[]).slice();if(!d.keep)ex.unshift(["sys","item",{take:d.item}]);stopResolve(th,ex);return}
 if(e.target.closest("[data-useno]")){stopResolve(th,d.else||[])}});
/* ---- chapter choices: rd / give / need ---- */
function rdNorm(th,rd){if(!rd)return null;const out={};const P=dimMain(th);
 Object.keys(rd).forEach(k=>{const v=rd[k];if(k.includes("|")){const o={};Object.keys(v||{}).forEach(x=>{if(DIMX[x])o[DIMX[x]]=v[x]});out[k]=o}
  else if(DIMX[k]&&P){const pk=P.a+"|"+P.b;out[pk]=out[pk]||{};out[pk][DIMX[k]]=v}});return out}
const _packPick56=packPick;
packPick=function(k){const th=S.threads[curT];if(!th||!th.pk||th.pk.st!=="choose")return _packPick56(k);const w=wd(th.wid),c=w.pack.chapters[th.pk.ch-1],x=c&&c.choices.find(y=>y.k===k);
 if(x&&x.need&&!(pkItems(th)[x.need]>0)){toast((CL()==="zh"?"需要道具：":"Needs: ")+itemName(th,x.need));return}
 const before=th.pk.picks[th.pk.ch];_packPick56(k);
 if(x&&th.pk.picks[th.pk.ch]===k&&before!==k){try{const rd=rdNorm(th,x.rd);if(rd)dimApply(th,rd,Lz(x.t));if(x.give){pkItems(th)[x.give]=(pkItems(th)[x.give]||0)+1}if(x.need&&!x.keep)pkItems(th)[x.need]--;
  if(x.len==="long")pkSet(th,"br_ch"+th.pk.ch+"_"+k);arcCheck(th);save()}catch(_){}}};
/* need-locked options look locked in the chapter choice list */
const _packPanel56=packPanel;
packPanel=function(th){let h=_packPanel56(th);try{if(th.pk&&th.pk.st==="choose"){const c=wd(th.wid).pack.chapters[th.pk.ch-1];(c.choices||[]).forEach(x=>{if(x.need&&!(pkItems(th)[x.need]>0))h=h.replace('data-pkpick="'+x.k+'"','data-pkpick="'+x.k+'" data-need="1"')})}}catch(_){}
 const I=th.pk?pkItems(th):{},ids=Object.keys(I).filter(k=>I[k]>0);
 if(ids.length&&!th.pk.stop)h=h.replace('<div class="pkhd">','<div class="pkbag">'+ids.map(k=>'<span title="'+esc(Lz(itemDef(th,k).desc)||"")+'">'+esc(itemName(th,k))+(I[k]>1?" ×"+I[k]:"")+'</span>').join("")+'</div><div class="pkhd">');
 return h};
/* arcs move whenever the meters move */
const _dimAdd56=dimAdd;dimAdd=function(th,k,d,why){const r=_dimAdd56(th,k,d,why);try{if(th&&th.pk)setTimeout(()=>arcCheck(th),30)}catch(_){}return r};
/* talk turns are counted for {talked:n} */
const _talkLearn56=talkLearn;talkLearn=function(th,txt){if(th&&th.pk)th.pk.talkN=(th.pk.talkN||0)+1;return _talkLearn56(th,txt)};
/* ---- the live model is told who everyone is RIGHT NOW (arc), what you carry, and what you said — and that it cannot change any of it ---- */
const _packPrompt56=packPrompt;
packPrompt=function(th){let s=_packPrompt56(th);if(!th||!th.pk)return s;try{const I=pkItems(th),ids=Object.keys(I).filter(k=>I[k]>0);
 const arcs=th.cast.filter(c=>ch(c)&&c!==th.pk.as).map(c=>{const a=arcOf(th,c);return a?"- "+ch(c).n+": arc stage \""+((a.name&&a.name.en)||a.id)+"\" — "+(ARC_HOW[a.id]||Lz(a.how)||""):""}).filter(Boolean).join("\n");
 s+="\nCHARACTER ARCS (how each character behaves NOW — the same situation plays differently at different stages):\n"+arcs;
 if(ids.length)s+="\nTHE USER CARRIES: "+ids.map(k=>(Lz(itemDef(th,k).name)||k)).join(", ")+" (characters may notice; only the engine can use or remove items).";
 const M2=(th.pk.mem2||[]).slice(-12);if(M2.length)s+="\nWHAT THE USER SAID EARLIER (memory with status — a guess is NOT a fact; a pending promise may be referenced, kept or broken only by the script):\n"+M2.map(m=>"- ["+({pref:"stated preference",guess:"user's guess",promise:"promise · "+m.status}[m.kind])+"] "+m.txt).join("\n");
 s+="\nENGINE RULES: you write words only. You cannot add items, set flags, change relationship numbers, unlock endings or skip chapters — the engine does that from the script. Never invent facts the script hasn't revealed; a character only knows what he has seen."}catch(_){}return s};
(function(){const st=document.createElement("style");st.textContent=`
.pkbag{display:flex;gap:6px;flex-wrap:wrap;margin:-2px 0 8px}.pkbag span{font-size:11.5px;padding:4px 9px;border-radius:999px;background:rgba(240,183,126,.12);border:1px solid rgba(240,183,126,.35);color:#F6D3AE}
.pkopt[data-need]{opacity:.55}.pkopt[data-need] span:after{content:" 🔒";}`;document.head.appendChild(st)})();
