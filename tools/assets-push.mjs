// tools/assets-push.mjs — 官方剧素材：**对账 → 上传 Vercel Blob → 回写槽位表**
//
//   node tools/assets-push.mjs --work w_scmvuwd1eg792b553de7            # 只对账（默认 dry-run，不传不改）
//   node tools/assets-push.mjs --work <id> --write                      # 真上传 + 回写 art/official/<id>.json
//   node tools/assets-push.mjs --work <id> --write --prune-local         # 传完把本地文件删掉（仓库才会缩）
//
// 为什么要有它：
//   一部剧 60 个文件 / 19 MB，手点会漏，而且**漏了没有声音** —— 槽位缺了前端只是跳过，没人会发现。
//   这个脚本的判据是「磁盘 ⇄ 槽位表」双向对账，任一边多出来都当场说。
//
// 为什么素材要离开仓库：
//   9 部剧已经让 .git 到 215 MB、art/ 占 163 MB，而且测试服每次都要跟着同步这一坨。
//   上传到 Blob 之后，`art/official/<id>.json`（几 KB）留在 git，值是绝对 URL ——
//   老前端一行不用改（它拿 map[slot] 直接当 src 用），测试服也不必再同步图片。
//
// 凭据：BLOB_READ_WRITE_TOKEN。取法（按顺序）：
//   1) --token-file <路径>（文件里只有一行 token）
//   2) 环境变量 BLOB_READ_WRITE_TOKEN
//   3) ~/.dsh/.credentials.yaml 里 `BLOB_READ_WRITE_TOKEN: xxx`
//   ⚠️ 别把 token 贴进聊天；放到上面任意一处即可。
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ROOT = 'C:/dev/miru';
const args = process.argv.slice(2);
const arg = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? (args[i + 1] || '') : d; };
const has = k => args.includes('--' + k);

const WORK = arg('work', '');
if (!WORK) { console.error('用法：node tools/assets-push.mjs --work <workId> [--write] [--prune-local] [--token-file x]'); process.exit(2); }
const DIR = arg('dir', path.join(ROOT, 'art', 'official', WORK));
const JSON_PATH = path.join(ROOT, 'art', 'official', WORK + '.json');
const PREFIX = arg('prefix', 'official/' + WORK + '/');
const WRITE = has('write');
const PRUNE = has('prune-local');
const CT = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.mp4': 'video/mp4', '.webm': 'video/webm' };

