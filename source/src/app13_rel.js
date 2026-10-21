/* ================= RELATIONSHIP ENGINE v1 — multi-dimension state · Watch mode · point-and-click Director =================
   总纲 ①多人关系网: the two leads have their own numbers (attraction / trust / jealousy / tension / grudge), shown as stage words
   up front and fed into every prompt so they change how he talks. ③ Watch / Join: sit back and watch the two of them.
   ② Director Mode as a game system: tap "make him jealous", pick who — the AI plays it out. Basic events free, control of
   secrets / time / place / a third person is MIRU+ (or 2 💎), per 卡点 #15. */
const RD_KEYS=["att","tru","jea","ten","gru"];
const RD_SEED={ice:{att:44,tru:31,jea:48,ten:62,gru:72},crimson:{att:58,tru:22,jea:30,ten:70,gru:40},made:{att:52,tru:64,jea:35,ten:55,gru:18}};
function rdGet(p){S.rd=S.rd||{};if(!S.rd[p[0]]){const s=RD_SEED[p[0]]||{};S.rd[p[0]]={};RD_KEYS.forEach((k,i)=>S.rd[p[0]][k]=s[k]!=null?s[k]:20+hash(p[0]+k)%55)}return S.rd[p[0]]}
function rdAdd(p,d,why,quiet){const r=rdGet(p),parts=[];for(const k in d){const b=r[k];r[k]=Math.max(0,Math.min(100,b+d[k]));const x=r[k]-b;if(x)parts.push(t("rd."+k)+" "+(x>0?"+":"")+x)}
 S.rdLog=S.rdLog||{};(S.rdLog[p[0]]=S.rdLog[p[0]]||[]).push({at:Date.now(),d:parts.join(" · "),why:why||""});S.rdLog[p[0]]=S.rdLog[p[0]].slice(-20);save();
 if(!quiet&&parts.length)toast(first(ch(p[1]).n)+" ↔ "+first(ch(p[2]).n)+" · "+parts.join(" · "))}
function rdMood(p){const r=rdGet(p),A=first(ch(p[1]).n),B=first(ch(p[2]).n),zh=S.lang==="zh",m=[];
 if(r.gru>=60)m.push(zh?"旧恨还在":"old grudge still burning");if(r.jea>=55)m.push(zh?A+" 在吃醋":A+" is jealous");if(r.tru<30)m.push(zh?"彼此不信任":"no trust yet");if(r.ten>=65)m.push(zh?"一点就着":"one spark from exploding");if(r.att>=65)m.push(zh?"藏不住的心动":"attraction they can't hide");
 return m.slice(0,2).join(" · ")||(zh?"暗流涌动":"something under the surface")}
function rdBars(p){const r=rdGet(p);return '<div class="rdb">'+RD_KEYS.map(k=>'<div class="rdr"><span>'+t("rd."+k)+'</span><i><s class="'+k+'" style="width:'+r[k]+'%"></s></i><b class="num">'+r[k]+'</b></div>').join("")+'</div>'}
/* feed the numbers into the prompt so they actually change behaviour */
memBlock=(function(o){return function(th){const base=o(th),p=th&&th.wid&&pairOf(th.wid);if(!p)return base;const r=rdGet(p),A=ch(p[1]).n,B=ch(p[2]).n;
 return base+"\nRELATIONSHIP STATE between "+A+" and "+B+" (0-100, this drives how they treat each other — never state numbers): attraction "+r.att+", trust "+r.tru+", jealousy "+r.jea+", tension "+r.ten+", old grudge "+r.gru+". Stage: "+relStage(relV(p))+
  ". Rules: grudge>60 → sharp, old wounds come up; jealousy>55 → curt and possessive around anyone else; trust<30 → guarded, half-truths; tension>65 → charged silences, near-misses; attraction>65 → small tells slip out.\n"}})(memBlock);
/* existing events now move the dimensions too */
relAdd=(function(o){return function(p,n,why){const r=o.apply(this,arguments);if(n>0)rdAdd(p,{att:Math.ceil(n/3),tru:Math.ceil(n/5)},why,true);else if(n<0)rdAdd(p,{tru:n*3,ten:-n*2},why,true);return r}})(relAdd);
openThread=(function(o){return function(id){const th=S.threads[id],had=th&&S.caught&&S.caught[th.wid];const r=o.apply(this,arguments);if(had&&th){const p=pairOf(th.wid);if(p)rdAdd(p,{tru:-15,ten:10},S.lang==="zh"?"他发现你翻过他的手机":"He found out you went through his phone")}return r}})(openThread);

