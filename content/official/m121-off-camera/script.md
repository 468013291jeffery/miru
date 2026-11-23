# CHAPTER 1｜关机以后
⟦ORIENT|bg⟧
⟦CHAR|你|f|28|f2|成年女性选手，第一人称|外貌由玩家决定，画面里不出现固定的脸|You⟧
⟦CHAR|塞巴斯蒂安|m|33|m3|投资人，成年，可恋爱|Sebastian Vale，成年|Sebastian Vale⟧
⟦CHAR|莱恩|m|29|m1|冰球运动员，成年，可恋爱|Ryan Cole，成年|Ryan Cole⟧
⟦CHAR|朱利安|m|31|m2|演员，成年，可恋爱|Julian Cross，成年|Julian Cross⟧
⟦CHAR|卢卡|m|30|m4|主厨，成年，可恋爱|Luca Moretti，成年|Luca Moretti⟧
⟦CHAR|娜奥米|f|38|f1|节目制片人，成年|Naomi Chen，成年|Naomi Chen⟧
⟦CHAR|奎因|f|27|f2|助理剪辑，成年|Quinn Hart，成年|Quinn Hart⟧
⟦CHAR|艾达|f|41|f3|选手律师，成年|Ada Brooks，成年|Ada Brooks⟧
⟦CHAR|迈尔斯|m|48|m5|赞助商高管，成年|Miles Voss，成年|Miles Voss⟧
⟦SET|native_v2,m121_scene~C01_S01⟧

# SCENE｜合同最后一页
⟦BG|BG_C01_S01|合同最后一页⟧
⟦TIME|第1天⟧
⟦BGM|BGM_M121_C01|本章⟧
⟦SET|m121_scene~C01_S01⟧
旁白：你站在别墅入口，Naomi把最后一页协议翻到“OFF AIR”段落，Sebastian顺手替你挡开摄影机轨道，却没有替你签字。
娜奥米：“We film dates. Not your private decisions.”
塞巴斯蒂安：“Read the last page first.”
娜奥米：“You get to ask before you sign.”
塞巴斯蒂安：“No one rushes you.”
# CHOICE｜你想先问收音范围，还是让摄制组先退后？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C01_S01_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C01_S01_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C01_S01_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C01_S01_OTHER⟧
# ·

# SCENE｜泳池边的第一眼
⟦BG|BG_C01_S02|泳池边的第一眼⟧
⟦TIME|第1天⟧
⟦BGM|BGM_M121_C01|本章⟧
⟦SET|m121_scene~C01_S02⟧
旁白：Ryan把掉进水里的姓名卡捞起来，Julian在遮阳伞下开玩笑，Luca递来干毛巾，Sebastian让出唯一的干座位。
莱恩：“Your first impression can change.”
朱利安：“I would like a second take.”
卢卡：“Here. You look cold.”
塞巴斯蒂安：“Choose your own seat.”
⟦MG|g_M121_C01_MG01|四人的小动作⟧
# CHOICE｜你愿意和谁先聊，还是想先观察四个人？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C01_S02_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C01_S02_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C01_S02_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C01_S02_OTHER⟧
# ·

# SCENE｜还亮着的红灯
⟦BG|BG_C01_S03|还亮着的红灯⟧
⟦TIME|第1天⟧
⟦BGM|BGM_M121_C01|本章⟧
⟦SET|m121_scene~C01_S03⟧
旁白：控制走廊里的接收机在“CUT”后仍有一枚红灯闪烁；Ryan先停住你的脚步，Quinn拉出设备登记册让你核对频道。
奎因：“That light should be safety-only.”
莱恩：“Let's not guess.”
娜奥米：“I'll show you the log.”
奎因：“Don't touch the receiver yet.”
⟦MG|g_M121_C01_MG02|收音频道核对⟧
# CHOICE｜你要看通道编号，还是请Naomi解释？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C01_S03_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C01_S03_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C01_S03_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C01_S03_OTHER⟧
# ·

# SCENE｜关机后的第一句
⟦BG|BG_C01_S04|关机后的第一句⟧
⟦TIME|第1天⟧
⟦BGM|BGM_M121_C01|本章⟧
⟦SET|m121_scene~C01_S04⟧
旁白：Naomi说“Cameras off”后转身离开，Sebastian摘下自己的领夹麦并放回收纳盘，Ryan靠近却停在安全距离。
娜奥米：“Cameras off. Good night.”
塞巴斯蒂安：“May I kiss you?”
莱恩：“She promised me a dance.”
塞巴斯蒂安：“Only if she wants to.”
塞巴斯蒂安：“You get the final word.”
莱恩：“And I can wait.”
# CHOICE｜你想回应亲吻邀请、谈跳舞，还是先把今晚留给自己？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C01_S04_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C01_S04_ENGAGE⟧
#### C｜我明确同意
旁白：先征询并给等待节拍，然后加载被允许动作的CG；若拒绝则加载保持距离版本
⟦OPT|C|set:m121_i_C01_S04_CONSENT⟧
#### D｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|D|set:m121_i_C01_S04_BOUNDARY⟧
#### E｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|E|set:m121_i_C01_S04_OTHER⟧
# ·

# CHAPTER 2｜海水、心跳与醋意
⟦GOAL|在两场约会中确认自己的节奏|SALTWATER JEALOUSY⟧

# SCENE｜水面上的倒影
⟦BG|BG_C02_S01|水面上的倒影⟧
⟦TIME|第2天⟧
⟦BGM|BGM_M121_C02|本章⟧
⟦SET|m121_scene~C02_S01⟧
旁白：日出后Ryan在沙滩上调节护膝，邀请你一起走过涨潮线；他坦白训练后会疼，却不需要别人可怜。
莱恩：“My knee is not a headline.”
莱恩：“We can take the slow path.”
莱恩：“You don't have to fix anything.”
莱恩：“I just wanted your company.”
# CHOICE｜你愿意陪他慢走，还是询问他为什么来节目？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C02_S01_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C02_S01_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C02_S01_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C02_S01_OTHER⟧
# ·

# SCENE｜一次没有胜负的赛艇
⟦BG|BG_C02_S02|一次没有胜负的赛艇⟧
⟦TIME|第2天⟧
⟦BGM|BGM_M121_C02|本章⟧
⟦SET|m121_scene~C02_S02⟧
旁白：Ryan把桨递给你示范如何转向，Sebastian在码头固定松动的系绳，两个人原本的较劲被你的安全提醒打断。
莱恩：“Your pace, not mine.”
塞巴斯蒂安：“The rope is loose. Hold on.”
莱恩：“Okay. No race.”
塞巴斯蒂安：“Agreed. Your call.”
莱恩：“I like when you tell me what you want.”
莱恩：“Even if it is just dry land.”
⟦MG|g_M121_C02_MG01|海上路线⟧
# CHOICE｜你要试划、请他们合作，还是结束这项活动？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C02_S02_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C02_S02_ENGAGE⟧
#### C｜我明确同意
旁白：先征询并给等待节拍，然后加载被允许动作的CG；若拒绝则加载保持距离版本
⟦OPT|C|set:m121_i_C02_S02_CONSENT⟧
#### D｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|D|set:m121_i_C02_S02_BOUNDARY⟧
#### E｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|E|set:m121_i_C02_S02_OTHER⟧
# ·
# CHOICE｜莱恩在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C02_H_RYA_CONSENT_FULL⟧
⟦IF|m121_enter_C02_H_RYA⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：夜里的潟湖亮着淡蓝的荧光，每划一下水，指尖就拖出一道星。Ryan穿着海军蓝的泳裤站在齐腰深的水里，肩膀被月光勾出一圈亮边，护膝早就摘了扔在沙滩上的毛巾旁。“Doc says swimming's good for the knee,” 他一本正经，“so technically this is rehab.”。
旁白：你若泼他水，他会大笑着潜下去从你身后冒出来；你若圈住他的脖子，他会愣一下，然后呼吸明显乱了。“Okay. Okay, I was not ready for that.” 他的手停在你腰侧，隔着湿滑的皮肤，烫得不像在海水里。只有你说“吻我”或先吻他，他才吻你。
旁白：他的吻带着海盐和笑意，开始轻得像试探，后来他把你托起来——毫不费力，运动员的手臂稳得像栏杆——你的腿在水下缠住他的腰，他闷哼一声，吻得又深又急，荧光在你们身边一圈圈炸开。
旁白：“Wait— wait.” 他额头抵着你，喘着气笑，“If I keep going I'm gonna forget we're on a show island and there are, like, drones.” 他转头确认岸上没有任何设备，才又亲了你一下，很轻，像盖章。
莱恩：“Technically this is rehab.”
莱恩：“Hands?”
莱恩：“Okay. I was not ready for that.”
莱恩：“Wait— there are, like, drones.”
莱恩：“Your stroke is terrible, by the way.”
⟦CG|CG_M121_022|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C02_H_RYA_CONSENT_SLOW⟧
⟦IF|m121_enter_C02_H_RYA⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_RYA|他停下了⟧
⟦OPT|C|set:m121_i_C02_H_RYA_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C02_H_RYA⟧
# ·

# SCENE｜赞助商要的镜头
⟦BG|BG_C02_S03|赞助商要的镜头⟧
⟦TIME|第2天⟧
⟦BGM|BGM_M121_C02|本章⟧
⟦SET|m121_scene~C02_S03⟧
旁白：Ryan发现新补充的赞助条款把他的康复训练和你们的私人约会混在一起，Naomi拿笔等他确认。
莱恩：“That's my rehab, not a kiss scene.”
娜奥米：“We can separate the release.”
莱恩：“I need it in writing.”
娜奥米：“You'll have it.”
⟦MG|g_M121_C02_MG02|赞助授权拆分⟧
# CHOICE｜你想帮他标记条款，还是给他空间自己处理？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C02_S03_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C02_S03_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C02_S03_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C02_S03_OTHER⟧
# ·

