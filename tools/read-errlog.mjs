// 读错误日志（.browser-errlog.json）—— 只报 2 分钟窗口内的条目
//   用法：node tools/read-errlog.mjs [--all] [--json]
//   退出码：0 = 窗口内没有错误；1 = 有（列出前若干条，带来源位置）
import fs from 'node:fs';

const P = '.browser-errlog.json';
if (!fs.existsSync(P)) {
  console.log('没有 .browser-errlog.json —— 打开一次本地页面（127.0.0.1:8131）它会自己落盘');
  process.exit(0);
}

let j = {};
try { j = JSON.parse(fs.readFileSync(P, 'utf8')) } catch (e) { console.log('读不动：' + e.message); process.exit(1) }

const ttl = Number(j.ttlMs) || 120000;
const cut = Date.now() - ttl;
const items = (j.items || []).filter(x => (Number(x.at) || 0) >= cut);
const all = process.argv.includes('--all') ? (j.items || []) : items;

if (process.argv.includes('--json')) { console.log(JSON.stringify({ at: j.at, ttlMs: ttl, n: all.length, items: all }, null, 2)); process.exit(items.length ? 1 : 0) }

console.log('=== 错误日志（保留 ' + Math.round(ttl / 1000) + ' 秒 · 文件内 ' + (j.items || []).length + ' 条 · 窗口内 ' + items.length + ' 条）===');
if (!all.length) { console.log('窗口内没有错误'); process.exit(0) }

for (const x of all.slice(-20)) {
  const age = Math.round((Date.now() - (Number(x.at) || 0)) / 1000);
  const where = x.src ? (' @ ' + String(x.src).replace(/^https?:\/\/[^/]+/, '') + (x.line ? ':' + x.line : '')) : '';
  console.log('  [' + x.kind + '] ' + age + 's 前  ' + x.msg + where);
}
if (items.length) { console.log('\n⇒ 窗口内有 ' + items.length + ' 条（这是红的）'); process.exit(1) }
console.log('\n（窗口内为空；--all 可看已淘汰的旧条目）');
