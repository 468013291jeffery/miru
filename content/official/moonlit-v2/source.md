# 《月下遗忘的誓约》剧本｜MIRU v2 重构批次 1

> 仅含可执行剧情正文；人物母档、首页资料、章节总纲与小游戏完整规格见配套《作品资料.md》。

# CHAPTER 01｜雾中重逢
⟦GOAL|决定是否接受凯尔的普通邀约|决定是否接受凯尔的普通邀约⟧
⟦DONE|say|明确表达本章关键决定或行动意图|作出决定|旁白：现在轮到你决定下一步怎么做。你也可以先问清楚。⟧
⟦DONE|flag|mg_moonlit_forgotten_vow_c01_a_win|完成第一项互动|完成互动|旁白：你整理出的信息已经改变了眼前的局面。⟧

# SCENE｜老街相遇
⟦BG|bg_c01s01|老街相遇（在场主要人物入画，第一人称或过肩视角，不画玩家正脸）⟧
⟦TIME|故事当日·傍晚⟧
旁白：建立陌生重逢与重新认识的起点。你来到这里时，凯尔已经在场。他没有替你决定要不要留下，只把眼前的情况说清楚。
凯尔：“我不想替你做决定。你可以先听完，再告诉我你愿意做到哪一步。”
旁白：他把关键物件放在你看得见的位置，没有伸手替你拿。
⟦SET|moonlit_forgotten_vow_c01_scene1_seen⟧

# CHOICE｜凯尔把决定留给你
#### A｜主动了解并继续参与
⟦OPT|A|set:moonlit_forgotten_vow_c01_cooperate;凯尔_respect:+1⟧
旁白：你获得完整的现场信息，并保留下一步行动的主动权。
#### B｜先设边界，只接受有限信息
⟦OPT|B|set:moonlit_forgotten_vow_c01_boundary;凯尔_respect:+2⟧
旁白：合作范围被缩小，但双方对彼此的底线更清楚。
#### C｜暂时退出，之后再决定
⟦OPT|C|set:moonlit_forgotten_vow_c01_pause⟧
旁白：眼前行动暂停，故事保留一条不惩罚退出的回返路径。
#### D｜兜底：提出其他问题或替代方案
⟦OPT|D|set:moonlit_forgotten_vow_c01_alternative⟧
旁白：你提出的替代做法被记录；当前可行部分会进入下一场评估。
#·

# SCENE｜咖啡馆交谈
⟦BG|bg_c01s02|咖啡馆交谈（主要人物正在进行调查／活动，画面含人物）⟧
⟦TIME|稍后⟧
旁白：你们把注意力转向眼前的细节。凯尔没有急着给答案，而是等你先看。
旁白：咖啡馆墙上贴着书店的失物单，写着「深绿封套，银色月纹」。
⟦MG|mg_moonlit_forgotten_vow_c01_a⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c01_a
赢 → mg_moonlit_forgotten_vow_c01_a_win → 旁白：凯尔把失物单编号留下，玩家可自行向书店问询。
输 → mg_moonlit_forgotten_vow_c01_a_lose → 旁白：店员翻出清楚的书单，凯尔等玩家决定要不要看。
跳过 → mg_moonlit_forgotten_vow_c01_a_skip → 旁白：失物单留在墙上，凯尔继续普通交谈。
三种结果均返回本场，继续下一场或本章隐藏意图。 -->
旁白：小游戏结果只影响线索完整度或额外信息，不阻断主线。
凯尔：“你发现的东西，比我预想的更重要。”

# SCENE｜旧戒指露出
⟦BG|bg_c01s03|旧戒指露出（在场主要人物入画，动作体现本场关系状态）⟧
⟦TIME|当晚⟧
旁白：事情暂时告一段落。凯尔把第二项任务交给你，语气比刚才放松了一些。
旁白：凯尔摊开镇图，分别标出看旧物、坐下喝咖啡、还书三个公开去处。
⟦MG|mg_moonlit_forgotten_vow_c01_b⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c01_b
赢 → mg_moonlit_forgotten_vow_c01_b_win → 旁白：玩家可带走地图自行约见，凯尔不替其定时间。
输 → mg_moonlit_forgotten_vow_c01_b_lose → 旁白：凯尔只圈出玩家已问过的地点。
跳过 → mg_moonlit_forgotten_vow_c01_b_skip → 旁白：凯尔收好地图，把是否同行留给玩家。
三种结果均返回本场，继续下一场或本章隐藏意图。 -->
旁白：无论你赢、输或跳过，必要剧情信息都会保留。
凯尔：“今天先到这里。你想继续聊，还是先休息？”

# CHOICE｜离开前，你想怎样处理刚才的事
#### A｜说明自己的决定与理由
⟦OPT|A|set:moonlit_forgotten_vow_c01_decision_shared⟧
旁白：你的理由被记入共同经历，后续人物会据此调整行动。
#### B｜暂不表态，要求更多事实
⟦OPT|B|set:moonlit_forgotten_vow_c01_decision_deferred⟧
旁白：决定暂缓，下一章先提供新的事实或行动机会。
#### C｜明确拒绝当前合作
⟦OPT|C|set:moonlit_forgotten_vow_c01_decision_refused⟧
旁白：合作结束，但不会被自动判定为关系失败。
#### D｜兜底：提出其他回应
⟦OPT|D|set:moonlit_forgotten_vow_c01_decision_other⟧
旁白：系统保留你的原话，并按世界规则判断可执行部分。
#·

# CHAPTER 02｜戒指不是答案
⟦GOAL|决定是否查看戒指来源|决定是否查看戒指来源⟧
⟦DONE|say|明确表达本章关键决定或行动意图|作出决定|旁白：现在轮到你决定下一步怎么做。你也可以先问清楚。⟧
⟦DONE|flag|mg_moonlit_forgotten_vow_c02_a_win|完成第一项互动|完成互动|旁白：你整理出的信息已经改变了眼前的局面。⟧

# SCENE｜古董店
⟦BG|bg_c02s01|古董店（在场主要人物入画，第一人称或过肩视角，不画玩家正脸）⟧
⟦TIME|故事当日·傍晚⟧
旁白：确认旧物与凯尔说法之间的差异。你来到这里时，凯尔已经在场。他没有替你决定要不要留下，只把眼前的情况说清楚。
凯尔：“我不想替你做决定。你可以先听完，再告诉我你愿意做到哪一步。”
旁白：他把关键物件放在你看得见的位置，没有伸手替你拿。
⟦SET|moonlit_forgotten_vow_c02_scene1_seen⟧

# CHOICE｜凯尔把决定留给你
#### A｜主动了解并继续参与
⟦OPT|A|set:moonlit_forgotten_vow_c02_cooperate;凯尔_respect:+1⟧
旁白：你获得完整的现场信息，并保留下一步行动的主动权。
#### B｜先设边界，只接受有限信息
⟦OPT|B|set:moonlit_forgotten_vow_c02_boundary;凯尔_respect:+2⟧
旁白：合作范围被缩小，但双方对彼此的底线更清楚。
#### C｜暂时退出，之后再决定
⟦OPT|C|set:moonlit_forgotten_vow_c02_pause⟧
旁白：眼前行动暂停，故事保留一条不惩罚退出的回返路径。
#### D｜兜底：提出其他问题或替代方案
⟦OPT|D|set:moonlit_forgotten_vow_c02_alternative⟧
旁白：你提出的替代做法被记录；当前可行部分会进入下一场评估。
#·

# SCENE｜旧戒指刻痕
⟦BG|bg_c02s02|旧戒指刻痕（主要人物正在进行调查／活动，画面含人物）⟧
⟦TIME|稍后⟧
旁白：你们把注意力转向眼前的细节。凯尔没有急着给答案，而是等你先看。
旁白：古董店的拓片目录写「一道缺口、内侧半月」。
⟦MG|mg_moonlit_forgotten_vow_c02_a⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c02_a
赢 → mg_moonlit_forgotten_vow_c02_a_win → 旁白：店主留下拓片编号，第6章可用来核对刻痕来源。
输 → mg_moonlit_forgotten_vow_c02_a_lose → 旁白：店主将纹样标为未核，戒指仍归原保管人。
跳过 → mg_moonlit_forgotten_vow_c02_a_skip → 旁白：玩家不必接触戒指，店主保留目录。
三种结果均返回本场，继续下一场或本章隐藏意图。 -->
旁白：小游戏结果只影响线索完整度或额外信息，不阻断主线。
凯尔：“你发现的东西，比我预想的更重要。”

# SCENE｜凯尔承认部分隐瞒
⟦BG|bg_c02s03|凯尔承认部分隐瞒（在场主要人物入画，动作体现本场关系状态）⟧
⟦TIME|当晚⟧
旁白：事情暂时告一段落。凯尔把第二项任务交给你，语气比刚才放松了一些。
旁白：按可观察物件、本人回述、仍待验证的推断归类。
⟦MG|mg_moonlit_forgotten_vow_c02_b⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c02_b
赢 → mg_moonlit_forgotten_vow_c02_b_win → 旁白：艾玛后续可直接引用分栏，婚约意愿仍重新询问。
输 → mg_moonlit_forgotten_vow_c02_b_lose → 旁白：凯尔说明猜测不能进物证栏，待艾玛重分类。
跳过 → mg_moonlit_forgotten_vow_c02_b_skip → 旁白：只保留店主的物件记录。
三种结果均返回本场，继续下一场或本章隐藏意图。 -->
旁白：无论你赢、输或跳过，必要剧情信息都会保留。
凯尔：“今天先到这里。你想继续聊，还是先休息？”

