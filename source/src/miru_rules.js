/* ================= MIRU 互动剧本结构与生成规则｜终版 — single source of truth =================
   Used by: the app's creator (MIRU_RULES.gen → every AI generation call), live story replies (MIRU_RULES.play),
   publish QA (MIRU_RULES.check), the operations console's 剧本生产 workbench (full text + research contract + check),
   and the backend (/api/admin via api/_rules.js). The full text lives in rules_final.md and is embedded at build time
   as MIRU_RULES_FULL. Edit the rules here / in rules_final.md only — build.py copies this file to every consumer. */
var MIRU_RULES = (function () {
  const version = "终版 v1.0 (2026-10-18)";
  const gen = `【MIRU 互动剧本生成规则｜终版 · 所有剧本生成必须遵守】（必须/不得=硬规则；建议/默认=可调参数）
01 范围与事实：执行优先级 本次用户要求 > 已确认项目设定 > 本规则硬规则 > 模式配置 > 建议默认值。区分 已确认/生成提案/待确定；只输出请求的层级；不以猜测覆盖事实；修改上游同步下游，同一设定只保留一个生效版本。
02 安全：所有角色为虚构成年人(21+)；无露骨性描写、无未成年恋爱暗示、无真实人物、无他人版权角色；不把虐待、占有、越界自动解释为爱，复杂关系的行为、伤害与后果必须成立。
03 容量（MIRU 正式本子）：全本统一目录 15–20 章，分支在章内展开；一条可完成的普通完整路线按 24 小时以上有效游玩规划（建议起点 18 章×约 90 分钟≈27 小时；15 章≈96 分钟/章，20 章≈72 分钟/章）；每章 4–6 个可自然中断的段落（每段约 15–25 分钟）。时长来自有因果的新经历、互动和后果，不靠复读、跑腿、无限聊天、故意慢显示凑时长；互斥路线不相加；未实测只写 estimated。用户自建短篇按作者选择的篇幅执行，其余规则不变。
04 生成顺序：定位与体验承诺 → 容量口径与世界边界 → 完整人物及长线问题 → 四轴结局方向 → 阶段/章节与互动预算 → 世界信息与认知情绪链 → 分支、状态与道具路径 → 场景与节拍 → 信息权重与对白/画面分工 → 对白、演出与本地化 → 回填状态、记忆、时长与结局资格。不得先堆对白再反推结构。
05 开篇：Cold Open 用具体行为呈现角色吸引力、对玩家的态度和首次有效参与，同时交代我是谁、在哪、眼前发生什么；突出一个核心吸引点和一个待探索侧面；不强制以危机开场，不一次交代全部优点与秘密，不用旁白宣布“他很温柔”。
06 世界：作者端事实完整；玩家端按需呈现——类型、基调、身份与关键限制在开篇讲清；当前行动的规则、代价、风险在选择前讲清；历史、组织、秘密随行动与询问展开。世界厚度覆盖生活层面、社会规则、利益/权力、历史成因与未来变化，每条重要规则关联具体表现、受影响的人、玩家可参与的方法与代价；支线人物有自己的目标；同一地点回访时用途随阶段变化。
07 人物：完整画像（外形身份、经历、能力限制、喜恶、习惯口头禅、语言节奏、欲望、弱点、恐惧、秘密、压力触发点、价值排序、自我认知与实际矛盾、亲密边界、关爱方式、冲突与修复方式、主动目标、成长阻力、成长后保留的特征）；稳定画像/当前状态/关系档案/弧光档案分开。反应 = 画像 + 知情范围 + 情境压力 + 关系阶段 + 弧光阶段。角色只用亲历、被告知或合理推断的信息。数值每人 2–3 关系指标 + 1–2 弧光指标，有上限与重复递减；好感≠信任；聊天/送礼不抵消背叛、违约、越界。弧光：起始模式—动摇—尝试—考验—稳定或转向，需行为证明。角色可主动分享、提案、拒绝、道歉、退出；不得替玩家决定爱上、原谅、同意亲密或接受关系。为目标语言维护人物声线卡。
08 结构：纵向阶段主干 + 阶段内树状分叉 + 带状态汇合 + 少量独立高潮；禁止无预算全组合树。七层：故事→幕→阶段/章节群→路线→场景→节拍→交流回合。18 章示意 第一幕 4 / 第二幕上 5 / 第二幕下 5 / 第三幕 4，中点在第二幕内；比例参考 20/30/30/20。阶段卡：共同问题、进入条件、2–4 种实质不同方法（拒绝/绕行/有限配合也算）、独有体验、失败后果、汇合条件、保留状态、章节范围与分钟预算、种子种下/回收点。事件线、关系线、弧光线分别记录，合作对象不自动成为恋爱对象。
09 章节：每章先定义玩家为何参与、要完成或理解什么、角色为何在场、世界规则如何影响行动、结束后什么改变；通常承担事件/关系/弧光/世界中至少两类功能；厚度来自场景间的因果（信息→判断→行动→处境变化→人物回应），不是几十段对白或无关小活动；互动分布在方法选择、探索协作、自由表达、后果判断中，不只章尾一个选项；结束时保留已完成、仍开放、承诺/未修复冲突和下一步。不强制每章反转、争吵或悬崖钩子。
10 互动玩法：每本 2–4 个核心互动循环（观察—表达意图—行动/合作—角色回应—状态与新内容—承接）；机制只选服务人物与剧情且平台支持的；玩家参与必须改变信息、方法、资源、承诺、关系体验、可用行动或结果中的至少一项；复用机制要换对象、条件、态度或代价；失败有继续、替代或终止去向，不以重复失败拉时长。
11 分支：等级 L0 表达 / L1 关系微变化 / L2 场景 / L3 阶段路线 / L4 跨阶段长路线 / L5 高潮结局；拓扑可用回折、挑战、时间洞穴、分支与瓶颈、嵌套。L0 不得假称影响命运；重要选择必须改变行动、信息、资源、参与人物、承诺、边界或后续机会，并有后文读取点；一次模糊措辞不锁长路线。状态分 personality/relation/plot/knowledge/resource/commitment/unresolved_conflict/memory/time。延迟种子写清创建、知情者、触发、修复、失效与兑现，不重复兑现。汇合不清零经历。未定义路径不得自动 BE。
12 节奏：场景先定目标、阻碍或微张力、玩家行动空间、人物策略变化、退出状态与后续读取点；“推进关系”不能单独当目标。强剧情/混合/日常陪伴分别配置；回合与行数只是提醒，不得按行数插入争吵；强冲突走 积累—触发—应对—后果—缓冲；高信息与高情绪交替，重大选择与反转后留回应空间。
13 长线连续：维护阶段账本（时间、位置、目标、在场与知情、关系与弧光、资源、种子、承诺、未修复冲突、玩家边界）；同一误会不得反复拖延，结局前不得临时新增真凶或设定；回访读取共同经历与新状态；长篇结束前按条件回收核心问题与关键承诺。
14 认知与反转：分开记录 客观事实/实际可见/人物证词/玩家可能推断/预期情绪；反转前布置支持表面解读的线索与异常线索，给询问、调查、保留判断的窗口；玩家提前猜对要承认；逐层加深（事实→责任→动机→价值→关系），不做 A真—A假—A又真；揭晓后给新的选择与回应空间；真相不自动换来原谅或升级关系。
15 信息分级：P0 选择必需（目标、可行动范围、代价、限制、不可逆风险）必须在选择前清楚交付，不靠俚语或细微表情；P1 核心剧情与关系（揭晓、表白、拒绝、承诺、边界）优先由有资格的角色直接说出；P2 人物与情绪细节交给措辞、动作、停顿与画面；P3 氛围装饰可删或后移。一个显示单元承载一个核心信息（必要时加一个支持信息）；用户一次问了多个问题要完整回答。
16 直接对白：表白、选择、承诺、拒绝、道歉与关键解释，尽量由角色直接对玩家说，不用“他似乎想告诉你……”“你终于明白他的心意……”代替；核心句先落地（例：“I came back for you.”），画面表现难度，旁白不再解释“他很在乎你”；回避、撒谎、嘴硬要有动机，不能长期含混拖欠兑现；角色说的话不自动成为客观事实。
17 对白/画面/旁白分工：对白承担事实、态度、意愿、请求与承诺；画面承担可观察的动作、空间、视线、距离、物件与表里差异；旁白只补必要的时空与衔接。同一意义不用 对白+动作+旁白 重复三遍；动作写可见具体的（“他把你的杯子移到暖气旁”），少用“眼里闪过复杂神色”；不是每句都配微笑挑眉叹气；只调用平台支持的演出，缺资产标需求。
18 留白与情绪：留白不得遗漏选择所需的规则与风险；用具体情境和有分量的核心句调动情绪，不堆“极其、深深、无比、温柔地”；高价值情绪句后留一个动作或回应，不立刻解释或再加第二次表白；省略号、破折号不能代替张力。
19 删冗语与句子：压缩顺序 明确功能→保留事实动作态度→删重复说明与空泛起手→准确动词代替泛化修饰→拆多重从句→可演出细节交给画面→读成自然口语；保留否定、频率、时间、程度、条件、范围词（almost/still/only/again/not）；拆句保留因果、条件与情态（“可能”不能变“确定”）；短而含混时改写不再砍字。英语普通句约 5–14 词、超 20 词检查拆分（初始编辑参数）；长短交替；人称与指代清楚，多人在场时适度重复名字；不同角色保留句式差异；句长按目标语言单独处理。
20 本地化：先明确 target_locale、时代地点、角色背景、关系阶段与正式程度；地区未定用中性易懂表达，不把“海外”默认成美式英语；按含义、意图与人物声音翻译，不逐字搬中文语序、成语与网络梗；不擅自增加恋爱程度、粗口或攻击性；俚语只在角色与语境需要时用，核心规则与风险不只用俚语承载；保留 喜欢/爱、想要/承诺、可能/一定 等程度差别；维护声线卡与术语表。
21 道具与付费：道具改变线索、能力、发现时间或代价；付费可提供额外视角、独有经历或替代方案；不得凭空造证据、改写事实或替玩家决定感情；所有玩家都能免费理解核心事件与真相并获得至少一个完整有效结局；节点写清 持有使用/持有未用/未持有 三种去向。
22 自由输入与记忆：区分 表达/询问/猜测/请求/承诺/行动尝试/明确同意；合理方案只形成候选，“我已拿到证据”不直接成为事实；记忆记录来源、知情者与性质（事实/自述/推断），重复合并；现实自述与剧情身份分开；“别再提”停止调用，“不要记住”停止写入。
23 陪伴：六模块（陪伴节奏、现实与剧情边界、角色日常生活、共同活动、后续关心、稳定关系内容）；允许闲聊、安静相处、换话题；现实离线不扣关系、不违约、不催登录；关系确立后继续产出共同生活，不靠反复误会或分手维持刺激。
24 结局：guided/open/hybrid；四轴分别结算 事件/关系/人物弧光/持续状态；独立高潮至少改变高潮场景、核心问题、合作或对立人物、资源、关键行动、代价中的两项；建议 3–5 个结果族；资格 = 必要事实 + 关系阶段 + 关键行为证明 + 未修复冲突处理 + 玩家最终意愿 + 人物自主条件；每条结束路径有合法去向，拒绝恋爱不自动算失败。
25 运行时：程序裁决持久状态、资源、权益与结局，AI 只提供表达与候选效果；未提交成功不写成已发生；重试与回溯不重复扣费或发奖；对白、画面指令、旁白与编辑字段分离，玩家界面只显示实际文本与支持的演出。`;
  const play = [
    "EXPRESSION RULES (MIRU final rules §13):",
    "- Information that a choice depends on (goal, what can be done, cost, risk, irreversible consequence) must be said clearly before the choice — never only through slang, a fleeting expression or subtext.",
    "- Confessions, refusals, promises, apologies and key explanations: the character says them directly to the user. Never replace them with narration like \"he seems to want to tell you…\" or \"you finally understand how he feels\".",
    "- Dialogue carries facts, attitude, wishes and promises; visible action carries distance, gaze, objects and contradictions; narration only adds necessary time/place/transitions. Do not say the same meaning three times (line + action + narration explaining it).",
    "- Concrete visible actions (\"he moves your cup next to the heater\"), not vague ones (\"a complex look flashes in his eyes\"). Not every line needs a smile, raised brow or sigh.",
    "- No stacked intensifiers (extremely, deeply, so gently). After a weighty emotional line, give one small action or room to respond — do not explain it or add a second confession.",
    "- One core piece of information per beat; if the user asked several things, answer all of them.",
    "- Natural sentences: English mostly ~5–14 words, split anything over ~20 unless it needs the causal link; vary length; keep negation, time, degree and condition words (almost, still, only, again, not). Keep each character's own rhythm.",
    "- Speak to the target region naturally; slang only when it fits the character and moment, never for rules or risks.",
  ].join("\n");
  const research = `【本AI职责｜素材研究AI】研究可实际取得的资料、创作母题、叙事方法与互动机制，输出有出处、能供后续阶段消费的素材与故事机制卡。依据系统1规则说明素材可服务的人物吸引点、可持续展开的世界与章节问题、事件/关系/弧光、互动玩法、分支拓扑、节奏、反转与情绪兑现，以及可供对白和画面表达的具体内容；区分外部依据与本项目原创转化。不默认生成完整人物母档、剧情树、逐场正文、测试剧本或运行时裁决；素材建议不自动成为已确认设定。参考编剧书籍、访谈或互动叙事实践时只陈述实际取得的内容；回合数、幕比例、反转数量等项目参数不得伪称来自权威定律。
【硬约束】只引用实际取得的资料，source_type 仅用 verified/user/idea（不等同版权授权）。来源记录标题、作者/机构、链接或定位、取得时间、支持内容及核实状态；无法访问或证据不足标记未核实，不补写不存在的引文、数据或结论；未取得的候选放 pending_sources。记录使用权限与版权状态，可访问≠可商用；原创优先，不照搬专有设定、标志性桥段与人物关系。趋势结论说明平台、时间范围及样本局限，少量案例不能代表“大部分市场”。不伪造检索、验证、模型调用或平台能力；资料不足时给出明确标为 idea 的机制建议。
【输出契约】合法 JSON + 独立的中文审稿简报。公共字段 schema_version / story_id / setting_version / generation_scope / setting_status / assumptions / missing_inputs；主输出 source_cards / trends / originality_risks / motif_cards（可选 pending_sources）。source_cards: source_id, source_type, title, author_or_org, locator, retrieved_at, verification_status, supported_claims, rights_status, usage_limits。trends: trend_id, claim, scope, time_range, sample_basis, source_ids, confidence, limitations。originality_risks: risk_id, affected_element, related_sources, risk_reason, rights_status, original_transformation, unresolved_questions。motif_cards: motif_id, source_type, source_ids, premise, player_value, character_attraction, world_reveal, event_relation_arc_use, branch_use, emotion_twist_use, pacing_use, chapter_expansion, world_depth_use, interaction_use, dialogue_visual_use, item_or_free_paths, ending_use, boundaries, original_transformation。审稿简报：可吸纳机制、适用模式、适合展开的章节/世界/玩法、表达与本地化注意、因果/人设/来源风险、缺失输入及交接建议。`;

  /* ---------- automated check (rules §03/05/07/09/11/15–19/21) ---------- */
  const VAGUE_ZH = ["眼里闪过", "复杂的神色", "复杂的光", "深深地", "无比", "极其", "温柔地说", "似乎想告诉你", "你终于明白他的心意", "他很在乎你"];
  const VAGUE_EN = ["a complex look", "something flickered in his eyes", "deeply", "extremely", "seems to want to tell you", "you finally understand how he feels", "he cares about you so much"];
  const AUTONOMY = /(你爱上了他|你心动了|你原谅了他|你答应了他|你同意了|you fell in love|you forgive him|you've forgiven|you agree to be his)/i;
  const tx = v => typeof v === "string" ? v : v && typeof v === "object" ? (v.zh || v.en || "") : "";
  const beatsOf = c => { const b = c && c.beats; const a = Array.isArray(b) ? b : b ? (b.zh || b.en || []) : []; return Array.isArray(a) ? a : []; };
  function estimate(pack, lang) {
    const ch = (pack && pack.chapters) || [];
    let total = 0; const per = ch.map((c, i) => {
      let chars = 0, words = 0, choices = (c.choices || []).length, stops = 0;
      beatsOf(c).forEach(b => { if (!Array.isArray(b)) return; if (b[0] === "sys") { if (["line", "myline", "use", "mg", "branch", "decide"].includes(b[1])) stops++; return; } const s = String(b[2] || ""); chars += (s.match(/[぀-鿿가-힯]/g) || []).length; words += (s.match(/[A-Za-z']+/g) || []).length; });
      const read = chars / 300 + words / 200, act = choices * 0.75 + stops * 2.5, m = Math.round((read + act) * 10) / 10; total += m;
      return { chapter: i + 1, minutes_estimated: m, reading_min: Math.round(read * 10) / 10, interaction_min: Math.round(act * 10) / 10 };
    });
    return { status: "estimated", assumptions: ["中文/日韩 300 字/分钟", "英文 200 词/分钟", "每个选项 0.75 分钟", "每个互动停顿（台词/自由对话/道具/小游戏/分支）2.5 分钟", "共享章节按一条路线计，不累加互斥分支"], per_chapter: per, route_minutes: Math.round(total) };
  }
  function check(w, opts) {
    opts = opts || {}; const P = w && (w.pack || w), R = { err: [], warn: [], ok: [], info: [], estimate: null };
    const ch = (P && P.chapters) || [];
    if (!ch.length) { R.err.push("没有章节（规则 08）"); return R; }
    const longform = !!(opts.longform || (P && P.longform));
    if (longform) {
      if (ch.length < 15 || ch.length > 20) R.err.push("正式长篇全本目录必须在 15–20 章之间，现在是 " + ch.length + " 章（规则 03）");
      else R.ok.push("章节数 " + ch.length + "，在 15–20 章范围内");
    }
    const est = estimate(P); R.estimate = est;
    if (longform) { if (est.route_minutes < 1440) R.warn.push("估算单路线有效游玩约 " + est.route_minutes + " 分钟（estimated），低于 24 小时（1440 分钟）目标，需要补充有功能的经历、互动与后果，不能靠复读或无限聊天凑（规则 03）"); else R.ok.push("估算单路线约 " + est.route_minutes + " 分钟（estimated），达到 24 小时目标"); }
    else R.info.push("估算单路线约 " + est.route_minutes + " 分钟（estimated）");
    const first = beatsOf(ch[0]).filter(b => Array.isArray(b)).slice(0, 10);
    if (first.length && !first.some(b => b[0] && !["n", "sys", "me"].includes(b[0]))) R.warn.push("第 1 章前 10 句主要角色没有出场或开口：开篇要先用具体行为展示他的吸引力和对你的态度（规则 05）");
    if (first.some(b => b[0] === "sys" && b[1] === "mg")) R.warn.push("第 1 章开头就插小游戏：开篇先认识人物（规则 05/10）");
    const seen = {}; let vague = [], auto = [], longEn = 0, enLines = 0;
    ch.forEach((c, i) => {
      const bs = beatsOf(c).filter(b => Array.isArray(b));
      const cs = c.choices || [];
      if (!c.goal && !c.ask) R.warn.push("第 " + (i + 1) + " 章没有写明本章目标/核心问题（规则 09）");
      if (cs.length >= 2) {
        const sig = cs.map(x => JSON.stringify([x.set || null, x.need || null, x.love || null, tx(x.mem) || null]));
        if (new Set(sig).size === 1) R.warn.push("第 " + (i + 1) + " 章：选项后果完全相同——重要选择必须有可感知后果和后文读取点（规则 11）");
        if (cs.every(x => x.paid || x.need)) R.err.push("第 " + (i + 1) + " 章：所有选项都要付费或道具，必须保留免费有效路径（规则 21）");
      }
      if (bs.length && bs.filter(b => b[0] !== "sys").length < 8) R.warn.push("第 " + (i + 1) + " 章内容很少（" + bs.length + " 段）：章节厚度来自有因果的经历，不是只有起因和悬念（规则 09）");
      bs.forEach(b => {
        if (b[0] === "sys") return; const s = String(b[2] || ""); if (!s) return;
        const k = s.replace(/\s+/g, ""); if (k.length > 6) seen[k] = (seen[k] || 0) + 1;
        [...VAGUE_ZH, ...VAGUE_EN].forEach(v => { if (s.toLowerCase().includes(v.toLowerCase()) && vague.length < 6) vague.push("第" + (i + 1) + "章：「" + s.slice(0, 30) + "」含「" + v + "」"); });
        if (AUTONOMY.test(s) && auto.length < 4) auto.push("第" + (i + 1) + "章：「" + s.slice(0, 30) + "」");
        const wn = (s.match(/[A-Za-z']+/g) || []).length; if (wn >= 3) { enLines++; s.split(/(?<=[.!?])\s+/).forEach(x => { if ((x.match(/[A-Za-z']+/g) || []).length > 20) longEn++; }); }
      });
    });
    if (vague.length) R.warn.push("表达：出现泛化描写或旁白替角色解释心意，改成具体可见的动作或让角色直接说（规则 16/17/18）—— " + vague.join("；"));
    if (auto.length) R.err.push("替玩家决定了感情或意愿（规则 07）—— " + auto.join("；"));
    const dup = Object.entries(seen).filter(([, n]) => n > 2).slice(0, 4);
    if (dup.length) R.warn.push("同一句话重复出现 3 次以上：重复只用于回响、修复或变化（规则 13）—— " + dup.map(([s, n]) => "「" + s.slice(0, 18) + "」×" + n).join("；"));
    if (enLines >= 10 && longEn / enLines > 0.15) R.warn.push("英文长句偏多（超过 20 词的句子占 " + Math.round(longEn / enLines * 100) + "%）：普通句约 5–14 词，长句检查能否拆分（规则 19）");
    /* 调试规则 v1.0 补充检查 */
    const f10 = beatsOf(ch[0]).filter(b => Array.isArray(b) && b[0] !== "sys").slice(0, 10);
    if (f10.length >= 8 && f10.filter(b => b[0] === "n").length >= 7) R.warn.push("开篇前 10 句里旁白/背景占 7 句以上：背景分层释放，先见人、先给回应空间（调试 R07/R08/R10）");
    const ch1 = beatsOf(ch[0]).filter(b => Array.isArray(b) && b[0] !== "sys").map(b => String(b[2] || "")).join(" ");
    if (/我爱你|爱上你了|I love you|in love with you/i.test(ch1) && !(P.rel && /恋人|旧情|前任|ex|lover|married/i.test(JSON.stringify(P.rel)))) R.warn.push("第 1 章就出现深爱表白：初识不得无理由深爱，旧情需共同历史依据（调试 R09）");
    const guilt = []; ch.forEach((c, i) => beatsOf(c).forEach(b => { if (Array.isArray(b) && b[0] !== "sys" && /好几天没来|怎么不来找我|你又消失了|why didn.t you come|you disappeared again/i.test(String(b[2] || "")) && guilt.length < 3) guilt.push("第" + (i + 1) + "章：「" + String(b[2]).slice(0, 24) + "」"); }));
    if (guilt.length) R.warn.push("角色在责备玩家现实离线：现实离线不惩罚、不催登录（调试 R47）—— " + guilt.join("；"));
    const twists = ch.reduce((n, c) => n + beatsOf(c).filter(b => Array.isArray(b) && b[0] === "sys" && b[1] === "event").length, 0);
    if ((P.story_mode === "日常陪伴" || P.story_mode === "daily") && twists > ch.length) R.warn.push("日常陪伴模式事件/反转过密：日常不靠持续危机维系（调试 R28/R36）");
    if (P.endings) { const ek = Object.keys(P.endings); if (ek.length && ek.length < 2) R.warn.push("结局只有 " + ek.length + " 个：建议 3–5 个事件/高潮结果族，并分别结算四轴（规则 24）"); }
    if (!R.err.length && !R.warn.length) R.ok.push("自动检查未发现问题（自动检查不能替代编剧人工审阅）");
    return R;
  }
  const skill = (typeof MIRU_RULES_SKILL !== "undefined" ? MIRU_RULES_SKILL : "");
  const skillCore = skill ? skill.split("\n").find(l => l.startsWith("总纲")) || "" : "";
  const debug = [["开篇背景太多、人物不吸引", "R06—R10"], ["角色像统一客服、反应套话", "R11—R17"], ["对话很多却没有变化", "R25—R28"], ["选项看似很多、后文一样", "R21—R24"], ["分支越写越大、无法收束", "R18—R24"], ["反转很多却没有情绪", "R29—R37"], ["陪伴变成连续吵架或强推剧情", "R27—R28、R36、R47—R50"], ["数值满了仍突然BE或自动恋爱", "R14—R15、R52—R56"], ["道具只是万能钥匙或付费纠错", "R38—R40"], ["自由输入改写世界或角色全知", "R29、R41—R46"]];
  const genFull = gen + (skillCore ? "\n\n【生成 Skill 调试规则 v1.0 · 总纲】\n" + skillCore.replace(/^总纲：/, "") : "");
  return { version: version + " + 调试规则 v1.0", gen: genFull, genBase: gen, play, research, check, estimate, skill, debug, full: (typeof MIRU_RULES_FULL !== "undefined" ? MIRU_RULES_FULL : "") };
})();
if (typeof module !== "undefined" && module.exports) module.exports = MIRU_RULES;
