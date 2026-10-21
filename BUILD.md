# 构建（BUILD）

> **一条命令**：`python source/build.py`（Windows）· `python3 source/build.py` 或 `bash source/build.sh`（macOS / Linux）
> **产物**：仓库根的 `index.html` + `miru_rules.js` + `api/_rules.js`（这三个就是线上跑的东西）

---

## 0. 前置

- **Python 3.8+**。不需要 Node、不需要 `pnpm`、不需要联网。
- **整份仓库**：`art/` 与 `source/content/out/` 都必须在那。少 `content/out/` 构建会报错停下来（好事）；少 `art/` 里的立绘，构建**照样成功**但角色立绘全丢（见 §5.1）。
- **Windows 上没有 `python3`**：那个名字是 Microsoft Store 的占位符，调用返回退出码 9009。现在 `build.py` 用 `sys.executable` 调子步骤，所以 `python` / `python3` 都行。**别装 python3 别名，用 `python`。**

## 1. 三步

```bash
# 1) 构建（在仓库任意位置都能跑，脚本自己 chdir 到 source/）
python source/build.py

# 2) 本地预览（后端接口在本地是死的，见 §8）
python -m http.server 8080
#    打开 http://localhost:8080/index.html

# 3) 上线：把源码和新构建的 index.html 一起提交，推 main
git add -A && git commit -m "..." && git push origin main
```

`main` 一合并就上线（Vercel 自动部署，同时 GitHub Pages 也服务这个仓库）。

## 2. `build.py` 做了什么（五步流水线）

| # | 步骤 | 输入 | 输出 |
|---|---|---|---|
| 1 | 内容编译 `gen_content.py` | `source/content/out/s01..37.json`（37 部剧）+ `content/deep/`（章节改写）+ `art/<角色>.jpg`（有立绘才算） | `source/src/content_36.js`（37 部剧 / 69 个角色） |
| 2 | 规则单源 | `source/src/rules_final.md` + `rules_skill_v1.md` + `miru_rules.js` | `src/miru_rules_full.js`，并直接写两份根级副本：`miru_rules.js`（页面读）· `api/_rules.js`（后端读） |
| 3 | 拼接 | `source/src/` 里 111 个 parts（顺序写死在 `build.py` 的 `parts` 列表） | `source/all.js`（调试用，可删）+ 页面内联脚本 |
| 4 | 资产清单 | `../art/scenes/**`（47）· `../art/bgm/**`（当前空）· `../art/cut/*.webp`（22） | 页面顶部的 `window.SCENE_FILES` / `BGM_FILES` / `CUT_FILES` |
| 5 | 外壳 | `source/src/shell.html`（1492 行：head + CSS）+ 内联脚本 | **`index.html`** |

**顺序就是语义**：`parts` 里的顺序是执行顺序，`app99_boot.js` 必须在最后（它做 `if(S.ob)startApp(); else renderOB();`）。新加模块 = 加文件 + 在 `parts` 里放到正确位置。

## 3. 怎么判「这次构建是对的」（判据，不是感觉）

**判据：构建完，产物与已提交的 blob 完全一致。**

```bash
git hash-object index.html                     # 例：dd56652685af34f87cc72bbf34292f6a978a82a7
git rev-parse HEAD:index.html                  # 必须完全相同
git hash-object source/src/content_36.js       # 2b5c696b8dc4180588bd34a1f6a80d6fa7b2ca33
git rev-parse HEAD:source/src/content_36.js    # 必须完全相同
```

**为什么不用文件 md5 / 字节数**：本仓库 `core.autocrlf=true`，检出到 Windows 时行尾会被换成 CRLF（实测差 14,099 字节 = 行数），所以**磁盘上的字节必然对不上**，而 git 归一化之后的 blob 必须一致。2026-10-22 在本机实测：两个 blob 都与 `HEAD` 逐字节相同。

**为什么这个判据重要**：它把「构建」从手感变成可验证的动作。任何一次改动之后跑一遍这两行，就知道你交付的是不是你以为的那份。

## 4. 两种产物形态

| 形态 | 命令 | 产物 | 特点 |
|---|---|---|---|
| **单文件**（默认，现在线上就是它） | `python source/build.py` | `index.html` **10,834,612 B** | 一个请求拿到全部；改一个字的剧本也要重写 10 MB 的网页 |
| **拆内容** | `python source/build.py --split` | `index.split.html` **4,263,544 B** + `content_36.js` **6,571,124 B** | 37 部剧本从 bundle 里出来，成为**独立文件**；改内容不动应用代码，浏览器也分开缓存 |

`--split` 只是把 `content_36.js` 从内联改成独立 `<script src>`（在 parts 顺序里它排第 8 位，所以切成「前 7 个 → 外链 → 其余」）。两种形态在本机 headless 浏览器里实测**启动状态完全一致**：`PACK_W` / `PACK_C` / `W.length = 38` / 登录门（`S.ob = 0`）/ 首屏 246 字符，两版读数一模一样。**它还没有成为默认**——要不要切，你说了算。

## 5. 「构建成功但东西是错的」的五种情形（都真实发生过）

