# 架构：什么在本地，什么在线上

> **这份文档回答一件事**：要加或改一个能力（剧本 / 图 / 音 / 译文 / 自由对话 / 进度）时，
> **它该放本地还是线上？改哪个文件、走哪个端点、哪一步花钱、挂了长什么样。**
>
> 下次不用再读一遍源码——每一条链都带 `file:line`，直接跳。

**四份文档各管一段，先看这张表再决定读哪份**：

| 想知道 | 读 |
|---|---|
| 一个能力该放本地还是线上、改哪个文件走哪个端点 | **本文件** |
| **她按下去到听见声音，中间经过哪几站**（交互流程，as-built） | **`INTERACTION.md`** |
| 对话流当初想收成什么样、为什么、怎么一步步搬（设计与迁移方案 + 补节） | `DIALOGUE-PIPELINE.md` |
| 改完代码合不合规矩、提交前跑什么 | `AGENTS.md`（本地文件，被 gitignore） |

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

#### 链 A·1 进新剧时「谁先开口」（2026-10-29，Ann）

**症状**：刚进一部新剧，第一条台词是**玩家自己扮演的那个角色**说的，读起来很怪。

**实测根因**（不是 AI，是剧本数据）：37 部第 1 章都是旁白开场，但**旁白之后第一个开口的，33 部里有 21 部（64%）就是 `cast` 里标 `pov:true` 的那个**（`crimson` `made` `pole` `unseelie` `pact` `night` `split` `roomies`…）。

**修法**（`app14_pack.js` 的 `packOpen`，在 `packBeats(...)` 之后、入队之前）：玩家用某个角色进剧时（`pk.as` 不是 `watch` / `side`），若**第一个开口的是 `pk.as`**，就把**这段领先的连续台词整段**挪到「第一个别人开口」那句之后。旁白留在原位。

**两个实测出来的细节**（都很容易做错）：
- **不能只挪一句**：`crimson` 是 `n, adrian, adrian` ⇒ 挪走一句仍以自己的台词开头。第一版就这么错的，37 部里还剩 6 部。
- **段里若混着 stop（`line`/`gift`/`call`…）就不许挪** —— 那会改变玩家发言的时机。第 1 章实测一例都没有，但剧本会改，所以留了 `if(seg.some(b=>isStop(b)))return` 这道闸。

**判据**（数据层，可复跑）：修前首句是 `pk.as` 的 21 部**全部**变成别人先开口；`pk.as` 不作首句的 12 部**一部都没动**；**字句与条数零改动**（按排序后的序列逐字比对）。
⚠️ **端到端仍未验**：`tools/beat-order-probe.mjs --mode=open` 现在**进得了聊天屏**了 —— 三道路障都修了：① 登录门（点一次游客）；② 读数口径（原来只查 `#msgs .m-row`，而那是**台词**那一类，旁白起头的剧永远读成"一条都没渲染"）；③ **"队列不动"不是 bug，是 `app101_you.js:52` 的「点一下才继续」**：默认 `S.pkTap101 !== false` ⇒ `pkWait` 拿到的 ms 是 `864e5`（24 小时），只有点 `[data-pknextl]`（`app14_pack.js:594` → `PKNEXT[curT]()`）才往下走；探针现在像真人一样自己点。但 `crimson` 第 1 章在**第 5 条就轮到玩家开口**（实测：点两下、队列 68 → 66，然后停在 `["adrian","line",…]` 这个 stop 上 ⇒ `AT_STOP`）⇒ 「谁先开口」这一问**在这一章读不出来**，缺的是**一部的开场真的先有台词**，不是探针没进门。

#### 链 A·2 进去有哪几个身份（2026-10-30，Ann：「不管对方给的是什么，都强化成三路都有，但是返回一个提示」）

**症状**：Ann 报「进去只有导演视角，别的视角没了」。
**原来的形状**：`packModes = [🎬 导演] ++ w.pack.join` ⇒ **谁能进去由内容生产的完整度决定**：`heir` 没写"加入场景"；创建器做的剧只写"扮演主角"（`app49`/`app50`/`app51` 都只塞一个元素）。少写一条 `join`，玩家就少一条路，**而且没有任何东西会红**。
**现在的形状**（`app114_entry.js`）：`entryModes(w)` 一处补齐三条 ——
- 扮演主角：`pov → love → 第一个 ch() 认识的角色`（认不出的 id 不补，宁可少一行也不出一行没名字的）
- 加入场景（我自己）：**永远在**，不需要任何人物 id
- 导演：**永远在**，且**排最后**（"so nobody lands in 导演视角 by accident"）
每条带 `src`：`data`（剧本写的）/ `derived`（我们补的）/ `always`（结构性）。**补过就返回 `hint`**，开始弹层把它印出来；剧本写全时不显示。`packModes` 变成它的出口 ⇒ 开始弹层 / 故事页"怎么玩" / 换身份 / 章节目录 / 首屏三选一**全走这一份**。
**闸**：`tools/entry-modes-probe.mjs`（8 条判据，含两条负对照：写全了的剧 hint 必须为空、创建器造的剧不许显示"补"），已进 `check-all`。
⚠️ **没覆盖**：`bible98`（`app98` 的 `start98`）用 key 体系选身份、没有 `watch` 语义，要凑三路得先给它一条"导演"的意思 —— 这是产品决定，仍等 Ann 拍。
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

#### 链 D·1a `pkWait` 的退路必须**先于**朗读注册（2026-10-30）

`pkWait` 保证「每一句都一定会往前走」—— 但 10-27 那刀只保证了 `else` 分支。朗读分支里
两条 `setTimeout`（3 秒静音判定 / `max(ms*3,14000)` 兜底）原来写在 `speakLine()` **之后**：
**它一抛，两条退路一条都不注册 ⇒ 那个 Promise 永远不 resolve ⇒ 整条剧本队列停在那一句上**
（和 10-27 修掉的是同一个病，只是换到了另一条分支）。
⇒ 顺序固定为 **先挂退路、最后才去念**，并且 `speakLine` 用 try/catch 包住，抛了就直接放过。

**读数**（`app14_pack.js` 的 `__pkLive(th)`，只读、不改状态）：`cur/id/same` · `chatThere/chatHidden`
· `ok`（= 闭包里那个 `live()`）· `pause` · `hist` · `playing` · `waiting`（`PKNEXT` 上挂着 resolver
⇒ 正等在 `pkWait` 里）· `autoVoice` · `q`（还剩几条）· `st` · `stop`。
**为什么要有它**：`live()` 是闭包，从外面看不见 ⇒ 2026-10-30 探针为了「队列为什么不动」在外面猜了六轮
（虚拟时间 / 节奏 / 线程地址 / 重开线程 / 弹层 / 动画），全部落空；加了这个读数之后**一次就答**：
`ok=true`、`waiting=true`、`autoVoice=true` —— 问题在朗读分支，不在「有没有人在看」。

**逐句串行（2026-10-27 新增，`app3_chat.js` 的 `playBeats`）**：模型一轮回了 4–5 句时，
不再「先按 700ms/句刷完再整批念」，而是**亮一句 → 念完 → 亮下一句**；
三条保命：每句上限 9–20 秒 · 连续 2 句没出声退回定时节奏 · 不念的句子（旁白/动作）不等。

#### 链 D·1 `speak` 的注册表：`VOICE`（2026-10-27 收口）

**改之前**：`speak` 被 **5 个文件各自包一层**，形状都是 `const _speakNN=speak; speak=function(...){… _speakNN(…) …}`：

| 顺序（外→内） | 文件 | 它在那层做什么 |
|---|---|---|
| 1 | `app88_memcall.js` | 通话中拦截；不放行就不往下传 |
| 2 | `app86_voicefix.js` | 自己发 `/api/tts`、用一个预建的 `TTSEL` 元素播；兜底才往下 |
| 3 | `app62_tts.js` | 上面那层的**前身**；app86 把它跳过（直接落 app45），它只管 `stopVoice` 与预取 |
| 4 | `app45_rel.js` | 旁白风格（`w.nv`）：off 则不念、soft/film/noir 换 pitch/rate 用设备语音 |
| 5 | `app19_bgm.js` | 压低 BGM，念完恢复 |

**为什么改**：两层病，都是「没有唯一咽喉」。
- 加第 6 层时**忘了把 `onend` 传下去** ⇒ `speakQueue` 静默停住，`VOICE_BUSY` 一直 > 0，**没有任何东西会喊**（这正是 2026-10-27 修掉的 bug）。
- 出问题只看得见「一条 5 层闭包组成的链」，**说不清卡在哪一层**。

**改之后**（`source/src/app1_core.js`，紧跟 `baseSpeak` 那段）：
```js
VOICE.use('bgm-19',  function(next, text, id, onend){ … next(text, id, …) })
VOICE.use('rel-45',  function(next, text, id, onend){ … })
VOICE.use('tts-62',  function(next, text, id, onend){ … })
VOICE.use('voicefix-86', function(next, text, id, onend){ … VOICE.below('tts-62')(…) })
VOICE.use('memcall-88',  function(next, text, id, onend){ … })
```
- `fn(next, …)` 里的 **`next` 就是原来那层的 `_speakNN`**，逐层语义对齐。
- **执行顺序 = 注册顺序的倒序**（后注册的在外层），与原闭包嵌套一致。
- `VOICE.below(名字)` = 「该层注册之前的那条链」= 原来那个 `_speakNN`。**app86 靠它保持「跳过 app62」的原语义**（它原来调用的是 app62 文件里捕获的 `_speak62`，那个值其实是 app45）。
- `speak` 现在只剩一行：`function speak(text,id,onend){ return VOICE.run(text,id,onend) }`；函数体改名 `baseSpeak`。

