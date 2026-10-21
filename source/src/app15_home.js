/* ================= HOME (vertical short-drama feed) · DISCOVER · STORY PAGE · ONBOARDING PICKS =================
   Home   = one full-screen story at a time, swipe up for the next; mood tabs across the top.
   Discover = shelves (each tag with its own row), rankings, challenges and Earn; search + tag filters one tap away.
   The catalog is the 36 official story packs (+ community worlds in Discover). */
const FEED_TABS=[["foryou",T("For You","为你推荐")],["hot",T("Hot","热门")],["sweet",T("Sweet","甜宠")],["rivals",T("Rivals","宿敌")],["dark",T("Dark","暗黑")],
 ["fantasy",T("Fantasy","奇幻")],["slow",T("Slow Burn","慢热")],["second",T("Second Chance","破镜重圆")],["ensemble",T("Ensemble","群像")]];
let feedTab="foryou",feedObs=null,feedSound=true;
function packWorlds(){return W.filter(w=>w.pack)}
function hotRank(){return packWorlds().slice().sort((a,b)=>b.stats[0]-a.stats[0]).map(w=>w.id)}
function heatFit(w){const o=["fluff","slow","steamy","mature"];return 3-Math.abs(o.indexOf(w.heat)-o.indexOf(S.heat))}
function recScore(w){return tasteScore(w)+heatFit(w)*6+((S.favs||{})[w.id]?20:0)}
function feedList(k){const all=packWorlds();let ws=all.filter(orOK);
 if(k==="hot")return ws.sort((a,b)=>b.stats[0]-a.stats[0]);
 if(k==="foryou")return ws.sort((a,b)=>recScore(b)-recScore(a));
 let L=ws.filter(w=>(w.tabs||[]).includes(k));if(!L.length)L=all.filter(w=>(w.tabs||[]).includes(k));
 return L.sort((a,b)=>recScore(b)-recScore(a))}
function lastRun(wid){return Object.values(S.threads).filter(th=>th.wid===wid&&th.pk).sort((a,b)=>b.at-a.at)[0]}
function orPill(w){return w.kind==="ensemble"?'<span class="fp or ens">'+t("st.ensemble")+'</span>':'<span class="fp or '+w.or+'">'+(w.or==="bl"?"BL":w.or==="gl"?"GL":"M/F")+'</span>'}
function fCard(w,i,top){const cl=CLIPS[w.id+":1"],c0=cl&&cl[Object.keys(cl)[0]],run=lastRun(w.id),fav=(S.favs||{})[w.id],rk=top.indexOf(w.id);
 const bg=c0?'<video class="fvid" loop playsinline preload="none" poster="'+artSrc(w.cover?w.id:w.cast[0])+'" data-src="'+vidSrc(c0.src)+'"></video>':
  '<img class="fimg'+(w.cover?"":" duo")+'" src="'+artSrc(w.cover?w.id:w.cast[0])+'" alt="">'+(!w.cover&&w.cast[1]?'<img class="fimg2" src="'+artSrc(w.cast[1])+'" alt="">':"");
 return '<section class="fcard" data-fw="'+w.id+'">'+bg+'<div class="fveil"></div>'+
  '<div class="fside">'+(SHORTS[w.id]?'<button data-short="'+w.id+'" aria-label="hook"><i>▶</i><small>'+t("hf.hook")+'</small></button>':'')+
   '<button data-remix="'+w.id+'" aria-label="remix"><i>⑂</i><small>'+t("hf.remix")+'</small></button><button data-fshare="'+w.id+'" aria-label="share"><i>⇪</i><small>'+t("hf.share")+'</small></button></div>'+
  '<div class="finfo fmin"><div class="frow"><button class="ftitle" data-story="'+w.id+'">'+esc(Lz(w.title))+'<small>'+(w.kind==="ensemble"?"":w.or==="bl"?" · BL":w.or==="gl"?" · GL":"")+' ›</small></button><button class="fheart'+(fav?" on":"")+'" data-fav="'+w.id+'" aria-label="save">'+(fav?"♥":"♡")+'</button></div></div></section>'}
function renderHome(v){
 const ws=feedList(feedTab),top=hotRank();
 v.innerHTML='<div class="feedwrap"><div class="ftabs"><div class="ftabsc" id="ftabsc">'+FEED_TABS.map(([k,l])=>'<button data-ftab="'+k+'" class="'+(feedTab===k?"on":"")+'">'+esc(L(l))+'</button>').join("")+'</div>'+
  '<button class="ftico" data-fsound="1" aria-label="sound">'+(feedSound?"🔊":"🔇")+'</button><button class="ftico" data-tab="discover" aria-label="search">'+ic("disc")+'</button></div>'+
  '<div class="feed" id="feed">'+(ws.length?ws.map((w,i)=>fCard(w,i,top)).join(""):'<p class="empty" style="padding-top:120px">'+t("disc.none")+'</p>')+'</div></div>';
 const on=$('[data-ftab].on');if(on)on.scrollIntoView({inline:"center",block:"nearest"});
 feedWire()}
