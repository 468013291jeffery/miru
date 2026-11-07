# MIRU M—《未读的选择》The Unread Choice｜v14.0 上线候选完整编剧包

> **版本性质：** 这是面向制作与测试的**完整30章主线＋逐场调度＋情绪强化对白＋分支回收＋四条结局剧本候选稿**。游戏规则写明“做什么”但不开发小游戏。本文件不是已生成50张真人图/动态人像/原创配乐或已通过引擎验证的可上传安装包；正式上线须完成文末资产、引擎与QA清单。

## 00｜作品定位、情绪承诺、用户期待

- **受众：** 美国英语市场成人 BL/双男主互动恋爱用户；主角 Hayden（20岁）默认男性，可选择显示名。William 21岁、Alex 20岁、Nicole 21岁、Eric 22岁；人物均成年。
- **一句话卖点：** 全校最耀眼的 William 在万人面前把王冠交给你；从不相信长久的 Alex 只让你听他没写完的歌。匿名曝光让他们必须学会保护你，而不是争赢你。
- **体验承诺：** 30秒内公开偏爱；3分钟内体验一次真正不同的回应；每章至少一次独特情绪回报；每5章一次局势变化；拒绝亲密/选择友情亦获得完整的温暖故事。
- **支配情绪的五条人物原则：** William 的爱是“让全世界看见你，却在你不愿时挡住镜头”；Alex 的爱是“允许你走进他从不公开的脆弱”；Nicole 为玩家提供不附带条件的现实支持；Eric的偷拍行为有后果且不可浪漫化；Hayden 的决定永远不被分数覆盖。
- **叙事方式：** 玩家可见文本/角色台词用自然的美式英文；导演、UI和编剧规则用中文。固定公共事件可回流，吻/牵手/留宿/公开/恋爱承诺不能无条件回流。

## 01｜实现与叙事合同

**阅读优先级：** 本版“强化场景”插在各章最终 PLAYER_CHOICE 前；原场次和原选择保留，若本版条件与原稿默认台词冲突，以本版事实flag与条件为准。场景人物、环境和音乐在该章 `SCN` 段已逐一落点。

**持久状态：** `W_affection,A_affection,W_trust,A_trust` 取0–100、初始化50；`focus` 取neutral/William/Alex/self；`W_kiss,A_kiss,W_hug,W_handhold,A_handhold,W_overnight,A_overnight,W_dance,A_dance` 初始false；`William_friend_only,Alex_friend_only,romance_paused,trial_mode,consent_W_open,consent_A_open,public_visibility,secret_melody,distance_plan,final_route`。正向同意需要明确玩家指令，不能根据亲密度推断。

**单章节流程：** 读取上章事实 → 预载BG与站位 → 环境与BGM → 逐句对话 → 对应小游戏说明（均可跳过） → 情绪高潮 → A/B/C实际分支 → 写入事实和长期记忆 → 后续回流 → 章末钩子。第30章额外提供D协商开放路径。

**注意：** 故事开头舞会屏幕的匿名信息是 Eric 尝试制造舆论的前奏，但前11章人物不能未经证据知道他是幕后人。任何人物不能凭空知悉玩家与另一人的私聊内容。

### 环境特效的上线要求

| 效果 | 出场位置 | 具体执行 | 退出条件 |
|---|---|---|---|
| 小雨/暴雨 | CH06、15–17、23–26 | 玻璃雨痕、地面反射、雨衣湿度与人物湿发连续；雨声在对白时减弱 | 进入室内只保留窗外雨层，雨停渐弱2秒 |
| 风 | CH01露台、CH03公园、CH16门廊、CH29天台 | 人物衣角/发丝与树叶同步，按背景景深分别动 | 关门/切内景时停止；不要瞬间清除人物湿发 |
| 闪电/远雷 | CH17雨夜一次 | 云层短暂照亮，1.5–2.5秒后远雷；避免高频闪烁 | 一次触发后恢复常态 |
| 心动/心跳 | CH01公开偏爱、CH13脆弱告白、CH16自愿靠近、CH29终局 | 0.8秒局部暖光+两次轻心跳；不遮挡人物眼与对白 | 触发一次后结束；玩家拒绝则不播亲密心动 |
| 震撼/冷色 | CH05偷拍、CH06私聊曝光、CH10直播、CH27投票 | BGM静音0.3秒，环境声收窄，冷色下压但保留阅读对比 | 真实安全信息出现后恢复 |

### 游戏和互动只写发生位置（无需开发）

每章“互动游戏”仅由文本说明其**玩法、节点、成功/跳过后的剧情影响**。不使用小游戏成败判断人物是否同意亲密，不强制看广告/付费才能拥有善意和安全。

---

## 02｜逐章正式脚本（每章均包含三场SCN、对白与资源指令）

## CH_01｜王冠不是奖品 / The Crown Is Not the Prize

**章节ID：** `CH_01`｜**情绪主轴：** 公开偏爱与警告｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_01_01｜场景1｜切图 `BG01`｜BGM `M01`｜`FX_PUSH_IN + SFX_CROWD_DUCK`

> **v11实景特效逐帧执行单｜`VFX_01_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 金色纸屑从舞台缓落、舞台背光在William肩后形成轮廓；群演的灯牌轻微摆动。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** WILLIAM第一次望向玩家：局部暖光+视线聚焦，0.6秒；心动音只响一次。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 人群欢呼立体声→William开口时侧链压低到-18dB；王冠放下发出轻金属声。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 王冠可点击检查：触发银链细节；不改变选择。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 舞会直播结束，William走下台，群演形成可见通道。 进入此场景准确切换到 `BG01`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **HOST:** “And this year’s crown goes to William Hayes!”
- **WILLIAM:** “Keep it. I already found something I want more.”
- **HOST:** “Someone, you mean?”
- **WILLIAM:** “Someone who gets to decide whether I’m worth their time.”
- **ALEX:** “That is a very expensive speech for someone who forgot to ask their name.”
- **WILLIAM:** “I know their name. I wanted them to hear it from me.”
- **ALEX:** “Then say it.”
- **WILLIAM:** “Welcome to Northbridge, Hayden. This night belongs to you, not the crowd.”

### SCN_01_02｜场景2｜切图 `BG02`｜BGM `M01`｜`FX_SPLIT_CHOICE + FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_01_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 露台微风推动两人衣摆，玻璃门反射室内金灯；夜空无雨。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Alex伸手时从指尖往外扩散极淡的金色光晕0.55秒；不得模拟身体强制接触。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 舞厅远处低频鼓点，近处风与脚步声；无人说话时不播心跳。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 玩家可点「看William/看Alex/后退」改变镜头焦点，不自动视为接受。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 两人站在同一露台，William递王冠，Alex伸手但不触碰玩家。 进入此场景准确切换到 `BG02`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “He’s giving you a crown. I can offer an exit that isn’t surrounded by cameras.”
- **WILLIAM:** “Or you can stay. Nobody gets to make this decision for you.”
- **NICOLE (TEXT):** “Tell me you’re seeing this. The whole school is screaming. Are you okay?”

### SCN_01_03｜场景3｜切图 `BG01`｜BGM `M01`｜`FX_SCREEN_GLITCH + SFX_BASS_HIT`

> **v11实景特效逐帧执行单｜`VFX_01_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 舞会LED屏失真仅作用于屏幕纹理；现场灯光短闪一次，非全屏频闪。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 警告字出现时屏幕冷白光瞬间压住暖光；人物表情切惊愕。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** BGM切断0.35秒→单次低频冲击→压抑环境底噪。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点屏幕放大信息后才出现三选项；不锁死任意人物路线。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 舞会屏幕故障，警告浮层后期叠加，切回二人惊讶表情。 进入此场景准确切换到 `BG01`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **SCREEN:** “ONE OF THEM HAS BEEN LYING TO YOU.”
- **ALEX:** “That isn’t part of the show.”
- **WILLIAM:** “Who gave them access to the display?”
- **ALEX:** “Look at me. Whatever this is, you don’t owe anyone a scene.”


### ★ 上线情绪高潮强化场｜众目睽睽的偏爱

**互动游戏落点：** 王冠触摸；当 William 第一次看向玩家时，切近景，不要延迟出现眼神回应。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “I memorized your name before I knew whether you’d ever say mine.”
- **ALEX:** “If the spotlight makes you uncomfortable, say the word. I’ll get you out.”

**导演指令：** 玩家抬眼时 William 收起表演式的笑；Alex 反而向后退半步，把道路留出来。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:王冠被放入纪念品柜，William第二章送来亲手写的便签。
- B:Alex带玩家走侧门，第二章发送仅两人知道的秘密入口。
- C:两人同时解释从欢迎名单认识 Hayden，第四章追加核查名单来源。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_01_A`｜接过王冠并盯住William**  
玩家台词：**“I’ll take it. Now tell me why you chose me.”**  

角色即时回应 **WILLIAM**：“Because you looked past the stage. Because you weren’t impressed when everyone else was.”  

存档更新：`W_affection:+5,W_trust:+2,focus:William`

**B · `CH_01_B`｜把手伸向Alex**  
玩家台词：**“Show me that exit.”**  

角色即时回应 **ALEX**：“Gladly. But first, I want you to know I noticed you long before tonight.”  

存档更新：`A_affection:+5,A_trust:+2,focus:Alex`

**C · `CH_01_C`｜退后一步要求真相**  
玩家台词：**“No more performances. Who knows me here?”**  

角色即时回应 **WILLIAM**：“I know your name. I don’t know who put that message on the screen.”  

角色即时回应 **ALEX**：“And I won’t pretend otherwise.”  

存档更新：`W_trust:+3,A_trust:+3,focus:neutral`


**自由对话 `FREE_CHAT_01`：** 追问为什么认识我、选择离开舞会、明确不接受被公开拍摄；两人必须解释但不能提前认出Eric。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 匿名账号发送第一条消息：“You were supposed to choose one.”

**连续性/验收：** 舞会屏幕恶作剧的后台权限未知；王冠、W与A戒指尚未身份绑定。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_02｜两封没有署名的邀请 / Two Invitations

**章节ID：** `CH_02`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_02_01｜场景1｜切图 `BG03`｜BGM `M02`｜`FX_PHONE_OVERLAY + SFX_MSG`

> **v11实景特效逐帧执行单｜`VFX_02_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 宿舍窗外夜风晃动树影，落地灯缓亮；无雨。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William和Alex消息先后到达时分别在两人头像边亮不同色的微弱光环。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 空调底噪+两条不同轻消息提示音；聊天时BGM降低。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点开Nicole视频可看到安全建议，不记入恋爱倾向。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Nicole视频通话，玩家整理搬家纸箱。 进入此场景准确切换到 `BG03`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **NICOLE:** “If you need me, I’m one building away. And yes, that was the weirdest welcome party I’ve ever seen.”
- **PLAYER (NARRATION):** “My phone lights up before I can answer. Two new messages.”
- **W (TEXT):** “You looked overwhelmed. I owe you a real introduction. Tomorrow, eight. Public park.”
- **A (TEXT):** “He’s not the only one who wants to see you. Same time, different bench.”
- **NICOLE:** “Two invitations in thirty seconds? You really are trouble.”

### SCN_02_02｜场景2｜切图 `BG04`｜BGM `M02`｜`FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_02_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 屏幕手机相片可滑动；银链反光与银戒反光分开做图层。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 照片放大时柔焦至物件，0.45秒还原；不显示未揭露的脸。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 轻触滑动声，放大时音效极轻。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 必须逐一点击银链、银戒后启用继续按钮。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 前景UI依次展示银链特写与银戒特写，玩家通过点击逐张放大。 进入此场景准确切换到 `BG04`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **W (TEXT):** “I’ll be wearing the silver chain from my picture. You can leave whenever you want.”
- **A (TEXT):** “Silver ring. Awful habit of telling the truth at the worst possible moment.”
- **PLAYER (NARRATION):** “The chain catches the light. So does the ring. No faces.”
- **NICOLE:** “Meet in public, send me your location, and don’t let them turn a date into a dare.”

### SCN_02_03｜场景3｜切图 `BG03`｜BGM `M02`｜`SFX_MSG`

> **v11实景特效逐帧执行单｜`VFX_02_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 窗帘随风微动，桌上日历翻页。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 两份邀请并列时心动环在屏幕边缘轻扫一次，非强制恋爱。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 两条信息间隔按阅读确认，不使用倒计时。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可以分别改时间/取消，不因拒绝扣好感。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 两人的邀请停在屏幕，出现日程冲突提示。 进入此场景准确切换到 `BG03`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **W (TEXT):** “If tomorrow feels wrong, say the word.”
- **A (TEXT):** “I don’t mind waiting. I mind being an afterthought.”
- **PLAYER (NARRATION):** “For the first time tonight, I get to decide what happens next.”


### ★ 上线情绪高潮强化场｜只给你的两条消息

**互动游戏落点：** 手机选择先回复谁；两条消息都能保存为独立记忆。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “I’m trying very hard not to double-text. How am I doing?”
- **ALEX:** “I saved you the seat by the window. You can say no. I’ll still save it for tomorrow.”

**导演指令：** William 的输入状态出现三次又撤回；Alex 发来一张没有任何人的夜空照片。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:William带来第一次约会安排，Alex不指责。
- B:Alex透露曾看过玩家迎新申请资料上的音乐兴趣，不暗示监控。
- C:Nicole陪玩家先核验陌生号码，双方尊重玩家慢回复。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_02_A`｜接受W的公共场所邀约**  
玩家台词：**“Eight works. The well-lit side of the park.”**  

角色即时回应 **W (TEXT)**：“Agreed. I’ll be there early.”  

存档更新：`first_date:William,W_trust:+3`

**B · `CH_02_B`｜改约A先见面**  
玩家台词：**“I’d rather hear your real voice first. Meet me at the café?”**  

角色即时回应 **A (TEXT)**：“Finally. Someone who asks for what they want.”  

存档更新：`first_date:Alex,A_trust:+3`

**C · `CH_02_C`｜把两人错开并告知Nicole**  
玩家台词：**“Not at the same time. You each get your own conversation.”**  

角色即时回应 **W (TEXT)**：“Fair.”  

角色即时回应 **A (TEXT)**：“Fairer than pretending I’m the only one.”  

存档更新：`first_date:staggered,both_trust:+2`


**自由对话 `FREE_CHAT_02`：** 玩家可取消约会、问喜欢的音乐或食物；禁止把取消写成惩罚。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** Nicole看到舞会群聊里流出一张被裁剪的玩家背影照片。

**连续性/验收：** 设置约会地点、安全联系人和首次偏好；银链银戒是可回收伏笔。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_03｜长椅边的秘密 / The Bench at Eight

**章节ID：** `CH_03`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_03_01｜场景1｜切图 `BG05`｜BGM `M03`｜`SFX_WIND + FX_BLUR_TO_FOCUS`

> **v11实景特效逐帧执行单｜`VFX_03_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 公园树叶被持续的夜风吹动，长椅下落叶滚动；灯光稳定。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 远方声音出现时景深从路灯收向人群，玩家视线不自动追入暗处。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 风声-26dB，远方警笛由远及近，背景音乐逐渐变紧。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点击路灯、公共道路、紧急联系按钮之一获得安全路径。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 根据first_date显示W或A消息；镜头固定明亮公园长椅。 进入此场景准确切换到 `BG05`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **PLAYER (NARRATION):** “The park is quieter than the ballroom. Too quiet.”
- **W (TEXT):** “I’m close. Stay where the lights are.”
- **A (TEXT):** “If you’re alone, I can stay on the phone until your ride arrives.”
- **UNKNOWN (DISTANT):** “Hey! Stop!”
- **SFX:** “A security whistle cuts through the trees.”

### SCN_03_02｜场景2｜切图 `BG06`｜BGM `M03`｜`SFX_SECURITY + FX_PUSH_IN`

> **v11实景特效逐帧执行单｜`VFX_03_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 人行道尘叶被鞋步带起，Nicole外套边被风掀起。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 她说“eyes on me”时镜头稳定，警报触发的暗角撤去。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 安全哨声一响即BGM静音0.3秒，再缓慢恢复。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 选择安全离开/联系相约者/和Nicole同行；不得强制冒险。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Nicole到达安全通道，避免玩家主动进入危险树林。 进入此场景准确切换到 `BG06`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **NICOLE:** “Hey, eyes on me. We are not investigating mystery noises on a first date.”
- **PLAYER (NARRATION):** “My phone vibrates again.”
- **W (TEXT):** “You can leave. I won’t be offended.”
- **A (TEXT):** “I’m here if you need me. You don’t need to prove anything.”

### SCN_03_03｜场景3｜切图 `BG05`｜BGM `M03`｜`FX_MEMORY_FLASH`

> **v11实景特效逐帧执行单｜`VFX_03_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 长椅空景必须有人物远景，远处银链反光转瞬即逝。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 银链线索给予一次冷色聚焦；不显示身份实名字幕。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 风小下来、脚步由近及远；悬念音只出现一次。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可记录“我看到的细节”，仅存线索不自动揭晓身份。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 独立叙事镜头给观众看到William银链，但玩家知识状态仍未解锁。 进入此场景准确切换到 `BG05`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM (TO HIMSELF):** “I rehearsed three ways to say hello. Apparently none of them involved a police whistle.”
- **PLAYER (NARRATION):** “Across the path, someone stands by the empty bench. I see only the edge of a silver chain.”


### ★ 上线情绪高潮强化场｜公园里的选择

**互动游戏落点：** 追随脚步或坐下等待；环境风推动树叶，安保警铃不是心动游戏。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “I was there. When you left, I thought I’d missed my chance.”
- **ALEX:** “I didn’t show up because you asked to meet someone else first. That mattered.”

**导演指令：** William 握着未送出的热可可，杯盖上的水汽已经散尽。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:若玩家等 William，解锁热可可回忆。
- B:若联系 Alex，获得次日音乐室邀请。
- C:离开公园是安全决定，Nicole第二天陪同确认近况。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_03_A`｜现在离开，发信息说明**  
玩家台词：**“Something’s wrong. I’m leaving. We can try another day.”**  

角色即时回应 **W (TEXT)**：“Good call. Text me when you’re safe.”  

存档更新：`safety:leave,W_trust:+3`

**B · `CH_03_B`｜等Nicole来后一起走**  
玩家台词：**“Nicole’s coming. I’m not staying here alone.”**  

角色即时回应 **NICOLE**：“Ten points for listening to your own instincts.”  

存档更新：`safety:escort,Nicole_trust:+3`

**C · `CH_03_C`｜改为白天咖啡馆见**  
玩家台词：**“Tomorrow. Daylight. Coffee. No surprises.”**  

角色即时回应 **A (TEXT)**：“I’ll bring the coffee. You bring the questions.”  

存档更新：`safety:reschedule,A_trust:+3`


**自由对话 `FREE_CHAT_03`：** 可讨论安全感、改期；NPC不得以危险换浪漫。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 来自陌生号码的短信：“He was there. You walked right past him.”

**连续性/验收：** 第一次失约成立；W身份未被玩家确认，Eric只作为旁观校园摄影助理。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_04｜银链与银戒 / Silver Chain, Silver Ring

**章节ID：** `CH_04`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_04_01｜场景1｜切图 `BG07`｜BGM `M04`｜`FX_PUSH_IN`

> **v11实景特效逐帧执行单｜`VFX_04_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 咖啡馆晨光穿过玻璃照亮William脸颊，咖啡表面有热气。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 银链曝光时光斑精准掠过项链0.4秒，随后锁焦在眼睛。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 咖啡杯落桌与低声谈话真实混音；身份线索出现时轻铃音。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 允许点击银链与人脸比对，确认才更新W_identity。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** William摘下耳机坐到玩家对面，银链闪光；Alex手持咖啡入画，银戒清晰。 进入此场景准确切换到 `BG07`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “Before you say it: yes, I was the guy by the bench.”
- **PLAYER (NARRATION):** “The silver chain glints as he leans forward.”
- **WILLIAM:** “I’m W. I should have said that without making you guess.”
- **ALEX:** “And since secrets are apparently going out of style...”
- **PLAYER (NARRATION):** “He sets down coffee. A silver ring circles his index finger.”
- **ALEX:** “A. That’s me. Disappointed?”
- **WILLIAM:** “Alex, that’s not how an apology works.”
- **ALEX:** “Good. I wasn’t apologizing for liking them.”

### SCN_04_02｜场景2｜切图 `BG08`｜BGM `M04`｜`SFX_CAFE_DOOR`

> **v11实景特效逐帧执行单｜`VFX_04_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 街道上微风吹动Alex的衬衫袖口与路边旗帜。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 银戒映入画面时加一帧细微高光，不放电闪。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 开门风铃，交通远噪，Alex说出真相时城市声降至-30dB。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点戒指确认A身份；也可表示不满被隐瞒。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 玩家可以在咖啡馆外分别询问身份，NPC不打断。 进入此场景准确切换到 `BG08`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “The pictures were meant to keep things simple. Then you walked into the ballroom.”
- **ALEX:** “Simple is overrated. Honest is harder.”
- **WILLIAM:** “No more anonymous games. I promise.”
- **ALEX:** “I can promise to tell you when I’m scared to answer. That’s more real.”

