// 阅读节奏（app157）自检：把「太快 / 太乱」的五个成因逐条钉死。
//   node tools/reading-pace-selftest.cjs
//
// 只加载 app157_reply_pace.js，READING 用与 app116 相同语义的最小实现；
// 时间是可推进的虚拟时钟 —— 所以「第 2.9 秒不该放行、第 3.2 秒该放行」是确定性的。
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');

let time = 0, checks = 0, tid = 0;
const timers = new Map();
function later(fn, ms) { const id = ++tid; timers.set(id, { fn, at: time + (ms || 0) }); return id; }
function clear(id) { timers.delete(id); }
function advance(ms) {
  const end = time + ms;
  for (;;) {
    let best = null;
    for (const [id, t] of timers) if (t.at <= end && (!best || t.at < best.t.at)) best = { id, t };
    if (!best) break;
    timers.delete(best.id); time = best.t.at; best.t.fn();
  }
  time = end;
}
const check = (v, m) => { assert.ok(v, m); checks++; };
const noop = () => {};

/* ---- document：只需要 scroll 监听、querySelector、head ---- */
const listeners = { scroll: [], click: [], visibilitychange: [] };
const document = {
  hidden: false,
  addEventListener: (ev, fn) => { (listeners[ev] || (listeners[ev] = [])).push(fn); },
  querySelector: () => null,
  createElement: () => ({ dataset: {}, classList: { add: noop, toggle: noop }, setAttribute: noop, remove: noop, appendChild: noop }),
  head: { appendChild: noop },
};

/* ---- READING：与 app116_reading.js 同一套语义（一个线程同时只有一条在等）---- */
let voiceBusy = false;
const R = {
  pending: new Map(), voice: { busy: () => voiceBusy }, voiceBusy: v => { voiceBusy = v; },
  wait(th, message, kind) {
    if (!th) return Promise.resolve();
    const cur = this.pending.get(th.id);
    if (cur) return cur.promise;
    let resolve; const promise = new Promise(r => { resolve = r; });
    const entry = { message, kind, promise, finish: null };
    entry.finish = () => {
      if (this.pending.get(th.id) !== entry) return;
      this.pending.delete(th.id);
      resolve();
    };
    this.pending.set(th.id, entry);
    return promise;
  },
  advance() {
    const th = S.threads[curT], e = th && this.pending.get(th.id);
    if (!e) return false;
    e.finish(); return true;
  },
};

const S = { threads: {}, pace157: 'normal' };
const th = { id: 't', cast: ['a', 'b'], msgs: [], pk: { q: [] } };
S.threads.t = th;
let curT = 't';
let appended = [], scrolled = 0;

const ctx = {
  console, Map, WeakMap, Promise, Set, Date: class extends Date { static now() { return time; } },
  window: null, document,
  S, curT, save: noop, toast: noop, CL: () => 'zh',
  MIRU_TUNE: { reading: {} },
  READING: R,
  appendMsg: (t, m) => { t.msgs.push(m); appended.push(m); },
  pkAppend: (t, m) => { t.msgs.push(m); appended.push(m); },
  isNarr: m => m && m.pk && m.k !== 'say' && (m.who === 'n' || m.k === 'act' || m.k === 'think') && m.who !== 'me',
  scrollChat: () => { scrolled++; },
  renderChat: noop,
  setTimeout: later, clearTimeout: clear,
  document_placeholder: null,
};
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('source/src/app157_reply_pace.js', 'utf8'), ctx);
const P = ctx.PACE157;
check(!!P, 'app157 exposes its reading API');

const line = n => '一'.repeat(n);
const box = h => ({ id: 'msgs', scrollHeight: h, scrollTop: 0, clientHeight: 100 });
function scrollTo(b, dist) { for (const fn of listeners.scroll) fn({ target: { id: 'msgs', scrollHeight: b.scrollHeight, scrollTop: b.scrollHeight - b.clientHeight - dist, clientHeight: b.clientHeight } }); }

