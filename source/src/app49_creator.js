/* ---- v149 · 一句话写一部剧 (Creator) ----
   Quick path: one line → story card → 3 quick picks → free first scene → play it right away.
   Workbench: story · cast · chapters · line editor. Hand edits are always free; AI output is priced by how much it writes,
   quoted before it runs and charged only when it succeeds. Output is a normal MIRU story pack (S.mine.worlds[wid].pack). */
/* AI-cost rule: ¥1 of model cost → $1 → whole 💎 rounded up. Text (DeepSeek, ~¥0.01–0.05 per scene/chapter) → 1 · new image (¥0.1) → 1 · portrait edit (¥0.2) → 2 · video ≈ ¥0.12/s → 1 per second. Music has no model connected yet. */
const CPR={card:1,first:0,line:1,char:1,outline:1,scene:1,chapter:1,tr:1,bg:1,portrait:2,cover:1,music:10,videoSec:1};
const CFREE={card:5,line:3};
function cPrice(kind,qty){qty=qty||1;let p=(CPR[kind]||0)*qty;if(kind==="season")p=Math.max(1,Math.round(CPR.chapter*qty*0.8));
 const text=["card","line","char","outline","scene","chapter","season","tr"].includes(kind);if(S.plus)p=Math.ceil(p*(text?0.5:0.8));return p}
function cFreeLeft(kind){const d=today();S.cfree=S.cfree&&S.cfree.d===d?S.cfree:{d,card:0,line:0};return CFREE[kind]!=null?Math.max(0,CFREE[kind]-(S.cfree[kind]||0)):0}
function cHalf(key){const t=(S.cgen||{})[key];return t&&Date.now()-t<10*60e3}
/* quote → confirm → run → charge only on success */
function cQuote(o){/* o:{kind,qty,key,what,size,run} */let price=cPrice(o.kind,o.qty);const free=cFreeLeft(o.kind)>0;if(free)price=0;const half=!free&&o.key&&cHalf(o.key);if(half)price=Math.ceil(price/2);
 const live=liveOn();if(!live&&o.needLive!==false){o.run(false).then(()=>{}).catch(()=>{});return}
 sheet('<div class="eyebrow" style="color:var(--gold)">✨ '+LL("AI 生成 · 报价","AI generation · quote")+'</div><h2 style="margin-top:6px">'+esc(o.what)+'</h2>'+
  '<div class="cqrow"><span>'+LL("预计产出","Expected output")+'</span><b>'+esc(o.size||"")+'</b></div>'+
  '<div class="cqrow"><span>'+LL("价格","Price")+'</span><b>'+(price?'💎'+price:LL("免费","Free"))+(free?' · '+LL("今日免费次数","free today"):'')+(half?' · '+LL("10 分钟内重写半价","half price redo"):'')+(S.plus&&price?' · '+LL("会员价","member price"):'')+'</b></div>'+
  '<p class="xs faint" style="margin-top:8px;line-height:1.5">'+LL("生成成功才扣费；失败或超时不扣。手动修改永远免费。","Charged only if it succeeds; nothing on failure. Editing by hand is always free.")+'</p>'+
  '<button class="btn btn-p btn-block" style="margin-top:12px" data-cqgo="1">'+(price?LL("确认生成 · 💎","Generate · 💎")+price:LL("开始生成","Generate"))+'</button><p class="xs faint" style="text-align:center;margin-top:6px">💎 '+S.keys+'</p>');
 CQ={o,price,free}}
let CQ=null;
document.addEventListener("click",async e=>{if(!e.target.closest("[data-cqgo]")||!CQ)return;const {o,price,free}=CQ;CQ=null;if(price&&S.keys<price){paySheet&&paySheet("event");return}
 closeSheet();toast(LL("正在生成……","Writing…"));let ok=false;try{ok=await o.run(true)}catch(_){ok=false}
 if(ok){if(price)spend(price,"event");if(free){S.cfree[o.kind]=(S.cfree[o.kind]||0)+1}if(o.key){S.cgen=S.cgen||{};S.cgen[o.key]=Date.now()}save();toast(price?LL("完成 · 扣 💎","Done · 💎")+price:LL("完成","Done"))}
 else toast(LL("没生成出来，没有扣费","It didn't work — nothing was charged"))});
