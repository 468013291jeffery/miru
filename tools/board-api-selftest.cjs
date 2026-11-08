const path = require('path'); const assert = require('assert');
const REPO = process.cwd();
(async () => {
  const { PGlite } = require(process.env.MIRU_PGLITE_MODULE || '@electric-sql/pglite');
  const pg = new PGlite();
  const sql = async (q, p) => (await pg.query(q, p || [])).rows;
  for (const q of [
    `CREATE TABLE users (id TEXT PRIMARY KEY, email TEXT, name TEXT, created_at TIMESTAMPTZ DEFAULT now())`,
    `CREATE TABLE wallet (user_id TEXT PRIMARY KEY, gems INT NOT NULL DEFAULT 0, plus_until TIMESTAMPTZ, updated_at TIMESTAMPTZ DEFAULT now())`,
    `CREATE TABLE ledger (id BIGSERIAL PRIMARY KEY, user_id TEXT, delta INT, reason TEXT, key TEXT UNIQUE, balance INT, at TIMESTAMPTZ DEFAULT now())`,
    `CREATE TABLE works (id TEXT PRIMARY KEY, author TEXT, status TEXT)`,
    `CREATE TABLE events (id BIGSERIAL PRIMARY KEY, user_id TEXT, name TEXT, props JSONB, at TIMESTAMPTZ DEFAULT now(), key TEXT)`,
    `CREATE TABLE usage (user_id TEXT, day DATE, kind TEXT, n INT DEFAULT 0, PRIMARY KEY (user_id, day, kind))`,
    `CREATE TABLE user_days (user_id TEXT, day DATE, PRIMARY KEY (user_id, day))`,
  ]) await sql(q);
  const L = require(path.join(REPO, 'api/_lib.js'));
  let CUR = null, CFG = { earn_cap: 80 };
  L.db = async () => sql; L.config = async () => CFG; L.who = () => CUR;
  L.needActive = async (req, res) => { if (!CUR) { res.status(401).json({ error: 'x' }); return null; } return CUR; };
  L.jsonBody = req => req.body || {};
  const B = require(path.join(REPO, 'api/_board.js'));
  /* the wallet's own apply(), copied verbatim from api/wallet.js */
  const wsrc = require('fs').readFileSync(path.join(REPO, 'api/wallet.js'), 'utf8');
  const apply = eval('(' + wsrc.slice(wsrc.indexOf('async function apply'), wsrc.indexOf('module.exports')).trim() + ')');
  const call = async (method, query, body, uid) => { CUR = uid ? { uid } : null; let out = null;
    const res = { setHeader() {}, status(c) { return { json: j => { out = { code: c, j }; } , end() { out = { code: c }; } }; } };
    await B.handle({ method, query, body, headers: { host: 'localhost' } }, res, { apply }); return out; };

  const leads = JSON.parse(require('fs').readFileSync(path.join(REPO, 'art/official/leads.json'), 'utf8'));
  const W = leads.works.map(w => w.wid);
  for (const w of W.slice(0, 3)) await sql(`INSERT INTO works VALUES ($1,'x','live')`, [w]);   // Unread (4th) offline
  await sql(`INSERT INTO users (id, name) VALUES ('u1','Ann'),('u2','bob@x.com'),('u3','')`);
  await sql(`INSERT INTO wallet VALUES ('u1', 10), ('u2', 0)`);

  // 1. board, anonymous
  let r = await call('GET', { r: 'rank', orient: 'bg' });
  assert.equal(r.code, 200); assert.ok(r.j.rows.length >= 12, 'bg rows');
  assert.ok(!r.j.rows.some(x => x.wid === W[3]), 'offline work excluded'); assert.ok(!r.j.me);
  const dante = r.j.rows.find(x => x.cid.endsWith('_dante')).cid, cass = r.j.rows.find(x => x.cid.endsWith('_cassian')).cid;
  // 2. free votes: 3 per day
  r = await call('POST', { r: 'rank' }, { op: 'vote', cid: dante, n: 2, key: 'a' }, 'u1'); assert.equal(r.code, 200); assert.equal(r.j.me.left, 1);
  r = await call('POST', { r: 'rank' }, { op: 'vote', cid: dante, n: 2, key: 'a' }, 'u1'); assert.equal(r.j.row.votes, 2, 'idempotent key');
  r = await call('POST', { r: 'rank' }, { op: 'vote', cid: dante, n: 2, key: 'b' }, 'u1'); assert.equal(r.code, 402); assert.equal(r.j.need, 'buy');
  r = await call('POST', { r: 'rank' }, { op: 'share' }, 'u1'); assert.equal(r.j.me.left, 2);
  r = await call('POST', { r: 'rank' }, { op: 'share' }, 'u1'); assert.equal(r.j.me.left, 2, 'share once a day');
  r = await call('POST', { r: 'rank' }, { op: 'vote', cid: 'ld_nope_x', n: 1, key: 'c' }, 'u1'); assert.equal(r.code, 400);
  // 3. buy: spends diamonds, adds votes
  r = await call('POST', { r: 'rank' }, { op: 'buy', cid: cass, pack: 'm', key: 'k1' }, 'u1'); assert.equal(r.code, 200); assert.equal(r.j.gems, 5); assert.equal(r.j.row.votes, 30);
  r = await call('POST', { r: 'rank' }, { op: 'buy', cid: cass, pack: 'm', key: 'k1' }, 'u1'); assert.equal(r.j.row.votes, 30, 'buy idempotent'); assert.equal(r.j.gems, 5);
  r = await call('POST', { r: 'rank' }, { op: 'buy', cid: cass, pack: 'm', key: 'k2' }, 'u2'); assert.equal(r.code, 402, 'no diamonds');
  // 4. organic heat: talk (capped 50/user) + chapters (distinct)
  for (let i = 0; i < 60; i++) await sql(`INSERT INTO events (user_id, name, props) VALUES ('u2','talk',$1)`, [JSON.stringify({ cid: dante })]);
  for (let i = 0; i < 3; i++) await sql(`INSERT INTO events (user_id, name, props) VALUES ('u2','chapter_done',$1)`, [JSON.stringify({ wid: 'bw_' + W[2].replace(/[^a-z0-9]/gi, '').slice(-12), ch: 1, sess: 's' })]);
  await sql(`INSERT INTO events (user_id, name, props) VALUES ('u2','chapter_done',$1)`, [JSON.stringify({ wid: 'x', cw: W[2], ch: 2, sess: 's' })]);
  r = await call('POST', { r: 'rank' }, { op: 'vote', cid: dante, n: 1, key: 'd' }, 'u2');   // also busts the cache
  const d = r.j.rows.find(x => x.cid === dante);
  assert.equal(d.talk, 50); assert.equal(d.chapters, 2); assert.equal(d.votes, 3); assert.equal(d.heat, 3 * 520 + 50 * 20 + 2 * 10);
  assert.equal(r.j.rows[0].cid, cass, 'paid 30 votes top');
  // 5. fans + me
  r = await call('GET', { r: 'rank', fans: dante }); assert.deepEqual(r.j.fans.map(f => f.name), ['Ann', 'MIRU-u2']);
  r = await call('GET', { r: 'rank', orient: 'all' }, null, 'u1'); assert.equal(r.j.me.votes[cass], 30); assert.equal(r.j.me.left, 2);
  r = await call('GET', { r: 'rank', orient: 'bl' }); assert.equal(r.j.rows.length, 0, 'unread offline → no BL');

  // 6. tasks
  r = await call('GET', { r: 'tasks' }, null, 'u2'); assert.equal(r.code, 200);
  const T = id => r.j.tasks.find(t => t.id === id);
  assert.equal(T('talk10').progress, 10); assert.equal(T('talk10').claimable, true); assert.equal(T('read1').progress, 1); assert.equal(T('vote1').progress, 1);
  assert.ok(T('first_ch'), 'new user sees first_ch'); assert.equal(T('ending1').claimable, false);
  r = await call('POST', { r: 'tasks' }, { op: 'claim', id: 'ending1' }, 'u2'); assert.equal(r.code, 409);
  r = await call('POST', { r: 'tasks' }, { op: 'claim', id: 'talk10' }, 'u2'); assert.equal(r.code, 200); assert.equal(r.j.gems, 1);
  r = await call('POST', { r: 'tasks' }, { op: 'claim', id: 'talk10' }, 'u2'); assert.equal(r.code, 409); assert.equal(T('talk10').claimed, undefined === 1 ? 0 : T('talk10').claimed);
  await sql(`INSERT INTO events (user_id, name, props) VALUES ('u2','story_end','{"ending":null}'),('u2','story_end','{"ending":"A"}')`);
  r = await call('POST', { r: 'tasks' }, { op: 'claim', id: 'ending1' }, 'u2'); assert.equal(r.code, 200); assert.equal(r.j.gems, 4);
  // earn cap
  CFG = { earn_cap: 4 }; await sql(`UPDATE usage SET n = 4 WHERE user_id='u2'`);
  r = await call('POST', { r: 'tasks' }, { op: 'claim', id: 'read1' }, 'u2'); assert.equal(r.code, 429);
  assert.equal(r.j.tasks.find(t => t.id === 'read1').claimable, true, 'claim rolled back');
  CFG = { earn_cap: 80 };
  // old user: no first_ch
  await sql(`UPDATE users SET created_at = now() - interval '30 days' WHERE id='u3'`);
  r = await call('GET', { r: 'tasks' }, null, 'u3'); assert.ok(!r.j.tasks.find(t => t.id === 'first_ch'));
  r = await call('GET', { r: 'tasks' }); assert.equal(r.code, 401);
  // config override
  CFG = { tasks: [{ id: 'talk10', period: 'day', goal: 5, reward: 2, t: { zh: 'x', en: 'x' } }] };
  r = await call('GET', { r: 'tasks' }, null, 'u1'); assert.equal(r.j.tasks.length, 1);
  // week math
  const wk = B._test.weekOf(new Date('2026-11-08T23:00:00Z')); assert.equal(wk, '2026-11-02');
  assert.equal(B._test.weekOf(new Date('2026-11-09T00:00:01Z')), '2026-11-09');
  console.log('ALL BOARD TESTS PASSED');
})().catch(e => { console.error(e); process.exit(1); });
