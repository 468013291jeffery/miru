# 架构：什么在本地，什么在线上

> **这份文档回答一件事**：要加或改一个能力（剧本 / 图 / 音 / 译文 / 自由对话 / 进度）时，
> **它该放本地还是线上？改哪个文件、走哪个端点、哪一步花钱、挂了长什么样。**
>
> 下次不用再读一遍源码——每一条链都带 `file:line`，直接跳。

---

## 0. 三条判据（按顺序问，第一条命中就停）

| 问 | 命中 ⇒ 放哪 | 例子 |
|---|---|---|
| **输入是玩家此刻现场给的？** | **线上**（没法预生成） | `⟦FREE⟧` 自由输入、通话里的真自由对话 |
| **是「写一次、很多人读」的内容？** | **本地/离线产出，产物入库** | 剧本正文、译文、场景图、固定台词音频 |
| **是「某个人此刻的状态」？** | **线上数据库**（唯一真相） | 章节进度、道具、钱包、记忆 |

推论：**线上只保留「每人不同、且只能算一次」的东西。** 线上能力越少 ⇒ 额度、网络、超时这些**你控制不了的失败面**越小。

---

## 1. 对照表（哪一格在哪）

| 能力 | 位置 | 实现在哪 | 花钱吗 | 挂了长什么样 |
|---|---|---|---|---|
| 剧本·内置 37 部 | **本地（构建期）** | `source/content/out/sNN.json` → `gen_content.py` 的 `packs` → `source/src/content_36.js` → `build.py` 的 `parts` | 否 | 构建报错，或内容静默缺 |
| 剧本·官方剧 | **线上（DB）+ 运行时解析** | `admin.html` 剧本生产 → `api/works.js:16` → `source/src/app76_official.js:6` → `imParse/imBuild` | 1 次 GET | 打不开这部剧（`toast`），不崩页面 |
| 场景图 / 分镜 | **本地（仓库）** | `art/scenes/**` → `build.py` 的 `SCENE_FILES`；官方剧走 `art/official/<id>.json` → `app94_official2.js:16`（`off94Assets`） | 否 | **槽位直接跳过**，剧本不用重发 |
| BGM | 本地文件 **或** 现场合成 | `app19_bgm.js:47` 读 `BGM_FILES`；没有就 Web Audio 实时合成 | 否 | 合成兜底，静音 |
| AI 出图 | **线上** | `app82_qwenimg.js:11` → `/api/image` | 按张计费 | 这一张失败/占位，剧情继续 |
| 语音·固定台词 | **本地预生成** | `audio/en.json` / `zh.json`：361 条 `说话人\|台词 → base64 mp3`；`app62_tts.js:31` 原本第一优先查它 —— **2026-10-27 起默认不启用**（实测 10 次发声命中 0 次，却要预取 11 MB；开关 `S.voice.pack`，见链 D） | 否 | 落到第 2 级（服务器合成） |
| 语音·动态台词 | **线上** | `app62_tts.js:7` → `/api/tts`（`api/tts.js:12`：CDN 缓存一年「每句对所有人只合成一次」） | 每句一次 | 服务器 >7 秒或挂了 ⇒ 退回设备语音 |
| 翻译 | **编译期优先 + 线上兜底** | `tr_ja.js` / `tr_ko.js` / `tr_es.js` 已备好；缺的走 `app67_i18n.js:5` → `/api/translate`（结果写 DB，下次不再调） | 每句一次 | 回落英文 |
| 自由对话 `⟦FREE⟧` | **线上** | `app54_longcat.js:7` → `/api/longcat`（`api/longcat.js:1`：LongCat → SCNet → GLM 自动切换） | 每轮 token | 换下一个 provider，玩家不该看见断 |
| 进度 / 记忆 / 钱包 | **线上 DB** | `app78_memsync.js:2` → `/api/state`（`api/state.js:13` 读 / `:19` 写 `memories`） | 极低 | 存档失联（最重的一种） |
| 结构 QA / 安全词表 | **两侧都要，本地上传前先跑** | `api/_lib.js:132` `safety()` · `:141` `structureQA()`；发布时 `api/works.js:41-45` | 否 | 落 `pending`（人工复核），不直接拒 |

---

## 2. 五条链（逐边，带 `file:line`）

