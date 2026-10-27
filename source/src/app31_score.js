/* ================= FILM SCORE (v4) =================
   The chat music now works like a film score:
   1) Real recordings win: art/bgm/<storyId>/<cue>.mp3, then art/bgm/<cue>.mp3, then the old whole-story art/bgm/<storyId>.mp3.
      Files loop seamlessly (two players crossfade over the loop point), cues crossfade, everything ducks under voice lines
      (~35%) and a little while a long narration block is on screen, and fades out when you leave the chat.
   2) Without files, each cue is a small live-synth "orchestra" with its own identity: string pads through a shared hall reverb,
      felt piano, Rhodes, harp, music box, upright bass, low ostinato, taiko and risers. "hush" is near-silence for emotional peaks.
   3) Stingers are one-shot hits on top of the bed: reveal (money / title), shock (bad events), heart (intimate choices, unlocked
      key scenes), clue (clue cards) and transition (scene change, timed with the 1.7s scene curtain).
   4) Scene change: old cue fades out → transition stinger → the new scene's cue (read ahead from the story queue) fades in.
   Debug: window.__score is a log of every cue/stinger/scene event. */
(function(){
const SC={G:null,voices:[],cur:null,hold:null,timer:null,narr:0,lastSting:0,bad:{},log:[]};
window.__score=SC.log;
function slog(type,name,x){const e={t:+(performance.now()/1000).toFixed(2),type,name};if(x)Object.assign(e,x);SC.log.push(e);if(SC.log.length>300)SC.log.shift()}
const mf=n=>440*Math.pow(2,(n-69)/12);
const rnd=(a,b)=>a+Math.random()*(b-a);

/* ---------- graph: voices → bed (sidechain dips) → duck (voice/narration) → level → soft lowpass → gentle compressor ---------- */
function scIR(c,sec){const sr=c.sampleRate,len=Math.floor(sr*sec),pre=Math.floor(sr*.022),b=c.createBuffer(2,len,sr);
 for(let k=0;k<2;k++){const d=b.getChannelData(k);let y=0;
  for(let i=pre;i<len;i++){const x=(i-pre)/(len-pre),a=.85-.72*x;y+=a*((Math.random()*2-1)-y);d[i]=y*Math.exp(-x*6.2)}
  for(let r=0;r<7;r++){const p=pre+Math.floor(sr*rnd(.004,.07));if(p<len)d[p]+=rnd(-.5,.5)}}
 return b}
function scGraph(c){const G={ctx:c};
 const comp=c.createDynamicsCompressor();comp.threshold.value=-18;comp.knee.value=14;comp.ratio.value=3;comp.attack.value=.012;comp.release.value=.35;
 const tone=c.createBiquadFilter();tone.type="lowpass";tone.frequency.value=8500;tone.Q.value=.4;
 const lvl=c.createGain();lvl.gain.value=1;lvl.connect(tone);tone.connect(comp);comp.connect(c.destination);
 const duck=c.createGain();duck.gain.value=1;duck.connect(lvl);
 const bed=c.createGain();bed.gain.value=1;bed.connect(duck);
 const sting=c.createGain();sting.gain.value=1;sting.connect(lvl);
 const rv=c.createConvolver();rv.buffer=scIR(c,3);const rvo=c.createGain();rvo.gain.value=.9;rv.connect(rvo);rvo.connect(duck);
 const nb=c.createBuffer(1,c.sampleRate*2,c.sampleRate),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
 Object.assign(G,{lvl,duck,bed,sting,rev:rv,noise:nb});return G}
function mkVoice(G,send,dest){const c=G.ctx,V={G,in:c.createGain(),sd:c.createGain(),alive:true};V.in.gain.value=0;V.sd.gain.value=send||0;
 V.in.connect(dest||G.bed);if(send){V.in.connect(V.sd);V.sd.connect(G.rev)}return V}

/* ---------- instruments (each note is a handful of nodes that stop themselves) ---------- */
function pan(c,x){if(!c.createStereoPanner)return null;const p=c.createStereoPanner();p.pan.value=x;return p}
const I={
 /* string / synth pad: 2 detuned saws per note, spread L/R, through one lowpass that opens on the swell */
 pad(V,notes,t,dur,o){o=o||{};const c=V.G.ctx,f=c.createBiquadFilter(),g=c.createGain(),cut=o.cut||1200;
  const a=Math.min(o.att||1.5,dur*.45),r=Math.min(o.rel||1.6,dur*.5),v=(o.vel||.1)/Math.sqrt(notes.length);
  f.type="lowpass";f.Q.value=.5;f.frequency.setValueAtTime(cut*.45,t);f.frequency.linearRampToValueAtTime(cut,t+a*1.2);f.connect(g);g.connect(V.in);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);g.gain.setValueAtTime(v,t+dur-r);g.gain.linearRampToValueAtTime(0,t+dur);
  let lg=null;if(o.vib){const l=c.createOscillator();l.frequency.value=rnd(4.4,5.2);lg=c.createGain();lg.gain.value=o.vib;l.connect(lg);l.start(t);l.stop(t+dur+.1)}
  const sp=o.mono?1:2,P=[pan(c,-.45),pan(c,.45)];P.forEach(p=>p&&p.connect(f));
  notes.forEach(n=>{for(let s=0;s<sp;s++){const os=c.createOscillator();os.type=o.wave||"sawtooth";os.frequency.value=mf(n);os.detune.value=(s?1:-1)*(o.det||7)+rnd(-2,2);
   if(lg)lg.connect(os.detune);os.connect(P[s]||f);os.start(t);os.stop(t+dur+.05)}})},
 /* felt piano: soft triangle + quiet octave partial, lowpass that closes as the note decays */
 pno(V,n,t,vel,o){o=o||{};const c=V.G.ctx,fr=mf(n),g=c.createGain(),lp=c.createBiquadFilter(),dur=o.dur||Math.max(1.2,3.2-Math.max(0,n-60)*.035);
  lp.type="lowpass";lp.frequency.setValueAtTime(Math.min(7000,fr*(o.br||3.5)+300),t);lp.frequency.exponentialRampToValueAtTime(Math.max(250,fr*1.1),t+dur*.6);
  const p=pan(c,o.pan!=null?o.pan:Math.max(-.5,Math.min(.5,(n-62)/40)));lp.connect(g);if(p){g.connect(p);p.connect(V.in)}else g.connect(V.in);
  vel*=rnd(.9,1.08);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+.007);g.gain.exponentialRampToValueAtTime(vel*.32,t+.3);g.gain.exponentialRampToValueAtTime(.0004,t+dur);
  const o1=c.createOscillator();o1.type="triangle";o1.frequency.value=fr;o1.connect(lp);
  const o2=c.createOscillator(),g2=c.createGain();o2.frequency.value=fr*2.002;g2.gain.value=.22;o2.connect(g2);g2.connect(lp);
  [o1,o2].forEach(x=>{x.start(t);x.stop(t+dur+.05)})},
 /* Rhodes-style electric piano: one FM pair (bell-ish bark that mellows) */
 ep(V,n,t,vel,o){o=o||{};const c=V.G.ctx,fr=mf(n),dur=o.dur||3,car=c.createOscillator(),mod=c.createOscillator(),mg=c.createGain(),g=c.createGain();
  car.frequency.value=fr;mod.frequency.value=fr;mg.gain.setValueAtTime(fr*(o.bark||1.3),t);mg.gain.exponentialRampToValueAtTime(fr*.12,t+.6);mod.connect(mg);mg.connect(car.frequency);
  const p=pan(c,rnd(-.3,.3));car.connect(g);if(p){g.connect(p);p.connect(V.in)}else g.connect(V.in);
  vel*=rnd(.9,1.08);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+.006);g.gain.exponentialRampToValueAtTime(vel*.45,t+.35);g.gain.exponentialRampToValueAtTime(.0004,t+dur);
  [car,mod].forEach(x=>{x.start(t);x.stop(t+dur+.05)})},
 /* music box / celesta: pure tone + a fast, quiet high partial, a little tape wobble */
 box(V,n,t,vel,o){o=o||{};const c=V.G.ctx,fr=mf(n),dur=o.dur||2.2,g=c.createGain(),g2=c.createGain(),wob=rnd(-7,7);
  const a=c.createOscillator(),b=c.createOscillator();a.frequency.value=fr;a.detune.value=wob;b.frequency.value=fr*4.01;b.detune.value=wob;
  const p=pan(c,rnd(-.35,.35));a.connect(g);b.connect(g2);g2.connect(g);if(p){g.connect(p);p.connect(V.in)}else g.connect(V.in);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+.003);g.gain.exponentialRampToValueAtTime(.0004,t+dur);
  g2.gain.setValueAtTime(.35,t);g2.gain.exponentialRampToValueAtTime(.001,t+.3);[a,b].forEach(x=>{x.start(t);x.stop(t+dur+.05)})},
 /* harp / pizzicato pluck */
 harp(V,n,t,vel,o){o=o||{};const c=V.G.ctx,fr=mf(n),dur=o.dur||1.8,lp=c.createBiquadFilter(),g=c.createGain();lp.type="lowpass";
  lp.frequency.setValueAtTime(Math.min(9000,fr*(o.br||6)),t);lp.frequency.exponentialRampToValueAtTime(Math.max(200,fr*1.5),t+dur*.5);
  const os=c.createOscillator();os.type="triangle";os.frequency.value=fr;os.connect(lp);const p=pan(c,rnd(-.4,.4));lp.connect(g);if(p){g.connect(p);p.connect(V.in)}else g.connect(V.in);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+.004);g.gain.exponentialRampToValueAtTime(.0004,t+dur);os.start(t);os.stop(t+dur+.05)},
 /* upright / synth bass */
 bass(V,n,t,dur,vel,o){o=o||{};const c=V.G.ctx,fr=mf(n),lp=c.createBiquadFilter(),g=c.createGain();lp.type="lowpass";
  lp.frequency.setValueAtTime(o.pl?700:380,t);lp.frequency.exponentialRampToValueAtTime(o.pl?220:300,t+Math.min(dur,.5));lp.connect(g);g.connect(V.in);
  const a=c.createOscillator(),b=c.createOscillator(),bg=c.createGain();a.frequency.value=fr;b.type="triangle";b.frequency.value=fr;bg.gain.value=.5;a.connect(lp);b.connect(bg);bg.connect(lp);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+(o.pl?.012:.06));g.gain.exponentialRampToValueAtTime(vel*(o.pl?.35:.7),t+Math.min(dur*.5,.4));g.gain.exponentialRampToValueAtTime(.0005,t+dur);
  [a,b].forEach(x=>{x.start(t);x.stop(t+dur+.05)})},
 /* low ostinato: two saws through a resonant lowpass with a pluck envelope */
 pulse(V,n,t,dur,vel,cut){const c=V.G.ctx,fr=mf(n),lp=c.createBiquadFilter(),g=c.createGain();lp.type="lowpass";lp.Q.value=2.2;
  lp.frequency.setValueAtTime(cut*2.4,t);lp.frequency.exponentialRampToValueAtTime(cut,t+dur*.7);lp.connect(g);g.connect(V.in);
  [0,6].forEach(d=>{const o=c.createOscillator();o.type="sawtooth";o.frequency.value=fr;o.detune.value=d;o.connect(lp);o.start(t);o.stop(t+dur+.03)});
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+.006);g.gain.exponentialRampToValueAtTime(.0005,t+dur)},
 noise(V,t,dur,vel,type,freq,q,att,dest){const c=V.G.ctx,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=V.G.noise;f.type=type;f.frequency.value=freq;f.Q.value=q||.7;
  s.connect(f);f.connect(g);g.connect(dest||V.in);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+(att||.002));g.gain.exponentialRampToValueAtTime(.0004,t+dur);s.start(t,rnd(0,1.5));s.stop(t+dur+.02);return f},
 hat(V,t,vel){I.noise(V,t,.05,vel,"highpass",7500,.5)},
 brush(V,t,vel){I.noise(V,t,.22,vel,"bandpass",3200,.6,.03)},
 snare(V,t,vel){I.noise(V,t,.17,vel,"bandpass",1900,.8);const c=V.G.ctx,o=c.createOscillator(),g=c.createGain();o.type="triangle";o.frequency.setValueAtTime(200,t);o.frequency.exponentialRampToValueAtTime(150,t+.08);
  o.connect(g);g.connect(V.in);g.gain.setValueAtTime(vel*.8,t);g.gain.exponentialRampToValueAtTime(.0005,t+.12);o.start(t);o.stop(t+.14)},
 kick(V,t,vel){const c=V.G.ctx,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(120,t);o.frequency.exponentialRampToValueAtTime(46,t+.12);o.connect(g);g.connect(V.in);
  g.gain.setValueAtTime(vel,t);g.gain.exponentialRampToValueAtTime(.0005,t+.38);o.start(t);o.stop(t+.4)},
 /* taiko / low boom */
 boom(V,t,vel){const c=V.G.ctx,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(74,t);o.frequency.exponentialRampToValueAtTime(34,t+.6);o.connect(g);g.connect(V.in);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vel,t+.008);g.gain.exponentialRampToValueAtTime(.0005,t+1.6);o.start(t);o.stop(t+1.65);I.noise(V,t,.3,vel*.35,"lowpass",260,.7)},
 /* soft lub-dub */
 heart(V,t,vel){[[0,1],[.26,.7]].forEach(([d,m])=>{const c=V.G.ctx,o=c.createOscillator(),g=c.createGain();o.frequency.setValueAtTime(62,t+d);o.frequency.exponentialRampToValueAtTime(40,t+d+.15);
  o.connect(g);g.connect(V.in);g.gain.setValueAtTime(0,t+d);g.gain.linearRampToValueAtTime(vel*m,t+d+.015);g.gain.exponentialRampToValueAtTime(.0005,t+d+.3);o.start(t+d);o.stop(t+d+.32)})},
 /* noise riser that sweeps up into the downbeat */
 riser(V,t,len,vel){const c=V.G.ctx,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=V.G.noise;s.loop=true;f.type="bandpass";f.Q.value=1.4;
  f.frequency.setValueAtTime(350,t);f.frequency.exponentialRampToValueAtTime(5200,t+len);s.connect(f);f.connect(g);g.connect(V.in);
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vel,t+len);g.gain.linearRampToValueAtTime(0,t+len+.06);s.start(t);s.stop(t+len+.1)},
 crackle(V,t,vel){I.noise(V,t,.012,vel,"highpass",2500,.5)}
};

