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

> ⚠️ **这一节改过一次，因为尺子数错了。** 第一版报 `menuSheet` **14 层**、`startSheet` 6 层，
> 并写了「整个仓库最密的接缝」。真因：包装行长这样 ——
> `const _menuSheet45=menuSheet;menuSheet=function(){…}` —— **一行里出现两次 `menuSheet`**，
> 而我按「那个词出现了几次」计数 ⇒ **每一层都被数成两层**。
> 去重（按 `文件:行`）之后：`menuSheet` **7 层**、`startSheet` **3 层**、其余各 **1 层**。
> ⇒ 计数单位是「哪一行的哪一次包装」，不是「那个词出现了几次」。

## 二、真正的接缝不是 `sheet()`，是那 45 个具名弹层

第一版我以为痛点是「119 处直连 `sheet()`」。量完发现不是 —— 入口只有一个、而且它自己保证不叠。
**痛点在它上面一层**：每个具名弹层（`menuSheet` / `paySheet` / `startSheet` …）各自是一根接缝，
被后来的文件一层层包（已去重，数字是真的）：

| 弹层 | 被包层数 | 直连调用 |
|---|---|---|
| **`menuSheet`** | **7** | 3 |
| `startSheet` | 3 | 9 |
| `memSheet` / `authSheet70` / `imgSheet` / `dirSheet` / `usSheet` / `dateSheet` / `cardSheet` | 1 | 0–5 |
| `paySheet` / `shareSheet` / `m2Sheet` 等其余 | 0 | 3–11 |

**`menuSheet` 被 7 个文件各包一层**。它不是最大的那个数（`msgHTML` 是 20 层、剧本指令是 26 层），
但它是**同一个具名函数上的最多层**，而且这 7 层是同一种形状：
`const _menuSheetNN=menuSheet; menuSheet=function(){_menuSheetNN(); …加一块 UI…}`。

⇒ 于是「菜单里到底有哪些项」这件事，**没有任何一处能回答**。
要改菜单得读 7 个文件；要删一个项得先确认没有第 5 层又把它加回来。
（7 层还没到该惊慌的量级 —— 它的价值在于**形状**：再加 5 个功能就变成 12 层，而那时再拆要贵得多。）

## 三、7 层逐层分类（已做完，只读）

| 层 | 它动的是什么 | 方式与位置 | 提前 return |
|---|---|---|---|
| `app45_rel.js:122` | `.sheet .stack` | `insertAdjacentHTML` **afterbegin**：人设 + 回退按钮 | `if(!th||!st)return;` ← **返回 undefined** |
| `app46_cp.js:44` | `.sheet [data-rewind]` **里面**的 `<b>` 与 `.grow span` | 改**已有块的文字** | 无 |
| `app47_chapters.js:33` | `.sheet .stack` | **afterbegin**：章节目录 | 无（条件不满足就跳过） |
| `app48_clean.js:38` | `.sheet .stack` | **beforeend**：沉浸模式开关 | 无 |
| `app49_creator.js:200` | `.sheet .stack` | **afterbegin**：回工作台 | 无 |
| `app95_safety.js:52` | `.sheet .stack` | **beforeend**：举报 AI 回复 / 拉黑 | `if(!th||!st)return r;` ← 返回对了 |
| `app96_social.js:238` | `.sheet .stack` | **afterbegin**：我的恋爱人格 / 私信 | `if(!th||!st)return r;` ← 返回对了 |

三条结论，都不是"感觉"，是逐行读出来的：

**① 6 层都往同一个容器 `.sheet .stack` 里塞，而且插入位置分两派。**
`afterbegin` × 4（app45 / app47 / app49 / app96）· `beforeend` × 2（app48 / app95）。
四个 `afterbegin` 意味着**每来一个新的就排到最前面** ⇒ 菜单的最终顺序是**加载顺序的倒序**，
而这件事没有任何一处写着。想调顺序，只能靠调 `parts` 里的文件顺序 —— 或者改某一层用 beforeend。

**② 有一层是"改别人刚建的东西"。**
`app45` 建出 `[data-rewind]` 那个按钮，`app46` 随后改它里面的文字。
⇒ 两者是**隐式耦合**：`app45` 的守卫（`if(!th||!st)return`）一旦不成立，`app46` 就安静地什么都不做。
这种"靠前一层留下 DOM 才能工作"的写法，正是 14 层（更正：7 层）叠起来之后最难查的东西。

**③ 一处真的 bug：`return;` 吞掉了返回值。**
6 层里的 5 层写 `const r = _ms.apply(...)` 并在守卫处 `return r`；
只有 `app45_rel.js:122` 写的是裸 `return;` ⇒ 它的守卫一旦命中，**整条链的返回值变成 undefined**。
这不影响菜单显示（没人用返回值），但它让「这个函数返回什么」变成一个取决于运行时条件的谜。

## 四、附带读数：32 处绕过入口

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

先只读、再分类、最后才动。**7 层先分成「加的是不同块」和「改的是同一块」两堆** ——
前者可以机械搬进注册表，后者必须人看（谁该赢）。这一步还没做。
