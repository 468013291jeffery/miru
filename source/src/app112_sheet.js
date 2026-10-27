/* ================= 弹层里的「块」登记表（2026-10-27）=================
   为什么不再用「包一层」：`menuSheet` 被 7 个文件各包一层，而它们做的事只有一件 ——
   往 `.sheet .stack` 里塞一块 HTML。包一层看不出「一共几块、什么顺序」，注册表能。

   与 `app111_msgkind.js`（渲染链）的**关键差别**：那边必须给 `next()` 语义（认领 / 后处理 /
   改入参三类各自要答不同问题）；这边**一个都不需要** —— 没有哪一层是"认领整张弹层"，
   它们全是往同一个容器里追加。所以这里只存两件事：**顺序**与**插在前面还是后面**。

   ## 用法（在各自的源文件里）
       SHEET.add('menu', 'app48_clean.js', 'bottom', function(){ return '<button …>' });
       SHEET.add('menu', 'app45_rel.js',  'top',    function(){ … return '…' });

   ## 顺序怎么保住的（这条最容易搬错）
   今天是「包一层」：每层在 `_inner()` **返回之后**才插，所以最后的 DOM 顺序是
   **加载顺序**决定的 —— 而 `afterbegin` 那几层，后加载的会插到更前面。
   ⇒ 注册表按**加载顺序**登记、`render()` 也按登记顺序逐块插，结果与今天逐字节相同。
   ⚠️ 谁要改成"按视觉顺序登记"，菜单会整个反过来。

   ## 读数
       __sheet()     每个弹层：有哪几块、各自插在前面还是后面
       SHEET.stats() 渲染了几次、每个块命中几回（用来发现"登记了但从不插"的死块）

   闸：`tools/sheet-snapshot.mjs --check`（7 个弹层逐字节 + 每条必须有内容）。
   ================================================================== */
(function () {
  'use strict';
  const M = { v: 1, order: {}, hits: {}, renders: {} };

  M.add = function (sheetName, blockName, at, fn) {
    if (typeof fn !== 'function') return false;
    const k = String(sheetName);
    (M.order[k] = M.order[k] || []).push({
      name: String(blockName || '?'),
      at: at === 'top' ? 'top' : 'bottom',
      fn: fn, hit: 0, err: 0
    });
    return true;
  };

  M.render = function (sheetName, stack) {
    const list = M.order[sheetName] || [];
    if (!stack || !list.length) return 0;
    M.renders[sheetName] = (M.renders[sheetName] || 0) + 1;
    let n = 0;
    for (const b of list) {
      let h = '';
      /* 块抛错不许打断后面的块，也不许静默：记次数 + 走 console.error（errlog 会接住）*/
      try { h = b.fn() } catch (e) {
        b.err++;
        try { console.error('[sheet] ' + b.name + ' 抛错：' + ((e && (e.code || e.message)) || e)); } catch (_) { }
        continue;
      }
      if (typeof h === 'string' && h) {
        stack.insertAdjacentHTML(b.at === 'top' ? 'afterbegin' : 'beforeend', h);
        b.hit++; n++;
      }
    }
    return n;
  };

  M.stats = function () {
    const o = {};
    for (const k of Object.keys(M.order)) {
      o[k] = M.order[k].map(b => ({ 块: b.name, 位置: b.at, 插入: b.hit, 抛错: b.err }));
    }
    return { 渲染: M.renders, 块: o };
  };

  window.SHEET = M;
  window.__sheet = function () {
    const o = {};
    for (const k of Object.keys(M.order)) o[k] = M.order[k].map(b => b.name + '(' + b.at + ')');
    return o;
  };
})();
