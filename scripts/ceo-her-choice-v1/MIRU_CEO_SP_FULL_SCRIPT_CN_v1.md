# 《冷面上司的SP协议》｜MIRU 剧本正文 v1.2（48张背景图版）

> 英文工作名：**My Boss's Secret Rules**（商店版暂用 *His Rules, Her Choice*）。中文审阅稿，所有角色已满18岁；故事人物共四位。章内的 `⟦OPT⟧` 是后台自由文本意图判定，不在玩家界面显示选择按钮。每章目标中文正式，`GOAL` 第三个字段为英文目标草案；完整英文逐句本地化尚未完成。
>
> **生产状态**：18章×5个有因果的场景；36个小游戏的配置另见独立清单。此稿完成逐场剧情、关键对白、自由回复入口和状态回填，并于2026-11-17加深了开篇SP秘密、逐章简化了对白。但尚不是24小时可直接播放的逐回合足量脚本；时长见制作手册的差距说明。任何“小游戏”目前均为规格稿，不代表代码模板已实现。

## 后台 premise（以下6段原样展示）

你叫 Ava，28 岁，在纽约一家广告公司做策划。你熬夜写出的提案刚拿下大客户，主管 Veronica 却当众说，是你偷了她的创意。

她不仅抢了你的功劳，还停了你的电脑账号。能证明你清白的原稿，就锁在那台电脑里。

追求你的业务总监 Blake 也在场。他说只要你答应跟他约会，就能帮你压下这件事。你听明白了：他是在拿你的前途做交易。

这时，冷面 CEO Ethan 走进会议室。大家都以为他会开除你，他却拦下主管，把证据推到你面前：“别急着认错。先让她说。”

你还有个不能让同事知道的秘密：你曾在一个成年人自愿参与的 SP（打屁股角色游戏）社群里，和一个匿名男人暧昧地聊了几个月。你们聊过掌控感、停止词，以及哪些事绝对不能做。他很会撩你，却从没逼你线下见面或答应任何玩法。

今晚，Ethan 的一句话让你猛地想起那个男人。难道网上那个总把选择权留给你的人，就是现实里人人害怕的 CEO？现在，你不仅要夺回自己的作品，还要决定：要不要靠近这个可能知道你秘密的男人。

## 全文标记与阅读约定

- `⟦GOAL⟧` 后紧跟 2 条 `⟦DONE⟧`，一条具体 `say`、一条 `flag`；第二条标记均在最后场景或明确动作后 `⟦SET⟧`。
- `⟦BG⟧` 为需要绘制且人物表情必须符合当下剧情的场景；全剧共48张唯一背景图，90个剧情场景按连续环境与情绪复用；第11章暂停私人联系分支使用独处专图。编号见文末对应表。
- `⟦MG|MG_XX_A/B⟧` 固定嵌入第2与第4场。独立文件有全部胜／负／跳过、正确答案、旗标；玩家即使输了也能继续。
- 玩家不预写强制台词；文内“【玩家输入】”由用户亲自打字或使用轻量 AI 建议触发后台 `⟦OPT⟧`。若玩家表达与范围不符，智能体先回应原话、解释当前事实，再自然询问，不替玩家决定。
- SP 指成年人自愿、事前谈清、可以中途停止的私人角色互动。没有涉及露骨身体行为的镜头；职场考核与私密关系彻底分开，拒绝亲密不会损失职场机会。

## 第一幕｜诬陷、初识与拒绝被定义（CH_01—CH_04）

### CH_01《她说创意是偷的》
⟦GOAL|在公开指控里保住自己的发言权，并要求封存原始证据|Keep your voice and secure the original evidence⟧
⟦DONE|say|明确要求封存原始文件或公开核验时间戳|要求封存原件|原始版本就在现场，先让他们别碰。⟧
⟦DONE|flag|ch01_record_sealed|证据已封存|只要文件被封存，谁都不能再偷偷改动。⟧

**章节卡**：第一幕／共享路线；进入：`plot.accusation=open`；承诺：开局两分钟看见 Ethan 先维护程序正义，玩家当众反击；事件=夺回发言权，关系=“他没有替我作决定”，弧光=Ava 从忍耐到质询，世界=广告提案归属与审计留痕；段落预算 P1—P5 各18分钟，仅属 estimated 扩写目标；关键种子 SEED_01（原始文件的彩色标记）；退出：封存原件而非判明真凶；回访：“封存成功，但文件的第一位创建者还没查到。”

**SCN_01_01｜获奖瞬间被截断** ⟦BG|BG48_001⟧
旁白：香槟还没打开，投影上的获奖提案就被换成了举报邮件。Veronica 站在屏幕前，得意地看着你。
Veronica：*用指尖敲了敲投影。* “这是我的创意草稿。Ava，你是不是该解释一下？”
Blake：*把椅子往后推，装作惋惜。* “我早告诉过你，有困难可以来找我。”
Ethan：*推门进来，先看了你一眼。* “原稿还没查，谁说她偷了？”
旁白：他说话的语气让你觉得有点熟。网上那个和你聊 SP 的匿名男人，也总先听你把话说完。会是巧合吗？
【玩家输入】Ethan 看着你：“你想先告诉我什么？”
⟦OPT|CHO_01_OPEN|player_intent=要求保留原稿/时间戳/记录|choice_level=L2|effects=plot.preserve_request:true;relation.ethan_respect:+2|immediate_feedback=Ethan叫停删除动作|next=SCN_01_02⟧
⟦OPT|CHO_01_CHALLENGE|player_intent=要求Veronica当面解释来源|choice_level=L2|effects=plot.public_challenge:true;relation.veronica_tension:+2|immediate_feedback=Veronica明显僵了一下|next=SCN_01_02⟧
⟦OPT|CHO_01_FALLBACK|player_intent=否认/沉默/答非所问|choice_level=L0|effects=memory.asked_for_space:true|immediate_feedback=Ethan允许Ava整理思路且不替她发言|next=SCN_01_02⟧

**SCN_01_02｜文件的指纹** ⟦BG|BG48_001⟧
旁白：Ethan 把投影换成只读模式。屏幕右下角有个几乎看不见的紫色像素点，那是你常用的打样标记。
Ava（玩家行动提示）：你可以指出标记的位置、查看版本号，或者请他把整块屏幕拍下来。
⟦MG|MG_01_A⟧
Ethan：*举起手机，镜头只对准文件。* “我只拍文件，不拍你。可以吗？”

**SCN_01_03｜CEO 的第一条规则** ⟦BG|BG48_002⟧
旁白：Veronica 伸手想合上电脑。Ethan 用一张空白文件袋挡住她的手，没有碰她。
Ethan：“谁拿出证据，谁就要说清楚它从哪儿来。谁被指控，谁就有权看原稿。”
Veronica：“你要为了一个普通员工怀疑我？”
Ethan：“我谁都不偏袒。你，我，都一样。”
【玩家输入】玩家可请求由独立记录保存，或表达愿意暂时离场。两者都不取消后续核验。

**SCN_01_04｜被藏起来的第三页** ⟦BG|BG48_003⟧
旁白：三页电子版本打印后只有两页。第三页不是消失，而是被人调整了打印范围。
⟦MG|MG_01_B⟧
Blake：“Ava，跟我走。我有办法把这事压下去。”
Ethan：*往旁边让了一步。* “留下来查，还是先出去透口气，你自己决定。”

**SCN_01_05｜封条上的名字** ⟦BG|BG48_003⟧
旁白：你看着原稿装进文件袋，封条上写着你的名字和时间。Veronica 笑不出来了。
⟦SET|ch01_record_sealed⟧ ⟦SET|SEED_01_placed⟧
Ethan：*把工牌还给你。* “今天至少有件事做对了：没人能替你认错。”
旁白：你突然想起，网上那个男人也说过一句话：“我只接受你自己愿意的答案。”你忍不住多看了 Ethan 一眼。
旁白：灯快关时，屏幕又跳出一条记录：这个提案文件夹竟然比你入职还早。

### CH_02《总裁说她不能走》
⟦GOAL|阻止立即停职，拿到可独立核验的操作记录|Prevent an immediate suspension and obtain verifiable logs⟧
⟦DONE|say|提出由独立审计保留账号日志而非口头求情|申请独立审计|先把账号日志调出来，不能只有口供。⟧
⟦DONE|flag|ch02_log_hold|日志已保全|日志必须先保全，才谈得上谁登录过。⟧

