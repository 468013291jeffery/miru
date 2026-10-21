#!/usr/bin/env python3
"""Style pass for afterhours_ch1_v4_s3 — starts from pre_style backup, writes the scene file."""
import json, copy, os
H = os.path.dirname(os.path.abspath(__file__))
src = json.load(open(f"{H}/pre_style/afterhours_ch1_v4_s3.json"))
d = copy.deepcopy(src)
Z, E = src["beats"]["zh"], src["beats"]["en"]

def n(zh, en): return (["n", "act", zh], ["n", "act", en])
def b(who, k, zh, en): return ([who, k, zh], [who, k, en])
def keep(i): return (copy.deepcopy(Z[i]), copy.deepcopy(E[i]))
def txt(i, zh, en):
    z, e = keep(i); z[2] = zh; e[2] = en; return (z, e)

# ---------- recall lock (info hook: the back of the note), reused in A/B/C ----------
def recall(teaser_zh, teaser_en, last_zh, last_en):
    beats = [
        n("⏪ 零点，吧台后面。Nico把纸条翻过来，凑近一根蜡烛。", "⏪ Midnight, behind the bar. Nico turned the note over and held it close to a candle."),
        n("背面一行字，被圆珠笔划了三道，笔尖几乎戳穿了纸。字比正面小，也潦草，像写完就后悔，又舍不得撕。", "One line on the back, struck through three times, the pen nearly through the paper. Smaller than the front, messier—written, regretted, and not torn up."),
        n("可每个字都还看得清：“如果你让我留下，我就不走了。”", "Every word still legible: \"If you ask me to stay, I won't go.\""),
        n("Nico当时只看了一眼，就把纸翻了回去。不是没看懂。是看懂了，才不敢看第二眼。", "Nico had looked once and flipped it back. Not because he didn't get it. Because he did, and didn't trust himself with a second look."),
        n(last_zh, last_en),
    ]
    mk = lambda li: {"title": ["纸条背面", "The Back of the Note"][li], "teaser": [teaser_zh, teaser_en][li], "price": 3, "recall": True,
                     "then": [x[li] for x in beats]}
    return (["n", "lock", mk(0)], ["n", "lock", mk(1)])

# ================= MAIN =================
M = []
M += [keep(0), keep(1), keep(2), keep(3), keep(4), keep(5)]
# entry bridge: why they're all upstairs, why nobody leaves, Ethan's knee (sets up the ice pack later)
M += [n("六个人是摸黑从地下室爬上来的。排水泵断了电，水停在第五级台阶上，不涨，也不退。",
        "The six of them had felt their way up from the basement. The pump was dead; the water had stopped at the fifth step—not rising, not falling.")]
M += [b("rowan", "say", "泵我修不了。手机没信号，雨不停，谁也出不去。",
        "I can't fix the pump. No signal, and with this rain nobody's getting out.")]
M += [b("ethan", "act", "Ethan一瘸一拐挪到凳子边，把伤腿往上一搭，护膝边缘肿起一圈。Mason伸手要扶，被他一胳膊挡开。",
        "Ethan limped to a stool and swung his bad leg up onto it, the skin puffing out around the brace. Mason reached to steady him; Ethan knocked the arm away.")]
M += [b("ethan", "say", "抬个桶而已。死不了。", "It was one keg. I'll live.")]
M += [keep(6), keep(7)]
# Theo's seat by flag — hinted_stay: approach, then cover
z8, e8 = keep(8)
z8[2]["then"][2] = ["theo", "say", "你在地下室说，第三排那个位子以后空了。……这话我记下了，回头跟你算。"]
e8[2]["then"][2] = ["theo", "say", "Down there you said the third-row seat would be empty from now on. ...I'm keeping that. We'll settle it later."]
M += [(z8, e8)]
M += [txt(9, "Wren把一个空绿玻璃瓶“咚”地拍在吧台上。西装外套搭在椅背，衬衫袖子卷到手肘，手腕上缠着两圈褪了色的皮绳。",
          "Wren slapped an empty green bottle down on the bar—thunk. Her blazer hung off a chair back, shirtsleeves rolled to the elbows, two faded leather cords round her wrist.")]
