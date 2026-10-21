/* ================= v2.4 · ENTRY = "watch a scene, then step into it" + a layered taste system =================
   Product feedback: the first screen shouldn't be a questionnaire. New first run:
     age gate → pick a pairing (one tap) → THREE hook dramas side by side (swipe left/right). Each preview plays ~15s and freezes on the
     tensest frame with "接下来，你想怎么演？" → 🎭 be him · 🙋 walk in as yourself · 🎬 direct / watch. No video? A poster + "watch the short".
   Tags no longer mix levels on one wall. Five layers, each with its own rule:
     配对 (one) · 世界 (≤2) · 关系走向 (≤3) · 他是什么样的人 (≤2) · 情绪 (≤2) + 尺度 (one) · 不想看 (≤3, hides stories)
   Occupations and species (CEO, vampire…) are story facts → they live in search, not in the taste picker.
   The picker opens from the hook screen, the home filter button and the Me page; it maps onto the existing story tags,
   so recommendations, the home feed and the old matcher all keep working. */
/* US romance-reader vocabulary (BookTok / Kindle / AO3 style): trope names stay in English; the Chinese line under each is only a gloss. */
const TAX={
 trope:{t:["Tropes","你爱的桥段"],max:4,items:[["e2l","Enemies to Lovers","宿敌变恋人",["Enemies to Lovers","Rivals to Lovers"]],["r2l","Rivals to Lovers","对手变恋人",["Rivals to Lovers"]],["second","Second Chance","破镜重圆",["Second Chance"]],
  ["fake","Fake Dating","假戏真做",["Fake Dating"]],["arranged","Arranged Marriage","先婚后爱",["Arranged Marriage"]],["prox","Forced Proximity","被迫同处",["Forced Proximity","Roommates","Neighbors","Storm Night"]],["bed","Only One Bed","只有一张床",["Forced Proximity","Storm Night"]],
  ["slow","Slow Burn","慢热",["Slow Burn"]],["pine","Mutual Pining","双向暗恋",["Mutual Pining","Secret Admirer"]],["f2l","Friends to Lovers","朋友变恋人",["Friends to Lovers"]],["forbid","Forbidden Love","禁忌之恋",["Forbidden"]],
  ["guard","Bodyguard Romance","保镖",["Bodyguard","Protective"]],["tdie","Touch Him and Die","碰他者死",["Protective","Bodyguard"]],["hc","Hurt/Comfort","伤痛与治愈",["Hurt/Comfort"]],["ff","Found Family","找到家人",["Found Family"]],["ld","Long Distance","异地",["Long Distance"]],["office","Office Romance","职场恋爱",["Coworkers"]]]},
 him:{t:["His Type","他是什么样的人"],max:2,items:[["gr","Golden Retriever","阳光忠犬",["Golden Retriever"]],["gs","Grumpy x Sunshine","暴躁×阳光",["Grumpy x Sunshine"]],["cold","Ice Prince","冰山",["Cold Prince"]],["mg","Morally Grey","灰色地带",["Morally Grey","Mafia","Bratva"]],
  ["soft","Soft Giant","温柔大块头",["Soft Giant"]],["prot","Protector","守护型",["Protective","Bodyguard"]],["bil","Billionaire","亿万富翁",["Billionaire","Secret Heir"]],["genius","Genius","天才",["Genius"]],["bad","Bad Boy","坏男孩",["Morally Grey","Mafia"]]]},
 vibe:{t:["Vibes","情绪"],max:2,items:[["cozy","Sweet & Cozy","甜 · 治愈",["Cozy","Slice of Life","Rom-Com"]],["romcom","Rom-Com","轻松搞笑",["Rom-Com"]],["angst","Angst","虐",["Bittersweet","Hurt/Comfort","Drama"]],["dark","Dark Romance","暗黑",["Dark Romance","Mafia","Bratva"]],["thrill","Suspense","悬疑刺激",["Mystery","Dark Romance"]]]},
 world:{t:["Setting","世界"],max:2,items:[["contemp","Contemporary","都市",["Coworkers","Small Town","Apartment Life","Hospital","Radio","Broadway","Kitchen","Bakery","Jazz Club","Billionaire"]],["college","College","校园",["Campus","College Football","Military Academy","Roommates"]],
  ["sports","Sports Romance","体育",["Hockey","F1","Esports","Roller Derby","College Football"]],["fantasy","Romantasy & Paranormal","奇幻 · 超自然",["Romantasy","Fae","Vampires","Werewolves","Dragons","Ghosts","Castle Life"]],["mafia","Mafia & Crime","黑帮",["Mafia","Bratva","Secret Heir"]],["scifi","Sci-Fi","科幻",["Sci-Fi","Space Station","Androids"]]]}};
