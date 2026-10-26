/* ================= v2.4 · CHARACTER VOICES — server TTS (IndexTTS2 / your own TTS server) with device-voice fallback =================
   Order for every line: 1) a pre-recorded line in the pack → 2) server TTS (/api/tts on Vercel) → 3) the device voice.
   · Each character gets a stable voice from a bank of adult Mandarin reference speakers (AISHELL-3, Apache-2.0); creators can pick one.
   · Emotion comes from the line itself (angry / sad / afraid / surprised / tender / calm) and is sent as IndexTTS2 emotion weights.
   · Audio is cached on Vercel's CDN (each line synthesised once for everyone) and in memory here; the next lines are prefetched
     while you read, so read-aloud doesn't wait. If the server is slow (>7s) or down, that line falls back to the device voice. */
const TTS_EP=window.MIRU_TTS!==undefined?window.MIRU_TTS:(/\.vercel\.app$/.test(location.hostname)?"/api/tts":(window.MIRU_PROXY?String(window.MIRU_PROXY).replace(/\/api\/longcat.*$/,"/api/tts"):""));
const TTS={mem:new Map(),inflight:new Map(),fails:0,off:false,ok:null};
const TTS_VOICES={m:["m1","m2","m3","m4","m5","m6","m7"],f:["f1","f2"]};
const TTS_VNAME={m1:"低沉克制",m2:"清朗少年感",m3:"温和学长",m4:"冷硬",m5:"慵懒",m6:"明亮",m7:"成熟沉稳",f1:"温柔",f2:"干练"};
function ttsOn(){return !!TTS_EP&&S.ttsMode!=="device"&&!TTS.off}
function ttsVoice(id){if(!id||id==="n")return S.ttsNarr||"f1";const c=ch(id);if(!c)return "m1";if(c.voiceId&&/^[mf]\d$/.test(c.voiceId))return c.voiceId;
 const g=c.g==="f"?"f":"m",L=TTS_VOICES[g];const w0=c.w?wd(c.w):null;const same=w0&&w0.cast?w0.cast.filter(x=>ch(x)&&(ch(x).g==="f"?"f":"m")===g):[];const i=same.indexOf(id);
 return L[(i>=0?i+hash(c.w||""):hash(id))%L.length]}
