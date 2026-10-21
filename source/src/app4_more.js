/* ================= CHATS (WhatsApp-style list) ================= */
let chatSeg="msgs";
function renderChats(v){
 /* Chats = messages + the characters' own lives (Instagram DMs + stories). */
 const list=Object.values(S.threads).sort((a,b)=>b.at-a.at);
 const posts=feedPosts(),who=[...new Set(posts.map(p=>p.who))];
 let h='<div class="topbar"><h1 style="font-size:24px" class="grow">'+t("tab.chats")+'</h1></div><div class="scroll">'+
  '<div class="stories">'+who.map(id=>{const c=ch(id),seen=S.feedSeen[id];return '<button class="story'+(seen?"":" new")+'" data-sv="'+id+'"><span class="ring">'+avatar(id,60)+'</span><b>'+esc(first(c.n))+'</b></button>'}).join("")+'</div>'+
  '<div class="tabs"><button data-cseg="msgs" class="'+(chatSeg==="msgs"?"on":"")+'">'+t("ch.msgs")+'</button><button data-cseg="moments" class="'+(chatSeg==="moments"?"on":"")+'">'+t("ch.moments")+'</button></div>';
 if(chatSeg==="moments"){h+='<p class="xs faint pad" style="padding-top:12px">'+t("ch.momentsS")+'</p>'+posts.map(postHTML).join("")}
 else{
 if(!list.length)h+='<p class="empty">'+t("me.empty")+'<br><button class="btn btn-p btn-sm" style="margin-top:12px" data-tab="discover">'+t("tab.discover")+'</button></p>';
 list.forEach(th=>{const last=[...th.msgs].reverse().find(m=>m.txt)||{txt:""},mid=mainOf(th);
  const avs=th.cast.length>1?'<div class="avs two">'+avatar(th.cast[0],38)+avatar(th.cast[1],38)+'</div>':'<div class="avs">'+avatar(th.cast[0],52)+'</div>';
  h+='<button class="trow" data-open="'+th.id+'">'+avs+'<div class="grow"><div class="row"><b class="grow">'+esc(th.title)+'</b><time>'+ago(th.at)+'</time></div>'+
   '<div class="row" style="margin-top:2px"><p class="grow">'+(last.who==="me"?"✓ ":"")+esc(last.txt)+'</p>'+(th.unread?'<span class="dot"></span>':"")+'</div>'+
   '<div class="row" style="margin-top:5px;gap:6px"><span class="stagechip">'+(th.kind==="quest"?"🎯 "+t("st.quest"):first(ch(mid).n)+" · "+t("stage."+stageOf(th,mid)))+'</span>'+(S.couples[mid]&&th.kind!=="quest"?'<span class="stagechip" style="color:var(--rose)">💍</span>':"")+'<span class="xs faint">'+t("cx.turns",{n:th.rounds})+'</span></div></div></button>'});}
 v.innerHTML=h+'</div>';}
document.addEventListener("click",e=>{const x=e.target.closest("[data-cseg]");if(x){chatSeg=x.dataset.cseg;renderTab("chats")}if(e.target.closest("[data-moments]")){chatSeg="moments";renderTab("chats")}});
document.addEventListener("click",e=>{const x=e.target.closest("[data-open]");if(x){closeSheet();openThread(x.dataset.open)}});

/* ================= CREATE ================= */
/* Weekly creation topic — rotates with the same Mon-start week key the rank board uses,
   so it changes on the same cadence as everything else that's "this week". Purely a prompt/hashtag:
   doesn't gate anything, just gives creators (esp. remixers) a reason to show up together. */
const CRE_TOPICS=[["办公室恋情","Office Romance"],["雨夜救援","Rescue in the Rain"],["失忆重逢","Amnesia Reunion"],["身份互换","Identity Swap"],["假戏真做","Fake Dating"],["雪夜困兽","Snowed In"],["宿敌变爱人","Enemies to Lovers"],["深夜电台","Late Night Radio"],["同居计划","Living Together"],["旧爱重逢","Old Flame Returns"],["跨年倒计时","New Year Countdown"],["雨中告白","Confession in the Rain"]];
function weekTopic(){return CRE_TOPICS[hash(wkKey())%CRE_TOPICS.length]}
/* Creator level — a soft badge based on total published works, purely for the "you've made something" feeling. */
function creatorLevel(n){return n>=10?["👑",t("cre.lv3")]:n>=3?["🔥",t("cre.lv2")]:n>=1?["🌱",t("cre.lv1")]:null}
function renderCreate(v){
 const wt=weekTopic(),wtName=S.lang==="zh"?wt[0]:wt[1],n=S.works.length,lv=creatorLevel(n),rxN=S.works.filter(wk=>wk.kind==="remix").length;
 let h='<div class="topbar"><h1 style="font-size:24px" class="grow">'+t("cre.h")+'</h1></div><div class="scroll pad stack" style="gap:12px;padding-block:4px 24px">'+
  '<button class="card" style="text-align:left;border-color:rgba(240,183,126,.45);background:linear-gradient(135deg,rgba(240,183,126,.16),rgba(238,111,151,.08))" data-cretopic="1"><div class="row"><div class="grow"><div class="eyebrow" style="color:var(--gold)">🏆 '+t("cre.topicH")+'</div><b style="font-size:16px;display:block;margin-top:4px">#'+esc(wtName)+'</b><p class="xs faint" style="margin-top:4px;line-height:1.5">'+t("cre.topicS")+'</p></div><span style="color:var(--gold);font-size:20px">›</span></div></button>'+
  [["group","🌍","wd.new","wd.newS"],["remix","⑂","cre.remix","cre.remixS"],["char","🧬","cre.char","cre.charS"]].map(([k,i,a,b])=>
   '<button class="bigopt" data-cre="'+k+'"><span class="ic" style="font-size:22px;width:44px;height:44px;border-radius:14px;background:var(--panel2);display:grid;place-items:center">'+i+'</span><span class="grow"><b>'+t(a)+'</b><span>'+t(b)+'</span></span><span style="color:var(--gold)">›</span></button>').join("")+
  '<div class="sec" style="padding:14px 0 0"><div><div class="eyebrow">'+t("cre.works")+'</div>'+(lv?'<div class="row" style="gap:8px;margin-top:6px"><span class="chip on" style="pointer-events:none">'+lv[0]+' '+lv[1]+'</span><span class="xs faint">'+t("cre.stat",{o:n-rxN,r:rxN})+'</span></div>':"")+'</div><span class="xs faint">'+t("g.demo")+'</span></div>';
 if(!S.works.length)h+='<p class="empty" style="padding:18px">'+t("me.empty")+'</p>';
 S.works.forEach(wk=>{const plays=Math.floor((Date.now()-wk.at)/6e4*1.7)+wk.seed,earn=plays*.004*(wk.kind==="remix"?.4:.6);
  h+='<div class="card"><div class="row"><div class="grow"><b>'+esc(wk.title)+'</b><p class="xs faint" style="margin-top:3px">'+(wk.kind==="remix"?"⑂ "+t("cre.remix"):wk.kind==="char"?"🧬 "+t("cre.char"):"🎭 "+t("cre.group"))+' · '+t("cre.plays",{n:fmtN(plays)})+' · '+t("cre.earned",{m:"$"+earn.toFixed(2)})+'</p></div>'+
   '<button class="btn btn-g btn-sm" data-share="'+wk.id+'">'+t("sh.link")+'</button></div></div>'});
 v.innerHTML=h+'</div>';}
document.addEventListener("click",e=>{if(!e.target.closest("[data-cretopic]"))return;const wt=weekTopic(),wtName=S.lang==="zh"?wt[0]:wt[1];
 if(!W.length)return;createRemix(W[Math.floor(Math.random()*W.length)].id);if(rx){rx.twist=wtName;renderRemix()}});
function splitHTML(kind){const s=kind==="remix"?[["sh.origin",20,"#EE6F97"],["sh.you",40,"#F0B77E"],["sh.platform",40,"#7FC4A6"]]:[["sh.you",60,"#F0B77E"],["sh.platform",40,"#7FC4A6"]];
 return '<div class="split">'+s.map(([k,p,c])=>'<i style="width:'+p+'%;background:'+c+'"></i>').join("")+'</div><div class="splitkey">'+s.map(([k,p,c])=>'<span><b style="background:'+c+'"></b>'+t(k)+' '+p+'%</span>').join("")+'</div>'}
function shareSheet(wk){const url="https://miru.app/"+(wk.kind==="remix"?"r":wk.kind==="char"?"c":"g")+"/"+wk.id+"?ref="+encodeURIComponent((me()||"you").toLowerCase());
 sheet('<div class="eyebrow" style="color:var(--gold)">'+t("sh.h")+'</div><h2 style="margin-top:6px">'+esc(wk.title)+'</h2><p class="sm dim" style="margin-top:6px;line-height:1.55">'+t("sh.sub")+'</p>'+
  '<div class="field" style="margin-top:12px"><label>'+t("sh.link")+'</label></div><div class="link"><code>'+esc(url)+'</code><button class="btn btn-p btn-sm" data-copy="'+esc(url)+'">'+t("sh.copy")+'</button></div>'+
  '<p class="xs faint" style="margin-top:6px">'+t("sh.demo")+'</p><div class="card" style="margin-top:12px"><div class="eyebrow">'+t("sh.split")+'</div>'+splitHTML(wk.kind)+'</div>')}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-copy]")){const u=x.dataset.copy;try{navigator.clipboard.writeText(u).then(()=>toast(t("sh.copied"))).catch(()=>selectCode())}catch(_){selectCode()}return}
 if(x=e.target.closest("[data-share]")){const wk=S.works.find(y=>y.id===x.dataset.share);wk&&shareSheet(wk);return}
 if(x=e.target.closest("[data-cre]")){({char:createChar,group:createGroup,remix:()=>createRemix(W[0].id)})[x.dataset.cre]();return}});
function selectCode(){const c=$(".link code");if(!c)return;const r=document.createRange();r.selectNodeContents(c);const s=getSelection();s.removeAllRanges();s.addRange(r)}
function formScreen(id,title,body,btn){screen(id,'<div class="topbar"><button class="ibtn" data-back="1">'+ic("back")+'</button><h2 class="grow" style="font-size:19px">'+title+'</h2></div><div class="scroll pad stack" style="gap:12px;padding-block:4px 20px">'+body+'</div><div class="startbar">'+btn+'</div>');show(id)}
function fld(id,label,ph,area){return '<div class="field"><label for="'+id+'">'+label+'</label>'+(area?'<textarea id="'+id+'" rows="3" placeholder="'+esc(ph||"")+'"></textarea>':'<input id="'+id+'" placeholder="'+esc(ph||"")+'">')+'</div>'}
/* ---------- 攻/受 personality-trope tags — shown as two separate rows, never mixed together ---------- */
const GS_TAGS={gong:["温柔攻","强势攻","腹黑攻","病娇攻","偏执攻","年上攻","年下攻","大叔攻","中犬攻","冰山攻","冷血攻","直球攻","禁欲攻","傲娇攻","阳光攻","天然攻"],
 shou:["美人受","病弱受","冷血受","渴爱受","强势受","傲娇受","女王受","腹黑受","年上受","年下受","纯情受","冰山受","阳光受","健气受","爱哭包受","天然受"]};
const GS_EN={"温柔攻":"Gentle Top","强势攻":"Dominant Top","腹黑攻":"Scheming Top","病娇攻":"Yandere Top","偏执攻":"Obsessive Top","年上攻":"Older Top","年下攻":"Younger Top","大叔攻":"Silver Fox Top","中犬攻":"Loyal Top","冰山攻":"Icy Top","冷血攻":"Cold-Blooded Top","直球攻":"Straightforward Top","禁欲攻":"Restrained Top","傲娇攻":"Tsundere Top","阳光攻":"Sunny Top","天然攻":"Airhead Top",
 "美人受":"Beautiful Bottom","病弱受":"Frail Bottom","冷血受":"Cold-Blooded Bottom","渴爱受":"Love-Starved Bottom","强势受":"Dominant Bottom","傲娇受":"Tsundere Bottom","女王受":"Queen Bottom","腹黑受":"Scheming Bottom","年上受":"Older Bottom","年下受":"Younger Bottom","纯情受":"Pure Bottom","冰山受":"Icy Bottom","阳光受":"Sunny Bottom","健气受":"Spirited Bottom","爱哭包受":"Crybaby Bottom","天然受":"Airhead Bottom"};
function gsName(x){return S.lang==="en"?(GS_EN[x]||x):x}
function gsRow(list,attr){return list.map(x=>'<button class="chip" data-'+attr+'="'+esc(x)+'">'+esc(gsName(x))+'</button>').join("")}
/* Discover-page filtering by 攻/受 tag: matches a user-created character's own picked traits directly,
   and for official content (which predates this taxonomy) translates its existing archetype tags —
   Possessive, Golden Retriever, etc — into the closest 攻/受 equivalent, so the filter isn't empty for everyone. */
const ARCH2GS={"Possessive":"强势攻","Golden Retriever":"温柔攻","Cold Prince":"冰山受","Morally Grey":"腹黑攻","Soft Giant":"温柔攻","Himbo":"天然受","Genius":"腹黑攻","Protective":"强势攻","Chaotic":"傲娇受"};
function gsMatch(tags,cast,tag){
 if((tags||[]).includes(tag))return true;
 if((tags||[]).some(x=>ARCH2GS[x]===tag))return true;
 return (cast||[]).some(id=>{const c=ch(id),tr=c&&c.traits;return tr&&((tr.gong||[]).includes(tag)||(tr.shou||[]).includes(tag))})}
function createChar(){formScreen("s-cchar",t("cre.char"),
 fld("fName",t("f.name"),"Rhys Calloway")+fld("fAge",t("f.age"),"27")+fld("fRole",t("f.role"),"Touring rock star, your ex")+fld("fLooks",t("f.looks"),"",1)+fld("fVibe",t("f.vibe"),"",1)+fld("fTells",t("f.tells"),"",1)+fld("fSecret",t("f.secret"),"",1)+fld("fOpen",t("f.opening"),"*I don't look up from the guitar.* You came back.",1)+
 '<div class="field"><label>'+t("f.pair")+'</label><div class="seg" id="fPair">'+["bl","gl","bg"].map((k,i)=>'<button data-fp="'+k+'" class="'+(i?"":"on")+'">'+k.toUpperCase()+'</button>').join("")+'</div></div>'+
 '<div class="field"><label>'+t("f.trait")+'</label></div>'+
 '<p class="xs faint" style="margin-top:2px">'+t("f.traitGong")+'</p><div class="row wrap" style="gap:6px;margin-top:6px" id="fGong">'+gsRow(GS_TAGS.gong,"fg")+'</div>'+
 '<p class="xs faint" style="margin-top:12px">'+t("f.traitShou")+'</p><div class="row wrap" style="gap:6px;margin-top:6px" id="fShou">'+gsRow(GS_TAGS.shou,"fs")+'</div>',
 '<button class="btn btn-p btn-block" data-pubchar="1">'+t("f.publish")+'</button>')}
