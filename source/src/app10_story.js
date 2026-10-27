/* ================= STORY LINK LAYER — everything feeds the pair's relationship =================
   总纲: the thing users play is the relationship BETWEEN the two leads. So:
   · pair stages follow the doc: 宿敌 → 动摇 → 心动 → 吃醋 → 占有 → 失控, with "N key events to the next stage"
   · every story game = a key event: bond ↑, +1 clue toward the pair's Relationship Puzzle (6 clues → the truth, a paid reveal), +1 vote
   · entry points live INSIDE the story (chat header chip, 🎮 sheet, end of every episode, character page) — not as a home tab
   · calls: 📞 in every chat header. First call ever = 60 s free; after that MIRU+ or 3 💎 a minute (卡点 #9 特殊电话)            */
REL_ST.length=0;[[0,"rel.s0"],[18,"rel.s1"],[36,"rel.s2"],[54,"rel.s3"],[72,"rel.s4"],[90,"rel.s5"]].forEach(x=>REL_ST.push(x));
const KEY_EV=8;
function pairOf(wid){return BLP.find(b=>b[0]===wid)}
function relNext(p){const v=relV(p),nx=REL_ST.find(([n])=>n>v);return nx?{need:Math.max(1,Math.ceil((nx[0]-v)/KEY_EV)),name:t(nx[1])}:null}
function pairChip(p){const nx=relNext(p);return '<button class="pairchip" data-gcpairgo="'+p[0]+'">'+avatar(p[1],20)+avatar(p[2],20)+'<b>'+relStage(relV(p))+'</b>'+(nx?'<span>'+t("rel.next",{n:nx.need,s:nx.name})+'</span>':'')+'<em>🎮</em></button>'}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-gcpairgo]")){S.gpair=x.dataset.gcpairgo;save();closeSheet();openGameCenter();return}
 if(x=e.target.closest("[data-gcfor]")){S.gpair=x.dataset.gcfor;save();const f={phone:gPhone,asleep:gAsleep,keepsake:gKeep}[x.dataset.gk];if(f)f();else openGameCenter();return}});

/* ---------- clues + relationship puzzle ---------- */
const CLUE_GAMES=["phone","remember","asleep","photo","keepsake","shutter"];
function clues(p){S.clue=S.clue||{};return S.clue[p[0]]||[]}
function gameWin(p,k,bond,why){const r=relAdd(p,bond,why);let got="";
 if(CLUE_GAMES.includes(k)){const c=clues(p);if(!c.includes(k)){c.push(k);S.clue[p[0]]=c;got='<div class="clueget">🧩 '+t("pz.got",{n:c.length})+'</div>'}}
 const v=voteState();v.n+=1;save();
 return got+'<div class="clueget v">🔥 '+t("gc.vote1")+'</div>'}
function puzzleHTML(p){const c=clues(p),A=first(ch(p[1]).n),B=first(ch(p[2]).n),done=(S.pzOpen||{})[p[0]];
 return '<div class="pz"><div class="row" style="gap:8px"><div class="grow"><div class="eyebrow" style="color:var(--gold)">'+t("pz.h")+'</div><b>'+esc(t("pz.q",{a:A,b:B}))+'</b></div><span class="num pzn">'+c.length+'/6</span></div>'+
  '<div class="pzs">'+CLUE_GAMES.map(k=>'<i class="'+(c.includes(k)?"on":"")+'" title="'+t("gc."+k)+'">'+(c.includes(k)?"🧩":"?")+'</i>').join("")+'</div>'+
  (done?'<p class="sm pzt">“'+esc(Lz(ch(p[1]).twist))+'”</p>':c.length>=6?'<button class="btn btn-p btn-block btn-sm" data-pzopen="'+p[0]+'">🔓 '+t("pz.open")+(S.plus?'':' · 💎 '+PRICES.event)+'</button>':'<p class="xs faint">'+t("pz.how")+'</p>')+'</div>'}
document.addEventListener("click",e=>{const x=e.target.closest("[data-pzopen]");if(!x)return;const p=pairOf(x.dataset.pzopen);if(!S.plus&&!spend(PRICES.event,"event"))return;
 S.pzOpen=S.pzOpen||{};S.pzOpen[p[0]]=1;relAdd(p,10,(S.lang==="zh"?"你拼出了真相：":"You pieced together the truth: ")+Lz(ch(p[1]).twist));save();openGameCenter()});

