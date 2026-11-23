// 用 index.html 里真实打包的客户端代码，跑一遍文件包读取与槽位审查。
//   node tools/pkg-client-probe.mjs /tmp/miru_test_package.b64
// 不启动浏览器：只把 index.html 里的那一段函数切出来执行，验证的是最终产物而不是源文件。
import fs from 'node:fs';

const b64file = process.argv[2] || '/tmp/miru_test_package.b64';
const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('/* ================= 剧本文件包');
const end = html.indexOf('/* ---------- UI ---------- */', start);
if (start < 0 || end < 0) { console.error('package block not found in index.html'); process.exit(2); }
const block = html.slice(start, end);
const api = new Function('TextDecoder', 'DecompressionStream', 'Response', 'Blob',
  block + '\nreturn { imSlots, imPkgQA, imZip, imReadPackage, imMime };')(TextDecoder, DecompressionStream, Response, Blob);

const buf = Buffer.from(fs.readFileSync(b64file, 'utf8').trim(), 'base64');
const pkg = await api.imReadPackage(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const qa = api.imPkgQA(pkg.script, pkg.manifest.assets, pkg.manifest.characters);

let pass = 0; const fails = [];
const ok = (n, got, want) => { const g = JSON.stringify(got), w = JSON.stringify(want); if (g === w) { pass++; console.log('  ✓', n); } else { fails.push(n); console.log('  ✗', n, '\n      got  ' + g + '\n      want ' + w); } };
const truthy = (n, v) => { if (v) { pass++; console.log('  ✓', n); } else { fails.push(n); console.log('  ✗', n); } };

ok('script read', pkg.scriptName, 'script.md');
ok('manifest name', pkg.manifestName, 'manifest.json');
ok('title', pkg.manifest.work.title, '雨夜测试');
ok('character card kept', pkg.manifest.characters.length, 1);
ok('files read', [...pkg.files.keys()].sort(), ['assets/bg/c01s01.jpg', 'assets/bgm/tense.mp3', 'assets/cg_rain.jpg', 'assets/char_rowan.jpg', 'assets/cover.jpg', 'assets/open.mp4', 'manifest.json', 'script.md']);
ok('bg slot', qa.slots.bg, ['bg_c01s01']);
ok('cg slot', qa.slots.cg, ['CG_RAIN']);
ok('bgm slot', qa.slots.bgm, ['BGM_TENSE']);
ok('bg coverage', qa.coverage.bg, { have: 1, total: 1 });
ok('cg coverage', qa.coverage.cg, { have: 1, total: 1 });
ok('bgm coverage', qa.coverage.bgm, { have: 1, total: 1 });
ok('portrait mapped', qa.coverage.char.have, 1);
truthy('no missing assets', qa.missing.length === 0);
ok('mime jpg', api.imMime('a/b.jpg'), 'image/jpeg');
ok('mime mp3', api.imMime('tense.mp3'), 'audio/mpeg');

console.log('\n' + pass + ' passed, ' + fails.length + ' failed');
if (fails.length) process.exit(1);
