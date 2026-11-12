# 《谁是 S++》v4 · MIRU 旧 DSL 兼容整理稿（待解析器验收）

> 仅从原剧本第四部分抽取实际播放段落；原稿完整留存于 `original/`。此文件不是已通过运行器测试的成品。
> 处理：还原被 Markdown 转义的下划线，清除重复 `⟧`，隔离旧格式人物演出提示和无效的 FX、GOAL、REVEAL 标签；为结局条件补闭合标记和候选旗标。
> 注意：章节顺序、叙事对白、角色与结局未重写。第18章结局位于 CHOICE 后，仍需以实际 DSL 解析器确认；作者示例玩家台词也仍然只是示例。

⟦ORIENT|bg⟧
⟦CHAR|你|f|26|char_vera|艺术品保险估价师|深棕发，灰眼，擅长估价，沉稳而审慎⟧
⟦CHAR|贝尔特|f|62|char_berthe|九门总管|短银发，黑西装，手提灯，谨慎寡言⟧
⟦CHAR|戴斯蒙德|m|41|char_desmond|九门运营总监|深色西装，昂贵手表，话语简短⟧
⟦CHAR|伊内斯|f|24|char_ines|九门实习生|负责文件与沟通，爱笑⟧
⟦CHAR|拉斐尔|m|31|char_rafe|马术庄园主|晒成蜜色的皮肤，前臂旧伤，白衬衫⟧
⟦CHAR|伊利亚|m|29|char_ilya|芭蕾编舞|浅肤色，步伐安静，动作精确⟧
⟦CHAR|埃梅卡|m|33|char_emeka|餐厅主厨|高个子，手背烫疤，围裙⟧
⟦CHAR|卡西米尔|m|36|char_cas|安保主管|高大，颈侧细疤，话少⟧
⟦CHAR|泰奥|m|27|char_theo|调香师|卷发，鼻梁痣，笑容轻快⟧
⟦CHAR|各务纯|m|30|char_jun|茶人和陶艺家|短黑发，手指有陶土痕迹⟧
⟦CHAR|塞巴斯蒂安|m|26|char_seba|探戈舞者|黑发，棱角分明，目光热烈⟧
⟦CHAR|朱利安|m|38|char_julian|大学研究者|灰绿眼，细框眼镜，语调严谨⟧
⟦CHAR|卢卡|m|32|char_luca|古董车行老板|黑发，指节油迹，左侧酒窝⟧
⟦CHAR|安德斯|m|34|char_anders|家具设计师|高瘦，短发，大手⟧
⟦CHAR|安东|m|35|char_anton|钢琴调音师|鬓角微白，手背青筋⟧
⟦CHAR|拉维|m|28|char_ravi|灯光设计师|深肤色，长睫毛，耳后小纹身⟧
⟦CHAR|欧文|m|33|char_owen|诗人与前记者|红褐发，右手烧伤疤⟧
⟦CHAR|雨果|m|37|char_hugo|钻石匠人|金发，旧戒指，指腹粗糙⟧
⟦CHAR|马利克|m|30|char_malik|高空表演者|精瘦，肩部旧伤⟧
⟦CHAR|布拉姆|m|29|char_bram|植物育种师|深肤色，门牙有小缺口⟧
⟦CHAR|亨里克|m|40|char_henrik|冰上运动教练|高大宽肩，短发，浅色眼睛⟧
⟦CHAR|康斯坦丁|m|42|char_kon|调查相关人员|鬓角银白，深色眼睛，沉稳⟧

# CHAPTER 1｜The Will

# SCENE｜Kessler & Roe, 43rd Floor

⟦BG|bg_c01s01|A law office on the 43rd floor before sunrise, floor-to-ceiling glass, one long table, three folders, the city still dark outside⟧
⟦TIME|06:40⟧
⟦BGM|c01s01|low strings, a clock, a page turning⟧

旁白：律师念到第三页的时候，停了一下。

旁白：他抬起头，看她的反应。她没有反应。她正在算这间办公室一年的租金。

律师：“……全部股权，包括九座城市的经营许可，归 Vera Kessler 小姐。”

（示例·你：“我不认识她。”）

律师：“她说她认识你。”

旁白：他把一个信封推过来。信封很旧，边角磨白，上面只有一行字，是手写的：

旁白：「给那个会把残骸定得比完品贵的孩子。」

旁白：你的手停在信封上，没有拿。

（示例·你：“她怎么知道那件事。”）

律师：“她说，她看过你写的理由。”

# SCENE｜The Ninth Door, New York

⟦BG|bg_c01s02|A narrow service corridor under a brownstone, bare brick, one unmarked steel door with a brass number 9 at eye height, a woman waiting with a lantern⟧
⟦TIME|21:50⟧
⟦BGM|c01s02|sub-bass, heels on stone, a door unlocking⟧
⟦ITEM|black card|matte black, no logo, a single letter pressed into the back⟧

旁白：门在一条没有招牌的走廊尽头。走廊里没有灯，只有一个人提着一盏灯在等。

贝尔特：“小姐。我叫贝尔特。我替她管了二十六年房子。”

（示例·你：“这里是什么地方。”）

贝尔特：“您进去就知道了。或者您不进去，现在转身，明天这些都不存在。”

旁白：她把灯举高了一点，照你的脸。她在看你会不会退。

旁白：你没有退。你只是问了一句：

（示例·你：“里面有多少人。”）

贝尔特：“今晚十八个。平时一个都没有。”

# SCENE｜The Long Table

⟦BG|bg_c01s03|A windowless room with a long black table, eighteen matte black cards laid face down in a row, one chair at the head, warm light from a single pendant⟧
⟦TIME|22:20⟧
⟦BGM|c01s03|a room tone so quiet it hums⟧

旁白：房间里只有一张桌子，一张椅子。桌上十八张黑卡，背面朝上，每张烫着一个字母。

旁白：从 A 到 R。

戴斯蒙德：“我母亲喜欢仪式。她把一家公司变成了一个游戏。”

（示例·你：“她把它变成了一个标准。”）

旁白：他看了你一眼。这一眼里有东西变了——不是敌意，是重新估算。

戴斯蒙德：“十八天。每天一个人，从早上七点到次日两点。第十九天早上，你要公布唯一一位 S++。”

（示例·你：“如果我不公布。”）

戴斯蒙德：“那它归我。这是她写的，不是我写的。”

旁白：他敲了敲桌子。

戴斯蒙德：“顺便。你只有一次机会，别出错。这里每一个人，都比你会玩这个游戏。”

旁白：他说完就走了。门在他身后合上，没有一点声音。

旁白：贝尔特把灯放在桌上。

贝尔特：“他漏说了一条。”

（示例·你：“哪一条。”）

贝尔特：“这些卡，是您翻的。顺序也是您定的。从今晚开始，十八天里，他们没有一个人能主动找您。”

旁白：她伸手，把第一张卡推到桌子中间。

贝尔特：“但您要记住——他们不能主动，不代表他们不会等。”

⟦CG|hl_01|A single hand reaching for a black card on a long table, one pendant light, eighteen cards in a row⟧

# SCENE｜The Corridor of Eighteen Doors

⟦BG|bg_c01s04|A long corridor with eighteen identical doors, brass letters A to R at eye height, no photographs, one lantern moving along the wall⟧
⟦TIME|22:50⟧
⟦BGM|c01s04|heels on stone, a lantern swinging, eighteen doors not opening⟧

旁白：贝尔特提着灯，带你走那条走廊。十八道门，每道门上一个铜字母。

旁白：门上没有名字，没有照片，没有职务。

（示例·你：“为什么没有名字。”）

贝尔特：“因为名字是给外面的人用的。在这里，他们只是一个字母。”

旁白：她走到第四道门前，停了一下。

贝尔特：“这道门的锁，是去年换的。”

（示例·你：“为什么换。”）

贝尔特：“因为上一个客人，在里面待了十一个小时，没出来。”

旁白：她继续往前走。

贝尔特：“我们不问里面发生了什么。我们只负责，第二天早上，门能打开。”

# SCENE｜The Stairwell

⟦BG|bg_c01s05|A service stairwell, painted concrete, one bare bulb, a man waiting two steps above a woman⟧
⟦TIME|23:40⟧
⟦BGM|c01s05|a bulb humming, a stairwell echo, two people not moving⟧

旁白：楼梯间里，戴斯蒙德在等你。他站在上面两级，这样他比你高。

戴斯蒙德：“我母亲晚年有个毛病。她喜欢看人挣扎。”

（示例·你：“那你呢。”）

戴斯蒙德：“我喜欢看结果。”

旁白：他从口袋里拿出一张纸，折好，递下来。

戴斯蒙德：“这是十八个人的档案摘要。你看完会知道，他们每一个都有问题。”

（示例·你：“你为什么帮我。”）

戴斯蒙德：“我不是帮你。我是在告诉你，这十八天你无论怎么选，都是错的。”

旁白：他把纸塞进你手里，转身往上走。

戴斯蒙德：“顺便。别写我的名字。我不在任何一张卡上。”

# SCENE｜The First Card

⟦BG|bg_c01s06|A small private room with one chair, one desk lamp, a single black card face up, a coat over the chair back⟧
⟦TIME|00:20⟧
⟦BGM|c01s06|a desk lamp, paper, a building settling⟧
⟦CG|hl_23|A woman alone at a desk lamp holding a single black card, coat still on, one shoe off on the floor⟧

旁白：回到自己的房间，你把十八张卡摊在桌上，一张一张看背面。

旁白：A 到 R。十八个字母，十八个人，十八天。

旁白：你把 A 拿起来，翻过来。

旁白：拉斐尔·桑多瓦尔。三十一岁。赫雷斯。马。

旁白：你忽然想笑——你连马都没骑过。

旁白：然后你想起戴斯蒙德那句话：无论怎么选，都是错的。

旁白：你把卡放下，看着它，看了很久。

旁白：最后你拿起笔，在卡的背面写了四个字，然后划掉。

旁白：那四个字是：**我凭什么。**

# CHOICE｜第一张卡，你怎么翻？

#### A｜翻开，但不看名字，先看背面

旁白：你把卡翻过来，指腹压在烫金的字母上，压了很久才抬眼。
旁白：A。拉斐尔·桑多瓦尔。三十一岁。赫雷斯。
⟦OPT|A|set:read_letter_first;authority:3;insight:1⟧

#### B｜先问贝尔特：这十八个人，你最不想让我见谁

旁白：贝尔特沉默了三秒。
贝尔特：“第四个。”
（示例·你：“为什么。”）
贝尔特：“因为您见完他，会开始怀疑自己。”
⟦OPT|B|set:asked_berthe;authority:2;trust:2;insight:2⟧

#### C｜把十八张卡全部收进包里，一张也不翻

旁白：你把十八张卡摞齐，塞进大衣内袋。
旁白：贝尔特看着，没有拦。
贝尔特：“这是您的第一年。您想什么时候开始，就什么时候开始。”
⟦OPT|C|set:took_all_cards;authority:4;ax_power:2⟧

# ·

# CHAPTER 2｜The Long Ride

# SCENE｜Long Island, Six in the Morning

⟦BG|bg_c02s01|A gravel drive at dawn, white fences, mist on the pasture, a man already on horseback waiting at the gate⟧
⟦TIME|06:55⟧
⟦BGM|c02s01|cicadas, a horse breathing, leather creaking⟧

旁白：他到得比规定时间早。这一点很重要——他不是在等她，他是本来就在这儿。

拉斐尔：“桑多瓦尔。您不用记我的姓，这里没人用姓。”

（示例·你：“那我叫你什么。”）

拉斐尔：“随您。您叫我什么都行，只要叫的时候看着我。”

旁白：他说得很平，不像调情，像在陈述一条规矩。

旁白：他把帽子扣在你头上。帽檐压下来，眼前暗了一格。

拉斐尔：“先学站。站不对，骑不了。”

# SCENE｜The Olive Grove

⟦BG|bg_c02s02|An old olive grove, dry earth, hard shadows, two horses walking side by side at a slow walk⟧
⟦TIME|09:20⟧
⟦BGM|c02s02|hooves on dry soil, wind in leaves, no music⟧

旁白：他一路没说话。走到第七排橄榄树，他才开口。

拉斐尔：“您夹得太紧。”

（示例·你：“我怕掉下去。”）

拉斐尔：“怕就夹，夹就更掉。您得信它。”

旁白：他伸手，把你的膝盖往外推了一寸。只推了一寸，然后收回手。

旁白：他的手很热。隔着裤子，那一寸的位置烫了很久。

拉斐尔：“现在。松一点。”

旁白：你松了。马没有把你甩下去。它只是抬了一下头，像在笑你。

（示例·你：“……它刚才是不是翻了个白眼。”）

拉斐尔：“它一直这样。它看不起不会骑的人。”

（示例·你：“那你呢。”）

拉斐尔：“我看得起肯学的人。”

# SCENE｜The Stable, Noon

⟦BG|bg_c02s03|A stone stable, dust in a shaft of light, hay bales, a saddle on a wooden stand, horse breathing in the next stall⟧
⟦TIME|13:10⟧
⟦BGM|c02s03|a horse shifting weight, a brush on hide, distant cicadas⟧

旁白：中午太热，马要歇，人也要歇。他把马牵进厩里，开始刷。

旁白：刷子是硬的，他下手很轻。马站着不动，眼睛半闭。

（示例·你：“它叫什么。”）

拉斐尔：“没有名字。叫名字就舍不得卖。”

旁白：他说这话的时候没有停手。刷子从马肩往下走，一下一下，很稳。

旁白：你靠在门框上看他。他背对着你，白衬衫被汗贴在肩胛骨上，两块骨头一动一动。

旁白：他忽然说：

拉斐尔：“您在看。”

（示例·你：“我在估价。”）

拉斐尔：“估出来多少。”

（示例·你：“还没估完。”）

旁白：他停了手，转过身。刷子还握在手里。

拉斐尔：“那您慢慢估。我不急。”

# SCENE｜The Stable, Afternoon

⟦BG|bg_c02s04|Inside a stall, straw on the floor, a saddle blanket spread out, the door half open letting in a bar of white light⟧
⟦TIME|15:40⟧
⟦BGM|c02s04|breathing, straw, a belt unbuckling once⟧

旁白：他把鞍毯铺在草上，说，坐。

旁白：你坐下了。他蹲在你面前，比你低一头——这个姿势很要紧，他在这个姿势里，什么都不做也让人紧张。

拉斐尔：“您今天问了我六个问题。”

（示例·你：“七个。”）

拉斐尔：“第七个我没答。”

（示例·你：“我知道。”）

旁白：他抬手，把帽子从你头上摘下来。头发被压乱了，他看了一眼，没有帮你理。

拉斐尔：“第八个问题，您想问什么。”

旁白：你看着他。他也在看你，眼睛不躲，呼吸很慢。

（示例·你：“你今天有没有一刻，忘了这是在考核。”）

旁白：他沉默了一下。这一下比之前所有的沉默都长。

拉斐尔：“有。”

（示例·你：“什么时候。”）

拉斐尔：“您刚才说，还没估完的时候。”

⟦CG|hl_02|A man kneeling in straw in a stable doorway, hat in his hand, a woman sitting on a saddle blanket, backlit by white afternoon light⟧

# SCENE｜The Stable, Dusk

⟦BG|bg_c02s05|A stable at dusk, one lantern, the horses quiet, a wooden door pulled almost shut⟧
⟦TIME|19:50⟧
⟦BGM|c02s05|a lantern wick, cloth, one held breath⟧

旁白：天黑了。他点了一盏灯，挂在钉子上，然后回来，站在你面前，没有坐下。

拉斐尔：“九门的规矩，您知道第一条吗。”

（示例·你：“我开口，才发生。”）

拉斐尔：“那您现在开口吗。”

旁白：灯在你们之间。他的脸一半亮，一半不亮。

旁白：你抬手，把灯摘下来，放在地上。房间暗了一格，也近了一格。

旁白：他的手放在你腰侧，没有动。就那么放着，像在等一个信号。

旁白：你说了三个字。声音很小，但在马厩里，什么都听得见。

（示例·你：“可以了。”）

旁白：他低下头。帽檐的影子落在你脸上。

旁白：草很软。灯在地上，把两个人的影子推到墙上，一个压着一个。

旁白：他的手从腰侧移开，往上，停在肩胛骨的位置，掌心摊平，像在确认一件东西是不是真的。

旁白：他的呼吸落在你锁骨上，热的，乱的——刚才他刷马的时候，呼吸可不是这样的。

旁白：衬衫的第二颗扣子松了。是谁解的，后来谁都想不起来。

旁白：灯芯爆了一下。

旁白：然后他把灯吹灭了。

# SCENE｜The Car, 01:40

⟦BG|bg_c02s06|Inside a car parked on gravel, dashboard light, a folded jacket on the passenger seat, condensation on the glass⟧
⟦TIME|01:40⟧
⟦BGM|c02s06|an engine ticking as it cools, rain starting far away⟧

旁白：他开车送你回城。一路没说话。快到了，他才开口。

拉斐尔：“明天几点。”

（示例·你：“没有明天。你只有一天。”）

拉斐尔：“我知道。我问的是，明天几点，我在门口站着。”

旁白：你没有回答。你在黑卡上写字。

旁白：贝尔特说过，卡上只有五栏，五个数字，一个签名。

旁白：你写完，把卡扣在膝盖上，看着窗外。

旁白：他在红灯前停下，侧过头。

