/* ================= v5.4 · DOUBAO END-TO-END REALTIME VOICE CALLS =================
   When the relay is configured (Vercel DOUBAO_RELAY_URL + DOUBAO_RELAY_SECRET), calls in Chinese / English go through
   Doubao's end-to-end realtime voice model: the mic streams continuously, Doubao hears, thinks and answers in one model,
   you can talk over him (barge-in), and his voice starts within ~1s. Other languages, or any failure → Qwen-Omni (app81).
   Protocol: binary frames over wss — [0x11, type<<4|flags, ser<<4|comp, 0] + event(int32) + [sid] + size + payload. */
const DB93={cfg:null,at:0,fail:0};
const DBE={START_CONN:1,FIN_CONN:2,START_SES:100,FIN_SES:102,AUDIO:200,HELLO:300,TEXT:501,
 CONN_OK:50,CONN_FAIL:51,SES_OK:150,SES_END:152,SES_FAIL:153,TTS_START:350,TTS_AUDIO:352,TTS_END:359,ASR_INFO:450,ASR:451,ASR_END:459,CHAT:550,CHAT_END:559,ERR:599};
async function db93Cfg(){if(DB93.cfg&&Date.now()-DB93.at<5*60e3)return DB93.cfg;
 if(typeof CLOUD_EP==="undefined"||!CLOUD_EP||!VC.ep)return null;
 try{const r=await fetch(VC.ep+"?doubao=1",{headers:cloudAuth()});const j=await r.json();DB93.cfg=j&&j.url?j:null;DB93.at=Date.now();return DB93.cfg}catch(_){return null}}
function db93Want(){if(!call)return Promise.resolve(null);if(call.dbP)return call.dbP;
 call.dbP=(async()=>{if(S.callVoice==="off"||DB93.fail>=2||!window.WebSocket)return null;const c=await db93Cfg();
  if(!c||!(c.langs||[]).includes(vcLang()))return null;return c})();return call.dbP}
/* ---------- frames ---------- */
const DB_TE=new TextEncoder(),DB_TD=new TextDecoder();
function dbFrame(type,ser,comp,ev,sid,payload){const s=sid?DB_TE.encode(sid):null,p=payload||new Uint8Array(0);
 const b=new Uint8Array(8+(s?4+s.length:0)+4+p.length),v=new DataView(b.buffer);b.set([0x11,(type<<4)|4,(ser<<4)|comp,0]);v.setInt32(4,ev);let o=8;
 if(s){v.setUint32(o,s.length);o+=4;b.set(s,o);o+=s.length}v.setUint32(o,p.length);o+=4;b.set(p,o);return b}
const DB_NOSID=[1,2,50,51,52];
function dbJSON(ev,sid,obj){return dbFrame(1,1,0,ev,DB_NOSID.includes(ev)?null:sid,DB_TE.encode(JSON.stringify(obj||{})))}
async function dbGz(u8){if(typeof CompressionStream==="undefined")return null;const cs=new CompressionStream("gzip");const w=cs.writable.getWriter();w.write(u8);w.close();return new Uint8Array(await new Response(cs.readable).arrayBuffer())}
async function dbGunzip(u8){const ds=new DecompressionStream("gzip");const w=ds.writable.getWriter();w.write(u8);w.close();return new Uint8Array(await new Response(ds.readable).arrayBuffer())}
async function dbParse(buf){const d=new Uint8Array(buf),v=new DataView(d.buffer,d.byteOffset,d.byteLength);if(d.length<4)return null;
 const hs=(d[0]&15)*4,f={type:d[1]>>4,flags:d[1]&15,ser:d[2]>>4,comp:d[2]&15};let o=hs;if(f.flags&3)o+=4;
 if(f.type===15){f.code=v.getUint32(o);o+=4;const n=v.getUint32(o);o+=4;f.raw=d.subarray(o,o+n)}
 else{if(f.flags&4){f.ev=v.getInt32(o);o+=4;if(!DB_NOSID.includes(f.ev)||f.type===11){const n=v.getUint32(o);o+=4;f.sid=DB_TD.decode(d.subarray(o,o+n));o+=n}}
  const n=v.getUint32(o);o+=4;f.raw=d.subarray(o,o+n)}
 if(f.comp===1&&f.raw.length)f.raw=await dbGunzip(f.raw);
 if(f.ser===1||f.type===15){try{f.json=JSON.parse(DB_TD.decode(f.raw))}catch(_){f.json=null}}return f}
