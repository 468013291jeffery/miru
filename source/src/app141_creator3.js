/* ================= 用户创作 v3：让普通用户也能做出「有推进、有反转、有选择」的剧（2026-11-11）=================
   修四件事（都在「一句话写一部剧」和创作中心发布后的工作台里生效）：
   1 · 逐章生成：以前 AI 写每一章拿到的都是同一份故事卡，不知道是第几章，也看不到前文 ⇒ 每章都像重写第一章。
       现在先做一份「全季大纲」（每章：标题 / 目标 / 剧情 / 伏笔 / 反转 / 章末钩子），写某一章时带上这一章的大纲 + 前面各章的摘要。
   2 · 反转真的生效：「反转密度」以前只是个按钮，没人读它。现在大纲按它安排：少 = 结尾一次大反转；中 = 中段一次 + 结尾一次；
       多 = 每两章一次，而且每个反转都要在更早的章节埋下伏笔（大纲里的 seed）。
   3 · 每章自己的选择：以前每章结尾都是同一套「相信他 / 保持距离 / 交给配角」。现在三个选项由这一章的剧情生成，
       A = 靠近 / 信任，B = 谨慎观望，C = 冒险 / 对抗（保持这个顺序，结局才对得上）；每个选项有自己的后续几句和记忆。
   4 · 取向由作者选：男女（BG）/ 男男（BL）/ 女女（GL），默认跟随你在 App 里选的取向。以前写死是 BL。
   另：创作中心「发布到 MIRU」时，第一章不再套固定的 13 句模板（连着 AI 时由 AI 按大纲写）。
   AI 没连上时，全部退回原来的本地模板，不会报错。 */