function cAsk(prompt,ms){return Promise.race([new Promise((_,rj)=>setTimeout(()=>rj("timeout"),ms||45000)),ask(prompt,{modelTier:"default"})])}
/* ---------- templates (from Creator v2.1, all fictional adults) ---------- */
const CTPL=[
 {id:"vampire",ic:"🩸",k:/吸血鬼|血族|vampire/i,lib:"m_noble",sl:"m_cafe",lead:["Aiden","Aiden"],sup:["Noah","Noah"],t:["午夜来客","The Midnight Guest"],
  lr:["古老的吸血鬼，受了伤","An ancient vampire, wounded"],sr:["你的邻居，知道得比他说的多","Your neighbor, who knows more than he says"],place:["暴雨中的旧公寓","An old apartment in a storm"],time:["凌晨两点","2 a.m."],
  obj:["一把沾血的银钥匙","A bloodied silver key"],sec:["钥匙能打开一个保险库，Aiden 不知道是谁把它交给了你","The key opens a vault — Aiden doesn't know who gave it to you"],con:["你可以救他，却不确定他会不会把危险带进来","You can save him — but not without letting the danger in"],
  hook:["请别开灯。有人正在找我们。","Don't turn on the light. Someone is looking for us."]},
 {id:"mafia",ic:"♠️",k:/黑帮|继承|大佬|mafia|保镖/i,lib:"m_mafia",sl:"m_boss",lead:["Dante","Dante"],sup:["Theo","Theo"],t:["黑帮继承人的最后一夜","The Heir's Last Night"],
  lr:["港口家族的继承人","Heir to the harbor family"],sr:["他的副手，忠诚得可疑","His second, suspiciously loyal"],place:["纽约深夜的顶层公寓","A Manhattan penthouse at night"],time:["周五 晚上11点","Fri 11 p.m."],
  obj:["一份没有签名的继承协议","An unsigned inheritance agreement"],sec:["协议第二页被人调换了，Dante 只知道一部分","Page two was swapped; Dante knows only part of it"],con:["他想保护你，但保护你意味着失去一切","Protecting you means losing everything he has"],
  hook:["今晚有人会来。他们认得你的名字。","Someone's coming tonight. They know your name."]},
 {id:"campus",ic:"🏫",k:/校园|学生|大学|学长|campus/i,lib:"m_senior",sl:"m_idol",lead:["Kai","Kai"],sup:["Leon","Leon"],t:["唯独讨厌我的学生会长","The President Who Only Hates Me"],
  lr:["学生会长，全校都喜欢他","Student council president; everyone adores him"],sr:["你的室友，看热闹不嫌事大","Your roommate, loving the drama"],place:["纽约大学戏剧楼","NYU's theater building"],time:["周三 傍晚","Wed evening"],
  obj:["一份匿名投票记录","An anonymous ballot record"],sec:["他偷偷留着一封给你、却没送出的邀请","He kept an invitation for you he never sent"],con:["公开的对立和私下的偏爱，只能留一个","Public rivalry or private favor — only one can stay"],
  hook:["我不想和你搭档。……钥匙给你，别弄丢。","I don't want you as my partner. ...Here's the key. Don't lose it."]},
 {id:"wolf",ic:"🐺",k:/狼|wolf/i,lib:"m_doctor2",sl:"m_mafia",lead:["Ronan","Ronan"],sup:["Cale","Cale"],t:["黑森林的第四个名字","The Fourth Name in the Black Woods"],
  lr:["狼群首领","Leader of the pack"],sr:["他的副手，看你的眼神像认识你","His second, who looks at you like he knows you"],place:["风雪封路的森林旅馆","A snowed-in forest inn"],time:["深夜","Late night"],
  obj:["刻着第四个名字的徽章","A badge with a fourth name"],sec:["最后一个名字被磨掉了，每个人只知道一部分","The last name was scratched out; each knows only a piece"],con:["所谓命定，也许是一场布置好的谎言","Fate may be a lie someone set up"],
  hook:["千万别说出你的真名。","Whatever you do, don't say your real name."]},
 {id:"room",ic:"🌙",k:/室友|宿舍|同居|roommate/i,lib:"m_cafe",sl:"m_senior",lead:["Ethan","Ethan"],sup:["Luca","Luca"],t:["宿舍最后一盏灯","The Last Light in the Dorm"],
  lr:["话很少的室友","Your quiet roommate"],sr:["隔壁宿舍的朋友","A friend from next door"],place:["波士顿大学宿舍","A Boston dorm room"],time:["凌晨一点","1 a.m."],
  obj:["一本写满涂改的便签","A notepad full of crossed-out lines"],sec:["便签本里夹着一封一直没递出的道歉信","There's an apology in it he never handed over"],con:["说破了，可能毁掉现在最安稳的关系","Saying it could ruin the safest thing you have"],
  hook:["灯给你留着。……别多想。","I left the light on for you. ...Don't read into it."]},
 {id:"survival",ic:"🔑",k:/生存|规则|恐怖|逃生|survival/i,lib:"m_doctor",sl:"m_noble",lead:["Samuel","Samuel"],sup:["Eli","Eli"],t:["七日规则","Seven Days of Rules"],
  lr:["神秘的规则管理员","The mysterious keeper of the rules"],sr:["和你一起被困的人","Someone trapped with you"],place:["一座离不开的旅馆","A hotel you can't leave"],time:["第一夜","The first night"],
  obj:["一块倒数七分钟的怀表","A pocket watch counting down seven minutes"],sec:["管理员也不是规则的制定者，他也想逃出去","The keeper didn't write the rules — he wants out too"],con:["守规则才能活，破规则才能走","Follow the rules to live; break them to leave"],
  hook:["钟声响的时候，别相信第一个说爱你的人。","When the bell rings, don't trust the first one who says he loves you."]},
 {id:"idol",ic:"🎤",k:/偶像|顶流|明星|娱乐圈|idol/i,lib:"m_idol",sl:"m_boss",lead:["Ash","Ash"],sup:["Milo","Milo"],t:["全世界以为我们在恋爱","Everyone Thinks We're Dating"],
  lr:["冷面顶流","A cold-faced superstar"],sr:["他的经纪人","His manager"],place:["洛杉矶颁奖礼后台","Backstage at an L.A. awards show"],time:["周六 晚上","Sat night"],
  obj:["一张被误发的合影","A photo posted by mistake"],sec:["经纪人在用这场绯闻掩盖另一条消息","His manager is using the rumor to bury another story"],con:["他必须澄清，你却必须让误会继续","He has to deny it; you need it to keep going"],
  hook:["先别解释。……就这样站着。","Don't explain yet. ...Just stand here."]},
 {id:"open",ic:"✨",k:/.*/,lib:"m_boss",sl:"m_cafe",lead:["Alex","Alex"],sup:["Morgan","Morgan"],t:["深夜来信","A Letter After Midnight"],
  lr:["和你命运交错的人","Someone whose path keeps crossing yours"],sr:["寄信的人","The one who sent the letter"],place:["深夜的城市","The city after midnight"],time:["凌晨","Past midnight"],
  obj:["一封没有署名的信","An unsigned letter"],sec:["第二封信还在路上","A second letter is on its way"],con:["两个人想靠近，却对同一件事看法相反","You want to get closer, but you're on opposite sides of one thing"],
  hook:["你是……收信的人？","Are you... the one the letter was for?"]}];
function cPick(idea){const t=String(idea||"");return CTPL.find(x=>x.id!=="open"&&x.k.test(t))||CTPL.find(x=>x.id==="open")}
function cL(a){return Array.isArray(a)?LL(a[0],a[1]):a}
function cardFromTpl(tp,idea){return {tpl:tp.id,idea:idea||"",title:cL(tp.t),lead:{name:cL(tp.lead),role:cL(tp.lr),lib:tp.lib},sup:{name:cL(tp.sup),role:cL(tp.sr),lib:tp.sl},place:cL(tp.place),time:cL(tp.time),obj:cL(tp.obj),sec:cL(tp.sec),con:cL(tp.con),hook:cL(tp.hook)}}
async function cardFromAI(idea){const r=await cAsk("Design an original interactive romance-drama story (adult characters, 21+, US setting, BL by default) from this one-line idea: \""+idea+"\". Language: "+LANG_NAME[S.lang]+'. Reply ONLY JSON {"title":"","lead":{"name":"English first name","role":"one line"},"sup":{"name":"English first name","role":"one line"},"place":"","time":"","obj":"one key object","sec":"the core secret, who knows it","con":"the core conflict","hook":"the lead\'s first line to the user, one sentence"}',30000);
 if(!r||!r.title||!r.lead||!r.lead.name)throw 0;const tp=cPick(idea);return Object.assign(cardFromTpl(tp,idea),{title:r.title,lead:{name:r.lead.name,role:r.lead.role||"",lib:tp.lib},sup:{name:(r.sup&&r.sup.name)||cL(tp.sup),role:(r.sup&&r.sup.role)||"",lib:tp.sl},place:r.place||"",time:r.time||"",obj:r.obj||"",sec:r.sec||"",con:r.con||"",hook:r.hook||""})}
