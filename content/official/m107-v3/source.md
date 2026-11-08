# MIRU M107《月蚀之誓》｜V3.0 完整互动剧本交付说明

**用途：**本稿是面向美国成年女性用户的英文角色对白＋中文制作导演指令的完整编剧/外包执行母稿。包含30章主线、原90个基础场景、V2强化场景、V3新增30场独立演出、30章选择及即时反馈、跨章分支、结局、50场背景规格、音乐/音效/人物动态/天气特效与小游戏策划。**不包含已生成的真人图片、音频或运行代码，也没有经过MIRU生产引擎的实机验收；因此属于完整内容制作稿，不是已上线安装包。**

## 正式执行约定（必须优先于旧版模板）

- 播放顺序以**因果时间**为准：各章 `SCENE_A/B/C`、`EXT_A/B` 和 `CHXX_V3` 按文中明确插入位置排序；`CHOICE_XX` 仅在对应实际演出完成后弹出。不得机械把新增段落全部播放在章末。
- 玩家可见故事文案与角色台词英语；中文仅供制作说明。角色台词中的 `YOU` 为可自由输入或玩家确认的可选文本，不是系统替玩家发言。
- 主要可见决策必须记录 `FLAGS / REL / PLAYER / WORLD`；重复选择不得重复加分。事件奖励具有 `event_id` 去重；读档保持角色衣着、天气、已做决定的一致性。
- **人物独宠的表现**优先是可见行动与代价：Kael失军权，Rowan交出不利己的证词，Lucien主动放弃预知；这三件事不能根据玩家选择哪位男主而凭空取消。
- **四类分支**：亲密/朋友；信任/待修复；证据取得方式；世界政治制度。四类独立，不可把世界路线绑定恋爱路线。
- **跳过小游戏仍可完成主线**，仅失去额外线索或改变补救方式。声音需包含字幕与减少动态效果选项。全部BGM须原创或有适当授权。
- **角色资产和背景图ID**在原文 C/K/L/M 节可查；若演员服装、印戒状态随剧情变化，须使用对应图层变体，不能用同一张静态图硬替。

## 关键状态硬约束

`K_POWER_LOST`自CH16为真，直到CH26改革也不能无因恢复首领军权；`ROWAN_UNFORGIVEN` 禁止CH23/28/30默认情侣告白；`LUCIEN_PROPHECY_LOST` 自CH22不可恢复预言；`REAL_K_KISS`, `REAL_R_KISS`, `REAL_L_KISS` 均须玩家主动、角色同意后才能为真；`PROPHECY_KISS_VIDEO`仅为伪造影像绝不能写入亲密记忆；`WORLD.POLICY_FINAL`与`ENDING_RELATIONSHIP`分别存储，不互相覆盖。

## 外包拆单与质量闸口

1. **编剧验收：**30章逐场逐选项走读；每章至少一个角色主动偏爱或真实信任变化、一个可交互决策、一个有效回响；反转均能回指原有伏笔。
2. **美术验收：**50个BG主稿＋雨/雪/昼夜/损伤等必要分层变体；三名男主姿态、微表情、眨眼、呼吸、伸手、转身；背景主角视觉一致、字幕区域可读。
3. **音频验收：**10组原创配乐主题或变奏、SFX清单、对话优先ducking、暴雨/雷声/心跳混音不盖对白。
4. **程序验收：**30个章节状态保存点、30个互动小游戏/替代路径、主要分支回归测试、五条结局和开放世界首周事件；支持断线、跳过、无声、减少动态。
5. **上线闸口：**素材交付、版权/许可证明、全英语玩家可见文本校对、跨分支脚本自动化检查和人工实机试玩全部通过才可称为正式上线版。

---

# MIRU M107《月蚀之誓》 ECLIPSE OATH｜V3.0 完整演出与分支交付稿

> **文档定位：**30章完整原稿＋30章V2新增戏剧场景＋30章V3可播放补全场景＋90个基础场景的执行标记＋关键跨章分支与状态回响＋50张人物背景的具体外包提示词＋角色动态、音乐音效、环境/心动特效和小游戏制作说明。
> **交付方式：**文字与资产规格可供剧情、视觉、音频、程序外包团队分工；不是已经渲染完成的背景、声音、动画或可运行代码。
> **玩家体验：**英文UI和角色对白；中文分镜/制作指令。9:16竖屏、720×1280及更高分辨率适配。主角成年女性，三名成年男主。

## 重要导演原则

1. **情绪回报不能靠NPC强迫用户爱。**开头3分钟建立“危险时坚定选择你”；中段每3–4章兑现一次“他为你失去某种东西”的可见后果；后期“恋爱与自由不矛盾”。
2. **真反转必须变更世界事实或资源。**CH07 Kael失军权；CH14 Rowan承认污点；CH15 预言是假制度；CH16 Kael失Alpha身份；CH20 Lucien失记忆；CH22失预知；CH25强制恋爱是陷阱；CH26重构誓约。
3. **分支是世界状态，不是按钮换一句话。**三位男主各维护 `trust/attraction/commitment`，同时存 `boundaries`、证据、改革票、亲密事实与未决道歉。关键状态读取表见文末。
4. **所有角色都有独立目标。**Kael的改革、Rowan/Iris平反、Lucien的去预言化，与玩家是否恋爱无关，不能因为拒绝约会就放弃拯救世界。
5. **互动游戏只提供玩法说明，供外包coding实现。**失败/跳过不阻塞主线。互动不替玩家做出身体接触、公开关系、牺牲或婚约选择。

## 30章三幕与节奏安排

| 幕 | 章节 | 关系与爽点 | 连续反转 | 玩家真正能改变 |
|---|---|---|---|---|
| 第一幕：被三人寻找 | CH01–10 | 公开保护、交出家族权限、危险男人给退路、预言者说出真相 | 银箭来自议会；旧照被剪裁；Kael签过错误命令；Dorian封谷 | 各人物初始信任、第一批证据、公开规则、同行路线 |
| 第二幕：他为你失去 | CH11–20 | 舞会公开拒绝政治联姻、放弃预言、暴雨拒绝交人、被救的人反向成为盟友 | 假恋爱仪式；Rowan曾监视姨母；镜子伪造；Kael失权；月井囚禁拒绝之声 | 恋爱/友情边界、是否原谅、舆论与证据、营救方案 |
| 第三幕：爱不是契约 | CH21–30 | 当众自证、陪伴失去预知的人、恋人选择彼此的日常、自己建立新世界 | 假录像、月蚀人为制造、强制亲密反而喂井、旧誓可终止 | 新世界制度与真实结局；12周开放生活 |

## 外包编码的共同场景顺序

每章播放顺序：`CHXX_PRELOAD`（预载音图）→ `SCENE_A` → `SCENE_B` → `SCENE_C` → `CHXX_EXT`（本次新增的戏剧高潮，见各章）→ `CHOICE_XX`（先看条件才显示）→ `GAME_XX`（可跳过）→ `STATE_COMMIT` → `SAVE` → `END_HOOK`。若新增高潮应插入在原文更早的情节节点，按明确的场景因果把 EXT 切为 `EXT_A/EXT_B`，不得机械地放到章末。

**所有对白应由美国母语编辑在正式上线前校正配音节奏。** 文中配音稿是可供录音预排的原创对白，不是录制成品。

---

# 原版设定与资源母表（已纳入V2.0）

**底稿版本：V1.0（已整合V2.0新增演出）｜美国女性向狼人幻想恋爱互动剧｜30章完整文本制作稿**  
**语言：**玩家可见对白与UI为自然美式英语；中文为导演指令、场景说明、分支逻辑及校对译意。  
**规格：**9:16竖屏；人物和环境合成背景（所有主场景背景须有人物）；每章3个固定叙事场景＋1个可触发自由对话节点；章节结尾可中断并保存。  
**定位：**成人超自然浪漫、三位成年狼人男性、豪门族群斗争、命运印记、权力反转、独宠/危险守护/灵魂共鸣、可持续陪伴。  
**年龄：**玩家为25岁以上成年女性（玩家可改显示名）；Kael 29，Rowan 27，Lucien 30。所有角色成年。  
**边界：**灵魂印记不构成恋爱义务；所有亲密互动须由玩家自主确认。默认允许拒绝、只做朋友、暂不选择，不因拒绝而锁死主线。

> **商业宣传核心句：** The alpha who commands the pack bows to you. The outcast who trusts no one gives you his last secret. The wolf who sees every future has never been able to see a life without you.

## A. 玩家承诺与剧情基本设定

二十六年前，银月族群曾以“月蚀誓约”封住北境山谷下的古老月井。誓约需要三枚狼印：首领之印、流亡之印、预言之印。它们分别落在三位狼人身上。玩家在继承已故姨母的黑松庄园后，发现自己能听见月井的回声，却始终保留人类身体与自由意志。族群把她称为“Moonbound”，认为她必然要与首领缔结伴侣契约；但事实是，玩家能够决定三枚狼印是服从旧秩序、归还给每个族群，还是彻底解除誓约。

**内核：**不是“被三个男人分配”，而是三个强者都愿意在她面前放下他们最珍视的东西。玩家不仅决定爱情，还决定一个世界如何运行。

**作品的独宠逻辑：**每个男主都以长期行动证明偏爱，不以随机送礼和强制宣誓代替关系发展；越靠近，越要付出代价，并让玩家看见代价。

### 三位男主的不可替代魅力

**Kael Ashford｜29｜北境狼群首领 Alpha｜金棕发、琥珀眼、黑色大衣。**公开克制、私人柔软、承担全族的压力。核心幻想：万人听令的他，只在你面前认真征求同意。旧伤：曾在错误命令中失去亲人。人物底线：宁可失去王位也不拿你献祭。称呼随信任从“Miss”→“my brave girl”（需玩家接受）→玩家指定昵称。

**Rowan Vale｜27｜被逐出的银狼、追踪者｜黑发、灰绿眼、旧皮夹克。**危险、尖锐、有幽默感，行动式守护。核心幻想：所有人觉得他会背叛，唯独他把自己的退路交给你。旧伤：为护住被指控的妹妹背上叛徒污名。人物底线：不会以威胁、跟踪、嫉妒胁迫玩家。称呼从“Trouble”→“sweetheart”（经同意）→玩家专属昵称。

**Lucien Voss｜30｜月影族预言者｜银黑长发、蓝灰眼、深色高领。**温柔但不柔弱，能看到概率分叉却看不到玩家的决心。核心幻想：他能预测灾祸，却第一次愿意为你放弃确定的未来。旧伤：童年曾被当成神谕工具。人物底线：未经允许不读取玩家私密记忆。称呼从“Moonbound”→“darling”（经同意）→玩家选定。

**主要配角：**Mara（玩家姨母的好友，58岁，庄园管家，可靠支持者）；Iris（Rowan妹妹，25，独立狼族药剂师）；Evelyn Crane（41，议会监察长，主张恢复旧誓约，理性对手，非单纯疯批）；Dorian Ashford（Kael叔父，48，真正操控历史记录的人）。

## B. 编剧与引擎共同约定

### 玩家状态字段

```yaml
PLAYER:
  name: "You"
  boundaries: {touch: unknown, nickname: unknown, exclusive: false}
  agency: 0       # 自主权获得与表达，范围0~100
  moon_resonance: 0
  evidence: []
  pack_policy: undecided   # old_oath|free_packs|seal_well
  companions: []
REL:
  kael: {trust: 0, attraction: 0, commitment: 0}
  rowan: {trust: 0, attraction: 0, commitment: 0}
  lucien: {trust: 0, attraction: 0, commitment: 0}
FLAGS: {}
```

**初始化：**agency=30；三个男主trust=10、attraction=10；其余0。所有数值更新均钳制在0—100。行为选择不是“正确答案”，可持续改善或修复关系。**选择朋友关系时跳过亲吻/伴侣专属演出，不强制进入恋爱。**

### 默认视听与制作协议

- `BG_xx`：9:16人物合成动态背景；人物主视线在中上区域，底部35%留字幕交互空间。每次切换须保持人物服装、发型与天气连续。
- `BGM_xx`：仅定义音乐情绪与进入/退出方式，不使用未授权的现有歌曲。
- `WX`：物理天气特效（风、雨、雪、雾、雷、月光）；`EMO`：情绪效果（心跳、暖光、冷色抽离、呼吸、狼瞳变化）；`SFX`：环境声音。
- 特效不得妨碍文本阅读。默认动态减弱选项`reduce_motion`下，闪电改为短暂亮度变化、心动粒子减少、雷声音量上限降低。
- 每章结尾先执行`save_state`，再显示下一章按钮；自由对话输出不可直接修改硬性世界事实，只能提出角色反应和合法的状态变更请求。
- 触摸互动只描述**需要做什么**，不提供小游戏程序；任何小游戏失败可通过剧情替代路线推进，不锁死章节。

### 分支统一写法

每章`CHOICE`列出A/B/C三条，各有**即时台词、状态变量、以后回响**。关键分支有独立后续场景；非关键分支汇合时必须读取前面行为，例如是否让角色握手、是否公开名字、谁陪过夜。`SCENE`中的方括号是条件播放，不是玩家可见文本。状态阈值仅用于决定**受欢迎的主动邀约**，不用于剥夺剧情参与权。

## C. 视觉、音乐、天气资源索引

### 50个背景图（全部包含人物，制作规格）

| ID | 背景主体（必须入镜人物） | 天气/时间 | 主要章节 |
|---|---|---|---|
| BG01 | 玩家视角，门口Kael黑大衣迎接 | 暴风雨夜 | 1 |
| BG02 | Rowan靠在黑松庄园门廊，湿发 | 雷雨夜 | 1、5 |
| BG03 | Lucien立于挂满月图的书房 | 烛光夜 | 1、3 |
| BG04 | Kael与狼群成员立于议会厅 | 冷金晨光 | 2 |
| BG05 | Rowan与玩家前景手部、身后森林 | 大风黄昏 | 2、4 |
| BG06 | Lucien在银月温室中 | 清晨薄雾 | 2、12 |
| BG07 | Kael置身壁炉客厅，袖口挽起 | 雨夜 | 3、8 |
| BG08 | Rowan站在禁林栈桥 | 月夜有雾 | 3、9 |
| BG09 | Lucien面对发光石井 | 月光 | 4、15 |
| BG10 | 三男主在餐厅各据一侧，玩家第一视角 | 暖夜 | 4、20 |
| BG11 | Kael在训练场护住新人 | 晴午 | 5 |
| BG12 | Rowan在悬崖边回头伸手 | 狂风暮色 | 5、10 |
| BG13 | Lucien在古旧档案馆扶起落书 | 灯火夜 | 6 |
| BG14 | Mara与玩家面对家族照片墙 | 雨晨 | 6、11 |
| BG15 | Kael出席月议会，旁有监察官 | 月光室内 | 7 |
| BG16 | Rowan与Iris在隐秘药剂铺 | 阴雨午后 | 7、13 |
| BG17 | Lucien半跪湖畔辨认符文 | 蓝雾夜 | 8 |
| BG18 | 三人站在黑松森林环形石阵 | 满月 | 9、18 |
| BG19 | Kael背靠浴后蒸汽的医务室门框 | 雨夜 | 9 |
| BG20 | Rowan在旧车库修机车看玩家 | 午夜暖灯 | 10 |
| BG21 | Lucien置身萤火图书露台 | 夏夜 | 10、14 |
| BG22 | Kael与玩家在星灯露台跳舞 | 星夜微风 | 11 |
| BG23 | Rowan与玩家在河岸篝火旁 | 夜间微风 | 11 |
| BG24 | Lucien在玻璃穹顶下持星图 | 流星夜 | 12 |
| BG25 | 三人站在被封锁的月井洞口 | 雷雨夜 | 12、17 |
| BG26 | Iris在人群前展示证据 | 雾晨 | 13 |
| BG27 | Kael在祖宅旧琴房，柔软神情 | 午后斜阳 | 13 |
| BG28 | Rowan登上废弃瞭望塔 | 雪前灰天 | 14 |
| BG29 | Lucien倚靠预言室破碎镜面 | 暗蓝夜 | 15 |
| BG30 | Evelyn坐在银白议事台前 | 深夜 | 15、21 |
| BG31 | Kael与玩家在雨中的玻璃廊桥 | 暴雨闪电 | 16 |
| BG32 | Rowan冒雪在门前卸下武器 | 初雪深夜 | 16、22 |
| BG33 | Lucien在月池旁举起一盏灯 | 雪夜 | 17 |
| BG34 | 三男主在庄园地图室面对危机 | 烛光夜 | 18 |
| BG35 | Kael在人群前递上首领戒 | 月食前夕 | 19 |
| BG36 | Rowan在废教堂交出真实档案 | 阴云晚霞 | 19 |
| BG37 | Lucien于红月下保护孩童 | 红月夜 | 20 |
| BG38 | 三人在冬季舞会门口等玩家 | 室内金灯/室外雪 | 20 |
| BG39 | Kael在公开审判中央独自站立 | 冷白上午 | 21 |
| BG40 | Rowan在断桥上与玩家并肩 | 旋风夜 | 21 |
| BG41 | Lucien在神谕树下撕毁预言卷轴 | 月夜 | 22 |
| BG42 | Kael与族人种树、玩家前景 | 雪后晴天 | 23 |
| BG43 | Rowan与Iris在归乡集市摊前 | 夕阳 | 23 |
| BG44 | Lucien和玩家在空旷观星台 | 星空 | 24 |
| BG45 | 三人于月蚀圣坛不同方位守护玩家 | 月食开始 | 25 |
| BG46 | 狼群、Evelyn、玩家面向月井光柱 | 月食高潮 | 26 |
| BG47 | Kael与玩家在日出山脊相望 | 日出 | 27、30K |
| BG48 | Rowan与玩家在雨停后的公路边 | 破晓 | 28、30R |
| BG49 | Lucien与玩家在生长新花的月池 | 春夜 | 29、30L |
| BG50 | 三男主与Mara、Iris站在重建庄园庭院 | 春日晨光 | 30N/后日谈 |

### 曲库情绪编号

`BGM01` Welcome to Blackpine：大提琴低音、稀疏钢琴，神秘；`02` Alpha's Promise：暖弦乐、克制鼓点；`03` Wild Route：低鼓与呼吸节拍；`04` Moonlit Confession：钢琴与轻人声垫（无歌词）；`05` Council Teeth：紧绷弦乐；`06` Discovery：拨弦悬念；`07` Shelter：轻柔钢琴；`08` Eclipse Rising：宏大管弦与脉冲；`09` Choice Is Yours：简洁钢琴主题；`10` New Dawn：温暖合成器＋弦乐。**禁止未经授权使用现成影视歌曲。**

### 特效规则速记

`WX_RAIN_L/M/H`小/中/暴雨；`WX_WIND_L/H`微风/强风；`WX_LIGHTNING`低频闪电（先亮后雷，最少间隔12秒）；`WX_SNOW`薄雪；`WX_FOG`流雾；`WX_MOON`月尘与月光移动；`EMO_HEART`双心跳+浅粉暖光0.8秒（仅玩家主动靠近、双方自愿）；`EMO_WOLF`虹膜金光0.5秒（狼性觉醒）；`EMO_SILENCE`环境音瞬间收窄1.5秒；`FX_ECLIPSE`月食遮光与反射；`FX_MEMORY`镜面转场/记忆颗粒。所有VFX提供低动态替代选项。

---

# D. 正篇30章（按实际玩家播放顺序）

**阅读方式：**台词前角色名为speaker；`YOU`选项由玩家选择，不预先替玩家说出未选台词。每章下方`CHOICE`附带具体条件与未来回响。一般场景的叙述为制作注释，不能直接当英文旁白上屏。


## CH01｜三个陌生人，只有一个知道你的名字 / Three Men at the Gate

**场景01A｜BG01庄园铁门** `[BGM01 0→55%; WX_RAIN_H+WX_WIND_H; SFX铁门链条; 镜头玩家POV推门]`

暴雨中，黑松庄园的铁门从内侧打开。穿黑色大衣的Kael没有撑伞，他背后停着数辆狼族车辆。你只知道姨母刚去世，她给你留下一栋庄园；这个男人却准确说出了你的小名。

**KAEL:** “You made it. Good. I wasn't going to let this storm be the first thing Blackpine did to you.”

**YOU（玩家自由回应，不预置）**

**KAEL:** “I'm Kael Ashford. I'm here because your aunt trusted me. Whether *you* trust me is your decision.”

雷声打断他。Kael脱下大衣，但只把它搭在旁边扶手上供你自取；若玩家主动接受，触发`EMO_HEART`极弱版。镜头掠过他脖颈上的古银色狼印。

**场景01B｜BG02门廊** `[BGM01降至25%; WX_LIGHTNING仅1次; SFX皮靴踏水]`

Rowan从暗处出现，手里拿着沾泥的庄园钥匙。

**ROWAN:** “Careful. He only smiles like that before a council meeting.”

**KAEL:** “Rowan. You are not welcome here.”

**ROWAN（对你）:** “Your aunt left me a warning. She said to deliver it to you, not to the man who runs this valley.”

Rowan当众把钥匙放到地上，后退一步，不强迫你靠近。Kael不阻拦你自己捡。

**场景01C｜BG03书房门口** `[BGM04进入; WX_RAIN_M玻璃雨声; EMO_SILENCE 1秒]`

书房灯突然自己亮起。Lucien站在一张摊开的旧星图旁，似乎已经等了很久。

**LUCIEN:** “I've seen this night a hundred times. In every version, someone tells you what you must be.”

**YOU（可自由问）**

**LUCIEN:** “I'd like to be the first person to tell you something else: you get to decide.”

墙上一面镜子闪出三个狼影，正中央是一只**没有狼影的你**。月井第一次轻声叫出玩家自定义名字。


### CH01_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**开局就给“他为我承担风险”的体验，不是三人轮流自我介绍。

**新增场景 EXT_A｜情绪冲突与可见代价**

门廊里Kael的副手举枪命令你露出手腕验证月纹。Kael挡在枪口前，摘下象征权限的黑银徽章放到地上：没有你的允许，任何人不得检查。

```text
KAEL: “Look at me, not the guns. Nobody gets to touch you to prove you belong here.”
GUARD: “Alpha, council protocol—”
KAEL: “Then write down that I broke it.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

Rowan从暴雨里递来姨母最后一封没寄出的信，封口刻着你小时候的小名。你不打开也能拿走；他并不索取相信。

```text
ROWAN: “I could have sold this for a way home. I didn’t.”
LUCIEN: “Three men have come to claim an answer. Only one of us bothered to ask what she wants.”
```

**跨章分支读取与不可偷渡的后果：**若选择Kael，副手被撤职并在CH07为Kael作证；选择Rowan，获得信封边角证物且CH06优先触发真相；选择Lucien，镜子里的第四道影子在CH04重现。

**本章独立悬念镜头：**门外忽然传来无线电：议会已发令，午夜前将把“继承人”带走。

**小游戏（仅策划，程序外包）：**门廊手机震动后给玩家选择“公开拒绝检查 / 私下接受保护 / 要求三人离开”；别做按对成功率的战斗小游戏。

**背景/音乐/音效/环境/动画：**BG01→BG02→BG03；BGM01低弦→00:09压低→SFX枪机保险→EMO_SILENCE 1.2s→雨滴近景；Kael摘徽章时环境停顿0.4s。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH01_EXT_DONE`，并与原本 `CHOICE_01` 结果合并，不覆盖原本选择。


### CH01_V3｜新增逐场可播放演出与独立分支

**V3新增：门外的名字（在01B之后、01C之前执行）** `[BG02; 雨幕前景35%; BGM01切低频鼓点; SFX枪栓2声; ACT_K_GUARD_STEP]`
守卫喊出你未公开的法律姓名，要求“签署接管授权”。你刚说“我没有签”，Kael就把羊皮纸扯成两半。纸上竟然已经出现你的笔迹。**YOU（可输入）**；无论玩家是否接近Kael，他都说：**KAEL:** “You don't have to trust me. But nobody in this valley gets to make your decisions for you.” 守卫指出违反议会令会冻结他的军权。Kael回答：**“Then freeze it.”** 显示首领徽章由亮变暗；在CH07真正执行惩罚。Rowan认出纸上墨水来自议会档案室，却没有立刻公开自己的偷窃史；Lucien在镜子中看到被涂掉的署名“E.C.”。
**可玩分歧：**公开撕毁伪授权→`FLAG_PUBLIC_REFUSAL`，CH02议会人群认得你；先保留纸张取证→`EVID_FORGED_SIGNATURE`，CH21法庭可展示；私下向Mara求证→`MEM_MARA_ASKED`，CH04先找到姨母笔记。三条路都不承诺恋爱。**演出结尾：**镜面出现“Your consent is the lock.” 播放单次倒吸气而非尖叫。

**CHOICE 01｜立即分叉（需要点击、不是随机动画）**
- **A 跟Kael进入庄园：**“Show me what my aunt trusted you with.” → **KAEL:** “Everything I can prove. Nothing I have to ask you to believe.” `kael.trust+8; FLAG_KAEL_ENTRY=1`；CH03他主动交出家族钥匙。
- **B 接过Rowan的钥匙：**“Then tell me what they don't want me to know.” → **ROWAN:** “Finally. Someone asking the interesting question.” `rowan.trust+8; FLAG_ROWAN_KEY=1`；CH03解锁禁林栈桥秘密短场。
- **C 跟Lucien看镜子：**“Show me the truth, not a prophecy.” → **LUCIEN:** “I can show possibilities. The truth is what we uncover together.” `lucien.trust+8; FLAG_MIRROR=1`；CH03提前看到月印图。

**互动小游戏：**“镜中狼影”轻触三个反射，指出哪个影子没有出现。触发：01C镜子亮起后。成功直接得到线索`EVID_MISSING_SHADOW`；失败由Mara次章解释，剧情照常推进。**自由聊天：**在门廊可向任一角色提一个问题；自动将该问题写入对应角色记忆。**章末钩子：**玩家腕上出现一圈只有月光才能照出的银纹；书房玻璃写着：“THE OATH IS A LIE.”


