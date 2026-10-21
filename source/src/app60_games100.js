/* ================= v2.3 · MINI-GAME LIBRARY — 100 games from 15 templates, popped by keywords =================
   Templates: 读心问答 quiz · 翻牌 memory · 密码锁 code · 心跳节拍 rhythm · 屏息 hold · 快拍 whack · 找东西 find · 拆线 wires ·
   拼图 slide · 记顺序 simon · 刮开 scratch · 骰子 dice · 拼回原话 order · 接住 catch · 平衡 balance.
   Every game: ≤40 seconds, one tap to skip (skip = a neutral path, never a dead end), result feeds the story:
   win → flag mg_<id>_win + a small relationship nudge; lose → the lose beats (or a gentle line). Max 1 auto game per chapter.
   Story directive: ["sys","mg",{id,win:[…],lose:[…]}] (a stop). Keywords in the story's lines pop the matching game automatically. */
const MG_SRC=`find_ring|找戒指|Find the Ring|find|💍|💎🔑🪙📿🧷🔗|戒指掉了,找戒指,lost the ring
find_key|找钥匙|Find the Key|find|🗝|🔑🧷📎🪙🔩✂|找钥匙,钥匙不见,lost the key
find_letter|找那封信|Find the Letter|find|💌|📄📃📜📰📑🧾|那封信,情书,love letter
find_phone|找手机|Find His Phone|find|📱|📟💳🎧⌚🔋📷|找手机,手机呢,where's my phone
find_cat|找猫|Find the Cat|find|🐈|🐕🐇🐿🦊🐒🦝|猫跑了,找猫,the cat ran
find_star|找星星|Find the Star|find|⭐|✨🌟💫☄🌙🪐|找星星,那颗星,that star
find_clue|找线索|Find the Clue|find|🩸|🔍🧤👣🧾🔪🕯|找线索,搜查,search the room
find_umbrella|找伞|Find the Umbrella|find|☂|🌂🧣🧤👜🎒🧥|伞呢,找伞,where's the umbrella
find_pill|找药|Find the Medicine|find|💊|🍬🧂🍭🧴🧪💉|找药,药在哪,medicine
mem_wine|酒窖翻牌|Wine Cellar Pairs|memory|🍷🥂🍾🍇🧀🕯|-|酒窖,红酒,wine cellar
mem_fae|妖精翻牌|Fae Pairs|memory|🍄🌙🦋🌿🔮🧚|-|妖精,精灵,fae court
mem_gala|晚宴翻牌|Gala Pairs|memory|🎩👠💎🥂🎻🌹|-|晚宴,舞会,gala
mem_kitchen|厨房翻牌|Kitchen Pairs|memory|🍳🥞🍓🧁🥐☕|-|厨房,做早餐,kitchen
mem_space|星舰翻牌|Starship Pairs|memory|🚀🪐🛰👽🌌☄|-|星舰,太空,starship
mem_sport|更衣室翻牌|Locker Pairs|memory|🏒🏀⚽🏆🥅👟|-|更衣室,比赛前,locker room
mem_beach|海边翻牌|Beach Pairs|memory|🐚🌊🏖🦀⛱🍹|-|海边,沙滩,beach
mem_memory|回忆翻牌|Memory Pairs|memory|📷🎞💌🧸🎈🎂|-|旧照片,回忆,old photos
code_safe|保险箱|The Safe|code|4|生日？纪念日？|保险箱,密码,safe,the code
code_door|密码门|Coded Door|code|4|门上的四位数|密码门,门锁,keypad
code_phone|解锁手机|Unlock His Phone|code|4|他会用什么当密码？|解锁手机,手机密码,unlock his phone
code_diary|日记锁|Diary Lock|code|3|小小的三位数锁|日记,日记本,diary
code_vault|金库|The Vault|code|4|最后一道门|金库,vault
code_case|手提箱|Briefcase|code|3|黑色手提箱|手提箱,公文包,briefcase
code_locker|储物柜|Locker|code|3|他的储物柜|储物柜,柜子密码,locker
beat_heart|心跳同步|Sync Heartbeats|rhythm|8|跟上他的心跳|心跳,靠在他胸口,his heartbeat
beat_dance|舞步|Dance Steps|rhythm|10|踩准节拍|跳舞,舞步,dance with me
beat_drum|鼓点|Drum Beat|rhythm|10|打准每一拍|打鼓,鼓点,drums
beat_rowing|划船|Rowing|rhythm|8|一起划|划船,划桨,rowing
beat_sword|格挡|Parry|rhythm|8|在剑落下的瞬间格挡|格挡,剑砍下来,parry
beat_piano|合奏|Duet|rhythm|10|和他四手联弹|四手联弹,合奏,duet
hold_breath|屏住呼吸|Hold Your Breath|hold|5|别出声——他就在门外|屏住呼吸,别出声,hold your breath
hold_hide|躲藏|Stay Hidden|hold|6|保持不动|躲在衣柜,躲起来,hide
hold_tears|忍住眼泪|Hold Back Tears|hold|5|不要在他面前哭|忍住眼泪,不能哭,don't cry
hold_hand|握紧|Don't Let Go|hold|6|无论如何别松手|别松手,抓紧我,don't let go
hold_aim|瞄准|Steady Aim|hold|5|稳住|瞄准,扣扳机,aim
hold_glass|端稳|Steady Glass|hold|5|一滴都别洒|端着酒杯,托盘,tray
whack_hearts|收集心动|Catch the Hearts|whack|💗|💔|心动瞬间,怦然心动,heart skipped
whack_bugs|拍蚊子|Swat Mosquitoes|whack|🦟|🦋|蚊子,mosquito
whack_flash|挡闪光灯|Block the Flashes|whack|📸|🙂|记者,狗仔,paparazzi,press
whack_fire|扑火|Put Out Sparks|whack|🔥|💧|火星溅,着火了,catch fire
whack_ghost|赶走幽灵|Banish Ghosts|whack|👻|🕯|幽灵,鬼魂,ghosts
whack_texts|拒接骚扰|Decline Spam|whack|📵|💬|骚扰电话,一直打来,spam calls
whack_rats|老鼠|Rats|whack|🐀|🧀|老鼠,rats
wire_bomb|拆弹|Defuse|wires|🔴🔵🟡🟢|-|炸弹,拆弹,bomb,defuse
wire_alarm|关警报|Cut the Alarm|wires|🔴🔵🟢|-|警报,报警器,alarm
wire_power|接电|Restore Power|wires|🔴🔵🟡🟢|-|停电,电闸,breaker,power out
wire_engine|发动|Hotwire|wires|🔴🟡🟢|-|发动不了,车坏了,hotwire
wire_ship|修舰|Fix the Ship|wires|🔴🔵🟡🟢|-|飞船故障,维修,repair the ship
slide_photo|拼照片|Rebuild the Photo|slide|📷|-|撕碎的照片,拼起来,torn photo
slide_map|拼地图|Rebuild the Map|slide|🗺|-|地图,藏宝图,map
slide_letter|拼回信|Rebuild the Letter|slide|💌|-|撕碎的信,碎纸,shredded
slide_sigil|拼印记|Rebuild the Sigil|slide|🔯|-|印记,纹章,sigil
slide_painting|拼画|Rebuild the Painting|slide|🖼|-|那幅画,油画,painting
simon_lights|记灯|Memorize the Lights|simon|5|按刚才亮起的顺序|灯一闪一闪,信号灯,signal
simon_spell|记咒语|Memorize the Spell|simon|5|符文的顺序|咒语,符文,runes
simon_lock|记手势|Memorize the Pattern|simon|4|他刚才画的手势|手势密码,pattern
simon_song|记旋律|Memorize the Tune|simon|5|他哼的那段旋律|哼了一段,旋律,melody
simon_dance|记动作|Memorize the Moves|simon|4|跟着他做|跟着我做,学动作,follow my lead
scratch_ticket|刮彩票|Scratch Ticket|scratch|🎟|恭喜，中了一个愿望|彩票,刮刮乐,lottery
scratch_photo|刮开照片|Reveal the Photo|scratch|🖼|照片背面写着：别走|照片背面,反过来,back of the photo
scratch_note|显影|Reveal the Note|scratch|📝|纸条上写着：今晚十点，老地方|纸条,便签,a note
scratch_window|擦窗户|Wipe the Window|scratch|🪟|雾气后面，他正看着你|起雾的窗,车窗,fogged window
scratch_mirror|擦镜子|Wipe the Mirror|scratch|🪞|镜子上写着：我知道你是谁|浴室镜子,镜子,mirror
scratch_gold|刮金粉|Gold Leaf|scratch|✨|金粉下面是一个名字|金粉,邀请函,invitation
dice_bet|赌一把|Roll for It|dice|3|三局两胜|赌一把,掷骰子,roll the dice
dice_drink|喝酒骰|Drinking Dice|dice|3|输的喝|喝酒游戏,摇骰子,drinking game
dice_fate|命运骰|Fate Dice|dice|1|一次定生死|命运,赌命,fate
dice_truth|真心话骰|Truth Dice|dice|3|输的说真心话|真心话,truth or dare
dice_casino|赌场|Casino Night|dice|3|庄家对你|赌场,赌桌,casino
order_confess|拼回告白|Rebuild the Confession|order|我/从来/没有/后悔/遇见你|-|他说的那句话,那句告白,what he said
order_vow|拼回誓言|Rebuild the Vow|order|无论/发生/什么/我/都在|-|誓言,发誓,vow
order_spell|拼回咒文|Rebuild the Incantation|order|以/月光/之名/解开/契约|-|咒文,契约,incantation
order_clue|还原经过|Reconstruct the Night|order|十点/出门/十一点/争吵/零点/停电|-|还原,时间线,timeline
order_recipe|做菜步骤|Follow the Recipe|order|洗米/切菜/下锅/调味/装盘|-|做菜,菜谱,recipe
order_apology|拼回道歉|Rebuild the Apology|order|对不起/是我/先/放开了/你的手|-|那句道歉,道歉的话,his apology
order_lyrics|拼歌词|Rebuild the Lyric|order|雨停/之前/请你/别走|-|歌词,那首歌,lyrics
order_letter|拼回情书|Rebuild the Letter|order|见字/如面/我/很/想你|-|情书,来信,dear
catch_petals|接花瓣|Catch Petals|catch|🌸|🪨|接住花瓣,花瓣飘,petals falling
catch_snow|接雪|Catch Snowflakes|catch|❄|🔥|接雪花,雪落,snowflakes
catch_stars|接流星|Catch Falling Stars|catch|⭐|☄|接住流星,流星雨,meteor shower
catch_coins|接金币|Catch Coins|catch|🪙|💣|撒钱,接住,coins
catch_notes|接音符|Catch the Notes|catch|🎵|🔇|音符,旋律落下,notes
catch_cake|接蛋糕|Catch the Cake|catch|🍰|🦴|蛋糕要掉了,接住蛋糕,cake falling
catch_letters|接信|Catch the Letters|catch|💌|📦|信纷纷,来信,letters
balance_tray|端托盘|Balance the Tray|balance|8|别洒|端托盘,服务生,waiter
balance_rope|走钢索|Tightrope|balance|8|一步一步|钢索,高空,tightrope
balance_boat|小船|Steady the Boat|balance|8|别翻船|小船晃,翻船,boat rocking
balance_skate|滑冰|Skating|balance|8|站稳|滑冰,溜冰,skating
balance_ladder|梯子|Ladder|balance|7|扶稳梯子|梯子,爬上去,ladder
balance_drunk|扶他回家|Walk Him Home|balance|8|他喝多了，扶稳|喝多了,扶他,he's drunk
quiz_heart|读心|Read His Mind|quiz|heart|-|他在想什么,猜猜他,read his mind
quiz_date|默契考验|Do You Know Him|quiz|date|-|默契,了解他,how well
quiz_case|找出说谎的人|Spot the Liar|quiz|case|-|谁在说谎,嫌疑人,suspect
quiz_court|宫廷礼仪|Court Etiquette|quiz|court|-|宫廷礼仪,觐见,etiquette
quiz_wine|品酒|Wine Tasting|quiz|wine|-|品酒,尝一口,tasting
quiz_fae|妖精的谜题|The Fae Riddle|quiz|fae|-|谜题,妖精问,riddle
quiz_star|星图|Star Chart|quiz|star|-|星图,星座,constellation
quiz_hockey|战术板|Playbook|quiz|sport|-|战术,战术板,playbook
quiz_music|听歌识曲|Name That Song|quiz|music|-|猜歌,这首歌,name that song
quiz_cook|厨艺考验|Kitchen Test|quiz|cook|-|厨艺,考你,cook-off`;
const MG100=MG_SRC.split("\n").map(l=>{const [id,zh,en,tpl,a,b,kw]=l.split("|");return {id:"g_"+id,zh,en,tpl,a,b,kw:kw.split(",")}});
const MG_Q={heart:[["他最怕你看到他哪一面？","哭","害怕"],["吵架后他会？","先道歉","装没事"],["他喜欢你叫他？","全名","小名"],["下雨天他会？","把伞给你","和你一起淋"],["他记得你的？","生日","第一次见面的日期"],["他最想和你？","看日出","吃宵夜"]],
 date:[["他的咖啡？","黑咖啡","加两块糖"],["他睡觉？","靠窗","靠门"],["他紧张时？","摸耳朵","话变多"],["他最爱的季节？","冬天","夏天"],["他会先说？","晚安","明天见"],["他不擅长？","道歉","撒谎"]],
 case:[["管家说他一直在厨房，但围裙是干的。","管家在说谎","管家没说谎"],["司机说十点出门，油表却是满的。","司机在说谎","司机没说谎"],["她说没见过死者，却叫出了他的小名。","她在说谎","她没说谎"],["他说在看球赛，却不知道比分。","他在说谎","他没说谎"]],
 court:[["觐见时第一句？","恭请圣安","你好"],["先入座的是？","主人","客人"],["敬酒时杯沿要？","低于对方","高于对方"],["行礼时目光？","垂下","直视"]],
 wine:[["配红肉？","红酒","白酒"],["香槟杯要拿？","杯脚","杯身"],["醒酒是为了？","让酒呼吸","让酒变凉"],["先闻还是先喝？","先闻","先喝"]],
 fae:[["我越洗越脏，我是什么？","水","肥皂"],["说出我的名字我就消失？","沉默","秘密"],["妖精最怕？","铁","火"],["永远不能对妖精说？","谢谢","你好"]],
 star:[["北极星在？","小熊座","大熊座"],["夏夜大三角有？","织女星","天狼星"],["流星其实是？","陨石","星星"],["离我们最近的恒星？","太阳","比邻星"]],
 sport:[["落后一球最后两分钟？","撤门将","全线防守"],["对方一直犯规？","冷静别还手","打回去"],["队长要？","最后离场","最先离场"],["赛前最重要？","睡够","加练"]],
 music:[["「哆来咪」是？","音阶","和弦"],["四分音符几拍？","一拍","四拍"],["小调听起来更？","忧伤","欢快"],["华尔兹是几拍？","三拍","四拍"]],
 cook:[["煎牛排前要？","擦干","泡水"],["米和水大约？","一比一点二","一比三"],["盐什么时候放？","出锅前","一开始"],["打发蛋白要？","无油无水","加点油"]]};
