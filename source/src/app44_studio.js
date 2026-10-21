/* ---- v144 · 角色工作室: building a character is a conversation, not a form ----
   Three panes on one page: 💬 AI guide · 📝 template · 👁 live preview (side by side on wide screens, tabs + a live strip on phones).
   The guide asks one thing at a time (who / what they call you / how you're tied / what kind of story / where) with tap-to-answer chips,
   and every answer is written INTO the template by the AI itself — no copy-paste. Any field stays editable; the preview redraws as you type.
   A checklist shows what's still missing; tapping it makes the guide ask about exactly that.
   After publishing, "✏️ 继续打磨" reopens the same studio, and feedback from real chats shows up there. */
const LL=(zh,en)=>S.lang==="zh"?zh:en;
const SD_F=[["name","名字","Name"],["age","年龄","Age"],["callYou","他怎么叫你","What they call you"],["role","身份","Who they are"],["rel","你们的关系","How you two are tied"],
 ["style","故事风格","Story style"],["setting","场景背景","Setting"],["looks","外貌","Looks"],["vibe","性格","Personality"],["tells","小动作 / 口头禅","Tells & habits"],["secret","秘密 / 软肋","Secret / weak spot"],["opening","开场白","Opening line"]];
const SD_NEED=["name","callYou","role","rel","style","setting","looks","vibe","tells","secret","opening"];
const ARCH={
 boss:{k:/霸总|总裁|老板|ceo|boss|tycoon/i,zh:"霸总",en:"Billionaire boss",age:31,gong:"强势攻",
  role:["集团掌权人，三十一岁从父亲手里接下整个集团","Runs the family conglomerate; took the chair from his father at thirty-one"],
  looks:["一米八七，深灰定制西装，袖扣是旧银的；眉骨很高，看人时像在估价","Six-two, charcoal bespoke suit, old-silver cufflinks; high brow, looks at people like he's pricing them"],
  vibe:["冷静、强势、说一不二；对谁都没耐心，唯独对你例外，并且死不承认","Calm, commanding, final; patient with no one except you — and he'll never admit it"],
  tells:["心烦时把袖扣转半圈 / 说「随你」的时候其实最在意","Turns a cufflink half a turn when rattled / says 'suit yourself' when it matters most"],
  lookEn:"a handsome man in his early thirties, sharp jaw, slicked dark hair, charcoal bespoke suit, old silver cufflinks, cold assessing gaze"},
 senior:{k:/学长|冰山|学霸|senior|ice/i,zh:"冰山学长",en:"Ice-cold senior",age:24,gong:"冰山攻",
  role:["医学院博士生，你的直系学长，实验室钥匙只有他有","Med-school PhD, your assigned senior; the only one with the lab key"],
  looks:["白衬衫袖口挽到小臂，银框眼镜，手指很长，身上有很淡的消毒水味","White shirt sleeves rolled to the forearm, silver glasses, long fingers, faint smell of antiseptic"],
  vibe:["话少、挑剔、讲规矩；会把你写错的地方全部圈出来，然后在页脚写一句「下次别熬夜」","Few words, exacting, by the book; circles every mistake you make, then writes 'stop pulling all-nighters' in the margin"],
  tells:["推眼镜代表他在忍笑 / 只在你面前说「嗯」以外的字","Pushes up his glasses when he's trying not to smile / says more than 'mm' only to you"],
  lookEn:"a handsome man in his mid twenties, silver-rimmed glasses, white shirt sleeves rolled up, neat dark hair, calm unreadable expression"},
 mafia:{k:/黑道|少主|帮派|黑帮|mafia|mob/i,zh:"黑道少主",en:"Mob heir",age:28,gong:"偏执攻",
  role:["港口家族的继承人，白天经营酒店，夜里处理「家里的事」","Heir to the harbor family; runs hotels by day, handles 'family business' by night"],
  looks:["黑衬衫不扣最上面两颗，左手虎口一道旧疤，笑起来很好看但眼睛不笑","Black shirt with the top two buttons open, an old scar on his left hand, a beautiful smile that never reaches his eyes"],
  vibe:["礼貌、危险、护短；对外人一句废话都没有，对你却总多解释一句","Polite, dangerous, fiercely protective; wastes no words on anyone, yet always explains one more thing to you"],
  tells:["想动手之前会先把袖子挽好 / 叫你名字时声音会低半度","Rolls his sleeves neatly before trouble / his voice drops half a step when he says your name"],
  lookEn:"a handsome man in his late twenties, black shirt open at the collar, scar on his left hand, dangerous charming smile, dark harbor night"},
 idol:{k:/偶像|顶流|明星|爱豆|idol|star/i,zh:"顶流偶像",en:"Top-billed idol",age:25,gong:"傲娇攻",
  role:["出道七年的顶流，热搜常客，私下连外卖都不敢点","Seven years at the top; lives on the trending list and can't even order takeout in peace"],
  looks:["染回黑色的头发、耳骨上三颗耳钉，镜头前笑得很甜，镜头外眼下有青","Hair dyed back to black, three cartilage studs, sweet on camera, tired shadows off it"],
  vibe:["镜头前完美，镜头后嘴硬又黏人；最怕你觉得他只是个「人设」","Flawless on camera, prickly and clingy off it; terrified you think he's just an image"],
  tells:["紧张时会哼歌 / 发消息喜欢连发三条再撤回一条","Hums when nervous / texts three times in a row, then unsends one"],
  lookEn:"a handsome man in his mid twenties, black hair, three ear piercings, stage-ready face, tired eyes, backstage lights"},
 noble:{k:/贵族|落魄|少爷|noble|aristocrat/i,zh:"落魄贵族",en:"Fallen aristocrat",age:29,gong:"禁欲攻",
  role:["没落世家最后的继承人，守着一栋快卖掉的老宅和一屋子账单","Last heir of a faded old family, guarding a house about to be sold and a desk full of bills"],
  looks:["旧但熨得笔挺的大衣，手腕上一块停了的怀表，举止好得让人不舒服","An old but perfectly pressed coat, a stopped pocket watch on his wrist, manners so good they're unsettling"],
  vibe:["骄傲、克制、宁折不弯；欠你一次人情会记一辈子","Proud, restrained, unbending; owes you one favor and will remember it for life"],
  tells:["说谎时会把表盖合上 / 从不让你看见他数钱","Snaps the watch shut when he lies / never lets you see him count money"],
  lookEn:"a handsome man around thirty, worn but immaculate long coat, aristocratic posture, stopped pocket watch, dim old mansion"},
 yandere:{k:/病娇|竹马|偏执|yandere|obsess/i,zh:"病娇竹马",en:"Obsessive childhood friend",age:26,gong:"病娇攻",
  role:["从小一起长大的邻居，现在是你公司楼下咖啡店的老板——你不记得什么时候开的","The boy next door you grew up with; now owns the café under your office — you don't remember when it opened"],
  looks:["围裙系得很整齐，笑起来有虎牙，手机屏保至今是你们十二岁的合照","Neatly tied apron, a crooked-tooth smile, his lock screen is still a photo of you two at twelve"],
  vibe:["温柔、周到、无处不在；他记得你的一切，包括你没告诉他的","Gentle, thoughtful, everywhere; remembers everything about you — including what you never told him"],
  tells:["你提别人名字时他会停顿半拍再笑 / 总是「刚好路过」","Pauses half a beat before smiling when you mention someone else / is always 'just passing by'"],
  lookEn:"a handsome man in his mid twenties, soft smile, neat apron, warm café light, slightly too intense eyes"},
 doctor:{k:/医生|禁欲|外科|doctor|surgeon/i,zh:"禁欲医生",en:"Restrained surgeon",age:33,gong:"禁欲攻",
  role:["心外科最年轻的主刀，连续三十个小时不睡也不会手抖","Youngest lead cardiac surgeon; thirty hours awake and his hands still don't shake"],
  looks:["深蓝手术服外面套白大褂，手很干净，喉结上有一颗小痣","White coat over navy scrubs, very clean hands, a small mole on his throat"],
  vibe:["冷淡、精准、不碰规则以外的东西——直到碰到你","Cool, precise, touches nothing outside the rules — until you"],
  tells:["洗手时间比别人长十秒 / 说「我很忙」的时候在等你挽留","Washes his hands ten seconds longer than anyone / says 'I'm busy' while waiting for you to ask him to stay"],
  lookEn:"a handsome man in his early thirties, white coat over navy scrubs, clean precise hands, tired calm eyes, hospital corridor at night"}};
