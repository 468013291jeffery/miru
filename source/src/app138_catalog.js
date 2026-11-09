/* ================= 官方剧：分类标签 + 挑战任务（2026-11-10）=================
   数据：art/official/catalog.json → works[作品 id] = { tags:[…], quest:{ qtitle, turns, goals:[…], hidden } }
   1 · 标签：发现页的分类筛选（题材 / 背景 / 套路 / 人设 / 攻 / 受）只认 TAGS / GS_TAGS 里的标准值，
       而线上官方剧的标签大多是剧本里随手写的中文（「狼人」「奇幻」），所以一个都筛不出来。
       这里把 catalog.json 的标准标签合进去：未安装的（发现页搜索结果，app89）和已安装的（S.mine.worlds，按 w.community 对应）都补上。
       catalog 里没有的新剧，按中文标签名反查（TAG_ZH）+ 标题 / 简介关键词推断，至少不会是零标签。
   2 · 挑战：「挑战」页以前只列本机自带的短篇（w.quest），现在那些都下线了，所以是空的。
       现在列 catalog.json 里每部在线官方剧的挑战：点「挑战任务」→ 装好作品（installWork）→ 挂上 w.quest → 走原来的挑战流程（app2_pages / app3_chat）。
       不再显示编出来的排行名单，只显示你自己的最好成绩。
   以后每上线一部新剧：在 catalog.json 加一条（标签 + 挑战），男主卡加进 leads.json，排行和遇见就都有了。 */