/* ---------- relationship panel (tap the pair chip in chat) ---------- */
function relPanel(wid){const p=pairOf(wid);if(!p)return;const nx=relNext(p),log=((S.rdLog||{})[p[0]]||[]).slice(-4).reverse();
 sheet('<div class="row" style="gap:10px"><div class="row" style="gap:0">'+avatar(p[1],40)+'<div style="margin-left:-12px">'+avatar(p[2],40)+'</div></div><div class="grow"><div class="eyebrow" style="color:var(--gold)">'+t("rd.h")+'</div><b style="font-size:17px">'+esc(first(ch(p[1]).n))+' ↔ '+esc(first(ch(p[2]).n))+'</b></div><span class="stagechip big">'+relStage(relV(p))+'</span></div>'+
  '<p class="sm" style="margin-top:8px;color:var(--gold)">'+esc(rdMood(p))+'</p>'+(nx?'<p class="xs dim">'+t("rel.next",{n:nx.need,s:nx.name})+'</p>':'')+rdBars(p)+
  (log.length?'<div class="rdlog"><b>'+t("rd.recent")+'</b>'+log.map(l=>'<div><em>'+esc(l.d)+'</em><span>'+esc(l.why)+'</span></div>').join("")+'</div>':'')+
  '<div class="rdact"><button class="btn btn-p" data-dirsheet="1">🎬 '+t("dr.h")+'</button><button class="btn btn-g" data-watch="1">👀 '+t("wt.mode")+'</button><button class="btn btn-g" data-gcpairgo="'+p[0]+'">🎮 '+t("rel.push")+'</button></div>')}
document.addEventListener("click",e=>{const x=e.target.closest(".status .pairchip");if(!x)return;e.stopImmediatePropagation();const th=S.threads[curT];if(th)relPanel(th.wid)},true);
/* character page: show the dimensions under "his person" */
charRankCard=(function(o){return function(id){let h=o(id);const p=BLP.find(b=>b[1]===id||b[2]===id);if(p)h=h.replace('<div class="relm"','<p class="xs" style="color:var(--gold);margin-top:6px">'+esc(rdMood(p))+'</p>'+rdBars(p)+'<div class="relm" style="display:none"');return h}})(charRankCard);

/* ---------- WATCH mode: the two of them, without you ---------- */
CTX.watch="{u} is only WATCHING this scene (Watch mode) — {u} is not present and nobody addresses {u}. Continue the scene between the characters on your own for one beat: they talk and act with each other, and end on a moment that makes the reader lean in. {x}";
let watchT=null;
function watchStep(th,note){if(!th||busy)return;reply(th,{kind:"watch",txt:note||""})}
function watchBar(){return '<div class="watchbar"><div class="wbh"><span class="wbdot"></span><b>'+t("wt.on")+'</b><span class="xs dim">'+t("wt.onS")+'</span></div><div class="wbb"><button class="btn btn-p" data-wstep="1">▶ '+t("wt.next")+'</button><button class="btn btn-g'+(watchT?" on":"")+'" data-wauto="1">'+(watchT?"⏸ "+t("wt.pause"):"⏯ "+t("wt.auto"))+'</button><button class="btn btn-g" data-dirsheet="1">🎬</button><button class="btn btn-q" data-wjoin="1">✋ '+t("wt.join")+'</button></div></div>'}
renderChat=(function(o){return function(){o.apply(this,arguments);const th=S.threads[curT];if(!th)return;const c=$(".composer");
 if(th.watch&&c){c.outerHTML=watchBar();return}
 if(c&&th.wid&&!c.querySelector("[data-watch]")){const m2=c.querySelector("#modes2");if(m2)m2.insertAdjacentHTML("afterbegin",'<button data-watch="1" class="watchm tool">👀 '+t("wt.mode")+'</button>')}}})(renderChat);
function stopAuto(){clearInterval(watchT);watchT=null}
document.addEventListener("click",e=>{let x;const th=S.threads[curT];
 if(e.target.closest("[data-watch]")){if(!th)return;closeSheet();th.watch=1;save();renderChat();toast(t("wt.toast"));watchStep(th);return}
 if(e.target.closest("[data-wstep]")){watchStep(th);return}
 if(e.target.closest("[data-wauto]")){if(watchT){stopAuto()}else{let n=0;watchStep(th);watchT=setInterval(()=>{const cur=S.threads[curT];if(!cur||!cur.watch||!$(".watchbar")||++n>6){stopAuto();const b=$("[data-wauto]");if(b)b.outerHTML='<button class="btn btn-g" data-wauto="1">⏯ '+t("wt.auto")+'</button>';return}watchStep(cur)},9000)}renderChat();return}
 if(e.target.closest("[data-wjoin]")){stopAuto();if(th){th.watch=0;save();renderChat()}return}});