## CH02｜狼群为你让路 / Make Way for Her

**场景02A｜BG04议会厅** `[BGM05; SFX低声议论; EMO_WOLF在狼群集体回头时]`

Kael带你进入议会厅。长桌两侧是近百位成年族人。Evelyn要求你按旧礼向首领行礼。

**EVELYN:** “The Moonbound is expected to kneel before the Alpha.”

**KAEL（不提高音量）:** “Then the expectation is wrong.”

Kael把首领席旁边的椅子推到你面前，自己站着。

**KAEL:** “She is my guest, not my property. Speak to her like a person or don't speak at all.”

**场景02B｜BG05森林边** `[BGM03; WX_WIND_L; 叶片从左到右吹动]`

会议散场Rowan拦住你，不挡去路，指向树皮上的三个爪痕。

**ROWAN:** “Your aunt carved these the night she disappeared. She wasn't afraid of wolves. She was afraid of the people making rules for them.”

**ROWAN:** “I'm not asking you to trust me. I'm asking you to notice who keeps trying to make you hurry.”

**场景02C｜BG06温室** `[BGM04; WX_FOG晨雾; 玻璃透出淡月光]`

Lucien展示一株遇到玩家掌心会发亮的夜铃花。

**LUCIEN:** “The well answers you because it remembers a promise. Not because it owns you.”

你触碰花瓣，花里投射出姨母声音：“Find the three seals.”


### CH02_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**公开偏爱不只是给椅子，要有政治代价。

**新增场景 EXT_A｜情绪冲突与可见代价**

议会提案让你签署《月印监护令》，纸页上你的姓名已经被他人预填。Kael当众撕去“服从首领”段落，支持他的长老当场离席。

```text
EVELYN: “A guest cannot rewrite a treaty.”
KAEL: “Then stop calling it hospitality.”
KAEL (to you): “You can say no to me, too. Especially to me.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

Rowan带你看被掩埋的旧族碑；Lucien辨认出姨母名字旁的日期被改过，且真正的誓约多出一位未署名证人。

```text
ROWAN: “They buried the date, not the dead.”
LUCIEN: “This isn’t a prophecy. It’s a contract someone edited.”
```

**跨章分支读取与不可偷渡的后果：**若要求改规则，CH07有基层狼族公开支持；若查旧碑，CH11获得证人牌；若共鸣花，CH09月井识别失败可自动补救。

**本章独立悬念镜头：**一位长老喊出：“你们忘了二十六年前第一次月蚀究竟死了谁？”

**小游戏（仅策划，程序外包）：**交互：让玩家决定在宣读规则时是否按下公开录音（后续证据强度）；不强制擅自录制私密场景。

**背景/音乐/音效/环境/动画：**BG04冷金→BG05大风→BG06晨雾；BGM05拨奏警觉；SFX纸张撕裂近景、席位刮地；光线从Kael身上移到玩家视角。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH02_EXT_DONE`，并与原本 `CHOICE_02` 结果合并，不覆盖原本选择。


### CH02_V3｜新增逐场可播放演出与独立分支

**V3新增：狼群分开的一条路（02A后）** `[BG04→BG05; BGM05压低; FX_眼瞳琥珀辉光; SFX人群鞋底摩擦]`
议会要求你从地上跪着穿过人群。年轻狼人Tessa抬起头，腿却仍在发抖。Kael没有说“为她跪下”，而是走到你的身侧，先坐在冰冷石阶上。**KAEL:** “If they want you to feel small, I'll sit here until they learn better.” 你可要求他站起来、请Tessa起身、或公开宣读新规则。选择任何一项，Tessa都获得姓名而非成为无名道具。稍后她递上一枚被敲坏的族徽：只有“被挑选者”才被强制跪下。
**分支专属演出：**A `POLICY_EQUAL_PATH`：你要求所有人让出通道，CH07支持者出现；B `MEM_TESSA_SUPPORT`：优先扶Tessa，CH18她主动送来后门钥匙；C `FLAG_OBSERVE_COUNCIL`：暂不出声、记下执法者面孔，CH21可用于指认。**音效：**人群由嘈杂到安静1.5秒，Tessa金属徽章落地只响一次。

**CHOICE 02**
- **A 要Kael公开更改迎接仪式：**“Change the rule, not just my chair.” → **KAEL:** “You're right. Protection that depends on my mood isn't protection.” `agency+8; kael.trust+5; FLAG_REFORM_RITE=1`；CH07议会支持票+1。
- **B 跟Rowan追爪痕：**“Take me where she made these.” → **ROWAN:** “Boots first. Heroics later.” `rowan.trust+6; evidence+=TRACK_MARK`；CH04多一条追踪线索。
- **C 请Lucien教你控制月光：**“Don't tell me I'm special. Teach me.” → **LUCIEN:** “Best request I've heard in years.” `lucien.trust+6; moon_resonance+10`；CH04月井互动提示增加。

**互动：**“夜铃花共鸣”，按花朵亮起顺序轻触三次（可跳过）。**章末：**议会登记册赫然显示姨母二十六年前的签名——旁边是Kael已故母亲的名字。


## CH03｜他把钥匙交给你 / The Key He Kept

**场景03A｜BG07壁炉客厅** `[BGM07; WX_RAIN_L; SFX柴火爆裂]`

Mara拿出姨母遗嘱：庄园只属于你，狼群没有管理权。Kael当着Mara把西翼的钥匙和一份支出账册交给你。

**KAEL:** “Your aunt said a home isn't safe if someone else controls the locks.”

**KAEL（若CH01选A）:** “I said I'd show you proof. This is the first piece.”

**KAEL（否则）:** “You don't owe me a chance to explain. But the records are yours.”

**场景03B｜BG08禁林栈桥** `[BGM06; WX_FOG+水滴; SFX木桥轻响]`

[若`FLAG_ROWAN_KEY`，Rowan亲自带玩家到栈桥；否则玩家发现地图后来此，Rowan从树后出现。] 木板下藏一只密封铁盒，里面是一张被撕掉一角的老照片：三枚狼印，原本属于三个不同族群。

**ROWAN:** “My sister got blamed for stealing the silver seal. That's the official version.”

**ROWAN:** “The unofficial version? She was the only one who tried to give it back.”

**场景03C｜BG03月图书房** `[BGM04; WX_MOON; FX_MEMORY短暂浮现星图]`

Lucien对照照片指出一个不一致：预言书上写“Moonbound必须牺牲”，但最初的誓约是“由Moonbound决定”。

**LUCIEN:** “Someone changed one word. It's a small lie with a very large graveyard behind it.”


### CH03_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**让“安全感”变成可检查的实际交付。

**新增场景 EXT_A｜情绪冲突与可见代价**

Kael把保险箱钥匙、园区通行码和财务权限放在桌上，承认他过去曾为了保护家族保留信息。玩家可核验、拒收或让Mara保管。

```text
KAEL: “If I ask for your trust, you get to audit what I do with it.”
MARA: “That would be a first around here.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

Rowan让你看旧照背后被裁去的一角：Dorian当年的身形与银印一致。Lucien不让你只凭照片定罪，提出找完整原片。

```text
ROWAN: “I wanted a villain. What I found was a missing corner.”
LUCIEN: “Proof matters more than a satisfying story.”
```

**跨章分支读取与不可偷渡的后果：**交出账本会开启CH19审计线；照片调查开启CH14 Rowan自白额外对话；保存誓文为CH21审讯获得第二证据链。

**本章独立悬念镜头：**旧胶片显影：姨母手写的警告不是“别相信Kael”，而是“别相信你看见的那张照片”。

**小游戏（仅策划，程序外包）：**互动：查阅三处账目异常并手动标记，失败由Mara核对；输出线索而非英雄评分。

**背景/音乐/音效/环境/动画：**BG07壁炉暖光→BG08冷月→BG03书房；BGM07→06，SFX壁炉爆响/铁盒扣锁，FX_MEMORY颗粒3s。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH03_EXT_DONE`，并与原本 `CHOICE_03` 结果合并，不覆盖原本选择。


### CH03_V3｜新增逐场可播放演出与独立分支

**V3新增：钥匙不是赠礼（03A后）** `[BG07; BGM07室内弦乐; ACT_K_KEY_PALM; SFX钥匙落木盒]`
Kael打开家族保险盒，把能进入银箭仓库的总钥匙放到你面前，却故意把他自己那把折断。**KAEL:** “I could ask you to believe I'm different. I'd rather give you the one thing that could prove I'm not.” 他说明从今天起，任何新命令都必须经过公开复核。你可以接过钥匙、把钥匙交Mara共管、或暂时封存；拒绝接触不会让他恼怒。Rowan在旧栈桥发现姨母写给妹妹Iris的一张残损收据，背面标有月井水位。
**选择长尾：**自己持钥→`EVID_MASTER_KEY`, CH06独立开仓；交Mara→`FLAG_SHARED_CUSTODY`, CH19证据更易被公众相信；封存→`FLAG_KEY_SEALED`, CH21通过证人开仓。**情绪点：**被爱慕不是“他把全世界送给你”，而是“他主动降低自己的权力”。

**CHOICE 03**
- **A 与Kael一起公开账册：**“If we're asking people to trust us, let them see the numbers.” → **KAEL:** “I was afraid they'd call it weakness. You make it sound like leadership.” `kael.trust+7; agency+4; FLAG_LEDGER_PUBLIC=1`；CH07支持度提升。
- **B 与Rowan保密调查：**“We find who framed Iris before we tell the council.” → **ROWAN:** “Thank you for saying her name.” `rowan.trust+7; evidence+=TORN_PHOTO; FLAG_IRIS_PRIORITY=1`；CH07妹妹态度改善。
- **C 请Lucien复制原文：**“Don't predict it. Preserve it.” → **LUCIEN:** “A future can be argued about. Ink is harder to threaten.” `lucien.trust+7; evidence+=OATH_VARIANT`；CH15审议额外证据。

**互动：**照片拼接，拖动被撕的碎片（未成功则Lucien协助）。**章末：**照片背面写着三个名字，其中一个被刮掉——Dorian。


## CH04｜你的名字不在预言里 / The Name They Erased

**场景04A｜BG09月井边** `[BGM06; WX_MOON+WX_FOG; SFX井水倒流]`

Lucien带你来到月井外围。水面映出狼印，偏偏玩家的名字是一片空白。

**LUCIEN:** “Every oracle in this valley has tried to predict you. None of us can.”

**LUCIEN:** “I used to think that made you dangerous. Now I think it makes you free.”

**场景04B｜BG05林地** `[BGM03; WX_WIND_H; SFX远处狼嚎]`

Rowan教你辨别三种狼族脚印。一个看不见的人从森林抛出银箭，Rowan用手臂挡开，立即退到安全距离，等你决定去留。

**ROWAN:** “I'm fine. Ask me about the blood after we get you out of the open.”

**ROWAN（轻笑）:** “For the record, terrible first date. Excellent first survival lesson.”

**场景04C｜BG10庄园餐厅** `[BGM07; 灯火稳定; 玩家入席]`

三个人第一次和你共进晚餐。Kael说他派人调查银箭；Rowan坚持自己寻找射手；Lucien把一瓶止血药推给Rowan。

**KAEL:** “We can disagree on how to protect her without turning her into a prize.”

**ROWAN:** “Then start by asking what *she* wants.”

**LUCIEN:** “An excellent and embarrassingly overdue idea.”


### CH04_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**主角首次主动反制命运，带来一瞬极强被选择感。

**新增场景 EXT_A｜情绪冲突与可见代价**

月井映出你被迫戴上月印的未来，Kael的未来影像正强迫你签字。现实中的Kael毫不犹豫打碎投影石，宁愿让自己的族群看到“首领违抗预言”。

```text
KAEL: “If a vision makes me hurt you, it’s not a future I’ll obey.”
YOU (optional): “And if I don’t choose you?”
KAEL: “Then I’ll still stand between you and anyone who tries to make that choice for you.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

Lucien第一次承认自己曾亲手复制过含有错误誓文的预言，因此负有责任；Rowan追踪印记证明影像经过人为伪造。

```text
LUCIEN: “I helped preserve the lie. I won’t ask you to forgive that.”
ROWAN: “Someone wanted you scared enough to run into the wrong arms.”
```

**跨章分支读取与不可偷渡的后果：**相信影像与否只改变对Kael的私人信任，绝不改变他作为NPC反对献祭的行动；CH15镜面调查分两种证据提示。

**本章独立悬念镜头：**井壁出现第四枚印：不是狼印，而是人类的手掌。

**小游戏（仅策划，程序外包）：**互动：选择对倒影发问/验证时间印记/退出月井；三条都可抵达CH05。

**背景/音乐/音效/环境/动画：**BG09深蓝井面→BG05风林；BGM06渐强，FX_MEMORY伪未来；SFX石片碎裂，拒绝频闪。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH04_EXT_DONE`，并与原本 `CHOICE_04` 结果合并，不覆盖原本选择。


### CH04_V3｜新增逐场可播放演出与独立分支

**V3新增：被删掉的第四个名字（04A后）** `[BG09; BGM04→短暂无音乐; FX井面文字倒写; SFX水滴逆流]`
月井边的石碑依次显示三个狼印，随后出现你姨母的名字，却被一道黑色划痕覆盖。Lucien伸手想触碰石碑，又停下请你决定。**LUCIEN:** “I was taught every answer came from the moon. Your aunt left me a question instead.” 你选择以手指描摹、请Lucien读旧语、或将刻痕拓印；当刻痕发光时，众人听见姨母年轻时的声音：**“A promise made under fear is not a promise.”** 镜面跳出你未来向狼王屈膝的幻象，但Lucien立即说明它可能是伪造投影。
**分支：**拓印→`EVID_ERASED_NAME`; 听译→`MEM_LUCIEN_DOUBTS`; 不信幻象→`FLAG_PROPHECY_SKEPTIC`。**特效：**字迹反向游动，禁用过度闪烁；字幕始终可读。

**CHOICE 04**
- **A 让Kael负责公共安全：**“Put guards around the roads. Not around my bedroom.” → **KAEL:** “Done. Your privacy stays yours.” `kael.trust+6; agency+4; FLAG_GUARDS_ROADS=1`；CH05遇袭人数减少。
- **B 和Rowan调查银箭：**“Show me how to read that trail.” → **ROWAN:** “Careful. I might actually fall for someone who can keep up.” `rowan.attraction+8; evidence+=SILVER_ARROW`；CH09认出袭击者路线。
- **C 和Lucien测试水面：**“If the prophecy can't name me, what can it see?” → **LUCIEN:** “Your choices. Never your chains.” `lucien.attraction+6; moon_resonance+8`；CH09石阵更稳定。

**互动：**“寻找伪装狼印”，在三张脚印间选出不合常理的一张。**章末：**银箭箭尾刻着议会仓库的出入编号。


## CH05｜他为你挡下的不是箭 / Not the Arrow

**场景05A｜BG11训练场** `[BGM02; SFX木剑碰撞; 日光强]`

Kael教年轻狼族控制变身时的恐惧。一名少年因银箭事件失控，Kael挡在你与少年之间，却没有命令少年下跪。

**KAEL:** “Look at me, Finn. You're not a monster for being afraid.”

**KAEL（对你）:** “I learned leadership from someone who called fear a weakness. I don't intend to pass that on.”

**场景05B｜BG12悬崖边** `[BGM03; WX_WIND_H; 人物衣摆、发梢物理摆动]`

你与Rowan追踪箭尾来到悬崖。石壁塌落，他抓住你衣袖防止跌落，确认你站稳后立刻放开。

**ROWAN:** “You okay? Don't answer to make me feel better.”

**ROWAN:** “I know what it feels like when people decide what you are before you open your mouth.”

他把自己被驱逐当天的追踪牌交给你，这是第一次主动公开过去。

**场景05C｜BG02暴雨门廊** `[WX_RAIN_M渐起; BGM07; EMO_HEART仅条件触发]`

夜里Rowan来归还你遗落的手套。Kael正好开门。两人没有争吵，只把选择留给你。

**KAEL:** “The guest room's warm. There are fresh towels, if you need them.”

**ROWAN:** “I can leave. I just wanted her to have this back.”


### CH05_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**首次大危机里亲密必须是事后温柔与可拒绝的照顾。

**新增场景 EXT_A｜情绪冲突与可见代价**

训练场的银箭直冲玩家而来，Kael先推开新人再以自己肩膀挡箭；Rowan在屋顶截获第二支箭。说明不是偶发袭击，而是精心安排两层狙击。

```text
KAEL (breathless): “Check on the others first.”
ROWAN: “Two shooters. Someone really wanted you to think one hero could save you.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

你可以留在医务室陪Kael，也可以跟Rowan追查箭羽，或向Lucien求证银箭原料。Kael不因你离开而责备。

```text
KAEL: “You don’t owe me your bedside because I took a hit.”
LUCIEN: “Silver from the old council vault. That’s a signature, not a coincidence.”
```

**跨章分支读取与不可偷渡的后果：**CH08仅当实际照顾Kael触发手心私密回忆；追箭开启CH10黑市供货链；求证银箭在CH21作为合法证据。

**本章独立悬念镜头：**伤口里取出的银片刻着Kael家族库房编号。

**小游戏（仅策划，程序外包）：**互动：选“止血/呼救/先确保路安全”三种协作方式，所有路线都救到人，影响谁记得你的冷静。

**背景/音乐/音效/环境/动画：**BG11训练场→BG12崖风→BG19雨夜医务室；BGM08冲击后立即静音0.8s；SFX箭啸、金属落地、呼吸近场；禁血腥特写。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH05_EXT_DONE`，并与原本 `CHOICE_05` 结果合并，不覆盖原本选择。


### CH05_V3｜新增逐场可播放演出与独立分支

**V3新增：从弩箭到病房（05B与05C间）** `[BG12→BG19; WX_WIND_H骤停; SFX弓弦/布料撕裂/远雷; BGM02停0.8s再进BGM07]`
一道银箭冲向你的肩侧。Kael并非凭空瞬移：他先听到绞盘声、推开你身后的木门，箭刺穿他的袖口与肩护。你能选择自己先止血、叫医生、或追看箭羽；三个方向的救援都由NPC协助完成，避免不合理地让玩家单挑。**KAEL（呼吸不稳）:** “Don't look at the blood. Look at me. Did it hit you?” 若玩家表示害怕，答：**“You can be scared. I am, too.”** 他第一次承认自己也会恐惧。
**选择结果：**救护→`MEM_K_BANDAGE`, CH08含专属手心回忆；取箭→`EVID_COUNCIL_ARROW`, CH07证据演出；追手→`FLAG_SHADOW_TRACK`, CH10黑市追踪。失败/跳过小游戏，Mara仍带回残箭，但去掉额外证据细节。

**CHOICE 05**
- **A 请Kael陪你确认安全：**“Stay until the thunder passes.” → **KAEL:** “Of course. We can talk, or sit in silence.” `kael.attraction+7; FLAG_STORM_KAEL=1`；CH08壁炉私人话题升级。
- **B 请Rowan留下喝茶：**“Don't disappear into the rain yet.” → **ROWAN:** “That's an invitation I won't pretend I didn't want.” `rowan.attraction+7; FLAG_STORM_ROWAN=1`；CH08收到他的亲手地图。
- **C 独处，感谢两人：**“I need one quiet night. Thank you both.” → **KAEL:** “You have it.” **ROWAN:** “Lock the door. For yourself, not for us.” `agency+8; FLAG_STORM_SOLO=1`；CH08增加自我月纹控制场景。

**互动：**“稳住呼吸”，在雷鸣之间选择平缓呼吸节奏；不影响成败，只影响玩家紧张时的演出和`agency+2`。**章末：**追踪牌的驱逐时间，恰好与姨母失踪同一天。


## CH06｜那晚的照片在说谎 / The Photograph Lied

**场景06A｜BG14照片墙** `[BGM06; WX_RAIN_L; FX_MEMORY相片轻微漂浮]`

Mara指着姨母最后一张照片：那晚她没有逃离庄园，而是护送两名幼狼通过地下通道。

**MARA:** “Your aunt wasn't running away. She was getting children out.”

**MARA:** “People called her a traitor because the truth would have embarrassed the people in charge.”

**场景06B｜BG13档案馆** `[BGM06; SFX翻页; 光束照书页]`

Lucien找到同一晚的两份档案：官方记录称Iris盗取银印；私人信件显示是Dorian下令封锁通道。

**LUCIEN:** “I can read the date. I cannot read why someone wrote the lie.”

**LUCIEN:** “That part we have to ask a living person.”

**场景06C｜BG07壁炉客厅** `[BGM07; 暖光聚焦]`

Kael看过记录后承认，他年轻时签过一份没有逐字核实的封锁执行令；这使他成为旧错误的一环。

**KAEL:** “I signed the order. I was twenty-three and I thought obeying made me good.”

**KAEL:** “I can't undo it. But I'll put my name beside the correction.”


### CH06_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**制造真正反转：照片证明“凶手”也可能是被陷害的对象。

**新增场景 EXT_A｜情绪冲突与可见代价**

一张旧照片显示Kael签署封锁令时身旁站着Dorian，但时间戳与仓库日志冲突；Kael承认签过令，否认下令向平民开火。

```text
KAEL: “I signed an order I should have questioned. That’s my fault. I didn’t order the killing.”
MARA: “Both statements can be true. We need the record.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

你发现姨母的第二张合照里出现一位未标注的女性守卫，她后来成了Evelyn的助手。失踪的不是证物，是证人。

```text
ROWAN: “That face was cut out of every public copy.”
LUCIEN: “And kept in the one album your aunt hid for you.”
```

**跨章分支读取与不可偷渡的后果：**如果玩家上章追箭，照片上的库房印记可与银片比对；否则通过账册找到同样线索；CH21真相具备冗余证据。

**本章独立悬念镜头：**一条匿名语音发来：“If she reads the whole file, they’ll kill Iris.”

**小游戏（仅策划，程序外包）：**互动：三图对比，分别标注时间、人物、印记；触发条件CH06B。

**背景/音乐/音效/环境/动画：**BG13档案馆→BG14照片墙；BGM06低频，SFX胶片滑动、录音机底噪，FX_MEMORY定格划痕。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH06_EXT_DONE`，并与原本 `CHOICE_06` 结果合并，不覆盖原本选择。


### CH06_V3｜新增逐场可播放演出与独立分支

**V3新增：照片背后的半张脸（06A后）** `[BG14; FX相片层分离; SFX老相机快门; BGM06刻意留空2秒]`
你发现一张“Rowan把姨母推向月井”的旧照。照片里真正的时间标记被剪掉。Rowan看见后迅速转开头，既不夺走照片也不要求你信。**ROWAN:** “That picture is the worst thing I've ever looked like. The truth isn't pretty either.” 你可允许他解释、先查底片、或要求他在证据出来前保持距离。旧相片背面印着议会冲洗店编号，Iris提供当年她亲手包扎姨母手腕的记录。
**分支：**先听他→`MEM_ROWAN_HEARD`; 查底片→`EVID_NEGATIVE_ID`; 保持距离→`BOUND_ROWAN_DISTANCE`; CH14的自白分别读取此标记，不因好感高而自动原谅。**音效：**翻页和手指轻碰玻璃，禁止廉价惊吓。

**CHOICE 06**
- **A 要Kael向Iris亲口道歉：**“Not to me. To the person who paid for it.” → **KAEL:** “You're right. I'll go to her.” `kael.trust+7; FLAG_KAEL_APOLOGY=1`；CH13修复兄妹关系。
- **B 把照片带给Rowan：**“His sister deserves the first look.” → **ROWAN:** “You remembered who this was about.” `rowan.trust+9; evidence+=PASSAGE_PHOTO`；CH13公开证据更有力。
- **C 帮Lucien逐页找改动：**“If they changed one record, they changed others.” → **LUCIEN:** “Then we'll be very inconvenient together.” `lucien.trust+7; evidence+=DOUBLE_RECORD`；CH15揭露程度提高。

**互动：**“档案错页”，对照时间轴找出两份文件矛盾（可跳过）。**章末：**档案末尾写着“Eclipse Protocol, activation in twenty-four days”。


## CH07｜他愿意在整个族群面前认错 / The Alpha's Apology

**场景07A｜BG15议会厅** `[BGM05; SFX指节敲桌]`

Kael在族群议事会上承认自己曾签署封锁令，并要求审查Dorian当年的权限。

**KAEL:** “A leader who cannot say ‘I was wrong’ has no business asking anyone to follow him.”

**EVELYN:** “You are inviting chaos.”

**KAEL:** “No. I'm inviting witnesses.”

[若`FLAG_REFORM_RITE`，年轻族人公开支持自主原则；若没有，场上最初冷淡，但允许用证据说服。]

**场景07B｜BG16药剂铺** `[BGM07; WX_RAIN_L; 药草摆动]`

Iris不愿见Kael。她先看向玩家。

**IRIS:** “I'm not interested in another powerful man discovering his conscience on schedule.”

**ROWAN:** “Neither am I.”

**IRIS（对玩家）:** “But you came with evidence. That counts.”

**场景07C｜BG04长廊** `[BGM02很轻; 日光从窗外移动]`

Kael没有逼Iris原谅，只把公开承认错误的声明放在她门外。

**KAEL:** “She doesn't owe me forgiveness. I owe her the truth.”


### CH07_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**让Alpha真正付代价，避免一句道歉就洗白。

**新增场景 EXT_A｜情绪冲突与可见代价**

Kael主动在议会上公开承认自己签过不该签的封锁命令，并宣布自愿接受独立审查。支持他的两位族长宣布收回军力。

