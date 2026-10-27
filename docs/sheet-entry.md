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
具名弹层       45 个，其中 **12 个被包过**
```

## 二、真正的接缝不是 `sheet()`，是那 45 个具名弹层

第一版我以为痛点是「119 处直连 `sheet()`」。量完发现不是 —— 入口只有一个、而且它自己保证不叠。
**痛点在它上面一层**：每个具名弹层（`menuSheet` / `paySheet` / `startSheet` …）各自是一根接缝，
被后来的文件一层层包：

| 弹层 | 被包层数 | 直连调用 |
|---|---|---|
| **`menuSheet`** | **14** | 3 |
| `startSheet` | 6 | 11 |
| `memSheet` / `imgSheet` / `authSheet70` / `dirSheet` / `usSheet` / `dateSheet` / `cardSheet` / `giftSheet` | 2 | 0–5 |
| `paySheet` 等其余 | 0 | 2–12 |

**`menuSheet` 被 14 个文件各包一层 —— 这是整个仓库最密的接缝**，
比 `msgHTML` 那 20 层还集中（那 20 层至少分成三类：认领 / 后处理 / 改入参，能按类各自记账）。
这里 14 层是同一个形状：`const _menuSheetNN=menuSheet; menuSheet=function(){_menuSheetNN(); …加一块 UI…}`。

⇒ 于是「菜单里到底有哪些项」这件事，**没有任何一处能回答**。
要改菜单，你得读 14 个文件；要删一个项，你得先确认没有第 9 层又把它加回来。

## 三、附带读数：32 处绕过入口

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

先只读、再分类、最后才动。**14 层先分成「加的是不同块」和「改的是同一块」两堆** ——
前者可以机械搬进注册表，后者必须人看（谁该赢）。这一步还没做。
