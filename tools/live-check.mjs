// 线上到底是不是我们这一版：两个互相独立的证据源
//
//   node tools/live-check.mjs              # ① GitHub Pages 构建状态（权威） ② 直连取页面验指纹
//   node tools/live-check.mjs --stamp      # 只做 ① + 快速取页面头部（慢网络下够用）
//   node tools/live-check.mjs --probe      # 额外验 /api/events 幂等（Vercel；从本机可能连不上）
//
// 为什么需要两个源（2026-10-25 实测）：
//   · 这台机器直连 github.io 极慢（25 秒只下到 450 KB / 共 9.4 MB），Vercel 直接连不上；
//   · 但 api.github.com 一直通（我们就是用它推代码的）。
//   ⇒ **「部署了没」用 GitHub 的构建 API 回答，「内容对不对」用取回的页面自己算指纹回答。**
//   只有前者会骗人（构建成功 ≠ 文件正确），只有后者会不可达（网络慢）。

import fs from 'node:fs';
import crypto from 'node:crypto';

const OWNER = '468013291jeffery', NAME = 'miru';
const PAGES = `https://${OWNER}.github.io/${NAME}/`;
const VERCEL = 'https://miru-wheat-pi.vercel.app/';
const args = process.argv.slice(2);
const STAMP_ONLY = args.includes('--stamp');
const PROBE = args.includes('--probe');

let pass = 0; const fails = [];
const ok = (name, c, d) => { if (c) { pass++; console.log('  ✓ ' + name); } else { fails.push(name); console.log('  ✗ ' + name, d === undefined ? '' : '→ ' + String(d).slice(0, 200)); } };

const tok = (() => {
  try {
    return fs.readFileSync('C:/Users/Administrator/.dsh/.credentials.yaml', 'utf8')
      .split(/\r?\n/).find(l => /^\s*GITHUB_TOKEN\s*:/.test(l))
      .replace(/^\s*GITHUB_TOKEN\s*:\s*/, '').trim().replace(/^['"]|['"]$/g, '');
  } catch (_) { return '' }
})();
const gh = async (p) => {
  const r = await fetch('https://api.github.com' + p, { headers: { Authorization: 'Bearer ' + tok, Accept: 'application/vnd.github+json', 'User-Agent': 'miru-live-check' } });
  const t = await r.text();
  if (!r.ok) throw new Error(p + ' → ' + r.status + ' ' + t.slice(0, 160));
  return JSON.parse(t);
};

const localHead = (() => { try { return fs.readFileSync('.git/HEAD', 'utf8').trim() } catch (_) { return '' } })();
const localStamp = (() => {
  try { const m = fs.readFileSync('index.html', 'utf8').match(/window\.MIRU_BUILD="([^"]+)"/); return m ? m[1] : '' } catch (_) { return '' }
})();

console.log('=== ① GitHub Pages 构建状态（权威：线上跑的是哪个提交）===');
try {
  const pages = await gh(`/repos/${OWNER}/${NAME}/pages`);
  console.log(`     地址 ${pages.html_url} · 状态 ${pages.status} · 类型 ${pages.build_type}`);
  ok('Pages 已发布（status=built）', pages.status === 'built', pages.status);
  const b = await gh(`/repos/${OWNER}/${NAME}/pages/builds/latest`);
  console.log(`     最近构建 ${b.status} · 提交 ${String(b.commit).slice(0, 10)} · ${b.updated_at}`);
  ok('最近一次构建成功', b.status === 'built', b.status);
  const mainHead = await gh(`/repos/${OWNER}/${NAME}/git/ref/heads/main`);
  const mainSha = mainHead.object.sha;
  console.log(`     main 头 ${mainSha.slice(0, 10)}`);
  ok('线上构建的提交 = main 头（没有落后的部署）', b.commit === mainSha, `构建 ${String(b.commit).slice(0, 10)} vs main ${mainSha.slice(0, 10)}`);
} catch (e) { ok('Pages API 可查', false, e.message) }

console.log('\n=== ② 取回线上页面，自己算指纹 ===');
{
  const ctl = new AbortController();
  const tm = setTimeout(() => ctl.abort(), STAMP_ONLY ? 60000 : 600000);
  try {
    const r = await fetch(PAGES, { signal: ctl.signal, headers: STAMP_ONLY ? { Range: 'bytes=0-400000' } : {} });
    const html = await r.text();
    clearTimeout(tm);
    console.log(`     HTTP ${r.status} · 取回 ${(html.length / 1024).toFixed(0)} KB` + (STAMP_ONLY ? '（只取了头部）' : ''));
    const m = html.match(/window\.MIRU_BUILD="([0-9a-f]{12}) ([^"]+)"/);
    ok('线上页面带构建指纹', !!m, m ? '' : '没有 MIRU_BUILD（可能是旧版或还没部署）');
    if (m) {
      console.log(`     线上指纹 ${m[1]} · 构建于 ${m[2]}`);
      if (localStamp) console.log(`     本地指纹 ${localStamp.split(' ')[0]} · ${localStamp.split(' ').slice(1).join(' ')}`);
      ok('线上 = 本地这一版', m[1] === localStamp.split(' ')[0], `线上 ${m[1]} vs 本地 ${localStamp.split(' ')[0]}`);
      if (!STAMP_ONLY) {
        const re = crypto.createHash('sha256').update(html.replace(m[0], ''), 'utf8').digest('hex').slice(0, 12);
        ok('指纹自洽（把指纹剥掉重算仍然一致）', re === m[1], `${re} vs ${m[1]}`);
      }
    }
    if (!STAMP_ONLY) {
      for (const [n, s] of [['手打块', 'THE PLAYER TYPED THESE THEMSELVES'], ['用量记账', 'llm_usage'], ['计划层入口', 'plotGate'], ['流式预览', 'streamPreview']]) {
        ok('线上有：' + n, html.includes(s));
      }
      ok('字体外链非阻塞', /media="print"[^>]*onload=/.test(html));
    }
  } catch (e) {
    clearTimeout(tm);
    ok('能取回线上页面', false, e.name === 'AbortError' ? '取回超时（网络慢，用 --stamp 或换网络）' : e.message);
  }
}

if (PROBE) {
  console.log('\n=== ③ /api/events 幂等探针（Vercel）===');
  const api = VERCEL.replace(/\/$/, '') + '/api/events';
  const key = 'probe:' + Date.now();
  const body = JSON.stringify({ events: [{ name: '__probe__', idem: key, props: { src: 'live-check' } }] });
  try {
    const a = await (await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, signal: AbortSignal.timeout(30000) })).json();
    const b = await (await fetch(api, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, signal: AbortSignal.timeout(30000) })).json();
    console.log('     第一次 ' + JSON.stringify(a) + ' · 第二次 ' + JSON.stringify(b));
    ok('接口已部署（返回含 dupes）', a && 'dupes' in a, JSON.stringify(a));
    ok('同 idem 第二次被判重（dupes=1）', b && b.dupes === 1, JSON.stringify(b));
  } catch (e) { ok('探针能跑通', false, e.message + '（本机可能连不上 Vercel，这不算线上故障）') }
}

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED:\n  ' + fails.join('\n  ')); process.exit(1); }
console.log('线上 = 本地这一版');
