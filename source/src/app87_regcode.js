/* ================= v4.2 · SIGN-UP EMAIL CODE (Amazon SES) =================
   When the server can send mail (/auth?providers=1 → verify:true), "Create account" asks for a 6-digit code sent to the
   email first (POST /auth {op:'regcode'}), then registers with {code}. Without mail configured it stays as before. */
const RC87={zh:{send:"发送验证码",again:"重新发送",sent:"验证码已发到邮箱，15 分钟内有效（看不到请查垃圾箱）",need:"请先获取邮箱验证码",bad:"验证码不对",exp:"验证码过期了，请重新获取",fail:"邮件没发出去，请稍后再试",em:"请先填写正确的邮箱",many:"发送太频繁了：每个邮箱每天最多 5 次，请稍后再试",spam:"📮 没收到？看看「垃圾邮件」文件夹，邮件来自 MIRU"},
 en:{send:"Send code",again:"Resend",sent:"Code sent — check your inbox (and spam). Valid 15 minutes.",need:"Get the email code first",bad:"Wrong code",exp:"Code expired — get a new one",fail:"Couldn't send the email — try again shortly",em:"Enter a valid email first",many:"Too many codes — max 5 per email per day. Try later.",spam:"📮 Not there? Check your Spam folder — it comes from MIRU."},
 ja:{send:"コードを送信",again:"再送信",sent:"コードを送信しました（迷惑メールも確認）。15分間有効です。",need:"先にメールのコードを取得してください",bad:"コードが違います",exp:"期限切れです。再取得してください",fail:"メールを送れませんでした",em:"正しいメールアドレスを入力してください",many:"送信が多すぎます。しばらくしてからお試しください",spam:"📮 届かない場合は迷惑メールフォルダを確認してください"},
 ko:{send:"코드 보내기",again:"다시 보내기",sent:"코드를 보냈어요(스팸함도 확인). 15분간 유효해요.",need:"먼저 이메일 코드를 받아 주세요",bad:"코드가 틀렸어요",exp:"코드가 만료됐어요. 다시 받아 주세요",fail:"메일을 보내지 못했어요",em:"올바른 이메일을 입력해 주세요",many:"너무 자주 보냈어요. 잠시 후 다시 시도해 주세요",spam:"📮 안 보이면 스팸함을 확인해 주세요"},
 es:{send:"Enviar código",again:"Reenviar",sent:"Código enviado (revisa spam). Válido 15 minutos.",need:"Primero pide el código del correo",bad:"Código incorrecto",exp:"El código caducó: pide otro",fail:"No se pudo enviar el correo",em:"Escribe un correo válido",many:"Demasiados códigos. Inténtalo más tarde.",spam:"📮 ¿No llega? Revisa la carpeta de spam."}};
function rc87(k){return (RC87[S.lang]||RC87.en)[k]}
const _authSheet87=authSheet70;
authSheet70=function(mode){_authSheet87(mode);if(mode!=="register")return;au70Prov().then(p=>{if(!p||!p.verify)return;const pw=$("#au7p");if(!pw||$("#au7rc"))return;
 pw.insertAdjacentHTML("afterend",'<div class="rc87"><input id="au7rc" inputmode="numeric" maxlength="6" autocomplete="one-time-code" placeholder="'+esc(au("code"))+'" class="up66i"><button class="btn btn-g" data-rc87="1">'+esc(rc87("send"))+'</button></div>')})};
/* countdown survives re-rendering the sheet (switching tabs etc.) */
const RC87T={};
function rc87Tick(btn,key){if(!btn)return;clearInterval(btn._tk);const f=()=>{const left=Math.ceil(((RC87T[key]||0)-Date.now())/1000);if(!btn.isConnected){clearInterval(btn._tk);return}
 if(left>0){btn.disabled=true;btn.classList.add("rc87cd");btn.textContent=left+"s"}else{clearInterval(btn._tk);btn.disabled=false;btn.classList.remove("rc87cd");btn.textContent=RC87T[key]?rc87("again"):rc87("send")}};f();btn._tk=setInterval(f,1000)}
