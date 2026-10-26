/* ================= STORY v2 — clear intro, merged narration boxes, choices inside the chat, scene photos, real branching, read-aloud ================= */
/* 1) Chat background = a photo of the current scene (no video for now). Scene beats: ["sys","scene",{img,place,time}] */
const NO_VIDEO_BG=true;
function sceneSrc(th,img){return img?"art/scenes/"+img+".jpg":artSrc(th.wid)}
function sceneBg(th,img){const box=$("#cbImg");if(!box)return;const src=sceneSrc(th,img);if(box.dataset.scene===src)return;box.dataset.scene=src;box.dataset.clip="";box.dataset.who="";
 box.classList.remove("vmode","duo");POSES.forEach(p=>box.classList.remove("p-"+p));
 const im=document.createElement("img");im.className="scimg";im.alt="";im.onerror=()=>{if(im.dataset.fb)return;im.dataset.fb=1;im.src=artSrc(th.wid)};im.src=src;box.appendChild(im);
 requestAnimationFrame(()=>{im.classList.add("on");setTimeout(()=>[...box.children].forEach(x=>{if(x!==im)x.remove()}),900)})}
const _chatBgSet2=chatBgSet;
chatBgSet=function(who,pose){const th=S.threads[curT];
 if(th&&th.pk&&th.pk.bg){sceneBg(th,th.pk.bg);return}
 if(NO_VIDEO_BG&&th&&th.wid&&SCENE[th.wid]){const keep=SCENE[th.wid];SCENE[th.wid]=null;try{_chatBgSet2(who,pose)}finally{SCENE[th.wid]=keep}return}
 _chatBgSet2(who,pose)};

/* 2) directives inside a chapter: scene change, conditions (earlier choices / flags / affection), flags */
function pkCond(th,c){if(!c)return false;const F=th.pk.flags||{};
 if(c.pick)return th.pk.picks[c.pick[0]]===c.pick[1];
 if(c.flag)return !!F[c.flag];
 if(c.not)return !F[c.not];
 if(c.love){const v=th.love[c.love[0]]||0;return v>=c.love[1]}
 if(c.any)return c.any.some(x=>pkCond(th,x));
 if(c.all)return c.all.every(x=>pkCond(th,x));return false}
function pkSet(th,s){if(!s)return;th.pk.flags=th.pk.flags||{};(Array.isArray(s)?s:[s]).forEach(f=>th.pk.flags[f]=1)}
function pkDirective(th,b){if(!(Array.isArray(b)&&b[0]==="sys"))return false;const d=b[2]||{};
 if(b[1]==="scene"){th.pk.q.shift();th.pk.bg=d.img||null;if(d.place)th.status.place=d.place;if(d.time)th.status.time=d.time;
  appendMsg(th,{who:"sys",k:"scene",place:d.place||"",time:d.time||"",at:Date.now()});if(curT===th.id){sceneBg(th,th.pk.bg);statusSync(th)}save();return true}
 if(b[1]==="if"){th.pk.q.shift();th.pk.q.unshift(...((pkCond(th,d.cond)?d.then:d.else)||[]));save();return true}
 if(b[1]==="set"){th.pk.q.shift();pkSet(th,d.flags||d.flag);save();return true}
 return false}
function statusSync(th){const s=$(".status");if(!s)return;const sp=[...s.children].filter(x=>!x.classList.contains("pairchip"));
 if(sp[0]&&th.status.time)sp[0].innerHTML='🕰 <span>'+esc(th.status.time)+'</span>';if(sp[1]&&th.status.place)sp[1].innerHTML='📍 <span>'+esc(th.status.place)+'</span>'}

