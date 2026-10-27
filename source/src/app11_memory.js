/* ================= MEMORY SPACE — visible, tiered long memory (竞品: “已用 665 / 8K · 解锁 26K 记忆空间”) =================
   Free 8K  · MIRU+ 32K (all stories) · Deep Memory 128K — either one story forever for 30 💎, or MIRU+ Max for every story ($19.99/mo).
   The tier really changes what the model sees: transcript length + how many remembered moments go into the prompt.
   Layers shown to the user: Persona (fixed) · Key moments (what he remembers about you) · Between them (what the two leads remember of each other). */
const MEMT={free:{cap:8000,msgs:20,mem:5},plus:{cap:32000,msgs:60,mem:40},deep:{cap:128000,msgs:150,mem:120}};
const DEEP_PRICE=5; /* v4.0: no membership; deep memory for one story — its extra prompt costs pennies */
function memTier(th){if(S.plusMax||(th&&S.deepMem&&S.deepMem[th.id]))return "deep";return S.plus?"plus":"free"}
function memUsed(th){const n=th.msgs.reduce((a,m)=>a+String(m.txt||"").length+12,0)+(th.mem||[]).join("").length;return Math.round(n/(S.lang==="zh"?1.6:3.6))}
function fmtK(n){return n>=1000?(n/1000).toFixed(n>=10000?0:1)+"K":String(n)}
function memForgot(th){const T=MEMT[memTier(th)];return Math.max(0,th.msgs.length-T.msgs)}
/* what the model sees now depends on the tier */
transcript=(function(orig){return function(th){const T=MEMT[memTier(th)];const keep=th.msgs;th.msgs=keep.slice(-T.msgs);try{return orig(th)}finally{th.msgs=keep}}})(transcript);
memBlock=function(th){const tier=memTier(th),T=MEMT[tier];let mem=(th.mem||[]).slice(-T.mem);
 if(tier!=="free"){const other=Object.values(S.threads).filter(o=>o!==th&&o.cast.some(c=>th.cast.includes(c))).flatMap(o=>(o.mem||[]).slice(tier==="deep"?-20:-6).map(x=>"(from "+o.title+") "+x));mem=other.slice(tier==="deep"?-40:-12).concat(mem)}
 return mem.length?("THINGS THAT HAVE HAPPENED"+(tier!=="free"?" (long memory — refer back to these naturally)":"")+":\n"+mem.map(x=>"- "+x).join("\n")):""};
function memChip(th){const T=MEMT[memTier(th)],u=memUsed(th),pct=Math.min(100,Math.round(u/T.cap*100));
 return '<span class="memchip'+(pct>=80?" hot":"")+'" data-memsheet="1">🧠 <b class="num">'+fmtK(Math.min(u,T.cap))+'/'+fmtK(T.cap)+'</b><i><s style="width:'+pct+'%"></s></i></span>'}
