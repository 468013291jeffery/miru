/* ================= ATMOSPHERE v3 — GPU shader layer =================
   A WebGL canvas over the chat runs real-time fragment shaders (glow is additive, so it lights up the dark UI):
     glass     — water drops on the phone glass that refract the scene behind them (paired with rain)
     thunder   — boiling storm clouds lit from inside by every lightning strike (paired with storm)
     aurora    — northern-lights curtains rippling across the top of the screen
     starwarp  — flying through a 3D star tunnel
     fireworks — bursts with glowing trails and gravity
     neon      — synthwave: a 3D grid running to a striped neon sun
     godrays   — slow golden light beams with drifting dust
     galaxy    — a spiral galaxy turning
     inferno   — rising heat haze and flame light from below
     bokeh3d   — deep-focus city lights drifting toward you
   Falls back silently if the phone has no WebGL. Renders at reduced resolution for battery. */
(function(){
const VS="attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const HEAD="precision mediump float;uniform vec2 R;uniform float T;uniform float F;uniform sampler2D B;uniform vec4 C;uniform float HB;"+
 "float h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}"+
 "float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h1(i),h1(i+vec2(1,0)),f.x),mix(h1(i+vec2(0,1)),h1(i+vec2(1,1)),f.x),f.y);}"+
 "float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n2(p);p*=2.03;a*=.5;}return v;}";
const FS={
 glass:"vec2 L(vec2 uv,float t,float sc,out float m){vec2 a=vec2(1.,2.);vec2 st=uv*sc*a;vec2 id=floor(st);st.y+=t*.22;id=floor(st);vec2 gv=fract(st)-.5;float n=h1(id);t+=n*6.28;"+
  "float w=uv.y*10.;float x=(n-.5)*.75;x+=(.4-abs(x))*sin(3.*w)*pow(sin(w),6.)*.45;float y=-sin(t+sin(t+sin(t)*.5))*.43;y-=(gv.x-x)*(gv.x-x);"+
  "vec2 dp=(gv-vec2(x,y))/a;float d=length(dp);float dr=smoothstep(.06,.0,d);vec2 tp=(gv-vec2(x,t*.22))/a;tp.y=(fract(tp.y*8.)-.5)/8.;float td=length(tp);"+
  "float trail=smoothstep(.03,.0,td)*smoothstep(-.05,.05,dp.y)*smoothstep(.5,y,gv.y);m=dr+trail*.6;return dp*dr*30.+tp*trail*14.;}"+
  "void main(){vec2 uv=gl_FragCoord.xy/R;vec2 u=uv*vec2(R.x/R.y,1.);float m1,m2,m3;vec2 o=L(u,T,3.,m1)+L(u*1.37+7.5,T,3.,m2);float st=smoothstep(.985,1.,h1(floor(u*vec2(60.,60.))))*smoothstep(.2,.0,length(fract(u*60.)-.5));"+
  "float m=clamp(m1+m2+st,0.,1.);vec2 suv=vec2(uv.x,1.-uv.y)*C.zw+C.xy+o*.012;vec3 col=texture2D(B,suv).rgb*1.15+vec3(.08,.1,.14);col+=pow(max(0.,dot(normalize(vec3(o,1.)),normalize(vec3(-.4,.6,1.)))),40.)*.8;gl_FragColor=vec4(col*m,m*.92);}",
 thunder:"void main(){vec2 uv=gl_FragCoord.xy/R;vec2 p=uv*vec2(R.x/R.y,1.)*2.2;float t=T*.06;float c=fbm(p+vec2(t,t*.3)+fbm(p*1.7-t)*1.2);float top=smoothstep(.25,1.,uv.y);"+
  "float lit=F*(.6+.8*fbm(p*3.+T));vec3 col=mix(vec3(.02,.03,.07),vec3(.18,.2,.3),c)*top*.9;col+=vec3(.55,.65,1.)*lit*c*c*1.6*top;col+=vec3(.7,.8,1.)*F*.18;float a=clamp(top*(.35+c*.5)+F*.25,0.,.92);gl_FragColor=vec4(col,a);}",
 aurora:"void main(){vec2 uv=gl_FragCoord.xy/R;vec3 col=vec3(0.);for(int i=0;i<4;i++){float fi=float(i);float y=.62+fi*.06+.07*sin(uv.x*2.3+T*.25+fi*1.9)+.03*sin(uv.x*7.-T*.6+fi);float d=uv.y-y;"+
  "float cur=smoothstep(-.02,.0,d)*exp(-d*7.)*(.55+.45*n2(vec2(uv.x*30.+fi*9.,T*.4)));vec3 c=mix(vec3(.1,1.,.6),vec3(.6,.3,1.),fi/3.);col+=c*cur*.55;}"+
  "col+=vec3(.9,1.,1.)*smoothstep(.997,1.,h1(floor(gl_FragCoord.xy/2.)))*(.5+.5*sin(T*3.+h1(floor(gl_FragCoord.xy))*20.))*smoothstep(.4,1.,uv.y);gl_FragColor=vec4(col,1.);}",
 starwarp:"void main(){vec2 p=(gl_FragCoord.xy-.5*R)/R.y;vec3 c=vec3(0.);for(int i=0;i<6;i++){float fi=float(i)/6.;float z=fract(fi+T*.12);float s=mix(18.,.6,z);float fade=z*smoothstep(1.,.85,z);"+
  "vec2 q=p*s+fi*453.2;vec2 id=floor(q);vec2 gv=fract(q)-.5;float n=h1(id);vec2 o=vec2(n,fract(n*34.))-.5;vec2 dv=gv-o*.8;float d=length(dv);float star=.015/d;star*=smoothstep(.5,.2,d);"+
  "vec2 dir=normalize(p+1e-4);float streak=.004/abs(dot(dv,vec2(-dir.y,dir.x)))*smoothstep(.3,.0,d)*z*z;c+=(star+streak*.6)*fade*mix(vec3(.6,.8,1.),vec3(1.,.6,.9),n);}c+=vec3(.25,.15,.5)*.15*smoothstep(1.2,.0,length(p));gl_FragColor=vec4(c,1.);}",
 fireworks:"void main(){vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;vec3 col=vec3(0.);for(int b=0;b<5;b++){float fb=float(b);float tt=T*.32+fb*.21;float k=floor(tt);float t=fract(tt);vec2 c=vec2(h1(vec2(k,fb))-.5,h1(vec2(fb,k))*.4+.05);"+
  "vec3 hue=.55+.45*cos(6.28*(h1(vec2(k+fb,1.))+vec3(0.,.33,.67)));for(int i=0;i<36;i++){float fi=float(i);float a=fi/36.*6.283+h1(vec2(fi,k))*.2;float sp=.35+.15*h1(vec2(k,fi));vec2 pos=c+vec2(cos(a),sin(a))*sp*t-vec2(0.,t*t*.25);"+
  "float d=length(uv-pos);col+=hue*.00028/(d*d+.0004)*(1.-t)*(1.-t)*step(.02,t);}col+=hue*.0012/(length(uv-c)+.02)*smoothstep(.1,.0,t);}gl_FragColor=vec4(min(col,vec3(1.2))*.85,1.);}",
 neon:"void main(){vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;vec3 col=vec3(0.);float hz=-.08;if(uv.y<hz){float z=.25/(hz-uv.y+.001);vec2 g=vec2(uv.x*z,z+T*1.4);vec2 f=abs(fract(g)-.5);float l=smoothstep(.04*z,.0,min(f.x,f.y)*1.);"+
  "col+=vec3(1.,.2,.8)*l*smoothstep(12.,1.,z)*.9+vec3(.3,.1,.5)*.12;}else{vec2 sp=uv-vec2(0.,.12);float r=length(sp);float sun=smoothstep(.26,.25,r)*step(.0,sin((uv.y-T*.02)*90.)+ (uv.y-.05)*14.);"+
  "col+=mix(vec3(1.,.25,.5),vec3(1.,.85,.3),clamp((uv.y+.1)*2.4,0.,1.))*sun;col+=vec3(1.,.3,.7)*.035/abs(r-.25+.01);}col+=vec3(1.,.3,.9)*.006/abs(uv.y-hz);gl_FragColor=vec4(col*.5,1.);}",
 godrays:"void main(){vec2 uv=gl_FragCoord.xy/R;vec2 o=vec2(.85,1.08);vec2 d=uv-o;float a=atan(d.y,d.x);float r=length(d);float rays=pow(n2(vec2(a*14.+T*.15,T*.05)),3.)+pow(n2(vec2(a*31.-T*.1,2.)),4.)*.6;"+
  "float fall=smoothstep(1.4,.0,r);vec3 col=vec3(1.,.82,.5)*rays*fall*.75+vec3(1.,.9,.7)*.25*smoothstep(.5,.0,r);float dust=smoothstep(.992,1.,h1(floor((uv+vec2(T*.004,-T*.006))*R/2.)))*fall;col+=vec3(1.,.95,.8)*dust;gl_FragColor=vec4(col,1.);}",
 galaxy:"void main(){vec2 p=(gl_FragCoord.xy-.5*R)/R.y*1.6;float r=length(p);float a=atan(p.y,p.x);float arm=sin(a*2.-log(r+.001)*4.+T*.25);float g=pow(.5+.5*arm,3.)*exp(-r*1.4)*fbm(p*3.+T*.05);"+
  "vec3 col=mix(vec3(.35,.25,1.),vec3(1.,.45,.7),.5+.5*sin(r*4.-T*.2))*g*2.2+vec3(1.,.9,.8)*exp(-r*7.)*.8;col+=vec3(1.)*smoothstep(.996,1.,h1(floor(gl_FragCoord.xy/1.5)))*(.6+.4*sin(T*2.+r*20.));gl_FragColor=vec4(col,1.);}",
 inferno:"void main(){vec2 uv=gl_FragCoord.xy/R;vec2 p=uv*vec2(R.x/R.y,1.)*3.;float n=fbm(p+vec2(0.,-T*.9)+fbm(p*1.5-vec2(0.,T*.6)));float h=smoothstep(.55,.0,uv.y-n*.35);"+
  "vec3 col=mix(vec3(.6,.05,0.),vec3(1.,.7,.2),h*h)*h*.62;float sp=smoothstep(.993,1.,h1(floor((uv+vec2(sin(T+uv.y*9.)*.01,-T*.12))*R/3.)))*smoothstep(.9,.2,uv.y);col+=vec3(1.,.6,.2)*sp*2.;gl_FragColor=vec4(col,1.);}",
 flashes:"void main(){vec2 uv=gl_FragCoord.xy/R;vec2 p=(gl_FragCoord.xy-.5*R)/R.y;vec3 col=vec3(0.);for(int i=0;i<9;i++){float fi=float(i);float sp=.9+h1(vec2(fi,7.))*1.6;float k=floor(T*sp+fi*.37);float ph=fract(T*sp+fi*.37);if(h1(vec2(k,fi))<.55){vec2 c=(vec2(h1(vec2(k,fi+1.)),h1(vec2(fi+3.,k)))-.5)*vec2(R.x/R.y,1.)*.95;c.y=c.y*.6-.15;float e=exp(-ph*9.);float d=length(p-c);col+=vec3(1.,.98,.95)*(.0035/(d*d+.0015))*e;col+=vec3(.75,.85,1.)*e*.012/(abs(p.y-c.y)+.004)*smoothstep(.5,.0,abs(p.x-c.x));}}float g=0.;for(int i=0;i<9;i++){float fi=float(i);float sp=.9+h1(vec2(fi,7.))*1.6;float ph=fract(T*sp+fi*.37);g+=exp(-ph*14.)*step(.45,h1(vec2(floor(T*sp+fi*.37),fi)));}col+=vec3(1.)*min(g,1.)*.10;gl_FragColor=vec4(col,1.);}",
 danger:"void main(){vec2 uv=gl_FragCoord.xy/R;vec2 p=(gl_FragCoord.xy-.5*R)/R.y;float pulse=.5+.5*sin(T*3.2);float v=smoothstep(.35,1.05,length(uv-.5)*1.45);vec3 col=vec3(.75,0.,.05)*v*(.35+.35*pulse);vec2 dot=vec2(.06*sin(T*1.7)+.03*sin(T*4.3),-.08+.05*cos(T*1.3)+.02*sin(T*5.1));float d=length(p-dot);col+=vec3(1.,.05,.05)*(.0012/(d*d+.0004));col+=vec3(1.,.1,.1)*.004/(abs(p.y-dot.y)+.002)*smoothstep(.02,.0,abs(p.x-dot.x)-.02)*.2;vec2 o=vec2(.62,.62);float beam=smoothstep(.006,.0,abs((p.y-o.y)-(dot.y-o.y)/(dot.x-o.x+1e-4)*(p.x-o.x)))*step(dot.x,p.x)*.35;col+=vec3(1.,.15,.15)*beam;col+=vec3(.8,0.,0.)*.05*step(.5,fract(T*.8))*v;gl_FragColor=vec4(col,1.);}",
 bokeh3d:"void main(){vec2 uv=(gl_FragCoord.xy-.5*R)/R.y;vec3 col=vec3(0.);for(int i=0;i<28;i++){float fi=float(i);float z=fract(h1(vec2(fi,3.))+T*.04);float s=mix(.02,.22,z*z);vec2 pos=(vec2(h1(vec2(fi,1.)),h1(vec2(fi,2.)))-.5)*vec2(1.6,1.)/max(.25,1.-z);"+
  "float d=length(uv-pos);float disk=smoothstep(s,s*.82,d)*(.25+.75*smoothstep(s*.5,s,d));vec3 c=.55+.45*cos(6.28*(h1(vec2(fi,9.))+vec3(0.,.15,.3)+.6));col+=c*disk*smoothstep(1.,.7,z)*z*.55;}gl_FragColor=vec4(col,1.);}"};
const BLEND={glass:"normal",thunder:"normal"};
let gl=null,cv=null,progs={},buf=null,raf=0,cur=null,tex=null,texSrc=null,t0=0;
function mk(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.warn(gl.getShaderInfoLog(s));return null}return s}
function prog(k){if(progs[k])return progs[k];const v=mk(gl.VERTEX_SHADER,VS),f=mk(gl.FRAGMENT_SHADER,HEAD+FS[k]);if(!v||!f)return null;const p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))return null;
 p.u={R:gl.getUniformLocation(p,"R"),T:gl.getUniformLocation(p,"T"),F:gl.getUniformLocation(p,"F"),B:gl.getUniformLocation(p,"B"),C:gl.getUniformLocation(p,"C")};return progs[k]=p}