拉斐尔：“写完了？”

（示例·你：“写完了。”）

拉斐尔：“多少。”

（示例·你：“不告诉你。”）

旁白：他笑了一下，转回去看路。

拉斐尔：“那我明天还站门口。”

⟦CG|hl_03|A black card on a woman's knee in a dark car, five blank lines and one handwritten number, dashboard glow⟧

# CHOICE｜第五栏，Aftercare，你给他打几分？

#### A｜满分。他吹灭灯之后，先问的是“你冷不冷”

旁白：你写下一个 20，笔尖压得很重。
旁白：你知道这一栏不该因为有感情就满分。你还是写了。
⟦OPT|A|set:scored_rafe_aftercare_20;bond_rafe:5;desire:4;ax_mercy:3⟧

#### B｜14。他做得很好，但“明天几点”那句话，是越界

旁白：你写下 14，然后在背面加了一行小字：越界一次，扣六分。
旁白：写完你才发觉，你已经在用她的方式思考了。
⟦OPT|B|set:scored_rafe_aftercare_14;authority:4;ax_gaze:2⟧

#### C｜空着。这一栏你今天没法打分

旁白：你把笔盖上，卡塞回内袋。
旁白：贝尔特说过，卡必须填满。你把这条规矩留到明天再犯。
⟦OPT|C|set:left_rafe_blank;bond_rafe:4;trust:3;ax_mercy:4⟧

# ·

# CHAPTER 3｜The Correction

# SCENE｜A Rehearsal Hall, 07:00

⟦BG|bg_c03s01|An empty ballet studio at seven in the morning, one wall of mirrors, a barre, sunlight on pale wood, no music⟧
⟦TIME|07:00⟧
⟦BGM|c03s01|a room with high ceilings, a floorboard settling, nothing else⟧

旁白：他一直背对着门。你进来，他也没转。

旁白：镜子里能看见你。他当然知道。

伊利亚：“把鞋脱了。袜子也脱。地板比你的脚干净。”

旁白：这不是羞辱，是他在说一件他认为的事实。

旁白：你脱了。地板的凉从脚心一直上到小腿。

伊利亚：“走过来。脚尖先落，脚跟最后。”

旁白：你走了三步。第三步的时候，他转过身。

伊利亚：“不对。”

# SCENE｜The Barre

⟦BG|bg_c03s02|A ballet studio, morning light from high windows, a woman at the barre, a man behind her adjusting her shoulder with two fingers⟧
⟦TIME|09:30⟧
⟦BGM|c03s02|bare feet on wood, a held count, breath⟧

旁白：他纠正你的姿势，用了四十分钟。肩膀、肋骨、下巴、尾骨。每一样都要重来。

旁白：他只用两根手指。从来不用整只手。

旁白：你被纠正到第二十七次的时候，忽然明白了一件事——他一直用两根手指，是因为整只手会让他自己失控。

（示例·你：“你为什么只用两根手指。”）

旁白：他停住了。手悬在半空。

伊利亚：“因为第三根，我就会想多停一秒。”

（示例·你：“那你停啊。”）

旁白：镜子里，你们两个都在看镜子，不看对方。

伊利亚：“你知道自己在说什么吗。”

（示例·你：“我在说，你可以多停一秒。”）

旁白：他把手放下来了。没有碰你。

伊利亚：“不。今天不行。今天你在学，我不碰在学的人。”

旁白：他说完，走回自己的位置，重新抬手。

伊利亚：“第五位置。再来。”

⟦CG|hl_04|Two figures reflected in a studio mirror, one hand hovering an inch from a shoulder, morning light, barre and pale wood⟧

# SCENE｜The Studio, Empty Hour

⟦BG|bg_c03s03|An empty studio at noon, windows open, dust, a record player on the floor, one vinyl sleeve leaning against the wall⟧
⟦TIME|12:20⟧
⟦BGM|c03s03|vinyl crackle, a slow adagio, footsteps⟧

旁白：中午他放了一张唱片。不是芭蕾，是慢得离谱的大提琴。

旁白：他躺在地板中间，一条腿屈着，一只手搭在眼睛上。

伊利亚：“过来躺下。地板凉，对你腰好。”

旁白：你躺下了。两个人中间隔着一臂。

旁白：他没有动。十分钟。唱片翻面的时候，他说了一句：

伊利亚：“我十九岁那年，跳完一场，膝盖碎了。医生说，你以后走路会疼。”

（示例·你：“那你为什么不跳了。”）

伊利亚：“因为我一瘸一拐地跳，观众会哭。我不想让他们因为可怜我哭。”

旁白：他把手从眼睛上拿下来，转过来看你。

伊利亚：“你呢。你为什么要接这个。”

（示例·你：“我不知道。可能因为有人把一件坏掉的东西，交给了我。”）

旁白：他看着你，很久。

伊利亚：“那你得先学会，坏掉的东西不该被修好。它该被重新编排。”

# SCENE｜The Studio, Mirror

⟦BG|bg_c03s04|A studio at dusk, mirrors going dark, one lamp, a man standing behind a woman facing the mirror, both barefoot⟧
⟦TIME|18:40⟧
⟦BGM|c03s04|a low drone, a held note, no melody⟧

旁白：天暗下来，镜子变成一块黑玻璃。两个人在里面，像站在水里。

旁白：他站到你身后。这次不是两根手指。

旁白：他整只手落在你的腰上，掌心贴着，五根手指都用力。

伊利亚：“现在。看着我。”

旁白：镜子里，他的下巴在你肩上方一点点。你们两个人在看同一个你。

伊利亚：“你告诉我，镜子里这个人，值多少。”

旁白：你说不出来。他的拇指在你腰侧慢慢移动，一寸。

伊利亚：“说不出来是对的。估价师也说不出来的时候，才是真的贵。”

旁白：他的呼吸落在你耳后。很轻，很稳——稳得不像话，像在数拍子。

旁白：然后他在你耳后停了一下。停的时间，比拍子长。

# SCENE｜The Studio, Late

⟦BG|bg_c03s05|A dark studio, only the emergency light above the door, bodies as silhouettes, a mirror catching one thin line of light⟧
⟦TIME|22:30⟧
⟦BGM|c03s05|breath, fabric, a floorboard⟧

旁白：是你说停的。你说，等一下。

旁白：他立刻停了。整个人退开半步，手举起来，像投降。

伊利亚：“好。”

旁白：就一个字。没有问为什么，没有解释自己。

旁白：你站在黑暗里，听见他在调整呼吸。很慢，很长，一次，两次，三次。

伊利亚：“你知道最难的是什么吗。”

（示例·你：“什么。”）

伊利亚：“不是停。是停下来之后，还站在这里。”

旁白：他没有再靠近。他只是站在离你半步的地方，等你决定。

旁白：你伸手，摸到他的手腕。他的脉搏跳得很快，快得和刚才那个有节拍的人完全不像。

（示例·你：“你数拍子，是为了不让自己乱。”）

伊利亚：“是。”

（示例·你：“那你现在乱了。”）

伊利亚：“是。”

旁白：他没有否认。这一点，比任何靠近都更让人心跳。

⟦CG|hl_05|Two silhouettes in a dark studio, one hand raised in surrender, a thin line of light on a mirror⟧

# SCENE｜The Street, 01:20

⟦BG|bg_c03s06|A quiet street outside a studio building, a black car waiting, wet asphalt, a man in a coat holding a paper cup⟧
⟦TIME|01:20⟧
⟦BGM|c03s06|distant traffic, rain that stopped an hour ago⟧

旁白：他在楼下等你。手里两杯热的东西，一杯给你，一杯自己拿着。

伊利亚：“姜。加蜂蜜。你今晚会冷。”

（示例·你：“你以前也这样。”）

伊利亚：“以前我给舞伴。现在没有舞伴了。”

旁白：他把杯子递过来，手指碰到你的手指，一秒。

伊利亚：“明天我不在门口。”

（示例·你：“我知道。”）

伊利亚：“但你哪天想学第五位置，我还在。”

旁白：他说完就走了，走得很快，像怕多留一秒就会改口。

# CHOICE｜黑卡第一栏 Presence，你写几分？

#### A｜20。他让你进门的第一秒，整个房间都变了

旁白：你写下 20，理由只有一句：他背对着门，可房间已经站满了。
⟦OPT|A|set:scored_ilya_presence_20;bond_ilya:5;authority:2⟧

#### B｜16。他太会控制，控制本身是一种躲

旁白：你写下 16，在背面写：他把一切都编成了拍子，包括他自己的心跳。
⟦OPT|B|set:scored_ilya_presence_16;bond_ilya:3;insight:2;ax_gaze:3⟧

#### C｜不写数字，写一句话：他需要一个不数拍子的人

旁白：你把卡翻过来，在空白处写了一句话，然后签名。
旁白：你知道这不合规矩。你也知道，从今天起，规矩开始由你解释。
⟦OPT|C|set:wrote_words_not_score;bond_ilya:6;authority:3;ax_mercy:3⟧

# ·

# CHAPTER 4｜The Sweep

# SCENE｜Suite 1108, 07:00

⟦BG|bg_c04s01|A hotel suite at seven in the morning, curtains shut, all lamps on, a very large man standing in the middle of the room doing nothing⟧
⟦TIME|07:00⟧
⟦BGM|c04s01|air conditioning, a clock, no music at all⟧

旁白：他进门第一件事，不是看你，是看窗。

旁白：第二件事，是把所有窗帘拉严。第三件事，是站在房间正中间，一动不动，站了四十秒。

卡西米尔：“这间房有一扇窗、一道门、一个通风口、一面共用墙。共用墙后面是走廊。”

（示例·你：“所以呢。”）

卡西米尔：“所以我不睡这间房。我睡门口。”

旁白：他说这话的时候没有任何表情，像在报一份清单。

（示例·你：“今天是我考你，不是你保护我。”）

卡西米尔：“一样。”

（示例·你：“怎么一样。”）

卡西米尔：“您要看的，是我能不能让您在这里，完全放松。”

旁白：他第一次转过头，正眼看你。

卡西米尔：“放松这件事，得先安全。”

# SCENE｜The Phone

⟦BG|bg_c04s02|A hotel suite, a small table, two cups of coffee untouched, a phone face down being pushed across the table⟧
⟦TIME|09:10⟧
⟦BGM|c04s02|a cup set down, a chair creaking⟧
⟦ITEM|phone|face down, notifications off⟧

旁白：他把你的手机推到桌子中间，屏幕朝下。

卡西米尔：“关掉。放抽屉。”

（示例·你：“如果我拒绝。”）

卡西米尔：“那今天什么都不发生。我送您下楼，写零分，我不申辩。”

旁白：他看着你，等你决定。他不劝，也不让步。

（示例·你：“为什么。”）

卡西米尔：“因为您今天要放松。而您每隔四分钟看一次那个东西。”

旁白：他说得没错。你刚才看了三次。

旁白：你把手机推进抽屉，关上。

旁白：他点了一下头，很轻，像在确认一道门锁上了。

# SCENE｜The Blackout

⟦BG|bg_c04s03|A hotel suite in complete darkness, no light at all, the hum of a dead building, a hand finding a hand⟧
⟦TIME|14:20⟧
⟦BGM|c04s03|silence, then a distant alarm, then his voice very close⟧

旁白：下午两点二十，电断了。整层楼。没有应急灯，没有窗。

旁白：黑暗来得太彻底，你伸手看不见自己的手指。

旁白：你听见他站起来。椅子腿在地毯上拖了一下。

卡西米尔：“别动。坐着。”

旁白：他的声音从房间另一头过来，很近，很稳。

卡西米尔：“我现在走过来。您会先听到我的脚步，然后听到我蹲下。我不会碰您，除非您伸手。”

旁白：他走过来了。地毯把他脚步吃掉了大半，可你还是听见了。

旁白：然后是他蹲下的声音，膝盖压在地毯上。

卡西米尔：“我在您左前方，一臂远。”

旁白：你伸手。指尖先碰到他的下巴，然后是下颌线，然后是他脖子上那道细疤。

旁白：他没有动。任你摸。

（示例·你：“你怎么一点都不紧张。”）

卡西米尔：“我紧张。但我不动。”

（示例·你：“为什么不动。”）

卡西米尔：“因为在这种黑里，动一下，您就会以为我要抓您。”

# SCENE｜The Wall

⟦BG|bg_c04s04|A pitch-black hotel room, two people sitting against the same wall, shoulders touching, a flashlight on the floor pointing at the ceiling⟧
⟦TIME|16:50⟧
⟦BGM|c04s04|the building settling, his breathing, a far siren⟧

旁白：你把应急手电打开了放在地上，光打在天花板上，房间变成一间倒过来的浅水池。

旁白：两个人靠着同一面墙坐着。他的肩很宽，你的肩贴着他的手臂。

卡西米尔：“您现在心跳多少。”

（示例·你：“不知道。”）

卡西米尔：“我猜一百一。”

（示例·你：“你怎么知道。”）

卡西米尔：“因为我手上有您的脉。刚才您抓我脖子的时候。”

旁白：你才想起，你刚才确实抓了。

（示例·你：“你不喜欢被碰？”）

卡西米尔：“我喜欢。这就是问题。”

旁白：他侧过头。天花板的光落在他脸上，一半在下巴，一半在眼睛。

卡西米尔：“我这份工作，第一条是不许喜欢。”

（示例·你：“那第二条。”）

卡西米尔：“第二条是，如果喜欢了，就用一辈子藏好。”

⟦CG|hl_06|Two people sitting on a hotel floor against a wall, one flashlight on the floor lighting the ceiling, total darkness around them⟧

# SCENE｜The Dark, After

⟦BG|bg_c04s05|A dark hotel room, a flashlight dimming, a shirt folded on a chair, two shadows on the ceiling⟧
⟦TIME|20:30⟧
⟦BGM|c04s05|a low hum, cloth, one long exhale⟧

旁白：手电快没电了。光变成琥珀色，房间像被泡在酒里。

旁白：他一直没有主动。他坐在那儿，等。

旁白：你把手放在他手上。他的手很大，你的手放上去像放错了地方。

旁白：他翻过手掌，把你的手包住，然后停住。

卡西米尔：“说一句。”

（示例·你：“什么。”）

卡西米尔：“随便什么。说一句，我才知道可以。”

旁白：你想了想。

（示例·你：“你今天做得很好。”）

旁白：他笑了一下。这是这一天里他第一次笑，笑得很难看，像不常做。

卡西米尔：“这是评语，不是许可。”

（示例·你：“那就当我没说。”）

旁白：你凑过去，在他耳边说了三个字。声音很小，小到只有他能听见。

旁白：他的手收紧了一下，然后又松开——他在给自己数数。

旁白：灯灭了。这次是彻底的黑。

旁白：黑暗里什么都看不见，所以每一个动作都变得很大：衣料的摩擦、他的呼吸突然乱掉、还有你自己没忍住的、很短的一声。

旁白：他的手掌贴在你后颈上，很稳，稳得像在托住一件会碎的东西。

旁白：然后他说了一句，声音低得几乎不算话：

卡西米尔：“告我一声，我就停。”

# SCENE｜The Lobby, 01:50

⟦BG|bg_c04s06|A hotel lobby at two in the morning, one clerk asleep, a man in a coat standing by the door with his hands behind his back⟧
⟦TIME|01:50⟧
⟦BGM|c04s06|a lobby fountain, an elevator arriving⟧

旁白：他一直送你到门口。没有多走一步。

卡西米尔：“您的手机。抽屉里，我拿出来了。”

（示例·你：“你没看。”）

卡西米尔：“没有。”

（示例·你：“我信你。”）

旁白：他愣了一下。这两个字好像比刚才那些都重。

卡西米尔：“别信我。信我这条命，不值钱。”

（示例·你：“那什么值钱。”）

卡西米尔：“您明天还愿意让我站门口。”

# CHOICE｜他把“保护”当成唯一合法的靠近。这一栏你怎么写？

#### A｜Presence 18，Devotion 20。他把自己整个交出来了

旁白：你在第五栏写 20，写得比给拉斐尔那次还重。
旁白：写完你想起他说的话——第二条是，如果喜欢了，就用一辈子藏好。
⟦OPT|A|set:scored_cas_devotion_20;bond_cas:6;trust:4;desire:3⟧

#### B｜Attenment 12。他读得懂房间，读不懂自己

旁白：你写 12，背面加一句：他连自己在喜欢，都要用工作来解释。
⟦OPT|B|set:scored_cas_attunement_12;bond_cas:4;insight:2⟧

#### C｜全部满分，你会给自己判不及格

旁白：你把卡按在桌上，笔没动。
旁白：你在想一件事——如果一个人在黑暗里都能让你安全，那你在光亮的地方，还需要谁。
⟦OPT|C|set:hesitated_on_cas;bond_cas:5;ax_mercy:4;authority:2⟧

# ·

# CHAPTER 5｜The Blindfold

# SCENE｜A Perfume Atelier, 07:00

⟦BG|bg_c05s01|A perfume atelier at dawn, glass cabinets, hundreds of small bottles, a marble counter, one chair in the middle of the room⟧
⟦TIME|07:00⟧
⟦BGM|c05s01|glass on glass, a stopper pulled, a room that smells of everything at once⟧

旁白：房间里有一千种味道，混在一起，反而什么都闻不到。

旁白：他站在柜台后面，正在用一根玻璃棒搅一瓶东西，头也不抬。

泰奥：“别深呼吸。你会晕。”