### SCN_04_03｜场景3｜切图 `BG07`｜BGM `M04`｜`FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_04_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 上午阳光逐步变暖，桌面光影移动。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 双人注视时心动光仅向所选角色出现，未选择则用中性清晰对焦。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 心动节拍与呼吸同步仅一次；保持语音清晰。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 依据前面选择有不同回应与信任记录。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 咖啡桌中间出现两张活动票：剧院与夜间音乐演出。 进入此场景准确切换到 `BG07`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “Come to rehearsal one night. No crowd, no crown.”
- **ALEX:** “Or come listen to a song I’m not ready to release.”
- **PLAYER (NARRATION):** “Two invitations. This time, I know whose faces are behind them.”


### ★ 上线情绪高潮强化场｜银链不是巧合

**互动游戏落点：** 银链与戒指比对；识别只揭晓身份，不提前揭晓幕后偷拍者。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “You weren’t meant to meet a picture of me. You were meant to meet me.”
- **ALEX:** “I like that you looked me in the eye before you checked the ring.”

**导演指令：** 银链在晨光中发亮，William 把它收进衣领，第一次不再依赖校草光环。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:William邀请私人剧场参观，未来第13章回收。
- B:Alex主动递耳机，未来第14章回收。
- C:两人如实道歉隐瞒，第6章信任危机时优先保护玩家。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_04_A`｜先问William**  
玩家台词：**“Why hide behind a letter when everyone knows your face?”**  

角色即时回应 **WILLIAM**：“Because nobody ever asks who I am after they recognize it. You did.”  

存档更新：`W_trust:+5,knows_W:true`

**B · `CH_04_B`｜先问Alex**  
玩家台词：**“Were you afraid I wouldn’t choose you if I knew?”**  

角色即时回应 **ALEX**：“I was afraid you’d only see what people say about me.”  

存档更新：`A_trust:+5,knows_A:true`

**C · `CH_04_C`｜明确新规则**  
玩家台词：**“No more testing me. Either you show up as yourselves, or don’t show up.”**  

角色即时回应 **WILLIAM**：“Understood.”  

角色即时回应 **ALEX**：“I can do that.”  

存档更新：`W_trust:+4,A_trust:+4,knows_both:true`


**自由对话 `FREE_CHAT_04`：** 玩家追问匿名照片、银链银戒来历、各自爱好；Eric不得过早暴露。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 门外一位带相机和校媒证件的男人举起镜头，对准咖啡店。

**连续性/验收：** W/A身份全部解锁；后续称实名。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_05｜一场游戏，两颗心 / The Kiss Game

**章节ID：** `CH_05`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_05_01｜场景1｜切图 `BG09`｜BGM `M05`｜`SFX_PARTY + FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_05_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 派对彩灯慢扫，香槟色反射，背景学生真实跳舞。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William被选择时暖色心动微粒；Alex被选择时冷紫微粒；都拒绝则无恋爱粒子。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 人群起哄后自动衰减，心跳两声仅在玩家主动靠近时触发。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 亲吻/握手/拒绝都必须是合法选择。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Nicole主持小型朋友聚会，起哄但尊重玩家说不。 进入此场景准确切换到 `BG09`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **NICOLE:** “New rule. Nobody kisses anybody they don’t actually want to kiss.”
- **GUEST:** “Okay, then. Who here would you kiss?”
- **WILLIAM:** “You don’t have to answer that.”
- **ALEX:** “I’m curious what you’d say if they weren’t all listening.”
- **PLAYER (NARRATION):** “The room is suddenly too warm.”

### SCN_05_02｜场景2｜切图 `BG09`｜BGM `M05`｜`FX_PUSH_IN`

> **v11实景特效逐帧执行单｜`VFX_05_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 瓶子旋转产生桌面反光，不做眩晕旋转镜头。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 两人近景的眼神聚焦交替，镜头保持玩家第一人称。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** BGM留拍停顿0.5秒，等待玩家自己决定。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点击对象前先出现“可以吗？”互动，不替NPC强制同意。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** William和Alex各在画面左右，做出不同反应。 进入此场景准确切换到 `BG09`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “If the answer is me, I’d rather hear it quietly.”
- **ALEX:** “And if it isn’t? I’ll survive. Dramatically, but I’ll survive.”
- **NICOLE:** “Both of you. Give them space.”

### SCN_05_03｜场景3｜切图 `BG10`｜BGM `M05`｜`SFX_SHUTTER + FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_05_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 走廊暗处灯光略冷，相机镜头有反射但不美化偷拍。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 偷拍瞬间只给一次快门光点，避免用浪漫滤镜。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** SFX_SHUTTER远处模糊、短暂毛骨悚然的音色。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可点走廊背影留下可疑人物线索；不立刻指认Eric。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 派对结束走廊，Eric假装拍布景，手机UI内可见未锁屏聊天光线。 进入此场景准确切换到 `BG10`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **PLAYER (NARRATION):** “A camera clicks behind the doorway.”
- **ERIC:** “Relax. I’m with campus media. I’m documenting the party.”
- **NICOLE:** “Not private phones, you’re not.”
- **ERIC:** “Sure. Of course. My mistake.”


### ★ 上线情绪高潮强化场｜一场游戏，两个人的勇敢

**互动游戏落点：** 真心话可选择亲吻、坦白或拒绝；未选择则不得出现吻照。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “You don’t have to kiss me to make tonight unforgettable.”
- **ALEX:** “I’d rather know what you actually want than win a stupid party game.”

**导演指令：** Nicole 把起哄的人挡开，玩家仍站在最亮的那束灯下，却第一次感觉安全。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:若自愿亲吻 William，设置 W_kiss；Alex之后吃醋只针对事实。
- B:若自愿亲吻 Alex，设置 A_kiss；William之后表达失落不控诉。
- C:若拒绝游戏，偷拍照仅可同框，不得假造亲吻。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_05_A`｜邀请William单独亲吻（可改拥抱）**  
玩家台词：**“William, can we have one quiet minute?”**  

角色即时回应 **WILLIAM**：“I thought you’d never ask. If a kiss feels right, I’d like that.”  

存档更新：`W_affection:+5,kiss_W:optional`

**B · `CH_05_B`｜主动与Alex约定只属于两人的瞬间**  
玩家台词：**“Alex, walk with me. I want to hear you without the audience.”**  

角色即时回应 **ALEX**：“That might be the most dangerous invitation I’ve ever accepted.”  

存档更新：`A_affection:+5,kiss_A:optional`

**C · `CH_05_C`｜拒绝游戏，带两人走向露台**  
玩家台词：**“I don’t make private decisions for a room full of strangers.”**  

角色即时回应 **WILLIAM**：“Then we leave the room out of it.”  

角色即时回应 **ALEX**：“Best idea tonight.”  

存档更新：`both_trust:+4,no_public_kiss:true`


**自由对话 `FREE_CHAT_05`：** 可以吻、拥抱、聊或拒绝；若拒绝，不能在后续叙述为已亲吻。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 陌生账号发来派对照片：“MIDNIGHT. CHOOSE ONE.”

**连续性/验收：** 不管是否亲吻，泄露素材可以是靠近或聊天照片；不得编造玩家未选吻。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_06｜午夜前的威胁 / Before Midnight

**章节ID：** `CH_06`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_06_01｜场景1｜切图 `BG11`｜BGM `M06`｜`SFX_MSG + FX_SCREEN_GLITCH`

> **v11实景特效逐帧执行单｜`VFX_06_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 窗上清晰雨珠从外侧向下滑，室内人物与手机清楚可见。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 威胁信息亮起时心动粒子全停，画面边缘冷下来。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 细雨铺底，短信音突兀；威胁出现时BGM静音0.5秒。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点击保存证据/联系好友/分别通知两男主。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 匿名消息叠加在Nicole的视频上，图片内容由第5章真实行为生成。 进入此场景准确切换到 `BG11`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **UNKNOWN (TEXT):** “Pick one by midnight or I’ll let the whole campus do it for you.”
- **NICOLE:** “That isn’t flirting. That’s blackmail. Screenshot it.”
- **PLAYER (NARRATION):** “For a second, the party seems to happen all over again, this time through someone else’s camera.”

### SCN_06_02｜场景2｜切图 `BG13`｜BGM `M06`｜`FX_SPLIT_CHOICE`

> **v11实景特效逐帧执行单｜`VFX_06_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 图书馆走廊大窗外暴雨加重；William与Alex发梢微湿。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 两人争执时外面一道远雷照亮玻璃，室内不全屏闪。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 远雷延时约1.5秒到达，脚步声在廊道有反射。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点击任意一人可单独询问，也可要求两人不争论。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** William和Alex赴约，分别从走廊两端靠近。 进入此场景准确切换到 `BG13`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “I can ask the media office to take it down. Just say the word.”
- **ALEX:** “First we save the evidence. Then we decide what you want public.”
- **WILLIAM:** “I’m not leaving because somebody wants us to fight.”
- **ALEX:** “Neither am I. I just won’t pretend I like sharing a threat with strangers.”

### SCN_06_03｜场景3｜切图 `BG12`｜BGM `M06`｜`SFX_MSG + FX_SCREEN_GLITCH`

> **v11实景特效逐帧执行单｜`VFX_06_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 论坛动态覆盖人物照片，窗外雨声没有无故消失。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 截图曝光后冷色低饱和+轻微边缘收缩，非故障大闪屏。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 每条转发提示最多一次；避免连环刺激。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 允许保留截图和投诉，玩家不必公开解释亲密生活。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 23:59变为00:00，论坛截图弹出，照片内容需映射既有选择。 进入此场景准确切换到 `BG12`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **PLAYER (NARRATION):** “The clock turns. The forum refreshes.”
- **POST:** “NEW TRANSFER, TWO HEARTTHROBS, ONE SECRET?”
- **WILLIAM:** “This should never have been posted.”
- **ALEX:** “Look at me. We can deal with the internet later. What do you need now?”


### ★ 上线情绪高潮强化场｜整个校园都在看，你只需要看我

**互动游戏落点：** 匿名威胁证据检查；手机解锁后现实世界暂停，不能因超时惩罚玩家。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “Let them say my name. They don’t get to take yours.”
- **ALEX:** “I’ll sit right here until you decide what you need. No speeches.”

**导演指令：** 两人把手机倒扣，第一次不是争谁陪你，而是并肩陪你面对屏幕。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:William协助保存威胁信息且不发布声明。
- B:Alex陪同管理员处理截图。
- C:Nicole主导流程，玩家可暂停两条恋爱线。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_06_A`｜保全证据交校方**  
玩家台词：**“I want this documented. No one gets to use my life as content.”**  

角色即时回应 **NICOLE**：“I’m with you. I’ll send the screenshots to student affairs.”  

存档更新：`privacy:reported,Nicole_trust:+4`

**B · `CH_06_B`｜公开声明只谈隐私**  
玩家台词：**“I’ll speak for myself. Nobody else posts in my name.”**  

角色即时回应 **WILLIAM**：“I won’t say a word on your behalf.”  

存档更新：`privacy:public_statement,W_trust:+4`

**C · `CH_06_C`｜暂时离线接受陪伴**  
玩家台词：**“Phones away. I need people, not another statement.”**  

角色即时回应 **ALEX**：“Then we sit here. As long as you want.”  

存档更新：`privacy:offline,A_trust:+4`


**自由对话 `FREE_CHAT_06`：** 玩家可焦虑、愤怒、保持沉默，NPC支持而不擅自发言。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 三人仍在走廊时，匿名账号发来一张刚拍的实时照片。

**连续性/验收：** 开始隐私事件；可选是否公开回应，事件本身不能归咎玩家。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_07｜镜头背后的人 / Behind the Lens

**章节ID：** `CH_07`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_07_01｜场景1｜切图 `BG13`｜BGM `M07`｜`SFX_SHUTTER`

> **v11实景特效逐帧执行单｜`VFX_07_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 图书馆外雨后地面潮湿，落水沿雨棚滴落。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 媒体证件翻转时背景虚化，姓名焦点拉近。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 滴水和脚步，快门声回忆作为单次音效。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点证件放大并存储线索。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Nicole注意到一张媒体证，Eric离开画面。 进入此场景准确切换到 `BG13`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **NICOLE:** “That badge. I know the logo. Campus Media.”
- **WILLIAM:** “Eric works their photo desk. I know him.”
- **ALEX:** “So do I.”
- **PLAYER (NARRATION):** “Alex says it too quickly, then turns away.”

### SCN_07_02｜场景2｜切图 `BG14`｜BGM `M07`｜`FX_PUSH_IN`

> **v11实景特效逐帧执行单｜`VFX_07_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 办公室荧光灯偏冷，风把门缝里打印纸吹动。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Eric遮住手机时手指细节加聚焦；绝不把侵权镜头做成魅力CG。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 空调电流底噪、椅子拉动；质问时环境声压低。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可要求校媒负责人在场，避免独自对峙。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 四人向Eric核对照片来源。 进入此场景准确切换到 `BG14`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ERIC:** “I shot the party. I didn’t leak private messages.”
- **PLAYER (NARRATION):** “His phone lights up. A thumbnail shows the bright edge of my screen.”
- **WILLIAM:** “Why is their screen in your camera roll?”
- **ERIC:** “You’re all acting like I stole state secrets.”
- **ALEX:** “It wasn’t yours to take.”
- **ERIC:** “Funny hearing you lecture me about what people owe each other.”

### SCN_07_03｜场景3｜切图 `BG15`｜BGM `M07`｜`FX_MEMORY_FLASH`

> **v11实景特效逐帧执行单｜`VFX_07_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 档案室旧风扇慢转、尘埃在光束漂浮。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 旧照片出现使用灰蓝回忆滤镜；Alex表情不自动变得羞愧。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 低音钢琴断奏，照片拍桌声。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可查看照片时间，不预先宣称同意或不忠。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Eric展示去年秋天他与Alex的普通合照，画面不得暗示当前亲密。 进入此场景准确切换到 `BG15`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ERIC:** “Ask Alex why we stopped speaking.”
- **ALEX:** “This isn’t your story to tell.”
- **ERIC:** “Maybe it became mine when you walked away.”
- **NICOLE:** “Or maybe your feelings don’t give you permission to photograph someone’s private messages.”


### ★ 上线情绪高潮强化场｜镜头后的第三个人

**互动游戏落点：** 点击摄影证与相机时间戳；证据失败不阻断主线。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **ERIC:** “It’s funny how fast a stranger becomes everyone’s favorite.”
- **ALEX:** “Whatever you think I owe you, Hayden has nothing to do with it.”

**导演指令：** William 发现熟悉的同事 Eric 涉案，脸色变白，仍先看玩家是否需要离开。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:校媒权限线索提前入库。
- B:Alex谈及与Eric的旧事但不暴露私人细节。
- C:玩家先选择暂停调查，Nicole保存证据。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_07_A`｜要求交出相机原片**  
玩家台词：**“I want an independent review of the original files.”**  

角色即时回应 **ERIC**：“Fine. Ask the media office. I’m not deleting a thing.”  

存档更新：`evidence:requested,trust_Nicole:+2`

**B · `CH_07_B`｜请Alex在外面解释**  
玩家台词：**“Alex, I want your version. Not his.”**  

角色即时回应 **ALEX**：“You’ll have it. Every part that is mine to tell.”  

存档更新：`A_trust:+4,alex_disclosure:pending`

**C · `CH_07_C`｜暂停对峙，找校媒负责人**  
玩家台词：**“We’re done arguing. This goes to the people who can verify it.”**  

角色即时回应 **WILLIAM**：“I’ll get the supervisor.”  

存档更新：`case:escalated,W_trust:+3`


**自由对话 `FREE_CHAT_07`：** 可问旧照、相识时间，Alex可承认短暂过去但不被迫公开任何非必要细节。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** Alex发来一句私信：“There’s something I should have told you.”

**连续性/验收：** Eric承认拍摄派对照但仍否认泄露截图；不能提前定罪未查的截图来源。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_08｜一首没写完的歌 / The Past Alex Kept

**章节ID：** `CH_08`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_08_01｜场景1｜切图 `BG16`｜BGM `M08`｜`SFX_PIANO_KEY + FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_08_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 练琴室窗边风吹帘角，琴面反射Alex脸。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Alex弹未完成旋律时微粒像音符轻浮，不使用真实旋律版权。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 现场原创钢琴3音动机，弦的低频氛围淡入。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点击钢琴可听原创短动机，存储A_song_progress。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Alex带玩家来到练琴房，远离Eric。 进入此场景准确切换到 `BG16`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “Last fall, Eric and I had a brief thing. It ended. I told him I didn’t want more.”
- **ALEX:** “I stopped replying when he kept asking me to change my mind.”
- **PLAYER (NARRATION):** “His fingers rest on the keys, but he doesn’t play.”
- **ALEX:** “I should have told you he knew me. Not because I owe you my history. Because he was using it to hurt you.”
- **ALEX:** “You get to be angry. I’ll still tell you the truth.”

### SCN_08_02｜场景2｜切图 `BG21`｜BGM `M08`｜`FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_08_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 学生事务处窗外多云，光线稳定。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Hayden被支持时恢复暖色，不用恋爱心形粒子。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 文件翻页、笔尖划纸、外面学生行走声。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 玩家选择提交投诉、先咨询、暂存证据。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Nicole协助向学校提交投诉，校安展示不包含第三方私人信息的摘要。 进入此场景准确切换到 `BG21`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **NICOLE:** “The school is preserving the security footage. They won’t give us other students’ identities.”
- **OFFICER:** “There was someone near the park trees when the whistle sounded. We’re still reviewing it.”
- **PLAYER (NARRATION):** “My phone vibrates. Eric again.”

### SCN_08_03｜场景3｜切图 `BG15`｜BGM `M08`｜`SFX_MSG`

> **v11实景特效逐帧执行单｜`VFX_08_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 档案室空气闷、桌上相纸扬起。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 旧照与当下眼神叠化0.4秒，记忆回放需可跳过。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 相机快门回忆与低频疑云。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可以问Alex自己解释，不能被迫原谅Eric。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Eric发来档案室邀约，Nicole在同一画面。 进入此场景准确切换到 `BG15`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ERIC (TEXT):** “Want the truth about that night? Archives. Nine. Alone.”
- **NICOLE:** “Absolutely not alone.”
- **ALEX:** “If you go, I’ll come. If you don’t, I’ll still help you report it.”


### ★ 上线情绪高潮强化场｜你第一次听到他的脆弱

**互动游戏落点：** 旋律拼图，只奖励额外歌词和共同记忆。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **ALEX:** “I wrote this when I still thought leaving first meant I couldn’t be hurt.”
- **ALEX:** “You can hear the unfinished part. I’ve never let anyone this close to it.”

**导演指令：** Alex 手指悬在最后一个琴键上，终于允许沉默留在两人之间。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:认真听歌，获得 secret_melody。
- B:询问过去，获得 Alex 坦诚但不强迫原谅。
- C:选择友情，Alex仍愿分享音乐，禁用强制吻。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_08_A`｜告诉Alex我在意的是现在的坦诚**  
玩家台词：**“I’m not judging your past. I need to trust your present.”**  

角色即时回应 **ALEX**：“Then I’ll earn that with what I do next.”  

存档更新：`A_trust:+6,disclosure:accepted`

**B · `CH_08_B`｜需要一点距离但保留沟通**  
玩家台词：**“I hear you. I need time before we get close again.”**  

角色即时回应 **ALEX**：“Take it. I’m not disappearing.”  

存档更新：`A_trust:+3,pace:slow`

**C · `CH_08_C`｜请Nicole陪同核实**  
玩家台词：**“Let’s verify Eric’s claims with a witness present.”**  

角色即时回应 **NICOLE**：“I’ll be there with the incident number.”  

存档更新：`evidence:witness,Nicole_trust:+4`


**自由对话 `FREE_CHAT_08`：** 允许玩家表达嫉妒或不同意；不能把Alex过去写成需要玩家原谅的错误。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 校安来电：档案室附近的媒体终端刚被异常预约为深夜直播。

**连续性/验收：** Alex旧事确认，Eric动机有初步推断而非免责。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_09｜旧公园那晚 / That Night at the Park

**章节ID：** `CH_09`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_09_01｜场景1｜切图 `BG15`｜BGM `M09`｜`FX_PUSH_IN`