**章节卡**：共享路线；进入=CH01封存；体验承诺=主管“停职”反被CEO按流程拦下；事件=账号访问，关系=互相尊重工作边界，弧光=Ethan学会不能单靠权力护人，世界=登录审计；P1—P5 proposed；种子 SEED_02（异地设备）；退出日志保存；回访“停职没发生，但你的电脑仍锁着。”

**SCN_02_01｜红色停职通知** ⟦BG|BG48_004⟧
Veronica：*把停职通知推到你面前。* “签字走人，大家都好看。”
Ethan：*将笔盖合上。* “这是处罚通知，不是调查结果。撤回。”
Veronica：“你现在连流程都要教我？”
Ethan：“我不替她下结论。但你们必须听她把话说完。”

**SCN_02_02｜最后一次登录** ⟦BG|BG48_004⟧
旁白：日志显示昨晚 11点47 分，有人用你的账号导出了提案。可那时候，你正从医院给家里打电话，根本没碰电脑。
⟦MG|MG_02_A⟧
Ethan：“有人用了你的账号，不等于那个人就是你。”

**SCN_02_03｜他主动退一步** ⟦BG|BG48_005⟧
旁白：Ethan 看完日志，主动退出决定你去留的审核名单。
Ethan：“我已经卷进这件事，不能再由我决定你走不走。你不用谢我。”
【玩家输入】“你希望我现在做哪一步？”
⟦OPT|CHO_02_AUDIT|player_intent=要求独立保留所有设备日志|choice_level=L2|effects=plot.audit_track:true;relation.ethan_respect:+1|immediate_feedback=日志进入保全队列|next=SCN_02_04⟧
⟦OPT|CHO_02_WITNESS|player_intent=先要求听证与答辩记录|choice_level=L2|effects=plot.hearing_track:true|immediate_feedback=听证时间被记在日程|next=SCN_02_04⟧
⟦OPT|CHO_02_FALLBACK|player_intent=其他/暂时拒绝|choice_level=L0|effects=memory.needs_time:true|immediate_feedback=调查顺延一小时并保全证据|next=SCN_02_04⟧

**SCN_02_04｜锁屏前的一秒** ⟦BG|BG48_006⟧
旁白：在系统自动锁定之前，你看见导出设备的最后四位与公司公用演示机不同。
⟦MG|MG_02_B⟧
Blake：*靠在门口，想碰你的肩又收了手。* “陪我吃顿饭，我就帮你拿回账号。”
Ava（玩家行动提示）：你可以明确拒绝交易，或要求他只提供与工作有关的公开证据。

**SCN_02_05｜谁也别碰记录** ⟦BG|BG48_006⟧
旁白：全部相关登录记录封存成功。Blake 眼里的笑意慢慢褪去。
⟦SET|ch02_log_hold⟧ ⟦SET|SEED_02_placed⟧
Ethan：“明天来查证据。别来求我救你，你不需要。”
旁白：你收到一份没有署名的日志副本。设备代号的前两个字母，竟与主管电脑的旧编号吻合。

### CH_03《他递来的保密协议》
⟦GOAL|识破让你自认有错的协议，并保留自由公开事实的权利|Reject the trap clause and keep the right to tell the truth⟧
⟦DONE|say|指出协议里把沉默等同承认的条款并拒绝签署|拒签陷阱条款|看清第三条，签下去就等于认罪。⟧
⟦DONE|flag|ch03_clause_exposed|陷阱条款曝光|协议的真正目的，现在可以摆到桌面上。⟧

**章节卡**：共享；事件=条款陷阱，关系=Blake 越界、Ethan 尊重否决权，弧光=Ava 练习明确拒绝，世界=民事和解不等于调查；5段 estimated；种子 SEED_03（编辑记录）；退出保留发声自由。

**SCN_03_01｜一百万美元的沉默** ⟦BG|BG48_007⟧
Blake：*转着手里的金笔。* “签了这份协议，你能拿到一百万。只要你认个错。”
Veronica：“机会只有一次。”
Ethan：*看向协议。* “先让她读完。别催。”

**SCN_03_02｜第三条的小字** ⟦BG|BG48_007⟧
旁白：第一页写着“双方和解”。可第三条小字却写着，你承认所有错误。
⟦MG|MG_03_A⟧
Ethan：“你若不签，调查照样继续。”

**SCN_03_03｜不卖清白** ⟦BG|BG48_008⟧
【玩家输入】Blake 弯下腰：“就为了不肯认错，你真想把工作也丢了？”
⟦OPT|CHO_03_REJECT|player_intent=拒绝签字并要求保留调查|choice_level=L2|effects=resource.severance_offer:0;relation.blake_tension:+2|immediate_feedback=Blake撕掉封皮却无法拿走副本|next=SCN_03_04⟧
⟦OPT|CHO_03_EDIT|player_intent=提出删掉认错条款再谈和解|choice_level=L2|effects=plot.counteroffer:true|immediate_feedback=Ethan支持交由独立律师审查|next=SCN_03_04⟧
⟦OPT|CHO_03_FALLBACK|player_intent=不确定/其他回应|choice_level=L0|effects=memory.decision_deferred:true|immediate_feedback=协议暂缓，调查不受影响|next=SCN_03_04⟧

**SCN_03_04｜谁改过签名页** ⟦BG|BG48_009⟧
旁白：纸质协议夹着两版签名页，一版是今天凌晨刚改过的。
⟦MG|MG_03_B⟧
Veronica：*手指发白。* “我只是想让公司别丢脸。”

**SCN_03_05｜没有人能买走你的回答** ⟦BG|BG48_009⟧
旁白：第三条被当场记录为争议条款，你没有交出否认指控的权利。
⟦SET|ch03_clause_exposed⟧ ⟦SET|SEED_03_placed⟧
Ethan：*把没签字的文件还给你。* “你守住了自己的东西。做得好。”
旁白：你在版本记录中看见了一个熟悉的代号——V.S.

### CH_04《下班后，规则换我定》
⟦GOAL|分清工作调查与私人吸引，并说出自己的不可碰触的界限|Separate work from attraction and state your private boundaries⟧
⟦DONE|say|明确要求私人互动与职场评价分离且保留随时拒绝权|说清彼此边界|先把工作和私事分开，任何亲密都得自愿。⟧
⟦DONE|flag|ch04_boundary_recorded|边界已经确认|两个人知道规则，才能谈得上靠近。⟧

**章节卡**：第一幕收束；事件=匿名社群的共同词语出现但不揭身份，关系=吸引与克制同时升温，弧光=Ethan 接受“不”并修正霸道习惯，世界=成人私人俱乐部的最小必要介绍；5段 proposed；种子 SEED_04（“紫雨伞”口令）；退出形成可撤回的边界档案；不触发任何强制性SP桥段。

**SCN_04_01｜雨夜门口** ⟦BG|BG48_010⟧
旁白：晚上十点，办公室里只剩你和 Ethan 等调查回执。外面下着雨，桌上是两杯热茶。
Ethan：*把一杯茶推到你手边，留了半张桌子的距离。* “今晚发生了太多事。要我离开吗？”

**SCN_04_02｜说了就有效** ⟦BG|BG48_010⟧
旁白：你们把话说清楚：工作上的错不能拿到私下“处罚”；谁说停，就立刻停。
⟦MG|MG_04_A⟧
Ethan：“你说停，我就停。这句话必须比任何游戏规则都大。”

**SCN_04_03｜那把紫雨伞** ⟦BG|BG48_011⟧
Ethan：*看见你本子上的紫色雨伞贴纸，愣了一下。* “这把伞……你也喜欢？”
旁白：你想起网上那个和你聊过 SP 的男人。他曾说：“我撑伞是邀请，不是命令。”
【玩家输入】“如果以后我们在工作以外见面，你希望怎么定义那次邀请？”
⟦OPT|CHO_04_SLOW|player_intent=只接受慢慢了解/不谈实践|choice_level=L1|effects=boundary.no_play_until_invited:true;relation.ethan_trust:+2|immediate_feedback=Ethan将话题停在约会和了解|next=SCN_04_04⟧
⟦OPT|CHO_04_CURIOUS|player_intent=愿意了解成人自愿角色互动但保留暂停|choice_level=L1|effects=boundary.private_talk_allowed:true;relation.ethan_trust:+1|immediate_feedback=Ethan主动提出事前清单而非当场要求|next=SCN_04_04⟧
⟦OPT|CHO_04_FALLBACK|player_intent=拒绝/其他/不想回答|choice_level=L1|effects=boundary.private_talk_allowed:false|immediate_feedback=Ethan接受并回到公事|next=SCN_04_04⟧

