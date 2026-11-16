# CHAPTER 1｜第一天，全队为你停下
⟦GOAL|平息发布会风波，确认匿名视频来源|第一天，全队为你停下⟧
⟦DONE|flag|c01_clue|关键证据到手|旁白：一条需要核查的证据已经摆在桌面上。⟧
⟦DONE|say|向队员询问偷拍机位或明确要求调查偷拍视频|追问偷拍来源|旁白：当事人停下手里的事，开始回应你提出的问题。⟧

# SCENE｜媒体通道
⟦BG|bg_c01s01|媒体通道·08:40（Jace面对记者，Alexander从门口快步走来）⟧
⟦TIME|08:40⟧
旁白：你的入职胸牌还没戴正，记者已经堵住球队通道。
Jace：“They want a scandal? I can give them one.”
旁白：他朝镜头迈近，忽然看见对准你们的偷拍机位。
Alexander：“Jace. Back off. Now.”
旁白：有人喊出你的名字，显然提前知道新媒体总监会到场。
⟦SET|c01_clue⟧
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。

# SCENE｜更衣室门口
⟦BG|bg_c01s02|更衣室门口·09:10（Alexander握着门把，Ethan抱着球员头盔）⟧
⟦TIME|09:10⟧
旁白：门内传来金属柜门的撞击声。
Ethan：“The fight wasn’t about losing.”
Alexander：“Your job is the press. Mine is my team.”
旁白：垃圾桶边露出一张标着昨晚比赛第三节的纸。
Alexander：“What exactly are you trying to find out?”
⟦IF|c01_clue⟧
旁白：先前保存的记录与眼前的日期、签名逐项比对。
⟦/IF⟧
# CHOICE｜第一天，全队为你停下：眼前的问题你打算怎么处理
#### A｜公开要求球队说明昨晚的冲突
旁白：Maya打开取证登记表，逐项记录你要求公开核查的材料。
⟦OPT|A|set:c01_mid_a⟧
#### B｜先私下核实队员和监控记录
旁白：相关原件被封存，Maya安排独立核验并记录接触人员。
⟦OPT|B|set:c01_mid_b⟧
#·
旁白：两份处理记录各自留痕，后续证人将根据程序接受问询。

# SCENE｜剪辑工作间
⟦BG|bg_c01s03|剪辑工作间·13:25（Jace指向显示器中的监控画面）⟧
⟦TIME|13:25⟧
旁白：监控显示，偷拍机位早在你到场前便已架好。
Jace：“I crossed a line. I’m not defending that.”
旁白：他把一份原始文件交到你面前。
Jace：“But someone planned that shot.”
旁白：屏幕上，一个未知管理员刚删除了访问日志。
旁白：三段片段被打乱，你需要还原谁先架好摄像机。
⟦MG|g_m110_clip_trace⟧
⟦IF|mg_g_m110_clip_trace_win⟧
旁白：你恢复了摄像机提前就位的次序，拿到可供复核的时间轴。
⟦SET|clip_order_verified⟧
⟦ELSE⟧
旁白：时间排序未能确认，Maya建议保留原件等待人工比对。
⟦/IF⟧
⟦FREE⟧
⟦IF|c01_mid_a⟧
旁白：正式登记表增添了一条关于“公开要求球队说明昨晚的冲突”的调查任务。
⟦ELSE⟧
旁白：独立调查员沿着“先私下核实队员和监控记录”的路径继续核实证据。
⟦/IF⟧

# SCENE｜封存档案室
⟦BG|bg_c01s04|封存档案室·20:10（Ryan站在门内，举着三年前的球衣）⟧
⟦TIME|20:10⟧
旁白：你的新工卡竟能打开已封存三年的门。
Ryan：“This room should have been sealed.”
旁白：一段匿名事故视频自动开始播放。
Ryan：“That footage ruined my career.”
旁白：日志清除提醒跳到屏幕顶端。
Ryan：“Who do you want to trust with it?”
⟦IF|clip_order_verified⟧
旁白：你在本章小游戏里取得的“偷拍视频时间线”成果，已加入正式调查卷宗。
⟦/IF⟧
# CHOICE｜第一天，全队为你停下：关键事件发生后，你如何继续
#### A｜将视频副本交独立合规官并留存校验值
旁白：Maya将你的要求写入正式交接单，签收人的名字留在记录里。
⟦OPT|A|set:c01_final_a⟧
#### B｜先让Ryan辨认原始视频并记录证词
旁白：证据进入另一条独立核验流程，接下来的访问权限随之改变。
⟦OPT|B|set:c01_final_b⟧
#·
旁白：视频最后一帧里，三年前的队长竟然还站在事故现场。

# CHAPTER 2｜队长不能说的秘密
⟦GOAL|查明队长签过什么文件并保护证据|队长不能说的秘密⟧
⟦DONE|flag|c02_clue|关键证据到手|旁白：一条需要核查的证据已经摆在桌面上。⟧
⟦DONE|say|向Alexander询问保密协议的签署原因|问清队长协议|旁白：当事人停下手里的事，开始回应你提出的问题。⟧

# SCENE｜战术室
⟦BG|bg_c02s01|战术室·08:15（Alexander面向战术板，左手按住一份合同）⟧
⟦TIME|08:15⟧
⟦IF|c01_final_a⟧
旁白：此前你把视频交给合规官，Alexander拿到了封存回执。
⟦ELSE⟧
旁白：此前你先请Ryan辨认视频，Alexander要求补做取证记录。
⟦/IF⟧
旁白：距离昨夜离开档案室不到十二小时。
Alexander：“You went into the sealed room.”
旁白：他递来三年前的队内纪律记录。
Alexander：“I signed something I should have challenged.”
旁白：文件的承包商名称被厚厚的黑线覆盖。
⟦SET|c02_clue⟧
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。

# SCENE｜球员通道
⟦BG|bg_c02s02|球员通道·11:30（Alexander在队旗旁低头看一封旧信）⟧
⟦TIME|11:30⟧
旁白：记者隔着玻璃拍下了他的右肩旧伤。
Alexander：“I took the blame to keep the season alive.”
旁白：合同附件末页上有另一名见证人的签字。
Alexander：“I won’t ask you to ignore this.”
Alexander：“Will you question me on record?”
⟦IF|c02_clue⟧
旁白：先前保存的记录与眼前的日期、签名逐项比对。
⟦/IF⟧
# CHOICE｜队长不能说的秘密：眼前的问题你打算怎么处理
#### A｜要求队长正式提供文件并作书面记录
旁白：Maya打开取证登记表，逐项记录你要求公开核查的材料。
⟦OPT|A|set:c02_mid_a⟧
#### B｜请独立律师先审核保密限制
旁白：相关原件被封存，Maya安排独立核验并记录接触人员。
⟦OPT|B|set:c02_mid_b⟧
#·
旁白：两份处理记录各自留痕，后续证人将根据程序接受问询。

