/* ================= NEW-USER WELCOME · 24h FIRST-PURCHASE 20% OFF · OPENING-LINE VOICE · STICKERS · MY MOMENTS =================
   Welcome: shown once, right after onboarding (or on first boot for existing users). Grants WELCOME_GEMS.
   Promo: 24h from S.joinAt, first purchase only (S.firstPaid). Countdown chip on home, top of paySheet, Me tab.
   Moments: the user posts text (+ optional photo). Every character the user has chatted with comments over the next
   minutes, and keeps coming back once a day for 3 days. Live AI writes in-character comments; offline uses templates. */
const WELCOME_GEMS=10000,PROMO_H=24,PROMO_OFF=.8;
const PROMO_PRICE={"1.99":"1.59","9.99":"7.99","19.99":"15.99","49.99":"39.99","79.99":"63.99","6.67":"5.33"};
function promoLeft(){if(S.firstPaid||!S.joinAt)return 0;return Math.max(0,S.joinAt+PROMO_H*36e5-Date.now())}
function hms(ms){const s=Math.floor(ms/1e3),p=n=>String(n).padStart(2,"0");return p(Math.floor(s/3600))+":"+p(Math.floor(s/60)%60)+":"+p(s%60)}
setInterval(()=>{const l=promoLeft();$$("[data-promocd]").forEach(el=>{if(!l){const w=el.closest("[data-promobox]");if(w)w.remove();else el.textContent="";return}el.textContent=hms(l)})},1000);

function welcomeSheet(after){S.welcomed=true;if(!S.joinAt)S.joinAt=Date.now();S.keys+=WELCOME_GEMS;save();
 sheet('<div class="wel"><div class="welk">'+t("wel.h")+'</div><div class="welart"><span>💎</span><i></i><i></i><i></i><i></i><i></i><i></i></div>'+
  '<h2>'+t("wel.got",{n:WELCOME_GEMS})+'</h2><p class="dim sm">'+t("wel.s")+'</p>'+
  '<div class="welpromo" data-promobox="1"><b>🎁 '+t("promo.h")+'</b><span>'+t("promo.s")+'</span><em><span data-promocd="1">'+hms(promoLeft())+'</span> '+t("promo.left")+'</em></div>'+
  '<button class="btn btn-p btn-block" data-welgo="1">'+t("wel.go")+'</button><button class="btn btn-block welsub" data-welpay="1">'+t("wel.pay")+'</button></div>');
 welcomeSheet.after=after}
document.addEventListener("click",e=>{const x=e.target.closest("[data-obgo]");if(!x||S.welcomed)return;e.stopImmediatePropagation();e.preventDefault();
 const wid=x.dataset.obgo;S.ob=true;save();startApp();welcomeSheet(()=>startSheet(wid))},true);
document.addEventListener("click",e=>{
 if(e.target.closest("[data-welgo]")){closeSheet();const f=welcomeSheet.after;welcomeSheet.after=null;if(f)setTimeout(f,300);refreshAfterPay&&refreshAfterPay();return}
 if(e.target.closest("[data-welpay]")){closeSheet();welcomeSheet.after=null;setTimeout(()=>paySheet(),300);return}
 if(e.target.closest("[data-promogo]")){paySheet();return}});
setTimeout(()=>{if(S.ob&&!S.welcomed&&!$(".sheet"))welcomeSheet()},1400);

/* promo pricing inside the pay sheet */
const _paySheet18=paySheet;
paySheet=function(why){_paySheet18(why);const l=promoLeft();if(!l)return;const sh=$(".sheet .body")||$(".sheet>div")||$(".sheet");if(!sh)return;
 sh.querySelectorAll(".pack span,.plan span").forEach(sp=>{sp.innerHTML=sp.textContent.replace(/\$(\d+\.\d\d)/g,(a,p)=>PROMO_PRICE[p]?'<s>$'+p+'</s> <b class="pp">$'+PROMO_PRICE[p]+'</b>':a)});
 const first=sh.querySelector(".row");if(first)first.insertAdjacentHTML("afterend",'<div class="promobar" data-promobox="1"><b>🎁 '+t("promo.h")+'</b><span>'+t("promo.s2")+'</span><em>⏱ <span data-promocd="1">'+hms(l)+'</span></em></div>')};
document.addEventListener("click",e=>{if(e.target.closest("[data-buy],[data-buyplus]")&&promoLeft()){S.firstPaid=true;save();setTimeout(()=>toast(t("promo.used")),900)}},true);
/* promo chip on home + Me */
const _renderHome18=renderHome;
renderHome=function(v){_renderHome18(v);const l=promoLeft();if(!l)return;const fw=v.querySelector(".feedwrap");if(fw)fw.insertAdjacentHTML("beforeend",'<button class="promochip" data-promogo="1" data-promobox="1">🎁 '+t("promo.chip")+' <span data-promocd="1">'+hms(l)+'</span></button>')};