/* ---------- offline first scene + outline ---------- */
const ARC={1:[["一夜","One Night"]],3:[["相遇","The Meeting"],["秘密","The Secret"],["选择","The Choice"]],
 10:[["相遇","The Meeting"],["秘密的边缘","The Edge of a Secret"],["第三个人","The Third Person"],["裂缝","The Crack"],["真相的一半","Half the Truth"],["失去","Losing It"],["代价","The Cost"],["反转","The Turn"],["最后的选择","The Last Choice"],["结局","The Ending"]]};
function cFirstScene(c,L,S2){return [["sys","scene",{place:c.place,time:c.time}],["sys","bgm",{m:"mystery"}],
 ["n","act",LL(c.place+"，"+c.time+"。四周安静得能听见自己的呼吸。",c.place+", "+c.time+". So quiet you can hear yourself breathe.")],
 ["n","act",LL("你手边放着"+c.obj+"。你不记得它是怎么到你手里的。",c.obj+" sits within reach. You don't remember how it got there.")],
 [L,"act",LL(c.lead.name+"出现在门口。"+c.lead.role+"——你一眼就认出了这种人。他没有马上开口，先看了一眼你手里的东西。",c.lead.name+" is in the doorway — "+c.lead.role.toLowerCase()+". He doesn't speak right away; he looks at what's in your hand first.")],
 [L,"say",c.hook],
 ["n","act",LL("他的声音很低，像是怕吵醒什么。","His voice is low, like he's afraid of waking something.")],
 [L,"say",LL("你拿着的东西，不该在你这儿。","What you're holding shouldn't be with you.")],
 ["sys","event",{icon:"🗝",title:LL("关键道具","Key object"),txt:c.obj}],
 [S2,"act",LL(c.sup.name+"从走廊另一头走过来。"+c.sup.role+"。他看了"+c.lead.name+"一眼，又看了你一眼。",c.sup.name+" comes down the hall — "+c.sup.role.toLowerCase()+". He looks at "+c.lead.name+", then at you.")],
 [S2,"say",LL("你们俩认识？……有意思。","You two know each other? ...Interesting.")],
 [L,"think",LL("不能让他知道。至少今晚不能。","He can't know. Not tonight.")],
 ["n","act",LL("空气一下子绷紧了。"+c.con+"。","The air pulls tight. "+c.con+".")],
 [L,"say",LL("跟我走，或者把它交给他。你只有一次机会。","Come with me, or hand it to him. You get one chance.")]]}
function cChoices(c,L,S2,n,last){return [
 {k:"A",t:{zh:"相信"+c.lead.name,en:"Trust "+c.lead.name},then:{zh:[[L,"act",c.lead.name+"的肩膀松了一点点。"],[L,"say","……好。跟紧我。"]],en:[[L,"act",c.lead.name+"'s shoulders ease, barely."],[L,"say","...Good. Stay close."]]},mem:{zh:"你选择相信"+c.lead.name+"。",en:"You chose to trust "+c.lead.name+"."}},
 {k:"B",t:{zh:"先保持距离，看清再说",en:"Keep your distance until you know more"},then:{zh:[["n","act","你没有动。两个人都在等你。"]],en:[["n","act","You don't move. They're both waiting on you."]]},mem:{zh:"你选择先观望。",en:"You chose to wait and watch."}},
 {k:"C",t:{zh:"把东西交给"+c.sup.name,en:"Hand it to "+c.sup.name},then:{zh:[[S2,"act",c.sup.name+"接过去，笑了。"],[L,"act",c.lead.name+"的脸冷了下来。"]],en:[[S2,"act",c.sup.name+" takes it and smiles."],[L,"act",c.lead.name+"'s face goes cold."]]},mem:{zh:"你把关键道具交给了"+c.sup.name+"。",en:"You gave the key object to "+c.sup.name+"."}}]}
function cOutlineBeats(c,L,S2,n,tt){const z=[["n","act","【大纲】"+tt[0]+"："+[c.sec,c.con,c.sup.name+"的真实目的浮出水面",c.lead.name+"终于说出一半实话","有人为"+c.obj+"付出代价"][n%5]+"。"],[L,"say","……我们得谈谈。"]],
 e=[["n","act","[Outline] "+tt[1]+": "+[c.sec,c.con,c.sup.name+"'s real aim surfaces",c.lead.name+" finally tells half the truth","Someone pays for "+c.obj][n%5]+"."],[L,"say","...We need to talk."]];return {zh:z,en:e}}