# SCENE｜不想让别人替你挑人
⟦BG|BG_C02_S04|不想让别人替你挑人⟧
⟦TIME|第2天⟧
⟦BGM|BGM_M121_C02|本章⟧
⟦SET|m121_scene~C02_S04⟧
旁白：正式晚餐中，节目组把Sebastian和Ryan安排在你左右两侧；你主动挪走标有“Winner”的座位牌。
塞巴斯蒂安：“I dislike how much I care.”
莱恩：“Then let her decide.”
塞巴斯蒂安：“You're right.”
莱恩：“We can start over.”
塞巴斯蒂安：“I was jealous. I will not make that your problem.”
# CHOICE｜你想和谁单独说话，还是先把竞争规则说清？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C02_S04_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C02_S04_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C02_S04_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C02_S04_OTHER⟧
# ·
# CHOICE｜塞巴斯蒂安在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C02_H_SEB_CONSENT_FULL⟧
⟦IF|m121_enter_C02_H_SEB⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：晚宴散场，雨刚停。你走上顶层阳台，Sebastian跟出来，却停在玻璃门边，没有关门——门开着，是留给你的退路。他今晚输了那张“Winner”座位牌，脸上却没有输的表情，只有一种被打乱节奏后压不住的专注。只有你明确说“吻我”或主动靠近、碰他的领带，他才动。他的第一个吻是克制的，像在确认答案——然后你回吻，他就不再克制了。
旁白：他一只手托住你的后颈，另一只手停在你腰侧，隔着薄薄的晚礼裙，掌心热得发烫。他把你轻轻抵在被雨打湿的玻璃墙上，冰凉的玻璃贴着你裸露的背，前面是他滚烫的胸膛。你拽住他松开的丝质领带，把他拉低。他在你唇边低声笑了一下，那是你第一次听见他笑。
旁白：“Careful. I've been very polite all night.” 你解开他第三粒扣子、第四粒，指尖碰到他胸口的皮肤，他整个人顿住，呼吸变重，额头抵住你的额头。如果你说“继续”，他的吻沿着下颌滑到颈侧，牙齿极轻地擦过你肩上的细带，把它从肩头拨下一寸，停住，等你点头。你点头，他吻在那一寸新露出来的皮肤上，久到你忘了雨声。
塞巴斯蒂安：“No mics. No crew.”
塞巴斯蒂安：“Tell me if you want this.”
塞巴斯蒂安：“Careful. I've been very polite all night.”
塞巴斯蒂安：“Say continue, or say stop.”
塞巴斯蒂安：“When I take you to bed, choose it twice.”
⟦CG|CG_M121_023|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C02_H_SEB_CONSENT_SLOW⟧
⟦IF|m121_enter_C02_H_SEB⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_SEB|他停下了⟧
⟦OPT|C|set:m121_i_C02_H_SEB_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C02_H_SEB⟧
# ·

# CHAPTER 3｜半夜的厨房不撒谎
⟦GOAL|了解Luca的餐厅与Julian的真实动机|MIDNIGHT DOES NOT LIE⟧

# SCENE｜半夜只剩一盏灯
⟦BG|BG_C03_S01|半夜只剩一盏灯⟧
⟦TIME|第3天⟧
⟦BGM|BGM_M121_C03|本章⟧
⟦SET|m121_scene~C03_S01⟧
旁白：午夜Luca在厨房为晚归的工作人员留面，见你进来便把温热的碗推到空位上；他不要求你留下。
卢卡：“It's not a date unless you say so.”
卢卡：“But it is good pasta.”
卢卡：“Sit if you're hungry.”
卢卡：“You don't owe me company.”
卢卡：“I can teach you from over here.”
卢卡：“Or show you the close version. Your call.”
# CHOICE｜你想一起做一道菜，还是听他讲餐厅的事？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C03_S01_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C03_S01_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C03_S01_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C03_S01_OTHER⟧
# ·
# CHOICE｜卢卡在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C03_H_LUC_CONSENT_FULL⟧
⟦IF|m121_enter_C03_H_LUC⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：你吃完了那碗面，没有走。Luca在洗锅，背对着你，围裙系带在腰后打着一个松垮的结。“You can go to bed,” 他说，“I'm not keeping a scorecard.” 你说你想学。他转过身，擦干手，看了你很久，然后把一把木勺递给你。他舀了一勺酱递到你嘴边，等你自己凑过来。你尝了，酱汁沾在你嘴角。
旁白：他看着那一点红，喉结动了动：“You've got— may I?” 你说可以。他用拇指擦掉，然后很慢地把拇指放进自己嘴里尝了尝。“Needs salt,” 他说，眼睛一直没离开你的嘴。你说那你尝尝别的地方。他把你抱上不锈钢台面，面粉扬起一小团白雾。他的吻像他做菜：不赶，耐心，一层一层地往深里走，舌尖有番茄的甜。
旁白：他的手掌沾着面粉贴在你大腿外侧，留下两个白色的指印，他低头看了一眼，笑了：“I marked you. Sorry. Not sorry.”。你若允许，他把你睡裙的肩带拨下一侧，吻落在你肩头，一路吻到锁骨中间，停下来，额头抵着你的胸口，呼吸很重。
旁白：“If we keep going on this counter, health inspectors will shut me down.” 你笑，他也笑，但他没有松手。
卢卡：“I'm not keeping a scorecard.”
卢卡：“Slow. Garlic burns if you rush it.”
卢卡：“You've got— may I?”
卢卡：“I marked you. Sorry. Not sorry.”
卢卡：“A hundred more times. Maybe ninety.”
⟦CG|CG_M121_024|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C03_H_LUC_CONSENT_SLOW⟧
⟦IF|m121_enter_C03_H_LUC⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_LUC|他停下了⟧
⟦OPT|C|set:m121_i_C03_H_LUC_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C03_H_LUC⟧
# ·

# SCENE｜谁在偷拿香草
⟦BG|BG_C03_S02|谁在偷拿香草⟧
⟦TIME|第3天⟧
⟦BGM|BGM_M121_C03|本章⟧
⟦SET|m121_scene~C03_S02⟧
旁白：Luca和Julian在香草园争论柠檬百里香该给晚餐还是表演饮料，Julian先道歉并将篮子交给你判断。
朱利安：“I stole the thyme for a terrible idea.”
卢卡：“At least admit it smells good.”
朱利安：“You decide.”
卢卡：“No hard feelings.”
⟦MG|g_M121_C03_MG01|香草与味道⟧
# CHOICE｜你要帮谁安排菜单，还是提出折中做法？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C03_S02_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C03_S02_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C03_S02_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C03_S02_OTHER⟧
# ·

# SCENE｜照片背面有旧日期
⟦BG|BG_C03_S03|照片背面有旧日期⟧
⟦TIME|第3天⟧
⟦BGM|BGM_M121_C03|本章⟧
⟦SET|m121_scene~C03_S03⟧
旁白：暗房里Julian向你展示自己第一部电影留下的联系印样，Quinn却从底片封套里找到节目宣传预排日期。
朱利安：“I once dated a publicity plan.”
朱利安：“Never again.”
奎因：“These dates are unusually early.”
朱利安：“Please check them with me.”
朱利安：“That almost felt scripted.”
朱利安：“Except it was real.”
⟦MG|g_M121_C03_MG02|提前印好的日期⟧
# CHOICE｜你想核对拍摄日期，还是先问Julian的经历？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C03_S03_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C03_S03_ENGAGE⟧
#### C｜我明确同意
旁白：先征询并给等待节拍，然后加载被允许动作的CG；若拒绝则加载保持距离版本
⟦OPT|C|set:m121_i_C03_S03_CONSENT⟧
#### D｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|D|set:m121_i_C03_S03_BOUNDARY⟧
#### E｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|E|set:m121_i_C03_S03_OTHER⟧
# ·

# SCENE｜一份租约，两种秘密
⟦BG|BG_C03_S04|一份租约，两种秘密⟧
⟦TIME|第3天⟧
⟦BGM|BGM_M121_C03|本章⟧
⟦SET|m121_scene~C03_S04⟧
旁白：Luca收起一份旧餐厅租约，Sebastian看见房东集团的标志后主动提醒应由律师判断其中的关联。
卢卡：“My kitchen is on that lease.”
塞巴斯蒂安：“I recognize the holding company.”
卢卡：“That doesn't make you my lawyer.”
塞巴斯蒂安：“You're right. Find one you trust.”
# CHOICE｜你要让Luca自行决定公开范围，还是请求法律咨询？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C03_S04_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C03_S04_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C03_S04_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C03_S04_OTHER⟧
# ·

# CHAPTER 4｜吻戏不是吻
⟦GOAL|明确镜头前表演与真实亲密边界|THE KISS IS NOT THE SCENE⟧

# SCENE｜镜头前的台词
⟦BG|BG_C04_S01|镜头前的台词⟧
⟦TIME|第4天⟧
⟦BGM|BGM_M121_C04|本章⟧
⟦SET|m121_scene~C04_S01⟧
旁白：排练台上Julian把写有亲吻动作的剧本折起来，当着导演面问你是否接受这段表演。
朱利安：“You don't owe the camera a kiss.”
娜奥米：“We can rewrite the beat.”
朱利安：“Your call. No pressure.”
娜奥米：“I'll change the shot list.”
# CHOICE｜你想改成对视、明确拒绝吻戏，还是自愿排练？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C04_S01_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C04_S01_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C04_S01_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C04_S01_OTHER⟧
# ·

# SCENE｜一分钟的呼吸
⟦BG|BG_C04_S02|一分钟的呼吸⟧
⟦TIME|第4天⟧
⟦BGM|BGM_M121_C04|本章⟧
⟦SET|m121_scene~C04_S02⟧
旁白：试衣区的珍珠别针落了一地，Julian一边帮工作人员捡拾一边放缓呼吸，Ryan顺手挡住推来的摄影支架。
朱利安：“It's easier to act brave.”
莱恩：“Then don't act.”
朱利安：“Good advice, annoyingly.”
莱恩：“You're welcome.”
⟦MG|g_M121_C04_MG01|别针安全盒⟧
# CHOICE｜你想陪Julian练呼吸，还是让排练暂停？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C04_S02_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C04_S02_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C04_S02_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C04_S02_OTHER⟧
# ·