/* 3) narration, actions and thoughts that belong to the same moment go into ONE box instead of a string of separate lines */
function isNarr(m){return m&&m.pk&&(m.who==="n"||m.k==="act"||m.k==="think")&&m.who!=="me"}
function pkAppend(th,m){const i=th.msgs.length-1,L=th.msgs[i];
 /* 2026-10-27 Ann：强制剧情的台词没有接入语音 —— 剧本段一条都没念。
    这里补上：非旁白、且开了自动语音时，把这一条推进同一个语音队列（和模型回复共用 VOICE_BUSY 计数）。 */
 try{
  if(m&&m.txt&&m.who!=="n"&&m.who!=="sys"&&typeof speakQueue==="function"&&S.voice&&S.voice.auto&&typeof voiceAutoOK==="function"&&voiceAutoOK())
   speakQueue([{txt:m.txt,who:m.who}]);
 }catch(_){}
 if(!isNarr(m)){appendMsg(th,m);return}
 const part={who:m.who,k:m.who==="n"?"act":m.k,txt:m.txt};
 if(L&&L.k==="box"&&L.pk&&L.parts.length<MIRU_TUNE.chat.partMergeMax){L.parts.push(part);L.txt+=" "+m.txt;L.last=m.txt;L.lastWho=m.who;th.at=Date.now();save();
  const el=$('#msgs [data-mi="'+i+'"]');if(el&&curT===th.id){el.outerHTML=msgHTML(L,i,th);scrollChat()}return}
 appendMsg(th,{who:"n",k:"box",pk:1,parts:[part],txt:m.txt,last:m.txt,lastWho:m.who,at:Date.now()})}
function boxHTML(m,i,th){return '<div class="m-box" data-mi="'+i+'">'+m.parts.map(p=>{if(p.who==="n")return '<p>'+esc(p.txt)+'</p>';const c=ch(p.who);
  const nm=c?first(c.n):"";return '<p class="'+(p.k==="think"?"bth":"bac")+'"><b style="color:'+(c?c.pal[0]:"")+'">'+esc(nm)+(p.k==="think"?' · '+t("st2.thinks"):'')+'</b>'+esc(p.txt)+'</p>'}).join("")+'</div>'}

/* 4) the story intro: background, who you are, who everyone is, how to play */
function introHTML(th){const w=wd(th.wid);let I=Lz(w.pack.intro)||{};if(th&&th.pk&&th.pk.as&&I["as_"+th.pk.as])I=Object.assign({},I,I["as_"+th.pk.as]);const L=x=>esc(x||"");
 return '<div class="m-intro"><div class="mi-cover" style="background-image:url('+artSrc(w.cover?w.id:w.cast[0])+')"><div></div><h2>'+L(Lz(w.title))+'</h2></div>'+
  '<div class="mi-sec"><div class="eyebrow">'+t("st2.bg")+'</div>'+(I.bg||[Lz(w.premise)]).map(p=>'<p>'+L(p)+'</p>').join("")+'</div>'+
  '<div class="mi-sec you"><div class="eyebrow">'+t("st2.you")+'</div><p>'+L(I.you||Lz(w.you))+'</p></div>'+
  '<div class="mi-sec"><div class="eyebrow">'+t("st2.cast")+'</div>'+(I.cast||w.cast.map(id=>[id,""])).map(([id,d])=>ch(id)?'<div class="mi-c">'+avatar(id,40)+'<div><b>'+esc(ch(id).n)+(id===th.pk.as?' <em>'+t("st2.isYou")+'</em>':'')+'</b><span>'+L(d)+'</span></div></div>':'').join("")+'</div>'+
  (I.how?'<div class="mi-sec"><div class="eyebrow">'+t("st2.how")+'</div>'+I.how.map(p=>'<p class="mi-h">'+L(p)+'</p>').join("")+'</div>':'')+
  '<div class="mi-sec"><div class="eyebrow">'+t("st3.legend")+'</div><div class="mi-leg">'+
   '<div><span class="lg-bub">'+t("st3.lgSay")+'</span><em>'+t("st3.lgSayD")+'</em></div>'+
   '<div><span class="lg-me">'+t("st3.lgMe")+'</span><em>'+t("st3.lgMeD")+'</em></div>'+
   '<div><span class="mt act">✱ '+t("st3.lgAct")+'</span><em>'+t("st3.lgActD")+'</em></div>'+
   '<div><span class="mt think">💭 '+t("st3.lgThink")+'</span><em>'+t("st3.lgThinkD")+'</em></div>'+
   '<div><span class="lg-n">'+t("st3.lgN")+'</span><em>'+t("st3.lgND")+'</em></div>'+
   '<div><span class="lg-ev">⚡ '+t("st3.lgEv")+'</span><em>'+t("st3.lgEvD")+'</em></div></div></div></div>'}
function introSheet(wid){const th=S.threads[curT];if(!th||!wd(wid).pack.intro)return;sheet(introHTML(th))}