const WD_PLACES=[["🍸","The Anchor bar, after close","打烊后的 Anchor 酒吧"],["🏔","A snowed-in ski lodge","被大雪封住的滑雪小屋"],["🎭","A masquerade auction","假面拍卖会"],["🚆","The last night train","末班夜车"],["🏝","A private island wedding","私人海岛婚礼"],["🌙","The fae night market","妖精夜市"],["🏨","A haunted grand hotel","闹鬼的老酒店"],["🛗","A stuck elevator at a gala","晚宴上卡住的电梯"]];
let wdPlace=0;
function createGroup(){gpick=[];wdPlace=0;formScreen("s-cgroup",t("wd.new"),
 '<p class="sm dim" style="line-height:1.55">'+t("wd.intro")+'</p>'+
 fld("wdName",t("wd.name"),t("wd.namePh"))+
 '<div class="field"><label>'+t("wd.place")+'</label></div><div class="hs wrap" id="wdPl" style="flex-wrap:wrap">'+WD_PLACES.map((p,i)=>'<button class="chip'+(i===0?" on":"")+'" data-wdp="'+i+'">'+p[0]+' '+esc(S.lang==="zh"?p[2]:p[1])+'</button>').join("")+'</div>'+
 fld("gSet",t("wd.custom"),t("g.settingPh"),1)+
 '<div class="field"><label>'+t("g.pick")+'</label></div>'+pickSearch("gPickQ","gPick")+'<div class="pick" id="gPick">'+allChars().map(id=>{const c=ch(id),w=wd(c.w);return '<button data-gp="'+id+'">'+avatar(id,56)+'<span>'+esc(first(c.n))+'</span><small class="xs faint" style="display:block;font-size:9px;max-width:64px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(w?Lz(w.title):"")+'</small></button>'}).join("")+'</div>'+
 fld("wdRule",t("wd.rule"),t("wd.rulePh"),1)+fld("gYou",t("g.you"),t("g.youPh")),
 '<button class="btn btn-p btn-block" data-gogroup="1">'+t("wd.go")+'</button>')}
document.addEventListener("click",e=>{const x=e.target.closest("[data-wdp]");if(!x)return;wdPlace=+x.dataset.wdp;$$("[data-wdp]").forEach(b=>b.classList.toggle("on",b===x))});
/* ---------- REMIX: pick a story → pick a remix type → tweak cast / setting / twist / heat → live preview → publish & share ---------- */
const RX_TYPES=[["whatif","🔀"],["au","🌍"],["swap","🔁"],["sequel","⏭"],["crossover","🧬"]];
const RX_AU=["Coffee shop","College","Royal court","Space station","Zombie outbreak","Summer camp","1920s speakeasy","Office"];
const RX_AU_ZH={"Coffee shop":"咖啡店","College":"大学","Royal court":"宫廷","Space station":"空间站","Zombie outbreak":"丧尸末日","Summer camp":"夏令营","1920s speakeasy":"1920 年代地下酒吧","Office":"办公室"};
let rx=null;
function createRemix(wid,fromTh){const w=wd(wid||curStory)||W[0];
 rx={wid:w.id,type:fromTh?"sequel":"whatif",au:RX_AU[0],cast:w.cast.slice(),twist:"",title:"",opening:"",heat:w.heat||S.heat,from:fromTh||null,format:"text",idea:null};renderRemix()}
function rxWorldCard(w){return '<button class="rxw'+(rx.wid===w.id?" on":"")+'" data-rxw="'+w.id+'">'+img(w.cover?w.id:w.cast[0],"art")+'<div class="veil"></div><b>'+esc(Lz(w.title))+'</b></button>'}
function rxAuto(){const w=wd(rx.wid),names=rx.cast.map(id=>first(ch(id).n));
 const T0={whatif:"What if…",au:(S.lang==="zh"?(RX_AU_ZH[rx.au]||rx.au)+" AU":rx.au+" AU"),swap:S.lang==="zh"?"角色互换":"Role Swap",sequel:S.lang==="zh"?"结局之后":"After the Ending",crossover:S.lang==="zh"?"联动":"Crossover"}[rx.type];
 return {title:rx.title||Lz(w.title)+" · "+T0,hook:rx.twist||t("rx.hook."+rx.type,{a:names[0]||"",b:names[1]||names[0]||"",p:S.lang==="zh"?(RX_AU_ZH[rx.au]||rx.au):rx.au})}}
function renderRemix(){const w=wd(rx.wid),a=rxAuto(),others=allChars().filter(id=>!rx.cast.includes(id));
 const body=
  (rx.from?'<div class="card" style="border-color:rgba(240,183,126,.45)"><div class="eyebrow" style="color:var(--gold)">⑂ '+t("rx.fromHere")+'</div><p class="sm dim" style="margin-top:6px;line-height:1.5">'+esc(rx.from.slice(-2).map(m=>m.txt).join(" … "))+'</p></div>':
  '<div class="field"><label>1 · '+t("rx.pick")+'</label></div><div class="rail" style="padding:0">'+W.filter(orOK).map(rxWorldCard).join("")+'</div>')+
  '<div class="field row"><label class="grow">2 · '+t("rx.type")+'</label><button class="btn btn-g btn-xs" data-rxai="1" '+(rx.aiBusy?"disabled":"")+'>✨ '+(rx.aiBusy?"…":t("rx.aiPick"))+'</button></div>'+
  (rx.idea?'<div class="card" style="border-color:rgba(238,111,151,.5);background:linear-gradient(135deg,rgba(238,111,151,.12),rgba(240,183,126,.08))"><div class="row"><div class="eyebrow" style="color:var(--rose)">✨ '+t("rx.ideaH")+'</div><span class="grow"></span><button class="ibtn" style="width:26px;height:26px" data-rxideaclear="1">✕</button></div>'+
   '<p class="sm" style="margin-top:6px"><b>'+t("rx.t."+rx.idea.type)+'</b>'+(rx.idea.type==="au"&&rx.idea.au?" · "+esc(S.lang==="zh"?(RX_AU_ZH[rx.idea.au]||rx.idea.au):rx.idea.au):"")+'</p>'+
   '<p class="sm dim" style="margin-top:4px;line-height:1.5">'+esc(rx.idea.twist)+'</p>'+
   '<div class="row" style="gap:8px;margin-top:10px"><button class="btn btn-p btn-sm grow" data-rxideause="1">'+t("rx.ideaUse")+'</button><button class="btn btn-g btn-sm" data-rxai="1" '+(rx.aiBusy?"disabled":"")+'>'+t("rx.ideaAgain")+'</button></div></div>':"")+
  '<div class="stack" style="gap:8px">'+RX_TYPES.map(([k,i])=>'<button class="bigopt'+(rx.type===k?" on":"")+'" data-rxt="'+k+'"><span style="font-size:20px">'+i+'</span><span class="grow"><b>'+t("rx.t."+k)+'</b><span>'+t("rx.t."+k+"S")+'</span></span></button>').join("")+'</div>'+
  (rx.type==="au"?'<div class="field"><label>'+t("rx.setting")+'</label></div><div class="row wrap" style="gap:6px">'+RX_AU.map(k=>'<button class="chip'+(rx.au===k?" on":"")+'" data-rxau="'+esc(k)+'">'+esc(S.lang==="zh"?RX_AU_ZH[k]:k)+'</button>').join("")+'</div>':"")+
  '<div class="field"><label>3 · '+t("rx.cast")+'</label></div><div class="pick">'+rx.cast.map(id=>'<button class="on" data-rxc="'+id+'">'+avatar(id,56)+'<span>'+esc(first(ch(id).n))+' ✕</span></button>').join("")+
   '<button data-rxadd="1"><div class="av" style="width:56px;height:56px;display:grid;place-items:center;border:1.5px dashed var(--line);font-size:22px">＋</div><span>'+t("rx.addCast")+'</span></button></div>'+
  '<div class="field"><label for="rxTw">4 · '+t("rx.what")+'</label><textarea id="rxTw" rows="3" placeholder="'+esc(t("rx.ph."+rx.type))+'">'+esc(rx.twist)+'</textarea></div>'+
  '<div class="field"><label>'+t("me.heat")+'</label><div class="seg">'+["fluff","slow","steamy","mature"].map(k=>'<button data-rxh="'+k+'" class="'+(rx.heat===k?"on":"")+'">'+t("heat."+k)+'</button>').join("")+'</div></div>'+
  '<div class="field"><label for="rxOp">5 · '+t("rx.opening")+'</label><textarea id="rxOp" rows="2" placeholder="'+esc(t("rx.opPh"))+'">'+esc(rx.opening)+'</textarea></div>'+
  '<div class="field"><label for="rxTi">'+t("rx.title")+'</label><input id="rxTi" value="'+esc(rx.title)+'" placeholder="'+esc(a.title)+'"></div>'+
  '<div class="eyebrow" style="margin-top:6px">'+t("rx.preview")+'</div><div class="rxprev"><div class="rxcov">'+(rx.format==="image"&&rx.coverImg?'<img src="'+esc(rx.coverImg)+'" style="width:100%;height:100%;object-fit:cover" alt="">':rx.cast.slice(0,3).map((id,i)=>'<img src="'+artSrc(id)+'" style="left:'+(i*100/Math.min(3,rx.cast.length||1))+'%;width:'+(100/Math.min(3,rx.cast.length||1))+'%" alt="">').join(""))+'<div class="veil"></div>'+
   '<span class="badge">⑂ '+t("rx.t."+rx.type)+'</span><div class="cap"><h3 id="rxPT">'+esc(a.title)+'</h3><p class="hk" id="rxPH">'+esc(a.hook)+'</p><div class="xs faint" style="margin-top:6px">@'+esc((me()||"you").toLowerCase())+' · '+t("rx.of",{w:Lz(w.title)})+'</div></div></div>'+
   '<div class="field" style="margin-top:12px"><label>'+t("rx.fmt")+'</label></div><div class="seg" id="rxFmt">'+
    '<button data-rxfmt="text" class="'+(rx.format==="text"?"on":"")+'">'+t("rx.fmtText")+'</button>'+
    '<button data-rxfmt="image" class="'+(rx.format==="image"?"on":"")+'">'+t("rx.fmtImg")+(S.plus?"":" · 💎"+PRICES.img)+'</button>'+
    '<button data-rxfmt="video" class="'+(rx.format==="video"?"on":"")+'">'+t("rx.fmtVid")+' · 💎'+PRICES.video+'</button></div>'+
   (rx.format==="image"?'<button class="btn btn-g btn-sm" style="margin-top:10px" data-rxcover="1" '+(rx.coverBusy?"disabled":"")+'>✨ '+(rx.coverBusy?t("rx.coverGoing"):(rx.coverImg?t("rx.coverAgain"):t("rx.coverGo")+(S.plus?"":" · 💎"+PRICES.img)))+'</button>':"")+
   (rx.format==="video"?'<p class="xs faint" style="margin-top:10px;line-height:1.5">'+t("rx.fmtVidSoon")+'</p>':"")+'</div>'+
  '<div class="card"><div class="eyebrow">'+t("sh.split")+'</div>'+splitHTML("remix")+'<p class="xs faint" style="margin-top:8px">'+t("rx.splitS")+'</p></div>';
 formScreen("s-cremix",t("cre.remix"),body,'<button class="btn btn-p btn-block" data-gorx="1">'+t("rx.go")+'</button>')}
function rxSync(){const a=rxAuto(),pt=$("#rxPT"),ph=$("#rxPH");if(pt)pt.textContent=a.title;if(ph)ph.textContent=a.hook}
/* ---------- AI suggests an idea (type + twist) as a card the person can accept or ignore — it never
   overwrites their own pick by itself. Falls back to a random pick (still shown as a card) if live AI isn't on. ---------- */
async function rxSuggest(){if(!rx||rx.aiBusy)return;rx.aiBusy=true;const sc=$("#s-cremix .scroll"),top=sc?sc.scrollTop:0;renderRemix();const s2=$("#s-cremix .scroll");if(s2)s2.scrollTop=top;
 try{const w=wd(rx.wid),names=rx.cast.map(id=>first(ch(id).n));
  if(liveOn()){
   const r=await ask("Pick the single best remix type for a romance-drama fan remix, given this original premise: "+Lz(w.premise)+". Cast: "+names.join(", ")+". Choose exactly one of: whatif, au, swap, sequel, crossover. Then write ONE short twist sentence (max 20 words) for that remix, in "+(S.lang==="zh"?"Simplified Chinese":"English")+". If type is \"au\", also pick one setting from: Coffee shop, College, Royal court, Space station, Zombie outbreak, Summer camp, 1920s speakeasy, Office. Reply ONLY JSON {\"type\":\"...\",\"twist\":\"...\",\"au\":\"...\"}",{modelTier:"quick"});
   if(r&&RX_TYPES.some(([k])=>k===r.type))rx.idea={type:r.type,twist:r.twist?String(r.twist).trim().slice(0,140):"",au:(r.type==="au"&&RX_AU.includes(r.au))?r.au:RX_AU[0]};
   else throw{code:"other"}}
  else{const pool=RX_TYPES.map(([k])=>k);const ty=pool[Math.floor(Math.random()*pool.length)],au=RX_AU[Math.floor(Math.random()*RX_AU.length)],names2=rx.cast.map(id=>first(ch(id).n));
   rx.idea={type:ty,twist:t("rx.hook."+ty,{a:names2[0]||"",b:names2[1]||names2[0]||"",p:S.lang==="zh"?(RX_AU_ZH[au]||au):au}),au};
   toast(t("rx.aiOffline"))}}
 catch(_){toast(t("rx.aiFail"))}
 finally{rx.aiBusy=false;const sc2=$("#s-cremix .scroll"),top2=sc2?sc2.scrollTop:0;renderRemix();const s3=$("#s-cremix .scroll");if(s3)s3.scrollTop=top2}}
/* ---------- AI-generated cover image for the remix, reusing the same FLUX bridge as chat image gen ---------- */
async function rxGenCover(){if(!rx||rx.coverBusy||!AIG.mcp)return;
 const d=today();S.imgDay=S.imgDay&&S.imgDay.d===d?S.imgDay:{d,n:0};
 if(S.imgDay.n>=(S.plus?10:1)){if(!spend(PRICES.img,"img"))return}else{S.imgDay.n++;save()}
 rx.coverBusy=true;const sc=$("#s-cremix .scroll"),top=sc?sc.scrollTop:0;renderRemix();const s2=$("#s-cremix .scroll");if(s2)s2.scrollTop=top;
 try{const a=rxAuto(),ppl=rx.cast.slice(0,4).map(id=>{const c=ch(id);return (fem(c)?"a woman":"a man")+" ("+String((c.looks&&c.looks.en)||"").replace(/scar[^,.]*[,.]?/gi,"").slice(0,70)+")"}).join(", ");
  const prompt=("Cinematic vertical movie poster still, romance drama remix. "+rx.cast.length+" people: "+ppl+". Mood: "+a.hook+". Moody practical lighting, rich color, 35mm, shallow depth of field. No text, no letters, no logo.").slice(0,600);
  const res=await AIG.mcp.callTool(AIG.srv,AIG.tool,{prompt,width:576,height:1024,num_inference_steps:24,randomize_seed:true},{cache:false});
  const src=aiImgFrom(res);if(!src)throw{code:"tool_error",message:"no image"};
  const im=await loadImg(src),cv=document.createElement("canvas");cv.width=480;cv.height=Math.round(480*im.height/im.width);cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);
  rx.coverImg=cv.toDataURL("image/jpeg",.82)}
 catch(e){toast(aiErrMsg(e))}
 finally{rx.coverBusy=false;const sc2=$("#s-cremix .scroll"),top2=sc2?sc2.scrollTop:0;renderRemix();const s3=$("#s-cremix .scroll");if(s3)s3.scrollTop=top2}}
document.addEventListener("input",e=>{if(!rx)return;const id=e.target.id;if(id==="rxTw")rx.twist=e.target.value;else if(id==="rxOp")rx.opening=e.target.value;else if(id==="rxTi")rx.title=e.target.value;else return;rxSync()});
document.addEventListener("click",e=>{if(!rx||$("#s-cremix")&&$("#s-cremix").hidden)return;let x;
 const keep=()=>{const sc=$("#s-cremix .scroll"),top=sc?sc.scrollTop:0;renderRemix();const s2=$("#s-cremix .scroll");if(s2)s2.scrollTop=top};
 if(x=e.target.closest("[data-rxw]")){rx.wid=x.dataset.rxw;rx.cast=wd(rx.wid).cast.slice();keep();return}
 if(x=e.target.closest("[data-rxt]")){rx.type=x.dataset.rxt;if(rx.type==="crossover"&&rx.cast.length===wd(rx.wid).cast.length){keep();rxPickSheet();return}keep();return}
 if(x=e.target.closest("[data-rxau]")){rx.au=x.dataset.rxau;keep();return}
 if(x=e.target.closest("[data-rxh]")){rx.heat=x.dataset.rxh;keep();return}
 if(x=e.target.closest("[data-rxc]")){if(rx.cast.length>1)rx.cast=rx.cast.filter(y=>y!==x.dataset.rxc);keep();return}
 if(e.target.closest("[data-rxai]")){rxSuggest();return}
 if(e.target.closest("[data-rxideaclear]")){rx.idea=null;keep();return}
 if(e.target.closest("[data-rxideause]")){if(rx.idea){rx.type=rx.idea.type;if(rx.idea.twist)rx.twist=rx.idea.twist;if(rx.idea.type==="au")rx.au=rx.idea.au;rx.idea=null;if(rx.type==="crossover"&&rx.cast.length===wd(rx.wid).cast.length){keep();rxPickSheet();return}}keep();return}
 if(e.target.closest("[data-rxcover]")){rxGenCover();return}
 if(x=e.target.closest("[data-rxfmt]")){rx.format=x.dataset.rxfmt;if(rx.format==="video")toast(t("rx.fmtVidSoon"));keep();return}
 if(e.target.closest("[data-rxadd]")){rxPickSheet();return}
 if(x=e.target.closest("[data-rxpick]")){if(rx.cast.length<6)rx.cast.push(x.dataset.rxpick);closeSheet();keep();return}});
function rxPickSheet(){const ids=allChars().filter(id=>!rx.cast.includes(id));sheet('<h2>'+t("rx.addCast")+'</h2><p class="sm dim" style="margin-top:4px">'+t("inv.sub")+'</p>'+pickSearch("rxPickQ","rxPickGrid")+'<div class="pick" id="rxPickGrid" style="margin-top:14px">'+ids.map(id=>'<button data-rxpick="'+id+'">'+avatar(id,56)+'<span>'+esc(first(ch(id).n))+'</span></button>').join("")+'</div>')}
let gpick=[];
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-fp]")){$$("#fPair button").forEach(y=>y.classList.toggle("on",y===x));return}
 if(x=e.target.closest("[data-fg]")){x.classList.toggle("on");return}
 if(x=e.target.closest("[data-fs]")){x.classList.toggle("on");return}
 if(x=e.target.closest("[data-gp]")){const id=x.dataset.gp;gpick=gpick.includes(id)?gpick.filter(y=>y!==id):gpick.length<6?gpick.concat(id):gpick;x.classList.toggle("on",gpick.includes(id));return}
 if(x=e.target.closest("[data-remix]")){createRemix(x.dataset.remix);return}
 if(e.target.closest("[data-pubchar]")){const v=id=>($("#"+id).value||"").trim();const name=v("fName"),op=v("fOpen"),age=parseInt(v("fAge"))||0;
  if(!name||!op){toast(t("f.need"));return}if(age&&age<21){toast(t("f.age21"));return}
  const id="u"+Date.now(),or=($("#fPair .on")||{dataset:{fp:"bl"}}).dataset.fp,x0=s=>({en:s,zh:s});
  const wid="uw"+Date.now();
  const traits={gong:$$("#fGong .on").map(y=>y.dataset.fg),shou:$$("#fShou .on").map(y=>y.dataset.fs)};
  S.mine.chars[id]={n:name,age:age||25,h:"",w:wid,g:or==="gl"?"f":"m",pal:[["#C98A6B","#1B1520"],["#7A63C9","#141024"],["#5E9E96","#13212A"]][hash(id)%3],a:"charm",v:{pitch:1,rate:1},by:"@"+(me()||"you").toLowerCase(),traits,
   role:x0(v("fRole")),looks:x0(v("fLooks")),vibe:x0(v("fVibe")),tells:{en:[v("fTells")].filter(Boolean),zh:[v("fTells")].filter(Boolean)},twist:x0(""),likes:x0(""),secret:x0(v("fSecret")),pitch:x0("“"+op.replace(/\*[^*]*\*/g,"").trim()+"”"),solo:x0(op)};
  S.mine.worlds[wid]={id:wid,or,cover:null,pal:S.mine.chars[id].pal,author:"@"+(me()||"you").toLowerCase(),official:false,stats:[0,0,0],heat:S.heat,cast:[id],tags:[],title:x0(name),hook:x0(v("fRole")),premise:x0(v("fRole")),you:x0(""),warn:x0(""),rel:[],status:{time:x0(""),place:x0("")},openings:[]};
  const wk={id,kind:"char",title:name,at:Date.now(),seed:0};S.works.unshift(wk);save();
  if(typeof taskClaimOnce==="function"&&taskClaimOnce("pubChar",3))toast(t("task.gotChar"));
  shareSheet(wk);setTimeout(()=>{closeSheet();openChar(id)},2400);return}
 if(e.target.closest("[data-gogroup]")){const cus=($("#gSet").value||"").trim(),pl=WD_PLACES[wdPlace]||WD_PLACES[0],place=cus||(S.lang==="zh"?pl[2]:pl[1]);
  const you=($("#gYou").value||"").trim(),rule=($("#wdRule").value||"").trim(),name=($("#wdName").value||"").trim();if(gpick.length<2){toast(t("g.need"));return}
  const names=gpick.map(id=>first(ch(id).n)),nid="wd"+Date.now(),x0=v=>({en:v,zh:v});
  const title=name||(S.lang==="zh"?place+"：":"")+names.slice(0,3).join(" × ");
  const hook=S.lang==="zh"?names.join("、")+" 来自不同的故事，今晚被困在"+place+"。"+(rule?" 规则："+rule:""):names.join(", ")+" come from different stories. Tonight they're all stuck at "+place+"."+(rule?" Rule: "+rule:"");
  const open=S.lang==="zh"?"*"+place+"。灯光一暗，"+names.join("、")+"同时抬头——他们本不该出现在同一个故事里。*":"*"+place+". The lights dip, and "+names.join(", ")+" look up at the same moment — they were never supposed to be in the same story.*";
  S.mine.worlds[nid]={id:nid,or:"all",pal:["#9C84E0","#15121C"],author:"@"+((me()||"you").toLowerCase()),mine:1,mineAt:Date.now(),stats:[0,0,0],heat:S.heat,kind:"ensemble",cast:gpick.slice(),
   tags:["Crossover","Found Family"],title:x0(title),hook:x0(hook),premise:x0(hook+(rule?"":"")),you:x0(you||(S.lang==="zh"?"把大家拉到一起的人":"the one who brought them together")),
   rules:rule,status:{time:x0(S.lang==="zh"?"今晚":"Tonight"),place:x0(place)},rel:[],openings:[{id:"wd",t:T("The world opens","世界开启"),beats:{en:[["n","act",open]],zh:[["n","act",open]]}}],short:false};
  S.works.unshift({id:nid,kind:"group",title,at:Date.now(),seed:0});save();
  const gotBonus=typeof taskClaimOnce==="function"&&taskClaimOnce("pubWorld",3);
  if(typeof taskClaimOnce==="function")taskClaimOnce("interVid",3);
  toast(t("wd.made")+(gotBonus?" · "+t("task.gotWorld"):""));openStory(nid);wdCover(nid,place,gpick.slice());return}
 if(e.target.closest("[data-gorx]")&&rx){const w=wd(rx.wid),a=rxAuto(),x0=v=>({en:v,zh:v});
  if(rx.format==="video"){toast(t("rx.fmtVidSoon"));return}
  if(!rx.twist.trim()&&!rx.opening.trim()&&rx.type!=="au"&&rx.type!=="crossover"){toast(t("rx.need"));$("#rxTw")&&$("#rxTw").focus();return}
  const nid="rx"+Date.now(),names=rx.cast.map(id=>ch(id).n).join(", ");
  const how={whatif:"WHAT IF: "+(rx.twist||a.hook),au:"ALTERNATE UNIVERSE — same people, new world: "+rx.au+". "+(rx.twist||""),swap:"ROLE SWAP: the characters trade positions/power. "+(rx.twist||""),sequel:"AFTER THE ENDING: picks up after the original story. "+(rx.twist||""),crossover:"CROSSOVER: "+names+" are now in the same story. "+(rx.twist||"")}[rx.type];
  const ops=rx.opening.trim()?[{id:"rx",t:T("Your opening","你的开场"),beats:{en:[["n","act",rx.opening.trim()]],zh:[["n","act",rx.opening.trim()]]}}]:
   rx.from?[{id:"rx",t:T("From that moment","从那一刻开始"),beats:{en:rx.from.slice(-4).map(m=>[m.who==="me"?"n":m.who,m.who==="me"?"act":(m.k||"say"),m.who==="me"?me()+": "+m.txt:m.txt]),zh:null}}]:JSON.parse(JSON.stringify(w.openings||[]));
  ops.forEach(o=>{if(!o.beats.zh)o.beats.zh=o.beats.en});
  S.mine.worlds[nid]=Object.assign(JSON.parse(JSON.stringify(w)),{id:nid,official:false,author:"@"+(me()||"you").toLowerCase(),stats:[0,0,0],cast:rx.cast.slice(),heat:rx.heat,cover:null,
   title:x0(a.title),hook:x0(a.hook),premise:{en:Lz(w.premise)+" — REMIX · "+how,zh:Lz(w.premise)+" ——二创 · "+how},openings:ops,rel:(w.rel||[]).filter(([p,q])=>(p==="you"||rx.cast.includes(p))&&(q==="you"||rx.cast.includes(q))),
   tags:[...new Set((w.tags||[]).concat(rx.type==="au"?[]:[]))],remixOf:w.id,remixType:rx.type,short:false,quest:null,
   status:rx.type==="au"?{time:x0(""),place:x0(rx.au)}:w.status});
  if(rx.format==="image"&&rx.coverImg){S.art[nid]=rx.coverImg;S.mine.worlds[nid].cover=true}
  const wk={id:nid,kind:"remix",title:a.title,at:Date.now(),seed:0};S.works.unshift(wk);save();const done=nid;rx=null;
  if(typeof taskClaimOnce==="function"&&taskClaimOnce("pubRemix",3))setTimeout(()=>toast(t("task.gotRemix")),2600);
  openStory(done);shareSheet(wk);return}});