**SCN_04_04｜暂停比继续重要** ⟦BG|BG48_012⟧
旁白：桌上的纸列了“可以聊”“先不要”“绝对不做”，没有任何已打勾的预设。
⟦MG|MG_04_B⟧
Ethan：“这些规则不是拿来逼你的。不想聊，我们就不聊。”

**SCN_04_05｜一张没有署名的邀请** ⟦BG|BG48_012⟧
旁白：你在自己的本子上写下“私事下班再谈，任何时候都能说停”。Ethan 没有拍照。
⟦SET|ch04_boundary_recorded⟧ ⟦SET|SEED_04_placed⟧
Ethan：*微微笑了。* “你说得算。”
旁白：他的手机在桌上亮起一个图标——和你熟悉的匿名社区很像。但屏幕很快熄了。

## 第二幕上｜流言、代价与身份谜题（CH_05—CH_09）

### CH_05《追求者把你卖了》
⟦GOAL|在客户晚宴上识破 Blake 的交易话术，并维护自己的专业署名|Defend your credit at the client dinner⟧
⟦DONE|say|当面要求活动介绍恢复自己的提案署名|拿回作品署名|这份方案是我写的，名字应该写对。⟧
⟦DONE|flag|ch05_credit_claimed|署名已经提出|公开提出署名，下一步才能追究谁改的。⟧

**章节卡**：共享；事件=公开抢功和利益交换，关系=Ethan 不越俎代庖，弧光=Ava 公共场合发声，世界=客户署名与功劳分配；可中断5段×proposed；SEED_05餐单涂改；退出争议被客户知悉；回访“你争到了发言机会，署名还在审核。”

**SCN_05_01｜空着的名牌** ⟦BG|BG48_013⟧
旁白：酒店晚宴上，你的名牌写着“助理”，Veronica 的名牌却写着“首席创意”。
Blake：*端着酒杯走过来。* “今晚别惹事。你只管笑就行。”
Ethan：*看着你的名牌，皱了皱眉。* “你想怎么处理？我听你的。”

**SCN_05_02｜席卡不是小事** ⟦BG|BG48_013⟧
旁白：名牌打印清单与现场摆放顺序并不一致。
⟦MG|MG_05_A⟧
Veronica：“是工作人员的疏忽。”
Ethan：“那我们就把疏忽的来龙去脉记下来。”

**SCN_05_03｜全场都在等她闭嘴** ⟦BG|BG48_014⟧
Blake：“在这儿反驳我，你就别想接下个单子。”
【玩家输入】“你还要在话筒前说什么？”
⟦OPT|CHO_05_MIC|player_intent=公开要求署名及验稿记录|choice_level=L3|effects=plot.public_credit_claim:true;relation.ethan_respect:+2|immediate_feedback=主持麦克风交还玩家|next=SCN_05_04⟧
⟦OPT|CHO_05_PROOF|player_intent=提交署名证明而不当众争吵|choice_level=L3|effects=plot.private_credit_claim:true;resource.audit_receipt:+1|immediate_feedback=晚宴登记簿加注争议|next=SCN_05_04⟧
⟦OPT|CHO_05_FALLBACK|player_intent=暂时离场/其他|choice_level=L0|effects=memory.public_pressure:true|immediate_feedback=保留会后书面申诉|next=SCN_05_04⟧

**SCN_05_04｜镜子里的改稿人** ⟦BG|BG48_015⟧
旁白：你发现封面文件的修改时间，比晚宴名单的定稿时间还晚。
⟦MG|MG_05_B⟧
Ethan：*侧身替你挡住闪光灯，没有碰你。* “慢慢来。你刚才说得很好。”

**SCN_05_05｜她终于听见自己的名字** ⟦BG|BG48_015⟧
旁白：无论你选择当场说还是书面提交，主持资料均补充“原作者争议待核实”。
⟦SET|ch05_credit_claimed⟧ ⟦SET|SEED_05_placed⟧
Blake：*低声咬牙。* “Ava，你总会需要我的。”
Ethan：“真正的合作从来不是用这个口气开始。”

### CH_06《全公司都看见了假聊天》
⟦GOAL|证明公司群流传的暧昧截图经过拼接，不让流言定义你|Expose the altered chat screenshot⟧
⟦DONE|say|向同场人员指出截图可核验的拼接位置并提出保全源文件|要求核验截图|聊天图被拼过，让我们看原始文件。⟧
⟦DONE|flag|ch06_fake_chat_logged|假聊天已留证|流言证据一旦封存，就能追溯传播路径。⟧

**章节卡**：共享；事件=恶意合成私信，关系=Ethan 不窥探 Ava 手机，弧光=保护隐私即支持，世界=传播记录与数字合成；5段 proposed；SEED_06 蓝色字体差异；退出截图假造疑点登记。

**SCN_06_01｜手机一齐亮起** ⟦BG|BG48_016⟧
旁白：早会刚开始，每个人手机上都弹出一张聊天截图。图里写着，你为了升职去讨好 CEO。
Veronica：“这就是所谓的独立调查？真让人失望。”
Ethan：*把手机扣在桌上。* “一张截图说明不了什么。先查是谁发的。”

**SCN_06_02｜不像你的标点** ⟦BG|BG48_016⟧
旁白：截图里的字一会儿大一会儿小，聊天框边上还有一道奇怪的白线。
⟦MG|MG_06_A⟧
Ethan：“我不会翻你的手机。你愿意给什么证据，由你决定。”

**SCN_06_03｜不解释私生活** ⟦BG|BG48_017⟧
【玩家输入】“他们想让你交出私人账户，你怎么回应？”
⟦OPT|CHO_06_PRIVACY|player_intent=只提交技术证据并拒绝展示私人聊天|choice_level=L2|effects=boundary.private_data_protected:true;relation.ethan_respect:+2|immediate_feedback=调查仅收截图原文件|next=SCN_06_04⟧
⟦OPT|CHO_06_VOLUNTARY|player_intent=自愿仅展示指定一条消息而非整部手机|choice_level=L2|effects=plot.limited_disclosure:true|immediate_feedback=仅目标消息记录入档|next=SCN_06_04⟧
⟦OPT|CHO_06_FALLBACK|player_intent=其他/不想谈私生活|choice_level=L0|effects=boundary.private_data_protected:true|immediate_feedback=Ethan承认隐私权且调查继续|next=SCN_06_04⟧

**SCN_06_04｜谁第一个转发** ⟦BG|BG48_018⟧
旁白：你查到这张图最早不是从群里发的，而是先经过了会议室的投屏电脑。
⟦MG|MG_06_B⟧
Blake：“大家都是为你好，解释一下不就完了？”
Ava（玩家行动提示）：你可以直说：“不是我欠你们解释，是造谣的人欠我解释。”

**SCN_06_05｜被看见的是造假痕迹** ⟦BG|BG48_018⟧
⟦SET|ch06_fake_chat_logged⟧ ⟦SET|SEED_06_placed⟧
旁白：技术疑点写进记录，群里有人撤回二次转发。你没有交出私人账户密码。
Ethan：“你不用跟他们解释自己的人品。我们只查谁改了图。”

### CH_07《CEO 的保护也有代价》
⟦GOAL|选定追查路线：公开程序或私下取证，并确认不靠Ethan特权过关|Choose an evidence path without special favors⟧
⟦DONE|say|明确告诉Ethan选择程序举报或私下搜集可核验记录|选定追查路线|我想走哪条路，要由我来定。⟧
⟦DONE|flag|ch07_route_committed|路线已经确定|先定方法，之后每一步才有依据。⟧

**章节卡**：第二幕上L4路线入口；路径 `route.audit`=程序线、`route.field`=实地线；后面 CH08—13 保留独有场景台词，CH14 转线；事件=调查成本，关系=支持不等于控制，弧光=Ava由辩解变规划，世界=证据链保全；5段 estimated；无额外人物登场。

**SCN_07_01｜他把万能门卡收回去** ⟦BG|BG48_019⟧
Ethan：*把高级门卡收进抽屉。* “我能直接拿到文件，但绕开流程，证据就未必有用。”
Ava（玩家行动提示）：你可以选择合法审计路线，或者用公开资料和现有权限自己还原事情。

**SCN_07_02｜哪条线更稳** ⟦BG|BG48_019⟧
⟦MG|MG_07_A⟧
Veronica：“你们是在故意拖延。”
Ethan：“调查慢一点可以，证据错了不行。”