/* message rendering: new kinds + no per-line speaker/share buttons */
const _msgHTML2=msgHTML;
msgHTML=function(m,i,th){
 if(m.k==="box")return boxHTML(m,i,th);
 if(m.k==="scene")return '<div class="m-scene" data-mi="'+i+'"><span>📍 '+esc(m.place)+'</span>'+(m.time?'<em>'+esc(m.time)+'</em>':'')+'</div>';
 if(m.k==="intro")return introHTML(th);
 return _msgHTML2(m,i,th).replace(/<div class="mquick[^"]*">(?:<button[^>]*>[^<]*<\/button>)*<\/div>/g,"")};

/* 5) the panel lives INSIDE the conversation (choices look like replies), not as a big box over the screen */
appendMsg=function(th,m){if(ch(m.who)&&m.ai){payHooks(th,m);storyHooks(th,m)}if(m&&m.seen===undefined)m.seen=(th.present||th.cast||[]).slice();th.msgs.push(m);th.at=Date.now();save();if(curT===th.id&&ch(m.who))chatBgSet(m.who,poseOf(m));
 const box=$("#msgs");if(curT===th.id&&box&&!$("#s-chat").hidden){const pw=$("#pkwrap"),html=msgHTML(m,th.msgs.length-1,th);
  if(pw&&pw.parentNode===box)pw.insertAdjacentHTML("beforebegin",html);else box.insertAdjacentHTML("beforeend",html);scrollChat()}
 if(S.autoVoice&&m.ai&&ch(m.who)&&curT===th.id)speak(m.txt,m.who)};
const _renderChat2=renderChat;
renderChat=function(){_renderChat2.apply(this,arguments);const th=S.threads[curT];if(!th)return;
 const box=$("#msgs"),pw=$("#pkwrap");if(box&&pw){box.appendChild(pw);pw.classList.add("inl")}
 const hd=$(".chead [data-cmenu]");if(hd&&!$(".chead .vtog"))hd.insertAdjacentHTML("beforebegin",'<button class="ibtn vtog'+(S.autoVoice?" on":"")+'" data-vtog="1" aria-label="voice">'+(S.autoVoice?"🔊":"🔇")+'</button>');
 const ti=$(".chead [data-us]");if(ti&&th.pk&&wd(th.wid).pack.intro){ti.dataset.us="";ti.setAttribute("data-intro",th.wid)}
 if(th.pk&&th.pk.bg)sceneBg(th,th.pk.bg);scrollChat()};
const _packRefresh2=packRefresh;
packRefresh=function(th){_packRefresh2(th);if(curT===th.id){const pw=$("#pkwrap"),box=$("#msgs");if(pw&&box&&pw.parentNode!==box)box.appendChild(pw);scrollChat()}};

/* 6) read aloud: ONE switch in the header. On = every line is read in its speaker's voice, one after another. Off = silent. */
function speakLine(m,done){if(!m){done();return}const who=m.k==="box"?(m.lastWho||"n"):m.who==="me"?null:m.who,txt=m.k==="box"?(m.last||m.txt):m.txt;
 if(!txt||m.k==="scene"||m.k==="chap"||m.k==="card"||m.k==="intro"){done();return}try{speak(String(txt).replace(/^📞\s*/,""),who||"n",done)}catch(_){done()}}
function pkWait(th,prev,spd,ms){return new Promise(r=>{let ok=false;const go=()=>{if(ok)return;ok=true;r()};PKNEXT[th.id]=go;
 if(S.autoVoice){speakLine(prev,()=>setTimeout(go,300));setTimeout(go,Math.max(ms*3,14000))}else if(spd)setTimeout(go,ms)})}
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-vtog]")){S.autoVoice=!S.autoVoice;save();const b=$(".vtog");if(b){b.classList.toggle("on",S.autoVoice);b.textContent=S.autoVoice?"🔊":"🔇"}
  if(!S.autoVoice){stopVoice()}toast(t(S.autoVoice?"st2.vOn":"st2.vOff"));if(PKNEXT[curT]&&!S.autoVoice)PKNEXT[curT]();return}
 if(x=e.target.closest("[data-intro]")){introSheet(x.dataset.intro);return}
 if(e.target.closest("[data-pknext],[data-pknextl],[data-stopline],[data-pkpick]"))stopVoice()},true);

Object.assign(I18N.en,{"st2.thinks":"thinks","st2.bg":"The story so far","st2.you":"Who you are","st2.cast":"Who's who","st2.isYou":"you","st2.how":"How to play","st2.start":"Start Chapter 1","st2.vOn":"Read-aloud on — every line is voiced","st2.vOff":"Read-aloud off","st2.soon":"Chapter {n} is being written — coming very soon."});
Object.assign(I18N.zh,{"st2.thinks":"心想","st2.bg":"故事背景","st2.you":"你是谁","st2.cast":"人物介绍","st2.isYou":"你","st2.how":"怎么玩","st2.start":"开始第一章","st2.vOn":"已开启朗读：每句话都会读出来","st2.vOff":"已关闭朗读","st2.soon":"第 {n} 章正在制作中，很快上线。"});