M += [keep(10), keep(11)]
M += [txt(12, "干坐着等雨停？停电不停局。转瓶子，真心话。", "Sit here and wait for the rain? Power's out, party's not. Spin the bottle. Truth only.")]
M += [b("wren", "say", "规矩：瓶口对着谁，谁答；瓶底对着谁，谁出题。撒谎的，罚他亲左手边那个。",
        "Rules: whoever the neck points at answers. Whoever the base points at asks. Lie, and you kiss whoever's on your left.")]
M += [b("mason", "act", "Mason嘟囔了一句“幼稚”，人却没走，反倒把凳子往桌边拖近了半尺——正对着Ethan。",
        "Mason muttered \"childish,\" but he didn't leave. He dragged his stool half a foot closer to the table instead—straight across from Ethan.")]
M += [keep(13)]
# the bottle: rigged (reader knows), lands neck->Nico, base->Wren; question grounded in s2 (the hand in the dark)
z14, e14 = keep(14)
for F, spin in ((z14[2], "绿玻璃瓶在吧台上飞转，先是嗡嗡蹭木头的声音，再是烛光在瓶身上一圈圈甩开。三圈，慢下来，晃了晃——瓶口稳稳对准了Nico。瓶底，正冲着Wren自己。"),
                (e14[2], "First the hum of glass skidding on wood, then the candlelight flung off it in rings. Three spins. Slower. A wobble—and the neck stopped dead on Nico. The base pointed straight back at Wren.")):
    for k in ("win", "lose"):
        F[k][0][2] = spin
z14[2]["win"][2][2] = z14[2]["lose"][2][2] = "哎呀，好巧。我出题。"
e14[2]["win"][2][2] = e14[2]["lose"][2][2] = "Oh no. What are the odds. I'm asking."
z14[2]["q"] = "停电那会儿，在地下室，摸黑抓着你胳膊不放的那只手——是谁的？"
e14[2]["q"] = "When the lights died down in the basement—whose hand was on your arm in the dark?"
M += [(z14, e14)]
M += [txt(15, "Nico。停电那会儿，在地下室，摸黑抓着你胳膊不放的那只手——是谁的？",
          "Nico. When the lights died down in the basement—whose hand was on your arm in the dark?")]
M += [keep(16), keep(17)]
z18, e18 = keep(18)
z18[2]["hint"] = "黑灯瞎火，谁也没看见。可Wren当时离你们不到两步，录音笔一直开着。"
e18[2]["hint"] = "Pitch black down there; nobody saw a thing. But Wren was two steps away, and her recorder never went off."
zo, eo = z18[2]["opts"], e18[2]["opts"]
zo[0]["t"] = "没看清。黑成那样，谁知道是谁。"
eo[0]["t"] = "Couldn't see. Pitch black—could've been anyone."
zo[0]["then"] = [["wren", "act", "Wren不紧不慢按了两下录音笔。杂音里，一个压得极低的男声：“……是我。”"],
                 ["wren", "say", "撒谎。罚。左手边那个——"],
                 ["n", "act", "Nico左手边坐着Mason。Mason手里还捏着根蜡烛，脸一黑：“想都别想。”Rowan咳了一声：“改罚酒。”"],
                 ["theo", "act", "Theo一言不发，倒了满满一杯推过去，杯底在吧台上磕得很重。下颌那道线，绷得能削纸。"]]
eo[0]["then"] = [["wren", "act", "Wren, in no hurry, clicked her recorder twice. Through the hiss, a man's voice, pitched very low: \"...It's me.\""],
                 ["wren", "say", "Liar. Penalty. Whoever's on your left—"],
                 ["n", "act", "On Nico's left sat Mason, still holding a candle. His face darkened. \"Don't even think about it.\" Rowan cleared his throat. \"Make it a shot.\""],
                 ["theo", "act", "Theo said nothing. He poured one to the brim and pushed it over, the glass hitting the bar harder than it needed to. His jaw was set sharp enough to cut paper."]]