/* emotion weights: 喜 怒 哀 惧 厌恶 低落 惊喜 平静 */
function ttsEmo(text,id){const s=String(text||""),v=[0,0,0,0,0,0,0,0];
 const R=[[0,/(哈哈|笑|开心|太好了|真好|喜欢|甜|haha|glad|love it)/i,.5],[1,/(滚|闭嘴|该死|混蛋|你敢|别碰|怒|吼|fuck|damn|shut up|get out|how dare)/i,.6],[2,/(对不起|哭|眼泪|难过|心疼|舍不得|别走|sorry|cry|tears|don't go)/i,.55],
  [3,/(怕|别过来|救命|危险|发抖|scared|afraid|help|run)/i,.55],[4,/(恶心|讨厌|鄙视|disgust|gross)/i,.4],[5,/(算了|无所谓|累了|随便|whatever|tired|forget it)/i,.45],[6,/(什么[？?！!]|居然|竟然|真的假的|天哪|wait,|what\?|no way)/i,.5]];
 R.forEach(([k,re,w])=>{if(re.test(s))v[k]=w});if(/[！!]{1,}/.test(s)&&!v.some(x=>x))v[6]=.25;
 if(!v.some(x=>x))v[7]=.35;return v.map(x=>x.toFixed(2)).join(",")}
function ttsKey(text,id){return ttsVoice(id)+"|"+String(text).replace(/[*()（）]/g,"").trim()}
function ttsUrl(text,id){const t0=String(text).replace(/[*()（）]/g,"").replace(/^📞\s*/,"").trim().slice(0,200);
 return TTS_EP+"?v="+ttsVoice(id)+"&e="+ttsEmo(t0,id)+"&l="+(typeof CL==="function"?CL():(S.lang==="zh"?"zh":"en"))+"&k=q2"+"&t="+encodeURIComponent(t0)}
function ttsFetch(text,id){const k=ttsKey(text,id);if(TTS.mem.has(k))return Promise.resolve(TTS.mem.get(k));if(TTS.inflight.has(k))return TTS.inflight.get(k);
 const p=fetch(ttsUrl(text,id)).then(r=>{if(!r.ok)throw new Error("tts "+r.status);return r.blob()}).then(b=>{if(!b||b.size<2000)throw new Error("empty");const u=URL.createObjectURL(b);TTS.mem.set(k,u);TTS.fails=0;TTS.ok=true;return u})
  .catch(e=>{TTS.fails++;if(TTS.fails>=4){TTS.off=true;setTimeout(()=>{TTS.off=false;TTS.fails=0},5*60e3)}throw e}).finally(()=>TTS.inflight.delete(k));
 TTS.inflight.set(k,p);return p}
function ttsSpeakable(text){const s=String(text||"").replace(/[*()（）\s]/g,"");return s.length>=2&&s.length<=200}
const _speak62=speak;
speak=function(text,id,onend){try{
 if(!ttsOn()||!ttsSpeakable(text)||(typeof recorded==="function"&&recorded(text,id)))return _speak62(text,id,onend);
 stopVoice();const my=(TTS.seq=(TTS.seq||0)+1);let done=false;
 const fallback=()=>{if(done||TTS.seq!==my)return;done=true;_speak62(text,id,onend)};
 const tm=setTimeout(fallback,TTS.mem.has(ttsKey(text,id))?1500:7000);
 ttsFetch(text,id).then(u=>{if(done||TTS.seq!==my)return;done=true;clearTimeout(tm);const a=new Audio(u);AUD_CUR=a;a.onended=()=>{if(onend)onend()};a.onerror=()=>{if(onend)onend()};a.play().catch(()=>{if(onend)onend()})}).catch(()=>{clearTimeout(tm);fallback()});
}catch(_){return _speak62(text,id,onend)}};
const _stopVoice62=stopVoice;stopVoice=function(){TTS.seq=(TTS.seq||0)+1;return _stopVoice62()};
/* prefetch the next spoken lines while the current one plays (only when read-aloud is on) */
function ttsPrefetch(th){if(!ttsOn()||!S.autoVoice||!th||!th.pk||!th.pk.q)return;let n=0;
 for(const b of th.pk.q.slice(0,10)){if(n>=3)break;if(!Array.isArray(b)||b[0]==="sys")continue;
  /* 2026-10-27：待播里的 payload 有 28% 是对象（`{"t":"一句台词"}`），原来 `typeof b[2]==="string"` 直接把
     这些句子**跳过了** ⇒ 预取形同虚设，播放时只能现场合成（这就是「语音变慢」的一部分）。这里先归一化成文本。 */
  const txt=(typeof b[2]==="string")?b[2]:(typeof asText70==="function"?asText70(b[2]):String(b[2]||""));
  if(!txt||b[0]===th.pk.as)continue;
  if(!ttsSpeakable(txt)||(typeof recorded==="function"&&recorded(txt,b[0])))continue;n++;ttsFetch(txt,b[0]==="n"?"n":b[0]).catch(()=>{})}}
const _pkAppend62=pkAppend;pkAppend=function(th,m){const r=_pkAppend62(th,m);try{if(curT===th.id)ttsPrefetch(th)}catch(_){}return r};
/* settings: the AI-engine card on the Me page gets a voice row */
function ttsCardHTML(){if(!TTS_EP)return "";const zh=CL()==="zh",mode=S.ttsMode||"server";
 return '<div class="card ttscard"><div class="row"><div class="grow"><b>🎙 '+(zh?"角色配音":"Character voices")+'</b><p class="xs faint">'+(zh?"真人感配音（千问 TTS）· 失败时自动用设备语音":"Natural voices (Qwen TTS) · falls back to the device voice")+'</p></div></div>'+
  '<div class="ttsseg"><button data-ttsmode="server" class="'+(mode==="server"?"on":"")+'">'+(zh?"真人感":"Natural")+'</button><button data-ttsmode="device" class="'+(mode==="device"?"on":"")+'">'+(zh?"设备语音":"Device")+'</button><button data-ttstest="1">▶ '+(zh?"试听":"Try")+'</button></div><p class="xs faint" id="ttsStat"></p></div>'}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-ttsmode]")){S.ttsMode=x.dataset.ttsmode;save();document.querySelectorAll("[data-ttsmode]").forEach(b=>b.classList.toggle("on",b===x));return}
 if(e.target.closest("[data-ttstest]")){const st=$("#ttsStat");if(st)st.textContent=CL()==="zh"?"生成中……第一次可能要 10–20 秒":"Generating… the first time can take 10–20s";const t0=Date.now();
  ttsFetch(CL()==="zh"?"你终于来了。外面雨这么大，你也不带把伞？":"You finally came. It's pouring out there — no umbrella?","m1").then(u=>{const a=new Audio(u);a.play().catch(()=>{});if(st)st.textContent=(CL()==="zh"?"✓ 服务器配音可用 · ":"✓ Server voice works · ")+((Date.now()-t0)/1000).toFixed(1)+"s"})
   .catch(err=>{if(st)st.textContent=(CL()==="zh"?"服务器配音暂时不可用，会用设备语音：":"Server voice unavailable, using the device voice: ")+String(err&&err.message||err)})}});
