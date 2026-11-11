/* ================= 《我死过一次，他们都记得》M109 运行时（2026-11-11）=================
   1 · 数值：选项和小游戏里的 m109d~段~键~值 记到 th.pk.m109.values（每段只记一次），其余旗照常交给 pkSet。
       初值按原稿 A2：亚历山大 信任 40 / 心动 15 · 达米安 35 / 15 · 伊森 45 / 15 · 锚定 60；全部 0–100。
       键：a/d/e = 心动，at/dt/et = 信任，stab = 锚定。
   2 · 第 15 章「今晚，你想和谁认真开始？」：只有 信任 ≥ 42 且 心动 ≥ 35 的人可以选（原稿 A2），
       不够的显示 🔒 和还差多少；「暂时不和任何人开始」一直开放（原稿：门槛不够进入「继续认识」）。
   3 · 小游戏：剧本自己在每章放了一个 ⟦MG⟧，所以这部剧不再按关键词自动弹小游戏（免得一章两个）。
   4 · 数值变化时轻提示一下；章末选择上方显示当前关系。 */
(function () {
  "use strict";
  const INIT = { at: 40, a: 15, dt: 35, d: 15, et: 45, e: 15, stab: 60 };
  const DELTA = /^m109d~([a-z0-9]+)~([a-z]+)~(-?\d+)$/;
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const isM = th => !!(th && th.pk && (th.pk.m109 || (th.pk.flags && th.pk.flags.m109)));
  const state = th => th.pk.m109 || (th.pk.m109 = { values: Object.assign({}, INIT), applied: {} });
  const WHO = { a: ["亚历山大", "Alexander"], d: ["达米安", "Damien"], e: ["伊森", "Ethan"] };
  const KL = k => k === "stab" ? (zh() ? "锚定" : "Anchor") : (WHO[k[0]][zh() ? 0 : 1] + " " + (k.length > 1 ? (zh() ? "信任" : "trust") : (zh() ? "心动" : "affection")));

  /* ---------- 1 · 数值 ---------- */
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
    const rest = list.filter(f => !String(f).startsWith("m109d~"));
    if (!Array.isArray(value)) return ds.length ? set.call(this, th, []) : set.apply(this, arguments);
    return set.call(this, th, rest);
  };
  if (typeof packPrompt === "function") {
    const prompt = packPrompt;
    packPrompt = function (th) {
      const base = prompt.apply(this, arguments);
      return isM(th) && th.pk.m109 ? base + "\n当前关系数值（只反映玩家已经做过的选择，不替玩家作决定）：" + JSON.stringify(th.pk.m109.values) : base;
    };
  }

  /* ---------- 2 · 第 15 章门槛 ---------- */
  const NEED_T = 42, NEED_A = 35;
  function lockOf(th, o) {
    const f = (Array.isArray(o && o.set) ? o.set : [o && o.set]).map(String).find(x => /^bond_[ade]$/.test(x));
    if (!f) return null;
    const k = f.slice(5), v = state(th).values, t = v[k + "t"] || 0, a = v[k] || 0;
    if (t >= NEED_T && a >= NEED_A) return null;
    const miss = [];
    if (t < NEED_T) miss.push((zh() ? "信任 ≥ " : "Trust ≥ ") + NEED_T + (zh() ? "（现在 " + t + "）" : " (now " + t + ")"));
    if (a < NEED_A) miss.push((zh() ? "心动 ≥ " : "Affection ≥ ") + NEED_A + (zh() ? "（现在 " + a + "）" : " (now " + a + ")"));
    return (zh() ? "还需要 " : "Needs ") + miss.join(zh() ? " 且 " : " and ");
  }
  const lineStop = th => isM(th) && th.pk.stop && th.pk.stop[1] === "line" ? th.pk.stop[2] : null;
  if (typeof stopHTML === "function") {
    const html = stopHTML;
    stopHTML = function (th) {
      let h = html.apply(this, arguments);
      try {
        const d = lineStop(th); if (!d || !Array.isArray(d.opts)) return h;
        d.opts.forEach((o, i) => {
          const r = lockOf(th, o); if (!r) return;
          h = h.replace(new RegExp('class="pkopt" data-stopline="' + i + '"><i>([\\s\\S]*?)</i><span>([\\s\\S]*?)</span></button>'),
            (m, ic, txt) => 'class="pkopt lk" data-stopline="' + i + '" aria-disabled="true"><i>🔒</i><span>' + txt + '<small>' + esc(r) + '</small></span></button>');
          /* app27 的「态度」按钮（现在默认就是这一种） */
          h = h.replace(new RegExp('<button data-chatt="' + i + '"( style="[^"]*")><b>([\\s\\S]*?)</b><span>([\\s\\S]*?)</span></button>'),
            (m, st, b, txt) => '<button data-chatt="' + i + '"' + st + ' class="lk109" aria-disabled="true"><b>🔒</b><span>' + txt + '<small>' + esc(r) + '</small></span></button>');
        });
      } catch (e) { console.warn("[m109] stop", e); }
      return h;
    };
  }
  window.addEventListener("click", e => {
    const x = e.target.closest && e.target.closest("[data-stopline],[data-chatt]"); if (!x) return;
    const th = S.threads[curT], d = lineStop(th); if (!d) return;
    const r = lockOf(th, (d.opts || [])[+(x.dataset.stopline != null ? x.dataset.stopline : x.dataset.chatt)]); if (!r) return;
    e.stopImmediatePropagation(); e.preventDefault(); if (typeof toast === "function") toast("🔒 " + r);
  }, true);

  /* ---------- 3 · 不再按关键词自动弹小游戏 ---------- */
  if (typeof pkAppend === "function") {
    const app = pkAppend;
    pkAppend = function (th) {
      try { if (isM(th)) { th.pk.mgAuto = th.pk.mgAuto || {}; const k = "c" + th.pk.ch; if (!th.pk.mgAuto[k]) th.pk.mgAuto[k] = "script"; } } catch (_) {}
      return app.apply(this, arguments);
    };
  }

  /* ---------- 4 · 章末显示当前关系 ---------- */
  if (typeof packPanel === "function") {
    const panel = packPanel;
    packPanel = function (th) {
      const h = panel.apply(this, arguments);
      try {
        if (!isM(th) || th.pk.st !== "choose") return h;
        const v = state(th).values, z = zh();
        const row = "ade".split("").map(k => '<span><b>' + esc(WHO[k][z ? 0 : 1]) + '</b> ' + (z ? "信任 " : "trust ") + v[k + "t"] + ' · ' + (z ? "心动 " : "aff. ") + v[k] + '</span>').join("");
        return '<div class="m109v">' + row + '<span><b>' + (z ? "锚定" : "Anchor") + '</b> ' + v.stab + '</span></div>' + h;
      } catch (e) { console.warn("[m109] panel", e); return h; }
    };
  }
  (function () { const st = document.createElement("style"); st.textContent = ".m109v{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:11.5px;color:#fffb;margin:0 0 8px;padding:7px 10px;border-radius:10px;background:rgba(255,255,255,.06)}.m109v b{color:#F0B77E;font-weight:600}.chatt .lk109{opacity:.55}.chatt .lk109 small{display:block;font-size:11px;color:#F0B77E;margin-top:3px}"; document.head.appendChild(st); })();

  window.__m109v = th => { th = th || S.threads[curT]; return th && th.pk ? { on: isM(th), v: th.pk.m109 && th.pk.m109.values, applied: th.pk.m109 && th.pk.m109.applied } : null; };
})();