**加第 6 层就是 `VOICE.use` 一行。** 不要再写 `const _speakNN=speak`。

#### 链 D·2 `speakQueue` 的看门狗与日志（2026-10-27）

`app3_chat.js` 的 `speakQueue(list)` 原来只靠 `onend` 递归推进 ⇒ 任何一层漏调就永久停住。

- **看门狗**：每条 `VOICE_TIMEOUT_MS = 8000` 内没 settle ⇒ 强制推下一条，记 `why:'timeout'`。
  定在 8s 是**故意高于** TTS 兜底的 4s —— 只在真卡住时开火，TTS 慢一点不会误伤。
- **环形日志** `VOICE_LOG`（32 条，也挂 `window.__voiceLog`）：`{who, txt 前 16 字, ms, why}`。
  `why` ∈ `ended` / `timeout` / `throw`。**在这之前，这四种死法在屏幕上完全同形。**

#### 链 D·3 语音的尺子：`tools/voice-probe.mjs`

**它存在的理由**：这条链原来**没有任何东西在量**——一句不出声，屏幕上只剩「生成中」。

```powershell
node tools/serve.mjs 8131                              # 必须（探针要真页面）
node tools/voice-probe.mjs --json > 新读数.json         # 三条臂
```

| 臂 | 喂什么 | 正常读数（2026-10-27 基线，存 `tools/voice-baseline.json`） |
|---|---|---|
| `ok` | 真的 8kHz/8bit WAV（约 600ms） | ≈690–970ms，通道 `tts-fetch` |
| `corrupt` | 解不出的字节 | ≈600ms 且**设备语音 3 次**（降级成功） |
| `hang` | 永不返回的 fetch | 4,600ms/条，**3/3 排空** |

**它抓到过的两个真 bug**（都已修，留作反面教材）：
1. `a.onerror = () => onend()` 与 `a.onended` 效果**一模一样** ⇒ 解码失败被当成「播完了」，坏音频 **1–3ms** 推进队列、一声没响，而所有计数器健康。
2. 兜底 8s ⇒ 挂死的 TTS **8.6s/条**，三条 26s，**读作卡死**。降到 4s（缓存命中 1.4s）后 4.6s/条。

**两条自检**（尺子自己的，别再犯）：
- `w.speechSynthesis = stub` 在 Window 上是**只读访问器**，直接赋值**静默无效** ⇒ 必须 `Object.defineProperty`，并且**证明桩真的装上了**。
- `ok` 组的耗时必须**跟着音频长度走**（改 `PLAY_MS` 读数要变），否则量到的是别的东西。

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

---

## 5·补 热度为什么不升：**瓶颈是场景，不是 prompt**（2026-10-28 实测）

**问题**：玩家反馈「角色撩不动」。

**先做错的两次**（记下来，免得下一个人重走）：
1. 默认那 6 句玩家台词是**剧情推进**型（"把椅子挪中间"），一句都不撩 ⇒ `sim-dialogue` **天生看不见 heat**，第一次 A/B 拿到 0/0。
2. 打分正则写的是**英文**关键词，而对话是**中文** ⇒ 两栏都报 0。

**正确的实验**：同一个 `tools/sim-dialogue.mjs`、同一组撩的台词（`--lines=`）、`deepseek-chat`，**只换 pack + 章节**，判据跑之前写死，每格 n=3。

| 场景 | 章节 | 结果 |
|---|---|---|
| **赛前冰场**（浇冰 / 热身哨 / 教练催 / 看台喊名字） | `ice` ch5 | **两版都不升温** —— 角色说「哨响了，左路那个位置不会自己走过去」 |
| **封闭场景**（公寓 / 清晨 5:50 / 只有两个人） | `crimson` ch6 | **两版都升** —— 角色说「我把手从窗框上拿开，往你那边挪了半步」 |

**而 prompt 那两处改动的贡献，测不出来**：外部靠近均值 改前 **5.0** / 改后 **5.3**，口头承认 **1.0** / **0.7** —— 全在噪声里。

⇒ **结论：挡路的是「场景里有没有别的事正在发生」，不是措辞。**
角色有正当理由走开时（哨响、会议、有人在旁边），任何 prompt 都留不住他；场景封闭时，两版都升。

⇒ **数据是现成的**：`source/content/out/sNN.json` 的 `chapter.place` / `chapter.time` 里能筛出 **38 条封闭场景**（判例：`crimson` ch6 / `unseelie` ch4 / `light` ch3 / `roomies` ch6）。
**下一步该做的是让 heat 高的互动优先落在这些场景里**，而不是继续删 prompt 里的话。

### 5·补二 第三次试 prompt：把「玩家在撩」告诉模型 —— **也测不出效果**

**发现（这条本身是真的，值得留着）**：系统**早就认得出**玩家在撩 —— `app55_talk.js:19` 的 `talkIntent` 有 `flirt` 类（`TALK_RX.flirt`，17 个词），并且它被用在三处：兜底台词（`TALK_FB.flirt`）、记忆与维度增减（`flirt: att+2, ten+2`）、候选句（`talkSugg`）。
**但这个意图从来没进过 prompt** —— 模型只看到原话，看不到「这一句是撩」。

**试过什么**：在 `app3_chat.js` 的 `NOW:` 之后加一条条件行，认出 `flirt` 时告诉模型「这是 advance，应答它本身，别拿剧情挡」。

**读数（n=3 每格，同一场景 `ice` ch5、同一组台词、只有这一条 prompt 行不同）**：

| 跑 | 表现 |
|---|---|
| 改后 #1 | 全在打战术（「左路归我…分工就这么定」）—— **完全没应答** |
| 改后 #2 | 「你刚解我扣子的时候，我差点以为你要…上点新花样」—— 应答 |
| 改前 #1 | 「那颗扣子解开了，我小腿上的麻劲反倒更明显」—— **也应答** |
| 改前 #2 | 「我没去碰你解开的扣子，反而把左腿又抬高一点，**脚踝搁在你膝盖上**」—— 四组里最进的一步 |

⇒ **第一对跑出来的差异是运气。** n=3 分不出改前改后 ⇒ **改动已撤回**（`git checkout HEAD -- source/src/app3_chat.js`）。

**三次都同一个结论**：① 删 `HEAT_RULE` 的话 ② 删 charter 的话 ③ 把意图告诉模型 —— **三刀全在 prompt 层，三次都测不出**。
⇒ 在这个产品里，**prompt 措辞不是升温的杠杆**；「场景里有没有别的事在做」才是（上面那张两行表就是证据）。

---

---

## 5.5 剧本管道（总览 · 2026-10-29 梳理）

> 下面 5·补三 / 补四 / 补五 / 补六 / 补七 是按「哪天改的」堆起来的。要回答「一份稿子怎么变成玩家和模型看到的东西」，看这一节；要查某次改动的细节，再翻那几节。

**四层，一层一个唯一咽喉**（改任何一层之前先确认自己在哪一层）：

| # | 层 | 唯一入口 | 产物 | 细节 |
|---:|---|---|---|---|
| 1 | 摄入 | `admin.html` 导入 → `api/admin.js` `op=publish` | `works.pack.script`（DSL 文本，一章一段） | 5·补三 |
| 2 | 解析 | **`PARSE.parse`**（`app51` 注册表，5 层） | `doc`（章节 / items / cast / secrets / goal94） | 5·补四 |
| 3 | 打包 | `imBuild` | `pack`（`chapters[]` / `secrets[]`） | 5·补四·补五·补六 |
| 4 | 提示 | `packPrompt(th)`（`app14_pack.js`） | 一条 system 字符串 | 5·补六 |

**指令矩阵（剧本里能写什么、写到哪儿去找答案）**：

| 指令 | 谁消费 | 生效位置 | 状态 |
|---|---|---|---|
| `⟦CHAR⟧` | `app94` walk | `doc.chars94` → 演员表 | ✅ |
| `⟦BGM\|TIME\|BG\|CG\|VIDEO\|PHOTO\|MG\|FREE\|CALL⟧` | `app94` walk | 节拍 / 场景卡 | ✅ |
| `⟦ITEM⟧` | `app101` 层 | 道具卡 | ✅ |
| `⟦SET⟧` `⟦IF⟧⟦ELSE⟧⟦/IF⟧` | 解析 → `sys set` / `sys if` 节拍 → `app16_story2.js:27-28` | 玩家身上的旗与条件 | ✅ |
| `⟦OPT\|A\|set:…;love:…⟧` | 解析 → `opt.set/love` → `app14_pack.js:471`（场内）/ `:233`（章末） | 选项效果 | ✅ `set` 两处都生效，`love` 只在场内 |
| `⟦GOAL⟧` | 解析 → `chapter.goal`(+`goalOwn`) → 章节卡 / 章节列表 / **prompt** | 读者看到目标；角色拿到"这一章要立什么" | ✅（`chat.chapterGoal`） |
| `⟦SECRET⟧` | 解析 → `pack.secrets` → `packPrompt` 的 `YOU DO NOT KNOW` 行 | 角色**不该**知道的事 | ✅ 章级闸已验；`knows:` 支未验（见下） |
| `⟦REVEAL⟧` | 解析 → `sys set` 的 `secret:S_x` 旗 → `packPrompt` 提前解锁 | 正文里揭露的那一处 | ✅ |
| `⟦ORIENT\|bl\|gl\|bg⟧` | 解析 → `doc.orient94` → `imOrient()` → `world.or` / `works.orient` | 发现页的取向筛选 | ✅（2026-10-29 补） |
| `give:` / `need:` | 不消费 | — | 🟡 写了被忽略 |

**三条不变式**（每条都是踩出来的）：

