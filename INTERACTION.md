# 交互流程：从她按下发送，到听见声音

> **这份写「现在实际怎么跑」**（as-built），逐段带 `文件 · 函数` 锚点与判据。
> 想看「当初想收成什么样、为什么」→ `DIALOGUE-PIPELINE.md`（那是当时的迁移方案 + 补节，**设计意图**，不是现状）。
> 想看「哪一格在哪个文件」的全局地图 → `ARCHITECTURE.md`。
>
> 约定：**锚点用「文件 + 函数名 + 一小段字面内容」，不写行号** —— 行号在别人手里 20 分钟就能烂掉一半。

---

## 0. 一页图

```
  她打字 / 点一个选项
        │
        ▼
  appendMsg ────────────────► th.msgs.push ──► save()            ← §2 落库
        │                                        │
        │                                        ▼
        │                                  renderChat()          ← 全部上屏都过这一道
        │                                   ├ sanitizeMsgs(th)   ← 唯一文本闸
        │                                   └ sayHTML() per 条   ← 一个气泡 = 一条 say
        ▼
  （对话模式）prompt=[…23 块…] ──► ask(prompt) ──► JSON beats    ← §3 §4
        │                                            │
        │                                            ▼
        │                                        playBeats()      ← §5 §6
        │                                         ├ 过滤（谁能说话）
        │                                         ├ 逐句上屏 + 节奏
        │                                         └ 逐句发声 speak() → VOICE 五层 → speakQueue
        ▼
  （剧本模式）packOpen / packRun ──► pk.q 队列 ──► appendMsg / playBeats   ← §8
        │
        ▼
  TURN / PKST / SAVE 三个唯一写点（§9）→ 存档 → 下次 openThread 续上
```

**一句话**：**上屏只有一个出口（`renderChat`）、发声只有一个入口（`speak`）、状态只有三个写点（`TURN`/`PKST`/`SAVE`）**。任何绕过这三处的改动，都是下一轮 bug 的来源。

---

## 1. 三种说话人，一个气泡（2026-10-27 收口）

| 谁 | 判定 | 渲染 |
|---|---|---|
| **别人说**（角色） | `speakerOf(m,th)` → `other` | `.bub` + 气泡内 `.bubn` 名字行 |
| **你扮演的那个说**（self） | `m.pk && m.who===th.pk.as && ch(m.who)` | `.m-row.me.pkme` + `.bub`，**气泡内不再有名字标签**（2026-10-28 删） |
| **旁白** | `who === "n"` | `.m-narr`（走 `sayHTML` 之前的旁白分流） |
| **玩家自己打的** | `who === "me"` | `.m-row.me` + `.bub`，**无名字**（2026-10-28 删掉 `<b>` 包裹） |

**接口位置表**（每个格子的真身在哪个文件/函数）在 `ARCHITECTURE.md` 的「say 的接口位置」一节，那是逐项实测的，别在这里再抄一份。

**不变量**：三条入口（`k:"say"`、`k:"box"`+`m.say`、旁白）**只有一处决定长什么样** = `sayHTML`。
判据：`tools/render-snapshot.mjs --check`（21 种消息逐字节）+ `tools/msgkind-probe.mjs`（18 层在册 / 28 条探针 / 0 已知死）。

---

## 2. 输入 → 落库

- **`appendMsg(th, m)`**（`app3_chat.js`）是正门：分配 `at`、push、必要时 `save()`。**`app11_memory.js` 在它外面又包了一层**。
- **但有 30 处直接 `th.msgs.push(...)` 绕过了它**（`app12_beats` 6 · `app3_chat` 5 · `app45_rel` 4 · `app14_pack` 3 …）。这些绕过者**也绕过文本净化** —— 卡片标题、`sideLine` 就走这条路。
- ⇒ **补救不在调用点，而在渲染时**：`renderChat()` **第一行**就是
  ```js
  function renderChat(){sanitizeMsgs(S&&S.threads?S.threads[curT]:null);
  ```
  `sanitizeMsgs` 把任何非字符串的 `txt/title/sideLine` 取成人话。**以后新增的写入者也自动被覆盖。**
  判据：`tools/sanitize-selftest.mjs`（含「认不出的对象必须清空，不能渲染成 1」）。

