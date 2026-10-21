/* ---- v145 · relationships that can turn, personas that matter, and a story that leaves the app ----
   1 发展线: not one meter that only goes up. Seven lines — lovers, rivals, enemies, a love triangle, confidants, a dangerous bond,
     and estrangement (negative intimacy). Which line you're on follows the five meters + closeness; crossing a threshold is a 剧情反转.
     Stages can go BACKWARD. Live AI may now lower closeness and must let characters refuse, cool off or turn hostile.
   2 双向设定: personas get a personality + "about me"; switch persona per chat; it's written into every live prompt.
   3 后悔药: ⏪ back to the first meeting. 4 🛠 feedback on how a character is played → injected into later replies.
   5 配角 joins solo chats of studio-made characters; narrator voice preset. 6 Character moments that remember, with likes,
     comments and jealous back-and-forth. 7 📤 share a chat snippet as an image card to X / Facebook / WhatsApp / Instagram / TikTok / Discord. */
const LINES={
 love:{ic:"💗",c:"#FF7AA2",n:["恋人线","Lovers"],st:[["邂逅","Chance meeting"],["相知","Knowing you"],["悸动","The flutter"],["眷恋","Can't let go"],["宿命","Fated"]],when:["默认走向","Default"],dir:"a slow romance that deepens"},
 rival:{ic:"⚔️",c:"#FFB35C",n:["宿敌线","Rivals"],st:[["交锋","First clash"],["较劲","Keeping score"],["惺惺相惜","Grudging respect"],["相爱相杀","Love-hate"],["宿敌","Nemesis"]],when:["张力 ≥55 且 信任 <45","Tension ≥55, trust <45"],dir:"rivals: every exchange is a contest; attraction shows only as competition"},
 enemy:{ic:"🥀",c:"#C06070",n:["仇人线","Enemies"],st:[["误会","Misunderstanding"],["敌意","Hostility"],["仇人","Enemies"],["真相","The truth"],["破镜重圆","Mended"]],when:["旧恨 ≥50","Grudge ≥50"],dir:"enemies: real resentment, cutting words, a wound between them; reconciliation must be earned"},
 jealous:{ic:"😤",c:"#8BE08F",n:["修罗场线","Love triangle"],st:[["暗涌","Undercurrent"],["试探","Testing"],["争夺","Tug of war"],["摊牌","Showdown"],["独占","Mine alone"]],when:["嫉妒 ≥50","Jealousy ≥50"],dir:"a triangle: jealousy, possessiveness, someone else in the way"},
 bond:{ic:"🤝",c:"#7CC8FF",n:["知己线","Confidants"],st:[["合作","Working together"],["默契","In sync"],["依赖","Relying on you"],["越界","Crossing a line"],["共犯","Partners in crime"]],when:["信任 ≥62 且 吸引 <45","Trust ≥62, attraction <45"],dir:"partners and confidants first; romance only creeps in sideways"},
 danger:{ic:"🕷",c:"#B58CFF",n:["危险关系线","Dangerous bond"],st:[["利用","Using each other"],["怀疑","Suspicion"],["背叛","Betrayal"],["反噬","Backlash"],["救赎","Redemption"]],when:["旧恨 ≥30 且 张力 ≥55","Grudge ≥30, tension ≥55"],dir:"a dangerous bond: manipulation, doubt, betrayal and the cost of it"},
 cold:{ic:"🧊",c:"#9AA3B5",n:["疏离线","Drifting apart"],st:[["熟人","Acquaintances"],["疏远","Distant"],["冷战","Cold war"],["决裂","Broken"],["敌人","Enemies"]],when:["亲密度跌到 0 以下","Closeness below 0"],dir:"they are pulling away from the user: shorter replies, colder, boundaries up; it can still be repaired, but not cheaply"}};
const LN_T=[0,20,40,60,80],LN_COLD=[0,8,20,35,50];
function lnPair(th){try{const p=dimMain(th);if(!p)return null;dimState(th);return th.rdv[dimKey(p.a,p.b)]}catch(_){return null}}
function relLine(th,cid){const r=lnPair(th)||{},love=(th.love&&th.love[cid])||0,c=ch(cid)||{};let k="love";
 if(love<0)k="cold";else if(r.gru>=50)k="enemy";else if(r.gru>=30&&r.ten>=55)k="danger";else if(r.jea>=50)k="jealous";else if(r.ten>=55&&r.tru<45)k="rival";else if(r.tru>=62&&r.att<45)k="bond";else if(c.line0&&LINES[c.line0]&&stageOf(th,cid)<3)k=c.line0;
 const v=k==="love"?love:k==="cold"?-love:k==="rival"?r.ten:k==="enemy"?r.gru:k==="jealous"?r.jea:k==="bond"?r.tru:k==="danger"?((r.gru||0)+(r.ten||0))/2:love;
 const T=k==="cold"?LN_COLD:LN_T;let i=0;T.forEach((m,j)=>{if((v||0)>=m)i=j});return {k,i}}
function lnName(k,i){const L=LINES[k];return LL(L.n[0],L.n[1])+(i!=null?" · "+LL(L.st[i][0],L.st[i][1]):"")}
function lineCheck(th){try{if(!th||curT!==th.id)return;const cid=mainOf(th);if(!ch(cid))return;const now=relLine(th,cid);th.lnk=th.lnk||{};const was=th.lnk[cid];th.lnk[cid]=now;
 th.lnSeen=th.lnSeen||{};th.lnSeen[now.k]=1;if(!was){save();return}
 if(was.k!==now.k){lnBanner(LL("剧情反转","Plot twist"),LL("从「"+LINES[was.k].n[0]+"」转入「"+LINES[now.k].n[0]+"」","From "+LINES[was.k].n[1]+" to "+LINES[now.k].n[1]),LINES[now.k].c);
  th.msgs.push({who:"sys",k:"card",title:LINES[now.k].ic+" "+LL("发展线变了","The line just changed"),txt:LL("你们之间从「"+lnName(was.k,was.i)+"」走到了「"+lnName(now.k,now.i)+"」。","You went from "+lnName(was.k,was.i)+" to "+lnName(now.k,now.i)+"."),at:Date.now()});save();try{window.emoFx&&emoFx(now.k==="love"||now.k==="bond"?"bloom":"shock")}catch(_){}return}
 if(was.i!==now.i){const back=now.i<was.i;th.msgs.push({who:"sys",k:"card",title:(back?"↘ "+LL("关系倒退","Relationship slipped"):"↗ "+LL("关系推进","Relationship moved"))+" · "+LINES[now.k].ic,txt:LL(LINES[now.k].st[was.i][0]+" → "+LINES[now.k].st[now.i][0],LINES[now.k].st[was.i][1]+" → "+LINES[now.k].st[now.i][1]),at:Date.now()});save();if(back)lnBanner(LL("关系倒退","Slipping back"),LL(LINES[now.k].st[now.i][0],LINES[now.k].st[now.i][1]),"#9AA3B5")}
 save()}catch(_){}}