/* ---------- opening-line voice on the story intro (开场白) ---------- */
function vClean(s){return String(s||"").replace(/（[^）]*）|\([^)]*\)|\*[^*]*\*/g,"").trim()}
const _introHTML18=introHTML;
introHTML=function(th){let h=_introHTML18(th);const w=wd(th.wid),I=Lz(w.pack.intro)||{},V=I.voice;if(!V)return h;
 const ids=(I.cast||w.cast.map(id=>[id,""])).filter(([id])=>ch(id)).map(x=>x[0]),parts=h.split('<div class="mi-c">');
 for(let i=1;i<parts.length;i++){const id=ids[i-1],line=V[id];if(!line)continue;const sec=Math.max(2,Math.round(vClean(line).length/(S.lang==="zh"?4.5:14)));
  parts[i]=parts[i].replace('</span></div></div>','</span><p class="mi-q">'+fmtMix(esc(line))+'</p><button class="vpill" data-vline="'+th.wid+'|'+id+'"><i>▶</i><u>'+'ıllıllııllıl'+'</u><small>'+sec+'″</small></button></div></div>')}
 return parts.join('<div class="mi-c">')};
document.addEventListener("click",e=>{const x=e.target.closest("[data-vline]");if(!x)return;const [wid,id]=x.dataset.vline.split("|"),V=(Lz(wd(wid).pack.intro)||{}).voice||{};
 if(x.classList.contains("on")){stopVoice();x.classList.remove("on");return}$$(".vpill.on").forEach(b=>b.classList.remove("on"));x.classList.add("on");
 speak(vClean(V[id]),id,()=>x.classList.remove("on"));setTimeout(()=>x.classList.remove("on"),Math.max(3000,vClean(V[id]).length*260))});

/* ---------- stickers / emoji in the composer ---------- */
const EMO=("😀 😃 😄 😁 😆 😅 😂 🤣 🥲 ☺️ 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😗 😙 😚 😋 😛 😝 😜 🤪 🤨 🧐 🤓 😎 🥸 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 ☹️ 😣 😖 😫 😩 🥺 😢 😭 😮‍💨 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🫣 🤗 🫡 🤔 🫢 🤭 🤫 🤥 😶 😶‍🌫️ 😐 😑 😬 🫠 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 😵‍💫 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕 😈 👿 👻 💀 🤡 💩 🙈 🙉 🙊 "+
 "❤️ 🩷 🧡 💛 💚 💙 🩵 💜 🖤 🤍 🤎 💔 ❤️‍🔥 ❤️‍🩹 💕 💞 💓 💗 💖 💘 💝 💟 💋 💌 💯 💢 💥 💫 💦 💨 🕳️ 💬 💭 💤 "+
 "👋 🤚 ✋ 🖐️ 👌 🤌 🤏 ✌️ 🤞 🫰 🤟 🤘 🤙 👈 👉 👆 👇 ☝️ 👍 👎 ✊ 👊 🤛 🤜 👏 🙌 🫶 👐 🤲 🤝 🙏 💪 👀 👁️ 👅 👄 🫦 🫂 "+
 "🌹 🥀 🌸 💐 🌙 ⭐ ✨ ⚡ 🔥 🌧️ ⛈️ ❄️ 🍷 🥂 🍸 🍺 ☕ 🍰 🎂 🍓 🍒 🍑 🍫 🍬 🎁 🎀 🎈 🎉 🎶 📸 💍 👑 🕯️ 🛏️ 🚬 🔑 🔒 ✈️ 🌃").split(" ");
const STK=[["🥺","求你了","please?"],["😤","哼","hmph"],["🙈","不看不看","not looking"],["😏","你猜","guess"],["💋","亲一个","mwah"],["🫣","偷看","peeking"],["😭","呜呜","sob"],["🤭","偷笑","giggle"],
 ["👉👈","那个…","um…"],["😴","晚安","night"],["❤️‍🔥","心动了","heart racing"],["🙄","无语","seriously"],["🥰","喜欢","like you"],["😳","？？？","???"],["🍷","陪我喝","drink with me"],["🫂","抱抱","hug"],
 ["🙏","拜托拜托","pretty please"],["😡","生气了","mad"],["🥲","笑着哭","laughing crying"],["🤗","摸摸头","pat pat"],["🫡","收到","roger"],["😇","我很乖","i'm good"],["🤡","我是小丑","clown"],["🐶","汪","woof"],
 ["🐱","喵","meow"],["🐰","蹦蹦","hop hop"],["😪","困了","sleepy"],["☕","早安","morning"],["🍰","请你吃","treat"],["🎉","好耶","yay"],["👋","拜拜","bye"],["💤","已读不回","seen"],
 ["😑","呵呵","sure"],["🤔","让我想想","hmm"],["🙃","算了","whatever"],["💔","心碎","heartbroken"],
 ["🥵","好热","so hot"],["🫦","咬唇","biting lip"],["👀","看哪呢","eyes up here"],["😮‍💨","受不了你","can't with you"],["🤤","想吃你","want a bite"],["🔥","着火了","on fire"],["🫠","化了","melting"],["😈","坏心思","bad idea"],
 ["💦","湿透了","soaked"],["🌙","今晚别走","stay tonight"],["🛏️","过来","come here"],["🥂","再喝一杯","one more"],["🫶","比心","heart"],["😚","啵啵","smooch"],["🤫","嘘","shh"],["😼","被我抓到了","caught you"],
 ["🙈","你别这样看我","don't look at me like that"],["💘","中箭了","struck"],["🧸","抱紧","hold tight"],["🌹","送你","for you"],["😘","想你了","miss you"],["😌","你是我的","you're mine"],["🤐","不说","my lips are sealed"],["💍","嫁给我","marry me"]];
