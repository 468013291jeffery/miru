# 余音未散 · WHEN THE SONG RETURNS

用户授权来源：余音未散_完整互动剧本_v1.md 与余音未散_正式素材_v1.zip。
视觉以包内 v1.1 同步稿为准；薇薇安使用最终确认的栗色波浪发形象。

- 12章、48场景、24个明确自愿且可跳过的文字小游戏。
- 五位人物与玩家分开；薇薇安、艾琳为两位女性可攻略角色；朱尔斯为非二元性别配角。
- 51张原始JPEG逐文件校验，48个基础背景槽位映射到共享地点，保留条件覆盖。
- 六段作者简介和固定开篇；开篇先停留，用户原话不会被预写。
- 签约、照顾、档案、旧语音、恋爱、私人出行与演出分别记账。
- 直播、小场、工作交接互斥；七种结局按明确意图与实际条件收束。
- 未交付音频或预告片，不设置空播放器。旧语音以文字呈现。

`author-manuscript.md`、`visual-manuscript.md` 与 `adaptation-source.json` 是审校依据，不作为旁白导入。
`script.md` / `admin-import.json` 仅含可识别指令及公开正文；当前场景的隐藏分支由限定于本作品的适配器读取。
`release.json` 生成 `source/src/app159_song_data.js`，队列与状态分别在 `app159_song.js`、`wtsr_state.js`。

验证：song-selftest.cjs（素材、授权、幂等性）、song-parse-selftest.cjs（真实导入器）、song-flow-selftest.cjs（48场景完整路线与七种结局）。
发布：GitHub 提交部署到 OVH 后，再用正式部署目录内 admin-import.json 执行自动审核与发布。