function mgHash(s){let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)}
/* ---------- the overlay ---------- */
let MGX=null;
function mgOpen(id,cb){const G=MG100.find(x=>x.id===id);if(!G){cb&&cb("skip");return}const zh=CL()==="zh";mgClose();
 const ov=document.createElement("div");ov.className="mg60";ov.innerHTML='<div class="mgbox"><div class="mghd"><b>🎮 '+esc(zh?G.zh:G.en)+'</b><button data-mgskip="1">'+(zh?"跳过":"Skip")+' ›</button></div><p class="mgsub"></p><div class="mgarea"></div><div class="mgres" hidden></div></div>';
 document.body.appendChild(ov);const area=ov.querySelector(".mgarea"),sub=ov.querySelector(".mgsub");let over=false,timers=[];
 MGX={ov,cb,G,timers,done:(r)=>{if(over)return;over=true;timers.forEach(clearTimeout);timers.forEach(clearInterval);
  if(r==="skip"){mgClose();cb&&cb("skip");return}sfx100(r==="win"?"success":"error",.7);const res=ov.querySelector(".mgres");res.hidden=false;
  res.innerHTML='<div class="mgbig">'+(r==="win"?"🎉":"🫠")+'</div><b>'+(r==="win"?(zh?"成功！":"You did it!"):(zh?"差一点……":"So close…"))+'</b><button class="btn btn-p btn-block" data-mgback="1">'+(zh?"回到剧情":"Back to the story")+'</button>';res.dataset.r=r}};
 try{MG_T[G.tpl](area,G,sub,MGX.done,timers,zh)}catch(e){MGX.done("skip")}}
