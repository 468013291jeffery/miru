# 状态写入层（STATUS LAYER）

> **一句话**：好感（`th.love`）这类「会变的状态」只允许**一个函数**写，其余地方只能说"我提议加多少"。
> 规格出处：v7.11 §04.6「状态投影的唯一写入点」。对账记录：`SPEC-AUDIT.md` #11。

## 为什么需要它

对账时数出来：**`th.love` 有 29 个直接写入点，分布在 7 个文件**。其中两条最典型：

```js
// app14_pack.js  剧情选项： A +9 / B +4 / C -4
// app3_chat.js   模型自己： +0..6，只增不减
```

后面还叠着礼物、约会、真心话、心率小游戏……每个都独立加分。后果是三个，而且都很贵：

1. **好感涨得比剧情快** —— 玩家还没经历什么，数值已经满了；
2. **同一局玩两次，结果不一样** —— 没法复现，投诉查无实据；
3. **出问题找不到是谁加的** —— 29 个匿名写口，没有一个是"可归因"的。

## 契约（五条）

1. 任何 `th.love[x] = …` 一律改成 `loveWrite(th, x, delta, reason)`。
2. **直接写入的处数只许降、不许升**（棘轮，基线写在 `tools/status-contract.mjs`）。
3. 每次写入留一条 `loveLog`：谁改的、改了多少、为什么。
4. 单次增量上限 `LOVE_DELTA_CAP = 12`；超过说明剧本写错了，不是玩家玩错了。
5. 绝对值/下限请走 `opts`，不要在调用处自己 `Math.max`——那是 29 个写口的来源。

## API

```js
loveWrite(th, id, delta, reason, opts) -> {before, after, delta, skipped?}
//   delta    增量，正负都行
//   reason   来源标记：'model:proposal' | 'pack:A' | 'ending:A' | 'gift' | 'date' | …
//   opts     {absolute?: number, floor?: number, cap?: number}
//            absolute —— 直接给目标值（仍会被夹进 0..100）
//            floor    —— "至少到这么多"，语义 = Math.max(旧值, floor)
//            cap      —— 覆盖本次的增量上限

loveReport(th) -> {writes, per:{ [id]: {n, net, reasons:{reason: 净变化}} }}
```

`opts.floor` 是专门为原来那句 `th.love[cid] = Math.max(th.love[cid]||0, 80)` 准备的——
它**不是**"设成 80"，而是"至少 80"。写成 `{absolute:80}` 会把已经 90 的人拉回 80，是错的。

## 现状与进度

| 项 | 数 |
|---|---|
| 起始直接写入点 | 29 |
| 已收敛到 `loveWrite` | **18 处**（模型提议、模型隐式 +1、剧情选项、结局加成、礼物×2、约会×2、真心话、心率、两真一假、匿名问答、从没玩过、同步问答、邀请入场、初始值×2） |
| **剩余直接写入** | **11 处**（棘轮基线；其中 3–4 处是 `_undo` 快照之类并非真写入） |
| `loveWrite` 调用点 | **18** |

收敛顺序建议（按影响面）：

1. ~~剧情选项、模型提议、结局加成~~ ✅
2. ~~礼物 / 约会 / 真心话 / 心率 / 匿名问答 / 邀请入场 / 初始值~~ ✅（2026-10-25 第二批）
3. 小游戏遗留（`app6_games.js:106`、`app73_features.js:48,74`）
4. 关系模块（`app45_rel.js` 3 处）
5. `app4_more.js:466`（分集入口的初始值 `5+(ep-1)*15`）

每收敛一批，把 `status-contract.mjs` 里的 `BASELINE` 改小；**只降不升**。

## 怎么验证

```bash
node tools/status-contract.mjs --selftest
```

它做三件事：
- 数直接写入（排除 `app95_status.js` 自己）并与基线比；
- 断言写入口存在、做了夹值、留了痕、且模型那条已经走入口；
- `--selftest` 会**变异一次**（凭空多写一处）——必须被抓住，否则这条闸是装饰。

已挂进 `node tools/check-all.mjs`（第六套）。

## 怎么加一个新的写口（三步）

1. 调用处写 `loveWrite(th, id, delta, '<来源>')`，**不要**自己算 clamp；
2. 跑 `node tools/status-contract.mjs` —— 直接写入数不许变多；
3. 如果是新来源，把 `reason` 加进本节上面的列表（审计时按它分组）。

## 未验 / 缺口

- **没有在真浏览器里跑过**：本机没有后端，`loveWrite` 目前只经静态契约 + 构建验证。
- **`loveLog` 只活在会话内存里**，刷新即失；要复盘得等它落进 `memories` 或账本（那是下一步）。
- **`dims`（att/tru/jea/ten/gru 五维）还没有走这一层** —— 它和 `love` 是两套数值，收敛时机是等 `love` 的棘轮降到 10 以下再动，否则一次动两张表风险太高。
- 单次上限 12 是**经验值**（最大的一处是剧情 A +9），不是从数据里量出来的；有了真实账本之后应该按分布重设。