const REL={sec:["新入职的秘书","His new assistant","你是他刚招进来的秘书，第一天就迟到了四分钟","You're his brand-new assistant and you were four minutes late on day one"],
 rival:["商业对手","Business rival","你们在同一个项目上竞标，谁赢谁就吞掉对方","You're bidding on the same deal; whoever wins swallows the other"],
 contract:["合约情侣","Contract couple","一纸合约，三个月，假装恋人——他定的规矩第一条是「别当真」","A contract: three months of pretending to date. His rule #1: don't take it seriously"],
 ex:["前任重逢","Exes, reunited","五年前你不告而别，现在你们在同一张会议桌两端","You left without a word five years ago. Now you're across the same table"],
 room:["死对头室友","Rival roommates","合租合同签了一年，你们连冰箱都要划线","A one-year lease, and you've drawn a line down the fridge"],
 save:["救命恩人","He saved your life","他把你从车祸现场拖出来，然后消失了；你找了他半年","He pulled you out of a wreck and vanished; you've looked for him for six months"]};
const STY={dark:["暗黑系","Dark","他的温柔都有代价，你迟早要知道是什么","His tenderness has a price, and you'll find out what it is","他手上有一条人命，和你家有关","There's a death on his hands, and it's tied to your family"],
 e2l:["敌人变恋人","Enemies to lovers","你们恨得越认真，后来就爱得越狼狈","The harder you hate now, the messier the falling later","他恨你，是因为他早就输给你了","He hates you because he lost to you long ago"],
 clash:["强冲突","High conflict","每一场对话都像谈判，每一次让步都要换点什么","Every conversation is a negotiation; every inch given costs something","他手里握着能毁掉你的东西，一直没用","He holds something that could ruin you, and has never used it"],
 slow:["慢热拉扯","Slow burn","谁都不说破，靠近一步，退半步","No one says it. One step closer, half a step back","他其实很早就认出了你","He recognized you long before he let on"],
 sweet:["甜宠","Sweet & doting","他嘴上嫌麻烦，手却一直在替你挡","Complains you're trouble while quietly shielding you from everything","他偷偷存着你送过的每一样小东西","He secretly kept every little thing you ever gave him"],
 regret:["追妻火葬场","Groveling arc","他先犯了错，接下来整个故事都是他在补","He messed up first; the whole story is him making it right","当年让你走的人，就是他自己","The one who made you leave back then was him"]};
const SET={family:["家族企业","Family empire","顶楼办公室，落地窗外是整座城","A top-floor office, the whole city beyond the glass"],city:["现代都市","Modern city","凌晨的便利店门口，雨刚停","Outside a 24-hour store at 2 a.m., just after rain"],
 startup:["创业公司","Startup","开放式办公区，白板上写满没删掉的方案","An open-plan office, whiteboards full of plans nobody erased"],mansion:["豪门老宅","Old-money mansion","长廊尽头的书房，壁炉还没熄","The study at the end of a long hall, the fire still going"],
 campus:["校园","Campus","图书馆闭馆前十分钟，只剩你们两个","Ten minutes before the library closes; just the two of you"],show:["娱乐圈","Showbiz","后台化妆间，门外全是尖叫","A backstage dressing room, screaming fans beyond the door"]};
const CALLS=[["直呼你的名字","your first name","{me}"],["宝贝","baby","宝贝"],["小朋友","kid","小朋友"],["X秘书 / 职位","your title","林秘书"],["喂","hey, you","喂"],["全名","your full name","{me}"]];
const NAMES={m:[["陆沉","Rhys Calloway"],["顾言深","Damien Hale"],["沈砚","Julian Thorne"],["傅时野","Cole Ashford"],["江屿","Ezra Lane"],["霍霆","Silas Ward"]],f:[["苏晚","Vivian Hale"],["林栖","Clara Wynn"],["沈月","Margot Lane"]]};
const OPEN={sec:["*他没抬头，钢笔在合同上停了一下。* 迟到四分钟。{call}，第一天就打算让我等？","*He doesn't look up; the pen stops mid-signature.* Four minutes late. {call} — planning to make me wait on day one?"],
 rival:["*他把你的方案翻到最后一页，轻轻合上。* 写得不错。可惜，{call}，这一单是我的。","*He flips your proposal to the last page and closes it gently.* Not bad. Shame, {call} — this deal is mine."],
 contract:["*他把合约推到你面前，指尖点在第一条。* 别当真，{call}。签吧。","*He slides the contract over, one finger on clause one.* Don't take it seriously, {call}. Sign."],
 ex:["*会议室里所有人都在等他开口。他只看着你。* 好久不见，{call}。你瘦了。","*The whole room waits for him to speak. He only looks at you.* Long time, {call}. You've lost weight."],
 room:["*冰箱门上那条胶带被撕开了一半。* {call}，你又过线了。","*The tape line on the fridge is half peeled off.* {call}. You crossed the line again."],
 save:["*他转身就要走，又停住。* 找了我半年？{call}，你不该来。","*He turns to go, then stops.* Six months looking for me? {call}, you shouldn't have come."]};
const SDREPLY={dark:["*他看了你很久。* {call}，这句话你最好想清楚再说。","*He studies you for a long moment.* {call}, think hard before you say that again."],e2l:["*他冷笑一声，却没走。* 你就这点本事？","*A cold laugh — but he doesn't leave.* That's all you've got?"],
 clash:["*他把杯子放下，声音很轻。* 条件呢，{call}？","*He sets the glass down, voice quiet.* And your terms, {call}?"],slow:["*他移开视线。* ……随你。","*He looks away.* ...Suit yourself."],
 sweet:["*他叹了口气，把外套搭在你肩上。* 麻烦。","*He sighs and drapes his jacket over your shoulders.* Trouble."],regret:["*他喉结动了一下。* 我知道我没资格。可是，{call}——","*His throat works.* I know I don't get to ask. But, {call}—"]};
let SD=null,SDT="chat";
function sdNew(edit){const c=edit&&ch(edit);SD=c&&c.studio?JSON.parse(JSON.stringify(c.studio)):{name:"",age:"",g:"m",callYou:"",role:"",rel:"",style:"",setting:"",looks:"",vibe:"",tells:"",secret:"",opening:"",gong:[],shou:[],pair:"bl",img:null,chat:[],step:0,filled:{},ver:0};
 SD.edit=edit||null;if(edit){SD.chat=SD.chat||[];SD.chat.push({who:"ai",txt:LL("回来打磨「"+SD.name+"」。改哪里都行，「预览」会马上更新。","Back to polish "+SD.name+". Change anything; the preview updates instantly.")});const fb=(S.fix||{})[edit]||[];if(fb.length)SD.chat.push({who:"ai",txt:LL("对话里收到的反馈：","Feedback from your chats: ")+fb.slice(-4).map(f=>"「"+f.tags.join("、")+(f.txt?"："+f.txt:"")+"」").join(" ")+LL("。要不要据此调整性格或小动作？","  Want to adjust personality or tells for this?"),chips:[["vibe",LL("改性格","Edit personality")],["tells",LL("改小动作","Edit tells")]]})}
 else sdAsk(0)}
function createStudio(edit){sdNew(edit);SDT="chat";sdRender()}
/* ---------- the guide ---------- */
const SDQ=[
 {k:"concept",q:["想创建一个什么样的角色？一句话就行——比如「生成一个霸总角色形象」。","What kind of character? One line is enough — e.g. 'a billionaire boss'."],chips:()=>Object.entries(ARCH).map(([k,a])=>[k,LL(a.zh,a.en)])},
 {k:"g",q:["他是男生还是女生？","Are they a man or a woman?"],chips:()=>[["m",LL("男 · 他","Man · he")],["f",LL("女 · 她","Woman · she")]]},
 {k:"callYou",q:["{He}平时怎么称呼你？这一句会决定你们说话的温度。","What does {he} call you? It sets the temperature of every line."],chips:()=>CALLS.map((c,i)=>[String(i),LL(c[0],c[1])])},
 {k:"rel",q:["你们是什么关系？是新入职的秘书、商业对手，还是合约情侣？","How are you two tied — new assistant, business rival, contract couple?"],chips:()=>Object.entries(REL).map(([k,r])=>[k,LL(r[0],r[1])])},
 {k:"style",q:["剧情想走哪条路？暗黑系、敌人变恋人，还是强冲突？","Which way should the story run — dark, enemies-to-lovers, high conflict?"],chips:()=>Object.entries(STY).map(([k,r])=>[k,LL(r[0],r[1])])},
 {k:"setting",q:["故事发生在哪？家族企业、现代都市，还是创业公司？","Where does it happen — family empire, the city, a startup?"],chips:()=>Object.entries(SET).map(([k,r])=>[k,LL(r[0],r[1])])},
 {k:"side",q:["要不要再加一个配角？三个人的关系更有戏——配角会真的进入剧情、制造冲突、改变你们的走向。","Add a supporting character? A third person makes it dramatic — they'll step into the story, cause trouble, change where you two go."],chips:()=>Object.entries(SIDE).map(([k,r])=>[k,LL(r[0],r[1])]).concat([["_none",LL("先不要","Not now")]])},
 {k:"voice",q:["最后，给{him}挑个声音。旁白也可以单独选——角色负责说话，旁白交代动作和环境，像广播剧一样。","Last: pick {his} voice. The narrator gets its own — the character speaks, the narrator sets the scene, like a radio drama."],chips:()=>voxFor().map(([k,r])=>[k,LL(r[0],r[1])])}];
