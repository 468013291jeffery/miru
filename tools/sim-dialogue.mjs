// 用其中一个剧本，模拟一段生产对话，量「人机感 / 重复剧情」到底出在哪
//
//   node tools/sim-dialogue.mjs            # gala 第 5 章，6 轮
//   node tools/sim-dialogue.mjs afterhours 3 8
//
// 做法（重要，这决定了读数算不算数）：
//   1. **prompt 的正文不是我自己写的** —— 从构建产物 index.html 里把 `const prompt=[...]` 整段切出来，
//      用桩函数替换掉它调用的那些浏览器函数（transcript/packPrompt/...）。所以规则段、块的顺序、
//      那几句钉死场景的话，都是**线上那一份**逐字的。唯一丢的是 castCardFace 的渲染细节（用桩替代）。
//   2. 每一轮把模型的 beats 当作历史写回去 —— 和线上 `useUnits` 之后的状态一样。
//   3. 读数：相邻两轮 8-gram 重叠（重复率）、复述 canon 的次数、是否还停在 choose 这一幕。
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=').slice(1).join('=') : d };
const pos = args.filter(a => !a.startsWith('--'));
const WID = opt('pack', pos[0] || 'gala');
const CH = Number(opt('chapter', pos[1] || 5));
const TURNS = Number(opt('turns', pos[2] || 6));
const MODEL = opt('model', 'deepseek-chat');
// 章内推进开关（2026-10-28）：on = 允许模型在本章内推进时间/换场景；off = 线上旧行为（钉在这一幕）
const ADVANCE = opt('advance', 'auto');   // auto = 用产物里那份 tune 的默认值
const OUT = opt('out', '');
const TAG = opt('tag', WID + '-ch' + CH);

// 报告目录
const REPORTS = 'reports';
try { fs.mkdirSync(REPORTS, { recursive: true }) } catch (_) {}


// ---------- 1. 从产物里切出 prompt 数组 ----------
const html = fs.readFileSync('index.html', 'utf8');
const at = html.indexOf('const prompt=[');
if (at < 0) throw new Error('产物里没有 const prompt=[');
let i = html.indexOf('[', at), depth = 0, end = -1;
for (; i < html.length; i++) { const c = html[i]; if (c === '[') depth++; else if (c === ']') { depth--; if (!depth) { end = i; break } } }
const promptSrc = html.slice(html.indexOf('[', at), end + 1);

// ---------- 2. 剧本数据 ----------
const pack = fs.readdirSync('source/content/out').filter(f => /^s\d+\.json$/.test(f))
  .map(f => JSON.parse(fs.readFileSync(path.join('source/content/out', f), 'utf8'))).find(p => p.wid === WID);
if (!pack) { console.error('没有这部剧本: ' + WID); process.exit(2) }
const chapter = pack.chapters[CH - 1];

// ---------- 3. 桩：只保证「块的内容形状对」，不假装是完整渲染 ----------
const st = {
  wid: WID, cast: pack.cast.map(c => c.id).slice(0, 5), love: {}, mem: [], msgs: [], said: [], typed: [],
  status: { time: chapter.time.zh || chapter.time.en, place: chapter.place.zh || chapter.place.en },
  pk: { ch: CH, as: 'watch', st: 'choose', picks: {} },
};
pack.cast.slice(0, 5).forEach(id => st.love[id] = 12);