# SCENE｜旧绯闻的剧照
⟦BG|BG_C04_S03|旧绯闻的剧照⟧
⟦TIME|第4天⟧
⟦BGM|BGM_M121_C04|本章⟧
⟦SET|m121_scene~C04_S03⟧
旁白：Quinn递来Julian过去被误标恋爱的宣传照，Julian当场指给你看布景里的宣传板而非编造恋爱细节。
朱利安：“That couple was a marketing pitch.”
朱利安：“It cost me a real friendship.”
奎因：“Original metadata is here.”
朱利安：“I want this one to be honest.”
⟦MG|g_M121_C04_MG02|剧照与宣传图比对⟧
# CHOICE｜你愿意听他解释，还是先验证素材来源？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C04_S03_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C04_S03_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C04_S03_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C04_S03_OTHER⟧
# ·

# SCENE｜没有剧本的那个靠近
⟦BG|BG_C04_S04|没有剧本的那个靠近⟧
⟦TIME|第4天⟧
⟦BGM|BGM_M121_C04|本章⟧
⟦SET|m121_scene~C04_S04⟧
旁白：夜晚Julian在阳台把标注“kiss”的剧本夹进文件夹，与你保持一臂距离，等待你是否主动靠近。
朱利安：“No cameras here.”
朱利安：“I want to kiss you.”
朱利安：“But wanting isn't permission.”
朱利安：“I can just stay and talk.”
朱利安：“I want the real thing, not a scene.”
朱利安：“Only if you do.”
# CHOICE｜你想主动靠近、只牵手，还是保持距离？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C04_S04_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C04_S04_ENGAGE⟧
#### C｜我明确同意
旁白：先征询并给等待节拍，然后加载被允许动作的CG；若拒绝则加载保持距离版本
⟦OPT|C|set:m121_i_C04_S04_CONSENT⟧
#### D｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|D|set:m121_i_C04_S04_BOUNDARY⟧
#### E｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|E|set:m121_i_C04_S04_OTHER⟧
# ·
# CHOICE｜朱利安在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C04_H_JUL_CONSENT_FULL⟧
⟦IF|m121_enter_C04_H_JUL⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：Julian把那页写着“kiss”的剧本夹进文件夹，扔到身后的躺椅上，然后对着空气做了一个夸张的谢幕。“Ladies and gentlemen, tonight's performance has been cancelled.” 他转回来，笑容还挂着，眼睛却已经不笑了。只有你说“这一条不喊卡”或者先吻他，他才吻你。
旁白：第一下他还在“演”——角度完美，手放在你下颌，像经过排练。然后你咬了一下他的下唇，他整个人散了：手从你下颌滑到你后脑，把你按向自己，吻得乱七八糟，毫无镜头感，鼻尖撞到你的，他也不管。
旁白：你把手伸进他敞开的衬衫，贴着他的腰侧，他发出一声几乎是委屈的叹息，额头抵着你肩膀笑：“That was not in the script.” “There's no script.” “Right. Right. God.” 他又吻上来，这次把你背后的礼裙拉链往下拉了一寸，停住，没有再动，等你。
旁白：你若允许，他把拉链拉到腰际，掌心贴上你裸露的后背，慢慢往上，像在背一段他终于想说出口的台词。你若不允许，他把拉链拉回去，吻一下你的肩，说：“Noted. Saved for the sequel.”。
朱利安：“Tonight's performance has been cancelled.”
朱利安：“I am very nervous.”
朱利安：“That was not in the script.”
朱利安：“There's no script. Right. God.”
朱利安：“Noted. Saved for the sequel.”
⟦CG|CG_M121_025|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C04_H_JUL_CONSENT_SLOW⟧
⟦IF|m121_enter_C04_H_JUL⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_JUL|他停下了⟧
⟦OPT|C|set:m121_i_C04_H_JUL_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C04_H_JUL⟧
# ·

# CHAPTER 5｜那个男人持有这座岛
⟦GOAL|查清Sebastian是否存在利益冲突|HE OWNS PART OF THIS⟧

# SCENE｜股权表上他的名字
⟦BG|BG_C05_S01|股权表上他的名字⟧
⟦TIME|第5天⟧
⟦BGM|BGM_M121_C05|本章⟧
⟦SET|m121_scene~C05_S01⟧
旁白：Ada把度假村公开股权摘要推到你面前，Sebastian站在对面主动承认持有少数股权。
艾达：“He holds a minority stake.”
塞巴斯蒂安：“I should have told you earlier.”
塞巴斯蒂安：“You deserved that choice.”
艾达：“Let's document the disclosure.”
# CHOICE｜你要追问时间线，还是先让他离开？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C05_S01_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C05_S01_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C05_S01_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C05_S01_OTHER⟧
# ·

# SCENE｜不是用钱买来的选择
⟦BG|BG_C05_S02|不是用钱买来的选择⟧
⟦TIME|第5天⟧
⟦BGM|BGM_M121_C05|本章⟧
⟦SET|m121_scene~C05_S02⟧
旁白：Sebastian拿出自己提出的退出竞争和重新披露方案，Ada逐条检查有无附带私人交换条件。
塞巴斯蒂安：“I won't buy your answer.”
艾达：“Then let the paper say so.”
塞巴斯蒂安：“Agreed.”
艾达：“We'll make it explicit.”
⟦MG|g_M121_C05_MG01|利益冲突标注⟧
# CHOICE｜你想让律师阅读、要求退出条款，还是暂不回复？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C05_S02_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C05_S02_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C05_S02_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C05_S02_OTHER⟧
# ·

# SCENE｜高处的风刚好
⟦BG|BG_C05_S03|高处的风刚好⟧
⟦TIME|第5天⟧
⟦BGM|BGM_M121_C05|本章⟧
⟦SET|m121_scene~C05_S03⟧
旁白：雨后的阳台，Sebastian解开袖扣让紧绷的手腕放松，把外套放在靠椅上而不是直接披向你。
塞巴斯蒂安：“I hate losing control.”
塞巴斯蒂安：“You are not mine to control.”
塞巴斯蒂安：“I still want to see you.”
塞巴斯蒂安：“Only if you choose to.”
塞巴斯蒂安：“I wanted to lead. I should have listened.”
⟦MG|g_M121_C05_MG02|距离与许可⟧
# CHOICE｜你想听他的告白、问清边界，还是结束独处？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C05_S03_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C05_S03_ENGAGE⟧
#### C｜我明确同意
旁白：先征询并给等待节拍，然后加载被允许动作的CG；若拒绝则加载保持距离版本
⟦OPT|C|set:m121_i_C05_S03_CONSENT⟧
#### D｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|D|set:m121_i_C05_S03_BOUNDARY⟧
#### E｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|E|set:m121_i_C05_S03_OTHER⟧
# ·

# SCENE｜被留下的纸条
⟦BG|BG_C05_S04|被留下的纸条⟧
⟦TIME|第5天⟧
⟦BGM|BGM_M121_C05|本章⟧
⟦SET|m121_scene~C05_S04⟧
旁白：Ryan看到Sebastian给你留的私人邀约，没有偷看而是另写一张邀请卡放在公共桌面。
莱恩：“This one's for you. No deadline.”
塞巴斯蒂安：“Mine has none either.”
莱恩：“Then we're learning.”
塞巴斯蒂安：“Slowly.”
# CHOICE｜你要读邀请卡，还是告诉他们别让邀请变成压力？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C05_S04_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C05_S04_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C05_S04_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C05_S04_OTHER⟧
# ·
# CHOICE｜塞巴斯蒂安在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C05_H_SEB_CONSENT_FULL⟧
⟦IF|m121_enter_C05_H_SEB⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：纸条上只写了房号和一句话：*The door will be unlocked. You will not owe me anything for knocking.* 你推门进去时，他正站在落地窗前，衬衫袖子卷到小臂，腕表已经摘下放在床头柜上。整个套房没有一台摄影机，Ada亲自检查过——这是他事先发给你的第一条信息。
旁白：你若说“过来”，他才走过来；你若让他别动，他就站在原地，看着你一颗一颗解开他的衬衫。白衬衫从他肩上滑落，露出宽阔的肩线和紧绷的腹部，皮肤在海面反光里泛着暖光。你把手按在他胸口，能感觉到他心跳快得一点也不像CEO。他吻你的方式和阳台那晚完全不同——更慢，更深，像终于不用再计算时间。他的手沿着你的脊背往下，找到丝质睡裙的系带，停住。
旁白：“May I?” 你说可以，丝绸顺着你的身体滑落在地毯上，他低头看你的眼神让你觉得自己是这间套房里唯一的光。他把你放进白色床单里，动作稳得像早就想过一千遍。他每一次更进一步之前都会低声问你，声音一次比一次哑：“Like this?”“Tell me.” 你回答他，用词语，也用指甲在他背上留下的痕迹。床头柜上的腕表在走，他终于不再看它。
旁白：窗外潮水一阵一阵拍岸，你分不清是海的节奏，还是他的。
塞巴斯蒂安：“You will not owe me anything.”
塞巴斯蒂安：“This time you decide. All of it.”
塞巴斯蒂安：“May I?”
塞巴斯蒂安：“Like this? Tell me.”
塞巴斯蒂安：“I don't like needing things. I need this.”
⟦CG|CG_M121_037|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C05_H_SEB_CONSENT_SLOW⟧
⟦IF|m121_enter_C05_H_SEB⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_SEB|他停下了⟧
⟦OPT|C|set:m121_i_C05_H_SEB_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C05_H_SEB⟧
# ·

# CHAPTER 6｜四张约会卡
⟦GOAL|在公开邀约和私下真实意愿之间做选择|FOUR INVITATIONS⟧

