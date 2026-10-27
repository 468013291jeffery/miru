/* ================= PLOT-DRIVEN WEATHER & MOOD EFFECTS =================
   The chat background already gets an ambient effect per story (FX[wid]). Now the plot can change it:
   ["sys","fx",{k:"storm"}] explicitly, or automatically from what happens — an event "暴雨…" → storm with lightning,
   "停电" → blackout flicker, a candle-lit scene → candle glow + embers, a basement → dripping water, wind → gusts and leaves,
   snow → snow, a birthday → confetti, a near-kiss → drifting hearts. State is saved on the thread (th.pk.fx). */
const FX2=["rain","storm","wind","snowfall","blizzard","candle","blackout","drip","hearts","petals","confetti"];
const FX_RULES=[[/暴雨|雷|storm|thunder|downpour/i,"storm"],[/停电|断电|黑了|blackout|power cut|lights go out/i,"blackout"],[/烛|蜡烛|candle/i,"candle"],
 [/暴风雪|blizzard/i,"blizzard"],[/雪|snow/i,"snowfall"],[/风|台风|gust|wind/i,"wind"],[/地下室|basement|cellar/i,"drip"],[/下雨|雨|rain/i,"rain"],
 [/生日|派对|birthday|confetti/i,"confetti"],[/花瓣|樱花|petal|blossom/i,"petals"],[/nearkiss|forehead|差一点|kiss/i,"hearts"]];
function fxFrom(s){s=String(s||"");const r=FX_RULES.find(([re])=>re.test(s));return r?r[1]:null}
function fxSet(th,k){if(!th.pk||!k||th.pk.fx===k)return;th.pk.fx=k;save();if(curT===th.id)chatFx(th)}
PKREG.add("app20_fx_booth.js", function(th,b, next){if(Array.isArray(b)&&b[0]==="sys"){const x=b[2]||{};
  if(b[1]==="fx"){th.pk.q.shift();fxSet(th,x.k);return true}
  if(b[1]==="event")fxSet(th,fxFrom((x.title||"")+" "+(x.txt||"")));
  if(b[1]==="scene"){const k=fxFrom((x.place||"")+" "+(x.time||"")+" "+(x.img||""));if(k)fxSet(th,k)}
  if(b[1]==="bg"&&/nearkiss|forehead/.test(x.img||""))fxSet(th,"hearts")}
 return next(th,b)});;
