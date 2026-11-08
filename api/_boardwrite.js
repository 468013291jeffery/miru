// Board writes run in one Postgres transaction. The per-user lock covers quota checks,
// retries, wallet changes and receipts; a failed statement rolls the whole call back.
const INSTALL = `CREATE OR REPLACE FUNCTION miru_board_write(p_uid text, b jsonb)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
  op text := b->>'op';
  d date := (b->>'day')::date;
  wk date := (b->>'week')::date;
  k text := b->>'key';
  amount integer := (b->>'n')::integer;
  price integer := (b->>'price')::integer;
  existing votes%ROWTYPE;
  used integer;
  allowance integer;
  balance integer;
  earned integer;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtextextended('miru-board:' || p_uid, 0));
  IF op IN ('vote', 'buy') THEN
    IF k IS NULL OR k = '' THEN RETURN jsonb_build_object('code',400,'error','key required'); END IF;
    SELECT * INTO existing FROM votes WHERE key=k;
    IF FOUND THEN
      IF existing.user_id <> p_uid OR existing.cid <> b->>'cid' OR existing.n <> amount
         OR existing.src <> (CASE WHEN op='buy' THEN 'paid' ELSE 'free' END) THEN
        RETURN jsonb_build_object('code',409,'error','key already used for another vote');
      END IF;
      SELECT gems INTO balance FROM wallet WHERE user_id=p_uid;
      RETURN jsonb_build_object('ok',true,'dup',true,'gems',balance);
    END IF;
    IF op='vote' THEN
      SELECT COALESCE(SUM(n),0) INTO used FROM votes WHERE user_id=p_uid AND day=d AND src='free';
      allowance := (b->>'cap')::integer + CASE WHEN EXISTS
        (SELECT 1 FROM task_claims WHERE user_id=p_uid AND task='vote_share' AND period='d:' || d::text) THEN 1 ELSE 0 END;
      IF used+amount > allowance THEN RETURN jsonb_build_object('code',402,'error','no free votes left','need','buy'); END IF;
    ELSE
      SELECT COALESCE(SUM(n),0) INTO used FROM votes WHERE user_id=p_uid AND day=d AND src='paid';
      IF used+amount > (b->>'cap')::integer THEN RETURN jsonb_build_object('code',429,'error','daily paid-vote limit reached'); END IF;
      INSERT INTO wallet (user_id,gems) VALUES (p_uid,0) ON CONFLICT DO NOTHING;
      UPDATE wallet SET gems=gems-price,updated_at=now() WHERE user_id=p_uid AND gems>=price RETURNING gems INTO balance;
      IF NOT FOUND THEN RETURN jsonb_build_object('code',402,'error','not enough diamonds'); END IF;
      INSERT INTO ledger (user_id,delta,reason,key,balance)
        VALUES (p_uid,-price,'vote:' || right(b->>'cid',20),'board:' || k,balance);
    END IF;
    INSERT INTO votes (week,day,cid,user_id,n,src,key)
      VALUES (wk,d,b->>'cid',p_uid,amount,CASE WHEN op='buy' THEN 'paid' ELSE 'free' END,k);
    RETURN jsonb_build_object('ok',true,'gems',balance);
  ELSIF op='claim' THEN
    IF EXISTS (SELECT 1 FROM task_claims WHERE user_id=p_uid AND task=b->>'task' AND period=b->>'period') THEN
      RETURN jsonb_build_object('code',409,'error','already claimed');
    END IF;
    IF amount <= 0 OR amount > (b->>'cap')::integer THEN
      RETURN jsonb_build_object('code',429,'error','daily free-diamond limit reached');
    END IF;
    INSERT INTO usage (user_id,day,kind,n) VALUES (p_uid,d,'earn',amount)
      ON CONFLICT (user_id,day,kind) DO UPDATE SET n=usage.n+EXCLUDED.n
      WHERE usage.n+EXCLUDED.n <= (b->>'cap')::integer RETURNING n INTO earned;
    IF NOT FOUND THEN RETURN jsonb_build_object('code',429,'error','daily free-diamond limit reached'); END IF;
    INSERT INTO task_claims (user_id,task,period,reward) VALUES (p_uid,b->>'task',b->>'period',amount);
    INSERT INTO wallet (user_id,gems) VALUES (p_uid,0) ON CONFLICT DO NOTHING;
    UPDATE wallet SET gems=gems+amount,updated_at=now() WHERE user_id=p_uid RETURNING gems INTO balance;
    INSERT INTO ledger (user_id,delta,reason,key,balance)
      VALUES (p_uid,amount,'task:' || (b->>'task'),'task:' || p_uid || ':' || (b->>'task') || ':' || (b->>'period'),balance);
    RETURN jsonb_build_object('ok',true,'gems',balance,'got',amount);
  END IF;
  RETURN jsonb_build_object('code',400,'error','bad op');
END $$`;

async function write(sql, uid, body) {
  const rows = await sql('SELECT miru_board_write($1,$2::jsonb) AS result', [uid, JSON.stringify(body)]);
  return rows[0].result;
}
module.exports = { INSTALL, write };
