// POST /api/gcb —— 谷歌登录「整页跳转」的回调（2026-11-06）
//
// 为什么有它：手机上（尤其 iPhone）谷歌的弹窗登录不可靠——按钮要点好几次，选完账号凭证常常传不回原页面。
// 整页跳转时，谷歌把 id_token 以表单 POST 到这里；这里不验签、不建账号，只把它原样交回同源页面的
// 网址 # 后面（不会发给任何服务器、不进日志），页面核对 state / nonce 后再走原来的 POST /api/auth {op:'google'}。
// 验签、建账号、合并游客进度全部还在 auth.js，逻辑只有一份。
//
// 谷歌后台要把 https://<域名>/api/gcb 登记为「已获授权的重定向 URI」；没登记前前端开关（GOOGLE_REDIRECT）别开。
const TOKEN = /^[\w-]+\.[\w-]+\.[\w-]+$/, STATE = /^[\w-]{8,64}$/;

function fields(req) {
  const b = req.body;
  if (b && typeof b === 'object' && !Buffer.isBuffer(b)) return b;            // Vercel 已把表单解析成对象
  const raw = Buffer.isBuffer(b) ? b.toString('utf8') : typeof b === 'string' ? b : '';
  return Object.assign({}, req.query || {}, Object.fromEntries(new URLSearchParams(raw)));
}

module.exports = async (req, res) => {
  const f = fields(req), token = String(f.id_token || ''), state = String(f.state || '');
  const hash = TOKEN.test(token) && STATE.test(state)
    ? 'gcred=' + token + '&gst=' + state
    : 'gerr=' + encodeURIComponent(String(f.error || 'no_token').slice(0, 60));
  res.statusCode = 303;
  res.setHeader('Location', '/#' + hash);
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.end();
};