const _chatFx20=chatFx;
chatFx=function(th){const k=th&&th.pk&&th.pk.fx;if(!k||!FX2.includes(k)){fxState.k=null;return _chatFx20(th)}cancelAnimationFrame(fxRaf);fxRun(k)};
const fxState={k:null};
function fxRun(kind){const cv=$("#cbFx");if(!cv)return;fxState.k=kind;const r=cv.getBoundingClientRect(),W=cv.width=Math.max(1,r.width),H=cv.height=Math.max(1,r.height),x=cv.getContext("2d");
 const low=matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;const N0={rain:160,storm:260,wind:70,snowfall:120,blizzard:260,candle:40,blackout:0,drip:22,hearts:22,petals:40,confetti:120}[kind];const N=low?Math.round(N0/3):N0;
 const P=[...Array(N)].map(()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random(),v:Math.random(),p:Math.random()*6.28,c:Math.floor(Math.random()*5)}));
 let tt=0,flash=0,nextBolt=120+Math.random()*200,gust=0;const CF=["#ff6fa3","#ffd36b","#8be1ff","#b48bff","#7dffb0"];
 const heart=(cx,cy,s)=>{x.beginPath();x.moveTo(cx,cy+s*.35);x.bezierCurveTo(cx-s,cy-s*.4,cx-s*.4,cy-s,cx,cy-s*.35);x.bezierCurveTo(cx+s*.4,cy-s,cx+s,cy-s*.4,cx,cy+s*.35);x.fill()};
 const step=()=>{if(!document.body.contains(cv)||fxState.k!==kind)return;tt++;x.clearRect(0,0,W,H);
  if(kind==="rain"||kind==="storm"){const slant=kind==="storm"?3.2+Math.sin(tt*.01)*1.5:1.2,sp=kind==="storm"?18:13;
   x.strokeStyle="rgba(190,210,255,"+(kind==="storm"?.42:.32)+")";x.lineWidth=1;x.beginPath();
   P.forEach(q=>{q.y+=sp+q.v*8;q.x+=slant;if(q.y>H){q.y=-20;q.x=Math.random()*W*1.2-W*.1;if(Math.random()<.3)q.sp=6}const l=10+q.r*16;x.moveTo(q.x,q.y);x.lineTo(q.x-slant*l/sp,q.y-l)});x.stroke();
   if(kind==="storm"){x.fillStyle="rgba(20,30,60,.18)";x.fillRect(0,0,W,H);if(--nextBolt<=0){flash=1;nextBolt=180+Math.random()*320;try{navigator.vibrate&&navigator.vibrate(30)}catch(_){}}
    if(flash>0){x.fillStyle="rgba(235,240,255,"+(flash*.55)+")";x.fillRect(0,0,W,H);flash=flash>.6&&Math.random()<.3?.9:flash-.07}}}
  if(kind==="wind"){gust=.5+.5*Math.sin(tt*.012);x.strokeStyle="rgba(255,255,255,.12)";x.lineWidth=1.2;
   P.forEach((q,i)=>{if(i%3===0){q.x+=10+gust*14;if(q.x>W+80){q.x=-80;q.y=Math.random()*H}x.beginPath();x.moveTo(q.x,q.y);x.quadraticCurveTo(q.x-40,q.y-6,q.x-90-q.r*60,q.y);x.stroke()}
    else{q.x+=3+gust*6+q.v*2;q.y+=Math.sin(tt*.05+q.p)*1.5+.6;if(q.x>W+10){q.x=-10;q.y=Math.random()*H}x.save();x.translate(q.x,q.y);x.rotate(tt*.08+q.p);x.fillStyle="rgba("+(q.c%2?"196,150,90":"150,170,100")+",.7)";x.beginPath();x.ellipse(0,0,5,2.4,0,0,7);x.fill();x.restore()}})}
  if(kind==="snowfall"||kind==="blizzard"){const wx=kind==="blizzard"?4+Math.sin(tt*.02)*2:0;P.forEach(q=>{q.y+=.6+q.v*(kind==="blizzard"?3:1.2);q.x+=wx+Math.sin(tt*.01+q.p)*.6;if(q.y>H||q.x>W+5){q.y=-5;q.x=Math.random()*W-(wx?W*.3:0)}x.fillStyle="rgba(255,255,255,"+(.4+q.r*.5)+")";x.beginPath();x.arc(q.x,q.y,.9+q.r*2.4,0,7);x.fill()});
   if(kind==="blizzard"){x.fillStyle="rgba(220,230,255,.08)";x.fillRect(0,0,W,H)}}
  if(kind==="candle"){const fl=.55+.18*Math.sin(tt*.21)+.1*Math.sin(tt*.53)+(Math.random()-.5)*.08,g=x.createRadialGradient(W*.5,H*.62,10,W*.5,H*.62,Math.max(W,H)*.75);
   g.addColorStop(0,"rgba(255,170,80,"+(.22*fl)+")");g.addColorStop(.45,"rgba(120,60,20,"+(.12*fl)+")");g.addColorStop(1,"rgba(0,0,0,.55)");x.fillStyle=g;x.fillRect(0,0,W,H);
   P.forEach(q=>{q.y-=.4+q.v*.9;q.x+=Math.sin(tt*.03+q.p)*.4;if(q.y<H*.2){q.y=H*(.7+Math.random()*.3);q.x=W*(.3+Math.random()*.4)}x.fillStyle="rgba(255,"+(160+q.c*15)+",80,"+(.25+q.r*.5)*(1-(H-q.y)/H*.6)+")";x.beginPath();x.arc(q.x,q.y,.7+q.r*1.6,0,7);x.fill()})}
  if(kind==="blackout"){const f=tt<70?(Math.random()<.35?.15:.85):(.8+.04*Math.sin(tt*.05));x.fillStyle="rgba(2,3,8,"+f+")";x.fillRect(0,0,W,H);
   if(tt>70){const g=x.createRadialGradient(W*.5,H*.45,0,W*.5,H*.45,W*.45);g.addColorStop(0,"rgba(120,255,170,.06)");g.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=g;x.fillRect(0,0,W,H)}}
  if(kind==="drip"){x.fillStyle="rgba(0,10,20,.25)";x.fillRect(0,0,W,H);P.forEach(q=>{if(q.y<0||q.y>H){q.y=Math.random()<.01?0:-1;q.x=Math.random()*W;q.v=0}if(q.y>=0){q.v+=.35;q.y+=q.v;x.fillStyle="rgba(180,210,255,.55)";x.beginPath();x.ellipse(q.x,q.y,1.4,3.4,0,0,7);x.fill();
    if(q.y>H-6){x.strokeStyle="rgba(180,210,255,.4)";x.beginPath();x.ellipse(q.x,H-4,8,2,0,0,7);x.stroke()}}})}
  if(kind==="hearts"||kind==="petals"){P.forEach(q=>{q.y-=kind==="hearts"?(.5+q.v*.8):-(.6+q.v);q.x+=Math.sin(tt*.02+q.p)*.7;if(q.y<-20)q.y=H+20;if(q.y>H+20)q.y=-20;
    x.fillStyle=kind==="hearts"?"rgba(255,"+(100+q.c*20)+",160,"+(.18+q.r*.3)+")":"rgba(255,"+(180+q.c*10)+",200,"+(.35+q.r*.4)+")";
    if(kind==="hearts")heart(q.x,q.y,6+q.r*9);else{x.save();x.translate(q.x,q.y);x.rotate(tt*.03+q.p);x.beginPath();x.ellipse(0,0,6,3.5,0,0,7);x.fill();x.restore()}});
   if(kind==="hearts"){const g=x.createRadialGradient(W/2,H/2,W*.2,W/2,H/2,W);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(120,20,60,.28)");x.fillStyle=g;x.fillRect(0,0,W,H)}}
  if(kind==="confetti"){P.forEach(q=>{q.y+=1.2+q.v*2;q.x+=Math.sin(tt*.04+q.p)*1.2;if(q.y>H){q.y=-10;q.x=Math.random()*W}x.save();x.translate(q.x,q.y);x.rotate(tt*.1+q.p);x.fillStyle=CF[q.c];x.fillRect(-3,-1.5,6,3);x.restore()})}
  fxRaf=requestAnimationFrame(step)};step()}

/* ================= 拍贴机 · PHOTO BOOTH WITH HIM =================
   Pick a character + a frame. Take 4 selfies (or pick from your album). Each frame puts you and him side by side,
   blended, with stickers and a caption — a real four-cut strip. Save to album, download, or post it to your moments
   (and he'll comment on it). Entry: Create tab, character profile, chat "+" menu (📸). */
const BFR=[
 {id:"41452",n:"Pink Bunny",bg:["#f7a9cf","#f7a9cf"],hd:"MIRU ♡ MIRU",fg:"#fff",st:["🐰","💗"]},
 {id:"11682",n:"Sky Crush",bg:["#b49cff","#79c8ff"],hd:"MIRU   MIRU",fg:"#fff",st:["🕶️","✨"]},
 {id:"41431",n:"Midnight Film",bg:["#0e0e12","#0e0e12"],hd:"MIRU FILM",fg:"#fff",st:["🎞️","⭐"],film:1},
 {id:"30217",n:"Cream Date",bg:["#f4ece0","#efe2cf"],hd:"our little moment",fg:"#7a5a3a",st:["🌷","🍓"]},
 {id:"52064",n:"Be Mine",bg:["#d6334f","#a31d3b"],hd:"BE MINE",fg:"#fff",st:["🍒","💋"]},
 {id:"70913",n:"After Hours",bg:["#1d1640","#4a2a7a"],hd:"after hours",fg:"#e9dcff",st:["🌙","🍷"]}];
const BPOSE=[{z:1,dx:0,dy:0,s:"🫶",c:["比心","heart"]},{z:1.45,dx:0,dy:-.08,s:"💞",c:["靠一下","lean in"]},{z:1.15,dx:.08,dy:0,s:"😜",c:["鬼脸","silly"],mir:1},{z:1.3,dx:-.05,dy:-.04,s:"💋",c:["啵","mwah"]}];
let BT={cid:null,fr:BFR[0],me:[null,null,null,null],out:null};
const imgCache={};function loadImg(src){if(imgCache[src])return imgCache[src];return imgCache[src]=new Promise((ok,no)=>{const im=new Image();if(String(src).indexOf("http")===0)im.crossOrigin="anonymous";im.onload=()=>ok(im);im.onerror=no;im.src=src})}
function coverDraw(x,im,dx,dy,dw,dh,z,ox,oy,mir){z=z||1;const s=Math.max(dw/im.width,dh/im.height)*z,w=im.width*s,h=im.height*s;let sx=dx+(dw-w)/2+(ox||0)*dw,sy=dy+(dh-h)*.22+(oy||0)*dh;
 x.save();x.beginPath();x.rect(dx,dy,dw,dh);x.clip();if(mir){x.translate(dx*2+dw,0);x.scale(-1,1)}x.drawImage(im,sx,sy,w,h);x.restore()}
async function boothStrip(cid,fr,me,scale){scale=scale||1;const W=600*scale,H=1800*scale,cv=document.createElement("canvas");cv.width=W;cv.height=H;const x=cv.getContext("2d"),k=scale;
 const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,fr.bg[0]);g.addColorStop(1,fr.bg[1]);x.fillStyle=g;x.fillRect(0,0,W,H);
 x.fillStyle=fr.fg;x.font="800 "+30*k+"px system-ui,sans-serif";x.textBaseline="middle";x.textAlign="center";x.fillText(fr.hd,W/2,48*k);
 x.font=40*k+"px serif";x.fillText(fr.st[0],60*k,48*k);x.fillText(fr.st[1],W-60*k,48*k);
 const him=await loadImg(artSrc(cid)).catch(()=>null),pw=528*k,ph=380*k,px=36*k;
 for(let i=0;i<4;i++){const py=(92+i*396)*k,P=BPOSE[i];x.fillStyle="#e9e9ef";x.fillRect(px,py,pw,ph);
  if(him)coverDraw(x,him,px+pw*.38,py,pw*.62,ph,P.z,P.dx,P.dy,P.mir);
  const off=document.createElement("canvas");off.width=pw*.62;off.height=ph;const o=off.getContext("2d");
  if(me[i]){const mi=await loadImg(me[i]).catch(()=>null);if(mi)coverDraw(o,mi,0,0,off.width,ph,1.05)}
  else{o.fillStyle="#cfd0da";o.fillRect(0,0,off.width,ph);o.fillStyle="#aeb0be";o.beginPath();o.arc(off.width/2,ph*.42,ph*.16,0,7);o.fill();o.beginPath();o.ellipse(off.width/2,ph*1.02,ph*.32,ph*.36,0,0,7);o.fill();
   o.fillStyle="#fff";o.font="700 "+22*k+"px system-ui";o.textAlign="center";o.fillText(S.lang==="zh"?"你":"you",off.width/2,ph*.42+8*k)}
  o.globalCompositeOperation="destination-in";const gm=o.createLinearGradient(0,0,off.width,0);gm.addColorStop(0,"rgba(0,0,0,1)");gm.addColorStop(.72,"rgba(0,0,0,1)");gm.addColorStop(1,"rgba(0,0,0,0)");o.fillStyle=gm;o.fillRect(0,0,off.width,ph);
  x.drawImage(off,px,py);
  if(fr.film){x.fillStyle="#fff";for(let j=0;j<5;j++){x.fillRect(12*k,py+20*k+j*72*k,10*k,26*k);x.fillRect(W-22*k,py+20*k+j*72*k,10*k,26*k)}}
  x.font=46*k+"px serif";x.textAlign="center";x.fillText(P.s,px+pw*.5,py+ph*.78);
  x.font="700 "+18*k+"px system-ui";x.fillStyle="rgba(255,255,255,.92)";x.strokeStyle="rgba(0,0,0,.35)";x.lineWidth=3*k;const cap=S.lang==="zh"?P.c[0]:P.c[1];x.strokeText(cap,px+pw-46*k,py+ph-22*k);x.fillText(cap,px+pw-46*k,py+ph-22*k);x.fillStyle=fr.fg}
 x.fillStyle=fr.fg;x.textAlign="center";x.font="700 "+28*k+"px system-ui";x.fillText(first(ch(cid).n)+" & "+(((persona()||{}).name)||(S.lang==="zh"?"你":"you")),W/2,1700*k);
 x.font=16*k+"px system-ui";x.globalAlpha=.75;x.fillText(new Date().toISOString().slice(0,10).replace(/-/g,".")+"  ·  keep our memories",W/2,1742*k);x.globalAlpha=1;return cv}
