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
    ["🎤", "偶像与娱乐圈", "Idols & Showbiz", ["K-pop", "Idols", "Idol", "Showbiz", "K-pop偶像", "韩国娱乐圈", "娱乐圈", "偶像", "男团", "女团", "顶流"]],
    ["✨", "二次元", "Anime & 2D", ["Anime", "2D", "Manga", "Isekai", "二次元", "动漫", "番剧", "漫画", "异世界"]],
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
    // SPP supporting cast uses transparent full-body art with different head heights.
    // Frame the existing faces in avatar UI; keep the full illustration unchanged.
    const url = img.currentSrc || img.src || "", W0 = img.naturalWidth, H0 = img.naturalHeight;
    if (W0 && H0 && /char_(?:desmond|berthe)__default\.png(?:[?#]|$)/.test(url)) return {x:0.51,y:url.includes('char_berthe__')?0.238:0.147,s:0.19,fill:0.72,W:W0,H:H0};
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
    let k = Math.max((f.fill || 0.42) * D / faceW, D / Math.min(W, H));
    k = Math.min(k, 6 * D / Math.min(W, H));
    const dw = W * k, dh = H * k;
    let left = D / 2 - f.x * W * k, top = D * 0.46 - f.y * H * k;
    left = Math.min(0, Math.max(D - dw, left)); top = Math.min(0, Math.max(D - dh, top));
    Object.assign(img.style, { position: "absolute", width: dw + "px", height: dh + "px", left: left + "px", top: top + "px", maxWidth: "none", maxHeight: "none", objectFit: "fill", borderRadius: "0", boxShadow: "none" });
  }
  /* 2026-11-13：排行榜（领奖台 / 列表 / 我的本命）的头像也统一按人脸居中；头像图后加载时（先显示字母占位图）自动换成真图再取景 */
  const SEL = '.ld101c img, .rkpod .av img, .rrow .av img, .rkbias .av img, .av img[data-art="b98_6dcfcceb84_c19"], .av img[data-art="b98_6dcfcceb84_c20"], .av img[src*="/svf-v4/characters/"],.av img[src*="/only-me-v2/characters/"]';
  function reset(img) { ["position", "width", "height", "left", "top", "maxWidth", "maxHeight", "objectFit", "borderRadius", "boxShadow"].forEach(k => { img.style[k] = ""; }); }
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
        const r = await ask("玩家在互动剧的一个选择点上，用自己的话说了一句。判断这句话是否明确表达了某个选项的意思。\n问题：" + Lz(c.ask) + "\n选项：\n" + list + "\n玩家说：「" + txt + "」\n规则：只有玩家这句话的意思和某个选项明显一致时才选它；如果说的是别的事、提了别的要求、或者看不出选了哪条，一律回 0。宁可回 0，也不要硬套。\n只回 JSON：{\"k\":\"选项字母或0\"}", { maxTokens: 40, modelTier: "default", timeout: 12000 });
        k = r && typeof r.k === "string" ? r.k.trim().toUpperCase().slice(0, 1) : null;
      } catch (_) {}
      try { typing(false); } catch (_) {}
      /* 对不上任何选项：当自由聊天，角色正常接你的话，选择点继续等你（不再硬套最像的一条） */
      if (!k || !c.choices.some(x => x.k === k)) { if (typeof reply === "function") { try { await reply(th, { kind: "user", txt, mode: mode || "say" }); } catch (e) { console.warn("[ch148] free", e); } } return; }
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
      /* 2026-11-14 玩家：「我说吃河粉，怎么就变成『告诉他今天很棒』了？」——以前不管说什么都硬塞进最像的一条分支。
         ⇒ 只有意思真的对得上某条分支才算；对不上（聊别的、提要求、随口一句）就当自由聊天：角色正常接你的话，分支点继续等。 */
      const r = await ask("玩家在互动剧的一个分支点上，用自己的话回复了一句。判断这句话是否明确表达了某个分支的意思。\n情境：" + (question || "") + "\n分支：\n" + list + "\n玩家说：「" + txt + "」\n规则：只有玩家这句话的意思和某个分支明显一致时才选它；如果说的是别的事、提了别的要求、或者看不出选了哪条，一律回 0。宁可回 0，也不要硬套。\n只回 JSON：{\"n\":分支编号或0}", { maxTokens: 40, modelTier: "default", timeout: 12000 });
      const n = r && Number(r.n); if (n >= 1 && n <= opts.length) return n - 1;
    } catch (_) {}
    return -1;
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
      /* 只有一条（「轮到你说」那种）就不用判定：你说什么都接着往下走 */
      const i = opts.length <= 1 ? 0 : await classify(Lz(d.hint || d.q || ""), opts, txt);
      try { typing(false); } catch (_) {}
      if (i < 0) { if (th.pk && th.pk.stop && typeof reply === "function") { try { await reply(th, { kind: "user", txt, mode: mode || "say" }); } catch (e) { console.warn("[c150] free", e); } } return; }
      const o = opts[i]; if (!o || !th.pk.stop) return;
      pkSet(th, o.set);
      try { if (typeof dimApply === "function") { const P = typeof dimPairs === "function" ? dimPairs(th) : null; if (o.rd) dimApply(th, o.rd, txt); else if (P) { const m = P.find(p => p.main) || P[0]; dimApply(th, { [m.a + "|" + m.b]: dimRule(o) }, txt); } } } catch (_) {}
      try { if (o.love) th.cast.filter(c => c !== th.pk.as).forEach(c => loveWrite(th, c, o.love, "choice:love")); } catch (_) {}
      /* 2026-11-14 玩家：「答非所问」——剧本里这条分支预先写好的那句回应，和玩家实际说的话对不上。
         ⇒ 分支照样判定、数值照样加减、后面的剧情照样走；但紧跟着的那几句「角色预写回应」不再照念，
           改由角色针对你**实际说的话**现场回应，回完再接着播剧情。 */
      const then0 = (o.then || []).slice(); let k0 = 0;
      while (k0 < then0.length && Array.isArray(then0[k0]) && ch(then0[k0][0]) && ["say", "act", "think"].includes(then0[k0][1])) k0++;
      const rest = then0.slice(k0);
      const live = typeof reply === "function"; /* 这条分支没写角色回应时，也一定现场回应你，不能冷场 */
      /* 先让角色回应完你这句（剧本此时还停在这个分支点上，不会往下跑），再放后面的剧情 */
      if (live) { try { await reply(th, { kind: "user", txt, mode: mode || "say" }); } catch (e) { console.warn("[c150] live reply", e); } }
      if (th.pk && th.pk.stop) stopResolve(th, rest);
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
    "#s-chat.chs148 #sugg,#s-chat:has(#pkwrap .pkpanel.stop .chatt) #sugg{display:flex!important}" +
    /* 「你的选择 · A …」卡片不再显示：剧情按你的原话走，不需要告诉你被归到了哪一条 */
    "#s-chat .m-dec{display:none!important}";
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
      for (const [k, c] of Object.entries(s.characters)) if (map[k]) loveWrite(th, map[k], 0, "empress:sync", { absolute: c.affection });
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
      try { const f = th.pk.flags || (th.pk.flags = {}), E = X().engine; for (const p of "ABCD") { f["empress_ready_" + p] = E.ready(s, p) ? 1 : 0; f["empress_path_" + p] = s.path === p ? 1 : 0; } f.empress_hidden = E.hidden(s) ? 1 : 0; for (const [k, c] of Object.entries(s.characters)) { const cid = castId(th, k); if (cid) loveWrite(th, cid, 0, "empress:sync", { absolute: c.affection }); } } catch (_) {}
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

/* ===== 2026-11-21 · 回复自动一句一句播：计时器搬到 app157_reply_pace.js =====
   2026-11-14 这里曾按 `700ms + 70ms×字数`（封顶 5 秒）自动放行。玩家反馈「太快、太乱、来不及读」：
   台词中位数 17 字只给 1.9 秒（按 6 字/秒要 2.8 秒），旁白并块 200 字也只给 5 秒。
   ⇒ 计时逻辑、分页、并块上限、滚动与「慢速/标准/快速/点一下才走」都收进 app157，一处改、全剧生效。
   这里不再留第二套计时器（两套同时跑正是「忽快忽慢」的来源）。 */


/* ===== 2026-11-14 · 换场景必须等你点「下一场 ›」（所有剧本） =====
   玩家：「你每画一个场景，需要我确认点击你才能画下一个场景；现在背景图一直在换，我还没说话就切到餐厅了。」
   以前的做法是在剧本播放器外面拦（暂停开关、预判下一条），有好几条路能绕过去，所以还是会自己切场景。
   ⇒ 这次直接改剧本播放器本身：播到「换场景」这一条时，只要这一场已经演过内容，播放器就在这里原地等着，
     不处理这一条（背景图、📍场景卡都不动），直到你点输入框上方的「下一场 ›」。等的时候你想聊多久都行。
   另：角色回复是一句一句放出来的，以前「旁白补一段」那一步在台词还没放完时以为角色没回话，又整段重写了一遍（重复一大段）。
     ⇒ 还在排队等放出的角色台词，也算角色已经回过话。 */
(function () {
  "use strict";
  if (typeof packRun !== "function") return;
  /* 根子在这里：以前你每自由说一句，AI 回复时会从剧本队列里「拿走」后面两条当提示（包括换场景那条），
     所以场景会被吃掉、背景乱跳、分支点也会被跳过。⇒ 自由聊天不再动剧本队列；剧本只在你点「下一场 ›」后往下走。 */
  try { if (typeof MIRU_TUNE !== "undefined") { MIRU_TUNE.chat = MIRU_TUNE.chat || {}; MIRU_TUNE.chat.scriptAsHint = false; } } catch (_) {}
  const isScene = b => Array.isArray(b) && b[0] === "sys" && /^(scene|place|time)$/.test(String(b[1]));
  const sig = b => { try { return JSON.stringify(b).slice(0, 240); } catch (_) { return ""; } };
  const W = {};
  const SC = window.SC162 = {
    need(th, b) {
      if (!th || !th.pk || !isScene(b)) return false;
      if (th._pass162 && th._pass162 === sig(b)) { th._pass162 = null; th._ln162 = 0; th._held162 = 0; return false; }
      if (!(th._ln162 > 0)) return false;
      return true;
    },
    wait(th) {
      th._held162 = 1; try { save(); } catch (_) {}
      return new Promise(r => { (W[th.id] = W[th.id] || []).push(r); });
    },
    release(th) {
      if (!th) return;
      const q = th.pk && th.pk.q, b = q && q.find(isScene);
      if (b) th._pass162 = sig(b);
      th._held162 = 0; th._ln162 = 0; th._spoke162 = 0;
      const ws = W[th.id] || []; delete W[th.id]; ws.forEach(r => { try { r(); } catch (_) {} });
      try { save(); } catch (_) {}
      setTimeout(() => { try { if (!PKPLAY[th.id] && th.pk && th.pk.q && th.pk.q.length) packRun(th); } catch (_) {} }, 300);
    }
  };
  /* 播放器本身加一道「原地等」：放在处理指令之前 */
  try {
    const src = packRun.toString(), A = "if(pkDirective(th,b))continue;";
    if (src.split(A).length === 2) {
      const G = "if(window.SC162&&SC162.need(th,b)){await SC162.wait(th);if(dead())return;if(!th.pk.q||th.pk.q[0]!==b)continue;}";
      const f = (0, eval)("(" + src.replace(A, G + A) + ")");
      if (typeof f === "function") packRun = f;
    } else console.warn("[scene162] anchor not found");
  } catch (e) { console.warn("[scene162] patch", e); }
  /* 这一场演了几句（剧本台词） */
  if (typeof pkAppend === "function") {
    const pa = pkAppend;
    pkAppend = function (th) { const r = pa.apply(this, arguments); try { if (th && th.pk) th._ln162 = (th._ln162 || 0) + 1; } catch (_) {} return r; };
  }
  /* 停在换场前自由聊天：你开口不能把后面的剧本丢掉 */
  if (typeof doSend === "function") {
    const ds = doSend;
    doSend = function () {
      const th = S.threads[curT];
      const held = !!(th && th._held162 && th.pk);
      let saved = null, tune = null, prev;
      try {
        if (held && Array.isArray(th.pk.q)) {
          saved = th.pk.q.slice();
          if (typeof MIRU_TUNE !== "undefined") { MIRU_TUNE.chat = MIRU_TUNE.chat || {}; tune = MIRU_TUNE.chat; prev = tune.dropScriptOnInput; tune.dropScriptOnInput = false; }
        }
      } catch (_) {}
      try { return ds.apply(this, arguments); }
      finally {
        try {
          if (tune) { if (prev === undefined) delete tune.dropScriptOnInput; else tune.dropScriptOnInput = prev; }
          if (saved && saved.length && (!th.pk.q || !th.pk.q.length)) { th.pk.q = saved; save(); }
        } catch (_) {}
      }
    };
  }
  /* 角色台词还在排队等放出时，不算「角色没回话」，旁白不要再整段补写 */
  if (typeof narrationAfter135 === "function") {
    const na = narrationAfter135;
    narrationAfter135 = function (th, opt) {
      try {
        if (opt && !opt.delivered && th && th._q158 && th._q158.some(m => m && ((m.k === "box" && m.say) || ((th.cast || []).includes(m.who) && (m.k === "say" || m.k === "act"))))) opt.delivered = true;
      } catch (_) {}
      return na.apply(this, arguments);
    };
  }
  function bar(on) {
    const chat = document.getElementById("s-chat"); if (!chat) return;
    let el = chat.querySelector(".nx162");
    if (!on) { if (el) el.remove(); return; }
    if (el) return;
    const zh = typeof CL !== "function" || CL() === "zh";
    const host = chat.querySelector("#sugg") || chat.querySelector(".composer"); if (!host) return;
    host.insertAdjacentHTML("beforebegin", '<div class="nx162"><span>' + (zh ? "想聊多久都行，聊完了点这里 → " : "Talk as long as you like, then → ") + '</span><button data-nx162="1">' + (zh ? "下一场 ›" : "Next scene ›") + "</button></div>");
  }
  setInterval(() => { try { const th = S.threads[curT]; bar(!!(th && th.pk && th._held162 && th.pk.q && th.pk.q.length)); } catch (_) {} }, 300);
  document.addEventListener("click", e => {
    if (!e.target.closest || !e.target.closest("[data-nx162]")) return;
    e.preventDefault(); e.stopPropagation();
    const th = S.threads[curT]; bar(false); SC.release(th);
  }, true);
  const st = document.createElement("style");
  st.textContent = ".nx162{display:flex;justify-content:flex-end;align-items:center;gap:6px;margin:0 14px 6px;font-size:12px;color:var(--mut,#aaa)}" +
    ".nx162 button{background:none;border:0;color:#F6D3AE;font-size:12.5px;text-decoration:underline;text-underline-offset:3px;padding:2px 4px;cursor:pointer}";
  document.head.appendChild(st);
})();

/* ===== 2026-11-14 · 每章要完成固定目标，才能进下一章（所有剧本） =====
   玩家：「除了点下一章之外，每个章节要完成固定的目标，完成了再进下一个章节；或者完成某些具体动作，达成某些目标。」
   ⇒ 剧本每章写 1–3 个完成条件 ⟦DONE|类型|内容|短名|推进句⟧（写在 ⟦GOAL⟧ 下面）：
       say  = 玩家说出 / 做出某类事（AI 看对话判断）    flag = 某个旗子已打上（关键剧情播过、小游戏赢了、拿到道具）
     · 条件没全部完成，「进入下一章 ›」不出现；输入框上方一行小字显示「本章目标 1/2 · ✓… · …」。
     · 防卡死，三级引导（从上次有目标完成、或本章开始，数玩家自己发的话）：
         4 轮 → 角色的回应自然地往没完成的目标上带；8 轮 → 播这个目标的推进句；14 轮 → 剩下的目标按已完成处理。
     · 章末分支一直对不上（玩家一直聊别的）：同样到 14 轮时按最接近的一条走。
     · 没写 ⟦DONE⟧ 的旧剧：照旧，章末分支判定完就能进下一章。
   作者也可以在作品资料（bible.json）里写 chapters[].done = [{type,val,name,push}]。 */
(function () {
  "use strict";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const T = (a, b) => (zh() ? a : b);
  const L1 = 4, L2 = 8, L3 = 14;
  const RX = /^\s*⟦\s*DONE\s*[|｜](.*?)⟧\s*$/;
  const CHAP = /^\s*#{1,3}\s*(CHAPTER\b|第\s*[0-9一二三四五六七八九十百零〇两]+\s*章)/i;

  function parseDone(body) {
    const a = String(body || "").split(/[|｜]/).map(s => s.trim());
    const type = (a[0] || "").toLowerCase();
    if (!/^(say|flag)$/.test(type) || !a[1]) return null;
    return { type, val: a[1], name: a[2] || a[1].slice(0, 8), push: a[3] || "" };
  }

  /* ---- 导入：剧本里的 ⟦DONE⟧ 收进每一章，正文里不留 ---- */
  if (typeof PARSE !== "undefined" && PARSE.use) {
    try {
      PARSE.use("app163:done", {
        parse(next, text) {
          const per = []; let ci = -1;
          const kept = String(text || "").split("\n").filter(l => {
            if (CHAP.test(l)) { ci++; return true; }
            const m = RX.exec(l); if (!m) return true;
            const d = parseDone(m[1]); if (d) (per[Math.max(0, ci)] = per[Math.max(0, ci)] || []).push(d);
            return false;
          }).join("\n");
          const args = [].slice.call(arguments, 1); args[0] = kept;
          const doc = next.apply(null, args);
          try { if (doc && per.length) doc.done163 = per; } catch (_) {}
          return doc;
        },
        build(next, doc, as) {
          const r = next(doc, as);
          try {
            if (doc && doc.done163) {
              const wid = r && (r.wid || r), w = typeof wd === "function" ? wd(wid) : null;
              const cs = w && w.pack && w.pack.chapters;
              if (cs) cs.forEach((c, i) => { const d = doc.done163[i]; if (d && d.length) c.done163 = d.slice(0, 3); });
            }
          } catch (e) { console.warn("[goal163] build", e); }
          return r;
        }
      });
    } catch (e) { console.warn("[goal163] use", e); }
  }

  /* ---- 运行时 ---- */
  function chap(th) { try { const w = wd(th.wid); return w && w.pack && w.pack.chapters && w.pack.chapters[(+th.pk.ch || 1) - 1]; } catch (_) { return null; } }
  function goals(th) {
    const c = th && th.pk && chap(th); if (!c) return [];
    const raw = (c.done163Locales && c.done163Locales[CL() === "zh" ? "zh" : "en"]) || c.done163 || c.done || [];
    return (Array.isArray(raw) ? raw : []).map(d => (typeof d === "string" ? parseDone(d) : d && d.type ? { type: String(d.type).toLowerCase(), val: d.val || d.value || "", name: d.name || "", push: d.push || "" } : null)).filter(d => d && d.val).slice(0, 3);
  }
  function st(th) {
    const n = +th.pk.ch || 1;
    let g = th.pk.g163;
    if (!g || g.ch !== n) g = th.pk.g163 = { ch: n, ok: [], r: 0, lv: 0, pushed: [] };
    return g;
  }
  function syncFlags(th, gs, g) {
    let hit = false; const f = th.pk.flags || {};
    gs.forEach((d, i) => { if (!g.ok[i] && d.type === "flag" && f[d.val]) { g.ok[i] = 1; hit = true; } });
    return hit;
  }
  function locked(th) {
    if (!th || !th.pk) return false;
    const gs = goals(th); if (!gs.length) return false;
    const g = st(th); syncFlags(th, gs, g);
    return gs.some((_, i) => !g.ok[i]);
  }
  function open(th) { const gs = goals(th), g = st(th); return gs.map((d, i) => ({ d, i })).filter(x => !g.ok[x.i]); }
  function progressed(th, names) {
    const g = st(th); g.r = 0; g.lv = 0;
    try { save(); } catch (_) {}
    try { if (names.length) toast(T("✓ 本章目标达成：", "✓ Chapter goal: ") + names.join("、")); } catch (_) {}
  }
  window.GOAL163 = { goals, locked, state: st, open };

  /* 判定 say 类：看最近几句对话 */
  let judging = false;
  async function judge(th) {
    if (judging) return; const todo = open(th).filter(x => x.d.type === "say"); if (!todo.length) return;
    judging = true;
    try {
      const recent = (th.msgs || []).slice(-10).filter(m => m && m.txt && m.who !== "sys").map(m => (m.who === "me" ? T("玩家", "Player") : ((typeof ch === "function" && ch(m.who) && ch(m.who).n) || T("旁白", "Narration"))) + "：" + String(m.txt).slice(0, 160)).join("\n");
      const list = todo.map((x, k) => (k + 1) + "｜" + x.d.val).join("\n");
      const r = await ask("互动剧里，这一章有几个需要玩家自己完成的目标。根据最近的对话，判断玩家已经完成了哪些。\n目标：\n" + list + "\n最近的对话：\n" + recent + "\n规则：只看玩家本人说的话和做的事；意思做到了就算完成，不要求原话；没做到的不算。\n只回 JSON：{\"done\":[已完成的编号]}", { maxTokens: 60, modelTier: "default", timeout: 12000 });
      const arr = r && Array.isArray(r.done) ? r.done.map(Number) : [];
      const g = st(th), names = [];
      arr.forEach(n => { const x = todo[n - 1]; if (x && !g.ok[x.i]) { g.ok[x.i] = 1; names.push(x.d.name); } });
      if (names.length) progressed(th, names);
    } catch (e) { console.warn("[goal163] judge", e); }
    finally { judging = false; }
  }

  function pushLine(th, d) {
    const s = String(d.push || "").trim(); if (!s) return false;
    let m = /^(旁白|narration|narrator)\s*[:：]\s*(.+)$/i.exec(s);
    if (m) { appendMsg(th, { who: "n", k: "act", txt: m[2], at: Date.now() }); return true; }
    m = /^([^:：]{1,12})\s*[:：]\s*[“"「]?(.+?)[”"」]?$/.exec(s);
    if (m) {
      const id = (th.cast || []).find(c => { try { const o = ch(c); return o && (o.n === m[1] || Lz(o.n) === m[1]); } catch (_) { return false; } });
      if (id) { appendMsg(th, { who: id, k: "say", txt: m[2], at: Date.now() }); return true; }
    }
    appendMsg(th, { who: "n", k: "act", txt: s, at: Date.now() }); return true;
  }

  async function closestPick(th, txt) {
    try {
      const c = chap(th); const cs = (c && c.choices) || []; if (!cs.length || typeof packPick !== "function") return;
      let k = null;
      /* A stalled conversation cannot grant romantic consent in native v2. */
      if (wd(th.wid)?.pack?.nativeV2 && +th.pk.ch === PCN(wd(th.wid))) {
        const neutral = cs.find(x => (x.set || []).includes("ending_open"));
        if (neutral) { if (curT === th.id && th.pk.st === "choose") packPick(neutral.k); return; }
      }
      try {
        const r = await ask("玩家在互动剧的章末选择点聊了很久，一直没有明确选哪条。按他到目前为止的态度，判断最接近哪个选项。\n问题：" + Lz(c.ask) + "\n选项：\n" + cs.map(x => x.k + "｜" + Lz(x.t)).join("\n") + "\n玩家最近说：「" + txt + "」\n只回 JSON：{\"k\":\"选项字母\"}", { maxTokens: 30, modelTier: "default", timeout: 12000 });
        k = r && typeof r.k === "string" ? r.k.trim().toUpperCase().slice(0, 1) : null;
      } catch (_) {}
      if (!k || !cs.some(x => x.k === k)) k = cs[cs.length - 1].k;
      if (curT === th.id && th.pk.st === "choose") packPick(k);
    } catch (e) { console.warn("[goal163] pick", e); }
  }

  /* 玩家每发一句：计轮数 → 判定 → 引导 */
  if (typeof doSend === "function") {
    const ds = doSend;
    doSend = function (txt) {
      const th = S.threads[curT]; const s = String(txt || "").trim();
      let watch = false;
      try {
        if (th && th.pk && s && th.pk.as !== "watch") {
          const lk = locked(th), choosing = th.pk.st === "choose";
          if (lk || choosing) { const g = st(th); g.r = (g.r || 0) + 1; watch = true; }
        }
      } catch (_) {}
      const res = ds.apply(this, arguments);
      if (watch) setTimeout(() => after(th, s), 2500);
      return res;
    };
  }
  async function after(th, s) {
    try {
      if (!th || !th.pk) return;
      await judge(th);
      const g = st(th), op = open(th);
      if (!op.length && th.pk.st !== "choose") return;
      if (g.r >= L3) {
        // Strict authored goals require real source flags; time spent chatting is not completion.
        if (chap(th)?.strictDone) { g.r = L1; g.lv = 1; save(); return; }
        if (op.length) { op.forEach(x => { g.ok[x.i] = 1; }); g.auto = 1; progressed(th, []); }
        if (th.pk.st === "choose") { g.r = 0; await closestPick(th, s); }
        return;
      }
      if (g.r >= L2 && g.lv < 2) {
        g.lv = 2;
        const x = op.find(y => y.d.push && !(g.pushed || []).includes(y.i));
        if (x) {
          /* 等角色这一轮说完再推 */
          const t0 = Date.now();
          while (Date.now() - t0 < 30000 && ((typeof busy !== "undefined" && busy) || (window.READING && READING.pending.get(th.id)))) await new Promise(r => setTimeout(r, 600));
          if (pushLine(th, x.d)) { (g.pushed = g.pushed || []).push(x.i); save(); if (curT === th.id) { try { renderChat(); } catch (_) {} } }
        }
        return;
      }
      if (g.r >= L1 && g.lv < 1) { g.lv = 1; save(); }
    } catch (e) { console.warn("[goal163] after", e); }
  }

  /* 引导：进模型的提示里加一句「往没完成的目标上带」 */
  if (typeof packPrompt === "function") {
    const pp = packPrompt;
    packPrompt = function (th) {
      let s = pp.apply(this, arguments);
      try {
        if (th && th.pk) {
          const g = st(th), op = open(th);
          if (op.length && g.lv >= 1) {
            s += "\nOPEN CHAPTER GOALS (the player has not done these yet): " + op.map(x => x.d.val).join(" / ") +
              (g.lv >= 2 ? "\nThe chapter has stalled. In this reply, actively create a natural opening that invites the player toward one of these goals (a question, an action, something noticed). Never mention goals, chapters or the game." :
                "\nGently let the conversation drift toward one of these through what the characters say or do. Never mention goals, chapters or the game, and never decide for the player.");
          } else if (th.pk.st === "choose" && g.r >= L1) {
            s += "\nThe chapter's closing question is still open. Bring the conversation back to it naturally, in character.";
          }
        }
      } catch (_) {}
      return s;
    };
  }

  /* 下一章：条件没完成就不给进 */
  ["packNext", "packAdvanceChapter"].forEach(name => {
    try {
      const f = window[name]; if (typeof f !== "function") return;
      const w = function () {
        try {
          const th = S.threads[curT];
          if (th && locked(th)) { const op = open(th); toast(T("先完成本章目标：", "Finish this chapter first: ") + op.map(x => x.d.name).join("、")); return; }
        } catch (_) {}
        return f.apply(this, arguments);
      };
      window[name] = w;
      try { (0, eval)(name + " = window." + name); } catch (_) {}
    } catch (_) {}
  });
  document.addEventListener("click", e => {
    const b = e.target.closest && e.target.closest("#pkwrap [data-pknext],#pkwrap [data-pkadvance]"); if (!b) return;
    const th = S.threads[curT]; if (!th || !locked(th)) return;
    e.preventDefault(); e.stopPropagation();
    toast(T("先完成本章目标：", "Finish this chapter first: ") + open(th).map(x => x.d.name).join("、"));
  }, true);

  /* 输入框上方：本章目标进度 */
  function bar(th) {
    const chat = document.getElementById("s-chat"); if (!chat) return;
    let el = chat.querySelector(".g163");
    const gs = th && th.pk ? goals(th) : [];
    chat.classList.toggle("g163lock", !!(gs.length && locked(th)));
    if (!gs.length) { if (el) el.remove(); return; }
    const g = st(th), done = gs.filter((_, i) => g.ok[i]).length;
    const html = '<b>' + T("本章目标 ", "Goals ") + done + "/" + gs.length + "</b>" + gs.map((d, i) => '<span class="' + (g.ok[i] ? "ok" : "") + '">' + (g.ok[i] ? "✓" : "") + esc(d.name) + "</span>").join("");
    if (!el) {
      const host = chat.querySelector(".nx162") || chat.querySelector("#sugg") || chat.querySelector(".composer"); if (!host) return;
      host.insertAdjacentHTML("beforebegin", '<div class="g163"></div>'); el = chat.querySelector(".g163");
    }
    if (el && el.innerHTML !== html) el.innerHTML = html;
  }
  setInterval(() => {
    try {
      const th = S.threads[curT];
      if (th && th.pk) { const gs = goals(th); if (gs.length) { const g = st(th), before = g.ok.filter(Boolean).length; if (syncFlags(th, gs, g)) progressed(th, gs.filter((_, i) => g.ok[i]).map(d => d.name).slice(before)); } }
      bar(th);
    } catch (_) {}
  }, 500);
  const css = document.createElement("style");
  css.textContent =
    "#s-chat.g163lock #pkwrap [data-pknext],#s-chat.g163lock #pkwrap [data-pkadvance]{display:none!important}" +
    ".g163{display:flex;flex-wrap:wrap;justify-content:flex-start;align-items:center;gap:4px 10px;margin:0 14px 6px;font-size:11.5px;color:var(--mut,#aaa)}" +
    ".g163 b{font-weight:600;color:#F6D3AE}" +
    ".g163 span{opacity:.85}.g163 span.ok{opacity:.55;text-decoration:line-through}";
  document.head.appendChild(css);
})();

/* ===== 2026-11-15 · 人物卡跟着剧本走：新上线的官方剧，角色自动出现在「发现 → 角色」 =====
   以前「发现 → 角色」只读一张手工维护的总表（art/official/leads.json），新剧上线忘了加，角色就不出现。
   ⇒ 后台上线时把人物卡一起写进作品（pack.meta.leads，第⑤步「人物卡」自动生成、编剧确认）。
     App 启动时：在线的官方剧如果总表里没有，就读作品自带的人物卡，同样注册成可以一对一聊天的角色。
     总表里已有的剧照旧（总表优先）。 */
(function () {
  "use strict";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const KEY = "miru_leads165b";
  const bi = v => (v && typeof v === "object" ? { zh: String(v.zh || v.en || ""), en: String(v.en || v.zh || "") } : { zh: String(v || ""), en: String(v || "") });
  function cache() { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (_) { return {}; } }
  function keep(c) { try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (_) {} }
  function register(wid, title, leads, art, orient) {
    if (typeof C === "undefined" || typeof W === "undefined") return 0;
    const shell = "ldw_" + wid, cast = [];
    leads.forEach(L => {
      if (!L || !L.key || !L.n) return;
      const key = String(L.key).toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 24); if (!key) return;
      const id = "ld_" + wid.slice(-8) + "_" + key; if (C[id] && !C[id].ld165) { cast.push(id); return; }
      const n = bi(L.n);
      C[id] = {
        n: zh() ? n.zh : n.en, n94: n, age: +L.age || 25, h: L.h || "", w: shell, g: L.g === "f" ? "f" : "m", pal: L.pal || ["#2B2238", "#0E0B14"],
        a: "charm", v: { pitch: 1, rate: 1 }, voiceId: L.voice || "", by: "@miru",
        role: bi(L.role), looks: bi(L.looks), vibe: bi(L.vibe), pitch: bi(L.pitch), solo: bi(L.solo),
        likes: bi(L.likes), boundary: bi(L.boundary),
        tells: { zh: [], en: [] }, twist: { zh: "", en: "" }, secret: { zh: "", en: "" }, want: { zh: "", en: "" }, fear: { zh: "", en: "" },
        ld126: wid, ld165: 1
      };
      Object.defineProperty(C[id], "n", { get: function () { return zh() ? n.zh : n.en; }, enumerable: true, configurable: true });
      const pic = L.art || (art && (art["char_" + key] || art["char_" + L.key]));
      if (pic && S.art && S.art[id] !== pic) S.art[id] = pic;
      cast.push(id);
    });
    if (cast.length && !W.some(w => w.id === shell)) W.push({ id: shell, title: bi(title), or: orient || "bg", tags: [], cast, ld126: wid, hook: { zh: "", en: "" }, stats: [0, 0], status: { time: { zh: "", en: "" }, place: { zh: "", en: "" } } });
    return cast.length;
  }
  async function run() {
    try {
      let known = new Set();
      try { const r = await fetch("art/official/leads.json?v=" + Math.floor(Date.now() / 6e5)); if (r.ok) { const d = await r.json(); (d.works || []).forEach(w => known.add(w.wid)); } } catch (_) {}
      const r = await fetch("/api/works?feed=new&limit=200", { cache: "no-store" }); if (!r.ok) return;
      const j = await r.json(); const rows = (j.works || j.rows || []).filter(w => w && /官方|MIRU/i.test(String(w.author || "")) && !known.has(w.id));
      const c = cache(); let added = 0;
      for (const row of rows) {
        let ent = c[row.id];
        if (!ent || Date.now() - (ent.at || 0) > 6 * 3600e3) {
          ent = { at: Date.now(), leads: [], art: null, title: row.title, orient: row.orient };
          try { const p = typeof capi === "function" ? await capi("/works?id=" + encodeURIComponent(row.id)) : { ok: false }; if (p.ok && p.j) { const pj = p.j; /* 2026-11-24 带登录凭证：成人剧的人物卡以前被 adult_gate 挡住，永远进不了角色页 */ const m = pj.pack && pj.pack.meta; if (m && Array.isArray(m.leads)) ent.leads = m.leads.slice(0, 24); } } catch (_) {}
          if (ent.leads.length) { try { const a = await fetch("art/official/" + row.id + ".json"); if (a.ok) ent.art = await a.json(); } catch (_) {} }
          c[row.id] = ent;
        }
        if (ent.leads && ent.leads.length) added += register(row.id, ent.title || row.title, ent.leads, ent.art, ent.orient);
      }
      keep(c);
      if (added) { try { if (typeof disc !== "undefined" && disc.mode === "chars" && document.querySelector("#discRes")) renderDiscRes(); } catch (_) {} try { save(); } catch (_) {} }
      window.__leads165 = { added, checked: rows.length };
    } catch (e) { console.warn("[leads165]", e); }
  }
  /* 2026-11-21 性能：同 app126 —— 不等整页 load（会被连不上的谷歌内嵌页拖 40 秒），脚本跑完 2.5 秒后就开始，只跑一次。 */
  let started = false; const start = () => { if (started) return; started = true; setTimeout(run, 2500); };
  if (document.readyState !== "loading") start(); else { document.addEventListener("DOMContentLoaded", start); window.addEventListener("load", start); }
})();

/* ===== 2026-11-15 · 二创页按最新规则：玩家自己不算「角色」、提示语用这部剧自己的人 =====
   玩家截图：二创《午夜不打烊》时，角色里出现「店主（你）」（头像是一个「店」字），封面预览也拿它当一张图；
   「改变了什么？」的提示还是别的剧里的「如果那晚 Mason 没有睡地上……」。
   ⇒ · 玩家扮演的那个人（剧里的「你」）不进二创的角色列表，也不出现在「加人」里、不进封面预览；
     · 简介用「你和 ×× 」来写（例：如果你和卢卡的那件事换一种结局？）；
     · 输入框提示改用这部剧自己的角色名。 */
(function () {
  "use strict";
  if (typeof createRemix !== "function" || typeof renderRemix !== "function") return;
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  function isYou(id) {
    try {
      const o = ch(id); if (!o) return false;
      const nm = String(typeof o.n === "object" ? (o.n.zh || o.n.en) : o.n || "");
      if (/^(你|you|me|我)$/i.test(nm) || /[（(]\s*(你|you)\s*[)）]/i.test(nm)) return true;
      const w = (typeof wd === "function" && o.w) ? wd(o.w) : null;
      if (w && (w.you94 === id || (w.pack && w.pack.pov === id))) return true;
    } catch (_) {}
    try { return (typeof W !== "undefined" ? W : []).concat(Object.values((S.mine && S.mine.worlds) || {})).some(w => w && (w.you94 === id || (w.pack && w.pack.pov === id))); } catch (_) { return false; }
  }
  const cr = createRemix;
  createRemix = function () {
    const r = cr.apply(this, arguments);
    try {
      if (rx && Array.isArray(rx.cast)) {
        const you = rx.cast.find(isYou); if (you) rx._you = you;
        const c = rx.cast.filter(id => !isYou(id)); if (c.length && c.length !== rx.cast.length) { rx.cast = c; renderRemix(); }
      }
    } catch (_) {}
    return r;
  };
  /* 发布时把「你」放回最后一位：剧本靠它认出玩家扮演谁（只是不在二创页上当角色显示） */
  document.addEventListener("click", e => {
    try { if (e.target.closest && e.target.closest("[data-gorx]") && rx && rx._you && !rx.cast.includes(rx._you)) rx.cast.push(rx._you); } catch (_) {}
  }, true);
  if (typeof allChars === "function") {
    const rr = renderRemix;
    renderRemix = function () {
      const ac = allChars;
      try { if (rx && Array.isArray(rx.cast)) { const you = rx.cast.find(isYou); if (you && !rx._you) rx._you = you; rx.cast = rx.cast.filter(id => !isYou(id)); } } catch (_) {}
      allChars = function () { return ac.apply(this, arguments).filter(id => !isYou(id)); };
      try { return rr.apply(this, arguments); }
      finally {
        allChars = ac;
        try {
          const names = (rx.cast || []).map(id => first(ch(id).n)).filter(Boolean), a = names[0] || (zh() ? "他" : "him"), b = names[1] || a;
          const P = zh() ? { whatif: "如果那晚" + a + "没有走……", au: a + "和" + b + "在同一个街角开对门的咖啡车……", swap: "说不出口的人换成了" + a + "……", sequel: "半年后，" + a + "又出现在门口……", crossover: "那家店的新客人是" + b + "……" }
            : { whatif: "What if " + a + " hadn't walked away that night…", au: a + " and " + b + " run rival coffee carts on the same corner…", swap: a + " is the one who can't say it…", sequel: "Six months later, " + a + " shows up at the door again…", crossover: b + " is the new regular…" };
          const ta = document.getElementById("rxTw"); if (ta && P[rx.type]) ta.placeholder = P[rx.type];
        } catch (_) {}
      }
    };
  }
  if (typeof rxAuto === "function") {
    const ra = rxAuto;
    rxAuto = function () {
      const o = ra.apply(this, arguments);
      try {
        if (!rx.twist) {
          const names = (rx.cast || []).filter(id => !isYou(id)).map(id => first(ch(id).n));
          const me = zh() ? "你" : "you", a = names[0] || "", b = names[1] || a;
          const p = zh() ? ((typeof RX_AU_ZH !== "undefined" && RX_AU_ZH[rx.au]) || rx.au) : rx.au;
          const H = zh() ? { whatif: "如果你和" + a + "的那件事换一种结局？", au: "你和" + a + "，但这次是在" + p + "。", swap: "你和" + a + "互换了位置——一切都变了。", sequel: "结局之后，你和" + a + "还得接着活下去。", crossover: a + "本来永远不该遇见" + b + "。" }
            : { whatif: "What if it had gone differently for you and " + a + "?", au: "You and " + a + ", but it's " + p + ".", swap: "You and " + a + " switch places — and it changes everything.", sequel: "After the ending, you and " + a + " still have to live with it.", crossover: a + " was never supposed to meet " + b + "." };
          if (a && H[rx.type]) o.hook = H[rx.type];
        }
      } catch (_) {}
      return o;
    };
  }
})();


/* ===== 2026-11-15 · 二创重做：只能选官方剧和剧里的角色；AI 按《MIRU 互动剧本写作规范 v2》写一部 3 章的新剧；按次收费 =====
   玩家：「二创页没办法选要二创哪一部剧，总是显示午夜不打烊；角色必须是我们剧本里的，不要随便的角色；
          二创和一创都要消耗 token 和成本，要收费。」
   ⇒ · 第 1 步「选一个故事」只列在线的官方剧（有人物卡的），默认选你当前在看的那一部；
     · 角色只能从这部剧的人物卡里选（「跨作品联动」可以从其他官方剧的人物卡里拉人）；玩家自己不算角色；
     · 点「发布二创」→ 确认价格 → AI 按规范 v2 写 3 章（每章有目标、完成条件、场景、背景图、章内分支、章末分支），
       用原剧的背景图和角色立绘，生成一部可以正常玩的剧（换场等「下一场」、完成目标才进下一章，规则和官方剧一样）；
       生成失败自动退还钻石。
     · 一创（创建角色、组局）发布时也按次收钻。价格见 PRICES.remix / create / group，可调。 */
(function () {
  "use strict";
  if (typeof createRemix !== "function" || typeof renderRemix !== "function" || typeof W === "undefined") return;
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const T2 = (a, b) => (zh() ? a : b);
  try { if (typeof PRICES !== "undefined") Object.assign(PRICES, { remix: PRICES.remix || 5, create: PRICES.create || 2, group: PRICES.group || 2 }); } catch (_) {}
  try {
    Object.assign(I18N.zh, { "pay.why.remix": "二创要由 AI 为你写一部新剧", "pay.why.create": "创作要消耗 AI 算力" });
    Object.assign(I18N.en, { "pay.why.remix": "A remix is a brand-new story written for you by AI", "pay.why.create": "Creating uses AI compute" });
  } catch (_) {}

  /* 官方剧列表：优先按你的取向筛；筛完一部都没有就全列出来 */
  const shells = () => { const all = W.filter(w => w && w.ld126 && Array.isArray(w.cast) && w.cast.length); let pref = []; try { pref = all.filter(w => !w.or || w.or === "all" || !S.or || w.or === S.or); } catch (_) {} return pref.length ? pref : all; };
  const shellOf = id => { if (!id) return null; const s = String(id).replace(/^off94:/, ""); return W.find(w => w && w.ld126 && (w.id === s || w.ld126 === s || w.id === "ldw_" + s)) || null; };
  const allowed = () => {
    if (!rx) return new Set();
    if (rx.type === "crossover") return new Set(shells().flatMap(w => w.cast));
    const sh = shellOf(rx.wid); return new Set(sh ? sh.cast : []);
  };

  /* 默认选当前在看的那部官方剧；不是官方剧就选第一部 */
  const cr = createRemix;
  createRemix = function (wid, fromTh) {
    const r = cr.apply(this, arguments);
    try {
      if (rx && !rx.from) {
        const cur = wid || (typeof curStory !== "undefined" ? curStory : "");
        const sh = shellOf(cur) || shellOf(rx.wid) || shells()[0];
        if (sh) { rx.wid = sh.id; rx.cast = sh.cast.slice(0, 3); renderRemix(); }
      }
    } catch (e) { console.warn("[rx166] create", e); }
    return r;
  };

  /* 第 1 步只放官方剧；「加人」只给允许的角色 */
  const rr = renderRemix;
  renderRemix = function () {
    try { if (rx && !rx.from && !shellOf(rx.wid)) { const sh = shells()[0]; if (sh) { rx.wid = sh.id; rx.cast = sh.cast.slice(0, 3); } } } catch (_) {}
    try { if (rx && Array.isArray(rx.cast)) { const ok = allowed(); if (ok.size) { const c = rx.cast.filter(id => ok.has(id)); if (c.length) rx.cast = c; } } } catch (_) {}
    const out = rr.apply(this, arguments);
    try {
      const scr = document.getElementById("s-cremix");
      const rail = scr && scr.querySelector(".rail");
      if (rail && !rx.from) rail.innerHTML = shells().map(w => rxWorldCard(w)).join("");
      const go = scr && scr.querySelector("[data-gorx]"); if (go && !/💎/.test(go.textContent)) go.textContent = t("rx.go") + " · 💎" + PRICES.remix;
    } catch (e) { console.warn("[rx166] render", e); }
    return out;
  };
  if (typeof rxPickSheet === "function") {
    const ps = rxPickSheet;
    rxPickSheet = function () {
      const ac = allChars, ok = allowed();
      allChars = function () { return ac.apply(this, arguments).filter(id => ok.has(id)); };
      try { return ps.apply(this, arguments); } finally { allChars = ac; }
    };
  }

  /* ---------- 生成二创剧本 ---------- */
  const FMT = `【输出格式 · MIRU 标准剧本 v2】
## CHAPTER {n}｜章节标题
⟦GOAL|这一章要立什么（一句话）|English⟧
⟦DONE|say|玩家要说出或做出的一个意图（不是具体台词）|4–8 字短名|推进句：旁白：…… 或 名字：“……”⟧   ← 每章 1–2 个，至少一个 say
# SCENE｜地点
⟦BG|背景槽位名|地点 · 画面说明⟧      ← 槽位名只能从【可用背景】里选，选地点最接近的
⟦TIME|时间⟧
旁白直接写成段落（不加前缀），只写看得见的动作、环境和细节。每场 4–8 句：第一句交代到了哪、气氛，最后一句交代接下来去哪 / 做什么。
名字：“台词”      ← 一行一个人，一句不超过 40 字；名字必须和【角色】里的中文名一字不差
# CHOICE｜章内分支点：写成让玩家有话可说的情境
#### A｜玩家意图（不是现成台词，各条意图要区分得开）
（选 A 之后的后果 1–3 行：旁白、动作、事件；不要写角色对玩家这句话的固定回答）
⟦OPT|A|set:英文旗子;love:2⟧
#### B｜……
# ·
每章 2–3 场。章末顺序：关键事件 → # CHOICE｜本章结尾的关键问题 → #### A/B/C 意图 + 后果 + ⟦OPT⟧ → # · → 章尾钩子 1 句。
第 2 章起，第一场前两句承接上一章（过了多久、人在哪），不要用任何条件语法（不写 IF / ELSE）。
⟦GOAL⟧ 下面必须紧跟 1–2 行 ⟦DONE⟧，每一章都要有，缺了剧本无法使用。
硬要求：玩家看不到选项，不写「轮到你了」「请选择」；不替玩家决定感受；古代、奇幻等没有手机的世界不写电话短信；对方在场时不打电话；所有角色都是虚构成年人；不写露骨内容；只输出剧本正文，不要解释、不要代码块。`;

  let busy = false;
  function prog(msg) {
    let el = document.getElementById("rx166p");
    if (!el) { el = document.createElement("div"); el.id = "rx166p"; el.className = "rx166p"; document.body.appendChild(el); }
    el.innerHTML = '<div><b>' + esc(T2("正在写你的二创", "Writing your remix")) + '</b><span>' + esc(msg) + '</span></div>'; el.hidden = false;
  }
  function progOff() { const el = document.getElementById("rx166p"); if (el) el.hidden = true; }
  function nameOf(id) { const c = ch(id) || {}; const n94 = c.n94 || {}; return String(n94.zh || first(c.n) || ""); }

  function tidy(txt) {
    const L0 = String(txt).split("\n"), L = [], out = [], seenDone = new Set();
    for (let i = 0; i < L0.length; i++) { let l = L0[i]; if (/^\s*⟦/.test(l)) { let k = 0; while (!/⟧/.test(l) && i + 1 < L0.length && k++ < 4) l += L0[++i].trim(); } L.push(l); }
    let skip = false;
    for (let l of L) {
      if (/^\s*⟦IF\|[^⟧]*⟧\s*$/.test(l)) { skip = true; continue; }
      if (/^\s*⟦ELSE⟧\s*$/.test(l)) { skip = false; continue; }
      if (/^\s*⟦\/IF⟧\s*$/.test(l)) { skip = false; continue; }
      if (skip) continue;
      if (/⟦\s*\/?\s*(IF|ELSE)/.test(l)) {
        const e = l.lastIndexOf("⟦ELSE⟧");
        l = (e >= 0 ? l.slice(e + 6) : (/⟦IF\|/.test(l) ? "" : l)).replace(/⟦\s*\/?\s*(IF|ELSE)[^⟧]*⟧/g, "").trim();
        if (!l) continue;
      }
      if (/^\s*⟦\s*DONE/.test(l)) { l = l.replace(/[|｜]\s*推进句\s*[:：]\s*/, "|"); const v = (l.split(/[|｜]/)[2] || "").trim(); if (seenDone.has(v)) continue; seenDone.add(v); }
      if (/^\s*⟦OPT\|/.test(l)) l = l.replace(/;?\s*flag:[^;⟧]*/g, "").replace(/\|;/, "|");
      const bg = /^\s*⟦BG\|[^|⟧]+\|?([^⟧]*)⟧/.exec(l);
      if (bg) { let k = out.length - 1; while (k >= 0 && !out[k].trim()) k--; if (k < 0 || !/^\s*#\s*(SCENE|场景)/i.test(out[k])) out.push("# SCENE｜" + ((bg[1] || "").split(/[·•]/)[0].trim() || "场景")); }
      out.push(l);
    }
    if (!seenDone.size) {
      const qs = out.filter(x => /^\s*#\s*CHOICE\s*[｜|]/i.test(x)); const q = qs.length ? qs[qs.length - 1].replace(/^\s*#\s*CHOICE\s*[｜|]\s*/i, "").trim() : "";
      const gi = out.findIndex(x => /^\s*⟦GOAL\|/.test(x)); const at = gi >= 0 ? gi + 1 : Math.max(1, out.findIndex(x => /^\s*#\s*SCENE/i.test(x)));
      out.splice(at, 0, "⟦DONE|say|" + (q ? "对「" + q.replace(/[|⟧]/g, " ").slice(0, 40) + "」说出自己的决定" : "说出你对眼前这件事的决定") + "|做出决定|旁白：话一出口，局面就不一样了。⟧");
    }
    return out.join("\n");
  }
  async function generate() {
    const sh = shellOf(rx.wid), wid0 = sh.ld126, a = Object.assign({}, rxAuto());
    if (zh()) a.title = String(a.title || "").replace(/\s*·\s*What if…?/i, " · 如果……").replace(/\s*·\s*Sequel/i, " · 后传").replace(/\s*·\s*AU/i, " · 平行世界");
    const cast = rx.cast.filter(id => ch(id));
    let meta = {}, script = "", assets = {};
    try { const r = await fetch("/api/works?id=" + encodeURIComponent(wid0)); if (r.ok) { const j = await r.json(); meta = (j.pack && j.pack.meta) || {}; script = (j.pack && j.pack.script) || ""; } } catch (_) {}
    try { const r = await fetch("art/official/" + wid0 + ".json"); if (r.ok) assets = await r.json(); } catch (_) {}
    /* 原剧里每个背景槽位对应的地点 */
    const bgs = [], seen = new Set(); let lastPlace = "";
    String(script).split("\n").forEach(l => {
      const s1 = /^\s*#\s*(?:SCENE|场景|第.+场)\s*[｜|]\s*(.+)$/i.exec(l); if (s1) lastPlace = s1[1].trim();
      const b = /⟦BG\|([^|⟧]+)\|?([^⟧]*)⟧/.exec(l); if (b && !seen.has(b[1].trim())) { seen.add(b[1].trim()); bgs.push(b[1].trim() + "：" + (b[2] || lastPlace).trim().slice(0, 40)); }
    });
    Object.keys(assets).filter(k => /^bg_/.test(k) && !seen.has(k)).slice(0, 30).forEach(k => bgs.push(k + "：（原剧场景图）"));
    const people = cast.map(id => { const c = ch(id) || {}; return "- " + nameOf(id) + "（" + Lz(c.role || "") + "）外貌：" + Lz(c.looks || "") + "；性格：" + Lz(c.vibe || ""); }).join("\n");
    const how = { whatif: "如果……：改变原剧里发生过的一件事，之后的一切跟着变", au: "平行世界：同样的人，换到「" + ((typeof RX_AU_ZH !== "undefined" && RX_AU_ZH[rx.au]) || rx.au) + "」", swap: "身份互换：角色之间的权力和位置反过来", sequel: "结局之后：从原剧停下的地方接着写", crossover: "跨作品联动：来自不同故事的人走进同一个故事" }[rx.type] || "";
    const ctx = "【原剧】" + Lz(sh.title) + "\n【原剧简介】" + String(meta.premise || "").slice(0, 600) + "\n【玩家扮演】" + String(meta.you || "你").slice(0, 200) +
      "\n【二创类型】" + how + "\n【改了什么】" + (rx.twist || a.hook) + (rx.opening ? "\n【开场第一句（要用上）】" + rx.opening : "") +
      "\n【尺度】" + (rx.heat || "slow") + "（不写露骨内容）\n【角色】（只用这些人，玩家是「你」）\n" + people + "\n【可用背景】\n" + (bgs.slice(0, 40).join("\n") || "（没有，可以省略 ⟦BG⟧ 行）");
    const chapters = [];
    for (let n = 1; n <= 3; n++) {
      prog(T2("第 " + n + " / 3 章 · 约需 20–40 秒", "Chapter " + n + " of 3 · about 20–40 seconds"));
      const prev = chapters.length ? "\n\n【前面已经写好的章节（接着写，不要重复）】\n" + chapters.join("\n\n").slice(-7000) : "";
      const prompt = "你是 MIRU 互动剧的编剧。根据下面的设定写这部二创的第 " + n + " 章（共 3 章；第 3 章要给出一个阶段性的结局和余韵）。\n\n" + FMT.replace("{n}", n) + "\n\n" + ctx + prev + "\n\n现在只输出第 " + n + " 章的剧本正文。";
      let txt = "";
      for (let k = 0; k < 2 && !/CHAPTER/i.test(txt); k++) {
        const r = await SAMPLE(prompt, { modelTier: "complex", maxTokens: 6000, timeout: 160000, cache: false });
        txt = String((r && r.text) || "").replace(/^```[a-z]*\s*/i, "").replace(/```\s*$/, "").trim();
      }
      if (!/CHAPTER/i.test(txt)) throw new Error("chapter " + n);
      chapters.push(tidy(txt).replace(/^#{1,2}\s*CHAPTER\s*\d*/i, "## CHAPTER " + n));
    }
    const chars = cast.map(id => { const c = ch(id) || {}; return "⟦CHAR|" + nameOf(id) + "|" + (c.g === "f" ? "f" : "m") + "|" + (c.age || 26) + "|" + id + "|" + Lz(c.role || "").replace(/[|⟧]/g, " ") + "|" + Lz(c.looks || "").replace(/[|⟧]/g, " ") + "⟧"; }).join("\n");
    const md = "# " + a.title + "\n" + chars + "\n⟦CHAR|你|f|25|you|玩家|" + String(meta.you || "").replace(/[|⟧]/g, " ").slice(0, 80) + "⟧\n\n" + chapters.join("\n\n");
    prog(T2("正在把剧本做成可以玩的剧……", "Building your playable story…"));
    const doc = imParse(md);
    if (!doc || !doc.chapters || !doc.chapters.length) throw new Error("parse");
    const r = imBuild(doc, null); const nid = r && (r.wid || r); const w = nid && wd(nid);
    if (!w) throw new Error("build");
    const x0 = v => ({ en: v, zh: v });
    Object.assign(w, { title: x0(a.title), hook: x0(a.hook), premise: x0(String(meta.premise || "").replace(/[^。！？.!?]*\d+\s*章[^。！？]*[。！？]?/g, "").slice(0, 260) + " —— 二创 · " + how + (rx.twist ? "：" + rx.twist : "")), remixOf: wid0, remixType: rx.type, heat: rx.heat, official: false });
    /* 角色立绘和资料：沿用官方人物卡 */
    (w.cast || []).forEach(id => {
      const c = (S.mine.chars || {})[id]; if (!c) return;
      const lead = cast.find(L => nameOf(L) === String(c.n || "")); if (!lead) return;
      const L = ch(lead) || {};
      Object.assign(c, { g: L.g || c.g, age: L.age || c.age, h: L.h || "", role: L.role || c.role, looks: L.looks || c.looks, vibe: L.vibe || c.vibe, pitch: L.pitch || c.pitch, solo: L.solo || c.solo, likes: L.likes || c.likes, boundary: L.boundary || c.boundary, ldFrom: lead });
      const pic = (S.art && S.art[lead]) || (typeof artSrc === "function" ? artSrc(lead) : ""); if (pic) S.art[id] = pic;
    });
    /* 背景图：原剧的同名槽位 */
    try {
      const walk = bs => (bs || []).forEach(b => { if (!Array.isArray(b)) { if (b && b.choice) (b.choice.opts || []).forEach(o => walk(o.then)); return; } if (b[0] === "sys" && b[1] === "scene" && b[2]) { const slot = b[2].bg94 || b[2].bg || b[2].img; if (slot && assets[slot]) { const key = "rx166:" + nid + ":" + slot; S.art[key] = assets[slot]; b[2].img = key; } } if (b[0] === "sys" && b[1] === "if" && b[2]) { walk(b[2].then); walk(b[2].else || b[2].alt); } (b[2] && b[2].opts || []).forEach(o => walk(o.then)); });
      (w.pack && w.pack.chapters || []).forEach(c => { walk(c.beats && c.beats.zh); if (c.beats && c.beats.en !== c.beats.zh) walk(c.beats.en); (c.choices || []).forEach(o => { walk(o.then && o.then.zh); }); });
      const cov = assets.cover || assets.poster; if (cov) { S.art[nid] = cov; w.cover = true; }
    } catch (e) { console.warn("[rx166] bg", e); }
    try { const wk = (S.works || []).find(x => x && x.id === nid); if (wk) Object.assign(wk, { kind: "remix", title: a.title }); else (S.works = S.works || []).unshift({ id: nid, kind: "remix", title: a.title, at: Date.now(), seed: 0 }); } catch (_) {}
    save();
    return nid;
  }

  window.RX166 = { generate: () => generate(), shells, allowed };
  document.addEventListener("click", async e => {
    const go = e.target.closest && e.target.closest("[data-gorx]");
    const ok = e.target.closest && e.target.closest("[data-rx166go]");
    if (!go && !ok) return;
    if (!rx || rx.from) return; /* 「从这一刻二创」照旧 */
    e.preventDefault(); e.stopImmediatePropagation();
    if (busy) return;
    if (go) {
      if (!shellOf(rx.wid)) { toast(T2("先选一部官方剧", "Pick a story first")); return; }
      if (!String(rx.twist || "").trim() && !String(rx.opening || "").trim() && rx.type !== "au" && rx.type !== "crossover") { toast(t("rx.need")); const x = document.getElementById("rxTw"); if (x) x.focus(); return; }
      sheet('<h2>' + esc(T2("生成二创剧本", "Write my remix")) + '</h2><p class="sm dim" style="margin-top:8px;line-height:1.6">' +
        esc(T2("AI 会按 MIRU 剧本规范，用《" + Lz(shellOf(rx.wid).title) + "》的角色和场景为你写一部 3 章的新剧，大约 1–2 分钟。生成失败会自动退还钻石。", "AI will write a new 3-chapter story with the characters and places of the original, following the MIRU script rules. About 1–2 minutes. If it fails, your gems are refunded.")) +
        '</p><button class="btn btn-p btn-block" style="margin-top:14px" data-rx166go="1">💎 ' + PRICES.remix + ' · ' + esc(T2("开始生成", "Start")) + '</button>');
      return;
    }
    try { closeSheet(); } catch (_) {}
    const price = PRICES.remix;
    if (!spend(price, "remix")) return;
    busy = true;
    try {
      const nid = await generate();
      progOff(); rx = null;
      try { if (typeof taskClaimOnce === "function" && taskClaimOnce("pubRemix", 3)) setTimeout(() => toast(t("task.gotRemix")), 2600); } catch (_) {}
      openStory(nid);
    } catch (err) {
      console.warn("[rx166] generate", err);
      progOff();
      S.keys = (S.keys || 0) + price; save();
      toast(T2("这次没写成，钻石已退还（💎" + price + "），可以再试一次", "Couldn't finish this time — " + price + " gems refunded. Try again."));
    } finally { busy = false; }
  }, true);

  /* ---------- 一创：创建角色、组局，发布时收钻 ---------- */
  document.addEventListener("click", e => {
    const pc = e.target.closest && e.target.closest("[data-pubchar]");
    const gg = e.target.closest && e.target.closest("[data-gogroup]");
    if (!pc && !gg) return;
    if (pc) {
      const v = id => ((document.getElementById(id) || {}).value || "").trim();
      if (!v("fName") || !v("fOpen") || (v("fAge") && +v("fAge") < 21)) return; /* 让原来的提示出来，不收钱 */
      if (!spend(PRICES.create, "create")) { e.preventDefault(); e.stopImmediatePropagation(); }
      return;
    }
    if (typeof gpick !== "undefined" && gpick.length < 2) return;
    if (!spend(PRICES.group, "create")) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);
  setInterval(() => {
    try {
      const pc = document.querySelector("[data-pubchar]"); if (pc && !/💎/.test(pc.textContent)) pc.textContent = t("f.publish") + " · 💎" + PRICES.create;
      const gg = document.querySelector("[data-gogroup]"); if (gg && !/💎/.test(gg.textContent)) gg.textContent = gg.textContent + " · 💎" + PRICES.group;
    } catch (_) {}
  }, 700);

  const st = document.createElement("style");
  st.textContent = ".rx166p{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;background:rgba(7,6,10,.72)}.rx166p[hidden]{display:none}" +
    ".rx166p>div{display:flex;flex-direction:column;gap:8px;align-items:center;padding:22px 26px;border-radius:16px;background:#17131d;border:1px solid rgba(255,255,255,.08);color:#fff;max-width:80vw;text-align:center}" +
    ".rx166p span{font-size:13px;color:rgba(255,255,255,.65)}";
  document.head.appendChild(st);
})();

/* ===== 2026-11-16 · ① 遇见：今天的牌是空的（每天都显示「今天的人你都看过了」） ② 推广分佣 + 单剧收入统计 =====
   ① 玩家：「每天不是给 12 个吗？昨天没有，今天还是没有。」
      原因：① 发牌函数 deck96 里还按玩家取向筛人（遇见本该不筛），取向不匹配时一张牌都没有；② 空牌被当成「今天已经发过牌」存了一整天（打开 App 时角色表还没装好也会这样）。
      ⇒ 当天还没滑过、牌却是空的，就重新发牌；角色表装好后如果遇见页开着，自动刷新。
   ② 玩家：「每个创作者都可以推广剧本，推广的剧有人充值就能分佣，在 App 里能看到自己的推广收益；要有链接、二维码，能分享到各平台；
      还要能看到单部剧的收入。」
      规则（产品定）：被推广用户自绑定起 30 天内每笔正式充值的 10%，按 $1 = 5 钻发给推广人；平台出，原作者不额外分。后台可调。
      · 剧详情页加「📣 推广赚钻」：专属链接（miru.plus/?story=剧&p=推广码）、二维码（可存图）、系统分享 + X / Facebook / WhatsApp / Telegram / LINE；
        Instagram、TikTok 没有网页分享入口，用系统分享或存二维码海报去发。
      · 「我的」页加「我的推广」：点击、带来的新用户、付费人数、带来的充值、已得钻石，按剧分开看。
      · 通过链接进来的新用户登录后自动绑定推广人（服务器判定：只认新号、没充过值、不能绑自己）。
      · 单剧收入：在剧里花的钻、在剧里打开充值页后完成的充值，都记到这部剧上，后台「推广与单剧收入」查看。 */
(function () {
  "use strict";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const T2 = (a, b) => (zh() ? a : b);
  const on = () => typeof CL0 !== "undefined" && CL0.on && typeof capi === "function" && typeof cloudInfo === "function" && !!cloudInfo().token;
  /* 官方剧打开后是本地搭的世界（bw_xxx），统计和推广链接要用服务器上的作品 ID（w_xxx） */
  const WMAP = {};
  const normWid = id => {
    let s = String(id || ""); s = s.replace(/^off94:/, "").replace(/^ldw_/, "");
    if (s && !/^w_/.test(s)) {
      if (!(s in WMAP)) { let m = null; try { const w = typeof wd === "function" && wd(s); if (w) m = (JSON.stringify(w).match(/"(w_[a-z0-9]{12,})"/) || [])[1] || null; } catch (_) {} WMAP[s] = m; }
      if (WMAP[s]) s = WMAP[s];
    }
    return /^[A-Za-z0-9_:.-]{1,80}$/.test(s) ? s : "";
  };

  /* ---------- ① 遇见：空牌重发 ---------- */
  try {
    if (typeof todayDeck96 === "function" && typeof sw96 === "function") {
      const TD = todayDeck96;
      todayDeck96 = function () {
        try {
          const st = sw96();
          const untouched = !(st.likes > 0) && !(st.used > 0) && !Object.values(st.nope || {}).some(t => new Date(t).toDateString() === st.day);
          if (Array.isArray(st.deck) && st.deck.length === 0 && untouched && !st.deckOk167) st.deck = null;
        } catch (_) {}
        /* 遇见本来就不按取向筛人（app140 只放开了 eligible96，deck96 里还有一道取向过滤，取向是「GL」等时一张牌都发不出来） */
        const o = S.or; let d;
        try { S.or = "all"; d = TD.apply(this, arguments); } finally { S.or = o; }
        try { if (d && d.length) sw96().deckOk167 = 1; } catch (_) {}
        return d;
      };
      let tries = 0;
      const iv = setInterval(() => {
        tries++; if (tries > 40) return clearInterval(iv);
        try {
          const el = document.getElementById("sw96");
          if (!el || el.hidden || (typeof DECK96 !== "undefined" && DECK96.length)) return;
          if (!Object.keys(C || {}).length) return;
          DECK96 = todayDeck96(); if (DECK96.length) { renderSwipe96(); clearInterval(iv); }
        } catch (_) {}
      }, 1500);
    }
  } catch (e) { console.warn("[meet167]", e); }

  /* ---------- ② 推广链接：记点击，登录后绑定 ---------- */
  const PK = "miru_promo167";
  try {
    const q = new URLSearchParams(location.search), code = q.get("p");
    if (code && /^[a-z0-9]{3,20}$/i.test(code)) {
      const wid = normWid(q.get("story") || "");
      const old = JSON.parse(localStorage.getItem(PK) || "null");
      if (!old || old.code !== code) {
        localStorage.setItem(PK, JSON.stringify({ code, wid, at: Date.now() }));
        setTimeout(() => { try { fetch((typeof CLOUD_EP !== "undefined" ? CLOUD_EP : "/api") + "/promo", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ op: "click", code, wid }) }).catch(() => {}); } catch (_) {} }, 1200);
      }
    }
  } catch (_) {}
  let binding = false;
  async function tryBind() {
    if (binding || !on()) return; let p = null;
    try { p = JSON.parse(localStorage.getItem(PK) || "null"); } catch (_) {}
    if (!p || p.done || Date.now() - (p.at || 0) > 30 * 864e5) return;
    binding = true;
    try {
      const r = await capi("/promo", { json: { op: "bind", code: p.code, wid: p.wid } });
      if (r && r.ok && r.j) { p.done = 1; p.res = r.j.ok ? "ok" : r.j.why; localStorage.setItem(PK, JSON.stringify(p)); }
    } catch (_) {} finally { binding = false; }
  }
  setTimeout(tryBind, 3000); setInterval(tryBind, 20000);

  /* ---------- 单剧收入：花钻和打开充值页记到当前这部剧 ---------- */
  function curWid() {
    try {
      const chat = document.getElementById("s-chat");
      if (chat && !chat.hidden && typeof curT !== "undefined" && curT && S.threads[curT] && S.threads[curT].wid) return normWid(S.threads[curT].wid);
    } catch (_) {}
    try { if (typeof curStory !== "undefined" && curStory) return normWid(curStory); } catch (_) {}
    try { if (typeof curT !== "undefined" && curT && S.threads[curT] && S.threads[curT].wid) return normWid(S.threads[curT].wid); } catch (_) {}
    return "";
  }
  let UQ = [], ut = null;
  function flushUse() {
    ut = null; if (!UQ.length || !on()) return; const items = UQ.splice(0, 40);
    capi("/promo", { json: { op: "use", items } }).catch(() => {});
  }
  if (typeof spend === "function") {
    const SP = spend;
    spend = function (n, why) {
      const before = typeof S !== "undefined" ? S.keys : 0;
      const ok = SP.apply(this, arguments);
      try {
        const used = before - S.keys;
        if (ok && used > 0) { const wid = curWid(); if (wid) { UQ.push({ wid, n: Math.min(50, used), why: String(why || "").slice(0, 20) }); if (!ut) ut = setTimeout(flushUse, 4000); } }
      } catch (_) {}
      return ok;
    };
  }
  if (typeof paySheet === "function") {
    const PS = paySheet;
    paySheet = function (why) {
      const r = PS.apply(this, arguments);
      try { const wid = curWid(); if (wid && on()) capi("/promo", { json: { op: "paywall", wid, why: String(why || "").slice(0, 20) } }).catch(() => {}); } catch (_) {}
      return r;
    };
  }
  window.addEventListener("pagehide", flushUse);

  /* ---------- 推广码 + 数据 ---------- */
  let ME = null, meAt = 0;
  async function loadMe(force) {
    if (!on()) return null;
    if (ME && !force && Date.now() - meAt < 30000) return ME;
    try { const r = await capi("/promo?r=me"); if (r && r.ok && r.j && r.j.code) { ME = r.j; meAt = Date.now(); } } catch (_) {}
    return ME;
  }
  const usd = c => "$" + ((Number(c) || 0) / 100).toFixed(2);
  const linkOf = (wid, code) => "https://miru.plus/?story=" + encodeURIComponent(wid) + "&p=" + encodeURIComponent(code);
  function needLogin() {
    toast(T2("先登录账号，才能生成你的专属推广链接", "Sign in first to get your own promo link"));
    try { if (typeof authSheet === "function") authSheet(); } catch (_) {}
  }

  /* 二维码：cdnjs 上的 qrcode-generator（只在打开分享时加载） */
  let qrLib = null;
  function loadQR() {
    if (window.qrcode) return Promise.resolve(window.qrcode);
    if (qrLib) return qrLib;
    qrLib = new Promise((ok, no) => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"; s.onload = () => ok(window.qrcode); s.onerror = () => { qrLib = null; no(new Error("qr")); }; document.head.appendChild(s); });
    return qrLib;
  }
  async function drawPoster(cv, url, title, sub) {
    const qr = await loadQR(); const q = qr(0, "M"); q.addData(url); q.make();
    const n = q.getModuleCount(), W0 = 720, H0 = 960, x = cv.getContext("2d");
    cv.width = W0; cv.height = H0;
    const g = x.createLinearGradient(0, 0, 0, H0); g.addColorStop(0, "#1B1520"); g.addColorStop(1, "#07060A"); x.fillStyle = g; x.fillRect(0, 0, W0, H0);
    x.fillStyle = "#E8B4C8"; x.font = "bold 30px system-ui,sans-serif"; x.textAlign = "center"; x.fillText("MIRU", W0 / 2, 80);
    x.fillStyle = "#fff"; x.font = "bold 40px system-ui,sans-serif";
    const lines = []; let line = ""; for (const chr of String(title)) { if (x.measureText(line + chr).width > W0 - 100) { lines.push(line); line = ""; } line += chr; } if (line) lines.push(line);
    lines.slice(0, 2).forEach((l, i) => x.fillText(l, W0 / 2, 160 + i * 52));
    x.fillStyle = "rgba(255,255,255,.65)"; x.font = "24px system-ui,sans-serif"; x.fillText(sub, W0 / 2, 280);
    const box = 440, ox = (W0 - box) / 2, oy = 330, cell = box / (n + 8);
    x.fillStyle = "#fff"; x.fillRect(ox, oy, box, box);
    x.fillStyle = "#111"; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) x.fillRect(ox + (c + 4) * cell, oy + (r + 4) * cell, Math.ceil(cell), Math.ceil(cell));
    x.fillStyle = "rgba(255,255,255,.8)"; x.font = "24px system-ui,sans-serif"; x.fillText(T2("扫码进入故事", "Scan to start the story"), W0 / 2, oy + box + 60);
    x.fillStyle = "rgba(255,255,255,.45)"; x.font = "20px system-ui,sans-serif"; x.fillText("miru.plus", W0 / 2, oy + box + 100);
  }
  function titleOf(wid) { try { const w = wd(wid) || wd("ldw_" + wid) || wd("off94:" + wid); if (w) return Lz(w.title); } catch (_) {} return "MIRU"; }

  async function promoSheet(rawWid) {
    const wid = normWid(rawWid); if (!wid) return;
    if (!on()) return needLogin();
    sheet('<h2>📣 ' + esc(T2("推广这部剧", "Promote this story")) + '</h2><p class="sm dim" style="margin-top:6px">' + esc(T2("正在生成你的专属链接……", "Getting your link…")) + '</p>');
    const me = await loadMe(true);
    if (!me) { closeSheet(); toast(T2("暂时拿不到推广链接，稍后再试", "Couldn't get your link — try again later")); return; }
    const url = linkOf(wid, me.code), title = titleOf(rawWid) !== "MIRU" ? titleOf(rawWid) : titleOf(wid), w0 = (me.byWork || []).find(x => x.wid === wid) || {};
    const pct = Math.round((me.rate || 0.1) * 100);
    const txt = T2("我在 MIRU 玩《" + title + "》，你也来试试：", "I'm playing \"" + title + "\" on MIRU — try it: ");
    const enc = encodeURIComponent, full = txt + " " + url;
    const nets = [
      ["X", "https://twitter.com/intent/tweet?text=" + enc(txt) + "&url=" + enc(url)],
      ["Facebook", "https://www.facebook.com/sharer/sharer.php?u=" + enc(url)],
      ["WhatsApp", "https://wa.me/?text=" + enc(full)],
      ["Telegram", "https://t.me/share/url?url=" + enc(url) + "&text=" + enc(txt)],
      ["LINE", "https://social-plugins.line.me/lineit/share?url=" + enc(url)],
      ["Reddit", "https://www.reddit.com/submit?url=" + enc(url) + "&title=" + enc(title)],
    ];
    sheet('<h2>📣 ' + esc(T2("推广《", "Promote “") + title + T2("》", "”")) + '</h2>' +
      '<p class="sm dim" style="margin-top:6px;line-height:1.6">' + esc(T2("通过你的链接进来的新用户，" + me.days + " 天内每次充值，你都能拿到充值金额的 " + pct + "%（按 $1 = " + me.gemsPerUsd + " 钻自动发到你的钱包）。", "New players who join through your link: for " + me.days + " days you get " + pct + "% of every top-up they make, paid in gems ($1 = " + me.gemsPerUsd + " gems).")) + '</p>' +
      '<div class="pr167s"><span><b>' + (w0.clicks || 0) + '</b>' + esc(T2("点击", "Clicks")) + '</span><span><b>' + (w0.users || 0) + '</b>' + esc(T2("新用户", "New players")) + '</span><span><b>' + usd(w0.cents) + '</b>' + esc(T2("带来充值", "Sales")) + '</span></div>' +
      '<div class="pr167l"><code>' + esc(url) + '</code><button class="btn btn-g btn-sm" data-pr167copy="1">' + esc(T2("复制", "Copy")) + '</button></div>' +
      '<div class="pr167q"><canvas id="pr167cv"></canvas></div>' +
      '<div class="pr167b"><button class="btn btn-p btn-sm" data-pr167share="1">' + esc(T2("分享…", "Share…")) + '</button><button class="btn btn-g btn-sm" data-pr167save="1">' + esc(T2("保存二维码海报", "Save QR poster")) + '</button></div>' +
      '<div class="pr167n">' + nets.map(([n, h]) => '<a href="' + esc(h) + '" target="_blank" rel="noopener">' + esc(n) + '</a>').join("") + '</div>' +
      '<p class="xs faint" style="margin-top:10px;line-height:1.55">' + esc(T2("Instagram、TikTok 没有网页分享入口：点「分享…」选它们，或者保存二维码海报后发帖、发快拍。", "Instagram and TikTok don't accept web share links: tap Share… and pick them, or save the QR poster and post it.")) + '</p>' +
      '<button class="btn btn-g btn-block" style="margin-top:10px" data-pr167me="1">' + esc(T2("查看我的全部推广收益", "See all my promo earnings")) + '</button>');
    const sh = document.querySelector(".sheet") || document;
    sh.__pr167 = { url, txt, title };
    try { await drawPoster(document.getElementById("pr167cv"), url, title, T2("和 TA 的故事，从这里开始", "Your story starts here")); } catch (_) { const q = document.querySelector(".pr167q"); if (q) q.innerHTML = '<p class="xs faint">' + esc(T2("二维码加载失败，可以先用链接分享", "QR code didn't load — share the link instead")) + '</p>'; }
  }

  async function myPromoSheet() {
    if (!on()) return needLogin();
    sheet('<h2>' + esc(T2("我的推广", "My promotions")) + '</h2><p class="sm dim" style="margin-top:6px">' + esc(T2("加载中……", "Loading…")) + '</p>');
    const me = await loadMe(true);
    if (!me) { closeSheet(); toast(T2("暂时拿不到数据，稍后再试", "Couldn't load — try again later")); return; }
    const rows = (me.byWork || []).filter(x => x.wid);
    sheet('<h2>' + esc(T2("我的推广", "My promotions")) + '</h2>' +
      '<p class="xs faint" style="margin-top:4px">' + esc(T2("推广码 ", "Code ") + me.code + T2(" · 被推广用户 " + me.days + " 天内充值的 " + Math.round(me.rate * 100) + "%，自动折成钻石", " · " + Math.round(me.rate * 100) + "% of top-ups for " + me.days + " days, paid in gems")) + '</p>' +
      '<div class="pr167s"><span><b>' + me.clicks + '</b>' + esc(T2("链接点击", "Clicks")) + '</span><span><b>' + me.users + '</b>' + esc(T2("带来新用户", "New players")) + '</span><span><b>' + me.payers + '</b>' + esc(T2("付费人数", "Payers")) + '</span></div>' +
      '<div class="pr167s"><span><b>' + usd(me.salesCents) + '</b>' + esc(T2("带来充值", "Sales")) + '</span><span><b>' + usd(me.commCents) + '</b>' + esc(T2("我的佣金", "My commission")) + '</span><span><b>💎 ' + me.gems + '</b>' + esc(T2("已到账", "Paid out")) + '</span></div>' +
      '<div class="eyebrow" style="margin-top:14px">' + esc(T2("按剧", "By story")) + '</div>' +
      (rows.length ? '<div class="pr167t">' + rows.map(x => '<div><b>' + esc(x.title || titleOf(x.wid)) + '</b><small>' + esc(T2("点击 ", "Clicks ") + x.clicks + T2(" · 新用户 ", " · New ") + x.users + T2(" · 充值 ", " · Sales ") + usd(x.cents) + T2(" · 佣金 ", " · Earned ") + usd(x.comm)) + '</small><button class="btn btn-g btn-sm" data-promo167="' + esc(x.wid) + '">' + esc(T2("分享", "Share")) + '</button></div>').join("") + '</div>'
        : '<p class="sm dim" style="margin-top:8px;line-height:1.6">' + esc(T2("还没有推广数据。打开任意一部剧，点「📣 推广赚钻」拿到你的专属链接和二维码。", "No promo data yet. Open any story and tap “📣 Promote & earn” to get your link and QR code.")) + '</p>') +
      '<p class="xs faint" style="margin-top:12px;line-height:1.55">' + esc(T2("规则：只算通过你的链接新注册、之前没充过值的用户；不能推广给自己。佣金按累计金额折成钻石，不足 1 钻的零头留到下次。", "Only players who sign up through your link and haven't bought before count; you can't refer yourself. Commission is paid in whole gems; fractions carry over.")) + '</p>');
  }
  window.PROMO167 = { open: promoSheet, mine: myPromoSheet, loadMe };

  document.addEventListener("click", async e => {
    let x;
    if ((x = e.target.closest && e.target.closest("[data-promo167]"))) { e.preventDefault(); e.stopPropagation(); promoSheet(x.dataset.promo167); return; }
    if ((x = e.target.closest && e.target.closest("[data-pr167me]"))) { e.preventDefault(); myPromoSheet(); return; }
    const box = document.querySelector(".sheet"), info = box && box.__pr167;
    if (!info) return;
    if (e.target.closest("[data-pr167copy]")) {
      try { await navigator.clipboard.writeText(info.url); toast(T2("链接已复制", "Link copied")); } catch (_) { const c = document.querySelector(".pr167l code"); if (c) { const r = document.createRange(); r.selectNodeContents(c); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } toast(T2("长按选中复制", "Long-press to copy")); }
      return;
    }
    if (e.target.closest("[data-pr167share]")) {
      try {
        const cv = document.getElementById("pr167cv"); let files = null;
        if (cv && cv.width > 10 && navigator.canShare) { const blob = await new Promise(r => cv.toBlob(r, "image/png")); const f = new File([blob], "miru-qr.png", { type: "image/png" }); if (navigator.canShare({ files: [f] })) files = [f]; }
        if (navigator.share) { await navigator.share(Object.assign({ title: info.title, text: info.txt, url: info.url }, files ? { files } : {})); return; }
      } catch (err) { if (err && err.name === "AbortError") return; }
      try { await navigator.clipboard.writeText(info.txt + " " + info.url); toast(T2("已复制分享文案，去 App 里粘贴即可", "Copied — paste it in any app")); } catch (_) {}
      return;
    }
    if (e.target.closest("[data-pr167save]")) {
      const cv = document.getElementById("pr167cv"); if (!cv || cv.width < 10) return;
      const url = cv.toDataURL("image/png");
      try {
        const blob = await (await fetch(url)).blob(), f = new File([blob], "miru-qr.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f] }); return; }
      } catch (err) { if (err && err.name === "AbortError") return; }
      const a = document.createElement("a"); a.href = url; a.download = "miru-qr.png"; document.body.appendChild(a); a.click(); a.remove();
      toast(T2("如果没有自动保存，长按二维码图片保存", "If it didn't save, long-press the image"));
    }
  }, true);

  /* 剧详情页：在收藏按钮旁边放「📣 推广赚钻」 */
  if (typeof storyPage === "function") {
    const SPG = storyPage;
    storyPage = function (id) {
      const r = SPG.apply(this, arguments);
      try {
        const fav = document.querySelector('[data-fav="' + CSS.escape(id) + '"]');
        if (fav && !fav.parentElement.querySelector("[data-promo167]")) fav.insertAdjacentHTML("afterend", '<button class="chip" data-promo167="' + esc(id) + '" style="margin-left:6px">📣 ' + esc(T2("推广赚钻", "Promote & earn")) + '</button>');
      } catch (_) {}
      return r;
    };
  }
  /* 官方剧的详情页不走 storyPage（没有收藏按钮），在「关注」按钮旁边补一个 */
  function addStoryBtn() {
    try {
      const scr = document.getElementById("s-story"); if (!scr || scr.hidden || scr.querySelector("[data-promo167]")) return;
      const id = typeof curStory !== "undefined" ? curStory : ""; if (!id || !normWid(id)) return;
      const at = scr.querySelector("[data-fav]") || scr.querySelector("[data-follow]"); if (!at) return;
      at.insertAdjacentHTML("afterend", '<button class="chip" data-promo167="' + esc(id) + '" style="margin-left:6px">📣 ' + esc(T2("推广赚钻", "Promote & earn")) + '</button>');
    } catch (_) {}
  }
  try { const scr0 = document.getElementById("s-story"); if (scr0) new MutationObserver(() => addStoryBtn()).observe(scr0, { childList: true, subtree: false, attributes: true, attributeFilter: ["hidden"] }); } catch (_) {}
  setInterval(addStoryBtn, 1500);

  /* 「我的」页：钱包下面放「我的推广」 */
  if (typeof renderMe === "function") {
    const RM = renderMe;
    renderMe = function (v) {
      const r = RM.apply(this, arguments);
      try {
        const root = (v && v.querySelector) ? v : document;
        const wal = root.querySelector(".me-wallet");
        if (wal && !root.querySelector(".pr167card")) wal.insertAdjacentHTML("afterend", '<button class="card pr167card" data-pr167me="1"><div class="row"><div class="grow" style="text-align:left"><b>📣 ' + esc(T2("我的推广", "My promotions")) + '</b><p class="xs dim" style="margin-top:3px">' + esc(T2("分享剧的链接或二维码，好友充值你拿分佣", "Share stories — earn when friends top up")) + '</p></div><span style="color:var(--gold);font-size:20px">›</span></div></button>');
      } catch (_) {}
      return r;
    };
  }

  const st = document.createElement("style");
  st.textContent = ".pr167s{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:12px}.pr167s span{display:flex;flex-direction:column;align-items:center;gap:2px;padding:10px 4px;border-radius:12px;background:rgba(255,255,255,.05);font-size:12px;color:var(--dim)}.pr167s b{font-size:17px;color:var(--fg,#fff)}" +
    ".pr167l{display:flex;gap:8px;align-items:center;margin-top:12px;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.06)}.pr167l code{flex:1;min-width:0;font-size:12px;word-break:break-all;user-select:all}" +
    ".pr167q{display:flex;justify-content:center;margin-top:12px}.pr167q canvas{width:min(60vw,240px);height:auto;border-radius:12px}" +
    ".pr167b{display:flex;gap:8px;justify-content:center;margin-top:12px;flex-wrap:wrap}" +
    ".pr167n{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px}.pr167n a{padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.07);color:var(--fg,#fff);font-size:13px;text-decoration:none}" +
    ".pr167t{display:flex;flex-direction:column;gap:8px;margin-top:8px}.pr167t>div{display:grid;grid-template-columns:1fr auto;gap:2px 8px;align-items:center;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.05)}.pr167t small{grid-column:1;color:var(--dim);font-size:12px}.pr167t button{grid-row:1/3;grid-column:2}" +
    ".pr167card{width:100%;text-align:left;border:0;cursor:pointer}";
  document.head.appendChild(st);
})();

/* ===== mod168: M111《全韩娱顶流都偏爱我》专属小游戏（12 个，4 套新模板：放置 / 排序 / 选择 / 配对 / 节拍） ===== */
(function () {
  if (typeof MG100 === "undefined" || typeof MG_T === "undefined") return;
  const t2 = (zh, a, b) => (zh ? a : b);
  const sh = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const el = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };

  const css = el("style");
  css.textContent = ".m168{display:flex;flex-direction:column;gap:10px;width:100%;padding:6px 4px;color:#f2ecff}" +
    ".m168 .pr{font-size:13px;line-height:1.55;color:#cdbdf5;margin:0}" +
    ".m168 .tb{height:5px;border-radius:3px;background:#2a2240;overflow:hidden}.m168 .tb i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#ff5fa2,#8f6bff);transition:width linear}" +
    ".m168 .row{display:flex;gap:8px;align-items:center;padding:11px 12px;border:1px solid #4b3d73;border-radius:12px;background:#1a1530}" +
    ".m168 .row span{flex:1;font-size:14px}.m168 .row b{color:#ff8fc0;font-size:12px;min-width:20px}" +
    ".m168 button.k{min-width:44px;min-height:44px;border-radius:10px;background:#2c2348;color:#fff;border:1px solid #6d58a8;padding:8px 10px;font-size:14px}" +
    ".m168 button.k:disabled{opacity:.35}.m168 button.k.on{background:#7a3b78;border-color:#ff8fc0}" +
    ".m168 button.go{min-height:48px;border-radius:12px;background:linear-gradient(90deg,#ff5fa2,#8f6bff);color:#fff;border:0;font-weight:700;font-size:15px}" +
    ".m168 select{max-width:52%;background:#221b3a;color:#fff;padding:10px;border-radius:9px;border:1px solid #6d58a8}" +
    ".m168 .hint{color:#ffb3d1;font-size:13px;min-height:1em;margin:0}" +
    ".m168 svg{width:100%;height:auto;max-height:210px;display:block}" +
    ".m168 .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:8px}" +
    ".m168 .slot{min-height:56px;border:1.5px dashed #6d58a8;border-radius:10px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:13px;padding:6px;background:#15112a;color:#e8dcff}" +
    ".m168 .slot.f{border-style:solid;border-color:#ff8fc0;background:#2a1d40}" +
    ".m168 .beat{display:grid;grid-template-columns:repeat(8,1fr);gap:5px}.m168 .beat i{font-style:normal;text-align:center;padding:12px 0;border-radius:8px;background:#211a38;font-weight:700;color:#9c8cc9}" +
    ".m168 .beat i.ev{color:#ffb3d1}.m168 .beat i.now{background:#8f6bff;color:#fff}.m168 .beat i.hit{background:#2f7a5a;color:#fff}.m168 .beat i.miss{background:#7a2f45;color:#fff}" +
    ".m168 .tap{min-height:84px;font-size:20px}";
  document.head.appendChild(css);

  /* 通用外壳：说明、倒计时、两次机会 */
  function shell(A, G, sub, done, T, zh, instr) {
    A.className = "mgarea m168"; A.innerHTML = "";
    sub.textContent = instr;
    if (G.img) { const im = el("img"); im.src = G.img; im.alt = ""; im.style.cssText = "width:100%;max-height:170px;object-fit:cover;border-radius:12px;display:block"; A.append(im); }
    const pr = el("p", "pr", zh ? G.pz : G.pe); A.append(pr);
    const tb = el("div", "tb"); const bar = el("i"); tb.append(bar); A.append(tb);
    const secs = G.seconds || 35; let over = false, tries = 0;
    requestAnimationFrame(() => { bar.style.transitionDuration = secs + "s"; bar.style.width = "0%"; });
    T.push(setTimeout(() => { if (!over) { over = true; done("lose"); } }, secs * 1000));
    const body = el("div", "m168b"); body.style.cssText = "display:flex;flex-direction:column;gap:8px"; A.append(body);
    const hint = el("p", "hint");
    const submit = ok => { if (over) return; if (ok) { over = true; done("win"); } else if (tries++ < 1) { hint.textContent = t2(zh, "还差一点，再核对一次。", "Not quite. Check once more."); } else { over = true; done("lose"); } };
    return { body, hint, submit, isOver: () => over };
  }
  const L = (x, zh) => (Array.isArray(x) ? x[zh ? 0 : 1] : x);

  /* 排序：items 已是正确顺序 */
  MG_T.m111_order = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "用 ↑ ↓ 调整顺序，再点核对。", "Use ↑ ↓ to reorder, then check."));
    let ord = sh(G.items.map((_, i) => i)); if (ord.every((n, i) => n === i)) ord.reverse();
    const draw = () => {
      c.body.innerHTML = "";
      ord.forEach((id, p) => {
        const r = el("div", "row"); r.append(el("b", "", String(p + 1)), el("span", "", L(G.items[id], zh)));
        [[-1, "↑"], [1, "↓"]].forEach(([d, s]) => { const b = el("button", "k", s); b.disabled = p + d < 0 || p + d >= ord.length; b.setAttribute("aria-label", t2(zh, "移动", "Move") + s); b.onclick = () => { [ord[p], ord[p + d]] = [ord[p + d], ord[p]]; draw(); }; r.append(b); });
        c.body.append(r);
      });
      const go = el("button", "go", t2(zh, "核对顺序", "Check order")); go.onclick = () => c.submit(ord.every((n, i) => n === i));
      c.body.append(go, c.hint);
    };
    draw();
  };

  /* 放置：先点碎片，再点位置 */
  MG_T.m111_place = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "先点一块碎片，再点它在照片上的位置。", "Tap a fragment, then tap where it belongs."));
    const put = G.slots.map(() => -1); let sel = -1;
    const draw = () => {
      c.body.innerHTML = "";
      c.body.insertAdjacentHTML("beforeend", '<svg viewBox="0 0 300 120" aria-hidden="true"><rect x="8" y="8" width="284" height="104" rx="6" fill="#241c3d" stroke="#6d58a8"/><g fill="#3a2f5e">' + [0, 1, 2, 3, 4, 5, 6].map(i => '<circle cx="' + (40 + i * 37) + '" cy="52" r="13"/><rect x="' + (29 + i * 37) + '" y="66" width="22" height="34" rx="6"/>').join("") + '</g><path d="M258 8 L292 8 L292 46 Z" fill="#120e22"/><text x="150" y="26" fill="#9c8cc9" font-size="11" text-anchor="middle">ECLIPSE · 7</text></svg>');
      const sl = el("div", "grid");
      G.slots.forEach((s, i) => { const b = el("button", "slot" + (put[i] >= 0 ? " f" : ""), put[i] >= 0 ? "✓ " + L(G.items[put[i]], zh) : L(s, zh)); b.onclick = () => { if (sel < 0) { if (put[i] >= 0) { put[i] = -1; draw(); } return; } const old = put.indexOf(sel); if (old >= 0) put[old] = -1; put[i] = sel; sel = -1; draw(); }; sl.append(b); });
      c.body.append(el("p", "pr", t2(zh, "照片位置", "Photo positions")), sl, el("p", "pr", t2(zh, "碎片", "Fragments")));
      const pc = el("div", "grid");
      G.order = G.order || sh(G.items.map((_, i) => i));
      G.order.forEach(i => { if (put.includes(i)) return; const b = el("button", "k" + (sel === i ? " on" : ""), "🧩 " + L(G.items[i], zh)); b.onclick = () => { sel = sel === i ? -1 : i; draw(); }; pc.append(b); });
      c.body.append(pc);
      const go = el("button", "go", t2(zh, "拼好了", "Done")); go.onclick = () => c.submit(put.every((v, i) => v === i));
      c.body.append(go, c.hint);
    };
    G.order = null; draw();
  };

  /* 单选：可附示意图 svg(zh) 与选项 */
  MG_T.m111_pick = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, L(G.ask, zh));
    let sel = -1;
    const opts = sh(G.items.map((_, i) => i));
    const draw = () => {
      c.body.innerHTML = "";
      if (G.svg) c.body.insertAdjacentHTML("beforeend", G.svg(zh, sel));
      const g = el("div", G.items.length > 4 ? "grid" : ""); if (G.items.length <= 4) g.style.cssText = "display:flex;flex-direction:column;gap:8px";
      opts.forEach(i => { const b = el("button", "k" + (sel === i ? " on" : ""), L(G.items[i], zh)); b.style.textAlign = "left"; b.onclick = () => { sel = i; draw(); }; g.append(b); });
      const go = el("button", "go", t2(zh, "确认", "Confirm")); go.disabled = sel < 0; go.onclick = () => c.submit(sel === G.ans);
      c.body.append(g, go, c.hint);
    };
    draw();
  };

  /* 配对：items [左, 右]，右侧打乱成下拉 */
  MG_T.m111_match = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "给每一项选出正确的对应。", "Match each item to the right one."));
    const right = sh(G.items.map((_, i) => i)); const ss = [];
    G.items.forEach(it => {
      const r = el("label", "row"); const s = el("span", "", L(it[0], zh)); const q = el("select");
      q.setAttribute("aria-label", s.textContent);
      const e = el("option", "", t2(zh, "选择…", "Choose…")); e.value = ""; q.append(e);
      right.forEach(j => { const o = el("option", "", L(G.items[j][1], zh)); o.value = j; q.append(o); });
      r.append(s, q); c.body.append(r); ss.push(q);
    });
    const go = el("button", "go", t2(zh, "核对", "Check")); go.onclick = () => c.submit(ss.every((q, i) => q.value === String(i)));
    c.body.append(go, c.hint);
  };

  /* 节拍：在 2/4/6/8 拍时点击，允许 1 次失误 */
  MG_T.m111_beat = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "点「开始」，在亮起的 2、4、6、8 拍按下「踩点」。", "Press Start, then tap on counts 2, 4, 6 and 8."));
    const row = el("div", "beat"); const cells = [];
    for (let i = 1; i <= 8; i++) { const x = el("i", i % 2 ? "" : "ev", String(i)); cells.push(x); row.append(x); }
    const tap = el("button", "go tap", t2(zh, "开始", "Start"));
    c.body.append(row, tap, c.hint);
    let ac = null; const tick = hi => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = hi ? 880 : 520; g.gain.value = .08; o.connect(g); g.connect(ac.destination); o.start(); o.stop(ac.currentTime + .06); } catch (_) {} };
    let run = false, beat = 0, t0 = 0, hit = new Set(), bad = 0; const SP = 650;
    const finish = () => {
      run = false; for (const b of [2, 4, 6, 8]) if (!hit.has(b)) { bad++; cells[b - 1].className = "miss"; }
      if (bad <= 1) c.submit(true); else { c.submit(false); if (!c.isOver()) { tap.textContent = t2(zh, "再来一次", "Try again"); } }
    };
    tap.onclick = () => {
      if (c.isOver()) return;
      if (!run) {
        run = true; beat = 0; hit = new Set(); bad = 0; cells.forEach((x, i) => x.className = i % 2 ? "ev" : ""); tap.textContent = t2(zh, "踩点！", "Tap!"); c.hint.textContent = "";
        t0 = performance.now() + SP;
        for (let i = 1; i <= 8; i++) T.push(setTimeout(() => { if (!run) return; beat = i; cells.forEach((x, k) => x.classList.toggle("now", k === i - 1 && !x.classList.contains("hit"))); tick(i % 2 === 0); }, SP * i));
        T.push(setTimeout(() => { if (run) finish(); }, SP * 9));
        return;
      }
      const now = performance.now(), pos = (now - t0) / SP + 1, near = Math.round(pos);
      if (near % 2 === 0 && near >= 2 && near <= 8 && Math.abs(pos - near) < .42 && !hit.has(near)) { hit.add(near); cells[near - 1].className = "hit"; }
      else bad++;
    };
  };

  /* ---------- 示意图 ---------- */
  const svgSeal = (zh) => '<svg viewBox="0 0 300 130" aria-hidden="true"><rect x="70" y="8" width="160" height="114" rx="6" fill="#2a2240" stroke="#6d58a8"/><line x1="150" y1="8" x2="150" y2="122" stroke="#6d58a8"/><rect x="128" y="40" width="44" height="22" fill="#d9d2ff" opacity=".35"/><rect x="132" y="56" width="40" height="24" fill="#ff8fc0" opacity=".55"/><text x="152" y="72" font-size="9" fill="#fff" text-anchor="middle">' + t2(zh, "新", "NEW") + '</text><path d="M126 62 q6 4 12 0" stroke="#c9a46a" stroke-width="3" fill="none"/><text x="20" y="120" font-size="10" fill="#9c8cc9">' + t2(zh, "档案柜 B-3", "Cabinet B-3") + '</text></svg>';
  const svgWave = (zh, sel) => { const segs = [[10, 100], [105, 195], [200, 290]]; let p = ""; for (let x = 10; x < 290; x += 3) { let h = 6 + 14 * Math.abs(Math.sin(x * .13)) * (x < 100 ? 1 : x > 200 ? .35 : .4); if (x > 125 && x < 175 && ((x - 125) % 18) < 5) h = 44; p += "M" + x + " " + (65 - h) + "V" + (65 + h); } return '<svg viewBox="0 0 300 130" aria-hidden="true"><rect width="300" height="130" rx="8" fill="#15112a"/><path d="' + p + '" stroke="#8f6bff" stroke-width="2"/>' + segs.map((s, i) => '<text x="' + ((s[0] + s[1]) / 2) + '" y="122" fill="#cdbdf5" font-size="11" text-anchor="middle">' + ["A", "B", "C"][i] + '</text>').join("") + '<text x="10" y="16" fill="#9c8cc9" font-size="10">REC_0312.wav</text></svg>'; };
  const svgLights = (zh) => '<svg viewBox="0 0 300 120" aria-hidden="true"><rect width="300" height="120" rx="8" fill="#15112a"/>' + [1, 2, 3, 4, 5, 6, 7].map(i => { const x = 18 + (i - 1) * 40; return '<rect x="' + x + '" y="14" width="30" height="70" rx="4" fill="#241c3d" stroke="#6d58a8"/><rect x="' + (x + 4) + '" y="' + (i === 7 ? 22 : 50) + '" width="22" height="8" fill="' + (i === 7 ? "#ff5f7a" : "#8f6bff") + '"/><text x="' + (x + 15) + '" y="100" fill="#cdbdf5" font-size="10" text-anchor="middle">' + i + '</text><text x="' + (x + 15) + '" y="113" fill="' + (i === 7 ? "#ff8fc0" : "#7d70a8") + '" font-size="7" text-anchor="middle">' + (i === 7 ? "op_2023×" : "op_" + ["kim", "lee", "park", "choi", "han", "yoon"][i - 1]) + '</text>'; }).join("") + '</svg>';
  const svgEdit = (zh) => '<svg viewBox="0 0 300 120" aria-hidden="true"><rect width="300" height="120" rx="8" fill="#15112a"/><text x="10" y="22" fill="#cdbdf5" font-size="10">' + t2(zh, "原始监控", "Original CCTV") + '</text><rect x="10" y="28" width="280" height="16" fill="#8f6bff"/><rect x="150" y="28" width="40" height="16" fill="#ff8fc0"/><text x="10" y="70" fill="#cdbdf5" font-size="10">' + t2(zh, "流出版本", "Leaked clip") + '</text><rect x="10" y="76" width="140" height="16" fill="#8f6bff"/><rect x="150" y="76" width="140" height="16" fill="#8f6bff"/><line x1="150" y1="72" x2="150" y2="96" stroke="#fff" stroke-dasharray="2 2"/><text x="10" y="112" fill="#7d70a8" font-size="9">08:31:00</text><text x="290" y="112" fill="#7d70a8" font-size="9" text-anchor="end">08:31:40</text></svg>';
  const svgRail = (zh) => '<svg viewBox="0 0 300 140" aria-hidden="true"><rect width="300" height="140" rx="8" fill="#15112a"/><rect x="40" y="26" width="220" height="10" rx="5" fill="#b8b0d8"/><rect x="60" y="36" width="8" height="74" fill="#8a82ad"/><rect x="232" y="36" width="8" height="74" fill="#8a82ad"/><rect x="40" y="110" width="50" height="14" fill="#6c6491"/><rect x="210" y="110" width="50" height="14" fill="#6c6491"/><circle cx="52" cy="117" r="4" fill="#ddd"/><circle cx="78" cy="117" r="4" fill="#ddd"/><circle cx="222" cy="117" r="4" fill="#ddd"/><circle cx="248" cy="117" r="4" fill="none" stroke="#ff8fc0" stroke-dasharray="2 2"/><text x="150" y="18" fill="#cdbdf5" font-size="10" text-anchor="middle">' + t2(zh, "旧护栏 · 2023", "Old barrier · 2023") + '</text><text x="150" y="134" fill="#7d70a8" font-size="9" text-anchor="middle">' + t2(zh, "左底座 ←  → 右底座", "Left base ← → Right base") + '</text></svg>';

  const games = [
    { id: "m111_photo_puzzle", zh: "旧合照碎片复原", en: "Restore the Old Group Photo", tpl: "m111_place", seconds: 40,
      pz: "旧合照的角落被撕去了。把三块碎片拼回原位，找出第七人的舞台证件号。", pe: "A corner of the old group photo was torn away. Put the three fragments back to reveal the seventh performer’s badge number.",
      slots: [["右上角", "Top-right corner"], ["中间背景", "Center background"], ["下方胸前", "Lower chest area"]],
      items: [["日期角标", "Date stamp"], ["舞台入口", "Stage entrance"], ["第七人证件号", "Seventh badge number"]] },
    { id: "m111_archive_seal", zh: "旧档案封条核验", en: "Check the Archive Seal", tpl: "m111_pick", seconds: 35, svg: svgSeal,
      pz: "档案柜上有两层封条。比对痕迹，判断柜子最近一次被打开的证据。", pe: "The cabinet carries two layers of seals. Compare the traces to find proof of when it was last opened.",
      ask: ["哪一处痕迹证明封条最近被换过？", "Which trace proves the seal was replaced recently?"],
      items: [["透明封条完整", "The clear seal is intact"], ["旧胶残留", "Old adhesive residue"], ["新封条压在旧胶上", "A new seal sits over the old adhesive"]], ans: 2 },
    { id: "m111_choreo_timeline", zh: "七人舞步时间线", en: "The Seven-Member Timeline", tpl: "m111_order", seconds: 35,
      pz: "三年前那次彩排的录像只剩三个时码。按发生顺序排好。", pe: "Only three timecodes survive from that rehearsal three years ago. Put them in the order they happened.",
      items: [["七人站位就绪", "Seven members in position"], ["护栏发生位移", "The barrier shifts"], ["音乐停止", "The music stops"]] },
    { id: "m111_audio_wave", zh: "录音警报声波定位", en: "Find the Alarm in the Audio", tpl: "m111_pick", seconds: 35, svg: svgWave,
      pz: "珉载的录音里藏着一段被剪掉的警报。找出三连短警报峰所在的片段。", pe: "Min-jae’s recording hides an alarm someone cut out. Find the segment with three short alarm peaks.",
      ask: ["警报在哪一段？", "Which segment holds the alarm?"],
      items: [["A 段 · 歌声波形", "A · Vocal waveform"], ["B 段 · 三连短峰", "B · Three short peaks"], ["C 段 · 尾奏余响", "C · Outro reverb"]], ans: 1 },
    { id: "m111_spotlight_cue", zh: "七束追光异常检测", en: "Find the Rogue Spotlight", tpl: "m111_pick", seconds: 35, svg: svgLights,
      pz: "灯控台上有七路追光。其中一路由已经失效的账号发出。", pe: "The lighting desk runs seven spotlight tracks. One was triggered by an expired account.",
      ask: ["哪一路是未经批准的？", "Which track was never approved?"],
      items: [["轨道 1", "Track 1"], ["轨道 2", "Track 2"], ["轨道 3", "Track 3"], ["轨道 4", "Track 4"], ["轨道 5", "Track 5"], ["轨道 6", "Track 6"], ["轨道 7", "Track 7"]], ans: 6 },
    { id: "m111_leak_edit", zh: "偷拍剪辑差异比对", en: "Spot the Edited Footage", tpl: "m111_pick", seconds: 35, svg: svgEdit,
      pz: "把流出视频和原始监控放在一起，找出被删掉的八秒。", pe: "Line up the leaked clip with the original security footage and find the missing eight seconds.",
      ask: ["流出版本删掉了哪一段？", "What did the leaked version cut?"],
      items: [["08:31:00 两人交谈", "08:31:00 Two people talking"], ["08:31:12–08:31:20 主管走进镜头", "08:31:12–08:31:20 The supervisor walks into frame"], ["08:31:30 镜头转向走廊", "08:31:30 Camera pans to the hallway"]], ans: 1 },
    { id: "m111_barrier_inspection", zh: "旧护栏安全检查", en: "Inspect the Old Barrier", tpl: "m111_pick", seconds: 35, svg: svgRail,
      pz: "这是当年事故中的旧护栏。找出缺失固定件的位置。检查结果仍需独立检验员确认。", pe: "This is the barrier from the old accident. Find where a fastener is missing. An independent inspector must still confirm it.",
      ask: ["哪里少了原装螺栓？", "Where is the original bolt missing?"],
      items: [["扶手上缘", "Top of the handrail"], ["底座左侧", "Left side of the base"], ["底座右侧", "Right side of the base"]], ans: 2 },
    { id: "m111_encore_setlist", zh: "安可舞台编排", en: "Build a Safe Encore Setlist", tpl: "m111_order", seconds: 35,
      pz: "为东京站安排三段安可：要安全，也要留住成员的创作。不使用移动升降台。", pe: "Arrange three encore segments for Tokyo: safe, and still true to the members’ ideas. No moving platforms.",
      items: [["粉丝互动", "Fan singalong"], ["全员合唱", "Full-group number"], ["静态灯光谢幕", "Static-light finale"]] },
    { id: "m111_lift_log", zh: "舞台升降机日志", en: "Read the Lift Log", tpl: "m111_order", seconds: 35,
      pz: "把升降机系统的三条事件按时间排好，锁定异常的远程指令。", pe: "Put the three lift-system events in time order to pin down the rogue remote command.",
      items: [["失效凭据登录", "Login with an expired credential"], ["远程重设参数", "Remote parameter reset"], ["高度故障报警", "Height fault alarm"]] },
    { id: "m111_final_eight", zh: "安全八拍编舞", en: "Complete the Eight-Count Routine", tpl: "m111_beat", seconds: 45,
      pz: "和泰贤一起试跳去掉危险高抬动作的八拍。在 2、4、6、8 拍踩点，允许失误一次。", pe: "Rehearse Tae-hyun’s eight counts with the risky lift removed. Hit counts 2, 4, 6 and 8. One miss is allowed." },
    { id: "m111_evidence_chain", zh: "证据链交叉核验", en: "Cross-Check the Evidence", tpl: "m111_match", seconds: 40,
      pz: "把三份证据对应到它能证明的内容。主观责任仍需独立调查确认。", pe: "Match each piece of evidence to what it proves. Intent still needs an independent investigation.",
      items: [[["原始警报录音", "Original alarm recording"], ["事故时间线", "The accident timeline"]], [["后台账号日志", "Backstage account log"], ["远程操作", "The remote operation"]], [["合同条款", "Contract clause"], ["潜在利益动机", "A possible financial motive"]]] },
    { id: "m111_final_cue", zh: "最终场演出提示核对", en: "Final Show Cue Check", tpl: "m111_match", seconds: 40,
      pz: "开演前核对三张提示卡，确保纪念灯光不会干扰主舞台安全。", pe: "Check the three cue cards before the show so the tribute light never interferes with stage safety.",
      items: [[["音乐开始", "Music start"], ["音频台", "Audio desk"]], [["安全确认", "Safety sign-off"], ["舞监台", "Stage manager desk"]], [["纪念灯光", "Tribute light"], ["独立静态灯位", "Separate static light position"]]] }
  ];
  games.forEach((g, n) => { g.img = "https://miru.plus/art/official/m111-idol/m111-idol/mg_c" + String(n + 1).padStart(2, "0") + "_base.jpg"; });
  for (const g of games) { const i = MG100.findIndex(x => x.id === g.id); const v = Object.assign({ a: "", b: "", kw: [] }, g); if (i >= 0) MG100[i] = v; else MG100.push(v); }
  /* 剧本里 ⟦MG|x⟧ 运行时查的是 g_x，这里两个名字都注册 */
  const reg = list => { for (const g of list) { for (const id of [g.id, "g_" + g.id.replace(/^g_/, "")]) { const v = Object.assign({ a: "", b: "", kw: [] }, g, { id }); const i = MG100.findIndex(x => x.id === id); if (i >= 0) MG100[i] = v; else MG100.push(v); } } };
  reg(games);
  window.MG168 = { reg };
  window.M111G = games;
})();

/* ===== mod169: 点「本章目标」弹出任务说明——这一章要做什么、每个目标怎么完成（所有剧本） ===== */
(function () {
  "use strict";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const T = (a, b) => (zh() ? a : b);
  const E = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const css = document.createElement("style");
  css.textContent = ".g163{cursor:pointer}.g163::after{content:'ⓘ';margin-left:2px;color:#F6D3AE;opacity:.8}" +
    ".gm169{position:fixed;inset:0;z-index:95;background:rgba(8,6,12,.72);display:flex;align-items:flex-end;justify-content:center}" +
    ".gm169 .bx{width:100%;max-width:440px;max-height:78vh;overflow:auto;background:#17131F;color:#f4ecf7;border:1px solid rgba(240,183,126,.3);border-radius:20px 20px 0 0;padding:18px 18px calc(18px + env(safe-area-inset-bottom,0px))}" +
    ".gm169 h4{margin:0 0 6px;font-size:16px;color:#F6D3AE}.gm169 .gl{font-size:13.5px;line-height:1.6;margin:0 0 14px;color:#e6dcef}" +
    ".gm169 .it{display:flex;gap:10px;padding:11px 12px;border:1px solid #3e3352;border-radius:12px;margin:0 0 8px;background:#1f1a2b}" +
    ".gm169 .it.ok{opacity:.6}.gm169 .ck{flex:none;width:22px;height:22px;border-radius:50%;border:1.5px solid #8b78b8;display:flex;align-items:center;justify-content:center;font-size:12px}" +
    ".gm169 .it.ok .ck{background:#2f7a5a;border-color:#2f7a5a}.gm169 .it b{display:block;font-size:14px;margin-bottom:3px}.gm169 .it small{font-size:12.5px;line-height:1.5;color:#c9bedb}" +
    ".gm169 .tip{font-size:12px;color:#a99cbf;line-height:1.55;margin:10px 0 12px}.gm169 button.cl{width:100%;min-height:46px;border-radius:12px;border:0;background:#3a2f52;color:#fff;font-size:15px}";
  document.head.appendChild(css);

  function howTo(d) {
    if (d.type === "say") return T("在对话里说出或做出：", "Say or do this in the conversation: ") + d.val;
    const f = String(d.val || "");
    if (/^mg_/.test(f)) {
      const id = f.replace(/^mg_/, "").replace(/_win$/, "");
      const g = typeof MG100 !== "undefined" && MG100.find(x => x.id === id);
      return T("完成本章小游戏", "Win this chapter's mini-game") + (g ? T("《" + g.zh + "》", " “" + g.en + "”") : "") + T("。跳过或失败也能继续，但这一项要赢了才算完成。", ". You can skip it, but this goal counts only when you win.");
    }
    if (/evidence|clue|seen|found/i.test(f)) return T("跟着剧情走，留意场景里出现的关键线索；线索出现后会自动打勾。", "Follow the scene and watch for the key clue. It ticks off automatically once the clue appears.");
    if (/choice|pick|final/i.test(f)) return T("在本章结尾的选择里做出你的决定。", "Make your decision at the chapter's closing choice.");
    return T("继续推进当前剧情，相关事件发生后会自动完成。", "Keep the story moving; this completes when the event happens.");
  }

  function show() {
    try {
      const th = S.threads[curT]; if (!th || !th.pk || !window.GOAL163) return;
      const gs = GOAL163.goals(th); if (!gs.length) return;
      const g = GOAL163.state(th);
      let goal = "";
      try { const c = wd(th.wid).pack.chapters[(+th.pk.ch || 1) - 1]; const x = c && c.goal; goal = x ? (typeof x === "string" ? x : (zh() ? x.zh : x.en) || x.zh || x.en || "") : ""; } catch (_) {}
      const done = gs.filter((_, i) => g.ok[i]).length;
      const ov = document.createElement("div"); ov.className = "gm169";
      ov.innerHTML = '<div class="bx" role="dialog" aria-label="' + E(T("本章目标", "Chapter goals")) + '"><h4>🎯 ' + E(T("第 " + (th.pk.ch || 1) + " 章目标", "Chapter " + (th.pk.ch || 1) + " goals")) + ' · ' + done + '/' + gs.length + '</h4>' +
        (goal ? '<p class="gl">' + E(goal) + '</p>' : '') +
        gs.map((d, i) => '<div class="it' + (g.ok[i] ? " ok" : "") + '"><span class="ck">' + (g.ok[i] ? "✓" : "") + '</span><div><b>' + E(d.name || d.val) + '</b><small>' + E(howTo(d)) + '</small></div></div>').join("") +
        '<p class="tip">' + E(T("目标全部完成后，「进入下一章」才会出现。卡住了也没关系：多聊几轮，角色会把话题往目标上带，聊得够久也会自动放行。", "“Next chapter” appears once every goal is done. Stuck? Keep talking — the characters will steer toward the goal, and after enough turns it unlocks on its own.")) + '</p>' +
        '<button class="cl">' + E(T("知道了", "Got it")) + '</button></div>';
      ov.addEventListener("click", e => { if (e.target === ov || e.target.closest(".cl")) ov.remove(); });
      document.body.appendChild(ov);
    } catch (e) { console.warn("[169]", e); }
  }
  document.addEventListener("click", e => { if (e.target.closest && e.target.closest("#s-chat .g163")) { e.preventDefault(); show(); } }, true);
  window.GOAL169 = { show };
})();

/* ===== mod170: M112《六位魔王都不准我死》24 个小游戏（每章 2 个），复用 mod168 的模板 ===== */
(function () {
  if (typeof MG_T === "undefined" || !window.MG168) return;
  /* 没有对错的选择题：选哪个都算完成（纪念物、未来规划） */
  MG_T.m112_free = function (A, G, sub, done, T, zh) {
    A.className = "mgarea m168"; A.innerHTML = ""; sub.textContent = zh ? G.ask[0] : G.ask[1];
    const p = document.createElement("p"); p.className = "pr"; p.textContent = zh ? G.pz : G.pe; A.append(p);
    G.items.forEach(it => { const b = document.createElement("button"); b.className = "k"; b.style.textAlign = "left"; b.textContent = it[zh ? 0 : 1]; b.onclick = () => done("win"); A.append(b); });
  };
  const O = (id, zh, en, tpl, pz, pe, extra) => Object.assign({ id, zh, en, tpl, seconds: 40, pz, pe }, extra || {});
  const games = [
    O("m112_01_a", "审判钟声同步", "Trial Bell Rhythm", "m111_beat", "钟声回荡三次，在 2、4、6、8 拍轻触，为卢西恩受诅咒的羽翼争取片刻稳定。", "The bell echoes. Tap on counts 2, 4, 6 and 8 to steady Lucien's cursed wing."),
    O("m112_01", "断裂的处刑锁链", "The Broken Execution Chain", "m111_order", "处刑结界由四道符文锁住。按正确顺序拆解，结界才会失效。", "Four runes hold the execution barrier. Undo them in the right order to break it.", { items: [["外圈封印", "Outer seal"], ["钟声符", "Bell rune"], ["锁链符", "Chain rune"], ["核心王印", "Royal core seal"]] }),
    O("m112_02_a", "王储的誓约试探", "The Prince's Vow", "m111_pick", "卡西安递来三张誓言卡。哪一句既公开保护你，又不替你做决定？", "Cassian offers three vow cards. Which one protects you openly without deciding for you?", { ask: ["选出真正的誓言", "Choose the honest vow"], items: [["“从今天起，你哪里都不准去。”", "“From today, you go nowhere.”"], ["“我当众护着你，去留由你自己定。”", "“I'll protect you in public. Whether you stay is your call.”"], ["“只要你听我的，我就保你不死。”", "“Obey me and I'll keep you alive.”"]], ans: 1 }),
    O("m112_02", "王室印章碎片", "Royal Seal Fragments", "m111_pick", "四枚契约印鉴里，有一枚是伪造的第 99 世契约。", "One of these four contract seals is the forged 99th-life contract.", { ask: ["哪一枚是伪造的？", "Which seal is forged?"], items: [["第 97 世：王冠纹七道齿", "97th life: crown with seven teeth"], ["第 98 世：王冠纹七道齿", "98th life: crown with seven teeth"], ["第 99 世：王冠纹只有六道齿", "99th life: crown with only six teeth"], ["第 100 世：王冠纹七道齿", "100th life: crown with seven teeth"]], ans: 2 }),
    O("m112_03_a", "白羽天平", "Feather Balance", "m111_pick", "判决天平左盘已有 5 份重量。三枚羽片分别重 1、2、3。怎样放才能让天平平衡？", "The left pan already holds 5. The feathers weigh 1, 2 and 3. How do you balance the scale?", { ask: ["选出让天平平衡的放法", "Pick the balancing move"], items: [["右盘放 2 和 3", "Put 2 and 3 on the right"], ["右盘放 1 和 3", "Put 1 and 3 on the right"], ["右盘放全部三枚", "Put all three on the right"]], ans: 0 }),
    O("m112_03", "被涂改的判决书", "The Altered Verdict", "m111_pick", "卷宗里有一处批注的墨色和日期都不对。", "One annotation in the file has the wrong ink and date.", { ask: ["哪一处是伪造的批注？", "Which annotation is forged?"], items: [["“依天界律第七条审理”", "“Tried under Heaven's Law, Article 7”"], ["“判决生效于她出生前三年”", "“Verdict effective three years before her birth”"], ["“审判官卢西恩签署”", "“Signed by Inquisitor Lucien”"]], ans: 1 }),
    O("m112_04_a", "龙焰共鸣", "Dragonfire Pulse", "m111_beat", "跟着凯尔的呼吸，在 2、4、6、8 拍点燃护身火焰，别碰中心的危险火核。", "Follow Kael's breathing. Light the warding flame on 2, 4, 6 and 8, and stay clear of the core.", { seconds: 45 }),
    O("m112_04", "破损的骑士徽章", "The Damaged Knight's Badge", "m111_order", "沿着徽章背面的划痕，复原护卫队当年的出征路线。", "Follow the scratches on the badge to rebuild the guard's old route.", { items: [["王城北门", "North Gate"], ["灰岩谷", "Greyrock Valley"], ["龙骨桥", "Dragonbone Bridge"], ["边境要塞", "Border Fortress"]] }),
    O("m112_05_a", "星轨连线", "Starlight Constellation", "m111_order", "按时间顺序连接四颗星，找出记录九十九次轮回的星座。", "Connect four stars in time order to find the constellation that recorded ninety-nine loops.", { items: [["初生之星", "Star of Birth"], ["誓约之星", "Star of the Vow"], ["处刑之星", "Star of Execution"], ["重置之星", "Star of Reset"]] }),
    O("m112_05", "第 99 世沙漏", "Hourglass of the 99th Life", "m111_match", "沙漏耗尽前，把三个时间锚点和它们保存的真相对上。", "Before the sand runs out, match each time anchor to the truth it preserves.", { items: [[["过去锚点", "Past anchor"], ["第一份判决的来历", "Where the first verdict came from"]], [["现在锚点", "Present anchor"], ["今晚的处刑命令", "Tonight's execution order"]], [["未来锚点", "Future anchor"], ["一个还没被写下的明天", "A tomorrow not yet written"]]] }),
    O("m112_06_a", "影子找花", "Shadow Petals", "m111_pick", "赛拉斯藏起的花束里，有一朵被人换过。", "One flower in Silas's hidden bouquet has been swapped.", { ask: ["哪一朵被换过？", "Which flower was swapped?"], items: [["白蔷薇·花瓣完整", "White rose, petals intact"], ["夜百合·花瓣完整", "Night lily, petals intact"], ["紫鸢尾·花瓣缺口朝左", "Purple iris, notch facing left"], ["紫鸢尾·花瓣缺口朝右", "Purple iris, notch facing right"], ["黑郁金香·花瓣完整", "Black tulip, petals intact"], ["银铃兰·花瓣完整", "Silver lily-of-the-valley, intact"]], ans: 3 }),
    O("m112_06", "密令编码纸", "The Coded Order", "m111_pick", "密令写着：“月隐三刻，钟鸣之前。”推断下一次袭击的时间。", "The order reads: “Moon hidden, third quarter, before the bell.” When is the next attack?", { ask: ["下一次袭击在什么时候？", "When is the next attack?"], items: [["黎明第一声钟响", "At the first dawn bell"], ["子夜第三刻、钟响之前", "Midnight's third quarter, before the bell"], ["正午换岗时", "At the noon guard change"]], ans: 1 }),
    O("m112_07_a", "治愈印记", "Healing Sigils", "m111_match", "帮以斯拉把三道治愈印记和病人需要的效果配对，完成一场无害的仪式。", "Help Ezra match three healing sigils to what the patient needs.", { items: [[["新月印", "Crescent sigil"], ["止痛", "Ease pain"]], [["藤蔓印", "Vine sigil"], ["愈合伤口", "Close wounds"]], [["水滴印", "Droplet sigil"], ["退烧", "Break a fever"]]] }),
    O("m112_07", "六瓶记忆药剂", "Six Memory Potions", "m111_match", "按颜色和瓶底日期，查出药剂来自哪一次复活。", "Use color and the date on each bottom to trace which revival each potion came from.", { items: [[["琥珀色药剂", "Amber potion"], ["第 12 次复活", "12th revival"]], [["深蓝色药剂", "Deep-blue potion"], ["第 57 次复活", "57th revival"]], [["银白色药剂", "Silver potion"], ["第 99 次复活", "99th revival"]]] }),
    O("m112_08_a", "破碎的誓言", "Broken Promises", "m111_place", "把三块镜片放回镜框，拼出三段承诺，看看哪一段与事实不符。", "Fit three mirror shards back into the frame to rebuild three promises.", { slots: [["镜框上方", "Top of the frame"], ["镜框中间", "Middle of the frame"], ["镜框下方", "Bottom of the frame"]], items: [["“我会回来”", "“I'll come back”"], ["“我没有下令”", "“I gave no order”"], ["“我从未忘记你”", "“I never forgot you”"]] }),
    O("m112_08", "不完整的证言", "Incomplete Testimonies", "m111_match", "把四段证词放回它们发生的时间点。", "Place four testimonies at the moments they happened.", { items: [[["卡西安：我放下了王冠", "Cassian: I set down the crown"], ["审判钟第十三响", "The thirteenth bell"]], [["卢西恩：我签了字", "Lucien: I signed it"], ["处刑前一夜", "The night before the execution"]], [["凯尔：撤军令到了", "Kael: The retreat order came"], ["边境之战当天", "The day of the border battle"]], [["以斯拉：药剂换了人", "Ezra: The potion changed hands"], ["第 99 次复活", "The 99th revival"]]] }),
    O("m112_09_a", "空白书页", "The Blank Page", "m111_order", "沿着发光的墨迹，按顺序描出被改写的那一行命运。", "Trace the glowing ink in order to reveal the rewritten line of fate.", { items: [["她", "She"], ["将在今晚", "will tonight"], ["自己选择", "choose for herself"], ["明天", "tomorrow"]] }),
    O("m112_09", "命运编年册", "Chronicle of Fate", "m111_pick", "编年册里，有一句台词在每一世都一字不差地重复——那是剧本留下的破绽。", "One line repeats word for word in every life. That's the script's flaw.", { ask: ["哪一句是剧本的破绽？", "Which line is the flaw?"], items: [["“今天的风有点冷。”（只出现一次）", "“The wind is cold today.” (once)"], ["“反派千金必须在钟响时死去。”（出现 99 次）", "“The villainess must die when the bell tolls.” (99 times)"], ["“我想去看海。”（出现两次）", "“I want to see the sea.” (twice)"]], ans: 1 }),
    O("m112_10_a", "背靠背", "Back-to-Back Ward", "m111_beat", "和凯尔背靠背撑住护盾。在 2、4、6、8 拍加固，掩护城下的人撤离。", "Hold the shield back to back with Kael. Reinforce on 2, 4, 6 and 8 while people evacuate.", { seconds: 45 }),
    O("m112_10", "守卫轮岗图", "Guard Rotation Chart", "m111_order", "照着轮岗图，排出一条避开所有守卫的路线。", "Use the rotation chart to plot a route past every guard.", { items: [["趁东墙换岗穿过庭院", "Cross the yard during the east-wall change"], ["躲进地下水道", "Slip into the sewers"], ["从钟楼背面爬上去", "Climb the back of the bell tower"], ["在月落时翻出城墙", "Go over the wall at moonset"]] }),
    O("m112_11_a", "夺回真名", "True Name Echo", "m111_pick", "六个回声里，只有一个是你自己说过的承诺，其余都是别人替你写的命令。", "Of the echoes, only one is a promise you made yourself. The rest were written for you.", { ask: ["哪一句是你自己的承诺？", "Which promise is yours?"], items: [["“我会安静地接受审判。”", "“I will accept judgment quietly.”"], ["“我会按预言毁灭世界。”", "“I will destroy the world as foretold.”"], ["“我要用自己的名字活下去。”", "“I will live under my own name.”"]], ans: 2 }),
    O("m112_11", "真实姓名符文", "True-Name Runes", "m111_place", "把三块符文放回对应位置，拼出属于你的名字，解除控制。", "Set three runes back in place to spell your own name and break the control.", { slots: [["第一位：起始", "First: beginning"], ["第二位：誓约", "Second: vow"], ["第三位：归属", "Third: belonging"]], items: [["晨光符", "Dawn rune"], ["誓言符", "Oath rune"], ["归心符", "Homeward rune"]] }),
    O("m112_12_a", "黎明纪念物", "Dawn Keepsake", "m112_free", "做一枚只属于你的纪念徽章。没有标准答案，选你想记住的。", "Make a keepsake badge of your own. There's no right answer—choose what you want to remember.", { ask: ["你想把什么刻在徽章上？", "What goes on your badge?"], items: [["断开的锁链", "A broken chain"], ["第一缕日出", "The first sunrise"], ["六个人的剪影", "Six silhouettes"], ["只写你自己的名字", "Only your own name"]] }),
    O("m112_12", "新世界地图", "Map of the New World", "m112_free", "王城要重建了。先做哪一件，由你决定。", "The city will be rebuilt. You decide what comes first.", { ask: ["你最先建设什么？", "What do you build first?"], items: [["人人都能查阅的公开法庭", "A public court anyone can access"], ["给孤儿和伤者的疗愈院", "A healing house for orphans and the injured"], ["六国共议的圆桌", "A round table for all six realms"], ["一条通往远方的自由之路", "A free road leading far away"]] })
  ];
  MG168.reg(games);
  window.M112G = games;
})();

/* ===== mod171: 所有剧本统一有「本章目标」——剧本没写 ⟦DONE⟧ 的章节，按本章目标和章末问题自动补上 ===== */
(function () {
  "use strict";
  const L = (x, k) => (x && typeof x === "object" ? String(x[k] || x.zh || x.en || "") : String(x || "")).trim();
  const clause = (s, n) => { const a = String(s || "").split(/[，。；：！？,.;:!?—（(]/)[0].trim(); return (a.length > n ? a.slice(0, n) + "…" : a); };
  const qpart = (s, n) => { const a = String(s || "").replace(/[？?！!。.\s]+$/, "").split(/[，。；：,;:]/).map(x => x.trim()).filter(Boolean).pop() || ""; return (a.length > n ? a.slice(0, n) + "…" : a); };
  const generic = s => !s || /^(你怎么做|你接下来怎么做|接下来怎么办|What do you do|What will you do next)/i.test(s);
  function make(c, lang) {
    const zh = lang === "zh", out = [];
    const g = L(c.goal, lang), a = L(c.ask, lang), t = L(c.t, lang);
    const goal = g || t;
    if (goal) out.push({ type: "say", val: (zh ? "围绕本章目标说出或做出你的打算：" : "Say or do what you intend toward this chapter's goal: ") + goal, name: clause(goal, zh ? 12 : 40), push: zh ? "旁白：眼前的人停下来，等你决定下一步。" : "旁白：They pause, waiting for your next move." });
    if (a && !generic(a) && out.length < 2) out.push({ type: "say", val: (zh ? "对这个问题做出自己的回应或选择：" : "Answer or decide on this: ") + a, name: zh ? "回应：" + qpart(a, 12) : "Answer: " + qpart(a, 40), push: zh ? "旁白：问题还摆在那里，所有人都在等你的回答。" : "旁白：The question is still open, and everyone is waiting for your answer." });
    return out;
  }
  function fill(w) {
    const cs = w && w.pack && w.pack.chapters; if (!cs || w.pack.auto171) return;
    let n = 0;
    cs.forEach(c => {
      if (!c || c.done163 || c.done || c.done163Locales) return;
      const zh = make(c, "zh"), en = make(c, "en");
      if (!zh.length) return;
      c.done163Locales = { zh, en: en.length ? en : zh }; c.done163 = zh; c.auto171 = 1; n++;
    });
    w.pack.auto171 = 1;
    if (n) { try { console.info("[171] auto goals", n); } catch (_) {} }
  }
  setInterval(() => {
    try {
      const th = S.threads[curT]; if (!(th && th.pk && th.wid && typeof wd === "function")) return;
      const w = wd(th.wid); if (!w || !w.pack || w.pack.auto171) return;
      fill(w);
      /* 已经玩到一半的章节：补上的目标直接算完成，不把老玩家卡在当前章 */
      Object.values(S.threads || {}).forEach(t => {
        if (!t || t.wid !== th.wid || !t.pk) return;
        const n = +t.pk.ch || 1, c = w.pack.chapters[n - 1];
        if (c && c.auto171 && (!t.pk.g163 || t.pk.g163.ch !== n) && (t.msgs || []).length > 3) t.pk.g163 = { ch: n, ok: c.done163.map(() => 1), r: 0, lv: 0, pushed: [] };
      });
      try { save(); } catch (_) {}
    } catch (_) {}
  }, 800);
  window.GOAL171 = { fill, make };
})();

/* ===== mod172: M113《今晚，请听我的》24 个小游戏（每章 2 个），复用 mod168 / mod170 的模板 ===== */
(function () {
  if (typeof MG_T === "undefined" || !window.MG168 || !MG_T.m112_free) return;
  const O = (id, zh, en, tpl, pz, pe, extra) => Object.assign({ id, zh, en, tpl, seconds: 40, pz, pe }, extra || {});
  const F = (id, zh, en, pz, pe, ask, items) => O(id, zh, en, "m112_free", pz, pe, { ask, items });
  const games = [
    F("m113_c01_g1", "一步之遥", "One Step Away", "Adrian 站在离你三步远的地方，等你决定距离。你随时可以喊停。", "Adrian stands three steps away, waiting for you to set the distance. You can stop at any time.", ["你希望他怎么做？", "What would you like him to do?"], [["原地别动", "Stay where you are"], ["靠近一步", "Take one step closer"], ["后退一步", "Take one step back"]]),
    F("m113_c01_g2", "红丝带交换", "The Red Ribbon Exchange", "道具台上放着一条松式红丝带。谁来戴、戴多久，都由你决定，随时可以取下。", "A loose red ribbon lies on the prop table. Who wears it, and for how long, is up to you. It comes off whenever you say.", ["这条丝带交给谁？", "Who gets the ribbon?"], [["我自己戴", "I'll wear it"], ["交给 Adrian", "Give it to Adrian"], ["今晚不用它", "Not tonight"]]),
    F("m113_c02_g1", "贵族的请求", "The Noble Request", "白色练习室里，Sebastian 把“提出邀请”的位置让给你。", "In the white practice room, Sebastian lets you be the one who asks.", ["你想怎么回应他？", "How do you answer him?"], [["请他起身，平视说话", "Ask him to stand and talk eye to eye"], ["接受他的单膝致意", "Accept his bow on one knee"], ["先给他一个拥抱", "Hug him first"], ["礼貌地拒绝", "Politely decline"]]),
    O("m113_c02_g2", "火漆与指尖", "Wax Seal & Fingertips", "m111_pick", "两枚火漆封印看起来一模一样。怎么核对，才能找出真正的差别？", "The two wax seals look identical. How do you find the real difference?", { ask: ["你怎么核对？", "How do you check?"], items: [["只凭颜色判断", "Judge by colour alone"], ["对齐 A 与 B，再翻到背面看编号", "Line up A and B, then check the numbers on the back"], ["闻一闻蜡的味道", "Smell the wax"]], ans: 1 }),
    O("m113_c03_g1", "交换主导权", "Trading the Lead", "m111_order", "镜面舞台上，一人示意、一人跟随，然后交换。把这一轮排成正确顺序。", "On the mirrored stage, one leads and one follows, then you swap. Put one round in the right order.", { items: [["先征询对方", "Ask first"], ["给出示意", "Give the cue"], ["对方回应", "They respond"], ["交换主导", "Swap the lead"]] }),
    O("m113_c03_g2", "心跳四拍", "Four Heartbeats", "m111_beat", "Dante 在桌面上敲出节拍，看你能不能跟上。", "Dante taps a rhythm on the table and dares you to keep up."),
    O("m113_c04_g1", "蒙眼听声", "Follow My Voice", "m111_pick", "你闭上眼睛。Julian 说：“跟着我的声音走。”三种声音同时响起。", "You close your eyes. Julian says, \"Follow my voice.\" Three sounds come at once.", { ask: ["哪一个才是 Julian？", "Which one is Julian?"], items: [["左侧的铃声", "A bell on the left"], ["身后的脚步声", "Footsteps behind you"], ["正前方平稳的口令声", "A calm voice straight ahead"]], ans: 2 }),
    O("m113_c04_g2", "一声之后", "After the Chime", "m111_order", "录音里有三个声音。按发生的先后排好，时间线就清楚了。", "The recording holds three sounds. Put them in order and the timeline becomes clear.", { items: [["铃声", "The bell"], ["金属扣声", "A metal clasp clicking"], ["钟响", "The clock striking"]] }),
    F("m113_c05_g1", "假面距离", "Masked Distance", "假面舞会的音乐响起。跳不跳、靠多近，都由你决定。", "The masquerade music starts. Whether you dance, and how close, is your call.", ["你怎么做？", "What do you do?"], [["牵手共舞，近一步", "Take his hand and step closer"], ["共舞，但保持一臂距离", "Dance, but keep an arm's length"], ["在旁边看就好", "Just watch from the side"]]),
    O("m113_c05_g2", "面具后的名字", "The Name Behind the Mask", "m111_pick", "人群里有人戴着和邀请函同样的印记。Kai 低声问：“你要靠什么认人？”", "Someone in the crowd wears the same mark as your invitation. Kai whispers, \"How will you tell who it is?\"", { ask: ["最可靠的辨认方法是？", "What's the most reliable way?"], items: [["只听声音", "Their voice alone"], ["旧封印加上约定手势，一起核对", "The old seal plus the agreed hand signal, together"], ["看衣袖纽扣", "Their cuff buttons"]], ans: 1 }),
    F("m113_c06_g1", "五人的邀请", "Five Invitations", "五个人同时向你提出邀请。接受一个、重新安排，或者都拒绝，都可以。", "All five ask you out at once. Accept one, rearrange things, or turn them all down—any choice is fine.", ["你的决定是？", "Your decision?"], [["公开选一个人", "Choose one openly"], ["分开单独聊", "Talk to each separately"], ["今晚先都暂停", "Pause everything for tonight"]]),
    O("m113_c06_g2", "谁说了真话", "Who Told the Truth?", "m111_pick", "两份口供互相矛盾。怎么判断才不会冤枉人？", "Two statements contradict each other. How do you decide without wronging anyone?", { ask: ["你怎么核对？", "How do you check?"], items: [["相信先开口的那个", "Believe whoever spoke first"], ["调取门禁时间，和两份口供交叉核对", "Pull the door-access times and cross-check both statements"], ["相信你更喜欢的那个", "Believe the one you like more"]], ans: 1 }),
    O("m113_c07_g1", "道歉的距离", "The Distance of an Apology", "m111_order", "Adrian 想道歉。一个真正的道歉应该按什么顺序？", "Adrian wants to apologise. What order does a real apology follow?", { items: [["承认事实", "Admit what happened"], ["停止越界", "Stop crossing the line"], ["说明怎么补救", "Explain how to make it right"]] }),
    O("m113_c07_g2", "并肩查看", "Side by Side", "m111_match", "授权日志摊在桌上。把每一项和它能证明的内容对应起来。", "The authorisation log lies open. Match each entry to what it proves.", { items: [[["访问权限", "Access rights"], ["谁有资格打开档案", "Who was allowed to open the file"]], [["修改时间", "Edit time"], ["改动发生在授权之前还是之后", "Whether the change came before or after approval"]], [["本人签名", "Personal signature"], ["授权是不是本人亲自签的", "Whether the approval was signed in person"]]] }),
    O("m113_c08_g1", "角色反转", "Role Reversal", "m111_order", "这一轮由你提出指引。协商的步骤应该是？", "This round, you give the direction. What are the steps of a fair negotiation?", { items: [["你先提议", "You propose"], ["对方回复", "They reply"], ["双方确认", "You both confirm"], ["执行，然后交换", "Do it, then swap"]] }),
    O("m113_c08_g2", "双人密码", "Two-Person Cipher", "m111_order", "一人读数字，一人转密码盘。按原来的顺序转出组合。", "One reads the numbers, one turns the dial. Enter the combination in order.", { items: [["07", "07"], ["11", "11"], ["19", "19"]] }),
    O("m113_c09_g1", "靠近真相", "Closer to the Truth", "m111_match", "两个人说了同一件事的不同版本。给每句话分好类。", "Two men tell different versions of the same night. Sort each statement.", { items: [[["门禁记录显示 23:40 有人进入档案室", "The access log shows someone entered the archive at 23:40"], ["事实", "Fact"]], [["Sebastian 说他听见了 Evelyn 的声音", "Sebastian says he heard Evelyn's voice"], ["证词", "Testimony"]], [["Dante 觉得寄信人就是 Adrian", "Dante thinks Adrian sent the letter"], ["猜测", "Guess"]]] }),
    O("m113_c09_g2", "午夜拼图", "Midnight Puzzle", "m111_order", "你和 Kai 把三段线索摊开。按发生的顺序排好。", "You and Kai lay out three clues. Put them in the order they happened.", { items: [["访问记录", "The access record"], ["旧信函", "The old letter"], ["新邀请函", "The new invitation"]] }),
    F("m113_c10_g1", "五封告白", "Five Confessions", "五个人轮流说出想和你发展的关系。你不必马上回答。", "Each of the five tells you what he hopes you could be. You don't have to answer now.", ["你怎么回应？", "How do you respond?"], [["和他们分别独处谈", "Talk to each of them alone"], ["听完再回答", "Hear them all, then answer"], ["今天先不谈", "Not today"]]),
    O("m113_c10_g2", "未寄出的纸条", "Unsent Notes", "m111_order", "要辨认哪张纸条从没寄出，应该按什么顺序核对？", "To find the note that was never sent, what do you check, in order?", { items: [["署名", "The signature"], ["封口", "The seal"], ["日期", "The date"]] }),
    O("m113_c11_g1", "公开还是保留", "Public or Private", "m111_pick", "听证会前，你得决定公开哪些资料。", "Before the hearing, you decide what goes public.", { ask: ["公开什么最稳妥？", "What's safest to release?"], items: [["全部资料，包括会员私人记录", "Everything, including members' private records"], ["只公开授权过、脱敏后的日志", "Only the approved, anonymised log"], ["先把未核实的指控放出去", "Release the unverified accusations first"]], ans: 1 }),
    F("m113_c11_g2", "最后的舞步", "The Final Dance", "听证会前的几分钟，只属于你们。", "A few minutes before the hearing, just for the two of you.", ["你想怎么度过？", "How do you spend them?"], [["牵手共舞", "Dance together"], ["并肩听一首歌", "Listen to one song side by side"], ["只说一声再见", "Just say goodbye"]]),
    F("m113_c12_g1", "谁在你身边", "Who Stays With You", "黎明前，你一一问清每个人的意愿。不选任何人，也是完整的结局。", "Before dawn, you ask each of them what he wants. Choosing no one is a complete ending too.", ["你打算怎么做？", "What will you do?"], [["逐个认真谈", "Talk it through with each of them"], ["不建立恋爱关系", "No romance for now"], ["之后再决定", "Decide later"]]),
    F("m113_c12_g2", "黎明约定", "A Promise at Dawn", "天亮了。在门厅里，和他们约好下一次。", "Dawn breaks. In the lobby, you make a plan for next time.", ["你的约定是？", "Your promise?"], [["一起吃早餐", "Breakfast together"], ["改天再见", "See you another day"], ["独自出发", "Leave on your own"]])
  ];
  MG168.reg(games);
  window.M113G = games;
})();

/* ===== mod173: M114《今天也想黏着你》24 个小游戏（每章 2 个），复用 mod168 / mod170 的模板 ===== */
(function () {
  if (typeof MG_T === "undefined" || !window.MG168 || !MG_T.m112_free) return;
  const O = (id, zh, en, tpl, pz, pe, extra) => Object.assign({ id, zh, en, tpl, seconds: 40, pz, pe }, extra || {});
  const F = (id, zh, en, pz, pe, ask, items) => O(id, zh, en, "m112_free", pz, pe, { ask, items });
  const games = [
    F("m114_c01_g1", "迎接温度", "Welcome Temperature", "五个人都在等你说出想被怎样欢迎。没有标准答案，选你自己的。", "All five are waiting to hear how you'd like to be welcomed. There's no right answer—pick yours.", ["你喜欢哪种欢迎？", "Which welcome feels right?"], [["一个拥抱", "A hug"], ["击个掌", "A high five"], ["安静十分钟", "Ten quiet minutes"]]),
    O("m114_c01_g2", "时间戳疑点", "Timestamp Trouble", "m111_order", "把这几件事按真实发生的先后排好，看看哪里不对劲。", "Put these events in the order they really happened, and see what doesn't add up.", { items: [["合租日历里出现“你入住”的提醒", "A “you move in” reminder appears in the shared calendar"], ["租房广告发布", "The rental listing goes up"], ["你提交入住申请", "You submit your application"], ["你搬进联排屋", "You move into the townhouse"]] }),
    O("m114_c02_g1", "金毛节奏", "Golden Retriever Rhythm", "m111_beat", "和Mason轮流投球。跟上节拍，也别忘了停下来问一句还想不想继续。", "Take turns shooting with Mason. Keep the beat—and remember to pause and ask if you both want to keep going."),
    O("m114_c02_g2", "生日来源", "Where Did the Birthday Come From?", "m111_pick", "任务表上有四条关于你的信息。哪一条没有合法来源？", "The welcome sheet lists four facts about you. Which one has no legitimate source?", { ask: ["哪一条来路不明？", "Which one came from nowhere?"], items: [["房门号——来自你的租约摘要", "Room number—from your lease summary"], ["入住日期——来自你的申请邮件", "Move-in date—from your application email"], ["你的生日——你从没告诉过任何人", "Your birthday—you never told anyone"], ["你的名字——来自门禁登记", "Your name—from the door-access registry"]], ans: 2 }),
    O("m114_c03_g1", "租约找不同", "Spot the Lease Difference", "m111_match", "两份租约放在一起。把每一处不同和它说明的问题对应起来。", "Two leases side by side. Match each difference to what it reveals.", { items: [[["签署日期", "Signing date"], ["比你看到广告还早六个月", "Six months before you even saw the listing"]], [["签名栏", "Signature line"], ["电子签名不是你亲手签的", "The e-signature isn't one you made"]], [["代理章", "Agency stamp"], ["盖的是Nolan Price公司的章", "It's stamped by Nolan Price's company"]]] }),
    F("m114_c03_g2", "留灯的距离", "Lamp-Lit Distance", "Elliot想陪你坐一会儿。离多近，由你来定。", "Elliot would like to sit with you for a while. You decide how close.", ["你想怎么坐？", "How would you like to sit?"], [["靠着他的肩膀", "Lean on his shoulder"], ["并肩坐，不碰到彼此", "Side by side, not touching"], ["隔着一张小桌聊天", "Across a small table, just talking"], ["今晚想一个人", "Tonight I'd rather be alone"]]),
    O("m114_c04_g1", "今夜菜单", "Tonight's Menu", "m111_match", "帮Noah为每位客人挑一道合适的菜。", "Help Noah pick the right dish for each guest.", { items: [[["吃素的邻居", "The vegetarian neighbor"], ["烤蔬菜意面", "Roasted vegetable pasta"]], [["对坚果过敏的Theo", "Theo, allergic to nuts"], ["无坚果番茄浓汤", "Nut-free tomato soup"]], [["嗜甜的Mason", "Mason, with a sweet tooth"], ["焦糖布丁", "Caramel pudding"]]] }),
    O("m114_c04_g2", "旧照批次", "Photo Batch Numbers", "m111_match", "把照片背面的批次号，和慈善活动目录里的场次对上。", "Match the batch numbers on the backs of the photos to the events in the charity catalog.", { items: [[["批次 FR-0412", "Batch FR-0412"], ["春季社区筹款日", "Spring community fundraiser"]], [["批次 ST-0907", "Batch ST-0907"], ["秋季共享餐桌", "Autumn shared-table dinner"]], [["批次 OH-1120", "Batch OH-1120"], ["冬季开放日", "Winter open house"]]] }),
    O("m114_c05_g1", "双人协作", "Co-op Floor Plan", "m111_match", "和Theo一起拼出房子的小地图：每个房间在哪一层？", "Build the house's mini-map with Theo: which floor is each room on?", { items: [[["共享厨房", "Shared kitchen"], ["一楼后侧", "Ground floor, back"]], [["你的房间", "Your room"], ["二楼靠窗", "Second floor, by the window"]], [["阁楼排练室", "Attic rehearsal room"], ["顶层", "Top floor"]]] }),
    O("m114_c05_g2", "同步日志", "Sync Log", "m111_order", "按日志把这份文件的去向排出来。", "Use the logs to trace where the file went, in order.", { items: [["旧物业系统生成文件", "The old property system creates the file"], ["系统错误同步发送", "A faulty sync sends it out"], ["各单元管理员收到", "Every unit admin receives it"], ["Theo在电脑里发现它", "Theo finds it on his computer"]] }),
    O("m114_c06_g1", "未完旋律", "Unfinished Melody", "m111_beat", "Jace弹出动机，你在亮起的拍子上接上它。", "Jace plays the motif. Pick it up on the lit beats."),
    O("m114_c06_g2", "巡演行李", "Tour Packing", "m111_match", "帮Jace把这个周末排开，工作和休息都不落下。", "Help Jace lay out the weekend so neither work nor rest gets dropped.", { items: [[["周五", "Friday"], ["最后一次彩排", "Final rehearsal"]], [["周六", "Saturday"], ["出发去巡演", "Leave for the tour"]], [["周日", "Sunday"], ["休息，和你视频通话", "Rest, and a video call with you"]]] }),
    F("m114_c07_g1", "周末邀约", "Weekend Plans", "五份邀约摆在面前。不用全部答应，留给自己的时间也算数。", "Five invitations in front of you. You don't have to say yes to all of them—time for yourself counts too.", ["这个周末怎么排？", "How do you plan the weekend?"], [["挑一个，留出半天休息", "Pick one and keep half a day to rest"], ["大家一起吃个早饭就好", "Just breakfast with everyone"], ["分开排在不同时间", "Spread them out at different times"], ["这周末全留给自己", "Keep the whole weekend for yourself"]]),
    O("m114_c07_g2", "录像全帧", "Full-Frame Footage", "m111_pick", "画面里的那个人，该怎么判断？", "How should you judge the man in the frame?", { ask: ["最稳妥的做法是？", "What's the soundest approach?"], items: [["凭一张截图就下结论", "Decide from one screenshot"], ["先看前后连续帧和完整录像", "Check the frames before and after, and the full footage"], ["谁说得最肯定就信谁", "Believe whoever sounds most certain"]], ans: 1 }),
    O("m114_c08_g1", "法律援助索引", "Legal Aid Index", "m111_pick", "搬离通知到底算不算数？先找一个可靠的信息来源。", "Does the eviction notice hold up? Start with a reliable source.", { ask: ["哪个来源最可靠？", "Which source is most reliable?"], items: [["匿名邮件里的链接", "A link in an anonymous email"], ["社区法律援助机构公开的信息", "Public information from a community legal-aid office"], ["论坛上陌生网友的说法", "A stranger's post on a forum"]], ans: 1 }),
    O("m114_c08_g2", "演出排班", "Show Schedule", "m111_pick", "Mason要训练，Jace要彩排。哪种安排谁都不用缺席工作？", "Mason has training and Jace has rehearsal. Which plan keeps everyone at work?", { ask: ["选出最好的安排", "Pick the best plan"], items: [["Mason翘掉训练陪你", "Mason skips training to be with you"], ["Jace推掉彩排", "Jace cancels rehearsal"], ["两人都按时上班，晚上再一起吃饭", "Both go to work on time, then dinner together tonight"]], ans: 2 }),
    O("m114_c09_g1", "产权拼图", "Ownership Puzzle", "m111_order", "把产权文件按时间排好，看谁的主张站不住。", "Put the ownership papers in order and see whose claim falls apart.", { items: [["Mara设立房屋信托", "Mara sets up the house trust"], ["Mara签署撤权备忘录", "Mara signs the memo revoking authority"], ["Nolan寄出搬离通知", "Nolan sends the eviction notice"]] }),
    O("m114_c09_g2", "快闪餐厅订单", "Pop-Up Orders", "m111_order", "三桌客人陆续到店。按到达顺序帮Noah上菜。", "Three tables arrive one by one. Help Noah serve them in order of arrival.", { items: [["7∶05 靠窗两人桌", "7:05 — window table for two"], ["7∶20 吧台单人座", "7:20 — single seat at the bar"], ["7∶40 角落四人桌", "7:40 — corner table for four"]] }),
    O("m114_c10_g1", "真实邀约", "A Sincere Invitation", "m111_match", "把每句话和说话的人对上。", "Match each line to who said it.", { items: [[["“我想继续和你见面，不附带任何亏欠。”", "“I'd like to keep seeing you. No debt attached.”"], ["Mason", "Mason"]], [["“就算你搬走，我也能约你正式吃顿饭。”", "“Even if you move, I can ask you on a real date.”"], ["Noah", "Noah"]], [["“我现在可以不回答。”", "“I don't have to answer right now.”"], ["你", "You"]]] }),
    O("m114_c10_g2", "告别节拍", "Goodbye Beat", "m111_beat", "站台上，Jace用指尖敲出一段节奏。在亮起的拍子上回应他。", "On the platform, Jace taps out a rhythm. Answer him on the lit beats."),
    O("m114_c11_g1", "代理日志", "Agency Log", "m111_order", "把授权撤销和系统操作记录按时间排好。", "Put the revocation and the system activity in order.", { items: [["Mara撤销Nolan的授权", "Mara revokes Nolan's authority"], ["Nolan仍然登录物业系统", "Nolan still logs into the property system"], ["租约文件被改动", "The lease file is altered"], ["搬离通知寄出", "The eviction notice goes out"]] }),
    O("m114_c11_g2", "道歉与补救", "Apology and Repair", "m111_match", "分清楚：哪句是承认责任，哪句是补救，哪句只是在要原谅？", "Tell them apart: which line owns the mistake, which makes it right, and which just demands forgiveness?", { items: [[["“我不该瞒着你。”", "“I shouldn't have hidden it from you.”"], ["承认责任", "Owning the mistake"]], [["“我已经把文件交给律师了。”", "“I've already handed the files to the lawyer.”"], ["补救行动", "Making it right"]], [["“你必须马上原谅我。”", "“You have to forgive me right now.”"], ["要求原谅", "Demanding forgiveness"]]] }),
    F("m114_c12_g1", "未来家规", "New House Rules", "这是你们一起写的第一条家规。你想先定哪一条？", "This is the first house rule you'll write together. Which one comes first?", ["第一条家规是？", "What's rule number one?"], [["进门之前先敲门", "Knock before coming in"], ["共享日历只放自己愿意放的", "Only share what you choose on the calendar"], ["每周留一个安静的晚上", "One quiet night every week"], ["有事当面说，不再瞒着", "Say it to my face—no more secrets"]]),
    O("m114_c12_g2", "黎明约定", "A Promise at Dawn", "m111_pick", "无论选择哪种关系，开始之前都需要一样东西。", "Whatever kind of relationship you choose, it needs one thing before it begins.", { ask: ["那是什么？", "What is it?"], items: [["谁对你最好，就默认是他", "Whoever treats you best wins by default"], ["每个人都亲口说愿意", "Everyone says yes, out loud, for themselves"], ["大家投票决定", "Everyone votes on it"]], ans: 1 })
  ];
  MG168.reg(games);
  window.M114G = games;
})();

/* ===== mod174: M115《别叫我姐姐》32 个小游戏（每章 2 个），复用 mod168 / mod170 的模板 ===== */
(function () {
  if (typeof MG_T === "undefined" || !window.MG168 || !MG_T.m112_free) return;
  const O = (id, zh, en, tpl, pz, pe, extra) => Object.assign({ id, zh, en, tpl, seconds: 40, pz, pe }, extra || {});
  const F = (id, zh, en, pz, pe, ask, items) => O(id, zh, en, "m112_free", pz, pe, { ask, items });
  const P = (id, zh, en, pz, pe, ask, items, ans) => O(id, zh, en, "m111_pick", pz, pe, { ask, items, ans });
  const R = (id, zh, en, pz, pe, items) => O(id, zh, en, "m111_order", pz, pe, { items });
  const M = (id, zh, en, pz, pe, items) => O(id, zh, en, "m111_match", pz, pe, { items });
  const games = [
    P("m115_c01_g1", "镜头前的第一步", "First Move on Camera", "直播镜头对着你们。在下结论之前，最可靠的第一步是什么？", "The livestream camera is on you both. Before jumping to conclusions, what's the most reliable first step?", ["你先做什么？", "What do you do first?"], [["看弹幕大家怎么说", "Read what the comments say"], ["核验Rowan手里资料的来源", "Verify the source of Rowan's documents"], ["只听Eli的解释", "Listen only to Eli's side"]], 1),
    P("m115_c01_g2", "少了什么", "What's Missing?", "旧平面图和Caleb记忆中的后台对不上。图上少了什么？", "The old floor plan doesn't match the backstage Caleb remembers. What's missing from it?", ["图上少了什么？", "What's missing?"], [["一部货运电梯", "A freight elevator"], ["后台的一条安全通道", "A backstage emergency exit route"], ["一间化妆间", "A dressing room"]], 1),
    M("m115_c02_g1", "通知上的疑点", "Questions on the Notice", "把搬迁通知上的每一项，和该去核实的地方对应起来。", "Match each part of the eviction notice to where you should check it.", [[["签发方", "Issuer"], ["公司登记信息", "Company registration records"]], [["签发日期", "Issue date"], ["送达记录", "Delivery records"]], [["理由：“上面的安排”", "Reason: “orders from above”"], ["房东的租赁合同", "The landlord's lease contract"]]]),
    P("m115_c02_g2", "凌晨三点的登录", "The 3 a.m. Login", "通知是凌晨三点从剧院网络发出的。这能说明什么？", "The notice was sent at 3 a.m. from the theater's network. What does that tell you?", ["这说明了什么？", "What does it mean?"], [["一定是剧院员工干的", "It must have been a theater employee"], ["用的是剧院的线路，具体是谁还要查", "Someone used the theater's connection; who still needs checking"], ["通知肯定是假的", "The notice is definitely fake"]], 1),
    R("m115_c03_g1", "第六把钥匙", "The Sixth Key", "发现了本该报废的钥匙。按正确的顺序处理它。", "You've found a key that should have been destroyed. Handle it in the right order.", [["发现钥匙，原地不动", "Find the key and leave it in place"], ["拍下钥匙编号", "Photograph the key's number"], ["和报废登记比对", "Compare it with the disposal register"], ["上报剧院登记处", "Report it to the theater registry"]]),
    R("m115_c03_g2", "那张通行证", "The Borrowed Pass", "把通行证这件事的经过按时间排好。", "Put the story of the borrowed pass in order.", [["Caleb借出临时通行证", "Caleb lends out his temporary pass"], ["助理进入后台", "The assistant enters backstage"], ["监控拍到一个背影", "The camera catches someone from behind"], ["有人把背影认成Eli", "Someone mistakes the figure for Eli"]]),
    R("m115_c04_g1", "一句话的旅程", "Journey of One Sentence", "那句关键的话，是怎么从录音变成见报版本的？", "How did that key sentence travel from the tape to print?", [["原始采访录音", "The original interview recording"], ["记者写成初稿", "The reporter's first draft"], ["编辑台改动", "The edit desk makes changes"], ["稿件见报", "The story is published"]]),
    M("m115_c04_g2", "对上原话", "Match the Words", "把每一项和它的出处对应起来。", "Match each item to where it comes from.", [[["原话：“我不确定”", "Original: “I'm not sure”"], ["原始录音", "The original tape"]], [["见报：“我确认”", "Printed: “I confirm”"], ["已发表的稿件", "The published story"]], [["发稿前十分钟的改动", "An edit ten minutes before publishing"], ["编辑系统日志", "The editing system log"]]]),
    P("m115_c05_g1", "九十秒", "Ninety Seconds", "数据库里有九十秒是空的。下一步最该做什么？", "Ninety seconds are missing from the database. What should you do next?", ["下一步？", "Next step?"], [["立刻指控Asher", "Accuse Asher right away"], ["标记空档前后的所有操作", "Flag every action before and after the gap"], ["清空数据库重来", "Wipe the database and start over"]], 1),
    R("m115_c05_g2", "备份里的顺序", "Order in the Backup", "根据外部备份，把那晚发生的事排好。", "Using the outside backup, put that night's events in order.", [["Griffin公司终端申请临时授权", "A Griffin company terminal requests temporary access"], ["监控空档开始", "The camera gap begins"], ["九十秒后记录恢复", "Recording resumes ninety seconds later"], ["外部备份保存下这一切", "The outside backup keeps a record of it all"]]),
    R("m115_c06_g1", "雨中抢修", "Repairs in the Rain", "坡道塌了。按正确的顺序处理。", "The ramp has collapsed. Handle it in the right order.", [["先疏散门口的行人", "Clear people away from the entrance"], ["拍下损坏处存证", "Photograph the damage as evidence"], ["临时加固坡道", "Shore up the ramp temporarily"], ["记录施工问题，事后追查", "Log the construction problem to follow up later"]]),
    P("m115_c06_g2", "晚了一天", "One Day Late", "撤销代理投票的日期比Eli说的晚了一天。最先该查什么？", "The proxy revocation is dated a day later than Eli said. What should you check first?", ["先查什么？", "Check what first?"], [["直接认定他撒谎", "Assume he lied"], ["系统有没有延迟提交的记录", "Whether the system shows a delayed submission"], ["他父亲怎么看", "What his father thinks"]], 1),
    P("m115_c07_g1", "照片的破绽", "Flaws in the Photos", "怎样判断这些照片是不是被拼接过？", "How can you tell whether these photos were spliced together?", ["最可靠的方法是？", "What's the most reliable way?"], [["看人物的表情", "Look at people's expressions"], ["比对光线、背景和拍摄日期", "Compare the lighting, backgrounds and dates"], ["看是谁发出来的", "Look at who posted them"]], 1),
    M("m115_c07_g2", "三份记录", "Three Records", "每个人拿出了一份记录。把人和记录对应起来。", "Each of them brought a record. Match the person to it.", [[["Rowan", "Rowan"], ["原始采访", "Original interviews"]], [["Caleb", "Caleb"], ["通行登记", "Entry log"]], [["Asher", "Asher"], ["时间核验", "Timestamp check"]]]),
    P("m115_c08_g1", "钱从哪来", "Where the Money Came From", "扩张资金来自投资方的关联基金。这说明什么？", "The expansion money came from a fund tied to the investors. What does that show?", ["这说明了什么？", "What does it show?"], [["Miles一定事先知情", "Miles must have known"], ["钱的来源有问题，他知不知情还要看合同往来", "The source is a problem; whether he knew depends on the contract trail"], ["没什么问题", "Nothing's wrong"]], 1),
    O("m115_c08_g2", "厨房的节奏", "Kitchen Rhythm", "m111_beat", "晚宴开席前，跟上Miles切菜的节奏。", "Before dinner is served, keep up with Miles's chopping rhythm."),
    P("m115_c09_g1", "交给谁", "Who Gets It?", "这箱草案可能关系到剧院能不能保住。应该交给谁？", "This box of drafts could decide whether the theater survives. Who should get it?", ["交给谁？", "Who gets it?"], [["当废纸扔掉", "Throw it out as scrap"], ["剧院的法律顾问Nora", "Nora, the theater's legal adviser"], ["直接发到网上", "Post it online"]], 1),
    R("m115_c09_g2", "箱子的来路", "Where the Box Went", "把这个箱子这几年的去向排出来。", "Trace where this box went over the years, in order.", [["导师让Caleb搬走箱子", "Caleb's mentor asks him to move the box"], ["箱子被放到舞台底下", "The box ends up under the stage"], ["箱子被标成“废弃材料”", "It gets labeled “scrap”"], ["你们发现了草案", "You find the draft"]]),
    P("m115_c10_g1", "回应指控", "Answering the Accusation", "Griffin当众指控Asher删了监控。最好的回应是？", "Griffin publicly accuses Asher of deleting footage. What's the best response?", ["怎么回应？", "How do you respond?"], [["当场和他争吵", "Argue with him on the spot"], ["调取外部备份", "Pull the outside backup"], ["让Asher立刻离场", "Have Asher leave at once"]], 1),
    F("m115_c10_g2", "取证方式", "How to Gather Evidence", "独立取证开始了。你想怎么参与？没有对错。", "Independent evidence-gathering has begun. How do you want to take part? There's no wrong answer.", ["你选择？", "Your choice?"], [["全程旁听审计", "Sit in on the whole audit"], ["只看最终报告", "Just read the final report"], ["请Rowan另作一份记录", "Ask Rowan to keep a separate record"]]),
    P("m115_c11_g1", "录音能证明什么", "What the Tape Proves", "这段录音里，能确定的是什么？", "What can this recording actually establish?", ["能确定的是？", "What's certain?"], [["说话人是谁", "Who is speaking"], ["有人下令绕过流程修改图纸", "Someone ordered the plans changed without going through the process"], ["Griffin就是主谋", "Griffin is the mastermind"]], 1),
    R("m115_c11_g2", "命令的时间线", "Timeline of the Order", "把录音相关的事按时间排好。", "Put the events around the recording in order.", [["收购谈判开始", "Acquisition talks begin"], ["有人下令修改图纸", "Someone orders the plans changed"], ["无障碍图纸被改", "The accessibility plans are altered"], ["录音文件被复制", "The recording file is copied"]]),
    R("m115_c12_g1", "那通电话之后", "After the Call", "把Eli这一晚的经过排好。", "Put Eli's night in order.", [["Eli提交证词", "Eli submits his statement"], ["父亲打来电话威胁", "His father calls with threats"], ["Eli拒绝撤回", "Eli refuses to withdraw"], ["证词送到律师手里", "The statement reaches the lawyer"]]),
    F("m115_c12_g2", "陪着他", "Stay With Him", "Eli拒绝把你当挡箭牌。你想怎么陪他？", "Eli refused to use you as a shield. How do you want to be there for him?", ["你选择？", "Your choice?"], [["安静地坐在他身边", "Sit quietly beside him"], ["握住他的手", "Hold his hand"], ["陪他聊到天亮", "Talk with him until dawn"], ["给他一个人的空间", "Give him space to be alone"]]),
    M("m115_c13_g1", "对不上的日期", "Dates That Don't Match", "把每份文件和它记录的内容对应起来。", "Match each document to what it records.", [[["董事会纪要", "Board minutes"], ["周二进行了投票", "A vote took place on Tuesday"]], [["财务摘要", "Financial summary"], ["周二没有开会", "No meeting on Tuesday"]], [["门禁记录", "Door-access log"], ["周二没人进过会议室", "No one entered the boardroom on Tuesday"]]]),
    R("m115_c13_g2", "假纪要的诞生", "How the Fake Minutes Were Made", "把伪造纪要的过程排出来。", "Lay out how the forged minutes were made.", [["旧模板被调出", "An old template is pulled up"], ["生成伪造的纪要", "Fake minutes are generated"], ["从某台设备导出", "They're exported from a device"], ["通过发布路径传出去", "They go out through the publishing channel"]]),
    M("m115_c14_g1", "事实、推测、情绪", "Fact, Guess, Feeling", "把每句话放进正确的类别。", "Put each statement in the right category.", [[["门禁显示周二没人进会议室", "The access log shows no one entered on Tuesday"], ["事实", "Fact"]], [["我觉得是Thomas干的", "I think Thomas did it"], ["推测", "Guess"]], [["这件事让我很生气", "This makes me really angry"], ["情绪", "Feeling"]]]),
    P("m115_c14_g2", "最可靠的证据", "The Most Reliable Evidence", "哪一种证据最可靠？", "Which kind of evidence is most reliable?", ["选出最可靠的", "Pick the most reliable"], [["某个人的回忆", "One person's memory"], ["有原始记录支撑的日志", "A log backed by original records"], ["网上的传言", "Rumors online"]], 1),
    P("m115_c15_g1", "初步结论", "Preliminary Findings", "审计宣读了“初步结论”。这意味着什么？", "The auditors read out “preliminary findings.” What does that mean?", ["这意味着？", "What does it mean?"], [["案子已经结束", "The case is closed"], ["图纸确被篡改、投票要重审，但还不是终点", "The plans were tampered with and the vote must be reviewed—but it's not over"], ["所有人都有罪", "Everyone is guilty"]], 1),
    M("m115_c15_g2", "各自的后果", "Each Their Consequence", "把每个人或每件事，和它现在面对的结果对应起来。", "Match each person or item to what it now faces.", [[["Griffin", "Griffin"], ["承包商链条被调查", "His contractor chain is under investigation"]], [["Thomas", "Thomas"], ["投票同盟失去程序优势", "His voting bloc loses its procedural edge"]], [["伪造的纪要", "The forged minutes"], ["操作者待审计", "The operator awaits the audit"]]]),
    F("m115_c16_g1", "你想对他们说", "What You Want to Tell Them", "Eli和Miles都在等你的看法。没有标准答案。", "Eli and Miles are both waiting to hear what you think. There's no right answer.", ["你想说？", "What do you say?"], [["去追你们的机会吧", "Go after your chances"], ["我希望你们留下", "I hope you'll stay"], ["按自己的心意选", "Choose what your heart wants"], ["我们以后再聊", "Let's talk about it later"]]),
    O("m115_c16_g2", "告别的节拍", "Farewell Beat", "m111_beat", "天台上，Caleb用指尖敲出一段节拍。在亮起的拍子上回应他。", "On the rooftop, Caleb taps out a beat. Answer him on the lit counts.")
  ];
  MG168.reg(games);
  window.M115G = games;
})();

/* ===== mod175: M117《纽约最后一家吸血鬼急诊室》32 个小游戏（每章 2 个），全部是“根据现场资料判断”的单选题 ===== */
(function () {
  if (typeof MG_T === "undefined" || !window.MG168) return;
  const P = (id, zh, en, items, ans) => ({ id, zh, en, tpl: "m111_pick", seconds: 40,
    pz: "根据眼前的资料做出判断。可以跳过，由在场的人补做核验。", pe: "Make a call based on what's in front of you. You can skip—someone on shift will double-check.",
    ask: ["哪一项判断站得住？", "Which call holds up?"], items, ans });
  const games = [
    P("m117_c01_g1", "腕带的时间裂缝", "Timestamp Rift", [["22:17与00:17来自同一日期", "22:17 and 00:17 are from the same date"], ["00:17已经出院", "He was already discharged at 00:17"], ["暂不能确定到院时间", "His arrival time can't be confirmed yet"]], 2),
    P("m117_c01_g2", "七号病房封条", "Seal of Room Seven", [["新贴封条覆盖旧铆钉", "A new seal covers the old rivets"], ["旧封条没有折痕", "The old seal has no creases"], ["只要旧就是真", "If it's old, it must be real"]], 0),
    P("m117_c02_g1", "拒收单上的同一枚章", "The Duplicate Stamp", [["A与B有相同破角", "A and B share the same chipped corner"], ["B与C只颜色相同", "B and C only share a color"], ["三份全部相同", "All three are identical"]], 0),
    P("m117_c02_g2", "捐献说明的缺失行", "Consent Form Gap", [["先解释代价再邀请决定", "Explain the cost first, then invite a decision"], ["先签字后解释", "Sign first, explain later"], ["沉默算同意", "Silence counts as consent"]], 0),
    P("m117_c03_g1", "缺页的编号", "Missing Folio", [["第12页到第14页", "Pages 12 to 14"], ["第14页到第15页", "Pages 14 to 15"], ["第8页到第9页", "Pages 8 to 9"]], 0),
    P("m117_c03_g2", "隐私黑条", "Redact the Record", [["遮住姓名与住址保留异常日期", "Black out the name and address, keep the odd dates"], ["遮住日期保留全名", "Black out the dates, keep the full name"], ["整份完整公开", "Release the whole file as is"]], 0),
    P("m117_c04_g1", "黎明前的路线", "Before Sunrise Route", [["地下通道B并复核封闭情况", "Tunnel B, after checking it's still sealed"], ["玻璃桥A最快", "Glass bridge A, the fastest"], ["临时穿过广场", "Cut across the plaza"]], 0),
    P("m117_c04_g2", "三短一长", "Three Short, One Long", [["短短短长", "Short-short-short-long"], ["短长短短", "Short-long-short-short"], ["长长短短", "Long-long-short-short"]], 0),
    P("m117_c05_g1", "两份死亡证明", "The Two Certificates", [["草签版缺公证编号", "The initialed copy has no notary number"], ["两份都必然真", "Both must be genuine"], ["年代较新一定合法", "The newer one must be legal"]], 0),
    P("m117_c05_g2", "出院计划顺序", "Discharge Independence", [["医护评估后患者自主决定住所", "After a medical review, the patient chooses where to live"], ["有喜欢的人就出院", "Discharge him once he likes someone"], ["先安排相亲再问患者", "Set up a date first, ask the patient later"]], 0),
    P("m117_c06_g1", "药价断点", "The Price Spike", [["医院被拒供那晚突然涨价", "Prices spiked the night the hospital was cut off"], ["全周价格不变", "Prices stayed flat all week"], ["药房免费", "The pharmacy is free"]], 0),
    P("m117_c06_g2", "记忆契约的边界", "Memory Contract", [["捐献前可以撤回", "You can withdraw before donating"], ["术后要求撤回已消耗部分", "You can reclaim what's already been used after the procedure"], ["家属可代签一切", "Family can sign anything on your behalf"]], 0),
    P("m117_c07_g1", "未来日期搜查令", "Tomorrow's Warrant", [["落款晚于申请发生", "It's dated after the request was even made"], ["所有日期完全一致", "All the dates match exactly"], ["签发当天在过去", "It was issued on a day in the past"]], 0),
    P("m117_c07_g2", "匿名宣誓", "Protected Testimony", [["仅使用匿名编号与本人批准事实", "Use only an anonymous number and facts he approved"], ["公开真实地址", "Publish his real address"], ["公开全部病历", "Publish his whole medical file"]], 0),
    P("m117_c08_g1", "两种可能的录像", "Two Possible Futures", [["两段都只是预测候选", "Both clips are only predicted possibilities"], ["选开心的那段为事实", "Treat the happy one as fact"], ["选悲伤的那段为事实", "Treat the sad one as fact"]], 0),
    P("m117_c08_g2", "真实患者优先", "Reality Before Probability", [["采集真实评估信息交专业医护", "Gather a real assessment and hand it to the medical staff"], ["直接按钟的分数拒收", "Turn patients away by the bell's score"], ["按贵族家族排名", "Rank patients by noble family"]], 0),
    P("m117_c09_g1", "裁掉的真相", "The Cropped Frame", [["原图右侧有救护车", "The original shows an ambulance on the right"], ["裁图显示全景", "The cropped version shows the full scene"], ["裁图时间比原图早一天", "The cropped version is dated a day earlier"]], 0),
    P("m117_c09_g2", "公开信里的名字", "Names on the Letter", [["本人可选择署名其他人匿名", "Each person chooses to sign; everyone else stays anonymous"], ["所有人必须署名", "Everyone must sign"], ["负责人统一代签", "The person in charge signs for everyone"]], 0),
    P("m117_c10_g1", "备用电池标签", "Battery Label Swap", [["冷却柜标签与照明柜被交换", "The cooler label was swapped with the lighting cabinet's"], ["全部标签正确", "Every label is correct"], ["只有颜色不同无影响", "Only the colors differ, so it doesn't matter"]], 0),
    P("m117_c10_g2", "地下敲击码", "Tunnel Knock", [["短短短长", "Short-short-short-long"], ["短短长长", "Short-short-long-long"], ["长短长短", "Long-short-long-short"]], 0),
    P("m117_c11_g1", "试点印章的变更", "The Changed Seal", [["旧章授权研究新章扩展筛选", "The old seal approved research; the new one widened screening"], ["两章必然相同", "The two seals must be the same"], ["所有文件都没有签署", "None of the documents were signed"]], 0),
    P("m117_c11_g2", "道歉不是免罪卡", "Repair Is Action", [["公开承认并接受外部监督", "Admit it publicly and accept outside oversight"], ["说对不起就恢复信任", "Saying sorry restores trust"], ["用礼物换玩家原谅", "Trade gifts for the player's forgiveness"]], 0),
    P("m117_c12_g1", "证人期限", "Expired Protection", [["保护授权三年前已到期", "His protection expired three years ago"], ["期限永不过期", "The protection never expires"], ["只有口头授权", "It was only a verbal authorization"]], 0),
    P("m117_c12_g2", "属于Lucian的证词", "His Own Testimony", [["公开本人经历遮住其他患者信息", "Share his own story, hide other patients' details"], ["公开所有保护者姓名", "Publish every protector's name"], ["禁止Lucian自主决定", "Don't let Lucian decide for himself"]], 0),
    P("m117_c13_g1", "资金拆分", "Split the Funding", [["三笔小额来自一笔被拆拨款", "Three small payments split from one grant"], ["三笔全部是患者捐献", "All three are patient donations"], ["收据完全无法核对", "The receipts can't be checked at all"]], 0),
    P("m117_c13_g2", "没有面孔的抗议", "Anonymous Assembly", [["只拍无字纸板与远景", "Only shoot blank signs and wide shots"], ["近拍患者病历", "Close-ups of patients' records"], ["公开所有人住址", "Publish everyone's address"]], 0),
    P("m117_c14_g1", "未来画面接错线", "Crossed Signal", [["预测端口接入历史回放", "The prediction port is plugged into the history replay"], ["历史回放只接历史", "The history replay only carries history"], ["预测与历史相同", "Prediction and history are the same"]], 0),
    P("m117_c14_g2", "匿名冻结凭证", "Protected Archive", [["冻结删除并只记匿名证明", "Freeze deletion and keep only anonymous proof"], ["导出完整姓名上网", "Export the full names online"], ["彻底删除全部数据", "Delete all the data for good"]], 0),
    P("m117_c15_g1", "证据的三层", "Three Levels of Evidence", [["核验日志属于事实栏", "Verified logs go in the Facts column"], ["推测属于事实栏", "Guesses go in the Facts column"], ["预测属于已发生栏", "Predictions go in the Already Happened column"]], 0),
    P("m117_c15_g2", "改变规则的提案", "Write a Fair Rule", [["先公开理由再听取申诉最后复核", "Publish the reasons, hear appeals, then review"], ["先删名单再通知", "Delete the list first, notify later"], ["由一人永久决定", "One person decides forever"]], 0),
    P("m117_c16_g1", "新的夜班预算", "Next Shift Budget", [["同时保留人工复核与社区补充渠道", "Keep both human review and a community channel"], ["所有预算只买钟的预测", "Spend the whole budget on the bell's predictions"], ["取消患者监督", "Cancel patient oversight"]], 0),
    P("m117_c16_g2", "下一次夜班的约定", "The Next Shift", [["邀请明确自愿且不绑定医院服务", "An invitation that's clearly voluntary and never tied to hospital care"], ["亲密换医疗资源", "Intimacy in exchange for medical resources"], ["不回应就失去全部帮助", "No answer means losing all help"]], 0)
  ];
  MG168.reg(games);
  window.M117G = games;
})();

/* ===== mod176: 作者剧本里的三选一小游戏（scene.game.kind="pick3"，题面写在作品资料 bible 的 game.play 里）。
   首个使用者：《我暗恋的人有秘密规则》36 个（每章第 2、4 场）。进场就能玩或跳过；限时、两次机会，复用 mod168 的 m111_pick。
   结果只写回执和 mg_<编号>_win 旗标：输赢、跳过都不加减好感，也不替玩家做任何选择。 ===== */
(function () {
  if (typeof authoredGameStart98 !== "function" || typeof mgOpen !== "function" || typeof MG_T === "undefined" || !MG_T.m111_pick) return;
  const isP = g => !!(g && g.kind === "pick3" && g.play && Array.isArray(g.play.items) && g.play.items[g.play.ans]);
  const zh = () => (typeof CL === "function" ? CL() !== "en" : true);
  const label = it => (Array.isArray(it) ? it[zh() ? 0 : 1] || it[0] : String(it));
  const prevDock = authoredGameDock98, prevOpen = authoredGameOpen98, prevStart = authoredGameStart98, prevCommit = authoredGameCommit98;
  const defOf = g => {
    const p = g.play, id = "g_pick3_" + g.id;
    const v = { id, zh: g.name, en: g.name_en || g.name, tpl: p.tpl || "m111_pick", seconds: p.seconds || 35, pz: p.pz, pe: p.pe || p.pz,
      ask: p.ask, items: p.items, ans: p.ans, img: p.img || "", a: "", b: "", kw: [] };
    const i = MG100.findIndex(x => x.id === id); if (i >= 0) MG100[i] = v; else MG100.push(v);
    return id;
  };
  const answer = g => g.play.items[g.play.ans][0];
  const nextText = (g, result, who) => {
    const t = g.outcomes[result] || "";
    if (who.length || !/Rowan|罗温/.test(t)) return t;
    return result === "WIN" ? "判断正确：「" + answer(g) + "」。" : result === "LOSE" ? "你对照公开资料重新核对：正确的是「" + answer(g) + "」。" : "跳过了，剧情照常继续。";
  };
  authoredGameDock98 = function (th) {
    try { const { s } = scene98(th); if (s && isP(s.game)) (th.b98.gameReady98 || (th.b98.gameReady98 = {}))[s.id] = true; } catch (_) {}
    return prevDock(th);
  };
  authoredGameOpen98 = function (th) {
    const { s } = scene98(th), g = s && s.game; if (!isP(g)) return prevOpen(th);
    if (busy || (th.b98.gameResults || {})[g.id]) return;
    const ids = here98(th, s);
    const buddies = ids.map(id => '<button class="btn btn-block" data-authored-player98="' + esc(id) + '">和 ' + esc(first(ch(id).n)) + ' 一起</button>').join("");
    sheet('<h2>' + esc(g.name) + '</h2><p>' + esc(g.stake) + '。三选一，限时 ' + (g.play.seconds || 35) + ' 秒，有两次机会。</p><p>输了或不玩，剧情都照常继续，不影响好感，也不替你做任何选择。</p>' +
      buddies + '<button class="btn btn-block" data-authored-player98="__solo">' + (ids.length ? "我自己来" : "开始") + '</button><button class="btn btn-g btn-block" data-authored-game98="skip">这次不玩</button>');
  };
  authoredGameStart98 = function (th, id) {
    const { s } = scene98(th), g = s && s.game; if (!isP(g)) return prevStart(th, id);
    if (busy || (th.b98.gameResults || {})[g.id]) return;
    const who = id && id !== "__solo" && here98(th, s).includes(id) ? [id] : [];
    closeSheet();
    mgOpen(defOf(g), r => {
      const result = { win: "WIN", lose: "LOSE", skip: "SKIP" }[r] || "SKIP";
      if (!authoredGameCommit98(th, s, g, result, who)) return;
      try { renderChat(); } catch (_) {}
      if (result !== "SKIP" && who.length && curT === th.id && !busy)
        beat98(th, "talk", { mode: "act", txt: "刚才一起玩了「" + g.name + "」，结果：" + (result === "WIN" ? "答对了" : "没答对") + "（正确答案：" + answer(g) + "）。请按这个真实结果自然回应，不要替玩家做决定，也不要把它说成别的成就。" });
    });
  };
  authoredGameCommit98 = function (th, s, g, result, ids) {
    if (!isP(g)) return prevCommit(th, s, g, result, ids);
    if (!["WIN", "LOSE", "SKIP"].includes(result) || !th.b98 || !s || scene98(th).s.id !== s.id) return false;
    const rec = th.b98.gameResults || (th.b98.gameResults = {}); if (rec[g.id]) return false;
    const here = here98(th, s), who = [...new Set(ids || [])].filter(x => here.includes(x));
    rec[g.id] = { result, chapter: th.b98.ch, scene: s.id, participants: who, at: Date.now() };
    const next = nextText(g, result, who);
    if (result !== "SKIP") {
      mem98(th, who, g.name + "：" + (result === "WIN" ? "答对" : "没答对") + "（正确答案：" + answer(g) + "）");
      const fl = th.b98.flags || (th.b98.flags = []);
      fl.push(g.id + ":" + result); if (result === "WIN") fl.push(g.winFlag || "mg_" + g.id + "_win");
    }
    (th.b98.sum || (th.b98.sum = [])).push("小游戏 " + g.name + "：" + result + "；" + next);
    appendMsg(th, { who: "sys", k: "card", title: g.name + " · " + ({ WIN: "成功", LOSE: "未成功", SKIP: "已跳过" })[result], txt: next, at: Date.now() });
    save(); authoredGameDock98(th); return true;
  };
  window.PICK3_176 = { isP, defOf };
})();

/* ===== mod177: M118《我必须亲手逮捕我的前男友》32 个小游戏（每章 2 个），全部是“根据证据判断”的单选题 ===== */
(function () {
  if (typeof MG_T === "undefined" || !window.MG168) return;
  const P = (id, zh, en, rule, items, ans) => ({ id, zh, en, tpl: "m111_pick", seconds: 40,
    pz: rule, pe: "Make the call the evidence actually supports. You can skip—Maya will handle it by the book.",
    ask: ["哪一项站得住？", "Which one holds up?"], items, ans });
  const games = [
    P("m118_c01_g1", "湿卡时间核验", "Rain-Soaked Pass", "对照门禁系统时间与手写登记时间，找出应优先保全的记录。", [["原始门禁导出", "The original gate-system export"], ["雨中口头传言", "Word of mouth in the rain"], ["模糊翻拍照片", "A blurry photo of a screen"]], 0),
    P("m118_c01_g2", "反光机位识别", "Impossible Reflection", "判断镜头反光是否足以单独认定人物身份。", [["直接定罪", "Convict on it directly"], ["标记异常并请求源文件", "Flag the anomaly and request the source file"], ["忽略所有影像", "Ignore all footage"]], 1),
    P("m118_c02_g1", "三只时钟", "Three Clocks", "把本地时间、服务器时间与警局日志放在可比时间线上。", [["直接按显示值排序", "Sort by the displayed values"], ["统一时区和偏差再排序", "Align time zones and drift, then sort"], ["把最早记录删掉", "Delete the earliest record"]], 1),
    P("m118_c02_g2", "旧听证索引", "The Hearing Index", "寻找与SABLE-19有关的公开听证文件，而不是私人信件。", [["公开听证编号", "The public hearing number"], ["邻居私信", "A neighbor's private message"], ["未授权访问日志", "An unauthorized access log"]], 0),
    P("m118_c03_g1", "虚构机位拼图", "The Fourth Camera", "将公开采购摄像头机位放到仓库墙面图上。", [["三台设备匹配真实安装点", "Three devices that match real install points"], ["四台设备随意拼接", "Four devices stitched together at random"], ["直接删去仓库", "Just delete the warehouse"]], 0),
    P("m118_c03_g2", "九帧不同步", "Nine Frames Early", "比较脚步声与鞋跟落地的先后，提出不超出数据的结论。", [["已证实谋杀者", "The murderer is proven"], ["音画同步存在异常", "There's an audio-video sync anomaly"], ["声音本身造假无疑", "The sound is definitely faked"]], 1),
    P("m118_c04_g1", "证词来源卡", "What Did You See?", "将证人的话分为亲眼所见、转述和推测。", [["三类分开归档", "File the three types separately"], ["全部当目击", "Treat it all as eyewitness"], ["只留最戏剧化一句", "Keep only the most dramatic line"]], 0),
    P("m118_c04_g2", "供应商交叉线索", "Supplier Trail", "通过公开地址和采购公告核对Vesper公司身份。", [["依据公开注册记录交叉查证", "Cross-check against public registration records"], ["根据匿名留言定案", "Decide based on an anonymous comment"], ["直接搜索私人邮箱", "Search a private inbox"]], 0),
    P("m118_c05_g1", "资金年度表", "The Payment Year", "把基金会捐款年度与赔偿审批年度配对。", [["将收款视为犯罪", "Treat any payment as a crime"], ["按年份对照并标明未知", "Match by year and mark the unknowns"], ["只看最大金额", "Only look at the biggest amount"]], 1),
    P("m118_c05_g2", "照片角落编码", "The Corner Code", "从原始照片边角读出与旧仓库有关的公开编号。", [["SABLE-19", "SABLE-19"], ["警员徽号", "An officer's badge number"], ["不可见的完整密码", "An invisible full password"]], 0),
    P("m118_c06_g1", "演示片缺失秒数", "Missing Disclaimer", "比对官方完整版与转发剪辑版，找出被删除的提示。", [["重建推断免责声明", "The reconstruction disclaimer"], ["演示开场音乐", "The demo's opening music"], ["人物姓名表", "The cast list"]], 0),
    P("m118_c06_g2", "钟鸣与画面", "The Bell Does Not Lie", "比对背景钟鸣与视频标注时间，判断是否存在进一步核查理由。", [["直接证明杀人", "It proves murder outright"], ["存在来源时间冲突", "There's a conflict in the source timing"], ["无需保全原文件", "No need to preserve the original file"]], 1),
    P("m118_c07_g1", "授权与保管", "Two Different Keys", "把文件保全授权与见证权分给不同的适当角色。", [["同一人全拿", "One person holds everything"], ["律师保全、独立机构见证", "Counsel preserves, an independent body witnesses"], ["记者保管原始密钥", "A reporter keeps the original keys"]], 1),
    P("m118_c07_g2", "纪要措辞核验", "The Exact Minutes", "核对最终听证纪要与草稿，确保引用符合原文。", [["引用最终签署文本", "Quote the final signed text"], ["只引用朋友圈截图", "Quote only a social media screenshot"], ["猜测Nolan内心", "Guess what Nolan was thinking"]], 0),
    P("m118_c08_g1", "证人安全路线", "The Approved Route", "从证人已同意的公共路径中选通行且不涉封闭施工的一条。", [["经关闭工地抄近道", "Cut through a closed construction site"], ["沿开放地铁换乘", "Follow the open subway transfer"], ["未经同意追踪住址", "Track her home without consent"]], 1),
    P("m118_c08_g2", "一张证词的边界", "The Witness Boundary", "只选出Iris自述亲眼经历的内容。", [["亲见的记录封存指令", "The sealing order she saw herself"], ["推测某人杀人", "A guess that someone killed"], ["媒体编写的动机", "A motive the media wrote"]], 0),
    P("m118_c09_g1", "照片不能说谎吗", "Crop and Context", "在两种裁剪中选不误导的上下文。", [["只展示两人同框", "Show only the two of them in frame"], ["展示完整场景及拍摄时间", "Show the full scene and when it was taken"], ["只展示Damien", "Show only Damien"]], 1),
    P("m118_c09_g2", "关系不是证据", "Memory vs Fact", "把私人关系回忆与案件可核验事实分开。", [["两者直接合并", "Merge them directly"], ["按私人记忆与可核验事实分栏", "Separate private memory from verifiable fact"], ["把证据丢掉", "Throw out the evidence"]], 1),
    P("m118_c10_g1", "匿名消息核验", "Anonymous Claims", "从三条互相矛盾的爆料里挑出可实地核实的那条。", [["时间地点可验证的记录", "The record with a checkable time and place"], ["只写情绪的帖文", "The post that's all emotion"], ["相互转述的猜测", "Speculation passed between people"]], 0),
    P("m118_c10_g2", "到庭清单", "Counsel and Court", "确定合法到庭需要优先完成的程序步骤。", [["先毁掉传票", "Destroy the subpoena"], ["向律师确认日期并按要求到庭", "Confirm the date with counsel and appear as required"], ["躲开记者然后不去", "Dodge the reporters and skip it"]], 1),
    P("m118_c11_g1", "钟楼双时间", "Two Independent Clocks", "将老剧院钟响与路口信号变化配成同一时间点。", [["两者均可独立核实的时间窗", "A time window both can verify independently"], ["媒体截图时间", "The time on a media screenshot"], ["Nolan自述", "Nolan's own account"]], 0),
    P("m118_c11_g2", "公文包路线", "Silver Case Route", "辨认银色公文包穿过公共街景的连续路线。", [["仅依人脸猜测", "Guess from faces alone"], ["按物件和时间顺序连线", "Connect by the object and the time order"], ["把每位路人认作Nolan", "Assume every passerby is Nolan"]], 1),
    P("m118_c12_g1", "文件与校验摘要", "Provenance Match", "正确匹配来源文件、校验摘要与独立见证记录。", [["来源—摘要—见证对应", "Source, digest and witness matched up"], ["凭文件名判相同", "Judge by the filename"], ["凭图标颜色判相同", "Judge by the icon color"]], 0),
    P("m118_c12_g2", "不是实拍", "Reconstruction Field", "从导出说明中识别唯一标注“事件重建概率”的版本。", [["被剪辑展示版本", "The edited showcase version"], ["保留reconstruction probability字段版本", "The version that keeps the reconstruction-probability field"], ["匿名媒体转发版本", "The version an anonymous outlet reposted"]], 1),
    P("m118_c13_g1", "材料找出处", "Who Owns the Source", "给听证材料逐一匹配原始出处及权限。", [["每份材料标来源与可披露范围", "Label each item's source and what can be disclosed"], ["优先惊悚标题", "Lead with the scariest headline"], ["忽略私人资料权限", "Ignore permissions on private records"]], 0),
    P("m118_c13_g2", "推测与事实", "Claims on the Record", "分清Nolan发言中的可验证主张和无法验证推断。", [["将辩解视为定罪", "Treat his defense as a conviction"], ["按证据来源分类", "Sort by evidence source"], ["谁声音大谁赢", "Whoever's loudest wins"]], 1),
    P("m118_c14_g1", "证词三色标注", "Three Kinds of Truth", "将亲历、收到的邮件与个人推测标为三类。", [["三类分别标示", "Mark the three kinds separately"], ["全部归为亲历", "Call it all firsthand"], ["仅保留推断", "Keep only the guesses"]], 0),
    P("m118_c14_g2", "谁能公开什么", "Consent to Disclose", "按Iris明确授权的公开范围处理她的资料。", [["媒体可随意公开住址", "The media can publish her address"], ["只公开她书面同意的段落", "Publish only the passages she agreed to in writing"], ["必须全部上网", "Put everything online"]], 1),
    P("m118_c15_g1", "程序先于头条", "First Preserve, Then Publish", "安排证据保全、见证人许可和新闻发布的先后。", [["先发布未经核对的证词", "Publish the unchecked testimony first"], ["先保全并征求许可、后公开核实部分", "Preserve and ask permission first, then publish what's verified"], ["完全毁掉文件", "Destroy the files"]], 1),
    P("m118_c15_g2", "两条罪责链", "Two Different Cases", "将“推断误标”与“实际凶案”的证据各自归类。", [["一条假视频足以证明杀人", "One fake video proves murder"], ["两条罪责链各有独立证据", "Each chain of guilt has its own evidence"], ["所有嫌疑人自动无罪", "Every suspect is automatically innocent"]], 1),
    P("m118_c16_g1", "手表和今天", "Watch the Memory", "将三段回忆按发生顺序排列，并标注今天的感受可以不同。", [["旧日约会—离别—现在", "Old date, the goodbye, now"], ["离别—约会—现在", "The goodbye, old date, now"], ["现在—约会—离别", "Now, old date, the goodbye"]], 0),
    P("m118_c16_g2", "未来不是判决", "Tomorrow's Terms", "把关系或个人生活计划与边界条件匹配。", [["先征求双方同意并约定可修改", "Both agree first, and it can be revised"], ["要求对方永久承诺", "Demand a permanent promise"], ["用案件结果换恋爱", "Trade the case outcome for romance"]], 0)
  ];
  MG168.reg(games);
  window.M118G = games;
})();

/* ===== mod178: M120《她毁了我的首秀》24 个小游戏（每章 2 个），复用 m111_pick 单选模板 ===== */
(function () {
  if (typeof MG_T === "undefined" || !window.MG168) return;
  const P = (id, zh, en, rule, items, ans) => ({ id, zh, en, tpl: "m111_pick", seconds: 35,
    pz: rule, pe: "Pick the one that's actually right. You can skip—the story keeps going either way.",
    ask: ["哪一个是对的？", "Which one is right?"], items, ans });
  const games = [
    P("m120_g01", "救回第一针", "Save the First Stitch", "袖边裂开了。怎样才能把它救回来？", [["先缝再说，纹路对不对无所谓", "Just sew it—the grain doesn't matter"], ["把两边线纹对齐，再用定位针固定", "Line up both sides of the grain, then pin it"], ["用胶带先粘住", "Tape it shut for now"]], 1),
    P("m120_g02", "9F痕迹", "The 9F Mark", "比对现场照片，哪两张的编号真正一致？", [["9F原现场 ↔ 6F模糊照", "9F scene photo ↔ blurry 6F photo"], ["9F原现场 ↔ 9F近景", "9F scene photo ↔ 9F close-up"], ["6F模糊照 ↔ 9F近景", "Blurry 6F photo ↔ 9F close-up"]], 1),
    P("m120_g03", "领口三点", "Three Collar Points", "领口的三个定位点，正确顺序是？", [["左肩 → 锁骨 → 右肩", "Left shoulder → collarbone → right shoulder"], ["锁骨 → 左肩 → 右肩", "Collarbone → left shoulder → right shoulder"], ["右肩 → 左肩 → 锁骨", "Right shoulder → left shoulder → collarbone"]], 0),
    P("m120_g04", "收据上的日期", "The Receipt Date", "按日期整理品牌的第一笔成交，正确顺序是？", [["成交收据 → 付款回执 → 展会纪念卡", "Sales receipt → payment slip → expo card"], ["付款回执 → 展会纪念卡 → 成交收据", "Payment slip → expo card → sales receipt"], ["展会纪念卡 → 成交收据 → 付款回执", "Expo card → sales receipt → payment slip"]], 2),
    P("m120_g05", "不该签的条款", "Find the Clause", "合同里哪一条允许未经授权拍你的私人感情？", [["赛事公平条款", "The fair-competition clause"], ["摄影公开条款", "The photo-publicity clause"], ["私人生活授权条款", "The private-life release clause"]], 2),
    P("m120_g06", "被遮住的照片", "The Hidden Print", "哪一张照片可以公开展出？", [["授权工作照", "The authorized work photo"], ["未授权的私人照", "The unauthorized private photo"], ["已提出撤展的作品", "The piece you asked to withdraw"]], 0),
    P("m120_g07", "完整采访", "The Full Statement", "把采访录音按真实顺序排好：", [["Sloane回应 → 记者提问 → 会后承认", "Sloane answers → reporter asks → later admission"], ["记者提问 → Sloane回应 → 会后承认", "Reporter asks → Sloane answers → later admission"], ["会后承认 → 记者提问 → Sloane回应", "Later admission → reporter asks → Sloane answers"]], 1),
    P("m120_g08", "上传源头", "Track the Upload", "比对两张图的上传记录，能下的结论是？", [["两张图哈希相同，泄露者就是官方", "Same hash—the leak came from the official team"], ["两张图哈希不同，来源尚未证实", "Different hashes—the source isn't proven yet"], ["Evelyn一定是泄露者", "Evelyn must be the leaker"]], 1),
    P("m120_g09", "删掉那一格", "Cancel the Shot", "拍摄日程里，哪一个机位必须移出？", [["公开走秀镜头", "The public runway shot"], ["服装细节镜头", "The garment detail shot"], ["未经同意的旧情侣镜头", "The ex-couple shot nobody agreed to"]], 2),
    P("m120_g10", "夜风里的别针", "The Safety Pin", "风一吹，哪个东西可能勾住栏杆？", [["袖口纽扣", "The cuff button"], ["松脱的别针", "The loose pin"], ["披肩流苏", "The shawl fringe"]], 1),
    P("m120_g11", "暗房的遮幅", "Protect the Worker", "照片里有一位没授权的工人。遮光板该盖住哪里？", [["照片主体", "The main subject"], ["工人的姓名牌", "The worker's name tag"], ["整张照片", "The whole photo"]], 1),
    P("m120_g12", "报告的两个日期", "Two Report Dates", "核对安全报告，哪个说法站得住？", [["检测日期早于封存日期，批次可追溯", "Testing came before sealing, and the lot is traceable"], ["封存日期早于检测，所以报告是假的", "Sealing came first, so the report is fake"], ["摘要已经足以定最终责任", "The summary is enough to assign final blame"]], 0),
    P("m120_g13", "证言顺序", "Witness Timeline", "把三份记录按真实时间排好：", [["停秀通知 → 值班记录 → 9F异常报告", "Shutdown notice → shift log → 9F report"], ["9F异常报告 → 停秀通知 → 值班记录", "9F report → shutdown notice → shift log"], ["值班记录 → 9F异常报告 → 停秀通知", "Shift log → 9F report → shutdown notice"]], 2),
    P("m120_g14", "寄不出的信", "Unsent Letter", "Sloane沉默了多久？按时间排好：", [["首秀取消 → 媒体归责 → 未寄出的信", "Show cancelled → media blames you → unsent letter"], ["未寄出的信 → 首秀取消 → 媒体归责", "Unsent letter → show cancelled → media blames you"], ["媒体归责 → 未寄出的信 → 首秀取消", "Media blames you → unsent letter → show cancelled"]], 0),
    P("m120_g15", "小灯下的针", "Needle in the Dark", "停电了，银针掉在桌脚附近。怎么找最稳？", [["用手在地上摸", "Feel around on the floor by hand"], ["把手电光束照到桌脚，找到后放回针盒", "Aim the flashlight at the table leg, then put it back in the box"], ["等来电再说", "Wait for the power to come back"]], 1),
    P("m120_g16", "照片使用许可", "Photo Consent Check", "三类照片该怎么处理？", [["全部可以展出", "All of them can be shown"], ["授权照可展出，私人底片私存，撤展作品移除", "Authorized photos shown, private negatives kept, withdrawn pieces removed"], ["只要好看就可以展出", "Show whatever looks best"]], 1),
    P("m120_g17", "底片元数据", "Negative Metadata", "比对时间码，哪个结论是对的？", [["媒体截图的时间码和登记一致", "The media screenshot matches the registry"], ["原始时间码和授权登记一致，媒体截图不一致", "The original timecode matches the registry; the screenshot doesn't"], ["三者都对不上，无法判断", "Nothing matches; can't tell"]], 1),
    P("m120_g18", "原话在哪里", "Restore the Quote", "把短剪版和原始问答对齐，被删掉的是？", [["记者的提问", "The reporter's question"], ["Sloane的完整答复", "Sloane's full answer"], ["片头字幕", "The opening titles"]], 1),
    P("m120_g19", "两份互不交换的合同", "Separate Agreements", "摄影许可、工作指导、私人邀约，该怎么签？", [["三项写进同一份合同", "Put all three in one contract"], ["前两项进专业合同，私人邀约另外处理", "The first two go in the work contract; the invitation stays separate"], ["先答应约会，再谈合同", "Agree to the date first, then the contract"]], 1),
    P("m120_g20", "安全走台线", "Safe Runway Path", "裙摆和移动灯架之间，怎么排才安全？", [["裙摆不越过灯架的安全线", "Keep the hem behind the rig's safety line"], ["让模特自己躲开灯架", "Let the model dodge the rig"], ["关掉灯架就不用管距离", "Turn off the rig and ignore the spacing"]], 0),
    P("m120_g21", "最后一针", "The Final Stitch", "修补压轴裙摆的正确顺序：", [["剪线 → 固定 → 走针", "Trim → secure → stitch"], ["固定布边 → 加固走针 → 剪断线头", "Secure the edge → reinforce the stitch → trim the thread"], ["走针 → 剪线 → 固定", "Stitch → trim → secure"]], 1),
    P("m120_g22", "只签事实", "Sign the Facts", "责任声明里，哪一项还不能当事实写？", [["安全叫停的记录", "The safety shutdown record"], ["错误归责的报道", "The reports that wrongly blamed you"], ["谁指使泄露的猜测", "Guesses about who ordered the leak"]], 2),
    P("m120_g23", "属于你的版权", "Your Rights", "新订单、展示许可和摄影授权签完，核心设计版权归谁？", [["归工作室；另外两项只限定使用范围", "Your studio; the other two only grant limited use"], ["归下单的客户", "The client who placed the order"], ["归摄影师", "The photographer"]], 0),
    P("m120_g24", "下一个星期六", "Next Saturday", "安排下周的日程，正确顺序是？", [["个人时间 → 客户交付 → 团队休息", "Personal time → client delivery → crew rest"], ["客户交付 → 团队休息 → 个人时间", "Client delivery → crew rest → personal time"], ["团队休息 → 个人时间 → 客户交付", "Crew rest → personal time → client delivery"]], 1)
  ];
  MG168.reg(games);
  window.M120G = games;
})();

/* ===== mod179: 发现页重做（2026-11-24）=====
   用户反馈：「分类」那一大块（题材 / 背景 / 套路 / 人设 / 攻 / 受 六排横滑标签）太乱；「社区新作」先不要。
   新结构：恋爱类型（全部 / 男女 / 男男 / 女女）→「挑一个幻想」大入口 →「你喜欢的类型」性格 →「筛选」底部面板。
   数据：art/official/discover.json（dict = 标签字典，works[作品id] = 恋爱对象数 / 人物身份 / 性格 / 套路 / 氛围 / 亲密强度）。
   规则：同一组里选多个 = 任意一个符合；不同组之间 = 都要符合；亲密强度单选。攻 / 受两排去掉。
   结果只列线上官方作品（/api/works），点卡片走原来的 data-cwork（装好就打开）。零结果时给出最接近的作品，不显示空白页。 */
(function () {
  "use strict";
  if (typeof renderDiscover !== "function" || typeof tagBar !== "function") return;
  const GROUPS = ["cast", "identity", "persona", "trope", "mood"];
  const D = { data: null, list: null, busy: null, sheet: null, covers: {} };
  const zh = () => (typeof CL === "function" ? CL() === "zh" : S.lang === "zh");
  const T2 = (a, b) => (zh() ? a : b);
  const sel = () => {
    if (!disc.s179) disc.s179 = { cast: [], identity: [], persona: [], trope: [], mood: [], intensity: "" };
    return disc.s179;
  };
  const nSel = s => GROUPS.reduce((n, g) => n + s[g].length, 0) + (s.intensity ? 1 : 0);
  const lab = (g, k) => { const d = D.data && D.data.dict[g] && D.data.dict[g][k]; return d ? (zh() ? d.zh : d.en) : k; };
  const copy = s => JSON.parse(JSON.stringify(s));

  function load() {
    if (D.data && D.list) return Promise.resolve();
    if (D.busy) return D.busy;
    const v = Math.floor(Date.now() / 6e5);
    D.busy = Promise.all([
      fetch("art/official/discover.json?v=" + v).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch("/api/works?feed=new&limit=200").then(r => r.ok ? r.json() : null).catch(() => null)
    ]).then(([d, j]) => {
      if (d && d.works) D.data = d;
      const L = (j && (j.works || j.rows)) || [];
      /* discover.json 里没有的作品（作者后台新上线的）：用作品包里的 pack.meta.disc（mod180 记在本机，没有就读一次） */
      const norm = (w, d) => Object.assign({}, w, { d: Object.assign({ rel: w.orient || "bg", cast: "multi", identity: [], persona: [], trope: [], mood: [], intensity: "steamy" }, d), or: w.orient || d.rel });
      D.list = [];
      L.filter(w => w.status === "live" || !w.status).forEach(w => {
        const d = (D.data && D.data.works[w.id]) || (window.PK180 && PK180.store[w.id] && PK180.store[w.id].d);
        if (d) { D.list.push(norm(w, d)); return; }
        if (window.PK180 && /^w_/.test(w.id)) PK180.packOf(w.id).then(e => { if (e && e.d && D.list && !D.list.some(x => x.id === w.id)) { D.list.push(norm(w, e.d)); if (S.lastTab === "discover" && document.querySelector(".d179")) rerender(); } });
      });
    }).finally(() => { D.busy = null; });
    return D.busy;
  }
  const orFit = w => (typeof S === "undefined" || S.or === "all" || !S.or || w.or === S.or);
  function fits(w, s) {
    if (!orFit(w)) return false;
    for (const g of GROUPS) {
      if (!s[g].length) continue;
      const have = g === "cast" ? [w.d.cast] : (w.d[g] || []);
      if (!s[g].some(k => have.includes(k))) return false;
    }
    return !s.intensity || w.d.intensity === s.intensity;
  }
  function score(w, s) { /* 零结果时：满足的组越多越靠前（恋爱类型必须对） */
    if (!orFit(w)) return -1;
    let n = 0;
    for (const g of GROUPS) { if (!s[g].length) continue; const have = g === "cast" ? [w.d.cast] : (w.d[g] || []); if (s[g].some(k => have.includes(k))) n++; }
    if (s.intensity && w.d.intensity === s.intensity) n++;
    return n;
  }
  const results = s => (D.list || []).filter(w => fits(w, s)).sort((a, b) => (b.plays || 0) - (a.plays || 0));

  /* ---------- 卡片：最多 3 个标签 ---------- */
  function coverOf(w) {
    if (w.cover) return w.cover;
    if (D.covers[w.id] !== undefined) return D.covers[w.id];
    D.covers[w.id] = "";
    fetch("art/official/" + w.id + ".json").then(r => r.ok ? r.json() : null).then(a => {
      const c = a && (a.cover || a.poster); if (!c) return; D.covers[w.id] = c;
      document.querySelectorAll('.d179card[data-cwork="' + w.id + '"] .art').forEach(el => { el.innerHTML = '<img src="' + esc(c) + '" alt="">'; });
    }).catch(() => {});
    return "";
  }
  function card(w) {
    const d = w.d, tags = [d.identity[0] && lab("identity", d.identity[0]), d.trope[0] && lab("trope", d.trope[0]), d.mood[0] && lab("mood", d.mood[0])].filter(Boolean).slice(0, 3);
    const title = zh() ? w.title : ((w.en && w.en.title) || w.title), hook = zh() ? w.hook : ((w.en && w.en.hook) || w.hook), c = coverOf(w);
    return '<button class="gcard d179card" data-cwork="' + esc(w.id) + '"><div class="art" style="aspect-ratio:3/4">' + (c ? '<img src="' + esc(c) + '" alt="">' : '<div class="off89ph">📖</div>') +
      '<span class="d179int i-' + d.intensity + '">' + esc(lab("intensity", d.intensity)) + '</span></div><div class="b"><b>' + esc(title || "") + '</b><p class="s">' + esc(hook || "") + '</p>' +
      '<div class="d179tg">' + tags.map(x => '<span>' + esc(x) + '</span>').join("") + '</div></div></button>';
  }

  /* ---------- 发现页上半部分（替换旧的「分类」块） ---------- */
  const ORS = [["all", "disc.all"], ["bg", "ob.bg"], ["bl", "ob.bl"], ["gl", "ob.gl"]];
  tagBar = function () {
    const s = sel(), n = nSel(s), d = D.data;
    if (!d || !D.list) { load().then(() => { if (S.lastTab === "discover" && document.querySelector(".d179")) renderTab("discover"); }); }
    let h = '<div class="d179"><div class="seg dor d179or" id="orSeg">' + ORS.map(([k, l]) => '<button data-orf="' + k + '" class="' + (S.or === k ? "on" : "") + '">' + t(l) + '</button>').join("") + '</div>';
    if (d) {
      /* 2026-11-24 用户反馈「很占地方」：默认折叠成一行（筛选按钮 + 横滑的幻想小标签），点「展开」才显示大图标和性格 */
      const open = !!S.d179open;
      h += '<div class="d179bar">' + '<button class="d179fbtn" data-d179open="1">⚙︎ ' + T2("筛选", "Filters") + (n ? ' <i>' + n + '</i>' : '') + '</button>' +
        (open ? '' : '<div class="d179mini">' + d.home.map(k => '<button data-d179q="identity|' + k + '" class="chip' + (s.identity.includes(k) ? " on" : "") + '">' + d.dict.identity[k].icon + ' ' + esc(lab("identity", k)) + '</button>').join("") + '</div>') +
        '<button class="d179fold" data-d179fold="1" aria-label="' + (open ? T2("收起", "Collapse") : T2("展开", "Expand")) + '">' + (open ? "▴" : "▾") + '</button></div>';
      if (open) {
        h += '<div class="d179h"><b>' + T2("挑一个幻想", "Pick your fantasy") + '</b></div><div class="d179fan">' +
          d.home.map(k => { const x = d.dict.identity[k]; return '<button data-d179q="identity|' + k + '" class="' + (s.identity.includes(k) ? "on" : "") + '"><i>' + x.icon + '</i><span>' + esc(lab("identity", k)) + '</span></button>'; }).join("") + '</div>';
        h += '<div class="d179h"><b>' + T2("你喜欢的类型", "What's your type?") + '</b></div><div class="d179chips">' +
          Object.keys(d.dict.persona).map(k => '<button data-d179q="persona|' + k + '" class="chip' + (s.persona.includes(k) ? " on" : "") + '">' + esc(lab("persona", k)) + '</button>').join("") + '</div>';
      }
      if (n) h += '<div class="d179sel">' + chipsOf(s) + '<button class="chip" data-d179clr="1">' + T2("清空", "Clear") + '</button></div>';
    }
    h += '<div id="d179res">' + (n ? resHTML(s) : '') + '</div></div><div id="discRes"></div>';
    return h;
  };
  function chipsOf(s) {
    const out = [];
    GROUPS.forEach(g => s[g].forEach(k => out.push('<button class="chip on" data-d179q="' + g + '|' + k + '">' + esc(lab(g, k)) + ' ✕</button>')));
    if (s.intensity) out.push('<button class="chip on" data-d179int="">' + esc(lab("intensity", s.intensity)) + ' ✕</button>');
    return out.join("");
  }
  function resHTML(s) {
    if (!D.list) return '<p class="empty">' + T2("加载中…", "Loading…") + '</p>';
    const L = results(s);
    if (L.length) return '<div class="d179cnt">' + T2("找到 " + L.length + " 部", L.length + (L.length === 1 ? " story" : " stories")) + '</div><div class="grid2" style="padding-bottom:20px">' + L.map(card).join("") + '</div>';
    let near = (D.list || []).map(w => [score(w, s), w]).filter(x => x[0] > 0).sort((a, b) => b[0] - a[0] || (b[1].plays || 0) - (a[1].plays || 0)).slice(0, 6).map(x => x[1]);
    if (!near.length) near = (D.list || []).filter(orFit).sort((a, b) => (b.plays || 0) - (a.plays || 0)).slice(0, 6); /* 一个条件都对不上时，至少给同一恋爱类型的作品 */
    return '<div class="d179zero"><b>' + T2("还没有完全符合的作品", "Nothing matches all of that yet") + '</b><p>' + T2("试试去掉一两个条件。下面是最接近的：", "Try removing a filter or two. Closest matches:") + '</p><button class="chip" data-d179clr="1">' + T2("清空筛选", "Clear filters") + '</button></div>' +
      (near.length ? '<div class="grid2" style="padding-bottom:20px">' + near.map(card).join("") + '</div>' : '');
  }
  /* 有筛选条件时，把下面的精选 / 排行内容收起来 */
  if (typeof discActive === "function") { const A0 = discActive; discActive = function () { return A0.apply(this, arguments) || nSel(sel()) > 0; }; }
  const R0 = renderDiscover;
  renderDiscover = function (v) {
    const r = R0.apply(this, arguments);
    try { const b = document.getElementById("htabBody"); if (b && !discSearch && disc.mode === "stories") b.style.display = nSel(sel()) ? "none" : ""; } catch (_) {}
    return r;
  };
  function rerender() {
    const sc = document.getElementById("discScroll"), y = sc ? sc.scrollTop : 0;
    renderTab("discover");
    const s2 = document.getElementById("discScroll"); if (s2) s2.scrollTop = y;
  }

  /* ---------- 底部筛选面板：先选，再点「显示 N 部」才生效 ---------- */
  function sheetHTML() {
    const d = D.data, s = D.sheet, n = results(s).length;
    const grp = (g, title) => '<div class="d179g"><b>' + title + '</b><div class="d179gw">' + Object.keys(d.dict[g]).map(k =>
      '<button class="chip' + (s[g].includes(k) ? " on" : "") + '" data-d179s="' + g + '|' + k + '">' + (g === "identity" ? d.dict.identity[k].icon + " " : "") + esc(lab(g, k)) + '</button>').join("") + '</div></div>';
    return '<div class="d179sh"><div class="d179shh"><button class="ibtn" data-d179close="1" aria-label="close">✕</button><b>' + T2("筛选", "Filters") + '</b><button class="chip" data-d179sclr="1">' + T2("清空", "Clear") + '</button></div>' +
      '<div class="d179shb">' +
      grp("cast", T2("恋爱对象", "Love interests")) + grp("identity", T2("人物身份", "Who they are")) + grp("persona", T2("性格", "Personality")) +
      grp("trope", T2("恋爱套路", "Romance tropes")) + grp("mood", T2("故事氛围", "Mood")) +
      '<div class="d179g"><b>' + T2("亲密强度", "Romance intensity") + '</b><div class="d179int3">' + [["", T2("不限", "Any"), ""]].concat(Object.keys(d.dict.intensity).map(k => [k, lab("intensity", k), zh() ? d.dict.intensity[k].desc : ""])).map(([k, l, ds]) =>
        '<button class="' + (s.intensity === k ? "on" : "") + '" data-d179si="' + k + '"><b>' + esc(l) + '</b>' + (ds ? '<small>' + esc(ds) + '</small>' : '') + '</button>').join("") + '</div>' +
      '<p class="d179note">' + T2("亲密强度是 MIRU 自己的体验分类，不是年龄分级。", "Intensity describes the romance, not an age rating.") + '</p></div>' +
      '</div><div class="d179shf"><button class="btn btn-p btn-block" data-d179apply="1">' + (n ? T2("显示 " + n + " 部", "Show " + n + (n === 1 ? " story" : " stories")) : T2("没有符合的作品 · 仍然应用", "No matches · apply anyway")) + '</button></div></div>';
  }
  function openSheet() {
    D.sheet = copy(sel());
    let w = document.getElementById("d179wrap");
    if (!w) { w = document.createElement("div"); w.id = "d179wrap"; document.body.appendChild(w); }
    w.innerHTML = '<div class="d179mask" data-d179close="1"></div>' + sheetHTML(); w.hidden = false;
  }
  function paintSheet() {
    const w = document.getElementById("d179wrap"); if (!w || w.hidden) return;
    const b = w.querySelector(".d179shb"), y = b ? b.scrollTop : 0;
    w.innerHTML = '<div class="d179mask" data-d179close="1"></div>' + sheetHTML();
    const b2 = w.querySelector(".d179shb"); if (b2) b2.scrollTop = y;
  }
  const closeSheet = () => { const w = document.getElementById("d179wrap"); if (w) { w.hidden = true; w.innerHTML = ""; } D.sheet = null; };
  const toggle = (s, g, k) => { s[g] = s[g].includes(k) ? s[g].filter(x => x !== k) : s[g].concat(k); };
  const track2 = (ev, o) => { try { if (typeof track === "function") track(ev, o); } catch (_) {} };

  document.addEventListener("click", e => {
    let x;
    if ((x = e.target.closest("[data-d179q]"))) { const [g, k] = x.dataset.d179q.split("|"); toggle(sel(), g, k); track2("disc_tag", { g, k }); rerender(); return; }
    if ((x = e.target.closest("[data-d179int]"))) { sel().intensity = ""; rerender(); return; }
    if (e.target.closest("[data-d179clr]")) { disc.s179 = null; rerender(); return; }
    if (e.target.closest("[data-d179fold]")) { S.d179open = !S.d179open; try { save(); } catch (_) {} rerender(); return; }
    if (e.target.closest("[data-d179open]")) { load().then(() => { if (D.data) openSheet(); }); return; }
    if (e.target.closest("[data-d179close]")) { closeSheet(); return; }
    if ((x = e.target.closest("[data-d179s]"))) { const [g, k] = x.dataset.d179s.split("|"); toggle(D.sheet, g, k); paintSheet(); return; }
    if ((x = e.target.closest("[data-d179si]"))) { D.sheet.intensity = x.dataset.d179si; paintSheet(); return; }
    if (e.target.closest("[data-d179sclr]")) { D.sheet = { cast: [], identity: [], persona: [], trope: [], mood: [], intensity: "" }; paintSheet(); return; }
    if (e.target.closest("[data-d179apply]")) { disc.s179 = D.sheet; track2("disc_apply", { n: nSel(D.sheet), hits: results(D.sheet).length }); closeSheet(); rerender(); return; }
  });
  setTimeout(() => { try { load(); } catch (_) {} }, 2500);

  const st = document.createElement("style");
  st.textContent = [
    /* 社区新作那一排、发现页底部的社区书架先不显示 */
    ".comm68{display:none!important}.shelf:has([data-dchip=community]),.shelf:has([data-cre=remix]){display:none!important}",
    /* 旧的结果列表（app2_pages 的 #discRes）在新筛选下不再显示；搜索页的 #discRes 不受影响 */
    ".d179+#discRes{display:none!important}",
    ".d179{padding:4px 16px 0}.d179or{margin:2px 0 10px}",
    ".d179h{margin:14px 0 8px}.d179h b{font-size:15px;letter-spacing:.02em}",
    ".d179fan{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}",
    ".d179fan button{display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 4px 10px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:inherit;min-width:0}",
    ".d179fan button i{font-style:normal;font-size:26px;line-height:1}.d179fan button span{font-size:12px;line-height:1.25;text-align:center;opacity:.9}",
    ".d179fan button.on{border-color:var(--pink,#ff5c9d);background:rgba(255,92,157,.14)}",
    ".d179chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none}.d179chips::-webkit-scrollbar{display:none}.d179chips .chip{flex:none}",
    ".d179bar{display:flex;align-items:center;gap:8px;margin:4px 0 6px}.d179bar .d179fbtn{flex:none}",
    ".d179mini{flex:1;min-width:0;display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}.d179mini::-webkit-scrollbar{display:none}.d179mini .chip{flex:none}",
    ".d179fold{flex:none;margin-left:auto;width:34px;height:34px;border-radius:999px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:inherit}",
    ".d179sel{margin:6px 0 2px}",
    ".d179fbtn{padding:7px 14px;border-radius:999px;border:1px solid var(--pink,#ff5c9d);background:transparent;color:inherit;font-weight:700}.d179fbtn i{font-style:normal;background:var(--pink,#ff5c9d);color:#fff;border-radius:999px;padding:0 7px;margin-left:4px;font-size:12px}",
    ".d179sel{display:flex;flex-wrap:wrap;gap:6px}",
    ".d179cnt{font-size:13px;opacity:.75;margin:14px 0 10px}#d179res .grid2{padding-left:0;padding-right:0}",
    ".d179zero{margin:16px 0;padding:16px;border-radius:16px;background:rgba(255,255,255,.04);display:flex;flex-direction:column;gap:8px;align-items:flex-start}.d179zero p{margin:0;font-size:13px;opacity:.75}",
    ".d179card .art{position:relative}.d179int{position:absolute;left:8px;top:8px;font-size:11px;padding:2px 8px;border-radius:999px;background:rgba(0,0,0,.55);color:#fff}.d179int.i-spicy{background:rgba(214,40,90,.85)}.d179int.i-steamy{background:rgba(160,60,200,.8)}",
    ".d179tg{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}.d179tg span{font-size:11px;padding:2px 7px;border-radius:999px;background:rgba(255,255,255,.07);opacity:.85}",
    "#d179wrap{position:fixed;inset:0;z-index:300}#d179wrap[hidden]{display:none}.d179mask{position:absolute;inset:0;background:rgba(0,0,0,.55)}",
    ".d179sh{position:absolute;left:0;right:0;bottom:0;max-height:88vh;display:flex;flex-direction:column;background:var(--bg2,#16121c);border-radius:20px 20px 0 0;padding-bottom:env(safe-area-inset-bottom,0px)}",
    ".d179shh{display:flex;align-items:center;gap:10px;padding:14px 16px 10px;border-bottom:1px solid rgba(255,255,255,.06)}.d179shh b{flex:1;font-size:17px}",
    ".d179shb{overflow-y:auto;padding:4px 16px 12px;flex:1;min-height:0}.d179g{margin-top:14px}.d179g>b{display:block;font-size:14px;margin-bottom:8px}.d179gw{display:flex;flex-wrap:wrap;gap:8px}",
    ".d179int3{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.d179int3 button{display:flex;flex-direction:column;gap:3px;align-items:flex-start;text-align:left;padding:10px;border-radius:14px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:inherit;min-width:0}.d179int3 button small{font-size:10.5px;opacity:.7;line-height:1.3}.d179int3 button.on{border-color:var(--pink,#ff5c9d);background:rgba(255,92,157,.14)}",
    "@media (max-width:420px){.d179int3{grid-template-columns:repeat(2,1fr)}}",
    ".d179note{font-size:11.5px;opacity:.6;margin:8px 0 0}.d179shf{padding:10px 16px 14px;border-top:1px solid rgba(255,255,255,.06)}"
  ].join("");
  document.head.appendChild(st);
  window.D179 = D;
})();

/* ===== mod180: 作者后台上线的剧——素材、小游戏、发现页标签都跟着作品包走，不再需要 GitHub / 部署（2026-11-24）=====
   后台（admin.html 第⑤步）上传的图片 / 视频存进文件存储，槽位表写在剧本 config.assets；小游戏写在 config.games；
   发现页标签写在 config.disc。上线时一起进 pack（pack.assets / pack.games / pack.meta.disc）。
   App 这边：
     1 · 打开作品时（/works?id=…）把 pack.games 里的 m111_* / m112_* 模板游戏注册进游戏库（MG168.reg），并记在本机，下次启动直接有；
     2 · pack.assets 记在本机；art/official/<id>.json 不存在时用它（首页卡片、背景、CG、开场视频都读得到）；
     3 · 发现页（mod179）：discover.json 里没有的作品，读 pack.meta.disc 补进筛选。 */
(function () {
  "use strict";
  const KEY = "miru_pk180";
  let store = {};
  try { store = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (_) { store = {}; }
  const keep = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (_) {} };
  const isTplGame = g => g && g.id && /^m11[12]_/.test(String(g.tpl || ""));
  function regGames(list) {
    const L = (list || []).filter(isTplGame);
    if (!L.length || !window.MG168) return;
    try { window.MG168.reg(L); } catch (e) { console.warn("[mod180] games", e); }
  }
  function remember(id, P) {
    if (!id || !P) return;
    const e = store[id] || {};
    if (P.assets && typeof P.assets === "object" && Object.keys(P.assets).length) e.a = P.assets;
    if (Array.isArray(P.games)) { const g = P.games.filter(isTplGame); if (g.length) e.g = g; }
    if (P.meta && P.meta.disc) e.d = P.meta.disc;
    e.at = Date.now(); store[id] = e; keep();
    regGames(e.g);
    if (e.a && typeof OFF94 !== "undefined") { OFF94.assets[id] = Object.assign({}, e.a, OFF94.assets[id] || {}); }
  }
  /* 1 · 截住作品包：capi("/works?id=…") */
  if (typeof capi === "function") {
    const C0 = capi;
    capi = async function (path) {
      const r = await C0.apply(this, arguments);
      try {
        const m = /^\/works\?id=([^&]+)/.exec(String(path || ""));
        if (m && r && r.ok && r.j && r.j.pack) remember(decodeURIComponent(m[1]), r.j.pack);
      } catch (_) {}
      return r;
    };
  }
  /* 启动时把记下来的游戏和素材放回去 */
  Object.keys(store).forEach(id => { const e = store[id]; regGames(e.g); if (e.a && typeof OFF94 !== "undefined") OFF94.assets[id] = Object.assign({}, e.a, OFF94.assets[id] || {}); });

  /* 2 · 素材表：官方文件优先，没有就用作品包里的 */
  const fetching = {};
  function packOf(id) { /* 还没打开过的作品（首页卡片要开场视频 / 封面）：读一次作品包 */
    if (fetching[id]) return fetching[id];
    fetching[id] = fetch("/api/works?id=" + encodeURIComponent(id)).then(r => r.ok ? r.json() : null).then(j => { const P = j && (j.pack || (j.work && j.work.pack)); if (P) remember(id, P); return store[id] || null; }).catch(() => null);
    return fetching[id];
  }
  if (typeof off94Assets === "function") {
    const A0 = off94Assets;
    off94Assets = async function (id) {
      let map = await A0.apply(this, arguments);
      if (!/^w_/.test(String(id || ""))) return map;
      if (!map || !Object.keys(map).length) {
        const e = store[id] || (await packOf(id));
        if (e && e.a) { map = Object.assign({}, e.a); OFF94.assets[id] = map; }
      } else if (store[id] && store[id].a) { map = Object.assign({}, store[id].a, map); OFF94.assets[id] = map; }
      return map;
    };
  }
  window.PK180 = { store, packOf, remember };
})();

/* ===== mod181: 新增 4 种剧情小游戏模板（2026-11-24）=====
   剧本原稿里常写、以前只能退化成三选一的玩法，现在有自己的模板（后台小游戏编辑框里直接用 tpl 名）：
     m111_classify 分类  bins:[[中,英],…]  items:[[[中,英], 正确的组序号], …]          每项点一下选组，全部对才算赢
     m111_pair     比对  items:[[中,英],…]  pair:[i, j]                                  选出真正一致的两项
     m111_spot     找不同 items:[[中,英]或 "🔑",…]  ans: 序号  (cols: 每行几格，默认 3)   直接点那一格
     m111_align    对齐  target: 0–100  tol: 允许误差（默认 6） marks:[[左端中,英],[右端中,英]]  拖动滑块对准再核对
   都沿用 mod168 的外观（.m168）、倒计时和两次机会；输了或跳过剧情照常继续。 */
(function () {
  "use strict";
  if (typeof MG_T === "undefined") return;
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const t2 = (zh, a, b) => (zh ? a : b);
  const L = (x, zh) => (Array.isArray(x) ? x[zh ? 0 : 1] : x);
  const sh = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function shell(A, G, sub, done, T, zh, instr) {
    A.className = "mgarea m168"; A.innerHTML = "";
    sub.textContent = instr;
    if (G.img) { const im = el("img"); im.src = G.img; im.alt = ""; im.style.cssText = "width:100%;max-height:170px;object-fit:cover;border-radius:12px;display:block"; A.append(im); }
    A.append(el("p", "pr", zh ? G.pz : G.pe));
    const tb = el("div", "tb"), bar = el("i"); tb.append(bar); A.append(tb);
    const secs = G.seconds || 35; let over = false, tries = 0;
    requestAnimationFrame(() => { bar.style.transitionDuration = secs + "s"; bar.style.width = "0%"; });
    T.push(setTimeout(() => { if (!over) { over = true; done("lose"); } }, secs * 1000));
    const body = el("div", "m168b"); body.style.cssText = "display:flex;flex-direction:column;gap:8px"; A.append(body);
    const hint = el("p", "hint");
    const submit = ok => { if (over) return; if (ok) { over = true; done("win"); } else if (tries++ < 1) hint.textContent = t2(zh, "还差一点，再核对一次。", "Not quite. Check once more."); else { over = true; done("lose"); } };
    return { body, hint, submit };
  }

  /* 分类：每项在几个组之间切换 */
  MG_T.m111_classify = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "给每一项选对它属于哪一组，再点核对。", "Put each item in the right group, then check."));
    const bins = G.bins || [], items = (G.items || []).map((x, i) => ({ i, label: x[0], ans: x[1] })), pick = {};
    const order = sh(items);
    const draw = () => {
      c.body.innerHTML = "";
      order.forEach(it => {
        const r = el("div", "row"); r.style.flexWrap = "wrap"; r.append(el("span", "", L(it.label, zh)));
        const g = el("div"); g.style.cssText = "display:flex;gap:6px;flex-wrap:wrap";
        bins.forEach((b, k) => { const x = el("button", "k" + (pick[it.i] === k ? " on" : ""), L(b, zh)); x.onclick = () => { pick[it.i] = k; draw(); }; g.append(x); });
        r.append(g); c.body.append(r);
      });
      const go = el("button", "go", t2(zh, "核对分类", "Check")); go.disabled = items.some(it => pick[it.i] == null);
      go.onclick = () => c.submit(items.every(it => pick[it.i] === it.ans));
      c.body.append(go, c.hint);
    };
    draw();
  };

  /* 比对：选出一致的两项 */
  MG_T.m111_pair = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "选出真正一致的两项。", "Pick the two that truly match."));
    const want = (G.pair || [0, 1]).slice().sort().join(","), sel = new Set(), order = sh((G.items || []).map((_, i) => i));
    const draw = () => {
      c.body.innerHTML = "";
      const g = el("div", "grid");
      order.forEach(i => { const b = el("button", "k" + (sel.has(i) ? " on" : ""), L(G.items[i], zh)); b.style.textAlign = "left"; b.onclick = () => { if (sel.has(i)) sel.delete(i); else { if (sel.size >= 2) sel.delete(sel.values().next().value); sel.add(i); } draw(); }; g.append(b); });
      const go = el("button", "go", t2(zh, "确认这两项", "Confirm these two")); go.disabled = sel.size !== 2;
      go.onclick = () => c.submit([...sel].sort().join(",") === want);
      c.body.append(g, go, c.hint);
    };
    draw();
  };

  /* 找不同：直接点那一格 */
  MG_T.m111_spot = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, L(G.ask, zh) || t2(zh, "找出不一样的那一个。", "Find the one that's different."));
    const g = el("div"); g.style.cssText = "display:grid;gap:8px;grid-template-columns:repeat(" + (G.cols || 3) + ",1fr)";
    (G.items || []).forEach((x, i) => {
      const b = el("button", "k", L(x, zh)); b.style.cssText = "min-height:64px;font-size:" + (String(L(x, zh)).length <= 2 ? "26px" : "14px");
      b.onclick = () => { if (i === G.ans) { b.classList.add("on"); c.submit(true); } else { b.disabled = true; c.submit(false); } };
      g.append(b);
    });
    c.body.append(g, c.hint);
  };

  /* 对齐：拖动滑块，让活动线对准目标线 */
  MG_T.m111_align = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "拖动滑块，让粉色线对准虚线，再点核对。", "Drag the slider until the pink line meets the dashed one, then check."));
    const target = Math.max(5, Math.min(95, Number(G.target) || 62)), tol = Number(G.tol) || 6;
    let v = target > 50 ? 12 : 88;
    const box = el("div"); box.style.cssText = "position:relative;height:96px;border-radius:12px;background:#15112a;border:1px solid #4b3d73;overflow:hidden";
    const tline = el("i"); tline.style.cssText = "position:absolute;top:8px;bottom:8px;width:0;border-left:2px dashed #9c8cc9;left:" + target + "%";
    const mline = el("i"); mline.style.cssText = "position:absolute;top:8px;bottom:8px;width:3px;margin-left:-1px;border-radius:2px;background:#ff5fa2";
    box.append(tline, mline);
    const m = G.marks || [];
    const lab = el("div"); lab.style.cssText = "display:flex;justify-content:space-between;font-size:12px;color:#9c8cc9"; lab.append(el("span", "", L(m[0], zh) || ""), el("span", "", L(m[1], zh) || ""));
    const rg = el("input"); rg.type = "range"; rg.min = 0; rg.max = 100; rg.step = 1; rg.value = v; rg.style.width = "100%"; rg.setAttribute("aria-label", t2(zh, "位置", "Position"));
    const paint = () => { mline.style.left = v + "%"; };
    rg.oninput = () => { v = Number(rg.value); paint(); };
    paint();
    const go = el("button", "go", t2(zh, "核对", "Check")); go.onclick = () => c.submit(Math.abs(v - target) <= tol);
    c.body.append(box, lab, rg, go, c.hint);
  };
  window.MG181 = ["m111_classify", "m111_pair", "m111_spot", "m111_align"];
})();

/* ===== mod182: 再加 4 种动手玩法 + 《她毁了我的首秀》24 个小游戏全部换成真正的玩法（2026-11-24）=====
   新模板（后台小游戏编辑框里直接用 tpl 名）：
     m111_mark  圈出所有符合的  items:[[中,英],…]  ans:[序号,…]  ask:[中,英]        可多选，选全、选对才赢
     m111_seq   按顺序点位置    points:[[[中,英], x%, y%],…]（按正确顺序写）  img 可选    点错一次重来
     m111_find  黑暗里找东西    target:"🪡"  decoy:["🔩","📎",…]  label:[中,英]           手指移动是手电光圈，点中目标才算
     m111_hold  按住稳住        need: 秒数（默认 4）  label:[中,英]                         按住让指针停在绿区，累计够秒数
   原则：剧本写的是什么动作，小游戏就做什么动作；不再把排序、比对、找东西都压成三选一。 */
(function () {
  "use strict";
  if (typeof MG_T === "undefined") return;
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const t2 = (zh, a, b) => (zh ? a : b);
  const L = (x, zh) => (Array.isArray(x) ? x[zh ? 0 : 1] : x);
  const sh = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function shell(A, G, sub, done, T, zh, instr, noImg) {
    A.className = "mgarea m168"; A.innerHTML = "";
    sub.textContent = instr;
    if (G.img && !noImg) { const im = el("img"); im.src = G.img; im.alt = ""; im.style.cssText = "width:100%;max-height:170px;object-fit:cover;border-radius:12px;display:block"; A.append(im); }
    A.append(el("p", "pr", zh ? G.pz : G.pe));
    const tb = el("div", "tb"), bar = el("i"); tb.append(bar); A.append(tb);
    const secs = G.seconds || 40; let over = false, tries = 0;
    requestAnimationFrame(() => { bar.style.transitionDuration = secs + "s"; bar.style.width = "0%"; });
    T.push(setTimeout(() => { if (!over) { over = true; done("lose"); } }, secs * 1000));
    const body = el("div", "m168b"); body.style.cssText = "display:flex;flex-direction:column;gap:8px"; A.append(body);
    const hint = el("p", "hint");
    const submit = ok => { if (over) return true; if (ok) { over = true; done("win"); return true; } if (tries++ < 1) { hint.textContent = t2(zh, "还差一点，再来一次。", "Not quite. One more try."); return false; } over = true; done("lose"); return true; };
    return { body, hint, submit, isOver: () => over };
  }

  /* 圈出所有符合的（可多选） */
  MG_T.m111_mark = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, L(G.ask, zh) || t2(zh, "把符合的全部点亮，再点核对。", "Light up every one that fits, then check."));
    const want = (G.ans || []).slice().sort().join(","), on = new Set(), order = sh((G.items || []).map((_, i) => i));
    const draw = () => {
      c.body.innerHTML = "";
      order.forEach(i => { const b = el("button", "k" + (on.has(i) ? " on" : ""), (on.has(i) ? "✓ " : "") + L(G.items[i], zh)); b.style.textAlign = "left"; b.onclick = () => { on.has(i) ? on.delete(i) : on.add(i); draw(); }; c.body.append(b); });
      const go = el("button", "go", t2(zh, "核对（已选 " + on.size + "）", "Check (" + on.size + " picked)")); go.disabled = !on.size;
      go.onclick = () => { if (!c.submit([...on].sort().join(",") === want)) { on.clear(); draw(); } };
      c.body.append(go, c.hint);
    };
    draw();
  };

  /* 按顺序点位置 */
  MG_T.m111_seq = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "按正确的顺序依次点这些位置。", "Tap the spots in the right order."), true);
    const pts = G.points || []; let k = 0;
    const box = el("div"); box.style.cssText = "position:relative;width:100%;aspect-ratio:4/3;max-width:100%;border-radius:12px;overflow:hidden;background:#15112a;border:1px solid #4b3d73;" + (G.img ? "background:#15112a url(" + JSON.stringify(G.img) + ") center/cover" : "");
    const marks = pts.map((p, i) => {
      const b = el("button", "k", L(p[0], zh)); b.style.cssText = "position:absolute;transform:translate(-50%,-50%);left:" + p[1] + "%;top:" + p[2] + "%;font-size:12px;padding:6px 9px;border-radius:999px;white-space:nowrap";
      b.onclick = () => {
        if (c.isOver()) return;
        if (i === k) { b.classList.add("on"); b.textContent = (k + 1) + " · " + L(p[0], zh); k++; if (k === pts.length) c.submit(true); }
        else if (!c.submit(false)) { k = 0; marks.forEach((m, j) => { m.classList.remove("on"); m.textContent = L(pts[j][0], zh); }); }
      };
      box.append(b); return b;
    });
    c.body.append(box, c.hint);
  };

  /* 黑暗里找东西：手电光圈 */
  MG_T.m111_find = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, L(G.label, zh) || t2(zh, "移动手电，找到它，点一下。", "Move the flashlight, find it, tap it."), true);
    const cols = 6, rows = 5, n = cols * rows, at = Math.floor(Math.random() * n), dec = G.decoy && G.decoy.length ? G.decoy : ["🔩", "📎", "🧷", "🪙", "🔘"];
    const box = el("div"); box.style.cssText = "position:relative;width:100%;aspect-ratio:6/5;max-width:100%;border-radius:12px;overflow:hidden;background:#2a2238;touch-action:none;user-select:none";
    const grid = el("div"); grid.style.cssText = "position:absolute;inset:0;display:grid;grid-template-columns:repeat(" + cols + ",1fr);grid-template-rows:repeat(" + rows + ",1fr)";
    for (let i = 0; i < n; i++) {
      const s = el("span", "", i === at ? (G.target || "🪡") : (Math.random() < 0.55 ? dec[Math.floor(Math.random() * dec.length)] : ""));
      s.style.cssText = "display:flex;align-items:center;justify-content:center;font-size:22px;transform:rotate(" + Math.floor(Math.random() * 80 - 40) + "deg)";
      grid.append(s);
    }
    const dark = el("div"); dark.style.cssText = "position:absolute;inset:0;pointer-events:none";
    let lx = 50, ly = 50;
    const paint = () => { dark.style.background = "radial-gradient(circle at " + lx + "% " + ly + "%, rgba(0,0,0,0) 0, rgba(0,0,0,0) 42px, rgba(8,6,14,.96) 78px)"; };
    const pos = e => { const r = box.getBoundingClientRect(); lx = Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100)); ly = Math.max(0, Math.min(100, (e.clientY - r.top) / r.height * 100)); paint(); };
    box.addEventListener("pointermove", pos); box.addEventListener("pointerdown", pos);
    box.addEventListener("click", e => {
      pos(e); if (c.isOver()) return;
      const r = box.getBoundingClientRect(), ci = Math.min(cols - 1, Math.floor((e.clientX - r.left) / r.width * cols)), ri = Math.min(rows - 1, Math.floor((e.clientY - r.top) / r.height * rows));
      if (ri * cols + ci === at) { dark.style.background = "transparent"; grid.children[at].style.filter = "drop-shadow(0 0 8px #ffd27a)"; c.submit(true); }
      else c.submit(false);
    });
    paint(); box.append(grid, dark);
    c.body.append(box, c.hint);
  };

  /* 按住稳住 */
  MG_T.m111_hold = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, L(G.label, zh) || t2(zh, "按住按钮让指针停在绿区，累计够时间。", "Hold to keep the needle in the green until the bar fills."));
    const need = Number(G.need) || 4; let v = 20, down = false, got = 0, last = 0, raf = 0;
    const track = el("div"); track.style.cssText = "position:relative;height:30px;border-radius:999px;background:#15112a;border:1px solid #4b3d73;overflow:hidden";
    const zone = el("i"); zone.style.cssText = "position:absolute;top:0;bottom:0;left:42%;width:22%;background:rgba(127,196,166,.35)";
    const nd = el("i"); nd.style.cssText = "position:absolute;top:3px;bottom:3px;width:4px;margin-left:-2px;border-radius:2px;background:#ff5fa2";
    track.append(zone, nd);
    const prog = el("div", "tb"), pb = el("i"); pb.style.cssText = "width:0%;transition:none;background:#7FC4A6"; prog.append(pb);
    const btn = el("button", "go", t2(zh, "按住", "Hold")); btn.style.touchAction = "none";
    const set = d => e => { down = d; if (e && e.cancelable) e.preventDefault(); };
    btn.addEventListener("pointerdown", set(true)); ["pointerup", "pointerleave", "pointercancel"].forEach(x => btn.addEventListener(x, set(false)));
    const step = ts => {
      if (c.isOver()) return; const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0; last = ts;
      v += (down ? 34 : -30) * dt + (Math.random() - 0.5) * 10 * dt * 6; v = Math.max(0, Math.min(100, v));
      nd.style.left = v + "%"; if (v >= 42 && v <= 64) got += dt; pb.style.width = Math.min(100, got / need * 100) + "%";
      if (got >= need) { c.submit(true); return; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    c.body.append(track, prog, btn, c.hint);
  };
  window.MG182 = ["m111_mark", "m111_seq", "m111_find", "m111_hold"];

  /* ---------- 《她毁了我的首秀》M120：24 个游戏按剧本动作重做 ---------- */
  const IMG = id => { const g = (typeof MG100 !== "undefined" ? MG100 : []).find(x => x.id === id); return g && g.img; };
  const E = (zh, en) => [zh, en];
  const M120 = [
    { id: "m120_g01", zh: "救回第一针", en: "Save the First Stitch", tpl: "m111_align", seconds: 40, pz: "袖边裂开了。拖动布片，让两边的线纹对齐，再用定位针固定。", pe: "The sleeve hem split. Drag the panel until the grain lines meet, then pin it.", target: 58, tol: 5, marks: [E("左片线纹", "Left grain"), E("右片线纹", "Right grain")] },
    { id: "m120_g02", zh: "9F痕迹", en: "The 9F Mark", tpl: "m111_pair", seconds: 40, pz: "比对现场照片上的楼层编号，选出真正一致的两张。", pe: "Compare the floor numbers in the photos. Pick the two that truly match.", items: [E("9F原现场照", "9F scene photo"), E("6F模糊照", "Blurry 6F photo"), E("9F近景", "9F close-up"), E("8F侧拍", "8F side shot")], pair: [0, 2] },
    { id: "m120_g03", zh: "领口三点", en: "Three Collar Points", tpl: "m111_seq", seconds: 35, pz: "领口有三个定位点。按顺序点：先左肩，经过锁骨，再到右肩。", pe: "The collar has three fitting points. Tap left shoulder, collarbone, then right shoulder.", points: [[E("左肩", "Left shoulder"), 18, 34], [E("锁骨", "Collarbone"), 50, 52], [E("右肩", "Right shoulder"), 82, 34]] },
    { id: "m120_g04", zh: "收据上的日期", en: "The Receipt Date", tpl: "m111_order", seconds: 40, pz: "整理品牌第一笔成交的票据，按发生顺序排好。", pe: "Sort the paperwork from the brand's first sale in the order it happened.", items: [E("展会纪念卡", "Expo card"), E("成交收据", "Sales receipt"), E("付款回执", "Payment slip")] },
    { id: "m120_g05", zh: "不该签的条款", en: "Find the Clause", tpl: "m111_mark", seconds: 40, pz: "逐条看合同。把允许未经授权拍你私人感情的条款圈出来。", pe: "Read the contract line by line. Mark the clause that allows filming your private life without consent.", ask: E("圈出有问题的条款", "Mark the clause that's a problem"), items: [E("第2条 赛事公平条款", "§2 Fair competition"), E("第4条 摄影公开条款（限秀场）", "§4 Photo publicity (runway only)"), E("第7条 私人生活授权条款", "§7 Private-life release"), E("第9条 费用结算条款", "§9 Payment terms")], ans: [2] },
    { id: "m120_g06", zh: "被遮住的照片", en: "The Hidden Print", tpl: "m111_mark", seconds: 40, pz: "展墙上要挂照片。把可以公开展出的全部点亮。", pe: "The wall needs prints. Light up every photo that can be shown publicly.", ask: E("可以展出的是哪些？", "Which can be shown?"), items: [E("授权工作照 · 打版台", "Authorized work photo · pattern table"), E("授权工作照 · 试衣间", "Authorized work photo · fitting room"), E("未授权的私人照", "Unauthorized private photo"), E("已提出撤展的作品", "Piece you asked to withdraw")], ans: [0, 1] },
    { id: "m120_g07", zh: "完整采访", en: "The Full Statement", tpl: "m111_order", seconds: 40, pz: "把采访录音片段按真实顺序排好。", pe: "Put the interview clips back in their real order.", items: [E("记者提问", "Reporter's question"), E("Sloane回应", "Sloane answers"), E("会后承认", "Later admission")] },
    { id: "m120_g08", zh: "上传源头", en: "Track the Upload", tpl: "m111_mark", seconds: 45, pz: "比对两张图的上传记录。只圈出现在就能写下的结论。", pe: "Compare the two upload records. Mark only the conclusions you can write down now.", ask: E("哪些结论站得住？", "Which conclusions hold?"), items: [E("两张图的哈希不同", "The two hashes differ"), E("泄露来源尚未证实", "The leak source isn't proven yet"), E("泄露来自官方团队", "The leak came from the official team"), E("Evelyn一定是泄露者", "Evelyn must be the leaker")], ans: [0, 1] },
    { id: "m120_g09", zh: "删掉那一格", en: "Cancel the Shot", tpl: "m111_mark", seconds: 40, pz: "拍摄日程表上有五个机位。把必须移出的那一格圈出来。", pe: "The shoot schedule has five setups. Mark the one that has to go.", ask: E("哪个机位要删？", "Which shot goes?"), items: [E("公开走秀镜头", "Public runway shot"), E("服装细节镜头", "Garment detail shot"), E("后台准备镜头（已授权）", "Backstage prep (authorized)"), E("未经同意的旧情侣镜头", "Ex-couple shot nobody agreed to"), E("谢幕镜头", "Curtain-call shot")], ans: [3] },
    { id: "m120_g10", zh: "夜风里的别针", en: "The Safety Pin", tpl: "m111_find", seconds: 35, pz: "天台很暗，风把一枚松脱的别针吹到了栏杆边。用手电找到它，别让它勾住裙摆。", pe: "The rooftop is dark and the wind blew a loose pin toward the railing. Find it with the flashlight before it snags the hem.", label: E("移动手电，找到松脱的别针", "Move the light and find the loose pin"), target: "🧷", decoy: ["🔘", "🪙", "📎", "🍂", "🔩"] },
    { id: "m120_g11", zh: "暗房的遮幅", en: "Protect the Worker", tpl: "m111_mark", seconds: 40, pz: "照片里有一位没授权的工人。只遮住会让人认出他的那一处，照片其余部分照常展出。", pe: "An unconsented worker is in the shot. Cover only what identifies him; the rest of the photo stays.", ask: E("遮光板盖在哪？", "Where does the mask go?"), items: [E("照片主体（模特）", "Main subject (model)"), E("工人的姓名牌", "Worker's name tag"), E("背景里的衣架", "Clothing rack in the back"), E("整张照片", "The whole photo")], ans: [1] },
    { id: "m120_g12", zh: "报告的两个日期", en: "Two Report Dates", tpl: "m111_mark", seconds: 45, pz: "核对安全报告上的两个日期。圈出所有站得住的说法。", pe: "Check the two dates on the safety report. Mark every statement that holds up.", ask: E("哪些说法站得住？", "Which statements hold?"), items: [E("检测日期早于封存日期", "Testing came before sealing"), E("这个批次可以追溯", "The lot is traceable"), E("报告是伪造的", "The report is fake"), E("摘要已经足以定最终责任", "The summary settles final blame")], ans: [0, 1] },
    { id: "m120_g13", zh: "证言顺序", en: "Witness Timeline", tpl: "m111_order", seconds: 40, pz: "把三份记录按真实时间排好。", pe: "Put the three records in real time order.", items: [E("值班记录", "Shift log"), E("9F异常报告", "9F incident report"), E("停秀通知", "Shutdown notice")] },
    { id: "m120_g14", zh: "寄不出的信", en: "Unsent Letter", tpl: "m111_order", seconds: 40, pz: "Sloane沉默了多久？把这三件事按时间排好。", pe: "How long was Sloane silent? Put these in time order.", items: [E("首秀取消", "Show cancelled"), E("媒体归责于你", "Media blames you"), E("那封没寄出的信", "The unsent letter")] },
    { id: "m120_g15", zh: "小灯下的针", en: "Needle in the Dark", tpl: "m111_find", seconds: 35, pz: "停电了，银针掉在桌脚附近。用手电一格一格照，找到后放回针盒。", pe: "Power's out and the silver needle fell near the table leg. Sweep with the flashlight and put it back in the box.", label: E("移动手电，找到银针", "Move the light and find the needle"), target: "🪡", decoy: ["🧵", "🔘", "📎", "✂️", "🧶"] },
    { id: "m120_g16", zh: "照片使用许可", en: "Photo Consent Check", tpl: "m111_classify", seconds: 45, pz: "把每类照片放进正确的处理方式。", pe: "Sort each kind of photo into the right handling.", bins: [E("展出", "Show"), E("私存", "Keep private"), E("移除", "Remove")], items: [[E("授权工作照", "Authorized work photos"), 0], [E("私人底片", "Private negatives"), 1], [E("已撤展的作品", "Withdrawn pieces"), 2]] },
    { id: "m120_g17", zh: "底片元数据", en: "Negative Metadata", tpl: "m111_pair", seconds: 40, pz: "比对三处时间码，选出真正一致的两项。", pe: "Compare the three timecodes and pick the two that truly match.", items: [E("原始底片时间码", "Original negative timecode"), E("授权登记时间码", "Consent registry timecode"), E("媒体截图时间码", "Media screenshot timecode")], pair: [0, 1] },
    { id: "m120_g18", zh: "原话在哪里", en: "Restore the Quote", tpl: "m111_mark", seconds: 40, pz: "把短剪版和原始问答逐段对齐。圈出短剪版里被删掉的部分。", pe: "Line up the short cut with the full Q&A. Mark what the short cut deleted.", ask: E("被删掉的是哪段？", "What was cut?"), items: [E("片头字幕", "Opening titles"), E("记者的提问", "Reporter's question"), E("Sloane的完整答复", "Sloane's full answer"), E("片尾署名", "End credits")], ans: [2] },
    { id: "m120_g19", zh: "两份互不交换的合同", en: "Separate Agreements", tpl: "m111_classify", seconds: 40, pz: "摄影许可、工作指导、私人邀约——各自放进该去的地方。", pe: "Photo consent, mentoring, a private invitation—put each where it belongs.", bins: [E("专业合同", "Work contract"), E("另外处理", "Kept separate")], items: [[E("摄影许可", "Photo consent"), 0], [E("工作指导", "Mentoring"), 0], [E("私人邀约", "Private invitation"), 1]] },
    { id: "m120_g20", zh: "安全走台线", en: "Safe Runway Path", tpl: "m111_align", seconds: 40, pz: "移动灯架旁边有一条安全线。拖动裙摆的落点，停在安全线上，不越过去。", pe: "There's a safety line beside the moving rig. Drag the hem's mark onto the line without crossing it.", target: 36, tol: 5, marks: [E("裙摆", "Hem"), E("灯架", "Light rig")] },
    { id: "m120_g21", zh: "最后一针", en: "The Final Stitch", tpl: "m111_hold", seconds: 40, pz: "压轴裙摆只剩最后一针。按住压脚，把针脚稳在绿区里走完。", pe: "One stitch left on the finale gown. Hold the presser foot and keep the stitch in the green.", label: E("按住，让针脚稳稳走完", "Hold steady to finish the stitch"), need: 4 },
    { id: "m120_g22", zh: "只签事实", en: "Sign the Facts", tpl: "m111_mark", seconds: 40, pz: "责任声明只能写事实。圈出还不能当事实写进去的内容。", pe: "The statement can only hold facts. Mark what can't be written as fact yet.", ask: E("哪些还不是事实？", "What isn't fact yet?"), items: [E("安全叫停的记录", "The safety shutdown record"), E("错误归责的报道", "Reports that wrongly blamed you"), E("谁指使泄露的猜测", "Guesses about who ordered the leak")], ans: [2] },
    { id: "m120_g23", zh: "属于你的版权", en: "Your Rights", tpl: "m111_classify", seconds: 45, pz: "新订单、展示许可、摄影授权都签了。哪些权利归你的工作室，哪些只是给别人用？", pe: "The order, display license and photo license are signed. What stays with your studio, and what's only licensed out?", bins: [E("归工作室所有", "Owned by your studio"), E("只限定使用范围", "Limited use only")], items: [[E("核心设计版权", "Core design copyright"), 0], [E("新订单的生产使用", "Production use for the order"), 1], [E("展示许可", "Display license"), 1], [E("摄影授权", "Photo license"), 1]] },
    { id: "m120_g24", zh: "下一个星期六", en: "Next Saturday", tpl: "m111_order", seconds: 40, pz: "安排下周的日程，按先后排好。", pe: "Plan next week. Put it in order.", items: [E("客户交付", "Client delivery"), E("团队休息", "Crew rest"), E("个人时间", "Personal time")] },
  ];
  if (window.MG168 && window.MG168.reg) {
    window.MG168.reg(M120.map(g => Object.assign({ img: IMG(g.id) }, g, { a: "", b: "" })));
  }
})();

/* ===== mod183: M118《暴雨证词》32 个小游戏按剧本动作重做，不再是三选一（2026-11-24） ===== */
(function () {
  "use strict";
  if (!window.MG168 || !window.MG168.reg) return;
  const E = (zh, en) => [zh, en];
  const IMG = id => { const g = (typeof MG100 !== "undefined" ? MG100 : []).find(x => x.id === id); return g && g.img; };
  const G = [
    { id: "m118_c01_g1", zh: "湿卡时间核验", en: "Rain-Soaked Pass", tpl: "m111_mark", pz: "对照门禁系统时间和手写登记时间。把应该优先保全的记录全部圈出来。", pe: "Compare the gate-system times with the handwritten log. Mark every record that must be preserved first.", ask: E("优先保全哪些？", "What gets preserved first?"), items: [E("原始门禁系统导出", "Original gate-system export"), E("手写登记表原件", "The original handwritten log"), E("雨中听来的口头传言", "Word of mouth in the rain"), E("屏幕的模糊翻拍照", "A blurry photo of a screen")], ans: [0, 1] },
    { id: "m118_c01_g2", zh: "反光机位识别", en: "Impossible Reflection", tpl: "m111_order", pz: "镜头反光里像有一个人影。按正确的处理步骤排好，不要直接下结论。", pe: "There seems to be a figure in the lens reflection. Put the handling steps in order—no jumping to conclusions.", items: [E("标记反光异常", "Flag the reflection anomaly"), E("请求原始源文件", "Request the original source file"), E("拿到源文件后再判断身份", "Judge identity only after the source arrives")] },
    { id: "m118_c02_g1", zh: "三只时钟", en: "Three Clocks", tpl: "m111_order", pz: "本地时间、服务器时间、警局日志各走各的。按校准步骤排好，才能放上同一条时间线。", pe: "Local time, server time and the police log all disagree. Order the calibration steps so they fit one timeline.", items: [E("统一成同一个时区", "Convert to one time zone"), E("校正每台设备的偏差", "Correct each device's drift"), E("按校正后的时间排序", "Sort by corrected time")] },
    { id: "m118_c02_g2", zh: "旧听证索引", en: "The Hearing Index", tpl: "m111_spot", cols: 2, pz: "档案柜里六份材料。点出与SABLE-19有关的公开听证文件，私人信件不能用。", pe: "Six items in the cabinet. Tap the public hearing file on SABLE-19—private letters are off-limits.", ask: E("点出那份公开听证文件", "Tap the public hearing file"), items: [E("邻居的私信", "A neighbor's private message"), E("未授权访问日志", "An unauthorized access log"), E("报纸剪报", "A newspaper clipping"), E("公开听证编号 · SABLE-19", "Public hearing no. SABLE-19"), E("私人手写信", "A private handwritten letter"), E("无关的采购公告", "An unrelated procurement notice")], ans: 3 },
    { id: "m118_c03_g1", zh: "虚构机位拼图", en: "The Fourth Camera", tpl: "m111_mark", seconds: 45, pz: "把公开采购的摄像头和仓库墙面图对照。圈出真正对得上安装点的设备。", pe: "Match the publicly procured cameras against the warehouse wall plan. Mark the devices that fit real install points.", ask: E("哪些机位是真的？", "Which cameras are real?"), items: [E("采购单A · 北门上方", "Order A · above the north door"), E("采购单B · 装卸口", "Order B · loading dock"), E("采购单C · 东墙通道", "Order C · east corridor"), E("第四台 · 没有采购记录", "Fourth camera · no purchase record")], ans: [0, 1, 2] },
    { id: "m118_c03_g2", zh: "九帧不同步", en: "Nine Frames Early", tpl: "m111_align", seconds: 40, pz: "拖动音轨，让脚步声对上鞋跟落地的那一帧。对上之后你会看到：声音早了九帧——这只能说明音画不同步，不能证明更多。", pe: "Drag the audio track until the footstep meets the heel strike. You'll see it's nine frames early—a sync anomaly, nothing more.", target: 63, tol: 5, marks: [E("脚步声", "Footstep"), E("鞋跟落地", "Heel strike")] },
    { id: "m118_c04_g1", zh: "证词来源卡", en: "What Did You See?", tpl: "m111_classify", seconds: 45, pz: "把证人的每句话放进对的类别：亲眼所见、转述、推测。", pe: "Sort each line of testimony: seen firsthand, secondhand, or a guess.", bins: [E("亲眼所见", "Saw it"), E("转述", "Heard it"), E("推测", "Guessing")], items: [[E("“我看见仓库的灯十点熄了。”", "“I saw the warehouse lights go out at ten.”"), 0], [E("“门卫跟我说那晚有人来过。”", "“The guard told me someone came that night.”"), 1], [E("“他大概是去销毁证据的。”", "“He was probably destroying evidence.”"), 2]] },
    { id: "m118_c04_g2", zh: "供应商交叉线索", en: "Supplier Trail", tpl: "m111_pair", pz: "核对Vesper公司的身份。选出地址真正一致的两份公开材料。", pe: "Verify Vesper's identity. Pick the two public records whose addresses truly match.", items: [E("采购公告上的供应商地址", "Supplier address on the procurement notice"), E("匿名留言里的地址", "Address in an anonymous comment"), E("公开注册记录上的Vesper地址", "Vesper's address in public registration"), E("私人邮箱的签名档", "A private email signature")], pair: [0, 2] },
    { id: "m118_c05_g1", zh: "资金年度表", en: "The Payment Year", tpl: "m111_mark", seconds: 45, pz: "把基金会捐款年度和赔偿审批年度排进同一张表。圈出这张表该遵守的做法。", pe: "Put the foundation's donation years and the compensation approval years in one table. Mark the right way to build it.", ask: E("这张表应该怎么做？", "How should the table work?"), items: [E("按年份逐行对照", "Match row by row by year"), E("对不上的年份标“未知”", "Mark unmatched years “unknown”"), E("有收款就当作犯罪", "Treat any payment as a crime"), E("只看金额最大的那笔", "Only look at the largest sum")], ans: [0, 1] },
    { id: "m118_c05_g2", zh: "照片角落编码", en: "The Corner Code", tpl: "m111_spot", cols: 2, pz: "原始照片的四个角落各有一点字迹。点出与旧仓库有关、可以公开引用的编号。", pe: "Each corner of the original photo has some marking. Tap the public code tied to the old warehouse.", ask: E("点出那个公开编号", "Tap the public code"), items: [E("左上 · 冲印日期戳", "Top-left · print date stamp"), E("右上 · 模糊的水印", "Top-right · blurred watermark"), E("左下 · 警员徽号（不可公开）", "Bottom-left · officer badge (not public)"), E("右下 · SABLE-19", "Bottom-right · SABLE-19")], ans: 3 },
    { id: "m118_c06_g1", zh: "演示片缺失秒数", en: "Missing Disclaimer", tpl: "m111_mark", pz: "把官方完整版和转发剪辑版逐段对齐。圈出剪辑版里被删掉的内容。", pe: "Line up the official full cut with the reposted edit. Mark what the edit removed.", ask: E("被删掉的是哪段？", "What was removed?"), items: [E("演示开场音乐", "Opening music"), E("人物姓名表", "Cast list"), E("“重建推断”免责声明", "The “reconstruction” disclaimer"), E("片尾版权页", "End copyright card")], ans: [2] },
    { id: "m118_c06_g2", zh: "钟鸣与画面", en: "The Bell Does Not Lie", tpl: "m111_mark", seconds: 45, pz: "背景里的钟声和视频标注时间对不上。圈出现在能成立的判断。", pe: "The bell in the background doesn't match the video's timestamp. Mark the judgments that hold right now.", ask: E("哪些判断成立？", "Which judgments hold?"), items: [E("钟声与标注时间存在冲突", "The bell conflicts with the timestamp"), E("需要保全原始文件再核查", "Preserve the original file for review"), E("这已经直接证明了杀人", "This proves murder outright"), E("原文件不用保全了", "No need to keep the original")], ans: [0, 1] },
    { id: "m118_c07_g1", zh: "授权与保管", en: "Two Different Keys", tpl: "m111_match", seconds: 40, pz: "文件保全和见证不能落在同一个人手里。把每个角色配上该做的事。", pe: "Preservation and witnessing can't sit with one person. Match each role to its job.", items: [[E("律师", "Counsel"), E("文件保全授权", "Authorize preservation")], [E("独立机构", "Independent body"), E("见证签字", "Witness the record")], [E("记者", "Reporter"), E("只报道已核实部分", "Report only what's verified")]] },
    { id: "m118_c07_g2", zh: "纪要措辞核验", en: "The Exact Minutes", tpl: "m111_mark", pz: "要引用听证会上的一句话。圈出可以当作原文引用的来源。", pe: "You need to quote a line from the hearing. Mark the source you can quote as the record.", ask: E("可以引用哪个？", "What can you quote?"), items: [E("最终签署的纪要", "The final signed minutes"), E("未签署的草稿", "The unsigned draft"), E("朋友圈截图", "A social-media screenshot"), E("对Nolan想法的猜测", "A guess at what Nolan meant")], ans: [0] },
    { id: "m118_c08_g1", zh: "证人安全路线", en: "The Approved Route", tpl: "m111_order", pz: "只走证人已经同意的公共路线，绕开封闭施工。按顺序排好这段路。", pe: "Use only the public route the witness agreed to, avoiding the closed site. Put the legs in order.", items: [E("在约定的集合点碰面", "Meet at the agreed point"), E("沿开放的地铁换乘", "Take the open subway transfer"), E("从法院东门进入", "Enter by the courthouse east door")] },
    { id: "m118_c08_g2", zh: "一张证词的边界", en: "The Witness Boundary", tpl: "m111_mark", pz: "Iris的证词只能写她亲眼经历的。把能写进去的圈出来。", pe: "Iris's statement can only hold what she saw herself. Mark what can go in.", ask: E("哪些是她亲眼所见？", "What did she see herself?"), items: [E("她亲眼看到的记录封存指令", "The sealing order she saw herself"), E("她猜某人杀了人", "Her guess that someone killed"), E("媒体编写的动机", "A motive the media wrote"), E("别人转告她的传言", "A rumor someone passed to her")], ans: [0] },
    { id: "m118_c09_g1", zh: "照片不能说谎吗", en: "Crop and Context", tpl: "m111_mark", pz: "同一张照片有两种裁法。圈出发布时必须保留、才不会误导的东西。", pe: "The same photo can be cropped two ways. Mark what must stay in so it doesn't mislead.", ask: E("必须保留什么？", "What must stay?"), items: [E("完整的场景", "The full scene"), E("拍摄时间", "When it was taken"), E("只裁出两人同框", "Only the two of them in frame"), E("只留Damien一个人", "Only Damien")], ans: [0, 1] },
    { id: "m118_c09_g2", zh: "关系不是证据", en: "Memory vs Fact", tpl: "m111_classify", seconds: 45, pz: "把私人回忆和案件里可以核验的事实分开放。", pe: "Separate private memories from facts the case can verify.", bins: [E("私人回忆", "Private memory"), E("可核验事实", "Verifiable fact")], items: [[E("那晚他对你说过的话", "What he said to you that night"), 0], [E("门禁记录上的时间", "The time on the gate log"), 1], [E("你们第一次约会的地方", "Where you had your first date"), 0], [E("听证会公开纪要", "The public hearing minutes"), 1]] },
    { id: "m118_c10_g1", zh: "匿名消息核验", en: "Anonymous Claims", tpl: "m111_mark", pz: "三条匿名爆料互相矛盾。圈出能实地去核实的那一条。", pe: "Three anonymous tips contradict each other. Mark the one you can check on the ground.", ask: E("哪条能核实？", "Which can be checked?"), items: [E("写明时间和地点的记录", "The one with a time and place"), E("只有情绪的帖文", "The post that's all emotion"), E("几个人互相转述的猜测", "Speculation passed around")], ans: [0] },
    { id: "m118_c10_g2", zh: "到庭清单", en: "Counsel and Court", tpl: "m111_order", pz: "收到传票了。按合法到庭的步骤排好。", pe: "The subpoena arrived. Put the steps for appearing in court in order.", items: [E("向律师确认日期", "Confirm the date with counsel"), E("准备传票要求的材料", "Prepare what the subpoena asks for"), E("按时到庭", "Appear on time")] },
    { id: "m118_c11_g1", zh: "钟楼双时间", en: "Two Independent Clocks", tpl: "m111_align", seconds: 40, pz: "拖动标记，把老剧院的钟响和路口信号灯变化对到同一个时间点——两个都能独立核实。", pe: "Drag the marker so the old theater's bell and the traffic signal change meet at one moment—both independently checkable.", target: 47, tol: 5, marks: [E("钟响", "Bell"), E("信号灯变化", "Signal change")] },
    { id: "m118_c11_g2", zh: "公文包路线", en: "Silver Case Route", tpl: "m111_seq", seconds: 40, pz: "街景里的银色公文包出现在三个画面。不认脸，只按物件和时间顺序点出它的路线。", pe: "The silver case shows up in three street frames. Ignore faces—tap its route by object and time.", points: [[E("画面1 · 21:02", "Frame 1 · 21:02"), 20, 70], [E("画面2 · 21:05", "Frame 2 · 21:05"), 52, 40], [E("画面3 · 21:09", "Frame 3 · 21:09"), 80, 64]] },
    { id: "m118_c12_g1", zh: "文件与校验摘要", en: "Provenance Match", tpl: "m111_pair", pz: "不看文件名、不看图标。选出校验摘要真正一致的两项。", pe: "Ignore filenames and icons. Pick the two whose digests truly match.", items: [E("原始文件的校验摘要", "Digest of the original file"), E("同名副本", "A copy with the same name"), E("剪辑版的校验摘要", "Digest of the edited cut"), E("见证记录里登记的摘要", "Digest logged in the witness record")], pair: [0, 3] },
    { id: "m118_c12_g2", zh: "不是实拍", en: "Reconstruction Field", tpl: "m111_mark", pz: "读每个版本的导出说明。圈出唯一保留了“事件重建概率”字段的那个版本。", pe: "Read each export note. Mark the only version that keeps the reconstruction-probability field.", ask: E("哪个版本？", "Which version?"), items: [E("被剪辑的展示版", "The edited showcase cut"), E("保留reconstruction probability字段的版本", "The version with the reconstruction-probability field"), E("匿名媒体转发版", "The anonymous outlet's repost"), E("压缩后的预览版", "The compressed preview")], ans: [1] },
    { id: "m118_c13_g1", zh: "材料找出处", en: "Who Owns the Source", tpl: "m111_match", seconds: 45, pz: "给每份听证材料配上它的出处和能公开的范围。", pe: "Match each hearing exhibit to its source and how much can be disclosed.", items: [[E("门禁导出", "Gate export"), E("物业提供 · 可完整披露", "From building management · fully disclosable")], [E("Iris的证词", "Iris's statement"), E("仅限她书面同意的段落", "Only passages she approved in writing")], [E("听证纪要", "Hearing minutes"), E("公开档案", "Public record")]] },
    { id: "m118_c13_g2", zh: "推测与事实", en: "Claims on the Record", tpl: "m111_classify", seconds: 45, pz: "把Nolan发言里的每种说法分成“可验证”和“无法验证”。", pe: "Sort each kind of claim in Nolan's statement: verifiable or not.", bins: [E("可验证", "Verifiable"), E("无法验证", "Unverifiable")], items: [[E("附了文件编号的说法", "A claim citing a document number"), 0], [E("附了时间地点的说法", "A claim with a time and place"), 0], [E("关于别人动机的猜测", "A guess about someone's motive"), 1], [E("以“我相信”开头的判断", "A judgment starting “I believe”"), 1]] },
    { id: "m118_c14_g1", zh: "证词三色标注", en: "Three Kinds of Truth", tpl: "m111_classify", seconds: 45, pz: "用三种颜色标注证词：亲历、收到的邮件、个人推测。", pe: "Color-code the testimony: firsthand, received email, personal guess.", bins: [E("亲历", "Firsthand"), E("收到的邮件", "Email received"), E("个人推测", "Guess")], items: [[E("亲眼看到的封存指令", "The sealing order she saw"), 0], [E("当天收到的内部邮件", "The internal email that day"), 1], [E("“我觉得这和事故有关”", "“I think it's tied to the accident”"), 2]] },
    { id: "m118_c14_g2", zh: "谁能公开什么", en: "Consent to Disclose", tpl: "m111_classify", seconds: 45, pz: "按Iris明确授权的范围，把她的资料分成能公开和不能公开。", pe: "Using only what Iris explicitly authorized, sort her material into public and private.", bins: [E("可以公开", "Can publish"), E("不能公开", "Keep private")], items: [[E("她书面同意的证词段落", "Passages she approved in writing"), 0], [E("她的住址", "Her home address"), 1], [E("她没同意的私人细节", "Private details she didn't approve"), 1], [E("听证会上已公开的内容", "What was already public at the hearing"), 0]] },
    { id: "m118_c15_g1", zh: "程序先于头条", en: "First Preserve, Then Publish", tpl: "m111_order", pz: "头条可以等。把证据保全、见证人许可和新闻发布排好先后。", pe: "The headline can wait. Order preservation, witness consent and publication.", items: [E("保全证据", "Preserve the evidence"), E("征得见证人许可", "Get the witness's consent"), E("发布已核实的部分", "Publish what's verified")] },
    { id: "m118_c15_g2", zh: "两条罪责链", en: "Two Different Cases", tpl: "m111_classify", seconds: 45, pz: "“推断被误标成实拍”和“实际凶案”是两件事。把证据各自归队。", pe: "“A reconstruction mislabeled as real” and “the actual killing” are separate cases. Sort the evidence.", bins: [E("推断误标", "Mislabeled reconstruction"), E("实际凶案", "Actual killing")], items: [[E("被当成实拍的重建视频", "The reconstruction passed off as real"), 0], [E("被删掉的免责声明", "The deleted disclaimer"), 0], [E("银色公文包的街景路线", "The silver case's street route"), 1], [E("钟楼与信号灯的双时间窗", "The bell-and-signal time window"), 1]] },
    { id: "m118_c16_g1", zh: "手表和今天", en: "Watch the Memory", tpl: "m111_order", pz: "把三段回忆按发生顺序排好。今天的感受可以和当年不一样。", pe: "Put the three memories in order. How you feel today can differ from back then.", items: [E("旧日约会", "The old date"), E("离别", "The goodbye"), E("现在", "Now")] },
    { id: "m118_c16_g2", zh: "未来不是判决", en: "Tomorrow's Terms", tpl: "m111_mark", pz: "谈以后的关系或生活计划。圈出该写进约定的边界。", pe: "Talking about what comes next. Mark the boundaries that belong in the agreement.", ask: E("约定里该有什么？", "What belongs in it?"), items: [E("先征得双方同意", "Both agree first"), E("约定以后可以修改", "It can be revised later"), E("要求对方永久承诺", "Demand a permanent promise"), E("用案件结果换感情", "Trade the case outcome for romance")], ans: [0, 1] },
  ];
  window.MG168.reg(G.map(g => Object.assign({ seconds: 40, img: IMG(g.id) }, g, { a: "", b: "" })));
  window.MG183 = G.length;
})();

/* ===== mod184: 敲击码玩法 + M111–M117 剩下的 67 个三选一全部换成真正的玩法（2026-11-24）=====
   新模板：m111_morse  敲击码  code:"...-"（. 短按  - 长按）  label:[中,英]     按住不到 0.3 秒是短，超过是长
   到这里为止，全站剧情小游戏里没有三选一了。 */
(function () {
  "use strict";
  if (typeof MG_T === "undefined" || !window.MG168 || !window.MG168.reg) return;
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const t2 = (zh, a, b) => (zh ? a : b);
  const L = (x, zh) => (Array.isArray(x) ? x[zh ? 0 : 1] : x);
  MG_T.m111_morse = function (A, G, sub, done, T, zh) {
    A.className = "mgarea m168"; A.innerHTML = "";
    sub.textContent = L(G.label, zh) || t2(zh, "短按是短，长按是长。照着敲出来。", "Tap short or hold long to match the code.");
    if (G.img) { const im = el("img"); im.src = G.img; im.alt = ""; im.style.cssText = "width:100%;max-height:170px;object-fit:cover;border-radius:12px;display:block"; A.append(im); }
    A.append(el("p", "pr", zh ? G.pz : G.pe));
    const tb = el("div", "tb"), bar = el("i"); tb.append(bar); A.append(tb);
    const secs = G.seconds || 40, code = String(G.code || "...-"); let over = false, tries = 0, cur = "", t0 = 0;
    requestAnimationFrame(() => { bar.style.transitionDuration = secs + "s"; bar.style.width = "0%"; });
    T.push(setTimeout(() => { if (!over) { over = true; done("lose"); } }, secs * 1000));
    const slots = el("div"); slots.style.cssText = "display:flex;gap:10px;justify-content:center;margin:10px 0";
    const hint = el("p", "hint");
    const paint = () => { slots.innerHTML = ""; for (let i = 0; i < code.length; i++) { const s = el("i"); const c = cur[i]; s.style.cssText = "display:block;height:14px;border-radius:7px;background:" + (c ? "#ff5fa2" : "#3a3058") + ";width:" + (c === "-" ? "42px" : c === "." ? "14px" : "28px"); slots.append(s); } };
    const btn = el("button", "go", t2(zh, "敲", "Tap")); btn.style.cssText = "touch-action:none;min-height:72px;font-size:18px";
    btn.addEventListener("pointerdown", e => { if (over) return; t0 = performance.now(); btn.classList.add("on"); if (e.cancelable) e.preventDefault(); });
    btn.addEventListener("pointerup", () => {
      if (over || !t0) return; btn.classList.remove("on");
      cur += performance.now() - t0 < 300 ? "." : "-"; t0 = 0; paint();
      if (cur.length < code.length) return;
      if (cur === code) { over = true; done("win"); return; }
      if (tries++ < 1) { hint.textContent = t2(zh, "节奏不对，再敲一次。", "Wrong rhythm. Try again."); cur = ""; setTimeout(paint, 350); } else { over = true; done("lose"); }
    });
    btn.addEventListener("pointerleave", () => { if (t0) btn.dispatchEvent(new PointerEvent("pointerup")); });
    paint(); A.append(slots, btn, hint);
  };

  const E = (zh, en) => [zh, en];
  const IMG = id => { const g = (typeof MG100 !== "undefined" ? MG100 : []).find(x => x.id === id); return g && g.img; };
  const MK = (id, zh, en, pz, pe, ask, items, ans) => ({ id, zh, en, tpl: "m111_mark", pz, pe, ask, items, ans });
  const OR = (id, zh, en, pz, pe, items) => ({ id, zh, en, tpl: "m111_order", pz, pe, items });
  const CL = (id, zh, en, pz, pe, bins, items) => ({ id, zh, en, tpl: "m111_classify", seconds: 45, pz, pe, bins, items });
  const SP = (id, zh, en, pz, pe, ask, items, ans, cols) => ({ id, zh, en, tpl: "m111_spot", pz, pe, ask, items, ans, cols: cols || 2 });

  const LIST = [
    /* ---------- M117《夜班钟》 ---------- */
    MK("m117_c01_g1", "腕带的时间裂缝", "Wristband Time Gap", "腕带上写着22:17，系统里是00:17。圈出现在站得住的判断。", "The wristband says 22:17; the system says 00:17. Mark what holds up right now.", E("哪些判断站得住？", "What holds up?"), [E("22:17和00:17来自同一天", "22:17 and 00:17 are the same date"), E("00:17时已经出院", "Discharged by 00:17"), E("暂时不能确定到院时间", "Arrival time can't be confirmed yet"), E("需要调取分诊系统原始记录", "Pull the triage system's raw record")], [2, 3]),
    SP("m117_c01_g2", "七号病房封条", "Ward Seven Seal", "七号病房门上的封条。点出能证明封条被重新贴过的那一处。", "The seal on Ward Seven's door. Tap the detail that proves it was re-applied.", E("哪一处证明被换过？", "Which detail proves it?"), [E("旧封条上没有折痕", "No crease on the old seal"), E("封条边缘发黄", "Yellowed edges"), E("新封条盖住了旧铆钉", "New seal covers the old rivet"), E("门把手积了灰", "Dust on the handle")], 2),
    { id: "m117_c02_g1", zh: "拒收单上的同一枚章", en: "Same Stamp on Rejections", tpl: "m111_pair", pz: "三张拒收单上的印章。选出真正是同一枚章盖的两张。", pe: "Stamps on three rejection slips. Pick the two made by the same stamp.", items: [E("A · 右下角有破角", "A · chipped bottom-right"), E("B · 右下角有破角", "B · chipped bottom-right"), E("C · 颜色相同，没有破角", "C · same color, no chip")], pair: [0, 1] },
    OR("m117_c02_g2", "捐献说明的缺失行", "The Missing Line", "捐献说明里少了一行。按正确的顺序补全这段流程。", "A line is missing from the donation notice. Put the process back in order.", [E("先解释代价", "Explain the cost first"), E("回答对方的疑问", "Answer their questions"), E("邀请本人做决定", "Invite them to decide")]),
    SP("m117_c03_g1", "缺页的编号", "Missing Page Numbers", "病历的页码跳了。点出缺页前的最后一页。", "The chart's page numbers skip. Tap the last page before the gap.", E("缺页前是哪一页？", "Which page is right before the gap?"), [E("8", "8"), E("9", "9"), E("10", "10"), E("11", "11"), E("12", "12"), E("14", "14"), E("15", "15")], 4, 4),
    CL("m117_c03_g2", "隐私黑条", "Privacy Redaction", "要公开这份记录。哪些遮住，哪些留着？", "This record is going public. What gets blacked out, what stays?", [E("遮住", "Black out"), E("保留", "Keep")], [[E("患者姓名", "Patient's name"), 0], [E("住址", "Home address"), 0], [E("异常的日期", "The anomalous date"), 1]]),
    MK("m117_c04_g1", "黎明前的路线", "Route Before Dawn", "天亮前要把人送过去。圈出这条路线该做的事。", "Get them across before dawn. Mark what this route requires.", E("路线该怎么走？", "How should the route go?"), [E("走地下通道B", "Take underground passage B"), E("出发前复核封闭情况", "Recheck closures before leaving"), E("走最快的玻璃桥A", "Take glass bridge A, it's fastest"), E("临时穿过广场", "Cut across the square")], [0, 1]),
    { id: "m117_c04_g2", zh: "三短一长", en: "Three Short, One Long", tpl: "m111_morse", pz: "墙那边传来敲击声：三短一长。照着敲回去，让对方知道你听到了。", pe: "Knocks through the wall: three short, one long. Knock it back so they know you heard.", label: E("短按三下，再长按一下", "Three short taps, then one long hold"), code: "...-" },
    SP("m117_c05_g1", "两份死亡证明", "Two Death Certificates", "两份死亡证明放在一起。点出草签版缺的那一栏。", "Two certificates side by side. Tap the field the draft version is missing.", E("草签版缺了哪一栏？", "What's missing from the draft?"), [E("姓名", "Name"), E("日期", "Date"), E("医师签名", "Physician signature"), E("公证编号", "Notary number"), E("医院印章", "Hospital seal"), E("死因", "Cause of death")], 3),
    OR("m117_c05_g2", "出院计划顺序", "Discharge Plan", "出院计划按正确的顺序排好。", "Put the discharge plan in the right order.", [E("医护评估", "Clinical assessment"), E("向患者说明结果", "Explain the results to the patient"), E("患者自己决定住在哪", "The patient decides where to live")]),
    MK("m117_c06_g1", "药价断点", "Price Break", "看这一周的药价曲线。圈出能成立的判断。", "Look at this week's drug prices. Mark the judgments that hold.", E("哪些判断成立？", "What holds?"), [E("医院被拒供那晚价格突然上涨", "Prices jumped the night the hospital was refused supply"), E("这个时间点值得追查供货记录", "That moment is worth tracing in supply records"), E("整周价格没变", "Prices didn't change all week"), E("药房是免费的", "The pharmacy is free")], [0, 1]),
    CL("m117_c06_g2", "记忆契约的边界", "Memory Contract Limits", "记忆捐献契约里，哪些可以，哪些不可以？", "In the memory-donation contract, what's allowed and what isn't?", [E("可以", "Allowed"), E("不可以", "Not allowed")], [[E("捐献之前撤回", "Withdraw before donating"), 0], [E("手术后要求撤回已经用掉的部分", "Withdraw what was already used after surgery"), 1], [E("家属替本人签一切", "Family signs everything for them"), 1]]),
    OR("m117_c07_g1", "未来日期搜查令", "Future-Dated Warrant", "把搜查令上的三个日期按先后排好——你会发现哪里不对。", "Order the warrant's three dates—you'll see what's wrong.", [E("申请提交", "Application filed"), E("搜查实际发生", "Search carried out"), E("落款日期", "Date on the signature")]),
    CL("m117_c07_g2", "匿名宣誓", "Anonymous Oath", "匿名宣誓书里，哪些能写，哪些不能写？", "In the anonymous affidavit, what can go in and what can't?", [E("可以写", "Can include"), E("不能写", "Can't include")], [[E("匿名编号", "Anonymous ID"), 0], [E("本人批准的事实", "Facts they approved"), 0], [E("真实住址", "Real address"), 1], [E("全部病历", "Full medical records"), 1]]),
    CL("m117_c08_g1", "两种可能的录像", "Two Possible Videos", "钟给出了两段录像。哪些已经发生，哪些只是预测？", "The clock produced two videos. What has happened, and what's only predicted?", [E("已经发生", "Happened"), E("只是预测", "Prediction only")], [[E("开心结局的那段", "The happy ending clip"), 1], [E("悲伤结局的那段", "The sad ending clip"), 1], [E("钟的原始核验日志", "The clock's raw verification log"), 0]]),
    OR("m117_c08_g2", "真实患者优先", "Real Patients First", "收治先看真实的人。按正确的流程排好。", "Admission starts with the real person. Put the process in order.", [E("采集真实的评估信息", "Collect real assessment info"), E("交给专业医护", "Hand it to clinicians"), E("由医护决定是否收治", "Clinicians decide on admission")]),
    SP("m117_c09_g1", "裁掉的真相", "The Cropped Truth", "原图被裁过。点出被裁掉的那一块。", "The original was cropped. Tap the part that was cut out.", E("被裁掉的是哪块？", "What was cut?"), [E("左侧 · 围观的人", "Left · onlookers"), E("中间 · 两个人", "Center · two people"), E("右侧 · 一辆救护车", "Right · an ambulance")], 2, 3),
    MK("m117_c09_g2", "公开信里的名字", "Names on the Letter", "公开信要署名。圈出正确的做法。", "The open letter needs names. Mark the right approach.", E("怎么署名？", "How do names work?"), [E("本人可以选择署名", "Each person may choose to sign"), E("其他人可以匿名", "Others may stay anonymous"), E("所有人必须署名", "Everyone must sign"), E("负责人统一代签", "One person signs for all")], [0, 1]),
    MK("m117_c10_g1", "备用电池标签", "Backup Battery Labels", "停电前检查备用电池。圈出被互相调换的两张标签。", "Checking backup batteries before the outage. Mark the two labels that were swapped.", E("哪两张被调换了？", "Which two were swapped?"), [E("冷却柜上的标签", "Label on the cooling cabinet"), E("照明柜上的标签", "Label on the lighting cabinet"), E("监护仪上的标签", "Label on the monitor"), E("门禁箱上的标签", "Label on the access box")], [0, 1]),
    { id: "m117_c10_g2", zh: "地下敲击码", en: "Underground Code", tpl: "m111_morse", pz: "地下层只能靠敲管道联络。照约定敲出：三短一长。", pe: "Below ground you can only signal on the pipes. Knock the agreed code: three short, one long.", label: E("短按三下，再长按一下", "Three short taps, then one long hold"), code: "...-" },
    { id: "m117_c11_g1", zh: "试点印章的变更", en: "Pilot Stamp Change", tpl: "m111_match", pz: "两枚印章各授权了什么？配对起来。", pe: "What did each stamp authorize? Match them.", items: [[E("旧章", "Old stamp"), E("授权研究", "Authorized research")], [E("新章", "New stamp"), E("扩展到筛选", "Extended to screening")]] },
    MK("m117_c11_g2", "道歉不是免罪卡", "An Apology Isn't a Pardon", "医院要道歉。圈出真正有分量的做法。", "The hospital wants to apologize. Mark what actually carries weight.", E("哪些算数？", "What counts?"), [E("公开承认", "Admit it publicly"), E("接受外部监督", "Accept outside oversight"), E("说句对不起就恢复信任", "Say sorry and trust is restored"), E("用礼物换原谅", "Trade gifts for forgiveness")], [0, 1]),
    MK("m117_c12_g1", "证人期限", "Witness Deadline", "核对证人保护授权。圈出成立的判断。", "Check the witness-protection authorization. Mark what holds.", E("哪些成立？", "What holds?"), [E("保护授权三年前已经到期", "The authorization expired three years ago"), E("需要重新取得授权", "It needs to be renewed"), E("这个期限永远不会过期", "It never expires"), E("只有口头授权", "It was only verbal")], [0, 1]),
    CL("m117_c12_g2", "属于Lucian的证词", "Lucian's Testimony", "Lucian的证词要公开。哪些公开，哪些遮住？", "Lucian's testimony is going public. What's shown, what's covered?", [E("公开", "Show"), E("遮住", "Cover")], [[E("他本人的经历", "His own experience"), 0], [E("其他患者的信息", "Other patients' info"), 1], [E("保护者的姓名", "Protectors' names"), 1]]),
    MK("m117_c13_g1", "资金拆分", "Split Funding", "三笔小额拨款和一张患者捐献收据。圈出其实来自同一笔被拆开拨款的那几笔。", "Three small transfers and one patient-donation receipt. Mark the ones that came from one split grant.", E("哪些是同一笔拆出来的？", "Which came from one split grant?"), [E("收据1 · 拨款编号尾号0417", "Receipt 1 · grant ref ending 0417"), E("收据2 · 拨款编号尾号0417", "Receipt 2 · grant ref ending 0417"), E("收据3 · 拨款编号尾号0417", "Receipt 3 · grant ref ending 0417"), E("患者捐献收据", "Patient donation receipt")], [0, 1, 2]),
    CL("m117_c13_g2", "没有面孔的抗议", "Faceless Protest", "拍抗议现场。哪些能拍，哪些不能拍？", "Filming the protest. What can be shot, what can't?", [E("可以拍", "OK to film"), E("不能拍", "Don't film")], [[E("没写字的纸板", "Blank cardboard signs"), 0], [E("远景", "Wide shots"), 0], [E("患者病历特写", "Close-ups of medical records"), 1], [E("患者的脸", "Patients' faces"), 1]]),
    MK("m117_c14_g1", "未来画面接错线", "Crossed Wires", "检查机房的线路。圈出成立的判断。", "Check the server-room wiring. Mark what holds.", E("哪些成立？", "What holds?"), [E("预测端口被接进了历史回放", "The prediction port feeds the history playback"), E("需要把两路重新分开", "The two feeds must be separated"), E("历史回放只接了历史", "History playback only carries history"), E("预测和历史是同一份东西", "Prediction and history are the same")], [0, 1]),
    OR("m117_c14_g2", "匿名冻结凭证", "Anonymous Freeze", "处理名单数据。按正确顺序排好。", "Handle the list data. Put the steps in order.", [E("冻结", "Freeze"), E("删除", "Delete"), E("只保留匿名证明", "Keep only an anonymous record")]),
    CL("m117_c15_g1", "证据的三层", "Three Layers of Evidence", "把材料放进三栏：事实、推测、预测。", "Sort the material into three columns: fact, inference, prediction.", [E("事实", "Fact"), E("推测", "Inference"), E("预测", "Prediction")], [[E("核验日志", "Verification log"), 0], [E("“院长可能早就知情”", "“The director probably knew”"), 1], [E("钟给出的未来画面", "The clock's future footage"), 2]]),
    OR("m117_c15_g2", "改变规则的提案", "Proposal to Change the Rules", "新规则要上路。按正确的程序排好。", "A new rule is coming. Put the procedure in order.", [E("公开理由", "Publish the reasons"), E("听取申诉", "Hear appeals"), E("最后复核", "Final review")]),
    MK("m117_c16_g1", "新的夜班预算", "New Night-Shift Budget", "新的夜班预算。圈出该保留的部分。", "The new night-shift budget. Mark what should stay.", E("该保留什么？", "What should stay?"), [E("人工复核", "Human review"), E("社区补充渠道", "Community input channel"), E("预算全部买钟的预测", "Spend it all on the clock's predictions"), E("取消患者监督", "Drop patient oversight")], [0, 1]),
    MK("m117_c16_g2", "下一次夜班的约定", "Next Night Shift", "他想约你下一次夜班后见面。圈出一份好邀请该有的样子。", "He wants to see you after the next shift. Mark what a fair invitation looks like.", E("好的邀请是？", "A fair invitation is…"), [E("明确是自愿的", "Clearly voluntary"), E("不和医院服务绑定", "Not tied to hospital care"), E("用亲密换医疗资源", "Intimacy for medical resources"), E("不回应就失去全部帮助", "No reply means losing all help")], [0, 1]),

    /* ---------- M111 ---------- */
    SP("m111_archive_seal", "旧档案封条核验", "Check the Archive Seal", "档案柜上有两层封条。点出证明柜子最近被打开过的那一处痕迹。", "The cabinet has two layers of seal. Tap the trace that proves it was opened recently.", E("哪处痕迹证明封条被换过？", "Which trace proves it was replaced?"), [E("透明封条完整", "Clear seal intact"), E("柜角旧胶残留", "Old glue on the corner"), E("新封条压在旧胶上", "New seal over the old glue"), E("锁孔边有旧划痕", "Old scratches by the lock")], 2),
    { id: "m111_audio_wave", zh: "录音警报声波定位", en: "Find the Alarm in the Audio", tpl: "m111_align", pz: "珉载的录音里藏着一段被剪掉的警报。拖动播放头，停在三连短警报峰上。", pe: "Min-jae's recording hides a cut alarm. Drag the playhead onto the three short alarm peaks.", target: 50, tol: 7, marks: [E("A段 · 歌声", "A · vocals"), E("C段 · 尾奏", "C · outro")] },
    SP("m111_spotlight_cue", "七束追光异常检测", "Find the Rogue Spotlight", "灯控台上有七路追光，其中一路由已经失效的账号发出。点出那一路。", "Seven spotlight tracks on the console—one is driven by a revoked account. Tap it.", E("哪一路未经批准？", "Which track is unapproved?"), [E("轨道1 · 在册账号", "Track 1 · active account"), E("轨道2 · 在册账号", "Track 2 · active account"), E("轨道3 · 在册账号", "Track 3 · active account"), E("轨道4 · 在册账号", "Track 4 · active account"), E("轨道5 · 在册账号", "Track 5 · active account"), E("轨道6 · 在册账号", "Track 6 · active account"), E("轨道7 · 账号已失效", "Track 7 · revoked account")], 6, 4),
    { id: "m111_leak_edit", zh: "偷拍剪辑差异比对", en: "Spot the Edited Footage", tpl: "m111_align", pz: "把流出视频和原始监控放在一起。拖动时间轴，停在被删掉的八秒（08:31:12–08:31:20）上。", pe: "Line the leak up with the original CCTV. Drag the timeline onto the missing eight seconds (08:31:12–08:31:20).", target: 53, tol: 6, marks: [E("08:31:00", "08:31:00"), E("08:31:30", "08:31:30")] },
    SP("m111_barrier_inspection", "旧护栏安全检查", "Inspect the Old Barrier", "这是当年事故里的旧护栏。点出少了原装螺栓的位置。结果仍需独立检验员确认。", "The barrier from the old accident. Tap where the original bolt is missing. An independent inspector still has to confirm.", E("哪里少了螺栓？", "Where is the bolt missing?"), [E("扶手上缘", "Top rail"), E("立柱中段", "Mid-post"), E("底座左侧", "Base, left"), E("底座右侧", "Base, right")], 3),

    /* ---------- M112 ---------- */
    CL("m112_02_a", "王储的誓约试探", "The Prince's Vow", "卡西安递来三张誓言卡。把每一句放进它真正的意思。", "Cassian offers three vow cards. Sort each by what it really means.", [E("真正的誓言", "A real vow"), E("控制", "Control"), E("交易", "A deal")], [[E("“我当众护着你，去留由你自己定。”", "“I'll protect you publicly. Whether you stay is your call.”"), 0], [E("“从今天起，你哪里都不准去。”", "“From today you go nowhere.”"), 1], [E("“只要你听我的，我就保你不死。”", "“Obey me and I'll keep you alive.”"), 2]]),
    SP("m112_02", "王室印章碎片", "Royal Seal Fragments", "四枚契约印鉴里有一枚是伪造的第99世契约。数清王冠纹的齿，点出伪造的那枚。", "One of four seals is a forged 99th-life contract. Count the crown teeth and tap the fake.", E("哪一枚是伪造的？", "Which one is forged?"), [E("第97世 · 王冠纹七道齿", "97th · seven teeth"), E("第98世 · 王冠纹七道齿", "98th · seven teeth"), E("第99世 · 王冠纹六道齿", "99th · six teeth"), E("第100世 · 王冠纹七道齿", "100th · seven teeth")], 2),
    CL("m112_03_a", "白羽天平", "Feather Balance", "左盘已有5份重量。三枚羽片重1、2、3。把羽片放上右盘或留在手里，让天平平衡。", "The left pan holds 5. Feathers weigh 1, 2 and 3. Put each on the right pan or keep it, to balance the scale.", [E("放上右盘", "Right pan"), E("留在手里", "Keep")], [[E("羽片 · 重1", "Feather · 1"), 1], [E("羽片 · 重2", "Feather · 2"), 0], [E("羽片 · 重3", "Feather · 3"), 0]]),
    MK("m112_03", "被涂改的判决书", "The Altered Verdict", "卷宗里有一处批注的墨色和日期都不对。把它圈出来。", "One annotation has the wrong ink and date. Mark it.", E("哪一处是伪造的？", "Which one is forged?"), [E("“依天界律第七条审理”", "“Tried under Celestial Law VII”"), E("“判决生效于她出生前三年”", "“Verdict effective three years before her birth”"), E("“审判官卢西恩签署”", "“Signed, Judge Lucien”"), E("“书记官附注：已归档”", "“Clerk's note: filed”")], [1]),
    SP("m112_06_a", "影子找花", "Shadow Petals", "赛拉斯藏起的花束里有一朵被换过——同一种花，缺口方向却反了。点出来。", "One flower in Silas's bouquet was swapped—same kind, notch flipped. Tap it.", E("哪一朵被换过？", "Which one was swapped?"), [E("白蔷薇 · 花瓣完整", "White rose · intact"), E("夜百合 · 花瓣完整", "Night lily · intact"), E("紫鸢尾 · 缺口朝左", "Purple iris · notch left"), E("紫鸢尾 · 缺口朝右", "Purple iris · notch right"), E("黑郁金香 · 花瓣完整", "Black tulip · intact"), E("银铃兰 · 花瓣完整", "Silver lily · intact")], 3, 3),
    OR("m112_06", "密令编码纸", "The Coded Order", "密令写着：“月隐三刻，钟鸣之前。”把时间按先后排好，就知道下一次袭击在哪一刻。", "The order reads: “Moon hidden, third quarter, before the bell.” Put the times in order to find the attack.", [E("子夜 · 月隐", "Midnight · moon hidden"), E("第三刻 · 袭击", "Third quarter · the attack"), E("钟鸣", "The bell")]),
    MK("m112_09", "命运编年册", "Chronicle of Fate", "编年册里有一句台词每一世都一字不差地重复——那是剧本留下的破绽。圈出来。", "One line repeats word for word in every life—the script's flaw. Mark it.", E("哪一句是破绽？", "Which line is the flaw?"), [E("“今天的风有点冷。”（出现1次）", "“The wind is cold today.” (once)"), E("“反派千金必须在钟响时死去。”（出现99次）", "“The villainess must die at the bell.” (99 times)"), E("“我想去看海。”（出现2次）", "“I want to see the sea.” (twice)"), E("“茶凉了。”（出现3次）", "“The tea's gone cold.” (3 times)")], [1]),
    MK("m112_11_a", "夺回真名", "True Name Echo", "六个回声里，只有一个是你自己说过的承诺，其余都是别人替你写的命令。圈出你自己的那句。", "Of six echoes, only one is your own promise; the rest are orders written for you. Mark yours.", E("哪一句是你自己的？", "Which one is yours?"), [E("“我会安静地接受审判。”", "“I'll accept judgment quietly.”"), E("“我会按预言毁灭世界。”", "“I'll destroy the world as foretold.”"), E("“我要用自己的名字活下去。”", "“I'll live under my own name.”"), E("“我会嫁给被指定的人。”", "“I'll marry whoever is chosen.”"), E("“我会在钟响时死去。”", "“I'll die at the bell.”"), E("“我永远不离开高塔。”", "“I'll never leave the tower.”")], [2]),

    /* ---------- M113 ---------- */
    OR("m113_c02_g2", "火漆与指尖", "Wax Seal & Fingertips", "两枚火漆封印看起来一模一样。按正确的核对步骤排好。", "Two wax seals look identical. Put the checking steps in order.", [E("把A和B对齐", "Line up A and B"), E("翻到背面", "Turn them over"), E("核对背面编号", "Compare the numbers on the back")]),
    SP("m113_c04_g1", "蒙眼听声", "Follow My Voice", "你闭上眼睛。Julian说：“跟着我的声音走。”四个方向同时有声音，点出他在哪。", "Eyes closed. Julian says, “Follow my voice.” Sounds come from four directions—tap where he is.", E("Julian在哪个方向？", "Where is Julian?"), [E("左 · 铃声", "Left · a bell"), E("前 · 平稳的口令声", "Ahead · a steady voice"), E("后 · 脚步声", "Behind · footsteps"), E("右 · 风声", "Right · wind")], 1),
    MK("m113_c05_g2", "面具后的名字", "The Name Behind the Mask", "人群里有人戴着和邀请函同样的印记。Kai低声问：“你要靠什么认人？”圈出可靠的依据。", "Someone wears the invitation's mark. Kai whispers, “How will you know them?” Mark the reliable signs.", E("靠什么认人？", "What do you rely on?"), [E("旧封印", "The old seal"), E("约定的手势", "The agreed hand signal"), E("只听声音", "Voice alone"), E("衣袖上的纽扣", "Sleeve buttons")], [0, 1]),
    MK("m113_c06_g2", "谁说了真话", "Who Told the Truth?", "两份口供互相矛盾。圈出不会冤枉人的核对方法。", "Two statements contradict. Mark the checks that won't wrong anyone.", E("怎么核对？", "How do you check?"), [E("调取门禁时间", "Pull the gate times"), E("和两份口供逐条对照", "Compare line by line with both statements"), E("相信先开口的那个", "Believe whoever spoke first"), E("相信你更喜欢的那个", "Believe the one you like more")], [0, 1]),
    CL("m113_c11_g1", "公开还是保留", "Public or Private", "听证会前，把资料分成公开和保留。", "Before the hearing, sort the material into public and private.", [E("公开", "Public"), E("保留", "Private")], [[E("授权过、脱敏后的日志", "Authorized, anonymized logs"), 0], [E("会员私人记录", "Members' private records"), 1], [E("未核实的指控", "Unverified accusations"), 1]]),

    /* ---------- M114 ---------- */
    CL("m114_c02_g2", "生日来源", "Where Did the Birthday Come From?", "任务表上有四条关于你的信息。哪条有合法来源，哪条来路不明？", "Four facts about you on the task sheet. Which have a legitimate source, which don't?", [E("有合法来源", "Legit source"), E("来路不明", "Unknown source")], [[E("房门号 · 来自租约摘要", "Room number · from the lease"), 0], [E("入住日期 · 来自申请邮件", "Move-in date · from your application"), 0], [E("你的名字 · 来自门禁登记", "Your name · from gate registration"), 0], [E("你的生日 · 你从没告诉过任何人", "Your birthday · you never told anyone"), 1]]),
    OR("m114_c07_g2", "录像全帧", "Full-Frame Footage", "画面里的那个人，按稳妥的步骤判断。", "Judge the person in the frame—step by step.", [E("看前后的连续帧", "Check the frames before and after"), E("调出完整录像", "Pull the full recording"), E("再判断那个人是谁", "Then judge who it is")]),
    CL("m114_c08_g1", "法律援助索引", "Legal Aid Index", "搬离通知到底算不算数？把信息来源分成可靠和不可靠。", "Is the eviction notice valid? Sort the sources into reliable and unreliable.", [E("可靠", "Reliable"), E("不可靠", "Unreliable")], [[E("社区法律援助机构的公开信息", "Community legal aid's public info"), 0], [E("匿名邮件里的链接", "A link in an anonymous email"), 1], [E("论坛上陌生网友的说法", "A stranger on a forum"), 1]]),
    CL("m114_c08_g2", "演出排班", "Show Schedule", "Mason要训练，Jace要彩排。排一天，谁都不用缺席工作。", "Mason has practice, Jace has rehearsal. Plan a day where nobody misses work.", [E("白天", "Daytime"), E("晚上", "Evening")], [[E("Mason按时训练", "Mason goes to practice"), 0], [E("Jace按时彩排", "Jace goes to rehearsal"), 0], [E("三个人一起吃饭", "Dinner together"), 1]]),
    MK("m114_c12_g2", "黎明约定", "A Promise at Dawn", "无论选择哪种关系，开始之前需要什么？圈出来。", "Whatever relationship you choose, what has to come first? Mark it.", E("开始之前需要什么？", "What comes first?"), [E("谁对你最好就默认是他", "Default to whoever's nicest"), E("每个人都亲口说愿意", "Everyone says yes in their own words"), E("大家投票决定", "Put it to a vote"), E("之后任何人都可以改变主意", "Anyone can change their mind later")], [1, 3]),

    /* ---------- M115 ---------- */
    OR("m115_c01_g1", "镜头前的第一步", "First Move on Camera", "直播镜头对着你们。下结论之前，按可靠的顺序做。", "The live camera is on you. Before any conclusion, go in a reliable order.", [E("核验Rowan手里资料的来源", "Verify the source of Rowan's files"), E("听Eli的解释", "Hear Eli out"), E("再下结论", "Then conclude")]),
    CL("m115_c01_g2", "少了什么", "What's Missing?", "旧平面图和Caleb记忆中的后台对不上。哪些图上有，哪些图上没有？", "The old floor plan doesn't match Caleb's memory. What's on the plan, what's missing?", [E("图上有", "On the plan"), E("图上没有", "Missing")], [[E("货运电梯", "Freight elevator"), 0], [E("化妆间", "Dressing room"), 0], [E("后台的一条安全通道", "A backstage safety corridor"), 1]]),
    MK("m115_c02_g2", "凌晨三点的登录", "The 3 a.m. Login", "通知是凌晨三点从剧院网络发出的。圈出能成立的判断。", "The notice went out at 3 a.m. from the theater's network. Mark what holds.", E("这说明了什么？", "What does it show?"), [E("用的是剧院的线路", "It used the theater's line"), E("具体是谁还要查", "Who did it still needs checking"), E("一定是剧院员工干的", "It must be a staff member"), E("通知肯定是假的", "The notice must be fake")], [0, 1]),
    OR("m115_c05_g1", "九十秒", "Ninety Seconds", "数据库里有九十秒是空的。按顺序排出接下来的动作。", "Ninety seconds are blank in the database. Order the next steps.", [E("标记空档之前的操作", "Flag operations before the gap"), E("标记空档之后的操作", "Flag operations after the gap"), E("对比前后找出改动", "Compare to find the change")]),
    OR("m115_c06_g2", "晚了一天", "One Day Late", "撤销代理投票的日期比Eli说的晚了一天。按顺序排出该查的。", "The proxy revocation is a day later than Eli said. Order what to check.", [E("查系统有没有延迟提交记录", "Check for delayed-submission records"), E("对照Eli说的日期", "Compare with Eli's date"), E("再判断他有没有说谎", "Then judge whether he lied")]),
    MK("m115_c07_g1", "照片的破绽", "Flaws in the Photos", "这些照片是不是被拼接过？圈出所有该比对的地方。", "Were these photos spliced? Mark everything worth comparing.", E("该比对什么？", "What should you compare?"), [E("光线方向", "Light direction"), E("背景细节", "Background details"), E("拍摄日期", "Date taken"), E("人物的表情", "Facial expressions"), E("是谁发出来的", "Who posted them")], [0, 1, 2]),
    MK("m115_c08_g1", "钱从哪来", "Where the Money Came From", "扩张资金来自投资方的关联基金。圈出能成立的判断。", "The expansion money came from the investor's affiliated fund. Mark what holds.", E("这说明了什么？", "What does it show?"), [E("钱的来源有问题", "The money's source is a problem"), E("Miles是否知情要看合同往来", "Whether Miles knew depends on the contracts"), E("Miles一定事先知情", "Miles must have known"), E("没什么问题", "Nothing's wrong")], [0, 1]),
    MK("m115_c09_g1", "交给谁", "Who Gets It?", "这箱草案可能关系到剧院能不能保住。圈出该收下它的人。", "This box of drafts may decide whether the theater survives. Mark who should get it.", E("交给谁？", "Who gets it?"), [E("当废纸扔掉", "Throw it out"), E("剧院的法律顾问Nora", "Nora, the theater's counsel"), E("直接发到网上", "Post it online"), E("自己先藏起来", "Hide it yourself")], [1]),
    OR("m115_c10_g1", "回应指控", "Answering the Accusation", "Griffin当众指控Asher删了监控。按顺序排出最好的回应。", "Griffin publicly accuses Asher of deleting the footage. Order the best response.", [E("先稳住现场，不争吵", "Calm the room, don't argue"), E("调取外部备份", "Pull the external backup"), E("用备份回应指控", "Answer with the backup")]),
    CL("m115_c11_g1", "录音能证明什么", "What the Tape Proves", "这段录音里，哪些能确定，哪些还不能？", "From this tape, what's certain and what isn't yet?", [E("能确定", "Certain"), E("还不能确定", "Not yet")], [[E("有人下令绕过流程修改图纸", "Someone ordered the plans changed off-process"), 0], [E("说话的人是谁", "Who is speaking"), 1], [E("Griffin就是主谋", "Griffin is the mastermind"), 1]]),
    CL("m115_c14_g2", "最可靠的证据", "The Most Reliable Evidence", "把证据分成可以直接用的和需要佐证的。", "Sort evidence into usable as-is and needs corroboration.", [E("可以直接用", "Usable as-is"), E("需要佐证", "Needs corroboration")], [[E("有原始记录支撑的日志", "A log backed by raw records"), 0], [E("某个人的回忆", "Someone's memory"), 1], [E("网上的传言", "An online rumor"), 1]]),
    MK("m115_c15_g1", "初步结论", "Preliminary Findings", "审计宣读了“初步结论”。圈出它真正意味着的事。", "The audit read out “preliminary findings.” Mark what that actually means.", E("这意味着什么？", "What does it mean?"), [E("图纸确实被篡改过", "The plans were tampered with"), E("投票要重审", "The vote will be reviewed"), E("这还不是终点", "It's not the end yet"), E("案子已经结束", "The case is over"), E("所有人都有罪", "Everyone is guilty")], [0, 1, 2]),
  ];
  window.MG168.reg(LIST.map(g => Object.assign({ seconds: 40, img: IMG(g.id) }, g, { a: "", b: "" })));
  window.MG184 = LIST.length;
})();

/* ===== mod185: 10 种新的动手玩法 + 进素材库（2026-11-24）=====
   每种都可以在剧本里用 ⟦MG|游戏id⟧ 指定；后台小游戏编辑框直接写 tpl 名；素材库里各有一个通用示例，剧情里出现触发词会自动出现。
     m111_route    路线：按顺序点航点，避开危险点      points:[[名,x%,y%]…]（正确顺序） hazards:[[名,x%,y%]…]  img
     m111_collect  收集：拖着工具把散落的东西收回来，别用手直接碰   n: 数量  item:"📍"  tool:"🧲"  [ask:[中,英] 收完再答数量 count]
     m111_diff     找不同：两张图对照，点出被改掉的那一块   img  cols rows  ans: 格子序号  cover:[中,英]（被改处的说明）
     m111_wave     声轨：两条波形对照，点出被剪掉的那一段   segs: 段数  ans: 段序号  labels:[[中,英]…]
     m111_space    摆放：在房间格子里放一个东西，避开禁区   cols rows  cells:{序号:[类型,中,英]}  ok:[序号…]  item:"💡"
     m111_plan     排日程：把卡片放进时段，满足每张卡的限制   slots:[[中,英]…]  chips:[[[中,英],[允许的时段…]]…]  remove:[[[中,英],该删?]…]
     m111_rotate   复原角度：转回正确角度，再把画幅拉回完整   img  start: 起始角度  tol
     m111_doc      文件核验：两份文件逐行对照，点出对不上的行   cols:[[左表头],[右表头]]  rows:[[[项],[左值],[右值]]…]  ans:[行序号…]
     m111_device   实体开关：在一台设备上找到真正起作用的那个控制   controls:[[[中,英],真/假,[提示中,英]]…]  lamp:[[亮着中,英],[熄灭中,英]]
     m111_deal     协商卡：每一组各选一张，组合成你的约定（没有标准答案）   groups:[[[组名],[[选项]…]]…]  */
(function () {
  "use strict";
  if (typeof MG_T === "undefined") return;
  const el = (t, c, x) => { const e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; };
  const t2 = (zh, a, b) => (zh ? a : b);
  const L = (x, zh) => (Array.isArray(x) ? x[zh ? 0 : 1] : x);
  const sh = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const css = el("style"); css.textContent =
    ".m185box{position:relative;width:100%;max-width:100%;border-radius:12px;overflow:hidden;background:#15112a;border:1px solid #4b3d73;touch-action:none;user-select:none}" +
    ".m185box img{width:100%;height:100%;object-fit:cover;display:block;pointer-events:none}" +
    ".m185pin{position:absolute;transform:translate(-50%,-50%);font-size:12px;padding:6px 9px;border-radius:999px;white-space:nowrap;background:#2a2147;color:#f3edff;border:1px solid #6b5a9c}" +
    ".m185pin.on{background:#ff5fa2;border-color:#ff5fa2}.m185pin.bad{background:#5a2333;border-color:#c24a6a}" +
    ".m185grid{position:absolute;inset:0;display:grid}.m185grid>button{background:transparent;border:1px dashed rgba(255,255,255,.18);color:#fff;font-size:11px;padding:2px}" +
    ".m185grid>button.on{background:rgba(255,95,162,.35);border-color:#ff5fa2}.m185grid>button.no{background:rgba(194,74,106,.35)}" +
    ".m185row{display:grid;grid-template-columns:1.1fr 1fr 1fr;gap:6px;align-items:center;font-size:13px;padding:8px;border-radius:10px;background:#1d1736;border:1px solid #3a3058;text-align:left;color:#eee}" +
    ".m185row.on{border-color:#ff5fa2;background:#3a1d38}.m185row b{font-weight:600;color:#cbbdf0}" +
    ".m185slot{min-height:44px;border:1px dashed #6b5a9c;border-radius:10px;padding:6px 8px;display:flex;flex-direction:column;gap:4px;background:#17122c;color:#cbbdf0;font-size:12px;text-align:left}" +
    ".m185slot.on{border-color:#ff5fa2}.m185chip{display:inline-block;padding:6px 10px;border-radius:999px;background:#2a2147;border:1px solid #6b5a9c;color:#fff;font-size:13px}.m185chip.sel{background:#ff5fa2;border-color:#ff5fa2}" +
    ".m185dev{border-radius:16px;background:linear-gradient(#27203f,#1a1530);border:1px solid #4b3d73;padding:14px;display:flex;flex-direction:column;gap:10px;align-items:center}" +
    ".m185lamp{width:22px;height:22px;border-radius:50%;background:#ff4d4d;box-shadow:0 0 16px #ff4d4d}.m185lamp.off{background:#3a3048;box-shadow:none}";
  document.head.appendChild(css);
  function shell(A, G, sub, done, T, zh, instr, noImg) {
    A.className = "mgarea m168"; A.innerHTML = "";
    sub.textContent = instr;
    if (G.img && !noImg) { const im = el("img"); im.src = G.img; im.alt = ""; im.style.cssText = "width:100%;max-height:150px;object-fit:cover;border-radius:12px;display:block"; A.append(im); }
    A.append(el("p", "pr", zh ? G.pz : G.pe));
    const tb = el("div", "tb"), bar = el("i"); tb.append(bar); A.append(tb);
    const secs = G.seconds || 45; let over = false, tries = 0;
    requestAnimationFrame(() => { bar.style.transitionDuration = secs + "s"; bar.style.width = "0%"; });
    T.push(setTimeout(() => { if (!over) { over = true; done("lose"); } }, secs * 1000));
    const body = el("div", "m168b"); body.style.cssText = "display:flex;flex-direction:column;gap:8px"; A.append(body);
    const hint = el("p", "hint");
    const say = s => { hint.textContent = s; };
    const submit = ok => { if (over) return true; if (ok) { over = true; done("win"); return true; } if (tries++ < 1) { say(t2(zh, "还差一点，再来一次。", "Not quite. One more try.")); return false; } over = true; done("lose"); return true; };
    return { body, hint, say, submit, isOver: () => over };
  }
  const box = (ratio, img) => { const b = el("div", "m185box"); b.style.aspectRatio = ratio || "4/3"; if (img) { const im = el("img"); im.src = img; im.alt = ""; b.append(im); } return b; };

  /* 路线 */
  MG_T.m111_route = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "按顺序点航点，别碰危险点。", "Tap the waypoints in order. Avoid the hazards."), true);
    const b = box("4/3", G.img), pts = G.points || [], hz = G.hazards || []; let k = 0;
    if (!G.img) b.style.background = "radial-gradient(circle at 30% 20%, #2b6f93 0, #164866 45%, #0b2740 100%)";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); svg.setAttribute("viewBox", "0 0 100 100"); svg.setAttribute("preserveAspectRatio", "none"); svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
    const line = document.createElementNS("http://www.w3.org/2000/svg", "polyline"); line.setAttribute("fill", "none"); line.setAttribute("stroke", "#ff5fa2"); line.setAttribute("stroke-width", "1.2"); line.setAttribute("stroke-dasharray", "2 1.5"); svg.append(line); b.append(svg);
    const path = []; const draw = () => line.setAttribute("points", path.map(p => p.join(",")).join(" "));
    const reset = () => { k = 0; path.length = 0; draw(); wp.forEach((m, j) => { m.classList.remove("on"); m.textContent = L(pts[j][0], zh); }); };
    const wp = pts.map((p, i) => { const m = el("button", "m185pin", L(p[0], zh)); m.style.left = p[1] + "%"; m.style.top = p[2] + "%";
      m.onclick = () => { if (c.isOver()) return; if (i === k) { m.classList.add("on"); m.textContent = (k + 1) + " · " + L(p[0], zh); path.push([p[1], p[2]]); draw(); k++; if (k === pts.length) c.submit(true); } else if (!c.submit(false)) reset(); };
      b.append(m); return m; });
    hz.forEach(p => { const m = el("button", "m185pin bad", "⚠ " + L(p[0], zh)); m.style.left = p[1] + "%"; m.style.top = p[2] + "%"; m.onclick = () => { if (c.isOver()) return; c.say(t2(zh, "那里不能走。", "Not that way.")); if (!c.submit(false)) reset(); }; b.append(m); });
    c.body.append(b, c.hint);
  };

  /* 收集 */
  MG_T.m111_collect = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "拖着工具扫过去收回它们，别用手直接点。", "Drag the tool over them. Don't grab them by hand."), true);
    const n = G.n || 7, b = box("4/3", G.img); b.style.background = b.style.background || "#2a2238";
    const items = [], tool = el("div"); tool.textContent = G.tool || "🧲"; tool.style.cssText = "position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);font-size:34px;filter:drop-shadow(0 0 8px #ffd27a);pointer-events:none";
    let got = 0;
    for (let i = 0; i < n; i++) { const it = el("span", "", G.item || "📍"); const x = 10 + Math.random() * 80, y = 12 + Math.random() * 76; it.style.cssText = "position:absolute;font-size:22px;transform:translate(-50%,-50%) rotate(" + Math.floor(Math.random() * 360) + "deg);left:" + x + "%;top:" + y + "%"; it.dataset.x = x; it.dataset.y = y; items.push(it); b.append(it); }
    b.append(tool);
    const counter = el("p", "hint", t2(zh, "已收回 0 / " + n, "Collected 0 / " + n));
    let dragging = false;
    const move = e => { const r = b.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 100, y = (e.clientY - r.top) / r.height * 100; tool.style.left = x + "%"; tool.style.top = y + "%";
      if (!dragging) return; items.forEach(it => { if (it.dataset.got) return; const dx = (it.dataset.x - x) * r.width / 100, dy = (it.dataset.y - y) * r.height / 100; if (dx * dx + dy * dy < 900) { it.dataset.got = 1; it.style.transition = "all .25s"; it.style.opacity = "0"; got++; counter.textContent = t2(zh, "已收回 " + got + " / " + n, "Collected " + got + " / " + n); if (got === n) c.submit(true); } }); };
    b.addEventListener("pointerdown", e => { const r = b.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * 100, y = (e.clientY - r.top) / r.height * 100, tx = parseFloat(tool.style.left), ty = parseFloat(tool.style.top);
      if (Math.abs(x - tx) < 12 && Math.abs(y - ty) < 14) { dragging = true; try { b.setPointerCapture(e.pointerId); } catch (_) {} return; }
      const hit = items.find(it => !it.dataset.got && Math.abs(it.dataset.x - x) < 5 && Math.abs(it.dataset.y - y) < 6);
      if (hit) { c.say(t2(zh, "别用手抓——用工具。", "Don't grab it by hand—use the tool.")); c.submit(false); } });
    b.addEventListener("pointermove", move);
    ["pointerup", "pointercancel"].forEach(x => b.addEventListener(x, () => { dragging = false; }));
    c.body.append(b, counter, c.hint);
  };

  /* 找不同 */
  MG_T.m111_diff = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "对照下面两张图，在原图上点出被改掉的那一块。", "Compare the two images and tap the changed area on the original."), true);
    const cols = G.cols || 3, rows = G.rows || 3, ans = G.ans || 0;
    const wrap = el("div"); wrap.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:8px";
    const mk = (cap, cover) => { const f = el("div"); const b = box("3/4", G.img); const ca = el("p", "hint", cap); ca.style.margin = "4px 0 0";
      if (cover) { const r = Math.floor(ans / cols), q = ans % cols, m = el("div"); m.style.cssText = "position:absolute;left:" + (q / cols * 100) + "%;top:" + (r / rows * 100) + "%;width:" + (100 / cols) + "%;height:" + (100 / rows) + "%;background:" + (G.fill || "#1a1530"); b.append(m); }
      f.append(b, ca); return { f, b }; };
    const o = mk(t2(zh, "原图", "Original")), p = mk(t2(zh, "印出来的版本", "Printed version"), true);
    const grid = el("div", "m185grid"); grid.style.gridTemplateColumns = "repeat(" + cols + ",1fr)"; grid.style.gridTemplateRows = "repeat(" + rows + ",1fr)";
    for (let i = 0; i < cols * rows; i++) { const g = el("button"); g.onclick = () => { if (c.isOver()) return; if (i === ans) { g.classList.add("on"); if (G.cover) c.say(L(G.cover, zh)); c.submit(true); } else { g.classList.add("no"); c.submit(false); } }; grid.append(g); }
    o.b.append(grid); wrap.append(o.f, p.f); c.body.append(wrap, c.hint);
  };

  /* 声轨 */
  MG_T.m111_wave = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "上面是原始声轨，下面是播出版。点出原始声轨里被剪掉的那一段。", "Top is the raw track, bottom is the aired cut. Tap the part of the raw track that was cut."), true);
    const segs = G.segs || 6, ans = G.ans || 0, N = 120, per = N / segs;
    const amp = Array.from({ length: N }, (_, i) => { const s = Math.floor(i / per); if (s === ans) return 0.06 + Math.random() * 0.05; return 0.25 + Math.random() * 0.7; });
    const draw = (cv, cut) => { const w = cv.width = cv.clientWidth * 2 || 600, h = cv.height = 120, x = cv.getContext("2d"); x.clearRect(0, 0, w, h); const bw = w / N;
      let col = 0; for (let i = 0; i < N; i++) { const s = Math.floor(i / per); if (cut && s === ans) continue; const a = amp[i] * h * 0.45; x.fillStyle = cut ? "#9c8cc9" : "#ff8fc0"; x.fillRect(col * bw + 1, h / 2 - a, bw - 2, a * 2); col++; } };
    const top = el("canvas"), bot = el("canvas"); [top, bot].forEach(cv => { cv.style.cssText = "width:100%;height:60px;display:block;background:#15112a;border-radius:10px"; });
    const wrapT = el("div"); wrapT.style.position = "relative"; wrapT.append(top);
    const grid = el("div", "m185grid"); grid.style.gridTemplateColumns = "repeat(" + segs + ",1fr)";
    for (let i = 0; i < segs; i++) { const g = el("button", "", L((G.labels || [])[i], zh) || ""); g.onclick = () => { if (c.isOver()) return; if (i === ans) { g.classList.add("on"); c.submit(true); } else { g.classList.add("no"); c.submit(false); } }; grid.append(g); }
    wrapT.append(grid);
    c.body.append(el("p", "hint", t2(zh, "原始声轨", "Raw track")), wrapT, el("p", "hint", t2(zh, "播出版", "Aired cut")), bot, c.hint);
    requestAnimationFrame(() => { draw(top, false); draw(bot, true); });
  };

  /* 摆放 */
  MG_T.m111_space = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "点一个格子，把它放下去。", "Tap a cell to place it."), true);
    const cols = G.cols || 5, rows = G.rows || 4, cells = G.cells || {}, ok = G.ok || [];
    const b = box(cols + "/" + rows, G.img); const grid = el("div", "m185grid"); grid.style.gridTemplateColumns = "repeat(" + cols + ",1fr)"; grid.style.gridTemplateRows = "repeat(" + rows + ",1fr)";
    const ico = { wet: "💧", exit: "🚪", wall: "▦", sofa: "🛋", table: "▭", door: "🚪", hot: "🔥", cam: "🎥", you: "🙂", him: "🧍" };
    for (let i = 0; i < cols * rows; i++) { const d = cells[i]; const g = el("button"); if (d) { g.textContent = (ico[d[0]] || "") + " " + L([d[1], d[2]], zh); g.style.background = d[0] === "wet" ? "rgba(80,150,255,.28)" : d[0] === "exit" || d[0] === "door" ? "rgba(127,196,166,.25)" : "rgba(255,255,255,.07)"; }
      g.onclick = () => { if (c.isOver()) return; grid.querySelectorAll(".on").forEach(x => { x.classList.remove("on"); x.textContent = x.dataset.t || ""; }); g.dataset.t = g.textContent; g.classList.add("on"); g.textContent = (G.item || "💡") + " " + g.dataset.t;
        if (ok.includes(i)) c.submit(true); else { const why = d && d[3] ? L(d[3], zh) : t2(zh, "这里不合适。", "Not a good spot."); c.say(why); c.submit(false); } };
      grid.append(g); }
    b.append(grid); c.body.append(b, c.hint);
  };

  /* 排日程 */
  MG_T.m111_plan = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "先点一张卡，再点它该去的时段。", "Tap a card, then tap the slot it goes in."));
    const slots = G.slots || [], chips = (G.chips || []).map((x, i) => ({ i, label: x[0], ok: x[1] })), rm = (G.remove || []).map((x, i) => ({ i, label: x[0], del: !!x[1], gone: false }));
    const at = {}; let sel = null;
    const draw = () => {
      c.body.innerHTML = "";
      if (rm.length) { const rw = el("div"); rw.style.cssText = "display:flex;flex-wrap:wrap;gap:6px"; rw.append(el("span", "hint", t2(zh, "预设标签（点掉不该有的）：", "Preset tags (tap off the wrong ones):")));
        rm.forEach(r => { const b = el("button", "m185chip", (r.gone ? "✕ " : "") + L(r.label, zh)); if (r.gone) b.style.opacity = ".4"; b.onclick = () => { r.gone = !r.gone; draw(); }; rw.append(b); }); c.body.append(rw); }
      const pool = el("div"); pool.style.cssText = "display:flex;flex-wrap:wrap;gap:6px";
      chips.filter(ch => at[ch.i] == null).forEach(ch => { const b = el("button", "m185chip" + (sel === ch.i ? " sel" : ""), L(ch.label, zh)); b.onclick = () => { sel = sel === ch.i ? null : ch.i; draw(); }; pool.append(b); });
      c.body.append(pool);
      const g = el("div"); g.style.cssText = "display:grid;grid-template-columns:1fr 1fr;gap:6px";
      slots.forEach((s, si) => { const d = el("button", "m185slot" + (sel != null ? " on" : "")); d.append(el("b", "", L(s, zh)));
        chips.filter(ch => at[ch.i] === si).forEach(ch => { const x = el("span", "m185chip", L(ch.label, zh) + " ✕"); x.onclick = e => { e.stopPropagation(); delete at[ch.i]; draw(); }; d.append(x); });
        d.onclick = () => { if (sel == null) return; at[sel] = si; sel = null; draw(); }; g.append(d); });
      c.body.append(g);
      const go = el("button", "go", t2(zh, "确认安排", "Confirm plan")); go.disabled = chips.some(ch => at[ch.i] == null);
      go.onclick = () => { const ok = chips.every(ch => ch.ok.includes(at[ch.i])) && rm.every(r => r.gone === r.del) && (!G.oneEach || new Set(Object.values(at)).size === chips.length);
        if (!c.submit(ok)) { Object.keys(at).forEach(k => delete at[k]); rm.forEach(r => { r.gone = false; }); draw(); } };
      c.body.append(go, c.hint);
    };
    draw();
  };

  /* 复原角度 */
  MG_T.m111_rotate = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "把画面转正，再把画幅拉回完整，然后核对。", "Straighten the frame, pull back to the full shot, then check."), true);
    const tol = G.tol || 4; let ang = G.start || (Math.random() < 0.5 ? -1 : 1) * (18 + Math.floor(Math.random() * 14)), zoom = 1.8;
    const b = box("4/3"); const im = el("img"); im.src = G.img || ""; im.alt = ""; im.style.transition = "transform .08s"; b.append(im);
    const frame = el("div"); frame.style.cssText = "position:absolute;inset:6%;border:2px solid rgba(255,255,255,.55);border-radius:6px;pointer-events:none"; b.append(frame);
    const paint = () => { im.style.transform = "rotate(" + ang + "deg) scale(" + zoom + ")"; };
    const r1 = el("input"); r1.type = "range"; r1.min = -45; r1.max = 45; r1.value = ang; r1.setAttribute("aria-label", t2(zh, "角度", "Angle"));
    const r2 = el("input"); r2.type = "range"; r2.min = 100; r2.max = 200; r2.value = zoom * 100; r2.setAttribute("aria-label", t2(zh, "画幅", "Framing"));
    [r1, r2].forEach(r => { r.style.width = "100%"; });
    r1.oninput = () => { ang = Number(r1.value); paint(); }; r2.oninput = () => { zoom = Number(r2.value) / 100; paint(); };
    const go = el("button", "go", t2(zh, "核对机位", "Check the angle")); go.onclick = () => c.submit(Math.abs(ang) <= tol && zoom <= 1.08);
    paint();
    c.body.append(b, el("p", "hint", t2(zh, "角度", "Angle")), r1, el("p", "hint", t2(zh, "画幅（越小越完整）", "Framing (smaller = fuller)")), r2, go, c.hint);
  };

  /* 文件核验 */
  MG_T.m111_doc = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "逐行对照两份文件，点出对不上的行，再核对。", "Compare the two documents row by row. Tap the rows that don't match, then check."));
    const rows = G.rows || [], want = (G.ans || []).slice().sort().join(","), on = new Set();
    const head = el("div", "m185row"); head.style.background = "transparent"; head.style.border = "none"; head.append(el("b", "", ""), el("b", "", L((G.cols || [])[0], zh) || ""), el("b", "", L((G.cols || [])[1], zh) || ""));
    const list = el("div"); list.style.cssText = "display:flex;flex-direction:column;gap:6px";
    const draw = () => { list.innerHTML = ""; rows.forEach((r, i) => { const b = el("button", "m185row" + (on.has(i) ? " on" : "")); b.append(el("b", "", (on.has(i) ? "✓ " : "") + L(r[0], zh)), el("span", "", L(r[1], zh)), el("span", "", L(r[2], zh))); b.onclick = () => { on.has(i) ? on.delete(i) : on.add(i); draw(); }; list.append(b); }); };
    const go = el("button", "go", t2(zh, "核对", "Check")); go.onclick = () => { if (!c.submit([...on].sort().join(",") === want)) { on.clear(); draw(); } };
    draw(); c.body.append(head, list, go, c.hint);
  };

  /* 实体开关 */
  MG_T.m111_device = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "找到真正起作用的控制，确认指示灯，再提交。", "Find the control that really works, check the lamp, then confirm."));
    const lampTxt = G.lamp || [["指示灯亮着", "Lamp on"], ["指示灯熄灭", "Lamp off"]]; let lit = true;
    const dev = el("div", "m185dev"), lamp = el("div", "m185lamp"), lt = el("p", "hint", L(lampTxt[0], zh));
    const ctr = el("div"); ctr.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;justify-content:center";
    sh((G.controls || []).map((x, i) => ({ i, x }))).forEach(({ x }) => { const b = el("button", "k", L(x[0], zh)); b.onclick = () => { if (c.isOver()) return; if (x[1]) { lit = !lit; b.classList.toggle("on", !lit); } c.say(x[2] ? L(x[2], zh) : ""); lamp.classList.toggle("off", !lit); lt.textContent = L(lampTxt[lit ? 0 : 1], zh); }; ctr.append(b); });
    dev.append(lamp, lt, ctr);
    const go = el("button", "go", t2(zh, "确认已经静音", "Confirm muted")); if (G.confirm) go.textContent = L(G.confirm, zh);
    go.onclick = () => c.submit(!lit);
    c.body.append(dev, go, c.hint);
  };

  /* 协商卡 */
  MG_T.m111_deal = function (A, G, sub, done, T, zh) {
    const c = shell(A, G, sub, done, T, zh, t2(zh, "每一组选一张，没有标准答案。", "Pick one card in each group. No wrong answers."));
    const groups = G.groups || [], pick = {};
    const draw = () => { c.body.innerHTML = "";
      groups.forEach((g, gi) => { c.body.append(el("p", "hint", L(g[0], zh))); const r = el("div"); r.style.cssText = "display:flex;flex-wrap:wrap;gap:6px";
        g[1].forEach((o, oi) => { const b = el("button", "m185chip" + (pick[gi] === oi ? " sel" : ""), L(o, zh)); b.onclick = () => { pick[gi] = oi; draw(); }; r.append(b); }); c.body.append(r); });
      const go = el("button", "go", t2(zh, "写进约定", "Put it in writing")); go.disabled = groups.some((_, gi) => pick[gi] == null);
      go.onclick = () => { const s = groups.map((g, gi) => L(g[1][pick[gi]], zh)).join(" · "); c.say(s); c.submit(true); };
      c.body.append(go, c.hint); };
    draw();
  };

  window.MG185 = ["m111_route", "m111_collect", "m111_diff", "m111_wave", "m111_space", "m111_plan", "m111_rotate", "m111_doc", "m111_device", "m111_deal"];

  /* ---------- 素材库：每种玩法一个通用示例（有触发词，作者也能直接 ⟦MG|id⟧ 指定） ---------- */
  const E = (zh, en) => [zh, en];
  const LIB = [
    { id: "lib_route", zh: "🧭 绕开暗礁", en: "🧭 Around the Reef", tpl: "m111_route", kw: ["航线", "暗礁", "划船", "路线", "route", "reef"], pz: "天快黑了。按顺序点航点回到码头，别碰暗礁。", pe: "It's getting dark. Tap the waypoints back to the dock, avoiding the reef.", points: [[E("出发", "Start"), 15, 80], [E("浮标", "Buoy"), 40, 50], [E("灯塔", "Lighthouse"), 70, 30], [E("码头", "Dock"), 85, 70]], hazards: [[E("暗礁", "Reef"), 55, 70], [E("漩涡", "Whirlpool"), 30, 25]] },
    { id: "lib_collect", zh: "🧲 收回散落的针", en: "🧲 Pick Up the Pins", tpl: "m111_collect", kw: ["别针", "散落", "收拾", "针", "pins", "scattered"], pz: "一盒针撒了一地。用磁铁把它们全收回来。", pe: "A box of pins spilled. Gather them all with the magnet.", n: 7, item: "📍", tool: "🧲" },
    { id: "lib_diff", zh: "🔍 被裁掉的角落", en: "🔍 The Cropped Corner", tpl: "m111_diff", kw: ["裁掉", "修图", "原图", "对比", "cropped", "edited"], pz: "印出来的照片少了一块。在原图上点出来。", pe: "Something's missing from the print. Find it on the original.", img: "art/official/m121-off-camera/images/BG_C04_S03.webp", cols: 3, rows: 3, ans: 3 },
    { id: "lib_wave", zh: "🎙 被剪掉的那几秒", en: "🎙 The Missing Seconds", tpl: "m111_wave", kw: ["录音", "剪辑", "声音", "停顿", "audio", "cut"], pz: "播出版少了几秒。在原始声轨里点出来。", pe: "The aired cut is missing a few seconds. Find them in the raw track.", segs: 6, ans: 4 },
    { id: "lib_space", zh: "💡 放一盏灯", en: "💡 Place the Lamp", tpl: "m111_space", kw: ["停电", "应急灯", "摆放", "blackout", "lamp"], pz: "停电了。把应急灯放在干燥、够得着、又不挡门的地方。", pe: "Power's out. Put the lamp somewhere dry, reachable, and clear of the door.", cols: 4, rows: 3, item: "💡", cells: { 0: ["wet", "积水", "Puddle", E("地上有水。", "The floor is wet.")], 3: ["exit", "出口", "Exit", E("会挡住出口。", "It blocks the exit.")], 5: ["table", "茶几", "Coffee table"], 9: ["wet", "积水", "Puddle", E("地上有水。", "The floor is wet.")] }, ok: [5, 6] },
    { id: "lib_plan", zh: "🗓 排一周", en: "🗓 Plan the Week", tpl: "m111_plan", kw: ["日程", "安排", "排班", "schedule", "plan"], pz: "把三件事排进三天，每天一件。", pe: "Fit three things into three days, one per day.", slots: [E("周一", "Mon"), E("周二", "Tue"), E("周三", "Wed")], chips: [[E("训练", "Training"), [0]], [E("理疗", "Physio"), [1]], [E("休息", "Rest"), [2]]], oneEach: true },
    { id: "lib_rotate", zh: "📐 把画面转正", en: "📐 Straighten the Shot", tpl: "m111_rotate", kw: ["机位", "角度", "歪了", "angle", "tilted"], pz: "这张截帧被转歪又放大了。把它复原。", pe: "This frame was tilted and zoomed. Restore it.", img: "art/official/m121-off-camera/images/BG_C08_S02.webp" },
    { id: "lib_doc", zh: "📄 两份表对一对", en: "📄 Cross-Check Two Forms", tpl: "m111_doc", kw: ["合同", "核对", "条款", "文件", "contract", "check"], pz: "两份表格逐行对照，点出对不上的。", pe: "Compare the two forms row by row and tap the mismatches.", cols: [E("备案", "Filed"), E("声明", "Declared")], rows: [[E("姓名", "Name"), E("林雾", "Lin Wu"), E("林雾", "Lin Wu")], [E("持股", "Stake"), E("12%", "12%"), E("0%", "0%")], [E("职务", "Role"), E("顾问", "Advisor"), E("顾问", "Advisor")]], ans: [1] },
    { id: "lib_device", zh: "🎧 真的静音了吗", en: "🎧 Is It Really Muted?", tpl: "m111_device", kw: ["静音", "麦克风", "耳返", "mute", "mic"], pz: "屏幕上说已经静音了。找到真正切断收音的开关。", pe: "The screen says muted. Find the switch that actually cuts the mic.", controls: [[E("屏幕上的静音键", "On-screen mute"), false, E("屏幕显示静音，但灯还亮着。", "The screen says muted, but the lamp's still on.")], [E("侧面的实体开关", "Side hardware switch"), true, E("咔哒一声。", "Click.")], [E("音量调到最小", "Volume to minimum"), false, E("只是你听不见了，收音还在。", "You just can't hear it—it's still recording.")]] },
    { id: "lib_deal", zh: "🤝 写一份约定", en: "🤝 Write the Terms", tpl: "m111_deal", kw: ["约定", "协议", "边界", "agreement", "terms"], pz: "两个人把以后的约定写下来。每组选一张。", pe: "Write down how this goes from here. One card per group.", groups: [[E("多久联系一次", "How often to talk"), [E("每天", "Daily"), E("想到就说", "Whenever"), E("每周见一面", "Weekly")]], [E("要不要排他", "Exclusive?"), [E("排他", "Yes"), E("先不排他", "Not yet")]], [E("随时可以改", "Can change"), [E("随时都能重新谈", "Renegotiate anytime")]]] },
    { id: "lib_mark", zh: "✅ 圈出所有真话", en: "✅ Mark Every Truth", tpl: "m111_mark", kw: ["真话", "谣言", "证据", "rumor", "evidence"], pz: "几条说法摆在面前。把站得住的全部圈出来。", pe: "A few claims. Mark every one that holds up.", ask: E("哪些站得住？", "Which hold up?"), items: [E("有时间和地点的记录", "A record with time and place"), E("原始文件上的签名", "A signature on the original"), E("听朋友说的", "Something a friend heard"), E("只有情绪的帖子", "A post that's all emotion")], ans: [0, 1] },
    { id: "lib_classify", zh: "🗂 分一分", en: "🗂 Sort It Out", tpl: "m111_classify", kw: ["分类", "整理", "公开", "隐私", "sort", "privacy"], pz: "把每样东西放进对的一边。", pe: "Put each thing on the right side.", bins: [E("可以公开", "Public"), E("留给自己", "Private")], items: [[E("工作照", "Work photo"), 0], [E("日记", "Diary"), 1], [E("新闻稿", "Press release"), 0], [E("私人短信", "Private texts"), 1]] },
    { id: "lib_pair", zh: "🧩 哪两个一样", en: "🧩 Which Two Match", tpl: "m111_pair", kw: ["一模一样", "比对", "印章", "match", "stamp"], pz: "四枚印章里，只有两枚是同一个章盖的。", pe: "Of four stamps, only two came from the same seal.", items: [E("A · 右下角缺口", "A · chip bottom-right"), E("B · 完整", "B · intact"), E("C · 右下角缺口", "C · chip bottom-right"), E("D · 左上角缺口", "D · chip top-left")], pair: [0, 2] },
    { id: "lib_seq", zh: "📍 按顺序点", en: "📍 In Order", tpl: "m111_seq", kw: ["顺序", "先后", "定位", "order", "sequence"], pz: "按出现的顺序，依次点这三个地方。", pe: "Tap the three spots in the order they appeared.", points: [[E("第一站 · 车站", "1 · Station"), 20, 70], [E("第二站 · 书店", "2 · Bookshop"), 55, 35], [E("第三站 · 河边", "3 · River"), 82, 65]] },
    { id: "lib_find", zh: "🔦 黑暗里找钥匙", en: "🔦 Key in the Dark", tpl: "m111_find", kw: ["黑暗", "手电", "找钥匙", "dark", "flashlight", "key"], pz: "停电了，钥匙掉在地上。用手电照着找。", pe: "Power's out and the key fell. Find it with the flashlight.", label: E("移动手电，找到钥匙", "Move the light and find the key"), target: "🔑", decoy: ["🪙", "📎", "🔩", "🧷", "🔘"] },
    { id: "lib_hold", zh: "🫁 稳住", en: "🫁 Hold Steady", tpl: "m111_hold", kw: ["稳住", "屏息", "按住", "steady", "hold"], pz: "按住，让指针一直停在绿区里。", pe: "Hold to keep the needle in the green.", label: E("按住，稳住", "Hold steady"), need: 4 },
    { id: "lib_morse", zh: "🔨 敲墙暗号", en: "🔨 Knock Code", tpl: "m111_morse", kw: ["敲门", "暗号", "敲击", "knock", "signal"], pz: "墙那边敲了三短一长。照着敲回去。", pe: "Three short, one long through the wall. Knock it back.", label: E("短按三下，再长按一下", "Three short taps, then one long hold"), code: "...-" },
    { id: "lib_align", zh: "🎯 对准", en: "🎯 Line It Up", tpl: "m111_align", kw: ["对准", "对齐", "瞄准", "align", "aim"], pz: "拖动滑块，让粉色线对准虚线。", pe: "Drag until the pink line meets the dashed one.", target: 62, tol: 6, marks: [E("左", "Left"), E("右", "Right")] },
  ];
  if (typeof MG100 !== "undefined" && window.MG168 && window.MG168.reg) window.MG168.reg(LIB.map(g => Object.assign({ seconds: 45, a: "", b: "" }, g)));

  /* 素材库列表里显示中文玩法名 */
  const NAMES = { m111_order: "排序", m111_classify: "分类", m111_mark: "圈出所有符合的", m111_match: "配对", m111_pair: "选出一致的两项", m111_spot: "点位置", m111_seq: "按顺序点", m111_align: "拖动对准", m111_find: "手电找东西", m111_hold: "按住稳住", m111_morse: "敲击码", m111_place: "摆放", m111_beat: "节拍", m112_free: "自由选择", m111_route: "路线", m111_collect: "收集", m111_diff: "找不同", m111_wave: "声轨", m111_space: "摆放位置", m111_plan: "排日程", m111_rotate: "复原角度", m111_doc: "文件核验", m111_device: "实体开关", m111_deal: "协商卡" };
  window.MG_TPL_NAMES = NAMES;
  if (typeof libItems === "function") {
    const L0 = libItems;
    libItems = function () { const r = L0.apply(this, arguments); try { if (typeof LIBT !== "undefined" && LIBT === "mg" && typeof CL === "function" && CL() === "zh") r.forEach(x => { if (NAMES[x.sub]) x.sub = NAMES[x.sub]; }); } catch (_) {} return r; };
  }
})();


/* ===== mod186 · 2026-11-24 官方剧本自带配乐：pack.assets 里的 bgm_<cue> 让 ⟦BGM|cue⟧ 直接播放上传的音乐 =====
   之前 ⟦BGM|BGM_M121_C01⟧ 这类自定义 cue 不在 SC_M / BGM_MOODS 里，播放时被换成默认氛围，上传的文件永远播不到。
   这里把 BGM_FILES 里新出现的、不带斜杠的 cue 登记进去（和用户上传 BGM 的做法一样），于是 scFile(cue) 能找到文件。 */
(function () {
  "use strict";
  function sync() {
    try {
      const F = window.BGM_FILES || {}, X = window.__SC;
      if (!X || !X.SC_M) return;
      Object.keys(F).forEach(k => {
        if (k.indexOf("/") >= 0 || !/^[A-Za-z0-9_-]{3,80}$/.test(k)) return;
        if (!X.SC_M[k]) X.SC_M[k] = Object.assign({}, X.SC_M.m_slow_burn || X.SC_M.warm);
        if (typeof BGM_MOODS !== "undefined" && !BGM_MOODS[k]) BGM_MOODS[k] = { bpm: 70, ch: [[48]], arp: [] };
        if (typeof BGM_NAME !== "undefined" && !BGM_NAME[k]) BGM_NAME[k] = "🎵 " + k;
      });
    } catch (_) {}
  }
  sync(); setInterval(sync, 1500);
})();

/* ===== mod187 · 2026-11-24 新用户选完口味后黑屏 =====
   原因：36 部内置故事包都已下线（retired 名单），hookPicks() 永远返回 0 部，
   选完口味进入的「为你挑了 0 部 · 左右滑」页面里一张卡都没有，整屏只剩黑底。
   修法：内置故事包选不出时，改从线上官方新剧（off94Feed，和「MIRU 新剧」同一份）里挑最多 6 部，
   按类型（男男 / 男女 / 女女）优先，用封面卡展示；点卡片直接进剧；一部都拿不到就直接进首页，绝不留黑屏。 */
(function () {
  "use strict";
  if (typeof renderHook !== "function" || typeof hookPicks !== "function") return;
  const st = document.createElement("style");
  st.textContent = ".ob187{position:absolute;inset:0;overflow-y:auto;padding:calc(env(safe-area-inset-top,0px) + 14px) 16px calc(env(safe-area-inset-bottom,0px) + 24px);background:#0b0a10;color:#fff;-webkit-overflow-scrolling:touch}"
    + ".ob187 .t{display:flex;justify-content:flex-end;gap:8px}.ob187 .t button{background:rgba(255,255,255,.12);color:#fff;border:0;border-radius:999px;padding:7px 14px;font-size:13px}"
    + ".ob187 h2{margin:14px 0 4px;font-size:24px}.ob187 .s{margin:0 0 16px;opacity:.72;font-size:13px;line-height:1.5}"
    + ".ob187 .g{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}"
    + ".ob187 .c{display:block;text-align:left;background:none;border:0;padding:0;color:#fff;min-width:0}"
    + ".ob187 .c i{display:block;aspect-ratio:3/4;border-radius:14px;background:#1d1a26 center/cover no-repeat}"
    + ".ob187 .c b{display:block;margin-top:8px;font-size:15px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"
    + ".ob187 .c span{display:block;margin-top:2px;font-size:12px;opacity:.65;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}"
    + ".ob187 .sp{margin:40px auto;width:28px;height:28px;border-radius:50%;border:3px solid rgba(255,255,255,.2);border-top-color:#EE6F97;animation:ob187 1s linear infinite}@keyframes ob187{to{transform:rotate(360deg)}}";
  document.head.appendChild(st);
  const esc187 = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  function shell() {
    const z = zh();
    return '<div class="ob187"><div class="t"><button data-pfopen="1">⚙︎ ' + (z ? "口味" : "Taste") + '</button><button data-obskip="1">' + (z ? "先逛逛" : "Browse") + ' ›</button></div>'
      + '<h2>' + (z ? "为你推荐" : "Picked for you") + '</h2><p class="s">' + (z ? "正在按你的口味挑剧…" : "Finding stories for you…") + '</p><div class="g"><div class="sp"></div></div></div>';
  }
  async function fill() {
    const host = document.querySelector("#s-ob .ob187"); if (!host) return;
    let L = []; try { L = (await off94Feed()) || []; } catch (_) {}
    const or = S.or && S.or !== "all" ? S.or : null;
    let pick = L.filter(w => !or || !w.orient || w.orient === or); if (pick.length < 2) pick = L;
    pick = pick.slice(0, 6);
    if (!pick.length) { S.ob = true; save(); startApp(); return; }
    const z = zh();
    host.querySelector(".s").textContent = z ? ("已为你挑了 " + pick.length + " 部 · 点开就能玩，前两章免费") : (pick.length + " stories for you · tap to start, chapters 1–2 free");
    host.querySelector(".g").innerHTML = pick.map(w => {
      const A = w.A || {}, img = A.cover || A.poster || w.cover || "";
      const title = typeof off94Title === "function" ? off94Title(w) : w.title, hook = typeof off94Hook === "function" ? off94Hook(w) : (w.hook || "");
      return '<button class="c" data-ob187="' + esc187(w.id) + '"><i style="background-image:url(\'' + esc187(img) + '\')"></i><b>' + esc187(title) + '</b><span>' + esc187(hook) + '</span></button>';
    }).join("");
  }
  const _rh = renderHook;
  renderHook = function () {
    let n = 0; try { n = hookPicks().length; } catch (_) {}
    if (n) return _rh.apply(this, arguments);
    screen("s-ob", shell()); show("s-ob"); fill();
  };
  document.addEventListener("click", e => {
    const x = e.target.closest("[data-ob187]"); if (!x) return;
    e.preventDefault(); e.stopPropagation();
    const id = x.dataset.ob187;
    S.ob = true; save(); startApp();
    setTimeout(() => { const b = document.createElement("button"); b.dataset.off94 = id; b.style.display = "none"; document.body.appendChild(b); b.click(); setTimeout(() => b.remove(), 2000); }, 80);
  }, true);
  /* 新用户还在选口味时就先把官方新剧清单取好，选完口味不用再等 */
  try { if (!S.ob) setTimeout(() => { off94Feed().catch(() => {}); }, 1200); } catch (_) {}
})();

/* ===== mod188 · 2026-11-24 首页顶部分类 + 发现页分组改用新标签 =====
   昨天标签大整改后，首页顶部还是「甜宠 / 宫廷奇幻 / 群像 / 宿敌」这套按关键词猜的旧分类，发现页下面的分组也还按旧标签。
   现在统一读 art/official/discover.json（和发现页筛选、后台新建剧本同一套 dict）；作者后台上线、discover.json 里还没有的剧，用作品包里的 pack.meta.disc（PK180 记在本机）。
   顶部：为你推荐 · 热门 · 新剧 · 甜宠治愈 · 暗黑 · 奇幻（没有剧的分类不显示）。
   发现页分组：黑帮 · 总裁·富豪 · 吸血鬼·狼人 · 明星·娱乐圈 · 运动员 · 校园 · 虐心 · 悬疑（少于 2 部的分组不显示）。 */
(function () {
  "use strict";
  const DM = { data: null };
  const any = (a, b) => (a || []).some(x => b.includes(x));
  const discOf = w => { if (!w) return null; const W = DM.data && DM.data.works && DM.data.works[w.id]; if (W) return W; const s = window.PK180 && PK180.store && PK180.store[w.id]; return (s && s.d) || null; };
  const TAB_RULE = {
    new: (w, d, i) => i < 6,
    sweet: (w, d) => !!d && (any(d.mood, ["sweet"]) || d.intensity === "sweet"),
    dark: (w, d) => !!d && any(d.mood, ["dark", "angst"]),
    fantasy: (w, d) => !!d && (any(d.mood, ["fantasy"]) || any(d.identity, ["vampire", "werewolf", "mythic", "royalty"]))
  };
  const TABS = [["foryou", "For You", "为你推荐"], ["hot", "Hot", "热门"], ["new", "New", "新剧"], ["sweet", "Sweet & Cozy", "甜宠治愈"], ["dark", "Dark", "暗黑"], ["fantasy", "Fantasy", "奇幻"]];
  const SHELF = [
    ["🖤", "黑帮", "Mafia", d => any(d.identity, ["mafia"])],
    ["💼", "总裁·富豪", "CEO & Billionaire", d => any(d.identity, ["ceo"])],
    ["🩸", "吸血鬼·狼人", "Vampires & Wolves", d => any(d.identity, ["vampire", "werewolf"])],
    ["✨", "明星·娱乐圈", "Celebrity", d => any(d.identity, ["showbiz"])],
    ["🏒", "运动员", "Athletes", d => any(d.identity, ["athlete"])],
    ["🎓", "校园", "College", d => any(d.identity, ["college"])],
    ["💔", "虐心", "Angst", d => any(d.mood, ["angst"])],
    ["🔍", "悬疑", "Mystery", d => any(d.mood, ["mystery"])]
  ];
  function oldTags(w) { const T = window.TAGS157; if (!T || typeof T.tagsOf !== "function") return []; const M = T.MAP; T.MAP = null; try { return T.tagsOf(w) || []; } catch (_) { return []; } finally { T.MAP = M; } }
  function build() {
    const L = (typeof OFFF94 !== "undefined" && OFFF94.list) || []; if (!L.length) return;
    const MAP = {};
    L.forEach((w, i) => {
      const d = discOf(w);
      let out = Object.keys(TAB_RULE).filter(k => TAB_RULE[k](w, d, i));
      if (!d) out = out.concat(oldTags(w).filter(k => ["sweet", "dark", "fantasy"].includes(k)));
      MAP[w.id] = [...new Set(out)];
    });
    window.TAGS157 = window.TAGS157 || {}; window.TAGS157.MAP = MAP;
  }
  try { if (typeof FEED_TABS !== "undefined" && typeof T === "function") { FEED_TABS.length = 0; TABS.forEach(([k, en, zh]) => FEED_TABS.push([k, T(en, zh)])); if (typeof feedTab !== "undefined" && !TABS.some(x => x[0] === feedTab)) feedTab = "foryou"; } } catch (_) {}
  const ready = fetch("art/official/discover.json?v=" + Math.floor(Date.now() / 6e5)).then(r => (r.ok ? r.json() : null)).then(d => { if (d && d.works) DM.data = d; build(); }).catch(() => {});
  if (typeof off94Feed === "function") {
    const f = off94Feed;
    off94Feed = async function () { const L = await f.apply(this, arguments); try { await ready; build(); } catch (_) {} return L; };
  }
  if (typeof discMain === "function" && typeof off94RCard === "function") {
    const dm = discMain;
    discMain = function () {
      let h = dm.apply(this, arguments);
      try {
        const L = (typeof OFFF94 !== "undefined" && OFFF94.list) || [];
        if (!L.length || !DM.data) return h;
        const tpl = document.createElement("template"); tpl.innerHTML = h;
        const nw = tpl.content.querySelector(".s144new"); if (!nw) return h;
        tpl.content.querySelectorAll(".shelf.s144:not(.s144new)").forEach(n => n.remove());
        const z = typeof CL === "function" ? CL() === "zh" : true;
        let add = "";
        SHELF.forEach(([ic, zt, et, fn]) => {
          const ws = L.filter(w => { const d = discOf(w); return d && fn(d); });
          if (ws.length >= 2) add += '<div class="shelf off94s s188"><div class="shd"><h3>' + ic + " " + (z ? zt : et) + '</h3></div><div class="rail2">' + ws.map(w => off94RCard(w).replace(/<span class="rbadge">[^<]*<\/span>/, "")).join("") + "</div></div>";
        });
        nw.insertAdjacentHTML("afterend", add);
        h = tpl.innerHTML;
      } catch (_) {}
      return h;
    };
  }
})();

/* ===== mod189 · 2026-11-24 安卓 App 里的激励视频改用 Unity Ads（原生），奖励以 Unity 服务器回调为准 =====
   安卓壳（TWA）第一次打开网页时 referrer 是 android-app://com.miru.plus.app，记下来，之后就知道「在 App 里」。
   在 App 里点「看广告」：跳 miru-ad://rewarded?u=<用户ID>.<本次编号>，原生页面放 Unity 激励视频；
   Unity 看完后直接通知我们服务器（/api/wallet?r=unity），服务器发钻、流水原因记成 ad_unity:<本次编号>。
   回到网页后查钱包流水：找到这条就算到账（不在本地再加钻，避免和服务器重复）；找不到就提示没拿到奖励。
   网页版（浏览器里）照旧走 AdSense（app128），Unity 没有网页版广告。 */
(function () {
  "use strict";
  const KEY = "miru_twa189";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  try { if (/^android-app:\/\/com\.miru\.plus\.app/.test(document.referrer || "")) localStorage.setItem(KEY, "1"); } catch (_) {}
  const inApp = () => { try { return localStorage.getItem(KEY) === "1"; } catch (_) { return false; } };
  window.__unity189 = () => ({ inApp: inApp(), pending: !!pend });
  if (typeof watchAd !== "function" || typeof capi !== "function") return;
  let pend = null, granted = false;
  const W0 = watchAd;
  watchAd = function (done) {
    if (!inApp()) return W0.apply(this, arguments);
    const c = typeof cloudInfo === "function" ? cloudInfo() : {};
    if (!c.uid) return W0.apply(this, arguments);
    if (!adLeft()) { toast(t("ad.none")); return; }
    if (typeof closeSheet === "function") closeSheet();
    const n = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    pend = { n, done, at: Date.now() };
    try { if (typeof track === "function") track("ad_unity_start", {}); } catch (_) {}
    location.href = "miru-ad://rewarded?u=" + encodeURIComponent(c.uid + "." + n) + "&n=" + n;
  };
  if (typeof adGrant === "function") {
    const G0 = adGrant;
    adGrant = function (kind) {
      if (granted) { granted = false; if (kind === "gem") return; }  /* 钻石已经由服务器发了，这里只处理投票、解锁这类本地效果 */
      return G0.apply(this, arguments);
    };
  }
  let checking = false;
  async function check() {
    if (!pend || checking) return; checking = true; const p = pend;
    try {
      for (let i = 0; i < 8 && pend === p; i++) {
        await new Promise(r => setTimeout(r, i ? 1500 : 800));
        let r; try { r = await capi("/wallet"); } catch (_) { continue; }
        if (!r || !r.ok) continue;
        const hit = (r.j.recent || []).find(x => x && x.reason === "ad_unity:" + p.n);
        if (!hit) continue;
        pend = null;
        const cc = cloudInfo(); cc.known = r.j.gems; S.keys = r.j.gems;
        const st = adState(); st.n++; save();
        if (typeof keysChip === "function") keysChip();
        toast((zh() ? "看完广告 +" : "Ad watched +") + (hit.delta || 1) + " 💎");
        granted = true; try { if (p.done) p.done(); } finally { granted = false; }
        return;
      }
      if (pend === p) { pend = null; toast(zh() ? "这次没有拿到奖励（广告没看完，或暂时没有可播的广告）" : "No reward this time (ad not finished or none available)"); }
    } finally { checking = false; }
  }
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible" && pend && Date.now() - pend.at > 1200) check(); });
})();

/* ===== mod190 · 2026-11-24 原创声明：用户发布作品前必须确认原创 =====
   所有「发布到 MIRU」（导入剧本 app51、创作中心 / 一句话写剧 app68）最后都走 capi("/works",{json:{op:"publish"}})。
   这里在发出请求前弹一次原创声明，勾选并确认才继续；同一部作品在这台设备上确认过一次，之后更新不再重复弹。
   确认记录跟作品一起上传：pack.meta.original = { v: 声明版本, at: 时间 }，后台审核和侵权投诉时可查。 */
(function () {
  "use strict";
  if (typeof capi !== "function") return;
  const V = 1, KEY = "miru_orig190";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const TXT = () => zh()
    ? "我确认本作品（故事、人物、文字，以及我上传的图片、音频等素材）是我本人原创，或我已获得合法授权；没有抄袭、搬运他人作品，不侵犯他人的著作权、肖像权等权利。如有侵权，由我本人承担责任，MIRU 有权下架作品。"
    : "I confirm this work (story, characters, text and any images or audio I upload) is my own original creation, or I have the rights to use it. It does not copy or repost anyone else's work or infringe copyright, likeness or other rights. I am responsible for any infringement, and MIRU may remove the work.";
  const done = () => { try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch (_) { return {}; } };
  const mark = id => { try { const d = done(); d[id] = Date.now(); localStorage.setItem(KEY, JSON.stringify(d)); } catch (_) {} };
  function ask() {
    return new Promise(resolve => {
      const host = document.querySelector("#dev") || document.body, el = document.createElement("div");
      el.style.cssText = "position:absolute;inset:0;z-index:9999;background:rgba(8,6,12,.72);display:flex;align-items:center;justify-content:center;padding:18px";
      el.innerHTML = '<div style="max-width:420px;width:100%;background:#1c1724;color:#f1ecf3;border-radius:16px;padding:20px 18px;box-shadow:0 10px 40px rgba(0,0,0,.5)">' +
        '<h3 style="margin:0 0 10px;font-size:18px">' + (zh() ? "原创声明" : "Originality statement") + '</h3>' +
        '<p style="margin:0 0 14px;font-size:14px;line-height:1.65;color:#d9d1df">' + TXT() + '</p>' +
        '<label style="display:flex;gap:8px;align-items:flex-start;font-size:14px;margin-bottom:16px;cursor:pointer"><input type="checkbox" id="og190" style="margin-top:3px"> <span>' + (zh() ? "我已阅读并确认以上声明" : "I have read and agree") + '</span></label>' +
        '<div style="display:flex;gap:10px;justify-content:flex-end"><button id="ogN190" style="padding:9px 16px;border-radius:10px;border:1px solid #4a4055;background:transparent;color:#f1ecf3">' + (zh() ? "取消" : "Cancel") + '</button>' +
        '<button id="ogY190" disabled style="padding:9px 16px;border-radius:10px;border:0;background:#EE6F97;color:#fff;opacity:.5">' + (zh() ? "确认并发布" : "Confirm & publish") + '</button></div></div>';
      host.appendChild(el);
      const cb = el.querySelector("#og190"), y = el.querySelector("#ogY190");
      cb.onchange = () => { y.disabled = !cb.checked; y.style.opacity = cb.checked ? "1" : ".5"; };
      el.querySelector("#ogN190").onclick = () => { el.remove(); resolve(false); };
      y.onclick = () => { if (!cb.checked) return; el.remove(); resolve(true); };
    });
  }
  const C0 = capi;
  capi = async function (path, opt) {
    const j = opt && opt.json;
    if (String(path || "").split("?")[0] === "/works" && j && j.op === "publish" && j.work) {
      const id = String(j.work.id || j.work.title || "new");
      if (!done()[id]) {
        const ok = await ask();
        if (!ok) { try { toast(zh() ? "需要确认原创声明才能发布" : "Please confirm the originality statement to publish"); } catch (_) {} return { ok: false, status: 0, j: { error: "original_declined" } }; }
        mark(id);
        try { if (typeof track === "function") track("original_confirm", { v: V }); } catch (_) {}
      }
      const rec = { v: V, at: new Date().toISOString() };
      j.work.original = rec;
      try { if (j.work.pack && typeof j.work.pack === "object") { j.work.pack.meta = j.work.pack.meta || {}; j.work.pack.meta.original = rec; } } catch (_) {}
    }
    return C0.apply(this, arguments);
  };
})();

/* ===== mod191 · 2026-11-25 网页版激励广告：Monetag Direct Link =====
   AdSense 还在审核，网页版「看广告」以前只能放 15 秒模拟广告（不产生收入）。
   现在（不在安卓 App 里时）：点「看广告」→ 新标签页打开 Monetag 广告链接（必须在点击当下打开，否则会被浏览器拦截）；
   用户在广告页停留满 15 秒再回来，就发奖励（每天次数上限沿用 adLeft，钻石走原来的 earn 同步，服务器有每日免费上限）。
   安卓 App 里仍然走 Unity（mod189）。AdSense 审核通过后，把 PREFER 改成 "adsense" 即可切回。 */
(function () {
  "use strict";
  if (typeof watchAd !== "function") return;
  const LINK = "https://uplcm.com/4/12342633", NEED_MS = 15000, PREFER = "monetag";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const inApp = () => { try { return localStorage.getItem("miru_twa189") === "1"; } catch (_) { return false; } };
  const W1 = watchAd;
  let pend = null;
  watchAd = function (done) {
    if (PREFER !== "monetag" || inApp()) return W1.apply(this, arguments);
    if (!adLeft()) { toast(t("ad.none")); return; }
    const w = window.open(LINK, "_blank"); try { if (w) w.opener = null; } catch (_) {}
    if (!w && !document.hidden) { /* 被拦截了：退回原来的流程 */ return W1.apply(this, arguments); }
    if (typeof closeSheet === "function") closeSheet();
    pend = { done, at: Date.now(), away: 0, left: null };
    toast(zh() ? "广告已在新标签页打开，看 15 秒后回来领奖励" : "Ad opened in a new tab — come back after 15 seconds for your reward");
    try { if (typeof track === "function") track("ad_monetag_open", {}); } catch (_) {}
  };
  function settle() {
    if (!pend) return;
    const p = pend, away = p.away + (p.left ? Date.now() - p.left : 0);
    if (away >= NEED_MS) { pend = null; const st = adState(); st.n++; save(); try { if (typeof track === "function") track("ad_monetag_done", { s: Math.round(away / 1000) }); } catch (_) {} if (p.done) p.done(); }
    else if (Date.now() - p.at > 1500) { toast(zh() ? "还没看够 15 秒，再去广告页停留一会儿" : "Stay on the ad a little longer (15s)"); }
  }
  document.addEventListener("visibilitychange", function () {
    if (!pend) return;
    if (document.hidden) { pend.left = Date.now(); }
    else { if (pend.left) { pend.away += Date.now() - pend.left; pend.left = null; } settle(); }
  });
  window.addEventListener("blur", function () { if (pend && !pend.left) pend.left = Date.now(); });
  window.addEventListener("focus", function () { if (pend && pend.left) { pend.away += Date.now() - pend.left; pend.left = null; settle(); } });
})();

/* ===== mod192 · 2026-11-25 网页版充值走 PayPal =====
   以前网页版点钻石包：本地先加钻 + 发一个"测试购买"给服务器（PAY_TEST 关着，服务器拒绝），等于没有真收款。
   现在（不在安卓 App 里时）：点钻石包 → 弹出 PayPal 付款按钮（PayPal 余额 / 银行卡）；付完由服务器向 PayPal 扣款确认后发钻，
   本地不先加钻。挂在 window 捕获阶段，抢在 app84 / app68 的旧处理之前。安卓 App 里仍走 Google Play（app127）。 */
(function () {
  "use strict";
  if (typeof capi !== "function") return;
  const CLIENT = "BAAvWaWCDv9CwcqNlXE7Bmz_C1T6wRH9vfRbThLkKBX6kang-u7J6pKUrCOaQ3HgH4iThKcw5Ci2kugTwg";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const inApp = () => { try { if (window.__play && window.__play().twa) return true; return localStorage.getItem("miru_twa189") === "1"; } catch (_) { return false; } };
  let sdk = null;
  function loadSdk() {
    if (window.paypal && window.paypal.Buttons) return Promise.resolve(window.paypal);
    if (sdk) return sdk;
    sdk = new Promise((ok, bad) => {
      const s = document.createElement("script");
      s.src = "https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(CLIENT) + "&currency=USD&intent=capture&components=buttons&disable-funding=paylater,venmo";
      s.onload = () => (window.paypal ? ok(window.paypal) : bad(new Error("no paypal")));
      s.onerror = () => { sdk = null; bad(new Error("load failed")); };
      document.head.appendChild(s);
    });
    return sdk;
  }
  function close(el) { try { el.remove(); } catch (_) {} }
  async function pay(sku, label) {
    const c = typeof cloudInfo === "function" ? cloudInfo() : {};
    if (!c.token) { toast(zh() ? "请先登录账号再充值" : "Please sign in to top up"); return; }
    const host = document.querySelector("#dev") || document.body, el = document.createElement("div");
    el.style.cssText = "position:absolute;inset:0;z-index:9999;background:rgba(8,6,12,.72);display:flex;align-items:center;justify-content:center;padding:18px";
    el.innerHTML = '<div style="max-width:380px;width:100%;background:#fff;color:#1f2329;border-radius:16px;padding:18px 16px;box-shadow:0 10px 40px rgba(0,0,0,.5)">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><b style="font-size:16px">' + (zh() ? "充值 " : "Top up ") + label + '</b><button id="ppx192" style="border:0;background:none;font-size:20px;cursor:pointer">✕</button></div>' +
      '<div id="ppb192" style="min-height:120px;display:flex;align-items:center;justify-content:center;color:#888;font-size:13px">' + (zh() ? "正在加载 PayPal…" : "Loading PayPal…") + '</div>' +
      '<p style="margin:8px 0 0;font-size:12px;color:#888;line-height:1.5">' + (zh() ? "可用 PayPal 余额或银行卡付款。付款成功后钻石自动到账。" : "Pay with your PayPal balance or a card. Diamonds arrive as soon as the payment clears.") + '</p></div>';
    host.appendChild(el);
    el.querySelector("#ppx192").onclick = () => close(el);
    try { if (typeof track === "function") track("pp_open", { sku }); } catch (_) {}
    let pp; try { pp = await loadSdk(); } catch (e) { el.querySelector("#ppb192").textContent = zh() ? "PayPal 加载失败，请稍后再试" : "Couldn't load PayPal. Please try again later."; return; }
    const box = el.querySelector("#ppb192"); box.textContent = "";
    pp.Buttons({
      style: { layout: "vertical", shape: "pill", label: "pay" },
      createOrder: async () => { const r = await capi("/wallet", { json: { op: "pp_create", sku } }); if (!r.ok || !r.j.id) { toast((zh() ? "下单失败：" : "Order failed: ") + ((r.j && r.j.error) || r.status)); throw new Error("create"); } return r.j.id; },
      onApprove: async (data) => {
        box.innerHTML = '<span style="color:#888;font-size:13px">' + (zh() ? "正在确认付款…" : "Confirming payment…") + '</span>';
        const r = await capi("/wallet", { json: { op: "pp_capture", orderId: data.orderID } });
        if (r.ok && typeof r.j.gems === "number") {
          const cc = cloudInfo(); cc.known = r.j.gems; S.keys = r.j.gems; S.firstBuy = true; save();
          if (typeof keysChip === "function") keysChip();
          close(el); if (typeof closeSheet === "function") closeSheet();
          toast((zh() ? "充值成功 · 💎 " : "Top-up done · 💎 ") + r.j.gems);
          try { if (typeof track === "function") track("purchase", { sku, via: "paypal" }); } catch (_) {}
          if (typeof refreshAfterPay === "function") refreshAfterPay();
        } else { box.innerHTML = '<span style="color:#c00;font-size:13px">' + (zh() ? "付款没有完成：" : "Payment not completed: ") + ((r.j && r.j.error) || r.status) + '</span>'; }
      },
      onCancel: () => { toast(zh() ? "已取消付款" : "Payment cancelled"); },
      onError: (err) => { console.warn("[pp192]", err); toast(zh() ? "PayPal 出错了，请稍后再试" : "PayPal error, please try again"); }
    }).render(box).catch(e => { console.warn("[pp192] render", e); box.textContent = zh() ? "PayPal 暂时不可用" : "PayPal is unavailable right now"; });
  }
  window.addEventListener("click", function (e) {
    const x = e.target && e.target.closest && e.target.closest(".packs84 [data-buy],.packs [data-buy]"); if (!x) return;
    if (inApp()) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const n = +x.dataset.buy;
    /* 2026-11-25 PayPal 账户被停用：新支付接通前先提示，不再弹出会报错的窗口。接通后由 window.__webpay 接管。 */
    if (typeof window.__webpay === "function") { window.__webpay("gems_" + n, n); return; }
    toast(zh() ? "网页充值即将开放，现在可以看广告免费领钻石" : "Web top-up is coming soon. Watch an ad to earn free diamonds."); void pay;
  }, true);
  window.__pp192 = () => ({ inApp: inApp(), sdk: !!(window.paypal && window.paypal.Buttons) });
})();

/* ===== mod193 · 2026-11-25 网页版充值走 Xsolla（艾克索拉） =====
   PayPal 商家账户被停用后改用 Xsolla。点钻石包（不在安卓 App 里时，mod192 转到这里）→ 服务器按 SKU 向 Xsolla 要付款页 → 新标签页打开付款；
   付完 Xsolla 回调服务器发钻（本地不先加钻），这里每 5 秒查一次余额，到账就提示。服务器还没配好密钥时（501）仍提示「即将开放」。 */
(function () {
  "use strict";
  if (typeof capi !== "function") return;
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  let poll = null;
  async function sync() {
    try {
      const r = await capi("/wallet");
      if (r && r.ok && r.j && typeof r.j.gems === "number") {
        const cc = cloudInfo(), before = Number(cc.known);
        cc.known = r.j.gems; S.keys = r.j.gems; save();
        if (typeof keysChip === "function") keysChip();
        if (Number.isFinite(before) && r.j.gems > before) {
          toast((zh() ? "充值成功 · 💎 " : "Top-up done · 💎 ") + r.j.gems);
          if (typeof refreshAfterPay === "function") refreshAfterPay();
          return true;
        }
      }
    } catch (_) {}
    return false;
  }
  function watch() {
    if (poll) clearInterval(poll);
    let n = 0;
    poll = setInterval(async () => { n++; if ((await sync()) || n > 72) { clearInterval(poll); poll = null; } }, 5000);
  }
  window.__webpay = async function (sku) {
    const c = typeof cloudInfo === "function" ? cloudInfo() : {};
    if (!c.token) { toast(zh() ? "请先登录账号再充值" : "Please sign in to top up"); return; }
    let w = null; try { w = window.open("", "_blank"); } catch (_) {}
    toast(zh() ? "正在打开付款页…" : "Opening checkout…");
    const r = await capi("/wallet", { json: { op: "xs_create", sku, lang: typeof CL === "function" ? CL() : "en" } });
    if (!r.ok || !r.j || !r.j.url) {
      try { if (w) w.close(); } catch (_) {}
      toast(r.status === 501 ? (zh() ? "网页充值即将开放，现在可以看广告免费领钻石" : "Web top-up is coming soon. Watch an ad to earn free diamonds.")
        : ((zh() ? "下单失败：" : "Checkout failed: ") + ((r.j && (r.j.detail || r.j.error)) || r.status)));
      return;
    }
    try { if (typeof track === "function") track("xs_open", { sku }); } catch (_) {}
    if (w && !w.closed) { w.location.href = r.j.url; watch(); } else { location.href = r.j.url; }
  };
  try {
    if (/[?&]xs=done/.test(location.search)) {
      history.replaceState(null, "", location.pathname + location.hash);
      setTimeout(() => { sync(); watch(); }, 1500);
    }
  } catch (_) {}
})();

/* ===== mod194 · 2026-11-25 作品按语言显示 =====
   创作者在后台给每部作品选「上线语言」（pack.meta.langs，英文必选）。作品列表接口（/api/works?feed=…）现在带回 langs，
   这里统一过滤：当前界面语言不在作品语言里的就不显示（首页、发现页、角色卡、挑战等所有读列表的地方都生效）。
   没有 langs 的老作品照常显示。URL 带 alllang=1 时不过滤。 */
(function () {
  "use strict";
  const cur = () => { try { return (typeof CL === "function" ? CL() : "en") || "en"; } catch (_) { return "en"; } };
  const ok = w => { const L = w && w.langs; if (!Array.isArray(L) || !L.length) return true; return L.indexOf(cur()) >= 0 || (w.lang || "zh") === cur(); }; /* 原文语种也算：中文写的剧 langs 只记了 en 时，中文界面也要能看到 */
  const F = window.fetch;
  if (typeof F !== "function") return;
  window.fetch = async function (input) {
    const res = await F.apply(this, arguments);
    try {
      const url = typeof input === "string" ? input : (input && input.url) || "";
      if (!res.ok || !/\/api\/works\?(?:[^#]*&)?feed=/.test(url) || /[?&]alllang=1/.test(url)) return res;
      const j = await res.clone().json();
      const k = Array.isArray(j.works) ? "works" : (Array.isArray(j.rows) ? "rows" : null);
      if (!k) return res;
      const n0 = j[k].length; j[k] = j[k].filter(ok);
      if (j[k].length === n0) return res;
      return new Response(JSON.stringify(j), { status: res.status, statusText: res.statusText, headers: { "Content-Type": "application/json; charset=utf-8" } });
    } catch (_) { return res; }
  };
  window.__langOK194 = ok;
})();

/* ===== mod195 · 2026-11-25 PC 版布局 =====
   电脑打开（非手机 / 平板的浏览器、鼠标指针、窗口 ≥ 1100 宽）自动切到 PC 版：左边导航栏、中间是 App 本体、右边是全部剧目墙
   （和首页同一份在线作品，按当前语言过滤，可搜索、按男女 / 男男 / 女女筛选）；手机打开保持原样。窗口缩窄到 1100 以下自动回到手机布局。
   导航和剧目卡片直接复用 App 原有的 data-tab / data-off94 点击处理，不另写一套逻辑。 */
(function () {
  "use strict";
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile|Silk|Kindle|Opera Mini/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent));
  if (isMobileUA) return;
  const zh = () => (typeof CL === "function" ? CL() === "zh" : false);
  const T = (z, e) => (zh() ? z : e);
  const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const L = v => { if (v == null) return ""; if (typeof v === "string") return v; try { return typeof Lz === "function" ? Lz(v) : (v[zh() ? "zh" : "en"] || v.en || v.zh || ""); } catch (_) { return v.en || v.zh || ""; } };
  const css = `
html.pc195,html.pc195 body{overflow:hidden}
html.pc195 .app{position:fixed!important;left:248px!important;top:0!important;bottom:0!important;width:500px!important;margin:0!important;padding:0!important;display:flex!important;align-items:center!important;justify-content:center!important;transform:none!important}
html.pc195 #dev{width:468px!important;max-width:468px!important;height:calc(100vh - 28px)!important;max-height:980px!important;border-radius:26px!important}
#pc-side,#pc-lib{display:none}
html.pc195 #pc-side{display:flex;position:fixed;left:0;top:0;bottom:0;width:248px;flex-direction:column;gap:6px;padding:26px 18px;border-right:1px solid #ffffff14;background:#0b0a10;z-index:50;font-family:inherit}
#pc-side .logo{font:800 26px/1 Georgia,serif;letter-spacing:.14em;color:#F1ECF3;margin:4px 10px 4px}
#pc-side .tag{color:#AAA1B0;font-size:12.5px;margin:0 10px 18px;line-height:1.5}
#pc-side button,#pc-side a{display:flex;align-items:center;gap:12px;width:100%;text-align:left;background:none;border:0;color:#CFC6D6;font-size:15px;padding:11px 12px;border-radius:12px;cursor:pointer;text-decoration:none}
#pc-side button:hover,#pc-side a:hover{background:#ffffff0d;color:#fff}
#pc-side button.on{background:linear-gradient(135deg,#F0B77E33,#EE6F9733);color:#fff}
#pc-side .sep{height:1px;background:#ffffff14;margin:14px 6px}
#pc-side .foot{margin-top:auto;color:#776e7f;font-size:12px;padding:0 10px;line-height:1.7}
html.pc195 #pc-lib{display:block;position:fixed;left:748px;right:0;top:0;bottom:0;overflow:auto;padding:30px 36px 60px;background:radial-gradient(1200px 600px at 70% -10%,#2a1730 0,#0b0a10 60%);z-index:40;color:#F1ECF3}
#pc-lib h2{font:700 26px/1.2 Georgia,serif;margin:0 0 6px}
#pc-lib .sub{color:#AAA1B0;font-size:14px;margin:0 0 18px}
#pc-lib .bar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:20px}
#pc-lib input{flex:1;min-width:220px;background:#16141C;border:1px solid #2A2531;border-radius:999px;color:#F1ECF3;padding:10px 16px;font-size:14px;outline:none}
#pc-lib .chip{background:#16141C;border:1px solid #2A2531;color:#CFC6D6;border-radius:999px;padding:8px 14px;font-size:13px;cursor:pointer}
#pc-lib .chip.on{border-color:#F0B77E;color:#F6D3AE}
#pc-lib .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(176px,1fr));gap:18px}
#pc-lib .card{background:#16141C;border:1px solid #2A2531;border-radius:16px;overflow:hidden;cursor:pointer;text-align:left;color:inherit;padding:0;display:flex;flex-direction:column;transition:transform .15s,border-color .15s}
#pc-lib .card:hover{transform:translateY(-3px);border-color:#F0B77E88}
#pc-lib .card video{width:100%;aspect-ratio:3/4;object-fit:cover;background:#1d1a25;display:block}
#pc-lib .card img{width:100%;aspect-ratio:3/4;object-fit:cover;background:#1d1a25;display:block}
#pc-lib .card b{display:block;font-size:15px;padding:10px 12px 0;line-height:1.35}
#pc-lib .card small{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;color:#AAA1B0;font-size:12.5px;line-height:1.5;padding:6px 12px 14px}
#pc-lib .empty{color:#AAA1B0;padding:40px 0}
@media (max-width:1399px){html.pc195 #pc-lib .grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}}
`;
  const NAV = [["home", "首页", "Home", "⌂"], ["discover", "发现", "Discover", "◎"], ["create", "创作", "Create", "✎"], ["chats", "聊天", "Chats", "✉"], ["me", "我的", "Me", "☺"]];
  let built = false, filter = "all", q = "", comm = [], commAt = 0;
  function tabsReal() { return [...document.querySelectorAll("#dev .tabbar [data-tab]")].map(b => b.dataset.tab); }
  function sideHTML() {
    const real = tabsReal();
    const items = NAV.map((n, i) => [real[i] || n[0], n[1], n[2], n[3]]);
    return '<div class="logo">MIRU</div><div class="tag">' + T("互动剧与 AI 角色对话 · 你来做主角", "Interactive romance stories · you are the lead") + '</div>' +
      items.map(n => '<button data-tab="' + esc(n[0]) + '" data-pcnav="' + esc(n[0]) + '"><span>' + n[3] + '</span>' + esc(T(n[1], n[2])) + '</button>').join("") +
      '<div class="sep"></div><a href="/stories/" target="_blank" rel="noopener"><span>❏</span>' + esc(T("剧目介绍", "Story guide")) + '</a><a href="/about.html" target="_blank" rel="noopener"><span>ⓘ</span>' + esc(T("关于 MIRU", "About MIRU")) + '</a>' +
      '<div class="foot">© 2026 MIRU · <a href="/privacy.html" target="_blank" style="display:inline;padding:0;color:inherit">' + esc(T("隐私", "Privacy")) + '</a> · <a href="/terms.html" target="_blank" style="display:inline;padding:0;color:inherit">' + esc(T("条款", "Terms")) + '</a></div>';
  }
  function items() {
    const VM = vidMap(); const out = comm.filter(w => okLang(w) && (filter === "all" || (w.orient || "bg") === filter)).map(w => ({ k: "off94", id: w.id, t: (!zh() && w.en && w.en.title) || w.title, h: (!zh() && w.en && w.en.hook) || w.hook, img: w.cover || "", vid: absU(VM[w.id]) }));
    const s = q.trim().toLowerCase();
    return s ? out.filter(x => (x.t + " " + x.h).toLowerCase().includes(s)) : out;
  }
  function gridHTML() {
    const L2 = items();
    if (!L2.length) return '<div class="empty">' + esc(T("没有找到作品", "No stories found")) + '</div>';
    return L2.map((x, i) => '<button class="card" data-' + x.k + '="' + esc(x.id) + '">' + (x.vid ? '<video muted loop playsinline preload="none"' + (x.img ? ' poster="' + esc(x.img) + '"' : '') + ' data-src="' + esc(x.vid) + '"></video>' : x.img ? '<img src="' + esc(x.img) + '" alt="" decoding="async"' + (i < 12 ? '' : ' loading="lazy"') + '>' : '<img alt="">') + '<b>' + esc(x.t) + '</b><small>' + esc(x.h) + '</small></button>').join("");
  }
  function libHTML() {
    return '<h2>' + esc(T("全部剧目", "All stories")) + '</h2><p class="sub">' + esc(T("选一部开始：你说的话和做的选择都会改变结局。", "Pick a story — what you say and choose changes the ending.")) + '</p>' +
      '<div class="bar"><input type="search" id="pc-q" placeholder="' + esc(T("搜索剧名或关键词", "Search stories")) + '" value="' + esc(q) + '">' +
      [["all", "全部", "All"], ["bg", "男女", "M/F"], ["bl", "男男", "M/M"], ["gl", "女女", "F/F"]].map(c => '<button class="chip' + (filter === c[0] ? " on" : "") + '" data-pcf="' + c[0] + '">' + esc(T(c[1], c[2])) + '</button>').join("") +
      '</div><div class="grid" id="pc-grid">' + gridHTML() + '</div>';
  }
  const okLang = w => { try { const c = typeof CL === "function" ? CL() : "en"; const L = Array.isArray(w.langs) ? w.langs : []; return !L.length || L.indexOf(c) >= 0 || (w.lang || "zh") === c; } catch (_) { return true; } };
  async function loadComm() {
    if (Date.now() - commAt < 120000) return;
    commAt = Date.now();
    const seen = new Set(), all = [];
    for (const f of ["featured", "new"]) {
      try { const r = await fetch("/api/works?feed=" + f + "&limit=50&alllang=1"); if (r.ok) { const j = await r.json(); (j.works || []).forEach(w => { if (!w.adult && !seen.has(w.id)) { seen.add(w.id); all.push(w); } }); } } catch (_) {}
    }
    comm = all;
    const g = document.getElementById("pc-grid"); if (g) { g.innerHTML = gridHTML(); wire(); }
  }
  /* 作品 → 预告视频：首页卡片上的 video[data-src] + 官方剧缓存里的 home_video / vid_open / opening_video */
  function vidMap() {
    const m = {};
    try { const off = JSON.parse(localStorage.getItem("miru_off94_v1") || "{}"); (off.L || []).forEach(w => { const A = w.A || {}; const v = A.home_video || A.vid_open || A.opening_video; if (v) m[w.id] = v; }); } catch (_) {}
    document.querySelectorAll("#dev video[data-src]").forEach(v => { const c = v.closest("[data-off94]"); if (c && !m[c.dataset.off94]) m[c.dataset.off94] = v.dataset.src; });
    return m;
  }
  const absU = u => !u ? "" : /^https?:/.test(u) ? u : "/" + String(u).replace(/^\/+/, "");
  let io = null;
  function wire() {
    const g = document.getElementById("pc-grid"); if (!g) return;
    if (!io && "IntersectionObserver" in window) io = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { if (!v.src && v.dataset.src) v.src = v.dataset.src; const p = v.play(); if (p && p.catch) p.catch(() => {}); } else { try { v.pause(); } catch (_) {} } }), { root: document.getElementById("pc-lib"), threshold: 0.45 });
    g.querySelectorAll("video[data-src]").forEach(v => { if (io) io.observe(v); });
  }
  /* App 里的作品卡（发现页横排等）：PC 上鼠标移上去就播预告，移开停 */
  let hv = false;
  function hoverVid() {
    if (hv) return; hv = true;
    document.addEventListener("mouseover", e => {
      if (!document.documentElement.classList.contains("pc195")) return;
      const c = e.target.closest && e.target.closest("#dev [data-off94]"); if (!c || c.querySelector("video") || c.__pcv) return;
      const img = c.querySelector("img"); const u = absU(vidMap()[c.dataset.off94]); if (!img || !u) return;
      c.__pcv = 1; const box = img.parentElement; if (getComputedStyle(box).position === "static") box.style.position = "relative";
      const v = document.createElement("video"); v.muted = true; v.loop = true; v.playsInline = true; v.src = u; v.className = "pcv195";
      v.style.cssText = "position:absolute;left:" + img.offsetLeft + "px;top:" + img.offsetTop + "px;width:" + img.offsetWidth + "px;height:" + img.offsetHeight + "px;object-fit:cover;border-radius:inherit;pointer-events:none;z-index:1";
      box.appendChild(v); const p = v.play(); if (p && p.catch) p.catch(() => {});
      const leave = () => { c.removeEventListener("mouseleave", leave); try { v.pause(); } catch (_) {} v.remove(); c.__pcv = 0; };
      c.addEventListener("mouseleave", leave);
    });
  }
  function syncNav() {
    const cur = (document.querySelector("#dev .tabbar [data-tab].on") || {}).dataset;
    document.querySelectorAll("#pc-side [data-pcnav]").forEach(b => b.classList.toggle("on", !!cur && b.dataset.pcnav === cur.tab));
  }
  function build() {
    if (built) return; built = true;
    const st = document.createElement("style"); st.id = "pc195css"; st.textContent = css; document.head.appendChild(st);
    const side = document.createElement("aside"); side.id = "pc-side"; side.setAttribute("data-notr", ""); document.body.appendChild(side);
    const lib = document.createElement("aside"); lib.id = "pc-lib"; document.body.appendChild(lib);
    lib.addEventListener("input", e => { if (e.target.id === "pc-q") { q = e.target.value; const g = document.getElementById("pc-grid"); if (g) { g.innerHTML = gridHTML(); wire(); } } });
    lib.addEventListener("click", e => { const c = e.target.closest("[data-pcf]"); if (c) { filter = c.dataset.pcf; lib.innerHTML = libHTML(); wire(); } });
    document.addEventListener("click", () => setTimeout(syncNav, 60));
    let lang = null; setInterval(() => { try { const l = typeof CL === "function" ? CL() : ""; if (l !== lang) { lang = l; side.innerHTML = sideHTML(); lib.innerHTML = libHTML(); wire(); syncNav(); } } catch (_) {} }, 1500);
  }
  function apply() {
    const on = matchMedia("(pointer:fine)").matches && innerWidth >= 1100;
    document.documentElement.classList.toggle("pc195", on);
    if (on) { build(); const side = document.getElementById("pc-side"), lib = document.getElementById("pc-lib"); if (side && !side.innerHTML) side.innerHTML = sideHTML(); if (lib && !lib.innerHTML) { lib.innerHTML = libHTML(); wire(); } syncNav(); loadComm(); hoverVid(); }
  }
  addEventListener("resize", () => { clearTimeout(apply._t); apply._t = setTimeout(apply, 200); });
  if (document.readyState === "loading") addEventListener("DOMContentLoaded", () => setTimeout(apply, 300)); else setTimeout(apply, 300);
  window.__pc195 = () => ({ on: document.documentElement.classList.contains("pc195"), items: items().length });
})();

/* ===== mod196 · 2026-11-26 日 / 韩 / 西语：读预先翻好的全文 =====
   作品包里有 pack.script_ja / script_ko / script_es 时（后台剧本 config.ja_sid 等），
   和英文版一样在装作品时合进去：章节正文 beats[ja|ko|es]、章节标题 / 目标、选项和选项后的剧情。
   Lz() 本来就按 S.lang 取 o.ja / o.ko / o.es，没有就回落英文——所以有译本的剧直接显示原生译文，没有的照旧。 */
(function () {
  "use strict";
  if (typeof off94MergeEn !== "function" || typeof imParse !== "function") return;
  const LANGS = ["ja", "ko", "es"];
  function mergeL(wid, P, LG) {
    const src = P && P["script_" + LG]; const wz = wd(wid); if (!wz || !src || !wz.pack || !wz.pack.chapters) return;
    const lang0 = S.lang; let tmp = null;
    try {
      S.lang = "en";
      const doc = imParse(src); if (!doc.chapters.length) return;
      tmp = imBuild(doc, (P.meta || {}).as || doc.pov); const we = wd(tmp && (tmp.wid || tmp)); if (!we) return;
      const key = id => { const c = ch(id); return c && c.n94 ? c.n94.zh : c && c.n; };
      const zid = {}; wz.cast.forEach(id => { zid[key(id)] = id; });
      let js = JSON.stringify(we.pack.chapters);
      we.cast.forEach(id => { const z = zid[key(id)]; if (z) js = js.split('"' + id + '"').join('"' + z + '"'); });
      const ce = JSON.parse(js);
      if (ce.length !== wz.pack.chapters.length) return;
      wz.pack.chapters.forEach((c, i) => {
        const e = ce[i]; c.beats[LG] = e.beats.zh;
        ["t", "goal", "ask", "place", "time"].forEach(k => { if (c[k] && e[k] && typeof c[k] === "object") c[k][LG] = e[k].zh || e[k].en; });
        (c.choices || []).forEach((o, j) => { const oe = (e.choices || [])[j]; if (!oe) return;
          if (o.t && typeof o.t === "object" && oe.t) o.t[LG] = oe.t.zh || oe.t.en;
          if (o.then && oe.then && !Array.isArray(o.then)) o.then[LG] = oe.then.zh;
          if (o.mem && oe.mem && typeof o.mem === "object") o.mem[LG] = oe.mem.zh || oe.mem.en; });
      });
      const m = (P.meta || {})[LG] || {};
      ["title", "hook", "premise", "you"].forEach(k => { if (!m[k] || !wz[k]) return; if (typeof wz[k] === "string") wz[k] = { zh: wz[k], en: wz[k] }; wz[k][LG] = m[k]; });
      try { const fn = L => ((((wz.pack.chapters[0] || {}).beats || {})[L] || []).find(b => Array.isArray(b) && b[0] === "n") || [, , ""])[2]; const P2 = wz.pack;
        const t = fn(LG); if (t && P2.intro && P2.intro.en) P2.intro[LG] = Object.assign({}, P2.intro.en, { bg: [String(t).slice(0, 80)] });
        const te = fn("en"); if (te && P2.intro && P2.intro.en && !P2.intro.en.fixed196) { P2.intro.en = Object.assign({}, P2.intro.en, { bg: [String(te).slice(0, 80)], fixed196: 1 }); } } catch (_) {}
      wz["l196_" + LG] = 1;
    } catch (e) { try { console.warn("[mod196]", LG, e); } catch (_) {} }
    finally {
      S.lang = lang0;
      try { if (tmp) { const we = wd(tmp.wid || tmp); if (we) { (we.cast || []).forEach(id => { delete S.mine.chars[id]; delete S.art[id]; }); delete S.mine.worlds[we.id]; } S.works = (S.works || []).filter(x => x.id !== (tmp.wid || tmp)); } } catch (_) {}
      try { off94Names(); } catch (_) {} try { save(); } catch (_) {}
    }
  }
  const prev = off94MergeEn;
  off94MergeEn = function (wid, P) { const r = prev.apply(this, arguments); try { LANGS.forEach(LG => mergeL(wid, P, LG)); } catch (_) {} return r; };
  window.__mod196 = 1;
})();

/* ===== mod197 · 2026-11-26 创作向导补全 =====
   用户的「AI 引导创作」对齐后台编剧工作台：素材页九种素材都能选怎么准备（新增关键事件插图的 AI 生成 / 上传，配乐、音色、来电语音、特效自动配），
   专业度高的问题前面放「交给 AI 安排」，生成时带上 MIRU 专业写作规范，总览页加「上线前自检」。
   做法：把补丁脚本追加到创作中心页面（CREATOR_HTML）末尾，覆盖页面里的同名函数，不改原文件。 */
(function () {
  "use strict";
  const CODE = "(function(){try{\n/* mod197 · 创作向导补全（2026-11-26）：素材页覆盖全部九种素材、关键事件插图可生成/上传、新手一键「交给 AI」、专业写作规范、上线前自检 */\nvar PROF='【MIRU 专业写作规范】每一场都要有正在发生的事件和一个可感知的冲突；人物各有想要的东西和代价，不全都围着主角争抢；对白口语化、短句、带动作，不写说明书式台词；每次选择都要改变后续（关系、线索、站位或结局），不能只换一句话；章末留钩子；所有角色是成年人，亲密只在双方明确同意时发生，玩家说不就停；不剧透真凶和反转；每章至少一个可视化场景描述（地点、光线、道具）方便出图。';\ntry{if(p&&p.aiRoleRules){Object.keys(p.aiRoleRules).forEach(function(k){var v=String(p.aiRoleRules[k]||'');if(v.indexOf('MIRU 专业写作规范')<0)p.aiRoleRules[k]=v+(v?'\\n':'')+PROF})}}catch(_){}\n/* 1 · 新手友好：专业度高的问题前面放一个「交给 AI 安排」 */\nvar AUTO='✨ 交给 AI 安排（推荐）';\ntry{steps.forEach(function(s){if(['narration','trigger','gameplay','branches','interactions','release','archetype','relationships'].indexOf(s.key)>=0&&s.chips&&s.chips.indexOf(AUTO)<0){s.chips.unshift(AUTO);s.desc=(s.desc||'')+' 拿不准就选第一个，AI 会按你的题材和人物配好。'}})}catch(_){}\n/* 2 · 素材：九种素材全部能选怎么准备 */\nObject.assign(MKEYS,{cg:['📷','关键事件插图'],bgm:['🎵','背景音乐'],voice:['🎙️','角色音色'],phone:['📞','电话语音'],fx:['✨','过场特效']});\nvar PLAN={video:/视频/,cover:/封面/,bg:/背景/,face:/立绘|形象/,voice:/音色/,bgm:/音乐/,phone:/电话/,fx:/特效/,cg:/插图/};\nfunction planText(){try{var i=steps.findIndex(function(s){return s.key==='visual'});var a=String((i>=0&&wizard.answers[i])||'')+' '+((wizard.selections&&wizard.selections.visual)||[]).join(' ')+' '+(p.mediaPlan||[]).join(' ');return a}catch(_){return ''}}\nfunction wants(k){if(k==='bg'||k==='cover'||k==='face')return true;var t=planText();if(!t.trim()||/跳过/.test(t))return k==='video';return PLAN[k].test(t)}\nfunction cgSlots(){var sc=mScenes();return sc.filter(function(x,i){return i%2===0||i===sc.length-1})}\nvar _store=mStore;mStore=function(){var m=_store();m.cgs=m.cgs||{};return m};\nvar _src=mSrc;mSrc=function(){var s=_src();if(!s.cg)s.cg='ai';if(!s.bgm)s.bgm='auto';if(!s.voice)s.voice='auto';if(!s.phone)s.phone='auto';if(!s.fx)s.fx='auto';return s};\nmSummary=function(){var s=mSrc(),L={ai:'AI 生成',up:'自己上传',later:'稍后',auto:'自动配',off:'不需要'};return Object.keys(MKEYS).filter(wants).map(function(k){return MKEYS[k][1]+'：'+(L[s[k]]||'稍后')})};\nvar _put=mPut;mPut=function(kind,id,src){if(kind==='cg'){mStore().cgs[id]=src;return}return _put(kind,id,src)};\nvar _del=mDel;mDel=function(kind,id){if(kind==='cg'){delete mStore().cgs[id];return}return _del(kind,id)};\nvar _ctx=mCtx;mCtx=function(kind,id){if(kind==='cg'){var n=mScenes().find(function(x){return x.id===id})||{};var cast=mCast().map(function(c){return c.name+'（'+(c.role||'')+'）'}).join('、');return {kind:'bg',title:(n.title||'')+' · 关键剧情时刻',text:'剧情插图：'+(n.text||'')+'。画面里有人物正在做这件事（'+cast+'），电影感构图，第一人称视角，情绪明确',world:p.world,style:p.imageStyle,genre:p.genre}}return _ctx(kind,id)};\nvar _price=mPrice;mPrice=function(k){return _price(k==='cg'?'bg':k)};\nvar _gen=mGen;mGen=async function(spec){var a=spec.split(':');if(a[0]!=='cg')return _gen(spec);if(MBUSY[spec])return;var B=MB();if(!B.genP)return toast('请在 MIRU 里打开创作中心');MBUSY[spec]=1;render();var r=await B.genP('bg',mCtx('cg',a[1]));delete MBUSY[spec];if(r&&r.src){mPut('cg',a[1],r.src);save();render();toast('✓ 已生成 · 扣 💎'+r.cost)}else{render();toast(r&&r.err==='nogems'?'钻石不足，回 MIRU 充值':'AI 绘图暂时没连上，没有扣费，可以先自己上传')}};\nvar _cnt=mCount;mCount=function(){var c=_cnt(),m=mStore(),cs=cgSlots();c.cg=[cs.filter(function(x){return m.cgs[x.id]}).length,cs.length];return c};\nvar _miss=mMissing;mMissing=function(){var L=_miss(),s=mSrc(),m=mStore();if(wants('cg')&&s.cg==='ai')cgSlots().forEach(function(x){if(!m.cgs[x.id])L.push('cg:'+x.id)});return L};\nvar OPTS={bg:['up','ai','later'],cover:['up','ai','later'],face:['up','ai','later'],cg:['up','ai','later'],video:['ai','later'],bgm:['auto','later'],voice:['auto','later'],phone:['auto','off'],fx:['auto','off']};\nvar LBL={up:'📤 自己上传',later:'稍后',auto:'✓ 自动配（免费）',off:'不需要'};\nvar DESC={cover:'发现页和分享卡片上的封面',video:'先出分镜脚本，发布后制作',bgm:'按每章情绪从曲库自动配乐；上线后也能在作品页换成自己的音乐',voice:'按人物性别、年龄和性格自动分配声音，读者点播就能听',phone:'剧情来电用角色音色读出来',fx:'心动、雨夜、反转等时刻自动加轻量特效'};\nmediaStepHTML=function(){var s=mSrc();wizard.selections.mediaSrc=mSummary();var sc=mScenes(),cast=mCast(),cnt=mCount(),cs=cgSlots();\n var keys=Object.keys(OPTS).filter(wants);\n var rows=keys.map(function(k){var v=s[k],n=k==='bg'?sc.length:k==='face'?cast.length:k==='cg'?cs.length:1,pr=k==='video'?30:(OPTS[k].indexOf('ai')>=0?mPrice(k)*n:0),c=cnt[k];\n  var d=k==='bg'?sc.length+' 个场景各一张，剧情切到哪个场景就换哪张':k==='face'?cast.map(function(x){return x.name}).join('、'):k==='cg'?cs.length+' 个关键时刻各一张插图（告白、反转、结局等）':DESC[k];\n  var btns=OPTS[k].map(function(o){return '<button data-msrc=\"'+k+'|'+o+'\" class=\"'+(v===o?'on':'')+'\">'+(o==='ai'?'✨ AI 生成 · '+(pr?'💎'+pr:'免费'):LBL[o])+'</button>'}).join('');\n  var up=v==='up'&&k!=='video'&&OPTS[k].indexOf('up')>=0?(k==='cg'?'<label class=\"mup\">📤 选择插图（可多选，按顺序对应关键时刻）<input type=\"file\" accept=\"image/*\" multiple data-mupcg=\"1\" hidden></label>':'<label class=\"mup\">📤 选择图片'+(k==='cover'?'':'（可多选，按顺序对应'+(k==='bg'?'场景':'角色')+'）')+'<input type=\"file\" accept=\"image/*\" '+(k==='cover'?'':'multiple')+' data-mup=\"'+k+'\" hidden></label>'):'';\n  return '<div class=\"mrow\"><div class=\"mhd\"><b>'+MKEYS[k][0]+' '+MKEYS[k][1]+'</b>'+(c?'<em>'+c[0]+'/'+c[1]+'</em>':'')+'<small>'+esc(d||'')+'</small></div><div class=\"mseg\">'+btns+'</div>'+up+'</div>'}).join('');\n var hidden=Object.keys(OPTS).filter(function(k){return !wants(k)}).map(function(k){return MKEYS[k][1]});\n return '<div class=\"mstep\">'+rows+'<p class=\"mnote\">选「AI 生成」的，在「素材」页一键生成或逐张生成，成功才扣钻石；随时可以换成自己上传。'+(hidden.length?'<br>没出现的（'+hidden.join('、')+'）是上一步没勾的，回上一步勾上就会出现。':'')+'</p></div>'};\ndocument.addEventListener('change',async function(e){if(!e.target.dataset||!e.target.dataset.mupcg)return;var files=[].slice.call(e.target.files||[]);if(!files.length)return;var m=mStore(),slots=cgSlots().map(function(x){return x.id}),free=slots.filter(function(x){return !m.cgs[x]}).concat(slots.filter(function(x){return m.cgs[x]})),n=0;try{for(var i=0;i<files.length&&i<free.length;i++){mPut('cg',free[i],await mShrink(files[i],720));n++}save();render();toast('已上传 '+n+' 张插图')}catch(_){toast('这张图读不出来，换一张试试')}});\n/* 素材页：加「关键事件插图」区 */\nvar _av=assetsView2;assetsView2=function(){var h=_av();if(!wants('cg'))return h;var m=mStore(),cs=cgSlots(),c=mCount().cg;var sec='<div class=\"sectionTitle\">📷 关键事件插图 <em class=\"mcnt\">'+c[0]+'/'+c[1]+'</em></div><p class=\"mnote\">告白、反转、结局这些时刻各一张，读到那里自动弹出。</p><label class=\"btn full mupall\">📤 批量上传插图<input type=\"file\" accept=\"image/*\" multiple data-mupcg=\"1\" hidden></label><div class=\"mlist\">'+cs.map(function(x){return mCard('cg',x.id,x.title,x.text,m.cgs[x.id])}).join('')+'</div>';var at=h.indexOf('<div class=\"sectionTitle\">🎬 视频');return at>0?h.slice(0,at)+sec+h.slice(at):h+sec};\n/* 3 · 上线前自检（和后台的自动检查同一套思路：能不能播、缺什么） */\nfunction preflight(){var L=[],st=null;try{st=getStory()}catch(_){}var sc=mScenes(),m=mStore(),cnt=mCount(),s=mSrc();\n function add(ok,txt,fix){L.push([ok,txt,fix])}\n add(!!(p.title&&String(p.title).trim()),'作品标题','回「故事灵感」补一个标题');\n add(!!(p.hook&&String(p.hook).trim()),'一句话简介（发现页卡片上显示）','在「故事编辑」里写一句话卖点');\n add(!!(p.lead&&p.lead.name&&p.lead.personality),'主要角色有名字和性格','回「人物关系」补充');\n add(sc.length>=3,'至少 3 个场景（现在 '+sc.length+' 个）','让 AI 生成大纲，或在专业版加场景');\n add(!!(p.conflict&&String(p.conflict).trim()),'核心矛盾','回「世界剧情」写一句谁想要什么');\n add(!!(p.ending||p.endingMode),'结局方向','回「结局发布」选一个');\n add(cnt.bg[0]>=sc.length||s.bg==='ai','每个场景都有背景（已有 '+cnt.bg[0]+'/'+sc.length+'）','去「素材」页一键生成或上传');\n add(!!(m.cover&&m.cover.src)||s.cover==='ai','封面','去「素材」页生成或上传封面');\n try{var v=typeof validateStory==='function'?validateStory(st):null;var errs=v&&(v.errors||v.err||[]);if(errs&&errs.length)add(false,'剧情结构：'+String(errs[0]).slice(0,60),'在专业版「检查」里逐条修');else add(true,'剧情结构（分支能走到结局）','')}catch(_){}\n return L}\nvar _view=view;view=function(){var h=_view();try{var step=steps[wizard.step];if(tab==='guide'&&step&&step.type==='review'){var L=preflight(),bad=L.filter(function(x){return !x[0]}).length;var card='<div class=\"reviewCard\" style=\"border-color:'+(bad?'#e6a23c':'#5bb98c')+'\"><div class=\"row\"><b>✅ 上线前自检</b><span class=\"pill\">'+(bad?bad+' 项待补':'全部通过')+'</span></div>'+L.map(function(x){return '<div><span>'+(x[0]?'✓':'○')+' '+esc(x[1])+'</span>'+(x[0]?'':'<p>'+esc(x[2])+'</p>')+'</div>'}).join('')+'<p class=\"mnote\">'+(bad?'没补齐也可以先保存草稿；补齐后上线，读者体验更完整。':'可以发布了。')+'</p></div>';var at=h.indexOf('<div class=\"reviewCards\">');if(at>0)h=h.slice(0,at)+card+h.slice(at)}}catch(_){}return h};\ntry{render()}catch(_){}\n}catch(e){try{console.warn('[mod197]',e)}catch(_){}}})();\n";
  /* 创作中心的主脚本是一个 IIFE（内部函数外面拿不到），所以补丁插进它内部、最后那句 render() 之前 */
  const KEY = "render();window.__cr={";
  const patch = h => { if (typeof h !== "string" || h.indexOf("mod197 · 创作向导补全") >= 0) return h; const i = h.lastIndexOf(KEY); return i > 0 ? h.slice(0, i) + CODE + h.slice(i) : h; };
  if (typeof window.CREATOR_HTML === "string") window.CREATOR_HTML = patch(window.CREATOR_HTML);
  let cur = window.CREATOR_HTML;
  try { Object.defineProperty(window, "CREATOR_HTML", { configurable: true, get() { return cur; }, set(v) { cur = patch(v); } }); } catch (_) {}
  window.__mod197 = 1;
})();