/* ---------- DIRECTOR: tap an event, pick who, the AI plays it out ---------- */
const DIR_EV=[
 {k:"alone",i:"🚪",free:1,pick:0},{k:"jealous",i:"😤",free:1,pick:1,rd:{jea:12,ten:8}},{k:"drunk",i:"🥃",free:1,pick:1,rd:{ten:6,att:5}},{k:"confess",i:"💌",free:1,pick:1,rd:{att:10,ten:10}},
 {k:"secret",i:"🔐",pick:1,rd:{tru:-8,ten:12}},{k:"fight",i:"⚡",pick:0,rd:{gru:8,ten:14,tru:-5}},{k:"night",i:"🌙",pick:0,rd:{ten:6}},{k:"place",i:"📍",pick:0,place:1,rd:{ten:5}},{k:"third",i:"➕",pick:0,third:1,rd:{jea:15}}];
const DIR_PLACES=["motel","locker","cabin","backstage","rooftop","store"];
function dirSheet(){const th=S.threads[curT];if(!th)return;const p=pairOf(th.wid);closeSheet();
 sheet('<div class="eyebrow" style="color:var(--gold)">🎬 '+t("dr.h")+'</div><h2 style="margin-top:4px">'+t("dr.q")+'</h2>'+(p?'<p class="xs dim" style="margin-top:4px">'+esc(first(ch(p[1]).n))+' ↔ '+esc(first(ch(p[2]).n))+' · '+relStage(relV(p))+' · '+esc(rdMood(p))+'</p>':'')+
  '<div class="drg">'+DIR_EV.map(v=>'<button class="dre'+(v.free?"":" pro")+'" data-dre="'+v.k+'"><i>'+v.i+'</i><b>'+t("dr."+v.k)+'</b><span>'+t("dr."+v.k+"S")+'</span>'+(v.free||S.plus?'':'<em>MIRU+ · 💎 2</em>')+'</button>').join("")+'</div>'+
  '<div class="drfree"><input id="drTxt" placeholder="'+esc(t("dr.own"))+'"><button class="btn btn-p btn-sm" data-drown="1">🎬</button></div>')}
function dirPick(v,cb){const th=S.threads[curT];const cast=th.cast.filter(id=>ch(id));
 sheet('<h2>'+t("dr."+v.k)+'</h2><p class="xs dim" style="margin-top:4px">'+t("dr.who")+'</p><div class="drpick">'+cast.map(id=>'<button data-drwho="'+id+'">'+avatar(id,56)+'<b>'+esc(first(ch(id).n))+'</b></button>').join("")+'</div>');dirPick.cb=cb}
function dirPlace(cb){sheet('<h2>'+t("dr.place")+'</h2><div class="drplaces">'+DIR_PLACES.map(k=>'<button data-drplace="'+k+'">'+t("dp."+k)+'</button>').join("")+'</div>');dirPlace.cb=cb}
function dirThird(cb){const th=S.threads[curT],pool=[...BLSET].filter(id=>!th.cast.includes(id)&&ch(id)).slice(0,8);
 sheet('<h2>'+t("dr.third")+'</h2><div class="drpick">'+pool.map(id=>'<button data-drthird="'+id+'">'+avatar(id,56)+'<b>'+esc(first(ch(id).n))+'</b></button>').join("")+'</div>');dirThird.cb=cb}
function dirRun(v,who,extra){const th=S.threads[curT];if(!th)return;const zh=S.lang==="zh",n=who?ch(who).n:"",p=pairOf(th.wid),other=p?(who===p[1]?ch(p[2]).n:ch(p[1]).n):"";
 const T={alone:zh?"让他们俩单独待在一起，其他人都离开。":"Leave the two of them alone together — everyone else clears out.",
  jealous:zh?"让 "+n+" 吃醋：他亲眼看到 "+(other||"对方")+" 和别人走得很近。":"Make "+n+" jealous: he sees "+(other||"them")+" getting close to someone else.",
  drunk:zh?"让 "+n+" 喝醉，说出平时绝不会说的话。":"Get "+n+" drunk enough to say something he never would sober.",
  confess:zh?"让 "+n+" 先表白——但说得很笨拙，而且时机很糟。":n+" confesses first — clumsily, at the worst possible moment.",
  secret:zh?"揭开 "+n+" 的一个秘密，让在场的人都知道。":"Expose one of "+n+"'s secrets in front of everyone.",
  fight:zh?"让他们俩为一件旧事吵起来。":"Start a real fight between them over something old.",
  night:zh?"时间跳到凌晨 2 点。":"Jump to 2 AM.",
  place:zh?"场景换到："+extra:"Move the scene to: "+extra,
  third:zh?extra+" 突然走进来，而且显然认识他们其中一个。":extra+" walks in — and clearly knows one of them."}[v.k];
 closeSheet();if(p&&v.rd)rdAdd(p,v.rd,t("dr."+v.k));if(th.watch){appendMsg(th,{who:"me",k:"dir",txt:T,at:Date.now()});reply(th,{kind:"watch",txt:"Director's note: "+T})}else doSend(T,"dir")}
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-dirsheet]")){dirSheet();return}
 if(x=e.target.closest("[data-dre]")){const v=DIR_EV.find(d=>d.k===x.dataset.dre);if(!v.free&&!S.plus&&!spend(2,"event"))return;
  if(v.pick)dirPick(v,id=>dirRun(v,id));else if(v.place)dirPlace(pl=>dirRun(v,null,pl));else if(v.third)dirThird(id=>dirRun(v,null,ch(id).n));else dirRun(v);return}
 if(x=e.target.closest("[data-drwho]")){dirPick.cb&&dirPick.cb(x.dataset.drwho);return}
 if(x=e.target.closest("[data-drplace]")){dirPlace.cb&&dirPlace.cb(t("dp."+x.dataset.drplace));return}
 if(x=e.target.closest("[data-drthird]")){dirThird.cb&&dirThird.cb(x.dataset.drthird);return}
 if(e.target.closest("[data-drown]")){const v=($("#drTxt")||{}).value;if(v&&v.trim()){closeSheet();doSend(v.trim(),"dir")}return}});