# CHOICE｜离开前，你想怎样处理刚才的事
#### A｜说明自己的决定与理由
⟦OPT|A|set:moonlit_forgotten_vow_c02_decision_shared⟧
旁白：你的理由被记入共同经历，后续人物会据此调整行动。
#### B｜暂不表态，要求更多事实
⟦OPT|B|set:moonlit_forgotten_vow_c02_decision_deferred⟧
旁白：决定暂缓，下一章先提供新的事实或行动机会。
#### C｜明确拒绝当前合作
⟦OPT|C|set:moonlit_forgotten_vow_c02_decision_refused⟧
旁白：合作结束，但不会被自动判定为关系失败。
#### D｜兜底：提出其他回应
⟦OPT|D|set:moonlit_forgotten_vow_c02_decision_other⟧
旁白：系统保留你的原话，并按世界规则判断可执行部分。
#·

# CHAPTER 03｜森林里的脚印
⟦GOAL|决定是否与凯尔同行调查|决定是否与凯尔同行调查⟧
⟦DONE|say|明确表达本章关键决定或行动意图|作出决定|旁白：现在轮到你决定下一步怎么做。你也可以先问清楚。⟧
⟦DONE|flag|mg_moonlit_forgotten_vow_c03_a_win|完成第一项互动|完成互动|旁白：你整理出的信息已经改变了眼前的局面。⟧

# SCENE｜森林步道
⟦BG|bg_c03s01|森林步道（在场主要人物入画，第一人称或过肩视角，不画玩家正脸）⟧
⟦TIME|故事当日·傍晚⟧
旁白：第一次接触狼族世界但不强迫相信。你来到这里时，凯尔已经在场。他没有替你决定要不要留下，只把眼前的情况说清楚。
凯尔：“我不想替你做决定。你可以先听完，再告诉我你愿意做到哪一步。”
旁白：他把关键物件放在你看得见的位置，没有伸手替你拿。
⟦SET|moonlit_forgotten_vow_c03_scene1_seen⟧

# CHOICE｜凯尔把决定留给你
#### A｜主动了解并继续参与
⟦OPT|A|set:moonlit_forgotten_vow_c03_cooperate;凯尔_respect:+1⟧
旁白：你获得完整的现场信息，并保留下一步行动的主动权。
#### B｜先设边界，只接受有限信息
⟦OPT|B|set:moonlit_forgotten_vow_c03_boundary;凯尔_respect:+2⟧
旁白：合作范围被缩小，但双方对彼此的底线更清楚。
#### C｜暂时退出，之后再决定
⟦OPT|C|set:moonlit_forgotten_vow_c03_pause⟧
旁白：眼前行动暂停，故事保留一条不惩罚退出的回返路径。
#### D｜兜底：提出其他问题或替代方案
⟦OPT|D|set:moonlit_forgotten_vow_c03_alternative⟧
旁白：你提出的替代做法被记录；当前可行部分会进入下一场评估。
#·

# SCENE｜异常足迹
⟦BG|bg_c03s02|异常足迹（主要人物正在进行调查／活动，画面含人物）⟧
⟦TIME|稍后⟧
旁白：你们把注意力转向眼前的细节。凯尔没有急着给答案，而是等你先看。
旁白：把林务员的三张照片依次配给靴印、轮痕、爪痕。
⟦MG|mg_moonlit_forgotten_vow_c03_a⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c03_a
赢 → mg_moonlit_forgotten_vow_c03_a_win → 旁白：凯尔指出可确认的痕迹类型，交林务员独立记录。
输 → mg_moonlit_forgotten_vow_c03_a_lose → 旁白：凯尔把无法确认的印记留空。
跳过 → mg_moonlit_forgotten_vow_c03_a_skip → 旁白：只继续谈狼族能力边界，无人据此追踪。
三种结果均返回本场，继续下一场或本章隐藏意图。 -->
旁白：小游戏结果只影响线索完整度或额外信息，不阻断主线。
凯尔：“你发现的东西，比我预想的更重要。”

# SCENE｜狼族能力边界
⟦BG|bg_c03s03|狼族能力边界（在场主要人物入画，动作体现本场关系状态）⟧
⟦TIME|当晚⟧
旁白：事情暂时告一段落。凯尔把第二项任务交给你，语气比刚才放松了一些。
旁白：路牌注明「回镇循白色圆标」。
⟦MG|mg_moonlit_forgotten_vow_c03_b⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c03_b
赢 → mg_moonlit_forgotten_vow_c03_b_win → 旁白：玩家可按自己的安排返回，凯尔等到获得邀请才同行。
输 → mg_moonlit_forgotten_vow_c03_b_lose → 旁白：凯尔将场地导览交给玩家，然后留在原地。
跳过 → mg_moonlit_forgotten_vow_c03_b_skip → 旁白：由步道管理员指引，同行仍由玩家决定。
三种结果均返回本场，继续下一场或本章隐藏意图。 -->
旁白：无论你赢、输或跳过，必要剧情信息都会保留。
凯尔：“今天先到这里。你想继续聊，还是先休息？”

# CHOICE｜离开前，你想怎样处理刚才的事
#### A｜说明自己的决定与理由
⟦OPT|A|set:moonlit_forgotten_vow_c03_decision_shared⟧
旁白：你的理由被记入共同经历，后续人物会据此调整行动。
#### B｜暂不表态，要求更多事实
⟦OPT|B|set:moonlit_forgotten_vow_c03_decision_deferred⟧
旁白：决定暂缓，下一章先提供新的事实或行动机会。
#### C｜明确拒绝当前合作
⟦OPT|C|set:moonlit_forgotten_vow_c03_decision_refused⟧
旁白：合作结束，但不会被自动判定为关系失败。
#### D｜兜底：提出其他回应
⟦OPT|D|set:moonlit_forgotten_vow_c03_decision_other⟧
旁白：系统保留你的原话，并按世界规则判断可执行部分。
#·


# CHAPTER 04｜04｜不欢迎的客人
⟦GOAL|面对阿尔德里奇家族挑衅，决定是否接受家族审视。|面对阿尔德里奇家族挑衅，决定是否接受家族审视。⟧
⟦DONE|say|面对阿尔德里奇家族挑衅，决定是否接受家族审视。|完成本章决定|你可以先核实、协商或暂停，不必接受任何人的安排。⟧
⟦DONE|flag|mg_moonlit_forgotten_vow_c04_a_win|取得额外线索|取得线索|这条线索会在后续调查中保留。⟧
## SCENE｜庄园宴会厅
⟦BG|bg_c04s01|庄园宴会厅（主要在场人物入画；角色外形沿用母档；不画玩家正脸）⟧
⟦TIME|周五夜⟧
旁白：罗南举杯欢迎“继承人找回来的陌生客人”。有人议论婚约，有人把你当家族资产。凯尔扣住椅背，却先看向你，等你决定是否留下。
凯尔：“她不是家谱里的一行字。再说一次，我就把宴会变成家族会议。”
⟦SET|moonlit_forgotten_vow_c04_event_revealed⟧
## SCENE｜玻璃温室
⟦BG|bg_c04s02|玻璃温室（主要在场人物入画；角色外形沿用母档；不画玩家正脸）⟧
⟦TIME|稍后⟧
旁白：塞拉承认家族曾把婚约当政治保障，且封印最初由谁提出，凯尔也未必知道。
塞拉：“他爱你是真的。但他记得的版本，不一定完整。”
旁白：塞拉摊开宴会席卡，把堂亲、家族顾问、受邀来客依次配到名字。
⟦MG|mg_moonlit_forgotten_vow_c04_a⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c04_a
赢 → mg_moonlit_forgotten_vow_c04_a_win → 旁白：塞拉出示来客单，第5章无须把宴会邀请理解为权限。
输 → mg_moonlit_forgotten_vow_c04_a_lose → 旁白：先核对席卡，席位说法暂不作为家族立场。
跳过 → mg_moonlit_forgotten_vow_c04_a_skip → 旁白：塞拉口头说明各自职责，不留下玩家侧记录。
三种结果均返回本场，继续下一场或本章隐藏意图。 -->
## SCENE｜庄园露台
⟦BG|bg_c04s03|庄园露台（主要在场人物入画；角色外形沿用母档；不画玩家正脸）⟧
⟦TIME|深夜⟧
旁白：罗南提出交易：只要你公开否认婚约，他就交出封印档案。凯尔怒意上涌，却没有替你拒绝。
凯尔：“我想把他扔进池子。但这次，我不会替你回答。”
旁白：露台便签注明「来客可拒绝答复，委托须本人确认」。
⟦MG|mg_moonlit_forgotten_vow_c04_b⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c04_b
赢 → mg_moonlit_forgotten_vow_c04_b_win → 旁白：凯尔让罗南收回要求当场回答的条件。
输 → mg_moonlit_forgotten_vow_c04_b_lose → 旁白：凯尔请塞拉重读便签，争议暂缓。
跳过 → mg_moonlit_forgotten_vow_c04_b_skip → 旁白：不回应挑战，玩家可选择离开露台。
三种结果均返回本场，继续下一场或本章隐藏意图。 -->
## CHOICE｜本章决定
### A｜接受档案交换但不承诺婚约
⟦OPT|A|set:moonlit_forgotten_vow_c04_a⟧
旁白：你的决定会影响后续人物行动、可获得的信息或关系走向。
### B｜要求塞拉先说明家族立场
⟦OPT|B|set:moonlit_forgotten_vow_c04_b⟧
旁白：你的决定会影响后续人物行动、可获得的信息或关系走向。
### C｜公开拒绝被家族审视
⟦OPT|C|set:moonlit_forgotten_vow_c04_c⟧
旁白：你的决定会影响后续人物行动、可获得的信息或关系走向。
### D｜提出其他方案
⟦OPT|D|set:moonlit_forgotten_vow_c04_custom⟧
旁白：记录你的原话；若方案可行，按世界规则进入对应路径，否则说明限制并提供替代行动。
#·

