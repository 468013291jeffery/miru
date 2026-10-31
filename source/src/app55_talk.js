/* ================= v2.3 · FREE TALK inside a story =================
   Before: at a "your turn" stop, typing anything resolved the stop at once — you asked a question, nobody answered, the scene jumped on.
   Now: typing opens a real conversation. The other character answers YOUR words (live LLM, or an in-character fallback offline),
   you can keep talking as many turns as you like, and the plot only moves when you tap ▶ 继续剧情 or pick one of the scripted options.
   What you say is remembered (th.mem), nudges the relationship meters a little (rule-based, capped — the AI never writes state),
   and can trip plot hooks the author planted (pack.hooks / chapter.hooks: {kw:[…], set:"flag", note}). */
CTX.talk="{u} steps outside the script to talk to you directly: \"{x}\". Answer THAT — reply to the exact question or words, in character, 2–4 beats. Stay inside this moment: do NOT advance the plot, do NOT resolve the chapter goal, do NOT make the reader's official choice, do NOT reveal secrets the character would not reveal at this relationship stage. End on something {u} can answer.";
const TALK_KIND=new Set(["line","myline"]);
function talkStop(th){return th&&th.pk&&th.pk.stop&&TALK_KIND.has(th.pk.stop[1])?th.pk.stop:null}
function autoMode(txt){const s=String(txt).trim();if(/^[*＊]/.test(s))return "act";if(/^[(（]/.test(s)&&/[)）]$/.test(s))return "think";return "say"}
/* ---- intent of a free line (used offline and for the meters) ---- */
const TALK_RX={
 q:/[?？]|吗|呢$|为什么|怎么|是不是|有没有|什么|哪|谁|多少|\b(why|what|how|who|where|when|do you|are you|is it)\b/i,
 warm:/谢谢|喜欢你|想你|抱|别怕|我在|对不起|相信你|陪你|心疼|担心你|没事的|辛苦|\b(thank|sorry|trust you|i'm here|miss you|it's okay)\b/i,
 flirt:/亲你|亲我|亲一下|吻|靠近|心跳|好看|帅|脸红|牵手|\b(kiss|cute|closer|handsome|blush)\b/i,
 hostile:/滚|讨厌你|骗子|恨你|闭嘴|烦死|别碰|离我远|\b(liar|hate you|shut up|get out|leave me)\b/i,
 secret:/秘密|真相|隐瞒|瞒着|到底|过去|以前|\b(secret|truth|hiding|past)\b/i,
 promise:/答应|保证|发誓|一定会|不会走|\b(promise|swear|i will)\b/i};
function talkIntent(txt){for(const k of ["hostile","secret","promise","warm","flirt","q"])if(TALK_RX[k].test(txt))return k;return "other"}
const TALK_FB={
 zh:{q:["你问这个干什么。……*他停了一下* 不是不想说，是这事没那么简单。","*他沉默了两秒* 你真想知道？那你先告诉我，你为什么问。","现在问这个？……*他移开视线* 以后再说，好吗。"],
  secret:["*他的手指停住了* 有些事，知道了就回不去了。","谁跟你说的？……算了，这件事我会亲口告诉你，但不是现在。","你在试探我。*他笑了一下，没有否认*"],
  promise:["*他看了你很久* 你说的，我记住了。别反悔。","答应得这么轻松……那我就当真了。","这句话，我会一直记着。"],
  warm:["*他愣了一下，耳尖慢慢红了* ……你突然这么说，我不知道该怎么接。","嗯。*他低声* 你在就好。","别这样看着我……我会当真的。"],
  flirt:["*他往后退了半步，又没完全退开* 你这是故意的吧。","再这样，我就不保证自己会做什么了。","*他的呼吸乱了一拍* ……胆子挺大。"],
  hostile:["*他的表情冷下来* 好。你想让我走，我就走。……但你得把话说清楚。","*他抓住你的手腕，又松开* 你可以生气，别对自己撒谎。","随你怎么说。我不会因为这句话就放手。"],
  other:["*他把你那句「{w}」在嘴里过了一遍* 你总是这样，一句话就让我乱了。","*他转过头看你* 你继续说，我在听。","嗯？你刚才那句，再说一遍。"]},
 en:{q:["Why do you want to know? *A pause* It's not that I won't say. It's not that simple.","*A two-second silence* You really want to know? Tell me why you're asking first.","Now? *He looks away* Later. Okay?"],
  secret:["*His fingers go still* Some things you can't un-know.","Who told you that? …I'll tell you myself. Not tonight.","You're testing me. *He smiles and doesn't deny it*"],
  promise:["*He looks at you for a long moment* I heard that. Don't take it back.","That came easy. I'm going to hold you to it.","I'll remember you said that."],
  warm:["*He blinks; the tips of his ears go red* …You can't just say that.","Yeah. *Quietly* As long as you're here.","Don't look at me like that. I'll start believing it."],
  flirt:["*He steps back half a pace — not all the way* You're doing this on purpose.","Keep that up and I'm not responsible for what happens.","*His breath catches* …Bold."],
  hostile:["*His face goes cold* Fine. You want me gone, I'm gone. But say it straight.","*He catches your wrist, lets go* Be angry. Just don't lie to yourself.","Say what you want. I'm not letting go over one sentence."],
  other:["\"{w}\" … *he repeats it back* One line from you and I'm off balance.","*He turns to you* Keep going. I'm listening.","Hm? Say that again."]}};