/* the composer's 🎬 button now opens the point-and-click director */
document.addEventListener("click",e=>{const x=e.target.closest('[data-mode="dir"]');if(!x)return;e.stopImmediatePropagation();dirSheet()},true);

Object.assign(I18N.en,{"rd.att":"Attraction","rd.tru":"Trust","rd.jea":"Jealousy","rd.ten":"Tension","rd.gru":"Old grudge","rd.h":"BETWEEN THEM","rd.recent":"What changed",
 "wt.mode":"Watch","wt.on":"Watching","wt.onS":"They can't see you. Just the two of them.","wt.next":"Keep watching","wt.auto":"Auto","wt.pause":"Pause","wt.join":"Step in","wt.toast":"Watch mode — they don't know you're here",
 "dr.h":"Director","dr.q":"What do you want to happen?","dr.who":"Who?","dr.own":"Or write your own direction…",
 "dr.alone":"Leave them alone","dr.aloneS":"Everyone else clears out","dr.jealous":"Make him jealous","dr.jealousS":"He sees something he shouldn't","dr.drunk":"Get him drunk","dr.drunkS":"He says the quiet part","dr.confess":"Who confesses first","dr.confessS":"Clumsy, bad timing",
 "dr.secret":"Expose a secret","dr.secretS":"In front of everyone","dr.fight":"Start a fight","dr.fightS":"Over something old","dr.night":"Jump to 2 AM","dr.nightS":"Nobody's sleeping","dr.place":"Change the place","dr.placeS":"Motel, locker room, cabin…","dr.third":"Bring in a third","dr.thirdS":"Someone who knows one of them",
 "dp.motel":"A motel with one bed","dp.locker":"The locker room after the game","dp.cabin":"A snowed-in cabin, power out","dp.backstage":"Backstage — someone's listening","dp.rooftop":"A rooftop bar at closing","dp.store":"A 24-hour store at 3 AM"});
Object.assign(I18N.zh,{"rd.att":"吸引","rd.tru":"信任","rd.jea":"嫉妒","rd.ten":"张力","rd.gru":"旧恨","rd.h":"他们之间","rd.recent":"最近的变化",
 "wt.mode":"旁观","wt.on":"旁观中","wt.onS":"他们看不见你，只有他们俩。","wt.next":"继续看","wt.auto":"自动播放","wt.pause":"暂停","wt.join":"加入","wt.toast":"旁观模式——他们不知道你在",
 "dr.h":"导演","dr.q":"你想让他们……","dr.who":"让谁？","dr.own":"或者自己写一句导演指令……",
 "dr.alone":"让他们独处","dr.aloneS":"其他人全部离开","dr.jealous":"让他吃醋","dr.jealousS":"他看到了不该看的","dr.drunk":"灌醉一个","dr.drunkS":"说出平时不敢说的","dr.confess":"谁先表白","dr.confessS":"笨拙，时机很糟",
 "dr.secret":"揭开秘密","dr.secretS":"当着所有人的面","dr.fight":"制造冲突","dr.fightS":"为了一件旧事","dr.night":"跳到凌晨 2 点","dr.nightS":"没人睡得着","dr.place":"换个地点","dr.placeS":"汽车旅馆、更衣室、雪山小屋…","dr.third":"加入第三个人","dr.thirdS":"认识他们其中一个",
 "dp.motel":"只有一张床的汽车旅馆","dp.locker":"比赛后的更衣室","dp.cabin":"停电的雪山小屋","dp.backstage":"剧场后台——有人在偷听","dp.rooftop":"打烊时的屋顶酒吧","dp.store":"凌晨 3 点的便利店"});