> **v11实景特效逐帧执行单｜`VFX_09_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 档案室风扇转动，灰尘从强光中流过。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Eric承认公园那晚时用冷色静帧0.35秒强调事实。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 远处打印机机械音停止，留下短暂安静。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 玩家可要求证词写入记录。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 四人到场，Eric面前电脑登录校媒后台，Nicole保留安全距离。 进入此场景准确切换到 `BG15`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ERIC:** “You brought the whole fan club. How touching.”
- **NICOLE:** “You invited a person who’s being harassed to an isolated office. We brought witnesses.”
- **ERIC:** “I was in the park with someone I was seeing. Adults. Consenting. That’s all you need to know.”
- **WILLIAM:** “So you saw Hayden leave?”
- **ERIC:** “And I saw you waiting. Funny how much that bothered me.”

### SCN_09_02｜场景2｜切图 `BG14`｜BGM `M09`｜`FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_09_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 校媒办公室门外穿堂风带动公告纸。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Alex拒绝Eric控制时镜头缓慢靠近，恢复自然光。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 玻璃门轻震，紧张弦乐渐弱。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 玩家可选支持Alex或仅讨论证据。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Eric展示设置好的定时直播窗口。 进入此场景准确切换到 `BG14`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ERIC:** “You got everyone’s attention without trying. I spent months trying to be seen.”
- **ALEX:** “And you chose to punish somebody who didn’t cause that pain.”
- **ERIC:** “The campus can decide who deserves who.”
- **PLAYER (NARRATION):** “A countdown appears: 00:10.”
- **NICOLE:** “That broadcast uses the campus media account. I’m calling the supervisor now.”

### SCN_09_03｜场景3｜切图 `BG18`｜BGM `M09`｜`SFX_BASS_HIT`

> **v11实景特效逐帧执行单｜`VFX_09_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 控制室显示器倒计时红光反射人脸。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 倒计时最后三秒只让显示器闪，不要整屏闪电。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 按秒三次单纯滴答，时间到只有一个低频鼓。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 允许立即通知负责人，中止直播为有效路径。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 值班负责人赶来准备切断直播，玩家不能被迫独自阻止。 进入此场景准确切换到 `BG18`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **SUPERVISOR:** “Step away from the console. Right now.”
- **ERIC:** “Too late.”
- **PLAYER (NARRATION):** “Nine seconds. Eight. Seven.”


### ★ 上线情绪高潮强化场｜那晚树林不是浪漫秘密

**互动游戏落点：** 监控时序互动；不把跟踪偷拍包装成男主占有欲。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **NICOLE:** “A story about you should never be told without you.”
- **WILLIAM:** “I wish I’d arrived sooner. I’m here now.”

**导演指令：** 学生事务处关上门，把围观的声音隔绝在外。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:优先调查 Eric 的时间线。
- B:先照顾自己，Nicole接手证据。
- C:与男主共同确认经历但只共享必要信息。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_09_A`｜提交录音和证据**  
玩家台词：**“Nicole, send everything to the supervisor. Now.”**  

角色即时回应 **NICOLE**：“Sent. Time stamp included.”  

存档更新：`evidence:complete,Nicole_trust:+3`

**B · `CH_09_B`｜站出来说不允许直播**  
玩家台词：**“You don’t get my permission to turn this into a show.”**  

角色即时回应 **ERIC**：“You think your permission changes the internet?”  

角色即时回应 **WILLIAM**：“It changes what we do next.”  

存档更新：`player_agency:+5`

**C · `CH_09_C`｜让两位男主先保护设备与出口**  
玩家台词：**“Please help the supervisor. I’ll stay with Nicole.”**  

角色即时回应 **ALEX**：“On it. No heroics required.”  

存档更新：`safety:+5`


**自由对话 `FREE_CHAT_09`：** 可问Eric原因但不让他合理化骚扰；保留证据。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 直播指示灯由红变绿，Eric的第一张截图被投到屏幕。

**连续性/验收：** 明确Eric在公园的出现，不扩散与其约会者的隐私。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_10｜十秒直播 / Ten Seconds Live

**章节ID：** `CH_10`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_10_01｜场景1｜切图 `BG19`｜BGM `M10`｜`SFX_LIVE + FX_SCREEN_GLITCH`

> **v11实景特效逐帧执行单｜`VFX_10_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 直播间屏幕发冷光，人物头像不失真。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 玩家说出隐私权时有稳定光从侧边照入，不做胜利爆炸。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 直播提示+轻电噪，发言时压低所有BGM。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 玩家选择是否露脸发言或让代表宣读匿名声明。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 直播刚开始，校媒负责人站在旁边控制台操作。 进入此场景准确切换到 `BG19`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ERIC:** “Everybody wants the truth. Here it is.”
- **PLAYER (NARRATION):** “A private message fills the screen. My words, stripped of context.”
- **WILLIAM:** “Take it down.”
- **ALEX:** “You’re showing private messages without consent.”
- **SUPERVISOR:** “Disconnecting external stream—now.”
- **PLAYER (NARRATION):** “The screen goes black. The room keeps breathing.”

### SCN_10_02｜场景2｜切图 `BG18`｜BGM `M10`｜`FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_10_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 控制室门开合，椅子被推动。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 负责人切断直播时画面仅监视器熄灭，不把全场变黑。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 直播中断咔哒，观众环境声缓慢恢复。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 按“停止直播/保留证据/呼叫校方”触发不同界面。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 断播后录下证据和实名处理，Eric尝试推责。 进入此场景准确切换到 `BG18`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ERIC:** “Someone sent me those screenshots. I only posted them.”
- **NICOLE:** “The original camera file will tell us more.”
- **ERIC:** “You can’t prove that.”
- **ALEX:** “Then we’ll let the evidence speak.”
- **WILLIAM:** “Hayden, what do you need from us right now?”

### SCN_10_03｜场景3｜切图 `BG21`｜BGM `M10`｜`FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_10_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 室外雨已停，清晨街灯逐渐熄灭。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William或Alex靠近只给人物自然暖光，拒绝时没有惩罚性暗角。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 空气声变轻，安静留白1.0秒。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 对两人支持方式做选择，Eric调查继续。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 走出大楼，情绪由暴露转回被支持。 进入此场景准确切换到 `BG21`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **PLAYER (NARRATION):** “Outside, the night is almost quiet.”
- **WILLIAM:** “I can’t undo it. But I can be here for the part after.”
- **ALEX:** “You don’t have to be brave for us.”
- **NICOLE:** “And you don’t owe them or anyone a statement before you’re ready.”


### ★ 上线情绪高潮强化场｜直播前十秒，他选择站在你这一边

**互动游戏落点：** 直播发言选择；玩家可自己发言也可让主持人代读书面声明。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “I don’t need a perfect reputation if keeping it means leaving you alone.”
- **ALEX:** “There is nothing embarrassing about wanting to be loved.”

**导演指令：** 镜头切回 William 和 Alex，他们分别朝玩家迈出半步，却没有碰玩家的话筒。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:自己声明，记 voice_public=true。
- B:请求校方介入，记 safety_first=true。
- C:选择不出镜，男主只陈述自己事实。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_10_A`｜给学校正式书面陈述**  
玩家台词：**“I want a case number and a written record.”**  

角色即时回应 **SUPERVISOR**：“You’ll receive both. The account privileges are suspended pending review.”  

存档更新：`case:formal`

**B · `CH_10_B`｜先与Nicole离开现场**  
玩家台词：**“I’m going home. Please keep me updated, not online.”**  

角色即时回应 **NICOLE**：“I’ll manage the notifications with your permission.”  

存档更新：`case:delegate`

**C · `CH_10_C`｜请William和Alex陪伴但不替我发言**  
玩家台词：**“Stay with me. Don’t speak for me.”**  

角色即时回应 **WILLIAM**：“We won’t.”  

角色即时回应 **ALEX**：“You have our word.”  

存档更新：`W_trust:+3,A_trust:+3`


**自由对话 `FREE_CHAT_10`：** 可讨论羞耻感和安全，角色不指责玩家的恋爱选择。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 一条匿名私信出现：“Eric isn’t telling you how the screenshot was made.”

**连续性/验收：** 控制直播但网上已出现截图，后续有真实处理与修复。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_11｜原片里的证据 / The Uncropped Frame

**章节ID：** `CH_11`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_11_01｜场景1｜切图 `BG20`｜BGM `M11`｜`FX_MEMORY_FLASH`

> **v11实景特效逐帧执行单｜`VFX_11_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 后台证据画面用可操作放大镜，原图像素保留。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 原片边缘被圈选时出现细线描边，禁止全屏闪屏。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 鼠标/触控轻音与电子低音。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 玩家点击原图边缘，更新case_verified。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 负责人出示原始相片时间码；Eric未经许可拍摄屏幕。 进入此场景准确切换到 `BG20`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **SUPERVISOR:** “This is the unedited original from the media storage. You can see the phone screen reflected here.”
- **NICOLE:** “And the upload came from Eric’s individual media account.”
- **ERIC:** “I didn’t think anyone would check.”
- **PLAYER (NARRATION):** “The reflection is tiny. The violation isn’t.”
- **ERIC:** “I thought if everybody saw it, Alex would know what losing feels like.”

### SCN_11_02｜场景2｜切图 `BG14`｜BGM `M11`｜`FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_11_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 办公室窗外阴天，风扇继续转动。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Eric承认时镜头稳住，不给他英雄化聚光。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** BGM停止0.4秒，纸张与呼吸清晰。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 允许要求暂停交流、交校方处理。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Eric承认并接受校内调查，不要求玩家原谅。 进入此场景准确切换到 `BG14`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “You were hurt. That doesn’t make hurting Hayden okay.”
- **ERIC:** “I know.”
- **WILLIAM:** “Knowing isn’t fixing it.”
- **SUPERVISOR:** “Your access remains frozen. Student affairs will handle the investigation.”
- **NICOLE:** “There’s one more scheduled post: their full names. Midnight.”

### SCN_11_03｜场景3｜切图 `BG21`｜BGM `M11`｜`SFX_MSG`

> **v11实景特效逐帧执行单｜`VFX_11_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 校方建筑外天气渐晴，路面依旧湿润。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 退出调查室时暖色渐回而非立即心动粒子。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 小鸟与街道氛围，轻松和弦。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 进入后续关系线前可选择休息日。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 玩家决定后由校媒负责人撤掉定时帖，手机出现完成通知。 进入此场景准确切换到 `BG21`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **SUPERVISOR:** “The scheduled post has been removed. We’re preserving the logs.”
- **PLAYER (NARRATION):** “For once, my phone buzzes with something that feels like an ending.”


### ★ 上线情绪高潮强化场｜最关键的证据不属于任何人的爱情

**互动游戏落点：** 原图对焦与记录比对；无需公开私聊内容即可完成调查。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **NICOLE:** “We’ve got the original file. You don’t owe the internet your explanation.”
- **ALEX:** “I’m sorry my past got used against you.”

**导演指令：** 看到后台时间戳，William 第一次松开一直握紧的拳头。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:提交证据，Eric 权限冻结。
- B:要求删除传播，减少公开曝光。
- C:让 Nicole 保存副本，玩家无需亲自看侵害照片。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_11_A`｜拒绝与Eric私下和解**  
玩家台词：**“I’m not ready to forgive him. I want the process to continue.”**  

角色即时回应 **ERIC**：“I understand.”  

角色即时回应 **NICOLE**：“We’ll document that.”  

存档更新：`case:investigation`

**B · `CH_11_B`｜要求他停止再联系我**  
玩家台词：**“Do not contact me again outside official channels.”**  

角色即时回应 **ERIC**：“Understood.”  

存档更新：`case:no_contact`

**C · `CH_11_C`｜允许一封书面道歉但不撤诉**  
玩家台词：**“You can send an apology to the office. It won’t erase what happened.”**  

角色即时回应 **SUPERVISOR**：“We can facilitate that without direct contact.”  

存档更新：`case:written_apology`


**自由对话 `FREE_CHAT_11`：** 聊心情、法律流程边界，不能强迫接受道歉。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** William递出剧院入场券：“I’d like you to see me offstage.”

**连续性/验收：** Eric事件有责任追究，不再制造第二幕后黑手。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_12｜重新开始，不靠镜头 / No More Cameras

**章节ID：** `CH_12`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_12_01｜场景1｜切图 `BG21`｜BGM `M12`｜`SFX_CITY_MORNING`

> **v11实景特效逐帧执行单｜`VFX_12_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 学生事务处台阶午后晴光，树叶被轻风掀动。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Nicole陪同时用稳定暖光，不出现玫瑰滤镜。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 午后风声与轻脚步。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可设公开边界：私密/有限公开/公开。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Nicole从学生事务处陪玩家出来，William带热咖啡，Alex拿水。 进入此场景准确切换到 `BG21`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **NICOLE:** “The office confirmed the scheduled post is gone. Not every screenshot, but the source has been stopped.”
- **WILLIAM:** “Coffee? I remembered you said the mornings here are brutal.”
- **ALEX:** “Water, in case you don’t want caffeine with your emotions.”
- **PLAYER (NARRATION):** “Neither tries to hand me a decision.”

### SCN_12_02｜场景2｜切图 `BG22`｜BGM `M12`｜`FX_SPLIT_CHOICE`

> **v11实景特效逐帧执行单｜`VFX_12_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 绿荫大道有飘落的轻叶片。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William与Alex各伸手递物时各自短促柔光。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 手中纸杯与水瓶碰声，舒缓BGM。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可单独接受/均拒绝/谢谢但独处。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 二人分别邀请；不再问选谁。 进入此场景准确切换到 `BG22`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “Student theater. Saturday. No cameras backstage.”
- **ALEX:** “There’s a food truck after rehearsal. I can show you the part of campus nobody posts.”
- **NICOLE:** “You can say yes to one, both on different nights, or neither. I’m still taking you for breakfast.”

### SCN_12_03｜场景3｜切图 `BG03`｜BGM `M12`｜`FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_12_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 宿舍外夕阳落在三人肩上。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 玩家说重新开始时低饱和向正常饱和恢复。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 风止一拍，轻缓钢琴进入。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 约会顺序依据状态分支，拒绝不强制推进亲密。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 夜晚手机日历，玩家可以拖拽安排约会，空档为个人时间。 进入此场景准确切换到 `BG03`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM (TEXT):** “I’ll save you a seat if you want it.”
- **ALEX (TEXT):** “I made you a playlist. I’m trying not to overthink the title.”
- **NICOLE (TEXT):** “Proud of you for making your own call.”


### ★ 上线情绪高潮强化场｜他在镜头外等你

**互动游戏落点：** 咖啡杯选项和路线安排；玩家可选择只和朋友相处。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “No cameras. No crown. Tell me what a good Saturday looks like to you.”
- **ALEX:** “My best nights aren’t big. They’re just the ones I don’t want to end.”

**导演指令：** 两人都把邀请写在纸上，留出空白让玩家自己填写时间。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:William剧场约会可用。
- B:Alex夜宵约会可用。
- C:先与 Nicole 过周末，恋爱事件顺延而不消失。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_12_A`｜安排William的剧院之夜**  
玩家台词：**“Saturday works. I want to know the person behind the applause.”**  

角色即时回应 **WILLIAM (TEXT)**：“That’s exactly who I’ve been hoping you’d meet.”  

存档更新：`date_W:scheduled,W_affection:+4`

**B · `CH_12_B`｜先听Alex的未完成歌曲**  
玩家台词：**“Send the playlist. Then let’s get food.”**  

角色即时回应 **ALEX (TEXT)**：“I’ll bring headphones. You bring an opinion that isn’t polite.”  

存档更新：`date_A:scheduled,A_affection:+4`

**C · `CH_12_C`｜给自己一晚恢复，再安排两人**  
玩家台词：**“I want a quiet night first. Then we’ll talk dates.”**  

角色即时回应 **NICOLE (TEXT)**：“Excellent choice. I’m ordering noodles.”  

存档更新：`pace:recovery,both_trust:+2`


**自由对话 `FREE_CHAT_12`：** 可以安排约会或拒绝，后续用邀请替代强制赴约。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 手机相册出现“OUR MOMENTS”空白收藏夹，等待玩家主动保存第一段记忆。

**连续性/验收：** 从悬疑阶段转向角色亲密和职业梦想。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_13｜聚光灯关掉以后 / When the Spotlight Dies

**章节ID：** `CH_13`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_13_01｜场景1｜切图 `BG23`｜BGM `M13`｜`SFX_APPLAUSE_DUCK`

> **v11实景特效逐帧执行单｜`VFX_13_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 老剧院舞台空调带动红帘，微尘可见。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William上台强聚光，走下台光线转柔。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 剧场远处鼓掌消退，鞋跟踏木台。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点舞台节目单了解W事业压力。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** William在舞台谢幕后寻找玩家，确认其是否观看；未赴约则改为分享排练录音。 进入此场景准确切换到 `BG23`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “You came. I’m glad.”
- **PLAYER (NARRATION):** “For once his smile isn’t aimed at an audience.”
- **WILLIAM:** “When the room cheers, I’m supposed to be grateful. Sometimes I just feel like a name on a poster.”
- **WILLIAM:** “Can I show you the part they never see?”

### SCN_13_02｜场景2｜切图 `BG24`｜BGM `M13`｜`FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_13_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 舞台后台暖黄镜前灯随调光变化。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William卸下公众形象时聚光圈缩小，人物眼神焦点加深。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 化妆镜碰响；原创钢琴温柔进入。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可选择问家庭/事业/今晚只陪伴。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** William关掉化妆镜前的环灯，舞台仅剩工作灯。 进入此场景准确切换到 `BG24`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “I nearly quit theater last year. I couldn’t tell whether I loved acting or being liked.”
- **PLAYER (NARRATION):** “He lifts a worn script covered in notes.”
- **WILLIAM:** “This was my first lead. I kept the pages because it was the first time I chose something for myself.”
- **WILLIAM:** “Then you came along and refused to clap on cue.”

### SCN_13_03｜场景3｜切图 `BG38`｜BGM `M13`｜`FX_PHONE_OVERLAY + SFX_MSG`

> **v11实景特效逐帧执行单｜`VFX_13_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 剧院门口夜风拉起大衣衣角。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 玩家支持时温柔心动粒子仅3-5颗、1.2秒结束。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 风声细响，BGM回到环境。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可自愿公开牵手或坚持不被拍摄。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 校媒粉丝页有人拍到两人出剧场，William先看向玩家而不是手机。 进入此场景准确切换到 `BG38`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “Someone posted us. I’m sorry. I can ask for a takedown.”
- **PLAYER (NARRATION):** “He puts his phone face down.”
- **WILLIAM:** “But first... are you okay?”


### ★ 上线情绪高潮强化场｜他为了你关掉聚光灯

**互动游戏落点：** 舞台追光小游戏；结束时必须让 William 以普通身份说脆弱。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “People applaud when I leave the stage. You’re the first person I hoped would stay.”
- **WILLIAM:** “I don’t want to impress you. I want to be someone you can call on a bad day.”

**导演指令：** 他把主灯彻底关掉，后台只剩暖黄色工作灯照着两个人。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:接受私人约会，解锁 stage_after_dark。
- B:讲自己的疲惫，William记住玩家需要被倾听。
- C:保持朋友，William仍陪同看完彩排。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_13_A`｜告诉他我喜欢不完美的他**  
玩家台词：**“You don’t have to impress me. Tell me what you want when no one is watching.”**  

角色即时回应 **WILLIAM**：“Right now? To be here a little longer.”  

存档更新：`W_vulnerable:true,W_trust:+5`

**B · `CH_13_B`｜请他教我一段台词**  
玩家台词：**“Teach me your favorite line. I want the nervous version.”**  

角色即时回应 **WILLIAM**：“You might regret asking. I’m terrible at taking direction from you.”  

存档更新：`W_shared_rehearsal:true,W_affection:+5`

**C · `CH_13_C`｜让他把手机留给自己决定**  
玩家台词：**“Let’s handle that photo together, not as a publicity problem.”**  

角色即时回应 **WILLIAM**：“Together. Not managed. I like that.”  

存档更新：`W_public_trust:+5`


**自由对话 `FREE_CHAT_13`：** 玩家可以帮他对台词、谈梦想、拒绝约会；共享记忆为第一次不靠镜头的舞台。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** William收到学校品牌大使项目的试镜邀请：条款写着“maintain a clean public image”。

**连续性/验收：** 铺垫William职业与公开选择的真实成本。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_14｜没发出去的副歌 / The Unsent Chorus

**章节ID：** `CH_14`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_14_01｜场景1｜切图 `BG25`｜BGM `M14`｜`SFX_CITY_NIGHT + FX_PUSH_IN`

