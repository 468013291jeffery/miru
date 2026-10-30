/* ================= STORY BEATS — the reply-rhythm pay schedule (see doc: BL 剧情进展线 × 付费节奏) =================
   Reply #9 private photo · #14 unsent/deleted message · #20 key scene "continue" · #24 his call · #30 his POV,
   then the same five beats every 25 replies. Nothing before reply 9. Plus users still get calls + POVs (free), no locks.
   Also: proactive contact when you come back, and consequences for going through his phone. */
const BEAT0={9:"pic",14:"del",20:"cont",24:"call",30:"pov"},BEATN={3:"pic",8:"del",14:"cont",18:"call",24:"pov"};
function beatAt(n){return n<=30?BEAT0[n]:BEATN[(n-31)%25]}
storyHooks=function(){};
payHooks=function(th,m){if(!th.wid)return;th.aiN=(th.aiN||0)+1;const b=beatAt(th.aiN),cid=m.who,c=ch(cid);if(!b||!c)return;const nm=first(c.n);
 if(b==="pic"&&!S.plus){setTimeout(()=>{th.msgs.push({who:cid,k:"pic",src:artSrc(cid),locked:true,at:Date.now()});save();if(curT===th.id)renderChat()},900)}
 if(b==="del"){beatCardLater(th,{who:"sys",k:"card",title:"↩︎ "+t("bt.delH",{n:nm}),txt:t("bt.delS"),btn:t("bt.delB")+(S.plus?"":" · 💎 1"),act:"del|"+cid,hold:1})}
 if(b==="cont"&&!S.plus&&m.k==="say"&&String(m.txt||"").length>12){m.locked=true}
 if(b==="call"){setTimeout(()=>callCard(th,cid),1600)}
 if(b==="pov"){beatCardLater(th,{who:"sys",k:"card",title:"💭 "+t("bt.povH",{n:nm}),txt:t("bt.povS"),btn:t("bt.povB",{n:nm})+(S.plus?"":" · 💎 "+PRICES.card),act:"pov|"+cid,hold:1})}};
/* 2026-10-31：互动卡（解锁 POV / 撤回）等这一轮回复全部出完再插到最后，并且「挂住」剧情：
   在你点它、点「先不看，继续」或自己开口之前，剧本不往下走，卡片也不会被后面的消息顶走。 */
function beatCardLater(th,card){let n=0;const go=()=>{if(typeof busy!=="undefined"&&busy&&n++<60){setTimeout(go,500);return}
 card.at=Date.now();th.msgs.push(card);save();if(curT===th.id){renderChat();try{scrollChat()}catch(e){console.warn("[beat12] scroll",e)}}};setTimeout(go,900)}
function beatHeld(th){if(!th||!th.msgs)return false;let me=-1;th.msgs.forEach((m,i)=>{if(m&&m.who==="me")me=i});return th.msgs.slice(Math.max(me+1,th.msgs.length-6)).some(m=>m&&m.k==="card"&&m.hold&&m.act)}
document.addEventListener("click",e=>{const x=e.target.closest("[data-cardlater]");if(!x)return;e.stopImmediatePropagation();const th=S.threads[curT],m=th&&th.msgs[+x.dataset.cardlater];if(m){m.hold=0;save();renderChat()}},true);
async function beatWrite(kind,cid,th){const c=ch(cid),zh=S.lang==="zh",ctx=th.msgs.slice(-8).filter(m=>m.txt).map(m=>(m.who==="me"?"User":ch(m.who)?ch(m.who).n:"")+": "+m.txt).join("\n");
 if(SAMPLE){try{const r=await SAMPLE.json("You are writing for an interactive romance drama. Character: "+c.n+" ("+Lz(c.vibe)+"). Recent scene:\n"+ctx+"\n\n"+(kind==="del"?"Write the ONE text message he typed and then unsent/deleted right after this scene — raw, more honest than he'd ever say out loud, 1–2 sentences.":"Write his inner monologue (POV) during the last moment of this scene — what he was really thinking and hiding, first person, 2–3 short sentences, intense.")+" Reply ONLY JSON {\"text\":\"...\"} in "+(zh?"Simplified Chinese":"English")+".",{modelTier:"quick"});if(r&&r.text)return r.text}catch(_){}}
 const tells=(c.tells&&(c.tells[zh?"zh":"en"]||c.tells.en))||[];
 return kind==="del"?(zh?"算了。当我没说。……但我是认真的。":"Forget it. Pretend I didn't say anything. …I meant it though."):(tells[0]?(zh?"（"+tells[0]+"）我不能让他看出来。再一秒都不行。":"("+tells[0]+") He can't see it. Not for one more second."):Lz(c.twist))}
