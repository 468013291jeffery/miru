# Crimson Contract · Chapter 1 "Same Receipt" — interactive deep version (en + zh)
# B(who,kind,(en,zh)) = a scripted beat; L(...) = YOUR turn; other stops: photo/video/gift/game/voice/call
import json,sys
def B(w,k,t):return ("B",w,k,t)
def O(k,t,then=(),love=0):return {"k":k,"t":t,"then":list(then),"love":love}
def L(who,hint,*opts,free=None):return ("S",who,"line",{"hint":hint,"opts":list(opts),"free":free})
def S(sp,kind,**d):return ("S",sp,kind,d)
A,LU,N="adrian","lucien","n"

BEATS=[
B(N,"act",("Last call was an hour ago. The chairs are upside down on the tables. The jukebox played its last song twenty minutes back, and nobody fed it again.","最后一轮点单是一小时前的事了。椅子倒扣在桌上。点唱机二十分钟前放完最后一首歌，没人再投币。")),
B(N,"act",("Three glasses of rye stand in a row in front of Lucien, sweating rings into the wood. He hasn't touched any of them.","Lucien面前排着三杯黑麦威士忌，在木头吧台上洇出三圈水印。他一杯都没碰。")),
B(N,"act",("Adrian has wiped the same stretch of bar four times. It's been clean since one.","同一段吧台，Adrian已经擦了四遍。其实从一点钟起它就是干净的。")),
B(LU,"act",("I turn my ring once. He poured the first rye at 11:52, the second at 12:40, the third at 1:31. Each one slower. He's doing it on purpose.","我把戒指转了一圈。第一杯他是11点52分倒的，第二杯12点40，第三杯1点31。一杯比一杯慢。他是故意的。")),
L(A,("He's ordered another drink he won't touch. You say —","他又点了一杯不会碰的酒。你开口——"),
 O("say",("You're not drinking that either.","这杯你也不喝。"),[B(LU,"say",("No.","不喝。")),B(LU,"say",("A man sitting at a bar without a drink is loitering. A man with a drink is a customer.","坐在吧台前却没有酒的人，叫闲逛。面前有杯酒的，才叫客人。"))]),
 O("act",("Slide the glass back toward him. Say nothing.","把酒杯推回他面前。一个字也不说。"),[B(LU,"act",("I look at the glass, then at him. I don't pick it up.","我看看杯子，又看看他。没有拿起来。")),B(LU,"say",("You've been timing how long it takes you to pour these. So have I.","你一直在算自己倒这几杯花了多久。我也在算。"))]),
 O("say",("Third one. Going for a record?","第三杯了。你在冲纪录？"),[B(LU,"say",("I'm going for a reason you won't throw me out.","我在找一个你不会把我赶出去的理由。")),B(LU,"act",("The corner of my mouth moves. I don't let it go any further than that.","我的嘴角动了一下。我没让它再往上走。"))],love=2)),
B(N,"act",("The ice machine hums. Somewhere in the walls, the old pipes knock twice.","制冰机嗡嗡作响。墙里的老水管咚咚敲了两下。")),
L(A,("Three full glasses. Fourteen dollars each. What do you do with them?","三杯满的。一杯十四块。你怎么处理它们？"),
 O("act",("Pour all three down the sink, one after another.","一杯接一杯，全倒进水槽。"),[B(N,"act",("Rye, then rye, then rye. The drain gurgles like it's laughing at both of them.","黑麦，黑麦，还是黑麦。下水道咕噜一声，像在嘲笑他们俩。"))]),
 O("say",("\"Drink one, or I pour them all out.\"","“喝一杯，不然我全倒了。”"),[B(LU,"say",("Pour them out, then.","那就倒吧。")),B(N,"act",("Adrian does. All three. The drain gurgles like it's laughing at both of them.","Adrian真倒了。三杯全倒。下水道咕噜一声，像在嘲笑他们俩。"))]),
 O("act",("Line the three glasses up in front of him, neat as evidence.","把三只杯子在他面前摆成一排，整齐得像呈堂证据。"),[B(LU,"act",("I look at the three glasses. Three nights' worth of excuses, in a row.","我看着那三只杯子。三个晚上的借口，排成一排。"))],love=1)),
B(LU,"say",("You're upset. You do this when you're upset. You did it the night the heat went out. You did it on your father's birthday.","你不高兴。你一不高兴就这样。暖气坏掉那晚是这样。你父亲生日那天也是这样。")),
L(A,("He keeps track of you. Of course he does.","他一直记着你。他当然记着。"),
 O("say",("Don't do that. Don't tell me about me.","别这样。别跟我讲我自己。"),[B(LU,"say",("Then tell me why you asked me to stay after close. In three years, you've never once asked me to stay.","那你告诉我，为什么打烊后叫我留下。三年了，你一次都没叫我留下过。"))]),
 O("say",("You keep a list of everything you own. I get it.","你给名下每样东西都记了账。我懂。"),[B(LU,"act",("Something moves behind my face. I don't let it reach my mouth.","我脸上有什么东西动了一下。我没让它到嘴边。")),B(LU,"say",("That isn't why I remember. But you can think so tonight. Why did you ask me to stay?","我记得，不是因为这个。但今晚你可以这么想。你为什么叫我留下？"))],love=-1),
 O("act",("Keep wiping. Don't look up.","继续擦。不抬头。"),[B(LU,"say",("Adrian. You asked me to stay. In three years, you've never once asked me to stay.","Adrian。是你叫我留下的。三年了，你一次都没叫我留下过。"))])),
S(A,"game",k="order",hint=("Every evening before your shift, a coffee is waiting for you. You've never asked who orders it. You know. Do you remember exactly what it is?","每天傍晚上班前，都有一杯咖啡在等你。你从没问过是谁点的。你心里清楚。你记得那杯是什么吗？"),
 then=[B(LU,"act",("He knows the order by heart. Of course he does. He's been paying attention exactly as long as I have.","他记得那杯咖啡的每一样配料。当然了。他留意我的时间，和我留意他一样久。"))],skip=[]),
B(N,"act",("The ice machine drops a fresh load into its bin. Outside, the harbor fog has climbed past the windows. The streetlamps are just smudges now.","制冰机哗啦落下一斗新冰。窗外，港口的雾已经漫过了窗沿，路灯只剩几团模糊的光。")),
B(N,"act",("Under the register there's a manila folder. This week Adrian has moved it between three different hiding places.","收银台底下有个牛皮纸文件夹。这一周，Adrian给它换了三个藏处。")),
L(A,("Now. Show him.","就现在。给他看。"),
 O("act",("Lay the folder on the bar between you.","把文件夹放在你们俩中间的吧台上。"),[B(N,"act",("A photocopy. The original is somewhere in Lucien's office, in a drawer that probably has its own lock.","是复印件。原件在Lucien办公室的某个抽屉里，那抽屉多半还有自己的锁。"))]),
 O("act",("Slide it to him face-down. Make him turn it over.","把它扣着推过去。让他自己翻。"),[B(LU,"act",("I turn it over. I already know what it is.","我把它翻过来。不用看，我也知道是什么。"))]),
 O("say",("My friend found this in my dad's things. You're going to explain it.","我朋友在我爸遗物里翻到的。你得给我解释。"),[B(N,"act",("Adrian puts the folder down. A photocopy, folded and unfolded so many times it's gone soft.","Adrian把文件夹放下。一张复印件，折了又展、展了又折，已经软了。"))])),
B(N,"act",("It was found in a tin of film canisters, in his father's things. Folded down to the size of a stamp.","它是在他父亲遗物里一个装胶卷筒的铁盒中找到的，折成邮票那么大。")),
B(LU,"act",("I don't touch it. I know every word on that page. I wrote half of them.","我没碰它。那页纸上每个字我都认得。有一半是我写的。")),
L(A,("Say it.","说出来。"),
 O("say",("You bought every sunrise I had left.","你买走了我剩下的每一个日出。"),[B(LU,"say",("I bought the debt.","我买的是债务。"))]),
 O("say",("I read it four times. Then out loud, because I thought I was reading it wrong. You bought my mornings.","我看了四遍。然后念出声，因为我以为自己看错了。你买了我的清晨。"),[B(LU,"say",("I bought the debt.","我买的是债务。"))]),
 O("say",("So that's what I am to you. A line item.","所以我对你来说就是这个。账本上的一行。"),[B(LU,"act",("My ring stops turning.","我的戒指停了。")),B(LU,"say",("I bought a debt. You came attached to it. Those aren't the same thing.","我买的是一笔债。你是附在上面的。这不是一回事。"))],love=-2)),
L(A,("He says it like it makes a difference.","他说得好像这有什么区别。"),
 O("say",("Same receipt.","同一张收据。"),[B(N,"act",("The words sit between them and stay there, like a coin that won't stop spinning.","这句话落在两人之间，停在那里，像一枚怎么也不肯倒下的硬币。"))],love=3),
 O("say",("Say it slower. See if it sounds better.","你说慢点。看看会不会好听一些。"),[B(LU,"say",("It doesn't. I've tried.","不会。我试过。"))]),
 O("act",("Laugh once. There's nothing funny in it.","笑一声。一点都不好笑的那种。"),[B(LU,"act",("I wait the laugh out. I've had four hundred years of practice waiting things out.","我等那声笑过去。等东西过去这件事，我练了四百年。"))])),
B(LU,"act",("Finally I reach into my coat and take out the original. I unfold it beside his copy. The ink has gone brown with age.","我终于把手伸进大衣内袋，取出原件，在他的复印件旁边摊开。墨迹早已氧化成褐色。")),
B(N,"act",("He carries it on him. He actually carries it around.","他随身带着。他居然随身带着。")),
S(LU,"photo",cap=("The original, unfolded beside the copy. 2:47 AM.","原件摊开在复印件旁边。凌晨2:47。"),prompt="a pale dark-haired man in a black tailored coat at an empty bar at 3am, unfolding an old brown-inked contract on polished wood beside a photocopy, signet ring on his hand, three whiskey glasses, harbor fog pressing against the window, warm amber bar light",
 then=[],skip=[]),
L(A,("He carries it on him.","他把它带在身上。"),
 O("say",("You walk around with that?","你天天揣着这个？"),[B(LU,"say",("I walk around with everything I'd hate to lose.","我会揣着所有我不想失去的东西。"))]),
 O("say",("Is that supposed to be romantic, or a threat?","这是想浪漫一下，还是在威胁我？"),[B(LU,"say",("It's supposed to be accurate.","是想说得准确一点。"))]),
 O("act",("Reach for the original. See if he lets you.","伸手去拿原件。看他让不让。"),[B(LU,"act",("I let him. My hand stays flat beside it — close enough to stop him. I don't.","我让他拿了。我的手平放在旁边——近到随时能拦住他。我没有。")),B(LU,"say",("Careful. It's older than this building.","小心。它比这栋楼还老。"))],love=2)),
B(LU,"act",("I turn the page toward him. Clause four. My fingertip rests just under the line, not on it.","我把纸转向他。第四条。我的指尖停在那一行下面，没有压上去。")),
B(LU,"say",("\"The mornings of the Vale household, held in trust by the creditor until the debt is satisfied in full.\" Your father's signature. Mine. And a witness who's been dead since 1991.","“Vale家的清晨，由债权人代为保管，直至债务全部清偿。”你父亲的签名。我的。还有一个1991年就死了的见证人。")),
B(N,"act",("Mornings. Not money. Not the building. Mornings.","清晨。不是钱，不是房子。是清晨。")),
B(LU,"say",("The building was worth less than what he owed. The mornings were worth more.","那栋房子抵不上他欠的数。清晨抵得上，还有余。")),
L(A,("Worth more. He didn't say to whom.","抵得上。他没说对谁来说。"),
 O("say",("Worth more to who?","对谁来说抵得上？"),[B(LU,"act",("I turn the ring. I don't answer that one. Not yet.","我转了转戒指。这个问题我没回答。还不到时候。"))]),
 O("say",("What kind of buyer wants mornings?","什么样的买家会要别人的清晨？"),[B(LU,"say",("The kind who can't have them.","拥有不了清晨的那种。")),B(LU,"act",("It's out before I can stop it. He hears it. I watch him file it away.","话出口时我已经拦不住了。他听见了。我看着他把这句话收好。"))],love=2),
 O("think",("(He didn't say worth more to him. He just said worth more.)","（他没说“对他”值。他只说了“值”。）"),[B(LU,"act",("He goes quiet too long. I know that silence. It's the sound of him doing math.","他沉默得太久了。我认得这种沉默。那是他在算账的声音。"))])),
B(N,"act",("Every morning of Adrian's life, the shutters in his apartment have locked at five and stayed locked until the sun was safely up. He thought it was the building. Some old landlord with a thing about heating bills. He was nine when he stopped asking.","Adrian这辈子的每一个早晨，公寓的遮光窗都会在五点锁死，直到太阳完全升起才打开。他以为是楼的问题，是哪个怪房东心疼电费。九岁那年，他就不再问了。")),
L(A,("Tell him what it cost you.","告诉他，这让你失去了什么。"),
 O("say",("I've never seen one. Not one sunrise. My dad took hundreds of pictures. I've never seen one.","我一次都没见过。一个日出都没见过。我爸拍了几百张照片。我一次都没见过。"),[B(LU,"say",("I know.","我知道。")),B(N,"act",("Adrian laughs. It comes out wrong, like something swallowed down the wrong pipe.","Adrian笑了一声，笑得不对劲，像一口东西咽岔了气。"))]),
 O("say",("Do you know what it's like to set an alarm for something you'll never get to see?","你知道给一件永远看不到的东西定闹钟，是什么感觉吗？"),[B(LU,"say",("Yes.","知道。")),B(LU,"act",("One word. The most honest thing I've said to him in three years.","一个词。三年来我对他说过的最诚实的话。"))],love=2),
 O("act",("Take your father's old film camera from under the bar. Set it beside the contract.","从吧台下拿出你父亲那台老胶片相机，放在契约旁边。"),[B(LU,"act",("His father's camera. I know it. I watched the man carry it to my door eleven years ago.","他父亲的相机。我认得。十一年前，我看着那个男人把它挎到我门口。")),B(LU,"say",("It's still loaded.","里面还有胶卷。")),B(N,"act",("It is. It has been for years. Every frame saved for a morning.","是的。好多年了。每一格都留给一个清晨。"))],love=3)),
S(LU,"video",clip=0,cap=("Not yet. But one morning, at 5:51, there will be a stake against his heart — and the sun at the window.","还没发生。但会有那么一个清晨，5点51分，木桩会抵在他心口——太阳就在窗外。"),
 hint=("Flash-forward · a morning that hasn't happened yet","闪前 · 一个还没到来的清晨"),then=[B(N,"act",("Back at the bar, the clock reads 2:51. None of that has happened yet.","回到吧台，挂钟指向2点51分。那些都还没有发生。"))]),
B(LU,"act",("I look at him for a long moment. His knuckles are white around the bar towel. There's a lime wedge on the cutting board, cut exactly right, and he hasn't touched it in an hour.","我看了他很久。他攥着吧台毛巾，指节发白。砧板上有一角青柠，切得刚刚好，他已经一个小时没碰过了。")),
S(LU,"gift",who="lucien",hint=("He still hasn't left. He has never once left before you do. Give him something?","他还没走。他从来没有比你先走过。要给他点什么吗？"),
 by={"coffee":[B(LU,"act",("He sets a cup of coffee in front of me. I can't drink it. I wrap my hands around it anyway, for the warmth, until it goes cold.","他把一杯咖啡放到我面前。我喝不了。可我还是用双手捧着它，取那一点热，直到它凉透。"))],
     "flower":[B(LU,"act",("A rose. On a bar, at three in the morning, from the one man in this city who has every reason to hate me.","一枝玫瑰。凌晨三点，在吧台上，来自这座城里最有理由恨我的人。")),B(LU,"say",("I'm going to assume that's sarcasm. I'm keeping it anyway.","我就当这是讽刺了。但我会留着。"))],
     "hoodie":[B(LU,"say",("It's cold out. You're not wearing a coat.","外面冷。你没穿外套。")),B(LU,"act",("He's giving me his hoodie. I don't get cold. I put it over my arm like it's something borrowed from a museum.","他把自己的卫衣给我。我不会冷。可我把它搭在手臂上，小心得像从博物馆借来的东西。"))],
     "letter":[B(LU,"act",("A letter, folded small — the way his father folded the contract. I don't open it. Not here. Not while he's watching me not open it.","一封信，折得很小——和他父亲折那份契约的方式一样。我没有拆。不在这里。不在他看着我的时候。"))],
     "ring":[B(LU,"say",("Adrian. That isn't a gift. That's a contract.","Adrian。这不是礼物。这是契约。")),B(LU,"act",("For once, I don't know what to do with my hands. I turn my own ring. Then I stop.","这一次，我不知道手该往哪儿放。我转了转自己的戒指。又停住了。"))]},
 then=[],skip=[B(LU,"act",("I watch him decide not to give me anything. Good. I wouldn't have either.","我看着他决定什么都不给我。很好。换作是我，也不会给。"))]),
B(LU,"say",("Your father came to me one winter when nobody else would see him. He owed people who don't send letters. I paid them. He offered what he had.","那年冬天，你父亲来找我，因为没有别人肯见他。他欠的是那种不寄信的人。我替他还了。他把他有的东西拿了出来。")),
L(A,("What he had. Those were yours.","他“有的东西”。那是你的。"),
 O("say",("He didn't have mornings to offer. They were mine.","他没有清晨可以给。那是我的。"),[B(LU,"say",("You were four. To the people who keep these papers, that made them his.","你那时四岁。在保管这些契约的人眼里，那就等于是他的。"))]),
 O("say",("And you took them. From a four-year-old.","然后你就收下了。从一个四岁小孩那里。"),[B(LU,"say",("I took them from your father. You were four. To the people who keep these papers, that's the same thing.","我是从你父亲那里收的。你四岁。在保管这些契约的人眼里，这是一回事。")),B(LU,"act",("I hate how it sounds out loud.","说出口，我才知道它有多难听。"))]),
 O("act",("Turn away. Stare at the shuttered window.","转过身去，盯着那扇关死的窗。"),[B(LU,"say",("You were four. I know. I was there.","你那时四岁。我知道。我在场。"))],love=1)),
B(N,"act",("Four years old, and traded for a debt to men who don't send letters.","四岁。就这样被拿去抵了一笔欠给“不寄信的人”的债。")),
B(N,"act",("Behind the bar, the old clock clicks past three. Two hours until the shutters lock across town.","吧台后面的老挂钟咔哒一声，走过了三点。离城那头的遮光窗锁死，还有两个小时。")),
B(N,"act",("Adrian folds the towel. Folds it again. When he looks up, he makes himself hold Lucien's eyes — because if he doesn't do it now, he never will.","Adrian把毛巾叠起来，又叠了一次。再抬头时，他逼自己看着Lucien的眼睛——现在不看，以后就再也不敢了。")),
L(A,("Ask him. Exactly.","问他。问清楚。"),
 O("say",("What did he give you? What does \"held in trust\" mean? And what does it cost to get them back?","他给了你什么？“代为保管”是什么意思？要怎样才能拿回来？"),[B(LU,"act",("For a second — less than a second — my eyes go the wrong color. I feel it. He sees it. Neither of us says a word.","有一瞬间——不到一瞬——我的眼睛变了颜色。我感觉到了。他也看见了。我们谁都没提。")),B(LU,"say",("That's three questions.","这是三个问题。")),B(N,"act",("Adrian doesn't take any of them back.","Adrian一个也没收回。"))]),
 O("say",("I want them back. All of them. Starting tomorrow.","我要拿回来。全部。从明天开始。"),[B(LU,"act",("For a second my eyes go the wrong color. He sees it. Neither of us says a word.","有一瞬间，我的眼睛变了颜色。他看见了。我们谁都没提。")),B(LU,"say",("That isn't a question. It's a demand. I respect it. I can't say yes to it tonight.","这不是问题，是要求。我尊重它。但今晚我没法答应。"))]),
 O("say",("The debt's old. Why are you still holding on?","债都那么久了。你为什么还不放手？"),[B(LU,"act",("My eyes go red before I can stop them. He sees it. He doesn't look away.","我的眼睛在我拦住之前就红了。他看见了。他没有移开视线。")),B(LU,"say",("That's the only question tonight I'm not ready to answer.","今晚只有这一个问题，我还没准备好回答。"))],love=3)),
B(LU,"act",("I fold my hands over the contract. Not to hide it. To keep it from moving.","我双手交叠，压在契约上。不是为了藏，是为了让它别动。")),
B(LU,"say",("Then tell me what you want, Adrian. Precisely. I don't do vague — and tonight I won't pretend there's nothing at stake for me, either.","那就告诉我你想要什么，Adrian。要精确。我不接受含糊——今晚我也不会假装，这件事对我来说没有代价。")),
]