function lnBanner(a,b,c){try{const L=fxLayer(),o=document.createElement("div");o.className="lnban";o.style.setProperty("--lc",c||"#F0B77E");o.innerHTML='<small>'+esc(a)+'</small><b>'+esc(b)+'</b>';L.appendChild(o);setTimeout(()=>o.remove(),3000);typeof sfxOne==="function"&&sfxOne("unsend")}catch(_){}}
function lnTrackHTML(th,cid){const cur=relLine(th,cid),L=LINES[cur.k],love=Math.round((th.love&&th.love[cid])||0);
 return '<div class="lncard" style="--lc:'+L.c+'"><div class="row"><b class="grow">'+L.ic+' '+LL("当前发展线","Current line")+'：'+esc(LL(L.n[0],L.n[1]))+'</b><span class="xs faint num">'+LL("亲密度","Closeness")+' '+love+'</span></div>'+
  '<div class="lntrack">'+L.st.map((s,i)=>'<div class="'+(i<cur.i?"past":i===cur.i?"on":"")+'"><i></i><span>'+esc(LL(s[0],s[1]))+'</span></div>').join("")+'</div>'+
  '<p class="xs dim" style="margin-top:8px;line-height:1.55">'+LL("关系不会只往上走：冷淡、拒绝、背叛都会让它倒退，甚至反转成别的线。","It doesn't only go up: coldness, refusal or betrayal can push it back — or flip it onto another line.")+'</p>'+
  '<div class="eyebrow" style="margin-top:12px">'+LL("可能的走向","Where this could go")+'</div><div class="lnalt">'+Object.entries(LINES).filter(([k])=>k!==cur.k).map(([k,x])=>'<div class="'+((th.lnSeen||{})[k]?"seen":"")+'" style="--lc:'+x.c+'"><b>'+x.ic+' '+esc(LL(x.n[0],x.n[1]))+'</b><span>'+esc(LL(x.st.map(s=>s[0]).join("→"),x.st.map(s=>s[1]).join(" → ")))+'</span><em>'+esc(LL(x.when[0],x.when[1]))+'</em></div>').join("")+'</div></div>'}
const _usSheet45=usSheet;usSheet=function(){_usSheet45.apply(this,arguments);try{const th=S.threads[curT],sh=$(".sheet .sh-body")||$(".sheet>div:last-child")||$(".sheet");if(th&&sh){const at=sh.querySelector(".steps");const h=lnTrackHTML(th,mainOf(th));if(at)at.insertAdjacentHTML("beforebegin",h);else sh.insertAdjacentHTML("afterbegin",h)}}catch(_){}};
/* header chip with the current line */
const _renderChat45=renderChat;renderChat=function(){_renderChat45.apply(this,arguments);try{const th=S.threads[curT];if(!th)return;lineCheck(th);const cid=mainOf(th);if(!ch(cid))return;const cur=relLine(th,cid),L=LINES[cur.k];
 const host=$(".chead .dimslim")||$(".chead");if(host&&!$(".chead .lnchip"))host.insertAdjacentHTML("beforeend",'<button class="lnchip" data-us="1" style="--lc:'+L.c+'">'+L.ic+' '+esc(LL(L.st[cur.i][0],L.st[cur.i][1]))+'</button>')}catch(_){}};
const _dimFloat45=dimFloat;dimFloat=function(){_dimFloat45.apply(this,arguments);try{const th=S.threads[curT];lineCheck(th);const ch0=$(".chead .lnchip");if(ch0&&th){const c=relLine(th,mainOf(th)),L=LINES[c.k];ch0.style.setProperty("--lc",L.c);ch0.textContent=L.ic+" "+LL(L.st[c.i][0],L.st[c.i][1])}}catch(_){}};

/* ---------- personas: personality + about me, chosen per chat ---------- */
const PTRAIT=[["强势直接","Bold & direct"],["谨慎克制","Careful & guarded"],["活泼话多","Bubbly & chatty"],["毒舌嘴硬","Sharp-tongued"],["温柔体贴","Gentle & caring"],["神秘疏离","Mysterious & aloof"],["天然呆","Oblivious & sweet"]];
const _editPersona45=editPersona;editPersona=function(p){_editPersona45(p);try{p=p||{};const b=$("#pSave");if(!b)return;b.insertAdjacentHTML("beforebegin",'<div class="field"><label>'+LL("性格（角色会据此回应你）","Personality (characters react to it)")+'</label><div class="row wrap" style="gap:6px;margin-top:6px" id="peTrait">'+PTRAIT.map(([z,e])=>'<button class="chip'+(p.trait===z?" on":"")+'" data-ptr="'+z+'">'+esc(LL(z,e))+'</button>').join("")+'</div></div>'+
 '<div class="field"><label for="peAbout">'+LL("关于我（一句话）","About me (one line)")+'</label><input id="peAbout" maxlength="80" value="'+esc(p.about||"")+'" placeholder="'+esc(LL("比如：刚辞职的建筑师，嘴硬心软","e.g. an architect who just quit; all bark"))+'"></div>')}catch(_){}};