function boothChars(){const seen=myCircle?myCircle():[];const all=allChars().filter(id=>ch(id));return [...new Set(seen.filter(id=>all.includes(id)).concat(all))].slice(0,30)}
async function boothOpen(cid){BT.cid=cid||BT.cid||boothChars()[0];const L=boothChars();
 screen("s-booth",'<div class="topbar"><button class="ibtn" data-back="1">'+ic("back")+'</button><h2 class="grow" style="font-size:19px;text-align:center">📸 '+t("bt.h")+'</h2><span style="width:40px"></span></div>'+
  '<div class="scroll" style="padding-bottom:30px"><p class="xs faint pad" style="padding-top:4px">'+t("bt.s")+'</p><div class="btchars">'+L.map(id=>'<button data-btc="'+id+'" class="'+(id===BT.cid?"on":"")+'">'+avatar(id,48)+'<b>'+esc(first(ch(id).n))+'</b></button>').join("")+'</div>'+
  '<div class="btgrid">'+BFR.map((f,i)=>'<button data-btf="'+i+'"><div class="btprev" id="btp'+i+'"></div><b>'+esc(f.n)+'</b><span>'+t("bt.id")+f.id+'</span></button>').join("")+'</div></div>');show("s-booth");
 BFR.forEach(async(f,i)=>{const cv=await boothStrip(BT.cid,f,[null,null,null,null],.34);const el=$("#btp"+i);if(el)el.innerHTML='<img src="'+cv.toDataURL("image/jpeg",.8)+'" alt="">'})}
