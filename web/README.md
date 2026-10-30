# web/ — 前端这一块（姜老师那边）

> 建这个目录的原因：**两个人在同一个仓库里改前端，没有边界就会互相覆盖。**
> 这个目录和 `backend/` 是一对：**后端在 `backend/` 与 `api/`，前端在 `web/`。**

---

## 一、这里放什么

✅ **放**：页面、样式、组件、前端路由、状态管理、i18n 文案、PWA 配置（manifest / Service Worker）
✅ **放**：给 ios / 安卓壳用的前端代码
❌ **不放**：`api/*`（后端）、剧本数据、构建脚本（`source/build.py`）

---

## 二、两种用法，先想清你属于哪种

### 模式 A：改现有的 MIRU 前端

MIRU 的前端是**单文件 bundle**：`source/build.py` 按 `parts=[...]` 顺序把 `source/src/*.js` 拼成 `index.html`（≈9.85 MB）。

⇒ 改现有页面，**还是得改 `source/src/*.js`**，改完 `python source/build.py`。

⚠️ **改 `source/src/**` 之前先打一声招呼**（那是我们两边都会碰的 21 个文件）。
⚠️ `index.html`、`config.js`、`content_36.js` 是**生成物**，手改无效（下次构建就没了）。

### 模式 B：从零写一个新前端（**推荐给 webapp**）

如果目标是做一个新的 webapp（不继承 MIRU 那个 9.85 MB 的 bundle），那**直接在这里从零写**：

```
web/
├── README.md          这一份
├── index.html         新前端的入口
├── src/               页面 / 组件 / 状态
├── styles/            样式
└── dist/              构建产物（或直接由 Vercel/nginx 托管本目录）
```

**好处**：和 MIRU 的老前端**物理隔离** —— 你改你的，我们改我们的，谁也不会把谁覆盖。

---

## 三、新前端要的数据，全在 `api/`（一行都不用自己算）

| 你要什么 | 调什么 | 状态 |
|---|---|---|
| 剧集列表 | `GET /api/works` | ✅ 已有 |
| **一章的剧情事件** | `GET /api/chapter?worldId=ice&chapter=1&lang=zh` | ✅ **2026-10-30 上线** |
| 一轮 AI 对话 | `POST /api/longcat` | ✅ 已有（需配 key） |
| 存档 / 读档 | `GET/POST /api/state` | ✅ 已有 |
| 语音 | `POST /api/tts` | ✅ 已有（需配 key） |
| 登录 / 注册 | `POST /api/auth` | ✅ 已有 |

### `/api/chapter` 的返回形状

```json
{
  "world":   { "id":"ice", "title":"…", "cast":["mason","ethan"], "chars":{…} },
  "chapter": { "n":1, "title":"你要的交易", "place":"主场更衣室", "count":8, "next":2, "lang":"zh" },
  "events":  [ {"t":"act","text":"…"}, {"t":"say","who":"mason","text":"…"}, {"t":"choice","ask":"…","options":[…]} ]
}
```

- `events` 里只会出现 **`say` / `act` / `think` / `choice`** 四种
- 剧本里的引擎指令（`bgm` / `fx` / `scene` / `if` … 共 28 种）**在服务端就拦掉了**，不会漏给你
- 章末那道选择题是 `events` 的最后一条，`t` 固定为 `choice`
- `chapter.next` 是下一章号，`null` = 这部到头

**实测读数**（2026-10-30，测试服）：`ice#1` → 200 / 1,651 B；`ice#4` → 200 / 1,613 B；
不存在的 worldId → 404；缺参数 → 400。

---

## 四、一条底线

**改了别人的地盘（`api/` / `source/` / `build.py` / `index.html`）⇒ 先说一声，再动手。**
比上面所有约定都重要。

---

## 五、现在到底"能不能各改各的"（2026-10-30 实况）

| 目录 | 归谁 | 能不能各改各的 |
|---|---|---|
| `api/`（19 个文件） | Ann | ✅ 完全独立 |
| `backend/` | Ann | ✅ 完全独立 |
| **`web/`（这个目录）** | **你** | ✅ **完全独立** |
| `source/src/`（151 个文件） | **共用** | ❌ 你改现有前端就得动它 |
| `tools/`（63 个） | 主要 Ann | ⚠️ 你的视觉闸也在这里 |
| **`index.html`** | **GitHub Action** | ✅ **谁都不用碰**（改了 `source/**` 它自己重建） |

### 一句话

- **你走模式 B（在 `web/` 从零写新前端）** ⇒ **真的各改各的，零交集**
- **你走模式 A（改现有 MIRU 前端）** ⇒ 还是得动 `source/src/`，那是共用区 ⇒ **改之前说一声**

### 如果真的撞上了，只会在这三处

```
source/src/*.js      前端源码（21 个文件两边都改过）
source/build.py      parts[] 决定加载顺序 —— 改错整站白屏 ⚠️ 最危险
tools/               闸
```

⚠️ **`source/build.py` 是这三个里唯一能让整站挂掉的**，动它之前一定说一声。

### 已经不用管的事

`index.html` 不再需要手动提交 —— 2026-10-30 起由 GitHub Action 自动构建
（`.github/workflows/build-index.yml`：谁 push `source/**` 就跑 `build.py` 并提交产物）。
⇒ **这也是过去合并冲突最大的一块，现在彻底没有了。**