### 链 A · 内置剧本（构建期，改一句要重建）
```
source/content/out/sNN.json ─┐
source/content/deep/*.json ──┼→ gen_content.py ─→ source/src/content_36.js ─→ build.py parts ─→ index.html
art/<角色>.jpg（有立绘才算）┘
```
- 立绘的判据在 `gen_content.py` 的 `has_art()`：**看仓库根 `../art/<id>.jpg` 在不在**，没有就 `_art: null`（不报错）。
- 构建期只做一件事：把这 37 部塞进全局 `PACK_C` / `PACK_W`，再由一个 IIFE 把它们并进 `C` / `W`。

### 链 B · 官方剧（运行时，改剧本不用重建）
```
admin.html「剧本生产」 → /api/admin → DB.works.pack.script
                        ↓
app76_official.js:6  capi("/works?id=…&play=1")
                        ↓
          pack.script（MIRU DSL 文本：⟦CHAR|…⟧ ⟦BG|…⟧ ⟦FREE|…⟧ …）
                        ↓
          imParse() → imBuild() → 直接变成可玩的世界 w
                        ↓
app94_official2.js  资产映射 art/official/<work>.json（槽位 → url，缺就跳过）
```
- **这就是「本地生成剧本、网站负责渲染」那条路**：网站的输入是文本，不是代码。
- 同一版只转换一次（按 `pack.ver` 缓存，见 `app76_official.js` 顶部注释）。

### 链 C · 自由输入 `⟦FREE⟧`（必须在线上）
```
玩家打字 → app54_longcat.js:7 LC_PROXY ─→ /api/longcat（Edge）
                                            ├─ LongCat
                                            ├─ SCNet
                                            └─ GLM   （首个出 token 的赢，其它跳过）
```
- Key 只在环境变量里（`api/longcat.js:3-8`），页面里没有 key。
- 静态规则放最前面是为了**前缀缓存**（`api/longcat.js:3` 的注释明写）。

### 链 D · 语音（三级回退，**现在是「默认不走第 1 级」**）
```
台词 → 1) 录音包 audio/*.json（speaker|text → base64）   ← 默认关闭（S.voice.pack）
     → 2) /api/tts 合成（api/tts.js：DASHSCOPE / INWORLD / 自建 TTS_URL）
     → 3) 设备语音 speechSynthesis
```
**⚠️ 三个会让这条链「看起来有、其实不通」的事实（2026-10-27 实测）**：

1. **本地页面也走线上 TTS**：`config.js` 把 `window.MIRU_PROXY` 指到 `https://miru-wheat-pi.vercel.app/api/longcat`，
   而 `app62_tts.js:7` 从它推出 `TTS_EP = …/api/tts`。所以「本机 `/api/tts` 是 503」这个说法只对**相对路径的探针**成立，
   **真代码请求的是线上端点**。（探查时用 `fetch("/api/tts")` 会得出相反结论。）
2. **录音包命中率极低**：362 条覆盖的是开场/介绍那类固定句，正文 beat 基本不在里面 ——
   她那条线程 **10 次发声命中 0 次**，而启动要下 11 MB ⇒ 已改默认不启用（文件保留，`S.voice.pack` 可开）。
3. **三级之外还有一个"等"**：`pkWait()`（`app16_story2.js:118`）每放一句都要等「这句念完了」。
   服务器 TTS 要 7–8 秒才肯认输转设备语音，而兜底原本是 `max(ms*3, 14000)` ⇒ **每句白等 14 秒**，
   三章从 48 秒变 190 秒，而主线程长任务 **0 个**（是等，不是算）。

**这一级的判据（想知道「这一刻卡在哪」就看这三格）**：
- 有没有声音：`avSilent()` 三项（`speechSynthesis.speaking/pending` · `TTS.inflight.size` · `AUD_CUR` 是否在放）
- 还要不要等：`AVSILENT` / `AVSKIP`（连续 2 句没声音 ⇒ 跳 8 句 ⇒ 自动再试）
- 走的是哪一级：`recorded()` 是否非空（第 1 级）· `ttsOn()`（第 2 级）· 否则第 3 级

**逐句串行（2026-10-27 新增，`app3_chat.js` 的 `playBeats`）**：模型一轮回了 4–5 句时，
不再「先按 700ms/句刷完再整批念」，而是**亮一句 → 念完 → 亮下一句**；
三条保命：每句上限 9–20 秒 · 连续 2 句没出声退回定时节奏 · 不念的句子（旁白/动作）不等。

