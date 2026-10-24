/* ================= 角色卡 · 每章一份快照（v2）=================
   设计见 CHARACTER-CARD.md。v2 改了一处关键结构：**补丁按角色分开存**。
   为什么：卡是"某个人的卡"，可变快照（好感/心情）也是每个角色各自的；
   一条补丁里塞所有人的值，折叠时必然串味。所以：

     th.cardLog = { <cid>: [ patch@ch1, patch@ch2, … ], … }

   五类字段（规矩由 tools/card-selftest.mjs 逐条盯着）：
     ① immutable  作者写，永不改
     ② mutable    每章一个**绝对快照**（好感本身已由 loveWrite 累过，卡只记"章末他什么样"）
     ③ monotonic  knows / gave / lost / said / firsts —— 只增；早期章节看不到后来的
     ④ stance     只能加码，不能归零
     ⑤ revealed   不改卡上的秘密本身，只记"谁知道了"
   ⚠️ 接线做了最小一版：章末提交 ② 快照 + ③ said/firsts。
      stance / revealed 需要内容里有标记才能算，不猜 —— 留给下一步。 */

const CARD_MONO = ["knows", "gave", "lost", "said"];
const CARD_FIRSTS = "firsts";

function cardBase(cid) {
  const c = (typeof ch === "function" && ch(cid)) || {};
  return {
    id: cid,
    immutable: {
      name: c.n || cid, age: c.age, role: c.role, looks: c.looks,
      vibe: c.vibe, tells: c.tells, twist: c.twist, likes: c.likes, boundary: c.boundary
    },
    secret: c.secret || null
  };
}

function cardPatch(ch0, delta) {
  const d = delta || {};
  const p = { ch: ch0 };
  if (d.mutable) p.mutable = Object.assign({}, d.mutable);
  const added = {};
  for (const k of CARD_MONO) if (Array.isArray(d[k]) && d[k].length) added[k] = d[k].slice();
  if (d[CARD_FIRSTS] && typeof d[CARD_FIRSTS] === "object") added[CARD_FIRSTS] = Object.assign({}, d[CARD_FIRSTS]);
  if (Object.keys(added).length) p.added = added;
  if (d.stance && typeof d.stance === "object") {
    const st = {};
    for (const k in d.stance) { const v = Number(d.stance[k]) || 0; if (v) st[k] = v; }
    if (Object.keys(st).length) p.stance = st;
  }
  if (d.revealed && typeof d.revealed === "object") p.revealed = Object.assign({}, d.revealed);
  return p;
}

/** 追加一条补丁给**某个角色**。同一角色同一章重复提交会被拒（章末只该触发一次）。 */
function cardCommit(th, cid, ch0, delta) {
  try {
    if (!th || !cid) return { ok: false, why: "no-thread" };
    th.cardLog = th.cardLog || {};
    const list = th.cardLog[cid] = th.cardLog[cid] || [];
    if (list.some(p => p.ch === ch0)) return { ok: false, why: "already-committed", ch: ch0 };
    const p = cardPatch(ch0, delta);
    if (Object.keys(p).length <= 1) return { ok: false, why: "empty-patch", ch: ch0 };
    list.push(p);
    list.sort((a, b) => a.ch - b.ch);
    return { ok: true, ch: ch0 };
  } catch (_) { return { ok: false, why: "error" } }
}

/** 把某个角色前 ch 条补丁折成"此刻的他"。ch = 0 表示还没进第 1 章。 */
function cardAt(th, cid, ch0) {
  const base = cardBase(cid);
  const out = {
    id: cid, immutable: base.immutable, secret: base.secret,
    mutable: {}, knows: [], gave: [], lost: [], said: [], firsts: {},
    stance: {}, revealed: {}
  };
  const list = ((th && th.cardLog && th.cardLog[cid]) || []).slice().sort((a, b) => a.ch - b.ch);
  for (const p of list) {
    if (p.ch > ch0) continue;
    if (p.mutable) Object.assign(out.mutable, p.mutable);
    if (p.added) {
      for (const k of CARD_MONO) if (Array.isArray(p.added[k])) out[k] = out[k].concat(p.added[k]);
      if (p.added[CARD_FIRSTS]) out.firsts = Object.assign(out.firsts, p.added[CARD_FIRSTS]);
    }
    if (p.stance) for (const k in p.stance) out.stance[k] = (out.stance[k] || 0) + p.stance[k];
    if (p.revealed) for (const k in p.revealed) out.revealed[k] = p.revealed[k];
  }
  return out;
}