const KAO=["(｡•́︿•̀｡)","(⁄ ⁄•⁄ω⁄•⁄ ⁄)","(*/ω＼*)","ヽ(•̀ω•́ )ゝ","(￣▽￣)~*","(｡♥‿♥｡)","(っ˘з(˘⌣˘ )","( ˘ ³˘)♥","(╯°□°）╯︵ ┻━┻","¯\\_(ツ)_/¯","(；′⌒`)","(｀へ´)","(๑•̀ㅂ•́)و✧","(=^･ω･^=)","ʕ•ᴥ•ʔ","(づ｡◕‿‿◕｡)づ",
 "(〃∀〃)","(｡ŏ﹏ŏ)","(ಥ﹏ಥ)","(¬‿¬)","(°ロ°) !","(ง •̀_•́)ง","( ´ ▽ ` )ﾉ","(⊙_⊙)？","(´-ω-`)","(✿◠‿◠)","(ノ°ο°)ノ","(*≧ω≦)","(￣ε￣＠)","( ͡° ͜ʖ ͡°)","(/ω＼)","(｡･ω･｡)ﾉ♡"];
const STK_CUTE=36;
/* 2026-10-27：从「包 renderChat」搬成钩子（批量迁移）。逻辑原样，只是不再包住渲染器。 */
const __body_promo18 = function () { const ir=$(".composer .inrow");if(!ir||ir.querySelector("[data-emo]"))return;
 const sd=ir.querySelector("[data-send]");if(sd)sd.insertAdjacentHTML("beforebegin",'<button class="emobtn" data-emo="1" aria-label="emoji">😊</button>') };
if (window.UI && typeof window.UI.add === "function") window.UI.add("promo18", __body_promo18);
else { const _renderChat18 = renderChat; renderChat = function () { const r = _renderChat18.apply(this, arguments); __body_promo18(); return r; }; };
let emoTab="stk";
function emoPanel(){const tabs=[["stk","emo.stk"],["flirt","emo.flirt"],["emo","emo.emo"],["kao","emo.kao"]];
 const st=(a,b)=>'<div class="stkg">'+STK.slice(a,b).map((s,j)=>'<button data-stk="'+(a+j)+'"><span>'+s[0]+'</span><small>'+esc((S.lang==="zh"?s[1]:s[2]))+'</small></button>').join("")+'</div>';
 return '<div class="emop"><div class="emotabs">'+tabs.map(([k,l])=>'<button data-emotab="'+k+'" class="'+(emoTab===k?"on":"")+'">'+t(l)+'</button>').join("")+'</div>'+
 (emoTab==="emo"?'<div class="emog">'+EMO.map(x=>'<button data-emoins="'+x+'">'+x+'</button>').join("")+'</div>':emoTab==="kao"?'<div class="kaog">'+KAO.map(x=>'<button data-emoins="'+esc(x)+'">'+esc(x)+'</button>').join("")+'</div>':
  emoTab==="flirt"?st(STK_CUTE,STK.length):st(0,STK_CUTE))+'</div>'}
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-emo]")){const c=$(".composer"),o=c&&c.querySelector(".emop");if(o){o.remove();return}if(c)c.insertAdjacentHTML("beforeend",emoPanel());return}
 if(x=e.target.closest("[data-emotab]")){emoTab=x.dataset.emotab;const o=$(".emop");if(o)o.outerHTML=emoPanel();return}
 if(x=e.target.closest("[data-emoins]")){const ta=$("#cin");if(!ta)return;const s=ta.selectionStart??ta.value.length;ta.value=ta.value.slice(0,s)+x.dataset.emoins+ta.value.slice(s);ta.dispatchEvent(new Event("input"));return}
 if(x=e.target.closest("[data-stk]")){const s=STK[+x.dataset.stk],ta=$("#cin");if(!ta)return;ta.value=s[0]+" "+(S.lang==="zh"?s[1]:s[2]);const o=$(".emop");if(o)o.remove();const b=$(".composer [data-send]");if(b)b.click();return}});
