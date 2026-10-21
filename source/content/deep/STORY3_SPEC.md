# 《打烊之后》第 1 章 v4 写作规范（短、狠、有身体张力）

用户试玩上一版后的意见（必须逐条做到）：
- 废话太多、太长（玩了15分钟还没结局），感觉是 AI 在走流程。**每一句都必须推进两人关系，或推进朋友们撮合他们的计划。** 不推进的句子一律删。
- 人物动机立不起来。读者要清楚：他们**为什么互相喜欢**、**为什么一直没在一起**、**朋友们怎么发现并制造机会**。
- 要有**身体接触的特写**（像美剧那样）：手指碰到故意多停一秒、膝盖贴着、闻衣领、额头抵肩、黑暗里手顺着手腕往上摸、差一点吻上。要有欲望和张力，**但不露骨、不写性行为**。
- 中文先写，像国产短剧/网文：短句、口语、有梗、有情绪。英文是自然的美剧对白版本，事件与顺序一致。

## 故事核心（全章不能偏离）
- 半月酒吧，周五深夜。Nico（你，27，男，酒吧合伙人兼调酒师，暗恋 Theo 五年）给 Theo 办送别局。Theo（30，男，话剧演员）明早 7:10 飞纽约。
- **Nico 为什么喜欢 Theo**：Nico 什么都替别人扛，Theo 是唯一一个会把他手里的托盘拿走、说“你坐下，今天我请”的人。
- **Theo 为什么喜欢 Nico**：五年前 Theo 演砸一场小剧场的戏，台下只剩 Nico 一个观众。此后 Theo 每一场演出，Nico 都坐同一个座位（第三排靠过道）。
- **为什么没在一起**：Theo 要去纽约追梦，Nico 觉得开口留他是自私、会拖住他；Theo 以为 Nico 对谁都这么好，自己不特别，不敢说。
- **朋友做局**：Wren（Nico 大学好友，播客主持，录音笔一直开着）知道 Nico 的心思；Rowan（护士，Theo 室友）知道 Theo 的心思。两人今晚**联手做局**，读者要看得见他们在使坏：互相使眼色、发消息“A计划失败，上B计划”、操纵分组、在瓶子上做手脚。
- 副线（只用几句点到）：Mason 和 Ethan 冷战（Mason 把 Ethan 膝盖伤情告诉了教练），其实互相喜欢。
- 章节开头读者会看到目标：“今晚目标：在他登机前，让他知道。”

## 长度
全章 3 场。**每场 50–65 句**（validator 统计，含选项后的反应），每场至少 4 个“轮到你”（line），选项要真的不同，反应要不同。读完一章约 10–12 分钟。

## 场景与必须写到的点（背景图名字必须照写）

**第 1 场 · 送别局**（周五 22:40–23:10，半月酒吧 吧台）
- 第一条：`["sys","scene",{"img":"afterhours/s1","place":"半月酒吧 吧台","time":"周五 晚上10:40"}]`（英文版 place/time 用英文，img 相同）
- 开头 2–3 句旁白交代：送别局、Theo 明早飞纽约、Nico 喜欢他五年。
- Wren 和 Rowan 做局被读者看见（使眼色/一条消息）。
- 身体特写①：Theo 把一杯酒推给吧台后的 Nico，两人手指同时握在杯子上，Theo 没松手，多停了一秒。紧接着插入 `["sys","bg",{"img":"afterhours/s1_touch"}]`。
- `feature snap`（拍立得，cid theo）：Wren 安排的，hint 写成剧情。**数据里必须带** `"with":"nico"` 和 `"frames":[{"img":"afterhours/ch1_snap1"},{"img":"afterhours/ch1_snap2"},{"img":"afterhours/ch1_snap3"},{"img":"afterhours/ch1_snap4"}]`（四张依次是：两人比耶 / Theo 贴脸 Nico 笑闭眼 / Theo 做鬼脸 Nico 翻白眼但在笑 / Nico 对镜头比耶而 Theo 没看镜头在看他）。win 反应写第四张被 Wren 抢走塞进 Nico 围裙口袋。
- 【反转】Theo 站上椅子举杯：“纽约那边要签我五年。我不回来了。”用 `["sys","event",...]`，紧接着 `["sys","bg",{"img":"afterhours/s1_e1"}]`。Nico 至少一个“轮到你”回应。
- 【钩子】闪电，所有人手机尖叫暴雨红色预警，地铁停运，谁也走不了（event 卡）。