/* ================= ME ================= */
function renderMe(v){const p=persona();S.account=S.account||{email:null,pwSet:false};
 let h='<div class="topbar"><h1 style="font-size:24px" class="grow">'+t("me.h")+'</h1>'+langPicker()+'</div><div class="scroll pad stack" style="gap:12px;padding-block:4px 30px">'+
  '<div class="eyebrow">'+t("me.personas")+'</div><div class="hs">'+S.personas.map(q=>'<button class="card" style="flex:none;min-width:150px;text-align:left'+(q.id===S.pid?";border-color:rgba(238,111,151,.55)":"")+'" data-pid="'+q.id+'"><b>'+esc(q.name||"—")+'</b><p class="xs faint" style="margin-top:3px">'+esc(q.pron)+(q.id===S.pid?" · "+t("me.active"):"")+'</p><p class="xs dim" style="margin-top:6px;max-width:140px;white-space:normal">'+esc(q.look||"")+'</p></button>').join("")+
  '<button class="card" style="flex:none;min-width:110px;display:grid;place-items:center;color:var(--dim)" data-newp="1">＋ '+t("me.addp")+'</button></div>'+
  '<button class="bigopt" data-couple="1"><span style="font-size:22px">💞</span><span class="grow"><b>'+t("me.couple")+'</b><span>'+t("cr.sub")+'</span></span><span style="color:var(--gold)">›</span></button>'+
  '<div class="card"><div class="row"><div class="eyebrow grow">'+t("me.album")+'</div><span class="xs faint">'+S.album.length+'</span></div>'+(S.album.length?'<div class="album" style="margin-top:10px">'+S.album.map(a=>'<button data-shimg="'+a.id+'" style="display:block;padding:0;border:0;background:none;cursor:pointer">'+albumHtml(a)+'</button>').join("")+'</div>':'<p class="xs faint" style="margin-top:8px">'+t("me.empty")+'</p>')+'</div>'+
  '<div class="card"><div class="eyebrow">'+t("me.saved")+'</div>'+(S.saved.length?S.saved.slice(0,6).map(s=>'<button class="task" style="margin-top:8px" '+(s.short?'data-short="'+s.short+'"':'data-open="'+s.tid+'"')+'>'+(ch(s.who)?avatar(s.who,24):"")+'<span class="grow" style="font-size:12px">'+esc(s.txt)+'</span></button>').join(""):'<p class="xs faint" style="margin-top:8px">'+t("me.empty")+'</p>')+'</div>'+
  '<div class="card"><div class="row"><div class="grow"><b>📖 '+t("me.packs")+'</b><p class="xs faint" style="margin-top:3px">'+t("me.packsS",{a:packWorlds().filter(w=>owns(w.id)).length,b:packWorlds().reduce((n,w)=>n+endingsFound(w.id),0)})+'</p></div><button class="btn btn-g btn-sm" data-units="1">✦ '+unitsLeft()+'</button></div>'+
   (packWorlds().some(w=>owns(w.id)||lastRun(w.id))?'<div class="rail2" style="margin-top:10px">'+packWorlds().filter(w=>owns(w.id)||lastRun(w.id)).map(rCard).join("")+'</div>':'')+'</div>'+
  '<div class="card"><div class="row"><div class="grow"><b>💎 '+t("me.keys")+' · <span class="num">'+S.keys+'</span></b><p class="xs faint" style="margin-top:3px">'+t("g.demo")+'</p></div><button class="btn btn-g btn-sm" data-keysadd="1">+10</button></div>'+
  '<div class="row" style="margin-top:12px"><div class="grow"><b>'+t("me.plus")+'</b><p class="xs dim" style="margin-top:3px">'+t("me.plusS")+'</p></div><button class="btn '+(S.plus?"btn-g":"btn-p")+' btn-sm" data-plusset="1">'+(S.plus?"✓":"$9.99")+'</button></div></div>'+
  '<div class="card"><div class="eyebrow">'+t("me.heat")+'</div><div class="seg" style="margin-top:10px">'+["fluff","slow","steamy","mature"].map(k=>'<button data-heatset="'+k+'" class="'+(S.heat===k?"on":"")+'">'+t("heat."+k)+'</button>').join("")+'</div>'+
  '<div class="eyebrow" style="margin-top:14px">'+t("me.live")+'</div><p class="sm" id="liveRes" style="margin-top:6px;line-height:1.5">'+(SAMPLE&&!LIVE_ERR?"✓ "+t("live.ok"):liveWhy(LIVE_ERR||(SAMPLE?"":LIVE_STATE)))+'</p><button class="btn btn-g btn-sm" style="margin-top:10px" data-livetest="1">'+t("live.test")+'</button></div>'+
  '<div class="card"><div class="eyebrow">'+t("me.voice")+'</div><p class="xs dim" style="margin-top:6px">'+t("me.voiceS")+'</p>'+pickSearch("voiceQ","voiceList")+'<div class="stack" style="gap:6px;margin-top:10px" id="voiceList">'+
   (["m","f"].some(g=>!hasGenderVoice(g))?'<p class="xs" style="margin-top:8px;color:var(--gold);line-height:1.5">'+t(hasGenderVoice("m")?"voice.needF":"voice.needM")+'</p>':'')+
   allChars().map(id=>{const c=ch(id),vv=voiceFor(id),rl=recLineOf(id);return '<div class="row" style="gap:6px"><button class="task grow" data-vtest="'+id+'">'+avatar(id,26)+'<span class="grow">'+esc(c.n)+'<span class="xs faint" style="display:block">'+(rl?'🎙 '+t("voice.rec2"):esc(vv?voiceLabel97(vv):"—")+(vv&&(c.g==="f")!==FEM.test(vv.name)?' · ⚠ '+t("voice.wrongG"):''))+'</span></span>▶</button>'+
    '<button class="btn btn-g btn-xs" data-vai="'+id+'" style="flex:none">✨ '+t("voice.aiBtn")+'</button></div>'}).join("")+'</div></div>'+
  '<div class="card"><div class="eyebrow">'+t("voice.my")+'</div><p class="xs dim" style="margin-top:6px">'+t("voice.myS")+'</p><div class="row" style="margin-top:10px;gap:8px">'+
   (S.myVoice?'<audio id="myVoiceAud" controls style="height:34px;flex:1" src="'+S.myVoice+'"></audio><button class="btn btn-q btn-sm" data-vdel="1">'+t("voice.del")+'</button>':
    '<button class="btn '+(VREC.recording?"btn-p":"btn-g")+' btn-sm" data-vrec="1" id="vrecBtn">'+(VREC.recording?"● "+t("voice.stop"):"🎙️ "+t("voice.rec"))+'</button><span class="xs faint" id="vrecHint">'+t("voice.recHint")+'</span>')+'</div></div>'+
  '<div class="card"><div class="eyebrow">'+t("acct.h")+'</div>'+
   '<button class="task" style="margin-top:8px" data-acctemail="1">📧<span class="grow">'+t("acct.email")+'<span class="xs faint" style="display:block">'+esc(S.account.email||t("acct.none"))+'</span></span>'+t("acct.edit")+'</button>'+
   '<button class="task" style="margin-top:8px" data-acctpw="1">🔒<span class="grow">'+t("acct.pw")+'<span class="xs faint" style="display:block">'+(S.account.pwSet?t("acct.pwSet"):t("acct.none"))+'</span></span>'+t("acct.edit")+'</button></div>'+
  '<button class="btn btn-q" data-reset="1">'+t("me.reset")+'</button></div>';
 v.innerHTML=h;}
