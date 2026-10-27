// 渲染入口的闸（第七件）
//   ① UI 模块在产物里、且在 renderChat 之后（它调用 renderChat）
//   ② UI.render 里三个动作齐全：sanitizeMsgs / renderChat / hook 循环
//   ③ 隔离是真的：造两个 hook，第一个抛错，第二个必须照跑（这条会「开火」）
import fs from 'node:fs';

const h = fs.readFileSync('index.html', 'utf8');
let pass = 0, fail = 0;
const t = (n, ok, extra) => { console.log('  ' + (ok ? '✓' : '✗') + ' ' + n + (extra ? ' — ' + extra : '')); ok ? pass++ : fail++ };

t('UI 模块在产物里', /window\.UI = U/.test(h));
t('UI.render 会先净化', /U\.render = function[\s\S]{0,400}sanitizeMsgs/.test(h));
t('UI.render 调用主渲染', /U\.render = function[\s\S]{0,600}renderChat\(\)/.test(h));
t('每个 hook 单独 try/catch', /for \(const h of U\.hooks\)[\s\S]{0,200}try \{ h\.fn\(th\)/.test(h));

// ③ 行为验证：把模块单独求值，塞两个 hook，第一个抛错，第二个必须跑
const src = fs.readFileSync('source/src/app106_ui.js', 'utf8');
let ran = false, isolated = false;
try {
  const sandbox = { window: {}, console: { warn() {} }, performance: { now: () => Date.now() } };
  const fn = new Function('window', 'console', 'performance', 'renderChat', 'sanitizeMsgs', src + '\nreturn window.UI;');
  const UI = fn(sandbox.window, sandbox.console, sandbox.performance, () => {}, () => {});
  UI.add('炸弹', () => { throw new Error('boom') });
  UI.add('后面那个', () => { ran = true });
  UI.render({});
  isolated = ran === true && UI.hooks[0].errs === 1;
} catch (e) { console.log('  ⚠ 行为验证无法求值: ' + e.message) }

t('一个 hook 抛错不连累后面的 hook', isolated, isolated ? '后面的钩子照跑 ✓' : '后面的钩子被掐了');

console.log('\n' + pass + ' passed, ' + fail + ' failed');
if (fail) { console.log('FAILED: 渲染入口不成立'); process.exit(1) }
console.log('ui entry OK');
