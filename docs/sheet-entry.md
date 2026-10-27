# 弹层入口（sheet）：先量（2026-10-27）

> Ann 那句「UI 出问题，纯粹也是因为我们没有做整合、没有做工程优化、没有做入口」。
> 渲染链（`docs/msg-render-registry.md`）和样式（`docs/style-entry.md`）已经收口，这是**第三块**。
>
> 这一份**只有读数，一条都没改**。复跑：`node tools/sheet-census.mjs`（只读、静态、不用浏览器）。

---

## 一、读数

```
入口           sheet(html,onMount) 定义在 app1_core.js:42
               定义体第一句就是 closeSheet()  ⇒ **结构上不可能叠两个弹层**
               被包过 1 层：app70_login.js:316        ← 连入口本身都被包了
closeSheet     app1_core.js:45 · 被包过 1 层（app64_entry.js:62）· 直接调用 109 处
直连 sheet(    119 处 / 43 个文件（最集中：app3_chat ×23 · app4_more ×9 · app14_pack ×7 · app23_heir ×7）
绕过入口改结构  32 处（自己摸 `.sheet-card` / `.sheet .plans` / `$("#cards")`）
具名弹层       45 个，其中 9 个被包过
```

> ⚠️ **这一节改过两次，因为尺子错了两次。**
> 第一次报 `menuSheet` **14 层**：包装行长这样 —— `const _menuSheet45=menuSheet;menuSheet=function(){…}` ——
> **一行里出现两次 `menuSheet`**，我按「那个词出现了几次」计数 ⇒ 每层被数成两层。
> 第二次去重后报 **7 层**，仍然不对：普查只认 `NAME=function(){…}` 这一种写法，
> 而 `NAME = (function (orig) { return function () {…} })(NAME)` 这一族**整族漏掉** ——
> `app11_memory.js:35` / `app77_memory2.js:171` / `app79_ledger.js:138` 都是这种写法。
> **真值是 8 层**（`grep 'menuSheet\s*='` 直接数出来的，不依赖我的正则）。
> ⇒ 教训两次是同一个：**计数的单位与写法覆盖面，比数字本身更要先定死**。
> 这一族漏掉的代价是实打实的 —— 搬完 4 个 `top` 块之后快照当场红（ledger 那层插在更前面），只能回退。

## 二、真正的接缝不是 `sheet()`，是那 45 个具名弹层

第一版我以为痛点是「119 处直连 `sheet()`」。量完发现不是 —— 入口只有一个、而且它自己保证不叠。
**痛点在它上面一层**：每个具名弹层（`menuSheet` / `paySheet` / `startSheet` …）各自是一根接缝，
被后来的文件一层层包（已去重，数字是真的）：

| 弹层 | 被包层数 | 直连调用 |
|---|---|---|
| **`menuSheet`** | **8** | 3 |
| `startSheet` | 3 | 9 |
| `memSheet` / `authSheet70` / `imgSheet` / `dirSheet` / `usSheet` / `dateSheet` / `cardSheet` | 1 | 0–5 |
| `paySheet` / `shareSheet` / `m2Sheet` 等其余 | 0 | 3–11 |

**`menuSheet` 被 8 个文件各包一层**。它不是最大的那个数（`msgHTML` 是 20 层、剧本指令是 26 层），
但它是**同一个具名函数上的最多层**，而且这 8 层里有 7 层是同一种形状：
`const _menuSheetNN=menuSheet; menuSheet=function(){_menuSheetNN(); …加一块 UI…}`。

⇒ 于是「菜单里到底有哪些项」这件事，**没有任何一处能回答**。
要改菜单得读 8 个文件；要删一个项得先确认没有第 5 层又把它加回来。
（8 层还没到该惊慌的量级 —— 它的价值在于**形状**：再加 5 个功能就变成 12 层，而那时再拆要贵得多。）

## 三、10 个层逐个定性（已做完，只读）

`grep 'menuSheet\s*='` 一共 10 处。2 处已搬进注册表（`app48` / `app95`，都是 `beforeend`），
剩下 8 处逐个读完，**动作只有三种**：

| # | 文件:行 | 动作 | 位置 | 备注 |
|---|---|---|---|---|
| 1 | `app11_memory.js:35` | 插「记忆空间」按钮 | **afterbegin** | IIFE 形态（普查曾整族漏） |
| 2 | `app45_rel.js:122` | 人设 + 回退 + 反馈 + 分享 + 打磨（3 个按钮拼一串） | **afterbegin** | 曾经裸 `return;` 吞返回值 |
| 3 | `app46_cp.js:44` | **改** `app45` 刚建的 `[data-rewind]` 里的文字 | 改已有块 | **不是加块** ⇒ 不进注册表 |
| 4 | `app47_chapters.js:33` | 章节目录 | **afterbegin** | |
| 5 | `app49_creator.js:200` | 回工作台 | **afterbegin** | |
| 6 | `app77_memory2.js:171` | 记忆 2 按钮 | **afterbegin** | 幂等守卫 `!s.querySelector("[data-m2open]")` |
| 7 | `app79_ledger.js:138` | 台账按钮 | **afterbegin** | 幂等守卫 `!s.querySelector("[data-ledopen]")` |
| 8 | `app96_social.js:238` | 恋爱人格 + 私信 | **afterbegin** | |

