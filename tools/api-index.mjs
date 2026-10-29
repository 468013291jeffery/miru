// tools/api-index.mjs — 把 api/*.js 里的接口「提出来」，生成 api/_index.js（后台「API」页读它）
//
//   node tools/api-index.mjs            打印给人看
//   node tools/api-index.mjs --write    写进 api/_index.js
//   node tools/api-index.mjs --check    与磁盘上的比，过期 exit 1（给 check-all 用）
//
// 为什么是构建期生成、不是运行时扫目录：Vercel 打包只会带上被 require 到的文件，
// 运行时 readdir 在线上大概率看不见兄弟函数 ⇒ 那会在线上静默变成空表。生成物是死文件，打包一定带得走。
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const DIR = path.join(ROOT, 'api');
const OUT = path.join(DIR, '_index.js');

const METHOD_RX = /^(GET|POST|PUT|DELETE|PATCH)\b\s*(.*)$/;
const R_X = /if\s*\(\s*r\s*===\s*'([^']+)'\s*\)/g;
/* 只收「带明确取值的」查询分支（?ping=qwen / ?r=x）：`if (q.status)` 这种通用判断散落各处，
   全收进来会把目录淹在噪声里 —— 目录要能当说明书用，不是把正则命中全倒出来。 */
const Q_RX = /if\s*\(\s*q\.([A-Za-z]+)\s*===\s*'([^']+)'\s*\)/g;

function header(lines) {
  const out = [];
  for (const ln of lines) {
    if (/^\s*\/\//.test(ln)) out.push(ln.trim().replace(/^\/\/\s?/, ''));
    else if (ln.trim() === '') { if (out.length) break; }
    else break;
  }
  return out;
}

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.js') && !f.startsWith('_')).sort();
const idx = files.map(f => {
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');
  const lines = src.split(/\r?\n/);
  const head = header(lines);
  const methods = new Set(), routes = [], seen = new Set();
  for (const l of head) {
    const m = l.match(METHOD_RX);
    if (!m || seen.has('m:' + m[1])) continue;
    seen.add('m:' + m[1]); methods.add(m[1]);
    routes.push({ name: m[1], desc: m[2].trim().slice(0, 160) });
  }
  for (const m of src.matchAll(R_X)) {
    const k = 'r:' + m[1]; if (seen.has(k)) continue; seen.add(k);
    routes.push({ name: '?r=' + m[1], desc: '' });
  }
  for (const m of src.matchAll(Q_RX)) {
    const n = m[2] ? '?' + m[1] + '=' + m[2] : '?' + m[1];
    if (seen.has('q:' + n)) continue; seen.add('q:' + n);
    routes.push({ name: n, desc: '' });
  }
  return {
    id: f.replace(/\.js$/, ''),
    path: '/api/' + f.replace(/\.js$/, ''),
    desc: (head[0] || '').slice(0, 200),
    methods: [...methods].join(' / ') || 'GET',
    routes,
  };
});

const body = '// 由 tools/api-index.mjs 生成 —— 不要手改。改了 api/*.js 之后重跑一次 `node tools/api-index.mjs --write`。\n'
  + 'module.exports = ' + JSON.stringify(idx) + ';\n';

if (process.argv.includes('--write')) {
  fs.writeFileSync(OUT, body);
  console.log('已写入 api/_index.js：' + idx.length + ' 个端点 · ' + idx.reduce((a, x) => a + x.routes.length, 0) + ' 条路由');
} else if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur !== body) { console.log('✗ api/_index.js 过期 —— 跑 `node tools/api-index.mjs --write`'); process.exit(1); }
  console.log('✓ api/_index.js 与 api/*.js 一致（' + idx.length + ' 个端点）');
} else {
  for (const x of idx) {
    console.log(x.path + '   [' + x.methods + ']   ' + x.desc.slice(0, 90));
    for (const r of x.routes) console.log('    ' + r.name + (r.desc ? '   ' + r.desc.slice(0, 90) : ''));
  }
  console.log('\n' + idx.length + ' 个端点 · ' + idx.reduce((a, x) => a + x.routes.length, 0) + ' 条路由');
}
