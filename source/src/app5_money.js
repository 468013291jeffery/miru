/* ================= MONEY, MEMORY, DAILY POSTS =================
   What people pay for is the story, not "AI": the next episode, what he says next, the photo he sent, and being remembered.
   Currency: 💎 diamonds (S.keys). MIRU+ membership (S.plus).
   ┌ Free ─ EP1 of every drama · chat with 20-message short memory · 1 free AI image a day · daily posts from characters you follow
   ├ Pay per moment (💎) ─ next episode 2 · a locked line at a cliffhanger 1 · a photo he sends 1 · AI image 1 · redo 1
   └ MIRU+ ($9.99/mo) ─ every episode · no locked lines/photos · 10 AI images a day · long memory (60 messages + every key moment, across all stories with that character) */
/* Modeled on what works in the US: ReelShort/DramaBox (first episodes free, coins per episode, daily check-in),
   Webtoon/Tapas (Wait-Until-Free), Character.AI/Talkie (free chat is never capped; membership = memory, no locks, perks).
   UX rules: price shown on every button before you tap · balance always visible · every spend confirmed with a toast of what's left ·
   the story is never blocked with no free path · first unlock of the day is on us. */
/* AI-cost pricing rule (set by the owner): every ¥1 the model costs us is charged as $1 to the player, rounded UP to whole 💎 (packs: $0.99 = 5💎 … $99.99 = 700💎, $0.20–0.14 per 💎).
   · AI picture: new z-image-turbo ¥0.1, same-face edit wan2.5-i2i ¥0.2 → $0.2 → 2💎      · AI scene/event card (text model, ~¥0.02) → 1💎
   · voice call (Qwen-Omni ≈ ¥0.05–0.1/min) → 1💎/min      · 5s video (Vidu viduq2-pro-fast, 16 credits ≈ ¥0.58) → 5💎 (still ≥ cost at the biggest pack's $0.143/💎)
   Story unlocks (ep / line / pic / event reveals) are content prices, not model costs, and keep their own values. */
const PRICES={ep:2,line:1,pic:1,img:2,event:3,retry:1,card:1,callMin:1,video:5};
function today(){return new Date().toISOString().slice(0,10)}
const FREE_EPS=3;              /* first 3 episodes of every drama are free */
const WUF_H=23;                /* Wait-Until-Free: one locked episode per drama unlocks free every 23h */
const PLUS_COVERS=["ep","line","pic","retry"]; /* MIRU+ never pays for story; gifts, event cards and extra images still use 💎 (members get 20💎/month) */
function spend(n,why){if(S.plus&&PLUS_COVERS.includes(why))return true;if(!n)return true;
 if(S.keys<n){paySheet(why);return false}S.keys-=n;save();toast(t("pay.spent",{n,left:S.keys}));const k=$(".topbar .chip.num");if(k)k.textContent="💎 "+S.keys+(S.plus?" · MIRU+":"");return true}
/* chat cliffhangers: only inside stories, at most one every 25 replies, never before reply 12 — and the first one each day is free */
/* retired: no more locked lines or blurred photos inside a story — the reader always gets the whole reply they were promised */
function payHooks(th,m){return;if(S.plus||!th.wid)return;th.aiN=(th.aiN||0)+1;
 if(th.aiN>=12&&th.aiN-(th.lastLock||0)>=25&&m.k==="say"&&String(m.txt||"").length>24){m.locked=true;th.lastLock=th.aiN}
 if(th.aiN%15===9){const cid=m.who;setTimeout(()=>{th.msgs.push({who:cid,k:"pic",src:artSrc(cid),locked:true,at:Date.now()});save();if(curT===th.id)renderChat()},900)}}
