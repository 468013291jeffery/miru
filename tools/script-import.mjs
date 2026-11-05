// 识别编剧中文稿（规则在 api/_scriptparse.js，后台「识别编剧中文稿」用的是同一份）
//
//   node tools/script-import.mjs 稿子.txt                     只识别，打印结果
//   node tools/script-import.mjs 稿子.txt --id w_xxx --write  识别通过后写入 art/official/w_xxx.bible.json
//
// 退出码：有要改的地方 = 1，只有提醒 = 0。写入还会生成一份 <作品ID>.images.txt，列出要做的图。
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { parseManuscript } = require('../api/_scriptparse.js');
const { checkBible } = require('../api/_stylecheck.js');

const args = process.argv.slice(2);
const file = args.find(a => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--id');
const id = args.includes('--id') ? args[args.indexOf('--id') + 1] : '';
if (!file || !fs.existsSync(file)) { console.log('用法：node tools/script-import.mjs 稿子.txt [--id 作品ID --write]'); process.exit(1); }

const r = parseManuscript(fs.readFileSync(file, 'utf8'), { id });
const st = r.bible ? checkBible(r.bible) : { err: [], warn: [] };
const err = r.err.concat(st.err), warn = r.warn.concat(st.warn);

if (r.stats) console.log('识别到：人物 ' + r.stats.people + ' · 章 ' + r.stats.chapters + ' · 场 ' + r.stats.scenes + ' · 选项 ' + r.stats.options + ' · 结局 ' + r.stats.endings + ' · 图片 ' + r.stats.images + ' · 编剧写的特效 ' + r.stats.authoredFx);
err.forEach(x => console.log('✗ ' + x));
warn.forEach(x => console.log('⚠ ' + x));
console.log('结论：' + (err.length ? '不通过（' + err.length + ' 处要改）' : '通过') + '（' + warn.length + ' 条提醒）');

if (!err.length && args.includes('--write')) {
  if (!/^[A-Za-z0-9_-]+$/.test(id)) { console.log('✗ 写入要带 --id，只能用字母、数字、下划线和短横线'); process.exit(1); }
  const out = path.join('art/official', id + '.bible.json');
  fs.writeFileSync(out, JSON.stringify(r.bible, null, 2) + '\n');
  const list = r.images.map(i => [i.slot, i.kind, i.name, i.when ? '条件：' + i.when : '', i.desc].filter(Boolean).join(' · ')).join('\n');
  fs.writeFileSync(path.join('art/official', id + '.images.txt'), list + '\n');
  console.log('已写入 ' + out + '，图片清单 ' + id + '.images.txt');
}
process.exit(err.length ? 1 : 0);