zo[1]["t"] = "知道是谁。这题我不答。"
eo[1]["t"] = "I know whose. I'm not answering."
zo[1]["then"] = [["rowan", "say", "没撒谎，算过。——哦——————"],
                 ["theo", "act", "Theo没跟着起哄。他盯着Nico，喉结上下滚了一下，握杯的指节一点点泛白。"],
                 ["theo", "say", "……那只手挺糙的吧。你倒记得清楚。"],
                 ["n", "act", "说完他就低头去拨蜡烛芯，像那句话是别人说的。"]]
eo[1]["then"] = [["rowan", "say", "Not a lie. It counts. —Ohhhhhh."],
                 ["theo", "act", "Theo didn't join in. He watched Nico, throat working once, his knuckles going white around the glass."],
                 ["theo", "say", "...Rough hand, wasn't it. Funny what you remember."],
                 ["n", "act", "Then he bent to fiddle with a candle wick, like someone else had said it."]]
zo[2]["t"] = "Theo，你来答。是谁的？"
eo[2]["t"] = "Theo. You answer that one. Whose?"
zo[2]["then"] = [["theo", "act", "Theo愣了一秒，随即笑了。嘴角先勾起来，然后是眼角。烛光把他下巴上那层青色胡茬照得清清楚楚。"],
                 ["theo", "say", "我的。……黑成那样，总得抓个站得稳的。"],
                 ["n", "act", "他说得轻巧。可那只手搁在膝盖上，拇指一下一下蹭着自己的指腹，像还在找那块皮肤。"]]
eo[2]["then"] = [["theo", "act", "Theo froze for a beat—then smiled. Mouth first, then the corners of his eyes. Candlelight caught the dark stubble along his jaw."],
                 ["theo", "say", "Mine. ...Dark like that, you grab whoever's standing steady."],
                 ["n", "act", "He said it lightly. But that hand sat on his knee, thumb rubbing his own fingertips, as if it were still looking for that patch of skin."]]
M += [(z18, e18)]
# round two — Nico spins; neck Mason, base Ethan
M += [n("Nico伸手拨了第二轮。瓶子转得没那么久，晃了两下——瓶口停在Mason面前，瓶底对着Ethan。",
        "Nico gave the bottle the next spin. It didn't go as long; two wobbles—neck on Mason, base on Ethan.")]
M += [txt(19, "Ethan那条伤腿还直挺挺搭在凳子上，护膝的魔术贴半敞着。他坐直了，眼神像扑球前一样，钉死了对面。",
          "Ethan's bad leg was still propped straight on the stool, the brace's velcro half open. He sat up, eyes locked across the table like he was about to dive for a shot.")]
M += [txt(20, "该我问了。Mason，你去找教练之前，想没想过我得在板凳上坐一整季？",
          "My turn. Mason—before you went to the coach, did you think about me riding the bench for a whole season?")]
M += [txt(21, "Mason脱了泡湿的卫衣，里面那件旧球衣被肩膀撑得紧绷绷的。他低着头，两只拳头搁在膝盖上，越攥越紧。",
          "Mason had peeled off his soaked hoodie; the old jersey underneath strained across his shoulders. Head down, fists on his knees, squeezing tighter and tighter.")]
z22, e22 = keep(22)
z22[2]["txt"] = "Mason一拳砸在桌上，满桌蜡烛齐齐一歪：“想过。坐一季板凳，总比你三十岁走路拖着条腿强。那条腿废了，谁守我身后那扇门？”"
e22[2]["txt"] = "Mason's fist slammed the table; every candle on it lurched. \"I thought about it. One season on the bench beats you dragging that leg around at thirty. You wreck it, who's guarding the net behind me?\""
M += [(z22, e22), keep(23), keep(24), keep(25), keep(26)]
M += [b("ethan", "act", "Ethan没吭声。过了好一会儿，他抓起凳子上那条干毛巾扔过去，正砸在Mason手背上，眼睛还看着别处。",
        "Ethan said nothing. After a long moment he grabbed the dry towel off his stool and threw it; it hit the back of Mason's hand. He was still looking somewhere else.")]