function talkPartner(th){const P=typeof dimMain==="function"?dimMain(th):null,as=th.pk&&th.pk.as;
 if(P){const o=P.a===as?P.b:P.b===as?P.a:(P.a==="me"?P.b:P.b);if(o&&ch(o))return o}
 return speakersOf(th).find(id=>ch(id))||mainOf(th)}
const _fallback55=fallback;
fallback=function(th,ctx){if(!(ctx&&ctx.kind==="talk"))return _fallback55(th,ctx);
 const lang=CL()==="zh"?"zh":"en",txt=String(ctx.txt||""),k=talkIntent(txt),who=talkPartner(th);
 const w=lang==="zh"?txt.replace(/[*()（）]/g,"").slice(0,14):txt.replace(/[*()]/g,"").split(/\s+/).slice(0,5).join(" ");
 const pool=TALK_FB[lang][k]||TALK_FB[lang].other,used=new Set(th.msgs.slice(-30).map(m=>m.txt));
 let line=pool.map(s=>s.split("{w}").join(w)).find(s=>!used.has(s.replace(/^\*[^*]+\*\s*/,"")))||pool[0].split("{w}").join(w);
 const beats=[];const m=line.match(/^\*([^*]+)\*\s*(.*)$/);
 if(m){beats.push({who,kind:"act",text:m[1]});if(m[2])beats.push({who,kind:"say",text:m[2]})}else beats.push({who,kind:"say",text:line});
 return {beats,status:{},love:{},suggest:talkSugg(th,k,lang)}};
function talkSugg(th,k,lang){const Z={zh:{q:["你先回答我。","*我没有移开视线*","算了，当我没问。"],secret:["我可以等。","*我轻轻碰了碰他的手*","你不说，我就自己去查。"],hostile:["……对不起，我说重了。","*我转身要走*","你根本不懂。"],other:["然后呢？","*我靠近一点*","我们回到正事吧。"]},
  en:{q:["Answer me first.","*I don't look away*","Forget I asked."],secret:["I can wait.","*I touch his hand, lightly*","If you won't tell me, I'll find out."],hostile:["…Sorry. That was too much.","*I turn to leave*","You don't get it."],other:["And then?","*I move a little closer*","Let's get back to it."]}};
 return (Z[lang][k]||Z[lang].other).slice()}
