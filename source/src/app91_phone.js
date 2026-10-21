/* ================= v5.0 · SIGN IN WITH A PHONE NUMBER (SMS code · AWS End User Messaging) =================
   Shown only when the server says SMS is configured (/auth?providers=1 → sms:true). One flow for sign-in and sign-up:
   number → 6-digit code → in. A guest's progress is kept (the guest account becomes the phone account). */
const PH91={zh:{btn:"用手机号登录",h:"手机号登录",sub:"收到短信验证码就能登录；没注册过会自动建号，现在的进度会保留。",num:"手机号",send:"发送验证码",again:"重新发送",code:"6 位短信验证码",go:"登录",sent:"验证码已发出，10 分钟内有效",bad:"验证码不对",exp:"验证码过期了，请重新获取",fail:"短信没发出去，请稍后再试或换邮箱登录",inv:"手机号格式不对",many:"请求太频繁，请稍后再试",terms:"我们只用这个号码发验证码。短信费用以运营商为准。"},
 en:{btn:"Continue with phone",h:"Sign in with phone",sub:"We'll text you a code. New here? An account is created and your progress is kept.",num:"Phone number",send:"Send code",again:"Resend",code:"6-digit code",go:"Sign in",sent:"Code sent — valid 10 minutes",bad:"Wrong code",exp:"Code expired — get a new one",fail:"Couldn't send the text — try again or use email",inv:"That phone number doesn't look right",many:"Too many requests — try again later",terms:"We only use this number to text you sign-in codes. Msg & data rates may apply. Reply STOP to opt out."}};
function ph91(k){return (PH91[S.lang]||PH91.en)[k]}
const CC91=[["+1","🇺🇸 +1"],["+44","🇬🇧 +44"],["+61","🇦🇺 +61"],["+86","🇨🇳 +86"],["+852","🇭🇰 +852"],["+886","🇹🇼 +886"],["+81","🇯🇵 +81"],["+82","🇰🇷 +82"],["+34","🇪🇸 +34"],["+52","🇲🇽 +52"]];
function ph91Sheet(){const cc=S.lang==="zh"?"+86":"+1";
 sheet('<div class="au70s"><h2>📱 '+esc(ph91("h"))+'</h2><p class="xs faint" style="line-height:1.5">'+esc(ph91("sub"))+'</p>'+
  '<div class="rc87"><select id="ph91c" class="up66i" style="flex:none;width:96px">'+CC91.map(([v,l])=>'<option value="'+v+'"'+(v===cc?" selected":"")+'>'+l+'</option>').join("")+'</select><input id="ph91n" type="tel" inputmode="tel" autocomplete="tel-national" placeholder="'+esc(ph91("num"))+'" class="up66i"></div>'+
  '<div class="rc87"><input id="ph91k" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="'+esc(ph91("code"))+'" class="up66i"><button class="btn btn-g" data-ph91send="1">'+esc(ph91("send"))+'</button></div>'+
  '<button class="btn btn-p btn-block" data-ph91go="1">'+esc(ph91("go"))+'</button><p class="xs faint" style="line-height:1.5;margin-top:8px">'+esc(ph91("terms"))+'</p></div>');
 setTimeout(()=>{const n=$("#ph91n");n&&n.focus()},60)}
function ph91Num(){const c=($("#ph91c")||{}).value||"+1",n=String(($("#ph91n")||{}).value||"").replace(/[^\d]/g,"").replace(/^0+/,"");return n?c+n:""}
function ph91Err(r){const e=r&&r.j&&r.j.error;toast(e==="wrong code"?ph91("bad"):e&&/expired/.test(e)?ph91("exp"):e==="invalid phone"?ph91("inv"):r&&r.status===429?ph91("many"):r&&r.status===403&&e==="banned"&&typeof au70Banned==="function"?(au70Banned(r.j),""):ph91("fail"))}
window.addEventListener("click",async e=>{let x;
 if(e.target.closest("[data-au70='phone']")){e.preventDefault();e.stopImmediatePropagation();ph91Sheet();return}
 if(AU70.prov&&AU70.prov.firebase&&e.target.closest("[data-ph91send],[data-ph91go]"))return; /* Firebase route handles these */
 if((x=e.target.closest("[data-ph91send]"))){e.preventDefault();if(x.disabled)return;const phone=ph91Num();if(!/^\+\d{8,15}$/.test(phone)){toast(ph91("inv"));return}x.disabled=true;
  try{const r=await capi("/auth",{json:{op:"smscode",phone}});if(r.ok){toast(ph91("sent"));let s=60;x.textContent=s+"s";const tk=setInterval(()=>{s--;if(!x.isConnected){clearInterval(tk);return}if(s<=0){clearInterval(tk);x.disabled=false;x.textContent=ph91("again")}else x.textContent=s+"s"},1000);const k=$("#ph91k");k&&k.focus();return}x.disabled=false;ph91Err(r)}catch(_){x.disabled=false;toast(au("net"))}return}
 if((x=e.target.closest("[data-ph91go]"))){e.preventDefault();if(x.disabled)return;const phone=ph91Num(),code=String(($("#ph91k")||{}).value||"").trim();if(!/^\+\d{8,15}$/.test(phone)){toast(ph91("inv"));return}if(!/^\d{6}$/.test(code)){toast(ph91("code"));return}
  x.disabled=true;try{const r=await capi("/auth",{json:{op:"sms",phone,code,lang:S.lang}});if(r.ok){await au70Done(r.j,"phone")}else ph91Err(r)}catch(_){toast(au("net"))}if(x.isConnected)x.disabled=false}},true);
