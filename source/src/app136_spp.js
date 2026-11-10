/* ================= 《谁是 S++》v4 运行时（2026-11-10）=================
   1 · 数值：剧本选项里的 sppdelta~章~键~值 记到 th.pk.spp94.values（每章只记一次），普通旗照常交给 pkSet。
       初值按设定：权威 20 · 欲 30 · 信任 25 · 知情 0 · 名声 10；bond_* / ax_* 上限 10，其余上限 100。
   2 · 最终选择（第 18 章「第十九天，你在卡上写下什么？」）按 2026-11-10 定下的结局表上锁：
         A · THE SECOND PLUS —— 一直开放（不走通用的「A 要攒够 A 选项」规则）
         B · THE HOUSE       —— 权威 ≥ 75 且 知情 ≥ 8（算上 B 这一项本身的加分）
         C · THE DOOR        —— 知情 ≥ 25（算上 C 这一项本身的加分）
       原稿 B 写的是权威 ≥ 75（全剧最多 72，够不到）、C 写的是「与 Konstantin 关系最高」（全剧只有最后选 A 才加），
       按原样两个结局都不可能出现，所以改成上面这样。没达到的选项显示 🔒 和还差多少，点了不会选中。
   3 · 演员表：标了 ⟦SET|spp_v4⟧ 的剧本最多 24 人同台（见 app94_official2.js 的 cast）。 */
(function () {
  "use strict";
  const WORK = "w_scmw9biwsq6dcfcceb84";
  const INIT = { authority: 20, desire: 30, trust: 25, consent: 0, insight: 0, notoriety: 10, ax_gaze: 0, ax_mercy: 0, ax_power: 0 };
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const DELTA = /^sppdelta~(c\d+)~([a-z_]+)~(-?\d+)$/;
  const isSpp = th => !!(th && th.pk && (th.pk.spp94 || (() => { const w = wd(th.wid); return !!(w && (w.community === WORK || w.id === WORK)); })()));
  const state = th => th.pk.spp94 || (th.pk.spp94 = { values: Object.assign({}, INIT), applied: {} });

  /* ---------- 1 · 数值 ---------- */
  const set = pkSet;
  pkSet = function (th, value) {
    const list = Array.isArray(value) ? value : [value];
    if (!th || !th.pk) return set.apply(this, arguments);
    const deltas = list.map(f => DELTA.exec(String(f))).filter(Boolean);
    if (list.includes("spp_v4") || deltas.length) {
      const st = state(th), fresh = new Set(deltas.filter(m => !st.applied[m[1]]).map(m => m[1]));
      deltas.forEach(m => {
        if (!fresh.has(m[1]) || (!Object.prototype.hasOwnProperty.call(INIT, m[2]) && !/^bond_[a-z]+$/.test(m[2]))) return;
        const max = /^(bond_|ax_)/.test(m[2]) ? 10 : 100;
        st.values[m[2]] = Math.max(0, Math.min(max, (st.values[m[2]] || 0) + Number(m[3])));
      });
      fresh.forEach(id => { st.applied[id] = true; });
    }
    return set.call(this, th, list.filter(f => !String(f).startsWith("sppdelta~")));
  };
  if (typeof packPrompt === "function") {
    const prompt = packPrompt;
    packPrompt = function (th) {
      const base = prompt.apply(this, arguments), st = th && th.pk && th.pk.spp94;
      return st ? base + "\n当前评级记录（仅已完成选择的结果，不替玩家作决定）：" + JSON.stringify(st.values) : base;
    };
  }

  /* ---------- 2 · 结局上锁 ---------- */
  const LBL = { authority: ["权威", "Authority"], insight: ["知情", "Insight"] };
  function optDelta(x, key) {
    let n = 0; (Array.isArray(x && x.set) ? x.set : []).forEach(f => { const m = DELTA.exec(String(f)); if (m && m[2] === key) n += Number(m[3]); }); return n;
  }
  function finalChoices(th) {
    const w = wd(th.wid); if (!w || !w.pack) return null;
    const n = th.pk.ch, c = w.pack.chapters[n - 1]; if (!c || !Array.isArray(c.choices)) return null;
    const flag = (x, f) => Array.isArray(x.set) && x.set.includes(f);
    const B = c.choices.find(x => flag(x, "abolished_the_grade")), C = c.choices.find(x => flag(x, "demanded_the_vault"));
    return B || C ? { B, C } : null;
  }
  /* 返回 { 键: 原因 }：只列没解锁的 */
  function locks(th) {
    if (!isSpp(th) || th.pk.st !== "choose") return {};
    const f = finalChoices(th); if (!f) return {};
    const v = state(th).values, out = {}, L = k => LBL[k][zh() ? 0 : 1];
    const need = (x, rules) => {
      const miss = rules.map(([k, min]) => { const now = v[k] || 0, d = optDelta(x, k); return now + d >= min ? null : L(k) + " ≥ " + min + (zh() ? "（你现在 " + now + (d ? "，选它 +" + d : "") + "）" : " (you have " + now + (d ? ", +" + d + " from this choice" : "") + ")"); }).filter(Boolean);
      return miss.length ? (zh() ? "需要 " : "Needs ") + miss.join(zh() ? " 且 " : " and ") : null;
    };
    if (f.B) { const r = need(f.B, [["authority", 75], ["insight", 8]]); if (r) out[f.B.k] = r; }
    if (f.C) { const r = need(f.C, [["insight", 25]]); if (r) out[f.C.k] = r; }
    return out;
  }
  window.__spp = th => { th = th || S.threads[curT]; return th && th.pk ? { spp: isSpp(th), values: th.pk.spp94 && th.pk.spp94.values, locks: locks(th) } : null; };

  /* A 一直开放：通用规则是「最后一章 A 要攒够 A 选项」，这部剧不用 */
  if (typeof EN === "function") { const need = EN; EN = function (th) { return isSpp(th) ? 0 : need.apply(this, arguments); }; }

  if (typeof packPanel === "function") {
    const panel = packPanel;
    packPanel = function (th) {
      let h = panel.apply(this, arguments);
      try {
        const L = locks(th);
        Object.keys(L).forEach(k => {
          h = h.replace(new RegExp('class="pkopt" data-pkpick="' + k + '"><i>' + k + '</i><span>([\\s\\S]*?)</span></button>'),
            (m, txt) => 'class="pkopt lk" data-pkpick="' + k + '" aria-disabled="true"><i>' + k + '</i><span>' + txt + '<small>🔒 ' + esc(L[k]) + '</small></span></button>');
        });
      } catch (e) { console.warn("[spp] panel", e); }
      return h;
    };
  }
  if (typeof packPick === "function") {
    const pick = packPick;
    packPick = function (k) {
      const th = S.threads[curT];
      try { const r = th && locks(th)[k]; if (r) { if (typeof toast === "function") toast("🔒 " + r); return; } } catch (e) { console.warn("[spp] pick", e); }
      return pick.apply(this, arguments);
    };
  }
})();