/* ================= v2.1 — the app's own features inside the story, dramatic event cards, speed control, clear message types ================= */
/* A "feature" stop opens one of the app's real features aimed at a specific character, then the story continues with scripted reactions:
   snap = 拍立得 four-frame strip · quiz = 默契问答 · lie = 两真一假 · heart = 心跳测试 · bottle = 真心话转瓶 · date = 约会地点
   Data: {k, cid, hint, win:[beats], lose:[beats], then:[beats], skip:[beats]}  (win/lose chosen from the result; then used if missing) */
const FEATK={snap:{ic:"📸",run:c=>booth(c),t:"st3.snap"},quiz:{ic:"💞",run:c=>quiz(c),t:"st3.quiz"},lie:{ic:"🕵️",run:()=>lieGame(),t:"st3.lie"},
 heart:{ic:"💓",run:()=>heartGame(),t:"st3.heart"},bottle:{ic:"🍾",run:()=>bottleGame(),t:"st3.bottle"},date:{ic:"🌙",run:()=>dateSheet(),t:"st3.date"}};
let PKFEAT=null;
const _mainOf3=mainOf;mainOf=function(th){if(PKFEAT&&th===PKFEAT.th&&PKFEAT.cid)return PKFEAT.cid;const m=_mainOf3(th);
 /* the reader's own character is never "the one you're talking to" */
 if(th&&th.pk&&m===th.pk.as){const o=th.cast.find(c=>c!==th.pk.as&&ch(c));if(o)return o}return m};
function featDone(th,ctx){const f=PKFEAT;if(!f||f.th!==th)return false;PKFEAT=null;const d=f.d,txt=String(ctx&&ctx.txt||"");
 let win=true;if(f.k==="quiz")win=qz&&qz.score>=3;if(f.k==="lie")win=/caught/.test(txt);if(f.k==="heart"){const m=txt.match(/to (\d+) bpm/);win=m?+m[1]>=150:true}
 const extra=(win?d.win:d.lose)||d.then||[];setTimeout(()=>stopResolve(th,extra),500);return true}
const _reply3=reply;reply=function(th,ctx,silent){if(featDone(th,ctx))return Promise.resolve();return _reply3(th,ctx,silent)};
STOPK.add("feature");
const _stopHTML3=stopHTML;
stopHTML=function(th){const b=th.pk.stop,k=b[1],d=b[2];if(k!=="feature")return _stopHTML3(th);const F=FEATK[d.k]||{},c=ch(d.cid||mainOf(th));
 return '<div class="sttag">'+(F.ic||"🎮")+' '+t(F.t||"st3.play")+'</div>'+(d.hint?'<p class="pkask">'+esc(Lz(d.hint))+'</p>':'')+
  (th.pk.go?'<button class="btn btn-p btn-block" data-featback="1">▶ '+t("pk.resume")+'</button>':'<div class="stfeat">'+(c?avatar(d.cid,46):'')+'<button class="btn btn-p grow" data-featgo="1">'+(F.ic||"")+' '+t("st3.go")+'</button></div><button class="stskip" data-stopskip="1">'+t("st.later")+' ›</button>')};
document.addEventListener("click",e=>{const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop||th.pk.stop[1]!=="feature")return;const d=th.pk.stop[2];
 if(e.target.closest("[data-featgo]")){const F=FEATK[d.k];if(!F){stopResolve(th,d.then||[]);return}PKFEAT={th,cid:d.cid,d,k:d.k};th.pk.go=1;save();packRefresh(th);F.run(d.cid||mainOf(th));return}
 if(e.target.closest("[data-featback]")){PKFEAT=null;stopResolve(th,d.then||d.win||[]);return}});
/* dramatic event card: ["sys","event",{icon,title,txt}] — the moment the story turns (power cut, someone bursts in, a big reveal) */
const _pkDir3=pkDirective;
pkDirective=function(th,b){if(Array.isArray(b)&&b[0]==="sys"&&b[1]==="event"){th.pk.q.shift();const d=b[2]||{};
  appendMsg(th,{who:"sys",k:"event",icon:d.icon||"⚡",title:d.title||"",txt:d.txt||"",at:Date.now()});try{navigator.vibrate&&navigator.vibrate(60)}catch(_){}save();return true}
 return _pkDir3(th,b)};