function ensure(){const scr=$("#s-chat");if(!scr||scr.hidden)return false;if(cv&&scr.contains(cv))return true;
 cv=document.createElement("canvas");cv.id="fxGL";scr.appendChild(cv);gl=cv.getContext("webgl",{premultipliedAlpha:false,alpha:true,antialias:false})||cv.getContext("experimental-webgl");if(!gl){cv.remove();cv=null;return false}
 progs={};tex=null;texSrc=null;buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);return true}
function bgTex(){const box=$("#cbImg");if(!box)return null;const el=box.querySelector("video.on,video")||box.querySelector("img.front,img.on,img");if(!el)return null;const ok=el.tagName==="VIDEO"?el.readyState>=2:el.complete&&el.naturalWidth;if(!ok)return null;
 if(!tex){tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR)}
 gl.bindTexture(gl.TEXTURE_2D,tex);try{if(el.tagName==="VIDEO"||texSrc!==el.src){gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,el);texSrc=el.src}}catch(_){return null}
 const W=cv.clientWidth,H=cv.clientHeight,iw=el.videoWidth||el.naturalWidth,ih=el.videoHeight||el.naturalHeight,s=Math.max(W/iw,H/ih),cw=W/(iw*s),chh=H/(ih*s);return [(1-cw)/2,(1-chh)*.22,cw,chh]}
