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
    if (SHOW_ALL) h += '<p class="v146t">' + T("全部角色", "All characters") + '</p>' + rest.map(row).join("");
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
    if (d.v146all) { SHOW_ALL = true; refresh(); return; }
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
    if (busy) { toast(T("等他们说完这句，再帮你想", "Wait for them to finish, then try again")); return; }
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
  function prep(img) {
    if (img.dataset.f147) return; img.dataset.f147 = "1";
    const box = document.createElement("span"); box.className = "f147";
    img.parentNode.insertBefore(box, img); box.appendChild(img);
    const go = () => { findFace(img).then(f => frame(img, f)).catch(() => frame(img, null)); };
    img.style.objectPosition = "50% 12%";
    if (img.complete && img.naturalWidth) go(); else img.addEventListener("load", go, { once: true });
  }
  function scan(root) { try { (root || document).querySelectorAll(".ld101c img:not([data-f147])").forEach(prep); } catch (_) {} }
  try { new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1 && (n.matches && n.matches(".ld101c img") || n.querySelector && n.querySelector(".ld101c img"))) { scan(n.nodeType === 1 && n.parentNode ? n.parentNode : document); return; } }).observe(document.body, { childList: true, subtree: true }); } catch (_) {}
  setTimeout(scan, 500);
  const st = document.createElement("style");
  st.textContent = ".ld101c .f147{position:relative;display:block;width:68px;height:68px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 2px #F0B77E88;background:rgba(255,255,255,.04);flex:none}.ld101c .f147>img{width:68px;height:68px;box-shadow:none!important;border-radius:0!important}";
  document.head.appendChild(st);
})();
