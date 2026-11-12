# MIRU 系统旁白核查

核查日期：2026年11月12日。仓库：468013291jeffery/miru。main 提交：90e5b5b467f86c876eece7f128a03a3b8bf5fbea。

本包重写八章冲突、导语及推进方式，全文改用直接说法；保留四名人类角色、32个选项、六个结局与每章三张高光图描述。系统由剧情旁白承担，不再作为第五个人物参与对白。当前交付为中文编剧稿与中文配置，英文展示字段尚未做英文改编。

## 旁白实际经过的流程

1. bible98 从 art/official/<作品编号>.bible.json 读取作品资料。
2. app145_narration.js 从 narrative145.materials 读取作者材料，按当前章节和场景筛选。导演可选择 before、between、after 位置。
3. 前置和人物间的作者旁白可以直接显示。后置旁白结合本轮表演生成，再作语义检查；失败时回到作者原文。模型允许改写，因此不保证每次逐字照念。
4. 旁白通过 appendMsg 写入聊天，类型为 who=n、k=act。成功显示后才记录材料已经给过，并登记短事实。
5. scope=player 的事实 seen 为空；启用 context.schema=1 后，角色上下文与压缩记忆均不接收这段私密事实。公开导语、世界规则和角色卡也必须避免另行写入秘密。

现有 requires 表示前置旁白已经显示，不是现实任务已经完成。choice 表示玩家选过意图，也不是操作回执。因此本版不靠点击选项自动判定保存副本、移交材料或取得承认。旧档到章可查询，实际行动由本轮表演及有来源记录确认。

## 本地验证结果

原仓库自测：22项通过。本稿专用自测：34项通过，结果保存在 narration-local-test-results.json。

本稿检查覆盖：八章32选项24材料结构；作者原文来源；全部24段完整显示；全部24段玩家私密范围；未来章节限制；最终章补问旧档；压缩与保存后仍不进入角色记忆；模型失败回退；重复抑制；公开导语和角色卡无旧档秘密；原TTS函数的截断行为。

以上是从指定提交抽出的本地函数测试，模型回复使用模拟数据。没有声称线上版本已部署、真实模型全程试玩通过或实际音频已播放。

## 声音仍需处理

app62_tts.js 的 ttsUrl 对请求文本执行 slice(0,200)，ttsSpeakable 也把可朗读长度限制为200。app145 的后置模型旁白预算最高为450字符。两者存在真实的不一致。

本稿24段作者原文均不超过200字符，文字读取测试完整通过。不过后置模型仍可能扩写，不能仅靠缩短作者原文保证每次音频完整。还需核对独立 who=n 消息是否进入朗读队列、是否有可用播放按钮，并在产品中处理长文本分段和依序播放。当前配置以完整文字交付必要信息。

## 系统结束与产品开关

第八章关闭系统界面是剧情结局，不等于产品已有持久的旁白关闭设置。当前v2的narrationPolicy135覆盖会强制enabled=true；安静请求只抑制本轮，进入章节仍可给开场旁白。若要实现停止推送或只手动查询，需增加跨章节状态与入口，不能只在剧本文字里写已关闭。

## 接入文件与限制

- narration.v2.json：独立作者材料，共24段。
- romance-the-killer.bible.json：含作品资料、角色、八章及旁白材料。作品编号是接入用占位编号，发布时须使用实际编号。
- Word：完整剧本、24段旁白、接入与核查说明。

Word不是运行时接口，任意JSON也不是创作中心导出文件。app51_import.js 的导入要求 story 和 project；本包通过现有 bible98 资料路线接入，不能把这里的JSON直接当作创作中心导出包上传。

尚未完成线上发布或实玩。正式接入还需确认按玩家选择动态维护在场名单，尤其是第六、七章不见面路线；核对单人朋友边界与当前全组朋友状态的差别；检查存档与声音。音乐、特效和小游戏在Word中保留演出说明，配置未冒填不存在的素材地址，games_on保持关闭。高光图目前是文字描述，未生成本剧图片。

## 代码定位

- [旁白读取与输出](https://github.com/468013291jeffery/miru/blob/90e5b5b467f86c876eece7f128a03a3b8bf5fbea/source/src/app145_narration.js)
- [私密范围与角色记忆](https://github.com/468013291jeffery/miru/blob/90e5b5b467f86c876eece7f128a03a3b8bf5fbea/source/src/app135_context.js)
- [作品读取与演员输入](https://github.com/468013291jeffery/miru/blob/90e5b5b467f86c876eece7f128a03a3b8bf5fbea/source/src/app98_story.js)
- [TTS长度限制](https://github.com/468013291jeffery/miru/blob/90e5b5b467f86c876eece7f128a03a3b8bf5fbea/source/src/app62_tts.js)
- [创作中心导入格式](https://github.com/468013291jeffery/miru/blob/90e5b5b467f86c876eece7f128a03a3b8bf5fbea/source/src/app51_import.js)
- [原仓库自测](https://github.com/468013291jeffery/miru/blob/90e5b5b467f86c876eece7f128a03a3b8bf5fbea/tools/narrative145-selftest.cjs)