function glStop(){cancelAnimationFrame(raf);cur=null;if(cv){cv.style.opacity=0}}
function glStart(k){if(!FS[k])return;if(!ensure())return;const p=prog(k);if(!p)return;cur=k;t0=performance.now();cv.style.opacity=1;cv.style.mixBlendMode=BLEND[k]||"screen";
 const sc=Math.min(1,.62*(window.devicePixelRatio||1));const fit=()=>{const w=Math.max(1,cv.clientWidth*sc|0),h=Math.max(1,cv.clientHeight*sc|0);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h}gl.viewport(0,0,w,h)};
 const low=matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
 const frame=()=>{if(cur!==k||!cv||!document.body.contains(cv))return;const sc0=cv.closest(".screen");if(sc0&&sc0.hidden){cur=null;return}fit();gl.useProgram(p);gl.bindBuffer(gl.ARRAY_BUFFER,buf);const loc=gl.getAttribLocation(p,"p");gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  gl.uniform2f(p.u.R,cv.width,cv.height);gl.uniform1f(p.u.T,(performance.now()-t0)/1000*(low?.4:1));gl.uniform1f(p.u.F,Math.max(0,Math.min(1,window.FXFLASH||0)));
  if(k==="glass"){const c=bgTex();if(!c){gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);raf=requestAnimationFrame(frame);return}gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,tex);gl.uniform1i(p.u.B,0);gl.uniform4f(p.u.C,c[0],c[1],c[2],c[3])}
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);raf=requestAnimationFrame(frame)};frame()}
window.glFx={start:glStart,stop:glStop};
/* pairing with the 2D engine */
const PAIR={rain:"glass",storm:"thunder"},GLONLY=["flashes","danger","aurora","starwarp","fireworks","neon","godrays","galaxy","inferno","bokeh3d","glassrain"];
const _fxRun24=fxRun;fxRun=function(kind){glStop();if(!kind||kind==="none"){_fxRun24("__none");return}if(GLONLY.includes(kind)){_fxRun24(kind==="glassrain"?"rain":"__none");glStart(kind==="glassrain"?"glass":kind);return}_fxRun24(kind);if(PAIR[kind])glStart(PAIR[kind])};
if(typeof FX2!=="undefined")FX2.push(...GLONLY);
if(typeof FXLIST!=="undefined"){FXLIST.push(["flashes","📸"],["danger","🎯"],["glassrain","🪟"],["aurora","🌌"],["starwarp","🚀"],["fireworks","🎆"],["neon","🌆"],["godrays","☀️"],["galaxy","🌀"],["inferno","🔥"],["bokeh3d","✨"])}
if(typeof FX2MOOD!=="undefined")Object.assign(FX2MOOD,{flashes:"tense",danger:"tense",none:null,glassrain:"night",aurora:"fantasy",starwarp:"scifi",fireworks:"warm",neon:"sport",godrays:"luxury",galaxy:"scifi",inferno:"tense",bokeh3d:"intimate"});
if(typeof FX_RULES!=="undefined")FX_RULES.unshift([/烟花|fireworks/i,"fireworks"],[/极光|aurora/i,"aurora"],[/火灾|大火|燃烧|fire breaks|blaze/i,"inferno"],[/星空|银河|galaxy|stars/i,"galaxy"]);
Object.assign(I18N.en,{"fx.flashes":"Camera flashes","fx.danger":"In the crosshairs","fx.glassrain":"Rain on glass","fx.aurora":"Aurora","fx.starwarp":"Star warp","fx.fireworks":"Fireworks","fx.neon":"Neon city","fx.godrays":"Golden light","fx.galaxy":"Galaxy","fx.inferno":"Inferno","fx.bokeh3d":"City bokeh"});
Object.assign(I18N.zh,{"fx.flashes":"闪光灯","fx.danger":"危险瞄准","fx.glassrain":"雨夜玻璃","fx.aurora":"极光","fx.starwarp":"星河穿越","fx.fireworks":"烟花","fx.neon":"霓虹都市","fx.godrays":"圣光","fx.galaxy":"银河漩涡","fx.inferno":"烈焰","fx.bokeh3d":"城市光斑"});
})();

