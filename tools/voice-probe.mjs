// 语音探针（2026-10-27）
//
//   用途：**先让语音出读数**。一条语音不出声时，界面上只剩「没声音」——
//         播完 / 报错 / 超时 / 被取消 四种原因同形，产品里没有任何计数器能把它们分开。
//
//   用法：
//     node tools/voice-probe.mjs            人看的表 + 判据
//     node tools/voice-probe.mjs --json     一行 JSON
//     node tools/voice-probe.mjs --play=300 改播放时长（验证「耗时是否真的跟着音频走」）
//
//   三条臂：
//     ok       TTS 正常（喂真 WAV，时长 = playMs）
//     corrupt  TTS 返回**坏音频** —— 观察产品把「解码失败」当成什么
//     hang     fetch 永不返回 —— 观察「TTS 卡死」时队列会不会永久停住
//
//   校准史（两次都是这把尺子自己的错，写在这里防复发）：
//     ① `w.speechSynthesis = stub` 静默无效（Window 只读访问器）⇒ 必须 defineProperty
//     ② 造假 mp3 没用 —— 产品用自己预建的 Audio 元素（app86 `const a=TTSEL`），
//        假字节让它真解码失败 ⇒ `onerror → onend` 2ms 就"播完"。那次 2ms 不是尺子坏，
//        是**产品把解码失败当成播完**。⇒ 现在喂真 WAV，并把「耗时必须跟着 playMs 走」写成判据。
import { spawnSync } from 'node:child_process';

const PORT = process.env.MIRU_PORT || 8131;
const PLAY = (process.argv.find(a => a.startsWith('--play=')) || '').replace('--play=', '');
const URL = 'http://127.0.0.1:' + PORT + '/tools/voice-probe.html' + (PLAY ? '#' + PLAY : '');
const EDGE = process.env.MIRU_EDGE || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const JSON_ONLY = process.argv.includes('--json');

function probe() {
  const r = spawnSync(EDGE, [
    '--headless=new', '--disable-gpu', '--no-sandbox',
    '--autoplay-policy=no-user-gesture-required',
    '--virtual-time-budget=40000', '--dump-dom', URL
  ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

  const dom = (r.stdout || '') + (r.stderr || '');
  const m = /VOICE_JSON:(\{[\s\S]*?\})<\/pre>/.exec(dom);
  if (!m) {
    const err = /ERR [^<]*/.exec(dom);
    console.log('拿不到读数' + (err ? '（' + err[0] + '）' : '（页面没起来？本地服务要跑在 ' + PORT + '，见 tools/serve.mjs）'));
    return null;
  }
  try { return JSON.parse(m[1]) } catch (e) { console.log('JSON 解析失败: ' + e.message); return null }
}

const res = probe();
if (!res) process.exit(2);
if (JSON_ONLY) { console.log(JSON.stringify(res)); process.exit(0) }

const PAD = (s, n) => { s = String(s); let w = 0; for (const c of s) w += (c.charCodeAt(0) > 127 ? 2 : 1); return s + ' '.repeat(Math.max(0, n - w)) };

function table(name, blk, note) {
  const t = blk && typeof blk === 'object' ? blk : {};
  console.log('\n【' + name + '】' + (note ? '  ' + note : '') + (t.err ? '  抛错: ' + t.err : ''));
  if (!t.rows) return;
  console.log('  开口 ' + t.spoken + ' · settle ' + t.settled + ' · 用 ' + t.ms + 'ms · 播放桩 ' + t.playMs + 'ms · 设备语音 ' + t.ssSpoke + ' 次');
  console.log('  ┌──────┬────────────────────┬──────────┬──────────┬─────────────┐');
  console.log('  │ 说话人│ 文本                │ 耗时     │ 结束方式  │ 通道        │');
  console.log('  ├──────┼────────────────────┼──────────┼──────────┼─────────────┤');
  for (const r of t.rows) {
    const ms = r.ms === null ? '—' : (r.ms + 'ms');
    console.log('  │ ' + PAD(r.who, 5) + '│ ' + PAD(r.txt, 18) + '│ ' + PAD(ms, 8) + '│ ' + PAD(r.why, 8) + '│ ' + PAD(r.channel, 11) + '│');
  }
  console.log('  └──────┴────────────────────┴──────────┴──────────┴─────────────┘');
  const st = (t.rows || []).map(r => r.stack).filter(Boolean);
  if (st.length) console.log('  settle 来源：' + st[0]);
}

table('ok · TTS 正常', res.ok, '（真 WAV，时长应 ≈ ' + ((res.ok || {}).playMs || '?') + 'ms）');
table('corrupt · TTS 返回坏音频', res.corrupt, '（解码必失败）');
table('hang · fetch 永不返回', res.hang, '（TTS 卡死）');

/* ---------- 判据 ---------- */
const fails = [], notes = [];
const ok = res.ok || {}, corrupt = res.corrupt || {}, hang = res.hang || {};
const pm = ok.playMs || 0;

/* ⓪ 尺子自检：设备语音桩必须真接管（否则读数全不可信） */
if (ok.ssStubOk === false) fails.push('★ 设备语音桩没接管（speechSynthesis 是 Window 只读访问器，普通赋值无效）—— 耗时读数不可信');

/* ① 耗时必须跟着音频走 */
const ms0 = (ok.rows && ok.rows[0]) ? ok.rows[0].ms : null;
if (ms0 !== null && pm > 0 && ms0 < pm * 0.5)
  fails.push('★ 播放桩 ' + pm + 'ms，但第一条只用了 ' + ms0 + 'ms ⇒ 耗时不由音频决定（走的是另一条路），读数不可信');

if (!ok.drained) fails.push('ok 组队列没排空（' + (ok.settled || 0) + '/' + (ok.spoken || 0) + '）');
if ((ok.rows || []).some(r => r.ms === null)) fails.push('ok 组有语音从未 settle');

/* ② 坏音频：解码失败**不该**被当成「播完了」 */
if (corrupt.rows && corrupt.rows.length) {
  const fast = corrupt.rows.filter(r => r.ms !== null && pm > 0 && r.ms < pm * 0.5);
  if (fast.length) {
    fails.push('★ 坏音频组有 ' + fast.length + '/' + corrupt.rows.length + ' 条在 ' + fast[0].ms + 'ms 内就结束了 —— **解码失败被当成「播完了」**，队列会推进但用户什么也没听见（静默漏句）');
  } else if (!corrupt.drained) {
    notes.push('坏音频组没排空（' + (corrupt.settled || 0) + '/' + (corrupt.spoken || 0) + '）—— 至少在等，不会静默跳过');
  }
}

/* ③ TTS 卡死时不能永久停 */
if (!hang.drained) fails.push('★ TTS 挂死时队列**永久卡住**（' + (hang.settled || 0) + '/' + (hang.spoken || 0) + ' settle，窗口 ' + (hang.ms || 0) + 'ms）—— 这就是「界面卡一下然后没了」的来源');

console.log('');
if (notes.length) { notes.forEach(x => console.log('· ' + x)) }
if (fails.length) {
  console.log('✗ 语音探针 ' + fails.length + ' 条判据未过：');
  fails.forEach(x => console.log('   ' + x));
  process.exit(1);
}
console.log('✓ 语音探针全绿：正常路径按时结束 · 坏音频不冒充播完 · TTS 卡死仍能推进');
process.exit(0);