### 链 E · 状态
```
app78_memsync.js:2 ─→ /api/state ─→ Postgres（memories / threads / wallet）
```
- 剧本正文可以版本化、可回滚；**玩家状态不行**——它是唯一真相，只能一份。

### 链 F · 一次回合（「她按下去 → 听见声音」中间经过哪几站）

```
玩家按发送
 → appendMsg({who:"me"})           app3_chat.js:293   ← 她的话先落、先显示
 → reply(th,{kind:"user"})         app3_chat.js:355
     → 召回记忆 / 组 prompt / 调模型  /api/longcat（线上）
     → 解析 JSON → playBeats()      app3_chat.js:499
         每句：appendMsg → speak(onend) → 等念完 → 下一句（链 D 的逐句串行）
 → setSugg / 状态条 / 关系 / 任务卡
 → save()                          整份 S 序列化（466 KB 时 ≈ 2.5 ms）
```

**每站实测**（同一台机器、无降频；尺子 `tools/perf-cdp.mjs`）：

| 站 | 读数 |
|---|---|
| 进线程（`openThread`：save → 整屏重建 → 显示 → 滚到底） | **12–30 ms**（154 条消息的线程） |
| 整屏重建（`renderChat`，整条列表拼 HTML 再 `innerHTML=`） | **12–25 ms / 次**；斜率 ≈ **0.05 ms/条**（要 2,000 条才到 100 ms） |
| 单次 `save()`（整份 S 序列化 + localStorage 同步写） | **0.6–3 ms**（存档 268–466 KB） |
| 帧率（聊天页 idle，背景特效在跑） | **60 fps** · 掉帧 0–1% |
| 换章真速（一章正文 + 选择 + 进下一章） | **15–25 秒**，其中**主线程工作 ≈ 8 ms**、长任务 **0** |

⇒ **这一节的结论要写死**：这条链上「慢」的地方几乎**都不是 CPU，是等**（等模型、等朗读回调、等定时器）。
所以以后要加一个能力，先问它会不会在**等待链**上多加一站 —— 那比把一次 DOM 重建从 25 ms 优化到 12 ms 值钱得多。

---

## 3. 每个在线能力的开关在哪

| 能力 | 开关 | 关了会怎样 |
|---|---|---|
| LLM | `LLM_ORDER`（`api/longcat.js:8`）+ 各 `*_API_KEY` | 无 key ⇒ 自由对话不可用；剧本照常播 |
| TTS | `DASHSCOPE_*` / `INWORLD_*` / `TTS_URL`（`api/tts.js:3-11`）；前端 `S.ttsMode="device"` | 回落到设备语音 |
| 翻译 | `/api/translate` 依赖 LLM key（`api/translate.js:28`） | 已有 `tr_*.js` 的语言不受影响；新语言回落英文 |
| 出图 | `app82_qwenimg.js:11` 的端点 + key | 图位留空 |
| 数据 | `DATABASE_URL` / `POSTGRES_URL`（`api/_lib.js:2`） | 登录/存档/作品全断，前端仍能看内置剧 |

---

## 4. 判「现在走的是哪一条」看哪里

- **这部剧本是内置还是官方剧**：`w.id` 是否有 `official76` / `community` 字段（`app76_official.js` 会写）。
- **这句语音是预录还是合成**：先看 `recorded()` 有没有值 —— **默认它是 null**（`S.voice.pack` 未开，录音包不启用）；
  再看 `ttsOn()` 与 `TTS.fails`（`fails > 0` 说明合成失败过）。⚠️ 别用 `fetch("/api/tts")` 探查：
  那是**相对路径**，打的是本地服（503），而真代码走的是 `config.js` 推出的**线上端点**（见链 D 第 1 条）。
- **这句译文是编译期还是现翻**：`app67_i18n.js:97` `trEP()` 拿到的端点是否为空——为空说明当前环境没有翻译服务，走的是本地表。
- **LLM 是不是在降级**：`/api/longcat` 的 `{probe:true}`（`api/longcat.js:9`）会在后台报每个 provider 的延迟/状态。
- **发布为什么没上线**：`works.qa`（`api/works.js:55` 返回的 `qa`）里就是 `safety` / `structureQA` 的理由。