function mgClose(){if(MGX&&MGX.ov)MGX.ov.remove();MGX=null}
document.addEventListener("click",e=>{if(!MGX)return;if(e.target.closest("[data-mgskip]")){MGX.done("skip");return}
 if(e.target.closest("[data-mgback]")){const r=MGX.ov.querySelector(".mgres").dataset.r,cb=MGX.cb;mgClose();cb&&cb(r)}});
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const segs=s=>window.Intl&&Intl.Segmenter?[...new Intl.Segmenter().segment(s)].map(x=>x.segment).filter(x=>x.trim()&&x!=="️"):[...s];
const MG_T={
 find(A,G,sub,done,T,zh){let round=0;const go=()=>{if(round>=3){done("win");return}const dec=segs(G.b),cells=shuf(Array.from({length:35},(_,i)=>dec[i%dec.length]).concat([G.a]));
  sub.textContent=(zh?"找到 ":"Find ")+G.a+(zh?" · 第 ":" · round ")+(round+1)+"/3";A.innerHTML='<div class="mgfind">'+cells.map(c=>'<button data-c="'+(c===G.a?1:0)+'">'+c+'</button>').join("")+'</div><div class="mgbar"><i></i></div>';
  const bar=A.querySelector(".mgbar i");bar.style.animation="mgbar 9s linear forwards";T.push(setTimeout(()=>done("lose"),9000));
  A.querySelector(".mgfind").onclick=e=>{const b=e.target.closest("button");if(!b)return;if(b.dataset.c==="1"){sfx100("pop",.6);T.forEach(clearTimeout);T.length=0;round++;go()}else{b.classList.add("no")}}};go()},
 memory(A,G,sub,done,T,zh){const sym=segs(G.a).slice(0,6),cards=shuf(sym.concat(sym));let open=[],got=0,miss=0;sub.textContent=zh?"翻出 6 对 · 最多错 8 次":"Match 6 pairs · max 8 misses";
  A.innerHTML='<div class="mgmem">'+cards.map((c,i)=>'<button data-i="'+i+'"><span>'+c+'</span></button>').join("")+'</div>';
  A.querySelector(".mgmem").onclick=e=>{const b=e.target.closest("button");if(!b||b.classList.contains("up")||open.length>=2)return;b.classList.add("up");open.push(b);
   if(open.length===2){const [x,y]=open;if(cards[x.dataset.i]===cards[y.dataset.i]){got++;open=[];sfx100("pop",.5);if(got===6)T.push(setTimeout(()=>done("win"),400))}
    else{miss++;T.push(setTimeout(()=>{x.classList.remove("up");y.classList.remove("up");open=[];if(miss>=8)done("lose")},700))}}}},
 code(A,G,sub,done,T,zh){const n=+G.a||4,code=Array.from({length:n},()=>Math.floor(Math.random()*10));let cur=[],tries=0;
  sub.textContent=(zh?G.b+" · 6 次机会，每次会提示每一位是大了还是小了":"6 tries; each digit tells you higher or lower");
  const draw=(fb)=>{A.innerHTML='<div class="mgcode">'+Array.from({length:n},(_,i)=>'<span>'+(cur[i]!=null?cur[i]:"·")+'</span>').join("")+'</div>'+(fb?'<div class="mgfb">'+fb+'</div>':'')+
   '<div class="mgpad">'+[1,2,3,4,5,6,7,8,9,"⌫",0,"✓"].map(k=>'<button data-k="'+k+'">'+k+'</button>').join("")+'</div><p class="mgsm">'+(zh?"剩余 ":"Left ")+(6-tries)+'</p>'};draw();
  A.onclick=e=>{const b=e.target.closest("[data-k]");if(!b)return;const k=b.dataset.k;if(k==="⌫"){cur.pop();draw();return}
   if(k==="✓"){if(cur.length<n)return;tries++;if(cur.every((d,i)=>d===code[i])){done("win");return}const fb=cur.map((d,i)=>d===code[i]?"✓":d<code[i]?"↑":"↓").join(" ");cur=[];if(tries>=6){done("lose");return}sfx100("blip",.5);draw(fb);return}
   if(cur.length<n){cur.push(+k);draw()}}},
 rhythm(A,G,sub,done,T,zh){const N=+G.a||8;let i=0,hit=0;sub.textContent=G.b+(zh?" · 圆圈缩到心上时点":" · tap when the ring meets the heart");
  A.innerHTML='<div class="mgrh"><b class="rg"></b><i>💗</i></div><p class="mgsm"><span id="mgsc">0</span>/'+N+'</p>';const rg=A.querySelector(".rg");let t0=0;
  const beat=()=>{if(i>=N){done(hit>=Math.ceil(N*.6)?"win":"lose");return}i++;t0=performance.now();rg.style.animation="none";void rg.offsetWidth;rg.style.animation="mgring .9s linear forwards";T.push(setTimeout(beat,1100))};
  A.querySelector(".mgrh").onclick=()=>{const d=performance.now()-t0;if(d>720&&d<1000&&!A._h){hit++;A._h=1;sfx100("thud",.4);A.querySelector("#mgsc").textContent=hit;A.querySelector("i").animate([{transform:"scale(1.4)"},{transform:"scale(1)"}],200)}};
  const clr=setInterval(()=>{A._h=0},1100);T.push(clr);T.push(setTimeout(beat,600))},
 hold(A,G,sub,done,T,zh){const sec=+G.a||5;sub.textContent=G.b+(zh?" · 按住按钮，让指针停在绿区":" · hold to keep the needle in the green");let v=50,down=false,ok=0;
  A.innerHTML='<div class="mghold"><div class="tr"><em></em><i></i></div><button class="hb">'+(zh?"按住":"HOLD")+'</button><p class="mgsm">0 / '+sec+'s</p></div>';const ndl=A.querySelector(".tr i"),p=A.querySelector(".mgsm"),hb=A.querySelector(".hb");
  const on=e=>{e.preventDefault();down=true},off=()=>{down=false};hb.addEventListener("pointerdown",on);["pointerup","pointerleave","pointercancel"].forEach(x=>hb.addEventListener(x,off));
  const tk=setInterval(()=>{v+=down?2.2:-2.6;v+=(Math.random()-.5)*3;v=Math.max(0,Math.min(100,v));ndl.style.left=v+"%";if(v>38&&v<68){ok+=.05;p.textContent=ok.toFixed(1)+" / "+sec+"s"}if(ok>=sec)done("win")},50);T.push(tk);T.push(setTimeout(()=>done(ok>=sec*.7?"win":"lose"),(sec+7)*1000))},
 whack(A,G,sub,done,T,zh){let sc=0,bad=0,left=20;sub.textContent=(zh?"点 "+G.a+"，别点 "+G.b+" · 20 秒得 10 分":"Tap "+G.a+", not "+G.b+" · 10 in 20s");
  A.innerHTML='<div class="mgwh">'+Array.from({length:9},(_,i)=>'<button data-i="'+i+'"></button>').join("")+'</div><p class="mgsm">⭐ <span>0</span> · ⏱ <em>20</em></p>';const B=[...A.querySelectorAll(".mgwh button")];
  const pop=()=>{const b=B[Math.floor(Math.random()*9)];if(b.textContent)return;const good=Math.random()<.72;b.textContent=good?G.a:G.b;b.dataset.g=good?1:0;T.push(setTimeout(()=>{b.textContent="";b.dataset.g=""},900))};
  T.push(setInterval(pop,450));T.push(setInterval(()=>{left--;A.querySelector("em").textContent=left;if(left<=0)done(sc>=10?"win":"lose")},1000));
  A.querySelector(".mgwh").onclick=e=>{const b=e.target.closest("button");if(!b||!b.textContent)return;if(b.dataset.g==="1"){sc++;sfx100("pop",.4)}else{sc=Math.max(0,sc-2);bad++}b.textContent="";A.querySelector("span").textContent=sc;if(sc>=10)done("win")}},
 wires(A,G,sub,done,T,zh){const cols=segs(G.a),ans=Math.floor(Math.random()*cols.length),others=cols.map((c,i)=>i).filter(i=>i!==ans);const no1=others[0],no2=others[1];
  const pos=i=>zh?["最左边","第二根","第三根","最右边"][i===cols.length-1?3:i]:["leftmost","second","third","rightmost"][i===cols.length-1?3:i];
  sub.textContent=(zh?"线索：不是 "+cols[no1]+"，也不是"+pos(no2!=null?no2:no1)+"那根。"+(cols.length>3?"也不是 "+cols[others[2]]+"。":"")+" 只有一次机会":"Clue: not "+cols[no1]+", not the "+pos(no2!=null?no2:no1)+(cols.length>3?", not "+cols[others[2]]:"")+". One cut.");
  A.innerHTML='<div class="mgwire">'+cols.map((c,i)=>'<button data-i="'+i+'"><span>'+c+'</span><i></i>✂</button>').join("")+'</div>';
  A.querySelector(".mgwire").onclick=e=>{const b=e.target.closest("button");if(!b)return;b.classList.add("cut");sfx100("zap",.5);T.push(setTimeout(()=>done(+b.dataset.i===ans?"win":"lose"),500))}},
 slide(A,G,sub,done,T,zh){let t=[1,2,3,4,5,6,7,8,0];const nb=i=>[i-3,i+3,i%3?i-1:-1,i%3<2?i+1:-1].filter(j=>j>=0&&j<9);let e0=8,last=-1;for(let k=0;k<14;k++){const c=nb(e0).filter(j=>j!==last),j=c[Math.floor(Math.random()*c.length)];[t[e0],t[j]]=[t[j],t[e0]];last=e0;e0=j}
  sub.textContent=zh?"把数字排成 1–8 · 60 秒":"Order 1–8 · 60s";const draw=()=>{A.innerHTML='<div class="mgsl">'+t.map((v,i)=>'<button data-i="'+i+'" class="'+(v?"":"em")+'">'+(v?'<small>'+G.a+'</small>'+v:"")+'</button>').join("")+'</div>'};draw();
  T.push(setTimeout(()=>done("lose"),60000));A.onclick=e=>{const b=e.target.closest("[data-i]");if(!b)return;const i=+b.dataset.i,z=t.indexOf(0);if(!nb(z).includes(i))return;[t[z],t[i]]=[t[i],t[z]];sfx100("blip",.3);draw();if(t.join()==="1,2,3,4,5,6,7,8,0")done("win")}},
 simon(A,G,sub,done,T,zh){const L=+G.a||5,C=["#EE6F97","#F0B77E","#7FC4A6","#8C6FE0"],F=[523,659,784,988],seq=Array.from({length:L},()=>Math.floor(Math.random()*4));let inp=[],len=2,busyS=true;
  sub.textContent=G.b+(zh?" · 记住后照着点":" · watch, then repeat");A.innerHTML='<div class="mgsi">'+C.map((c,i)=>'<button data-i="'+i+'" style="--c:'+c+'"></button>').join("")+'</div><p class="mgsm"></p>';const B=[...A.querySelectorAll(".mgsi button")],p=A.querySelector(".mgsm");
  const flash=i=>{B[i].classList.add("on");try{const c=BGM.ctx||(bgmInit()&&BGM.ctx),o=c.createOscillator(),g=c.createGain();o.frequency.value=F[i];o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(.08,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.35);o.start();o.stop(c.currentTime+.4)}catch(_){}setTimeout(()=>B[i].classList.remove("on"),320)};
  const show=()=>{busyS=true;inp=[];p.textContent=(zh?"看好 · ":"Watch · ")+len+"/"+L;seq.slice(0,len).forEach((s,k)=>T.push(setTimeout(()=>flash(s),600+k*560)));T.push(setTimeout(()=>{busyS=false;p.textContent=zh?"轮到你":"Your turn"},600+len*560))};show();
  A.querySelector(".mgsi").onclick=e=>{const b=e.target.closest("button");if(!b||busyS)return;const i=+b.dataset.i;flash(i);inp.push(i);if(seq[inp.length-1]!==i){done("lose");return}if(inp.length===len){if(len>=L){done("win");return}len++;T.push(setTimeout(show,500))}}},
 scratch(A,G,sub,done,T,zh){sub.textContent=zh?"用手指刮开":"Scratch it off";A.innerHTML='<div class="mgsc"><p>'+esc(G.b)+'</p><canvas></canvas></div>';const cv=A.querySelector("canvas"),W=280,H=160;cv.width=W;cv.height=H;const g=cv.getContext("2d");
  const gr=g.createLinearGradient(0,0,W,H);gr.addColorStop(0,"#B8A27A");gr.addColorStop(1,"#E8D7A8");g.fillStyle=gr;g.fillRect(0,0,W,H);g.font="34px serif";g.textAlign="center";g.fillText(G.a,W/2,H/2+12);g.globalCompositeOperation="destination-out";
  let dn=false,cnt=0;const sc=e=>{if(!dn)return;const r=cv.getBoundingClientRect(),x=(e.clientX-r.left)*W/r.width,y=(e.clientY-r.top)*H/r.height;g.beginPath();g.arc(x,y,18,0,6.28);g.fill();if(++cnt%15===0){const d=g.getImageData(0,0,W,H).data;let c=0;for(let i=3;i<d.length;i+=16)if(d[i]===0)c++;if(c/(d.length/16)>.55){cv.style.transition="opacity .5s";cv.style.opacity=0;T.push(setTimeout(()=>done("win"),900))}}};
  cv.addEventListener("pointerdown",e=>{dn=true;sc(e)});cv.addEventListener("pointermove",sc);["pointerup","pointerleave"].forEach(x=>cv.addEventListener(x,()=>dn=false))},
 dice(A,G,sub,done,T,zh){const R=+G.a||3;let me0=0,him=0,r=0;sub.textContent=G.b;const face=n=>"⚀⚁⚂⚃⚄⚅"[n-1];
  const draw=(a,b,msg)=>{A.innerHTML='<div class="mgdi"><div><small>'+(zh?"你":"You")+'</small><b>'+(a?face(a):"🎲")+'</b><em>'+me0+'</em></div><div><small>'+(zh?"他":"Him")+'</small><b>'+(b?face(b):"🎲")+'</b><em>'+him+'</em></div></div><p class="mgsm">'+(msg||"")+'</p><button class="btn btn-p btn-block" data-roll="1">🎲 '+(zh?"掷":"Roll")+'</button>'};draw();
  A.onclick=e=>{if(!e.target.closest("[data-roll]"))return;const a=1+Math.floor(Math.random()*6),b=1+Math.floor(Math.random()*6);sfx100("dice",.6);if(a>b)me0++;else if(b>a)him++;else{draw(a,b,zh?"平局，再来":"Tie — again");return}r++;
   const need=Math.ceil(R/2+.01);draw(a,b);if(me0>=need||him>=need||r>=R)T.push(setTimeout(()=>done(me0>him?"win":"lose"),700))}},
 order(A,G,sub,done,T,zh){const W=G.a.split("/");let got=[],miss=0;sub.textContent=zh?"按顺序点，拼回原话 · 可以错 2 次":"Tap in order · 2 mistakes allowed";
  const draw=()=>{A.innerHTML='<div class="mgor"><p>'+got.map(i=>esc(W[i])).join(zh?"":" ")+'<span>▍</span></p><div>'+A._o.map(i=>got.includes(i)?'':'<button data-i="'+i+'">'+esc(W[i])+'</button>').join("")+'</div></div>'};A._o=shuf(W.map((_,i)=>i));draw();
  A.onclick=e=>{const b=e.target.closest("[data-i]");if(!b)return;const i=+b.dataset.i;if(W[i]===W[got.length]){got.push(i);sfx100("blip",.3);draw();if(got.length===W.length)T.push(setTimeout(()=>done("win"),500))}else{miss++;b.classList.add("no");if(miss>2)done("lose")}}},
 catch(A,G,sub,done,T,zh){sub.textContent=(zh?"左右拖动篮子：接 "+G.a+"，躲 "+G.b+" · 接 12 个":"Drag the basket: catch "+G.a+", dodge "+G.b);A.innerHTML='<div class="mgca"><canvas></canvas></div><p class="mgsm">⭐ <span>0</span> / 12</p>';
  const cv=A.querySelector("canvas"),W=300,H=320;cv.width=W;cv.height=H;const g=cv.getContext("2d");let bx=W/2,sc=0,its=[],alive=true;
  cv.addEventListener("pointermove",e=>{const r=cv.getBoundingClientRect();bx=(e.clientX-r.left)*W/r.width});cv.addEventListener("pointerdown",e=>{const r=cv.getBoundingClientRect();bx=(e.clientX-r.left)*W/r.width});
  T.push(setInterval(()=>its.push({x:20+Math.random()*(W-40),y:-20,g:Math.random()<.75,v:2+Math.random()*2}),600));T.push(setTimeout(()=>{alive=false;done(sc>=12?"win":"lose")},30000));
  const step=()=>{if(!alive||!MGX)return;g.clearRect(0,0,W,H);g.font="26px serif";g.textAlign="center";its.forEach(it=>{it.y+=it.v;g.fillText(it.g?G.a:G.b,it.x,it.y)});
   its=its.filter(it=>{if(it.y>H-40&&it.y<H-10&&Math.abs(it.x-bx)<34){if(it.g){sc++;sfx100("pop",.3)}else{sc=Math.max(0,sc-3);sfx100("thud",.4)}A.querySelector("span").textContent=sc;if(sc>=12){alive=false;done("win")}return false}return it.y<H+20});
   g.font="34px serif";g.fillText("🧺",bx,H-14);requestAnimationFrame(step)};requestAnimationFrame(step)},
 balance(A,G,sub,done,T,zh){const sec=+G.a||8;sub.textContent=G.b+(zh?" · 点左右两侧把它扶正，坚持 "+sec+" 秒":" · tap left/right to keep it level for "+sec+"s");let a=0,v=0,el=0;
  A.innerHTML='<div class="mgba"><button data-s="-1">‹</button><div class="bb"><i>🍷</i></div><button data-s="1">›</button></div><p class="mgsm">0 / '+sec+'s</p>';const bb=A.querySelector(".bb");
  A.onclick=e=>{const b=e.target.closest("[data-s]");if(b)v+=+b.dataset.s*-1.4};
  T.push(setInterval(()=>{v+=(Math.random()-.5)*.6+a*.03;a+=v;v*=.96;bb.style.transform="rotate("+a+"deg)";el+=.05;A.querySelector(".mgsm").textContent=el.toFixed(1)+" / "+sec+"s";if(Math.abs(a)>40)done("lose");else if(el>=sec)done("win")},50))},
 quiz(A,G,sub,done,T,zh){const bank=shuf(MG_Q[G.a]||MG_Q.heart).slice(0,3);let i=0,ok=0;const seed=mgHash((S.threads[curT]||{}).wid||"x"+G.id);
  const draw=()=>{const q=bank[i];sub.textContent=(zh?"第 ":"Q")+(i+1)+"/3 · "+(zh?"答对 2 题就算赢":"2 right to win");A.innerHTML='<div class="mgq"><p>'+esc(q[0])+'</p>'+shuf([1,2]).map(k=>'<button data-k="'+k+'">'+esc(q[k])+'</button>').join("")+'</div>'};draw();
  A.onclick=e=>{const b=e.target.closest("[data-k]");if(!b)return;const q=bank[i],right=["case","court","wine","fae","star","sport","music","cook"].includes(G.a)?1:((seed+i)%3===2?2:1);
   if(+b.dataset.k===right){ok++;b.classList.add("ok");sfx100("success",.3)}else b.classList.add("no");i++;T.push(setTimeout(()=>{if(i>=3)done(ok>=2?"win":"lose");else draw()},600))}}};
