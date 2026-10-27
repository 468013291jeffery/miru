/* ================= RELATIONSHIP DIMENSIONS, wired to the script =================
   A story declares its pairs in pack.dims: [{a,b,main,seed:{att,tru,jea,ten,gru}}]  (吸引 / 信任 / 嫉妒 / 张力 / 旧恨).
   They move ONLY because of what happens in the story:
   - every choice carries rd deltas (opts[].rd = {"nico|theo":{att:+6,…}}), applied whether you pick it or it auto-plays;
   - ["sys","rd",{p,d,why}] after big events (the blackout, Mason confessing, Rowan's secret…);
   - game results (heartbeat, bottle, photo booth) and unlocked key scenes.
   The top bar shows the main pair's five meters + a stage word; tap for every pair and the log of what changed them. */
const DIMK=["att","tru","jea","ten","gru"],DIMI={att:"💗",tru:"🤝",jea:"😤",ten:"⚡",gru:"🥀"};
function dimPairs(th){if(!th)return null;const w=wd(th.wid);if(w&&w.pack&&w.pack.dims)return w.pack.dims;
 if(th.pk&&w){const C=th.cast.filter(c=>ch(c));if(C.length<1)return null;const a=(w.pack&&w.pack.pov&&ch(w.pack.pov))?w.pack.pov:C[0],b=(w.pack&&w.pack.love&&w.pack.love!==a)?w.pack.love:(C.find(c=>c!==a)||C[0]);
  if(a===b)return null;th._dp=th._dp||[{a,b,main:1,seed:dimSeed(a+b)}];return th._dp}
 const m=mainOf(th);if(!ch(m))return null;th._dp=th._dp&&th._dp[0].b===m?th._dp:[{a:"me",b:m,main:1,seed:Object.assign(dimSeed(m),{att:Math.max(10,Math.round(th.love[m]||10))})}];return th._dp}
function dimSeed(k){const h=hash(k);return {att:30+h%20,tru:28+(h>>3)%20,jea:8+(h>>6)%12,ten:24+(h>>9)%20,gru:4+(h>>12)%14}}
function dimName(id){return id==="me"?(((persona()||{}).name)||t("mom.you")):first(ch(id).n)}
function dimAv(id,n){return id==="me"?(typeof meAv==="function"?meAv(n):""):avatar(id,n)}
function dimKey(a,b){return a+"|"+b}
function dimState(th){const P=dimPairs(th);if(!P)return null;th.rdv=th.rdv||{};P.forEach(p=>{const k=dimKey(p.a,p.b);if(!th.rdv[k])th.rdv[k]=Object.assign({att:30,tru:30,jea:10,ten:30,gru:10},p.seed||{})});return th.rdv}
function dimFind(th,k){const v=dimState(th);if(!v)return null;if(v[k])return k;const [a,b]=k.split("|"),r=b+"|"+a;return v[r]?r:null}
function dimAdd(th,k,d,why){const key=dimFind(th,k);if(!key)return;const r=th.rdv[key],ch0=[];
 for(const x in d){if(!DIMK.includes(x))continue;const o=r[x],v=+d[x]||0,sv=Math.sign(v)*Math.max(1,Math.round(Math.abs(v)*.5));r[x]=Math.max(0,Math.min(100,o+sv));const dd=r[x]-o;if(dd)ch0.push([x,dd])}
 if(!ch0.length)return;th.rdlog=th.rdlog||[];th.rdlog.push({k:key,c:ch0,why:why||"",at:Date.now()});th.rdlog=th.rdlog.slice(-40);save();
 if(curT===th.id){dimSync(th);dimFloat(key,ch0)}}
