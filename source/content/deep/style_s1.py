#!/usr/bin/env python3
"""Style revision for heir_ch1_s1 — starts from pre_style backup, writes heir_ch1_s1.json"""
import json, copy, os
H = os.path.dirname(os.path.abspath(__file__))
src = json.load(open(f"{H}/pre_style/heir_ch1_s1.json"))
ZH, EN = src["beats"]["zh"], src["beats"]["en"]
orig_zh, orig_en = copy.deepcopy(ZH), copy.deepcopy(EN)

def N(zh, en): return (["n", "act", zh], ["n", "act", en])
def T(zh, en): return (["adrianv", "think", zh], ["adrianv", "think", en])
def S(w, zh, en): return ([w, "say", zh], [w, "say", en])
def A(w, zh, en): return ([w, "act", zh], [w, "act", en])

rep = {}      # original index -> (zh beat, en beat)
ins = {}      # original index -> list of pairs inserted AFTER it
order = None  # optional reordering of original indices

def text(i, zh=None, en=None):
    z, e = copy.deepcopy(orig_zh[i]), copy.deepcopy(orig_en[i])
    if zh is not None: z[2] = zh
    if en is not None: e[2] = en
    rep[i] = (z, e)

# ---------- morning: plant the CCTV facts (Ortiz 6:15, chained back door, Hector) ----------
ins[5] = [
    N("他六点一刻就醒了。楼梯间里拖鞋一路啪嗒啪嗒响下去——3B的Ortiz太太下楼拿报纸，三年来没早过、也没晚过一分钟。",
      "He's been up since 6:15, when the slippers went slapping down the stairwell — Mrs. Ortiz from 3B, going down for her paper. Three years, and she has never been a minute early or late."),
    N("门把手上挂着一袋垃圾。上礼拜楼管Hector拿自行车链条把后门从里面锁死了，说是防流浪汉。现在倒个垃圾，得从前门绕半个街区。",
      "A bag of trash hangs off the doorknob. Last week Hector, the super, chained the back door shut from the inside with a bike lock — \"for the junkies\" — so taking out the garbage now means going out the front and around half the block."),
]
text(7, en="Adrian is six feet even, barefoot on cold tile. The gray T-shirt has been washed to a stretched-out collar, but his shoulders still pull it tight, the cotton straining across his shoulder blades.")
text(12, "那天早上，我账户里只有32美元。", "That morning, I had thirty-two dollars in checking.")

# ---------- flashback: mutual fight, no waiting-by-the-phone ----------
text(17, "十七岁的Adrian蹲在台阶上，外套湿透贴着背，指关节也破了——刚才那一架是两个人一起打的。他用牙撕开创可贴，按上十八岁Roman裂开的嘴角。",
     "Seventeen-year-old Adrian crouches on the step, jacket soaked to his back, his own knuckles split — they took that fight together. He tears a bandage open with his teeth and presses it to the cut at the corner of eighteen-year-old Roman's mouth.")
text(20, "没亲上。差半寸。第二天我跟自己说，是雨太大，是他挨了一拳脑子不清楚。这话我说了十年，耳后那块皮肤一次都没信过。",
     "It never landed. Half an inch. Next day I told myself it was the rain, that he'd taken one to the head. I've been telling myself that for ten years. The skin behind my ear has never bought it once.")
text(21, "第二天早上，他就没了。Adrian发了三条消息，第四条打到一半，删了。从那以后，他宁可绕两条街，也不再从那家便利店门口过。",
     "The next morning, he was gone. Adrian sent three texts. He typed half of a fourth and deleted it. After that he'd walk two blocks out of his way rather than pass that store.")

# ---------- SUV arrival: sound -> sight -> street -> inner ----------
text(37, "帆布包斜挎在宽肩上，里面那台旧笔记本的风扇还在嗡嗡转。他一手攥着凉掉的咖啡，一手拎着那袋垃圾，指节上沾着昨晚的马克笔印。",
     "Canvas bag slung across one broad shoulder, the old laptop inside still whining its fan. Cold coffee in one fist, the trash bag in the other, last night's marker ink smudged across his knuckles.")
text(38, "先是声音。三台大排量引擎压着同一个低频怠速，脚下的井盖跟着嗡嗡发颤，震得他鞋底发麻。",
     "First, the sound. Three big engines idling on the same low note, the manhole cover under his boots humming with it.")