/* new story pinned first: home feed (为你推荐 + 热门) and Discover */
const PIN_NEW=["heir"];
(function(){const pin=L=>{const p=PIN_NEW.map(id=>L.find(w=>w.id===id)||(typeof wd==="function"&&wd(id))).filter(Boolean);return p.concat(L.filter(w=>!PIN_NEW.includes(w.id)))};
 const _fl=feedList;feedList=function(k){const L=_fl(k);return (k==="foryou"||k==="hot")?pin(L):L};
 const _wf=worldsForYou;worldsForYou=function(){return pin(_wf())}})();

/* ===== relationship graph: labels pushed outward from the center and de-overlapped ===== */
relGraph=function(w,asId){const R=(w.rel||[]).filter(r=>ch(r[0])&&ch(r[1]));if(!R.length)return "";
 const ids=[...new Set(R.flatMap(r=>[r[0],r[1]]))],W0=ids.length>4?380:360,H0=ids.length<=3?330:ids.length>4?440:360,cx=W0/2,cy=H0/2+6,rx=ids.length<=3?118:ids.length>4?150:128,ry=ids.length<=3?112:ids.length>4?170:122,P={},pov0=w.pack&&w.pack.pov,lv0=w.pack&&w.pack.love,pov=(asId&&asId!=="watch"&&asId!=="side"&&ch(asId))?asId:pov0,lv=pov===lv0?pov0:lv0,LW=ids.length>4?96:108,LH=34;
 ids.forEach((id,i)=>{const a=-Math.PI/2+i*2*Math.PI/ids.length;P[id]=[cx+rx*Math.cos(a),cy+ry*Math.sin(a)]});
 const boxes=[];let e="",labs="";
 R.forEach(([a,b,lab])=>{const[x1,y1]=P[a],[x2,y2]=P[b],main=(a===pov&&b===lv)||(a===lv&&b===pov);e+='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" class="rge'+(main?" main":"")+'"/>';
  let best=null;for(const tt of [.5,.4,.6,.32,.68,.25,.75]){let mx=x1+(x2-x1)*tt,my=y1+(y2-y1)*tt;const dx=mx-cx,dy=my-cy,dl=Math.hypot(dx,dy)||1,push=ids.length<=3?16:6;mx+=dx/dl*push;my+=dy/dl*push;
   mx=Math.max(LW/2+2,Math.min(W0-LW/2-2,mx));my=Math.max(LH/2+2,Math.min(H0-LH/2-2,my));
   const hit=boxes.some(b=>Math.abs(b[0]-mx)<LW-4&&Math.abs(b[1]-my)<LH-2)||ids.some(id=>Math.abs(P[id][0]-mx)<LW/2+20&&Math.abs(P[id][1]-my)<LH/2+26);
   if(!hit){best=[mx,my];break}if(!best)best=[mx,my]}
  boxes.push(best);labs+='<foreignObject x="'+(best[0]-LW/2)+'" y="'+(best[1]-LH/2)+'" width="'+LW+'" height="'+LH+'"><div class="rgl'+(main?" main":"")+'">'+esc(Lz(lab)||"")+'</div></foreignObject>'});
 let n="";ids.forEach(id=>{const[x,y]=P[id],c=ch(id),you=id===pov;n+='<foreignObject x="'+(x-38)+'" y="'+(y-30)+'" width="76" height="72"><div class="rgn'+(id===lv?" lv":"")+(you?" you":"")+'"><img src="'+esc(artSrc(id))+'" alt=""><b>'+esc(first(c.n))+(you?' · '+t("st2.isYou"):'')+'</b></div></foreignObject>'});
 return '<div class="rgraph"><div class="eyebrow">'+t("rg.h")+'</div><svg viewBox="0 0 '+W0+' '+H0+'" width="100%">'+e+n+labs+'</svg></div>'};
