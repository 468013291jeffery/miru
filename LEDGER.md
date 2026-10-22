# 账本（LEDGER）

> **它回答什么**：哪一章劝退、哪个选项没人走、玩家在第几秒离开、哪部剧值得继续投。
> **它怎么交付**：一条命令导成 CSV，能在 Excel / Sheets / 任何脚本里复核。

---

## 1. 现在有什么（别重复造）

| 已有的 | 在哪 | 能答什么 |
|---|---|---|
| `track(name, props)` 前端埋点 | `source/src/app68_cloud.js:118` | 攒够 20 条 flush 一次 |
| `POST /api/events`（≤50 条/批） | `api/events.js` | 写进 `events(user_id, name, props jsonb)` |
| `GET /api/events?days=7` | `api/events.js` | **只有**「事件名 × 次数 × 人数」 |
| 15 个事件名 | `app_open` `auth_view` `login` `register` `taste_done` `hook_play` `story_start` `talk` `purchase` `store_open` `publish` `upload` `community_open` … | 漏斗的大致形状 |

**缺的三样**（今晚补的）：**选项**、**时间**、**能导出的明细**。

## 2. 账本 = 三种事件 + 一张表 + 一个汇总

### 事件（`props` 里的字段就是账本的列）

| 事件 | props | 什么时候发 |
|---|---|---|
| `chapter_open` | `{wid, ch, sess, t}` | 进第 ch 章 |
| `choice_pick` | `{wid, ch, sess, key:"A"\|"B"\|"C", t}` | 点了选项 |
| `chapter_done` | `{wid, ch, sess}` | 第 ch 章走完（不是"点到最后一句"，是"结算/进下一章"） |
| `story_end` | `{wid, sess, ending:"A"\|"B"\|"C"}` | 到达结局或退出 |
| `paywall` | `{wid, ch, sess}` | 付费墙**被展示**（走不走得过另算） |

`t` = 客户端 epoch ms（只作漂移诊断），`sess` = 一次「开始到退出」的随机 id。

### 表（CSV，10 列固定）

```
user,session,work,chapter,event,choice,ms,client_at,server_at,props
```

### 汇总（`api/_ledger.js: summary()`）

每部剧 → 每个章节：`opened` / `done` / `done_rate` / `median_ms` / `choices{A:{n,share}…}`，
每部剧：`sessions`（有 `chapter_open` 的会话数）。

## 3. 口径铁律（这五条决定账本能不能用）

1. **分母 = 有 `chapter_open` 的会话。** 只发了 `story_start` 就跑的人算「漏斗第一格掉下去」，**不算一个会话**——否则所有完成率都被稀释。（自检里有一条专门盯这个：`ghost has 0 sessions`）
2. **时长用服务端时钟**（`events.at` 的差），客户端 `t` 只用来发现时钟漂移。手机时钟不可信。
3. **每个比率都要带分母与窗口**（`3/3` 与 `2/3` 都是 0.667 的时代已经过去）。
4. **导出必须可 diff**：选项键按字母序输出，同样的输入永远产出同样的 CSV。
5. **`props` 上限 2000 字符**：超了**不是截断 JSON 字符串**（那会造出非法 jsonb、把整批打挂），而是按白名单 `wid/ch/sess/key/ending/ms/t/sku` 裁剪并打 `_trunc:1`。

## 4. 怎么导出

### 4.1 后台点按钮（给人用）

管理后台 → **用户池** → 点某一行 → 抽屉里的 **「玩法数据」** 标签：

- 每部剧一行标题（会话数 / 事件数），下面一张表：**章 · 进章 · 完成 · 完成率 · 中位时长 · 选项分布**
- 右上角下拉：`最近 50 / 200 / 500 / 1000 / 5000 条` + **「下载对话 txt」** 按钮
  → 导出这个人的对话（`.txt`，带时间戳、角色名、线程标题；`think` 标成「（心里）」，卡片和图片变成 `[标签]`）
- 每次导出会写一条后台审计日志 `export_transcript`（谁、导了谁、多少条）——这是隐私红线，不能静默

### 4.2 命令行（给脚本用）

```bash
# 单个人的玩法数据
curl -H "X-Admin-Key: $ADMIN_KEY" \
  "https://miru-wheat-pi.vercel.app/api/admin?r=user_ledger&id=<uid>&days=90"

# 单个人的对话 txt（最近 N 条）
curl -H "X-Admin-Key: $ADMIN_KEY" \
  "https://miru-wheat-pi.vercel.app/api/admin?r=user_transcript&id=<uid>&limit=200" -o who.txt

# 全体明细（CSV）/ 汇总（JSON）
curl -H "X-Admin-Key: $ADMIN_KEY" "https://miru-wheat-pi.vercel.app/api/events?export=csv&days=30"
curl -H "X-Admin-Key: $ADMIN_KEY" "https://miru-wheat-pi.vercel.app/api/events?summary=1&days=30&work=ice"
```