const HEATS=[["fluff","Sweet","清水 · 不越界"],["slow","Steamy","暧昧 · 有张力"],["steamy","Spicy 🌶","微辣"]];
const PAIRS=[["bl","M/M","BL"],["bg","M/F","BG"],["gl","F/F","GL"],["all","Any","都可以"]];
const TAXG=["trope","him","vibe","world"];
function taxItem(k){return Object.values(TAX).flatMap(g=>g.items).find(i=>i[0]===k)}
function taxName(k){const it=taxItem(k);return it?it[1]:k}
function taxTags(keys){const out=new Set();Object.values(TAX).forEach(g=>g.items.forEach(([k,,,tags])=>{if((keys||[]).includes(k))tags.forEach(t0=>out.add(t0))}));return [...out]}
function prefs(){const P=S.prefs=S.prefs||{};TAXG.concat(["ex"]).forEach(g=>{if(!Array.isArray(P[g]))P[g]=[]});return P}
function prefSync(){const P=prefs();S.tropes=taxTags(TAXG.flatMap(g=>P[g]));save()}
function prefExcluded(w){const ex=taxTags(prefs().ex);return ex.length&&(w.tags||[]).some(t0=>ex.includes(t0))}
const _orOK64=orOK;orOK=function(w){return _orOK64(w)&&!(w&&prefExcluded(w))};
/* ---------- the taste sheet ---------- */
let PDRAFT=null,PMODE="sheet";
function prefDraft(){PDRAFT=JSON.parse(JSON.stringify(prefs()));PDRAFT.heat=S.heat||"slow";PDRAFT.or=S.or||"bl"}
function prefSheet(){prefDraft();PMODE="sheet";prefRender()}
function chip(attr,on,ex,a,b){return '<button '+attr+' class="'+(on?"on":"")+(ex?" ex":"")+'"><b>'+esc(a)+'</b>'+(CL()==="zh"&&b?'<small>'+esc(b)+'</small>':'')+'</button>'}
function prefBody(){const zh=CL()==="zh",P=PDRAFT;
 const grp=gk=>{const g=TAX[gk],n=P[gk].length;return '<div class="pf64g"><div class="pf64h"><b>'+g.t[0]+'</b>'+(zh?'<em>'+g.t[1]+'</em>':'')+'<small>'+(zh?"最多 "+g.max+" 个":"pick up to "+g.max)+(n?" · "+n:"")+'</small></div><div class="pf64c">'+
  g.items.map(([k,a,b])=>chip('data-pf="'+gk+'|'+k+'"',P[gk].includes(k),P.ex.includes(k),a,b)).join("")+'</div></div>'};
 return '<div class="pf64g"><div class="pf64h"><b>Pairing</b>'+(zh?'<em>配对</em>':'')+'</div><div class="pf64c">'+PAIRS.map(([k,a,b])=>chip('data-pfor="'+k+'"',P.or===k,0,a,b)).join("")+'</div></div>'+
  TAXG.map(grp).join("")+
  '<div class="pf64g"><div class="pf64h"><b>Spice Level</b>'+(zh?'<em>尺度</em>':'')+'</div><div class="pf64c">'+HEATS.map(([k,a,b])=>chip('data-pfheat="'+k+'"',P.heat===k,0,a,b)).join("")+'</div></div>'+
  '<div class="pf64g"><div class="pf64h"><b>Hard Pass 🚫</b>'+(zh?'<em>不想看</em>':'')+'<small>'+(zh?"最多 3 个 · 含这些的故事不推荐":"up to 3 · hidden from your feed")+'</small></div><div class="pf64c">'+
   Object.values(TAX).flatMap(g=>g.items).map(([k,a,b])=>chip('data-pfex="'+k+'"',P.ex.includes(k),P.ex.includes(k),a,b)).join("")+'</div></div>'}
