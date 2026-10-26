// 进游戏之后的卡顿：**自动复现 + 记账**。
//
//   node tools/perf-ingame.mjs                 # 8 章全走一遍，读数落到 reports/perf-ingame.json
//   node tools/perf-ingame.mjs --chapters 4    # 只走 4 章
//   node tools/perf-ingame.mjs --reuse         # 不重启页面（接着上一轮的状态继续）
//
// 它做的事：起 agent-browser（--session dsh）→ 打开 8131 → 注入探针 → 真的从第 1 章走到第 8 章
// （每章都是 packPick → packNext → packOpen → packRun，和玩家按键完全同一条路）→ 逐章记账。
//
// 为什么不用「手动点一遍 + 抄数」：读数的分母是这个仓库里最贵的东西 —— PERF.md 里每一条
// 都写着自己的复现命令。进游戏这一段以前没有人量过，所以先把尺子做成能一条命令重跑的。
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);
const opt = (name, dflt) => {
  const i = args.indexOf('--' + name);
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : dflt;
};
const flag = name => args.includes('--' + name);

const URL = opt('url', 'http://127.0.0.1:8131/');
// ⚠️ 不要用 `dsh` 当默认 session：那是所有 dsh 窗口共用的浏览器会话，两个窗口同时驱动
// 会互相把对方的页面导航走（2026-10-27 实测：一轮跑了 9 分钟的基线测量就这样被打掉）。
// 每个窗口用自己的名字。
const SESSION = opt('session', 'miru-perf');
const CHAPTERS = Number(opt('chapters', 8));
const CHOICE = opt('choice', 'B');
const WORLD = opt('world', 'ice');
const OUT = opt('out', 'reports/perf-ingame.json');
const REUSE = flag('reuse');
const POLL_MS = Number(opt('poll', 8000));
const MAX_MIN = Number(opt('maxmin', 25));

function ab(cmdArgs, { timeout = 120000, input = undefined } = {}) {
  const r = spawnSync('agent-browser', ['--session', SESSION, ...cmdArgs], {
    shell: true, encoding: 'utf8', timeout, maxBuffer: 64 * 1024 * 1024, input,
  });
  const stdout = r.stdout || '';
  const out = stdout + (r.stderr || '');
  let json = null;
  // ⚠️ agent-browser 的 stderr 上永远压着一行 Node inspector 的 "Debugger listening on ..."
  // ⇒ 只解析 stdout；解析不了再退回「整段当错误文本」。
  try { json = JSON.parse(stdout); } catch (_) {}
  return { out, json, status: r.status, result: json && json.data ? json.data.result : undefined, error: json ? json.error : (out.slice(0, 400) || null) };
}

// ⚠️ 不能把 payload 塞进命令行：Windows 的 cmd 行上限是 8191 字符，探针 base64 之后 11 KB
// ⇒ 报「The command line is too long.」。走 --stdin（脚本从标准输入进）。
function evalJs(js, label) {
  const r = ab(['eval', '--stdin', '--json'], { input: js });
  if (r.error) throw new Error((label || 'eval') + ' failed: ' + JSON.stringify(r.error).slice(0, 500));
  return r.result;
}

const say = (...a) => console.log(...a);

// ---------- 0. 起页面 ----------
// ⚠️ 不用 reload：reload 会把已经注入的探针全丢掉（实际代价：一轮 9 分钟的基线测量因此作废，
//    因为另一个窗口也在驱动同一个浏览器会话）。改成「直接在活页面上把 app 叫起来」。
if (!REUSE) {
  say('[1/5] 打开页面 ' + URL + '（session=' + SESSION + '）');
  ab(['open', URL], { timeout: 180000 });
}
say('[1.5] 确保进了 app');
const boot = evalJs(`JSON.stringify((function(){
  if(typeof S==="undefined")return {err:"no S on page"};
  if(!S.ob||!S.authChoice){S.ob=true;S.authChoice=S.authChoice||"guest";S.lang=S.lang||"zh";save()}
  const main=document.getElementById("s-main");
  if(!main||main.hidden){try{startApp()}catch(e){}}
  return {ob:!!S.ob,ac:S.authChoice,screens:[...document.querySelectorAll("[id^=s-]")].map(e=>e.id+":"+(e.hidden?"h":"V"))}
})())`, 'boot');
say('      ' + boot);

// ---------- 1. 注入探针 ----------
say('[2/5] 注入探针 tools/perf-ingame.js');
const probe = fs.readFileSync('tools/perf-ingame.js', 'utf8');
say('      ' + evalJs(probe, 'probe'));

