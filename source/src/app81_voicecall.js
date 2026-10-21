/* ================= v3.5 · VOICE CALLS — talk to him out loud (Qwen-Omni via POST /api/tts {omni}) =================
   · Hands-free: the mic listens, a simple voice detector cuts each thing you say (≤12s), it goes to Qwen-Omni as audio,
     and his answer streams back as speech (PCM 24 kHz) + the words, played as it arrives — ~1–3s per turn.
   · Half-duplex with barge-in: while he talks the mic only listens for you talking over him (then he stops).
   · Like a real call: no reply options on screen — you just talk. Mute = mic off.
   · If the voice model isn't reachable (no key / network), the old call flow (text model + TTS) carries on unchanged. */
const VC={ok:null,ep:typeof TTS_EP!=="undefined"?TTS_EP:""};
function vcLang(){const l=typeof CL==="function"?CL():S.lang;return ["zh","en","ja","ko","es"].includes(l)?l:"en"}
const VC_LN={zh:"Simplified Chinese (Mandarin)",en:"English",ja:"Japanese",ko:"Korean",es:"Spanish"};
const VC_T={zh:{first:"（电话接通了。是你打给对方的——先开口，说你为什么这么晚打来，但别一次说完。）",earlier:"（对方之前说了几句）",talk:"🎙 直接说话就行",tap:"开启麦克风就能直接和他说话",mic:"开启麦克风",listen:"……（在听）",nomic:"没拿到麦克风权限——请在浏览器里允许麦克风",down:"语音通话暂时连不上，先用文字回复",o:["嗯，我在听。","你怎么了？","我也想你。","别挂。","说清楚一点。"]},
 en:{first:"(The call connects. You called them — speak first: say why you're calling this late, but not all of it.)",earlier:"(they said something earlier)",talk:"🎙 Just talk",tap:"Turn on your mic to talk to him",mic:"Turn on mic",listen:"…(listening)",nomic:"No mic permission — allow the microphone in your browser",down:"Voice call unavailable right now — tap a reply instead",o:["I'm listening.","What's wrong?","I missed you too.","Don't hang up.","Say it properly."]},
 ja:{first:"（電話がつながった。かけたのはあなた。先に話して——こんな遅くにかけた理由を、でも全部は言わないで。）",earlier:"（相手が前に何か言った）",talk:"🎙 そのまま話してね",tap:"マイクをオンにすると話せます",mic:"マイクをオン",listen:"……（聞いてる）",nomic:"マイクが使えません——ブラウザでマイクを許可してね",down:"音声通話につながりません——文字で返事してね",o:["うん、聞いてる。","どうしたの？","私も会いたかった。","切らないで。","ちゃんと言って。"]},
 ko:{first:"(전화가 연결됐다. 건 사람은 너야. 먼저 말해 — 왜 이렇게 늦게 전화했는지, 하지만 다 말하진 마.)",earlier:"(상대가 아까 뭔가 말했다)",talk:"🎙 그냥 말하면 돼요",tap:"마이크를 켜면 바로 대화할 수 있어요",mic:"마이크 켜기",listen:"……(듣는 중)",nomic:"마이크 권한이 없어요 — 브라우저에서 마이크를 허용해 주세요",down:"지금은 음성 통화가 안 돼요 — 문장으로 대답하세요",o:["응, 듣고 있어.","무슨 일이야?","나도 보고 싶었어.","끊지 마.","제대로 말해 봐."]},
 es:{first:"(La llamada se conecta. Llamaste tú: habla primero, di por qué llamas tan tarde, pero no lo digas todo.)",earlier:"(dijo algo antes)",talk:"🎙 Solo habla",tap:"Activa el micrófono para hablar con él",mic:"Activar micrófono",listen:"…(escuchando)",nomic:"Sin permiso de micrófono: permítelo en el navegador",down:"La llamada de voz no está disponible: responde con una frase",o:["Te escucho.","¿Qué te pasa?","Yo también te extrañé.","No cuelgues.","Dilo bien."]}};
