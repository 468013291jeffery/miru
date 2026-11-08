// Isolated Chrome + actual board API on an in-memory Postgres. No production account/data.
const fs = require('node:fs'), path = require('node:path'), http = require('node:http'), assert = require('node:assert/strict');
const { PGlite } = require(process.env.MIRU_PGLITE_MODULE || '@electric-sql/pglite');
const { chromium } = require(process.env.MIRU_PLAYWRIGHT_MODULE || 'playwright');
const repo = process.cwd();
(async () => {
  const pg = new PGlite(), sql = async (q, p = []) => (await pg.query(q, p)).rows;
  for (const q of [
    'CREATE TABLE users (id text primary key,name text,created_at timestamptz default now())',
    'CREATE TABLE wallet (user_id text primary key,gems int,updated_at timestamptz default now())',
    'CREATE TABLE ledger (id bigserial primary key,user_id text,delta int,reason text,key text unique,balance int,at timestamptz default now())',
    'CREATE TABLE works (id text primary key,author text,status text)',
    'CREATE TABLE events (user_id text,name text,props jsonb,at timestamptz default now())',
    'CREATE TABLE usage (user_id text,day date,kind text,n int,primary key(user_id,day,kind))',
    'CREATE TABLE user_days (user_id text,day date,primary key(user_id,day))',
  ]) await sql(q);
  const leads = JSON.parse(fs.readFileSync('art/official/leads.json'));
  for (const w of leads.works) await sql("INSERT INTO works VALUES ($1,'test','live')", [w.wid]);
  await sql("INSERT INTO users VALUES ('test','Test adult reader',now())");
  await sql("INSERT INTO wallet (user_id,gems) VALUES ('test',12)");
  await sql("INSERT INTO events VALUES ('test','chapter_done','{\"wid\":\"fixture\",\"ch\":1}',now())");
  const L = require('../api/_lib'); L.db = async () => sql; L.config = async () => ({ earn_cap: 80 });
  L.who = () => ({ uid: 'test' }); L.needActive = async () => ({ uid: 'test' }); L.jsonBody = r => r.body;
  const board = require('../api/_board');
  const server = http.createServer(async (req, res) => {
    const u = new URL(req.url, 'http://local');
    const json = (status, value) => { res.writeHead(status, { 'content-type': 'application/json' }); res.end(JSON.stringify(value)); };
    try {
      if (u.pathname === '/api/wallet' && u.searchParams.has('r')) {
        if (u.searchParams.get('r') === 'tasks') console.log('API: task request', req.method);
        let body = ''; for await (const b of req) body += b;
        await board.handle({ method: req.method, query: Object.fromEntries(u.searchParams), headers: req.headers, body: body ? JSON.parse(body) : {} },
          { setHeader() {}, status(code) { return { json: j => { if (u.searchParams.get('r') === 'tasks') console.log('API: task response', code); json(code, j); } }; } }, {}); return;
      }
      if (u.pathname.startsWith('/api/')) {
        if (u.pathname === '/api/works') return json(200, { rows: leads.works.map(w => ({ id: w.wid, title: w.title.en, status: 'live', orient: w.orient || 'bg' })) });
        return json(200, { db: false, rows: [], works: [], ok: true });
      }
      const file = path.resolve(repo, '.' + decodeURIComponent(u.pathname === '/' ? '/index.html' : u.pathname));
      if (!file.startsWith(repo + '/') || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { 'content-type': ({ '.html': 'text/html', '.json': 'application/json', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp' })[path.extname(file)] || 'application/octet-stream' }); fs.createReadStream(file).pipe(res);
    } catch (e) { console.error(e); if (!res.headersSent) json(500, { error: e.message }); else res.end(); }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r)); const origin = 'http://127.0.0.1:' + server.address().port;
  let browserServer, browser;
  try {
    browserServer = await chromium.launchServer({ headless: true, executablePath: process.env.MIRU_EDGE, args: ['--disable-background-networking', '--disable-sync', '--no-first-run', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
    browser = await chromium.connect(browserServer.wsEndpoint());
    const page = await browser.newPage({ viewport: { width: 430, height: 920 } }), errors = [];
    page.setDefaultTimeout(30000);
    const watchdog = setTimeout(() => { console.error('Product browser watchdog expired'); browserServer.kill(); }, 90000); watchdog.unref();
    page.on('pageerror', e => errors.push(e.message));
    await page.route('**/*', async route => {
      const u = new URL(route.request().url()); if (u.origin === origin) return route.continue();
      const file = path.resolve(repo, '.' + decodeURIComponent(u.pathname));
      if (u.hostname.endsWith('miru.plus') && file.startsWith(repo + '/') && fs.existsSync(file) && fs.statSync(file).isFile()) return route.fulfill({ path: file });
      return route.fulfill({ status: 200, body: '{}', contentType: 'application/json' });
    });
    await page.goto(origin, { waitUntil: 'load' }); await page.waitForFunction(() => window.__leads && __leads().loaded);
    console.log('Browser: loaded');
    await page.evaluate(origin => {
      S.ob = S.ageOk = true; S.authChoice = 'guest'; S.lang = 'zh'; S.fxOff = true; S.sfxOff = true; S.bgm = false; S.voice.auto = false;
      S.personas[0] = { id: 'p1', name: 'Test adult', pron: 'she', age: 26 }; S.pid = 'p1';
      S.ciPrompt = today(); S.cloud = { token: 'test', uid: 'test', known: 12, provider: 'email', email: 'isolated@example.test' }; S.keys = 12; CL0.on = CL0.checked = true;
      capi = async (p, opt = {}) => { const r = await fetch(origin + '/api' + p, { method: opt.json ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json' }, body: opt.json ? JSON.stringify(opt.json) : undefined }); return { ok: r.ok, status: r.status, j: await r.json() }; };
      cloudPush = async () => {}; walletDiff = () => {}; startApp(); closeSheet(); renderTab('me');
    }, origin);
    if (!(await page.locator('.me12').count())) console.log('profile diagnostics', await page.evaluate(() => ({ html: document.body.innerText.slice(-1400), errors: window.__errlog, hasMe: !!document.querySelector('#t-me'), lastTab: S.lastTab, render: String(renderMe).slice(0,300) })));
    assert.equal(await page.locator('.me12').count(), 1);
    assert.equal(await page.locator('.me12 .me-live').count(), 0);
    assert.equal(await page.locator('.me12 .me-lacct').count(), 0);
    const sample = await page.evaluate(() => { const id = __leads().chars[0]; return { id, name: ch(id).n, en: ch(id).n94.en }; });
    await page.locator('#voiceQ').fill(sample.en);
    assert((await page.locator('#voiceList').innerText()).includes(sample.name));
    console.log('Browser: profile passed');
    await page.evaluate(async () => { disc.mode = 'stories'; discChip = 'rank'; renderTab('discover'); await rankLoad(true); renderTab('discover'); closeSheet(); });
    const cid = await page.locator('[data-vote]').first().getAttribute('data-vote');
    for (let i = 0; i < 3; i++) await page.evaluate(id => castVote(id, 1), cid);
    assert.equal(await page.evaluate(() => rkMe().left), 0);
    await page.evaluate(id => castVote(id, 1), cid); assert(await page.locator('[data-vbuy]').count() > 0);
    await page.locator('[data-vbuy]').filter({ hasText: '30' }).click();
    await page.waitForFunction(() => S.keys === 7);
    assert.equal((await sql("SELECT gems FROM wallet WHERE user_id='test'"))[0].gems, 7);
    console.log('Browser: free and paid votes passed');
    await page.evaluate(() => closeSheet());
    await page.waitForTimeout(350);
    await page.evaluate(async () => { disc.mode = 'stories'; discChip = 'earn'; renderTab('discover'); });
    console.log('Browser: task tab rendered');
    await page.waitForFunction(() => TK.data && !TK.busy, null, { polling: 100, timeout: 20000 }).catch(async e => { console.log('Task state', await page.evaluate(() => ({ data: TK.data, busy: TK.busy, err: TK.err, hidden: document.hidden, homeTab }))); throw e; });
    console.log('Browser: tasks loaded');
    if (!(await page.locator('[data-tkclaim="read1"]').count())) console.log('task diagnostics', await page.evaluate(() => ({ data: TK.data, err: TK.err, on: CL0.on, html: document.querySelector('#tabv').innerText.slice(-1400) })));
    await page.locator('[data-tkclaim="read1"]').dispatchEvent('click'); await page.waitForFunction(() => S.keys === 8);
    assert.equal((await sql("SELECT gems FROM wallet WHERE user_id='test'"))[0].gems, 8);
    console.log('Browser: task reward passed');
    const deck = await page.evaluate(() => { S.or = 'bl'; S.sw96 = {}; return deck96().map(x => ({ ...x, orient: wd(ch(x.id).w).or })); });
    assert(deck.length > 0); assert(deck.every(x => x.orient === 'bl' || x.orient === 'all'));
    console.log('Browser: matching passed');
    const story = await page.evaluate(async () => {
      liveOn = () => true; aiGate = () => true; useUnits = () => {}; gen96 = async () => null;
      ask = async p => p.includes('"recap"') ? { recap: '玩家核对了线索。', chars: {} } : p.includes('"speakers"') ?
        { speakers: [{ id: here98(S.threads[curT], scene98(S.threads[curT]).s)[0] }], beat: '试探', new_info: true, summary: '核对线索', options: ['再说一点'], fx: {} } : { say: '我把线索放在这里，你想从哪一条开始？', feel: 0 };
      const wid = await install98('w_scmw4qon3h5311d852bf'), th = new98(wid, 'me'); openThread(th.id); await enter98(th); closeSheet();
      const cid = here98(th, scene98(th).s)[0];
      const f1 = arcFast98(th, 'talk', { to: cid, txt: '请再多告诉我一些线索', mode: 'say' });
      const f2 = arcFast98(th, 'talk', { to: cid, txt: '请再多告诉我一些线索', mode: 'say' });
      const f3 = arcFast98(th, 'talk', { to: cid, txt: '请再多告诉我一些线索', mode: 'say' });
      th.b98.turns = 20; await arcCompress98(th);
      const prompt = arcAsk98(th, 'talk', { txt: '继续核对' }, true);
      return { title: th.title, intros: th.msgs.filter(m => m.intro98).length, fast: [!!f1, !!f2, !!f3], recap: th.b98.recap98, route: prompt.includes('升级路线') };
    });
    assert.equal(story.intros, 2); assert.deepEqual(story.fast, [true, true, false]); assert(story.recap); assert(story.route);
    assert.deepEqual(errors, []);
    if (process.env.MIRU_REPORT_DIR) {
      await page.screenshot({ path: path.join(process.env.MIRU_REPORT_DIR, 'story-agent-check.png') });
      fs.writeFileSync(path.join(process.env.MIRU_REPORT_DIR, 'product-browser.json'), JSON.stringify({ profile: 'passed', votes: '3 free; purchase 30 for 5 diamonds', task: 'claimed once', deck: deck.length, story, errors }, null, 2));
    }
    console.log('Product browser: profile/search, chart, free/paid votes, task reward, Meet and story memory/director passed.');
  } finally { if (browser) await Promise.race([browser.close(), new Promise(r => setTimeout(r, 1500))]); if (browserServer) await browserServer.kill(); server.closeAllConnections(); await new Promise(r => server.close(r)); await pg.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
