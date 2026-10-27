/* ================= v4.1 · VOICE FIXES + VOICE BILLING =================
   1) Scripted phone calls (pack "call" stops) were silent with server voices: each line moved on after its reading time
      (~1.5s) and speak() cancelled the previous line before its audio (2–3s to synthesise) arrived. Now every line of the
      call is fetched up front and the next line waits for the voice to finish.
   2) One shared <audio> element, unlocked by the first tap, so phones (iOS Safari) let later voice lines play.
   3) Voice billing by the AI-cost rule: Qwen-TTS ¥0.8 / 10,000 characters → 1💎 (≈$0.20) per 2,500 newly synthesised
      characters (≈ 80 lines). Lines already cached (official stories, repeats) and the device voice are free.
      With no diamonds left the voice quietly switches to the device voice — the story never stops. */
const TTS_CHARS_PER_GEM=2500;
const TTSEL=new Audio();TTSEL.preload="auto";let TTS_UNLOCKED=false;
document.addEventListener("pointerdown",()=>{if(TTS_UNLOCKED)return;TTS_UNLOCKED=true;try{TTSEL.src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";TTSEL.play().catch(()=>{})}catch(_){}},true);
function ttsZh(){return (typeof CL==="function"?CL():S.lang)==="zh"}
/* count newly synthesised characters; charge 1💎 per TTS_CHARS_PER_GEM */
function ttsBill(text){const n=String(text||"").replace(/\s/g,"").length;if(!n)return;S.ttsChars=(S.ttsChars||0)+n;
 if(S.ttsChars<TTS_CHARS_PER_GEM){save();return}
 if(S.keys>=1){S.ttsChars-=TTS_CHARS_PER_GEM;S.keys-=1;save();if(typeof keysChip==="function")try{keysChip()}catch(_){}
  toast(ttsZh()?"🎙 真人配音 −1💎（约 80 句）· 剩 "+S.keys:"🎙 Voice −1💎 (~80 lines) · "+S.keys+" left")}
 else{S.ttsChars=TTS_CHARS_PER_GEM;S.ttsMode="device";save();toast(ttsZh()?"钻石不足，配音已切换为设备语音（免费）":"Out of diamonds — switched to the free device voice")}}
/* fetch with billing (only when the line wasn't in memory yet) */
const _ttsFetch86=ttsFetch;
ttsFetch=function(text,id){const k=ttsKey(text,id),had=TTS.mem.has(k)||TTS.inflight.has(k);const p=_ttsFetch86(text,id);
 if(!had)p.then(()=>{if(!(TTS.billed=TTS.billed||new Set()).has(k)){TTS.billed.add(k);ttsBill(String(text).replace(/[*()（）]/g,"").replace(/^📞\s*/,""))}}).catch(()=>{});return p};
/* speak through the shared element */
speak=function(text,id,onend){try{
 if(!ttsOn()||!ttsSpeakable(text)||(typeof recorded==="function"&&recorded(text,id)))return _speak62(text,id,onend);
 stopVoice();const my=(TTS.seq=(TTS.seq||0)+1);let done=false;
 const fallback=()=>{if(done||TTS.seq!==my)return;done=true;_speak62(text,id,onend)};
 const tm=setTimeout(fallback,TTS.mem.has(ttsKey(text,id))?1500:8000);
 ttsFetch(text,id).then(u=>{if(done||TTS.seq!==my)return;done=true;clearTimeout(tm);const a=TTSEL;a.onended=()=>{if(onend)onend()};a.onerror=()=>{if(onend)onend()};
  a.src=u;AUD_CUR=a;a.play().catch(()=>{const b=new Audio(u);AUD_CUR=b;b.onended=a.onended;b.play().catch(()=>{if(onend)onend()})})}).catch(()=>{clearTimeout(tm);fallback()});
}catch(_){return _speak62(text,id,onend)}};
/* scripted calls: prefetch every line, then let the voice set the pace */
stopCallRun=function(th,d){return new Promise(res=>{const cid=d.cid||mainOf(th),c=ch(cid),lines=d.lines.map(x=>Array.isArray(x)?x:[cid,x]);let i=0,done=false;const t0=Date.now();
 const who=w=>ch(w)?w:cid;
 if(ttsOn())lines.forEach(([w,x])=>{if(ttsSpeakable(x))ttsFetch(x,who(w)).catch(()=>{})});
 const el=document.createElement("div");el.className="callv stcallv";
 el.innerHTML='<div class="cv-bg" style="background-image:url('+artSrc(cid)+')"></div><div class="cv-veil"></div><div class="cv-top"><b>'+esc(c.n)+'</b><span id="scT">00:00</span></div><div class="cv-av">'+avatar(cid,120)+'<div class="cv-wave on"><i></i><i></i><i></i><i></i><i></i></div></div><p class="cv-line" id="scL">…</p><p class="xs" style="text-align:center;opacity:.6;margin-top:6px">'+t("st.callTap")+'</p><div class="cv-bot"><button class="cv-b end" data-scend="1">✕<small>'+t("call.end")+'</small></button></div>';
 ($("#dev")||document.body).appendChild(el);const tk=setInterval(()=>{const s=Math.floor((Date.now()-t0)/1000),e=el.querySelector("#scT");if(e)e.textContent=String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0")},1000);
 let tm=null;const fin=()=>{if(done)return;done=true;clearInterval(tk);clearTimeout(tm);try{stopVoice()}catch(_){}el.remove();const sec=Math.round((Date.now()-t0)/1000);
  appendMsg(th,{who:"sys",k:"card",title:"📞 "+t("st.callLog",{n:first(c.n)}),txt:String(Math.floor(sec/60))+":"+String(sec%60).padStart(2,"0"),at:Date.now()});
  lines.slice(0,i).forEach(([w,x])=>appendMsg(th,{who:who(w),k:"say",txt:"📞 "+x,at:Date.now()}));save();res()};
 const next=()=>{if(done)return;clearTimeout(tm);if(i>=lines.length){fin();return}const [w,x]=lines[i++];const L=el.querySelector("#scL");if(L)L.textContent=x;
  let ended=false;const go=()=>{if(ended)return;ended=true;clearTimeout(tm);tm=setTimeout(next,450)};try{speak(x,who(w),go)}catch(_){}
  tm=setTimeout(go,ttsOn()?Math.max(readMs({txt:x})+400,11000):readMs({txt:x})+400)};
 el.addEventListener("click",e=>{if(e.target.closest("[data-scend]")){fin();return}try{stopVoice()}catch(_){}next()});next()})};
/* 4) per-bubble tools: a small 🔊 read-aloud and 🖼 picture button in the bottom-right corner of every character bubble */
function bt86Btns(i){return '<span class="bt86"><button data-b86="play|'+i+'" aria-label="'+esc(t("msg.play"))+'">🔊</button><button data-b86="snap|'+i+'" aria-label="'+esc(t("msg.img"))+'">🖼</button></span>'}
function bt86Decorate(root){try{const th=S.threads[curT];if(!th||!root)return;
 root.querySelectorAll('.m-row:not(.me)[data-mi]').forEach(row=>{const i=+row.dataset.mi,m=th.msgs[i];if(!m||!m.txt||m.locked||!ch(m.who)||m.who==="me")return;
  const bub=row.querySelector(".bub");if(!bub||bub.querySelector(".bt86"))return;bub.insertAdjacentHTML("beforeend",bt86Btns(i))});
 root.querySelectorAll('.m-box[data-mi]').forEach(bx=>{const i=+bx.dataset.mi,m=th.msgs[i];if(!m||!m.parts||!m.parts.length||bx.querySelector(".bt86"))return;bx.insertAdjacentHTML("beforeend",bt86Btns(i))})}catch(_){}}
/* clicks: capture phase, so the bubble's own tap (open tools) doesn't swallow them */
/* boxes are often grouped at render time, so read exactly what is on screen */
function bt86DomParts(el){const th=S.threads[curT],cast=(th&&th.cast)||[];const who=nm=>{nm=String(nm||"").replace(/[✱💭·*]/g,"").trim().split(/\s+/)[0];const id=cast.find(c=>ch(c)&&first(ch(c).n)===nm)||Object.keys(S.mine&&S.mine.chars||{}).find(c=>ch(c)&&first(ch(c).n)===nm);return id||"n"};
 return [...el.querySelectorAll("p")].filter(p=>p.offsetParent!==null).map(p=>{const tag=p.querySelector("b,span.mt,span.tpa,span.tpt,span[class^=tp]");const txt=(p.innerText||"").replace(tag?tag.innerText:"","").trim();return {who:tag?who(tag.innerText.split("·")[0]):"n",txt}}).filter(x=>x.txt)}
function bt86Parts(m){return m.parts?m.parts.filter(p=>p&&p.txt).map(p=>({who:p.who==="n"||!ch(p.who)?"n":p.who,txt:String(p.txt)})):[{who:m.who,txt:String(m.txt||"")}]}
window.addEventListener("click",e=>{const x=e.target.closest("[data-b86]");if(!x)return;e.preventDefault();e.stopImmediatePropagation();
 const [a,i]=x.dataset.b86.split("|"),th=S.threads[curT],m=th&&th.msgs[+i];if(!m)return;
 const box=x.closest(".m-box");if(a==="play"){const P=box?bt86DomParts(box):bt86Parts(m);let k=0;const my=(TTS.seq86=(TTS.seq86||0)+1);const nx=()=>{if(TTS.seq86!==my||k>=P.length)return;const p=P[k++];speak(p.txt,p.who,nx)};nx();return}
 if(a==="snap"){if(box||m.parts){const P=box?bt86DomParts(box):bt86Parts(m),c=P.find(p=>p.who!=="n");imgSheet(th,{who:c?c.who:mainOf(th),k:"say",txt:P.map(p=>p.txt).join(" ").slice(0,300),pose:m.pose})}else imgSheet(th,m)}},true);
/* 2026-10-27：从「包 renderChat」搬成钩子（批量迁移之一）。逻辑原样，只是不再包住渲染器。 */
const __body_voicefix86 = function () { bt86Decorate($("#msgs")); };
if (window.UI && typeof window.UI.add === "function") window.UI.add("voicefix86", __body_voicefix86);
else { const _renderChat86 = renderChat; renderChat = function () { const r = _renderChat86.apply(this, arguments); __body_voicefix86(); return r; }; };
(function(){let mo=null;const hook=()=>{const box=$("#msgs");if(!box||box.__bt86)return;box.__bt86=1;mo=new MutationObserver(()=>bt86Decorate(box));mo.observe(box,{childList:true})};setInterval(hook,1500);
 document.addEventListener("click",e=>{if(e.target.closest(".bt86 button"))e.stopPropagation()},false);
 const st=document.createElement("style");st.textContent=`.bt86{display:flex;justify-content:flex-end;gap:3px;margin:3px -6px -5px 0}.m-box .bt86{margin:4px -8px -8px 0}
.bt86 button{width:22px;height:20px;padding:0;border:0;border-radius:6px;background:rgba(255,255,255,.07);font-size:11px;line-height:20px;opacity:.6;cursor:pointer}
.bt86 button:hover,.bt86 button:active{opacity:1;background:rgba(255,255,255,.16)}`;document.head.appendChild(st)})();
/* 5) read-aloud on by default (once), and its 🔊/🔇 switch visible again in the chat header */
(typeof soft==="function"?soft:function(n,f){try{return f()}catch(e){}})("app86_voicefix:L71",function(){if(!S.av86){S.av86=1;S.autoVoice=true;save()}});
(function(){const st=document.createElement("style");st.textContent=`#s-chat.clean .chead .vtog{display:grid!important;place-items:center}`;document.head.appendChild(st)})();
/* 6) regenerate a reply: 3 free a day, then 1💎 (one text-model call ≈ ¥0.01–0.02 → rounded up to 1💎);
      and faster — a redo reuses the memories already recalled for this turn instead of waiting up to 2.5s again */
const RG_FREE=3;
window.addEventListener("click",e=>{const x=e.target.closest("[data-rg73]");if(!x||busy)return;const d=today();S.rgDay=S.rgDay&&S.rgDay.d===d?S.rgDay:{d,n:0};
 if(S.rgDay.n<RG_FREE){S.rgDay.n++;save();const left=RG_FREE-S.rgDay.n;toast(ttsZh()?"↻ 重新生成 · 今天还剩 "+left+" 次免费":"↻ Regenerating · "+left+" free left today");return}
 if(!spend(PRICES.regen||1,"retry")){e.stopImmediatePropagation();e.preventDefault()}},true);
(typeof soft==="function"?soft:function(n,f){try{return f()}catch(e){}})("app86_voicefix:L79",function(){PRICES.regen=1});
reply=(function(orig){return async function(th,ctx,silent){if(typeof REDO73!=="undefined"&&REDO73&&!silent&&typeof m78recall==="function"){const r=m78recall;m78recall=async()=>{};try{return await orig.apply(this,arguments)}finally{m78recall=r}}return orig.apply(this,arguments)}})(reply);
/* 7) longer lines get the real voice too (server accepts 400 chars), and a few failed requests no longer switch to the device voice for 5 minutes */
ttsSpeakable=function(text){const s=String(text||"").replace(/[*()（）\s]/g,"");return s.length>=2&&s.length<=400};
ttsUrl=(function(o){return function(text,id){return o(text,id).replace(/&t=[^&]*$/,"&t="+encodeURIComponent(String(text).replace(/[*()（）]/g,"").replace(/^📞\s*/,"").trim().slice(0,400)))}})(ttsUrl);
setInterval(()=>{if(TTS.off&&TTS.fails<8){TTS.off=false;TTS.fails=0}},20000);