/* ---------- new story games (the rest of the library, BL-skinned) ---------- */
GC.splice(0,GC.length,
 {k:"phone",bg:"night",title:"gc.phone",tag:"Story",font:"'Georgia',serif",c1:"#E9D9FF",c2:"#8E6CF0",sub:"gc.phoneS"},
 {k:"asleep",title:"gc.asleep",tag:"Story",font:"'Georgia',serif",c1:"#DDE8FF",c2:"#5C7CF0",sub:"gc.asleepS"},
 {k:"remember",bg:"crimson",title:"gc.remember",tag:"Story",font:"'Courier New',monospace",c1:"#F2E6D0",c2:"#B0304A",sub:"gc.rememberS"},
 {k:"photo",title:"gc.photo",tag:"Story",font:"'Georgia',serif",c1:"#FFE9D6",c2:"#C9764A",sub:"gc.photoS"},
 {k:"keepsake",title:"gc.keepsake",tag:"Story",font:"'Brush Script MT','Snell Roundhand',cursive",c1:"#FFE3C2",c2:"#D87A4A",sub:"gc.keepsakeS"},
 {k:"shutter",title:"gc.shutter",tag:"Story",font:"'Georgia',serif",c1:"#E6F0FF",c2:"#7C8CF0",sub:"gc.shutterS"},
 {k:"rush",bg:"pact",title:"gc.rush",tag:"Solo",font:"'Brush Script MT','Snell Roundhand',cursive",c1:"#FFE3C2",c2:"#EE6F97",sub:"gc.rushS"},
 {k:"sync",title:"gc.sync",tag:"Solo",font:"'Arial Black',system-ui",c1:"#FFD6E6",c2:"#EE3F7A",sub:"gc.syncS"},
 {k:"order",title:"gc.order",tag:"Solo",font:"'Georgia',serif",c1:"#FFF0D6",c2:"#B8844A",sub:"gc.orderS"},
 {k:"capsule",bg:"ice",title:"gc.capsule",tag:"Daily",font:"'Arial Black',system-ui",c1:"#FFF0B3",c2:"#F08A3C",sub:"gc.capsuleS"},
 {k:"party",bg:"afterhours",title:"gc.party",tag:"Party",font:"'Georgia',serif",c1:"#FFE7A8",c2:"#D8A24A",sub:"gc.partyS"});
gcArt=function(g,p){const m={phone:p[1],asleep:p[2],remember:p[0],photo:"gala",keepsake:p[1],shutter:p[2],rush:p[2],sync:p[1],order:p[2],capsule:p[0],party:"afterhours"};return artSrc(m[g.k]||g.bg||p[1])};
openGameCenter=function(){const p=curPair();
 const h='<div class="gc-hero"><div class="gc-heroimg">'+BLP.slice(0,4).map(b=>'<img src="'+artSrc(b[1])+'" alt="">').join("")+'</div><div class="gc-heroveil"></div><button class="ibtn backbtn" data-back="1">'+ic("back")+'</button>'+
  '<div class="gc-herocap"><h1>GAME CENTER</h1><p>'+t("gc.sub")+'</p></div></div><div class="gc-body"><div class="gc-pair"><div class="eyebrow">'+t("gc.pair")+'</div><div class="gc-pairs">'+BLP.filter(b=>!b[0].includes(":")).map(b=>'<button class="gc-pb'+(b[0]===p[0]?" on":"")+'" data-gcpair="'+b[0]+'">'+avatar(b[1],30)+avatar(b[2],30)+'</button>').join("")+'</div>'+relBar(p)+
  (relNext(p)?'<p class="xs dim" style="margin-top:6px">'+t("rel.next",{n:relNext(p).need,s:relNext(p).name})+'</p>':'')+'</div>'+puzzleHTML(p)+
  '<div class="gc-sec">'+t("gc.secStory")+'</div><div class="gc-grid">'+GC.filter(g=>g.tag==="Story").map(g=>gcCard(g,p)).join("")+'</div>'+
  '<div class="gc-sec">'+t("gc.secMore")+'</div><div class="gc-grid">'+GC.filter(g=>g.tag!=="Story").map(g=>gcCard(g,p)).join("")+'</div></div>';
 screen("s-gc",'<div class="scroll gcscr">'+h+'</div>');show("s-gc");animRel()};
function gcCard(g,p){const has=clues(p).includes(g.k);return '<button class="gc-card" data-gc="'+g.k+'"><div class="gc-poster"><img src="'+gcArt(g,p)+'" alt=""><div class="gc-pv"></div>'+(has?'<span class="gc-done">🧩</span>':'')+'<b class="gc-pt" style="font-family:'+g.font+';background:linear-gradient(180deg,'+g.c1+','+g.c2+');-webkit-background-clip:text;background-clip:text">'+t(g.title)+'</b></div><div class="gc-info"><b>'+t(g.title)+'</b><p>'+esc(t(g.sub,{a:first(ch(p[1]).n),b:first(ch(p[2]).n)}))+'</p><span class="gc-tag '+g.tag.toLowerCase()+'">'+(g.tag==="Story"?"🧩 "+t("gc.clue"):g.tag)+'</span></div></button>'}
document.addEventListener("click",e=>{const x=e.target.closest("[data-gc]");if(!x)return;e.stopImmediatePropagation();const k=x.dataset.gc;
 ({phone:gPhone,rush:gRush,capsule:gCapsule,remember:gRemember,party:gParty,asleep:gAsleep,photo:gPhoto,keepsake:gKeep,shutter:gShutter,sync:gSync,order:gOrder})[k]()},true);
/* results of the old games also count as key events */
gResult=function(p,n,why,extra){const k=(document.querySelector("#s-game h2")||{}).textContent||"",g=GC.find(x=>t(x.title)===k),before=relV(p),add=gameWin(p,g?g.k:"",n,why),el=$("#gRes");if(!el)return;const d=relV(p)-before;
 el.innerHTML='<div class="gres"><div class="eyebrow" style="color:var(--gold)">'+t("gc.result")+'</div>'+(extra||"")+add+relBar(p,before)+'<p class="xs faint" style="margin-top:6px">'+(d>0?"+"+d:"±0")+' · '+t("gc.movesStory")+(relNext(p)?' · '+t("rel.next",{n:relNext(p).need,s:relNext(p).name}):'')+'</p><div class="row" style="gap:8px;margin-top:10px"><button class="btn btn-g grow" data-gcenter="1">'+t("gc.more")+'</button><button class="btn btn-p grow" data-gcstory="'+p[0]+'">'+t("gc.toStory")+'</button></div></div>';animRel();el.scrollIntoView({behavior:"smooth",block:"end"})};