/* ---------- the cues ---------- */
const C=(r,...v)=>({r,v});
const SC_M={
 /* 🎷 late-night jazz lounge: Rhodes ii–V–I, walking upright bass, brushes, swung */
 night:{bpm:66,sw:.62,rev:.3,lv:.38,key:5,prog:[C(43,53,57,58,62),C(36,52,57,58,62),C(41,52,55,57,60),C(38,54,57,60,63)],
  play(s){const{V,t,i,c,nc,d16,sw,bar}=s;
   if(i===0){c.v.forEach((n,j)=>I.ep(V,n,t+j*.018,.075,{dur:3.2}));I.pad(V,c.v,t,d16*17,{wave:"triangle",cut:1100,vel:.05,att:1.2,mono:1})}
   if(i===6&&bar%2)c.v.slice(1).forEach((n,j)=>I.ep(V,n,t+sw+j*.012,.04,{dur:1.2}));
   if(i%4===0){const R=36+((c.r%12)+12)%12,NR=36+((nc.r%12)+12)%12,b=i/4,third=c.v.some(x=>(x-c.r)%12===3)?3:4;
    const n=[R,R+(bar%2?third:7),R+(bar%2?7:12),NR+(NR>R?-1:1)][b];I.bass(V,n>48?n-12:n,t,d16*3.8,.3,{pl:1})}
   if(i===4||i===12)I.brush(V,t,.05);
   if(i%4===0||(i%8===6))I.noise(V,t+(i%4?sw:0),.07,i%8===6?.016:.024,"bandpass",6500,1.2);
   if(bar%4===3&&(i===8||i===10||i===14))I.ep(V,c.v[c.v.length-1]+12-(i===10?2:i===14?5:0),t+(i%4?sw:0),.045,{dur:2.2,bark:.8})}},
 /* 🥂 glamour: lush strings, harp glissandi, a sparkle on top */
 luxury:{bpm:74,rev:.38,lv:0.55,key:2,prog:[C(38,54,57,61,64),C(35,50,54,57,64),C(43,54,57,59,62),C(45,52,54,57,59)],
  play(s){const{V,t,i,c,d16,bar}=s;
   if(i===0){I.pad(V,c.v,t,d16*18,{cut:2300,vel:.085,att:1.3,vib:6});I.bass(V,c.r,t,d16*15,.24)}
   const up=c.v.concat(c.v.map(n=>n+12));
   if(bar%2===0&&i<8)I.harp(V,up[i]+12,t,.035+i*.005,{dur:2});
   if(bar%2===1&&i%4===0)I.harp(V,up[(i/4+2)%up.length]+12,t,.05,{dur:2.2});
   if(bar%2===1&&i===10)I.box(V,c.v[c.v.length-1]+24,t,.035,{dur:2.5})}},
 /* ☀️ light, hopeful: felt-piano broken chords, harp pluck melody, soft shaker */
 warm:{bpm:88,rev:.24,lv:0.71,key:0,prog:[C(36,60,64,67,72),C(35,59,62,67,71),C(33,57,60,64,67),C(41,57,60,65,67)],
  play(s){const{V,t,i,c,d16,bar}=s;
   if(i%2===0){const k=[0,2,1,3,0,2,1,3][i/2];I.pno(V,c.v[k],t,i===0?.075:.05,{dur:1.8})}
   if(i===0){I.bass(V,c.r,t,d16*7,.22,{pl:1});I.pad(V,c.v.slice(0,3),t,d16*16,{wave:"triangle",cut:1600,vel:.04,att:.8,mono:1})}
   if(i===8)I.bass(V,c.r+7,t,d16*7,.16,{pl:1});
   if(bar%2===1&&(i===0||i===6||i===10))I.harp(V,c.v[(i/2+bar)%c.v.length]+12,t,.05);
   I.hat(V,t,i%4===2?.014:.006)}},
 /* 🌧 bittersweet: low strings, felt piano left hand, a falling melody that comes and goes */
 sad:{bpm:56,rev:.42,lv:0.82,key:9,prog:[C(33,57,60,64),C(29,57,60,64,65),C(31,55,60,64),C(28,56,59,64)],
  mel:[[[0,76],[8,74],[12,72]],[[0,72],[8,77],[14,76]],[[0,76],[6,74],[8,72],[12,71]],[[0,71],[8,68],[12,71]]],
  play(s){const{V,t,i,c,d16,bar,ci}=s;
   if(i===0){I.pad(V,[c.r+12].concat(c.v),t,d16*18,{cut:850,vel:.075,att:2.2,vib:5});I.bass(V,c.r,t,d16*15,.16)}
   const L={0:c.r+12,4:c.r+19,8:c.v[1]+(c.v[1]>64?-12:0),12:c.r+19}[i];if(L)I.pno(V,L,t,.05,{dur:2.6});
   if([0,1,1,0][Math.floor(bar/4)%4]){const m=this.mel[ci].find(x=>x[0]===i);if(m)I.pno(V,m[1],t,.08,{dur:3})}}},
 /* 📼 memory: a music-box waltz (3/4) over a faded pad, a little vinyl dust */
 memory:{bpm:72,spb:12,rev:.45,lv:1.8,key:5,prog:[C(41,57,60,64),C(40,55,59,62),C(38,57,60,62),C(36,55,60,64),C(34,57,62,65),C(33,57,60,64),C(31,58,62,65),C(36,58,60,64)],
  mel:[[[0,81],[4,79],[8,77]],[[0,79],[4,76],[8,74]],[[0,77],[4,76],[6,74],[8,72]],[[0,76],[8,72]],[[0,77],[4,81],[8,82]],[[0,81],[4,79],[8,76]],[[0,77],[4,74],[8,70]],[[0,72],[4,76],[8,79]]],
  play(s){const{V,t,i,c,d16,bar,ci}=s;
   if(i===0){I.box(V,c.r+24,t,.06,{dur:2.4});I.pad(V,c.v,t,d16*13,{wave:"triangle",cut:800,vel:.05,att:1,mono:1})}
   if(i===4||i===8)I.box(V,c.v[i/4]+12,t,.035,{dur:1.6});
   if(Math.floor(bar/8)%3!==2){const m=this.mel[ci].find(x=>x[0]===i);if(m)I.box(V,m[1],t,.07,{dur:2.6})}
   if(Math.random()<.18)I.crackle(V,t+rnd(0,d16),.02)}},
 /* 🌙 intimate: Rhodes maj9 chords, warm pad, a far-off heartbeat, a high note now and then */
 intimate:{bpm:58,rev:.45,lv:0.8,key:4,prog:[C(40,56,59,63,66),C(37,56,59,63,64),C(33,56,59,61,64),C(35,54,57,61,64)],
  play(s){const{V,t,i,c,d16,bar}=s;
   if(i===0){c.v.forEach((n,j)=>I.ep(V,n,t+j*.03,.065,{dur:4,bark:.9}));I.pad(V,c.v,t,d16*18,{wave:"triangle",cut:1000,vel:.055,att:2.4,mono:1});I.bass(V,c.r,t,d16*15,.18)}
   if(i===0||i===8)I.heart(V,t,.07);
   if((bar%2===0&&i===10)||(bar%2===1&&i===6))I.pno(V,c.v[(bar+1)%c.v.length]+12,t,.05,{dur:3.4})}},
 /* 🕯 mystery: low drone, celesta motif with a tritone, muted plucks, a breath-in swell */
 mystery:{bpm:60,rev:.5,lv:1.15,key:2,prog:[C(38,53,57,64),C(38,53,58,62),C(38,55,58,62),C(37,55,58,61,64)],
  play(s){const{V,t,i,c,d16,bar}=s;
   if(i===0){I.pad(V,[c.r,c.r+7],t,d16*17,{cut:360,vel:.12,att:1.6});I.pad(V,c.v,t,d16*17,{cut:850,vel:.045,att:2,vib:4})}
   const m=(bar%2?[[4,77],[10,76]]:[[0,74],[6,81],[8,80]]).find(x=>x[0]===i);if(m)I.box(V,m[1],t,.05,{dur:3});
   if(i===2||i===10)I.harp(V,c.r+(i===2?12:19),t,.06,{dur:.5,br:2.5});
   if(bar%4===3&&i===4)I.riser(V,t,d16*12,.025)}},
 /* ⚠️ tense: 3-3-2 low ostinato on a pedal, string cluster swells, ticking, a riser every 8 bars */
 tense:{bpm:84,hold:2,rev:.3,lv:0.8,key:2,prog:[C(38,50,51,57),C(34,50,53,58),C(38,50,51,57),C(36,50,55,60)],
  play(s){const{V,t,i,c,d16,bar}=s;
   if(i%2===0){const acc=[1,0,0,1,0,0,1,0][i/2];I.pulse(V,38,t,d16*(acc?1.8:1.2),acc?.1:.055,acc?520:380)}
   if(i===0&&bar%2===0){I.pad(V,c.v,t,d16*34,{cut:1250,vel:.07,att:2.6,vib:7});I.bass(V,c.r,t,d16*31,.16)}
   I.hat(V,t,i%4===2?.012:.005);
   if(bar%8===6&&i===0)I.riser(V,t,d16*32,.05);if(bar%8===0&&bar>0&&i===0)I.boom(V,t,.3)}},
 /* 🎯 danger: 16th ostinato opening up, taiko hits, dissonant strings, riser every 4 bars */
 danger:{bpm:96,rev:.3,lv:0.72,key:2,prog:[C(38,50,51,57),C(38,50,51,56),C(37,49,50,56),C(38,50,53,56)],
  play(s){const{V,t,i,c,d16,bar}=s;const acc=[1,0,1,0,1,0,0,1,1,0,1,0,1,0,1,0][i];
   I.pulse(V,c.r,t,d16*1.1,acc?.085:.045,330+(bar%4)*110);
   if(i===0)I.boom(V,t,.32);if(i===10)I.boom(V,t,.2);if(i===6&&bar%2)I.boom(V,t,.14);
   if(i===0&&bar%2===0)I.pad(V,c.v.concat([c.v[1]+12]),t,d16*34,{cut:1500,vel:.07,att:1.8,vib:9});
   I.hat(V,t,acc?.012:.004);if(bar%4===3&&i===0)I.riser(V,t,d16*16,.06)}},
 /* 📸 chaos/action: driving 8th bass, kick & snare, syncopated string stabs */
 action:{bpm:124,rev:.2,lv:0.87,key:4,prog:[C(40,55,59,64),C(36,55,60,64),C(38,54,57,62),C(35,54,59,62)],
  play(s){const{V,t,i,c,d16,bar}=s;
   if(i%2===0)I.pulse(V,c.r+(i%8===6?12:0),t,d16*1.7,.08,560);
   if(i%4===0)I.kick(V,t,.32);if(i===4||i===12)I.snare(V,t,.1);I.hat(V,t,i%2?.018:.008);
   if([0,3,6,10].includes(i))c.v.forEach(n=>I.pulse(V,n+12,t,d16*1.4,.028,1500));
   if(i===0&&bar%2===0)I.pad(V,c.v.map(n=>n+12),t,d16*32,{cut:2000,vel:.035,att:1});
   if(bar%8===7&&i===0)I.riser(V,t,d16*16,.06)}},
 /* 🖤 dark: low strings, a slow cello line, a cold bell */
 dark:{bpm:54,rev:.45,lv:0.7,key:0,prog:[C(36,55,60,63),C(32,56,60,63),C(29,56,60,65),C(31,55,59,62)],
  cel:[[55,56],[56,55],[53,51],[50,47]],
  play(s){const{V,t,i,c,d16,bar,ci}=s;
   if(i===0){I.pad(V,c.v.map(n=>n-12).concat(c.v),t,d16*18,{cut:800,vel:.08,att:2,vib:5});I.bass(V,c.r,t,d16*15,.18)}
   if(i===0||i===8)I.pad(V,[this.cel[ci][i/8]],t,d16*8.5,{cut:1100,vel:.07,att:.5,vib:9,rel:.8});
   if(bar%2===1&&i===12)I.box(V,c.v[c.v.length-1]+24,t,.03,{dur:3.5})}},
 /* ✨ fantasy: lydian harp arpeggios, celesta, airy strings */
 fantasy:{bpm:70,rev:.5,lv:0.79,key:2,prog:[C(38,54,57,62,64),C(38,56,59,64,66),C(35,54,57,62,64),C(43,54,59,62,66)],
  play(s){const{V,t,i,c,d16,bar}=s;
   if(i%2===0){const up=c.v.concat(c.v.map(n=>n+12));I.harp(V,up[i/2],t,.045,{dur:2})}
   if(i===0){I.pad(V,c.v,t,d16*18,{cut:1900,vel:.055,att:1.8,vib:5});I.bass(V,c.r,t,d16*15,.16)}
   if(bar%2===1&&(i===4||i===12))I.box(V,c.v[c.v.length-1]+12+(i===12?2:0),t,.04)}},
 /* 🌌 drifting space pads with an echoing arpeggio */
 scifi:{bpm:60,rev:.55,lv:0.81,key:0,prog:[C(36,55,59,64,66),C(33,55,59,60,64),C(41,57,59,64,67),C(43,55,60,62,67)],
  play(s){const{V,t,i,c,d16}=s;
   if(i===0){I.pad(V,c.v,t,d16*18,{wave:"triangle",cut:2200,vel:.07,att:3});I.bass(V,c.r,t,d16*15,.15)}
   if([0,3,6,10].includes(i)){const n=c.v[[0,2,1,3][[0,3,6,10].indexOf(i)]]+12;I.box(V,n,t,.04,{dur:1.8});I.box(V,n,t+d16*3,.016,{dur:1.5})}}},
 /* ⚡ sport: anthemic drive */
 sport:{bpm:116,rev:.2,lv:0.93,key:7,prog:[C(43,55,59,62),C(38,54,57,62),C(40,55,59,64),C(36,55,60,64)],
  play(s){const{V,t,i,c,d16,bar}=s;
   if(i%2===0)I.pulse(V,c.r,t,d16*1.6,.08,600);if(i%4===0)I.kick(V,t,.3);if(i===4||i===12)I.snare(V,t,.1);if(i%2===1)I.hat(V,t,.015);
   if([0,6,8,14].includes(i))[c.r+12,c.r+19,c.r+24].forEach(n=>I.pulse(V,n,t,d16*1.5,.03,1700));
   if(i===0&&bar%2===0)I.pad(V,c.v.map(n=>n+12),t,d16*32,{cut:2400,vel:.04,att:1})}},
 /* 🤫 hush: near-silence — one far, high string harmonic and room air. For the moment the music should step back */
 hush:{bpm:40,rev:.7,lv:1.4,key:9,hold:2,prog:[C(45,76),C(45,74)],
  play(s){const{V,t,i,c,d16,bar}=s;if(i===0&&bar%2===0)I.pad(V,c.v,t,d16*34,{wave:"sine",cut:3000,vel:.02,att:5,rel:4,mono:1})}}
};
window.SCORE_MOODS=SC_M;
/* the rest of the app checks BGM_MOODS / BGM_NAME for valid cue names */
if(typeof BGM_MOODS!=="undefined")Object.keys(SC_M).forEach(k=>{if(!BGM_MOODS[k])BGM_MOODS[k]={bpm:SC_M[k].bpm,ch:[[SC_M[k].prog[0].r]],arp:[]}});
if(typeof BGM_NAME!=="undefined")Object.assign(BGM_NAME,{hush:"🤫 静默",night:"🎷 深夜爵士",luxury:"🥂 名利场",memory:"📼 回忆"});