**SCN_07_03｜这是你的案子** ⟦BG|BG48_020⟧
【玩家输入】Ethan：“我尊重你的决定。你想先用哪种方式查？”
⟦OPT|CHO_07_AUDIT|player_intent=优先正式程序/向独立审计申请|choice_level=L4|effects=route.audit:true;route.field:false;resource.audit_access:+1|risk_notice=会更公开、需要可核验文书|immediate_feedback=程序申请已收件|exclusive_experience=CH08-A审计室核对；CH12-A权限复盘|delayed_payoff=CH16公开听证可直接调用凭据|route_switch=CH14允许转线|next=SCN_07_04⟧
⟦OPT|CHO_07_FIELD|player_intent=优先自己核对公开资料和工作底稿|choice_level=L4|effects=route.field:true;route.audit:false;resource.field_contacts:+1|risk_notice=更快但材料需要追加验证|immediate_feedback=个人资料清单建立|exclusive_experience=CH08-B档案库查找；CH12-B纸质回执复盘|delayed_payoff=CH16可提出更具体的伪造机制|route_switch=CH14允许转线|next=SCN_07_04⟧
⟦OPT|CHO_07_FALLBACK|player_intent=没决定/两条都不喜欢|choice_level=L1|effects=route.audit:true;route.field:false;memory.route_provisional:true|immediate_feedback=先走保守保全程序，CH14仍可调整|next=SCN_07_04⟧

**SCN_07_04｜第一张路径图** ⟦BG|BG48_020⟧
⟦MG|MG_07_B⟧
旁白：你把四个问题写在白板上：文件谁做的，谁碰过，谁传出去，谁得了好处。

**SCN_07_05｜不是他的战利品** ⟦BG|BG48_020⟧
⟦SET|ch07_route_committed⟧
Ethan：*把白板笔递还给你。* “不管怎么查，最后都由你决定要说什么。”
旁白：审计名单出现意外一栏——CEO 的姓名也在被调查人范围里。

### CH_08《谁替你签了字》
⟦GOAL|找出伪造审批的关键差异，确认谁能使用那枚电子签名|Find the forged approval and its access path⟧
⟦DONE|say|提出核对电子签名的创建、访问与实际授权范围|追问签名来源|我没签过，这个签名是谁拿到的？⟧
⟦DONE|flag|ch08_signature_disputed|伪签名已质疑|先把伪签名标出来，才不会被当作事实。⟧

**章节卡**：审计线与实地线不同过程、同一节点汇合；事件=伪签名，关系=Ethan 承认自己流程漏洞，弧光=从“替人扛”改为修规则，世界=权限继承机制；5段 planned；SEED_08旧权限；退出签名效力有争议。

**SCN_08_01｜两份一模一样的授权** ⟦BG|BG48_021⟧
旁白：一份文件写着，你同意让 Veronica 代你提交方案。可签字那天，你根本没来公司。
Ethan：“我看到了自己的审批标记。但我记得没批这份。”

**SCN_08_02｜签名像，时间不像** ⟦BG|BG48_021⟧
⟦MG|MG_08_A⟧
旁白：那枚签名像是从旧文件里贴上去的，边上还留着淡淡的方框。

**SCN_08_03｜两条路，两种发现** ⟦BG|BG48_022⟧
如果 `route.audit`：旁白：正式调查给了你一张带编号的回执。你忙了一整晚，但这份材料能在听证会上用。
如果 `route.field`：旁白：你从旧打印稿里找到一份权限说明。它能帮你查方向，但还得让技术人员核实。
【玩家输入】Ethan：“这处漏洞也有我的责任。你希望我怎么处理？”
⟦OPT|CHO_08_ADMIT|player_intent=要求Ethan正式承认权限漏洞|choice_level=L2|effects=plot.ethan_error_disclosed:true;relation.ethan_trust:+2|immediate_feedback=Ethan录入本人整改说明|next=SCN_08_04⟧
⟦OPT|CHO_08_SEPARATE|player_intent=只谈证据、暂不评价他的责任|choice_level=L1|effects=plot.ethan_error_disclosed:false|immediate_feedback=漏洞暂列独立待查项|next=SCN_08_04⟧
⟦OPT|CHO_08_FALLBACK|player_intent=其他/需要时间|choice_level=L0|effects=memory.response_deferred:true|immediate_feedback=两条路径保留并继续查证|next=SCN_08_04⟧

**SCN_08_04｜谁拿到旧权限** ⟦BG|BG48_023⟧
⟦MG|MG_08_B⟧
Veronica：“一枚签名能说明什么？”
Ava（玩家行动提示）：你可以请记录将其列为争议，不替她下刑事结论。

**SCN_08_05｜他终于说了抱歉** ⟦BG|BG48_023⟧
⟦SET|ch08_signature_disputed⟧ ⟦SET|SEED_08_placed⟧
Ethan：“旧权限没管好，是我的错。对不起。我会把漏洞补上，你不用因此原谅我。”
旁白：你从来没想过，这个人人害怕的男人会先说“我错了”。

### CH_09《匿名男人是他》
⟦GOAL|核对匿名社群里的共同经历，决定是否允许两人继续私下了解|Verify the anonymous connection and choose whether to continue⟧
⟦DONE|say|直接询问Ethan是否是过去那位匿名联系人，并表明是否继续联系|问出匿名身份|那个认真谈边界的人，是你吗？⟧
⟦DONE|flag|ch09_identity_answered|身份疑问解开|问出口，才能让对方给你一个能核实的回答。⟧

**章节卡**：中点；事件=匿名身份线关联，但不能推导“他知道你一切”；关系=秘密从诱惑转化为诚信考验，弧光=Ethan不借匿名信任换现实同意，世界=在线成人社群最小化数据使用；5段 planned；SEED_04回收；退出身份已公开、现实关系仍未预设。

**SCN_09_01｜他记得那句雨伞** ⟦BG|BG48_024⟧
Ethan：*慢慢把一枚紫伞形书签放在桌上。* “我不该让你这么久才知道。那个人是我。”
旁白：你心跳一下快了。那个在网上和你聊 SP、每次都先问你愿不愿意的人，原来是这个冷面 CEO。

**SCN_09_02｜真正的暗号** ⟦BG|BG48_024⟧
⟦MG|MG_09_A⟧
Ethan：“我只知道你在网上告诉我的事。我从没查过你的真实身份。”

**SCN_09_03｜匿名不等于同意** ⟦BG|BG48_025⟧
【玩家输入】“你希望我们的现实关系怎么继续？”
⟦OPT|CHO_09_KNOW|player_intent=愿意私下慢慢了解但不马上进行SP互动|choice_level=L3|effects=relation.romance_open:true;boundary.play_consent:false;relation.ethan_trust:+2|immediate_feedback=Ethan提出无压力的下班咖啡邀请|next=SCN_09_04⟧
⟦OPT|CHO_09_PAUSE|player_intent=要求暂停私下联系直至调查结束|choice_level=L3|effects=relation.romance_open:false;boundary.contact_paused:true|immediate_feedback=Ethan答应只用工作程序联系|next=SCN_09_04⟧
⟦OPT|CHO_09_FALLBACK|player_intent=生气/其他/不确定|choice_level=L1|effects=relation.romance_open:false;memory.identity_shock:true|immediate_feedback=Ethan道歉且不追问|next=SCN_09_04⟧

**SCN_09_04｜有些秘密不能交换** ⟦BG|BG48_026⟧
⟦MG|MG_09_B⟧
旁白：你翻出以前的聊天记录。他很早就说过：“工作上的上下级关系，不能拿来玩私下的控制游戏。”原来他一直这样想。

**SCN_09_05｜真正需要道歉的人** ⟦BG|BG48_026⟧
⟦SET|ch09_identity_answered⟧ ⟦SET|SEED_04_consumed⟧
Ethan：“我喜欢和你说话，也想更了解你。但你可以拒绝，调查照样继续。”
旁白：你没回答。他也没有逼问。会议室外，Veronica 正拿着一张你从未见过的打印纸。

## 第二幕下｜羞辱被反转，规则接受考验（CH_10—CH_14）

### CH_10《她说我自愿被管教》
⟦GOAL|拆穿利用私人偏好污名化你的谣言，并拿回公开解释的边界|Refuse the weaponization of your private life⟧
⟦DONE|say|明确拒绝让任何人用私人偏好评价你的工作能力|阻止私事羞辱|我的私人边界和工作表现没有关系。⟧
⟦DONE|flag|ch10_stigma_rebutted|污名已被反驳|问题不是你喜欢什么，而是谁把隐私当武器。⟧

**章节卡**：第二幕下；事件=匿名私人内容泄露，关系=Ethan公私分离遭公开质疑，弧光=Ava不再为无罪的偏好羞耻；5段 proposed；SEED_10泄漏水印；退出隐私受到独立保护，不能因私好自动撤职；回访“谁偷看了私人记录仍待查。”

