/* ---- v154 · AI 引擎可切换：Claude（默认）/ LongCat ----
   LongCat uses its OpenAI-compatible endpoint: POST {base}/v1/chat/completions, Authorization: Bearer <key>, model LongCat-2.0 / LongCat-2.5-Preview.
   The key is typed in by the user on their own device (Me → AI 引擎) and kept only in this browser's storage — it is never written into the page source,
   so a shared link never carries it. When LongCat is on, it replaces SAMPLE, so every live-AI feature (chat replies, creator, 换一句, import help) uses it. */
const LC_KEY="miru.lc.key",LC_MODELS=["LongCat-2.0","LongCat-2.5-Preview"],LC_BASE="https://api.longcat.chat/openai";
/* MIRU-hosted proxy: the site owner's key lives on the server, never in the page. Same-origin /api/longcat on Vercel, or window.MIRU_PROXY. */
const LC_PROXY=window.MIRU_PROXY||(/\.vercel\.app$/.test(location.hostname)?location.origin+"/api/longcat":"");
function lcProxyMode(){return !!LC_PROXY&&!lcKey()}
function lcCfg(){S.ai=S.ai||{provider:LC_PROXY?"longcat":"claude",model:LC_MODELS[0],base:LC_BASE};return S.ai}
function lcKey(){try{return localStorage.getItem(LC_KEY)||""}catch(_){return ""}}
function lcSetKey(k){try{k?localStorage.setItem(LC_KEY,k):localStorage.removeItem(LC_KEY)}catch(_){}}
/* 2026-10-27：有代理、没 key 时，**代理就是 provider**。
   原来还要求 S.ai.provider==="longcat"，而老存档里存的是 "claude" ⇒ 本地永远判成「没有 AI」⇒ 每轮都是兜底模板。 */
function lcOn(){return (!!lcKey()||!!LC_PROXY)&&(lcCfg().provider==="longcat"||lcProxyMode())}
function lcMsgs(input){if(typeof input==="string")return [{role:"user",content:input}];return (input||[]).map(m=>({role:m.role==="assistant"?"assistant":"user",content:typeof m.content==="string"?m.content:JSON.stringify(m.content)}))}
function lcClean(t){return String(t||"").replace(/<think>[\s\S]*?<\/think>/g,"").replace(/^\s*<think>[\s\S]*$/,"").trim()}
async function lcCall(input,opts){opts=opts||{};const key=lcKey();if(!key&&!LC_PROXY)throw {code:"no_key",message:LL("还没填 LongCat API Key","No LongCat API key yet")};const c=lcCfg();
 // 输出预算（2026-10-25 Ann：正常 prompt 就 1 万 token，上限给到 2–3 万）
 // 三轮加起来：普通档 8k 够一句正常回复；复杂档 20k 才养得起推理型模型的思考 + 正文
 const max={quick:2048,default:8192,complex:20000}[opts.modelTier||"default"]||8192;const stream=typeof opts.onText==="function";
 const body={model:c.model||LC_MODELS[0],messages:lcMsgs(input),max_tokens:max,temperature:0.85,stream,thinking:{type:"disabled"}};
 const t0=Date.now();const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),opts.timeout||60000);if(opts.signal)opts.signal.addEventListener("abort",()=>ctl.abort());
 const url=key?(c.base||LC_BASE).replace(/\/+$/,"")+"/v1/chat/completions":LC_PROXY,hd={"Content-Type":"application/json"};if(key)hd.Authorization="Bearer "+key;
 let r;try{r=await fetch(url,{method:"POST",headers:hd,body:JSON.stringify(body),signal:ctl.signal})}
 catch(e){clearTimeout(tm);throw {code:opts.signal&&opts.signal.aborted?"cancelled":ctl.signal.aborted?"timeout":"network",message:String(e&&e.message||e)}}
 if(!r.ok){clearTimeout(tm);let msg="";try{const j=await r.json();msg=(j.error&&(j.error.message||j.error.code))||j.message||""}catch(_){}
  throw {code:r.status===401||r.status===403?"bad_key":r.status===429?"rate_limited":"http_"+r.status,message:msg}}
 if(!stream){let j;try{j=await r.json()}catch(e){clearTimeout(tm);throw {code:"bad_response",message:String(e&&e.message||e)}}clearTimeout(tm);if(j&&j.error&&!j.choices)throw {code:String(j.error.code||"upstream"),message:j.error.message||""};const ch0=(j.choices||[])[0]||{};return {text:lcClean(ch0.message&&ch0.message.content),truncated:ch0.finish_reason==="length"}}
 const rd=r.body.getReader(),dec=new TextDecoder();let buf="",text="",fin=null;
 while(true){const {done,value}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true});const lines=buf.split("\n");buf=lines.pop();
  for(const ln of lines){const s=ln.trim();if(!s.startsWith("data:"))continue;const d=s.slice(5).trim();if(d==="[DONE]")continue;try{const j=JSON.parse(d),c0=(j.choices||[])[0]||{};const dl=c0.delta&&c0.delta.content||"";if(c0.finish_reason)fin=c0.finish_reason;if(dl){text+=dl;const tx=lcClean(text);opts.onText({text:tx,delta:dl})}}catch(_){}}}
  const sent=JSON.stringify(input||"").length;   // 发出去多少字符（口径：字符，不是 token）
 clearTimeout(tm);
 /* 用量记账（2026-10-25 · 规范第 10 章「每轮用了多少」的预留口子）：
    真实 token 只有 provider 会报，而我们这条流里目前拿不到（代理直通字节）。
    所以这里记的是**可得的真数**：输入字符、输出字符、耗时、是否被截断。不估算 token。
    想看 token：等代理侧接上 provider 的 usage 帧，或在后台按字符/4 折算（口径要写明是折算）。 */
 try{ if(typeof track==="function"){
   const ms=Math.round(Date.now()-t0);
   let prov="";try{prov=(r.headers&&r.headers.get&&r.headers.get("X-MIRU-Provider"))||""}catch(_){}
   track("llm_usage",{charsIn:sent,charsOut:String(text||"").length,ms:ms,truncated:fin==="length",tier:(opts&&opts.modelTier)||"default",provider:prov});
 }}catch(_){}
 return {text:lcClean(text),truncated:fin==="length"}}
