/* ---- v142 · "your line" uses the one input box at the bottom; auto-speak is per segment, never sticky ---- */
S.selfSpeak=true; /* old builds saved a global "auto" switch — clear it */
function myMode(){const th=S.threads[curT];return !!(th&&th.pk&&th.pk.stop&&th.pk.stop[1]==="myline")}
function mySync(){const sc=$(".chatscreen");if(!sc)return;const on=myMode();sc.classList.toggle("mymode",on);const ta=$("#cin");
 if(ta){if(on){if(!ta.dataset.ph0)ta.dataset.ph0=ta.placeholder;const th=S.threads[curT],c=ch(th.pk.as);ta.placeholder=t("my.ph2",{n:c?first(c.n):""})}else if(ta.dataset.ph0){ta.placeholder=ta.dataset.ph0;delete ta.dataset.ph0}}}
const _packRefresh41=packRefresh;packRefresh=function(th){const r=_packRefresh41.apply(this,arguments);try{mySync()}catch(_){}return r};
const _renderChat41=renderChat;renderChat=function(){_renderChat41.apply(this,arguments);try{mySync()}catch(_){}};
/* the bottom box sends your line while it's your turn */
function myFromComposer(e){if(!myMode())return false;const ta=$("#cin");const v=(ta&&ta.value||"").trim();const th=S.threads[curT];
 e.preventDefault();e.stopImmediatePropagation();if(!v){toast(t("my.empty"));return true}ta.value="";mySay(th,v);return true}
document.addEventListener("click",e=>{if(e.target.closest("[data-send]"))myFromComposer(e)},true);
document.addEventListener("keydown",e=>{if(e.target&&e.target.id==="cin"&&e.key==="Enter"&&!e.shiftKey)myFromComposer(e)},true);
/* "let him speak" applies to this stretch only: it switches back on at the next scene or the next choice */
const _pkDir41=pkDirective;pkDirective=function(th,b){if(Array.isArray(b)&&b[0]==="sys"&&b[1]==="scene"&&S.selfSpeak===false){S.selfSpeak=true}return _pkDir41(th,b)};
document.addEventListener("click",e=>{if(e.target.closest("[data-chgo],[data-pkpick2]")&&S.selfSpeak===false)S.selfSpeak=true},true);
const _save41=save;save=function(){const v=S.selfSpeak;try{S.selfSpeak=true;return _save41.apply(this,arguments)}finally{S.selfSpeak=v}};
Object.assign(I18N.zh,{"my.ph2":"以{n}的身份说……","my.empty":"先写一句，或者点上面的💡提示"});
Object.assign(I18N.en,{"my.ph2":"Your turn — say it as {n}…","my.empty":"Type a line, or tap the 💡 hint above"});
(function(){const st=document.createElement("style");st.textContent=`
.mymode .mybox{display:none!important}
.mymode .mycue{margin:4px 0 6px}
.mymode .myauto{margin-top:6px}
.mymode .composer .qchips,.mymode .composer .modes,.mymode .composer .cxex,.mymode .composer .hintline{display:none!important}
.mymode .composer #cin{border:1.5px solid rgba(240,183,126,.8)!important;box-shadow:0 0 0 3px rgba(240,183,126,.15)}
.mymode .composer .send{box-shadow:0 0 0 3px rgba(240,183,126,.25)}`;document.head.appendChild(st)})();
/* the off-the-page effect fires on its own at the story's big pictures */
const POP_AT={"heir/jet_catch":"kiss","heir/kiss_warehouse":"kiss","heir/bedroom":"kiss","heir/towel":"kiss","heir/lock_jet":"kiss","heir/lock_bedroom":"kiss","heir/press":"kiss","heir/threat":"gun","heir/warehouse":"gun","heir/fiancee":"kiss","afterhours/ch1_p2":"kiss"};
const _pkDir41b=pkDirective;pkDirective=function(th,b){const r=_pkDir41b(th,b);try{if(Array.isArray(b)&&b[0]==="sys"&&(b[1]==="bg"||b[1]==="scene")&&curT===th.id&&!PKSKIP[th.id]){const img=(b[2]||{}).img;const k=POP_AT[img];th._popped=th._popped||{};if(k&&!th._popped[img]){th._popped[img]=1;save();setTimeout(()=>popOut(k,img),b[1]==="scene"?3200:700)}}}catch(_){}return r};