/* ---------- record my own voice (getUserMedia + MediaRecorder) ---------- */
const VREC={recording:false,rec:null,chunks:[]};
async function vrecToggle(){
 if(VREC.recording){try{VREC.rec.stop()}catch(_){}return}
 try{
  if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){toast(t("voice.noMic"));return}
  const stream=await navigator.mediaDevices.getUserMedia({audio:true});
  const mime=(window.MediaRecorder&&MediaRecorder.isTypeSupported&&MediaRecorder.isTypeSupported("audio/webm"))?"audio/webm":"";
  const rec=new MediaRecorder(stream,mime?{mimeType:mime}:undefined);VREC.rec=rec;VREC.chunks=[];VREC.recording=true;renderTab("me");
  rec.ondataavailable=e=>{if(e.data&&e.data.size)VREC.chunks.push(e.data)};
  rec.onstop=()=>{VREC.recording=false;try{stream.getTracks().forEach(tr=>tr.stop())}catch(_){}
   const blob=new Blob(VREC.chunks,{type:mime||"audio/webm"});const fr=new FileReader();
   fr.onload=()=>{S.myVoice=fr.result;save();toast(t("voice.saved"));renderTab("me")};fr.readAsDataURL(blob)};
  rec.start();setTimeout(()=>{if(VREC.recording&&VREC.rec===rec)try{rec.stop()}catch(_){}},12000)}
 catch(_){VREC.recording=false;toast(t("voice.noMic"));renderTab("me")}}