M += [b("ethan", "say", "擦擦。血别滴我凳子上。", "Wipe that. Don't bleed on my stool.")]
M += [keep(27)]
# round three — the rig shows again; Theo dodges truth with a dare -> natural entry for the old recording
M += [n("Wren拨了第三轮。瓶口晃晃悠悠，停在Theo面前；瓶底，又冲着她自己。",
        "Wren spun the third round. The neck wobbled to a stop on Theo; the base, once again, on her.")]
M += [b("theo", "say", "这瓶子灌铅了吧。……大冒险。", "That bottle's weighted. ...Dare.")]
M += [b("wren", "say", "行。大冒险：我放段录音，你不许抢。", "Fine. Dare: I play you a recording, and you don't grab it.")]
M += [txt(28, "Wren按开录音笔，红灯一闪，指甲在屏幕上划了几下，翻出一个五年前的文件。",
          "Wren thumbed the recorder on; the red light blinked. A few swipes of her nail, and she'd pulled up a file from five years ago.")]
M += [keep(29), keep(30)]
z31, e31 = keep(31)
z31[2]["then"][0][2] = "Theo骂了一声扑过去抢，半个身子砸在Nico肩上。身上的雨水味和热气一起压过来。Wren笑着把录音笔举过头顶。"
e31[2]["then"][0][2] = "Theo swore and lunged for it, half his weight crashing onto Nico's shoulder—rain smell and body heat landing all at once. Laughing, Wren held the recorder high over her head."
z31[2]["then"][1][2] = "抢了啊，大冒险算你输。——“不管去哪儿”哦。我存了五年。"
e31[2]["then"][1][2] = "You grabbed. Dare's lost. —\"Wherever I end up.\" I've been saving that for five years."
M += [(z31, e31), keep(32), keep(33)]
z34, e34 = keep(34)
zo, eo = z34[2]["opts"], e34[2]["opts"]
zo[0]["t"] = "坐了五年。你以为我是冲那个暖气坏了的破剧场去的？"
eo[0]["t"] = "Five years in that seat. You think I went for a theater with a busted heater?"
zo[0]["then"] = [["theo", "say", "……那你冲什么去的？说清楚。"],
                 ["theo", "act", "Theo攥紧了杯子，指节发白，杯里的冰块磕着玻璃轻轻地响。他在等。"],
                 ["n", "act", "Nico没说清楚。他抄起冰夹，把一块冰夹成了两半。"]]
eo[0]["then"] = [["theo", "say", "...Then what did you go for? Say it."],
                 ["theo", "act", "Theo's knuckles went white on the glass, the ice ticking against it. He waited."],
                 ["n", "act", "Nico didn't say it. He picked up the tongs and snapped an ice cube clean in half."]]
zo[1]["then"] = [["theo", "say", "算数。每个字都算。"],
                 ["n", "act", "他说得又快又急，像怕慢一秒，Nico就会把那句话收回去。"],
                 ["theo", "say", "……我是说酒钱。回来喝，照样付。"]]
eo[1]["then"] = [["theo", "say", "They count. Every word."],
                 ["n", "act", "He said it fast, almost rough, like one second's delay and Nico would take it back."],
                 ["theo", "say", "...The bar tab part, I mean. I come back, I still pay."]]
M += [(z34, e34)]
M += [txt(35, "Wren一把拽住Theo的胳膊往角落拖：“Mason那一拳震灭了好几根。主角，过来帮我补上。”",
          "Wren hooked Theo's arm and hauled him toward the corner. \"Mason's fist killed half the candles. Guest of honor—help me relight them.\"")]