function token() {
  const tf = arg('token-file', '');
  if (tf && fs.existsSync(tf)) return fs.readFileSync(tf, 'utf8').trim().split(/\r?\n/)[0].trim();
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN.trim();
  const cred = path.join(os.homedir(), '.dsh', '.credentials.yaml');
  if (fs.existsSync(cred)) {
    const line = fs.readFileSync(cred, 'utf8').split(/\r?\n/).find(l => /^\s*BLOB_READ_WRITE_TOKEN\s*:/.test(l));
    if (line) return line.replace(/^\s*BLOB_READ_WRITE_TOKEN\s*:\s*/, '').trim().replace(/^['"]|['"]$/g, '');
  }
  return '';
}

/* Vercel Blob 直传（不引 SDK，形态与 @vercel/blob 的 put 一致）：
   PUT https://blob.vercel-storage.com/<pathname>  + Bearer token + x-api-version */
async function putBlob(tok, pathname, buf, contentType) {
  const r = await fetch('https://blob.vercel-storage.com/' + pathname, {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + tok,
      'x-api-version': '7',
      'x-content-type': contentType,
      'x-add-random-suffix': '0',          // 固定 URL：槽位表里写死才有意义，随机后缀会让每次上传换地址
      'x-cache-control-max-age': '31536000',
    },
    body: buf,
  });
  const txt = await r.text();
  if (!r.ok) throw new Error('PUT ' + r.status + ' ' + txt.slice(0, 200));
  return JSON.parse(txt);
}

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const map = fs.existsSync(JSON_PATH) ? JSON.parse(fs.readFileSync(JSON_PATH, 'utf8')) : {};
const files = fs.existsSync(DIR) ? walk(DIR) : [];
const rel = p => p.slice(path.normalize(DIR).length + 1).replace(/\\/g, '/');

// 槽位 → 文件：以槽位表为准，值可能是相对路径，也可能是已经上传后的绝对 URL
const byRel = new Map();          // "v1/bg_01.jpg" -> slot
for (const [slot, v] of Object.entries(map)) {
  const v2 = String(v);
  const m = /^art\/official\/[^/]+\/(.+)$/.exec(v2);
  let rel2 = m ? m[1] : '';
  if (!rel2) {              // 已经是 Blob URL 的，从 '/official/<work>/' 之后取
    const marker = '/official/' + WORK + '/';
    const i = v2.indexOf(marker);
    if (i >= 0) rel2 = v2.slice(i + marker.length);
  }
  if (rel2) byRel.set(rel2, slot);
}
const onDisk = new Set(files.map(rel));
const problems = [];
const pending = [];               // 要上传的
const known = [];                 // 已经在 Blob 的

for (const [slot, v] of Object.entries(map)) {
  const m = /^art\/official\/[^/]+\/(.+)$/.exec(String(v));
  if (!m) { if (/^https?:\/\//.test(String(v))) known.push(slot); else problems.push('槽位 ' + slot + ' 的值认不出：' + String(v).slice(0, 60)); continue; }
  if (!onDisk.has(m[1])) problems.push('槽位 ' + slot + ' 指的文件不在磁盘上：' + m[1]);
  else pending.push({ slot, rel: m[1], abs: path.join(DIR, m[1].split('/').join(path.sep)) });
}
const unregistered = [...onDisk].filter(r => !byRel.has(r));

console.log('剧：' + WORK);
console.log('  槽位表：' + Object.keys(map).length + ' 条（已在 Blob：' + known.length + ' · 待上传：' + pending.length + '）');
console.log('  磁盘：' + files.length + ' 个文件 · ' + (files.reduce((a, f) => a + fs.statSync(f).size, 0) / 1048576).toFixed(1) + ' MB');
if (unregistered.length) console.log('  ⚠️ 磁盘上有、槽位表没登记的：' + unregistered.slice(0, 8).join(', ') + (unregistered.length > 8 ? ' …共 ' + unregistered.length : ''));
if (problems.length) { console.log('\n✗ 对账问题 ' + problems.length + ' 条：'); problems.slice(0, 12).forEach(p => console.log('   · ' + p)); }
else console.log('  ✓ 对账干净（槽位表里每一条都对得上磁盘文件）');

// --verify：槽位表里的每一条，**从线上**取一次（迁移前后都能跑）。
// 迁移前的值是相对路径（拼站点根），迁移后是 Blob 的绝对 URL —— 两种都验。
if (has('verify')) {
  const base = arg('base', 'https://www.miru.plus').replace(/\/+$/, '');
  let ok = 0; const bad = [];
  for (const [slot, v] of Object.entries(map)) {
    const s = String(v);
    const url = /^https?:\/\//.test(s) ? s : base + '/' + s.replace(/^\/+/, '');
    try {
      const r = await fetch(url, { method: 'HEAD' });
      if (r.ok) ok++; else bad.push(slot + ' → HTTP ' + r.status + '  ' + url.slice(0, 90));
    } catch (e) { bad.push(slot + ' → ' + String((e && e.message) || e).slice(0, 70)); }
  }
  console.log('\n线上可达 ' + ok + ' / ' + (ok + bad.length) + (bad.length ? '（取不到 ' + bad.length + ' 条）' : '  ✓ 全部可达'));
  bad.slice(0, 12).forEach(x => console.log('  ✗ ' + x));
  if (bad.length > 12) console.log('  …还有 ' + (bad.length - 12) + ' 条');
  process.exit(bad.length ? 1 : 0);
}

if (!WRITE) {
  console.log('\n（dry-run：什么都没传、没改。加 --write 真上传并回写槽位表；加 --verify 从线上验每一张图）');
  process.exit(problems.length ? 1 : 0);
}
if (!pending.length) { console.log('\n没有要上传的（都已经是 URL 了）。'); process.exit(0); }

const tok = token();
if (!tok) { console.error('\n✗ 找不到 BLOB_READ_WRITE_TOKEN。放到 ~/.dsh/.credentials.yaml 或 --token-file，别贴聊天里。'); process.exit(2); }

let done = 0, fail = 0;
const next = { ...map };
for (const p of pending) {
  const ct = CT[path.extname(p.abs).toLowerCase()] || 'application/octet-stream';
  const pathname = PREFIX + p.rel;
  process.stdout.write('  ↑ ' + p.rel + ' (' + (fs.statSync(p.abs).size / 1048576).toFixed(1) + ' MB) … ');
  try {
    const j = await putBlob(tok, pathname, fs.readFileSync(p.abs), ct);
    next[p.slot] = j.url;
    done++;
    console.log('ok');
  } catch (e) { fail++; console.log('✗ ' + String(e.message || e).slice(0, 160)); }
}

fs.writeFileSync(JSON_PATH, JSON.stringify(next, null, 1) + '\n');
console.log('\n上传 ' + done + ' 个 · 失败 ' + fail + ' · 槽位表已回写：' + JSON_PATH);

if (PRUNE && !fail) {
  // 只有槽位表里**已经没有任何指向本地路径的值**时才删 —— 否则删掉就没有回退的路了。
  if (Object.values(next).some(v => /^art\/official\//.test(String(v)))) {
    console.log('✗ 槽位表里还有指向本地的值，拒绝删本地文件（先确认上传都成功）');
    process.exit(1);
  }
  for (const f of files) { try { fs.unlinkSync(f); } catch (_) {} }
  // 清掉空目录，但留着 v1 这层会让 git 里剩一堆空文件夹 —— 全删到底
  const pruneDir = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const q = path.join(d, e.name); if (e.isDirectory()) { pruneDir(q); try { fs.rmdirSync(q); } catch (_) {} } } };
  try { pruneDir(DIR); } catch (_) {}
  console.log('已删本地文件（--prune-local），记得 git add -A art/official/' + WORK + ' 把删除一起提交');
}