# SCENE｜恢复训练室
⟦BG|bg_c02s03|恢复训练室·16:20（Ethan递给Alexander冰袋，两人面对门口）⟧
⟦TIME|16:20⟧
旁白：Alexander的握力下降，水瓶从指间滑落。
Ethan：“His shoulder has been bad for months.”
Alexander：“That’s not yours to disclose.”
旁白：他把医疗记录合上，交还给Ethan。
Ethan：“Can we keep the medical facts separate?”
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。
⟦IF|c02_mid_a⟧
旁白：正式登记表增添了一条关于“要求队长正式提供文件并作书面记录”的调查任务。
⟦ELSE⟧
旁白：独立调查员沿着“请独立律师先审核保密限制”的路径继续核实证据。
⟦/IF⟧

# SCENE｜地下停车场
⟦BG|bg_c02s04|地下停车场·22:05（Alexander站在你的车旁，手中拿着未拆的信封）⟧
⟦TIME|22:05⟧
旁白：一封写着你名字的信夹在雨刷下面。
Alexander：“Don’t touch the seal. We need a record.”
旁白：安保摄像机突然转向墙壁。
Alexander：“Someone knows our schedules.”
旁白：信封上印着三年前事故承包商的暗纹。
Alexander：“Who should receive this first?”
# CHOICE｜队长不能说的秘密：关键事件发生后，你如何继续
#### A｜报警并提交威胁信与监控异常
旁白：Maya将你的要求写入正式交接单，签收人的名字留在记录里。
⟦OPT|A|set:c02_final_a⟧
#### B｜交由独立安保取证并申请封存监控
旁白：证据进入另一条独立核验流程，接下来的访问权限随之改变。
⟦OPT|B|set:c02_final_b⟧
#·
旁白：信封内的纸与三年前事故报告使用同一批专用纸。

# CHAPTER 3｜坏男孩也要道歉
⟦GOAL|让Jace承担越界责任，查清偷拍视频发布链|坏男孩也要道歉⟧
⟦DONE|flag|c03_clue|关键证据到手|旁白：一条需要核查的证据已经摆在桌面上。⟧
⟦DONE|say|要求Jace解释越界行为或说明希望他如何补救|讨论越界责任|旁白：当事人停下手里的事，开始回应你提出的问题。⟧

# SCENE｜公开训练看台
⟦BG|bg_c03s01|公开训练看台·09:10（Jace独自在冰上练射门，镜头隔着护网拍摄）⟧
⟦TIME|09:10⟧
⟦IF|c02_final_a⟧
旁白：报警回执使Jace的偷拍案与威胁事件并案核查。
⟦ELSE⟧
旁白：安保保全的画面显示，同一名访客曾进入剪辑室。
⟦/IF⟧
旁白：球队宣布对Jace进行内部处分。
Jace：“I shouldn’t have put you on the spot.”
旁白：他摘下手套，在众目睽睽下向你保持距离。
Jace：“I owe you an apology, not a performance.”
旁白：训练馆大屏却循环播放偷拍视频。
⟦SET|c03_clue⟧
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。

# SCENE｜剪辑室
⟦BG|bg_c03s02|剪辑室·12:40（Jace指着视频时间轴，手臂纹身露出袖口）⟧
⟦TIME|12:40⟧
旁白：上传时间比现场记者的直播早了二十分钟。
Jace：“That means they had it before the kiss.”
旁白：导出记录指向赞助商的内容账户。
Jace：“I’ll testify. Even if it costs me.”
Jace：“Do we confront them or build the case?”
⟦IF|c03_clue⟧
旁白：先前保存的记录与眼前的日期、签名逐项比对。
⟦/IF⟧
# CHOICE｜坏男孩也要道歉：眼前的问题你打算怎么处理
#### A｜让Jace公开承担责任并要求完整原片
旁白：Maya打开取证登记表，逐项记录你要求公开核查的材料。
⟦OPT|A|set:c03_mid_a⟧
#### B｜先独立鉴定视频再决定公开内容
旁白：相关原件被封存，Maya安排独立核验并记录接触人员。
⟦OPT|B|set:c03_mid_b⟧
#·
旁白：两份处理记录各自留痕，后续证人将根据程序接受问询。

# SCENE｜球员休息区
⟦BG|bg_c03s03|球员休息区·17:00（Jace坐在长椅上，双手托着未开封的饮料）⟧
⟦TIME|17:00⟧
旁白：经纪人发来一份否认责任的声明。
Jace：“I told him to delete it.”
旁白：他当面删掉预定发布的玩笑视频。
Jace：“You decide how close I’m allowed to get.”
旁白：走廊的广告屏忽然切出陌生账号的倒计时。
旁白：你将两个画面并排，检查未经授权的剪辑痕迹。
⟦MG|g_m110_metadata⟧
⟦IF|mg_g_m110_metadata_win⟧
旁白：三处剪辑标记得到确认，原片校验信息被保存。
⟦SET|metadata_diff_verified⟧
⟦ELSE⟧
旁白：画面差异尚不充分，证据仍可由第三方鉴定。
⟦/IF⟧
⟦FREE⟧
⟦IF|c03_mid_a⟧
旁白：正式登记表增添了一条关于“让Jace公开承担责任并要求完整原片”的调查任务。
⟦ELSE⟧
旁白：独立调查员沿着“先独立鉴定视频再决定公开内容”的路径继续核实证据。
⟦/IF⟧

# SCENE｜媒体发布间
⟦BG|bg_c03s04|媒体发布间·21:00（Jace站在没有开启的麦克风前）⟧
⟦TIME|21:00⟧
旁白：球队要求你在十分钟内提交公开回应。
Jace：“I’ll say what I did wrong. No excuses.”
旁白：赞助商账户把原片链接设为不可见。
Jace：“But if they edited it, people deserve the truth.”
旁白：他的手机亮起交易相关的内部通知。
Jace：“How do we do this without another lie?”
⟦IF|metadata_diff_verified⟧
旁白：你在本章小游戏里取得的“被篡改的导出记录”成果，已加入正式调查卷宗。
⟦/IF⟧
# CHOICE｜坏男孩也要道歉：关键事件发生后，你如何继续
#### A｜让Jace公开道歉，同时披露已核验事实
旁白：Maya将你的要求写入正式交接单，签收人的名字留在记录里。
⟦OPT|A|set:c03_final_a⟧
#### B｜由球队先发布调查公告，暂缓Jace个人采访
旁白：证据进入另一条独立核验流程，接下来的访问权限随之改变。
⟦OPT|B|set:c03_final_b⟧
#·
旁白：Jace收到一份交易通知：下一场比赛可能是他的告别战。

# CHAPTER 4｜守门员的第二次扑救
⟦GOAL|识别Ethan的伤情风险并保护他的医疗自主权|守门员的第二次扑救⟧
⟦DONE|flag|c04_clue|关键证据到手|旁白：一条需要核查的证据已经摆在桌面上。⟧
⟦DONE|say|询问Ethan是否需要独立医疗评估或支持|了解伤情选择|旁白：当事人停下手里的事，开始回应你提出的问题。⟧