**为什么不在 30 处逐个改**：其中一半是 `app14_pack` 的**瞬时播种**（一次 push 一批），改成 `appendMsg` 会变成逐条动画 = **改行为**。

---

## 3. prompt 装配：块清单，谁往里放东西

`app3_chat.js` 的 `const prompt=[ … ].filter(Boolean).join("\n")`。**顺序就是语义**（近因效应 + 缓存前缀），改顺序要当成接口改动。

| # | 块 | 谁在写 | 备注 |
|---|---|---|---|
| 1 | 角色设定（"You write MIRU…"） | 硬编码 | 成人向声明在这里 |
| 2–4 | `STORY` / `THE USER'S ROLE` / `WHAT'S AT STAKE` | `Lz(w.*)` | 没 `w` 时退化成 `SCENE` / `th.you` |
| 5 | `STATUS` | `th.status.time/place` | 由剧本或模型回写 |
| 6 | **`CAST (only these ids may speak)`** | `speakersOf(th)` → `castCardFace` | **AI 能说话的名单就在这一块**，见下 |
| 7 | `SCENE DIRECTION` | `th.pk.q` 前 2 条（**`splice` 取走**） | 只给「谁 + 性质」，**不给原文**；写原文会被照念 |
| 8 | `packPrompt(th)` | `app14_pack.js` | 剧本自带的方向 |
| 9 | `THE USER` | `th.persona` | `pk.as==="side"` 时整块消失 |
| 10 | `memBlock(th)` | 记忆层 | |
| 11 | `QUEST GOALS` | `th.quest.goals` | |
| 12 | `STORY SO FAR` | `transcript(th)` | **窗口**（`MIRU_TUNE.chat.transcript`），不是全文 |
| 13 | `THE PLAYER TYPED THESE THEMSELVES` | `th.typed` | 手打的，权重被明说「高于其余」 |
| 14 | `THE PLAYER'S OWN WORDS` | `th.said` | 逐字，含更早的 |
| 15 | `NOW: <inst>` | `CTX[ctx.kind]` 模板 + `{u}/{x}/{c}` 替换 | 这一轮到底要它干什么 |
| 16 | **`HEAT CEILING — <档>`** | `dialogueHeat(th)` → `HEAT_RULE[...]` | 见 §10 的不变量 |
| 17 | `DIALOGUE_REPLY_CHARTER` | `app100_dialogue.js` | 9 条，优先级在块内第一条 |
| 18–20 | `HOW TO WRITE` | 硬编码 | 三条：接原话 / 说的与想的不一致 / 一个具体感官细节 |
| 21–24 | `PERSON`（人称硬契约） | 硬编码 | 三条：角色第一人称 · 旁白第三人称且不写「我」 · 用户永远是「you」且不替他行动 |
| 25–27 | 角色差异 / 语体 / 收尾 | 硬编码 | |
| 28 | `LANGUAGE` | `LANG_NAME[S.lang]` | |
| 29–30 | JSON 格式 + beats 数量与长度 | 硬编码 | `deep` 档 5–9 条 / 每条 <45 词 |

### 3·1 那条最容易看错的：`CAST` 就是「谁有资格说话」

```js
function speakersOf(th){return th.cast.filter(c=>!(th.pk&&c===th.pk.as))}
```

**你扮演的那个角色被按设计排除在外。** 后果（2026-10-29 实测）：

- 模型即使写了 `who = 你扮演的角色`，也会在 `playBeats` **第一行就被过滤掉**，**上不了屏**。
- 所以「我演的角色说话」只可能来自**剧本数据**，不可能来自 AI。
- 同理，任何「让 AI 替我演的角色说话」的设计**在这条定义下做不到** —— 要做得先改 `speakersOf`，那是一个**产品决定**，不是实现细节。

---

## 4. 模型调用与兜底