function dimApply(th,rd,why){for(const k in rd)dimAdd(th,k,rd[k],why)}
function dimStage(r){if(r.gru>=60)return "gru";if(r.att>=80&&r.ten>=75)return "fire";if(r.att>=70&&r.tru>=60)return "sync";if(r.jea>=55)return "jea";if(r.ten>=60)return "pull";if(r.tru<30)return "guard";return "warm"}
function dimMain(th){const P=dimPairs(th);return P&&(P.find(p=>p.main)||P[0])}
function dimBarHTML(th){const P=dimPairs(th);if(!P)return "";dimState(th);
 return '<div class="dimrow" data-dimrow="1">'+P.map(p=>{const k=dimKey(p.a,p.b),r=th.rdv[k],st=dimStage(r);
  return '<button class="dimc'+(p.main?" main":"")+'" data-dimk="'+k+'"><div class="dimh">'+dimAv(p.a,22)+dimAv(p.b,22)+'<b>'+esc(dimName(p.a))+' × '+esc(dimName(p.b))+'</b><em class="ds-'+st+'">'+t("dm.s."+st)+'</em></div>'+
   (p.main?'<div class="dimm">'+DIMK.map(x=>'<span class="dm-'+x+'" data-dimx="'+x+'"><small>'+DIMI[x]+' '+t("rd."+x)+' <b class="num">'+r[x]+'</b></small><i><u style="width:'+r[x]+'%"></u></i></span>').join("")+'</div>'
   :'<div class="dimm mini">'+DIMK.filter(x=>x!=="jea").slice(0,4).map(x=>'<span class="dm-'+x+'" data-dimx="'+x+'"><small>'+DIMI[x]+'</small><b class="num">'+r[x]+'</b></span>').join("")+'</div>')+'</button>'}).join("")+'</div>'}
function dimSync(th){if(!th||curT!==th.id||!dimPairs(th))return;const old=$(".dimrow"),sc=old&&old.scrollLeft;const h=dimBarHTML(th);
 if(old)old.outerHTML=h;else{const s=$(".status")||$(".relrow");if(s)s.insertAdjacentHTML("beforebegin",h)}const n=$(".dimrow");if(n&&sc)n.scrollLeft=sc}
function dimFloat(key,ch0){const c=$('.dimc[data-dimk="'+key+'"]');if(!c)return;c.classList.add("pulse");setTimeout(()=>c.classList.remove("pulse"),900);
 ch0.forEach(([x,dd],i)=>{const sp=c.querySelector('[data-dimx="'+x+'"]')||c;sp.insertAdjacentHTML("beforeend",'<span class="dimf '+(dd>0?"up":"down")+'" style="animation-delay:'+(i*.12)+'s">'+(dd>0?"+":"")+dd+'</span>');setTimeout(()=>{const f=sp.querySelector(".dimf");if(f)f.remove()},1800)})}
/* replace the old single-number bar for stories that have dimensions */
const _relSync21=relSync;relSync=function(th){if(th&&dimPairs(th)){dimHeader(th);const r=$(".relrow");if(r)r.remove();dimSync(th);return}_relSync21(th)};
PKREG.add("app21_dims.js", function(th,b, next){if(Array.isArray(b)&&b[0]==="sys"&&b[1]==="rd"){th.pk.q.shift();const x=b[2]||{};dimAdd(th,x.p,x.d||{},Lz(x.why));return true}return next(th,b)});;
/* games & unlocks move the main pair */
const _featDone21=featDone;featDone=function(th,ctx){const f=PKFEAT;const r=_featDone21(th,ctx);if(r&&f&&f.th===th){const m=dimMain(th);if(m){const k=dimKey(m.a,m.b),txt=String(ctx&&ctx.txt||"");
  if(f.k==="heart"){const mm=txt.match(/to (\d+) bpm/),bpm=mm?+mm[1]:0;dimAdd(th,k,bpm>=150?{att:6,ten:8}:{ten:3},t("dm.w.heart",{n:bpm}))}
  if(f.k==="bottle")dimAdd(th,k,{tru:6,ten:4},t("dm.w.bottle"));if(f.k==="snap")dimAdd(th,k,{att:4,ten:3},t("dm.w.snap"));if(f.k==="quiz")dimAdd(th,k,{tru:5},t("dm.w.quiz"))}}return r};
document.addEventListener("click",e=>{if(!e.target.closest("[data-lockgo]"))return;const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop||th.pk.stop[1]!=="lock")return;
 const k=lockKey(th,th.pk.stop[2]),had=!!(S.unlocked||{})[k];setTimeout(()=>{const m=dimMain(th);if(m&&!had&&(S.unlocked||{})[k])dimAdd(th,dimKey(m.a,m.b),{att:6,ten:8},t("dm.w.lock"))},80)},true);
