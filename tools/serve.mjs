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
  // POST /__save —— 接收浏览器导出的存档，落盘到 .browser-save.json
  // 为什么需要它：存档存在浏览器 localStorage 里（key=miru_v2），浏览器压缩存盘，
  // 从磁盘直接读 leveldb 拿不到明文；而 DevTools 默认禁止粘贴代码。
  // 所以由同源的 export.html 读出来 POST 给我 —— 她只要打开一个网址，不用输入任何东西。
  if (u === '/__save' && req.method === 'POST') {
    let body = '';
    req.setEncoding('utf8');
    req.on('data', c => { body += c; if (body.length > 64 * 1024 * 1024) req.destroy() });
    req.on('end', () => {
      try {
        JSON.parse(body); // 只收合法 JSON，避免把垃圾写进盘
        const out = path.join(root, '.browser-save.json');
        fs.writeFileSync(out, body, 'utf8');
        const j = JSON.stringify({ ok: true, file: out, bytes: Buffer.byteLength(body) });
        res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }).end(j);
      } catch (e) {
        res.writeHead(400, { 'content-type': 'application/json' }).end(JSON.stringify({ ok: false, error: String(e.message || e) }));
      }
    });
    return;
  }
  const f = path.join(root, u === '/' ? 'index.html' : u);
  if (!f.startsWith(root)) { res.writeHead(403).end(); return }
  fs.readFile(f, (e, b) => {
    if (e) {
      // 缺失的美术资源 → 1×1 透明 PNG（本地没有 art/，线上有）
      if (u.startsWith('/art/')) {
        res.writeHead(200, { 'content-type': 'image/png', 'cache-control': 'no-store' });
        res.end(Buffer.from(PLACEHOLDER_PNG, 'base64')); return;
      }
      // 缺失的接口 → **明确的 503**（2026-10-27 修正）
      // 原来返回 200 {}：前端拿到一个"成功但没有内容"的响应，于是**一个字都不说**——
      // Ann 试玩时正是这样丢掉了几轮回复，读成「他不理我」。失败必须带原因。
      if (u.startsWith('/api/')) {
        res.writeHead(503, { 'content-type': 'application/json', 'cache-control': 'no-store' });
        res.end(JSON.stringify({ error: { code: 'no_backend', message: '本地没有 ' + u + ' 后端' } })); return;
      }
      res.writeHead(404, { 'content-type': 'text/plain' }).end('404 ' + u); return;
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(b);
  });
}).listen(port, '127.0.0.1', () => console.log('serving ' + root + ' on http://127.0.0.1:' + port));
