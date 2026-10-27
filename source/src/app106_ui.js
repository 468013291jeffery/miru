/* ================= 渲染入口 v0.1（2026-10-27 · 第七件）=================
   Ann：「UI 先不动了。UI 出问题，纯粹也是因为我们没有做整合、没有做工程优化、没有做入口。」

   对，而且有读数：`renderChat` 被 **24 处**猴补丁包过（`tools/patch-registry.mjs`），
   每一处都是 `const _x=renderChat; renderChat=function(){ … _x.apply(this,arguments) … }`。
   后果不是「乱」，是**任何一个包装层抛异常，后面所有层都不再执行** ——
   于是 UI 会「忽然少一块」，而且控制台只有一条没人看的错。

   ## 这一版立什么
     UI.add(name, fn)     注册一个「渲染后要做的事」，带名字
     UI.render(th)        唯一入口：净化 → 渲染 → 逐个跑 hook（**每个 hook 单独 try/catch**）
     __ui()               读数：注册了哪些 hook、各自失败几次、最近一次错误的原因

   ## 铁律（写进代码，不靠自觉）
   **一个 hook 抛异常，不许影响其它 hook，也不许影响主渲染。**

   ## 没做
   没有把 24 层包装一次性搬成 hook（那是 24 次改动 × 24 次风险）。
   新写的渲染后逻辑一律走 UI.add；老的包装逐层搬，搬一层删一层。
================================================================================== */
(function () {
  'use strict';
  const U = { v: 1, hooks: [], errors: [], runs: 0, lastMs: 0 };

  U.add = function (name, fn) {
    if (typeof fn !== 'function') return false;
    const nm = String(name || ('hook' + (U.hooks.length + 1)));
    const hit = U.hooks.find(h => h.name === nm);
    if (hit) { hit.fn = fn; return true }          // 同名覆盖：热更新不重复注册
    U.hooks.push({ name: nm, fn: fn, n: 0, errs: 0 });
    return true;
  };

  U.remove = function (name) {
    const i = U.hooks.findIndex(h => h.name === name);
    if (i >= 0) { U.hooks.splice(i, 1); return true }
    return false;
  };

  U.render = function (th) {
    const t0 = (typeof performance !== 'undefined' ? performance.now() : Date.now());
    U.runs++;
    /* ① 净化（文本的唯一闸，见 sanitizeMsgs） */
    try { if (typeof sanitizeMsgs === 'function') sanitizeMsgs(th) } catch (_) {}
    /* ② 主渲染 —— 它自己失败也要能被看见，而不是整页白 */
    try { if (typeof renderChat === 'function') renderChat() }
    catch (e) { pushErr('renderChat', e) }
    /* ③ 逐个 hook：一个炸不连累别人 */
    for (const h of U.hooks) {
      try { h.fn(th); h.n++ }
      catch (e) { h.errs++; pushErr(h.name, e) }
    }
    U.lastMs = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0;
    return U.lastMs;
  };

  function pushErr(who, e) {
    U.errors.push({ at: Date.now(), hook: who, msg: String((e && (e.message || e.code)) || e).slice(0, 200) });
    if (U.errors.length > 50) U.errors.shift();
    try { console.warn('[ui] ' + who + ' 抛错（已隔离）:', (e && e.message) || e) } catch (_) {}
  }

  window.UI = U;
  window.__ui = function (detail) {
    const sum = {
      渲染次数: U.runs, 上次ms: Math.round(U.lastMs),
      hook数: U.hooks.length, 总失败: U.errors.length
    };
    if (!detail) return sum;
    return {
      汇总: sum,
      钩子: U.hooks.map(h => ({ 名字: h.name, 执行: h.n, 失败: h.errs })),
      最近错误: U.errors.slice(-10)
    };
  };
})();