```text
KAEL: “I failed people I was sworn to protect. She didn’t teach me to say sorry. She made me stop hiding.”
EVELYN: “You understand what this confession costs?”
KAEL: “I do.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

会后他独自坐在暗厅，问你是否愿意陪他坐五分钟，而不是讨一个吻。你拒绝也得到尊重。

```text
KAEL: “I don’t need you to make this easier. I just didn’t want to be alone for a minute.”
ROWAN: “He might actually mean it. That’s annoying.”
```

**跨章分支读取与不可偷渡的后果：**CH02公开规则的玩家会使一名年轻狼族为Kael辩护；未做该选择仍有Mara公开支持正当程序。

**本章独立悬念镜头：**议会当晚撤销Kael对月井守卫的指挥权，Dorian成为临时负责人。

**小游戏（仅策划，程序外包）：**互动：选择公开证词的三种措辞（承担责任/要求独立审查/拒绝为任何人洗白），各改变群众信任，不改变既有历史。

**背景/音乐/音效/环境/动画：**BG15议会→BG07空厅；BGM05→07，SFX静默人群/远处座椅倒退，EMO_SILENCE落槌。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH07_EXT_DONE`，并与原本 `CHOICE_07` 结果合并，不覆盖原本选择。


### CH07_V3｜新增逐场可播放演出与独立分支

**V3新增：他当众念出自己的错误（07A后）** `[BG15; BGM05减半; FX首领印短促暗淡; SFX议会木槌落地]`
Kael在全族公开的审议会上承认自己曾签下银箭仓库的旧命令，即使那天他并不知道箭会被用于袭击。**KAEL:** “I signed it. That's my failure. I won't hide behind being lied to.” Dorian拿走他的部队调遣权。Kael没有当众向玩家索取拥抱，只看向你：**“I owe you the truth, even if it makes it harder to want me.”** 若你已掌握箭或钥匙证据，可选择当众出示；没有的话Tessa与Mara提供替代证词。
**回响：**`FLAG_K_DISARMED=true`，CH16不允许Kael凭空调兵；支持他≠恋爱；质询他→`MEM_K_ACCOUNTABILITY`，CH27需对话回收。**特效：**徽章光熄灭，之后背景所有Kael服装不再带军权肩饰。

**CHOICE 07**
- **A 陪Iris验证证据：**“You decide what gets published.” → **IRIS:** “Then I'll decide carefully.” `agency+5; FLAG_IRIS_EDITOR=1`；CH13证据发布由Iris主持。
- **B 支持Kael听证：**“I'll testify to what we found. Not to what we assume.” → **KAEL:** “I wouldn't ask for more.” `kael.trust+7; FLAG_TESTIFY=1`；CH21审判公开席位。
- **C 让Lucien检查印记副本：**“Could the sealed order be forged?” → **LUCIEN:** “The wax remembers the hand that warmed it.” `lucien.trust+5; evidence+=WAX_HAND`；CH19确定Dorian。

**互动：**“公开证词排序”：排序事实、推测和未知三栏。**章末：**Dorian派人送来邀请，要求玩家午夜单独见面。


## CH08｜只有你看见他脆弱的一面 / Only You See Him

**场景08A｜BG07壁炉厅** `[BGM07; WX_RAIN_M; 火光反射于Kael面颊]`

Kael因持续几夜处理族群骚动而失眠。你发现他把一封致亡母的信压在未寄出的信堆里。

**KAEL:** “Everyone asks me to be certain. My mother was the only one who ever let me be scared.”

**KAEL:** “I didn't expect to feel safe telling you that.”

[如果`FLAG_STORM_KAEL`，他提及“you stayed while the storm passed”；否则只表示今晚愿坦白。]

**场景08B｜BG17湖边** `[BGM04; WX_FOG; 湖面光点]`

Lucien带你看刻有姨母名字的石碑：她不是被选中的祭品，而是上一位推翻祭献的见证人。

**LUCIEN:** “She didn't break the oath. She broke the part that made people disposable.”

**场景08C｜BG02门廊** `[BGM03柔和版; WX_RAIN_L]`

Rowan送来一张手绘庄园地形图。[若`FLAG_STORM_ROWAN`，上面有“Tea was a dangerous idea. I might come back.”；否则写有安全出口标记。]

**ROWAN:** “You deserve exits. Real ones. Even from people you like.”


### CH08_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**Lucien与Kael各自展现脆弱，不挤成同一人设。

**新增场景 EXT_A｜情绪冲突与可见代价**

医务室停电，Kael肩伤复发却仍怕在你面前显得软弱。你是否陪伴由玩家决定；不选择浪漫选项也可以帮他叫医生。

```text
KAEL: “I know how to lead an army. I’m terrible at being cared for.”
YOU (optional): “Then start by staying still.”
KAEL: “For you? I can try.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

Lucien在湖边坦白每次预言都会失去一段自己的记忆：他忘记过妹妹生日，却记得第一次听见你的名字。不是命中注定爱，是他主动把你写进随身手账。

```text
LUCIEN: “I wrote your name down because I wanted to remember a person, not another omen.”
```

**跨章分支读取与不可偷渡的后果：**CH08若拒绝接触，CH16不可引用“你曾抱过他”；接受照护则CH27回忆那次照顾；Lucien手账在CH22找回记忆。

**本章独立悬念镜头：**书页上出现一行他不记得写过的字：“DON’T TRUST THE SECOND ECLIPSE.”

**小游戏（仅策划，程序外包）：**互动：可选择替Lucien保存一条记忆，决定以后他会如何称呼那一晚。

**背景/音乐/音效/环境/动画：**BG19医务室→BG17湖边；BGM07→04；SFX雨打窗、湖水轻涌；可选EMO_HEART，必须有主动靠近。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH08_EXT_DONE`，并与原本 `CHOICE_08` 结果合并，不覆盖原本选择。


### CH08_V3｜新增逐场可播放演出与独立分支

**V3新增：火光下的私密事实（08A后）** `[BG07; BGM07只留钢琴; FX烛火微弱摇晃; ACT_K_LOOK_AWAY]`
Kael夜里因旧伤不能入睡。他告诉你，自己最怕的并非失去首领位置，而是习惯了命令别人后不知道怎样真诚请求陪伴。**KAEL:** “I don't want you grateful. I want you safe enough to tell me no.” 玩家可以坐在旁边听、主动握手、或让他独处；三种都能保持相互尊重。若握手，他低声：**“I could get used to this. Only if you want to.”** 若离开，他次日留给你一张写明安全通道的地图，而不是伤心惩罚。
**回响：**`MEM_K_HEARD` / `INT_K_HAND` / `BOUND_K_SPACE` 三互斥事实；CH16和CH27读取对应版本。**转场：**雨声由室外强到室内弱，绝不突然放烟花。

**CHOICE 08**
- **A 询问Kael可以拥抱他吗：**“Would a hug help, or would you rather talk?” → **KAEL:** “A hug. If you're offering.” `kael.attraction+8; FLAG_HUG_KAEL=1; EMO_HEART`；CH11Kael主动邀请舞蹈，亲密需再确认。
- **B 邀请Rowan坐下画图：**“Show me the road you'd take if you were free.” → **ROWAN:** “I never drew one until now.” `rowan.attraction+8; FLAG_ROAD_DREAM=1`；CH28梦想线开启。
- **C 与Lucien共同为姨母点灯：**“Let her story be hers.” → **LUCIEN:** “Then let's tell it right.” `lucien.attraction+7; FLAG_AUNT_VIGIL=1`；CH15镜中记忆更完整。

**互动：**无强制小游戏；玩家可在“拥抱/陪伴/离开”三个触摸区选择身体边界。**章末：**半夜，月井第一次发出像心跳一样的两声敲击。


## CH09｜你不需要他救，你选择并肩 / At Your Side

**场景09A｜BG18石阵** `[BGM06→08; WX_MOON强; EMO_WOLF弱; 石阵光顺时针扩散]`

三枚石刻在月光下亮起，显示只有三枚狼印加上一位自由见证者，才能改变誓约。Dorian的人试图封锁外围通道。

**LUCIEN:** “This is not a ceremony of sacrifice. It's a vote the old council erased.”

**场景09B｜BG19医务室** `[BGM07; WX_RAIN_L; SFX药水瓶]`

Kael在护送少年时被银刃擦伤。你走进医务室，他以为你会害怕。

**KAEL:** “You can leave if the sight bothers you.”

**KAEL（望着你）:** “You staying because you want to means more than you know.”

**场景09C｜BG08林间栈桥** `[BGM03; WX_FOG; SFX两人脚步]`

Rowan发现袭击者路线与议会仓库连通。你不是他背后的“被保护者”，而是手持真正路线图的同伴。

**ROWAN:** “I trust your eyes. Tell me what I missed.”


### CH09_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**Rowan危险但不失控，玩家拥有战术主导权。

**新增场景 EXT_A｜情绪冲突与可见代价**

石阵追兵到来，Rowan本能想把你藏到身后。你指出石阵第三入口并组织三人脱困，他改口叫你“Boss”，不是把你当需要驯服的猎物。

```text
ROWAN: “I was about to tell you to stay behind me.”
YOU (optional): “Then don’t.”
ROWAN: “Noted. What’s the plan, Boss?”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

Iris传来密信：当年指控她的人手里有月井控制器钥匙；Dorian控制的新守卫队已经开始寻找她。

```text
IRIS (voice): “Tell my brother I’m not asking him to die for me. I’m asking him to believe me.”
KAEL: “We bring her in alive. With witnesses.”
```

**跨章分支读取与不可偷渡的后果：**若CH03优先Iris，Rowan这章提到你记得她的名字；否则他会明确给你重讲证据，不会惩罚不走其支线的玩家。

**本章独立悬念镜头：**玩家手心的第四印可短暂熄灭追踪灯——你拥有未被任何狼人记录的权力。

**小游戏（仅策划，程序外包）：**互动：石阵三道光路，玩家指挥防守位置（非战斗QTE），失败触发Kael/Rowan救援但保留自主选择。

**背景/音乐/音效/环境/动画：**BG18满月石阵→BG19医务室；BGM03节拍变快；SFX狼嚎远场、石块移动、微弱心跳。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH09_EXT_DONE`，并与原本 `CHOICE_09` 结果合并，不覆盖原本选择。


### CH09_V3｜新增逐场可播放演出与独立分支

**V3新增：她救了自己（09A后）** `[BG18→BG19; FX石阵符文逐段熄灭; SFX石块滚落; BGM08→07]`
月石阵失稳，你和Rowan都被封锁在石环内。Rowan准备背你跳出去，你却发现刻在地面的旧出口通往Iris设下的急救索道。你选择发指令、亲自解锁、或与Rowan同步行动。**ROWAN:** “I was going to play the hero.” **YOU（选择后的文本）:** “Try being my partner instead.” **ROWAN:** “That's annoyingly attractive.” 他笑出声，第一次不把危险当成调情借口。
**游戏说明：**“对齐三枚石印”5秒内任意顺序；正确保留药剂材料，错误由Iris救援但损失一罐药剂→CH13配方数量变化，不影响通关。**回响：**`FLAG_PARTNER_ESCAPE`，CH18他愿服从你的战术部署。

**CHOICE 09**
- **A 在石阵作公开见证：**“I speak for myself. No one speaks for me.” → **KAEL:** “Then the council will hear you.” `agency+10; FLAG_PUBLIC_WITNESS=1`；CH21公开审判有独立发言。
- **B 和Rowan从侧道截断袭击者：**“We take the route that hurts nobody.” → **ROWAN:** “You really are trouble. The best kind.” `rowan.trust+8; evidence+=WAREHOUSE_PATH`；CH19藏证确认。
- **C 跟Lucien改写石阵算法：**“Teach me what each seal does.” → **LUCIEN:** “I was hoping you'd ask.” `lucien.trust+8; moon_resonance+10`；CH25稳定度提升。

**互动：**“三印连线”，选择让光流向人群而非祭坛（触发：09A）；错误则重试或由角色提示。**章末：**三个狼印在玩家掌心投射出一个新的名字：**Dorian Ashford**。


## CH10｜他给你一条可以离开的路 / The Road Out

**场景10A｜BG12山崖** `[BGM03; WX_WIND_H; SFX远雷]`

Rowan带你看完整的山谷轮廓，指出森林之外通往海岸的公路。

**ROWAN:** “If this place becomes too much, I'll drive you out. No questions. No clever speech about destiny.”

**ROWAN（停顿）:** “And if you choose to come back, I'll be annoyingly glad.”

**场景10B｜BG20车库** `[BGM07; SFX扳手轻敲; 暖灯]`

你帮Rowan修一辆失修的摩托。他承认从没真正离开，因为妹妹还在山谷里。

**ROWAN:** “Everyone says I can't be trusted to stay. Truth is, I never learned how to leave the people I love.”

**场景10C｜BG21图书露台** `[BGM04; WX_MOON; 萤火]`

Lucien把一张预言空白页给你做笔记。

**LUCIEN:** “The future doesn't need another prophet. It might need someone willing to write the first honest sentence.”


### CH10_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**反转“逃跑路线”：真实自由比甜言蜜语更有吸引力。

**新增场景 EXT_A｜情绪冲突与可见代价**

Rowan修好一辆旧摩托，将出谷路线和应急现金放在你掌心，明说即使你从此不回来也不会拦你。

```text
ROWAN: “I’m giving you a way out. Not a reason to owe me.”
YOU (optional): “And if I ask you to come?”
ROWAN: “Then I’d have to admit how badly I want to.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

谷口的通行证突然全部失效——不是Rowan给的路线有问题，而是Dorian宣布“封谷保护继承人”。Kael把自己的官方通行章交给你对抗封锁。

```text
KAEL: “If he uses my name to trap you, he doesn’t get to keep using my seal.”
```

**跨章分支读取与不可偷渡的后果：**选择立即走会遇到边境封锁分支并由Iris远程接应；选择留下继续调查获取仪式计划；选择询问Rowan的去向使CH28记住你的具体期待。

**本章独立悬念镜头：**Dorian的全谷广播：“From midnight, the Moonbound is in protective custody.”

**小游戏（仅策划，程序外包）：**互动：路线图选择城市/山路/回庄园，标记玩家偏好并触发不同过场，不制造死路。

**背景/音乐/音效/环境/动画：**BG20机车车库→BG12悬崖→BG21露台；BGM03→05，SFX引擎/警报/风；WX_WIND_H。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH10_EXT_DONE`，并与原本 `CHOICE_10` 结果合并，不覆盖原本选择。


### CH10_V3｜新增逐场可播放演出与独立分支

**V3新增：一条写好你名字的逃生路（10B后）** `[BG20; SFX车钥匙滑过桌面; BGM03降至低音吉他; WX雨停车窗凝水]`
Rowan展示一辆已经加满油的车、匿名现金和边境证件。他没要求你跟他走。**ROWAN:** “If the valley turns on you, you leave. Even if I can't come.” 你问他是不是早就准备离开，他否认：**“I was. Then you showed up, and I started making plans where somebody else gets home alive.”** 一辆议会巡逻车驶过，窗上反射出“Iris is alive”的涂鸦。你可选择撤离边境、秘密留下或先查证妹妹去向。
**回响：**离开路线给两场专属边境场景，仍能回归主线；留下→`FLAG_STAY_CHOSEN`；查Iris→`EVID_IRIS_LOCATION`。任何路线不自动确认伴侣。

**CHOICE 10**
- **A 接受Rowan教你开山路：**“Teach me to drive this road myself.” → **ROWAN:** “That's somehow hotter than asking me to be your getaway driver.” `rowan.attraction+8; agency+5; FLAG_DRIVING=1`；CH28独立出行场景。
- **B 让Kael安排山谷外的信息渠道：**“I won't be cut off from the world.” → **KAEL:** “I'll make sure you have your own line, no one monitoring it.” `kael.trust+6; FLAG_OUTSIDE_LINE=1`；CH21公民证人备份。
- **C 与Lucien写下第一句新誓言：**“No one belongs to anyone.” → **LUCIEN:** “I think that sentence could save us.” `lucien.attraction+8; FLAG_NEW_OATH_DRAFT=1`；CH26可直接读取此句。

**互动：**“修复引擎”选择机油/火花塞两件道具（只给一次引导，不锁剧情）。**章末：**Rowan在旧车座里找到一段姨母录音：“Dorian never intended to end the eclipse.”


## CH11｜整个舞池都知道他在等你 / The Dance He Saved

**场景11A｜BG22星灯露台** `[BGM02渐入; WX_WIND_L; 串灯随风轻晃]`

月会前夕，Kael应邀出席慈善冬舞会。无数人向他邀舞，他却走到你面前，不抢你的手，只俯身与视线齐平。

**KAEL:** “I've been asked to dance eleven times tonight.”

**KAEL:** “I said no eleven times. I was hoping you'd be the twelfth. But you don't owe me a yes.”

[若CH08拥抱过，补一句 **KAEL:** “I was less nervous in front of the entire council than I am right now.”]

**场景11B｜BG23河岸篝火** `[BGM03→07; SFX木柴; WX_WIND_L]`

Rowan拒绝进入舞会，独自在河边教几个孩子折纸狼。你找来时，他笑着把其中一只递给你。

**ROWAN:** “I know what they say about me at fancy parties. Out here, nobody cares whose name is on the invitation.”

**ROWAN:** “You came anyway. I won't make a joke out of that.”

**场景11C｜BG14走廊照片墙** `[BGM06; FX_MEMORY老照片轻叠]`

Mara拿出姨母留下的舞会照片。照片后写着：“The night I chose mercy, Dorian chose power.” Kael、Rowan、Lucien同时收到你发出的发现通知，第一次联手安排证人保护。


### CH11_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**看似浪漫的舞会成为背叛爆点，独宠有真实公共代价。

**新增场景 EXT_A｜情绪冲突与可见代价**

冬季舞会入口，Kael已失去军权，却拒绝让Dorian宣布你为他的未婚伴侣。他当着全厅把“未婚公告”交给你亲自撕毁。

```text
KAEL: “They wrote a future for us without asking either of us.”
KAEL (to crowd): “There will be no announcement. She is nobody’s prize.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

你可与一人共舞、单独与其他人聊天或不跳舞；舞曲高潮时灯光被人为切断，戴面具的刺客带走一名旧证人。

```text
ROWAN: “I know that scent. Council steel. Not a stranger.”
LUCIEN: “Someone counted on us watching the dance floor instead of the exits.”
```

**跨章分支读取与不可偷渡的后果：**选择舞伴产生独立专属回忆；不跳舞会提早发现侧门脚印。所有路线都能追踪证人，但发现线索不同。

**本章独立悬念镜头：**面具掉在台阶上——内侧刻着Evelyn办公室的印。

**小游戏（仅策划，程序外包）：**互动：舞伴选择+逃生门线索观察；不强制两人争抢玩家的手。

**背景/音乐/音效/环境/动画：**BG22星灯舞池 / BG23篝火 / BG24穹顶（分支）→BG38灯熄门厅；BGM04华尔兹原创→突然切静音，SFX玻璃破碎、足音。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH11_EXT_DONE`，并与原本 `CHOICE_11` 结果合并，不覆盖原本选择。


### CH11_V3｜新增逐场可播放演出与独立分支

**V3新增：舞会上的公开选择（11A后）** `[BG22; BGM02管弦华尔兹→静音0.5s; ACT_K_EXTEND_HAND; SFX水晶杯细响]`
Dorian当众宣布Kael与贵族家族“政治订婚”，试图把你挤到宾客席。Kael握着未签的婚约走到台前，当众撕开，承认不是替你争夺所有权：**KAEL:** “I won't trade one woman for another. I won't trade anyone's future to keep my title.” 他走向你，缓缓停下。**“Would you like this dance? If not, I'll still walk you home.”** 若你接受，触发约15秒可跳过的双人舞互动；拒绝则他把披肩交给你，自己站到门口阻止骚扰。与此同时窗边出现可疑脚印。
**回响：**`MEM_K_DANCE`/`BOUND_K_NO_DANCE`; CH27仅舞伴路线回忆舞步。参加/不参加均可发现袭击前兆。

**CHOICE 11**
- **A 与Kael共舞：**“One dance. And no speeches about destiny.” → **KAEL:** “Just a dance. I've wanted one ordinary moment with you.” `kael.attraction+10; FLAG_DANCE_K=1; EMO_HEART`；CH16如有进一步亲密先提到这支舞。
- **B 陪Rowan在河边烤棉花糖：**“I'd rather be where you are.” → **ROWAN:** “You're dangerously good at making a man feel seen.” `rowan.attraction+10; FLAG_FIRE_R=1`；CH16加一段篝火记忆。
- **C 留在照片墙调查：**“Someone kept the answer in plain sight.” → **LUCIEN:** “Then I'll sit with you until we find it.” `agency+6; lucien.trust+5; evidence+=DANCE_PHOTO`；CH19额外证明。

**互动：**若A“舞步互动”，玩家选择握手/只共舞不触碰/拒绝舞曲（A内部子选项，均有效）；若B“折纸狼”；若C“找照片年份”。**章末：**照片里站在Dorian身后的少年，竟然是十年前的Lucien。


## CH12｜他的预言里没有告别 / A Future Without Goodbye

**场景12A｜BG24玻璃穹顶** `[BGM04; WX_MOON; 流星缓慢掠过]`

Lucien承认小时候被Dorian囚在预言室，被迫阅读“谁该被牺牲”，是姨母把他带出去。

**LUCIEN:** “When I was a child, they called me gifted. That's a gentle word for a terrible thing.”

**LUCIEN:** “Your aunt taught me the difference between seeing a future and sentencing someone to it.”

**场景12B｜BG06温室** `[BGM07; WX_FOG; 夜铃花开]`

你让Lucien合上星图，第一次带他做一件不为预言服务的事：给新开的花取名字。

**LUCIEN:** “No prophecy about a flower?”

**LUCIEN（笑）:** “I might actually be good at living if you keep distracting me.”

**场景12C｜BG25月井洞口** `[BGM08 35%; WX_RAIN_H+闪电; 水位激增]`

月井外保护符文一夜间松动。Lucien看到的是一千种灾难可能，但玩家在其中仍拥有行动空间。

**LUCIEN:** “I'm frightened. Not of what you'll choose. Of the chance you'll think the choice isn't yours.”


### CH12_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**预言者的告白不是“命定你属于我”，而是他愿意失去能力。

**新增场景 EXT_A｜情绪冲突与可见代价**

Lucien在玻璃穹顶向你展示两种结局：第一种他保留神谕权力但你被困；第二种他放弃预测能力却无人再能指派你的命运。他当面烧掉第一种预测。

```text
LUCIEN: “I could keep knowing every tomorrow. Or I could let you have one that belongs to you.”
YOU (optional): “Which one scares you?”
LUCIEN: “The one where I lose you without ever letting you choose.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

旧神谕书背页传来姨母录音：三枚狼印不是锁，第四枚人类印才是解锁权；只要不自愿，月井就无权缔约。

```text
MARA (recording): “A promise taken by force isn’t a promise. It’s a cage.”
```

**跨章分支读取与不可偷渡的后果：**CH04验证镜像者本章可指出预言是条件概率；未验证也能经手账证实。若玩家亲近Lucien，展示脆弱台词；若朋友路线，展示合作承诺。

**本章独立悬念镜头：**有人改变天象钟，月蚀提前了三天。

**小游戏（仅策划，程序外包）：**互动：星图拼接，把“假日期”与天象标记对齐；失败会被Lucien手账提示。

**背景/音乐/音效/环境/动画：**BG24穹顶→BG25月井入口；BGM04→08紧迫；SFX玻璃轻响、蜡封断裂；FX_MOON移位。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH12_EXT_DONE`，并与原本 `CHOICE_12` 结果合并，不覆盖原本选择。


### CH12_V3｜新增逐场可播放演出与独立分支

**V3新增：他第一次没预见结局（12A后）** `[BG24; BGM04音乐盒独奏; FX星轨断开; SFX玻璃穹顶轻震]`
Lucien让你看见两个未来：一条是你选择某人的伴侣契约，山谷暂时和平；另一条是你拒绝契约，山谷陷入短暂混乱后得到新秩序。他告诉你第一条被议会记录成“唯一正确答案”。**LUCIEN:** “I've spent my life being praised for certainty. You're the first person who makes me want to be wrong.” 玩家可以问他是不是喜欢你、要他解释代价、或暂时不讨论感情。若问喜欢，他不回避：**“Yes. And I won't turn that into a prophecy you have to obey.”**
**回响：**`MEM_L_CONFESSION`仅在问感情时写入；CH22的失能后记得的是选择而非超能力；调查代价得`EVID_BRANCH_FUTURES`。

**CHOICE 12**
- **A 握住Lucien的手，让他只看现在：**“Look at me, not the futures.” → **LUCIEN:** “There you are. The one thing I can feel without predicting.” `lucien.attraction+10; FLAG_L_HAND=1; EMO_HEART`；CH17他能更快稳住心绪。
- **B 让Kael组织撤离附近居民：**“People first. Oath second.” → **KAEL:** “Already moving. You don't have to carry this alone.” `kael.trust+8; FLAG_EVAC=1`；CH20保护事件受益。
- **C 和Rowan找月井外墙裂缝：**“There must be a way they opened it.” → **ROWAN:** “And we'll find the hands that did.” `rowan.trust+8; evidence+=WELL_CRACK`；CH19定位破坏点。

**互动：**“星图配对”把三颗星连成撤离路径；玩家不操作时自动选择安全路线。**章末：**Lucien低声说：“The eclipse isn't coming early. Someone moved the clock.”


## CH13｜你把他的妹妹带回了光里 / A Name Restored

**场景13A｜BG26晨雾广场** `[BGM05→02; WX_FOG逐渐散; SFX人群吸气]`

Iris登上公共平台展示原始封锁记录。若`FLAG_IRIS_EDITOR`她主导发布；否则由你询问她同意后才公布。

**IRIS:** “I spent six years being told silence was the price of peace. It wasn't peace. It was convenience.”

**ROWAN（低声）:** “That's my sister.”

**场景13B｜BG16药剂铺** `[BGM07; 陶杯轻碰]`

Kael亲自向Iris道歉。[若`FLAG_KAEL_APOLOGY`，他明确提及自己做过的补救；否则这场为第一次道歉。]

**KAEL:** “My signature helped hurt you. I am sorry. I don't expect forgiveness, and I won't ask you to make me feel better.”