/* the button appears under the email one when the server can send texts */
const _au70Buttons91=au70Buttons;au70Buttons=function(inSheet){const h=_au70Buttons91.apply(this,arguments);const p=AU70.prov;if(!(p&&p.sms))return h;
 return h.replace(/<\/div>$/,'<button class="au70btn au70mail" data-au70="phone">📱 <span>'+esc(ph91("btn"))+'</span></button></div>')};
const _au70Prov91=au70Prov;au70Prov=async function(){const p=await _au70Prov91.apply(this,arguments);try{if(p&&p.sms){document.querySelectorAll(".au70b").forEach(b=>{if(!b.querySelector("[data-au70='phone']"))b.insertAdjacentHTML("beforeend",'<button class="au70btn au70mail" data-au70="phone">📱 <span>'+esc(ph91("btn"))+'</span></button>')})}}catch(_){}return p};
try{PROV_NAME.phone="Phone"}catch(_){}
/* ---- v5.1: Firebase Authentication does the SMS when configured (no carrier registration, ≈$0.01 per US text) ---- */
const FB91={app:null,conf:null,rv:null};
function fb91Load(){if(window.firebase&&firebase.auth)return Promise.resolve();const v="10.14.1",u=n=>"https://www.gstatic.com/firebasejs/"+v+"/firebase-"+n+"-compat.js";
 return au70Script(u("app")).then(()=>au70Script(u("auth")))}
async function fb91Auth(){const p=AU70.prov||await au70Prov();if(!p||!p.firebase)return null;await fb91Load();if(!FB91.app)FB91.app=firebase.apps.length?firebase.app():firebase.initializeApp(p.firebase);const a=firebase.auth();a.languageCode=S.lang==="zh"?"zh-CN":S.lang;return a}
function fb91Err(e){const c=e&&e.code||"";toast(c==="auth/invalid-verification-code"?ph91("bad"):c==="auth/code-expired"?ph91("exp"):c==="auth/invalid-phone-number"?ph91("inv"):c==="auth/too-many-requests"||c==="auth/quota-exceeded"?ph91("many"):ph91("fail"))}
window.addEventListener("click",async e=>{const p=AU70.prov;if(!(p&&p.firebase))return;let x;
 if((x=e.target.closest("[data-ph91send]"))){e.preventDefault();e.stopImmediatePropagation();if(x.disabled)return;const phone=ph91Num();if(!/^\+\d{8,15}$/.test(phone)){toast(ph91("inv"));return}x.disabled=true;
  try{const a=await fb91Auth();if(!FB91.rv||!document.getElementById("fb91rc")){if(!document.getElementById("fb91rc"))document.body.insertAdjacentHTML("beforeend",'<div id="fb91rc"></div>');FB91.rv=new firebase.auth.RecaptchaVerifier("fb91rc",{size:"invisible"})}
   FB91.conf=await a.signInWithPhoneNumber(phone,FB91.rv);toast(ph91("sent"));let s=60;x.textContent=s+"s";const tk=setInterval(()=>{s--;if(!x.isConnected){clearInterval(tk);return}if(s<=0){clearInterval(tk);x.disabled=false;x.textContent=ph91("again")}else x.textContent=s+"s"},1000);const k=$("#ph91k");k&&k.focus()}
  catch(err){x.disabled=false;fb91Err(err);try{FB91.rv&&FB91.rv.clear()}catch(_){}FB91.rv=null}return}
 if((x=e.target.closest("[data-ph91go]"))){e.preventDefault();e.stopImmediatePropagation();if(x.disabled)return;const code=String(($("#ph91k")||{}).value||"").trim();if(!FB91.conf){toast(ph91("send"));return}if(!/^\d{6}$/.test(code)){toast(ph91("code"));return}
  x.disabled=true;try{const cred=await FB91.conf.confirm(code);const idToken=await cred.user.getIdToken();const r=await capi("/auth",{json:{op:"firebase",idToken,lang:S.lang}});try{await firebase.auth().signOut()}catch(_){}
   if(r.ok){FB91.conf=null;await au70Done(r.j,"phone")}else ph91Err(r)}catch(err){fb91Err(err)}if(x.isConnected)x.disabled=false}},true);
/* show the phone button when either SMS route is configured */
au70Buttons=(function(o){return function(inSheet){const h=o.apply(this,arguments);const p=AU70.prov;if(!(p&&p.firebase)||h.includes("data-au70=\"phone\""))return h;return h.replace(/<\/div>$/,'<button class="au70btn au70mail" data-au70="phone">📱 <span>'+esc(ph91("btn"))+'</span></button></div>')}})(au70Buttons);
au70Prov=(function(o){return async function(){const p=await o.apply(this,arguments);try{if(p&&p.firebase)document.querySelectorAll(".au70b").forEach(b=>{if(!b.querySelector("[data-au70='phone']"))b.insertAdjacentHTML("beforeend",'<button class="au70btn au70mail" data-au70="phone">📱 <span>'+esc(ph91("btn"))+'</span></button>')})}catch(_){}return p}})(au70Prov);