# SCENE｜守门员训练区
⟦BG|bg_c04s01|守门员训练区·07:50（Ethan站在球门边，摘下头盔向你点头）⟧
⟦TIME|07:50⟧
⟦IF|c03_final_a⟧
旁白：Jace的公开道歉引来更多队员主动向队医报告症状。
⟦ELSE⟧
旁白：球队先发布调查通报，Ethan希望出场状态不被媒体过度解读。
⟦/IF⟧
旁白：清晨的冰面只有守门员击球声。
Ethan：“Coffee’s in the lounge. I remembered your order.”
旁白：他弯腰捡球时短暂扶住门框。
Ethan：“It’s just a rough morning.”
旁白：他的护具扣带露出一处不正常磨损。
⟦SET|c04_clue⟧
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。

# SCENE｜队医办公室
⟦BG|bg_c04s02|队医办公室·10:35（Ethan坐在检查椅上，队医Olivia站在旁边）⟧
⟦TIME|10:35⟧
旁白：队医要求重新评估他的平衡能力。
Olivia：“Symptoms come before the score.”
Ethan：“I’m scared they’ll replace me.”
旁白：桌上两张护具检测单的编号竟然重叠。
Ethan：“Can we talk before anyone posts about me?”
⟦IF|c04_clue⟧
旁白：先前保存的记录与眼前的日期、签名逐项比对。
⟦/IF⟧
# CHOICE｜守门员的第二次扑救：眼前的问题你打算怎么处理
#### A｜支持立即独立评估并让Ethan自行决定披露范围
旁白：Maya打开取证登记表，逐项记录你要求公开核查的材料。
⟦OPT|A|set:c04_mid_a⟧
#### B｜先协助Ethan与队医讨论检查和隐私
旁白：相关原件被封存，Maya安排独立核验并记录接触人员。
⟦OPT|B|set:c04_mid_b⟧
#·
旁白：两份处理记录各自留痕，后续证人将根据程序接受问询。

# SCENE｜空冰场替补席
⟦BG|bg_c04s03|空冰场替补席·15:20（Ethan把头盔放在长椅上，神情疲惫）⟧
⟦TIME|15:20⟧
旁白：傍晚没有观众，冰刀声显得格外清晰。
Ethan：“I tell kids at camp to speak up about injuries.”
旁白：他揉了揉左手虎口的小疤。
Ethan：“Then I hide mine. That isn’t fair.”
旁白：他把是否接受检查的表格推给队医。
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。
⟦IF|c04_mid_a⟧
旁白：正式登记表增添了一条关于“支持立即独立评估并让Ethan自行决定披露范围”的调查任务。
⟦ELSE⟧
旁白：独立调查员沿着“先协助Ethan与队医讨论检查和隐私”的路径继续核实证据。
⟦/IF⟧

# SCENE｜比赛入口
⟦BG|bg_c04s04|比赛入口·19:05（Ethan扶着球员通道的护栏，Alexander站在侧边）⟧
⟦TIME|19:05⟧
旁白：赛前热身尚未结束，Ethan突然停下脚步。
Alexander：“Call medical. Right now.”
旁白：队医宣布暂缓上场，替补已穿好护具。
Ethan：“Please tell the truth. Just not my private details.”
旁白：检查单上的设备编号与三年前旧案一致。
Ethan：“What can the team say tonight?”
# CHOICE｜守门员的第二次扑救：关键事件发生后，你如何继续
#### A｜公布球员暂缓上场与安全措施，不公开病历
旁白：Maya将你的要求写入正式交接单，签收人的名字留在记录里。
⟦OPT|A|set:c04_final_a⟧
#### B｜由队医和联盟发布必要的出场状态公告
旁白：证据进入另一条独立核验流程，接下来的访问权限随之改变。
⟦OPT|B|set:c04_final_b⟧
#·
旁白：队医的旧伤记录里，出现与Ryan三年前相同的设备编号。

# CHAPTER 5｜穿着敌队球衣的盟友
⟦GOAL|核查Damon提供的场馆证据并避免利益冲突|穿着敌队球衣的盟友⟧
⟦DONE|flag|c05_clue|关键证据到手|旁白：一条需要核查的证据已经摆在桌面上。⟧
⟦DONE|say|向Damon追问证据来源和他愿意承担的风险|核对敌队证据|旁白：当事人停下手里的事，开始回应你提出的问题。⟧

# SCENE｜客场球馆外廊
⟦BG|bg_c05s01|客场球馆外廊·12:15（Damon身穿红黑球队外套，背靠玻璃栏杆）⟧
⟦TIME|12:15⟧
⟦IF|c04_final_a⟧
旁白：队医的医疗声明让客场球馆主动分享护具更换记录。
⟦ELSE⟧
旁白：仅公布出场状态后，联盟要求两队补交设备检查单。
⟦/IF⟧
旁白：宿敌球队的训练刚结束，你按预约走入公共走廊。
Damon：“I’m not asking you to switch sides.”
旁白：他把一份场馆出入记录放在桌上。
Damon：“I’m asking you to check the timestamps.”
旁白：名单上有一名现任赞助商高管的名字。
⟦SET|c05_clue⟧
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。

# SCENE｜赛事合规办公室
⟦BG|bg_c05s02|赛事合规办公室·14:40（Damon与独立合规官隔桌就座）⟧
⟦TIME|14:40⟧
旁白：合规官核对来访登记与提供材料的时间。
Damon：“I won’t trade evidence for team secrets.”
旁白：一名中间人发送了交换对方战术的要求。
Maya：“That message belongs in our evidence file.”
Damon：“Will you make the contact official?”
⟦IF|c05_clue⟧
旁白：先前保存的记录与眼前的日期、签名逐项比对。
⟦/IF⟧
# CHOICE｜穿着敌队球衣的盟友：眼前的问题你打算怎么处理
#### A｜拒绝任何战术交换，并正式登记Damon的证据
旁白：Maya打开取证登记表，逐项记录你要求公开核查的材料。
⟦OPT|A|set:c05_mid_a⟧
#### B｜先由律师审查证据来源后再接受副本
旁白：相关原件被封存，Maya安排独立核验并记录接触人员。
⟦OPT|B|set:c05_mid_b⟧
#·
旁白：两份处理记录各自留痕，后续证人将根据程序接受问询。