document.addEventListener("click",e=>{const x=e.target.closest("[data-ptr]");if(x){$$("#peTrait .chip").forEach(y=>y.classList.toggle("on",y===x));return}
 if(e.target.closest("#pSave")){const tr=($("#peTrait .chip.on")||{dataset:{}}).dataset.ptr||"",ab=(($("#peAbout")||{}).value||"").trim();setTimeout(()=>{const p=persona();if(p){p.trait=tr;p.about=ab;save();if(PS_FOR){const th=S.threads[PS_FOR];if(th){th.persona=Object.assign({},p);save()}PS_FOR=null}}},0)}},true);
function pLabel(p){return (p.name||me())+(p.trait?" · "+LL(p.trait,(PTRAIT.find(x=>x[0]===p.trait)||[0,p.trait])[1]):"")}
let PS_FOR=null;
function personaSwitch(){const th=S.threads[curT];if(!th)return;const cur=th.persona||persona();
 sheet('<h2>'+LL("这段关系里，你是谁？","Who are you in this one?")+'</h2><p class="sm dim" style="margin-top:4px;line-height:1.55">'+LL("同一个账号可以有很多个你。换一个人设，"+first(ch(mainOf(th)).n)+"对你说话的方式也会变。","One account, many yous. Switch persona and "+first(ch(mainOf(th)).n)+" talks to you differently.")+'</p><div class="stack" style="margin-top:10px">'+
  S.personas.map(p=>'<button class="opt" data-pswap="'+p.id+'"><span class="ic">'+esc((p.name||"?")[0])+'</span><span class="grow"><b>'+esc(pLabel(p))+'</b><span>'+esc(p.about||p.look||"")+'</span></span>'+(cur.id===p.id?'<span class="check on">✓</span>':"")+'</button>').join("")+
  '<button class="opt" data-pnew4="1"><span class="ic">＋</span><span class="grow"><b>'+t("me.addp")+'</b></span></button></div>')}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-pswap]")){const th=S.threads[curT],p=S.personas.find(q=>q.id===x.dataset.pswap);if(!th||!p)return;th.persona=Object.assign({},p);
  appendMsg(th,{who:"sys",k:"card",title:"🎭 "+LL("换了个身份","New persona"),txt:LL("你现在以「"+pLabel(p)+"」的身份和"+first(ch(mainOf(th)).n)+"相处。","You're now "+pLabel(p)+" with "+first(ch(mainOf(th)).n)+"."),at:Date.now()});save();closeSheet();renderChat();return}
 if(e.target.closest("[data-pnew4]")){PS_FOR=curT;editPersona(null);return}});

/* ---------- ⏪ back to the first meeting ---------- */
function rewindSheet(){const th=S.threads[curT];if(!th)return;
 if(th.pk&&th.wid){closeSheet();startSheet(th.wid,true);return}
 sheet('<div style="text-align:center"><div style="font-size:34px">⏪</div><h2 style="margin-top:6px">'+LL("回到初遇","Back to the first meeting")+'</h2><p class="sm dim" style="margin-top:8px;line-height:1.6">'+LL("回到你们第一次见面的那一刻。聊天和关系值清空，角色设定和你给的反馈都保留。这一次，换个方式开口。","Go back to the moment you first met. Messages and meters reset; the character and your feedback stay. Try it differently this time.")+'</p></div>'+
  '<button class="btn btn-p btn-block" style="margin-top:14px" data-rewind0="1">⏪ '+LL("回到初遇","Go back")+'</button>')}
document.addEventListener("click",e=>{if(!e.target.closest("[data-rewind0]"))return;const th=S.threads[curT];if(!th)return;let i=th.msgs.findIndex(m=>m.who==="me");if(i<0)i=th.msgs.length;
 th._undo={msgs:th.msgs,love:th.love,mem:th.mem,rounds:th.rounds,rdv:th.rdv};th.msgs=th.msgs.slice(0,i);th.rounds=0;Object.keys(th.love).forEach(c=>th.love[c]=5);th.mem=[];delete th.rdv;delete th.rdlog;delete th._stg;delete th.lnk;th.tasks={};
 th.msgs.push({who:"sys",k:"card",title:"⏪ "+LL("回到了初遇","Back to the beginning"),txt:LL("一切还没发生。这一次，你想怎么开口？","Nothing has happened yet. How do you open this time?"),at:Date.now()});save();closeSheet();renderChat()});

/* ---------- 🛠 feedback on how a character is played ---------- */
const FIXT=[["记忆混乱","Mixed-up memory","Re-read STORY SO FAR and the memory block; never contradict established facts, names or events."],["逻辑不通","Doesn't make sense","Every reply must follow logically from what was just said and done; no non-sequiturs."],["内容无聊","Boring","Raise the stakes: add a concrete detail, a want, a small conflict or a hook every reply."],
 ["反应失真","Unrealistic reactions","React the way a real person would: proportionate emotion, believable timing, no instant love or instant forgiveness."],["不像他","Out of character","Stick to the character's profile, voice and tells; no generic romance-bot lines."],["太顺从","Too agreeable","They don't agree with everything; let them refuse, argue and hold their ground."],["太冷淡","Too cold","Let a little warmth show through the guard — in actions more than words."]];
function fixSheet(){const th=S.threads[curT];if(!th)return;const cid=mainOf(th),c=ch(cid);
 sheet('<h2>🛠 '+LL("反馈"+first(c.n)+"的表现","How is "+first(c.n)+" being played?")+'</h2><p class="sm dim" style="margin-top:4px;line-height:1.55">'+LL("选出不对劲的地方，之后的回复会按这个调整。","Pick what's off — the next replies adjust to it.")+'</p>'+
  '<div class="row wrap" style="gap:6px;margin-top:12px" id="fixT">'+FIXT.map((f,i)=>'<button class="chip" data-fixt="'+i+'">'+esc(LL(f[0],f[1]))+'</button>').join("")+'</div>'+
  '<textarea id="fixTx" rows="2" class="momta" style="margin-top:10px" placeholder="'+esc(LL("具体哪里不对？（可选）比如：他忘了我说过我怕黑","What exactly? (optional) e.g. he forgot I'm scared of the dark"))+'"></textarea>'+
  '<button class="btn btn-p btn-block" style="margin-top:10px" data-fixgo="'+cid+'">'+LL("提交","Send")+'</button>'+(((S.fix||{})[cid]||[]).length?'<p class="xs faint" style="margin-top:10px">'+LL("已记录 ","On file: ")+(S.fix[cid].length)+LL(" 条 · 会一直生效"," notes · always applied")+'</p>':''))}