# CHAPTER 05｜05｜医生的记录
⟦GOAL|厘清记忆缺失的医学表现与超自然封印的边界。|厘清记忆缺失的医学表现与超自然封印的边界。⟧
⟦DONE|say|厘清记忆缺失的医学表现与超自然封印的边界。|完成本章决定|你可以先核实、协商或暂停，不必接受任何人的安排。⟧
⟦DONE|flag|mg_moonlit_forgotten_vow_c05_a_win|取得额外线索|取得线索|这条线索会在后续调查中保留。⟧
## SCENE｜银松镇诊所
⟦BG|bg_c05s01|银松镇诊所（主要在场人物入画；角色外形沿用母档；不画玩家正脸）⟧
⟦TIME|次日上午⟧
<!-- 早章小游戏回收：仅处理已结算且命中的结果；无旗标不补写成功。授权限制优先。
mg_moonlit_forgotten_vow_c04_a_win → 塞拉出示来客单，第5章无须把宴会邀请理解为权限。
-->
旁白：艾玛拒绝听凯尔代你描述症状，要求由你本人回答。她指出凯尔对某些时间点记得过于精确，像背过说明。
艾玛：“我不诊断命运。我只记录你现在经历的事情。”
⟦SET|moonlit_forgotten_vow_c05_event_revealed⟧
## SCENE｜诊疗档案室
⟦BG|bg_c05s02|诊疗档案室（主要在场人物入画；角色外形沿用母档；不画玩家正脸）⟧
⟦TIME|中午⟧
旁白：旧病历显示你曾有短时失语和偏头痛，但无永久性认知损伤记录。两页病历被替换，签名不是艾玛的。
凯尔：“我以为你平安醒来就够了。看来有人连这件事都替我们决定。”
旁白：艾玛只展示有权查阅的版本标记。
⟦MG|mg_moonlit_forgotten_vow_c05_a⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c05_a
赢 → mg_moonlit_forgotten_vow_c05_a_win → 旁白：第7章可独立比对诊所索引与家族记录日期。
输 → mg_moonlit_forgotten_vow_c05_a_lose → 旁白：艾玛重新核签，先保留替换疑点。
跳过 → mg_moonlit_forgotten_vow_c05_a_skip → 旁白：艾玛封存私页，仅提供获准的索引概要。
三种结果均返回本场，继续下一场或本章隐藏意图。 -->
## SCENE｜诊所后院
⟦BG|bg_c05s03|诊所后院（主要在场人物入画；角色外形沿用母档；不画玩家正脸）⟧
⟦TIME|下午⟧
旁白：艾玛承认受家族委托保管病历，却未参与封印。她保存原始索引，把是否查看交给你。
艾玛：“你有权知道，也有权今天什么都不看。”
旁白：把材料分入可核事实、医生观察、尚待验证解释。
⟦MG|mg_moonlit_forgotten_vow_c05_b⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c05_b
赢 → mg_moonlit_forgotten_vow_c05_b_win → 旁白：艾玛在后续证词中只引用前两类允许公开的部分。
输 → mg_moonlit_forgotten_vow_c05_b_lose → 旁白：她标出混列，先不向家族转送。
跳过 → mg_moonlit_forgotten_vow_c05_b_skip → 旁白：只保留诊疗范围，隐私页不开放。
三种结果均返回本场，继续下一场或本章隐藏意图。 -->
## CHOICE｜本章决定
### A｜查看并复制原始索引
⟦OPT|A|set:moonlit_forgotten_vow_c05_a⟧
旁白：你的决定会影响后续人物行动、可获得的信息或关系走向。
### B｜只看身体状况相关部分
⟦OPT|B|set:moonlit_forgotten_vow_c05_b⟧
旁白：你的决定会影响后续人物行动、可获得的信息或关系走向。
### C｜暂时不查看，先稳定生活
⟦OPT|C|set:moonlit_forgotten_vow_c05_c⟧
旁白：你的决定会影响后续人物行动、可获得的信息或关系走向。
### D｜提出其他方案
⟦OPT|D|set:moonlit_forgotten_vow_c05_custom⟧
旁白：记录你的原话；若方案可行，按世界规则进入对应路径，否则说明限制并提供替代行动。
#·

# CHAPTER 06｜06｜湖畔誓约石
⟦GOAL|发现誓约石记录与凯尔私人回忆并不完全一致。|发现誓约石记录与凯尔私人回忆并不完全一致。⟧
⟦DONE|say|发现誓约石记录与凯尔私人回忆并不完全一致。|完成本章决定|你可以先核实、协商或暂停，不必接受任何人的安排。⟧
⟦DONE|flag|mg_moonlit_forgotten_vow_c06_a_win|取得额外线索|取得线索|这条线索会在后续调查中保留。⟧
## SCENE｜月湖步道
⟦BG|bg_c06s01|月湖步道（主要在场人物入画；角色外形沿用母档；不画玩家正脸）⟧
⟦TIME|黄昏⟧
<!-- 早章小游戏回收：仅处理已结算且命中的结果；无旗标不补写成功。授权限制优先。
mg_moonlit_forgotten_vow_c02_a_win → 店主留下拓片编号，第6章可用来核对刻痕来源。
-->
旁白：凯尔带你到誓约石旁，却没要求触碰。石面两道交叠纹路有一道断裂。他说那是订婚印记，却不再替你解释当时为何微笑。
凯尔：“我记得你笑过。但我不该替你解释那时为什么笑。”
⟦SET|moonlit_forgotten_vow_c06_event_revealed⟧
## SCENE｜湖畔石台
⟦BG|bg_c06s02|湖畔石台（主要在场人物入画；角色外形沿用母档；不画玩家正脸）⟧
⟦TIME|稍后⟧
旁白：塞拉带来旧仪式记录：誓约并非永久绑定，双方可在特定条件下共同确认；“自愿撤回”条款被后人划掉。
塞拉：“誓约最初是承诺，不是枷锁。有人后来需要它变成枷锁。”
旁白：石上三段由刻痕箭头连成「说明、本人确认、见证登记」。
⟦MG|mg_moonlit_forgotten_vow_c06_a⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c06_a
赢 → mg_moonlit_forgotten_vow_c06_a_win → 旁白：获得撤回条款的索引线索，第13章可用它核对书店副本。
输 → mg_moonlit_forgotten_vow_c06_a_lose → 旁白：艾玛只描下符号，不把顺序当作已认证文本。
跳过 → mg_moonlit_forgotten_vow_c06_a_skip → 旁白：保持静态观察，不触碰誓约石。
三种结果均返回本场，继续下一场或本章隐藏意图。 -->
## SCENE｜林间观测亭
⟦BG|bg_c06s03|林间观测亭（主要在场人物入画；角色外形沿用母档；不画玩家正脸）⟧
⟦TIME|夜⟧
旁白：凯尔承认自己知道撤回条款，却没告诉你，因为害怕你离开。他把记录放在你手边，不要求原谅。
凯尔：“我想留住你，所以隐瞒了你可以离开的路。这是我的错。”
旁白：按单方提出撤回、双方另签、未授权时停留三类配对。
⟦MG|mg_moonlit_forgotten_vow_c06_b⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c06_b
赢 → mg_moonlit_forgotten_vow_c06_b_win → 旁白：凯尔把三个条件分开，第8章可逐项谈当前边界。
输 → mg_moonlit_forgotten_vow_c06_b_lose → 旁白：艾玛封存争议条款，暂不推动仪式。
跳过 → mg_moonlit_forgotten_vow_c06_b_skip → 旁白：以没有新增权限处理，谈话只讨论现状。
三种结果均返回本场，继续下一场或本章隐藏意图。 -->
## CHOICE｜本章决定
### A｜要求凯尔解释当年隐瞒
⟦OPT|A|set:moonlit_forgotten_vow_c06_a⟧
旁白：你的决定会影响后续人物行动、可获得的信息或关系走向。
### B｜先独立核验誓约记录
⟦OPT|B|set:moonlit_forgotten_vow_c06_b⟧
旁白：你的决定会影响后续人物行动、可获得的信息或关系走向。
### C｜离开湖畔，暂停仪式讨论
⟦OPT|C|set:moonlit_forgotten_vow_c06_c⟧
旁白：你的决定会影响后续人物行动、可获得的信息或关系走向。
### D｜提出其他方案
⟦OPT|D|set:moonlit_forgotten_vow_c06_custom⟧
旁白：记录你的原话；若方案可行，按世界规则进入对应路径，否则说明限制并提供替代行动。
#·