const STK_RE=new RegExp("^("+STK.map(s=>s[0].replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|")+") (.{1,30})$");
const _msgHTML18=msgHTML;
msgHTML=function(m,i,th){const h=_msgHTML18(m,i,th);if(!m||!m.txt||typeof m.txt!=="string")return h;const mt=m.txt.match(STK_RE);
 if(mt)return h.replace(/<div class="bub">[\s\S]*?<\/div>/,'<div class="bub stk"><span>'+mt[1]+'</span><small>'+esc(mt[2])+'</small></div>');
 if(/^(\p{Extended_Pictographic}|‍|️|\s){1,8}$/u.test(m.txt))return h.replace('<div class="bub">','<div class="bub bigemo">');return h};

/* ---------- MY MOMENTS: post, and the people you've talked to come comment ---------- */
function myCircle(){const seen={};Object.values(S.threads||{}).sort((a,b)=>(b.at||0)-(a.at||0)).forEach(th=>{const me=th.pk&&th.pk.as;(th.cast||[]).forEach(id=>{if(id!==me&&ch(id)&&!seen[id])seen[id]=th.at||1})});
 Object.keys(S.follow||{}).forEach(id=>{if(S.follow[id]&&ch(id)&&!seen[id])seen[id]=1});return Object.keys(seen).slice(0,8)}
const MCAT=[["sad",/难过|累|哭|烦|丧|失眠|emo|孤独|sad|tired|cry|lonely|rough|alone/i],["night",/睡|晚安|梦|夜|凌晨|night|sleep|dream|insomnia|3am/i],["food",/吃|饭|咖啡|奶茶|酒|饿|cook|coffee|food|eat|drink|wine|hungry/i],["happy",/开心|哈哈|好耶|成功|生日|升职|happy|yay|finally|birthday|won|lol/i],["out",/出门|旅行|海|下雨|天气|路上|trip|rain|beach|walk|outside|city/i]];
const MTPL={
 sad:{zh:["谁惹你了？名字发我。","别一个人扛着。我在。","今晚别硬撑，打给我。","……我刚好没睡。要不要聊聊？","你难过的时候能不能先找我，而不是发这里。"],en:["Who did this. Give me a name.","Don't carry it alone. I'm here.","Call me tonight. Don't argue.","...I'm awake. Want to talk?","Next time, come to me before you post it."]},
 night:{zh:["梦里有我吗？没有的话今晚补上。","这么晚还不睡，在等谁？","晚安。……再说一次，晚安。","你醒着，我也醒着，那不如……","下次失眠，敲我。"],en:["Was I in it? If not, tonight we fix that.","Still up. Waiting on someone?","Goodnight. ...Goodnight again.","You're awake, I'm awake, so...","Next time you can't sleep, text me."]},
 food:{zh:["一个人吃？下次叫上我。","看着就不错。我请，下次换我带你去。","少喝点。……算了，等我过来陪你。","这家我知道，角落那桌最好，我带你坐。","饿了怎么不跟我说。"],en:["Eating alone? Call me next time.","Looks good. My treat next time.","Go easy. ...Actually, wait for me.","I know that place. Corner table. I'll take you.","You were hungry and didn't tell me?"]},
 happy:{zh:["笑成这样，因为谁？","恭喜。今晚请客，地点我挑。","我就知道你可以。","你开心的样子……挺好看的。","这条我存了。"],en:["Smiling like that. Because of who?","Congrats. Tonight's on you, I pick the place.","Knew you could.","You look good happy. Just saying.","Saved this one."]},
 out:{zh:["在哪？我过去。","带伞了吗？别又淋湿。","下次去哪，记得带上我。","这张拍得好，就是缺了个人。","一个人去的？"],en:["Where are you? I'll come.","Did you bring an umbrella? Don't get soaked again.","Wherever you go next, take me.","Nice shot. Missing someone in it though.","You went alone?"]},
 gen:{zh:["嗯？说的是谁？","这条是发给我看的吧。","我看到了。然后呢？","……你最近是不是有点想我。","下次这种话，当面跟我说。","点了个赞。不止一个。"],en:["Mm? Who's this about?","This one's for me, isn't it.","Saw it. And?","...You've been missing me, haven't you.","Say that to my face next time.","Liked it. More than once."]}};
function mCat(p){const s=p.txt||"";const c=MCAT.find(([k,re])=>re.test(s));return c?c[0]:(p.img?"out":"gen")}
function tplComment(p,id,k,i){const L=MTPL[mCat(p)],a=S.lang==="zh"?L.zh:L.en,b=S.lang==="zh"?MTPL.gen.zh:MTPL.gen.en,pool=k?b:(i<a.length?a:a.concat(b)),used=(p.cm||[]).map(c=>c.txt);let j=(hash(p.id+(k||""))+(i||0))%pool.length;for(let n=0;n<pool.length&&used.includes(pool[j]);n++)j=(j+1)%pool.length;return pool[j]}
function addComments(p,ids,day){const base=Date.now();p.cm=p.cm||[];
 const put=(id,txt,i)=>{p.cm.push({id:"c"+base+"_"+id,who:id,txt,at:base+(day?0:(i+1)*(40+hash(id)%90)*1e3),liked:0})};
 if(liveOn&&liveOn()){const cs=ids.map(id=>{const c=ch(id);return id+": "+c.n+" — "+(Lz(c.vibe)||"")+" ("+(Lz(c.role)||"")+")"}).join("\n");
  ask('The user ("'+(persona().name||"you")+'") posted on their social feed'+(p.img?" with a photo":"")+': "'+(p.txt||"")+'".\nThese characters, who have been talking to the user in romance stories, each leave ONE short comment (max 25 '+(S.lang==="zh"?"Chinese characters":"words")+'), fully in character, a little flirty and teasing, specific to the post, no hashtags, no emojis overload. Language: '+(S.lang==="zh"?"Simplified Chinese":"English")+'.\n'+cs+'\nReturn JSON {"c":[{"who":"<id>","txt":"..."}]}',{}).then(r=>{(r&&r.c||[]).forEach((x,i)=>{if(ids.includes(x.who)&&x.txt)put(x.who,String(x.txt).slice(0,120),i)});save();momRefresh()})
  .catch(()=>{ids.forEach((id,i)=>put(id,tplComment(p,id,day,i),i));save();momRefresh()});return}
 ids.forEach((id,i)=>put(id,tplComment(p,id,day,i),i));save()}
/* daily return: characters come back to posts from the last 3 days, once per day each */
function momDaily(){const d=today();if(S.momDay===d)return;S.momDay=d;(S.moments||[]).filter(p=>Date.now()-p.at<3*864e5&&p.day!==d&&Date.now()-p.at>6e4*60).forEach(p=>{p.day=d;
  const ids=myCircle().filter(id=>hash(id+d)%2===0).slice(0,3);if(ids.length)addComments(p,ids,"d"+d);p.likes=(p.likes||0)+ids.length})}
setTimeout(()=>{try{momDaily()}catch(_){}},2500);
function momCm(p){return (p.cm||[]).filter(c=>c.at<=Date.now()&&ch(c.who))}
function momCard(p){const cm=momCm(p);return '<button class="momc" data-mom="'+p.id+'">'+(p.img?'<img src="'+p.img+'" alt="">':'')+'<div class="grow"><p>'+esc(p.txt||"")+'</p><div class="xs faint">'+ago(p.at)+' · ♥ '+(p.likes||0)+' · 💬 '+cm.length+'</div>'+
 (cm.length?'<div class="momav">'+cm.slice(-4).map(c=>avatar(c.who,20)).join("")+'</div>':'')+'</div></button>'}
function momList(){return '<div class="card" id="momList"><div class="row"><div class="eyebrow grow">'+t("mom.h")+''+'</div><button class="btn btn-p btn-sm" data-mnew="1">＋ '+t("mom.new")+'</button></div>'+
 ((S.moments||[]).length?'<div class="stack" style="gap:8px;margin-top:10px">'+S.moments.slice(0,8).map(momCard).join("")+'</div>':'<p class="xs faint" style="margin-top:8px">'+t("mom.empty")+'</p>')+'</div>'}
const _renderMe18=renderMe;
renderMe=function(v){_renderMe18(v);const sc=v.querySelector(".scroll");if(!sc)return;const l=promoLeft();
 sc.insertAdjacentHTML("afterbegin",(l?'<button class="promobar" data-promogo="1" data-promobox="1" style="text-align:left"><b>🎁 '+t("promo.h")+'</b><span>'+t("promo.s2")+'</span><em>⏱ <span data-promocd="1">'+hms(l)+'</span></em></button>':''))};
let momImg=null;
function momNew(){momImg=null;sheet('<h2>'+t("mom.new")+'</h2><textarea id="momTxt" rows="4" class="momta" placeholder="'+esc(t("mom.ph"))+'"></textarea>'+
 '<div class="row" style="gap:8px;margin-top:10px"><label class="btn btn-g btn-sm" style="cursor:pointer">📷 '+t("mom.photo")+'<input type="file" accept="image/*" id="momFile" hidden></label><div id="momPrev" class="grow"></div></div>'+
 '<div class="cuchips" style="margin-top:10px">'+(S.lang==="zh"?["做了一个好长的梦，还好醒来有你在","今天好累，想被抱一下","一个人喝了一杯","下雨了，没带伞","今天穿了新衣服"]:["Long dream. Glad I woke up to you.","Rough day. Need a hug.","One drink, alone.","It's raining and I forgot my umbrella","New outfit today"]).map(s=>'<button data-mfill="'+esc(s)+'">'+esc(s)+'</button>').join("")+'</div>'+
 '<p class="xs faint" style="margin-top:10px">'+t("mom.who",{n:myCircle().length})+'</p><button class="btn btn-p btn-block" style="margin-top:10px" data-mpost="1">'+t("mom.post")+'</button>')}
function momOpen(id){const p=(S.moments||[]).find(x=>x.id===id);if(!p)return;momSeen();const cm=momCm(p);
 screen("s-mom",'<div class="topbar"><button class="ibtn" data-back="1">'+ic("back")+'</button><h2 class="grow" style="font-size:18px;text-align:center">'+t("mom.detail")+'</h2><span style="width:40px"></span></div><div class="scroll pad stack" style="gap:12px;padding-bottom:30px">'+
  '<div class="card"><div class="xs faint">'+new Date(p.at).toLocaleString()+'</div><p style="margin-top:8px;font-size:16px;line-height:1.6;white-space:pre-wrap">'+esc(p.txt||"")+'</p>'+(p.img?'<img class="momimg" src="'+p.img+'" alt="">':'')+'</div>'+
  '<div class="card"><div class="eyebrow">💬 '+t("mom.cm")+' '+cm.length+'</div>'+(cm.length?cm.map(c=>{const r=c.re;return '<div class="momcm">'+avatar(c.who,36)+'<div class="grow"><b>'+esc(first(ch(c.who).n))+'</b><p>'+fmtMix(esc(c.txt))+'</p>'+
   (c.mine?'<div class="momre"><b>'+t("mom.you")+'</b> '+esc(c.mine)+'</div>':'')+(r?'<div class="momre"><b>'+esc(first(ch(c.who).n))+'</b> '+esc(r)+'</div>':'')+
   '<div class="xs faint">'+ago(c.at)+(c.mine?'':' · <button class="lnk" data-mre="'+p.id+'|'+c.id+'">'+t("mom.reply")+'</button>')+' · <button class="lnk" data-mchat="'+c.who+'">'+t("mom.dm")+'</button></div></div></div>'}).join(""):'<p class="xs faint" style="margin-top:8px">'+t("mom.wait")+'</p>')+'</div>'+
  '<p class="xs faint" style="text-align:center">'+t("mom.ai")+'</p></div>');show("s-mom");momOpen.cur=id}
function momRefresh(){if(S.lastTab==="chats"&&chatSeg==="moments"&&$("#myMoms")&&!$(".sheet"))renderTab("chats");if(momOpen.cur&&$("#s-mom")&&!$("#s-mom").hidden)momOpen(momOpen.cur)}
setInterval(()=>{const n=(S.moments||[]).reduce((a,p)=>a+momCm(p).length,0);if(n!==momRefresh.n){if(momRefresh.n!=null)momRefresh();momRefresh.n=n}},5000);
function shrink(file,cb){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const k=Math.min(1,640/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*k;c.height=im.height*k;c.getContext("2d").drawImage(im,0,0,c.width,c.height);cb(c.toDataURL("image/jpeg",.78))};im.src=r.result};r.readAsDataURL(file)}
document.addEventListener("change",e=>{if(e.target.id==="momFile"&&e.target.files[0])shrink(e.target.files[0],d=>{momImg=d;const pv=$("#momPrev");if(pv)pv.innerHTML='<img src="'+d+'" style="height:44px;border-radius:8px">'})});
document.addEventListener("click",e=>{let x;
 if(e.target.closest("[data-mnew]")){momNew();return}
 if(x=e.target.closest("[data-mfill]")){const ta=$("#momTxt");if(ta)ta.value=x.dataset.mfill;return}
 if(e.target.closest("[data-mpost]")){const txt=(($("#momTxt")||{}).value||"").trim();if(!txt&&!momImg)return;
  const p={id:"m"+Date.now(),txt,img:momImg,at:Date.now(),likes:0,cm:[],day:today()};S.moments=[p].concat(S.moments||[]).slice(0,40);save();closeSheet();
  const ids=myCircle();if(ids.length)addComments(p,ids);else toast(t("mom.noone"));p.likes=ids.length+hash(p.id)%4;save();chatSeg="moments";renderTab("chats");toast(t("mom.posted"));return}
 if(x=e.target.closest("[data-mom]")){momOpen(x.dataset.mom);return}
 if(x=e.target.closest("[data-mchat]")){const id=x.dataset.mchat;const th=Object.values(S.threads).sort((a,b)=>(b.at||0)-(a.at||0)).find(t2=>t2.cast.includes(id));if(th)openThread(th.id);return}
 if(x=e.target.closest("[data-mre]")){const [pid,cid]=x.dataset.mre.split("|");const p=S.moments.find(q=>q.id===pid),c=p&&p.cm.find(q=>q.id===cid);if(!c)return;
  sheet('<h2>'+t("mom.reply")+' '+esc(first(ch(c.who).n))+'</h2><p class="sm dim" style="margin-top:6px">“'+esc(c.txt)+'”</p><textarea id="mreTxt" rows="3" class="momta"></textarea><button class="btn btn-p btn-block" style="margin-top:10px" data-mresend="'+pid+'|'+cid+'">'+t("post.send")+'</button>');return}
 if(x=e.target.closest("[data-mresend]")){const [pid,cid]=x.dataset.mresend.split("|");const p=S.moments.find(q=>q.id===pid),c=p&&p.cm.find(q=>q.id===cid),v=(($("#mreTxt")||{}).value||"").trim();if(!c||!v)return;
  c.mine=v;closeSheet();save();momOpen(pid);const fb=S.lang==="zh"?["那你今晚来找我，当面说。","嘴硬。我等你。","……行，记住你说的。","你这么说，我会当真的。"]:["Then come say it to my face tonight.","Stubborn. I'll wait.","...Fine. I'll hold you to that.","Say it like that and I'll believe you."];
  const done=r=>{c.re=r;c.reAt=Date.now();save();if(momOpen.cur===pid)momOpen(pid)};
  if(liveOn&&liveOn())ask('You are '+ch(c.who).n+' ('+(Lz(ch(c.who).vibe)||"")+'). You commented "'+c.txt+'" on the user\'s post "'+(p.txt||"")+'". They replied: "'+v+'". Reply once, in character, flirty, max 25 '+(S.lang==="zh"?"Chinese characters, Simplified Chinese":"words, English")+'. JSON {"r":"..."}',{}).then(r=>done(String(r&&r.r||fb[0]).slice(0,120))).catch(()=>done(fb[hash(v)%fb.length]));
  else setTimeout(()=>done(fb[hash(v)%fb.length]),2500);return}});