const _renderMe62=renderMe;renderMe=function(v){const r=_renderMe62.apply(this,arguments);try{if(TTS_EP&&!v.querySelector(".ttscard")){const lc=v.querySelector(".lccard");if(lc)lc.insertAdjacentHTML("afterend",ttsCardHTML());else{const sc=v.querySelector(".scroll");if(sc)sc.insertAdjacentHTML("afterbegin",ttsCardHTML())}}}catch(_){}return r};
/* creators: pick a voice for each character (stored on the character; used by the server TTS) */
function ttsVoicePicker(id){const c=ch(id);if(!c)return "";const cur=ttsVoice(id),g=c.g==="f"?"f":"m";
 return '<div class="ttspick">'+TTS_VOICES[g].concat(g==="m"?[]:[]).map(v=>'<button data-ttsv="'+id+'|'+v+'" class="'+(v===cur?"on":"")+'">'+(TTS_VNAME[v]||v)+'</button>').join("")+'</div>'}
document.addEventListener("click",e=>{const x=e.target.closest("[data-ttsv]");if(!x)return;const [id,v]=x.dataset.ttsv.split("|");const c=ch(id);if(!c)return;c.voiceId=v;if(S.mine.chars[id])S.mine.chars[id].voiceId=v;save();
 x.parentNode.querySelectorAll("button").forEach(b=>b.classList.toggle("on",b===x));speak(CL()==="zh"?"是我。你还记得我的声音吗？":"It's me. Do you remember my voice?",id)});
(function(){const st=document.createElement("style");st.textContent=`
.ttscard{margin-bottom:12px}.ttsseg{display:flex;gap:8px;margin-top:10px}.ttsseg button{flex:1;padding:9px;border-radius:12px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.04);color:#fff;font-size:13px}
.ttsseg button.on{border-color:#F0B77E;background:rgba(240,183,126,.15);color:#F6D3AE}#ttsStat{margin-top:6px}
.ttspick{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.ttspick button{padding:6px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.15);background:none;color:#ddd;font-size:12px}.ttspick button.on{border-color:#F0B77E;color:#F6D3AE}`;document.head.appendChild(st)})();
