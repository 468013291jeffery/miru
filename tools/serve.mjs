// 极简静态服务器（本地测 index.html 用）：node tools/serve.mjs 8131
import http from 'node:http';
import fs from 'node:fs';

// 1×1 透明 PNG
const PLACEHOLDER_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
import path from 'node:path';

const port = Number(process.argv[2] || 8131);
const root = process.cwd();
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp3': 'audio/mpeg' };

http.createServer((req, res) => {
  const u = decodeURIComponent((req.url || '/').split('?')[0]);
  const f = path.join(root, u === '/' ? 'index.html' : u);
  if (!f.startsWith(root)) { res.writeHead(403).end(); return }
  fs.readFile(f, (e, b) => {
    if (e) {
      // 缺失的美术资源 → 1×1 透明 PNG（本地没有 art/，线上有）
      if (u.startsWith('/art/')) {
        res.writeHead(200, { 'content-type': 'image/png', 'cache-control': 'no-store' });
        res.end(Buffer.from(PLACEHOLDER_PNG, 'base64')); return;
      }
      // 缺失的接口 → 空 JSON 200（本地没有账号/存档服务）
      if (u.startsWith('/api/')) {
        res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' });
        res.end('{}'); return;
      }
      res.writeHead(404, { 'content-type': 'text/plain' }).end('404 ' + u); return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(b);
  });
}).listen(port, '127.0.0.1', () => console.log('serving ' + root + ' on http://127.0.0.1:' + port));