/* ===== "Watch" is the Director's seat — say so ===== */
Object.assign(I18N.en,{"pk.watch":"🎬 Director's view"});Object.assign(I18N.zh,{"pk.watch":"🎬 导演视角"});
packModes=function(w){const P=w.pack,L=[{as:"watch",t:T("Stand outside the scene and run it: make him jealous, leave them alone, get someone drunk, spill a secret — the story rewrites itself around your call.","站在场外当导演：一键让他吃醋、让他们独处、灌醉一个、揭开秘密——剧情会按你的指令改写。")}];(P.join||[]).forEach(j=>L.push({as:j.as,t:j.t}));return L};

/* playing a different character: someone else's card choice plays itself (first card), and you don't snoop your own phone */
const _stopAuto24=stopAuto;stopAuto=function(th,b){const d=b[2]||{},as=th.pk&&th.pk.as;
 if(b[1]==="pick"&&as&&as!=="watch"&&as!=="side"&&ch(b[0])&&b[0]!==as){const o=d.items[0];if(o){pkSet(th,o.set);if(o.rd&&typeof dimApply==="function")dimApply(th,o.rd,Lz(o.t));return [[b[0],"act",(o.ic?o.ic+" ":"")+Lz(o.t)]].concat(Lz(o.then)||o.then||[])}}
 if(b[1]==="feature"&&d.k==="phone"&&as&&d.cid===as)return d.skip||[];
 return _stopAuto24(th,b)};
