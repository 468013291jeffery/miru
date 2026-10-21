/* ================= v2.6 · CLOUD — the front end talks to the MIRU backend (/api on Vercel) =================
   Everything degrades gracefully: if the backend (or its database) isn't reachable — e.g. inside the claude.ai preview — the app keeps
   working on the device exactly as before.
   · Account: a guest account is created silently on first launch; 「注册 / 登录」 upgrades it (email + password) and syncs across devices.
   · Cloud save: progress, choices, memories and settings are saved to the account (debounced), restored on login on a new device.
   · Wallet: the server ledger is the source of truth for 💎. Every change on the device is reported (spend / earn / purchase) and the
     server's balance wins; free earnings are capped per day on the server; purchases go through the store endpoint.
   · Community: publishing in the creator also publishes to the community (server QA: safety blocks, structure problems → review);
     Discover gets a 「社区新作」 rail; works can be liked and reported.
   · Library uploads go to the server (charged there, stored in Vercel Blob); 「申请公开」 sends one to review; approved community
     uploads join everybody's library.
   · Translations: /api/i18n preloads the shared dictionary for the reader's language.
   · Analytics: a small event queue (open → taste → hook → role → chapter → pay → publish). */
const CLOUD_EP=(()=>{if(typeof TTS_EP==="string"&&TTS_EP)return TTS_EP.replace(/\/tts$/,"");return ""})();
const CL0={on:false,checked:false,health:null,busy:false,timer:null,lastPush:0};
function cloudInfo(){S.cloud=S.cloud||{};return S.cloud}
function cloudAuth(){const c=cloudInfo();return c.token?{Authorization:"Bearer "+c.token}:{}}
async function capi(path,opt){opt=opt||{};const h=Object.assign({},cloudAuth(),opt.json!==undefined?{"Content-Type":"application/json"}:{},opt.headers||{});
 const r=await fetch(CLOUD_EP+path,{method:opt.method||(opt.json!==undefined?"POST":"GET"),headers:h,body:opt.json!==undefined?JSON.stringify(opt.json):opt.body,keepalive:!!opt.keepalive});
 let j=null;try{j=await r.json()}catch(_){}return {ok:r.ok,status:r.status,j:j||{}}}
async function cloudBoot(){if(!CLOUD_EP||CL0.checked)return;CL0.checked=true;
 try{const h=await capi("/health");CL0.health=h.j;if(!h.ok||!h.j.db)return}catch(_){return}
 const c=cloudInfo();
 try{if(!c.token){const r=await capi("/auth",{json:{op:"guest",lang:S.lang,name:(persona()||{}).name}});if(!r.ok||c.token)return;c.token=r.j.token;c.uid=r.j.user.id;c.provider="guest";c.known=r.j.gems;S.keys=r.j.gems;c.ver=0;save0()}
  CL0.on=true;await walletPull();cloudPush(true);i18nPull();communityAssets();track("app_open",{lang:S.lang,ob:!!S.ob});}catch(_){}
 try{if(typeof renderTab==="function"&&S.lastTab==="me")renderTab("me")}catch(_){}}
/* ---------- saving: local save is wrapped; the cloud copy follows ---------- */
const _save68=save;function save0(){_save68()}
save=function(){const r=_save68.apply(this,arguments);try{if(CL0.on){walletDiff();clearTimeout(CL0.timer);CL0.timer=setTimeout(()=>cloudPush(false),8000)}}catch(_){}return r};
function stateForCloud(){const copy=JSON.parse(JSON.stringify(S));delete copy.cloud;
 const strip=o=>{if(!o||typeof o!=="object")return;for(const k of Object.keys(o)){const v=o[k];if(typeof v==="string"&&v.length>60000&&/^data:/.test(v))o[k]=null;else if(v&&typeof v==="object")strip(v)}};strip(copy);
 let s=JSON.stringify(copy);if(s.length>850000){delete copy.art;s=JSON.stringify(copy)}if(s.length>850000){Object.values(copy.threads||{}).forEach(th=>{th.msgs=(th.msgs||[]).slice(-80)});s=JSON.stringify(copy)}return copy}