document.addEventListener("click",e=>{let x;if(x=e.target.closest("[data-fixt]")){x.classList.toggle("on");return}
 if(x=e.target.closest("[data-fixgo]")){const cid=x.dataset.fixgo,tags=$$("#fixT .on").map(b=>FIXT[+b.dataset.fixt]),tx=(($("#fixTx")||{}).value||"").trim();if(!tags.length&&!tx){toast(LL("选一项或写一句","Pick one or write a line"));return}
  S.fix=S.fix||{};S.fix[cid]=(S.fix[cid]||[]).concat({tags:tags.map(f=>LL(f[0],f[1])),rules:tags.map(f=>f[2]),txt:tx,at:Date.now()}).slice(-6);save();closeSheet();
  const th=S.threads[curT];if(th)appendMsg(th,{who:"sys",k:"card",title:"🛠 "+LL("收到反馈","Feedback noted"),txt:LL("之后"+first(ch(cid).n)+"的回复会调整："," "+first(ch(cid).n)+" will adjust: ")+tags.map(f=>LL(f[0],f[1])).concat(tx?["「"+tx+"」"]:[]).join("、"),at:Date.now()});renderChat()}});

/* ---------- 📤 share a chat snippet ---------- */
const SHARE_P=[["x","𝕏","X"],["facebook","f","Facebook"],["whatsapp","🟢","WhatsApp"],["instagram","📷","Instagram"],["tiktok","♪","TikTok"],["discord","🎮","Discord"]];
let SHSEL=null;
function shareSnip(){const th=S.threads[curT];if(!th)return;const L=th.msgs.map((m,i)=>[m,i]).filter(([m])=>m.txt&&(m.who==="me"||ch(m.who)||m.who==="n")).slice(-10);SHSEL=new Set(L.slice(-4).map(([,i])=>i));
 sheet('<h2>📤 '+LL("分享聊天片段","Share a snippet")+'</h2><p class="sm dim" style="margin-top:4px">'+LL("选几句，生成一张卡片，发到你的社交平台。","Pick a few lines, make a card, post it anywhere.")+'</p>'+
  '<div class="shpick">'+L.map(([m,i])=>'<button class="'+(SHSEL.has(i)?"on":"")+'" data-shm="'+i+'"><b>'+esc(m.who==="me"?me():m.who==="n"?LL("旁白","Narration"):first(ch(m.who).n))+'</b>'+esc(String(m.txt).slice(0,60))+'</button>').join("")+'</div>'+
  '<div class="shprev"><canvas id="shCv"></canvas></div><div class="shgrid">'+SHARE_P.map(([k,i,n])=>'<button data-shto="'+k+'"><i>'+i+'</i><span>'+n+'</span></button>').join("")+'<button data-shto="native"><i>⋯</i><span>'+LL("更多","More")+'</span></button><button data-shto="save"><i>⬇</i><span>'+LL("存图","Save")+'</span></button></div>'+
  '<p class="xs faint" style="text-align:center;margin-top:8px">'+LL("每天第一次分享 +💎1","First share each day: +💎1")+'</p>',()=>shDraw());setTimeout(shDraw,30)}
function shLines(){const th=S.threads[curT];return [...SHSEL].sort((a,b)=>a-b).map(i=>th.msgs[i]).filter(Boolean)}
function shText(){const th=S.threads[curT],c=ch(mainOf(th));return shLines().map(m=>(m.who==="me"?me():m.who==="n"?"":first(ch(m.who).n))+(m.who==="n"?"":": ")+String(m.txt).replace(/\*/g,"")).join("\n")+"\n\n— "+LL("在 MIRU 和 "+first(c.n)+" 继续这段故事","Continue this with "+first(c.n)+" on MIRU")}
function shUrl(){const th=S.threads[curT];return "https://miru.app/s/"+(th.wid||mainOf(th))+"?ref=share"}
async function shDraw(){const cv=$("#shCv");if(!cv)return;const th=S.threads[curT],cid=mainOf(th),c=ch(cid),L=shLines(),W=720,x=cv.getContext("2d");
 const wrap=(s,max)=>{x.font="26px system-ui,sans-serif";const out=[];let line="";for(const chr of String(s).replace(/\*/g,"")){if(x.measureText(line+chr).width>max&&line){out.push(line);line=""}line+=chr}if(line)out.push(line);return out.slice(0,6)};
 const blocks=L.map(m=>({m,lines:wrap(m.txt,m.who==="n"?W-120:W-260)}));const H=200+blocks.reduce((a,b)=>a+b.lines.length*36+44,0)+110;cv.width=W;cv.height=H;
 const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,"#1E1220");g.addColorStop(1,"#0C0A10");x.fillStyle=g;x.fillRect(0,0,W,H);
 try{const im=new Image();im.src=artSrc(cid);await im.decode();x.save();x.beginPath();x.arc(80,90,44,0,7);x.clip();const s=Math.max(88/im.width,88/im.height);x.drawImage(im,80-im.width*s/2,90-im.height*s/2,im.width*s,im.height*s);x.restore()}catch(_){}
 x.fillStyle="#fff";x.font="bold 34px Georgia,serif";x.fillText(c.n,140,82);x.fillStyle="#F0B77E";x.font="22px system-ui";const w=wd(th.wid);x.fillText(w?Lz(w.title):"MIRU",140,116);
 let y=190;blocks.forEach(({m,lines})=>{const me0=m.who==="me",nar=m.who==="n";x.font="26px system-ui,sans-serif";const bw=Math.max(...lines.map(l=>x.measureText(l).width))+40,bh=lines.length*36+20,bx=nar?60:me0?W-60-bw:60;
  x.fillStyle=nar?"rgba(255,255,255,.04)":me0?"rgba(238,111,151,.35)":"rgba(255,255,255,.1)";x.beginPath();x.roundRect?x.roundRect(bx,y,bw,bh,22):x.rect(bx,y,bw,bh);x.fill();
  x.fillStyle=nar?"#B9B2C4":"#fff";if(nar)x.font="italic 26px system-ui";lines.forEach((l,j)=>x.fillText(l,bx+20,y+40+j*36));y+=bh+24});
 x.fillStyle="rgba(255,255,255,.12)";x.fillRect(60,H-96,W-120,1);x.fillStyle="#F0B77E";x.font="bold 26px system-ui";x.fillText("MIRU",60,H-50);x.fillStyle="#bbb";x.font="22px system-ui";x.fillText(LL("在 MIRU 继续这段故事 · miru.app","Continue the story on MIRU · miru.app"),150,H-50)}