1. **顺序即语义**：解析层的层序写在 `PARSE` 表里，不由 `parts[]` 猜（5·补四）。加一层就 `PARSE.use` 一行。
2. **不写就一字不变**：`⟦GOAL⟧` 不写 ⇒ goal 仍从章末问题倒推；`⟦SECRET⟧` 不写 ⇒ 没有 `YOU DO NOT KNOW` 行。判据是 8 份语料逐字段相同。
3. **消费点必须实测**，不是"代码看起来读了"：`⟦OPT⟧` 的 `set` 是查了 `app14_pack.js:471` 才敢说两侧都生效；`⟦GOAL⟧` 进 prompt 是探针 `promptHasGoal: yes` 才算。
4. **每个会被玩家看见的字段都要有来源，而且在上传那一刻就回话**（2026-10-29 的教训）：`or`（取向）原来是 `imBuild` 里**硬编码 "bl"**、`_dslqa` 里**一条判据都没有** ⇒ 五部女性向的稿子被发成 BL，取向选"女性向"的读者在发现页**根本看不到**，而这件事要对方来问才发现。
   现在的形状：`⟦ORIENT⟧` 显式声明 → 否则 `imOrient()` 按角色卡推（玩家性别 × 对手戏性别）→ `_dslqa` 在同一份稿子上给出 `stats.orient = {declared, inferred, final}` 并在矛盾时**报 err**、缺失时**报 warn（附带建议写的那一行）** → `autoreview` 把它写回 `scripts.orient` → `publish` 用 `qa.stats.orient.final`。
   **回执**：`autoreview` 现在返回 `receipt`（固定形状一段话：章/场景/选择/选项/收尾/「你：」· **取向（声明 or 推断，带建议写哪一行）** · 未识别指令 · 受限词 · 结论 · 前 3 条提醒），并存进 `qa.receipt`；`admin.html` 第 4 步把它打在细节前面，整段可直接复制给药方。
   判据：`_check/orient-test.mjs` 四支（显式对 / 显式与角色卡矛盾 / 非法值 / 不写则推断）各自读对，且**红在正确的消息上**（第一版四支"全中"其实是误判 —— `⟦ORIENT⟧` 当时还没进 KNOWN，四支都是被"未知指令"那条擦中的）。

**认知边界（`⟦SECRET⟧`）的验证现状，写清楚免得下一个人误信**：

```
第 1 章 → S_A(6 章揭露) 与 S_B(2 章揭露) 都进"你不知道"
第 2 章 → S_B 不再出现（已揭露），S_A 仍在  ✓
开关 chat.secretBoundary=false → 整行不出现  ✓
⟦REVEAL|S_A⟧ → 节拍里出现 set:secret:S_A；把那个旗打上后 S_A **立刻**不再"你不知道"，S_B 不受影响  ✓
knows: 那一支（"他知道所以不瞒他"）→ ✅ 已验（见下）：`__secrets` 显示接口
```

**显示接口 `__secrets(th)`**（`app14_pack.js`，2026-10-29 加）：返回 `{on, chapter, me, as, all, hidden, flags}` ——
"这一刻系统认为你在演谁、以及他该不知道哪些秘密"。
它为什么必须存在：`ch()` 是**闭包里的函数、不是全局**，探针从外面调会拿到 `ch is not a function`
⇒ 在它之前，`knows:` 那一支一直"被跳过"，看起来像功能没做，其实是**尺子伸不进去**。

探针读数（`parse-effects-probe.html`，全部开火）：

```
actor            {id:"u…", me:"Calder"}          ← 显示接口解析出了在演谁
ch1_noActor      ["S_A","S_B"]                   没指定谁 ⇒ 两个都藏
ch1_actor        ["S_B"]                         演 Calder，S_A 的 knows 里有他 ⇒ S_A 不藏
ch2_noActor      ["S_A"]                         S_B 在 2 章揭露 ⇒ 掉出名单
revealFlag       ["S_B"]                         打 secret:S_A 旗 ⇒ S_A 掉出名单
knowsArm         []                              把 Calder 加进 S_B 的 knows ⇒ 两个都不藏
```

**两种解锁，分清楚**：`reveal_from` 是**最晚**解锁（章号到了自动不藏）· `⟦REVEAL|S_A⟧` 是**提前**解锁（正文写到那儿就放）。
`⟦REVEAL⟧` 生效时机是**下一个回合**——system 是每轮先算的，揭露那一句本身由剧本给出，不需要模型提前知道。

失败的处置是**失败即闭**：`_me` 取不到时（`as` 是旁观 / 角色查不到），**所有秘密都当"他不知道"**——宁可他演得笨一点，也不要他说破。
`⟦REVEAL|S_A⟧` 已接（2026-10-29）：它把一个 `secret:S_A` 的旗打进玩家身上，下一回合起这个秘密就不再出现在"你不知道"里。

---

## 5·补三 剧本导入与内容过滤（2026-10-28 · 官方剧这条入口）

**三次切块**（改这条链之前先看这三层，别把"切块"当成一处）：

| 次 | 在哪 | 切成什么 |
|---|---|---|
| ① 导入 | `admin.html` 的「导入 .md / 批量导入 .md」 | 一份交付稿 → `chapters=[{n,t,md}]`；**从第一章往上取 `⟦CHAR⟧`，从章后第一个「# 二、后台内容」往下整段丢弃** |
| ② 上线 | `api/admin.js` 的 `op=publish` | 章按 `n` 拼成一整篇 → `works.pack.script`，并打 `pack.ver` |
| ③ 播放 | `imParse`(app51) → `app90` → `app94` → `imBuild` | 章/场景/台词/旁白/选择/分支 → `beats=[who,kind,text]` + 章末 `choices` |

实测（5 份编剧交付稿）：整份直接入库会多出 **327–368 条旁白**（后台设计被当旁白念），切掉后是 **1 章 · 24 台词 · 28 旁白 · 2 选择 · 1 自由输入**。

**内容过滤：一个词表，两把尺 → 现在是一把**

- 词表在 `source/src/app51_import.js` 的 `IM_EXPLICIT`（14 词）；`imStrip()` **先去掉正常用法再匹配**：`硬物(砸|落|撞)`、`(手指|指节|嘴角|喉结|肌肉)…抽动`、`鼓起(勇气|腮|掌|嘴)`。
- `app57_rules.js` 的 `qaSafety()` 现在**直接调 `imStrip`**（原来它自己写了一套同样的排除 ⇒ 两个来源）。改动前实测：3/5 份稿子的「心跳鼓起」被整句删成「（这一段已省略）」。
- 服务端 `api/_lib.js` 的 `EXPLICIT`（13 词）**没有** 硬物/抽动，所以它更松；**两份词表仍未统一**（要统一得抽一份共享清单给 api 与 bundle 两边读）——这是开着的格。

**官方剧上线原来没有结构校验**（2026-10-28 补）：`op=publish` 只查「有章节 / review.approved / qa.err 空」，而 `qa` 是浏览器算的、`review` 是人点的；`planValid`/`structureQA` 对官方 pack 也用不上（它们要求 `pack.chapters[]`，官方只有 `script` 文本）。
⇒ 新增 `api/_dslqa.js`（纯函数，行级判：章/场景/选择/`# ·` 收尾/`⟦CALL⟧` 闭包/未知指令/`你：`）+ `op=autoreview`（绿了才写 `review.approved`，审稿人记「D先生」）+ publish 时**再跑一次** `safety()`（防"审完又改文本"）。自检 6 臂（1 正 5 负）在 `_check/dslqa-selftest.js`。

## 5·补四 剧本解析层：四层猴子补丁 → 一张注册表（2026-10-29）

**原来是什么样**：`imParse` / `imBuild` 被 4 个文件各自用 `imParse = function(){…}` 包一层 ——

```
app51(核心) ← app90(你：) ← app94(⟦…⟧ 指令) ← app94(you94) ← app101(⟦ITEM⟧)
```

层的**顺序只由 `build.py` 的 `parts[]` 决定**，包错一层不报错、只会「结果怪一点」。最实在的后果：`⟦ITEM⟧` 能用**纯粹是因为 `app101` 恰好排在 `app94` 之后**。这和 10-27 治掉的 `speak` 五层补丁是同一个病。

**现在**：`PARSE.use(名字, {parse?, build?})`，与 `VOICE.use` 同形。**注册顺序 = 层序（先注册在里层）**，与「后装载的包住先装载的」完全等价。

| # | 层 | parse | build | 管什么 |
|---:|---|---|---|---|
| 1 | `app90:youturn` | ✓ | ✓ | 玩家台词 `你：` → 「轮到你说」停顿点；`你` 不进演员表 |
| 2 | `app94:directives` | ✓ | ✓ | `⟦CHAR/BGM/TIME/BG/CG/VIDEO/PHOTO/MG/FREE/CALL⟧` 提成结构指令 |
| 3 | `app94:scene-rereg` | | ✓ | 场景图重新登记（`SCENE_FILES` 不进存档） |
| 4 | `app94:you94` | ✓ | ✓ | 官方剧的主角视角（`you94`） |
| 5 | `app101:item` | ✓ | | `⟦ITEM⟧` → 道具卡 |

`imParse` / `imBuild` 保留成**兼容门**（老调用点 app76 / app53 / 上传页一个字不用改），都 delegate 给 `PARSE`。
**显示接口**：浏览器控制台 `__parse()` → `{stats:{layers,parse,build,err}, layers:[…]}`。出问题先看层表和调用次数，别猜谁包了谁。