async function boothEdit(){const sl=BT.me;sheet('<h2>'+esc(BT.fr.n)+' · '+esc(first(ch(BT.cid).n))+'</h2><p class="sm dim" style="margin-top:4px">'+t("bt.tip")+'</p>'+
  '<div class="btslots">'+sl.map((s,i)=>'<label class="btslot">'+(s?'<img src="'+s+'">':'<span>📷<small>'+(i+1)+'</small></span>')+'<input type="file" accept="image/*" capture="user" data-btin="'+i+'" hidden></label>').join("")+'</div>'+
  '<label class="btn btn-g btn-block" style="margin-top:10px;cursor:pointer">🖼 '+t("bt.pick4")+'<input type="file" accept="image/*" multiple data-btmulti="1" hidden></label>'+
  '<div class="btout" id="btOut"><div class="spin"></div></div>'+
  '<div class="row" style="gap:8px;margin-top:10px"><button class="btn btn-g grow" data-btsave="1">💾 '+t("bt.save")+'</button><button class="btn btn-g grow" data-btdl="1">⬇ '+t("bt.dl")+'</button></div>'+
  '<button class="btn btn-p btn-block" style="margin-top:8px" data-btpost="1">✨ '+t("bt.post")+'</button>');
 BT.out=await boothStrip(BT.cid,BT.fr,sl,.6);const o=$("#btOut");if(o)o.innerHTML='<img src="'+BT.out.toDataURL("image/jpeg",.85)+'" alt="">'}
function btFiles(files,start){const L=[...files].slice(0,4-start);let n=0;L.forEach((f,j)=>shrink(f,d=>{BT.me[start+j]=d;if(++n===L.length)boothEdit()}))}
document.addEventListener("change",e=>{const x=e.target;if(x.dataset.btin!=null&&x.files[0])btFiles(x.files,+x.dataset.btin);if(x.dataset.btmulti&&x.files.length){BT.me=[null,null,null,null];btFiles(x.files,0)}});
document.addEventListener("click",async e=>{let x;
 if(x=e.target.closest("[data-btc]")){BT.cid=x.dataset.btc;boothOpen(BT.cid);return}
 if(x=e.target.closest("[data-btf]")){BT.fr=BFR[+x.dataset.btf];boothEdit();return}
 if(e.target.closest("[data-booth]")){boothOpen(e.target.closest("[data-booth]").dataset.booth||null);return}
 if(!BT.out)return;
 if(e.target.closest("[data-btsave]")){S.album.unshift({id:"a"+Date.now(),cid:BT.cid,src:mediaWrap("album:"+("a"+Date.now()),BT.out.toDataURL("image/jpeg",.72)),at:Date.now()});if(S.album.length>12)S.album.length=12;save();toast(t("bt.saved"));return}
 if(e.target.closest("[data-btdl]")){const name="MIRU_"+BT.cid+"_"+Date.now()+".jpg";BT.out.toBlob(async b=>{if(DL){try{await DL.save({filename:name,data:b});return}catch(_){}}const a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();a.remove()},"image/jpeg",.9);return}
 if(e.target.closest("[data-btpost]")){const p={id:"m"+Date.now(),txt:t("bt.cap",{n:first(ch(BT.cid).n)}),img:BT.out.toDataURL("image/jpeg",.7),at:Date.now(),likes:0,cm:[],day:today()};
  S.moments=[p].concat(S.moments||[]).slice(0,40);save();closeSheet();const ids=[BT.cid].concat(myCircle().filter(i=>i!==BT.cid)).slice(0,6);addComments(p,ids);chatSeg="moments";show("s-main");renderTab("chats");toast(t("mom.posted"));return}});
