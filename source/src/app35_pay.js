/* ---- v135 things worth paying for ----
   Every paid extra is optional, shows a tempting preview of what you'd get, and the first use of each kind is free:
   · 🔮 Preview: before you answer, see how each attitude would move attraction / trust / tension …   (💎1 per choice)
   · 💭 His unspoken thought: after you speak, a blurred line under your bubble — what he thought and didn't say (💎1)
   · ⟲ Take it back: redo your last choice and try another attitude (💎2)
   Members get all of them free. */
const PAY={preview:1,rthink:1,rewind:2,alt:1};
function payTag(kind){return S.plus?t("pay.vip"):!(S.payFree||{})[kind]?t("pay.first"):"💎"+PAY[kind]}
function payGo(kind){if(S.plus)return true;S.payFree=S.payFree||{};if(!S.payFree[kind]){S.payFree[kind]=1;save();toast(t("pay.firstT"));return true}return spend(PAY[kind],"event")}
function stopKey(th){const d=th.pk&&th.pk.stop&&th.pk.stop[2];return d?String(Lz(d.hint)||"")+"|"+((d.opts||[]).map(o=>Lz(o.t)).join("|")).slice(0,120):""}
const DIMNM={att:["💗","吸引","Attraction"],tru:["🤝","信任","Trust"],jea:["😤","嫉妒","Jealousy"],ten:["⚡","张力","Tension"],gru:["🥀","旧恨","Grudge"]};
function optDelta(th,o){try{if(o.rd){const v=Object.values(o.rd)[0];return v||{}}return dimRule(o)}catch(_){return {}}}
/* 1 · preview on the attitude cards */
const _packRefresh35=packRefresh;packRefresh=function(th){const r=_packRefresh35.apply(this,arguments);try{payDecorate(th)}catch(_){}return r};
function payDecorate(th){if(!th||th.id!==curT||!th.pk||!th.pk.stop||th.pk.stop[1]!=="line")return;const box=$(".chatt");if(!box||box.dataset.pv)return;box.dataset.pv=1;
 const d=th.pk.stop[2],k=stopKey(th),bought=(th._pv||{})[k];
 if(bought){$$(".chatt [data-chatt]").forEach(b=>{const o=d.opts[+b.dataset.chatt];if(!o)return;const dl=optDelta(th,o);const parts=Object.keys(DIMNM).filter(x=>dl[x]).map(x=>'<i class="'+(dl[x]>0?"up":"dn")+'">'+DIMNM[x][0]+(S.lang==="zh"?DIMNM[x][1]:DIMNM[x][2])+(dl[x]>0?"↑":"↓")+'</i>');b.insertAdjacentHTML("beforeend",'<em class="pvb">'+(parts.join("")||'<i>'+t("pay.calm")+'</i>')+'</em>')})}
 else box.insertAdjacentHTML("afterend",'<button class="paybtn pv" data-paypv="1">🔮 '+t("pay.pv")+' · '+payTag("preview")+'</button>')}
/* 2 · snapshot before you answer (for ⟲) and remember which option you took (for 💭) */
let PAYPICK=null;
document.addEventListener("click",e=>{const x=e.target.closest("[data-chgo]");if(!x)return;const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop||th.pk.stop[1]!=="line"||!CH)return;
 const o=th.pk.stop[2].opts[CH.i];const copy=Object.assign({},th);delete copy._snap;th._snap=JSON.stringify(copy);th._snapId=(th._snapId||0)+1;
 PAYPICK={th,o,n:th.msgs.length,sid:th._snapId};
 setTimeout(()=>{const p=PAYPICK;PAYPICK=null;if(!p)return;const m=p.th.msgs.slice(p.n).find(z=>z.who==="me");if(!m)return;m.snapId=p.sid;if(p.o.rthink){m.rthink=p.o.rthink;m.rwho=p.o.rwho||mainOf(p.th)}save();if(curT===p.th.id)renderChat()},0)},true);
/* 2026-10-27：从「手写包装」搬成 MSGKIND.post（后处理类）—— 拿到已渲染的 HTML 再挂付款行。
   逻辑原样：不满足条件就原样返回 h（post 类的约定是「返回非字符串 = 不改」）。 */