# SCENE｜四份邀请，四种人生
⟦BG|BG_C06_S01|四份邀请，四种人生⟧
⟦TIME|第6天⟧
⟦BGM|BGM_M121_C06|本章⟧
⟦SET|m121_scene~C06_S01⟧
旁白：四个男人各自送来一封安排不同的邀请，Naomi要求他们先遵守你设定的私人时间边界。
塞巴斯蒂安：“A quiet dinner. Your choice.”
莱恩：“A walk. No cameras.”
朱利安：“A film with no audience.”
卢卡：“A meal we make together.”
莱恩：“You can take all the time you need.”
朱利安：“And still pick none of us.”
# CHOICE｜你想答应一场约会、询问细节，还是暂时都不接受？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C06_S01_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C06_S01_ENGAGE⟧
#### C｜我明确同意
旁白：先征询并给等待节拍，然后加载被允许动作的CG；若拒绝则加载保持距离版本
⟦OPT|C|set:m121_i_C06_S01_CONSENT⟧
#### D｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|D|set:m121_i_C06_S01_BOUNDARY⟧
#### E｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|E|set:m121_i_C06_S01_OTHER⟧
# ·
# CHOICE｜莱恩在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C06_H_RYA_CONSENT_FULL⟧
⟦IF|m121_enter_C06_H_RYA⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：Ryan的邀请卡上画了一只歪歪扭扭的冰球和一行字：*Hot tub. For the knee. (Mostly.)* 栈道尽头的私人温泉池冒着白雾，四周只有竹篱和星星。他已经泡在水里，手臂搭在池沿，看见你来，猛地坐直，水溅了一地。
旁白：你若靠过去坐到他腿上，他会先确认：“My knee's fine. My heart is having a problem.” 他的吻比潟湖那晚慢得多，像一直在等。他的手从你的腰滑到背后，摸到泳衣系带的结，停在那里，嘴唇贴着你：“Can I?”。你说可以，他解开那个结，泳衣上半截在水里松开，他把你抱紧，胸口贴胸口，热水和皮肤分不清哪个更烫。
旁白：他吻你的锁骨、肩窝，手掌在水下沿着你的大腿外侧慢慢往上，你听见他的呼吸越来越乱，也听见自己的。最后是Ryan笑着把脸埋进你颈窝：“Okay, not in a hot tub. I'm a professional athlete, I have standards.” 他替你重新系好系带，手指笨得系了三次。
旁白：“Next time I want a bed. And all night. And breakfast after.”。
莱恩：“Hot tub. For the knee. Mostly.”
莱恩：“Nobody touches it like it's not broken.”
莱恩：“My knee's fine. My heart is having a problem.”
莱恩：“Can I?”
莱恩：“Next time I want a bed. And all night.”
⟦CG|CG_M121_029|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C06_H_RYA_CONSENT_SLOW⟧
⟦IF|m121_enter_C06_H_RYA⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_RYA|他停下了⟧
⟦OPT|C|set:m121_i_C06_H_RYA_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C06_H_RYA⟧
# ·

# SCENE｜没有排名的安排
⟦BG|BG_C06_S02|没有排名的安排⟧
⟦TIME|第6天⟧
⟦BGM|BGM_M121_C06|本章⟧
⟦SET|m121_scene~C06_S02⟧
旁白：制作人拿出观众想要的“四男争抢”日程表，你当面擦去预印的淘汰名次。
娜奥米：“The network wants a ranking.”
卢卡：“She isn't a prize.”
娜奥米：“We can revise the format.”
卢卡：“Good. Do that.”
⟦MG|g_M121_C06_MG01|约会安排表⟧
# CHOICE｜你想自己安排时间，还是要求完全取消排名？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C06_S02_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C06_S02_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C06_S02_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C06_S02_OTHER⟧
# ·

# SCENE｜谁在剪你的沉默
⟦BG|BG_C06_S03|谁在剪你的沉默⟧
⟦TIME|第6天⟧
⟦BGM|BGM_M121_C06|本章⟧
⟦SET|m121_scene~C06_S03⟧
旁白：Quinn把未播放音频的文字整理记录放在台面，Julian指出其中一处停顿被剪成仿佛你已经答应亲吻。
奎因：“They cut out your pause.”
朱利安：“That's not consent.”
奎因：“The master file can confirm it.”
朱利安：“Then preserve the master.”
⟦MG|g_M121_C06_MG02|被剪掉的停顿⟧
# CHOICE｜你想核验原文件，还是提出保全要求？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C06_S03_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C06_S03_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C06_S03_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C06_S03_OTHER⟧
# ·

# SCENE｜第一次认真生气
⟦BG|BG_C06_S04|第一次认真生气⟧
⟦TIME|第6天⟧
⟦BGM|BGM_M121_C06|本章⟧
⟦SET|m121_scene~C06_S04⟧
旁白：晚餐上四位男主听到节目组试图给他们排“输赢榜”，Ryan先起身撤掉名单，Julian不再开玩笑。
莱恩：“No one wins a person.”
朱利安：“For once, the athlete speaks poetry.”
卢卡：“Let's eat.”
塞巴斯蒂安：“After we fix the rule.”
塞巴斯蒂安：“She is not a trophy.”
卢卡：“Finally, something we all agree on.”
# CHOICE｜你想公开支持他们，还是独立声明规则？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C06_S04_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C06_S04_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C06_S04_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C06_S04_OTHER⟧
# ·

# CHAPTER 7｜停电那夜
⟦GOAL|保证风暴停电时全员安全|THE NIGHT THE LIGHTS WENT OUT⟧

# SCENE｜灯灭的瞬间
⟦BG|BG_C07_S01|灯灭的瞬间⟧
⟦TIME|第7天⟧
⟦BGM|BGM_M121_C07|本章⟧
⟦SET|m121_scene~C07_S01⟧
旁白：暴雨使公共休息室突然停电，Ryan点亮应急灯，Luca从冰箱取出需要冷藏的药物和食品确认安全。
莱恩：“Everybody okay?”
卢卡：“Power's down, not our heads.”
莱恩：“Stay where the floor's dry.”
卢卡：“I'll check the fridge log.”
# CHOICE｜你想协助排查安全，还是在安全区等待？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C07_S01_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C07_S01_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C07_S01_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C07_S01_OTHER⟧
# ·
# CHOICE｜卢卡在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C07_H_LUC_CONSENT_FULL⟧
⟦IF|m121_enter_C07_H_LUC⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：全岛停电，只有厨房的燃气灶还能用。Luca把所有需要冷藏的东西安顿好，回头看见你还在，便在灶上煮了一小锅烩饭，“Storm food. You stir, I talk.” 蓝色的火焰是整个厨房唯一的光，映在他眼睛里像两点琥珀。你说你不想一个人待着，他关掉火，牵着你走上厨房后面那道窄楼梯，通往他的员工阁楼。雨打在斜屋顶上，他点了一盏煤油灯，转身，等你。
旁白：你走过去，替他把那件炭灰色T恤从头上拉掉——他抬起手臂配合你，像小孩被大人脱衣服，然后低头笑了。他前臂上的纹身在灯下看得很清楚：一把刀、一枝迷迭香、一个日期。你吻那个日期，问他是什么，他说是他餐厅开张那天。
旁白：“First thing I ever built that was mine.” 他的手捧住你的脸，“Second thing, maybe, if you want.”。他做什么都很慢。解开你衣服的每一颗扣子之前都先吻一下那里的皮肤，像在试火候。
旁白：他把你放在那张窄床上，自己跪在床边，手掌从你的脚踝开始，沿着小腿、膝窝、大腿慢慢往上抚，一边看你的表情，一边问：“Here? ... Here?” 你的回答越来越短，最后只剩下呼吸。雨越下越大，他的节奏却始终不急，像一锅要熬很久的汤，直到你自己拽着他的头发求他快一点，他才低笑着照做。
卢卡：“Storm food. You stir, I talk.”
卢卡：“That you trust me. I don't want to waste it.”
卢卡：“First thing I ever built that was mine.”
卢卡：“Here? ... Here?”
卢卡：“Cold now.”
⟦CG|CG_M121_014|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C07_H_LUC_CONSENT_SLOW⟧
⟦IF|m121_enter_C07_H_LUC⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_LUC|他停下了⟧
⟦OPT|C|set:m121_i_C07_H_LUC_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C07_H_LUC⟧
# ·

# SCENE｜没有信号的走廊
⟦BG|BG_C07_S02|没有信号的走廊⟧
⟦TIME|第7天⟧
⟦BGM|BGM_M121_C07|本章⟧
⟦SET|m121_scene~C07_S02⟧
旁白：Quinn发现备用设备在停电前留下收音日志，Naomi立即要求停用并保存原记录供独立审查。
奎因：“The backup logged audio.”
娜奥米：“Power it down and seal it.”
奎因：“Timestamp is intact.”
娜奥米：“No one listens alone.”
⟦MG|g_M121_C07_MG01|安全频道封存⟧
# CHOICE｜你想封存设备、请律师到场，还是先核对安全频道？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C07_S02_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C07_S02_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C07_S02_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C07_S02_OTHER⟧
# ·