async function cloudPush(force){if(!CL0.on||CL0.busy)return;CL0.busy=true;const c=cloudInfo();
 try{const r=await capi("/state",{method:"PUT",json:{data:stateForCloud(),ver:c.ver||0,force:!!force&&!c.ver}});
  if(r.ok){c.ver=r.j.ver;c.syncedAt=Date.now();save0()}else if(r.status===409&&r.j.data){c.conflict={ver:r.j.ver,at:Date.now()};c.ver=r.j.ver;save0()}}catch(_){}CL0.busy=false}
async function cloudPull(){const r=await capi("/state");if(!r.ok||!r.j.data)return false;const keep=cloudInfo();const data=r.j.data;Object.keys(S).forEach(k=>{if(k!=="cloud")delete S[k]});Object.assign(S,data);S.cloud=keep;S.cloud.ver=r.j.ver;save0();return true}
/* ---------- wallet ---------- */
let PENDING_SKU=null;
async function walletPull(){const r=await capi("/wallet");if(r.ok){const c=cloudInfo();c.known=r.j.gems;S.keys=r.j.gems;if(r.j.plus)S.plus=true;save0();keysChip()}}
function keysChip(){const k=$(".topbar .chip.num");if(k)k.textContent="💎 "+S.keys}
let WQ=Promise.resolve();
function walletDiff(){const c=cloudInfo();if(c.known==null){c.known=S.keys;return}const d=(S.keys||0)-c.known;if(!d)return;c.known=S.keys;
 const key=Date.now().toString(36)+Math.random().toString(36).slice(2,7),sku=PENDING_SKU;PENDING_SKU=null;
 WQ=WQ.then(async()=>{let r;
  if(sku){r=await capi("/wallet",{json:{op:"purchase",sku,receipt:key}});if(r&&r.ok)track("purchase",{sku})}
  else if(d<0)r=await capi("/wallet",{json:{op:"spend",amount:-d,reason:"app",key}});
  else r=await capi("/wallet",{json:{op:"earn",amount:Math.min(d,50),reason:"app",key}});
  const g=r&&r.j&&r.j.gems;
  if(r&&r.status===501){toast(CL()==="zh"?"支付通道还在接入中，这次购买没有生效":"Payments aren't connected yet — this purchase didn't go through")}
  else if(r&&r.status===402)toast(CL()==="zh"?"钻石不足（以服务器余额为准）":"Not enough diamonds (server balance)");
  else if(r&&r.status===429&&d>0)toast(CL()==="zh"?"今天的免费钻石已经领满了":"You've collected today's free diamonds");
  if(typeof g==="number"&&g!==S.keys){S.keys=g;cloudInfo().known=g;save0();keysChip()}else if(typeof g==="number")cloudInfo().known=g}).catch(()=>{})}
document.addEventListener("click",e=>{const x=e.target.closest("[data-buy],[data-buyplus]");if(!x||!CL0.on)return;
 PENDING_SKU=x.dataset.buy?"gems_"+x.dataset.buy:"plus_"+(S.planSel||"year")},true);
/* ---------- account UI (Me page) ---------- */
function acctCardHTML(){if(!CLOUD_EP)return "";const zh=CL()==="zh",c=cloudInfo();
 const st=!CL0.on?(zh?"未连接服务器，进度只保存在这台设备":"Offline — progress stays on this device"):c.email?(zh?"已登录 ":"Signed in · ")+c.email+(c.syncedAt?(zh?" · 已同步":" · synced"):""):(zh?"游客账号 · 注册后可在别的设备继续":"Guest · sign up to continue on other devices");
 return '<div class="card acct68"><div class="row"><div class="grow"><b>☁️ '+(zh?"账号与同步":"Account & sync")+'</b><p class="xs faint">'+esc(st)+'</p></div>'+
  (CL0.on?(c.email?'<button class="btn btn-g btn-sm" data-acct="out">'+(zh?"退出":"Sign out")+'</button>':'<button class="btn btn-p btn-sm" data-acct="open">'+(zh?"注册 / 登录":"Sign up / in")+'</button>'):'')+'</div></div>'}