# SCENE｜空看台
⟦BG|bg_c05s03|空看台·18:10（Damon坐在红黑座椅上，手里拿着折起的旧球票）⟧
⟦TIME|18:10⟧
旁白：你们隔着几排空座，远处冰场响起训练哨。
Damon：“My brother played in that arena.”
旁白：他把三年前的客场票根展平。
Damon：“When the board failed, no one would listen.”
旁白：票根背面有一组可以验证的门禁编号。
旁白：四条门禁记录与旧票根编号相互矛盾。
⟦MG|g_m110_gate_match⟧
⟦IF|mg_g_m110_gate_match_win⟧
旁白：两条关键记录完成配对，异常开门时间被圈出。
⟦SET|gate_pair_verified⟧
⟦ELSE⟧
旁白：你只排除了无关记录，Maya仍能申请完整后台日志。
⟦/IF⟧
⟦FREE⟧
⟦IF|c05_mid_a⟧
旁白：正式登记表增添了一条关于“拒绝任何战术交换，并正式登记Damon的证据”的调查任务。
⟦ELSE⟧
旁白：独立调查员沿着“先由律师审查证据来源后再接受副本”的路径继续核实证据。
⟦/IF⟧

# SCENE｜场馆设备门口
⟦BG|bg_c05s04|场馆设备门口·20:30（Damon举着封条照片，技术员Victor站在门旁）⟧
⟦TIME|20:30⟧
旁白：门锁上的维修贴纸与旧照片型号一致。
Victor：“That seal was replaced before warm-up.”
旁白：中间人再次要求交换战术资料。
Damon：“No deal. We go on record or walk away.”
旁白：记录指向事故前两小时的异常开门。
Damon：“Which evidence route do you trust?”
⟦IF|gate_pair_verified⟧
旁白：你在本章小游戏里取得的“门禁编号拼合”成果，已加入正式调查卷宗。
⟦/IF⟧
# CHOICE｜穿着敌队球衣的盟友：关键事件发生后，你如何继续
#### A｜由独立调查员收集Damon和Victor的联合证词
旁白：Maya将你的要求写入正式交接单，签收人的名字留在记录里。
⟦OPT|A|set:c05_final_a⟧
#### B｜先申请场馆原始门禁备份，保护证人身份
旁白：证据进入另一条独立核验流程，接下来的访问权限随之改变。
⟦OPT|B|set:c05_final_b⟧
#·
旁白：原始记录显示，事故当天的设备封条曾在赛前两小时被更换。

# CHAPTER 6｜那个退役三年的男人
⟦GOAL|确认Ryan当年签署失实说明的过程|那个退役三年的男人⟧
⟦DONE|flag|c06_clue|关键证据到手|旁白：一条需要核查的证据已经摆在桌面上。⟧
⟦DONE|say|询问Ryan为何签下不准确的事故说明|追问退役真相|旁白：当事人停下手里的事，开始回应你提出的问题。⟧

# SCENE｜旧训练馆
⟦BG|bg_c06s01|旧训练馆·09:00（Ryan扶着右膝走过旧队徽，手握一盘录像带）⟧
⟦TIME|09:00⟧
⟦IF|c05_final_a⟧
旁白：联合证词促使Ryan接受正式调查员问询。
⟦ELSE⟧
旁白：备份记录恢复后，Ryan认出了门禁操作员的名字。
⟦/IF⟧
旁白：旧训练馆仍保留三年前的座位编号。
Ryan：“I used to come here after every win.”
旁白：他停在那块曾经断裂的护板前。
Ryan：“After the accident, I couldn’t come back.”
旁白：他带来一盒未登记的现场录音。
⟦SET|c06_clue⟧
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。

# SCENE｜独立调查室
⟦BG|bg_c06s02|独立调查室·11:50（Ryan与Maya隔着桌面查看纸质证词）⟧
⟦TIME|11:50⟧
旁白：Ryan的旧证词与现场时间线差了十一分钟。
Ryan：“I signed what they put in front of me.”
旁白：Maya指着免责协议上被划去的一句。
Maya：“Who told you the alarm never sounded?”
Ryan：“Do you want me to answer on the record?”
⟦IF|c06_clue⟧
旁白：先前保存的记录与眼前的日期、签名逐项比对。
⟦/IF⟧
# CHOICE｜那个退役三年的男人：眼前的问题你打算怎么处理
#### A｜请Ryan提供正式证词并承认当年的错误
旁白：Maya打开取证登记表，逐项记录你要求公开核查的材料。
⟦OPT|A|set:c06_mid_a⟧
#### B｜先核对证词与医疗时间线后安排听证
旁白：相关原件被封存，Maya安排独立核验并记录接触人员。
⟦OPT|B|set:c06_mid_b⟧
#·
旁白：两份处理记录各自留痕，后续证人将根据程序接受问询。

# SCENE｜康复步道
⟦BG|bg_c06s03|康复步道·17:20（Ryan穿黑色大衣，扶栏慢行）⟧
⟦TIME|17:20⟧
旁白：Ryan停下来活动受伤的右膝。
Ryan：“I thought silence would save the rookies.”
旁白：他从口袋里拿出两张旧集体合影。
Ryan：“It only taught them to stay quiet.”
旁白：他提出愿意接受公开听证。
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。
⟦IF|c06_mid_a⟧
旁白：正式登记表增添了一条关于“请Ryan提供正式证词并承认当年的错误”的调查任务。
⟦ELSE⟧
旁白：独立调查员沿着“先核对证词与医疗时间线后安排听证”的路径继续核实证据。
⟦/IF⟧

# SCENE｜录像资料室
⟦BG|bg_c06s04|录像资料室·22:00（Ryan站在录音设备旁，Maya调整耳机）⟧
⟦TIME|22:00⟧
旁白：录音中传来急促警报，随后有人下达关停命令。
Ryan：“That’s the voice I was afraid of.”
旁白：Maya立即封存原始介质。
Maya：“We need authentication before naming anyone.”
旁白：末尾一句“比赛不能停”被清晰录下。
Ryan：“What should happen to this recording?”
# CHOICE｜那个退役三年的男人：关键事件发生后，你如何继续
#### A｜提交录音原件鉴定并正式申请独立听证
旁白：Maya将你的要求写入正式交接单，签收人的名字留在记录里。
⟦OPT|A|set:c06_final_a⟧
#### B｜由律师先申请证据保全与证人保护
旁白：证据进入另一条独立核验流程，接下来的访问权限随之改变。
⟦OPT|B|set:c06_final_b⟧
#·
旁白：录音里有人说“先关掉安全报警，比赛不能停”。

# CHAPTER 7｜冰面上的倒下
⟦GOAL|处理比赛突发事故并保全设备证据|冰面上的倒下⟧
⟦DONE|flag|c07_clue|关键证据到手|旁白：一条需要核查的证据已经摆在桌面上。⟧
⟦DONE|say|明确要求优先医疗救助或现场安全封控|确认救助优先|旁白：当事人停下手里的事，开始回应你提出的问题。⟧

# SCENE｜赛前入口
⟦BG|bg_c07s01|赛前入口·18:30（Alexander穿深蓝球衣检查护板，Ethan坐在替补席）⟧
⟦TIME|18:30⟧
⟦IF|c06_final_a⟧
旁白：听证申请让球馆同意接受独立安全巡检。
⟦ELSE⟧
旁白：律师的证据保全令要求保留全部护板维修部件。
⟦/IF⟧
旁白：主场座无虚席，热身哨声刚落。
Alexander：“If the board feels wrong, we stop.”
旁白：Ethan今天按照医疗建议留在替补名单之外。
Ethan：“Good. Someone finally listened.”
旁白：你看到一块护板固定件轻微晃动。
⟦SET|c07_clue⟧
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。