rankRefresh=function(){const b=$("#htabBody");if(b&&homeTab==="rank")b.innerHTML=rankHTML();const c=$("#chRank");if(c&&curChar)c.outerHTML=_charRankCard(curChar)};

/* 6. WAS HE REALLY ASLEEP — read the evidence, name the liar */
function gAsleep(){const p=curPair(),A=first(ch(p[1]).n),B=first(ch(p[2]).n),zh=S.lang==="zh";
 const ev=zh?[["📱",A+" 的手机：02:17 发出一条消息，收件人 "+B+"。"],["🧥",B+" 的外套搭在 "+A+" 的椅背上，还是湿的。"],["⏰",A+" 说他 11 点就睡了。闹钟却被关掉了。"],["🗣",B+"："+"「我一整晚都在自己房间。」"]]:[["📱",A+"'s phone: a text sent at 2:17 AM — to "+B+"."],["🧥",B+"'s jacket is on "+A+"'s chair. Still wet."],["⏰",A+" says he was asleep by 11. His alarm was switched off."],["🗣",B+": “I was in my own room all night.”"]];
 const opts=zh?[[A+" 没睡，"+B+" 也在撒谎",1],["只有 "+A+" 在撒谎",0],["他们都说了实话",0]]:[["Neither was asleep — they're both lying",1],["Only "+A+" is lying",0],["They're both telling the truth",0]];
 gScreen(t("gc.asleep"),'<p class="sm dim" style="padding:0 16px">'+esc(t("gc.asleepHow",{a:A,b:B}))+'</p><div class="ev">'+ev.map(([i,x],j)=>'<button class="evc" data-evc="'+j+'"><i>'+i+'</i><span>'+t("gc.evTap")+'</span><p>'+esc(x)+'</p></button>').join("")+'</div><div class="evq" id="evq"></div><div id="gRes"></div>');
 gAsleep.st={p,opts,seen:0}}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-evc]")){if(x.classList.contains("on"))return;x.classList.add("on");const st=gAsleep.st;st.seen++;if(st.seen===4)$("#evq").innerHTML='<b>'+t("gc.evQ")+'</b>'+st.opts.map((o,i)=>'<button class="btn btn-g btn-block" data-evo="'+i+'">'+esc(o[0])+'</button>').join("");return}
 if(x=e.target.closest("[data-evo]")){const st=gAsleep.st,o=st.opts[+x.dataset.evo];$$("[data-evo]").forEach(b=>b.disabled=true);x.classList.add(o[1]?"ok":"bad");const A=ch(st.p[1]).n,B=ch(st.p[2]).n;
  gResult(st.p,o[1]?9:3,S.lang==="zh"?"你发现那晚 "+A+" 和 "+B+" 都没睡——而且他们在同一个房间。":"You worked out that neither "+A+" nor "+B+" slept that night — and they weren't apart.")}});
/* 7. THE ONE NOT IN THE PHOTO — spot who doesn't belong in their world */
function gPhoto(){const p=curPair(),w=wd(p[0]),own=(w&&w.cast)||[p[1],p[2]],others=allChars().filter(id=>!own.includes(id)&&BLSET.has(id));
 gPhoto.st={p,round:0,ok:0};phRound()}
function phRound(){const st=gPhoto.st,p=st.p,own=[p[1],p[2]],pool=allChars().filter(id=>!own.includes(id)&&ch(id));
 const odd=pool[(hash(p[0]+st.round)%pool.length)],grid=[];for(let i=0;i<5;i++)grid.push(own[i%2]);grid.splice(hash(odd+st.round)%6,0,odd);st.odd=odd;
 gScreen(t("gc.photo"),'<p class="sm dim" style="padding:0 16px">'+esc(t("gc.photoHow",{a:first(ch(p[1]).n),b:first(ch(p[2]).n)}))+' · '+(st.round+1)+'/3</p><div class="pgrid">'+grid.map((id,i)=>'<button class="pgi" data-pgi="'+id+'" style="background-image:url('+artSrc(id)+');background-position:'+(20+i*13%60)+'% '+(15+i*7%30)+'%"></button>').join("")+'</div><div id="gRes"></div>')}
document.addEventListener("click",e=>{const x=e.target.closest("[data-pgi]");if(!x)return;const st=gPhoto.st;const ok=x.dataset.pgi===st.odd;x.classList.add(ok?"ok":"bad");if(ok)st.ok++;st.round++;
 setTimeout(()=>{if(st.round<3)phRound();else{const A=ch(st.p[1]).n,B=ch(st.p[2]).n;gScreen(t("gc.photo"),'<div id="gRes"></div>');gResult(st.p,st.ok*3,S.lang==="zh"?"你在 "+A+" 和 "+B+" 的合照里找出了不该在那儿的人。":"You found who didn't belong in "+A+" and "+B+"'s photos.",'<p class="sm">📸 '+st.ok+' / 3</p>')}},600)});