function freeToday(k){const d=today();S.freeUse=S.freeUse||{};if(S.freeUse[k]!==d){S.freeUse[k]=d;save();return true}return false}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-unmsg]")){const th=S.threads[curT],m=th&&th.msgs[+x.dataset.unmsg];if(!m)return;if(freeToday("line")){toast(t("pay.freeLine"))}else if(!spend(PRICES.line,"line"))return;m.locked=false;save();renderChat();speak(m.txt,m.who);return}
 if(x=e.target.closest("[data-unpic]")){const th=S.threads[curT],m=th&&th.msgs[+x.dataset.unpic];if(!m)return;if(freeToday("pic")){toast(t("pay.freePic"))}else if(!spend(PRICES.pic,"pic"))return;m.locked=false;save();renderChat();return}
 if(e.target.closest("[data-paysheet]")){paySheet();return}
 if(x=e.target.closest("[data-plan]")){S.planSel=x.dataset.plan;$$("[data-plan]").forEach(b=>b.classList.toggle("on",b===x));return}
 if(e.target.closest("[data-buyplus]")){S.plus=true;S.plusPlan=S.planSel||"year";S.plusSince=Date.now();S.keys+=20;save();closeSheet();toast(t("pay.plusOn"));refreshAfterPay();return}
 if(x=e.target.closest("[data-buy]")){const n=+x.dataset.buy,bonus=S.firstBuy?0:n;S.firstBuy=true;S.keys+=n+bonus;save();closeSheet();toast("+"+(n+bonus)+" 💎"+(bonus?" · "+t("pay.doubled"):""));refreshAfterPay();return}
 if(e.target.closest("[data-ci]")){checkIn();return}
 if(x=e.target.closest("[data-epbuy]")){const [w,n]=x.dataset.epbuy.split("|");if(!spend(PRICES.ep,"ep"))return;unlockEp(w,+n);closeSheet();openShort(w,+n);return}
 if(x=e.target.closest("[data-epwait]")){const [w,n]=x.dataset.epwait.split("|");S.wuf=S.wuf||{};if(!S.wuf[w]||S.wuf[w].ep!==+n){S.wuf[w]={ep:+n,at:Date.now()}}save();closeSheet();toast(t("pay.waitSet",{h:WUF_H}));return}});
function refreshAfterPay(){try{if(typeof sp!=="undefined"&&sp&&$(".shortp")){const w=sp.wid,n=sp.ep;spEnd&&$("#spEnd")&&($("#spEnd").innerHTML="");openShort(w,n);return}}catch(_){}
 if(curT&&$("#s-chat")&&!$("#s-chat").hidden)renderChat();else if(S.lastTab)renderTab(S.lastTab)}
function unlockEp(w,n){S.epUnlock=S.epUnlock||{};S.epUnlock[w+":"+n]=1;save()}
function wufLeft(w,n){const o=S.wuf&&S.wuf[w];if(!o||o.ep!==n)return null;return Math.max(0,o.at+WUF_H*36e5-Date.now())}
function fmtLeft(ms){const h=Math.floor(ms/36e5),m=Math.ceil(ms%36e5/6e4);return h?h+"h "+m+"m":m+"m"}
function epLockSheet(w,n){const left=wufLeft(w,n),e=eps(w)[n-1];
 sheet('<div class="eyebrow" style="color:var(--gold)">EP '+n+' · '+esc(Lz(e&&e.t||""))+'</div><h2 style="margin-top:6px">'+t("pay.why.ep")+'</h2><p class="sm dim" style="margin-top:6px;line-height:1.5">'+esc(Lz(e&&e.cliff||""))+'</p>'+
  '<button class="btn btn-p btn-block" style="margin-top:14px" data-epbuy="'+w+'|'+n+'">🔓 '+t("pay.unlockNow")+' · 💎 '+PRICES.ep+'</button>'+
  '<p class="xs faint" style="text-align:center;margin-top:6px">💎 '+S.keys+' · '+t("pay.perEp")+'</p>'+adBtn("ep",w+"-"+n,t("ad.ep",{k:(adState().ep[w+"-"+n]||0)}))+
  (left===null?'<button class="btn btn-g btn-block" style="margin-top:10px" data-epwait="'+w+'|'+n+'">⏳ '+t("pay.wait",{h:WUF_H})+'</button>':'<div class="wufbox">⏳ '+t("pay.waiting",{t:fmtLeft(left)})+'</div>')+
  '<button class="plusc mini" data-paysheet="1"><b>MIRU+</b><span>'+t("pay.plusLine")+'</span><em>'+t("pay.trial")+'</em></button>')}
