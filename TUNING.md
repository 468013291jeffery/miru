# 可调参数（TUNING）

> **一句话**：能影响玩法的数字全在 `source/src/app96_tune.js` 的 `DEFAULTS` 里；
> 想改就写进仓库根的 `tune.js`，**保存即生效，不用重新构建**。

## 怎么改（三步）

```js
// tune.js —— 只写你要改的键，其余保持默认
window.MIRU_TUNE_OVERRIDE = {
  pay:  { packPrice: 60 },
  love: { deltaCap: 20 }
};
```

1. 改 `tune.js`；
2. 刷新页面（**不用** `build.py`、不用重新部署）；
3. 在控制台看 `MIRU_TUNE._overridden` —— 它就是你这次覆盖了什么，没生效的一眼能看出来。

**拼错的键会被忽略**（`packPrice` 写成 `packprice` 不会静默生效，也不会污染默认值）。

## 现在有哪些滑钮

| 段.键 | 默认 | 改它会影响什么 | 风险 |
|---|---|---|---|
| `pay.packPrice` | 50 | 解锁整包要多少钻石 | 改了对**已购用户**不回溯，历史账不会重算 |
| `pay.topupUnits` / `topupCost` | 100 / 24 | 充值到手多少单位 / 花多少钻石 | 与价格一起改才等价 |
| `pay.trialUnits` | 24 | 试用单位 | 太低 ⇒ 免费玩家在第一幕就用完 |
| `pay.plusUnits` | 250 | MIRU+ 每月单位 | 订阅价值的全部 |
| `pay.packUnits` | 120 | 整包含多少单位 | 同上 |
| `pay.freeChapters` | 2 | 免费章节数（第 3 章起收费） | **改动会改变付费墙位置**，也影响 `gates` 那套读数的分母 |
| `pay.endingNeed` | 4 | 到结局需要几次 A 选项 | 太低 ⇒ 结局容易拿到；太高 ⇒ 玩家觉得不可达 |
| `ai.costNormal` / `costDeep` | 1 / 3 | 每轮消耗的单位 | 与「一轮几次调用」相乘才是真成本 |
| `chat.transcript` / `transcriptPlus` | 20 / 60 | `STORY SO FAR` 带多少条消息 | 调大 ⇒ 上下文更长更连贯，也更贵；**调小到 1–2 条会明显失忆** |
| `chat.partMergeMax` | 5 | 同一段文字合并成几块为止 | 调大 ⇒ 更少气泡、更连贯；调小 ⇒ 更像即时聊天但更碎 |
| `tools.giftPerScene` / `datePerScene` / `truthPerScene` | 0 | 每个工具**本场**可用几次（0=不限，旧行为） | 调成 1 ⇒ 一章只能送一次礼物；玩家会感觉到「被限制」，但能挡住刷好感 |
| `tools.ageGate` | **true** | 年龄门：开着时**未确认成年**把 heat 上限压到 slow（fluff 不动） | 2026-10-25 起默认**开**（Ann 拍：等于免责声明）。未确认 ⇒ heat 上限压到 slow，首启问一次并存下答案 |
| `tools.cooldownMs` | 0 | 同一工具两次之间的冷却（毫秒） | 与上面三个配合；单开它等于「限速不限次」 |
| `chat.privateCards` | 1 | **CAST 里带私密面（秘密/矛盾点）的角色数** | 调大 = 更多人带着秘密上场（更像旧行为）；调小到 1 = 只有这一拍上场的那个。**这一格直接决定“同屋全知”有多严重** |
| `love.deltaCap` | 12 | 单次好感变动上限 | 大于剧本里最大的一处（目前 A 选项 +9）才不起作用 |
| `love.min` / `love.max` | 0 / 100 | 好感范围 | 关系冷却那条路会显式传 `min: cooldownMin`，不受这里影响 |
| `love.cooldownMin` | -60 | 关系「冷下来」那次写入的下限 | 调浅 ⇒ 关系崩不了；调深 ⇒ 一次翻脸就归零 |
| `love.stageMin` | [0,20,40,60,80] | 关系阶段门槛（closeness → stage） | 改了会改变角色说话的"熟悉度"档位 |
| `affinity.cap` | 15 | 每天"额外好感"的上限 | 防刷的闸，调大等于放开 |
| `affinity.mind` / `gems` | [1,2,3,5,5] / [0,5,10,15,20] | 各档位的心智/钻石 | 与 `cap` 一起读才有意义 |
| `report.omniscienceThreshold` | 0.10 | **只给分析脚本用**：缺口超过多少才值得做"每角色一份 payload" | 不影响运行时 |