> **v11实景特效逐帧执行单｜`VFX_14_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 夜间餐车招牌霓虹细微闪烁，但无强频闪。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Alex靠近时画面周边散景微放大0.3秒。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 餐车铁板滋滋、城市晚风。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点菜单选择玩家喜欢的食物并记忆。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Alex请玩家吃夜宵，只有他知道的餐车。 进入此场景准确切换到 `BG25`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “I ordered what you liked last time. If I remembered wrong, I’ll eat both.”
- **PLAYER (NARRATION):** “He smiles like he’s embarrassed to be caught remembering.”
- **ALEX:** “Don’t tell anybody I can be nice. I have a reputation to ruin slowly.”

### SCN_14_02｜场景2｜切图 `BG16`｜BGM `M14`｜`SFX_PIANO_KEY`

> **v11实景特效逐帧执行单｜`VFX_14_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 空音乐教室窗帘随夜风浮动。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 共享耳机时心动微光沿耳机线流动一次。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 共享原创旋律，左右声道轻分离，保持旁白清晰。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可点击听完/提前停/问歌词。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Alex弹奏自己写的曲子，不播放版权音乐，只有原创旋律。 进入此场景准确切换到 `BG16`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “I’ve been stuck on the chorus for six months. Everything sounds like I’m saying goodbye.”
- **PLAYER (NARRATION):** “He plays three notes, stops, and tries again.”
- **ALEX:** “When someone matters, I leave before they can. Bad habit.”
- **ALEX:** “I didn’t leave this time. That counts for something, right?”

### SCN_14_03｜场景3｜切图 `BG39`｜BGM `M14`｜`FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_14_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 雨前云遮住月亮，玻璃窗发蓝。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William消息出现时心动特效停止，切中性光显示选择。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 一声消息提示，不催促。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 玩家选择先回消息/继续陪Alex/告知稍后回复。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 屏幕展示可编辑旋律笔记，两人一起选择歌名。 进入此场景准确切换到 `BG39`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “I don’t need you to fix the song. I just want you to hear the version nobody else has heard.”
- **PLAYER (NARRATION):** “William texts: Did you get home safe? Alex notices but doesn’t touch my phone.”


### ★ 上线情绪高潮强化场｜一首歌被写成你的名字

**互动游戏落点：** 听歌并选择一句歌词；只在玩家自愿时记录共同旋律。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **ALEX:** “There’s a space in the chorus. I kept it empty because I didn’t know who belonged there.”
- **ALEX:** “I’m not asking you to fill it. I’m asking if you want to hear it.”

**导演指令：** 耳机线在两人之间轻轻晃动，窗外凌晨的路灯一个个熄灭。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:共写旋律，后续巡演歌曲可回收。
- B:只听不写，Alex仍珍惜安静陪伴。
- C:拒绝暧昧，保持音乐搭档路线。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_14_A`｜陪他完成副歌**  
玩家台词：**“Play it again. I think the ending wants to stay.”**  

角色即时回应 **ALEX**：“You heard that too? Okay. One more time.”  

存档更新：`A_song:+1,A_trust:+5`

**B · `CH_14_B`｜追问他为什么害怕留下**  
玩家台词：**“Who made you think leaving first was safer?”**  

角色即时回应 **ALEX**：“A lot of little things. None of them your fault. I’m still working on it.”  

存档更新：`A_vulnerable:true,A_trust:+5`

**C · `CH_14_C`｜告诉他今晚先做朋友也很好**  
玩家台词：**“I want to hear the song. We don’t have to define anything else tonight.”**  

角色即时回应 **ALEX**：“Good. I’m better when I’m not auditioning for your attention.”  

存档更新：`A_friendship:+5,A_trust:+3`


**自由对话 `FREE_CHAT_14`：** 可为歌曲取名、选择乐器、谈自己喜好；记忆歌曲命名。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** Alex写下一个尚未发布的歌名：“Stay Until Morning”。

**连续性/验收：** 音乐主题成为长期陪伴引擎，而非每章接吻。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_15｜在人群里找你 / I Looked for You

**章节ID：** `CH_15`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_15_01｜场景1｜切图 `BG26`｜BGM `M15`｜`SFX_DANCE_CROWD`

> **v11实景特效逐帧执行单｜`VFX_15_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 舞会灯球投下缓慢星点，群演衣物随舞步摆动。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 两男主看向玩家时各自短亮光晕，不提前判定恋人。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 舞池BGM自定义原创节奏，围观声。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 选择舞伴/自己跳/退出舞池。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 校园正式舞会，人群邀请玩家跳舞，男主未强占。 进入此场景准确切换到 `BG26`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **GUEST:** “Want to dance?”
- **WILLIAM:** “You don’t owe me the first dance.”
- **ALEX:** “I’m terrible at this music. You’d be doing me a favor if you picked someone else.”
- **PLAYER (NARRATION):** “Neither looks away when I laugh.”
- **NICOLE:** “I vote for you dancing exactly how you want.”

### SCN_15_02｜场景2｜切图 `BG26`｜BGM `M15`｜`FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_15_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 舞池边落地风扇推动发梢。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 由玩家邀约时舞台光形成三人同框但不强制牵手。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 音乐加副歌，脚步与衣料摩擦细响。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可单人/双人/拒绝邀请，镜头按参与者调整。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 舞步期间可触发人物靠近，但无强制亲密。 进入此场景准确切换到 `BG26`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “I practiced one dance step. I’m hoping you don’t ask which.”
- **ALEX:** “He practiced? I’m definitely staying to see this.”
- **WILLIAM:** “Alex, please.”
- **ALEX:** “Fine. I’ll be nice. For the length of one song.”

### SCN_15_03｜场景3｜切图 `BG46`｜BGM `M15`｜`FX_PHONE_OVERLAY + SFX_MSG`

> **v11实景特效逐帧执行单｜`VFX_15_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 侧门夜风、远处初起微雨，光滑地面反射灯光。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 偷拍照片弹窗覆盖真实人物背景，冷白光消除舞会粉色。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 远雷极轻，照片消息声仅一次。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 玩家可要求删除照片/不回应/联系管理。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 非Eric普通学生上传舞会照片，取决于玩家是否合舞。 进入此场景准确切换到 `BG46`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **FORUM POST:** “Looks like everyone’s favorite dance floor has a story.”
- **NICOLE:** “That photo wasn’t from Eric’s account. It’s a student submission. I can help request removal.”
- **ALEX:** “You want me here or somewhere quiet?”


### ★ 上线情绪高潮强化场｜在人群里，他只找你

**互动游戏落点：** 舞伴邀请；舞曲落点只能对应玩家真实选择的舞伴。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “There you are. I’ve been smiling at everyone and looking for one person.”
- **ALEX:** “I wasn’t going to dance. Then you walked in.”

**导演指令：** 舞厅里的闪灯在玩家身后形成光环，若玩家拒绝，二人不追赶。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:与 William 跳舞设置 W_dance，第二天提起你的步伐。
- B:与 Alex 跳舞设置 A_dance，解锁专属录音。
- C:与 Nicole 跳舞，获得友情高光并避免偷拍亲密。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_15_A`｜和William跳一曲**  
玩家台词：**“One song. And I want to see that one step.”**  

角色即时回应 **WILLIAM**：“I was hoping you’d ask.”  

存档更新：`dance:William,W_affection:+4`

**B · `CH_15_B`｜和Alex去舞池**  
玩家台词：**“Dance badly with me. I promise not to tell.”**  

角色即时回应 **ALEX**：“I am making no promises about my terrible dancing.”  

存档更新：`dance:Alex,A_affection:+4`

**C · `CH_15_C`｜和朋友们一起跳，不选人**  
玩家台词：**“Everyone gets one song. No rankings.”**  

角色即时回应 **NICOLE**：“Now that’s the right kind of chaos.”  

存档更新：`dance:group,both_trust:+3`


**自由对话 `FREE_CHAT_15`：** 谈舞蹈、社交压力、拒绝身体接触；可以离开舞会。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 舞会散场，William走到玩家宿舍门前，停在一步之外。

**连续性/验收：** 舞会照片以实际选择生成，不允许未共舞却出现三人共舞照片。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_16｜雨停之前 / Before the Rain Stops

**章节ID：** `CH_16`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_16_01｜场景1｜切图 `BG28`｜BGM `M16`｜`SFX_RAIN + FX_PUSH_IN`

> **v11实景特效逐帧执行单｜`VFX_16_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 门廊外中雨在屋檐形成水线，地面有溅起水滴。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William衣领带水珠，人物脸保留自然皮肤，心动柔光小范围。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 中雨-23dB，雨棚滴水，远雷。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点击“靠近/保持距离/回屋檐内”不自动吻。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** William送玩家到宿舍门口，雨水打湿肩膀。 进入此场景准确切换到 `BG28`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “It was a good night, even with the terrible dancing.”
- **PLAYER (NARRATION):** “Rain slips off his hair. He doesn’t move closer.”
- **WILLIAM:** “I keep thinking about what I almost said onstage.”
- **WILLIAM:** “I’m not asking you to choose me. I’m asking if I can come back tomorrow.”

### SCN_16_02｜场景2｜切图 `BG29`｜BGM `M16`｜`FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_16_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 宿舍门内暖光与外面冷雨构成双温差。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 自愿亲吻时心形粒子仅在背景周围升起0.8秒；拒绝无粒子。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 雨声降至-30dB，心跳两下，停顿留给玩家。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 先询问意愿，再呈现进一步/只抱抱/停下。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 若玩家同意进入门廊室内才切BG29，否则保持外景人物构图。 进入此场景准确切换到 `BG29`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “You have this way of making me forget the version of myself everyone expects.”
- **PLAYER (NARRATION):** “He looks at the door, then back at me.”
- **WILLIAM:** “Can I kiss you? It’s okay if the answer is no.”

### SCN_16_03｜场景3｜切图 `BG30`｜BGM `M16`｜`SFX_FOOTSTEPS`

> **v11实景特效逐帧执行单｜`VFX_16_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 楼梯侧门被阵风吹开，细雨从外面飘进。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Alex出现时亲密柔光立即淡出，冷色但不恐怖。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 门吱呀、雨落台阶，BGM断拍。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 不要默认玩家和William接吻；根据旗标重写目击内容。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Alex带来遗失的外套，目睹靠近或聊天的实际状态。 进入此场景准确切换到 `BG30`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “You left this at the dance.”
- **PLAYER (NARRATION):** “He takes in the scene without asking for details.”
- **ALEX:** “I didn’t mean to interrupt.”
- **WILLIAM:** “You didn’t do anything wrong.”
- **ALEX:** “Good. I’d hate to make a hobby of it.”


### ★ 上线情绪高潮强化场｜大雨里，他先把伞递给你

**互动游戏落点：** 雨夜靠近/拥抱/告别；雨幕在玻璃外，人物真实湿发。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “I came here to tell you I’m jealous. But that’s not your problem to fix.”
- **WILLIAM:** “What I really want is to know you got home warm.”

**导演指令：** 他将自己的外套垫在潮湿的长椅上，自己站进雨里等你的回答。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:自愿接吻后标记 W_kiss 与 porch_kiss，心动一次。
- B:只拥抱后只记 W_hug，Alex不能说看到接吻。
- C:保持距离，William送伞离开，玩家不掉好感。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_16_A`｜允许William的吻**  
玩家台词：**“Yes. Just a kiss.”**  

角色即时回应 **WILLIAM**：“Just a kiss. I’ll remember that.”  

存档更新：`kiss_W:yes,W_affection:+5`

**B · `CH_16_B`｜选择长谈**  
玩家台词：**“Stay and talk. I want to know the hard parts of your day.”**  

角色即时回应 **WILLIAM**：“That’s somehow more terrifying. Okay.”  

存档更新：`kiss_W:no,W_trust:+6`

**C · `CH_16_C`｜礼貌结束今晚**  
玩家台词：**“I had a good time. I need the rest of the night to myself.”**  

角色即时回应 **WILLIAM**：“Then I’ll say good night properly. Good night.”  

存档更新：`kiss_W:no,pace:slow,W_trust:+3`


**自由对话 `FREE_CHAT_16`：** 玩家可取消吻、谈职业、决定是否追Alex；后续不惩罚拒绝。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** Alex把外套放下走向楼梯，玩家收到他的消息：“Are we okay?”

**连续性/验收：** 任何亲密须由选择确定，Alex误解来自现场信息不是强写吻。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_17｜不是备选 / Not Your Second Choice

**章节ID：** `CH_17`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_17_01｜场景1｜切图 `BG30`｜BGM `M17`｜`SFX_FOOTSTEPS + FX_PUSH_IN`

> **v11实景特效逐帧执行单｜`VFX_17_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 夜雨转大，楼梯扶手和玻璃上有水滴；人物走动带湿足迹。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Alex转身时闪电**只在窗外**勾边0.15秒；低闪模式用环境亮度变化。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 闪电后2.2秒远雷、鞋声。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 选择追上解释/先让Alex静一静/用手机发信息。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Alex在楼梯拐角停步，William不尾随。 进入此场景准确切换到 `BG30`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “I know you can see whoever you want. That isn’t the problem.”
- **ALEX:** “The problem is how often I’m standing in a doorway, wondering if I’m an afterthought.”
- **PLAYER (NARRATION):** “He twists the silver ring once.”
- **ALEX:** “I like you enough to say something embarrassing: I want to be wanted on purpose.”

### SCN_17_02｜场景2｜切图 `BG31`｜BGM `M17`｜`FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_17_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 雨廊有阵风，Alex黑发被吹起几缕。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 玩家坦诚时人物冷光转自然暖光；若拥抱同意则短心动光。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 雨声压低；语音清晰。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可道歉、提出独处、请求拥抱；不可用吻堵住矛盾。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 从楼梯走到台阶，保持安全距离给玩家回答。 进入此场景准确切换到 `BG31`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “I don’t need a promise tonight. I need a real answer when you do have one.”
- **ALEX:** “And if you don’t want this, I’d rather know than spend another month guessing.”
- **PLAYER (NARRATION):** “He waits. No sarcasm left to hide behind.”

### SCN_17_03｜场景3｜切图 `BG33`｜BGM `M17`｜`SFX_MSG`

> **v11实景特效逐帧执行单｜`VFX_17_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 雨逐渐减弱，门口仍有风声。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William看见时只用视线静止与景深，禁止强制狗血黑化。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 轻脚步突然停；0.6秒无BGM。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 按前文接触方式（谈话/抱抱/吻）生成不同William反应。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** William短信主动询问玩家是否需要空间，不抢夺场面。 进入此场景准确切换到 `BG33`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM (TEXT):** “I’m back at my place. Take the time you need.”
- **PLAYER (NARRATION):** “For once, there’s no audience. Only what I choose to say.”


### ★ 上线情绪高潮强化场｜你追上他，他没有要求你选边站

**互动游戏落点：** 雨中追人只决定是否谈话，不强制接吻。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **ALEX:** “I’m not asking you to choose me tonight. I’m asking you not to ask me to pretend I feel nothing.”
- **ALEX:** “If you want me as a friend, tell me. I can learn how to be that.”

**导演指令：** 一道远雷过后 Alex 没再开口，只把手里的干毛巾递过来。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:坦诚心动，开启 Alex 慢热路线。
- B:道歉误解，修复信任但不默认亲密。
- C:选择友情，设置 Alex_friend_only 并保护后续剧情。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_17_A`｜主动告诉Alex我认真在意他**  
玩家台词：**“I came after you because I wanted to. Not because William left.”**  

角色即时回应 **ALEX**：“Then I can stay a little longer.”  

存档更新：`A_trust:+6,A_affection:+4`

**B · `CH_17_B`｜承认目前还不能给予承诺**  
玩家台词：**“I care about you. I can’t promise exclusivity right now.”**  

角色即时回应 **ALEX**：“Thank you for being clear. I’ll decide what I can do with that.”  

存档更新：`A_trust:+4,A_boundary:heard`

**C · `CH_17_C`｜表示先退回朋友**  
玩家台词：**“I don’t want to keep you waiting. I’d rather protect our friendship.”**  

角色即时回应 **ALEX**：“That hurts. But I’d rather keep something honest than fake something bigger.”  

存档更新：`A_romance:paused,A_trust:+3`


**自由对话 `FREE_CHAT_17`：** 可讨论对等、亲密需求，不能让Alex无限期等待。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** Alex把一只共享耳机留给玩家：“I finished the first half. Hear the rest when you’re ready.”

**连续性/验收：** 推进Alex非竞争式脆弱表达；不以吻阻止离开。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_18｜牵着你的手穿过人群 / In Plain Sight

**章节ID：** `CH_18`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_18_01｜场景1｜切图 `BG32`｜BGM `M18`｜`SFX_CAMPUS_AMBIENT`

> **v11实景特效逐帧执行单｜`VFX_18_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 上午雨后树叶还滴水，地面有反光水坑。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William坦白嫉妒时镜头固定1秒，不搞霸总压迫镜头。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 早鸟叫和咖啡店低声。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 玩家可直接询问承诺是什么。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** William与玩家在校园散步，问上次雨夜是否舒服。 进入此场景准确切换到 `BG32`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “I wanted to check in about the other night. Not because I need an answer. Because I don’t want you feeling cornered.”
- **WILLIAM:** “I’ve spent years letting other people decide what my gestures mean. I’d like to do something because I mean it.”
- **PLAYER (NARRATION):** “He stops under the trees where students pass on both sides.”

### SCN_18_02｜场景2｜切图 `BG41`｜BGM `M18`｜`FX_SOFT_GLOW + FX_PUSH_IN`

> **v11实景特效逐帧执行单｜`VFX_18_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 步道晴光破云，微风推起外套下摆。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** **玩家主动**牵手则微小花瓣飘落+手部高光；拒绝则纯风景。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 风铃、原创柔弦。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** “牵手/并肩/保持距离”三种动作图层。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** William伸手等玩家自己决定，不预设牵手。 进入此场景准确切换到 `BG41`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “Would you like to hold my hand? We can take the quiet path if you’d rather avoid pictures.”
- **PLAYER (NARRATION):** “His hand stays open. It doesn’t reach for mine.”

### SCN_18_03｜场景3｜切图 `BG46`｜BGM `M18`｜`FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_18_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 论坛新照由路人拍摄，天气持续转晴。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 消息出现时花瓣终止，UI保持可点击。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 单次快门回响+消息音。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 选择要求删帖/暂不理会/与Alex解释，不强制公开。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 若同意公开牵手则普通粉丝照出现，否则论坛只有并行走路。 进入此场景准确切换到 `BG46`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **FORUM POST:** “William spotted with the new transfer again.”
- **WILLIAM:** “I saw it. I won’t correct your feelings for you.”
- **WILLIAM:** “If you’d like, I’ll ask them to remove the photo. If not, I’ll still stand beside you.”


### ★ 上线情绪高潮强化场｜不靠宣言的公开偏爱

**互动游戏落点：** 牵手需主动确认，论坛照片按实际动作发生。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “I would take your hand in a room full of people. I’ll also let go the second you ask.”
- **WILLIAM:** “I want the ordinary parts, too. Bad coffee. Late buses. You stealing my hoodie.”

**导演指令：** William 向玩家伸出手，停在半空，没有自行握上去。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:牵手设置 W_handhold=true，可出现真实街拍。
- B:并肩散步不牵手，街拍只能是同行。
- C:只在私下相处，William选择保护隐私。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_18_A`｜公开牵手**  
玩家台词：**“I’d like the world to see us walking together.”**  

角色即时回应 **WILLIAM**：“Then let them see me smiling for once without a script.”  

存档更新：`W_public:+6,handhold:true`

**B · `CH_18_B`｜走安静的小路**  
玩家台词：**“I want you, not a public announcement.”**  

角色即时回应 **WILLIAM**：“Then this is ours. No audience.”  

存档更新：`W_trust:+5,public:private`

**C · `CH_18_C`｜先不牵手但接受陪伴**  
玩家台词：**“Walk with me. No labels yet.”**  

角色即时回应 **WILLIAM**：“Best offer I’ve had all day.”  

存档更新：`W_trust:+4,handhold:false`


**自由对话 `FREE_CHAT_18`：** 讨论公开与私下恋爱界线；William自发尊重。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** Alex看到粉丝页，给玩家发送：“I’d rather hear what happened from you.”

**连续性/验收：** 不固定“Alex出局”的舆论字样，保留玩家选择的后果。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_19｜你来找我 / You Came for Me

**章节ID：** `CH_19`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_19_01｜场景1｜切图 `BG16`｜BGM `M19`｜`SFX_PIANO_KEY`

> **v11实景特效逐帧执行单｜`VFX_19_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 音乐室薄云遮光，窗帘顺风向轻动。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Alex听到“来找你”时眼神焦点柔化，细微光点0.5秒。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 钢琴低音琴键与脚步。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可点半成曲主题，写入长期共享记忆。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Alex在练琴房，玩家可按关系状态选择谈约会或友情。 进入此场景准确切换到 `BG16`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “You came. I wasn’t sure you would.”
- **PLAYER (NARRATION):** “The melody is familiar, but the last note has changed.”
- **ALEX:** “I rewrote the ending. It used to sound like the door closing.”
- **ALEX:** “Now it sounds like somebody might knock.”