function shReward(){const d=today();if(S.shareDay!==d){S.shareDay=d;S.keys=(S.keys||0)+1;save();toast(LL("分享成功 +💎1","Shared · +💎1"))}}
function shBlob(){return new Promise(r=>{const cv=$("#shCv");if(!cv)return r(null);cv.toBlob(b=>r(b),"image/png")})}
async function shSave(){const cv=$("#shCv");if(!cv)return;const a=document.createElement("a");a.href=cv.toDataURL("image/png");a.download="miru-"+Date.now()+".png";document.body.appendChild(a);a.click();a.remove()}
document.addEventListener("click",async e=>{let x;
 if(x=e.target.closest("[data-shm]")){const i=+x.dataset.shm;SHSEL.has(i)?SHSEL.delete(i):SHSEL.add(i);x.classList.toggle("on");shDraw();return}
 if(x=e.target.closest("[data-shto]")){const k=x.dataset.shto,txt=shText(),url=shUrl(),q=encodeURIComponent;
  const open=u=>{const a=document.createElement("a");a.href=u;a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove()};
  if(k==="x"){open("https://twitter.com/intent/tweet?text="+q(txt.slice(0,230))+"&url="+q(url));shReward();return}
  if(k==="facebook"){open("https://www.facebook.com/sharer/sharer.php?u="+q(url)+"&quote="+q(txt.slice(0,300)));shReward();return}
  if(k==="whatsapp"){open("https://wa.me/?text="+q(txt+"\n"+url));shReward();return}
  if(k==="native"){try{const b=await shBlob(),f=b&&new File([b],"miru.png",{type:"image/png"});if(navigator.share){await navigator.share(f&&navigator.canShare&&navigator.canShare({files:[f]})?{files:[f],text:txt,url}:{text:txt,url});shReward()}else{toast(LL("这个设备不支持系统分享","System share isn't available here"))}}catch(_){}return}
  if(k==="save"){shSave();return}
  /* instagram / tiktok / discord: no web share link — save the card + copy the caption */
  shSave();try{await navigator.clipboard.writeText(txt+"\n"+url)}catch(_){}toast(LL("卡片已保存、文案已复制，打开 "+x.textContent.replace(/^\S+/,"").trim()+" 发布即可","Card saved and caption copied — open "+x.textContent.replace(/^\S+/,"").trim()+" to post"));
  if(k==="discord")open("https://discord.com/channels/@me");shReward()}});

/* ---------- chat menu: new entries on top ---------- */
const _menuSheet45=menuSheet;menuSheet=function(){_menuSheet45.apply(this,arguments);try{const th=S.threads[curT],st=$(".sheet .stack");if(!th||!st)return;const p=th.persona||persona(),cid=mainOf(th),mine=S.mine.chars[cid];
 st.insertAdjacentHTML("afterbegin",
  '<button class="opt" data-pswitch="1"><span class="ic">🎭</span><span class="grow"><b>'+LL("我的人设","My persona")+'</b><span>'+esc(pLabel(p))+'</span></span><span style="color:var(--gold)">⇄</span></button>'+
  '<button class="opt" data-rewind="1"><span class="ic">⏪</span><span class="grow"><b>'+(th.pk?LL("重新开始（重选身份）","Restart (pick your role)"):LL("回到初遇","Back to the first meeting"))+'</b><span>'+LL("选错了也没关系，从头再来","Took a wrong turn? Start over")+'</span></span></button>'+
  '<button class="opt" data-fixsheet="1"><span class="ic">🛠</span><span class="grow"><b>'+LL("反馈角色表现","Feedback on the character")+'</b><span>'+LL("记忆混乱、逻辑不通、无聊、不像他……","Memory, logic, boring, out of character…")+'</span></span></button>'+
  '<button class="opt" data-shsnip="1"><span class="ic">📤</span><span class="grow"><b>'+LL("分享聊天片段","Share a snippet")+'</b><span>X · Facebook · WhatsApp · Instagram · TikTok · Discord</span></span></button>'+
  (mine?'<button class="opt" data-sdedit="'+cid+'"><span class="ic">✏️</span><span class="grow"><b>'+LL("打磨这个角色","Polish this character")+'</b></span></button>':''))}catch(_){}};
document.addEventListener("click",e=>{if(e.target.closest("[data-pswitch]")){personaSwitch();return}if(e.target.closest("[data-rewind]")){rewindSheet();return}if(e.target.closest("[data-fixsheet]")){fixSheet();return}if(e.target.closest("[data-shsnip]")){shareSnip();return}});

