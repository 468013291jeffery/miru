/* ---- v128 narration arrives as one block ----
   A run of narration / actions / inner voice no longer types out line by line: the whole run lands at once in a
   single box, then the reader gets one pause sized to the whole block. Spoken lines still come one at a time. */
const BURST_MAX=12;
const _pkAppend28=pkAppend;
pkAppend=function(th,m){const i=th.msgs.length-1,L=th.msgs[i];
 if(m&&isNarr(m)&&th._brk){th._brk=0;appendMsg(th,{who:"n",k:"box",pk:1,parts:[{who:m.who,k:m.who==="n"?"act":m.k,txt:m.txt}],txt:m.txt,last:m.txt,lastWho:m.who,at:Date.now()});return}
 if(m&&isNarr(m)&&L&&L.k==="box"&&L.pk&&!L.say&&L.parts.length<BURST_MAX){L.parts.push({who:m.who,k:m.who==="n"?"act":m.k,txt:m.txt});
  L.txt+=" "+m.txt;L.last=m.txt;L.lastWho=m.who;th.at=Date.now();save();boxRedraw(th,i);burstTop(th,i);return}
 return _pkAppend28(th,m)};
const _pkWait28=pkWait;
pkWait=function(th,prev,spd,ms){const nx=th.pk&&th.pk.q&&th.pk.q[0];
 if(!th._brk&&prev&&prev.k==="box"&&prev.pk&&!prev.say&&prev.parts&&prev.parts.length<BURST_MAX&&Array.isArray(nx)&&nx[0]!=="sys"&&isNarr(beatMsg(nx)))return Promise.resolve();
 return _pkWait28(th,prev,spd,ms)};
/* a long block gets time to be read (tap the chat to move on sooner) */
const _readMs28=readMs;readMs=function(m){if(m&&m.k==="box"&&!m.say){const x=String(m.txt||""),cjk=/[㐀-鿿]/.test(x);return Math.min(14000,Math.max(1800,cjk?900+x.length*80:900+x.length*26))}return _readMs28(m)};
/* a change of place or picture (scene / bg / title) closes the current block */
const _pkDir28=pkDirective;pkDirective=function(th,b){if(Array.isArray(b)&&b[0]==="sys"&&["scene","bg","title"].includes(b[1]))th._brk=1;return _pkDir28(th,b)};
/* a tall block is shown from its first line, not scrolled to its last */
let _bt=0;function burstTop(th,i){clearTimeout(_bt);_bt=setTimeout(()=>{if(curT!==th.id)return;const box=$("#msgs"),el=$('#msgs [data-mi="'+i+'"]');if(!box||!el)return;
 if(el.offsetHeight>box.clientHeight*.55){const top=el.getBoundingClientRect().top-box.getBoundingClientRect().top+box.scrollTop-10;box.scrollTop=top}},30)}
/* the picture / weather / music of the NEXT scene waits until the block on screen has been read */
const VIS28=new Set(["scene","bg","fx","title","bgm"]);
const _pkAppendU=pkAppend;pkAppend=function(th,m){th._unread=1;th._held=0;return _pkAppendU(th,m)};
const _pkWaitU=pkWait;pkWait=function(th,prev,spd,ms){if(th._held){th._held=0;return Promise.resolve()}const p=_pkWaitU(th,prev,spd,ms);return p.then(v=>{th._unread=0;return v})};
packRun=async function(th){const live=()=>curT===th.id&&$("#s-chat")&&!$("#s-chat").hidden;if(PKPLAY[th.id]===2)return;PKPLAY[th.id]=2;packRefresh(th);const gen=th._gen=(th._gen||0)+1;const dead=()=>th._gen!==gen;
 try{while(th.pk.q&&th.pk.q.length){const b=th.pk.q[0];
   if(th._unread&&Array.isArray(b)&&b[0]==="sys"&&VIS28.has(b[1])&&!PKSKIP[th.id]){th._unread=0;while(!live())await new Promise(r=>setTimeout(r,500));
    const prev=th.msgs[th.msgs.length-1],spd=pkSpd(),ms=readMs(prev)*(spd||1);await pkWait(th,prev,spd,ms);if(dead())return;delete PKNEXT[th.id];th._held=1;if(!th.pk.q||th.pk.q[0]!==b)continue}
   if(pkDirective(th,b))continue;
   if(isStop(b)){let extra=stopAuto(th,b);
    if(!extra){delete PKSKIP[th.id];th.pk.stop=b;th.pk.go=0;th.pk.min=false;save();packRefresh(th);if(live())scrollChat();
     extra=await new Promise(r=>PKWAIT[th.id]=r);if(dead())return;delete PKWAIT[th.id]}
    th.pk.stop=null;th.pk.go=0;th.pk.q.shift();th.pk.q.unshift(...(extra||[]));save();packRefresh(th);continue}
   /* 2026-10-27：打开「历史」时剧情暂停，收起后继续 */
   while(!live()||(typeof HIST_OPEN!=="undefined"&&HIST_OPEN))await new Promise(r=>setTimeout(r,500));if(dead())return;
   if(!PKSKIP[th.id]){const prev=th.msgs[th.msgs.length-1],spd=pkSpd(),ms=readMs(prev)*(spd||1);
    await pkWait(th,prev,spd,ms);if(dead())return;delete PKNEXT[th.id];if(!th.pk.q||th.pk.q[0]!==b)continue;
    if(typeof HIST_OPEN!=="undefined"&&HIST_OPEN)continue}
   th.pk.q.shift();pkAppend(th,beatMsg(b));save()}}
 finally{delete PKPLAY[th.id];delete PKSKIP[th.id]}
 const a=th.pk.after;th.pk.after=null;th.pk.q=null;save();
 if(a==="choose"){th.pk.st="choose";save();packRefresh(th);if(curT===th.id)scrollChat()}
 else if(a&&a.indexOf("pick:")===0)packAfterPick(th,a.slice(5))};
