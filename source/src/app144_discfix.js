/* ================= 发现页整理（2026-11-12）=================
   用户反馈：「点击角色后页面真的混乱」。
   1 · 「社区新作」那一排是故事卡片，只该出现在「故事」里；切到「角色」（app140 的 .meet140）时把它藏起来，
       角色页从「故事 / 角色」标签开始，下面只有已配对和遇见。
   2 · 社区新作里有的官方作品没有封面（作品表里 cover 为空，只显示 📖），
       就去读它的官方资源表 art/official/<作品id>.json 里的 cover / poster 补上。
   3 · 用户反馈：「为什么每次都要制作，你做好直接进去不行吗」。
       官方剧第一次开始时 app76 会走 app74 的「正在把你的剧做成正式版」（AI 包装，最多等 30 秒）。
       官方剧的音乐、特效、小游戏剧本里已经写好了，不需要再配 ⇒ 直接开始；
       故事页和简介用后台写好的原文（app76 装作品时已经搭好开场卡），不再等 AI 包装。
   4 · 用户反馈：「语音每次第一句和有的时候要读两遍」。
       朗读有好几条路（剧本播放 pkAppend / pkWait、AI 回复 playBeats、appendMsg 兜底 voiceEnq、气泡 🔊 等），
       各自防重只认自己那份标记，碰上同一句就各念一遍。⇒ 在最底下的 speak() 统一去重：
       同一个人、同一句话 30 秒内只念一次；后来的调用不再发声，只等第一遍念完再回调（剧本节奏不变）。
       玩家自己点气泡上的 🔊（data-mt / data-b86 = play|…）照常重念。
   5 · 用户反馈：「精选」里所有剧都堆在一排「MIRU 新剧」下面，没有分类。
       ⇒ 「MIRU 新剧」只放最新 6 部；下面按主题竖着排几排，每排横滑：
         奇幻言情 · 暗黑与黑帮 · 悬疑反转 · 王室与豪门 · 甜宠心动。
       （「修罗场 / 多男主」试过，14 部里 13 部都是，等于没分，所以不单列。）
       分组按作品的标准标签（catalog.json）归类，一部剧可以出现在几排；少于 2 部的那排不显示。
   6 · 用户反馈：「我的身份」和进剧本时的「我的角色卡」是同一张，但在「我的」页点它没反应。
       ⇒ 点正在使用的那张直接打开编辑（和剧本里「我的角色卡 · 编辑」同一个编辑器）；没填名字时提示「点我填写」。
   7 · 用户反馈：情侣房「没有和最新的剧本吻合」—— 列的是旧存档里早就下线的角色（只有文字头像）。
       ⇒ 只列正式主角卡和官方新剧里的主角（同名只列一次）；玩家自己扮演的「你」、旧群聊路人不列。 */