function feedWire(){const feed=$("#feed");if(!feed)return;if(feedObs)feedObs.disconnect();
 feedObs=new IntersectionObserver(es=>es.forEach(en=>{const v=en.target.querySelector("video");if(!v)return;
  if(en.isIntersecting&&en.intersectionRatio>.6){if(!v.src)v.src=v.dataset.src;v.muted=!feedSound;const p=v.play();p&&p.catch&&p.catch(()=>{v.muted=true;v.play().catch(()=>{})})}else v.pause()}),{root:feed,threshold:[0,.6,1]});
 feed.querySelectorAll(".fcard").forEach(c=>feedObs.observe(c))}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-fsound]")){feedSound=!feedSound;x.textContent=feedSound?"🔊":"🔇";$$(".fvid").forEach(v=>v.muted=!feedSound);return}
 if(feedSound&&e.target.closest(".fcard")){$$(".fvid").forEach(v=>{if(v.muted&&!v.paused)v.muted=false})}
 if(x=e.target.closest("[data-ftab]")){feedTab=x.dataset.ftab;renderHome($("#tabv"));return}
 if(x=e.target.closest("[data-fav]")){const id=x.dataset.fav;S.favs=S.favs||{};S.favs[id]=!S.favs[id];if(!S.favs[id])delete S.favs[id];save();x.classList.toggle("on",!!S.favs[id]);x.textContent=S.favs[id]?"♥":"♡";toast(S.favs[id]?t("hf.saved"):t("hf.unsaved"));return}
 if(x=e.target.closest("[data-fmore]")){x.classList.toggle("open");return}
 if(x=e.target.closest("[data-fshare]")){const w=wd(x.dataset.fshare);shareSheet({id:w.id,kind:"story",title:Lz(w.title)});if(typeof taskClaimDay==="function"&&taskClaimDay("share",1))setTimeout(()=>toast(t("task.gotShare")),300);return}});

/* ---------- DISCOVER ---------- */
let discChip="main",discSearch=false;
const DISC_CHIPS=[["main",T("Featured","精选")],["rank",T("Rankings","排行")],["quest",T("Challenges","挑战")],["earn",T("Earn 💎","赚钻石")]];
function rCard(w){const run=lastRun(w.id);return '<button class="rcard" data-story="'+w.id+'"><div class="rart"><img src="'+artSrc(w.cover?w.id:w.cast[0])+'" alt="" loading="lazy">'+
 (w.pack?'<span class="rbadge">'+(owns(w.id)?"✓":PCN(w)+" ch")+'</span>':'')+(run&&run.pk?'<span class="rprog"><i style="width:'+(run.pk.ch/PCN(w)*100)+'%"></i></span>':'')+'</div>'+
 '<b>'+esc(Lz(w.title))+'</b><span>'+fmtN(w.stats?w.stats[0]:0)+' · '+esc(w.author||"")+'</span></button>'}
function shelf(title,ws,more){if(!ws.length)return "";return '<div class="shelf"><div class="shd"><h3>'+title+'</h3>'+(more?'<button data-dchip="'+more+'" aria-label="more">›</button>':"")+'</div><div class="rail2">'+ws.map(rCard).join("")+'</div></div>'}
function discActive(){return Object.values(disc.sel).flat().length>0||!!disc.q}
function tagBar(){const rows=[["genre","disc.genre",TAGS.genre],["setting","disc.setting",TAGS.setting],["trope","disc.trope",TAGS.trope],["char","disc.char",TAGS.char],["gong","f.traitGong",GS_TAGS.gong],["shou","f.traitShou",GS_TAGS.shou]];
 const nm=(r,x)=>r==="gong"||r==="shou"?(typeof gsName==="function"?gsName(x):x):tagName(x);
 return '<div class="dfilt"><div class="seg dor" id="orSeg">'+[["all","disc.all"],["bl","ob.bl"],["gl","ob.gl"],["bg","ob.bg"]].map(([k,l])=>'<button data-orf="'+k+'" class="'+(S.or===k?"on":"")+(k==="bl"?" blt":"")+'">'+t(l)+'</button>').join("")+'</div>'+
  rows.map(([r,lb,L])=>'<div class="tagrow"><b>'+t(lb)+'</b><div class="hs">'+L.map(x=>'<button class="chip'+((disc.sel[r]||[]).includes(x)?" on":"")+'" data-dtag="'+r+'|'+esc(x)+'">'+esc(nm(r,x))+'</button>').join("")+'</div></div>').join("")+'</div><div id="discRes"></div>'}