/* daily check-in — 7-day streak, resets if you miss a day */
const CI=[1,1,2,2,3,3,5];
function ciState(){S.ci=S.ci||{d:"",n:0};const d=today(),y=new Date(Date.now()-864e5).toISOString().slice(0,10);return {done:S.ci.d===d,next:S.ci.d===d?S.ci.n:(S.ci.d===y?S.ci.n%7:0)}}
function checkIn(){const st=ciState();if(st.done)return;const r=CI[st.next]+(S.plus?2:0);S.ci={d:today(),n:st.next+1};S.keys+=r;save();toast("+"+r+" 💎 · "+t("pay.ciDone"));
 const b=$(".cibar");if(b)b.outerHTML=ciHTML();const k=$(".topbar .chip.num");if(k)k.textContent="💎 "+S.keys+(S.plus?" · MIRU+":"")}
function ciHTML(){const st=ciState();return '<div class="cibar"><div class="row"><b class="grow">'+t("pay.ciH")+'</b><span class="xs faint">'+t("pay.ciS")+'</span></div><div class="cidays">'+CI.map((r,i)=>{const got=st.done?i<st.next:i<st.next,cur=!st.done&&i===st.next;
  return '<div class="cid'+(got?" got":"")+(cur?" cur":"")+'"><small>D'+(i+1)+'</small><b>'+(got?"✓":"💎"+(r+(S.plus?2:0)))+'</b></div>'}).join("")+'</div>'+(st.done?'<p class="xs faint" style="text-align:center;margin-top:8px">'+t("pay.ciTomorrow")+'</p>':'<button class="btn btn-p btn-block btn-sm" style="margin-top:10px" data-ci="1">'+t("pay.ciBtn")+'</button>')+'</div>'}
function maybeCheckInPrompt(){try{if(!S.ob)return;const st=ciState();if(st.done||S.ciPrompt===today())return;S.ciPrompt=today();save();setTimeout(()=>{if(!$(".sheet"))sheet('<h2>'+t("pay.ciWelcome")+'</h2>'+ciHTML())},900)}catch(_){}}
function paySheet(why){const head=why?t("pay.why."+why):t("pay.h"),sel=S.planSel||"year";
 sheet('<div class="row"><div class="grow"><div class="eyebrow" style="color:var(--gold)">MIRU+</div><h2 style="margin-top:4px">'+head+'</h2></div><span class="chip num">💎 '+S.keys+'</span></div>'+(why?adBtn("gem","",t("ad.gem")):"")+
  (S.plus?'<div class="plusc on"><b>MIRU+ ✓</b><span>'+t("pay.youHave")+'</span></div>':
  '<div class="plusc"><ul>'+["pay.p1","pay.p2","pay.p3","pay.p4","pay.p5","pay.p6"].map(k=>'<li>'+t(k)+'</li>').join("")+'</ul>'+
   '<div class="plans"><button class="plan'+(sel==="year"?" on":"")+'" data-plan="year"><i>'+t("pay.save33")+'</i><b>'+t("pay.yearly")+'</b><span>$79.99 · $6.67/'+t("pay.mo")+'</span></button><button class="plan'+(sel==="month"?" on":"")+'" data-plan="month"><b>'+t("pay.monthly")+'</b><span>$9.99/'+t("pay.mo")+'</span></button></div>'+
   '<button class="btn btn-p btn-block" style="margin-top:10px" data-buyplus="1">'+t("pay.trialBtn")+'</button><p class="xs faint" style="text-align:center;margin-top:6px">'+t("pay.trialS")+'</p></div>')+
  ciHTML()+
  '<div class="eyebrow" style="margin-top:14px">'+t("pay.packs")+'</div><div class="packs">'+[[10,"1.99"],[60,"9.99",1],[150,"19.99"],[400,"49.99"]].map(([n,pr,best])=>'<button class="pack'+(best?" best":"")+'" data-buy="'+n+'">'+(best?'<i>'+t("pay.best")+'</i>':"")+(!S.firstBuy?'<u>×2</u>':'')+'<b>💎 '+n+(!S.firstBuy?' <s>+'+n+'</s>':'')+'</b><span>$'+pr+'</span></button>').join("")+'</div>'+
  (!S.firstBuy?'<p class="xs" style="color:var(--gold);margin-top:6px;text-align:center">'+t("pay.first")+'</p>':'')+
  '<p class="xs faint" style="margin-top:10px;line-height:1.55">'+t("pay.what")+'</p>')}