const SIDE={rival:["情敌","Love rival","和你抢{him}的人，偏偏条件比你好","Wants {him} too — and looks better on paper","制造冲突"],ex:["{his}前任","{His} ex","分手分得不干净，最近又回来了","The breakup was never clean, and now they're back","搅局"],
 moon:["白月光","The one who got away","{he}心里放了很多年的人，一出现气氛就变了","Someone {he} carried for years; the room changes when they walk in","改变走向"],bro:["{his}兄弟","{His} best friend","嘴上损{him}，背地里推你们一把","Roasts {him} to {his} face, pushes you two together behind {his} back","助攻"],
 boss:["家族长辈","The family elder","掌握{his}未来的人，不认可你","Holds {his} future in their hands — and doesn't approve of you","施压"],villain:["隐藏反派","Hidden villain","对你很好，好得有点不对劲","Very kind to you — a little too kind","隐藏反派"]};
const SIDEN={m:[["周砚","Leo Hart"],["许骁","Max Rourke"],["秦朗","Owen Vance"]],f:[["温黎","Sienna Cole"],["夏棠","Iris Moore"]]};
const VOX={deep:["低沉磁性","Deep & velvet",{pitch:.9,rate:.96},{exaggeration:.45,cfgw:.5,temperature:.7,seed:911}],cool:["清冷少年","Cool & clear",{pitch:1.06,rate:1},{exaggeration:.4,cfgw:.55,temperature:.65,seed:922}],
 warm:["温柔低语","Warm & soft",{pitch:1,rate:.95},{exaggeration:.5,cfgw:.5,temperature:.75,seed:933}],
 f_sweet:["甜美清亮","Sweet & bright",{pitch:1.12,rate:1},{exaggeration:.55,cfgw:.5,temperature:.8,seed:966}],f_queen:["御姐低音","Low & poised",{pitch:1,rate:.95},{exaggeration:.5,cfgw:.5,temperature:.75,seed:977}],f_cool:["清冷疏离","Cool & distant",{pitch:1.06,rate:.97},{exaggeration:.4,cfgw:.55,temperature:.65,seed:988}],lazy:["慵懒沙哑","Lazy & husky",{pitch:.94,rate:.93},{exaggeration:.6,cfgw:.45,temperature:.85,seed:944}],sharp:["凌厉强势","Sharp & commanding",{pitch:.96,rate:1.02},{exaggeration:.7,cfgw:.4,temperature:.8,seed:955}]};
function voxFor(){return Object.entries(VOX).filter(([k])=>SD&&SD.g==="f"?k.startsWith("f_")||k==="warm":!k.startsWith("f_"))}
const LIBMAP={boss:"m_boss",senior:"m_senior",mafia:"m_mafia",idol:"m_idol",noble:"m_noble",yandere:"m_cafe",doctor:"m_doctor"};
function libKeys(){const L=window.STUDIO_LIB||{};const ks=Object.keys(L).filter(k=>k.startsWith(SD&&SD.g==="f"?"f_":"m_"));const rec=LIBMAP[SD&&SD.arch];return rec&&ks.includes(rec)?[rec].concat(ks.filter(k=>k!==rec)):ks}
const NVOX={radio:["电台男声","Late-night radio",{pitch:.92,rate:.94}],film:["电影旁白","Film narrator",{pitch:.97,rate:.96}],soft:["温柔女声","Soft female",{pitch:1.08,rate:.97}],noir:["冷静悬疑","Cool noir",{pitch:.9,rate:.92}],off:["关闭旁白配音","Narrator off",null]};
const SDQX={name:["给{him}起个名字？或者让我来。","Give {him} a name — or let me."],looks:["{He}长什么样？说一个最让人记住的细节就够。","What do {they} look like? One unforgettable detail is enough."],vibe:["{He}是什么性格？对别人和对你，有什么不一样？","What's {his} personality — and how is it different with you?"],
 tells:["{He}有什么小动作或口头禅？情绪藏不住的时候会做什么？","Any habits or catchphrases — what gives {him} away?"],secret:["{He}有什么不能说的秘密，或者软肋？","What secret or weak spot is {he} hiding?"],opening:["你们见面的第一句话，{he}会说什么？","What's the very first thing {he} says to you?"],
 age:["{He}多大？","How old are {they}?"],role:["{He}是做什么的？","What does {he} do?"],rel:SDQ[3].q,style:SDQ[4].q,setting:SDQ[5].q,callYou:SDQ[2].q};
function pron(s){const f=SD&&SD.g==="f";return String(s).replace(/\{He\}/g,LL(f?"她":"他",f?"She":"He")).replace(/\{he\}/g,LL(f?"她":"他",f?"she":"he")).replace(/\{him\}/g,LL(f?"她":"他",f?"her":"him")).replace(/\{his\}/g,LL(f?"她的":"他的",f?"her":"his")).replace(/\{they\}/g,LL(f?"她":"他",f?"she":"he"))}
function sdAsk(i){SD.step=i;const q=SDQ[i];if(!q){sdFinish();return}SD.chat.push({who:"ai",txt:pron(LL(q.q[0],q.q[1])),chips:q.chips().concat([["_skip",LL("你帮我决定","You decide")]]),k:q.k})}
function sdAskField(f){const q=SDQX[f];if(!q)return;SD.chat.push({who:"ai",txt:pron(LL(q[0],q[1])),k:"f:"+f,chips:f==="name"?[["_auto",LL("帮我起一个","Pick one for me")]]:[["_auto",LL("帮我写","Write it for me")]]})}
function sdFill(o,quiet){const got=[];for(const k in o){if(o[k]==null||o[k]==="")continue;SD[k]=o[k];SD.filled[k]=Date.now();got.push(k)}
 if(got.length&&!quiet){const lab=got.filter(k=>SD_F.find(f=>f[0]===k)).map(k=>{const f=SD_F.find(x=>x[0]===k);return LL(f[1],f[2])});if(lab.length)SD.chat.push({who:"sys",txt:"✓ "+LL("已自动填入：","Filled in: ")+lab.join(LL("、",", "))})}
 SD.newFill=(SD.newFill||0)+got.length;return got}
function sdTxt(v){return Array.isArray(v)?LL(v[0],v[1]):v}
function sdHe(s){return SD.g==="f"&&S.lang==="zh"?String(s).replace(/他/g,"她"):SD.g==="f"?String(s).replace(/\bHe\b/g,"She").replace(/\bhe\b/g,"she").replace(/\bhis\b/g,"her").replace(/\bhim\b/g,"her").replace(/\bHis\b/g,"Her"):s}
function sdAnswer(k,val,label){SD.chat.push({who:"me",txt:label||val});const i=SD.step,auto=val==="_skip";
 if(String(k).startsWith("f:")){const f=k.slice(2);if(val==="_auto")sdAutoField(f);else{sdFill({[f]:f==="age"?(parseInt(val)||25):val})}sdNext();return}
 if(k==="concept"){let a=ARCH[val];if(!a&&!auto)a=Object.values(ARCH).find(x=>x.k.test(val));if(!a)a=auto?ARCH.boss:null;
  if(a){SD.arch=Object.keys(ARCH).find(x=>ARCH[x]===a);sdFill({role:sdTxt(a.role),looks:sdTxt(a.looks),vibe:sdTxt(a.vibe),tells:sdTxt(a.tells),age:a.age,gong:[a.gong]});SD.lookEn=a.lookEn}
  else{SD.arch="custom";sdFill({role:val});SD.lookEn=""}
  sdAutoLook();
  SD.chat.push({who:"ai",txt:LL("好，先定一个底子。我追问几个细节，这样人物会更立体——随时可以在「模板」里改。","Good — that's the base. A few questions to make them real; edit the template any time.")});sdAsk(1);return}
 if(k==="g"){SD.g=auto?"m":val;if(SD.imgLib&&!SD.imgLib.startsWith(SD.g==="f"?"f_":"m_")){SD.img=null;SD.imgLib=null}sdAutoLook();if(SD.voice&&(SD.g==="f")!==SD.voice.startsWith("f_"))SD.voice=null;["role","looks","vibe","tells"].forEach(f=>SD[f]=sdHe(SD[f]));sdAsk(2);return}
 if(k==="callYou"){const c=CALLS[auto?0:+val];sdFill({callYou:c?c[2].replace("{me}",me()):val});sdAsk(3);return}
 if(k==="rel"){const r=REL[auto?"contract":val];if(r){SD.relK=auto?"contract":val;sdFill({rel:LL(r[2],r[3])})}else sdFill({rel:val});sdAsk(4);return}
 if(k==="style"){const s=STY[auto?"slow":val];if(s){SD.styK=auto?"slow":val;sdFill({style:LL(s[0],s[1])+" — "+LL(s[2],s[3]),secret:sdHe(LL(s[4],s[5]))})}else sdFill({style:val});sdAsk(5);return}
 if(k==="setting"){const s=SET[auto?"city":val];if(s){SD.setK=auto?"city":val;sdFill({setting:LL(s[0],s[1])+" · "+LL(s[2],s[3])})}else sdFill({setting:val});sdAsk(6);return}
 if(k==="side"){if(val!=="_none"){const key=auto?"rival":val,r=SIDE[key];const g=key==="rival"||key==="ex"||key==="moon"?(SD.g==="f"?"m":"f"):"m";const N=SIDEN[g],n=N[hash(SD.name+key)%N.length];
   SD.side=r?{k:key,name:LL(n[0],n[1]),g,rel:pron(LL(r[0],r[1])),role:pron(LL(r[2],r[3])),fn:r[4]}:{k:"custom",name:"",g:"m",rel:val,role:val,fn:""};SD.filled.side=Date.now();
   SD.chat.push({who:"sys",txt:"✓ "+LL("已加入配角：","Supporting character added: ")+SD.side.name+" · "+SD.side.rel})}sdAsk(7);return}
 if(k==="voice"){SD.voice=VOX[val]?val:"deep";SD.nvoice=SD.nvoice||"film";SD.filled.voice=Date.now();SD.chat.push({who:"sys",txt:"✓ "+LL("配音：","Voice: ")+LL(VOX[SD.voice][0],VOX[SD.voice][1])+LL(" · 旁白："," · narrator: ")+LL(NVOX[SD.nvoice][0],NVOX[SD.nvoice][1])});try{sdVoiceTry(SD.voice)}catch(_){}sdAsk(8);return}}