function synthVoice(G,mood){const M=SC_M[mood]||SC_M.warm,V=mkVoice(G,M.rev);V.kind="synth";V.M=M;V.step=0;V.next=G.ctx.currentTime+.08;return V}
function synthSched(V,until){const M=V.M,d16=60/M.bpm/4,spb=M.spb||16,hold=M.hold||1;
 if(V.next<V.G.ctx.currentTime-.25)V.next=V.G.ctx.currentTime+.05;/* woke up after a suspend: don't replay the past */
 while(V.next<until){const i=V.step%spb,bar=Math.floor(V.step/spb),ci=Math.floor(bar/hold)%M.prog.length;
  (typeof soft==="function"?soft:function(n,f){try{return f()}catch(e){}})("app31_score:L223",function(){M.play.call(M,{V,t:V.next,i,bar,ci,c:M.prog[ci],nc:M.prog[(ci+1)%M.prog.length],d16,sw:(i%4===2&&M.sw)?M.sw*d16:0})});
  V.next+=d16;V.step++}}

/* ---------- real files ---------- */
function scFile(mood,wid){const F=window.BGM_FILES||{},c=[wid&&F[wid+"/"+mood],F[mood],wid&&F[wid]].filter(Boolean);return c.find(f=>!SC.bad[f])||null}
function fileVoice(G,src){const c=G.ctx,V=mkVoice(G,0);V.kind="file";V.src=src;V.els=[];V.ix=0;
 V.mk=()=>{const a=new Audio();a.preload="auto";a.src=src;try{const n=c.createMediaElementSource(a),g=c.createGain();n.connect(g);g.connect(V.in);a._n=n;a._g=g}catch(e){a.loop=true;a.volume=.6}
  a.addEventListener("error",()=>scFileFail(V,a));a.addEventListener("ended",()=>{if(V.alive&&V.els[V.ix]===a){a.currentTime=0;a.play().catch(()=>{})}});return a};
 const a=V.mk();V.els.push(a);a.play().catch(()=>{});return V}