Object.assign(I18N.en,{"wel.h":"New member gift","wel.got":"Welcome gift: 💎 {n} added!","wel.s":"Your first stories are free. Use diamonds to unlock his photos, extra scenes and what he says next.","wel.go":"Start watching","wel.pay":"See first-purchase deals",
 "promo.h":"October limited · New members","promo.s":"20% off your first purchase within 24 hours of joining","promo.s2":"First purchase 20% off — prices below already discounted","promo.left":"left","promo.chip":"First purchase -20%","promo.used":"New-member 20% off applied",
 "emo.stk":"Stickers","emo.emo":"Emoji","emo.flirt":"Flirty","emo.kao":"Kaomoji",
 "mom.h":"My moments","mom.new":"New post","mom.ph":"What's on your mind? The people you've been talking to will see it…","mom.photo":"Photo","mom.who":"{n} characters you've talked to will see this and comment.","mom.post":"Post","mom.posted":"Posted — they'll see it soon","mom.noone":"Chat with someone first — they'll be the ones commenting.","mom.empty":"Post something. The people you've been talking to will come comment — and keep checking in.","mom.detail":"Post","mom.cm":"Comments","mom.you":"You","mom.reply":"Reply","mom.dm":"Message","mom.wait":"They've seen it. Give them a minute…","mom.ai":"Character comments are AI-generated."});