function sdVoiceTry(k,narr){try{speechSynthesis.cancel();const P=narr?NVOX[k]:VOX[k];if(!P||!P[2])return;const u=new SpeechSynthesisUtterance(narr?LL("雨停了。他站在门口，没有进来。","The rain stopped. He stood in the doorway and didn't come in."):String(SD.opening||LL("你来了。","You came.")).replace(/\*[^*]*\*/g,"").trim()||LL("你来了。","You came."));u.lang=LTAG[S.lang];u.pitch=P[2].pitch;u.rate=P[2].rate;speechSynthesis.speak(u)}catch(_){}}
function sdAutoLook(){if(SD.img)return;const k=libKeys()[0];if(!k)return;SD.img=STUDIO_LIB[k];SD.imgLib=k;SD.filled.img=Date.now();SD.chat.push({who:"sys",txt:"✓ "+LL("已自动匹配形象和头像（可在「预览」里换）","Matched a portrait & avatar (change it in Preview)")})}
function sdAutoField(f){const N=NAMES[SD.g]||NAMES.m,n=N[hash(String(Date.now()))%N.length];
 const o={name:LL(n[0],n[1]),age:(ARCH[SD.arch]||{}).age||27,opening:sdOpening(),secret:sdHe(LL((STY[SD.styK||"slow"])[4],(STY[SD.styK||"slow"])[5])),looks:sdTxt((ARCH[SD.arch]||ARCH.boss).looks),vibe:sdTxt((ARCH[SD.arch]||ARCH.boss).vibe),tells:sdTxt((ARCH[SD.arch]||ARCH.boss).tells),
  role:sdTxt((ARCH[SD.arch]||ARCH.boss).role),callYou:me(),rel:LL(REL.contract[2],REL.contract[3]),style:LL(STY.slow[0],STY.slow[1]),setting:LL(SET.city[0],SET.city[1])};sdFill({[f]:sdHe(o[f])})}
function sdOpening(){const o=OPEN[SD.relK||"contract"]||OPEN.contract;return sdHe(LL(o[0],o[1])).replace(/\{call\}/g,SD.callYou||me())}
function sdSideLine(){const k=SD.side&&SD.side.k,L={rival:["*门被推开。* 打扰了？我还以为这里只有我们两个。","*The door swings open.* Am I interrupting? I thought it was just the two of us."],ex:["*一个熟悉的声音从身后传来。* 好久不见。你换口味了？","*A familiar voice behind you.* Long time. Changed your taste?"],
 moon:["*{he}的手停在半空——门口站着一个人。*","*{His} hand stops midair — someone is standing in the doorway.*"],bro:["*有人吹了声口哨。* 哟，难得见你对谁这么有耐心。","*Someone whistles.* Well. Never seen you this patient with anyone."],boss:["*老人放下茶杯。* 这位是？","*The elder sets down the teacup.* And who is this?"],villain:["*TA 递来一杯热茶，笑得很温和。* 别怕，有我在。","*They hand you a hot tea, smiling gently.* Don't worry. I'm here."]}[k];return L?pron(LL(L[0],L[1])):""}
function sdMissing(){return SD_NEED.filter(k=>!String(SD[k]||"").trim())}
function sdFinish(){const g={};if(!SD.name){const N=NAMES[SD.g]||NAMES.m,n=N[hash(SD.role+SD.rel)%N.length];g.name=LL(n[0],n[1])}if(!SD.age)g.age=(ARCH[SD.arch]||{}).age||27;if(!SD.opening)g.opening=sdOpening();
 sdFill(g);SD.step=99;const miss=sdMissing();
 SD.chat.push({who:"ai",txt:LL("人物成形了：","They're taking shape: ")+SD.name+"，"+SD.age+LL("岁。","")+(miss.length?LL(" 还缺「"+miss.map(k=>SD_F.find(f=>f[0]===k)[1]).join("、")+"」，点一下我继续问。"," Still missing: "+miss.join(", ")+" — tap one and I'll ask."):LL(" 去「预览」里试聊一句，不满意就直接改模板。"," Try a line in the preview; edit the template if anything feels off.")),
  chips:miss.map(k=>["_ask:"+k,"＋ "+LL(SD_F.find(f=>f[0]===k)[1],SD_F.find(f=>f[0]===k)[2])]).concat(liveOn()?[["_polish","✨ "+LL("AI 整体润色","AI polish everything")+" · "+payTag("polish")]]:[])});
 if(liveOn()&&SD.arch==="custom")sdPolish(true)}
function sdNext(){if(SD.step<SDQ.length)sdAsk(SD.step+1>SDQ.length?99:SD.step);else sdFinish()}
/* live AI: rewrite every field richer (or build a custom concept from scratch) and auto-fill */
async function sdPolish(free){if(!liveOn()){toast(LL("需要开启实时 AI","Live AI is off"));return}if(!free&&!payGo("polish"))return;
 SD.chat.push({who:"ai",txt:LL("正在润色……","Polishing…"),busy:1});sdRender();
try{const r=await Promise.race([new Promise((_,rj)=>setTimeout(()=>rj("timeout"),25000)),ask("You help a user build an original adult (21+) romance character for an interactive drama app. Current draft (JSON): "+JSON.stringify({name:SD.name,age:SD.age,gender:SD.g,callYou:SD.callYou,role:SD.role,rel:SD.rel,style:SD.style,setting:SD.setting,looks:SD.looks,vibe:SD.vibe,tells:SD.tells,secret:SD.secret,opening:SD.opening})+
  "\nRewrite every field to be specific, sensory and in-character: concrete physical details, a personality that contradicts itself, two tells separated by ' / ', a secret that creates conflict, and an opening line of 1-2 sentences with *action* in asterisks that uses the callYou word and drops the user into the relationship. If the character is male and the user is in a BL story, keep his voice and situations male-coded and restrained. Keep the user's choices. Language: "+LANG_NAME[S.lang]+". Reply ONLY JSON with the same keys.",{modelTier:"default"})]);
  SD.chat=SD.chat.filter(m=>!m.busy);const o={};SD_F.forEach(([k])=>{if(r&&r[k]!=null&&String(r[k]).trim())o[k]=k==="age"?(parseInt(r[k])||SD.age):String(r[k])});sdFill(o);SD.chat.push({who:"ai",txt:LL("润色好了，模板里亮起来的是改过的地方。","Done — highlighted fields were rewritten.")})}
 catch(_){SD.chat=SD.chat.filter(m=>!m.busy);SD.chat.push({who:"ai",txt:LL("这次没连上 AI，模板保持原样。","Couldn't reach the AI; template unchanged.")})}sdRender()}
/* ---------- rendering ---------- */
function sdWide(){return false}
const _show44=show;show=function(id){_show44(id);const d=$("#dev");if(d&&id!=="s-studio")d.classList.remove("wide")};
function sdChatHTML(){return '<div class="sdchat" id="sdChat">'+SD.chat.map((m,i)=>m.who==="sys"?'<div class="sdsys">'+esc(m.txt)+'</div>':
 '<div class="sdm '+(m.who==="me"?"me":"ai")+'">'+(m.who==="ai"?'<i>✦</i>':'')+'<p>'+esc(m.txt)+'</p></div>'+(m.chips&&i===SD.chat.length-1?'<div class="sdchips">'+m.chips.map(([v,l])=>'<button data-sdc="'+esc(v)+'" data-sdk="'+esc(m.k||"")+'">'+esc(l)+'</button>').join("")+'</div>':"")).join("")+'</div>'+
 '<div class="sdin"><input id="sdIn" placeholder="'+esc(LL("直接打字回答，或者描述你想要的","Type an answer or describe what you want"))+'"><button data-sdsend="1">↑</button></div>'}