/* memory: free = the last 5 key moments of this chat; MIRU+ = every key moment, plus what this character remembers from your other stories together */
function memBlock(th){let mem=(th.mem||[]).slice(S.plus?-40:-5);
 if(S.plus){const other=Object.values(S.threads).filter(o=>o!==th&&o.cast.some(c=>th.cast.includes(c))).flatMap(o=>(o.mem||[]).slice(-6).map(x=>"(from "+o.title+") "+x));mem=other.slice(-12).concat(mem)}
 return mem.length?("THINGS THAT HAVE HAPPENED"+(S.plus?" (long memory — refer back to these naturally)":"")+":\n"+mem.map(x=>"- "+x).join("\n")):""}
/* daily posts: characters you follow or talk to post something new every day — each one ends on a hook that pulls you into chat */
const HOOKS={en:["Couldn't sleep. Guess whose fault that is.","Left something at the usual place. Don't make me wait twice.","If you see this before midnight, come find me. After midnight, don't.","I almost told you something today. Almost.","New rule: you answer my texts first. Everyone else can wait.","Tell me you didn't wear that on purpose.","Someone asked me who I was smiling at. I lied.","I'm not jealous. I just want to know his name.","Tonight. Same place. Come alone.","Deleted the message three times. Sending it anyway? Ask me."],
 zh:["睡不着。猜猜是谁害的。","在老地方给你留了东西。别让我等第二次。","零点前看到这条就来找我。零点以后，别来。","今天差点跟你说了一件事。差一点。","新规定：先回我的消息。其他人都往后排。","别告诉我你那样穿不是故意的。","有人问我在对谁笑。我撒谎了。","我没吃醋。我只是想知道他叫什么。","今晚。老地方。一个人来。","那条消息我删了三次。要不要发？你问我。"]};
function dailyPosts(force){const d=today();S.daily=S.daily||{};if(S.daily.d!==d||force){
  const ids=allChars().filter(id=>{const c=ch(id);if(!c)return false;const w=wd(c.w);return w&&orOK(w)});
  const lang=S.lang==="zh"?"zh":"en",keep=S.daily.d===d?S.daily.p||[]:[];
  S.daily={d,p:ids.map((id,i)=>keep.find(p=>p.who===id)||{id:"dp_"+d+"_"+id,who:id,cap:T(HOOKS.en[(hash(id+d))%10],HOOKS.zh[(hash(id+d))%10]),likes:3000+hash(id+d)%40000,at:Date.now()-i*47*6e4,daily:1})};save();
  if(SAMPLE)liveDaily();}
 return S.daily.p||[]}
/* ================= TASK CENTER — every diamond-earning action gathered in one place =================
   Daily tasks reset at midnight (taskClaimDay); one-time tasks pay once ever (taskClaimOnce).
   Check-in and ads keep their own existing mechanics (ciHTML/checkIn, adBtn/watchAd) — this just surfaces them
   alongside the newer actions (share, reply, vote, publish a character/world) so everything lives in one tab. */
