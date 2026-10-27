/* ================= 运行时健康汇报 v0.1（2026-10-27）=================
   来源：Mythica `CLAUDE.md` 编码习惯第 13 条 ——
     「唯一咽喉配三件套：**硬门禁** + **运行时防御** + **健康汇报**（定期自动落盘，grep 即可发现）」

   我们已有前两件（各模块的闸 + 各入口的运行时防御），缺第三件：
   所有计数器只活在内存里（`__turn()` / `__save()` / `__ui()` / `__pkst()`），
   **不看控制台就等于没有**；而这些数恰恰是在「她玩的时候」才会涨的。

   这一版：每 30 秒（以及页面隐藏/离开时）把四个入口的计数拍平成一条 JSON，
     · 写 `localStorage["miru_health"]`（她随手导出存档就带走）
     · 本地开发时（127.0.0.1 / localhost）POST 到 `/__health` 落盘 → `.browser-health.json`
   读法：`node tools/read-health.mjs`

   刻意没做：不采集任何剧情内容 / 文本，只采计数与错误原因。
================================================================================== */
(function () {
  'use strict';
  const H = { v: 1, started: Date.now(), ticks: 0, last: null };

  function snap() {
    const out = {
      v: 1,
      at: new Date().toISOString(),
      build: (typeof window.MIRU_BUILD === 'string') ? window.MIRU_BUILD : '',
      uptimeMs: Date.now() - H.started,
      ticks: ++H.ticks
    };
    try { if (window.TURN && window.TURN.state) { const s = window.__turn(); out.turn = { 状态: s.现在, 持有者: s.持有者, 已持ms: s.已持ms, 回合: s.累计回合, 冲突: s.冲突次数 } } } catch (_) {}
    try { if (window.SAVE && window.__save) { const s = window.__save(); out.save = { 次数: s.次数, 平均ms: s.平均ms, 最慢ms: s.最慢ms, 空写: s.空写 } } } catch (_) {}
    try { if (window.UI && window.__ui) { const s = window.__ui(); out.ui = { 渲染: s.渲染次数, 钩子: s.hook数, 失败: s.总失败 } } } catch (_) {}
    try { if (window.PKST && window.__pkst) { const s = window.__pkst(); out.pkst = { 转移: s.总转移, 非法: s.非法次数, 各状态: s.各状态 } } } catch (_) {}
    try { if (window.__uiErr) out.uiErr = String(window.__uiErr) } catch (_) {}
    return out;
  }

  function flush(why) {
    let s;
    try { s = snap() } catch (_) { return }
    H.last = s;
    try { localStorage.setItem('miru_health', JSON.stringify(s)) } catch (_) {}
    // 本地开发：直接落盘，省掉她手动导出的那一步
    try {
      const h = location.hostname;
      if (h === '127.0.0.1' || h === 'localhost') {
        fetch('/__health', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(s), keepalive: true }).catch(function () {});
      }
    } catch (_) {}
  }

  window.HEALTH = { snap: snap, flush: flush, get last() { return H.last } };

  setInterval(function () { flush('tick') }, 30000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush('hidden') });
  window.addEventListener('pagehide', function () { flush('pagehide') });
  setTimeout(function () { flush('boot') }, 4000);   // 启动后先拍一张，证明这条通道活着
})();