/* ---------- supporting character joins solo chats; narrator voice ---------- */
const _newThread45=newThread;newThread=function(kind,id,openId,extra){const th=_newThread45(kind,id,openId,extra);try{const c=ch(id);if(kind==="solo"&&c&&c.side&&ch(c.side)&&!th.cast.includes(c.side)){th.cast.push(c.side);th.love[c.side]=5;
 if(c.sideLine)th.msgs.push({who:c.side,k:"say",txt:String(c.sideLine).replace(/^\*[^*]*\*\s*/,""),at:Date.now()+1});const m=String(c.sideLine||"").match(/^\*([^*]*)\*/);if(m)th.msgs.splice(th.msgs.length-1,0,{who:"n",k:"act",txt:m[1],at:Date.now()});save()}}catch(_){}return th};
const NV_P={radio:{pitch:.92,rate:.94},film:{pitch:.97,rate:.96},soft:{pitch:1.08,rate:.97},noir:{pitch:.9,rate:.92}};
const _speak45=speak;speak=function(text,id,onend){try{const th=S.threads[curT],w=th&&wd(th.wid),nv=w&&w.nv;if((!id||id==="n")&&nv){if(nv==="off"){if(onend)setTimeout(onend,50);return}const P=NV_P[nv];if(P&&"speechSynthesis" in window&&!recorded(text,id)){stopVoice();const u=new SpeechSynthesisUtterance(String(text).replace(/[*()（）]/g,""));u.lang=LTAG[S.lang];u.pitch=P.pitch;u.rate=P.rate;if(onend)u.onend=onend;speechSynthesis.speak(u);return}}}catch(_){}return _speak45(text,id,onend)};

/* ---------- everything above, written into the live prompt ---------- */
const _ask45=ask;ask=function(prompt,opts){let chat=false,th=null,cid=null;try{th=S.threads[curT];if(typeof prompt==="string"&&prompt.indexOf("You write MIRU")===0&&th){chat=true;cid=mainOf(th);const c=ch(cid),p=th.persona||persona(),add=[];
  if(p&&(p.trait||p.about))add.push("THE USER'S PERSONA IN THIS CHAT: "+(p.name||"the user")+(p.trait?" — personality: "+(PTRAIT.find(x=>x[0]===p.trait)||[0,p.trait])[1]:"")+(p.about?" — about them: "+p.about:"")+". Let it shape how the characters treat them: a bold persona gets pushback and sparks, a guarded one gets coaxed, a playful one gets teased. Never write the user's lines.");
  if(c){const L=relLine(th,cid),Ln=LINES[L.k];add.push("RELATIONSHIP LINE with "+c.n+": "+Ln.n[1]+" — current stage '"+Ln.st[L.i][1]+"'. Write toward this: "+Ln.dir+". Closeness "+Math.round(th.love[cid]||0)+" (can be negative).")}
  add.push("RELATIONSHIPS CAN GO BACKWARD: characters do not love the user unconditionally. If the user is cruel, dismissive, dishonest, pushy or betrays them, give a NEGATIVE love score (down to -8) and let them pull away, go cold, refuse, or turn hostile. Conflict and rejection are part of the story. Also return \"rd\":{\"att\":-6..6,\"tru\":-6..6,\"jea\":-6..6,\"ten\":-6..6,\"gru\":-6..6} for how this reply moved attraction, trust, jealousy, tension and grudge between the user and "+(c?c.n:"them")+".");
  if(c&&c.side&&th.cast.includes(c.side)){const s=ch(c.side);add.push("SUPPORTING CHARACTER id="+c.side+" · "+s.n+": "+Lz(s.role)+" Bring them in now and then (not every reply) to "+(c.sideFn||"stir things up")+": friction, jealousy, or a turn in the relationship. Never let them take over.")}
  th.cast.forEach(id=>{const F=(S.fix||{})[id];if(F&&F.length&&ch(id))add.push("PLAYER NOTES ON HOW "+ch(id).n+" HAS BEEN PLAYED — fix these now: "+[...new Set(F.flatMap(f=>f.rules))].join(" ")+F.filter(f=>f.txt).map(f=>" Specifically: \""+f.txt+"\".").join(""))});
  if(c&&c.callYou)add.push(c.n+" calls the user \""+c.callYou+"\".");
  prompt=prompt.replace("STORY SO FAR:",add.join("\n")+"\nSTORY SO FAR:").replace('"love":{"<cast id>":0-6}','"love":{"<cast id>":-8 to 6},"rd":{"att":0,"tru":0,"jea":0,"ten":0,"gru":0}')}}catch(_){}
 const pr=_ask45(prompt,opts);if(!chat)return pr;
 return pr.then(r=>{try{if(r&&r.love){const neg={};Object.keys(r.love).forEach(id=>{const v=+r.love[id]||0;if(v<0){neg[id]=Math.max(-8,v);r.love[id]=0}});
   if(Object.keys(neg).length)setTimeout(()=>{Object.keys(neg).forEach(id=>{if(th.love[id]!=null){th.love[id]=Math.max(-60,th.love[id]+neg[id]);try{dimFloat&&0}catch(_){}}});save();lineCheck(th);if(curT===th.id)toast("↘ "+LL(first(ch(cid).n)+"和你之间冷了一点",first(ch(cid).n)+" just cooled toward you"))},900)}
  if(r&&r.rd&&typeof r.rd==="object"){const p=dimMain(th);if(p){const d={};DIMK.forEach(k=>{const v=Math.max(-6,Math.min(6,+r.rd[k]||0));if(v)d[k]=v});if(Object.keys(d).length)setTimeout(()=>{dimAdd(th,dimKey(p.a,p.b),d,"chat");lineCheck(th)},1200)}}}catch(_){}return r})};