## 情绪合同（不在 tune.js 里，在 `app98_emotion.js`）

`emotionNorm({heat, emotions})` 返回 `{heat, emotions, errors, notes}`：缺省 `steamy/[angst]`、白名单、去重、暖烈冲突报错、超两个截断。
**合法值原样通过**，所以它不影响现有 37 部剧本；它的价值在于「非法值不会静默变成别的东西」。

## 规矩（新增一个可调数字时）

1. 先加进 `app96_tune.js` 的 `DEFAULTS`，**再**在调用处读 `MIRU_TUNE.<段>.<键>`；
2. 调用处**不许**再写字面量——`tools/tune-selftest.mjs` 会盯那几个老位置；
3. 在本文这张表里补一行：默认值 + 影响什么 + 风险。

## 自检

```bash
node tools/tune-selftest.mjs      # 24 条：默认值 / 覆盖生效 / 拼错被忽略 / 调用处确实读它 / 字面量已清走
```

最后一条是**变异对照**：把字面量塞回源文件，这条必须红。已挂进 `node tools/check-all.mjs`。

## 注意（三件容易误解的事）

1. **`tune.js` 是部署级的，不是用户级的。** 同一份部署的所有用户共享它 —— 它不能拿来做 A/B 实验；要做实验得走另一条路（按用户分流 + 埋点）。
2. **服务端有自己的一整套。** `api/*` 里的阈值（比如举报下架阈值）读的是数据库配置与环境变量，**不受这里影响**，要分别改。
3. **改了价格不等于改了历史账。** 已经买过的用户、已经发出去的钻石不会被重算；账本里会同时存在两个价格时代 —— 报数时要把 `created_at` 切开。

## 服务端那一套（机制不同，别混）

前端滑钮改 `tune.js` 就生效；**服务端不行**，它有两套机制：

| 机制 | 用在哪 | 怎么改 |
|---|---|---|
| **数据库配置**（`config` 表） | 能查库的接口 | 管理后台 → 配置（`/api/admin?r=config`）；改完 30 秒内生效（`config()` 有 30s 缓存） |
| **环境变量** | edge 热路径 | Vercel → Settings → Environment Variables；要重新部署 |

目前这几格：

| 键 | 默认 | 在哪读 | 改它影响什么 |
|---|---|---|---|
| `state_max_kb` | 900 | `api/state.js` | 云存档单账号上限；超了返回 413 并**报出当前上限** |
| `max_pack_kb` | 1500 | `api/works.js` | 发布作品时的 pack 上限；超了 413 |
| `first_token_ms` | 22000 | `api/longcat.js`（**env `MIRU_FIRST_TOKEN_MS`**） | 等上游第一个 token 多久放弃并换下一个 provider |
| `earn_cap` | 80 | `api/wallet.js` | 每天免费钻石上限（原来这里还有第二个写死的 80，已清掉） |
| `report_threshold` / `publish_daily_limit` / `upload_daily_limit` / `skus` / `upload_price` / `welcome_gems` … | 见 `api/_lib.js` 的 `CONFIG_DEFAULTS` | 各接口 | 老早就外置了，只是以前没人列出来 |

**为什么 `first_token_ms` 走 env 而不是库**：它在 edge 运行时、每次请求都要读，为它多查一次库不值得。
代价是改它要重新部署 —— 这一格是"便宜"换"不灵活"的自觉选择。

**没外置的**：`api/state.js` 的 `TYPES`（七类记忆类型，改了要动语义）、`app31` 里的乐理参数（bpm/音阶，那是内容不是旋钮）、`app21` 的五维取整系数（0.5，改了等于换一套成长曲线）。这些**故意留成字面量**，理由写在这里，避免下次有人"顺手外置"。