(function () {
  "use strict";
  const st = document.createElement("style");
  st.textContent = "#s-main .scroll:has(.meet140) .comm68,#s-main:has(.meet140) .comm68{display:none!important}";
  document.head.appendChild(st);

  const cache = {};
  async function coverOf(id) {
    if (Object.prototype.hasOwnProperty.call(cache, id)) return cache[id];
    cache[id] = null;
    try {
      const r = await fetch("/art/official/" + encodeURIComponent(id) + ".json");
      if (r.ok) {
        const j = await r.json(); let c = String(j.cover || j.poster || "");
        if (c && !/^https?:\/\//.test(c)) c = "/" + c.replace(/^\/+/, "");
        cache[id] = c || null;
      }
    } catch (_) {}
    return cache[id];
  }
  let busy = false;
  function patch() {
    if (busy) return; busy = true;
    const list = [...document.querySelectorAll(".comm68 [data-cwork] .cph")];
    Promise.all(list.map(async ph => {
      const b = ph.closest("[data-cwork]"); if (!b) return;
      const c = await coverOf(b.dataset.cwork);
      if (c && ph.isConnected) { const im = document.createElement("img"); im.src = c; im.alt = ""; im.loading = "lazy"; ph.replaceWith(im); }
    })).finally(() => { busy = false; });
  }
  let t = 0;
  new MutationObserver(() => { clearTimeout(t); t = setTimeout(() => { if (document.querySelector(".comm68 .cph")) patch(); }, 150); })
    .observe(document.body, { childList: true, subtree: true });

  /* ---------- 3 · 官方剧直接开始 ---------- */
  if (typeof packStart === "function") {
    const start = packStart;
    packStart = function (wid) {
      try {
        const w = wd(wid);
        if (w && w.official76 && w.pack && !w.pack.exp74) {
          w.pack.exp74 = { at: Date.now(), official: 1, quiet: 1 }; save();
        }
      } catch (e) { console.warn("[144] start", e); }
      return start.apply(this, arguments);
    };
  }

  /* ---------- 4 · 同一句不念两遍 ---------- */
  if (typeof speak === "function") {
    const sp = speak, recent = new Map(); let manualAt = 0;
    document.addEventListener("click", e => { const x = e.target.closest && e.target.closest('[data-mt^="play|"],[data-b86^="play|"]'); if (x) manualAt = Date.now(); }, true);
    speak = function (text, id, onend) {
      const now = Date.now(), key = (id || "") + "|" + String(text || "").replace(/\s+/g, "").slice(0, 240);
      for (const [k, v] of recent) if (now - v.at > 30000) recent.delete(k);
      const old = recent.get(key);
      if (old && now - manualAt > 1500) { old.p.then(() => { try { onend && onend(); } catch (_) {} }); return; }
      let res; const p = new Promise(r => { res = r; }); let fired = false;
      const fin = function () { if (fired) return; fired = true; res(); try { onend && onend.apply(this, arguments); } catch (_) {} };
      setTimeout(res, 60000);
      recent.set(key, { at: now, p });
      try { return sp.call(this, text, id, fin); } catch (err) { fin(); throw err; }
    };
  }

  /* ---------- 5 · 精选页按主题分排 ---------- */
  const SHELVES = [
    ["🌙", "奇幻言情", "Romantasy", ["Romantasy", "Vampires", "Werewolves", "Fae", "Dragons", "Paranormal", "Fated Mates", "Gothic Romance"]],
    ["🖤", "暗黑与黑帮", "Dark & Dangerous", ["Dark Romance", "Mafia", "Bratva", "Touch Her and Die", "Touch Them and Die"]],
    ["🔍", "悬疑反转", "Twists & Secrets", ["Romantic Suspense", "Revenge", "Hidden Identity", "Secret Heir", "Mystery"]],
    ["👑", "王室与豪门", "Crowns & Fortunes", ["Royal Court", "Billionaire", "Arranged Marriage", "Castle Life"]],
    ["☀️", "甜宠心动", "Sweet & Swoony", ["Romance", "Rom-Com", "He Falls First", "Golden Retriever", "Mutual Pining", "Secret Admirer", "Vacation", "Celebrity", "Campus"]]
  ];
  if (typeof discMain === "function" && typeof off94RCard === "function") {
    const main = discMain;
    discMain = function () {
      let h = main.apply(this, arguments);
      try {
        const L = (typeof OFFF94 !== "undefined" && OFFF94.list) || [];
        if (!L.length) return h;
        const z = (typeof CL === "function" ? CL() === "zh" : true);
        const old = '<div class="shelf off94s"><div class="shd"><h3>✦ ' + (z ? "MIRU 新剧" : "New from MIRU") + '</h3></div><div class="rail2">' + L.map(off94RCard).join("") + '</div></div>';
        if (h.indexOf(old) < 0) return h;
        const fresh = new Set(L.slice(0, 6).map(w => w.id));   /* 「新剧」角标只留给最新 6 部 */
        const card = w => fresh.has(w.id) ? off94RCard(w) : off94RCard(w).replace(/<span class="rbadge">[^<]*<\/span>/, "");
        const shelf = (title, list, cls) => '<div class="shelf off94s ' + (cls || "") + '"><div class="shd"><h3>' + title + '</h3></div><div class="rail2">' + list.map(card).join("") + '</div></div>';
        let out = shelf("✦ " + (z ? "MIRU 新剧" : "New from MIRU"), L.slice(0, 6), "s144new");
        SHELVES.forEach(([ic, zt, et, tags]) => {
          const list = L.filter(w => (w.tags || []).some(t => tags.includes(t)));
          if (list.length >= 2) out += shelf(ic + " " + (z ? zt : et), list, "s144");
        });
        h = h.replace(old, out);
      } catch (e) { console.warn("[144] shelves", e); }
      return h;
    };
  }

  /* ---------- 6 · 「我的身份」点了能编辑 ---------- */
  document.addEventListener("click", e => {
    const x = e.target.closest && e.target.closest(".me-pers [data-pid]"); if (!x) return;
    if (typeof S === "undefined" || x.dataset.pid !== S.pid || typeof editPersona !== "function") return;
    e.preventDefault(); e.stopImmediatePropagation(); editPersona(persona());
  }, true);
  const fillHint = () => document.querySelectorAll(".me-pers [data-pid] b").forEach(b => {
    if (b.textContent.trim() === "—" && !b.dataset.h144) { b.dataset.h144 = 1; b.textContent = (typeof CL === "function" && CL() !== "zh") ? "Tap to fill in" : "点我填写名字"; }
  });
  new MutationObserver(() => { if (document.querySelector(".me-pers")) fillHint(); }).observe(document.body, { childList: true, subtree: true });

  /* ---------- 7 · 情侣房只列在线角色 ---------- */
  if (typeof coupleRoom === "function") {
    const room = coupleRoom;
    coupleRoom = function () {
      const all = S.threads;
      try {
        /* 只留正式主角卡（ld_*），以及官方剧里和主角卡同名的角色；旧存档里的群聊路人、下线角色都不列 */
        const leadN = new Set(Object.keys(C).filter(id => /^ld_/.test(id) && ch(id)).map(id => ch(id).n));
        const ok = (cid, th) => { const c = ch(cid); if (!c || c.retired || c.you94 || c.n === "你" || !artSrc(cid)) return false;
          if (/^ld_/.test(cid)) return true; const w = th.wid && wd(th.wid); return !!(w && w.official76 && leadN.has(c.n)); };
        const f = {};
        Object.keys(all || {}).forEach(id => {
          const th = all[id]; if (!th) return;
          if (th.wid && typeof wd === "function" && !wd(th.wid)) return;
          const cast = (th.cast || []).filter(c => ok(c, th)); if (!cast.length) return;
          f[id] = Object.assign(Object.create(Object.getPrototypeOf(th)), th, { cast });
        });
        S.threads = f;
        return room.apply(this, arguments);
      } catch (e) { console.warn("[144] couple", e); S.threads = all; return room.apply(this, arguments); }
      finally { S.threads = all; setTimeout(dedupe, 0); }
    };
    /* 同一个人在几段对话里只列一次（留进度最高的那条，列表本来就按进度排） */
    const dedupe = () => { const seen = new Set(); document.querySelectorAll("[data-cpgo]").forEach(b => { const c = ch(b.dataset.cpgo.split("|")[0]); const n = c && c.n; if (!n) return; if (seen.has(n)) b.remove(); else seen.add(n); }); };
  }
})();

/* ================= 剧中社交平台按时代换皮 + 并进「动态」（2026-11-12）=================
   用户反馈：古代 / 玄幻剧里出现「热搜榜」「粉丝」「@账号」很出戏——古代没有这个东西。
   1 · 看剧名、简介、标签判断时代：
         古风（宫廷 / 江湖 / 仙侠）→「京城风闻」或「仙门传音」：坊间风声、说书人、拥趸、非议、市井、声望、放出风声
         西幻（王国 / 骑士 / 魔法）→「王城传声板」：告示栏、传令官、拥护者、反对派、平民、声望、张贴告示
         现代剧不变（热搜、粉丝、发布）。
   2 · 古风 / 西幻不显示 @账号；提示词要求 AI 用这个世界自己的传播方式写（告示、茶楼说书、传信、宫人耳语），
       不许出现热搜、微博、转发、营销号、@、#话题# 这类现代词。
   3 · 和聊天里的「动态」打通：角色本人在风声板上说的话，同步一条到「聊天 → 动态」（标注出自哪部剧），
       在动态里也能看到、点赞、回复。
   4 · 用户反馈：协议页「进来无法返回了，咱们不是五个语言吗」⇒ 协议 / 隐私页改成五种语言 + 顶部返回；
       App 里的链接带上当前语言、在本窗口打开（以前是新窗口，PWA 里没有返回路）。 */
(function () {
  "use strict";
  if (typeof platform96 !== "function") return;
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const T = (a, b) => zh() ? a : b;
  const XIA = /古代|古风|王朝|皇帝|皇上|皇后|宫廷|后宫|妃|侯府|将军|江湖|仙|修真|修仙|宗门|魔尊|神君|朝堂|公主|太子|王爷|嫡女|庶女|郡主|xianxia|wuxia|dynasty|imperial court|cultivat|concubine/i;
  const IMM = /仙|修真|修仙|宗门|魔尊|神君|xianxia|cultivat/i;
  const FAN = /王冠|王国|王储|王位|王庭|骑士|王城|城堡|领主|加冕|\b(crown|kingdom|knights?|throne|realm|medieval|castle|coronation)\b/i;
  const MODERN = /手机|直播|热搜|公司|总裁|大学|校园|娱乐圈|明星|医院|警|别墅|hockey|campus|CEO|startup|phone|stream/i;

  function eraOf(w) {
    if (!w) return "now";
    const s = [Lz(w.title), Lz(w.premise), Lz(w.hook), (w.tags || []).join(" "), Lz(w.genre)].filter(Boolean).join(" ");
    const t = Lz(w.title) || "", hits = re => (s.match(new RegExp(re.source, "gi")) || []).length;
    /* 标题里就有，或者正文里至少出现两次，才算（免得「冷面王子」这种现代标签、或者一个「仙女棒」把现代剧换了皮） */
    const strong = re => re.test(t) || hits(re) >= 2;
    if (MODERN.test(s) && !XIA.test(t) && !FAN.test(t)) return "now";
    if (strong(XIA)) return IMM.test(s) ? "imm" : "xia";
    if (strong(FAN)) return "fan";
    return "now";
  }
  const thEra = th => { try { return th && th.wid ? eraOf(wd(th.wid)) : "now"; } catch (_) { return "now"; } };
  const curEra = () => thEra(typeof curT !== "undefined" ? S.threads[curT] : null);

  const V = {
    xia: () => ({ platform: T("京城风闻", "Whispers of the Capital"), btn: ["📜", T("风声", "Rumors")], trends: T("坊间风声", "Talk of the town"), hot: T("沸", "HOT"),
      fans: T("声望 ", "Renown "), post: T("放出风声", "Spread word"), ph: n => T("以 " + n + " 的名义放一句话出去……满城都会传开", "Let a word slip as " + n + "… the whole city will hear"),
      wait: T("街头巷尾还没人开口……", "No one's talking yet…"), loading: T("正在打听……", "Listening for rumors…"),
      kind: { media: T("说书人", "Storyteller"), fan: T("拥趸", "Admirer"), anti: T("非议", "Detractor"), passerby: T("市井", "Townsfolk"), char: T("本人", "In person"), me: T("你", "You") },
      rank: n => T("你成了坊间议论第 " + n, "You're the city's #" + n + " rumor"), fansL: T("声望", "Renown"), postL: T("你放出的话", "Your words") }),
    imm: () => Object.assign(V.xia(), { platform: T("仙门传音", "Sect Whispers"), btn: ["🪶", T("传音", "Whispers")], trends: T("各峰热议", "What the sects are saying"),
      ph: n => T("以 " + n + " 的名义传一道音……各峰都会听见", "Send word as " + n + "… every peak will hear"), rank: n => T("你成了各峰热议第 " + n, "You're #" + n + " on every peak") }),
    fan: () => ({ platform: T("王城传声板", "The Crier's Board"), btn: ["📜", T("告示", "Notices")], trends: T("告示栏 · 人人在议", "Talk of the town"), hot: T("沸", "HOT"),
      fans: T("声望 ", "Renown "), post: T("张贴告示", "Post a notice"), ph: n => T("以 " + n + " 的名义张贴一则告示……全城都会看到", "Post a notice as " + n + "… the whole city will see"),
      wait: T("告示栏还空着……", "The board is still empty…"), loading: T("传令官正在赶来……", "The criers are coming…"),
      kind: { media: T("传令官", "Herald"), fan: T("拥护者", "Supporter"), anti: T("反对派", "Dissenter"), passerby: T("平民", "Commoner"), char: T("本人", "In person"), me: T("你", "You") },
      rank: n => T("你成了全城议论第 " + n, "You're the city's #" + n + " talk"), fansL: T("声望", "Renown"), postL: T("你的告示", "Your notice") })
  };
  const voc = e => (V[e] ? V[e]() : null);

  /* ---------- 1 · 平台名每次按时代重算（旧存档里缓存的「热搜」也会换掉） ---------- */
  const plat = platform96;
  platform96 = function (w) { const v = voc(eraOf(w)); return v ? v.platform : plat.apply(this, arguments); };
  const open0 = openFeed96;
  openFeed96 = function () {
    const th = S.threads[curT]; try { if (th && th.feed96) th.feed96.platform = platform96(wd(th.wid)); } catch (_) {}
    const r = open0.apply(this, arguments);
    try { skin(); } catch (e) { console.warn("[145] skin", e); }
    return r;
  };
  function skin() {
    const v = voc(curEra()), el = document.getElementById("fd96"); if (!v || !el) return;
    const th = S.threads[curT], F = th && th.feed96;
    const sm = el.querySelector(".fdh96 small"); if (sm && F) sm.textContent = (Lz(wd(th.wid) && wd(th.wid).title) || "") + " · " + v.fans + fmtN96(F.fans);
    const tt = el.querySelector(".ftt96"); if (tt) tt.textContent = v.btn[0] + " " + v.trends;
    const hot = el.querySelector(".ft96 em"); if (hot) hot.textContent = v.hot;
    const ta = el.querySelector("#fdt96"); if (ta) ta.placeholder = v.ph(youName96(th));
    const pb = el.querySelector("[data-fdp96]"); if (pb) pb.textContent = v.post + " · " + P96.post + "💎";
    el.querySelectorAll(".fe96").forEach(p => { if (p.id === "fdw96") p.textContent = "✨ " + v.loading; else p.textContent = v.wait; });
  }

  /* ---------- 2 · 帖子：古风 / 西幻不显示 @账号，身份标签换词 ---------- */
  const post0 = postHTML96;
  postHTML96 = function (p, th) {
    let h = post0.apply(this, arguments);
    const v = voc(thEra(th || S.threads[curT])); if (!v) return h;
    h = h.replace(/<small>[^<]*<\/small>(<em class="k-)/, "$1");
    const k = v.kind[p.kind]; if (k) h = h.replace(/(<em class="k-[^"]*">)[^<]*(<\/em>)/, "$1" + esc(k) + "$2");
    return h;
  };
  const btn0 = feedBtn96;
  feedBtn96 = function () {
    const had = !!document.getElementById("fd96b"); const r = btn0.apply(this, arguments);
    try { const b = document.getElementById("fd96b"), v = voc(curEra()); if (b && v && (!had || !b.dataset.e145)) { b.dataset.e145 = 1; b.querySelector("i").textContent = v.btn[0]; b.querySelector("small").textContent = v.btn[1]; } } catch (_) {}
    return r;
  };
  /* 刷新中的提示 */
  const ref0 = refreshFeed96;
  refreshFeed96 = function () { const r = ref0.apply(this, arguments); try { skin(); } catch (_) {} return r; };

  /* ---------- 变化卡片：「上热搜」「粉丝」换词 ---------- */
  const chg0 = chg96;
  chg96 = function (items) {
    try {
      const v = voc(curEra());
      if (v && Array.isArray(items)) items = items.map(x => {
        if (!Array.isArray(x)) return x; const s = String(x[1] || ""); let m;
        if ((m = /热搜第 (\d+)|trending #(\d+)/i.exec(s))) return [x[0] === "🔥" ? v.btn[0] : x[0], v.rank(m[1] || m[2])].concat(x.slice(2));
        if (/^(粉丝|Followers)$/.test(s)) return ["🏮", v.fansL].concat(x.slice(2));
        if (/^(你的动态|Your post)$/.test(s)) return [x[0], v.postL].concat(x.slice(2));
        return x;
      });
    } catch (_) {}
    return chg0.call(this, items);
  };

  /* ---------- 提示词：用这个世界自己的传播方式 ---------- */
  const RULE = {
    xia: ["这是古代世界，没有手机和网络。这里的「社交平台」是坊间流言：茶楼说书、街头告示、宫人耳语、书信、童谣。trends 写成坊间最热的几条传闻（短句，不带 #）。handle 写身份（如「东市茶客」「尚书府丫鬟」），不要 @。全文禁止出现：热搜、微博、转发、点赞、营销号、粉丝、黑粉、直播、网友、@、#。用词带古意但要好懂。",
          "This is a pre-modern world with no phones or internet. The 'feed' is the rumor mill: teahouse storytellers, street notices, servants' whispers, letters. Trends are the hottest rumors (short, no #). handle is a role (e.g. 'a tea-house regular'), no @. Never use: trending, viral, followers, repost, influencer, internet, online, @, #."],
    imm: ["这是仙侠世界，没有手机和网络。这里的「社交平台」是仙门传音、玉简留言、各峰弟子议论、山门告示。trends 写成各峰最热的几条议论（短句，不带 #）。handle 写身份（如「外门弟子」「丹峰小童」），不要 @。全文禁止出现：热搜、微博、转发、点赞、营销号、粉丝、黑粉、直播、网友、@、#。",
          "This is a cultivation world with no phones or internet. The 'feed' is sect whispers: jade-slip messages, disciples gossiping across the peaks, notices at the gate. Trends are the hottest talk (short, no #). handle is a role (e.g. 'outer disciple'), no @. Never use: trending, viral, followers, repost, influencer, internet, online, @, #."],
    fan: ["这是奇幻王国，没有手机和网络。这里的「社交平台」是王城告示栏：传令官宣读、酒馆议论、贴在墙上的告示和匿名纸条。trends 写成全城最热的几条议论（短句，不带 #）。handle 写身份（如「酒馆常客」「宫廷侍女」），不要 @。全文禁止出现：热搜、微博、转发、点赞、营销号、粉丝、黑粉、直播、网友、@、#。",
          "This is a fantasy kingdom with no phones or internet. The 'feed' is the town crier's board: heralds' readings, tavern talk, notices and anonymous notes pinned to the wall. Trends are the hottest talk (short, no #). handle is a role (e.g. 'tavern regular'), no @. Never use: trending, viral, followers, repost, influencer, internet, online, @, #."]
  };
  const ask0 = ask96;
  ask96 = function (p, max) {
    try {
      if (/剧中社交平台|in-world social feed/i.test(String(p))) {
        const e = curEra(); if (RULE[e]) p = String(p) + "\n\n" + (zh() ? "【时代要求】" : "[Era rule] ") + RULE[e][zh() ? 0 : 1];
      }
    } catch (_) {}
    return ask0.call(this, p, max);
  };

  /* ---------- 3 · 角色本人的帖子同步到「聊天 → 动态」 ---------- */
  const gen0 = gen96;
  gen96 = async function (th) {
    const before = new Set(((th && th.feed96 && th.feed96.posts) || []).map(p => p.id));
    const r = await gen0.apply(this, arguments);
    try {
      if (!r || !th || !th.feed96) return r;
      const mine = th.feed96.posts.filter(p => !before.has(p.id) && p.kind === "char" && p.cid && ch(p.cid));
      const p = mine[0]; if (!p) return r;
      S.cmoms = S.cmoms || [];
      if (S.cmoms.some(x => x.f96 === p.id)) return r;
      const w = wd(th.wid), others = (th.cast || []).filter(c => c !== p.cid && ch(c) && c !== (th.pk && th.pk.as)).slice(0, 2);
      S.cmoms.unshift({ id: "cm" + Date.now(), who: p.cid, tid: th.id, txt: p.text, mem: "", at: Date.now(), likes: others, cm: [], photo: false,
        f96: p.id, src: Lz(w && w.title) || "", era: thEra(th) });
      S.cmoms = S.cmoms.slice(0, 20); save();
    } catch (e) { console.warn("[145] moments", e); }
    return r;
  };
  if (typeof cmHTML === "function") {
    const cm0 = cmHTML;
    cmHTML = function (p) {
      let h = cm0.apply(this, arguments);
      if (!p || !p.f96) return h;
      const v = voc(p.era), lab = v ? v.platform : T("热搜", "Trending");
      return h.replace(/<div class="cmmem">[\s\S]*?<\/div>/, '<div class="cmmem">' + (v ? v.btn[0] : "🔥") + " " + esc(T("出自《" + p.src + "》· " + lab, "From “" + p.src + "” · " + lab)) + '</div>');
    };
  }

  /* ---------- 4 · 协议 / 隐私页：按当前语言打开，在本窗口打开（页面顶上有「返回」） ---------- */
  document.addEventListener("click", e => {
    const a = e.target.closest && e.target.closest('a[href*="terms.html"],a[href*="privacy.html"]'); if (!a) return;
    const base = a.getAttribute("href").split("#")[0].replace(/^\/?/, "/"), lang = (typeof S !== "undefined" && S.lang) || "zh";
    e.preventDefault(); e.stopImmediatePropagation();
    try { if (typeof save === "function") save(); } catch (_) {}
    location.href = base + "#" + (["zh", "en", "ja", "ko", "es"].includes(lang) ? lang : "en");
  }, true);

  window.__era145 = { eraOf, curEra };
})();

/* ================= 「我的」页 · 角色音色重做（2026-11-12）=================
   用户反馈（截图）：
     · 「AI 生成语音」报「语音模型没能完成（voice via connector not available）」——它还在走 claude.ai 的连接器，网站上没有。
       ⇒ 改走服务器配音 /api/tts（和剧里朗读同一套声音），生成后直接给播放条。
     · 「折叠起来的部分得做个设计让我能看到」⇒ 每个角色一行：头像、名字、现在用的声音；「换音色」展开一排可选的声音，
       当前那个高亮；「最近使用」之外还有「展开全部角色」。
     · 「我可以给主角更换音色吗」⇒ 可以：任何角色（包括男主们）、旁白、以及你自己（主角「我」）都能换，选完立刻试听，
       之后剧里朗读就用新声音（存在本机，换回「默认」即恢复）。
     · 「我的声音」录音用不了 ⇒ 按设备挑支持的录音格式（iPhone 不支持 webm）、录音时显示计时、
       失败时说清楚是哪一步（没给权限 / 没有麦克风 / 浏览器不支持），最长 15 秒自动停。 */
(function () {
  "use strict";
  if (typeof renderMe !== "function") return;
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const T = (a, b) => zh() ? a : b;
  const ALL_V = (typeof TTS_VOICES !== "undefined") ? TTS_VOICES : { m: ["m1", "m2", "m3", "m4", "m5", "m6", "m7"], f: ["f1", "f2"] };
  const VN_EN = { m1: "Low & restrained", m2: "Clear, boyish", m3: "Warm senior", m4: "Cold & hard", m5: "Lazy drawl", m6: "Bright", m7: "Mature, steady", f1: "Gentle", f2: "Crisp" };
  const vName = v => /^u[0-9a-f]{20}$/.test(String(v)) ? T("我的录音", "My recorded voice") : zh() ? ((typeof TTS_VNAME !== "undefined" && TTS_VNAME[v]) || v) : (VN_EN[v] || v);
  const ov = () => (S.voiceOv = S.voiceOv || {});
  let NOCLONE = false;

  /* ---------- 换音色：存在 S.voiceOv，剧里朗读也用它 ---------- */
  if (typeof ttsVoice === "function") {
    const tv = ttsVoice;
    ttsVoice = function (id) {
      try {
        if (id === "me" && S.myClone && S.myClone.on && /^u[0-9a-f]{20}$/.test(S.myClone.id) && !NOCLONE) return S.myClone.id;
        if (id === "me" && S.myVoiceId && /^[mf]\d$/.test(S.myVoiceId)) return S.myVoiceId;
        if ((!id || id === "n") && S.ttsNarr) return S.ttsNarr;
        const o = S.voiceOv && S.voiceOv[id]; if (o && /^[mf]\d$/.test(o)) return o;
      } catch (_) {}
      return tv.apply(this, arguments);
    };
  }
  /* 用我的录音念不出来（克隆服务忙 / 超时）⇒ 这一句退回我选的预设声音，不让它没声 */
  if (typeof ttsFetch === "function") {
    const tf = ttsFetch;
    ttsFetch = function (text, id) {
      const p = tf.apply(this, arguments);
      if (id !== "me" || !(S.myClone && S.myClone.on)) return p;
      return p.catch(() => { NOCLONE = true; try { return tf(text, id); } finally { NOCLONE = false; } });
    };
  }
  const cloneOn = () => !!(S.myClone && S.myClone.on && S.myClone.id);
  const curV = id => { try { return ttsVoice(id); } catch (_) { return ""; } };
  const isCustom = id => id === "me" ? !!S.myVoiceId : id === "n" ? !!S.ttsNarr : !!ov()[id];
  function setV(id, v) {
    if (id === "me") { if (v) S.myVoiceId = v; else delete S.myVoiceId; }
    else if (id === "n") { if (v) S.ttsNarr = v; else delete S.ttsNarr; }
    else { if (v) ov()[id] = v; else delete ov()[id]; }
    try { if (typeof TTS !== "undefined" && TTS.mem) TTS.mem.clear(); } catch (_) {}
    save();
  }
  const sample = id => {
    if (id === "me") return T("这一次，我想自己做决定。", "This time, I'll decide for myself.");
    if (id === "n") return T("夜色落下来的时候，整座城都安静了。", "When night fell, the whole city went quiet.");
    const c = ch(id); const p = c && String(Lz(c.pitch) || "").replace(/[“”"]/g, "").trim();
    return p && p.length <= 80 ? p : T("是我。你还记得我的声音吗？", "It's me. Do you remember my voice?");
  };
  function play(id, txt, btn) {
    if (typeof ttsFetch !== "function") { speak(txt, id); return; }
    if (btn) { btn.dataset.o = btn.dataset.o || btn.textContent; btn.textContent = "…"; }
    try { stopVoice(); } catch (_) {}
    ttsFetch(txt, id).then(u => { const a = new Audio(u); AUD_CUR = a; a.play().catch(() => {}); })
      .catch(() => toast(T("配音暂时没生成出来，稍后再点一次", "The voice didn't come through — try again in a moment")))
      .finally(() => { if (btn) btn.textContent = btn.dataset.o; });
  }

  /* ---------- 音色卡 ---------- */
  const OPEN = new Set(); let SHOW_ALL = false;
  const gOf = id => id === "me" ? (((typeof persona === "function" && persona()) || {}).pron === "he" ? "m" : "f") : id === "n" ? "f" : ((ch(id) || {}).g === "f" ? "f" : "m");
  function chips(id) {
    const g = gOf(id), cur = curV(id), mine = ALL_V[g], other = ALL_V[g === "m" ? "f" : "m"];
    const b = v => '<button data-v146="' + esc(id) + '|' + v + '" class="' + (v === cur ? "on" : "") + '">' + (v === cur ? "✓ " : "") + esc(vName(v)) + '</button>';
    return '<div class="v146p"><div class="v146c">' + mine.map(b).join("") + '</div>' +
      '<div class="v146o">' + T("其他声音", "Other voices") + '</div><div class="v146c">' + other.map(b).join("") + '</div>' +
      (isCustom(id) ? '<button class="v146r" data-v146="' + esc(id) + '|">' + T("恢复默认", "Reset to default") + '</button>' : '') + '</div>';
  }
  function row(id) {
    const me = id === "me", n = id === "n", c = !me && !n ? ch(id) : null; if (!me && !n && !c) return "";
    const av = me ? '<span class="v146a">🙋</span>' : n ? '<span class="v146a">📖</span>' : avatar(id, 34);
    const name = me ? T("我（主角）", "Me (the lead)") : n ? T("旁白", "Narrator") : esc(c.n);
    const open = OPEN.has(id);
    return '<div class="v146 ' + (open ? "open" : "") + '" data-v146row="' + esc(id) + '"><div class="v146h">' + av +
      '<div class="grow"><b>' + name + '</b><small>🎙 ' + esc(vName(curV(id))) + (isCustom(id) ? ' · ' + T("已更换", "custom") : '') + '</small></div>' +
      '<button class="v146b" data-v146play="' + esc(id) + '" aria-label="play">▶</button>' +
      '<button class="v146b v146x" data-v146tog="' + esc(id) + '">' + T("换音色", "Change") + ' <i>' + (open ? "▴" : "▾") + '</i></button></div>' +
      (open ? chips(id) + (!me && !n ? '<button class="v146ai" data-vai="' + esc(id) + '">✨ ' + T("让 TA 说一句你写的话", "Make them say your line") + '</button>' : '') : '') + '</div>';
  }
  function listHTML(q) {
    q = String(q || "").trim().toLowerCase();
    if (q) {
      const ids = allChars().filter(id => (typeof meVoiceNames === "function" ? meVoiceNames(id) : [String((ch(id) || {}).n || "").toLowerCase()]).some(n => n.includes(q))).slice(0, 30);
      return ids.length ? ids.map(row).join("") : '<p class="xs faint">' + T("没有找到这个角色", "No character found") + '</p>';
    }
    const rec = typeof meRecentChars === "function" ? meRecentChars() : [];
    let h = row("me") + row("n") + '<p class="v146t">' + T("最近聊过", "Recently used") + '</p>' + (rec.length ? rec.map(row).join("") : '<p class="xs faint">' + T("还没和角色聊过，搜索名字就能试听", "No chats yet — search a name to preview") + '</p>');
    const rest = allChars().filter(id => !rec.includes(id) && ch(id) && !ch(id).retired && artSrc(id));
    if (SHOW_ALL) h += '<div class="row" style="justify-content:space-between;align-items:center"><p class="v146t">' + T("全部角色", "All characters") + '</p><button class="v146b" data-v146all="0">' + T("收起 ▴", "Collapse ▴") + '</button></div>' + rest.map(row).join("") + '<button class="v146more" data-v146all="0">' + T("收起全部角色 ▴", "Collapse all characters ▴") + '</button>';
    else if (rest.length) h += '<button class="v146more" data-v146all="1">' + T("展开全部 " + rest.length + " 个角色 ▾", "Show all " + rest.length + " characters ▾") + '</button>';
    return h;
  }
  function cardHTML() {
    return '<div class="eyebrow">' + T("角色音色", "Character voices") + '</div>' +
      '<p class="xs dim" style="margin-top:6px;line-height:1.55">' + T("每个角色有一个固定的声音，剧里朗读就用它。点 ▶ 试听；点「换音色」挑一个你喜欢的，主角、旁白、你自己都能换。", "Each character has a fixed voice used for read-aloud. Tap ▶ to preview, or “Change” to pick another — leads, the narrator and you included.") + '</p>' +
      '<div class="field" style="margin-top:10px"><input id="voiceQ146" autocomplete="off" placeholder="' + esc(T("搜索角色名字", "Search a character")) + '"></div>' +
      '<div class="stack" style="gap:8px;margin-top:10px" id="voiceList146">' + listHTML("") + '</div>';
  }
  const refresh = () => { const l = document.getElementById("voiceList146"), q = document.getElementById("voiceQ146"); if (l) l.innerHTML = listHTML(q && q.value); };

  /* ---------- 我的声音（录音） ---------- */
  const REC = { on: false, rec: null, chunks: [], t0: 0, tick: null, stream: null };
  /* iPhone Safari 只认 audio/mp4；把它排在前面。都不行就用 WebAudio 自己录 WAV（不依赖 MediaRecorder） */
  const SAFARI = /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|Android/.test(navigator.userAgent);
  function mimes() {
    if (!window.MediaRecorder) return [];
    const L = SAFARI ? ["audio/mp4", "audio/aac", "audio/webm;codecs=opus", "audio/webm"] : ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
    return L.filter(m => { try { return !MediaRecorder.isTypeSupported || MediaRecorder.isTypeSupported(m); } catch (_) { return false; } }).concat([""]);
  }
  /* WebAudio 兜底：16kHz 单声道 WAV，接口和 MediaRecorder 一样（start / stop / onstop / mimeType） */
  function wavRecorder(stream, pre) {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC && !pre) throw { name: "NotSupportedError" };
    const ctx = pre || new AC(), src = ctx.createMediaStreamSource(stream), proc = ctx.createScriptProcessor(4096, 1, 1), bufs = [];
    const r = { mimeType: "audio/wav", state: "inactive", onstop: null, ondataavailable: null };
    proc.onaudioprocess = e => { if (r.state === "recording") bufs.push(new Float32Array(e.inputBuffer.getChannelData(0))); };
    r.start = () => { r.state = "recording"; try { ctx.resume(); } catch (_) {} src.connect(proc); proc.connect(ctx.destination); };
    r.stop = () => {
      if (r.state !== "recording") return; r.state = "inactive";
      try { src.disconnect(); proc.disconnect(); } catch (_) {}
      const rate = ctx.sampleRate, out = 16000, ratio = rate / out, n = bufs.reduce((a, b) => a + b.length, 0), all = new Float32Array(n);
      let o = 0; bufs.forEach(b => { all.set(b, o); o += b.length; });
      const len = Math.floor(n / ratio), dv = new DataView(new ArrayBuffer(44 + len * 2)), ws = (off, str) => { for (let i = 0; i < str.length; i++) dv.setUint8(off + i, str.charCodeAt(i)); };
      ws(0, "RIFF"); dv.setUint32(4, 36 + len * 2, true); ws(8, "WAVE"); ws(12, "fmt "); dv.setUint32(16, 16, true); dv.setUint16(20, 1, true); dv.setUint16(22, 1, true);
      dv.setUint32(24, out, true); dv.setUint32(28, out * 2, true); dv.setUint16(32, 2, true); dv.setUint16(34, 16, true); ws(36, "data"); dv.setUint32(40, len * 2, true);
      for (let i = 0; i < len; i++) { const v = Math.max(-1, Math.min(1, all[Math.floor(i * ratio)] || 0)); dv.setInt16(44 + i * 2, v < 0 ? v * 0x8000 : v * 0x7fff, true); }
      try { ctx.close(); } catch (_) {}
      if (r.ondataavailable) r.ondataavailable({ data: new Blob([dv], { type: "audio/wav" }) });
      if (r.onstop) r.onstop();
    };
    return r;
  }
  function myvHTML() {
    const clip = S.myVoice && /^data:audio|^blob:/.test(S.myVoice) ? S.myVoice : null, on = cloneOn(), busy = CL_BUSY;
    return '<div class="eyebrow">' + T("我的声音", "My voice") + '</div><p class="xs dim" style="margin-top:6px;line-height:1.55">' + T("录一段 8–15 秒你自己说话的声音（正常语速、安静的地方），可以用它给你的角色配音。", "Record 8–15 seconds of yourself talking (normal pace, quiet room) — it can voice your character.") + '</p>' +
      '<div class="row" style="margin-top:10px;gap:8px;align-items:center">' +
      (clip ? '<audio controls style="height:36px;flex:1;min-width:0" src="' + clip + '"></audio><button class="btn btn-q btn-sm" data-v146del="1">' + T("删除", "Delete") + '</button><button class="btn btn-g btn-sm" data-v146rec="1">' + T("重录", "Redo") + '</button>'
        : '<button class="btn ' + (REC.on ? "btn-p" : "btn-g") + ' btn-sm" data-v146rec="1">' + (REC.on ? "■ " + T("停止", "Stop") : "🎙️ " + T("开始录音", "Record")) + '</button><span class="xs faint" id="v146hint">' + (REC.on ? T("正在录音 ", "Recording ") + '<b id="v146sec">0</b>s' : T("点一下开始，再点一下停止", "Tap to start, tap again to stop")) + '</span>') + '</div>' +
      (clip ? '<div class="v146cl' + (on ? " on" : "") + '"><div class="row" style="gap:10px;align-items:center"><span style="font-size:20px">🎭</span><div class="grow" style="min-width:0"><b>' + T("用我的声音给我的角色配音", "Voice my character with my voice") + '</b><small>' +
          (busy ? T("正在上传……", "Uploading…") : on ? T("已开启：剧里你说的话会用你的声音读出来", "On: your lines in stories are read in your voice") : T("关闭中：你的台词用上面「我（主角）」选的声音", "Off: your lines use the voice picked for “Me” above")) + '</small></div>' +
          '<button class="btn ' + (on ? "btn-g" : "btn-p") + ' btn-sm" data-v146clone="1"' + (busy ? " disabled" : "") + '>' + (on ? T("关闭", "Turn off") : T("开启", "Turn on")) + '</button></div>' +
          (on ? '<button class="v146b" style="margin-top:8px" data-v146play="me">▶ ' + T("听听效果", "Preview") + '</button>' : '') +
          '<p class="xs faint" style="margin-top:8px;line-height:1.5">' + T("开启后这段录音会上传到 MIRU 服务器，只用来给你自己的台词配音，不会给别人看。关闭或删除录音时会一起从服务器删掉。第一次生成要 10–30 秒，生成不了时自动换回预设声音。", "Turning this on uploads the clip to MIRU's server, used only to voice your own lines and never shown to anyone. Turning it off or deleting the clip removes it from the server. The first line can take 10–30s; if it fails, a preset voice is used.") + '</p></div>' : '');
  }
  let CL_BUSY = false;
  async function cloneToggle() {
    if (cloneOn()) { const id = S.myClone.id; S.myClone = null; save(); paintMy(); refresh(); try { await fetch(TTS_EP, { method: "POST", headers: Object.assign({ "Content-Type": "application/json" }, typeof cloudAuth === "function" ? cloudAuth() : {}), body: JSON.stringify({ cloneDel: id }) }); } catch (_) {} return; }
    const auth = typeof cloudAuth === "function" ? cloudAuth() : {};
    if (!auth.Authorization) { toast(T("先登录账号，才能用自己的声音配音", "Sign in first to use your own voice")); return; }
    if (!S.myVoice || !/^data:audio/.test(S.myVoice)) { toast(T("先录一段声音", "Record a clip first")); return; }
    CL_BUSY = true; paintMy();
    try {
      const r = await fetch(TTS_EP, { method: "POST", headers: Object.assign({ "Content-Type": "application/json" }, auth), body: JSON.stringify({ clone: { audio: S.myVoice } }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.id) throw new Error(j.error || r.status);
      S.myClone = { id: j.id, on: 1, at: Date.now() }; save();
      try { if (typeof TTS !== "undefined" && TTS.mem) TTS.mem.clear(); } catch (_) {}
      toast(T("已开启 · 正在用你的声音试读一句", "On — trying a line in your voice"));
      CL_BUSY = false; paintMy(); refresh(); play("me", sample("me"));
    } catch (e) {
      CL_BUSY = false; paintMy();
      toast(/short/.test(String(e.message)) ? T("录音太短了，录 8 秒以上再试", "Clip too short — record 8s or more") : /long|413/.test(String(e.message)) ? T("录音太长了，15 秒以内就好", "Clip too long — keep it under 15s") : T("上传没成功，稍后再试", "Upload failed — try again later"));
    }
  }
  const paintMy = () => { const c = document.querySelector(".me-myv"); if (c) c.innerHTML = myvHTML(); };
  function micErr(e) {
    const n = e && e.name;
    if (n === "NotAllowedError" || n === "SecurityError") return T("麦克风没有被允许：请在浏览器地址栏左侧（或手机 设置 → 隐私 → 麦克风）允许 miru.plus 使用麦克风，然后再试。", "Microphone access was blocked — allow it for miru.plus in your browser or phone settings, then try again.");
    if (n === "NotFoundError" || n === "OverconstrainedError") return T("这台设备上没找到麦克风。", "No microphone found on this device.");
    if (n === "NotReadableError") return T("麦克风正被别的应用占用，关掉它再试。", "Another app is using the microphone — close it and retry.");
    return T("录音没能开始（" + (n || "unknown") + "）。请在 设置 → Safari → 麦克风 里选「允许」，再刷新页面重试。", "Recording couldn't start (" + (n || "unknown") + "). Allow the microphone for this site in your browser settings, then reload.");
  }
  async function recToggle() {
    if (REC.on) { try { REC.rec.stop(); } catch (_) {} return; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { toast(window.isSecureContext ? micErr({ name: "x" }) : T("需要用 https://miru.plus 打开才能录音", "Open https://miru.plus to record")); return; }
    /* 2026-11-13：iPhone 上的各家浏览器（WebKit 内核）MediaRecorder 常报 InvalidStateError ⇒ iPhone/iPad 先用 WebAudio 录 WAV；
       AudioContext 必须在点按的那一刻建好并 resume，否则等完麦克风授权再建会被静音。MediaRecorder 失败一次就换新的麦克风流再试。 */
    const ACx = window.AudioContext || window.webkitAudioContext; let pre = null;
    try { if (ACx) { pre = new ACx(); pre.resume && pre.resume().catch(() => {}); } } catch (_) { pre = null; }
    const ios = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (e) { console.warn("[146] mic", e); try { pre && pre.close(); } catch (_) {} toast(micErr(e)); return; }
    const fresh = async () => { try { if (stream.getAudioTracks().every(t => t.readyState === "live")) return; stream.getTracks().forEach(t => t.stop()); stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch (_) {} };
    let rec = null, kind = "", lastErr = null;
    const tryWav = () => { try { const r = wavRecorder(stream, pre); r.start(); rec = r; kind = "audio/wav"; pre = null; } catch (e) { lastErr = e; console.warn("[146] wav", e); } };
    if (ios && pre) tryWav();
    if (!rec) for (const m of mimes()) {
      await fresh();
      try { const r = new MediaRecorder(stream, m ? { mimeType: m } : undefined); r.start(250); rec = r; kind = r.mimeType || m; break; } catch (e) { lastErr = e; console.warn("[146] MediaRecorder", m, e); }
    }
    if (!rec && !ios) { await fresh(); if (!pre) { try { pre = new ACx(); } catch (_) {} } tryWav(); }
    if (!rec) { try { stream.getTracks().forEach(t => t.stop()); pre && pre.close(); } catch (_) {} toast(micErr(lastErr)); return; }
    try { if (pre) pre.close(); } catch (_) {}
    Object.assign(REC, { on: true, rec, chunks: [], t0: Date.now(), stream });
    rec.ondataavailable = e => { if (e.data && e.data.size) REC.chunks.push(e.data); };
    rec.onstop = () => {
      REC.on = false; clearInterval(REC.tick); try { stream.getTracks().forEach(t => t.stop()); } catch (_) {}
      const blob = new Blob(REC.chunks, { type: (kind || "audio/mp4").split(";")[0] });
      if (blob.size < 1200) { toast(T("没录到声音，再试一次", "Nothing was recorded — try again")); paintMy(); return; }
      const fr = new FileReader(); fr.onload = async () => { const was = cloneOn(); if (was) await cloneToggle(); S.myVoice = fr.result; try { save(); } catch (_) {} toast(T("录好了", "Recorded")); paintMy(); if (was) cloneToggle(); }; fr.readAsDataURL(blob);
    };
    paintMy();
    REC.tick = setInterval(() => { const s = Math.floor((Date.now() - REC.t0) / 1000), el = document.getElementById("v146sec"); if (el) el.textContent = s; if (s >= 15) try { rec.stop(); } catch (_) {} }, 250);
  }

  /* ---------- 装到「我的」页 ---------- */
  const rm = renderMe;
  renderMe = function (v) {
    const r = rm.apply(this, arguments);
    try {
      const vc = v.querySelector(".me-voice"); if (vc) vc.innerHTML = cardHTML();
      const mc = v.querySelector(".me-myv"); if (mc) mc.innerHTML = myvHTML();
    } catch (e) { console.warn("[146] me", e); }
    return r;
  };
  document.addEventListener("input", e => { if (e.target && e.target.id === "voiceQ146") { const l = document.getElementById("voiceList146"); if (l) l.innerHTML = listHTML(e.target.value); } });
  document.addEventListener("click", e => {
    const x = e.target.closest && e.target.closest("[data-v146tog],[data-v146play],[data-v146],[data-v146all],[data-v146rec],[data-v146del],[data-v146clone]"); if (!x) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const d = x.dataset;
    if (d.v146tog) { OPEN.has(d.v146tog) ? OPEN.delete(d.v146tog) : OPEN.add(d.v146tog); refresh(); return; }
    if (d.v146play) { play(d.v146play, sample(d.v146play), x); return; }
    if (d.v146all) { SHOW_ALL = d.v146all !== "0"; refresh(); if (!SHOW_ALL) { try { const c = document.querySelector(".me-voice"); if (c) c.scrollIntoView({ block: "start", behavior: "smooth" }); } catch (_) {} } return; }
    if (d.v146rec != null) { recToggle(); return; }
    if (d.v146del) { if (cloneOn()) cloneToggle(); S.myVoice = null; save(); paintMy(); return; }
    if (d.v146clone) { cloneToggle(); return; }
    if (d.v146 != null) { const [id, vv] = d.v146.split("|"); setV(id, vv || null); refresh(); play(id, sample(id)); return; }
  }, true);

  /* ---------- 「让 TA 说一句」：服务器配音，不再走连接器 ---------- */
  if (typeof aiSpeak === "function" && typeof ttsFetch === "function") {
    aiSpeak = async function (id, text, onDone, onErr, onSrc) {
      const clean = String(text || "").replace(/[*()（）]/g, "").trim().slice(0, 200);
      if (!clean) { if (onErr) onErr(T("先写一句话", "Write a line first")); return false; }
      try {
        const u = await ttsFetch(clean, id);
        if (onSrc) onSrc(u);
        try { stopVoice(); } catch (_) {}
        const a = new Audio(u); AUD_CUR = a; a.onended = () => { if (onDone) onDone(); }; a.play().catch(() => { if (onDone) onDone(); });
        return true;
      } catch (e) { if (onErr) onErr(T("配音暂时没生成出来，过一会儿再试（服务器配音繁忙）", "The voice didn't come through — please retry shortly")); return false; }
    };
  }

  (function () {
    const st = document.createElement("style");
    st.textContent = ".v146{border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(255,255,255,.03);overflow:hidden}.v146.open{border-color:rgba(240,183,126,.45);background:rgba(240,183,126,.06)}" +
      ".v146h{display:flex;align-items:center;gap:10px;padding:9px 10px}.v146h .grow{min-width:0}.v146h b{display:block;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.v146h small{display:block;font-size:11.5px;color:#F0B77E;margin-top:2px}" +
      ".v146a{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.08);font-size:18px;flex:none}" +
      ".v146b{flex:none;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);color:#fff;border-radius:999px;padding:6px 11px;font-size:12.5px;cursor:pointer}.v146x i{font-style:normal;opacity:.7}.v146.open .v146x{border-color:#F0B77E;color:#F6D3AE}" +
      ".v146p{padding:2px 10px 10px}.v146c{display:flex;flex-wrap:wrap;gap:6px}.v146c button{border:1px solid rgba(255,255,255,.16);background:none;color:#ddd;border-radius:999px;padding:6px 11px;font-size:12.5px;cursor:pointer}.v146c button.on{border-color:#F0B77E;background:rgba(240,183,126,.16);color:#F6D3AE;font-weight:600}" +
      ".v146o{font-size:11px;color:#fff8;margin:8px 0 5px}.v146r{margin-top:8px;background:none;border:0;color:#fff9;font-size:12px;text-decoration:underline;padding:0;cursor:pointer}" +
      ".v146ai{display:block;width:calc(100% - 20px);margin:0 10px 10px;border:1px dashed rgba(240,183,126,.5);background:none;color:#F6D3AE;border-radius:12px;padding:8px;font-size:12.5px;cursor:pointer}" +
      ".v146cl{margin-top:12px;padding:11px 12px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03)}.v146cl.on{border-color:rgba(240,183,126,.5);background:rgba(240,183,126,.07)}.v146cl b{display:block;font-size:13.5px}.v146cl small{display:block;font-size:11.5px;color:#F0B77E;margin-top:2px}" +
      ".v146t{font-size:11.5px;color:#fff8;margin:6px 2px 0}.v146more{border:1px dashed rgba(255,255,255,.2);background:none;color:#ddd;border-radius:12px;padding:9px;font-size:13px;cursor:pointer}";
    document.head.appendChild(st);
  })();
  window.__v146 = { listHTML, curV };
})();

/* ================= 2026-11-12 · 风声板「回复」改成页内输入框 + www 跳转 =================
   用户反馈：热搜帖子下的 💬 回复点了没反应。原来用的是浏览器 prompt()，很多 App 内置浏览器直接屏蔽它。
   ⇒ 点 💬 在帖子下面展开一个输入框，写完点「发送 · 1💎」；角色和路人照常 AI 回复。
   另外：用户是在 www.miru.plus 打开的（地址栏显示不安全），那个地址没有有效的 HTTPS，
   浏览器就不给麦克风（录音报「不支持」）。⇒ 打开 www 时自动跳到 https://miru.plus。 */
(function () {
  "use strict";
  try { if (/^www\./i.test(location.hostname) || (location.protocol === "http:" && /miru\.plus$/i.test(location.hostname))) { location.replace("https://miru.plus" + location.pathname + location.search + location.hash); return; } } catch (_) {}
  if (typeof commentFeed96 !== "function") return;
  const Z = () => (typeof CL === "function" ? CL() === "zh" : true), T = (a, b) => Z() ? a : b;
  async function send(pid, txt) {
    const th = S.threads[curT]; if (!th) return; const F = feed96(th), p = F.posts.find(x => x.id === pid); if (!p) return;
    txt = String(txt || "").trim(); if (!txt) return; if (!spend(P96.comment, "card")) return;
    p.cm = p.cm || []; p.cm.push({ name: youName96(th), text: txt.slice(0, 140) }); save(); openFeed96();
    try {
      const r = await ask96((Z() ? "剧中社交平台。帖子：" : "In-world social feed. Post: ") + p.name + ": " + p.text + "\n" + (Z() ? "玩家（" + youName96(th) + "）回复：" : "The player (" + youName96(th) + ") replied: ") + txt +
        "\n" + (Z() ? "角色：" : "Cast: ") + castLine96(th) + "\n" + (Z() ? "写 2 条别人对玩家回复的回复（可以是原帖作者、粉丝或剧中角色），每条不超过 40 字。" : "Write 2 replies to the player's reply (the poster, a fan, or a cast member), each under 25 words.") +
        '\nReply with ONLY JSON: {"replies":[{"name":"...","text":"..."}]} in ' + (Z() ? "Simplified Chinese" : "English") + ".", 400);
      (r && r.replies || []).slice(0, 2).forEach(x => p.cm.push({ name: String(x.name || "").slice(0, 24), text: String(x.text || "").slice(0, 160) }));
      p.likes += 50; save(); if ($("#fd96") && !$("#fd96").hidden) openFeed96();
    } catch (_) { toast(T("回复已发出，大家还在想怎么接话", "Reply posted — others are still thinking")); }
  }
  commentFeed96 = function (pid) {
    const box = document.querySelector('#fd96 .fp96[data-pid="' + pid + '"]'); if (!box) return;
    const old = box.querySelector(".rp145"); if (old) { old.remove(); return; }
    document.querySelectorAll("#fd96 .rp145").forEach(x => x.remove());
    const th = S.threads[curT], p = th && feed96(th).posts.find(x => x.id === pid);
    const d = document.createElement("div"); d.className = "rp145";
    d.innerHTML = '<input maxlength="140" placeholder="' + esc(T("回复 " + (p ? p.name : "") + "……", "Reply to " + (p ? p.name : "") + "…")) + '"><button>' + T("发送", "Send") + ' · ' + P96.comment + '💎</button>';
    (box.querySelector(".grow") || box).appendChild(d);
    const inp = d.querySelector("input"), go = () => { const v = inp.value; if (!v.trim()) { inp.focus(); return; } send(pid, v); };
    d.querySelector("button").addEventListener("click", e => { e.stopPropagation(); go(); });
    inp.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); go(); } });
    setTimeout(() => inp.focus(), 30);
  };
  const st = document.createElement("style");
  st.textContent = ".rp145{display:flex;gap:8px;margin-top:8px}.rp145 input{flex:1;min-width:0;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.15);border-radius:12px;padding:9px 12px;color:#fff;font-size:14px;outline:none}.rp145 input:focus{border-color:#F0B77E}.rp145 button{flex:none;border:0;border-radius:12px;padding:0 14px;background:linear-gradient(135deg,#F0B77E,#EE6F97);color:#1a0f08;font-weight:700;font-size:13px}";
  document.head.appendChild(st);
})();


/* ================= 2026-11-12 · 「AI 帮我想」点了没反应 =================
   原因：① 同一个场景的建议会被缓存，再点一次拿到的还是那几句，看起来什么都没发生；
         ② 角色正在回话（busy）时直接 return，没有任何提示；③ 出错时也不提示。
   ⇒ 每次点都换一批新的（把上一批告诉 AI「别重复」），正在回话时提示稍等，失败给提示；
     建议同时放进面板里的建议框和输入框上方那一排，保证看得见。 */
(function () {
  "use strict";
  if (typeof aiIdeasGo97 !== "function" || typeof DIALOGUE_IDEAS === "undefined") return;
  const T = (a, b) => (typeof CL === "function" && CL() !== "zh") ? b : a;
  aiIdeasGo97 = async function (btn) {
    const th = S.threads[curT]; if (!th) return;
    if (th.pk && th.pk.as === "watch") { toast(T("旁观模式下不用替你想台词", "You're watching — no lines needed")); return; }
    /* busy 也会在剧本播放 / 等你轻点屏幕时一直为 true；只有真的在等 AI 回话（正在输入…）时才让你等 */
    if (busy && document.querySelector("#msgs .typing")) { toast(T("等他们说完这句，再帮你想", "Wait for them to finish, then try again")); return; }
    const key = dialogueSceneKey(th), old = DIALOGUE_IDEAS.get(th);
    if (old && old.key === key && old.items && old.items.length) { try { DIALOGUE_AVOID.set(th, (DIALOGUE_AVOID.get(th) || []).concat(old.items).slice(-9)); } catch (_) {} DIALOGUE_IDEAS.delete(th); }
    if (btn) { btn.disabled = true; btn.dataset.t0 = btn.dataset.t0 || btn.textContent; btn.textContent = T("✨ 正在想…", "✨ Thinking…"); }
    try {
      const items = await dialogueGetIdeas(th);
      if (curT !== th.id || dialogueSceneKey(th) !== key) return;
      if (!items || !items.length) { toast(T("没想出来，再点一次试试", "Nothing came up — try again")); return; }
      const html = dialogueIdeasHTML(items);
      const box = document.getElementById("ai97o"), sg = document.getElementById("sugg");
      if (box) box.innerHTML = html;
      if (sg && (!box || !box.offsetParent)) { sg.style.display = ""; sg.innerHTML = html; }
    } catch (e) { console.warn("[ai97] ideas", e); toast(T("AI 现在有点忙，稍后再点一次", "AI is busy — try again shortly")); }
    finally { if (btn && btn.isConnected) { btn.disabled = false; btn.textContent = btn.dataset.t0; } }
  };
})();

/* ===== 2026-11-13 · 章末选项点不动 + 「帮我想」统一 =====
   1 · 章末三选一出现时，如果上一句（比如角色刚回的话）还在等你「轻点屏幕」确认，点选项会卡在那句上，看起来像没反应。
       ⇒ 选项出现 / 点选项时，先把这句确认掉（朗读中就先停掉）；全局 busy 卡住超过 20 秒也自动放开，并给提示而不是静默。
   2 · 「不知道说什么？帮我想几句」和剧情里的「✨ AI 帮我想」是同一个功能，两种样子 ⇒ 统一成「✨ AI 帮我想」；
       必须几选一（输入框熄灭）时不显示，剧情面板里已经有「✨ AI 帮我想」时也不重复显示。 */
(function () {
  "use strict";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  let busySince = 0;
  setInterval(() => { try { busySince = busy ? (busySince || Date.now()) : 0; } catch (_) {} }, 1000);
  function ackReading(th) {
    try {
      const R = window.READING; if (!R || !th) return;
      const e = R.pending.get(th.id); if (!e) return;
      if (R.voice && R.voice.busy()) stopVoice();
      e.finish();
    } catch (err) { console.warn("[choice147] ack", err); }
  }
  if (typeof packPick === "function") {
    const pick = packPick;
    packPick = function (k) {
      const th = S.threads[curT];
      try {
        if (th && th.pk && th.pk.st === "choose") {
          ackReading(th);
          if (busy) {
            if (busySince && Date.now() - busySince > 20000) { busy = false; busySince = 0; try { typing(false); } catch (_) {} }
            else { toast(zh() ? "上一句还在生成，稍等一下再选" : "Still writing the last line — pick again in a moment"); return; }
          }
        }
      } catch (err) { console.warn("[choice147] pick", err); }
      return pick.apply(this, arguments);
    };
  }
  /* 「进入下一章」「下一章」按钮同样：busy 卡住时不再静默没反应 */
  ["packAdvanceChapter", "packNext"].forEach(name => {
    try {
      const f = window[name]; if (typeof f !== "function") return;
      window[name] = function () {
        const th = S.threads[curT];
        try {
          if (th && th.pk) ackReading(th);
          if (busy) {
            if (busySince && Date.now() - busySince > 20000) { busy = false; busySince = 0; try { typing(false); } catch (_) {} }
            else { toast(zh() ? "上一句还在生成，稍等一下再点" : "Still writing the last line — tap again in a moment"); return; }
          }
        } catch (err) { console.warn("[choice147] " + name, err); }
        return f.apply(this, arguments);
      };
    } catch (_) {}
  });
  /* 2026-11-13 玩家：「我打字了，怎么一直不回复」——上一轮的台词还在一句一句等「轻点屏幕」，这时发的话只会排队，
     而提示只出现前 5 次，看起来就是没人理。⇒ 发新消息时，把上一轮没看完的句子直接全部放出来，然后马上发送。 */
  if (typeof doSend === "function") {
    const ds = doSend;
    doSend = function () {
      const th = S.threads[curT], self = this, args = arguments;
      try {
        const R = window.READING;
        if (th && busy && R && R.pending.get(th.id) && !document.querySelector("#msgs .typing")) {
          (async () => {
            const t0 = Date.now();
            while (Date.now() - t0 < 8000) {
              const e = R.pending.get(th.id);
              if (e) { try { if (R.voice && R.voice.busy()) stopVoice(); e.finish(); } catch (_) {} }
              if (!busy) break;
              await new Promise(r => setTimeout(r, 60));
            }
            ds.apply(self, args);
          })();
          return;
        }
      } catch (err) { console.warn("[send147]", err); }
      return ds.apply(this, arguments);
    };
  }
  /* 选项一出现就把还在等确认的那句确认掉，免得「轻点屏幕继续」和选项同时出现 */
  if (typeof packRefresh === "function") {
    const ref = packRefresh;
    packRefresh = function (th) {
      const r = ref.apply(this, arguments);
      try { if (th && th.pk && th.pk.st === "choose" && curT === th.id) setTimeout(() => { ackReading(th); mark(); }, 0); else mark(); } catch (_) {}
      return r;
    };
  }
  /* 2026-11-13 联想行：所有剧本统一在**最前面**放「✨ AI 帮我想」（和剧情面板同一个处理函数，再点 = 换一批新的）；
     旧的「不知道说什么？帮我想几句」「↻ 换一批」不再单独出现。 */
  const aiBtn = () => '<button class="sgmore ai147" data-sgmore="1" data-ai147="1">✨ ' + (zh() ? "AI 帮我想" : "AI ideas") + '</button>';
  if (typeof sgMoreBtn === "function") sgMoreBtn = function () { return ""; };
  function ensureAi() {
    try {
      const sg = document.getElementById("sugg"); if (!sg) return;
      sg.querySelectorAll("[data-sgmore]:not(.ai147)").forEach(x => x.remove());
      let b = sg.querySelector(".ai147");
      if (!b) { sg.insertAdjacentHTML("afterbegin", aiBtn()); return; }
      if (sg.firstElementChild !== b) sg.insertBefore(b, sg.firstElementChild);
    } catch (_) {}
  }
  if (typeof setSugg === "function") { const ss = setSugg; setSugg = function () { const r = ss.apply(this, arguments); ensureAi(); return r; }; }
  window.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest("[data-ai147]"); if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation();
    try { aiIdeasGo97(b); } catch (err) { console.warn("[ai147]", err); }
  }, true);
  function mark() {
    try {
      const chat = document.getElementById("s-chat"); if (!chat) return;
      const th = S.threads[curT];
      const locked = !!(th && typeof pkBusy === "function" && pkBusy(th));
      const dup = !!chat.querySelector("#pkwrap [data-ai97]");
      chat.classList.toggle("ch147", locked || dup);
      ensureAi();
    } catch (_) {}
  }
  if (typeof renderChat === "function") { const rc = renderChat; renderChat = function () { const r = rc.apply(this, arguments); mark(); return r; }; }
  setInterval(mark, 1500);
  const st = document.createElement("style");
  st.textContent = ".ch147 #sugg [data-sgmore],.ch147 #sugg .ai147{display:none!important}#sugg .ai147{order:-1;flex:none;border-style:solid!important;border-color:rgba(240,183,126,.55)!important;background:rgba(240,183,126,.12)!important;color:#F6D3AE!important;font-weight:700}.ch147 .tap-hint{display:none!important}";
  document.head.appendChild(st);
})();

/* ===== 2026-11-13 · 故事开场「男主」一排：统一露出人脸 =====
   立绘有半身、全身、透明底全身好几种，直接 object-fit:cover 会切到胸口或只看到一个小人。
   ⇒ 用 picojs（MIT，nenadmarkus/picojs）在本地找脸，按脸的位置和大小把头像放大、居中；找不到脸就退回「靠上取景」。
   模型文件 art/ui/facefinder（≈240KB），只在第一次用到时加载一次。 */
(function () {
  "use strict";

const pico = {}
pico.unpack_cascade = function(bytes)
{
	const dview = new DataView(new ArrayBuffer(4));
	let p = 8;
	dview.setUint8(0, bytes[p+0]), dview.setUint8(1, bytes[p+1]), dview.setUint8(2, bytes[p+2]), dview.setUint8(3, bytes[p+3]);
	const tdepth = dview.getInt32(0, true);
	p = p + 4
	dview.setUint8(0, bytes[p+0]), dview.setUint8(1, bytes[p+1]), dview.setUint8(2, bytes[p+2]), dview.setUint8(3, bytes[p+3]);
	const ntrees = dview.getInt32(0, true);
	p = p + 4
	const tcodes_ls = [];
	const tpreds_ls = [];
	const thresh_ls = [];
	for(let t=0; t<ntrees; ++t)
	{
		Array.prototype.push.apply(tcodes_ls, [0, 0, 0, 0]);
		Array.prototype.push.apply(tcodes_ls, bytes.slice(p, p+4*Math.pow(2, tdepth)-4));
		p = p + 4*Math.pow(2, tdepth)-4;
		for(let i=0; i<Math.pow(2, tdepth); ++i)
		{
			dview.setUint8(0, bytes[p+0]), dview.setUint8(1, bytes[p+1]), dview.setUint8(2, bytes[p+2]), dview.setUint8(3, bytes[p+3]);
			tpreds_ls.push(dview.getFloat32(0, true));
			p = p + 4;
		}
		dview.setUint8(0, bytes[p+0]), dview.setUint8(1, bytes[p+1]), dview.setUint8(2, bytes[p+2]), dview.setUint8(3, bytes[p+3]);
		thresh_ls.push(dview.getFloat32(0, true));
		p = p + 4;
	}
	const tcodes = new Int8Array(tcodes_ls);
	const tpreds = new Float32Array(tpreds_ls);
	const thresh = new Float32Array(thresh_ls);
	function classify_region(r, c, s, pixels, ldim)
	{
		 r = 256*r;
		 c = 256*c;
		 let root = 0;
		 let o = 0.0;
		 const pow2tdepth = Math.pow(2, tdepth) >> 0; // '>>0' transforms this number to int
		 for(let i=0; i<ntrees; ++i)
		 {
			let idx = 1;
			for(let j=0; j<tdepth; ++j)
				idx = 2*idx + (pixels[((r+tcodes[root + 4*idx + 0]*s) >> 8)*ldim+((c+tcodes[root + 4*idx + 1]*s) >> 8)]<=pixels[((r+tcodes[root + 4*idx + 2]*s) >> 8)*ldim+((c+tcodes[root + 4*idx + 3]*s) >> 8)]);
			 o = o + tpreds[pow2tdepth*i + idx-pow2tdepth];
			 if(o<=thresh[i])
				 return -1;
			 root += 4*pow2tdepth;
		}
		return o - thresh[ntrees-1];
	}
	return classify_region;
}
pico.run_cascade = function(image, classify_region, params)
{
	const pixels = image.pixels;
	const nrows = image.nrows;
	const ncols = image.ncols;
	const ldim = image.ldim;
	const shiftfactor = params.shiftfactor;
	const minsize = params.minsize;
	const maxsize = params.maxsize;
	const scalefactor = params.scalefactor;
	let scale = minsize;
	const detections = [];
	while(scale<=maxsize)
	{
		const step = Math.max(shiftfactor*scale, 1) >> 0; // '>>0' transforms this number to int
		const offset = (scale/2 + 1) >> 0;
		for(let r=offset; r<=nrows-offset; r+=step)
			for(let c=offset; c<=ncols-offset; c+=step)
			{
				const q = classify_region(r, c, scale, pixels, ldim);
				if (q > 0.0)
					detections.push([r, c, scale, q]);
			}
		scale = scale*scalefactor;
	}
    return detections;
}
pico.cluster_detections = function(dets, iouthreshold)
{
	dets = dets.sort(function(a, b) {
		return b[3] - a[3];
	});
	function calculate_iou(det1, det2)
	{
		const r1=det1[0], c1=det1[1], s1=det1[2];
		const r2=det2[0], c2=det2[1], s2=det2[2];
		const overr = Math.max(0, Math.min(r1+s1/2, r2+s2/2) - Math.max(r1-s1/2, r2-s2/2));
		const overc = Math.max(0, Math.min(c1+s1/2, c2+s2/2) - Math.max(c1-s1/2, c2-s2/2));
		return overr*overc/(s1*s1+s2*s2-overr*overc);
	}
	const assignments = new Array(dets.length).fill(0);
	const clusters = [];
	for(let i=0; i<dets.length; ++i)
	{
		if(assignments[i]==0)
		{
			let r=0.0, c=0.0, s=0.0, q=0.0, n=0;
			for(let j=i; j<dets.length; ++j)
				if(calculate_iou(dets[i], dets[j])>iouthreshold)
				{
					assignments[j] = 1;
					r = r + dets[j][0];
					c = c + dets[j][1];
					s = s + dets[j][2];
					q = q + dets[j][3];
					n = n + 1;
				}
			clusters.push([r/n, c/n, s/n, q]);
		}
	}
	return clusters;
}
pico.instantiate_detection_memory = function(size)
{
	let n = 0;
	const memory = [];
	for(let i=0; i<size; ++i)
		memory.push([]);
	function update_memory(dets)
	{
		memory[n] = dets;
		n = (n+1)%memory.length;
		dets = [];
		for(i=0; i<memory.length; ++i)
			dets = dets.concat(memory[i]);
		return dets;
	}
	return update_memory;
}

  let cascade = null, loading = null;
  const memo = new Map();
  function loadCascade() {
    if (cascade) return Promise.resolve(cascade);
    if (!loading) loading = fetch("/art/ui/facefinder").then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then(b => (cascade = pico.unpack_cascade(new Int8Array(b)))).catch(e => { console.warn("[face147] cascade", e); loading = null; return null; });
    return loading;
  }
  function keyOf(src) { return src.length > 300 ? src.length + ":" + src.slice(0, 120) + src.slice(-120) : src; }
  async function findFace(img) {
    const k = keyOf(img.currentSrc || img.src); if (memo.has(k)) return memo.get(k);
    const cl = await loadCascade(); if (!cl) return null;
    let res = null;
    try {
      const W = img.naturalWidth, H = img.naturalHeight;
      for (const lim of [480, 800]) {
      const s = Math.min(1, lim / Math.max(W, H)), w = Math.max(1, Math.round(W * s)), h = Math.max(1, Math.round(H * s));
      const cv = document.createElement("canvas"); cv.width = w; cv.height = h; const cx = cv.getContext("2d");
      cx.fillStyle = "#000"; cx.fillRect(0, 0, w, h); cx.drawImage(img, 0, 0, w, h);
      const rgba = cx.getImageData(0, 0, w, h).data, g = new Uint8Array(w * h);
      for (let i = 0; i < w * h; i++) g[i] = (2 * rgba[i * 4] + 7 * rgba[i * 4 + 1] + rgba[i * 4 + 2]) / 10;
      let d = pico.run_cascade({ pixels: g, nrows: h, ncols: w, ldim: w }, cl, { shiftfactor: 0.1, minsize: Math.max(20, Math.round(Math.min(w, h) * 0.06)), maxsize: Math.round(Math.min(w, h) * 0.9), scalefactor: 1.1 });
      d = pico.cluster_detections(d, 0.2).filter(x => x[3] > 5).sort((a, b) => b[3] - a[3]);
      if (d.length) { res = { x: d[0][1] / w, y: d[0][0] / h, s: d[0][2] / w, W, H }; break; }
      if (s === 1) break;
      }
    } catch (e) { console.debug("[face147] detect", e); }
    memo.set(k, res); return res;
  }
  function frame(img, f) {
    const box = img.parentElement, D = box.clientWidth || 68;
    if (!f) {
      reset(img);
      const W0 = img.naturalWidth, H0 = img.naturalHeight;
      /* 没找到脸：竖长的全身立绘按「头在上方 13%」放大；其余靠上取景 */
      if (W0 && H0 / W0 >= 1.5) f = { x: 0.5, y: 0.13, s: 0.17, W: W0, H: H0 };
      else { img.style.objectPosition = "50% 12%"; return; }
    }
    const W = f.W, H = f.H, faceW = f.s * W;
    let k = Math.max(0.42 * D / faceW, D / Math.min(W, H));
    k = Math.min(k, 6 * D / Math.min(W, H));
    const dw = W * k, dh = H * k;
    let left = D / 2 - f.x * W * k, top = D * 0.46 - f.y * H * k;
    left = Math.min(0, Math.max(D - dw, left)); top = Math.min(0, Math.max(D - dh, top));
    Object.assign(img.style, { position: "absolute", width: dw + "px", height: dh + "px", left: left + "px", top: top + "px", maxWidth: "none", objectFit: "fill", borderRadius: "0", boxShadow: "none" });
  }
  /* 2026-11-13：排行榜（领奖台 / 列表 / 我的本命）的头像也统一按人脸居中；头像图后加载时（先显示字母占位图）自动换成真图再取景 */
  const SEL = ".ld101c img, .rkpod .av img, .rrow .av img, .rkbias .av img";
  function reset(img) { ["position", "width", "height", "left", "top", "maxWidth", "objectFit", "borderRadius", "boxShadow"].forEach(k => { img.style[k] = ""; }); }
  function prep(img) {
    if (img.dataset.f147) return; img.dataset.f147 = "1";
    const par = img.parentElement;
    if (par && par.classList.contains("av")) { par.style.position = "relative"; par.style.overflow = "hidden"; par.style.borderRadius = par.style.borderRadius || "50%"; }
    else { const box = document.createElement("span"); box.className = "f147"; img.parentNode.insertBefore(box, img); box.appendChild(img); }
    const go = () => { if (/^data:image\/jpeg/.test(img.src) && img.dataset.art) { const u = artSrc(img.dataset.art); if (u && !/^data:/.test(u)) { img.src = u; return; } } reset(img); findFace(img).then(f => frame(img, f)).catch(() => frame(img, null)); };
    img.style.objectPosition = "50% 12%";
    img.addEventListener("load", go);
    if (img.complete && img.naturalWidth) go();
  }
  function scan(root) { try { (root || document).querySelectorAll(SEL.split(",").map(x => x.trim() + ":not([data-f147])").join(",")).forEach(prep); } catch (_) {} }
  try { new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1 && (n.matches && n.matches(SEL) || n.querySelector && n.querySelector(SEL))) { scan(n.nodeType === 1 && n.parentNode ? n.parentNode : document); return; } }).observe(document.body, { childList: true, subtree: true }); } catch (_) {}
  /* 字母占位图 → 真图：剧目 / 男主卡是后加载的，先渲染出来的头像会停在占位图上 */
  setInterval(() => { try { document.querySelectorAll('img[data-art]').forEach(im => { if (/^data:image\/jpeg/.test(im.src)) { const u = artSrc(im.dataset.art); if (u && !/^data:/.test(u) && im.src !== u) im.src = u; } }); } catch (_) {} }, 1500);
  setTimeout(scan, 500);
  const st = document.createElement("style");
  st.textContent = ".ld101c .f147{position:relative;display:block;width:68px;height:68px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 2px #F0B77E88;background:rgba(255,255,255,.04);flex:none}.ld101c .f147>img{width:68px;height:68px;box-shadow:none!important;border-radius:0!important}";
  document.head.appendChild(st);
})();

/* ===== 2026-11-13 · 章末选择融进剧情（所有剧本统一）=====
   玩家：「这种选择回复很多余，直接融合在剧本里」。选项本身决定分支和结局，不能删 ⇒ 换成剧情里的样子：
   1 · 章末选择不再是一块单独的「A/B/C 面板」，而是「🎭 轮到你了 + 问题」+ 几句你可以直接说出口的台词（点了 = 你说了这句）。
   2 · 轮到选择时，下面的 AI 联想先收起来，不和剧本选项抢位置。
   3 · 关系数值默认收起，只留一个小按钮「💗 关系」，点开再看（数值变化时仍会飘提示）。
   4 · 输入框不再熄灭：自己打字也算数 —— AI 判断你这句最接近哪个选项，按那条分支走，你的原话保留在对话里。
   5 · 改在通用框架里，所有剧本一起生效。 */
(function () {
  "use strict";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const T = (a, b) => (zh() ? a : b);
  const isChoose = th => { try { if (!th || !th.pk || th.pk.stop || th.pk.st !== "choose") return false; const c = (wd(th.wid).pack.chapters || [])[th.pk.ch - 1]; return !!(c && c.choices && c.choices.length && !pkAdvanceOnly(c)); } catch (_) { return false; } };
  const chapOf = th => wd(th.wid).pack.chapters[th.pk.ch - 1];
  const OPEN = { stats: false };

  /* ---------- 1 + 3 · 面板 ---------- */
  if (typeof packPanel === "function") {
    const panel = packPanel;
    packPanel = function (th) {
      const h = panel.apply(this, arguments);
      try {
        if (!isChoose(th) || th.pk.min) return h;
        const i = h.indexOf('<div class="pkpanel'), extra = i > 0 ? h.slice(0, i) : "";
        const c = chapOf(th), n = th.pk.ch, w = wd(th.wid), need = n === PCN(w) ? Math.max(0, EN(th) - aCount(th)) : 0;
        let you = ""; try { const me = typeof playerName === "function" ? playerName(th) : ""; if (me) you = T(" · 你是 ", " · as ") + esc(me); } catch (_) {}
        const opts = c.choices.map(x => {
          const lock = x.k === "A" && need > 0;
          return '<button class="ch148o' + (lock ? " lk" : "") + '" data-pkpick="' + x.k + '"><span>' + esc(Lz(x.t)) + '</span>' + (lock ? '<small>🔒 ' + t("pk.needA", { n: EN(th), h: aCount(th) }) + '</small>' : '') + '</button>';
        }).join("");
        const stats = extra ? '<div class="st148' + (OPEN.stats ? " open" : "") + '"><button class="st148b" data-st148="1">💗 ' + T("关系", "Relationships") + (OPEN.stats ? " ▴" : " ▾") + '</button><div class="st148c">' + extra + '</div></div>' : "";
        return '<div class="pkpanel ch148"><div class="ch148h"><span class="ch148who">🎭 ' + T("轮到你了", "Your turn") + you + '</span><b>' + esc(Lz(c.ask)) + '</b>' + stats + '</div>' +
          '<div class="ch148l">' + opts + '</div><p class="ch148t">' + T("或者直接打字，说你自己的话", "Or just type your own line") + '</p></div>';
      } catch (e) { console.warn("[ch148] panel", e); return h; }
    };
  }
  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest("[data-st148]"); if (!b) return;
    e.preventDefault(); e.stopPropagation(); OPEN.stats = !OPEN.stats;
    const box = b.closest(".st148"); if (box) { box.classList.toggle("open", OPEN.stats); b.textContent = "💗 " + T("关系", "Relationships") + (OPEN.stats ? " ▴" : " ▾"); }
  }, true);

  /* ---------- 4 · 输入框不熄灭；打字 = 选最接近的那条 ---------- */
  if (typeof pkBusy === "function") { const pb = pkBusy; pkBusy = function (th) { if (isChoose(th)) return false; return pb.apply(this, arguments); }; }
  function guess(txt, choices) {
    const a = new Set(String(txt).replace(/\s/g, "")); let best = choices[0].k, bs = -1;
    choices.forEach(x => { const s = String(Lz(x.t)); let n = 0; new Set(s.replace(/\s/g, "")).forEach(ch => { if (a.has(ch)) n++; }); const sc = n / Math.max(4, s.length); if (sc > bs) { bs = sc; best = x.k; } });
    return best;
  }
  let mapping = false;
  async function mapAndPick(th, txt, mode) {
    if (mapping) return; mapping = true;
    try {
      const c = chapOf(th), list = c.choices.map(x => x.k + "｜" + Lz(x.t)).join("\n");
      try { appendMsg(th, { who: "me", k: mode || "say", txt, typed: true, at: Date.now() }); } catch (_) {}
      const ta = document.getElementById("cin"); if (ta) ta.value = "";
      try { typing(true); } catch (_) {}
      let k = null;
      try {
        const r = await ask("玩家在互动剧的一个选择点上，没有点选项，而是自己说了一句话。判断这句话的意图最接近哪个选项。\n问题：" + Lz(c.ask) + "\n选项：\n" + list + "\n玩家说：「" + txt + "」\n只回 JSON：{\"k\":\"选项字母\"}", { maxTokens: 40, modelTier: "default", timeout: 12000 });
        k = r && typeof r.k === "string" ? r.k.trim().toUpperCase().slice(0, 1) : null;
      } catch (_) {}
      try { typing(false); } catch (_) {}
      if (!k || !c.choices.some(x => x.k === k)) k = guess(txt, c.choices);
      const n = th.pk.ch, w = wd(th.wid);
      if (n === PCN(w) && k === "A" && aCount(th) < EN(th)) { const o = c.choices.find(x => x.k !== "A"); if (o) k = o.k; }
      if (curT === th.id && isChoose(th)) packPick(k);
    } catch (e) { console.warn("[ch148] map", e); }
    finally { mapping = false; }
  }
  if (typeof doSend === "function") {
    const ds = doSend;
    doSend = function (txt, mode) {
      const th = S.threads[curT];
      try {
        const s = String(txt || "").trim();
        if (s && isChoose(th) && th.pk.as !== "watch") { mapAndPick(th, s, mode); return; }
      } catch (e) { console.warn("[ch148] send", e); }
      return ds.apply(this, arguments);
    };
  }

  /* ---------- 2 · 选择时收起 AI 联想 ---------- */
  function mark() { try { const chat = document.getElementById("s-chat"); if (chat) chat.classList.toggle("chs148", isChoose(S.threads[curT])); } catch (_) {} }
  if (typeof packRefresh === "function") { const pr = packRefresh; packRefresh = function () { const r = pr.apply(this, arguments); mark(); return r; }; }
  if (typeof renderChat === "function") { const rc = renderChat; renderChat = function () { const r = rc.apply(this, arguments); mark(); return r; }; }
  setInterval(mark, 1200);

  const st = document.createElement("style");
  st.textContent =
    ".chs148 #sugg{display:none!important}" +
    ".pkpanel.ch148{padding:12px 12px 8px}" +
    ".ch148h{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;margin:0 2px 10px;font-size:14px;line-height:1.4}" +
    ".ch148who{flex:none;font-size:11px;font-weight:800;padding:3px 9px;border-radius:999px;background:linear-gradient(135deg,#F0B77E,#EE6F97);color:#1B1017}" +
    ".ch148h>b{flex:1 1 auto;min-width:0}" +
    ".ch148l{display:flex;flex-direction:column;align-items:flex-end;gap:8px}" +
    ".ch148o{max-width:88%;text-align:left;border:1px solid rgba(238,111,151,.45);background:rgba(120,55,80,.55);color:#fff;border-radius:18px 18px 6px 18px;padding:10px 14px;font-size:14.5px;line-height:1.45;cursor:pointer}" +
    ".ch148o:active{transform:scale(.98)}.ch148o.lk{opacity:.55}.ch148o small{display:block;font-size:11px;color:#F0B77E;margin-top:3px}" +
    ".ch148t{margin:8px 2px 0;font-size:11.5px;color:rgba(255,255,255,.55);text-align:right}" +
    ".st148{flex:none}.st148b{border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#F6D3AE;border-radius:999px;padding:3px 10px;font-size:11.5px;cursor:pointer}" +
    ".st148 .st148c{display:none}.st148.open{flex-basis:100%}.st148.open .st148c{display:block;margin-top:8px}";
  document.head.appendChild(st);
})();