function prefRender(){const zh=CL()==="zh",keepD=PDRAFT;
 if(PMODE==="page"){const sc=$("#pfPage");const top=sc?sc.scrollTop:0;
  screen("s-ob",'<div class="topbar"><button class="ibtn" id="obBack">'+ic("back")+'</button><div class="progress"><i style="width:66%"></i></div><span class="xs faint num">2 / 3</span></div>'+
   '<div class="scroll pad pf64 pf64page" id="pfPage"><h1 style="font-size:24px;margin:0">'+(zh?"你爱看什么？":"What are you into?")+'</h1><p class="dim sm" style="margin:6px 0 0">'+(zh?"选几个你最爱的桥段和他的类型，下一步马上给你放对应的短剧。":"Pick a few tropes and his type — your first dramas play right after.")+'</p>'+prefBody()+'</div>'+
   '<div class="startbar"><div class="row" style="gap:8px"><button class="btn btn-g" data-pfskip="1">'+(zh?"跳过":"Skip")+'</button><button class="btn btn-p grow" data-pfsave="1">'+(zh?"给我推荐 ▶":"Show my picks ▶")+'</button></div></div>');show("s-ob");const sc2=$("#pfPage");if(sc2)sc2.scrollTop=top;PDRAFT=keepD;return}
 sheet('<div class="pf64"><h2>'+(zh?"你的口味":"Your taste")+'</h2><p class="xs faint">'+(zh?"用美国读者熟悉的标签分层选；随时可以改。":"Pick by layer. Change anytime.")+'</p>'+prefBody()+
  '<div class="row" style="gap:8px;margin-top:14px"><button class="btn btn-g" data-pfreset="1">'+(zh?"重置":"Reset")+'</button><button class="btn btn-p grow" data-pfsave="1">'+(zh?"应用":"Apply")+'</button></div></div>');PDRAFT=keepD}
document.addEventListener("click",e=>{let x;if(!PDRAFT&&!e.target.closest("[data-pfopen],[data-pfskip]"))return;const zh=CL()==="zh";
 if(e.target.closest("[data-pfopen]")){prefSheet();return}
 if(x=e.target.closest("[data-pf]")){const [g,k]=x.dataset.pf.split("|"),L=PDRAFT[g];const i=L.indexOf(k);if(i>=0)L.splice(i,1);else{if(L.length>=TAX[g].max){toast(zh?"这一组最多 "+TAX[g].max+" 个":"Up to "+TAX[g].max);return}L.push(k);PDRAFT.ex=PDRAFT.ex.filter(z=>z!==k)}prefRender();return}
 if(x=e.target.closest("[data-pfex]")){const k=x.dataset.pfex,L=PDRAFT.ex,i=L.indexOf(k);if(i>=0)L.splice(i,1);else{if(L.length>=3){toast(zh?"最多排除 3 个":"Hide up to 3");return}L.push(k);TAXG.forEach(g=>PDRAFT[g]=PDRAFT[g].filter(z=>z!==k))}prefRender();return}
 if(x=e.target.closest("[data-pfor]")){PDRAFT.or=x.dataset.pfor;prefRender();return}
 if(x=e.target.closest("[data-pfheat]")){PDRAFT.heat=x.dataset.pfheat;prefRender();return}
 if(e.target.closest("[data-pfreset]")){PDRAFT={trope:[],him:[],vibe:[],world:[],ex:[],heat:"slow",or:PDRAFT.or};prefRender();return}
 if(e.target.closest("[data-pfsave]")){const {heat,or}=PDRAFT;delete PDRAFT.heat;delete PDRAFT.or;S.prefs=PDRAFT;S.heat=heat;S.or=or;PDRAFT=null;prefSync();S.tasteSet=1;save();const wasPage=PMODE==="page";PMODE="sheet";closeSheet();
  if(wasPage||(!S.ob&&$("#s-ob")&&!$("#s-ob").hidden)){obStep=5;renderHook();return}toast(zh?"已按你的口味重新推荐":"Updated to your taste");try{if(typeof renderTab==="function")renderTab(S.lastTab||"home")}catch(_){}return}
 if(e.target.closest("[data-pfskip]")){PDRAFT=null;PMODE="sheet";obStep=5;renderHook();return}},true);