# SCENE｜一条干燥的毯子
⟦BG|BG_C07_S03|一条干燥的毯子⟧
⟦TIME|第7天⟧
⟦BGM|BGM_M121_C07|本章⟧
⟦SET|m121_scene~C07_S03⟧
旁白：Sebastian把毛毯递到你够得着的扶手，Julian坐在另一端讲一个没有观众也不必好笑的故事。
塞巴斯蒂安：“Blanket's here if you want it.”
朱利安：“I can stop talking.”
塞巴斯蒂安：“That would be novel.”
朱利安：“And very brave.”
朱利安：“We can sit together and still keep our own space.”
⟦MG|g_M121_C07_MG02|客厅安全区⟧
# CHOICE｜你想和谁聊，还是说今晚需要安静？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C07_S03_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C07_S03_ENGAGE⟧
#### C｜我明确同意
旁白：先征询并给等待节拍，然后加载被允许动作的CG；若拒绝则加载保持距离版本
⟦OPT|C|set:m121_i_C07_S03_CONSENT⟧
#### D｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|D|set:m121_i_C07_S03_BOUNDARY⟧
#### E｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|E|set:m121_i_C07_S03_OTHER⟧
# ·
# CHOICE｜朱利安在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C07_H_JUL_CONSENT_FULL⟧
⟦IF|m121_enter_C07_H_JUL⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：停电还在继续。Julian的房间只点了三根蜡烛，雨砸在窗上，像无数观众在鼓掌。他把那条干燥的毛毯铺在床上，转身看见你在门口，手里的火柴烧到了指尖都没察觉。你走过去，替他解开衬衫，一颗，又一颗。“The guy on the poster has abs painted on,” 你说。他笑出声，笑声在发抖。
旁白：衬衫落地，蜡烛光在他胸口和肩膀上晃，他没有摆任何角度，只是站着让你看——这比任何一场戏都需要勇气。他问你的方式也一点不像电影：“Can I take this off you? Is that— can I?” 你说可以。他解开你睡裙的细带时手指笨拙地卡了一下，他低声骂了句脏话，你们都笑了，然后谁也笑不出来了。毛毯下很暖。
旁白：他把你压进枕头里，吻你的方式像要把这些年所有被导演喊“cut”的吻都补回来。烛光在墙上把你们的影子拉得很长，他一直在说话，断断续续、不成句子——“You're— this is— don't let me perform, okay? Tell me if I'm performing.” 你说他没有。他把脸埋在你颈窝，你感觉到他的睫毛是湿的。
朱利安：“Every line I know is from a movie.”
朱利安：“I'm scared you want the guy on the poster.”
朱利安：“Can I take this off you?”
朱利安：“Tell me if I'm performing.”
朱利安：“I prefer us like this.”
⟦CG|CG_M121_038|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C07_H_JUL_CONSENT_SLOW⟧
⟦IF|m121_enter_C07_H_JUL⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_JUL|他停下了⟧
⟦OPT|C|set:m121_i_C07_H_JUL_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C07_H_JUL⟧
# ·

# SCENE｜清晨递来的决定
⟦BG|BG_C07_S04|清晨递来的决定⟧
⟦TIME|第7天⟧
⟦BGM|BGM_M121_C07|本章⟧
⟦SET|m121_scene~C07_S04⟧
旁白：清晨Ada核对封存签字，Naomi承认过去对“安全录音”措辞不够清楚，愿意安排正式审查。
艾达：“You have options.”
娜奥米：“I should have been clearer.”
艾达：“No one gets your private audio.”
娜奥米：“We'll cooperate.”
# CHOICE｜你想继续但加条件，还是暂停参与？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C07_S04_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C07_S04_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C07_S04_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C07_S04_OTHER⟧
# ·

# CHAPTER 8｜被剪出来的吻
⟦GOAL|核实并回应一段遭恶意拼接的画面|THE KISS THEY INVENTED⟧

# SCENE｜照片是被裁掉一半的
⟦BG|BG_C08_S01|照片是被裁掉一半的⟧
⟦TIME|第8天⟧
⟦BGM|BGM_M121_C08|本章⟧
⟦SET|m121_scene~C08_S01⟧
旁白：Quinn向你展示一张流出的截帧，右侧被裁去的字幕牌证明那其实是一次场景排练。
奎因：“This frame is missing half the room.”
艾达：“Don't repeat the rumor.”
奎因：“Original clip is archived.”
艾达：“We can request a correction.”
# CHOICE｜你要核对原片，还是先要求平台删除误导片段？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C08_S01_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C08_S01_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C08_S01_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C08_S01_OTHER⟧
# ·

# SCENE｜无声的口型
⟦BG|BG_C08_S02|无声的口型⟧
⟦TIME|第8天⟧
⟦BGM|BGM_M121_C08|本章⟧
⟦SET|m121_scene~C08_S02⟧
旁白：Julian在空舞台按原机位重演当晚离镜头的动作，Naomi对照时间码发现原拍摄并没有真正接触。
朱利安：“We never kissed in that take.”
娜奥米：“The camera angle made it look close.”
朱利安：“Then say so.”
娜奥米：“I will.”
⟦MG|g_M121_C08_MG01|重建镜头角度⟧
# CHOICE｜你愿意让他作证，还是选择由文件独立回应？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C08_S02_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C08_S02_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C08_S02_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C08_S02_OTHER⟧
# ·
# CHOICE｜朱利安在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C08_H_JUL_CONSENT_FULL⟧
⟦IF|m121_enter_C08_H_JUL⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：时间码证明了那个“吻”是假的——原片里你们之间隔着整整一步。Julian从舞台下来，一言不发地走进化妆间，对着满是灯泡的镜子用力擦掉脸上的舞台妆。你跟进去，反锁了门，是你锁的。他转过身，把你抱上化妆台，化妆刷和粉扑滚了一地。
旁白：“Then let's give them nothing to cut,” 他说，声音完全不演了，“because this— this is just ours.” 他吻你，你扯开他衬衫，扣子崩掉一颗弹到镜子上。镜子里的灯泡一排排亮着，照得一切无处躲藏，他却第一次不在意自己的“角度”。他吻你的脖子，手推高你裙摆到大腿，停下来抬眼问你，你把他拉近作为回答。
旁白：你的背抵着冰凉的镜面，前面是他滚烫的身体，你从他肩膀后看见镜子里的两个人——乱、真、毫无表演。他一直看着你的眼睛，像怕一眨眼你就变回剪辑里的那个女人。“Look at me. Not the mirror. Me.” 你看他。他汗湿的额发贴在眉上，呼吸乱成一片，到最后只会一遍遍叫你的名字。
朱利安：“Is this the part where the heroine seduces the actor?”
朱利安：“Let's give them nothing to cut.”
朱利安：“Look at me. Not the mirror. Me.”
朱利安：“Nobody will ever see it.”
⟦CG|CG_M121_017|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C08_H_JUL_CONSENT_SLOW⟧
⟦IF|m121_enter_C08_H_JUL⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_JUL|他停下了⟧
⟦OPT|C|set:m121_i_C08_H_JUL_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C08_H_JUL⟧
# ·

# SCENE｜你不是剪辑里的女人
⟦BG|BG_C08_S03|你不是剪辑里的女人⟧
⟦TIME|第8天⟧
⟦BGM|BGM_M121_C08|本章⟧
⟦SET|m121_scene~C08_S03⟧
旁白：Ada拟好隐私投诉草稿，Sebastian没有替你决定是否公开，只提供可自由拒绝的独立法律费用担保。
艾达：“Your silence is still a choice.”
塞巴斯蒂安：“I can fund counsel, no strings.”
艾达：“She chooses the response.”
塞巴斯蒂安：“Absolutely.”
⟦MG|g_M121_C08_MG02|我的回应范围⟧
# CHOICE｜你想公开声明、私下维权，还是暂时不发声？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C08_S03_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C08_S03_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C08_S03_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C08_S03_OTHER⟧
# ·

# SCENE｜谁先相信你
⟦BG|BG_C08_S04|谁先相信你⟧
⟦TIME|第8天⟧
⟦BGM|BGM_M121_C08|本章⟧
⟦SET|m121_scene~C08_S04⟧
旁白：泳池边Ryan先把手机屏幕扣下，Luca坚持不要围着你追问，Julian承认自己早该纠正摄像机前的误导动作。
莱恩：“You don't have to explain.”
卢卡：“There's food inside. No audience.”
朱利安：“I should have spoken sooner.”
莱恩：“We can give you space.”
莱恩：“I am here, but you do not owe me a story.”
# CHOICE｜你想接受谁的陪伴，还是要求今夜独处？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C08_S04_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C08_S04_ENGAGE⟧
#### C｜我明确同意
旁白：先征询并给等待节拍，然后加载被允许动作的CG；若拒绝则加载保持距离版本
⟦OPT|C|set:m121_i_C08_S04_CONSENT⟧
#### D｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|D|set:m121_i_C08_S04_BOUNDARY⟧
#### E｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|E|set:m121_i_C08_S04_OTHER⟧
# ·
# CHOICE｜莱恩在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C08_H_RYA_CONSENT_FULL⟧
⟦IF|m121_enter_C08_H_RYA⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：伪造的吻照传遍了全岛，Ryan是第一个把手机扣下的人。他没有问你一个问题。你说想离开这里，他就带你回了他的海边小屋，一路上什么都没说，只是把外套披在你肩上，手很稳。他把湿透的T恤从头上扯掉，扔在竹地板上。热水浇下来，他把你拉进水幕里，吻你的时候还在笑，笑着笑着就不笑了。他的手捧着你的脸，拇指擦掉你脸上的水，一遍又一遍，像在擦掉那张假照片。
旁白：淋浴间到床之间留下一串湿脚印。他把你放在床上，浴巾散开，他撑在你上方，肩膀挡住了整盏灯。“Tell me if anything hurts. Or if anything's good. Mostly tell me if it's good.” 你笑出声，他也笑，然后低头吻你，从唇到颈到心口，耐心得出奇。
旁白：他的身体是运动员的身体，温热、结实、充满力量，但他用这份力量的方式只有一种：稳稳地托住你。床头的手机震了一次又一次，他伸手把它扔进了抽屉，再没看一眼。后来你只记得他背上的汗、他贴着你耳朵的喘息、他在你说“别停”的时候发出的那声低哑的笑，还有他一遍遍确认：“Still good?” “Yes.” “Good. Me too. Very, very good.”。
莱恩：“Are you sure? You've had a day.”
莱恩：“Tell me if anything's good.”
莱恩：“Still good?”
莱恩：“Very, very good.”
莱恩：“You looked at me like I'm just me.”
⟦CG|CG_M121_031|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C08_H_RYA_CONSENT_SLOW⟧
⟦IF|m121_enter_C08_H_RYA⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_RYA|他停下了⟧
⟦OPT|C|set:m121_i_C08_H_RYA_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C08_H_RYA⟧
# ·