| | |
|---|---|
| 入口 | `ask(prompt, opts)`（`app1_core.js`），被 `app45_rel.js` 再包一层（注入关系/人设段） |
| 档位 | `S.tier==="deep"` ⇒ `modelTier:"complex"`，否则 `"default"` |
| 流式预览 | `MIRU_TUNE.chat.streamPreview` ⇒ `onText=streamPreview`（首字 ~2s，整段 ~9.5s，见 `LATENCY.md`） |
| 失败 | `LLMERR` + `track("llm_fail")`；随后走 **`fallback(th,ctx)`**（`app55_talk.js` 包了一层：按 `talkIntent` 选兜底台词） |
| 台词守门 | `guardReply`（`app94_replyguard.js`）：说了本章不该知道的事 ⇒ 带约束重写一次 |

**语音意图的事实**（2026-10-28 实测）：`talkIntent`（`app55_talk.js`）能识别 `flirt`，并用于兜底台词 / 记忆与维度增减 / 候选句 —— **但这个意图从来没有进过 prompt**。给她加进 prompt 试过，n=3 测不出效果，已撤回。见 `ARCHITECTURE.md` 5·补二。

---

## 5. beats → 屏幕

```js
async function playBeats(th,r,ctx,silent){
  const valid=new Set(speakersOf(th).concat(["n"]));
  const beats=r.beats.filter(b=>b&&b.text&&valid.has(b.who)).slice(0,10);
```

- **两个约束**：`who` 必须在 `valid` 里（§3·1），**最多 10 条**。
- 之后：预取前 4 句 TTS → 逐句 `appendMsg` → 逐句发声 → 出候选句 → 更新维度。
- **一句一条 = 一个气泡 = 一次发声**（结构保证，不靠对齐）。

---

## 6. 节奏：谁决定每句停多久

| 谁 | 在哪 | 管什么 |
|---|---|---|
| `D.pace(line)` | `app102_pipeline.js` | **纯函数**：`readMs*0.75 + linePause`。**故意不看 `canSpeak`** |
| `readMs(m)` | `app14_pack.js` | 念一句要多久：CJK ≈ 7 字/秒、拉丁 ≈ 20 字/秒，夹在 1.7–7 秒 |
| `pkWait` / `AVSILENT` / `AVSKIP` | `app16_story2.js` | 剧本模式的等待与「连 2 句没声音就跳」 |
| **`D.line(th,msg,opt)`** | `app102_pipeline.js` | **一整句的驱动者**：出现 → 发声（say 台词）→ 收尾节奏；发声前给消息打 `_voiced=1`，免得 `appendMsg` 的兜底再念一遍 |
| `playBeats` 的串行 | `app3_chat.js` | 对话模式：**亮一句 → 念完 → 亮下一句**（每句交给 `D.line`） |

**不变量**：**节奏不依赖声音**。关掉朗读、TTS 挂了、额度用完，屏幕节奏必须一模一样。
判据：关语音与开语音各跑一章，**每句间隔中位数差 < 10%**（`tools/perf-cdp.mjs`）。

---

## 7. 声音：`VOICE` 注册表 + 看门狗

### 7·1 一条链，五层，按注册顺序倒着执行

```js
VOICE.use('bgm-19',      (next,text,id,onend)=>{ … })   // app19_bgm.js   压低 BGM，念完恢复
VOICE.use('rel-45',      (next,text,id,onend)=>{ … })   // app45_rel.js   旁白音色 off/soft/film/noir
VOICE.use('tts-62',      (next,text,id,onend)=>{ … })   // app62_tts.js   服务端 TTS（含 stopVoice / 预取）
VOICE.use('voicefix-86', (next,text,id,onend)=>{ … })   // app86_voicefix.js  共享元素播放 + 兜底
VOICE.use('memcall-88',  (next,text,id,onend)=>{ … })   // app88_memcall.js   通话中拦截
```

- `next(...)` = **原来那层的 `_speakNN`**；不调它就等于「这条我自己处理掉了」。
- `VOICE.below('tts-62')` = 该层注册之前的那条链 —— **app86 靠它保持「跳过 app62」的原语义**。
- `speak(text,id,onend)` 只剩一行：`return VOICE.run(...)`；函数体叫 `baseSpeak`。
- **加第 6 层就一行 `VOICE.use`**。不要再写 `const _speakNN=speak`（那样漏传 `onend` 会让队列静默停住）。