/* close = drop the draft */
const _closeSheet64=closeSheet;closeSheet=function(){PDRAFT=null;return _closeSheet64.apply(this,arguments)};
/* home: a filter button next to search; Me: a taste row */
const _renderHome64=renderHome;renderHome=function(v){const r=_renderHome64.apply(this,arguments);try{if(!v.querySelector("[data-pfopen]")){const s=v.querySelector("[data-hsearch],[data-search],.hsearch,.srch");const btn='<button class="ibtn pf64btn" data-pfopen="1" aria-label="filter">⚙︎</button>';
  if(s)s.insertAdjacentHTML("beforebegin",btn);else{const top=v.querySelector(".hftop,.htop,.feedtop,.hchips");if(top)top.insertAdjacentHTML("beforeend",btn)}}}catch(_){}return r};
const _renderMe64=renderMe;renderMe=function(v){const r=_renderMe64.apply(this,arguments);try{if(!v.querySelector(".pf64me")){const P=prefs(),chips=TAXG.flatMap(g=>P[g]).map(taxName);const zh=CL()==="zh";
  const h='<button class="card pf64me" data-pfopen="1"><div class="row"><div class="grow"><b>🎯 '+(zh?"我的口味":"My taste")+'</b><p class="xs faint">'+(chips.length?esc(chips.slice(0,5).join(" · ")):(zh?"还没选 · 选了推荐会更准":"Not set — pick to sharpen recommendations"))+(P.ex.length?" · 🚫 "+P.ex.length:"")+'</p></div><span>›</span></div></button>';
  const anchor=v.querySelector(".ttscard")||v.querySelector(".lccard");if(anchor)anchor.insertAdjacentHTML("afterend",h);else{const sc=v.querySelector(".scroll");if(sc)sc.insertAdjacentHTML("afterbegin",h)}}}catch(_){}return r};
/* ---------- first run: hook dramas instead of the questionnaire ---------- */
function hookClips(wid){const cl=(typeof CLIPS!=="undefined"&&CLIPS[wid+":1"])||null;if(!cl)return [];if(cl.film)return [cl.film.src];if(cl.full)return [cl.full.src];return [0,1].map(i=>cl[i]&&cl[i].src).filter(Boolean)}
function firstClip(wid){const cl=(typeof CLIPS!=="undefined"&&CLIPS[wid+":1"])||null;if(!cl)return null;if(cl.film)return cl.film.src;if(cl.full)return cl.full.src;return cl[0]&&cl[0].src||null}
function hookPicks(){const pool=packWorlds().filter(orOK).filter(w=>!w.sample);
 const sc=w=>{let m=0;try{m=obMatch(w).sc}catch(_){}return m+(firstClip(w.id)?1000:0)+(SHORTS[w.id]?200:0)};
 const L=pool.map(w=>[w,sc(w)]).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);const out=[],seen=new Set();
 for(const w of L){const k=(w.tags||[]).slice(0,2).join("|");if(seen.has(k)&&L.length>6)continue;seen.add(k);out.push(w);if(out.length===3)break}return out}
function hookRoles(w){const J=(w.pack&&w.pack.join)||[],zh=CL()==="zh";const lead=J.find(j=>ch(j.as));const side=J.find(j=>j.as==="side");const out=[];
 if(lead)out.push([lead.as,"🎭 "+(zh?"成为 ":"Be ")+first(ch(lead.as).n),zh?"你说他的台词，替他做选择":"Say his lines, make his choices"]);
 out.push([side?"side":(lead?lead.as:"side"),"🙋 "+(zh?"我自己走进这场戏":"Walk in as yourself"),zh?"以你自己的身份，他们会回应你":"As you — they'll answer you"]);
 out.push(["watch","🎬 "+(zh?"我来导演":"Direct it"),zh?"旁观，随时插手改戏":"Watch, and step in to change the scene anytime"]);return out}