/* ===== 2026-11-13 · 剧情中途的选择也统一成「轮到你了 + 台词」=====
   玩家截图：输入框上面一排「↻ 换一批｜问但丁｜设定界限｜自主行动｜台词…」，不知道是什么。
   那是剧本中途的选择（原来被压成一排只剩短标签的小气泡，问题本身被藏起来），再加上 AI 联想混在同一排。
   ⇒ 和章末选择一样：显示「🎭 轮到你了 + 问题」，剧本选项按你会说出口的台词竖着排（靠右的气泡），
      这时不显示 AI 联想（面板里的和下面联想行都收起），底下一行小字「或者直接打字」。 */
(function () {
  "use strict";
  const P = "#s-chat #pkwrap.dock .pkpanel.stop:has(.chatt)";
  const st = document.createElement("style");
  st.textContent =
    P + "{display:block!important;overflow:visible!important;padding:2px 2px 0!important}" +
    P + ">.dk97h{display:flex!important;margin:0 2px 10px!important}" +
    P + ">.pkhd," + P + ">.ai97h," + P + ">.ai97o," + P + ">.dk97row," + P + ">.pkhint{display:none!important}" +
    P + ">.chatt{display:flex!important;flex-direction:column;align-items:flex-end;gap:8px}" +
    P + ">.chatt button{max-width:88%;text-align:left;white-space:normal!important;border:1px solid rgba(238,111,151,.45)!important;background:rgba(120,55,80,.55)!important;color:#fff!important;border-radius:18px 18px 6px 18px!important;padding:10px 14px!important;opacity:1!important;flex:none}" +
    P + ">.chatt button b," + P + ">.chatt .pvb{display:none!important}" +
    P + ">.chatt button span{font-size:14.5px!important;line-height:1.45!important}" +
    P + ">.chatt::after{content:\"或者直接打字，说你自己的话\";font-size:11.5px;color:rgba(255,255,255,.55);margin:2px 2px 4px}" +
    "#s-chat:has(#pkwrap.dock .pkpanel.stop .chatt) #sugg{display:none!important}";
  document.head.appendChild(st);
})();

