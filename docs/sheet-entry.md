# 弹层入口（sheet）：先量（2026-10-27）

> Ann 那句「UI 出问题，纯粹也是因为我们没有做整合、没有做工程优化、没有做入口」。
> 渲染链（`docs/msg-render-registry.md`）和样式（`docs/style-entry.md`）已经收口，这是**第三块**。
>
> 复跑：`node tools/sheet-census.mjs`（只读、静态、不用浏览器）· `node tools/sheet-snapshot.mjs`（真浏览器，10 张快照）。

## 结论先行（只读这三句就够）

1. **入口本身是好的**：`sheet()` 只有一个（`app1_core.js:42`），定义体第一句就是 `closeSheet()`
   ⇒ **结构上不可能同时开两个弹层**。它被包过 1 层，`closeSheet` 被包过 1 层。
   一开始我猜痛点是「119 处直连 `sheet()`」——**量完否掉了**。
2. **真接缝在它上面一层**：具名弹层（`menuSheet` / `memSheet` …）各自被后来的文件一层层包。
   `menuSheet` 真实是 **8 层**（这个数字我报错过三次，见 §二）。
3. **已收口到哪一步**：
   - `menuSheet` 8 层里 **7 层搬进了 `SHEET` 注册表**，只剩 `app46`（它是「改别人刚建的块」，不是加块）；
   - `memSheet` / `m2Sheet` 量完判定 **不该搬**（各层吊在不同锚点，不是同一个栈，见 §四之二）；
   - 两道闸在守：`sheet-snapshot --check`（10 张快照逐字节）· `sheet-census --check`（包装层数，两个方向都红）。
   - **还没动的**：32 处绕过入口直接摸 `.sheet-card` / `.sheet .plans` 的地方（§五）。

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

### 搬完了（2026-10-27）：7 个 `afterbegin` 全部进注册表

`menuSheet` 现在**只剩 1 个包装**（`app46` 那个「改别人刚建的按钮文字」，它不是加块）。
7 个 `afterbegin` 各变成一行 `SHEET.add("menu", "<文件>", "top", fn)`，HTML 一字未改。

**判据全过**：`sheet-snapshot --check` → 7 个弹层**逐字节一致**；变异（在 `app11` 那段串里插
`<!--m11-->`）→ **只有 `menuSheet` 那张红**（2929 → 2939）；`check-all` 41 套全绿；真页面 0 uncaught。

**踩到一个坑，值得单记**：`app112_sheet.js` 第一版排在 `app111_msgkind.js` 之后，而
`app11_memory.js` 比它更早 —— 于是 app11 注册时 `SHEET` 还不存在，**整包在加载阶段就断了**。
症状**不是**「SHEET is undefined」，而是下一次碰到某个 `const` 时报
`Cannot access 'TRIAL_UNITS' before initialization`（bundle 停在 app11，后面所有 `let/const`
留在 TDZ）。⇒ **加载期炸掉会伪装成一个毫不相干的 TDZ 错误**；新注册表类的文件必须排在
**第一个使用者之前**（这里挪到 `app1_core.js` 之后），且必须跑一次真页面 uncaught。

⇒ 搬的时候按这个顺序登记，7 个 `afterbegin` 逐块插，最终 top→bottom 就是
`app96 → app79 → app77 → app49 → app47 → app45 → app11`，与今天逐字节相同。

**② 「改别人刚建的东西」那层的隐式耦合**（`app46` 依赖 `app45`）：`app45` 的守卫一不成立，
`app46` 就安静地什么都不做。这类「靠前一层留下 DOM 才能工作」的写法，是这些层叠起来之后最难查的。

## 四、快照闸（已造好并挂进 check-all，第 41 套）

```
node tools/sheet-snapshot.mjs            # 拍基线 → tools/sheet-baseline.json
node tools/sheet-snapshot.mjs --check    # check-all 里跑这个
```

10 个弹层各开一次，`.sheet` 的 `outerHTML` 逐字节比：