function hookHTML(){const zh=CL()==="zh",W0=hookPicks();
 const slide=w=>{const src=firstClip(w.id),poster=artSrc(w.cover?w.id:w.cast[0]);
  return '<section class="hk64s" data-hkw="'+w.id+'">'+(src?'<video class="hk64v" muted playsinline webkit-playsinline autoplay preload="'+(W0.indexOf(w)===0?"auto":"metadata")+'" poster="'+poster+'" src="'+src+'"></video>':'<img class="hk64v kb" src="'+poster+'" alt="">')+'<div class="hk64veil"></div>'+
   '<div class="hk64bot"><div class="hk64cap"><div class="hk64tags">'+(w.tags||[]).slice(0,3).map(t0=>'<em>'+esc(t0)+'</em>').join("")+'</div><h2>'+esc(Lz(w.title))+'</h2><p>“'+esc(Lz(w.hook))+'”</p></div>'+
   '<div class="hk64ask"'+(src?' hidden':'')+'><b>'+(zh?"接下来，你想怎么演？":"What happens next is up to you.")+'</b>'+hookRoles(w).map(([as,a,b])=>'<button data-hkrole="'+w.id+'|'+as+'"><span>'+esc(a)+'</span><small>'+esc(b)+'</small></button>').join("")+
    (SHORTS[w.id]?'<button class="hk64full" data-hkfull="'+w.id+'">▶ '+(zh?"先看完这段短剧":"Watch the full short first")+'</button>':'')+'</div></div>'+
   (src?'<div class="hk64bar"><i></i></div><button class="hk64tap" data-hktap="1">▶</button><div class="hk64spin"></div>':'')+'</section>'};
 return '<div class="hk64"><div class="hk64top"><span>'+(zh?"为你挑了 "+W0.length+" 部 · 左右滑":W0.length+" picks for you · swipe")+'</span><button data-hkmute="1">'+(HK.muted?"🔇":"🔊")+'</button><button data-pfopen="1">⚙︎ '+(zh?"口味":"Taste")+'</button><button data-obskip="1">'+(zh?"先逛逛":"Browse")+' ›</button></div>'+
  '<div class="hk64rail" id="hkRail">'+W0.map(slide).join("")+'</div><div class="hk64dots">'+W0.map((_,i)=>'<i class="'+(i?"":"on")+'"></i>').join("")+'</div></div>'}
const HK={muted:true,i:0,tm:null};
function hookPlay(i){const R=$("#hkRail");if(!R)return;HK.i=i;const S0=[...R.children];
 S0.forEach((s,j)=>{const v=s.querySelector("video");if(!v)return;if(j!==i){try{v.pause()}catch(_){}return}
  const ask=s.querySelector(".hk64ask"),bar=s.querySelector(".hk64bar i");if(ask&&!ask.hidden)return;
  const list=hookClips(s.dataset.hkw);let ci=0;s.classList.add("loading");
  const freeze=()=>{try{v.pause()}catch(_){}s.classList.remove("loading");if(ask)ask.hidden=false;s.classList.add("frozen")};
  const tryPlay=()=>{v.muted=HK.muted;const p=v.play();if(p&&p.catch)p.catch(()=>{if(!HK.muted){HK.muted=true;v.muted=true;const p2=v.play();if(p2&&p2.catch)p2.catch(()=>s.classList.add("needtap"))}else s.classList.add("needtap")})};
  v.onplaying=()=>{s.classList.remove("loading","needtap")};v.onwaiting=()=>s.classList.add("loading");
  v.onended=()=>{ci++;if(list[ci]){v.src=list[ci];tryPlay()}else freeze()};
  v.onerror=()=>{if(list[ci+1]){ci++;v.src=list[ci];tryPlay();return}s.classList.remove("loading");v.outerHTML='<img class="hk64v kb" src="'+(v.getAttribute("poster")||"")+'" alt="">';if(ask)ask.hidden=false};
  v.ontimeupdate=()=>{const el=ci*8+v.currentTime;if(bar)bar.style.width=Math.min(100,el/15*100)+"%";if(el>=15)freeze()};
  if(v.readyState===0)try{v.load()}catch(_){}try{v.currentTime=0}catch(_){}tryPlay()});
 /* warm up the next slide's video */
 const nx=S0[i+1]&&S0[i+1].querySelector("video");if(nx&&nx.preload!=="auto"){nx.preload="auto";try{nx.load()}catch(_){}}
 document.querySelectorAll(".hk64dots i").forEach((d,j)=>d.classList.toggle("on",j===i))}