（示例·你：“那怎么闻。”）

泰奥：“短。三次。用鼻子，不用肺。”

旁白：他抬起头，笑了一下。那个笑很轻，像随手给的一件小东西。

泰奥：“你身上有雨。还有纸。还有一点……消毒水。”

（示例·你：“我刚从医院来。”）

泰奥：“我知道。我闻出来的。”

# SCENE｜Thirty-Six Bottles

⟦BG|bg_c05s02|A marble counter with thirty-six numbered bottles in a row, a woman smelling each one, a man behind her taking notes in pencil⟧
⟦TIME|10:40⟧
⟦BGM|c05s02|glass stoppers, pencil on paper⟧
⟦ITEM|blindfold|black silk, folded, waiting on the counter⟧

旁白：三十六瓶，编号从一到三十六。他让你一个一个闻，说出第一反应，不许思考。

旁白：你说到第十九瓶的时候，他停下了笔。

泰奥：“十九号，你说了'医院'。”

（示例·你：“是的。”）

泰奥：“那是给殡仪馆的。我调了三年才调对。”

旁白：房间里安静了一下。

泰奥：“你不怕说错。这一点很少见。大部分人闻到不熟悉的东西，会说'好闻'。”

（示例·你：“我不做这行。我没有面子要保。”）

泰奥：“那正好。”

旁白：他把柜台上那块黑绸拿起来，抖开。

泰奥：“接下来，你什么都看不见。”

# SCENE｜The Blindfold

⟦BG|bg_c05s03|A dark atelier, a woman seated with a black silk blindfold, a man moving around her without sound, bottles being opened and closed⟧
⟦TIME|14:10⟧
⟦BGM|c05s03|a stopper, a footstep, breath held⟧

旁白：绸子系在脑后，打了一个不紧的结。他的手从你耳后收回去的时候，擦过你的耳垂。

旁白：然后世界变了。所有看不见的地方，都开始说话。

旁白：他的脚步很轻，但你能听出方位。左边。后面。右前方。

旁白：一只手腕伸到你鼻子下面。

泰奥：“这个。”

（示例·你：“……雪松。还有烟。”）

泰奥：“还有呢。”

（示例·你：“……皮肤。”）

旁白：他没有立刻说话。你能听见他把手腕收回去，又伸回来。

泰奥：“对。香水最后一位原料，永远是皮肤。同一个人，早上和晚上，味道不一样。”

（示例·你：“那你现在闻到的是哪一种。”）

泰奥：“现在是下午。你已经开始出汗了。”

旁白：他说得很平，可你后颈一下子热了。

⟦CG|hl_07|A woman blindfolded with black silk in a glass atelier, a man's wrist held near her face, afternoon light through bottles⟧

# SCENE｜The Guess

⟦BG|bg_c05s04|A dark atelier, the blindfold still on, a man kneeling in front of a seated woman, one bottle open on the floor⟧
⟦TIME|18:30⟧
⟦BGM|c05s04|a bottle set down, a low hum from the street⟧

旁白：他跪下来，在你面前。你能听见他的膝盖落在木地板上的声音。

泰奥：“最后一瓶。这个是我自己调的，没有编号。”

旁白：瓶子凑近。你闻了一下，停住。

旁白：不是花香，不是木头。是——一个人在很暖的房间里，待了很久之后的味道。

（示例·你：“这个……”）

泰奥：“说。”

（示例·你：“这个是你。”）

旁白：他没有动。很久。

泰奥：“你怎么知道。”

（示例·你：“因为你在紧张。你的味道变了，比刚才浓。”）

旁白：他笑出声，很短，像被戳破。

泰奥：“我调了四年，没有人闻出来过。”

（示例·你：“因为别人都在猜瓶子。我在猜你。”）

旁白：他伸手，手指碰到你的下颌，然后把你的脸抬起来一点。

泰奥：“这句话，我记一辈子。”

# SCENE｜The Blindfold, Off

⟦BG|bg_c05s05|A dark atelier lit by one lamp, a black silk blindfold in a man's hand, a woman blinking in the light⟧
⟦TIME|21:50⟧
⟦BGM|c05s05|a lamp, silk sliding, breathing⟧

旁白：他把绸子解下来。光刺进来，你什么都看不清，只看见一个人的轮廓。

旁白：他没有退开。他就停在那儿，让你慢慢看清他。

泰奥：“我有个毛病。我记不住脸。”

（示例·你：“什么。”）

泰奥：“所有人的脸，在我这儿都是模糊的。我认人，靠味道。”

旁白：他把绸子绕在手指上，绕了两圈。

泰奥：“所以明天，我走在街上，认不出你。除非你从我旁边走过。”

（示例·你：“那今天呢。”）

泰奥：“今天我记得。今天我一辈子都记得。”

旁白：他低下头，很近，但没有碰。

泰奥：“如果你现在说'可以'，我今晚就忘不掉。”

旁白：你说了。

旁白：他的手先落在你的手腕上，然后往上，沿着手臂，到肩，到后颈。眼睛一直看着你，像在记一张脸。

旁白：绸子掉在地上。灯还亮着，谁都没有去关。

旁白：你后来想起来，那一天最清楚的不是任何动作，是他的呼吸突然变得很浅——一个靠鼻子活的人，第一次忘了怎么呼吸。

# SCENE｜The Street, 01:30

⟦BG|bg_c05s06|A narrow street at half past one, a lit shop window, two people walking slowly, one of them holding a small bottle⟧
⟦TIME|01:30⟧
⟦BGM|c05s06|a shutter coming down, heels on cobblestone⟧
⟦ITEM|bottle No.37|a small unnumbered bottle, hand-labeled⟧

旁白：他给你一个小瓶子。标签是手写的，写着一个字：你。

泰奥：“三十七号。没有编号的那瓶。以后每年给你调一瓶，同一配方。”

（示例·你：“那你会记得我吗。”）

泰奥：“我会记得这个味道。味道不变，我就认得。”

旁白：他停下来，站在路灯下面。

泰奥：“Vera。如果有一天你走在街上，有人忽然回头看你——那可能是我。”

旁白：他说完就走了，走得很快，手插在口袋里。

# CHOICE｜Craft 这一栏，他值多少？

#### A｜20。他用手艺把一件东西变成了只属于你的东西

旁白：你写 20。理由：他把“记住一个人”这件事，做成了可以拿在手里的东西。
⟦OPT|A|set:scored_theo_craft_20;bond_theo:6;desire:3⟧

#### B｜17。技艺满分，但他用技艺挡住了真话

旁白：你写 17，背面写：他一直在给你东西，从来不开口要。
⟦OPT|B|set:scored_theo_craft_17;bond_theo:4;insight:2;ax_gaze:2⟧

#### C｜不写这一栏，先写 Aftercare：他给的是“明天还认得出你”

旁白：你把顺序颠倒了。你知道贝尔特会看见。
旁白：你不在乎。你在立自己的规矩。
⟦OPT|C|set:reordered_theo_columns;bond_theo:5;authority:4;ax_power:2⟧

# ·

# CHAPTER 6｜The Rain Room

# SCENE｜A Tea Room Built Inside a City

⟦BG|bg_c06s01|A traditional wooden tea room assembled inside a Manhattan warehouse, rain falling in a glass courtyard beyond, tatami, one low table⟧
⟦TIME|07:00⟧
⟦BGM|c06s01|rain on glass, water in a stone basin, no music⟧

旁白：九门有一条别人学不来的本事：它能把任何一座城里的任何一间房，原样搬到另一座城。

旁白：所以你在曼哈顿的一间仓库里，看见了一间京都的茶室。窗外下着雨——真的雨，从屋顶的玻璃院子落下来。

旁白：他跪在门口，双手放在膝上。

纯：“请进。请把鞋留在这里，也把时间留在外面。”

（示例·你：“我的时间不在我身上。它在我的卡上。”）

纯：“那请您把卡也放下。”

旁白：他抬起头。眼睛很静，静得像水面。

# SCENE｜Three Things

⟦BG|bg_c06s02|Inside a tea room, a low table, a kettle over a brazier, a woman kneeling, a man's hands moving through a slow ritual⟧
⟦TIME|10:00⟧
⟦BGM|c06s02|water heating, a bamboo scoop, cloth on lacquer⟧

旁白：他说，这一小时只做三件事：烧水、沏茶、喝。

旁白：你以为是三件小事。做到第三十分钟，你才知道这三件事有多长。

旁白：他每一个动作之间都留着空白。不是慢，是**留白**——手停了，意思还在走。

（示例·你：“你这样，客人不会着急吗。”）

纯：“会。所以大部分客人，第三次就学会了不急。”

旁白：他把茶碗转过来，正面朝你，推过来。

旁白：碗是热的，热得刚好不烫手。你捧着，忽然发现自己的手在抖。

纯：“您从早上到现在，没有停过。”

（示例·你：“你怎么知道。”）

纯：“您进门的时候，呼吸是断的。现在连着。”

# SCENE｜The Rain

⟦BG|bg_c06s03|A tea room opening onto a glass courtyard, rain falling hard, a woman sitting at the edge of the tatami, a man behind her⟧
⟦TIME|15:40⟧
⟦BGM|c06s03|heavy rain on glass, one held breath⟧

旁白：雨下大了。玻璃院子变成一面流动的墙。

旁白：他坐在你身后，一臂远。你们看了很久的雨。

纯：“您知道茶道里最贵的是什么吗。”

（示例·你：“不是茶。”）

纯：“是'不给'。”

旁白：他伸手，把落在你肩上的一片枯叶拿掉。手指没有碰到皮肤。

纯：“给别人一样东西，别人会谢你。什么都不给，还让人愿意坐着——那才是本事。”

（示例·你：“那你现在，是在给我，还是不给。”）

旁白：他沉默了几秒。

纯：“我在忍。”

旁白：这两个字，是这一天里他说的最不礼貌的一句话。也是最真的。

⟦CG|hl_08|A man kneeling behind a woman at the edge of a tatami room, heavy rain on a glass courtyard, one hand holding a dry leaf⟧

# SCENE｜The Bowl

⟦BG|bg_c06s04|A tea room at dusk, one lamp, rain slowing, two tea bowls, a man lifting a bowl to her lips with both hands⟧
⟦TIME|19:20⟧
⟦BGM|c06s04|rain easing, a bowl set down, breath⟧

旁白：他沏了最后一碗。这一次他没有推过来，他端在手里。

纯：“请。”

旁白：你就着他的手喝。碗很薄，能感觉到他手指的温度。

旁白：喝到一半，他抬了一下碗，让你喝到最下面那口——最甜的那口。

旁白：他放下碗，看着你。

纯：“我今天做了一件不合规矩的事。”

（示例·你：“哪件。”）

纯：“我在数您喝了几口。”

旁白：他伸手，把你嘴角的一点水擦掉。拇指停在那儿，没有收回去。

纯：“第一口，第二口，第三口。第三口的时候，您抬眼看我。”

（示例·你：“那你怎么办。”）

纯：“我什么都没做。这是茶室。”

（示例·你：“那出了茶室呢。”）

旁白：他看了你很久。

纯：“出了茶室，我就不用忍了。”

# SCENE｜Outside the Tea Room

⟦BG|bg_c06s05|A corridor between a tea room and a warehouse door, wooden floor, dim light, rain audible through the wall⟧
⟦TIME|22:40⟧
⟦BGM|c06s05|rain through a wall, a sliding door closing⟧

旁白：他把你送到走廊。走廊很窄，两个人站着，肩膀几乎碰到。

旁白：他忽然抬手，撑在你旁边的墙上。不是困住你，是给自己一个可以站稳的地方。

纯：“我今年三十岁。做这行十一年。”

（示例·你：“嗯。”）

纯：“十一年里，我没有一次，在客人出门之后还站着不动。”

旁白：他的呼吸落在你额头上。

纯：“现在我不想动。”

旁白：你抬头。他低下头。两个人之间只剩一点空气。

旁白：你说了那两个字。

旁白：他的动作和他沏茶的时候完全不一样——茶是留白的，他不是。他的手从墙上收回来，落在你腰上，然后整个人靠过来，把你压在走廊那面木墙上。

旁白：木墙很凉，他很热。这个温差，你记了很久。

旁白：他吻得很慢，慢得不像刚才那个忍不住的人。中间停了三次，每一次都退开一点，看你的眼睛，再回来。

旁白：灯在走廊尽头。谁都没有去关它。

# SCENE｜The Warehouse Door, 01:45

⟦BG|bg_c06s06|A warehouse door open to a wet street, a man in a dark coat standing under the overhang, rain beyond⟧
⟦TIME|01:45⟧
⟦BGM|c06s06|rain, a car passing, water in a gutter⟧

旁白：他在门口站着，没有打伞。

纯：“明天我不在。但我每天下午三点，会沏一壶茶。”

（示例·你：“给谁。”）

纯：“给一个不会来的人。”

旁白：他说完，鞠了一躬。鞠得很深，很久。

旁白：你走出去很远，回头看，他还站在那儿。

# CHOICE｜他一天只做三件事，你给他第几等？

#### A｜S+。他把“不给”做成了最难的手艺

旁白：你在卡上写 S+，然后在旁边补了两个字：危险。
⟦OPT|A|set:rated_jun_s_plus;bond_jun:6;authority:3;ax_gaze:2⟧

#### B｜S。手艺满分，但他把忍耐当成了美德，这不是长久之计

旁白：你写 S，背面写：一个人忍十一年，总有一天会不想忍。
⟦OPT|B|set:rated_jun_s;bond_jun:4;insight:2⟧

#### C｜今天不评。你想再喝一次他沏的茶

旁白：你把卡收回包里。
旁白：贝尔特在车里看着你，什么都没说，只是把明天的卡递了过来。
⟦OPT|C|set:postponed_jun;bond_jun:5;ax_mercy:4;trust:2⟧

# ·

# CHAPTER 7｜The Milonga

# SCENE｜A Milonga, Before It Opens

⟦BG|bg_c07s01|An old dance hall before opening, wooden floor being swept, chairs stacked, a stage with a single bandoneon case on it⟧
⟦TIME|07:00⟧
⟦BGM|c07s01|a broom on wood, a chair dragged, street noise through open doors⟧

旁白：他把一个鞋盒放在你面前，自己先坐在地上。

塞巴斯蒂安：“脱鞋。换上这个。”

（示例·你：“这是什么。”）

塞巴斯蒂安：“我外婆的鞋码。她是城里最好的舞女。”

旁白：盒子里是一双旧舞鞋，皮子软得发亮，鞋跟磨掉过又补上。

（示例·你：“我穿这个，会摔。”）

塞巴斯蒂安：“那你就摔。这里的地板，一百年没人摔死过。”

旁白：他抬起头，笑得一点都不客气。

塞巴斯蒂安：“这里只有一件事不能做。”

（示例·你：“什么。”）

塞巴斯蒂安：“低头看脚。你要看，就看我的脸。”

# SCENE｜The First Step

⟦BG|bg_c07s02|An empty dance hall in the morning, sunlight through tall windows, two people standing in the middle of a bare wooden floor⟧
⟦TIME|09:40⟧
⟦BGM|c07s02|a metronome, then nothing, then his counting under his breath⟧

旁白：他教你走路。不是跳舞，是走路——一步一步，重心从一只脚交到另一只脚。

旁白：第七次，你走对了。他没有夸你，他忽然抱住你，把你整个人抱起来转了一圈。

塞巴斯蒂安：“就是这样！你感觉到了吗，你刚才不是在走，你是在带！”

旁白：他放下你，退开半步。

塞巴斯蒂安：“这是探戈的秘密。女人不是被带着走，女人是在决定往哪儿走，男人只是跟上。”

（示例·你：“那你呢。你跟上吗。”）

塞巴斯蒂安：“我专门跟人。”

# SCENE｜Forty People Watching

⟦BG|bg_c07s03|A crowded milonga at night, forty people around a small floor, warm lamps, a band playing bandoneon and strings⟧
⟦TIME|21:30⟧
⟦BGM|c07s03|live bandoneon, strings, a hundred small conversations⟧

旁白：晚上九点半，舞厅满了。四十个人，都不认识你，都在看你。

旁白：他伸手。

塞巴斯蒂安：“别看我。看我的脸，但别看我的眼睛。”

（示例·你：“看哪儿。”）

塞巴斯蒂安：“看我的嘴。我要唱了。”

旁白：他跟着乐队唱了一句。声音不高，沙的。

旁白：你笑出来。你就这么笑着，被他带进了舞池。

旁白：第一步踩下去，你听见自己的鞋跟落在地板上——很响，很实。这个声音让你忽然不怕了。

旁白：他带你转。地板在脚下滑过去，灯光从脸上扫过。

旁白：你在第四圈的时候，忽然明白他在做什么：他把你转给所有人看，然后每一次转回来，都让你更靠近他一点。

旁白：第五圈，他的手在你后背上收紧，把你按近。近到你能感觉到他衬衫下面的心跳。

旁白：他没有说话。他只是低下头，嘴唇擦过你的太阳穴。

旁白：四十个人还在看。他不在乎。他在乎的是——你也没有躲。

⟦CG|hl_09|A crowded milonga floor, a couple dancing close in warm lamplight, forty onlookers in shadow, bandoneon player⟧

# SCENE｜The Alley Behind

⟦BG|bg_c07s04|A narrow alley behind a dance hall at midnight, brick wall, one bulb, music muffled through a door⟧
⟦TIME|00:10⟧
⟦BGM|c07s04|muffled bandoneon through a wall, a door propped open⟧

