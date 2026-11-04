/* ================= 安卓 App（Google Play）专用：Play 内购 + 隐藏成人作品（2026-11-05）=================
   安卓 App 是一个「可信网页壳」（TWA）：打开的就是线上的 miru.plus，所以网站一更新，App 里也就是新版（自动更新）。
   App 启动地址带 ?src=twa（见 android/ 工程），这里认出来后：
     1 · 充值：点钻石包 → 走 Google Play 结算（Digital Goods API + Payment Request），付完把 purchaseToken 交给
         /api/wallet {op:'play'}，服务器向 Google 验单、发钻、消耗；余额以服务器为准。网页版不受影响。
     2 · 成人作品：Google Play 不允许露骨内容 —— App 里作品列表把 adult 的作品过滤掉（网页版照常）。
   商品 ID（Play Console 里要建同名的「一次性商品 · 消耗型」）：gems_5 / gems_16 / gems_28 / gems_60 / gems_125 / gems_330 / gems_700 */
(function () {
  "use strict";
  const PLAY_METHOD = "https://play.google.com/billing";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  let twa = false;
  try {
    const q = new URLSearchParams(location.search);
    if (q.get("src") === "twa" || String(document.referrer || "").indexOf("android-app://") === 0) localStorage.setItem("miru_twa", "1");
    twa = localStorage.getItem("miru_twa") === "1";
  } catch (e) { console.warn("[play] detect", e); }
  window.MIRU_TWA = twa;
  if (!twa) return;
  document.documentElement.classList.add("twa127");

  /* ---------- 2 · 作品列表里去掉成人作品 ---------- */
  const _fetch = window.fetch;
  window.fetch = async function (input, init) {
    const res = await _fetch.apply(this, arguments);
    try {
      const u = String((input && input.url) || input || "");
      if (u.indexOf("/api/works") < 0 || /[?&]id=/.test(u) || !res.ok) return res;
      const j = await res.clone().json();
      const strip = a => Array.isArray(a) ? a.filter(w => !(w && (w.adult === true || (w.meta && w.meta.adult === true)))) : a;
      let changed = false;
      if (Array.isArray(j)) { const k = strip(j); changed = k.length !== j.length; if (changed) return new Response(JSON.stringify(k), { status: res.status, headers: res.headers }); }
      ["rows", "works", "items"].forEach(key => { if (Array.isArray(j[key])) { const k = strip(j[key]); if (k.length !== j[key].length) { j[key] = k; changed = true; } } });
      return changed ? new Response(JSON.stringify(j), { status: res.status, headers: res.headers }) : res;
    } catch (e) { return res; }
  };

  /* ---------- 1 · Play 内购 ---------- */
  let svc = null, prices = {};
  async function service() {
    if (svc) return svc;
    if (!("getDigitalGoodsService" in window)) throw new Error("no-dgs");
    svc = await window.getDigitalGoodsService(PLAY_METHOD);
    if (!svc) throw new Error("no-dgs");
    return svc;
  }
  const SKUS = ["gems_5", "gems_16", "gems_28", "gems_60", "gems_125", "gems_330", "gems_700"];
  async function loadPrices() {
    try {
      const s = await service(); const d = await s.getDetails(SKUS);
      (d || []).forEach(x => { const p = x.price || {}; try { prices[x.itemId] = new Intl.NumberFormat(undefined, { style: "currency", currency: p.currency }).format(+p.value); } catch (_) { prices[x.itemId] = p.currency + " " + p.value; } });
      showPrices();
    } catch (e) { console.warn("[play] prices", e); }
  }
  function showPrices() {
    document.querySelectorAll(".packs84 [data-buy]").forEach(b => { const p = prices["gems_" + b.dataset.buy]; const sp = b.querySelector("span"); if (p && sp) sp.textContent = p; });
  }
  new MutationObserver(() => { if (document.querySelector(".packs84 [data-buy]")) showPrices(); }).observe(document.body, { childList: true, subtree: true });
  setTimeout(loadPrices, 1500);

  let busy = false;
  async function buy(sku) {
    if (busy) return; busy = true;
    try {
      await service();
      const req = new PaymentRequest([{ supportedMethods: PLAY_METHOD, data: { sku: sku } }], { total: { label: "Total", amount: { currency: "USD", value: "0" } } });
      const resp = await req.show();
      const token = resp && resp.details && resp.details.purchaseToken;
      if (!token) { await resp.complete("fail"); throw new Error("no-token"); }
      const r = await capi("/wallet", { json: { op: "play", sku: sku, token: token } });
      await resp.complete(r.ok ? "success" : "fail");
      if (!r.ok) {
        /* 没验上的单留给下次打开时补发（Google 那边不会丢，只要没消耗就还在） */
        keepPending(sku, token);
        toast(zh() ? "付款已收到，到账确认中，稍后会自动补上" : "Payment received — confirming, your diamonds will arrive shortly");
        return;
      }
      if (typeof r.j.gems === "number") { S.keys = r.j.gems; S.firstBuy = true; if (typeof save === "function") save(); if (typeof keysChip === "function") keysChip(); }
      if (typeof closeSheet === "function") closeSheet();
      toast((zh() ? "充值成功，现在有 💎 " : "Top-up done — you now have 💎 ") + (typeof r.j.gems === "number" ? r.j.gems : S.keys));
      try { if (typeof track === "function") track("play_purchase", { sku: sku, test: !!r.j.test }); } catch (e2) { console.debug("[play]", e2); }
      if (typeof refreshAfterPay === "function") refreshAfterPay();
    } catch (e) {
      const m = String((e && e.name) || "") + " " + String((e && e.message) || e);
      if (/AbortError|cancel/i.test(m)) { /* 玩家自己取消 */ }
      else if (/no-dgs/.test(m)) toast(zh() ? "请从 Google Play 安装的 MIRU App 里充值" : "Please top up in the MIRU app installed from Google Play");
      else { console.warn("[play] buy", e); toast(zh() ? "这次没有付款成功，没有扣费" : "The purchase didn't go through — you weren't charged"); }
    } finally { busy = false; }
  }
  function keepPending(sku, token) { try { const a = JSON.parse(localStorage.getItem("miru_play_pending") || "[]"); a.push({ sku: sku, token: token, at: Date.now() }); localStorage.setItem("miru_play_pending", JSON.stringify(a.slice(-10))); } catch (e) { console.warn("[play] keep", e); } }
  /* 打开 App 时：把上次没确认的单再交一次；以及 Google 那边「已付款但没消耗」的单（比如付款时断网） */
  async function restore() {
    let list = [];
    try { list = JSON.parse(localStorage.getItem("miru_play_pending") || "[]"); } catch (e2) { console.debug("[play]", e2); }
    try { const s = await service(); const ps = await s.listPurchases(); (ps || []).forEach(p => { if (!list.some(x => x.token === p.purchaseToken)) list.push({ sku: p.itemId, token: p.purchaseToken }); }); } catch (e) { console.warn("[play] list", e); }
    if (!list.length) return;
    const left = [];
    for (const x of list) {
      try { const r = await capi("/wallet", { json: { op: "play", sku: x.sku, token: x.token } }); if (r.ok) { if (typeof r.j.gems === "number") { S.keys = r.j.gems; if (typeof save === "function") save(); } } else if (r.status >= 500) left.push(x); }
      catch (_) { left.push(x); }
    }
    try { localStorage.setItem("miru_play_pending", JSON.stringify(left)); } catch (e2) { console.debug("[play]", e2); }
    if (typeof keysChip === "function") keysChip();
  }
  setTimeout(restore, 4000);

  /* 抢在网页版充值逻辑之前：App 里点钻石包一律走 Google Play */
  /* 挂在 window 的捕获阶段：比 document 上的网页版充值处理（app84 / app68）更早，拦下来就不会在本机白送钻石 */
  window.addEventListener("click", function (e) {
    const x = e.target && e.target.closest && e.target.closest(".packs84 [data-buy],.packs [data-buy]"); if (!x) return;
    e.preventDefault(); e.stopImmediatePropagation();
    buy("gems_" + x.dataset.buy);
  }, true);

  try { const st = document.createElement("style"); st.textContent = ".twa127 [data-ccexp]{display:none!important}"; document.head.appendChild(st); } catch (e2) { console.debug("[play]", e2); }
  window.__play = () => ({ twa: twa, prices: prices, hasDGS: "getDigitalGoodsService" in window });
})();