(function(){const st=document.createElement("style");st.textContent=`
.mg60{position:fixed;inset:0;z-index:90;background:rgba(8,6,12,.82);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:16px}
.mgbox{width:100%;max-width:400px;background:#17131F;border:1px solid rgba(240,183,126,.3);border-radius:22px;padding:16px;position:relative;color:#fff}
.mghd{display:flex;align-items:center;justify-content:space-between}.mghd b{font-size:16px}.mghd button{background:none;border:1px solid rgba(255,255,255,.2);color:#B4ABBF;border-radius:999px;padding:6px 12px;font-size:12.5px}
.mgsub{font-size:12.5px;color:#C9BFD6;margin:8px 0 12px;line-height:1.5}.mgsm{font-size:12px;color:#9C93A8;text-align:center;margin:8px 0 0}
.mgres[hidden]{display:none!important}.mgres{position:absolute;inset:0;background:#17131F;border-radius:22px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px}.mgbig{font-size:54px}.mgres b{font-size:18px}
.mgbar{height:4px;background:rgba(255,255,255,.1);border-radius:4px;margin-top:10px;overflow:hidden}.mgbar i{display:block;height:100%;background:#F0B77E;width:100%}@keyframes mgbar{to{width:0}}
.mgfind{display:grid;grid-template-columns:repeat(6,1fr);gap:5px}.mgfind button{aspect-ratio:1;font-size:22px;background:rgba(255,255,255,.05);border:0;border-radius:10px}.mgfind .no{opacity:.25}
.mgmem{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.mgmem button{aspect-ratio:3/4;border-radius:12px;border:0;background:linear-gradient(135deg,#3A2C4E,#241B33);font-size:28px}.mgmem span{opacity:0;transition:.2s}.mgmem .up span{opacity:1}.mgmem .up{background:#2B2238}
.mgcode{display:flex;gap:10px;justify-content:center;margin-bottom:8px}.mgcode span{width:46px;height:56px;border-radius:12px;background:rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800}
.mgfb{text-align:center;color:#F0B77E;font-size:18px;letter-spacing:.3em;margin-bottom:8px}.mgpad{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.mgpad button{height:46px;border-radius:12px;border:0;background:rgba(255,255,255,.08);color:#fff;font-size:18px}
.mgrh{position:relative;height:220px;display:flex;align-items:center;justify-content:center}.mgrh i{font-size:46px;font-style:normal}.mgrh .rg{position:absolute;width:60px;height:60px;border:3px solid #EE6F97;border-radius:50%;opacity:0}@keyframes mgring{from{transform:scale(3.4);opacity:.2}to{transform:scale(1);opacity:1}}
.mghold .tr{position:relative;height:18px;border-radius:9px;background:linear-gradient(90deg,#EE6F6F 0 38%,#7FC4A6 38% 68%,#EE6F6F 68%);margin:26px 0}.mghold .tr i{position:absolute;top:-6px;width:4px;height:30px;background:#fff;border-radius:2px;left:50%}
.mghold .hb{display:block;margin:0 auto;width:120px;height:120px;border-radius:50%;border:0;background:radial-gradient(circle,#F0B77E,#EE6F97);color:#1B1017;font-weight:900;font-size:18px;touch-action:none;user-select:none}
.mgwh{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.mgwh button{aspect-ratio:1;border-radius:50%;border:0;background:rgba(255,255,255,.06);font-size:34px}
.mgwire{display:flex;justify-content:space-around;height:220px}.mgwire button{background:none;border:0;display:flex;flex-direction:column;align-items:center;gap:6px;color:#fff;font-size:16px}.mgwire i{flex:1;width:6px;border-radius:3px;background:currentColor;opacity:.7}.mgwire .cut i{background:linear-gradient(#fff 0 45%,transparent 45% 55%,#fff 55%)}
.mgsl{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;max-width:260px;margin:0 auto}.mgsl button{aspect-ratio:1;border-radius:12px;border:0;background:linear-gradient(135deg,#3A2C4E,#2A2038);color:#fff;font-size:22px;font-weight:800;position:relative}.mgsl small{position:absolute;top:4px;left:6px;font-size:12px;opacity:.6}.mgsl .em{background:transparent}
.mgsi{display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:260px;margin:0 auto}.mgsi button{aspect-ratio:1;border-radius:20px;border:0;background:var(--c);opacity:.35;transition:.1s}.mgsi .on{opacity:1;transform:scale(.96);box-shadow:0 0 24px var(--c)}
.mgsc{position:relative;width:280px;height:160px;margin:0 auto;border-radius:14px;overflow:hidden;background:#F6EEDC;color:#3A2C1E;display:flex;align-items:center;justify-content:center;text-align:center;padding:14px;font-size:16px;font-weight:700}.mgsc canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none}
.mgdi{display:flex;justify-content:space-around;margin:10px 0}.mgdi div{display:flex;flex-direction:column;align-items:center}.mgdi b{font-size:60px;line-height:1.1}.mgdi em{font-style:normal;color:#F0B77E;font-weight:800}
.mgor p{min-height:44px;font-size:18px;text-align:center;margin:0 0 12px}.mgor span{animation:mgbl 1s steps(2) infinite;color:#F0B77E}@keyframes mgbl{50%{opacity:0}}.mgor div{display:flex;flex-wrap:wrap;gap:7px;justify-content:center}.mgor button{padding:9px 14px;border-radius:12px;border:1px solid rgba(240,183,126,.4);background:rgba(240,183,126,.08);color:#fff;font-size:15px}.mgor .no{animation:fxsh .3s;--shk:4px}
.mgca canvas{width:100%;max-width:300px;display:block;margin:0 auto;background:rgba(255,255,255,.03);border-radius:14px;touch-action:none}
.mgba{display:flex;align-items:center;justify-content:space-between;height:200px}.mgba>button{width:64px;height:120px;border-radius:16px;border:0;background:rgba(255,255,255,.07);color:#fff;font-size:30px}.mgba .bb{width:150px;height:8px;background:#F0B77E;border-radius:4px;position:relative;transition:transform .05s}.mgba .bb i{position:absolute;left:50%;top:-38px;transform:translateX(-50%);font-size:32px;font-style:normal}
.mgq p{font-size:16px;line-height:1.5;margin:0 0 12px}.mgq button{display:block;width:100%;margin-bottom:8px;padding:13px;border-radius:14px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:#fff;font-size:15px;text-align:left}.mgq .ok{border-color:#7FC4A6;background:rgba(127,196,166,.2)}.mgq .no{border-color:#EE6F6F;background:rgba(238,111,111,.15)}`;document.head.appendChild(st)})();
/* ---------- story wiring ---------- */
STOPK.add("mg");
const _stopHTML60=stopHTML;
stopHTML=function(th){const b=th.pk.stop;if(!b||b[1]!=="mg")return _stopHTML60(th);const d=b[2]||{},G=MG100.find(x=>x.id===d.id),zh=CL()==="zh";if(!G)return _stopHTML60(th);
 return '<div class="sttag">🎮 '+(zh?"小游戏":"Mini-game")+'</div><div class="stcard"><div class="grow"><b>'+esc(zh?G.zh:G.en)+'</b><span>'+(zh?"玩赢了会影响剧情 · 不想玩可以直接跳过":"Winning changes the scene · skip anytime")+'</span></div></div>'+
  '<button class="btn btn-p btn-block" data-mgplay="1">▶ '+(zh?"玩一下":"Play")+'</button><button class="stskip" data-mgno="1">'+(zh?"跳过，继续剧情":"Skip, keep reading")+' ›</button>'};