/* dense casts get a roomier graph */
const _relGraph24=relGraph;relGraph=function(w,asId){let h=_relGraph24(w,asId);const n=[...new Set((w.rel||[]).flatMap(r=>[r[0],r[1]]))].length;if(n>4)h=h.replace('class="rgraph"','class="rgraph dense"');return h};

/* "none" means no effect at all, and stories without their own atmosphere get none by default (no random bokeh) */
if(typeof FX2!=="undefined")FX2.push("none");
const _chatFx24=chatFx;chatFx=function(th){if(th&&!(th.fxm&&th.fxm!=="auto")&&!(th.pk&&th.pk.fx)&&!(typeof FX!=="undefined"&&FX[th.wid])){if(window.glFx)glFx.stop();fxRun("none");return}_chatFx24(th)};

/* ===== scene music: stories cue the score with ["sys","bgm",{m}] — it wins over everything else until the next cue =====
   New moods: memory (music box), luxury (bright harp + strings), mystery (sparse bells over a low drone),
   danger (heartbeat kick + dissonant drone), action (driving pulse). */
Object.assign(BGM_MOODS,{
 memory:{bpm:66,ch:[[60,64,67,71],[57,60,64,67],[53,57,60,64],[55,59,62,67]],arp:[0,1,2,3,2,1,3,-1],wave:"sine",cut:3200,box:1,vel:.42},
 luxury:{bpm:84,ch:[[48,52,55,59,62],[53,57,60,64,67],[45,48,52,55,59],[50,53,57,60,65]],arp:[0,2,4,3,1,3,4,2],wave:"triangle",cut:2800,bass:1,bell:1,vel:.45},
 mystery:{bpm:60,ch:[[45,48,52],[44,48,51],[45,49,52],[41,45,48]],arp:[2,-1,-1,1,-1,0,-1,-1],wave:"sine",cut:900,bell:1,drone:1,vel:.4},
 danger:{bpm:70,ch:[[38,39,45],[38,39,44],[37,38,45],[38,41,44]],arp:[-1,-1,-1,-1,-1,-1,2,-1],wave:"sawtooth",cut:420,kick:1,drone:1,vel:.4},
 action:{bpm:124,ch:[[40,47,52],[36,43,48],[38,45,50],[35,42,47]],arp:[0,2,1,2,0,2,1,2],wave:"square",cut:1300,bass:1,pulse:1,kick:1,vel:.3}});