### SCN_19_02｜场景2｜切图 `BG34`｜BGM `M19`｜`FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_19_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 室内夜光逐渐偏暖，钢琴旁纸张被风吹动。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 玩家主动握手时才出现心动波纹，未握手无心形。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 原创琴旋律只播4小节循环。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可选择只聆听、伸手或先解释。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 音乐停止后展开坦诚对话。 进入此场景准确切换到 `BG34`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “I saw the photo. I don’t need the internet to tell me what you feel.”
- **ALEX:** “I do need you to tell me what I should expect from us.”
- **PLAYER (NARRATION):** “He slides over one headphone. The other stays in his ear.”

### SCN_19_03｜场景3｜切图 `BG33`｜BGM `M19`｜`SFX_FOOTSTEPS`

> **v11实景特效逐帧执行单｜`VFX_19_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 门边人影挡住走廊灯光。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William出现时音乐一拍停，三人画面焦点重新均匀。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 门把转动与两人呼吸。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 依据是否握手显示William不同台词，不把见面等于背叛。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** William敲门，主动询问是否方便进入而非当场抓包。 进入此场景准确切换到 `BG33`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “Sorry. I was dropping off a rehearsal file. Is now a bad time?”
- **ALEX:** “Depends. Are you here to ask or announce?”
- **WILLIAM:** “Ask. Always ask.”
- **PLAYER (NARRATION):** “Both look to me. For once, the pause is mine.”


### ★ 上线情绪高潮强化场｜他记得你第一次听过的歌

**互动游戏落点：** 音乐室互动读此前 secret_melody；没有记忆时另写台词。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **ALEX:** “You remembered the song I couldn’t finish. Nobody has ever done that.”
- **ALEX:** “I don’t need to win against him. I need to know whether you see me.”

**导演指令：** 如果玩家从没听过歌曲，Alex改说：“I wanted you to be the first to hear this.” 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:选择陪他完成曲子，第二季开放录音。
- B:说明仍不确定，Alex设置等待边界。
- C:友情互动不触发失落追吻。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_19_A`｜坦诚告诉Alex自己对他有感觉**  
玩家台词：**“I came because I missed talking to you. Not because of a picture.”**  

角色即时回应 **ALEX**：“I can work with that. Better than a dozen promises.”  

存档更新：`A_affection:+5,A_trust:+4`

**B · `CH_19_B`｜明确先保持朋友关系**  
玩家台词：**“I care about you. I want us to keep making music, even if romance changes.”**  

角色即时回应 **ALEX**：“Music stays. I’m glad you said it.”  

存档更新：`A_friendship:+5`

**C · `CH_19_C`｜请两人一起谈清楚**  
玩家台词：**“William, come in. We all deserve a conversation, not guesses.”**  

角色即时回应 **WILLIAM**：“If everyone is comfortable, I’m here.”  

角色即时回应 **ALEX**：“Okay. Let’s speak plainly.”  

存档更新：`threeway_talk:started,both_trust:+3`


**自由对话 `FREE_CHAT_19`：** 允许明确拒绝一人、谈音乐、安排单独交谈。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 三人坐在同一张琴凳附近，准备第一次不由论坛主持的关系谈话。

**连续性/验收：** 向CH20回流，但不得自动指定同意亲密。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_20｜灯熄之前 / Until the Lights Go Out

**章节ID：** `CH_20`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_20_01｜场景1｜切图 `BG34`｜BGM `M20`｜`SFX_PIANO_KEY + FX_PUSH_IN`

> **v11实景特效逐帧执行单｜`VFX_20_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 音乐教室窗外夜风轻，玻璃上有树影。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 三人同框时分别以冷暖边光表现，但不自动画爱心。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 空调与远处风，柔和琴音。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 先问各自可接受的关系边界。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 三人坐在音乐教室，琴盖合起。 进入此场景准确切换到 `BG34`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “I like you. I’m not going to pretend I’m above jealousy.”
- **ALEX:** “I like you too. And I’m done letting people guess what I mean.”
- **WILLIAM:** “I don’t want a competition.”
- **ALEX:** “Neither do I.”
- **PLAYER (NARRATION):** “I can hear the air conditioner between their words.”

### SCN_20_02｜场景2｜切图 `BG35`｜BGM `M20`｜`FX_SPLIT_CHOICE`

> **v11实景特效逐帧执行单｜`VFX_20_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 室内灯光被关小，走廊应急灯透入。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 仅在玩家允许靠近时启用缓慢心动光，拒绝始终自然灯。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 心跳2拍而非循环，音乐留空一拍。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 每个人的同意分开确认；三人不能被一键自动同意。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 走廊灯变暗，讨论未来形式，不强制三人亲密。 进入此场景准确切换到 `BG35`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “What would feel honest for you right now?”
- **ALEX:** “And what would feel honest for us? Those might be different answers.”
- **WILLIAM:** “Then we keep talking until they fit—or admit they don’t.”
- **PLAYER (NARRATION):** “No one reaches for me before I respond.”

### SCN_20_03｜场景3｜切图 `BG34`｜BGM `M20`｜`SFX_SHUTTER + FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_20_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 门外快门，光照只来自真实闪光灯。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 快门后镜头稍冷，三人动势停顿0.25秒。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 快门短响，论坛消息落地。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 允许报告偷拍；快门来源不重启Eric幕后线。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 走廊普通学生偷拍到三人离开音乐教室的场面，不捕捉私密行为。 进入此场景准确切换到 `BG34`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **NICOLE (TEXT):** “Another post. Not Eric, as far as the admin can tell. Want me to request a takedown?”
- **ALEX:** “I’m tired of letting an app narrate us.”
- **WILLIAM:** “Tomorrow we can decide what matters outside the room.”


### ★ 上线情绪高潮强化场｜三个人第一次不再争夺话语权

**互动游戏落点：** 面对面协商；展示真实需求而不是数值排行榜。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “I can be patient. I can’t be invisible.”
- **ALEX:** “I can share a conversation. I won’t share a promise nobody agreed to.”

**导演指令：** 玩家说话时两人都停止互相看，真正注视玩家。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:开启非排他了解期需三方同意。
- B:只与一人探索，另一人接受并调整生活。
- C:停止恋爱探索，后续改友情与校园主线。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_20_A`｜先分别约会再决定**  
玩家台词：**“I want time with each of you without turning it into a contest.”**  

角色即时回应 **WILLIAM**：“That makes sense.”  

角色即时回应 **ALEX**：“Then let’s make those dates worth having.”  

存档更新：`route:nonexclusive_dating`

**B · `CH_20_B`｜表达倾向某一人**  
玩家台词：**“I’m leaning toward one of you, but I need to be honest before I call it a promise.”**  

角色即时回应 **WILLIAM**：“Then say it when you’re ready.”  

角色即时回应 **ALEX**：“I’d rather know the truth than be kept warm.”  

存档更新：`route:leaning`

**C · `CH_20_C`｜暂时不谈恋爱**  
玩家台词：**“I need room to breathe. I don’t want anyone waiting on a maybe.”**  

角色即时回应 **ALEX**：“I respect that.”  

角色即时回应 **WILLIAM**：“We can still be friends if you want.”  

存档更新：`route:friendship`


**自由对话 `FREE_CHAT_20`：** 可讨论不排他、排他、友情；按个人意愿启用CH21约会规则。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** William与Alex同时发送不同地点的约会邀请，玩家打开日历。

**连续性/验收：** 非排他关系需将各自知情同意作为后续验证，不设默认三人恋。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_21｜十天的约定 / Ten Days, No Scoreboard

**章节ID：** `CH_21`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_21_01｜场景1｜切图 `BG36`｜BGM `M21`｜`FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_21_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 图书馆大窗午后飘落叶片，桌上备忘录可见。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 协商完成时轻柔光上升，不是恋爱确定特效。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 纸翻动、铅笔、静谧音乐。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点击备忘录逐条同意，条款可拒绝或修改。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 三人在图书馆讨论关系选择，桌上摆日期卡而不是协议合同。 进入此场景准确切换到 `BG36`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “Ten days. Not a test we have to pass. Just time to see how we actually live.”
- **ALEX:** “I’m okay with dating separately, but I need to know if something changes. Not details. Just what that means for us.”
- **WILLIAM:** “Agreed. And nothing gets posted without asking.”
- **ALEX:** “Anyone can change their mind. Including me.”
- **PLAYER (NARRATION):** “It feels less like a contract than an invitation to be human.”

### SCN_21_02｜场景2｜切图 `BG37`｜BGM `M21`｜`FX_DRAG_CALENDAR + SFX_TAP`

> **v11实景特效逐帧执行单｜`VFX_21_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 人物在同一桌边不同距离，窗外晴光。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 玩家对谁注视则对应轻微浅景深。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 笔点击与温柔低音弦乐。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 试用约会优先级可编辑，拒绝不锁主剧情。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 交互日历可拖动约会卡和留白个人时间，不强制十天内两个男主都亲密。 进入此场景准确切换到 `BG37`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **NICOLE (TEXT):** “Remember to schedule something for yourself. You’re a person, not a calendar app.”
- **WILLIAM (TEXT):** “I’ll make dinner if you want a night without a crowd.”
- **ALEX (TEXT):** “I’m taking you to the record store. Maybe I’ll let you pick a bad album.”

### SCN_21_03｜场景3｜切图 `BG36`｜BGM `M21`｜`FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_21_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 日历从下方弹出，两个邀约同时显示。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 碰撞日期才显示小红点，不误称吃醋。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 两声通知相隔0.5秒。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 拖拽日期改约，有替代路线。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 对日程做第一次确认。 进入此场景准确切换到 `BG36`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “You can reschedule. You can decline. I just want honesty.”
- **ALEX:** “And I want to know you can come to me without an emergency to fix.”
- **PLAYER (NARRATION):** “Two people asking for real time. A choice that might actually change tomorrow.”


### ★ 上线情绪高潮强化场｜不是竞赛，是十天的认真

**互动游戏落点：** 日程选择游戏；不显示谁领先，只显示约定与愿望。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “Give me one evening where we don’t have to prove anything.”
- **ALEX:** “And I’ll give you one song I’m too afraid to play for anybody else.”

**导演指令：** 玩家把十天的约会安排放进日历，三个名字并非自动绑定。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:与 William 约定一天，记录日期。
- B:与 Alex 约定一天，记录日期。
- C:选择独处日，触发 Nicole 生活支线。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_21_A`｜先约William**  
玩家台词：**“Let’s start at the theater. I want to see your world.”**  

角色即时回应 **WILLIAM**：“Then I’ll show you the messy parts too.”  

存档更新：`calendar:first_W,W_affection:+4`

**B · `CH_21_B`｜先约Alex**  
玩家台词：**“Record store first. I’m judging your taste in music.”**  

角色即时回应 **ALEX**：“Brave words. I’m bringing the worst album I own.”  

存档更新：`calendar:first_A,A_affection:+4`

**C · `CH_21_C`｜安排两人和自己的时间**  
玩家台词：**“I want separate dates and a day that belongs only to me.”**  

角色即时回应 **WILLIAM**：“That sounds healthy.”  

角色即时回应 **ALEX**：“I can live with that.”  

存档更新：`calendar:balanced,both_trust:+3`


**自由对话 `FREE_CHAT_21`：** 可以调换日期、设定节奏，保留个人活动。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** Nicole推送学校品牌大使竞选公告：William获最终面试资格。

**连续性/验收：** 十天是自主安排阶段，不是“谁亲到谁赢”游戏。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_22｜卸下王冠的夜晚 / William Offstage

**章节ID：** `CH_22`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_22_01｜场景1｜切图 `BG38`｜BGM `M22`｜`SFX_DRESSING_ROOM + FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_22_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 剧院化妆镜灯光暖，红色绒帘随风移动。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William卸下领结时光由舞台强光转普通暖光。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 远处散场声与衣架声。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可主动问他怕失去什么。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** William带玩家参观试镜后台，镜前贴满便签。 进入此场景准确切换到 `BG38`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “The scholarship and the ambassador role would pay for my last year.”
- **WILLIAM:** “The team also wants me to look uncomplicated in public.”
- **PLAYER (NARRATION):** “He pulls the medal ribbon from his collar and folds it away.”
- **WILLIAM:** “I’m afraid they’ll choose the poster instead of me.”

### SCN_22_02｜场景2｜切图 `BG24`｜BGM `M22`｜`FX_PUSH_IN`

> **v11实景特效逐帧执行单｜`VFX_22_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 空舞台微尘飘浮，舞台灯只照两人。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 自愿靠近时半透明金色心动粒子1秒，停止按钮随时可见。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 原创钢琴柔主题，心跳仅确认动作后出现。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 亲吻/拥抱/不碰触均有专属台词。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 剧场舞台上，William朗读自己改写的戏剧独白，不引用已有版权台词。 进入此场景准确切换到 `BG24`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “I used to think love meant being applauded when you got every line right.”
- **WILLIAM:** “But the person I want to come home to should see me miss a line and stay anyway.”
- **PLAYER (NARRATION):** “He laughs at himself, then looks at me with an unguarded face.”

### SCN_22_03｜场景3｜切图 `BG43`｜BGM `M22`｜`SFX_MSG`

> **v11实景特效逐帧执行单｜`VFX_22_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 剧院外夜风带一点雨味，但此时不下雨。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Alex来信时温柔光退去，人物反应根据承诺状态。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 汽车远声+单次短信提示。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 选择回复Alex或次日再说；真实记录承诺。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 招聘团队要求他发布单身形象采访，他拒绝替玩家表态。 进入此场景准确切换到 `BG43`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **TEAM (TEXT):** “Please avoid speculation about your private relationships before final selection.”
- **WILLIAM:** “I can refuse to discuss you. I won’t deny you without asking.”
- **WILLIAM:** “What’s yours stays yours, even if the rest gets complicated.”


### ★ 上线情绪高潮强化场｜舞台空了，他反而更真诚

**互动游戏落点：** William专属夜晚；不自动吻，加入主动替玩家解决真实困难的行动。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “I cancelled the interview. They wanted a story about us. I wanted an evening with you.”
- **WILLIAM:** “You don’t have to be the most interesting thing in the room. You’re allowed to be tired with me.”

**导演指令：** William 把手机调成免打扰，认真听玩家说完一整段心事。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:选择约会与吻，需要明确双向同意。
- B:选择慢慢了解，解锁深夜电话而不是吻。
- C:选择友情，William继续提供校园支持。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_22_A`｜支持他表达真实自己**  
玩家台词：**“Take the interview as yourself. You don’t owe them a fake life.”**  

角色即时回应 **WILLIAM**：“I didn’t realize how badly I needed to hear that.”  

存档更新：`W_career_integrity:+5,W_trust:+5`

**B · `CH_22_B`｜帮他排练并分析风险**  
玩家台词：**“Let’s practice what you can say without revealing my life.”**  

角色即时回应 **WILLIAM**：“Okay. You’re officially my toughest director.”  

存档更新：`W_rehearsal:true,W_trust:+4`

**C · `CH_22_C`｜明确不想被卷入公开项目**  
玩家台词：**“I respect your career. Keep me out of their publicity.”**  

角色即时回应 **WILLIAM**：“Absolutely. I can do this without borrowing your name.”  

存档更新：`W_public_boundary:true,W_trust:+4`


**自由对话 `FREE_CHAT_22`：** 可排练采访、聊经济现实和野心；不以恋爱阻碍事业。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** William递来一个手写剧场座位号：“For the night I finally tell the truth.”

**连续性/验收：** 职业机会与亲密选择发生长期冲突，非虚假“放弃一切”爽点。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_23｜只给你听的未完成曲 / The Song Only You Hear

**章节ID：** `CH_23`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_23_01｜场景1｜切图 `BG44`｜BGM `M23`｜`SFX_VINYL + FX_PUSH_IN`

> **v11实景特效逐帧执行单｜`VFX_23_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 深夜餐车小雨落在雨棚，霓虹在水面流动。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Alex转头时一束冷紫轮廓光略亮。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 雨棚滴答+厨房铁板。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 玩家可选菜单与分享音乐。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 唱片店，Alex将两张原创封面草图交给玩家选择。 进入此场景准确切换到 `BG44`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “This is where I come when everything online gets too loud.”
- **ALEX:** “The owner lets me play demos after closing. Most of them are terrible.”
- **OWNER:** “Only the ones he shows other people.”
- **ALEX:** “Traitor.”
- **PLAYER (NARRATION):** “He laughs with his whole face. It’s new.”

### SCN_23_02｜场景2｜切图 `BG39`｜BGM `M23`｜`SFX_PIANO_KEY + FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_23_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** Alex宿舍窗玻璃雨滴细滑、卧室温光。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 共同听曲时若已有授权亲密则软心动光，非亲密模式保持纯温暖。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 原创唱片底噪与钢琴动机，不用现有歌曲。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可听半曲/谈歌词/保持安静。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Alex在宿舍放原创demo，没有任何已有歌曲片段。 进入此场景准确切换到 `BG39`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “I sent the recording to a small label. They want me in another city for a residency.”
- **ALEX:** “I haven’t told anyone. I didn’t want the first thing you thought to be that I’m leaving.”
- **PLAYER (NARRATION):** “His ring taps once on the desk.”
- **ALEX:** “I’m not going to turn down the chance. But I want to know if we can talk about what it means.”

### SCN_23_03｜场景3｜切图 `BG40`｜BGM `M23`｜`FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_23_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 清晨雨止窗边白光，Alex衣物在椅背。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 温柔回忆点亮共享记忆卡；没有发生的亲密不回放。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 鸟叫、咖啡水壶。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 根据实际留宿/未留宿显示不同后续，不强制床戏。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 第二天晨光，短信写下演出试听日期。 进入此场景准确切换到 `BG40`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX (TEXT):** “I’ve got a date for the residency interview. I’m scared, which is incredibly annoying.”
- **PLAYER (NARRATION):** “For the first time he doesn’t hide what matters.”


### ★ 上线情绪高潮强化场｜他把最脆弱的那首歌只给你听

**互动游戏落点：** 歌声/耳机/触摸选择；亲密必须解锁且可退出。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **ALEX:** “My scholarship offer came today. I should be happy. I’m terrified it means leaving you.”
- **ALEX:** “I was going to hide the letter. I don’t want to start doing that with you.”

**导演指令：** Alex 把外校录取邮件放到玩家面前，不把选择权当成负担丢给玩家。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:支持他追梦，长距离信任上升。
- B:讨论共同安排，解锁异地路线计划。
- C:只以朋友支持，Alex仍将歌曲送给玩家。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_23_A`｜鼓励他追求音乐**  
玩家台词：**“Take the residency. I want to see who you become.”**  

角色即时回应 **ALEX**：“I was hoping you’d say that. Not because I need permission—because I want you on my side.”  

存档更新：`A_career:+5,A_trust:+5`

**B · `CH_23_B`｜坦白异地担忧**  
玩家台词：**“I’m happy for you. I’m also scared of what distance might do.”**  

角色即时回应 **ALEX**：“Me too. We can be scared and still make a plan.”  

存档更新：`A_distance_plan:true,A_trust:+5`

**C · `CH_23_C`｜先确定友情与支持**  
玩家台词：**“Whatever happens romantically, I want to hear the finished song.”**  

角色即时回应 **ALEX**：“Then you’ll get the first finished recording.”  

存档更新：`A_friendship:+4,A_song:+1`


**自由对话 `FREE_CHAT_23`：** 可以设计封面、完成歌词或讨论异地；不强制留宿。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** William问玩家是否有时间谈一件影响他们公开身份的事。

**连续性/验收：** Alex的职业选择独立于恋爱，成为长线音乐活动入口。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_24｜把真话说给对的人 / The Truth We Share

**章节ID：** `CH_24`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_24_01｜场景1｜切图 `BG41`｜BGM `M24`｜`SFX_CITY_MORNING`

> **v11实景特效逐帧执行单｜`VFX_24_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 晨光窗上残余水珠，风轻摇窗帘。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Hayden坦诚时光从侧背转正面，不发心形。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 咖啡声与谈话留白。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 选择公开哪些关系信息，不能泄露私密细节。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** William坦白自己看到校园谣言，要求直接沟通而非报告彼此私密内容。 进入此场景准确切换到 `BG41`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “I saw a post about you and Alex. I don’t want details that aren’t mine.”
- **WILLIAM:** “I do want to know whether you’re still comfortable with how we’re dating.”
- **PLAYER (NARRATION):** “He keeps his coffee between both hands.”
- **WILLIAM:** “I like you enough to be jealous. I respect you enough not to turn it into a question you can’t answer.”

### SCN_24_02｜场景2｜切图 `BG37`｜BGM `M24`｜`FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_24_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 校园石桥风吹起William围巾。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William承认嫉妒时短暂失焦再恢复，不加恐惧音。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 桥下流水+风。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可安抚、提出界限、暂不回应。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 选择关系状态卡：still exploring / leaning / taking space。 进入此场景准确切换到 `BG37`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “If anything changes, please tell me directly.”
- **ALEX (TEXT):** “I’d like to know our plans for next week too. No rush, just honesty.”
- **PLAYER (NARRATION):** “For once the hardest thing isn’t saying what I want. It’s saying what I can offer.”

