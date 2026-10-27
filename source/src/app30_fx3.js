/* ================= v130 FX3 — ice that creeps along the frame + an EMOTION layer =================
   ICE ("ice" / "iceshatter")
     Frost crystals grow procedurally from the right edge, up the frame, across the top and a little way down the left:
     hexagonal dendrites (60° side branches, up to 3 levels), a frosted haze hugging the frame, a bright freezing "head"
     travelling along the edge, twinkling glints and a specular gleam that slides over the frost. The centre stays clear.
     "iceshatter" (or any other effect replacing ice) breaks it: cracks race out from an impact point, then the glass flies
     apart in shards that carry the frost and a refracted ghost of the scene, with chromatic edges and glitter.
   EMOTION (window.emoFx(kind)) — short, readable-safe, one at a time (a new one replaces the old):
     heartbeat — rose vignette pulsing lub-dub ×3, heart-shaped shock rings behind the text, a 1.006 screen thump
     bloom     — warm gold-pink light rising from the bottom, drifting bokeh + sparkles, an anamorphic lens streak
     ink       — violet ink-in-water clouding out from behind the newest box (inner voice), opacity ≤ .35
     shock     — RGB split on text and scene, red edge flash, glitch slivers, tiny shake + zoom punch
     longing   — a cool blue light leak sweeping slowly across, dust motes catching the light, the scene cools
   Triggered by the story itself (no content edits): the attitude you choose, inner-voice beats, 吻/kiss narration,
   events, unlocked key scenes, the heartbeat game. Off while skipping; no shake/zoom with reduced motion. */