function vcT(k){return (VC_T[vcLang()]||VC_T.en)[k]}
function vcSys(c,th){const zh=vcLang()==="zh",L=[];
 L.push("You are "+c.n+(c.vibe?" ("+Lz(c.vibe)+")":"")+", on a private phone call with "+(me()||"the user")+". This is a voice call: everything you output is spoken aloud by your own voice.");
 if(c.bio)L.push("WHO YOU ARE: "+String(Lz(c.bio)).slice(0,600));
 try{if(th&&th.sum&&th.sum.t)L.push("STORY SO FAR: "+String(th.sum.t).slice(0,1200))}catch(_){}
 try{if(th&&typeof memBlock==="function")L.push(String(memBlock(th)).slice(0,1800))}catch(_){}
 try{if(th){const last=th.msgs.filter(m=>m.k==="say"&&m.txt).slice(-8).map(m=>(m.who==="me"?(me()||"User"):(ch(m.who)?ch(m.who).n:m.who))+": "+String(m.txt).slice(0,160));if(last.length)L.push("LAST THINGS SAID IN THE STORY:\n"+last.join("\n"))}}catch(_){}
 L.push("HOW TO TALK: stay fully in character. Speak like a real late-night phone call — 1 to 3 short sentences, natural pauses, contractions, a little guarded. No narration, no stage directions, no actions in brackets, no emoji, no lists. React to what they actually said (you hear their voice — tone matters). Ask something back sometimes. Never say you are an AI or a model. Keep it PG-13: tender and charged is fine, nothing explicit; if they push past that, deflect in character.");
 L.push("Speak "+VC_LN[vcLang()]+" only.");return L.join("\n\n")}
/* ---------- audio out: schedule PCM16 chunks ---------- */
function vcCtx(){if(!VC.ctx||VC.ctx.state==="closed"){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;VC.ctx=new A()}if(VC.ctx.state==="suspended")VC.ctx.resume().catch(()=>{});return VC.ctx}
function vcPlay(b64){const ctx=vcCtx();if(!ctx||!call)return;const bin=atob(b64),n=bin.length>>1;if(!n)return;const f=new Float32Array(n);
 for(let i=0;i<n;i++){let v=bin.charCodeAt(2*i)|(bin.charCodeAt(2*i+1)<<8);if(v>32767)v-=65536;f[i]=v/32768}
 const buf=ctx.createBuffer(1,n,24000);buf.copyToChannel?buf.copyToChannel(f,0):buf.getChannelData(0).set(f);const src=ctx.createBufferSource();src.buffer=buf;src.connect(ctx.destination);
 const t=Math.max(ctx.currentTime+.06,call.vNext||0);src.start(t);call.vNext=t+buf.duration;(call.vSrc=call.vSrc||[]).push(src);call.talking=true;const w=$("#cvW");w&&w.classList.add("on")}