/* ---------- voice + persona ---------- */
function dbSpeaker(c){const v=ttsVoice(call.cid)||"m1",ch2=ch(call.cid)||{},fem=/^f/.test(v)||ch2.g==="f",S2=c.speakers||{},en=vcLang()==="en";
 const L=(en?(fem?S2.en_f:S2.en_m):null)||(fem?S2.f:S2.m)||["zh_male_yunzhou_jupiter_bigtts"];const k=parseInt(v.slice(1),10)||1;return L[(k-1)%L.length]}
function dbSession(c){const cc=ch(call.cid)||{n:"Him"},sys=String(vcSys(cc,call.th)).slice(0,3800),sc=String(c.model||"").startsWith("2.");
 const style=vcLang()==="zh"?"像深夜打电话：一到三句，短、自然、带停顿，有点克制；不念旁白、不描述动作。":"Like a late-night phone call: one to three short, natural sentences, a little guarded. No narration, no stage directions.";
 const dialog=sc?{character_manifest:sys+"\n\n"+style,extra:{strict_audit:false,input_mod:"audio",model:c.model}}
  :{bot_name:String(cc.n||"").slice(0,20),system_role:sys,speaking_style:style,extra:{strict_audit:false,input_mod:"audio",model:c.model||"1.2.1.1"}};
 return {asr:{audio_info:{format:"pcm",sample_rate:16000,channel:1},extra:{end_smooth_window_ms:900}},tts:{speaker:dbSpeaker(c),audio_config:{channel:1,format:"pcm_s16le",sample_rate:24000}},dialog}}
/* ---------- the session ---------- */
function dbOpen(first){return new Promise(async res=>{const c=await db93Want();if(!c||!call)return res(false);let done=false;const fin=ok=>{if(!done){done=true;res(ok)}};
 const D={sid:(crypto.randomUUID?crypto.randomUUID():String(Date.now())+Math.random().toString(16).slice(2)),ready:false,said:"",heard:"",turnOpen:false,q:Promise.resolve()};
 let ws;try{ws=new WebSocket(c.url)}catch(_){DB93.fail++;return fin(false)}ws.binaryType="arraybuffer";D.ws=ws;call.db=D;const me0=call;
 const to=setTimeout(()=>{if(!D.ready){DB93.fail++;try{ws.close()}catch(_){}fin(false)}},8000);
 ws.onopen=()=>ws.send(dbJSON(DBE.START_CONN,null,{}));
 ws.onerror=()=>{if(!D.ready){DB93.fail++;clearTimeout(to);fin(false)}};
 ws.onclose=()=>{clearTimeout(to);if(!D.ready)return fin(false);if(call===me0&&call.db===D&&!D.bye)dbLost()};
 ws.onmessage=e=>{D.q=D.q.then(()=>dbParse(e.data)).then(f=>{if(!f||call!==me0)return;dbOn(D,f,()=>{clearTimeout(to);D.ready=true;DB93.fail=0;VC.ok=true;
   ws.send(dbJSON(DBE.TEXT,D.sid,{content:first||vcT("first")}));fin(true)},()=>{clearTimeout(to);DB93.fail++;fin(false)})}).catch(()=>{})};
 D.start=()=>ws.send(dbJSON(DBE.START_SES,D.sid,dbSession(c)))})}