Object.assign(BGM_NAME,{memory:"📼 回忆",luxury:"🥂 名利场",mystery:"🕯 悬疑",danger:"🎯 危险",action:"📸 混乱"});
bgmTick=function(){const M=BGM_MOODS[BGM.mood];if(!M||!BGM.ctx)return;const c=BGM.ctx,eighth=60/M.bpm/2;
 while(BGM.next<c.currentTime+.4){const t=BGM.next,i=BGM.step,bar=Math.floor(i/8)%M.ch.length,ch=M.ch[bar],k=i%8;
  if(k===0&&!M.box){ch.forEach((n,j)=>bgmNote(n+12,t,eighth*8.6,{wave:M.wave==="square"?"triangle":M.wave,cut:M.cut*.7,vel:.045*M.vel*2,att:eighth*2.5,det:j%2?7:-7}));if(M.bass)bgmNote(ch[0]-12,t,eighth*7,{wave:"sine",cut:400,vel:.22*M.vel*2,att:.03})}
  if(M.drone&&k===0)bgmNote(ch[0]-24,t,eighth*8.4,{wave:"sawtooth",cut:220,vel:.12,att:eighth*3});
  if(M.bass&&k===4&&!M.pulse)bgmNote(ch[0]-12+(bar%2?7:0),t,eighth*3.5,{wave:"sine",cut:400,vel:.16*M.vel*2,att:.03});
  if(M.pulse&&k%2===0)bgmNote(ch[0]-12,t,eighth*.9,{wave:"triangle",cut:500,vel:.1*M.vel*2});
  if(M.kick&&(k===0||k===1||(M.pulse&&k===4))){const o=c.createOscillator(),g=c.createGain();o.type="sine";o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(42,t+.18);o.connect(g);g.connect(BGM.master);g.gain.setValueAtTime(k===1?.32:.5,t);g.gain.exponentialRampToValueAtTime(.001,t+.32);o.start(t);o.stop(t+.35)}
  const ai=M.arp[k];if(ai>=0&&ch[ai%ch.length]!=null){const sw=(k%2&&M.sw)?eighth*M.sw:0;
   if(M.box)bgmNote(ch[ai%ch.length]+24,t+sw,eighth*5,{wave:"sine",cut:6000,vel:.09,att:.003}),bgmNote(ch[ai%ch.length]+36,t+sw,eighth*2,{wave:"sine",cut:8000,vel:.025,att:.002});
   else bgmNote(ch[ai%ch.length]+24,t+sw,eighth*(M.bell?6:3),{wave:M.bell?"sine":M.wave==="sawtooth"?"triangle":M.wave,cut:M.cut*1.6,vel:.07*M.vel*2})}
  if(M.bell&&k===6&&bar%2===0)bgmNote(ch[ch.length-1]+36,t,eighth*10,{wave:"sine",cut:5000,vel:.03});
  if(M.brush){if(k%2===1)bgmNoise(t+(M.sw?eighth*M.sw:0),.08,.035,7000);if(k===2||k===6)bgmNoise(t,.18,.05,3500)}
  BGM.next+=eighth;BGM.step++}};