**SCN_10_01｜会议上的那三个字母** ⟦BG|BG48_027⟧
Veronica：*将纸投到墙上。* “SP。Ava，你还有什么想说？”
旁白：屏幕上只有几句从匿名社群截来的话。没有名字，更没有任何跟工作有关的证据。
Ethan：*声音冷了下来。* “够了。别拿别人的私事当武器。”

**SCN_10_02｜被剪掉的前提** ⟦BG|BG48_027⟧
旁白：原本写着“成年人自愿，想停就停”的那一行，被人故意裁掉了。
⟦MG|MG_10_A⟧
Ethan：“你不用向全公司解释私生活。该解释的是偷发截图的人。”

**SCN_10_03｜羞耻应属于谁** ⟦BG|BG48_028⟧
【玩家输入】“你要给 Veronica 什么回应？”
⟦OPT|CHO_10_PRIVACY|player_intent=要求停止传播/公开指出隐私与工作无关|choice_level=L2|effects=plot.privacy_objection:true;relation.ethan_respect:+2|immediate_feedback=资料从公共投影撤下|next=SCN_10_04⟧
⟦OPT|CHO_10_TRACE|player_intent=先保留泄露证据并要求追查来源|choice_level=L2|effects=plot.leak_trace:true;resource.leak_snapshot:+1|immediate_feedback=屏幕留存仅供封存|next=SCN_10_04⟧
⟦OPT|CHO_10_FALLBACK|player_intent=沉默/其他/情绪激动|choice_level=L0|effects=memory.shamed_publicly:true|immediate_feedback=Ethan终止会议并保护发言空间|next=SCN_10_04⟧

**SCN_10_04｜匿名文件的水印** ⟦BG|BG48_029⟧
⟦MG|MG_10_B⟧
旁白：截图角落留着一串淡淡的编号。它竟然是公司打印机的任务号。
Blake：“也许只是有人关心你。”
Ethan：“真关心一个人，不会逼她把秘密拿给所有人看。”

**SCN_10_05｜重新抬起头** ⟦BG|BG48_029⟧
⟦SET|ch10_stigma_rebutted⟧ ⟦SET|SEED_10_placed⟧
旁白：投影关了，证据留了下来。Ethan 没再问你的秘密，只站在一旁，等你先离开。
Ethan：“你不需要我的许可，才有资格选择自己要怎样生活。”

### CH_11《他的规则，先问我愿不愿》
⟦GOAL|在下班后的私人谈话里明确可谈与不可谈，并决定是否接受更亲密的了解|State explicit limits before any private intimacy⟧
⟦DONE|say|明确说出愿意了解或暂时拒绝私下角色互动及停止信号|说出停止信号|我可以说不，也可以随时改变主意。⟧
⟦DONE|flag|ch11_consent_answered|自愿意向已说明|两个人都清楚边界，下一步才有意义。⟧

**章节卡**：只在 `boundary.contact_paused` 为假时有私人茶话会；若暂停则以写给自己的边界笔记完成，不强制同场；关系=可选择信任、约会或保持工作关系；弧光=Ethan坚持接受拒绝；5段 planned；不以游戏获得“同意”。

> 第11章全章背景覆盖：若 `boundary.contact_paused=true`，SCN_11_01—SCN_11_05 全部使用 `BG48_032`，Ethan不在场，原私人对白略过；否则按各场BG标记显示。

**SCN_11_01｜一份没有签名栏的清单** ⟦BG|BG48_030⟧
旁白：下班后，休息区只亮着一盏灯。Ethan 拿来一张纸，第一栏写着：“哪些事绝对不能做。”
Ethan：“今晚只聊规则。你不想聊，我们就到这儿。”
如果 `boundary.contact_paused`：改为玩家独立整理个人边界，Ethan 不在场，所有私人对白自动略过。

**SCN_11_02｜红灯比绿灯重要** ⟦BG|BG48_030⟧
⟦MG|MG_11_A⟧
旁白：你把“拿工作来威胁”“当众羞辱”“没问过就碰你”全写在禁止栏里。

**SCN_11_03｜一句完整的拒绝** ⟦BG|BG48_031⟧
Ethan：“你敢拒绝，很好。但你要不要跟我约会，还是由你决定。”
【玩家输入】“若他提出下周只喝咖啡，你会怎么定义？”
⟦OPT|CHO_11_DATE|player_intent=只接受普通约会/了解|choice_level=L2|effects=relation.romance_open:true;boundary.play_consent:false;relation.ethan_trust:+1|immediate_feedback=Ethan约定公开地点、无条件取消|next=SCN_11_04⟧
⟦OPT|CHO_11_TALK|player_intent=愿意仅讨论成人SP偏好和安全词/暂不实践|choice_level=L2|effects=boundary.private_talk_allowed:true;boundary.play_consent:false|immediate_feedback=Ethan补充退出与照护约定|next=SCN_11_04⟧
⟦OPT|CHO_11_NO|player_intent=拒绝约会或不想谈/其他|choice_level=L2|effects=relation.romance_open:false;boundary.private_talk_allowed:false|immediate_feedback=Ethan接受、工作支持不变|next=SCN_11_04⟧

**SCN_11_04｜如果你后悔** ⟦BG|BG48_031⟧
⟦MG|MG_11_B⟧
Ethan：“你随时能反悔，也不用解释。我会立刻停下，先问你还好吗。”
旁白：你们没有真的开始什么，只是先把“可以”和“不可以”说清楚。

**SCN_11_05｜温柔不是奖赏** ⟦BG|BG48_031⟧
⟦SET|ch11_consent_answered⟧
Ethan：*将那张清单合起来，放在你能拿到的位置。* “不管你选择什么，明天我都会遵守职业回避。”
旁白：一则消息提示出现：匿名泄漏所用的打印任务，在同一天还打印了你那份“认错协议”。

### CH_12《他为你交出总裁权限》
⟦GOAL|确认Ethan的正式回避已生效，同时查清两份泄露文件的权限链|Verify the recusal and trace the access chain⟧
⟦DONE|say|要求公开正式的权限回避记录并保全系统操作链|索取回避记录|别只说你会避嫌，我要看正式记录。⟧
⟦DONE|flag|ch12_recusal_verified|回避程序生效|这张回执说明决定你命运的人不再是他。⟧

**章节卡**：L4路线独有核验场景；事件=CEO放权与真权限链，关系=不以辞职表演浪漫，弧光=Ethan接受制度监督，世界=独立审查；5段；SEED_12权限撤销生效时间；退出真正回避完成。

**SCN_12_01｜他签了自己的名字** ⟦BG|BG48_033⟧
旁白：Ethan 在正式回避表上签了字。你没要他辞职，只要求这件事有记录、能查清。
Veronica：“这么做，董事会会觉得你心虚。”
Ethan：“那就让他们看完整记录。”

**SCN_12_02｜谁还有权限** ⟦BG|BG48_033⟧
⟦MG|MG_12_A⟧
旁白：回避声明记录了生效分钟；有一个系统令牌却比声明晚撤销了七分钟。

**SCN_12_03｜路径的区别被看见** ⟦BG|BG48_034⟧
如果 `route.audit`：旁白：你凭正式回执能直接申请系统令牌审阅，流程慢却证据等级高。
如果 `route.field`：旁白：你通过旧纸本找到打印编号，再申请对照；需要多一次独立核验。
【玩家输入】“你希望 Ethan 公开承认那七分钟漏洞吗？”
⟦OPT|CHO_12_PUBLIC|player_intent=要求如实公开漏洞与时间|choice_level=L2|effects=plot.recusal_gap_disclosed:true;relation.ethan_trust:+2|immediate_feedback=Ethan将漏洞写入报告|next=SCN_12_04⟧
⟦OPT|CHO_12_VERIFY|player_intent=先核对再披露|choice_level=L2|effects=plot.recusal_gap_pending:true|immediate_feedback=证据待核但不删除|next=SCN_12_04⟧
⟦OPT|CHO_12_FALLBACK|player_intent=其他/不确定|choice_level=L0|effects=memory.recusal_question_deferred:true|immediate_feedback=回避仍生效，调查继续|next=SCN_12_04⟧

**SCN_12_04｜七分钟里的复制** ⟦BG|BG48_034⟧
⟦MG|MG_12_B⟧
旁白：那七分钟，有一个匿名导出任务使用了旧令牌，却没有经过 Ethan 的个人设备。

