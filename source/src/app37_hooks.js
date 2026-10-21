/* ---- v139 · three story hooks ----
   ["sys","recall",{who,txt}]                      — "X unsent a message" · 👀 see it (💎2, first free, members free)
   [cid,"missed",{cid,lines,then,skip}]            — he calls, hangs up before you answer → 📞 call back (💎2) to hear what he wanted to say
   [pov,"reveal",{img,img2,title,lines:[…]}]       — a high point played full-screen: image, slow push-in, lines one by one */
if(typeof PAY!=="undefined")Object.assign(PAY,{recall:2,missed:PRICES.callMin});
STOPK.add("missed");STOPK.add("reveal");
/* 1 · unsent message */
const _pkDir37=pkDirective;
pkDirective=function(th,b){if(Array.isArray(b)&&b[0]==="sys"&&b[1]==="recall"){th.pk.q.shift();const d=b[2]||{};appendMsg(th,{who:"sys",k:"xrecall",rw:d.who,txt:Lz(d.txt)||d.txt,at:Date.now()});save();return true}return _pkDir37(th,b)};
const _msgHTML37=msgHTML;
msgHTML=function(m,i,th){if(!m||m.k!=="xrecall")return _msgHTML37(m,i,th);const c=ch(m.rw),nm=c?first(c.n):"";
 if(m.open)return '<div class="xrc open" data-mi="'+i+'">'+avatar(m.rw,30)+'<div class="xrcb"><small>'+esc(t("rc.was",{n:nm}))+'</small><p>'+esc(m.txt)+'</p></div></div>';
 return '<div class="xrc" data-mi="'+i+'"><span class="xrcl">'+esc(t("rc.unsent",{n:nm}))+'</span><button data-xrc="'+i+'">👀 '+t("rc.see")+' · '+(typeof payTag==="function"?payTag("recall"):"💎2")+'</button></div>'};
document.addEventListener("click",e=>{const x=e.target.closest("[data-xrc]");if(!x)return;const th=S.threads[curT];const m=th&&th.msgs[+x.dataset.xrc];if(!m)return;if(typeof payGo==="function"&&!payGo("recall"))return;m.open=1;save();renderChat();try{window.emoFx&&emoFx("ink")}catch(_){}});
/* 2 · missed call → call back */
const _stopAuto37=stopAuto;
stopAuto=function(th,b){if(b&&b[1]==="missed"){const d=b[2]||{},as=th.pk.as;if(as===d.cid)return [["n","act",t("ms.youHang",{n:first(ch(th.cast.find(c=>c!==d.cid&&ch(c))||mainOf(th)).n)})]].concat(d.skip||[]);if(!as||as==="watch"||as==="side")return d.skip||[];return null}
 if(b&&b[1]==="reveal"){if(PKSKIP[th.id])return revealBeats(b[2]);return null}
 return _stopAuto37(th,b)};
const MS={};
const _stopHTML37=stopHTML;
stopHTML=function(th){const b=th.pk.stop;if(!b||(b[1]!=="missed"&&b[1]!=="reveal"))return _stopHTML37(th);const d=b[2]||{};
 if(b[1]==="reveal"){setTimeout(()=>revealOpen(th),60);return '<div class="sttag">✨ '+esc(Lz(d.title)||t("rv.h"))+'</div><button class="btn btn-p btn-block" data-rvopen="1">▶ '+t("rv.play")+'</button>'}
 const c=ch(d.cid||mainOf(th)),nm=c?first(c.n):"",k=th.id+"|"+(th.pk.q?th.pk.q.length:0);
 if(!MS[k]){MS[k]=Date.now();setTimeout(()=>{if(th.pk.stop===b)packRefresh(th)},3600);try{navigator.vibrate&&navigator.vibrate([200,120,200,120,200])}catch(_){}}
 const ringing=Date.now()-MS[k]<3500;
 if(ringing)return '<div class="mscall ring">'+avatar(d.cid,64)+'<b>'+esc(nm)+'</b><span>'+t("ms.ring")+'</span><div class="msdots"><i></i><i></i><i></i></div></div>';
 return '<div class="mscall"><div class="msmiss">'+avatar(d.cid,46)+'<div><b>'+esc(t("ms.missed",{n:nm}))+'</b><span>'+esc(Lz(d.hint)||t("ms.hint"))+'</span></div></div>'+
  '<div class="row" style="gap:8px;margin-top:10px"><button class="btn btn-g grow" data-msno="1">'+t("ms.later")+'</button><button class="btn btn-p grow" data-msback="1">📞 '+t("ms.back")+' · '+(typeof payTag==="function"?payTag("missed"):"💎2")+'</button></div></div>'};
