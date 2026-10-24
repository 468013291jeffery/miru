# 他们 v7.12 / v8.2.4 的清单 ↔ 我们 `source/` 里的现状

> 用途：她要交给团队的那一份。**只回答一件事**——会议里列的那些，我们这边有没有、在哪一行。
> 口径声明（读之前请先看）：
> - 我核的是**本仓库的 `source/` 与 `api/`**（构建 `index.html` 的那一份），不是他们上传到 main 的那份 `index.html`。
> - 判据是**源码里有对应机制**，不是"线上跑通"。要有"线上跑通"的结论得另外验。
> - **没核到的**：① 剧本生产后台的四个步骤（那是他们工具链里的页面，本仓库没有）② 线上实际表现。

## 一、他们的清单 → 我们的代码

| 他们说的 | 我们这边 | 证据（文件:行） |
|---|---|---|
| 角色说话带尺度与情绪基调 | ✅ 有 | `source/src/app3_chat.js:240`（HEAT CEILING 行，过 `emotionNorm` 白名单） |
| 尺度按关系阶段取最低档 | ✅ 有 | `source/src/app3_chat.js:2` + `app98_emotion.js`（`heatGated` / 阶段下限） |
| 未确认成年 → 保守一档 | ✅ 有（今天刚开） | `source/src/app93_agegate.js`（首启五语确认 + `S.ageOk`） |
| ~~不可恋爱的角色不调情~~ | ⚠️ **我们改了，改得对** | 原来照他们的写（`app3_chat.js:182` 注入 "never flirt"）——**2026-10-25 Ann 否掉**：关恋爱线 ≠ 关掉人的魅力。现在注入的是「不进恋爱线、不给好感、不做亲密戏；但斗嘴、撩、被撩的反应全在；不许因为路线关闭把人写得冷淡无性」。`source/src/app95_status.js:65,68` 只管好感不涨 |
| 玩家拒绝不加好感、之后不主动靠近 | ✅ 有 | `source/src/app95_status.js:13`（`loveWrite` 的唯一写口，含 `opts.min` 冷却） |
| 好感/信任每轮 ±2 | ✅ 有（上限可调，默认 12） | `source/src/app96_tune.js`（`love.deltaCap`）+ `app95_status.js:13` |
| 工具解锁门槛 15/20/25/30/45 | ✅ 有（默认 0 = 不限，需设值） | `source/src/app95_status.js:84,88`（`toolGate`/`toolUse`，按场景限次 + 冷却 + 换章重置） |
| 角色不在场不能触发工具 | ✅ 有 | `source/src/app95_status.js:65` |
| "不知道的事"不写具体内容 | ✅ 有 | `source/src/app3_chat.js:179,183`（`castCardPublic` 去掉 secret/twist）+ `app97_card.js`（`knows` 分 fact/guess/self） |
| 先正面回应玩家最后一句，问了就必须回答 | ✅ 有 | `source/src/app71_narrative.js:29`（"BEAT 1 MUST respond to exactly that: answer the question…"） |
| 不施压、不让玩家内疚 | ✅ 有 | `source/src/app71_narrative.js:30,33` |
| 规则检查：不合法尺度/情绪标签直接报错 | ✅ 有 | `source/src/app98_emotion.js:21,67`（白名单 + 去重 + 暖/烈冲突报错） |
| 续写先校验再发布 | ✅ 有（结构层） | `api/_plan.js:88`（`planValid`，已接发布路径 `api/works.js`）；章节层 `api/_plan.js:127`（`planValidChapter`） |
| 剧本标签改了，缓存计划自动作废 | ✅ 有 | `source/src/app99_plan.js:31,74`（`MIRU_REV` 版本号比对，不一致即丢弃） |
| 规划结果先检查再用（场景变了就丢） | ✅ 有（判断层） | `source/src/app99_plan.js:42,57`（`planDecide`/`planTried`：每场景只试一次，出错不阻断） |
| 剧情事件账本 + 重复提交只算一次 | ✅ 有 | `api/events.js:59` + `api/_ledger.js`（`events` 表，幂等键） |
| 多设备冲突拦截 | ✅ 有 | `api/state.js:20,81`（状态写入带期望版本，冲突则拒绝） |
| token 用量记录 | ✅ 有 | `api/longcat.js` 记账字段 + `api/_ledger.js` 汇总 |

## 二、明确**没有**（或只有一半）

| 他们说的 | 我们这边 |
|---|---|
| 编剧后台第①步新增的六项填写（核心体验承诺 / 主线问题 / 行动自由度 / canon / 内容排除 / 是否允许续写） | ❌ 本仓库没有这个后台页面 |
| 第②步生成架构时补齐的秘密台账 / 伏笔台账 / 出章条件 / 软引导 / 亲近机会 | ❌ 同上（我们的对应物是 `source/content/*` 里的人工内容 + `PLOT98` 的场景计划） |
| 第③步逐条报错 + 上线否决项 | ⚠️ 部分：结构校验有（`content/validate.py` + `api/_plan.js`），**"上线否决项"没有** |
| 第④步 17 项交稿必测清单 | ❌ 没有 |
| 角色卡「调情的四种写法」「成长弧」 | ⚠️ 部分：角色卡有五类字段（`app97_card.js`），但**没有专写这两项** |
| 规划"卡住时给 2-3 种回应" | ❌ 没有（`PLOT98` 的计划只是候选章节，不生成引导话术） |
| 续写带"已发生不可推翻"清单 | ✅ 有（2026-10-25 补） | `source/src/app94_replyguard.js` 的 `canonFacts(wid,ch)`：只取**已经过去**章节的 reveals/breaks（未来章节的同一批词是禁区，同源反向）+ 已有的各章 `mem` 合成 `app14_pack.js` 的 WHAT HAS HAPPENED 块；`tools/plot-generate-probe.mjs --dry` 可零成本核对它进没进去 |
| 台词检查（说了不该知道的 → 重写一次 → 保守回答） | ✅ 有（2026-10-25 补） | `source/src/app94_replyguard.js`（`marksForbidden` 取未来章节的 reveals/breaks + 卡片 secret/twist → `guardReply` 重写一次 → 仍命中落保守句）+ `app3_chat.js:257` 接进对话流 + 开关 `chat.replyGuard`；15 条自检 |
| 默认尺度 暧昧→微辣 | ❌ 不适用（我们没有那个新建表单） |

## 三、一句话结论

**他们这份清单里，运行时那一半（角色行为、尺度、工具、账本、多设备、续写校验）我们基本都有，
且多数比清单写得更细；编剧后台那一半（四步生产流程、17 项清单、伏笔/秘密台账）我们没有，那是他们的工具链。**

⇒ 交给团队时建议的说法：**「运行时这部分我们已经实现且有自检，可以对照验收；生产后台那部分按你们的走。」**