(function(){
const RM=()=>{try{return matchMedia("(prefers-reduced-motion: reduce)").matches}catch(_){return false}};
const TS=()=>window.FX3_TS||1,PN=()=>window.FX3_CLOCK!=null?window.FX3_CLOCK:performance.now(),R=Math.random,rnd=(a,b)=>a+R()*(b-a),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),sm=(a,b,v)=>{const u=clamp((v-a)/(b-a),0,1);return u*u*(3-2*u)};
const st=document.createElement("style");st.id="fx3css";st.textContent=
 "#iceFx{position:absolute;inset:0;width:100%;height:100%;z-index:6;pointer-events:none}"+
 "#emoTop{position:absolute;inset:0;width:100%;height:100%;z-index:8;pointer-events:none}"+
 ".chatbg #emoBack{position:absolute;inset:0;width:100%;height:100%;z-index:4;pointer-events:none;mix-blend-mode:screen}"+
 ".chatscreen .cbimg img{transition:opacity 1.2s ease,filter .9s ease}"+
 ".chatscreen.emo-warm .cbimg img,.chatscreen.emo-warm .cbimg img.scimg{filter:saturate(1.22) brightness(1.15) sepia(.16)!important}"+
 ".chatscreen.emo-cool .cbimg img,.chatscreen.emo-cool .cbimg img.scimg{filter:saturate(.5) brightness(.9) hue-rotate(-12deg)!important}"+
 ".chatscreen.emo-rose .cbimg img,.chatscreen.emo-rose .cbimg img.scimg{filter:saturate(1.2) brightness(1.06)!important}"+
 ".chatscreen.emo-ca .msgs *{text-shadow:-1.6px 0 rgba(255,40,70,.85),1.6px 0 rgba(0,225,255,.85)!important}"+
 ".chatscreen.emo-ca .chatbg{filter:url(#emoCAf)}";
document.head.appendChild(st);
const svgNS="http://www.w3.org/2000/svg";
function caFilter(){if(document.getElementById("emoCAf"))return;const s=document.createElementNS(svgNS,"svg");s.setAttribute("width","0");s.setAttribute("height","0");s.style.cssText="position:absolute;width:0;height:0";
 s.innerHTML='<filter id="emoCAf" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB"><feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="r"/><feOffset id="emoCAr" in="r" dx="-7" dy="0" result="r2"/><feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0" result="gb"/><feOffset id="emoCAb" in="gb" dx="7" dy="0" result="gb2"/><feBlend in="r2" in2="gb2" mode="screen"/></filter>';
 document.body.appendChild(s)}
function chatEl(){const s=$("#s-chat");return s&&!s.hidden&&document.body.contains(s)?s:null}
function mount(id,parent){let c=document.getElementById(id);if(c&&c.parentElement===parent)return c;if(c)c.remove();c=document.createElement("canvas");c.id=id;parent.appendChild(c);return c}
function fit(c,dpr){const W=Math.max(1,c.clientWidth),H=Math.max(1,c.clientHeight),w=Math.round(W*dpr),h=Math.round(H*dpr);if(c.width!==w||c.height!==h){c.width=w;c.height=h}const x=c.getContext("2d");x.setTransform(dpr,0,0,dpr,0,0);return {x,W,H}}
function skipping(){try{return typeof PKSKIP!=="undefined"&&curT&&PKSKIP[curT]}catch(_){return false}}
function shakeScr(){if(RM())return;const s=chatEl();if(!s)return;s.classList.remove("fxshake");void s.offsetWidth;s.classList.add("fxshake")}
function vib(p){try{navigator.vibrate&&navigator.vibrate(p)}catch(_){}}
/* the scene image, drawn as object-fit:cover inside its own (transformed) box — used for refraction inside shards */
function bgDraw(x,ox,oy){const box=$("#cbImg"),scr=chatEl();if(!box||!scr)return;const el=box.querySelector("video.on")||box.querySelector("img.front.on,img.scimg.on,img.on");if(!el)return;
 const iw=el.videoWidth||el.naturalWidth,ih=el.videoHeight||el.naturalHeight;if(!iw||!ih)return;const r=el.getBoundingClientRect(),s0=scr.getBoundingClientRect();
 const sc=Math.max(r.width/iw,r.height/ih),dw=iw*sc,dh=ih*sc;try{x.drawImage(el,r.left-s0.left+(r.width-dw)*.5+ox,r.top-s0.top+(r.height-dh)*.2+oy,dw,dh)}catch(_){}}

/* ======================= ICE ======================= */
const ICE={cv:null,F:null,raf:0,phase:"off",tid:null,kind:null,W:0,H:0,dpr:1,seeds:null,P:null,br:[],segs:0,glints:[],tips:[],t0:0,last:0,front:0,shatterAt:0,sh:null,done:false,spent:{}};
const GROW=2.3;
function icePath(W,H){const A=H*.9,B=W,C=H*.42,L=A+B+C;
 return {L,A,B,at(s){if(s<A)return {x:W,y:H*.9-s,nx:-1,ny:0,seg:0};s-=A;if(s<B)return {x:W-s,y:0,nx:0,ny:1,seg:1};s-=B;return {x:0,y:Math.min(C,s),nx:1,ny:0,seg:2}}}}
function iceSeeds(W,H){const P=icePath(W,H),out=[],ph=[R()*6,R()*6,R()*6];let s=0;
 while(s<P.L){const p=P.at(s),dR=Math.hypot(p.x-W,p.y),dL=Math.hypot(p.x,p.y),dc=Math.min(dR,dL);
  const n=.66+.22*Math.sin(s*.017+ph[0])+.16*Math.sin(s*.047+ph[1])+.1*Math.sin(s*.12+ph[2]);
  let D=(p.seg===1?Math.min(H*.04,32):Math.min(W*.11,46))*n+95*Math.exp(-dc/110);
  D*=.45+.55*Math.min(1,s/50,(P.L-s)/110);if(R()<.14)D*=1.55;
  const k=Math.exp(-dc/90)*1.4,cd=dR<dL?[-.707,.707]:[.707,.707];let nx=p.nx+cd[0]*k,ny=p.ny+cd[1]*k;const l=Math.hypot(nx,ny)||1;nx/=l;ny/=l;
  out.push({s,x:p.x,y:p.y,nx,ny,D,on:false,tang:p.seg===1?[1,0]:[0,1]});s+=rnd(9,17)}
 return {P,seeds:out}}
function iceNew(W,H,dpr){const F=document.createElement("canvas");F.width=Math.round(W*dpr);F.height=Math.round(H*dpr);const fx=F.getContext("2d");fx.setTransform(dpr,0,0,dpr,0,0);
 const S0=iceSeeds(W,H);Object.assign(ICE,{F,fx,G:null,W,H,dpr,seeds:S0.seeds,P:S0.P,br:[],segs:0,glints:[],tips:[],front:0,done:false,sh:null})}
const WID=[1.25,.75,.5],COREA=[.88,.6,.42],GLOWA=[.1,.05,0];
function flake(x,cx,cy,r,a){x.save();x.translate(cx,cy);x.rotate(R()*1.05);x.strokeStyle="rgba(235,247,255,"+a+")";x.lineWidth=.6;x.beginPath();
 for(let i=0;i<6;i++){const c=Math.cos(i*Math.PI/3),s=Math.sin(i*Math.PI/3);x.moveTo(0,0);x.lineTo(c*r,s*r);const m=r*.55,q=r*.3;
  x.moveTo(c*m,s*m);x.lineTo(c*m+Math.cos(i*Math.PI/3+.9)*q,s*m+Math.sin(i*Math.PI/3+.9)*q);x.moveTo(c*m,s*m);x.lineTo(c*m+Math.cos(i*Math.PI/3-.9)*q,s*m+Math.sin(i*Math.PI/3-.9)*q)}x.stroke();x.restore()}
function iceSeedOn(sd){const x=ICE.fx;sd.on=true;
 const top=sd.tang[0]===1&&sd.D<70,g=x.createRadialGradient(sd.x,sd.y,0,sd.x,sd.y,sd.D*(top?.9:1.25));g.addColorStop(0,"rgba(225,240,255,"+(top?.16:.28)+")");g.addColorStop(.45,"rgba(195,222,255,.1)");g.addColorStop(1,"rgba(190,220,255,0)");
 x.fillStyle=g;x.fillRect(sd.x-sd.D*1.3,sd.y-sd.D*1.3,sd.D*2.6,sd.D*2.6);
 x.strokeStyle="rgba(240,250,255,.6)";x.lineWidth=2;x.beginPath();x.moveTo(sd.x-sd.tang[0]*9,sd.y-sd.tang[1]*9);x.lineTo(sd.x+sd.tang[0]*9,sd.y+sd.tang[1]*9);x.stroke();
 x.fillStyle="rgba(240,250,255,.45)";for(let i=0;i<10;i++){const d=R()*R()*sd.D*.9,o=rnd(-9,9);x.fillRect(sd.x+sd.nx*d+sd.tang[0]*o,sd.y+sd.ny*d+sd.tang[1]*o,rnd(.4,1.1),rnd(.4,1.1))}
 if(R()<.35){const d=rnd(.15,.7)*sd.D;flake(x,sd.x+sd.nx*d+rnd(-6,6)*sd.tang[0],sd.y+sd.ny*d+rnd(-6,6)*sd.tang[1],rnd(2.5,5.5),rnd(.35,.6))}
 const a=Math.atan2(sd.ny,sd.nx)+rnd(-.5,.5);ICE.br.push({x:sd.x-sd.nx*2,y:sd.y-sd.ny*2,a,cv:rnd(-.012,.012),rem:sd.D,len0:sd.D,v:rnd(110,150),d:0,nb:rnd(2,4),sd:R()<.5?1:-1,ms:rnd(9,17)*(sd.D>60?1.25:1)});
 if(sd.D>55&&R()<.55){const L=sd.D*rnd(.45,.7);ICE.br.push({x:sd.x,y:sd.y,a:a+rnd(.5,.8)*(R()<.5?1:-1),cv:rnd(-.015,.015),rem:L,len0:L,v:rnd(95,125),d:0,nb:rnd(2,4),sd:1,ms:rnd(7,12)})}}
function iceStep(dt){const segs=[[],[],[]],nb=[];const x=ICE.fx;
 for(const b of ICE.br){const L=Math.min(b.v*dt,b.rem);const x0=b.x,y0=b.y;if(b.d===0)b.a+=b.cv*L;b.x+=Math.cos(b.a)*L;b.y+=Math.sin(b.a)*L;b.rem-=L;b.nb-=L;segs[b.d].push(x0,y0,b.x,b.y);
  while(b.nb<=0&&b.d<2&&ICE.segs<16000){const f=b.d===0?Math.pow(Math.max(0,b.rem)/b.len0,.7):Math.max(0,b.rem)/b.len0;
   const len=b.d===0?b.ms*f*rnd(.55,1.1)+1.5:b.ms*f*rnd(.5,1)+.8;
   const sides=b.d===0&&R()<.35?[1,-1]:[b.sd];b.sd=-b.sd;
   sides.forEach(sg=>{if(len>1.2)nb.push({x:b.x,y:b.y,a:b.a+sg*rnd(.95,1.12),rem:len,len0:len,v:b.v*.75,d:b.d+1,nb:rnd(1.6,2.8),sd:R()<.5?1:-1,ms:len*.55})});
   b.nb+=b.d===0?rnd(2.2,4.2):rnd(1.6,2.8);if(b.rem<=0)break}
  if(b.rem<=0&&b.d===0&&ICE.tips.length<400)ICE.tips.push([b.x,b.y])}
 ICE.br=ICE.br.filter(b=>b.rem>0).concat(nb);
 x.lineCap="round";
 segs.forEach((S1,d)=>{if(!S1.length||!GLOWA[d])return;x.strokeStyle="rgba(150,205,255,"+GLOWA[d]+")";x.lineWidth=d?3:5;x.beginPath();for(let i=0;i<S1.length;i+=4){x.moveTo(S1[i],S1[i+1]);x.lineTo(S1[i+2],S1[i+3])}x.stroke()});
 segs.forEach((S1,d)=>{if(!S1.length)return;ICE.segs+=S1.length/4;x.strokeStyle="rgba(236,248,255,"+COREA[d]+")";x.lineWidth=WID[d];x.beginPath();for(let i=0;i<S1.length;i+=4){x.moveTo(S1[i],S1[i+1]);x.lineTo(S1[i+2],S1[i+3])}x.stroke()})}
function star(x,cx,cy,s,a){x.globalAlpha=a;const g=x.createLinearGradient(cx-s,0,cx+s,0);g.addColorStop(0,"rgba(200,235,255,0)");g.addColorStop(.5,"rgba(255,255,255,1)");g.addColorStop(1,"rgba(200,235,255,0)");x.fillStyle=g;x.fillRect(cx-s,cy-.6,s*2,1.2);
 const g2=x.createLinearGradient(0,cy-s,0,cy+s);g2.addColorStop(0,"rgba(200,235,255,0)");g2.addColorStop(.5,"rgba(255,255,255,1)");g2.addColorStop(1,"rgba(200,235,255,0)");x.fillStyle=g2;x.fillRect(cx-.6,cy-s,1.2,s*2);
 const g3=x.createRadialGradient(cx,cy,0,cx,cy,s*.45);g3.addColorStop(0,"rgba(255,255,255,.95)");g3.addColorStop(1,"rgba(170,215,255,0)");x.fillStyle=g3;x.fillRect(cx-s*.45,cy-s*.45,s*.9,s*.9);x.globalAlpha=1}
function iceDraw(t){const {x,W,H}=fit(ICE.cv,ICE.dpr);x.clearRect(0,0,W,H);const prog=clamp(ICE.front/ICE.P.L,0,1);
 /* cold breath on the glass */
 const v=x.createRadialGradient(W/2,H*.45,Math.min(W,H)*.35,W/2,H*.45,Math.hypot(W,H)*.62);v.addColorStop(0,"rgba(150,200,255,0)");v.addColorStop(1,"rgba(150,200,255,"+(.16*prog)+")");x.fillStyle=v;x.fillRect(0,0,W,H);
 x.drawImage(ICE.F,0,0,W,H);
 /* bloom: the frost downsampled (a cheap blur) and added back */
 if(!ICE.G){ICE.G=document.createElement("canvas");ICE.G.width=Math.max(1,W/5|0);ICE.G.height=Math.max(1,H/5|0);ICE.gd=0}
 if(ICE.phase==="grow"||!ICE.gd){const gx=ICE.G.getContext("2d");gx.clearRect(0,0,ICE.G.width,ICE.G.height);gx.drawImage(ICE.F,0,0,ICE.G.width,ICE.G.height);ICE.gd=ICE.phase!=="grow"}
 x.save();x.globalCompositeOperation="lighter";x.globalAlpha=.26;x.drawImage(ICE.G,0,0,W,H);x.restore();
 /* a gleam sliding across the frost only (source-atop on the frost pixels) */
 const gp=((t-GROW+.3)%5.5)/1.4;if(t>GROW-.3&&gp>=0&&gp<=1&&!RM()){x.save();x.globalCompositeOperation="source-atop";const gx=-W*.3+gp*(W*1.6);x.translate(gx,0);x.rotate(.35);
  const g=x.createLinearGradient(-60,0,60,0);g.addColorStop(0,"rgba(255,255,255,0)");g.addColorStop(.5,"rgba(255,255,255,.75)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(-60,-H,120,H*3);x.restore()}
 x.globalCompositeOperation="lighter";
 /* the freezing head travelling along the frame */
 if(ICE.phase==="grow"&&prog<1){const p=ICE.P.at(ICE.front),r=48;const g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,r);g.addColorStop(0,"rgba(220,240,255,.85)");g.addColorStop(.25,"rgba(160,210,255,.35)");g.addColorStop(1,"rgba(120,180,255,0)");x.fillStyle=g;x.fillRect(p.x-r,p.y-r,r*2,r*2);star(x,p.x,p.y,26,.9)}
 /* glints */
 if(ICE.tips.length&&ICE.glints.length<14&&R()<.35){const tp=ICE.tips[R()*ICE.tips.length|0];ICE.glints.push({x:tp[0],y:tp[1],t:0,l:rnd(.5,1.1),s:rnd(5,11)})}
 ICE.glints.forEach(g=>{g.t+=1/60*TS();const a=Math.sin(Math.PI*clamp(g.t/g.l,0,1));star(x,g.x,g.y,g.s,a*.85)});ICE.glints=ICE.glints.filter(g=>g.t<g.l);
 x.globalCompositeOperation="source-over"}
function iceLoop(){cancelAnimationFrame(ICE.raf);const tick=n0=>{const now=window.FX3_CLOCK!=null?window.FX3_CLOCK:n0;if(!ICE.cv||!document.body.contains(ICE.cv)){ICE.phase=ICE.done?"cached":"off";return}
  const scr=ICE.cv.closest(".screen");if(scr&&scr.hidden){ICE.raf=0;setTimeout(()=>{if(ICE.cv&&!ICE.raf&&ICE.phase!=="off")iceLoop()},500);return}
  const dt=clamp((now-ICE.last)/1000*TS(),0,.05);ICE.last=now;const t=(now-ICE.t0)/1000*TS();
  if(ICE.phase==="grow"){const u=clamp(t/GROW,0,1),e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;const f=ICE.P.L*(.12*u+.88*e);ICE.seeds.forEach(sd=>{if(!sd.on&&sd.s<=f)iceSeedOn(sd)});ICE.front=f;iceStep(dt);
   if(u>=1&&!ICE.br.length){ICE.phase="hold";ICE.done=true;if(ICE.kind==="iceshatter")ICE.shatterAt=now+500}}
  else if(ICE.br.length)iceStep(dt);
  if(ICE.phase==="shatter"){if(!shatterFrame(now))return}else iceDraw(t);
  if(ICE.phase==="hold"&&ICE.shatterAt&&now>=ICE.shatterAt){ICE.shatterAt=0;iceShatter()}
  ICE.raf=requestAnimationFrame(tick)};ICE.last=PN();ICE.raf=requestAnimationFrame(tick)}
function iceStart(kind){const scr=chatEl();if(!scr)return;const tid=curT;
 if(kind==="iceshatter"&&ICE.spent[tid]){iceClear(true);return}
 const live=ICE.cv&&document.body.contains(ICE.cv)&&ICE.tid===tid&&ICE.phase!=="off";
 if(live&&(ICE.phase==="grow"||ICE.phase==="hold")){ICE.kind=kind;if(kind==="iceshatter"&&ICE.phase==="hold"&&!ICE.shatterAt)ICE.shatterAt=PN()+250;return}
 if(live&&ICE.phase==="shatter")return;
 ICE.cv=mount("iceFx",scr);const W=Math.max(1,ICE.cv.clientWidth),H=Math.max(1,ICE.cv.clientHeight),dpr=Math.min(2,window.devicePixelRatio||1);
 if(ICE.tid===tid&&ICE.done&&ICE.F&&ICE.W===W&&ICE.H===H&&kind==="ice"){ICE.phase="hold";ICE.kind=kind;ICE.t0=PN()-GROW*1000;ICE.front=ICE.P.L;iceLoop();return}
 ICE.tid=tid;ICE.kind=kind;iceNew(W,H,dpr);ICE.phase="grow";ICE.shatterAt=0;ICE.t0=PN();
 if(RM()){ICE.seeds.forEach(iceSeedOn);for(let i=0;i<200&&ICE.br.length;i++)iceStep(.05);ICE.front=ICE.P.L;ICE.phase="hold";ICE.done=true;ICE.t0-=GROW*1000;if(kind==="iceshatter")ICE.shatterAt=PN()+900}
 iceLoop()}
function iceClear(keepSpent){cancelAnimationFrame(ICE.raf);ICE.raf=0;if(ICE.cv)ICE.cv.remove();ICE.cv=null;ICE.phase="off";ICE.done=false;ICE.F=null;ICE.sh=null}
/* ---- shatter ---- */
function iceShatter(){if(!ICE.cv){const scr=chatEl();if(!scr)return;ICE.cv=mount("iceFx",scr);ICE.tid=curT;const W=Math.max(1,ICE.cv.clientWidth),H=Math.max(1,ICE.cv.clientHeight);iceNew(W,H,Math.min(2,window.devicePixelRatio||1));ICE.front=ICE.P.L;ICE.t0=PN();iceLoop()}
 if(ICE.phase==="shatter")return;ICE.spent[ICE.tid]=1;
 const W=ICE.W,H=ICE.H,I={x:W*rnd(.56,.68),y:H*rnd(.3,.4)},NC=14,a0=R()*6.28,RS=[0,30,72,130,205,300,420,570,760,1000,1300];
 const ang=[...Array(NC)].map((_,i)=>a0+i*Math.PI*2/NC+rnd(-.16,.16));
 const C=ang.map(a=>RS.map((r,k)=>{const aa=a+(k?rnd(-.07,.07):0),rr=r*(k?rnd(.86,1.14):0);return [I.x+Math.cos(aa)*rr,I.y+Math.sin(aa)*rr]}));
 const shards=[];
 for(let i=0;i<NC;i++){const j=(i+1)%NC;for(let k=0;k<RS.length-1;k++){const q=k===0?[C[i][0],C[j][1],C[i][1]]:[C[i][k],C[j][k],C[j][k+1],C[i][k+1]];
   const polys=(q.length===4&&k>=2&&R()<.6)?(R()<.5?[[q[0],q[1],q[2]],[q[0],q[2],q[3]]]:[[q[0],q[1],q[3]],[q[1],q[2],q[3]]]):[q];
   polys.forEach(pg=>{const xs=pg.map(p=>p[0]),ys=pg.map(p=>p[1]),bx=Math.min(...xs),by=Math.min(...ys),bw=Math.max(...xs)-bx,bh=Math.max(...ys)-by;if(bx>W+20||by>H+20||bx+bw<-20||by+bh<-20)return;
    const cx=xs.reduce((a,b)=>a+b)/xs.length,cy=ys.reduce((a,b)=>a+b)/ys.length,dx=cx-I.x,dy=cy-I.y,dl=Math.hypot(dx,dy)||1;
    shards.push({pg,cx,cy,bx,by,bw,bh,ux:dx/dl,uy:dy/dl,v:rnd(260,560)*(1.25-Math.min(1,dl/700)*.55),w:rnd(-4.5,4.5),z:rnd(.15,.55),hl:R()*pg.length|0,hue:R()<.5})})}}
 const bits=[...Array(RM()?40:150)].map(()=>{const a=R()*6.28,s=rnd(120,900);return {x:I.x+rnd(-20,20),y:I.y+rnd(-20,20),vx:Math.cos(a)*s,vy:Math.sin(a)*s,s:rnd(.8,2.6),l:rnd(.35,.8)}});
 const J=C.map(row=>row.map((p,k)=>{if(!k)return p;const q=row[k-1],dx=p[0]-q[0],dy=p[1]-q[1],j=rnd(-.09,.09),f=rnd(.35,.65);return [q[0]+dx*f-dy*j,q[1]+dy*f+dx*j]}));
 const ring=[];for(let k=2;k<RS.length-1;k++)for(let i=0;i<NC;i++)if(R()<.32)ring.push([i,k]);const crush=[...Array(12)].map(()=>[R()*6.28,rnd(8,34)]);
 ICE.sh={I,C,J,ring,crush,shards,bits,t0:PN(),RS};ICE.phase="shatter";ICE.br=[];
 setTimeout(()=>{shakeScr();vib([25,30,70])},170);if(!ICE.raf)iceLoop()}
function shatterFrame(now){const sh=ICE.sh,{x,W,H}=fit(ICE.cv,ICE.dpr),t=(now-sh.t0)/1000*TS(),CR=.17,DUR=1.0;x.clearRect(0,0,W,H);
 if(t>CR+DUR){iceClear();return false}
 const I=sh.I,rm=RM();
 if(t<CR){x.drawImage(ICE.F,0,0,W,H);const reach=sm(0,CR,t)*1150;
  x.lineCap="round";x.lineJoin="round";[[4.5,"rgba(160,215,255,.3)"],[1.1,"rgba(255,255,255,.95)"]].forEach(([lw,col])=>{x.strokeStyle=col;x.lineWidth=lw;x.beginPath();
   sh.C.forEach((row,i)=>{x.moveTo(I.x,I.y);for(let k=1;k<row.length;k++){const p=row[k],q=row[k-1],m=sh.J[i][k];if(sh.RS[k]>reach){const f=clamp((reach-sh.RS[k-1])/(sh.RS[k]-sh.RS[k-1]),0,1);if(f>.5){x.lineTo(m[0],m[1]);const g=(f-.5)*2;x.lineTo(m[0]+(p[0]-m[0])*g,m[1]+(p[1]-m[1])*g)}else{const g=f*2;x.lineTo(q[0]+(m[0]-q[0])*g,q[1]+(m[1]-q[1])*g)}break}x.lineTo(m[0],m[1]);x.lineTo(p[0],p[1])}});
   sh.ring.forEach(([i,k])=>{if(sh.RS[k]>reach*.8)return;const a=sh.C[i][k],n=sh.C[(i+1)%sh.C.length][k];x.moveTo(a[0],a[1]);x.quadraticCurveTo((a[0]+n[0])/2+(a[0]+n[0]-2*I.x)*.04,(a[1]+n[1])/2+(a[1]+n[1]-2*I.y)*.04,n[0],n[1])});
   sh.crush.forEach(([a,l])=>{x.moveTo(I.x,I.y);x.lineTo(I.x+Math.cos(a)*l,I.y+Math.sin(a)*l)});x.stroke()});
  x.globalCompositeOperation="lighter";const g=x.createRadialGradient(I.x,I.y,0,I.x,I.y,120);g.addColorStop(0,"rgba(255,255,255,"+(.9*t/CR)+")");g.addColorStop(1,"rgba(160,210,255,0)");x.fillStyle=g;x.fillRect(I.x-120,I.y-120,240,240);x.globalCompositeOperation="source-over";return true}
 const tau=t-CR,u=tau/DUR,fade=1-Math.pow(u,1.4);
 if(tau<.22){x.fillStyle="rgba(215,235,255,"+(.22*(1-tau/.22))+")";x.fillRect(0,0,W,H)}
 sh.shards.forEach(s=>{const d=rm?0:s.v*tau*(1+tau*.8),px=s.cx+s.ux*d,py=s.cy+s.uy*d+(rm?0:300*tau*tau),rot=rm?0:s.w*tau,scl=1+(rm?0:s.z*tau*1.6);
  x.save();x.translate(px,py);x.rotate(rot);x.scale(scl,scl);x.translate(-s.cx,-s.cy);x.beginPath();s.pg.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();
  x.save();x.clip();x.globalAlpha=.34*fade;bgDraw(x,s.ux*16+s.uy*6,s.uy*16-s.ux*6);x.globalAlpha=fade;
  const sx=Math.max(0,s.bx),sy=Math.max(0,s.by),sw=Math.min(W,s.bx+s.bw)-sx,sh2=Math.min(H,s.by+s.bh)-sy;if(sw>0&&sh2>0)x.drawImage(ICE.F,sx*ICE.dpr,sy*ICE.dpr,sw*ICE.dpr,sh2*ICE.dpr,sx,sy,sw,sh2);
  const g=s.hue?x.createLinearGradient(s.bx,s.by,s.bx+s.bw,s.by+s.bh):x.createLinearGradient(s.bx+s.bw,s.by,s.bx,s.by+s.bh);g.addColorStop(0,"rgba(255,255,255,.34)");g.addColorStop(.3,"rgba(215,238,255,.1)");g.addColorStop(.7,"rgba(170,215,255,.05)");g.addColorStop(1,"rgba(235,248,255,.24)");x.fillStyle=g;x.fillRect(s.bx,s.by,s.bw,s.bh);x.restore();
  x.lineWidth=1/scl;x.strokeStyle="rgba(235,248,255,"+(.42*fade)+")";x.stroke();
  x.globalCompositeOperation="lighter";x.save();x.translate(.9,0);x.strokeStyle="rgba(0,220,255,"+(.35*fade)+")";x.stroke();x.translate(-1.8,0);x.strokeStyle="rgba(255,60,200,"+(.3*fade)+")";x.stroke();x.restore();
  const a=s.pg[s.hl],b=s.pg[(s.hl+1)%s.pg.length];x.strokeStyle="rgba(255,255,255,"+(.85*fade)+")";x.lineWidth=2.2/scl;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();x.globalCompositeOperation="source-over";x.restore()});
 x.globalCompositeOperation="lighter";sh.bits.forEach(b=>{const a=clamp(1-tau/b.l,0,1);if(!a)return;const px=b.x+b.vx*tau,py=b.y+b.vy*tau+200*tau*tau;x.fillStyle="rgba(255,255,255,"+a+")";x.fillRect(px,py,b.s,b.s);
  x.strokeStyle="rgba(220,240,255,"+(a*.35)+")";x.lineWidth=b.s*.6;x.beginPath();x.moveTo(px,py);x.lineTo(px-b.vx*.02,py-b.vy*.02);x.stroke()});x.globalCompositeOperation="source-over";return true}
window.iceFx={start:iceStart,shatter:iceShatter,clear:iceClear,state:()=>ICE.phase};

/* route ice kinds through the main fxRun; anything else replacing live ice shatters it first */
const _fxRun30=fxRun;
fxRun=function(kind){if(kind==="ice"||kind==="iceshatter"){_fxRun30("none");fxState.k=kind;iceStart(kind);return}
 if(ICE.cv&&document.body.contains(ICE.cv)&&(ICE.phase==="grow"||ICE.phase==="hold")&&ICE.tid===curT&&kind!=="__none"){if(RM())iceClear();else iceShatter()}
 else if(ICE.phase==="cached"||(ICE.cv&&!document.body.contains(ICE.cv)))iceClear();
 return _fxRun30(kind)};
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-fxk]");if(b&&/^ice/.test(b.dataset.fxk))delete ICE.spent[curT]},true);
if(typeof FX2!=="undefined")FX2.push("ice","iceshatter");
if(typeof FXLIST!=="undefined")FXLIST.push(["ice","🧊"],["iceshatter","💠"]);
if(typeof FX2MOOD!=="undefined")Object.assign(FX2MOOD,{ice:"sad",iceshatter:"tense"});
if(typeof FX_RULES!=="undefined")FX_RULES.unshift([/冰碎|碎裂的冰|玻璃碎|shatter/i,"iceshatter"],[/结冰|冰封|冻住|霜花|frost(ed)? over|frozen|freezing/i,"ice"]);
Object.assign(I18N.en,{"fx.ice":"Frost","fx.iceshatter":"Shattering ice"});Object.assign(I18N.zh,{"fx.ice":"冰封","fx.iceshatter":"冰裂"});
if(I18N.ja)Object.assign(I18N.ja,{"fx.ice":"凍てつく","fx.iceshatter":"砕ける氷"});if(I18N.ko)Object.assign(I18N.ko,{"fx.ice":"서리","fx.iceshatter":"깨지는 얼음"});if(I18N.es)Object.assign(I18N.es,{"fx.ice":"Escarcha","fx.iceshatter":"Hielo roto"});

/* ======================= EMOTION ======================= */
const DUR={heartbeat:2.8,bloom:3.6,ink:3.4,shock:.95,longing:3.8};
const EMO={k:null,raf:0,t0:0,dur:0,st:null,timers:[],scr:null,cls:null};
function emoStop(){cancelAnimationFrame(EMO.raf);EMO.timers.forEach(clearTimeout);EMO.timers=[];const s=EMO.scr;if(s)s.classList.remove("emo-warm","emo-cool","emo-rose","emo-ca");
 ["emoTop","emoBack"].forEach(id=>{const c=document.getElementById(id);if(c){const x=c.getContext("2d");x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,c.width,c.height);c.style.opacity=0}});EMO.k=null;EMO.st=null}