function sdTplHTML(){const miss=sdMissing(),done=SD_NEED.length-miss.length;
 return '<div class="sdprog"><b>'+LL("完成度","Complete")+' '+done+'/'+SD_NEED.length+'</b><div class="meter"><i style="width:'+(done/SD_NEED.length*100)+'%"></i></div>'+(miss.length?'<div class="sdmiss">'+LL("还缺：","Missing: ")+miss.map(k=>'<button data-sdask="'+k+'">'+esc(LL(SD_F.find(f=>f[0]===k)[1],SD_F.find(f=>f[0]===k)[2]))+'</button>').join("")+'</div>':'')+'</div>'+
 '<div class="field"><label>'+LL("性别","Gender")+'</label><div class="seg">'+[["m",LL("男","Man")],["f",LL("女","Woman")]].map(([k,l])=>'<button data-sdg="'+k+'" class="'+(SD.g===k?"on":"")+'">'+l+'</button>').join("")+'</div></div>'+
 SD_F.map(([k,zh,en])=>{const fresh=SD.filled[k]&&Date.now()-SD.filled[k]<4000,area=!["name","age","callYou"].includes(k);
  return '<div class="field sdf'+(fresh?" fresh":"")+'"><label for="sd_'+k+'">'+LL(zh,en)+(SD.filled[k]?'<em>✦ AI</em>':'')+'<button class="sdre" data-sdre="'+k+'" title="AI">↻</button></label>'+(area?'<textarea id="sd_'+k+'" data-sdf="'+k+'" rows="2">'+esc(SD[k]||"")+'</textarea>':'<input id="sd_'+k+'" data-sdf="'+k+'" value="'+esc(SD[k]||"")+'">')+'</div>'}).join("")+
 '<div class="sdsec">🎙 '+LL("配音","Voices")+'</div><div class="field"><label>'+LL("角色配音","Character voice")+'</label></div><div class="row wrap" style="gap:6px">'+voxFor().map(([k,v])=>'<button class="chip'+(SD.voice===k?" on":"")+'" data-sdvox="'+k+'">'+esc(LL(v[0],v[1]))+' ▶</button>').join("")+'</div>'+
 '<div class="field" style="margin-top:8px"><label>'+LL("旁白配音（交代动作与环境）","Narrator voice (actions & setting)")+'</label></div><div class="row wrap" style="gap:6px">'+Object.entries(NVOX).map(([k,v])=>'<button class="chip'+((SD.nvoice||"film")===k?" on":"")+'" data-sdnvox="'+k+'">'+esc(LL(v[0],v[1]))+(v[2]?' ▶':'')+'</button>').join("")+'</div>'+
 '<div class="sdsec">👥 '+LL("配角（可选）","Supporting character (optional)")+'</div><p class="xs faint" style="margin:-4px 0 8px">'+LL("配角会进入剧情：制造冲突、助攻，或者改变你们的关系走向。","They step into the story: cause conflict, help you along, or change where things go.")+'</p>'+
 '<div class="row wrap" style="gap:6px">'+Object.entries(SIDE).map(([k,r])=>'<button class="chip'+(SD.side&&SD.side.k===k?" on":"")+'" data-sdside="'+k+'">'+esc(pron(LL(r[0],r[1])))+'</button>').join("")+(SD.side?'<button class="chip" data-sdside="_none">✕ '+LL("不要配角","Remove")+'</button>':'')+'</div>'+
 (SD.side?'<div class="field" style="margin-top:8px"><label>'+LL("配角名字","Name")+'</label><input data-sdsf="name" value="'+esc(SD.side.name)+'"></div><div class="field"><label>'+LL("TA 在故事里做什么","What they do in the story")+'</label><textarea data-sdsf="role" rows="2">'+esc(SD.side.role)+'</textarea></div>':'')+
 '<div class="sdsec"></div><div class="field"><label>'+LL("攻 / 受 标签","Top / bottom tags")+'</label></div><div class="row wrap" style="gap:6px">'+GS_TAGS.gong.slice(0,10).map(x=>'<button class="chip'+((SD.gong||[]).includes(x)?" on":"")+'" data-sdtag="gong|'+x+'">'+esc(S.lang==="zh"?x:(GS_EN[x]||x))+'</button>').join("")+'</div>'}
function sdPrevHTML(){const p=SD.img||null,nm=SD.name||LL("未命名","Unnamed"),ini=esc(nm.slice(0,1));
 const port=p?'<div class="sdport" style="background-image:url(\''+p+'\')"></div>':'<div class="sdport ph"><b>'+ini+'</b></div>';
 return '<div class="sdcard">'+port+'<div class="sdcap"><h3>'+esc(nm)+(SD.age?' <small>'+esc(SD.age)+'</small>':'')+'</h3><p>'+esc((SD.role||"").slice(0,60))+'</p><div class="sdtags">'+[SD.style&&SD.style.split(" — ")[0],SD.rel&&REL[SD.relK]&&LL(REL[SD.relK][0],REL[SD.relK][1]),...(SD.gong||[])].filter(Boolean).map(x=>'<span>'+esc(x)+'</span>').join("")+'</div></div></div>'+
 '<div class="sdlook"><div class="sdavrow">'+(p?'<div class="av" style="width:46px;height:46px"><img src="'+p+'"></div>':'<div class="av sdav" style="width:46px;height:46px;font-size:18px">'+ini+'</div>')+'<div class="grow"><b>'+LL("形象 & 头像","Portrait & avatar")+'</b><span>'+(p?LL("头像会自动从形象里裁出来","The avatar is cropped from the portrait"):LL("还没有形象","No portrait yet"))+'</span></div></div>'+
 '<div class="sdlookbtns"><button data-sdlib="1">🖼 '+LL("形象库","Library")+'</button><label>📷 '+LL("上传照片","Upload")+'<input type="file" accept="image/*" id="sdUp" hidden></label><button data-sdimg="1">🎨 '+LL("AI 生成","AI generate")+' · '+payTag("portrait")+'</button></div></div>'+
 '<div class="sdlook"><b>🎙 '+LL("音色","Voice")+'</b><div class="row wrap" style="gap:6px;margin-top:8px">'+voxFor().map(([k,v])=>'<button class="chip'+(SD.voice===k?" on":"")+'" data-sdvox="'+k+'">'+esc(LL(v[0],v[1]))+' ▶</button>').join("")+'</div>'+
 '<b style="display:block;margin-top:10px;font-size:12.5px">'+LL("旁白","Narrator")+'</b><div class="row wrap" style="gap:6px;margin-top:6px">'+Object.entries(NVOX).map(([k,v])=>'<button class="chip'+((SD.nvoice||"film")===k?" on":"")+'" data-sdnvox="'+k+'">'+esc(LL(v[0],v[1]))+(v[2]?' ▶':'')+'</button>').join("")+'</div>'+
 (SD.opening?'<button class="btn btn-p btn-block btn-sm" style="margin-top:10px" data-sdplay="1">▶ '+LL("像广播剧一样听开场","Hear the opening like a radio drama")+'</button>':'')+'</div>'+
 '<div class="sdphone"><div class="sdph">'+(p?'<div class="av" style="width:26px;height:26px"><img src="'+p+'"></div>':'<div class="av sdav">'+ini+'</div>')+'<b>'+esc(nm)+'</b></div><div class="sdmsgs" id="sdMsgs">'+
 (SD.opening?'<div class="sdb them">'+fmtMix(esc(SD.opening))+'</div>':'<p class="xs faint" style="text-align:center;padding:20px">'+LL("开场白写好后，这里就是你们的聊天页","Once there's an opening line, this is your chat")+'</p>')+(SD.side&&SD.side.name&&SD.opening?'<div class="sdb side"><b>'+esc(SD.side.name)+' · '+esc(SD.side.rel)+'</b>'+fmtMix(esc(sdSideLine()))+'</div>':'')+(SD.try||[]).map(m=>'<div class="sdb '+m.w+'">'+fmtMix(esc(m.t))+'</div>').join("")+'</div>'+
 '<div class="sdin"><input id="sdTry" placeholder="'+esc(LL("试着跟"+(SD.g==="f"?"她":"他")+"说一句","Try saying something"))+'"><button data-sdtry="1">↑</button></div></div>'}
