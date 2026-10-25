// Ledger — turns raw analytics rows into (a) a CSV you can open anywhere and (b) a summary
// you can read at a glance. Pure functions only: no DB, no fetch, no time. So it can be
// tested offline (tools/ledger-selftest.mjs) and the numbers can be trusted before they matter.
//
// Column contract (CSV): user,session,work,chapter,event,choice,ms,client_at,server_at,props
// Choice/timing events the app should send (see LEDGER.md §2):
//   chapter_open {wid, ch, sess, t}        t = client epoch ms
//   choice_pick  {wid, ch, sess, key, t}   key = "A" | "B" | "C"
//   chapter_done {wid, ch, sess, t}
//   story_end    {wid, sess, ending, t}

const COLS = ['user', 'session', 'work', 'chapter', 'event', 'choice', 'ms', 'client_at', 'server_at', 'props'];

function q(v) {
  if (v === undefined || v === null) return '';
  const s = String(v);
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

/** db row {user_id,name,props,at} -> flat record */
function norm(r) {
  const p = (r && r.props) || {};
  return {
    user: r && r.user_id != null ? r.user_id : '',
    session: p.sess != null ? p.sess : '',
    work: p.wid != null ? p.wid : '',
    chapter: p.ch != null ? p.ch : '',
    event: (r && r.name) || '',
    choice: p.key != null ? p.key : (p.ending != null ? p.ending : ''),
    ms: p.ms != null ? p.ms : '',
    client_at: p.t != null ? p.t : '',
    server_at: r && r.at ? new Date(r.at).toISOString() : '',
    props: JSON.stringify(p),
  };
}

function csv(rows) {
  const out = [COLS.join(',')];
  for (const r of rows) {
    const n = norm(r);
    out.push(COLS.map(c => q(n[c])).join(','));
  }
  return out.join('\n') + '\n';
}

const median = xs => {
  if (!xs.length) return null;
  const a = [...xs].sort((x, y) => x - y), m = a.length >> 1;
  return a.length % 2 ? a[m] : Math.round((a[m - 1] + a[m]) / 2);
};

/**
 * Funnel + choice distribution + chapter duration, per work.
 * Denominator rules (they are the whole point — a rate without a denominator is not a reading):
 *  - a "session" is any session with a chapter_open for that work
 *  - completion uses that same set, never "all events"
 *  - duration is server-clock (server_at) inside one session+chapter pair; client time is kept
 *    in the CSV only as a drift diagnostic
 */
function summary(rows) {
  const byWork = new Map();
  const sess = new Map(); // work|sess -> {work, sess, opened:Set, done:Set, picks:[], opens:Map}

  for (const r of rows) {
    const n = norm(r);
    if (!n.work) continue;
    if (!byWork.has(n.work)) byWork.set(n.work, { work: n.work, events: 0 });
    byWork.get(n.work).events++;
    const sk = n.work + '|' + (n.session || n.user || 'anon');
    if (!sess.has(sk)) sess.set(sk, { work: n.work, sess: sk, opened: new Set(), done: new Set(), picks: [], opens: new Map() });
    const s = sess.get(sk);
    if (n.event === 'chapter_open') { s.opened.add(Number(n.chapter)); s.opens.set(Number(n.chapter), n.server_at); }
    if (n.event === 'chapter_done') s.done.add(Number(n.chapter));
    if (n.event === 'choice_pick') s.picks.push({ ch: Number(n.chapter), key: n.choice });
  }

  for (const s of sess.values()) {
    const w = byWork.get(s.work);
    // a "session" is a run that actually entered a chapter. A story_start with no chapter_open
    // is a funnel step (opened, never entered), not a run — counting it would poison every rate.
    if (!s.opened.size) continue;
    w.sessions = (w.sessions || 0) + 1;
    w.chapters = w.chapters || {};
    for (const ch of s.opened) {
      const c = (w.chapters[ch] = w.chapters[ch] || { opened: 0, done: 0, dur: [], choices: {} });
      c.opened++;
      if (s.done.has(ch)) c.done++;
    }
    for (const p of s.picks) {
      const c = (w.chapters[p.ch] = w.chapters[p.ch] || { opened: 0, done: 0, dur: [], choices: {} });
      c.choices[p.key] = (c.choices[p.key] || 0) + 1;
    }
  }

  // chapter duration: first open -> (first done after it) inside the same session
  const durByWorkCh = new Map();
  for (const r of rows) {
    const n = norm(r);
    if (n.event !== 'chapter_done' || !n.work || !n.server_at) continue;
    const sk = n.work + '|' + (n.session || n.user || 'anon');
    const s = sess.get(sk);
    if (!s) continue;
    const openAt = s.opens.get(Number(n.chapter));
    if (!openAt) continue;
    const ms = new Date(n.server_at) - new Date(openAt);
    if (ms < 0) continue;
    const k = n.work + '|' + Number(n.chapter);
    if (!durByWorkCh.has(k)) durByWorkCh.set(k, []);
    durByWorkCh.get(k).push(ms);
  }
  for (const [k, list] of durByWorkCh) {
    const [work, ch] = k.split('|');
    const w = byWork.get(work);
    w.chapters = w.chapters || {};
    const c = (w.chapters[ch] = w.chapters[ch] || { opened: 0, done: 0, dur: [], choices: {} });
    c.dur = list;
  }

  // finalize: shares + medians
  const works = [];
  for (const w of byWork.values()) {
    const chs = {};
    for (const [ch, c] of Object.entries(w.chapters || {})) {
      const total = Object.values(c.choices).reduce((a, b) => a + b, 0);
      const choices = {};
      // sorted keys on purpose: an export that reorders itself between runs is not diffable
      for (const k of Object.keys(c.choices).sort()) choices[k] = { n: c.choices[k], share: total ? +(c.choices[k] / total).toFixed(3) : null };
      chs[ch] = { opened: c.opened, done: c.done, done_rate: c.opened ? +(c.done / c.opened).toFixed(3) : null, median_ms: median(c.dur), choices };
    }
    works.push({ work: w.work, sessions: w.sessions || 0, events: w.events, chapters: chs });
  }
  works.sort((a, b) => (b.sessions - a.sessions) || a.work.localeCompare(b.work));
  return { works };
}

/**
 * Retention (D1 / D7) over the same rows. Cohort = the first day a user shows up IN THIS WINDOW,
 * and a user only counts toward D1/D7 if that later day is inside the window — otherwise a
 * 7-day window would report D7 = 0 for everyone simply because the future has not happened yet.
 */
function retention(rows) {
  const dayOf = iso => String(iso).slice(0, 10);
  const plus = (d, k) => { const t = new Date(d + 'T00:00:00Z'); t.setUTCDate(t.getUTCDate() + k); return t.toISOString().slice(0, 10); };
  const byUser = new Map();
  for (const r of rows) {
    const n = norm(r);
    if (!n.user || !n.server_at) continue;
    if (!byUser.has(n.user)) byUser.set(n.user, new Set());
    byUser.get(n.user).add(dayOf(n.server_at));
  }
  const allDays = [...new Set([...byUser.values()].flatMap(s => [...s]))].sort();
  const lastDay = allDays[allDays.length - 1] || null;
  let d1n = 0, d1d = 0, d7n = 0, d7d = 0;
  for (const set of byUser.values()) {
    const first = [...set].sort()[0];
    const one = plus(first, 1), seven = plus(first, 7);
    if (lastDay && one <= lastDay) { d1d++; if (set.has(one)) d1n++; }
    if (lastDay && seven <= lastDay) { d7d++; if (set.has(seven)) d7n++; }
  }
  return {
    users: byUser.size, days: allDays.length, first_day: allDays[0] || null, last_day: lastDay,
    d1: d1d ? +(d1n / d1d).toFixed(3) : null, d1_n: d1n, d1_den: d1d,
    d7: d7d ? +(d7n / d7d).toFixed(3) : null, d7_n: d7n, d7_den: d7d,
  };
}

/**
 * The paid gate: of the sessions that ENTERED a chapter, how many finished it.
 * With today's events this is the only unlock signal we have — finishing ch3 means the paywall
 * was passed, but "didn't buy" and "left for the bus" look the same. A `paywall` event would
 * separate them; until then this number is an upper bound on conversion and a lower bound on
 * the drop caused by the wall.
 */
function gates(rows, chapter) {
  const ch = Number(chapter) || 3;
  const s = new Map();
  for (const r of rows) {
    const n = norm(r);
    if (!n.work || Number(n.chapter) !== ch) continue;
    if (n.event !== 'chapter_open' && n.event !== 'chapter_done' && n.event !== 'paywall') continue;
    const k = n.work + '|' + (n.session || n.user || 'anon');
    if (!s.has(k)) s.set(k, { open: false, done: false, wall: false });
    const o = s.get(k);
    if (n.event === 'chapter_open') o.open = true;
    else if (n.event === 'chapter_done') o.done = true;
    else o.wall = true;
  }
  let opened = 0, passed = 0, wall = 0;
  for (const o of s.values()) if (o.open) { opened++; if (o.done) passed++; if (o.wall) wall++; }
  return {
    chapter: ch, opened, passed, wall,
    rate: opened ? +(passed / opened).toFixed(3) : null,
    // shown the wall and did not come through it: the only honest "the paywall cost us this one"
    left_at_wall: wall ? wall - passed : null,
    note: wall ? 'wall = the paywall was shown; left_at_wall = shown but never finished this chapter'
      : 'no paywall events in range: rate still mixes "did not buy" with "left for the bus"',
  };
}

module.exports = { COLS, csv, summary, retention, gates, norm, median };
