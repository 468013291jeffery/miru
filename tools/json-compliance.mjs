// 「回复 ONLY 这个 JSON」到底遵从得怎么样 —— 用真模型量，不靠感觉
//
//   node tools/json-compliance.mjs                      # 用桌面上那份「接手前-单人」prompt，跑 8 次
//   node tools/json-compliance.mjs --n=12 --file=<prompt 文本文件>
//
// 口径刻意与线上一致：**不开 provider 的 json mode**（线上 lcCall 没设 response_format，
// 只靠 prompt 里那句 "Reply with valid JSON only"），temperature 0.85。
// 量七件事：能不能解析 / 字段齐不齐 / beats 条数与字数 / pose 白名单 / suggest 条数 / love 范围 / 语言。
import fs from 'node:fs';

const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=').slice(1).join('=') : d };
const N = Number(opt('n', 8));
const FILE = opt('file', process.env.USERPROFILE + '\\Desktop\\MIRU-prompt-接手前-单人.md');
const MODEL = opt('model', 'deepseek-chat');
const JSONMODE = args.includes('--jsonmode');   // A/B：打开 provider 的 response_format=json_object

// 从 md 里取 ```text ... ``` 之间那段 = 真正发给模型的 prompt
const raw = fs.readFileSync(FILE, 'utf8');
const m = raw.match(/```text\n([\s\S]*?)\n```/);
const PROMPT = m ? m[1] : raw;

const { chat } = await import('file:///C:/dev/opc-trace/llm.mjs');
const POSES = new Set(['idle', 'smile', 'close', 'angry', 'sad', 'away', 'surprised', 'think']);

const rows = [];
for (let i = 1; i <= N; i++) {
  let content = '';
  try {
    const r = await chat({ prompt: PROMPT, model: MODEL, maxTokens: 1400, temperature: 0.85, json: JSONMODE });
    content = String(r.content || '');
  } catch (e) { rows.push({ i, err: String(e.message || e).slice(0, 80) }); continue }

  let j = null, parsed = false;
  const clean = content.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try { j = JSON.parse(clean); parsed = true } catch (_) {
    const mm = clean.match(/\{[\s\S]*\}/);
    if (mm) { try { j = JSON.parse(mm[0]); parsed = true } catch (_) {} }
  }
  const beats = (j && Array.isArray(j.beats)) ? j.beats : [];
  const words = beats.map(b => String(b.text || '').trim().split(/\s+/).filter(Boolean).length);
  rows.push({
    i, parsed,
    fields: j ? ['beats', 'status', 'love', 'suggest'].every(k => k in j) : false,
    nBeats: beats.length,
    beatsOK: beats.length >= 3 && beats.length <= 6,
    longBeat: words.filter(w => w > 32).length,
    badPose: beats.filter(b => b.pose && !POSES.has(b.pose)).length,
    sug: (j && Array.isArray(j.suggest)) ? j.suggest.length : -1,
    love: (j && j.love) ? Object.values(j.love) : [],
    zh: /[\u4e00-\u9fff]/.test(content) ? (content.match(/[\u4e00-\u9fff]/g) || []).length : 0,
    enOnly: !/[\u4e00-\u9fff]/.test(content),
    head: content.slice(0, 60).replace(/\n/g, ' '),
  });
}

const ok = rows.filter(r => !r.err);
const pct = (n, d) => d ? (n / d * 100).toFixed(0) + '%' : '—';
console.log(`=== ${N} 次 · ${MODEL} · temp 0.85 · json mode=${JSONMODE}===`);
console.log(`prompt 来源：${FILE.split('\\').pop()} · ${PROMPT.length} 字符\n`);

const parsedN = ok.filter(r => r.parsed).length;
console.log('① 严格 JSON 能解析      ' + `${parsedN}/${ok.length}（${pct(parsedN, ok.length)}）` + (parsedN === ok.length ? ' ✓' : ' ✗'));
const fieldN = ok.filter(r => r.fields).length;
console.log('② 四个顶层字段齐全      ' + `${fieldN}/${ok.length}（${pct(fieldN, ok.length)}）`);
const beatsOKN = ok.filter(r => r.beatsOK).length;
console.log('③ beats 条数在 3–6      ' + `${beatsOKN}/${ok.length}（${pct(beatsOKN, ok.length)}）`);
const longN = ok.reduce((s, r) => s + (r.longBeat || 0), 0);
console.log('④ 超过 32 词的 beat 条数 ' + longN);
const poseN = ok.reduce((s, r) => s + (r.badPose || 0), 0);
console.log('⑤ pose 不在白名单        ' + poseN);
const sugN = ok.filter(r => r.sug === 3).length;
console.log('⑥ suggest 正好 3 条      ' + `${sugN}/${ok.length}（${pct(sugN, ok.length)}）`);
const loveOut = ok.flatMap(r => r.love).filter(v => !(typeof v === 'number' && v >= 0 && v <= 6));
console.log('⑦ love 越界值             ' + loveOut.length + (loveOut.length ? ' → ' + JSON.stringify(loveOut.slice(0, 6)) : ''));
const enN = ok.filter(r => r.enOnly).length;
console.log('⑧ 整段没中文（跑成英文）  ' + enN + (enN ? ' ⚠️' : ''));

console.log('\n逐次：');
for (const r of rows) {
  if (r.err) { console.log(`  #${r.i} 调用失败 ${r.err}`); continue }
  console.log(`  #${r.i} 解析${r.parsed ? '✓' : '✗'} 字段${r.fields ? '✓' : '✗'} beats=${r.nBeats} 长beat=${r.longBeat} pose✗=${r.badPose} suggest=${r.sug} 中文${r.zh}字  「${r.head}…」`);
}