/* ---------- AI voice generation "studio" — its own page (a full-screen sheet), not a one-tap inline action ---------- */
function voiceSheet(id){const c=ch(id);
 const line=Lz(c.pitch).replace(/[""\"]/g,"");
 sheet('<div class="row"><h2 class="grow">'+avatar(id,32)+' '+esc(c.n)+'</h2></div>'+
  '<p class="xs faint" style="margin-top:2px">'+t("voice.studioS")+'</p>'+
  '<label class="xs faint" style="display:block;margin-top:14px">'+t("voice.studioLine")+'</label>'+
  '<textarea id="voiceLineIn" rows="3" style="width:100%;margin-top:6px;background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:11px 13px;outline:none;font-size:15px;resize:vertical">'+esc(line)+'</textarea>'+
  '<button class="btn btn-p btn-block" style="margin-top:14px" data-voicego="'+id+'">✨ '+t("voice.studioGo")+'</button>'+
  '<div id="voiceOut" style="margin-top:14px"></div>');}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-vai]")){voiceSheet(x.dataset.vai);return}
 if(x=e.target.closest("[data-voicego]")){const id=x.dataset.voicego,txt=($("#voiceLineIn").value||"").trim();if(!txt)return;
  const out=$("#voiceOut");const orig=x.textContent;x.textContent="…";x.disabled=true;if(out)out.innerHTML='<p class="xs faint">'+t("voice.studioGoing")+'</p>';
  aiSpeak(id,txt,
   ()=>{x.textContent=orig;x.disabled=false;if(typeof taskClaimOnce==="function"&&taskClaimOnce("tool",2))toast(t("task.gotTool"))},
   msg=>{x.textContent=orig;x.disabled=false;if(out)out.innerHTML='<p class="xs faint" style="color:var(--bad,#e07a7a)">'+esc(msg)+'</p>'},
   src=>{if(out)out.innerHTML='<audio controls style="width:100%" src="'+esc(src)+'"></audio>'});
  return}
 if(e.target.closest("[data-vrec]")){vrecToggle();return}
 if(e.target.closest("[data-vdel]")){S.myVoice=null;save();renderTab("me");return}
 if(e.target.closest("[data-acctemail]")){sheet('<h2>'+t("acct.email")+'</h2><p class="sm dim" style="margin-top:6px">'+t("acct.emailS")+'</p>'+
   '<input id="acctEmailIn" type="email" value="'+esc(S.account.email||"")+'" placeholder="you@example.com" style="width:100%;margin-top:14px;background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:11px 13px;outline:none;font-size:15px">'+
   '<button class="btn btn-p btn-block" style="margin-top:14px" data-acctemailgo="1">'+t("acct.save")+'</button>');return}
 if(e.target.closest("[data-acctemailgo]")){const v=($("#acctEmailIn").value||"").trim();
   if(v&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){toast(t("acct.badEmail"));return}
   S.account.email=v||null;save();closeSheet();toast(t("acct.saved"));renderTab("me");return}
 if(e.target.closest("[data-acctpw]")){sheet('<h2>'+t("acct.pw")+'</h2><p class="sm dim" style="margin-top:6px">'+t("acct.pwS")+'</p>'+
   '<input id="acctPw1" type="password" placeholder="'+t("acct.pwNew")+'" style="width:100%;margin-top:14px;background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:11px 13px;outline:none;font-size:15px">'+
   '<input id="acctPw2" type="password" placeholder="'+t("acct.pwConfirm")+'" style="width:100%;margin-top:8px;background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:11px 13px;outline:none;font-size:15px">'+
   '<button class="btn btn-p btn-block" style="margin-top:14px" data-acctpwgo="1">'+t("acct.save")+'</button>');return}
 if(e.target.closest("[data-acctpwgo]")){const a=$("#acctPw1").value||"",b=$("#acctPw2").value||"";
   if(a.length<6){toast(t("acct.pwShort"));return}if(a!==b){toast(t("acct.pwMismatch"));return}
   S.account.pwSet=true;save();closeSheet();toast(t("acct.saved"));renderTab("me");return}
 if(x=e.target.closest("[data-heatset]")){S.heat=x.dataset.heatset;save();renderTab("me");return}
 if(e.target.closest("[data-keysadd]")){paySheet();return}
 if(e.target.closest("[data-plusset]")){paySheet();return}
 if(x=e.target.closest("[data-vtest]")){const id=x.dataset.vtest,rl=recLineOf(id);if(rl){stopVoice();const a=new Audio(rl.src);AUD_CUR=a;a.play().catch(()=>{});toast("🎙 "+rl.txt);return}speak(Lz(ch(id).pitch).replace(/[“”"]/g,""),id);return}
 if(e.target.closest("[data-reset]")){sheet('<h2>'+t("me.reset")+'</h2><p class="sm dim" style="margin-top:6px">'+t("me.resetS")+'</p><button class="btn btn-p btn-block" style="margin-top:14px" data-resetgo="1">'+t("me.resetGo")+'</button>');return}
 if(e.target.closest("[data-resetgo]")){try{localStorage.removeItem(KEY)}catch(_){}S=load();closeSheet();obStep=0;obAge=false;renderOB();return}
 if(e.target.closest("[data-couple]")){coupleRoom();return}});

/* ================= COUPLE ROOM (Plaitoon-style) ================= */
function coupleRoom(){
 const rows=[];Object.values(S.threads).forEach(th=>{if(th.kind==="quest")return;(th.cast||[]).forEach(c=>{if(!ch(c))return;const ex=rows.find(r=>r.cid===c);if(!ex||ex.th.rounds<th.rounds){if(ex)rows.splice(rows.indexOf(ex),1);rows.push({cid:c,th})}})});
 S.couples=S.couples||{};const couples=Object.keys(S.couples).filter(c=>ch(c));
 let h='<div class="card" style="background:linear-gradient(140deg,rgba(238,111,151,.14),rgba(240,183,126,.08)),var(--panel);text-align:center"><div style="font-size:30px">💞</div><h2 style="margin-top:6px">'+t("cr.h")+'</h2><p class="sm dim" style="margin-top:8px;line-height:1.6">'+t("cr.sub")+'</p></div>';
 couples.forEach(cid=>{const cp=S.couples[cid],c=ch(cid),days=Math.floor((Date.now()-cp.since)/864e5)+1,q=DAILYQ[(days-1)%DAILYQ.length],ans=cp.ans[days];
  h+='<div class="card"><div class="row">'+avatar(cid,44)+'<div class="grow"><b>'+esc(c.n)+' 💍</b><p class="xs faint">'+t("cr.day",{n:days})+'</p></div><button class="btn btn-g btn-sm" data-open="'+cp.tid+'">'+t("tab.chats")+'</button></div>'+
   '<div class="eyebrow" style="margin-top:14px">'+t("cr.q")+'</div><p class="pitch" style="font-size:15px;margin-top:6px">'+esc(Lz(q))+'</p>'+
   (ans?'<p class="sm dim" style="margin-top:8px">“'+esc(ans)+'” · '+t("cr.answered")+'</p>':'<div class="row" style="margin-top:10px"><input id="cq_'+cid+'" style="flex:1;background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:9px 12px;outline:none"><button class="btn btn-p btn-sm" data-cqa="'+cid+'">'+t("cr.answer")+'</button></div>')+
   '<div class="eyebrow" style="margin-top:14px">'+t("cr.letters")+'</div><div class="stack" style="gap:6px;margin-top:8px">'+[7,30,100].map(d=>'<button class="task'+(days>=d?"":" done")+'" data-letter="'+cid+'|'+d+'">✉️ <span class="grow">'+(days>=d?t("cr.letter",{n:d}):t("cr.letterLock",{n:d}))+'</span></button>').join("")+'</div></div>'});
 h+='<div class="eyebrow" style="margin-top:6px">'+t("cp.go")+'</div>';
 if(!rows.length)h+='<p class="empty">'+t("cr.none")+'</p>';
 rows.filter(r=>!S.couples[r.cid]).sort((a,b)=>(b.th.rounds||0)-(a.th.rounds||0)).forEach(r=>{const n=Math.min(30,r.th.rounds||0);
  h+='<button class="trow" style="padding:10px 0" data-cpgo="'+r.cid+'|'+r.th.id+'">'+avatar(r.cid,48)+'<div class="grow"><div class="row"><b class="grow">'+esc(ch(r.cid).n)+'</b><span class="xs faint num">'+t("cr.turns",{a:n})+'</span></div><div class="meter" style="margin-top:8px"><i style="width:'+(n/30*100)+'%"></i></div></div></button>'});
 screen("s-couple",'<div class="topbar"><button class="ibtn" data-back="1">'+ic("back")+'</button><h2 class="grow" style="font-size:19px">'+t("cr.h")+'</h2></div><div class="scroll pad stack" style="gap:12px;padding-block:4px 24px">'+h+'</div>');show("s-couple");}
document.addEventListener("click",async e=>{let x;
 if(x=e.target.closest("[data-cqa]")){const cid=x.dataset.cqa,v=($("#cq_"+cid).value||"").trim();if(!v)return;const cp=S.couples[cid],days=Math.floor((Date.now()-cp.since)/864e5)+1;cp.ans[days]=v;
  const th=S.threads[cp.tid];if(th)th.mem.push(me()+" answered the daily question \""+Lz(DAILYQ[(days-1)%DAILYQ.length])+"\" with: "+v);save();coupleRoom();return}
 if(x=e.target.closest("[data-letter]")){const[cid,d]=x.dataset.letter.split("|");const cp=S.couples[cid],days=Math.floor((Date.now()-cp.since)/864e5)+1;if(days<+d){toast(t("cr.letterLock",{n:d}));return}
  const c=ch(cid);let txt=(S.lang==="zh"?"致"+me()+"：\n\n第 "+d+" 天。我还是不太会写这种东西。但我记得你说过的每一句话。\n\n—— "+first(c.n):"Dear "+me()+",\n\nDay "+d+". I'm still bad at writing these. But I remember every single thing you've told me.\n\n— "+first(c.n));
  sheet('<div class="eyebrow">'+t("cr.letter",{n:d})+'</div><p class="pitch" id="letterT" style="white-space:pre-wrap;margin-top:12px;font-size:15px">'+esc(txt)+'</p>');
  if(liveOn()){try{const th=S.threads[cp.tid];const r=await ask("Write a short handwritten letter (90-140 words) from "+c.n+" ("+Lz(c.vibe)+") to "+me()+" on day "+d+" of being together. Reference 2 specific things from: "+(th?th.mem.slice(-6).join("; "):"")+". In character, US voice. Language: "+LANG_NAME[S.lang]+". Reply only JSON {\"letter\":\"...\"}",{modelTier:"default"});if(r&&r.letter&&$("#letterT"))$("#letterT").textContent=r.letter}catch(_){}}return}});

/* ================= SHORT PLAYER (vertical drama, Afterline-style) =================
   An episode = beats (one line each) + a cliff. Every beat is one 8-second Veo clip slot:
   if the clip for that slot has been delivered it plays with the line as a subtitle,
   otherwise the portrait + Ken Burns + voice stands in. A continuous score runs under the whole episode. */
let sp=null;const SP_BEAT=4200;
/* delivered clips: "world:episode" → {beatIndex: {src, ms}}; index = beats.length is the cliff clip */
const clipSet=(w,have)=>Object.fromEntries(have.map(c=>[c-1,{src:"video/"+w+"_ep01_c0"+c+".mp4",ms:8000}]));
const prVideoPath=n=>"video/pr/"+n;
const CLIPS={"heir:1":{film:{src:"video/heir_ep01_film.mp4",ms:10000,cap:{en:"72 hours later · A warehouse in Red Hook",zh:"72小时后 · 红钩区废弃仓库"}}},"ice:1":clipSet("ice",[1,2,3,4,5,6,7]),"pact:1":clipSet("pact",[1,2,3,4,5,6,7]),"unseelie:1":clipSet("unseelie",[1,2,4,5,6,7]),
 "crimson:1":clipSet("crimson",[1,2,3,5,6,7]),"made:1":clipSet("made",[1,2,3,4,6,7]),"pole:1":clipSet("pole",[1,2,3,4,5,7]),
 "night:1":clipSet("night",[1,2,3,4,5,6,7]),"light:1":clipSet("light",[1,2,3,4,5,6,7]),"split:1":clipSet("split",[1,2,3,4,5,6,7]),"roomies:1":clipSet("roomies",[1,5,6,7]),
 "offbook:1":clipSet("offbook",[1,2,3,4,5,6,7]),"bratva:1":clipSet("bratva",[1,2,3,4,5,6,7]),"lowseason:1":clipSet("lowseason",[1,2,3,4,5,6,7]),
 "fourth:1":clipSet("fourth",[3,4,6]),
 /* playroom ensemble videos — after hours, pack, and misc shots for masque/gala/market */
 "afterhours:1":{0:{src:prVideoPath("Man_and_woman_backstage_1080p_20260925235846.mp4"),ms:8000},1:{src:prVideoPath("Man_and_woman_exchanging_dialogue_20260925235845.mp4"),ms:8000},2:{src:prVideoPath("Man_and_woman_talking_1080p_20260925235920.mp4"),ms:8000},3:{src:prVideoPath("Man_and_woman_in_penthouse_20260925235910.mp4"),ms:8000},4:{src:prVideoPath("Man_and_woman_interrupted_backstage_20260925235901.mp4"),ms:8000},5:{src:prVideoPath("Two_men_in_stairwell_1080p_20260925235652.mp4"),ms:8000},6:{src:prVideoPath("Two_women_talking_in_kitchen_20260925235821.mp4"),ms:8000}},
 "pack:1":{0:{src:prVideoPath("Three_men_in_log_cabin_20260926000013.mp4"),ms:8000},1:{src:prVideoPath("Three_men_in_cabin_1080p_20260926000110.mp4"),ms:8000},2:{src:prVideoPath("Three_adults_discuss_leaving_dur…_20260926000137.mp4"),ms:8000},3:{src:prVideoPath("Three_men_react_to_howl_20260926000016.mp4"),ms:8000},4:{src:prVideoPath("Wolf_eyes_opening_in_darkness_20260927010919.mp4"),ms:8000},5:{src:prVideoPath("Wolf_tracks_outside_cabin_window_20260927011103.mp4"),ms:8000},6:{src:prVideoPath("Wolf_tracks_outside_cabin_window_20260927011103.mp4"),ms:8000}},
 "masque:1":{0:{src:prVideoPath("Masked_men_raising_auction_paddles_20260927010645.mp4"),ms:8000},1:{src:prVideoPath("Bottle_spins_on_table_1080p_20260927010412.mp4"),ms:8000},2:{src:prVideoPath("Man_picking_up_place_card_20260927010713.mp4"),ms:8000},3:{src:prVideoPath("Door_opens_to_floating_lanterns_20260927010856.mp4"),ms:8000}},
 "gala:1":{0:{src:prVideoPath("Masked_men_raising_auction_paddles_20260927010645.mp4"),ms:8000},1:{src:prVideoPath("Bottle_spins_on_table_1080p_20260927010412.mp4"),ms:8000},2:{src:prVideoPath("Man_picking_up_place_card_20260927010713.mp4"),ms:8000},3:{src:prVideoPath("Door_opens_to_floating_lanterns_20260927010856.mp4"),ms:8000}},
 "market:1":{0:{src:prVideoPath("Door_opens_to_floating_lanterns_20260927010856.mp4"),ms:8000},1:{src:prVideoPath("Bottle_spins_on_table_1080p_20260927010412.mp4"),ms:8000},2:{src:prVideoPath("Man_picking_up_place_card_20260927010713.mp4"),ms:8000},3:{src:prVideoPath("Masked_men_raising_auction_paddles_20260927010645.mp4"),ms:8000}}};
/* dramas whose missing clips are simply skipped (no black title cards) */
const CLIP_ONLY={fourth:1};
/* full-quality 1080p originals live in the artifact's asset store; the small copies in video/ are the fallback if a viewer can't load them */
const VIDHD={"video/afterhours_ep01_c01.mp4":"/_blob/cb035c77e685a3cef4f9a27334eabb06","video/afterhours_ep01_c02.mp4":"/_blob/12bb183aff8df6ab97fc64344df27568","video/afterhours_ep01_c03.mp4":"/_blob/78efcf7b1f78273f9ae47135e59ed0f0","video/afterhours_ep01_c04.mp4":"/_blob/ef6a9500431669d328c1cff06a52750e","video/afterhours_ep01_c05.mp4":"/_blob/0e4567318b1ae61db111de7e13c52b70","video/afterhours_ep01_c06.mp4":"/_blob/2ee307b6e9d7b868943b5e2dd62a9435","video/afterhours_ep01_c07.mp4":"/_blob/3893e7d70a355a567e6f23987163ef60","video/bratva_ep01_c01.mp4":"/_blob/d45a392a96853ea130ae36dd7c130c4d","video/bratva_ep01_c02.mp4":"/_blob/b121b40ef6d25900add0ede1ce76abd7","video/bratva_ep01_c03.mp4":"/_blob/5125d0217559fcbcbbc49e2fdcfa175b","video/bratva_ep01_c04.mp4":"/_blob/7c5f3dc87aa6508ef48f0a4f6d3ab0c3","video/bratva_ep01_c05.mp4":"/_blob/e892b0c982ae9b6ac9f9946d2a643c57","video/bratva_ep01_c06.mp4":"/_blob/c1d4092d93c885013ec701ddc9b2ace1","video/bratva_ep01_c07.mp4":"/_blob/f3c51f87441533e272cd11ca01c85a98","video/crimson_ep01_c01.mp4":"/_blob/84193ed398e725eb7690202ddbf69c03","video/crimson_ep01_c02.mp4":"/_blob/caf2fe6a4155e2a05e6f792efc60269a","video/crimson_ep01_c03.mp4":"/_blob/0abfec62ff55447f2ffd54472f8f3114","video/crimson_ep01_c05.mp4":"/_blob/7664f215f536c2e01e83f1ea1420c57b","video/crimson_ep01_c06.mp4":"/_blob/1a513187bc22f82185e736b0eba6e7d6","video/crimson_ep01_c07.mp4":"/_blob/4dd354fc0bf622b412cf30097d25c8e0","video/fourth_ep01_c03.mp4":"/_blob/b56235d49c49cd2d2201d24c6aa519f1","video/fourth_ep01_c04.mp4":"/_blob/e5a928024cd2171efbb5865afcda86f8","video/fourth_ep01_c06.mp4":"/_blob/afd1fc6081ee8c7a80bf5634e759e3e3","video/ice_ep01_c01.mp4":"/_blob/f67622cd93a3676b2f0e2f0795ca01a1","video/ice_ep01_c02.mp4":"/_blob/c38b64c50112b5dc9598a96324b25780","video/ice_ep01_c03.mp4":"/_blob/85bd7537fe37c32024ee1a909186a4a4","video/ice_ep01_c04.mp4":"/_blob/dcab84326c3e519647dec2758b5101f9","video/ice_ep01_c05.mp4":"/_blob/a65f70a8b5e318170d747c3104f54b2a","video/ice_ep01_c06.mp4":"/_blob/050d37b4519c7140e1d9cf9e7bb1417b","video/ice_ep01_c07.mp4":"/_blob/17c688bbf9559ab920c893ba7671e5e0","video/light_ep01_c01.mp4":"/_blob/2f8cb2fc2461a62359e48c2c7a75b443","video/light_ep01_c02.mp4":"/_blob/e33cda8dca567ae9358ef4a7e7abc7c2","video/light_ep01_c03.mp4":"/_blob/6b36f0c283188898b73afda1f5ed97f3","video/light_ep01_c04.mp4":"/_blob/002292e95d0696376eca6982f14a251f","video/light_ep01_c05.mp4":"/_blob/d301770ce818245bad9d936eaf67ebe4","video/light_ep01_c06.mp4":"/_blob/48d13d412e3c97a398e0689b4094988e","video/light_ep01_c07.mp4":"/_blob/a196822c67cf4be20f4d18ce69b4f1a7","video/lowseason_ep01_c01.mp4":"/_blob/62c57e7b987710ccabe44c2fa79bba46","video/lowseason_ep01_c02.mp4":"/_blob/67d68045fd2904f00d1c7b4faba9f530","video/lowseason_ep01_c03.mp4":"/_blob/7a4c8d6f5abec03d6e697575b68b3e59","video/lowseason_ep01_c04.mp4":"/_blob/22875b57fc0daca015e723753ea927f4","video/lowseason_ep01_c05.mp4":"/_blob/1d7cc232ec637a61c85e5e914f933830","video/lowseason_ep01_c06.mp4":"/_blob/cc1d596aa0d9bd7e587a50cc83d19526","video/lowseason_ep01_c07.mp4":"/_blob/799a05b72113f8c857b534a7664281fa","video/made_ep01_c01.mp4":"/_blob/c8d99670553096e8bba59b50a1a31c60","video/made_ep01_c02.mp4":"/_blob/23e13d14ddd5408e4778ae14b3064107","video/made_ep01_c03.mp4":"/_blob/c98c3c6a2746d9c7c6f70aaa276d9f5e","video/made_ep01_c04.mp4":"/_blob/a97ac50b5e7140f85b87e1406fc9bb8c","video/made_ep01_c06.mp4":"/_blob/9fa593d07077caf00e95630c6ff8b93e","video/made_ep01_c07.mp4":"/_blob/33b6aae78645498829b19159609a67db","video/night_ep01_c01.mp4":"/_blob/73bebd6c6ae7d350ce7d383121fb9581","video/night_ep01_c02.mp4":"/_blob/5451d11bf036594db3b444465071e2ec","video/night_ep01_c03.mp4":"/_blob/c274c834d812bc9608eb778eca56e60e","video/night_ep01_c04.mp4":"/_blob/872c017e70db7bf4027274d079db9422","video/night_ep01_c05.mp4":"/_blob/6d747fcd719fd3544fd3c009f4968ced","video/night_ep01_c06.mp4":"/_blob/c5271e9c4d105eaa631f3b68aa41ea98","video/night_ep01_c07.mp4":"/_blob/2ae7df6a4baa434d582f7758858bdb3c","video/offbook_ep01_c01.mp4":"/_blob/d0a2227e8c8f4ca35a19f58f0abca3f8","video/offbook_ep01_c02.mp4":"/_blob/7b13eb56fa5724498d92d852808298db","video/offbook_ep01_c03.mp4":"/_blob/46f24c054f0531063f7e855a856da8fc","video/offbook_ep01_c04.mp4":"/_blob/0cd5995ffaa0c6b0c394862182e83c3a","video/offbook_ep01_c05.mp4":"/_blob/88bc71dd741111d17eca2c783972691e","video/offbook_ep01_c06.mp4":"/_blob/8822c765e87761f45fa91880e6b83b65","video/offbook_ep01_c07.mp4":"/_blob/95d85b51960ccc5beb5bbbed302424d1","video/pack_ep01_c01.mp4":"/_blob/e605c11832046d0ac7ebd8527521a8ee","video/pack_ep01_c02.mp4":"/_blob/b4815df9a8a66ce3eeb849e895399209","video/pack_ep01_c03.mp4":"/_blob/fd95a9515e7480c6747ac5759d094400","video/pack_ep01_c04.mp4":"/_blob/9bf2bb957c75742f112292b13e053dfe","video/pack_ep01_c05.mp4":"/_blob/85803b627bd1bbbd5bc041b62f738b77","video/pack_ep01_c06.mp4":"/_blob/6fdfc83e57ebf0085cc98762157a7bad","video/pack_ep01_c07.mp4":"/_blob/1fb41f1ac854a9d58a9243df9657f630","video/pact_ep01_c01.mp4":"/_blob/9e57b658029be0f466f72e8a0c986093","video/pact_ep01_c02.mp4":"/_blob/893014647e553130bf56c982432eb103","video/pact_ep01_c03.mp4":"/_blob/bd5d4fb7df6ace944a4734771ce4d2c6","video/pact_ep01_c04.mp4":"/_blob/65f35967f4443c7a8cc872a6f41bcac5","video/pact_ep01_c05.mp4":"/_blob/3830ffa76bd6f807201b30d765f04698","video/pact_ep01_c06.mp4":"/_blob/3a8213d17a97e5eb0dc5c982afdd5b1c","video/pact_ep01_c07.mp4":"/_blob/852a60d83661cb4d9b841fadc82149ca","video/pole_ep01_c01.mp4":"/_blob/7fcf23bb4202d161e6720be8e0336378","video/pole_ep01_c02.mp4":"/_blob/64b45354a97f92e1090e4314fe48256a","video/pole_ep01_c03.mp4":"/_blob/732436205ef3bc50ef7b58d984d48cac","video/pole_ep01_c04.mp4":"/_blob/b4c5497382f586f8d7a52599fc706e73","video/pole_ep01_c05.mp4":"/_blob/d745517df52c9e62c2e0df16ce1d78d4","video/pole_ep01_c07.mp4":"/_blob/4522ef2410b3ea398f9794e7cc8a02c6","video/roomies_ep01_c01.mp4":"/_blob/61e2530f7ff0a9b28d4e77804a72d737","video/roomies_ep01_c05.mp4":"/_blob/0922b8f170809849c69ebf599677ae05","video/roomies_ep01_c06.mp4":"/_blob/2a40219fd9d742a1fb6679791b4153d7","video/roomies_ep01_c07.mp4":"/_blob/11bf93f167b0232980c025873b19a208","video/split_ep01_c01.mp4":"/_blob/e6e2f26ecba38c67595a113fc2309592","video/split_ep01_c02.mp4":"/_blob/bba9e7945d384681bbac16b3ac39853e","video/split_ep01_c03.mp4":"/_blob/96a6f11a6558c145d5905d4de8a8b0fc","video/split_ep01_c04.mp4":"/_blob/28081fe2ed067dcf147c2b021d7ea552","video/split_ep01_c05.mp4":"/_blob/c73cb74bfb6abe2419b97bd5452c4c6a","video/split_ep01_c06.mp4":"/_blob/842344b58c3adc04d7d43ea7040b2ab0","video/split_ep01_c07.mp4":"/_blob/edf995b9c9b2f48430fd4bbc61efd916","video/unseelie_ep01_c01.mp4":"/_blob/6f9667649ad737f48282b462df734f95","video/unseelie_ep01_c02.mp4":"/_blob/7c1a6f168125c32950adc808728222df","video/unseelie_ep01_c04.mp4":"/_blob/b0f7a6e2311ba39ad2050a6a4f25891e","video/unseelie_ep01_c05.mp4":"/_blob/ececee074efcd12684f1b893e67b168f","video/unseelie_ep01_c06.mp4":"/_blob/5e1ccaa09576c72f76d51b87655b0da6","video/unseelie_ep01_c07.mp4":"/_blob/6e10121ac7e6f07338b5a334155482f8"};
let HDFAIL=false;
function vidSrc(p){if(window.VIDDATA&&VIDDATA[p])return VIDDATA[p];return (!HDFAIL&&VIDHD[p])||p}
document.addEventListener("error",e=>{const v=e.target;if(!v||v.tagName!=="VIDEO"||HDFAIL)return;const s=v.getAttribute("src")||"";if(s.indexOf("/_blob/")<0)return;
 HDFAIL=true;const k=Object.keys(VIDHD).find(x=>VIDHD[x]===s.split("#")[0]);if(k){e.stopImmediatePropagation();v.src=k+(s.includes("#")?"#"+s.split("#")[1]:"");try{v.load();const pr=v.play();pr&&pr.catch&&pr.catch(()=>{})}catch(_){}}},true);
/* a short drama is the story's HOOK, not a paywalled series: one clip, then "what happens next is up to you" → the interactive story */
function eps(wid){const s=SHORTS[wid];if(!s)return [];return [Object.assign({t:EP_TITLE[wid]||T("Hook","钩子")},s)]}
function hasClips(wid){return Object.keys(CLIPS).some(k=>k.split(":")[0]===wid)}
function epUnlocked(wid,n){return true;if(n<=FREE_EPS||S.plus||(S.epUnlock&&S.epUnlock[wid+":"+n]))return true;const l=wufLeft(wid,n);if(l===0){unlockEp(wid,n);S.wuf[wid]=null;save();return true}return false}
function openShort(wid,ep){ep=ep||1;const list=eps(wid),e=list[ep-1];if(!e)return;const lang=CL();
 if(!epUnlocked(wid,ep)){epLockSheet(wid,ep);return}
 let beats=e[lang]||e.en;let cl=CLIPS[wid+":"+ep]||{};
 /* one finished film for the whole hook: play it with its own sound, then the cliff card */
 if(cl.film){const f=cl.film;beats=[["n",Lz(f.cap)||""]];cl={0:{src:f.src,ms:f.ms,music:true}}}
 /* a whole-episode file (e.g. made with Veo Extend): {full:{src,music}} — slot i starts at i×8s inside it */
 if(cl.full){const f=cl.full,o={};for(let i=0;i<=beats.length;i++)o[i]={src:f.src,ms:8000,off:i*8000,music:f.music};cl=o}
 const anyClip=Object.keys(cl).length>0;
 /* in an episode made of clips, a clip that hasn't arrived yet plays as a black title card, not a still image */
 const segs=beats.map((b,i)=>({b,clip:cl[i]||null,card:anyClip&&!cl[i],ms:cl[i]?cl[i].ms:anyClip?3600:SP_BEAT}));
 if(anyClip&&!cl[beats.length])segs.push({b:["n",Lz(e.cliff)],card:1,ms:4200,cliff:1});
 else if(cl[beats.length])segs.push({b:["n",Lz(e.cliff)],clip:cl[beats.length],ms:cl[beats.length].ms,cliff:1});
 if(CLIP_ONLY[wid]&&anyClip){for(let k=segs.length-1;k>=0;k--)if(segs[k].card&&!segs[k].cliff)segs.splice(k,1)}
 let acc=0;segs.forEach(g=>{g.at=acc;acc+=g.ms});
 const old=sp&&sp.wid===wid?sp:null;
 const c1=CLIPS[wid+":1"],off=ep>1&&c1&&!c1.full?SHORTS[wid].en.length:0;
 sp={wid,ep,n:list.length,off,clipMode:anyClip,title:Lz(e.t),beats,segs,total:acc,cliff:Lz(e.cliff),i:-1,done:false,speed:1,t0:Date.now(),base:0,saved:!!S.saved.find(x=>x.short===wid)};
 spMount();spShow(0);spTick();if(S.music!==false&&!segs.some(g=>g.clip&&g.clip.music)&&!anyClip)scoreStart(wid);spMuSync()}
function spDur(){return sp.total}
function fmtT(ms){const s=Math.max(0,Math.round(ms/1000));return Math.floor(s/60)+":"+String(s%60).padStart(2,"0")}
function spMount(){const w=wd(sp.wid);let el=$(".shortp");if(!el){el=document.createElement("div");el.className="shortp";$("#dev").appendChild(el)}
 el.classList.remove("vid");
 el.innerHTML='<div class="bg" id="spBg"></div><video id="spVid" class="spvid" playsinline preload="auto"></video><div class="shade"></div><div class="grain"></div>'+
  '<div class="top"><button class="ibtn" data-spx="1" style="background:rgba(0,0,0,.45)">'+ic("back")+'</button><div class="grow" style="min-width:0"><b class="serif-t" style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(Lz(w.title))+'</b><span class="xs" style="opacity:.75">'+esc(sp.title)+'</span></div><span class="eppill" id="spPill">'+spPillTxt(0)+'</span></div>'+
  '<div class="rail-r"><button data-spsave="1"><span class="rb">🔖</span><small>'+t("msg.save")+'</small></button><button data-speps="1"><span class="rb">☰</span><small>'+t("sp.eps")+'</small></button>'+
  '<button data-spmusic="1"><span class="rb" id="spMu">🔇</span><small>'+t("sp.music")+'</small></button>'+
  '<button data-spspeed="1"><span class="rb">⏱</span><small id="spSpd">1x</small></button><button data-story="'+w.id+'" data-spx2="1"><span class="rb">💬</span><small>'+fmtN(w.stats[2])+'</small></button></div>'+
  '<div class="body" data-spadv="1"><div id="spLine"></div><div class="syn"><div class="eyebrow" style="color:#fff;opacity:.85">📖 '+t("sp.syn")+'</div><p>'+esc(Lz(w.hook))+'</p></div>'+
  '<div class="scrub"><span id="spT0" class="num">0:00</span><div class="bar" id="spBar"><i id="spFill"></i><b id="spKnob"></b></div><span class="num">'+fmtT(spDur())+'</span></div></div>'+
  '<button class="stepfab" data-spin="1" title="'+esc(t("sv.stepin"))+'">🎬<small>'+t("sp.play")+'</small></button><div id="spEnd"></div>'}
/* when a whole episode is delivered as clips, each 8-second clip is listed as its own episode (EP1…EP7) and the scripted episodes follow */
function spEpCount(){return sp.clipMode?sp.segs.length+(sp.n-sp.ep):sp.n+sp.off}
function spEpNo(i){return sp.clipMode?i+1:sp.ep+sp.off}
function spPillTxt(i){return "EP "+spEpNo(i)+" / "+spEpCount()}
function segAt(tt){for(let k=sp.segs.length-1;k>=0;k--)if(tt>=sp.segs[k].at)return k;return 0}
function spLineHTML(b,sub){const c=b[0]!=="n"?ch(b[0]):null;
 return '<div class="'+(sub?"subt"+(c?" say":""):"")+'">'+(c?'<div class="who" style="color:'+c.pal[0]+'">'+esc(first(c.n))+'</div>':"")+'<p class="line'+(c?"":" nar")+'">'+esc(b[1])+'</p></div>'}
function spShow(i,off){sp.i=i;const pl=$("#spPill");if(pl)pl.textContent=spPillTxt(i);const g=sp.segs[i],b=g.b,c=b[0]!=="n"?ch(b[0]):null,w=wd(sp.wid),v=$("#spVid"),el=$(".shortp");
 $("#spLine").innerHTML=spLineHTML(b,!!g.clip);
 if(g.clip){el.classList.remove("icard");el.classList.add("vid");stopVoice();if(v.dataset.src!==g.clip.src){v.dataset.src=g.clip.src;v.src=vidSrc(g.clip.src)}
  const want=((g.clip.off||0)+(off||0))/1000;if(Math.abs(v.currentTime-want)>.35)try{v.currentTime=want}catch(_){}v.playbackRate=sp.speed;const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{v.muted=true;v.play().catch(()=>{})});scoreDuck(true);return}
 if(g.card){el.classList.add("vid");el.classList.add("icard");v.pause();v.removeAttribute("src");v.dataset.src="";$("#spLine").innerHTML=spLineHTML(b,false);speak(b[1],b[0]);return}
 el.classList.remove("icard");
 el.classList.remove("vid");v.pause();scoreDuck(false);
 const ps=poseOf({txt:b[1],k:"say"});POSES.forEach(q=>$("#spBg").classList.toggle("p-"+q,q===ps&&!!c));
 const bgId=c?b[0]:(w.cover?w.id:w.cast[i%w.cast.length]);
 const bg=$("#spBg");const im=document.createElement("img");im.src=artSrc(bgId);im.className="kb kb"+(i%3);bg.appendChild(im);
 requestAnimationFrame(()=>im.classList.add("on"));[...bg.children].slice(0,-2).forEach(x=>x.remove());
 speak(b[1],b[0]);}
function spNow(){return Math.min(spDur(),(Date.now()-sp.t0)*sp.speed+(sp.base||0))}
function spTick(){if(!sp)return;cancelAnimationFrame(sp.raf);
 const loop=()=>{if(!sp||sp.done)return;const tt=spNow(),k=segAt(tt);if(k!==sp.i)spShow(k,tt-sp.segs[k].at);
  const f=$("#spFill"),kn=$("#spKnob"),t0=$("#spT0");const p=tt/spDur()*100;if(f)f.style.width=p+"%";if(kn)kn.style.left=p+"%";if(t0)t0.textContent=fmtT(tt);
  if(tt>=spDur()){spEnd();return}sp.raf=requestAnimationFrame(loop)};sp.raf=requestAnimationFrame(loop)}
function spSeek(ms){sp.base=Math.max(0,Math.min(spDur()-1,ms));sp.t0=Date.now();sp.done=false;$("#spEnd").innerHTML="";const k=segAt(sp.base);spShow(k,sp.base-sp.segs[k].at);spTick()}
function spEnd(){sp.done=true;cancelAnimationFrame(sp.raf);const last=sp.segs[sp.segs.length-1];if(!last.cliff)speak(sp.cliff,"n");scoreDuck(false);
 const pw=wd(sp.wid);if(pw&&pw.pack){$("#spEnd").innerHTML='<div class="end"><div class="eyebrow" style="color:var(--gold)">'+t("hk.end")+'</div><p class="pitch" style="margin-top:8px">'+esc(Lz(pw.hook))+'</p>'+
  '<h3 style="margin-top:12px;font-size:19px">'+t("hk.upToYou")+'</h3><button class="btn btn-p btn-block" style="margin-top:12px" data-spx="1" data-pkstart="'+pw.id+'">'+t("hk.enter")+'</button>'+
  '<p class="xs dim" style="text-align:center;margin-top:6px">'+t("hk.enterS")+'</p><div class="row" style="margin-top:10px"><button class="btn btn-g btn-sm grow" data-spx="1" data-story="'+pw.id+'">'+t("hk.details")+'</button><button class="btn btn-q" data-spx="1">'+t("sv.leave")+'</button></div></div>';return}
 const nx=eps(sp.wid)[sp.ep];
 $("#spEnd").innerHTML='<div class="end"><div class="eyebrow" style="color:var(--gold)">EP '+sp.ep+' · '+t("sv.end")+'</div><p class="pitch" style="margin-top:8px">'+esc(sp.cliff)+'</p>'+
  (nx&&!epUnlocked(sp.wid,sp.ep+1)?'<button class="btn btn-p btn-block" style="margin-top:12px" data-spep="'+(sp.ep+1)+'">🔓 '+t("pay.nextEp")+'</button><button class="btn btn-q btn-block" data-paysheet="1">'+t("pay.plusAll")+'</button>':"")+
  '<button class="btn btn-p btn-block" style="margin-top:14px" data-spin="1">'+t("sv.stepin")+'</button><p class="xs dim" style="text-align:center;margin-top:6px">'+t("sv.stepS")+'</p>'+
  '<div class="row" style="margin-top:10px">'+(nx?'<button class="btn btn-g btn-sm grow" data-spep="'+(sp.ep+1)+'">▶ EP '+(sp.clipMode?sp.segs.length+1:sp.ep+1+sp.off)+' · '+esc(Lz(nx.t))+(epUnlocked(sp.wid,sp.ep+1)?"":" · 💎 2")+'</button>':'<button class="btn btn-g btn-sm grow" data-spnext="1">'+t("sv.next")+'</button>')+
  '<button class="btn btn-q" data-spx="1">'+t("sv.leave")+'</button></div></div>'}
function spClose(){if(!sp)return;cancelAnimationFrame(sp.raf);stopVoice();scoreStop();const v=$("#spVid");if(v){v.pause();v.removeAttribute("src")}sp=null;$(".shortp")&&$(".shortp").remove()}

/* ---------- score: a continuous generated soundtrack under each episode (replaced by a delivered track later) ---------- */
const MOODS={ice:{root:57,bpm:70,prog:[[0,"m"],[-4,"M"],[3,"M"],[-2,"M"]]},crimson:{root:50,bpm:56,prog:[[0,"m"],[-2,"M"],[-4,"M"],[-5,"m"]]},made:{root:48,bpm:64,prog:[[0,"m"],[-4,"M"],[-7,"m"],[-5,"M"]]},
 pole:{root:52,bpm:88,prog:[[0,"m"],[-4,"M"],[-2,"M"],[3,"M"]]},fourth:{root:55,bpm:84,prog:[[0,"M"],[5,"M"],[-3,"m"],[7,"M"]]},unseelie:{root:50,bpm:58,prog:[[0,"m"],[1,"M"],[-2,"M"],[0,"m"]]},
 pact:{root:53,bpm:80,prog:[[0,"M"],[-3,"m"],[5,"M"],[7,"M"]]},night:{root:52,bpm:60,prog:[[0,"m"],[3,"M"],[-2,"M"],[-4,"M"]]},light:{root:55,bpm:66,prog:[[0,"M"],[4,"m"],[-3,"m"],[5,"M"]]},split:{root:54,bpm:92,prog:[[0,"m"],[-4,"M"],[3,"M"],[-2,"M"]]}};
let SC=null;
function scoreStart(wid){scoreStop();if(S.music===false)return;try{
 const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ac=new AC(),m=MOODS[wid]||MOODS.ice;
 const master=ac.createGain();master.gain.value=0;master.connect(ac.destination);master.gain.linearRampToValueAtTime(.13,ac.currentTime+2.5);
 const conv=ac.createConvolver(),len=ac.sampleRate*3,buf=ac.createBuffer(2,len,ac.sampleRate);for(let c=0;c<2;c++){const d=buf.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6)}conv.buffer=buf;
 const wet=ac.createGain();wet.gain.value=.55;conv.connect(wet);wet.connect(master);
 const lp=ac.createBiquadFilter();lp.type="lowpass";lp.frequency.value=1100;lp.connect(master);lp.connect(conv);
 const hz=n=>440*Math.pow(2,(n-69)/12),bar=60/m.bpm*4;let k=0,next=ac.currentTime+.1;
 const tones=(r,q)=>[r,r+(q==="m"?3:4),r+7];
 const sched=()=>{while(next<ac.currentTime+bar*1.5){const [o,q]=m.prog[k%m.prog.length],r=m.root+o,ns=tones(r,q);
   ns.concat([r-12]).forEach(n=>{const os=ac.createOscillator(),g=ac.createGain();os.type="triangle";os.frequency.value=hz(n);os.detune.value=(Math.random()-.5)*8;
    g.gain.setValueAtTime(0,next);g.gain.linearRampToValueAtTime(.09,next+1.2);g.gain.setValueAtTime(.09,next+bar-1);g.gain.linearRampToValueAtTime(0,next+bar+.6);os.connect(g);g.connect(lp);os.start(next);os.stop(next+bar+.7)});
   const step=bar/8;for(let j=0;j<8;j++){if(Math.random()<.35)continue;const n=ns[(j*2+k)%3]+12+(j%4===3?12:0),at=next+j*step,os=ac.createOscillator(),g=ac.createGain();os.type="sine";os.frequency.value=hz(n);
    g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(.05,at+.01);g.gain.exponentialRampToValueAtTime(.0005,at+step*2.5);os.connect(g);g.connect(conv);g.connect(master);os.start(at);os.stop(at+step*2.6)}
   next+=bar;k++}};
 sched();SC={ac,master,iv:setInterval(sched,400)};}catch(e){SC=null}}
function spMuSync(){const m=$("#spMu");if(m)m.textContent=SC?"🎵":"🔇"}
function scoreDuck(on){if(!SC)return;const g=SC.master.gain,n=SC.ac.currentTime;g.cancelScheduledValues(n);g.setValueAtTime(g.value,n);g.linearRampToValueAtTime(on?.06:.13,n+.6)}
function scoreStop(){if(!SC)return;const s=SC;SC=null;clearInterval(s.iv);try{s.master.gain.linearRampToValueAtTime(0,s.ac.currentTime+.6);setTimeout(()=>s.ac.close(),800)}catch(_){}}

document.addEventListener("click",e=>{
 if(!sp)return;let x;
 if(e.target.closest("[data-spx]")||e.target.closest("[data-spx2]")){spClose();return}
 if(e.target.closest("[data-spsave]")){sp.saved=!sp.saved;if(sp.saved)S.saved.unshift({short:sp.wid,txt:Lz(wd(sp.wid).title)+" · EP "+sp.ep,who:"n",at:Date.now()});else S.saved=S.saved.filter(y=>y.short!==sp.wid);save();toast(sp.saved?t("msg.saved"):"—");return}
 if(e.target.closest("[data-spmusic]")){if(SC){scoreStop();S.music=false}else{S.music=true;scoreStart(sp.wid);const g=sp.segs[sp.i];if(g&&g.clip)scoreDuck(true)}save();spMuSync();toast(SC?"🎵 "+t("sp.music"):"🔇");return}
 if(e.target.closest("[data-spspeed]")){const n=sp.speed===1?1.5:sp.speed===1.5?2:1;const cur=spNow();sp.speed=n;sp.base=cur;sp.t0=Date.now();const v=$("#spVid");if(v)v.playbackRate=n;$("#spSpd").textContent=n+"x";return}
 if(e.target.closest("[data-speps]")){const list=eps(sp.wid);let rows="",n0=0;
  if(sp.clipMode){rows=sp.segs.map((g,k)=>'<button class="opt" data-spseg="'+k+'"><span class="ic">'+(k===sp.i?"▶":"🎬")+'</span><span class="grow"><b>EP '+(k+1)+'</b><span>'+esc(g.b[1])+'</span></span><span class="pill">0:08</span></button>').join("");n0=sp.segs.length-sp.ep}else n0=sp.off;
  rows+=list.map((ep,i)=>{const n=i+1;if(sp.clipMode&&n<=sp.ep)return "";const un=epUnlocked(sp.wid,n),shown=(!sp.clipMode&&n===1&&sp.off)?"1–"+(sp.off+1):n+(n>1?n0:0);
   return '<button class="opt" data-spep="'+n+'"><span class="ic">'+(!sp.clipMode&&n===sp.ep?"▶":un?"✓":"🔒")+'</span><span class="grow"><b>EP '+shown+' · '+esc(Lz(ep.t))+'</b><span>'+esc(Lz(ep.cliff))+'</span></span>'+(un?"":'<span class="pill">💎 '+PRICES.ep+'</span>')+'</button>'}).join("");
  sheet('<h2>'+t("sp.eps")+'</h2><p class="xs faint" style="margin-top:4px">'+esc(Lz(wd(sp.wid).title))+'</p><div class="stack" style="margin-top:8px">'+rows+
   '<div class="opt locked"><span class="ic">⏳</span><span class="grow"><b>EP '+(list.length+n0+1)+'</b><span>'+t("sp.soon")+'</span></span></div></div>');return}
 if(x=e.target.closest("[data-spseg]")){closeSheet();spSeek(sp.segs[+x.dataset.spseg].at);return}
 if(x=e.target.closest("[data-spep]")){closeSheet();openShort(sp.wid,+x.dataset.spep);return}
 if(x=e.target.closest("#spBar")){const r=x.getBoundingClientRect();spSeek((e.clientX-r.left)/r.width*spDur());return}
 if(e.target.closest("[data-spnext]")){toast(t("sp.soon"));return}
 if(e.target.closest("[data-spin]")){const w=wd(sp.wid),now=Date.now(),upto=sp.done?sp.beats.length:Math.min(sp.beats.length,Math.max(1,sp.i+1));
  const seen=sp.beats.slice(0,upto);
  const th={id:"w:"+w.id+":"+now,kind:w.kind==="ensemble"?"group":"story",wid:w.id,cast:w.cast.slice(),title:Lz(w.title)+" · EP "+sp.ep,msgs:[],love:{},rounds:0,status:{time:Lz(w.status.time),place:Lz(w.status.place),mood:{}},tasks:{},
   mem:["The user just watched episode "+sp.ep+" (\""+sp.title+"\"): "+seen.map(b=>(b[0]==="n"?"":ch(b[0]).n+": ")+b[1]).join(" / ")+(sp.done?" / "+sp.cliff:"")],created:now,at:now,persona:Object.assign({},persona())};
  w.cast.forEach(c=>th.love[c]=5+ (sp.ep-1)*15);seen.forEach(([wh,x2])=>th.msgs.push({who:wh,k:wh==="n"?"act":"say",txt:x2,at:now}));if(sp.done)th.msgs.push({who:"n",k:"act",txt:sp.cliff,at:now});
  S.threads[th.id]=th;save();spClose();openThread(th.id);return}
 if(e.target.closest("[data-spadv]")&&!e.target.closest("#spBar")){if(sp.done)return;const k=sp.i+1;if(k>=sp.segs.length){spSeek(spDur()-1);return}spSeek(sp.segs[k].at)}});
document.addEventListener("click",e=>{const x=e.target.closest("[data-short]");if(x&&!e.target.closest(".shortp"))openShort(x.dataset.short)});

/* ================= STORIES VIEWER (Instagram-style) ================= */
let sv=null;
function openSV(cid){const posts=feedPosts(),ids=[...new Set(posts.map(p=>p.who))];sv={ids,i:Math.max(0,ids.indexOf(cid))};svRender()}
function svRender(){const cid=sv.ids[sv.i],c=ch(cid),p=feedPosts().find(q=>q.who===cid);S.feedSeen[cid]=1;save();
 let el=$(".sv");if(!el){el=document.createElement("div");el.className="sv";$("#dev").appendChild(el)}
 el.innerHTML='<div class="ph"><img src="'+artSrc(cid)+'" alt=""></div><div class="shade" style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.55),transparent 25%,transparent 55%,rgba(0,0,0,.85))"></div>'+
  '<div class="segs">'+sv.ids.map((_,i)=>'<i class="'+(i<sv.i?"past":i===sv.i?"on":"")+'"><b></b></i>').join("")+'</div>'+
  '<div class="top" style="position:relative;z-index:2;display:flex;gap:10px;align-items:center;padding:10px 12px">'+avatar(cid,32)+'<b class="sm grow" data-char="'+cid+'">'+esc(c.n)+' <span class="xs" style="opacity:.6;font-weight:600">'+ago(p.at)+'</span></b><button class="ibtn" data-svx="1" style="background:rgba(0,0,0,.4)">'+ic("x")+'</button></div>'+
  '<button class="tapL" data-svp="-1" aria-label="previous"></button><button class="tapR" data-svp="1" aria-label="next"></button>'+
  '<p class="capt">'+esc(Lz(p.cap))+'</p><div class="rep"><input id="svIn" placeholder="'+esc(t("post.reply",{n:first(c.n)}))+'"><button class="send" data-svsend="'+cid+'">'+ic("send")+'</button></div>';
 clearTimeout(sv.tm);sv.tm=setTimeout(()=>svGo(1),3600);}
function svGo(d){if(!sv)return;sv.i+=d;if(sv.i<0)sv.i=0;if(sv.i>=sv.ids.length){svClose();return}svRender()}
function svClose(){if(!sv)return;clearTimeout(sv.tm);sv=null;$(".sv")&&$(".sv").remove();if(!$("#s-main").hidden)renderTab(S.lastTab)}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-sv]")){openSV(x.dataset.sv);return}
 if(!sv)return;
 if(e.target.closest("[data-svx]")){svClose();return}
 if(x=e.target.closest("[data-svp]")){svGo(+x.dataset.svp);return}
 if(x=e.target.closest("[data-svsend]")){const v=($("#svIn").value||"").trim();if(!v)return;const cid=x.dataset.svsend;svClose();sendDM(cid,v);return}
 if(e.target.closest("[data-char]")&&sv){svClose()}});