/* ===== 2026-11-13 · 不再出现任何「选项」：玩家直接回复，系统按回复自动走分支 =====
   玩家（截图）：「所有的剧以后都不要有这个东西……直接根据回复，去设定它后面那个值就可以了。没有必要要有选择。」
   · 章末选择、剧情中途的选择：只显示「🎭 轮到你了 + 问题」，不再列出选项。玩家自己打字（或用 ✨ AI 帮我想）回复，
     AI 判断这句最接近剧本里哪一条分支，就按那条分支加减数值 / 设旗标 / 播后续剧情；对话里只留玩家自己的原话。
   · 「继续剧情」按钮多余：剧情暂停在「继续剧情」时自动接着播。（「进入下一章」不自动点，章末只留小字入口，由玩家决定什么时候走。）
   · 剧本里仍然可以写分支（作者 / GPT 照旧写 OPT），只是不再显示给玩家，变成「按回复判定」的隐藏分支。 */
(function () {
  "use strict";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const T = (a, b) => (zh() ? a : b);
  function guess(txt, opts) {
    const a = new Set(String(txt).replace(/\s/g, "")); let best = 0, bs = -1;
    opts.forEach((o, i) => { const s = String(Lz(o.t)); let n = 0; new Set(s.replace(/\s/g, "")).forEach(c => { if (a.has(c)) n++; }); const sc = n / Math.max(4, s.length); if (sc > bs) { bs = sc; best = i; } });
    return best;
  }
  async function classify(question, opts, txt) {
    const list = opts.map((o, i) => (i + 1) + "｜" + Lz(o.t)).join("\n");
    try {
      const r = await ask("玩家在互动剧的一个分支点上，用自己的话回复了一句。判断这句话的意图最接近哪个分支。\n情境：" + (question || "") + "\n分支：\n" + list + "\n玩家说：「" + txt + "」\n只回 JSON：{\"n\":分支编号}", { maxTokens: 40, modelTier: "default", timeout: 12000 });
      const n = r && Number(r.n); if (n >= 1 && n <= opts.length) return n - 1;
    } catch (_) {}
    return guess(txt, opts);
  }
  /* 剧情中途（stop line）：按回复判定分支，保留玩家原话 */
  let busyMap = false;
  async function resolveStop(th, txt, mode) {
    if (busyMap) return; busyMap = true;
    try {
      const d = th.pk.stop[2], opts = (d.opts || []).filter(o => o && o.t);
      appendMsg(th, { who: "me", k: mode || "say", txt, typed: true, at: Date.now() }); th.rounds++;
      const ta = document.getElementById("cin"); if (ta) ta.value = "";
      try { typing(true); } catch (_) {}
      const i = await classify(Lz(d.hint || d.q || ""), opts, txt);
      try { typing(false); } catch (_) {}
      const o = opts[i]; if (!o || !th.pk.stop) return;
      pkSet(th, o.set);
      try { if (typeof dimApply === "function") { const P = typeof dimPairs === "function" ? dimPairs(th) : null; if (o.rd) dimApply(th, o.rd, txt); else if (P) { const m = P.find(p => p.main) || P[0]; dimApply(th, { [m.a + "|" + m.b]: dimRule(o) }, txt); } } } catch (_) {}
      try { if (o.love) th.cast.filter(c => c !== th.pk.as).forEach(c => loveWrite(th, c, o.love, "choice:love")); } catch (_) {}
      stopResolve(th, o.then || []);
    } catch (e) { console.warn("[c150] stop", e); }
    finally { busyMap = false; }
  }
  if (typeof doSend === "function") {
    const ds = doSend;
    doSend = function (txt, mode) {
      const th = S.threads[curT];
      try {
        const s = String(txt || "").trim(), st = th && th.pk && th.pk.stop;
        if (s && st && st[1] === "line" && st[2] && (st[2].opts || []).length && !busy && (mode || cmode) !== "dir" && th.pk.as !== "watch") { resolveStop(th, s, mode); return; }
      } catch (e) { console.warn("[c150] send", e); }
      return ds.apply(this, arguments);
    };
  }
  /* 章末：判定后把「你的选择 · …」那条系统提示去掉，只留玩家原话 */
  if (typeof packPick === "function") {
    const pp = packPick;
    packPick = function (k) {
      const th = S.threads[curT], typed = th && th.msgs && th.msgs.length && th.msgs[th.msgs.length - 1].who === "me";
      const r = pp.apply(this, arguments);
      try { if (typed) { for (let i = th.msgs.length - 1; i >= Math.max(0, th.msgs.length - 4); i--) { const m = th.msgs[i]; if (m.who === "sys" && m.k === "dec") { th.msgs.splice(i, 1); break; } } save(); if (curT === th.id) renderChat(); } } catch (_) {}
      return r;
    };
  }
  /* 「继续剧情」自动接着播（下一章 / 解锁等需要你决定的按钮不动） */
  setInterval(() => {
    try {
      const th = S.threads[curT], chat = document.getElementById("s-chat"); if (!th || !th.pk || !chat || chat.hidden || busy) return;
      const b = chat.querySelector("#pkwrap [data-pkresume]"); /* 2026-11-13：「进入下一章」不再自动点（玩家：这一章还没玩完就跳了） */
      if (b && !b.disabled && !(window.READING && READING.pending.get(th.id))) b.click();
    } catch (_) {}
  }, 900);
  const st = document.createElement("style");
  st.textContent =
    ".ch148l{display:none!important}" +
    "#s-chat #pkwrap.dock .pkpanel.stop:has(.chatt)>.chatt>button{display:none!important}" +
    "#s-chat #pkwrap.dock .pkpanel.stop:has(.chatt)>.chatt::after{content:\"直接打字回复，你说的话会决定剧情往哪走\"!important}" +
    ".ch148t{font-size:0!important}.ch148t::after{content:\"直接打字回复，你说的话会决定剧情往哪走\";font-size:11.5px}" +
    "#s-chat.chs148 #sugg,#s-chat:has(#pkwrap .pkpanel.stop .chatt) #sugg{display:flex!important}";
  document.head.appendChild(st);
})();

