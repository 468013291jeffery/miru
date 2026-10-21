/* MIRU · Doubao realtime voice relay (Cloudflare Worker)
   Browsers cannot put auth headers on a WebSocket, and the Volcengine keys must never reach the page.
   The app gets a short-lived signed ticket from Vercel (/api/tts?doubao=1, signed-in users only),
   opens  wss://<this-worker>/?t=<ticket>,  and this worker dials Doubao with the keys and pipes frames both ways.

   Worker secrets / variables (Settings → Variables and Secrets):
     DOUBAO_APP_ID        火山引擎 豆包语音 应用 APP ID                       (required)
     DOUBAO_ACCESS_KEY    that app's Access Token                             (old console)   — or —
     DOUBAO_API_KEY       the new console's API Key                           (new console)
     DOUBAO_RELAY_SECRET  optional; without it the worker asks Vercel to check each ticket
   A key put in DOUBAO_API_KEY is also tried as an old-console Access Token if Doubao rejects it.
     DOUBAO_RESOURCE_ID   optional, default volc.speech.dialog
     DOUBAO_APP_KEY       optional, default PlgvMymc7f3tQnJ6 (fixed value from the docs)        */
const UP = 'https://openspeech.bytedance.com/api/v3/realtime/dialogue';
const MAX_MS = 20 * 60 * 1000;
const b64uDec = s => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), c => c.charCodeAt(0));
const b64uEnc = b => btoa(String.fromCharCode(...new Uint8Array(b))).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
async function ticketOK(t, secret) {
  if (!t || !secret || t.indexOf('.') < 0) return null;
  const [body, mac] = t.split('.');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const want = b64uEnc(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body)));
  if (want !== mac) return null;
  try { const p = JSON.parse(new TextDecoder().decode(b64uDec(body))); return p.exp > Date.now() ? p : null; } catch (_) { return null; }
}
function upHeaders(env) {
  const h = { Upgrade: 'websocket', 'X-Api-Resource-Id': env.DOUBAO_RESOURCE_ID || 'volc.speech.dialog', 'X-Api-Connect-Id': crypto.randomUUID() };
  if (env.DOUBAO_API_KEY) { h['X-Api-App-Id'] = env.DOUBAO_APP_ID || ''; h['X-Api-Key'] = env.DOUBAO_API_KEY; }
  else { h['X-Api-App-ID'] = env.DOUBAO_APP_ID || ''; h['X-Api-Access-Key'] = env.DOUBAO_ACCESS_KEY || ''; h['X-Api-App-Key'] = env.DOUBAO_APP_KEY || 'PlgvMymc7f3tQnJ6'; }
  return h;
}
async function dialUp(env) {
  let r = await fetch(UP, { headers: upHeaders(env) }); if (!r.webSocket && env.DOUBAO_API_KEY && !env.DOUBAO_ACCESS_KEY) r = await fetch(UP, { headers: upHeaders(Object.assign({}, env, { DOUBAO_API_KEY: '', DOUBAO_ACCESS_KEY: env.DOUBAO_API_KEY })) });
  if (!r.webSocket) { let t = ''; try { t = (await r.text()).slice(0, 300); } catch (_) {} throw new Error('doubao ' + r.status + ' ' + t + ' logid=' + (r.headers.get('X-Tt-Logid') || '')); }
  r.webSocket.accept(); return r.webSocket;
}
const CORS = { 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-store', 'Content-Type': 'application/json' };
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    if (req.headers.get('Upgrade') !== 'websocket') {
      /* health + credential probe (sends StartConnection, expects ConnectionStarted) — no secrets in the answer */
      const out = { ok: true, app: !!env.DOUBAO_APP_ID, key: !!(env.DOUBAO_ACCESS_KEY || env.DOUBAO_API_KEY), secret: !!env.DOUBAO_RELAY_SECRET };
      if (url.searchParams.get('probe')) {
        try { const ws = await dialUp(env);
          out.probe = await new Promise(res => { const to = setTimeout(() => res('timeout'), 6000);
            ws.addEventListener('message', e => { clearTimeout(to); const d = new Uint8Array(e.data); const ev = d.length >= 8 ? new DataView(d.buffer).getInt32(4) : -1;
              res(ev === 50 ? 'connected' : 'reply type ' + (d[1] >> 4) + ' event ' + ev + ' ' + new TextDecoder().decode(d.slice(8)).slice(0, 200)); try { ws.close(); } catch (_) {} });
            ws.addEventListener('close', () => res('closed'));
            ws.send(new Uint8Array([0x11, 0x14, 0x10, 0, 0, 0, 0, 1, 0, 0, 0, 2, 123, 125])); });
        } catch (e) { out.probe = String(e.message || e); }
      }
      return new Response(JSON.stringify(out), { headers: CORS });
    }
    if (!(await ticketOK(url.searchParams.get('t'), env.DOUBAO_RELAY_SECRET)) && !(await fetch('https://miru-wheat-pi.vercel.app/api/tts?doubao_check=' + encodeURIComponent(url.searchParams.get('t') || '')).then(r => r.ok).catch(() => false))) return new Response('bad ticket', { status: 401 });
    let up; try { up = await dialUp(env); } catch (e) { return new Response(String(e.message || e), { status: 502 }); }
    const [client, server] = Object.values(new WebSocketPair()); server.accept();
    const close = (code, why) => { try { server.close(code || 1000, why || ''); } catch (_) {} try { up.close(1000, ''); } catch (_) {} };
    const cap = setTimeout(() => close(1000, 'time limit'), MAX_MS);
    server.addEventListener('message', e => { try { up.send(e.data); } catch (_) { close(1011, 'upstream'); } });
    up.addEventListener('message', e => { try { server.send(e.data); } catch (_) { close(); } });
    server.addEventListener('close', () => { clearTimeout(cap); close(); });
    up.addEventListener('close', e => { clearTimeout(cap); close(1000, String(e.reason || '').slice(0, 100)); });
    server.addEventListener('error', () => close()); up.addEventListener('error', () => close(1011, 'upstream error'));
    return new Response(null, { status: 101, webSocket: client });
  }
};