Object.assign(I18N.zh,{"wel.h":"新用户福利","wel.got":"注册奖励 💎{n} 已到账！","wel.s":"每部剧前几章免费。钻石可以解锁他发来的照片、隐藏剧情，和他接下来要说的话。","wel.go":"开始看剧","wel.pay":"看看首充福利",
 "promo.h":"10月限定 · 新会员","promo.s":"注册后 24 小时内首次充值享 8 折","promo.s2":"首充 8 折，下方已是折后价","promo.left":"后结束","promo.chip":"新人首充8折","promo.used":"已享新人 8 折",
 "emo.stk":"贴纸","emo.emo":"表情","emo.flirt":"暧昧","emo.kao":"颜文字",
 "mom.h":"我的动态","mom.new":"发动态","mom.ph":"说点什么……和你聊过天的人都会看到","mom.photo":"照片","mom.who":"和你聊过天的 {n} 个角色会看到并评论。","mom.post":"发布","mom.posted":"已发布，他们很快会看到","mom.noone":"先去和角色聊聊天，他们才会来评论哦。","mom.empty":"发一条动态吧。和你聊过天的人会来评论，之后几天还会回来看。","mom.detail":"详情","mom.cm":"评论","mom.you":"你","mom.reply":"回复","mom.dm":"私聊","mom.wait":"他们已经看到了，等一下……","mom.ai":"角色评论均由 AI 生成"});