function cBuildWorld(c,picks){const now=Date.now(),wid="cw"+now,L="u"+now,S2="u"+(now+1),x0=s=>({en:s,zh:s});
 const mk=(id,p,age)=>({n:p.name,age,g:"m",h:"",w:wid,pal:[["#C98A6B","#1B1520"],["#7A63C9","#141024"],["#5E9E96","#13212A"]][hash(id)%3],a:"charm",v:{pitch:1,rate:1},by:"@"+(me()||"you").toLowerCase(),
  role:x0(p.role),looks:x0(""),vibe:x0(p.role),tells:{en:[],zh:[]},twist:x0(""),likes:x0(""),secret:x0(id===L?c.sec:""),pitch:x0(id===L?c.hook:""),solo:x0(id===L?c.hook:"…"),
  studio:{name:p.name,age:String(age),g:"m",callYou:"",role:p.role,rel:"",style:"",setting:c.place,looks:"",vibe:p.role,tells:"",secret:id===L?c.sec:"",opening:id===L?c.hook:"",gong:[],shou:[],pair:"bl",img:null,chat:[],step:99,filled:{},ver:1}});
 S.mine.chars[L]=mk(L,c.lead,28);S.mine.chars[S2]=mk(S2,c.sup,27);
 const lib=window.STUDIO_LIB||{};if(lib[c.lead.lib])S.art[L]=lib[c.lead.lib];if(lib[c.sup.lib])S.art[S2]=lib[c.sup.lib];
 const n=+picks.len||3,arc=ARC[n]||ARC[3],chs=arc.map((tt,i)=>({t:{zh:tt[0],en:tt[1]},goal:x0(i===0?c.con:LL("推进：","Next: ")+tt[0]),place:x0(c.place),time:x0(c.time),ask:x0(LL("你怎么做？","What do you do?")),
  beats:i===0?{zh:[],en:[]}:cOutlineBeats(c,L,S2,i,tt),choices:cChoices(c,L,S2,i,i===arc.length-1),outline:i>0}));
 const end=(zh,en)=>({t:{zh,en},txt:x0(""),line:x0("")});
 const pack={chapters:chs,endings:{A:end("在一起","Together"),B:end("各自安好","Apart, and okay"),C:end("反目","Enemies")},join:[{as:L,t:x0(LL("扮演"+c.lead.name,"Play as "+c.lead.name))}],pov:null,love:L,
  logline:x0(c.hook),features:{game:x0(""),date:x0(""),gift:x0(""),photo:x0(""),voice:x0(""),room:x0("")},director:{allowed:[],au:[]},bonus:{t:x0(""),d:x0("")},ready:n,mine:1,card:c,
  intro:{zh:{bg:[c.place+"，"+c.time+"。",c.con+"。","你手里有"+c.obj+"——它不该在你这儿。"],you:"你以自己的身份进入故事。你的选择会改变"+c.lead.name+"对你的信任、吸引和张力，也会改变每一章的走向。",cast:[[L,c.lead.role],[S2,c.sup.role]]},
   en:{bg:[c.place+", "+c.time+".",c.con+".","You're holding "+c.obj.toLowerCase()+" — it shouldn't be yours."],you:"You enter as yourself. Your choices change "+c.lead.name+"'s trust, attraction and tension — and where every chapter goes.",cast:[[L,c.lead.role],[S2,c.sup.role]]}}};
 const heat={sweet:"fluff",pull:"slow",dark:"steamy",mystery:"slow"}[picks.tone]||"slow";
 S.mine.worlds[wid]={id:wid,or:"bl",pal:S.mine.chars[L].pal,author:"@"+(me()||"you").toLowerCase(),official:false,mine:1,mineAt:now,stats:[0,0,0],heat,cast:[L,S2],tags:[cL((CTPL.find(x=>x.id===c.tpl)||{}).t)||""].filter(Boolean),
  title:x0(c.title),hook:x0(c.hook),premise:x0(c.con),you:x0(LL("你自己","Yourself")),warn:x0(""),rel:[[L,S2,x0(c.sup.role)]],status:{time:x0(c.time),place:x0(c.place)},pack,cover:null};
 const ps=packSt(wid);ps.own=1;S.works.unshift({id:wid,kind:"story",title:c.title,at:now,seed:0});save();return {wid,L,S2}}
async function cWriteScene(wid,first){const w=wd(wid),P=w.pack,c=P.card,L=w.cast[0],S2=w.cast[1];
 if(liveOn()){try{const r=await cAsk("Write the "+(first?"opening scene":"chapter")+" of an interactive romance drama as JSON. Story: "+JSON.stringify(c)+". Cast ids: LEAD = "+c.lead.name+", SUP = "+c.sup.name+". The user is the second person (\"you\"), never speaks in the script. Rules: concrete sensory detail, restrained male-coded voice, push-pull, no clichés, no stating emotions outright. "+(first?"20-26":"40-60")+" beats. Language: "+LANG_NAME[S.lang]+'. Reply ONLY JSON {"beats":[["n|LEAD|SUP","act|say|think","text"]...]}',first?45000:90000);
   if(r&&Array.isArray(r.beats)&&r.beats.length>=8){const map={LEAD:L,SUP:S2,n:"n"};const B=r.beats.filter(b=>Array.isArray(b)&&b.length>=3&&map[b[0]]&&["act","say","think"].includes(b[1])).map(b=>[map[b[0]],b[0]==="n"?"act":b[1],String(b[2]).slice(0,300)]);
    if(B.length>=8){return [["sys","scene",{place:c.place,time:c.time}]].concat(B)}}}catch(_){}}
 return first?cFirstScene(c,L,S2):null}