function dbOn(D,f,ok,bad){const j=f.json||{},line=$("#cvL");
 if(f.type===15||f.ev===DBE.CONN_FAIL||f.ev===DBE.SES_FAIL||f.ev===DBE.ERR){try{console.warn("[doubao]",f.code||f.ev,j)}catch(_){}if(!D.ready)bad();else if(f.ev===DBE.ERR)return;else{D.bye=1;try{D.ws.close()}catch(_){}dbLost()}return}
 if(f.ev===DBE.CONN_OK){D.start();return}
 if(f.ev===DBE.SES_OK){ok();return}
 if(f.type===11&&f.raw&&f.raw.length){dbPlay(f.raw);return}
 if(f.ev===DBE.ASR_INFO){vcHush();D.said="";D.turnOpen=false;return}           /* you started talking: he stops */
 if(f.ev===DBE.ASR){const r=j.results&&j.results[0];if(r&&r.text){D.heard=r.text;dbShowYou(r.text)}return}
 if(f.ev===DBE.ASR_END){if(D.heard){call.vh=call.vh||[];call.vh.push({role:"user",text:D.heard});D.heard=""}return}
 if(f.ev===DBE.CHAT){if(!D.turnOpen){D.turnOpen=true;D.said=""}D.said+=(j.content||"");if(line)line.textContent=D.said;return}
 if(f.ev===DBE.CHAT_END||f.ev===DBE.TTS_END){if(D.turnOpen)dbTurnDone(D);return}}
function dbTurnDone(D){D.turnOpen=false;const said=D.said.trim();if(!said)return;call.vh=call.vh||[];call.vh.push({role:"assistant",text:said});call.last=said;call.n++;(call.lines=call.lines||[]).push(said);
 const X=call.script;if(X){X.i++;if(X.i>=X.max){const me0=call,wait=setInterval(()=>{if(call!==me0||call.script!==X){clearInterval(wait);return}if(!vcTalkingNow()){clearInterval(wait);setTimeout(()=>{if(call===me0)endCall()},900)}},300)}}
 vcHint()}
function dbShowYou(t){const rep=$("#cvR");if(!rep)return;let p=rep.querySelector(".vc93u");if(!p){rep.insertAdjacentHTML("afterbegin",'<p class="vc93u"></p>');p=rep.querySelector(".vc93u")}p.textContent=(vcLang()==="zh"?"你：":"You: ")+t}
function dbPlay(u8){const ctx=vcCtx();if(!ctx||!call)return;const n=u8.length>>1;if(!n)return;const dv=new DataView(u8.buffer,u8.byteOffset,n*2),f=new Float32Array(n);
 for(let i=0;i<n;i++)f[i]=dv.getInt16(i*2,true)/32768;const buf=ctx.createBuffer(1,n,24000);buf.getChannelData(0).set(f);const src=ctx.createBufferSource();src.buffer=buf;src.connect(ctx.destination);
 const t=Math.max(ctx.currentTime+.05,call.vNext||0);src.start(t);call.vNext=t+buf.duration;(call.vSrc=call.vSrc||[]).push(src);if(call.vSrc.length>400)call.vSrc.splice(0,200);call.talking=true;const w=$("#cvW");w&&w.classList.add("on");
 clearTimeout(call.dbTk);call.dbTk=setTimeout(function k(){if(!call)return;if(vcTalkingNow()){call.dbTk=setTimeout(k,200);return}call.talking=false;const w2=$("#cvW");w2&&w2.classList.remove("on")},300)}
