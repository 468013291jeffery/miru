/* ---- v142 · declining a call is a moment, not a silent skip ----
   ✕ on an incoming call → hang-up tone + buzz, a "📵 已拒接" overlay with his face sliding away,
   tension rises / trust dips a little, and a card stays in the chat:
   "你拒接了X的电话 · 响了N秒" with 🎧 听他本来要说什么 (💎2, first time free) → private transcript of the lines you skipped. */
Object.assign(PAY,{callback:PRICES.callMin});
function sfxHang(){try{const c=sfxCtx();if(!c)return;for(let i=0;i<3;i++)blip(c,{f0:480,f1:480,dur:.16,type:"sine",vol:.07,at:i*.24})}catch(_){}}
function declineFx(cid){try{if(PKSKIP[curT])return;const L=fxLayer(),o=document.createElement("div");o.className="dcov";
 o.innerHTML='<div class="dcav">'+avatar(cid,84)+'<i>📵</i></div><b>'+esc(t("dc.title"))+'</b><small>'+esc(t("dc.sub",{n:first(ch(cid).n)}))+'</small>';
 L.appendChild(o);setTimeout(()=>o.remove(),2300)}catch(_){}
 sfxHang();try{navigator.vibrate&&navigator.vibrate([60,40,60])}catch(_){}}
document.addEventListener("click",e=>{const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop||th.pk.stop[1]!=="call")return;
 if(!e.target.closest("[data-stopskip]"))return;
 const d=th.pk.stop[2]||{},cid=d.cid||mainOf(th),lines=(d.lines||[]).map(([w,x])=>[w,Lz(x)]);
 declineFx(cid);
 appendMsg(th,{who:"sys",k:"declined",cid,secs:4+hash(String(Lz(d.hint)||cid))%9,lines,at:Date.now()});
 const as=th.pk.as;setTimeout(()=>{try{if(as&&ch(as))dimAdd(th,as+"|"+cid,{ten:6,tru:-4},"decline")}catch(_){}},2000);
},true);
const _msgHTML42=msgHTML;msgHTML=function(m,i,th){if(!m||m.k!=="declined")return _msgHTML42(m,i,th);const c=ch(m.cid);if(!c)return"";
 return '<div class="msg sysm"><div class="dccard">'+avatar(m.cid,30)+'<div class="dcbody"><b>📵 '+esc(t("dc.card",{n:first(c.n)}))+'</b><span>'+esc(t("dc.rang",{s:m.secs}))+'</span>'+
  (m.lines&&m.lines.length?(m.heard?'<button class="dcbtn" data-dcread="'+i+'">🎧 '+t("dc.again")+'</button>':'<button class="dcbtn" data-dcbuy="'+i+'">🎧 '+t("dc.buy")+' · '+payTag("callback")+'</button>'):'')+'</div></div></div>'};
function dcShow(m){const c=ch(m.cid);sheet('<div class="eyebrow" style="color:var(--gold)">🎧 '+t("dc.vm")+'</div><h2 style="margin-top:4px">'+esc(t("dc.vmH",{n:first(c.n)}))+'</h2>'+
 '<div class="dcvm">'+m.lines.map(([w,x])=>'<p><b>'+esc(first((ch(w)||c).n))+'</b>“'+esc(x)+'”</p>').join("")+'</div><p class="xs faint" style="margin-top:10px">'+t("dc.note")+'</p>')}
document.addEventListener("click",e=>{let x;const th=S.threads[curT];if(!th)return;
 if(x=e.target.closest("[data-dcbuy]")){const m=th.msgs[+x.dataset.dcbuy];if(!m)return;if(!payGo("callback"))return;m.heard=1;save();renderChat();dcShow(m);return}
 if(x=e.target.closest("[data-dcread]")){const m=th.msgs[+x.dataset.dcread];if(m)dcShow(m)}});
Object.assign(I18N.zh,{"dc.title":"已拒接","dc.sub":"你按掉了{n}的电话","dc.card":"你拒接了{n}的电话","dc.rang":"响了{s}秒 · 他没有再打来","dc.buy":"听他本来要说什么","dc.again":"再听一遍","dc.vm":"他没说出口的那通电话","dc.vmH":"{n}本来想对你说：","dc.note":"只有你知道。剧情按你拒接的那条线继续。"});
Object.assign(I18N.en,{"dc.title":"Call declined","dc.sub":"You hung up on {n}","dc.card":"You declined {n}'s call","dc.rang":"Rang {s}s · he didn't call back","dc.buy":"Hear what he was going to say","dc.again":"Listen again","dc.vm":"The call you didn't take","dc.vmH":"What {n} was about to tell you:","dc.note":"Only you know this. The story continues down the declined path."});
(function(){const st=document.createElement("style");st.textContent=`
.dcov{position:absolute;left:50%;top:30%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;padding:20px 30px;border-radius:22px;background:rgba(12,10,16,.86);border:1px solid rgba(242,90,110,.55);box-shadow:0 0 40px rgba(242,90,110,.35);backdrop-filter:blur(8px);color:#fff;animation:dcin 2.3s ease forwards}
.dcov b{font-size:22px;font-weight:900;color:#FF6B7F;letter-spacing:.08em}.dcov small{font-size:13px;color:#ddd}
.dcav{position:relative;animation:dcslide 2.3s ease forwards}.dcav img,.dcav .av{filter:grayscale(.7)}
.dcav i{position:absolute;right:-6px;bottom:-4px;font-style:normal;font-size:26px}
@keyframes dcin{0%{opacity:0;transform:translateX(-50%) scale(.7)}12%{opacity:1;transform:translateX(-50%) scale(1.05)}20%{transform:translateX(-50%) scale(1)}80%{opacity:1}100%{opacity:0;transform:translateX(-50%) translateY(-16px)}}
@keyframes dcslide{0%,15%{transform:none}25%{transform:translateX(-6px) rotate(-4deg)}35%{transform:translateX(6px) rotate(4deg)}45%{transform:none}}
.dccard{display:flex;gap:10px;align-items:flex-start;margin:6px auto;max-width:86%;padding:10px 14px;border-radius:16px;background:rgba(30,20,28,.82);border:1px solid rgba(242,90,110,.4);color:#eee}
.dcbody{display:flex;flex-direction:column;gap:3px}.dcbody b{font-size:14px;color:#FF8A9A}.dcbody span{font-size:12px;color:#bbb}
.dcbtn{margin-top:6px;align-self:flex-start;padding:7px 12px;border-radius:99px;border:1px solid var(--gold,#F0B77E);background:rgba(240,183,126,.14);color:#F7D2A8;font-weight:700;font-size:13px}
.dcvm{margin-top:12px;display:flex;flex-direction:column;gap:8px}.dcvm p{padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.06);line-height:1.6}.dcvm b{display:block;font-size:11px;opacity:.7;margin-bottom:2px}`;document.head.appendChild(st)})();