**第 2 场 · 地下室**（周五 23:20–23:45，地下室）
- 第一条：`["sys","scene",{"img":"afterhours/s2","place":"半月酒吧 地下室","time":"周五 晚上11:20"}]`
- 地下室进水。Rowan“分工”故意把 Nico 和 Theo 分到最里面窄道（读者看得出是故意的）；Mason 和 Ethan 被分去抬同一个酒桶（一句副线）。
- 身体特写②：窄道太窄，手电只剩一支，两人侧身贴着过，Theo 的胸口贴着 Nico 的背。
- Theo 湿透打喷嚏 → `gift`（who theo，五种礼物都要有反应；卫衣最自然）。送卫衣后：Theo 穿上，低头闻了一下领口，“全是你的味道”。之后插入 `["sys","bg",{"img":"afterhours/s2_b"}]`。
- `feature heart`（心跳测试，cid theo）：win=Theo 心跳比 Nico 还快被抓包；lose=Theo 先退开打岔。
- `photo`：`{"img":"afterhours/ch1_p1","cap":"…","prompt":"Dim flooded bar basement at night, two men in their late twenties standing close in ankle-deep water holding boxes, flashlight, no text","then":[],"skip":[]}`
- 关键选择：Theo 问“说真的，你觉得我该去吗？”，选项 set 分别为 `told_go` / `hinted_stay` / `joked`，反应截然不同。
- 【反转】Theo 开口“Nico，其实我——”，`event` 全店停电。紧接着 `["sys","bg",{"img":"afterhours/s2_e1"}]`。
- 身体特写③（场尾钩子）：黑暗里一只手找到 Nico 的手腕，没松开，慢慢往上，停在他小臂内侧。谁的手？——“是我。”

**第 3 场 · 真心话与第六张账单**（周五 23:50 – 周六 00:05，烛光下的吧台）
- 第一条：`["sys","scene",{"img":"afterhours/s3","place":"半月酒吧 烛光下","time":"周五 晚上11:50"}]`
- 用 `["sys","if",...]` 按 told_go / hinted_stay / joked 让 Theo 对 Nico 的态度不同（至少一处）。
- `feature bottle`（转瓶子，cid theo）：Wren 在瓶子上做了手脚（读者知道）。真心话问到 Nico：“在场有没有你喜欢的人？”（轮到你：撒谎 / “有，但不说是谁” set `truth_half` / 反问 Theo）。
- Mason 副线一两句爆点：Mason 当着大家说“我宁可你恨我也不想看你废一条腿”，Ethan 愣住（可用 event）。
- `voice`（who theo）：Wren 录音笔里五年前的录音，喝醉的 Theo：“以后不管我去哪儿，Nico 的酒吧我都会回来喝。说好了。”这句要点出“第三排靠过道”的往事。
- Nico 去收银台，插入 `["sys","bg",{"img":"afterhours/s3_e1"}]`。打开第六张账单留言：“给N：五年了，每次都是你请。这次换我。生日快乐。——T”。零点，今天是 Nico 生日，只有 Theo 记得。
- `photo`：`{"img":"afterhours/ch1_p2","cap":"…","prompt":"Close-up of a paid bar tab and a small handwritten note under a green emergency light, no legible text","then":[],"skip":[]}`
- 【反转】Rowan 低声：“他根本没签那份五年合同。他在等一个人开口留他。”（event）
- 身体特写④：Theo 走过来，把额头抵在 Nico 肩上，“就一下”。插入 `["sys","bg",{"img":"afterhours/s3_kiss"}]`。两人越靠越近，差一点吻上——被打断（Wren 端着插蜡烛的蛋糕冲出来唱生日歌 / 地下室又一声水响，二选一）。
- 停在本章选择：“这张账单，你打算怎么办？”不要替读者选。
- 再写 `then.A/B/C`（每个 15–25 句，至少一个 stop，各有身体或情绪钩子，结尾都通向第2章：地下室的水又涨了 / Theo 的航班状态变了）：
  - A 拿着账单当面问Theo → Theo承认是他付的，也承认一直记得Nico的生日；气氛变了，停在欲言又止。
  - B 揣进口袋装没看见 → Theo看见了，也什么都没说；停在失落的眼神。
  - C 当着所有人念出来 → 大家才知道今天是Nico生日热闹庆祝，Theo却躲进了后厨。

## 二、文件格式

每个场景一个文件：`content/deep/afterhours_ch1_s<N>.json`

```json
{ "beats": { "zh": [ ... ], "en": [ ...同样的顺序和结构... ] } }
```
（第 5 场还要有 `"then": {"A":{"zh":[...],"en":[...]},"B":{...},"C":{...}}`）

