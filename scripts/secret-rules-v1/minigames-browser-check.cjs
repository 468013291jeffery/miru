// 用法：node scripts/secret-rules-v1/minigames-browser-check.cjs <仓库根> <截图目录>（可设 PW=playwright 模块路径、CHROME=浏览器路径）
// 页面内驱动：真实打包 index.html，逐个点击真实按钮玩完 36 个游戏，并检查输/跳过/无入口场景。
const fs = require('node:fs'), path = require('node:path'), http = require('node:http');
const { chromium } = require(process.env.PW || 'playwright');
const repo = process.argv[2], out = process.argv[3], WID = 'w_scmwpr8uzu0de91e05b5';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
(async () => {
  const server = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://local');
    if (u.pathname.startsWith('/api/')) { res.writeHead(200, { 'content-type': 'application/json' }); return res.end('{"ok":true,"db":false,"rows":[],"works":[]}'); }
    const f = path.resolve(repo, '.' + decodeURIComponent(u.pathname === '/' ? '/index.html' : u.pathname));
    if (!f.startsWith(repo) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r)); const origin = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROME, args: ['--disable-gpu', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'] });
  const page = await (await browser.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.route('**/*', async route => {
    const u = new URL(route.request().url()); if (route.request().resourceType() === 'media') return route.fulfill({ status: 204, body: '' });
    if (u.origin === origin) return route.continue();
    if (u.hostname.endsWith('miru.plus')) { const f = path.resolve(repo, '.' + decodeURIComponent(u.pathname)); if (fs.existsSync(f)) return route.fulfill({ status: 200, body: fs.readFileSync(f), contentType: types[path.extname(f)] }); }
    return route.fulfill({ status: 204, body: '' });
  });
  await page.goto(origin, { waitUntil: 'load' }); await page.waitForFunction(() => typeof install98 === 'function' && window.PICK3_176);
  const r = await page.evaluate(async (WID) => {
    const log = [], fail = m => { throw new Error(m); };
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    const until = async (fn, what, ms = 8000) => { const t = Date.now(); while (Date.now() - t < ms) { const v = fn(); if (v) return v; await sleep(40); } fail('等不到：' + what + ' | busy=' + busy + ' curT=' + (curT===th?.id) + ' sheet=' + ((document.querySelector('.sheet')||{}).outerHTML||'none').slice(0,600) + ' dock=' + !!document.getElementById('authored-game98')); };
    const click = async (sel, text, what) => { const el = await until(() => [...document.querySelectorAll(sel)].find(e => (!text || e.textContent.includes(text)) && !e.disabled), what || sel); el.click(); await sleep(20); };
    S.ob = S.ageOk = true; S.authChoice = 'guest'; S.lang = 'zh'; S.fxOff = S.sfxOff = true; S.bgm = false; S.voice = Object.assign({}, S.voice, { auto: false }); S.autoVoice = false;
    S.personas[0] = { id: 'pilot', name: '测试读者', pron: 'she', age: 29 }; S.pid = 'pilot';
    liveOn = () => true; aiGate = () => true; useUnits = () => {}; gen96 = async () => null; cloudPush = async () => {}; walletDiff = () => {}; capi = async () => ({ ok: true, status: 200, j: { ok: true, rows: [], db: false } });
    const beats = []; ask = async () => ({ narration: '', speakers: [], options: [], summary: '' });
    const realBeat = beat98; beat98 = async (th, mode, act) => { beats.push(act && act.txt); };
    startApp(); closeSheet();
    var wid = await install98(WID), b = bOf98(wd(wid)); var th = new98(wid, b.player.key); openThread(th.id); await enter98(th); await sleep(2500); closeSheet(); await sleep(300); closeSheet();
    const games = []; b.chapters.forEach(c => c.scenes.forEach((s, i) => { if (s.game) games.push({ ch: c.n, sc: i, id: s.game.id }); }));
    if (!b.games_on || games.length !== 36) fail('游戏数量不对：' + games.length);
    const go = (ch, sc) => { mgClose(); closeSheet(); th.b98.ch = ch; th.b98.sc = sc; th.b98.gameResults = {}; th.b98.gameReady98 = {}; th.b98.flags = []; busy = false; renderChat(); dock98(); return !!document.getElementById('authored-game98'); };
    const played = [];
    for (const g of games) {
      if (!go(g.ch, g.sc)) fail('入口没出现：' + g.id);
      const { s } = scene98(th); if (s.game.id !== g.id) fail('场景错位：' + g.id);
      await click('#authored-game98 [data-authored-game98="play"]', '', g.id + ' 入口');
      await click('.sheet [data-authored-player98="__solo"]', '', g.id + ' 开始');
      await until(() => document.querySelectorAll('.mg60 .m168 button.k').length === 3, g.id + ' 三个选项');
      const box = document.querySelector('.mg60'); if (!box.textContent.includes(s.game.play.ask[0])) fail(g.id + ' 题干没显示');
      const ans = s.game.play.items[s.game.play.ans][0];
      await click('.mg60 .m168 button.k', ans, g.id + ' 正确选项');
      await click('.mg60 .m168 button.go', '', g.id + ' 确认');
      await click('.mg60 [data-mgback]', '', g.id + ' 回到剧情');
      const rec = th.b98.gameResults[g.id];
      if (!rec || rec.result !== 'WIN') fail(g.id + ' 没记成 WIN');
      if (!th.b98.flags.includes('mg_' + g.id + '_win')) fail(g.id + ' 没写 win 旗标');
      if (document.getElementById('authored-game98')) fail(g.id + ' 玩完入口没收起');
      const card = th.msgs.at(-1); if (!card || card.k !== 'card' || !card.title.includes('成功')) fail(g.id + ' 没有结果卡');
      played.push(g.id);
    }
    // 和 Rowan 一起、两次答错：LOSE，不写 win，不改好感，Rowan 回应一次
    go(4, 1); const love0 = JSON.stringify(th.love); beats.length = 0;
    await click('#authored-game98 [data-authored-game98="play"]');
    const buddy = await until(() => document.querySelector('.sheet [data-authored-player98]:not([data-authored-player98="__solo"])'), '和Rowan一起 按钮');
    const buddyText = buddy.textContent; buddy.click();
    await until(() => document.querySelectorAll('.mg60 .m168 button.k').length === 3, '选项');
    { const { s } = scene98(th); const wrong = s.game.play.items.find((_, i) => i !== s.game.play.ans)[0];
      for (let i = 0; i < 2; i++) { await click('.mg60 .m168 button.k', wrong); await click('.mg60 .m168 button.go'); } }
    await click('.mg60 [data-mgback]');
    const lose = th.b98.gameResults.MG_CH04_A;
    if (lose.result !== 'LOSE' || th.b98.flags.some(f => f.endsWith('_win')) || JSON.stringify(th.love) !== love0) fail('输了的处理不对');
    if (lose.participants.length !== 1 || beats.length !== 1) fail('和Rowan一起时没有回应');
    const loseCard = th.msgs.at(-1).txt;
    // 入口「先不玩」
    go(9, 3); await click('#authored-game98 [data-authored-game98="skip"]');
    if (th.b98.gameResults.MG_CH09_B.result !== 'SKIP' || th.b98.flags.length) fail('先不玩处理不对');
    const skipCard = th.msgs.at(-1).txt;
    // 游戏里点「跳过」
    go(18, 3); await click('#authored-game98 [data-authored-game98="play"]'); await click('.sheet [data-authored-player98="__solo"]');
    await click('.mg60 [data-mgskip]'); if (th.b98.gameResults.MG_CH18_B.result !== 'SKIP') fail('游戏内跳过不对');
    // Rowan 不在场（独立路线）时自己玩、答错：结果卡不提 Rowan
    go(5, 1); th.b98.here = { scene: 'c05s02', ids: [] };
    renderChat(); dock98(); await click('#authored-game98 [data-authored-game98="play"]');
    if (document.querySelector('.sheet [data-authored-player98]:not([data-authored-player98="__solo"])')) fail('Rowan 不在场却出现一起玩');
    await click('.sheet [data-authored-player98="__solo"]');
    await until(() => document.querySelectorAll('.mg60 .m168 button.k').length === 3, '选项');
    { const { s } = scene98(th); const wrong = s.game.play.items.find((_, i) => i !== s.game.play.ans)[0];
      for (let i = 0; i < 2; i++) { await click('.mg60 .m168 button.k', wrong); await click('.mg60 .m168 button.go'); } }
    await click('.mg60 [data-mgback]'); const soloCard = th.msgs.at(-1).txt; if (/Rowan|罗温/.test(soloCard)) fail('独自玩时结果卡还在说 Rowan');
    // 无游戏的场景没有入口；超时判输
    if (go(1, 0) || go(5, 4)) fail('没有游戏的场景出现了入口');
    // 存档恢复后不能重复玩
    go(2, 1); await click('#authored-game98 [data-authored-game98="play"]'); await click('.sheet [data-authored-player98="__solo"]');
    await until(() => document.querySelectorAll('.mg60 .m168 button.k').length === 3, '选项');
    { const { s } = scene98(th); await click('.mg60 .m168 button.k', s.game.play.items[s.game.play.ans][0]); await click('.mg60 .m168 button.go'); await click('.mg60 [data-mgback]'); }
    const saved = JSON.parse(JSON.stringify(th.b98)); th.b98.gameResults = saved.gameResults; dock98();
    if (document.getElementById('authored-game98')) fail('玩过的游戏读档后又出现');
    beat98 = realBeat;
    return { played: played.length, buddyText, loseCard, skipCard, soloCard };
  }, WID);
  // 最后补几张截图（失败不影响判定）
  const shot = (f) => page.screenshot({ path: path.join(out, f), timeout: 10000 }).catch(() => console.error('截图超时：' + f));
  await page.evaluate(() => { const th = S.threads[curT]; th.b98.ch = 1; th.b98.sc = 1; th.b98.gameResults = {}; th.b98.gameReady98 = {}; mgClose(); closeSheet(); renderChat(); dock98(); });
  await shot('1-场景里的小游戏入口.png');
  await page.evaluate(() => document.querySelector('#authored-game98 [data-authored-game98="play"]').click()); await shot('2-开始前说明.png');
  await page.evaluate(() => document.querySelector('.sheet [data-authored-player98]').click()); await page.waitForTimeout(800); await shot('3-游戏画面.png');
  await browser.close(); server.close();
  console.log(JSON.stringify(Object.assign(r, { pageErrors: errors.slice(0, 5) }), null, 1));
  if (errors.length) process.exitCode = 1;
})().catch(e => { console.error('FAIL', e.message || e); process.exit(1); });