function taskDayDone(id){return (S.tasksDay||{})[id]===today()}
function taskOnceDone(id){return !!(S.tasksOnce||{})[id]}
function taskClaimDay(id,amt){S.tasksDay=S.tasksDay||{};if(taskDayDone(id))return false;S.tasksDay[id]=today();S.keys+=amt;save();const k=$(".topbar .chip.num");if(k)k.textContent="💎 "+S.keys+(S.plus?" · MIRU+":"");taskRefreshUI();return true}
function taskClaimOnce(id,amt){S.tasksOnce=S.tasksOnce||{};if(taskOnceDone(id))return false;S.tasksOnce[id]=1;S.keys+=amt;save();const k=$(".topbar .chip.num");if(k)k.textContent="💎 "+S.keys+(S.plus?" · MIRU+":"");taskRefreshUI();return true}
function taskRefreshUI(){if(typeof homeTab!=="undefined"&&homeTab==="earn"){const b=$("#htabBody");if(b)b.innerHTML=tasksHTML()}}
function taskRow(icon,title,desc,right){return '<div class="trow2"><span class="tic">'+icon+'</span><div class="grow"><b>'+title+'</b><p class="xs faint">'+desc+'</p></div>'+right+'</div>'}
function taskSection(label){return '<p class="xs faint" style="padding:14px 2px 2px;text-transform:uppercase;letter-spacing:.04em">'+label+'</p>'}
function personaDone(){const p=persona();return !!(p&&p.name&&p.look)}
const SOCIAL=[["discord","💬","Discord"],["instagram","📷","Instagram"],["tiktok","🎵","TikTok"],["youtube","▶️","YouTube"]];
function tasksHTML(){const ci=ciState(),adN=adLeft();
 const done='<span class="tdone">✓</span>';
 let h='<div class="tasklist" style="padding:10px 16px 6px">';
 h+=taskSection(t("task.secDaily"));
 h+=taskRow("📅",t("task.checkin"),t("task.checkinD"),ci.done?done:'<button class="btn btn-p btn-xs" data-ci="1">'+t("task.go")+'</button>');
 h+=taskRow("📺",t("task.ad"),t("ad.left",{n:adN,c:ADS.cap}),S.plus?'<span class="tdone">MIRU+</span>':adN?'<button class="btn btn-p btn-xs" data-ad="gem|">'+t("task.go")+'</button>':done);
 h+=taskRow("📤",t("task.share"),t("task.shareD"),taskDayDone("share")?done:'<button class="btn btn-g btn-xs" data-taskshare="1">'+t("task.go")+'</button>');
 h+=taskRow("👥",t("task.invite"),t("task.inviteD"),taskDayDone("invite")?done:'<button class="btn btn-g btn-xs" data-taskinvite="1">'+t("task.go")+'</button>');
 h+=taskRow("💬",t("task.reply"),t("task.replyD"),taskDayDone("reply")?done:'<span class="xs faint">'+t("task.pending")+'</span>');
 h+=taskRow("🔥",t("task.vote"),t("task.voteD"),taskDayDone("vote")?done:'<button class="btn btn-g btn-xs" data-htab2="rank">'+t("task.go")+'</button>');
 h+=taskRow("🖼️",t("task.genImg"),t("task.genImgD"),taskDayDone("genimg")?done:'<span class="xs faint">'+t("task.genImgGo")+'</span>');
 h+=taskRow("🎬",t("task.genVid"),t("task.genVidD"),'<span class="xs faint">'+t("task.soon")+'</span>');
 h+=taskSection(t("task.secBuild"));
 h+=taskRow("🪪",t("task.persona"),t("task.personaD"),taskOnceDone("persona")?done:(personaDone()?'<button class="btn btn-g btn-xs" data-taskpersona="1">'+t("task.go")+'</button>':'<button class="btn btn-g btn-xs" data-newp="1">'+t("task.go")+'</button>'));
 h+=taskRow("🧬",t("task.pubChar"),t("task.pubCharD"),taskOnceDone("pubChar")?done:'<button class="btn btn-g btn-xs" data-cre="char">'+t("task.go")+'</button>');
 h+=taskRow("🌍",t("task.pubWorld"),t("task.pubWorldD"),taskOnceDone("pubWorld")?done:'<button class="btn btn-g btn-xs" data-cre="group">'+t("task.go")+'</button>');
 h+=taskRow("⑂",t("task.pubRemix"),t("task.pubRemixD"),taskOnceDone("pubRemix")?done:'<button class="btn btn-g btn-xs" data-cre="remix">'+t("task.go")+'</button>');
 h+=taskRow("🎭",t("task.interVid"),t("task.interVidD"),taskOnceDone("interVid")?done:'<button class="btn btn-g btn-xs" data-cre="group">'+t("task.go")+'</button>');
 h+=taskRow("🛠️",t("task.newTool"),t("task.newToolD"),taskOnceDone("tool")?done:'<span class="xs faint">'+t("task.newToolGo")+'</span>');
 h+=taskRow("📲",t("task.appDl"),t("task.appDlD"),taskOnceDone("appdl")?done:'<button class="btn btn-g btn-xs" data-taskappdl="1">'+t("task.go")+'</button>');
 h+=taskSection(t("task.secFollow"));
 h+=SOCIAL.map(([id,ic,nm])=>taskRow(ic,t("task.follow",{n:nm}),t("task.followD"),taskOnceDone("fol_"+id)?done:'<button class="btn btn-g btn-xs" data-tasksocial="'+id+'">'+t("task.go")+'</button>')).join("");
 h+='<p class="xs faint" style="padding:10px 2px 0">'+t("task.ptHint")+'</p></div>';
 return h}
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-taskshare]")){const wk={id:"app",kind:"group",title:"MIRU"};shareSheet(wk);
  if(taskClaimDay("share",1))setTimeout(()=>toast(t("task.gotShare")),300);return}
 if(e.target.closest("[data-taskinvite]")){const wk={id:"app",kind:"group",title:"MIRU"};shareSheet(wk);
  if(taskClaimDay("invite",1))setTimeout(()=>toast(t("task.gotInvite")),300);return}
 if(e.target.closest("[data-taskpersona]")){if(taskClaimOnce("persona",2))toast(t("task.gotPersona"));renderTab("me");return}
 if(e.target.closest("[data-taskappdl]")){toast(t("task.appDlToast"));if(taskClaimOnce("appdl",2))setTimeout(()=>toast(t("task.gotAppdl")),400);return}
 if(x=e.target.closest("[data-tasksocial]")){const id=x.dataset.tasksocial;if(taskClaimOnce("fol_"+id,1)){toast(t("task.gotFollow"));const b=$("#htabBody");if(b)b.innerHTML=tasksHTML()}return}});