**SCN_12_05｜他能做的最难的一件事** ⟦BG|BG48_034⟧
⟦SET|ch12_recusal_verified⟧ ⟦SET|SEED_12_placed⟧
Ethan：“该我承担的责任，我不会躲。以后不能再让别人遇到和你一样的事。”
旁白：Blake 却在走廊等你，手里拿着一张印有私人账号的纸。

### CH_13《他威胁曝光我的秘密》
⟦GOAL|拒绝Blake以隐私换沉默的勒索，并保存他的威胁证据|Refuse Blake's blackmail and preserve his threat⟧
⟦DONE|say|明确拒绝以约会或撤诉换取隐私安全，并要求记录威胁|拒绝隐私交易|不，我不会用约会换你闭嘴。⟧
⟦DONE|flag|ch13_threat_saved|威胁证据已存|把他威胁你的话留下来，别让他倒打一耙。⟧

**章节卡**：事件=追求者的操控升级；关系=Ethan尊重Ava自己处理，弧光=Ava不再讨好有资源的人；5段；SEED_13定时发送截图；退出威胁证据安全。

**SCN_13_01｜红色倒计时** ⟦BG|BG48_035⟧
Blake：*晃着平板，屏幕上有一封待发送邮件。* “今晚八点前答应我，你的秘密就不会传出去。”
Ava（玩家行动提示）：先保全内容，不跟他讨价还价。

**SCN_13_02｜假的定时发送** ⟦BG|BG48_035⟧
⟦MG|MG_13_A⟧
旁白：Blake 给你看的只是邮件草稿，根本没设置定时发送。但他刚才说的威胁是真的。

**SCN_13_03｜不是爱情，是控制** ⟦BG|BG48_036⟧
【玩家输入】Blake：“你至少该给我一个机会吧？”
⟦OPT|CHO_13_RECORD|player_intent=明确拒绝并提出记录威胁|choice_level=L3|effects=plot.blackmail_record:true;relation.blake_tension:+3|immediate_feedback=Blake的言辞被写进当场纪要|next=SCN_13_04⟧
⟦OPT|CHO_13_EXIT|player_intent=拒绝继续谈话并离开/要求安全空间|choice_level=L3|effects=plot.blackmail_record:true;boundary.blake_no_contact:true|immediate_feedback=保全现场资料并退出对峙|next=SCN_13_04⟧
⟦OPT|CHO_13_FALLBACK|player_intent=害怕/其他/不确定|choice_level=L0|effects=memory.blackmail_fear:true;plot.blackmail_record:true|immediate_feedback=保留威胁信息，安全结束当前接触|next=SCN_13_04⟧

**SCN_13_04｜把威胁变证据** ⟦BG|BG48_037⟧
⟦MG|MG_13_B⟧
Ethan：*站在门外，没有直接走进来。* “要我进去陪你吗？你说了算。”

**SCN_13_05｜爱不是欠条** ⟦BG|BG48_037⟧
⟦SET|ch13_threat_saved⟧ ⟦SET|SEED_13_placed⟧
旁白：你保存了 Blake 威胁你的原话。他再说“我只是开玩笑”，也没人会信了。
Ethan：“他说喜欢你，可他根本不想听你说‘不’。”

### CH_14《这次他不能替我出头》
⟦GOAL|自己陈述关键证据，并决定最后走公开程序还是私下核验|Take the lead and settle your final evidence strategy⟧
⟦DONE|say|亲口提出一项关键证据与决定最终程序路线|自己决定出场|我来讲清楚，证据也由我提交。⟧
⟦DONE|flag|ch14_final_route_set|最后路线已锁定|今天定下公开或审慎路线，之后后果由你承担。⟧

**章节卡**：第二幕下L4转线窗口；事件=权力与自主，关系=不让保护掩盖玩家声音，弧光=Ava从受害者成为调查主导；5段；CH15起若公开走正式听证准备，若审慎走有条件私下交叉核验；退出L5高潮路线前置。

**SCN_14_01｜他走到旁听席** ⟦BG|BG48_038⟧
Ethan：*划掉了自己的发言顺序。* “今天让 Ava 来说。我只负责提供证据。”
Veronica：“她凭什么来质问我？”
Ava（玩家行动提示）：你有证据，有知情权，更有提出问题的资格。

**SCN_14_02｜一张没说谎的日历** ⟦BG|BG48_038⟧
⟦MG|MG_14_A⟧
旁白：你把所有改稿时间排好，终于看出了问题出在哪一步。

**SCN_14_03｜公开，还是先拿稳证据** ⟦BG|BG48_039⟧
【玩家输入】Ethan：“我们可以申请公开听证，也可以先做封闭核验。你希望怎么做？”
⟦OPT|CHO_14_PUBLIC|player_intent=选择公开听证、透明披露|choice_level=L4|effects=route.final_public:true;route.final_private:false|risk_notice=隐私暴露可能上升，所有未确认信息须明确标记|immediate_feedback=公开申请提交|route_switch=无，CH14末锁定|next=SCN_14_04⟧
⟦OPT|CHO_14_PRIVATE|player_intent=选择封闭核验、先保护隐私|choice_level=L4|effects=route.final_public:false;route.final_private:true|risk_notice=信息扩散较少，但结果说服力依赖独立签字|immediate_feedback=封闭核验申请提交|route_switch=无，CH14末锁定|next=SCN_14_04⟧
⟦OPT|CHO_14_FALLBACK|player_intent=未决定/其他/想兼顾|choice_level=L4|effects=route.final_public:false;route.final_private:true;memory.last_route_default:true|immediate_feedback=先保存证据、默认审慎核验；再次明确询问后才锁定|next=SCN_14_04⟧

**SCN_14_04｜她敢看自己的证据** ⟦BG|BG48_039⟧
⟦MG|MG_14_B⟧
Veronica：*第一次低下目光。* “你以为这样就能赢？”
Ethan：“声音大没用。她手里有证据。”

**SCN_14_05｜他把镜头交给你** ⟦BG|BG48_039⟧
⟦SET|ch14_final_route_set⟧
旁白：屏幕上只显示你的名字。Ethan 坐在下面，没有抢你的位置。
Ethan：“接下来怎么走，你自己决定。”

## 第三幕｜揭穿、选择与新的规则（CH_15—CH_18）

### CH_15《两份真相，谁都别想藏》
⟦GOAL|补齐原稿、签名与泄露事件的因果链，区分事实和推断|Close the evidence chain without overstating claims⟧
⟦DONE|say|把原稿时间戳与伪造授权按顺序联系起来并说明尚未确认处|讲清证据顺序|这是原稿，这是伪签名，其他部分还要查。⟧
⟦DONE|flag|ch15_chain_complete|证据链已成形|终于可以从头到尾解释这场局。⟧

**章节卡**：第三幕；事件=完整因果，关系=信任建立在事实不是“为爱站队”，弧光=Ava做到证据自律；5段；种子 SEED_01/02/03/05/06/08/10/12/13逐一回收；不新增真凶；退出“确有伪造和胁迫”可验证，而全部个人责任仍由程序处理。

**SCN_15_01｜第一份草稿在你这里** ⟦BG|BG48_040⟧
旁白：桌上摆着你的原稿、改稿记录和导出日志。第一次，所有证据都对上了。
Ethan：“有证据的就说有证据。还在猜的，就别说死。”

**SCN_15_02｜谁改了哪一秒** ⟦BG|BG48_040⟧
⟦MG|MG_15_A⟧
旁白：导出文件和复制签名，用的是同一个旧账号权限。但这还不能证明是谁操作的。

**SCN_15_03｜主管的理由** ⟦BG|BG48_041⟧
Veronica：*笑不出来了。* “我带了十年团队。要是连这个客户都丢了，还有谁记得我？”
Ava（玩家行动提示）：理解动机，不等于认同栽赃。
【玩家输入】“你希望她先回答哪件事？”
⟦OPT|CHO_15_FACTS|player_intent=要求解释改稿记录和权限来源|choice_level=L2|effects=plot.confronted_veronica:true|immediate_feedback=Veronica承认提交过修改版本，但否认所有泄漏|next=SCN_15_04⟧
⟦OPT|CHO_15_HARM|player_intent=要求她承认职业伤害并公开更正|choice_level=L2|effects=plot.demand_correction:true|immediate_feedback=Veronica同意讨论更正而非私下道歉|next=SCN_15_04⟧
⟦OPT|CHO_15_FALLBACK|player_intent=其他/不想逼问|choice_level=L0|effects=memory.no_direct_confrontation:true|immediate_feedback=由证据表陈述事实，继续下一环|next=SCN_15_04⟧