function rc87Hint(after){const el=$(after);if(!el||el.parentNode.querySelector(".rc87h"))return;el.insertAdjacentHTML("afterend",'<p class="rc87h xs">'+esc(rc87("spam"))+'</p>')}
async function rc87Send(btn,key,op,email){if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){toast(rc87("em"));return false}if(btn.disabled)return false;btn.disabled=true;btn.textContent="…";
 try{const r=await capi("/auth",{json:{op,email}});
  if(r.ok){RC87T[key]=Date.now()+60e3;rc87Tick(btn,key);toast(rc87("sent"));return true}
  RC87T[key]=0;rc87Tick(btn,key);const er=r.j&&r.j.error;toast(er==="email already registered"?au("taken"):r.status===429?rc87("many"):r.status===501?au("nomail"):rc87("fail"));return false}
 catch(_){RC87T[key]=0;rc87Tick(btn,key);toast(au("net"));return false}}
document.addEventListener("click",async e=>{const x=e.target.closest("[data-rc87]");if(!x)return;e.preventDefault();e.stopImmediatePropagation();const email=(($("#au7e")||{}).value||"").trim().toLowerCase();
 if(await rc87Send(x,"reg","regcode",email)){rc87Hint(".rc87");const c=$("#au7rc");if(c)c.focus()}},true);
/* forgot password: the reset screen gets the same countdown + resend */
document.addEventListener("click",e=>{const x=e.target.closest('[data-au70go="forgot"]');if(!x)return;const em=(($("#au7e")||{}).value||"").trim().toLowerCase();
 if(RC87T.rs>Date.now()){e.preventDefault();e.stopImmediatePropagation();AU70.resetEmail=em;authSheet70("reset");return}x.dataset.rc87em=em},true);
const _authSheet87b=authSheet70;authSheet70=function(mode){const r=_authSheet87b.apply(this,arguments);try{
 if(mode==="reset"){const em=(AU70.resetEmail||"").trim().toLowerCase();if(!(RC87T.rs>Date.now()))RC87T.rs=Date.now()+60e3;const c=$("#au7c");
  if(c&&!$("#rs87")){c.outerHTML='<div class="rc87">'+c.outerHTML+'<button class="btn btn-g" id="rs87" data-rs87="1"></button></div>';rc87Tick($("#rs87"),"rs");rc87Hint(".rc87")}}
 if(mode==="register"){setTimeout(()=>{const b=$("[data-rc87]");const em=(($("#au7e")||{}).value||"").trim().toLowerCase();if(b&&RC87T.reg)rc87Tick(b,"reg")},400)}}catch(_){}return r};
document.addEventListener("click",e=>{const x=e.target.closest("[data-rs87]");if(!x)return;e.preventDefault();e.stopImmediatePropagation();const em=(($("#au7e")||{}).value||"").trim().toLowerCase();AU70.resetEmail=em;rc87Send(x,"rs","forgot",em)},true);
/* register carries the code; map the new errors to friendly words */
const _capi87=capi;capi=function(path,o){try{if(path==="/auth"&&o&&o.json&&o.json.op==="register"){const c=$("#au7rc");if(c)o.json.code=c.value.trim()}}catch(_){}return _capi87.apply(this,arguments)};
const _au70Err87=au70Err;au70Err=function(r){const e=r&&r.j&&r.j.error;if(e==="verification code required"){toast(rc87("need"));return}if(e==="wrong code"){toast(rc87("bad"));return}if(e&&/code expired/.test(e)){toast(rc87("exp"));return}return _au70Err87(r)};
(function(){const st=document.createElement("style");st.textContent=`.rc87{display:flex;gap:8px;align-items:stretch}.rc87 .up66i{flex:1;min-width:0}.rc87 .btn{flex:none;white-space:nowrap;padding:0 14px;min-width:96px}.rc87 .btn.rc87cd{opacity:.55;font-variant-numeric:tabular-nums}.rc87h{margin:2px 2px 0;color:var(--gold);opacity:.85}`;document.head.appendChild(st)})();
