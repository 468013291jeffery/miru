/* ================= v4.3 · PAID MEMORY + TURN-TAKING STORY CALLS =================
   A) Memory is a 💎 purchase per story, priced by the AI-cost rule (¥1 of model cost = $1, rounded up to whole 💎):
      · Standard 8K (~20 messages + 5 key moments) — free for everyone
      · Extended 32K (60 messages + 40 key moments + memories from your other stories with him) — 💎4 per 100 replies
        (≈3.2M prompt tokens per 100 replies, mostly cache hits → ≈¥0.7)
      · Deep 128K (150 messages + everything) — 💎16 per 100 replies (≈¥2.8)
      When a pack runs out, the story drops back to Standard and he says so in the memory chip — nothing breaks.
   B) Scripted story calls ("他回来接我那天" etc.) are real conversations: he opens, then waits for you; every reply
      answers what you actually said. The script's lines are only his intention for the call (what he needs you to
      know/do), never recited. After 4–8 of his replies he makes his point and hangs up; the story continues. No mic / no voice service → the old
      tap-through call, but your own lines are shown for you to say instead of being read out by him. */
/* ---------- A) memory packs ---------- */
const MEMX={plus:{gems:4,replies:100},deep:{gems:16,replies:100}};
function memX(th){S.memX=S.memX||{};return th?S.memX[th.id]:null}
memTier=function(th){if(!th)return "free";if(S.deepMem&&S.deepMem[th.id]&&!(S.memX&&S.memX[th.id]))return "deep";const x=memX(th);return x&&x.left>0?x.tier:"free"};
function memBuy88(th,tier){const P=MEMX[tier];if(!P||!th)return;if(!spend(P.gems,"mem"))return;S.memX=S.memX||{};const x=S.memX[th.id];
 S.memX[th.id]={tier:x&&x.tier==="deep"&&tier==="plus"&&x.left>0?"deep":tier,left:(x&&x.left>0?x.left:0)+P.replies};save();
 toast(ttsZh()?"🧠 记忆已扩展 · 接下来 "+S.memX[th.id].left+" 句他都记得更多":"🧠 Memory extended · for the next "+S.memX[th.id].left+" replies");try{memSheet();renderChat()}catch(_){}}
reply=(function(orig){return async function(th,ctx,silent){const r=await orig.apply(this,arguments);try{if(!silent){const x=memX(th);if(x&&x.left>0){x.left--;if(x.left===0)toast(ttsZh()?"🧠 扩展记忆用完了，已回到标准记忆":"🧠 Extended memory used up — back to standard");if(x.left===10)toast(ttsZh()?"🧠 扩展记忆还剩 10 句":"🧠 10 replies of extended memory left");save()}}}catch(_){}return r}})(reply);
(function(){const Z={"mem.t.free":"标准 · 免费","mem.t.plus":"加强","mem.t.deep":"深度","mem.d.free":"约 20 条对话","mem.d.plus":"60 条对话 + 跨故事记忆","mem.d.deep":"150 条对话 · 什么都记得"};
 const E={"mem.t.free":"Standard · free","mem.t.plus":"Extended","mem.t.deep":"Deep","mem.d.free":"~20 messages","mem.d.plus":"60 messages + memories across stories","mem.d.deep":"150 messages · remembers everything"};
 try{Object.assign(I18N.zh,Z);Object.assign(I18N.en,E)}catch(_){}})();
const _memSheet88=memSheet;memSheet=function(){_memSheet88.apply(this,arguments);try{const th=S.threads[curT],box=$(".sheet .memtiers");if(!th||!box)return;const x=memX(th),zh=ttsZh();
 box.insertAdjacentHTML("afterend",(x&&x.left>0?'<p class="xs" style="text-align:center;color:var(--gold);margin:8px 0 0">'+(zh?"当前扩展记忆还剩 "+x.left+" 句":x.left+" replies of extended memory left")+'</p>':'')+
  '<div class="row" style="gap:8px;margin-top:10px"><button class="btn btn-g grow" data-mem88="plus">🧠 '+(zh?"加强 32K":"Extended 32K")+'<br><small>💎'+MEMX.plus.gems+' · '+(zh?"100 句":"100 replies")+'</small></button>'+
  '<button class="btn btn-p grow" data-mem88="deep">🧠 '+(zh?"深度 128K":"Deep 128K")+'<br><small>💎'+MEMX.deep.gems+' · '+(zh?"100 句":"100 replies")+'</small></button></div>')}catch(_){}};
document.addEventListener("click",e=>{const b=e.target.closest("[data-mem88]");if(!b)return;memBuy88(S.threads[curT],b.dataset.mem88)});
(function(){const st=document.createElement("style");st.textContent=`.sheet [data-deepmem]{display:none!important}[data-mem88]{line-height:1.25;padding:10px 6px}[data-mem88] small{font-size:11px;opacity:.8;font-weight:600}`;document.head.appendChild(st)})();
/* ---------- B) scripted calls with turn-taking ---------- */
let PEND88=null;
const SC88={zh:{go:"▶ 继续",first:"（电话接通了。是你打过去的，你先开口。）"},en:{go:"▶ Continue",first:"(The call connects. You called, so you speak first.)"},
 ja:{go:"▶ 続ける",first:"（電話がつながった。かけたのはあなた。先に話して。）"},ko:{go:"▶ 계속",first:"(전화가 연결됐다. 건 사람은 너야. 먼저 말해.)"},es:{go:"▶ Seguir",first:"(La llamada conecta. Llamaste tú: habla primero.)"}};
