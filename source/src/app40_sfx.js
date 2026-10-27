/* ---- v142 · sound you can hear, effects that match their moment, pictures that come off the page ---- */
/* 0 · iPhone silent switch mutes Web Audio unless an <audio> element is playing → start a silent loop on the first tap */
let AU_OK=false;
function audioUnlock(){if(AU_OK)return;AU_OK=true;
 (typeof soft==="function"?soft:function(n,f){try{return f()}catch(e){}})("app40_sfx:L5",function(){if(navigator.audioSession)navigator.audioSession.type="playback"});
 try{const a=document.createElement("audio");a.setAttribute("playsinline","");a.loop=true;a.volume=.01;
  a.src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";document.body.appendChild(a);const p=a.play();if(p&&p.catch)p.catch(()=>{})}catch(_){}
 (typeof soft==="function"?soft:function(n,f){try{return f()}catch(e){}})("app40_sfx:L8",function(){if(typeof scInit==="function")scInit();else if(typeof bgmInit==="function")bgmInit();if(BGM.ctx&&BGM.ctx.state!=="running")BGM.ctx.resume()});
 try{const th=S.threads[curT];if(th&&bgmOn()&&$("#s-chat")&&!$("#s-chat").hidden&&typeof bgmForThread==="function")bgmForThread(th)}catch(_){}}
["pointerdown","touchend","click","keydown"].forEach(ev=>document.addEventListener(ev,()=>{audioUnlock();try{if(BGM.ctx&&BGM.ctx.state==="suspended")BGM.ctx.resume()}catch(_){}},{capture:true,passive:true}));
/* first time in a chat: a small hint that the music is on and can be turned off */
const _openThread40=openThread;openThread=function(){const r=_openThread40.apply(this,arguments);try{if(!S.sndTip&&bgmOn()){S.sndTip=1;save();setTimeout(()=>toast(t("sfx.tip")),1200)}}catch(_){}return r};
/* 1 · sound effects layered on the visual effects */
const SFX={cur:null,nodes:[],timers:[]};
function sfxCtx(){try{if(!bgmOn())return null;if(typeof scInit==="function")scInit();else if(typeof bgmInit==="function")bgmInit();const c=BGM.ctx;return c&&c.state==="running"?c:null}catch(_){return null}}
function sfxOut(c){if(!SFX.bus||SFX.bus.context!==c){SFX.bus=c.createGain();SFX.bus.gain.value=.55;SFX.bus.connect(c.destination)}return SFX.bus}
function noiseBuf(c,sec){const n=c.sampleRate*sec,b=c.createBuffer(1,n,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;return b}
function sfxStop(){SFX.timers.forEach(clearInterval);SFX.timers=[];const c=BGM&&BGM.ctx;SFX.nodes.forEach(n=>{try{if(n.gain&&c){n.gain.setTargetAtTime(0,c.currentTime,.4);setTimeout(()=>{try{n.disconnect()}catch(_){}},1500)}else n.stop&&n.stop()}catch(_){}});SFX.nodes=[];SFX.cur=null}
function bed(c,{type="bandpass",f=1200,q=.6,vol=.12,lfo=0}){const src=c.createBufferSource();src.buffer=noiseBuf(c,3);src.loop=true;const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=c.createGain();g.gain.value=0;g.gain.setTargetAtTime(vol,c.currentTime,.8);
 src.connect(fl).connect(g).connect(sfxOut(c));src.start();if(lfo){const o=c.createOscillator(),og=c.createGain();o.frequency.value=lfo;og.gain.value=vol*.6;o.connect(og).connect(g.gain);o.start();SFX.nodes.push(o)}SFX.nodes.push(src,g);return g}
function blip(c,{f0=800,f1=200,dur=.25,type="sine",vol=.2,at=0}){const t0=c.currentTime+at,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f0,t0);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t0+dur);g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.001,t0+dur);o.connect(g).connect(sfxOut(c));o.start(t0);o.stop(t0+dur+.05)}
function burst(c,{f=3000,dur=.08,vol=.25,at=0,type="highpass"}){const t0=c.currentTime+at,s=c.createBufferSource();s.buffer=noiseBuf(c,dur+.05);const fl=c.createBiquadFilter();fl.type=type;fl.frequency.value=f;const g=c.createGain();g.gain.setValueAtTime(vol,t0);g.gain.exponentialRampToValueAtTime(.001,t0+dur);s.connect(fl).connect(g).connect(sfxOut(c));s.start(t0)}
function thunder(c){const t0=c.currentTime,s=c.createBufferSource();s.buffer=noiseBuf(c,3);const fl=c.createBiquadFilter();fl.type="lowpass";fl.frequency.value=180;const g=c.createGain();g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(.5,t0+.08);g.gain.exponentialRampToValueAtTime(.001,t0+2.8);s.connect(fl).connect(g).connect(sfxOut(c));s.start(t0)}
const SFX_KIND={
 rain:c=>{bed(c,{f:1800,q:.4,vol:.10});bed(c,{type:"lowpass",f:500,vol:.05})},
 glassrain:c=>SFX_KIND.rain(c),
 storm:c=>{SFX_KIND.rain(c);thunder(c);SFX.timers.push(setInterval(()=>Math.random()<.5&&thunder(c),7000))},
 thunder:c=>SFX_KIND.storm(c),
 snow:c=>bed(c,{type:"lowpass",f:420,q:.3,vol:.08,lfo:.15}),frost:c=>SFX_KIND.snow(c),wind:c=>bed(c,{type:"bandpass",f:600,q:.8,vol:.09,lfo:.2}),
 ice:c=>{SFX_KIND.snow(c);for(let i=0;i<6;i++)burst(c,{f:4000+i*500,dur:.04,vol:.12,at:i*.35})},
 iceshatter:c=>{for(let i=0;i<14;i++)burst(c,{f:2500+Math.random()*5000,dur:.06+Math.random()*.1,vol:.2,at:2.3+Math.random()*.4});blip(c,{f0:3200,f1:900,dur:.5,type:"triangle",vol:.12,at:2.3})},
 danger:c=>{blip(c,{f0:2400,f1:300,dur:.35,type:"sawtooth",vol:.12});blip(c,{f0:1800,f1:200,dur:.4,type:"square",vol:.06,at:.45});let n=0;const iv=setInterval(()=>{if(++n>4){clearInterval(iv);return}blip(c,{f0:1400,f1:1400,dur:.08,type:"square",vol:.05})},900);SFX.timers.push(iv)},
 flashes:c=>{for(let i=0;i<7;i++){burst(c,{f:5000,dur:.03,vol:.22,at:i*.13+Math.random()*.08});burst(c,{f:1800,dur:.05,vol:.1,at:i*.13+.03})}},
 blackout:c=>{blip(c,{f0:180,f1:40,dur:.9,type:"sawtooth",vol:.18});burst(c,{f:200,dur:.3,vol:.25,type:"lowpass"})},
 drip:c=>{SFX.timers.push(setInterval(()=>blip(c,{f0:1400+Math.random()*600,f1:500,dur:.12,vol:.09}),1400))},
 candle:c=>{bed(c,{type:"lowpass",f:700,vol:.03});SFX.timers.push(setInterval(()=>burst(c,{f:2500,dur:.02,vol:.05+Math.random()*.06}),260))},
 embers:c=>SFX_KIND.candle(c),inferno:c=>{bed(c,{type:"lowpass",f:300,vol:.12});SFX_KIND.candle(c)},
 hearts:c=>{[660,880,990].forEach((f,i)=>blip(c,{f0:f,f1:f,dur:.6,type:"sine",vol:.06,at:i*.12}))},
 godrays:c=>{[523,659,784,1046].forEach((f,i)=>blip(c,{f0:f,f1:f,dur:1.4,type:"sine",vol:.045,at:i*.09}))},
 fireworks:c=>{for(let i=0;i<5;i++){blip(c,{f0:300,f1:1600,dur:.5,type:"sine",vol:.05,at:i*.8});burst(c,{f:900,dur:.4,vol:.18,type:"lowpass",at:i*.8+.5})}}};
