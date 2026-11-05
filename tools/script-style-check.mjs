// 剧本样式检查命令（规则在 api/_stylecheck.js，后台「D先生审查」用的是同一份）
//
//   node tools/script-style-check.mjs                 查 art/official/ 下全部故事圣经
//   node tools/script-style-check.mjs <作品ID|文件>   只查指定的作品（可多个）
//   node tools/script-style-check.mjs --selftest      验证检查器本身会红（check-all 用）
//
// 退出码：有硬错 = 1，只有提醒 = 0。上传 art/official/*.bible.json 后 GitHub Actions 也会跑一遍。
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const { checkBible, checkDsl } = createRequire(import.meta.url)('../api/_stylecheck.js');

const DIR = 'art/official';
const args = process.argv.slice(2);

function selftest() {
  const good = () => ({
    intro: { zh: '第一段。\n\n第二段。' }, cast: [{ key: 'a' }], experience: { schema: 1, storyIntroduction: true, chapterIntroduction: true, pacing: { minExchanges: 12, targetExchanges: 18 } },
    capabilities: { chapterNavigation: 'manual' },
    chapters: [{ n: 1, title: { zh: '两张邀请' }, introduction: { time: '夜晚', event: '有人递来邀请。', text: '灯亮了。' }, scenes: [{ id: 's1', place: { zh: '门廊' }, present: ['a'], choice: { options: [{ t: '先认识你' }] } }] }],
  });
  const cases = [
    ['合格样例不报错', b => b, 0],
    ['缺故事背景', b => { b.intro = ''; }, 1],
    ['导语自带标签', b => { b.chapters[0].introduction.time = '时间：夜晚'; }, 1],
    ['导语字段换行', b => { b.chapters[0].introduction.event = '一\n二'; }, 1],
    ['标题写了第 N 章', b => { b.chapters[0].title.zh = '第1章 两张邀请'; }, 1],
    ['故事背景带 HTML', b => { b.intro.zh = '<b>粗体</b>'; }, 1],
    ['人物不在 cast', b => { b.chapters[0].scenes[0].present = ['nobody']; }, 1],
    ['缺地点', b => { delete b.chapters[0].scenes[0].place; }, 1],
    ['轮数门槛倒挂', b => { b.experience.pacing.minExchanges = 30; }, 1],
    ['自动换章', b => { b.capabilities.chapterNavigation = 'auto'; }, 1],
  ];
  let bad = 0;
  for (const [name, change, expectErr] of cases) {
    const b = good(); change(b);
    const n = checkBible(b).err.length;
    const ok = expectErr ? n > 0 : n === 0;
    if (!ok) { bad++; console.log('✗ ' + name + '：' + n + ' 个硬错'); }
  }
  const dslBad = checkDsl('## CHAPTER 1｜第1章 开始\n## CHAPTER 2｜').err.length !== 2;
  if (dslBad) { bad++; console.log('✗ DSL 章节标题检查没有报错'); }
  if (checkBible(null).ok) { bad++; console.log('✗ 空文件没有报错'); }
  /* 仓库里现有的圣经必须保持全绿，否则这道闸等于没开 */
  const failing = listAll().filter(f => !isPlaceholder(f) && !checkBible(read(f)).ok);
  if (failing.length) { bad++; console.log('✗ 现有圣经有硬错：' + failing.join(', ')); }
  console.log(bad ? 'FAILED: ' + bad + ' 项' : 'style check selftest: ' + (cases.length + 2) + ' 项通过，现有圣经全绿');
  process.exit(bad ? 1 : 0);
}

function read(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function listAll() { return fs.readdirSync(DIR).filter(f => f.endsWith('.bible.json')).map(f => path.join(DIR, f)); }
/* 内容为 null 的圣经是作品的占位文件：App 按「没有圣经」处理，不算错 */
function isPlaceholder(file) { return read(file) === null; }

if (args.includes('--selftest')) selftest();

const targets = args.length ? args.map(a => fs.existsSync(a) ? a : path.join(DIR, a + '.bible.json')) : listAll();
let errors = 0, warnings = 0;
for (const file of targets) {
  let bible;
  try { bible = read(file); } catch (e) { errors++; console.log('✗ ' + file + '：读不出来（' + e.message + '）'); continue; }
  if (bible === null) { console.log('— ' + path.basename(file) + '：占位文件，跳过'); continue; }
  const r = checkBible(bible);
  errors += r.err.length; warnings += r.warn.length;
  const title = (bible.title && (bible.title.zh || bible.title.en)) || '';
  console.log((r.ok ? '✓ ' : '✗ ') + path.basename(file) + (title ? '《' + title + '》' : '') + '：' + r.stats.chapters + ' 章 · ' + r.err.length + ' 硬错 · ' + r.warn.length + ' 提醒');
  r.err.forEach(x => console.log('    ✗ ' + x));
  r.warn.forEach(x => console.log('    ⚠ ' + x));
  if (process.env.GITHUB_ACTIONS) r.err.forEach(x => console.log('::error file=' + file + '::' + x));
}
console.log('\n结论：' + (errors ? '不通过' : '通过') + '（' + errors + ' 硬错 / ' + warnings + ' 提醒）');
process.exit(errors ? 1 : 0);