function vcHush(){if(!call)return;(call.vSrc||[]).forEach(s=>{try{s.stop()}catch(_){}});call.vSrc=[];call.vNext=0;call.talking=false;if(call.vAbort){try{call.vAbort.abort()}catch(_){}}const w=$("#cvW");w&&w.classList.remove("on")}
function vcTalkingNow(){return !!(call&&(call.busy||(VC.ctx&&call.vNext&&VC.ctx.currentTime<call.vNext-.05)))}
/* ---------- one turn ---------- */
async function vcTurn(turn){if(!call||!VC.ep)return false;const c=ch(call.cid),line=$("#cvL"),rep=$("#cvR");vcHush();
 call.vh=call.vh||[];call.vh.push(turn);
 const hist=call.vh.slice(-10).map((m,i,a)=>m.audio&&a.length-i>3?{role:"user",text:vcT("earlier")}:m);
 const ctl=new AbortController();call.vAbort=ctl;call.busy=true;const my=(call.vSeq=(call.vSeq||0)+1);
 if(rep)rep.innerHTML="";if(line)line.textContent="…";let said="",gotAudio=false;
 try{const r=await fetch(VC.ep,{method:"POST",headers:{"Content-Type":"application/json"},signal:ctl.signal,body:JSON.stringify({omni:{voice:ttsVoice(call.cid),sys:vcSys(c,call.th),msgs:hist,max:260}})});
  if(!r.ok||!r.body)throw new Error("omni "+r.status);
  const rd=r.body.getReader(),dec=new TextDecoder();let buf="";
  for(;;){const {done,value}=await rd.read();if(done)break;buf+=dec.decode(value,{stream:true});let k;
   while((k=buf.indexOf("\n"))>=0){const ln=buf.slice(0,k).trim();buf=buf.slice(k+1);if(!ln.startsWith("data:"))continue;const d=ln.slice(5).trim();if(d==="[DONE]")continue;
    let j;try{j=JSON.parse(d)}catch(_){continue}const dl=j.choices&&j.choices[0]&&j.choices[0].delta;if(!dl||call.vSeq!==my)continue;
    if(dl.audio&&dl.audio.data){vcPlay(dl.audio.data);gotAudio=true}
    const tx=(typeof dl.content==="string"&&dl.content)||(dl.audio&&dl.audio.transcript)||"";if(tx){said+=tx;if(line)line.textContent=said}}}
 }catch(e){call&&(call.busy=false);if(e&&e.name==="AbortError")return true;call&&call.vh.pop();VC.ok=false;return false}
 if(!call||call.vSeq!==my)return true;call.busy=false;
 if(!gotAudio&&!said){call.vh.pop();VC.ok=false;return false}
 VC.ok=true;said=said.trim();call.vh.push({role:"assistant",text:said});call.last=said||call.last;call.n++;(call.lines=call.lines||[]).push(said);
 if(!gotAudio&&said)speak(said,call.cid);
 vcHint();
 const w=$("#cvW");const tk=setInterval(()=>{if(!call||!vcTalkingNow()){clearInterval(tk);w&&w.classList.remove("on");if(call)call.talking=false}},200);
 return true}
/* ---------- mic + voice detector ---------- */
function vcWav(f32,rate){const out=16000,ratio=rate/out,n=Math.floor(f32.length/ratio),b=new ArrayBuffer(44+n*2),v=new DataView(b);
 const W=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))};W(0,"RIFF");v.setUint32(4,36+n*2,true);W(8,"WAVE");W(12,"fmt ");v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);
 v.setUint32(24,out,true);v.setUint32(28,out*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);W(36,"data");v.setUint32(40,n*2,true);
 for(let i=0;i<n;i++){let s=0,c=0;for(let j=Math.floor(i*ratio);j<Math.floor((i+1)*ratio)&&j<f32.length;j++){s+=f32[j];c++}s=c?s/c:0;s=Math.max(-1,Math.min(1,s));v.setInt16(44+i*2,s<0?s*32768:s*32767,true)}
 let bin="";const u=new Uint8Array(b);for(let i=0;i<u.length;i+=32768)bin+=String.fromCharCode.apply(null,u.subarray(i,i+32768));return btoa(bin)}