function cmask(x,W,H,k){x.save();x.globalCompositeOperation="destination-out";x.translate(W/2,H*.5);x.scale(1,H/W*.82);const r=W*.66,g=x.createRadialGradient(0,0,0,0,0,r);
 g.addColorStop(0,"rgba(0,0,0,"+k+")");g.addColorStop(.55,"rgba(0,0,0,"+(k*.85)+")");g.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=g;x.fillRect(-r,-r,2*r,2*r);x.restore()}
function heartPath(x,cx,cy,s){x.beginPath();for(let i=0;i<=48;i++){const a=i/48*Math.PI*2,hx=16*Math.pow(Math.sin(a),3),hy=-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a));i?x.lineTo(cx+hx*s/16,cy+hy*s/16):x.moveTo(cx+hx*s/16,cy+hy*s/16)}x.closePath()}
function thump(scr,k){if(RM()||!scr.animate)return;try{scr.animate([{transform:"scale(1)"},{transform:"scale("+(1+.006*k)+")",offset:.28},{transform:"scale(1)"}],{duration:320,easing:"cubic-bezier(.2,.8,.3,1)"});
 const bg=scr.querySelector("#chatBg");if(bg)bg.animate([{transform:"scale(1)"},{transform:"scale("+(1+.022*k)+")",offset:.25},{transform:"scale(1)"}],{duration:420,easing:"ease-out"})}catch(_){}}