# SCENE｜冰场边
⟦BG|bg_c07s02|冰场边·19:46（Alexander蹲在倒地队友旁，队医Olivia奔来）⟧
⟦TIME|19:46⟧
旁白：球员撞上护板，冲击声压过全场欢呼。
Alexander：“Medic! Stop the game!”
旁白：裁判吹停比赛，队医进入冰场。
Olivia：“Give us space. Nobody moves him.”
旁白：事故护板下露出松脱的固定件。
Alexander：“Tell me what you need from the team.”
⟦IF|c07_clue⟧
旁白：先前保存的记录与眼前的日期、签名逐项比对。
⟦/IF⟧
# CHOICE｜冰面上的倒下：眼前的问题你打算怎么处理
#### A｜立即请求停赛和封控设备，优先医疗转运
旁白：Maya打开取证登记表，逐项记录你要求公开核查的材料。
⟦OPT|A|set:c07_mid_a⟧
#### B｜确认医疗救援同时安排独立人员保护现场
旁白：相关原件被封存，Maya安排独立核验并记录接触人员。
⟦OPT|B|set:c07_mid_b⟧
#·
旁白：两份处理记录各自留痕，后续证人将根据程序接受问询。

# SCENE｜设备检查区
⟦BG|bg_c07s03|设备检查区·20:20（Victor拿着护板固定件，Maya戴手套记录）⟧
⟦TIME|20:20⟧
旁白：医疗团队已把伤员转送医院。
Victor：“That bolt shouldn’t have been reused.”
旁白：固定件背面有三年前同一批次的编号。
Maya：“Document the serial number before removal.”
旁白：工作人员在警戒线外等待你的通报。
旁白：Maya拍下固定件特写，让你标记安全疑点。
⟦MG|g_m110_bolt_compare⟧
⟦IF|mg_g_m110_bolt_compare_win⟧
旁白：三处风险均被标注，独立检测获得优先处理清单。
⟦SET|bolt_risks_marked⟧
⟦ELSE⟧
旁白：风险判断待专业工程师复核，现场仍保持封控。
⟦/IF⟧
⟦FREE⟧
⟦IF|c07_mid_a⟧
旁白：正式登记表增添了一条关于“立即请求停赛和封控设备，优先医疗转运”的调查任务。
⟦ELSE⟧
旁白：独立调查员沿着“确认医疗救援同时安排独立人员保护现场”的路径继续核实证据。
⟦/IF⟧

# SCENE｜赛后混采区
⟦BG|bg_c07s04|赛后混采区·21:50（Alexander满脸汗水站在麦克风前，Olivia在旁边）⟧
⟦TIME|21:50⟧
旁白：比赛中止，记者不断追问球员是否安全。
Alexander：“The players come first.”
Olivia：“The family has been contacted.”
旁白：医院确认伤员意识清醒，但仍需观察。
旁白：安全负责人要求暂时关闭事故区域。
Alexander：“What facts can we confirm publicly?”
⟦IF|bolt_risks_marked⟧
旁白：你在本章小游戏里取得的“护板安全检查”成果，已加入正式调查卷宗。
⟦/IF⟧
# CHOICE｜冰面上的倒下：关键事件发生后，你如何继续
#### A｜仅发布核实的伤情状态与停赛安全公告
旁白：Maya将你的要求写入正式交接单，签收人的名字留在记录里。
⟦OPT|A|set:c07_final_a⟧
#### B｜由医院授权范围内的医疗发言人说明，球队公布设施整改
旁白：证据进入另一条独立核验流程，接下来的访问权限随之改变。
⟦OPT|B|set:c07_final_b⟧
#·
旁白：护板固定件内侧刻着与旧案相同的维修批次号。

# CHAPTER 8｜五个人的矛盾证词
⟦GOAL|比对证词时间线并判断谁仍在隐瞒|五个人的矛盾证词⟧
⟦DONE|flag|c08_clue|关键证据到手|旁白：一条需要核查的证据已经摆在桌面上。⟧
⟦DONE|say|要求至少一位角色说明证词与记录不一致之处|追问证词矛盾|旁白：当事人停下手里的事，开始回应你提出的问题。⟧

# SCENE｜调查白板室
⟦BG|bg_c08s01|调查白板室·09:45（Maya举起五张证词摘要，Ryan站在白板旁）⟧
⟦TIME|09:45⟧
⟦IF|c07_final_a⟧
旁白：公开的安全公告使现场证人主动联系Maya。
⟦ELSE⟧
旁白：设施整改公告促使技术员交出封存的维修工单。
⟦/IF⟧
旁白：五份证词被贴上同一条时间线。
Maya：“They can all be sincere and still be wrong.”
旁白：Ryan的钟表记录比场馆服务器慢十一分钟。
Ryan：“I remember the alarm. Not the order.”
旁白：门禁恢复结果显示另一个未登记账户。
⟦SET|c08_clue⟧
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。

# SCENE｜采访小会议室
⟦BG|bg_c08s02|采访小会议室·12:10（Jace和Alexander分坐桌子两端）⟧
⟦TIME|12:10⟧
旁白：Jace的自拍视频与Alexander的比赛记录不一致。
Jace：“My camera clock was wrong.”
Alexander：“My report came from the scoreboard.”
旁白：两台设备存在不同的时间偏差。
Alexander：“What do you need us to verify?”
⟦IF|c08_clue⟧
旁白：先前保存的记录与眼前的日期、签名逐项比对。
⟦/IF⟧
# CHOICE｜五个人的矛盾证词：眼前的问题你打算怎么处理
#### A｜重新校准设备时间并让证人分别补充证词
旁白：Maya打开取证登记表，逐项记录你要求公开核查的材料。
⟦OPT|A|set:c08_mid_a⟧
#### B｜先用服务器时间验证原有录像与门禁记录
旁白：相关原件被封存，Maya安排独立核验并记录接触人员。
⟦OPT|B|set:c08_mid_b⟧
#·
旁白：两份处理记录各自留痕，后续证人将根据程序接受问询。

# SCENE｜服务器备份室
⟦BG|bg_c08s03|服务器备份室·16:35（Damon站在门外，Maya检查离线硬盘）⟧
⟦TIME|16:35⟧
旁白：一份三年前的离线备份恢复了删改过的出入记录。
Maya：“Here. The alarm override has an authorizer.”
旁白：授权账号属于赞助商运营负责人。
Damon：“Then put the evidence before the story.”
旁白：你的邮箱突然弹出一封陌生的已发送邮件。
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。
⟦IF|c08_mid_a⟧
旁白：正式登记表增添了一条关于“重新校准设备时间并让证人分别补充证词”的调查任务。
⟦ELSE⟧
旁白：独立调查员沿着“先用服务器时间验证原有录像与门禁记录”的路径继续核实证据。
⟦/IF⟧

