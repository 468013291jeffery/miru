// 从浏览器的 LevelDB 里把 MIRU 存档挖出来（离线，只读）
//
//   node tools/read-save.mjs            # 两个浏览器都扫
//   node tools/read-save.mjs --dump     # 顺便把最近的对话流打印成人话
//
// localStorage 的值在 LevelDB 里是 **UTF-16LE** 存的，前面带 0x00/0x01 前缀字节。
// 所以做法是：把每个 .ldb/.log 当字节流读，找 "miru_v2" 的 UTF-16 形式，然后从那里往后
// 解析出一个完整的花括号块（JSON 本身在 UTF-16LE 里）。
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const DUMP = args.includes('--dump');
const KEY = 'miru_v2';

const PROFILES = [
  ['chrome', process.env.LOCALAPPDATA + '\\Google\\Chrome\\User Data\\Default\\Local Storage\\leveldb'],
  ['edge', process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\User Data\\Default\\Local Storage\\leveldb'],
];

function utf16leIndexOf(buf, str) {
  const needle = Buffer.from(str, 'utf16le');
  return buf.indexOf(needle);
}

// 从 UTF-16LE 的字节流里解析一个平衡的 {...}
function extractJson(buf, startByte) {
  let depth = 0, inStr = false, esc = false;
  const out = [];
  for (let i = startByte; i + 1 < buf.length; i += 2) {
    const ch = String.fromCharCode(buf[i] | (buf[i + 1] << 8));
    if (esc) { out.push(ch); esc = false; continue }
    if (ch === '\\' && inStr) { out.push(ch); esc = true; continue }
    if (ch === '"') { inStr = !inStr; out.push(ch); continue }
    if (!inStr) {
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; out.push(ch); if (!depth) break; continue }
    }
    if (depth > 0) out.push(ch);
  }
  return out.join('');
}

let best = null;
for (const [name, dir] of PROFILES) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!/\.(ldb|log)$/.test(f)) continue;
    let buf;
    try { buf = fs.readFileSync(path.join(dir, f)) } catch (_) { continue }
    const at = utf16leIndexOf(buf, KEY);
    if (at < 0) continue;
    // KEY 之后第一个 '{' 之后的 JSON
    let p = at;
    while (p + 1 < buf.length) {
      const ch = String.fromCharCode(buf[p] | (buf[p + 1] << 8));
      if (ch === '{') break;
      p += 2;
    }
    const json = extractJson(buf, p);
    if (!json) continue;
    let obj = null;
    try { obj = JSON.parse(json) } catch (_) { continue }
    if (!best || json.length > best.len) best = { name, file: f, len: json.length, obj };
  }
}

if (!best) { console.log('没找到存档（也许浏览器里还没存过，或存在别的 profile）'); process.exit(1) }

console.log(`找到存档：${best.name} · ${best.file} · ${(best.len / 1024).toFixed(0)} KB`);
const S = best.obj;
const threads = S.threads || {};
const ids = Object.keys(threads);
console.log(`世界/线程数：${ids.length}`);
for (const id of ids) {
  const th = threads[id];
  const msgs = th.msgs || [];
  console.log(`\n=== ${id} · ${th.kind || '?'} · ${msgs.length} 条 · rounds=${th.rounds || 0} ===`);
  if (!DUMP) continue;
  for (const m of msgs) {
    const who = m.who === 'me' ? '我' : (m.who === 'sys' ? ' ' : (m.who === 'n' ? '旁白' : m.who));
    const kind = m.k === 'react' ? '·反应' : m.k === 'think' ? '·内心' : m.k === 'act' ? '·动作' : m.k === 'card' ? '·卡片' : '';
    console.log(`  [${who}${kind}] ${String(m.txt || '').slice(0, 200)}`);
  }
}

if (DUMP) {
  // 顺手把「我点什么」的痕迹也打出来（sugg 只保留最后一轮）
  for (const id of ids) {
    const th = threads[id];
    if (th.sugg && th.sugg.length) console.log(`\n[${id}] 最后一次给的选项：\n  ` + th.sugg.join('\n  '));
  }
}