function memSheet(){const th=S.threads[curT];if(!th)return;const tier=memTier(th),T=MEMT[tier],u=memUsed(th),pct=Math.min(100,Math.round(u/T.cap*100)),fg=memForgot(th),mid=mainOf(th),c=ch(mid),p=typeof pairOf==="function"&&pairOf(th.wid);
 const mem=(th.mem||[]),pairMem=p?mem.filter(x=>x.includes(first(ch(p[1]).n))&&x.includes(first(ch(p[2]).n))):[];
 sheet('<div class="row" style="gap:10px">'+avatar(mid,44)+'<div class="grow"><div class="eyebrow" style="color:var(--gold)">'+t("mem.h")+'</div><b style="font-size:18px">'+esc(c?c.n:th.title)+'</b></div><span class="memtier '+tier+'">'+t("mem.t."+tier)+'</span></div>'+
  '<div class="membar"><div class="row"><b>'+t("mem.state."+(pct>=100?"full":pct>=80?"near":"ok"))+'</b><span class="grow"></span><span class="num xs">'+fmtK(Math.min(u,T.cap))+' / '+fmtK(T.cap)+' '+t("mem.used")+'</span></div><i><s style="width:'+pct+'%"></s></i>'+
  '<p class="xs dim">'+(fg?t("mem.forgot",{n:fg,who:first(c?c.n:"")}):t("mem.explain"))+'</p></div>'+
  '<div class="memlay"><div><b>🧬 '+t("mem.l1")+'</b><span>'+t("mem.l1S")+'</span><em>'+t("mem.fixed")+'</em></div>'+
  '<div><b>💗 '+t("mem.l2")+' · '+Math.min(mem.length,T.mem)+'</b><span>'+(mem.length?esc(mem.slice(-2).join(" · ")).slice(0,140):t("mem.none"))+'</span><em>'+t("mem.keep",{n:T.mem})+'</em></div>'+
  (p?'<div><b>🔗 '+t("mem.l3",{a:first(ch(p[1]).n),b:first(ch(p[2]).n)})+' · '+pairMem.length+'</b><span>'+(pairMem.length?esc(pairMem.slice(-1)[0]).slice(0,120):t("mem.l3S"))+'</span><em>'+(tier==="free"?"🔒 MIRU+":t("mem.on"))+'</em></div>':'')+'</div>'+
  '<div class="memtiers">'+["free","plus","deep"].map(k=>{const X=MEMT[k];return '<div class="mt'+(k===tier?" on":"")+'"><b>'+t("mem.t."+k)+'</b><em class="num">'+fmtK(X.cap)+'</em><span>'+t("mem.d."+k)+'</span></div>'}).join("")+'</div>'+
  (tier==="free"?'<button class="btn btn-p btn-block" data-paysheet="mem">🧠 '+t("mem.toPlus")+'</button>':'')+
  (tier!=="deep"?'<button class="btn btn-g btn-block" style="margin-top:8px" data-deepmem="'+th.id+'">'+t("mem.deepOne",{p:DEEP_PRICE})+'</button><button class="btn btn-q btn-block" style="margin-top:6px" data-buymax="1">'+t("mem.max")+'</button>':'<p class="xs faint" style="text-align:center;margin-top:8px">'+t("mem.deepOn")+'</p>'))}
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-memsheet]")){memSheet();return}
 if(x=e.target.closest("[data-deepmem]")){if(!spend(DEEP_PRICE,"mem"))return;S.deepMem=S.deepMem||{};S.deepMem[x.dataset.deepmem]=1;save();toast(t("mem.deepDone"));memSheet();if(typeof renderChat==="function")renderChat();return}
 if(e.target.closest("[data-buymax]")){S.plus=true;S.plusMax=true;S.plusSince=Date.now();save();toast(t("mem.maxOn"));memSheet();return}});