document.addEventListener("click",e=>{const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop)return;const b=th.pk.stop,d=b[2]||{};
 if(b[1]==="missed"&&e.target.closest("[data-msback]")){if(typeof payGo==="function"&&!payGo("missed"))return;const c=ch(d.cid);
  stopResolve(th,[["n","act",t("ms.dial",{n:first(c.n)})]].concat((d.lines||[]).map(([w,x])=>[w,"say",x])).concat(d.then||[]));return}
 if(b[1]==="missed"&&e.target.closest("[data-msno]")){stopResolve(th,d.skip||[]);return}
 if(b[1]==="reveal"&&e.target.closest("[data-rvopen]")){revealOpen(th);return}});
/* 3 · full-screen high-point reveal */
function revealBeats(d){return (Lz(d.lines)||d.lines||[]).map(x=>["n","act",x])}
let RV=null;
function revealOpen(th){if(RV&&!document.body.contains(RV.o)){clearTimeout(RV.tm);RV=null}if(RV||!th.pk.stop||th.pk.stop[1]!=="reveal")return;const d=th.pk.stop[2]||{},lines=Lz(d.lines)||d.lines||[];
 const img=(window.SCENE_FILES||{})[d.img]||"",img2=d.img2&&(window.SCENE_FILES||{})[d.img2]||"";
 const o=document.createElement("div");o.className="rvov";o.innerHTML='<div class="rvbg"><img src="'+img+'" alt="">'+(img2?'<img class="b" src="'+img2+'" alt="">':'')+'</div><div class="rvshade"></div><div class="rvtitle">'+esc(Lz(d.title)||"")+'</div><div class="rvlines"></div><div class="rvtap">'+t("rv.tap")+'</div>';
 fxLayer().appendChild(o);RV={th,o,i:0,lines,img2:!!img2};requestAnimationFrame(()=>o.classList.add("on"));try{window.emoFx&&emoFx("bloom")}catch(_){}revealStep()}
function revealStep(){if(!RV)return;const {o,lines}=RV;if(RV.i>=lines.length){revealClose();return}
 const box=o.querySelector(".rvlines");box.insertAdjacentHTML("beforeend",'<p>'+esc(lines[RV.i])+'</p>');const ps=box.querySelectorAll("p");if(ps.length>3)ps[0].remove();
 if(RV.img2&&RV.i===Math.floor(lines.length/2))o.classList.add("two");RV.i++;clearTimeout(RV.tm);RV.tm=setTimeout(revealStep,3400)}
function revealClose(){if(!RV)return;const {th,o,lines}=RV;clearTimeout(RV.tm);RV=null;o.classList.remove("on");setTimeout(()=>o.remove(),500);
 if(th.pk.stop&&th.pk.stop[1]==="reveal")stopResolve(th,lines.map(x=>["n","act",x]))}