# SCENE｜媒体办公室
⟦BG|bg_c08s04|媒体办公室·23:00（Maya面对电脑屏幕，Alexander守在打开的门旁）⟧
⟦TIME|23:00⟧
旁白：以你名义发出的邮件指控Ryan故意制造事故。
Maya：“That message wasn’t sent from this device.”
旁白：账户登录记录显示一个陌生IP。
Alexander：“We can correct the record without hiding anything.”
旁白：伪造邮件正被多家媒体引用。
Maya：“What correction should we issue?”
# CHOICE｜五个人的矛盾证词：关键事件发生后，你如何继续
#### A｜公开声明账号被冒用，并提交鉴证材料
旁白：Maya将你的要求写入正式交接单，签收人的名字留在记录里。
⟦OPT|A|set:c08_final_a⟧
#### B｜先请求平台撤下伪造邮件，再发布经核验的澄清
旁白：证据进入另一条独立核验流程，接下来的访问权限随之改变。
⟦OPT|B|set:c08_final_b⟧
#·
旁白：有人利用你的账号向媒体发出一封未经你授权的指控邮件。

# CHAPTER 9｜被交易的得分王
⟦GOAL|核实Jace的交易程序并处理球队信任危机|被交易的得分王⟧
⟦DONE|flag|c09_clue|关键证据到手|旁白：一条需要核查的证据已经摆在桌面上。⟧
⟦DONE|say|直接询问Jace对交易的意愿及他希望被如何对待|询问交易意愿|旁白：当事人停下手里的事，开始回应你提出的问题。⟧

# SCENE｜球队管理会议室
⟦BG|bg_c09s01|球队管理会议室·08:20（Jace站在会议桌前，桌上放着交易通知）⟧
⟦TIME|08:20⟧
⟦IF|c08_final_a⟧
旁白：账号冒用澄清让交易文件受到媒体关注。
⟦ELSE⟧
旁白：律师从冒用邮件的登录记录中发现与交易经纪方重合的网络出口。
⟦/IF⟧
旁白：俱乐部宣布Jace立即转会。
Jace：“They didn’t tell me until this morning.”
旁白：交易公告末页附了一条禁止谈论旧案的条款。
Jace：“I’ll go if I have to. I won’t lie.”
旁白：他将自己的经纪人联系方式交给你核对。
⟦SET|c09_clue⟧
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。

# SCENE｜训练馆离场通道
⟦BG|bg_c09s02|训练馆离场通道·11:15（Alexander靠在球员出口，Jace肩背球包）⟧
⟦TIME|11:15⟧
旁白：队长没有挽留Jace，只把旧球杆递还给他。
Alexander：“You still owe the team an apology.”
Jace：“I know. I’ll give them one.”
旁白：两个人第一次没有互相打断。
Jace：“Do you think this transfer is clean?”
⟦IF|c09_clue⟧
旁白：先前保存的记录与眼前的日期、签名逐项比对。
⟦/IF⟧
# CHOICE｜被交易的得分王：眼前的问题你打算怎么处理
#### A｜直接询问交易决策者与Jace本人，并保留会议记录
旁白：Maya打开取证登记表，逐项记录你要求公开核查的材料。
⟦OPT|A|set:c09_mid_a⟧
#### B｜先让律师核对交易和保密条款的合法性
旁白：相关原件被封存，Maya安排独立核验并记录接触人员。
⟦OPT|B|set:c09_mid_b⟧
#·
旁白：两份处理记录各自留痕，后续证人将根据程序接受问询。

# SCENE｜客队接待室
⟦BG|bg_c09s03|客队接待室·17:30（Damon坐在桌边，Jace拿着新球衣站在窗旁）⟧
⟦TIME|17:30⟧
旁白：两位昔日宿敌现在必须成为队友。
Damon：“Wear the jersey. Keep your own spine.”
Jace：“Did you ask for this trade?”
Damon：“No. But somebody did.”
旁白：转会附件编号与旧事故合同使用同一前缀。
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。
⟦IF|c09_mid_a⟧
旁白：正式登记表增添了一条关于“直接询问交易决策者与Jace本人，并保留会议记录”的调查任务。
⟦ELSE⟧
旁白：独立调查员沿着“先让律师核对交易和保密条款的合法性”的路径继续核实证据。
⟦/IF⟧

# SCENE｜联盟申诉办公室
⟦BG|bg_c09s04|联盟申诉办公室·20:55（Jace站在律师旁，纸面合同摊开在桌上）⟧
⟦TIME|20:55⟧
旁白：律师发现合同附带不寻常的保密义务。
Jace：“I want my career. Not this gag order.”
旁白：联盟通知交易可以先执行，但条款可单独审查。
Damon：“We can compete without making this personal.”
旁白：一份旧赞助协议被夹在交易附件里。
Jace：“Will you challenge the clause?”
# CHOICE｜被交易的得分王：关键事件发生后，你如何继续
#### A｜申请联盟对附带保密条款进行正式审查
旁白：Maya将你的要求写入正式交接单，签收人的名字留在记录里。
⟦OPT|A|set:c09_final_a⟧
#### B｜先要求双方俱乐部公开交易程序与利益冲突声明
旁白：证据进入另一条独立核验流程，接下来的访问权限随之改变。
⟦OPT|B|set:c09_final_b⟧
#·
旁白：交易附件中夹着一份旧事故相关的商业保密协议。

# CHAPTER 10｜决赛前的秘密
⟦GOAL|保护球队调查独立性并处理潜在私人关系冲突|决赛前的秘密⟧
⟦DONE|flag|c10_clue|关键证据到手|旁白：一条需要核查的证据已经摆在桌面上。⟧
⟦DONE|say|向一位男主明确个人与职业边界或表达真实意愿|说清关系边界|旁白：当事人停下手里的事，开始回应你提出的问题。⟧

# SCENE｜季后赛训练馆
⟦BG|bg_c10s01|季后赛训练馆·10:00（Alexander举着战术板，Ethan在边线做康复训练）⟧
⟦TIME|10:00⟧
⟦IF|c09_final_a⟧
旁白：正式审查使联盟派合规官旁听赛前会议。
⟦ELSE⟧
旁白：俱乐部的利益声明显示旧案赞助商与交易谈判有关。
⟦/IF⟧
旁白：球队进入季后赛，安全检查覆盖了整座球馆。
Alexander：“We can chase a cup and do the right thing.”
Ethan：“I’m cleared for practice, not for games.”
旁白：两人都遵守最新医疗许可。
Alexander：“If my feelings complicate your job, say so.”
⟦SET|c10_clue⟧
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。

