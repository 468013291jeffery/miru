/* ================= v2.6.1 · ACCOUNT ENTRY POINTS =================
   · Welcome screen: 「已有账号？登录」 under the start button (returning users on a new phone restore everything in one step).
   · Home: a slim, dismissible 「注册保存进度」 bar for guests once they have started playing.
   · Me: the account card (app68) stays first. All strings in the reader's own language. */
const AC69={
 have:{zh:"已有账号？登录",en:"Have an account? Sign in",ja:"アカウントをお持ちの方はログイン",ko:"계정이 있나요? 로그인",es:"¿Ya tienes cuenta? Inicia sesión"},
 nudge:{zh:"注册账号，换手机也不丢进度和钻石",en:"Create an account so your progress and diamonds are safe",ja:"アカウント登録で、機種変更しても進行状況とダイヤを引き継げます",ko:"계정을 만들면 기기를 바꿔도 진행 상황과 다이아가 유지돼요",es:"Crea una cuenta y no pierdas tu progreso ni tus diamantes"},
 go:{zh:"注册",en:"Sign up",ja:"登録",ko:"가입",es:"Registrarme"}};
function ac69(k){const l=S.lang||"en";return (AC69[k]||{})[l]||(AC69[k]||{}).en||""}
const _renderOB69=renderOB;renderOB=function(){const r=_renderOB69.apply(this,arguments);
 try{if(obStep===0&&CLOUD_EP&&!(typeof au70Loggedin==="function"&&(au70Loggedin()||S.authChoice))){const go=document.querySelector("#obGo");if(go&&!document.querySelector("#obLogin"))go.insertAdjacentHTML("afterend",'<button class="lnk" id="obLogin" data-acct69="login" style="display:block;width:100%;text-align:center;margin-top:2px;padding:8px;font-size:13px;color:var(--dim)">'+esc(ac69("have"))+'</button>')}}catch(_){}return r};
const _renderHome69=renderHome;renderHome=function(v){const r=_renderHome69.apply(this,arguments);
 try{const c=(S.cloud||{});if(CLOUD_EP&&CL0.on&&!c.email&&!c.nudgeOff&&!v.querySelector(".nudge69")){const sc=v.querySelector(".scroll")||v;
  sc.insertAdjacentHTML("afterbegin",'<div class="nudge69"><span>☁️ '+esc(ac69("nudge"))+'</span><button class="btn btn-p btn-sm" data-acct69="register">'+esc(ac69("go"))+'</button><button class="x69" data-acct69="off" aria-label="close">✕</button></div>')}}catch(_){}return r};
document.addEventListener("click",async e=>{const x=e.target.closest("[data-acct69]");if(!x)return;e.preventDefault();e.stopImmediatePropagation();const m=x.dataset.acct69;
 if(m==="off"){cloudInfo().nudgeOff=1;save();const n=x.closest(".nudge69");n&&n.remove();return}
 if(!CL0.on){CL0.checked=false;try{await cloudBoot()}catch(_){}}
 if(!CL0.on){toast(S.lang==="zh"?"服务器暂时连不上，请稍后再试":"Can't reach the server right now — try again soon");return}
 acctSheet(m==="login"?"login":"register")},true);
(function(){const st=document.createElement("style");st.textContent=".nudge69{display:flex;align-items:center;gap:10px;margin:0 0 12px;padding:10px 12px;border-radius:14px;background:linear-gradient(135deg,rgba(240,183,126,.14),rgba(238,111,151,.14));border:1px solid rgba(238,111,151,.3);font-size:12.5px;line-height:1.4}.nudge69 span{flex:1}.nudge69 .x69{color:var(--faint);padding:4px 2px;font-size:13px}";document.head.appendChild(st)})();
