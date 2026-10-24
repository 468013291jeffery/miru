// 迁移端到端：老存档（base64 在 S 里）→ 启动 → 搬到 IndexedDB → S 里只剩引用
// 由 media-e2e.ps1（或手工）通过 agent-browser eval 注入执行。必须在页面里跑。
(async () => {
  const out = {};
  const KEY = (typeof KEYNOW === 'string') ? KEYNOW : null;

  // 1) 找一个 1×1 红色 jpeg 的 dataURL 当"老照片"
  const cv = document.createElement('canvas');
  cv.width = 32; cv.height = 32;
  const g = cv.getContext('2d');
  g.fillStyle = '#c33'; g.fillRect(0, 0, 32, 32);
  const dataUrl = cv.toDataURL('image/jpeg', 0.8);
  out.sampleBytes = dataUrl.length;

  // 2) 造一份"老格式"存档：art 与 album 里都是 base64
  const key = (() => {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      const v = localStorage.getItem(k) || '';
      if (v.indexOf('"ob"') >= 0 || v.indexOf('"album"') >= 0) return k;
    }
    return null;
  })();
  out.key = key;
  if (!key) return JSON.stringify({ error: '找不到存档 key（页面还没写过 localStorage）' });

  const S0 = JSON.parse(localStorage.getItem(key) || '{}');
  S0.art = S0.art || {};
  S0.art.__test = dataUrl;
  S0.album = S0.album || [];
  S0.album.unshift({ id: 'aTEST1', cid: Object.keys(S0.art)[0] || 'x', src: dataUrl, at: Date.now() });
  localStorage.setItem(key, JSON.stringify(S0));
  out.beforeBytes = localStorage.getItem(key).length;
  return JSON.stringify(out);
})()
