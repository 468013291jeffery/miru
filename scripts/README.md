# 剧本目录（给前端）

> 2026-10-31。**不再打包**。每部作品一个目录，剧本与素材地址都在这儿，素材本体留在 CDN 上。
> 语法规则在同目录 `syntax.md`（这份是接入约定，那份是"怎么写剧本"）。

---

## 一、目录形态

```
https://www.miru.plus/scripts/index.json          全量清单（哪些作品、什么模式、几章）
https://www.miru.plus/scripts/syntax.md           剧本语法与标签（解析依据）
https://www.miru.plus/scripts/<work_id>/          单部目录
    script.md       剧本原文（DSL 文本）
    bible.json      故事圣经（只有 mode=bible 的作品有）
    meta.json       标题 / 钩子 / 取向 / 标签 / 章节数 / 模式 / 版本 / 文件指纹
    art.json        素材地址，按用途分好组（见下）
```

**素材本体一个字节都不在这里** —— `art.json` 里全是可直取的 URL（实测 200）。
要打包/缓存到你们那边，按 `art.json` 逐个下载即可。

## 二、`art.json`：封面与剧情图分开放

```json
{
  "cover":  "https://…/cover.jpg",          // 封面（发现页/详情页用这张）
  "poster": "https://…/poster.jpg",         // 竖版海报（可能缺）
  "characters": { "adrian": "https://…/char_adrian.jpg", "victoria": "…" },
  "scenes":     { "bg_c01s01": "https://…/bg_c01s01.jpg" },
  "props":      { "prop_01": "…", "hl_02": "…" },
  "videos":     { "vid_01": "https://…/vid_01.mp4" },
  "others":     {}
}
```

| 字段 | 是什么 | 什么时候用 |
|---|---|---|
| `cover` | **封面** | 列表卡片、详情页头图。**没有就是没有，别拿 scenes 里的顶** |
| `poster` | 竖版海报 | 分享卡；缺省用 `cover` |
| `characters` | **角色立绘**，key = 角色 id | 对话气泡旁、资料页 |
| `scenes` | **剧情图片**，key = 场景 id（`bg_c01s01` 这类） | 换场景时铺背景。**key 必须与剧本/bible 里的场景 id 对得上** |
| `props` / `others` | 道具、特写 | 剧情插入图 |
| `videos` | 短视频 | `mode=script` 的作品里由 `⟦VIDEO|槽位⟧` 引用 |

⚠️ **命名是协议**：自由模式（`mode=bible`）取图是按前缀拼的 —— 场景图 `bg_<场景id>`、立绘 `char_<角色key>`。
名字对不上就**静默不显示**（不报错）。这条写在 `syntax.md` 的第十四节。

## 三、`meta.json`

```json
{
  "workId": "w_…", "title": "…", "hook": "…", "lang": "zh", "orient": "bg",
  "tags": ["…"], "mode": "script | bible", "chapters": 12,
  "scriptVer": 2, "bundleVer": 2, "packVer": 1793360208030,
  "artCounts": { "cover": 1, "scenes": 120 },
  "files": { "script.md": {"bytes": 8346, "sha256": "…"}, "art.json": {…} }
}
```

`files[].sha256` 用来校验你拿到的和发布的一致；**别用 `bytes` 判完整性**。

## 四、两种 `mode`（解析入口不同）

| mode | 文件 | 怎么播 |
|---|---|---|
| `script` | `script.md` | 前端按 `syntax.md` 把文本解析成事件流行播放；玩家说话时模型接管 |
| `bible` | `bible.json` | 场景是**数据**，不是文本：`chapters[].scenes[]`，每场一句 `beat`（锚点）+ 可选 `script`（逐字台词）；导演按锚点演，玩家自由对话，点「继续」才推进 |

`bible` 的字段在 `syntax.md` 第二部分（十～十五节）里有逐项说明。

## 五、版本与漂移

- `scriptVer`：**剧本语法的版本**。我们改语法就 +1，你们据此判断要不要跟。
- `bundleVer`：目录形态的版本（1=打包时代，**2=当前目录形态**）。
- 我们**不承诺**与你们自研解析器逐字节行为一致；判据以 `syntax.md` 为准。

## 六、现在有哪些作品

看 `index.json`。每条给：`workId` / `title` / `mode` / `chapters` / `orient` / 四个地址（目录、meta、script、art）。

**已知缺口（不藏）**：
- 只有 3 部作品带素材（`冰场之外` 128 条、`丝绒谎言` 系列、`月下/梦境/危险距离` 各 3 条）；其余是纯剧本
- 扩写批 5 部、`丝绒谎言·第1章` 都**只有 1 章正文**（大纲没写成正文）
- `VELVET LIES` 的 59 张图命名是 `bg_01…bg_20 / portrait_* / prop_*`，**不符合** `bg_<场景id>` 协议 ⇒ 在自由模式下不会显示（在逐字剧里由 `⟦BG|槽位⟧` 引用才显示）
