// Fake backend for the local end-to-end run: serves the built page AND the few API routes the
// app needs to boot into "cloud on" mode, so the real telemetry path runs end to end:
//
//   track() -> EVQ -> evFlush (every 15s or on tab hide) -> POST /api/events -> tools/_events.ndjson
//
//   node tools/fake-api.mjs            # http://127.0.0.1:8130/index.html
//   node tools/fake-api.mjs --reset    # start with an empty event log
//
// It serves a patched config.js (window.MIRU_PROXY -> this server) so nothing in the page ever
// talks to the production deployment. That is the whole point: a local run must not pollute
// real analytics, and the real /api/events would happily accept these events.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PORT = Number(process.env.PORT) || 8130;
const LOG = path.join(ROOT, 'tools', '_events.ndjson');

if (process.argv.includes('--reset')) fs.writeFileSync(LOG, '');
else fs.writeFileSync(LOG, fs.existsSync(LOG) ? fs.readFileSync(LOG) : '');

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.mp3': 'audio/mpeg', '.m4a': 'audio/mp4',
  '.mp4': 'video/mp4', '.woff2': 'font/woff2',
};
const state = { data: null, ver: 0, gems: 100, uid: 'u_local' };

const json = (res, code, obj) => {
  const s = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(s), 'Access-Control-Allow-Origin': '*' });
  res.end(s);
};
const body = req => new Promise(r => { let b = ''; req.on('data', c => b += c); req.on('end', () => { try { r(JSON.parse(b || '{}')); } catch (_) { r({}); } }); });

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  const p = url.pathname;

  // never let a local run reach the production API: hand the page a config that points here
  if (p === '/config.js') {
    const s = `/* fake-api: all cloud calls point at this server */\nwindow.MIRU_PROXY = "http://127.0.0.1:${PORT}/api/longcat";\n`;
    res.writeHead(200, { 'Content-Type': MIME['.js'], 'Content-Length': Buffer.byteLength(s) });
    return res.end(s);
  }

  if (p.startsWith('/api/')) {
    const route = p.slice(5);
    if (route === 'health' && req.method === 'GET') return json(res, 200, { db: true, ok: true });
    if (route === 'auth' && req.method === 'POST') {
      const b = await body(req);
      return json(res, 200, { token: 'local-token', user: { id: state.uid }, gems: state.gems, op: b.op || 'guest' });
    }
    if (route === 'wallet' && req.method === 'GET') return json(res, 200, { gems: state.gems });
    if (route === 'state') {
      if (url.searchParams.get('r') === 'mem') {
        if (req.method === 'GET') return json(res, 200, { rows: [] });
        return json(res, 200, { ok: true, saved: 0, deleted: 0, embedded: 0, items: [] });
      }
      if (req.method === 'GET') return json(res, 200, { data: state.data, ver: state.ver });
      if (req.method === 'PUT') { const b = await body(req); state.data = b.data || null; state.ver++; return json(res, 200, { ver: state.ver }); }
      return json(res, 405, { error: 'GET or PUT' });
    }
    if (route === 'events' && req.method === 'POST') {
      const b = await body(req);
      const lines = (b.events || []).map(e => JSON.stringify({ at: new Date().toISOString(), name: e.name, props: e.props || {} })).join('\n');
      if (lines) fs.appendFileSync(LOG, lines + '\n');
      return json(res, 200, { n: (b.events || []).length });
    }
    if (route === 'longcat' && req.method === 'POST') {
    // 把这一轮真正收到的 prompt 记下来（排查"模型到底看到了什么"时用；只在本地假接口里做）
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      fs.writeFileSync('tools/_last-longcat.json', JSON.stringify({ at: Date.now(), model: body.model, messages: body.messages }, null, 1));
    } catch (_) {}
    return json(res, 200, { choices: [{ message: { content: '（local stub reply）' } }] });
  }
    if (route === 'i18n') return json(res, 200, { dict: {} });
    return json(res, 404, { error: 'no such endpoint in the fake api: ' + route });
  }

  // static
  const rel = decodeURIComponent(p === '/' ? '/index.html' : p);
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('no'); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('not found: ' + rel); }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Content-Length': buf.length });
    res.end(buf);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('fake api + static on http://127.0.0.1:' + PORT + '/index.html');
  console.log('events -> ' + LOG);
});
