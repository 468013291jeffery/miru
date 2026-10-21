/* ================= v3.7 · MOVING PICTURES — Vidu image-to-video (POST /api/tts {vid}, poll GET /api/tts?vid=) =================
   In the picture sheet: "🎬 Make it move · 💎5" turns the current still (AI picture or portrait) into a 5s 720p clip.
   The clip is kept on the message (m.vid) and plays in the sheet; failures refund the diamonds. */
const VID={ep:typeof TTS_EP!=="undefined"?TTS_EP:"",price:PRICES.video||4};
const VID_T={zh:{go:"让画面动起来",wait:"正在生成视频……大约 1–2 分钟，可以先关掉，好了会留在这条消息上",done:"视频好了",fail:"视频没生成出来，钻石已退回",busy:"已经在生成了"},
 en:{go:"Make it move",wait:"Making the video… about 1–2 min. You can close this; it stays on the message",done:"Your video is ready",fail:"Couldn't make the video — diamonds refunded",busy:"Already working on it"},
 ja:{go:"動かしてみる",wait:"動画を作成中……1〜2分ほど。閉じても大丈夫、メッセージに残ります",done:"動画ができました",fail:"動画を作れませんでした。ダイヤは返却しました",busy:"作成中です"},
 ko:{go:"움직이게 하기",wait:"영상 만드는 중… 1~2분 정도. 닫아도 메시지에 남아요",done:"영상이 완성됐어요",fail:"영상을 만들지 못했어요 — 다이아를 돌려드렸어요",busy:"이미 만드는 중이에요"},
 es:{go:"Dale movimiento",wait:"Creando el video… 1–2 min. Puedes cerrar; queda en el mensaje",done:"Tu video está listo",fail:"No se pudo crear el video: diamantes devueltos",busy:"Ya se está creando"}};
function vidT(k){const l=typeof CL==="function"?CL():S.lang;return (VID_T[l]||VID_T.en)[k]}
/* shrink the still to a small JPEG (long side 640px) — big uploads are slow */
function vidShrink(src){return new Promise((ok,no)=>{const im=new Image();im.crossOrigin="anonymous";im.onload=()=>{try{const s=Math.min(1,640/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement("canvas");c.width=Math.round(im.naturalWidth*s);c.height=Math.round(im.naturalHeight*s);c.getContext("2d").drawImage(im,0,0,c.width,c.height);ok(c.toDataURL("image/jpeg",.84))}catch(e){/^https:/.test(src)?ok(src):no(e)}};im.onerror=()=>/^https:/.test(src)?ok(src):no(new Error("img"));im.src=src})}
function vidPrompt(th,m){try{const b=aiPromptBase(th,m);return ("Cinematic romance drama shot. "+(fem(b.c)?"The woman":"The man")+" "+b.P+"; subtle natural motion — breathing, a blink, hair moving slightly, a small turn of the head toward the camera; slow gentle camera push-in. Setting: "+b.place+". Moody practical lighting, film look, photoreal, keep the face identical. No text.").replace(/\s+/g," ")}catch(_){return "Subtle cinematic motion, slow camera push-in, natural breathing and blinking, keep the face identical, photoreal."}}
function vidSrcOf(th,m){if(IMG&&IMG.o&&IMG.o.im)return IMG.o.im;try{return artSrc(m.who)}catch(_){return null}}
function vidShow(m){const pv=$("#imgPrev");if(!pv||!m||!m.vid||!m.vid.url)return;pv.innerHTML='<video src="'+esc(m.vid.url)+'" '+(m.vid.cover?'poster="'+esc(m.vid.cover)+'" ':'')+'autoplay loop muted playsinline controls style="width:100%;border-radius:14px;display:block"></video>'}
async function vidPoll(m,th,tries){for(let i=0;i<(tries||72);i++){await new Promise(r=>setTimeout(r,5000));
  let j;try{j=await fetch(VID.ep+"?vid="+encodeURIComponent(m.vid.id)).then(r=>r.json())}catch(_){continue}
  if(j.state==="success"&&j.url){m.vid.url=j.url;m.vid.cover=j.cover;m.vid.state="success";m.vid.at=Date.now();save();if(IMG.m===m)vidShow(m);const st=$("#aiSt");if(st&&IMG.m===m)st.textContent="🎬 "+vidT("done");else toast("🎬 "+vidT("done"));return true}
  if(j.state==="failed"||j.error&&/bad id/.test(j.error)){break}}
 m.vid.state="failed";if(!m.vid.refunded){m.vid.refunded=1;if(!m.vid.free){S.keys+=VID.price}}save();const st=$("#aiSt");if(st&&IMG.m===m)st.textContent=vidT("fail");else toast(vidT("fail"));return false}
async function vidGo(){const th=IMG.th,m=IMG.m;if(!th||!m||!VID.ep)return;const st=$("#aiSt");
 if(m.vid&&m.vid.state==="run"){if(st)st.textContent=vidT("busy");return}
 const src=vidSrcOf(th,m);if(!src)return;
 const free=!!S.plus&&false;if(!free&&!spend(VID.price,"event"))return;
 const btn=$("[data-vidgo]");if(btn)btn.disabled=true;if(st)st.textContent="🎬 "+vidT("wait");
 try{const image=await vidShrink(src);const r=await fetch(VID.ep,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({vid:{image,prompt:vidPrompt(th,m)}})});const j=await r.json().catch(()=>({}));
  if(!r.ok||!j.id)throw new Error(j.error||r.status);
  m.vid={id:j.id,state:"run",t0:Date.now(),free};save();vidPoll(m,th)}
 catch(e){if(!free)S.keys+=VID.price;save();if(st)st.textContent=vidT("fail");if(btn)btn.disabled=false}}
document.addEventListener("click",e=>{if(e.target.closest("[data-vidgo]")){vidGo();return}});
const _imgSheet83=imgSheet;imgSheet=function(th,m){const r=_imgSheet83.apply(this,arguments);try{if(VID.ep){const a=$("#aiSt")||$("#imgPrev");
  if(a&&!$("[data-vidgo]"))a.insertAdjacentHTML("afterend",'<button class="btn btn-g" style="width:100%;margin-top:8px" data-vidgo="1">🎬 '+vidT("go")+' · 💎'+VID.price+'</button>');
  if(m&&m.vid){if(m.vid.url)setTimeout(()=>vidShow(m),400);else if(m.vid.state==="run"){const st=$("#aiSt");if(st)st.textContent="🎬 "+vidT("wait");if(!m.vid.poll){m.vid.poll=1;vidPoll(m,th,48).finally(()=>{m.vid&&delete m.vid.poll})}}}}}catch(_){}return r};
/* resume clips that were still being made when the app closed */
setTimeout(()=>{try{Object.values(S.threads||{}).forEach(th=>(th.msgs||[]).forEach(m=>{if(m.vid&&m.vid.state==="run"&&Date.now()-m.vid.t0<36e5&&!m.vid.poll){m.vid.poll=1;vidPoll(m,th,48)}}))}catch(_){}},4000);