/* 8. PRIVATE KEEPSAKES — search his room for what he kept */
const KEEP=["🧤","⌚","🎟️","📷","🔑","🧣","🏒","🎧","📓","🕯️","🍷","🌹","🧸","✉️","💍","🩹"];
function gKeep(){const p=curPair(),want=[KEEP[hash(p[0])%16],KEEP[(hash(p[0])+5)%16],KEEP[(hash(p[0])+11)%16]];gKeep.st={p,want,found:[]};const grid=[...KEEP].sort((a,b)=>hash(p[0]+a)-hash(p[0]+b));
 gScreen(t("gc.keepsake"),'<p class="sm dim" style="padding:0 16px">'+esc(t("gc.keepHow",{a:first(ch(p[1]).n),b:first(ch(p[2]).n)}))+'</p><div class="kwant">'+want.map(x=>'<span data-kw="'+x+'">'+x+'</span>').join("")+'</div><div class="kroom" style="background-image:url('+artSrc(p[0])+')"><div class="kveil"></div>'+grid.map((x,i)=>'<button class="kit" data-kit="'+x+'" style="left:'+(6+(i%4)*23+hash(x)%6)+'%;top:'+(6+Math.floor(i/4)*23+hash(x+1)%6)+'%;transform:rotate('+((hash(x)%40)-20)+'deg)">'+x+'</button>').join("")+'</div><div id="gRes"></div>')}
document.addEventListener("click",e=>{const x=e.target.closest("[data-kit]");if(!x||x.disabled)return;const st=gKeep.st,k=x.dataset.kit;
 if(!st.want.includes(k)){x.classList.add("bad");setTimeout(()=>x.classList.remove("bad"),400);return}x.disabled=true;x.classList.add("ok");st.found.push(k);const w=$('[data-kw="'+k+'"]');if(w)w.classList.add("on");
 if(st.found.length===3){const A=ch(st.p[1]).n,B=ch(st.p[2]).n;gResult(st.p,8,S.lang==="zh"?A+" 的房间里留着三样和 "+B+" 有关的东西。他一样都没扔。":A+" kept three things from "+B+". He never threw any of them away.",'<p class="sm">'+st.want.join(" ")+'</p>')}});
/* 9. MEMORY SHUTTER — flip the memory cards, match the moments */
function gShutter(){const p=curPair(),w=wd(p[0]),pics=[p[1],p[2],p[0],(w&&w.cast&&w.cast[2])||BLP[(BLP.indexOf(p)+1)%BLP.length][1]];
 const deck=pics.concat(pics).map((id,i)=>({id,i})).sort((a,b)=>hash(p[0]+a.i+"s")-hash(p[0]+b.i+"s"));gShutter.st={p,deck,open:[],done:0,moves:0,lock:false};
 gScreen(t("gc.shutter"),'<p class="sm dim" style="padding:0 16px">'+esc(t("gc.shutterHow"))+'</p><div class="mgrid">'+deck.map((c,i)=>'<button class="mc" data-mc="'+i+'"><div class="mcf" style="background-image:url('+artSrc(c.id)+')"></div><div class="mcb">📷</div></button>').join("")+'</div><p class="xs faint" style="text-align:center" id="mcm">0</p><div id="gRes"></div>')}
document.addEventListener("click",e=>{const x=e.target.closest("[data-mc]");if(!x)return;const st=gShutter.st;if(st.lock||x.classList.contains("up"))return;x.classList.add("up");st.open.push(+x.dataset.mc);
 if(st.open.length===2){st.moves++;$("#mcm").textContent=st.moves;const [a,b]=st.open;st.open=[];
  if(st.deck[a].id===st.deck[b].id){st.done++;if(st.done===4){const A=ch(st.p[1]).n,B=ch(st.p[2]).n;gResult(st.p,st.moves<=7?9:5,S.lang==="zh"?"记忆快门拼出了 "+A+" 和 "+B+" 第一次见面的那一晚。":"The Memory Shutter pieced together the night "+A+" and "+B+" first met.",'<p class="sm">📷 '+st.moves+' '+t("gc.moves")+'</p>')}}
  else{st.lock=true;setTimeout(()=>{$$('[data-mc="'+a+'"],[data-mc="'+b+'"]').forEach(y=>y.classList.remove("up"));st.lock=false},750)}}});
/* 10. HEARTBEAT SYNC — repeat his heartbeat pattern */
function gSync(){const p=curPair();gSync.st={p,seq:[],i:0,lvl:0,busy:false};
 gScreen(t("gc.sync"),'<p class="sm dim" style="padding:0 16px">'+esc(t("gc.syncHow",{a:first(ch(p[1]).n)}))+'</p><div class="sy"><div class="sy-av">'+avatar(p[1],84)+'<b id="syL">'+t("gc.lvl")+' 1</b></div>'+[0,1,2,3].map(i=>'<button class="syp s'+i+'" data-syp="'+i+'">♥</button>').join("")+'</div><button class="btn btn-p btn-block" style="width:calc(100% - 32px);margin:0 16px" data-sygo="1">▶ '+t("gc.start")+'</button><div id="gRes"></div>')}
function syPlay(){const st=gSync.st;st.busy=true;st.i=0;st.seq.push(Math.floor(Math.random()*4));$("#syL").textContent=t("gc.lvl")+" "+st.seq.length;
 st.seq.forEach((k,j)=>setTimeout(()=>{const b=$('[data-syp="'+k+'"]');b.classList.add("lit");setTimeout(()=>b.classList.remove("lit"),320);if(j===st.seq.length-1)setTimeout(()=>st.busy=false,340)},500+j*560))}
