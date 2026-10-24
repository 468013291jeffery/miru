/* ================= 角色卡 · 每章一份快照（v1）=================
   设计见 CHARACTER-CARD.md。这里只放**纯函数**，不碰运行时：
     cardBase(cid)              ① 不可变底（作者写，永不改）
     cardPatch(ch, delta)       组一条补丁（只装"这一章改变了什么"）
     cardCommit(th, ch, delta)  追加一条到 th.cardLog（append-only）
     cardAt(th, cid, ch)        把前 ch 条折成"此刻的他"
   四条硬规矩（tools/card-selftest.mjs 逐条盯着）：
     1. 只增类（knows/gave/lost/firsts/said）**永远不会被后来的补丁删掉**，但**早期章节看不到后来的**
     2. 立场（stance）只能加码，不能清零
     3. 揭示（revealed）**不改卡上的秘密本身**
     4. 同一份 cardLog 重算两次，结果逐字节相同（可回放）
   ⚠️ 这一版没有接进 packAfterPick：先让函数可测、可回放，接线上是下一步。 */

const CARD_MONO = ["knows", "gave", "lost", "said"];      // 只增数组
const CARD_FIRSTS = "firsts";                            // 只增键值（第一次做了什么）

function cardBase(cid) {
  const c = (typeof ch === "function" && ch(cid)) || {};
  return {
    id: cid,
    immutable: {
      name: c.n || cid, age: c.age, role: c.role, looks: c.looks,
      vibe: c.vibe, tells: c.tells, twist: c.twist, likes: c.likes, boundary: c.boundary
    },
    secret: c.secret || null          // ① 不可变；只有"揭示"能改变谁能看到它，不改它本身
  };
}

/** 组一条补丁。delta 只写"变化"，没写到的类别保持原样。 */
function cardPatch(ch, delta) {
  const d = delta || {};
  const p = { ch: ch };
  if (d.mutable) p.mutable = Object.assign({}, d.mutable);
  const added = {};
  for (const k of CARD_MONO) if (Array.isArray(d[k]) && d[k].length) added[k] = d[k].slice();
  if (d[CARD_FIRSTS] && typeof d[CARD_FIRSTS] === "object") added[CARD_FIRSTS] = Object.assign({}, d[CARD_FIRSTS]);
  if (Object.keys(added).length) p.added = added;
  if (d.stance && typeof d.stance === "object") {
    p.stance = {};
    for (const k in d.stance) {
      const v = Number(d.stance[k]) || 0;
      if (v) p.stance[k] = v;
    }
    if (!Object.keys(p.stance).length) delete p.stance;
  }
  if (d.revealed && typeof d.revealed === "object") p.revealed = Object.assign({}, d.revealed);
  return p;
}

/** 追加一条补丁。同一章重复提交会被忽略（章末只该触发一次）。 */
function cardCommit(th, ch, delta) {
  try {
    th.cardLog = th.cardLog || [];
    if (th.cardLog.some(p => p.ch === ch)) return { ok: false, why: "already-committed", ch: ch };
    const p = cardPatch(ch, delta);
    if (Object.keys(p).length <= 1) return { ok: false, why: "empty-patch", ch: ch };
    th.cardLog.push(p);
    th.cardLog.sort((a, b) => a.ch - b.ch);
    return { ok: true, ch: ch };
  } catch (_) { return { ok: false, why: "error" } }
}

/** 把前 ch 条补丁折成"此刻的他"。ch = 0 表示还没进第 1 章。 */
function cardAt(th, cid, ch) {
  const base = cardBase(cid);
  const out = {
    id: cid,
    immutable: base.immutable,
    secret: base.secret,
    mutable: {},
    knows: [], gave: [], lost: [], said: [], firsts: {},
    stance: {}, revealed: {}
  };
  const log = ((th && th.cardLog) || []).slice().sort((a, b) => a.ch - b.ch);   // 补丁顺序无关，按章折
  for (const p of log) {
    if (p.ch > ch) continue;                       // 只看这一章及以前
    // 可变类记的是**这一章结束时的值**（绝对快照），不是增量：好感本身已经由 loveWrite 累过了，
    // 卡只负责"章末他是什么样"。这样折叠与补丁顺序无关，回放也稳定。
    if (p.mutable) Object.assign(out.mutable, p.mutable);
    if (p.added) {
      for (const k of CARD_MONO) if (Array.isArray(p.added[k])) out[k] = out[k].concat(p.added[k]);
      if (p.added[CARD_FIRSTS]) out.firsts = Object.assign(out.firsts, p.added[CARD_FIRSTS]);
    }
    if (p.stance) for (const k in p.stance) out.stance[k] = (out.stance[k] || 0) + p.stance[k];   // 只能加码
    if (p.revealed) for (const k in p.revealed) out.revealed[k] = p.revealed[k];
  }
  return out;
}

/** 这一章他变了什么（给玩家看的小卡 / 给作者校对用） */
function cardDiff(th, cid, ch) {
  const a = cardAt(th, cid, ch - 1), b = cardAt(th, cid, ch);
  const d = { mutable: {}, added: {}, stance: {}, revealed: {} };
  for (const k in b.mutable) if (b.mutable[k] !== a.mutable[k]) d.mutable[k] = { from: a.mutable[k], to: b.mutable[k] };
  for (const k of CARD_MONO) if (b[k].length > a[k].length) d.added[k] = b[k].slice(a[k].length);
  for (const k in b.firsts) if (!(k in a.firsts)) d.added[k] = b.firsts[k];
  for (const k in b.stance) if ((b.stance[k] || 0) !== (a.stance[k] || 0)) d.stance[k] = b.stance[k];
  for (const k in b.revealed) if (!(k in a.revealed)) d.revealed[k] = b.revealed[k];
  return d;
}
