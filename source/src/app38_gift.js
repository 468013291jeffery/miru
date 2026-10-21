/* ---- v140 · gifts feel like gifts, and the heat setting matters in written stories ---- */
/* 1 · card choices: an item can carry a 💎 cost (premium gift); gift picks get a send animation + a "you sent" card */
function isGiftPick(d){const tt=String(Lz(d.title)||"")+String(d.ic||"");return /🎁|礼物|gift/i.test(tt)}
const _stopHTML38=stopHTML;
stopHTML=function(th){let h=_stopHTML38(th);const b=th.pk&&th.pk.stop;if(!b||b[1]!=="pick")return h;const d=b[2]||{};
 (d.items||[]).forEach((o,i)=>{if(o.cost&&!S.plus){h=h.replace('data-pkpick2="'+i+'">','data-pkpick2="'+i+'" class="pkprem"><em class="pkcost">💎'+o.cost+'</em>')}else if(o.cost){h=h.replace('data-pkpick2="'+i+'">','data-pkpick2="'+i+'" class="pkprem"><em class="pkcost">'+t("pay.vip")+'</em>')}});
 if(isGiftPick(d))h=h.replace('<div class="pkgrid','<p class="giftnote">'+t("gf.note")+'</p><div class="pkgrid');return h};
document.addEventListener("click",e=>{const x=e.target.closest("[data-pkpick2]");if(!x)return;const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop||th.pk.stop[1]!=="pick")return;
 const d=th.pk.stop[2]||{},o=(d.items||[])[+x.dataset.pkpick2];if(!o)return;
 if(o.cost&&!S.plus&&!spend(o.cost,"gift")){e.stopImmediatePropagation();e.preventDefault();return}
 if(isGiftPick(d)){giftFly(o.ic||"🎁");try{window.emoFx&&emoFx(o.cost?"bloom":"heartbeat")}catch(_){}}},true);
function giftFly(ic){const host=fxLayer();const g=document.createElement("div");g.className="giftfly";g.innerHTML='<span>'+ic+'</span>'+Array.from({length:12},(_,i)=>'<i style="--a:'+(i*30)+'deg"></i>').join("");host.appendChild(g);setTimeout(()=>g.remove(),1800);try{navigator.vibrate&&navigator.vibrate([30,40,30])}catch(_){}}
Object.assign(I18N.zh,{"gf.note":"选一件送给他。带💎的是限定礼物，会解锁专属反应。","gf.sent":"你送出了礼物"});
Object.assign(I18N.en,{"gf.note":"Pick one to give him. 💎 items are limited gifts with an exclusive reaction.","gf.sent":"You sent a gift"});
/* 2 · heat in written stories: 糖水/Fluff hides the intimate 🔒 extras and softens the romance effects; 成人向/Mature offers them every time */
const _stopAuto38=stopAuto;
stopAuto=function(th,b){if(b&&b[1]==="lock"&&S.heat==="fluff"){const d=b[2]||{};return d.skip||[["n","act",t("ht.fade")]]}return _stopAuto38(th,b)};
Object.assign(I18N.zh,{"ht.fade":"（镜头在这里移开了。想看这一段，把「想要多辣」调到慢热以上。）"});
Object.assign(I18N.en,{"ht.fade":"(The camera looks away here. To see this scene, raise your heat above Fluff.)"});
if(typeof window.emoFx==="function"){const _emo38=window.emoFx;window.emoFx=function(k){if(S.heat==="fluff"&&(k==="bloom"||k==="heartbeat"))k="longing";return _emo38(k)}}
(function(){const st=document.createElement("style");st.textContent=`
.pkprem{position:relative;border-color:rgba(240,183,126,.7)!important;background:linear-gradient(160deg,rgba(240,183,126,.16),rgba(238,111,151,.12))!important}
.pkcost{position:absolute;top:6px;right:6px;font-style:normal;font-size:10.5px;font-weight:800;padding:2px 7px;border-radius:99px;background:linear-gradient(135deg,#F0B77E,#EE6F97);color:#1B1017}
.giftnote{font-size:12px;color:#E9E2EE;text-align:center;margin:4px 0 8px}
.giftfly{position:absolute;left:50%;top:46%;z-index:30;pointer-events:none;transform:translate(-50%,-50%)}
.giftfly span{display:block;font-size:64px;animation:gfpop 1.6s cubic-bezier(.2,.8,.2,1) forwards;filter:drop-shadow(0 0 18px rgba(240,183,126,.8))}
.giftfly i{position:absolute;left:50%;top:50%;width:8px;height:8px;border-radius:50%;background:#F0B77E;transform:rotate(var(--a)) translateX(0);animation:gfspark 1.2s ease-out forwards}
@keyframes gfpop{0%{transform:scale(.2) translateY(60px);opacity:0}30%{transform:scale(1.25);opacity:1}55%{transform:scale(1)}100%{transform:scale(.9) translateY(-120px);opacity:0}}
@keyframes gfspark{0%{opacity:1;transform:rotate(var(--a)) translateX(0)}100%{opacity:0;transform:rotate(var(--a)) translateX(110px)}}`;document.head.appendChild(st)})();