/* entries */
const _renderCreate20=renderCreate;renderCreate=function(v){_renderCreate20(v);const sc=v.querySelector(".scroll");if(sc)sc.insertAdjacentHTML("afterbegin",'<button class="card btentry" data-booth=""><span>📸</span><div class="grow"><b>'+t("bt.h")+'</b><p class="xs faint">'+t("bt.entry")+'</p></div><span>›</span></button>')};
const _openChar20=openChar;openChar=function(id,keep){_openChar20(id,keep);const r=$('[data-chatnow="'+id+'"]');if(r&&!$('[data-booth="'+id+'"]'))r.insertAdjacentHTML("afterend",'<button class="btn btn-g" data-booth="'+id+'">📸</button>')};
const _boothStory20=booth;booth=function(cid){const th=S.threads[curT];if(PKFEAT&&th===PKFEAT.th&&PKFEAT.k==="snap"){_boothStory20(cid);return}boothOpen(cid)};
Object.assign(I18N.en,{"bt.h":"Photo booth","bt.s":"Pick who you're taking it with, then a frame.","bt.id":"Frame ID: ","bt.tip":"Tap a square to take a selfie — or pick 4 photos. He's already posing.","bt.pick4":"Pick 4 from album","bt.save":"Save","bt.dl":"Download","bt.post":"Post to moments — he'll see it","bt.saved":"Saved to your album","bt.cap":"Photo booth with {n} 📸","bt.entry":"Four-cut strips with your favorite character"});
Object.assign(I18N.zh,{"bt.h":"拍贴机","bt.s":"先选和谁拍，再选相框。","bt.id":"相框 ID：","bt.tip":"点格子自拍，或者一次选 4 张照片。他已经摆好姿势了。","bt.pick4":"从相册选 4 张","bt.save":"存到相册","bt.dl":"下载","bt.post":"发到动态，让他看到","bt.saved":"已存到相册","bt.cap":"和 {n} 的拍贴 📸","bt.entry":"和喜欢的角色拍四格大头贴"});

/* ===== welcome gift as coupon tickets (new-member reward · invite reward · first-purchase max discount) ===== */
function inviteCode(){if(!S.invCode){S.invCode="MIRU"+(hash(String(S.joinAt||Date.now()))%900000+100000);save()}return S.invCode}
welcomeSheet=function(after){S.welcomed=true;if(!S.joinAt)S.joinAt=Date.now();S.keys+=WELCOME_GEMS;save();welcomeSheet.after=after;
 const d=x=>{const z=new Date(x);return z.getFullYear()+"."+String(z.getMonth()+1).padStart(2,"0")+"."+String(z.getDate()).padStart(2,"0")+" "+String(z.getHours()).padStart(2,"0")+":"+String(z.getMinutes()).padStart(2,"0")};
 sheet('<div class="wel2"><h2>'+t("w2.h")+'</h2>'+
  '<div class="tk tk1"><small>'+t("w2.t1")+'</small><b>'+t("w2.b1",{n:WELCOME_GEMS})+'</b><span>'+t("w2.s1",{n:WELCOME_GEMS})+'</span></div>'+
  '<button class="tk tk2" data-invite="1"><small>'+t("w2.t2")+'</small><b>'+t("w2.b2")+'</b><span>'+t("w2.s2",{c:inviteCode()})+'</span></button>'+
  '<button class="tk tk3" data-welpay="1" data-promobox="1"><small>'+t("w2.t3")+'</small><b>'+t("w2.b3")+'</b><span>'+t("w2.s3")+'</span><em>'+d(S.joinAt)+' – '+d(S.joinAt+PROMO_H*36e5)+' · ⏱ <span data-promocd="1">'+hms(promoLeft())+'</span></em></button>'+
  '<button class="btn btn-p btn-block w2go" data-welgo="1">'+t("w2.go")+'</button></div>')};
document.addEventListener("click",e=>{if(!e.target.closest("[data-invite]"))return;const msg=t("w2.share",{c:inviteCode()});
 try{if(navigator.share){navigator.share({text:msg}).catch(()=>{});return}}catch(_){}try{navigator.clipboard.writeText(msg);toast(t("w2.copied"))}catch(_){toast(inviteCode())}});