```
menuSheet 2929 · memSheet 2110 · usSheet 3278 · dirSheet 1558
cardSheet 630  · startSheet 1844 · paySheet-promo 2387
giftSheet 1320 · dateSheet 805 · ledSheet 786        （2026-10-27 扩样，原先 7 张）
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
| ① 逐字节一致 | 两次独立浏览器跑 → 10 个弹层全部相同 |
| ② 必须非空 | 第一版就全非空（630–3278 字符）；空的话立刻报「那一刻没弹出来」 |
| ③ 变异要红 | 给 `app48` 那层的 `beforeend` 串前插 `<!--m48-->` ⇒ **只有 `menuSheet` 那张红**（2929 → 2939，并打印首个差异位置与上下文）；还原后复绿 |

**射程（写在明处）**：只覆盖上面 10 个弹层、且只用一个「带 pk 的 solo 线程」造场景。
需要真实消息对象/真实章节的（`imgSheet` 之类）**不在快照里** —— 别把它读成"弹层都验过了"。

## 四之二、memSheet 与 m2Sheet：量完了，**不该搬**（2026-10-27）

原以为「同一个模式铺到第二个弹层」。逐层读完，**形状不一样**：

| 弹层 | 层 | 锚点 | 位置 |
|---|---|---|---|
| memSheet | `app12_beats.js:40` | `.sheet .memlay` | `afterend` |
| memSheet | `app77_memory2.js:170` | `.sheet .memlay` | `afterend` ← 与上一行**同锚点** |
| memSheet | `app88_memcall.js:23` | `.sheet .memtiers` | `afterend` |
| m2Sheet | `app78_memsync.js:41` | `.m2s .m2off` | `beforebegin` |
| m2Sheet | `app79_ledger.js:145` | `.m2s` | `beforeend` |

`menuSheet` 那 7 层是**往同一个栈里追加**；这 5 层是**各自吊在弹层内部某个已有块的前/后**。
⇒ 注册表现在的形状（一个容器 + top/bottom）表达不了「`afterend` 某个子元素」，硬塞要么加一个
`selector + where` 参数，要么把语义拧弯。

**判定：不搬。** 理由不是「麻烦」，是**它买不到东西**：

- `menuSheet` 那 7 层之间有顺序耦合（同一位置 `afterbegin`，后加载的插到更前）⇒「一个地方写明
  顺序」有实际价值；
- 这 5 层里只有 **`app12` 与 `app77` 同锚点同位置**（都 `afterend` 到 `.memlay`）⇒ `app77` 的块
  排在 `app12` 之上（还是加载顺序那条规律），但它只有两层、其余三层互不相干
  ⇒ **记一句话就够，不值得为它加一个参数。**

**留下的判据**（判「一个弹层要不要上注册表」）：
> **同一个容器 + ≥2 层 + 位置语义让最终顺序取决于加载顺序** —— 三条全中才值得；
> 各层吊在不同锚点上的，读一遍锚点表就够了，别硬套 menu 的形状。

## 五、绕过入口的地方：30 处（数字改过一次，定义写在下面）

**定义**（写死，别再用别的）：一行同时满足 —— ① 引用了以 `.sheet` / `.m2s` / `#cards` 开头的
**选择器字面量**；② 同一行里调了 DOM 接口（`$(` / `$$(` / `querySelector` / `closest`）。

> ⚠️ 第一版报 **32 处**，正则里写着 `.sheet\b[^]*?\$\$?\(` —— 它的实际含义是「同一行里有 `.sheet`、
> 后面还有个 `$(`」，几乎什么都算。第二版收紧后 33 处（把注释也算进去了），第三版加上「必须调
> DOM 接口」才落到 **30**。**这条数字我改了三遍**，所以定义必须写在数字旁边 —— 否则下一个人
> 换一把尺子，会得到第三个数字。
> 同族提醒：`menuSheet` 的层数（8）也栽在同一件事上（见 §二）。

按片段就能定性的四类：

| 类 | 处数 | 例子 |
|---|---|---|
| **框架自己**（不是绕过） | 3 | `app1_core.js:45` 的 `closeSheet` 本身就是清 `.sheet` · `app3_chat.js:778/824` 是弹层**自己的**渲染 |
| **只读判断**（问「弹层开着吗」，不改结构） | 2 | `app18_promo.js:24`（没弹层才放欢迎层）· `app85_guide.js:11`（等弹层关掉再跑） |
| **误命中**（选择器与弹层无关） | 2 | `app48_clean.js:36` 摸的是聊天头 `.chead,.status,.livebanner` |
| **真绕过**（往弹层内部插/改一块） | **≈23** | `app17_custom.js:37–39`（三个弹层各往 `#cards` / `.sheet-card` 里塞）· `app19_bgm.js:107`（改 `.sheet .plans`）· `app34_hints.js:10`（往 `.stack` 塞）· `app97_agents.js:184` … |

**这 ~23 处才是「没有做入口」里真正还没动的一块**：入口就在那儿，它们选择了绕过它 ——
所以任何「在入口上加一条规矩」的做法，对它们都无效。**一个都没改。**

### 五之二、逐条定性：**它们不是「绕过」，是「入口没有那个位置」**

按「改的是哪个弹层的哪个子块、为什么归这一类」逐条读完，结论比预想的干净：

**① 该改成调入口（纯往 `.stack` 里追加、与 `SHEET` 块同形）：0 处**

唯一接近的是 `app97_agents.js:184`（拿到 `.sheet .stack` 后往后插一块），但它也带自己的守卫与
目标子块。**其余没有一处是「纯往栈里加一块」** —— 也就是说 `SHEET.add` 能覆盖的场景，在这 23 处
里几乎没有。