const sandbox = {
  th: st, w: { pack, title: pack.title, premise: pack.premise, you: pack.you, warn: pack.warn },
  Lz: (v) => (v && (v.zh || v.en)) || '',
  wd: () => ({ pack }), p: { name: 'Ann', pron: 'she' },
  S: { plus: false, heat: 'slow', lang: 'zh' }, MIRU_TUNE: { chat: { transcript: 50, transcriptPlus: 80, typedKeep: 120, saidKeep: 50, chapterAdvance: ADVANCE === 'on' } },
  speakersOf: (th) => th.cast,
  castCardFace: (th, id) => { const c = pack.cast.find(x => x.id === id) || {}; return '- id=' + id + ' · ' + (c.n || id) + '. ' + (c.look || '') + ' Personality: ' + (c.vibe || '') },
  transcript: (th) => th.msgs.slice(-50).map(m => (m.who === 'me' ? 'PLAYER' : (m.who || '?')) + ': ' + m.txt).join('\n') || '(nothing yet)',
  memBlock: (th) => (th.mem.length ? 'MEMORY:\n' + th.mem.slice(-12).join('\n') : ''),
  packPrompt: (th) => {
    const c = chapter, past = 'nothing official yet';
    // 这两句逐字抄自 app14_pack.js:249（开关两版都在），改那边就改这里，否则量到的不是线上那句话
    const CHOICE = c.choices.map(x => x.k + ': ' + (x.t.zh || x.t.en)).join(' / ');
    const pin = 'The reader is about to make this chapter\'s official choice (' + CHOICE + '). '
      + (ADVANCE === 'off'
        ? 'Stay inside this moment: do NOT make that decision for anyone, do NOT jump to later chapters, do NOT resolve the chapter goal.'
        : 'Do NOT make that decision for anyone and do NOT resolve the chapter goal — but you MAY move this chapter forward: end the beat, let minutes or hours pass, change rooms, bring someone in. A chapter lasts many minutes; do not freeze the same instant across replies.');
    return 'CHAPTER ' + CH + '/' + pack.chapters.length + ' — "' + (c.t.zh || c.t.en) + '". Chapter goal: ' + (c.goal.zh || c.goal.en) + '. Place: ' + (c.place.zh || c.place.en) + '.\n'
      + 'WHAT HAS HAPPENED (official, canon — never contradict, never re-open a settled conflict): ' + past + '\n'
      + (th.pk.st === 'choose' ? pin : "This chapter\\'s choice is made. Play the aftermath of it; do not start the next chapter\\'s events.");
  },
  goals: '', me: () => 'Ann', t: (k) => k, ch: (id) => pack.cast.find(c => c.id === id) || { n: id }, first: (s) => s,
  LANG_NAME: { en: 'English', zh: 'Simplified Chinese (简体中文)', ja: 'Japanese', ko: 'Korean', es: 'Spanish' },
  jsonLoose: (t) => { try { return JSON.parse(t) } catch (_) { return null } },
};
// 用 with + Proxy 兜住所有我叫不出名字的自由变量：真实的桩优先，其余一律返回空串。
// （逐个补 stub 会一直撞 ReferenceError；让未知变量变成空串，块的形状仍由真实桩决定。）
// 未知变量一律变成「空值桩」：被调用返回 ''，被拼字符串也返回 ''（Symbol.toPrimitive 要给出 ''，否则会尝试调用 ''）
let stub;
stub = new Proxy(function () {}, {
  get: (t, k) => {
    if (k === Symbol.toPrimitive) return () => '';
    if (k === 'toString' || k === 'valueOf') return () => '';
    if (k === Symbol.iterator) return function* () {};
    return stub;
  },
  apply: () => '',
});
const scope = new Proxy(sandbox, {
  has: () => true,
  get: (t, k) => {
    if (k === Symbol.unscopables) return undefined;
    if (k in t) return t[k];
    return stub;
  },
});
const buildPrompt = () => new Function('__s', 'with(__s){return ' + promptSrc + ';}')(scope).filter(Boolean).join('\n');
const PROMPT = buildPrompt();

// ---------- 4. 调模型 ----------
const { chat } = await import('file:///C:/dev/opc-trace/llm.mjs');
const run = async (prompt) => {
  const r = await chat({ prompt, model: MODEL, maxTokens: 1200, temperature: 0.85, json: true });
  let txt = String(r.content || '').trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  try { return JSON.parse(txt) } catch (_) {}
  // 兜底：模型会在台词里塞未转义的引号，严格 JSON 会坏（这本身就是一个生产故障模式）。
  // 用宽松提取救回 beats，好让重复读数能跑完；坏 JSON 的次数单独记一笔。
  BAD_JSON++;
  const beats = [];
  const re = /"who"\s*:\s*"([^"]+)"[\s\S]*?"text"\s*:\s*"([\s\S]*?)"\s*,\s*"pose"/g;
  let m; while ((m = re.exec(txt))) beats.push({ who: m[1], text: m[2], kind: 'say' });
  if (!beats.length) return null;
  const sg = txt.match(/"suggest"\s*:\s*\[([\s\S]*?)\]/);
  return { beats, suggest: sg ? sg[1].split('","').map(s => s.replace(/^"|"$/g, '')) : [] };
};