function acctSheet(mode){const zh=CL()==="zh";mode=mode||"register";
 sheet('<div class="acct68s"><h2>'+(mode==="login"?(zh?"登录":"Sign in"):(zh?"注册账号":"Create account"))+'</h2><p class="xs faint">'+(zh?"注册后，你的进度、选择、钻石会保存在云端，换手机也能继续。":"Your progress, choices and diamonds are saved to your account, so you can continue on any device.")+'</p>'+
  '<input id="acEmail" type="email" autocomplete="email" placeholder="'+(zh?"邮箱":"Email")+'" class="up66i" style="margin-top:12px"><input id="acPw" type="password" autocomplete="'+(mode==="login"?"current-password":"new-password")+'" placeholder="'+(zh?"密码（至少 6 位）":"Password (6+ characters)")+'" class="up66i" style="margin-top:8px">'+
  '<button class="btn btn-p btn-block" style="margin-top:12px" data-acgo="'+mode+'">'+(mode==="login"?(zh?"登录":"Sign in"):(zh?"注册并保存进度":"Create account"))+'</button>'+
  '<button class="lnk" style="margin-top:10px;display:block;width:100%;text-align:center" data-acct="'+(mode==="login"?"open":"login")+'">'+(mode==="login"?(zh?"还没有账号？注册":"New here? Create an account"):(zh?"已有账号？登录":"Have an account? Sign in"))+'</button>'+
  (mode==="login"?'<p class="xs faint" style="margin-top:8px">'+(zh?"登录后会用账号里的进度替换这台设备上的进度。":"Signing in replaces this device's progress with your account's.")+'</p>':'')+'</div>')}
document.addEventListener("click",async e=>{let x;const zh=CL()==="zh";
 if(x=e.target.closest("[data-acct]")){const m=x.dataset.acct;if(m==="open")acctSheet("register");else if(m==="login")acctSheet("login");
  else if(m==="out"){const c=cloudInfo();delete c.token;delete c.email;delete c.uid;c.ver=0;save0();CL0.on=false;CL0.checked=false;toast(zh?"已退出，本机进度保留":"Signed out — this device keeps its progress");cloudBoot();renderTab("me")}return}
 if(x=e.target.closest("[data-acgo]")){const mode=x.dataset.acgo,email=($("#acEmail")||{}).value,pw=($("#acPw")||{}).value;x.disabled=true;
  try{const r=await capi("/auth",{json:{op:mode,email,password:pw,name:(persona()||{}).name}});
   if(!r.ok){toast(r.j.error==="wrong email or password"?(zh?"邮箱或密码不对":"Wrong email or password"):r.j.error==="email already registered"?(zh?"这个邮箱已经注册过，请直接登录":"That email is registered — sign in instead"):(r.j.error||"error"));x.disabled=false;return}
   const c=cloudInfo();c.token=r.j.token;c.uid=r.j.user.id;c.email=r.j.user.email;save0();CL0.on=true;
   if(mode==="login"){await cloudPull();await walletPull();toast(zh?"已登录，进度已恢复":"Signed in — progress restored");closeSheet();startApp();return}
   await cloudPush(true);await walletPull();closeSheet();toast(zh?"注册成功，进度已保存到云端":"Account created — progress saved");track("register");renderTab("me")}catch(_){x.disabled=false;toast(zh?"网络不稳定，请稍后再试":"Network problem — try again")}return}},true);