# CHAPTER 07｜07｜塞拉的半句话
⟦GOAL|揭开塞拉隐瞒的封印起因，并决定是否继续相信她。|揭开塞拉隐瞒的封印起因，并决定是否继续相信她。⟧
⟦DONE|say|揭开塞拉隐瞒的封印起因，并决定是否继续相信她。|完成本章决定|你可以先核实、协商或暂停，不必接受任何人的安排。⟧
⟦DONE|flag|mg_moonlit_forgotten_vow_c07_a_win|取得额外线索|取得线索|这条线索会在后续调查中保留。⟧
## SCENE｜家族档案室
⟦BG|bg_c07s01|家族档案室（主要在场人物入画；角色外形沿用母档；不画玩家正脸）⟧
⟦TIME|清晨⟧
<!-- 早章小游戏回收：仅处理已结算且命中的结果；无旗标不补写成功。授权限制优先。
mg_moonlit_forgotten_vow_c05_a_win → 第7章可独立比对诊所索引与家族记录日期。
-->
旁白：塞拉承认自己当年签过封印见证书，但她说封印不是为了控制你，而是为了阻止一次狼族血脉暴走。凯尔第一次对她失去礼貌。
凯尔：“你看着我找了她这么多年，却让我以为所有决定都是她做的。”
⟦SET|moonlit_forgotten_vow_c07_event_revealed⟧
## SCENE｜档案夹层
⟦BG|bg_c07s02|档案夹层（主要在场人物入画；角色外形沿用母档；不画玩家正脸）⟧
⟦TIME|上午⟧
旁白：你找到两份互相矛盾的记录：一份写着封印由你主动提出，另一份却有塞拉的代签痕迹。塞拉承认曾替你签署一项紧急授权。
塞拉：“我救了你一次，也替你做了不该替你做的决定。我不会要求你感谢我。”
旁白：把两份记录与待核附页按档案夹标签「首卷、续页、附录」排好。
⟦MG|mg_moonlit_forgotten_vow_c07_a⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c07_a
赢 → mg_moonlit_forgotten_vow_c07_a_win → 旁白：第8章的见证书可分项注明两份冲突记录。
输 → mg_moonlit_forgotten_vow_c07_a_lose → 旁白：塞拉的说明单列为证词，原页待艾玛核印。
跳过 → mg_moonlit_forgotten_vow_c07_a_skip → 旁白：文档封存，未核的页序不引用。
三种结果均返回本场，继续下一场或本章隐藏意图。 -->
## SCENE｜庄园旧书房
⟦BG|bg_c07s03|庄园旧书房（主要在场人物入画；角色外形沿用母档；不画玩家正脸）⟧
⟦TIME|傍晚⟧
旁白：罗南带来第三份记录，证明当年暴走并非凯尔造成，而是家族长老试图提前激活誓约。塞拉隐瞒，是因为她曾协助长老会。
凯尔：“原来我一直恨错了人。可这不代表我当年没有伤害你。”
旁白：要核对是谁提前启动封印，哪项能独立与原簿对照。
⟦MG|mg_moonlit_forgotten_vow_c07_b⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c07_b
赢 → mg_moonlit_forgotten_vow_c07_b_win → 旁白：第9章塔内优先查编号对应的启动栏。
输 → mg_moonlit_forgotten_vow_c07_b_lose → 旁白：由艾玛先检验来源，责任不提前定案。
跳过 → mg_moonlit_forgotten_vow_c07_b_skip → 旁白：只在保管流程中保存第三份记录，仍可先设边界。
三种结果均返回本场，继续下一场或本章隐藏意图。 -->
## CHOICE｜本章决定
### A｜要求塞拉交出完整见证书
⟦OPT|A|set:moonlit_forgotten_vow_c07_a⟧
旁白：你的决定会影响后续人物行动、可获得的信息或关系走向。
### B｜先核验罗南带来的第三份记录
⟦OPT|B|set:moonlit_forgotten_vow_c07_b⟧
旁白：你的决定会影响后续人物行动、可获得的信息或关系走向。
### C｜让凯尔暂时退出调查，避免冲突升级
⟦OPT|C|set:moonlit_forgotten_vow_c07_c⟧
旁白：你的决定会影响后续人物行动、可获得的信息或关系走向。
### D｜提出其他方案
⟦OPT|D|set:moonlit_forgotten_vow_c07_custom⟧
旁白：记录你的原话；若方案可行，按世界规则进入对应路径，否则说明限制并提供替代行动。
#·


## CHAPTER 08｜你不欠他的
⟦GOAL|决定是否继续与凯尔共同调查|Decide whether to investigate with Kael⟧
⟦DONE|say|决定是否继续与凯尔共同调查|重订调查边界|旁白：可以用你自己的话说明你的决定，也可以请对方讲清条件。⟧


## SCENE｜森林小屋前廊
⟦BG|bg_c08s01|凯尔、塞拉与搁在门外的见证书，过肩；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|次日清晨⟧
<!-- 早章小游戏回收：仅处理已结算且命中的结果；无旗标不补写成功。授权限制优先。
mg_moonlit_forgotten_vow_c06_b_win → 凯尔把三个条件分开，第8章可逐项谈当前边界。
mg_moonlit_forgotten_vow_c07_a_win → 第8章的见证书可分项注明两份冲突记录。
-->
<!-- 同时读取较早的边界和线索状态；以下命中项可并行，但以更新、更严格的授权为准。
moonlit_forgotten_vow_c04_c → 不安排家族在场审视玩家；塞拉只在获准范围内递交材料。
moonlit_forgotten_vow_c05_b → 艾玛只引用身体状况相关病历，其余页封存。
moonlit_forgotten_vow_c06_c → 保留仪式暂停状态；任何静态查阅都不恢复仪式。
-->
<!-- 按第7章最后提交的有效决定选播一条；旧档缺值时沿用尚未同意进一步披露的默认线。
moonlit_forgotten_vow_c07_a → 塞拉带来完整见证书，自己的代签章也留在封套里。
moonlit_forgotten_vow_c07_b → 罗南请艾玛先核验第三份记录，再由塞拉打开见证书。
moonlit_forgotten_vow_c07_c → 凯尔先交见证书给艾玛，玩家未邀请时他不进入门廊。场景改用塞拉和艾玛，凯尔的对话改由艾玛交付其具名书信。
moonlit_forgotten_vow_c07_custom → 艾玛复述已经确认的自拟边界，无额外授权时只展示静态目录。
-->
旁白：屋里烧了火，凯尔自己站在门廊。他给见证书罩了一块干毛巾，没有把它拿进屋。
凯尔：“我想给你看我当时承诺过什么。你可以把我现在说的也放进去，一条条核对。”
塞拉：“先看签字的两栏。你并非每一栏都签过。”
⟦MG|mg_moonlit_forgotten_vow_c08_a⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c08_a：赢／旁白：凯尔把允诺交艾玛见证，塔中可由玩家直接叫停。 输／旁白：塞拉重读条款，钥匙暂放艾玛处。 跳过／旁白：凯尔退回林道，联系改由艾玛转达。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜小屋壁炉旁
⟦BG|bg_c08s02|艾玛在炉旁摊开纸卡，凯尔留在门外虚景；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|上午⟧
旁白：艾玛把关于封印的纸放在最远的桌角，把凳子拉到离门最近的地方。
艾玛：“现在如果你说停，我们就结束这一段。包括任何人已经付出了代价的情况。”
⟦MG|mg_moonlit_forgotten_vow_c08_b⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c08_b：赢／旁白：艾玛立即登记撤回口令并可现场见证。 输／旁白：艾玛重置桌面，塔中只允许静态查阅。 跳过／旁白：艾玛代为盖上誓物，主动测试须另行预约。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜森林小屋门槛
⟦BG|bg_c08s03|凯尔在门槛外放下两把钥匙，晨光转暖；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|临近中午⟧
⟦CG|cg_c08s03_01|凯尔在门槛外放下两把钥匙，晨光转暖；高光切换；玩家不露正脸⟧
凯尔：“我很想听见你还记得我。昨天我差点把这句话说成了我要你想起来。那时候我也这么干过。”
旁白：他把一把钥匙留在门外，另一把推给艾玛，等她数清。

## CHOICE｜隐藏意图
### A｜继续共同调查但保留叫停权
⟦OPT|A|set:moonlit_forgotten_vow_c08_a⟧
<!-- player_intent: 明确表达「继续共同调查但保留叫停权」或同义行动。effects: 凯尔只在获邀时进入观察区。 -->
旁白：凯尔只在获邀时进入观察区。
### B｜独立调查，由艾玛陪同
⟦OPT|B|set:moonlit_forgotten_vow_c08_b⟧
<!-- player_intent: 明确表达「独立调查，由艾玛陪同」或同义行动。effects: 艾玛接管钥匙，凯尔另交书面证词。 -->
旁白：艾玛接管钥匙，凯尔另交书面证词。
### C｜暂停私人联系与试验
⟦OPT|C|set:moonlit_forgotten_vow_c08_c⟧
<!-- player_intent: 明确表达「暂停私人联系与试验」或同义行动。effects: 只做静态目录核对，不安排玩家到场。 -->
旁白：只做静态目录核对，不安排玩家到场。
### D｜澄清、拒答或其他方案
⟦OPT|D|set:moonlit_forgotten_vow_c08_custom⟧
<!-- player_intent: 答非所问、拒绝表态、意图仍不清楚，或提出其余方案。先复述实际意图并澄清一次；可行且合规的自拟行动经确认后记录原话，遵守同样的隐私、授权与退出边界；无确认时采用暂缓。 -->
旁白：当事人先将手边材料收好，等你说明愿意授权的范围。你可以把自己的决定留到以后。