function fileLoop(V){const c=V.G.ctx,a=V.els[V.ix];if(!a||!a._g||V.swap||!(a.duration>10)||a.currentTime<a.duration-2.3)return;
 /* seamless loop: a second player starts from the top and crossfades over the last 2 seconds */
 V.swap=1;const j=1-V.ix,b=V.els[j]||(V.els[j]=V.mk()),now=c.currentTime;try{b.currentTime=0}catch(_){}
 b._g.gain.cancelScheduledValues(now);b._g.gain.setValueAtTime(0,now);b._g.gain.linearRampToValueAtTime(1,now+2);a._g.gain.cancelScheduledValues(now);a._g.gain.setValueAtTime(1,now);a._g.gain.linearRampToValueAtTime(0,now+2.1);
 b.play().catch(()=>{});V.ix=j;slog("loop",V.src);setTimeout(()=>{try{a.pause()}catch(_){}V.swap=0},2400)}
function scFileFail(V,a){if(!V.src||SC.bad[V.src])return;SC.bad[V.src]=1;slog("file-fail",V.src);if(V===SC.cur){const m=V.mood,w=V.wid;SC.cur=null;scKill(V,.3);scCue(m,w,1.5)}}

/* ---------- cue control ---------- */
function scInit(){if(SC.G)return true;if(typeof bgmInit!=="function"||!bgmInit())return false;try{SC.G=scGraph(BGM.ctx)}catch(e){return false}
 if(!SC.timer)SC.timer=setInterval(scTick,100);return true}