/* ---------- wizard ---------- */
let CW=null;
function cNew(){CW={step:1,idea:"",card:null,picks:{as:"side",tone:"pull",len:"3",mode:"mix",twist:"mid"}};cRender()}
function cRender(){const c=CW.card;let b="";
 if(CW.step===1){b='<div class="cwq">'+LL("你最想体验一个什么故事？","What story do you want to live?")+'</div><p class="xs faint">'+LL("一句话就行。AI 会补全题材、场景、人物和秘密——之后都能改。","One line is enough. AI fills in the rest — you can change all of it later.")+'</p>'+
  '<textarea id="cwIdea" rows="3" class="cwta" placeholder="'+esc(LL("例如：深夜有个受伤的吸血鬼敲我的门","e.g. A wounded vampire knocks on my door at 2 a.m."))+'">'+esc(CW.idea)+'</textarea>'+
  '<div class="cwchips">'+CTPL.filter(x=>x.id!=="open").map(x=>'<button data-cwtpl="'+x.id+'">'+x.ic+' '+esc(cL(x.t))+'</button>').join("")+'</div>'+
  '<button class="btn btn-p btn-block" style="margin-top:14px" data-cwcard="1">✨ '+LL("生成故事卡","Make my story card")+' · '+(cFreeLeft("card")>0?LL("今日还剩 "+cFreeLeft("card")+" 次免费","free · "+cFreeLeft("card")+" left today"):"💎"+cPrice("card"))+'</button>'}
 if(CW.step===2&&c){b='<div class="cwcard"><div class="eyebrow" style="color:var(--gold)">'+LL("故事卡","Story card")+'</div><input class="cwtitle" data-cwf="title" value="'+esc(c.title)+'">'+
  [["lead.name",LL("主角","Lead")],["lead.role",LL("主角身份","Lead is")],["sup.name",LL("配角","Second")],["sup.role",LL("配角身份","Second is")],["place",LL("场景","Where")],["time",LL("时间","When")],["obj",LL("关键道具","Key object")],["sec",LL("秘密","Secret")],["con",LL("核心矛盾","Conflict")],["hook",LL("他的第一句话","His first line")]].map(([k,l])=>'<label class="cwf"><span>'+l+'</span><input data-cwf="'+k+'" value="'+esc(k.split(".").reduce((o,x)=>o&&o[x],c)||"")+'"></label>').join("")+
  '<button class="btn btn-g btn-sm" style="margin-top:8px" data-cwcard="1">↻ '+LL("换一个","Try another")+'</button></div>'+
  '<div class="cwq" style="margin-top:16px">'+LL("三个快选","Three quick picks")+'</div>'+
  cRow("as",LL("你以什么身份进入","Who are you"),[["side",LL("我自己","Myself")],["lead",LL("扮演 "+c.lead.name,"Play "+c.lead.name)],["watch",LL("旁观导演","Direct from outside")]])+
  cRow("tone",LL("情绪走向","Mood"),[["sweet",LL("甜","Sweet")],["pull",LL("拉扯","Push-pull")],["dark",LL("暗黑危险","Dark")],["mystery",LL("悬疑","Mystery")]])+
  cRow("len",LL("篇幅","Length"),[["1",LL("短篇 1 章","1 chapter")],["3",LL("迷你季 3 章","3 chapters")],["10",LL("标准季 10 章","10 chapters")]])+
  cRow("mode",LL("故事节奏","Pacing"),[["plot",LL("强剧情","Plot-driven")],["mix",LL("剧情+日常","Mixed")],["daily",LL("日常陪伴","Everyday")]])+
  cRow("twist",LL("反转密度","Twists"),[["low",LL("少","Few")],["mid",LL("中","Some")],["high",LL("多","Many")]])+
  '<button class="btn btn-p btn-block" style="margin-top:16px" data-cwgo="1">▶ '+LL("生成第一幕并试玩 · 免费","Write scene 1 & play · free")+'</button>'+
  '<p class="xs faint" style="text-align:center;margin-top:6px">'+LL("之后的章节在「工作台」里按量生成，手动修改永远免费","Later chapters are generated in the Workbench, priced by size; hand edits are free")+'</p>'}
 screen("s-cnew",'<div class="topbar"><button class="ibtn" data-back="1">'+ic("back")+'</button><h2 class="grow" style="font-size:18px">'+LL("一句话写一部剧","Write a story from one line")+'</h2><span class="xs faint">'+CW.step+' / 2</span></div><div class="scroll pad">'+b+'</div>');show("s-cnew")}
function cRow(k,label,opts){return '<div class="cwrow"><span>'+label+'</span><div>'+opts.map(([v,l])=>'<button data-cwp="'+k+'|'+v+'" class="'+(CW.picks[k]===v?"on":"")+'">'+esc(l)+'</button>').join("")+'</div></div>'}
document.addEventListener("input",e=>{const x=e.target;if(!CW)return;if(x.id==="cwIdea")CW.idea=x.value;if(x.dataset&&x.dataset.cwf&&CW.card){const p=x.dataset.cwf.split(".");if(p.length===2)CW.card[p[0]][p[1]]=x.value;else CW.card[p[0]]=x.value}});
document.addEventListener("click",async e=>{let x;if(!e.target.closest("#s-cnew"))return;
 if(x=e.target.closest("[data-cwtpl]")){const tp=CTPL.find(t2=>t2.id===x.dataset.cwtpl);CW.idea=cL(tp.t);const ta=$("#cwIdea");if(ta)ta.value=CW.idea;return}
 if(e.target.closest("[data-cwcard]")){const idea=(CW.idea||"").trim()||cL(CTPL[Math.floor(Math.random()*7)].t);
  const run=async live=>{if(live){try{CW.card=await cardFromAI(idea)}catch(_){return false}}else CW.card=cardFromTpl(cPick(idea),idea);CW.step=2;cRender();return true};
  if(!liveOn()){await run(false);return}cQuote({kind:"card",what:LL("故事卡","Story card"),size:LL("标题、两位主要人物、场景、秘密、矛盾、开场白","Title, two leads, setting, secret, conflict, opening line"),run});return}
 if(x=e.target.closest("[data-cwp]")){const [k,v]=x.dataset.cwp.split("|");CW.picks[k]=v;$$('[data-cwp^="'+k+'|"]').forEach(b=>b.classList.toggle("on",b===x));return}
 if(e.target.closest("[data-cwgo]")){const c=CW.card;if(!c)return;toast(LL("正在写第一幕……","Writing scene 1…"));const {wid,L}=cBuildWorld(c,CW.picks);
  const first=await cWriteScene(wid,true);const w=wd(wid);w.pack.chapters[0].beats={zh:first,en:first};save();
  const as=CW.picks.as==="lead"?L:CW.picks.as==="watch"?"watch":"side";CW=null;packStart(wid,as);return}});
