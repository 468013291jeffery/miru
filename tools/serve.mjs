// 极简静态服务器（本地测 index.html 用）：node tools/serve.mjs 8131
import http from 'node:http';
import fs from 'node:fs';
import https from 'node:https';
import os from 'node:os';

/* ---- 本地真 AI 转发（只在开发服里，线上没有这一层）---- */
function dsKey() {
  try {
    const f = os.homedir() + '/.dsh/.credentials.yaml';
    for (const line of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
      const m = /^\s*DEEPSEEK_API_KEY:\s*(.+)$/.exec(line);
      if (m) return m[1].trim().replace(/^['"]|['"]$/g, '');
    }
  } catch (_) {}
  return '';
}
const DS_KEY = dsKey();

function proxyDeepSeek(req, res, bodyText) {
  let body = {};
  try { body = JSON.parse(bodyText || '{}') } catch (_) {}
  /* 2026-10-27：原来**无条件** stream:true —— 于是所有「要 JSON」的调用（心声 / 建议 / 结构化回复）
     都收到一条 SSE 流，r.json() 失败 ⇒ 客户端报 bad_response ⇒ 界面显示「AI 没有反应」。
     现在尊重调用方的 stream 意图：不要求流式就走上游非流式，并把整段 JSON 原样转回。 */
  const wantStream = body.stream === true;
  const payload = JSON.stringify({
    model: 'deepseek-chat',
    messages: body.messages || [],
    max_tokens: Math.min(Number(body.max_tokens) || 4000, 8000),
    temperature: typeof body.temperature === 'number' ? body.temperature : 0.85,
    stream: wantStream,
  });
  const up = https.request({
    hostname: 'api.deepseek.com', path: '/v1/chat/completions', method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: 'Bearer ' + DS_KEY,
      'content-length': Buffer.byteLength(payload),
      accept: wantStream ? 'text/event-stream' : 'application/json',
    },
  }, r2 => {
    if (wantStream) {
      res.writeHead(r2.statusCode || 502, {
        'content-type': r2.headers['content-type'] || 'text/event-stream',
        'cache-control': 'no-store',
      });
      r2.pipe(res);
      return;
    }
    const chunks = [];
    r2.on('data', c => chunks.push(c));
    r2.on('end', () => {
      try {
        res.writeHead(r2.statusCode || 502, {
          'content-type': 'application/json; charset=utf-8',
          'cache-control': 'no-store',
        }).end(Buffer.concat(chunks));
      } catch (_) {}
    });
  });

  up.on('error', e => {
    try { res.writeHead(502, { 'content-type': 'application/json' }).end(JSON.stringify({ error: { code: 'upstream', message: String(e.message || e) } })) } catch (_) {}
  });
  up.end(payload);
}

// 1×1 透明 PNG
const PLACEHOLDER_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
import path from 'node:path';

const port = Number(process.argv[2] || 8131);
const root = process.cwd();
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp3': 'audio/mpeg' };

http.createServer((req, res) => {
  const u = decodeURIComponent((req.url || '/').split('?')[0]);
  // POST /__errlog —— 错误日志落盘（来自 app108_errlog.js）。保留 2 分钟窗口，文件本身只保留窗口内的条目。
  if (u === '/__errlog' && req.method === 'POST') {
    let b = '';
    req.setEncoding('utf8');
    req.on('data', c => { b += c });
    req.on('end', () => {
      try {
        fs.writeFileSync(path.join(root, '.browser-errlog.json'), b, 'utf8');
        res.writeHead(200, { 'content-type': 'application/json' }); res.end('{"ok":true}');
      } catch (e) {
        res.writeHead(500, { 'content-type': 'application/json' }); res.end(JSON.stringify({ ok: false, error: String(e && e.message || e) }));
      }
    });
    return;
  }  // POST /__health —— 运行时健康汇报落盘（来自 app107_health.js）。
  // 为什么要它：所有计数器原来只活在内存/控制台里，她玩的时候没人看；落盘之后 grep 就能发现异常。
  if (u === '/__health' && req.method === 'POST') {
    let b = '';
    req.setEncoding('utf8');
    req.on('data', c => { b += c });
    req.on('end', () => {
      try {
        fs.writeFileSync(path.join(root, '.browser-health.json'), b, 'utf8');
        res.writeHead(200, { 'content-type': 'application/json' }); res.end('{"ok":true}');
      } catch (e) {
        res.writeHead(500, { 'content-type': 'application/json' }); res.end(JSON.stringify({ ok: false, error: String(e && e.message || e) }));
      }
    });
    return;
  }  // POST /__save —— 接收浏览器导出的存档，落盘到 .browser-save.json
  // 为什么需要它：存档存在浏览器 localStorage 里（key=miru_v2），浏览器压缩存盘，
  // 从磁盘直接读 leveldb 拿不到明文；而 DevTools 默认禁止粘贴代码。
  // 所以由同源的 export.html 读出来 POST 给我 —— 她只要打开一个网址，不用输入任何东西。
  // POST /api/longcat —— 本地真 AI（转发到 DeepSeek）。线上走 Vercel 的 /api/longcat，不经过这里。
  if (u === '/api/longcat' && req.method === 'POST') {
    let b = '';
    req.setEncoding('utf8');
    req.on('data', c => { b += c });
    req.on('end', () => {
      if (!DS_KEY) {
        res.writeHead(503, { 'content-type': 'application/json' })
           .end(JSON.stringify({ error: { code: 'no_key', message: '本机没有 DEEPSEEK_API_KEY' } }));
        return;
      }
      proxyDeepSeek(req, res, b);
    });
    return;
  }
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