M += [keep(36), keep(37), keep(38), keep(39), keep(40), keep(41), keep(42)]
# info hook: one stroke only — paid off later as a ⏪ recall in A/B/C
M += [n("纸条背面还有一行，被圆珠笔狠狠划了三道。Nico看了一眼，喉结动了动，把纸翻了回去。",
        "There was one more line on the back, scored through three times in ballpoint. Nico looked once, swallowed, and turned the paper back over.")]
M += [keep(43), keep(44), keep(45)]
# high point: inner reaction after the reveal — practical, dry
M += [n("他给这条街上的人记了五年的酒、五年的账。头一回，有人反过来替他记了一笔。",
        "Five years of keeping this street's drinks and this street's tabs. First time anyone had kept one for him.")]
M += [n("Nico盯着那个“T”，嘴角动了一下。这人，连这个都要抢着买单。",
        "Nico stared at the T, and the corner of his mouth moved. Of course. The guy even had to pick up the tab on this.")]
z46, e46 = keep(46)
zo, eo = z46[2]["opts"], e46[2]["opts"]
zo[1]["t"] = "把正面那几行，从头再看一遍"
eo[1]["t"] = "Read the front again, from the top."
zo[2]["then"] = [["n", "act", "声音很小，只有Nico自己听见。他把纸条压在吧台上，压了很久，指节都压白了。"]]
eo[2]["then"] = [["n", "act", "Barely a whisper; only Nico heard it. He pressed the note flat on the bar and held it there a long time, knuckles white."]]
M += [(z46, e46)]
z47, e47 = keep(47)
z47[2]["t"][0][1] = "他看到了。我在角落里替Wren点蜡烛，火柴划断了两根，眼睛一直往吧台那边跑。"
e47[2]["t"][0][1] = "He found it. I'm in the corner lighting Wren's candles, two matches snapped already, and my eyes keep going to the bar."
M += [(z47, e47)]
M += [keep(48), keep(49), keep(50), keep(51)]
M += [txt(52, "他让我发誓别说的。可天一亮，他人就在飞机上了。", "He made me swear not to tell you. But come daylight, he's on a plane.")]
z53, e53 = keep(53)
z53[2]["txt"] = "“那份五年的合同——他到现在，一个字都没签。”"
e53[2]["txt"] = "\"That five-year contract—he still hasn't signed a word of it.\""
M += [(z53, e53), keep(54), keep(55)]
M += [txt(56, "那张纸，他昨晚在家写了一宿，废了半本便签。剩下的活，归你。",
          "He was up all last night writing that. Went through half a pad. The rest of the job's yours.")]
M += [keep(57)]
M += [txt(58, "隔着一屋子烛火，Theo看见了Nico手里那张纸。他把火柴盒往Wren手里一塞，袖子往小臂上一捋，绕进吧台，一句话没说。",
          "Across a room full of candles, Theo saw the paper in Nico's hand. He shoved the matchbox at Wren, pushed his sleeves up his forearms and came around the bar without a word.")]