document.addEventListener("click",e=>{let x;const st=gSync.st;if(!st)return;
 if(e.target.closest("[data-sygo]")){e.target.closest("[data-sygo]").remove();st.seq=[];syPlay();return}
 if(x=e.target.closest("[data-syp]")){if(st.busy||!st.seq.length)return;const k=+x.dataset.syp;x.classList.add("lit");setTimeout(()=>x.classList.remove("lit"),180);
  if(k!==st.seq[st.i]){st.busy=true;const n=st.seq.length-1;gResult(st.p,Math.min(9,n*2),S.lang==="zh"?"你和 "+ch(st.p[1]).n+" 的心跳同步了 "+n+" 拍。":"You matched "+ch(st.p[1]).n+"'s heartbeat for "+n+" beats.",'<p class="sm">♥ × '+n+'</p>');st.seq=[];return}
  st.i++;if(st.i===st.seq.length){if(st.seq.length>=6){st.busy=true;gResult(st.p,10,S.lang==="zh"?"完美同步。"+ch(st.p[1]).n+" 的心跳乱了一拍。":"Perfect sync. "+ch(st.p[1]).n+"'s heart skipped.",'<p class="sm">♥ × 6</p>');st.seq=[];return}setTimeout(syPlay,500)}}});
/* 11. HIS ORDER — remember what he orders for the other one */
const ORD={en:["Oat latte","Black coffee","Iced matcha","Hot chocolate","Extra shot","No sugar","Cinnamon","Whipped cream","Two sugars"],zh:["燕麦拿铁","美式","冰抹茶","热可可","加一份浓缩","不加糖","肉桂粉","加奶油","两块糖"]};
function gOrder(){const p=curPair(),L=ORD[S.lang==="zh"?"zh":"en"],want=[L[hash(p[0])%3],L[3+hash(p[1])%3],L[6+hash(p[2])%3]];gOrder.st={p,want,pick:[]};
 gScreen(t("gc.order"),'<p class="sm dim" style="padding:0 16px">'+esc(t("gc.orderHow",{a:first(ch(p[1]).n),b:first(ch(p[2]).n)}))+'</p><div class="ord" id="ord"><div class="ord-note">'+avatar(p[1],40)+'<p>“'+want.join(" · ")+'”</p></div><div class="ord-t" id="ordT">4</div></div><div id="gRes"></div>');
 let s=4;const tk=setInterval(()=>{s--;const e=$("#ordT");if(!e){clearInterval(tk);return}e.textContent=s;if(s<=0){clearInterval(tk);$("#ord").innerHTML='<div class="ordg">'+L.map(x=>'<button data-ord="'+esc(x)+'">'+esc(x)+'</button>').join("")+'</div>'}},1000)}
document.addEventListener("click",e=>{const x=e.target.closest("[data-ord]");if(!x||x.disabled)return;const st=gOrder.st;x.disabled=true;const ok=st.want.includes(x.dataset.ord);x.classList.add(ok?"ok":"bad");st.pick.push(ok);
 if(st.pick.length===3){const n=st.pick.filter(Boolean).length;$$("[data-ord]").forEach(b=>b.disabled=true);gResult(st.p,n*3,S.lang==="zh"?(n===3?"你记住了 "+ch(st.p[1]).n+" 每天替 "+ch(st.p[2]).n+" 点的那杯。":"差一点——"+ch(st.p[2]).n+" 喝了一口，皱了下眉。"):(n===3?"You remembered the exact drink "+ch(st.p[1]).n+" orders for "+ch(st.p[2]).n+".":"Close — "+ch(st.p[2]).n+" took a sip and frowned."),'<p class="sm">☕ '+n+' / 3</p>')}});

/* ---------- chat: 📞 call button + pair chip ---------- */
/* 2026-10-27：从「包 renderChat」搬成钩子（收尾批次）。逻辑原样。 */
const __body_story10 = function () { const th=S.threads[curT];if(!th)return;const hd=$(".chead"),mid=mainOf(th);
 if(hd&&ch(mid)&&!hd.querySelector(".callbtn"))hd.querySelector("[data-cmenu]").insertAdjacentHTML("beforebegin",'<button class="callbtn" data-callgo="'+mid+'">📞<span>'+(S.plus?t("call.btn"):!S.callTrial?t("call.trial"):t("call.btn"))+'</span></button>');
 const p=pairOf(th.wid),stt=$(".status");if(p&&stt&&!stt.querySelector(".pairchip"))stt.insertAdjacentHTML("afterbegin",pairChip(p)) };
if (window.UI && typeof window.UI.add === "function") window.UI.add("story10", __body_story10);
else { const _renderChat = renderChat; renderChat = function () { const r = _renderChat.apply(this, arguments); __body_story10(); return r; }; };
function callGate(cid){if(S.plus){startCall(cid);return}
 if(!S.callTrial){S.callTrial=1;save();startCall(cid,60);return}
 const c=ch(cid);sheet('<div class="eyebrow" style="color:var(--gold)">📞 '+t("call.h")+'</div><h2 style="margin-top:4px">'+esc(t("call.gateH",{n:first(c.n)}))+'</h2><p class="sm dim" style="margin-top:6px">'+t("call.gateS")+'</p>'+
  '<button class="btn btn-p btn-block" style="margin-top:14px" data-callpay="'+cid+'">📞 '+t("call.pay",{p:PRICES.callMin})+'</button><p class="xs faint" style="text-align:center;margin-top:6px">💎 '+S.keys+'</p>'+
  '<button class="plusc mini" data-paysheet="call"><b>MIRU+</b><span>'+t("call.plus")+'</span><em>'+t("pay.trial")+'</em></button>')}
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-callgo]")){callGate(x.dataset.callgo);return}
 if(x=e.target.closest("[data-callpay]")){if(S.keys<PRICES.callMin){paySheet("call");return}closeSheet();startCall(x.dataset.callpay,0,true);return}});
