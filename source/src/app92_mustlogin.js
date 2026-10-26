/* ================= v5.3 · SIGN-IN REQUIRED =================
   The live app can no longer be used as a guest: the "先逛逛 / Browse as guest" option is gone, and anyone who chose
   guest before is sent to the sign-in screen on their next visit. Their on-device progress is kept — signing up
   upgrades that guest account, so nothing is lost. (Local file previews without a server still open directly.) */
const MUST92=()=>!!(typeof CLOUD_EP!=="undefined"&&CLOUD_EP);
function loggedIn92(){try{return au70Loggedin()}catch(_){return false}}
if(MUST92()&&S.authChoice==="guest"&&!loggedIn92()){S.authChoice=null;try{save0()}catch(_){save()}}
const _startApp92=startApp;startApp=function(){if(MUST92()&&!loggedIn92()){S.authChoice=null;renderAuth70();return}return _startApp92.apply(this,arguments)};
window.addEventListener("click",e=>{if(MUST92()&&e.target.closest("[data-au70='guest'],#obLogin+.lnk[data-guest]")){e.preventDefault();e.stopImmediatePropagation()}},true);
const _au70Prov92=au70Prov;au70Prov=async function(){const p=await _au70Prov92.apply(this,arguments);if(p&&MUST92())p.guest=false;return p};
/* 2026-10-27 修：这条 CSS 原来是无条件注入的 ⇒ 在没有账号服务器的环境（预览 / github.io / 本地）里
   登录根本不可用，而游客入口又被藏掉 = 死路一条。只在真有账号服务器时才藏。 */
if(MUST92())(function(){const st=document.createElement("style");st.textContent='.au70guest,[data-au70="guest"]{display:none!important}';document.head.appendChild(st)})();
