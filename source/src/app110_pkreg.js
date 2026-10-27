/* ================= 剧本指令：26 层包装 → 一张表（2026-10-27）=================
   Ann：「我感觉没有太多问题，你动吧」。

   ## 之前
       const _pkDirX = pkDirective;
       pkDirective = function(th, b){ …认领某类型…; return _pkDirX(th, b) };
   26 层这样叠着 ⇒ 谁先生效由**文件名加载顺序**决定；同类型两个实现时另一个永远不跑且无报错。

   ## 现在
   每层改成往里注册一行，形状**完全不变**（仍然持有"下一层"）：
       PKREG.add('app17_custom.js', function(th, b, next){
         if(Array.isArray(b) && b[0]==="sys" && b[1]==="event"){ …; return true }
         return next(th, b);
       });
   分发器按**注册顺序**把 26 层串成一条链（后注册的在外层）—— 与原来"后加载的在外层"逐字等价。

   ## 为什么这样就够
   原来"谁赢"写在**文件名**里；现在写在**数组下标**里。装配只有一处（`install()`），
   所以顺序是**可读的一行**，而不是需要推演加载顺序才能知道的结果。

   ## 不变量
   · 每层仍然拿到 `next`（语义不变：它可以选择继续往下、也可以吃掉）
   · 一层抛异常不再连累整条链：捕获后当作"没消费"，继续往下（原来会直接崩）
================================================================================== */
(function () {
  'use strict';

  const R = { v: 1, items: [], runs: 0, consumed: 0, byType: {}, errors: 0, installed: false };

  R.add = function (name, fn) {
    if (typeof fn !== 'function') return false;
    R.items.push({ name: String(name || '?'), fn: fn });
    return true;
  };

  R.install = function () {
    const chain = R.items.slice();
    /* 从内往外装配：chain[0] 是最早注册的（最内层），最后注册的最外层 */
    let base = function () { return false };
    for (let i = 0; i < chain.length; i++) {
      const fn = chain[i].fn, inner = base, nm = chain[i].name;
      base = function (th, b) {
        R.runs++;
        const rec = { name: nm };
        try {
          const r = fn(th, b, function (t2, b2) { return inner(t2, b2) });
          if (r === true) { R.consumed++; const ty = (Array.isArray(b) && b[1]) || '?'; R.byType[ty] = nm }
          return r;
        } catch (e) {
          R.errors++;
          try { console.warn('[pkreg] 层抛错（已隔离，继续往下）: ' + nm, e && e.message) } catch (_) {}
          return inner(th, b);
        }
      };
    }
    window.pkDirective = base;
    R.installed = true;
    return true;
  };

  window.PKREG = R;
  window.__pkreg = function (detail) {
    const s = { 注册层: R.items.length, 分发次数: R.runs, 被消费: R.consumed, 层内抛错: R.errors, 已安装: !!R.installed };
    if (!detail) return s;
    return { 汇总: s, 类型赢家: R.byType, 层: R.items.map(x => x.name) };
  };
})();
