/* overlays live in their own layer on #dev so chat re-renders never wipe them */
function fxLayer(){let l=$("#fxLayer");if(!l){l=document.createElement("div");l.id="fxLayer";($("#dev")||document.body).appendChild(l)}return l}
/* ---- v138 · relationship changes you can SEE, and phone calls that actually play ---- */
/* 1 · every time attraction / trust / jealousy / tension / grudge moves:
       the bar flashes, the number pops, a big chip rises across the screen, and a stage change gets its own banner */
const DIMFX={att:["💗","#FF7AA2"],tru:["🤝","#7CC8FF"],jea:["😤","#8BE08F"],ten:["⚡","#FFB35C"],gru:["🥀","#9AA3B5"]};
const _dimFloat36=dimFloat;
dimFloat=function(key,ch0){_dimFloat36(key,ch0);try{const th=S.threads[curT];if(!th)return;
 const card=$('.dimc[data-dimk="'+key+'"]');
 ch0.forEach(([x,dd])=>{const seg=card&&card.querySelector('[data-dimx="'+x+'"]');if(seg){seg.classList.remove("dimhit");void seg.offsetWidth;seg.classList.add("dimhit");seg.style.setProperty("--hc",DIMFX[x]?DIMFX[x][1]:"#fff")}});
 const host=fxLayer();let pop=host.querySelector(".dimpop");if(!pop){pop=document.createElement("div");pop.className="dimpop";host.appendChild(pop)}
 ch0.forEach(([x,dd],i)=>{const f=DIMFX[x]||["•","#fff"];const old=pop.querySelector('.dimchip[data-x="'+x+'"]');if(old&&Date.now()-(+old.dataset.t)<700){const v=(+old.dataset.v)+dd;old.dataset.v=v;old.querySelector('em').textContent=(v>0?"+":"")+v;return}const el=document.createElement("div");el.dataset.x=x;el.dataset.v=dd;el.dataset.t=Date.now();el.className="dimchip "+(dd>0?"up":"dn");el.style.setProperty("--c",f[1]);el.style.animationDelay=(i*.18)+"s";
  el.innerHTML='<i>'+f[0]+'</i><b>'+esc(t("rd."+x))+'</b><em>'+(dd>0?"+":"")+dd+'</em>';pop.appendChild(el);setTimeout(()=>el.remove(),2200+i*180)});
 /* stage change banner */
 const r=th.rdv&&th.rdv[key];if(r&&typeof dimStage==="function"){th._stg=th._stg||{};const s=dimStage(r);if(th._stg[key]&&th._stg[key]!==s){const b=document.createElement("div");b.className="stgban";b.innerHTML='<small>'+t("dl.stage")+'</small><b>'+esc(t("dm.s."+s))+'</b>';host.appendChild(b);setTimeout(()=>b.remove(),2600);try{window.emoFx&&emoFx(["fire","pull","sync"].includes(s)?"heartbeat":s==="gru"||s==="guard"?"shock":"longing")}catch(_){}}th._stg[key]=s;save()}
 try{navigator.vibrate&&navigator.vibrate(18)}catch(_){}}catch(_){}};
Object.assign(I18N.zh,{"dl.stage":"关系变化"});Object.assign(I18N.en,{"dl.stage":"Things just shifted"});
/* 2 · phone calls: the caller's lines play out when you ARE the caller (you speak them) or are watching, instead of being skipped */
const _stopAuto36=stopAuto;
stopAuto=function(th,b){if(b&&b[1]==="call"){const d=b[2]||{},as=th.pk.as;const watching=!as||as==="watch"||as==="side";
  if(as===d.cid||watching){const other=th.cast.find(c=>c!==d.cid&&ch(c));appendMsg(th,{who:"sys",k:"card",title:"📞 "+t(watching?"call.watchT":"call.youT",{n:first(ch(other||mainOf(th)).n)}),txt:t(watching?"call.watch":"call.you",{n:first(ch(other||mainOf(th)).n)}),at:Date.now()});try{navigator.vibrate&&navigator.vibrate([120,80,120])}catch(_){}
   return (d.lines||[]).map(([w,x])=>[w,"say",x,1]).concat(d.then||[])}}
 return _stopAuto36(th,b)};
Object.assign(I18N.zh,{"call.youT":"你打给{n}","call.watchT":"通话中","call.you":"📞 你拨通了{n}的电话。听筒里只有呼吸声。","call.watch":"📞 电话接通了。"});
Object.assign(I18N.en,{"call.youT":"You call {n}","call.watchT":"On the call","call.you":"📞 You call {n}. All you hear is breathing.","call.watch":"📞 The call connects."});
(function(){const st=document.createElement("style");st.textContent=`
#fxLayer{position:absolute;inset:0;pointer-events:none;z-index:60}#fxLayer>*{pointer-events:none}#fxLayer .rvov{pointer-events:auto}
.dimhit{animation:dimhit 1s ease}
@keyframes dimhit{0%{filter:none}25%{filter:drop-shadow(0 0 8px var(--hc)) brightness(1.6);transform:scale(1.08)}100%{filter:none;transform:none}}
.dimpop{position:absolute;left:0;right:0;top:34%;z-index:25;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none}
.dimchip{display:flex;align-items:center;gap:8px;padding:9px 16px;border-radius:99px;background:rgba(10,9,14,.78);border:1px solid var(--c);box-shadow:0 0 24px color-mix(in srgb,var(--c) 55%,transparent);color:#fff;opacity:0;animation:dimrise 2.1s cubic-bezier(.2,.8,.2,1) forwards;backdrop-filter:blur(6px)}
.dimchip i{font-style:normal;font-size:20px}.dimchip b{font-size:15px}.dimchip em{font-style:normal;font-weight:900;font-size:22px;color:var(--c)}
.dimchip.dn em{color:#F2A0A8}
@keyframes dimrise{0%{opacity:0;transform:translateY(26px) scale(.8)}15%{opacity:1;transform:translateY(0) scale(1.08)}30%{transform:scale(1)}75%{opacity:1;transform:translateY(-18px)}100%{opacity:0;transform:translateY(-46px)}}
.stgban{position:absolute;left:50%;top:22%;transform:translateX(-50%);z-index:26;text-align:center;padding:14px 26px;border-radius:18px;background:linear-gradient(135deg,rgba(240,183,126,.92),rgba(238,111,151,.92));color:#1B1017;box-shadow:0 10px 40px rgba(238,111,151,.5);animation:stgban 2.6s ease forwards;pointer-events:none}
.stgban small{display:block;font-size:11px;font-weight:800;letter-spacing:.2em;opacity:.8}.stgban b{display:block;font-size:22px;font-weight:900;margin-top:2px}
@keyframes stgban{0%{opacity:0;transform:translateX(-50%) scale(.6)}12%{opacity:1;transform:translateX(-50%) scale(1.08)}22%{transform:translateX(-50%) scale(1)}80%{opacity:1}100%{opacity:0;transform:translateX(-50%) translateY(-20px)}}
@media (prefers-reduced-motion:reduce){.dimchip,.stgban{animation-duration:.01s}}`;document.head.appendChild(st)})();
