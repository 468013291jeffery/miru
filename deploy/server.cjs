'use strict';
// VPS entry point: preserve the existing Node functions and Edge streaming handler.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const root = path.resolve(__dirname, '..');
const routes = new Map();
for (const name of fs.readdirSync(path.join(root, 'api'))) {
  if (/^[a-z][a-z0-9_-]*\.js$/.test(name) && name !== 'longcat.js') {
    routes.set(name.slice(0, -3), require(path.join(root, 'api', name)));
  }
}
const edge = import('data:text/javascript;base64,' + fs.readFileSync(path.join(root, 'api/longcat.js')).toString('base64'));
async function bodyOf(req) {
  const chunks = []; let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 5 * 1024 * 1024) throw Object.assign(new Error('request too large'), { status: 413 });
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
const server = http.createServer(async (req, res) => {
  res.status = code => { res.statusCode = code; return res; };
  res.json = value => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(value)); return res; };
  res.send = value => { res.end(value); return res; };
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/healthz') return res.json({ ok: true, runtime: 'vps', version: process.env.MIRU_RELEASE || 'unknown' });
    const match = /^\/api\/([a-z][a-z0-9_-]*)(?:\.js)?$/.exec(url.pathname);
    if (!match || (match[1] !== 'longcat' && !routes.has(match[1]))) return res.status(404).json({ error: 'not found' });
    if (match[1] === 'longcat') {
      const mod = await edge;
      const init = { method: req.method, headers: req.headers };
      if (!['GET', 'HEAD'].includes(req.method)) { init.body = Readable.toWeb(req); init.duplex = 'half'; }
      const request = new Request('https://miru.plus' + req.url, init);
      const response = await mod.default(request);
      res.statusCode = response.status;
      response.headers.forEach((value, key) => res.setHeader(key, value));
      if (req.method === 'HEAD' || !response.body) return res.end();
      res.flushHeaders();
      await pipeline(Readable.fromWeb(response.body), res);
      return;
    }
    req.query = Object.fromEntries(url.searchParams);
    req.body = await bodyOf(req);
    if (req.body.length && /application\/json/i.test(req.headers['content-type'] || '')) {
      try { req.body = JSON.parse(req.body.toString('utf8')); }
      catch { return res.status(400).json({ error: 'invalid JSON' }); }
    } else if (req.method !== 'PUT') req.body = req.body.toString('utf8');
    await routes.get(match[1])(req, res);
  } catch (err) {
    console.error('Request failed:', err.name || 'Error');
    if (!res.headersSent) res.status(err.status || 500).json({ error: err.status === 413 ? 'request too large' : 'internal server error' });
    else res.destroy();
  }
});
server.requestTimeout = 180000;
server.listen(Number(process.env.PORT || 3000), '127.0.0.1', () => console.log('MIRU API ready on loopback'));
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => { server.close(() => process.exit(0)); setTimeout(() => process.exit(1), 10000).unref(); });