旁白：他把你从舞池里带出来，穿过侧门，进了后巷。音乐被关在门里，剩下一点闷响。

旁白：他背靠砖墙，喘。额头上全是汗。

塞巴斯蒂安：“对不起。”

（示例·你：“为什么道歉。”）

塞巴斯蒂安：“因为我刚才在台上，想的不是跳舞。”

旁白：他抬起头，眼睛在灯泡下面亮得很不体面。

塞巴斯蒂安：“我从十六岁开始跳。十年，我在台上从来没分心过。”

（示例·你：“今天呢。”）

塞巴斯蒂安：“今天第四圈，我忘了下一步是什么。”

旁白：他伸手，把你拉过去，让你站在他两脚之间，背贴着他的胸口。

塞巴斯蒂安：“就这样。别动。”

旁白：他的下巴抵在你肩上，呼吸一下一下打在你颈侧。

旁白：门里的音乐换了一首，慢的。

塞巴斯蒂安：“你看，他们还在跳。他们不知道，最好的那一支，我们在外面跳。”

# SCENE｜The Alley, Later

⟦BG|bg_c07s05|A narrow alley at night, one bulb, two people against a brick wall, her hand on his chest, his hand at her waist⟧
⟦TIME|01:20⟧
⟦BGM|c07s05|muffled music, breathing, brick scraping cloth⟧

旁白：他的手一直在腰上，没有往上，也没有往下。就停在那儿。

旁白：这不是克制，这是他在等你说话。

旁白：你把他的手往上带了一点。就一点。

旁白：他的呼吸断了。

塞巴斯蒂安：“你知道我二十六岁吧。”

（示例·你：“我知道。”）

塞巴斯蒂安：“我二十六，可我刚才在台上，觉得自己十六。”

旁白：他低下头，把额头抵在你的锁骨上。热的，湿的。

塞巴斯蒂安：“说一句。说一句我就动。”

旁白：你说了。

旁白：他抬起头的时候，整个人都不一样了——不是那个跳舞的人，是一个终于不用表演的人。

旁白：砖墙很凉。灯泡在头顶上晃，把两个人的影子甩来甩去。

旁白：他的手在你后背，从上往下，很慢，像在数脊椎。

旁白：门里的音乐停了。有人鼓掌。

旁白：他笑了一下，气息喷在你耳后，然后没有停。

# SCENE｜The Empty Hall, 01:55

⟦BG|bg_c07s06|An empty dance hall after closing, chairs stacked, one lamp left on, two pairs of shoes on the floor⟧
⟦TIME|01:55⟧
⟦BGM|c07s06|a hall with nothing in it, a chair being folded, one set of footsteps⟧

旁白：人走光了。他把你外婆那双舞鞋脱下来，放回盒子里。

塞巴斯蒂安：“明天我还来。每天下午四点，我在这儿练。”

（示例·你：“一个人练？”）

塞巴斯蒂安：“一个人练。等一个可能不来的人。”

旁白：他把盒子递给你。

塞巴斯蒂安：“鞋你拿着。你哪天想来，穿它。”

（示例·你：“如果我不来呢。”）

塞巴斯蒂安：“那我就一直练。反正我除了这个，什么都不会。”

# CHOICE｜Presence 和 Aftercare，他一个 20 一个 14，你怎么调？

#### A｜两个都给 20。他在四十个人面前，把最私人的东西给了你

旁白：你写下两个 20，笔尖把纸压出了印。
⟦OPT|A|set:scored_seba_both_20;bond_seba:6;desire:5;ax_gaze:2⟧

#### B｜Presence 20，Aftercare 10。他忘了你明天要面对什么

旁白：你写 10，背面写：他活在今晚，可你还有十七天。
⟦OPT|B|set:scored_seba_aftercare_10;bond_seba:4;authority:3;insight:1⟧

#### C｜给他的不是分数，是那双鞋的归还日期

旁白：你在卡上写：鞋，三周后还。
旁白：这不是评分，这是约定。你知道自己在做什么。
⟦OPT|C|set:made_a_date_with_seba;bond_seba:5;trust:3;ax_mercy:3⟧

# ·

# CHAPTER 8｜The Observation

# SCENE｜An Apartment That Is Also a Lab

⟦BG|bg_c08s01|A minimalist apartment with research equipment, electrodes on a table, two monitors, a single bed made with hospital corners⟧
⟦TIME|07:00⟧
⟦BGM|c08s01|a monitor humming, a pen clicking, no music⟧

旁白：他的公寓像一间没有人住的房间。所有东西都在该在的位置，连空气都像被整理过。

朱利安：“我先说明三件事。”

旁白：他竖起三根手指。手指很长，指甲剪得很短。

朱利安：“第一，今天你会被记录。心率、皮电、呼吸。数据归你，不归我。”

朱利安：“第二，我随时可以停，你也可以随时停。”

朱利安：“第三——这一点最重要——我不会碰你，除非你让我碰。因为一旦我碰了，数据就不再干净。”

（示例·你：“那你今天打算怎么过。”）

朱利安：“观察。然后告诉你，我在你身上看到了什么。”

# SCENE｜The Baseline

⟦BG|bg_c08s02|A chair in the middle of a bare room, electrodes on a woman's wrist and collarbone, a man adjusting a monitor⟧
⟦TIME|09:30⟧
⟦BGM|c08s02|a monitor beeping slowly, electrode gel, a chair⟧

旁白：他把电极贴在你手腕内侧和锁骨上方。贴的时候，指尖是凉的。

旁白：他贴完，退开，坐下，看着屏幕。

朱利安：“现在，什么都不要做。坐十分钟。”

旁白：十分钟很长。你听见自己的心跳在屏幕上变成一条线。

旁白：第五分钟，你开始不自在。第七分钟，你开始想说话。第九分钟，你说了。

（示例·你：“这有什么意义。”）

朱利安：“有意义。你忍了九分钟。”

旁白：他把屏幕转过来给你看。

朱利安：“基线是六十八。刚才那九分钟，你升到了九十四。你没有动，没有出汗，什么都没做。”

（示例·你：“所以呢。”）

朱利安：“所以你害怕安静。安静的时候，你就要填东西进去。”

# SCENE｜The Finding

⟦BG|bg_c08s03|A bare room, monitor light on two faces, a woman seated, a man standing with arms crossed⟧
⟦TIME|13:20⟧
⟦BGM|c08s03|monitor, a chair, his voice flat and careful⟧

旁白：下午他给你做了一组测试。看图片，听声音，回答问题。

旁白：到第三组，他停下来。

朱利安：“我发现了三件事。你要听吗。”

（示例·你：“说。”）

朱利安：“第一，你看人的时候，先看手。不是脸。”

旁白：你没有反驳。你确实先看手。

朱利安：“第二，有人在房间里靠近你，你的心率会降。不是升。”

（示例·你：“为什么。”）

朱利安：“因为靠近意味着有人替你承担注意力。你被看着的时候，就不用自己看。”

旁白：他放下手里的笔。

朱利安：“第三。你刚才回答'你累吗'那个问题的时候，说了'还好'。你的皮电在'还'字上跳了一下。”

（示例·你：“那是机器的问题。”）

朱利安：“机器没有问题。人有问题。”

⟦CG|hl_10|A monitor screen with a heartbeat line, reflected in a man's glasses, a woman's wrist with electrodes in the foreground⟧

# SCENE｜The Permission

⟦BG|bg_c08s04|A bare apartment at dusk, electrodes removed and laid on a table, two people sitting on the floor against a wall⟧
⟦TIME|19:40⟧
⟦BGM|c08s04|monitors off, a room that is suddenly very quiet⟧

旁白：天暗下来，他把机器全关了。房间忽然安静得不像话。

旁白：他摘了眼镜，坐在你旁边的地板上。没有垫子，就那么坐着。

朱利安：“现在不记录了。”

（示例·你：“那现在算什么。”）

朱利安：“算我今天唯一没有被写进报告的三小时。”

旁白：他侧过头看你。没有眼镜，他的眼睛比刚才软。

朱利安：“我三十八岁。做这行十四年。我研究过两千多个人。”

（示例·你：“然后呢。”）

朱利安：“然后我发现，我只会用数据碰人。”

旁白：他把手放在你们之间的地板上，掌心朝上，没有伸过来。

朱利安：“这是我能做的，最不专业的一件事。把手放在这儿，等你决定。”

旁白：你看着那只手。手指长，指节干净，掌心的纹路很深。

旁白：你把手放上去。

旁白：他的手合起来，很慢。

朱利安：“你的心率现在一百零三。”

（示例·你：“你不是说不记录了吗。”）

朱利安：“我不用机器也知道。”

# SCENE｜The Reverse

⟦BG|bg_c08s05|A dark apartment, one lamp, a woman standing over a seated man, electrodes in her hand, his wrist turned up⟧
⟦TIME|22:50⟧
⟦BGM|c08s05|electrode gel, a lamp, one unsteady breath⟧

旁白：后来是你先动的。你拿起桌上的电极，看着他。

（示例·你：“现在换我。”）

旁白：他愣了一下。然后他笑了——一个真正意外的人才会有的那种笑。

朱利安：“这不合程序。”

（示例·你：“你说了，数据归我。”）

旁白：他把手腕翻过来，放在你膝上。袖子往上推。

旁白：电极贴上去的时候，他的手抖了一下。

（示例·你：“你紧张。”）

朱利安：“我很紧张。”

（示例·你：“为什么。”）

朱利安：“因为我在被看。我这辈子，只习惯看别人。”

旁白：你低下头，凑到他手腕那儿，没有贴电极，只是把嘴唇放在那儿，停了两秒。空气里有电极凝胶和针织衫的味道。

旁白：他的呼吸整个乱掉。已经硬了，却仍只把手腕放在你膝上。

朱利安：“这不科学。”

（示例·你：“那你就把它写进报告。”）

旁白：他伸手，把你拉下来。灯在桌上，晃了一下，倒了，没有灭。他的吻一开始很克制，像在确认变量。后来就不像了。手在你后颈，拇指压着那根跳得最快的血管。他停住一次，问：“可以？”你点头。他让你到了一次，自己忍着，额头抵着你的，还在报数字：“你现在一百二。”

（示例·你：“闭嘴。”）

朱利安：“好。……还好吗。这是我能做的，最不专业的一件事。”

# SCENE｜The Morning After, 01:50

⟦BG|bg_c08s06|A bare apartment at two in the morning, monitors dark, two cups on the floor, a man sitting on the edge of a hospital-cornered bed⟧
⟦TIME|01:50⟧
⟦BGM|c08s06|a refrigerator, a city below, a pen on paper⟧

旁白：他在写东西。不是报告，是一张便签。

旁白：他写完，撕下来，递给你。

朱利安：“这是我今天观察到的第四件事。没有写进报告。”

旁白：便签上写着一行字：

旁白：「她不是害怕安静。她是害怕安静里没有人。」

（示例·你：“你为什么给我这个。”）

朱利安：“因为你明天要评我。你评我的时候，会想起这句话。”

（示例·你：“这算不算作弊。”）

朱利安：“算。我十四年来第一次作弊。”

# CHOICE｜Attunement 这一栏，你怎么处理这张便签？

#### A｜给 20。他看见的比你自己看见的多

旁白：你写 20。便签折好，放进内袋。
⟦OPT|A|set:scored_julian_attunement_20;bond_julian:6;insight:2⟧

#### B｜给 18，然后扣他 4 分作弊

旁白：你写 18，再在背面写：−4，越界。
旁白：写完你笑了一下。你在跟他玩同一套规则。
⟦OPT|B|set:scored_julian_18_minus_4;bond_julian:4;authority:4⟧

#### C｜不评分。你给他一张空白的卡

旁白：你把卡推给他，笔也推过去。
（示例·你：“你今天观察了我一天。现在你写，我值多少。”）
⟦OPT|C|set:gave_julian_blank_card;bond_julian:7;authority:3;ax_power:3⟧

# ·

# CHAPTER 9｜The Coast Road

# SCENE｜A Garage of Old Cars

⟦BG|bg_c09s01|A garage full of vintage sports cars, concrete floor, tool benches, one car with its hood open⟧
⟦TIME|07:00⟧
⟦BGM|c09s01|a wrench, an engine idling, tires on concrete⟧

旁白：他躺在车底下。你站在旁边，只看见两条腿和一只沾了油的手。

卢卡：“等我两分钟。这车的化油器跟我闹脾气。”

（示例·你：“我可以等。”）

卢卡：“我知道你可以。今天你可以等，明天不行。”

旁白：他从车底滑出来，脸上有一道油，笑得很懒。

卢卡：“今天你不能等。今天你要跟我走。”

# SCENE｜The Engine

⟦BG|bg_c09s02|A vintage coupe on a coastal road, top down, wind, cliffs on one side and sea on the other, late afternoon light⟧
⟦TIME|16:20⟧
⟦BGM|c09s02|engine, wind, tires on asphalt, no radio⟧

旁白：他把车开出城，一路往北。海岸线在右边，太阳在往下掉。

旁白：他一直没说话。风把两个人的头发都吹乱了。

旁白：四十分钟后，他忽然开口。

卢卡：“你知道我为什么不放音乐吗。”

（示例·你：“为什么。”）

卢卡：“因为音乐一响，人就不说话了。我想听你说话。”

（示例·你：“那你问。”）

卢卡：“你上一次，什么都不想，是什么时候。”

旁白：你想了很久。想到车开了两公里。

（示例·你：“想不起来。”）

卢卡：“那今天算一次。”

旁白：他踩下油门。风变大了，大到你说话要喊。

旁白：他没有再问。他只是把手伸过来，掌心朝上，放在你们两个座位之间。

# SCENE｜The Cliff

⟦BG|bg_c09s03|A gravel turnout on a cliff at sunset, the sea below, the car parked at an angle, two people leaning on the hood⟧
⟦TIME|19:10⟧
⟦BGM|c09s03|surf far below, wind, an engine ticking as it cools⟧
⟦CG|hl_11|A vintage coupe parked on a cliff turnout at sunset, two figures leaning on the hood, the sea below⟧

旁白：他停在路边一块空地上。下面是海，很响。

旁白：两个人靠着车头，谁都没说话。太阳掉下去，海变成铁灰色。

卢卡：“我十九岁那年，开一场比赛。最后一圈，我前面那辆车翻了。”

（示例·你：“他怎么样。”）

卢卡：“活着。但他老婆后来问我一句话，我到现在答不上来。”

（示例·你：“什么话。”）

卢卡：“她问，你为什么不早点刹车。”

旁白：他把手插进兜里。

卢卡：“我后来就不开了。改成卖车。每一辆我都修好，然后卖掉。卖的时候我跟买家说，这车能开到两百四，但你别开。”

（示例·你：“那你自己呢。”）

卢卡：“我自己？我一直在开。我只是不停在同一个地方。”

# SCENE｜The Car, After Dark

⟦BG|bg_c09s04|Inside a parked car at night, windows fogged, dashboard glow, a man in the driver's seat and a woman beside him⟧
⟦TIME|22:40⟧
⟦BGM|c09s04|surf, rain starting on the roof, an engine off⟧

旁白：下雨了。他把车顶拉起来。空间一下子变小。

旁白：雨点打在帆布顶上，声音很密，密到像有人在头顶上讲话。

旁白：他没有发动车。他把手放在方向盘上，看着前面黑掉的海。

卢卡：“我今天做了一件很不上道的事。”

（示例·你：“什么。”）

卢卡：“我一直在开。开到你没法下车。”

旁白：他转过头。

卢卡：“现在车停了。你可以下车。你也可以不下。”

旁白：雨越下越密。玻璃起了雾。

旁白：你伸手，在雾上画了一道。外面什么都看不见。

（示例·你：“我看不见外面。”）

卢卡：“那就看我。”

旁白：他靠过来。这个距离，两个人在车里谁都不好动。

旁白：他先吻在你的嘴角，偏了一点——不是失手，是给你一个躲开的机会。

旁白：你没有躲。

旁白：他的手从方向盘上松开，落在你后颈，然后往下，停在腰后。

旁白：空间太小了。每动一下，都碰到车门、碰到座椅、碰到对方。这种“没地方去”的感觉，比任何技巧都要紧。

旁白：他的呼吸打在你锁骨上，热的。外面是雨，是海，是黑。

旁白：他忽然停住，额头抵着你的额头。

卢卡：“说一句。”

旁白：你说了。声音很轻，被雨盖掉一半。

旁白：他笑了一下，然后重新低下头。

旁白：帆布顶上的雨一直没停。车里的雾越来越厚。

# SCENE｜The Brake Line

⟦BG|bg_c09s05|A gravel turnout before dawn, a car with its hood up, a flashlight, a man crouched by a wheel well⟧
⟦TIME|05:20⟧
⟦BGM|c09s05|surf, a flashlight click, metal on metal⟧

旁白：天快亮的时候，他下车检查。他说跑了一夜，得看看。

旁白：你听见他在车头那边骂了一句，很轻。

旁白：你下去。他蹲在右前轮旁边，手电照着里面。

卢卡：“过来看。”

旁白：刹车油管上有一道很细的划痕。不是磨损，是刀口。

卢卡：“这不是老化。这是有人不想让我们下山。”

旁白：他抬起头，脸上没有笑。

卢卡：“今天谁安排的车。”

（示例·你：“九门的车库。”）

卢卡：“那你要查的不是我。”

