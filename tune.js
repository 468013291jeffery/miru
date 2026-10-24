/* ---- MIRU 可调参数（外置滑钮）-----------------------------------------
   改这里**不用重新构建**：保存后刷新页面就生效。只写你想改的键，其余保持默认。
   拼错的键会被忽略（不会静默生效）。每一格的含义与风险见 TUNING.md。
   取消注释就是改用它：
   window.MIRU_TUNE_OVERRIDE = {
     pay:  { packPrice: 60, endingNeed: 5 },
     ai:   { costDeep: 4 },
     chat: { transcript: 30 },
     love: { deltaCap: 20 },
     affinity: { cap: 20 },
     report: { omniscienceThreshold: 0.15 }
   };
------------------------------------------------------------------------ */
window.MIRU_TUNE_OVERRIDE = window.MIRU_TUNE_OVERRIDE || {};