function hookWire(){const R=$("#hkRail");if(!R)return;let t0=null;R.addEventListener("scroll",()=>{clearTimeout(t0);t0=setTimeout(()=>{const i=Math.round(R.scrollLeft/R.clientWidth);if(i!==HK.i)hookPlay(i)},120)},{passive:true});setTimeout(()=>hookPlay(0),200)}
function renderHook(){screen("s-ob",hookHTML());show("s-ob");hookWire()}
const _renderOB64=renderOB;
renderOB=function(){if(obStep>=2&&!S.ob){if(obStep===2||!S.tasteSet&&obStep<5){obStep=2;prefDraft();PMODE="page";prefRender();return}obStep=5;renderHook();return}return _renderOB64.apply(this,arguments)};
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-hkmute]")){HK.muted=!HK.muted;const b=e.target.closest("[data-hkmute]");b.textContent=HK.muted?"🔇":"🔊";const v=document.querySelectorAll(".hk64v")[HK.i];if(v&&v.tagName==="VIDEO")v.muted=HK.muted;return}
 if(x=e.target.closest("[data-hkrole]")){const [wid,as]=x.dataset.hkrole.split("|");document.querySelectorAll(".hk64v").forEach(v=>{try{v.pause()}catch(_){}});S.ob=true;save();startApp();setTimeout(()=>packStart(wid,as),60);return}
 if(x=e.target.closest("[data-hkfull]")){S.ob=true;save();startApp();setTimeout(()=>openShort(x.dataset.hkfull),60);return}
 if(x=e.target.closest("[data-hktap]")){const s=x.closest(".hk64s"),v=s.querySelector("video");HK.muted=false;if(v){v.muted=false;v.play().then(()=>s.classList.remove("needtap")).catch(()=>{v.muted=true;v.play().catch(()=>{})})}const m=$("[data-hkmute]");if(m)m.textContent="🔊";return}
 if(e.target.closest(".hk64s video")){const v=e.target.closest(".hk64s").querySelector("video");HK.muted=false;v.muted=false;const m=$("[data-hkmute]");if(m)m.textContent="🔊";return}
 if(e.target.closest("#obBack")&&!S.ob&&(obStep===5||obStep===2)){if(obStep===5){obStep=2;prefDraft();PMODE="page";prefRender();e.stopImmediatePropagation();return}obStep=1;PMODE="sheet";PDRAFT=null;renderOB();e.stopImmediatePropagation();return}},true);
