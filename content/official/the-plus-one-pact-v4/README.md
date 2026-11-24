# 假恋爱三十天｜MIRU Codex 接入包

每包含一部独立作品。剧本基于 V4，预告脚本使用 V6。

| 路径 | 内容 |
|---|---|
| source/script_v4.docx | 完整剧本原稿 |
| source/script_v4.md | 原稿文本，含编剧后台说明 |
| source/story_bible_v4.md | 作品设定、人物关系与市场介绍 |
| source/scenes_and_gameplay_v4.md | 场景与玩法设计 |
| import/script.zh.md | MIRU 运营后台可导入的中文剧本 |
| import/chapters.json | 同一剧本的结构化章节 |
| import/story_card.json | 故事卡标题、中英文介绍、标签和人物卡资料 |
| import/asset_slots.json | 图片槽位到文件名的映射 |
| import/validation.json | 用 MIRU 仓库导入与播放解析器执行的本地验证 |
| assets/ | 48 张场景图、角色参考图和玩家背影封面，WebP |
| trailer/trailer_v6.md | 10 秒分镜、中英对白、片尾字卡及英文提示词 |

## Codex 接入说明

读取 import/story_card.json 和 import/script.zh.md。逐项核对场景引用与 assets/。按当前仓库文档的正式作品发布流程绑定素材，在 MIRU 运营后台导入、审核和上线。素材文件名对应 asset_slots.json 中的槽位。GitHub 静态资源映射以实际 work_id 建立。

中文稿本地验证结果为 16 章、48 场、96 句角色对白及 48 个自由输入点，章节末尾添加了播放器所需的继续／稍作停留按钮。原稿的隐藏意图、可选玩法和导演备注保存在 source/，尚未接入运行时。故事卡含英文简介，正文章节为中文。预告为制作脚本。线上发布和实机播放待完成。

若通过公开的 GitHub 仓库提供图片，请按仓库规则提交素材映射，运营端通过正式工作台导入原稿和后台内容。