**IRIS:** “Good. Then get the records corrected.”

**场景13C｜BG27旧琴房** `[BGM02钢琴独奏; 夕光落尘]`

Kael被公开质疑是否配做首领。你找到他时，他正在弹母亲教过的一段简单旋律。

**KAEL:** “I thought losing their respect would destroy me.”

**KAEL:** “But after today, I can finally look Iris in the eye.”


### CH13_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**Iris作为有行动能力的盟友，翻案不是男性代替她说话。

**新增场景 EXT_A｜情绪冲突与可见代价**

Iris走进议会公开展示她研发的银毒解药和被删除的医疗记录，明确她被驱逐是因为拒绝替Dorian试药。Rowan差点冲上前，却被妹妹轻轻拦下。

```text
IRIS: “I don’t need a brother to fight for my honor. I need the truth put back in the record.”
ROWAN: “You’re right. I just missed you.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

你决定是否公开公布记录、先保护证人或先为受害者提供治疗，三条都可以恢复Iris的姓名。

```text
KAEL: “My council let this happen. Then my council will pay for the treatment.”
IRIS: “Start by asking the patients.”
```

**跨章分支读取与不可偷渡的后果：**若早期记录Iris名字，Rowan会说“你在还没见她之前就相信她值得被听见”；CH23家宴记忆不同。

**本章独立悬念镜头：**完整毒药账目显示Dorian每月购买月井抑制剂，而且使用者名单里竟有Lucien。

**小游戏（仅策划，程序外包）：**互动：选择公告字句+是否公开受害者身份（默认隐私保护）。

**背景/音乐/音效/环境/动画：**BG26雾晨公开证词→BG16药剂铺→BG27琴房；BGM05→07；SFX人群吸气、文件翻页。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH13_EXT_DONE`，并与原本 `CHOICE_13` 结果合并，不覆盖原本选择。


### CH13_V3｜新增逐场可播放演出与独立分支

**V3新增：流亡者妹妹自己走上台（13A后）** `[BG26; BGM05→10逐渐亮; FX晨雾上移; SFX布告揭开]`
广场审判本想把Iris押上台认罪。你与Mara出示证据后，她不再躲在Rowan身后，自己站到审判席前。**IRIS:** “My brother didn't steal medicine. He stole time for people the council had already decided to lose.” Rowan红了眼眶。**ROWAN（小声对你）:** “I wanted to be the one who saved her.” **YOU（可自由回应）**。他自己纠正：**“She saved herself. You gave her a room full of witnesses.”**
**分支：**公开证据→`FLAG_IRIS_EXONERATED`；保护证人身份→`FLAG_IRIS_PRIVACY`（同样平反）；要求新听证→`FLAG_IRIS_HEARING`，CH21增加证词。**天气：**晨雾散开但不出现神迹式彩虹。

**CHOICE 13**
- **A 陪Kael继续练琴：**“Finish the song. You deserve to hear it.” → **KAEL:** “Stay for the last note?” `kael.attraction+8; FLAG_PIANO_K=1`；CH27他再次弹此曲。
- **B 庆祝Iris洗清污名：**“Tonight belongs to Iris.” → **ROWAN:** “I think I love how you know whose victory this is.” `rowan.attraction+8; FLAG_IRIS_CELEBRATE=1`；CH28Iris主动支持玩家关系。
- **C 和Lucien核对公告背后的遗漏：**“What else was erased?” → **LUCIEN:** “The seal's original owner. And that's a problem.” `lucien.trust+7; evidence+=ORIGINAL_SEAL_OWNER`；CH25多一条和平路线。

**互动：**“复原公告”从三种句子中选出尊重Iris自主权的版本。**章末：**修正后的档案揭露：封井当天，Dorian携带的并非首领之印，而是一个复制品。


## CH14｜他的秘密不是背叛 / The Road He Never Took

**场景14A｜BG28瞭望塔** `[BGM03; WX_WIND_H; 远山浓云]`

Rowan告诉你一个难以启齿的事实：他曾接受Dorian的任务假意监视姨母，因为那时Dorian威胁Iris的安全。

**ROWAN:** “I followed her once. I hated myself for it. Then I warned her, and she gave me a way out.”

**ROWAN:** “You can be angry. I won't ask you to call that noble.”

**场景14B｜BG21萤火露台** `[BGM04; 萤火围绕，慢速]`

Lucien说Rowan的记忆与旧档案一致，无法证明他从未说谎，却能证明他在关键一晚改变立场。

**LUCIEN:** “Truth isn't the story of someone who never made a mistake. It's the story of what they did next.”

**场景14C｜BG20车库** `[BGM07; SFX雨棚滴水]`

Rowan把机车钥匙放在你面前，然后将手收回。

**ROWAN:** “I could tell you to trust me. Instead I'm giving you something I can't take back: the route I used to escape Dorian's men.”


### CH14_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**Rowan必须坦白污点，浪漫不是免罪券。

**新增场景 EXT_A｜情绪冲突与可见代价**

瞭望塔上Rowan承认，数年前他为了保护Iris曾被迫替Dorian监视姨母；姨母最后一次离开庄园时，他没有上报她的逃亡方向，却在此之前交出过一张地图。

```text
ROWAN: “I wasn’t the man I wanted to be. She paid for a mistake I made.”
YOU (optional): “Why tell me now?”
ROWAN: “Because you deserve the truth before you decide whether I get to stay.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

玩家可以离开、要求他做实际补救，或允许他陪你找失踪证人。无论是否原谅，他都会交出原始地图。

```text
ROWAN: “If you never trust me again, I’ll still finish what I owe her.”
LUCIEN: “Guilt isn’t proof of love. What he does next will be.”
```

**跨章分支读取与不可偷渡的后果：**若拒绝原谅，CH16 Rowan的亲密选项关闭，开启“关系修复”任务；若愿修复，CH23给予一次慢速谈心，不自动抹掉过去。

**本章独立悬念镜头：**地图上标着一条通往月井下方的“第四门”，此前所有卷宗都故意漏掉。

**小游戏（仅策划，程序外包）：**互动：玩家在地图上标注“危险点/隐藏路/证人藏身处”；不做速度小游戏。

**背景/音乐/音效/环境/动画：**BG28雪前塔顶→BG21夜露台；BGM03静音→04慢钢琴；WX_WIND_H，SFX铁栏轻响。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH14_EXT_DONE`，并与原本 `CHOICE_14` 结果合并，不覆盖原本选择。


### CH14_V3｜新增逐场可播放演出与独立分支

**V3新增：真实污点与不自动原谅（14A后）** `[BG28; WX_WIND_H; BGM03只剩低弦; ACT_R_LOOK_DOWN]`
Rowan承认曾受Dorian胁迫监视你姨母，曾递送一次错误的行动路线，导致她被议会捕获；他后来反悔救出她，却无法抹掉最初的选择。**ROWAN:** “I did it. I told myself I was saving Iris. I still hurt your family.” 他把证人名字、时间和自己的犯罪记录交给你。**“You don't have to make me the good guy. Just don't let him use the same trap on someone else.”**
**选择：**暂不原谅→`FLAG_R_UNFORGIVEN`并关闭亲密选项，CH23提供修复会谈；原谅但保留边界→`FLAG_R_REPAIRING`，须完成两次实际履责才开放恋爱；只作为盟友→`FLAG_R_FRIEND`，主线完整可通。**SFX**：没有心跳特效，留足安静表达。

**CHOICE 14**
- **A 说出失望，要求Rowan不再隐瞒：**“I need honesty before romance.” → **ROWAN:** “Then honesty first. Even when it costs me.” `rowan.trust+10; FLAG_R_HONESTY=1`；CH22信任危机优先坦白。
- **B 愿意陪他重新走那条路：**“Show me where you turned around.” → **ROWAN:** “I was hoping you'd ask. I wasn't counting on it.” `rowan.attraction+8; FLAG_ROAD_TRIP=1`；CH28解锁新路结局。
- **C 暂时保持距离：**“I hear you. I need time.” → **ROWAN:** “Take it. I'll be here when you're ready to ask.” `agency+7; FLAG_R_DISTANCE=1`；CH16/22不主动做亲密试探，信任可修复。

**互动：**“路线复盘”，玩家决定是否标记Rowan的旧据点。无论结果，保护私人住所不被公开。**章末：**Rowan车库外出现涂有古狼纹的黑色车辆，来自Dorian私人卫队。


## CH15｜你可以打碎命运 / Break the Mirror

**场景15A｜BG29预言室** `[BGM06; FX_MEMORY镜片碎光; 低频嗡鸣]`

Lucien带你看当年预言室。无数镜子映出不同未来：你成为祭品、成为首领伴侣、独自离开。但镜子没有映出你改变规则的路径。

**LUCIEN:** “They showed me a thousand endings. Every one asked you to make yourself smaller.”

**LUCIEN:** “I want to be wrong. For the first time, I want it desperately.”

**场景15B｜BG30银白审议台** `[BGM05; 室内冷光]`

Evelyn承认Dorian曾掌握预言室，却仍担心解除誓约会引发狼群失控。

**EVELYN:** “A corrupt law is still the law keeping thousands alive. Tell me what replaces it.”

你意识到必须拿出新的保护方案，而非仅揭穿谎言。

**场景15C｜BG09月井外缘** `[BGM04→08; WX_MOON; 水面映出玩家]`

Lucien教你把月井能量分成三路，避免被某一位首领垄断。

**LUCIEN:** “Do you want the mirror gone?”

**LUCIEN:** “I'll break it with you. Not because you're my destiny. Because it's your choice.”


### CH15_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**中段大反转：反派不是“错预言”，而是把爱变成强制绑定的系统。

**新增场景 EXT_A｜情绪冲突与可见代价**

Lucien当着众人打碎预言镜，镜子背面露出Dorian的控制刻印——历代“命定伴侣”只是人为设置的政治联姻机制。Evelyn第一次动摇，但要求可核验证据。

```text
LUCIEN: “They called it fate because that sounds kinder than ownership.”
EVELYN: “If the seal is forged, I want every name that signed it.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

玩家可以亲手砸镜、要求保存证据或让Evelyn封存；毁镜与留镜都可揭示刻印，只影响法庭证据形式。

```text
KAEL: “They used my title to make chains. I will be the first to break them.”
ROWAN: “Careful, Alpha. You’re starting to sound like a decent man.”
```

**跨章分支读取与不可偷渡的后果：**CH21若保留镜片有物证；若砸碎由Lucien预存星图构成证据；无失败锁死。

**本章独立悬念镜头：**镜底传来一个活人的声音：失踪证人还被关在月井下方。

**小游戏（仅策划，程序外包）：**互动：镜中寻找重复纹路，识别伪造印；低动态版本静态对比。

**背景/音乐/音效/环境/动画：**BG29破镜室→BG30银白议事台；BGM06不协和→00:15完全静音→BGM08；SFX碎镜、暗门低鸣。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH15_EXT_DONE`，并与原本 `CHOICE_15` 结果合并，不覆盖原本选择。


### CH15_V3｜新增逐场可播放演出与独立分支

**V3新增：镜子里所谓的命定之吻（15A后）** `[BG29; FX镜像重复3帧/镜裂; BGM06不协和合成器; SFX低频玻璃摩擦]`
预言镜显示你主动吻上三个男人中的一人，紧接着出现誓约签名。你发现自己的影像没有眨眼——这是录制好的动作回放。Lucien当着你面销毁镜子里的个人未来文件。**LUCIEN:** “They didn't predict your choice. They rehearsed it until it looked inevitable.” 你可保存镜片、选择砸毁镜子、或先请Iris读取镜面银粉；三个方案都找到仪式造假链，只是证据形态不同。
**回响：**`EVID_MIRROR_SHARD`/`EVID_MIRROR_LEDGER`/`EVID_SILVER_DUST`。镜像出现的“吻”绝不可写入真实亲密历史。

**CHOICE 15**
- **A 打碎命运镜：**“No more futures decided without us.” → **LUCIEN:** “Then we write the next one ourselves.” `lucien.attraction+8; agency+8; FLAG_BROKEN_MIRROR=1`；CH25不再受预言误导。
- **B 保留镜子作为证据：**“Not yet. Let everyone see what it was used for.” → **EVELYN:** “That is an argument I cannot dismiss.” `evidence+=PROPHECY_MIRROR; FLAG_MIRROR_EVIDENCE=1`；CH21议会摇摆者增加。
- **C 让三位狼印持有者共同制定替代方案：**“No one gets to rule the moon alone.” → **KAEL:** “Agreed.” **ROWAN:** “First good rule I've heard here.” `agency+8; FLAG_COUNCIL_PLAN=1`；CH26和平方案成本下降。

**互动：**“预言镜面”三格中辨认一条被遗漏的自由未来（成功得到`MOON_CHOICE`，失败由Lucien补充）。**章末：**镜面出现被藏的地图：月井真正的控制室就在庄园地下。


## CH16｜暴雨里，他没有替你决定 / Rain Between Us

**场景16A｜BG31玻璃廊桥** `[BGM02弦乐; WX_RAIN_H+WX_LIGHTNING（间隔至少12秒）; 衣领和雨滴真实反射]`

Dorian的人切断庄园外电路。Kael冒雨检查撤离通道，回来时衬衫被雨淋透，手里却捧着你留在露台上的日记，始终没有打开。

**KAEL:** “I found this outside. I didn't read it.”

**KAEL:** “There are things about you I want to know because you choose to tell me. Not because I can get a key.”

[若`FLAG_DANCE_K`，Kael：“I still owe you a dance without half the valley watching.”；若没有，则：“Would you like me to stay, or would you rather have the bridge to yourself?”]

**场景16B｜BG32雪前门廊** `[BGM03缓慢版; WX_WIND_H; 雨逐渐变霰]`

Rowan冒雨送来Dorian私人卫队的名单，摘下身上的短刀放到桌面，与玩家保持距离。

**ROWAN:** “I brought names, not excuses.”