# SCENE｜慈善青训冰场
⟦BG|bg_c10s02|慈善青训冰场·14:25（Ethan给孩子示范握杆，Jace在边线帮忙）⟧
⟦TIME|14:25⟧
旁白：孩子们用塑料杆练习传球。
Ethan：“You don’t owe us a romance to belong here.”
Jace：“And nobody gets to decide your answer for you.”
旁白：Jace把刚收到的交易争议文件收进口袋。
Ethan：“Can we ask where you want the boundaries?”
⟦IF|c10_clue⟧
旁白：先前保存的记录与眼前的日期、签名逐项比对。
⟦/IF⟧
# CHOICE｜决赛前的秘密：眼前的问题你打算怎么处理
#### A｜说明愿意私下了解某位角色但要求工作回避机制
旁白：Maya打开取证登记表，逐项记录你要求公开核查的材料。
⟦OPT|A|set:c10_mid_a⟧
#### B｜明确保持职业距离，暂不发展任何恋爱关系
旁白：相关原件被封存，Maya安排独立核验并记录接触人员。
⟦OPT|B|set:c10_mid_b⟧
#·
旁白：两份处理记录各自留痕，后续证人将根据程序接受问询。

# SCENE｜证词录制间
⟦BG|bg_c10s03|证词录制间·18:30（Ryan与Maya坐在录音设备两侧）⟧
⟦TIME|18:30⟧
旁白：Ryan终于辨认出关停报警的声音。
Ryan：“It was the sponsor’s operations chief.”
旁白：Maya播放原始录音逐字核对。
Maya：“We will verify independently before release.”
旁白：Ryan签下实名证词，没有要求你回报。
旁白：Maya按下播放键，请你核对原始警报和命令的顺序。
⟦MG|g_m110_audio_verify⟧
⟦IF|mg_g_m110_audio_verify_win⟧
旁白：你确认警报先响、命令后出，独立鉴定有了明确检查点。
⟦SET|audio_sequence_verified⟧
⟦ELSE⟧
旁白：音轨中的噪声影响辨认，Maya将交给专业声学机构。
⟦/IF⟧
⟦FREE⟧
⟦IF|c10_mid_a⟧
旁白：正式登记表增添了一条关于“说明愿意私下了解某位角色但要求工作回避机制”的调查任务。
⟦ELSE⟧
旁白：独立调查员沿着“明确保持职业距离，暂不发展任何恋爱关系”的路径继续核实证据。
⟦/IF⟧

# SCENE｜决赛球馆入口
⟦BG|bg_c10s04|决赛球馆入口·22:10（Damon站在客队通道，Alexander在主队通道）⟧
⟦TIME|22:10⟧
旁白：两队将在决赛相遇。
Damon：“The truth doesn’t belong to either jersey.”
Alexander：“Neither does your decision.”
旁白：匿名威胁被贴在冠军赛门票背面。
旁白：安保已保存门票并启动调查。
Damon：“What should the league know tonight?”
⟦IF|audio_sequence_verified⟧
旁白：你在本章小游戏里取得的“录音证词核验”成果，已加入正式调查卷宗。
⟦/IF⟧
# CHOICE｜决赛前的秘密：关键事件发生后，你如何继续
#### A｜将实名证词交联盟安全委员会并申请保护
旁白：Maya将你的要求写入正式交接单，签收人的名字留在记录里。
⟦OPT|A|set:c10_final_a⟧
#### B｜请外部律师先完成证词鉴定，同时报备威胁
旁白：证据进入另一条独立核验流程，接下来的访问权限随之改变。
⟦OPT|B|set:c10_final_b⟧
#·
旁白：决赛门票上出现匿名威胁：“说出名字，冠军赛就会消失。”

# CHAPTER 11｜终场哨响之前
⟦GOAL|完成冠军赛安全应对并公开已核实的旧案真相|终场哨响之前⟧
⟦DONE|flag|c11_clue|关键证据到手|旁白：一条需要核查的证据已经摆在桌面上。⟧
⟦DONE|say|向队员或调查员明确提出比赛安全与真相公开的优先顺序|作出赛前决定|旁白：当事人停下手里的事，开始回应你提出的问题。⟧

# SCENE｜冠军赛更衣室
⟦BG|bg_c11s01|冠军赛更衣室·17:50（Alexander系好队长袖标，Ethan靠在柜前）⟧
⟦TIME|17:50⟧
⟦IF|c10_final_a⟧
旁白：联盟收到实名证词后派出独立安全员驻场。
⟦ELSE⟧
旁白：鉴定报告确认录音未被剪接，赛事安保同时升级。
⟦/IF⟧
旁白：距离开赛还有十分钟。
Alexander：“We play. If it’s safe.”
Ethan：“And if it isn’t, we walk.”
旁白：球队成员在独立安全员面前签下停赛预案。
Alexander：“What do you need us to hear?”
⟦SET|c11_clue⟧
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。

# SCENE｜决赛场边
⟦BG|bg_c11s02|决赛场边·20:05（Alexander站在护板旁，Damon隔着冰面抬头）⟧
⟦TIME|20:05⟧
旁白：第二节，设备警报在全场响起。
Damon：“That’s the same alarm. Stop play!”
旁白：裁判立即吹哨，全场观众起立。
Alexander：“Nobody crosses that line.”
旁白：安全人员正检查已更换的全部固定件。
Damon：“Do we wait for independent clearance?”
⟦IF|c11_clue⟧
旁白：先前保存的记录与眼前的日期、签名逐项比对。
⟦/IF⟧
# CHOICE｜终场哨响之前：眼前的问题你打算怎么处理
#### A｜支持立即停赛直到安全人员正式放行
旁白：Maya打开取证登记表，逐项记录你要求公开核查的材料。
⟦OPT|A|set:c11_mid_a⟧
#### B｜要求独立检测完成并向球员公布风险再恢复比赛
旁白：相关原件被封存，Maya安排独立核验并记录接触人员。
⟦OPT|B|set:c11_mid_b⟧
#·
旁白：两份处理记录各自留痕，后续证人将根据程序接受问询。

# SCENE｜赛后新闻厅
⟦BG|bg_c11s03|赛后新闻厅·23:15（Ryan站在Maya身旁，Alexander手里没有拿奖杯）⟧
⟦TIME|23:15⟧
旁白：独立检测通过后比赛才恢复，冠军归属由竞技结果决定。
Maya：“The old override was authorized by the sponsor’s executive.”
Ryan：“I signed a false statement. I’m correcting it.”
旁白：联盟宣布启动正式问责与赔偿程序。
Alexander：“We won’t hide behind the scoreboard.”
旁白：发布前，你将媒体询问逐条对照调查文件。
⟦MG|g_m110_statement_check⟧
⟦IF|mg_g_m110_statement_check_win⟧
旁白：四条信息完成核查，球队发布了没有夸大结论的公告。
⟦SET|statement_checked⟧
⟦ELSE⟧
旁白：不确定的信息被移出公告，Maya保留核验后的最小声明。
⟦/IF⟧
⟦FREE⟧
⟦IF|c11_mid_a⟧
旁白：正式登记表增添了一条关于“支持立即停赛直到安全人员正式放行”的调查任务。
⟦ELSE⟧
旁白：独立调查员沿着“要求独立检测完成并向球员公布风险再恢复比赛”的路径继续核实证据。
⟦/IF⟧