function sfxSet(kind){if(kind===SFX.cur)return;sfxStop();const c=sfxCtx();if(!c||!kind||kind==="none"||kind==="__none")return;const f=SFX_KIND[kind];if(!f)return;SFX.cur=kind;try{f(c)}catch(_){}}
const _fxRun40=fxRun;fxRun=function(k){try{if($("#s-chat")&&!$("#s-chat").hidden)sfxSet(k)}catch(_){}return _fxRun40.apply(this,arguments)};
const _bgmStop40=typeof bgmStop==="function"?bgmStop:null;if(_bgmStop40)bgmStop=function(){sfxStop();return _bgmStop40.apply(this,arguments)};
/* one-shot sounds for story moments */
function sfxOne(k){const c=sfxCtx();if(!c)return;
 if(k==="gun"){burst(c,{f:150,dur:.35,vol:.6,type:"lowpass"});burst(c,{f:2500,dur:.12,vol:.35});blip(c,{f0:120,f1:40,dur:.4,vol:.3})}
 if(k==="ring"){for(let i=0;i<2;i++){blip(c,{f0:880,f1:880,dur:.35,type:"sine",vol:.08,at:i*.5});blip(c,{f0:660,f1:660,dur:.35,type:"sine",vol:.06,at:i*.5+.05})}}
 if(k==="msg"){blip(c,{f0:1320,f1:1320,dur:.12,vol:.07});blip(c,{f0:1760,f1:1760,dur:.14,vol:.06,at:.1})}
 if(k==="unsend"){blip(c,{f0:900,f1:300,dur:.25,type:"triangle",vol:.07})}}