### SCN_24_03｜场景3｜切图 `BG22`｜BGM `M24`｜`FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_24_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 校园粉丝页叠在真实街景上。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 未经同意拍摄时中性冷光+通知图层，不重复刺激。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 一声轻快门远响、手机提示。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可申诉、忽略、约定公开程度。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Nicole短暂出现，提醒玩家两个男主并非游戏分数。 进入此场景准确切换到 `BG22`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **NICOLE:** “You can care about two people and still need to make a decision. You can also choose nobody.”
- **NICOLE:** “Just don’t use confusion as an excuse to stop being kind.”


### ★ 上线情绪高潮强化场｜真正的坦诚不是交代每个吻

**互动游戏落点：** 关系变化说明；玩家无需泄露他人亲密细节。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “I’m jealous. I’m working on it. I still want to hear about your day.”
- **ALEX:** “You don’t have to report your body to anyone. Tell me what you want this relationship to be.”

**导演指令：** 校园论坛又跳出帖子，玩家第一次可以选择直接关掉屏幕。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:当面说清关系进度，信任增加。
- B:先处理隐私与流言，公开度减少。
- C:暂时暂停情感关系，双方尊重。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_24_A`｜明确仍处探索阶段**  
玩家台词：**“I’m still getting to know both of you. I haven’t made an exclusive promise.”**  

角色即时回应 **WILLIAM**：“Thank you. I can decide what that means for me.”  

存档更新：`status:exploring,W_trust:+4`

**B · `CH_24_B`｜坦承自己已倾向其一**  
玩家台词：**“I think my feelings are changing. I want to be truthful before I label anything.”**  

角色即时回应 **WILLIAM**：“That’s hard to hear, and worth hearing.”  

存档更新：`status:leaning,W_trust:+5`

**C · `CH_24_C`｜暂停约会梳理情绪**  
玩家台词：**“I need a short pause from dates so nobody feels misled.”**  

角色即时回应 **WILLIAM**：“Take it. I’d rather have clarity later than a false yes now.”  

存档更新：`status:pause,both_trust:+3`


**自由对话 `FREE_CHAT_24`：** 可谈知情同意、个人隐私、关系形式。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 品牌团队发来公开问询，要求William在次日之前回应“新男友”传言。

**连续性/验收：** 不把留宿/性经历写作必须向另一人汇报的隐私；只披露协商的关系状态。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_25｜他愿意放弃掌声 / What William Won’t Sell

**章节ID：** `CH_25`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_25_01｜场景1｜切图 `BG42`｜BGM `M25`｜`SFX_COOKING + FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_25_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** William公寓厨房窗外风吹树叶，锅中蒸汽真实流动。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William帮忙做饭时暖黄色慢柔光，玩家主动碰手可心动。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 锅铲、开水与轻爵士原创配乐。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 烹饪互动选食材，写入共同记忆。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** William下厨，短暂放下品牌团队的催促。 进入此场景准确切换到 `BG42`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “I burned the first batch. Please pretend this one is my debut.”
- **PLAYER (NARRATION):** “He slides a plate across the counter like it’s opening night.”
- **WILLIAM:** “They want a clean image. It took me a long time to realize they mean obedient.”
- **WILLIAM:** “I won’t use you as proof of how brave I am. And I won’t tell a lie about you for a job.”

### SCN_25_02｜场景2｜切图 `BG43`｜BGM `M25`｜`FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_25_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 夜景窗边微雨开始，城市霓虹被雨拉长。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 靠近需双方意愿，心动粒子只在允许时上浮。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 雨落玻璃+心跳2拍，之后停。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可以停在吻/留宿/分别，不强制升级。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 他在玩家面前写邮件但必须由本人发送，内容不涉及玩家身份。 进入此场景准确切换到 `BG43`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “Listen. “I will keep my personal relationships private, but I won’t misrepresent myself for this role.””
- **WILLIAM:** “Too much?”
- **PLAYER (NARRATION):** “He holds the cursor over Send. This choice is his.”
- **WILLIAM:** “Whatever they decide, I’ll still want to see you tomorrow.”

### SCN_25_03｜场景3｜切图 `BG42`｜BGM `M25`｜`SFX_SOFT_CHIME`

> **v11实景特效逐帧执行单｜`VFX_25_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 第二天清晨阳光透入，昨夜雨停。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William面对事业机会时暖光消退成诚实自然光。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 邮件声、城市清晨底噪。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 选择支持公开、私下陪伴、商议方案；保留事业后果。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 品牌方回信：仍可面试，但可能调整公开职责。 进入此场景准确切换到 `BG42`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **TEAM (TEXT):** “We appreciate your response. Your application remains under review.”
- **WILLIAM:** “Okay. Not a victory, not a disaster. Just honest.”
- **WILLIAM:** “I’d like more evenings like this, if you do.”


### ★ 上线情绪高潮强化场｜他为了你放弃掌声，但没放弃梦想

**互动游戏落点：** 厨房双人合作，只奖励真实体贴与共处；不默认留宿。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “I turned down the gossip campaign. I didn’t turn down the role. I want both my work and you to be real.”
- **WILLIAM:** “You can stay for dinner. You never need a reason to go home.”

**导演指令：** 停电三秒，William 用手机手电照着玩家手上的面粉，笑得不像舞台上的人。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:共同做晚饭，建立 daily_ritual。
- B:留下谈心，不自动发生亲密。
- C:礼貌离开，第二天收到早餐食谱。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_25_A`｜告诉他不必用事业证明爱**  
玩家台词：**“You don’t have to lose your dream to prove you care about me.”**  

角色即时回应 **WILLIAM**：“Then I’ll try to keep both the dream and my integrity.”  

存档更新：`W_career_balance:+5,W_trust:+5`

**B · `CH_25_B`｜一起享受普通夜晚**  
玩家台词：**“No more emails tonight. Teach me how you saved dinner.”**  

角色即时回应 **WILLIAM**：“Step one: convince someone lovely to taste the second batch.”  

存档更新：`W_domestic_memory:true,W_affection:+5`

**C · `CH_25_C`｜明确只做朋友也可支持**  
玩家台词：**“I want to support your choice as a friend, whatever happens.”**  

角色即时回应 **WILLIAM**：“Then I’m lucky to have a friend who knows when I’m pretending.”  

存档更新：`W_friendship:+5`


**自由对话 `FREE_CHAT_25`：** 可制作晚饭、设计面试回应、决定是否亲近；亲密仍需另外确认。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** William手机相册里出现第一张不是由校园媒体拍摄的合照：是否保存由玩家决定。

**连续性/验收：** William做自己的职业决定，玩家影响其信心而非控制他。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_26｜另一座城市的邀请 / Alex’s Other City

**章节ID：** `CH_26`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_26_01｜场景1｜切图 `BG44`｜BGM `M26`｜`SFX_VINYL`

> **v11实景特效逐帧执行单｜`VFX_26_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 唱片店门被风吹得叮当响，外面多云。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** Alex摸唱片封面时轻微冷蓝灯光，不加神秘闪电。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 唱片轻微底噪、风铃。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点某张唱片解锁A_song_progress。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 唱片店，Alex告诉玩家驻地面试结果。 进入此场景准确切换到 `BG44`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “I got the residency. Three months away, starting after finals.”
- **PLAYER (NARRATION):** “He looks happy. Then nervous about being happy.”
- **ALEX:** “I’m going. I’ve worked for this for years.”
- **ALEX:** “But I don’t want to pretend the timing means nothing to us.”

### SCN_26_02｜场景2｜切图 `BG49`｜BGM `M26`｜`FX_PUSH_IN + FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_26_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 唱片店后院开始飘细雨，衣角轻动。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 异地邀请弹出时画面冻结0.3秒突出不可逆选择。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 轻远雷与电子消息提示。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可问离开多久、是否愿长距离、是否尊重其梦想。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 天台俯瞰城市，Alex分享未来而不制造“留或走”二选一。 进入此场景准确切换到 `BG49`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “I could write to you from every city. You could tell me when the songs are terrible.”
- **ALEX:** “I could also be wrong about what we can handle.”
- **PLAYER (NARRATION):** “He turns his silver ring once and lets it rest.”
- **ALEX:** “I’m trying to ask instead of disappearing.”

### SCN_26_03｜场景3｜切图 `BG39`｜BGM `M26`｜`FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_26_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 雨后校园公交站有水洼与车灯反光。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 玩家支持Alex未来时云后亮光落到他脸上，非一定恋爱。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 车轮过水、轻风。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 玩家不做决定也能保留Alex自主事业计划。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 弹出共同制定的距离计划卡片，可选择朋友和恋人不同文案。 进入此场景准确切换到 `BG39`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “One voice note a week? Or more. Or none if that’s too much.”
- **ALEX:** “I want a plan that sounds like us, not a promise we make because we’re scared.”


### ★ 上线情绪高潮强化场｜他没有让你为他的梦想负责

**互动游戏落点：** 音乐邀请与异地规划，玩家参与而不决定 Alex 是否追梦。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **ALEX:** “The city is two hours away. I can take the train. I can call. I just won’t pretend distance is easy.”
- **ALEX:** “I want you. I also want that stage. For once, I’m trying not to disappear from either.”

**导演指令：** 窗外一阵雨砸在玻璃上，Alex 把录取邮件的纸张压在琴谱下。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:一起设计联系节奏，记 distance_plan。
- B:坦白害怕，Alex提供真实安排。
- C:友情祝福，开启异地友情支线。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_26_A`｜约定异地联系**  
玩家台词：**“Let’s try the voice notes. You can tell me about the music, not just that you miss me.”**  

角色即时回应 **ALEX**：“Deal. I’ll send you the ugly first drafts too.”  

存档更新：`A_distance:weekly,A_trust:+5`

**B · `CH_26_B`｜鼓励他自由出发，不做承诺**  
玩家台词：**“Go make your music. We don’t need to promise a future we haven’t lived yet.”**  

角色即时回应 **ALEX**：“That’s terrifyingly kind. Thank you.”  

存档更新：`A_distance:open,A_trust:+5`

**C · `CH_26_C`｜帮他把歌曲留作纪念**  
玩家台词：**“Finish the chorus with me tonight, whatever happens next.”**  

角色即时回应 **ALEX**：“Then this song will always have a place to return to.”  

存档更新：`A_song:completed,A_affection:+4`


**自由对话 `FREE_CHAT_26`：** 允许共写副歌、设日程、承认难过。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 校园匿名投票新帖出现：“William vs. Alex: Who wins?”

**连续性/验收：** 玩家不强迫Alex舍弃职业，和William差异化很明确。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_27｜不参加这场比赛 / Not a Contest

**章节ID：** `CH_27`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_27_01｜场景1｜切图 `BG45`｜BGM `M27`｜`SFX_EVENT_AMBIENT`

> **v11实景特效逐帧执行单｜`VFX_27_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 后台大风吹起厚幕帘，人物发梢动。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 三人坦诚谈判时所有心形粒子关闭，让情绪交给台词。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 舞台设备低嗡，BGM低音。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 每人需求分别点击查看，满足后继续。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 迎新后台两位男主看到舆论投票，问是否统一回应。 进入此场景准确切换到 `BG45`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “Someone turned our lives into a poll. I’m not interested in winning that.”
- **ALEX:** “Good. I wasn’t planning on losing either.”
- **NICOLE:** “There’s a third option: nobody plays.”
- **PLAYER (NARRATION):** “The percentages refresh as if they mean something. They don’t.”

### SCN_27_02｜场景2｜切图 `BG46`｜BGM `M27`｜`FX_SCREEN_GLITCH`

> **v11实景特效逐帧执行单｜`VFX_27_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 学生论坛投票卡片与场景同框。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 玩家拒绝投票逻辑时画面上投票UI裂成纸屑而非真实屏碎。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 纸片飘落、单低鼓。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点击隐藏投票/举报骚扰/设置私密。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 投票浮层震动一次后被玩家关闭，能选择不回应。 进入此场景准确切换到 `BG46`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “I’m leaving for my residency. I’m not going to spend my last weeks competing with William.”
- **WILLIAM:** “And I’m going to take that interview without denying who I am.”
- **PLAYER (NARRATION):** “For the first time, they both seem bigger than the question of who I choose.”

### SCN_27_03｜场景3｜切图 `BG45`｜BGM `M27`｜`FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_27_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 后台门打开后外面阳光照入。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 三人停止竞争后自然光均匀，不特殊偏爱某人。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 风声变柔，环境BGM重启。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 长线关系需逐人同意，不仅靠主角选择。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 三人决定下一次在无观众处见面。 进入此场景准确切换到 `BG45`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “Maybe we can all have one evening without making it a referendum.”
- **ALEX:** “A movie on the lawn. Normal.”
- **NICOLE:** “I’ll bring popcorn and a strict ban on polls.”


### ★ 上线情绪高潮强化场｜他拒绝让任何人把你当投票选项

**互动游戏落点：** 公众投票反击只做事实澄清；名誉保护而非争夺输赢。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “They made a poll about who deserves you. They don’t get a vote.”
- **ALEX:** “Not even we get a vote. Only you decide what comes next.”

**导演指令：** 两个男人在校媒走廊相遇，第一次同方向关掉了那面滚动投票墙。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:公开反对投票，公众支持增加。
- B:低调申诉删除，隐私提升。
- C:完全不回应，让学校官方处理。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_27_A`｜关闭投票不回应**  
玩家台词：**“We don’t have to answer a question nobody had the right to ask.”**  

角色即时回应 **WILLIAM**：“I’m with you.”  

角色即时回应 **ALEX**：“Finally, a unanimous vote.”  

存档更新：`poll:ignored,both_trust:+5`

**B · `CH_27_B`｜只发一条个人界线**  
玩家台词：**“My private life isn’t a competition. Please stop tagging me.”**  

角色即时回应 **NICOLE**：“Short and clear. I’ll help you report the reposts.”  

存档更新：`poll:boundary`

**C · `CH_27_C`｜转回真实的未来问题**  
玩家台词：**“I want to talk about your audition and the residency—not who gets a higher score.”**  

角色即时回应 **WILLIAM**：“I’d like that.”  

角色即时回应 **ALEX**：“Me too.”  

存档更新：`poll:redirect,both_trust:+4`


**自由对话 `FREE_CHAT_27`：** 玩家可以独自参加、邀请朋友；无强制三人约会。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** Nicole发来户外电影票，附言：“No cameras. Just people.”

**连续性/验收：** 普通粉丝投票与Eric调查严格分开。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_28｜只属于我们的一晚 / A Night Without Witnesses

**章节ID：** `CH_28`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_28_01｜场景1｜切图 `BG47`｜BGM `M28`｜`SFX_PROJECTOR + FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_28_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 露天电影草坪夜风摇动彩灯串，草尖可见。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William与Alex在玩家左右的微光视线，不默认牵手。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 草地虫鸣与远电影声（原创）。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可以选择坐谁旁边或独自坐。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 露天电影，人物同框：William拿外套，Alex拿饮料，Nicole在侧。 进入此场景准确切换到 `BG47`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **NICOLE:** “I bought too much popcorn. Which makes this an excellent evening already.”
- **WILLIAM:** “I brought a blanket. It might actually be big enough for everyone.”
- **ALEX:** “I brought the terrible candy. It builds character.”
- **PLAYER (NARRATION):** “A normal night feels stranger than the drama ever did.”

### SCN_28_02｜场景2｜切图 `BG48`｜BGM `M28`｜`FX_PUSH_IN`

> **v11实景特效逐帧执行单｜`VFX_28_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 半夜喷泉水雾随风飘到镜头边缘。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 玩家被尊重时细星点绕**人物身后**而非挡脸。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 水声、风与原创弦乐高潮。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 玩家可问两人将来，不必选人。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 电影散场，三人走到喷泉旁，讨论以后日常。 进入此场景准确切换到 `BG48`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “I’d like to cook with you again. Even if you spend the whole time mocking my knife skills.”
- **ALEX:** “I’d like to send you the song when I finish it. From wherever I am.”
- **WILLIAM:** “And if none of that turns into romance, I still want to know you.”
- **ALEX:** “Same. I’d rather have the truth than a beautiful lie.”

### SCN_28_03｜场景3｜切图 `BG48`｜BGM `M28`｜`SFX_FOUNTAIN + FX_SOFT_GLOW`

> **v11实景特效逐帧执行单｜`VFX_28_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 天空无雷但有云层飘过月亮，风逐渐减弱。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 关系真正被理解时轻柔心动+星光合成，按已获得信任触发。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 心跳最多两拍，BGM减弱给台词。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 如果双人开放同意不足则完全不展示三人拥抱CG。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 可选择独处、三人聊天、单独约会，镜头始终按选项表现。 进入此场景准确切换到 `BG48`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **PLAYER (NARRATION):** “Water catches the city lights. No camera flashes. Nobody asks me to choose before I’m ready.”


### ★ 上线情绪高潮强化场｜没有摄像头的夜晚

**互动游戏落点：** 露天电影座位选择，不让人物出现在未选择的场景。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “If this were a movie, I’d want the credits to roll here. Just us, no audience.”
- **ALEX:** “I wrote an ending for that song. I didn’t write yours.”

**导演指令：** 荧幕恰好播放到两人牵手的剪影，但玩家是否牵手由玩家自己决定。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:与 William 看电影，获得 ordinary_night。
- B:与 Alex 听终曲，获得 final_chorus。
- C:与 Nicole 及朋友看电影，获得 friendship_anchor。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_28_A`｜告诉William想再有普通的家庭夜**  
玩家台词：**“I’d love another dinner. Burnt or not.”**  

角色即时回应 **WILLIAM**：“Then I’m buying ingredients tomorrow.”  

存档更新：`future_W:domestic,W_affection:+4`

**B · `CH_28_B`｜告诉Alex想听完整歌**  
玩家台词：**“I want the whole song, even the parts you think aren’t ready.”**  

角色即时回应 **ALEX**：“You’ll be the first to hear it.”  

存档更新：`future_A:music,A_affection:+4`

**C · `CH_28_C`｜让今晚留给朋友关系**  
玩家台词：**“I want to remember tonight for the people, not the romance.”**  

角色即时回应 **NICOLE**：“Then smile. This one’s for us.”  

存档更新：`future:friendship,both_trust:+4`


**自由对话 `FREE_CHAT_28`：** 允许参与散步、聊未来、选择是否留存照片。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 日历提醒：十天相处的最后一天就是明晚。

**连续性/验收：** 为所有结局保留相同尊重与真实共处回忆。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_29｜明天以前 / Before Tomorrow

**章节ID：** `CH_29`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_29_01｜场景1｜切图 `BG23`｜BGM `M29`｜`SFX_THEATER_EMPTY`

> **v11实景特效逐帧执行单｜`VFX_29_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 夜风掀起天台栏杆旁长外套，城市远处闪烁灯海。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** William独白时暖光，Alex独白时蓝光，镜头根据可见角色变化。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 远城市底噪，缓慢钢琴动机。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可与每人单独谈未来，不强迫决定。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** William单独谈他想要的稳定关系。 进入此场景准确切换到 `BG23`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “I can imagine a real life with you. Not a headline. A kitchen. An argument we actually finish. A Sunday with nowhere to be.”
- **WILLIAM:** “I want a relationship where we choose each other clearly. If that isn’t what you want, I’ll be sad. I won’t punish you.”
- **PLAYER (NARRATION):** “He holds out the script from our first night backstage.”
- **WILLIAM:** “Whatever your answer, that night mattered.”

### SCN_29_02｜场景2｜切图 `BG49`｜BGM `M29`｜`SFX_CITY_WIND`

> **v11实景特效逐帧执行单｜`VFX_29_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 天台边缘安全位置、玻璃护栏有夜露。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 玩家想到未来时已存共同回忆像淡淡纸片经过，均可跳过。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 风声缓降，配乐换低频温柔。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 点击回忆卡可回看真实发生的事件。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Alex单独谈异地和创作，拒绝无期限等待。 进入此场景准确切换到 `BG49`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **ALEX:** “I want to try loving someone without disappearing the second it gets difficult.”
- **ALEX:** “I’m still going to the residency. I need someone who can see me as a musician and a person, not just a promise.”
- **PLAYER (NARRATION):** “He gives me a tiny audio recorder with our unfinished chorus.”
- **ALEX:** “Whatever happens, that’s yours to keep.”

### SCN_29_03｜场景3｜切图 `BG03`｜BGM `M29`｜`FX_PHONE_OVERLAY`

> **v11实景特效逐帧执行单｜`VFX_29_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 黎明前天空变蓝，弱风停。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 最后邀请字句出现时用白光微亮而非黑屏威胁。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 音乐留空1秒然后温柔升起。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 结局路线只由玩家明确选定，剧情可暂缓。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** Nicole帮玩家梳理可以说出的结局，不推荐特定人。 进入此场景准确切换到 `BG03`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **NICOLE (TEXT):** “Ask yourself who you want to build an ordinary Tuesday with. And remember: “not now” is a real answer.”
- **PLAYER (NARRATION):** “I type one message to both of them: Tomorrow. Nine. The park. I’m ready to talk.”