/* ---------- character moments that remember ---------- */
function cmMemOf(th){const u=[...th.msgs].reverse().find(m=>m.who==="me"&&m.txt&&m.k!=="img"&&String(m.txt).length>3);const q=u?String(u.txt).replace(/\*/g,"").trim():"";return q.length>24?q.slice(0,22)+"…":q||((th.mem||[]).slice(-1)[0]||"").slice(0,24)}
const CMT={zh:{post:["有人跟我说「{q}」。\n我记性一向不好。这句除外。","路过{place}。\n又想起那句「{q}」。","今天没什么特别的。\n只是有句话在脑子里转了一整天。","「{q}」\n——记下了。别问是谁说的。"],
  jea:[["「{q}」？谁说的？","跟你有关系吗。","有啊。我也在等这个人回消息。"],["这条是发给谁看的，大家心里有数。","删了。","截图了。"],["难得见你半夜发东西。","睡不着。","因为谁？"]],
  calm:[["难得见你发这种。","手滑。"],["？","没事。"],["今晚还出来吗","不了。"]]},
 en:{post:["Someone told me \"{q}\".\nI'm bad at remembering things. Not this one.","Walked past {place}.\nThought about \"{q}\" again.","Nothing special today.\nJust one sentence I couldn't shake.","\"{q}\"\n— noted. Don't ask who said it."],
  jea:[["\"{q}\"? Who said that?","How is that your business.","It is. I'm waiting on the same person to text back."],["We all know who this is for.","Deleting it.","Screenshotted."],["Posting at 2 a.m.? You?","Couldn't sleep.","Because of who?"]],
  calm:[["Didn't think you posted stuff like this.","Thumb slipped."],["?","Nothing."],["Coming out tonight?","No."]]}};
function cmGen(force){try{S.cmoms=S.cmoms||[];const now=Date.now(),day=today();S.cmDay=S.cmDay&&S.cmDay.d===day?S.cmDay:{d:day,n:0};if(!force&&S.cmDay.n>=3)return;
 const ths=Object.values(S.threads).filter(th=>ch(mainOf(th))&&th.msgs.some(m=>m.who==="me"&&m.txt)).sort((a,b)=>b.at-a.at);
 for(const th of ths){const cid=mainOf(th);const last=S.cmoms.find(p=>p.who===cid);if(last&&now-last.at<4*36e5)continue;const q=cmMemOf(th);if(!q)continue;
  const T=CMT[S.lang==="zh"?"zh":"en"],i=hash(cid+q)%T.post.length,place=String((th.status&&th.status.place)||LL("那家店","that place")).split(/→|·/).pop().trim();
  const others=Object.values(S.threads).map(t2=>mainOf(t2)).filter(x=>x!==cid&&ch(x));const sameW=(wd(ch(cid).w)||{cast:[]}).cast.filter(x=>x!==cid&&ch(x));
  const rival=[...new Set(others)][0],mate=sameW[0]||rival;const likes=[...new Set([mate,rival].concat(sameW.slice(1,3)))].filter(Boolean).slice(0,3);
  const jw=rival||(mate&&ch(mate).sideOf?mate:null);const cm=[];if(jw){const J=T.jea[hash(q)%T.jea.length];cm.push({who:jw,txt:J[0].replace("{q}",q),jea:1,re:{who:cid,txt:J[1]},re2:J[2]?{who:jw,txt:J[2]}:null})}
  else if(mate){const C=T.calm[hash(q)%T.calm.length];cm.push({who:mate,txt:C[0],re:{who:cid,txt:C[1]}})}
  const p={id:"cm"+now,who:cid,tid:th.id,txt:T.post[i].replace("{q}",q).replace("{place}",place),mem:q,at:now,likes,cm,photo:hash(q)%2===0};S.cmoms.unshift(p);S.cmoms=S.cmoms.slice(0,20);S.cmDay.n++;save();
  if(liveOn())cmLive(p,th);return p}}catch(_){}}
async function cmLive(p,th){try{const c=ch(p.who),names=[...new Set(p.likes.concat(p.cm.map(x=>x.who)))].map(id=>id+"="+ch(id).n).join(", ");
 const r=await ask("Write a social-media style 'moment' posted by "+c.n+" ("+Lz(c.vibe)+") in a romance drama app. It must clearly remember something specific the user said or did: \""+p.mem+"\" (recent memory: "+(th.mem||[]).slice(-3).join("; ")+"). Don't name the user. 1-3 short lines, in character, a little guarded. Then 1-2 comments by these characters: "+names+" — if a commenter also has feelings for the user, make it a jealous, sharp exchange with "+c.n+" replying. Language: "+LANG_NAME[S.lang]+'. Reply ONLY JSON {"post":"...","comments":[{"who":"<id>","txt":"...","reply":"<'+c.n+'\'s reply or empty>"}]}');
 if(r&&r.post){p.txt=String(r.post);if(Array.isArray(r.comments)&&r.comments.length)p.cm=r.comments.filter(x=>x&&ch(x.who)&&x.txt).slice(0,3).map(x=>({who:x.who,txt:String(x.txt),re:x.reply?{who:p.who,txt:String(x.reply)}:null}));save();if(chatSeg==="moments"&&S.lastTab==="chats")renderTab("chats")}}catch(_){}}
function cmHTML(p){const c=ch(p.who);if(!c)return"";const liked=(S.cmLiked||{})[p.id];const nm=id=>esc(first(ch(id).n));
 return '<div class="post cmpost"><div class="hd">'+avatar(p.who,34)+'<div class="grow"><b class="sm">'+esc(c.n)+'</b><div class="xs faint">'+ago(p.at)+'</div></div></div>'+
  '<p class="cmtx">'+esc(p.txt).replace(/\n/g,"<br>")+'</p>'+(p.photo?'<div class="cmph">'+img(p.who,"art","aspect-ratio:16/10;border-radius:14px")+'</div>':'')+
  '<div class="cmmem">💭 '+LL("记得你说过：","Remembers you said: ")+'「'+esc(p.mem)+'」</div>'+
  '<div class="acts"><button class="'+(liked?"liked":"")+'" data-cmlike="'+p.id+'">'+ic("heart")+'<span class="num">'+(p.likes.length+(liked?1:0))+'</span></button></div>'+
  (p.likes.length?'<div class="cmlikes">♥ '+p.likes.filter(id=>ch(id)).map(nm).join("、")+(liked?"、"+esc(me()):"")+'</div>':'')+
  (p.cm.length?'<div class="cmcm">'+p.cm.map(x=>'<div'+(x.jea?' class="jea"':'')+'><b>'+nm(x.who)+'</b> '+esc(x.txt)+'</div>'+(x.re&&ch(x.re.who)?'<div class="re"><b>'+nm(x.re.who)+'</b> '+LL("回复","→")+' <b>'+nm(x.who)+'</b> '+esc(x.re.txt)+'</div>':'')+(x.re2&&ch(x.re2.who)?'<div class="re"><b>'+nm(x.re2.who)+'</b> '+LL("回复","→")+' <b>'+nm(x.re.who)+'</b> '+esc(x.re2.txt)+'</div>':'')).join("")+(p.cm.some(x=>x.jea)?'<div class="cmjea">🔥 '+LL("评论区有点火药味","Things are heating up in the comments")+'</div>':'')+'</div>':'')+
  '<div class="reply"><input id="r_'+p.id+'" placeholder="'+esc(t("post.reply",{n:first(c.n)}))+'"><button class="btn btn-g btn-sm" data-cmre="'+p.who+'|'+p.id+'">'+t("post.send")+'</button></div></div>'}