**等价性怎么证的**（不是"看起来一样"）：`tools/parse-probe.html` 把 8 份语料（5 部新剧 + `danger` / `moon` / `velvet` 原稿）喂给同一份解析器，输出逐字段摘要（章 / items / choices / variants / scenes / lines / omit / pov / cast / sp / chars94 / you94 / 章节标题）。
改前对 `reports/parse-baseline.html`（旧产物副本）跑一次、改后对新 `index.html` 跑一次 ⇒ **8/8 逐字段相同**（读数存档 `reports/parse-before.json` · `parse-after.json`）。

**闸**：`tools/parse-registry-check.mjs`（已进 `check-all`）—— 守四件事：层表名字/顺序/职责、没有 `imParse =` / `_imParse9x` 回潮、兼容门与 `__parse` 还在、`parts[]` 里这四个文件的装载顺序仍是 51→90→94→101。
自检 5 臂：正常绿 + 四枚变异（删一层 / 重名 / 顺序挪动 / 塞回猴子补丁）各自红在预期那条。

## 5·补五 剧本语法补上「留痕 / 条件」（2026-10-29）

**先例**：运行时**早就支持**了 —— `app16_story2.js:27` 消费 `["sys","if",{cond,then,else}]`、`:28` 消费 `["sys","set",{flags}]`，`pkCond` 支持 `pick/flag/not/love/any/all`。
缺的只有**剧本里能写出来的语法**，于是编剧交来的「MEM_xxx 留痕 → 后文回扣」一张都落不了地。

| 剧本写法 | 产出 | 说明 |
|---|---|---|
| `⟦SET\|mem_video_kept⟧`（多个用逗号） | `["sys","set",{flags:[…]}]` | 落在**它所处的位置**：章一级 = 读到就记；写在某个选项的后果里 = 只有选了那个选项才记（后者才是"选择有后果"） |
| `⟦IF\|flag⟧ … ⟦ELSE⟧ … ⟦/IF⟧` | `["sys","if",{cond:{flag},then:[…],else:[…]}]` | 可嵌套；`⟦IF\|!flag⟧` → `{not:flag}` |
| 漏写 `⟦/IF⟧` | 内容**平铺**播出 + 一条 `doc.warn` | 宁可播出来，也不静默吞掉后面的正文 |

**证明**（`tools/parse-effects-probe.html`，跑在真产物上）：一次喂进「SET / IF+ELSE / IF 取反 / 嵌套 IF / 未闭合 IF / 选项后果里的 SET」，读数逐条对得上；并且同一个探针用假 `th` 直接跑运行时 —— `pkCond({flag})` 在 `pkSet` 前后 **false → true**、`{not}` 同步反向，**结构真的能驱动运行时**，不只是形状对。
语料回归：8 份既有语料与重构前**逐字段相同**（这次改的 `walk` 是所有 ⟦…⟧ 的公共路径）。

**服务端审查同步**：`api/_dslqa.js` 的 `KNOWN` 加了 `SET/IF/ELSE//IF/OPT`（否则合法的留痕/效果句会被判「未知指令」挡住上线），并新增一条 warn：`⟦IF⟧` 与 `⟦/IF⟧` 数量不等。

**选项效果（同一天补上）**：`⟦OPT|A|set:f1,f2;love:2⟧`（紧跟 `#### A｜…`）落到 `opt.set` / `opt.love`，**只在这一项被选中时**生效。
`imBuild` 的两处映射都加了透传（场内选择 `b[1]==="line"` 的 `opts`、章末 `choices[]`）——不透传的话效果会在 doc→pack 这一步静默丢掉。
实测消费点：`app14_pack.js:471`（场内）`pkSet(th,o.set)` + `o.love`；`:233`（章末）`pkSet(th,x.set)` ⇒ **`set` 两侧都生效，`love` 只在场内选择上被读**。
探针 `tools/parse-effects-probe.html` 现在三层一起验：doc 结构 → **pack 里的 `lineOpts/endChoices`**（`S` 是顶层 const，只能在 iframe 内 eval）→ 运行时 `pkCond/pkSet`。

**还没接**：`give:` 得道具、`need:` 需要道具才能选 —— 写了会被忽略（不报错、不生效）。

## 5·补六 章节目标 `⟦GOAL⟧`（2026-10-29）

**语法**：`⟦GOAL|中文目标|English⟧`（第二段可省，省了 EN = 中文），写在章内任意位置（惯例是标题下一行）。解析层把它从 items 里**摘出来**挂到章上（`off94Parse` 的章循环），`imBuild` 用 `goal: c.goal94 ? … : x0(endC && endC.q || "")` —— **不写 GOAL 时行为一字不变**。

**它影响哪里（读了三个消费点）**：

| 读者 | 位置 | 现在 |
|---|---|---|
| 章节开头那张卡 | `app14_pack.js:100` `txt:Lz(c.goal)` | 显示 |
| 章节列表副标题 | `app15_home.js:134` / `app47_chapters.js:16` | 显示 |
| 模型的 "WHAT THIS CHAPTER IS FOR: …" | `app14_pack.js:342`（新的一行） | **进**（2026-10-29 Ann「接吧」后接上） |
| 模型的旧口径 "CHAPTER n/N · Chapter goal: …" | `app14_pack.js:330` | 仍**不进** —— 那段包在 `MIRU_TUNE.chat.characterMeta === true` 里，默认 **false**（2026-10-28 的决定：不给章节编号、不预告下一步要选什么） |

2026-10-29 的第二次决定（Ann：「接吧。我感觉在你的设计里面，这个是比较重要的一部分」）：**只放"这一章要立什么"进去**，
编号、共几章、下一步官方选择**仍然关着** —— 理由是 10-28 她删掉那段的原话（角色一旦知道该推进到哪，就会提前使劲、说出还没发生的事），
而"这场戏要立什么"不是"你下一步该被选什么"。开关是**新的** `MIRU_TUNE.chat.chapterGoal`（默认 **true**），
`false` 一个开关回到 10-28 的干净版；`characterMeta` 保持 false 不动。
措辞里带两道刹车：`let it shape what happens, never say it out loud, never announce that anything is coming`。

⇒ 结论：`⟦GOAL⟧` 现在**既是读者的目录，也是角色的意图**（只管意图，不管日程）。

**只有编剧明写的 GOAL 才进**：`imBuild` 在章上打 `goalOwn: !!c.goal94`，prompt 那行的条件是 `_goalOn && c.goalOwn && c.goal.en`。
没有 GOAL 的章，它的 `goal` 是"章末那个问句"——那是**读者的议程**，给角色看会让他替玩家推进那个决定（正是 10-28 删掉那段的理由）。⇒ 现有 5 部线上稿件没写 GOAL ⇒ **行为一字不变**。

探针（`tools/parse-effects-probe.html`）正负两臂：正臂 `promptHasGoal: yes`；负臂在**同一个世界**上把 `goalOwn` 翻成 false，那一行必须消失（`hadLine: true → stillHasLine: false`）。
⚠️ 第一版负臂是"另建一部没有 GOAL 的作品"，而 `imBuild` 的 `wid = "cw"+Date.now()` 在同一毫秒里会**覆盖**前一部 ⇒ 正臂读到假失败。教训：A/B 要落在同一个对象上翻一个字段，别靠"再建一个"。

**一个我先前判错的点（留档）**：我原以为"goal 现在是空的/废话，因为只能从章末问题倒推"。实测 5 部稿件：`# CHOICE｜…` 每部 **12 条、去重 12 种**，都是像「独立训练站稳以后，你还允许怎样的联系？」这种真句子 ⇒ **倒推出来的 goal 本来就不差**。`⟦GOAL⟧` 的真正增量是：编剧可以写「这一章的戏要立什么」而不必借提问暗示；不写则一切照旧。

## 5·补七 内容加载缝，与两种产物形态（2026-10-29）

**为什么要动这块**：测试服（香港 5 Mbps）实测 **首次打开 16.6 秒 / 9.84 MB**；
gzip 后 3.53 MB 仍有 **6.0 秒**。9.84 MB 里 **6.27 MB 是 37 部剧情**，而玩家一次只玩一部。

### 两种产物形态（`build.py`）

| 形态 | 命令 | 产物 | 体积（2026-10-29 实测） |
|---|---|---|---|
| 单文件（默认） | `python source/build.py` | `index.html` 自包含 | **9.84 MB**（gzip 3.53 MB） |
| 拆分 | `python source/build.py --split` | `index.html` + `content_36.js` | **3.13 MB + 6.27 MB** |

⚠️ **拆分本身不减少首屏**（两份合计仍是 9.8 MB，`content_36.js` 仍随页加载）。
它买到的是两件事：**改剧情不废 app 包**、**内容文件可长缓存**。
测试服已加：`location = /content_36.js { expires 30d; }`（备份 `/root/miru-nginx.bak-*`）。

### 加载缝（`source/src/app113_content.js`，第 1 步）

```js
MIRU.data.loaded(wid)     // 这一部的内容现在在内存里吗（判据：wd(wid).pack.chapters 非空）
MIRU.data.need(wid)       // 进世界前调它；没命中就记一条 S._dataGap（带调用栈）
MIRU.data.prefetch(wid)   // 预留：玩这一部时取下下一部
```

调用点只有两个（「进入某个世界」的必经处）：`newThread`（`app3_chat.js:19` 附近）与 `openThread`。

**判据（跑完一章实测）**：`S._dataGap` = **0**、`S._dataErr` = 0、章节照常推进（4→10 条）。
即：现在**没有任何路径在数据没到时读** —— 这是允许下一步拆包的前置条件。

### 为什么**不能**整包懒加载（实测拦路，别再试）

```js
// app15_home.js:8  —— 发现页是这么筛的
function packWorlds(){ return W.filter(w => w.pack) }
```

**首页靠「`w.pack` 在不在」判断这是不是一部剧**（`PCN(w)` 数章节数、`app2_pages.js:196` 分流也在用）。
⇒ 整包懒加载会让**发现页一部都不显示**。