1. **立绘静默丢失**：旧版 `has_art()` 找的是 `source/art/<id>.jpg`，靠 `build.sh` 建的符号链接 `ln -sfn ../art art` 才存在。跳过 `build.sh` 直接跑 `build.py` ⇒ 69 个角色的 `_art` 全部变成 `null`，**构建 exit 0、日志照常打印**，线上就是全部没立绘。→ 现在 `gen_content.py` 直接找仓库根的 `../art`，不再依赖链接。
2. **构建机路径进产物**：`SCENE_FILES` 的值曾被写成构建机的绝对路径（`C:\dev\miru\art\...`），而页面拿这些值当 URL 用 ⇒ 线上 `url(C:\dev\...)` 加载不出来。→ 现在一律写成仓库相对 URL `art/scenes/<a>/<b>.jpg`，**换机器构建也得到同一个字节**。
3. **Windows 默认 GBK**：`open()` / `json.load(open(...))` 不带 `encoding` 时按 OEM 码页解码 ⇒ `UnicodeDecodeError: 'gbk' codec can't decode byte 0xa2`；写也同理（写出来的中文会变乱码）。→ 现在所有读写显式 `encoding="utf8"`，写入统一 `newline="\n"`。
4. **`python3` 不存在**（Windows）⇒ `subprocess.CalledProcessError: ... exit status 9009`。→ 现在用 `sys.executable`。
5. **少了 `content/out/*.json`**：`gen_content.py` 第一行就 `assert len(packs) == 37`，会明确报错。这是**唯一**会让构建「响亮地失败」的缺件——其余缺件都是静默的。

## 6. 改哪儿 → 跑什么

| 你想改 | 改这里 | 然后 |
|---|---|---|
| 页面结构 / CSS | `source/src/shell.html` | 构建 |
| 某个功能模块 | `source/src/appNN_*.js` | 构建 |
| 新加一个模块 | 新建 `source/src/*.js` + 在 `build.py` 的 `parts` 里插到正确位置 | 构建 |
| 内置剧本内容 | `source/content/out/sNN.json`（+ `content/deep/` 章节改写） | 构建 |
| 生成规则（AI 用的那份） | `source/src/rules_final.md`（+ `rules_skill_v1.md`） | 构建（三处副本自动同步） |
| 后端接口 | `api/*.js` | 不用构建，push 即部署 |
| 管理后台 | `admin.html` | 不用构建 |
| 图片 / 音乐 / 视频 | `art/`、`audio/`、`video/` | 不用构建（静态文件）；但 `art/` 新增会让 §2 第 4 步的清单变大 |
| 官方剧剧本 | **不在仓库**，在数据库：管理后台「剧本生产」 | 见 §7 |

## 7. 内容从哪来：两条路，别混

| | A · 内置 37 部 | B · 官方剧（DSL） |
|---|---|---|
| 数据形状 | 结构化 JSON pack（`content/out/sNN.json`） | **MIRU 标准剧本**（DSL 文本，`⟦…⟧` 指令） |
| 存在哪 | 编译进 `index.html`（`PACK_W`/`PACK_C`） | 数据库，`/api/works?id=…&play=1` 返回 `pack.script` |
| 改一部剧要做什么 | 改 JSON → **重建 → 提交 10 MB 的 HTML** | 后台改剧本 → 上线；**不用重建** |
| 谁来解析 | 构建期 `gen_content.py` | 运行时 `imParse` / `imBuild`（`app76_official.js`、`app94_official2.js`） |
| 缺图片会怎样 | 构建期没有 `<id>.jpg` 就当没有立绘 | 运行时 `art/official/<work>.json` 里没有的槽位**直接跳过**，剧本不用重发 |

⇒ **本地生成剧本、网站只做展示，走的应该是 B**（见 `DECOUPLING.md`；每一格该放本地还是线上，见 `ARCHITECTURE.md`）。A 是「内置商品」，不需要热更。

## 8. 已知限制

- **后端只在 Vercel 上**：本地 `http.server` 打开的是纯前端。登录、钱包、作品、TTS、翻译、管理后台都会失败（`/api/*` 404）。要看真实行为得连部署环境。
- **仓库是公开的**：任何 key 都不能进仓库。⚠️ `source/mk_local.py` 里有一行**明文 LongCat key**（那是「生成一个本地 demo 文件」的一次性脚本），它已经随公开仓库出去了 ⇒ **去 LongCat 后台把它吊销/轮换**，脚本改成读环境变量或直接删掉。
- **`source/all.js`** 是拼接后的调试产物，可以随时删，不要提交。
- `audio/`、`video/`（约 72 MB）是静态素材，构建不碰它们。

---

## 附：本机环境实测（2026-10-22）

| 项 | 读数 |
|---|---|
| Python | 3.12.3（`python`；`python3` 退出码 9009） |
| 构建耗时 | 约 10 秒（`gen_content.py` 读 4.8 MB JSON + 3.3 MB deep） |
| `index.html` | 10,834,612 B · 8,990,517 字符 · 14,099 行 |
| `content_36.js` | 5,041,064 字符 / 6,571,124 B |
| 可复现性 | `index.html` 与 `source/src/content_36.js` 的 blob **均与 HEAD 相同** |
| 拆分版 | 4,263,544 B + 6,571,124 B，启动状态与单文件版一致 |