PKREG.add("app40_sfx.js", function(th,b, next){try{if(Array.isArray(b)&&b[0]==="sys"&&curT===th.id&&!PKSKIP[th.id]){const d=b[2]||{};const tx=String((Lz(d.title)||"")+(Lz(d.txt)||""));
  if(b[1]==="event"&&/枪|gunshot|shot|💥/.test(tx+(d.icon||"")))sfxOne("gun");else if(b[1]==="event"&&/🔔|📱|消息|message/.test(tx+(d.icon||"")))sfxOne("msg");if(b[1]==="recall")sfxOne("unsend")}}catch(_){}return next(th,b)});;
Object.assign(I18N.zh,{"sfx.tip":"🎵 本剧有配乐和音效 · 右上角 🎵 可关闭"});Object.assign(I18N.en,{"sfx.tip":"🎵 This story has music and sound · tap 🎵 at the top to turn it off"});
/* 2 · intense effects belong to their moment: they fade back to calm on their own */
const FX_LIFE={danger:7000,flashes:1500,blackout:6000,fireworks:6000,iceshatter:4000};
const _fxSet40=fxSet;fxSet=function(th,k){_fxSet40(th,k);clearTimeout(fxSet._t40);const life=FX_LIFE[k];if(life)fxSet._t40=setTimeout(()=>{if(th.pk&&th.pk.fx===k)_fxSet40(th,"none")},life)};
/* 3 · "off the page": the background picture breaks out of its frame toward you at big moments */
function cutFor(src){try{const m=String(src).match(/art\/scenes\/([a-z0-9_]+)\/([a-z0-9_]+)\.(jpg|png|webp)/i);if(!m)return null;const k=m[1]+"_"+m[2];return (window.CUT_FILES||[]).includes(k)?"art/cut/"+k+".webp":null}catch(_){return null}}
function popOut(kind,imgId){try{if(PKSKIP[curT])return;const im=$(".cbimg img.on")||$(".cbimg img");const src=(imgId&&(window.SCENE_FILES||{})[imgId])||(im&&im.src);if(!src)return;if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
 const cut=cutFor(src);const L=fxLayer(),o=document.createElement("div");o.className="pop3d "+kind+(cut?" cut":"");
 o.innerHTML='<div class="p3stage"><div class="p3card"><div class="p3bg" style="background-image:url(\''+src+'\')"></div><div class="p3frame"></div></div>'+(cut?'<div class="p3fig" style="background-image:url(\''+cut+'\')"></div>':'<div class="p3img" style="background-image:url(\''+src+'\')"></div>')+'</div>'+(kind==="gun"?'<div class="p3flash"></div>':'')+(kind==="kiss"?'<div class="p3glow"></div>':'');
 L.appendChild(o);setTimeout(()=>o.remove(),kind==="gun"?1800:2800);try{navigator.vibrate&&navigator.vibrate(kind==="gun"?[60,40,120]:[30])}catch(_){}
 try{if(kind==="gun")sfxOne("gun")}catch(_){}}catch(_){}}