function scKill(V,sec){if(!V)return;V.alive=false;const c=V.G.ctx,now=c.currentTime,g=V.in.gain;g.cancelScheduledValues(now);g.setValueAtTime(g.value,now);g.linearRampToValueAtTime(0,now+sec);V.end=now+sec;
 setTimeout(()=>{(V.els||[]).forEach(a=>{try{a.pause();a.removeAttribute("src");a.load()}catch(_){}});try{V.in.disconnect()}catch(_){}try{V.sd.disconnect()}catch(_){}SC.voices=SC.voices.filter(x=>x!==V)},sec*1000+400)}
function scXf(from,to){if(/danger|action/.test(to))return .9;if(to==="hush")return 3;if(to==="memory")return 2.6;if(/danger|action/.test(from||""))return 1.6;return 2.2}
function scCue(mood,wid,fade){if(!scInit())return;if(!SC_M[mood])mood=SC_M[bgmMoodOf(wid)]?bgmMoodOf(wid):"warm";
 const src=scFile(mood,wid),cur=SC.cur;
 if(cur&&cur.alive&&(src?cur.src===src:(cur.kind==="synth"&&cur.mood===mood))){cur.mood=mood;BGM.mood=mood;bgmChip();return}
 const xf=fade||(cur?scXf(cur.mood,mood):2.5);if(cur)scKill(cur,xf);
 const V=src?fileVoice(SC.G,src):synthVoice(SC.G,mood);V.mood=mood;V.wid=wid;const c=SC.G.ctx,now=c.currentTime;
 V.in.gain.setValueAtTime(0,now);V.in.gain.linearRampToValueAtTime(src?.9:(SC_M[mood].lv||.9),now+xf);
 SC.cur=V;SC.voices.push(V);BGM.mood=mood;BGM.timer=SC.timer;BGM.file=null;bgmChip();slog("cue",mood,{src:src||"synth",xf})}