function sdRender(keepScroll){const wide=sdWide(),cs=$("#sdChat"),st=cs?cs.scrollTop:0;
 const tabs='<div class="sdtabs">'+[["chat","💬 "+LL("AI 引导","AI guide")],["tpl","📝 "+LL("模板","Template")+(SD.newFill&&SDT!=="tpl"?' <i class="sdbadge">+'+SD.newFill+'</i>':'')],["prev","👁 "+LL("预览","Preview")]].map(([k,l])=>'<button data-sdtab="'+k+'" class="'+(SDT===k?"on":"")+'">'+l+'</button>').join("")+'</div>';
 const strip='<div class="sdstrip" data-sdtab="prev">'+(SD.img?'<div class="av" style="width:34px;height:34px"><img src="'+SD.img+'"></div>':'<div class="av sdav" style="width:34px;height:34px">'+esc((SD.name||"?").slice(0,1))+'</div>')+'<div class="grow"><b>'+esc(SD.name||LL("未命名角色","Unnamed"))+'</b><span>'+esc((SD.role||LL("先在 AI 引导里说说你想要什么","Tell the guide what you want")).slice(0,34))+'</span></div><em>'+(SD_NEED.length-sdMissing().length)+'/'+SD_NEED.length+'</em></div>';
 const body=wide?'<div class="sdgrid"><section>'+sdChatHTML()+'</section><section class="scroll">'+sdTplHTML()+'</section><section class="scroll">'+sdPrevHTML()+'</section></div>':
  strip+tabs+'<div class="sdpane'+(SDT==="chat"?" chatp":"")+'">'+(SDT==="chat"?sdChatHTML():SDT==="tpl"?'<div class="scroll pad">'+sdTplHTML()+'</div>':'<div class="scroll pad">'+sdPrevHTML()+'</div>')+'</div>';
 if(SDT==="tpl"||wide)SD.newFill=0;
 screen("s-studio",'<div class="topbar"><button class="ibtn" data-back="1">'+ic("back")+'</button><h2 class="grow" style="font-size:18px">'+(SD.edit?LL("打磨角色","Polish character"):LL("角色工作室","Character studio"))+'</h2><button class="btn btn-p btn-sm" data-sdpub="1">'+(SD.edit?LL("保存","Save"):LL("发布","Publish"))+'</button></div>'+body);
 if($("#s-studio").hidden!==false||true)show("s-studio");const c2=$("#sdChat");if(c2)c2.scrollTop=keepScroll?st:c2.scrollHeight;const m2=$("#sdMsgs");if(m2)m2.scrollTop=m2.scrollHeight}
function sdLive(){const pv=$("#s-studio .sdgrid section:nth-child(3)")||(SDT==="prev"?$("#s-studio .sdpane .scroll"):null);if(pv)pv.innerHTML=sdPrevHTML();
 const s=$("#s-studio .sdstrip");if(s){s.querySelector("b").textContent=SD.name||LL("未命名角色","Unnamed");s.querySelector("em").textContent=(SD_NEED.length-sdMissing().length)+"/"+SD_NEED.length}
 const pg=$("#s-studio .sdprog b");if(pg)pg.textContent=LL("完成度","Complete")+" "+(SD_NEED.length-sdMissing().length)+"/"+SD_NEED.length}
document.addEventListener("input",e=>{const x=e.target.closest&&e.target.closest("[data-sdf]");if(!x||!SD)return;const k=x.dataset.sdf;SD[k]=k==="age"?x.value.replace(/\D/g,""):x.value;delete SD.filled[k];clearTimeout(sdLive._t);sdLive._t=setTimeout(sdLive,120)});
document.addEventListener("keydown",e=>{if(e.key!=="Enter"||!SD)return;if(e.target.id==="sdIn"){e.preventDefault();$("[data-sdsend]").click()}if(e.target.id==="sdTry"){e.preventDefault();$("[data-sdtry]").click()}});
document.addEventListener("click",async e=>{let x;if(!SD||!e.target.closest("#s-studio"))return;
 if(x=e.target.closest("[data-sdtab]")){SDT=x.dataset.sdtab;sdRender();return}
 if(x=e.target.closest("[data-sdc]")){const v=x.dataset.sdc,k=x.dataset.sdk;
  if(v.startsWith("_ask:")){sdAskField(v.slice(5));sdRender();return}if(v==="_polish"){sdPolish();return}
  if(k==="vibe"||k==="tells"||v==="vibe"||v==="tells"){SDT="tpl";sdRender();setTimeout(()=>{const f=$("#sd_"+v);f&&f.focus()},50);return}
  sdAnswer(k,v,x.textContent);sdRender();return}
 if(e.target.closest("[data-sdsend]")){const i=$("#sdIn"),v=(i.value||"").trim();if(!v)return;const last=[...SD.chat].reverse().find(m=>m.who==="ai"&&m.k);
  if(last&&(SD.step<SDQ.length||String(last.k).startsWith("f:"))&&SD.chat[SD.chat.length-1]===last)sdAnswer(last.k,v);else{SD.chat.push({who:"me",txt:v});sdFreeText(v)}sdRender();return}
 if(x=e.target.closest("[data-sdask]")){sdAskField(x.dataset.sdask);SDT="chat";sdRender();return}
 if(x=e.target.closest("[data-sdg]")){SD.g=x.dataset.sdg;["role","looks","vibe","tells","secret","opening"].forEach(f=>SD[f]=sdHe(SD[f]));sdRender(1);return}
 if(x=e.target.closest("[data-sdtag]")){const [g,v]=x.dataset.sdtag.split("|");SD[g]=SD[g]||[];SD[g]=SD[g].includes(v)?SD[g].filter(y=>y!==v):SD[g].concat(v);x.classList.toggle("on");sdLive();return}
 if(x=e.target.closest("[data-sdre]")){const k=x.dataset.sdre;if(liveOn()){if(!payGo("polish"))return;try{const r=await ask("Rewrite ONE field of an original adult romance character. Field: "+k+". Character so far: "+JSON.stringify({name:SD.name,age:SD.age,role:SD.role,rel:SD.rel,style:SD.style,looks:SD.looks,vibe:SD.vibe,tells:SD.tells,secret:SD.secret,callYou:SD.callYou,opening:SD.opening})+". Make it specific and sensory; opening uses *action*. Language: "+LANG_NAME[S.lang]+'. Reply ONLY JSON {"v":"..."}');if(r&&r.v)sdFill({[k]:String(r.v)},1)}catch(_){}}else sdAutoField(k);sdRender(1);return}
 if(e.target.closest("[data-sdtry]")){const i=$("#sdTry"),v=(i.value||"").trim();if(!v)return;SD.try=(SD.try||[]).concat({w:"me",t:v});i.value="";sdLive();let rep=null;
  if(liveOn()){try{const r=await ask("Stay fully in character as "+(SD.name||"this character")+" ("+SD.age+"): role "+SD.role+"; personality "+SD.vibe+"; tells "+SD.tells+"; relationship to the user "+SD.rel+"; style "+SD.style+"; calls the user '"+SD.callYou+"'. Their first line was: "+SD.opening+". The user replies: \""+v+"\". Answer in 1-2 short sentences with one *action*. Language: "+LANG_NAME[S.lang]+'. Reply ONLY JSON {"line":"..."}');rep=r&&r.line}catch(_){}}
  if(!rep){const P=SDREPLY[SD.styK||"slow"];rep=sdHe(LL(P[0],P[1])).replace(/\{call\}/g,SD.callYou||me())}SD.try.push({w:"them",t:rep});SD.try=SD.try.slice(-8);sdLive();return}
 if(e.target.closest("[data-sdlib]")){const ks=libKeys();sheet('<h2>🖼 '+LL("形象库","Portrait library")+'</h2><p class="sm dim" style="margin-top:4px">'+(ks.length?LL("挑一个最像他的。头像会自动裁好。","Pick the closest look. The avatar is cropped automatically."):LL("女性形象库还在补充中——先上传照片，或者用 AI 生成。","The female library is still being filled — upload a photo or use AI for now."))+'</p><div class="sdlib">'+ks.map((k,i)=>'<button data-sdpick="'+k+'" class="'+(SD.imgLib===k?"on":"")+'"><img src="'+STUDIO_LIB[k]+'">'+(i===0&&LIBMAP[SD.arch]===k?'<em>'+LL("推荐","Match")+'</em>':'')+'</button>').join("")+'</div>');return}
 if(e.target.closest("[data-sdplay]")){sdPlayOpening();return}
 if(e.target.closest("[data-sdimg]")){if(!AIG.mcp){toast(LL("AI 生成需要先连接绘图服务（登录 Claude 后可用）。现在可以先用形象库或上传照片。","AI portraits need the image connector (sign in to Claude). Use the library or upload for now."));return}if(!payGo("portrait"))return;toast(LL("正在画……","Painting…"));
  try{const prompt=("Cinematic vertical portrait photo of "+(SD.lookEn||(SD.g==="f"?"a beautiful woman":"a handsome man")+", "+(SD.age||27)+" years old")+". "+(isAscii(SD.looks)?SD.looks:"")+" Moody practical lighting, 85mm, shallow depth of field, photoreal, adult, fully clothed. No text.").replace(/\s+/g," ");
   const res=await AIG.mcp.callTool(AIG.srv,AIG.tool,{prompt,width:576,height:1024,num_inference_steps:24,randomize_seed:true},{cache:false});const src=aiImgFrom(res);if(!src)throw 0;
   const im=new Image();im.crossOrigin="anonymous";im.src=src;await im.decode();const cv=document.createElement("canvas");cv.width=432;cv.height=768;cv.getContext("2d").drawImage(im,0,0,432,768);SD.img=cv.toDataURL("image/jpeg",.8);sdRender(1)}catch(_){toast(LL("形象没画出来，稍后再试","Couldn't paint it — try again later"))}return}
 if(x=e.target.closest("[data-sdvox]")){SD.voice=x.dataset.sdvox;$$("[data-sdvox]").forEach(y=>y.classList.toggle("on",y===x));sdVoiceTry(SD.voice);return}
 if(x=e.target.closest("[data-sdnvox]")){SD.nvoice=x.dataset.sdnvox;$$("[data-sdnvox]").forEach(y=>y.classList.toggle("on",y===x));sdVoiceTry(SD.nvoice,1);return}
 if(x=e.target.closest("[data-sdside]")){const v=x.dataset.sdside;if(v==="_none")SD.side=null;else{const st0=SD.step;SD.step=6;sdAnswer("side",v,x.textContent);SD.chat.pop();SD.step=st0}sdRender(1);return}
 if(e.target.closest("[data-sdpub]")){sdPublish();return}});