Object.assign(I18N.en,{"w2.h":"Welcome! Your new-member gifts","w2.t1":"New member reward","w2.b1":"💎 {n} — already added","w2.s1":"≈ {n} locked lines or 10 AI photos of him","w2.t2":"Invite a friend","w2.b2":"+💎 30 for each friend","w2.s2":"They get 💎30 too · your code {c} · tap to share","w2.t3":"First purchase · max discount","w2.b3":"First week FREE · up to 20% off","w2.s3":"Weekly trial $0, then 60% off first renewal · gem packs 20% off","w2.go":"Claim & start watching","w2.share":"I'm hooked on MIRU — interactive romance dramas where you play the lead. Use my code {c} and we both get 💎30.","w2.copied":"Invite copied — paste it to a friend"});
Object.assign(I18N.zh,{"w2.h":"欢迎来到 MIRU！新人福利已到","w2.t1":"新用户注册奖励","w2.b1":"💎 {n} 已到账","w2.s1":"≈ 解锁 {n} 句关键台词，或 10 张他的 AI 照片","w2.t2":"邀请好友奖励","w2.b2":"每邀请 1 人 +💎30","w2.s2":"好友也得 💎30 · 你的邀请码 {c} · 点击分享","w2.t3":"首次付费最大优惠","w2.b3":"首周免费 · 最高 8 折","w2.s3":"周会员 $0 试用，首次续费 6 折 · 钻石包 8 折","w2.go":"领取福利，开始看剧","w2.share":"我在玩 MIRU——可以自己当主角的互动恋爱短剧。填我的邀请码 {c}，我们都能拿 💎30。","w2.copied":"邀请文案已复制，发给好友吧"});

/* ===== 未接来电 · missed calls =====
   He calls you. (1) If you go quiet in a chat for ~45s after he talks, once a day per chat, your phone rings for 10s.
   Answer → the call is free (he called you). Let it ring out / decline → a "missed call" record stays in the chat,
   with the half-sentence he left — and calling back costs 💎2.  (2) Come back to a chat after 3h+ away → "he called while
   you were gone" (once a day). Stories can also ring you: ["sys","ring",{who}]. */
const MC_LINE={zh:["……算了，没事。","我就是想听听你的声音。","你在忙吗？我有件事想当面——","接一下，就一下。","刚才那句话，我想解释一下。","喝了点酒。别多想。","你睡了吗？"],
 en:["...never mind. It's nothing.","I just wanted to hear your voice.","You busy? There's something I want to say to—","Pick up. Just once.","About what I said earlier. Let me explain.","Had a drink. Don't read into it.","Are you asleep?"]};
let ring=null,mcIdle=0;
function ringTone(){if(!bgmInit())return;const c=BGM.ctx;if(c.state==="suspended")c.resume().catch(()=>{});const t0=c.currentTime;
 for(let k=0;k<5;k++)[0,.18].forEach(d=>[880,1046].forEach(f=>{const o=c.createOscillator(),g=c.createGain();o.frequency.value=f;o.connect(g);g.connect(c.destination);const s=t0+k*2+d;g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(.06,s+.02);g.gain.linearRampToValueAtTime(0,s+.16);o.start(s);o.stop(s+.2)}))}
function ringIn(th,cid){if(ring||!th||!ch(cid)||$(".callv"))return;const c=ch(cid),line=(S.lang==="zh"?MC_LINE.zh:MC_LINE.en)[hash(cid+Date.now())%7];
 ring={th,cid,line,t0:Date.now()};document.body.insertAdjacentHTML("beforeend",'<div class="ringv"><div class="ringbg" style="background-image:url('+artSrc(cid)+')"></div><div class="ringin">'+avatar(cid,96)+'<b>'+esc(c.n)+'</b><span>'+t("mc.calling")+'</span>'+
  '<div class="ringbtns"><button data-ringno="1"><i>✕</i>'+t("mc.decline")+'</button><button data-ringyes="1"><i>📞</i>'+t("mc.answer")+'</button></div></div></div>');
 try{navigator.vibrate&&navigator.vibrate([400,300,400,300,400])}catch(_){}ringTone();ring.tm=setTimeout(()=>ringEnd(false),10000)}
function mcCard(th,cid,secs,line,away){th.msgs.push({who:cid,k:"missed",secs,line,away:!!away,at:Date.now()});th.unread=curT!==th.id;th.at=Date.now();save();if(curT===th.id)renderChat()}
function ringEnd(answered,declined){if(!ring)return;clearTimeout(ring.tm);const r=ring;ring=null;$(".ringv")&&$(".ringv").remove();try{navigator.vibrate&&navigator.vibrate(0)}catch(_){}
 if(answered){startCall(r.cid,60);return}mcCard(r.th,r.cid,Math.max(3,Math.round((Date.now()-r.t0)/1000)),r.line,false,declined)}
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-ringyes]")){ringEnd(true);return}
 if(e.target.closest("[data-ringno]")){ringEnd(false,true);return}
 if(x=e.target.closest("[data-mcback]")){const th=S.threads[curT],m=th&&th.msgs[+x.dataset.mcback];if(!m)return;if(!S.plus&&!spend(PRICES.callMin,"event"))return;m.back=1;save();startCall(m.who,60);return}});
MSGKIND.inline("app20_fx_booth.js", ["missed"], function(m,i,th, next){if(!m||m.k!=="missed")return next(m,i,th);const c=ch(m.who);if(!c)return"";
 return '<div class="msg them"><div class="mcwrap">'+avatar(m.who,30)+'<div class="mcard"><div class="mch"><i>📞</i><div><b>'+t(m.away?"mc.away":"mc.missed")+'</b><span>'+t("mc.rang",{s:m.secs})+'</span></div></div>'+
  '<p class="mcl">“'+esc(m.line)+'”</p>'+(m.back?'<div class="xs faint">'+t("mc.called")+'</div>':'<button class="mcbtn" data-mcback="'+i+'">📞 '+t("mc.back")+(S.plus?"":" · 💎"+PRICES.callMin)+'</button>')+'</div></div></div>'});;
