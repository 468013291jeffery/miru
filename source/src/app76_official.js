/* ---- v2.9 · 后台「剧本生产」上线的 MIRU 官方剧：作品包里是 MIRU 标准剧本（pack.script），在 App 里用导入器转成可玩的剧 ----
   同一版本只转换一次（按 pack.ver 缓存）；第一次开始时 app74 会补齐故事页、人物画像、关系，并自动配音乐/特效/小游戏。 */
const _installWork76 = installWork;
installWork = async function (id) {
  const zh = CL() === "zh";
  const r = await capi("/works?id=" + encodeURIComponent(id) + "&play=1");
  if (r.status === 451) { const why = (r.j && r.j.why) || ""; toast(zh ? ({ verify: "这部是成人作品，需要先完成年龄验证", login: "这部是成人作品，请先登录并完成年龄验证", region: "这部成人作品在你所在的地区不开放" }[why] || "这部成人作品暂不开放") : ({ verify: "This is an adult story — age verification is required", login: "This is an adult story — sign in and verify your age first", region: "This adult story isn't available in your region" }[why] || "This adult story isn't available")); return null; }
  if (!r.ok || !r.j.pack) { toast(zh ? "打不开这部作品" : "Couldn't open this story"); return null; }
  const P = r.j.pack;
  if (!P.script) {
    if (!P.world) { toast(zh ? "打不开这部作品" : "Couldn't open this story"); return null; }
    Object.entries(P.chars || {}).forEach(([cid, c]) => { S.mine.chars[cid] = c; }); const w = P.world; w.community = id; w.mine = 0; S.mine.worlds[w.id] = w; save(); track("community_open", { id }); return w.id;
  }
  S.off76 = S.off76 || {};
  const have = S.off76[id];
  if (have && have.ver === P.ver && have.imv === 2 && wd(have.wid)) { track("community_open", { id }); return have.wid; }
  if (have && wd(have.wid)) { try { delete S.mine.worlds[have.wid]; } catch (_) {} }
  /* 成人露骨作品（服务器已按地区 + 年龄验证放行）：解析时不省略露骨句子 */
  const doc = (() => { window.IM_ADULT = !!(P.meta && P.meta.adult === true); try { return imParse(P.script); } finally { window.IM_ADULT = false; } })(); if (!doc.chapters.length) { toast(zh ? "这部剧暂时打不开" : "This story can't be opened right now"); return null; }
  const m = P.meta || {};
  const b = imBuild(doc, m.as || doc.pov);
  const wid = b && (b.wid || b), w = wd(wid); if (!w) return null;
  S.works = (S.works || []).filter(x => x.id !== wid);
  try { const ps = packSt(wid); ps.own = 0; } catch (_) {}
  const x0 = s => ({ en: s, zh: s });
  w.mine = 0; w.official76 = 1; w.community = id; w.author = zh ? "MIRU 官方" : "MIRU Originals";
  w.or = r.j.orient || w.or; if (r.j.cover) w.cover = r.j.cover;
  if (m.title || r.j.title) w.title = x0(m.title || r.j.title);
  if (m.hook || r.j.hook) w.hook = x0(m.hook || r.j.hook);
  if (m.premise) w.premise = x0(m.premise);
  if (m.you) w.you = x0(m.you);
  if ((m.tags || []).length) w.tags = m.tags.slice(0, 16); if (m.heat) w.heat = m.heat; w.or = r.j.orient || w.or;
  S.off76[id] = { wid, ver: P.ver, imv: 2 }; /* imv: importer version — bump to rebuild already-installed official stories */ save(); track("community_open", { id, official: 1 });
  return wid;
};
/* official scripts get the same full packaging as creator stories the first time they're played */
const _packStart76 = packStart;
packStart = function (wid, as, fromCh, picks) {
  const w = wd(wid);
  if (w && w.official76 && w.pack && !w.pack.exp74 && !fromCh && typeof exp74Build === "function") { exp74Build(wid).then(() => _packStart76(wid, as, fromCh, picks), () => _packStart76(wid, as, fromCh, picks)); return; }
  return _packStart76.apply(this, arguments);
};
