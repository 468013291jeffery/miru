// Transcript — turn a player's saved app state into a plain .txt you can read or grep.
// Pure (no db, no fs, no clock): tools/ledger-selftest.mjs exercises it offline.
//
// Input is what /api/state stores (states.data): the whole app state `S`, whose `threads` map
// looks like { tid: { wid, cast: [ids], msgs: [{who, k, txt|title, at}] } }.
// Kinds seen in msgs (source/src/app12_beats.js, app3_chat.js): say / act / think / card / pic / …
// Anything that is not plain dialogue is rendered as a short bracket tag, never silently dropped.

const pad = n => (n < 10 ? '0' : '') + n;

function stamp(ms) {
  if (!ms) return '—';
  const d = new Date(Number(ms));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function lineOf(m) {
  const who = m.who || m.from || '?';
  const k = m.k || m.kind || 'say';
  if (k === 'pic' || m.src) return `[${who}] [图片] ${m.src || ''}`.trim();
  if (k === 'card') return `[${who}] [${m.title || '卡片'}] ${m.txt || ''}`.trim();
  const txt = String(m.txt != null ? m.txt : (m.text != null ? m.text : '')).replace(/\s+/g, ' ').trim();
  if (!txt) return null;
  if (k === 'think') return `${who}（心里）：${txt}`;
  if (k === 'act') return `* ${txt}`;
  return `${who}：${txt}`;
}

/**
 * @param {object|string} data  states.data (object or JSON string)
 * @param {number} limit        max dialogue lines, keeping the MOST RECENT
 */
function transcript(data, limit) {
  let S = data;
  if (typeof S === 'string') { try { S = JSON.parse(S); } catch (_) { S = null; } }
  const cap = Math.max(1, Math.min(Number(limit) || 200, 20000));
  if (!S || typeof S !== 'object') return { text: '（这个账号没有可读的云存档）\n', lines: 0, threads: 0 };

  const threads = S.threads && typeof S.threads === 'object' ? S.threads : {};
  const picked = [];
  let all = 0;
  for (const [tid, th] of Object.entries(threads)) {
    const msgs = Array.isArray(th && th.msgs) ? th.msgs : [];
    const rows = [];
    for (const m of msgs) {
      const l = lineOf(m || {});
      if (l) rows.push({ at: Number(m.at) || 0, txt: l });
    }
    all += rows.length;
    if (rows.length) picked.push({ tid, wid: (th && th.wid) || '', cast: (th && th.cast) || [], rows });
  }
  picked.sort((a, b) => (b.rows[b.rows.length - 1].at || 0) - (a.rows[a.rows.length - 1].at || 0));

  // keep the most recent `cap` lines overall, then restore chronological order per thread
  let budget = cap, kept = [];
  for (const t of picked) {
    if (budget <= 0) break;
    const slice = t.rows.slice(-budget);
    budget -= slice.length;
    kept.push(Object.assign({}, t, { rows: slice }));
  }
  kept.sort((a, b) => (a.rows[0].at || 0) - (b.rows[0].at || 0));

  const out = [];
  const keptLines = kept.reduce((n, t) => n + t.rows.length, 0);
  out.push(`MIRU 对话记录 · ${stamp(Date.now())} · 导出 ${keptLines} 条（存档共 ${all} 条，${Object.keys(threads).length} 个线程）`);
  out.push('');
  for (const t of kept) {
    out.push(`── 线程 ${t.tid}${t.wid ? ' · 作品 ' + t.wid : ''}${t.cast.length ? ' · 角色 ' + t.cast.join(',') : ''} ──`);
    for (const r of t.rows) out.push(`[${stamp(r.at)}] ${r.txt}`);
    out.push('');
  }
  return { text: out.join('\n').replace(/\n+$/, '') + '\n', lines: keptLines, threads: kept.length, total: all };
}

module.exports = { transcript, lineOf, stamp };
