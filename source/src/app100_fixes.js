/* ================= v8.4 · 体验修复（2026-10-27 用户反馈 8 条中的 1/3/4/7/8） =================
   1 首页：官方新剧列表本地缓存，进入 App 立刻显示，不再先闪 2–3 秒旧剧单；首次没有缓存时，短暂等待官方列表（最多 1.2 秒）再显示。
   3 天气特效：每进入一个新场景，按「地点 + 时间 + 场景开头几句」重新判断天气；没有天气描写就清空，不再沿用上一场或整部剧的固定天气。
   4 单人剧：作品标签含「单人 / 单主角 / 单人恋爱」时，参与人物只保留主角和唯一男主（其他人照常出场说话，但不进顶部参与者和关系面板）。
   7 剧情页顶部：剧名最多两行完整显示，头像和右侧按钮缩小。
   8 人物关系图：有进行中的存档时，以「你」为中心，连线显示你和每个人当前的关系阶段与好感，随你的选择变化；剧本自带的人物关系仍保留。 */
(function () {
  /* ---------- 1 · 首页官方新剧不闪 ---------- */
  const OKEY = "miru_off94_v1";
  try { const c = JSON.parse(localStorage.getItem(OKEY) || "null"); if (c && Array.isArray(c.L) && c.L.length && typeof OFFF94 !== "undefined" && !OFFF94.list) { OFFF94.list = c.L; OFFF94.at = 0; } } catch (_) {}
  if (typeof off94Feed === "function") {
    const _f = off94Feed;
    off94Feed = async function () {
      const before = JSON.stringify((OFFF94.list || []).map(w => w.id));
      const L = await _f.apply(this, arguments);
      try { localStorage.setItem(OKEY, JSON.stringify({ at: Date.now(), L })); } catch (_) {}
      try { if (JSON.stringify((L || []).map(w => w.id)) !== before && S.lastTab === "home" && $("#feed")) { const f = $("#feed"); f.querySelectorAll(".off94").forEach(x => x.remove()); renderHome($("#tabv")); } } catch (_) {}
      return L;
    };
    setTimeout(() => { try { off94Feed(); } catch (_) {} }, 0);
  }
  const _rh = renderHome;
  renderHome = function (v) {
    const r = _rh.apply(this, arguments);
    try { const f = $("#feed"); if (f && typeof OFFF94 !== "undefined" && !OFFF94.list && !f.querySelector(".off94")) { f.classList.add("off94wait"); setTimeout(() => f.classList.remove("off94wait"), 1200); } } catch (_) {}
    return r;
  };
  /* ---------- 3 · 天气跟着场景走 ---------- */
  if (typeof pkDirective === "function" && typeof fxFrom === "function") {
    const _pd = pkDirective;
    pkDirective = function (th, b) {
      try {
        if (Array.isArray(b) && b[0] === "sys" && b[1] === "scene" && th && th.pk) {
          const x = b[2] || {}; let txt = (x.place || "") + " " + (x.time || "") + " " + (x.img || "");
          const q = th.pk.q || [];
          for (let i = 1, n = 0; i < q.length && n < 6; i++) { const y = q[i]; if (!Array.isArray(y)) continue; if (y[0] === "sys" && y[1] === "scene") break; if (typeof y[2] === "string") { txt += " " + y[2]; n++; } }
          const k = fxFrom(txt);
          fxSet(th, k || "none");
        }
      } catch (_) {}
      return _pd.apply(this, arguments);
    };
  }
  if (typeof chatFx === "function") {
    const _cf = chatFx;
    chatFx = function (th) {
      if (th && th.pk && th.pk.fx === "none" && !(th.fxm && th.fxm !== "auto")) { try { if (window.glFx) glFx.stop(); } catch (_) {} try { cancelAnimationFrame(fxRaf); } catch (_) {} try { fxRun("none"); } catch (_) {} return; }
      return _cf.apply(this, arguments);
    };
  }
  /* ---------- 4 · 单人剧只保留一位男主 ---------- */
  const SOLO = /^(单人|单主角|单人恋爱|单男主|solo)$/i;
  function soloTrim(wid) {
    const w = wd(wid); if (!w || !Array.isArray(w.cast) || !(w.tags || []).some(t => SOLO.test(String(t).trim()))) return;
    const cnt = {}; ((w.pack && w.pack.chapters) || []).forEach(c => ((c.beats && (c.beats.zh || c.beats.en)) || []).forEach(b => { if (Array.isArray(b) && ch(b[0])) cnt[b[0]] = (cnt[b[0]] || 0) + 1; }));
    const pov = w.pack && w.pack.pov;
    const others = w.cast.filter(c => c !== pov).sort((a, b) => (cnt[b] || 0) - (cnt[a] || 0));
    const keep = (pov && w.cast.includes(pov) ? [pov] : []).concat(others.slice(0, 1));
    if (keep.length && keep.length < w.cast.length) { w.cast = keep; if (w.pack) w.pack.love = others[0]; w.rel = (w.rel || []).filter(r => keep.includes(r[0]) && keep.includes(r[1])); save(); }
  }
  if (typeof installWork === "function") {
    const _iw = installWork;
    installWork = async function () { const wid = await _iw.apply(this, arguments); try { if (wid) soloTrim(wid); } catch (_) {} return wid; };
  }
  try { Object.keys(S.mine.worlds || {}).forEach(k => { const w = S.mine.worlds[k]; if (w && w.official76) soloTrim(k); }); } catch (_) {}
  /* ---------- 8 · 人物关系图跟着你的选择变化 ---------- */
  if (typeof relGraph === "function") {
    const _rg = relGraph;
    relGraph = function (w, asId) {
      try {
        if (!w) return _rg.apply(this, arguments);
        const th = (curT && S.threads[curT] && S.threads[curT].wid === w.id) ? S.threads[curT] : (typeof lastRun === "function" ? lastRun(w.id) : null);
        if (!th || !th.pk) return _rg.apply(this, arguments);
        const as = (asId && asId !== "watch" && asId !== "side" && ch(asId)) ? asId : (th.pk.as && ch(th.pk.as) ? th.pk.as : null);
        const ids = (th.cast || []).filter(c => ch(c) && c !== as).slice(0, 6); if (!ids.length) return _rg.apply(this, arguments);
        const W0 = 360, H0 = ids.length > 4 ? 420 : 360, cx = W0 / 2, cy = H0 / 2, rx = 130, ry = ids.length > 4 ? 160 : 130, P = {};
        ids.forEach((id, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / ids.length; P[id] = [cx + rx * Math.cos(a), cy + ry * Math.sin(a)]; });
        let e = "", labs = "", n = "";
        ids.forEach(id => { const [x, y] = P[id], v = Math.round((th.love || {})[id] || 0), st = stageOf(th, id), sw = 1.5 + Math.min(5, v / 20);
          e += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x + '" y2="' + y + '" class="rge' + (st >= 2 ? " main" : "") + '" style="stroke-width:' + sw + '"/>';
          const mx = cx + (x - cx) * 0.62, my = cy + (y - cy) * 0.62;
          labs += '<foreignObject x="' + (mx - 52) + '" y="' + (my - 17) + '" width="104" height="34"><div class="rgl' + (st >= 2 ? " main" : "") + '">' + esc(t("stage." + st)) + ' · ' + v + '</div></foreignObject>';
          n += '<foreignObject x="' + (x - 38) + '" y="' + (y - 30) + '" width="76" height="72"><div class="rgn"><img src="' + esc(artSrc(id)) + '" alt=""><b>' + esc(first(ch(id).n)) + '</b></div></foreignObject>'; });
        const meImg = as ? artSrc(as) : "";
        n += '<foreignObject x="' + (cx - 38) + '" y="' + (cy - 30) + '" width="76" height="72"><div class="rgn you">' + (meImg ? '<img src="' + esc(meImg) + '" alt="">' : '<i class="rgme">你</i>') + '<b>' + (CL() === "zh" ? "你" : "You") + '</b></div></foreignObject>';
        const picks = Object.keys(th.pk.picks || {}).length;
        const note = '<p class="xs faint" style="margin:4px 2px 0">' + (CL() === "zh" ? "按你目前的选择（已做 " + picks + " 个章节选择）实时更新；线越粗，关系越近。" : "Live from your choices so far (" + picks + " chapter picks). Thicker line = closer.") + '</p>';
        const base = _rg.apply(this, arguments) || "";
        return '<div class="rgraph live100"><div class="eyebrow">' + t("rg.h") + (CL() === "zh" ? " · 你和他们" : " · You & them") + '</div><svg viewBox="0 0 ' + W0 + ' ' + H0 + '" width="100%">' + e + n + labs + '</svg>' + note + '</div>' + base.replace('class="rgraph', 'class="rgraph rgbase');
      } catch (_) { return _rg.apply(this, arguments); }
    };
  }
  /* ---------- 7 · 顶部剧名两行 + 图标缩小（以及首页等待样式） ---------- */
  const st = document.createElement("style");
  st.textContent = `#s-chat .chead .row>.grow{min-width:0}
#s-chat .chead .row>.grow>b{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;white-space:normal;overflow:hidden;text-overflow:clip;font-size:14px;line-height:1.22;word-break:break-all}
#s-chat .chead .row>.grow .af73{font-size:10.5px;white-space:nowrap}
#s-chat .chead .ibtn{width:30px;height:30px;min-width:30px;font-size:14px;padding:0}
#s-chat .chead .ibtn svg{width:16px;height:16px}
#s-chat .chead .callbtn{padding:3px 7px;font-size:12px;min-width:0}#s-chat .chead .callbtn span{display:none}
#s-chat .chead .chavs .av{width:24px!important;height:24px!important}
#s-chat .chead .chavs>div:nth-child(n+3){display:none}
#s-chat .chead .row{gap:6px!important}
#feed.off94wait>.fcard:not(.off94){visibility:hidden}
.rgraph.live100 .rgn.you img,.rgraph.live100 .rgn.you .rgme{box-shadow:0 0 0 3px var(--gold,#F0B77E)}
.rgraph .rgme{display:grid;place-items:center;width:44px;height:44px;border-radius:50%;margin:0 auto;background:linear-gradient(135deg,#F0B77E,#E07A9A);color:#241a10;font-style:normal;font-weight:700}
.rgraph.rgbase{margin-top:10px;opacity:.9}`;
  document.head.appendChild(st);
})();