旁白：塞拉掀开书上的防潮纸。封印一栏写着两项支出，第二项的承担人是凯尔。

## CHAPTER 09｜封印的代价
⟦GOAL|决定封印只做静态查阅还是有限验证|Decide how far to verify the seal⟧
⟦DONE|say|决定封印只做静态查阅还是有限验证|设定核验上限|旁白：可以用你自己的话说明你的决定，也可以请对方讲清条件。⟧


## SCENE｜观测塔底层
⟦BG|bg_c09s01|艾玛、塞拉与墙上三枚标记，玩家过肩；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|次日午前⟧
<!-- 早章小游戏回收：仅处理已结算且命中的结果；无旗标不补写成功。授权限制优先。
mg_moonlit_forgotten_vow_c07_b_win → 第9章塔内优先查编号对应的启动栏。
-->
<!-- 先按上章意图执行对应进场与授权限制；若玩家未到场，以下对话作为角色行动切镜，玩家只收到允许范围内的纪要，不代写玩家在场或回应。
moonlit_forgotten_vow_c08_a → 观测塔门外由凯尔提供记忆旁证。
moonlit_forgotten_vow_c08_b → 观测塔由艾玛主持，凯尔留在界外。
moonlit_forgotten_vow_c08_c → 观测塔结果由艾玛交可选择阅读的摘要。
moonlit_forgotten_vow_c08_custom → 观测塔结果由艾玛交可选择阅读的摘要。 自拟方案只使用已明确获准的材料。
-->
<!-- 随上章游戏状态选播其在作品资料中约定的本章后果，合并互不冲突的后果；两项结果同时涉及同一份文件时，以更严格的访问权限为准。
mg_moonlit_forgotten_vow_c08_a_win / mg_moonlit_forgotten_vow_c08_a_lose / mg_moonlit_forgotten_vow_c08_a_skip
mg_moonlit_forgotten_vow_c08_b_win / mg_moonlit_forgotten_vow_c08_b_lose / mg_moonlit_forgotten_vow_c08_b_skip
-->
旁白：低处的窗开了一掌宽。塞拉把从见证书描下来的两个符号贴在墙上，第三个符号正对脚下的门槛。
塞拉：“我曾把代价写成保护。原件分三栏。你可以先看符号旁的小字。”
⟦MG|mg_moonlit_forgotten_vow_c09_a⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c09_a：赢／旁白：抄出三栏完整索引，议会上能展示双向责任。 输／旁白：塞拉重核原文，议会上只先展示日期。 跳过／旁白：艾玛保管拓页，未认证解读不进议案。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜观测塔中层
⟦BG|bg_c09s02|艾玛守住阶梯，凯尔在获邀路线入画；独立路线由塞拉入画；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|近午⟧
旁白：塔里一块旧木牌记着，誓约封存切断你对那段关系的记忆，还把一部分残响留给见证人。凯尔的具名收条夹在牌后。
艾玛：“它记下了谁承担过什么。现在我们自己安排验证的限度。”
⟦MG|mg_moonlit_forgotten_vow_c09_b⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c09_b：赢／旁白：先锁定低风险记录，议会收到艾玛的限制建议。 输／旁白：核验搁置，议会先收到风险未分级通知。 跳过／旁白：采用静态查阅默认线，由艾玛说明限制。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜塔外风口
⟦BG|bg_c09s03|塞拉把收条按在栏杆，凯尔仅在获邀路线出现；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|正午⟧
⟦CG|cg_c09s03_01|塞拉把收条按在栏杆，凯尔仅在获邀路线出现；高光切换；玩家不露正脸⟧
旁白：塞拉把自己的紧急授权章摆在栏杆上，没有盖下去。
塞拉：“我当时拿这个章替你签。今天这张牌要怎么用，你可以只给条界线。我负责告诉议会。”

## CHOICE｜隐藏意图
### A｜只授权静态整理
⟦OPT|A|set:moonlit_forgotten_vow_c09_a⟧
<!-- player_intent: 明确表达「只授权静态整理」或同义行动。effects: 封存残响，提交拓页。 -->
旁白：封存残响，提交拓页。
### B｜允许由艾玛见证有限核验
⟦OPT|B|set:moonlit_forgotten_vow_c09_b⟧
<!-- player_intent: 明确表达「允许由艾玛见证有限核验」或同义行动。effects: 仅隔栏记录且可立即中止。 -->
旁白：仅隔栏记录且可立即中止。
### C｜停止涉及个人记忆的核验
⟦OPT|C|set:moonlit_forgotten_vow_c09_c⟧
<!-- player_intent: 明确表达「停止涉及个人记忆的核验」或同义行动。effects: 封存个人材料，艾玛提交权限说明。 -->
旁白：封存个人材料，艾玛提交权限说明。
### D｜澄清、拒答或其他方案
⟦OPT|D|set:moonlit_forgotten_vow_c09_custom⟧
<!-- player_intent: 答非所问、拒绝表态、意图仍不清楚，或提出其余方案。先复述实际意图并澄清一次；可行且合规的自拟行动经确认后记录原话，遵守同样的隐私、授权与退出边界；无确认时采用暂缓。 -->
旁白：当事人先将手边材料收好，等你说明愿意授权的范围。你可以把自己的决定留到以后。

旁白：罗南从塔下递来议程。议案把凯尔的继承资格和见证书移交写在同一项里。

## CHAPTER 10｜家族的继承人
⟦GOAL|决定是否以及怎样介入议会|Decide whether and how to take part in the council⟧
⟦DONE|say|决定是否以及怎样介入议会|选择议会席位|旁白：可以用你自己的话说明你的决定，也可以请对方讲清条件。⟧


## SCENE｜庄园议事厅旁席
⟦BG|bg_c10s01|罗南、凯尔、塞拉分坐长桌三侧；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|当晚⟧
<!-- 先按上章意图执行对应进场与授权限制；若玩家未到场，以下对话作为角色行动切镜，玩家只收到允许范围内的纪要，不代写玩家在场或回应。
moonlit_forgotten_vow_c09_a → 议会只能审公开文本。
moonlit_forgotten_vow_c09_b → 议会多一份注明限度的观察书。
moonlit_forgotten_vow_c09_c → 议会只表决保管权。
moonlit_forgotten_vow_c09_custom → 议会只表决保管权。 自拟方案只使用已明确获准的材料。
-->
<!-- 随上章游戏状态选播其在作品资料中约定的本章后果，合并互不冲突的后果；两项结果同时涉及同一份文件时，以更严格的访问权限为准。
mg_moonlit_forgotten_vow_c09_a_win / mg_moonlit_forgotten_vow_c09_a_lose / mg_moonlit_forgotten_vow_c09_a_skip
mg_moonlit_forgotten_vow_c09_b_win / mg_moonlit_forgotten_vow_c09_b_lose / mg_moonlit_forgotten_vow_c09_b_skip
-->
旁白：罗南请书记念议程。第三行念到一半，凯尔把空茶盏翻扣在桌面上。
凯尔：“档案移交可以审。我的继承席你们也可以审。两份决议，分开签。”
罗南：“先给我一份排得通的议程，我可以让书记念完。”
⟦MG|mg_moonlit_forgotten_vow_c10_a⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c10_a：赢／旁白：两案分列，公开纪要保留凯尔的反对意见。 输／旁白：罗南先撤回合并案，分列动议延至复会。 跳过／旁白：塞拉提交书面异议，会议只做临时保管决定。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜议事厅凭证桌
⟦BG|bg_c10s02|塞拉与罗南之间摆三份署名文件，桌面近景；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|夜间⟧
罗南：“没定继承人，镇上谁对年底的保管账负责？”
塞拉：“先找这三份纸是谁写的。找到名字，就知道该问哪一件事。”
⟦MG|mg_moonlit_forgotten_vow_c10_b⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c10_b：赢／旁白：纪要分列各人责任，礼拜堂原始副联可公开查验。 输／旁白：书记需重核签名，旧副联只能在其面前查验。 跳过／旁白：各人自行签认，旧副联由塞拉代管至查验。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜庄园议事厅门边
⟦BG|bg_c10s03|凯尔将家族议席徽章推向书记，罗南伸手又收回；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|散会前⟧
⟦CG|cg_c10s03_01|凯尔将家族议席徽章推向书记，罗南伸手又收回；高光切换；玩家不露正脸⟧
旁白：凯尔从外套上拆下徽章，把背面也给书记看，然后请求将自己从档案表决中除名。
凯尔：“簿上该记我的动作，别写她的婚约。你想说话，书记听得到。你想在门外等，门可以开着。”