document.addEventListener("focusin",e=>{if(e.target.id==="svIn"&&sv)clearTimeout(sv.tm)});

document.addEventListener("click",async e=>{const x=e.target.closest("[data-livetest]");if(!x)return;
 const res=$("#liveRes");if(res)res.textContent=t("live.pending");x.disabled=true;
 const r=await liveTest();x.disabled=false;
 const msg=r.ok?"✓ "+t("live.ok"):liveWhy(r.code)+(r.msg?" — "+r.msg:"");
 if(res)res.textContent=msg;toast(msg);});
/* ================= START ================= */
["ja","ko","es"].forEach(mergeLang);
function startApp(){renderMain();show("s-main")}
/* boot moved to app9_ads.js (last part) so every later module is loaded first */

/* ================= SOCIAL SHARE =================
   One share sheet for everything: a quest ranking, a chat line, a generated image, a comment.
   Builds a 4:5 share card (the format X / Instagram / Threads show best), then:
   system share (with the image, on phones) · X · Facebook · Reddit · WhatsApp · Threads · Telegram · save image · copy. */
let DL=undefined;(async()=>{try{DL=window.claude&&claude.use?(await claude.use("downloads"))||null:null}catch(_){DL=null}})();
const SH={};
function shareURL(kind,id){return "https://miru.app/s/"+kind+"/"+encodeURIComponent(id)+"?ref="+encodeURIComponent((me()||"you").toLowerCase())}
function wrapTxt(x,txt,maxW){const out=[];let line="";const toks=/[　-鿿가-힯぀-ヿ]/.test(txt)?[...txt]:String(txt).split(/(\s+)/);
 for(const w0 of toks){if(line&&x.measureText(line+w0).width>maxW){out.push(line.trim());line=""}line+=w0}if(line.trim())out.push(line.trim());return out}