const _renderChats45=renderChats;renderChats=function(v){if(chatSeg==="moments")cmGen();_renderChats45(v);try{if(chatSeg!=="moments")return;const at=v.querySelector(".scroll > p.xs.faint.pad")||v.querySelector("#myMoms");const L=(S.cmoms||[]).filter(p=>ch(p.who)).slice(0,8);if(at&&L.length)at.insertAdjacentHTML("afterend",'<div class="cmsec">'+L.map(cmHTML).join("")+'</div>')}catch(_){}};
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-cmlike]")){S.cmLiked=S.cmLiked||{};const id=x.dataset.cmlike;S.cmLiked[id]=!S.cmLiked[id];save();renderTab("chats");return}
 if(x=e.target.closest("[data-cmre]")){const[cid,pid]=x.dataset.cmre.split("|");const i=$("#r_"+pid),v=(i&&i.value||"").trim();if(!v)return;i.value="";const p=(S.cmoms||[]).find(q=>q.id===pid);sendDM(cid,(p?LL("（回复你的动态「"+p.mem+"」）","(replying to your post about \""+p.mem+"\") "):"")+v);toast(LL("已发进你们的聊天","Sent to your chat"))}});

(function(){const st=document.createElement("style");st.textContent=`
.lncard{margin:0 0 14px;padding:12px 14px;border-radius:16px;background:linear-gradient(135deg,color-mix(in srgb,var(--lc) 16%,transparent),rgba(255,255,255,.03));border:1px solid color-mix(in srgb,var(--lc) 45%,transparent)}
.lntrack{display:flex;gap:4px;margin-top:10px}.lntrack div{flex:1;text-align:center}.lntrack i{display:block;height:5px;border-radius:9px;background:rgba(255,255,255,.12)}.lntrack .past i{background:color-mix(in srgb,var(--lc) 60%,transparent)}.lntrack .on i{background:var(--lc);box-shadow:0 0 10px var(--lc)}
.lntrack span{display:block;font-size:11px;margin-top:5px;color:#999}.lntrack .on span{color:#fff;font-weight:800}
.lnalt{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}.lnalt div{padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);opacity:.75}.lnalt div.seen{opacity:1;border-color:color-mix(in srgb,var(--lc) 50%,transparent)}
.lnalt b{display:block;font-size:12.5px}.lnalt span{display:block;font-size:10.5px;color:#aaa;margin-top:3px;line-height:1.45}.lnalt em{display:block;font-style:normal;font-size:10px;color:var(--lc);margin-top:4px}
.lnchip{margin-left:6px;padding:2px 8px;border-radius:99px;font-size:11px;font-weight:700;border:1px solid color-mix(in srgb,var(--lc) 60%,transparent);color:#fff;background:color-mix(in srgb,var(--lc) 18%,transparent);white-space:nowrap}
.lnban{position:absolute;left:50%;top:26%;transform:translateX(-50%);text-align:center;padding:16px 26px;border-radius:18px;background:rgba(12,10,16,.9);border:1px solid var(--lc);box-shadow:0 0 50px color-mix(in srgb,var(--lc) 45%,transparent);color:#fff;animation:stgban 3s ease forwards;z-index:27}
.lnban small{display:block;font-size:11px;letter-spacing:.25em;font-weight:800;color:var(--lc)}.lnban b{display:block;font-size:20px;font-weight:900;margin-top:4px}
.shpick{display:flex;flex-direction:column;gap:5px;margin-top:10px;max-height:190px;overflow:auto}.shpick button{text-align:left;padding:7px 10px;border-radius:10px;background:var(--panel2);border:1px solid var(--line);font-size:12.5px;line-height:1.45;opacity:.6}.shpick button.on{opacity:1;border-color:var(--gold)}.shpick b{margin-right:6px;color:var(--gold)}
.shprev{margin-top:10px;border-radius:14px;overflow:hidden;max-height:260px;overflow-y:auto}.shprev canvas{width:100%;display:block}
.shgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:12px}.shgrid button{display:flex;flex-direction:column;align-items:center;gap:4px;padding:8px 0;border-radius:12px;background:var(--panel2);font-size:11px}.shgrid i{font-style:normal;font-size:20px;font-weight:900}
.cmsec .cmtx{padding:4px 16px 0;font-size:15px;line-height:1.65}.cmph{margin:8px 16px 0}.cmmem{margin:8px 16px 0;font-size:11.5px;color:#C9B6FF;background:rgba(160,130,255,.1);border-radius:8px;padding:4px 8px;display:inline-block}
.cmlikes{padding:0 16px;font-size:12px;color:#FF9AB5}.cmcm{margin:6px 16px 0;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.05);font-size:13px;line-height:1.6}.cmcm .re{padding-left:12px;color:#ccc}.cmcm .jea b:first-child{color:#8BE08F}.cmjea{margin-top:4px;font-size:11px;color:#FFB35C}`;document.head.appendChild(st)})();
