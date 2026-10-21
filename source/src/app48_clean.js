/* ---- v148 · 沉浸模式: a clean chat screen ----
   · Only the latest beats stay on screen; everything older folds into 🕘 历史 (bottom-right) — the scene picture shows through.
   · The header keeps one row (back · cast · title · icons). Relationship meters, chapter, AI turns, time/place, memory and the live-AI
     notice fold into a ⌄ panel that drops down over the scene.
   · The composer is one row: a mode button (台词 / 动作 / 心声 / 导演 …) that pops the mode list, the input, send. The example hint
     becomes the placeholder. */
const CLEAN_KEEP=2;
function cleanOn(){return S.clean!==false}
let HIST_OPEN=false,HD_OPEN=false,TOOLS_OPEN=false;
function cleanMark(){const m=$("#msgs");if(!m)return;const scr=$("#s-chat");if(!scr)return;
 scr.classList.toggle("clean",cleanOn());scr.classList.toggle("histopen",HIST_OPEN);scr.classList.toggle("hdopen",HD_OPEN);scr.classList.toggle("toolsopen",TOOLS_OPEN);const tb=$("#toolBtn");if(tb){tb.classList.toggle("on",TOOLS_OPEN);tb.style.display=$("#pkwrap .pkplay")?"":"none"}
 const kids=[...m.children].filter(c=>c.id!=="pkwrap"&&!c.classList.contains("typing"));
 kids.forEach((c,i)=>c.classList.toggle("cold",cleanOn()&&!HIST_OPEN&&i<kids.length-CLEAN_KEEP));
 const n=kids.length-CLEAN_KEEP;const hb=$("#histBtn");if(hb){hb.querySelector("em").textContent=n>0?n:"";hb.classList.toggle("on",HIST_OPEN);hb.querySelector("small").textContent=HIST_OPEN?LL("收起","Hide"):LL("历史","History")}}
function cleanDecor(){const scr=$("#s-chat");if(!scr||!cleanOn())return;
 /* header toggle */
 const r1=scr.querySelector(".chead .row");if(r1&&!r1.querySelector(".hdx"))r1.insertAdjacentHTML("beforeend",'<button class="ibtn hdx" data-hdx="1" aria-label="more">'+(HD_OPEN?"⌃":"⌄")+'</button>');
 /* history button */
 if(!$("#histBtn")){const c=scr.querySelector(".composer");if(c)c.insertAdjacentHTML("beforebegin",'<div class="rcol"><button id="toolBtn" class="histbtn" data-tools="1"><i>🎬</i><small>'+LL("播放","Play")+'</small></button><button id="histBtn" class="histbtn" data-hist="1"><i>🕘</i><small>'+LL("历史","History")+'</small><em></em></button></div>')}
 /* one-row composer */
 const ir=scr.querySelector(".composer .inrow"),modes=scr.querySelector(".composer .modes");
 if(ir&&modes&&!ir.querySelector(".modebtn")){const on=modes.querySelector(".on")||modes.querySelector("button");ir.insertAdjacentHTML("afterbegin",'<button class="modebtn" data-modebtn="1">'+esc((on&&on.textContent||LL("台词","Say")).trim().slice(0,4))+' ▴</button>')}
 cleanMark()}