const _msgHTML3=msgHTML;
msgHTML=function(m,i,th){
 if(m.k==="event")return '<div class="m-event" data-mi="'+i+'"><i>'+esc(m.icon)+'</i><b>'+esc(m.title)+'</b>'+(m.txt?'<span>'+esc(m.txt)+'</span>':'')+'</div>';
 const isPkMe=m.who==="me"&&th&&th.pk;
 if(isPkMe&&m.k==="act")return '<div class="m-act me" data-mi="'+i+'"><small class="mt act">✱ '+t("st3.yourAct")+'</small>'+esc(m.txt)+'</div>';
 if(isPkMe&&m.k==="think")return '<div class="m-think me" data-mi="'+i+'"><small class="mt think">💭 '+t("st3.yourThink")+'</small>'+esc(m.txt)+'</div>';
 return _msgHTML3(m,i,th)};
boxHTML=function(m,i,th){return '<div class="m-box" data-mi="'+i+'">'+m.parts.map(p=>{if(p.who==="n")return '<p class="bn">'+esc(p.txt)+'</p>';const c=ch(p.who),nm=c?first(c.n):"";
  return p.k==="think"?'<p class="bth"><span class="mt think">💭 '+esc(nm)+' · '+t("st2.thinks")+'</span>'+esc(p.txt)+'</p>':'<p class="bac"><span class="mt act">✱ '+esc(nm)+'</span>'+esc(p.txt)+'</p>'}).join("")+'</div>'};

/* speed: 慢速 / 标准 / 2倍速 / 点一下才继续 */
const SPEEDS=[[1.6,"st3.slow"],[1,"st3.norm"],[.5,"st3.fast"],[0,"st3.tap"]];
pkSpd=function(){const v=S.pkSpd;return v===0?0:(v||1)};
const _packPanel3=packPanel;
packPanel=function(th){let h=_packPanel3(th);if(!(th.pk&&th.pk.st==="busy"&&PKPLAY[th.id]&&!th.pk.stop))return h;const v=pkSpd();
 const bar='<div class="pkspeed">'+SPEEDS.map(([x,l])=>'<button class="'+(x===v?"on":"")+'" data-spd="'+x+'">'+t(l)+'</button>').join("")+'</div>'+
  '<div class="pkplay"><button class="pkskip" data-pkshot="1">📷 '+t("st3.shot")+'</button><button class="pkskip" data-pknextl="1">'+t("pk.nextLine")+' ›</button><button class="pkskip" data-pkskip="1">⏩ '+t("pk.skip")+'</button></div>';
 return h.replace(/<div class="pkplay">[\s\S]*?<\/div><p class="pkhint">/,bar+'<p class="pkhint">')};
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-spd]")){S.pkSpd=+x.dataset.spd;save();const th=S.threads[curT];if(th)packRefresh(th);if(PKNEXT[curT]&&S.pkSpd)PKNEXT[curT]();return}
 if(e.target.closest("[data-pkshot]")){const th=S.threads[curT];if(!th)return;const m=[...th.msgs].reverse().find(y=>ch(y.who)&&y.txt);if(m)imgSheet(th,m);else toast(t("st3.noShot"));return}},true);

