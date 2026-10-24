/* ================= 状态写入层 v1（唯一写入口）=================
   规格 v7.11 §04.6「状态投影的唯一写入点」：
     模型和剧情都只能"提议"，真正的写入只在这里发生。
   规矩（tools/status-contract.mjs 会数）：
     1. 任何 `th.love[x] = …` 都改成 loveWrite(th, x, delta, reason)
     2. 直接写入的处数只许降、不许升（基线写在契约脚本里）
     3. 每次写入留一条 loveLog：谁改的、改了多少、为什么
   为什么要它：29 个地方各加各的，好感涨得比剧情快、同一局两次结果不同、
   出了问题查不到是谁加的（见 SPEC-AUDIT.md #11）。
   ⚠️ 这一层只做「夹值 + 记账」，不改变任何现有数值走向；
      剧本/游戏原来加多少还是加多少，超过单次上限才会被拦。 */

const LOVE_MIN = 0, LOVE_MAX = 100, LOVE_DELTA_CAP = 12;

function loveLog(th, ev) {
  try {
    th.loveLog = th.loveLog || [];
    th.loveLog.push(ev);
    if (th.loveLog.length > 300) th.loveLog = th.loveLog.slice(-300);
  } catch (_) {}
}

/**
 * @param {object} th      会话（thread）
 * @param {string} id      角色 id
 * @param {number} delta   增量（正负都行；绝对值请用 opts.absolute）
 * @param {string} reason  来源标记：'model' | 'pack:A' | 'ending:A' | 'gift' | 'date' | …
 * @param {object} opts    {absolute?:number, floor?:number, cap?:number}
 * @returns {{before:number, after:number, delta:number, skipped?:string}|null}
 */
function loveWrite(th, id, delta, reason, opts) {
  try {
    if (!th || !id) return null;
    th.love = th.love || {};
    const o = opts || {};
    // 初始化：这个角色还没有数值时，absolute 直接落值（原来那句 th.love[c]=5）
    if (th.love[id] == null && o.absolute != null) {
      const v = Math.max(LOVE_MIN, Math.min(LOVE_MAX, Math.round(Number(o.absolute))));
      th.love[id] = v;
      loveLog(th, { id, from: null, to: v, delta: 0, reason: String(reason || ''), at: Date.now() });
      return { before: null, after: v, delta: 0 };
    }
    const before = th.love[id] == null ? 5 : th.love[id];
    let after;
    if (o.absolute != null) {
      after = Number(o.absolute);
      if (o.floor != null) after = Math.max(after, before);      // Math.max(旧值, 下限) 的语义
    } else {
      const cap = o.cap == null ? LOVE_DELTA_CAP : Math.abs(Number(o.cap) || LOVE_DELTA_CAP);
      const d = Math.max(-cap, Math.min(cap, Number(delta) || 0));
      after = before + d;
      if (o.floor != null) after = Math.max(after, Number(o.floor));
    }
    after = Math.max(LOVE_MIN, Math.min(LOVE_MAX, Math.round(after)));
    if (after === before) return { before, after, delta: 0, skipped: 'no-change' };
    th.love[id] = after;
    loveLog(th, { id, from: before, to: after, delta: after - before, reason: String(reason || ''), at: Date.now() });
    return { before, after, delta: after - before };
  } catch (_) { return null }
}

/** 本局一共改了多少次、每个角色净变化多少（复核用） */
function loveReport(th) {
  const log = (th && th.loveLog) || [];
  const per = {};
  for (const e of log) {
    per[e.id] = per[e.id] || { n: 0, net: 0, reasons: {} };
    per[e.id].n++; per[e.id].net += e.delta;
    per[e.id].reasons[e.reason] = (per[e.id].reasons[e.reason] || 0) + e.delta;
  }
  return { writes: log.length, per };
}