(function(){const st=document.createElement("style");st.textContent=`
#s-ob .hk64{position:fixed;inset:0;background:#000;display:flex;flex-direction:column}
.hk64top{position:absolute;top:0;left:0;right:0;z-index:3;display:flex;gap:8px;align-items:center;padding:calc(env(safe-area-inset-top) + 12px) 14px 10px;background:linear-gradient(#000a,transparent)}
.hk64top span{flex:1;font-size:12.5px;color:#ddd}.hk64top button{background:rgba(255,255,255,.12);border:0;color:#fff;border-radius:999px;padding:7px 11px;font-size:12.5px}
.hk64rail{flex:1;display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}.hk64rail::-webkit-scrollbar{display:none}
.hk64s{position:relative;flex:0 0 100%;height:100%;scroll-snap-align:center;overflow:hidden}
.hk64v{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.hk64v.kb{animation:hkkb 14s ease-in-out infinite alternate}@keyframes hkkb{to{transform:scale(1.12) translateY(-2%)}}
.hk64veil{position:absolute;inset:0;background:linear-gradient(transparent 40%,#000d 85%)}.frozen .hk64v{filter:brightness(.55) saturate(1.1)}
.hk64bot{position:absolute;left:14px;right:14px;bottom:calc(env(safe-area-inset-bottom) + 34px);display:flex;flex-direction:column;gap:12px}.hk64cap{color:#fff;padding:0 2px}
.hk64cap h2{font-size:24px;margin:6px 0 6px;line-height:1.2}.hk64cap p{font-size:14px;color:#e8dde6;line-height:1.5;margin:0}.hk64tags{display:flex;gap:6px;flex-wrap:wrap}.hk64tags em{font-style:normal;font-size:11px;padding:3px 8px;border-radius:999px;background:rgba(255,255,255,.14)}
.hk64ask[hidden]{display:none!important}.hk64ask{display:flex;flex-direction:column;gap:8px;animation:hkin .4s}@keyframes hkin{from{opacity:0;transform:translateY(16px)}}
.hk64ask b{color:#fff;font-size:18px;text-align:center;margin-bottom:4px;text-shadow:0 2px 12px #000}
.hk64ask button{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:12px 14px;border-radius:16px;border:1px solid rgba(255,255,255,.22);background:rgba(20,16,28,.72);backdrop-filter:blur(10px);color:#fff;text-align:left}
.hk64ask button span{font-size:15.5px;font-weight:800}.hk64ask button small{font-size:11.5px;color:#C9BFD6}.hk64ask button:first-of-type{border-color:#F0B77E;background:linear-gradient(135deg,rgba(240,183,126,.3),rgba(238,111,151,.28))}
.hk64ask .hk64full{align-items:center;background:none;border:0;color:#C9BFD6;font-size:12.5px;padding:4px}
.hk64bar{position:absolute;left:16px;right:16px;bottom:calc(env(safe-area-inset-bottom) + 30px);height:3px;background:rgba(255,255,255,.2);border-radius:3px;overflow:hidden}.hk64bar i{display:block;height:100%;width:0;background:#F0B77E}.frozen .hk64bar{display:none}
.hk64tap{display:none;position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);width:76px;height:76px;border-radius:50%;border:0;background:rgba(0,0,0,.45);color:#fff;font-size:30px;z-index:2}.needtap .hk64tap{display:block}
.hk64spin{display:none;position:absolute;left:50%;top:40%;width:42px;height:42px;margin:-21px;border-radius:50%;border:3px solid rgba(255,255,255,.25);border-top-color:#fff;animation:hkspin .9s linear infinite}.loading:not(.frozen):not(.needtap) .hk64spin{display:block}@keyframes hkspin{to{transform:rotate(360deg)}}
.hk64dots{position:absolute;bottom:calc(env(safe-area-inset-bottom) + 14px);left:0;right:0;display:flex;gap:6px;justify-content:center;z-index:3}.hk64dots i{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.35)}.hk64dots i.on{background:#fff;width:18px;border-radius:3px}
.pf64 h2{margin:0 0 4px}.pf64g{margin-top:14px}.pf64h{display:flex;align-items:baseline;gap:8px}.pf64h b{font-size:14.5px}.pf64h em{font-style:normal;font-size:12px;color:#C9BFD6}.pf64c button b{font-size:13px;font-weight:700}.pf64c button small{font-size:10.5px;color:#9C93A8}.pf64page{padding-bottom:110px!important}.pf64h small{font-size:11px;color:#9C93A8}
.pf64c{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px}.pf64c button{display:flex;flex-direction:column;align-items:flex-start;gap:1px;padding:7px 12px;border-radius:999px;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.04);color:#ddd;font-size:13px}
.pf64c button.on{border-color:#F0B77E;background:rgba(240,183,126,.16);color:#F6D3AE}.pf64c button.on.ex{border-color:#EE6F6F;background:rgba(238,111,111,.14);color:#FFC4C4}.pf64c button.ex:not(.on){opacity:.4}
.pf64btn{font-size:17px}.pf64me{display:block;width:100%;text-align:left;margin-bottom:12px}`;document.head.appendChild(st)})();