/* billing wrapper around startCall: trial seconds, or PRICES.callMin 💎 per started minute */
const _startCall=startCall;startCall=function(cid,limit,paid){_startCall(cid);if(!call)return;call.limit=limit||0;call.paid=!!paid;call.min=0;
 if(paid){S.keys-=PRICES.callMin;save();call.min=1}
 const cap=document.createElement("div");cap.className="cv-meter";cap.id="cvM";$(".callv").appendChild(cap);
 call.bill=setInterval(()=>{if(!call){return}const s=Math.floor((Date.now()-call.t0)/1000),m=$("#cvM");
  if(call.limit){const left=call.limit-s;if(m)m.textContent=t("call.trialLeft",{s:Math.max(0,left)});if(left<=0){endCall();callGate(cid)}return}
  if(call.paid){if(s>=call.min*60){if(S.keys>=PRICES.callMin){S.keys-=PRICES.callMin;call.min++;save();toast(t("pay.spent",{n:PRICES.callMin,left:S.keys}))}else{endCall();paySheet("call");return}}if(m)m.textContent="💎 "+PRICES.callMin+"/"+t("pay.mo2")+" · "+S.keys}},1000)};
const _endCall=endCall;endCall=function(){if(call&&call.bill)clearInterval(call.bill);_endCall()};
/* incoming story calls go through the same gate */
document.addEventListener("click",e=>{const x=e.target.closest("[data-cardbtn]");if(!x)return;const th=S.threads[curT],m=th&&th.msgs[+x.dataset.cardbtn];if(m&&m.act&&m.act.startsWith("call|")){e.stopImmediatePropagation();callGate(m.act.split("|")[1])}},true);

/* ---------- 🎮 sheet in chat: this pair's games first ---------- */
const _gameHub=gameHub;gameHub=function(){_gameHub();const th=S.threads[curT],p=th&&pairOf(th.wid);if(!p)return;const sh=$(".sheet .gh-gc");if(!sh)return;
 sh.insertAdjacentHTML("afterend",'<div class="gh-pair">'+pairChip(p)+'<div class="gh-quick">'+["phone","asleep","keepsake"].map(k=>'<button data-gcfor="'+p[0]+'" data-gk="'+k+'"><img src="'+gcArt(GC.find(g=>g.k===k),p)+'" alt=""><b>'+t("gc."+k)+'</b></button>').join("")+'</div></div>')};
/* ---------- end of every episode: play this episode's secret ---------- */
const _spEnd=spEnd;spEnd=function(){_spEnd.apply(this,arguments);const p=pairOf(sp.wid),el=$("#spEnd .end");if(p&&el)el.insertAdjacentHTML("beforeend",'<button class="btn btn-g btn-block" style="margin-top:8px" data-gcfor="'+p[0]+'" data-gk="phone">🎮 '+t("gc.epSecret",{a:first(ch(p[1]).n)})+'</button>')};
/* ---------- character page: "who he is to whom" ---------- */
const _charRankCard=charRankCard;charRankCard=function(id){const p=BLP.find(b=>b[1]===id||b[2]===id);let h="";
 if(p){const o=p[1]===id?p[2]:p[1];h='<div class="card relcard"><div class="eyebrow" style="color:var(--gold)">'+t("rel.with")+'</div><div class="row" style="gap:10px;margin-top:6px">'+avatar(o,40)+'<div class="grow"><b>'+esc(ch(o).n)+'</b><p class="xs dim">'+relStage(relV(p))+(relNext(p)?' · '+t("rel.next",{n:relNext(p).need,s:relNext(p).name}):'')+'</p></div><button class="btn btn-g btn-sm" data-gcpairgo="'+p[0]+'">🎮 '+t("rel.push")+'</button></div><div class="relm" style="margin-top:8px"><i style="width:'+relV(p)+'%"></i></div></div>'}
 return h+_charRankCard(id)};

/* ---------- home: world ticker ("what happened in their world today") ---------- */
function worldEvents(){const zh=S.lang==="zh",out=[];BLP.forEach((b,i)=>{const A=first(ch(b[1]).n),B=first(ch(b[2]).n);
 const T=zh?[A+" 删除了一条动态",A+" 和 "+B+" 昨晚吵架了",B+" 等 "+A+" 等到 2:17",A+" 的草稿箱里多了一条消息",B+" 换了头像"]:[A+" deleted a post",A+" and "+B+" had a fight last night",B+" waited up for "+A+" until 2:17",A+" saved a new draft",B+" changed his profile pic"];
 out.push({who:b[1],p:b[0],txt:T[(hash(b[0]+today())+i)%T.length],m:2+hash(b[0])%57})});return out.sort((a,b)=>a.m-b.m)}