function scTick(){const G=SC.G;if(!G)return;const c=G.ctx;
 if(SC.hold&&Date.now()>=SC.hold.until){const h=SC.hold;SC.hold=null;const th=S.threads[curT];const w=(th&&bgmForThread(th))||BGM.want;if(w&&bgmOn()&&BGM.timer)scCue(w.mood,w.wid,2.4)}
 if(SC.narr&&Date.now()>SC.narr){SC.narr=0;bgmGain(bgmLevel(),1.6)}
 if(c.state!=="running")return;const until=c.currentTime+.45;
 SC.voices.forEach(V=>{if(V.kind==="synth"){if(V.alive||c.currentTime<V.end)synthSched(V,Math.min(until,V.alive?until:V.end))}else if(V.alive)fileLoop(V)})}

/* replace the old engine's entry points (same names, so every caller — header button, first tap, plot follow — keeps working) */
bgmPlay=function(mood,wid){BGM.want={mood,wid};if(!bgmOn())return;if(!scInit())return;if(BGM.ctx.state==="suspended")BGM.ctx.resume().catch(()=>{});
 BGM.timer=SC.timer;if(SC.hold)return;/* a scene change is in progress: the new scene's cue is already chosen */
 scCue(mood,wid)};
bgmStop=function(keepWant){if(!keepWant)BGM.want=null;SC.hold=null;if(SC.voices.length)slog("stop",BGM.mood||"");SC.voices.slice().forEach(V=>{if(V.alive)scKill(V,1.6)});SC.cur=null;BGM.mood=null;BGM.timer=null;BGM.file=null};
bgmLevel=function(){return (BGM.duck<1?.35:1)*(SC.narr?.78:1)};
bgmGain=function(v,sec){if(!SC.G)return;const c=SC.G.ctx,g=SC.G.duck.gain,now=c.currentTime;g.cancelScheduledValues(now);g.setValueAtTime(g.value,now);g.linearRampToValueAtTime(v,now+(sec||1))};
bgmTick=function(){};