/* detail sheet */
document.addEventListener("click",e=>{const x=e.target.closest("[data-dimk]");if(!x)return;const th=S.threads[curT];if(!th)return;const P=dimPairs(th);dimState(th);
 sheet('<h2>'+t("dm.h")+'</h2><p class="xs faint" style="margin-top:4px">'+t("dm.s")+'</p>'+P.map(p=>{const k=dimKey(p.a,p.b),r=th.rdv[k],st=dimStage(r);
  return '<div class="dimsh"><div class="dimh">'+dimAv(p.a,26)+dimAv(p.b,26)+'<b>'+esc(dimName(p.a))+' × '+esc(dimName(p.b))+'</b><em class="ds-'+st+'">'+t("dm.s."+st)+'</em></div>'+
   DIMK.map(x=>'<div class="dimline dm-'+x+'"><small>'+DIMI[x]+' '+t("rd."+x)+'</small><i><u style="width:'+r[x]+'%"></u></i><b class="num">'+r[x]+'</b></div>').join("")+'</div>'}).join("")+
  '<div class="eyebrow" style="margin-top:14px">'+t("dm.log")+'</div>'+((th.rdlog||[]).slice(-10).reverse().map(l=>{const [a,b]=l.k.split("|");return '<div class="dimlog"><b>'+esc(dimName(a))+'×'+esc(dimName(b))+'</b> '+l.c.map(([x,d])=>'<span class="'+(d>0?"up":"down")+'">'+t("rd."+x)+(d>0?" +":" ")+d+'</span>').join(" ")+(l.why?'<em>'+esc(String(l.why).slice(0,40))+'</em>':'')+'</div>'}).join("")||'<p class="xs faint">'+t("dm.none")+'</p>'))});
Object.assign(I18N.en,{"dm.h":"Between them","dm.s":"Every number here moves only because of what happened in the story — your choices, the games, the scenes you unlocked.","dm.log":"What changed it","dm.none":"Nothing yet — make your first choice.",
 "dm.s.gru":"Old wounds","dm.s.fire":"About to break","dm.s.sync":"Unspoken","dm.s.jea":"Jealous","dm.s.pull":"Push & pull","dm.s.guard":"On guard","dm.s.warm":"More than friends",
 "dm.w.heart":"Heartbeat hit {n}","dm.w.bottle":"Truth or dare","dm.w.snap":"Photo booth, squeezed together","dm.w.quiz":"Know-me quiz","dm.w.lock":"Key scene unlocked"});
Object.assign(I18N.zh,{"dm.h":"他们之间","dm.s":"这里每个数字只会因为剧情里发生的事而变：你的选择、小游戏的结果、你解锁的关键剧情。","dm.log":"是什么让它变的","dm.none":"还没有变化——做出你的第一个选择吧。",
 "dm.s.gru":"旧恨未消","dm.s.fire":"一触即发","dm.s.sync":"心照不宣","dm.s.jea":"醋意上头","dm.s.pull":"暧昧拉扯","dm.s.guard":"互相设防","dm.s.warm":"友情以上",
 "dm.w.heart":"心跳测到 {n}","dm.w.bottle":"真心话大冒险","dm.w.snap":"挤在一起拍了拍立得","dm.w.quiz":"默契问答","dm.w.lock":"解锁了关键剧情"});

/* ================= MORE ATMOSPHERE + let people try it =================
   - effects now draw ABOVE the dark veil (they were hidden under it), plus raindrops sliding on the "glass" for rain/storm,
     frost creeping in from the edges for snow, and a screen shake with every lightning strike (phones that allow it also vibrate —
     iPhone browsers don't allow vibration, so the shake is what you feel there);
   - "✨ 氛围" chip in the chat status row: try every effect, or go back to "follow the story";
   - music follows the effect: storm/blackout/basement → tense, candle/hearts → intimate, rain → late-night. */