# CHAPTER 9｜他为你付出的代价
⟦GOAL|分辨四份帮助是否带隐性条件|WHAT THEY STAND TO LOSE⟧

# SCENE｜贷款不是情书
⟦BG|BG_C09_S01|贷款不是情书⟧
⟦TIME|第9天⟧
⟦BGM|BGM_M121_C09|本章⟧
⟦SET|m121_scene~C09_S01⟧
旁白：Luca让Ada确认餐厅房东与节目赞助者的商业关联，他拒绝利用与你亲近来换取租约优惠。
卢卡：“My restaurant is not your debt.”
艾达：“We can challenge the notice.”
卢卡：“I'll do it even if you leave.”
艾达：“That's the right boundary.”
卢卡：“I want you beside me. Not responsible for me.”
# CHOICE｜你想询问可替代方案，还是给他一个拥抱提议？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C09_S01_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C09_S01_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C09_S01_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C09_S01_OTHER⟧
# ·

# SCENE｜奖牌放在桌上
⟦BG|BG_C09_S02|奖牌放在桌上⟧
⟦TIME|第9天⟧
⟦BGM|BGM_M121_C09|本章⟧
⟦SET|m121_scene~C09_S02⟧
旁白：Ryan把旧奖牌放在训练垫边，坦白他的代言方曾要求他在节目里展现无伤形象，他将以实名修正虚假宣传。
莱恩：“They want the old highlight reel.”
莱恩：“I'm not that clip anymore.”
莱恩：“You can care without fixing me.”
莱恩：“I like that about us.”
⟦MG|g_M121_C09_MG01|训练计划卡⟧
# CHOICE｜你想鼓励他的决定，还是听他自己说明？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C09_S02_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C09_S02_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C09_S02_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C09_S02_OTHER⟧
# ·

# SCENE｜我不是你的投资项目
⟦BG|BG_C09_S03|我不是你的投资项目⟧
⟦TIME|第9天⟧
⟦BGM|BGM_M121_C09|本章⟧
⟦SET|m121_scene~C09_S03⟧
旁白：Sebastian在律师见证下签署利益披露，主动回避有关节目住宿的投票；他把决定权交回主办方和你。
塞巴斯蒂安：“I recused myself.”
艾达：“The document reflects that.”
塞巴斯蒂安：“You are not an acquisition.”
艾达：“Let's keep it that way.”
⟦MG|g_M121_C09_MG02|股权条款核验⟧
# CHOICE｜你想了解回避范围，还是暂时不谈关系？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C09_S03_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C09_S03_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C09_S03_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C09_S03_OTHER⟧
# ·
# CHOICE｜塞巴斯蒂安在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C09_H_SEB_CONSENT_FULL⟧
⟦IF|m121_enter_C09_H_SEB⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：回避声明签完了。他不再持有这座岛上任何与你有关的利益，Ada亲手把副本封进信封。那天夜里下起暴雨，他套房的大理石浴缸放满了热水，蒸汽爬满整面落地窗，把海和闪电都化成一片模糊的光。你若松开浴巾踏进水里，他才跟着进来；你若示意他先进去，他就照做，背靠着浴缸看你。热水漫过你的肩，他从身后把你圈进怀里，胸膛贴着你湿透的后背，下巴搁在你肩上，像终于可以松懈的人。
旁白：这一次的Sebastian是他承认自己“占有欲”的版本——他没有否认那份欲望，只是把它变成一句问句。他的唇贴着你耳后：“Tell me I can be selfish tonight.” 只有当你说“可以”，他的手才从你腰间向上，掌心抚过你湿滑的皮肤，吻落在你颈侧和锁骨，一下比一下用力，像要把这几周忍下来的全部讨回来。水花溅出浴缸边沿，打湿了大理石地面。
旁白：他把你转过来面对他，你跨坐在他身上，额头相抵，雾气里只有彼此急促的呼吸。他喊你的名字——不是节目里的称呼，是你本人的名字。你扶着他的肩，他扶着你的腰，节奏由你定，他只是一遍遍地说“Yes. Like that.”，声音碎得不像他。
塞巴斯蒂安：“I own nothing here anymore.”
塞巴斯蒂安：“Not you. I just want you.”
塞巴斯蒂安：“Tell me I can be selfish tonight.”
塞巴斯蒂安：“Yes. Like that.”
塞巴斯蒂安：“I'm terrible at this.”
⟦CG|CG_M121_015|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C09_H_SEB_CONSENT_SLOW⟧
⟦IF|m121_enter_C09_H_SEB⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_SEB|他停下了⟧
⟦OPT|C|set:m121_i_C09_H_SEB_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C09_H_SEB⟧
# ·

# SCENE｜演员走下舞台
⟦BG|BG_C09_S04|演员走下舞台⟧
⟦TIME|第9天⟧
⟦BGM|BGM_M121_C09|本章⟧
⟦SET|m121_scene~C09_S04⟧
旁白：Julian在镜头前拒绝“挽回女主”的强制桥段，走到舞台边把台词稿还给Naomi。
朱利安：“Not every scene needs a kiss.”
娜奥米：“I can shoot a different ending.”
朱利安：“Then let's make one.”
娜奥米：“Agreed.”
朱利安：“I am not asking for a scene. I am asking for Tuesday.”
# CHOICE｜你想当面感谢他，还是只让他完成自己的决定？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C09_S04_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C09_S04_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C09_S04_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C09_S04_OTHER⟧
# ·

# CHAPTER 10｜关机后的四封信
⟦GOAL|听完不同人的私人承诺|LETTERS WITH NO AUDIENCE⟧

# SCENE｜不带署名的信封
⟦BG|BG_C10_S01|不带署名的信封⟧
⟦TIME|第10天⟧
⟦BGM|BGM_M121_C10|本章⟧
⟦SET|m121_scene~C10_S01⟧
旁白：四封信按约定放在客厅台面，每封都注明“可以不读”，没有人堵在门口等待答案。
塞巴斯蒂安：“No reply required.”
莱恩：“Mine's probably messy.”
朱利安：“No audience this time.”
卢卡：“I left mine unsealed.”
塞巴斯蒂安：“A letter is not a demand for an answer.”
# CHOICE｜你想先读哪封，还是把阅读留到明天？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C10_S01_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C10_S01_ENGAGE⟧
#### C｜我明确同意
旁白：先征询并给等待节拍，然后加载被允许动作的CG；若拒绝则加载保持距离版本
⟦OPT|C|set:m121_i_C10_S01_CONSENT⟧
#### D｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|D|set:m121_i_C10_S01_BOUNDARY⟧
#### E｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|E|set:m121_i_C10_S01_OTHER⟧
# ·

# SCENE｜一顿不需证明的晚餐
⟦BG|BG_C10_S02|一顿不需证明的晚餐⟧
⟦TIME|第10天⟧
⟦BGM|BGM_M121_C10|本章⟧
⟦SET|m121_scene~C10_S02⟧
旁白：Luca与Ryan一起准备晚餐，发现你曾说不吃辣，主动把酱料放在两边让你选择。
卢卡：“Sauce on the side.”
莱恩：“I remembered you said mild.”
卢卡：“Miracles happen.”
莱恩：“Not competing. Cooking.”
⟦MG|g_M121_C10_MG01|菜单里的偏好⟧
# CHOICE｜你想帮他们掌勺，还是讲讲自己的偏好？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C10_S02_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C10_S02_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C10_S02_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C10_S02_OTHER⟧
# ·
# CHOICE｜卢卡在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C10_H_LUC_CONSENT_FULL⟧
⟦IF|m121_enter_C10_H_LUC⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：Ryan先走了，他特意眨了眨眼。温室里只剩下串灯、无花果树和还没撤的长桌。Luca切开一颗熟透的无花果，红色的果肉在灯下发亮。“Dessert,” 他说，“is whatever you want it to be.”。你把蜂蜜罐推到他面前，用指尖蘸了一点，点在自己的锁骨上，看着他。Luca的眼神暗了下去，他慢慢把桌上的盘子推开，像在清理一块工作台。
旁白：“Are you sure? Because I will take my time.” 你说你就是要他慢慢来。他把你放在铺着亚麻桌布的长桌上，裙子的肩带从你肩上滑落，他用嘴追着那一点蜂蜜往下，一路吻得又湿又甜，舌尖的温度和玻璃温室里潮湿的空气混在一起。他的手很大，掌心有做菜磨出来的茧，从你的腰侧一点点抚到背后，把拉链拉到底。
旁白：他吻遍你的每一寸——肩、胸口、腰窝、膝盖——像在尝一道他打算记一辈子的菜。你催他，他偏不急，笑着贴在你耳边说意大利语，你一个字都听不懂，却全身发烫。直到你把他的T恤拽掉、指甲划过他的背，他才终于压上来，桌上的玻璃杯被撞得叮当作响，无花果滚到地上。他的节奏深、慢、绵长，像温室里潮湿的热气，一层一层把你淹没。
卢卡：“Dessert is whatever you want it to be.”
卢卡：“Waste is a sin in my kitchen.”
卢卡：“Are you sure? I will take my time.”
卢卡：“You know what I'm going to name it?”
⟦CG|CG_M121_032|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C10_H_LUC_CONSENT_SLOW⟧
⟦IF|m121_enter_C10_H_LUC⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_LUC|他停下了⟧
⟦OPT|C|set:m121_i_C10_H_LUC_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C10_H_LUC⟧
# ·