ins[38] = [N("然后才是车。三辆黑色SUV首尾相接，堵死了半条街。车窗黑到底，车漆亮得像刚从水里捞出来，照出整条街：锈掉的消防梯，歪倒的垃圾桶，还有他自己。",
             "Then the cars. Three black SUVs, nose to tail, blocking half the street. Windows tinted all the way down, paint so glossy it looks wet, throwing the whole block back at him — rusted fire escapes, tipped-over trash cans, and him.")]
ins[39] = [
    T("第一个念头：我到底欠了谁的钱，能欠出三辆这种车来。", "First thought: whose money do I owe, and how much, to rate three of these."),
    N("他把垃圾袋慢慢放在台阶上，空出右手。在这种街上长大的人都有这个习惯：先空出一只手。",
      "He sets the trash bag down on the step, slow, and frees his right hand. Grow up on a street like this and you learn it early: free a hand first."),
]
text(41, "认得太快，这才让人恼火。脑子还要一秒，身体一秒都不用——胃里先往下一沉，手里的纸杯被捏瘪了一角，凉咖啡顺着指缝往下淌。",
     "He recognizes him too fast, and that's what pisses him off. His brain needs a second. His body doesn't — his gut drops, the paper cup crumples in his fist, and cold coffee runs between his knuckles.")
text(42, en="Roman straightens up, six-two, and makes the doorframe look small. Black suit cut close to the body. No tie. White shirt open one button at the throat.")
text(47, "风掀起他领口一角：锁骨下一道旧疤，颜色比皮肤浅，像一截被缝上的闪电。",
     "The wind lifts his collar: a scar under the collarbone, paler than the skin around it, like a bolt of lightning somebody stitched shut.")
text(48, "这十年你死哪儿去了？——不对，先问锁骨下那道疤是谁干的。不管是谁，我去宰了他。",
     "Where the hell have you been for ten years? — No. First: who gave you that scar. Whoever it was, I'll kill him.")
text(49, "Adrian有十年的问题要问，视线却先往下走，在那截锁骨上多停了一秒。喉结滚了一下。",
     "Adrian has ten years of questions. His eyes go down anyway and stay on that collarbone one second too long. His Adam's apple bobs.")
# Roman description reordered: silhouette -> then/now body -> shoes & watch -> head & jaw -> eyes -> under the collar
order_roman = [42, 46, 44, 43, 45, 47]

# stop 51: no blushing ears
def edit_stop(i, fn_zh, fn_en):
    z, e = copy.deepcopy(orig_zh[i]), copy.deepcopy(orig_en[i]); fn_zh(z[2]); fn_en(e[2]); rep[i] = (z, e)
def s51z(d): d["hint"] = "他抓到你在看他。十年没见，第一回合就落了下风。"
def s51e(d): d["hint"] = "He caught you looking. Ten years, and you're losing round one."
edit_stop(51, s51z, s51e)
text(53, "十年，你就跟我说这个？", "Ten years, and that's what you open with?")
def s60z(d): d["opts"][1]["then"][0][2] = "他说得很慢，一个字一个字，灰眼睛一直没离开Adrian的脸，像在等一拳挥过来。"
def s60e(d): d["opts"][1]["then"][0][2] = "He says it slowly, word by word, gray eyes never leaving Adrian's face, like he's waiting for the swing."
edit_stop(60, s60z, s60e)

# ---------- DNA folder: outside -> inside -> reaction ----------
ins[72] = [N("黑色小牛皮文件夹，比他那台旧笔记本还沉。封面没有字，只在右下角压着一个烫银的V，边角磨得发亮——这东西有人翻过很多遍。",
             "Black calfskin, heavier than his old laptop. No words on the cover, just a silver V pressed into the bottom corner, the edges rubbed shiny. Somebody has opened this a lot.")]
text(73, "里面的纸厚实，对着窗光能看见暗纹。第一页：ALEXANDER VALE，已故。第二页：亲子关系确认。第三页：ADRIAN HALE，匹配度99.998%。",
     "Inside, heavy paper, a watermark showing against the window. Page one: ALEXANDER VALE — DECEASED. Page two: PATERNITY CONFIRMATION. Page three: ADRIAN HALE / 99.998% MATCH.")