function heartSound(){try{if(typeof BGM==="undefined"||!BGM.ctx||BGM.ctx.state!=="running"||!(S.bgm))return;const c=BGM.ctx,t=c.currentTime;[[0,.3],[.23,.18]].forEach(([d,v])=>{const o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.setValueAtTime(70,t+d);o.frequency.exponentialRampToValueAtTime(38,t+d+.16);o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(v,t+d+.012);g.gain.exponentialRampToValueAtTime(.001,t+d+.24);o.start(t+d);o.stop(t+d+.3)})}catch(_){}}
const BEATS=[.06,.9,1.74];
const benv=u=>u<0?0:(1-Math.exp(-u/.022))*Math.exp(-u/.19);
const FXE={
 heartbeat:{init(st,scr){scr.classList.add("emo-rose");BEATS.forEach((b,i)=>{EMO.timers.push(setTimeout(()=>{thump(scr,1);vib([22]);heartSound()},b*1000),setTimeout(()=>thump(scr,.5),(b+.23)*1000))})},
  draw(t,B,T,st){const D=DUR.heartbeat,f=sm(0,.12,t)*(1-sm(D-.7,D,t));let p=0;BEATS.forEach(b=>p+=benv(t-b)+.6*benv(t-b-.23));p=Math.min(1.2,p);
   {const {x,W,H}=T;x.save();x.translate(W/2,H*.48);x.scale(1,H/W*.92);const r0=W*(.42-.05*p),r1=W*.86,g=x.createRadialGradient(0,0,r0,0,0,r1);
    g.addColorStop(0,"rgba(255,40,100,0)");g.addColorStop(.35,"rgba(255,45,105,"+(.08+.22*p)*f+")");g.addColorStop(.75,"rgba(190,10,60,"+(.32+.3*p)*f+")");g.addColorStop(1,"rgba(70,0,25,"+(.6+.25*p)*f+")");
    x.fillStyle=g;x.fillRect(-W,-W*1.2,W*2,W*2.4);x.restore();
    if(p>.05){x.globalCompositeOperation="lighter";const e2=x.createLinearGradient(0,0,0,H);e2.addColorStop(0,"rgba(255,90,140,"+(.22*p*f)+")");e2.addColorStop(.12,"rgba(255,90,140,0)");e2.addColorStop(.88,"rgba(255,90,140,0)");e2.addColorStop(1,"rgba(255,90,140,"+(.22*p*f)+")");x.fillStyle=e2;x.fillRect(0,0,W,H);x.globalCompositeOperation="source-over"}}
   {const {x,W,H}=B,cx=W/2,cy=H*.46;const g=x.createRadialGradient(cx,cy,0,cx,cy,W*.75);g.addColorStop(0,"rgba(255,70,130,"+(.3*p*f)+")");g.addColorStop(1,"rgba(255,70,130,0)");x.fillStyle=g;x.fillRect(0,0,W,H);
    BEATS.forEach(b=>{const a=t-b;if(a<0||a>1.2)return;const u=a/1.2,s=30+330*(1-Math.pow(1-u,2.4)),al=Math.pow(1-u,1.6)*f;heartPath(x,cx,cy,s);x.lineJoin="round";
     x.strokeStyle="rgba(255,80,140,"+(.3*al)+")";x.lineWidth=18*(1-u)+3;x.stroke();x.strokeStyle="rgba(255,200,225,"+(.95*al)+")";x.lineWidth=2.6*(1-u)+.7;x.stroke()})}}},
 bloom:{init(st,scr){scr.classList.add("emo-warm");st.bk=[...Array(RM()?14:38)].map(()=>({x:rnd(-.05,1.05),y:rnd(.55,1.15),r:rnd(5,30),v:rnd(14,46),p:R()*6.28,h:R(),l0:rnd(0,1.4)}));st.sp=[...Array(26)].map(()=>({x:R(),y:rnd(.35,1),p:R()*6.28,s:rnd(3,8),w:rnd(3,7)}));
   st.fg=[...Array(RM()?5:12)].map((_,i)=>({x:i%2?rnd(-.08,.22):rnd(.78,1.08),y:rnd(.45,1.1),r:rnd(26,62),v:rnd(10,26),p:R()*6.28,h:R(),l0:rnd(0,1)}));st.ray=[...Array(5)].map(()=>({x:rnd(.1,.9),w:rnd(.05,.13),p:R()*6.28,a:rnd(.5,1)}));vib([15,60,15])},
  draw(t,B,T,st){const D=DUR.bloom,e=sm(0,.6,t)*(1-sm(D-1.2,D,t)),grow=sm(0,D,t);
   {const {x,W,H}=B,r=H*(.55+.35*grow),g=x.createRadialGradient(W/2,H*1.04,0,W/2,H*1.04,r);g.addColorStop(0,"rgba(255,210,150,"+(.85*e)+")");g.addColorStop(.35,"rgba(255,125,170,"+(.45*e)+")");g.addColorStop(.7,"rgba(190,80,170,"+(.1*e)+")");g.addColorStop(1,"rgba(190,80,170,0)");x.fillStyle=g;x.fillRect(0,0,W,H);
    x.globalCompositeOperation="lighter";st.bk.forEach(b=>{const lt=t-b.l0*.6;if(lt<0)return;const yy=b.y*H-b.v*lt,xx=b.x*W+Math.sin(lt*.9+b.p)*14,a=sm(0,.7,lt)*e;const col=b.h<.4?"255,200,130":b.h<.75?"255,140,180":"255,175,150";
     const g2=x.createRadialGradient(xx,yy,0,xx,yy,b.r);g2.addColorStop(0,"rgba("+col+","+(.16*a)+")");g2.addColorStop(.78,"rgba("+col+","+(.24*a)+")");g2.addColorStop(.92,"rgba("+col+","+(.42*a)+")");g2.addColorStop(1,"rgba("+col+",0)");x.fillStyle=g2;x.beginPath();x.arc(xx,yy,b.r,0,7);x.fill()});
    st.sp.forEach(s=>{const a=Math.max(0,Math.sin(t*s.w+s.p))*e;if(a<.05)return;star(x,s.x*W,s.y*H-t*12,s.s,a*.8)});x.globalCompositeOperation="source-over"}
   {const {x,W,H}=T,g=x.createLinearGradient(0,H*.6,0,H);g.addColorStop(0,"rgba(255,160,150,0)");g.addColorStop(.6,"rgba(255,140,140,"+(.18*e)+")");g.addColorStop(1,"rgba(255,165,110,"+(.45*e)+")");x.fillStyle=g;x.fillRect(0,H*.6,W,H*.4);
    x.globalCompositeOperation="lighter";
    st.ray.forEach(r=>{const cx=(r.x+Math.sin(t*.35+r.p)*.04)*W,w=r.w*W,top=H*(1-.75*grow),g=x.createLinearGradient(0,H,0,top);g.addColorStop(0,"rgba(255,205,160,"+(.3*r.a*e)+")");g.addColorStop(1,"rgba(255,140,190,0)");
     x.save();x.translate(cx,H);x.rotate((r.x-.5)*.35);x.fillStyle=g;x.beginPath();x.moveTo(-w*.25,0);x.lineTo(w*.25,0);x.lineTo(w,top-H);x.lineTo(-w,top-H);x.closePath();x.fill();x.restore()});
    st.fg.forEach(b=>{const lt=t-b.l0*.5;if(lt<0)return;const yy=b.y*H-b.v*lt,xx=b.x*W+Math.sin(lt*.7+b.p)*10,a=sm(0,.8,lt)*e,col=b.h<.5?"255,195,140":"255,135,180";
     const g2=x.createRadialGradient(xx,yy,0,xx,yy,b.r);g2.addColorStop(0,"rgba("+col+","+(.1*a)+")");g2.addColorStop(.82,"rgba("+col+","+(.16*a)+")");g2.addColorStop(.93,"rgba("+col+","+(.34*a)+")");g2.addColorStop(1,"rgba("+col+",0)");x.fillStyle=g2;x.beginPath();x.arc(xx,yy,b.r,0,7);x.fill()});const y=H*.885,sw=W*(.55+.5*grow),g2=x.createLinearGradient(W/2-sw,0,W/2+sw,0);g2.addColorStop(0,"rgba(255,170,190,0)");g2.addColorStop(.5,"rgba(255,235,210,"+(.85*e)+")");g2.addColorStop(1,"rgba(255,170,190,0)");x.fillStyle=g2;x.fillRect(W/2-sw,y-.9,sw*2,1.8);
    const g3=x.createLinearGradient(0,y-22,0,y+22);g3.addColorStop(0,"rgba(255,150,170,0)");g3.addColorStop(.5,"rgba(255,170,170,"+(.16*e)+")");g3.addColorStop(1,"rgba(255,150,170,0)");x.fillStyle=g3;x.fillRect(0,y-22,W,44);
    const g4=x.createRadialGradient(W/2,y,0,W/2,y,70);g4.addColorStop(0,"rgba(255,240,220,"+(.6*e)+")");g4.addColorStop(1,"rgba(255,160,170,0)");x.fillStyle=g4;x.fillRect(W/2-70,y-70,140,140);
    [[.32,26,"255,190,140"],[.55,14,"255,140,200"],[.78,40,"200,160,255"]].forEach(([k,r,c])=>{const gx=W/2+(W*.15-W/2)*k*1.2,gy=y+(H*.25-y)*k;x.strokeStyle="rgba("+c+","+(.22*e)+")";x.lineWidth=2;x.beginPath();x.arc(gx,gy,r,0,7);x.stroke();x.fillStyle="rgba("+c+","+(.05*e)+")";x.fill()});
    x.globalCompositeOperation="source-over";cmask(x,W,H,.72)}}},
 ink:{init(st,scr){const L=$$("#msgs [data-mi]");st.el=L[L.length-1]||null;st.pf=[];st.back=.35},
  clearEach:false,
  draw(t,B,T,st){const D=DUR.ink,{x,W,H}=B,e=sm(0,.3,t)*(1-sm(D-1.1,D,t));B.c.style.opacity=(.35*e).toFixed(3);
   x.globalCompositeOperation="destination-out";x.fillStyle="rgba(0,0,0,.05)";x.fillRect(0,0,W,H);x.globalCompositeOperation="source-over";
   let r={left:W*.1,top:H*.55,width:W*.8,height:H*.15};if(st.el&&document.body.contains(st.el)){const a=st.el.getBoundingClientRect(),c=B.c.getBoundingClientRect();r={left:a.left-c.left,top:a.top-c.top,width:a.width,height:a.height}}
   const cx=r.left+r.width/2,cy=r.top+r.height/2,dt=1/60;
   if(t<1.9)for(let i=0;i<3;i++){const side=R();let px,py;if(side<.5){px=r.left+rnd(0,r.width);py=R()<.5?r.top:r.top+r.height}else{px=R()<.5?r.left:r.left+r.width;py=r.top+rnd(0,r.height)}
    const dx=px-cx,dy=py-cy,dl=Math.hypot(dx,dy)||1;st.pf.push({x:px,y:py,vx:dx/dl*rnd(14,46),vy:dy/dl*rnd(14,46),r:rnd(5,12),g:rnd(16,34),l:rnd(1.3,2.2),t:0,h:rnd(255,292)})}
   st.pf.forEach(p=>{p.t+=dt;p.vx+=Math.sin(p.y*.025+t*1.7)*40*dt;p.vy+=Math.cos(p.x*.025-t*1.3)*40*dt;p.vx*=.985;p.vy*=.985;p.x+=p.vx*dt;p.y+=p.vy*dt;p.r+=p.g*dt;
    const a=Math.sin(Math.PI*clamp(p.t/p.l,0,1)),g=x.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r);g.addColorStop(0,"hsla("+p.h+",85%,72%,"+(.32*a)+")");g.addColorStop(.55,"hsla("+(p.h+12)+",75%,52%,"+(.16*a)+")");g.addColorStop(1,"hsla("+p.h+",70%,40%,0)");x.fillStyle=g;x.fillRect(p.x-p.r,p.y-p.r,p.r*2,p.r*2)});
   st.pf=st.pf.filter(p=>p.t<p.l);
   [0,.55].forEach(d=>{const a=t-d;if(a<0||a>1.6)return;const u=a/1.6;x.strokeStyle="rgba(190,150,255,"+(.5*(1-u)*e)+")";x.lineWidth=2*(1-u)+.5;x.beginPath();x.ellipse(cx,cy,r.width*(.5+.35*u),r.height*(.5+.9*u)+6,0,0,7);x.stroke()})}},
 shock:{init(st,scr){caFilter();st.bars=[];if(!RM()){scr.classList.add("emo-ca");EMO.timers.push(setTimeout(()=>scr.classList.remove("emo-ca"),300));shakeScr();
   const bg=scr.querySelector("#chatBg");try{bg&&bg.animate&&bg.animate([{transform:"scale(1.06)",filter:"brightness(1.5) saturate(1.4)"},{transform:"scale(1)",filter:"none"}],{duration:450,easing:"cubic-bezier(.1,.9,.2,1)"})}catch(_){}}
   else{scr.classList.add("emo-ca");EMO.timers.push(setTimeout(()=>scr.classList.remove("emo-ca"),160))}vib([40,30,70])},
  draw(t,B,T,st){const e=t<.035?t/.035:Math.exp(-(t-.035)/.2);const {x,W,H}=T;
   const ca=document.getElementById("emoCAr"),cb=document.getElementById("emoCAb");if(ca){const d=(7*Math.max(0,1-t/.3)).toFixed(1);ca.setAttribute("dx","-"+d);cb.setAttribute("dx",d)}
   const d=Math.min(W,H)*.3;[[0,0,d,0],[0,H,0,H-d],[0,0,0,d],[W,0,W-d,0]].forEach(([x0,y0,x1,y1],i)=>{const g=x.createLinearGradient(x0,y0,x1,y1);g.addColorStop(0,"rgba(255,25,45,"+(.85*e)+")");g.addColorStop(.4,"rgba(200,0,30,"+(.3*e)+")");g.addColorStop(1,"rgba(200,0,30,0)");x.fillStyle=g;
    if(i<2)x.fillRect(0,Math.min(y0,y1),W,d);else x.fillRect(Math.min(x0,x1),0,d,H)});
   x.fillStyle="rgba(255,0,40,"+(.1*e)+")";x.fillRect(0,0,W,H);if(t<.07){x.fillStyle="rgba(255,235,235,"+(.22*(1-t/.07))+")";x.fillRect(0,0,W,H)}
   if(t<.32&&!RM()){if(R()<.6)st.bars=[...Array(6)].map((_,i)=>[R()*H,rnd(1.5,9),i%2,rnd(-30,30)]);st.bars.forEach(([y,h,c,o])=>{x.fillStyle=c?"rgba(0,230,255,.38)":"rgba(255,40,80,.42)";x.fillRect(o,y,W,h)})}
   cmask(x,W,H,.7)}},
 longing:{init(st,scr){scr.classList.add("emo-cool");st.m=[...Array(RM()?16:44)].map(()=>({x:R(),y:R(),p:R()*6.28,s:rnd(.6,1.8),v:rnd(-6,6)}))},
  draw(t,B,T,st){const D=DUR.longing,e=sm(0,.7,t)*(1-sm(D-1.2,D,t)),u=sm(0,D,t),ang=-.42;
   const {x,W,H}=T,cx=-W*.45+W*1.9*u,cy=H*.5;
   {const g=x.createRadialGradient(0,0,0,0,0,W*.95);g.addColorStop(0,"rgba(70,130,255,"+(.42*e)+")");g.addColorStop(1,"rgba(70,130,255,0)");x.fillStyle=g;x.fillRect(0,0,W,H);
    const g2=x.createRadialGradient(W,H,0,W,H,W*.85);g2.addColorStop(0,"rgba(150,115,255,"+(.32*e)+")");g2.addColorStop(1,"rgba(150,115,255,0)");x.fillStyle=g2;x.fillRect(0,0,W,H)}
   x.save();x.globalCompositeOperation="lighter";x.translate(cx,cy);x.rotate(ang);const bw=W*.38,g=x.createLinearGradient(-bw,0,bw,0);
   g.addColorStop(0,"rgba(60,110,255,0)");g.addColorStop(.3,"rgba(70,130,255,"+(.22*e)+")");g.addColorStop(.5,"rgba(190,228,255,"+(.42*e)+")");g.addColorStop(.62,"rgba(150,140,255,"+(.24*e)+")");g.addColorStop(1,"rgba(120,100,255,0)");
   x.fillStyle=g;x.fillRect(-bw,-H*1.2,bw*2,H*2.4);x.restore();
   x.globalCompositeOperation="lighter";[[0,.18,"80,145,255",.72],[.12,.5,"110,220,255",.5],[.22,.82,"165,120,255",.6]].forEach(([lag,yy,c,a])=>{const uu=sm(0,D,t-lag*D*.5),bx=-W*.5+W*2*uu,by=H*yy+Math.sin(t*.8+yy*9)*20,rr=W*.62;
    const g3=x.createRadialGradient(bx,by,0,bx,by,rr);g3.addColorStop(0,"rgba("+c+","+(a*e)+")");g3.addColorStop(.5,"rgba("+c+","+(a*.35*e)+")");g3.addColorStop(1,"rgba("+c+",0)");x.fillStyle=g3;x.fillRect(bx-rr,by-rr,rr*2,rr*2)});
   x.globalCompositeOperation="source-over";cmask(x,W,H,.72);
   {const {x,W,H}=B;x.globalCompositeOperation="lighter";const ca=Math.cos(ang),sa=Math.sin(ang);
    st.m.forEach(m=>{const px=m.x*W+Math.sin(t*.6+m.p)*10,py=(m.y*H+m.v*t+H)%H;const dx=px-cx,dy=py-cy,dist=Math.abs(dx*ca+dy*sa);const lit=Math.exp(-dist*dist/(2*Math.pow(W*.18,2)));const a=(.15+.85*lit)*e;
     const r=m.s*3,g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,"rgba(220,235,255,"+(.85*a)+")");g.addColorStop(1,"rgba(160,190,255,0)");x.fillStyle=g;x.fillRect(px-r,py-r,r*2,r*2)});x.globalCompositeOperation="source-over"}}}};
