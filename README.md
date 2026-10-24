# MIRU

Interactive drama web app. Live: https://468013291jeffery.github.io/miru/

AI engine: Claude or LongCat (enter your own API key in 我的 → AI 引擎; keys are stored only in your browser).

## Docs

| | |
|---|---|
| [`BUILD.md`](BUILD.md) | 构建：一条命令、五步流水线、可复现判据、五个「构建成功但东西错了」的情形 |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | 什么在本地、什么在线上：判据 · 能力对照表 · 五条链（带 `file:line`）· 开关 · 未验项 |
| [`DECOUPLING.md`](DECOUPLING.md) | 还耦合着什么、已经拆开什么、下一步的顺序 |
| [`LEDGER.md`](LEDGER.md) | 可导出的玩法账本：事件 → CSV（10 列）→ 汇总（完成率 / 选项分布 / 时长），含口径铁律 |
| [`STATUS-LAYER.md`](STATUS-LAYER.md) | 状态写入层：唯一写入口、夹值、留痕、棘轮（29 → 25，只降不升） |
| [`CHANGELOG.md`](CHANGELOG.md) | **先看这份**：这条分支改了什么 · 规格 19 条对账进度 · 合并注意 · 待拍板 |
| [`PLOT98.md`](PLOT98.md) | 场景计划层：已有的 / 缺的 / T19 的四小步 / 明确不做的 |
| [`CHARACTER-CARD.md`](CHARACTER-CARD.md) | 角色卡：五类字段（不可变/可变/只增/立场/揭示）· 每章一份补丁 · 可回放 |
| [`PER-CHARACTER-PAYLOAD.md`](PER-CHARACTER-PAYLOAD.md) | 每角色一份 payload 的设计：在场跟章走 · 卡分公开/私密面 · 调度规则 · 成本口径 · 四步落地 |
| [`QUALITY.md`](QUALITY.md) | 质量闸：八套 158 个用例各查什么 · 四条不变量 · 改哪会红 · 红臂 · 已知没覆盖的 |
| [`TUNING.md`](TUNING.md) | 可调参数（滑钮）：14 格默认值 · 改 `tune.js` 免构建生效 · 每格的风险 |
| [`SPEC-AUDIT.md`](SPEC-AUDIT.md) | 规格 v7.11 vs 代码：19 条逐条对账（已实现 1 / 部分 9 / 没有 9） |
| [`SPEC-v712-MAP.md`](SPEC-v712-MAP.md) | 他们 v7.12 / v8.2.4 的清单 ↔ 我们源码：逐条带 `file:line`，含"没有"的那半 |
| [`PERF.md`](PERF.md) | 卡顿与内存：量到的三件事（10.4 MB 单文件 · 图片进存档 · 45 个常驻定时器）+ 按收益排序的修法 |
| [`STRUCTURE-ACCOUNT.md`](STRUCTURE-ACCOUNT.md) | **结构账**：谁有什么、谁欠谁 —— 一页，给过会用（含我们补的三个洞与我们的欠账） |
| [`source/README.md`](source/README.md) | 源码目录地图（改哪儿 → 跑什么） |