const FXLIST=[["auto","✨"],["rain","🌧"],["storm","⛈"],["wind","🍃"],["snowfall","❄️"],["blizzard","🌨"],["candle","🕯"],["blackout","🌑"],["drip","💧"],["hearts","💗"],["petals","🌸"],["confetti","🎉"]];
const FX2MOOD={storm:"tense",blackout:"tense",drip:"tense",wind:"tense",candle:"intimate",hearts:"intimate",petals:"intimate",rain:"night",snowfall:"sad",blizzard:"tense",confetti:"warm"};
let drops=[],frost=0;
const _fxRun21=fxRun;fxRun=function(kind){drops=[];frost=0;_fxRun21(kind);const c0=$("#cbFx");if(!c0)return;let cv=$("#cbFx2");
 if(!cv){c0.insertAdjacentHTML("afterend",'<canvas id="cbFx2"></canvas>');cv=$("#cbFx2")}const r=c0.getBoundingClientRect();cv.width=Math.max(1,r.width);cv.height=Math.max(1,r.height);
 const x=cv.getContext("2d"),W=cv.width,H=cv.height;x.clearRect(0,0,W,H);if(!["rain","storm","snowfall","blizzard"].includes(kind))return;
 const over=()=>{if(fxState.k!==kind||!document.body.contains(cv)){x.clearRect(0,0,W,H);return}x.clearRect(0,0,W,H);
  if(kind==="rain"||kind==="storm"){if(drops.length<(kind==="storm"?46:28)&&Math.random()<.25)drops.push({x:Math.random()*W,y:Math.random()*H*.85,r:2+Math.random()*5,v:0,hold:60+Math.random()*240});
   drops.forEach(d=>{if(d.hold>0)d.hold--;else{d.v=Math.min(4,d.v+.05);d.y+=d.v;d.x+=Math.sin(d.y*.05)*.3}
    const g=x.createRadialGradient(d.x-d.r*.3,d.y-d.r*.3,0,d.x,d.y,d.r);g.addColorStop(0,"rgba(255,255,255,.55)");g.addColorStop(.6,"rgba(200,220,255,.18)");g.addColorStop(1,"rgba(150,180,230,.05)");
    x.fillStyle=g;x.beginPath();x.ellipse(d.x,d.y,d.r*.85,d.r,0,0,7);x.fill();if(d.v>0){x.strokeStyle="rgba(200,220,255,.12)";x.lineWidth=d.r*.6;x.beginPath();x.moveTo(d.x,d.y-d.r);x.lineTo(d.x,d.y-d.r-d.v*8);x.stroke()}});
   drops=drops.filter(d=>d.y<H+10)}
  if(kind==="snowfall"||kind==="blizzard"){frost=Math.min(1,frost+.003);const e=Math.min(W,H)*(.18+.1*frost);
   [[0,0],[W,0],[0,H],[W,H]].forEach(([cx,cy])=>{const g=x.createRadialGradient(cx,cy,0,cx,cy,e*1.6);g.addColorStop(0,"rgba(235,245,255,"+(.55*frost)+")");g.addColorStop(1,"rgba(235,245,255,0)");x.fillStyle=g;x.fillRect(0,0,W,H)});
   x.strokeStyle="rgba(255,255,255,"+(.35*frost)+")";x.lineWidth=1;for(let i=0;i<14;i++){const a=i*.45,cx=(i%2?W-10:10),cy=(i%3?H-12:12),l=e*.5*frost;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(a)*l*(i%2?-1:1),cy+Math.sin(a)*l*(i%3?-1:1));x.stroke()}}
  requestAnimationFrame(over)};requestAnimationFrame(over)};
/* manual pick also works outside stories */
const _chatFx21=chatFx;chatFx=function(th){if(th&&th.fxm&&th.fxm!=="auto"){cancelAnimationFrame(fxRaf);fxRun(th.fxm);return}_chatFx21(th)};
/* 2026-10-27：从「包 renderChat」搬成钩子（批量迁移）。逻辑原样，只是不再包住渲染器。 */
const __body_dims21 = function () { const s=$(".status");if(s&&!s.querySelector("[data-fxpick]"))s.insertAdjacentHTML("beforeend",'<button class="fxchip" data-fxpick="1">✨ '+t("fx.chip")+'</button>');const th=S.threads[curT];if(th)dimSync(th) };
if (window.UI && typeof window.UI.add === "function") window.UI.add("dims21", __body_dims21);
else { const _renderChat21 = renderChat; renderChat = function () { const r = _renderChat21.apply(this, arguments); __body_dims21(); return r; }; };
document.addEventListener("click",e=>{let x;const th=S.threads[curT];if(!th)return;
 if(e.target.closest("[data-fxpick]")){const cur=th.fxm||"auto";sheet('<h2>✨ '+t("fx.h")+'</h2><p class="xs faint" style="margin-top:4px">'+t("fx.s")+'</p><div class="fxgrid">'+FXLIST.map(([k,i])=>'<button data-fxk="'+k+'" class="'+(k===cur?"on":"")+'"><span>'+i+'</span><b>'+t("fx."+k)+'</b></button>').join("")+'</div>');return}
 if(x=e.target.closest("[data-fxk]")){th.fxm=x.dataset.fxk;save();closeSheet();chatFx(th);bgmFollow(th,true);return}});