document.addEventListener("click",e=>{if(RV&&e.target.closest(".rvov"))revealStep()});
Object.assign(I18N.zh,{"rc.unsent":"{n} 撤回了一条消息","rc.see":"偷看","rc.was":"{n} 撤回的那条：","ms.ring":"来电中……","ms.missed":"{n} 的未接来电","ms.hint":"响了三声，他自己挂断了。","ms.later":"先不回","ms.back":"回拨","ms.dial":"📞 你回拨过去。响到第二声，他接了。","ms.youHang":"📞 你拨了{n}的号码，在响第二声之前，自己挂断了。","rv.h":"高光时刻","rv.play":"观看","rv.tap":"点击继续"});
Object.assign(I18N.en,{"rc.unsent":"{n} unsent a message","rc.see":"Peek","rc.was":"What {n} unsent:","ms.ring":"Calling…","ms.missed":"Missed call from {n}","ms.hint":"Three rings — then he hung up himself.","ms.later":"Not now","ms.back":"Call back","ms.dial":"📞 You call back. He picks up on the second ring.","ms.youHang":"📞 You dial {n} — and hang up before the second ring.","rv.h":"Big moment","rv.play":"Watch","rv.tap":"Tap to continue"});
(function(){const st=document.createElement("style");st.textContent=`
.xrc{display:flex;flex-direction:column;align-items:center;gap:6px;margin:10px auto;max-width:86%;text-align:center}
.xrcl{font-size:12px;color:#B4ABBF;background:rgba(10,9,14,.55);padding:4px 12px;border-radius:99px}
.xrc button{font-size:12.5px;font-weight:700;color:#F0B77E;background:rgba(240,183,126,.1);border:1px dashed rgba(240,183,126,.6);padding:6px 14px;border-radius:99px}
.xrc.open{flex-direction:row;align-items:flex-start;text-align:left;margin-left:12px}
.xrcb{background:rgba(20,18,28,.8);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:8px 12px}
.xrcb small{display:block;font-size:10.5px;color:#C3B2F5;margin-bottom:3px}.xrcb p{margin:0;font-size:15px;color:#fff;text-decoration:line-through;text-decoration-color:rgba(255,255,255,.35)}
.mscall{display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 4px}
.mscall.ring b{font-size:18px}.mscall.ring span{font-size:12px;color:#B4ABBF}
.mscall.ring .av{animation:msring 1s ease-in-out infinite;box-shadow:0 0 0 0 rgba(95,211,154,.6);border-radius:50%}
@keyframes msring{0%{box-shadow:0 0 0 0 rgba(95,211,154,.6)}70%{box-shadow:0 0 0 18px rgba(95,211,154,0)}100%{box-shadow:0 0 0 0 rgba(95,211,154,0)}}
.msdots{display:flex;gap:5px}.msdots i{width:6px;height:6px;border-radius:50%;background:#5FD39A;animation:msd 1s infinite}.msdots i:nth-child(2){animation-delay:.2s}.msdots i:nth-child(3){animation-delay:.4s}
@keyframes msd{0%,100%{opacity:.2}50%{opacity:1}}
.msmiss{display:flex;gap:10px;align-items:center;width:100%;background:rgba(227,106,106,.12);border:1px solid rgba(227,106,106,.4);border-radius:14px;padding:10px}
.msmiss b{display:block;color:#F6C9D0;font-size:14px}.msmiss span{display:block;font-size:12px;color:#D8CFE0;margin-top:2px}
.mscall .row{width:100%}
.rvov{position:absolute;inset:0;z-index:40;pointer-events:auto;background:#000;opacity:0;transition:opacity .6s ease;overflow:hidden;cursor:pointer}
.rvov.on{opacity:1}
.rvbg,.rvbg img{position:absolute;inset:0;width:100%;height:100%}
.rvbg img{object-fit:cover;animation:rvkb 14s ease-out forwards;transition:opacity 1.4s ease}
.rvbg img.b{opacity:0}.rvov.two .rvbg img.b{opacity:1}
@keyframes rvkb{from{transform:scale(1.18) translateY(3%)}to{transform:scale(1.02)}}
.rvshade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.35) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,.25) 55%,rgba(0,0,0,.88) 100%)}
.rvtitle{position:absolute;top:calc(14px + env(safe-area-inset-top,0px));left:0;right:0;text-align:center;font-size:11px;letter-spacing:.32em;color:#F0B77E;font-weight:800}
.rvlines{position:absolute;left:22px;right:22px;bottom:70px;display:flex;flex-direction:column;gap:10px}
.rvlines p{margin:0;color:#fff;font-size:16px;line-height:1.65;text-shadow:0 2px 12px rgba(0,0,0,.9);animation:rvin 1s ease}
.rvlines p:not(:last-child){opacity:.55;font-size:14px}
@keyframes rvin{from{opacity:0;transform:translateY(12px);filter:blur(4px)}to{opacity:1;transform:none;filter:none}}
.rvtap{position:absolute;bottom:24px;left:0;right:0;text-align:center;font-size:11px;color:rgba(255,255,255,.6);letter-spacing:.2em}`;document.head.appendChild(st)})();