[若`FLAG_R_DISTANCE`，他明确不邀请身体靠近：**ROWAN:** “I said I'd give you time. I meant it.”]

**场景16C｜BG31廊桥夜色** `[BGM04; 雨声降至40%; 仅主动亲密触发EMO_HEART]`

停电后两人蜷缩在玻璃廊桥的暖灯旁。允许玩家决定是否牵手、是否更亲近。**绝不写固定亲吻**。


### CH16_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**雨夜是情绪强峰，具体靠双方互相选择和“可以拒绝”。

**新增场景 EXT_A｜情绪冲突与可见代价**

玻璃廊桥上Dorian的守卫封路，Kael被命令把你交出来恢复狼王之位。他把个人徽章丢进暴雨中的河里，公开拒绝，卫队枪口转向他。

```text
DORIAN (radio): “Bring her in, and you get your pack back.”
KAEL: “My pack is not a price you can put on her.”
KAEL (to you): “If you want me beside you, say so. If you want space, I’ll give it.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

如果玩家主动牵手，Kael把湿透的手掌握紧并低声说“Then I’m here”；如果拒绝接触，他先开路，依然保护，不自动触发亲吻。Rowan在雪中赶到交出武器，证明自己不是来绑架玩家。

```text
ROWAN: “I came unarmed because I knew you’d need to make up your own mind.”
LUCIEN (comms): “The lightning will cut their sensors for four seconds. Not a prophecy. A weather report.”
```

**跨章分支读取与不可偷渡的后果：**CH16牵手/拥抱/亲吻三个标记严格分开；CH27绝不引用未发生的吻。Kael失去军权状态永久到CH26。

**本章独立悬念镜头：**你们穿过廊桥，广播宣布：“Kael Ashford is stripped of the Alpha title.”

**小游戏（仅策划，程序外包）：**互动：选“冒雨冲向灯塔/等待闪电干扰/走维护梯”，均成功但狼群支援延时不同。

**背景/音乐/音效/环境/动画：**BG31玻璃廊桥→BG32雪夜门口；BGM02低音→风雨全开→EMO_HEART仅自愿；SFX电台失真、雷声8秒内一次。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH16_EXT_DONE`，并与原本 `CHOICE_16` 结果合并，不覆盖原本选择。


### CH16_V3｜新增逐场可播放演出与独立分支

**V3新增：暴雨里的权力代价（16A后）** `[BG31; WX_RAIN_H; WX_LIGHTNING两次间隔>12s; BGM02断至单钢琴; ACT_K_REMOVE_RING]`
Dorian给Kael最后一次机会：交出你，恢复军权。Kael把自己的首领印戒放到雨水冲刷的石栏上，任它滚进排水沟。**DORIAN:** “All this for a human who might never choose you?” **KAEL:** “Yes.” 他不看你是否感动，只站到枪口前：**“Even if she never loves me, she gets to live free.”** 代价真实执行：旧卫队离开、仓库权限冻结、Kael必须和普通人一起找避雨住所。你可以主动握他的手、把外套披给他、或保持距离。
**条件化亲密：**握手`INT_K_HAND_RAIN`; 拥抱`INT_K_HUG_RAIN`; 亲吻需要单独二次确认`INT_K_KISS_RAIN`，未选择绝不播放接吻；站远`BOUND_K_RAIN_SPACE`。**音效：**戒指落水清脆，不使用“奖赏式”掌声。

**CHOICE 16**
- **A 走向Kael并提出亲吻：**“May I kiss you?” → **KAEL:** “Yes. I've wanted that. I was waiting for you to want it too.” **[只在A下]**缓慢、简短亲吻，雨声短暂变轻；`kael.attraction+12; FLAG_K_KISS=1; EMO_HEART`。CH19/27可回忆。
- **B 在Rowan旁边坐下，只谈秘密：**“Tell me everything Dorian promised you.” → **ROWAN:** “He promised my sister would live. I believed him once. Never again.” `rowan.trust+10; FLAG_R_FULL_CONFESSION=1`；CH19提前揭证。
- **C 独自写日记，邀请Lucien通过灯火通话：**“I need to hear my own thoughts.” → **LUCIEN:** “Then I'll listen. No predictions tonight.” `agency+9; lucien.trust+4; FLAG_SELF_JOURNAL=1`；CH24月井独立路线。

**互动：**“雨幕选择”，点击擦去玻璃水汽上的三条字：Stay / Talk / Alone，映射A/B/C；选择C没有负面惩罚。**章末：**庄园地下传来三声重击，地图上从未标注的门自己打开。


## CH17｜你听见月井说了“不” / The Well Says No

**场景17A｜BG25月井洞口** `[BGM08 50%; WX_RAIN_M+WX_MOON; SFX石门摩擦]`

地下门后隐藏着一台用银链固定的月井控制器。它持续抽取狼族情绪，在月蚀时汇成献祭能量。

**LUCIEN:** “The well isn't hungry. The machine is.”

**KAEL:** “Then we turn it off.”

**ROWAN:** “After we make sure it doesn't take the whole valley with it.”

**场景17B｜BG33雪夜月池** `[BGM04; WX_SNOW; 灯火暖光]`

Lucien被控制器诱发童年预言闪回，紧握手里的灯。你可以与他并肩呼吸，或保持距离陪伴。

**LUCIEN:** “I thought I'd outgrown that room. I was wrong.”

**LUCIEN:** “Would you stay in sight? That's all I need.”

[若`FLAG_L_HAND`，他先看向手掌再说：“I remember the first time you asked me to look at you instead of tomorrow.”]

**场景17C｜BG25控制门** `[BGM06; SFX脉冲]`

你找到姨母写在门背的一句话：“A free witness can refuse the final command.”


### CH17_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**把怪异月井化成情感中心：受害者的声音被锁在里面。

**新增场景 EXT_A｜情绪冲突与可见代价**

月井响起一串“不要”，不是邪神诅咒，而是历代被迫缔约者留在井里的拒绝。玩家触摸第四印后，几十个声音第一次能被所有人听见。

```text
WELL VOICES: “No.” “Let me go.” “I never chose this.”
YOU (optional): “Then I’ll make sure they hear you.”
LUCIEN: “They trained us to call this harmony. It’s a prison choir.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

三位男主在不同入口保障你撤离，谁也不能代替你按下断链机关。Evelyn亲耳听见祖母的声音，决定提供监察厅权限。

```text
EVELYN: “That was my grandmother.”
ROWAN: “Then help us open the door.”
```

**跨章分支读取与不可偷渡的后果：**若玩家之前保护隐私，井中声音仅作为匿名证言；若主张公开，也必须取得被保存意识的授权设定，不能自动曝光所有人身份。

**本章独立悬念镜头：**你发现姨母不是被月井吞噬，而是曾成功打开第四门，却被Dorian重新封锁。

**小游戏（仅策划，程序外包）：**互动：断链顺序，不得以失败导致过去受害者永久死亡；失败则提示后重试。

**背景/音乐/音效/环境/动画：**BG25月井洞口→BG33雪夜月池；BGM08渐弱至人声残响，SFX铁链松脱/水逆流，EMO_SILENCE。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH17_EXT_DONE`，并与原本 `CHOICE_17` 结果合并，不覆盖原本选择。


### CH17_V3｜新增逐场可播放演出与独立分支

**V3新增：井中被封的拒绝声（17A后）** `[BG25; SFX千层耳语<-低音滤波; FX水面字幕浮出; BGM08降20%]`
月井下传来成百上千个被迫缔约者的声音，不断重复“我当时拒绝了”。Lucien解释旧誓约不止吸取月力，还捕获每一位拒绝者的残留意识，重写成“自愿结合”历史。你可以选择公开匿名证词、先进行身份保护、或查清能否安全解除封存。Mara拿出姨母的研究页：**“The well doesn't need love. It needs obedience disguised as love.”** 三位男主不再围绕你争宠，开始问你需要什么资源。
**回响：**`POLICY_VOICE_PRIVACY`, `EVID_WELL_TESTIMONY`, `MEM_AUNT_RESEARCH`; CH26新制度需尊重被封存意识的选择。**互动：**听三段声音辨别三种情绪，只用于排列证词，不影响救援。

**CHOICE 17**
- **A 按照姨母提示切断抽取器：**“We disconnect the machine, not the people.” → **KAEL:** “I'll hold the line. You take the switch.” `agency+8; FLAG_MACHINE_WEAK=1`；CH26月井伤害减少。
- **B 先撤离旁边被困的族人：**“No one stays chained here.” → **ROWAN:** “On it. Follow my lead if you want, or mark the exits.” `rowan.trust+6; FLAG_SAVED_CAPTIVES=1`；CH21更多证人。
- **C 请Lucien读取故障后果：**“What happens if we stop it now?” → **LUCIEN:** “Three paths. None painless. One survivable without a sacrifice.” `lucien.trust+7; moon_resonance+10; FLAG_SAFE_SEQUENCE=1`；CH26提示清晰。

**互动：**“断链顺序”先断蓝链再断银链；失败无角色死亡，触发备用撤离路线。**章末：**Dorian在通话中冷笑：“You've found the engine. You still haven't found the key.”


## CH18｜三个人第一次听你发号施令 / Your Plan, Our Pack

**场景18A｜BG34地图室** `[BGM05→02; 雨声渐息; 地图光点]`

玩家召开第一次联合会议。Kael提供正规人手、Rowan提供地下通道、Lucien提供防护阵列；三人意见相左，但明确听取玩家决定。

**KAEL:** “Tell us the outcome you want.”

**ROWAN:** “And the risks you're willing to take.”

**LUCIEN:** “We'll tell you the costs. All of them.”

**场景18B｜BG18石阵** `[BGM08低音; WX_MOON; 狼印逐个亮]`

他们试着将三印同时接入石阵却发现缺少第四条人类见证指令。玩家腕上银纹充当通路，但**不需要流血或牺牲**。

**LUCIEN:** “The missing piece isn't blood. It's consent. The oath cannot be renewed without a free witness.”

**场景18C｜BG10餐厅** `[BGM07; 灯火温暖; SFX杯沿轻碰]`

会议后，三人带来三份不同的晚餐：Kael记得你讨厌过甜，Rowan给你留了最脆的面包，Lucien根据你在CH12取名的花装饰餐桌（未触发则用普通夜铃花）。

**ROWAN:** “For the record, this is not a contest.”

**KAEL:** “For the record, you're losing.”

**LUCIEN:** “For the record, we should eat before the soup gets cold.”


### CH18_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**玩家主动领导，三男主各自承担不可互换的任务。

**新增场景 EXT_A｜情绪冲突与可见代价**

你在地图室制定救人方案：Kael负责阻止原卫队、Rowan潜入第四门、Lucien切断伪预言广播。三人第一次不争抢陪你而是尊重你的分工。

```text
KAEL: “Tell me where you need me.”
ROWAN: “I hate taking orders. Yours are annoyingly good.”
LUCIEN: “I can hold the signal for six minutes. Make those minutes count.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

你决定公开计划吸引盟友，还是秘密行动保护证人；每种方式都有不同损失（公众误解 / 消耗更多时间），均不会无代价大获全胜。

```text
MARA: “You don’t have to win by making everyone love you. You have to get them home.”
```

**跨章分支读取与不可偷渡的后果：**早期选择改变队友对你的称呼和补充资源：Kael守卫/Rowan暗路/Lucien月井提示。

**本章独立悬念镜头：**地图的红点开始移动：Dorian早已把失踪证人转移到月蚀圣坛。

**小游戏（仅策划，程序外包）：**互动：将角色拖到任务点做策略部署，告知“结果影响资源和营救动画，不决定人物生死”。

**背景/音乐/音效/环境/动画：**BG34地图室→BG18石阵；BGM03+08低层，SFX地图图钉/远号角，WX_MOON。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH18_EXT_DONE`，并与原本 `CHOICE_18` 结果合并，不覆盖原本选择。


### CH18_V3｜新增逐场可播放演出与独立分支

**V3新增：这次他们等你发号施令（18A后）** `[BG34; BGM05→02鼓点同步; FX地图路线依序亮; SFX磁性棋子吸附]`
你在地图上安排突破议会封锁的三路小队。Kael想保护你去最近安全区；Rowan想先抢证据；Lucien主张封印月井。三人争论时，你敲响桌上银铃。**YOU（选项式可编辑）:** “Stop deciding for me. Here's the plan.” **KAEL:** “I'm listening.” **ROWAN:** “Finally, a boss I like.” **LUCIEN:** “I'll follow the plan you choose, and tell you what it might cost.”
**游戏：**在地图把守卫、潜行、研究分派给不同人员；任意有效组合可过关，选择不同则CH20保护对象和被困入口不同；默认组合可跳过。**长期：**存`TACTIC_TEAM_ORDER`数组，CH25/26回调对应分工，杜绝所有人同时出现在两个地方。

**CHOICE 18｜世界政策初选，后续可于CH24修改一次**
- **A 建立三个族群共同议会：**“Power should be shared, and every pack should have a voice.” → **KAEL:** “Then I'll be the first to give mine away.” `pack_policy=free_packs; agency+8`；CH26尝试分权。
- **B 暂时保留旧誓约但废除献祭：**“We change the law before we change the structure.” → **EVELYN（远程）:** “I can work with that.” `pack_policy=old_oath; agency+5`；CH26改革保守路线。
- **C 永久封存月井：**“No one should control it at all.” → **LUCIEN:** “Then we'll need a way for the valley to live without its light.” `pack_policy=seal_well; moon_resonance+5`；CH26封井路线。

**互动：**“地图战术”，拖动撤离、证据、护阵三枚棋子到优先位置，影响下一章场景顺序但不令路线失败。**章末：**议会宣布将以“干扰月井”罪名公开审判Kael。


## CH19｜首领当众摘下他的戒指 / The Ring on the Table

**场景19A｜BG35议会外厅** `[BGM05; WX_WIND_L; SFX戒指落木桌]`

Kael收到停职命令。为避免族人被拖入冲突，他主动把首领戒放到桌面。

**KAEL:** “If holding this title means asking her to kneel, then the title isn't worth keeping.”

**KAEL（对玩家）:** “I won't ask you to choose me as a shield. I want you safe enough to disagree with me.”

**场景19B｜BG36废教堂** `[BGM06; 风吹纸页; SFX木门]`

Rowan从Dorian旧仓库取出完整通行记录：当年Dorian亲自将复制印放进控制器，嫁祸Iris。Rowan愿意把自己当年的错误也列入证词。

**ROWAN:** “I can clear my name if I hide my part. I'm not doing that.”

**ROWAN:** “You deserve the whole story, even the part that makes me look bad.”

**场景19C｜BG13档案馆** `[BGM04; 纸片悬浮FX_MEMORY]`

Lucien将两份相互印证的档案交给Evelyn。她终于同意暂缓执行旧式月蚀献祭。

**EVELYN:** “I will not sign a sentence while the evidence is this compromised.”


### CH19_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**高峰反转：叔父用他亲手养大的制度剥夺Alpha身份。

**新增场景 EXT_A｜情绪冲突与可见代价**

Kael将首领戒放到公众席，要求独立调查；Dorian当场宣布对Kael的叛逆裁定，狼群被迫在旧誓约与公开证据之间站队。

```text
DORIAN: “You would abandon your bloodline for her?”
KAEL: “I’m abandoning the part of it that taught us to own people.”
KAEL (to you): “I want you. I won’t use a crown to keep you.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

Rowan拿出隐藏档案，承认自己的过往监视，要求对自己同样调查；Lucien提交镜面证据但拒绝作出未经核验的绝对预言。

```text
ROWAN: “Put my name on the record, too.”
EVELYN: “Finally. A room full of people willing to sign their own testimony.”
```

**跨章分支读取与不可偷渡的后果：**玩家可以选择当众站在Kael身边但不承诺恋爱；不站他身旁也不自动认作背叛。证据结果用多重线索核对。

**本章独立悬念镜头：**宣布裁定后，Dorian下令在月蚀夜以玩家完成旧誓“最终修复”。

**小游戏（仅策划，程序外包）：**互动：证据墙串联签字令、银毒采购和失踪证人；错误最多提示三次。

**背景/音乐/音效/环境/动画：**BG35戒指交出→BG36废教堂；BGM05转宏大低弦；SFX戒指触桌、回声。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH19_EXT_DONE`，并与原本 `CHOICE_19` 结果合并，不覆盖原本选择。


### CH19_V3｜新增逐场可播放演出与独立分支

**V3新增：戒指落下的一秒（19A后）** `[BG35; BGM05全停1秒; SFX银戒敲木桌; ACT_K_OPEN_HAND]`
Kael将象征血统继承的戒指放到议会面前。Dorian宣读剥夺宣言，威胁让其家族史被删除。Kael没有为你要求补偿：**KAEL:** “You can keep the title. The people who need shelter still know my name.” 你能站到他旁边、出示档案证据、或从台下记录反对者；不同选择决定CH21出庭人员。若玩家选择不帮他，他仍在CH20保护避难者，但信任需要靠真实沟通修复。
**高潮：**镜头从戒指俯拍切到Kael空荡的手，音乐仍保持安静再进BGM04，避免重复煽情。

**CHOICE 19**
- **A 公开站在Kael身边，但不表态恋爱：**“I stand for the truth. And today, he's telling it.” → **KAEL:** “Then I'll keep earning that faith.” `kael.trust+10; FLAG_DEFEND_K=1`；CH21他不被孤立。
- **B 陪Rowan公开自认错误的证词：**“Tell it exactly as it happened.” → **ROWAN:** “Thank you for not making me pretend to be a hero.” `rowan.trust+10; FLAG_R_TESTIMONY=1`；CH21对他的指控失效。
- **C 提醒Evelyn必须保护证人：**“Truth is useless if witnesses vanish.” → **EVELYN:** “Witness protection begins tonight.” `agency+8; FLAG_WITNESS_SHIELD=1`；CH21证据安全。

**互动：**“证据墙”，连接Dorian→复制印→机器→驱逐令。**章末：**Dorian发动私人卫队夺取月井，Evelyn的官方封锁令已来不及送达。


## CH20｜这一夜，每个人都选择了你 / The Night They Stayed

**场景20A｜BG37红月下的避难所** `[BGM08; WX_WIND_H; FX_ECLIPSE前兆; SFX远处奔跑]`

红月提前升起。Lucien用月纹屏障保护避难所里的孩子，即使这会让他暂时失去预言能力。

**LUCIEN:** “For once I don't know what happens next.”

**LUCIEN（看向你）:** “I'm terrified. And I'm still here.”

**场景20B｜BG38冬舞会门口临时收容区** `[BGM07; WX_SNOW; 暖灯照三男主]`

Kael带着食物和担架；Rowan送来了救出的族人；Lucien整理伤者名字。三人终于不是在比谁更被爱，而是在做你希望他们做的事。

**KAEL:** “Every family we found is accounted for.”

**ROWAN:** “Iris says the kids are okay. She also says you need sleep.”

**LUCIEN:** “I believe Iris is correct.”

**场景20C｜BG10烛光晚餐** `[BGM07; 风雪声远; EMO_HEART仅自愿]`

凌晨三人给你留出最安静的椅子。

**KAEL:** “You can stop being brave for a little while.”

**ROWAN:** “We'll take the next shift.”

**LUCIEN:** “And when you wake up, we'll tell you the truth. Not the comforting version.”


### CH20_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**不再只有恋爱甜戏：救援中看见每个人可爱与真实的成本。

**新增场景 EXT_A｜情绪冲突与可见代价**

红月夜难民营停电，Lucien用自己的记忆替孩童抵挡月井幻觉，醒来后竟忘记你们在温室说过的话。你可以重新告诉他，也可以留给他空间。

```text
LUCIEN: “I know you matter to me. I’m afraid I’ve forgotten why.”
YOU (optional): “Then we’ll make new reasons.”
LUCIEN: “That sounds more terrifying. And more beautiful.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

Kael卸下指挥权却亲自搬医疗物资；Rowan把唯一可逃离的车辆交给Iris救伤者。舞会门前，你看到三位男人分别做出决定，没有争着当中心。

```text
ROWAN: “Turns out my getaway car is better as an ambulance.”
KAEL: “No speeches. We have blankets to carry.”
```

**跨章分支读取与不可偷渡的后果：**是否陪Lucien重建记忆影响CH29细节；若不陪，他有自己的手账自行修复，避免角色依赖玩家而失能。

**本章独立悬念镜头：**获救儿童送来一枚带Dorian印记的假狼印：原来“最后祭品”不是玩家，是被困在月井的全部意识。

**小游戏（仅策划，程序外包）：**互动：选择资源优先级（医疗/保暖/通讯），可通过团队互助解决，避免真实生命惩罚。

**背景/音乐/音效/环境/动画：**BG37红月庇护所→BG38舞会门厅；BGM07与低鼓交错，SFX发电机熄火/孩子轻声感谢，FX_MOON血红渐退。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH20_EXT_DONE`，并与原本 `CHOICE_20` 结果合并，不覆盖原本选择。


### CH20_V3｜新增逐场可播放演出与独立分支

**V3新增：红月避难所的三种陪伴（20B后）** `[BG38→BG10; WX_SNOW_L; BGM07; SFX瓷杯/柴火/远方奔跑]`
月蚀前的灾民挤满走廊。三人各做不同的事：Kael给受伤孩子换药；Rowan将最后一车食物交给Iris；Lucien面对丢失的记忆努力记下收容者的名字。你可选择帮助其中一人、照顾灾民或独自整理证据。无论选谁，其他人继续工作，不因玩家未选而“消失”。若照顾Lucien，他翻开写着你名字的空白页：**LUCIEN:** “I don't remember why I wrote your name first. But I'm glad I did.”
**分支：**存`MEM_SHELTER_PARTNER`，CH26危险时该角色优先回应；选择灾民→`FLAG_CIVIC_LEADER`, CH30独立结局群众行动增加；选择独处→`MEM_SELF_RECOVERY`，CH24真实回响。

**CHOICE 20｜关系意向，非最终承诺**
- **A 和Kael单独谈话：**“Can you stay a little longer?” → **KAEL:** “As long as you want my company.” `kael.attraction+8; FLAG_NIGHT_K=1`；CH22/27由他主动提起陪伴。
- **B 与Rowan去门前看雪：**“You make it easier to breathe.” → **ROWAN:** “That's the nicest dangerous thing anyone's ever said to me.” `rowan.attraction+8; FLAG_NIGHT_R=1`；CH22/28专属对白。
- **C 和Lucien一起守最后一盏灯：**“You don't have to see tomorrow to be here tonight.” → **LUCIEN:** “Then this is the future I'm choosing.” `lucien.attraction+8; FLAG_NIGHT_L=1`；CH24/29回响。

**互动：**“照顾收容区”按优先级安排床位/热水/医护，操作结果只影响感谢信内容。**章末：**远处月井光柱冲天，Dorian宣称他已拿回“真正的第四印”。


## CH21｜她终于拿到了发言权 / The Witness Takes the Floor

**场景21A｜BG39审判大厅** `[BGM05; 冷白聚光; SFX木槌]`

Dorian试图借旧条款宣判Kael失去首领资格，并强迫你作为“月之所有物”接受交接。

**DORIAN:** “The Moonbound has no standing in this court.”

**KAEL:** “Then this court has no standing to rule on her life.”

你站起来，明确声明自己作为庄园继承人、事件见证人的独立地位。[若`FLAG_PUBLIC_WITNESS`，场内有人跟着起身；否则Evelyn允许依据证据陈述。]

**场景21B｜BG40断桥** `[BGM03; WX_WIND_H; SFX流水]`

Rowan负责护送证人跨过断桥，发现Dorian的人试图夺走Iris保存的原始文件。

**ROWAN:** “Nobody gets to erase her twice. Not while I'm standing here.”

**IRIS:** “I'm not helpless, Rowan.”

**ROWAN:** “I know. That's why I'm following your plan.”

**场景21C｜BG30审议台** `[BGM06; 纸张翻动]`

Evelyn核验多份证据，承认旧誓约缺失自由见证者条款。

**EVELYN:** “I defended the law. I will not defend a forgery.”


### CH21_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**审判不靠主角光环，而靠完整证据与自我承认。

**新增场景 EXT_A｜情绪冲突与可见代价**

Evelyn举行公开听证：Dorian用一份“姨母自愿交出四印”的录像反杀你们。玩家可要求播放未经剪辑的原片；Mara指出录像中的手表时间与庄园停电记录冲突。

```text
DORIAN: “She consented. You just don’t like the answer.”
YOU (optional): “Then show us every second.”
MARA: “Her watch stopped at 9:12. The grid went dark at 8:47.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

Kael作为证人承认自己有利于Dorian的旧签字，Rowan承认监视过姨母；两人的坦白反而形成不受收买的证据链。

```text
KAEL: “Don’t protect me from the questions.”
ROWAN: “If the truth makes me look ugly, leave that part in.”
```

**跨章分支读取与不可偷渡的后果：**证据根据CH03/06/15与替代来源组合呈现，绝不因漏掉一个小游戏而无法击败反派。

**本章独立悬念镜头：**听证还没结束，月井的光柱冲破山谷，审判厅窗户同时裂开。

**小游戏（仅策划，程序外包）：**互动：庭审质证“哪个时间码不可能”，错误则证人辅助，不锁死。

**背景/音乐/音效/环境/动画：**BG39审判厅→BG30议事台；BGM05→08，SFX法槌、玻璃裂，WX_LIGHTNING单次。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH21_EXT_DONE`，并与原本 `CHOICE_21` 结果合并，不覆盖原本选择。


### CH21_V3｜新增逐场可播放演出与独立分支

**V3新增：法庭上被剪掉的八秒（21A后）** `[BG39; BGM05钢琴音消失; FX投影定格和波形; SFX木槌两次]`
Dorian播放你“自愿签订誓约”的录像，整个厅堂骚动。你注意到录像中你的腕纹在镜子里出现在错误位置，少了八秒音轨。你可调用镜片、银箭账册、Iris的证人陈述或Mara保存的笔记，至少一种证据可完成基本质疑。**YOU（陈述台词供用户选择）:** “You can edit my face. You cannot edit my consent.” Evelyn第一次承认程序不公，要求暂停执行。
**回响：**证据足够→`FLAG_DORIAN_TRIAL_READY`; 不足→`FLAG_INVESTIGATION_OPEN`，CH26仍能救井但不会凭空宣判。**视觉：**禁止使用不必要的人物受虐影像。

**CHOICE 21**
- **A 让Kael公开弃用强制服从条款：**“No Alpha should own anyone's future.” → **KAEL:** “Write it down. I'll sign first.” `agency+8; FLAG_ALPHA_REFORM=1`；CH26改革可直接落地。
- **B 把证人保护权交给Iris：**“Let the person they silenced lead the record.” → **IRIS:** “I accept.” `rowan.trust+6; FLAG_IRIS_LEAD=1`；CH30族群重建她任监察人。
- **C 让Evelyn宣布暂停所有祭献：**“Stay every order until the truth is heard.” → **EVELYN:** “Done. Effective now.” `agency+7; FLAG_STAY_ORDERS=1`；CH25撤离时间增加。

**互动：**“庭审质证”，按照片→通行记录→原誓文依次展示，跳过则Evelyn按固定顺序提出。**章末：**Dorian自称无需议会授权，月井控制器已经认他为主人。


## CH22｜他说想要你，但不愿让你失去自己 / Want, Not Ownership

**场景22A｜BG32初雪门廊** `[BGM03变奏; WX_SNOW; SFX雪落衣面]`

Rowan准备独自潜入Dorian据点。他提前告诉你计划，没有用“为你好”作为隐瞒借口。[若`FLAG_R_HONESTY`或`FLAG_R_FULL_CONFESSION`，他递上完整位置图。]

**ROWAN:** “I want you. That's real.”

**ROWAN:** “So is the fact that your life doesn't start and end with me. I'm not going to confuse the two.”

**场景22B｜BG41神谕树** `[BGM04; WX_MOON; 卷轴被撕时粒子飞散]`

Lucien撕毁印有“你必属于某人”的私人神谕卷轴，公开声明预言不能当作契约。

**LUCIEN:** “People used these words to make every choice for me.”

**LUCIEN:** “I won't use them on you. Not even if you decide you don't want me.”

**场景22C｜BG07壁炉厅** `[BGM07; 暖光; 角色呼吸动态]`

Kael看见Rowan的潜入计划，只问你是否需要支援，而不把过去的争执带入执行。

**KAEL:** “If you trust his route, we'll support it. My pride can wait.”


### CH22_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**中后段再反转：Lucien失去预知并不是“治愈”，而是真实的新代价。

**新增场景 EXT_A｜情绪冲突与可见代价**

为关闭广播，Lucien当众撕毁自己保管的伪预言卷轴，月影能力瞬间熄灭。他惊慌地问你明天会不会下雨，因为他第一次看不到。

```text
LUCIEN: “I can’t see tomorrow.”
YOU (optional): “Neither can I.”
LUCIEN (small laugh): “Then I’m finally meeting you where you live.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

Rowan带你走向断桥，告知第四门已被守卫封死。他给你一条退路，并郑重承诺即使你不和他一起走也支持你。

```text
ROWAN: “There’s always an exit. If you take it, I won’t call it abandonment.”
```

**跨章分支读取与不可偷渡的后果：**若Lucien失去记忆，玩家此前留下的手账在此生效；若没有，仍由他自己持有备份笔记。CH29不允许他突然恢复完整预言能力。

**本章独立悬念镜头：**雪落到手心时不融化——月井开始将整个山谷冻结。

**小游戏（仅策划，程序外包）：**互动：选择“修通讯/救被困守卫/赶往第四门”，影响CH25可用辅助资源。

**背景/音乐/音效/环境/动画：**BG41神谕树→BG40断桥→BG32雪夜门口；BGM04变调至空白氛围；SFX纸燃烧、静电/结冰脆响，WX_SNOW。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH22_EXT_DONE`，并与原本 `CHOICE_22` 结果合并，不覆盖原本选择。


### CH22_V3｜新增逐场可播放演出与独立分支

**V3新增：没有预言的第一次约会（22A后）** `[BG32→BG41; WX_SNOW_L; BGM04只有木吉他和钢片琴; ACT_L_UNCERTAIN_SMILE]`
Lucien再也看不到未来，连走出门是否下雪都无法提前知道。他带了两双不同颜色的手套，因为不记得你喜欢哪一种。**LUCIEN:** “I used to know the weather before it happened. Today I guessed. Very badly.” 你可以陪他散步、告诉他只想做朋友、或帮助他建立儿童教育计划。若选择约会，他坦白：**“I want to kiss you. I won't pretend the moon told me to.”** 只有玩家明确同意才播放亲吻；若拒绝，他笑说：**“Then hot chocolate is our next great mystery.”**
**回响：**`MEM_L_FIRST_ORDINARY_DAY`; `FLAG_L_FRIEND`关闭后续默认情侣台词；`FLAG_L_SCHOOL`开长期事业线。

**CHOICE 22**
- **A 请Rowan安全回来再谈感情：**“Come back alive. Then ask me what I want.” → **ROWAN:** “That's a promise I can fight to keep.” `rowan.attraction+10; FLAG_R_RETURN=1`；CH28回归后的告白更强。
- **B 请Lucien保留属于自己的未来：**“Don't destroy what you love just to impress me.” → **LUCIEN:** “You see me. Not the oracle.” `lucien.attraction+8; FLAG_L_SELF=1`；CH29预言者职业新生。
- **C 与Kael制定联合营救而非孤胆行动：**“We do this as a team.” → **KAEL:** “Then no one gets left behind.” `kael.trust+7; FLAG_TEAM_RESCUE=1`；CH25减少风险。

**互动：**“潜入计划”选潜入时机（日落/子夜/黎明），改变CH23解锁的简短环境镜头，不影响证据存在。**章末：**Rowan在Dorian据点找到一扇标着“Witness Zero”的门。


## CH23｜你让流亡者回家 / Home Is a Choice

**场景23A｜BG43归乡集市** `[BGM10轻快版; 冬日暖阳; SFX集市人声]`

Iris带Rowan穿过曾经辱骂他的街道。市集上的人开始主动向他道歉，有人留下新鲜面包而不强迫他立刻接受。

**ROWAN:** “I pictured this a thousand times. Somehow I never pictured being scared of it.”

**IRIS:** “Then be scared. Come home anyway.”

**场景23B｜BG42雪后林地** `[BGM02; 太阳融雪; SFX铁锹和笑声]`

Kael与年轻族人亲自修复因封锁令损毁的村道，不再只是发布命令。

**KAEL:** “The old rules taught us to protect power. I want them to remember we can protect people.”

**场景23C｜BG16药剂铺** `[BGM07; 阳光透窗]`

Iris将“Witness Zero”钥匙交给你，原来那道门最早为姨母准备，是保护自由见证人的避难所。

**IRIS:** “She left it for someone who might need to say no to everyone.”


### CH23_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**关系回报：重建家园不是取消反转，而是更高风险前的喘息。

**新增场景 EXT_A｜情绪冲突与可见代价**

Iris终于在归乡集市公开自己的名字，之前骂她叛徒的人来道歉；她不接受廉价道歉，要求建立对所有病人的补偿制度。Rowan看见她笑，第一次把“回家”说出口。

```text
IRIS: “You don’t get forgiveness by saying the right sentence.”
ROWAN: “I kept imagining the day they let you back. Never imagined you’d be the one setting the terms.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

Kael在广场亲自为过去的命令承担责任，玩家可选择握他的手或在人群中保持距离；无论如何制度改革都继续。

```text
KAEL: “I’m not asking them to love me again. I’m asking them to hold me accountable.”
```

**跨章分支读取与不可偷渡的后果：**若玩家走Rowan亲密线，Iris邀请二人共进晚餐；否则邀请“你和我哥哥作为朋友”，不强迫亲密身份。

**本章独立悬念镜头：**失踪证人向你传来最后坐标：月井底部还有一封姨母写给你的信。

**小游戏（仅策划，程序外包）：**互动：给归乡者留言，保存玩家选择的祝福作为CH30墙上的文字。

**背景/音乐/音效/环境/动画：**BG42晴雪集市→BG43日落摊位；BGM10柔和但不终局，SFX市集人声、风铃。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH23_EXT_DONE`，并与原本 `CHOICE_23` 结果合并，不覆盖原本选择。


### CH23_V3｜新增逐场可播放演出与独立分支

**V3新增：妹妹的家宴不是奖杯（23C后）** `[BG16; BGM07温暖弦乐; SFX碗碟轻碰; ACT_R_NERVOUS_HANDS]`
Iris在药剂铺后厨房做了一桌失败的晚餐，Rowan紧张得不停擦已经干净的杯子。**IRIS:** “He spent years learning how to leave. It's taking him longer to learn how to stay.” Rowan望向你：**ROWAN:** “I won't ask you to forget what I did. But I want you to see what I do next.” 玩家可以接受修复谈话、继续保持距离或明确朋友身份。只有在CH14进入修复状态且本章完成一次责任行动后才能开启接吻或伴侣后日谈。
**回响：**`R_REPAIR_STEP_2`，CH28计算资格；如果仍不原谅，提供共同重建工作而非恋爱惩罚。

**CHOICE 23**
- **A 陪Rowan走进市集：**“You don't have to face this alone.” → **ROWAN:** “Then walk beside me. Not behind.” `rowan.attraction+8; FLAG_R_HOME=1`；CH30R举办归乡晚餐。
- **B 和Kael修最后一块路牌：**“Let's make the road say everyone belongs.” → **KAEL:** “That's better than anything my father taught me.” `kael.attraction+7; FLAG_NEW_ROAD=1`；CH30K新族规。
- **C 把避难所钥匙公开交给Mara保管：**“A safe exit should never belong to one person.” → **MARA:** “Your aunt would have liked that.” `agency+9; FLAG_PUBLIC_SHELTER=1`；CH30N创建中立庇护所。

**互动：**“归乡留言”：从三个短句中选Rowan愿意留下的公开回复，也可自由写；记入`MEM_R_HOME_MESSAGE`。**章末：**避难所墙壁显示控制器的停止口令缺一半，另一半藏在玩家姨母的日记里。


## CH24｜第一次，你可以不选择任何人 / Your Own Moon

**场景24A｜BG44观星台** `[BGM09; 夜空星群移动; 风极轻]`

Lucien告诉你，月蚀即将到来，三人都愿陪伴，但关系选择可以等到危机结束。

**LUCIEN:** “You don't have to decide who to love in order to decide who you are.”

**LUCIEN:** “Whatever you choose, I hope you keep your own sky.”

**场景24B｜BG14家族照片墙** `[BGM07; FX_MEMORY姨母年轻时影像]`

Mara拿出姨母最终录音。她说自己从未成为狼人，也从未与任何人缔结强制伴侣关系，但仍改变了整个山谷。

**AUNT_RECORDING:** “If they tell you love is proven by surrender, ask why the people demanding it never surrender anything.”

**AUNT_RECORDING:** “Your life is not the price of their peace.”

**场景24C｜BG44星空近景** `[BGM09; EMO_SILENCE 1秒]`

玩家在无人催促的深夜写下自己的原则。这一段支持自由输入，会在结局和后日谈中逐字回忆，不强制用户交代现实隐私。


### CH24_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**终战前玩家可以选择自己，不会被“你必须有伴侣”惩罚。

**新增场景 EXT_A｜情绪冲突与可见代价**

观星台上三人各自表达想要留下，却不把爱情变成阻止你冒险的理由。Kael请你说出害怕的事，Rowan承认想和你逃，Lucien只说他希望明天还能听见你的笑。

```text
KAEL: “You don’t need to be fearless for me.”
ROWAN: “I want to run away with you. I’m not proud of it. But I won’t make it your problem.”
LUCIEN: “If we get a tomorrow, I want to ask you about something ordinary.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

你可以明确一段关系、选择暂不承诺或对他们说“我是为我自己去的”。每一回应都改变CH25三人站位，但都提供全员协作。

```text
MARA: “Being loved should make the world larger, sweetheart. Not smaller.”
```

**跨章分支读取与不可偷渡的后果：**拒绝任何恋爱后，后续不再自动出现伴侣称呼和强制拥抱；紧密友谊依然有情绪高潮。

**本章独立悬念镜头：**天空中出现第二轮不可能的月影——真正的月蚀并非天象，而是月井投射。

**小游戏（仅策划，程序外包）：**互动：给自己的未来写一句话（玩家自由输入，字数限60），CH30可回读。

**背景/音乐/音效/环境/动画：**BG44观星台→BG49月池；BGM09简钢琴；SFX长风与远钟，无心跳强推。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH24_EXT_DONE`，并与原本 `CHOICE_24` 结果合并，不覆盖原本选择。


### CH24_V3｜新增逐场可播放演出与独立分支

**V3新增：姨母留下的不是一封遗嘱（24B后）** `[BG14→BG44; BGM09极轻; FX老照片溶解成星图; SFX钢笔尖划纸]`
你发现姨母写给未来继承人的一张便签：“I hope you meet people worth choosing. More than that, I hope you learn that you can choose yourself.” 她留下的不是婚姻名单，而是一份山谷公共庇护所建设草案。玩家可以写下给未来自己的句子（自由输入最多140英文字符），或选“我想建立家”“我想继续冒险”“我想先成为自己”。这句话会在CH30结局中逐字回收。三位男主不在此场景争取玩家选择。
**回响：**`MEM_FUTURE_LETTER`；政策可在这里最终更改一次，CH26之后不可自动重写。

**CHOICE 24｜政策二次确认（唯一可改一次机会）**
- **A 保持独立且暂不恋爱：**“I will save this valley on my terms.” → **LUCIEN:** “Then we make room for those terms.” `FLAG_RELATION_UNDECIDED=1; agency+10`；CH30N不需要达到爱情分。
- **B 确认对某人有好感但不作承诺：**“I know what I feel. I want to choose when we're safe.” → **KAEL:** “We'll wait until you ask.” `FLAG_ROMANCE_OPEN=1; agency+6`；CH27–29分别可约会。
- **C 复议世界政策：**“I want to change the plan before we act.” → **三男主同意当场重新讨论**，弹出`pack_policy`三选一；`FLAG_POLICY_REVISED=1; agency+6`；CH26采用新政策。

**互动：**“写给未来的自己”：可自由输入一句话，若跳过默认“No one gets to decide my worth for me.”；记录`MEM_SELF_OATH`。**章末：**录音最后传来停止口令：“The moon witnesses. It does not command.”


## CH25｜月食开始，三人都在等你的信号 / Before the Dark

**场景25A｜BG45圣坛入口** `[BGM08; FX_ECLIPSE 15%→40%; WX_WIND_H; 月尘粒子]`

月食开始。Kael带主队守住北门，Rowan率领撤离者走林路，Lucien在石阵刻下新誓文。你掌握完整停止口令。

**KAEL:** “The north gate is ours. Give the word when you're ready.”

**ROWAN:** “Escape route clear. And yes, I checked it twice.”

**LUCIEN:** “The seals are stable. For now.”

**场景25B｜BG36废教堂门厅** `[BGM06; 窗外红光; SFX纸张散落]`

Dorian释放旧的伪造证言，试图用“玩家害死过往见证人”的谎言动摇你。真实证据显示姨母死于自然疾病，她留下了完整选择权。

**DORIAN:** “Without me, the wolves tear each other apart.”

**YOU（根据玩家选择发言）**

**KAEL（如果同场）:** “You made them afraid of one another, and called that order.”

**场景25C｜BG45圣坛中央** `[BGM08升到70%; FX_ECLIPSE 50%; 三狼印依次亮起]`

你站在中央，三位男主分别在可见位置，不围堵、不触碰玩家。仪式须由玩家主动按下“开始”。

**LUCIEN:** “We can stop. Even now.”

**ROWAN:** “And if we go on, we go on because you say so.”

**KAEL:** “Whatever happens next, you are not alone.”


### CH25_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**终局第一层反转：以为救世界的方法其实在喂养邪恶机制。

**新增场景 EXT_A｜情绪冲突与可见代价**

圣坛上Dorian拿出“第四印授权书”，声称只要你亲吻某个狼印持有者就能停止月蚀。Lucien指出这是伪造的二次绑定：强迫公开亲密会为月井再供能。

```text
DORIAN: “Pick one. Save them all.”
LUCIEN: “That’s the trap. The well feeds on choices made under threat.”
KAEL: “Don’t choose me to save people. Choose freely, or don’t choose at all.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

玩家可以当场拒绝、假意拖延取证或转身撤离救援平民。三人分工阻挡守卫，Rowan取下自己的狼印制造通路。

```text
ROWAN: “I didn’t survive exile just to watch them turn love into a weapon.”
```

**跨章分支读取与不可偷渡的后果：**CH24承诺对象只影响其专属告别台词，不决定谁牺牲；终局决策以世界政策和证据为主。

**本章独立悬念镜头：**Dorian强行触发假誓，月井忽然开始吞噬他自己的记忆。

**小游戏（仅策划，程序外包）：**互动：三印解锁+“是否签署”明确拒绝按钮，不做失败即献祭的QTE。

**背景/音乐/音效/环境/动画：**BG45月蚀圣坛；BGM08大鼓到9成→对话时压至20%，SFX链环旋转、月光脉冲，FX_ECLIPSE。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH25_EXT_DONE`，并与原本 `CHOICE_25` 结果合并，不覆盖原本选择。


### CH25_V3｜新增逐场可播放演出与独立分支

**V3新增：月蚀礼台上最后一个骗局（25C前）** `[BG45; FX_ECLIPSE由20→65%; WX_WIND_H; BGM08分离低鼓; SFX金属法阵闭合]`
Dorian宣布：想要救山谷，必须当众选择一名狼族伴侣，并立即亲吻完成誓约。三名男主瞬间明白：亲密行为被当成可强迫的钥匙。**KAEL:** “She doesn't owe us a kiss.” **ROWAN:** “Or a decision made with a knife at her throat.” **LUCIEN:** “That isn't love. It's a mechanism.” 你可以假装同意以拖时间、公开拒绝、或让三人按CH18战术分开行动。假装同意不会强制发生亲吻；游戏进入破阵计时，不涉及对玩家身体的控制。
**回响：**`FLAG_FALSE_CONSENT_TRAP`永久写入真相账本；Dorian试图用“爱”操纵仪式的行为在CH26承担后果。

**CHOICE 25｜战术，不决定恋爱**
- **A 先保住族群撤离：**“Move the families before we touch the well.” → **KAEL:** “All teams, evacuate.” `FLAG_FINAL_EVAC=1; agency+5`；CH26伤害风险最低。
- **B 先公开Dorian伪造资料：**“Let everyone hear the truth.” → **ROWAN:** “Putting it on every channel now.” `FLAG_FINAL_TRUTH=1; evidence+=DORIAN_AUDIO`；CH26Dorian失去支持。
- **C 先稳定三枚狼印：**“Lucien, tell me the safest order.” → **LUCIEN:** “First the outcast. Then the oracle. Last the Alpha.” `FLAG_FINAL_STABLE=1; moon_resonance+8`；CH26控制器不会震荡。

**互动：**“月蚀倒计时”轻触三狼印按顺序激活，允许暂停与重试；选择不玩由角色协助完成，不以失败惩罚。**章末：**Dorian启动“Witness Zero”旧代码，井水倒流，整个圣坛浮起。


## CH26｜你拒绝成为祭品 / The Oath Belongs to No One

**场景26A｜BG46月井光柱** `[BGM08高潮; FX_ECLIPSE 65%→100%; WX_LIGHTNING远处1次; SFX月井低鸣]`

Dorian要求你将手放在祭献台上，否则月井会吞噬山谷。Lucien发现真正指令：不是献祭，而是由自由见证者拒绝控制器，然后三枚印章共同重新定义能量流向。

**DORIAN:** “You are the price of peace.”

**YOU（确定台词）:** “No. I'm the person who gets to say no.”

**KAEL:** “And we stand by that answer.”

**ROWAN:** “Every last one of us.”

**LUCIEN:** “The moon witnesses. It does not command.”

**场景26B｜BG46能量分流** `[BGM09与08重叠，逐渐由紧张转明亮; 三路粒子分流]`

[根据`pack_policy`播放唯一对应路线，不能同时播放三种结局]

**IF free_packs：**你将三枚印章的能量分配给不同族群的公开议会，并加上可以退出、可以质询的章程。**EVELYN:** “No single Alpha controls the light anymore.” **KAEL:** “Good.”

**IF old_oath：**你保留保护性结界，却删除任何关于强制伴侣、献祭与剥夺退出权的条款，成立公开审查机制。**EVELYN:** “Law can change and still protect.” **LUCIEN:** “Then let it be a living promise.”

**IF seal_well：**你与三男主协作将能量引入地下自然循环，关闭人造控制器并分阶段撤离依赖月井的族群。**ROWAN:** “We can learn to live without a chain.” **KAEL:** “We will.”

**场景26C｜BG46余光** `[BGM10渐入; FX_ECLIPSE恢复日光; SFX金属断裂]`

控制器碎裂，Dorian被Evelyn和族人依法拘押，明确保留后续审理，不安排私刑或直接处死。玩家倒退半步，三人只在确认你需要后靠近。

**KAEL:** “It's over. You did it.”

**ROWAN:** “Correction. We did it. And you led.”

**LUCIEN:** “I didn't see this ending.”


### CH26_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**揭示终极真相并给玩家极强主动权与可见成果。

**新增场景 EXT_A｜情绪冲突与可见代价**

Dorian坦白自己篡改誓约是为了永远控制族群，但真正的月井并无独立恶意：它重复执行“被迫说出的誓言”，把恐惧当作授权。你向被困意识宣读自由撤回，井中枷锁逐一断开。

```text
DORIAN: “Without the oath, they’ll tear each other apart.”
YOU (choice line): “Then let them make a better promise.”
KAEL: “I’ll answer for my pack without ruling her life.”
ROWAN: “I’ll answer for what I did without being owned by it.”
LUCIEN: “And I’ll live without pretending I know what comes next.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

玩家选择新制度：自由族群/改革议会/永久封井，各有不同代价：秩序调整、人手与时间、失去便捷月术。不能在一个分支同时实现互相矛盾的政策。

```text
MARA: “Your aunt didn’t leave you a throne. She left you a door.”
```

**跨章分支读取与不可偷渡的后果：**根据CH18预设可更换政策；若CH21证据齐，Dorian依法拘押；证据不足时仍可终止誓约，Dorian另走调查程序，避免逻辑跳跃。

**本章独立悬念镜头：**月井熄灭那刻，你手上的月印消失。三位男主却第一次仍然能叫出你的真名——没有神谕，也没有契约。

**小游戏（仅策划，程序外包）：**互动：选择政策→逐字确认“没有人有权替他人同意”；完成后显示世界状态不可逆变更。

**背景/音乐/音效/环境/动画：**BG46月井光柱→BG50曙光庭院；BGM08骤停2s→BGM10渐入，SFX铁链碎裂、风声舒缓、鸦鸣。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH26_EXT_DONE`，并与原本 `CHOICE_26` 结果合并，不覆盖原本选择。


### CH26_V3｜新增逐场可播放演出与独立分支

**V3新增：你将三枚狼印还给本人（26B前）** `[BG46; BGM08→09分层渐变; FX银色法阵由收缩变向外扩散; SFX锁链断裂三声]`
法阵要求你把掌心放上石台，你却发现真正的破解方式是让每一位狼印持有人自愿放弃对你的支配权。Kael抬头：**“My power was never yours to carry.”** Rowan把流亡印投入月井：**“No more running for people who never chose the chase.”** Lucien将预言印压碎：**“Let the future belong to the living.”** 你需要选择制度结局：重建自由族群、封井休养、或建立议会监督的开放制度。所有选项皆可通关，但CH30世界画面和NPC职务不同。
**游戏：**三印定向连线，提示与每人独立目标一致；失败时NPC口头提示并可重试/跳过。**后果：**`WORLD.POLICY_FINAL`只在这里提交；不自动选择任何恋爱对象。

**CHOICE 26｜情绪释放与优先陪伴，不是最终恋爱选择**
- **A 让Kael陪你在石阶坐下：**“Can you stay?” → **KAEL:** “Until you want to be alone.” `kael.attraction+8; FLAG_AFTER_K=1`；CH27开启私人告白。
- **B 先去找Rowan确认Iris安全：**“Let's make sure everyone's home.” → **ROWAN:** “That's exactly where I wanted to go.” `rowan.attraction+8; FLAG_AFTER_R=1`；CH28额外拥抱选项。
- **C 请Lucien陪你看月亮恢复：**“Stay until the moon comes back.” → **LUCIEN:** “For this one, I don't need a prophecy.” `lucien.attraction+8; FLAG_AFTER_L=1`；CH29回响。

**互动：**“许下新誓”允许选择政策后的自由文本签名；此文字写入世界状态。**章末：**一轮真实的满月重新升起，但三位男主的狼印消失了——他们第一次不再受旧誓约驱使。


## CH27｜首领终于可以只做一个男人 / No Crown, Just Me

**场景27A｜BG47日出山脊** `[BGM02柔和变奏; WX_WIND_L; 日出透雾]`

Kael带你看修复后的山谷，告诉你新议会正在选举首领。他可以参选，也可以不参选，第一次不需要通过婚姻巩固权力。

**KAEL:** “When I met you, I thought protecting people meant never needing anyone.”

**KAEL:** “You taught me that asking for help can be the bravest thing in the room.”

**场景27B｜BG27琴房** `[BGM07钢琴; 午后阳光]`

Kael弹完亡母教他的曲子。[若`FLAG_PIANO_K`，他感谢你当时让他弹完；若`FLAG_K_KISS`，提及雨夜亲吻是“something you chose”；否则不编造亲吻记忆。]

**KAEL:** “I don't need you beside me to prove I'm a leader.”

**KAEL:** “But if you'd like to sit beside me when I'm just Kael, I'd be very happy.”

**场景27C｜BG47山脊两人特写** `[BGM09; EMO_HEART在玩家确认后]`

Kael正式表达喜欢，但无论玩家选择谁，都尊重其独立决定。

**KAEL:** “I love who you are when nobody's watching. The brave parts. The impatient parts. Even the parts that don't need me.”


### CH27_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**Kael结局不是地位奖励，是从“公开保护”到“平等日常”的升级。

**新增场景 EXT_A｜情绪冲突与可见代价**

早晨Kael穿简单毛衣，手上有搬木头磨出的伤口。他问你想不想一起修庄园屋顶；过去被整个狼群服侍的男人，正在学着做平常事。

```text
KAEL: “I used to know exactly who I was when everyone bowed.”
KAEL: “Now I’m learning who I am when you ask me to take out the trash.”
YOU (optional): “And?”
KAEL: “Ridiculously happy.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

如果玩家对Kael有明确浪漫意愿，他主动提出一次正式约会而不是求婚；如果朋友路线，他认真询问你对新议会的建议。

```text
KAEL: “I won’t ask you to make forever feel small. How about Friday?”
```

**跨章分支读取与不可偷渡的后果：**只有CH16玩家主动亲吻才可回忆雨夜吻；否则引用Kael在雨中扔掉徽章；拒绝同住不会降信任。

**本章独立悬念镜头：**一封旧族长来信：改革议会邀请Kael返回，他把信交给你看，却不让你替他决定。

**小游戏（仅策划，程序外包）：**互动：和Kael修屋顶选择木料/桌布色，留下共同生活细节MEM_K_HOME。

**背景/音乐/音效/环境/动画：**BG47日出山脊→BG07壁炉客厅；BGM07+10，SFX木工敲击、鸟鸣，EMO_HEART仅应允亲密。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH27_EXT_DONE`，并与原本 `CHOICE_27` 结果合并，不覆盖原本选择。


### CH27_V3｜新增逐场可播放演出与独立分支

**V3新增：没有王冠的早餐（27B后）** `[BG47→BG27; BGM07慢钢琴; WX晨光; SFX水壶哨音]`
Kael在没有卫队的早餐桌上做糊了吐司。他坦白没做过如此普通的事。**KAEL:** “I knew how to keep a thousand people alive. Somehow I still burn breakfast for two.” 你可逗他、为他重新烤、或只聊改革进展。若玩家明确走恋爱线，他问：**“Can I kiss you now?”** 玩家选择“可以”“先拥抱”“以后再说”；不同亲密事实分别保存。若是朋友，Kael仍邀你一起检查新庇护所。
**回响：**`K_READY`取决于持续信任与玩家明确意向，不因早期未跳舞而失败。CH30随你选择读取早餐记忆。

**CHOICE 27｜Kael路线确认意向**
- **A 回应Kael的感情：**“I want to see what we could become.” → **KAEL:** “Then we'll find out together. One day at a time.” `kael.commitment+30; FLAG_K_READY=1`；CH30可选Kael结局。
- **B 只做朋友：**“You matter to me. Just not in that way.” → **KAEL:** “Thank you for trusting me with the truth.” `FLAG_K_FRIEND=1; kael.trust+8`；CH30不显示恋爱锁定Kael，只显示友谊后日谈。
- **C 还没准备好：**“I need more time.” → **KAEL:** “You have it. And my respect doesn't have an expiration date.” `FLAG_K_WAIT=1; agency+6`；CH30可继续或暂缓。

**互动：**“弹奏三音动机”，点三次琴键完成你们共同记忆（跳过无损）。**章末：**Kael收到新议会的邀请，首次邀请你不是以“未来伴侣”身份，而是作为独立顾问。


## CH28｜流亡者把远方留给了你 / Wherever We Go

**场景28A｜BG48雨后公路** `[BGM03转暖; 路面水珠反光; WX_WIND_L]`

Rowan修好机车，告诉你他可以离开山谷，但第一次觉得回家和上路都不是惩罚。

**ROWAN:** “I used to dream about getting out. Now I dream about having somewhere I can come back to.”

[若`FLAG_ROAD_DREAM`或`FLAG_DRIVING`，他提起你们曾画的道路/驾驶练习；否则只展示新车。]

**场景28B｜BG43归乡集市** `[BGM07; 人群温暖]`

Iris把Rowan的旧追踪牌改造成一枚钥匙扣，提醒他哥哥身份不必等于永远牺牲。

**IRIS:** “You kept me alive. Now try living too.”

**ROWAN:** “Bossy.” **IRIS:** “Learned from you.”

**场景28C｜BG48公路边护栏** `[BGM09; 雨后破晓; 心动光只在A下]`

Rowan靠在机车旁，不再藏在玩笑背后。

**ROWAN:** “I'm in love with you. I tried to make it sound like a joke because I was afraid you'd hear how serious I was.”

**ROWAN:** “You can tell me no. I'll still mean every good thing I said.”


### CH28_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**Rowan结局让危险男人拥有“能留下来”的成长，并尊重用户选择。

**新增场景 EXT_A｜情绪冲突与可见代价**

Rowan在公路边把机车钥匙放到你掌心，另一只手拿着Iris写来的晚餐邀请。他第一次同时拥有旅行和家，不必通过逃跑证明自由。

```text
ROWAN: “I spent years keeping the engine running because stopping meant being caught.”
ROWAN: “Now I think I could stop somewhere. If it’s a place we both choose.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

若玩家已原谅他的过去，他可请求牵手；若未原谅，他明确承认仍欠你一个解释，并先帮你修车而不是求恋爱。

```text
ROWAN: “I’m not asking you to forget what I did. I’m asking for the chance to be better where you can actually see it.”
```

**跨章分支读取与不可偷渡的后果：**CH14拒绝原谅后不提供恋爱终局直到修复节点成功；友谊线可选共同公路工作，不自动同居。

**本章独立悬念镜头：**公路尽头信号灯亮起，失踪已久的边境狼群发来和平协商邀请。

**小游戏（仅策划，程序外包）：**互动：选下一站（海岸/山脉/回家），影响后日谈地点和明信片。

**背景/音乐/音效/环境/动画：**BG48破晓公路→BG43市场；BGM03轻快版→BGM10；SFX发动机空转、路面风。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH28_EXT_DONE`，并与原本 `CHOICE_28` 结果合并，不覆盖原本选择。


### CH28_V3｜新增逐场可播放演出与独立分支

**V3新增：他不是为了你放弃远方（28B后）** `[BG48; BGM03木吉他变奏; WX风吹路边野草; SFX机车点火又熄火]`
Rowan将去北方调查剩余流亡者。他不把自己留在山谷当成表忠心。**ROWAN:** “I want the road. I want the truth. And I want you, if you want me back.” 玩家可以提议同行、约定各自独立生活定期见面、或作为好友支持他的工作。若CH14仍未修复，不显示“跟我走吧宝贝”的情侣选项；改为他先提出公开向受害家庭说明当年的错误。
**回响：**`R_READY`必须满足修复条件与玩家当前恋爱同意；`MEM_ROAD_DEST`在CH30真实调用，绝不默认同居。

**CHOICE 28｜Rowan路线确认意向**
- **A 选择和Rowan共同探索未来：**“Then let's see where the road goes.” → **ROWAN:** “With you? I'd take the long way.” `rowan.commitment+30; FLAG_R_READY=1`；CH30可选Rowan结局。
- **B 只做朋友：**“I want you in my life, but not as my partner.” → **ROWAN:** “I can live with truth. It's lies I can't stand.” `FLAG_R_FRIEND=1; rowan.trust+8`；CH30友谊后日谈。
- **C 请他先独自走一次：**“Find out who you are beyond this valley.” → **ROWAN:** “I think I need that. Thank you for not making it a goodbye.” `FLAG_R_TRAVEL=1; agency+7`；CH30延迟关系或独立路线。

**互动：**“绘制下一站”，选择海岸/山林/回家集市，记录`MEM_ROAD_DEST`。**章末：**Rowan把头盔递给你，问：“Want to choose the next stop?”


## CH29｜预言者第一次说“我不知道” / A Future We Can Make

**场景29A｜BG49春夜月池** `[BGM04; WX_MOON; 新花缓慢开放]`

月井恢复自然循环后，Lucien失去了预知他人命运的能力，却仍能感受月亮与植物的变化。他正在学习照顾一株新苗。

**LUCIEN:** “I don't know what comes next.”

**LUCIEN（笑）:** “I thought I'd miss knowing everything. Mostly, I like being surprised.”

**场景29B｜BG44观星台** `[BGM09; 星空慢移; EMO_SILENCE仅轻触]`

Lucien为你保留一页空白星图：不是写你的命运，而是供你们记录共同经过的夜晚。

**LUCIEN:** “I spent my life studying the distance between stars.”

**LUCIEN:** “I never understood closeness until you let me stand beside you without an answer.”

**场景29C｜BG49月池近景** `[BGM04→09; EMO_HEART在A下]`

Lucien缓慢、明确地说出喜欢。

**LUCIEN:** “I love you. Not because I saw it written. Because I've watched you choose kindness when nobody could make you.”

**LUCIEN:** “And if you don't feel the same, the truth of that won't make my love a debt you owe.”


### CH29_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**Lucien结局让预言者接受“未知”，主动提供日常温柔。

**新增场景 EXT_A｜情绪冲突与可见代价**

Lucien拿出手账，逐页给你看他失去能力后自己记录的快乐：烤坏的饼干、听错的歌、那晚你笑了很久。玩家可纠正他记错的细节。

```text
LUCIEN: “I used to offer people certainty.”
LUCIEN: “I can offer you honesty now. And a spectacularly bad cake.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

若CH20帮他重建记忆，他会提及玩家的原话；否则他感谢你没有逼他恢复。所有路线都明确他已经失去预言，不能在结局突然“看见未来”。

```text
LUCIEN: “I don’t know if we’ll be perfect.”
YOU (optional): “Good.”
LUCIEN: “Then let’s be real.”
```

**跨章分支读取与不可偷渡的后果：**朋友路线一同建立预言者儿童保护学校；恋爱路线得到一次约会请求；独立结局仍可作为盟友。

**本章独立悬念镜头：**月池长出第一朵不在任何预言记载里的新花。

**小游戏（仅策划，程序外包）：**互动：选三种未来愿望并命名第一朵花，写入WORLD_FLOWER。

**背景/音乐/音效/环境/动画：**BG49月池→BG44观星台；BGM04钢琴→10柔和，SFX湖面涟漪、夜虫。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH29_EXT_DONE`，并与原本 `CHOICE_29` 结果合并，不覆盖原本选择。


### CH29_V3｜新增逐场可播放演出与独立分支

**V3新增：他写下一句不确定的话（29B后）** `[BG44→BG49; BGM09原声钢琴; FX缓慢流星一颗; SFX翻纸]`
Lucien在笔记本上写下“Tomorrow: unknown”。他从前害怕未知，现在主动邀请你参加天文台儿童课程。**LUCIEN:** “I cannot promise tomorrow will be easy. I can promise not to write your answer before you speak.” 如果玩家主动想恋爱，他会直接表达：**“I love the person you keep choosing to become. Would you like to see where that takes us?”** 若玩家只做朋友，他说：**“Then I would be lucky to know you that way.”**
**回响：**`L_READY`以同意和信任判断；`FLAG_L_SCHOOL`影响后日谈；不允许突然恢复预言超能力。

**CHOICE 29｜Lucien路线确认意向**
- **A 愿意与Lucien一起创造新未来：**“Then let's make a future neither of us can predict.” → **LUCIEN:** “I would love that.” `lucien.commitment+30; FLAG_L_READY=1`；CH30可选Lucien结局。
- **B 只做朋友：**“You helped me see myself. I want to stay friends.” → **LUCIEN:** “I'd be honored to be one.” `FLAG_L_FRIEND=1; lucien.trust+8`；CH30友谊后日谈。
- **C 先独自探索新世界：**“I want a season that belongs only to me.” → **LUCIEN:** “Then take it. I'll keep the stars company.” `FLAG_L_WAIT=1; agency+7`；CH30独立路线可选。

**互动：**“星图共绘”，点亮你希望未来具有的三种价值：Freedom / Trust / Wonder；写入`MEM_FUTURE_VALUES`。**章末：**新月来临，庄园庭院里三枚狼印一夜间开出三朵不同颜色的花。


## CH30｜这一次，月亮由你命名 / The Choice Is Yours

**场景30A｜BG50重建庄园** `[BGM10; 春日暖光; 风吹树叶; 所有主角可见但留出自由空间]`

庄园重新开放。Iris负责新族群的开放档案馆，Evelyn推动法律修订，Mara把姨母的旧书房改成可供任何族人避难的空间。三名男主不再被狼印绑定，玩家也不再是“族群的答案”。

**MARA:** “Your aunt used to say a house is only a home when the doors work both ways.”

**KAEL:** “You gave us a chance to choose better.”

**ROWAN:** “And somehow the place still has terrible coffee.”

**LUCIEN:** “I find that reassuring. Not everything needs to become magical.”

**场景30B｜BG50院中三岔路** `[BGM09; 镜头不推角色面部，给用户决定空间]`

三个男人分别在庭院不同位置等待：Kael在花树下，Rowan在机车旁，Lucien在温室门口。没人争先抢话，也没人拿过去的救命行为索取感情。屏幕出现“Who do you want beside you?”，同时提供“Choose yourself / Keep exploring”。


### CH30_EXT｜强化戏剧高潮与情绪反馈（必须实际演出）

**本章情绪目标：**最终不是“爽完结束”，而是开新生活，且兑现先前选项。

**新增场景 EXT_A｜情绪冲突与可见代价**

庭院庆典上，三人没有站成排列式男友选择菜单，而是各自正在做自己的事：Kael修园艺平台、Rowan帮Iris卸货、Lucien给孩子讲没有预言的星座故事。玩家主动去找其中一人，或去看自己的新庇护所。

```text
KAEL (if chosen): “I don’t need a throne to make room for you.”
ROWAN (if chosen): “No chasing. Just choosing the same road again tomorrow.”
LUCIEN (if chosen): “For once, the future gets to surprise us.”
MARA (independent): “Look at what you built when nobody got to choose for you.”
```

**新增场景 EXT_B｜人物专属情感回报与第二层线索**

每条结局播放自身专属两场（公开/私密），对未被选择者给尊重而真实的关系收束；对于多方探索路线，逐个获得明确同意才开始协商，绝不默认成立三人恋爱。

```text
ENDING MORE / ALL FRIENDS: “You don’t owe the moon an answer. And you don’t owe the world a romance.”
```

**跨章分支读取与不可偷渡的后果：**依据CH24自我留言，结尾显示玩家曾写给自己的未来句子；未填写则默认“自由”。CH02对规则的改变应在墙上留痕。

**本章独立悬念镜头：**结局后收到第一条真正不同的主动消息，并能进入12周持续事件池。

**小游戏（仅策划，程序外包）：**互动：选择关系→确认边界→给新月命名；失败概念不适用。

**背景/音乐/音效/环境/动画：**BG50庭院→BG47/48/49/50路线；BGM09→10，SFX春风铃，EMO_HEART只在双方确认后。

**角色演出通用约束：**只有玩家选择主动靠近且角色明确回应时才播放心跳暖光、靠近镜头和接触动画；否则用眼神停顿、衣物运动、光线变化表现吸引。此场景所有状态修改必须写入日志 `CH30_EXT_DONE`，并与原本 `CHOICE_30` 结果合并，不覆盖原本选择。


### CH30_V3｜新增逐场可播放演出与独立分支

**V3新增：可实际播放的结尾回收（30B后，CHOICE30之前）** `[BG50; BGM10只留钢琴; FX春季花瓣少量; SFX庭院风铃]`
你走进新建的庇护所，墙上刻着CH02你争取的平等通行规则；若没有公开发声，则刻着Tessa与村民后来通过的版本。Iris的药剂室开门、Mara修好姨母的旧书房、Evelyn推行公开档案。你可以点开《给未来自己的话》，回听CH24亲自写下的文字。Kael、Rowan、Lucien分别在工作，不以待选商品的姿态站成一排。恋爱选择由玩家主动向其中一人走近，或前往自己主持的开放议会。
**结局验证：**选K/R/L时先播放专属对话与亲密确认，再播放正式结局；选N/MORE保留所有事业与友情。每条后日谈均要显示`WORLD.POLICY_FINAL`影响：自由族群→公开自选领导；封井→修复生态；监督制→独立审计会议。**第一周事件：**来自所选对象/朋友的主动消息＋一次公共任务，不把结局变成静态终止画面。

**CHOICE 30｜真正有效的最终关系选择，必须与前章态度兼容**
- **K 选择Kael（需`FLAG_K_READY`且没有`FLAG_K_FRIEND`）：**“Kael. I want a life with you.” → 加载`ENDING_K`。若未满足条件，仅提供“继续了解Kael”，不直接订婚或强制恋爱。
- **R 选择Rowan（需`FLAG_R_READY`且没有`FLAG_R_FRIEND`）：**“Rowan. Let's go find our next story.” → 加载`ENDING_R`。
- **L 选择Lucien（需`FLAG_L_READY`且没有`FLAG_L_FRIEND`）：**“Lucien. I choose the future we make.” → 加载`ENDING_L`。
- **N 选择自己/暂不确定（始终可用）：**“I choose my own life first.” → 加载`ENDING_N`。
- **MORE 继续相处，不急着决定（始终可用）：**“I'm not done learning who we are.” → 加载`ENDING_MORE`，开放世界开始，保留当前未定关系。

**场景30C｜具体结局按所选路线独立播放** `[BG47/48/49/50；BGM10；天气遵循结局时段]`

**ENDING_K（BG47｜日出山脊）：**Kael没有把首领戒送你，反而拿出一把庄园旁小屋的新钥匙，问你愿不愿一起为这栋房子选窗帘。**KAEL:** “No throne. No prophecy. Just mornings, arguments about paint colors, and me learning how you take your coffee.” **YOU（可接受/暂缓共同居住）**。如果玩家暂缓，他答：“Then we'll start with breakfast.” 开启`WORLD_K_HOME`，每周有家庭、议会、磨合与支持事件。

**ENDING_R（BG48｜黎明公路）：**Rowan递给你一张空白地图而不是单程票。**ROWAN:** “No chasing. No running. We pick a road because we want to see what's at the end.” **YOU**选择第一站，若`MEM_ROAD_DEST`存在则提及。Iris留言：“Bring him back for dinner.” 开启`WORLD_R_ROAD`，旅途与归乡并存。

**ENDING_L（BG49｜春夜月池）：**Lucien将曾用于写预言的本子改成你们的共同手账。**LUCIEN:** “Here's my first prediction in years: we'll disagree about which flowers to plant.” **YOU**可挑选花。**LUCIEN:** “Wonderful. A future that gets to surprise us.” 开启`WORLD_L_SKY`，共同创作、天象观察与信任事件。

**ENDING_N（BG50｜庄园庭院）：**你将姨母的庄园变成不分狼族与人类的自由庇护所。三人各自拥有独立生活与友情，不给玩家设置“孤独失败结局”。**MARA:** “Look at all the people who can finally come home.” 开启`WORLD_N_FOUNDATION`，友谊、事业、世界治理与未来可选恋爱。

**ENDING_MORE（BG50｜黄昏庭院）：**三人各自发来不同邀请，玩家可自由答应或拒绝；彼此尊重边界，不默认已构成多方恋爱。**LUCIEN:** “No deadline?” **YOU:** “No deadline.” 开启`WORLD_OPEN`, 后续关系仍可改变。

**互动：**“命名新月”输入一个给新纪元的名字（可跳过默认`First Free Moon`），存储`WORLD.moon_name`；结局后登录页展示用户真实选过的名称。**章末：**不是悬而未决黑屏，而是按路线展示可继续生活的开放世界主页，第一条消息来自所选对象或Mara。

---


# E. 30章之后的长期陪伴与开放世界

**目标不是结束在告白，而是把“选择之后如何一起生活”做成第二种游戏。**每条路线配置12周可持续事件池，人物有主动联系但不得无限骚扰。玩家可在设置中管理消息频率、亲密界限和称呼。

| 路线 | 日常关系奖励 | 持续冲突（可修复） | 持续世界线 |
|---|---|---|---|
| Kael | 一起做早餐、首领放下工作陪伴、公开但不替玩家发声 | 职业压力与私人时间冲突 | 新议会改革、族人教育、灾害预案 |
| Rowan | 夜间公路旅行、维修机车、和Iris的家庭晚餐 | 自主旅行与稳定关系如何兼得 | 清理旧卫队残部、建立边境邮路 |
| Lucien | 共同养花、星图、失去预知后的第一次惊喜 | 过度担心失去与学习活在当下 | 月池恢复、年轻预言者保护 |
| Independent | 庄园庇护所、与三人友谊、自己的事业 | 他人再度试图安排玩家人生 | 人狼共治、庄园开放日、外交 |
| Open | 不承诺排他、由玩家逐一协商各人边界 | 嫉妒与沟通，不能替任何人同意 | 三族群合作修复新世界 |

### 事件触发标准（样例）

- `KAEL_BREAKFAST`：ENDING_K且距上次互动≥18小时，可触发一个主动消息：“I burned the toast. Again. Is breakfast still a date if the kitchen loses?” 玩家可以调侃、指导或约改日。
- `ROWAN_ROAD`：ENDING_R且完成两次互信事件：“Found a road you haven't seen. Want the long way home?”
- `LUCIEN_MOON`：ENDING_L且月池新花成长：“It bloomed. You were right about the sunlight.”
- `MARA_OPEN_DAY`：ENDING_N/更多路线满足庇护所修复度≥30时出现开放日新支线。
- `BOUNDARY_REPAIR`：玩家连续拒绝某类亲密后，角色先调整互动，不再重复请求；如玩家主动改偏好才重新开放相应选项。

### 玩家自由输入的实际边界

1. `FREE_CHAT`：每章关键场景收尾后可打开，角色可谈当章事实、感受、回忆和未来计划；不得自行宣布未发生的亲吻、留宿、婚约或死亡。
2. `INTENT`：识别交流/调情/调查/拒绝/离开/请求帮助。非预设输入要给**真实角色回应**，再引导到同章节恰当锚点，不使用“好的我们继续”糊弄玩家。
3. `CONSENT`：玩家拒绝触摸则停用亲密FX；默认同意不能从好感数值推断。所有情绪特效依玩家当下行为触发。
4. `MEMORY`：记录玩家自主选择的昵称、共同照片、重要承诺、界限及主动提出的未来目标，禁止无故改写。
5. `SCENE_REENTRY`：重进章节读取`FLAGS`与`REL`，替换条件台词和场景，不从未选择的分支偷渡剧情。

# F. 全文连续性核对规则

- CH01不强制任一男主和玩家已认识；Kael通过姨母提前获知昵称，Rowan通过姨母任务知晓来者，Lucien从星图知道“有人会来”而非读心。要避免“刚见面就爱到生死”的突兀表现。
- CH03查到的被改誓文必须在CH15、CH21、CH26得到回收；Dorian是旧控制器操纵者，不额外凭空增加幕后黑手。
- CH06 Kael承认曾签错封锁令并在CH07/13/21用行动纠正；不能用玩家一个拥抱直接洗白。
- CH14 Rowan承认曾被迫监视姨母；拒绝原谅并不会关闭他帮助世界主线的权限。
- CH15预测镜子是否打碎影响CH21可用证据，但证据链有其他合法来源，不制造死局。
- CH16若未选亲吻则永久不得出现“雨夜吻过”的固定回忆；CH27必须检查`FLAG_K_KISS`。
- CH18的世界政策可在CH24重新选择一次；CH26只播放一种政策路线。
- CH27/28/29三位男主分别示爱，用户选择朋友或暂缓后，CH30必须尊重，不以好感数值自动恢复恋爱路线。
- CH30若所有人都是朋友仍可进入独立或开放探索路线，并不是坏结局。
- 多人关系如未来开放，需要各参与方分别明确、自主同意，不以“喜欢玩家”自动推定愿意非排他关系。

# G. 全章小游戏与交互落点（仅描述制作，不开发游戏）

| 章 | 互动玩法 | 触发点 | 类型 | 失败/跳过后的规则 |
|---|---|---|---|---|
| 01 | 镜中狼影 | 01C镜子亮起 | 观察点按 | Mara提供线索 |
| 02 | 夜铃花节奏 | 02C花发光 | 顺序轻触 | 月纹轻提示 |
| 03 | 老照片拼接 | 03B铁盒 | 拖拽拼图 | Rowan直接指出边角 |
| 04 | 狼印脚印识别 | 04B银箭后 | 观察判断 | 得到较少线索但可继续 |
| 05 | 暴风雨呼吸 | 05C门廊 | 节奏轻触 | 无负面影响 |
| 06 | 档案错页 | 06B书页 | 证据比对 | Lucien协助 |
| 07 | 证词排序 | 07A后 | 拖拽排序 | Iris引导 |
| 08 | 身体边界互动 | 08A拥抱时 | 触摸/拒绝 | 不亲密也可推进 |
| 09 | 三印连线 | 09A石阵 | 光路联线 | 提示重试 |
| 10 | 修机车 | 10B车库 | 道具选择 | Rowan完成 |
| 11 | 舞步/折纸/找照片 | 11A/11B/11C | 分支专属 | 只给不同记忆 |
| 12 | 星图配对 | 12A穹顶 | 连接星点 | 撤离计划照常 |
| 13 | 公告修订 | 13A展示后 | 选措辞 | Iris拥有最终决定权 |
| 14 | 旧路复盘 | 14A塔上 | 地图标点 | 不泄露私人住所 |
| 15 | 预言镜面 | 15A镜面 | 找自由未来 | Lucien口头补充 |
| 16 | 雨幕选择 | 16C玻璃 | 擦除文字 | 可直接按钮选择 |
| 17 | 断链顺序 | 17C控制门 | 轻触排序 | 进入备用流程 |
| 18 | 地图战术 | 18A会议 | 拖动地图 | 角色协助 |
| 19 | 证据墙 | 19B记录 | 连接证据 | Evelyn核验 |
| 20 | 收容区照顾 | 20B | 资源优先级 | 不影响生命安全 |
| 21 | 庭审质证 | 21A | 证据顺序 | 依合法材料推进 |
| 22 | 潜入计划 | 22A | 时间选择 | 改变演出不改变真相 |
| 23 | 归乡留言 | 23A | 文本/预设回复 | 可跳过 |
| 24 | 写给自己 | 24C | 自由输入 | 使用默认句 |
| 25 | 月蚀三印 | 25C | 顺序点按 | 可由角色辅助 |
| 26 | 新誓签名 | 26B | 自由输入 | 默认自由条款 |
| 27 | 钢琴记忆 | 27B | 三音点按 | 不影响Kael关系 |
| 28 | 下一站地图 | 28C | 地点选择 | 默认“回家” |
| 29 | 星图共绘 | 29B | 三价值选择 | 默认Freedom |
| 30 | 命名新月 | 30C结局后 | 自由输入 | First Free Moon |

# H. 10秒竖屏开场视频提示词（美国市场）

**中文导演版：**10秒，9:16竖屏，720×1280，24fps，超写实美国成人浪漫奇幻电影质感。玩家第一人称，夜晚暴风雨中的黑松庄园。0–3秒，金棕发Kael在铁门外顶着风雨回头，琥珀色眼睛微微转为狼瞳，说：“I promised your aunt I'd keep you safe.” 3–6秒，黑发Rowan从雨中的树林出现，举起一把刻有银狼的钥匙，不靠近镜头，说：“Then tell her what you really are.” 6–8秒，书房玻璃窗里出现银黑发Lucien的倒影，他轻声：“Neither of them knows what she can do.” 8–10秒，头顶月亮被乌云遮住，三枚发光狼印沿玩家手腕亮起，手机出现清楚的英文短讯：“THE OATH WAS NEVER YOURS.” 一个低沉心跳，骤黑。细致风雨、衣摆、真实皮肤、固定人物脸型；音乐只用原创低弦+心跳。不能出现额外男主、中文文本、王冠、夸张触碰或未经玩家选择的亲吻。

**English generation prompt:** 10-second vertical 9:16 cinematic live-action teaser, 720×1280, 24fps, premium romantic werewolf fantasy, all characters visibly adults aged 25+. First-person POV from the female player arriving at Blackpine Manor during a violent storm. **0–3s:** Kael, an extraordinarily handsome golden-brown-haired alpha in a rain-soaked black coat, turns toward camera as his amber irises briefly glow. “I promised your aunt I'd keep you safe.” **3–6s:** Rowan, striking dark-haired outcast with gray-green eyes, steps out of the rainy treeline, holding up an old silver-wolf key, keeping a respectful distance. “Then tell her what you really are.” **6–8s:** Lucien, elegant silver-black-haired moon oracle, appears as a reflection in the lit library window. “Neither of them knows what she can do.” **8–10s:** Clouds swallow the moon, three pale silver marks glow across the player's wrist, and a clear English phone notification reads: “THE OATH WAS NEVER YOURS.” One low heartbeat; cut to black. Physically convincing rain, wind-reactive hair and clothes, lightning bounce light, intimate expressions, consistent faces, no unnecessary slow motion, original dark strings and soft heartbeat audio, no additional male characters, no crowns, no kiss, no Chinese lettering.

# I. 资源交接与上线验收清单

**本文件真实交付范围：**30章×3场独立剧情演出文本、90条三择主要选项、5种开放结局、人物设定、关系状态与连续性规则、30个互动玩法落点、50张背景的**逐张制作规格**、音乐及天气情绪特效编号、10秒视频提示词、长期陪伴架构。**未声称已经生成**50张高精度真人背景、实际动态立绘、音乐音频、配音、视频成片或引擎可执行节点文件。

**上线仍需制作与验证：**（1）美式英语母语编辑；（2）50张一致性人物合成背景和人物表情/动作素材；（3）全部原创音频与合法授权；（4）分支数据结构落库；（5）90条选项及结局回归测试；（6）自由聊天防止伪造过去事件；（7）9:16多机型字幕布局；（8）天气光敏可访问性测试；（9）图片生成和版本资源清单；（10）成人题材适当内容提示。正式发布前须完成以上事项。

---

**剧本完。**



# J. 逐章镜头/声音/游戏执行排期（供制作经理拆任务）

| 章节 | 主要BG（按出场顺序） | 主BGM | 关键环境特效 | 核心声音点 | 游戏玩法 | 关键剧情转折 |
|---|---|---|---|---|---|---|
| CH01 |  | BGM0 | Kael摘徽章时环境停顿0.4s。 | BG01→BG02→BG03 | 门廊手机震动后给玩家选择“公开拒绝检查 / 私下接受保护 / 要求三人离开”；别做按对成功率的战斗小游戏。 | 门外忽然传来无线电：议会已发令，午夜前将把“继承人”带走。 |
| CH02 |  | BGM0 | 光线从Kael身上移到玩家视角。 | BG04冷金→BG05大风→BG06晨雾 | 交互：让玩家决定在宣读规则时是否按下公开录音（后续证据强度）；不强制擅自录制私密场景。 | 一位长老喊出：“你们忘了二十六年前第一次月蚀究竟死了谁？” |
| CH03 |  | BGM0 | BGM07→06，SFX壁炉爆响/铁盒扣锁，FX_MEMORY颗粒3s。 | BG07壁炉暖光→BG08冷月→BG03书房 | 互动：查阅三处账目异常并手动标记，失败由Mara核对；输出线索而非英雄评分。 | 旧胶片显影：姨母手写的警告不是“别相信Kael”，而是“别相信你看见的那张照片”。 |
| CH04 |  | BGM0 | SFX石片碎裂，拒绝频闪。 | BG09深蓝井面→BG05风林 | 互动：选择对倒影发问/验证时间印记/退出月井；三条都可抵达CH05。 | 井壁出现第四枚印：不是狼印，而是人类的手掌。 |
| CH05 |  | BGM0 | 禁血腥特写。 | BG11训练场→BG12崖风→BG19雨夜医务室 | 互动：选“止血/呼救/先确保路安全”三种协作方式，所有路线都救到人，影响谁记得你的冷静。 | 伤口里取出的银片刻着Kael家族库房编号。 |
| CH06 |  | BGM0 | BGM06低频，SFX胶片滑动、录音机底噪，FX_MEMORY定格划痕。 | BG13档案馆→BG14照片墙 | 互动：三图对比，分别标注时间、人物、印记；触发条件CH06B。 | 一条匿名语音发来：“If she reads the whole file, they’ll kill Iris.” |
| CH07 |  | BGM0 | BGM05→07，SFX静默人群/远处座椅倒退，EMO_SILENCE落槌。 | BG15议会→BG07空厅 | 互动：选择公开证词的三种措辞（承担责任/要求独立审查/拒绝为任何人洗白），各改变群众信任，不改变既有历史。 | 议会当晚撤销Kael对月井守卫的指挥权，Dorian成为临时负责人。 |
| CH08 |  | BGM0 | 可选EMO_HEART，必须有主动靠近。 | BG19医务室→BG17湖边 | 互动：可选择替Lucien保存一条记忆，决定以后他会如何称呼那一晚。 | 书页上出现一行他不记得写过的字：“DON’T TRUST THE SECOND ECLIPSE.” |
| CH09 |  | BGM0 | SFX狼嚎远场、石块移动、微弱心跳。 | BG18满月石阵→BG19医务室 | 互动：石阵三道光路，玩家指挥防守位置（非战斗QTE），失败触发Kael/Rowan救援但保留自主选择。 | 玩家手心的第四印可短暂熄灭追踪灯——你拥有未被任何狼人记录的权力。 |
| CH10 |  | BGM0 | WX_WIND_H。 | BG20机车车库→BG12悬崖→BG21露台 | 互动：路线图选择城市/山路/回庄园，标记玩家偏好并触发不同过场，不制造死路。 | Dorian的全谷广播：“From midnight, the Moonbound is in protective custody.” |
| CH11 |  | BGM0 | BGM04华尔兹原创→突然切静音，SFX玻璃破碎、足音。 | BG22星灯舞池 / BG23篝火 / BG24穹顶（分支）→BG38灯熄门厅 | 互动：舞伴选择+逃生门线索观察；不强制两人争抢玩家的手。 | 面具掉在台阶上——内侧刻着Evelyn办公室的印。 |
| CH12 |  | BGM0 | FX_MOON移位。 | BG24穹顶→BG25月井入口 | 互动：星图拼接，把“假日期”与天象标记对齐；失败会被Lucien手账提示。 | 有人改变天象钟，月蚀提前了三天。 |
| CH13 |  | BGM0 | SFX人群吸气、文件翻页。 | BG26雾晨公开证词→BG16药剂铺→BG27琴房 | 互动：选择公告字句+是否公开受害者身份（默认隐私保护）。 | 完整毒药账目显示Dorian每月购买月井抑制剂，而且使用者名单里竟有Lucien。 |
| CH14 |  | BGM0 | WX_WIND_H，SFX铁栏轻响。 | BG28雪前塔顶→BG21夜露台 | 互动：玩家在地图上标注“危险点/隐藏路/证人藏身处”；不做速度小游戏。 | 地图上标着一条通往月井下方的“第四门”，此前所有卷宗都故意漏掉。 |
| CH15 |  | BGM0 | SFX碎镜、暗门低鸣。 | BG29破镜室→BG30银白议事台 | 互动：镜中寻找重复纹路，识别伪造印；低动态版本静态对比。 | 镜底传来一个活人的声音：失踪证人还被关在月井下方。 |
| CH16 |  | BGM0 | SFX电台失真、雷声8秒内一次。 | BG31玻璃廊桥→BG32雪夜门口 | 互动：选“冒雨冲向灯塔/等待闪电干扰/走维护梯”，均成功但狼群支援延时不同。 | 你们穿过廊桥，广播宣布：“Kael Ashford is stripped of the Alpha title.” |
| CH17 |  | BGM0 | BGM08渐弱至人声残响，SFX铁链松脱/水逆流，EMO_SILENCE。 | BG25月井洞口→BG33雪夜月池 | 互动：断链顺序，不得以失败导致过去受害者永久死亡；失败则提示后重试。 | 你发现姨母不是被月井吞噬，而是曾成功打开第四门，却被Dorian重新封锁。 |
| CH18 |  | BGM0 | BGM03+08低层，SFX地图图钉/远号角，WX_MOON。 | BG34地图室→BG18石阵 | 互动：将角色拖到任务点做策略部署，告知“结果影响资源和营救动画，不决定人物生死”。 | 地图的红点开始移动：Dorian早已把失踪证人转移到月蚀圣坛。 |
| CH19 |  | BGM0 | SFX戒指触桌、回声。 | BG35戒指交出→BG36废教堂 | 互动：证据墙串联签字令、银毒采购和失踪证人；错误最多提示三次。 | 宣布裁定后，Dorian下令在月蚀夜以玩家完成旧誓“最终修复”。 |
| CH20 |  | BGM0 | BGM07与低鼓交错，SFX发电机熄火/孩子轻声感谢，FX_MOON血红渐退。 | BG37红月庇护所→BG38舞会门厅 | 互动：选择资源优先级（医疗/保暖/通讯），可通过团队互助解决，避免真实生命惩罚。 | 获救儿童送来一枚带Dorian印记的假狼印：原来“最后祭品”不是玩家，是被困在月井的全部意识。 |
| CH21 |  | BGM0 | BGM05→08，SFX法槌、玻璃裂，WX_LIGHTNING单次。 | BG39审判厅→BG30议事台 | 互动：庭审质证“哪个时间码不可能”，错误则证人辅助，不锁死。 | 听证还没结束，月井的光柱冲破山谷，审判厅窗户同时裂开。 |
| CH22 |  | BGM0 | SFX纸燃烧、静电/结冰脆响，WX_SNOW。 | BG41神谕树→BG40断桥→BG32雪夜门口 | 互动：选择“修通讯/救被困守卫/赶往第四门”，影响CH25可用辅助资源。 | 雪落到手心时不融化——月井开始将整个山谷冻结。 |
| CH23 |  | BGM1 | BGM10柔和但不终局，SFX市集人声、风铃。 | BG42晴雪集市→BG43日落摊位 | 互动：给归乡者留言，保存玩家选择的祝福作为CH30墙上的文字。 | 失踪证人向你传来最后坐标：月井底部还有一封姨母写给你的信。 |
| CH24 |  | BGM0 | SFX长风与远钟，无心跳强推。 | BG44观星台→BG49月池 | 互动：给自己的未来写一句话（玩家自由输入，字数限60），CH30可回读。 | 天空中出现第二轮不可能的月影——真正的月蚀并非天象，而是月井投射。 |
| CH25 |  | BGM0 | BGM08大鼓到9成→对话时压至20%，SFX链环旋转、月光脉冲，FX_ECLIPSE。 | BG45月蚀圣坛 | 互动：三印解锁+“是否签署”明确拒绝按钮，不做失败即献祭的QTE。 | Dorian强行触发假誓，月井忽然开始吞噬他自己的记忆。 |
| CH26 |  | BGM0 | BGM08骤停2s→BGM10渐入，SFX铁链碎裂、风声舒缓、鸦鸣。 | BG46月井光柱→BG50曙光庭院 | 互动：选择政策→逐字确认“没有人有权替他人同意”；完成后显示世界状态不可逆变更。 | 月井熄灭那刻，你手上的月印消失。三位男主却第一次仍然能叫出你的真名——没有神谕，也没有契约。 |
| CH27 |  | BGM0 | BGM07+10，SFX木工敲击、鸟鸣，EMO_HEART仅应允亲密。 | BG47日出山脊→BG07壁炉客厅 | 互动：和Kael修屋顶选择木料/桌布色，留下共同生活细节MEM_K_HOME。 | 一封旧族长来信：改革议会邀请Kael返回，他把信交给你看，却不让你替他决定。 |
| CH28 |  | BGM0 | SFX发动机空转、路面风。 | BG48破晓公路→BG43市场 | 互动：选下一站（海岸/山脉/回家），影响后日谈地点和明信片。 | 公路尽头信号灯亮起，失踪已久的边境狼群发来和平协商邀请。 |
| CH29 |  | BGM0 | BGM04钢琴→10柔和，SFX湖面涟漪、夜虫。 | BG49月池→BG44观星台 | 互动：选三种未来愿望并命名第一朵花，写入WORLD_FLOWER。 | 月池长出第一朵不在任何预言记载里的新花。 |
| CH30 | BG47→BG48→BG49→BG50 | BGM1 | BGM09→10，SFX春风铃，EMO_HEART只在双方确认后。 | BG50庭院→BG47/48/49/50路线 | 互动：选择关系→确认边界→给新月命名；失败概念不适用。 | 结局后收到第一条真正不同的主动消息，并能进入12周持续事件池。 |



# K. 50张背景图：逐张美术外包生成规格与命名规则

**统一要求：**每张9:16竖屏，至少1536×2732主图（开发可缩放裁切至720×1280）；电影级写实、原创面孔、人物成年、与人物角色统一参考图一致；上方65%展示人物与故事行动，底部35%保留对话UI的安全区域；不得生成正文台词、水印、商标或不自然手指。不同天气背景同时输出无特效干净底图 `CLEAN`，雨/雪/月尘作为独立循环透明层 `OVERLAY`，避免外包程序无法独立控制强度。人物与背景优先分层。

**视觉主风格：**高预算美国暗黑浪漫奇幻剧；黑松镇真实山谷建筑、哥特元素克制；Kael琥珀眼金棕发/黑大衣、Rowan灰绿眼黑发/旧皮夹克、Lucien蓝灰眼银黑发/高领；Mara、Iris、Evelyn、Dorian成年人。所有出现的人必须符合故事服装、时间、伤势和状态。

| 素材ID | 场景镜头（人物需入画） | 天气与光源 | 画面执行、活动层与用途 | 导出文件 |
|---|---|---|---|---|
| BG01 | 玩家视角，门口Kael黑大衣迎接 | 暴风雨夜 | 前景透明雨滴层、衣料湿痕、地面高光反射；雷电由程序层触发；发丝/衣摆可独立摆动，远景树枝分层；月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG01_CLEAN.webp` + `BG01_DEPTH.png` + `BG01_OVERLAY.webm` |
| BG02 | Rowan靠在黑松庄园门廊，湿发 | 雷雨夜 | 前景透明雨滴层、衣料湿痕、地面高光反射；雷电由程序层触发；月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG02_CLEAN.webp` + `BG02_DEPTH.png` + `BG02_OVERLAY.webm` |
| BG03 | Lucien立于挂满月图的书房 | 烛光夜 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG03_CLEAN.webp` + `BG03_DEPTH.png` + `BG03_OVERLAY.webm` |
| BG04 | Kael与狼群成员立于议会厅 | 冷金晨光 | 细微呼吸、眼神、光照循环；人物动作需独立输出；角色位置不遮字幕 | `BG04_CLEAN.webp` + `BG04_DEPTH.png` + `BG04_OVERLAY.webm` |
| BG05 | Rowan与玩家前景手部、身后森林 | 大风黄昏 | 发丝/衣摆可独立摆动，远景树枝分层；角色位置不遮字幕 | `BG05_CLEAN.webp` + `BG05_DEPTH.png` + `BG05_OVERLAY.webm` |
| BG06 | Lucien在银月温室中 | 清晨薄雾 | 雾/雪双层景深视差循环，保持对白可读；角色位置不遮字幕 | `BG06_CLEAN.webp` + `BG06_DEPTH.png` + `BG06_OVERLAY.webm` |
| BG07 | Kael置身壁炉客厅，袖口挽起 | 雨夜 | 前景透明雨滴层、衣料湿痕、地面高光反射；雷电由程序层触发；月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG07_CLEAN.webp` + `BG07_DEPTH.png` + `BG07_OVERLAY.webm` |
| BG08 | Rowan站在禁林栈桥 | 月夜有雾 | 雾/雪双层景深视差循环，保持对白可读；月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG08_CLEAN.webp` + `BG08_DEPTH.png` + `BG08_OVERLAY.webm` |
| BG09 | Lucien面对发光石井 | 月光 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG09_CLEAN.webp` + `BG09_DEPTH.png` + `BG09_OVERLAY.webm` |
| BG10 | 三男主在餐厅各据一侧，玩家第一视角 | 暖夜 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG10_CLEAN.webp` + `BG10_DEPTH.png` + `BG10_OVERLAY.webm` |
| BG11 | Kael在训练场护住新人 | 晴午 | 细微呼吸、眼神、光照循环；人物动作需独立输出；角色位置不遮字幕 | `BG11_CLEAN.webp` + `BG11_DEPTH.png` + `BG11_OVERLAY.webm` |
| BG12 | Rowan在悬崖边回头伸手 | 狂风暮色 | 发丝/衣摆可独立摆动，远景树枝分层；角色位置不遮字幕 | `BG12_CLEAN.webp` + `BG12_DEPTH.png` + `BG12_OVERLAY.webm` |
| BG13 | Lucien在古旧档案馆扶起落书 | 灯火夜 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG13_CLEAN.webp` + `BG13_DEPTH.png` + `BG13_OVERLAY.webm` |
| BG14 | Mara与玩家面对家族照片墙 | 雨晨 | 前景透明雨滴层、衣料湿痕、地面高光反射；雷电由程序层触发；角色位置不遮字幕 | `BG14_CLEAN.webp` + `BG14_DEPTH.png` + `BG14_OVERLAY.webm` |
| BG15 | Kael出席月议会，旁有监察官 | 月光室内 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG15_CLEAN.webp` + `BG15_DEPTH.png` + `BG15_OVERLAY.webm` |
| BG16 | Rowan与Iris在隐秘药剂铺 | 阴雨午后 | 前景透明雨滴层、衣料湿痕、地面高光反射；雷电由程序层触发；角色位置不遮字幕 | `BG16_CLEAN.webp` + `BG16_DEPTH.png` + `BG16_OVERLAY.webm` |
| BG17 | Lucien半跪湖畔辨认符文 | 蓝雾夜 | 雾/雪双层景深视差循环，保持对白可读；月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG17_CLEAN.webp` + `BG17_DEPTH.png` + `BG17_OVERLAY.webm` |
| BG18 | 三人站在黑松森林环形石阵 | 满月 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG18_CLEAN.webp` + `BG18_DEPTH.png` + `BG18_OVERLAY.webm` |
| BG19 | Kael背靠浴后蒸汽的医务室门框 | 雨夜 | 前景透明雨滴层、衣料湿痕、地面高光反射；雷电由程序层触发；月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG19_CLEAN.webp` + `BG19_DEPTH.png` + `BG19_OVERLAY.webm` |
| BG20 | Rowan在旧车库修机车看玩家 | 午夜暖灯 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG20_CLEAN.webp` + `BG20_DEPTH.png` + `BG20_OVERLAY.webm` |
| BG21 | Lucien置身萤火图书露台 | 夏夜 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG21_CLEAN.webp` + `BG21_DEPTH.png` + `BG21_OVERLAY.webm` |
| BG22 | Kael与玩家在星灯露台跳舞 | 星夜微风 | 发丝/衣摆可独立摆动，远景树枝分层；月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG22_CLEAN.webp` + `BG22_DEPTH.png` + `BG22_OVERLAY.webm` |
| BG23 | Rowan与玩家在河岸篝火旁 | 夜间微风 | 发丝/衣摆可独立摆动，远景树枝分层；月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG23_CLEAN.webp` + `BG23_DEPTH.png` + `BG23_OVERLAY.webm` |
| BG24 | Lucien在玻璃穹顶下持星图 | 流星夜 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG24_CLEAN.webp` + `BG24_DEPTH.png` + `BG24_OVERLAY.webm` |
| BG25 | 三人站在被封锁的月井洞口 | 雷雨夜 | 前景透明雨滴层、衣料湿痕、地面高光反射；雷电由程序层触发；月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG25_CLEAN.webp` + `BG25_DEPTH.png` + `BG25_OVERLAY.webm` |
| BG26 | Iris在人群前展示证据 | 雾晨 | 雾/雪双层景深视差循环，保持对白可读；角色位置不遮字幕 | `BG26_CLEAN.webp` + `BG26_DEPTH.png` + `BG26_OVERLAY.webm` |
| BG27 | Kael在祖宅旧琴房，柔软神情 | 午后斜阳 | 细微呼吸、眼神、光照循环；人物动作需独立输出；角色位置不遮字幕 | `BG27_CLEAN.webp` + `BG27_DEPTH.png` + `BG27_OVERLAY.webm` |
| BG28 | Rowan登上废弃瞭望塔 | 雪前灰天 | 雾/雪双层景深视差循环，保持对白可读；角色位置不遮字幕 | `BG28_CLEAN.webp` + `BG28_DEPTH.png` + `BG28_OVERLAY.webm` |
| BG29 | Lucien倚靠预言室破碎镜面 | 暗蓝夜 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG29_CLEAN.webp` + `BG29_DEPTH.png` + `BG29_OVERLAY.webm` |
| BG30 | Evelyn坐在银白议事台前 | 深夜 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG30_CLEAN.webp` + `BG30_DEPTH.png` + `BG30_OVERLAY.webm` |
| BG31 | Kael与玩家在雨中的玻璃廊桥 | 暴雨闪电 | 前景透明雨滴层、衣料湿痕、地面高光反射；雷电由程序层触发；角色位置不遮字幕 | `BG31_CLEAN.webp` + `BG31_DEPTH.png` + `BG31_OVERLAY.webm` |
| BG32 | Rowan冒雪在门前卸下武器 | 初雪深夜 | 雾/雪双层景深视差循环，保持对白可读；月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG32_CLEAN.webp` + `BG32_DEPTH.png` + `BG32_OVERLAY.webm` |
| BG33 | Lucien在月池旁举起一盏灯 | 雪夜 | 雾/雪双层景深视差循环，保持对白可读；月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG33_CLEAN.webp` + `BG33_DEPTH.png` + `BG33_OVERLAY.webm` |
| BG34 | 三男主在庄园地图室面对危机 | 烛光夜 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG34_CLEAN.webp` + `BG34_DEPTH.png` + `BG34_OVERLAY.webm` |
| BG35 | Kael在人群前递上首领戒 | 月食前夕 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG35_CLEAN.webp` + `BG35_DEPTH.png` + `BG35_OVERLAY.webm` |
| BG36 | Rowan在废教堂交出真实档案 | 阴云晚霞 | 细微呼吸、眼神、光照循环；人物动作需独立输出；角色位置不遮字幕 | `BG36_CLEAN.webp` + `BG36_DEPTH.png` + `BG36_OVERLAY.webm` |
| BG37 | Lucien于红月下保护孩童 | 红月夜 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG37_CLEAN.webp` + `BG37_DEPTH.png` + `BG37_OVERLAY.webm` |
| BG38 | 三人在冬季舞会门口等玩家 | 室内金灯/室外雪 | 雾/雪双层景深视差循环，保持对白可读；角色位置不遮字幕 | `BG38_CLEAN.webp` + `BG38_DEPTH.png` + `BG38_OVERLAY.webm` |
| BG39 | Kael在公开审判中央独自站立 | 冷白上午 | 细微呼吸、眼神、光照循环；人物动作需独立输出；角色位置不遮字幕 | `BG39_CLEAN.webp` + `BG39_DEPTH.png` + `BG39_OVERLAY.webm` |
| BG40 | Rowan在断桥上与玩家并肩 | 旋风夜 | 发丝/衣摆可独立摆动，远景树枝分层；月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG40_CLEAN.webp` + `BG40_DEPTH.png` + `BG40_OVERLAY.webm` |
| BG41 | Lucien在神谕树下撕毁预言卷轴 | 月夜 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG41_CLEAN.webp` + `BG41_DEPTH.png` + `BG41_OVERLAY.webm` |
| BG42 | Kael与族人种树、玩家前景 | 雪后晴天 | 雾/雪双层景深视差循环，保持对白可读；角色位置不遮字幕 | `BG42_CLEAN.webp` + `BG42_DEPTH.png` + `BG42_OVERLAY.webm` |
| BG43 | Rowan与Iris在归乡集市摊前 | 夕阳 | 细微呼吸、眼神、光照循环；人物动作需独立输出；角色位置不遮字幕 | `BG43_CLEAN.webp` + `BG43_DEPTH.png` + `BG43_OVERLAY.webm` |
| BG44 | Lucien和玩家在空旷观星台 | 星空 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG44_CLEAN.webp` + `BG44_DEPTH.png` + `BG44_OVERLAY.webm` |
| BG45 | 三人于月蚀圣坛不同方位守护玩家 | 月食开始 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG45_CLEAN.webp` + `BG45_DEPTH.png` + `BG45_OVERLAY.webm` |
| BG46 | 狼群、Evelyn、玩家面向月井光柱 | 月食高潮 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG46_CLEAN.webp` + `BG46_DEPTH.png` + `BG46_OVERLAY.webm` |
| BG47 | Kael与玩家在日出山脊相望 | 日出 | 细微呼吸、眼神、光照循环；人物动作需独立输出；角色位置不遮字幕 | `BG47_CLEAN.webp` + `BG47_DEPTH.png` + `BG47_OVERLAY.webm` |
| BG48 | Rowan与玩家在雨停后的公路边 | 破晓 | 细微呼吸、眼神、光照循环；人物动作需独立输出；角色位置不遮字幕 | `BG48_CLEAN.webp` + `BG48_DEPTH.png` + `BG48_OVERLAY.webm` |
| BG49 | Lucien与玩家在生长新花的月池 | 春夜 | 月光轮廓边光、瞳孔反射分层；角色位置不遮字幕 | `BG49_CLEAN.webp` + `BG49_DEPTH.png` + `BG49_OVERLAY.webm` |
| BG50 | 三男主与Mara、Iris站在重建庄园庭院 | 春日晨光 | 细微呼吸、眼神、光照循环；人物动作需独立输出；角色位置不遮字幕 | `BG50_CLEAN.webp` + `BG50_DEPTH.png` + `BG50_OVERLAY.webm` |



# L. 角色动态素材全量动作清单（外包制作要求）

### 通用结构与可访问性
- 每个主角在 **idle呼吸/眨眼、neutral、soft smile、hurt restraint、jealous restrained、vulnerable、determined、wolf-eyes、look-away、reach-out、step-back** 至少11类表情/动作上提供可复用透明序列；眼神表情与语音配套，由玩家点击推进。
- `ANIM_KAEL_...`、`ANIM_ROWAN_...`、`ANIM_LUCIEN_...` 按角色前缀命名，变身主要使用影子与虹膜，不要求模型露骨变形；每个角色另需一组半狼形态的远景轮廓与站位镜头。
- 眨眼周期4–8秒随机扰动；呼吸3–5秒；头发/布料随`WX_WIND`强度变化；近距镜头接触动画必须满足玩家先主动选择。减少动态模式以静态图+淡入淡出替代。
- Kael额外动作：`REMOVE_BADGE`、`PUT_KEY_ON_TABLE`、`SHIELD_ARROW`、`RELEASE_RING`、`COAT_OFFER`、`RAIN_REACH`、`REPAIR_HOUSE`、`COFFEE_SERVE`。
- Rowan额外动作：`KEY_OFFER`、`MOTORBIKE_FIX`、`CHECK_TRACKS`、`SURRENDER_WEAPON`、`TELL_TRUTH`、`HAND_MAP`、`SISTER_HUG`、`ROAD_INVITE`。
- Lucien额外动作：`OPEN_STAR_MAP`、`TOUCH_FLOWER`、`MIRROR_REFLECT`、`TEAR_PROPHECY`、`LOSE_SIGHT`（指失去预知能力，不是失明）、`JOURNAL_WRITE`、`SHARE_LAMP`、`MOON_POOL_FLOWER`。
- 配角Mara、Iris、Evelyn、Dorian至少每人：闲置、说话、惊讶、坚定、转身；Iris需证词展示；Evelyn需举证和判读；Dorian需威胁和狼印控制；Mara需信封与录音机交付。

# M. 原创音乐、音效与混音触发技术说明

| 音源ID | 内容要求 | 时长与循环 | 触发/离场 |
|---|---|---|---|
| BGM01 | 黑松入场：低大提琴、少量钢琴、隔绝感 | 45–80s 无缝loop | CH01/悬疑探索；冲突来临-10dB |
| BGM02 | Kael：温暖弦乐/低鼓，代表稳固安全感 | 60–90s loop | 公开维护、雨夜平等亲密；拒绝亲密时保留弦乐不放心跳 |
| BGM03 | Rowan：哑鼓/低音吉他/公路节拍 | 60–90s loop | 追踪、车库、断桥；温柔时关闭鼓机只留吉他 |
| BGM04 | Lucien：高音钢琴、玻璃质感合成器 | 60–90s loop | 温室、观星、手账和低声告白 |
| BGM05 | 议会：弦乐持续音、干涩木管 | 50–80s loop | 法令、听证、公开权力争论 |
| BGM06 | 探案：碎拍、琴弦拨奏 | 50–80s loop | 相册、账本、照片证据；正确线索0.4s柔和确认音 |
| BGM07 | 安全港：近距离钢琴、温柔环境氛围 | 60–100s loop | 伤后照顾、友情和日常，不默认恋爱 |
| BGM08 | 月蚀危机：原创铜管/大鼓/脉冲 | 分三段A潜伏、B爆发、C退潮 | CH18–26随危险等级切换；对白时不掩盖语音 |
| BGM09 | 玩家决定：单音钢琴、极小空间混响 | 30–60s loop | 自主选择、边界和终局按钮 |
| BGM10 | 自由黎明：钢琴主题重奏、暖弦乐 | 60–90s loop | CH23/26/30及开放世界日常 |
| SFX_RAIN | 雨滴近景/屋檐/树叶/远雨四层独立音源 | 20–40s无缝loop | WX_RAIN等级独立调混，室内低通滤波 |
| SFX_WIND | 松林风/窗缝风/衣摆摆动三层 | 20–40s loop | `WX_WIND_L/H`双档，强风-3dB保护对白 |
| SFX_THUNDER | 闪电后0.7–2.5s播放雷声，避免固定同步 | 3–8s one-shot | CH01/12/16/21/25，至少12秒重触发间隔 |
| SFX_HEART | 低频双心跳，有轻微呼吸音 | 1.2–2.1s one-shot | 仅`CONSENT_TOUCH=true`且玩家选择靠近时播放 |
| SFX_WOLF | 低声狼嚎远景、短促狼瞳气鸣 | 2–5s one-shot | 狼性揭示/觉醒；严禁无端重复吓人 |
| SFX_GLASS | 预言镜裂/碎片落地/拾起，三轨 | 1–5s one-shot | CH15/21，破碎要有空间混响但不刺耳 |
| SFX_OATH | 古老锁链/逆流水/共振低音三轨 | 3–15s layered | CH17/25/26；随解放进度逐层拆除 |
| SFX_UI | 选项、证据确认、记忆写入、地图标点四种短音 | 0.1–0.6s | 所有游戏；静音设置可关闭 |

### 动画特效时间轴
- `WX_RAIN`: 图层前景雨滴 + 背景雨丝 + 屋檐独立落水 + 人物服饰湿润贴图；进入1.2s淡入、退出1.5s淡出；若下一场室内只保留窗外雨。
- `WX_WIND`: 人物发丝和衣角与树枝一致的风向，0.5–2Hz缓动，支持弱/强两档；室内需要关停。
- `WX_LIGHTNING`: 闪电亮度+20%至+30%，持续0.12–0.25s，雷声延迟0.7–2.5s，至少12s冷却；光敏模式用窗外蓝白渐亮代替突闪。
- `WX_SNOW`: 近/中/远三个雪层速度不一致，人物肩头少量积雪；雪停后积雪仍有延续。
- `EMO_HEART`: 仅明确玩家愿意的亲密选择；背景音乐下压6dB，人物眼神特写+低频双心跳，暖光0.8s，镜头轻微呼吸但无强制接触。
- `EMO_SILENCE`: 角色遭受背叛、失去能力或牺牲决定时，所有音乐及氛围静音0.7–1.5s；然后按新状态淡入。
- `FX_ECLIPSE`: CH25开始，月光10秒从银蓝→偏红→接近黑；CH26解除后缓缓恢复自然月光，记住世界政策导致的后续色调变化。
- `FX_MEMORY`: 旧照片/预言投影采用低颗粒、边缘不稳定的半透明视觉；必须在UI标注其为证据/可能未来，避免被用户误以为已经发生的情节。

**混音基准建议：**对白作为基准0dB，背景音乐比对白平均低18–24dB，必要时duck；单次雷、玻璃、心跳不能超过设备合理峰值；必须支持单独关闭音乐、环境音、语音及动态效果。

# N. 全局状态与分支验收（外包coding不可跳过）

```yaml
WORLD:
  oath_exposed: false
  dorian_caught: false
  well_freed: false
  policy: undecided  # free_packs|reformed_council|seal_well
  public_support: 0
  evidence_strength: 0
REL:
  kael: {trust: 10, attraction: 10, commitment: 0, romance_consent: false}
  rowan: {trust: 10, attraction: 10, commitment: 0, romance_consent: false, apology_resolved: false}
  lucien: {trust: 10, attraction: 10, commitment: 0, romance_consent: false, lost_future_sight: false}
FLAGS:
  CH07_KAEL_CONFESSED: false
  CH14_ROWAN_TRUTH_DISCLOSED: false
  CH16_KAEL_TOUCH: none   # none|hand|hug|kiss
  CH20_LUCIEN_MEMORY_HELP: false
  CH22_LUCIEN_LOST_PREDICTION: false
  CH24_PLAYER_PROMISE: none
  CH26_WELL_FREED: false
  CH30_ENDING: unset
```

**测试用例：**
1. CH01拒绝任何接触→CH16拒绝吻→CH27绝不引用吻；仍能进入独立路线或未来主动约会。
2. CH14不原谅Rowan→CH28出现实际道歉与修复节点→未完成修复不能自动进入恋爱终局。
3. CH20拒绝帮Lucien恢复记忆→CH22他仍可靠自己的手账推进任务，CH29不强行记得那晚原话。
4. CH11拒绝舞伴→CH12不能有“我们共舞”的旧事回忆；两人仍保持吸引与尊重。
5. CH15砸镜、没保留碎片→CH21通过星图、账本与Mara证言仍有证据链。
6. CH24选择自我成长→CH25–26所有角色继续合作，无所谓爱情失败惩罚。
7. CH26三种政策只激活一种，后日谈和持续世界事件读取该政策。
8. CH30选择任一伴侣前，必须读取`romance_consent`及前置个人回访，不能只靠好感分数；友情、独身、继续探索始终可选。
9. 游戏中途跳过/失败时进入低成本替代镜头，不丢失必需线索；80%以上节点可使用按钮直接跳过。
10. 断线重连/重新进入角色聊天，加载最近一次 `STATE_COMMIT`；禁止生成未发生的留宿、亲吻或婚约。

# O. 外包交接文件定义与验收口径

**美术：**50张场景 `CLEAN` 底图＋同景分层特效＋主角/配角表情动作表；同角色统一脸型、服装与伤痕；导出档案需附授权说明。
**音频：**10首原创可循环BGM、至少8组多层SFX、角色台词配音（如采用），逐句文件名按`CHXX_SCENE_SPEAKER_LINE`。
**动画：**主要角色11类表情动作基包＋剧情专属动作（上述清单），1:1对应场景切换与选择条件。
**程序：**30章内容播放、天气与音频总线、剧情选择与状态写入、30个可跳过的小游戏、长期记忆、结局分流、存档恢复、无障碍设置。
**测试：**主线30章全走通；每章A/B/C至少各测一次；五大结局；拒绝亲密/跳过游戏/网络中断回归；闪电低动态模式；50张BG切换无人物造型漂移。

**尚未包含：**真实生成的50张电影级背景图、角色动画视频、配音音乐成品及可运行引擎JSON；需要按上述清单生产并做完整QA后才称为“可正式上线”。