## CHOICE｜隐藏意图
### A｜当面发言要求独立保管
⟦OPT|A|set:moonlit_forgotten_vow_c10_a⟧
<!-- player_intent: 明确表达「当面发言要求独立保管」或同义行动。effects: 书记记录玩家限定的公开声明。 -->
旁白：书记记录玩家限定的公开声明。
### B｜通过艾玛提交书面边界
⟦OPT|B|set:moonlit_forgotten_vow_c10_b⟧
<!-- player_intent: 明确表达「通过艾玛提交书面边界」或同义行动。effects: 只宣读授权范围，私人经历留白。 -->
旁白：只宣读授权范围，私人经历留白。
### C｜离席不提供个人陈述
⟦OPT|C|set:moonlit_forgotten_vow_c10_c⟧
<!-- player_intent: 明确表达「离席不提供个人陈述」或同义行动。effects: 议会保留空席，凯尔仍独立回避。 -->
旁白：议会保留空席，凯尔仍独立回避。
### D｜澄清、拒答或其他方案
⟦OPT|D|set:moonlit_forgotten_vow_c10_custom⟧
<!-- player_intent: 答非所问、拒绝表态、意图仍不清楚，或提出其余方案。先复述实际意图并澄清一次；可行且合规的自拟行动经确认后记录原话，遵守同样的隐私、授权与退出边界；无确认时采用暂缓。 -->
旁白：当事人先将手边材料收好，等你说明愿意授权的范围。你可以把自己的决定留到以后。

旁白：书记对照礼拜堂旧簿，发现凯尔的回执在钟响前就已经签了。

## CHAPTER 11｜那段被删去的夜晚
⟦GOAL|决定如何处理凯尔当年的选择与责任|Decide how to address Kael’s responsibility that night⟧
⟦DONE|say|决定如何处理凯尔当年的选择与责任|确认旧夜责任|旁白：可以用你自己的话说明你的决定，也可以请对方讲清条件。⟧


## SCENE｜旧礼拜堂前厅
⟦BG|bg_c11s01|凯尔、塞拉与停摆的钟，三份旧凭证在木台上；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|次日晚⟧
<!-- 先按上章意图执行对应进场与授权限制；若玩家未到场，以下对话作为角色行动切镜，玩家只收到允许范围内的纪要，不代写玩家在场或回应。
moonlit_forgotten_vow_c10_a → 礼拜堂由书记作证并开放公开副联。
moonlit_forgotten_vow_c10_b → 礼拜堂查验由艾玛代为见证。
moonlit_forgotten_vow_c10_c → 礼拜堂只提供可选的非个人材料。
moonlit_forgotten_vow_c10_custom → 礼拜堂只提供可选的非个人材料。 自拟方案只使用已明确获准的材料。
-->
<!-- 随上章游戏状态选播其在作品资料中约定的本章后果，合并互不冲突的后果；两项结果同时涉及同一份文件时，以更严格的访问权限为准。
mg_moonlit_forgotten_vow_c10_a_win / mg_moonlit_forgotten_vow_c10_a_lose / mg_moonlit_forgotten_vow_c10_a_skip
mg_moonlit_forgotten_vow_c10_b_win / mg_moonlit_forgotten_vow_c10_b_lose / mg_moonlit_forgotten_vow_c10_b_skip
-->
旁白：钟绳尽头是个打不开的结。塞拉借着手灯念出看守的日志，凯尔从最下面抽出自己的收条。
凯尔：“我签得早。那时候我以为只要我先把能承受的接过来，你就不用听他们争了。”
⟦MG|mg_moonlit_forgotten_vow_c11_a⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c11_a：赢／旁白：三份带时序的副本都可在第12章并列核对。 输／旁白：书记补抄日期，第12章先核时序。 跳过／旁白：艾玛带走无时序的权限表，第12章从签字来源查起。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜礼拜堂侧龛
⟦BG|bg_c11s02|艾玛与凯尔隔着半扇磨砂门，烛光照旧页；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|夜深⟧
旁白：隔门传出钟绳碰木框的声音。艾玛朝灰尘里一道新擦痕指了指。没有人把声音记作你的回忆。
艾玛：“我们手里有看守写的记录、凯尔刚说的话，还有现在听见的响动。各有各的来处。”
⟦MG|mg_moonlit_forgotten_vow_c11_b⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c11_b：赢／旁白：见证簿三栏分开，第12章可直接查证词冲突。 输／旁白：艾玛把混引栏划掉，第12章逐项补来源。 跳过／旁白：艾玛只录声音出现，不据此解释任何记忆。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜礼拜堂外台阶
⟦BG|bg_c11s03|凯尔蹲在台阶上摊平收条，艾玛站在灯下；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|深夜⟧
⟦CG|cg_c11s03_01|凯尔蹲在台阶上摊平收条，艾玛站在灯下；高光切换；玩家不露正脸⟧
旁白：凯尔把自己签过的收条朝你展开。在经手人一栏旁，他亲手补了一行说明，说当时在场的人没有等到你的决定。
凯尔：“长老发动了它。塞拉替你签了。我也以为自己能说什么对你最好。你可以让我回答，也可以把这张纸带走，等你自己想问的时候再问。”

## CHOICE｜隐藏意图
### A｜要求凯尔具名补正
⟦OPT|A|set:moonlit_forgotten_vow_c11_a⟧
<!-- player_intent: 明确表达「要求凯尔具名补正」或同义行动。effects: 凯尔留下签字并同意在独立见证下回答。 -->
旁白：凯尔留下签字并同意在独立见证下回答。
### B｜只同意独立验证，暂缓关系回应
⟦OPT|B|set:moonlit_forgotten_vow_c11_b⟧
<!-- player_intent: 明确表达「只同意独立验证，暂缓关系回应」或同义行动。effects: 艾玛封存收条并分开保管回忆资料。 -->
旁白：艾玛封存收条并分开保管回忆资料。
### C｜退出记忆恢复并保留隐私
⟦OPT|C|set:moonlit_forgotten_vow_c11_c⟧
<!-- player_intent: 明确表达「退出记忆恢复并保留隐私」或同义行动。effects: 艾玛登记停止，凯尔不再发出关系邀约。 -->
旁白：艾玛登记停止，凯尔不再发出关系邀约。
### D｜澄清、拒答或其他方案
⟦OPT|D|set:moonlit_forgotten_vow_c11_custom⟧
<!-- player_intent: 答非所问、拒绝表态、意图仍不清楚，或提出其余方案。先复述实际意图并澄清一次；可行且合规的自拟行动经确认后记录原话，遵守同样的隐私、授权与退出边界；无确认时采用暂缓。 -->
旁白：当事人先将手边材料收好，等你说明愿意授权的范围。你可以把自己的决定留到以后。

旁白：收条末尾压着一张书店借阅凭条。塞拉上一次说，她从未见过那一联。


## CHAPTER 12｜不完整的真相
⟦GOAL|决定还要不要恢复与往事有关的记忆|Decide whether to continue memory restoration⟧
⟦DONE|say|决定还要不要恢复与往事有关的记忆|限定记忆查验|旁白：可以用你自己的话说明你的决定，也可以请对方讲清条件。⟧


## SCENE｜银松镇书店后室
⟦BG|bg_c12s01|塞拉、艾玛和店主将借阅簿摊在灯下；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|翌日午后⟧
<!-- 按第11章最后提交的有效决定选播一条；旧档缺值时沿用尚未同意进一步披露的默认线。
moonlit_forgotten_vow_c11_a → 第12章先核对补正与塞拉证词。
moonlit_forgotten_vow_c11_b → 第12章先核对物证。
moonlit_forgotten_vow_c11_c → 第12章可只读非私人权责摘要。
moonlit_forgotten_vow_c11_custom → 第12章可只读非私人权责摘要。 自拟方案只使用已明确获准的材料。
-->
<!-- 随上章游戏状态选播其在作品资料中约定的本章后果，合并互不冲突的后果；两项结果同时涉及同一份文件时，以更严格的访问权限为准。
mg_moonlit_forgotten_vow_c11_a_win / mg_moonlit_forgotten_vow_c11_a_lose / mg_moonlit_forgotten_vow_c11_a_skip
mg_moonlit_forgotten_vow_c11_b_win / mg_moonlit_forgotten_vow_c11_b_lose / mg_moonlit_forgotten_vow_c11_b_skip
-->
旁白：借书凭条上的日期与塞拉所说的相差一天。店主翻出退回栏，指出那一行写的是塞拉亲自归还。塞拉把手从书脊上收回来。
塞拉：“是我。封印以前我读过撤回条款。我以为长老能等，后来我把那一联藏在这里。”
⟦MG|mg_moonlit_forgotten_vow_c12_a⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c12_a：赢／旁白：确认日期，可把撤回条款提交议会。 输／旁白：店主重读退回簿，先给无争议索引。 跳过／旁白：艾玛保存副页，不公布个人记忆。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜书店密室阅台
⟦BG|bg_c12s02|艾玛、凯尔隔灯相坐，塞拉扶住摇晃的书架；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|午后稍晚⟧
艾玛：“凯尔说他签的是承担残响。塞拉说她代签了紧急授权。这里还有一句，说他们都没读过撤回条款。”
凯尔：“我认我签过的东西。那句把我们写成一块儿，我签不了。”
⟦MG|mg_moonlit_forgotten_vow_c12_b⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c12_b：赢／旁白：塞拉的更正具名入档。 输／旁白：艾玛加注争议，另请店主核证。 跳过／旁白：塞拉仅更正自己的借阅日期，等待独立核验。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜书店窄楼梯
⟦BG|bg_c12s03|凯尔下行停步，艾玛在上阶抱封存箱；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|黄昏⟧
⟦CG|cg_c12s03_01|凯尔下行停步，艾玛在上阶抱封存箱；高光切换；玩家不露正脸⟧
凯尔：“我一直想证明那时候你爱过我。现在我更想知道，你往后的日子想留多少过去。”

