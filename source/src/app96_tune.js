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
      transcript: 20,       // STORY SO FAR 带多少条（普通）
      transcriptPlus: 60    // 同上（Plus）
    },
    love: {
      deltaCap: 12,         // 单次好感变动上限
      min: 0,               // 好感下限（关系冷却那条路会传 -60 覆盖）
      max: 100,             // 好感上限
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