say('[3/5] 注入驱动器 tools/perf-ingame-run.js');
const runner = fs.readFileSync('tools/perf-ingame-run.js', 'utf8');
say('      ' + evalJs(runner, 'runner'));

// ---------- 2. 准备一个可复现的起点 ----------
/* --fast：把「按阅读速度放行」的等待去掉（S.pkSpd 缩到 1/50 + 关掉朗读），于是墙钟 ≈ 真正的
   主线程工作。为什么需要它：真速播一章 60–90 秒，其中 99% 是定时器在等 —— 那部分不是「卡」，
   改代码也动不了它。A/B 要比的是工作，不是等。真速的读数另外单独留一份（不加 --fast）。 */
const FAST = flag('fast');
const setup = evalJs(`JSON.stringify((function(){
  S.packs=S.packs||{};S.packs["${WORLD}"]={own:1,end:{}};save();
  ${FAST ? 'S.pkSpd=0.02;S.autoVoice=false;' : 'S.pkSpd=1;'}
  try{if(typeof MIRU_TUNE==="object"&&MIRU_TUNE.chat)MIRU_TUNE.chat.minRoundsPerChapter=0}catch(e){}   // 节奏门槛不是性能，量性能时关掉
  save();
  const th=Object.values(S.threads).filter(t=>t.wid==="${WORLD}"&&t.pk).sort((a,b)=>b.at-a.at)[0];
  if(th&&th.pk&&th.pk.st!=="end"){openThread(th.id);return{resume:true,id:th.id,ch:th.pk.ch,st:th.pk.st,msgs:th.msgs.length}}
  if(th){delete S.threads[th.id];save()}
  const t2=packStart("${WORLD}","watch",1);
  return{resume:false,id:t2.id,ch:t2.pk.ch,st:t2.pk.st,msgs:t2.msgs.length}
})())`, 'setup');
say('      起点：' + setup);

// ---------- 3. 走章 ----------
say('[4/5] 开始走 ' + CHAPTERS + ' 章（真的换章，靠页面自己的定时器播）');
say('      ' + evalJs(`__MIRUPERF.reset(); __PERFRUN.start({chapters:${CHAPTERS},choice:"${CHOICE}"})`, 'start-run'));

const t0 = Date.now();
let last = '';
while (Date.now() - t0 < MAX_MIN * 60000) {
  await new Promise(r => setTimeout(r, POLL_MS));
  let st;
  try { st = JSON.parse(evalJs('__PERFRUN.status()', 'status')); } catch (e) { say('      poll err: ' + e.message); continue; }
  const line = `      ${Math.round((Date.now() - t0) / 1000)}s  ch=${st.ch} st=${st.st} msgs=${st.msgs} runs=${st.runs} ${st.err || ''}`;
  if (line !== last) { say(line); last = line; }
  if (st.done) break;
}

// ---------- 4. 收数 ----------
say('[5/5] 收读数');
const runReport = JSON.parse(evalJs('__PERFRUN.report()', 'report'));
const probeReport = JSON.parse(evalJs('__MIRUPERF.report()', 'probe-report'));
const out = {
  when: new Date().toISOString(),
  url: URL, world: WORLD, chapters: CHAPTERS, choice: CHOICE, fast: FAST,
  setup: JSON.parse(setup),
  runs: runReport.runs,
  err: runReport.err,
  log: runReport.log,
  probe: probeReport,
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf8');
say('      写到 ' + OUT);

// ---------- 5. 打一张人看的表 ----------
const f = n => (typeof n === 'number' ? n.toFixed(1) : String(n));
say('\n章 | 墙钟(ms) | save 次数/累计(ms) | renderChat 次数/累计(ms) | 长任务 n/ms/max | 掉帧 | msgs 前→后 | DOM 前→后');
say('---|---------:|--------------------:|------------------------:|-----------------:|-----:|-----------:|-----------:');
for (const r of runReport.runs) {
  if (r.phase !== 'main' && r.phase !== 'openThread') continue;
  if (r.phase === 'openThread') {
    say(`进thread(msgs=${r.msgs}) | ${f(r.openMs)} | ${r.saveCalls}/${f(r.saveMs)} | ${r.renderChatCalls}/${f(r.renderChatMs)} | ${r.ltN}/${f(r.ltMs)}/${f(r.ltMax)} | ${r.framesDropped} | - | -`);
    continue;
  }
  say(`${r.ch} | ${f(r.wallMs)} | ${r.saveCalls}/${f(r.saveMs)} | ${r.renderChatCalls}/${f(r.renderChatMs)} | ${r.ltN}/${f(r.ltMs)}/${f(r.ltMax)} | ${r.framesDropped} | ${r.msgsBefore}→${r.msgsAfter} | ${r.domBefore}→${r.domAfter}`);
}