# ---------- first look at the inheritance: sealed card, top -> bottom, then reaction ----------
ins[80] = [
    N("屏幕最上方是一张卡片。哑光黑底，压着一道极细的金边，正中一个数字框，盖着一层磨砂似的封印。他只看得出，那串数字很长。",
      "At the top of the screen, a card. Matte black, a hairline of gold around the edge, and dead center a number field under a frosted seal. All he can tell is that the number is long."),
    N("卡片下面是一列标志，一个接一个：他每天坐地铁路过的那家银行，公司楼下他从没进过的那家酒店，机场跑道尽头那排印着V的白色机尾。",
      "Below it, a column of logos, one after another: the bank he passes on the train every morning, the hotel by his office he has never once walked into, the row of white tail fins with a V on them at the end of the runway."),
    N("他发现自己的拇指已经搭在那层封印上了。他把手收回来，在牛仔裤上蹭了一下。",
      "He notices his thumb is already resting on the seal. He takes it back and wipes it on his jeans."),
    T("替人写了五年广告，“改变人生”这四个字我写过不下一百遍。原来它真来的时候长这样：一个打不开的框。",
      "Five years writing ads, and I've typed \"life-changing\" a hundred times. Turns out the real thing looks like this: a box you can't open."),
]
text(83, "我今天早上，账户里还剩32块18。", "This morning I had thirty-two dollars and eighteen cents.")
text(84, "存你那32块的那家银行，现在有你的股份。", "The bank holding that thirty-two dollars? You own part of it now.")

# ---------- CCTV ----------
text(92, "Roman在平板右上角轻点一下，食指上一层薄茧。那页资产缩了下去，换成四格黑白监控，雪花点沙沙地跳。",
     "Roman taps the corner of the tablet with a callused forefinger. The asset page shrinks away. Four black-and-white feeds take its place, snow hissing at the edges.")
text(94, "继承说明书里不会写的那部分。你楼里的监控，今早6点14分被人动过。这是那一分钟的四个画面。",
     "The part nobody puts in the inheritance brochure. Someone got into your building's cameras at 6:14 this morning. These are the four feeds from that minute.")
ins[98] = [
    N("四格画面，同一个时间码：06:14。Adrian一格一格看过去。", "Four feeds, one timecode: 06:14. Adrian goes through them one at a time."),
    N("CAM A，楼梯间：一个裹着睡袍的老太太扶着栏杆往下走。3B的Ortiz太太，下楼拿报纸。",
      "CAM A, stairwell: an old woman in a bathrobe working her way down, one hand on the rail. Mrs. Ortiz, 3B, going for her paper."),
    N("CAM B，前门台阶：外卖员把两袋东西往台阶上一放，冲着镜头打了个巨大的哈欠，转身就走。",
      "CAM B, front stoop: a delivery guy drops two bags on the step, yawns straight into the lens, and leaves."),
    N("CAM C，后门：一个穿工装夹克、拎工具箱的男人从巷子里过来，像来修暖气的。他握住门把一拉，门开了，他侧身进了楼。",
      "CAM C, back door: a man in a work jacket with a toolbox comes up the alley — the radiator guy, by the look of him. He takes the handle, pulls, and the door swings open. He steps inside."),
    N("CAM D，门厅：楼管Hector拎着拖把桶，一下一下拖着地。", "CAM D, lobby: Hector the super, mop and bucket, working the floor."),
    T("乍一看什么都没有。一栋破楼，一个早上，四个再普通不过的人。", "Nothing, at first glance. One beat-up building, one morning, four completely ordinary people."),
]
TAIL_Z = [["sys", "event", {"icon": "🔎", "title": "线索卡：内部知情", "txt": "上了链子的门，他一拉就开；摄像头的死角，他一个不落——对方熟悉Vale的安保系统。"}],
          ["roman", "say", "所以我亲自来了。"], ["adrianv", "say", "你完全可以派别人。"], ["roman", "say", "可以。我没有。"],
          ["adrianv", "think", "这句我没接。接了，就得问为什么；问了，就得听他答。"]]
TAIL_E = [["sys", "event", {"icon": "🔎", "title": "Clue Card: Inside Knowledge", "txt": "A chained door that opens for him. Every blind spot, avoided. Whoever this is knows Vale's security system."}],
          ["roman", "say", "That's why I came myself."], ["adrianv", "say", "You could have sent someone."], ["roman", "say", "I could have. I didn't."],
          ["adrianv", "think", "I let that one go. Pick it up and I'd have to ask why. Ask why, and I'd have to hear the answer."]]