Object.assign(I18N.en,{"st3.snap":"Photo booth","st3.quiz":"How well do you know him?","st3.lie":"Two truths and a lie","st3.heart":"Heartbeat","st3.bottle":"Spin the bottle — truth or dare","st3.date":"Pick where you go","st3.play":"Play","st3.go":"Start","st3.yourAct":"You do","st3.yourThink":"You think","st3.slow":"Slow","st3.norm":"Normal","st3.fast":"2×","st3.tap":"Tap","st3.shot":"Picture this","st3.noShot":"No one has spoken yet."});
Object.assign(I18N.zh,{"st3.snap":"拍立得","st3.quiz":"默契问答","st3.lie":"两真一假","st3.heart":"心跳测试","st3.bottle":"转瓶子：真心话大冒险","st3.date":"选个约会的地方","st3.play":"小游戏","st3.go":"开始","st3.yourAct":"你的动作","st3.yourThink":"你的心声","st3.slow":"慢速","st3.norm":"标准","st3.fast":"2倍速","st3.tap":"点一下才走","st3.shot":"生成这一幕","st3.noShot":"还没有人说话。"});
Object.assign(I18N.en,{"st3.legend":"How to read the chat","st3.lgSay":"Bubble","st3.lgSayD":"someone talking (name above it)","st3.lgMe":"Pink bubble","st3.lgMeD":"what YOU say, on the right","st3.lgAct":"Action","st3.lgActD":"orange tag — what someone does","st3.lgThink":"Inner voice","st3.lgThinkD":"purple tag — what someone thinks, nobody hears it","st3.lgN":"Plain text","st3.lgND":"narration — where you are, what happens","st3.lgEv":"Event","st3.lgEvD":"something big just happened"});
Object.assign(I18N.zh,{"st3.legend":"怎么分辨","st3.lgSay":"气泡","st3.lgSayD":"有人在说话，上面写着是谁","st3.lgMe":"粉色气泡","st3.lgMeD":"你说的话，在右边","st3.lgAct":"动作","st3.lgActD":"橙色标签：某人做了什么","st3.lgThink":"心声","st3.lgThinkD":"紫色标签：某人心里想的，别人听不见","st3.lgN":"白字","st3.lgND":"旁白：交代在哪、发生了什么","st3.lgEv":"大事件","st3.lgEvD":"剧情突然转折"});

/* ================= 拍立得 v2: four DIFFERENT shots of the real scene, not four crops of one portrait =================
   Story snap stops carry frames:[{img,prompt}] — 1) a hand-made picture art/scenes/<img>.jpg if it exists,
   2) otherwise an AI shot from the prompt (when the image connector is available),
   3) otherwise a composite: this scene's background + the people in it, posed differently in each frame. */
function polaroid(src,i,S0){S0=S0||480;const L0=LOOKS[i%4],cv=document.createElement("canvas");cv.width=S0;cv.height=S0;const x=cv.getContext("2d");
 const s=Math.max(S0/src.width,S0/src.height);x.filter=L0.mono?"grayscale(1) contrast(1.12)":"saturate(1.05)";
 x.drawImage(src,(S0-src.width*s)/2,Math.min(0,(S0-src.height*s)*.35),src.width*s,src.height*s);x.filter="none";
 x.fillStyle=L0.tint;x.fillRect(0,0,S0,S0);const g=x.createRadialGradient(S0*.5,S0*.4,S0*.1,S0*.5,S0*.45,S0*.8);g.addColorStop(0,"rgba(255,250,240,.12)");g.addColorStop(1,"rgba(0,0,0,.45)");x.fillStyle=g;x.fillRect(0,0,S0,S0);
 const dt=new Date();x.font="bold 15px monospace";x.fillStyle="rgba(255,150,60,.9)";x.textAlign="right";x.fillText("'"+String(dt.getFullYear()).slice(2)+" "+(dt.getMonth()+1)+" "+dt.getDate(),S0-12,S0-12);return cv}
async function compositeShot(th,cids,i,S0){S0=S0||480;const cv=document.createElement("canvas");cv.width=S0;cv.height=S0;const x=cv.getContext("2d");
 try{const bg=await loadImg(sceneSrc(th,th.pk&&th.pk.bg));const s=Math.max(S0/bg.width,S0/bg.height)*1.15;x.filter="blur(3px) brightness(.7)";x.drawImage(bg,(S0-bg.width*s)/2,(S0-bg.height*s)/2,bg.width*s,bg.height*s);x.filter="none"}catch(_){x.fillStyle="#1a1520";x.fillRect(0,0,S0,S0)}
 const P=[[[.27,.56,0,.5],[.73,.56,0,.5]],[[.33,.55,8,.52],[.67,.53,-8,.52]],[[.5,.5,0,.86]],[[.3,.58,0,.48],[.7,.54,-12,.48]]][i%4];
 const ims=[];for(const c of cids.slice(0,2)){try{ims.push(await loadImg(artSrc(c)))}catch(_){}}
 P.forEach((p,k)=>{const im=ims[i%4===2?(cids.length>1?1:0):k];if(!im)return;const w=S0*p[3],h=w*1.25;x.save();x.translate(S0*p[0],S0*p[1]);x.rotate(p[2]*Math.PI/180);
  if(i%4===3&&k===1){x.scale(-1,1)} /* he turns toward the other one */
  x.beginPath();x.roundRect(-w/2,-h/2,w,h,w*.12);x.clip();const sw=im.width*.78,sh=sw*1.25;x.drawImage(im,(im.width-sw)/2,im.height*.04,sw,sh,-w/2,-h/2,w,h);x.restore()});
 const out=polaroid(cv,i,S0);return out}