/* ---------- stingers ---------- */
function stKey(){const M=SC_M[BGM.mood]||{};let k=M.key||0;return k>6?k-12:k}
const STING={
 transition(V,t,k){I.riser(V,t,.9,.035);I.boom(V,t+.9,.16);[48,55,60,64,67].forEach((n,j)=>I.harp(V,n+k+12,t+.9+j*.05,.045,{dur:2.6}));I.pad(V,[48+k,55+k],t+.85,2.8,{cut:800,vel:.06,att:.15,rel:2})},
 reveal(V,t,k){[60,64,67,71,74,76,79,83,86,88].forEach((n,j)=>I.harp(V,n+k,t+j*.045,.03+j*.004,{dur:2.4}));
  [84,88,91].forEach(n=>I.box(V,n+k,t+.45,.045,{dur:3.2}));I.pad(V,[48,60,64,67,71,74].map(n=>n+k),t+.1,3.6,{cut:2600,vel:.1,att:.6,rel:2.2,vib:5});I.boom(V,t+.45,.14)},
 shock(V,t,k){I.boom(V,t,.42);I.noise(V,t,.35,.12,"lowpass",1400,.7);I.pad(V,[49,50,56,62].map(n=>n+k),t,1.6,{cut:2400,vel:.13,att:.01,rel:1.4});I.box(V,86+k,t+.02,.02,{dur:2})},
 heart(V,t,k){I.box(V,76+k,t,.05,{dur:2.4});I.box(V,83+k,t+.24,.045,{dur:2.8});I.pad(V,[52,59,64,68,71].map(n=>n+k),t,3.4,{wave:"triangle",cut:1500,vel:.08,att:.9,rel:2,mono:1});I.heart(V,t+.05,.08)},
 clue(V,t,k){I.box(V,74+k,t,.045,{dur:2.4});I.box(V,80+k,t+.32,.04,{dur:2.6});I.harp(V,38+k,t,.08,{dur:.6,br:2.5})}
};
const ST_GAIN={heart:1.5,clue:2.4};
const ST_PRI={shock:4,reveal:3,heart:3,transition:2,clue:1};
function bedDip(to,hold,back){if(!SC.G)return;const g=SC.G.bed.gain,now=SC.G.ctx.currentTime;g.cancelScheduledValues(now);g.setValueAtTime(g.value,now);g.linearRampToValueAtTime(to,now+.08);g.setValueAtTime(to,now+hold);g.linearRampToValueAtTime(1,now+hold+back)}
function sting(kind,why){if(!bgmOn()||!STING[kind]||!SC.G||!BGM.timer)return;const c=SC.G.ctx;if(c.state!=="running")return;
 const now=Date.now();
 /* a hit that comes right after a scene change lands as the curtain lifts, not on top of the transition */
 if(kind!=="transition"&&now-(SC.lastTrans||0)<1600){const w=1700-(now-SC.lastTrans);setTimeout(()=>sting(kind,why),w);SC.lastTrans=0;return}
 if(kind==="transition")SC.lastTrans=now;if(now-SC.lastSting<1100&&(ST_PRI[kind]||0)<=(SC.lastPri||0))return;SC.lastSting=now;SC.lastPri=ST_PRI[kind]||0;
 const F=window.BGM_FILES||{},wid=((S.threads||{})[curT]||{}).wid,f=F[wid+"/sting/"+kind]||F["sting/"+kind];if(f&&!SC.bad[f]){try{const a=new Audio(f);const n=c.createMediaElementSource(a);n.connect(SC.G.sting);a.addEventListener("error",()=>{SC.bad[f]=1});a.play().catch(()=>{});setTimeout(()=>{try{n.disconnect()}catch(_){}},9000)}catch(_){}}
 else{
 const V=mkVoice(SC.G,.45,SC.G.sting);V.in.gain.value=.9*(ST_GAIN[kind]||1);try{STING[kind](V,c.currentTime+.03,stKey())}catch(e){}
 setTimeout(()=>{try{V.in.disconnect();V.sd.disconnect()}catch(_){}},7000);}
 if(kind==="shock")bedDip(.3,1.2,2.4);else if(kind==="reveal")bedDip(.55,1.5,2);else if(kind==="heart")bedDip(.7,1,2);
 slog("sting",kind,why?{why}:null)}
window.scoreSting=sting;
const EV_STING={"💥":"shock","⚡":"shock","☠":"shock","🖤":"shock","🎙":"shock","⚠":"shock","💞":"heart","🔑":"heart","🔥":"heart","🔓":"heart","🗝":"reveal","🎯":"reveal","🤝":"reveal","🔎":"clue","🔒":"clue","🖋":"clue","🔔":"clue","🛡":"clue"};

