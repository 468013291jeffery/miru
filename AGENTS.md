# AGENTS.md — 这个仓库的工程规矩（给自己、也给下一个 agent）

> **谁该读**：任何要在这个仓库里改代码的 agent（包括我、包括别的窗口、包括以后接手的 Claude / 别的模型）。
> **它回答的不是「这个项目是什么」**（那是 `README.md` / `ARCHITECTURE.md`），而是
> **「你可以怎么改，改完怎么证明没改坏」**。
>
> 来源：`ARCHITECTURE.md` §7（八个入口）· `docs/ENGINEERING.md`（与 Mythica 的对照）·
> `DIALOGUE-PIPELINE.md`（对话流）· `MERGE-RULES.md`（合并规则）· 以及 2026-10-27 那一夜**踩出来的**读数。
> 每条都带「判据」：**没有可数判据的规矩不要写进来**（写了也没人执行）。

---

## 0. 三十秒版

```bash
node tools/check-all.mjs          # 全闸（26+ 套）；不绿不许提交
node tools/read-health.mjs        # 运行时健康（要本地开过一次页面）
node tools/read-errlog.mjs        # 错误日志（2 分钟窗口）
```

改完代码再跑一次真浏览器（见 §4），**因为 `node --check` 与全闸都拦不住 bundle 级坏掉**。

---

## 1. 五条硬规矩

### ① 一个东西只能有一个入口（唯一咽喉）

同一个状态 / 同一条写入路径，**只许有一个写点**。今天已有的八个：

| 入口 | 治什么 | 读数 | 闸 |
|---|---|---|---|
| `TURN` | 「有没有回合在跑」 | `__turn()` 冲突次数 | `turn-wiring-check` |
| `PKST` | 章节状态四值 | `__pkst()` 非法迁移 | `pkstate-check` |
| `SAVE` | 存档写入 | `__save()` 最烧调用点 | `save-instrument-check` |
| `UI` | 渲染后动作（22 个具名钩子） | `__ui()` 钩子失败数 | `ui-entry-check` |
| `sanitizeMsgs` | 文本进 UI | `__soft()` | `sanitize-selftest` |
| 加载顺序 | 状态机必须先于绑定点 | 位置比较 | `wiring-order-check` |
| 猴补丁基线 | 新增包装要显式确认 | 148 函数 / 382 处 | `patch-registry --check` |
| 空 catch | 静默失败存量 | 576 处 | `empty-catch-check` |
| **on\* 事件绑定** | `el.onclick = fn` 会静默覆盖别人的处理器 | 硬类 0 · 软类 93 处 | `on-assign-check` |

**加新代码走入口，不要绕过。** 绕过一次，那道闸对你就失效了。

### ①·补 on* 事件绑定：不许在共享元素上覆盖

`el.onclick = fn` 与 `addEventListener` 不是同一件事：**它覆盖前一个处理器（不报错）、没有 remove、只能有一个**。
与「猴补丁层层覆盖」是同一个病 —— 没有入口，谁后写谁说了算。

分两类管（一刀切会把 `img.onerror` 这类天生形态也判死）：

| 类 | 形状 | 规矩 | 现状 |
|---|---|---|---|
| **硬类** | `window.onX =` / `document.onX =` | **必须为 0**（全站只认最后一个，别人的静默消失） | **0 处** ✓ |
| **软类** | 元素级 `el.onX =` | 只增不减；新增必须 `--write` 确认，或写进 `ALLOW` 并**注明理由** | 93 处 / 25 个文件 |

```
node tools/on-assign-check.mjs          # 人读：谁最多、用了哪些事件
node tools/on-assign-check.mjs --check  # 闸（check-all 里已挂）
```

读法：`img.onerror` / `xhr.onload` / `audio.onended` 这类一次性属性本来就只能是 on*；
**真正要警惕的是「共享元素」上的 on\***：它会静默盖掉别人的处理器，而你看不到任何报错。

对照读数：`addEventListener` **399 处** vs `on*` **93 处** —— 大头已经走托管路径，剩下的是历史存量。

### ② 不许静默失败

- JS 里 **不许写 `catch(_){}`**。要吞就用 `soft("位置", fn)` —— 吞但记名字与原因，`__soft()` 可读。
- 对象 / 未知形状进 UI 之前一律过 `asText70` / `objGuard70`：取不出人话就**不显示**，绝不显示 `[object Object]`。
- 失败要么有可见出口（用户提示 / 计数 / 日志），要么就是没处理。

> 判据：`node tools/empty-catch-check.mjs --check` 不许新增；`read-errlog.mjs` 窗口内必须为空。

### ③ 闸必须能红，而且必须真的在跑

三道坎，缺一不算闸：

1. **能红**：写完后造一次变异（把被判的东西改坏 / 删掉一行），看它红在**预期那条**，再复原。**手工做，每次三分钟。**
2. **在跑**：`node tools/check-all.mjs` 的**输出里必须看得见它的名字**。看不见 = 装饰品。
3. **有读数**：报的是数，不是态度（"更稳了"不算）。

> 2026-10-27 实测：有**两道闸**写好了但没挂进 `check-all`，十几轮「全绿」对它们一句都不算数。

### ④ 先量，再改；改完再量同一件事