Object.assign(I18N.en,{"home.tabEarn":"Earn","task.go":"Go","task.pending":"Reply to a post in Moments",
 "task.checkin":"Daily check-in","task.checkinD":"Check in every day — the reward grows with your streak",
 "task.ad":"Watch an ad","task.share":"Share MIRU","task.shareD":"Share with a friend, once a day",
 "task.reply":"Reply to a post","task.replyD":"Reply to anything in Moments",
 "task.vote":"Cast a vote","task.voteD":"Vote for your character on the leaderboard",
 "task.pubChar":"Publish a character","task.pubCharD":"One-time bonus, first publish",
 "task.pubWorld":"Create a group world","task.pubWorldD":"One-time bonus, first publish",
 "task.pubRemix":"Publish a remix","task.pubRemixD":"One-time bonus, first remix published","task.gotRemix":"+3 💎 · remix published",
 "task.ptHint":"Quest points convert to diamonds on the Quests tab — 500 pt = 1 💎",
 "task.gotVote":"+1 💎 · daily vote bonus","task.gotChar":"+3 💎 · character published","task.gotWorld":"+3 💎 · world published","task.gotReply":"+1 💎 · reply bonus","task.gotShare":"+1 💎 · share bonus",
 "task.secDaily":"Daily","task.secBuild":"Create & grow","task.secFollow":"Follow us",
 "task.invite":"Invite a friend","task.inviteD":"Send an invite, once a day","task.gotInvite":"+1 💎 · invite bonus",
 "task.genImg":"Generate & share an AI photo","task.genImgD":"Generate an AI photo in chat and save it to your album","task.genImgGo":"Generate a photo in any chat",
 "task.gotGenimg":"+1 💎 · AI photo bonus",
 "task.genVid":"Generate & share an AI video","task.genVidD":"Turn a photo into a short clip and share it","task.soon":"Coming soon",
 "task.persona":"Complete your persona","task.personaD":"Fill in your name, pronouns and look — one-time bonus","task.gotPersona":"+2 💎 · persona complete",
 "task.interVid":"Create an interactive story","task.interVidD":"Build a multi-character world — one-time bonus",
 "task.newTool":"Try AI voice generation","task.newToolD":"Generate a real AI voice line for any character","task.newToolGo":"Try it on the Me tab","task.gotTool":"+2 💎 · new tool bonus",
 "task.appDl":"Get the app","task.appDlD":"Add MIRU to your home screen — one-time bonus","task.appDlToast":"Demo — the real version links to the App Store / Google Play.","task.gotAppdl":"+2 💎 · app bonus",
 "task.follow":"Follow us on {n}","task.followD":"One-time bonus per platform","task.gotFollow":"+1 💎 · follow bonus"});