const _renderMe68=renderMe;renderMe=function(v){const r=_renderMe68.apply(this,arguments);try{if(CLOUD_EP&&!v.querySelector(".acct68")){const sc=v.querySelector(".scroll");if(sc)sc.insertAdjacentHTML("afterbegin",acctCardHTML())}}catch(_){}return r};
/* ---------- community works ---------- */
function workPayload(wid){const w=wd(wid);if(!w)return null;const W2=JSON.parse(JSON.stringify(w));const chars={};(w.cast||[]).forEach(id=>{const c=ch(id);if(c){const c2=JSON.parse(JSON.stringify(c));delete c2.studio;chars[id]=c2}});
 const strip=o=>{if(!o||typeof o!=="object")return;for(const k of Object.keys(o)){const v=o[k];if(typeof v==="string"&&/^data:/.test(v)&&v.length>4000)o[k]=null;else if(v&&typeof v==="object")strip(v)}};strip(W2);strip(chars);
 return {id:w.cloudId,title:Lz(w.title),hook:Lz(w.hook),lang:S.lang,orient:w.or||"bl",tags:w.tags||[],cover:typeof w.cover==="string"&&/^https?:/.test(w.cover)?w.cover:null,pack:{world:W2,chars}}}
async function publishCommunity(wid){if(!CL0.on)return;const zh=CL()==="zh",p=workPayload(wid);if(!p)return;
 const r=await capi("/works",{json:{op:"publish",work:p,authorName:(persona()||{}).name}});
 if(r.ok){const w=wd(wid);if(w){w.cloudId=r.j.id;save()}track("publish",{status:r.j.status});toast(r.j.status==="live"?(zh?"🌐 已发布到社区，所有人都能玩":"🌐 Live in the community"):(zh?"🌐 已提交社区，审核通过后上线":"🌐 Submitted — goes live after review"))}
 else if(r.status===422)toast((zh?"⛔ 社区审核未通过：":"⛔ Blocked by review: ")+(r.j.reasons||[]).join(", "));
 else if(r.status===429)toast(zh?"今天发布次数用完了":"Daily publishing limit reached")}
(function(){const B=window.MIRU_BRIDGE;if(!B||!B.publish)return;const _p=B.publish;B.publish=function(story,proj){const r=_p.apply(this,arguments);try{const wid=S.crmap&&proj&&S.crmap[proj.id];if(wid)setTimeout(()=>publishCommunity(wid),1200)}catch(_){}return r}})();
const COMM={list:[],at:0};
async function communityFeed(){if(!CL0.on)return [];if(Date.now()-COMM.at<60000)return COMM.list;const r=await capi("/works?feed=new&limit=20&orient="+(S.or||"all"));if(r.ok){COMM.list=r.j.works||[];COMM.at=Date.now()}return COMM.list}
async function installWork(id){const zh=CL()==="zh";const r=await capi("/works?id="+encodeURIComponent(id)+"&play=1");if(!r.ok||!r.j.pack||!r.j.pack.world){toast(zh?"打不开这部作品":"Couldn't open this story");return null}
 const P=r.j.pack;Object.entries(P.chars||{}).forEach(([cid,c])=>{S.mine.chars[cid]=c});const w=P.world;w.community=id;w.mine=0;S.mine.worlds[w.id]=w;save();track("community_open",{id});return w.id}
document.addEventListener("click",async e=>{const x=e.target.closest("[data-cwork]");if(!x)return;const wid=await installWork(x.dataset.cwork);if(wid)try{openStoryPage?openStoryPage(wid):startSheet(wid)}catch(_){try{startSheet(wid)}catch(__){}}});
const _renderTab68=renderTab;renderTab=function(k){const r=_renderTab68.apply(this,arguments);try{if(k==="discover"&&CL0.on)communityFeed().then(L=>{const v=document.querySelector("#s-main .scroll")||document.querySelector("#s-main");if(!v||!L.length||v.querySelector(".comm68"))return;const zh=CL()==="zh";
 v.insertAdjacentHTML("afterbegin",'<div class="comm68"><div class="eyebrow">🌐 '+(zh?"社区新作":"New from the community")+'</div><div class="comm68r">'+L.map(w=>'<button data-cwork="'+w.id+'">'+(w.cover?'<img src="'+esc(w.cover)+'" alt="">':'<span class="cph">📖</span>')+'<b>'+esc(w.title)+'</b><small>'+esc(w.author)+' · ▶ '+w.plays+' · ♥ '+w.likes+'</small></button>').join("")+'</div></div>')})}catch(_){}return r};