/* ---------- scene change: fade out → transition stinger → the next scene's cue fades in ---------- */
function nextCue(th){const q=(th.pk&&th.pk.q)||[];for(let i=0;i<Math.min(q.length,10);i++){const b=q[i];if(!Array.isArray(b)||b[0]!=="sys")break;if(b[1]==="scene")break;if(b[1]==="bgm")return (b[2]||{}).m||null}return null}
function scScene(th,d){if(!bgmOn()||!SC.G||!BGM.timer)return;const lock=nextCue(th);if(lock&&BGM_MOODS[lock])th.pk.bgm=lock;
 const old=SC.cur,nxt=lock||(bgmForThread(th)||{}).mood;
 if(old&&old.alive&&old.mood===nxt){bedDip(.4,1.3,1.6);sting("transition",(d&&(Lz(d.place)||d.place))||"");slog("scene",(d&&(Lz(d.place)||d.place))||"",{from:old.mood,next:nxt,keep:1});return}
 if(old){scKill(old,1.4);SC.cur=null}sting("transition",(d&&(Lz(d.place)||d.place))||"");
 SC.hold={until:Date.now()+1700,lock};slog("scene",(d&&(Lz(d.place)||d.place))||"",{from:old&&old.mood,next:lock||(bgmForThread(th)||{}).mood})}
PKREG.add("app31_score.js", function(th,b, next){const sys=Array.isArray(b)&&b[0]==="sys"?b[1]:null,d=(sys&&b[2])||{},hadScene=sys==="scene"&&th.msgs.some(m=>m.k==="scene");
 const r=next.apply(this,arguments);
 try{if(r&&sys&&curT===th.id&&!PKSKIP[th.id]&&bgmOn()){
  if(sys==="scene"&&hadScene)scScene(th,d);
  else if(sys==="title")sting("reveal","title");
  else if(sys==="money"&&S.plus)sting("reveal","money");
  else if(sys==="event"){const k=EV_STING[String(d.icon||"").replace(/️/g,"")];if(k)sting(k,d.title&&(Lz(d.title)||d.title));
   if(d.icon==="🔇")bedDip(.08,3.5,2.5)}}}catch(e){}
 return r});;
/* the sealed inheritance number: the reveal plays when it opens */
document.addEventListener("click",e=>{const x=e.target.closest("[data-xmopen]");if(!x)return;const th=S.threads[curT],i=+x.dataset.xmopen;setTimeout(()=>{const m=th&&th.msgs[i];if(m&&m.open)sting("reveal","money")},60)});
/* intimate choices: flirt / bold / kiss / soft / tease → heart; a kiss also pulls the score down to almost nothing for a moment */
const HEART_ATT={flirt:1,bold:1,kiss:1,soft:1,tease:1};
document.addEventListener("click",e=>{const x=e.target.closest("[data-stopline]");if(!x)return;const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop||th.pk.stop[1]!=="line")return;
 try{const o=th.pk.stop[2].opts[+x.dataset.stopline];if(!o)return;const k=typeof attOf==="function"?attOf(th,o):o.att;if(HEART_ATT[k]){sting("heart",k);if(k==="kiss")bedDip(.12,4,3)}}catch(_){}},true);

/* ---------- narration duck: a long narration block lowers the score a little while you read it ---------- */
const _pkAppend31=pkAppend;
pkAppend=function(th,m){const r=_pkAppend31.apply(this,arguments);
 try{if(m&&m.who!=="me"&&(m.who==="n"||m.k==="act"||m.k==="think")&&curT===th.id&&!PKSKIP[th.id]&&SC.G&&BGM.timer){const zh=S.lang==="zh"||S.lang==="ja",n=String(m.txt||"").length;
  if(n>=(zh?45:120)){const was=SC.narr;SC.narr=Date.now()+Math.min(12000,n*(zh?170:55));if(!was)bgmGain(bgmLevel(),.9)}}}catch(_){}
 return r};

/* 2026-10-27：从「包 renderChat」搬成钩子（批量迁移）。逻辑原样，只是不再包住渲染器。 */
const __body_score31 = function () { try{if(bgmOn()&&!BGM.timer&&!BGM.ctx&&S.threads[curT]&&typeof bgmInit==="function"&&bgmInit()&&BGM.ctx.state==="running"){const w=bgmForThread(S.threads[curT]);if(w)bgmPlay(w.mood,w.wid)}}catch(_){} };
if (window.UI && typeof window.UI.add === "function") window.UI.add("score31", __body_score31);
else { const _renderChat31 = renderChat; renderChat = function () { const r = _renderChat31.apply(this, arguments); __body_score31(); return r; }; };
/* files keep playing in a hidden tab unless paused */
document.addEventListener("visibilitychange",()=>{SC.voices.forEach(V=>{if(V.kind!=="file"||!V.alive)return;const a=V.els[V.ix];if(!a)return;if(document.hidden)a.pause();else a.play().catch(()=>{})})});

/* ---------- test helper: render a cue/stinger offline and measure it ---------- */
window.__scoreRender=async function(name,sec,isSting){sec=sec||12;const oc=new OfflineAudioContext(2,44100*sec,44100),G=scGraph(oc);
 if(isSting){const V=mkVoice(G,.45,G.sting);V.in.gain.value=.9*(ST_GAIN[name]||1);STING[name](V,.05,0)}
 else{const V=synthVoice(G,name);V.in.gain.value=SC_M[name].lv||.9;V.next=.05;synthSched(V,sec-.1)}
 const buf=await oc.startRendering();let pk=0,ss=0,n=0;for(let ch=0;ch<2;ch++){const d=buf.getChannelData(ch);for(let i=0;i<d.length;i++){const v=Math.abs(d[i]);if(v>pk)pk=v;ss+=d[i]*d[i];n++}}
 const db=x=>+(20*Math.log10(x||1e-9)).toFixed(1);return {name,peak:db(pk),rms:db(Math.sqrt(ss/n))}};
window.__scoreState=()=>({cur:SC.cur&&SC.cur.mood,src:SC.cur&&(SC.cur.src||"synth"),voices:SC.voices.length,hold:!!SC.hold,narr:!!SC.narr,ctx:BGM.ctx&&BGM.ctx.state});
window.__SC={SC_M,I,C,SC,init:scInit};
})();