window.emoFx=function(kind,opt){opt=opt||{};if(!FXE[kind])return false;const scr=chatEl();if(!scr)return false;if(skipping()&&!opt.force)return false;
 const now=PN();if(EMO.k){const el=(now-EMO.t0)/1000/EMO.dur;if(EMO.k===kind&&el<.6)return false;if(opt.weak&&el<.55)return false}
 emoStop();caFilter();const bgw=scr.querySelector("#chatBg")||scr,back=mount("emoBack",bgw),top=mount("emoTop",scr),dpr=Math.min(1.5,window.devicePixelRatio||1);
 back.style.opacity=1;top.style.opacity=1;top.style.mixBlendMode=kind==="longing"||kind==="bloom"?"screen":"normal";
 const E=FXE[kind],st={};EMO.k=kind;EMO.t0=now;EMO.dur=DUR[kind];EMO.st=st;EMO.scr=scr;E.init(st,scr);
 const B={c:back},T={c:top};Object.assign(B,fit(back,dpr));Object.assign(T,fit(top,dpr));B.x.clearRect(0,0,B.W,B.H);
 const frame=n1=>{const n=window.FX3_CLOCK!=null?window.FX3_CLOCK:n1;if(EMO.st!==st)return;const t=(n-EMO.t0)/1000*TS();if(t>EMO.dur||!document.body.contains(top)||scr.hidden){emoStop();return}
  Object.assign(B,fit(back,dpr));Object.assign(T,fit(top,dpr));if(E.clearEach!==false)B.x.clearRect(0,0,B.W,B.H);T.x.clearRect(0,0,T.W,T.H);E.draw(Math.max(0,t),B,T,st);EMO.raf=requestAnimationFrame(frame)};
 EMO.raf=requestAnimationFrame(frame);return true};