**② 只能这样（锚在弹层内部某个子块的前/后，或改已有块）：19 处**

| 位置 | 目标子块 | 动作 |
|---|---|---|
| `app10_story.js:137` | `.sheet .gh-gc` | 插 |
| `app12_beats.js:40` | `.sheet .memlay` | `afterend` |
| `app17_custom.js:37` | `#cards` | `afterend` |
| `app17_custom.js:38/39` | `.sheet-card` | `beforeend` |
| `app18_promo.js:28` | `.sheet .body` / `.sheet>div` / `.sheet` | 插 |
| `app19_bgm.js:107` | `.sheet .plans` | **整块重画** |
| `app19_bgm.js:109` | `.sheet [data-buyplus]` + 它的 nextSibling | **改文字** |
| `app34_hints.js:10` | `.sheet .stack` | `afterend`（在栈**外面**） |
| `app34_hints.js:14` | `.sheet .cctv` | MutationObserver 里补内容 |
| `app45_rel.js:36` | `.sheet .sh-body` / `.steps` | `beforebegin` |
| `app46_cp.js:44` | `.sheet [data-rewind]` | **改文字** |
| `app47_chapters.js:32` | `.sheet .stack` | `afterend`（在栈**外面**） |
| `app51_import.js:136` | `.stack [data-crh="quick"]` | `afterend` |
| `app73_features.js:82` | `.sheet .sheet-card` | `beforeend` |
| `app77_memory2.js:170` | `.sheet .memlay` | `afterend` |
| `app78_memsync.js:41` | `.m2s .m2off` | `beforebegin` |
| `app79_ledger.js:145` | `.m2s` | `beforeend` |
| `app88_memcall.js:23` | `.sheet .memtiers` | `afterend` |
| `app97_agents.js:184` | `.sheet .stack` | 插（带自己的守卫） |

**③ 该删：0 处**（没有证据说哪个功能死了，也没找到两处做同一件事）。

**读不出的：2 处** —— `app96_social.js:203`（`const box=$(".sheet"); if(!box) return;` 之后要读全才知道写什么）
· `app5_money.js:56`（`setTimeout` 里 `if(!$(".sheet")) sheet(...)` 其实是**开**弹层、该算只读判断，
但同一行又拼了弹层内容）。**不猜，留着。**

### 这条线真正的结论

**「没有做入口」的真实形态不是「大家不用入口」，而是「入口只能整块替换」**：
`sheet(html)` 收一个完整 HTML 串，**没有任何办法说「在这个子块后面插一块」**。
于是 19 处各自去摸 DOM —— 而且锚点几乎各不相同（19 处 **8 种**锚点）。

⇒ 缺的不是注册表，是**位置契约**。`SHEET.add` 只覆盖「同一个栈 + top/bottom」那一种。

### 五之四、判定：**不加「锚在某个子块之后」的原语**（2026-10-27）

**先纠正我自己的判据。** 指针里写的是「锚点能不能收敛到 ≤3 类才动手」——**这条判据是错的**：
`afterend` / `beforebegin` / `beforeend` 本来就是**同一个操作**，只是选择器不同 ⇒ 一个
`SHEET.after(selector, name, fn)` 原语**本来就能覆盖全部 19 处**，不存在「收敛不下来」的问题。
拿「锚点种类数」当门槛，是用错的尺子把自己劝退（或骗进）。

真正的判据是**这一刀能不能被闸看见**：

| | 现状 |
|---|---|
| 快照覆盖 | 10 个弹层（本轮从 7 扩到 10） |
| 19 处碰到了几个弹层 | ≈10 个：menu · mem · m2 · card · gift · date · us · start · crHub · gameHub |
| **覆盖缺口** | **crHub / gameHub / gh-gc 这几处进不了快照**（要真剧本、创作者草稿、配对状态） |

⇒ **判定：不建。** 一句话理由：**这是一次 19 处的机械改造，而闸只看得见其中一部分** ——
看不见的那部分改错了不会有人喊，而它们的 HTML 都是几百字符的串，转写风险实在。
「看得见的收益（一张表 + 命中计数）」换「看不见的风险」，不划算。

**翻案条件**（写死）：① 那几处锚点能被快照覆盖（crHub / gameHub 有了可造的桩）；或
② 某一处**又坏了**（说明直接摸 DOM 在这里真的在伤人）—— 那时不是加原语，是**先给那一处加快照**。

**已经做的那一半（便宜且独立有用）**：快照从 7 张扩到 **10** 张（+`giftSheet` / `dateSheet` / `ledSheet`）。
证据：在 `app17_custom.js` 里把 `cuGift` 改一个字 ⇒ **`giftSheet` 那张红**（1320 → 1322）。
这三张原先根本不在闸里 —— 也就是说 app17 那三处绕过点，**今天之前改坏了没有任何东西会说**。

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