/* ---------- workbench ---------- */
let CB={wid:null,tab:"story",ed:null};
function cWork(wid,tab){CB.wid=wid;if(tab)CB.tab=tab;const w=wd(wid);if(!w||!w.pack)return;const P=w.pack;let b="";
 const tabs='<div class="sdtabs">'+[["story",LL("故事","Story")],["cast",LL("人物","Cast")],["chs",LL("章节","Chapters")]].map(([k,l])=>'<button data-cbtab="'+k+'" class="'+(CB.tab===k?"on":"")+'">'+l+'</button>').join("")+'</div>';
 if(CB.tab==="story"){b=[["title",LL("标题","Title")],["hook",LL("一句话钩子","Hook")],["premise",LL("核心矛盾","Conflict")]].map(([k,l])=>'<label class="cwf"><span>'+l+'</span><textarea rows="2" data-cbw="'+k+'">'+esc(Lz(w[k]))+'</textarea></label>').join("")+
  '<div class="cwq" style="margin-top:12px">'+LL("开场介绍","Intro")+'</div><textarea rows="5" class="cwta" data-cbintro="1">'+esc((Lz(P.intro)||{}).bg?(Lz(P.intro).bg||[]).join("\n"):"")+'</textarea>'+
  '<p class="xs faint" style="margin-top:6px">'+LL("这里的修改都免费，自动保存。","Edits here are free and save automatically.")+'</p>'}
 if(CB.tab==="cast"){b=w.cast.map(id=>{const c=ch(id);return '<div class="cbchar">'+avatar(id,48)+'<div class="grow"><b>'+esc(c.n)+'</b><span>'+esc(Lz(c.role))+'</span></div><button class="btn btn-g btn-sm" data-sdedit="'+id+'">✏️ '+LL("打磨","Polish")+'</button></div>'}).join("")+
  '<p class="xs faint" style="margin-top:8px;line-height:1.5">'+LL("在角色工作室里改性格、形象（形象库 / 上传免费）、音色和配角。","Edit personality, portrait (library/upload free), voice and side characters in the Character Studio.")+'</p>'}
 if(CB.tab==="chs"){const todo=P.chapters.filter(c=>c.outline).length;
  b=(todo&&liveOn()?'<button class="btn btn-p btn-block btn-sm" data-cbseason="1">✨ '+LL("AI 写完剩下 "+todo+" 章 · 💎"+cPrice("season",todo)+"（8 折）","AI-write the other "+todo+" chapters · 💎"+cPrice("season",todo)+" (20% off)")+'</button>':'')+
  P.chapters.map((c,i)=>{const n=i+1,lines=(packBeats(c.beats)||[]).length;return '<div class="cbch"><div class="row"><i>'+n+'</i><input data-cbct="'+i+'" value="'+esc(Lz(c.t))+'"><span class="xs faint">'+(c.outline?LL("大纲","Outline"):lines+LL(" 句"," lines"))+'</span></div>'+
   '<div class="cbbtns"><button data-cbplay="'+n+'">▶ '+LL("试玩","Play")+'</button><button data-cbedit="'+i+'">📝 '+LL("编辑","Edit")+'</button><button data-cbgen="'+i+'">✍️ '+LL("AI 写这一章","AI-write")+' · '+(liveOn()?'💎'+(cHalf(CB.wid+":ch"+i)?Math.ceil(cPrice("chapter")/2):cPrice("chapter")):LL("需实时 AI","needs live AI"))+'</button></div></div>'}).join("")+
  '<button class="btn btn-g btn-block btn-sm" style="margin-top:10px" data-cbprice="1">💎 '+LL("价格说明","Pricing")+'</button>'}
 screen("s-cwork",'<div class="topbar"><button class="ibtn" data-back="1">'+ic("back")+'</button><h2 class="grow" style="font-size:18px">🛠 '+esc(Lz(w.title))+'</h2><button class="btn btn-p btn-sm" data-cbplay="1">▶ '+LL("试玩","Play")+'</button></div>'+tabs+'<div class="scroll pad">'+b+'</div>');show("s-cwork")}
function cEdit(i){const w=wd(CB.wid),c=w.pack.chapters[i];const B=packBeats(c.beats).slice();CB.ed={i,B};cEditRender()}
function cEditRender(){const w=wd(CB.wid),{i,B}=CB.ed,c=w.pack.chapters[i],L=w.cast[0],S2=w.cast[1];const who=[["n",LL("旁白","Narr.")],[L,first(ch(L).n)],[S2,first(ch(S2).n)]];
 const rows=B.map((b,j)=>{if(b[0]==="sys")return '<div class="cerow sys"><span>⚙ '+esc(b[1])+(b[2]&&b[2].place?' · '+esc(b[2].place):'')+'</span><button data-cedel="'+j+'">✕</button></div>';
  return '<div class="cerow"><div class="row"><select data-cewho="'+j+'">'+who.map(([v,l])=>'<option value="'+v+'"'+(b[0]===v?" selected":"")+'>'+esc(l)+'</option>').join("")+'</select><select data-cekind="'+j+'">'+[["act",LL("动作/旁白","Action")],["say",LL("台词","Line")],["think",LL("心声","Thought")]].map(([v,l])=>'<option value="'+v+'"'+(b[1]===v?" selected":"")+'>'+l+'</option>').join("")+'</select><button data-cealt="'+j+'" title="AI">↻ '+(cFreeLeft("line")>0?LL("免费","free"):"💎"+cPrice("line"))+'</button><button data-cedel="'+j+'">✕</button></div><textarea rows="2" data-cetx="'+j+'">'+esc(typeof b[2]==="string"?b[2]:"")+'</textarea></div>'}).join("");
 screen("s-cedit",'<div class="topbar"><button class="ibtn" data-back="1">'+ic("back")+'</button><h2 class="grow" style="font-size:17px">'+LL("第 "+(i+1)+" 章 · ","Ch. "+(i+1)+" · ")+esc(Lz(c.t))+'</h2><button class="btn btn-p btn-sm" data-cesave="1">'+LL("保存","Save")+'</button></div><div class="scroll pad">'+rows+
  '<button class="btn btn-g btn-block btn-sm" style="margin-top:8px" data-ceadd="1">＋ '+LL("加一句","Add a line")+'</button>'+
  '<div class="cwq" style="margin-top:14px">'+LL("章末选择","End-of-chapter choices")+'</div>'+c.choices.map((o,k)=>'<label class="cwf"><span>'+o.k+'</span><input data-cech="'+k+'" value="'+esc(Lz(o.t))+'"></label>').join("")+
  '<p class="xs faint" style="margin-top:8px">'+LL("手动修改永远免费。","Hand edits are always free.")+'</p></div>');show("s-cedit")}
document.addEventListener("input",e=>{const x=e.target;if(!x.dataset)return;const w=CB.wid&&wd(CB.wid);if(!w)return;
 if(x.dataset.cbw){w[x.dataset.cbw]={en:x.value,zh:x.value};if(x.dataset.cbw==="title"){const wk=S.works.find(k=>k.id===CB.wid);if(wk)wk.title=x.value}save();return}
 if(x.dataset.cbintro){const L2=x.value.split("\n").filter(Boolean);["zh","en"].forEach(l=>{w.pack.intro[l].bg=L2});save();return}
 if(x.dataset.cbct!=null){w.pack.chapters[+x.dataset.cbct].t={en:x.value,zh:x.value};save();return}
 if(x.dataset.cetx!=null&&CB.ed){CB.ed.B[+x.dataset.cetx][2]=x.value;return}
 if(x.dataset.cech!=null&&CB.ed){const o=w.pack.chapters[CB.ed.i].choices[+x.dataset.cech];o.t={en:x.value,zh:x.value};save()}});