const LC_SAMPLE=Object.assign((input,opts)=>lcCall(input,opts),{
 json:async(input,opts)=>{const r=await lcCall(typeof input==="string"?input+"\n\nReply with valid JSON only — no prose, no code fences.":input,opts);const j=jsonLoose(r.text);if(j==null)throw {code:"invalid_json",text:r.text};return j},
 limits:async()=>({images:false})});
let CLAUDE_SAMPLE=null;
function lcApply(){if(lcOn()){if(SAMPLE&&SAMPLE!==LC_SAMPLE)CLAUDE_SAMPLE=SAMPLE;if(SAMPLE!==LC_SAMPLE){SAMPLE=LC_SAMPLE;LIVE_STATE="ready";LIVE_ERR=null;S.live=true;refreshLive()}}
 else if(SAMPLE===LC_SAMPLE){SAMPLE=CLAUDE_SAMPLE;LIVE_STATE=SAMPLE?"ready":"na";LIVE_ERR=null;refreshLive()}}
/* the Claude sampler resolves asynchronously after load; keep LongCat in charge when it's selected */
setInterval(lcApply,1000);setTimeout(lcApply,50);
const _liveWhy54=liveWhy;liveWhy=function(code){if(lcCfg().provider==="longcat"){const M={no_key:LL("还没填 LongCat API Key。","No LongCat API key yet."),bad_key:LL("LongCat 拒绝了这个 Key（401/403）。检查一下是否填错或已失效。","LongCat rejected this key (401/403)."),
  rate_limited:LL("LongCat 请求太频繁（429），稍等一分钟再试。","LongCat rate limit (429) — wait a minute."),timeout:LL("LongCat 超时没有回应。","LongCat timed out."),
  network:LL("浏览器没能连上 LongCat。claude.ai 上的网页版不允许直接连外部接口；请用本地文件版（D 盘里的 html）打开，或在下面填你自己的代理地址。","The browser couldn't reach LongCat. Pages on claude.ai can't call outside APIs directly — open the local file copy, or set your own proxy URL below.")};
  if(M[code])return M[code];if(/^http_/.test(code))return LL("LongCat 返回错误 ","LongCat error ")+code.slice(5)}return _liveWhy54(code)};