/* ---------- step 0: choose language first, then the app switches to that language region ---------- */
const _renderOB18=renderOB;
renderOB=function(){if(S.langChosen){_renderOB18();return}const sel=S.lang||"en";
 screen("s-ob",'<div class="scroll pad stack lgpick" style="gap:14px;padding-block:28px 20px"><div class="row" style="gap:10px"><div class="lgbar"><i></i></div><span class="xs faint">1/'+6+'</span></div>'+
  '<h1 style="font-size:24px;margin-top:10px">'+t("lg.h")+'</h1><p class="dim sm">'+t("lg.s")+'</p>'+
  '<div class="lggrid">'+LANGS.map(([k,n])=>'<button data-lgpick="'+k+'" class="'+(k===sel?"on":"")+'">'+n+'</button>').join("")+'</div>'+
  '<button class="btn btn-p btn-block" style="margin-top:auto" data-lgok="1">'+t("lg.ok")+'</button></div>');show("s-ob")};
document.addEventListener("click",e=>{let x;
 if(x=e.target.closest("[data-lgpick]")){S.lang=x.dataset.lgpick;save();renderOB();return}
 if(e.target.closest("[data-lgok]")){S.langChosen=true;save();renderOB();return}});
Object.assign(I18N.en,{"lg.h":"Language & region","lg.s":"Pick your language. Stories, characters and voices switch to that region.","lg.ok":"Confirm"});
Object.assign(I18N.zh,{"lg.h":"语言与地区","lg.s":"选择你的语言，剧集、角色和语音会切换到对应的语言区。","lg.ok":"确认"});
if(I18N.ja)Object.assign(I18N.ja,{"lg.h":"言語と地域","lg.s":"言語を選ぶと、作品・キャラクター・ボイスがその地域に切り替わります。","lg.ok":"確認"});
if(I18N.ko)Object.assign(I18N.ko,{"lg.h":"언어 및 지역","lg.s":"언어를 선택하면 작품, 캐릭터, 음성이 해당 지역으로 바뀝니다.","lg.ok":"확인"});
if(I18N.es)Object.assign(I18N.es,{"lg.h":"Idioma y región","lg.s":"Elige tu idioma. Historias, personajes y voces cambian a esa región.","lg.ok":"Confirmar"});