async function shareCard(o){const W0=1080,H0=1350,cv=document.createElement("canvas");cv.width=W0;cv.height=H0;const x=cv.getContext("2d");
 x.fillStyle="#0C0B10";x.fillRect(0,0,W0,H0);
 try{const im=await loadImg(o.bg);const s=Math.max(W0/im.width,H0/im.height),dw=im.width*s,dh=im.height*s;x.drawImage(im,(W0-dw)/2,o.photo?(H0-dh)/2:Math.min(0,(H0-dh)*.2),dw,dh)}catch(_){}
 let g=x.createLinearGradient(0,o.photo?H0*.55:H0*.25,0,H0);g.addColorStop(0,"rgba(12,11,16,0)");g.addColorStop(1,"rgba(12,11,16,.96)");x.fillStyle=g;x.fillRect(0,0,W0,H0);
 x.fillStyle="rgba(12,11,16,.55)";x.fillRect(0,0,W0,120);
 x.font="600 44px Georgia, serif";x.fillStyle="#F4EFF5";x.textAlign="left";x.fillText("MI",56,78);const mw=x.measureText("MI").width;x.fillStyle="#EE6F97";x.fillText("RU",56+mw,78);
 if(o.tag){x.font="800 26px -apple-system, 'PingFang SC', sans-serif";x.fillStyle="#F0B77E";x.textAlign="right";x.fillText(o.tag.toUpperCase(),W0-56,76);x.textAlign="left"}
 let y=H0-90;x.font="600 26px -apple-system, 'PingFang SC', sans-serif";x.fillStyle="rgba(255,255,255,.6)";x.fillText(o.foot||"miru.app",56,y);
 if(o.quote){x.font="600 50px -apple-system, 'PingFang SC', 'Noto Sans SC', sans-serif";const ls=wrapTxt(x,"“"+o.quote+"”",W0-112).slice(0,6);y-=60+ (ls.length-1)*66;const y0=y;x.fillStyle="#fff";ls.forEach((l,i)=>x.fillText(l,56,y0+i*66));y=y0-40}
 else y-=50;
 if(o.big){x.font="800 120px -apple-system, sans-serif";x.fillStyle="#F0B77E";x.fillText(o.big,56,y);y-=140}
 if(o.title){x.font="600 40px Georgia, 'Songti SC', serif";x.fillStyle="#F4EFF5";const ls=wrapTxt(x,o.title,W0-112).slice(0,2);ls.reverse().forEach(l=>{x.fillText(l,56,y);y-=52})}
 if(o.who){x.font="800 28px -apple-system, sans-serif";x.fillStyle="#EE6F97";x.fillText(o.who.toUpperCase(),56,y);}
 return cv}