document.addEventListener("input",e=>{const x=e.target.closest&&e.target.closest("[data-sdsf]");if(!x||!SD||!SD.side)return;SD.side[x.dataset.sdsf]=x.value;clearTimeout(sdLive._t);sdLive._t=setTimeout(sdLive,120)});
document.addEventListener("click",e=>{const x=e.target.closest("[data-sdpick]");if(!x||!SD)return;SD.img=STUDIO_LIB[x.dataset.sdpick];SD.imgLib=x.dataset.sdpick;closeSheet();sdRender(1)});
document.addEventListener("change",e=>{if(e.target.id!=="sdUp"||!SD||!e.target.files[0])return;shrink(e.target.files[0],d=>{SD.img=d;SD.imgLib=null;sdRender(1);toast(LL("形象已更新","Portrait updated"))})});
function sdPlayOpening(){try{speechSynthesis.cancel();const op=String(SD.opening||"");const parts=[];op.replace(/\*([^*]+)\*|([^*]+)/g,(m,a,b)=>{if(a&&a.trim())parts.push([1,a.trim()]);if(b&&b.trim())parts.push([0,b.trim()]);return m});
 const V=(VOX[SD.voice||(SD.g==="f"?"f_cool":"deep")]||VOX.deep)[2],N=(NVOX[SD.nvoice||"film"]||[])[2];
 parts.forEach(([nar,tx])=>{if(nar&&!N)return;const u=new SpeechSynthesisUtterance(tx);u.lang=LTAG[S.lang];const P=nar?N:V;u.pitch=P.pitch;u.rate=P.rate;speechSynthesis.speak(u)})}catch(_){toast(LL("这个浏览器不支持语音","Voice isn't supported in this browser"))}}
function sdFreeText(v){/* free typing: detect what it's about and auto-fill the matching field */
 const m=[[/叫我|称呼|call me/i,"callYou"],[/秘密|软肋|secret/i,"secret"],[/长得|外貌|头发|眼睛|look|hair|eyes/i,"looks"],[/性格|脾气|personality/i,"vibe"],[/口头禅|小动作|习惯|habit/i,"tells"],[/开场|第一句|opening/i,"opening"],[/名字|叫做|name/i,"name"]].find(([r])=>r.test(v));
 if(m){sdFill({[m[1]]:v.replace(/^.*?[:：]/,"")});SD.chat.push({who:"ai",txt:LL("记下了，已经放进模板。","Got it — it's in the template.")});return}
 if(liveOn()){SD.chat.push({who:"ai",txt:LL("我来理解一下……","Working that in…"),busy:1});(async()=>{try{const r=await Promise.race([new Promise((_,rj)=>setTimeout(()=>rj("timeout"),20000)),ask("A user is building a romance character. Draft: "+JSON.stringify({name:SD.name,role:SD.role,rel:SD.rel,style:SD.style,looks:SD.looks,vibe:SD.vibe,tells:SD.tells,secret:SD.secret,opening:SD.opening,callYou:SD.callYou})+". The user just said: \""+v+"\". Decide which fields this changes and rewrite only those (keys from the draft). Then write one short follow-up question about a detail still vague. Language: "+LANG_NAME[S.lang]+'. Reply ONLY JSON {"fields":{...},"ask":"..."}')]);
  SD.chat=SD.chat.filter(m=>!m.busy);if(r&&r.fields)sdFill(r.fields);if(r&&r.ask)SD.chat.push({who:"ai",txt:String(r.ask)})}catch(_){SD.chat=SD.chat.filter(m=>!m.busy)}sdRender()})();return}
 sdFill({vibe:(SD.vibe?SD.vibe+"；":"")+v});SD.chat.push({who:"ai",txt:LL("加进性格里了。还想补充哪一块？","Added to personality. Anything else?"),chips:sdMissing().slice(0,4).map(k=>["_ask:"+k,"＋ "+LL(SD_F.find(f=>f[0]===k)[1],SD_F.find(f=>f[0]===k)[2])])})}
function sdPublish(){const miss=["name","opening"].filter(k=>!String(SD[k]||"").trim());if(miss.length){toast(LL("至少需要名字和开场白","Needs at least a name and an opening line"));SDT="tpl";sdRender();return}
 const age=parseInt(SD.age)||25;if(age<21){toast(t("f.age21"));return}
 const x0=s=>({en:s,zh:s}),studio=JSON.parse(JSON.stringify(Object.assign({},SD,{try:[],chat:SD.chat.slice(-12)})));studio.ver=(SD.ver||0)+1;
 const data={n:SD.name,age,g:SD.g,role:x0(SD.role+(SD.rel?(S.lang==="zh"?"。与你："+SD.rel:". With you: "+SD.rel):"")),looks:x0(SD.looks),vibe:x0(SD.vibe),tells:{en:String(SD.tells||"").split(/\s*\/\s*/).filter(Boolean),zh:String(SD.tells||"").split(/\s*\/\s*/).filter(Boolean)},
  twist:x0(SD.style),likes:x0(SD.setting),secret:x0(SD.secret),pitch:x0("“"+String(SD.opening).replace(/\*[^*]*\*/g,"").trim()+"”"),solo:x0(SD.opening),callYou:SD.callYou,traits:{gong:SD.gong||[],shou:SD.shou||[]},studio,line0:{e2l:"rival",clash:"rival",dark:"danger",regret:"enemy"}[SD.styK]||"love"};
 const vx=VOX[SD.voice||"deep"];data.v=Object.assign({preset:SD.voice||"deep"},vx[2]);data.nv=SD.nvoice||"film";
 if(SD.edit&&S.mine.chars[SD.edit]){const id=SD.edit;Object.assign(S.mine.chars[id],data);if(SD.img)S.art[id]=SD.img;const w=S.mine.worlds[S.mine.chars[id].w];if(w&&!w.pack){w.title=x0(SD.name);w.hook=x0(SD.rel||SD.role);w.premise=x0(SD.role);w.status.place=x0((SD.setting||"").split(" · ").pop())}
  save();toast(LL("已保存（第 "+studio.ver+" 版）。之后的对话按新设定来","Saved (v"+studio.ver+"). Future replies use the new version"));SD=null;openChar(id);return}
 const id="u"+Date.now(),wid="uw"+Date.now(),or=SD.g==="f"?"gl":"bl",pal=[["#C98A6B","#1B1520"],["#7A63C9","#141024"],["#5E9E96","#13212A"]][hash(id)%3];
 S.mine.chars[id]=Object.assign({h:"",w:wid,pal,a:"charm",v:{pitch:1,rate:1},by:"@"+(me()||"you").toLowerCase(),likes:x0("")},data);if(SD.img)S.art[id]=SD.img;
 S.mine.worlds[wid]={id:wid,or,cover:null,pal,author:"@"+(me()||"you").toLowerCase(),official:false,stats:[0,0,0],heat:S.heat,cast:[id],tags:[SD.style&&SD.style.split(" — ")[0]].filter(Boolean),title:x0(SD.name),hook:x0(SD.rel||SD.role),premise:x0(SD.role+" "+SD.rel),you:x0(SD.rel),warn:x0(""),rel:[],status:{time:x0(""),place:x0((SD.setting||"").split(" · ").pop())},openings:[]};
 VOICEFP[id]=vx[3];S.mine.worlds[wid].nv=data.nv;
 if(SD.side&&SD.side.name){const sid="u"+(Date.now()+1);S.mine.chars[sid]={n:SD.side.name,age:Math.max(23,age-1),g:SD.side.g,h:"",w:wid,pal:[pal[1],pal[0]],a:"charm",v:{pitch:1,rate:1},by:"@"+(me()||"you").toLowerCase(),
   role:x0(SD.side.rel+(S.lang==="zh"?"。":". ")+SD.side.role),looks:x0(""),vibe:x0(SD.side.role),tells:{en:[],zh:[]},twist:x0(SD.side.fn||""),likes:x0(""),secret:x0(""),pitch:x0(SD.side.role),solo:x0(sdSideLine()||"…"),sideOf:id,sideFn:SD.side.fn||""};
  S.mine.chars[id].side=sid;S.mine.chars[id].sideLine=sdSideLine();S.mine.worlds[wid].cast.push(sid)}
 const wk={id,kind:"char",title:SD.name,at:Date.now(),seed:0};S.works.unshift(wk);save();SD=null;
 if(typeof taskClaimOnce==="function"&&taskClaimOnce("pubChar",3))toast(t("task.gotChar"));shareSheet(wk);setTimeout(()=>{closeSheet();openChar(id)},2200)}
