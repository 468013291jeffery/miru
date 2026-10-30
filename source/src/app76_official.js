/* ---- v2.9 · 后台「剧本生产」上线的 MIRU 官方剧：作品包里是 MIRU 标准剧本（pack.script），在 App 里用导入器转成可玩的剧 ----
   同一版本只转换一次（按 pack.ver 缓存）；第一次开始时 app74 会补齐故事页、人物画像、关系，并自动配音乐/特效/小游戏。 */
const _installWork76 = installWork;
installWork = async function (id) {
  const zh = CL() === "zh";
  const r = await capi("/works?id=" + encodeURIComponent(id) + "&play=1");
  /* 成人作品被拦：不再只弹一句提示，而是给出能点的下一步 —— 没登录 → 去登录；已登录 → 当场确认年龄，过了直接打开。 */
  if (r.status === 451) { const why = (r.j && r.j.why) || ""; if (why === "region") { toast(zh ? "这部成人作品在你所在的地区不开放" : "This adult story isn't available in your region"); return null; } if (why === "login" || (typeof au70Loggedin === "function" && !au70Loggedin())) { adultLogin76(); return null; } const ok = await adultConfirm76(); return ok ? installWork(id) : null; }
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
  const doc = imParse(P.script); if (!doc.chapters.length) { toast(zh ? "这部剧暂时打不开" : "This story can't be opened right now"); return null; }
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
  if ((m.tags || []).length) w.tags = m.tags.slice(0, 16); if (m.heat) w.heat = m.heat; w.adult76 = m.adult === true ? 1 : 0; w.or = r.j.orient || w.or;
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

/* 成人作品：测试期由用户自己确认年满 18 岁（后台「允许用户自行确认年龄」打开时才会走到这里）。服务器按出生日期算周岁并记录。 */
function adultConfirm76() {
  const zh = CL() === "zh";
  return new Promise(done => {
    let settled = false; const fin = v => { if (settled) return; settled = true; done(v); };
    sheet('<h2>' + (zh ? "🔞 成人内容" : "🔞 Adult content") + '</h2><p class="sm dim" style="margin:8px 0 12px;line-height:1.6">' +
      (zh ? "这部作品包含露骨的成人内容，仅限年满 18 岁的用户。请填写你的出生日期。" : "This story contains explicit adult content and is for people 18 and older. Enter your date of birth.") +
      '</p><div class="field"><input type="date" id="adBirth76" max="' + new Date().toISOString().slice(0, 10) + '"></div><p class="xs faint" id="adErr76" style="min-height:16px;margin-top:6px"></p>' +
      '<div class="row" style="gap:8px;margin-top:10px"><button class="btn btn-g grow" id="adNo76">' + (zh ? "离开" : "Leave") + '</button><button class="btn btn-p grow" id="adYes76">' + (zh ? "我已年满 18 岁，继续" : "I'm 18 or older — continue") + '</button></div>');
    const no = document.getElementById("adNo76"), yes = document.getElementById("adYes76");
    if (no) no.addEventListener("click", () => { closeSheet(); fin(false); });
    if (yes) yes.addEventListener("click", async () => {
      const v = (document.getElementById("adBirth76") || {}).value || ""; const err = document.getElementById("adErr76");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) { if (err) err.textContent = zh ? "请选择出生日期" : "Pick your date of birth"; return; }
      yes.disabled = true;
      try {
        const r = await capi("/auth", { json: { op: "adult_confirm", birthDate: v } });
        if (r.ok) { try { S.ageOk = true; save(); } catch (e) { console.warn('[adult76] save', e); } closeSheet(); fin(true); return; }
        const e0 = (r.j && r.j.error) || ""; if (r.status === 401) { closeSheet(); fin(false); adultLogin76(); return; } if (err) err.textContent = /18/.test(e0) ? (zh ? "未满 18 岁，不能查看这部作品" : "You must be 18 or older to view this story") : /self confirmation/.test(e0) ? (zh ? "年龄确认暂未开放，请稍后再试" : "Age confirmation isn't open yet — try again later") : (zh ? "确认失败，请先登录后再试" : "Couldn't confirm — sign in and try again");
      } catch (e) { console.warn("[adult76]", e); if (err) err.textContent = zh ? "网络出错，再试一次" : "Network error — try again"; }
      yes.disabled = false;
    });
  });
}

/* 成人作品要求登录：给一个「去登录」按钮，登录完回来再点「开始看」就会进入年龄确认。 */
function adultLogin76() {
  const zh = CL() === "zh";
  sheet('<h2>' + (zh ? "🔞 成人内容" : "🔞 Adult content") + '</h2><p class="sm dim" style="margin:8px 0 12px;line-height:1.6">' +
    (zh ? "这部作品仅限年满 18 岁的用户。请先登录，登录后再点「开始看」，填写出生日期完成年龄确认。" : "This story is for people 18 and older. Sign in first, then tap Play again and confirm your date of birth.") +
    '</p><div class="row" style="gap:8px;margin-top:10px"><button class="btn btn-g grow" id="adLNo76">' + (zh ? "离开" : "Leave") + '</button><button class="btn btn-p grow" id="adLGo76">' + (zh ? "去登录" : "Sign in") + '</button></div>');
  const no = document.getElementById("adLNo76"), go = document.getElementById("adLGo76");
  if (no) no.addEventListener("click", () => closeSheet());
  if (go) go.addEventListener("click", () => { closeSheet(); setTimeout(() => { if (typeof authAll70 === "function") authAll70(); else if (typeof acctSheet === "function") acctSheet(); }, 120); });
}