/* ---------- library uploads on the server ---------- */
async function uploadToCloud(kind,m,file){const qs="?kind="+kind+"&name="+encodeURIComponent(m.name)+"&kw="+encodeURIComponent((m.kw||[]).join(","))+"&mode="+(m.mode||"")+"&mime="+encodeURIComponent(file.type)+"&key="+m.id;
 const r=await capi("/assets"+qs,{method:"PUT",headers:{"Content-Type":"application/octet-stream"},body:file});return r}
async function communityAssets(){try{const r=await capi("/assets");if(!r.ok)return;for(const a of r.j.assets||[]){if(a.kind==="mg"){if(!MG100.some(x=>x.id===a.id))MG100.push({id:a.id,zh:"🌐 "+a.name,en:"🌐 "+a.name,tpl:a.meta.tpl,a:a.meta.a,b:a.meta.b||"-",kw:a.kw||[]});continue}
  if(a.kind==="bgm"){window.BGM_FILES=window.BGM_FILES||{};BGM_FILES[a.id]=a.url;if(!BGM100.some(x=>x.id===a.id))BGM100.push({id:a.id,zh:"🌐 "+a.name,en:"🌐 "+a.name,st:"upload",bpm:0,kw:a.kw||[]})}
  if(a.kind==="sfx"){SFX_FILES[a.id]=a.url;if(!SFX100.some(x=>x.id===a.id))SFX100.push({id:a.id,zh:"🌐 "+a.name,en:"🌐 "+a.name,L:[],kw:a.kw||[]})}
  if(a.kind==="fx"&&!FX100.some(x=>x.id===a.id))FX100.push({id:a.id,zh:"🌐 "+a.name,en:"🌐 "+a.name,kind:/^video/.test(a.mime)?"uvid":(a.meta||{}).mode==="cover"?"uimg":"ufall",p:a.url,kw:a.kw||[]})}}catch(_){}}