window.emoStop=emoStop;window.emoState=()=>EMO.k;

/* ---------------- triggers: what happens in the story ---------------- */
const ATT2EMO={flirt:"heartbeat",bold:"heartbeat",tease:"heartbeat",kiss:"bloom",push:"shock",provoke:"shock",press:"shock",jealous:"shock",soft:"longing",restrain:"longing",secret:"longing",inner:"longing"};
function emoAtt(k){const e=ATT2EMO[k];if(e)setTimeout(()=>emoFx(e),60)}
window.emoAtt=emoAtt;
/* the attitude you commit to (two-step choice) */
document.addEventListener("click",e=>{if(!e.target.closest||!e.target.closest("[data-chgo]"))return;
 try{const th=S.threads[curT],b=th&&th.pk&&th.pk.stop;if(!b||b[1]!=="line"||typeof CH==="undefined"||!CH)return;const a=attList(th,b[2]).find(z=>z.i===CH.i);if(a)emoAtt(a.k)}catch(_){}},true);
/* inner voice → ink; narration of a kiss → bloom */
const _pkAppend30=pkAppend;
pkAppend=function(th,m){const r=_pkAppend30.apply(this,arguments);
 try{if(th&&curT===th.id&&m&&m.pk&&!skipping()){if(m.k==="think"){const n=Date.now();if(n-(EMO.lastInk||0)>6000){EMO.lastInk=n;requestAnimationFrame(()=>emoFx("ink",{weak:true}))}}else if(isNarr(m)&&/吻|kiss/i.test(String(m.txt||"")))emoFx("bloom")}}catch(_){}return r};