/* moments live inside Chats → 动态: my composer + my posts on top of the characters' posts */
function meAv(n){const p=persona();return '<div class="av meav" style="width:'+n+'px;height:'+n+'px;font-size:'+Math.round(n*.42)+'px">'+esc(((p&&p.name)||(S.lang==="zh"?"我":S.lang==="ja"?"私":S.lang==="ko"?"나":"Me"))[0])+'</div>'}
function myPostHTML(p){const cm=momCm(p);return '<div class="post mypost"><div class="hd">'+meAv(34)+'<div class="grow"><b class="sm">'+esc((persona()||{}).name||t("mom.you"))+'</b><div class="xs faint">'+ago(p.at)+'</div></div></div>'+
 (p.txt?'<p class="cap" style="font-size:14.5px">'+esc(p.txt)+'</p>':'')+(p.img?'<img class="momimg" style="margin:8px 16px 0" src="'+p.img+'" alt="">':'')+
 '<div class="acts"><span class="xs faint">♥ '+(p.likes||0)+'</span><button data-mom="'+p.id+'">'+ic("msg")+'<span class="num">'+cm.length+'</span></button></div>'+
 (cm.length?'<button class="mycm" data-mom="'+p.id+'">'+cm.slice(-2).map(c=>'<div><b>'+esc(first(ch(c.who).n))+'</b> '+esc(c.txt)+'</div>').join("")+(cm.length>2?'<div class="xs faint">'+t("mom.all",{n:cm.length})+'</div>':'')+'</button>':'<p class="xs faint" style="padding:4px 16px 0">'+t("mom.wait")+'</p>')+'</div>'}
const _renderChats18=renderChats;
renderChats=function(v){_renderChats18(v);
 const st=v.querySelector(".stories");if(st)st.insertAdjacentHTML("afterbegin",'<button class="story mestory" data-mnew="1"><span class="ring">'+meAv(60)+'<i>＋</i></span><b>'+t("mom.new")+'</b></button>');
 const mt=v.querySelector('[data-cseg="moments"]');const un=momUnread();if(mt&&un)mt.insertAdjacentHTML("beforeend",' <i class="mdot">'+un+'</i>');
 if(chatSeg!=="moments")return;momSeen();if(mt){const d=mt.querySelector(".mdot");if(d)d.remove()}
 const sc=v.querySelector(".scroll"),tb=sc&&sc.querySelector(".tabs");if(!tb)return;
 tb.insertAdjacentHTML("afterend",'<div id="myMoms"><button class="momcomp" data-mnew="1">'+meAv(36)+'<span class="grow">'+t("mom.ph2")+'</span><i>📷</i></button>'+(S.moments||[]).slice(0,10).map(myPostHTML).join("")+'</div>')};
Object.assign(I18N.en,{"mom.ph2":"Share a moment — the people you talk to will see it","mom.all":"See all {n} comments"});
Object.assign(I18N.zh,{"mom.ph2":"分享此刻……和你聊过天的人都会看到","mom.all":"查看全部 {n} 条评论"});

function momUnread(){const seen=S.momSeenAt||0,now=Date.now();let n=0;(S.moments||[]).forEach(p=>(p.cm||[]).forEach(c=>{if(c.at<=now&&c.at>seen)n++;if(c.reAt&&c.reAt>seen)n++}));return n}
function momSeen(){S.momSeenAt=Date.now();save();momBadge()}
/* red dot on the 聊天 tab when someone comments on / replies to your post */
function momBadge(){const b=$('.tabbar [data-tab="chats"]');if(!b)return;const n=momUnread();let d=b.querySelector(".tbdot");
 if(!n){if(d)d.remove();return}if(!d){b.style.position="relative";b.insertAdjacentHTML("beforeend",'<i class="tbdot"></i>');d=b.querySelector(".tbdot")}d.textContent=n>99?"99+":n}
const _renderTab18=renderTab;renderTab=function(k){_renderTab18(k);momBadge()};
setInterval(()=>{momBadge();if(S.lastTab==="chats"&&$("#s-main")){const mt=$('[data-cseg="moments"]');if(mt&&chatSeg!=="moments"){const n=momUnread();let d=mt.querySelector(".mdot");if(n&&!d)mt.insertAdjacentHTML("beforeend",' <i class="mdot">'+n+'</i>');else if(d)d.textContent=n}}},4000);
