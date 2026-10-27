// 错误日志的自检（闸）：验证「**2 分钟淘汰**」这件事真的会发生
//   判据（可数）：塞 3 条，其中两条已超时 ⇒ 只应剩下 1 条，且 dropped 计数 +2。
import fs from 'node:fs';

const src = fs.readFileSync('source/src/app108_errlog.js', 'utf8');

let pass = 0, fail = 0;
const t = (n, ok, extra) => { console.log('  ' + (ok ? '✓' : '✗') + ' ' + n + (extra ? ' — ' + extra : '')); ok ? pass++ : fail++ };

t('模块里写死了 2 分钟窗口', /ERRLOG_TTL\s*=\s*2\s*\*\s*60\s*\*\s*1000/.test(src), '2 * 60 * 1000');
t('三个来源都收', ['window.addEventListener(\'error\'', 'unhandledrejection', 'console.error = function'].every(s => src.includes(s)));

// 行为测试：把模块单独求值（给它最小 window / console / localStorage / fetch 替身）
let behaved = false, detail = '';
try {
  const items = [];
  const fakeWin = {
    addEventListener: (ev, fn) => { (fakeWin._h = fakeWin._h || {})[ev] = fn },
  };
  const fakeConsole = { error: () => {} };
  const fakeLS = { setItem: () => {}, getItem: () => null };
  const fakeLoc = { hostname: 'sandbox' };            // 非本地 ⇒ 不发请求
  const fn = new Function('window', 'console', 'localStorage', 'location', 'fetch', 'setTimeout', src + '\nreturn window.__errlog;');
  const __errlog = fn(fakeWin, fakeConsole, fakeLS, fakeLoc, () => Promise.reject(), (f) => f());

  // 直接调用内部 push：先塞两条「3 分钟前」的，再塞一条「现在」的
  const ERR = fakeWin.ERRLOG;
  ERR.items = [
    { at: Date.now() - 180000, kind: 'error', msg: 'old-1' },
    { at: Date.now() - 170000, kind: 'error', msg: 'old-2' },
  ];
  ERR.push('error', 'fresh');
  const snap = __errlog(true);
  const kept = snap.条目.map(x => x.msg);
  behaved = kept.length === 1 && kept[0] === 'fresh' && snap.汇总.已淘汰 >= 2;
  detail = '剩 ' + JSON.stringify(kept) + ' · 淘汰 ' + snap.汇总.已淘汰;
} catch (e) { detail = '求值失败: ' + e.message }

t('超过 2 分钟的条目被淘汰，只留新的', behaved, detail);

console.log('\n' + pass + ' passed, ' + fail + ' failed');
if (fail) { console.log('FAILED: 错误日志的淘汰策略不成立'); process.exit(1) }
console.log('errlog OK');
