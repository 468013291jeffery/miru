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
/* 2026-10-27 Ann：「速度还可以慢 2 秒」。
   `chat.beatMs` 是「一句亮出来到下一句亮出来」的间隔（默认 700）。
   ⇒ 700 → 2700，等于每句多停 2 秒。改这里**不用重建**，刷新即生效。 */
window.MIRU_TUNE_OVERRIDE.chat = Object.assign({ beatMs: 2700 }, window.MIRU_TUNE_OVERRIDE.chat || {});

/* ---- 本地真 AI（2026-10-27 加）------------------------------------------------
   本地页面原来**没有 AI**：既没有 miru.lc.key，hostname 也不是 *.vercel.app，
   于是 LC_PROXY 为空 ⇒ 每一轮回复都是 fallback 模板（模板会复读你最后几个字）。
   本地开发服 tools/serve.mjs 现在把 /api/longcat 转发到 DeepSeek，这里把客户端指过去。
   只在 127.0.0.1 / localhost 生效；线上（*.vercel.app、github.io）一行都不碰。 */
(function(){
  try{
    if(window.MIRU_PROXY) return;
    const h=location.hostname;
    if(h==="127.0.0.1"||h==="localhost"){ window.MIRU_PROXY="/api/longcat"; window.MIRU_ACCOUNT=false; }
  }catch(_){}
})();