**SCN_15_04｜两个人，两种证据** ⟦BG|BG48_041⟧
⟦MG|MG_15_B⟧
旁白：你能证明 Veronica 改过稿，也能证明 Blake 威胁过你。但他们是不是每一步都串通好了，还不能乱说。

**SCN_15_05｜你终于不用再猜** ⟦BG|BG48_041⟧
⟦SET|ch15_chain_complete⟧ ⟦SET|SEED_01_consumed⟧ ⟦SET|SEED_02_consumed⟧ ⟦SET|SEED_03_consumed⟧ ⟦SET|SEED_05_consumed⟧ ⟦SET|SEED_06_consumed⟧ ⟦SET|SEED_08_consumed⟧ ⟦SET|SEED_10_consumed⟧ ⟦SET|SEED_12_consumed⟧ ⟦SET|SEED_13_consumed⟧
Ethan：“你保护了自己，也保护了真正的调查。”
旁白：最后的核查安排下来了。你可以当面公开说，也可以先做不公开的核对。

### CH_16《今天轮到他们低头》
⟦GOAL|对两种高潮路线分别准备能够经受质询的结论|Prepare a defensible resolution on your chosen route⟧
⟦DONE|say|明确提出撤销指控、恢复署名和保护隐私三项诉求|提出三项诉求|撤销污名，还我署名，别再泄露私事。⟧
⟦DONE|flag|ch16_resolution_drafted|纠正方案成稿|别急着接受道歉，先看结果能不能落地。⟧

**章节卡**：L5高潮分叉；公开线走正式说明会、封闭线走独立证据确认，关键对抗与证据相同但社会成本不同；事件=提出可执行纠正，关系=Ethan在旁支持却不代签，弧光=Ava懂得胜利是修复结果；5段；退出诉求正式记录。

**SCN_16_01｜两扇不同的门** ⟦BG|BG48_042⟧
若 `route.final_public`：旁白：你决定公开说明。玻璃会议室里，四个人面对面坐着。跟私人社群有关的姓名都被遮住了。
若 `route.final_private`：旁白：你决定先私下核对。房间里只有你们四个，所有结论都会留下可核对的签字记录。
Blake：“就算你赢了，外面的人也会猜。”
Ava（玩家行动提示）：你可以承认无法控制所有人的猜测，但可以要求正式纠正。

**SCN_16_02｜改哪一句声明** ⟦BG|BG48_042⟧
⟦MG|MG_16_A⟧
Ethan：“别写什么‘双方误会’。谁做错了什么，就写清楚。”

**SCN_16_03｜她要求的是恢复，不是施舍** ⟦BG|BG48_043⟧
【玩家输入】Veronica：“你还想要什么？我的道歉吗？”
⟦OPT|CHO_16_FIX|player_intent=要求撤销错误指控/署名更正/保密补救|choice_level=L5|effects=plot.restorative_package:true;relation.ethan_respect:+2|immediate_feedback=三项纠正进入正式草案|next=SCN_16_04⟧
⟦OPT|CHO_16_ACCOUNT|player_intent=要求公开说明行为责任并保留依法维权|choice_level=L5|effects=plot.accountability_package:true|immediate_feedback=责任披露被纳入独立说明|next=SCN_16_04⟧
⟦OPT|CHO_16_FALLBACK|player_intent=其他/不确定|choice_level=L1|effects=plot.restorative_package:true;memory.needs_revision:true|immediate_feedback=仅先记录最低三项权利，允许会后补充|next=SCN_16_04⟧

**SCN_16_04｜反击不是复仇** ⟦BG|BG48_043⟧
⟦MG|MG_16_B⟧
旁白：这份声明只需要说清三件事：查到了什么、改正了什么、还有什么没查清。你的私事不用写进去。

**SCN_16_05｜他们无法再让你消失** ⟦BG|BG48_043⟧
⟦SET|ch16_resolution_drafted⟧
Ethan：*看着你的草稿，终于笑了。* “这是你自己争回来的。”
旁白：Veronica 不敢看你。Blake 把手机扣在桌上，再也笑不出来。

### CH_17《把真相放到他们面前》
⟦GOAL|完成终审陈述并让职业纠正正式生效|Complete the hearing and make the correction effective⟧
⟦DONE|say|用自己的话要求独立宣布提案权属与指控纠正结果|宣布事实结论|请把核验后的结果写进正式记录。⟧
⟦DONE|flag|ch17_case_closed|职场指控结案|清白不能只停在一句口头恭喜。⟧

**章节卡**：两高潮结果方式不同；事件=职业澄清与责任区分，关系=Ethan支持而不包办，弧光=Ava站稳；5段；结局前从事实出发而非浪漫关系触发；退出职业案结。

**SCN_17_01｜没人再替你拿话筒** ⟦BG|BG48_044⟧
旁白：你走到屏幕前，手里有原稿、有签名记录，也有自己的话。
Ethan：*坐在非表决席，向你点头。* “我会听着。”

**SCN_17_02｜证据要按次序说** ⟦BG|BG48_044⟧
⟦MG|MG_17_A⟧
旁白：你先拿出原稿，再讲假签名，最后说到泄密和威胁。每一件事都有证据。

**SCN_17_03｜没有英雄替你领奖** ⟦BG|BG48_045⟧
Veronica：*盯着桌上的文件。* “是我把你的名字换掉的。那份修改稿，也是我交的。”
Blake：“我不该拿她的秘密威胁她。”
【玩家输入】“这份书面结果还少了什么？”
⟦OPT|CHO_17_CORRECT|player_intent=要求删去对Ava不实指控并恢复署名|choice_level=L5|effects=plot.professional_reinstatement:true|immediate_feedback=更正函正式生效|next=SCN_17_04⟧
⟦OPT|CHO_17_SAFETY|player_intent=要求封存泄露资料并限制二次传播|choice_level=L5|effects=plot.privacy_remedy:true|immediate_feedback=附加保密补救条款|next=SCN_17_04⟧
⟦OPT|CHO_17_FALLBACK|player_intent=其他/难以当场回应|choice_level=L0|effects=plot.professional_reinstatement:true;plot.privacy_remedy:true|immediate_feedback=按已确认基础方案同时更正与保护隐私|next=SCN_17_04⟧

**SCN_17_04｜最后一次真假核验** ⟦BG|BG48_046⟧
⟦MG|MG_17_B⟧
旁白：你一条条核对文件。作者已经改回你的名字，错误指控撤销了，私人生活也不会被拿来考核。

**SCN_17_05｜她的名字回来了** ⟦BG|BG48_046⟧
⟦SET|ch17_case_closed⟧
旁白：系统里终于删掉了你“涉嫌违规”的标签。你的署名回来了，处分也撤销了。至于他们各自要承担什么责任，公司还会继续调查。
Ethan：“不用谢我。今天是你自己赢回来的。”

### CH_18《以后，规则由我来定》
⟦GOAL|确认未来事业和关系由自己选择，并与Ethan或独立人生达成清楚承诺|Choose your next chapter on your own terms⟧
⟦DONE|say|清楚表明想与Ethan如何相处，或选择专注自己的事业|说出下一步|从今往后，我会自己决定和谁同行。⟧
⟦DONE|flag|ch18_future_chosen|未来选择落定|只要这是你的决定，就是属于你的结局。⟧

**章节卡**：结局分发；事件=职业机会与自主安排，关系=开放恋爱／慢速约会／独立事业都非坏结局，弧光=Ava建立自己的边界，Ethan学会尊重不确定性，世界=公司修规与私人生活重新开始；5段；四轴结算详见世界人物母档。

**SCN_18_01｜清晨重新打开电脑** ⟦BG|BG48_047⟧
旁白：新的一天，你的账户恢复了。项目档案里，作者一栏是你的名字。
Ethan：“不管你留在这里还是去别处，推荐信都只写你的成绩。”

**SCN_18_02｜给未来的自己排顺序** ⟦BG|BG48_047⟧
⟦MG|MG_18_A⟧
旁白：你给自己列了三件事：收好更正函，备份作品，再慢慢想清楚要不要谈恋爱。没人能替你排顺序。