const PLAYER = ['（她没有立刻说话，先看了一眼那张写着"支持"的椅子。）', '我把它挪到中间吧。', '谁先去坐，我不管——但别让我点名。', '你刚才说"别让我点名"，是怕谁？', '那条头条的事，你是从哪儿听来的？', '好，那今晚就按你说的走。'];
/* 2026-10-28：默认这 6 句是「剧情推进」型，一句都不撩 ⇒ 这个 sim 天生看不见 heat。
   要量升温就得换驱动，所以加了 --lines="用 | 分隔的几句"：只换玩家台词，prompt 仍然逐字取构建产物。 */
const _linesArg = opt('lines', '');
if (_linesArg) { const L = _linesArg.split('|').map(s => s.trim()).filter(Boolean); if (L.length) { PLAYER.length = 0; PLAYER.push(...L); } }

const ngrams = (s, n = 8) => { const out = new Set(); const t = s.replace(/\s+/g, ''); for (let i = 0; i + n <= t.length; i++) out.add(t.slice(i, i + n)); return out };
const jac = (a, b) => { const A = ngrams(a), B = ngrams(b); if (!A.size || !B.size) return 0; let inter = 0; for (const x of A) if (B.has(x)) inter++; return inter / (A.size + B.size - inter) };
let BAD_JSON = 0;
// 引语复读：这条 beat 是否以「上一条消息的最后几个字」开头（中文里最典型的人机感）
const echoOpen = (beat, prev) => {
  const head = String(beat).replace(/^[“"']+/, '').slice(0, 6);
  const tail = String(prev || '').replace(/[。！？…\s”"']+$/g, '');
  for (let n = 6; n >= 2; n--) { const frag = tail.slice(-n); if (frag && head.startsWith(frag)) return n }
  return 0;
};

console.log(`=== ${WID} 第 ${CH} 章 · ${TURNS} 轮 · prompt ${PROMPT.length} 字符 ===`);
console.log('（prompt 正文来自构建产物，桩只替换了渲染函数）\n');

const turns = [];
const echoStats = [];
const qStats = [];
const dialogue = [];   // 逐轮记下来，最后写成可读的 md
let engDrift = 0;
for (let k = 0; k < TURNS; k++) {
  const mine = PLAYER[k % PLAYER.length];
  st.msgs.push({ who: 'me', k: 'say', txt: mine });
  st.said.push(mine); st.typed.push(mine);

  const prompt = PROMPT;   // 每轮重算会带上历史（桩里的 transcript 读 st.msgs，需重建）
  const rebuilt = buildPrompt();
  const r = await run(rebuilt);
  if (!r || !Array.isArray(r.beats)) { console.log(`第 ${k + 1} 轮：模型没给 beats（${JSON.stringify(r).slice(0, 120)}）`); continue }
  const text = r.beats.map(b => (b.act || b.text || b.say || '')).join(' ');
  // 引语复读：每条 beat 的开头是不是在重复上一条消息的结尾
  let prevTxt = st.msgs[st.msgs.length - 2] ? st.msgs[st.msgs.length - 2].txt : '';
  let echo = 0, echoN = 0;
  for (const b of r.beats) {
    const bt = b.act || b.text || b.say || '';
    const n = echoOpen(bt, prevTxt);
    if (n) echoN++;
    echo = Math.max(echo, n);
    prevTxt = bt;
  }
  echoStats.push({ beats: r.beats.length, echo: echoN });
  const qEnd = r.beats.filter(b => /[？?]\s*$/.test(String(b.act || b.text || b.say || ''))).length;
  qStats.push({ n: r.beats.length, q: qEnd });
  // 语言漂移：中文台词里出现整句英文
  const eng = r.beats.filter(b => /^[A-Za-z][A-Za-z ,.'"—-]{25,}$/.test(String(b.act || b.text || b.say || '').trim())).length;
  if (eng) engDrift++;
  st.msgs.push(...r.beats.map(b => ({ who: b.who || 'mason', k: 'say', txt: b.act || b.text || b.say || '' })));
  turns.push(text);
  dialogue.push({ k: k + 1, mine, beats: r.beats, suggest: r.suggest || [], echoN, q: qEnd });
  console.log(`--- 第 ${k + 1} 轮（玩家：${mine.slice(0, 24)}…）`);
  console.log(r.beats.slice(0, 4).map(b => `   ${b.who}: ${(b.act || b.text || b.say || '').slice(0, 70)}`).join('\n'));
  console.log(`   复读开头 ${echoN}/${r.beats.length} 条${eng ? ' · ⚠️ 有整句英文' : ''}`);
  console.log(`   suggest: ${(r.suggest || []).join(' | ').slice(0, 100)}`);
}

// ---------- 5. 读数 ----------
console.log('\n=== 读数 ===');
const pairs = turns.slice(1).map((t, i) => jac(turns[i], t));
if (pairs.length) {
  console.log('相邻两轮 8-gram 重叠：' + pairs.map(x => (x * 100).toFixed(1) + '%').join(' · '));
  console.log('中位 ' + (pairs.slice().sort((a, b) => a - b)[Math.floor(pairs.length / 2)] * 100).toFixed(1) + '%');
}
const totalBeats = echoStats.reduce((s, x) => s + x.beats, 0);
const totalEcho = echoStats.reduce((s, x) => s + x.echo, 0);
console.log(`引语复读：${totalEcho}/${totalBeats} 条 beat 的开头在重复上一句（${(totalEcho / Math.max(1, totalBeats) * 100).toFixed(0)}%）`);
console.log(`整句英文漂移：${engDrift} 轮`);
const tq = qStats.reduce((s,x)=>s+x.n,0), nq = qStats.reduce((s,x)=>s+x.q,0);
console.log(`以问号收尾的 beat：${nq}/${tq}（${(nq/Math.max(1,tq)*100).toFixed(0)}%）—— 高 = 每个角色都在反问，像访谈`);
console.log(`坏 JSON（模型输出不可解析，线上靠 jsonLoose 兜）：${BAD_JSON}/${turns.length + BAD_JSON} 次`);
const canonHits = turns.filter(t => /椅子|支持|头条|点名/.test(t)).length;
console.log(`出现本章道具（椅子/支持/头条/点名）的轮数：${canonHits}/${turns.length}`);
console.log('判读：>30% 相邻重叠 = 复述同一批句子；复读开头 >25% = 像台词接力而不是对话；道具每轮都出现 = 被 canon 行钉住。');

// ---------- 6. 报告（后台跑完直接给人看的那一份）----------
{
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const file = OUT || (REPORTS + '/sim-' + TAG + '-advance' + ADVANCE + '-' + ts + '.md');
  const med = pairs.length ? (pairs.slice().sort((a, b) => a - b)[Math.floor(pairs.length / 2)] * 100).toFixed(1) + '%' : '—';
  const L = [];
  L.push('# 模拟对话 · ' + WID + ' 第 ' + CH + ' 章 · ' + turns.length + ' 轮');
  L.push('');
  L.push('- 模型：' + MODEL + ' · 章内推进开关：**' + ADVANCE + '**');
  L.push('- prompt 正文：从 `index.html` 切出的真实数组（' + PROMPT.length + ' 字符），桩只替换渲染函数');
  L.push('');
  L.push('## 读数');
  L.push('');
  L.push('| 指标 | 值 | 判读 |');
  L.push('|---|---|---|');
  L.push('| 相邻两轮 8-gram 重叠（中位） | ' + med + ' | >30% = 复述同一批句子 |');
  L.push('| 引语复读 | ' + totalEcho + '/' + totalBeats + '（' + (totalEcho / Math.max(1, totalBeats) * 100).toFixed(0) + '%） | >25% = 台词接力，不像对话 |');
  L.push('| 以问号收尾 | ' + nq + '/' + tq + '（' + (nq / Math.max(1, tq) * 100).toFixed(0) + '%） | 高 = 每个角色都在反问，像访谈 |');
  L.push('| 出现本章道具的轮数 | ' + canonHits + '/' + turns.length + ' | 每轮都出现 = 钉在同一幕 |');
  L.push('| 坏 JSON | ' + BAD_JSON + ' 次 | 线上靠 jsonLoose 兜底 |');
  L.push('');
  L.push('## 对话');
  for (const d of dialogue) {
    L.push('');
    L.push('### 第 ' + d.k + ' 轮 · 玩家：' + d.mine);
    for (const b of d.beats) L.push('- **' + (b.who || '?') + '**：' + (b.act || b.text || b.say || ''));
    if (d.suggest && d.suggest.length) L.push('- _建议_：' + d.suggest.join(' ｜ '));
  }
  fs.writeFileSync(file, L.join('\n'), 'utf8');
  console.log('\n报告：' + file);
}