Object.assign(I18N.zh,{"home.tabEarn":"赚钻石","task.go":"去完成","task.pending":"去「动态」里回复一条",
 "task.checkin":"每日签到","task.checkinD":"每天签到，连续签到奖励更多",
 "task.ad":"看一条广告","task.share":"分享 MIRU","task.shareD":"分享给朋友，每天一次",
 "task.reply":"回复一条动态","task.replyD":"在「动态」里回复任意一条",
 "task.vote":"参与一次打榜投票","task.voteD":"为你的角色投一票",
 "task.pubChar":"发布一个角色","task.pubCharD":"首次发布 · 一次性奖励",
 "task.pubWorld":"创建一个多人世界","task.pubWorldD":"首次发布 · 一次性奖励",
 "task.pubRemix":"发布一个二创","task.pubRemixD":"首次发布二创 · 一次性奖励","task.gotRemix":"+3 💎 · 二创发布奖励",
 "task.ptHint":"剧情任务积分可在「任务」页兑换钻石：500 积分 = 1 💎",
 "task.gotVote":"+1 💎 · 每日投票奖励","task.gotChar":"+3 💎 · 发布角色奖励","task.gotWorld":"+3 💎 · 发布世界奖励","task.gotReply":"+1 💎 · 回复奖励","task.gotShare":"+1 💎 · 分享奖励",
 "task.secDaily":"每日任务","task.secBuild":"创作与成长","task.secFollow":"关注我们",
 "task.invite":"邀请一位好友","task.inviteD":"发出一次邀请，每天一次","task.gotInvite":"+1 💎 · 邀请奖励",
 "task.genImg":"生成并分享一张 AI 图片","task.genImgD":"在聊天里生成一张 AI 图片并保存到相册","task.genImgGo":"去任意聊天里生成一张图",
 "task.gotGenimg":"+1 💎 · AI 生图奖励",
 "task.genVid":"生成并分享一段 AI 视频","task.genVidD":"把一张照片变成短视频并分享","task.soon":"即将上线",
 "task.persona":"完善你的人设","task.personaD":"填写昵称、代称和外貌——一次性奖励","task.gotPersona":"+2 💎 · 人设完善奖励",
 "task.interVid":"创建一个互动剧情","task.interVidD":"搭建一个多角色世界——一次性奖励",
 "task.newTool":"体验 AI 语音生成","task.newToolD":"为任意角色生成一段真实 AI 语音","task.newToolGo":"去「我的」页试试","task.gotTool":"+2 💎 · 新工具体验奖励",
 "task.appDl":"下载 APP","task.appDlD":"把 MIRU 添加到主屏幕——一次性奖励","task.appDlToast":"演示——正式版会跳转 App Store / Google Play。","task.gotAppdl":"+2 💎 · 下载奖励",
 "task.follow":"关注我们的 {n}","task.followD":"每个平台一次性奖励","task.gotFollow":"+1 💎 · 关注奖励"});
let liveDailyBusy=false;
async function liveDaily(){if(liveDailyBusy||!SAMPLE)return;liveDailyBusy=true;
 try{for(const p of (S.daily.p||[]).filter(p=>!p.live).slice(0,4)){const c=ch(p.who),th=Object.values(S.threads).filter(o=>o.cast.includes(p.who)).sort((a,b)=>b.at-a.at)[0];
   const r=await SAMPLE("You are "+c.n+" ("+Lz(c.vibe)+"). Write today's social post to the user you're falling for"+(th?", continuing from this: "+(th.mem||[]).slice(-3).join("; ")+" / last line: "+((th.msgs.filter(m=>m.who===p.who).slice(-1)[0]||{}).txt||""):"")+
    ". One or two short sentences, flirty and a little dangerous, ending on a hook that makes them want to reply right now. Adult, no explicit content. Reply in "+(S.lang==="zh"?"Simplified Chinese":"English")+". Output only the post.",{modelTier:"quick"});
   const tx=String((r&&r.text)||"").trim().replace(/^["“]|["”]$/g,"");if(tx.length>6){p.cap={en:tx,zh:tx};p.live=1;save()}}}catch(_){}
 liveDailyBusy=false}