(function () {
  "use strict";
  const CAT = { data: null, busy: null, at: 0, live: null };
  const zh = () => (typeof CL === "function" ? CL() === "zh" : S.lang === "zh");
  const known = () => new Set(Object.values(TAGS).flat().concat(GS_TAGS.gong, GS_TAGS.shou));
  function load() {
    if (CAT.data && Date.now() - CAT.at < 6e5) return Promise.resolve(CAT.data);
    if (CAT.busy) return CAT.busy;
    CAT.busy = fetch("art/official/catalog.json?v=" + Math.floor(Date.now() / 6e5)).then(r => r.ok ? r.json() : null).catch(() => null)
      .then(j => { if (j && j.works) { CAT.data = j; CAT.at = Date.now(); applyInstalled(); } return CAT.data; }).finally(() => { CAT.busy = null; });
    return CAT.busy;
  }
  /* ---------- 1 · 标签 ---------- */
  const KW = [[/狼人|狼族|狼群|werewol/i, "Werewolves"], [/吸血鬼|血族|vampir/i, "Vampires"], [/黑帮|黑手党|教父|mafia/i, "Mafia"], [/俄罗斯黑帮|bratva/i, "Bratva"],
    [/王子|王庭|王室|王冠|亲王|royal|prince|crown/i, "Royal Court"], [/冰球|hockey/i, "Hockey"], [/校园|大学|campus|college/i, "Campus"], [/医院|医生|hospital/i, "Hospital"],
    [/明星|影帝|首映|演员|celebrit/i, "Celebrity"], [/豪门|继承人|总裁|billion/i, "Billionaire"], [/龙|dragon/i, "Dragons"], [/婚礼|wedding/i, "Wedding"],
    [/室友|同居|roommate/i, "Roommates"], [/奇幻|魔法|fantasy|magic/i, "Romantasy"], [/悬疑|mystery|suspense/i, "Romantic Suspense"], [/暗黑|dark/i, "Dark Romance"],
    [/慢热|slow burn/i, "Slow Burn"], [/宿敌|enemies/i, "Enemies to Lovers"], [/契约|联姻|婚约|arranged/i, "Arranged Marriage"], [/破镜重圆|second chance/i, "Second Chance"],
    [/1v2|1vN|多男主|四男主|双男主|why choose|reverse harem/i, "Why Choose"], [/保镖|bodyguard/i, "Bodyguard"], [/隐藏身份|秘密身份|hidden identity/i, "Hidden Identity"]];
  function infer(tags, text) {
    const K = known(), out = [];
    const TZ = typeof TAG_ZH !== "undefined" ? TAG_ZH : {}, rev = {}; Object.keys(TZ).forEach(en => { rev[TZ[en]] = en; });
    (tags || []).forEach(t => { const s = String(t); if (K.has(s)) out.push(s); else if (rev[s] && K.has(rev[s])) out.push(rev[s]); });
    const hay = (tags || []).join(" ") + " " + (text || "");
    KW.forEach(([re, tag]) => { if (re.test(hay) && K.has(tag)) out.push(tag); });
    if (!out.some(t => TAGS.genre.includes(t))) out.push("Romance");
    return [...new Set(out)];
  }
  function tagsFor(wid, tags, text) {
    const c = CAT.data && CAT.data.works[wid], K = known();
    const base = c && Array.isArray(c.tags) ? c.tags.filter(t => K.has(t)) : [];
    return [...new Set(base.concat(infer(tags, text)))];
  }
  const T0 = new WeakSet();
  function fixWork(w) { if (!w || T0.has(w)) return; T0.add(w); w.tags = tagsFor(w.id, w.tags, (w.title || "") + " " + (w.hook || "")); }
  function applyInstalled() {
    try {
      Object.values((S.mine && S.mine.worlds) || {}).forEach(w => {
        if (!w || !w.community || !/^w_sc/.test(w.community)) return;
        w.tags = tagsFor(w.community, w.tags, Lz(w.title) + " " + Lz(w.hook));
        const q = CAT.data && CAT.data.works[w.community] && CAT.data.works[w.community].quest; if (q && !w.quest) w.quest = q;
      });
    } catch (e) { console.warn("[cat138] installed", e); }
  }
  if (typeof off89Load === "function") { const L0 = off89Load; off89Load = function () { return Promise.all([L0.apply(this, arguments), load()]).then(([L]) => { (L || []).forEach(fixWork); return L; }); }; }
  if (typeof installWork === "function") { const I0 = installWork; installWork = async function (id) { await load(); const wid = await I0.apply(this, arguments); applyInstalled(); return wid; }; }
  /* 本机已装的作品：discMatch 直接读 w.tags，所以打开发现页之前补好 */
  if (typeof discMatch === "function") { const M0 = discMatch; discMatch = function () { if (!CAT.data) load(); return M0.apply(this, arguments); }; }

  /* ---------- 2 · 挑战 ---------- */
  async function liveList() {
    if (CAT.live && Date.now() - CAT.live.at < 12e4) return CAT.live.L;
    let L = [];
    try { const r = await fetch("/api/works?feed=new&limit=200"); if (r.ok) { const j = await r.json(); L = (j.works || j.rows || []).filter(w => w.status === "live" || !w.status); } } catch (_) {}
    CAT.live = { L, at: Date.now() }; return L;
  }
  const local = wid => Object.values((S.mine && S.mine.worlds) || {}).find(w => w && w.community === wid && wd(w.id));
  function best(wid) {
    const w = local(wid); if (!w) return null;
    const runs = Object.values(S.threads || {}).filter(th => th.wid === w.id && th.kind === "quest" && th.quest);
    if (!runs.length) return null;
    return runs.map(th => th.quest.goals.filter(g => g.done).length + (th.quest.hidden && th.quest.hidden.done ? 1 : 0)).sort((a, b) => b - a)[0];
  }
  let QH = null, QALL = false;
  function questHTML() {
    if (!QH) { Promise.all([load(), liveList()]).then(([d, L]) => {
      const A = (d && d.works) || {}, all = L.filter(w => A[w.id] && A[w.id].quest), fit = all.filter(w => typeof orOK !== "function" || orOK({ or: w.orient || "all" }));
      /* 选了某个取向（比如「女女」）但这个取向下还没有剧：不给空页，先列全部，并说明一句 */
      const rows = fit.length ? fit : all; QALL = !fit.length && all.length > 0;
      Promise.all(rows.map(w => (typeof off94Assets === "function" ? off94Assets(w.id) : Promise.resolve({})).then(a => Object.assign({}, w, { A: a || {} })))).then(R => {
        QH = R; if (homeTab === "quest") { const b = $("#htabBody"); if (b) b.innerHTML = questHTML(); else if (typeof renderTab === "function") renderTab("discover"); }
        setTimeout(() => { QH = null; }, 12e4);
      });
    }); return '<p class="empty">' + (zh() ? "正在加载挑战…" : "Loading challenges…") + '</p>'; }
    if (!QH.length) return '<p class="empty">' + (zh() ? "还没有开放的挑战。" : "No challenges yet.") + '</p>';
    return (QALL ? '<p class="xs" style="padding:8px 16px 0;color:var(--gold)">' + (zh() ? "当前分类下还没有挑战，先给你看全部。" : "No challenges in this category yet — showing all.") + '</p>' : '') + '<p class="xs faint" style="padding:8px 16px 0">' + (zh() ? "每个挑战有回合上限：在限定回合内，通过对话完成目标。还有一个隐藏目标。" : "Each challenge has a turn limit: reach the goals through conversation before you run out. There's a hidden goal too.") + '</p>' +
      QH.map(w => {
        const q = CAT.data.works[w.id].quest, b = best(w.id), tot = q.goals.length + 1, title = zh() ? w.title : ((w.en && w.en.title) || w.title);
        const cover = w.A.cover || w.A.poster || w.cover || "";
        return '<div class="qcard"><div class="qhd">' + (cover ? '<img class="art qart" src="' + esc(cover) + '" alt="">' : '<div class="art qart"></div>') +
          '<div class="grow" style="min-width:0"><div class="eyebrow" style="color:var(--gold)">' + t("st.quest") + ' · ' + esc(title) + '</div><b>' + esc(Lz(q.qtitle)) + '</b><p>' + (zh() ? "限 " + q.turns + " 回合" : q.turns + " turns") + (b != null ? ' · ' + (zh() ? "我的最好成绩 " : "My best ") + b + '/' + tot : '') + '</p></div></div>' +
          '<div class="qlist" style="padding:6px 2px 0">' + q.goals.map(g => '<div class="task"><span class="ck"></span>' + esc(Lz(g)) + '</div>').join("") + '<div class="task"><span class="ck">?</span><span class="faint">' + (zh() ? "隐藏目标" : "Hidden goal") + '</span></div></div>' +
          '<button class="btn btn-p btn-block btn-sm" style="margin-top:10px" data-q138="' + esc(w.id) + '">' + t("q.go") + '</button></div>';
      }).join("");
  }
  if (typeof homeTabBody === "function") { const H0 = homeTabBody; homeTabBody = function () { if (homeTab === "quest") return questHTML(); return H0.apply(this, arguments); }; }
  document.addEventListener("click", async e => {
    const x = e.target.closest("[data-q138]"); if (!x) return; e.preventDefault(); e.stopPropagation();
    if (x.dataset.busy) return; x.dataset.busy = 1;
    try {
      const wid = x.dataset.q138; await load();
      let w = local(wid); if (!w) { const id = await installWork(wid); w = id && wd(id); }
      if (!w) return;
      w.quest = CAT.data.works[wid].quest; if (!w.status) w.status = { time: "", place: "" }; save();
      if (typeof openStory === "function") openStory(w.id, false, true);
    } catch (err) { console.warn("[cat138] quest", err); toast(zh() ? "暂时打不开这个挑战" : "Couldn't open this challenge"); }
    finally { delete x.dataset.busy; }
  }, true);
  /* ---------- 3 · 排行：选的取向下没有上榜角色时，自动切到「全部」，不给空榜 ---------- */
  if (typeof rankHTML === "function" && typeof RK !== "undefined") {
    const R0 = rankHTML;
    rankHTML = function () {
      try {
        if (!RK.orient && RK.data && RK.data._o !== "all" && !RK.busy && !(RK.data.rows || []).some(r => ch(r.cid))) { RK.orient = "all"; RK.data = null; }
      } catch (_) {}
      return R0.apply(this, arguments);
    };
  }
  setTimeout(load, 1200);
  window.__cat138 = { load, tagsFor, infer };
})();
