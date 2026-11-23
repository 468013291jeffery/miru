> **重要 V2 素材更新：** 本工程已替换生图提示词。请仅使用 `assets/70张_真人电影感_沉浸动作交互_中英文独立提示词_V2.md` 及 `production/70张_视觉资产清单.json`（已同步 V2）。勿使用 `*V1_仅供对照_勿投产.md`。

# M119｜Codex 研发交接：状态、自由输入、经营委托与运行接口

## 1. 核心循环
客户来访 → 识别保密权限与利益冲突 → 了解具体诉求 → 玩家自由表达立场 → 执行有授权的调查/协商/经营操作 → NPC以知识范围与自主性回应 → 记录结果与延迟种子 → 进入下一幕/新委托。重大案件与情感线分轴结算。每章的2个小游戏嵌于第2、3场，失败/跳过合法继续。

## 2. 运行时必读文件
- `story/作品资料_首页简介_人物卡_作者端时间线.md` → 固定事实
- `story/16章64场_中文完整剧情初稿_原创英文对白.md` → 当前剧情与英文角色原声
- `engineering/64场节点_自由输入隐藏意图.json` → 节点、场景转移、意图与反馈
- `engineering/世界状态_人物记忆_数值模型.json` → 状态初值及边界
- `engineering/多结局_四轴结算规则.json` → 路线资格
- `design/32个小游戏_机读规格.json` → 具体问题答案、旗标、跳过
- `assets/70张_真人影视级_动态交互_中英独立生图提示词.md` → 资产生成源（非图片文件）
- `production/64场_资源映射.csv` → 资产对照表

## 3. 自由输入意图路由
- 输入可为任何自然语言（中文、美式英语或混合）；使用意图分类而非界面固定选项。返回 `{intent, confidence, recognized_action, proposed_effect, needs_confirmation}`。
- 包含核心意图 `protect_client / seek_evidence / state_boundary / defer_or_reject / catchall`。支持细分情绪，但不能覆盖这些合法路径。
- 重大、不可逆动作如公开私人信息、承诺支付或联系前未婚夫，需要明确二次确认；含糊语句维持未定。
- 只在提交节点后更新状态，输出场景事实来源；重复点击、读档复播不能重复奖励或扣款。
- 玩家声称“我查到Martin的罪证”“我已经复合”不等于世界发生事实：实际核验材料/双方同意后才能设旗标。

## 4. API 与JSON契约建议
```json
{
  "scene_id": "CH01_S02",
  "player_text": "这可能涉及我的利益冲突，先不要收款。",
  "story_state_version": 1,
  "intent_classifier_output": {"intent": "state_boundary", "confidence": 0.94},
  "pending_confirmation": null,
  "commit": {"flag": "CH01_S02_state_boundary", "resource_change": {}, "world_fact_added": null},
  "next_scene_id": "CH01_S03"
}
```
## 5. 委托经营引擎（配置型，不要用无限AI闲聊代替内容）
- `case_id, client_goal, consent_scope, privacy_risks, conflict_checks, service_limit, available_methods, time_budget, next_check_in, payoff_state`。
- 同一委托重复访问时读取已确认的事项，不能无意义重复问同一组问题。每案至少一个具体交付：风险通知、权属交接清单、公开声明草案、资源转介或双方自愿同意的退出计划。
- 资源按 `cash_available, legal_hours, client_load, staff_energy, pro_bono_slots` 运行；**百万美元只是托管意向，不记收入，未受理不扣押/入账**。
- 新季案例采用“模板 + 角色原创事实 + 不重复目标”方式生成，但本工程未提供无穷无尽的已写客户正文。

## 6. 知情与长期记忆
- 信息标签：`objective_truth`（作者真相，NPC不能直接看到）、`observation`（玩家看见）、`testimony`（角色声称）、`verified_document`（已核验）、`hypothesis`（玩家猜测）。
- 记忆记录：`event_id, speaker, subject, source, timestamp_story, observers, consent_to_recall, confidence, delayed_payoff, privacy_classification`。
- 客户机密默认只对参与其委托且获授权人员可读。Gabriel不得从程序全知直接发现玩家身份细节。
- 离线不扣情绪、信任和项目期限；剧情内期限只能依据有实际提交的选择推进。

## 7. 电话/消息规则
- `phones: true`。仅在现代世界且拨打者/接收者不在当前场景时可写来电，电话必须有跳过替代。
- 当前脚本第13章（实际经章节筛选后的章节）允许Gabriel在不在场时通过许可的电话交谈；跳过即Theo改为书面转交核心事实。

## 8. 资源映射与视觉规则
- 背景图 `BG_CH01_01` ... `BG_CH16_04`，封面`COVER_001`，五张`CHAR_...`，合计70。
- 强制 `live_action_photorealistic=true`, `comic=false`, `anime=false`；人物包含剧情动作，玩家女性POV不露脸。
- 文字、合约细节和关键号码必须独立UI文本渲染，不能信任生图里的伪文字。

## 9. 运行测试门槛（开发后验收，不是已完成）
- 全部节点ID、场景ID、小游戏ID、背景映射ID引用可达。
- 任意小游戏失败/跳过不死路；不复合、不公开病历、拒绝百万委托仍有完整事件路径。
- Vivian与玩家可合作，剧情绝不默认女性之间的恶意竞争。
- 两条潜在恋爱线都必须有明确同意和边界，不以好感覆盖行为修复。
- 先检查经营账目是否独立于情感分支，再测断线续存和重复提交幂等。

## 10. 24小时容量规划与现状
- 本项目16章，按已确认24小时目标反推平均至少90分钟/章。每章4场，**目前文档是结构化逐场完整创作初稿，不是实际完成90分钟/章**。
- 待制作：每场约20–25分钟的不重复有效内容，包括可核验的客户资料、可进入的访谈、可持续演进的关系对话、完整英文本地化、动态日程与个案处理，多种方法导致的独有活动。每位玩家实际可达内容须逐路计量，互斥分支不得相加。
- 当前不提供任何实测游戏时长，不能在宣传中写“已可玩24小时”。