/* events: a jolt (or warmth, when the event is a kiss / embrace / confession). The "unlocked" event belongs to the lock bloom. */
PKREG.add("app30_fx3.js", function(th,b, next){const ev=Array.isArray(b)&&b[0]==="sys"&&b[1]==="event"?(b[2]||{}):null;const r=next.apply(this,arguments);
 try{if(ev&&th&&curT===th.id&&!skipping()&&ev.icon!=="🔓"){const s=Lz(ev.title)+" "+Lz(ev.txt);if(/吻|kiss|拥抱|抱住|hug|告白|confess/i.test(s)||/💋|❤|💗|💞|💕|🌹|💘/.test(ev.icon||""))emoFx("bloom");else emoFx("shock",{weak:true})}}catch(_){}return r});;
/* a key scene opening */
document.addEventListener("click",e=>{if(!e.target.closest||!e.target.closest("[data-lockgo]"))return;
 try{const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop||th.pk.stop[1]!=="lock")return;const k=lockKey(th,th.pk.stop[2]);setTimeout(()=>{if((S.unlocked||{})[k]||S.plus)emoFx("bloom")},120)}catch(_){}},true);
/* the heartbeat game */
if(typeof heartGame==="function"){const _hg30=heartGame;heartGame=function(){const r=_hg30.apply(this,arguments);setTimeout(()=>emoFx("heartbeat"),250);return r}}
})();