const _renderChat48=renderChat;renderChat=function(){_renderChat48.apply(this,arguments);try{cleanDecor();if(cleanOn()&&!HIST_OPEN){const m=$("#msgs");if(m){const intro=m.querySelector(".m-intro:not(.cold)"),th=S.threads[curT],atStart=th&&th.pk&&th.pk.stop&&th.pk.stop[1]==="start";if(intro&&atStart)m.scrollTop=Math.max(0,intro.offsetTop-8);else m.scrollTop=m.scrollHeight}}}catch(_){}};
/* new messages appended without a full re-render */
let CLEAN_MO=null;setInterval(()=>{const m=$("#msgs");if(!m||m._cleanObs)return;m._cleanObs=1;CLEAN_MO=new MutationObserver(()=>{if(cleanOn())requestAnimationFrame(cleanMark)});CLEAN_MO.observe(m,{childList:true})},600);
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-tools]")){TOOLS_OPEN=!TOOLS_OPEN;cleanMark();return}
 if(e.target.closest("[data-hist]")){HIST_OPEN=!HIST_OPEN;cleanMark();const m=$("#msgs");if(m)m.scrollTop=m.scrollHeight;return}
 if(e.target.closest("[data-hdx]")){HD_OPEN=!HD_OPEN;const b=$(".hdx");if(b)b.textContent=HD_OPEN?"⌃":"⌄";cleanMark();return}
 if(e.target.closest("[data-modebtn]")){const c=$("#s-chat .composer");if(c)c.classList.toggle("showmodes");return}
 if((x=e.target.closest("#s-chat .composer .modes button"))){setTimeout(()=>{const c=$("#s-chat .composer");if(c)c.classList.remove("showmodes");const mb=$(".modebtn");if(mb)mb.textContent=x.textContent.trim().slice(0,4)+" ▴"},30)}
 if(HD_OPEN&&!e.target.closest(".chead,.status,.livebanner")&&$("#s-chat")&&!$("#s-chat").hidden&&!e.target.closest(".sheet")){HD_OPEN=false;const b=$(".hdx");if(b)b.textContent="⌄";cleanMark()}});
