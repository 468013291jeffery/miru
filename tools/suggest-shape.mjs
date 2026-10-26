// 验「suggest 是不是玩家能点的选项」——用真模型，不靠读提示词
//
//   node tools/suggest-shape.mjs --n=8
//
// 背景：2026-10-28 有人反馈 suggest 变成了「人物的可选性」，而它本该是「玩家能点的项」。
// 判据（每条都能红）：
//   ① 三条里必须出现**至少一个**玩家不说话的选项（以 ( 或 （ 开头）
//   ② 三条里必须出现**至少一个**玩家的动作（以 * 开头）
//   ③ 没有任何一条像是"角色说的话"——启发式：不以角色名开头、不含 "他说/她说/Jack:" 之类
//   ④ reaction 字段存在且不含数字（"看得见的反应"，不是 +3 好感）
import fs from 'node:fs';

const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=').slice(1).join('=') : d };
const N = Number(opt('n', 8));
const FILE = opt('file', process.env.USERPROFILE + '\\Desktop\\MIRU-prompt-单人版.md');
const MODEL = opt('model', 'deepseek-chat');

const raw = fs.readFileSync(FILE, 'utf8');
const m = raw.match(/```text\n([\s\S]*?)\n```/);
const PROMPT = m ? m[1] : raw;
const { chat } = await import('file:///C:/dev/opc-trace/llm.mjs');

const CAST = ['jack', 'luca', 'iris', 'noor', 'mason', 'ethan', 'ezra', 'brody'];
const isSilence = (s) => /^[(（]/.test(s.trim());
const isAct = (s) => /^\*/.test(s.trim());
const looksLikeCharLine = (s) => {
  const x = s.trim();
  if (CAST.some(c => x.toLowerCase().startsWith(c))) return true;
  return /^(他|她|Jack|Luca|Iris|Noor|Mason)(说|问|答|道)/.test(x);
};
const hasNumber = (s) => /\d/.test(String(s));

let pass = 0, fail = 0;
const rows = [];
for (let i = 1; i <= N; i++) {
  let j = null;
  try {
    const r = await chat({ prompt: PROMPT, model: MODEL, maxTokens: 1400, temperature: 0.85, json: false });
    const c = String(r.content || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
    try { j = JSON.parse(c) } catch (_) { const mm = c.match(/\{[\s\S]*\}/); if (mm) j = JSON.parse(mm[0]) }
  } catch (e) { console.log(`  #${i} 调用失败 ${String(e.message).slice(0, 60)}`); continue }
  const sg = (j && Array.isArray(j.suggest)) ? j.suggest.map(String) : [];
  const okA = sg.some(isSilence), okB = sg.some(isAct), okC = sg.length > 0 && !sg.some(looksLikeCharLine);
  const rx = (j && typeof j.reaction === 'string') ? j.reaction : '';
  const okD = !!rx && !hasNumber(rx);
  const ok = okA && okB && okC && okD;
  ok ? pass++ : fail++;
  rows.push({ i, ok, okA, okB, okC, okD, sg, rx });
  console.log(`  #${i} ${ok ? '✓' : '✗'} 不吭声${okA ? '✓' : '✗'} 动作${okB ? '✓' : '✗'} 像角色台词${okC ? '否' : '是'} reaction${okD ? '✓' : '✗'}  「${sg[0] || ''}」/「${sg[1] || ''}」/「${sg[2] || ''}」`);
}

console.log(`\n=== ${N} 次 · ${MODEL} ===`);
console.log(`四条全过 ${pass}/${pass + fail}`);
const rate = (f) => rows.length ? `${rows.filter(f).length}/${rows.length}` : '—';
console.log(`① 有不吭声的选项 ${rate(r => r.okA)}`);
console.log(`② 有动作选项     ${rate(r => r.okB)}`);
console.log(`③ 没有角色台词腔 ${rate(r => r.okC)}`);
console.log(`④ reaction 无数字 ${rate(r => r.okD)}`);
const bad = rows.filter(r => !r.ok).slice(0, 3);
if (bad.length) { console.log('\n不合格样本：'); bad.forEach(r => console.log(`  #${r.i} ${JSON.stringify(r.sg)} reaction=${JSON.stringify(r.rx)}`)) }