function discSync(){const b=$("#htabBody");if(b)b.style.display=discActive()?"none":"";renderDiscRes()}
document.addEventListener("click",e=>{if(e.target.closest("[data-dtag]")||e.target.closest("[data-dclear]"))setTimeout(()=>{if($("#htabBody"))discSync()},0)});
document.addEventListener("input",e=>{if(e.target.id==="discQ")setTimeout(()=>{if($("#htabBody"))discSync()},0)});
function discMain(){const fy=feedList("foryou");
 const tagsHot=["Slow Burn","Rivals to Lovers","Second Chance","Dark Romance","Romantasy","Cozy","Grumpy x Sunshine","Found Family","Fake Dating","Forbidden","Sci-Fi","Small Town","Hockey","Vampires","Ghosts","Bakery"];
 const u=uState(),comm=allWorlds().filter(w=>!w.official&&orOK(w));
 let h='';
 h+='<button class="dbanner" data-dchip="earn"><span class="dbi">✦</span><span class="grow"><b>'+t("dc.bannerH",{n:unitsLeft()})+'</b><span>'+t("dc.bannerS")+'</span></span><span>›</span></button>';
 h+=shelf(t("dc.picked"),fy.slice(0,10),"");
 h+=shelf(t("dc.trending"),feedList("hot").slice(0,10),"");
 const favs=packWorlds().filter(w=>(S.favs||{})[w.id]);if(favs.length)h+=shelf("♥ "+t("dc.saved"),favs,"");
 const playing=packWorlds().filter(w=>lastRun(w.id)).sort((a,b)=>lastRun(b.id).at-lastRun(a.id).at);if(playing.length)h+=shelf(t("dc.playing"),playing,"");
 h+=shelf(t("dc.new"),packWorlds().filter(w=>w.isNew&&orOK(w)),"new");
 FEED_TABS.slice(2).forEach(([k,l])=>{h+=shelf(esc(L(l)),feedList(k).slice(0,12),k)});
 h+=comm.length?shelf(t("dc.community"),comm.slice(0,12),"community"):'<div class="shelf"><div class="shd"><h3>'+t("dc.community")+'</h3></div><button class="dbanner" data-cre="remix"><span class="dbi">⑂</span><span class="grow"><b>'+t("dc.makeH")+'</b><span>'+t("dc.makeS")+'</span></span><span>›</span></button></div>';
 return h}
function discBody(){
 if(discChip==="main")return discMain();
 if(discChip==="rank"){homeTab="rank";return homeTabBody()}
 if(discChip==="quest"){homeTab="quest";return homeTabBody()}
 if(discChip==="earn"){homeTab="earn";return '<div class="pad" style="padding-top:12px"><div class="card ucard"><div class="row"><div class="grow"><b>✦ '+t("u.left",{n:unitsLeft()})+'</b><p class="xs faint" style="margin-top:3px">'+t("dc.unitsS")+'</p></div><button class="btn btn-g btn-sm" data-units="1">'+t("dc.manage")+'</button></div></div></div>'+homeTabBody()}
 let ws;
 if(discChip==="new")ws=packWorlds().filter(w=>w.isNew);
 else if(discChip==="community")ws=allWorlds().filter(w=>!w.official);
 else ws=feedList(discChip);
 if(!ws.length)return '<p class="empty">'+(discChip==="community"?t("dc.makeS"):t("disc.none"))+'</p>'+(discChip==="community"?'<div class="pad"><button class="btn btn-p btn-block" data-cre="remix">⑂ '+t("dc.makeH")+'</button></div>':'');
 return '<div class="grid2" style="padding-top:12px;padding-bottom:24px">'+ws.map(sCard).join("")+'</div>'}
function renderDiscover(v){
 if(discSearch){renderDiscSearch(v);return}
 v.innerHTML='<div class="topbar dtop"><div class="dmode">'+[["stories","disc.stories"],["chars","disc.chars"]].map(([k,l])=>'<button data-dmode2="'+k+'" class="'+(disc.mode===k?"on":"")+'">'+t(l)+'</button>').join("")+'</div><div class="grow"></div>'+
  '<button class="ibtn" data-dsearch="1" aria-label="search">'+ic("disc")+'</button><button class="chip num" data-paysheet="1">💎 '+S.keys+'</button></div>'+
  (disc.mode==="chars"?'<div class="scroll" id="discScroll"><div class="search" style="margin-top:4px"><span class="faint">'+ic("disc").replace('<svg','<svg style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.8"')+'</span><input id="discQ" value="'+esc(disc.q)+'" placeholder="'+esc(t("g.searchChar"))+'"></div><div id="discRes"></div></div>':
  '<div class="dchips">'+DISC_CHIPS.map(([k,l])=>'<button data-dchip="'+k+'" class="'+(discChip===k?"on":"")+'">'+esc(L(l))+'</button>').join("")+'</div>'+
  '<div class="scroll" id="discScroll">'+tagBar()+'<div id="htabBody"'+(discActive()?' style="display:none"':'')+'>'+discBody()+'</div><div style="height:24px"></div></div>');
 if(disc.mode==="chars"||discActive())renderDiscRes();
 const on=$("[data-dchip].on");if(on)on.scrollIntoView({inline:"center",block:"nearest"})}