/* idle trigger inside a chat */
setInterval(()=>{const sc=$("#s-chat");const th=S.threads[curT];if(!sc||sc.hidden||!th||ring||$(".sheet")||$(".callv")){mcIdle=0;return}
 const last=th.msgs[th.msgs.length-1];if(!last||!ch(last.who)||last.k==="missed"){mcIdle=0;return}if(th.pk&&th.pk.q&&th.pk.q.length){mcIdle=0;return}
 mcIdle+=5;const d=today();if(mcIdle>=45&&(th.mcDay!==d)){th.mcDay=d;save();mcIdle=0;ringIn(th,mainOf(th))}},5000);
["pointerdown","keydown"].forEach(ev=>document.addEventListener(ev,()=>{mcIdle=0},{passive:true}));
/* away trigger: reopening a chat after 3h */
const _openThread20=openThread;openThread=function(id){const th=S.threads[id],d=today();
 if(th&&th.at&&Date.now()-th.at>3*36e5&&th.mcAway!==d&&ch(mainOf(th))){th.mcAway=d;const cid=mainOf(th);th.msgs.push({who:cid,k:"missed",secs:6+hash(id+d)%20,line:(S.lang==="zh"?MC_LINE.zh:MC_LINE.en)[hash(d+id)%7],away:true,at:Date.now()-36e5});save()}
 _openThread20(id)};
PKREG.add("app20_fx_booth.js", function(th,b, next){if(Array.isArray(b)&&b[0]==="sys"&&b[1]==="ring"){th.pk.q.shift();setTimeout(()=>ringIn(th,(b[2]||{}).who||mainOf(th)),600);return true}return next(th,b)});;
Object.assign(I18N.en,{"mc.calling":"is calling you…","mc.answer":"Answer","mc.decline":"Decline","mc.missed":"Missed call","mc.away":"He called while you were away","mc.rang":"Rang {s}s, then hung up","mc.back":"Call back","mc.called":"You called back"});
Object.assign(I18N.zh,{"mc.calling":"邀请你语音通话…","mc.answer":"接听","mc.decline":"拒绝","mc.missed":"未接来电","mc.away":"你不在的时候，他打来过","mc.rang":"响了 {s} 秒，对方已取消","mc.back":"回拨","mc.called":"你已回拨"});

/* ===== Discover: categories folded behind one "分类" button (like Browse by category) ===== */
let discOpen=false;
tagBar=function(){const rows=[["genre","disc.genre",TAGS.genre],["setting","disc.setting",TAGS.setting],["trope","disc.trope",TAGS.trope],["char","disc.char",TAGS.char],["gong","f.traitGong",GS_TAGS.gong],["shou","f.traitShou",GS_TAGS.shou]];
 const nm=(r,x)=>r==="gong"||r==="shou"?(typeof gsName==="function"?gsName(x):x):tagName(x),sel=rows.flatMap(([r])=>(disc.sel[r]||[]).map(x=>[r,x]));
 return '<div class="dfilt"><div class="dbar"><button class="dcat'+(discOpen?" on":"")+'" data-dcat="1">▦ '+t("dc2.cat")+(sel.length?' <i>'+sel.length+'</i>':'')+' <span>'+(discOpen?"▴":"▾")+'</span></button>'+
  '<div class="seg dor" id="orSeg">'+[["all","disc.all"],["bl","ob.bl"],["gl","ob.gl"],["bg","ob.bg"]].map(([k,l])=>'<button data-orf="'+k+'" class="'+(S.or===k?"on":"")+(k==="bl"?" blt":"")+'">'+t(l)+'</button>').join("")+'</div></div>'+
  (!discOpen&&sel.length?'<div class="dsel">'+sel.map(([r,x])=>'<button class="chip on" data-dtag="'+r+'|'+esc(x)+'">'+esc(nm(r,x))+' ✕</button>').join("")+'<button class="chip" data-dclr="1">'+t("dc2.clear")+'</button></div>':'')+
  (discOpen?'<div class="drows">'+rows.map(([r,lb,L])=>'<div class="tagrow"><div class="hs"><button class="chip all'+((disc.sel[r]||[]).length?"":" on")+'" data-dall="'+r+'">'+t("dc2.all")+t(lb)+'</button>'+L.map(x=>'<button class="chip'+((disc.sel[r]||[]).includes(x)?" on":"")+'" data-dtag="'+r+'|'+esc(x)+'">'+esc(nm(r,x))+'</button>').join("")+'</div></div>').join("")+'</div>':'')+
  '</div><div id="discRes"></div>'};
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-dcat]")){discOpen=!discOpen;renderTab("discover");return}
 if(x=e.target.closest("[data-dall]")){disc.sel[x.dataset.dall]=[];renderTab("discover");return}
 if(e.target.closest("[data-dclr]")){Object.keys(disc.sel).forEach(k=>disc.sel[k]=[]);renderTab("discover");return}});
document.addEventListener("click",e=>{if(e.target.closest("[data-dtag]")&&S.lastTab==="discover")setTimeout(()=>{const f=$(".dfilt");if(f){const sc=$("#discScroll"),y=sc&&sc.scrollTop;renderTab("discover");const s2=$("#discScroll");if(s2&&y)s2.scrollTop=y}},0)});
Object.assign(I18N.en,{"dc2.cat":"Categories","dc2.all":"All ","dc2.clear":"Clear"});Object.assign(I18N.zh,{"dc2.cat":"分类","dc2.all":"全部","dc2.clear":"清空"});

