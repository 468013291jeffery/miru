# backend/ — 这一块归 Ann 维护

> 建这个目录的原因只有一句：**我们两个人在同一个仓库、同一个 `main` 上并行改，没有标出边界就会互相覆盖。**
> 这个目录不是代码，是**边界本身**。看它就够了。

---

## 一、三块地盘（照这个来就不会打架）

### 🟦 姜老师改（前端 / 壳）

| 范围 | 例子 |
|---|---|
| 视觉、样式、动效 | CSS、布局、字体、主题 |
| 路由、页面跳转、新页面 | 发现页、详情页、我的页 |
| 多语言**文案**（不是机制） | `i18n` 里的字符串 |
| Webapp 壳 / iOS 壳 / PWA | manifest、Service Worker、图标 |
| 支付 / 订阅的前端流程 | 按钮、弹窗、跳转 |

新写的东西建议都放 **`web/`** 下（新目录，和现有文件不重叠）。

### 🟩 Ann 改（后端 / 内容 / 链路）

| 范围 | 位置 |
|---|---|
| **全部 API** | `api/*`（`chapter` / `longcat` / `tts` / `state` / `works` / `_lib`） |
| **剧本数据** | `source/content/**`、`content/**`、`content_36.js` |
| **语音链路** | `api/tts.js`、`VOICE` 注册表、`speakQueue` |
| **构建与闸** | `source/build.py`、`tools/**` |
| **内容入库** | `admin.html`、`_plan` / `_dslqa` 校验 |

### ⚠️ 改之前**说一声**（6 个，谁都不许单独动）

```
index.html                 产物。不许手改；谁构建谁提交
source/build.py            parts[] 的顺序决定加载顺序，改错白屏
source/src/app1_core.js    核心状态机，两边都依赖
vercel.json                部署配置，改错整站挂
api/_lib.js                所有 api 共用
.vercelignore              决定哪些文件进部署包
```

**怎么做**：在 commit message 里写清改了哪一行、为什么。不用开会。

---

## 二、给壳用的接口（姜老师调这些）

| 端点 | 作用 | 备注 |
|---|---|---|
| `POST /api/auth.js` | 注册 / 登录 | 已有 |
| `GET /api/works` | 作品列表 | 已有 |
| **`GET /api/chapter`** | **一章的剧情事件** | **2026-10-30 新增** |
| `POST /api/longcat` | 一轮 AI 对话 | 已有 |
| `GET/POST /api/state` | 存档 / 读档 | 已有 |
| `POST /api/tts` | 文本转语音 | 已有，CDN 缓存一年 |

### `/api/chapter` 一句话说明

```
GET /api/chapter?worldId=ice&chapter=1&lang=zh
→ { world:{id,title,cast}, chapter:{n,title,place,time,count,next}, events:[…] }
```

- `events` 只有四种类型会出现：`say` / `act` / `think` / `choice`
- 剧本里的引擎指令（`bgm` / `fx` / `scene` / `if` 等 **28 种**）**在服务端就拦掉了**，不会漏给你
- 章末那道选择题是 `events` 的最后一条，`kind` 固定为 `choice`
- `chapter.next` 是下一章号，`null` 表示这部到头了
- 实测：首次解析 ~56 ms，之后 **2 ms**（进程内缓存）

---

## 三、这个目录以后放什么

| 文件 | 是什么 |
|---|---|
| `README.md` | 本文件 —— 边界 |
| `DELIVERY.md` | 交付账：什么时候给了什么，谁验的 |

---

## 四、一条底线

**改动撞上了别人的地盘 ⇒ 先说一声，再动手。** 这句比上面所有表都重要。