M += [keep(59), keep(60), keep(61), keep(62), keep(63)]
z64, e64 = keep(64)
z64[2]["opts"][0]["then"][1][2] = "……Nico，你手别乱放。我经不住。"
e64[2]["opts"][0]["then"][1][2] = "...Nico. Watch where you put that hand. I can't take it."
M += [(z64, e64)]
z65, e65 = keep(65)
z65[2]["t"][0][1] = "他没躲。撑了一整晚的那口气，就这么泄在他肩膀上了。……还走什么走。"
e65[2]["t"][0][1] = "He didn't pull away. The breath I've been holding all night just went out of me, right there on his shoulder. ...Why the hell am I leaving."
M += [(z65, e65), keep(66)]
M += [txt(67, "纸条……背面你也看了？", "The note... you read the back too?")]
# passion lock stays in place (no info revealed — the words go to the ⏪ recall)
lock = [
    n("Nico没答。Theo就懂了，伸手就抢，快得带起一阵风，满台烛火齐齐一歪。", "Nico didn't answer. That was answer enough. Theo grabbed for it so fast the air moved and every candle on the bar leaned."),
    b("theo", "say", "那行不算。写错了。还给我。", "That line doesn't count. Mistake. Give it back."),
    n("Nico把纸条举高。Theo扑过来，一米八几的个子整个压上他，两个人“砰”地撞在冰柜门上。", "Nico held it high. Theo crowded in, all six-foot-something of him, and they slammed back into the freezer door."),
    b("theo", "act", "背后是冰柜渗出的冷气，身前是Theo滚烫的胸口。他一只大手撑在Nico耳边，手背青筋一根根鼓起来，喘着气。", "Cold seeping from the freezer at Nico's back, Theo's chest blazing against his front. One big hand braced beside Nico's ear, veins standing out across it, breathing hard."),
    n("Nico没松手，反倒一条腿顶住他的膝盖，不让他再往前压半寸。两个人谁也不让谁，就这么较着劲。", "Nico didn't let go. He jammed a knee against Theo's and held him off—not one more inch. Neither of them gave ground."),
    b("theo", "say", "……行。你要是念出来，我就当你同意了。", "...Fine. Read it out loud and I'll take that as a yes."),
    n("Nico张了张嘴。Theo盯着他的嘴唇，喉结狠狠滚了一下，下巴上的胡茬几乎蹭到他的脸。", "Nico's lips parted. Theo's eyes dropped to them; his throat worked hard, his stubble almost scraping Nico's cheek."),
    b("theo", "say", "念啊。……还是不敢？", "Go on. ...Or don't you dare?"),
    n("他没退。额头抵着Nico的额头，鼻息交缠在一起，就这么等。", "He didn't back off. Forehead to Nico's forehead, their breath tangled, waiting."),
]
z68, e68 = keep(68)
z68[2] = {"title": "冰柜门前", "teaser": "他伸手去抢那张纸条——两个人一起撞上了冰柜门。", "price": 3, "then": [x[0] for x in lock]}
e68[2] = {"title": "Against the Freezer", "teaser": "He lunges for the note—and the two of them crash into the freezer door.", "price": 3, "then": [x[1] for x in lock]}
M += [(z68, e68)]
M += [keep(i) for i in range(69, 77)]
M += [txt(77, "酒架塌了！水还在第五级——一时半会儿淹不上来！", "A rack came down! Water's still at the fifth step—it's not coming up yet!")]
M += [keep(78), keep(79)]
M += [n("Theo松开那根系带，转身出了吧台，往楼梯口去看水。走到一半，他回头看了一眼。",
        "Theo let go of the apron string, stepped out from behind the bar and headed for the stairs to check the water. Halfway there, he looked back.")]
M += [keep(80)]
d["beats"]["zh"] = [x[0] for x in M]
d["beats"]["en"] = [x[1] for x in M]

# ================= THEN A / B / C =================
def T(c):
    return src["then"][c]["zh"], src["then"][c]["en"]
# --- A: ask him face to face
Az, Ae = T("A"); A = []
kA = lambda i: (copy.deepcopy(Az[i]), copy.deepcopy(Ae[i]))
def tA(i, zh, en):
    z, e = kA(i); z[2] = zh; e[2] = en; return (z, e)
A += [tA(0, "Theo从楼梯口回来时，Nico已经从吧台后面走出来，把那张折成小方块的纸条，轻轻放在他面前的台面上。",
         "When Theo came back from the stairs, Nico was already out from behind the bar. He set the little folded note on the counter in front of him.")]
A += [kA(1), kA(2)]
A += [tA(3, "第一年这个晚上，打烊以后你喝多了，说过了零点就是你生日。说完你自己就忘了。",
         "That first year, this same night, you got drunk after closing and said your birthday started at midnight. Then you forgot you'd said it.")]
A += [kA(i) for i in range(4, 9)]
A += [tA(9, "我还以为……在你这儿，我跟吧台上那些熟客，没什么两样。",
         "I figured... to you, I was just another regular at the bar.")]