(async () => {
  /* 1. 按阅读时长，而不是固定延时 */
  check(P.dwellFor({ txt: line(17), k: 'say' }, null) === 3110, '17 个汉字停留 3.1 秒（旧版 1.9 秒）');
  check(P.dwellFor({ txt: 'Hello there, friend.', k: 'say' }, null) === 1800, '短句兜底 1.8 秒');
  check(P.dwellFor({ txt: 'Hello there, my dear friend.', k: 'say' }, null) === 900 + 24 * 40, '24 个拉丁字符按 40ms/字符（空白不算）');
  check(P.dwellFor({ txt: line(500), k: 'say' }, null) === 12000, '单条封顶 12 秒，不会无限等');
  check(P.dwellFor({ txt: '嗯', k: 'say' }, null) === 1800, '再短也留 1.8 秒');
  check(P.dwellFor({ who: 'b', txt: '嗯', k: 'say' }, { who: 'a', k: 'say' }) === 2200, '换人说话多留 400ms');
  check(P.dwellFor({ who: 'n', txt: '雨更大了。', k: 'act' }, { who: 'a', k: 'say' }) >= 1800 + 600, '旁白比台词多留一拍');

  /* 2. 点一下才走：永远不自动 */
  P.setMode('tap');
  check(P.dwellFor({ txt: line(17), k: 'say' }, null) === 0, '点按模式没有自动时限');
  th.msgs.length = 0;
  let done = false;
  const tapWait = R.wait(th, { txt: line(17), k: 'say' }, 'ai').then(() => { done = true; });
  advance(600000);
  check(!done, '点按模式下等一小时也不会自己往下走');
  check(R.advance() === true, '点一下立刻放行');
  await tapWait;
  check(done, '点按放行后这一条结束');
  P.setMode('normal');

  /* 3. 自动模式：到点才走，而且不会提前 */
  th.msgs.length = 0;
  done = false;
  const autoWait = R.wait(th, { txt: line(17), k: 'say' }, 'ai').then(() => { done = true; });
  advance(2900);
  check(!done, '3.1 秒之前绝不抢跑');
  advance(400);
  await autoWait;
  check(done, '到阅读时长才自动放行');

  /* 4. 正在朗读：等它读完，再留一拍 */
  th.msgs.length = 0;
  done = false;
  voiceBusy = true;
  const voiceWait = R.wait(th, { txt: line(10), k: 'say' }, 'ai').then(() => { done = true; });
  advance(60000);
  check(!done, '朗读没结束时不推进（不会先出下一句）');
  voiceBusy = false;
  advance(250);
  const left = [...P.clocks.values()][0].left;
  check(left <= 700, '朗读结束后只留尾音，不再等一遍完整阅读时长');
  check(!done, '尾音之内仍然不推进');
  advance(900);
  await voiceWait;
  check(done, '朗读结束 + 尾音后才出下一条');

  /* 5. 往上翻记录：不抢节奏、不拽回底部 */
  th.msgs.length = 0;
  done = false;
  scrollTo(box(5000), 1200);
  const upWait = R.wait(th, { txt: line(12), k: 'say' }, 'ai').then(() => { done = true; });
  advance(60000);
  check(!done, '读者正在往上翻时不自动推进');
  const before = scrolled;
  ctx.scrollChat();
  check(scrolled === before, '往上翻时新消息不把页面拽回底部');
  scrollTo(box(5000), 0);
  advance(60000);
  await upWait;
  check(done, '回到最底部后继续');
  ctx.scrollChat();
  check(scrolled === before + 1, '在底部时照常滚动');

  /* 6. 长文按句分页：不丢字、不拆破引号 */
  const long = '她推开门，雨声一下子灌进来。你站在原地，没有回头。“你终于来了。”他说，声音比记忆里低。' +
    '屋里的灯闪了一下，墙上的影子跟着晃。她把手里的信放在桌上，没有解释那是什么。';
  const pages = P.splitPages(long, 40);
  check(pages.length >= 3, '长文按句分成多页');
  check(pages.every(p => P.visibleLen(p) <= 40), '每一页都不超过上限');
  check(pages.join('').replace(/\s/g, '') === long.replace(/\s/g, ''), '分页不丢任何一个字');
  check(/[。！？…][”’」』）]?$/.test(pages[0]), '页尾落在句末（含收尾引号），不从句子中间切');
  const quoted = '他说：“别走。”然后关上了门。';
  check(P.splitPages(quoted, 8).every(p => !/^[”』）]/.test(p)), '收尾引号不会被切到下一句开头');

  /* 7. 剧本旁白：超过一屏就另起一块（不再压成一墙） */
  th.msgs = [{ k: 'box', pk: 1, say: null, parts: [{ txt: 1 }, { txt: 2 }], txt: '一'.repeat(80) }];
  th._brk = 0;
  ctx.pkAppend(th, { who: 'n', k: 'act', txt: '二'.repeat(40), pk: 1 });
  check(th._brk === 1, '旁白并块超过 100 字就另起一块');

  /* 8. 剧本台词太长：第一页现在显示，其余回到队列（各自计时） */
  th.msgs = []; th.pk.q = [['b', 'say', '下一句']];
  const say = { who: 'a', k: 'say', txt: long + long, pk: 1 };
  ctx.pkAppend(th, say);
  check(P.visibleLen(say.txt) <= 120, '超长台词先只显示第一页');
  check(th.pk.q.length > 1, '剩下的页回到队列');
  check(th.pk.q[0][0] === 'a' && th.pk.q[0][1] === 'say', '回到队列的是同一个角色、同一种拍');
  const all = [say.txt].concat(th.pk.q.filter(b => b[0] === 'a' && b[1] === 'say').map(b => b[2]));
  check(all.join('').replace(/\s/g, '') === (long + long).replace(/\s/g, ''), '分页后仍然一个字都没少');

  console.log('阅读节奏：' + checks + ' 项通过。按阅读时长放行 / 点按优先 / 朗读尾音 / 翻记录不抢 / 长文分页 / 并块封顶。');
})().catch(e => { console.error(e); process.exitCode = 1; });