### 正确的下一步：两段式（元信息 / 章节）

| 段 | 内容 | 谁需要 | 估重 |
|---|---|---|---|
| 元信息 | 章节数、封面、简介、cast、tag | **首页就要** | ~0.3 MB |
| 章节 | `chapters[].beats` | 只有进那一部 | ~6 MB |

首屏降到 **约 3.4 MB（gzip ~1.2 MB）⇒ 首次 ~2.5 秒**。
**代价**：`packWorlds()` / `PCN()` / `storyPage()` 等判定要改成两段式（涉及 5–8 个文件），
而且**没有自动判据能证明首页没被改坏**——只能人眼看。**所以这一刀要她拍板才能动。**

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
> 每一条都配**读数命令**与**闸**；闸都在 `tools/check-all.mjs`（**47 套**），且每道都做过变异测试。
> 截至本日收盘的全部读数：

```
猴补丁      145 个函数 / 320 处   （当天起点 382 ⇒ −54；2026-10-27 语音那 5 层 `const _speakNN=speak` 已换成 VOICE 注册表，减 3；2026-10-29 剧本解析那 4 层也换成 PARSE 注册表，再减 2 函数 / 8 处）
空 catch    569 处 / 99 个文件    （当天起点 616 ⇒ −41）
on* 绑定    硬类 0 处 · 软类 93 处 · addEventListener 399 处
剧本指令    26 层注册 · 21 个类型 · 1 处已声明死代码
消息渲染    18 层 = kind 10 / post 6 / wrap 2（`say` 收口后从 20 层减 2）· 17 个类型
            **1 个类型**被两层认领（xmoney，顺序接力不是抢）· **0 层已知死**（28 条探针，18/18 层被证活着）
            逐字节快照 **21 种**消息（`box+say` 那条真实路径原先不在表里，2026-10-27 补上）
渲染钩子    22 个（每个 0 失败）
样式        65 个 <style> 生效 / **2691** 条规则 · 重复定义 **17 个选择器**（同 sheet 叠层 8 · 跨 sheet 抢 9）
            （当天起点 2818 条 / 81 个重复 ⇒ 合并 63 条、删 35 条；另 4 个重复**故意不合并**。
              ⚠️ 63+35=98 ≠ 2818−2691=127 —— **这几个数是不同时刻各自量的，不要求相加**）
            生效值快照 30 探针 × 26 属性 = 780 格（闸：style-computed-snapshot）
弹层        menuSheet 8 层 → 7 个具名块 + 1 个改文字层 · memSheet 3 层 / m2Sheet 2 层**判定不搬**
            快照 **10 个弹层**逐字节（闸：sheet-snapshot）· 包装层数两向红（闸：sheet-census）
错误日志    2 分钟窗口
```

### 7.1 起点：一条链被 26 个文件分别改过

`tools/patch-registry.mjs` 在当天早上量到的是 **382 处** `const _x = x; x = function(){ … }`。
每一处都是**没有契约的接口**，而最要命的是：**任何一层抛异常，它后面所有层都不再执行**——
界面上只表现为「少了一块」，控制台里一条没人看的错。

⇒ 于是把「一个东西几条路」逐个收成一个入口。**收的顺序按「今晚哪类 bug 归它」排**，不是按代码多少。

### 7.2 十一个入口

| 入口 | 文件 | 把「什么」变成唯一 | 读数 | 闸 |
|---|---|---|---|---|
| **回合** `TURN` | `app103_turn.js` | `busy` 这个 boolean（原来四拨人各自解释） | `__turn()`：持有者 · 已持ms · **冲突次数** | `turn-wiring-check` |
| **章节状态** `PKST` | `app104_pkstate.js` | `th.pk.st` 四值 / 10 个写点在 4 个文件 | `__pkst()`：每条纹路 · **非法迁移** | `pkstate-check` |
| **存档** `SAVE` | `app105_save.js` | `save()` 的调用点无归因（**377 处**：`save()` 出现次数，去注释与定义；⚠️ 旧记的 397 把 canvas 的 `x.save()` 也算进去了） | `__save()`：最慢 · **最烧调用点（文件:行）** | `save-instrument-check` |
| **渲染入口** `UI` | `app106_ui.js` | 渲染后的动作：25 层匿名包装 → **1 调度 + 22 具名钩子** | `__ui()`：钩子名 · **失败数** · 最近错误 | `ui-entry-check` |
| **剧本指令** `PKREG` | `app110_pkreg.js` | 26 层 `pkDirective` 包装 → **一张注册表** | `__pkreg()`：注册层 · 分发次数 · **层内抛错** | `pkdirective-check` |
| **弹层块** `SHEET` | `app112_sheet.js` | `menuSheet` 的 8 层包装 → **注册表里 7 个具名块 + 1 个改文字的包装**（`memSheet`/`m2Sheet` 判定不该搬：各层锚点不同、且顺序语义落不进这个形状） | `__sheet()`：每层有哪几块、插前还是插后 · `SHEET.stats()`：插入次数 · 抛错次数 | `sheet-snapshot`（**10 张**快照逐字节）· `sheet-census`（包装层数两向红） |
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

### 7.5 消息渲染：三类登记 + 「你活着吗」探针

`msgHTML` 有 **19 处**包装，形状是**三种混的**，所以它不能像剧本指令（26 层一个形状）那样一次扁平化。
其中 `app16_story2.js` 那一处是**一个函数干两件事**（认领 box/scene/intro ＋ 删掉每行的快捷按钮），
拆成两层登记 ⇒ 合计 **20 层**：

| 类 | 层数 | 干什么 | 判它好坏的问题 |
|---|---|---|---|
| `kind` | 12 | 按 `m.k` 认领渲染 | **谁认领了这个类型**（两层认领 = 冲突） |
| `post` | 6 | 拿到已渲染的 HTML 再加工 | **它有没有真的改过东西** |
| `wrap` | 2 | 条件改写入参，再交给内层 | 换了入参，内层还认得出吗 |

⇒ 立 `MSGKIND`（`app111_msgkind.js`），**原位安装**（顺序一字不改 —— 后处理层必须看到内层渲染结果，
整体挪到最外层会让它看不到消息），另记两个可数读数：`hit`（真的改了东西）· `nextCalled`（交给内层）。

       MSGKIND.inline('app42_decline.js', ['declined'], function(m, i, th, next){ … })
       MSGKIND.post('app98_story.js', function(h, m, i, th){ …; return h })
       MSGKIND.wrap('app34_hints.js', function(m, i, th){ …; return m2 })

**20 层全部搬完，一处不剩**（12 `kind` + 6 `post` + 2 `wrap`）。
`__msgkind()` = 20 层 / 17 个类型 / 2 个类型被两层认领。
两把尺子分工，缺一不可：

- `tools/render-snapshot.mjs` —— 19 种消息的 HTML **逐字节**不变（迁移不许改行为）
- `tools/msgkind-probe.mjs` —— 每层**有没有真的干活**（26 条探针 = 24 条命中判据 + 1 条对照 + 1 条已知死）

**认领图从运行期读，不再从源码猜**：`node tools/msgkind-probe.mjs --graph` 打出
「类型 → 认领层」。这一步是被现实逼出来的 —— 静态扫源码的 `tools/msghtml-kinds.mjs`
**漏记了 `app24` 认领 `xmoney`**（它的条件写成取反 `m.k!=="xmoney"`，正则形状对不上），
于是「xmoney 只有一个认领层」这个读数是错的；认领是运行期才成立的事，图就该在运行期读。
⇒ 那个静态工具**已删**（`cbf1eb0` 可恢复）：一个会给出不完整认领图的工具留在仓库里，
下一个人会相信它 —— 这比没有这个工具更坏。

```
act/app16 · box/app16 · declined/app42 · event/app16 · intro/app16 · item101/app101
missed/app20 · mono/app19 · scene/app16 · think/app16 · vn96/app96 · xanchor/xpost/xtitle/app23
say      **（无认领层）** —— base 的 `sayHTML` 按 `speakerOf` 派生 me/self/other（2026-10-27 收口）
xmoney   app23_heir   · app24_gl         ← 顺序接力：未解锁由外层 app24 答，解锁后交回 app23
```

### say 的接口位置（2026-10-27 收口后，全部实测）

一句话：**`say` 只有一处决定「长什么样」，但有两条入口**（`k:"say"`，以及真实的 `k:"box"` + `m.say`）。

| 是什么 | 位置 | 说明 |
|---|---|---|
| 旁白分流 | `source/src/app3_chat.js:184` | `who==="n"` → `.m-narr`。**必须排在 say 分派之前** —— 旁白也带 `k:"say"`，放后面会被当成「别人说」（实测 narr 从 58 字符变 307） |
| **say 分派** | `source/src/app3_chat.js:185` | `if(m.k==="say")return sayHTML(m,i,th)+tools;` |
| 「你扮演的人」旧分支 | `source/src/app3_chat.js:186` | `who===pk.as` 的 `.m-box lb` + `.asme`。**必须排在分派之后** —— 排前面时 `self` 永远走不到 sayHTML |
| 说话人判定 | `source/src/app3_chat.js:201` `speakerOf(m,th)` | 派生、不存盘：`me` / `self`（需 `m.pk && who===th.pk.as`）/ `other` |
| **唯一的渲染器** | `source/src/app3_chat.js:207` `sayHTML(m,i,th)` | 三个分支共用 `.m-row` + `.bub` + `<p class="bac">` |
| 正文标记 | `source/src/app16_story2.js:69` `lineHTML` | 产 `<p class="bac">`；行内 `+…+` → `<em class="mt">` |
| 行内 `*动作*` | `source/src/app16_story2.js:294` `fmtMix` | 产 `<em class="ma">`，由 `:300` 的 post 层套用 |
| **真实第二条入口** | `source/src/app17_custom.js:73/76` `boxHTML` | `app26` 把连续台词包成 `k:"box"` + `m.say` ⇒ **别人的台词实际走这里**，不是 `k:"say"`。`:76` 已改成同一套 `.m-row` + `.bub` |
| 气泡钩子 | `source/src/shell.html:238` `.m-row:has(> .rg73)` | 折行只给挂了按钮条的行（否则头像被折到下一行） |
| 名字标签 | `:1375` `.bubn`（other） | 都在气泡**内**。**self 那个 2026-10-28 已删**（见下） |
| 重生成按钮条 | `source/src/app73_features.js:193` post → 挂到 `.m-row` | 必须在气泡**外**（`.m-row > .rg73{flex-basis:100%}`） |

