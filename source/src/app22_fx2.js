/* ================= ATMOSPHERE v2 — cinematic effects =================
   One canvas, device-pixel-ratio aware, additive glow. Each effect is built from layers:
   rain/storm  — 3 depth layers of streaks, splashes on the floor, drifting mist, drops on the glass;
                 storm adds forked lightning (branching bolt + bloom + double flicker), screen shake, vibration, distant thunder.
   snow/blizzard — 3 depth layers of soft flakes (near ones big and blurred), gusts, frost growing in from the corners.
   candle      — breathing warm light, drifting bokeh orbs, glowing embers that swirl upward.
   blackout    — the lights stutter and die, a green exit-sign glow, a flashlight beam sweeping the room.
   drip        — water gathering and falling from the ceiling, ripples spreading on the floor.
   hearts      — warm haze, glowing hearts rising with a 3D wobble, twinkling sparkles.
   petals / wind / confetti — paper-thin pieces that flip in 3D as they tumble.
   Ambient per-story effects (snow, embers, bokeh, fireflies, dust) also run on this engine. */
(function(){
const MAPOLD={snow:"snowfall",frost:"snowfall",embers:"embers",rain:"rain",bokeh:"bokeh",fireflies:"fireflies",dust:"dust"};
const KINDS=["rain","storm","wind","snowfall","blizzard","candle","blackout","drip","hearts","petals","confetti","embers","bokeh","fireflies","dust"];
let RAF=0,TH=null;
function thunder(){try{if(!bgmInit())return;const c=BGM.ctx;if(c.state!=="running")return;const len=c.sampleRate*3,b=c.createBuffer(1,len,c.sampleRate),d=b.getChannelData(0);let last=0;
  for(let i=0;i<len;i++){const w=Math.random()*2-1;last=(last+.02*w)/1.02;d[i]=last*3.2*Math.pow(1-i/len,1.6)}
  const s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=b;f.type="lowpass";f.frequency.value=180;s.connect(f);f.connect(g);g.connect(c.destination);
  const t0=c.currentTime+.5+Math.random()*1.2;g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(.55,t0+.25);g.gain.exponentialRampToValueAtTime(.001,t0+2.8);s.start(t0)}catch(_){}}
function shake(){const s=$(".chatscreen")||$("#s-chat");if(s){s.classList.remove("fxshake");void s.offsetWidth;s.classList.add("fxshake")}try{navigator.vibrate&&navigator.vibrate([70,50,110])}catch(_){}}
function bolt(x0,y0,x1,y1,dis,out){if(dis<6){out.push([x0,y0,x1,y1]);return}const mx=(x0+x1)/2+(Math.random()-.5)*dis,my=(y0+y1)/2+(Math.random()-.5)*dis*.3;bolt(x0,y0,mx,my,dis/2,out);bolt(mx,my,x1,y1,dis/2,out)}
fxRun=function(kind){kind=MAPOLD[kind]||kind;const c0=$("#cbFx");if(!c0)return;const scr=c0.closest(".chatscreen")||$("#s-chat");if(scr&&c0.parentElement!==scr){scr.appendChild(c0);c0.classList.add("fxtop")}cancelAnimationFrame(RAF);cancelAnimationFrame(fxRaf);fxState.k=kind;const old=$("#cbFx2");if(old)old.remove();
 const dpr=Math.min(2,window.devicePixelRatio||1),r=c0.getBoundingClientRect(),W=Math.max(1,r.width),H=Math.max(1,r.height);c0.width=W*dpr;c0.height=H*dpr;const x=c0.getContext("2d");x.setTransform(dpr,0,0,dpr,0,0);
 const low=matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches,K=low?.35:1,R=Math.random,rnd=(a,b)=>a+R()*(b-a);
 const mk=(n,f)=>[...Array(Math.round(n*K))].map(f);let T=0,flash=0,bolts=[],nextBolt=90+R()*120,frost=0,beam=0;
 /* shared pools */
 const rainL=[0,1,2].map(z=>mk([90,70,40][z]*(kind==="storm"?1.6:1),()=>({x:R()*W*1.3-W*.15,y:R()*H,z,l:[8,14,24][z]+R()*10,v:[9,14,22][z]+R()*5}))).flat();
 const splash=[],glass=[],mist=mk(5,()=>({x:R()*W,y:H*rnd(.55,1),r:rnd(.35,.6)*W,v:rnd(.08,.25)*(R()<.5?-1:1),a:rnd(.04,.09)}));
 const flakes=mk(kind==="blizzard"?260:150,()=>{const z=R()<.12?2:R()<.5?1:0;return {x:R()*W,y:R()*H,z,r:[1,1.8,4.2][z]*rnd(.7,1.3),v:[.5,1,1.8][z]*rnd(.8,1.2),p:R()*6.28}});
 const orbs=mk(kind==="bokeh"?22:14,()=>({x:R()*W,y:R()*H,r:rnd(18,60),v:rnd(-.15,.15),u:rnd(-.12,-.02),h:R(),a:rnd(.05,.14),p:R()*6.28}));
 const embers=mk(kind==="embers"?70:55,()=>({x:R()*W,y:H*rnd(.4,1.1),v:rnd(.3,1.1),s:rnd(.8,2.4),p:R()*6.28,life:R()}));
 const hearts=mk(26,()=>({x:R()*W,y:H+R()*H,s:rnd(5,15),v:rnd(.35,.9),p:R()*6.28,a:rnd(.25,.6)})),spk=mk(40,()=>({x:R()*W,y:R()*H,p:R()*6.28,s:rnd(1,2.6)}));
 const bits=mk(kind==="confetti"?140:kind==="petals"?55:60,()=>({x:R()*W,y:-R()*H,vx:rnd(-.6,.6),vy:rnd(.6,1.8),rx:R()*6.28,vr:rnd(.03,.09),rz:R()*6.28,s:rnd(4,9),c:R()}));
 if(kind==="confetti")bits.forEach((b,i)=>{const L=i%2;b.x=L?W*.05:W*.95;b.y=H*.95;b.vx=(L?1:-1)*rnd(2,7);b.vy=-rnd(6,12)});
 const drips=mk(14,()=>({x:R()*W,y:-1,v:0,hold:rnd(30,260),r:rnd(1.4,2.6)})),rings=[];
 const flies=mk(26,()=>({x:R()*W,y:R()*H,p:R()*6.28,v:rnd(.2,.6)}));
 const heart=(cx,cy,s)=>{x.beginPath();x.moveTo(cx,cy+s*.35);x.bezierCurveTo(cx-s,cy-s*.4,cx-s*.4,cy-s,cx,cy-s*.35);x.bezierCurveTo(cx+s*.4,cy-s,cx+s,cy-s*.4,cx,cy+s*.35);x.fill()};
 const glow=(cx,cy,rad,col,a)=>{const g=x.createRadialGradient(cx,cy,0,cx,cy,rad);g.addColorStop(0,"rgba("+col+","+a+")");g.addColorStop(1,"rgba("+col+",0)");x.fillStyle=g;x.fillRect(cx-rad,cy-rad,rad*2,rad*2)};
 const step=()=>{if(!document.body.contains(c0)||fxState.k!==kind)return;T++;x.globalCompositeOperation="source-over";x.clearRect(0,0,W,H);
  /* ---------- RAIN / STORM ---------- */
  if(kind==="rain"||kind==="storm"){const st=kind==="storm",wind=st?2.6+Math.sin(T*.008)*1.6:.9;
   if(st){x.fillStyle="rgba(10,18,40,.14)";x.fillRect(0,0,W,H)}
   mist.forEach(m=>{m.x+=m.v;if(m.x<-m.r)m.x=W+m.r;if(m.x>W+m.r)m.x=-m.r;glow(m.x,m.y,m.r,"170,190,220",m.a*(st?1.4:1))});
   [0,1,2].forEach(z=>{const g=x.createLinearGradient(0,0,0,30);x.strokeStyle="rgba(200,215,245,"+[.16,.26,.42][z]*(st?1.15:1)+")";x.lineWidth=[.6,1,1.6][z];x.lineCap="round";x.beginPath();
    rainL.forEach(d=>{if(d.z!==z)return;d.y+=d.v*(st?1.25:1);d.x+=wind*(d.z+1)*.6;if(d.y>H){if(d.z===2&&splash.length<70)for(let k=0;k<2;k++)splash.push({x:d.x,y:H-rnd(2,30),vx:rnd(-1.5,1.5),vy:-rnd(1.5,3.2),l:18});d.y=-d.l-R()*40;d.x=R()*W*1.3-W*.15}
     x.moveTo(d.x,d.y);x.lineTo(d.x-wind*d.l/d.v*(d.z+1)*.6,d.y-d.l)});x.stroke()});
   x.fillStyle="rgba(210,225,255,.5)";for(let i=splash.length-1;i>=0;i--){const p=splash[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.25;if(--p.l<=0){splash.splice(i,1);continue}x.fillRect(p.x,p.y,1.3,1.3)}
   if(glass.length<(st?34:22)&&R()<.2)glass.push({x:R()*W,y:R()*H*.85,r:rnd(2,6),v:0,hold:rnd(60,300)});
   glass.forEach(d=>{if(d.hold>0)d.hold--;else{d.v=Math.min(4,d.v+.06);d.y+=d.v;d.x+=Math.sin(d.y*.05)*.3}
    const g=x.createRadialGradient(d.x-d.r*.35,d.y-d.r*.4,0,d.x,d.y,d.r);g.addColorStop(0,"rgba(255,255,255,.7)");g.addColorStop(.5,"rgba(210,225,255,.2)");g.addColorStop(1,"rgba(160,190,240,.06)");
    x.fillStyle=g;x.beginPath();x.ellipse(d.x,d.y,d.r*.85,d.r,0,0,7);x.fill();if(d.v>0){x.strokeStyle="rgba(210,225,255,.14)";x.lineWidth=d.r*.55;x.beginPath();x.moveTo(d.x,d.y-d.r);x.lineTo(d.x,d.y-d.r-d.v*9);x.stroke()}});
   for(let i=glass.length-1;i>=0;i--)if(glass[i].y>H+10)glass.splice(i,1);
   if(st){if(--nextBolt<=0){nextBolt=170+R()*300;const sx=rnd(W*.15,W*.85),segs=[];bolt(sx,-10,sx+rnd(-W*.3,W*.3),H*rnd(.45,.8),H*.35,segs);
     for(let k=0;k<3;k++){const s=segs[Math.floor(R()*segs.length*.7)];if(s)bolt(s[2],s[3],s[2]+rnd(-90,90),s[3]+rnd(60,160),70,segs)}bolts=[{segs,life:22}];flash=1;shake();thunder()}
    if(bolts.length){const b=bolts[0];x.globalCompositeOperation="lighter";x.lineCap="round";const a=b.life/22*(b.life%7<2?.35:1);
     x.shadowColor="rgba(160,200,255,1)";x.shadowBlur=26;x.strokeStyle="rgba(190,215,255,"+a+")";x.lineWidth=3.2;x.beginPath();b.segs.forEach(s=>{x.moveTo(s[0],s[1]);x.lineTo(s[2],s[3])});x.stroke();
     x.shadowBlur=0;x.strokeStyle="rgba(255,255,255,"+a+")";x.lineWidth=1.2;x.stroke();if(--b.life<=0)bolts=[];x.globalCompositeOperation="source-over"}
    window.FXFLASH=flash;if(flash>0){x.fillStyle="rgba(225,235,255,"+(flash*.6)+")";x.fillRect(0,0,W,H);flash=flash>.55&&R()<.25?.85:flash-.06}}}
  /* ---------- SNOW / BLIZZARD ---------- */
  if(kind==="snowfall"||kind==="blizzard"){const bz=kind==="blizzard",gust=bz?3+2.5*Math.sin(T*.012):.4*Math.sin(T*.004);
   if(bz){x.fillStyle="rgba(215,228,245,"+(.08+.06*Math.max(0,Math.sin(T*.01)))+")";x.fillRect(0,0,W,H)}
   flakes.forEach(f=>{f.y+=f.v*(bz?1.8:1);f.x+=gust*(f.z+.6)+Math.sin(T*.012+f.p)*.5;if(f.y>H+6){f.y=-6;f.x=R()*W}if(f.x>W+8)f.x=-8;if(f.x<-8)f.x=W+8;
    if(f.z===2){glow(f.x,f.y,f.r*2.2,"255,255,255",.55)}else{x.fillStyle="rgba(255,255,255,"+(f.z?.8:.45)+")";x.beginPath();x.arc(f.x,f.y,f.r,0,7);x.fill()}
    if(bz&&f.z===1){x.strokeStyle="rgba(255,255,255,.18)";x.lineWidth=1;x.beginPath();x.moveTo(f.x,f.y);x.lineTo(f.x-gust*5,f.y-2);x.stroke()}});
   frost=Math.min(1,frost+.0025);const e=Math.min(W,H)*(.22+.12*frost);[[0,0],[W,0],[0,H],[W,H]].forEach(([cx,cy])=>glow(cx,cy,e*1.7,"230,242,255",.55*frost));
   x.strokeStyle="rgba(255,255,255,"+(.28*frost)+")";x.lineWidth=.8;for(let i=0;i<22;i++){const cx=i%2?W:0,cy=i%4<2?0:H,a=(i*.37)%1.57,l=e*(.3+.5*((i*37)%10)/10)*frost,dx=(cx?-1:1),dy=(cy?-1:1);
    x.beginPath();x.moveTo(cx,cy);const ex=cx+Math.cos(a)*l*dx,ey=cy+Math.sin(a)*l*dy;x.lineTo(ex,ey);x.moveTo((cx+ex)/2,(cy+ey)/2);x.lineTo((cx+ex)/2+8*dx,(cy+ey)/2+3*dy);x.stroke()}}
  /* ---------- CANDLE / EMBERS / BOKEH ---------- */
  if(kind==="candle"||kind==="embers"||kind==="bokeh"){const fl=.8+.12*Math.sin(T*.19)+.08*Math.sin(T*.53)+(R()-.5)*.06;
   if(kind==="candle"){const g=x.createRadialGradient(W*.5,H*.7,10,W*.5,H*.7,Math.max(W,H)*.85);g.addColorStop(0,"rgba(255,160,70,"+(.16*fl)+")");g.addColorStop(.55,"rgba(110,50,15,"+(.08*fl)+")");g.addColorStop(1,"rgba(0,0,0,.42)");x.fillStyle=g;x.fillRect(0,0,W,H)}
   x.globalCompositeOperation="lighter";
   if(kind!=="embers")orbs.forEach(o=>{o.x+=o.v;o.y+=o.u;o.p+=.01;if(o.y<-o.r)o.y=H+o.r;if(o.x<-o.r)o.x=W+o.r;if(o.x>W+o.r)o.x=-o.r;const col=kind==="bokeh"?(o.h<.33?"255,170,120":o.h<.66?"255,120,160":"150,170,255"):"255,"+(150+o.h*60|0)+",80";glow(o.x,o.y,o.r,col,o.a*(.7+.3*Math.sin(o.p)))});
   if(kind!=="bokeh")embers.forEach(m=>{m.y-=m.v;m.x+=Math.sin(T*.03+m.p)*.6;m.life+=.004;if(m.y<H*.05||m.life>1){m.y=H*rnd(.75,1.05);m.x=W*rnd(.15,.85);m.life=0}const a=Math.sin(m.life*Math.PI);glow(m.x,m.y,m.s*5,"255,150,60",.35*a);x.fillStyle="rgba(255,220,150,"+(.9*a)+")";x.beginPath();x.arc(m.x,m.y,m.s*.6,0,7);x.fill()});
   x.globalCompositeOperation="source-over"}
  /* ---------- BLACKOUT ---------- */
  if(kind==="blackout"){const seq=T<90?(R()<.35?.08:.82):.62;x.fillStyle="rgba(1,2,6,"+seq+")";x.fillRect(0,0,W,H);
   if(T>90){glow(W*.88,H*.12,90,"60,255,140",.12+.03*Math.sin(T*.05));beam+=.008;const bx=W*(.5+.38*Math.sin(beam)),by=H*(.45+.15*Math.sin(beam*1.7));
    x.globalCompositeOperation="lighter";const g=x.createRadialGradient(bx,by,0,bx,by,W*.32);g.addColorStop(0,"rgba(255,245,215,.20)");g.addColorStop(.6,"rgba(255,240,200,.06)");g.addColorStop(1,"rgba(255,240,200,0)");x.fillStyle=g;x.beginPath();x.arc(bx,by,W*.32,0,7);x.fill();
    x.fillStyle="rgba(255,245,215,.05)";x.beginPath();x.moveTo(W*.5,H*1.05);x.lineTo(bx-W*.18,by);x.lineTo(bx+W*.18,by);x.closePath();x.fill();x.globalCompositeOperation="source-over"}}
  /* ---------- DRIP ---------- */
  if(kind==="drip"){x.fillStyle="rgba(0,8,18,.14)";x.fillRect(0,0,W,H);
   drips.forEach(d=>{if(d.hold>0){d.hold--;const s=1-d.hold/300;x.fillStyle="rgba(190,215,255,.6)";x.beginPath();x.ellipse(d.x,3,d.r,d.r*(1+s*1.4),0,0,7);x.fill();return}
    d.v+=.38;d.y+=d.v;x.fillStyle="rgba(200,225,255,.75)";x.beginPath();x.ellipse(d.x,d.y,d.r*.8,d.r*(1.6+d.v*.15),0,0,7);x.fill();
    if(d.y>H-8){rings.push({x:d.x,r:2,a:.6});for(let k=0;k<4;k++)splash.push({x:d.x,y:H-8,vx:rnd(-1.6,1.6),vy:-rnd(1,2.6),l:16});d.y=-1;d.v=0;d.hold=rnd(60,280);d.x=R()*W}});
   for(let i=rings.length-1;i>=0;i--){const g=rings[i];g.r+=1.1;g.a-=.012;if(g.a<=0){rings.splice(i,1);continue}x.strokeStyle="rgba(190,215,255,"+g.a+")";x.lineWidth=1.2;x.beginPath();x.ellipse(g.x,H-6,g.r*2.4,g.r*.55,0,0,7);x.stroke()}
   x.fillStyle="rgba(210,225,255,.6)";for(let i=splash.length-1;i>=0;i--){const p=splash[i];p.x+=p.vx;p.y+=p.vy;p.vy+=.22;if(--p.l<=0){splash.splice(i,1);continue}x.fillRect(p.x,p.y,1.4,1.4)}}
  /* ---------- HEARTS ---------- */
  if(kind==="hearts"){const g=x.createRadialGradient(W/2,H*.55,W*.15,W/2,H*.55,W*1.05);g.addColorStop(0,"rgba(255,90,140,0)");g.addColorStop(1,"rgba(90,10,40,.32)");x.fillStyle=g;x.fillRect(0,0,W,H);
   x.globalCompositeOperation="lighter";orbs.slice(0,8).forEach(o=>{o.y+=o.u;if(o.y<-o.r)o.y=H+o.r;glow(o.x,o.y,o.r,"255,110,160",o.a*.8)});
   hearts.forEach(h=>{h.y-=h.v;h.x+=Math.sin(T*.02+h.p)*.5;if(h.y<-20){h.y=H+20;h.x=R()*W}const w=.75+.25*Math.cos(T*.04+h.p);x.save();x.translate(h.x,h.y);x.scale(w,1);x.shadowColor="rgba(255,120,170,.9)";x.shadowBlur=14;x.fillStyle="rgba(255,130,175,"+h.a+")";heart(0,0,h.s);x.restore()});
   spk.forEach(s=>{const a=Math.max(0,Math.sin(T*.05+s.p));if(a<.1)return;x.fillStyle="rgba(255,235,245,"+a*.9+")";x.beginPath();x.moveTo(s.x,s.y-s.s*3);x.lineTo(s.x+s.s*.6,s.y);x.lineTo(s.x,s.y+s.s*3);x.lineTo(s.x-s.s*.6,s.y);x.fill();x.beginPath();x.moveTo(s.x-s.s*3,s.y);x.lineTo(s.x,s.y+s.s*.6);x.lineTo(s.x+s.s*3,s.y);x.lineTo(s.x,s.y-s.s*.6);x.fill()});
   x.shadowBlur=0;x.globalCompositeOperation="source-over"}
  /* ---------- PETALS / WIND / CONFETTI ---------- */
  if(kind==="petals"||kind==="wind"||kind==="confetti"){const gust=kind==="wind"?2+2.5*Math.max(0,Math.sin(T*.01)):kind==="petals"?.8+Math.sin(T*.006)*.6:0;
   if(kind==="wind"){x.strokeStyle="rgba(255,255,255,.10)";x.lineWidth=1;for(let i=0;i<18;i++){const y=(i*53+T*.3)%H,xx=((T*(6+i%5)*(.6+gust*.3))+i*97)%(W+300)-150;x.beginPath();x.moveTo(xx,y);x.quadraticCurveTo(xx-60,y-8,xx-140,y+2);x.stroke()}}
   bits.forEach(b=>{if(kind==="confetti"){b.vy+=.12;b.vx*=.99;b.x+=b.vx;b.y+=b.vy;if(b.y>H+20&&T>60){b.y=-10;b.x=R()*W;b.vx=rnd(-.6,.6);b.vy=rnd(1,2)}}
    else{b.x+=b.vx+gust*(1+b.c);b.y+=b.vy*(kind==="wind"?.5:.8)+Math.sin(T*.03+b.rz)*.5;if(b.y>H+15||b.x>W+15){b.y=-15-R()*60;b.x=R()*W-(gust>1?W*.4:0)}}
    b.rx+=b.vr;b.rz+=b.vr*.6;const sx=Math.cos(b.rx);x.save();x.translate(b.x,b.y);x.rotate(b.rz);x.scale(sx,1);
    if(kind==="confetti"){x.fillStyle=["#ff6fa3","#ffd36b","#8be1ff","#b48bff","#7dffb0"][b.c*5|0];x.fillRect(-b.s/2,-b.s/4,b.s,b.s/2)}
    else if(kind==="petals"){const g=x.createLinearGradient(-b.s,0,b.s,0);g.addColorStop(0,"rgba(255,170,200,.9)");g.addColorStop(1,"rgba(255,235,242,.85)");x.fillStyle=g;x.beginPath();x.moveTo(0,-b.s*.6);x.bezierCurveTo(b.s,-b.s*.6,b.s,b.s*.6,0,b.s*.7);x.bezierCurveTo(-b.s*.5,b.s*.3,-b.s*.5,-b.s*.3,0,-b.s*.6);x.fill()}
    else{x.fillStyle=b.c<.5?"rgba(200,150,80,.85)":"rgba(140,170,90,.85)";x.beginPath();x.ellipse(0,0,b.s,b.s*.45,0,0,7);x.fill();x.strokeStyle="rgba(80,60,30,.5)";x.beginPath();x.moveTo(-b.s,0);x.lineTo(b.s,0);x.stroke()}x.restore()})}
  /* ---------- FIREFLIES / DUST ---------- */
  if(kind==="fireflies"||kind==="dust"){x.globalCompositeOperation="lighter";flies.forEach(f=>{f.p+=.02;f.x+=Math.cos(f.p*1.3)*f.v;f.y+=Math.sin(f.p)*f.v*.6-(kind==="dust"?.1:0);if(f.y<-5)f.y=H+5;if(f.x<-5)f.x=W+5;if(f.x>W+5)f.x=-5;
    const a=kind==="fireflies"?Math.max(0,Math.sin(f.p*2)):.35;glow(f.x,f.y,kind==="fireflies"?12:5,kind==="fireflies"?"210,255,120":"255,235,200",a*.6)});x.globalCompositeOperation="source-over"}
  RAF=requestAnimationFrame(step);fxRaf=RAF};step()};
/* ambient story effects run on the new engine too */
const _chatFx22=chatFx;chatFx=function(th){if(th&&!(th.fxm&&th.fxm!=="auto")&&!(th.pk&&th.pk.fx)){const k=FX[th.wid]||(th.kind==="group"?"dust":"bokeh");if(MAPOLD[k]){fxRun(k);return}}_chatFx22(th)};
})();