**SCN_18_03｜他不再替你写答案** ⟦BG|BG48_048⟧
Ethan：*在离你一步远的地方停下。* “我还想见你。但不管你的答案是什么，我都接受。”
【玩家输入】“现在，你想怎样定义未来？”
⟦OPT|CHO_18_ROMANCE|player_intent=愿意以工作外、平等的成年人身份慢慢相处|choice_level=L5|visible_if=无强制条件|effects=ending:END_TENDER;relation.romance_open:true;commitment.slow_date:true|immediate_feedback=Ethan只约一杯咖啡并确认取消自由|next=SCN_18_04⟧
⟦OPT|CHO_18_FRIEND|player_intent=愿意保持尊重和友情、不启动恋情|choice_level=L5|effects=ending:END_ALLIES;relation.romance_open:false|immediate_feedback=Ethan祝福且不继续追求|next=SCN_18_04⟧
⟦OPT|CHO_18_SOLO|player_intent=选择离开公司/独立事业/暂不联系|choice_level=L5|effects=ending:END_SOVEREIGN;relation.romance_open:false|immediate_feedback=署名与推荐信不受影响|next=SCN_18_04⟧
⟦OPT|CHO_18_FALLBACK|player_intent=其他/不确定|choice_level=L5|effects=ending:END_OPEN;relation.romance_open:false|immediate_feedback=未来保持开放，Ethan不追问|next=SCN_18_04⟧

**SCN_18_04｜最后一道规则** ⟦BG|BG48_048⟧
⟦MG|MG_18_B⟧
如果 `ending:END_TENDER`：旁白：你们约好下班后喝杯咖啡。至于网上聊过的 SP，还得两个人重新谈清楚，谁也不能默认对方答应。
如果 `ending:END_ALLIES`：旁白：你们很欣赏彼此，但不打算谈恋爱。这样也很好。
如果 `ending:END_SOVEREIGN`：旁白：你带着自己的作品离开公司。下一站去哪儿，由你自己说了算。
如果 `ending:END_OPEN`：旁白：你还没想好要不要跟他在一起。没关系，今天不用回答。

**SCN_18_05｜她亲手关上文件** ⟦BG|BG48_048⟧
⟦SET|ch18_future_chosen⟧
Ethan（仅非独立结局在场）：*将桌上的空白笔记本推给你，笑意温柔。* “新的一页，你来写。”
旁白：你翻开新本子，在第一页写下自己的名字。窗外的纽约依旧很吵，可你心里终于安静了。

## 章内自由输入的统一兜底语料（非强制台词）

1. 玩家提出与当前危机相关的新办法：由当前知情角色先回应可行性，并给出一个具体核验入口；不得凭空发放隐藏证据。
2. 玩家拒绝继续或要求停下：立即停止私人互动；主线可沿独立调查继续，不能扣“爱意”。
3. 玩家表达身体不适或害怕：先确认安全，暂停压力场景，再提供书面核验或稍后处理；不可强行让男主拥抱。
4. 玩家问“SP是什么”：角色可简洁解释成年人的自愿权力角色互动；“打屁股”是该社群常见词义，但不描述露骨过程，也不把它变成工作惩罚。
5. 玩家想追查超出该章权限的信息：角色承认“我还不知道”，记录问题到 `unresolved_conflict` 并给可达的下一场；不得用全知视角泄密。
6. 玩家使用 AI 帮我想：按当前场景生成不超过3句第一人称候选；不能弹出可见选项大按钮；用户点词句后发出的是玩家自己的话。




## 48张背景图与场景对应表

18章和90个剧情场景保留。下列48张为唯一图片资源，不另加54张高光变体；重要表情与动作直接纳入这48张CG。条件分支优先于默认BG。

| 背景编号 | 章节 | 画面 | 对应场景 | 条件 |
| --- | --- | --- | --- | --- |
| BG48_001 | CH_01 | 指控与原稿 | SCN_01_01, SCN_01_02 | always |
| BG48_002 | CH_01 | 谁也不能关掉证据 | SCN_01_03 | always |
| BG48_003 | CH_01 | 把原稿留在桌上 | SCN_01_04, SCN_01_05 | always |
| BG48_004 | CH_02 | 被拦下的停职 | SCN_02_01, SCN_02_02 | always |
| BG48_005 | CH_02 | 总裁主动退开 | SCN_02_03 | always |
| BG48_006 | CH_02 | 账号换约会的交易 | SCN_02_04, SCN_02_05 | always |
| BG48_007 | CH_03 | 一百万的陷阱 | SCN_03_01, SCN_03_02 | always |
| BG48_008 | CH_03 | 她不肯低头 | SCN_03_03 | always |
| BG48_009 | CH_03 | 签名页的破绽 | SCN_03_04, SCN_03_05 | always |
| BG48_010 | CH_04 | 雨夜的两杯茶 | SCN_04_01, SCN_04_02 | always |
| BG48_011 | CH_04 | 那把紫雨伞 | SCN_04_03 | always |
| BG48_012 | CH_04 | 由她写下边界 | SCN_04_04, SCN_04_05 | always |
| BG48_013 | CH_05 | 被改掉的名牌 | SCN_05_01, SCN_05_02 | always |
| BG48_014 | CH_05 | 她拿回发言权 | SCN_05_03 | always |
| BG48_015 | CH_05 | 迟来的署名更正 | SCN_05_04, SCN_05_05 | always |
| BG48_016 | CH_06 | 被恶意截图围住 | SCN_06_01, SCN_06_02 | always |
| BG48_017 | CH_06 | 私生活不是证据 | SCN_06_03 | always |
| BG48_018 | CH_06 | 看见拼接的白线 | SCN_06_04, SCN_06_05 | always |
| BG48_019 | CH_07 | 收起万能门卡 | SCN_07_01, SCN_07_02 | always |
| BG48_020 | CH_07 | 她画自己的路径 | SCN_07_03, SCN_07_04, SCN_07_05 | always |
| BG48_021 | CH_08 | 复制出来的授权 | SCN_08_01, SCN_08_02 | always |
| BG48_022 | CH_08 | 漏洞也有他的责任 | SCN_08_03 | always |
| BG48_023 | CH_08 | 一句真正的道歉 | SCN_08_04, SCN_08_05 | always |
| BG48_024 | CH_09 | 紫伞书签的主人 | SCN_09_01, SCN_09_02 | always |
| BG48_025 | CH_09 | 现实关系重新选择 | SCN_09_03 | always |
| BG48_026 | CH_09 | 门外的陌生打印纸 | SCN_09_04, SCN_09_05 | always |
| BG48_027 | CH_10 | 隐私被当成武器 | SCN_10_01, SCN_10_02 | always |
| BG48_028 | CH_10 | 她拒绝被定义 | SCN_10_03 | always |
| BG48_029 | CH_10 | 水印指向打印机 | SCN_10_04, SCN_10_05 | always |
| BG48_030 | CH_11 | 没有签名栏的清单 | SCN_11_01, SCN_11_02 | !boundary.contact_paused |
| BG48_031 | CH_11 | 拒绝也被认真听见 | SCN_11_03, SCN_11_04, SCN_11_05 | !boundary.contact_paused |
| BG48_032 | CH_11 | 独自写下自己的边界 | SCN_11_01, SCN_11_02, SCN_11_03, SCN_11_04, SCN_11_05 | boundary.contact_paused |
| BG48_033 | CH_12 | 他签下回避记录 | SCN_12_01, SCN_12_02 | always |
| BG48_034 | CH_12 | 七分钟的权限漏洞 | SCN_12_03, SCN_12_04, SCN_12_05 | always |
| BG48_035 | CH_13 | 拿秘密换一次约会 | SCN_13_01, SCN_13_02 | always |
| BG48_036 | CH_13 | 她把威胁留下来 | SCN_13_03 | always |
| BG48_037 | CH_13 | 爱不是欠条 | SCN_13_04, SCN_13_05 | always |
| BG48_038 | CH_14 | 总裁坐到旁听席 | SCN_14_01, SCN_14_02 | always |
| BG48_039 | CH_14 | 最后路线由她决定 | SCN_14_03, SCN_14_04, SCN_14_05 | always |
| BG48_040 | CH_15 | 所有证据终于对上 | SCN_15_01, SCN_15_02 | always |
| BG48_041 | CH_15 | 主管说出她的理由 | SCN_15_03, SCN_15_04, SCN_15_05 | always |
| BG48_042 | CH_16 | 她提出三项纠正 | SCN_16_01, SCN_16_02 | always |
| BG48_043 | CH_16 | 更正不是施舍 | SCN_16_03, SCN_16_04, SCN_16_05 | always |
| BG48_044 | CH_17 | 这次由她陈述 | SCN_17_01, SCN_17_02 | always |
| BG48_045 | CH_17 | 他们终于无法否认 | SCN_17_03 | always |
| BG48_046 | CH_17 | 名字回到作品上 | SCN_17_04, SCN_17_05 | always |
| BG48_047 | CH_18 | 重新打开属于她的作品 | SCN_18_01, SCN_18_02 | always |
| BG48_048 | CH_18 | 新的一页由她来写 | SCN_18_03, SCN_18_04, SCN_18_05 | always |