# SCENE｜没有滤镜的试镜
⟦BG|BG_C10_S03|没有滤镜的试镜⟧
⟦TIME|第10天⟧
⟦BGM|BGM_M121_C10|本章⟧
⟦SET|m121_scene~C10_S03⟧
旁白：Julian将关着的监视器背向你，邀请Sebastian一起练习一句普通道歉，不准任何人“导演”你的反应。
朱利安：“You can say no and I can stay kind.”
塞巴斯蒂安：“That's difficult. And necessary.”
朱利安：“We're learning.”
塞巴斯蒂安：“Clearly.”
⟦MG|g_M121_C10_MG02|无条件的道歉⟧
# CHOICE｜你想回应哪个道歉，还是暂时都不接纳？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C10_S03_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C10_S03_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C10_S03_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C10_S03_OTHER⟧
# ·
# CHOICE｜朱利安在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C10_H_JUL_CONSENT_FULL⟧
⟦IF|m121_enter_C10_H_JUL⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：所有人都走了，排练舞台上只剩一盏守夜灯。Julian把监视器转过去对着墙，坐在台沿，腿悬在黑暗的观众席上方。“Ghost light,” 他说，“theatres leave one on so the ghosts can perform. I always thought that was the loneliest thing.”。你在台上吻他。
旁白：他回吻的时候在抖。你推他躺在舞台的木地板上，他仰面看着你，守夜灯在他身后形成一圈光晕。“Where do you want me?” 他问——一个演员最常问导演的问题，这次是认真的。舞台地板很硬，你们拽来一块幕布垫在下面。他把你身上那件他借给你的衬衫一颗颗解开，嘴唇跟着纽扣往下走，慢得像在背一首诗。
旁白：整个剧场空荡荡的，只有你们的呼吸被木头放大，每一声都像在回音里绕一圈再回来。他把你翻到上面，看着你，双手扶着你的腰，眼睛一眨不眨：“I want to remember this exactly. No edits.”。这是你们最慢、也最深的一次。
旁白：他不再说话，所有的台词都没了，只只剩温度和呼吸——汗、温度、急促又克制的喘息，他在最后把脸埋进你的掌心，像一个终于谢幕的人。
朱利安：“Theatres leave one on so the ghosts can perform.”
朱利安：“I'm in love with you.”
朱利安：“That's the whole show.”
朱利安：“Where do you want me?”
朱利安：“I want to remember this exactly. No edits.”
⟦CG|CG_M121_034|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C10_H_JUL_CONSENT_SLOW⟧
⟦IF|m121_enter_C10_H_JUL⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_JUL|他停下了⟧
⟦OPT|C|set:m121_i_C10_H_JUL_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C10_H_JUL⟧
# ·

# SCENE｜那一张完整的时间码
⟦BG|BG_C10_S04|那一张完整的时间码⟧
⟦TIME|第10天⟧
⟦BGM|BGM_M121_C10|本章⟧
⟦SET|m121_scene~C10_S04⟧
旁白：Quinn在Ada监督下将原始时间码与公开版逐行比对，Naomi确认至少两处后期改动未获得出演者重新确认。
奎因：“Here's the uncut timeline.”
艾达：“Chain of custody is intact.”
娜奥米：“We owe you a correction.”
艾达：“And a choice about how.”
# CHOICE｜你想提交更正申请，还是请律师先检查范围？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C10_S04_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C10_S04_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C10_S04_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C10_S04_OTHER⟧
# ·

# CHAPTER 11｜现场直播前一分钟
⟦GOAL|决定是否在直播中公开剪辑争议|ONE MINUTE TO LIVE⟧

# SCENE｜直播门后面
⟦BG|BG_C11_S01|直播门后面⟧
⟦TIME|第11天⟧
⟦BGM|BGM_M121_C11|本章⟧
⟦SET|m121_scene~C11_S01⟧
旁白：直播前Naomi递来一张要求当场宣布“唯一真爱”的台卡，Ada明确告诉你可以拒绝公开私人关系。
娜奥米：“They want a final couple.”
艾达：“You can refuse the premise.”
娜奥米：“I'll support a rewrite.”
艾达：“It remains her decision.”
# CHOICE｜你要改说自己的话，还是直接退出直播？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C11_S01_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C11_S01_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C11_S01_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C11_S01_OTHER⟧
# ·

# SCENE｜最后一个耳返
⟦BG|BG_C11_S02|最后一个耳返⟧
⟦TIME|第11天⟧
⟦BGM|BGM_M121_C11|本章⟧
⟦SET|m121_scene~C11_S02⟧
旁白：Quinn示范现场耳返开关，Ryan检查舞台边界防止隐私话筒再次被误接，随后交给你选择是否佩戴。
奎因：“This switch is physical.”
莱恩：“And it stays yours.”
奎因：“No hidden feed.”
莱恩：“That's how it should be.”
⟦MG|g_M121_C11_MG01|耳返实体静音⟧
# CHOICE｜你愿意测试静音、要求无耳返，还是请求独立监听？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C11_S02_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C11_S02_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C11_S02_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C11_S02_OTHER⟧
# ·
# CHOICE｜莱恩在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C11_H_RYA_CONSENT_FULL⟧
⟦IF|m121_enter_C11_H_RYA⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：Ryan亲手检查完所有隐私话筒，把关掉的耳返放在训练馆长凳上，像放下一枚奖牌。直播在十几个小时后，他说睡不着，要做最后一组康复训练，问你要不要来“当计数员”。这一回是你先吻他。
旁白：他愣了半秒，然后翻身把你护在身下，手肘撑在你两侧，用他最熟悉的方式确认：“Game on?” 你说“Game on.” 他笑着低头吻你，一边吻一边把你睡裙的肩带往下拨，嘴唇跟着肩带一路往下。他用了全部的力气，也用了全部的温柔。你们从垫子上滚到墙边的软垫，他把你抱起来抵在墙上，你的手指扣进他汗湿的头发，他的呼吸喷在你颈侧，一下一下，像比赛最后一分钟的冲刺。
旁白：他膝盖的事他一次都没提，倒是你提了一次，他喘着气笑：“Knee's great. Best rehab ever.”。最后你们躺在垫子上看天花板，汗水把你们黏在一起。他握着你的手放在他胸口，让你感觉那里跳得有多快。“That's not the workout,” 他说，“that's you.”。
莱恩：“Coach, I'm dying.”
莱恩：“Game on?”
莱恩：“Knee's great. Best rehab ever.”
莱恩：“That's not the workout. That's you.”
莱恩：“I'm not gonna sulk. Maybe a little.”
⟦CG|CG_M121_039|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C11_H_RYA_CONSENT_SLOW⟧
⟦IF|m121_enter_C11_H_RYA⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_RYA|他停下了⟧
⟦OPT|C|set:m121_i_C11_H_RYA_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C11_H_RYA⟧
# ·

# SCENE｜他们站在灯外
⟦BG|BG_C11_S03|他们站在灯外⟧
⟦TIME|第11天⟧
⟦BGM|BGM_M121_C11|本章⟧
⟦SET|m121_scene~C11_S03⟧
旁白：四个男人站在灯光线外，不再同时伸手向你索取承诺；他们依次只说一句自己的真实愿望。
塞巴斯蒂安：“I'd like a real date.”
莱恩：“No scoreboard.”
朱利安：“No scripts.”
卢卡：“I'll be cooking either way.”
卢卡：“I will be there. And I will understand if you change your mind.”
⟦MG|g_M121_C11_MG02|承诺与交换⟧
# CHOICE｜你想向谁提出未来约会，还是声明需要时间？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C11_S03_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C11_S03_ENGAGE⟧
#### C｜我明确同意
旁白：先征询并给等待节拍，然后加载被允许动作的CG；若拒绝则加载保持距离版本
⟦OPT|C|set:m121_i_C11_S03_CONSENT⟧
#### D｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|D|set:m121_i_C11_S03_BOUNDARY⟧
#### E｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|E|set:m121_i_C11_S03_OTHER⟧
# ·
# CHOICE｜塞巴斯蒂安在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C11_H_SEB_CONSENT_FULL⟧
⟦IF|m121_enter_C11_H_SEB⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：直播前一晚。四个男人在灯外各说了一句真心话，你把今晚给了Sebastian。他的行李箱已经收好立在门边，回纽约的机票是后天，不论直播结果如何。这个场景的“同意”是玩家主动说出口的愿望，而不是点头。你说什么，他就做什么，一字不差。你让他吻你，他吻；你让他慢，他慢得近乎残忍；你让他别克制，他就把你抱起来，你的腿缠上他的腰，他抱着你一路吻到床边。
旁白：他的占有欲终于有了名字，却是以你的许可为前提：“Can I call you mine? Just in this room?” 你说可以。他低头吻你的锁骨，一遍遍贴着皮肤念那个词，像在练习一件他从未被允许拥有的东西。这一夜比前两次都要长。床单被踢到床尾，汗水沿着他的脊沟往下淌，月光把你们的影子投在墙上，交叠、分开、又交叠。
旁白：他把你的双手压在枕边，十指紧扣，停下来看你的眼睛，确认你还在笑，才继续。天快亮的时候，你们都已经没力气说话，只剩下呼吸。
塞巴斯蒂安：“I won't ask you to say my name.”
塞巴斯蒂安：“Tell me what you want. Out loud.”
塞巴斯蒂安：“Can I call you mine? Just in this room?”
塞巴斯蒂安：“Keep it. Wear it in New York.”
⟦CG|CG_M121_040|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C11_H_SEB_CONSENT_SLOW⟧
⟦IF|m121_enter_C11_H_SEB⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_SEB|他停下了⟧
⟦OPT|C|set:m121_i_C11_H_SEB_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C11_H_SEB⟧
# ·

# SCENE｜我自己来说
⟦BG|BG_C11_S04|我自己来说⟧
⟦TIME|第11天⟧
⟦BGM|BGM_M121_C11|本章⟧
⟦SET|m121_scene~C11_S04⟧
旁白：你将预印的“LOVE WINNER”卡片翻成空白，Naomi点头允许你以自己的语言结束节目。
娜奥米：“You have the floor.”
艾达：“Only say what you choose.”
娜奥米：“We'll hold the shot.”
艾达：“And preserve your statement.”
# CHOICE｜你要公开要求更正，还是将争议交给律师私下处理？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C11_S04_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C11_S04_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C11_S04_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C11_S04_OTHER⟧
# ·

# CHAPTER 12｜镜头之外，是真实的你
⟦GOAL|以你选定的方式结束节目和关系|OFF CAMERA, STILL REAL⟧