### 7·2 **两本日志，答两个不同的问题**（别混）

| 日志 | 谁写 | 存哪 | 答什么问题 |
|---|---|---|---|
| `S._voiceLog` | `app102_pipeline.js` 的 `D.say` / `D.line` | 线程状态（跟着存档走，最多 60 条） | **这一句为什么没响**（`{ok,why}` 的流水） |
| `VOICE_LOG` | `speakQueue` 的看门狗 | `window.__voiceLog`（32 条环形，不进存档） | **队列为什么停住**（谁在什么时候、用了多久、`why=ended/timeout/throw`） |

**「没声音」先看第一本，「卡住不动」先看第二本。** 两者同形不同因 —— 这是 2026-10-27 那次排查最贵的一课。

### 7·2·补 `speakQueue` 的看门狗

```js
function speakQueue(list){VOICE_BUSY++;let i=0;
  const next=()=>{ … const wd=setTimeout(()=>go("timeout"),VOICE_TIMEOUT_MS); … }
```

- `VOICE_TIMEOUT_MS = 8000`，**故意高于** TTS 兜底的 4 秒 —— 只在真卡住时开火。
- 环形日志 `VOICE_LOG`（32 条，挂 `window.__voiceLog`）：`{who, txt 前 16 字, ms, why}`，`why ∈ ended/timeout/throw`。
  **在这之前，「播完/报错/超时/被取消」四种死法在屏幕上完全同形。**

### 7·3 语音的尺子

```powershell
node tools/serve.mjs 8131
node tools/voice-probe.mjs --json > 新读数.json      # 对拍 tools/voice-baseline.json
```

| 臂 | 喂什么 | 正常读数 |
|---|---|---|
| `ok` | 真 WAV（≈600ms） | ≈690–970ms，通道 `tts-fetch` |
| `corrupt` | 解不出的字节 | ≈600ms 且**设备语音 3 次** |
| `hang` | 永不返回的 fetch | 4600ms/条，**3/3 排空** |

---

## 8. 剧本队列（不是 AI 的那条路）

| 装置 | 在哪 | 干什么 |
|---|---|---|
| `packOpen(th,n,instant)` | `app14_pack.js` | 开一章：写 `status`、推章节卡、把 `c.beats` 入队 `th.pk.q` |
| `packRun(th)` | `app14_pack.js` | 逐条播 `th.pk.q`，遇 stop 停下等玩家 |
| `PKPAUSE[th.id]` | `app14_pack.js` | **玩家一开口，剧本队列先停**（她说话时他得先接住） |
| `isStop(b)` / `STOPK` | `app14_pack.js` | `line/gift/photo/video/game/call/voice/start` 八种停点 |
| `live()` | `packRun` 内 | `curT===th.id && #s-chat 可见` ⇒ **她没在看，就别往下演**（回来自动继续） |

### 8·1 进新剧「谁先开口」（2026-10-29）

`packOpen` 在 `packBeats(c.beats)` 之后、入队之前有一刀：玩家用某个角色进剧时（`pk.as` 不是 `watch`/`side`），若**第一个开口的是 `pk.as`**，把**领先那段连续台词整段**挪到「第一个别人开口」之后；旁白留原位。

- **只挪一句不够**：`crimson` 是 `旁白, adrian, adrian`，挪一句仍以自己开头（第一版就这么错，37 部里剩 6 部）。
- **段里混着 stop 就一律不挪** —— 那会改变玩家被邀请发言的时机。
- 判据（数据层可复跑）：21 部全变成别人先开口 · 本来对的 12 部一字未动 · **字句零改动**。

---

## 9. 状态：三个唯一写点

| 装置 | 文件 | 治什么 | 读它 |
|---|---|---|---|
| `TURN` | `app103_turn.js` | 「有没有回合在跑」——`busy` 不再是四处各自解释的 boolean | `__turn()`：持有者 · 已持 ms · **冲突次数** |
| `PKST` | `app104_pkstate.js` | `th.pk.st` 四值、10 个写点 | `__pkst()`：各状态 · 每条纹路 · **非法迁移明细** |
| `SAVE` | `app105_save.js` | `save()` 397 个调用点，谁也不说自己在改什么 | `__save()`：次数 / 最慢 / **最烧调用点（文件:行）** |

