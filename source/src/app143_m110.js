/* ================= 《全岛都在为你失控》EVERYONE WANTS YOU · M110 运行时（2026-11-12）=================
   1 · 数值：选项和小游戏里的 m110d~段~键~值 记到 th.pk.m110.values（每段只记一次），其余旗照常交给 pkSet。
       初值按原稿第 4 节：三人心动 25 · 信任 50 · 公众支持 50 · 自主 50 · 西耶娜（盟友）20；全部 0–100。
       键：a/m/j = 阿德里安 / 马特奥 / 朱利安 心动，at/mt/jt = 信任，pub = 公众，ag = 自主，si = 西耶娜。
   2 · 结局判定（原稿第 18.2 节）：终章结局场开头 ⟦SET|m110_eval⟧ 时算一次，写成剧本能读的旗：
         m110_a_hi  心动 ≥ 65 且 信任 ≥ 60            m110_a_mid  心动 ≥ 40
         m110_m_hi  同上，且 m_reconciled、没有 m_rejected   m110_m_mid  心动 ≥ 40 且没有 m_rejected
         m110_j_hi / m110_j_mid 同阿德里安
         m110_open_ok  自主 ≥ 65，且至少两个人达到 hi
       没达到的不会被写成「爱上却不敢承认」，剧本里各有慢热 / 告别的版本。
   3 · 小游戏：剧本自己放了 ⟦MG⟧，这部剧不再按关键词自动弹（免得一章两个）。
   4 · 终章三个选项都开放（不走「最后一章 A 要攒够 A 选项」）；数值变化轻提示；章末选择上方显示当前关系。 */
(function () {
  "use strict";
  const INIT = { a: 25, m: 25, j: 25, at: 50, mt: 50, jt: 50, pub: 50, ag: 50, si: 20 };
  const DELTA = /^m110d~([a-z0-9]+)~([a-z]+)~(-?\d+)$/;
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const isM = th => !!(th && th.pk && (th.pk.m110 || (th.pk.flags && th.pk.flags.m110)));
  const state = th => th.pk.m110 || (th.pk.m110 = { values: Object.assign({}, INIT), applied: {} });
  const WHO = { a: ["阿德里安", "Adrian"], m: ["马特奥", "Mateo"], j: ["朱利安", "Julian"] };
  const OTHER = { pub: ["公众支持", "Public"], ag: ["自主", "Agency"], si: ["西耶娜", "Sienna"] };
  const KL = k => OTHER[k] ? OTHER[k][zh() ? 0 : 1] : WHO[k[0]][zh() ? 0 : 1] + " " + (k.length > 1 ? (zh() ? "信任" : "trust") : (zh() ? "心动" : "affection"));

  function evalEnding(th) {
    const v = state(th).values, f = th.pk.flags || (th.pk.flags = {}), out = [];
    const hi = k => v[k] >= 65 && v[k + "t"] >= 60, mid = k => v[k] >= 40;
    const ok = { a: hi("a"), m: hi("m") && !!f.m_reconciled && !f.m_rejected, j: hi("j") };
    if (ok.a) out.push("m110_a_hi"); if (mid("a")) out.push("m110_a_mid");
    if (ok.m) out.push("m110_m_hi"); if (mid("m") && !f.m_rejected) out.push("m110_m_mid");
    if (ok.j) out.push("m110_j_hi"); if (mid("j")) out.push("m110_j_mid");
    if (v.ag >= 65 && ["a", "m", "j"].filter(k => ok[k]).length >= 2) out.push("m110_open_ok");
    return out;
  }

  /* ---------- 1 · 数值 + 2 · 结局判定 ---------- */
  const set = pkSet;
  pkSet = function (th, value) {
    const list = Array.isArray(value) ? value : (value == null ? [] : [value]);
    if (!th || !th.pk) return set.apply(this, arguments);
    const ds = list.map(f => DELTA.exec(String(f))).filter(Boolean);
    if (ds.length) {
      const st = state(th), fresh = new Set(ds.filter(m => !st.applied[m[1]]).map(m => m[1])), shown = [];
      ds.forEach(m => {
        if (!fresh.has(m[1]) || !Object.prototype.hasOwnProperty.call(INIT, m[2])) return;
        const n = Number(m[3]); st.values[m[2]] = Math.max(0, Math.min(100, (st.values[m[2]] || 0) + n));
        shown.push(KL(m[2]) + " " + (n > 0 ? "+" : "") + n);
      });
      fresh.forEach(id => { st.applied[id] = true; });
      if (shown.length && typeof toast === "function") try { toast("💗 " + shown.join(" · ")); } catch (_) {}
    }
    let rest = list.filter(f => !String(f).startsWith("m110d~"));
    if (rest.includes("m110_eval")) rest = rest.concat(evalEnding(th));
    if (!Array.isArray(value) && !ds.length && rest.length === 1) return set.call(this, th, rest[0]);
    return set.call(this, th, rest);
  };
  if (typeof packPrompt === "function") {
    const prompt = packPrompt;
    packPrompt = function (th) {
      const base = prompt.apply(this, arguments);
      return isM(th) && th.pk.m110 ? base + "\n当前关系数值（只反映玩家已经做过的选择，不替玩家作决定）：" + JSON.stringify(th.pk.m110.values) : base;
    };
  }

  /* ---------- 3 · 不再按关键词自动弹小游戏 ---------- */
  if (typeof pkAppend === "function") {
    const app = pkAppend;
    pkAppend = function (th) {
      try { if (isM(th)) { th.pk.mgAuto = th.pk.mgAuto || {}; const k = "c" + th.pk.ch; if (!th.pk.mgAuto[k]) th.pk.mgAuto[k] = "script"; } } catch (_) {}
      return app.apply(this, arguments);
    };
  }

  /* ---------- 4 · 终章不设 A 门槛 + 章末显示当前关系 ---------- */
  if (typeof EN === "function") { const need = EN; EN = function (th) { return isM(th) ? 0 : need.apply(this, arguments); }; }
  if (typeof packPanel === "function") {
    const panel = packPanel;
    packPanel = function (th) {
      const h = panel.apply(this, arguments);
      try {
        if (!isM(th) || th.pk.st !== "choose") return h;
        const v = state(th).values, z = zh();
        const row = "amj".split("").map(k => '<span><b>' + esc(WHO[k][z ? 0 : 1]) + '</b> ' + (z ? "心动 " : "aff. ") + v[k] + ' · ' + (z ? "信任 " : "trust ") + v[k + "t"] + '</span>').join("") +
          ["ag", "pub", "si"].map(k => '<span><b>' + esc(OTHER[k][z ? 0 : 1]) + '</b> ' + v[k] + '</span>').join("");
        return '<div class="m110v">' + row + '</div>' + h;
      } catch (e) { console.warn("[m110] panel", e); return h; }
    };
  }
  (function () { const st = document.createElement("style"); st.textContent = ".m110v{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:11.5px;color:#fffb;margin:0 0 8px;padding:7px 10px;border-radius:10px;background:rgba(255,255,255,.06)}.m110v b{color:#F0B77E;font-weight:600}"; document.head.appendChild(st); })();

  window.__m110v = th => { th = th || S.threads[curT]; return th && th.pk ? { on: isM(th), v: th.pk.m110 && th.pk.m110.values, ending: th.pk.m110 ? evalEnding(th) : null } : null; };
})();