⇒ **7 层是 `afterbegin`、1 层是「改别人建的东西」**。这个比例本身就是结论：
注册表只需要管「按序插」这一件事，`app46` 不属于它。

### 执行顺序怎么定（上一轮就栽在这里）

不是文件名顺序，而是**包装 post-work 的顺序 = 注册（加载）顺序**：最外层的包装最先被调用，
但**最后**才做自己的活 ⇒ post-work 从最内层往外跑。`parts` 里的相对顺序是
`app11 → app45 → app46 → app47 → app48 → app49 → app77 → app79 → app95 → app96`。

**有一个实证，不是推的**：上一轮把 `45/47/49/96` 搬进注册表后，**`app79` 的按钮跑到了最前面**
（快照 diff 直接指出来）。这只有在「`app79` 比它们更晚执行」时成立，与 parts 顺序一致。

⇒ 搬的时候按这个顺序登记，7 个 `afterbegin` 逐块插，最终 top→bottom 就是
`app96 → app79 → app77 → app49 → app47 → app45 → app11`，与今天逐字节相同。

**② 「改别人刚建的东西」那层的隐式耦合**（`app46` 依赖 `app45`）：`app45` 的守卫一不成立，
`app46` 就安静地什么都不做。这类「靠前一层留下 DOM 才能工作」的写法，是这些层叠起来之后最难查的。

## 四、快照闸（已造好并挂进 check-all，第 41 套）

```
node tools/sheet-snapshot.mjs            # 拍基线 → tools/sheet-baseline.json
node tools/sheet-snapshot.mjs --check    # check-all 里跑这个
```

7 个弹层各开一次，`.sheet` 的 `outerHTML` 逐字节比：

```
menuSheet 2929 · memSheet 2110 · usSheet 3278 · dirSheet 1558
cardSheet 630  · startSheet 1844 · paySheet-promo 2387   （字符数）
```

**怎么让弹层真的画出东西**（这是整件事唯一的难点，也是判据②存在的理由）：

- `curT` 是 `let`（`app3_chat.js:27`）⇒ **不是 window 属性，从外面改不了**；
- `S` 同样；但 **`openThread(id)` 是函数声明**、在 window 上，它内部会设 `curT` ⇒ 走它；
- 各层要看 `th.pk` 才动手 ⇒ 造完线程后**直接给那个对象挂 `th.pk`**（app 读的就是同一个对象）；
- 角色 id 不能用编的：`newThread('solo','c')` 会在 `wd(c.w)` 上抛
  `Cannot read properties of null (reading 'w')` ⇒ 探针先试几个真名，再退回 `S.mine.chars` 的第一个键。

不这么做的话，`menuSheet()` 里 `S.threads[curT]` 拿到 `undefined`，所有层被 `if(!th)` 挡掉
⇒ **快照全空且"一致"**。所以判据②（每个弹层必须有内容）是这条闸的主心骨，不是补充。

**三条判据全部验过**：

| 判据 | 结果 |
|---|---|
| ① 逐字节一致 | 两次独立浏览器跑 → 7 个弹层全部相同 |
| ② 必须非空 | 第一版就全非空（630–3278 字符）；空的话立刻报「那一刻没弹出来」 |
| ③ 变异要红 | 给 `app48` 那层的 `beforeend` 串前插 `<!--m48-->` ⇒ **只有 `menuSheet` 那张红**（2929 → 2939，并打印首个差异位置与上下文）；还原后复绿 |

**射程（写在明处）**：只覆盖上面 7 个弹层、且只用一个「带 pk 的 solo 线程」造场景。
需要真实消息对象/真实章节的（`imgSheet` 之类）**不在快照里** —— 别把它读成"弹层都验过了"。

## 五、附带读数：32 处绕过入口

它们不调用 `sheet()`，而是自己去摸弹层内部结构（`.sheet-card` / `.sheet .plans` / `$("#cards")`）。
这跟 `msgHTML` 那边 `.bub` 的故事同族：**入口就在那儿，但它们选择了绕过它** ——
所以任何「在入口上加一条规矩」的做法，对这 32 处都无效。

## 四、要做成什么（还没做）

形状照 `PKREG` / `MSGKIND`（这两个都是「表 + 读数 + 闸 + 变异」，都已经跑了一整天）：

```js
SHEET.def('menu',   function(){ … 原始菜单 … });        // 一份定义
SHEET.add('menu', 'app11_memory.js', function(h){ …; return h });   // 追加，不许覆盖
__sheet()          // 每个弹层：谁加的、加了几块、有没有互相覆盖同一个块
```

判据（先写死，动手之前就这样定）：
1. **同屏渲染结果逐字节一致** —— 照 `render-snapshot` 的做法，给每个弹层各拍一张 HTML 快照；
2. **每个追加层必须被点名**，且能答「它加的是哪一块」——答不出来的层，就是下一个不知道谁加的项；
3. **变异**：把某一层的追加内容改一个字，快照必须红；把某一层删掉，必须红在某些具体字符上。

## 五、顺序

先只读、再分类、最后才动。**8 层先分成「加的是不同块」和「改的是同一块」两堆** ——
前者可以机械搬进注册表，后者必须人看（谁该赢）。这一步还没做。
