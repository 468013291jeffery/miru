// Uses an isolated, in-memory Postgres. npm install --no-save @electric-sql/pglite@0.2.17
const assert = require('node:assert/strict');
const { PGlite } = require(process.env.MIRU_PGLITE_MODULE || '@electric-sql/pglite');
const { INSTALL, write } = require('../api/_boardwrite');
(async () => {
  const pg = new PGlite();
  const sql = async (q, p = []) => (await pg.query(q, p)).rows;
  for (const q of [
    'CREATE TABLE votes (id bigserial primary key, week date, day date, cid text, user_id text, n int, src text, key text unique)',
    'CREATE TABLE task_claims (user_id text, task text, period text, reward int, primary key(user_id,task,period))',
    'CREATE TABLE wallet (user_id text primary key, gems int, updated_at timestamptz default now())',
    'CREATE TABLE ledger (user_id text, delta int, reason text, key text unique, balance int)',
    'CREATE TABLE usage (user_id text, day date, kind text, n int, primary key(user_id,day,kind))',
    INSTALL,
  ]) await sql(q);
  const base = { day: '2026-11-08', week: '2026-11-02', cid: 'test', op: 'vote', n: 3, cap: 3 };
  const count = async uid => Number((await sql('SELECT COALESCE(SUM(n),0) AS n FROM votes WHERE user_id=$1', [uid]))[0].n);
  const gems = async uid => (await sql('SELECT gems FROM wallet WHERE user_id=$1', [uid]))[0]?.gems;
  let r = await Promise.all(['a', 'b'].map(key => write(sql, 'free', { ...base, key })));
  assert.equal(r.filter(x => x.ok).length, 1); assert.equal(await count('free'), 3);
  assert.equal((await write(sql, 'free', { ...base, key: 'a' })).dup, true);
  assert.equal((await write(sql, 'free', { ...base, key: 'a', cid: 'other' })).code, 409);
  assert.equal((await write(sql, 'free', { ...base, key: null })).code, 400);
  await sql("INSERT INTO task_claims VALUES ('free','vote_share','d:2026-11-08',0)");
  assert.equal((await write(sql, 'free', { ...base, n: 1, key: 'bonus' })).ok, true);
  assert.equal(await count('free'), 4);
  await sql("INSERT INTO wallet VALUES ('paid',20),('cap',20),('rollback',20),('reward',0)");
  const buy = { ...base, op: 'buy', n: 30, price: 5, cap: 100, key: 'paid-once' };
  r = await Promise.all([write(sql, 'paid', buy), write(sql, 'paid', buy)]);
  assert(r.every(x => x.ok)); assert.equal(await count('paid'), 30); assert.equal(await gems('paid'), 15);
  r = await Promise.all(['p1','p2'].map(key => write(sql, 'cap', { ...buy, cap: 30, key })));
  assert.equal(r.filter(x => x.ok).length, 1); assert.equal(await gems('cap'), 15);
  assert.equal((await write(sql, 'poor', { ...buy, key: 'poor' })).code, 402); assert.equal(await count('poor'), 0);
  // Force an error *after* the wallet update: no debit or receipt may survive it.
  await sql("ALTER TABLE votes ADD CONSTRAINT reject_test CHECK(cid <> 'reject')");
  await assert.rejects(write(sql, 'rollback', { ...buy, cid: 'reject', key: 'rollback' }));
  assert.equal(await gems('rollback'), 20); assert.equal(await count('rollback'), 0);
  assert.equal((await sql("SELECT * FROM ledger WHERE user_id='rollback'")).length, 0);
  const claim = { ...base, op: 'claim', task: 'read1', period: 'd:2026-11-08', n: 1, cap: 1 };
  r = await Promise.all([write(sql, 'reward', claim), write(sql, 'reward', claim)]);
  assert.equal(r.filter(x => x.ok).length, 1); assert.equal(await gems('reward'), 1);
  assert.equal((await write(sql, 'reward', { ...claim, task: 'talk10' })).code, 429);
  assert.equal((await sql("SELECT * FROM task_claims WHERE user_id='reward' AND task='talk10'")).length, 0);
  // Receipt failure rolls back task reservation and quota as well as wallet balance.
  await sql("INSERT INTO ledger VALUES ('reward',0,'test','task:reward:vote1:d:2026-11-08',1)");
  await assert.rejects(write(sql, 'reward', { ...claim, task: 'vote1', cap: 80 }));
  assert.equal(await gems('reward'), 1);
  assert.equal((await sql("SELECT n FROM usage WHERE user_id='reward'"))[0].n, 1);
  assert.equal((await sql("SELECT * FROM task_claims WHERE user_id='reward' AND task='vote1'")).length, 0);
  await pg.close();
  console.log('Board writes: concurrent quotas, retries, payload conflicts, spending, claims and rollback passed.');
})().catch(e => { console.error(e); process.exitCode = 1; });