async function openShare(o){SH.o=o;SH.blob=null;SH.url=null;const link=o.link||"https://miru.app";const text=o.text||"";
 const P=[["x","X","https://twitter.com/intent/tweet?text="+encodeURIComponent(text)+"&url="+encodeURIComponent(link)],["fb","Facebook","https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(link)],
  ["rd","Reddit","https://www.reddit.com/submit?url="+encodeURIComponent(link)+"&title="+encodeURIComponent(text.slice(0,280))],["wa","WhatsApp","https://wa.me/?text="+encodeURIComponent(text+" "+link)],
  ["th","Threads","https://www.threads.net/intent/post?text="+encodeURIComponent(text+" "+link)],["tg","Telegram","https://t.me/share/url?url="+encodeURIComponent(link)+"&text="+encodeURIComponent(text)]];
 sheet('<h2>'+t("shr.h")+'</h2><div id="shPrev" class="shprev"><div class="spin"></div></div>'+
  '<div class="shgrid">'+(navigator.share?'<button data-shsys="1"><i class="sys">⇪</i><span>'+t("shr.more")+'</span></button>':"")+
  P.map(([k,l,u])=>'<a href="'+esc(u)+'" target="_blank" rel="noopener"><i class="'+k+'">'+{x:"𝕏",fb:"f",rd:"r",wa:"✆",th:"@",tg:"➤"}[k]+'</i><span>'+l+'</span></a>').join("")+
  '<button data-shsave="1"><i class="sv">↓</i><span>'+t("shr.save")+'</span></button><button data-shcopy="1"><i class="cp">⧉</i><span>'+t("shr.copy")+'</span></button></div>'+
  '<p class="xs faint" style="margin-top:10px;line-height:1.5">'+t("shr.ig")+'</p>');
 try{const cv=await shareCard(o);const pv=$("#shPrev");let url=null;try{url=cv.toDataURL("image/jpeg",.86)}catch(_){}
  SH.url=url;if(url)cv.toBlob(b=>{SH.blob=b},"image/jpeg",.88);if(pv){pv.innerHTML="";if(url)pv.innerHTML='<img src="'+url+'" alt="">';else{cv.style.width="100%";pv.appendChild(cv)}}}catch(_){}}
document.addEventListener("click",async e=>{let x;
 if(e.target.closest("[data-shsys]")&&SH.o){const o=SH.o;try{const f=SH.blob?new File([SH.blob],"miru.jpg",{type:"image/jpeg"}):null;
   const d={title:"MIRU",text:o.text||"",url:o.link};if(f&&navigator.canShare&&navigator.canShare({files:[f]}))d.files=[f];await navigator.share(d)}catch(_){}return}
 if(e.target.closest("[data-shsave]")&&SH.o){if(!SH.blob&&!SH.url){toast(t("img.wait"));return}const name="miru_"+Date.now()+".jpg";
  if(DL&&SH.blob){try{await DL.save({filename:name,data:SH.blob});return}catch(_){}}
  try{const a=document.createElement("a");a.href=SH.url;a.download=name;document.body.appendChild(a);a.click();a.remove();toast(t("shr.saved"))}catch(_){toast(t("shr.hold"))}return}
 if(e.target.closest("[data-shcopy]")&&SH.o){const s=(SH.o.text||"")+" "+(SH.o.link||"");try{await navigator.clipboard.writeText(s);toast(t("sh.copied"))}catch(_){const ta=document.createElement("textarea");ta.value=s;document.body.appendChild(ta);ta.select();try{document.execCommand("copy");toast(t("sh.copied"))}catch(__){}ta.remove()}return}
 /* entry points */
 if(x=e.target.closest("[data-shq]")){const w=wd(x.dataset.shq),b=qBoard(w),m=b.find(r=>r.me)||null;
  openShare({tag:t("q.task"),title:Lz(w.quest.qtitle),big:m?"#"+m.rk:"TOP 10",quote:m?t("shr.qme",{n:m.rk,p:fmtN(m.pt),c:first(ch(m.cid).n)}):t("shr.qtop",{c:first(ch(b[0].cid).n)}),bg:artSrc(w.cover?w.id:w.cast[0]),
   foot:t("q.upd"),text:m?t("shr.qtxt",{n:m.rk,q:Lz(w.quest.qtitle)}):t("shr.qtxt2",{q:Lz(w.quest.qtitle)}),link:shareURL("q",w.id)});return}
 if(x=e.target.closest("[data-shline]")){const th=S.threads[curT],m=th&&th.msgs[+x.dataset.shline];if(!m)return;const c=ch(m.who),w=th.wid?wd(th.wid):null;
  openShare({tag:w?Lz(w.title):"",who:c?c.n:"",title:"",quote:m.txt,bg:artSrc(m.who||th.cast[0]),text:(c?first(c.n)+": ":"")+"“"+m.txt+"” — MIRU",link:shareURL("m",th.id+"-"+x.dataset.shline)});return}
 if(x=e.target.closest("[data-shimg]")){const a=S.album.find(y=>y.id===x.dataset.shimg);if(!a)return;const c=ch(a.cid);
  openShare({photo:1,tag:c?c.n:"",bg:a.src||artSrc(a.cid),quote:a.cap||"",text:t("shr.imgtxt",{c:c?first(c.n):""}),link:shareURL("i",a.id)});return}
 if(x=e.target.closest("[data-shcm]")){const [wid,i]=x.dataset.shcm.split("|"),cm=COMMENTS[+i],w=wd(wid);if(!cm)return;
  openShare({tag:w?Lz(w.title):"",who:cm[0],quote:cm[1],bg:w?artSrc(w.cover?w.id:w.cast[0]):"",text:cm[0]+": “"+cm[1]+"”",link:shareURL("c",wid+"-"+i)});return}
 if(e.target.closest("[data-imgshare]")&&IMG.cv){const c=ch(IMG.m.who);openShare({photo:1,tag:c?c.n:"",bg:IMG.url||artSrc(IMG.m.who),quote:"",text:t("shr.imgtxt",{c:c?first(c.n):""})+" “"+IMG.m.txt+"”",link:shareURL("i",Date.now())});return}});

/* a created world gets its own AI cover (FLUX), so it doesn't look like a collage */
async function wdCover(wid,place,cast){if(!AIG||!AIG.mcp)return;
 const ppl=cast.slice(0,4).map(id=>{const c=ch(id);return (fem(c)?"a woman":"a man")+" ("+String((c.looks&&c.looks.en)||"").replace(/scar[^,.]*[,.]?/gi,"").slice(0,70)+")"}).join(", ");
 const prompt=("Cinematic vertical movie poster still, ensemble romance drama. "+cast.length+" attractive adults gathered in "+(/[　-鿿]/.test(place)?"a dramatic night setting":place)+": "+ppl+". Moody practical lighting, rich color, 35mm, shallow depth of field. No text, no letters, no logo.").slice(0,600);
 try{const res=await AIG.mcp.callTool(AIG.srv,AIG.tool,{prompt,width:576,height:1024,num_inference_steps:24,randomize_seed:true},{cache:false});const src=aiImgFrom(res);if(!src||!/^data:/.test(src))return;
  const im=await loadImg(src),cv=document.createElement("canvas");cv.width=480;cv.height=Math.round(480*im.height/im.width);cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);
  S.art[wid]=cv.toDataURL("image/jpeg",.78);const w=S.mine.worlds[wid];if(w)w.cover=true;save();if(curStory===wid&&$("#s-story")&&!$("#s-story").hidden)openStory(wid,true)}catch(_){}}
Object.assign(I18N.en,{"voice.aiBtn":"AI voice","voice.my":"My voice","voice.myS":"Record a short clip of your own voice — saved only on this device.",
 "voice.rec":"Record (12s)","voice.stop":"Stop","voice.recHint":"Tap to record, up to 12 seconds",
 "voice.del":"Delete","voice.noMic":"Couldn't access the microphone — check your browser permissions.","voice.saved":"Voice clip saved to this device.",
 "acct.h":"Account","acct.email":"Linked email","acct.pw":"Password","acct.none":"Not set","acct.pwSet":"Password set","acct.edit":"Edit ›",
 "acct.emailS":"The email linked to this account (demo — stored on this device only).","acct.save":"Save","acct.badEmail":"That doesn't look like a valid email.","acct.saved":"Saved.",
 "acct.pwS":"Set or change your password (demo — stored on this device only).","acct.pwNew":"New password","acct.pwConfirm":"Confirm password","acct.pwShort":"Password must be at least 6 characters.","acct.pwMismatch":"Passwords don't match."});
Object.assign(I18N.zh,{"voice.aiBtn":"AI 生成语音","voice.my":"我的声音","voice.myS":"录一小段你自己的声音——只保存在本机。",
 "voice.rec":"录音（12秒）","voice.stop":"停止","voice.recHint":"点击开始录音，最长 12 秒",
 "voice.del":"删除","voice.noMic":"无法访问麦克风——请检查浏览器权限设置。","voice.saved":"录音已保存到本机。",
 "acct.h":"账号设置","acct.email":"绑定邮箱","acct.pw":"登录密码","acct.none":"未设置","acct.pwSet":"已设置密码","acct.edit":"修改 ›",
 "acct.emailS":"账号绑定的邮箱（演示功能——仅保存在本机）。","acct.save":"保存","acct.badEmail":"邮箱格式不正确。","acct.saved":"已保存。",
 "acct.pwS":"设置或修改登录密码（演示功能——仅保存在本机）。","acct.pwNew":"新密码","acct.pwConfirm":"确认密码","acct.pwShort":"密码至少需要 6 位。","acct.pwMismatch":"两次输入的密码不一致。"});
Object.assign(I18N.en,{"rx.aiPick":"AI idea","rx.aiOffline":"Turn on live AI (Me tab) for a smarter idea — picked a random one for now.","rx.aiFail":"Couldn't get an AI suggestion this time.",
 "rx.ideaH":"AI idea","rx.ideaUse":"Use this","rx.ideaAgain":"Another",
 "rx.coverGo":"AI-generate a cover","rx.coverGoing":"Painting a cover…","rx.coverAgain":"Generate another cover"});
Object.assign(I18N.zh,{"rx.aiPick":"AI 给灵感","rx.aiOffline":"开启「我的」页里的实时 AI 可以想得更准——这次先随机给了一个。","rx.aiFail":"这次没能拿到 AI 建议。",
 "rx.ideaH":"AI 灵感","rx.ideaUse":"用这个","rx.ideaAgain":"换一个",
 "rx.coverGo":"AI 生成封面图","rx.coverGoing":"正在生成封面…","rx.coverAgain":"换一张封面"});
Object.assign(I18N.en,{"voice.studioS":"Real AI-generated speech — edit the line, then generate.","voice.studioLine":"Line to speak","voice.studioGo":"Generate voice","voice.studioGoing":"Generating…"});
Object.assign(I18N.zh,{"voice.studioS":"真实 AI 语音生成——改好台词再生成。","voice.studioLine":"要说的台词","voice.studioGo":"生成语音","voice.studioGoing":"正在生成…"});
Object.assign(I18N.en,{"f.trait":"Personality tags (optional)","f.traitGong":"Top (攻)","f.traitShou":"Bottom (受)",
 "rx.fmt":"Publish as","rx.fmtText":"Text only","rx.fmtImg":"With AI cover","rx.fmtVid":"With AI video",
 "rx.fmtVidSoon":"Video covers are coming soon — needs public image hosting for the video model first. Pick text or image for now."});
Object.assign(I18N.zh,{"f.trait":"性格标签（选填）","f.traitGong":"攻","f.traitShou":"受",
 "rx.fmt":"发布格式","rx.fmtText":"纯文字版","rx.fmtImg":"AI 封面图版","rx.fmtVid":"AI 视频版",
 "rx.fmtVidSoon":"视频封面还在开发——视频模型需要先打通公网图床。先选文字版或图片版发布吧。"});
Object.assign(I18N.en,{"cre.topicH":"This week's theme","cre.topicS":"Tap to start a remix built around this theme — themed works get pinned to the top of Discover this week.",
 "cre.lv1":"New creator","cre.lv2":"Rising creator","cre.lv3":"Top creator","cre.stat":"{o} original · {r} remix"});
Object.assign(I18N.zh,{"cre.topicH":"本周创作主题","cre.topicS":"点一下，直接带着这个主题去二创——带主题标签的作品本周会被优先推上发现页。",
 "cre.lv1":"新人创作者","cre.lv2":"人气创作者","cre.lv3":"王牌创作者","cre.stat":"{o} 部原创 · {r} 部二创"});

Object.assign(I18N.en,{"voice.rec2":"His own recorded voice","voice.wrongG":"no matching voice on this device","voice.needM":"This device has no male voice for this language, so he'll sound wrong. iPhone: Settings → Accessibility → Spoken Content → Voices → pick the language → download a male voice (e.g. Chinese: Li-Mu; English: Aaron or Nathan). Then reopen this page.","voice.needF":"This device has no female voice for this language. iPhone: Settings → Accessibility → Spoken Content → Voices → download one, then reopen this page."});
Object.assign(I18N.zh,{"voice.rec2":"专属录音声线","voice.wrongG":"本机没有对应性别的声音","voice.needM":"这台手机没有中文男声，所以男角色都会用「婷婷」的女声来读。iPhone：设置 → 辅助功能 → 朗读内容 → 声音 → 中文（普通话）→ 下载「李牧」（选「增强版」更自然）。下载后重新打开本页，每个男角色就会换成男声。","voice.needF":"这台手机没有中文女声。iPhone：设置 → 辅助功能 → 朗读内容 → 声音 → 中文 → 下载一个女声，然后重新打开本页。"});

function voiceLabel97(v){return String(v&&v.name||"").replace(/\s*\(.*\)/,"").replace(/^(Microsoft|Google|Apple)\s+/i,"").replace(/\s+-\s+.*$/,"").replace(/\s+(Online|Natural|Neural)$/i,"").trim()||"—"}
