/* ================= 设定集（v9 · 第十五批 · 2026-11-03）=================
   借鉴 SillyTavern 的 World Info / Lorebook：设定写得再多，也只在「对话碰到它」的那几轮带给模型。

   剧本写法（任意章节、任意位置，一行一条，全剧通用，不会显示给玩家）：
     ⟦LORE|慈善晚宴,洛杉矶,半年前|半年前洛杉矶的慈善晚宴上，你在后台照顾一位情绪崩溃的工作人员……⟧
     ⟦LORE|借钱,欠债|罗南的工作室向朱利安借过钱……|仅:罗南,朱利安⟧
       第 2 段 = 关键词（逗号分隔，中英文逗号都行）
       第 3 段 = 设定内容（≤ 300 字）
       第 4 段（可选）= 「仅:角色名,角色名」—— 只有这些角色知道，其他人不能说出口

   运行时（程序决定带什么，模型只管怎么说）：
     · 每次回复前扫「玩家这句话 + 最近 6 条对话」，命中关键词的条目按命中次数排序；
     · 最多带 5 条、合计 600 字，放进提示词的「RELEVANT LORE」一块；
     · 命中过的条目「粘」3 轮（话题一转就忘，是 SillyTavern 里最常被骂的地方）；
     · 「仅:」的条目会标明谁知道，其他人不许说破。
   数据：w.pack.lore = [{ keys:[...], txt, only:[cid...] }]；线程上 th.lore94 = { 条目序号: 剩余轮数 }。
   读数：控制台 __lore() 看当前线程这一轮会带哪几条。 */
(function () {
  "use strict";
  const MAX_N = 5, MAX_CH = 600, STICK = 3, SCAN = 6;
  const LORE_RE = /^⟦LORE\|([^|⟧]*)\|([^|⟧]*)(?:\|([^|⟧]*))?⟧$/;
  const dec = s => { try { return decodeURIComponent(s) } catch (e) { return s } };

  function parseLore(text) {
    const lore = [];
    const kept = String(text || "").split("\n").filter(function (l) {
      const m = LORE_RE.exec(String(l).trim());
      if (!m) return true;
      const keys = dec(m[1]).split(/[,，、]/).map(s => s.trim()).filter(Boolean);
      const txt = dec(m[2]).trim().slice(0, 300);
      const only = m[3] ? dec(m[3]).replace(/^仅[:：]/, "").split(/[,，、]/).map(s => s.trim()).filter(Boolean) : [];
      if (keys.length && txt) lore.push({ keys: keys, txt: txt, only: only });
      return false;
    });
    return { text: kept.join("\n"), lore: lore };
  }

  PARSE.use("app117:lore", {
    parse: function (next, text) {
      const r = parseLore(text);
      const doc = next(r.text);
      doc.lore = r.lore;
      return doc;
    },
    build: function (next, doc, as) {
      const out = next(doc, as);
      try {
        const w = wd(out && (out.wid || out));
        if (w && w.pack && doc && Array.isArray(doc.lore)) {
          const idOf = function (name) {
            const ids = w.cast || [];
            for (let i = 0; i < ids.length; i++) { const c = ch(ids[i]); if (!c) continue; const n = c.n94 ? c.n94.zh : c.n; if (n === name || c.n === name) return ids[i]; }
            return null;
          };
          w.pack.lore = doc.lore.map(function (e) {
            return { keys: e.keys, txt: e.txt, only: e.only.map(idOf).filter(Boolean), onlyN: e.only };
          });
        }
      } catch (e) { console.warn("[lore] build", e); }
      return out;
    }
  });

  /* 这一轮要带哪几条：返回 [{i, e, hits}]，并推进「粘」的计数（commit=true 时） */
  function pick(th, ctx, commit) {
    const w = th && th.wid ? wd(th.wid) : null;
    const L = (w && ((w.pack && w.pack.lore) || w.lore)) || [];   /* w.lore：导入的角色卡（app120）带来的设定集 */
    if (!L.length) return [];
    const recent = (th.msgs || []).slice(-SCAN).map(m => m.txt || (m.parts || []).map(p => p.txt || "").join(" ") || "").join("\n");
    const hay = ((ctx && ctx.txt) || "") + "\n" + recent;
    const low = hay.toLowerCase();
    th.lore94 = th.lore94 || {};
    const rows = [];
    L.forEach(function (e, i) {
      let hits = 0;
      e.keys.forEach(function (k) { const kk = String(k).toLowerCase(); let p = low.indexOf(kk); while (kk && p >= 0) { hits++; p = low.indexOf(kk, p + kk.length); } });
      const left = th.lore94[i] || 0;
      if (hits || left > 0) rows.push({ i: i, e: e, hits: hits, left: left });
    });
    rows.sort((a, b) => (b.hits - a.hits) || (b.left - a.left) || (a.i - b.i));
    const take = []; let n = 0;
    for (const r of rows) {
      if (take.length >= MAX_N) break;
      if (n + r.e.txt.length > MAX_CH && take.length) continue;
      take.push(r); n += r.e.txt.length;
    }
    if (commit) {
      const next = {};
      Object.keys(th.lore94).forEach(k => { const v = th.lore94[k] - 1; if (v > 0) next[k] = v; });
      take.forEach(r => { if (r.hits) next[r.i] = STICK; });
      th.lore94 = next;
    }
    return take;
  }

  /* app3_chat 的回复提示词里调用：给模型的那一块文字 */
  window.loreBlock = function (th, ctx) {
    let take = [];
    try { take = pick(th, ctx, true); } catch (e) { console.warn("[lore] pick", e); return ""; }
    if (!take.length) return "";
    const lines = take.map(function (r) {
      const who = (r.e.only || []).map(id => { const c = ch(id); return c ? first(c.n) : ""; }).filter(Boolean);
      return "- " + r.e.txt + (who.length ? " [Only " + who.join(" and ") + " know this. Nobody else may know it, hint at it or say it.]" : "");
    });
    return "RELEVANT LORE (background facts that just came up — use them only where they fit naturally; never recite them, never contradict them):\n" + lines.join("\n");
  };

  window.__lore = function () {
    const th = S.threads[curT]; if (!th) return { err: "no thread" };
    const w = wd(th.wid), L = (w && ((w.pack && w.pack.lore) || w.lore)) || [];
    return { entries: L.length, sticky: th.lore94 || {}, thisTurn: pick(th, null, false).map(r => ({ keys: r.e.keys, hits: r.hits, left: r.left })) };
  };
  window.loreParse = parseLore;
})();