/* ===== 2026-11-13 · 头像：剧里的角色没有单独头像时，用同一部剧的男主卡头像（名字对得上就用） ===== */
(function () {
  "use strict";
  const memo = new Map();
  function leadArt(id) {
    if (memo.has(id)) return memo.get(id);
    let out = null;
    try {
      const c = ch(id); if (!c) return null;
      const nm = first(c.n);
      const worlds = Object.values((S.mine && S.mine.worlds) || {}).filter(w => w && w.community && Array.isArray(w.cast) && w.cast.includes(id));
      for (const w of worlds) {
        const pre = "ld_" + String(w.community).slice(-8) + "_";
        for (const k of Object.keys(S.art || {})) if (k.indexOf(pre) === 0 && ch(k) && first(ch(k).n) === nm && typeof S.art[k] === "string") { out = S.art[k]; break; }
        if (out) break;
      }
    } catch (_) {}
    if (out) memo.set(id, out);
    return out;
  }
  if (typeof artSrc === "function") {
    const as = artSrc;
    artSrc = function (id) {
      const r = as.apply(this, arguments);
      try { if (typeof r === "string" && /^data:image\/jpeg/.test(r) && !(S.art && S.art[id])) { const u = leadArt(id); if (u) return u; } } catch (_) {}
      return r;
    };
  }
  /* 开场「男主」一排没有 data-art：按当前剧目 + 名字补真图 */
  setInterval(() => {
    try {
      const w = typeof curStory !== "undefined" ? wd(curStory) : null;
      document.querySelectorAll(".ld101c").forEach(box => {
        const im = box.querySelector("img"), nm = (box.querySelector("b") || {}).textContent; if (!im || !nm || !/^data:image\/jpeg/.test(im.src)) return;
        const ids = (w && w.cast) || []; const id = ids.find(x => ch(x) && first(ch(x).n) === nm);
        const u = id && artSrc(id); if (u && !/^data:/.test(u)) im.src = u;
      });
    } catch (_) {}
  }, 1500);
})();

/* ===== 2026-11-13 · 注销账号：原来用浏览器 confirm() 确认，部分手机浏览器会直接拦掉，点了没反应 ⇒ 改成页面里的确认框 ===== */
(function () {
  "use strict";
  window.addEventListener("click", async e => {
    const x = e.target.closest && e.target.closest('[data-au70card="del"],[data-del150]'); if (!x) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (x.dataset.del150 === "go") {
      x.disabled = true;
      try {
        const r = await capi("/auth", { json: { op: "delete" } });
        if (r.ok) { closeSheet(); toast(au("delDone")); try { localStorage.clear(); } catch (_) {} setTimeout(() => location.reload(), 900); }
        else { x.disabled = false; au70Err(r); }
      } catch (_) { x.disabled = false; toast(CL() === "zh" ? "注销没成功，稍后再试" : "Couldn't delete — try again later"); }
      return;
    }
    if (x.dataset.del150 === "no") { closeSheet(); return; }
    sheet('<div class="au70s"><h2>⚠️ ' + esc(au("del")) + '</h2><p style="margin:10px 0 16px;line-height:1.6">' + esc(au("delAsk")) + '</p><button class="btn btn-block" style="background:#c0392b;color:#fff" data-del150="go">' + esc(au("del")) + '</button><button class="btn btn-g btn-block" style="margin-top:8px" data-del150="no">' + (CL() === "zh" ? "取消" : "Cancel") + '</button></div>');
  }, true);
})();

/* ===== 2026-11-13 · 音色：男角色不会再分到女声 / 童声 =====
   原因：服务器的 m6 用的是 Qwen「Mochi」（童声，听起来像女生），所有分到 m6 的男角色（比如《女帝》的卢西恩）都受影响。
   ⇒ 服务器 m6 改成男声「Aiden」；这里给 m6 的音频地址换一个版本号，避免手机里缓存的旧童声；
      《女帝》里用旧 m6 预先生成的配音不再播放，改成实时生成；剧本里把男角色写成女声（f1/f2）的，自动换成男声，反之亦然。 */
(function () {
  "use strict";
  if (typeof ttsUrl === "function") { const tu = ttsUrl; ttsUrl = function () { const u = tu.apply(this, arguments); return /[?&]v=m6&/.test(u) ? u.replace("&k=q2", "&k=q3m6") : u; }; }
  if (typeof ttsVoice === "function") {
    const tv = ttsVoice;
    ttsVoice = function (id) {
      const v = tv.apply(this, arguments);
      try {
        if (!id || id === "n" || id === "me" || (S.voiceOv && S.voiceOv[id])) return v;
        const c = ch(id); if (!c || !/^[mf]\d$/.test(v)) return v;
        const g = c.g === "f" ? "f" : "m";
        if (v[0] !== g) { const L = TTS_VOICES[g]; return L[hash(String(id)) % L.length]; }
      } catch (_) {}
      return v;
    };
  }
  setTimeout(() => {
    if (typeof recorded !== "function") return;
    const rc = recorded;
    recorded = function (text, id) {
      const u = rc.apply(this, arguments);
      try { if (u && /m110-empress\/voice/.test(String(u)) && ttsVoice(id) === "m6") return undefined; } catch (_) {}
      return u;
    };
  }, 0);
})();

/* ===== 2026-11-13 · 剧情页去掉一切「大按钮」，数值变化 / 宫廷日常都在剧情里跳出来 =====
   玩家（女帝截图）：「这些东西放在这里太难看了，把它安排在剧情里面跳出来就好了呀……大选项以后全都不要了，继续剧情的也不要了。」
   · 「继续剧情 ›」「宫廷日常 · 二十位同伴」「翻牌 · 宫宴 · 册封 · 礼物 · 调解」、顶部「宫廷 · 帝国 · 线索」数值行：全部不再显示。
   · 下一章大按钮：不显示。本章播完、你也没在打字时自动进入下一章；需要解锁的章节只留一行小字入口。
   · 屏幕中间叠起来的「吸引 +1 / 信任 +1」大标签、「关系变化」横幅：改成剧情消息下面一行小字，几秒后淡出。
   · 女帝：每章结尾从「宫廷日常」里挑一件当下触发的小事，直接以旁白 + 角色台词出现在剧情里；你直接回他，
     系统按你的回复判定（接受 / 婉拒 …），照原规则加好感、记冷却，然后接着下一章。 */
