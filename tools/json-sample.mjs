// 打一份**现在**模型真会返回的 JSON（用当前产物里的 prompt，一次调用，原样打印）
//
//   node tools/json-sample.mjs            # 单人 · 一次
//   node tools/json-sample.mjs --pack=gala --chapter=5   # 多人
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find(x => x.startsWith('--' + k + '=')); return a ? a.split('=').slice(1).join('=') : d };
const PACK = opt('pack', 'gala'), CH = opt('chapter', '5'), SOLO = opt('solo', 'jack');
const TMP = 'C:/dev/_sample_prompt.md';

// 用现有工具导出一份 prompt（它会从当前 index.html 切真函数）
execFileSync('node', ['tools/dump-prompt.mjs', PACK, CH, '--solo=' + SOLO, '--out=' + TMP], { encoding: 'utf8' });

const raw = fs.readFileSync(TMP, 'utf8');
const m = raw.match(/```text\n([\s\S]*?)\n```/);
const PROMPT = m ? m[1] : raw;

const { chat } = await import('file:///C:/dev/opc-trace/llm.mjs');
const r = await chat({ prompt: PROMPT, model: 'deepseek-chat', maxTokens: 1400, temperature: 0.85, json: false });
const content = String(r.content || '').trim();

console.log('=== prompt 长度 ' + PROMPT.length + ' 字符 · 下面是模型原样返回 ===\n');
console.log(content);
console.log('\n=== 解析结果 ===');
let j = null;
try { j = JSON.parse(content.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()) } catch (_) {
  const mm = content.match(/\{[\s\S]*\}/);
  if (mm) { try { j = JSON.parse(mm[0]) } catch (_) {} }
}
if (!j) { console.log('✗ 解析失败（线上会走 jsonLoose 抢救）'); process.exit(1) }
console.log('顶层字段:', Object.keys(j).join(', '));
console.log('beats:', (j.beats || []).length, '条 ·', (j.beats || []).map(b => b.kind).join('/'));
console.log('suggest:', (j.suggest || []).length, '条');
(j.suggest || []).forEach((s, i) => console.log(`  ${i + 1}. ${s}`));
console.log('reaction:', JSON.stringify(j.reaction));
console.log('love:', JSON.stringify(j.love));