function mgResult(th,d,r){const G=MG100.find(x=>x.id===d.id)||{},zh=CL()==="zh",ex=[];
 if(r==="win"){pkSet(th,"mg_"+d.id.replace(/^g_/,"")+"_win");try{const P=dimMain(th);if(P)dimAdd(th,P.a+"|"+P.b,{att:2,tru:1},(zh?"小游戏：":"Game: ")+(zh?G.zh:G.en))}catch(_){}
  ex.push(["sys","event",{icon:"🎮",title:{zh:"小游戏成功",en:"Mini-game won"},txt:{zh:G.zh+" · 成功",en:G.en+" · won"}}]);(d.win||[]).forEach(x=>ex.push(x))}
 else if(r==="lose"){ex.push(["n","act",zh?"差了一点点——但故事没有停下。":"Not quite — but the story keeps going."]);(d.lose||[]).forEach(x=>ex.push(x))}
 else (d.skip||d.lose||[]).forEach(x=>ex.push(x));
 th.pk.mgN=(th.pk.mgN||0)+1;save();return ex}
document.addEventListener("click",e=>{const th=S.threads[curT];if(!th||!th.pk||!th.pk.stop||th.pk.stop[1]!=="mg")return;const d=th.pk.stop[2]||{};
 if(e.target.closest("[data-mgplay]")){mgOpen(d.id,r=>stopResolve(th,mgResult(th,d,r)));return}
 if(e.target.closest("[data-mgno]"))stopResolve(th,mgResult(th,d,"skip"))});
function mgMatch(txt){const s=String(txt||"").toLowerCase();let best=null,bs=0;MG100.forEach(g=>g.kw.forEach(k=>{if(k&&k.length>=2&&s.includes(k.toLowerCase())&&k.length>bs){bs=k.length;best=g}}));return best}
/* keyword pop: at most one auto game per chapter, never in the first lines, never while skipping */
const _pkAppend60=pkAppend;pkAppend=function(th,m){const r=_pkAppend60(th,m);try{if(S.autoGames!==false&&th.pk&&curT===th.id&&!PKSKIP[th.id]&&m&&m.who!=="me"&&th.pk.q){const key="c"+th.pk.ch;th.pk.mgAuto=th.pk.mgAuto||{};
  if(!th.pk.mgAuto[key]&&(th.pk.lineN=(th.pk.lineN||0)+1)>3){const G=mgMatch(m.txt);if(G&&!th.pk.q.some(b=>Array.isArray(b)&&b[1]==="mg")){th.pk.mgAuto[key]=G.id;th.pk.q.unshift(["sys","mg",{id:G.id,auto:1}]);save()}}}}catch(_){}return r};
const _packOpen60=typeof packOpen==="function"?packOpen:null;