PKREG.add("app24_gl.js", function(th,b, next){if(Array.isArray(b)&&b[0]==="sys"&&b[1]==="bgm"){th.pk.q.shift();th.pk.bgm=(b[2]||{}).m||null;save();if(curT===th.id&&typeof bgmFollow==="function")bgmFollow(th,true);return true}return next(th,b)});;
const _bgmFor24=bgmForThread;bgmForThread=function(th){const r=_bgmFor24(th);if(r&&th&&th.pk&&th.pk.bgm&&BGM_MOODS[th.pk.bgm]&&!(th.fxm&&th.fxm!=="auto"))r.mood=th.pk.bgm;return r};
/* restarting a chapter clears the cue */
const _packOpen24=packOpen;packOpen=function(th,n,instant){if(th&&th.pk)th.pk.bgm=null;return _packOpen24.apply(this,arguments)};

/* ===== one speed button: tap to cycle 0.5× → 1× → 2× → 3× → 4× (plus pause and tap-to-advance) ===== */
const SPD_CYCLE=[[2,"0.5×"],[1,"1×"],[.5,"2×"],[1/3,"3×"],[.25,"4×"]];
function spdIdx(){const v=pkSpd();let b=1,d=9;SPD_CYCLE.forEach(([x],i)=>{const dd=Math.abs(x-v);if(dd<d){d=dd;b=i}});return b}
const _packPanel24=packPanel;packPanel=function(th){let h=_packPanel24(th);if(h.indexOf('data-spd="')<0)return h;const v=pkSpd(),tap=v===0&&!S.pkPaused,cur=SPD_CYCLE[spdIdx()];
 h=h.replace(/<button class="[^"]*" data-spd="[^"]*">[^<]*<\/button>/g,"");
 return h.replace('<div class="pkspeed">','<div class="pkspeed">'+'<button class="spdcyc'+(v>0?" on":"")+'" data-spdcyc="1">⏱ '+(v>0?cur[1]:"1×")+'</button><button class="'+(tap?"on":"")+'" data-spdtap="1">👆 '+t("st3.tap")+'</button>')};
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-spdcyc]")){const v=pkSpd(),i=v===0?1:(spdIdx()+1)%SPD_CYCLE.length;S.pkSpd=SPD_CYCLE[i][0];S.pkPaused=false;save();const th=S.threads[curT];if(th)packRefresh(th);if(PKNEXT[curT])PKNEXT[curT]();toast("⏱ "+SPD_CYCLE[i][1]);return}
 if(e.target.closest("[data-spdtap]")){S.pkSpd=0;S.pkPaused=false;save();const th=S.threads[curT];if(th)packRefresh(th);return}});

/* ===== inheritance reveal is a paid moment: the number stays sealed until you pay 💎2 (members see it free) ===== */
const MONEY_PRICE=2;
const _msgHTML24=msgHTML;msgHTML=function(m,i,th){if(!m||m.k!=="xmoney"||m.open||S.plus)return _msgHTML24(m,i,th);
 return '<div class="xmoney sealed" data-mi="'+i+'"><div class="xm1"><small>'+t("pk2.yday")+'</small><s>'+esc(Lz(m.from)||m.from)+'</s></div><div class="xm2"><small>'+t("pk2.today")+' · '+esc(Lz(m.label)||m.label||"")+'</small><b class="num xmblur">$?.?B+</b></div>'+
  '<button class="xmopen" data-xmopen="'+i+'">🔓 '+t("mo.open",{n:MONEY_PRICE})+'</button><p class="xmhint">'+t("mo.hint")+'</p></div>'};
document.addEventListener("click",e=>{const x=e.target.closest("[data-xmopen]");if(!x)return;const th=S.threads[curT],m=th&&th.msgs[+x.dataset.xmopen];if(!m||m.open)return;
 if(!S.plus&&!spend(MONEY_PRICE,"event"))return;m.open=1;save();renderChat();try{navigator.vibrate&&navigator.vibrate([30,40,60])}catch(_){}
 if(typeof glFx!=="undefined"&&th.pk&&curT===th.id){const prev=th.pk.fx;fxSet(th,"godrays")}});
Object.assign(I18N.en,{"mo.open":"See what you inherited · 💎{n}","mo.hint":"Members see it free."});Object.assign(I18N.zh,{"mo.open":"查看你继承了多少 · 💎{n}","mo.hint":"会员免费查看"});