(function () {
  "use strict";
  if (typeof cWriteScene !== "function" || typeof cBuildWorld !== "function") return;
  const zh = () => S.lang === "zh";
  const OR = { bg: ["男女", "M/F"], bl: ["男男", "M/M"], gl: ["女女", "F/F"] };
  const defOr = () => (/^(bg|bl|gl)$/.test(S.or) ? S.or : "bg");
  const orText = o => ({
    bg: "Orientation: M/F. The love interest (LEAD) is a man; the reader (\"you\") is a woman.",
    bl: "Orientation: M/M. LEAD and the reader (\"you\") are both men.",
    gl: "Orientation: F/F. LEAD and the reader (\"you\") are both women."
  })[o] || "";
  const supG = o => (o === "gl" ? "f" : "m"), leadG = o => (o === "gl" ? "f" : "m");

  /* ---------- 4 · 取向 ---------- */
  const R0 = cRender;
  cRender = function () {
    if (CW && CW.picks && !CW.picks.or) CW.picks.or = defOr();
    const r = R0.apply(this, arguments);
    try {
      if (CW && CW.step === 1) { const ta = $("#cwIdea"); if (ta && !$("#s-cnew [data-cwp^='or|']")) ta.insertAdjacentHTML("afterend", cRow("or", LL("感情线", "Pairing"), Object.keys(OR).map(k => [k, LL(OR[k][0], OR[k][1])]))); }
    } catch (e) { console.warn("[cr3] or row", e); }
    return r;
  };
  cardFromAI = async function (idea) {
    const o = (CW && CW.picks && CW.picks.or) || defOr();
    const r = await cAsk("Design an original interactive romance-drama story (all characters fictional adults 21+, US setting, no explicit sexual content) from this one-line idea: \"" + idea + "\". " + orText(o) +
      " SUP is a second important character (rival, ally or foil; " + (supG(o) === "f" ? "a woman" : "a man") + "). Language: " + LANG_NAME[S.lang] +
      '. Reply ONLY JSON {"title":"","lead":{"name":"English first name","role":"one line"},"sup":{"name":"English first name","role":"one line"},"place":"","time":"","obj":"one key object","sec":"the core secret, who knows it","con":"the core conflict","hook":"LEAD\'s first line to the reader, one sentence"}', 30000);
    if (!r || !r.title || !r.lead || !r.lead.name) throw 0; const tp = cPick(idea);
    return Object.assign(cardFromTpl(tp, idea), { title: r.title, lead: { name: r.lead.name, role: r.lead.role || "", lib: tp.lib }, sup: { name: (r.sup && r.sup.name) || cL(tp.sup), role: (r.sup && r.sup.role) || "", lib: tp.sl }, place: r.place || "", time: r.time || "", obj: r.obj || "", sec: r.sec || "", con: r.con || "", hook: r.hook || "" });
  };
  const B0 = cBuildWorld;
  cBuildWorld = function (c, picks) {
    picks = picks || {}; const o = /^(bg|bl|gl)$/.test(picks.or) ? picks.or : defOr();
    const r = B0.apply(this, arguments);
    try {
      const w = wd(r.wid); w.or = o;
      w.pack.picks = { or: o, tone: picks.tone || "pull", twist: picks.twist || "mid", mode: picks.mode || "mix", len: String(picks.len || w.pack.chapters.length) };
      [[r.L, leadG(o)], [r.S2, supG(o)]].forEach(([id, g]) => { const k = S.mine.chars[id]; if (!k) return; k.g = g; if (k.studio) { k.studio.g = g; k.studio.pair = o; } if (g === "f") delete S.art[id]; /* 形象库里是男性头像 */ });
      save();
    } catch (e) { console.warn("[cr3] world", e); }
    return r;
  };

  /* ---------- 1 + 2 · 全季大纲（带伏笔和反转） ---------- */
  function twistRule(n, d) {
    if (n <= 1) return "This is a one-chapter story: plant one clue early and pay it off with one reversal near the end.";
    if (d === "low") return "Exactly ONE major twist, in chapter " + n + " (or " + (n - 1) + "). Plant its clue (seed) at least one chapter earlier.";
    if (d === "high") return "A twist or reveal every two chapters (chapters " + Array.from({ length: n }, (_, i) => i + 1).filter(i => i % 2 === 0 || i === n).join(", ") + "), each one re-framing what the reader believed. Every twist must have a seed planted in an EARLIER chapter.";
    return "TWO twists: one around chapter " + Math.max(2, Math.ceil(n / 2)) + " that changes what the reader thinks is going on, and a final reversal in chapter " + n + ". Each needs a seed planted at least one chapter earlier.";
  }
  const TONE = { sweet: "warm, sweet, low danger", pull: "push-pull tension, restrained desire", dark: "dark and dangerous, morally grey", mystery: "mystery and suspense" };
  const MODE = { plot: "plot-driven: every chapter moves the main conflict", mix: "main plot plus small everyday moments between the two", daily: "everyday companionship first, light plot" };
  async function makePlan(w) {
    const P = w.pack, c = P.card, k = P.picks || {}, n = P.chapters.length;
    /* 创作中心做的剧：作者在剧情图里已经定了每章的标题和要点，大纲要顺着它来，不改标题、不换作者写的选项 */
    const notes = P.creator ? P.chapters.map((x, j) => (j + 1) + ". " + Lz(x.t) + (Lz(x.goal) ? " — " + Lz(x.goal) : "")).join(" | ") : "";
    const r = await cAsk("Plan a " + n + "-chapter interactive romance drama season as JSON. Story card: " + JSON.stringify({ title: c.title, lead: c.lead, sup: c.sup, place: c.place, time: c.time, object: c.obj, secret: c.sec, conflict: c.con }) + ". " + orText(w.or) +
      " Tone: " + (TONE[k.tone] || TONE.pull) + ". Pacing: " + (MODE[k.mode] || MODE.mix) + ". " + twistRule(n, k.twist) +
      (notes ? " The author already outlined the chapters — keep their order and intent: " + notes.slice(0, 1500) + "." : "") + " Rules: the season escalates (each chapter raises the stakes or shifts the relationship, no chapter repeats the previous one); the reader's choices matter but the plan must work whichever way they chose; every chapter ends on a hook that makes the reader want the next one; the last chapter resolves the core conflict and leaves room for three endings (together / apart on good terms / broken). All characters are adults; no explicit sexual content." +
      " Language: " + LANG_NAME[S.lang] + '. Reply ONLY JSON {"truth":"what is REALLY going on, hidden from the reader until revealed","chapters":[{"title":"max 8 words","goal":"what the reader is trying to do, one line","place":"","summary":"3 sentences: what happens","seed":"a small concrete clue planted here for a later twist, or empty","twist":"the reveal that happens in this chapter, or empty","hook":"the last moment of the chapter"}]} with exactly ' + n + " chapters.", 60000);
    if (!r || !Array.isArray(r.chapters) || r.chapters.length < n) return null;
    const plan = { truth: String(r.truth || "").slice(0, 400), ch: r.chapters.slice(0, n).map(x => ({ title: String(x.title || "").slice(0, 40), goal: String(x.goal || "").slice(0, 120), place: String(x.place || "").slice(0, 60), summary: String(x.summary || "").slice(0, 500), seed: String(x.seed || "").slice(0, 200), twist: String(x.twist || "").slice(0, 300), hook: String(x.hook || "").slice(0, 200) })) };
    P.plan = plan; const x0 = s => ({ zh: s, en: s });
    if (!P.creator) P.chapters.forEach((ch2, i) => { const p = plan.ch[i]; if (p.title) ch2.t = x0(p.title); if (p.goal) ch2.goal = x0(p.goal); if (p.place) ch2.place = x0(p.place);
      if (ch2.outline) { const line = (zh() ? "【大纲】" : "[Outline] ") + p.summary; ch2.beats = { zh: [["n", "act", line]], en: [["n", "act", line]] }; } });
    save(); return plan;
  }

  /* ---------- 1 + 3 · 逐章写：带大纲、前文摘要，产出这一章自己的三个选择 ---------- */
  let WANT = null; /* 工作台里点的是第几章 */
  document.addEventListener("click", e => { const x = e.target.closest("[data-cbgen]"); if (x) WANT = +x.dataset.cbgen; else if (e.target.closest("[data-cbseason]")) WANT = null; }, true);
  function pickIndex(w, first) {
    if (first) return 0; const C = w.pack.chapters;
    if (WANT != null && C[WANT]) { const i = WANT; WANT = null; return i; }
    const i = C.findIndex(c => c.outline); return i < 0 ? C.length - 1 : i;
  }
  function mapBeats(arr, map) {
    return (arr || []).filter(b => Array.isArray(b) && b.length >= 3 && map[b[0]] && ["act", "say", "think"].includes(b[1])).map(b => [map[b[0]], b[0] === "n" ? "act" : b[1], String(b[2]).slice(0, 300)]);
  }
  const W0 = cWriteScene;
  cWriteScene = async function (wid, first) {
    const w = wd(wid); if (!w || !w.pack || !liveOn()) return W0.apply(this, arguments);
    const P = w.pack, c = P.card, L = w.cast[0], S2 = w.cast[1], n = P.chapters.length, i = pickIndex(w, first), last = i === n - 1;
    try {
      const plan = P.plan || await makePlan(w); if (!plan) return W0.apply(this, arguments);
      const p = plan.ch[i], k = P.picks || {}, sums = (P.sums || []).slice(0, i).map((s, j) => s ? "Ch" + (j + 1) + ": " + s : "").filter(Boolean);
      const later = plan.ch.slice(i + 1).filter(x => x.twist).length;
      const r = await cAsk("Write chapter " + (i + 1) + " of " + n + " of an interactive romance drama as JSON. Story card: " + JSON.stringify({ title: c.title, lead: c.lead, sup: c.sup, place: p.place || c.place, time: c.time, object: c.obj, conflict: c.con }) + ". " + orText(w.or) +
        " Tone: " + (TONE[k.tone] || TONE.pull) + ".\nThe hidden truth (never state it before its reveal): " + plan.truth +
        "\nTHIS chapter — title: " + p.title + "; what happens: " + p.summary + (p.seed ? "; plant this clue quietly, as a concrete detail, without explaining it: " + p.seed : "") + (p.twist ? "; THE TWIST revealed in this chapter (build to it, land it in a single sharp moment, show LEAD's reaction): " + p.twist : "") + "; end the chapter on: " + p.hook +
        (sums.length ? "\nPrevious chapters (continue from them, do not repeat them, keep facts consistent): " + sums.join(" | ") : "\nThis is the opening chapter: open in the middle of a moment, show LEAD's pull through one specific action, and give the reader something to react to within the first 6 beats." + (c.hook ? " LEAD's first line: " + c.hook : "")) +
        (!last && later ? "\nLater chapters hold more reveals — do not resolve the core secret yet." : "") + (last ? "\nThis is the FINAL chapter: resolve the core conflict." : "") +
        "\nCast ids: LEAD = " + c.lead.name + ", SUP = " + c.sup.name + ". The reader is \"you\" (second person) and never speaks in the script. Rules: concrete sensory detail, restrained voice, show feelings through actions not statements, no clichés, at least 3 moments where LEAD or SUP says something directly to the reader that invites a reply. All characters are adults; no explicit sexual content. " + (first ? "24-32" : "40-60") + " beats. " +
        "Then give exactly 3 end-of-chapter choices that grow out of THIS chapter's last moment (never generic): A = move closer / trust LEAD, B = careful, hold back and find out more, C = bold, risky or against LEAD." + (last ? " In this final chapter the choices decide the ending: A = stay together, B = part on good terms, C = break with LEAD." : "") +
        " Each choice: \"t\" (what the reader does, max 14 words), \"then\" (2-4 beats of immediate consequence), \"mem\" (one sentence the characters will remember about this choice). Also \"summary\": 2 sentences of what happened in this chapter, for continuity." +
        " Language: " + LANG_NAME[S.lang] + '. Reply ONLY JSON {"beats":[["n|LEAD|SUP","act|say|think","text"]],"choices":[{"k":"A","t":"","then":[["n|LEAD|SUP","act|say|think","text"]],"mem":""}],"summary":""}', first ? 60000 : 100000);
      const map = { LEAD: L, SUP: S2, n: "n" }, B = mapBeats(r && r.beats, map);
      if (B.length < 8) return W0.apply(this, arguments);
      const ch2 = P.chapters[i], x0 = s => ({ zh: s, en: s });
      const opts = (Array.isArray(r.choices) ? r.choices : []).filter(o => o && String(o.t || "").trim()).slice(0, 3).map((o, j) => { const then = mapBeats(o.then, map).slice(0, 4);
        return { k: "ABC"[j], t: x0(String(o.t).slice(0, 80)), then: { zh: then, en: then }, mem: x0(String(o.mem || (LL("你选择了：", "You chose: ") + o.t)).slice(0, 160)), set: ["c" + (i + 1) + "_" + "abc"[j]] }; });
      if (opts.length === 3 && !P.creator) { ch2.choices = opts; ch2.ask = x0(LL("你怎么做？", "What do you do?")); }
      P.sums = P.sums || []; P.sums[i] = String(r.summary || p.summary || "").slice(0, 400);
      save();
      return [["sys", "scene", { place: p.place || c.place, time: c.time }]].concat(B);
    } catch (e) { console.warn("[cr3] chapter", e); return W0.apply(this, arguments); }
  };

  /* ---------- 创作中心发布：第一章不再套固定模板 ---------- */
  if (window.MIRU_BRIDGE && typeof crPublish === "function") {
    window.MIRU_BRIDGE.publish = function (story, proj, sb) {
      const custom = new Set((((proj || {}).advanced || {}).scenes || []).map(s => s.id));
      const wid = crPublish(story, proj, sb); crClose(true); show("s-main"); const w = wd(wid);
      toast(LL("已发布到 MIRU · ", "Published to MIRU · ") + Lz(w.title));
      const go = () => packStart(wid, crAs(proj, w));
      /* 再次发布时 crPublish 会把第一章重置成模板：把上次 AI 写好的第一幕放回去 */
      if (!custom.has("start") && w.pack.cr3first) { w.pack.chapters[0].beats = { zh: w.pack.cr3first, en: w.pack.cr3first }; save(); }
      if (custom.has("start") || !liveOn() || w.pack.cr3first) { setTimeout(go, 250); return; }
      toast(LL("正在写第一幕……", "Writing scene 1…"));
      cWriteScene(wid, true).then(B => { if (B && B.length >= 8) { w.pack.chapters[0].beats = { zh: B, en: B }; w.pack.cr3first = B; save(); } }).catch(() => {}).then(go);
    };
  }
  window.__cr3 = { twistRule, makePlan };
})();