function cardDiff(th, cid, ch0) {
  const a = cardAt(th, cid, ch0 - 1), b = cardAt(th, cid, ch0);
  const d = { mutable: {}, added: {}, stance: {}, revealed: {} };
  for (const k in b.mutable) if (b.mutable[k] !== a.mutable[k]) d.mutable[k] = { from: a.mutable[k], to: b.mutable[k] };
  for (const k of CARD_MONO) if (b[k].length > a[k].length) d.added[k] = b[k].slice(a[k].length);
  for (const k in b.firsts) if (!(k in a.firsts)) (d.added.firsts = d.added.firsts || {})[k] = b.firsts[k];
  for (const k in b.stance) if ((b.stance[k] || 0) !== (a.stance[k] || 0)) d.stance[k] = b.stance[k];
  for (const k in b.revealed) if (!(k in a.revealed)) d.revealed[k] = b.revealed[k];
  return d;
}

/** 章末：把这一章发生的事按**规则**翻成每个角色的补丁（不让模型写卡）。
 *  只翻现在能可靠算的三样：②可变快照、③said（台词）、③firsts（第 n 章选了哪个）。
 *  stance / revealed 要内容里有标记才算得出来，今天没有 ⇒ 不猜。 */
function cardCommitChapter(th, n, k) {
  try {
    if (!th || !Array.isArray(th.cast)) return 0;
    const w = (typeof wd === "function") ? wd(th.wid) : null;
    const chObj = w && w.pack && w.pack.chapters && w.pack.chapters[n - 1];
    const pick = (chObj && chObj.choices || []).find(c => c.k === k);
    let done = 0;
    for (const cid of th.cast) {
      if (th.pk && cid === th.pk.as) continue;          // 玩家自己那个不是"角色卡"
      const delta = {
        mutable: { love: Number(th.love && th.love[cid]) || 0, stage: (typeof stageOf === "function" ? stageOf(th, cid) : 0) },
        firsts: { ["ch" + n]: k }
      };
      // ⚠️ 真实数据里 c.then 是**本地化对象** {en,zh,ja,ko,es}，不是数组（第一版写错了，
      //    夹具也用数组，于是测试通过而线上永远是空的）
      const branch = pick && pick.then && (pick.then[(typeof CL === "function" ? CL() : "en")] || pick.then.zh || pick.then.en) || [];
      if (Array.isArray(branch)) {
        const said = [];
        for (const b of branch) if (b && b[1] === "say" && b[2]) said.push(String(b[2]).slice(0, 80));
        if (said.length) delta.said = said;
      }
      // 内容标记（旁档 MIRU_MARKS）：④立场 与 ⑤揭示 只有作者标了才算数，不猜
      try {
        const MK = (typeof MIRU_MARKS !== "undefined" && MIRU_MARKS[th.wid]) || null;
        const one = MK && MK.chapters && MK.chapters[String(n)];
        if (one) {
          if (one.breaks && one.breaks[cid] && typeof one.breaks[cid] === "object") delta.stance = Object.assign({}, one.breaks[cid]);
          if (one.reveals && one.reveals[cid]) delta.revealed = { secret: one.reveals[cid] };
        }
      } catch (_) {}
      if (cardCommit(th, cid, n, delta).ok) done++;
    }
    return done;
  } catch (_) { return 0 }
}

/** 卡里"他已经知道 / 记得什么"的紧凑摘要（给 prompt 用，最多三样）。 */
function cardMemo(th, cid, ch0) {
  try {
    const c = cardAt(th, cid, ch0);
    const parts = [];
    if (c.knows.length) parts.push("知道：" + c.knows.slice(-3).join(" / "));
    if (c.said.length) parts.push("他说过：" + c.said.slice(-2).map(s => "“" + s + "”").join(" "));
    const st = Object.keys(c.stance || {});
    if (st.length) parts.push("立场：" + st.map(k => k + "×" + c.stance[k]).join(" "));
    return parts.join(" · ");
  } catch (_) { return "" }
}

/** 这一章每个角色"变了什么"（纯数据，不含文案；给章末那张卡用）。只返回真的有变化的。 */
function cardChanges(th, ch0) {
  const out = [];
  try {
    for (const cid of (th.cast || [])) {
      if (th.pk && cid === th.pk.as) continue;
      const d = cardDiff(th, cid, ch0);
      const love = d.mutable && d.mutable.love;
      const dl = love ? (Number(love.to) || 0) - (Number(love.from) || 0) : 0;
      const stance = Object.keys(d.stance || {}).length;
      const knows = (d.added && d.added.knows ? d.added.knows.length : 0);
      const revealed = Object.keys(d.revealed || {}).length;
      if (dl || stance || knows || revealed) {
        out.push({ cid: cid, loveDelta: dl, loveTo: love ? love.to : undefined, stance: d.stance || {}, knows: knows, revealed: revealed });
      }
    }
  } catch (_) {}
  return out;
}