---

## 5. 这批改动治什么 / **不治什么**

**治**：
- 构建一条命令、跨平台、可复现（判据：`git hash-object` 与 HEAD blob 相等）。
- 两个**静默错误**：立绘依赖符号链接、资产清单里塞构建机绝对路径。
- `--split`：37 部剧本可以离开 `index.html`（10.83 MB → 4.26 MB + 6.57 MB）。

**不治**：
- **没有把 `--split` 变成默认**——线上形态没变。
- **没有动运行时**：`imParse/imBuild` 仍在 bundle 里，本地生成器还**不能**用同一个解析器预校验。
- **没有统一两条内容路线**：内置 37 部仍是结构化 JSON pack，官方剧仍是 DSL 文本，两套数据形状并存。
- **没有做本地生成器**——这份文档只把「该产出什么、往哪放」写清楚。

---

## 6. 未验 / 缺口（未量 ≠ 零）

1. `--split` 只验到**启动状态**（`W.length=38`、登录门、首屏 246 字符），**没验完整玩一局**，也没验付费/通话/出图这些在线路径。
2. 本机没有后端（`/api/*` 在本地 404），所以所有在线链路的**失败模样**都是从代码注释与分支读出来的，**没有实测**。
3. 「固定台词预生成」目前只有 `audio/en.json` / `zh.json` 两份（361 条，各约 10 MB），**没有按剧分目录**——新剧要预生成时得先定一个目录约定。
4. 仓库体积没有预算闸：`art` 91 MB + `video` 51 MB + `audio` 20 MB。建议**一部剧 ≤ 15 MB**（8 章：图 20–40 张 + 音 300–600 条），超了换存法，别靠删内容。

**2026-10-27 新增的开着的格**（别当已完成）：

5. **左右分栏在两个窗口之间来回坏**：一次实测 `#msgs` 里 61 条 `.m-row` **全在同一左边距**，
   加 `.m-row.me{align-self:flex-end}` 后**规则生效（computed 变了）但位置不变** ⇒ 容器不是 flex 列。
   远端随后有一条 `de93773 left and right, without depending on the parent being a flex column` 是朝这个方向走的，
   **但两边都还没在同一棵树上共验**。判据：数 `#msgs .m-row` 的 `distinctLefts`，**必须 ≥ 2**。
6. **章节会自己从第 1 章重开**：能重开的入口只有 `packStart()` / `packOpen(th,n)` / `cpRestore()`。
   三者现在都往 `S._pkTrace` 记一条（最近 20 条，含调用栈）⇒ 下次复发**导出存档**就能定位，不用猜。

**2026-10-27 晚：上面第 5 条已量出结论**（不再是未知）

- 左右分流**不是**「父容器不是 flex」：实测合成一条 `.m-row.me`，拿到 `alignSelf=flex-end` / `marginLeft=347px`（容器 420px）
  ⇒ **CSS 一直有效**。真正没分边的是**剧本合并块**：`boxHTML` 把每个 part 渲染成同一块里的 `<p>`，
  连玩家自己那句都被当成无名角色 —— 当天已按 `who` 分边修正（`bac me` + 右对齐）。
- 判据仍是 `distinctLefts ≥ 2`，但**必须在有对话的线程上量**：空线程、或只有系统卡的线程，量出来一定是 1 —— 那是尺子，不是结论。
- 同一形状的另一个真因现在有闸了：`tools/wiring-order-check.mjs` ——
  「状态机模块排在**绑定它的那一行**之后 ⇒ 绑定静默跳过 ⇒ 模块完全失效，而查字符串的检查照样全绿」。
  当晚在 `TURN` 上真实发生过一次，是这道闸抓出来的。

---

## 7. 工程结构：入口、状态机、注册表（2026-10-27 全天）

> 这一节回答的是**另一个问题**：不是「能力放在哪」，而是「**同一个东西有几条路能改它**」。
> 起点是 Ann 的一句话：**「UI 出问题，纯粹也是因为我们没有做整合、没有做工程优化、没有做入口导致的。」**
>
> 每一条都配**读数命令**与**闸**；闸都在 `tools/check-all.mjs`（**37 套**），且每道都做过变异测试。
> 截至本日收盘的全部读数：