document.addEventListener("click",async e=>{const x=e.target.closest("[data-cardbtn]");if(!x)return;const th=S.threads[curT],m=th&&th.msgs[+x.dataset.cardbtn];if(!m||!m.act)return;
 const [k,cid]=m.act.split("|");if(k!=="del"&&k!=="pov")return;e.stopImmediatePropagation();
 if(!S.plus){if(k==="del"&&!(freeToday("del")||spend(1,"line")))return;if(k==="pov"&&!spend(PRICES.card,"event"))return}
 x.disabled=true;x.textContent="…";const txt=await beatWrite(k,cid,th);m.btn=null;m.act=null;m.txt=(k==="del"?"“":"")+txt+(k==="del"?"”":"");m.title=(k==="del"?"↩︎ ":"💭 ")+t(k==="del"?"bt.delDone":"bt.povDone",{n:first(ch(cid).n)});
 th.mem.push((k==="del"?"User saw the message "+ch(cid).n+" deleted: ":"User read "+ch(cid).n+"'s private thoughts: ")+txt);const p=typeof pairOf==="function"&&pairOf(th.wid);if(p)relAdd(p,3);save();renderChat()},true);

/* proactive contact: away 6h+ → he texts first; away 12h+ → 2 missed calls */
function proactive(){const now=Date.now(),last=S.lastSeen||0;S.lastSeen=now;save();if(!last||now-last<6*36e5)return;
 const th=Object.values(S.threads).filter(x=>x.wid&&x.msgs.length>4).sort((a,b)=>b.at-a.at)[0];if(!th)return;const cid=mainOf(th),c=ch(cid);if(!c)return;const zh=S.lang==="zh";
 const lines=zh?["你睡了吗？","今天没看到你。","……我在等你回我。","你昨晚说的那句话，我想了一整天。"]:["You asleep?","Didn't see you today.","…I'm waiting on you.","Been thinking about what you said last night. All day."];
 if(now-last>=12*36e5)th.msgs.push({who:"sys",k:"card",title:"📞 "+t("bt.missed",{n:first(c.n)}),txt:t("bt.missedS",{h:Math.round((now-last)/36e5)}),btn:t("bt.callBack"),act:"call|"+cid,at:now-60000});
 th.msgs.push({who:cid,k:"say",txt:lines[hash(cid+today())%lines.length],at:now});th.unread=true;th.at=now;save()}
startApp=(function(o){return function(){proactive();return o.apply(this,arguments)}})(startApp);
document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="hidden"){S.lastSeen=Date.now();save()}});

/* going through his phone has consequences: next time you open their story he asks */
document.addEventListener("click",e=>{const x=e.target.closest("[data-phd]");if(!x||!x.classList.contains("lk")||!gPhone.st)return;const p=gPhone.st.p;S.caught=S.caught||{};S.caught[p[0]]=p[1];save()},true);
openThread=(function(o){return function(id){const th=S.threads[id];if(th&&S.caught&&S.caught[th.wid]){const cid=S.caught[th.wid];delete S.caught[th.wid];const zh=S.lang==="zh";
 th.msgs.push({who:cid,k:"say",txt:zh?"你翻过我手机？":"Did you go through my phone?",at:Date.now()});th.sugg=zh?["……对，我看了。","没有。","那条草稿，是写给谁的？"]:["…Yeah. I did.","No.","Who was that draft for?"];
 th.mem.push(ch(cid).n+" found out the user went through his phone and saw the unsent draft.");const p=pairOf(th.wid);if(p)relAdd(p,-4);save()}return o.apply(this,arguments)}})(openThread);

/* relationship timeline inside Memory Space */
memSheet=(function(o){return function(){o.apply(this,arguments);const th=S.threads[curT];if(!th)return;const ev=th.msgs.filter(m=>m.who==="sys"&&m.k==="card"&&m.title).slice(-8).reverse();const l=$(".sheet .memlay");if(!l)return;
 l.insertAdjacentHTML("afterend",'<div class="tline"><b>🗓 '+t("bt.tl")+'</b>'+(ev.length?ev.map(m=>'<div><em>'+new Date(m.at).toLocaleDateString(S.lang==="zh"?"zh-CN":"en-US",{month:"short",day:"numeric"})+'</em><span>'+esc(m.title)+'</span></div>').join(""):'<p class="xs faint">'+t("mem.none")+'</p>')+'</div>')}})(memSheet);

Object.assign(I18N.en,{"bt.delH":"{n} unsent a message","bt.delS":"It was only there for a second. You saw it disappear.","bt.delB":"See what he wrote","bt.delDone":"What {n} almost sent",
 "bt.povH":"What was {n} thinking just now?","bt.povS":"He said one thing. His face said another.","bt.povB":"Read {n}'s POV","bt.povDone":"{n}'s POV",
 "bt.missed":"2 missed calls · {n}","bt.missedS":"You were gone {h} hours.","bt.callBack":"📞 Call back","bt.tl":"Your timeline"});
Object.assign(I18N.zh,{"bt.delH":"{n} 撤回了一条消息","bt.delS":"它只停留了一秒。你看见它消失了。","bt.delB":"看看他写了什么","bt.delDone":"{n} 差点发出的那句话",
 "bt.povH":"刚才那一秒，{n} 在想什么？","bt.povS":"他嘴上说的是一回事，表情是另一回事。","bt.povB":"解锁 {n} 的 POV","bt.povDone":"{n} 的 POV",
 "bt.missed":"未接来电 ×2 · {n}","bt.missedS":"你离开了 {h} 小时。","bt.callBack":"📞 回拨","bt.tl":"你们的时间线"});