**加载顺序是硬约束**：状态机模块必须出现在**绑定它的那一行之前**。
踩过：`app103` 排在构建最后 ⇒ `bind` 时对象还不存在 ⇒ **静默跳过** ⇒ 模块整个失效，而「产物里有没有这串字」的检查照样全绿。
判据：`tools/wiring-order-check.mjs`。

---

## 10. 不变量（每条都要有一条能红的东西）

| # | 不变量 | 谁在守 |
|---|---|---|
| 1 | **声音不阻塞对话** | `D.say()` 永不 reject，返回 `{ok,why}`；`speakQueue` 看门狗 |
| 2 | **节奏不依赖声音** | `D.pace` 不看 `canSpeak`；判据是「开/关语音每句间隔中位差 < 10%」 |
| 3 | **失败必须带原因** | `D.say` 的 `why`；`__voiceLog`；`__turn()` 冲突数 |
| 4 | **一个气泡 = 一条 say = 一次发声** | 结构上：`sayHTML` 是唯一出口；`render-snapshot` 21 种逐字节 |
| 5 | **上屏前必过文本闸** | `renderChat()` 第一行 `sanitizeMsgs`；`sanitize-selftest` |
| 6 | **AI 只能让 `speakersOf` 里的人说话** | `playBeats` 的 `valid` 过滤；`speak()` 名字名单同源 |
| 7 | **档位不超过剧本与设置的下限** | `dialogueHeat` = `min(S.heat, pack.heat)`，年龄门再降一档 |
| 8 | **状态只有一个写点** | `TURN`/`PKST`/`SAVE` + 三条 check |
| 9 | **她没在看就不往下演** | `packRun` 的 `live()`；`PKPAUSE` |
| 10 | **闸必须能红** | 每套闸自带 selftest 或变异臂；`tools/check-all.mjs` 48 套 |

⚠️ 第 10 条最容易自欺：**「产物里有这串字」不是「它绑上了」**（`wiring-order` 那次就是这样全绿的）。

---

## 11. 出事时先看哪里

| 症状 | 先看 |
|---|---|
| **没声音** | `S._voiceLog`（`D.say` 的 `{ok,why}` 流水）→ 再看 `avSilent()` 三项 · `TTS.fails` |
| **卡住不动** | `__turn()`（谁持有、多久、冲突几次）· `PKPLAY`/`PKPAUSE` · `live()`（是不是她不在聊天屏） |
| **话说个没完 / 复读** | `STORY SO FAR` 的窗口（`MIRU_TUNE.chat.transcript`） |
| **说了不该知道的** | `guardReply` 的禁区词：`marksForbidden` + `cardForbidden` |
| **渲染坏了** | `render-snapshot` 的差异条数**必须等于**你想改的条数 |
| **档位不对** | `dialogueHeat(th)` 的 `min(S.heat, pack.heat)` + 年龄门 |
| **谁包了谁** | `node tools/patch-registry.mjs`（按加载顺序） · `node tools/line2file.mjs <index.html 行号>` |

---

## 12. 未验 / 缺口（未量 ≠ 零）

1. **`beat-order-probe --mode=open` 拿不到聊天屏**（无头 Edge 卡在登录门，`#msgs` 空）⇒ §8·1 那一刀只有**数据层**读数，没有真页面渲染顺序的读数。
2. **`D.post` 不存在**（`DIALOGUE-PIPELINE.md` 正文的设计），真正起作用的是渲染时的 `sanitizeMsgs`。命名不改。
3. **`busy` 只做到「写点唯一」**，读点还没全改读 `TURN.state()`。
4. **pipeline 三层里 `D.line` 的边界**没有单独闸，靠 `render-snapshot` 间接覆盖。
5. **prompt 的 23 个块没有「谁改了什么」的账**：哪一块是被哪个文件注入的，只有这份表；**表本身靠人维护**（`doc-freshness` 只能保证改动带了 `ARCHITECTURE.md`，保证不了这张表是对的）。