# extra stops woven into the official choices' aftermath
THEN_EXTRA={
 "B":(9,S(LU,"photo",cap=("4 PM. An envelope behind the register, sealed in red wax.","下午四点。收银台后面的信封，红色火漆封口。"),prompt="a cream envelope sealed with red wax lying behind a bar register in late afternoon light, elegant handwritten name on it, a lime wedge and a vintage film camera nearby, moody film photography",then=[],skip=[])),
 "C":(12,S(LU,"voice",who="lucien",txt=("Ten minutes, on the roof, before dawn. You may say no. That is the whole of this letter.","黎明前，屋顶，十分钟。你可以拒绝。这封信要说的，就只有这些。"),hint=("The letter came with a voice memo.","信里还附了一段语音。"),then=[],skip=[])),
}

def lang(x,i):
    if isinstance(x,tuple) and len(x)==2 and all(isinstance(y,str) for y in x):return x[i]
    if isinstance(x,tuple) and x and x[0]=="B":return [x[1],x[2],x[3][i]]
    if isinstance(x,tuple) and x and x[0]=="S":return [x[1],x[2],lang(x[3],i)]
    if isinstance(x,dict):return {k:lang(v,i) for k,v in x.items() if v is not None}
    if isinstance(x,list):return [lang(y,i) for y in x]
    return x
out={"beats":{"en":lang(BEATS,0),"zh":lang(BEATS,1)},"then_insert":{k:{"at":at,"en":lang(s,0),"zh":lang(s,1)} for k,(at,s) in THEN_EXTRA.items()}}
json.dump(out,open(sys.argv[1],"w"),ensure_ascii=False,indent=0)
print("beats",len(BEATS),"stops",sum(1 for b in BEATS if b[0]=="S"))