def feedz(d):
    d["hint2"] = "拖动时间轴。四个画面里，有一件事在那栋楼里不可能发生——点它。"
    d["cams"] = [{"id": "A", "t": "楼梯间", "clue": "6:15前后，Ortiz太太下楼拿报纸——三年来天天如此。"},
                 {"id": "B", "t": "前门台阶", "clue": "外卖员正脸对着镜头打哈欠，放下袋子就走。"},
                 {"id": "C", "t": "后门", "clue": "后门上礼拜就被Hector从里面锁了链子。这人却从外面一拉就开——全程背对镜头，每一步都踩在死角上。"},
                 {"id": "D", "t": "门厅", "clue": "楼管Hector在门厅拖地，一切照旧。"}]
    d["win"] = [["adrianv", "say", "后门。上礼拜Hector从里面上了链子，从外面根本拉不开。"],
                ["roman", "act", "Roman侧过脸看了他一眼。那一眼很深，像在确认一件早就知道的事。"],
                ["roman", "say", "我知道。"],
                ["adrianv", "think", "他知道。他凭什么知道我们楼后门上了链子？"]] + copy.deepcopy(TAIL_Z)
    d["lose"] = [["roman", "act", "Roman伸手放大后门画面，宽大的手掌几乎盖住半块屏幕。"],
                 ["roman", "say", "后门上礼拜就从里面锁了链子，从外面拉不开。他一拉就开了。"],
                 ["adrianv", "think", "……他怎么知道我们楼后门上了链子？"],
                 ["roman", "act", "画面里，那人自始至终背对镜头，每一步都踩在死角上。"]] + copy.deepcopy(TAIL_Z)
    d["skip"] = [["roman", "say", "后门上礼拜就上了链子，他一拉就开，还踩着每一个死角走。所以我亲自来了。"]]
def feede(d):
    d["hint2"] = "Drag the timeline. One of these four things can't happen in that building. Tap it."
    d["cams"] = [{"id": "A", "t": "Stairwell", "clue": "Mrs. Ortiz heading down for her paper around 6:15 — same as every day for three years."},
                 {"id": "B", "t": "Front stoop", "clue": "The delivery guy yawns right into the lens, drops the bags, leaves."},
                 {"id": "C", "t": "Back door", "clue": "Hector chained the back door from the inside last week. This man pulls it open from the outside — and never shows the camera his face, every step in a blind spot."},
                 {"id": "D", "t": "Lobby", "clue": "Hector mopping the lobby. Business as usual."}]
    d["win"] = [["adrianv", "say", "The back door. Hector chained it from the inside last week. You can't open it from the alley."],
                ["roman", "act", "Roman turns his head and looks at him — a long look, like confirming something he already knew."],
                ["roman", "say", "I know."],
                ["adrianv", "think", "He knows. How the hell does he know what's on our back door?"]] + copy.deepcopy(TAIL_E)
    d["lose"] = [["roman", "act", "Roman spreads two fingers and enlarges the back-door feed, his big hand covering half the screen."],
                 ["roman", "say", "Back door's been chained from the inside since last week. Can't be opened from the alley. He just pulled it open."],
                 ["adrianv", "think", "...How does he know about the chain on our back door?"],
                 ["roman", "act", "On screen, the man never once faces the camera. Every step lands in a blind spot."]] + copy.deepcopy(TAIL_E)
    d["skip"] = [["roman", "say", "The back door's been chained since last week. He pulled it right open, and walked every blind spot. That's why I came myself."]]
edit_stop(99, feedz, feede)

# ---------- assemble ----------
idx = list(range(len(orig_zh)))
s = idx.index(42); idx[s:s + 6] = order_roman
outz, oute = [], []
for i in idx:
    z, e = rep.get(i, (orig_zh[i], orig_en[i])); outz.append(z); oute.append(e)
    for pz, pe in ins.get(i, []): outz.append(pz); oute.append(pe)
src["beats"]["zh"], src["beats"]["en"] = outz, oute
json.dump(src, open(f"{H}/heir_ch1_s1.json", "w"), ensure_ascii=False, indent=1)
print("beats", len(orig_zh), "->", len(outz))