/* full search with tag filters (the previous Discover) */
function renderDiscSearch(v){const rows=["genre","setting","trope"];
 v.innerHTML='<div class="topbar"><button class="ibtn" data-dsearchx="1">'+ic("back")+'</button><h1 style="font-size:22px" class="grow">'+t("dc.searchH")+'</h1><div class="seg" id="orSeg">'+[["all","disc.all"],["bl","ob.bl"],["gl","ob.gl"],["bg","ob.bg"]].map(([k,l])=>'<button data-orf="'+k+'" class="'+(S.or===k?"on":"")+'">'+t(l)+'</button>').join("")+'</div></div>'+
  '<div class="scroll" id="discScroll"><div class="search"><span class="faint">'+ic("disc").replace('<svg','<svg style="width:16px;height:16px;stroke:currentColor;fill:none;stroke-width:1.8"')+'</span><input id="discQ" value="'+esc(disc.q)+'" placeholder="'+esc(t("disc.search"))+'"></div>'+
  '<div class="tagrows" style="margin-top:6px">'+rows.map(r=>'<div class="tagrow"><b>'+t("disc."+r)+'</b><div class="hs">'+TAGS[r].map(x=>'<button class="chip'+((disc.sel[r]||[]).includes(x)?" on":"")+'" data-dtag="'+r+'|'+esc(x)+'">'+esc(tagName(x))+'</button>').join("")+'</div></div>').join("")+
   '<div class="tagrow"><b>'+t("disc.char")+'</b><div class="hs">'+TAGS.char.map(x=>'<button class="chip'+((disc.sel.char||[]).includes(x)?" on":"")+'" data-dtag="char|'+esc(x)+'">'+esc(tagName(x))+'</button>').join("")+'</div></div>'+
  '</div><div id="discRes"></div></div>';
 disc.mode="stories";renderDiscRes()}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-dchip]")){discChip=x.dataset.dchip;discSearch=false;disc.mode="stories";if(S.lastTab!=="discover"){renderTab("discover");show("s-main")}else renderDiscover($("#tabv"));const sc=$("#discScroll");if(sc)sc.scrollTop=0;return}
 if(x=e.target.closest("[data-dmode2]")){disc.mode=x.dataset.dmode2;disc.q="";renderDiscover($("#tabv"));return}
 if(x=e.target.closest("[data-dsearch]")){discSearch=true;disc.q="";renderTab("discover");show("s-main");if(x.dataset.dsearch==="1")setTimeout(()=>{const q=$("#discQ");q&&q.focus()},60);return}
 if(e.target.closest("[data-dsearchx]")){discSearch=false;disc.sel={genre:[],setting:[],trope:[],char:[],gong:[],shou:[]};disc.q="";renderDiscover($("#tabv"));return}
 if(x=e.target.closest("[data-dtagq]")){const tg=x.dataset.dtagq;disc.sel={genre:[],setting:[],trope:[],char:[],gong:[],shou:[]};disc.q="";const r=Object.keys(TAGS).find(k=>TAGS[k].includes(tg));if(r)disc.sel[r]=[tg];discSearch=true;renderTab("discover");show("s-main");return}
 if(x=e.target.closest("[data-htab2]")){discChip=x.dataset.htab2==="rank"?"rank":x.dataset.htab2==="earn"?"earn":"quest";discSearch=false;renderTab("discover");show("s-main");return}});
/* older entry points (home chips / search) now land on Discover's search */
document.addEventListener("click",e=>{if(e.target.closest("[data-htag]")||e.target.closest("[data-hsearch]")){discSearch=true}},true);

