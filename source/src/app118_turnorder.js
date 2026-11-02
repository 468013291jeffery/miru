/* ================= 群聊发言顺序（v9 · 第十六批 · 2026-11-03）=================
   借鉴 SillyTavern 的群聊轮转：几个角色同时在场时，「这一轮谁先开口」由程序定，不再交给模型猜。
   玩家反馈的病根：「握住朱利安的手」却是罗南接话；三个人在场时永远是同一个人在说。

   选人顺序（第一条命中就停）：
     1. 玩家用「对谁说」指定了谁（th.addr）→ 他
     2. 玩家这句话里提到了谁的名字（全名或名）→ 最先提到的那个
     3. 广播式的话（你们 / 大家 / 三个人 / everyone…）→ 2–3 人轮流答，顺序也由程序定
     4. 玩家在接某人的上一句（上一条 AI 台词是他说的）→ 他；但同一个人连着主答 3 轮就换人
     5. 都没有 → 最久没开口的在场角色，好感高的稍微优先
   其他人：最多插一句短话，或者不出声。
   程序只给提示词加一段「TURN ORDER」，模型照着写；写完核对一次第一句是不是主答人，记账可查（__turn()）。 */
(function () {
  "use strict";
  const BROAD = /(你们|大家|各位|三个人|三位|你们俩|你们三个|everyone|you guys|you all|all of you|both of you)/i;
  const KINDS = { user: 1, talk: 1, truth: 1 };

  function nameKeys(id) {
    const c = ch(id); if (!c) return [];
    const out = new Set();
    const add = v => { if (!v) return; if (typeof v === "object") { add(v.zh); add(v.en); return; } v = String(v).trim(); if (v.length >= 2) { out.add(v); const f = v.split(/[\s·・]/)[0]; if (f && f.length >= 2) out.add(f); } };
    add(c.n); add(c.n94); add(c.full);
    return [...out];
  }
  function present(th) {
    let ids = [];
    try { ids = speakersOf(th); } catch (e) { ids = (th.cast || []).slice(); }
    return ids.filter(id => { const c = ch(id); return c && !c.you94 && id !== (th.pk && th.pk.as); });
  }
  function lastAISpeaker(th) {
    const M = th.msgs || [];
    for (let i = M.length - 1; i >= 0 && i >= M.length - 6; i--) {
      const m = M[i];
      if (m.who === "me") continue;
      if (m.ai && m.k === "say" && ch(m.who)) return m.who;
      if (m.k === "box" && m.say && ch(m.say.who)) return m.say.who;
    }
    return null;
  }
  function lastSpokeAt(th, id) {
    const M = th.msgs || [];
    for (let i = M.length - 1; i >= 0; i--) { const m = M[i]; if ((m.who === id && m.k === "say") || (m.say && m.say.who === id)) return i; }
    return -1;
  }

  /* 返回 { lead, order:[ids], why } —— 纯计算，不改线程 */
  function plan(th, ctx) {
    const P = present(th);
    if (P.length < 2) return null;
    const txt = String((ctx && ctx.txt) || "");
    const T = th.turn94 || { leads: [] };
    if (th.addr && P.includes(th.addr)) return { lead: th.addr, order: [th.addr], why: "addr" };
    let best = null, bestPos = Infinity;
    P.forEach(id => nameKeys(id).forEach(k => { const p = txt.indexOf(k); if (p >= 0 && p < bestPos) { bestPos = p; best = id; } }));
    if (best) return { lead: best, order: [best], why: "name" };
    const byQuiet = P.slice().sort((a, b) => {
      const la = lastSpokeAt(th, a), lb = lastSpokeAt(th, b);
      const wa = la - ((th.love && th.love[a]) || 0) / 20, wb = lb - ((th.love && th.love[b]) || 0) / 20;
      return wa - wb;
    });
    if (BROAD.test(txt)) return { lead: byQuiet[0], order: byQuiet.slice(0, Math.min(3, byQuiet.length)), why: "broadcast" };
    const prev = lastAISpeaker(th);
    const streak = (T.leads || []).slice(-3);
    if (prev && P.includes(prev) && !(streak.length === 3 && streak.every(x => x === prev))) return { lead: prev, order: [prev], why: "reply" };
    const pick = byQuiet.find(id => id !== prev) || byQuiet[0];
    return { lead: pick, order: [pick], why: "rotate" };
  }

  /* app3_chat 的回复提示词里调用 */
  window.turnBlock = function (th, ctx) {
    try {
      if (!th || !ctx || !KINDS[ctx.kind]) return "";
      const p = plan(th, ctx); if (!p) return "";
      th.turn94 = th.turn94 || { leads: [], n: 0, miss: 0 };
      th.turn94.pending = p.lead;
      const nm = id => first(ch(id).n);
      if (p.order.length > 1) {
        return "TURN ORDER (decided by the app — follow it): this was said to everyone. They answer in this order: " + p.order.map(nm).join(" → ") + ". Each answers in his own words; no two say the same thing. Anyone else stays quiet or only reacts with a look.";
      }
      return "TURN ORDER (decided by the app — follow it): " + nm(p.lead) + " answers first and carries this turn — the first spoken line of your reply is his. Others may add at most one short line, or stay silent.";
    } catch (e) { console.warn("[turn] plan", e); return ""; }
  };

  /* 写完核对：这一轮第一句台词是不是主答人（只记账，不改内容） */
  if (typeof playBeats === "function") {
    const _pb = playBeats;
    playBeats = async function (th, r) {
      const out = await _pb.apply(this, arguments);
      try {
        const T = th && th.turn94;
        if (T && T.pending) {
          const beats = (r && (r.beats || r.lines)) || [];
          const firstSay = beats.find(b => b && b.who && b.who !== "n" && ch(b.who));
          T.n = (T.n || 0) + 1;
          if (firstSay && firstSay.who !== T.pending) T.miss = (T.miss || 0) + 1;
          T.leads = (T.leads || []).concat([T.pending]).slice(-6);
          T.pending = null;
        }
      } catch (e) { console.warn("[turn] check", e); }
      return out;
    };
  }

  window.turnPlan = plan;
  window.__turn = function () {
    const th = S.threads[curT]; if (!th) return { err: "no thread" };
    return { present: present(th).map(id => first(ch(id).n)), ledger: th.turn94 || null };
  };
})();