**对话从哪来**：`/api/state` 存的云存档（`states.data`，≤900 KB）里的 `threads[].msgs`。
也就是说——**没有云存档的账号读不到对话**（本地未登录 / 没同步的人），那时会明确回「这个账号还没有云存档」，不是空文件。

导出来的 CSV 现在能回答：

- 每章 **进章人数 / 完成人数 / 完成率**
- 每章 **中位停留时长**
- 每个选项 **被选次数与占比**
- 每条事件 **服务端时间**（排序、重放、乱序都能看出来）
- **留存 D1 / D7**（`?summary=1` 的 `retention`）
- **付费门槛通过率**（`?summary=1&chapter=3` 的 `gates`）

### 4.3 两个要特别小心读的数

| 读数 | 怎么算 | 什么时候不能信 |
|---|---|---|
| `retention.d1` / `.d7` | 队列 = 该用户**在窗口内第一次出现的那一天**；只有「队列日 +1 / +7 仍在窗口内」的人才进分母 | 窗口太短 ⇒ 分母 0（返回 `null`，不是 0）。**D7 在 7 天窗口里永远是 null**，那是对的 |
| `gates.rate` | 进过第 3 章且**走完**第 3 章的会话 / 进过第 3 章的会话 | 它只回答「有多少人过关」，不回答「墙有多贵」。要看墙本身看 `gates.left_at_wall`（被展示过墙、却没走完的人），那个数在补了 `paywall` 事件之后才有 |
| `gates.left_at_wall` | `wall - passed`（只数被展示过墙的会话） | 没有 `paywall` 事件时它返回 `null` 而**不是 0** —— 「没量到」与「没有人卡在墙前」必须能分开 |

## 5. 自检（数字得能自己证明自己）

```bash
node tools/ledger-selftest.mjs     # 39 条，2026-10-22 全绿
```

它先给一张**手算得出的假账本**（3 个会话、两部剧、一次中途退出），再断言每个读数；
最后跑**五条变异对照**：把 u2 的 A 改成 C ⇒ 选项占比必须变；删一条 `chapter_done` ⇒ 完成率必须降；
改选项 ⇒ 完成率**不许**动；让 b 多回访一天 ⇒ D1 必须从 2/3 变 3/3；让 u2 走完第 3 章 ⇒ 门槛通过率必须从 0.5 变 1。

## 6. 还缺什么（明写，不装绿）

1. ~~埋点还没接~~ → **已接（`814a2fb`）**：四个事件在 `app14_pack.js` 的 `packPick` / `packAfterPick` / `pkOpenMark` 里发出，
   自检四条覆盖（`events-contract` 10 条 · `events-selftest` 11 条 · `pack-flow-selftest` 15 条 · `ledger-selftest` 43 条，**全部跑在从构建产物里切出来的真函数**上）。
   **未验**：没在真浏览器里点完一局（本机没有后端，账号/存档都走不通）。
2. **`chapter_done` 的语义已定**：**选项的后果演完**（`packAfterPick`）才算这一章完成，不是"翻到下一章"。
   那条老的代理埋点（打开第 n 章就报第 n-1 章完成）**已删除**——它会和精确事件重复计数，而且永远报不出最后一章。
3. ~~没有留存/回访口径~~ → **已加（`retention()`）**：队列按「窗口内第一次出现那天」算，且**队列日 +1 / +7 不在窗口内的人不进分母**（否则 7 天窗口会报 D7=0，而那是未来还没发生）。自检里有一个变异对照专盯这条。
4. ~~付费只有 `purchase` 一个点~~ → **已补 `paywall`（`packPaywall` 展示时发）**：`gates()` 现在给出 `wall`（墙被展示的会话数）与 `left_at_wall`（展示了却没走完）。
   **仍然缺**：钱包消耗曲线；以及「点了购买但没付成功」这一段（现在只有 `purchase` 成功那一个点）。
5. **线上一次都没跑过**：本机没有数据库。
   - `_ledger.js` / `_transcript.js`（纯函数）已由自检覆盖（39 条）；
   - `admin.js` 两条新路由只做过语法检查，**没有对着真库跑过**；
   - `admin.html` 只验到**能启动到登录页**（Vue / Element Plus 都挂上了，说明新标签页的模板没有语法错），**用户抽屉里那一栏没有在登录态下真点过**。
6. **数据量**：`export=csv` 默认上限 20 万行；超过就得按 `work` 分批导。