/* ---------- STORY PAGE for a story pack ---------- */
function storyPage(id,keep){const w=wd(id);curStory=id;if(!keep)storyTab="intro";const P=w.pack,ps=(S.packs||{})[id]||{end:{}},run=lastRun(id),own=owns(id);
 let h='<button class="ibtn backbtn" data-back="1">'+ic("back")+'</button><div class="scroll"><div class="hero">'+img(w.cover?w.id:w.cast[0])+'<div class="veil"></div>'+
  '<div class="cap"><div class="eyebrow" style="color:var(--gold)">'+(w.kind==="ensemble"?t("st.ensemble"):w.or==="bg"?"M/F":w.or.toUpperCase())+' · '+t("pk.chN",{n:PCN(w)})+(w.isNew?' · NEW':'')+'</div>'+
  '<h1 style="margin-top:6px">'+esc(Lz(w.title))+'</h1><p class="sm dim" style="margin-top:6px;line-height:1.5">'+esc(Lz(w.hook))+'</p></div></div>'+
  '<div class="pad"><div class="row" style="margin-top:10px"><span class="sm" style="font-weight:700">'+esc(w.author)+'</span><button class="chip'+((S.favs||{})[id]?" on":"")+'" data-fav="'+id+'">'+((S.favs||{})[id]?"♥":"♡")+'</button><div class="grow"></div>'+
  '<div class="stats"><span>💬 '+fmtN(w.stats[0])+'</span><span>♥ '+fmtN(w.stats[1])+'</span><span>🏁 '+endingsFound(id)+'/3</span></div></div>'+
  '<div class="row wrap" style="gap:6px;margin-top:12px">'+(w.tags||[]).map(x=>'<span class="tag" data-dtagq="'+esc(x)+'">#'+esc(tagName(x))+'</span>').join("")+'</div></div>'+
  '<div class="tabs" style="margin-top:14px">'+[["intro","st.intro"],["chapters","sp.chapters"],["cast","st.cast"],["comments","st.comments"]].map(([k,l])=>'<button data-stab="'+k+'" class="'+(storyTab===k?"on":"")+'">'+t(l)+'</button>').join("")+'</div><div class="pad stack" style="gap:12px;padding-block:14px 20px">';
 if(storyTab==="intro"){
  h+='<p style="font-size:14.5px;line-height:1.7">'+esc(Lz(P.logline))+'</p><p class="sm dim" style="line-height:1.7">'+esc(Lz(w.premise))+'</p>'+
   '<div class="card warn"><div class="eyebrow">'+t("st.warn")+'</div><p class="sm" style="margin-top:8px;line-height:1.6">'+esc(Lz(w.warn))+'</p></div>'+
   '<div class="eyebrow" style="margin-top:4px">'+t("sp.ways")+'</div><div class="stack" style="gap:6px">'+packModes(w).map(m=>'<div class="task"><span class="ck">'+(m.as==="watch"?"👁":m.as==="side"?"🚪":"▶")+'</span><span class="grow"><b class="sm">'+esc(packAsName(w,m.as))+'</b><span class="xs faint" style="display:block">'+esc(Lz(m.t))+'</span></span></div>').join("")+'</div>'+
   '<div class="eyebrow" style="margin-top:4px">'+t("st.rel")+'</div><div class="reltable">'+(w.rel||[]).map(([a,b,r])=>'<div><b>'+esc(a==="you"?me():first(ch(a).n))+' × '+esc(b==="you"?me():first(ch(b).n))+'</b><span>'+esc(Lz(r))+'</span></div>').join("")+'</div>'+
   '<div class="eyebrow" style="margin-top:4px">'+t("sp.inside")+'</div><div class="feats">'+[["game","🎮"],["date","🌙"],["gift","🎁"],["photo","📷"],["voice","🎙"],["room","🏠"]].map(([k,i])=>'<div><span>'+i+'</span><b>'+t("sp.f."+k)+'</b><p>'+esc(Lz(P.features[k]))+'</p></div>').join("")+'</div>'+
   '<div class="card"><div class="eyebrow">🎬 '+t("sp.dirH")+'</div><ul class="dlist">'+P.director.allowed.map(x=>'<li>'+esc(Lz(x))+'</li>').join("")+'</ul><div class="eyebrow" style="margin-top:10px">⑂ AU</div><ul class="dlist">'+P.director.au.map(x=>'<li>'+esc(Lz(x))+'</li>').join("")+'</ul>'+
    '<button class="btn btn-g btn-sm" style="margin-top:10px" data-remix="'+id+'">⑂ '+t("st.remix")+'</button></div>'+
   '<div class="card bonusc"><div class="eyebrow" style="color:var(--gold)">✦ '+t("pk.bonus")+'</div><b style="display:block;margin-top:6px">'+esc(Lz(P.bonus.t))+'</b><p class="xs dim" style="margin-top:4px;line-height:1.5">'+esc(Lz(P.bonus.d))+'</p><button class="btn btn-g btn-sm" style="margin-top:8px" data-pkbonus="'+id+'">'+t("pk.inProd")+' · '+t("pk.notify")+'</button></div>'+
   ''}
 if(storyTab==="chapters"){
  h+=(own?'<div class="card"><b class="sm">✓ '+t("pk.owned")+'</b><p class="xs faint" style="margin-top:4px">'+t("sp.ownedS")+'</p></div>':
   '<div class="card buyc"><div class="row"><div class="grow"><b>'+t("sp.packH",{m:PCN(w)})+'</b><p class="xs dim" style="margin-top:4px;line-height:1.5">'+t("sp.packS",{n:PACK_UNITS})+'</p></div><button class="btn btn-p btn-sm" data-pkbuy="'+id+'">💎 '+PACK_PRICE+'</button></div></div>')+
   '<div class="chlist">'+P.chapters.map((c,i)=>{const n=i+1,lock=chLocked(id,n),done=run&&run.pk&&(run.pk.picks[n]||run.pk.ch>n),cur=run&&run.pk&&run.pk.ch===n;
    const op=typeof chOpen==="function"?chOpen(id,n):!lock;return '<button class="chrow spch'+(cur?" cur":"")+'" data-chto="'+id+'|'+n+'"><span class="chn num">'+(done?"✓":n)+'</span><div class="grow"><b>'+esc(Lz(c.t))+'</b><p>'+esc(Lz(c.goal))+'</p></div>'+(op?'<span class="chf">▶ '+(cur?LL("当前","Now"):LL("进入","Play"))+'</span>':'<span class="chl">🔒 💎'+(typeof jumpPrice==="function"?jumpPrice(n):"")+'</span>')+'</button>'}).join("")+'</div>'+
   '<div class="eyebrow" style="margin-top:6px">🏁 '+t("sp.endings")+'</div><div class="endl">'+["A","B","C"].map(k=>{const got=(ps.end||{})[k],e=P.endings[k];return '<div class="'+(got?"got":"")+'"><b>'+k+'</b><span>'+(got?esc(Lz(e.t)):"???")+'</span></div>'}).join("")+'</div>'+
   '<p class="xs faint" style="line-height:1.5">'+t("sp.endRule",{n:Math.min(ENDING_NEED,PCN(w)-1),m:PCN(w)-1})+'</p>'}
 if(storyTab==="cast")h+='<div class="grid2" style="padding:0">'+w.cast.map(cid=>{const au=P.au&&P.au[cid];return au?'<button class="gcard" data-char="'+cid+'">'+img(cid,"art")+'<div class="b"><b>'+esc(ch(cid).n)+'</b><p class="s">'+esc(Lz(au))+'</p></div></button>':cCard(cid)}).join("")+'</div>';
 if(storyTab==="comments")h+='<p class="xs faint">'+t("st.sample")+'</p>'+COMMENTS.map(([u,c],i)=>'<div class="comment"><div class="av">'+esc(u[1].toUpperCase())+'</div><div class="grow"><b class="xs">'+esc(u)+'</b><p class="sm" style="margin-top:3px;line-height:1.5">'+esc(c)+'</p></div></div>').join("");
 h+='</div></div><div class="startbar"><div class="row" style="gap:8px">'+(SHORTS[id]?'<button class="btn btn-g" data-short="'+id+'">▶ '+t("hf.hook")+'</button>':'')+
  (run?'<button class="btn btn-g" style="flex:none;padding-inline:16px" data-pkrestart="'+id+'" aria-label="restart">⟲ '+t("hf.restartS")+'</button>':'')+'<button class="btn btn-p grow" data-pkstart="'+id+'">'+(run?'▶ '+t("hf.cont",{n:run.pk.ch}):'💬 '+t("hf.start"))+'</button></div></div>';
 screen("s-story",h);show("s-story")}

