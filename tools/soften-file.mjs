// 把某个文件里**整行**形状的 `try{ X }catch(_){}` 换成 `soft("文件:L行", function(){ X })`
//
//   为什么只做整行：行内形状（`busy=false;try{…}catch(_){}`）用正则替换会破坏语法 ——
//   2026-10-27 实测过一次（32 处替换后 `Unexpected number`，回滚）。
//
//   用法：node tools/soften-file.mjs source/src/app94_official2.js [--dry]
//   前置：app3_chat.js 里必须有 `function soft(`（函数声明会提升，其它文件可直接调用）
import fs from 'node:fs';

const P = process.argv[2];
const dry = process.argv.includes('--dry');
if (!P) { console.log('用法: node tools/soften-file.mjs <文件> [--dry]'); process.exit(1) }
if (!fs.existsSync(P)) { console.log('没有这个文件: ' + P); process.exit(1) }

// 前置检查：soft 必须有定义，否则换完就是运行时 ReferenceError（且它本来就会静默）
const chat = 'source/src/app3_chat.js';
if (!fs.existsSync(chat) || !/function soft\s*\(/.test(fs.readFileSync(chat, 'utf8'))) {
  console.log('✗ app3_chat.js 里没有 function soft( —— 先补定义再换');
  process.exit(1);
}

const lines = fs.readFileSync(P, 'utf8').split('\n');
const base = P.split(/[\\/]/).pop().replace(/\.js$/, '');
let n = 0;

for (let i = 0; i < lines.length; i++) {
  const raw = lines[i];
  const s = raw.trim();
  if (!/^try\{[\s\S]*\}catch(\([^)]*\))?\{\}$/.test(s)) continue;
  const m = /^try\{([\s\S]*)\}catch(\([^)]*\))?\{\}$/.exec(s);
  if (!m) continue;
  const indent = raw.slice(0, raw.length - raw.trimStart().length);
  const rep = indent + 'soft("' + base + ':L' + (i + 1) + '",function(){' + m[1] + '});';
  if (dry) { console.log('  L' + (i + 1) + '  →  ' + rep.trim().slice(0, 120)); n++; continue }
  lines[i] = rep;
  n++;
}

if (!dry && n) fs.writeFileSync(P, lines.join('\n'), 'utf8');
console.log((dry ? '将替换 ' : '已替换 ') + n + ' 处（' + base + '）');
