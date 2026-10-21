import json, re, sys
base = '/tmp/claude-0/-home-claude/be5c97bb-7ac4-528f-825e-7b15fb67169f/scratchpad/v2/content/ch2src/'
T = {
"Vale大厦顶层 · 岛台": "Vale Tower penthouse · Kitchen island",
"周三 晚上10:40": "Wed 10:40 PM",
"封锁完成后，顶层只剩空调的低鸣，和两个人还没完全平复的呼吸。": "Once the lockdown is done, the penthouse goes quiet except for the low hum of the AC and two men whose breathing hasn't quite settled.",
"Roman检查完最后一轮门窗，衬衫被汗浸湿了一点，贴在肩背和胸口。他走到岛台边，什么也没说，只把一瓶水推到Adrian面前。手指在瓶身上多停了半秒，像在确认自己还有没有资格靠近。": "Roman finishes his last sweep of the doors and windows. His shirt has gone damp in places, sticking to his shoulders and chest. He comes over to the island and, without a word, slides a bottle of water toward Adrian. His fingers stay on it half a second too long, like he's checking whether he's still allowed this close.",
"Adrian接过水，指尖擦过Roman的指节。两个人都顿了一下。": "Adrian takes the water. His fingertips brush Roman's knuckles. They both go still.",
"你刚才在走廊里，心率很高。": "Your heart rate was way up back in that hallway.",
"你在看屏幕。": "You were watching the monitor.",
"我在看你。": "I was watching you.",
"Roman的喉结滚了一下。他没退，也没再往前。两人之间那一步的空白热得发烫。": "Roman's Adam's apple bobs. He doesn't step back. He doesn't step closer either. The one pace of air between them runs hot.",
"今晚要是还有下一轮，我希望你先选活着，再选对错。": "If there's another round tonight, pick staying alive first. Right and wrong can wait.",
"那你呢？你选什么？": "And you? What do you pick?",
"选你还在我视线里。": "You. Where I can see you.",
"说完这句，他的目光在Adrian嘴唇上停了一瞬，才逼着自己移开。": "When he's said it, his eyes drop to Adrian's mouth for a beat before he makes himself look away.",
"我不是不想说完。是一说完，你就会知道我欠你的比你以为的多。": "It's not that I don't want to finish the sentence. It's that once I do, you'll know I owe you more than you think.",
"Vale大厦顶层 · 更衣间": "Vale Tower penthouse · Dressing room",
"周三 晚上10:55": "Wed 10:55 PM",
"造型师推进来三套衣服：深色正装、白色礼服，还有那件Adrian坚持留下的旧外套。镜子占了一整面墙，灯从镜框四周打出来，亮得照不出影子。": "The stylist wheels in three options: a dark suit, a white tux, and the old jacket Adrian refused to give up. A mirror takes up the whole wall, lit from all around the frame, so bright it leaves no shadows.",
"Roman站在三步外，手臂交叠，下颌微收。目光却没收——它从Adrian的后颈滑到肩胛，落到被衬衫收紧的腰线，最后极克制地抬回眼睛。只有两秒，足够让Adrian的耳尖发热。": "Roman stands three steps back, arms crossed, chin slightly down. His eyes don't stay down. They move from the back of Adrian's neck to his shoulder blades, to where the shirt pulls in at his waist, then come back up to his face with careful control. Two seconds, tops. Enough to make the tips of Adrian's ears burn.",
"“这套活动空间够吗？”造型师问。": "\"Enough room to move in that one?\" the stylist asks.",
"够。": "It's fine.",
"他回答的时候，看的是镜子里的Roman。Roman没有移开视线，只极轻地吐出一口气，像在把什么压回去，胸口的起伏因此明显了一瞬。": "He says it to Roman in the mirror. Roman doesn't look away. He lets out a breath, barely, like he's pushing something back down, and for a second you can see his chest rise and fall.",
"Adrian故意抬手去整理袖口，让衬衫下摆往上缩了半寸，露出一截腰侧的皮肤。镜子里，Roman的喉结滚动了，手指在手臂上收紧，指节发白。": "Adrian lifts a hand to fix his cuff, on purpose, and the shirt hem rides up half an inch, showing a strip of skin at his side. In the mirror, Roman's throat moves. His fingers tighten on his arm until the knuckles go white.",
"（压低声音，只够他听见）看够了吗？": "(low, just for him) Seen enough?",
"（同样低）没有。所以你最好快点穿好。": "(just as low) No. So you'd better finish getting dressed.",
"语气像命令，尾音却是哑的。Adrian的膝盖软了一下。镜子里，Roman的眼神在那一秒沉得更深，然后硬生生转向门口，像在用职责把自己钉在安全距离外。": "It sounds like an order, but his voice goes rough at the end. Adrian's knees give, just slightly. In the mirror, Roman's eyes go darker for that one second. Then he wrenches them toward the door, like the job is the only thing holding him at a safe distance.",
"他是故意的。他十七岁就会这一招，借我的外套，袖子长出一截，偏要在我面前一圈一圈地卷。……我当年就没撑住。": "He's doing it on purpose. He had this move down at seventeen. He'd borrow my jacket, sleeves too long, and roll them up one turn at a time right in front of me. ...I didn't hold out then, either.",
"今晚的衣服": "Tonight's Look",
"三套衣服挂在镜子前。今晚会有镜头，会有董事，会有一道“错误的门”。你想以什么样子走进去？": "Three outfits hang in front of the mirror. Tonight there'll be cameras, board members, and a \"wrong door.\" How do you want to walk in?",
"深色正装": "Dark suit",
"自己整理领口": "Fix the collar yourself",
"Adrian扣到最后一颗，嫌太紧，又解开了。镜子里，Roman的目光跟着那一小片颈侧移动，随即克制地抬了回来。": "Adrian buttons it all the way up, decides it's too tight, and undoes the top one. In the mirror, Roman's eyes follow that small patch of bare neck, then pull back up, under control.",
"往上看，Cross。": "Eyes up, Cross.",
"已经在看了。": "They are up.",
"Adrian的手在领口停了一下。没有谁被允许把这个玩笑变成伸手。可空气里的热，已经够清楚了。": "Adrian's hand stalls at his collar. Neither of them is allowed to turn the joke into reaching out. But the heat in the room says enough.",
"白色礼服": "White tux",
"请他来扶袖口": "Ask him to do the cuffs",
"袖扣。你来。": "Cufflinks. You do it.",
"Roman先看了他一眼，像在确认这是允许，才走过来。他只扶住袖口，指腹擦过腕骨的那一下，两个人都绷紧了。他指腹上有一层薄茧，克制过的力道还是漏出来一点。": "Roman looks at him first, like he's making sure this is allowed, then comes over. He only holds the cuff, but when his fingertips graze the bone of Adrian's wrist, they both tense. His fingertips are lightly callused, and even held back, a little of his strength leaks through.",
"Roman的呼吸落在他耳侧，低得几乎像叹气。袖口整理好了，腕骨上还留着被碰过的感觉，像一枚看不见的印。": "Roman's breath lands by his ear, low, almost a sigh. The cuff is done. Adrian's wrist still feels where he touched it, like an invisible stamp.",
"这一枚不会替你签任何东西。": "This one won't sign anything for you.",
"也别让袖扣替你道歉。": "Don't let the cufflinks apologize for you, either.",
"旧外套": "Old jacket",
"只管安全和体面": "Just safe and presentable",
"造型师确认口袋没破、鞋适合走路，把旧外套的领子刷干净。Adrian穿上时，布料在肩上轻轻牵了一下——是他自己的东西。": "The stylist checks that the pockets aren't torn and the shoes are good for walking, and brushes off the collar of the old jacket. When Adrian shrugs it on, the fabric pulls softly at his shoulders. It's his. Nobody bought it for him.",
"Roman看着那件旧衣服，眼神很复杂，像看见了十年前那个还敢在便利店门口等他的人。": "Roman looks at the old jacket, and something complicated crosses his face, like he's seeing the kid who used to wait for him outside the convenience store ten years ago.",
"我不用看起来像他们，才有资格问问题。": "I don't have to look like them to get to ask questions.",
"我知道。": "I know.",
"他的声音很低，带着一点几乎被压住的疼。": "His voice is low, with a hurt in it he's almost managed to bury.",
"去Vale酒店的路上": "En route to the Vale Hotel",
"周三 晚上11:05": "Wed 11:05 PM",
"车上，Roman又坐在了他身侧，而不是前排。车窗外下起了细雨，城市的灯被拉成一条条湿漉漉的光。": "In the car, Roman sits beside him again instead of up front. A fine rain has started outside, stretching the city lights into wet streaks.",
"两个人的膝盖从一开始就贴着。布料相触的温度很清楚。每次转弯，大腿会压得更用力一点。Adrian没移开，Roman也没有，像默认这截接触是今晚少数被允许的东西。": "Their knees have been touching since they pulled out. He can feel the warmth through the fabric. Every turn presses their legs together a little harder. Adrian doesn't move away. Neither does Roman, as if they've both agreed this is one of the few things allowed tonight.",
"过了两分钟，Roman放在自己膝盖上的手指动了动，极轻地覆上Adrian的手背。没有十指相扣，只是掌心的温度贴上来。拇指在他手侧慢慢地摩挲——一下，停半秒，再一下。像在数脉搏，又像在用触碰代替说不出口的那句：我在。": "Two minutes in, the fingers resting on Roman's own knee shift, and his hand settles lightly over the back of Adrian's. Not laced together. Just the warmth of his palm. His thumb moves slowly along the side of Adrian's hand. Once. A half-second pause. Again. Like he's counting a pulse. Or like the touch is standing in for the words he can't say: I'm here.",
"Adrian盯着窗外飞快后退的灯。Roman的体温从手背一路爬上手臂，蔓延到颈侧。他什么也没说，Roman也没有。黑暗里，只有膝盖和手的触碰在持续发热。": "Adrian stares at the lights sliding past the window. Roman's warmth climbs from the back of his hand up his arm and into the side of his neck. He doesn't say anything. Neither does Roman. In the dark, there's just the knee and the hand, still giving off heat.",
"如果今晚有人真的动手，你打算挡在我前面？": "If somebody actually makes a move tonight, you're planning to step in front of me?",
"是。": "Yes.",
"你有没有想过，我不想再看你流血？": "You ever think maybe I don't want to watch you bleed again?",
"想过。所以我会尽量让血留在该留的地方。": "I have. So I'll try to keep the blood where it belongs.",
"说完，拇指在他手背上按得更重了一点。Adrian侧过头，看见他下颌的线条绷得很紧，领口随着呼吸起伏。": "Then his thumb presses a little harder into the back of Adrian's hand. Adrian turns his head and sees the hard set of Roman's jaw, his collar rising and falling with each breath.",
"直到Adrian的呼吸乱了一拍，那根拇指才停下来——却没有收回手。": "The thumb doesn't stop until Adrian's breathing catches. Even then, the hand stays.",
"车里那只手没有收回去": "In the car, the hand stayed",
"选你还在我视线里": "You. Where I can see you",
}
CJK = re.compile(r'[　-〿一-鿿＀-￯“”]')
CJKcore = re.compile(r'[一-鿿　-〿＀-￯]')
missing = []; used = set()
def walk(x):
    if isinstance(x, list): return [walk(v) for v in x]
    if isinstance(x, dict): return {k: walk(v) for k, v in x.items()}
    if isinstance(x, str) and CJKcore.search(x):
        if x in T: used.add(x); return T[x]
        missing.append(x); return x
    return x
zh = json.load(open(base + 'heir_ch2_s2.json'))['beats']['zh']
en = walk(zh)
def same(a, b, p='root'):
    if type(a) != type(b): raise SystemExit(f'type mismatch {p}')
    if isinstance(a, list):
        assert len(a) == len(b), p
        for i, (x, y) in enumerate(zip(a, b)): same(x, y, f'{p}[{i}]')
    elif isinstance(a, dict):
        assert list(a) == list(b), p
        for k in a: same(a[k], b[k], f'{p}.{k}')
    elif isinstance(a, str) and CJKcore.search(a):
        assert not CJKcore.search(b), p
    else:
        assert a == b, p
same(zh, en)
json.dump({"beats": {"en": en}}, open(base + 'heir_ch2_s2_en.json', 'w'), ensure_ascii=False, indent=1)
txt = open(base + 'heir_ch2_s2_en.json').read()
bad = CJK.findall(txt)
print('missing', missing); print('unused', set(T) - used); print('cjk left', bad)
print('OK' if not missing and not bad else 'FAIL', len(used))