**两条入口的坑（实测，值得单独记）**：只改 `sayHTML` 时，逐字节对拍**一格都不会动** ——
因为原来的 20 种快照里没有 `box+say` 这一种，**真实路径根本没被覆盖**。
补上 `box-say` 之后才有读数（现在 21 种）。

**这 1 处「两层认领」不是冲突，但也不能靠读代码相信它**：写成探针对，
而且**两边都断言** —— 外层答了，内层必须 0 命中（`mustNot`）。
只查一边的话，顺序反了照样绿，而顺序反了正是这一类最容易出的错。

**为什么必须有第二把尺子**（这是今晚最贵的一课）：`app16_story2.js` 的 `post` 层（把行内 `*动作*`
换成 `<em class="ma">`）和 `app18_promo.js` 的贴纸分支，找的都是 `<div class="bub">` —— 而台词气泡在
10-27 白天那次渲染器合并里已经换成了 `<div class="m-box lb"><p class="bac">`。
⇒ **走那条路径的消息上，这两层一直是死的，而逐字节对拍永远是绿的**
（基线是合并之后拍的，它拍不到自己出生前就坏掉的东西）。
说准一点：`.bub` 现在是 **`say` 唯一的壳**（三种说话人共用）—— 不再有 `.m-box.lb` 那句玩家台词，也不再走 `.m-turn`。
按钮还自己产出 `.bub`，所以这两层在少数路径上仍会命中；死的是**主路径**（模型台词 / 玩家台词），
而主路径就是全部日常对话。
`app16` 那层当晚修好（改指向 `.m-box` 的 `p.bac`，`p.bdn`/`p.bth` 不碰），探针从 `silent` 转 `fires`；
`app18` 的两条分支**仍是死的**，在探针里**显式登记为已知死**并写了原因（它换出的 `.stk` / `.bigemo`
两个类整个仓库没有一条 CSS）—— 要不要把它做成样子，是 UI 决定，不是这一轮的事。

**拆开的收益是可数**：`app16` 那处拆成 `#mquick`（post）和 `#kinds`（kind）之后，
「每行右侧的 🔊/🖼/📤 一排正在被删掉」第一次成为一条**读数**（以前它混在认领层的 `hit` 里，
永远看不见）。它一直在干活 —— `app3_chat` 仍照发那一排按钮，删它的是这一层。

**这一轮没有留下未搬的层。** 剩下的两件都不是「搬迁」而是「决定」：
`app18` 的两条分支仍然是死的（`.stk` / `.bigemo` 全仓库没有 CSS，要不要做成样子是 UI 决定），
`app73` 每行都会挂一个空 `payrow`（已知视觉瑕疵，修它会改快照基线，留到单独一刀）。

#### 2026-10-28：玩家自己那两句冗余的字去掉了（Ann 的决定）

同一件事的两处重复，都删：

| 删了什么 | 位置 | 快照读数 |
|---|---|---|
| `self` 气泡顶上的 `<small class="pkmen">名字 · 你</small>` | `app3_chat.js` sayHTML 的 self 分支 | `say` 189 → **138** 字符（−51） |
| `who==="me"` 分支的 `<b>名字</b>` | `app16_story2.js:73` | `me-say` 226 → **206** 字符（−20） |

连带删掉 CSS `.pkme .pkmen{…}`（`shell.html`）—— 它因此**没有任何元素可命中**，留着就是一条死规则。

`render-snapshot` 当时红了 **恰好这 2 处**，没有第三处 —— 这就是「有意改版」与「改坏了」的分界：**红的数量要等于你想改的数量**。
基线已按新形态重写（`tools/render-baseline.json`）。

---
### 7.6 静默失败的三条出口

以前失败只有一条路：`catch(_){}` → 消失。现在分三层：

| 出口 | 收什么 | 怎么看 |
|---|---|---|
| `soft(位置, fn)` | **主动**吞掉的失败（本来是"失败了别打断玩家"的地方） | `__soft()`：哪一处、几次 |
| `ERRLOG` | **没人接**的：`onerror` / 未处理的 Promise / `console.error` | `tools/read-errlog.mjs`（2 分钟窗口，非空即红） |
| `HEALTH` | 四个入口的计数，每 30 秒落盘 | `tools/read-health.mjs`（冲突/失败/非法迁移，非零即红） |

**错误日志有启动心跳**（3 秒后先落一次盘，哪怕零错误）——否则「零错误」和「日志器根本没跑」在磁盘上完全同形。

### 7.7 这一层治什么 / 不治什么

- **治**：改一处坏另一处（包装层互相踩）· 静默失败（空 catch 把硬错误变成无操作）·
  「查不到是谁改的」（存档/章节/回合/指令都有归因读数）· 「谁赢由文件名决定」（改成了表）。
- **不治**：界面**长什么样**。两个渲染器已于当天合并（`docs/message-renderers.md`），但视觉仍由多处 CSS 决定。
  样式与弹层这两条**当天量过、也各做了一半**，各自的判据与「不动的部分为什么不动」在专门文档里：

  | 线 | 做了什么 | 没做什么（写死理由） | 文档 · 尺子 |
  |---|---|---|---|
  | **样式** | 合并 63 条重复规则、删 35 条死规则；2818 → **2691** 条、81 → **17** 个重复 | 剩 4 个重复**故意不合并**（展开简写伤可读性）；11 条死样式留着（有活的兄弟选择器） | `docs/style-entry.md` · `tools/style-inject-census.mjs` |
  | **弹层** | `menuSheet` 8 层里 7 层搬进 `SHEET` 注册表 | `memSheet`/`m2Sheet` 5 层**不该搬**（各吊在 `.memlay`/`.m2tiers`/`.m2s` 等不同锚点）；19 处「绕过入口摸 DOM」**不建原语**（闸看不见其中 crHub/gameHub/gh-gc） | `docs/sheet-entry.md` · `tools/sheet-census.mjs` |

  ⇒ 两条线的形状一样：**能机械收的收掉，收不掉的把「为什么」写在读数旁边** ——
  否则下一个人会把「没动」读成「没看」。**CSS 版的猴补丁已经从 81 降到 17。**

### 7.8 闸的自我检查（这一节是给下一个人的）

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

6. **对拍只证"没变"，证不了"活着"**。上面第 5 条那句「`.bub` 不在渲染路径上」是真话，
   而它同时是一个**功能已经死掉**的读数：两个 `post` 层一直指着 `.bub`，而台词气泡早换成 `.m-box`
   （见 §7.5 补）。逐字节对拍对此一无所知（基线本身是在它们死掉之后拍的）⇒ 于是有了 `tools/msgkind-probe.mjs`：
   它不问「结构变没变」，只问每层**改过东西没有**，并且把「已知死」显式登记成一条会红的断言
   （死层复活 = 红，活层不动 = 红，后处理层动到对照样本 = 红）。三条臂都做过变异。

⇒ 四条固定动作：**写完闸 → 跑一次看绿 → 造一次变异看红 → 确认它在 `check-all` 的输出里看得见**。
   ⚠️ 补一条：**「这个闸能红」与「它量的是功能还是形状」是两件事**，两个都要答。

7. **探针的样例选错了分支，看起来和「层死了」一模一样**。验 `app16` 拆出来的 `#mquick` 时，
   样例给了 `{who:'c', k:'say'}`，而探针线程的 `pk.as` 正好也是 `c`
   ⇒ 它走的是 `app3_chat` 的「你扮演这个人」分支，**那条分支根本不发 `.mquick`**，
   于是「该动而没动」判红。层没死，是样例没走到它面前。
   ⇒ 判红之后的第一问不是「代码坏了没」，而是**「我给的输入，真的会经过那段代码吗」**；
   查法很便宜：把渲染出来的 HTML 打一眼，看那条要删的东西在不在里面。

---

<!-- BEGIN module-index（由 tools/module-index.mjs 生成，别手改） -->

共 **139 个模块**；「是什么」那一列**取自各文件自己的头注释**，不是手写的。
加一个文件、改一句头注释，这张表就该跟着变 —— `tools/module-index.mjs --check` 会红。