旁白：他把手电关了。天亮起来，海是灰的。

卢卡：“上车。我开慢点。今天我们走另一条路。”

⟦CG|hl_12|A man crouched by a car wheel well at dawn holding a flashlight, a thin cut on a brake line, the sea behind⟧

# SCENE｜The Garage, 06:40

⟦BG|bg_c09s06|A garage at sunrise, the car back in its bay, a man wiping his hands on a rag, a woman standing in the doorway⟧
⟦TIME|06:40⟧
⟦BGM|c09s06|a rag, tools being put away, birds outside⟧

旁白：回到车行，他把车停回原位，用抹布擦手，擦得很久。

卢卡：“今天的事，你别写进报告。”

（示例·你：“为什么。”）

卢卡：“因为写进去，明天就没人敢给你派车了。你会被关在楼里。”

旁白：他把抹布扔在台子上。

卢卡：“我不在乎我的分。我在乎你还能出门。”

# CHOICE｜他救了你一次，还让你别写。这栏怎么填？

#### A｜Craft 20，Devotion 20。他把命和饭碗一起押上了

旁白：你写下两个 20，然后在本子背面记下另一件事：刹车油管，刀口，九月十四日。
⟦OPT|A|set:scored_luca_both_20;bond_luca:7;insight:3;trust:4⟧

#### B｜分数照给，但这件事你必须写进报告

旁白：你在报告上写了一行：车辆被人为改动，建议自查。
旁白：你知道这一行会让明天变得很难。你还是写了。
⟦OPT|B|set:reported_the_brake_line;authority:5;insight:4;bond_luca:3⟧

#### C｜给他满分，然后把这件事交给贝尔特，不交给戴斯蒙德

旁白：你在车里给贝尔特发了一条消息，只有六个字：查九门的车库。
旁白：她回了一个字：好。
⟦OPT|C|set:told_berthe_about_car;bond_luca:5;insight:4;trust:3⟧

# ·

# CHAPTER 10｜The Empty House

# SCENE｜One Floor, Nothing In It

⟦BG|bg_c10s01|An empty apartment floor, bare boards, one mattress by a tall window, white walls, nothing else at all⟧
⟦TIME|07:00⟧
⟦BGM|c10s01|a room with nothing to absorb sound, footsteps echoing⟧

旁白：整层楼是空的。不是没装修，是被搬空了。

旁白：地板上只有一张床垫，一扇窗。窗外的光把房间照得很白。

旁白：他站在窗边，背对着你，站了很久才开口。

安德斯：“这里什么都没有。”

（示例·你：“我看得见。”）

安德斯：“我做了十二年家具。上个月我把所有东西搬走了。”

（示例·你：“为什么。”）

安德斯：“因为我想知道，人到底需要几样。”

旁白：他转过身。很高，走一步就到了你面前。

安德斯：“今天你要告诉我，你留下哪一样。”

# SCENE｜Three Hours of Nothing

⟦BG|bg_c10s02|An empty room, a woman sitting on bare floor by the window, a man sitting across from her, both silent⟧
⟦TIME|11:20⟧
⟦BGM|c10s02|nothing. distant traffic. a bird on the sill⟧

旁白：他坐下来，盘腿，手放在膝盖上。

安德斯：“现在开始，三个小时，我们不说话。”

（示例·你：“三个小时？”）

安德斯：“你说一个字，我就扣自己十分。”

旁白：你以为你撑不住。第一小时，你数窗框的格子。第二小时，你听楼下的车。

旁白：第三小时，你开始看他。

旁白：他闭着眼，呼吸很慢。阳光从他侧脸过去，把睫毛的影子投在颧骨上。

旁白：你忽然发现，三个小时里，你的心跳慢下来了。慢到你自己都听见了。

旁白：三小时到，他睁开眼。

安德斯：“三个小时，你看了我四十七次。”

（示例·你：“你闭着眼怎么知道。”）

安德斯：“我不知道。我猜的。”

旁白：他嘴角动了一下。

安德斯：“但你刚才没有否认。”

# SCENE｜What You Keep

⟦BG|bg_c10s03|An empty room at dusk, one mattress, a window turning orange, two people sitting on the floor facing each other⟧
⟦TIME|18:30⟧
⟦BGM|c10s03|a room tone, a floorboard, wind outside⟧

旁白：天快黑的时候，他问那个问题。

安德斯：“你留下哪一样。”

旁白：房间里什么都没有。这个问题等于问你：你是谁。

旁白：你想了很久。

（示例·你：“我要留下这扇窗。”）

安德斯：“为什么。”

（示例·你：“因为别的东西我都可以买。这扇窗的光，只有这个时间、这个高度、这个方向有。”）

旁白：他看着你，看了很久。

安德斯：“十二年，我做过四百多件家具。没有一个人回答过窗。”

旁白：他站起来，走到窗边，把窗户推开。

安德斯：“那这扇窗归你。今天归你。”

⟦CG|hl_13|A tall window in an empty room at dusk, a man and a woman sitting on bare floor, orange light across the boards⟧

# SCENE｜Sit Down

⟦BG|bg_c10s04|An empty room at night, the window open, city light, one mattress on the floor, a man standing over a woman⟧
⟦TIME|22:10⟧
⟦BGM|c10s04|wind through an open window, distant traffic, cloth⟧

旁白：天黑透了，房间没有灯。城市的灯光从窗口照进来，把地板划成一块一块。空气很凉，只有这一张床垫。

旁白：他站在你面前，说了一个词。已经半硬，却仍只说一个词。

安德斯：“坐下。”

旁白：你坐下了。床垫很薄，地板很硬。

旁白：他跪下来。这个高度，他的脸和你一样高。手极大，指节粗，掌心温。

安德斯：“我今天跟你说的话，比我上个月说的都多。”

（示例·你：“那你平时说什么。”）

安德斯：“不说。”

旁白：他伸手，把你脸侧的头发拨到耳后。手很大，动作很轻——这两种东西放在一起，让人心里发慌。

安德斯：“我做的床，四百多张。每一张我都试躺过。”

（示例·你：“然后呢。”）

安德斯：“然后我回自己的房间，睡地板。”

（示例·你：“为什么。”）

安德斯：“因为那张床是给别人的。今天……你留下哪一样。说一句。说了我就动。”

# SCENE｜The Empty Room, Full

⟦BG|bg_c10s05|An empty room at night, one mattress, an open window, two people, city light on bare walls⟧
⟦TIME|00:40⟧
⟦BGM|c10s05|wind, a distant siren, breathing that echoes⟧

旁白：空房间有一个坏处：什么声音都藏不住。

旁白：每一次呼吸，都有回声。布料擦过皮肤的声音，被四面白墙弹回来，听得清清楚楚。你说了。他的手掌贴在你髋骨上，五指张开，像在量尺寸。他吻得很慢，几乎没有声音，只有回声。手探入，掌心贴着你的皮肤。他让你到了一次，自己忍着，额头抵着你的。城市的光把两个人的影子投在墙上，一个压着一个。

旁白：余韵时他说：“我知道了。两样。一扇窗，和一个人。”

旁白：他的手在你背上，掌心很热，压得很实。

旁白：你听见自己的呼吸变快了，然后你听见他听见了。

旁白：他停下来。

安德斯：“你的呼吸变了。”

（示例·你：“我知道。”）

安德斯：“我要听你说。”

旁白：你说了。声音在空房间里荡了一下才消失。

旁白：他低下头。这一次没有停。

旁白：窗开着，夜风进来，把两个人身上的热气吹散又聚起来。

旁白：他的手从后背移到腰，再往下，停在髋骨上，五指张开，像在量一件家具的尺寸。

旁白：你后来想起这一夜，记得最清楚的是那扇窗——它一直开着，城市的灯一直在外面，而房间里什么都没有，只有两个人。

旁白：什么都没有的房间，反而什么都放大了。

# SCENE｜The Window, 01:50

⟦BG|bg_c10s06|An empty room before dawn, gray light, one mattress, a man sitting with his back against the wall, a woman beside him⟧
⟦TIME|01:50⟧
⟦BGM|c10s06|birds starting, a city waking, a floorboard⟧

旁白：天快亮的时候，他坐在墙边，一条腿屈着，手搭在膝上。

安德斯：“明天我搬一张床回来。”

（示例·你：“你不是说要知道人需要几样。”）

安德斯：“我知道了。”

（示例·你：“几样。”）

安德斯：“两样。一扇窗，和一个人。”

旁白：他侧过头看你。

安德斯：“这张床，我自己睡。”

# CHOICE｜Presence 20，Aftercare 你给几分？

#### A｜20。他一句话不说，却让整个房间都站着他

旁白：你写 20。背面写：沉默也是在场的一种方式，而且更贵。
⟦OPT|A|set:scored_anders_both_20;bond_anders:6;desire:3;trust:3⟧

#### B｜15。他把“什么都不给”练成了本事，可你今天需要有人给

旁白：你写 15，背面写：他省下来的，都是他自己不敢要的。
⟦OPT|B|set:scored_anders_aftercare_15;bond_anders:4;insight:2⟧

#### C｜不填。你在卡片背面画了一扇窗

旁白：你画得很简单，四条线，一个十字。
旁白：贝尔特看到这张卡的时候，看了你三秒。
⟦OPT|C|set:drew_a_window;bond_anders:5;authority:3;ax_mercy:3⟧

# ·

# CHAPTER 11｜The Late Recital

# SCENE｜A Piano Room, Out of Tune

⟦BG|bg_c11s01|A small concert room with one grand piano, wooden floor, chairs stacked, morning light through tall shutters⟧
⟦TIME|07:00⟧
⟦BGM|c11s01|a single note struck, then the same note again, beating against itself⟧

旁白：他在弹一个音。同一个音，一遍，又一遍。

旁白：你听不出区别。他停下来。

安东：“这个音低了。低了一点点。你听。”

旁白：他又弹了一次。这一次你听见了——声音里有一种很细的抖动，像两个人在吵架。

（示例·你：“它自己在打架。”）

安东：“对。这叫拍音。两个频率差一点点，就会打架。”

旁白：他看着你，眼睛里有一点意外。

安东：“你是第一个说'打架'的。别人都说'不准'。”

# SCENE｜The Tuning

⟦BG|bg_c11s02|A grand piano with its lid open, a man leaning inside with a tuning hammer, a woman sitting on the bench watching⟧
⟦TIME|10:30⟧
⟦BGM|c11s02|a tuning hammer, single notes, felt on strings⟧

旁白：调一台琴要两个小时。他不让你走，也不让你帮忙。

旁白：他让你坐在琴凳上，听。

旁白：每调好一个音，他就弹一下，看你。

安东：“这个。”

（示例·你：“对了。”）

安东：“你怎么知道。”

（示例·你：“不打架了。”）

旁白：他笑了一下。笑得很干，像很久没练过。

安东：“我十九岁在教堂弹管风琴。那时候我觉得，音准是上帝的事。”

（示例·你：“现在呢。”）

安东：“现在我觉得，音准是两个人的事。一个人弹，一个人听，中间那个'对'，才算数。”

# SCENE｜Four Hands

⟦BG|bg_c11s03|A grand piano, a woman on the bench, a man standing behind her, his hands over hers on the keys⟧
⟦TIME|15:20⟧
⟦BGM|c11s03|a slow piece, played badly, then better⟧

旁白：他教你弹。左手三个音，来回。

旁白：他站在你身后，手覆在你的手上，带着你按。

旁白：他的手很稳。你的手在他手里，像被装进一个不太合尺寸的盒子。

安东：“慢一点。你急。”

（示例·你：“我怕弹错。”）

安东：“错就错。音准是调出来的，不是怕出来的。”

旁白：第三遍，你弹对了。他没有松手。

旁白：他的手还覆着，掌心贴着你的手背，拇指在你手腕的骨头上按了一下。

安东：“这里。你的脉在跳。”

（示例·你：“那是紧张。”）

安东：“我知道。我调了二十年琴，我知道什么东西在抖。”

旁白：他没有松手。他低下头，下巴几乎挨到你的头发。

安东：“现在，你听。我不弹，你也听得见。”

⟦CG|hl_14|A man standing behind a woman at a grand piano, his hands over hers on the keys, afternoon light through shutters⟧

# SCENE｜The Resonance

⟦BG|bg_c11s04|A piano room at night, lid open, one lamp, a woman lying back against the piano's side, a man beside her⟧
⟦TIME|21:40⟧
⟦BGM|c11s04|a sustained low note fading, room resonance, breath⟧

旁白：晚上他弹了一首很慢的东西。弹完，他按住一个低音，让它在房间里散开。

旁白：那个音散了很久。散到最后，你分不清是琴在响，还是房间在响。

安东：“这就是共振。一个东西响了，另一个跟着响，不用碰。”

旁白：他站起来，走到你面前。

安东：“我今天一直在想一件事。”

（示例·你：“什么。”）

安东：“你现在这个状态，是哪个音。”

旁白：他抬手，指尖碰你的颈侧，停在那儿。

安东：“太快了。比刚才那个低音快得多。”

旁白：他的手往下，落在肩上，再往下。

安东：“我得慢一点。不然拍音会出来。”

旁白：他真的慢。慢到你以为他在忍，其实他是在调——把你从快调到慢，一格一格。

旁白：琴盖还开着。灯照在琴弦上，那些弦在轻轻震。

# SCENE｜The Late Recital

⟦BG|bg_c11s05|A piano room at midnight, one lamp turned low, the piano closed, two people on the wooden floor⟧
⟦TIME|23:50⟧
⟦BGM|c11s05|a closed piano settling, cloth, a held breath⟧

旁白：他把琴盖合上。这个动作很轻，像怕吵到琴。空气里有琴木和旧衬衫的味道。

旁白：然后他坐在地板上，背靠着琴，伸手。已经半硬，却仍只伸手。

安东：“过来。”

旁白：你走过去，跪坐在他面前。他把你拉下来，让你靠在他胸口。

旁白：他的心跳很慢。慢得不正常。

（示例·你：“你心跳这么慢。”）

安东：“因为我一直在数拍子。四拍一小节，一小节四拍。数了二十年。”

（示例·你：“那现在呢。”）

安东：“现在数到第三拍，就数不下去了。说一句。说了我就继续。”

旁白：你说了。他低下头，吻在你额头上，然后眉心，然后鼻尖，每一个地方都停一下，像在调音。最后停在唇上。这一次没有停。手探入，掌心贴着你的皮肤，再往下。他停住一次，问：“可以？”你点头。他让你到了一次，自己忍着，额头抵着你的。地板很硬，琴在背后，灯在远处。你听见自己的呼吸被木墙弹回来，混在他的呼吸里，分不清哪个是哪个。

旁白：这就是共振。余韵时他说：“音准是两个人的事。一个人弹，一个人听，中间那个'对'，才算数。”

# SCENE｜The Bench, 01:40

⟦BG|bg_c11s06|A piano room at two in the morning, one lamp, a man sitting at the bench with the lid closed, a woman standing behind him⟧
⟦TIME|01:40⟧
⟦BGM|c11s06|a lamp, a bench, one note pressed and held⟧

旁白：他坐在琴凳上，没有弹。只是把手放在琴盖上。

安东：“我这一辈子，都在调别人的音。”

（示例·你：“那你自己呢。”）

安东：“我自己？我从来不准。”

旁白：他抬起头。

安东：“明天你评我的时候，第五栏给我零分。我不需要人照顾。”

（示例·你：“为什么。”）

安东：“因为今天已经有人照顾过我了。一次就够了。”

# CHOICE｜他让你给他零分。你听不听？

#### A｜听。Aftercare 一栏写 0，并在背面写：这是他今天最诚实的一句话

旁白：你写下 0，签名的时候手很稳。
⟦OPT|A|set:gave_anton_zero;bond_anton:6;authority:4;insight:2⟧

#### B｜不听。你给 18，因为他说谎——他需要，只是不敢要

旁白：你写 18，背面写：他把“不需要”说得很熟练，这是练过的。
⟦OPT|B|set:gave_anton_18;bond_anton:7;trust:3;ax_mercy:3⟧

#### C｜把两栏空着，写一行字：明天下午三点，我来听你调琴

旁白：你写完，把卡扣上。
旁白：这是十八天里第一次，你在卡上写了一个“明天”。
⟦OPT|C|set:promised_anton_tomorrow;bond_anton:7;trust:4;ax_mercy:4⟧

# ·

# CHAPTER 12｜The Single Light

# SCENE｜An Empty Theatre

⟦BG|bg_c12s01|A dark empty theatre, eight hundred seats, one work light on the stage, dust in the air⟧
⟦TIME|07:00⟧
⟦BGM|c12s01|a vast empty room, a work light humming, a cable dragged⟧

旁白：剧院空着。八百个座位，一个人都没有。

旁白：台上只有一盏工作灯，很亮，很白，照着一小块地板。

旁白：他扛着一卷线从侧幕出来。

拉维：“你知道演员最怕什么吗。”

（示例·你：“忘词。”）

拉维：“不是。是站在光里，看不见台下。”

旁白：他把线放下，走过来。

拉维：“今天你站上去。我给你打光。”

# SCENE｜The Mark

⟦BG|bg_c12s02|An empty stage, a taped mark on the floor, a woman standing on it, a man at the lighting desk in the house⟧
⟦TIME|10:20⟧
⟦BGM|c12s02|a lighting board clicking, a voice from the house, an empty auditorium⟧

旁白：他在观众席中间架了一张桌子，桌上是一台调光台。

