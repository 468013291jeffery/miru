# 模拟对话：怎么用、量到了什么（2026-10-28）

> 一件事：**不用真人在线，也能跑一段生产对话，看它像不像活人。**
> 工具 `tools/sim-dialogue.mjs`。它从**构建产物**里切出真实的 prompt 数组，所以规则段与块顺序都是线上那一份。

## 一、怎么跑（后台跑，别占前台）

```powershell
# 默认：gala 第 5 章 · 6 轮 · 用产物里的默认开关
node tools/sim-dialogue.mjs

# 指定剧本 / 章 / 轮数，并把报告写到指定位置
node tools/sim-dialogue.mjs --pack=gala --chapter=5 --turns=8 --out=reports/sim-gala5.md

# A/B：关掉章内推进（旧行为） vs 打开（新行为）
node tools/sim-dialogue.mjs --advance=off --tag=before
node tools/sim-dialogue.mjs --advance=on  --tag=after
```

一轮约 8–12 秒（串行调 `deepseek-chat`），8 轮约一分半。**跑法：后台 job，输出写文件**，
别在命令后面接 `| Select-Object -Last N`（那会让 stdout 沉默，被判 stalled）。

报告落在 `reports/sim-<tag>-advance<on|off>-<时间>.md`：读数表 + 逐轮全文。

## 二、它量什么（以及一个它量不出来的东西）

| 指标 | 这次读数（gala 第 5 章 · 5 轮） | 说明 |
|---|---|---|
| 相邻两轮 8-gram 重叠 | 0.0% | 表面文字**不**重复 |
| 引语复读（beat 开头重复上一句） | 0–3% | 不是"台词接力" |
| 以问号收尾 | 11–16% | 不是"每个角色都在反问" |
| 出现本章道具的轮数 | **5/5（两臂都是）** | ⚠️ **这条量不出差别** |
| 坏 JSON | 0–2 / 5–8 次（间歇） | 线上靠 `jsonLoose` 兜 |

⚠️ **"道具每轮都出现"这条指标失效**：两臂都是 5/5，但读全文能看出差别 ——
`--advance=off` 那版五轮全在同一张桌子上讨论"谁坐这把椅子"；
`--advance=on` 那版第 3 轮 Luca 已经站起来绕过桌角、朝后台侧幕走，话题转向后台的 Dana。
**同一把椅子还在，但它已经是"背景"而不是"唯一事件"。** ⇒ 道具出现率看不见场景是否推进，别再拿它当判据。

## 三、诊断：人机感与"总在重复剧情"的接线在哪

读代码得到的是**结构**，不是推断：

1. **章内没有推进器。** 章节状态 `pk.st` 只在两个地方翻页：`pkPick`（玩家做了官方选择，`app14_pack.js:162`）
   与 `packOpen`。**自由聊天永远不会翻它。** ⇒ 只要玩家不点官方选择，这一章在状态机里就是"没过去"。
2. **而 choose 状态那句提示词显式禁止推进**（`app14_pack.js:249`，旧版逐字）：
   > "Stay inside this moment: … do NOT jump to later chapters, do NOT resolve the chapter goal."

   一句"状态没变" + 一句"不许动"，两件叠起来就是**无限延长同一幕**。
   表面文字当然不重复（模型每轮都换措辞），但**事件始终是同一件** —— 这就是"总在重复剧情"。
3. 其余几条**不是**主因（这次量过了，别乱改）：
   - 不是"复述上一句"（0–3%）
   - 不是"每个角色都反问"（11–16%）
   - 不是语言漂移（那次 2 轮整句英文是**我的夹具漏了 `S.lang`**，补上后 0 轮）

## 四、改了什么

`app14_pack.js:249` 拆成两版，由 `MIRU_TUNE.chat.chapterAdvance` 控制（默认 **on**）：

- **off（旧行为）**：原文那三句 do NOT，一字未改 —— 想回滚就改 `tune.js`，不用重建。
- **on（新行为）**：
  > "Do NOT make that decision for anyone and do NOT resolve the chapter goal — but you MAY move this
  > chapter forward: end the beat, let minutes or hours pass, change rooms, bring someone in.
  > A chapter lasts many minutes; do not freeze the same instant across replies."

**边界没动**：仍然不许替玩家做官方选择、不许越到下一章。改的只是"这一幕能不能过去"。

## 五、还欠什么

- 一条**能看见推进**的读数（道具率不行）。候选：每轮首次出现的地点/时间词是否变化、
  或"玩家的问题在第几轮被正面回答"。**先定判据再跑，别先跑再找数。**
- 8 轮以上才看得出"长对话疲劳"，这次的 5 轮太短。