function tickerHTML(){const ev=worldEvents();return '<div class="wtk" id="wtk">'+ev.map((e,i)=>'<button class="wtki'+(i?"":" on")+'" data-char="'+e.who+'"><i></i><b>'+esc(e.txt)+'</b><span>'+t("wt.ago",{m:e.m})+'</span></button>').join("")+'</div>'}
function tickerWire(){const w=$("#wtk");if(!w)return;let i=0;clearInterval(tickerWire.t);tickerWire.t=setInterval(()=>{if(!document.body.contains(w)){clearInterval(tickerWire.t);return}const it=w.querySelectorAll(".wtki");it[i].classList.remove("on");i=(i+1)%it.length;it[i].classList.add("on")},3200)}
/* ---------- home: Playroom as a drama-style carousel ---------- */
function prDeck(){const pr=allWorlds().filter(w=>w.kind==="ensemble"&&orOK(w)).sort((a,b)=>(b.mineAt||0)-(a.mineAt||0)||b.cast.length-a.cast.length);
 return '<div class="dkwrap pr"><div class="dk" id="prk">'+pr.map((w,i)=>{const cl=CLIPS[w.id+":1"],c0=cl&&cl[Object.keys(cl)[0]];
  return '<button class="dkc" data-i="'+i+'" data-story="'+w.id+'">'+(c0?'<video class="dkv" muted loop playsinline preload="none" poster="'+artSrc(w.id)+'" data-src="'+vidSrc(c0.src)+'"></video>':((w.cover||S.art[w.id]||w.mine)?'<img class="dkimg" src="'+artSrc(w.id)+'" alt="">':'<div class="dkimg wcast">'+w.cast.slice(0,4).map(id=>'<img src="'+artSrc(id)+'" alt="">').join("")+'</div>'))+
   '<div class="veil"></div><span class="dramab">👥 '+w.cast.length+'</span><div class="cap"><h2>'+esc(Lz(w.title))+'</h2><p>'+esc(Lz(w.hook))+'</p><div class="prav">'+w.cast.slice(0,5).map(id=>avatar(id,22)).join("")+'</div></div></button>'}).join("")+
  '<button class="dkc prnew2" data-i="'+pr.length+'" data-cre="group"><img class="dkimg" src="art/world_new.jpg" alt=""><div class="veil"></div><div class="cap"><h2>＋ '+t("wd.new")+'</h2><p>'+t("wd.newS")+'</p></div></button></div>'+
  '<span class="dkn num" id="prn">1 / '+(pr.length+1)+'</span></div><div class="dkact"><button class="btn btn-p btn-sm" id="prIn" data-story="'+(pr[0]?pr[0].id:"")+'">👥 '+t("pr.enter")+'</button><button class="btn btn-g btn-sm" data-playall="1">'+t("home.seeall")+'</button></div>'}
function carWire(id,nid,btn,attr){const dk=$("#"+id);if(!dk)return;const cards=[...dk.querySelectorAll(".dkc")];
 const act=i=>{const n=$("#"+nid);if(n)n.textContent=(i+1)+" / "+cards.length;const b=$("#"+btn),c=cards[i];if(b&&c.dataset[attr])b.dataset[attr]=c.dataset[attr];
  cards.forEach((c,j)=>{c.classList.toggle("on",j===i);const v=c.querySelector("video");if(!v)return;if(j===i){if(!v.src)v.src=v.dataset.src;const pr=v.play();pr&&pr.catch&&pr.catch(()=>{})}else v.pause()})};
 let cur=0,st;const near=()=>{const m=dk.scrollLeft+dk.clientWidth/2;let b=0,d=1e9;cards.forEach((c,j)=>{const x=Math.abs(c.offsetLeft+c.offsetWidth/2-m);if(x<d){d=x;b=j}});return b};dk.addEventListener("scroll",()=>{clearTimeout(st);st=setTimeout(()=>{const n=near();if(n!==cur){cur=n;act(n)}},90)},{passive:true});act(0)}
const _homeTabBody=homeTabBody;homeTabBody=function(ws){if(homeTab==="play"){setTimeout(()=>carWire("prk","prn","prIn","story"),30);return prDeck()}return _homeTabBody(ws)};
document.addEventListener("click",e=>{const x=e.target.closest("[data-htab]");if(x&&x.dataset.htab==="play")setTimeout(()=>carWire("prk","prn","prIn","story"),30)});
const _renderHome=renderHome;renderHome=function(v){_renderHome(v);const s=$(".hchips",v);if(s&&!$("#wtk",v)){s.insertAdjacentHTML("afterend",tickerHTML());tickerWire()}
 const tb=$(".htabs",v);if(tb){const g=tb.querySelector('[data-htab="games"]');if(g)g.remove()}if(homeTab==="play")carWire("prk","prn","prIn","story")};
if(homeTab==="games"||homeTab==="play")homeTab="quest";