(function () {
  "use strict";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const BTN = /<button[^>]*data-(?:reading-next|empress-hub|empress-games)="1"[^>]*>[\s\S]*?<\/button>/g;
  const STAT = /<div style="padding:8px;font-size:12px">[\s\S]*?<\/div>/;
  function wrapPanel() {
    if (typeof packPanel !== "function" || packPanel.__c151) return;
    const pp = packPanel;
    packPanel = function (th) {
      let h = pp.apply(this, arguments);
      try { if (typeof h === "string") h = h.replace(BTN, "").replace(STAT, ""); } catch (_) {}
      return h;
    };
    packPanel.__c151 = 1;
  }
  setTimeout(wrapPanel, 0); setTimeout(wrapPanel, 400);

  /* ---- 数值变化：剧情里一行小字 ---- */
  let line = null, lineT = 0, acc = {};
  function inlineFx(ch0) {
    const box = document.getElementById("msgs"); if (!box) return;
    if (!line || !line.isConnected || Date.now() - lineT > 1500) { acc = {}; line = document.createElement("div"); line.className = "fx151"; box.appendChild(line); }
    lineT = Date.now();
    ch0.forEach(([x, dd]) => { acc[x] = (acc[x] || 0) + dd; });
    line.innerHTML = Object.keys(acc).filter(x => acc[x]).map(x => {
      const f = (typeof DIMFX !== "undefined" && DIMFX[x]) || ["•", "#ccc"];
      return '<span style="--c:' + f[1] + '">' + f[0] + " " + esc(t("rd." + x)) + " " + (acc[x] > 0 ? "+" : "") + acc[x] + "</span>";
    }).join("");
    const me = line; clearTimeout(me._t); me.classList.remove("out");
    me._t = setTimeout(() => { me.classList.add("out"); setTimeout(() => me.remove(), 900); }, 5200);
    try { box.scrollTop = box.scrollHeight; } catch (_) {}
  }
  if (typeof dimFloat === "function") {
    const df = dimFloat;
    dimFloat = function (key, ch0) { const r = df.apply(this, arguments); try { if (ch0 && ch0.length) inlineFx(ch0); } catch (_) {} return r; };
  }

  /* ---- 女帝：章末的宫廷日常直接在剧情里发生 ---- */
  const EM = () => window.__empress147;
  function emOn(th) { try { return !!(EM() && EM().on(th)); } catch (_) { return false; } }
  function emSync(th) {
    try {
      const X = EM(), E = X.engine, s = X.state(th), f = th.pk.flags || (th.pk.flags = {}), I = window.EMPRESS_I18N147;
      for (const p of "ABCD") { f["empress_ready_" + p] = E.ready(s, p) ? 1 : 0; f["empress_path_" + p] = s.path === p ? 1 : 0; }
      f.empress_hidden = E.hidden(s) ? 1 : 0;
      const map = Object.fromEntries((th.cast || []).map(id => [I.actor(ch(id)) === "PLAYER" ? "你" : I.actor(ch(id)), id]));
      for (const [k, c] of Object.entries(s.characters)) if (map[k]) th.love[map[k]] = c.affection;
    } catch (e) { console.warn("[c151] sync", e); }
  }
  function castId(th, actor) { try { const I = window.EMPRESS_I18N147; return (th.cast || []).find(id => I.actor(ch(id)) === actor) || null; } catch (_) { return null; } }
  function popDaily(th) {
    try {
      const X = EM(), s = X.state(th), I = window.EMPRESS_I18N147;
      const ev = X.data.daily.filter(e => X.engine.eligible(s, e)).sort((a, b) => b.priority - a.priority)[0];
      th._ev151 = { ch: th.pk.ch, id: ev ? ev.id : null, done: !ev };
      if (!ev) return false;
      appendMsg(th, { who: "n", k: "act", txt: I.t(ev.narration), at: Date.now() });
      appendMsg(th, { who: castId(th, ev.actor) || "n", k: "say", txt: I.t(ev.dialogue), at: Date.now() });
      save(); if (curT === th.id) renderChat();
      return true;
    } catch (e) { console.warn("[c151] daily", e); th._ev151 = { ch: th.pk.ch, done: true }; return false; }
  }
  function guessIdx(txt, opts) {
    if (/不|改天|下次|算了|忙|先完成|独处|休息|走开|别/.test(txt)) return opts.length; /* 婉拒 */
    const a = new Set(String(txt).replace(/\s/g, "")); let best = 0, bs = -1;
    opts.forEach((o, i) => { let n = 0; new Set(String(o)).forEach(c => { if (a.has(c)) n++; }); if (n > bs) { bs = n; best = i; } });
    return best;
  }
  async function judgeDaily(th, txt) {
    const e0 = th._ev151; if (!e0 || e0.done || !e0.id) return; e0.done = true;
    try {
      const X = EM(), ev = X.data.daily.find(e => e.id === e0.id); if (!ev) return;
      const opts = ev.options.concat(["今天先独处 / 婉拒"]);
      let i = -1;
      try {
        const r = await ask("互动剧里发生了一件小事：" + ev.narration + "\n角色说：" + ev.dialogue + "\n玩家回复：「" + txt + "」\n这句回复最接近哪一项？\n" + opts.map((o, k) => (k + 1) + "｜" + o).join("\n") + "\n只回 JSON：{\"n\":编号}", { maxTokens: 40, modelTier: "default", timeout: 12000 });
        const n = r && Number(r.n); if (n >= 1 && n <= opts.length) i = n - 1;
      } catch (_) {}
      if (i < 0) i = guessIdx(txt, ev.options);
      const s = X.state(th);
      if (X.engine.daily(s, ev.id, i)) { emSync(th); save(); }
    } catch (err) { console.warn("[c151] judge", err); }
  }
  if (typeof doSend === "function") {
    const ds = doSend;
    doSend = function (txt) {
      try { const th = S.threads[curT]; if (th && th._ev151 && !th._ev151.done && String(txt || "").trim()) (th._ev151.game && window.__court152 ? window.__court152.judge(th, String(txt).trim()) : judgeDaily(th, String(txt).trim())); } catch (_) {}
      return ds.apply(this, arguments);
    };
  }

  /* ---- 下一章：自动进入（需要解锁的只留小字入口） ---- */
  let seenAt = 0, seenKey = "";
  setInterval(() => {
    try {
      const th = S.threads[curT], chat = document.getElementById("s-chat");
      if (!th || !th.pk || !chat || chat.hidden) { seenAt = 0; return; }
      const b = chat.querySelector("#pkwrap [data-pknext]");
      if (!b) { seenAt = 0; return; }
      const locked = /🔓/.test(b.textContent);
      if (locked) { if (!b.classList.contains("nx151l")) { b.classList.add("nx151l"); b.className = b.className.replace(/\bbtn(-p|-block)?\b/g, "").trim() + " nx151l"; } return; }
      b.classList.add("nx151");
      const key = th.id + ":" + th.pk.ch; if (key !== seenKey) { seenKey = key; seenAt = Date.now(); }
      if (busy || (window.READING && READING.pending.get(th.id))) { seenAt = Date.now(); return; }
      const ta = document.getElementById("cin"); if (ta && (ta.value.trim() || document.activeElement === ta)) { seenAt = Date.now(); return; }
      if (emOn(th) && (!th._ev151 || th._ev151.ch !== th.pk.ch)) { const g = window.__court152, even = (+th.pk.ch || 0) % 2 === 1; if (even && g ? (g.pop(th) || popDaily(th)) : (popDaily(th) || (g && g.pop(th)))) { seenAt = Date.now(); return; } }
      if (th._ev151 && th._ev151.ch === th.pk.ch && !th._ev151.done) { seenAt = Date.now(); return; } /* 等你回他 */
      /* 2026-11-13 玩家：「玩着玩着就下一章了，这一章还没玩完」⇒ 不再自动进下一章；章末只留一行小字「下一章 ›」，你想走了自己点。 */
    } catch (_) {}
  }, 700);

  const st = document.createElement("style");
  st.textContent =
    "#pkwrap [data-reading-next],#pkwrap [data-empress-hub],#pkwrap [data-empress-games]{display:none!important}" +
    "#pkwrap [data-pkadvance]," + "#pkwrap [data-pknext].nx151{display:block!important;margin:6px auto 2px;padding:4px 10px;background:none!important;border:0!important;box-shadow:none!important;color:var(--mut,#aaa)!important;font-size:12px!important;font-weight:400!important;text-decoration:underline;text-underline-offset:3px;width:auto!important;min-height:0!important}" +
    "#pkwrap [data-pknext].nx151l{display:block;margin:6px auto 2px;padding:4px 10px;background:none;border:0;color:var(--mut,#aaa);font-size:12px;text-decoration:underline;text-underline-offset:3px;width:auto}" +
    "#fxLayer .dimpop,#fxLayer .stgban{display:none!important}" +
    ".fx151{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:2px auto 8px;font-size:11.5px;opacity:0;animation:fx151 .5s ease forwards;transition:opacity .8s}" +
    ".fx151 span{color:var(--c);opacity:.9;letter-spacing:.02em}" +
    ".fx151.out{opacity:0!important}" +
    "@keyframes fx151{from{opacity:0;transform:translateY(4px)}to{opacity:.85;transform:none}}";
  document.head.appendChild(st);
})();

/* ===== 2026-11-13 · 女帝：翻牌 / 宫宴 / 册封 / 礼物 / 调解 也在剧情里发生；「宫廷 · 帝国 · 线索」放进关系页 =====
   玩家选定：小游戏「也融进剧情触发」，数值「放进人物关系页」。
   · 每章结尾轮流出现一件宫廷日常或一项宫廷安排（翻牌、宫宴座位、册封、礼物、调解），以旁白 + 角色台词出现在剧情里；
     不弹表单、不列选项。你直接打字回答（「今晚让卢西恩陪我」「把葡萄送给卡西安」「都不要，我想一个人」），
     系统读出你点到的人 / 礼物 / 方式，按原来小游戏的规则结算好感、信任、位分、醋意，并把结果写回剧情。
   · 点开「他们之间」关系页时，下面多一块「宫廷」：宫廷 / 帝国 / 线索 / 破咒路线，以及每位同伴的好感、信任、位分。 */
(function () {
  "use strict";
  const X = () => window.__empress147, I = () => window.EMPRESS_I18N147;
  const RANKS = ["候选", "美人", "侍君", "宠君", "贵君", "帝君"];
  const GIFTS = { fruit: "水果拼盘", flowers: "手扎花束", jewel: "珠宝饰物", perfume: "专属香水", song: "一首歌曲", date: "私人约会邀请" };
  const METHODS = { listen: "分别倾听双方", rules: "共同制定规则", together: "邀请共同活动" };
  const ORDER = ["GAME01", "GAME02", "GAME05", "GAME06", "GAME03"];
  function avail(th) {
    const s = X().state(th);
    return X().data.characters.filter(c => { const v = s.characters[c.id]; return v && v.alive_status === "ALIVE" && v.consent_flags.company !== false; });
  }
  const nm = id => { try { return I().name(id); } catch (_) { return id; } };
  function castId(th, actor) { try { return (th.cast || []).find(id => I().actor(ch(id)) === actor) || null; } catch (_) { return null; } }
  function top(th, list, k) { const s = X().state(th); return list.slice().sort((a, b) => (s.characters[b.id][k] || 0) - (s.characters[a.id][k] || 0)); }
  function prompt(th, kind) {
    const L = avail(th); if (!L.length) return null;
    const fav = top(th, L, "affection"), jea = top(th, L, "jealousy");
    if (kind === "GAME01") return { narr: "夜色落下，内侍捧来一托盘刻着名字的玉牌，静静等你翻开。", who: fav[0], line: "陛下，今夜……想让谁陪着？也可以谁都不召，留给自己。" };
    if (kind === "GAME02") return { narr: "宫宴将开，长桌两侧灯火通明，你左右两席还空着。", who: fav[0], line: "席位还空着。陛下想让谁坐在身边？献艺、赏月也可以点人。" };
    if (kind === "GAME05") return { narr: "礼物工坊送来了新鲜的葡萄、刚扎好的花束、珠宝、香水，还有乐师候着一首新曲。", who: fav[1] || fav[0], line: "听说陛下想亲手备一份礼物——要送给谁，送什么？" };
    if (kind === "GAME06") { if (jea.length < 2) return null; return { narr: nm(jea[0].id) + "和" + nm(jea[1].id) + "为了今天的座次又起了争执，两个人都看向你。", who: jea[0], pair: [jea[0].id, jea[1].id], line: "陛下，您来评评理。" }; }
    if (kind === "GAME03") { const c = fav.find(c => X().state(th).characters[c.id].rank < 6); if (!c) return null; return { narr: "礼官呈上册封名册，" + nm(c.id) + "的名字排在最前面。", who: null, line: "陛下，今日要为谁晋位吗？" }; }
    return null;
  }
  function pop(th) {
    try {
      if (!X() || !X().on(th)) return false;
      const s = X().state(th), n = (th._gi152 = ((th._gi152 || 0) + 1));
      for (let k = 0; k < ORDER.length; k++) {
        const kind = ORDER[(n + k) % ORDER.length], p = prompt(th, kind); if (!p) continue;
        th._ev151 = { ch: th.pk.ch, game: kind, pair: p.pair || null, done: false };
        appendMsg(th, { who: "n", k: "act", txt: I().t(p.narr), at: Date.now() });
        appendMsg(th, { who: (p.who && castId(th, p.who.id)) || "n", k: p.who ? "say" : "act", txt: I().t(p.line), at: Date.now() });
        save(); if (curT === th.id) renderChat();
        return true;
      }
    } catch (e) { console.warn("[court152] pop", e); }
    return false;
  }
  function mentioned(th, txt) {
    const out = []; const t = String(txt).toLowerCase();
    avail(th).forEach(c => { const names = [nm(c.id), c.name, c.id].filter(Boolean).map(x => String(x).toLowerCase()); const first = String(c.name || "").split(" ")[0].toLowerCase(); if (names.some(x => x && t.includes(x)) || (first.length > 2 && t.includes(first))) out.push(c.id); });
    return out;
  }
  const NO = /不用|不要|都不|谁都不|一个人|独处|算了|改天|不召|不了|不必|休息/;
  async function parse(th, kind, txt) {
    const L = avail(th).map(c => c.id + "=" + nm(c.id) + (c.name && c.name !== nm(c.id) ? "/" + c.name : "")).join("；");
    const spec = {
      GAME01: "{\"ids\":[最多3个同伴id，玩家明确不召人则为空数组],\"slot\":\"night或day\"}",
      GAME02: "{\"left\":\"id或空串\",\"right\":\"id或空串\",\"performer\":\"id或空串\",\"moonlight\":\"id或空串\"}",
      GAME05: "{\"target\":\"同伴id\",\"gift\":\"fruit|flowers|jewel|perfume|song|date\"}",
      GAME06: "{\"method\":\"listen|rules|together\"}",
      GAME03: "{\"target\":\"同伴id或空串\",\"award\":\"honor|palace|pass\"}"
    }[kind];
    try {
      const r = await ask("互动剧《女帝的绝色后宫》里的一项宫廷安排，玩家用自己的话回答了。把回答读成参数。\n同伴（id=名字）：" + L + "\n礼物：" + Object.entries(GIFTS).map(([k, v]) => k + "=" + v).join("，") + "\n调解方式：" + Object.entries(METHODS).map(([k, v]) => k + "=" + v).join("，") + "\n玩家说：「" + txt + "」\n玩家拒绝或回避时返回 {\"skip\":true}。只回 JSON：" + spec, { maxTokens: 120, modelTier: "default", timeout: 12000 });
      if (r && typeof r === "object") return r;
    } catch (_) {}
    if (NO.test(txt)) return { skip: true };
    const ids = mentioned(th, txt);
    if (kind === "GAME01") return { ids: ids.slice(0, 3), slot: /白天|日间|午|早/.test(txt) ? "day" : "night" };
    if (kind === "GAME02") return { left: ids[0] || "", right: ids[1] || "", performer: "", moonlight: "" };
    if (kind === "GAME05") { const g = Object.keys(GIFTS).find(k => [...GIFTS[k]].slice(0, 2).every(ch0 => txt.includes(ch0))) || (/葡萄|水果/.test(txt) ? "fruit" : /花/.test(txt) ? "flowers" : /珠|首饰|戒指/.test(txt) ? "jewel" : /香/.test(txt) ? "perfume" : /歌|曲/.test(txt) ? "song" : /约会|出去/.test(txt) ? "date" : "flowers"); return ids[0] ? { target: ids[0], gift: g } : { skip: true }; }
    if (kind === "GAME06") return { method: /规则|轮|约定/.test(txt) ? "rules" : /一起|共同|合作/.test(txt) ? "together" : "listen" };
    if (kind === "GAME03") return ids[0] ? { target: ids[0], award: "honor" } : { skip: true };
    return { skip: true };
  }
  async function judge(th, txt) {
    const ev = th._ev151; if (!ev || ev.done || !ev.game) return; ev.done = true;
    try {
      const kind = ev.game, r = await parse(th, kind, txt), s = X().state(th), ok = id => avail(th).some(c => c.id === id);
      if (!r || r.skip) return;
      let args;
      if (kind === "GAME01") args = { selected_ids: [...new Set((r.ids || []).filter(ok))].slice(0, 3), time_slot: r.slot === "day" ? "day" : "night" };
      if (kind === "GAME02") args = Object.fromEntries(["left", "right", "performer", "moonlight"].map(k => [k, ok(r[k]) ? r[k] : ""]));
      if (kind === "GAME05") { if (!ok(r.target)) return; args = { target: r.target, gift: GIFTS[r.gift] ? r.gift : "flowers" }; }
      if (kind === "GAME06") args = { participants: ev.pair, method: METHODS[r.method] ? r.method : "listen" };
      if (kind === "GAME03") { if (!ok(r.target)) return; args = { target: r.target, rank_to: s.characters[r.target].rank + 1, award_type: ["honor", "palace", "pass"].includes(r.award) ? r.award : "honor" }; }
      const res = X().engine.game(s, kind, args);
      if (!res || !res.ok) return;
      const rec = res.record, ids = rec.selected_ids || rec.participants || [rec.target_id || args.target].filter(Boolean);
      appendMsg(th, { who: "n", k: "act", txt: I().t(rec.action), at: Date.now() });
      ids.slice(0, 2).forEach(actor => { const cid = castId(th, actor), c = I().data().characters.find(c => c.id === actor); if (cid && c) appendMsg(th, { who: cid, k: "say", txt: c.voice, at: Date.now() }); });
      try { const f = th.pk.flags || (th.pk.flags = {}), E = X().engine; for (const p of "ABCD") { f["empress_ready_" + p] = E.ready(s, p) ? 1 : 0; f["empress_path_" + p] = s.path === p ? 1 : 0; } f.empress_hidden = E.hidden(s) ? 1 : 0; for (const [k, c] of Object.entries(s.characters)) { const cid = castId(th, k); if (cid) th.love[cid] = c.affection; } } catch (_) {}
      save(); if (curT === th.id) renderChat();
    } catch (e) { console.warn("[court152] judge", e); }
  }
  window.__court152 = { pop, judge };

  /* 关系页：宫廷数值 */
  function courtBlock(th) {
    const s = X().state(th), w = s.world || {};
    const rows = X().data.characters.filter(c => s.characters[c.id]).map(c => { const v = s.characters[c.id]; return '<div class="row" style="justify-content:space-between;gap:8px;padding:4px 0;border-top:1px solid rgba(255,255,255,.06)"><span>' + esc(nm(c.id)) + '</span><span class="xs dim">' + (v.alive_status === "ALIVE" ? "好感 " + v.affection + " · 信任 " + v.trust + " · " + (RANKS[(v.rank || 1) - 1] || "") : "灵魂仍困在王冠内") + "</span></div>"; }).join("");
    return '<div class="ct152" style="margin-top:14px"><div class="eyebrow" style="color:var(--gold)">宫廷</div><p class="sm">宫廷 ' + (w.court ?? "-") + " · 帝国 " + (w.empire_stability ?? "-") + " · 线索 " + ((s.clues || []).length) + (s.path ? " · 破咒 " + s.path : "") + (s.ending ? " · 结局 " + s.ending : "") + '</p><div class="sm">' + rows + "</div></div>";
  }
  if (typeof sheet === "function") {
    const sh = sheet;
    sheet = function (html) {
      try { const th = S.threads[curT]; if (typeof html === "string" && X() && X().on(th) && html.includes(t("rd.h"))) html = html + I().html(courtBlock(th)); } catch (_) {}
      return sh.apply(this, [html].concat([].slice.call(arguments, 1)));
    };
  }
})();