/* ---------- ONBOARDING: step 5 = stories picked from what they chose ---------- */
let obRec=0;
const OB_N=3,OB_HEAT=["fluff","slow","steamy","mature"];
function obMatch(w){const tr=S.tropes||[],hits=(w.tags||[]).filter(x=>tr.includes(x)),hd=Math.abs(OB_HEAT.indexOf(w.heat)-OB_HEAT.indexOf(S.heat)),orx=S.or&&S.or!=="all"&&w.or===S.or;
 const sc=hits.length*30+(S.heat?(hd===0?26:hd===1?9:-12):0)+(orx?18:0)+(w.cover?6:0)+Math.log10(w.stats?w.stats[0]:10)+((S.favs||{})[w.id]?20:0);
 const pct=Math.max(76,Math.min(99,70+hits.length*9+(S.heat&&hd===0?9:hd===1?3:0)+(orx?4:0)+Math.round(Math.log10(w.stats?w.stats[0]:10))));
 const why=hits.slice(0,3).map(x=>tagName(x));if(S.heat&&hd===0)why.push(t("heat."+S.heat));
 return {w,sc,pct,why}}
function obRecs(){const L=packWorlds().filter(orOK).map(obMatch).sort((a,b)=>b.sc-a.sc);
 /* keep the three picks different: no two with the exact same lead pair of tags */
 const out=[],seen=new Set();for(const m of L){const k=(m.w.tags||[]).slice(0,2).join("|");if(seen.has(k)&&L.length>OB_N*2)continue;seen.add(k);out.push(m);if(out.length===OB_N)break}
 out.forEach((m,i)=>{if(i)m.pct=Math.min(m.pct,out[i-1].pct-1-(i===1?1:0))});return out}