/* settings card on the Me page */
function lcCardHTML(){const c=lcCfg(),k=lcKey(),on=c.provider==="longcat";
 return '<div class="card lccard"><div class="eyebrow">🤖 '+LL("AI 引擎","AI engine")+'</div><div class="seg" style="margin-top:10px"><button data-lcprov="claude" class="'+(!on?"on":"")+'">Claude</button><button data-lcprov="longcat" class="'+(on?"on":"")+'">LongCat</button></div>'+
  (on&&LC_PROXY&&!k?'<p class="xs" style="margin-top:10px;line-height:1.5;color:#8bd5c4">✓ '+LL("MIRU 已提供 LongCat，不用填 Key，直接开玩。","LongCat is provided by MIRU — no key needed.")+'</p><div class="seg" style="margin-top:8px">'+LC_MODELS.map(m=>'<button data-lcmodel="'+m+'" class="'+(c.model===m?"on":"")+'">'+m.replace("LongCat-","")+'</button>').join("")+'</div><button class="btn btn-g btn-sm" style="margin-top:10px" data-livetest="1">'+LL("测试连接","Test")+'</button>':on?'<label class="lcl">API Key</label><div class="row" style="gap:6px"><input id="lcKey" type="password" autocomplete="off" class="lcin grow" placeholder="ak_…" value="'+esc(k)+'"><button class="btn btn-g btn-xs" data-lceye="1">👁</button></div>'+
   '<label class="lcl">'+LL("模型","Model")+'</label><div class="seg">'+LC_MODELS.map(m=>'<button data-lcmodel="'+m+'" class="'+(c.model===m?"on":"")+'">'+m.replace("LongCat-","")+'</button>').join("")+'</div>'+
   '<label class="lcl">'+LL("接口地址（用代理时改这里）","Base URL (change for a proxy)")+'</label><input id="lcBase" class="lcin" value="'+esc(c.base||LC_BASE)+'">'+
   '<div class="row" style="gap:8px;margin-top:10px"><button class="btn btn-p btn-sm grow" data-lcsave="1">'+LL("保存并测试","Save & test")+'</button>'+(k?'<button class="btn btn-g btn-sm" data-lcclear="1">'+LL("清除 Key","Clear key")+'</button>':'')+'</div>'+
   '<p class="xs faint" id="lcRes" style="margin-top:8px;line-height:1.5">'+LL("Key 只存在这台设备的浏览器里，不会写进页面，也不会随分享链接带出去。","The key stays in this browser only — never in the page or a shared link.")+'</p>'
  :'<p class="xs faint" style="margin-top:8px;line-height:1.5">'+LL("当前用 Claude 实时生成。切到 LongCat 需要填你的 API Key。","Using Claude live. Switch to LongCat with your own API key.")+'</p>')+'</div>'}
const _renderMe54=renderMe;renderMe=function(v){_renderMe54.apply(this,arguments);try{if(v.querySelector(".lccard"))return;const sc=v.querySelector(".scroll");if(sc)sc.insertAdjacentHTML("afterbegin",lcCardHTML());else{const lr=v.querySelector("#liveRes");const card=lr&&lr.closest(".card");if(card)card.insertAdjacentHTML("afterend",lcCardHTML())}}catch(_){}};
function lcRerender(){const c=$(".lccard");if(c)c.outerHTML=lcCardHTML()}
document.addEventListener("click",async e=>{let x;
 if(x=e.target.closest("[data-lcprov]")){lcCfg().provider=x.dataset.lcprov;save();lcApply();lcRerender();toast(x.dataset.lcprov==="longcat"?(lcKey()?LL("已切到 LongCat","Switched to LongCat"):LL("填入 API Key 后生效","Add your API key to switch")):LL("已切回 Claude","Back to Claude"));return}
 if(x=e.target.closest("[data-lcmodel]")){lcCfg().model=x.dataset.lcmodel;save();$$("[data-lcmodel]").forEach(b=>b.classList.toggle("on",b===x));return}
 if(e.target.closest("[data-lceye]")){const i=$("#lcKey");if(i)i.type=i.type==="password"?"text":"password";return}
 if(e.target.closest("[data-lcclear]")){lcSetKey("");lcApply();lcRerender();toast(LL("已清除","Cleared"));return}
 if(x=e.target.closest("[data-lcsave]")){const k=(($("#lcKey")||{}).value||"").trim(),b=(($("#lcBase")||{}).value||"").trim()||LC_BASE;
  if(!/^https:\/\//.test(b)){toast(LL("接口地址要以 https:// 开头","Base URL must start with https://"));return}
  lcSetKey(k);lcCfg().base=b;save();lcApply();const res=$("#lcRes");if(res)res.textContent=LL("正在连接 LongCat…","Connecting to LongCat…");x.disabled=true;
  const r=await liveTest();x.disabled=false;const msg=r.ok?"✓ "+LL("LongCat 已连接 · ","LongCat connected · ")+lcCfg().model:liveWhy(r.code)+(r.msg&&!/fetch/i.test(r.msg)?" — "+r.msg:"");
  const res2=$("#lcRes");if(res2)res2.textContent=msg;toast(msg);const lr=$("#liveRes");if(lr)lr.textContent=r.ok?"✓ "+LL("已连接——每句回复都由 LongCat 实时生成。","Connected — LongCat writes every reply live."):msg;return}});
const _refreshLive54=refreshLive;refreshLive=function(){_refreshLive54.apply(this,arguments);try{if(lcOn()&&liveOn()&&!LIVE_ERR)$$(".livechip").forEach(el=>{el.textContent="LongCat"})}catch(_){}};
(function(){const st=document.createElement("style");st.textContent=`.lcl{display:block;font-size:11.5px;color:#aaa;margin:10px 0 4px}.lcin{width:100%;background:var(--panel2);border:1px solid var(--line);border-radius:10px;color:#fff;padding:9px 10px;font-size:13px}`;document.head.appendChild(st)})();