A += [kA(10), kA(11), kA(12), kA(13)]
A += [recall("合同那半句卡在他喉咙里。Nico却想起零点时，纸条背面那行被划掉的字。",
             "The rest of the contract sentence is stuck in his throat. Nico is thinking of the line scored out on the back of the note, at midnight.",
             "没签的合同，和这一行划掉的字，原来是同一件事。他在等的那句话，从来不在合同上。",
             "The unsigned contract and that crossed-out line were the same thing. What he was waiting for was never going to be on the contract.")]
A += [kA(14), kA(15), kA(16), kA(17)]
d["then"]["A"] = {"zh": [x[0] for x in A], "en": [x[1] for x in A]}
# --- B: pocket it, pretend
Bz, Be = T("B"); B = []
kB = lambda i: (copy.deepcopy(Bz[i]), copy.deepcopy(Be[i]))
def tB(i, zh, en):
    z, e = kB(i); z[2] = zh; e[2] = en; return (z, e)
B += [kB(0), kB(1), kB(2)]
B += [tB(3, "Theo从楼梯口回来，站到吧台另一头切柠檬。他看见了，刀停在半空。",
         "Theo had come back from the stairs and was slicing lemons at the other end of the bar. He saw. The knife stopped mid-air.")]
B += [kB(4), kB(5)]
z6, e6 = kB(6)
z6[2]["then"][0] = ["theo", "act", "他把卫衣领口往上一拉，挡住半张脸，低头接着切柠檬，一刀比一刀重。"]
e6[2]["then"][0] = ["theo", "act", "He yanked the hoodie collar up over half his face and went back to the lemons, every cut harder than the last."]
B += [(z6, e6)]
B += [kB(i) for i in range(7, 14)]
B += [recall("那行被划掉的字，就隔着一层围裙布，硌在他掌心底下。",
             "That crossed-out line is right there under his palm, through one layer of apron.",
             "窗边那个人在等的，就是这一句。而Nico把它折好，揣进了口袋。",
             "That was the line the man at the window was waiting on. And Nico had folded it up and put it in his pocket.")]
B += [tB(14, "Theo回头看了他一眼。那双眼睛暗下去，像一扇窗被人从里面拉上了帘子。",
          "Theo looked back at him once. His eyes went dark, like a curtain drawn from the inside.")]
B += [kB(15), kB(16)]
d["then"]["B"] = {"zh": [x[0] for x in B], "en": [x[1] for x in B]}
# --- C: read it to the room
Cz, Ce = T("C"); C = []
kC = lambda i: (copy.deepcopy(Cz[i]), copy.deepcopy(Ce[i]))
def tC(i, zh, en):
    z, e = kC(i); z[2] = zh; e[2] = en; return (z, e)
C += [kC(i) for i in range(0, 12)]
C += [tC(12, "他写这几行字，攒了五年的胆子。", "It took him five years to work up the nerve to write those lines.")]
C += [tC(13, "Nico把那片柠檬捏扁了，汁水顺着指缝往下滴，蜇得指甲边的倒刺生疼。他没擦。",
          "Nico crushed the lemon wedge in his fist. Juice ran between his fingers and stung a hangnail raw. He didn't wipe it off.")]
C += [kC(14), kC(15), kC(16)]
C += [recall("“能改吗”——改早，还是改晚？Nico手里那张纸条的背面，其实早就写了答案。",
             "\"Can I change it\"—earlier, or later? The back of the note in Nico's hand already had the answer.",
             "正面那几行，他刚才当着所有人念了。背面这一句，他念都没念——它本来只写给一个人。",
             "He'd just read the front out to the whole room. The back he hadn't read at all. It was only ever written for one person.")]
C += [tC(17, "门里忽然安静了。Theo挂了电话，屏幕的冷光里跳出一行字：航班状态已变更。",
          "The kitchen went quiet. Theo hung up, and in the cold light of the screen a line popped up: Flight status changed.")]
d["then"]["C"] = {"zh": [x[0] for x in C], "en": [x[1] for x in C]}

json.dump(d, open(f"{H}/afterhours_ch1_v4_s3.json", "w"), ensure_ascii=False, indent=1)
print("written")