/* ---------- mic: continuous 16 kHz PCM, ~100 ms per frame ---------- */
async function dbMic(){if(!call||call.mic||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return;
 try{const st=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});if(!call){st.getTracks().forEach(t=>t.stop());return}
  const ctx=vcCtx();const src=ctx.createMediaStreamSource(st),pr=ctx.createScriptProcessor(2048,1,1),mute=ctx.createGain();mute.gain.value=0;const ratio=ctx.sampleRate/16000;let acc=[],accN=0,frac=0;
  pr.onaudioprocess=e=>{const D=call&&call.db;if(!D||!D.ready||D.ws.readyState!==1)return;const x=e.inputBuffer.getChannelData(0);
   const muted=!!document.querySelector("[data-cvmute].on");let s=0;for(let i=0;i<x.length;i+=4)s+=x[i]*x[i];const rms=Math.sqrt(s/(x.length/4));
   const quiet=muted||(vcTalkingNow()&&rms<.06);           /* his own voice leaking back must not interrupt him; a real voice still can */
   const n=Math.floor((x.length-frac)/ratio),o=new Int16Array(n);for(let i=0;i<n;i++){const v=quiet?0:x[Math.min(x.length-1,Math.floor(frac+i*ratio))];o[i]=Math.max(-1,Math.min(1,v))*32767}
   frac=(frac+n*ratio)-x.length;if(frac<0)frac=0;acc.push(o);accN+=n;
   if(accN>=1600){const all=new Int16Array(accN);let k=0;acc.forEach(a=>{all.set(a,k);k+=a.length});acc=[];accN=0;const raw=new Uint8Array(all.buffer);
    dbGz(raw).then(gz=>{if(D.ws.readyState===1)D.ws.send(gz?dbFrame(2,0,1,DBE.AUDIO,D.sid,gz):dbFrame(2,0,0,DBE.AUDIO,D.sid,raw))})}};
  src.connect(pr);pr.connect(mute);mute.connect(ctx.destination);call.mic={st,src,pr,mute};call.micOn=true;vcHint();
 }catch(e){call&&(call.micOn=false);toast(vcT("nomic"))}}
/* the relay dropped mid-call: carry on with Qwen-Omni (turn-based) */
function dbLost(){if(!call)return;call.db=null;call.dbP=Promise.resolve(null);DB93.fail++;if(call.mic&&call.mic.db93){vcMicOff();_vcMic93()}vcFallbackNote();vcHint()}
function dbBye(){const D=call&&call.db;if(!D)return;D.bye=1;try{if(D.ws.readyState===1){D.ws.send(dbJSON(DBE.FIN_SES,D.sid,{}));D.ws.send(dbJSON(DBE.FIN_CONN,null,{}))}}catch(_){}setTimeout(()=>{try{D.ws.close()}catch(_){}},300);call.db=null}
/* ---------- hook into the call (app81 / app88) ---------- */
const _vcTurn93=vcTurn;
vcTurn=async function(turn){if(!call)return false;const c=await db93Want();if(!c||!call)return _vcTurn93(turn);
 const D=call.db;if(D&&D.ready){if(turn&&turn.text){vcHush();D.ws.send(dbJSON(DBE.TEXT,D.sid,{content:turn.text}))}return true}
 if(D===null&&call.dbTried)return _vcTurn93(turn);
 if(call.dbOpening)return true;call.dbOpening=true;call.dbTried=true;const line=$("#cvL");if(line)line.textContent="…";
 const ok=await dbOpen(turn&&turn.text);if(call)call.dbOpening=false;if(ok)return true;if(call){call.db=null;call.dbP=Promise.resolve(null)}
 if(call&&call.mic&&call.mic.db93){vcMicOff()}if(call&&!call.mic)_vcMic93();return _vcTurn93(turn)};
const _vcMic93=vcMic;
vcMic=async function(){if(!call)return;const c=await db93Want();if(!call)return;if(!c)return _vcMic93();await dbMic();if(call&&call.mic)call.mic.db93=1};
const _vcHint93=vcHint;vcHint=function(){_vcHint93();if(call&&call.db&&call.db.ready){const p=$("#cvR .vc-hint");if(p)p.textContent=call.micOn?(vcLang()==="zh"?"🎙 直接说话，随时可以打断他":"🎙 Just talk — you can cut in anytime"):p.textContent}};
const _endCall93=endCall;endCall=function(){try{dbBye()}catch(_){}return _endCall93.apply(this,arguments)};
(function(){const st=document.createElement("style");st.textContent=`.vc93u{width:100%;text-align:center;opacity:.6;font-size:12.5px;margin:0 0 4px;color:#F6D3AE;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}`;document.head.appendChild(st)})();