window.popOut=popOut;
PKREG.add("app40_sfx.js", function(th,b, next){try{if(Array.isArray(b)&&b[0]==="sys"&&b[1]==="event"&&curT===th.id){const d=b[2]||{};const tx=String((Lz(d.title)||"")+(Lz(d.txt)||"")+(d.icon||""));if(/枪|gunshot|shot|💥|撞开/.test(tx))setTimeout(()=>popOut("gun"),50);else if(/吻|kiss|抱|hug|💞|🔥/.test(tx))setTimeout(()=>popOut("kiss"),50)}}catch(_){}return next(th,b)});;
document.addEventListener("click",e=>{const x=e.target.closest("[data-chgo]");if(!x)return;try{const th=S.threads[curT],o=th.pk.stop[2].opts[CH.i];if(o&&["kiss","bold"].includes(o.att))setTimeout(()=>popOut("kiss"),700)}catch(_){}},true);
document.addEventListener("click",e=>{if(e.target.closest("[data-lockgo],[data-lockbuy]"))setTimeout(()=>popOut("kiss"),900)},true);
(function(){const st=document.createElement("style");st.textContent=`
.scurt.pic{background:#000!important}
.scurt .scimg{position:absolute;inset:0;overflow:hidden;opacity:0;transition:opacity .7s ease}.scurt.on .scimg{opacity:1}
.scurt .scimg img{width:100%;height:100%;object-fit:cover;transform:scale(1.15);transition:transform 3.2s ease-out}.scurt.on .scimg img{transform:scale(1.02)}
.scurt .scshade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,.15) 45%,rgba(0,0,0,.8))}
.scurt.pic .scin{position:relative;align-self:end;margin-bottom:22%}
.pop3d{position:absolute;inset:0;perspective:900px;pointer-events:none;z-index:45;background:rgba(6,5,9,0);animation:p3dim 2.8s ease forwards}
@keyframes p3dim{0%{background:rgba(6,5,9,0)}12%,82%{background:rgba(6,5,9,.72)}100%{background:rgba(6,5,9,0)}}
.p3stage{position:absolute;inset:0;transform-style:preserve-3d}
.p3card{position:absolute;left:10%;right:10%;top:20%;bottom:24%;border-radius:8px;overflow:hidden;box-shadow:0 30px 70px rgba(0,0,0,.7);transform:rotateX(8deg) rotateY(-6deg);opacity:0;animation:p3card 2.8s ease forwards}
.p3bg{position:absolute;inset:-4%;background-size:cover;background-position:center 30%;filter:brightness(.7) saturate(.9)}
.cut .p3frame{position:absolute;inset:0;border:4px solid rgba(255,255,255,.9);border-radius:8px;box-shadow:inset 0 0 40px rgba(0,0,0,.6);opacity:1;animation:none}
@keyframes p3card{0%{opacity:0;transform:rotateX(8deg) rotateY(-6deg) scale(.85)}14%{opacity:1;transform:rotateX(8deg) rotateY(-6deg) scale(1)}82%{opacity:1}100%{opacity:0;transform:rotateX(8deg) rotateY(-6deg) scale(.96)}}
.p3fig{position:absolute;left:10%;right:10%;top:20%;bottom:24%;background-size:cover;background-position:center 30%;transform-origin:50% 85%;opacity:0;filter:drop-shadow(0 26px 30px rgba(0,0,0,.75)) drop-shadow(0 0 2px rgba(255,255,255,.4));animation:p3fig 2.8s cubic-bezier(.2,.9,.2,1) forwards}
@keyframes p3fig{0%{opacity:0;transform:rotateX(8deg) rotateY(-6deg) scale(.85)}14%{opacity:1;transform:rotateX(8deg) rotateY(-6deg) scale(1)}42%{transform:translateZ(150px) translateY(-6%) scale(1.32)}70%{transform:translateZ(170px) translateY(-7%) scale(1.36)}84%{opacity:1}100%{opacity:0;transform:translateZ(220px) translateY(-8%) scale(1.45)}}
.cut.gun .p3fig{animation:p3figgun 1.8s cubic-bezier(.1,.9,.2,1) forwards}
@keyframes p3figgun{0%{opacity:0;transform:scale(.9)}10%{opacity:1;transform:scale(1)}24%{transform:translateZ(200px) translateY(-5%) scale(1.38) rotate(-2deg)}32%{transform:translateZ(180px) translateY(-4%) scale(1.33) rotate(1.5deg)}80%{opacity:1}100%{opacity:0;transform:translateZ(300px) scale(1.6)}}
.cut.gun .p3card,.cut.gun{animation-duration:1.8s}
.p3glow{position:absolute;left:0;right:0;bottom:0;height:60%;background:radial-gradient(ellipse at 50% 100%,rgba(255,170,140,.45),transparent 70%);opacity:0;animation:p3glow 2.8s ease forwards}
@keyframes p3glow{0%,10%{opacity:0}40%{opacity:1}100%{opacity:0}}
.pop3d:not(.cut) .p3card{display:none}
.p3frame{position:absolute;left:9%;right:9%;top:22%;bottom:30%;border:3px solid rgba(255,255,255,.85);border-radius:6px;box-shadow:0 0 0 2000px rgba(0,0,0,.55),0 20px 60px rgba(0,0,0,.6);opacity:0;animation:p3frame 2.2s ease forwards}
.p3img{position:absolute;left:9%;right:9%;top:22%;bottom:30%;background-size:cover;background-position:center 30%;border-radius:6px;transform-origin:50% 60%;opacity:0;animation:p3pop 2.2s cubic-bezier(.2,.9,.2,1) forwards;filter:drop-shadow(0 30px 40px rgba(0,0,0,.7))}
@keyframes p3frame{0%{opacity:0;transform:scale(.9)}15%{opacity:1;transform:scale(1)}80%{opacity:1}100%{opacity:0}}
@keyframes p3pop{0%{opacity:0;transform:translateZ(-120px) scale(.9);clip-path:inset(0)}18%{opacity:1;transform:translateZ(0) scale(1);clip-path:inset(0)}45%{transform:translateZ(240px) rotateX(6deg) scale(1.28);clip-path:inset(-30% -30% -30% -30%)}75%{opacity:1;transform:translateZ(200px) rotateX(4deg) scale(1.22)}100%{opacity:0;transform:translateZ(320px) scale(1.45)}}
.pop3d.gun .p3img{animation:p3gun 1.4s cubic-bezier(.1,.9,.2,1) forwards}
@keyframes p3gun{0%{opacity:0;transform:scale(.9)}10%{opacity:1;transform:scale(1)}22%{transform:translateZ(380px) scale(1.5) rotate(-2deg)}30%{transform:translateZ(340px) scale(1.42) rotate(1.5deg)}80%{opacity:1}100%{opacity:0;transform:translateZ(420px) scale(1.6)}}
.p3flash{position:absolute;inset:0;background:radial-gradient(circle at 55% 45%,rgba(255,240,200,.95),rgba(255,160,60,.4) 25%,transparent 55%);opacity:0;animation:p3fl .5s ease .25s}
@keyframes p3fl{0%{opacity:0}20%{opacity:1}100%{opacity:0}}`;document.head.appendChild(st)})();