/* chip in the chat status row + menu entry + one-time "he's starting to forget" nudge at 85% */
renderChat=(function(orig){return function(){orig.apply(this,arguments);const th=S.threads[curT];if(!th)return;const st=$(".status");if(st&&!st.querySelector(".memchip"))st.insertAdjacentHTML("beforeend",memChip(th))}})(renderChat);
/* 2026-10-27：从「包一层 menuSheet」搬成登记一块（top）。HTML 一字未改。 */
SHEET.add("menu","app11_memory.js","top",function(){return '<button class="opt" data-memsheet="1"><span class="ic">🧠</span><span class="grow"><b>'+t("mem.h")+'</b><span>'+t("mem.menuS")+'</span></span></button>'});
appendMsg=(function(orig){return function(th,m){orig.apply(this,arguments);if(!th||th.memWarn||memTier(th)==="deep")return;const T=MEMT[memTier(th)];if(memUsed(th)>=T.cap*.85){th.memWarn=1;th.msgs.push({who:"sys",k:"card",title:"🧠 "+t("mem.warnH",{n:first((ch(mainOf(th))||{n:""}).n)}),txt:t("mem.warnS"),btn:t("mem.warnB"),act:"mem|",at:Date.now()});save();if(curT===th.id)renderChat()}}})(appendMsg);
document.addEventListener("click",e=>{const x=e.target.closest("[data-cardbtn]");if(!x)return;const th=S.threads[curT],m=th&&th.msgs[+x.dataset.cardbtn];if(m&&m.act==="mem|"){e.stopImmediatePropagation();memSheet()}},true);
Object.assign(I18N.en,{"mem.h":"Memory space","mem.menuS":"How much he remembers","mem.used":"used","mem.t.free":"Free","mem.t.plus":"MIRU+","mem.t.deep":"Deep","mem.fixed":"always","mem.on":"on","mem.none":"Nothing yet — make a moment he'll keep.",
 "mem.state.ok":"He remembers everything so far","mem.state.near":"Almost full","mem.state.full":"Full — he's forgetting the beginning","mem.forgot":"{who} no longer remembers your first {n} messages.","mem.explain":"When it fills up, he forgets the earliest things you shared.",
 "mem.l1":"Persona","mem.l1S":"Who he is — his past, his rules. Never forgotten.","mem.l2":"Key moments","mem.keep":"keeps {n}","mem.l3":"Between {a} & {b}","mem.l3S":"What the two of them remember about each other.",
 "mem.d.free":"~20 messages","mem.d.plus":"60 messages + key moments across stories","mem.d.deep":"150 messages · remembers everything",
 "mem.toPlus":"Get 32K memory with MIRU+","mem.deepOne":"Deep memory for this story · 💎 {p} · forever","mem.max":"MIRU+ Max · 128K for every story · $19.99/mo","mem.deepOn":"Deep memory is on — he remembers everything.","mem.deepDone":"Deep memory on for this story","mem.maxOn":"MIRU+ Max on",
 "mem.warnH":"{n} is starting to forget","mem.warnS":"Your memory space is almost full. Soon he won't remember how this started.","mem.warnB":"Keep his memories","pay.why.mem":"Don't let him forget"});
Object.assign(I18N.zh,{"mem.h":"记忆空间","mem.menuS":"他能记住多少","mem.used":"已用","mem.t.free":"免费","mem.t.plus":"MIRU+","mem.t.deep":"深度记忆","mem.fixed":"永久","mem.on":"已开启","mem.none":"还没有——制造一个他会记住的瞬间吧。",
 "mem.state.ok":"他记得到目前为止的一切","mem.state.near":"快满了","mem.state.full":"已满——他开始忘记最初的事","mem.forgot":"{who} 已经不记得你们最早的 {n} 条对话了。","mem.explain":"记忆空间满了之后，他会先忘掉你们最早聊过的事。",
 "mem.l1":"预设","mem.l1S":"他是谁、他的过去和底线。永远不会忘。","mem.l2":"增强记忆","mem.keep":"可记 {n} 条","mem.l3":"{a} 和 {b} 之间","mem.l3S":"他们俩对彼此的记忆。",
 "mem.d.free":"约 20 条对话","mem.d.plus":"60 条对话 + 跨故事关键记忆","mem.d.deep":"150 条对话 · 什么都记得",
 "mem.toPlus":"开通 MIRU+ · 记忆扩到 32K","mem.deepOne":"为这段故事开启深度记忆 · 💎 {p} · 永久","mem.max":"MIRU+ Max · 所有故事 128K · $19.99/月","mem.deepOn":"深度记忆已开启——他什么都记得。","mem.deepDone":"这段故事已开启深度记忆","mem.maxOn":"已开通 MIRU+ Max",
 "mem.warnH":"{n} 开始忘记了","mem.warnS":"记忆空间快满了。再聊下去，他会不记得你们是怎么开始的。","mem.warnB":"留住他的记忆","pay.why.mem":"别让他忘了你"});