# SCENE｜空荡冰场中心
⟦BG|bg_c11s04|空荡冰场中心·23:55（Alexander、Ethan、Jace、Damon、Ryan分散站在冰场边缘）⟧
⟦TIME|23:55⟧
旁白：观众散去，冰面反射着清洁车的灯。
Ryan：“You gave the truth a way back.”
Jace：“You didn’t let me buy forgiveness with charm.”
Ethan：“You listened when safety mattered.”
Damon：“You stayed on your own side: yours.”
Alexander：“Where do you want to go after tonight?”
⟦IF|statement_checked⟧
旁白：你在本章小游戏里取得的“赛后事实核查”成果，已加入正式调查卷宗。
⟦/IF⟧
# CHOICE｜终场哨响之前：关键事件发生后，你如何继续
#### A｜宣布继续为体育安全改革工作，暂不决定私人关系
旁白：Maya将你的要求写入正式交接单，签收人的名字留在记录里。
⟦OPT|A|set:c11_final_a⟧
#### B｜选择结束球队职务，转向独立体育调查与新生活
旁白：证据进入另一条独立核验流程，接下来的访问权限随之改变。
⟦OPT|B|set:c11_final_b⟧
#·
旁白：安全调查公布后，五位男主都在等你亲自决定之后的生活。

# CHAPTER 12｜新赛季，只由你决定
⟦GOAL|结算职业未来与私人关系，开启可持续陪伴|新赛季，只由你决定⟧
⟦DONE|flag|c12_clue|关键证据到手|旁白：一条需要核查的证据已经摆在桌面上。⟧
⟦DONE|say|亲自表达想继续的关系、友情或独立生活方向|说出未来方向|旁白：当事人停下手里的事，开始回应你提出的问题。⟧

# SCENE｜安全委员会发布厅
⟦BG|bg_c12s01|安全委员会发布厅·10:00（Maya站在发布台，Ryan坐在第一排）⟧
⟦TIME|10:00⟧
⟦IF|c11_final_a⟧
旁白：安全委员会向你发出参与改革的正式邀请。
⟦ELSE⟧
旁白：独立体育调查机构向你提出长期合作邀请。
⟦/IF⟧
旁白：四周后，独立安全委员会发布整改结果。
Maya：“The process belongs to the athletes now.”
旁白：承包商的违规维修获得正式处理，伤员得到赔偿安排。
Ryan：“I’ll help the kids who had no voice.”
旁白：你收到继续留任和独立报道的两份邀请。
⟦SET|c12_clue⟧
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。

# SCENE｜公益训练冰场
⟦BG|bg_c12s02|公益训练冰场·15:30（Ethan与Jace带队训练，Alexander在入口观察）⟧
⟦TIME|15:30⟧
旁白：孩子们在冰面上试着第一次转弯。
Ethan：“Some days, healing looks like showing up.”
Jace：“And some days, like admitting you were wrong.”
旁白：Alexander把一份安全检查报告交给青训负责人。
Alexander：“You don’t need my permission for anything.”
⟦IF|c12_clue⟧
旁白：先前保存的记录与眼前的日期、签名逐项比对。
⟦/IF⟧
# CHOICE｜新赛季，只由你决定：眼前的问题你打算怎么处理
#### A｜告诉某位角色愿意在职业边界清晰后继续认识他
旁白：Maya打开取证登记表，逐项记录你要求公开核查的材料。
⟦OPT|A|set:c12_mid_a⟧
#### B｜告诉大家只保持友情或需要更多独立时间
旁白：相关原件被封存，Maya安排独立核验并记录接触人员。
⟦OPT|B|set:c12_mid_b⟧
#·
旁白：两份处理记录各自留痕，后续证人将根据程序接受问询。

# SCENE｜城市河岸步道
⟦BG|bg_c12s03|城市河岸步道·18:45（Damon手握球票，Ryan靠在栏杆边）⟧
⟦TIME|18:45⟧
旁白：夕阳照在河面上，远处能看到训练球馆。
Damon：“I don’t need a rival to tell me who to be.”
Ryan：“I owe my future to doing better. Not to you.”
旁白：两个人各自留下可供单独联系的方式。
Damon：“Whatever you decide, say it your way.”
⟦FREE⟧
旁白：现场的谈话停在这里，下一处地点还留着没有核实的问题。
⟦IF|c12_mid_a⟧
旁白：正式登记表增添了一条关于“告诉某位角色愿意在职业边界清晰后继续认识他”的调查任务。
⟦ELSE⟧
旁白：独立调查员沿着“告诉大家只保持友情或需要更多独立时间”的路径继续核实证据。
⟦/IF⟧

# SCENE｜新赛季球馆前厅
⟦BG|bg_c12s04|新赛季球馆前厅·20:00（五位男主站在不同位置，各自准备离开）⟧
⟦TIME|20:00⟧
旁白：下一赛季的首张赛程表刚贴上墙。
Alexander：“I’ll respect your choice.”
Jace：“Same here. No pressure.”
Ethan：“We can start with a conversation.”
Ryan：“Or no conversation. That is yours too.”
Damon：“So, what life do you want from here?”
# CHOICE｜此刻，你想以怎样的方式继续新赛季
#### A｜主动说出想与五位男主中的哪一位进一步建立恋爱关系，并清楚说明是自愿的
旁白：你明确表达个人意愿，后续由你和被点名的人共同确认边界。
⟦OPT|A|set:c12_final_a⟧
#### B｜明确希望与五位男主维持友情、继续一起经历新赛季
旁白：所有人尊重你保持友情的决定，新的相处方式由你逐步定义。
⟦OPT|B|set:c12_final_b⟧
#### C｜决定把重心放在独立事业与个人生活，暂不发展任何关系
旁白：你接受自己的新计划，俱乐部把工作与私人关系彻底分开。
⟦OPT|C|set:c12_final_c⟧
#### D｜还没有决定未来，愿意先进入自由陪伴的下一阶段
旁白：没有人催促你答复。新赛季仍为你保留开放的故事入口。
⟦OPT|D|set:c12_final_d⟧
#·
旁白：新赛季第一场训练开始，球馆为你保留了一张没有名字的访客证。
⟦IF|c12_final_a⟧
旁白：你主动选择的那个人走近一步，仍停在你允许的距离。
⟦ELSE⟧
旁白：在这座球馆里，关系与事业都不再需要被别人替你决定。
⟦/IF⟧
⟦IF|c12_final_b⟧
旁白：你们约好以朋友身份一起参加公益训练，无需给彼此任何恋爱承诺。
⟦/IF⟧
⟦IF|c12_final_c⟧
旁白：独立体育调查机构收到了你的工作计划，你可以从自己的事业重新出发。
⟦/IF⟧
⟦IF|c12_final_d⟧
旁白：关于未来，暂时没有答案也没有关系；新赛季的日常仍可继续。
⟦/IF⟧