```
猴补丁      148 个函数 / 357 处   （当天起点 382 ⇒ −25）
空 catch    576 处 / 99 个文件    （当天起点 616 ⇒ −40）
on* 绑定    硬类 0 处 · 软类 93 处 · addEventListener 399 处
剧本指令    26 层注册 · 21 个类型 · 1 处已声明死代码
渲染钩子    22 个（每个 0 失败）
错误日志    2 分钟窗口
```

### 7.1 起点：一条链被 26 个文件分别改过

`tools/patch-registry.mjs` 在当天早上量到的是 **382 处** `const _x = x; x = function(){ … }`。
每一处都是**没有契约的接口**，而最要命的是：**任何一层抛异常，它后面所有层都不再执行**——
界面上只表现为「少了一块」，控制台里一条没人看的错。

⇒ 于是把「一个东西几条路」逐个收成一个入口。**收的顺序按「今晚哪类 bug 归它」排**，不是按代码多少。

### 7.2 十个入口

| 入口 | 文件 | 把「什么」变成唯一 | 读数 | 闸 |
|---|---|---|---|---|
| **回合** `TURN` | `app103_turn.js` | `busy` 这个 boolean（原来四拨人各自解释） | `__turn()`：持有者 · 已持ms · **冲突次数** | `turn-wiring-check` |
| **章节状态** `PKST` | `app104_pkstate.js` | `th.pk.st` 四值 / 10 个写点在 4 个文件 | `__pkst()`：每条纹路 · **非法迁移** | `pkstate-check` |
| **存档** `SAVE` | `app105_save.js` | `save()` 397 个调用点无归因 | `__save()`：最慢 · **最烧调用点（文件:行）** | `save-instrument-check` |
| **渲染入口** `UI` | `app106_ui.js` | 渲染后的动作：25 层匿名包装 → **1 调度 + 22 具名钩子** | `__ui()`：钩子名 · **失败数** · 最近错误 | `ui-entry-check` |
| **剧本指令** `PKREG` | `app110_pkreg.js` | 26 层 `pkDirective` 包装 → **一张注册表** | `__pkreg()`：注册层 · 分发次数 · **层内抛错** | `pkdirective-check` |
| **文本进 UI** | `app3_chat.js:sanitizeMsgs` | `th.msgs` 30 处直写绕过的文本净化 | `__soft()` | `sanitize-selftest` |
| **静默失败** | `app3_chat.js:soft` | 空 `catch` → 有名字、有次数的吞 | `__soft()`：位置 · 次数 | `empty-catch-check` |
| **错误日志** `ERRLOG` | `app108_errlog.js` | `onerror` / `unhandledrejection` / `console.error` 三源合一，**2 分钟窗口淘汰** | `__errlog()`：窗口内条数 · 已淘汰 | `errlog-selftest` |
| **on\* 绑定** | `tools/on-assign-check.mjs` | `el.onclick=` 静默覆盖别人的处理器 | 硬类 0 · 软类 93 | 同左 |
| **加载顺序 / 猴补丁基线 / 行号归位** | `wiring-order-check` · `patch-registry --check` · `line2file` | 状态机必须先于绑定点；新增包装要显式确认；`index.html:6833` → 源文件 | 位置比较 / 148 函数 / 130 块 | 同左 |

### 7.3 渲染入口的形状（最容易看错的一条）

```
renderChat（主渲染）
      ↓
UI 调度器  ← 只装这一层：跑完主渲染后逐个跑钩子
      ↓      每个钩子**单独** try/catch ⇒ 一个炸不连累别人
  features73 关系条/那排按钮 · mydock75 浮条 · dock97 回合面板
  merge41 · composer55 · voicefix86 · lib65 · story10 · story16 · story162
  custom17 · promo18 · bgm19 · dims21 · style29 · score31 · recs33 · rel45
  clean48 · social96 · agents97 · story98
```

**判据（浏览器里量，不看源码）**：`__ui()` 报 `调度已装: true`、`hook 数: 22`、**每个钩子失败 0**。
搬一层的固定动作：`UI.add(名字, body)` + 保留 `else` 兜底（UI 不在时退化成原包装）。
**兜底留在源码里 ⇒ 静态计数不降**；变的是**哪一支在跑**。别拿静态计数当进度。