function obCast(w){return '<div class="ob2cast">'+(w.cast||[]).filter(id=>ch(id)).slice(0,3).map(id=>'<span>'+avatar(id,26)+'<b>'+esc(first(ch(id).n))+'</b></span>').join("")+'</div>'}
function obRecHTML(){const L=obRecs(),m0=L[0];if(!m0)return '<div class="obrec"><button class="btn btn-p" data-obskip="1">'+t("obr.skip")+'</button></div>';
 const mine=[S.or&&S.or!=="all"?t("ob."+S.or):"",...(S.tropes||[]).slice(0,3).map(tagName),S.heat?t("heat."+S.heat):""].filter(Boolean);
 const w=m0.w;
 return '<div class="ob2">'+
  '<div class="ob2hd"><div class="eyebrow" style="color:var(--gold)">✦ '+t("obr.ey")+'</div><h1>'+t("obr.h2",{n:L.length})+'</h1>'+
   (mine.length?'<div class="ob2mine">'+mine.map(x=>'<em>'+esc(x)+'</em>').join("")+'</div>':'')+'</div>'+
  '<button class="ob2hero" data-obgo="'+w.id+'"><img src="'+artSrc(w.cover?w.id:w.cast[0])+'" alt=""><div class="ob2veil"></div>'+
   '<span class="ob2badge">'+t("obr.best")+' · '+m0.pct+'%</span>'+
   '<div class="ob2cap"><h2>'+esc(Lz(w.title))+'</h2><p class="ob2hook">“'+esc(Lz(w.hook))+'”</p>'+
   (m0.why.length?'<div class="ob2why">'+m0.why.map(x=>'<i>✓ '+esc(x)+'</i>').join("")+'</div>':'')+obCast(w)+'</div></button>'+
  '<button class="btn btn-p btn-block ob2go" data-obgo="'+w.id+'">▶ '+t("obr.go")+'<small>'+t("obr.free")+'</small></button>'+
  (L.length>1?'<div class="ob2sec">'+t("obr.also")+'</div><div class="ob2list">'+L.slice(1).map(m=>'<button class="ob2row" data-obgo="'+m.w.id+'"><img src="'+artSrc(m.w.cover?m.w.id:m.w.cast[0])+'" alt=""><div class="grow"><div class="row" style="gap:6px;justify-content:space-between"><b>'+esc(Lz(m.w.title))+'</b><span class="ob2pct">'+m.pct+'%</span></div><p>'+esc(Lz(m.w.hook))+'</p>'+(m.why.length?'<div class="ob2why sm">'+m.why.slice(0,2).map(x=>'<i>✓ '+esc(x)+'</i>').join("")+'</div>':'')+'</div></button>').join("")+'</div>':'')+
  '<button class="obskip" data-obskip="1">'+t("obr.skip2")+'</button></div>'}
function obRecWire(){}
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-obnext]")){const r=$("#obr");if(!r)return;const n=Math.round(r.scrollLeft/r.clientWidth)+1,max=r.children.length;r.scrollTo({left:(n%max)*r.clientWidth,behavior:"smooth"});return}
 if(e.target.closest("[data-obskip]")){S.ob=true;save();startApp();return}
 if(x=e.target.closest("[data-obgo]")){S.ob=true;save();startApp();startSheet(x.dataset.obgo);return}});

/* ---------- strings ---------- */
Object.assign(I18N.en,{"me.plusS":"250 AI turns a month · long memory · unlimited voice","me.packs":"My stories","me.packsS":"{a} Story Packs owned · {b} endings found","tab.discover":"Discover","hf.hook":"Hook","hf.remix":"Remix","hf.share":"Share","hf.start":"Start the story","hf.cont":"Continue · Chapter {n}","hf.saved":"Saved","hf.unsaved":"Removed from saved",
 "dc.bannerH":"{n} free AI turns waiting","dc.bannerS":"Chapters 1–2 of every story are free · earn diamonds here","dc.picked":"Picked for you","dc.trending":"Trending now","dc.tags":"Tags","dc.saved":"Saved",
 "dc.playing":"Keep playing","dc.new":"New stories","dc.community":"From the community","dc.makeH":"Make your own version","dc.makeS":"Remix any story — new AU, new ending, your cast.",
 "dc.searchH":"Search","dc.unitsS":"Shared by every story · official choices never use them","dc.manage":"Manage",
 "sp.chapters":"Chapters","sp.ways":"Ways to play","sp.inside":"Inside this story","sp.f.game":"Game","sp.f.date":"Date","sp.f.gift":"Gift","sp.f.photo":"Photos","sp.f.voice":"Voice","sp.f.room":"Keepsakes",
 "sp.dirH":"What you can direct","sp.ownedS":"Every chapter, every ending, replay anything.","sp.packH":"Story Pack · chapters 3–{m}","sp.packS":"All three endings, chapter replay, +{n} AI turns. One-time purchase.",
 "sp.free":"Free","sp.endings":"Endings","sp.endRule":"Ending A needs at least {n} honest steps in chapters 1–{m}. B and C are always open — none of them is a punishment.",
 "obr.h":"Picked for you","obr.s":"{n} stories chosen from what you told us","obr.start":"Start","obr.skip":"Skip and go home","obr.ey":"Your matches","obr.h2":"{n} stories made for you","obr.best":"Best match","obr.go":"Start Chapter 1","obr.free":"Chapters 1–2 free","obr.also":"Also right up your alley","obr.skip2":"Not now — show me everything",
 "hk.end":"THE HOOK","hk.upToYou":"What happens next is up to you.","hk.enter":"Enter the story","hk.enterS":"Chapters 1–2 free · watch, or play as one of them","hk.details":"Story details",
 "pay.p1":"250 AI turns every month for free-form play and directing","pay.p2":"Long memory — they remember every key moment","pay.p3":"Unlimited voice read-aloud","pay.p4":"Free calls and 10 AI photos a day","pay.p5":"20 💎 every month + bigger check-in rewards",
 "pay.plusLine":"250 AI turns a month, long memory, unlimited voice.","pay.what":"Story Packs are bought once per story and are yours to keep; MIRU+ is the service on top (AI turns, memory, voice). Diamonds never buy a character's feelings."});