createChar=function(){createStudio(null)};
Object.assign(PAY,{polish:1,portrait:2});
/* "✏️ keep polishing" on your own characters */
const _openChar44=openChar;openChar=function(id,keep){_openChar44(id,keep);try{if(S.mine.chars[id]){const r=$(".chatnow .row");if(r&&!r.querySelector("[data-sdedit]"))r.insertAdjacentHTML("beforeend",'<button class="btn btn-g" data-sdedit="'+id+'" title="'+LL("继续打磨","Polish")+'">✏️</button>')}}catch(_){}};
document.addEventListener("click",e=>{const x=e.target.closest("[data-sdedit]");if(x){closeSheet();createStudio(x.dataset.sdedit)}});
(function(){const st=document.createElement("style");st.textContent=`
.device.wide{max-width:1180px}#s-studio{display:flex;flex-direction:column}#s-studio[hidden]{display:none}
.sdstrip{display:flex;align-items:center;gap:10px;margin:0 16px 8px;padding:8px 12px;border-radius:14px;background:var(--panel);border:1px solid var(--line);text-align:left}
.sdstrip b{display:block;font-size:14px}.sdstrip span{display:block;font-size:11.5px;color:var(--dim,#aaa);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px}.sdstrip em{font-style:normal;font-weight:800;color:var(--gold)}
.sdav{display:grid;place-items:center;background:linear-gradient(135deg,#F0B77E,#EE6F97);color:#1B1017;font-weight:900;border-radius:50%;width:26px;height:26px}
.sdtabs{display:flex;gap:6px;margin:0 16px 8px}.sdtabs button{flex:1;padding:9px 0;border-radius:12px;background:var(--panel2);border:1px solid var(--line);font-size:13px;font-weight:700;color:var(--dim,#bbb)}.sdtabs button.on{background:rgba(240,183,126,.16);border-color:var(--gold);color:#fff}
.sdbadge{font-style:normal;background:var(--gold);color:#1B1017;border-radius:99px;padding:0 6px;font-size:11px;margin-left:3px;animation:sdpulse 1s ease 2}
@keyframes sdpulse{50%{transform:scale(1.25)}}
.sdpane{flex:1;min-height:0;display:flex;flex-direction:column}.sdpane>.scroll{flex:1}.sdpane.chatp{padding:0 12px 10px}
.sdgrid{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1.1fr 1fr;gap:10px;padding:0 12px 12px}.sdgrid>section{min-height:0;display:flex;flex-direction:column;background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:10px;overflow:auto}
.sdchat{flex:1;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:8px;padding:4px 2px 8px}
.sdm{display:flex;gap:6px;align-items:flex-start;max-width:90%}.sdm i{font-style:normal;color:var(--gold);margin-top:6px}.sdm p{padding:9px 12px;border-radius:14px;background:var(--panel2);line-height:1.6;font-size:14px}
.sdm.me{align-self:flex-end}.sdm.me p{background:linear-gradient(135deg,rgba(240,183,126,.3),rgba(238,111,151,.25))}
.sdsys{align-self:center;font-size:12px;color:#9FE3B6;background:rgba(80,200,140,.1);border:1px solid rgba(80,200,140,.3);padding:4px 10px;border-radius:99px}
.sdchips{display:flex;flex-wrap:wrap;gap:6px;padding-left:20px}.sdchips button{padding:7px 12px;border-radius:99px;border:1px solid var(--gold);background:rgba(240,183,126,.1);color:#F7D2A8;font-size:13px;font-weight:600}
.sdin{display:flex;gap:6px;margin-top:6px}.sdin input{flex:1;background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:10px 12px;outline:none;color:inherit}.sdin button{width:40px;border-radius:12px;background:var(--gold);color:#1B1017;font-weight:900}
.sdprog{padding:10px 12px;border-radius:14px;background:var(--panel2);margin-bottom:10px}.sdprog .meter{margin-top:6px}.sdmiss{margin-top:8px;font-size:12px;color:#bbb;display:flex;flex-wrap:wrap;gap:5px;align-items:center}.sdmiss button{padding:3px 9px;border-radius:99px;border:1px dashed var(--gold);color:var(--gold);font-size:12px}
.sdf label{display:flex;align-items:center;gap:6px}.sdf label em{font-style:normal;font-size:10px;color:var(--gold);border:1px solid rgba(240,183,126,.5);border-radius:6px;padding:0 4px}.sdre{margin-left:auto;font-size:14px;color:var(--gold);opacity:.8}
.sdf.fresh textarea,.sdf.fresh input{animation:sdfresh 2.2s ease}@keyframes sdfresh{0%,40%{border-color:var(--gold);box-shadow:0 0 0 3px rgba(240,183,126,.25)}100%{}}
.sdcard{border-radius:18px;overflow:hidden;position:relative;background:var(--panel2)}.sdport{aspect-ratio:4/3;background-size:cover;background-position:center}.sdport.ph{display:grid;place-items:center;background:radial-gradient(circle at 30% 20%,rgba(240,183,126,.5),transparent 60%),linear-gradient(160deg,#3a2433,#141019)}.sdport.ph b{font-size:64px;color:rgba(255,255,255,.85);font-family:Georgia,serif}
.sdcap{position:absolute;left:0;right:0;bottom:0;padding:40px 14px 12px;background:linear-gradient(transparent,rgba(0,0,0,.85))}.sdcap h3{font-size:22px}.sdcap h3 small{font-size:13px;opacity:.7}.sdcap p{font-size:12.5px;opacity:.85;margin-top:3px}
.sdtags{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}.sdtags span{font-size:11px;padding:2px 8px;border-radius:99px;background:rgba(255,255,255,.14)}
.sdphone{margin-top:10px;border-radius:18px;border:1px solid var(--line);background:#0E0C12;padding:8px}.sdph{display:flex;align-items:center;gap:8px;padding:4px 4px 8px;border-bottom:1px solid var(--line)}
.sdsec{margin:16px 0 8px;padding-top:12px;border-top:1px solid var(--line);font-weight:800;font-size:14px}.sdb.side{align-self:flex-start;border:1px dashed rgba(240,183,126,.5)}.sdb.side b{display:block;font-size:10.5px;color:var(--gold);margin-bottom:2px}
.sdlook{margin-top:10px;padding:12px;border-radius:16px;background:var(--panel2);border:1px solid var(--line)}.sdavrow{display:flex;align-items:center;gap:10px}.sdavrow b{display:block;font-size:14px}.sdavrow span{display:block;font-size:11.5px;color:#aaa}
.sdlookbtns{display:grid;grid-template-columns:1fr 1fr 1.3fr;gap:6px;margin-top:10px}.sdlookbtns>*{padding:9px 4px;border-radius:12px;background:rgba(255,255,255,.06);border:1px solid var(--line);font-size:12.5px;font-weight:700;text-align:center;cursor:pointer}
.sdlib{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.sdlib button{position:relative;border-radius:12px;overflow:hidden;border:2px solid transparent;aspect-ratio:3/4}.sdlib button.on{border-color:var(--gold)}.sdlib img{width:100%;height:100%;object-fit:cover}.sdlib em{position:absolute;left:6px;top:6px;font-style:normal;font-size:10px;font-weight:800;background:var(--gold);color:#1B1017;border-radius:6px;padding:1px 6px}
.sdmsgs{max-height:260px;overflow:auto;display:flex;flex-direction:column;gap:6px;padding:8px 2px}.sdb{max-width:84%;padding:8px 11px;border-radius:14px;font-size:13.5px;line-height:1.55;background:var(--panel2)}.sdb.me{align-self:flex-end;background:rgba(238,111,151,.25)}`;document.head.appendChild(st)})();