旁白：你站在台上，脚下有一块胶带。

拉维：“先站着。什么都不要做。”

旁白：灯变了。从白光变成暖光，再变成一束很窄的光，只照住你的脸。

旁白：剧院太黑，你看不见他，只听见他的声音从很远的地方传过来。

拉维：“你现在的脸，是三百个人会看见的那张脸。”

（示例·你：“我看不见你。”）

拉维：“对。这就是重点。”

旁白：灯又变了。这次只剩一束，从侧面来，把你的影子拉得很长。

拉维：“现在，你只有一半被看见。另一半在暗里。这一半是你的。”

# SCENE｜Walk Into It

⟦BG|bg_c12s03|An empty stage, a single spotlight on bare boards, a woman walking slowly toward its edge⟧
⟦TIME|14:40⟧
⟦BGM|c12s03|footsteps on hollow stage, a light humming⟧

旁白：他让你做一件事：从暗处走到光里。

旁白：听起来很简单。可你走到离光还有一步的时候，停住了。

旁白：不是因为怕亮。是因为——一旦走进去，就有人在看。

拉维：“停在那儿也行。”

旁白：他没有催。

拉维：“我十九岁第一次进剧院，做实习生。我在侧幕站了三个小时，没敢上台。”

（示例·你：“后来呢。”）

拉维：“后来灯灭了，我什么也看不见，就走上去了。人在黑里不怕，怕的是看见自己要被看见。”

旁白：你走了一步。

旁白：光落在脸上，热的。剧院太黑，你什么都看不见——只有一片黑，和黑里某一个方向，有一个人在看你。

⟦CG|hl_15|A woman stepping into a single spotlight on an empty stage, eight hundred dark seats, dust falling through the beam⟧

# SCENE｜He Comes Into the Light

⟦BG|bg_c12s04|A stage at night, one spotlight, two people standing inside it, the theatre completely dark beyond⟧
⟦TIME|21:10⟧
⟦BGM|c12s04|a light humming, a stage floor, quiet⟧

旁白：晚上他关了调光台，从观众席走上来。

旁白：他站在光的边缘，没有进来。

拉维：“这束光是我打的。我从来没有进去过。”

（示例·你：“为什么。”）

拉维：“因为我怕。打完光的人，不站进去。”

旁白：他抬起脚，跨了一步。

旁白：光落在他身上，他的睫毛被照得很清楚。

拉维：“现在我进来了。”

旁白：他走进光里，站在你面前。这个距离，两个人的影子在身后合成一个。

拉维：“站在光里，看不见台下。”

（示例·你：“我知道。”）

拉维：“但看得见你。”

旁白：他伸手，手指碰你的脸。

拉维：“我打了六年光。我一直在算，光该从哪个角度打在一个人身上，她才最好看。”

（示例·你：“算出来了吗。”）

拉维：“算出来了。不是角度的事。”

（示例·你：“那是什么事。”）

拉维：“是她站在里面的时候，愿不愿意抬头。”

# SCENE｜Behind the Curtain

⟦BG|bg_c12s05|Backstage behind a heavy curtain, one work light, cables on the floor, two people in the narrow space between curtain and wall⟧
⟦TIME|23:40⟧
⟦BGM|c12s05|a curtain moving, cable underfoot, breath in a small space⟧

旁白：他把你带到幕布后面。这里很窄，幕布外面就是八百个空座位。

旁白：从缝里能看见舞台——空的，亮的，一个人都没有。空气里有灰尘和旧幕布的味道。

拉维：“这里是我最喜欢的地方。”

（示例·你：“为什么。”）

拉维：“因为从这里看出去，光是别人的。”

旁白：他把你抵在幕布上。幕布很厚，有灰的味道。已经半硬，却仍只抵着你。

拉维：“现在我要做一件我从来没做过的事。在光的后面。说一句。说了我就动。”

旁白：你说了。他低下头。吻落在颈侧的时候，你听见幕布外面有什么东西响了一下——是风，或者是空座位。他的手在你腰上，很稳。另一只手撑着幕布，让那块布不至于塌下来。手探入，掌心贴着你的皮肤。他停住一次，问：“可以？”你点头。他让你到了一次，自己忍着，额头抵着你的。整个剧院只有一盏工作灯，和一盏红色的安全出口灯。红光落在他的侧脸上。

旁白：你后来想，那一晚最好的一幕，是没有人看见的那一幕。余韵时他说：“打完光的人，不站进去。今天我进来了。”

# SCENE｜The House Lights, 01:50

⟦BG|bg_c12s06|An empty theatre with the house lights on, all eight hundred seats visible, two people sitting in the middle row⟧
⟦TIME|01:50⟧
⟦BGM|c12s06|empty auditorium tone, a seat folding, a distant door⟧

旁白：天亮之前，他把全场灯都打开了。八百个座位，一个不少。

旁白：两个人坐在正中间。

拉维：“你看，空的时候，剧院是最诚实的。”

（示例·你：“为什么。”）

拉维：“因为没有人演。它就是一个房间。”

旁白：他靠在椅背上，仰头看天花板。

拉维：“我最怕的不是黑。是散场。”

（示例·你：“为什么。”）

拉维：“散场之后，灯还亮着，人走光了。那时候我才知道，刚才那些热闹，跟我没关系。”

# CHOICE｜Craft 20。Presence 呢？

#### A｜20。他走进光里的那一步，比任何台词都响

旁白：你写 20。背面写：他怕的不是黑，是散场。
⟦OPT|A|set:scored_ravi_both_20;bond_ravi:6;desire:3⟧

#### B｜16。他给你打光，却不太敢让自己被看见

旁白：你写 16，背面写：他把最好的一切都给了别人。
⟦OPT|B|set:scored_ravi_presence_16;bond_ravi:4;insight:2⟧

#### C｜给他 18，然后在卡背面写：散场之后，我还在

旁白：你写完，把卡合上。你知道这句话会被谁看到。
⟦OPT|C|set:wrote_still_here;bond_ravi:7;trust:4;ax_mercy:3⟧

# ·

# CHAPTER 13｜The Written Word

# SCENE｜A Private Library, Raining

⟦BG|bg_c13s01|A private library with tall shelves, rain on a glass roof, one reading table with a green lamp, a hundred years of dust⟧
⟦TIME|07:00⟧
⟦BGM|c13s01|rain on glass, a page turned, a chair⟧

旁白：他在书架之间走，手指从书脊上滑过去，不抽出来。

旁白：雨打在天窗上，整间屋子像被包在一层水下面。

欧文：“这里有一万两千本书。我看过大概八百本。”

（示例·你：“剩下的呢。”）

欧文：“剩下的在那儿。这就够了。我不需要都看。”

旁白：他停下来，从口袋里拿出一个信封。信封很旧，没有地址，没有邮票。

欧文：“今天我给你念一封信。你不能问是谁写的。”

（示例·你：“如果我问呢。”）

欧文：“那我就编一个。”

# SCENE｜The Letter

⟦BG|bg_c13s02|A library reading table under a green lamp, rain above, a man reading from a single sheet, a woman listening⟧
⟦TIME|10:30⟧
⟦BGM|c13s02|rain, a page, his voice low and unhurried⟧

旁白：他念得很慢。慢到每一个字都落地。

欧文：“『我今天在街上看见一个人，穿了你那件灰大衣。我跟着走了两条街。』”

欧文：“『后来她上了公交车。我站在那儿，觉得自己很可笑。』”

欧文：“『我不打算把这封信寄出去。我写它，是因为有些话不说出来，会在身体里长东西。』”

旁白：他念到这儿，停了一下。

旁白：雨声变大。

欧文：“『如果你读到了这里，那说明我死了，或者我终于不怕了。』”

旁白：他把纸放下。

（示例·你：“是你写的。”）

欧文：“我说了不能问。”

（示例·你：“我没问。我在说。”）

旁白：他抬起头，看着你，很久。

欧文：“……是。”

# SCENE｜Why Not Send It

⟦BG|bg_c13s03|A library aisle between two tall shelves, narrow, a man leaning against a shelf, a woman facing him⟧
⟦TIME|14:20⟧
⟦BGM|c13s03|rain on glass, a book sliding, the shelf creaking⟧

旁白：下午他带你到书架深处。这一排是关于战争的。

旁白：他右手插在口袋里，一直没有拿出来。

（示例·你：“你的手。”）

欧文：“烧伤。零九年，在巴士拉。一辆车。”

旁白：他把手拿出来，摊开。手背上是一片光滑的、没有纹路的皮肤。

欧文：“我那时候是记者。写了六年。”

（示例·你：“后来呢。”）

欧文：“后来我发现，我写的每一篇稿子，都有人在下面死。我写的那句话，会决定谁会去那个路口。”

旁白：他把手收回去，插进兜里。

欧文：“所以我不写了。我改行写诗。”

（示例·你：“为什么是诗。”）

欧文：“因为诗没人照着做。”

旁白：他笑了一下，很轻。

欧文：“那封信，我写了七年。每次写到最后一句就停下。”

（示例·你：“最后一句是什么。”）

欧文：“『你愿意的话，回一个字就行。』”

# SCENE｜Between the Shelves

⟦BG|bg_c13s04|A narrow library aisle, rain above, one green lamp far away, two people very close, books on both sides⟧
⟦TIME|19:50⟧
⟦BGM|c13s04|rain, a spine pressed, breath in a narrow space⟧
⟦CG|hl_16|A narrow library aisle with tall shelves, two people close between books, green lamplight and rain shadows⟧

旁白：晚饭后雨更大了。天窗上像有人在倒水。

旁白：他站在两排书架之间，窄得两个人只能面对面。

欧文：“我今天说了一句谎。”

（示例·你：“哪句。”）

欧文：“我说那封信是七年前写的。”

（示例·你：“其实是。”）

欧文：“上个月。”

旁白：他往前走了一步，书脊抵着你的背。

欧文：“我上个月才写的。因为有人告诉我，我要见一个人。一个会给人打分的人。”

（示例·你：“你觉得我会给你打低分。”）

欧文：“我觉得你会看穿我。”

旁白：他低下头。很近，但没有碰。已经半硬，却仍只站着。空气里有旧书和雨的味道。

欧文：“我用词很准。这是我唯一的本事。所以我现在告诉你——我想吻你，这句话里没有比喻。”

旁白：你说了那两个字。

旁白：他吻得很慢，像在读一行很难的字。读到一半停下来，看你的眼睛，再读下去。他的手一直插在口袋里。一直到很后面，才拿出来。拿出来的时候，你看见那只手在抖——不是受伤的那只，是好的那只。手探入，掌心贴着你的皮肤。他停住一次，问：“可以？”你点头。他让你到了一次，自己忍着，额头抵着你的。

# SCENE｜The Reading Room, Later

⟦BG|bg_c13s05|A library reading room at midnight, one green lamp, rain easing, a man and a woman on the floor between shelves⟧
⟦TIME|23:40⟧
⟦BGM|c13s05|rain fading, a page under a shoulder, breathing⟧

旁白：后来他们从书架之间出来，到了阅览室的地板上。灯还开着。地板上有一本书被压皱了。他后来把书捡起来，抚平，放回去。

旁白：他的手在你腰侧，拇指来回，很轻。他的呼吸在你耳边，热的，节奏不稳。他一直没说话。这个人一天说几千个字，这时候一个都不说。余韵时他把那封信塞给你：“寄出去的信，就不该留在写信的人手里。”

（示例·你：“你怎么不说话。”）

欧文：“我在找词。”

（示例·你：“找到了吗。”）

欧文：“没有。这种时候没有词。有词的都是假的。”

旁白：他低下头，把脸埋在你颈窝里。

旁白：灯很亮。他忽然伸手把灯关了。

欧文：“这样就不用找词了。”

# SCENE｜The Envelope, 01:40

⟦BG|bg_c13s06|A library at two in the morning, rain stopped, a man handing an envelope to a woman at the door⟧
⟦TIME|01:40⟧
⟦BGM|c13s06|water in a gutter, a door, paper⟧

旁白：他把那个信封给你。就是白天念的那封。

欧文：“拿走。”

（示例·你：“为什么。”）

欧文：“因为它已经寄出去了。”

旁白：他把门推开。外面的空气很凉，雨停了。

欧文：“寄出去的信，就不该留在写信的人手里。”

# CHOICE｜他给了你一封七年的信。Devotion 打几分？

#### A｜20。他把最不敢给人的东西给了你

旁白：你写 20。信封放在内袋，贴着那张便签。
⟦OPT|A|set:scored_owen_devotion_20;bond_owen:7;trust:4⟧

#### B｜15。他给了信，但没给“留下”这两个字

旁白：你写 15，背面写：他擅长写，不擅长要。
⟦OPT|B|set:scored_owen_devotion_15;bond_owen:5;insight:2⟧

#### C｜不评分，你在信封背面写了一个字，还给他

旁白：你在信封背面写下那个字——「好」。
旁白：他看了很久，然后把信封又推回给你，一句话没说。
⟦OPT|C|set:answered_the_letter;bond_owen:8;trust:5;desire:3⟧

# ·

# CHAPTER 14｜The Inventory

# SCENE｜A Vault Under the City

⟦BG|bg_c14s01|A private vault under a building, steel walls, cold light, long drawers, a man in shirtsleeves with white gloves⟧
⟦TIME|07:00⟧
⟦BGM|c14s01|a steel drawer rolling out, a pen on paper, cold air⟧

旁白：保险库在地下四层。温度恒定，湿度恒定，连空气都不动。

旁白：他戴着白手套，站在一排抽屉前。

雨果：“这里四百一十二件。每一件都有编号、来源、经手人。”

（示例·你：“我们要清点全部？”）

雨果：“不。我们只清点一件。”

旁白：他拉开第一个抽屉。

雨果：“但我们要从头开始数。数到那一件为止。”

# SCENE｜Counting

⟦BG|bg_c14s02|A steel vault, drawers open in a row, a man counting quietly, a woman writing numbers on a list⟧
⟦TIME|11:20⟧
⟦BGM|c14s02|a pen, drawers, a man's voice counting under his breath⟧

旁白：他数得很慢。每一件都要拿起来，看一眼，放下，报一个数。

旁白：第一个小时，你数到八十七。第二个小时，一百九十六。

旁白：第三个小时，他忽然停下来。

雨果：“你数错了。”

（示例·你：“哪里。”）

雨果：“第一百八十三件。你报了两次。”

旁白：你回头看单子。确实报了两次。

雨果：“人一累，就会重复。这是正常的。但在这里，重复一次，就会漏一件。”

旁白：他把单子拿过去，重新写。

雨果：“所以我们慢。慢不是效率低，慢是不出错。”

# SCENE｜The Ring

⟦BG|bg_c14s03|A steel vault at noon, two people sitting on the floor against a drawer cabinet, a sandwich untouched, cold light⟧
⟦TIME|13:40⟧
⟦BGM|c14s03|a vault hum, paper, a distant lift⟧

旁白：中午在保险库里吃饭。三明治，冷的。他说这里不能有热的东西。

旁白：你注意到他右手那枚戒指。很旧，很细，不像男人的款。

（示例·你：“那枚戒指。”）

雨果：“我母亲的。”

（示例·你：“她还在？”）

雨果：“九九年，在维也纳。九门出过一次事故。她在那儿。”

旁白：他咬了一口三明治，慢慢嚼完。

雨果：“她说那晚有一个女人，从楼上下来，怀里抱着一个盒子。后来那个人不见了。”

旁白：你的手停在半空。

（示例·你：“什么人。”）

雨果：“不知道。她只记得那个人穿灰大衣。”

⟦CG|hl_17|Two people sitting on a vault floor among steel drawers, one man turning an old thin ring on his finger, cold white light⟧

# SCENE｜One Missing

⟦BG|bg_c14s04|A steel vault, one drawer open, an empty velvet slot, a man's white glove hovering over it⟧
⟦TIME|17:10⟧
⟦BGM|c14s04|a drawer, silence, a pen dropping⟧

旁白：第四百一十件之后，他停住了。

旁白：抽屉里有一个空的凹槽。绒布上有一个耳环的形状，压痕还在。

雨果：“零零九九。一对耳环，蓝宝石，一九九九年入库。”

（示例·你：“少了一只？”）

雨果：“少了两只。”

旁白：他把手套摘下来，第一次露出很普通的一双手。

雨果：“这一格，三天前还是满的。”

旁白：他转过身看你。眼睛里没有慌乱，只有一种很冷的清醒。

雨果：“你的十八天里，有人进过这里。”

（示例·你：“谁能进。”）

雨果：“三个人。我，戴斯蒙德，和持有钥匙的人。”

旁白：他顿了顿。

雨果：“钥匙，在你母亲的遗物里。”

# SCENE｜Cold Room

⟦BG|bg_c14s05|A steel vault at night, cold light dimmed, a coat on the floor, two people against the cabinet, breath visible⟧
⟦TIME|22:40⟧
⟦BGM|c14s05|a vault hum, cloth, breath in cold air⟧

旁白：这里很冷。冷到说话有白气。

旁白：他把外套铺在地上，说，坐。然后自己也坐下，肩膀靠着你。

雨果：“我今天不该告诉你那些。”

（示例·你：“为什么。”）

雨果：“因为你现在知道了，就会去查。查的人，会出事。”

旁白：他侧过头。

雨果：“但我不告诉你，你会以为这里安全。”

旁白：他抬手，把你脸侧的一缕头发别到耳后。手指很凉。