Object.assign(I18N.zh,{"me.plusS":"每月 250 个 AI 回合 · 长记忆 · 无限语音","me.packs":"我的故事","me.packsS":"已拥有 {a} 个故事包 · 已收集 {b} 个结局","tab.discover":"发现","hf.hook":"预告","hf.remix":"二创","hf.share":"分享","hf.start":"开始故事","hf.cont":"继续 · 第 {n} 章","hf.saved":"已收藏","hf.unsaved":"已取消收藏",
 "dc.bannerH":"{n} 个免费 AI 回合等你使用","dc.bannerS":"每个故事第 1–2 章免费 · 在这里赚钻石","dc.picked":"为你精选","dc.trending":"正在热播","dc.tags":"标签","dc.saved":"我的收藏",
 "dc.playing":"继续玩","dc.new":"新上线","dc.community":"来自社区","dc.makeH":"做一个你的版本","dc.makeS":"二创任意故事——新 AU、新结局、你的阵容。",
 "dc.searchH":"搜索","dc.unitsS":"所有故事共用 · 官方选项不消耗","dc.manage":"管理",
 "sp.chapters":"章节","sp.ways":"玩法","sp.inside":"这个故事里有","sp.f.game":"小游戏","sp.f.date":"约会","sp.f.gift":"礼物","sp.f.photo":"照片","sp.f.voice":"语音","sp.f.room":"纪念物",
 "sp.dirH":"你可以导演的","sp.ownedS":"全部章节、全部结局、任意重玩。","sp.packH":"故事包 · 第 3–{m} 章","sp.packS":"三个结局、章节重玩、+{n} 个 AI 回合。一次购买。",
 "sp.free":"免费","sp.endings":"结局","sp.endRule":"结局 A 需要在 1–{m} 章中至少 {n} 次坦诚的选择。B 和 C 随时可选——都不是惩罚。",
 "obr.h":"为你推荐的故事","obr.s":"已根据你的喜好精选 {n} 个故事","obr.start":"开始","obr.skip":"跳过并前往首页","obr.ey":"你的本命剧","obr.h2":"为你挑了 {n} 部","obr.best":"最佳匹配","obr.go":"开始第 1 章","obr.free":"前两章免费","obr.also":"也很对你胃口","obr.skip2":"先不了，去首页逛逛",
 "hk.end":"预告","hk.upToYou":"接下来怎么发展，由你决定。","hk.enter":"进入故事","hk.enterS":"第 1–2 章免费 · 可以旁观，也可以扮演其中一人","hk.details":"故事详情",
 "pay.p1":"每月 250 个 AI 回合，用于自由输入和导演","pay.p2":"长记忆——每个关键时刻都记得","pay.p3":"无限语音朗读","pay.p4":"免费通话，每天 10 张 AI 照片","pay.p5":"每月 20 💎 + 签到奖励加倍",
 "pay.plusLine":"每月 250 个 AI 回合、长记忆、无限语音。","pay.what":"故事包按故事一次购买、永久拥有；MIRU+ 是在此之上的服务（AI 回合、记忆、语音）。钻石永远买不到角色的感情。"});

document.addEventListener("click",e=>{const x=e.target.closest("[data-pkrestart]");if(!x)return;e.stopImmediatePropagation();const wid=x.dataset.pkrestart,run=lastRun(wid);
 startSheet(wid,true)},true);
Object.assign(I18N.en,{"hf.restart":"Start over from Chapter 1","hf.restartS":"Restart"});Object.assign(I18N.zh,{"hf.restart":"从第 1 章重新玩","hf.restartS":"重玩"});