### ★ 上线情绪高潮强化场｜临近天亮，他不再用不确定留住你

**互动游戏落点：** 天台告白与承诺；两人不向玩家施压。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “If you choose me, I’ll stop trying to be everyone’s favorite. I’ll learn how to be your person.”
- **ALEX:** “If you choose me, we’ll have hard days. I’ll still tell you the truth on those days.”

**导演指令：** 太阳还没升起，风吹动 William 的衬衫和 Alex 的耳机线，两个画面分别呈现，禁止强制同框。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:解锁 William 终局诚实谈话。
- B:解锁 Alex 异地承诺谈话。
- C:不选是有效决定，解锁自我成长结局。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_29_A`｜准备与William谈清关系**  
玩家台词：**“I think I know the kind of everyday love I want.”**  

角色即时回应 **WILLIAM (TEXT)**：“Then I’ll listen tomorrow.”  

存档更新：`lean:William`

**B · `CH_29_B`｜准备与Alex谈真实未来**  
玩家台词：**“I want to talk about music, distance, and choosing each other anyway.”**  

角色即时回应 **ALEX (TEXT)**：“I’ll be there. No disappearing.”  

存档更新：`lean:Alex`

**C · `CH_29_C`｜保留不选或开放协商可能**  
玩家台词：**“I won’t promise what I can’t give. Tomorrow I’ll be clear.”**  

角色即时回应 **NICOLE (TEXT)**：“That’s all anyone can fairly ask.”  

存档更新：`lean:open`


**自由对话 `FREE_CHAT_29`：** 可最后一次回顾共享记忆，对两人分别留言。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 镜头切回第3章的公园长椅，灯亮着，画面暗下转入最终章。

**连续性/验收：** 最终选择不被数值硬锁；共识路线需要双方明确同意。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## CH_30｜这一次由你来写答案 / The Choice Is Yours

**章节ID：** `CH_30`｜**情绪主轴：** 真实选择、记忆连续与角色回应｜**默认视角：** 玩家第一人称（不强制显示脸）

### SCN_30_01｜场景1｜切图 `BG05`｜BGM `M30`｜`FX_MEMORY_FLASH + SFX_NIGHT_BIRDS`

> **v11实景特效逐帧执行单｜`VFX_30_01`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 公园天亮前有薄雾，树梢微风，角色本人清晰。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 最终视线聚焦与共有回忆小光点，未发生事件不浮现。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 鸟鸣起、原创主题钢琴逐渐回归。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 可以独自走到长椅，回看关系承诺。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 同一张长椅，William先到，Alex随后；玩家可以选择分别对话。 进入此场景准确切换到 `BG05`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **WILLIAM:** “Same bench. No police whistle this time.”
- **ALEX:** “Give the universe a second. It likes dramatic timing.”
- **PLAYER (NARRATION):** “For a moment we laugh. Then I remember the night I was too afraid to stay.”
- **WILLIAM:** “Whatever you’ve decided, you don’t have to make it easier for me.”
- **ALEX:** “Just make it true.”

### SCN_30_02｜场景2｜切图 `BG50`｜BGM `M30`｜`FX_SPLIT_CHOICE`

> **v11实景特效逐帧执行单｜`VFX_30_02`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 日出光越过树梢，风扬起两人衣角。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 玩家正式选择对象时才展示对应暖光/蓝光/纯晨光；不做虚假三人心形。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** BGM根据结局音轨无缝切换。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 四条结局按钮条件与确认弹窗，每条独立CG。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 晨光从树梢进入，出现4项结局按钮，选前先可回看记忆卡。 进入此场景准确切换到 `BG50`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **PLAYER (NARRATION):** “William gave me the courage to be seen. Alex taught me that staying can be braver than running.”
- **PLAYER (NARRATION):** “And somewhere between them, I learned I could choose myself without making anyone less worthy.”
- **WILLIAM:** “We’re listening.”
- **ALEX:** “Take your time.”

### SCN_30_03｜场景3｜切图 `BG50`｜BGM `M30`｜`FX_FADE_OUT`

> **v11实景特效逐帧执行单｜`VFX_30_03`**（仅补充制作调度，不覆盖下列原有对白和选择）  
> **T0 / 换图：** 进入本场即按上方 `BG` 切换，先预加载后0.35秒交叉淡化；上一场的雨、风、心动粒子必须清理，若天气连续则只平滑继承，不得重置到晴天。  
> **T1 / 实景环境：** 清晨柔和阳光，雨、雷全部停止。环境表现随人物和镜头变化，不可只贴一张静态雨幕。  
> **T2 / 情绪触发：** 选择后人物神态与动作响应，使用真实结局分支而不是统一黑屏。特效触发点应锚定下文对应人物说话/做动作，未触发前不可提前播放。  
> **T3 / 音乐与音效：** 结局主题音乐，选择确认音只一次。人物语音开启时BGM自动让位，环境声保持低于对白；音效一次触发不要重叠播放。  
> **T4 / 实际交互：** 播放专属结局并转入长线日常，不直接End Game。玩家操作后写入事件存档，再执行原稿下一句；离开场景清理本场短生命周期FX。  
> **美术图层：** `BG静态人物场景 → WX环境粒子/镜头雨痕(不得盖脸) → 人物局部动画(衣角/发丝/表情) → EM情绪粒子 → 手机/可点击物件 → UI对白与选择`。


**镜头/切换/互动指令：** 根据最后结局动态切人物和专属音乐，不再强制同屏三人。 进入此场景准确切换到 `BG50`；台词逐条出现，手机消息仅作为可编辑UI浮层。

- **PLAYER (NARRATION):** “The sun reaches the path. There is no audience to tell this story for us. Only what happens next.”


### ★ 上线情绪高潮强化场｜最后的决定不是奖杯，而是你的人生

**互动游戏落点：** 最终选择须提供 William / Alex / 自己 / 协商开放四条显式路线，开放须双方积极同意。 可跳过，结果只影响线索、角色独特记忆，不剥夺主线。

- **WILLIAM:** “Whatever you choose, the part where you changed my life is already true.”
- **ALEX:** “I don’t want to be picked like a prize. I want us to keep choosing each other.”

**导演指令：** 黎明在公园的树叶上亮起，两人的手机都没有发来催促。 在此处降低音乐6dB并以角色眼神、动作承接玩家反应，不用数值弹窗打断告白。

**本章高价值分支后果（覆盖通用模板）：**
- A:William路线进入第31章早餐生活事件。
- B:Alex路线进入第31章跨城通话事件。
- C:友情自我路线进入Nicole独立生活事件。
- D:双方明确同意才开启协商开放路线，否则进入无承诺过渡。

**回流守卫：** 下一章首先读取本章所选情绪事实；若玩家选友情/拒绝，后续避免任何未经选择的吻、合照、留宿。

### PLAYER_CHOICE｜必须点击后推进

**A · `CH_30_A`｜选择William，单独认真交往**  
玩家台词：**“William, I want the ordinary days with you. I choose us.”**  

角色即时回应 **WILLIAM**：“Then let’s build something real. Starting with breakfast tomorrow, not a grand speech.”  

角色即时回应 **ALEX**：“That hurts. But thank you for telling me directly. I’ll keep making music.”  

存档更新：`ending:William,exclusive:William`

**B · `CH_30_B`｜选择Alex，接受异地与音乐的未来**  
玩家台词：**“Alex, I choose you. Not instead of your music—with it.”**  

角色即时回应 **ALEX**：“I’m terrified. And I’m staying, even when I have to travel. One honest day at a time.”  

角色即时回应 **WILLIAM**：“I wanted a different answer. I respect yours.”  

存档更新：`ending:Alex,exclusive:Alex`

**C · `CH_30_C`｜暂时选择自己**  
玩家台词：**“I’m not ready to promise either of you a relationship. I’m choosing my own pace.”**  

角色即时回应 **WILLIAM**：“Then I hope the pace is kind to you.”  

角色即时回应 **ALEX**：“And if you ever want a friend with bad playlists, you know where to find me.”  

存档更新：`ending:Self,exclusive:none`

**D · `CH_30_D`｜提出知情同意的非排他可能**  
玩家台词：**“I care about both of you. Would you ever consider exploring something nonexclusive—only if all of us truly want it?”**  

角色即时回应 **WILLIAM**：“I need time to think. I can’t promise yes.”  

角色即时回应 **ALEX**：“Same. I won’t agree out of fear of losing you.”  

角色即时回应 **PLAYER (NARRATION)**：“We agree to talk again after each of us has considered it privately.”  

存档更新：`ending:OpenTalk,exclusive:none,consent:pending`


**自由对话 `FREE_CHAT_30`：** 最终可回顾30章记忆，任何结局均不因好感高低而强制锁死，惟多人线必须同意。 支持玩家自行输入，也可直接跳过；仅储存必要偏好、承诺与事件事实，不把不同角色之间私聊互通。

**章末固定钩子（全部分支回流）：** 进入相应的专属后日谈；开放协商线需先执行双方分别同意门槛，否则回退到单身/重新选择，不预设三人关系成立。

**连续性/验收：** 真正落地四个方向；每条都有未来日程，开放线不是自动成功的“多人结局”。 所有选项在下一章必须读取相应存档；没有选择过的亲吻、公开、留宿、合照不得被既定台词当成既成事实。


---


## 03｜发布结局：独立完整对白与后日谈

### END_W｜William·公开偏爱之后，是每天的选择

**条件：** 玩家在CH30主动选择William，William未被明确拒绝进入恋爱。`final_route=William`，BG41→BG37，M30转温柔钢琴。舞会王冠只作为私人回忆，不用于再次公开表白。

- **HAYDEN:** “I don't want the crown. I want the person who stayed when the cameras went away.”
- **WILLIAM:** “Good. The crown was heavy anyway.”
- **HAYDEN:** “And when I'm not easy to love?”
- **WILLIAM:** “Then we'll have a hard day. I'll make coffee. You'll tell me what I got wrong. We'll do the work.”
- **HAYDEN:** “That sounds less dramatic than the dance.”
- **WILLIAM:** “It's the part I wanted most.”

**玩家明确同意拥抱时**：他先伸手，不经同意不触碰；0.8秒金色心动柔光，未同意时仅相视而笑。第31章早晨玩家手机响起：“I burned the toast. Is this our first official disaster?” 玩家可回“Send proof / Save me some / I'll bring breakfast”。独宠是被认真对待，不是被控制。

### END_A｜Alex·没写完的副歌终于有了明天

**条件：** 主动选择Alex；`final_route=Alex`；BG34→BG44、M30转低声钢琴和原创新旋律。

- **HAYDEN:** “I'm not choosing the easy story. I'm choosing the one you tell me honestly.”
- **ALEX:** “Then here's the truth. The train leaves at seven on Monday. I hate how much I'm going to miss you.”
- **HAYDEN:** “Then call me when it gets quiet.”
- **ALEX:** “I will. Not to check where you are. Just to hear about your day.”
- **HAYDEN:** “And the song?”
- **ALEX:** “It still has a space in it. We can decide together what goes there.”

**第31章**清晨收到异地语音“First train. First song. Still thinking of you.” 若 `secret_melody` 为真，加入玩家当初选择的歌词；否则 Alex 提出共同写新的歌曲。没有玩家允许不公开共同录音。

### END_SELF｜Hayden·没人能替我给自己命名

**条件：** CH30选择自己或暂停关系；`final_route=self`；BG22→BG40，暖色黎明，不使用“攻略失败”字样。

- **HAYDEN:** “I like both of you. But I need a life that doesn't begin with someone asking me to choose.”
- **WILLIAM:** “Then have that life. I hope I get to hear about it.”
- **ALEX:** “And if you want the studio key for your own music, ask. No strings.”
- **NICOLE:** “I booked us breakfast. Not a date. Just a very serious appointment with pancakes.”
- **HAYDEN:** “That's exactly what I want.”

**第31章**：玩家决定申请学校广播项目、与Nicole探店、训练音乐或剧团技能；William、Alex作为有界限的朋友会被适当提及，无嫉妒惩罚。

### END_OPEN｜协商开放·所有人都先说出自己的意愿

**解锁条件：** 玩家在第20/21与29章主动提出协商，且 William 与 Alex 各自无条件表达**愿意讨论**，第30章再分别确认双方自愿；不得根据好感度自动解锁。任一方不同意→`final_route=transition`（友善过渡结尾）。

- **HAYDEN:** “I don't want either of you to agree because you're afraid I'll leave.”
- **WILLIAM:** “Then I need to be honest. I want to try, slowly, with actual conversations.”
- **ALEX:** “I can try talking about it. I won't promise I'm never going to feel jealous.”
- **HAYDEN:** “We can stop if it stops feeling right. I want everyone to have a choice.”
- **WILLIAM:** “Then start with breakfast. Three people. No audience.”
- **ALEX:** “And no scoreboard.”

**第31章**：共同早餐时每个人分别表达自己的界限和时间安排；没有自动三人亲密镜头。若有人撤回意愿，平稳切换友谊或单一路线，不将撤回视为背叛。

## 04｜跨章实情回收与防穿帮断言

| 判断条件 | 必须执行 | 禁止执行 |
|---|---|---|
| `CH05`无吻 | 偷拍可有同框或聊天屏幕照 | 不得出现“双吻照” |
| `W_handhold=false` | 18章只可并肩照 | 19章不得讨论实际牵手照片 |
| `W_kiss=false`且16章拒绝 | 17章Alex讨论不确定感 | 不得质问玩家和William接吻 |
| `Alex_friend_only=true` | 19/23/26/28启用友情对白 | 不得自动亲吻/留宿 |
| `romance_paused=true` | 21章日历仅放学习和朋友活动 | 不得自动启动十天三人试用 |
| `A_overnight=false` | 24章只汇报发生过的约会或谈心 | 不得提玩家留宿Alex宿舍 |
| `W_overnight=false` | 26章可以是William借的外套 | 不得暗示二人已经同居 |
| `secret_melody=false` | Alex首次分享歌曲，终局创作新歌 | 不得说玩家已完成副歌 |
| `public_visibility=private` | 27章删除请求以保护隐私为主 | 不得强制公开两人身份 |
| `consent_W_open=false`或`consent_A_open=false` | 走友善过渡 | 不得自动多方恋爱 |

**回流原则：** 公共剧情允许同一地点相遇，但必须通过条件模板替换对白；不得将未做出的选择补写成已发生的事实。亲密度是“情绪反馈”，不是同意机制。

## 05｜角色演出、图片、音乐与制作说明

**人物表现：** William至少包含：公众完美笑、只对玩家放松的笑、克制嫉妒、坚定保护、雨中凝视、亲密之前询问；Alex至少包含：冷淡抬眼、嘴硬吃醋、听歌时专注、脆弱坦白、雨中回头、异地告别；Nicole包含安慰、冷静支持；Eric包含回避、恼怒、调查问询表情。每个表情要眨眼、呼吸、微幅口型/肩颈动作，不通过在静态背景中硬嵌字幕模拟角色动画。

**美术资源：** 沿用v12的50景 `BG01–BG50` 编号（各章见本文件SCN切图），每个背景9:16，720×1280为最低交付层级；带人物版需保留底部字幕安全区，另出无人物干净版供动态立绘叠放。不得把不同服装/湿发状态直接复用而导致穿帮。

**音频：** `M01–M30` 作为章节原创音乐cue，进入语音时压低；单列雨声、风、远雷、手机提示、鞋跟、水滴、门、心跳音，不允许用受版权保护的现成歌曲冒充可商用素材。

**工程包：** `manifest.json` 需列出 `scene_id`, `bg_id`, `music_id`, `vfx`, `sfx`, `entry_conditions`, `choice_id`, `set_flags`, `next_node`, `memory_write`。上线必须保证场景图、角色立绘、FX层独立可替换。

### 上线验收硬门槛（未验证前不能称已可直接发布）

1. 30章每个场景都能抵达；每个A/B/C选项能进入对应后续节点，无死路。
2. 任何拒绝、友情、不选、撤回同意路径都不出现自动亲吻、留宿、宣称恋爱或负面惩罚。
3. 50景与场景ID一一对应，并有实交付图、角色与可商用音频；视觉不能用分镜占位图冒充正式素材。
4. 英文对白做美式母语编辑、BL受众测试、成人内容/隐私事项审核。
5. 自由输入经意图识别，不越权公开任何角色秘密，保存角色知情范围，失败可回退到固定剧情。
6. 在低性能手机上验证雨、风、粒子、雷电，提供减少动画/禁闪烁选项。
7. 四条结局各自能进入第31章长期关系起点；非排他必须三方明确自愿。

**交付事实：** 本稿包含30章、90场已有逐场剧情及视觉调度与新增情绪高潮/分支回报，可用于编剧验收与场景制作。由于正式50景和动态视频/音频尚非完整可用资源，此文件是**上线候选文本母稿**，而不是已可安装的最终App内容包。


## 06｜跨章逐选项回收表（优先于旧版默认回流）

# v13 逐章真实分支补完与回流修订（优先级高于旧版固定叙述）


## CH_01｜王冠不是奖品 / The Crown Is Not the Prize

**互动游戏安排（仅说明，不制作）：** 公开选择＋皇冠触摸。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜接过王冠并盯住William** (`CH_01_A`)

- **镜头与表演：** William slips the crown into your hands, then moves aside so the cameras cannot trap you.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_01_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜把手伸向Alex** (`CH_01_B`)

- **镜头与表演：** Alex opens the terrace door and waits outside rather than taking your hand.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_01_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜退后一步要求真相** (`CH_01_C`)

- **镜头与表演：** Both men tell the host to stop filming; Nicole takes you to a quiet hallway.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_01_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH02 texts and who approaches first。入场时要求回看 `CH_01_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_02｜两封没有署名的邀请 / Two Invitations

**互动游戏安排（仅说明，不制作）：** 手机私聊双线回复。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜接受W的公共场所邀约** (`CH_02_A`)

- **镜头与表演：** W sends a map pin for the public park and a message: “If you change your mind, I’ll understand.”
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_02_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜改约A先见面** (`CH_02_B`)

- **镜头与表演：** A sends the food-truck location and a voice note: “Come for the music, not the mystery.”
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_02_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜把两人错开并告知Nicole** (`CH_02_C`)

- **镜头与表演：** Nicole sets up separate appointments. “Two invitations do not mean two obligations.”
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_02_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH03 meeting place and first private memory。入场时要求回看 `CH_02_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_03｜长椅边的秘密 / The Bench at Eight

**互动游戏安排（仅说明，不制作）：** 公园足迹与时间线。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜现在离开，发信息说明** (`CH_03_A`)

- **镜头与表演：** William sees your departure message and waits until he knows you are safe.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_03_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜等Nicole来后一起走** (`CH_03_B`)

- **镜头与表演：** Nicole arrives and witnesses the retreat; the unidentified camera stays a lead.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_03_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜改为白天咖啡馆见** (`CH_03_C`)

- **镜头与表演：** The park meeting is cancelled and William meets you by daylight, not secretly.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_03_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH04 trust and who can verify the park incident。入场时要求回看 `CH_03_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_04｜银链与银戒 / Silver Chain, Silver Ring

**互动游戏安排（仅说明，不制作）：** 银链银戒线索比对。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜先问William** (`CH_04_A`)

- **镜头与表演：** William shows the chain and says: “I wanted you to recognize me, not owe me anything.”
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_04_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜先问Alex** (`CH_04_B`)

- **镜头与表演：** Alex rolls the ring across his knuckles. “I was going to tell you. I should have sooner.”
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_04_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜明确新规则** (`CH_04_C`)

- **镜头与表演：** Both admit the anonymous game went too far and agree to stop testing you.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_04_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH05 willingness to join the party game。入场时要求回看 `CH_04_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_05｜一场游戏，两颗心 / The Kiss Game

**互动游戏安排（仅说明，不制作）：** 真心话挑战/可跳过亲密。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜邀请William单独亲吻（可改拥抱）** (`CH_05_A`)

- **镜头与表演：** William steps away from the crowd before asking if you still want the kiss.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_05_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜主动与Alex约定只属于两人的瞬间** (`CH_05_B`)

- **镜头与表演：** Alex offers to leave the party together; the intimate beat happens only if accepted.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_05_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜拒绝游戏，带两人走向露台** (`CH_05_C`)

- **镜头与表演：** The party game ends; both follow you onto the terrace without physical contact.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_05_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH06 photo composition and consent/rumor details。入场时要求回看 `CH_05_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_06｜午夜前的威胁 / Before Midnight