- 改之前先拿一个**现在的数**（哪个文件、多少处、哪条路径）。
- 改之后再拿**同一个数**，说清它降了多少。
- 数与计划对不上就**停**——那通常是工具在做错事，不是"差不多"。
  （那天一次迁移报「42 处」，实际只有 8 处：脚本把自己生成的兜底代码又搬了 6 遍。）

### ⑤ 合并与并存：这个仓库不能两个人同时推

- `index.html`（9 MB 生成物）与 `tools/patch-baseline.json` **都被跟踪**，且每次构建重写 ⇒ **并发提交必然冲突**。
- 要并行 → **各推各的分支**，由一个人串行合并；**绝不「用我的版本覆盖远端」**（`MERGE-RULES.md`）。
- 改 `source/src/**` 之前先报一声（哪个文件、什么时段），避免两个 agent 改同一处。

---

## 2. 动手前的三个动作

1. **先搜有没有现成的**：`grep`/`glob` 走 `tools/` 与 `source/src/`；查「谁包了这个函数」用 `node tools/patch-registry.mjs`；
   查「这个读数有没有现成的闸」看 `tools/check-all.mjs` 的清单。**别新造装置，先确认没有。**
2. **看它在运行时的样子**：`__turn() __save() __ui() __pkst() __soft() __errlog()` —— 这些都是现成的探针，不用自己造。
3. **写清判据**：这一刀改完，**哪个数**应该变、变成多少。写不出就别动。

---

## 3. 迁移/批量改代码的固定套路（血换来的）

批量改源码时，以下四种坑在 2026-10-27 各踩过一次：

| 坑 | 形状 | 防法 |
|---|---|---|
| **自匹配** | 边替换边重新扫描 → 吃自己刚写的代码 | **先在原文上收集全部匹配，再从后往前替换** |
| **ASI** | `soft(…)` 行尾没分号 + 下一行以 `(` 开头 → 变成"调用返回值" | 生成的调用**一律带分号**；有 `soft-syntax-probe` 闸 |
| **沙箱** | 自检把某个函数**单独切出来 eval**，那里没有你的全局 | 调用点自带兜底：`(typeof soft==="function"?soft:fallback)` |
| **尺子自证** | 你查"字符串在不在"，而它绑没绑上完全另一回事 | 查**位置**（谁在前）与**运行时探针**，不查字符串 |

**任何批量改动，先 `--dry` 看一眼，改完 `node --check` 每个文件，再跑全闸 + 真浏览器。**

---

## 4. 验证门（每次改完，按顺序）

| 步 | 命令 | 判据 |
|---|---|---|
| 1 | `node --check <改过的每个 .js>` | 无 SyntaxError |
| 2 | `node tools/check-all.mjs` | `all suites passed`（含新闸，**且输出里看得见**） |
| 3 | 真浏览器：`msedge --headless=new --virtual-time-budget=15000 --dump-dom 127.0.0.1:8131/index.html` 并收 stderr | **`Uncaught` 计数 = 0** |
| 4 | `node tools/read-health.mjs` | 回合冲突 / 钩子失败 / 非法迁移 / 静默失败 **全 0** |
| 5 | `node tools/read-errlog.mjs` | 2 分钟窗口内 **0 条** |

> 第 3 步是唯一能发现「bundle 级坏掉」的一步：`node --check` 绿、全闸绿，页面照样可能白屏。

---

## 5. 文档矩阵（改完代码照着勾，别靠记性）

| 改了什么 | 必须更新 |
|---|---|
| 新增/移动入口、状态机 | `ARCHITECTURE.md` §7 + 本文件 §1 |
| 构建清单 `build.py parts` | `BUILD.md` + `ARCHITECTURE.md` §1 |
| 对话渲染 / 样式 | `docs/message-renderers.md` |
| 对话流（节奏/发声/落库） | `DIALOGUE-PIPELINE.md` |
| 调参键 | `TUNING.md` |
| 判据 / 评测 | `QUALITY.md` / `SPEC-AUDIT.md` |
| 新增闸 | `tools/check-all.mjs`（**必须出现在输出里**）+ `docs/ENGINEERING.md` |
| 与别的 agent 约定 | 本文件 |

---

## 6. 读数的四个入口（不要自己另造探针）

| 想知道 | 命令 | 说明 |
|---|---|---|
| 谁在包谁 | `node tools/patch-registry.mjs` | 148 函数 / 382 处，按加载顺序 |
| 空 catch 存量 | `node tools/empty-catch-check.mjs` | 基线在此，只降不增 |
| 行号归属 | `node tools/line2file.mjs <行号>` | `index.html:6833` → 源文件 |
| 运行时 | `__turn() __save() __ui() __pkst() __soft() __errlog()` | 浏览器控制台 |

**错误日志**：`app108_errlog.js` 收 `window.onerror` / `unhandledrejection` / `console.error`，
**保留 2 分钟窗口**（超时条目在每次写入时淘汰），本地落盘 `.browser-errlog.json`。

---

## 7. 禁令（违反即回滚）

1. 不许用「我的版本覆盖远端」的方式合并。
2. 不许把闸写成"永远绿"（无变异测试 = 不成立）。
3. 不许在 `catch` 里把硬错误变成没有痕迹的无操作。
4. 不许在没有判据的情况下宣布「修好了」。
5. 不许在没有真浏览器验证的情况下提交**影响 bundle 结构**的改动。
6. 不许把生成物（`index.html` / `content_36.js`）当源码手改。
7. 不许在全局（`window.` / `document.`）上用 `on*` 覆盖事件处理器。