## CHOICE｜隐藏意图
### A｜有限恢复并由艾玛见证
⟦OPT|A|set:moonlit_forgotten_vow_c12_a⟧
<!-- player_intent: 明确表达「有限恢复并由艾玛见证」或同义行动。effects: 单段复核，随时叫停，单独保管个人内容。 -->
旁白：单段复核，随时叫停，单独保管个人内容。
### B｜停止恢复，只核对物证
⟦OPT|B|set:moonlit_forgotten_vow_c12_b⟧
<!-- player_intent: 明确表达「停止恢复，只核对物证」或同义行动。effects: 艾玛封存残响，保留撤回条款与见证书。 -->
旁白：艾玛封存残响，保留撤回条款与见证书。
### C｜退出个人核验并保留隐私
⟦OPT|C|set:moonlit_forgotten_vow_c12_c⟧
<!-- player_intent: 明确表达「退出个人核验并保留隐私」或同义行动。effects: 锁定私人资料，不再邀约恢复。 -->
旁白：锁定私人资料，不再邀约恢复。
### D｜澄清、拒答或其他方案
⟦OPT|D|set:moonlit_forgotten_vow_c12_custom⟧
<!-- player_intent: 答非所问、拒绝表态、意图仍不清楚，或提出其余方案。先复述实际意图并澄清一次；可行且合规的自拟行动经确认后记录原话，遵守同样的隐私、授权与退出边界；无确认时采用暂缓。 -->
旁白：当事人先将手边材料收好，等你说明愿意授权的范围。你可以把自己的决定留到以后。

旁白：店主从书里取出一张薄纸。撤回条款后面有三处签名，第一个签名的人是那一晚值钟的长老。

## CHAPTER 13｜誓约可以拒绝
⟦GOAL|明确你希望保留、解除还是重订旧誓约|Choose to keep, dissolve, or renegotiate the vow⟧
⟦DONE|say|明确你希望保留、解除还是重订旧誓约|表达誓约意愿|旁白：可以用你自己的话说明你的决定，也可以请对方讲清条件。⟧


## SCENE｜湖畔平台
⟦BG|bg_c13s01|凯尔、塞拉、艾玛与覆布的誓约石；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|次日上午⟧
<!-- 早章小游戏回收：仅处理已结算且命中的结果；无旗标不补写成功。授权限制优先。
mg_moonlit_forgotten_vow_c06_a_win → 获得撤回条款的索引线索，第13章可用它核对书店副本。
-->
<!-- 先按上章意图执行对应进场与授权限制；若玩家未到场，以下对话作为角色行动切镜，玩家只收到允许范围内的纪要，不代写玩家在场或回应。
moonlit_forgotten_vow_c12_a → 下一章可了解恢复与誓约处置的不同结果。
moonlit_forgotten_vow_c12_b → 下一章只讨论誓约文本。
moonlit_forgotten_vow_c12_c → 下一章允许书面拒绝及独立保全。
moonlit_forgotten_vow_c12_custom → 下一章允许书面拒绝及独立保全。 自拟方案只使用已明确获准的材料。
-->
<!-- 随上章游戏状态选播其在作品资料中约定的本章后果，合并互不冲突的后果；两项结果同时涉及同一份文件时，以更严格的访问权限为准。
mg_moonlit_forgotten_vow_c12_a_win / mg_moonlit_forgotten_vow_c12_a_lose / mg_moonlit_forgotten_vow_c12_a_skip
mg_moonlit_forgotten_vow_c12_b_win / mg_moonlit_forgotten_vow_c12_b_lose / mg_moonlit_forgotten_vow_c12_b_skip
-->
塞拉：“我把那页贴出来了。退出可以单独提出。重订需要双方另签。你也可以先什么都不签。”
旁白：凯尔抬头看了一眼自己的名字，把原来压在旁边的印章移远。
⟦MG|mg_moonlit_forgotten_vow_c13_a⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c13_a：赢／旁白：见证人能直接记录真实意图。 输／旁白：艾玛要求重读条款，见证延期。 跳过／旁白：只记录尚未授权，没有仪式动作。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜湖畔亭廊
⟦BG|bg_c13s02|罗南与凯尔各持一份会议副页，塞拉在刻字石旁；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|午后⟧
罗南：“议会还有人说，撤回要先交还继承席。”
凯尔把两张纸上下错开，露出两行不同的印记。
凯尔：“你可以把我的资格放上桌。她的意愿在另一张纸上。”
⟦MG|mg_moonlit_forgotten_vow_c13_b⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c13_b：赢／旁白：两项表决彻底分开，罗南签认程序。 输／旁白：塞拉收起草案，待书记复核权限。 跳过／旁白：按静态保管处理，暂不改动誓约。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜湖畔木阶
⟦BG|bg_c13s03|凯尔坐在木阶下方，空白纸压在石上；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|日落⟧
⟦CG|cg_c13s03_01|凯尔坐在木阶下方，空白纸压在石上；高光切换；玩家不露正脸⟧
凯尔：“我愿意读一份新约。我也会接受结束。你现在愿意把什么写上去？”

## CHOICE｜隐藏意图
### A｜明确提出解除旧誓约
⟦OPT|A|set:moonlit_forgotten_vow_c13_a⟧
<!-- player_intent: 明确表达「明确提出解除旧誓约」或同义行动。effects: 见证人登记独立撤回请求。 -->
旁白：见证人登记独立撤回请求。
### B｜提出重新协商
⟦OPT|B|set:moonlit_forgotten_vow_c13_b⟧
<!-- player_intent: 明确表达「提出重新协商」或同义行动。effects: 凯尔同意审阅新条款，保留双方最终确认。 -->
旁白：凯尔同意审阅新条款，保留双方最终确认。
### C｜选择保留或暂时搁置
⟦OPT|C|set:moonlit_forgotten_vow_c13_c⟧
<!-- player_intent: 明确表达「选择保留或暂时搁置」或同义行动。effects: 艾玛逐字区别保留与未授权，未授权默认暂停。 -->
旁白：艾玛逐字区别保留与未授权，未授权默认暂停。
### D｜澄清、拒答或其他方案
⟦OPT|D|set:moonlit_forgotten_vow_c13_custom⟧
<!-- player_intent: 答非所问、拒绝表态、意图仍不清楚，或提出其余方案。先复述实际意图并澄清一次；可行且合规的自拟行动经确认后记录原话，遵守同样的隐私、授权与退出边界；无确认时采用暂缓。 -->
旁白：当事人先将手边材料收好，等你说明愿意授权的范围。你可以把自己的决定留到以后。

旁白：观测塔亮了一扇窗。罗南提着灯站在塔门前，手上有一份准备撤回的家族异议。

## CHAPTER 14｜月下最后一问
⟦GOAL|决定如何完成封印交接及是否参与|Choose how to close the seal handover⟧
⟦DONE|say|决定如何完成封印交接及是否参与|确定交接方式|旁白：可以用你自己的话说明你的决定，也可以请对方讲清条件。⟧


## SCENE｜观测塔底层
⟦BG|bg_c14s01|艾玛、塞拉与印有封存权限的纸条；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|月升⟧
<!-- 先按上章意图执行对应进场与授权限制；若玩家未到场，以下对话作为角色行动切镜，玩家只收到允许范围内的纪要，不代写玩家在场或回应。
moonlit_forgotten_vow_c13_a → 观测塔执行解除，并提供安全的残响封存。
moonlit_forgotten_vow_c13_b → 观测塔审阅草案，任一方未确认时维持暂停。
moonlit_forgotten_vow_c13_c → 观测塔只做被明确允许的维护，暧昧意图保持冻结。
moonlit_forgotten_vow_c13_custom → 观测塔只做被明确允许的维护，暧昧意图保持冻结。 自拟方案只使用已明确获准的材料。
-->
<!-- 随上章游戏状态选播其在作品资料中约定的本章后果，合并互不冲突的后果；两项结果同时涉及同一份文件时，以更严格的访问权限为准。
mg_moonlit_forgotten_vow_c13_a_win / mg_moonlit_forgotten_vow_c13_a_lose / mg_moonlit_forgotten_vow_c13_a_skip
mg_moonlit_forgotten_vow_c13_b_win / mg_moonlit_forgotten_vow_c13_b_lose / mg_moonlit_forgotten_vow_c13_b_skip
-->
塞拉：“塔记录同意，不会替人给出同意。今夜动哪一层，要看安放在哪张托盘上。”
旁白：她把过去自己盖过的章交给艾玛。盒底没有预留另一枚可以代签的章。
⟦MG|mg_moonlit_forgotten_vow_c14_a⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c14_a：赢／旁白：艾玛完成分柜封存，留一份非私人副本。 输／旁白：塞拉转交辨认责任，先暂停仪式。 跳过／旁白：封存现状，等两名见证人共同接收。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜观测塔平台
⟦BG|bg_c14s02|罗南把异议交给书记，凯尔站在平台另一侧；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|月过窗棂⟧
罗南：“我撤回把继承和誓约绑在一起的异议。家族问起来，用我的原话。”
凯尔侧身让开出口，让罗南自己去盖回执章。
⟦MG|mg_moonlit_forgotten_vow_c14_b⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c14_b：赢／旁白：三份回执分别送交，塔内无须再次聚集。 输／旁白：书记拆开权限，延后公开纪要。 跳过／旁白：艾玛先接手保管，其余人分开签字。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜观测塔门外
⟦BG|bg_c14s03|凯尔在门槛内握一张空白副联，月光照窗框；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|夜深⟧
⟦CG|cg_c14s03_01|凯尔在门槛内握一张空白副联，月光照窗框；高光切换；玩家不露正脸⟧
凯尔：“我会让长老知道我答应过什么。你能留在这里，也能让我把副联交艾玛。”