Object.assign(I18N.en,{"rel.s0":"Rivals","rel.s1":"Shaken","rel.s2":"Falling","rel.s3":"Jealous","rel.s4":"Possessive","rel.s5":"Out of control","rel.next":"{n} key events to “{s}”","rel.with":"HIS PERSON","rel.push":"Push them",
 "pz.h":"RELATIONSHIP PUZZLE","pz.q":"What really happened between {a} and {b}?","pz.how":"Each 🧩 story game gives one clue. 6 clues unlock the truth.","pz.open":"Reveal the truth","pz.got":"Clue {n}/6 found","gc.vote1":"+1 vote for the weekly board","gc.clue":"clue",
 "gc.secStory":"🧩 Story games — each one is a clue","gc.secMore":"More games","gc.asleep":"Was He Really Asleep?","gc.asleepS":"{a} says he slept through the night. Check the evidence.","gc.asleepHow":"Tap each piece of evidence, then decide who's lying.","gc.evTap":"tap to inspect","gc.evQ":"So who's lying?",
 "gc.photo":"The One Not in the Photo","gc.photoS":"Someone doesn't belong in {a} and {b}'s pictures.","gc.photoHow":"Tap the face that wasn't there","gc.keepsake":"Private Keepsakes","gc.keepsakeS":"Search {a}'s room for what he kept of {b}.","gc.keepHow":"Find the three things {a} kept from {b}.",
 "gc.shutter":"Memory Shutter","gc.shutterS":"Flip the memories. Match the moments they both remember.","gc.shutterHow":"Flip two cards at a time. Match all four moments.","gc.moves":"moves",
 "gc.sync":"Heartbeat Sync","gc.syncS":"Match {a}'s heartbeat when {b} walks in.","gc.syncHow":"Watch the beats, then tap them back. Reach 6 to win {a} over.","gc.lvl":"Beat",
 "gc.order":"His Order","gc.orderS":"What does {a} order for {b} every morning?","gc.orderHow":"{a} is ordering for {b}. Memorise it — 4 seconds.","gc.epSecret":"Play this episode's secret · {a}'s phone",
 "call.btn":"Call","call.trial":"60s free","call.h":"CALL","call.gateH":"Call {n}","call.gateS":"Your free call is used. Calls are a MIRU+ perk — or pay by the minute.","call.pay":"Call · 💎 {p} / minute","call.plus":"unlimited calls with everyone","call.trialLeft":"Free call · {s}s left","pay.mo2":"min","pay.why.call":"Hear his voice",
 "wt.ago":"{m}m ago","pr.enter":"Enter this room"});
Object.assign(I18N.zh,{"rel.s0":"宿敌","rel.s1":"动摇","rel.s2":"心动","rel.s3":"吃醋","rel.s4":"占有","rel.s5":"失控","rel.next":"还差 {n} 个关键事件到「{s}」","rel.with":"他和谁","rel.push":"去推进",
 "pz.h":"关系谜题","pz.q":"{a} 和 {b} 之间到底发生过什么？","pz.how":"每个 🧩 剧情游戏给一条线索，集齐 6 条解锁真相。","pz.open":"揭晓真相","pz.got":"找到线索 {n}/6","gc.vote1":"+1 张打榜票","gc.clue":"线索",
 "gc.secStory":"🧩 剧情游戏 · 每局都是一条线索","gc.secMore":"更多游戏","gc.asleep":"他真的睡着了吗","gc.asleepS":"{a} 说他一整晚都在睡觉。查查证据。","gc.asleepHow":"逐个点开证据，然后判断谁在撒谎。","gc.evTap":"点开查看","gc.evQ":"所以，谁在撒谎？",
 "gc.photo":"不在照片里的人","gc.photoS":"{a} 和 {b} 的合照里，混进了一个不该在的人。","gc.photoHow":"点出不该出现的那张脸","gc.keepsake":"他的私藏","gc.keepsakeS":"翻 {a} 的房间，找他留着的、和 {b} 有关的东西。","gc.keepHow":"找到 {a} 留着的三样和 {b} 有关的东西。",
 "gc.shutter":"记忆快门","gc.shutterS":"翻开记忆，配对他们俩都记得的瞬间。","gc.shutterHow":"每次翻两张，配对全部四个瞬间。","gc.moves":"步",
 "gc.sync":"心跳同步","gc.syncS":"{b} 走进来的那一刻，跟上 {a} 的心跳。","gc.syncHow":"看清心跳节奏，再按顺序点回去。坚持到 6 拍就赢。","gc.lvl":"第",
 "gc.order":"他点的那杯","gc.orderS":"{a} 每天早上替 {b} 点的是什么？","gc.orderHow":"{a} 正在替 {b} 点单。4 秒，记住它。","gc.epSecret":"玩这一集的秘密 · {a} 的手机",
 "call.btn":"通话","call.trial":"免费 60 秒","call.h":"通话","call.gateH":"打给 {n}","call.gateS":"免费体验已用完。通话是 MIRU+ 权益，也可以按分钟付费。","call.pay":"通话 · 💎 {p} / 分钟","call.plus":"和所有人无限通话","call.trialLeft":"免费通话 · 剩 {s} 秒","pay.mo2":"分钟","pay.why.call":"想听他的声音",
 "wt.ago":"{m} 分钟前","pr.enter":"进入这个房间"});

/* home deck: tap the centre card to play, tap a side card to bring it to the centre */
document.addEventListener("click",e=>{const c=e.target.closest(".dkc[data-dks]");if(!c||e.target.closest("button"))return;if(c.classList.contains("on"))openShort(c.dataset.dks);else if(dkWire.go)dkWire.go(+c.dataset.i)});

document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-hfeed]")){homeFeed=x.dataset.hfeed;renderTab("home");return}
 x=e.target.closest(".dkc[data-dkp]");if(x&&!e.target.closest("button")){if(x.classList.contains("on"))openStory(x.dataset.dkp);else if(dkWire.go)dkWire.go(+x.dataset.i)}});
Object.assign(I18N.en,{"hf.h":"Tonight's Picks","hf.all":"All","hf.drama":"Dramas","hf.pr":"Playroom","hf.prTag":"Playroom"});
Object.assign(I18N.zh,{"hf.h":"今夜上映","hf.all":"全部","hf.drama":"短剧","hf.pr":"多人剧场","hf.prTag":"多人剧场"});
