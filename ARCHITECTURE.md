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
| 语音·固定台词 | **本地预生成** | `audio/en.json` / `zh.json`：361 条 `说话人\|台词 → base64 mp3`；`app62_tts.js:2` **第一优先就查它** | 否 | 落到第 2 级（服务器合成） |
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

### 链 D · 语音（三级回退，**已经是「本地优先」的样板**）
```
台词 → 1) 剧本包里预录的音频（audio/*.json：speaker|text → base64）
     → 2) /api/tts 合成（api/tts.js：DASHSCOPE / INWORLD / 自建 TTS_URL，哪个配了用哪个）
     → 3) 设备语音
```
- 判据：`app62_tts.js:11` `ttsOn()`——`S.ttsMode==="device"` 或服务端失败过 ⇒ 关掉第 2 级。
- 也就是说：**「固定台词预生成」这条你们已经在跑**，只是还没覆盖全部台词。

### 链 E · 状态
```
app78_memsync.js:2 ─→ /api/state ─→ Postgres（memories / threads / wallet）
```
- 剧本正文可以版本化、可回滚；**玩家状态不行**——它是唯一真相，只能一份。

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
- **这句语音是预录还是合成**：`app62_tts.js` 第 2 级的 `TTS.mem` / `TTS.fails`；`fails > 0` 说明合成失败过。
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
