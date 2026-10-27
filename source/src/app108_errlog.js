/* ================= 错误日志 v0.1（2026-10-27）=================
   Ann：「把 error log 做上，加上 2m 淘汰。」

   在此之前我们只有两样东西：
     · `soft()` —— **主动**吞掉的失败（可数、可归因）
     · `.browser-health.json` —— 周期性计数快照

   缺的是**没人接的**那些：`window.onerror` / `unhandledrejection` / `console.error`。
   它们现在只出现在控制台里，而她不会开控制台。

   这一版：
     · 三个来源都收（onerror / unhandledrejection / console.error 转发）
     · **2 分钟淘汰**：每次写入前丢掉超过 ERRLOG_TTL 的条目（滚动窗口），并限总条数
     · 本地开发（127.0.0.1/localhost）POST `/__errlog` 落盘 → `.browser-errlog.json`
     · 同时写 `localStorage["miru_errlog"]`，导存档时能带走
     · `__errlog()` 读；`__errlog(true)` 看明细

   刻意没做：不采集任何剧情文本；只存 message / 来源位置 / 时间 / 类型。
================================================================================== */
(function () {
  'use strict';

  const ERRLOG_TTL = 2 * 60 * 1000;   // ←「2m 淘汰」：超过 2 分钟的条目在每次写入时清掉
  const MAX = 200;                    // 再兜一个条数上限，防爆
  const L = { items: [], dropped: 0, started: Date.now() };

  function prune() {
    const cut = Date.now() - ERRLOG_TTL;
    const before = L.items.length;
    L.items = L.items.filter(x => x.at >= cut);
    L.dropped += before - L.items.length;
    if (L.items.length > MAX) L.items = L.items.slice(-MAX);
  }

  function push(kind, msg, extra) {
    try {
      L.items.push(Object.assign({ at: Date.now(), kind: String(kind), msg: String(msg == null ? '' : msg).slice(0, 400) }, extra || {}));
      prune();
      flush();
    } catch (_) {}
  }

  function snapshot() {
    prune();
    return { v: 1, at: new Date().toISOString(), ttlMs: ERRLOG_TTL, dropped: L.dropped, n: L.items.length, items: L.items };
  }

  let pending = false;
  function flush() {
    if (pending) return;
    pending = true;
    setTimeout(function () {
      pending = false;
      let s;
      try { s = snapshot() } catch (_) { return }
      try { localStorage.setItem('miru_errlog', JSON.stringify(s)) } catch (_) {}
      try {
        const h = location.hostname;
        if (h === '127.0.0.1' || h === 'localhost') {
          fetch('/__errlog', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(s), keepalive: true }).catch(function () {});
        }
      } catch (_) {}
    }, 800);   // 合并连续错误，避免每次都发请求
  }

  /* ① 未捕获的异常 */
  window.addEventListener('error', function (e) {
    const t = e && e.target;
    if (t && (t.tagName === 'IMG' || t.tagName === 'VIDEO' || t.tagName === 'AUDIO' || t.tagName === 'SCRIPT')) {
      push('resource', (t.tagName || '?') + ' 加载失败: ' + (t.src || t.href || ''));
      return;
    }
    push('error', (e && e.message) || 'unknown', { src: (e && e.filename) || '', line: (e && e.lineno) || 0, col: (e && e.colno) || 0 });
  }, true);

  /* ② 未处理的 Promise 拒绝 */
  window.addEventListener('unhandledrejection', function (e) {
    const r = e && e.reason;
    push('rejection', (r && (r.code || r.message)) || String(r));
  });

  /* ③ console.error 转发（很多老代码只走这一条） */
  try {
    const orig = console.error.bind(console);
    console.error = function () {
      try {
        const parts = [];
        for (let i = 0; i < arguments.length; i++) {
          const a = arguments[i];
          parts.push(a && a.message ? a.message : String(a));
        }
        push('console', parts.join(' ').slice(0, 400));
      } catch (_) {}
      return orig.apply(console, arguments);
    };
  } catch (_) {}

  window.ERRLOG = { push: push, snapshot: snapshot, flush: flush, TTL: ERRLOG_TTL };
  /* 心跳：启动后先落一次盘（哪怕零错误）。
     否则「零错误」和「日志器根本没工作」在磁盘上完全同形 —— 今晚已经栽过三次的坑。 */
  setTimeout(function () { flush() }, 3000);
  /* 调试/自检用：能读写条目列表（自检要能塞「2 分钟前」的假条目） */
  try {
    Object.defineProperty(window.ERRLOG, 'items', {
      get: function () { return L.items },
      set: function (v) { L.items = Array.isArray(v) ? v : [] }
    });
  } catch (_) {}

  window.__errlog = function (detail) {
    const s = snapshot();
    const sum = { 条数: s.n, 保留ms: s.ttlMs, 已淘汰: s.dropped };
    if (!detail) return sum;
    return { 汇总: sum, 条目: s.items.slice(-30) };
  };
})();