/* ---- the AI writes words, never state: inside a story, drop any love/goal numbers from the model ---- */
const _playBeats55=playBeats;
playBeats=function(th,r,ctx,silent){if(th&&th.pk&&r&&ctx&&(ctx.kind==="talk"||ctx.kind==="user")){r=Object.assign({},r);delete r.love;delete r.goals}return _playBeats55(th,r,ctx,silent)};
/* ---- what you say is remembered, moves the meters a little, and can trip the author's plot hooks ---- */
function talkLearn(th,txt){if(!th||!th.pk)return;const k=talkIntent(txt),zh=CL()==="zh",u=me();
 th.mem=th.mem||[];
 if(/我|我的|\bI\b|\bmy\b|\bI'm\b/i.test(txt)&&/(是|喜欢|讨厌|害怕|答应|保证|秘密|记得|名字|从来|想要|以前|小时候|love|hate|afraid|promise|remember|never|always|want)/i.test(txt)){
  const uu=zh&&/^you$/i.test(u)?"你":u;const note=(zh?uu+" 亲口说过：「":u+" once said: \"")+txt.slice(0,48)+(zh?"」":"\"");if(!th.mem.includes(note)){th.mem.push(note);th.mem=th.mem.slice(-60)}}
 if(k==="promise"){const note=(zh?(/^you$/i.test(u)?"你":u)+" 许下承诺：":u+" promised: ")+txt.slice(0,40);if(!th.mem.includes(note))th.mem.push(note)}
 /* memory lifecycle: what kind of thing was said — a stated preference, a guess (never becomes world fact), a promise (pending until kept/broken) */
 th.pk.mem2=th.pk.mem2||[];const kind=k==="promise"?"promise":/(我猜|是不是|会不会|也许|maybe|i guess|i bet)/i.test(txt)?"guess":/(我喜欢|我讨厌|我不喜欢|我怕|i like|i hate|i'm afraid)/i.test(txt)?"pref":null;
 if(kind){const same=th.pk.mem2.find(m=>m.kind===kind&&talkSim(m.txt,txt)>.7);if(same){same.n=(same.n||1)+1;same.at=Date.now()}else th.pk.mem2.push({kind,txt:txt.slice(0,60),ch:th.pk.ch,status:kind==="promise"?"pending":"stated",at:Date.now()});th.pk.mem2=th.pk.mem2.slice(-30)}
 /* diminishing returns: the same intent moves the meters once per scene */
 th.pk.talkSeen=th.pk.talkSeen||{};const seenK=th.pk.ch+":"+k;const repeat=!!th.pk.talkSeen[seenK];th.pk.talkSeen[seenK]=1;
 th.pk.talkd=th.pk.talkd||0;
 if(typeof dimMain==="function"&&th.pk.talkd<3&&!repeat){const P=dimMain(th);const D={warm:{tru:2,att:1},flirt:{att:2,ten:2},hostile:{tru:-2,gru:2,ten:2},secret:{ten:2},promise:{tru:3},q:{ten:1}}[k];
  if(P&&D){th.pk.talkd++;try{dimAdd(th,P.a+"|"+P.b,D,zh?"你说："+txt.slice(0,20):"You said: "+txt.slice(0,30))}catch(_){}}}
 try{const w=wd(th.wid),P=w&&w.pack,c=P&&P.chapters[th.pk.ch-1];const H=[].concat((P&&P.hooks)||[],(c&&c.hooks)||[]);
  H.forEach(h=>{if(!h||!h.kw||(h.set&&(th.pk.flags||{})[h.set]))return;const hit=[].concat(h.kw).some(x=>x&&txt.toLowerCase().includes(String(x).toLowerCase()));
   if(hit){if(h.set)pkSet(th,h.set);if(h.rd&&typeof dimApply==="function")dimApply(th,h.rd,Lz(h.note)||"");toast("💡 "+(Lz(h.note)||(zh?"这句话被记住了，会影响后面的剧情":"That line was remembered — it will matter later")))}})}catch(_){}
 save()}
/* ---- typing at a "your turn" stop = talk, not skip ---- */
const _doSend55=doSend;
doSend=function(txt,mode,typed,echoed){const th=S.threads[curT];txt=String(txt||"").trim();
 if(th&&txt&&talkStop(th)&&!busy&&(mode||cmode)!=="dir"){
  if(!aiGate()){const ta=$("#cin");if(ta)ta.value=txt;return}
  const m=mode&&mode!=="say"?mode:autoMode(txt);
  if(!echoed)appendMsg(th,{who:"me",k:m,txt,typed:!!typed,at:Date.now()});th.rounds=(th.rounds||0)+1;th.pk.talk=(th.pk.talk||0)+1;talkLearn(th,txt);save();packRefresh(th);
  Promise.resolve(reply(th,{kind:"talk",txt,mode:m})).then(()=>{packRefresh(th);if(curT===th.id)scrollChat()});return}
 if(th&&th.pk&&txt&&(mode||cmode)!=="dir")talkLearn(th,txt);
 return _doSend55(txt,mode,typed,echoed)};
/* myline: tapping the hint still says the written line; typing your own words that differ (or a question) opens a talk turn first */
function talkSim(a,b){a=String(a||"");b=String(b||"");if(!a||!b)return 0;const A=new Set(a.replace(/\s/g,"")),B=new Set(b.replace(/\s/g,""));let n=0;A.forEach(x=>{if(B.has(x))n++});return n/Math.max(A.size,B.size)}
function mylineTalk(th,txt){const b=talkStop(th);if(!b||b[1]!=="myline")return false;txt=String(txt||"").trim();if(!txt)return true;
 if(TALK_RX.q.test(txt)||talkSim(txt,b[2].t)<0.34){doSend(txt,"say");const ta=$("#myTxt");if(ta)ta.value="";return true}return false}
window.addEventListener("click",e=>{if(!e.target.closest("[data-mysend]"))return;const th=S.threads[curT];if(!th)return;if(mylineTalk(th,($("#myTxt")||{}).value)){e.stopImmediatePropagation();e.preventDefault()}},true);
window.addEventListener("keydown",e=>{if(!(e.target&&e.target.id==="myTxt"&&e.key==="Enter"&&!e.shiftKey))return;const th=S.threads[curT];if(!th)return;if(mylineTalk(th,e.target.value)){e.stopImmediatePropagation();e.preventDefault()}},true);
/* ---- continuing the plot ---- */
const _stopResolve55=stopResolve;stopResolve=function(th,extra){if(th&&th.pk){th.pk.talk=0;th.pk.talkd=0}return _stopResolve55(th,extra)};
function talkGo(th){const b=talkStop(th);if(!b)return;const d=b[2];
 if(b[1]==="myline"){stopResolve(th,[]);return}
 stopResolve(th,d.free||((d.opts&&d.opts[0]&&d.opts[0].then)||[]))}
document.addEventListener("click",e=>{if(!e.target.closest("[data-talkgo]"))return;const th=S.threads[curT];if(th)talkGo(th)});
const _stopHTML55=stopHTML;
stopHTML=function(th){const h=_stopHTML55(th);const b=talkStop(th);if(!b||!th.pk.talk)return h;const zh=CL()==="zh";
 return h+'<div class="talkbar"><span>'+(zh?"可继续打字聊天，或":"Keep chatting, or")+'</span><button data-talkgo="1">'+(zh?"继续剧情":"continue the story")+' →</button></div>'};
/* while a talk turn is being answered, keep the panel calm */
(function(){const st=document.createElement("style");st.textContent=`
.talkbar{display:flex;justify-content:flex-end;gap:4px;align-items:center;margin:8px 0 0;padding:0;border:0;background:none;color:var(--muted,#aaa);font-size:12px;line-height:1.5;white-space:nowrap}
.talkbar button{flex:none;min-height:32px;border:0;border-radius:0;padding:4px 0 4px 2px;font:inherit;color:inherit;background:none;cursor:pointer;text-decoration:underline;text-underline-offset:3px}.talkbar button:hover,.talkbar button:focus-visible{color:var(--text,#fff)}`;document.head.appendChild(st)})();

/* ================= composer: free input + 2–3 quick options; director is an advanced tool, not a peer of "say" =================
   Product feedback: 台词/动作/心声/导演 side by side is too flat. Now one box — start with * for an action, wrap in （） for a thought —
   with up to 3 quick replies above it. 🎬 导演 and 🚪 moved into the ⋯ tray. Watch mode is untouched. */
/* 2026-10-27：从「包 renderChat」搬成钩子（批量迁移之一）。逻辑原样，只是不再包住渲染器。 */
const __body_composer55 = function () { try{composer55()}catch(_){} };
if (window.UI && typeof window.UI.add === "function") window.UI.add("composer55", __body_composer55);
else { const _renderChat55 = renderChat; renderChat = function () { const r = _renderChat55.apply(this, arguments); __body_composer55(); return r; }; };
function composer55(){const th=S.threads[curT];if(!th||(th.pk&&th.pk.as==="watch"))return;const box=$(".composer");if(!box||box.dataset.c55)return;box.dataset.c55=1;
 const modes=box.querySelector(".modes"),tray=box.querySelector("#modes2");if(!modes||!tray)return;
 ["say","act","think"].forEach(k=>{const b=modes.querySelector('[data-mode="'+k+'"]');if(b)b.remove()});
 const d=modes.querySelector('[data-mode="dir"]');if(d){d.classList.add("tool");tray.appendChild(d)}
 const si=modes.querySelector("[data-stepin]");if(si){si.textContent="🚪 "+(CL()==="zh"?"换身份":"Switch role");tray.appendChild(si)}
 if(cmode!=="dir")cmode="say";
 const sg=$("#sugg");if(sg){[...sg.children].filter(x=>!x.dataset.sgmore).slice(3).forEach(x=>x.remove());sg.classList.add("sg55")}
 const hint=document.createElement("span");hint.className="c55h";hint.textContent=CL()==="zh"?"直接打字 · *动作* · （心声）":"Just type · *action* · (thought)";modes.insertBefore(hint,modes.firstChild);
 const ta=$("#cin");if(ta)ta.placeholder=CL()==="zh"?"想说什么都行，他会回应你……":"Say anything — he'll answer you…"}
const _doSend55b=doSend;doSend=function(txt,mode,typed,echoed){if(!mode&&cmode==="say"&&txt)mode=autoMode(txt);return _doSend55b(txt,mode,typed,echoed)};
(function(){const st=document.createElement("style");st.textContent=`
.composer .c55h{font-size:11.5px;color:#9C93A8;align-self:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.suggest.sg55{display:flex;gap:6px;overflow-x:auto;flex-wrap:nowrap}.suggest.sg55 button{flex:none;max-width:72%}`;document.head.appendChild(st)})();