/* ===== 2026-11-13 · 「🌱 某某 变了 · 封闭 → 试探」不再一人一张卡片刷屏 =====
   玩家（女帝截图）：「这么多没必要显示出来啊。」—— 女帝有二十位同伴，一次宫廷安排就能让一排人同时换阶段，聊天里一下子冒出一长串卡片。
   ⇒ 阶段变化不再写成聊天卡片；同一时刻的变化合并成剧情消息下方一行小字（最多列 3 个名字，其余「等 N 人」），几秒后淡出。
     阶段本身照常记录（影响后续剧情和角色记忆），只是不再刷屏；旧存档里已经堆着的这类卡片也一并清掉。 */
(function () {
  "use strict";
  const RX = /^(🌱|🥀) .+ (变了|退回了一步|changed|pulled back)$/;
  const isArc = m => m && m.who === "sys" && m.k === "card" && RX.test(String(m.title || ""));
  let buf = [], tmr = 0;
  function flush() {
    tmr = 0; const items = buf; buf = []; if (!items.length) return;
    const box = document.getElementById("msgs"); if (!box) return;
    const zh = typeof CL !== "function" || CL() === "zh";
    const groups = {};
    items.forEach(m => { const name = String(m.title).replace(/^(🌱|🥀) /, "").replace(/ (变了|退回了一步|changed|pulled back)$/, ""), key = String(m.title).slice(0, 2) + "|" + String(m.txt || ""); (groups[key] = groups[key] || []).push(name); });
    const el = document.createElement("div"); el.className = "fx151";
    el.innerHTML = Object.entries(groups).map(([k, names]) => {
      const [icon, txt] = k.split("|"), shown = names.slice(0, 3).join(zh ? "、" : ", ") + (names.length > 3 ? (zh ? " 等 " + names.length + " 人" : " +" + (names.length - 3)) : "");
      return '<span style="--c:' + (icon.indexOf("🥀") === 0 ? "#9AA3B5" : "#8BE08F") + '">' + icon + " " + esc(shown) + (txt ? " · " + esc(txt) : "") + "</span>";
    }).join("");
    box.appendChild(el);
    setTimeout(() => { el.classList.add("out"); setTimeout(() => el.remove(), 900); }, 5200);
  }
  if (typeof appendMsg === "function") {
    const am = appendMsg;
    appendMsg = function (th, m) {
      try { if (isArc(m)) { if (th && curT === th.id) { buf.push(m); clearTimeout(tmr); tmr = setTimeout(flush, 400); } return; } } catch (_) {}
      return am.apply(this, arguments);
    };
  }
  function clean(th) {
    try { if (!th || !th.msgs || th._arc153) return; th._arc153 = 1; const n = th.msgs.length; th.msgs = th.msgs.filter(m => !isArc(m)); if (th.msgs.length !== n) save(); } catch (_) {}
  }
  if (typeof renderChat === "function") { const rc = renderChat; renderChat = function () { try { clean(S.threads[curT]); } catch (_) {} return rc.apply(this, arguments); }; }
})();

/* ===== 2026-11-13 · 电话 / 撤回消息：古代剧里没有；人就在你面前也没有 =====
   玩家（女帝截图「📞 卡西安 来电…」）：「古代没有电话；我人还在场，你就给我打电话。其他剧也有这种情况，统一写进规则。」
   · 世界是古代、宫廷、王朝、仙侠、武侠、中世纪 / 奇幻王国等没有电话的设定 ⇒ 来电卡、响铃、未接来电、剧本里的电话段一律不出现
     （剧本电话段改走它自己的「跳过」分支；作品如果确实有电话，可在世界数据里写 phones:true 放开）。
   · 剧情里打电话的人必须「不在场」：场景名单里有他、或者剧情没交代谁在场时，都当作人就在面前，不来电。
   · 普通一对一聊天（不在剧情场景里、隔着手机聊天）照旧可以来电。 */
(function () {
  "use strict";
  const OLD = /古代|古风|宫廷|宫斗|王朝|皇帝|皇后|女帝|帝王|朝堂|后宫|侯府|王府|公主|太子|仙侠|修仙|武侠|江湖|中世纪|骑士|王国|魔法学院|dynasty|emperor|empress|imperial court|kingdom|medieval|knight|regency|victorian|harem/i;
  const cache = new Map();
  function noPhones(th) {
    try {
      const w = th && th.wid && wd(th.wid); if (!w) return false;
      if (w.phones === true || (w.pack && w.pack.phones === true)) return false;
      if (w.phones === false || (w.pack && (w.pack.phones === false || w.pack.empress147))) return true;
      if (cache.has(th.wid)) return cache.get(th.wid);
      const txt = [w.title, w.hook, w.premise, w.era, w.setting, w.genre].map(x => { try { return typeof x === "string" ? x : x ? [x.zh, x.en].join(" ") : ""; } catch (_) { return ""; } }).join(" ") + " " + [].concat(w.tags || [], w.tabs || []).join(" ");
      const r = OLD.test(txt); cache.set(th.wid, r); return r;
    } catch (_) { return false; }
  }
  function present(th, cid) {
    try {
      if (!th || !th.pk) return false; /* 普通聊天：隔着手机，不算在场 */
      const c = wd(th.wid)?.pack?.chapters?.[th.pk.ch - 1];
      const p = th.present || th.status?.present || c?.present;
      return Array.isArray(p) ? p.includes(cid) : true;
    } catch (_) { return true; }
  }
  window.PHONE153 = { noPhones, present };
  if (typeof callCard === "function") {
    const cc = callCard;
    callCard = function (th, cid) { try { if (noPhones(th) || present(th, cid)) return; } catch (_) {} return cc.apply(this, arguments); };
  }
  if (typeof ringIn === "function") {
    const ri = ringIn;
    ringIn = function (th, cid) { try { if (noPhones(th) || present(th, cid)) return; } catch (_) {} return ri.apply(this, arguments); };
  }
  if (typeof mcCard === "function") {
    const mc = mcCard;
    mcCard = function (th) { try { if (noPhones(th)) return; } catch (_) {} return mc.apply(this, arguments); };
  }
  setTimeout(function () {
    try {
      if (window.EXPERIENCE124 && EXPERIENCE124.canCall && !EXPERIENCE124.canCall.__p153) {
        const can = EXPERIENCE124.canCall;
        EXPERIENCE124.canCall = function (th) { try { if (noPhones(th)) return false; } catch (_) {} return can.apply(this, arguments); };
        EXPERIENCE124.canCall.__p153 = 1;
      }
    } catch (_) {}
    if (typeof stopAuto === "function" && !stopAuto.__p153) {
      const sa = stopAuto;
      stopAuto = function (th, b) {
        try { if (b && ["call", "missed", "ring"].includes(b[1]) && noPhones(th)) return (b[2] && b[2].skip) || []; } catch (_) {}
        return sa.apply(this, arguments);
      };
      stopAuto.__p153 = 1;
    }
  }, 0);
  /* 「撤回了一条消息」同理：那是隔着手机聊天才有的事。剧情场景里人就在你面前（或古代剧），
     ⇒ 系统随机冒出来的「↩︎ 某某 撤回了一条消息 · 看看他写了什么 💎1」不再出现；
     ⇒ 剧本写的撤回段落改成当面的样子：「某某张了张口，又把话咽了回去。」 */
  if (typeof beatCardLater === "function") {
    const bl = beatCardLater;
    beatCardLater = function (th, card) { try { if (card && /^(del|call)\|/.test(String(card.act || "")) && (th.pk || noPhones(th))) return; } catch (_) {} return bl.apply(this, arguments); };
  }
  if (typeof appendMsg === "function") {
    const am = appendMsg;
    appendMsg = function (th, m) {
      try {
        if (m && m.k === "xrecall" && th && (noPhones(th) || present(th, m.rw))) {
          const c = ch(m.rw), zh = typeof CL !== "function" || CL() === "zh", nm = c ? first(c.n) : "";
          return am.call(this, th, { who: "n", k: "act", txt: zh ? nm + "张了张口，又把话咽了回去。" : nm + " starts to say something, then swallows it.", at: m.at || Date.now() });
        }
      } catch (_) {}
      return am.apply(this, arguments);
    };
  }
  /* 已经出现在存档里的「来电…」「撤回」卡片：剧情场景 / 古代剧里清掉 */
  if (typeof renderChat === "function") {
    const rc = renderChat;
    renderChat = function () {
      try { const th = S.threads[curT]; if (th && !th._ph153 && noPhones(th)) { th._ph153 = 1; const n = th.msgs.length; th.msgs = th.msgs.filter(m => !(m && ((m.k === "card" && /^call\|/.test(String(m.act || ""))) || m.k === "missed"))); if (n !== th.msgs.length) save(); }
        if (th && th.pk && !th._dl153) { th._dl153 = 1; const n2 = th.msgs.length; th.msgs = th.msgs.filter(m => !(m && m.k === "card" && /^(del|call)\|/.test(String(m.act || "")))); if (n2 !== th.msgs.length) save(); } } catch (_) {}
      return rc.apply(this, arguments);
    };
  }
})();

/* ===== 2026-11-13 · 群像剧：一句一句看，新的一句一定出现在眼前 =====
   玩家：「我说完话之后，一个一个人说，我还没看完就咣咣咣出了一大堆，得让我点一下再出下一个。」
   回复本来就是「点一下出下一句」，但如果聊天记录不在最底部（往上翻过、或上一句很长把视线顶走），新的一句出现在屏幕外，
   只剩「有新消息 ↓」，点屏幕也不会翻（在看历史时点屏幕不算「下一句」），看起来就像一下子冒出一大堆。
   ⇒ 每当有新的一句等你点，自动把它滚到眼前；你主动往上翻看历史时不打扰，回到底部后照旧一句一句来。 */
(function () {
  "use strict";
  if (!window.READING || typeof READING.wait !== "function") return;
  const w = READING.wait;
  READING.wait = function (th, message) {
    const r = w.apply(this, arguments);
    try {
      if (th && curT === th.id) setTimeout(() => {
        try {
          const m = document.getElementById("msgs"); if (!m) return;
          if (Date.now() - (m._scrolled124 || 0) < 4000) return; /* 你刚刚自己在翻 */
          m.scrollTop = m.scrollHeight;
          if (window.EXPERIENCE124 && EXPERIENCE124.positions) EXPERIENCE124.positions.set(th.id, { top: m.scrollTop, away: false, count: th.msgs.length });
          const b = document.querySelector("[data-latest124]"); if (b) b.hidden = true;
          m.classList.remove("reading-history124");
        } catch (_) {}
      }, 60);
    } catch (_) {}
    return r;
  };
})();

/* ===== 2026-11-13 · 去掉「当前是写好的台词——实时 AI 未连接（）· 测试实时 AI」横条 =====
   玩家（截图）：「实时 AI 都已经连接了，没必要还出现这句话。」—— 这是开发调试用的提示：S.live 标记没打上时就会显示，
   实际 AI 已经在回复（括号里是空的）。玩家不需要看到连接状态，⇒ 对玩家一律不显示。 */
(function () {
  const st = document.createElement("style");
  st.textContent = ".livebanner{display:none!important}";
  document.head.appendChild(st);
})();

/* ===== 2026-11-13 · 首页标签真正按类型分剧；没有剧的标签不显示 =====
   玩家（截图）：「标签根本没有用起来：点甜宠出来的不是甜宠，点奇幻出来的不是奇幻，都是全部。」
   原因：首页现在只放线上的官方新剧，它们是从服务器拉来后整批插进信息流的，没有按标签过滤；老的 36 部示例剧又都下架了，
   所以每个标签下面看到的都是同一批。
   ⇒ 每部官方剧按「标题 + 简介 + 服务器标签」自动归类（一部剧可以属于多个标签）；点某个标签只显示属于它的剧；
     一部都没有的标签先不显示，等有对应的剧再出现。「为你推荐」「热门」照旧显示全部。
   标签本身调整为：为你推荐 · 热门 · 甜宠 · 宫廷奇幻 · 群像 · 宿敌 · 虐恋暗黑 · 破镜重圆 · 慢热。 */
(function () {
  "use strict";
  const RX = {
    sweet: /甜宠|甜|宠|治愈|暖|日常|心动|sweet|fluff|cozy|comfort/i,
    fantasy: /奇幻|魔法|王冠|王子|公主|女帝|帝国|王国|宫廷|后宫|皇|龙|精灵|妖|吸血鬼|狼人|神明|仙|fantasy|magic|prince|princess|crown|kingdom|empress|emperor|throne|dragon|fae|vampire|werewolf/i,
    ensemble: /群像|后宫|八位|二十位|十二位|几位|众人|多位|兄弟们|harem|ensemble|eight|twenty/i,
    rivals: /宿敌|死对头|对手|敌人|仇|针锋相对|rival|enem|nemesis/i,
    dark: /暗黑|黑化|复仇|囚|禁忌|血|杀|阴谋|背叛|黑帮|诅咒|虐|dark|revenge|mafia|curse|obsess|betray/i,
    second: /破镜重圆|前任|重逢|复合|旧情|再续|second chance|\bex\b|reunion/i,
    slow: /慢热|暗恋|青梅|竹马|久别|一点点|渐渐|slow burn|pining|childhood/i
  };
  const TABS = [["foryou", "For You", "为你推荐"], ["hot", "Hot", "热门"], ["sweet", "Sweet", "甜宠"], ["fantasy", "Court & Fantasy", "宫廷奇幻"], ["ensemble", "Ensemble", "群像"], ["rivals", "Rivals", "宿敌"], ["dark", "Dark", "虐恋暗黑"], ["second", "Second Chance", "破镜重圆"], ["slow", "Slow Burn", "慢热"]];
  function txt(w) {
    const parts = [w.title, w.hook, w.en && w.en.title, w.en && w.en.hook, w.genre, w.premise];
    [].concat(w.tags || [], w.tabs || [], w.tropes || []).forEach(x => parts.push(typeof x === "string" ? x : x && (x.zh || x.en || x.name)));
    return parts.filter(Boolean).join(" ");
  }
  function tagsOf(w) {
    if (window.TAGS157 && TAGS157.MAP && w && TAGS157.MAP[w.id]) return TAGS157.MAP[w.id];
    if (w._tg157) return w._tg157;
    const s = txt(w), out = Object.keys(RX).filter(k => RX[k].test(s));
    return (w._tg157 = out);
  }
  window.TAGS157 = { tagsOf };
  const on = () => typeof feedTab !== "undefined" && !["foryou", "hot"].includes(feedTab);
  if (typeof off94FCard === "function") {
    const fc = off94FCard;
    off94FCard = function (w) { try { if (on() && !tagsOf(w).includes(feedTab)) return ""; } catch (_) {} return fc.apply(this, arguments); };
  }
  try { FEED_TABS.length = 0; TABS.forEach(([k, en, zh]) => FEED_TABS.push([k, T(en, zh)])); } catch (_) {}
  function tidy() {
    try {
      const L = (typeof OFFF94 !== "undefined" && OFFF94.list) || null;
      if (L && L.length) document.querySelectorAll("#ftabsc [data-ftab]").forEach(b => { const k = b.dataset.ftab; if (["foryou", "hot"].includes(k)) return; b.hidden = !L.some(w => tagsOf(w).includes(k)); });
      const feed = document.getElementById("feed");
      if (feed && on() && L) {
        /* 老的示例剧卡片（data-fw）和首页视频卡：分类标签下不显示 */
        feed.querySelectorAll(".fcard[data-fw]").forEach(c => c.remove());
        const sc = feed.querySelector(".home-showcase:not(.off94)"); if (sc) sc.remove();
        if (!feed.querySelector(".fcard") && !feed.querySelector(".empty157")) feed.insertAdjacentHTML("beforeend", '<p class="empty empty157" style="padding-top:120px;text-align:center">' + (CL() === "zh" ? "这个类型的剧还在路上" : "Stories for this tag are on the way") + "</p>");
      }
    } catch (_) {}
  }
  if (typeof renderHome === "function") {
    const rh = renderHome;
    renderHome = function () { const r = rh.apply(this, arguments); tidy(); setTimeout(tidy, 50); try { if (typeof off94Feed === "function") off94Feed().then(() => setTimeout(tidy, 30)); } catch (_) {} return r; };
  }
})();

/* ===== 2026-11-13 · 自动朗读改为付费（按实际成本 × 7） =====
   老板：「自动朗读肯定要付费，按实际成本的价格乘以七来收费。」
   成本：语音合成 qwen3-tts-flash（新加坡区）0.1 美元 / 1 万字 = 每字 0.00001 美元；× 7 = 每字 0.00007 美元。
   1 💎 按最便宜的大包价约 0.143 美元算 ⇒ 1 💎 ≈ 2000 字 ≈ 60 句台词。
   ⇒ 自动朗读每读满 2000 字扣 1 💎（先扣后读：额度用完时扣 1 💎 换 2000 字）；宝石不够时自动朗读关闭并提示。
     没有会员了，所有人一样按字数扣；单独点某一句的 🔊 仍免费（只读那一句）；剧里预先录好的配音不扣。 */
(function () {
  "use strict";
  const CHARS = 2000;
  let autoNext = false;
  if (typeof voiceAutoOK === "function") voiceAutoOK = function () { try { return (S.vcred157 || 0) > 0 || (S.keys || 0) >= 1; } catch (_) { return false; } };
  if (typeof voiceCount === "function") { const vc = voiceCount; voiceCount = function () { autoNext = true; return vc.apply(this, arguments); }; }
  function off() { try { S.autoVoice = false; S.voice = S.voice || {}; S.voice.auto = false; save(); toast(CL() === "zh" ? "宝石不够了，自动朗读已关闭" : "Out of 💎 — auto read-aloud is off"); } catch (_) {} }
  if (typeof speak === "function") {
    const sp = speak;
    speak = function (text, who) {
      const auto = autoNext; autoNext = false;
      try {
        if (auto && !(typeof recorded === "function" && recorded(text, who))) {
          const n = String(text || "").replace(/[*()（）\s]/g, "").length;
          if ((S.vcred157 || 0) < n) {
            if ((S.keys || 0) >= 1) { S.keys -= 1; S.vcred157 = (S.vcred157 || 0) + CHARS; save(); toast(CL() === "zh" ? "自动朗读 · 💎 1（约 60 句）· 剩 " + S.keys : "Read-aloud · 💎 1 (~60 lines) · " + S.keys + " left"); const k = document.querySelector(".topbar .chip.num"); if (k) k.textContent = "💎 " + S.keys + (S.plus ? " · MIRU+" : ""); }
            else { off(); return; }
          }
          S.vcred157 = Math.max(0, (S.vcred157 || 0) - n); save();
        }
      } catch (_) {}
      return sp.apply(this, arguments);
    };
  }
  try {
    Object.assign(I18N.zh, { "vp.left": "朗读额度（字）· 每 💎1 ≈ 2000 字 ≈ 60 句", "vp.note": "自动朗读按字数扣宝石：💎1 ≈ 60 句。单独点某一句的 🔊 免费。" });
    Object.assign(I18N.en, { "vp.left": "read-aloud credit (characters) · 💎1 ≈ 2000 chars ≈ 60 lines", "vp.note": "Auto read-aloud uses 💎 by length: 💎1 ≈ 60 lines. Tapping 🔊 on one line is free." });
    Object.assign(I18N.zh, { "u.what": "一个 AI 回合 = 你说一句话后角色们的一次回应——不管几个角色接话都只算一次。写好的剧情、重玩、你拥有的照片和记忆都不消耗回合。", "u.free": "回合用完也没关系：写好的剧情照常往下播，你的进度、照片和关系都原样保留。" });
    Object.assign(I18N.en, { "u.what": "An AI turn is one reply to what you say — however many characters answer. Written story scenes, replays, your photos and memories never use turns.", "u.free": "Out of turns? The written story keeps playing, and your progress, photos and relationships stay exactly where they are." });
  } catch (_) {}
  /* 语音面板里的大数字：显示剩余朗读字数，而不是「今日免费条数」 */
  if (typeof voicePlaySheet === "function") {
    const vs = voicePlaySheet;
    voicePlaySheet = function () { const r = vs.apply(this, arguments); try { const b = document.querySelector(".vpbig .num"); if (b) b.textContent = String(S.vcred157 || 0); } catch (_) {} return r; };
  }
})();