## CHOICE｜隐藏意图
### A｜在艾玛见证下完成获准处置
⟦OPT|A|set:moonlit_forgotten_vow_c14_a⟧
<!-- player_intent: 明确表达「在艾玛见证下完成获准处置」或同义行动。effects: 执行已经明确确认的处置，登记玩家见证。 -->
旁白：执行已经明确确认的处置，登记玩家见证。
### B｜由独立见证人接手续办
⟦OPT|B|set:moonlit_forgotten_vow_c14_b⟧
<!-- player_intent: 明确表达「由独立见证人接手续办」或同义行动。effects: 由艾玛执行获准部分，玩家可只领摘要。 -->
旁白：由艾玛执行获准部分，玩家可只领摘要。
### C｜停止当前仪式并离场
⟦OPT|C|set:moonlit_forgotten_vow_c14_c⟧
<!-- player_intent: 明确表达「停止当前仪式并离场」或同义行动。effects: 全塔归于静态封存，既有撤回请求仍有效。 -->
旁白：全塔归于静态封存，既有撤回请求仍有效。
### D｜澄清、拒答或其他方案
⟦OPT|D|set:moonlit_forgotten_vow_c14_custom⟧
<!-- player_intent: 答非所问、拒绝表态、意图仍不清楚，或提出其余方案。先复述实际意图并澄清一次；可行且合规的自拟行动经确认后记录原话，遵守同样的隐私、授权与退出边界；无确认时采用暂缓。 -->
旁白：当事人先将手边材料收好，等你说明愿意授权的范围。你可以把自己的决定留到以后。

旁白：塔里的灯熄了。凯尔走到岔路先停了一步，把回镇的路让出来。

## CHAPTER 15｜重新选择你
⟦GOAL|表达希望与现在的凯尔怎样往来|Tell Kael how you want to know him now⟧
⟦DONE|say|表达希望与现在的凯尔怎样往来|决定以后往来|旁白：可以用你自己的话说明你的决定，也可以请对方讲清条件。⟧


## SCENE｜银松镇湖畔
⟦BG|bg_c15s01|艾玛与凯尔站在湖边，桌上只放授权回执；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|数日后⟧
<!-- 先按上章意图执行对应进场与授权限制；若玩家未到场，以下对话作为角色行动切镜，玩家只收到允许范围内的纪要，不代写玩家在场或回应。
moonlit_forgotten_vow_c14_a → 末章发放处置回执，未确认事项仍暂停。
moonlit_forgotten_vow_c14_b → 末章由艾玛转达结果。
moonlit_forgotten_vow_c14_c → 末章只收到玩家主动请求的保全说明。
moonlit_forgotten_vow_c14_custom → 末章只收到玩家主动请求的保全说明。 自拟方案只使用已明确获准的材料。
-->
<!-- 随上章游戏状态选播其在作品资料中约定的本章后果，合并互不冲突的后果；两项结果同时涉及同一份文件时，以更严格的访问权限为准。
mg_moonlit_forgotten_vow_c14_a_win / mg_moonlit_forgotten_vow_c14_a_lose / mg_moonlit_forgotten_vow_c14_a_skip
mg_moonlit_forgotten_vow_c14_b_win / mg_moonlit_forgotten_vow_c14_b_lose / mg_moonlit_forgotten_vow_c14_b_skip
-->
旁白：艾玛依玩家权限交付回执。被允许公开的那一页只有保管地点、签字日期和复核方式。凯尔没有问另一页上写了什么。
⟦MG|mg_moonlit_forgotten_vow_c15_a⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c15_a：赢／旁白：艾玛给一张公开时间卡，私人经历独立封存。 输／旁白：时间卡退回核对，只提供授权回执。 跳过／旁白：只保留独立索引。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜银松镇面包铺外
⟦BG|bg_c15s02|艾玛与凯尔在窗口，炉雾从街角飘出；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|午后⟧
艾玛拿走自己的那袋面包。凯尔把剩下的两袋并排放着，看了一会儿，拿起属于他的那一袋。
凯尔：“要是你以后想见我，我们可以去一个从没去过的地方。”
⟦MG|mg_moonlit_forgotten_vow_c15_b⟧
<!-- MG_RESULT mg_moonlit_forgotten_vow_c15_b：赢／旁白：留下一张可填写的联系卡。 输／旁白：只给回执申请渠道，不写私人邀约。 跳过／旁白：将未来计划留空。 三种结果均进入本场收尾并前往下一场。 -->

## SCENE｜镇上岔路石灯
⟦BG|bg_c15s03|凯尔站在岔口较远一侧，手里只有自己的纸袋；角色外形沿用母档；玩家不露正脸⟧
⟦TIME|黄昏⟧
⟦CG|cg_c15s03_01|凯尔站在岔口较远一侧，手里只有自己的纸袋；高光切换；玩家不露正脸⟧
凯尔：“我愿意从今天开始认识你。你愿意让我以后用什么方式找你？”

## CHOICE｜隐藏意图
### A｜愿意在当下重新约会
⟦OPT|A|set:moonlit_forgotten_vow_c15_a⟧
<!-- player_intent: 明确表达「愿意在当下重新约会」或同义行动。effects: 凯尔询问一次普通约会，等玩家接受才定时间。 -->
旁白：凯尔询问一次普通约会，等玩家接受才定时间。
### B｜只维持熟人或朋友关系
⟦OPT|B|set:moonlit_forgotten_vow_c15_b⟧
<!-- player_intent: 明确表达「只维持熟人或朋友关系」或同义行动。effects: 凯尔遵守约定的联系频率，不再提旧婚约。 -->
旁白：凯尔遵守约定的联系频率，不再提旧婚约。
### C｜结束往来并各自生活
⟦OPT|C|set:moonlit_forgotten_vow_c15_c⟧
<!-- player_intent: 明确表达「结束往来并各自生活」或同义行动。effects: 凯尔离开玩家的联络路径，由艾玛处理必要回执。 -->
旁白：凯尔离开玩家的联络路径，由艾玛处理必要回执。
### D｜澄清、拒答或其他方案
⟦OPT|D|set:moonlit_forgotten_vow_c15_custom⟧
<!-- player_intent: 答非所问、拒绝表态、意图仍不清楚，或提出其余方案。先复述实际意图并澄清一次；可行且合规的自拟行动经确认后记录原话，遵守同样的隐私、授权与退出边界；无确认时采用暂缓。 -->
旁白：当事人先将手边材料收好，等你说明愿意授权的范围。你可以把自己的决定留到以后。

旁白：石灯亮起来。回镇两条路都亮着，凯尔等你先看清路。

### 结局结算
<!-- 按已确认关系意图播放对应的章末分支。四轴分别结算，涉及授权以更严格的记录为准。 -->
<!-- event：c13_a 的独立撤回请求生效；若 c14_c，仅行政确认撤回并暂停塔中仪式。c13_b 且双边明确签署才写重订，否则暂停；c13_c 仅明确保留时维持原条款，含混时冻结。
relationship：c15_a 且凯尔接受才进入可拒绝的约会，誓约处置不改变约会资格；c15_b 保持熟人或朋友，c15_c/custom 停止主动找寻。
arc：凯尔退出表决后仍维护个人决定权，罗南撤回捆绑异议，塞拉更正自己藏匿记录的事实。
persistent：c12 的记忆授权保持有效，撤回时只提供非私人档案；按末章游戏结果保留时间卡、回执或索引及可选联络卡。 -->
旁白：账页上终于分开记了家族保管和个人意愿。艾玛把属于你的那张回执放进只有当事人能领的信封。镇上另一本簿只记录这一夜灯亮到几点。

<!-- 下列为互斥关系后日谈。原誓约保持、解除、重订或暂停均不改变当前关系的同意要求。 -->
- **第一次新的约会**（c15_a，双方确认）  
  凯尔在一家没去过的面包铺前停下，把写着营业时间的木牌转过来给你看。“周六来，还是今天就试一个？”他等你答完才碰门把。
- **镇上的熟人**（c15_b）  
  开放日，凯尔在屋檐下替书记整理搬来的桌椅。他按约问候你一次，又回过去问罗南下一张桌子该放在哪儿。
- **各走各路**（c15_c 或未授权继续联络的 c15_custom）  
  镇上照常点灯。凯尔按自己选的方向回庄园。艾玛把回执留在自己的保管箱里，等你有需要时再问她。