function sc88(k){return (SC88[vcLang()]||SC88.en)[k]}
/* the script is only his INTENT for this call — he answers what you actually say, like a real call */
const _vcSys88=vcSys;vcSys=function(c,th){let s=_vcSys88(c,th);const X=call&&call.script;if(!X)return s;const last=X.i>=X.max-1;
 return s+"\n\nTHIS CALL IS A SCENE IN THE STORY."+(X.hint?" Situation: "+X.hint:"")+
  "\nWhat you wanted to get across when you called (the story's original idea — your intention, NOT a script to recite):\n- "+X.beats.join("\n- ")+
  "\nHOW THIS CALL WORKS: it is a live conversation. Every turn, first answer what they actually just said — their words, their tone, their questions — in character. Then, only if it fits naturally, move one step toward what you called for. Never recite the lines above in order, never ignore what they said, never speak their part for them. One to three short spoken sentences, then stop and let them talk."+
  (last?"\nThis is your LAST reply in this call: make sure the essential point (what you need them to do / know) is said, close the call in character, and end it.":"")};
const _vcTurn88=vcTurn;vcTurn=async function(turn){const X=call&&call.script,n0=call&&call.vh?call.vh.length:0;const r=await _vcTurn88(turn);
 try{if(r&&X&&call&&call.script===X&&call.vh&&call.vh.length>n0+1&&call.vh[call.vh.length-1].role==="assistant"){X.i++;if(X.i>=X.max){const wait=setInterval(()=>{if(!call||call.script!==X){clearInterval(wait);return}if(!vcTalkingNow()){clearInterval(wait);setTimeout(()=>{if(call&&call.script===X)endCall()},900)}},300)}}}catch(_){}return r};
const _vcHint88=vcHint;vcHint=function(){_vcHint88();const X=call&&call.script,rep=$("#cvR");if(!X||!rep||X.i>=X.max)return;
 if(!call.micOn)rep.insertAdjacentHTML("beforeend",'<button data-vc88go="1">'+esc(sc88("go"))+'</button>')};
document.addEventListener("click",e=>{if(!e.target.closest("[data-vc88go]")||!call||!call.script)return;callSay(vcLang()==="zh"?"嗯，我在听。":"I'm listening.")});
const _callSay88=callSay;callSay=function(user){if(call&&PEND88&&!call.script){call.script=PEND88;PEND88=null}if(call&&call.script&&!user&&(!call.vh||!call.vh.length)){const X=call.script;
  if(!(VC.ep&&VC.ok!==false&&S.callVoice!=="off"))return _callSay88(user);
  vcCtx();if(!call.mic)vcMic();return vcTurn({role:"user",text:sc88("first")}).then(ok=>{if(!ok&&call&&call.script===X){call.script.fail=1;endCall()}})}
 return _callSay88(user)};
const _endCall88=endCall;endCall=function(){const X=call&&call.script;const said=X&&call?(call.lines||[]).filter(Boolean):[];const th=X&&X.th,cid=call&&call.cid;
 const r=_endCall88.apply(this,arguments);
 if(X){try{if(th)said.forEach(x=>appendMsg(th,{who:cid,k:"say",txt:"📞 "+x,at:Date.now()}));save()}catch(_){}
  if(X.fail)X.fallback();else X.res()}return r};
const _stopCallRun88=stopCallRun;
stopCallRun=function(th,d){const voiceOK=VC.ep&&VC.ok!==false&&S.callVoice!=="off"&&navigator.mediaDevices&&navigator.mediaDevices.getUserMedia;
 const cid=d.cid||mainOf(th),as=th.pk&&th.pk.as,lines=(d.lines||[]).map(x=>Array.isArray(x)?x:[cid,x]);
 if(!voiceOK||!lines.length)return _stopCallRun88(th,d);
 return new Promise(res=>{const beats=[],sugg={};lines.forEach(([w,x])=>{if(as&&w===as){const k=beats.length-1;sugg[k]=(sugg[k]?sugg[k]+" ":"")+x}else beats.push(x)});
  if(!beats.length){_stopCallRun88(th,d).then(res);return}
  PEND88={beats,sugg,i:0,max:Math.min(8,Math.max(4,beats.length+2)),hint:typeof d.hint==="string"?d.hint:(d.hint?Lz(d.hint):""),th,res,fallback:()=>_stopCallRun88(th,d).then(res)};
  startCall(cid,0,false);if(!call){const P=PEND88;PEND88=null;P.fallback()}})};
/* tap-through fallback: never read the player's own lines in his voice — show them for the player instead */
VOICE.use('memcall-88',function(next,text,id,onend){try{const th=S.threads[curT];if($(".stcallv")&&th&&th.pk&&th.pk.as&&id===th.pk.as){const L=$(".stcallv #scL");if(L)L.innerHTML='<span style="opacity:.7">'+esc(sc88("say"))+'</span>「'+esc(text)+'」';setTimeout(()=>{if(onend)onend()},Math.max(2500,String(text).length*180));return}}catch(_){}return next(text,id,onend)});
(function(){const st=document.createElement("style");st.textContent=`.vc88s{width:100%;text-align:center;opacity:.85;margin:2px 0 6px;color:#F6D3AE}[data-vc88go]{margin:0 auto}`;document.head.appendChild(st)})();