### 7.4 剧本指令：26 层包装 → 一张表

`pkDirective` 原来被 26 层这样包着，**谁先生效由文件名加载顺序决定**：

```js
const _pkDirX = pkDirective;
pkDirective = function(th, b){ …认领某类型…; return _pkDirX(th, b) };
```

现在每层注册一行（**形状不变**，仍然拿着"下一层"）：

```js
PKREG.add('app17_custom.js', function(th, b, next){
  if(Array.isArray(b) && b[1]==="event"){ …; return true }
  return next(th, b);
});
```

装配只有一处（`install()`），顺序 = 数组下标。**逐字等价**，区别只是「谁赢」从文件名变成了可读的一行。

`source/src/app109_pkdirect.js` 里写死了**谁在处理哪个类型**（21 个），以及**1 处死代码**：

> `app16_story2` 的 `event` 处理**从不执行** —— 它被 `app17_custom` 的 `pkPart` 版从外层包住。
> Ann 确认：现在用的就是后者（B 方案）。

闸 `pkdirective-check` 三向对账：**有消费型必登记** · **表的赢家 = 最外层消费型** · **声明的死代码不许复活**。

### 7.5 静默失败的三条出口

以前失败只有一条路：`catch(_){}` → 消失。现在分三层：

| 出口 | 收什么 | 怎么看 |
|---|---|---|
| `soft(位置, fn)` | **主动**吞掉的失败（本来是"失败了别打断玩家"的地方） | `__soft()`：哪一处、几次 |
| `ERRLOG` | **没人接**的：`onerror` / 未处理的 Promise / `console.error` | `tools/read-errlog.mjs`（2 分钟窗口，非空即红） |
| `HEALTH` | 四个入口的计数，每 30 秒落盘 | `tools/read-health.mjs`（冲突/失败/非法迁移，非零即红） |

**错误日志有启动心跳**（3 秒后先落一次盘，哪怕零错误）——否则「零错误」和「日志器根本没跑」在磁盘上完全同形。

### 7.6 这一层治什么 / 不治什么

- **治**：改一处坏另一处（包装层互相踩）· 静默失败（空 catch 把硬错误变成无操作）·
  「查不到是谁改的」（存档/章节/回合/指令都有归因读数）· 「谁赢由文件名决定」（改成了表）。
- **不治**：界面**长什么样**。样式仍散在 `shell.html` 与各文件注入的 `<style>` 里（69 处 / 57 文件）。
  两个渲染器已于当天合并（`docs/message-renderers.md`），但视觉仍由多处 CSS 决定。

### 7.7 闸的自我检查（这一节是给下一个人的）

**写闸最大的坑不是写错，是「写了但从没跑」。** 当天实测到**四种**：

1. **只查字符串**：`turn-wiring-check` 看产物里有没有 `TURN.bind(` —— 字符串在，绑定却从未执行
   （模块排在建表末尾 ⇒ 绑定时对象还不存在 ⇒ 静默跳过）。⇒ 于是有了 `wiring-order-check`（比**位置**）。
2. **根本没登记**：`ui-entry-check` 与 `wiring-order-check` 没挂进 `check-all` ⇒ 十几轮「全绿」对它们一句都不算数，
   而单独跑 `ui-entry-check` 是**红的**（钩子被执行两次）。
3. **行为臂自证**：隔离性必须**真的执行一次**（塞一个抛错的钩子，验后面那个照跑），不能只 grep 源码。
4. **尺子本身误判**：`empty-catch-check` 把生成的兜底垫片里的空 catch 也算成债务 ⇒ **代码对、闸红**。
   修法是显式 `ALLOW` 表 + 每条写理由（现在只列了 3 个文件：errlog / pkreg / pkdirect）。

5. **变异选错了对象**：验「渲染快照」这道闸时，第一次把 `<div class="bub">` 改掉 —— 结果不红。
   不是因为闸坏了，而是**那一段根本不在渲染路径上**（渲染器合并后已经没有 `.bub` 了）。
   换成 `m-box lb` 才红在预期的那四条。⇒ **变异要打在当前真正执行的那段代码上**，
   否则"没红"会被误读成"闸没用"。

⇒ 四条固定动作：**写完闸 → 跑一次看绿 → 造一次变异看红 → 确认它在 `check-all` 的输出里看得见**。

---