雨果：“我这一辈子都在清点。东西、来源、经手人。我从来不清点人。”

（示例·你：“那现在呢。”）

雨果：“现在我在数你。数你的呼吸、你说谎的次数、你看我的时候停多久。”

旁白：他靠过来。这里的空气太冷，两个人的温度一比，就显得很烫。

旁白：他的吻很稳。稳得像他数东西的手。可数到后面就乱了——数字乱了，顺序也乱了。

旁白：钢柜很凉。他把你往自己这边带了一点，让你离开那面柜子。

旁白：你听见两个人在冷空气里呼吸，白气撞在一起，散开，又来。空气里有金属和冷石的味道。已经半硬，却仍只站着。

雨果：“这里不能留痕迹。”

（示例·你：“那怎么办。”）

雨果：“那就什么都别留下。说一句。说了我就动。”

旁白：你说了。他低下头。灯很白，把一切都照得很清楚——清楚到你知道自己以后会常常想起这一幕。他吻得很稳，像在称重。手探入，掌心贴着你的皮肤。他停住一次，问：“可以？”你点头。他让你到了一次，自己忍着，额头抵着你的。保险库里只剩白气和心跳。

旁白：余韵时他说：“我这一辈子都在清点。我从来不清点人。今天我在数你。”

# SCENE｜The Door, 01:30

⟦BG|bg_c14s06|A vault door at half past one, a man holding it open, a woman stepping out, a lift at the end of the corridor⟧
⟦TIME|01:30⟧
⟦BGM|c14s06|a heavy door, a lift arriving, a corridor⟧

旁白：他送你到门口。门很重，他用一只手撑着。

雨果：“那对耳环，我去找。”

（示例·你：“为什么是你。”）

雨果：“因为我母亲见过那个穿灰大衣的人。她一辈子都在等一个解释。”

旁白：他把门放下来，隔着正在合上的缝，说了最后一句。

雨果：“Vera。你母亲穿灰大衣吗。”

# CHOICE｜他给了你一条线头。Insight 怎么加？

#### A｜追下去。你在卡背写：零零九九，继续查

旁白：你写下编号，签名。你知道这张卡会被存档一年。
⟦OPT|A|set:chasing_the_earrings;insight:4;authority:3;bond_hugo:5⟧

#### B｜先不查，问贝尔特：我母亲的遗物里，有没有一把钥匙

旁白：你在车上发了消息。贝尔特十分钟后回：有一把。她一直没说。
⟦OPT|B|set:asked_berthe_about_key;insight:4;trust:3;bond_hugo:4⟧

#### C｜问戴斯蒙德。你要看他怎么回答

旁白：你拨了那个号码。响了三声，他接了。
（示例·你：“零零九九是什么。”）
旁白：电话那头静了四秒。
⟦OPT|C|set:confronted_desmond;insight:3;authority:5;notoriety:4⟧

# ·

# CHAPTER 15｜The Wire

# SCENE｜A Rooftop at Seven

⟦BG|bg_c15s01|A rooftop at dawn, two steel poles, a cable being strung between them, the city below in mist⟧
⟦TIME|07:00⟧
⟦BGM|c15s01|wind at height, a cable tightening, a ratchet⟧

旁白：天台上有两根柱子，中间拉着一根钢索。离地大概七层。

旁白：他蹲在柱子边，正在用绞盘收紧钢索，动作很熟。

马利克：“上来之前，先做一件事。”

（示例·你：“什么。”）

马利克：“往下看。看三十秒。”

旁白：你走到边缘，往下看。街上有人遛狗，车在等红灯，很小。

马利克：“三十秒。”

旁白：三十秒很长。长到你想退。

马利克：“好。现在你可以不看了。今天一整天，你都不用再看。”

旁白：他站起来，拍了拍手上的灰。

马利克：“怕高的人，是先怕了'会掉下去'这件事。看一次，就够了。”

# SCENE｜The Harness

⟦BG|bg_c15s02|A rooftop, a safety harness being fitted, a man kneeling to check a buckle at a woman's thigh⟧
⟦TIME|10:20⟧
⟦BGM|c15s02|a buckle, a ratchet, wind⟧

旁白：他给你穿安全绳。扣子很多，他一个一个检查，每一个都拉一下。

旁白：最后一个扣在你大腿上。他单膝跪着，手停在那儿。

马利克：“这个扣，会勒。走的时候会疼。”

（示例·你：“那怎么办。”）

马利克：“忍着。或者别走。”

旁白：他抬头看你，眼睛不眨。

马利克：“我十六岁进马戏团。第一次上绳，我在上面站了四十分钟没敢动。”

（示例·你：“后来呢。”）

马利克：“后来我师父在下面喊了一句话。”

（示例·你：“什么话。”）

马利克：“他说，你已经在上面了，最坏的事已经发生过了。”

# SCENE｜First Steps

⟦BG|bg_c15s03|A steel cable between two rooftop poles, a woman in a harness taking her first steps, a man walking backward in front of her⟧
⟦TIME|14:40⟧
⟦BGM|c15s03|wind, cable creaking, breath held tight⟧

旁白：钢索很细。踩上去，脚会晃。

旁白：他走在你前面，倒着走，两手张开。

马利克：“看我。看我的眼睛。”

（示例·你：“我怕。”）

马利克：“怕就看我。别看我脚下，别看你脚下。看我。”

旁白：你走了三步。第四步，钢索晃了一下，你抓住他的手。

旁白：他握得很紧。紧到你觉得他不会松。

马利克：“你看，你抓住我了。”

（示例·你：“如果我掉下去呢。”）

马利克：“那我就跟着掉下去。安全绳是两个人的。”

旁白：他说得很平常。像在说一件早就算好的事。

⟦CG|hl_18|A woman in a harness on a thin steel cable between two rooftop poles, a man walking backward holding her hands, city far below⟧

# SCENE｜The Sky

⟦BG|bg_c15s04|A rooftop at dusk, the cable empty, two people sitting on the parapet with their legs inside, sky turning⟧
⟦TIME|18:50⟧
⟦BGM|c15s04|wind dropping, distant traffic, a cable ticking as it cools⟧

旁白：天黑之前，风停了。城市亮起来，一格一格。

旁白：两个人坐在天台边缘，腿在里侧。

马利克：“今天我让你做了三件你不想做的事。”

（示例·你：“往下看、上绳、还有呢。”）

马利克：“还有信我。”

旁白：他侧过头。晚风把他的头发吹到额前。

马利克：“信人这件事，比走绳难。走绳掉下去只有一次，信人错一次能疼很多年。”

（示例·你：“你信过谁。”）

马利克：“我信过一个观众。她说她会在下面接着我。”

旁白：他把袖子拉下来一点，露出手臂上一道旧疤。

马利克：“她没接。”

# SCENE｜The Parapet

⟦BG|bg_c15s05|A rooftop at night, city lights below, two people on the parapet, one jacket over both shoulders⟧
⟦TIME|22:30⟧
⟦BGM|c15s05|city hum, wind, cloth⟧

旁白：夜里风大。他把外套脱下来，罩在两个人肩上。

旁白：这个动作让两个人靠得很近。

马利克：“我一天不抖，是因为我在绳上。”

（示例·你：“现在呢。”）

马利克：“现在我在天台上，绳子在那边。所以我抖。”

旁白：他把手伸出来给你看。真的在抖。很轻，但一直在抖。

（示例·你：“那你为什么还要坐在这儿。”）

马利克：“因为你在这儿。”

旁白：他靠过来。这个位置很危险——后面就是空的，前面是他。

旁白：他的手撑在你身后的矮墙上，把你圈在他和夜之间。

马利克：“说一句。说了我就不抖了。”

旁白：你说了。

旁白：他吻下来的时候，手还在抖。抖得你心里发慌。

旁白：城市的灯在下面，一格一格亮着。风把外套吹开，又被拉回来。

旁白：他忽然停下来，额头抵着你的额头，喘。

马利克：“我做了十年这一行。我从来不在高的地方分心。”

（示例·你：“今天呢。”）

马利克：“今天我在七层楼上面，忘了自己在哪儿。”

# SCENE｜The Cable, 01:20

⟦BG|bg_c15s06|A rooftop at night, a steel cable still strung between poles, a man running a cloth along it, a woman watching⟧
⟦TIME|01:20⟧
⟦BGM|c15s06|cable ticking, a cloth, wind⟧

旁白：他半夜起来，拿一块布，把钢索从头擦到尾。

马利克：“钢索要擦。有灰，会滑。”

旁白：他擦得很认真，一节一节。

马利克：“明天我不在。但这根索我留着。”

（示例·你：“留着做什么。”）

马利克：“留着等。我不拆。”

旁白：他把布叠好，塞进口袋。

马利克：“我这行有个规矩，绳不能空着。空着的绳会记住最后一个走的人。”

# CHOICE｜Devotion 20，那 Aftercare 呢？

#### A｜20。他把安全绳系成了两个人的

旁白：你写 20。背面写：他说“安全绳是两个人的”，这句话我记住了。
⟦OPT|A|set:scored_malik_both_20;bond_malik:7;trust:4;desire:4⟧

#### B｜13。他把自己整个人押上来，可他没问过我要不要押

旁白：你写 13，背面写：危险让人上瘾，这是他的问题，不该变成我的。
⟦OPT|B|set:scored_malik_aftercare_13;bond_malik:5;authority:4;insight:2⟧

#### C｜扣分。你在卡上写：钢索，建议拆除

旁白：你写完，把卡扣上。
旁白：这不是评分，这是命令。第一次，你在卡上下了命令。
⟦OPT|C|set:ordered_cable_removed;authority:5;ax_power:3;bond_malik:4⟧

# ·

# CHAPTER 16｜The Greenhouse

# SCENE｜A Greenhouse at Four in the Morning

⟦BG|bg_c16s01|A vast glass greenhouse before dawn, rows of plants, condensation on every pane, one lamp hanging low, wet gravel underfoot⟧
⟦TIME|04:00⟧
⟦BGM|c16s01|dripping water, a fan, insects, no music⟧

旁白：他把时间定在凌晨四点。贝尔特说，这是十八天里唯一一个不在七点开始的人。

旁白：温室里全是水汽。玻璃上挂着水珠，一颗一颗往下走。

旁白：他蹲在一排花前面，头也不抬。

布拉姆：“你来早了六分钟。”

（示例·你：“这算加分吗。”）

布拉姆：“算。植物喜欢准时的人。”

旁白：他站起来，笑了一下，露出那颗缺了角的门牙。

布拉姆：“这里三千多株。我每天四点来，先看一遍。”

（示例·你：“看得完？”）

布拉姆：“看不完。但她们知道我来过。”

# SCENE｜Pollination

⟦BG|bg_c16s02|Inside a greenhouse, a man showing a woman how to pollinate a flower with a small brush, both hands careful⟧
⟦TIME|06:40⟧
⟦BGM|c16s02|water dripping, a brush on a petal, a fan turning⟧

旁白：他给你一支很细的毛笔。

布拉姆：“这株只开三天。三天里，得有人替它把花粉送过去。不然就白开了。”

（示例·你：“它自己不行？”）

布拉姆：“它自己不行。它太香了，来的虫子都醉了，办不成事。”

旁白：他把花托在你手里，教你怎么刷。动作轻到几乎没有。

布拉姆：“慢一点。你手太重，会伤到柱头。”

旁白：你刷的时候，他一直看着你的手，不看花。

（示例·你：“你看我干什么。”）

布拉姆：“我在看你会不会急。”

（示例·你：“我急了吗。”）

布拉姆：“没有。你很好。”

旁白：他说得很随便。可“你很好”这三个字，在这个湿热的房间里，听起来不像在说花。

# SCENE｜Too Hot

⟦BG|bg_c16s03|Inside a greenhouse at noon, dense heat, mist on glass, a woman with her coat off and sleeves rolled⟧
⟦TIME|12:20⟧
⟦BGM|c16s03|fans, water dripping, a hose being coiled⟧

旁白：中午温室里三十五度，湿度九十。你的衣服贴在身上。

旁白：他把水管递给你，说，浇这一排。

旁白：浇到一半，他忽然伸手，把你脸侧的一缕湿头发拨开。

布拉姆：“你出汗了。”

（示例·你：“这里太热。”）

布拉姆：“嗯。这里一年有八个月是这样。”

旁白：他的手没有收回去。指背贴在你太阳穴上，停着。

布拉姆：“我在这里工作九年。九年里，我抱过很多植物。有些一抱就死，有些能活很久。”

（示例·你：“怎么分。”）

布拉姆：“看它让不让人碰。”

⟦CG|hl_19|A man's hand brushing wet hair from a woman's face inside a hot greenhouse, mist on glass, green filtered light⟧

# SCENE｜Smell This

⟦BG|bg_c16s04|A greenhouse at dusk, one lamp, a single white flower open, a man holding it up to a woman's face⟧
⟦TIME|18:40⟧
⟦BGM|c16s04|dripping water, a fan slowing, evening insects⟧

旁白：傍晚，一株白色的花开到最盛。他把整盆端过来。

布拉姆：“这个，闻一下。”

旁白：你低头。香味很重，重到有点晕。

旁白：你抬起头，才发现他离得很近。

布拉姆：“这花叫'夜夫人'。只在晚上香。白天一点味道都没有。”

（示例·你：“为什么。”）

布拉姆：“因为它白天要省着。晚上的力气，全用来香。”

旁白：他把花放在旁边的台子上。

布拉姆：“我种了六年，才种活一株。”

（示例·你：“那这株，你打算怎么办。”）

布拉姆：“今天开完就谢了。明天早上，我会把它剪掉。”

（示例·你：“为什么剪。”）

布拉姆：“因为它已经把最贵的部分用完了。留在那儿，只会看着它枯。”

# SCENE｜The Glass Room

⟦BG|bg_c16s05|A greenhouse at night, glass walls streaming with condensation, one lamp, plants in rows, two people among them⟧
⟦TIME|23:10⟧
⟦BGM|c16s05|dripping, breathing, a fan⟧

旁白：夜里温室更热。玻璃全是雾，外面的城市什么都看不见。

旁白：他把你抵在花架边上。花架是铁的，凉的，可房间里没有一样东西是凉的。

布拉姆：“我今天一直在想一件事。”

（示例·你：“什么。”）

布拉姆：“你今天碰过的每一株，都是我给别人的。”

旁白：他低头，额头抵着你的额头。他身上有土的味道，有水的味道。

布拉姆：“我这一行，最好的东西都卖出去。留不住。”

（示例·你：“那你想留什么。”）

布拉姆：“这个。”

旁白：他吻下来的时候，那股湿热的空气整个裹了上来。玻璃上的水珠在往下走，一颗，又一颗。

旁白：他的手在你后背，掌心很热。你听见自己的呼吸在这个密闭的玻璃房间里被放大。

旁白：花架晃了一下。有土掉下来。

旁白：他忽然笑，笑在你嘴角上。

布拉姆：“轻一点。下面那排是幼苗。”

旁白：你也笑了。这个笑让整个晚上变得不一样——不那么紧张，更近。

旁白：外面开始下雨。雨落在玻璃顶上，声音像有人在上面走。

# SCENE｜Cut It, 01:50

⟦BG|bg_c16s06|A greenhouse before dawn, one lamp, a man holding scissors over a white flower, a woman watching⟧
⟦TIME|01:50⟧
⟦BGM|c16s06|scissors, dripping water, dawn birds outside⟧

旁白：天快亮的时候，他拿着剪刀站在那株花前面。

旁白：花已经有点蔫了。

布拉姆：“我昨天说的话，是骗你的。”

（示例·你：“哪句。”）

布拉姆：“我说它开完就剪，因为它把最贵的部分用完了。”

旁白：他把剪刀放下。

布拉姆：“其实我舍不得。六年才活一株。我一句都舍不得。”

旁白：他转过身看你。

布拉姆：“我今天跟你说了一整天的话，只有这一句是真的。”

# CHOICE｜Aftercare 这一栏，你给多少？

#### A｜20。他用六年种一株花，只为了让人闻一分钟

旁白：你写 20。背面写：舍不得剪的人，才做得了这一行。
⟦OPT|A|set:scored_bram_both_20;bond_bram:7;desire:3;trust:3⟧

#### B｜16。他给的太多，收的太少

旁白：你写 16，背面写：他把自己种在温室里，等一个不会来的人。
⟦OPT|B|set:scored_bram_16;bond_bram:5;insight:2⟧

#### C｜不写分。你在卡上写：那株花，别剪

旁白：你写完，把卡递出去。这是你第一次，替别人做决定。
⟦OPT|C|set:told_him_not_to_cut;bond_bram:8;authority:3;ax_mercy:4⟧

# ·

# CHAPTER 17｜The Ice

# SCENE｜An Ice Rink at Five in the Morning

⟦BG|bg_c17s01|An empty ice rink before dawn, one lamp row on, ice fog above the surface, breath visible, boards and glass⟧
⟦TIME|05:00⟧
⟦BGM|c17s01|a refrigeration unit, skates on ice, an echo in a cold hall⟧

旁白：他把时间定在五点。冰场刚浇过冰，平的，新的，一道痕都没有。

旁白：零下五度。你呼出的气是白的。

旁白：他坐在看台上系鞋带，头也不抬。

亨里克：“系紧。冰上脚一松，人就没了。”

（示例·你：“我不会滑。”）

亨里克：“我知道。所以我在这儿。”

