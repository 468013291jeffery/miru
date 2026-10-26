/* ================= 可调参数（外置滑钮）=================
   为什么要它：这些数字原来散在 6 个文件里当字面量（价格、单位、章节数、窗口长度、
   关系阶段门槛、每日好感上限、单次好感步长…）。改一个要翻代码、改完要重新构建，
   而且没人知道"一共有几个旋钮"。
   现在：默认值全在这里，**可以在 tune.js 里覆盖、不用重建**：

     // tune.js（部署时手改，刷新即生效）
     window.MIRU_TUNE_OVERRIDE = {
       pay:  { packPrice: 60, endingNeed: 5 },
       love: { deltaCap: 20 },
       chat: { transcript: 30 }
     };

   规矩：
   1. 新增可调数字 → 先加进这里的 DEFAULTS，再在调用处读 MIRU_TUNE.xxx；
   2. 读取方一律写 MIRU_TUNE.<section>.<key>，不写字面量（tools/tune-selftest.mjs 会盯着）；
   3. 每一格在 TUNING.md 里有一句"改它会影响什么"。 */
var MIRU_TUNE = (function () {
  var DEFAULTS = {
    pay: {
      packPrice: 50,        // 解锁整包要多少钻石
      topupUnits: 100,      // 一次充值的单位数
      topupCost: 24,        // 一次充值要多少钻石
      trialUnits: 24,       // 试用单位
      plusUnits: 250,       // MIRU+ 每月单位
      packUnits: 120,       // 整包单位
      freeChapters: 2,      // 免费章节数（第 3 章起收费）
      endingNeed: 4         // 到达结局所需的 A 选项次数
    },
    ai: {
      costNormal: 1,        // 普通档每轮消耗的单位
      costDeep: 3           // 深度档每轮消耗的单位
    },
    chat: {
      transcript: 50,       // STORY SO FAR 带多少条（普通）——2026-10-25 Ann 拍：20 条只有 4.4 轮，太薄
      transcriptPlus: 80,   // 同上（Plus）
      publicWants: true,      // 每个在场角色的卡上都给他「自己想要什么」（别人不知道）——有动机才推得动场景
      characterMeta: false,   // true = 旧文案（角色知道第几章/本章目标/下一步要选什么）；false = 角色只知道此刻与已发生
      chapterAdvance: true,  // 章内允许推进时间/场景（不替玩家做官方选择）；false = 旧行为，每轮钉在同一幕
      saidKeep: 50,          // 玩家说过的话留多少条（含点建议发的）
      typedKeep: 120,        // **亲手打的**留多少条（系统候选句不算；这些最珍贵，留更多）
      partMergeMax: 5,      // 同一段文字合并成几块为止（原来是字面量 5）
      privateCards: 1,
      planGate: true,         // 计划层入口：只观测「这一场本来会不会需要续写」，不改写这一场
      streamPreview: true,     // 流式预览：首字 ~2s 就到，先显示出来，别让玩家干等整段
      replyGuard: true       // 台词守门：说了本章不该知道的事 ⇒ 重写一次 ⇒ 仍不行换保守句       // CAST 里带私密面（secret/twist）的角色数：1=只有这一拍上场的那个；调大即放开
    },
    tools: {
      // 每个工具本场可用几次（0 = 不限，即保持旧行为）与冷却毫秒（0 = 无冷却）
      giftPerScene: 0, datePerScene: 0, truthPerScene: 0, cooldownMs: 0,
      ageGate: true         // 未确认成年 ⇒ heat 上限压到 slow，并在首启问一次（2026-10-25 Ann 拍：开，等于免责声明）
    },
    love: {
      deltaCap: 12,         // 单次好感变动上限
      min: 0,               // 好感下限（关系冷却那条路会传 -60 覆盖）
      max: 100,             // 好感上限
      cooldownMin: -60,     // 关系冷却那次写入的下限（原来是字面量 -60）
      stageMin: [0, 20, 40, 60, 80]   // 关系阶段门槛（closeness → stage）
    },
    affinity: {
      cap: 15,              // 每天"额外好感"的上限
      mind: [1, 2, 3, 5, 5],        // 各档心智/能力
      gems: [0, 5, 10, 15, 20]      // 各档钻石
    },
    report: {
      omniscienceThreshold: 0.10    // 「缺口大于这个比例才值得做 B 方案」的分析阈值
    }
  };

  var O = (typeof window !== "undefined" && window.MIRU_TUNE_OVERRIDE) || {};
  var out = {};
  Object.keys(DEFAULTS).forEach(function (sec) {
    out[sec] = Object.assign({}, DEFAULTS[sec]);
    if (O[sec] && typeof O[sec] === "object") {
      Object.keys(O[sec]).forEach(function (k) {
        if (k in DEFAULTS[sec]) out[sec][k] = O[sec][k];   // 只接受已声明的键，避免拼错静默生效
      });
    }
  });
  out._defaults = DEFAULTS;      // 核查用：现值与默认值的差 = 这一版被改过什么
  out._overridden = O;
  return out;
})();
