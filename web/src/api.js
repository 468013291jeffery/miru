// 和主站共用登录：主站把状态存在 localStorage 的 miru_v2 里，cloud.token 就是接口用的 Bearer token。
export function session() {
  try { const s = JSON.parse(localStorage.getItem('miru_v2') || '{}'); return { token: (s.cloud && s.cloud.token) || '', lang: s.lang || 'en' }; }
  catch (_) { return { token: '', lang: 'en' }; }
}
export async function api(path) {
  const { token } = session();
  const r = await fetch('/api' + path, { headers: token ? { Authorization: 'Bearer ' + token } : {} });
  let j = {}; try { j = await r.json(); } catch (_) {}
  if (!r.ok) throw Object.assign(new Error(j.error || String(r.status)), { status: r.status });
  return j;
}
