/* ================= 剧本内容：一道加载缝（第 1 步：立接口 + 哨兵）=================
   2026-10-29 · 为什么需要它（Ann 问的「解耦充分吗」）：

   现状：剧情数据（`wd(wid).pack`）被打进单文件，**134 处直接读**，散在 20 多个文件里，
   而所有代码都**默认它已经在内存里**。所以那不是「加载接口」，只是一张查表。

   要把它拆成按世界懒加载（首屏 9.8 MB → 约 4.9 MB），必须先回答一个问题：
   **谁会在「数据还没到」的时候去读？** 答不上来就拆，只会得到偶发白屏。

   第 1 步只做两件事，**行为零变化**：
     ① 立三个唯一入口：`need(wid)` / `prefetch(wid)` / `loaded(wid)`；
     ② 在「进入某个世界」的必经点上调用 `need()`，没命中就**记一条现场**（带调用栈）。
   验收判据：**`S._dataGap` 为空** 且 37 部逐一能进、行为与之前一致。为空才允许真拆。

   ⚠️ 本文件里**没有一个空 catch**：仓库的 `empty-catch-check` 会把它判红，理由正当
      （空 catch 把硬错误变成无操作）。所有兜底都经 `note()` 留痕，进 `S._dataErr`。
   ======================================================================= */
(function () {
  const M = (window.MIRU = window.MIRU || {});
  if (M.data && M.data.v === 1) return;

  const errs = [];

  /** 兜底留痕：任何被吞掉的异常都进这里（同时进 S._dataErr，导出存档可见）。 */
  function note(where, e) {
    const rec = { t: Date.now(), where: String(where || ""), msg: String((e && e.message) || e || "").slice(0, 120) };
    errs.push(rec);
    if (errs.length > 30) errs.shift();
    try {
      if (typeof S !== "undefined") {
        S._dataErr = S._dataErr || [];
        S._dataErr.push(rec);
        if (S._dataErr.length > 30) S._dataErr.shift();
      }
    } catch (inner) {
      // S 还没起来时只留在内存里；这里也留一行，避免空 catch
      errs.push({ t: Date.now(), where: "note:S", msg: String((inner && inner.message) || inner).slice(0, 80) });
    }
  }

  function worldOf(wid) {
    try { return (typeof wd === "function") ? wd(wid) : null } catch (e) { note("worldOf", e); return null }
  }

  /** 这一部的内容现在就在内存里吗？（判据：有 pack 且有 chapters 数组） */
  function loaded(wid) {
    const w = worldOf(wid);
    return !!(w && w.pack && w.pack.chapters && w.pack.chapters.length);
  }

  /** 进入某个世界之前调它。第 1 步：数据全量 ⇒ 立刻 resolve(true)；
      没命中只记录，**不阻塞**（阻塞要等第 2 步真去取时再启用）。 */
  function need(wid) {
    if (loaded(wid)) return Promise.resolve(true);
    const rec = { t: Date.now(), wid: String(wid || ""), where: "" };
    try { rec.where = String((new Error()).stack || "").split("\n").slice(2, 4).join(" | ").slice(0, 160) } catch (e) { note("stack", e) }
    try {
      if (typeof S !== "undefined") {
        S._dataGap = S._dataGap || [];
        if (S._dataGap.length < 30) S._dataGap.push(rec);
      }
    } catch (e) { note("gap-record", e) }
    return Promise.resolve(false);
  }

  /** 第 2 步会用：玩这一部时顺手把下一部取下来。现在什么都不做。 */
  function prefetch(wid) { return Promise.resolve(!!wid) }

  function status() {
    let gaps = 0;
    try { if (typeof S !== "undefined" && S._dataGap) gaps = S._dataGap.length } catch (e) { note("status", e) }
    return { v: 1, gaps: gaps, errs: errs.length, ready: true };
  }

  M.data = { v: 1, need: need, prefetch: prefetch, loaded: loaded, status: status, note: note };
})();