document.addEventListener("change",e=>{const x=e.target;if(!CB.ed||!x.dataset)return;if(x.dataset.cewho!=null){const b=CB.ed.B[+x.dataset.cewho];b[0]=x.value;if(x.value==="n")b[1]="act"}if(x.dataset.cekind!=null){const b=CB.ed.B[+x.dataset.cekind];if(b[0]!=="n")b[1]=x.value}});
document.addEventListener("click",async e=>{let x;
 if(x=e.target.closest("[data-cnew]")){cNew();return}
 if(x=e.target.closest("[data-cwork]")){closeSheet();cWork(x.dataset.cwork,"chs");return}
 if(!e.target.closest("#s-cwork,#s-cedit,.sheet"))return;
 if(x=e.target.closest("[data-cbtab]")){cWork(CB.wid,x.dataset.cbtab);return}
 if(x=e.target.closest("[data-cbplay]")){const n=+x.dataset.cbplay,w=wd(CB.wid);packStart(CB.wid,"side",n>1?n:undefined);return}
 if(x=e.target.closest("[data-cbedit]")){cEdit(+x.dataset.cbedit);return}
 if(x=e.target.closest("[data-cbprice]")){cPriceSheet();return}
 if(x=e.target.closest("[data-cbgen]")){const i=+x.dataset.cbgen,wid=CB.wid,w=wd(wid);if(!liveOn()){toast(LL("AI 写整章需要开启实时 AI；现在可以先在「编辑」里手写，免费。","Writing a chapter needs live AI; you can write it by hand in Edit for free."));return}
  cQuote({kind:"chapter",key:wid+":ch"+i,what:LL("第 "+(i+1)+" 章完整剧本","Chapter "+(i+1)+" full script"),size:LL("约 40–60 句 + 章末 3 个选择","About 40–60 lines + 3 end choices"),run:async()=>{const B=await cWriteScene(wid,false);if(!B)return false;const c=w.pack.chapters[i];c.beats={zh:B,en:B};c.outline=false;save();cWork(wid,"chs");return true}});return}
 if(e.target.closest("[data-cbseason]")){const wid=CB.wid,w=wd(wid),idx=w.pack.chapters.map((c,i)=>c.outline?i:-1).filter(i=>i>=0);
  cQuote({kind:"season",qty:idx.length,what:LL("剩下 "+idx.length+" 章完整剧本","The remaining "+idx.length+" chapters"),size:LL("每章约 40–60 句，打包 8 折","~40–60 lines each, bundled at 20% off"),run:async()=>{let n=0;for(const i of idx){const B=await cWriteScene(wid,false);if(B){const c=w.pack.chapters[i];c.beats={zh:B,en:B};c.outline=false;n++}}save();cWork(wid,"chs");return n===idx.length}});return}
 if(!CB.ed)return;
 if(x=e.target.closest("[data-cedel]")){CB.ed.B.splice(+x.dataset.cedel,1);cEditRender();return}
 if(e.target.closest("[data-ceadd]")){CB.ed.B.push(["n","act",""]);cEditRender();setTimeout(()=>{const t=[...document.querySelectorAll("[data-cetx]")].pop();t&&t.focus()},50);return}
 if(e.target.closest("[data-cesave]")){const w=wd(CB.wid),c=w.pack.chapters[CB.ed.i];const B=CB.ed.B.filter(b=>b[0]==="sys"||String(b[2]||"").trim());c.beats={zh:B,en:B};c.outline=false;save();toast(LL("已保存","Saved"));cWork(CB.wid,"chs");return}
 if(x=e.target.closest("[data-cealt]")){const j=+x.dataset.cealt,b=CB.ed.B[j],w=wd(CB.wid);if(!liveOn()){toast(LL("AI 改写需要实时 AI；手动改永远免费","Rewrites need live AI; editing by hand is free"));return}
  cQuote({kind:"line",what:LL("改写这一句","Rewrite this line"),size:LL("1 句","1 line"),run:async()=>{const r=await cAsk("Rewrite this line from an interactive romance drama, same speaker and meaning, sharper and more specific, restrained voice. Story: "+JSON.stringify(w.pack.card)+". Line: \""+b[2]+"\". Language: "+LANG_NAME[S.lang]+'. Reply ONLY JSON {"line":"..."}',20000);if(!r||!r.line)return false;b[2]=String(r.line);cEditRender();return true}});return}});
function cPriceSheet(){const R=(a,b,c)=>'<tr><td>'+a+'</td><td>'+b+'</td><td>'+c+'</td></tr>';
 sheet('<h2>💎 '+LL("创作价格","Creation pricing")+'</h2><p class="xs faint" style="margin-top:4px;line-height:1.5">'+LL("AI 写得越多、素材越重，价格越高。手动编辑、试玩、保存永远免费。先报价，成功才扣费。","The more AI writes, the more it costs. Editing, playing and saving are always free. Quoted first, charged only on success.")+(S.plus?LL(" 会员：文字 5 折，素材 8 折。"," Members: text 50% off, assets 20% off."):"")+'</p>'+
 '<table class="cptab"><tr><th>'+LL("内容","What")+'</th><th>'+LL("产出","Size")+'</th><th>💎</th></tr>'+
 R(LL("故事卡","Story card"),LL("1 张","1"),LL("每天 5 次免费，之后 1","5 free/day, then 1"))+R(LL("第一幕","Scene 1"),LL("约 25 句","~25 lines"),LL("免费","Free"))+R(LL("改写一句","Rewrite a line"),LL("1 句","1 line"),LL("每天 3 次免费，之后 1","3 free/day, then 1"))+
 R(LL("生成一个角色","A character"),LL("人设 + 开场","Profile + opener"),String(CPR.char))+R(LL("大纲","Outline"),LL("每章","per chapter"),"1")+R(LL("一个场景","A scene"),LL("30–40 句","30–40 lines"),String(CPR.scene))+R(LL("一章剧本","A chapter"),LL("40–60 句","40–60 lines"),String(CPR.chapter))+
 R(LL("整季打包","Whole season"),LL("剩余全部章节","all remaining"),LL("8 折","20% off"))+R(LL("翻译英文","Translate"),LL("每章","per chapter"),String(CPR.tr))+R(LL("场景图","Scene image"),LL("每张","each"),String(CPR.bg))+R(LL("角色形象","Portrait"),LL("每张","each"),String(CPR.portrait))+R(LL("封面","Cover"),LL("每张","each"),String(CPR.cover))+
 R(LL("配乐","Music"),LL("每首","per track"),"10")+R(LL("开场视频","Opening video"),LL("每秒","per second"),String(CPR.videoSec))+R(LL("形象库 / 上传 / 系统音色 / 特效","Library / upload / system voice / effects"),"—",LL("免费","Free"))+'</table>'+
 '<p class="xs faint" style="margin-top:8px">'+LL("10 分钟内对同一段内容不满意重写：半价。","Redo the same piece within 10 minutes: half price.")+'</p>')}