/* charge on the server instead of the device when online: wrap the upload save */
window.addEventListener("click",async e=>{if(!e.target.closest("[data-upsave]")||!CL0.on||UPK==="mg"||!UPFILE)return;e.stopImmediatePropagation();const zh=CL()==="zh";
 const name=(($("#upName")||{}).value||"").trim(),kw=(($("#upKw")||{}).value||"").split(/[,，、\s]+/).map(s=>s.trim()).filter(Boolean).slice(0,8);
 if(!name)return toast(zh?"起个名字":"Give it a name");if(!$("#upRight").checked)return toast(zh?"请先确认使用权":"Please confirm you have the rights");
 if(UPFILE.size>4*1048576)return toast(zh?"云端上传单个文件最大 4MB":"Cloud uploads are limited to 4 MB");
 const m={id:"u_"+UPK+"_"+Date.now().toString(36),name,kw,mode:/^video\//.test(UPFILE.type)?"video":(typeof UPMODE!=="undefined"?UPMODE:"fall")};toast(zh?"上传中…":"Uploading…");
 const r=await uploadToCloud(UPK,m,UPFILE);
 if(r.status===402){toast(zh?"钻石不足":"Not enough diamonds");return}
 if(!r.ok){toast((zh?"上传失败：":"Upload failed: ")+(r.j.error||r.status));return}
 const a=r.j.asset;try{await uput(m.id,UPFILE)}catch(_){}
 const L=myLib();(L[UPK]=L[UPK]||[]).push(Object.assign(m,{cloudId:a.id,url:a.url}));save();await uregister(UPK,m);await walletPull();track("upload",{kind:UPK});
 closeSheet();LIBT=UPK;LIBQ="";libOpen();toast((zh?"已上传 · 扣 💎":"Uploaded · 💎")+r.j.price)},true);
window.addEventListener("click",async e=>{const x=e.target.closest("[data-upshare]");if(!x)return;e.stopImmediatePropagation();const zh=CL()==="zh";const m=Object.values(myLib()).flat().find(z=>z.id===x.dataset.upshare);
 if(!m||!m.cloudId)return toast(zh?"这份素材只在本机，先在联网时重新上传":"This one is only on this device");const r=await capi("/assets",{json:{op:"share",id:m.cloudId}});toast(r.ok&&r.j.ok?(zh?"已提交审核，通过后会出现在所有人的素材库":"Sent for review — approved items join everyone's library"):(zh?"已经提交过了":"Already submitted"))},true);
const _libOpen68=libOpen;libOpen=function(){_libOpen68();try{const L=myLib()[LIBT]||[];document.querySelectorAll("[data-libtry]").forEach(b=>{const m=L.find(z=>z.id===b.dataset.libtry);if(m&&m.cloudId&&!b.querySelector("[data-upshare]"))b.insertAdjacentHTML("beforeend",'<span class="up66del" data-upshare="'+m.id+'" title="share">🌐</span>')})}catch(_){}};
/* ---------- shared translations ---------- */
async function i18nPull(){if(!/^(ja|ko|es|en|zh)$/.test(S.lang))return;try{const r=await capi("/i18n?lang="+S.lang);if(r.ok&&r.j.map&&typeof TR!=="undefined"){trLoad();Object.keys(r.j.map).forEach(k=>{if(TR.map[k]==null)TR.map[k]=r.j.map[k]});trSave();trScan()}}catch(_){}}
/* ---------- analytics ---------- */
const EVQ=[];function track(name,props){if(!CLOUD_EP)return;EVQ.push({name,props:props||{},at:Date.now()});if(EVQ.length>=20)evFlush()}
async function evFlush(){if(!CL0.on||!EVQ.length)return;const batch=EVQ.splice(0,50);try{await capi("/events",{json:{events:batch},keepalive:true})}catch(_){}}
setInterval(evFlush,15000);document.addEventListener("visibilitychange",()=>{if(document.hidden){evFlush();if(CL0.on)cloudPush(false)}});
document.addEventListener("click",e=>{const x=e.target.closest("[data-hkrole],[data-pfsave],[data-pfskip],[data-pkpick],[data-pknext],[data-libtry],[data-ttstest],[data-mgplay]");if(!x)return;
 const k=Object.keys(x.dataset)[0];track({hkrole:"hook_role",pfsave:"taste_done",pfskip:"taste_skip",pkpick:"choice",pknext:"chapter_next",libtry:"lib_try",ttstest:"tts_try",mgplay:"game_play"}[k]||k,{v:x.dataset[k]})},true);
(function(){const st=document.createElement("style");st.textContent=`
.acct68{margin-bottom:12px}.acct68s h2{margin:0 0 6px}.comm68{margin:4px 0 14px}.comm68r{display:flex;gap:10px;overflow-x:auto;padding:8px 0}.comm68r button{flex:none;width:132px;text-align:left;background:none;border:0;color:#fff;padding:0}
.comm68r img,.comm68r .cph{display:block;width:132px;height:176px;object-fit:cover;border-radius:12px;background:#221c2c;font-size:34px;line-height:176px;text-align:center}.comm68r b{display:block;font-size:13px;margin-top:6px;line-height:1.3}.comm68r small{font-size:11px;color:#9C93A8}`;document.head.appendChild(st)})();
setTimeout(cloudBoot,1200);