async function vcMic(){if(!call||call.mic||!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)return;
 try{const st=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});if(!call){st.getTracks().forEach(t=>t.stop());return}
  const ctx=vcCtx();if(!ctx){st.getTracks().forEach(t=>t.stop());return}const src=ctx.createMediaStreamSource(st),pr=ctx.createScriptProcessor(4096,1,1),mute=ctx.createGain();mute.gain.value=0;
  const fr=4096/ctx.sampleRate,V={floor:.01,on:false,loud:0,quiet:0,chunks:[],pre:[]};
  pr.onaudioprocess=e=>{if(!call)return;const x=e.inputBuffer.getChannelData(0);let s=0;for(let i=0;i<x.length;i+=4)s+=x[i]*x[i];const rms=Math.sqrt(s/(x.length/4));
   const muted=!!document.querySelector("[data-cvmute].on");if(muted){V.on=false;V.chunks=[];return}
   const thr=Math.max(.018,V.floor*3),talking=vcTalkingNow(),hot=rms>(talking?thr*2.6:thr);
   if(!V.on){V.floor=V.floor*.95+Math.min(rms,.05)*.05;V.pre.push(new Float32Array(x));if(V.pre.length>3)V.pre.shift();
    V.loud=hot?V.loud+1:0;if(V.loud>=(talking?3:2)){V.on=true;V.quiet=0;V.chunks=V.pre.slice();V.pre=[];if(talking)vcHush();const l=$("#cvL");if(l&&!call.busy)l.textContent=vcT("listen")}}
   else{V.chunks.push(new Float32Array(x));V.quiet=rms<thr*.8?V.quiet+1:0;const dur=V.chunks.length*fr;
    if(V.quiet*fr>=.8||dur>=12){V.on=false;const speech=dur-V.quiet*fr;const ch2=V.chunks;V.chunks=[];if(speech<.35)return;
     const all=new Float32Array(ch2.reduce((n,a)=>n+a.length,0));let o=0;ch2.forEach(a=>{all.set(a,o);o+=a.length});
     if(VC.ok===false)return;const wav=vcWav(all,ctx.sampleRate);vcTurn({role:"user",audio:wav}).then(ok=>{if(!ok)vcFallbackNote()})}}};
  src.connect(pr);pr.connect(mute);mute.connect(ctx.destination);call.mic={st,src,pr,mute};call.micOn=true;
  vcHint();
 }catch(e){call&&(call.micOn=false);toast(vcT("nomic"))}}
/* like a real call: no reply options — just a status line (and a mic button if the mic is off) */
function vcHint(){const rep=$("#cvR");if(!rep||!call)return;rep.innerHTML='<p class="xs faint vc-hint">'+(call.micOn?vcT("talk"):vcT("tap"))+'</p>'+(call.micOn?'':'<button data-vcmic="1">🎙 '+vcT("mic")+'</button>')}
document.addEventListener("click",e=>{if(e.target.closest("[data-vcmic]")){vcCtx();vcMic().then(vcHint)}});
function vcMicOff(){if(!call||!call.mic)return;try{call.mic.pr.disconnect();call.mic.src.disconnect();call.mic.mute.disconnect();call.mic.st.getTracks().forEach(t=>t.stop())}catch(_){}call.mic=null;call.micOn=false}
function vcFallbackNote(){if(!call||call.noted)return;call.noted=1;toast(vcT("down"))}
/* ---------- hook into the existing call screen ---------- */
const _callSay81=callSay;
callSay=async function(user){if(!call)return;
 if(VC.ep&&VC.ok!==false&&S.callVoice!=="off"){
  const first=!call.vh||!call.vh.length;
  const turn={role:"user",text:user?String(user):vcT("first")};
  if(first){vcCtx();if(!call.mic)vcMic()}
  const ok=await vcTurn(turn);if(ok)return;}
 return _callSay81(user)};
const _endCall81=endCall;
endCall=function(){if(call){vcMicOff();vcHush();try{const th=call.th,ls=(call.lines||[]).filter(Boolean);if(th&&ls.length>1&&Array.isArray(th.mem))th.mem.push("On the phone "+ch(call.cid).n+" said: "+ls.slice(-4).join(" / ").slice(0,300))}catch(_){}}return _endCall81()};
(function(){const st=document.createElement("style");st.textContent=`.vc-hint{width:100%;text-align:center;margin:0 0 6px;opacity:.75}[data-vcmic]{margin:0 auto}`;document.head.appendChild(st)})();