/* ===== 2026-11-13 · 「🎭 轮到你了 · 你是你 ＋ 问题 ＋ 直接打字回复…」这一条也不要了 =====
   玩家（截图）：「这一种在所有的剧本里面现在全都不要，就正常的自然对话就可以了。」
   ⇒ 剧情中途的分支点、章末的分支点都不再显示任何提示条；角色把话说到这里，你像平常聊天一样直接回，
     系统照旧按你的回复判定分支（见上面「不再出现任何选项」）。 */
(function () {
  const st = document.createElement("style");
  st.textContent = "#s-chat #pkwrap .pkpanel.stop:has(.chatt),#s-chat #pkwrap .pkpanel.ch148{display:none!important}";
  document.head.appendChild(st);
})();

/* 语音面板里「MIRU+ 无限畅听」的字样也不再出现（2026-11-13：没有会员了） */
try { Object.assign(I18N.zh, { "vp.unl": "", "vp.plus": "" }); Object.assign(I18N.en, { "vp.unl": "", "vp.plus": "" }); } catch (_) {}

/* ===== 2026-11-13 · 所有剧：点一下才出下一条（包括中间插进来的旁白、提示、卡片） =====
   玩家：「我回了一句之后，其他人一个一个说，我看完点一下再出下一个人；中间要显示什么其他的，也都等我点一下再显示。」
   角色台词本来就是一句一句等你点；但在等你点的时候，别的地方（旁白补充、关系变化、系统卡片等）插进来的消息会直接冒出来，
   看起来就是「咣咣咣」一下出一堆。
   ⇒ 只要还有一句在等你点，后来的任何消息（除了你自己说的话）都先排队，不显示；你点一下，才放出下一条，再等你点。
     你自己开口发言时，排队的消息一次性放出来，不会丢。 */
(function () {
  "use strict";
  const R = window.READING; if (!R || typeof appendMsg !== "function") return;
  const Q = th => th._q158 || (th._q158 = []);
  const readable = m => m && ((typeof m.txt === "string" && m.txt.trim()) || (typeof m.title === "string" && m.title.trim()));
  const am = appendMsg;
  appendMsg = function (th, m) {
    try {
      if (th && m && !m._q158 && m.who !== "me" && R.pending.get(th.id)) { Q(th).push(m); return; }
    } catch (_) {}
    return am.apply(this, arguments);
  };
  function release(th) {
    try {
      if (!th || R.pending.get(th.id)) return;
      const q = Q(th); let m;
      while ((m = q.shift())) {
        m._q158 = 1; m.at = Date.now(); am.call(window, th, m); try { if (window.__q159) __q159(m); } catch (_) {}
        if (readable(m) && curT === th.id) { R.wait(th, m, "script"); return; }
      }
    } catch (e) { console.warn("[q158] release", e); }
  }
  const w = R.wait;
  R.wait = function (th) { const p = w.apply(this, arguments); try { if (th) p.then(() => setTimeout(() => release(th), 0)); } catch (_) {} return p; };
  window.READQ158 = { release };
  /* 你自己开口：排队的全部放出（按顺序），再处理你的话 */
  function flushAll(th) { try { const q = Q(th); let m; while ((m = q.shift())) { m._q158 = 1; am.call(window, th, m); } } catch (_) {} }
  if (typeof doSend === "function") { const ds = doSend; doSend = function () { try { const th = S.threads[curT]; if (th && Q(th).length) flushAll(th); } catch (_) {} return ds.apply(this, arguments); }; }
  /* 重新打开聊天、或之前排着没放的：没有在等的那句时，放出下一条 */
  if (typeof renderChat === "function") { const rc = renderChat; renderChat = function () { const r = rc.apply(this, arguments); try { const th = S.threads[curT]; if (th && th._q158 && th._q158.length && !R.pending.get(th.id)) setTimeout(() => release(th), 0); } catch (_) {} return r; }; }
})();

/* ===== 2026-11-13 · 首页标签：线上 18 部官方剧逐部定好类型（自动归类只作新剧的兜底） =====
   自动按关键词归类时，几乎每部剧的服务器标签里都有「Slow Burn」「Why Choose」，结果「慢热」「群像」什么都装。
   ⇒ 已上线的剧按内容逐部指定 1–3 个类型；以后新上的剧先走关键词兜底，上线时再补进这张表。 */
(function () {
  "use strict";
  if (!window.TAGS157) return;
  const MAP = {
    w_scmwf1m5ey5dc969fdb4: ["sweet"],                          /* 我的亿万富翁丈夫只为我下跪 */
    w_scmwe0kqlf5a8ad0688e: ["fantasy", "ensemble"],            /* 女帝的绝色后宫 */
    w_scmwd8xkizb4af60b220: ["dark", "rivals"],                 /* 系统让我爱凶手 */
    w_scmwccn54rff49c6af5f: ["ensemble", "rivals"],             /* 全岛都在为你失控 */
    w_scmwc6dcvkf78af9d356: ["dark", "ensemble"],               /* 极寒重生：谁能进门 */
    w_scmwbo55bx3b4e35f1b7: ["dark", "second"],                 /* 我死过一次，他们都记得 */
    w_scmwaymue65be8983c9b: ["dark", "rivals"],                 /* 北灯未熄 */
    w_scmw9m1jz8453861ec49: ["fantasy", "ensemble", "dark"],    /* 第八誓约 */
    w_scmw9biwsq6dcfcceb84: ["ensemble", "dark"],               /* 谁是 S++ */
    w_scmw7tfsof0b2f96a20b: ["fantasy", "slow"],                /* 月蚀之誓 */
    w_scmw7f7e4565778126fa: ["fantasy", "rivals"],              /* 零点王冠 */
    w_scmw6aio565cb9b9e448: ["slow", "sweet"],                  /* 未读的选择 */
    w_scmw4qon3h5311d852bf: ["dark"],                           /* Black Harbor */
    w_scmw2calg4a57f5c1974: ["fantasy", "ensemble", "sweet"],   /* 八位王子都想娶我 */
    w_scmw0sxc5p5fa3b3d735: ["sweet", "ensemble"],              /* 今晚，偏爱失控 */
    w_scmvxxy1f444b18cd039: ["sweet", "slow"],                  /* 午夜邀约 */
    w_scmvxnqoko453e6d7bc3: ["dark"],                           /* 黑帮教父的唯一软肋 */
    w_scmvp62pluf3cc9d7c96: ["dark", "rivals"]                  /* 丝绒谎言 */
  };
  const auto = TAGS157.tagsOf;
  TAGS157.tagsOf = function (w) { return (w && MAP[w.id]) || auto.apply(this, arguments); };
  TAGS157.MAP = MAP;
})();

/* ===== 2026-11-14 · 「轮到你了 · 你是你 ＋ 问题」上一版没藏住，补上 =====
   玩家（截图）：「不是说这个以后都不要了，所有剧本都不要，怎么还有？」
   原因：剧情中途那块面板被另一条样式（底部停靠时）用更高优先级强制显示，盖过了「隐藏」那条。
   ⇒ 用更高优先级把整块停靠区藏掉：只要它是「等你回话」的分支点（中途或章末），整块都不显示，直接自然对话。 */
(function () {
  const st = document.createElement("style");
  st.textContent =
    "html body #s-chat #pkwrap#pkwrap:has(.pkpanel.stop .chatt)," +
    "html body #s-chat #pkwrap#pkwrap:has(.pkpanel.ch148)," +
    "html body #s-chat #pkwrap#pkwrap .pkpanel.stop.stop:has(.chatt)," +
    "html body #s-chat #pkwrap#pkwrap .pkpanel.ch148.ch148{display:none!important}";
  document.head.appendChild(st);
})();

/* ===== 2026-11-14 · 输入框上方的「✨ AI 帮我想」所有剧固定保留 =====
   玩家（截图）：「这个位置的 AI 帮我想，每个剧本都是固定版式要保留，怎么没有了？」
   原因：剧情分支点那块面板（现在已整块隐藏）里也带一个「AI 帮我想」，旧逻辑为了不重复，就把输入框上方这一个藏了；
   另外分支点出现时联想行本身也被设成不显示。面板藏掉以后，两边都没了。
   ⇒ 输入框上方这一行和「✨ AI 帮我想」永远显示（排第一个），不再因为分支点或别的面板而隐藏。 */
(function () {
  const st = document.createElement("style");
  st.textContent =
    "html body #s-chat #sugg{display:flex!important}" +
    "html body #s-chat.ch147 #sugg .ai147,html body #s-chat #sugg .ai147{display:inline-flex!important}";
  document.head.appendChild(st);
})();

/* ===== 2026-11-14 · 顶栏右上角的「⌄ / ⌃」收起箭头所有剧固定保留 =====
   玩家（女帝截图）：「这个地方不是有个箭头把东西收起来的吗，怎么也没有了？」
   原来箭头是插进顶栏「第一个 .row」里的；有的剧（女帝等）顶栏里还会多出别的 .row，箭头就被插到了看不见的地方，
   或者顶栏重画后没有再补上。
   ⇒ 箭头固定放在「有返回按钮的那一行」的最右边；顶栏任何时候被重画，都会自动补回来。 */
(function () {
  "use strict";
  function ensure() {
    try {
      const scr = document.getElementById("s-chat"); if (!scr || scr.hidden) return;
      if (typeof cleanOn === "function" && !cleanOn()) return;
      const back = scr.querySelector(".chead [data-back]"); const row = back && back.parentElement; if (!row) return;
      scr.querySelectorAll(".chead .hdx").forEach(b => { if (b.parentElement !== row) b.remove(); });
      let b = row.querySelector(".hdx");
      const open = typeof HD_OPEN !== "undefined" && HD_OPEN;
      if (!b) { row.insertAdjacentHTML("beforeend", '<button class="ibtn hdx" data-hdx="1" aria-label="more">' + (open ? "⌃" : "⌄") + "</button>"); }
      else if (row.lastElementChild !== b) row.appendChild(b);
    } catch (_) {}
  }
  if (typeof renderChat === "function") { const rc = renderChat; renderChat = function () { const r = rc.apply(this, arguments); ensure(); return r; }; }
  setInterval(ensure, 800);
  const st = document.createElement("style");
  st.textContent = "html body #s-chat .chead .hdx{display:grid!important;place-items:center;flex:none}";
  document.head.appendChild(st);
})();

/* ===== 2026-11-14 · 「实时 AI 未连接 · 测试实时 AI」横条：展开顶栏时还会冒出来，补上 =====
   顶栏展开（⌃）时，旧样式用更高优先级把它强制显示了。⇒ 用更高优先级彻底隐藏。 */
(function () {
  const st = document.createElement("style");
  st.textContent = "html body #s-chat.clean.hdopen>.livebanner,html body #s-chat>.livebanner,html body .livebanner{display:none!important}";
  document.head.appendChild(st);
})();

/* ===== 2026-11-14 · ①「✨ AI 帮我想」那一行真正固定显示 ② 台词没出来之前不先出声音 =====
   玩家（截图）：「AI 帮我想应该一直固定在这里；另外现在台词还没有出来，声音已经出来了。」
   ① 上一版的「固定显示」被另一条更高优先级的「分支点时隐藏联想行」盖过了 ⇒ 再提高优先级。
   ② 「点一下才出下一条」让排队中的台词先不显示，但朗读是在台词写入时就开始的，于是先听到声音、后看到字。
      ⇒ 台词还在排队时，它的朗读也一起排队；等你点一下、这句真正出现在屏幕上时才开始读。 */
(function () {
  "use strict";
  const st = document.createElement("style");
  st.textContent = "html body #s-chat#s-chat #sugg#sugg#sugg{display:flex!important}html body #s-chat#s-chat #sugg#sugg .ai147.ai147{display:inline-flex!important}";
  document.head.appendChild(st);
  if (typeof speak !== "function" || !window.READQ158) return;
  const sp = speak;
  speak = function (text, who) {
    try {
      const th = S.threads[curT], q = th && th._q158;
      if (q && q.length) {
        const m = q.find(x => x && !x._sp159 && x.who === who && String(x.txt || "").trim() === String(text || "").trim());
        if (m) { m._sp159 = [].slice.call(arguments); return; }
      }
    } catch (_) {}
    return sp.apply(this, arguments);
  };
  /* 放出排队的那句时，补上它的朗读 */
  window.__q159 = function (m) { if (m && m._sp159) { const a = m._sp159; delete m._sp159; setTimeout(() => { try { sp.apply(window, a); } catch (_) {} }, 30); } };
})();

/* ===== 2026-11-14 · 回复自动一句一句播：不用再手动点 =====
   玩家：「我打字后，对方还是得自动回复，现在是手动点一下，这个不行。自动出文字；如果多人，一句一句朗读——所有剧本都这样。」
   ⇒ 每一句出现后自动往下走，不用点：
      · 开了朗读：这一句读完，停顿约 0.5 秒，自动出下一句（下一句再读）——多人对话就是一人一句地轮流说；
      · 没开朗读：按这句的长度留出阅读时间（约 1.2～5 秒），自动出下一句；
      · 想快一点仍然可以点一下屏幕直接跳到下一句。中间插进来的旁白、提示也按同样节奏一条一条出。 */
(function () {
  "use strict";
  const R = window.READING; if (!R || typeof R.wait !== "function") return;
  const A = R.voice;
  const w = R.wait;
  R.wait = function (th, message) {
    const p = w.apply(this, arguments);
    try {
      const entry = th && R.pending.get(th.id);
      if (entry && !entry._auto160) {
        entry._auto160 = 1;
        const len = String((message && (message.txt || message.title)) || "").replace(/\s/g, "").length;
        const readMs = Math.max(1200, Math.min(5000, 700 + len * 70));
        const t0 = Date.now(); let quietSince = 0, spoke = false;
        const tick = setInterval(() => {
          try {
            if (R.pending.get(th.id) !== entry) { clearInterval(tick); return; }
            const busy = !!(A && A.busy && A.busy());
            if (busy) { spoke = true; quietSince = 0; return; }
            if (!quietSince) quietSince = Date.now();
            const waitMs = spoke ? 500 : (Date.now() - t0 < 600 ? 1e9 : readMs); /* 给朗读 0.6 秒启动时间 */
            if (!spoke && Date.now() - t0 >= 600 && Date.now() - t0 >= readMs) { clearInterval(tick); entry.finish(); return; }
            if (spoke && Date.now() - quietSince >= waitMs) { clearInterval(tick); entry.finish(); }
          } catch (_) { clearInterval(tick); }
        }, 200);
      }
    } catch (_) {}
    return p;
  };
  /* 自动播放时不再提示「轻点屏幕继续」 */
  const st = document.createElement("style");
  st.textContent = "#s-chat [data-tap-hint]:not(.voicing){display:none!important}";
  document.head.appendChild(st);
})();

/* ===== 2026-11-14 · 换场景 / 换章之前，先让你自由聊完 =====
   玩家（截图：刚回了阿德里安一句，剧情就直接跳到「📍客厅沙发 周五21:00」）：
   「我都还没有对话完，你就直接进入下一章；其他剧本也是。应该等我自由聊完，再进入下一章。」
   ⇒ 只要你在这一场里开过口，剧本走到「换场景」（📍新地点 / 新时间）之前就停下来：你想聊多久都行，角色照常接话；
     聊完了点输入框上方那行小字「下一场 ›」，剧情才往下走。你这一场一句都没说的话，剧情照旧自然往下播。
     （章末本来就只留一行小字「进入下一章 ›」，不会自动跳。） */
(function () {
  "use strict";
  if (typeof PKPAUSE === "undefined") return;
  const isScene = b => Array.isArray(b) && (b[1] === "scene" || (b[0] === "sys" && /^(scene|place|time|chapter)$/.test(String(b[1]))));
  const holds = {};
  if (typeof doSend === "function") {
    const ds = doSend;
    doSend = function () { try { const th = S.threads[curT]; if (th && th.pk && th.pk.q && th.pk.q.length) th._spoke161 = 1; } catch (_) {} return ds.apply(this, arguments); };
  }
  /* 写入一句剧本台词时就往后看：下一条（跳过不显示的指令）如果是换场景，立刻停住，不给剧本抢先播过去的机会 */
  function aheadScene(q) { for (const b of (q || []).slice(0, 8)) { if (isScene(b)) return true; if (Array.isArray(b) && b[0] !== "sys") return false; } return false; }
  if (typeof pkAppend === "function") {
    const pa = pkAppend;
    pkAppend = function (th) {
      const r = pa.apply(this, arguments);
      try { if (th && th.pk) { th._lines161 = (th._lines161 || 0) + 1; if (!holds[th.id] && aheadScene(th.pk.q)) { holds[th.id] = 1; PKPAUSE[th.id] = "scene161"; } } } catch (_) {}
      return r;
    };
  }
  function bar(th, on) {
    const chat = document.getElementById("s-chat"); if (!chat) return;
    let el = chat.querySelector(".nx161");
    if (!on) { if (el) el.remove(); return; }
    if (el) return;
    const zh = typeof CL !== "function" || CL() === "zh";
    const host = chat.querySelector("#sugg") || chat.querySelector(".composer"); if (!host) return;
    host.insertAdjacentHTML("beforebegin", '<div class="nx161"><span>' + (zh ? "想聊多久都行，聊完了点这里 → " : "Talk as long as you like, then → ") + '</span><button data-nx161="1">' + (zh ? "下一场 ›" : "Next scene ›") + "</button></div>");
  }
  setInterval(() => {
    try {
      const th = S.threads[curT];
      Object.keys(holds).forEach(id => { if (holds[id]) PKPAUSE[id] = PKPAUSE[id] || "scene161"; });
      if (!th || !th.pk) { bar(null, false); return; }
      const q = th.pk.q, next = q && q[0];
      if (holds[th.id]) { bar(th, true); return; }
      if (next && aheadScene(q) && (th._lines161 || 0) > 0 && !th.pk.stop) { holds[th.id] = 1; PKPAUSE[th.id] = "scene161"; bar(th, true); return; }
      if (next && isScene(next) && !(th._lines161 || 0)) return;
      bar(th, false);
    } catch (_) {}
  }, 250);
  document.addEventListener("click", e => {
    if (!e.target.closest || !e.target.closest("[data-nx161]")) return;
    e.preventDefault(); e.stopPropagation();
    const th = S.threads[curT]; if (!th) return;
    delete holds[th.id]; th._spoke161 = 0; th._lines161 = 0; if (PKPAUSE[th.id] === "scene161") delete PKPAUSE[th.id]; bar(th, false); save();
  }, true);
  const st = document.createElement("style");
  st.textContent = ".nx161{display:flex;justify-content:flex-end;align-items:center;gap:6px;margin:0 14px 6px;font-size:12px;color:var(--mut,#aaa)}" +
    ".nx161 button{background:none;border:0;color:#F6D3AE;font-size:12.5px;text-decoration:underline;text-underline-offset:3px;padding:2px 4px;cursor:pointer}";
  document.head.appendChild(st);
})();

/* 2026-11-14 补：玩家试了说「我还没开始说，就直接切到餐厅了」——上一版只在「你这一场开过口」时才停。
   ⇒ 改成：每一场只要已经演了内容，换下一场之前一律停下等你（你说不说话都停），点「下一场 ›」才切；
     章节一开头直接就是场景卡的那种不停。 */