旁白：他站起来，走到冰上，一点声音都没有。滑了半圈，回来，伸手。

亨里克：“把手给我。”

# SCENE｜Two Feet

⟦BG|bg_c17s02|An empty ice rink, a man holding a woman's hands, teaching her to stand, ice fog around their ankles⟧
⟦TIME|07:40⟧
⟦BGM|c17s02|skates on ice, breath, a cold hall echo⟧

旁白：冰上站着和地上站着不一样。冰会动。

旁白：你抓着他的手，抓得很紧。他不催，也不松。

亨里克：“膝盖弯。别锁死。”

（示例·你：“我怕摔。”）

亨里克：“摔了不疼。冰是软的？不，冰很硬。但你摔的时候会往前滑，滑出去就不疼了。”

旁白：你笑了。这个笑话很冷，但有用。

旁白：走了十几步，你忽然发现——他没有拉你，是你自己在走。

（示例·你：“你松手了。”）

亨里克：“嗯。”

（示例·你：“什么时候松的。”）

亨里克：“第五步。”

# SCENE｜Lift

⟦BG|bg_c17s03|An ice rink at noon, a man lifting a woman off the ice, both in coats, ice fog⟧
⟦TIME|11:50⟧
⟦BGM|c17s03|skates, a lift, breath, echo⟧

旁白：中午他教你一个动作。很简单：他托住你的腰，把你提起来，转半圈。

旁白：第一次，你笑得停不下来。第二次，你没笑。

旁白：他托着你的时候，你的脸在他肩上方。冰场的灯很白，照得他耳廓发红。

旁白：他放下你，手没有离开腰。

亨里克：“你轻。”

（示例·你：“这是评语吗。”）

亨里克：“是事实。”

旁白：他看着你，眼睛很浅，像冻住的湖。

亨里克：“我教了十六年。托过很多人的腰。”

（示例·你：“她们轻吗。”）

亨里克：“我不记得。”

# SCENE｜Cold Hands

⟦BG|bg_c17s04|Rink-side bench, coats, a thermos, a man holding a woman's hands in his and blowing on them⟧
⟦TIME|15:30⟧
⟦BGM|c17s04|a thermos, wind at the door, distant refrigeration⟧

旁白：休息的时候，你的手冻得发红。他把你的手拉过去，握在掌心里，然后低头吹气。

旁白：他的气息很热。热得手背发麻。

（示例·你：“你的手不冷。”）

亨里克：“我的手一直冷。冰上待久了，血都往回缩。”

旁白：他把你的手翻过来，看你掌心。

亨里克：“你手心有汗。”

（示例·你：“这么冷还出汗。”）

亨里克：“紧张。紧张的时候，手心出汗，手还是凉的。这两个一起出现，说明你在硬撑。”

旁白：他抬起头。

亨里克：“从早上到现在，你一直在硬撑。”

⟦CG|hl_20|A man holding a woman's red hands in his at a rink-side bench, blowing on them, ice fog and white light behind⟧

# SCENE｜The Ice, Alone

⟦BG|bg_c17s05|An ice rink at night, lights dimmed to two rows, two people standing in the middle of the ice, no boards in view⟧
⟦TIME|22:20⟧
⟦BGM|c17s05|skates, a refrigeration hum, breath⟧

旁白：晚上他关了大部分的灯。冰面上只剩下两排。

旁白：冰在暗处是灰蓝色的。

旁白：他滑到你面前，停下来，冰刀刮出一道弧。

亨里克：“我今天做了一件事，很不专业。”

（示例·你：“什么。”）

亨里克：“我在数你摔了几次。”

（示例·你：“几次。”）

亨里克：“零次。你一次都没摔。”

旁白：他伸手，扶住你的后颈。手是凉的，凉得你一激灵。

亨里克：“我教了十六年，没有一个学生一次都不摔。”

（示例·你：“那说明什么。”）

亨里克：“说明你怕。怕到不敢真的把重量交出去。”

旁白：他的手往下，落在你腰上。

亨里克：“现在交给我。”

旁白：你把重量交出去了。整个人靠过去，冰刀在脚下打了个滑，他稳住。

旁白：冰场很冷。他身上也很冷。可两个人的呼吸撞在一起，就有了一点热。

旁白：他的吻很慢。慢得像在冰上滑行，不敢用力。

旁白：你听见冰刀刮过冰面的声音，很短，很轻。

旁白：冰在脚下滑。你不怕了。

# SCENE｜Off the Ice

⟦BG|bg_c17s06|A locker corridor beside an ice rink, concrete, one bench, coats hung, cold air from the rink door⟧
⟦TIME|00:40⟧
⟦BGM|c17s06|refrigeration, a door, cloth, breathing⟧

旁白：从冰上下来，走廊里更冷。冷得人发抖。

旁白：他把外套脱下来给你，自己只剩一件薄毛衣。

旁白：他的手还是凉的。可放在你脸上的时候，你不觉得凉。

亨里克：“我二十岁那年，在冰上摔断过一条腿。医生说不能再滑。”

（示例·你：“那你怎么还在这儿。”）

亨里克：“因为我发现，我在冰上才敢抱人。地上不敢。”

旁白：他低下头，额头抵着你的额头。

亨里克：“地上太稳了。稳的地方，人就会想太多。”

# CHOICE｜Devotion 一栏，你怎么写？

#### A｜20。他把唯一的软处给了你

旁白：你写 20，理由只有一句：他在冰上才敢抱人，可他在冰下等了一整天。
⟦OPT|A|set:scored_henrik_both_20;bond_henrik:7;trust:4;desire:3⟧

#### B｜17。他教得好，可他一直在当教练，没当男人

旁白：你写 17，背面写：他把我当成学生，学生是要毕业的。
⟦OPT|B|set:scored_henrik_17;bond_henrik:5;insight:2⟧

#### C｜不写分。你问他：明天早上五点，冰场还开吗

旁白：他愣了很久。
亨里克：“开。我天天在。”
⟦OPT|C|set:asked_about_five_am;bond_henrik:8;trust:5;ax_mercy:3⟧

# ·

# CHAPTER 18｜The Interrogation

# SCENE｜A Room With Two Chairs

⟦BG|bg_c18s01|A bare room with two wooden chairs facing each other, one window with the blind down, no table, no lamp, gray light⟧
⟦TIME|07:00⟧
⟦BGM|c18s01|a room with nothing in it, a chair leg on stone, a blind tap⟧

旁白：最后一天。房间里只有两把椅子，面对面，中间什么都没有。

旁白：他坐着，手放在膝上，没有站起来。

康斯坦丁：“请坐。”

旁白：你坐下。两个人的膝盖之间隔着一臂。

康斯坦丁：“今天我不服务你。”

（示例·你：“那今天做什么。”）

康斯坦丁：“问话。”

旁白：他抬起眼睛。这一双眼睛，是十八个人里唯一一个不打算让你舒服的。

康斯坦丁：“十八天，你给十七个人打了分。现在轮到有人给你打。”

# SCENE｜Three Languages

⟦BG|bg_c18s02|A bare room, two chairs, a man leaning forward slightly, a woman not leaning back⟧
⟦TIME|09:20⟧
⟦BGM|c18s02|a blind tapping, a chair, silence used as a tool⟧

旁白：他换了三种语言问你同一个问题。

旁白：第一遍，英语。第二遍，法语。第三遍，俄语。

康斯坦丁：“你母亲一九九九年，在维也纳做什么。”

旁白：你没有回答。

康斯坦丁：“你听懂了第三种。”

（示例·你：“我母亲是钢琴调音师。”）

康斯坦丁：“我知道。我问的是，她在维也纳做什么。”

旁白：他往前倾了一点。就一点。

康斯坦丁：“那天晚上九门出过一次事故。一个客人从三楼掉下来，死了。官方记录是意外。”

旁白：他停了一下，让你消化。

康斯坦丁：“你母亲当时在楼里。第二天她离开了维也纳，再也没有回去。”

⟦CG|hl_21|Two wooden chairs facing each other in a bare room with a drawn blind, a man leaning forward, a woman not moving⟧

# SCENE｜The File

⟦BG|bg_c18s03|A bare room, a folder on the floor between two chairs, a man's hand pushing it across the stone⟧
⟦TIME|12:40⟧
⟦BGM|c18s03|paper on stone, a blind, a held silence⟧

旁白：他从大衣内袋里拿出一个文件夹，放在两把椅子之间的地上。

康斯坦丁：“你可以不看。但你已经知道里面有东西了。”

旁白：你捡起来。纸很脆，边角发黄。

旁白：第一页是一份名单。第三行写着：**Kessler, M. — piano tuner, not a guest.**

旁白：第四行：**Witness — declined.**

旁白：第三页是一张收据。付款人：Odile Voss。收款人：一个律师事务所。日期：2000 年 3 月。

旁白：你把纸放下。

康斯坦丁：“她压下了记录。她也养了你二十六年。”

（示例·你：“她为什么选我。”）

康斯坦丁：“因为她要还债。而她这个人，还债的方式是给你一件更大的东西，让你忙到没时间问。”

# SCENE｜What Desmond Wants

⟦BG|bg_c18s04|A bare room, afternoon light through the blind, two chairs, a woman standing now, a man still seated⟧
⟦TIME|16:10⟧
⟦BGM|c18s04|a blind, footsteps, a chair⟧

旁白：你站起来。他没有。

康斯坦丁：“坐下。”

（示例·你：“我不坐。你告诉我，戴斯蒙德给你什么。”）

旁白：他看了你三秒。然后笑了一下，很淡。

康斯坦丁：“他给我一间门。里斯本那间，归我。”

（示例·你：“条件。”）

康斯坦丁：“让你在第十九天，写不出 S++。”

旁白：房间里安静下来。

康斯坦丁：“如果十八个人没有一个够 S++，评级作废，产业归他。这是遗嘱第七条。”

（示例·你：“那你为什么现在告诉我。”）

旁白：他站起来。这是他今天第一次站起来。

康斯坦丁：“因为我看了十八天。”

（示例·你：“你看什么。”）

康斯坦丁：“我看你给谁打了高分。我看你什么时候在卡上写了一个'明天'。”

# SCENE｜Reverse

⟦BG|bg_c18s05|A bare room, two people standing, chairs behind them, the blind drawn, gray light⟧
⟦TIME|19:40⟧
⟦BGM|c18s05|almost nothing, a chair, one step⟧

旁白：你走到他面前。近到两个人的鞋尖碰到。

（示例·你：“现在换我问。”）

康斯坦丁：“问。”

（示例·你：“一九九九年那天晚上，穿灰大衣的人，是你吗。”）

旁白：他没有立刻回答。他看了你很久。

康斯坦丁：“不是。”

（示例·你：“那是谁。”）

康斯坦丁：“你母亲。她抱着一个盒子下楼。”

旁白：他顿了顿。

康斯坦丁：“盒子里是那盘带子。你母亲录了十年，每年一段，给你的。”

旁白：你的手在发抖。你把它们插进大衣口袋里。

（示例·你：“带子在哪儿。”）

康斯坦丁：“零零九九。保险库。三天前被人取走了。”

# SCENE｜The Last Chair

⟦BG|bg_c18s06|A bare room at night, the blind up, city light, two chairs, two people sitting close, not facing each other⟧
⟦TIME|23:20⟧
⟦BGM|c18s06|city below, a chair, breathing that has slowed⟧

旁白：天黑了。他把百叶窗拉上去。城市的灯进来，落在地上一格一格。

旁白：两个人坐在椅子上，肩并着肩，看着窗。

康斯坦丁：“十八天，你睡过几个小时。”

（示例·你：“不多。”）

康斯坦丁：“我四十二岁。我这辈子听过太多人说话。说谎的人有一个共同点。”

（示例·你：“什么。”）

康斯坦丁：“他们说得很流利。”

旁白：他侧过头。

康斯坦丁：“你说话经常停。停的时候，你在挑词。挑词的人，不说谎。”

（示例·你：“所以你打算给我打多少分。”）

康斯坦丁：“我不给你打分。”

旁白：他抬手，把落在你肩上的一点灰拂掉。手停在那儿。

康斯坦丁：“我今天问了你十四个问题。你回答了九个，回避了五个。”

（示例·你：“哪五个。”）

康斯坦丁：“不重要。重要的是——五个里，有四个是关于你自己的。”

旁白：他靠过来。

康斯坦丁：“你什么都肯说，除了你自己。”

旁白：他的手落在你后颈上。手心很暖，和这间冷房间完全不配。

康斯坦丁：“最后一天。你可以什么都不做。我不会强求，也不会计分。”

旁白：你说了那两个字。

旁白：他吻得很慢，像是在确认一件事——这个人是不是真的在这里。

旁白：椅子腿在石地上刮了一下。百叶窗没有拉下来，城市的灯一直亮着。

旁白：他停下来一次，看着你。

康斯坦丁：“我今年四十二。我这辈子只做过一次错事。”

（示例·你：“什么事。”）

康斯坦丁：“今天早上我本来打算，让你失败。”

# SCENE｜The Long Table, Day Nineteen

⟦BG|bg_c18s07|The long black table again, morning, eighteen cards stacked in one pile, a man standing at the far end, a woman at the head⟧
⟦TIME|09:00⟧
⟦BGM|c18s07|a room of people holding their breath, paper, a pen⟧

旁白：第十九天。同一间没有窗的房间，同一张长桌。

旁白：十八个人站在桌子两边。贝尔特站在门口。

戴斯蒙德：“写吧。写一个名字。”

旁白：桌上只有一张卡，空白。

戴斯蒙德：“顺便提醒你，遗嘱第七条：如果你写不出，产业归我。这不是威胁，这是程序。”

旁白：你把笔拿起来。

旁白：十八个人都在看你。有的人在等你写他，有的人在等你写别人，有的人只是站着。

旁白：你写下了一个词。然后你抬起头。

⟦CG|hl_22|Eighteen men standing along a long black table, a woman at the head with a pen, one blank card in front of her⟧

# CHOICE｜第十九天，你在卡上写下什么？

#### A｜写一个名字。你真的选出了唯一的 S++

旁白：你写下了那个名字，签了名，把卡推出去。
旁白：房间里有人深吸了一口气。
⟦OPT|A|set:named_the_s_plus_plus;set:route_s_plus_plus;authority:5;ax_power:2;bond_kon:3⟧

#### B｜写一行字：S++ 这个等级，从今天起取消

旁白：你写的是：**Abolished.**
旁白：戴斯蒙德的脸在两秒内变了三次颜色。
⟦OPT|B|set:abolished_the_grade;set:route_the_house;authority:8;ax_power:5;insight:2⟧

#### C｜写一个日期：一九九九年十一月。然后要求开保险库

旁白：你写完，把笔放下。
（示例·你：“在评级之前，先开零零九九。”）
⟦OPT|C|set:demanded_the_vault;set:route_the_door;insight:5;authority:6;notoriety:5⟧

# ·

# SCENE｜END A · THE SECOND PLUS

⟦BG|bg_c18s08|A long black table in a windowless room, one man stepping forward from a line of eighteen, a card being handed over⟧
⟦TIME|09:40⟧
⟦BGM|c18_end_a|a room exhaling, one pair of footsteps⟧
⟦IF|route_s_plus_plus⟧

旁白：—— END A · THE SECOND PLUS

旁白：你把卡交给他。他接过去，没有看。

旁白：他说，这个等级我不要。

旁白：你问他要什么。

旁白：他说，要你明天早上七点，还在门口。

旁白：第二天早上七点，你到了。他在门口站着。

旁白：他没有打分，也没有被打分。他只是把手伸过来。

旁白：九门后来还有 S++。但那一年的那一个，没有写进任何档案。

⟦/IF⟧

# SCENE｜END B · THE HOUSE

⟦BG|bg_c18s09|A long table with eighteen men and one woman standing, a card on the table reading one word, a man in a suit walking out⟧
⟦TIME|10:20⟧
⟦BGM|c18_end_b|paper, a door, footsteps leaving⟧
⟦IF|route_the_house⟧

旁白：—— END B · THE HOUSE

旁白：戴斯蒙德走了。走之前他说了一句：你会后悔。

旁白：你没有后悔。你把十八个人留下来，重新写了九门的章程。

旁白：第一条改了：不再有等级。

旁白：第二条加了：任何人可以说不，不计代价。

旁白：贝尔特在门口站着，看了很久。

旁白：她说，她等这一条，等了二十六年。

⟦/IF⟧

# SCENE｜END C · THE DOOR

⟦BG|bg_c18s10|A vault door open, a cardboard box on a steel table, a reel of tape, one man standing beside a woman⟧
⟦TIME|11:30⟧
⟦BGM|c18_end_c|a vault hum, tape winding, a blind breathing⟧
⟦IF|route_the_door⟧

旁白：—— END C · THE DOOR

旁白：保险库打开了。零零九九的盒子里，只剩一盘带子。

旁白：你在机器上放了它。第一段是一个女人的声音，很轻，像怕吵到人。

旁白：「Vera，今年你七岁。妈妈在维也纳，这里有一间很漂亮的房子，但是不能拍照。」

旁白：你听了十段。最后一段录到一半，断了。

旁白：康斯坦丁站在旁边，一句话没说。

旁白：后来你们把 1999 年的档案交给了三个人：一个记者，一个律师，一个死者的女儿。

旁白：九门关了六个月。再开门的时候，门口多了一块牌子。

旁白：牌子上只有一行字：**No one here owes anyone a night.**

旁白：（全剧终）
⟦/IF⟧
