// 自适应预算：同一档位解析不出来时，用更大档位重试一次（且只一次）
//
//   node tools/ask-retry-selftest.mjs
//
// 判据（每条都必须能红）：
//   ① 第一次就成功 ⇒ 只调一次，没有 llm_escalate
//   ② 同档位两次都解析不出来 ⇒ 升到 complex 再试一次，成功则返回结果，并记一条 llm_escalate
//   ③ 已经是 complex ⇒ 不再升级（不许循环）
//   ④ 升到 complex 仍解析不出来 ⇒ 抛出原来的 invalid_json（行为与升级前一致）
//   ⑤ 非 invalid_json 的错误（例如 401）⇒ 不升级、直接抛
import fs from 'node:fs';

// 从构建产物里切出真正的 ask()（花括号配平），保证测的是线上那一份
const html = fs.readFileSync('index.html', 'utf8');
function cutFunction(name) {
  const at = html.indexOf('async function ' + name + '(');
  if (at < 0) throw new Error('找不到 ' + name);
  const open = html.indexOf('{', at);
  let depth = 0, end = -1;
  for (let i = open; i < html.length; i++) {
    const ch = html[i];
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) { end = i; break } }
  }
  if (end < 0) throw new Error('配平失败 ' + name);
  return html.slice(at, end + 1);
}
const ASK_SRC = cutFunction('ask');

let pass = 0; const fails = [];
const ok = (n, c, d) => { if (c) { pass++; console.log('  ✓ ' + n); } else { fails.push(n); console.log('  ✗ ' + n, d === undefined ? '' : '→ ' + JSON.stringify(d).slice(0, 160)); } };

/** 造一个可注入的 SAMPLE + 记录调用 */
function mkEnv(plan) {
  const calls = [];
  const events = [];
  const SAMPLE = async (input, opts) => {
    calls.push({ kind: 'text', opts, input });
    return { text: plan.text(input, opts, calls.length) };   // SAMPLE() 的返回形状是 {text}，不是裸字符串
  };
  SAMPLE.json = async (input, opts) => {
    calls.push({ kind: 'json', opts, input });
    return plan.json(input, opts, calls.length);
  };
  const sandbox = {
    SAMPLE, calls, events,
    liveOn: () => true,
    jsonLoose: (txt) => { try { return JSON.parse(txt) } catch (_) { return null } },
    LIVE_ERR: null,
    refreshLive: () => {},
    toast: () => {},
    t: (k) => k,
    track: (name, props) => events.push({ name, props }),
  };
  const fn = new Function(...Object.keys(sandbox), ASK_SRC + '\nreturn ask;');
  return { ask: fn(...Object.values(sandbox)), calls, events };
}

const GOOD = '{"beats":[{"who":"mason","text":"hi"}]}';
const BAD = 'not json at all';

console.log('① 第一次就成功');
{
  const env = mkEnv({ json: () => ({ ok: 1 }), text: () => GOOD });
  const r = await env.ask('p', { modelTier: 'default' });
  ok('返回解析结果', r && r.ok === 1, r);
  ok('只调一次', env.calls.length === 1, env.calls.length);
  ok('没有 llm_escalate', env.events.filter(e => e.name === 'llm_escalate').length === 0);
}

console.log('② 同档位失败 → 升 complex 一次');
{
  const env = mkEnv({
    json: (i, o, n) => { throw Object.assign(new Error('bad'), { code: 'invalid_json', text: BAD }) },
    text: (i, o, n) => (o && o.modelTier === 'complex') ? GOOD : BAD,
  });
  let r = null, err = null;
  try { r = await env.ask('p', { modelTier: 'default' }) } catch (e) { err = e }
  ok('最终拿到结果', !err && r && Array.isArray(r.beats), err ? ('threw ' + err.code) : r);
  const esc = env.events.filter(e => e.name === 'llm_escalate');
  ok('记了一条 llm_escalate', esc.length === 1, env.events);
  ok('记录里 from=default', esc[0] && esc[0].props && esc[0].props.from === 'default', esc[0]);
  const complexCalls = env.calls.filter(c => c.opts && c.opts.modelTier === 'complex');
  ok('确实有一次 complex 调用', complexCalls.length === 1, env.calls.map(c => c.opts && c.opts.modelTier));
}

console.log('③ 已经是 complex → 不升级');
{
  const env = mkEnv({
    json: () => { throw Object.assign(new Error('bad'), { code: 'invalid_json', text: BAD }) },
    text: () => BAD,
  });
  let threw = null;
  try { await env.ask('p', { modelTier: 'complex' }) } catch (e) { threw = e }
  ok('抛错', !!threw, threw && threw.code);
  ok('没有 llm_escalate', env.events.filter(e => e.name === 'llm_escalate').length === 0);
  ok('没有第三次调用（原行为是 json + 严格重试 共 2 次）', env.calls.length === 2, env.calls.length);
}

console.log('④ 升级后仍失败 → 抛原来的 invalid_json');
{
  const env = mkEnv({
    json: () => { throw Object.assign(new Error('bad'), { code: 'invalid_json', text: BAD }) },
    text: () => BAD,
  });
  let threw = null;
  try { await env.ask('p', { modelTier: 'default' }) } catch (e) { threw = e }
  ok('抛 invalid_json', threw && threw.code === 'invalid_json', threw && threw.code);
  ok('升级只发生一次', env.events.filter(e => e.name === 'llm_escalate').length === 1, env.events.length);
}

console.log('⑤ 非 invalid_json 错误 → 不升级');
{
  const env = mkEnv({
    json: () => { throw Object.assign(new Error('nope'), { code: 'not_granted' }) },
    text: () => GOOD,
  });
  let threw = null;
  try { await env.ask('p', { modelTier: 'default' }) } catch (e) { threw = e }
  ok('抛出 not_granted', threw && threw.code === 'not_granted', threw && threw.code);
  ok('没有升级', env.events.filter(e => e.name === 'llm_escalate').length === 0);
  ok('没有额外调用', env.calls.length === 1, env.calls.length);
}

console.log(`\n${pass} passed, ${fails.length} failed`);
if (fails.length) { console.log('FAILED: ' + fails.join(' | ')); process.exit(1); }
console.log('ask retry OK');