async function storyShot(th,d,i){const f=(d.frames||[])[i]||{};
 if(f.img){const u="art/scenes/"+f.img+".jpg";if(await imgOk(u)){try{return polaroid(await loadImg(u),i)}catch(_){}}}
 if(f.prompt&&AIG.mcp){try{const res=await AIG.mcp.callTool(AIG.srv,AIG.tool,{prompt:f.prompt+", instant film photo-booth snapshot, flash, candid, photorealistic, adults, no text",width:768,height:768,num_inference_steps:20,randomize_seed:true},{cache:false});const s=aiImgFrom(res);if(s)return polaroid(await loadImg(s),i)}catch(_){}}
 const who=[d.with||(th.pk&&th.pk.as),d.cid].filter(c=>c&&ch(c));return compositeShot(th,who.length?who:[d.cid],i)}
const _booth4=booth;
booth=function(cid){const th=S.threads[curT];if(PKFEAT&&th===PKFEAT.th&&PKFEAT.k==="snap"){bFrames=[null,null,null,null];boothUI(cid);return}
 if(th){bFrames=[null,null,null,null];boothUI(cid);booth.generic=1;return}_booth4(cid)};
document.addEventListener("click",async e=>{const x=e.target.closest("[data-shoot]");if(!x)return;const th=S.threads[curT];if(!th)return;
 e.stopImmediatePropagation();const cid=x.dataset.shoot,story=PKFEAT&&th===PKFEAT.th&&PKFEAT.k==="snap",d=story?PKFEAT.d:{cid,with:th.pk&&th.pk.as!=="watch"?th.pk.as:null};
 bFrames=[null,null,null,null];x.disabled=true;
 for(let i=0;i<4;i++){for(let n=3;n>0;n--){const b=$("[data-shoot]");if(b)b.textContent=n+"…";await new Promise(r=>setTimeout(r,330))}
  const fl=document.createElement("div");fl.className="flash";($("#dev")||document.body).appendChild(fl);setTimeout(()=>fl.remove(),450);
  try{bFrames[i]=story?await storyShot(th,d,i):await compositeShot(th,[d.with,cid].filter(c=>c&&ch(c)),i)}catch(_){try{bFrames[i]=await frame(cid,i)}catch(__){}}boothUI(cid)}},true);

/* ===== backgrounds with people: art/scenes/<img>.mp4 (looping clip) or .jpg; ["sys","bg",{img}] switches mid-scene and is skipped if the picture isn't there yet ===== */
const SCN_OK={};
function scnProbe(img){return Promise.resolve((window.SCENE_FILES||{})[img]||null)}
sceneBg=function(th,img){const box=$("#cbImg");if(!box)return;const key=img||("cover:"+th.wid);if(box.dataset.scene===key)return;box.dataset.scene=key;box.dataset.clip="";box.dataset.who="";
 box.classList.remove("vmode","duo");POSES.forEach(p=>box.classList.remove("p-"+p));
 (img?scnProbe(img):Promise.resolve(null)).then(src=>{if(box.dataset.scene!==key)return;src=src||artSrc(th.wid);let el;
  if(/\.mp4$/.test(src)){el=document.createElement("video");el.muted=true;el.defaultMuted=true;el.setAttribute("muted","");el.loop=true;el.autoplay=true;el.playsInline=true;el.setAttribute("playsinline","");el.setAttribute("webkit-playsinline","");el.preload="auto";el.className="scimg cbv"}else{el=document.createElement("img");el.alt="";el.className="scimg"}
  el.src=src;box.appendChild(el);if(el.play)el.play().catch(()=>{});requestAnimationFrame(()=>{el.classList.add("on");setTimeout(()=>{const keep=box.lastElementChild;[...box.children].forEach(c=>{if(c!==keep)c.remove()})},900)})})};
const _pkDir5=pkDirective;
/* strict order: a background only appears when its line has been reached, and a slow-loading earlier clip never overrides a later one */
let BGSEQ=0;
pkDirective=function(th,b){if(Array.isArray(b)&&b[0]==="sys"&&b[1]==="bg"){th.pk.q.shift();const img=(b[2]||{}).img,my=++BGSEQ;
  th.pk.bg=img;save();scnProbe(img).then(src=>{if(src&&my===BGSEQ&&th.pk.bg===img&&curT===th.id)sceneBg(th,img)});
  /* warm up the next clip in the queue so it starts instantly when its line arrives */
  const nx=(th.pk.q||[]).find(x=>Array.isArray(x)&&x[0]==="sys"&&x[1]==="bg");if(nx)scnProbe(nx[2].img);return true}
 if(Array.isArray(b)&&b[0]==="sys"&&b[1]==="scene")BGSEQ++;return _pkDir5(th,b)};
