/* ================= 《第八誓约》M108 运行时（2026-11-10）=================
   终章（第 32 章）的选择只是「后日谈怎么过」，三个选项都应该开放，
   所以标了 ⟦SET|m108⟧ 的存档不走通用的「最后一章 A 要攒够 A 选项」规则。
   真正的结局在第 32 章开头按第 23 章的心意（heart_*）和第 31 章的路线（route_*）播放。 */
(function () {
  "use strict";
  const isM108 = th => !!(th && th.pk && th.pk.flags && th.pk.flags.m108);
  if (typeof EN === "function") { const need = EN; EN = function (th) { return isM108(th) ? 0 : need.apply(this, arguments); }; }
})();