**第一条必须是场景切换**：`["sys","scene",{"img":"afterhours/s1","place":"半月酒吧 吧台","time":"周五 晚上10:40"}]`（英文版 place/time 写英文，img 相同）。

普通句子 `[who, kind, text]`：
- `["n","act","旁白"]`
- `["theo","say","台词，不加引号"]`
- `["theo","act","Theo把杯子推过来。"]`（第三人称）
- `["nico","think",...]` **禁止**——Nico 的话和心理只能通过“轮到你”的选项出现，或者用旁白写“Nico心里一紧。”

**连续的旁白/动作会被自动合并进一个框**，所以可以连着写 2–4 条旁白/动作，再接台词。

停顿互动（stop）`[who, kind, {...}]`：

| kind | 写法 |
|---|---|
| `line`（轮到你） | `["nico","line",{"hint":"一句话说明此刻的处境/该怎么回","opts":[{"k":"say|act|think","t":"Nico说的话或做的事","then":[2–4 条别人的反应],"love":-3~3,"set":"可选的标记名"}, ...2–3个]}]` 选项要真的不一样（比如：嘴硬 / 真诚 / 打岔），反应也要不一样。`love` 只影响 Theo 的好感。 |
| `gift` | `["theo","gift",{"who":"theo","hint":"为什么此刻适合送东西","by":{"coffee":[...],"flower":[...],"hoodie":[...],"letter":[...],"ring":[...]},"then":[],"skip":[...]}]` 五种礼物：咖啡、一枝玫瑰、你的卫衣、手写信、戒指（没压力），每种 1–3 条贴合此刻的反应。 |
| `photo` | `["theo","photo",{"cap":"照片说明（带时间）","prompt":"英文生图提示词：场景、光线、人物外形、动作；不写名字；成年人；不要文字","then":[],"skip":[]}]` |
| `game` | `["mason","game",{"k":"remember","hint":"把游戏写成剧情的一部分","then":[...],"skip":[...]}]` 本章只用 `remember`（谁记错了：Mason和Ethan对同一晚的说法不一样，找出谎言）或 `order`（他点的那杯）。必须写 `"pair":[a,b]` 指定游戏里的两个人：`remember` 用 `["mason","ethan"]`；`order` 用 `["nico","theo"]`（游戏文案是“a 正在替 b 点单，4 秒记住它”）。 |
| `voice` | `["theo","voice",{"who":"theo","txt":"语音内容 1–3 句","hint":"为什么有这条语音","then":[],"skip":[]}]` |
| `call` | `["nico","call",{"cid":"来电人id","hint":"…","lines":[["来电人id","…"],…5–8句],"then":[...],"skip":[...]}]` |

**App 自带玩法（必须串进剧情）** `feature`：打开 App 里真实的玩法界面，玩完自动接剧情。
`["theo","feature",{"k":"snap|quiz|lie|heart|bottle","cid":"theo","hint":"为什么此刻要玩这个（写成剧情）","win":[玩得好之后的 2–4 句反应],"lose":[玩得不好之后的 2–4 句反应],"skip":[跳过时的 1–2 句]}]`
- `snap` 拍立得：和 cid 拍四连拍（固定算 win）。
- `quiz` 默契问答：5 道二选一，猜中 3 道以上算 win。
- `lie` 两真一假：猜出 cid 的那句假话算 win。
- `heart` 心跳测试：让 cid 心跳到 150 以上算 win。
- `bottle` 转瓶子真心话大冒险：转到谁就问谁，固定算 win（反应要通用，别依赖具体问题）。

**大事件卡** `["sys","event",{"icon":"⚡","title":"短标题","txt":"一句话"}]`：剧情急转直下的瞬间用（有人推门冲进来、停电、重大坦白）。全屏醒目卡片。每场 1–2 个。

条件分支（让之前的选择真的有影响）：
- 选项里写 `"set":"hinted_stay"` 给读者打标记。
- 之后用 `["sys","if",{"cond":{"flag":"hinted_stay"},"then":[...],"else":[...]}]` 走不同剧情。`cond` 也可以是 `{"love":["theo",20]}`（Theo好感≥20）或 `{"any":[...]}`。

## 三、本章长度与节奏

注意：本章新增的指令 `["sys","bg",{"img":"…"}]` 是切换背景图，不算句数。`feature` 写法：`["theo","feature",{"k":"snap|heart|bottle","cid":"theo","hint":"…","win":[…],"lose":[…],"skip":[…]}]`。`["sys","event",{"icon":"⚡","title":"短标题","txt":"一句话"}]` 是大事件卡。
完成标准：`python3 content/deep/validate3.py <场次>` 输出 `OK ✓`。