/* pause */
const _packPanel5=packPanel;
packPanel=function(th){let h=_packPanel5(th);if(!(th.pk&&th.pk.st==="busy"&&PKPLAY[th.id]&&!th.pk.stop))return h;
 const paused=S.pkSpd===0&&S.pkPaused;return h.replace('<div class="pkspeed">','<div class="pkspeed"><button class="'+(paused?"on":"")+'" data-pkpause="1">'+(paused?"▶ "+t("st5.resume"):"⏸ "+t("st5.pause"))+'</button>')};
document.addEventListener("click",e=>{if(!e.target.closest("[data-pkpause]"))return;e.stopImmediatePropagation();
 if(S.pkPaused){S.pkPaused=false;S.pkSpd=S.pkSpdPrev||1;save();if(PKNEXT[curT])PKNEXT[curT]()}else{S.pkSpdPrev=S.pkSpd===0?1:pkSpd();S.pkSpd=0;S.pkPaused=true;save()}
 const th=S.threads[curT];if(th)packRefresh(th)},true);
document.addEventListener("click",e=>{if(e.target.closest("[data-spd]"))S.pkPaused=false},true);
Object.assign(I18N.en,{"st5.pause":"Pause","st5.resume":"Play"});Object.assign(I18N.zh,{"st5.pause":"暂停","st5.resume":"继续"});

/* ===== action + dialogue in one message: *walks toward you* I've been waiting.  /  （走近他）我一直在等你 ===== */
function fmtMix(h){return h.replace(/\*([^*<]{1,80})\*/g,'<em class="ma">$1</em>').replace(/（([^）<]{1,80})）/g,'<em class="ma">$1</em>').replace(/\(([^)<]{1,80})\)/g,'<em class="ma">$1</em>')}
const _msgHTML6=msgHTML;
msgHTML=function(m,i,th){const h=_msgHTML6(m,i,th);if(!m||!m.txt||m.k==="box"||m.k==="act"||m.k==="think")return h;
 return h.replace(/<div class="bub">([\s\S]*?)<\/div>/,(a,b)=>'<div class="bub">'+fmtMix(b)+'</div>')};
const _renderChat6=renderChat;
renderChat=function(){_renderChat6.apply(this,arguments);const ir=$(".composer .inrow");if(!ir||$(".qchips"))return;
 ir.insertAdjacentHTML("beforebegin",'<div class="qchips"><button data-insact="1">✱ '+t("st6.act")+'</button><button data-insthink="1">💭 '+t("st6.think")+'</button><span>'+t("st6.tip")+'</span></div>')};
function insWrap(o,c,ph){const ta=$("#cin");if(!ta)return;const s=ta.selectionStart??ta.value.length,e=ta.selectionEnd??s,sel=ta.value.slice(s,e)||ph;
 ta.value=ta.value.slice(0,s)+o+sel+c+(ta.value.slice(e).startsWith(" ")?"":" ")+ta.value.slice(e);ta.focus();ta.setSelectionRange(s+o.length,s+o.length+sel.length);ta.dispatchEvent(new Event("input"))}
document.addEventListener("click",e=>{
 if(e.target.closest("[data-insact]")){if(cmode!=="say"){cmode="say";$$("[data-mode]").forEach(b=>b.classList.toggle("on",b.dataset.mode==="say"))}insWrap("*","*",t("st6.actPh"));return}
 if(e.target.closest("[data-insthink]")){cmode="think";$$("[data-mode]").forEach(b=>b.classList.toggle("on",b.dataset.mode==="think"));const ta=$("#cin");if(ta){ta.focus();ta.placeholder=t("cx.ph.think")}return}});
Object.assign(I18N.en,{"st6.act":"(action)","st6.think":"(thought)","st6.tip":"e.g. *pulls him closer* Stay.","st6.actPh":"what you do"});
Object.assign(I18N.zh,{"st6.act":"（动作）","st6.think":"（心声）","st6.tip":"例：*把他拉近* 别走。","st6.actPh":"你的动作"});
