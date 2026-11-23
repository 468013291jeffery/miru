// 发布载荷探针：从 index.html 里切出真实的 imPublish，桩掉网络与 DOM，
// 验证「素材按槽位上传 → /api/works 收到 script + assets + characters + games」。
//   node tools/pkg-publish-probe.mjs
import fs from 'node:fs';

const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('async function imPublish(){');
if (start < 0) { console.error('imPublish not found'); process.exit(2); }
let i = html.indexOf('{', start), depth = 0, end = -1;
for (; i < html.length; i++) {
  const ch = html[i];
  if (ch === '{') depth++;
  else if (ch === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
}
if (end < 0) { console.error('imPublish block not closed'); process.exit(2); }
const fn = html.slice(start, end);

const calls = [];
const btn = { textContent: 'run' };
const document = { querySelector: () => btn, };
const $ = () => null;
const toast = () => {};
const LL = (a) => a;
const CL = () => 'zh';
const cloudInfo = () => ({ token: 't' });
const imOrient = () => 'bg';
const imRender = () => {};
let capi = async (path, opt) => {
  calls.push({ path, opt });
  if (/^\/pkg\?/.test(path)) {
    const q = new URLSearchParams(path.split('?')[1]);
    return { ok: true, j: { asset: { url: 'https://blob.example/' + q.get('slot') } } };
  }
  if (path === '/works') return { ok: true, j: { status: 'live', qa: { assets: { missing: [] } } } };
  return { ok: false, j: {} };
};

const IM = {
  doc: { title: '雨夜测试', chapters: [], pov: '罗温' },
  as: '罗温',
  text: '# CHAPTER 1｜雨夜\n⟦BG|bg_c01s01|影院⟧\n旁白：门开了。',
  pkgId: 'w_test',
  pkg: {
    manifestName: 'manifest.json',
    scriptName: 'script.md',
    script: '# CHAPTER 1｜雨夜\n⟦BG|bg_c01s01|影院⟧\n旁白：门开了。',
    files: new Map([
      ['assets/bg/c01s01.jpg', new Uint8Array([1, 2, 3])],
      ['assets/cover.jpg', new Uint8Array([4, 5])],
      ['assets/open.mp4', new Uint8Array([6])],
      ['assets/char_rowan.jpg', new Uint8Array([7])],
      ['assets/games/find.json', new TextEncoder().encode('{"id":"g_find"}')],
    ]),
    manifest: {
      work: { title: '雨夜测试', hook: 'h', premise: 'p', you: 'y', lang: 'zh', orient: 'bg', tags: ['t'], adult: false, as: '罗温' },
      cover: 'assets/cover.jpg',
      opening_video: 'assets/open.mp4',
      characters: [{ key: 'rowan', name: '罗温', portrait: 'assets/char_rowan.jpg' }],
      assets: { bg_c01s01: 'assets/bg/c01s01.jpg', g_find: 'assets/games/find.json' },
      games: [{ id: 'g_find', tpl: 'find', a: 'x', b: 'y' }],
    },
  },
};

const run = new Function('IM', 'document', '$', 'toast', 'LL', 'CL', 'cloudInfo', 'imOrient', 'imRender', 'capi', 'imMime',
  fn + '\nreturn imPublish;')(IM, document, $, toast, LL, CL, cloudInfo, imOrient, imRender, (p, o) => capi(p, o), (p) => {
  const e = String(p || '').split('.').pop().toLowerCase();
  return e === 'jpg' ? 'image/jpeg' : e === 'mp4' ? 'video/mp4' : e === 'json' ? 'application/json' : 'application/octet-stream';
});

await run();

let pass = 0; const fails = [];
const ok = (n, got, want) => { const g = JSON.stringify(got), w = JSON.stringify(want); if (g === w) { pass++; console.log('  ✓', n); } else { fails.push(n); console.log('  ✗', n, '\n      got  ' + g + '\n      want ' + w); } };
const truthy = (n, v) => { if (v) { pass++; console.log('  ✓', n); } else { fails.push(n); console.log('  ✗', n); } };

const ups = calls.filter(c => /^\/pkg\?/.test(c.path)).map(c => new URLSearchParams(c.path.split('?')[1]).get('slot')).sort();
ok('uploads by slot', ups, ['bg_c01s01', 'char_rowan', 'cover', 'g_find', 'opening_video']);
const pub = calls.find(c => c.path === '/works');
truthy('works called', !!pub);
ok('script sent', pub.opt.json.work.pack.script, IM.text);
ok('assets sent', Object.keys(pub.opt.json.work.pack.assets).sort(), ['bg_c01s01', 'char_rowan', 'char_罗温', 'g_find', 'opening_video']);
ok('characters sent', pub.opt.json.work.pack.characters.length, 1);
ok('games sent', pub.opt.json.work.pack.games[0].id, 'g_find');
ok('cover url', pub.opt.json.work.cover, 'https://blob.example/cover');
ok('orient from script', pub.opt.json.work.orient, 'bg');

console.log('\n' + pass + ' passed, ' + fails.length + ' failed');
if (fails.length) process.exit(1);