/* creator works open the workbench; creator pack threads get a menu entry */
const _renderCreate49=renderCreate;renderCreate=function(v){_renderCreate49(v);try{const sc=v.querySelector(".scroll");if(sc&&!sc.querySelector("[data-cnew]"))sc.insertAdjacentHTML("afterbegin",'<button class="card cnewc" data-cnew="1"><div class="row"><span style="font-size:30px">✨</span><div class="grow"><b style="font-size:17px;display:block">'+LL("一句话写一部剧","Write a story from one line")+'</b><p class="xs faint" style="margin-top:4px;line-height:1.5">'+LL("说一句灵感 → 3 个快选 → 第一幕免费试玩。之后在工作台里慢慢写。","One line → three quick picks → play scene 1 free. Keep writing in the Workbench.")+'</p></div><span style="color:var(--gold);font-size:20px">›</span></div></button>');
 v.querySelectorAll("[data-share]").forEach(b=>{const wk=S.works.find(k=>k.id===b.dataset.share);if(wk&&wk.kind==="story"&&!b.parentElement.querySelector("[data-cwork]"))b.insertAdjacentHTML("beforebegin",'<button class="btn btn-p btn-sm" data-cwork="'+wk.id+'" style="margin-right:6px">🛠 '+LL("工作台","Workbench")+'</button>')})}catch(_){}};
const _menuSheet49=menuSheet;menuSheet=function(){_menuSheet49.apply(this,arguments);try{const th=S.threads[curT],st=$(".sheet .stack"),w=th&&wd(th.wid);if(w&&w.pack&&w.pack.mine&&st)st.insertAdjacentHTML("afterbegin",'<button class="opt" data-cwork="'+w.id+'"><span class="ic">🛠</span><span class="grow"><b>'+LL("回到工作台","Back to the Workbench")+'</b><span>'+LL("改剧本、写下一章","Edit the script, write the next chapter")+'</span></span></button>')}catch(_){}};
(function(){const st=document.createElement("style");st.textContent=`
.cnewc{text-align:left;border-color:rgba(238,111,151,.5)!important;background:linear-gradient(135deg,rgba(238,111,151,.18),rgba(240,183,126,.1))!important}
.cwq{font-size:17px;font-weight:800;margin-bottom:6px}.cwta{width:100%;margin-top:10px;background:var(--panel2);border:1px solid var(--line);border-radius:14px;padding:12px;color:inherit;font-size:15px;line-height:1.6;outline:none}
.cwchips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.cwchips button{padding:7px 11px;border-radius:99px;border:1px solid var(--line);background:var(--panel2);font-size:13px}
.cwcard{padding:14px;border-radius:16px;background:var(--panel);border:1px solid rgba(240,183,126,.35)}.cwtitle{width:100%;margin:6px 0 8px;background:none;border:0;border-bottom:1px solid var(--line);font-size:20px;font-weight:800;color:inherit;padding:4px 0;outline:none}
.cwf{display:flex;gap:8px;align-items:flex-start;margin-top:8px}.cwf>span{flex:none;width:72px;font-size:12px;color:#aaa;padding-top:9px}.cwf input,.cwf textarea{flex:1;background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:8px 10px;color:inherit;font-size:13.5px;outline:none;min-width:0}
.cwrow{margin-top:10px}.cwrow>span{display:block;font-size:12.5px;color:#bbb;margin-bottom:6px}.cwrow>div{display:flex;flex-wrap:wrap;gap:6px}.cwrow button{padding:8px 12px;border-radius:12px;border:1px solid var(--line);background:var(--panel2);font-size:13px;font-weight:700}.cwrow button.on{border-color:var(--gold);background:rgba(240,183,126,.16);color:#fff}
.cqrow{display:flex;justify-content:space-between;gap:10px;margin-top:10px;padding:10px 12px;border-radius:12px;background:var(--panel2);font-size:13.5px}.cqrow span{color:#aaa}
.cbchar{display:flex;align-items:center;gap:10px;padding:10px;border-radius:14px;background:var(--panel2);margin-top:8px}.cbchar b{display:block}.cbchar span{display:block;font-size:12px;color:#aaa}
.cbch{padding:10px;border-radius:14px;background:var(--panel2);border:1px solid var(--line);margin-top:8px}.cbch .row{gap:8px;align-items:center}.cbch i{font-style:normal;font-weight:900;color:var(--gold);width:22px}.cbch input{flex:1;background:none;border:0;color:inherit;font-weight:700;font-size:14.5px;outline:none;min-width:0}
.cbbtns{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}.cbbtns button{padding:6px 10px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid var(--line);font-size:12px;font-weight:700}
.cerow{padding:8px;border-radius:12px;background:var(--panel2);margin-top:6px}.cerow .row{gap:6px}.cerow select{background:var(--panel);color:inherit;border:1px solid var(--line);border-radius:8px;padding:4px;font-size:12px}.cerow button{margin-left:auto;font-size:12px;padding:3px 8px;border-radius:8px;border:1px solid var(--line)}.cerow button+button{margin-left:4px}
.cerow textarea{width:100%;margin-top:6px;background:var(--panel);border:1px solid var(--line);border-radius:8px;padding:7px;color:inherit;font-size:13.5px;line-height:1.5;outline:none}.cerow.sys{display:flex;align-items:center;font-size:12px;color:#aaa}
.cptab{width:100%;margin-top:10px;border-collapse:collapse;font-size:12.5px}.cptab th,.cptab td{text-align:left;padding:6px 4px;border-bottom:1px solid var(--line)}.cptab td:last-child,.cptab th:last-child{text-align:right;white-space:nowrap;color:var(--gold);font-weight:700}`;document.head.appendChild(st)})();