/* music follows the effect / scene */
const _bgmFor21=bgmForThread;bgmForThread=function(th){const r=_bgmFor21(th);if(!r)return r;const k=(th.fxm&&th.fxm!=="auto")?th.fxm:(th.pk&&th.pk.fx);if(k&&FX2MOOD[k])r.mood=FX2MOOD[k];return r};
function bgmFollow(th,say){if(!bgmOn()||!(BGM.timer||BGM.file))return;const w=bgmForThread(th);if(!w)return;const was=BGM.mood;bgmPlay(w.mood,w.wid);if(say&&was!==w.mood)toast("🎵 "+(BGM_NAME[w.mood]||w.mood))}
const _fxSet21=fxSet;fxSet=function(th,k){const before=th.pk&&th.pk.fx;if(th.pk&&k&&before!==k)th.fxm=null;_fxSet21(th,k);if(curT===th.id&&th.pk&&th.pk.fx!==before)bgmFollow(th,true)};
Object.assign(I18N.en,{"fx.chip":"Mood","fx.h":"Atmosphere","fx.s":"Effects change with the story by themselves. Try any of them here, or go back to following the story.","fx.auto":"Follow the story","fx.rain":"Rain","fx.storm":"Storm","fx.wind":"Wind","fx.snowfall":"Snow","fx.blizzard":"Blizzard","fx.candle":"Candlelight","fx.blackout":"Blackout","fx.drip":"Dripping","fx.hearts":"Hearts","fx.petals":"Petals","fx.confetti":"Confetti"});
Object.assign(I18N.zh,{"fx.chip":"氛围","fx.h":"氛围特效","fx.s":"特效会跟着剧情自己变。你也可以在这里先试试每一种，或者切回「跟随剧情」。","fx.auto":"跟随剧情","fx.rain":"下雨","fx.storm":"暴雨闪电","fx.wind":"大风","fx.snowfall":"下雪","fx.blizzard":"暴风雪","fx.candle":"烛光","fx.blackout":"停电","fx.drip":"滴水","fx.hearts":"心动","fx.petals":"花瓣","fx.confetti":"彩带"});

/* header: the old "陌生人/Stranger" love-stage chip now shows the main pair's stage, with a label */
function dimHeader(th){const P=dimPairs(th);if(!P)return;dimState(th);const m=P.find(p=>p.main)||P[0],r=th.rdv[dimKey(m.a,m.b)];const c=$(".chead .stagechip:not(.livechip)")||$(".stagechip:not(.livechip)");if(c)c.textContent=t("dm.s."+dimStage(r))}
/* free chats: closeness mirrors into 吸引, director events (jealousy, confession…) move the you↔him pair */
setInterval(()=>{const th=S.threads[curT];if(!th||th.pk||!$("#s-chat")||$("#s-chat").hidden)return;const P=dimPairs(th);if(!P)return;dimState(th);const k=dimKey(P[0].a,P[0].b),r=th.rdv[k],L=Math.round(th.love[P[0].b]||0);
 if(L>r.att){dimAdd(th,k,{att:(L-r.att)*2},t("dm.w.chat"))}},4000);
if(typeof rdAdd==="function"){const _rdAdd21=rdAdd;rdAdd=function(p,d,why,quiet){const th=S.threads[curT];if(th&&!th.pk){const P=dimPairs(th);if(P)dimAdd(th,dimKey(P[0].a,P[0].b),d,why)}return _rdAdd21(p,d,why,quiet)}}
function dimRule(o){const L=o.love||0,k=o.k||"say",d={};if(L>0){d.att=L*2;d.ten=k==="act"?L*2:L;if(k!=="act")d.tru=L}else if(L<0){d.tru=L*3;d.ten=-3;d.att=L}else d.ten=1;return d}
Object.assign(I18N.en,{"dm.w.chat":"Getting closer in chat"});Object.assign(I18N.zh,{"dm.w.chat":"聊天里越走越近"});