/* ===== 关键剧情付费解锁 · paid key scenes =====
   ["n","lock",{title,teaser,price,then:[beats]}] — the story pauses on a sealed card at its hottest moment.
   Unlock = extra scene (never a plot hole: skipping just continues the main line). First key scene in each story is free
   (the hook), after that 💎price or free for members; within the new-member window the card also offers the free trial week. */
STOPK.add("lock");
function lockBeats(d){return Array.isArray(d.then)?d.then:(Lz(d.then)||[])}
function lockKey(th,d){return th.wid+"|"+Lz(d.title)}
const _stopHTML20=stopHTML;
stopHTML=function(th){const b=th.pk.stop;if(!b||b[1]!=="lock")return _stopHTML20(th);const d=b[2],L=lockBeats(d),isFirst=(S.lockFree||{})[th.wid]==null,owned=(S.unlocked||{})[lockKey(th,d)],pr=promoLeft()>0;
 const lines=L.filter(x=>x[1]!=="act"||x[0]!=="sys").slice(0,4).map((x,i)=>'<p class="lk'+(i?" blur":"")+'">'+(ch(x[0])?'<b>'+esc(first(ch(x[0]).n))+'：</b>':'')+esc(String(x[2]).slice(0,40))+'</p>').join("");
 return '<div class="lockc"><div class="lockbg" style="background-image:url('+((d.img&&(window.SCENE_FILES||{})[d.img])||artSrc(mainOf(th)))+')"></div><div class="lockin"><div class="lockh">🔒 '+t("lk.key")+'</div><h3>'+esc(Lz(d.title))+'</h3><p class="lockt">'+esc(Lz(d.teaser))+'</p><div class="lockp">'+lines+'</div>'+
  (owned||S.plus?'<button class="btn btn-p btn-block" data-lockgo="1">🔓 '+t("lk.open")+'</button>':isFirst?'<button class="btn btn-p btn-block" data-lockgo="1">🎁 '+t("lk.free")+'</button>':
   '<button class="btn btn-p btn-block" data-lockgo="1">🔓 '+t("lk.buy",{n:d.price||3})+'</button>'+(pr?'<button class="lockvip" data-paysheet="1">👑 '+t("lk.vipP")+' · <span data-promocd="1">'+hms(promoLeft())+'</span></button>':'<button class="lockvip" data-paysheet="1">👑 '+t("lk.vip")+'</button>'))+
  '<button class="stskip" data-lockskip="1">'+t("lk.skip")+' ›</button></div></div>'};
document.addEventListener("click",e=>{const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop||th.pk.stop[1]!=="lock")return;const d=th.pk.stop[2],k=lockKey(th,d);
 if(e.target.closest("[data-lockgo]")){S.unlocked=S.unlocked||{};S.lockFree=S.lockFree||{};
  if(!S.unlocked[k]&&!S.plus){if(S.lockFree[th.wid]==null){S.lockFree[th.wid]=k}else if(!spend(d.price||3,"event"))return}
  S.unlocked[k]=1;save();stopResolve(th,[["sys","event",{icon:"🔓",title:Lz(d.title),txt:t("lk.done")}]].concat(lockBeats(d)));return}
 if(e.target.closest("[data-lockskip]")){stopResolve(th,[]);return}});
Object.assign(I18N.en,{"lk.key":"Key scene","lk.open":"Watch this scene","lk.free":"First key scene is on us — watch free","lk.buy":"Unlock this scene · 💎{n}","lk.vip":"Members watch every key scene free","lk.vipP":"New members: first week free","lk.skip":"Skip, keep the main story","lk.done":"Bonus scene unlocked"});
Object.assign(I18N.zh,{"lk.key":"关键剧情","lk.open":"观看这一幕","lk.free":"本剧第一个关键剧情免费送你","lk.buy":"解锁这一幕 · 💎{n}","lk.vip":"会员所有关键剧情免费看","lk.vipP":"新人会员首周免费","lk.skip":"跳过，继续主线","lk.done":"隐藏剧情已解锁"});

/* ===== game ↔ story: the result you actually got always reaches the script =====
   - The moment a game ends, its result is stored on the story feature (PKFEAT.res).
   - If you close the game sheet instead of tapping "back to chat", "▶ continue" still uses that result
     (heart: the bpm you reached even if you quit early; quiz: your score), never the template's raw default.
   - If there is no result at all (closed before playing / app reloaded), the story takes the feature's "skip" line instead of pretending you won. */
const _heartEnd20=heartEnd;heartEnd=function(){_heartEnd20();const th=S.threads[curT];if(PKFEAT&&th===PKFEAT.th&&PKFEAT.k==="heart"&&hg){PKFEAT.res={txt:"got the heart up to "+Math.min(190,72+hg.score*3)+" bpm"}}};
document.addEventListener("click",e=>{if(!e.target.closest("[data-featback]"))return;const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop||th.pk.stop[1]!=="feature")return;
 e.stopImmediatePropagation();const d=th.pk.stop[2];
 if(PKFEAT&&PKFEAT.th===th){let res=PKFEAT.res;
  if(!res&&PKFEAT.k==="heart"&&hg&&hg.score)res={txt:"got the heart up to "+Math.min(190,72+hg.score*3)+" bpm"};
  if(!res&&PKFEAT.k==="quiz"&&typeof qz!=="undefined"&&qz&&qz.score!=null&&qz.i>0)res={txt:"quiz"};
  if(res){featDone(th,res);return}}
 PKFEAT=null;stopResolve(th,d.skip||[])},true);