MSGKIND.post("app35_pay.js",function(h,m,i,th){if(!m||m.who!=="me"||!th||!th.pk||(!m.rthink&&m.snapId!==th._snapId))return h;
 let x='<div class="payrow">';
 if(m.rthink){const c=ch(m.rwho),nm=c?first(c.n):"";x+=m.rtOpen?'<div class="rtk open">'+avatar(m.rwho,22)+'<p><small>💭 '+esc(t("pay.rtH",{n:nm}))+'</small>'+esc(m.rthink)+'</p></div>'
  :'<button class="rtk" data-payrt="'+i+'">'+avatar(m.rwho,22)+'<p><small>💭 '+esc(t("pay.rtH",{n:nm}))+' · '+payTag("rthink")+'</small><span class="blur">'+esc(m.rthink)+'</span></p></button>'}
 if(m.snapId===th._snapId&&th._snap)x+='<button class="paybtn rw" data-payrw="1">⟲ '+t("pay.rw")+' · '+payTag("rewind")+'</button>';
 return h+x+'</div>'});
document.addEventListener("click",e=>{let x;const th=S.threads[curT];if(!th)return;
 if(x=e.target.closest("[data-paypv]")){if(!payGo("preview"))return;th._pv=th._pv||{};th._pv[stopKey(th)]=1;save();packRefresh(th);return}
 if(x=e.target.closest("[data-payrt]")){const m=th.msgs[+x.dataset.payrt];if(!m||!payGo("rthink"))return;m.rtOpen=1;save();renderChat();try{window.emoFx&&emoFx("ink")}catch(_){}return}
 if(x=e.target.closest("[data-payrw]")){if(!th._snap||!payGo("rewind"))return;const snap=JSON.parse(th._snap),g=(th._gen||0)+1,w=PKWAIT[th.id],n=PKNEXT[th.id];
  Object.keys(th).forEach(k=>delete th[k]);Object.assign(th,snap);th._gen=g;delete PKWAIT[th.id];delete PKNEXT[th.id];try{CH=null}catch(_){}
  if(w)w([]);if(n)n();save();renderChat();toast(t("pay.rwT"));setTimeout(()=>{delete PKPLAY[th.id];packRun(th)},120);return}});
Object.assign(I18N.zh,{"pay.vip":"会员免费","pay.first":"首次免费","pay.firstT":"这次免费，下次 💎","pay.pv":"看他会怎么反应","pay.calm":"波澜不惊","pay.rtH":"{n}没说出口的话","pay.rw":"重选这一步","pay.rwT":"已回到上一个选择——换个态度试试"});
Object.assign(I18N.en,{"pay.vip":"members free","pay.first":"first one free","pay.firstT":"Free this time — 💎 next time","pay.pv":"See how he'd react","pay.calm":"no change","pay.rtH":"What {n} didn't say","pay.rw":"Take it back","pay.rwT":"Back to your last choice — try another approach"});
(function(){const st=document.createElement("style");st.textContent=`
.paybtn{display:block;margin:8px auto 0;padding:7px 14px;border-radius:99px;border:1px dashed rgba(240,183,126,.6);background:rgba(240,183,126,.1);color:#F0B77E;font-size:12.5px;font-weight:700}
.chatt .pvb{display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;font-style:normal}.chatt .pvb i{font-style:normal;font-size:10.5px;padding:2px 6px;border-radius:99px;background:rgba(255,255,255,.08);color:#E9E2EE}
.chatt .pvb i.up{background:rgba(95,211,154,.16);color:#8FE3B8}.chatt .pvb i.dn{background:rgba(227,106,106,.18);color:#F2A0A8}
.payrow{display:flex;flex-direction:column;align-items:flex-end;gap:6px;margin:-4px 0 6px;padding-right:2px}
.rtk{display:flex;gap:8px;align-items:flex-start;max-width:86%;text-align:left;padding:8px 11px;border-radius:14px;background:rgba(26,20,40,.78);border:1px solid rgba(140,111,224,.45);color:#E9E2EE}
.rtk p{margin:0;font-size:13px;line-height:1.5}.rtk small{display:block;font-size:10.5px;color:#C3B2F5;margin-bottom:2px;font-weight:700}
.rtk .blur{filter:blur(5px);user-select:none;color:#D4C7FA}.rtk.open p{color:#E6DCFF;font-style:italic}
.payrow .paybtn.rw{margin:0}`;document.head.appendChild(st)})();
