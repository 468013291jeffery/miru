# 卡顿与内存：量到了什么（2026-10-25）

> 玩家反馈「玩起来卡、特别占内存」。这一页只放**量出来的数**和**可选的修法**，
> 每条都能用 `node tools/perf-audit.mjs` 或下面给的命令复现。没有猜测。

## 一句话结论

**不是"架构不行要重写"，是三件具体的、可以分开拆的事**：
① 单文件 10.4 MB（首屏就要下完、解析完）② 图片被当成状态存进 `S`（每次保存全量序列化）
③ 四十多个定时器 + 好几路逐帧循环在后台常驻。

## 一、首屏：10.4 MB 的单文件

```
index.html              10.38 MB
  content_36.js          6.42 MB  60.4%   ← 剧本内容（37 部）
  pdfjs_embed.js         1.40 MB  13.2%   ← PDF.js，只有「导入 PDF」时才用
  app61_honor.js         222 KB    2.1%
  creator_embed.js       218 KB    2.1%
  其余 114 个文件         ~2 MB
```

- **PDF.js 那 1.4 MB 是纯背着走**：它被嵌成**字符串**（`pdfjs_embed.js:1` 只做
  `window.PDFJS_SRC="…"`），只有 `app53_import2.js:6` 在导入 PDF 时才把它注入执行。
  也就是说：**99% 的玩家永远用不到，但每次打开都要下载+解析这 1.4 MB。**
- `content_36.js` 6.4 MB 是内容本身。它不是冗余，但它是"一次性全下"的。

## 二、内存：图片被当成状态存进 `S`

这是最该先修的一条，因为它是**放大器**：`S` 每存一次就整份序列化一次。

| 存在哪 | 内容 | 上限 | 估算 |
|---|---|---|---|
| `S.art[id]` | 每个角色的立绘，`canvas.toDataURL("image/jpeg",.8)` | 角色数（约 30） | **≈ 2.4 MB** |
| `S.album[]` | 玩家保存的场景图，`toDataURL("image/jpeg",.72)` | 12 张 | **≈ 0.7–1.2 MB** |
| `POSTER[id]` | 海报缓存（只在内存，不入 localStorage） | 不限 | 随浏览增长 |

画布是 420×540、jpeg 质量 0.72–0.84 ⇒ 单张 base64 约 **60–110 KB 字符串**。

**而 `save()` 是 `localStorage.setItem(KEY, JSON.stringify(S))`，全仓有 384 个调用点。**

⇒ 状态里揣着 3–4 MB 的 base64，每次保存都要把这 3–4 MB 重新拼成一个字符串，
**同步**写进 localStorage（浏览器主线程）。

**旁证（这条最硬）**：`app1_core.js:19` 的 `save()` 里有这么一段兜底 ——

```js
catch(e){ /* storage full: drop oldest album frames first */
  if(S.album.length>4){ S.album=S.album.slice(0,4); localStorage.setItem(KEY,JSON.stringify(S)) } }
```

**他们在线上真的撞到过 5 MB 配额**，处理办法是把玩家的相册砍掉。
那是症状，不是设计。

## 三、后台一直在跑：45 个定时器，只有 24 处清理

```
setInterval 45 处 · clearInterval 24 处
```

几个贵的（间隔 × 常驻）：

| 位置 | 间隔 | 在干什么 |
|---|---|---|
| `app18_promo.js:128/194` | 常驻 | 每轮统计所有「moments」并按徽章 |
| `app48_clean.js:26` | 常驻 | 每轮找 `#msgs` 挂 MutationObserver |
| `app67_i18n.js:110` | 常驻 | 每秒查语言变没变 |
| `app84_nosub.js:10` | 3 s | 每 3 秒查一次订阅状态 |
| `app54_longcat.js:38` | 1 s | 每秒应用一次模型配置 |
| `app6_games.js:61` | 小游戏内 | 每轮造一个 DOM 元素 |
| `app40_sfx.js:27/35/36` | 环境音 | `SFX.timers.push(setInterval(...))` —— **定时器只加不减** |

外加逐帧循环（`requestAnimationFrame`）分散在 7 个文件：`app20_fx_booth` / `app21_dims` /
`app22_fx2` / `app24_gl`（WebGL）/ `app30_fx3` / `app3_chat` / `app4_more`。
**两路同时跑就是双份 GPU/CPU**，而它们各自都不知道别人在跑。

## 四、修法（按「收益 ÷ 风险」排序）

| # | 做什么 | 收益 | 风险 | 量 |
|---|---|---|---|---|
| **1** | **图片搬出 `S`**：`S` 里只留 id，图片存 IndexedDB（或至少单独一个 localStorage key、不参与 `JSON.stringify(S)`） | save 从「几 MB 序列化」降到「几 KB」；内存降 2–4 MB；**顺手解决 5 MB 配额被撑爆** | 低（读写集中，能一次性替换） | **半天** |
| **2** | ✅ **已做（2026-10-25）**：PDF.js 移出主包，改成点「导入 PDF」时才加载 `pdfjs_embed.js` | 首屏 **10.38 → 9.02 MB（−1.36 MB，−13%）** | 很低 | 完成 |
| **3** | **定时器收敛**：只在对应屏幕可见时启动，切走就 `clearInterval`；`SFX.timers` 加清理 | 后台 CPU 与内存明显降 | 中（要逐个数清哪些还在用） | **2–3 小时** |
| **4** | **`content_36.js` 分片懒加载**：进哪部剧本才下哪部 | 首屏最多能少 6 MB | **高**（要动构建、缓存失效、离线可用性） | **2–3 天** |
| 5 | rAF 统一调度（一个循环驱动所有特效） | 中 | 高（要重写特效层） | 不建议现在做 |

### 这条现在有闸

`node tools/perf-budget.mjs` —— 主包回到 9.5 MB 以上就红（防止 1.4 MB 被塞回去），
外加断言那份独立文件还在仓库根、两个全局都还有内容、主包里只剩加载器那一处引用。

## 五、给会上的说法

> 卡的原因是三件可以分别处理的工程问题，不是「要重做」：
> **图片被塞进了存档**（每次保存都要重新拼一遍几 MB）、**单文件 10 MB 每次都要下完**、
> **四十多个定时器在后台常驻**。前两件加起来一天能修完，收益最大。