# SCENE｜最后一班船
⟦BG|BG_C12_S01|最后一班船⟧
⟦TIME|第12天⟧
⟦BGM|BGM_M121_C12|本章⟧
⟦SET|m121_scene~C12_S01⟧
旁白：节目结束后，Ryan帮工作人员搬行李，Julian没有追上来戏剧性告白，而是在登船前问你是否愿意保持联系。
朱利安：“No finale speech.”
莱恩：“Just a real goodbye.”
朱利安：“Or a beginning, if you want.”
莱恩：“We'll respect either.”
# CHOICE｜你想和谁交换联系方式，还是独自离开？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C12_S01_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C12_S01_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C12_S01_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C12_S01_OTHER⟧
# ·

# SCENE｜把灯还给厨房
⟦BG|BG_C12_S02|把灯还给厨房⟧
⟦TIME|第12天⟧
⟦BGM|BGM_M121_C12|本章⟧
⟦SET|m121_scene~C12_S02⟧
旁白：Luca给工作人员做最后一份早餐，Sebastian归还借来的度假村钥匙，两人都准备回到真实工作。
卢卡：“Come by the restaurant if you like.”
塞巴斯蒂安：“My calendar isn't an offer.”
卢卡：“Mine involves pasta.”
塞巴斯蒂安：“And a fresh start.”
⟦MG|g_M121_C12_MG01|最后的钥匙⟧
# CHOICE｜你想询问未来安排，还是感谢他们然后离开？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C12_S02_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C12_S02_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C12_S02_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C12_S02_OTHER⟧
# ·
# CHOICE｜卢卡在等你点头。同意、慢一点、停下，或今晚不去。
#### A｜我同意，继续
⟦OPT|A|set:m121_i_C12_H_LUC_CONSENT_FULL⟧
⟦IF|m121_enter_C12_H_LUC⟧
旁白：他先问过你。没有你的话，画面不会往下走。这一场的同意只在这一场有效。
旁白：最后一份员工早餐做完了，Luca把厨房钥匙交还给Sebastian，然后端着一个托盘上了阁楼：两杯浓缩咖啡，两只刚出炉的牛角包，一小碟杏子酱。他的刀卷已经打包好立在门边。“Last breakfast on the island,” 他说，“I wanted it to be for you.”。你吻掉那点果酱，他的咖啡就没再碰过。
旁白：他把你重新放倒在晨光里，被单滑到你腰间，他看你的方式像第一次看见日出。“I have a ferry at nine,” 他说，嘴唇贴着你的肩，“I'm going to be very, very late.”。这一次没有暴雨，没有停电，只有安静的清晨和远处的海鸥。
旁白：他用整个人包裹着你，慢到近乎虔诚，每一个吻都落在一个具体的地方，像在记一份只属于他的食谱：耳后、手腕内侧、腰窝、膝窝。阳光一点点爬上床，照在他汗湿的背上，他贴在你耳边很低地说：“Stay with me in New York. You can say no. I'll still make you breakfast.” 你没有回答，你把他拉得更近。
旁白：镜头处理：镜头从床头托盘里一口没喝的咖啡移开，经过晨光里被单下两个起伏的轮廓，停在门边那卷打包好的刀上。
卢卡：“Last breakfast on the island. For you.”
卢卡：“That's my move.”
卢卡：“I'm going to be very, very late.”
卢卡：“You can say no. I'll still make you breakfast.”
⟦CG|CG_M121_036|双方同意之后⟧
旁白：你随时可以喊停。停了以后，这张亲密画面就不会再留在这一场里。
⟦ELSE⟧
旁白：条件还没齐，或者你之前让他停过。他没有把沉默当成同意，你们留在原来的距离。
⟦/IF⟧
#### B｜慢一点就好
⟦OPT|B|set:m121_i_C12_H_LUC_CONSENT_SLOW⟧
⟦IF|m121_enter_C12_H_LUC⟧
旁白：他停在你允许的动作上。没有亲密特写，只有你们说过的那一段。
⟦ELSE⟧
旁白：他还不能把这当成邀请。距离保持原样。
⟦/IF⟧
#### C｜停
旁白：他立刻停下，退开，不再劝。好感不会因为你喊停而下降。
⟦CG|STATE_M121_HEAT_LUC|他停下了⟧
⟦OPT|C|set:m121_i_C12_H_LUC_BOUNDARY⟧
#### D｜今晚不去
旁白：你没有进这扇门。主线照旧向前。
⟦OPT|D|set:m121_skip_C12_H_LUC⟧
# ·

# SCENE｜没有观众的一次选择
⟦BG|BG_C12_S03|没有观众的一次选择⟧
⟦TIME|第12天⟧
⟦BGM|BGM_M121_C12|本章⟧
⟦SET|m121_scene~C12_S03⟧
旁白：最后一夜的屋顶花园里，四人把各自的信物留在桌上，然后退到远处，给你完全的自由。
塞巴斯蒂安：“Whatever you choose, I will respect it.”
莱恩：“I'd like to try, properly.”
朱利安：“My answer is real.”
卢卡：“No one wins you. You choose.”
莱恩：“No cameras. No rankings. Just your choice.”
⟦MG|g_M121_C12_MG02|真实约会协议⟧
# CHOICE｜你想和谁认真发展关系、保持慢慢约会，还是不开始恋爱？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C12_S03_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C12_S03_ENGAGE⟧
#### C｜我明确同意
旁白：先征询并给等待节拍，然后加载被允许动作的CG；若拒绝则加载保持距离版本
⟦OPT|C|set:m121_i_C12_S03_CONSENT⟧
#### D｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|D|set:m121_i_C12_S03_BOUNDARY⟧
#### E｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|E|set:m121_i_C12_S03_OTHER⟧
# ·
# CHOICE｜你想和谁认真在一起？
#### A｜塞巴斯蒂安
旁白：这是你当面说的选择。缺了对方已经做完的那一步，就不会被记成结局。
⟦OPT|A|set:m121_pick_END_SEB⟧
#### B｜莱恩
旁白：这是你当面说的选择。缺了对方已经做完的那一步，就不会被记成结局。
⟦OPT|B|set:m121_pick_END_RYA⟧
#### C｜朱利安
旁白：这是你当面说的选择。缺了对方已经做完的那一步，就不会被记成结局。
⟦OPT|C|set:m121_pick_END_JUL⟧
#### D｜卢卡
旁白：这是你当面说的选择。缺了对方已经做完的那一步，就不会被记成结局。
⟦OPT|D|set:m121_pick_END_LUC⟧
#### E｜先不选某一个人
旁白：这是你当面说的选择。缺了对方已经做完的那一步，就不会被记成结局。
⟦OPT|E|set:m121_pick_END_UNSPEC⟧
# ·
# CHOICE｜如果他再问一次，你怎么回答？
#### A｜留下
⟦OPT|A|set:m121_epi_yes⟧
旁白：上一次的同意不算数。这一次才算。
⟦IF|m121_end_SEB⟧
旁白：塞巴斯蒂安等到你再次点头。
⟦CG|CG_M121_041|再次同意之后⟧
⟦/IF⟧
⟦IF|m121_end_RYA⟧
旁白：莱恩等到你再次点头。
⟦CG|CG_M121_042|再次同意之后⟧
⟦/IF⟧
⟦IF|m121_end_JUL⟧
旁白：朱利安等到你再次点头。
⟦CG|CG_M121_043|再次同意之后⟧
⟦/IF⟧
⟦IF|m121_end_LUC⟧
旁白：卢卡等到你再次点头。
⟦CG|CG_M121_044|再次同意之后⟧
⟦/IF⟧
⟦IF|m121_end_SOLO⟧
旁白：没有人发出新的邀请。
⟦/IF⟧
⟦IF|m121_end_OPEN⟧
旁白：没有排他的邀请。约会如果继续，也要分开说。
⟦/IF⟧
#### B｜这样就好
旁白：你们把距离留在已经说好的地方。
⟦OPT|B|set:m121_epi_no⟧
#### C｜停
旁白：他停住。亲密画面不会留下。
⟦OPT|C|set:m121_epi_stop⟧
# ·
# CHOICE｜如果刚才没有选定一个人
#### A｜自己走
旁白：你没有开始一段恋爱。日子还是你的。
⟦OPT|A|set:m121_pick_END_SOLO⟧
#### B｜不排他，分开约会
旁白：你说清楚了：没有隐藏的排他承诺。
⟦OPT|B|set:m121_pick_END_OPEN⟧
#### C｜维持刚才的选择
旁白：已经说定的结局保持不变。
⟦OPT|C|set:m121_pick_END_KEEP⟧
# ·

# SCENE｜一个月后的普通早晨
⟦BG|BG_C12_S04|一个月后的普通早晨⟧
⟦TIME|第12天⟧
⟦BGM|BGM_M121_C12|本章⟧
⟦SET|m121_scene~C12_S04⟧
旁白：一个月后，你在大陆的咖啡馆收到节目方已更正声明的正式邮件，手机安静放在一旁；故事根据你的感情与边界状态继续。
艾达：“The correction is on record.”
艾达：“You kept your voice.”
艾达：“What happens next belongs to you.”
艾达：“Take your time.”
# CHOICE｜你想先给谁发消息，还是合上手机享受今天？
#### A｜先问清楚
旁白：镜头靠近线索与说话人，随后拉回保持双方关系；不假设自动亲密
⟦OPT|A|set:m121_i_C12_S04_CLARIFY⟧
#### B｜我愿意试试
旁白：受邀对象做对应的真实动作，靠近前先等待; 镜头保留玩家退出路径
⟦OPT|B|set:m121_i_C12_S04_ENGAGE⟧
#### C｜先保持距离
旁白：角色立即收手或后退，停机或保持距离；取消亲密CG，采用礼貌反应资源
⟦OPT|C|set:m121_i_C12_S04_BOUNDARY⟧
#### D｜我还没想好
旁白：角色不替玩家做决定，追问一条简短澄清；若继续无关则开放安全退出
⟦OPT|D|set:m121_i_C12_S04_OTHER⟧
# ·
