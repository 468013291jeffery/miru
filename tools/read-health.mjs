// 读运行时健康汇报（.browser-health.json）—— Mythica 第 13 条「健康汇报」的读侧
//
//   用法：node tools/read-health.mjs [--json]
//   退出码：0 = 全绿；1 = 有异常（冲突 / 钩子失败 / 非法迁移 / 空写比例过高）
import fs from 'node:fs';

const P = '.browser-health.json';
if (!fs.existsSync(P)) {
  console.log('没有 .browser-health.json —— 打开一次本地页面（127.0.0.1:8131）它会自己落盘');
  process.exit(0);
}

let h = {};
try { h = JSON.parse(fs.readFileSync(P, 'utf8')) } catch (e) { console.log('读不动：' + e.message); process.exit(1) }

if (process.argv.includes('--json')) { console.log(JSON.stringify(h, null, 2)); process.exit(0) }

const warn = [];
const line = (k, v, bad) => { console.log('  ' + (bad ? '✗' : '·') + ' ' + k.padEnd(14) + v); if (bad) warn.push(k) };

console.log('=== 运行时健康 (' + h.at + ') ===');
console.log('  构建 ' + (h.build || '?') + ' · 已跑 ' + Math.round((h.uptimeMs || 0) / 1000) + ' 秒 · 第 ' + h.ticks + ' 次汇报\n');

if (h.turn) {
  line('回合状态', h.turn.状态 + ' · 持有者 ' + h.turn.持有者 + ' · 已持 ' + h.turn.已持ms + 'ms');
  line('回合冲突', h.turn.冲突 + ' 次', h.turn.冲突 > 0);
  line('累计回合', h.turn.回合 + ' 次');
}
if (h.save) {
  line('存档写入', h.save.次数 + ' 次 · 平均 ' + h.save.平均ms + 'ms · 最慢 ' + h.save.最慢ms + 'ms');
  const u = String(h.save.空写 || '0/0').split('/');
  const frac = Number(u[1]) ? Number(u[0]) / Number(u[1]) : 0;
  line('空写比例', h.save.空写 + (Number(u[1]) ? '（' + Math.round(frac * 100) + '%）' : ''), frac > 0.5 && Number(u[1]) >= 5);
}
if (h.ui) {
  line('渲染', h.ui.渲染 + ' 次 · 钩子 ' + h.ui.钩子 + ' 个');
  line('钩子失败', h.ui.失败 + ' 次', h.ui.失败 > 0);
}
if (h.pkst) {
  line('章节转移', h.pkst.转移 + ' 次 · 状态 ' + JSON.stringify(h.pkst.各状态 || {}));
  line('非法迁移', h.pkst.非法 + ' 次', h.pkst.非法 > 0);
}
if (h.uiErr) line('UI 安装错误', h.uiErr, true);
if (h.soft) line('静默失败', h.soft.静默失败 + ' 次 / ' + h.soft.位置数 + ' 个位置', h.soft.静默失败 > 0 && h.soft.位置数 > 0);

console.log('');
if (warn.length) { console.log('✗ 有 ' + warn.length + ' 项异常：' + warn.join(' / ')); process.exit(1) }
console.log('全绿');
