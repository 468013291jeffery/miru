/* ================= FIRST-TIME COACH MARKS =================
   One short spotlight tour per surface, shown once (S.coach[key]). Waits until no sheet is open. */
const COACH={
 home:[[".dkwrap","co.home1","co.home1S"],[".htabs","co.home2","co.home2S"]],
 chat:[[".composer .modes","co.chat1","co.chat1S"],["[data-games]","co.chat2","co.chat2S"]],
 short:[["#spPill","co.sp1","co.sp1S"],[".shortp .rail-r","co.sp2","co.sp2S"]],
 gc:[[".gc-pairs","co.gc1","co.gc1S"],[".relb","co.gc2","co.gc2S"],[".gc-grid","co.gc3","co.gc3S"]],
 rank:[[".rkvotes","co.rk1","co.rk1S"],[".rkvb","co.rk2","co.rk2S"]]};
function vis(sel){return [...document.querySelectorAll(sel)].find(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0})}
function coach(key,tries){S.coach=S.coach||{};if(S.coach[key]||$(".coach"))return;tries=tries||0;
 if($(".sheet")||$(".callv")||$(".adv")){if(tries<25)setTimeout(()=>coach(key,tries+1),900);return}
 const steps=COACH[key].filter(s=>vis(s[0]));if(!steps.length)return;S.coach[key]=1;save();
 const dev=$("#dev"),el=document.createElement("div");el.className="coach";el.innerHTML='<div class="coach-hole"></div><div class="coach-tip"></div>';dev.appendChild(el);let i=0;
 /* safety net: the tour must never be able to sit on screen forever and block taps — force it gone after 20s no matter what */
 setTimeout(()=>{if(el.parentNode)el.remove()},20000);
 const draw=()=>{const [sel,h,p]=steps[i],tg=vis(sel);if(!tg){next();return}tg.scrollIntoView({block:"center"});
  setTimeout(()=>{const d=dev.getBoundingClientRect(),r=tg.getBoundingClientRect(),pad=6,hole=el.querySelector(".coach-hole"),tip=el.querySelector(".coach-tip");
   const top=Math.max(4,r.top-d.top-pad),hgt=Math.min(r.height+pad*2,d.height-top-120);
   Object.assign(hole.style,{left:Math.max(4,r.left-d.left-pad)+"px",top:top+"px",width:Math.min(r.width+pad*2,d.width-8)+"px",height:hgt+"px"});
   tip.innerHTML='<b>'+t(h)+'</b><p>'+t(p)+'</p><div class="row"><button class="coach-skip" data-coskip="1">'+t("co.skip")+'</button><span class="grow"></span><small>'+(i+1)+' / '+steps.length+'</small><button class="btn btn-p btn-sm" data-conext="1">'+t(i===steps.length-1?"co.done":"co.next")+'</button></div>';
   const below=top+hgt+16,room=d.height-below;tip.style.top=room>170?below+"px":"auto";tip.style.bottom=room>170?"auto":(d.height-top+16)+"px";
   tip.style.animation="none";void tip.offsetWidth;tip.style.animation=""},60)};
 const next=()=>{i++;if(i>=steps.length)el.remove();else draw()};
 el.addEventListener("click",e=>{if(e.target.closest("[data-coskip]")){el.remove();return}if(e.target.closest("[data-conext]"))next()});draw()}
/* hook each surface */
(function(){const wrap=(name,key,delay)=>{const f=window[name];if(typeof f!=="function")return;window[name]=function(){const r=f.apply(this,arguments);setTimeout(()=>coach(key),delay);return r}};
 wrap("startApp","home",900);wrap("openThread","chat",700);wrap("openShort","short",1600);wrap("openGameCenter","gc",600)})();
document.addEventListener("click",e=>{const x=e.target.closest("[data-htab]");if(x&&x.dataset.htab==="rank")setTimeout(()=>coach("rank"),350)});
Object.assign(I18N.en,{"co.skip":"Skip","co.next":"Next","co.done":"Got it",
 "co.home1":"Swipe the dramas","co.home1S":"The one in the middle is playing. Tap it — or ▶ — to watch EP 1, then step into the story.",
 "co.home2":"Playroom · Quests · Vote · Games","co.home2S":"Group stories, weekly quests, the character vote board and the Game Center all live in these tabs.",
 "co.home3":"Your people","co.home3S":"Everyone you've talked to. The glowing ring is who you talked to last — tap to see his page and posts.",
 "co.chat1":"Three ways to talk","co.chat1S":"Say it out loud, ✱ act it out, or 💭 think it — he reacts to all three. 🎬 Director lets you rewrite the scene.",
 "co.chat2":"Play with them","co.chat2S":"Spin the bottle, truth or lie, and the Game Center — results carry into your story.",
 "co.sp1":"Episodes","co.sp1S":"Swipe up for the next episode. The first 3 are free.","co.sp2":"Step inside","co.sp2S":"💬 jumps from the drama straight into the scene — you take the lead from here.",
 "co.gc1":"Pick a pair","co.gc1S":"Every game is played for one couple.","co.gc2":"Their bond","co.gc2S":"Win and they get closer — from Strangers to Endgame. Their story remembers it.","co.gc3":"Pick a game","co.gc3S":"New games unlock as their bond grows.",
 "co.rk1":"Your votes","co.rk1S":"Free votes every day. Use them before midnight.","co.rk2":"Vote","co.rk2S":"Your first vote makes him your bias. Push him to #1 before Monday."});
Object.assign(I18N.zh,{"co.skip":"跳过","co.next":"下一步","co.done":"知道了",
 "co.home1":"左右滑动选短剧","co.home1S":"中间那部正在播放。点它或 ▶ 看第 1 集，看完直接进戏。",
 "co.home2":"多人剧场 · 任务 · 打榜 · 游戏","co.home2S":"群像故事、每周任务、角色打榜和游戏中心都在这几个页签里。",
 "co.home3":"你聊过的人","co.home3S":"发光的是你最近聊的那位——点进去看他的主页和动态。",
 "co.chat1":"三种说话方式","co.chat1S":"直接说、✱ 做动作、💭 心里想——他都会有反应。🎬 导演模式可以直接改写剧情。",
 "co.chat2":"和他们玩","co.chat2S":"转瓶子、两真一假、游戏中心——结果都会写进你们的剧情。",
 "co.sp1":"集数","co.sp1S":"上滑看下一集，前 3 集免费。","co.sp2":"进入剧情","co.sp2S":"点 💬 从短剧直接进入这一幕，接下来由你主导。",
 "co.gc1":"选一对 CP","co.gc1S":"每个游戏都是为一对 CP 玩的。","co.gc2":"他们的关系","co.gc2S":"赢了他们就更近一步——从陌生人到锁死。剧情会记住。","co.gc3":"选个游戏","co.gc3S":"关系越近，解锁的游戏越多。",
 "co.rk1":"你的票","co.rk1S":"每天都有免费票，零点前用掉。","co.rk2":"打榜","co.rk2S":"第一票会把他设为你的本命。周一前把他推上第一。",
 "ob.hot":"最多人选","ob.nl":"BG 男女","ob.both":"都要","ob.bothS":"BL 优先，也看男女","ob.glLink":"也想看 GG"});
Object.assign(I18N.en,{"ob.hot":"Most picked","ob.nl":"M/F","ob.both":"Both","ob.bothS":"BL first, M/F too","ob.glLink":"I'm here for GL"});