/* settings toggle in the chat menu */
const _menuSheet48=menuSheet;menuSheet=function(){_menuSheet48.apply(this,arguments);try{const st=$(".sheet .stack");if(st)st.insertAdjacentHTML("beforeend",'<button class="opt" data-cleantog="1"><span class="ic">🧘</span><span class="grow"><b>'+LL("沉浸模式","Clean screen")+'</b><span>'+LL("只留最新几句，其余收进「历史」","Keep only the latest lines; the rest folds into History")+'</span></span><span class="check'+(cleanOn()?" on":"")+'">'+(cleanOn()?"✓":"")+'</span></button>')}catch(_){}};
document.addEventListener("click",e=>{if(!e.target.closest("[data-cleantog]"))return;S.clean=!cleanOn();save();closeSheet();HIST_OPEN=false;renderChat()});
(function(){const st=document.createElement("style");st.textContent=`
#s-chat.clean .chead{padding-bottom:6px;background:linear-gradient(rgba(8,7,11,.72),rgba(8,7,11,0))!important;border:0!important;box-shadow:none!important}
#s-chat.clean .chead>*:not(:first-child),#s-chat.clean>.status,#s-chat.clean>.livebanner{display:none!important}
#s-chat.clean.hdopen .chead>*:not(:first-child),#s-chat.clean.hdopen>.status,#s-chat.clean.hdopen>.livebanner{display:flex!important}
#s-chat.clean.hdopen .chead{background:rgba(10,9,14,.94)!important;backdrop-filter:blur(10px);border-bottom:1px solid var(--line)!important;position:relative;z-index:30}
#s-chat.clean.hdopen>.status,#s-chat.clean.hdopen>.livebanner{position:relative;z-index:30;background:rgba(10,9,14,.94)}
#s-chat.clean .hdx{font-size:18px;font-weight:900;color:#fff}
#s-chat.clean #msgs{display:flex;flex-direction:column}
#s-chat.clean #msgs::before{content:"";flex:1 1 auto}
#s-chat.clean #msgs>*{flex:none}
#s-chat.clean #msgs>.cold{display:none!important}
#s-chat.clean.histopen #msgs{background:rgba(8,7,11,.82);backdrop-filter:blur(6px)}
.histbtn{display:none}
#s-chat.clean .rcol{position:absolute;right:10px;bottom:76px;z-index:40;display:flex;flex-direction:column;gap:8px}
#s-chat.clean .histbtn{display:flex;position:relative;flex-direction:column;align-items:center;gap:1px;width:52px;padding:6px 0;border-radius:16px;background:rgba(12,10,16,.62);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(8px);color:#fff}
#s-chat.clean .histbtn i{font-style:normal;font-size:20px}#s-chat.clean .histbtn small{font-size:11px;font-weight:700}
#s-chat.clean .histbtn em{position:absolute;top:-4px;right:-4px;font-style:normal;font-size:10px;font-weight:800;background:var(--rose,#EE6F97);color:#fff;border-radius:99px;padding:0 5px;min-width:16px;text-align:center}
#s-chat.clean .histbtn em:empty{display:none}#s-chat.clean .histbtn.on{background:rgba(240,183,126,.25);border-color:var(--gold)}
#s-chat.clean .composer{padding:8px 10px 10px!important;background:linear-gradient(rgba(8,7,11,0),rgba(8,7,11,.85))!important;border:0!important;position:relative}
#s-chat.clean .composer .qchips{display:none!important}
#s-chat.clean .composer .modes{display:none!important}
#s-chat.clean .composer.showmodes .modes{display:flex!important;position:absolute;left:10px;right:10px;bottom:58px;flex-wrap:wrap;gap:6px;padding:8px;border-radius:16px;background:rgba(14,12,18,.96);border:1px solid var(--line);z-index:45}
#s-chat.clean .modebtn{flex:none;height:38px;padding:0 10px;border-radius:12px;background:rgba(240,183,126,.16);border:1px solid rgba(240,183,126,.5);color:#F7D2A8;font-weight:800;font-size:13px;white-space:nowrap}
#s-chat.clean .composer .inrow{gap:6px}
#s-chat.clean:not(.histopen) #msgs .m-box>p.tp:not(:nth-last-of-type(-n+4)){display:none}
#s-chat.clean .chead .vtog,#s-chat.clean .composer .emobtn{display:none!important}
#s-chat.clean .chead .callbtn span{display:none}#s-chat.clean .chead .callbtn{padding:0 9px}
#s-chat.clean .chead .row:first-child{gap:6px;flex-wrap:nowrap}
#s-chat.clean #pkwrap .pkhint{display:none!important}
#s-chat.clean:not(.toolsopen) #pkwrap .pkpanel:not(.stop):has(.pkplay){display:none!important}
#s-chat.clean.toolsopen #pkwrap .pkpanel:not(.stop):has(.pkplay){margin-right:0;margin-left:0}
#s-chat.clean #msgs{padding-right:62px}
#s-chat.clean.histopen #msgs{padding-right:62px}
#s-chat.clean #pkwrap .pkspeed>:not(.spdcyc){display:none!important}
#s-chat.clean #pkwrap .pkpanel:has(.pkspeed){display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px}
#s-chat.clean #pkwrap .pkspeed{margin:0!important}
#s-chat.clean.toolsopen #pkwrap .pkpanel:not(.stop):has(.pkplay){display:flex!important;flex-wrap:nowrap!important;align-items:center;justify-content:center;gap:4px;padding:6px 4px!important;overflow-x:auto;scrollbar-width:none}
#s-chat.clean #pkwrap .pkpanel:not(.stop) .pkspeed,#s-chat.clean #pkwrap .pkpanel:not(.stop) .pkplay{display:flex!important;flex-wrap:nowrap!important;gap:5px;flex:none;width:auto!important}
#s-chat.clean #pkwrap .pkpanel:not(.stop) .pkspeed button,#s-chat.clean #pkwrap .pkpanel:not(.stop) .pkplay button{flex:none;white-space:nowrap;font-size:12px!important;padding:7px 7px!important;height:auto!important;min-width:0!important}
#s-chat.clean #pkwrap .pkplay{margin:0!important}
#s-chat.clean #pkwrap .pkpanel{background:rgba(12,10,16,.55)!important;backdrop-filter:blur(8px);padding-top:8px;padding-bottom:8px}
#s-chat.clean #pkwrap .pkhd{display:none}`;document.head.appendChild(st)})();
