// 「say 的三个说话人，走的其实是三条路」探针（2026-10-27 · 只读，不产改动）
//
//   用途：把「都是 say、却各画各的」量成一张表 —— 谁画的、装饰位齐不齐、有没有层抛错被吞掉。
//   判据：同一类 say，装饰位应该一样齐；不齐的那几格就是要统一的地方。
//
//   用法：node tools/speaker-probe.mjs
import { spawnSync } from 'node:child_process';

const PORT = process.env.MIRU_PORT || 8131;
const PAGE = 'http://127.0.0.1:' + PORT + '/tools/speaker-probe.html';
const EDGE = process.env.MIRU_EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const unesc = s => String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

const r = spawnSync(EDGE, ['--headless=new', '--disable-gpu', '--no-sandbox',
  '--virtual-time-budget=20000', '--dump-dom', PAGE], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
const m = /<pre id="out"[^>]*>([\s\S]*?)<\/pre>/.exec(r.stdout || '');
if (!m) { console.log('✗ 拿不到读数（本地服务要跑在 ' + PORT + '）'); process.exit(2) }
const raw = unesc(m[1]);
if (raw.startsWith('ERR')) { console.log('✗ ' + raw.slice(0, 120)); process.exit(2) }
let data;
try { data = JSON.parse(raw.replace(/^SPEAKER_JSON:/, '')) } catch (e) { console.log('✗ 解析失败：' + e.message); process.exit(2) }
if (data.fatal) { console.log('✗ 探针自己崩了：' + data.fatal); process.exit(2) }

const pad = (s, n) => { const t = String(s); return t + ' '.repeat(Math.max(0, n - t.length)) };
const COLS = ['谁在说', '归哪层画', '气泡', '头像', '名字', '色条', '工具', '动作高亮', '快捷', '长度'];
const W = [10, 34, 8, 6, 6, 6, 6, 10, 10, 8];

console.log('say 的三个说话人：各走哪条路、装饰位齐不齐\n');
console.log('  ' + COLS.map((c, i) => pad(c, W[i])).join(''));
for (const x of data.rows) {
  console.log('  ' + [
    x.谁在说, x.归哪层画, x.气泡, x.头像, x.名字, x.色条, x.工具, x.动作高亮, x.快捷已删, x.长度
  ].map((v, i) => pad(v, W[i])).join('')
    + (x.层内抛错 ? '  ⚠ 层内抛错：' + x.层内抛错 + (x.错文 ? ' · ' + x.错文 : '') : ''));
}

/* 装饰位的缺口：以「别人说」那一行为基准，看另外两类缺什么 */
const base = data.rows.find(x => x.谁在说 === 'other');
if (base) {
  console.log('\n以「别人说」为基准，另外两类缺什么：');
  for (const x of data.rows) {
    if (x === base) continue;
    const miss = [];
    for (const k of ['头像', '名字', '色条', '工具', '动作高亮']) {
      const b = Number(base[k]) || 0, v = Number(x[k]) || 0;
      if (b > 0 && v === 0) miss.push('缺 ' + k);
      else if (b === 0 && v > 0) miss.push('多 ' + k);
    }
    console.log('  ' + pad(x.谁在说, 10) + (miss.length ? miss.join(' · ') : '与基准一致') + '（气泡：' + base.气泡 + ' vs ' + x.气泡 + '）');
  }
}
process.exit(0);