**互动游戏安排（仅说明，不制作）：** 匿名威胁线索调查。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜保全证据交校方** (`CH_06_A`)

- **镜头与表演：** Nicole helps you export the threatening message with a timestamp.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_06_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜公开声明只谈隐私** (`CH_06_B`)

- **镜头与表演：** Your public statement asks for privacy; the forum backlash becomes a new pressure.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_06_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜暂时离线接受陪伴** (`CH_06_C`)

- **镜头与表演：** William offers tea; Alex waits without demanding an explanation.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_06_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH07 evidence source and public visibility。入场时要求回看 `CH_06_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_07｜镜头背后的人 / Behind the Lens

**互动游戏安排（仅说明，不制作）：** 校园媒体身份查证。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜要求交出相机原片** (`CH_07_A`)

- **镜头与表演：** The school media supervisor logs the request for the original file.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_07_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜请Alex在外面解释** (`CH_07_B`)

- **镜头与表演：** Alex admits his past with Eric in a private corridor, without details shared to others.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_07_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜暂停对峙，找校媒负责人** (`CH_07_C`)

- **镜头与表演：** The meeting ends under school supervision; Eric keeps denying the screenshots.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_07_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH08 how Alex’s past is disclosed and documented。入场时要求回看 `CH_07_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_08｜一首没写完的歌 / The Past Alex Kept

**互动游戏安排（仅说明，不制作）：** 歌曲记忆拼图。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜告诉Alex我在意的是现在的坦诚** (`CH_08_A`)

- **镜头与表演：** Alex says, “You can ask me anything. You do not have to answer me tonight.”
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_08_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜需要一点距离但保留沟通** (`CH_08_B`)

- **镜头与表演：** Alex keeps his distance and sends one non-pressuring message; no surprise visits.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_08_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜请Nicole陪同核实** (`CH_08_C`)

- **镜头与表演：** Nicole helps preserve the evidence chain and confirms the complaint number.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_08_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH09 who joins the archives inquiry。入场时要求回看 `CH_08_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_09｜旧公园那晚 / That Night at the Park

**互动游戏安排（仅说明，不制作）：** 监控时序比对。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜提交录音和证据** (`CH_09_A`)

- **镜头与表演：** Nicole submits the recorded statement to campus security.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_09_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜站出来说不允许直播** (`CH_09_B`)

- **镜头与表演：** The livestream’s legal and privacy risks are stated on-camera; do not auto-win.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_09_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜让两位男主先保护设备与出口** (`CH_09_C`)

- **镜头与表演：** William secures the exit while Alex informs the supervisor; neither confronts Eric physically.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_09_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH10 livestream intervention entry point。入场时要求回看 `CH_09_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_10｜十秒直播 / Ten Seconds Live

**互动游戏安排（仅说明，不制作）：** 直播声明互动。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜给学校正式书面陈述** (`CH_10_A`)

- **镜头与表演：** The school confirms receipt and gives you a reference number.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_10_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜先与Nicole离开现场** (`CH_10_B`)

- **镜头与表演：** Nicole walks you out; the record is preserved even though you do not speak live.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_10_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜请William和Alex陪伴但不替我发言** (`CH_10_C`)

- **镜头与表演：** The two men stand beside you silently until you ask them to speak.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_10_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH11 hearing and who testifies。入场时要求回看 `CH_10_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_11｜原片里的证据 / The Uncropped Frame

**互动游戏安排（仅说明，不制作）：** 取证放大镜小游戏。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜拒绝与Eric私下和解** (`CH_11_A`)

- **镜头与表演：** Eric’s request for a private meeting is denied; his apology is not accepted as resolution.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_11_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜要求他停止再联系我** (`CH_11_B`)

- **镜头与表演：** Campus staff enforce no-contact during the investigation.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_11_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜允许一封书面道歉但不撤诉** (`CH_11_C`)

- **镜头与表演：** His written apology is filed as evidence; no automatic forgiveness or closed case.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_11_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH12 safety boundary and Nicole support。入场时要求回看 `CH_11_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_12｜重新开始，不靠镜头 / No More Cameras

**互动游戏安排（仅说明，不制作）：** 关系边界协商。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜安排William的剧院之夜** (`CH_12_A`)

- **镜头与表演：** William invites you to an empty rehearsal after the performance.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_12_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜先听Alex的未完成歌曲** (`CH_12_B`)

- **镜头与表演：** Alex offers his unfinished recording, but lets you decide when to listen.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_12_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜给自己一晚恢复，再安排两人** (`CH_12_C`)

- **镜头与表演：** You spend one evening alone; the dates are rescheduled, not cancelled.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_12_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH13 first date scheduling and ambient scenes。入场时要求回看 `CH_12_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_13｜聚光灯关掉以后 / When the Spotlight Dies

**互动游戏安排（仅说明，不制作）：** 舞台灯光追焦。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜告诉他我喜欢不完美的他** (`CH_13_A`)

- **镜头与表演：** William sits beside you without his phone: “This version of me is less polished.”
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_13_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜请他教我一段台词** (`CH_13_B`)

- **镜头与表演：** He teaches you one line, flubs the next, and laughs with genuine relief.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_13_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜让他把手机留给自己决定** (`CH_13_C`)

- **镜头与表演：** He chooses whether to put the phone away; your boundary is remembered.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_13_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH16 William intimacy vs trust dialogue。入场时要求回看 `CH_13_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_14｜没发出去的副歌 / The Unsent Chorus

**互动游戏安排（仅说明，不制作）：** 旋律接续小游戏。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜陪他完成副歌** (`CH_14_A`)

- **镜头与表演：** Alex records your chosen lyric as a demo and credits your contribution.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_14_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜追问他为什么害怕留下** (`CH_14_B`)

- **镜头与表演：** Alex admits leaving people first can feel safer than being left.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_14_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜告诉他今晚先做朋友也很好** (`CH_14_C`)

- **镜头与表演：** You listen side by side; no kiss is assumed.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_14_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH17 Alex fear-of-being-second callback。入场时要求回看 `CH_14_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_15｜在人群里找你 / I Looked for You

**互动游戏安排（仅说明，不制作）：** 舞伴邀请/双人牵手。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜和William跳一曲** (`CH_15_A`)

- **镜头与表演：** William asks for one song; the crowd takes a photo only if you enter the lit dance floor.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_15_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜和Alex去舞池** (`CH_15_B`)

- **镜头与表演：** Alex leads you to the quieter edge of the dance floor.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_15_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜和朋友们一起跳，不选人** (`CH_15_C`)

- **镜头与表演：** You dance with friends; both respect the choice without a jealousy penalty.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_15_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH16 public rumor flag and dance memory。入场时要求回看 `CH_15_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_16｜雨停之前 / Before the Rain Stops

**互动游戏安排（仅说明，不制作）：** 雨夜靠近/拥抱选择＋心跳。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜允许William的吻** (`CH_16_A`)

- **镜头与表演：** William kisses you only after your affirmative answer, then notices the rain growing harder.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_16_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜选择长谈** (`CH_16_B`)

- **镜头与表演：** William stays in the doorway and talks with you about what it means to be seen.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_16_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜礼貌结束今晚** (`CH_16_C`)

- **镜头与表演：** William walks you to the door, then leaves; Alex later finds you alone, not kissing.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_16_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH17 what Alex actually saw, not a fixed kiss。入场时要求回看 `CH_16_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_17｜不是备选 / Not Your Second Choice

**互动游戏安排（仅说明，不制作）：** 雨中追上Alex＋真实回应。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜主动告诉Alex我认真在意他** (`CH_17_A`)

- **镜头与表演：** Alex admits, “I am scared you will come after me only when I walk away.”
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_17_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜承认目前还不能给予承诺** (`CH_17_B`)

- **镜头与表演：** Alex thanks you for the honesty but asks for space before another date.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_17_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜表示先退回朋友** (`CH_17_C`)

- **镜头与表演：** The friendship boundary is respected; do not force a reconciliation kiss.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_17_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH18 friendship/romance access and Alex repair thread。入场时要求回看 `CH_17_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_18｜牵着你的手穿过人群 / In Plain Sight

**互动游戏安排（仅说明，不制作）：** 公开牵手或保留隐私。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜公开牵手** (`CH_18_A`)

- **镜头与表演：** The public photo exists with both of you holding hands, and William asks before responding online.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_18_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜走安静的小路** (`CH_18_B`)

- **镜头与表演：** There is no photo; you share a private memory by the side path.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_18_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜先不牵手但接受陪伴** (`CH_18_C`)

- **镜头与表演：** William walks beside you, not touching; the public romance rumor cannot spawn from this scene.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_18_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH19 photo reaction conditional。入场时要求回看 `CH_18_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_19｜你来找我 / You Came for Me

**互动游戏安排（仅说明，不制作）：** 录音片段共创。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜坦诚告诉Alex自己对他有感觉** (`CH_19_A`)

- **镜头与表演：** Alex shares the last verse of his unfinished song, but stops to ask where this is going.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_19_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜明确先保持朋友关系** (`CH_19_B`)

- **镜头与表演：** Alex agrees to remain friends without romantic teasing.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_19_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜请两人一起谈清楚** (`CH_19_C`)

- **镜头与表演：** William arrives for a scheduled discussion, not as a forced jealous interruption.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_19_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH20 can the three hold a truthful conversation。入场时要求回看 `CH_19_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_20｜灯熄之前 / Until the Lights Go Out

**互动游戏安排（仅说明，不制作）：** 三人谈心选择。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜先分别约会再决定** (`CH_20_A`)

- **镜头与表演：** Both men agree to separate dates; do not imply a three-person romance pact.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_20_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜表达倾向某一人** (`CH_20_B`)

- **镜头与表演：** The preferred person asks for a direct conversation about exclusivity and timing.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_20_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜暂时不谈恋爱** (`CH_20_C`)

- **镜头与表演：** Nicole takes you out of the relationship talk; romance scenes pause until you opt back in.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_20_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH21 availability of trial proposal。入场时要求回看 `CH_20_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_21｜十天的约定 / Ten Days, No Scoreboard

**互动游戏安排（仅说明，不制作）：** 十天约会安排拼图。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜先约William** (`CH_21_A`)

- **镜头与表演：** The William-first appointment is set, and Alex confirms a separate date later.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_21_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜先约Alex** (`CH_21_B`)

- **镜头与表演：** The Alex-first appointment is set; William gets an honest schedule update.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_21_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜安排两人和自己的时间** (`CH_21_C`)

- **镜头与表演：** Your calendar includes personal time and two optional dates, each cancellable.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_21_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH22/23 order and what each knows。入场时要求回看 `CH_21_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_22｜卸下王冠的夜晚 / William Offstage

**互动游戏安排（仅说明，不制作）：** William单人约会互动。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜支持他表达真实自己** (`CH_22_A`)

- **镜头与表演：** William declines a public grand gesture and explains his choice privately.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_22_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜帮他排练并分析风险** (`CH_22_B`)

- **镜头与表演：** You rehearse a statement together, but publishing remains his decision.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_22_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜明确不想被卷入公开项目** (`CH_22_C`)

- **镜头与表演：** The public event happens without you; friendship support remains available.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_22_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH25 career decision and commitment pressure。入场时要求回看 `CH_22_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_23｜只给你听的未完成曲 / The Song Only You Hear

**互动游戏安排（仅说明，不制作）：** Alex夜宵与歌曲互动。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜鼓励他追求音乐** (`CH_23_A`)

- **镜头与表演：** Alex asks when and how you would want to keep in touch during his audition trip.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_23_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜坦白异地担忧** (`CH_23_B`)

- **镜头与表演：** Alex says, “I will go, and I won’t make you responsible for that.”
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_23_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜先确定友情与支持** (`CH_23_C`)

- **镜头与表演：** You help him save the track without any romance promise.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_23_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH26 long-distance expectations。入场时要求回看 `CH_23_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_24｜把真话说给对的人 / The Truth We Share

**互动游戏安排（仅说明，不制作）：** 坦诚告知小游戏。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜明确仍处探索阶段** (`CH_24_A`)

- **镜头与表演：** You tell both men there is no exclusive commitment and what boundaries you need.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_24_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜坦承自己已倾向其一** (`CH_24_B`)

- **镜头与表演：** You tell the person you lean toward, then privately notify the other without sharing intimate details.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_24_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜暂停约会梳理情绪** (`CH_24_C`)

- **镜头与表演：** Dates pause for reflection; no accidental overnight stays become canon.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_24_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH25-26 who feels chosen vs uncertain。入场时要求回看 `CH_24_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_25｜他愿意放弃掌声 / What William Won’t Sell

**互动游戏安排（仅说明，不制作）：** 厨房共同制作晚餐。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜告诉他不必用事业证明爱** (`CH_25_A`)

- **镜头与表演：** William chooses his own public role, and you are proud without taking credit.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_25_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜一起享受普通夜晚** (`CH_25_B`)

- **镜头与表演：** You share a simple kitchen dinner and make a memory about food, not spectacle.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_25_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜明确只做朋友也可支持** (`CH_25_C`)

- **镜头与表演：** William accepts a friendship-focused evening; no surprise romantic confession.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_25_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH28 home-night memory and relationship route。入场时要求回看 `CH_25_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_26｜另一座城市的邀请 / Alex’s Other City

**互动游戏安排（仅说明，不制作）：** 唱片选择与记忆。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜约定异地联系** (`CH_26_A`)

- **镜头与表演：** Alex offers a specific call schedule and asks you to say if it stops working.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_26_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜鼓励他自由出发，不做承诺** (`CH_26_B`)

- **镜头与表演：** Alex leaves freely, and there is a warm farewell without a promise.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_26_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜帮他把歌曲留作纪念** (`CH_26_C`)

- **镜头与表演：** You keep a voice note from his song with his permission.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_26_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH29 distance, promises and song-memory。入场时要求回看 `CH_26_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_27｜不参加这场比赛 / Not a Contest

**互动游戏安排（仅说明，不制作）：** 拒绝公众投票互动。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜关闭投票不回应** (`CH_27_A`)

- **镜头与表演：** The poll loses attention when you decline to participate; no character is ranked by it.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_27_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜只发一条个人界线** (`CH_27_B`)

- **镜头与表演：** You post a privacy boundary and do not announce any relationship label.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_27_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜转回真实的未来问题** (`CH_27_C`)

- **镜头与表演：** The scene shifts to honest talks about travel, career and daily life.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_27_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH28 public exposure and agency。入场时要求回看 `CH_27_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_28｜只属于我们的一晚 / A Night Without Witnesses

**互动游戏安排（仅说明，不制作）：** 露天电影座位安排。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜告诉William想再有普通的家庭夜** (`CH_28_A`)

- **镜头与表演：** William cooks with you and asks about the life you want after the semester.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_28_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜告诉Alex想听完整歌** (`CH_28_B`)

- **镜头与表演：** Alex plays the completed chorus; you decide whether to keep the recording.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_28_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜让今晚留给朋友关系** (`CH_28_C`)

- **镜头与表演：** You stay with friends; neither male lead interrupts to claim you.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_28_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH29 meaningful memory recalled。入场时要求回看 `CH_28_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_29｜明天以前 / Before Tomorrow

**互动游戏安排（仅说明，不制作）：** 天台告白与承诺。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜准备与William谈清关系** (`CH_29_A`)

- **镜头与表演：** William names what he can offer and what he needs; no answer demanded now.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_29_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜准备与Alex谈真实未来** (`CH_29_B`)

- **镜头与表演：** Alex names the costs of distance and offers a plan, not a fantasy.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_29_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜保留不选或开放协商可能** (`CH_29_C`)

- **镜头与表演：** You explicitly reserve the right to choose nobody; a joint path requires a separate consent talk.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_29_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** CH30 proposed ending availability。入场时要求回看 `CH_29_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## CH_30｜这一次由你来写答案 / The Choice Is Yours

**互动游戏安排（仅说明，不制作）：** 结局重大关系选择。推荐在第2场情绪升级/线索出现后、第3场关键选项前插入；允许跳过；如已进入危险或侵权危机，则游戏应是取证而非奖励式亲密。

**三条分支需真实执行：**


**A｜选择William，单独认真交往** (`CH_30_A`)

- **镜头与表演：** William answers your choice and asks how to build the first ordinary week together.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_30_A`，事件与角色知情范围分别入库；下一章第一场读取。


**B｜选择Alex，接受异地与音乐的未来** (`CH_30_B`)

- **镜头与表演：** Alex shares the travel schedule and asks how often to call, without making promises for you.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_30_B`，事件与角色知情范围分别入库；下一章第一场读取。


**C｜暂时选择自己** (`CH_30_C`)

- **镜头与表演：** Both accept that no romantic relationship starts now; the friendship future is concrete.
- **切图规则：** 使用本章对应的 v11 BG；视角由这条分支实际在场的人决定，不得把未参与角色强行显示在镜头中央。
- **持久标记：** `last_choice=CH_30_C`，事件与角色知情范围分别入库；下一章第一场读取。


**下一章回收：** Post-30 branch event and no silent reversion。入场时要求回看 `CH_30_A/B/C`，按上一条分支修改前两句对话或人物行动；但固定主线证据发生的先后顺序保持不变。


## 重要条件覆盖台词（纠正旧版自动发生事实）

**CH05 → CH06（派对影像）**：如果没有吻，匿名贴只能使用舞会同行或派对同框照。不得出现不存在的“双吻照”。若出现真实偷拍，Nicole 与校方按隐私侵权流程处理，不要求玩家羞耻。

**CH15 → CH16 → CH17（雨夜三角误会）**：
- `CH16_A`：Alex 可能看到双方靠近；由前章拍摄角度及他是否到场确认，**不自动推定他看到了吻**。
- `CH16_B`：Alex 只看到深谈或门口道别，其失落来自此前的不确定，而不是假装被背叛。
- `CH16_C`：Alex 到场时玩家独自站在门廊，他会说 “I didn’t know if you wanted company.”，不得引用 William 亲吻。
- `CH17_C` 之后 Alex 转入友情路线。CH19、23、26、28 的亲密戏改成合适的友情台词；除非玩家后续明确重新提议，并经过双方确认，否则不自动触发吻。

**CH18 → CH19（公开照片）**：只有 `CH18_A` 生成确实的手牵手照片；`CH18_B/C` 的校园舆论要使用早先真正发生的同框照或改为校园项目讨论，绝不能伪造公开牵手。

**CH20 → CH21（十天试用）**：`CH20_A` 可以进入十天非排他相处试行；`CH20_B` 先做倾向对象的一对一关系协商，另一人不被自动登记为试用对象；`CH20_C` 暂停恋爱，保留生活/友情章节，**禁止** CH21 自动开始三人试用。

**CH23–26（亲密与留宿）**：旧稿中固定“留宿/亲密”的句子必须改为有条件场景：仅在玩家主动选择、双方明确愿意且没有 `friend_only` 时发生。若没有留宿，CH24 的真实告知对象应是“关系进度/约会”，不是虚构已发生的亲密经历。

**CH29 → CH30（终局）**：William、Alex、单身自由三条路径均能得到完整结局；第四条知情协商式非排他方向不是默认恋爱奖励，必须分别获得两位男主明确同意，否则变成“三人认真谈清边界，暂不建立关系”的开放过渡章。

## 结局后持续剧情的四条入口（主线完结后还可继续生活）

- **William 恋爱线**：第一个日常任务不是再被围观，而是两人共同决定周末早餐、剧团排练与公开隐私边界。前面记录的王冠、舞蹈、雨夜、料理回忆会被他自然提起。
- **Alex 恋爱线**：以音乐创作、巡演/异地通讯频率及信任修复为长期故事引擎。此前有没有共同写歌决定新歌是否包含玩家的旋律。
- **单身/友情线**：Nicole 的校园活动、职业选择、与两人保有友谊、其他自然出现的生活任务；旧男主不应以“攻略失败”式行为惩罚玩家。
- **协商开放方向**：三人分别谈日常相处、排他性与隐私，允许其中任何一人不同意或以后改变主意；仅在知情同意后开启共享活动，不自动构成三人亲密场面。



## 07｜备用背景的明确调用（补齐BG01–BG50素材覆盖）

- `BG17｜校安办公室`：在CH09调查时间线如玩家选安全核查路线时插入`SCN_09_SAFE`；由Nicole陪同，校安只提供合法权限内的确认信息。无论是否触发均不影响核心证据。
- `BG27｜舞池外走廊`：在CH15玩家主动选择离开舞池时插入`SCN_15_CORRIDOR`，William/Alex只有玩家邀请才出现；风从半开的门吹动衣角，音乐低通处理，退出返回CH15真实选择后的情节。

上述是**可选实际触发场景**，不表示已经生成图片。连同90个主场节点，形成92个可到达的场景节点入口，50个背景编号均有剧情用途。