| 模块 | 是什么 | 行数 |
|---|---|---|
| `app1_core.js` | repair data saved by older versions so one bad record can never blank a p… | 242 |
| `app2_pages.js` | ONBOARDING（原文只有段落横幅） | 290 |
| `app3_chat.js` | THREADS（原文只有段落横幅） | 1154 |
| `app4_more.js` | CHATS (WhatsApp-style list) | 598 |
| `app5_money.js` | MONEY, MEMORY, DAILY POSTS What people pay for is the story, not "AI": th… | 172 |
| `app6_games.js` | GAME CENTER (BL first) — story games, each one moves the relationship BET… | 133 |
| `app7_rank.js` | WEEKLY CHARACTER BOARD (打榜) — fans push their bias up the chart Everyone … | 48 |
| `app8_i18n.js` | strings for Game Center · calls · fan board · weekly vote board · home ta… | 38 |
| `app9_ads.js` | REWARDED ADS — the third path between paying and waiting Economics (US re… | 37 |
| `app10_story.js` | STORY LINK LAYER — everything feeds the pair's relationship 总纲: the thing… | 196 |
| `app11_memory.js` | MEMORY SPACE — visible, tiered long memory (竞品: “已用 665 / 8K · 解锁 26K 记忆空… | 51 |
| `app12_beats.js` | STORY BEATS — the reply-rhythm pay schedule (see doc: BL 剧情进展线 × 付费节奏) Re… | 49 |
| `app13_rel.js` | RELATIONSHIP ENGINE v1 — multi-dimension state · Watch mode · point-and-c… | 97 |
| `app14_pack.js` | STORY PACKS — chapters, choices, endings, Story Pack purchase, AI turns W… | 599 |
| `app15_home.js` | HOME (vertical short-drama feed) · DISCOVER · STORY PAGE · ONBOARDING PIC… | 202 |
| `app16_story2.js` | STORY v2 — clear intro, merged narration boxes, choices inside the chat, … | 321 |
| `app17_custom.js` | the detail rides along with whichever path the original director uses (no… | 149 |
| `app18_promo.js` | NEW-USER WELCOME · 24h FIRST-PURCHASE 20% OFF · OPENING-LINE VOICE · STIC… | 200 |
| `app19_bgm.js` | BACKGROUND MUSIC in every chat Each story gets a mood from its genre (lat… | 121 |
| `app20_fx_booth.js` | PLOT-DRIVEN WEATHER & MOOD EFFECTS The chat background already gets an am… | 218 |
| `app21_dims.js` | RELATIONSHIP DIMENSIONS, wired to the script A story declares its pairs i… | 103 |
| `app22_fx2.js` | ATMOSPHERE v2 — cinematic effects One canvas, device-pixel-ratio aware, a… | 109 |
| `app23_heir.js` | STORY TOOLKIT v5 (built for "The Heir He Came Back For", usable by any st… | 102 |
| `app24_gl.js` | ATMOSPHERE v3 — GPU shader layer A WebGL canvas over the chat runs real-t… | 168 |
| `app25_dir.js` | director: no more context-free jumps · The 🌙 card is now a "fast-forward… | 53 |
| `app26_turns.js` | who-said-what A speaker's bubble only carries that speaker's own actions … | 40 |
| `app27_choice.js` | your turn, in your words Step 1: pick HOW you answer (an attitude read fr… | 66 |
| `app28_burst.js` | narration arrives as one block A run of narration / actions / inner voice… | 45 |
| `app29_style.js` | writing rules for live AI (male/male stories) + "look back" unlocks | 30 |
| `app30_fx3.js` | FX3 — ice that creeps along the frame + an EMOTION layer ICE ("ice" / "ic… | 286 |
| `app31_score.js` | FILM SCORE (v4) The chat music now works like a film score: 1) Real recor… | 340 |
| `app32_myline.js` | you speak your own lines When you play a character, that character's writ… | 53 |
| `app33_recs.js` | onboarding picks that actually follow your choices Each story's tropes = … | 35 |
| `app34_hints.js` | games give you something to go on Compatibility quiz: every question has … | 29 |
| `app35_pay.js` | things worth paying for Every paid extra is optional, shows a tempting pr… | 50 |
| `app36_live.js` | overlays live in their own layer on #dev so chat re-renders never wipe th… | 39 |
| `app37_hooks.js` | three story hooks ["sys","recall",{who,txt}] — "X unsent a message" · 👀 … | 77 |
| `app38_gift.js` | gifts feel like gifts, and the heat setting matters in written stories | 30 |
| `app39_compact.js` | relationship values live inside the header as one slim strip (tap for det… | 18 |
| `app40_sfx.js` | sound you can hear, effects that match their moment, pictures that come o… | 96 |
| `app41_merge.js` | old builds saved a global "auto" switch — clear it | 32 |
| `app42_decline.js` | declining a call is a moment, not a silent skip ✕ on an incoming call → h… | 39 |
| `app43_couple.js` | couple room you can actually walk into Tap a person in 情侣房: · 30+ turns →… | 22 |
| `app44_studio.js` | 角色工作室: building a character is a conversation, not a form Three panes on … | 283 |
| `app45_rel.js` | relationships that can turn, personas that matter, and a story that leave… | 199 |
| `app46_cp.js` | 后悔药 = jump back to ANY section you've reached (paid) Stories: a checkpoin… | 51 |
| `app47_chapters.js` | 章节目录: jump to any chapter Chapters you've already reached: jump back free | 43 |
| `app48_clean.js` | 沉浸模式: a clean chat screen · Only the latest beats stay on screen; everyth… | 83 |
| `app49_creator.js` | 一句话写一部剧 (Creator) Quick path: one line → story card → 3 quick picks → fre… | 216 |
| `app50_creator2.js` | 创作中心: the full Creator v2.1 (AI guide · templates · story workbench · int… | 162 |
| `app51_import.js` | 上传剧本文件 → 可玩的剧 Upload .md / .txt / .docx (or paste text, or a Creator expo… | 224 |
| `app52_alt.js` | intercept the old handler (window capture runs before document capture) | 40 |
| `app53_import2.js` | 上传剧本：也能读 .pdf 和老的 .doc .pdf → bundled pdf.js (no network; text layer, pag… | 53 |
| `app54_longcat.js` | AI 引擎可切换：Claude（默认）/ LongCat LongCat uses its OpenAI-compatible endpoint:… | 79 |
| `app55_talk.js` | FREE TALK inside a story Before: at a "your turn" stop, typing anything r… | 122 |
| `app56_story3.js` | DYNAMIC NARRATIVE — items, long/short branches, convergence, character ar… | 105 |
| `app57_rules.js` | UGC CONSTRAINTS — the generation rules every AI call follows + the publis… | 76 |
| `app58_bgm100.js` | BGM LIBRARY — 100 scored cues, picked by keywords Honest note: these are … | 157 |
| `app59_fx100.js` | FX + SFX LIBRARY — 100 screen effects, 100 sound effects, keyword-trigger… | 299 |
| `app60_games100.js` | MINI-GAME LIBRARY — 100 games from 15 templates, popped by keywords Templ… | 247 |
| `app61_honor.js` | 《西岭守则》mechanics sample (stand-in until the team’s The Honor Code script is final) for the whole narrative system generated by gen_honor.py（原文只有段落横幅） | 8 |
| `app62_tts.js` | CHARACTER VOICES — server TTS (IndexTTS2 / your own TTS server) with devi… | 66 |
| `app63_fixes.js` | feed fixes 1) Characters post at most ONE moment per day each: the day's … | 22 |
| `app64_entry.js` | ENTRY = "watch a scene, then step into it" + a layered taste system Produ… | 138 |
| `app65_lib.js` | 素材库 — browse & try every game / BGM / FX / SFX The libraries fire by them… | 42 |
| `app66_libup.js` | 素材库 · user uploads Every tab gets "＋ 上传我的": BGM (audio file), 音效 (audio),… | 93 |
| `app67_i18n.js` | ONE LANGUAGE AT A TIME 1) Taste tags: every name exists in all five app l… | 112 |
| `app68_cloud.js` | CLOUD — the front end talks to the MIRU backend (/api on Vercel) Everythi… | 134 |
| `app69_acct.js` | ACCOUNT ENTRY POINTS · Welcome screen: 「已有账号？登录」 under the start button (… | 21 |
| `app70_login.js` | SIGN-IN FIRST New install: language → welcome (18+) → 【登录页】 → taste → hoo… | 319 |
| `app71_narrative.js` | MIRU 互动剧本规则 v1.0 — runtime side The creator side carries the full rule se… | 165 |
| `app72_zhpure.js` | 中文版只显示中文 Audit (every onboarding step, tabs, store, taste sheet, a story)… | 36 |
| `app73_features.js` | 亲密度 · 心声 · 重新生成/编辑 · 指定对象说话 1) Affinity: a 💗 chip in every chat header (… | 289 |
| `app74_experience.js` | 试玩 = 正式版体验 Every story a user creates (AI 一步步引导, 一句话写剧, 故事编辑) is packaged… | 133 |
| `app75_mydock.js` | 只留「渲染之后要做的事」——不能带上 _renderChat75.apply（那是包装层的事） | 50 |
| `app76_official.js` | 后台「剧本生产」上线的 MIRU 官方剧：作品包里是 MIRU 标准剧本（pack.script），在 App 里用导入器转成可玩的剧 同一版本只… | 41 |
| `app77_memory2.js` | 记忆系统 第一阶段 ② 滚动摘要：旧对话滑出窗口前先压缩进「到目前为止」，不再整段丢失 | 186 |
| `app78_memsync.js` | 记忆系统 第二阶段：记忆存进云端数据库 + 按意思召回 登录用户：记忆增删改 3 秒内同步到服务器（/api/state?r=mem）。每次回复前… | 44 |
| `app79_ledger.js` | 记忆系统 第三阶段：剧情账本（程序裁决，模型只读） 一个故事的「正史」统一放在 th.led，由程序维护： · 约定 P#：来自「约定」类记忆（你… | 151 |
| `app80_cache.js` | 文字主力切到 DeepSeek：让提示词能吃到「缓存命中」价 DeepSeek 按前缀自动缓存（命中价约为未命中的 1/50）。原来的回复提示词是… | 33 |
| `app81_voicecall.js` | VOICE CALLS — talk to him out loud (Qwen-Omni via POST /api/tts {omni}) ·… | 93 |
| `app82_qwenimg.js` | AI PICTURES via Qwen (z-image-turbo for new pictures, wan2.5-i2i for "sam… | 19 |
| `app83_vidu.js` | MOVING PICTURES — Vidu image-to-video (POST /api/tts {vid}, poll GET /api… | 36 |
| `app84_nosub.js` | NO MEMBERSHIP — pay-as-you-go diamonds only (owner's decision) · MIRU+ is… | 42 |
| `app85_guide.js` | FIRST-TIME COACH MARKS One short spotlight tour per surface, shown once (… | 49 |
| `app86_voicefix.js` | VOICE FIXES + VOICE BILLING 1) Scripted phone calls (pack "call" stops) w… | 95 |
| `app87_regcode.js` | SIGN-UP EMAIL CODE (Amazon SES) When the server can send mail (/auth?prov… | 37 |
| `app88_memcall.js` | PAID MEMORY + TURN-TAKING STORY CALLS A) Memory is a 💎 purchase per stor… | 64 |
| `app89_offsearch.js` | OFFICIAL STORIES IN SEARCH Stories published from the admin "剧本生产" studio… | 20 |
| `app90_youturn.js` | THE PLAYER SPEAKS FOR THEMSELF Scripts (admin studio or uploads) sometime… | 35 |
| `app91_phone.js` | SIGN IN WITH A PHONE NUMBER (SMS code · AWS End User Messaging) Shown onl… | 45 |
| `app92_media.js` | 媒体库（） 问题：图片以前是 base64 字符串存在**存档对象 S 里**（S.art 每角色一张、S.album 最多 12 张） | 176 |
| `app92_mustlogin.js` | SIGN-IN REQUIRED The live app can no longer be used as a guest: the "先逛逛 … | 14 |
| `app93_agegate.js` | 年龄门（T08）· 首启一次确认 开关：MIRU_TUNE.tools.ageGate（默认 true） | 44 |
| `app93_doubao.js` | DOUBAO END-TO-END REALTIME VOICE CALLS When the relay is configured (Verc… | 97 |
| `app94_official2.js` | OFFICIAL SCRIPTS, FULLY DRESSED Official scripts can carry ⟦…⟧ directives… | 546 |
| `app94_replyguard.js` | 台词守门（他们 v8.2.3 的「角色台词检查」） 玩家最痛的一条是「角色全知」：角色说出了本章他还不该知道的事 | 153 |
| `app95_safety.js` | App Store 1.2 (user-generated content): report · block · terms · contact … | 120 |
| `app95_status.js` | 状态写入层 v1（唯一写入口） 规格 v7.11 §04.6「状态投影的唯一写入点」： 模型和剧情都只能"提议"，真正的写入只在这里发生 | 130 |
| `app96_social.js` | 世界围着你转 — lessons from Status & Heyyyy, all paid with 💎 (no membership) ①… | 341 |
| `app96_tune.js` | 可调参数（外置滑钮） 为什么要它：这些数字原来散在 6 个文件里当字面量（价格、单位、章节数、窗口长度、 关系阶段门槛、每日好感上限、单次好感步长… | 133 |
| `app97_agents.js` | 自由模式（角色智能体）+ 电话开关 自由模式（先在《王不见王》试点）： · 每个角色是一个独立的智能体：自己的角色卡（性格、说话方式、想要什么、秘… | 222 |
| `app97_card.js` | 角色卡 · 每章一份快照（v2） 设计见 CHARACTER-CARD.md。v2 改了一处关键结构：**补丁按角色分开存** | 201 |
| `app98_emotion.js` | 情绪合同（文档 §14.1 T01–T04） 「heat」与「情绪标签」在代码里原本各说各的：heat 是包上的一个字符串（fluff/slow/… | 93 |
| `app98_story.js` | 故事圣经驱动的自由模式（剧情智能体 + 角色智能体） 作品资料 = 故事圣经（art/official/<作品ID>.bible.json）：世界… | 269 |
| `app99_boot.js` | BOOT (keep last) | 20 |
| `app99_plan.js` | 场景计划层（文档 §05 Plot98 的最小可用部分） 文档 01.2 的两条路径里，Slow Path 是「新场景无计划 / 重大变化 / 真… | 112 |
| `app100_dialogue.js` | Dialogue runtime: v7.11 Reply Charter + v7.12 §06.2 soft guidance | 139 |
| `app100_fixes.js` | 体验修复（ 用户反馈 8 条中的 1/3/4/7/8） 1 首页：官方新剧列表本地缓存，进入 App 立刻显示，不再先闪 2–3 秒旧剧单；首次没… | 109 |
| `app101_you.js` | 用户反馈第二轮 1 所有指向玩家的称呼一律显示为「你」：你扮演的角色的名字（全名、名、中文名）在剧情、气泡标签、旁白、地点、介绍里都替换成「你」 | 188 |
| `app102_pipeline.js` | 对话流：一道缝（ · 设计见 DIALOGUE-PIPELINE.md） Ann：「应该把这些统一起来，做成接口，现在到处乱改乱错，就是这个原因吧… | 130 |
| `app103_turn.js` | 回合状态机 v0.1（ · Ann 定的第二件事） Ann：「这是解耦之后应该做的第二件事，统一接口之类的，没有这个谈不上代码质量。」 ## 病 … | 90 |
| `app104_pkstate.js` | 章节状态机 v0.1（ · 第三件） Ann：「继续做吧，副作用都能修，但增强稳健性、做软件工程上的升级是最重要的事。」 ## 病 `th.pk.… | 71 |
| `app105_save.js` | 存档变更观测 v0.1（ · 第五件） Ann：「继续做吧，副作用都能修，但增强稳健性、做软件工程上的升级是最重要的事。」 ## 病 `save(… | 99 |
| `app106_ui.js` | 渲染入口 v0.1（ · 第七件） Ann：「UI 先不动了。UI 出问题，纯粹也是因为我们没有做整合、没有做工程优化、没有做入口。」 对，而且有… | 104 |
| `app107_health.js` | 运行时健康汇报 v0.1（） 来源：Mythica `CLAUDE.md` 编码习惯第 13 条 —— 「唯一咽喉配三件套：**硬门禁** + *… | 58 |
| `app108_errlog.js` | 错误日志 v0.1（） Ann：「把 error log 做上，加上 2m 淘汰。」 在此之前我们只有两样东西： · `soft()` —— **… | 117 |
| `app109_pkdirect.js` | 剧本指令分发：把「谁赢」写出来（） Ann 拍板：「可以把这俩分清楚，现在用的都是 b」 | 85 |
| `app110_pkreg.js` | 剧本指令：26 层包装 → 一张表（） Ann：「我感觉没有太多问题，你动吧」 | 68 |
| `app111_msgkind.js` | 消息渲染：三类登记 + 冲突检测 + 存活读数（） 背景：`msgHTML` 被 **19 层**包装（`tools/msghtml-triage… | 133 |
| `app112_sheet.js` | 弹层里的「块」登记表（） 为什么不再用「包一层」：`menuSheet` 被 7 个文件各包一层，而它们做的事只有一件 —— 往 `.sheet … | 76 |
| `app113_content.js` | 剧本内容：一道加载缝（第 1 步：立接口 + 哨兵） · 为什么需要它（Ann 问的「解耦充分吗」）： 现状：剧情数据（`wd(wid).pack… | 77 |
| `app114_entry.js` | 进去的身份，永远是三条（） 症状（Ann 报的）：「好像现在进去只有导演视角，别的视角没了」 | 192 |
| `content_36.js` | STORY PACKS (generated by gen_content.py — do not edit by hand) Each stor… | 31 |
| `content_chars.js` | CHARACTERS Every lead is 21+ | 320 |
| `content_extra.js` | SHORTS (60-second vertical episodes) | 153 |
| `content_worlds.js` | WORLDS or: bl \| gl \| bg kind: story \| ensemble \| quest Openings are writt… | 215 |
| `creator_embed.js` | creator polish: accessibility, graph editing, playable surfaces | 2 |
| `i18n.js` | UI STRINGS — en · zh · ja · ko · es | 274 |
| `miru_rules_full.js` | （文件头没有说明 —— 该补一句） | 3 |
| `miru_rules.js` | MIRU 互动剧本结构与生成规则｜终版 — single source of truth Used by: the app's creator (… | 286 |
| `pdfjs_embed.js` | \n * @licstart The following is the entire license notice for the\n * JavaScript code in this page\n *\n * Copyright 2023 Mozilla Foundation\n *\n * Licensed under the Apache License, Version 2.0 (the \"License\");\n * you may not use this file except in compliance with the License.\n * You may obtain a copy of the License at\n *\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Unless required by applicable law or agreed to in writing, software\n * distributed under the License is distributed on an \"AS IS\" BASIS,\n * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.\n * See the License for the specific language governing permissions and\n * limitations under the License.\n *\n * @licend The above is the entire license notice for the\n * JavaScript code in this page\n（原文只有段落横幅） | 3 |
| `shorts_v2.js` | DRAMAS v2 — rewritten for tension (hook → escalation → reversal → freeze … | 13 |
| `shorts_v3.js` | DRAMAS v3 — the 9 Veo-shot pilots: one beat per 8-second clip (the subtit… | 22 |
| `studio_lib.js` | （文件头没有说明 —— 该补一句） | 2 |
| `tr_es.js` | （文件头没有说明 —— 该补一句） | 81 |
| `tr_ja.js` | （文件头没有说明 —— 该补一句） | 81 |
| `tr_ko.js` | （文件头没有说明 —— 该补一句） | 81 |
| `tr_merge.js` | CONTENT TRANSLATIONS (ja · ko · es) Each language pack mirrors the Englis… | 23 |

<!-- END module-index -->
