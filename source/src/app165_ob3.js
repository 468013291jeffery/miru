/* ===== app165 · 2026-11-28 新手先导页重做：三屏（名字 → 口味 → 为你选的第一部剧） =====
   老板：「你可以做个看看，万一不好我还可以改回来，一定要做得好看、炫酷，符合美国女人的审美。」
   以前的流程：登录墙 → 欢迎页 + 勾 18 岁 → 选 BL/GL/BG → 一整页标签问卷 → 推荐页。
   问题：一上来就是登录墙；问卷像填表；最后的推荐页用的是老剧库（packWorlds，现在是空的），新用户看到的是空页。
   现在（只对还没走完新手流程的新用户生效，S.ob 为真的老用户完全不受影响）：
     ① 名字：「每个故事都需要一位主角，就是你」——输入名字，角色当场用你的名字跟你说话；勾选 18 岁。
     ② 口味：8 张带剧照的大卡片（宿敌变恋人 / 危险的男人 / 吸血鬼与狼族 / 王冠与宫廷 …），最多选 3 个；恋爱对象可选。
     ③ 揭晓：「选角中…」动画 → 整屏剧照揭晓为你选的那部剧（从首页正在展示的官方剧里按口味挑），
        点「开始第 1 章」→ 没登录就在这一步登录（登录是硬性要求，没改，只是从第一屏挪到最后一步），登录完直接进这部剧。
   不编造评分、人数、用户评价。首页视频文字样式没有动。
   预览：已登录的老用户打开 miru.plus/?ob3=1 可以完整走一遍（预览模式不保存任何东西）。
   关闭：把 build.py 里 app165_ob3.js 那一行去掉即可恢复原流程；或临时在控制台执行 localStorage.miru_ob3_off="1"。 */
(function () {
  "use strict";
  if (typeof renderOB !== "function" || typeof screen !== "function" || typeof off94Feed !== "function") return;
  const off = () => { try { return localStorage.getItem("miru_ob3_off") === "1"; } catch (_) { return false; } };
  const zh = () => { try { return CL() === "zh"; } catch (_) { return false; } };
  const L = (e, z) => (zh() ? z : e);
  const logged = () => { try { return au70Loggedin(); } catch (_) { return false; } };
  const tk = (n, p) => { try { if (!ST.dry && typeof track === "function") track(n, p || {}); } catch (_) {} };

  const TASTES = [
    { k: "enemies", e: "Enemies to Lovers", z: "宿敌变恋人", rx: /enemies|rivals|revenge|villain|reject/i, tag: "Enemies to Lovers" },
    { k: "dark", e: "Dark & Dangerous", z: "危险的男人", rx: /mafia|dark romance|morally|possessive|touch her|villain|killer|forbidden/i, tag: "Forbidden" },
    { k: "fang", e: "Vampires & Wolves", z: "吸血鬼与狼族", rx: /vampire|werewol|wolf|fated|dragon|paranormal|gothic|gods/i, tag: "Fated Mates" },
    { k: "royal", e: "Crowns & Courts", z: "王冠与宫廷", rx: /royal|crown|prince|castle|secret heir|villainess/i, tag: "Arranged Marriage" },
    { k: "slow", e: "Slow Burn", z: "慢热心动", rx: /slow burn|pining|small town|slice of life|hurt\/comfort/i, tag: "Slow Burn" },
    { k: "choose", e: "Why Choose?", z: "全都想要", rx: /why choose|triangle/i, tag: "Why Choose" },
    { k: "secret", e: "Secrets & Suspense", z: "秘密与悬疑", rx: /suspense|mystery|hidden identity|secret/i, tag: "Hidden Identity" },
    { k: "star", e: "Second Chances", z: "破镜重圆", rx: /second chance|divorce|ex\b|reborn|remember/i, tag: "Second Chance" }
  ];
  const ST = { step: 1, name: "", age: false, picks: [], or: "all", pick: "", dry: false, shown: false };

  /* ---------- 剧库：首页正在展示的官方剧（off94Feed，和首页短剧流同一份；有真实封面、英文标题和标签） ----------
     2026-11-28 第二版：第一版用的 allWorlds() 里大多是没有封面的旧条目，线上图片全是裂的；改成首页同一份剧单。
     封面图很大（每张 2–3 MB），所以整套先导页只用 8 张（口味卡片那 8 张，第一屏背景复用同一批）。 */
  let FEED = [], feedP = null;
  const cjk = x => /[一-鿿]/.test(x || "");
  function norm(raw) {
    const A = raw.A || {};
    const names = Object.keys(A).filter(k => /^char_[a-z]{3,12}$/.test(k)).slice(0, 3).map(k => k.slice(5, 6).toUpperCase() + k.slice(6));
    return {
      id: raw.id, raw, or: raw.orient || "bg", tags: raw.tags || [], cover: A.cover || A.poster || "", cast: names,
      get title() { try { return off94Title(raw) || ""; } catch (_) { return raw.title || ""; } },
      get hook() { try { return off94Hook(raw) || ""; } catch (_) { return raw.hook || ""; } }
    };
  }
  /* 2026-11-28 老板：口味卡片按平台现有的标签来。改成直接统计首页剧单里用得最多的 8 个标签（不含「Romance / Drama」这种太泛的），
     名字用平台自己的标签译名（tagName），选中后就按这个标签找剧；剧单没加载出来时才用上面那 8 个备用分类。 */
  const tn = x => { try { return (typeof tagName === "function" && tagName(x)) || x; } catch (_) { return x; } };
  const lab = x => (x.tg ? tn(x.tag) : L(x.e, x.z));
  const hit = (x, w) => (x.tg ? w.tags.some(t => String(t).toLowerCase() === x.tg) : x.rx.test(wtxt(w)));
  function dynTastes() {
    const cnt = new Map();
    FEED.forEach(w => { if (w.or !== "bg") return; new Set(w.tags.map(t => String(t).trim()).filter(Boolean)).forEach(t => { const k = t.toLowerCase(); if (/^(romance|drama)$/.test(k)) return; const o = cnt.get(k) || { tag: t, n: 0 }; o.n++; cnt.set(k, o); }); });
    const top = [...cnt.entries()].filter(e => e[1].n >= 2).sort((a, b) => b[1].n - a[1].n).slice(0, 8);
    if (top.length < 6) return;
    TASTES.splice(0, TASTES.length, ...top.map((e, i) => ({ k: "t" + i, tg: e[0], tag: e[1].tag })));
    TILE = null; ST.picks = [];
  }
  function loadFeed() {
    if (feedP) return feedP;
    feedP = (async () => { try { const L0 = await off94Feed(); FEED = (L0 || []).map(norm).filter(w => w.cover); } catch (_) { FEED = []; } try { dynTastes(); } catch (_) {} if (!FEED.length) feedP = null; return FEED; })();
    return feedP;
  }
  const wtxt = w => (w.tags.join(" ") + " " + ((w.raw.en && w.raw.en.title) || "") + " " + (w.raw.title || ""));
  const hookOf = w => { const h = w.hook; return (!zh() && cjk(h)) ? "" : h; };
  const cover = w => w.cover || "";
  /* 封面加载失败（个别剧的封面地址是坏的）：记下来不再用；口味卡片换一张别的封面，其他位置直接去掉这张图 */
  const BAD = new Set();
  const pool = () => FEED.filter(w => !BAD.has(w.cover));
  document.addEventListener("error", e => {
    const im = e.target; if (!im || im.tagName !== "IMG" || !im.closest || !im.closest(".ob3")) return;
    const src = im.getAttribute("src") || ""; if (!src || BAD.has(src)) { im.remove(); return; }
    BAD.add(src);
    const t = im.closest(".ob3t");
    if (t && TILE) { const used = Object.values(TILE), alt = pool().find(w => !used.includes(w.cover) && w.or === "bg"); if (alt) { TILE[t.dataset.ob3t] = alt.cover; im.src = alt.cover; return; } }
    im.remove();
  }, true);
  const orFit = w => ST.or === "all" || w.or === ST.or;
  function ranked() {
    const P = pool(), sel = TASTES.filter(x => ST.picks.includes(x.k));
    const seed = (ST.name + "|" + ST.picks.join(",")).split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    return P.map((w, i) => {
      const tx = wtxt(w), hits = sel.filter(x => hit(x, w));
      const sc = hits.length * 30 + (orFit(w) ? 60 : 0) + (ST.or === "all" && w.or === "bg" ? 8 : 0) + (hookOf(w) ? 8 : 0) + (w.raw.A && (w.raw.A.vid_open || w.raw.A.home_video) ? 5 : 0) + ((seed + i * 7919) % 7);
      return { w, sc, hits };
    }).sort((a, b) => b.sc - a.sc);
  }
  let TILE = null;
  function tileArt() {
    if (TILE && Object.keys(TILE).length) return TILE;
    const P = pool().filter(w => w.or === "bg" || w.or === "all"), used = new Set(), out = {};
    TASTES.forEach(x => {
      const c = P.filter(w => hit(x, w));
      const w = c.find(w => !used.has(w.id)) || P.find(w => !used.has(w.id)) || c[0] || P[0];
      if (w) { used.add(w.id); out[x.k] = cover(w); }
    });
    return (TILE = out);
  }
  const castOf = w => w.cast || [];
  const cname = x => x;

  /* ---------- 画面 ---------- */
  function bgHTML() {
    const TA = tileArt(), A = TASTES.map(x => TA[x.k]).filter(Boolean);
    if (A.length < 3) return '<div class="ob3bg"></div><div class="ob3sp">' + sparks() + '</div>';
    const col = i => { const c = A.filter((_, j) => j % 3 === i); return '<div class="c">' + c.concat(c).concat(c.length < 3 ? c.concat(c) : []).map(s => '<img src="' + esc(s) + '" alt="">').join("") + '</div>'; };
    return '<div class="ob3bg">' + col(0) + col(1) + col(2) + '</div><div class="ob3sp">' + sparks() + '</div>';
  }
  function sparks() { let h = ""; for (let i = 0; i < 16; i++) h += '<i style="left:' + ((i * 61 + 7) % 100) + '%;top:' + ((i * 37 + 11) % 92) + '%;animation-delay:' + ((i * 0.47) % 4).toFixed(2) + 's"></i>'; return h; }
  const dots = n => '<div class="ob3dots">' + [1, 2, 3].map(i => '<i class="' + (i === n ? "on" : i < n ? "done" : "") + '"></i>').join("") + '</div>';
  const nm = () => esc(ST.name || L("you", "你"));
  function sayText() {
    return ST.name ? L("“" + esc(ST.name) + ". I’ve been waiting for you.”", "「" + esc(ST.name) + "，我等你很久了。」") : L("“…and you are?”", "「……你是？」");
  }
  function s1() {
    const P = ranked(), w = (P[0] || {}).w, c = w ? castOf(w)[0] : null, av = w ? cover(w) : "";
    let lang = ""; try { lang = langPicker(); } catch (_) {}
    return '<div class="ob3 ob3s1">' + bgHTML() + '<div class="ob3in">' +
      '<div class="ob3top"><div class="ob3brand">MI<b>RU</b></div>' + lang + '</div>' +
      '<div class="ob3mid"><div class="ob3ey">✦ ' + L("Interactive romance", "互动恋爱剧") + '</div>' +
      '<h1 class="ob3h">' + L("Every story needs a lead.<br><i>It’s you.</i>", "每个故事都需要一位主角。<br><i>就是你。</i>") + '</h1>' +
      '<label class="ob3lab" for="ob3name">' + L("What should they call you?", "他们该怎么称呼你？") + '</label>' +
      '<input id="ob3name" class="ob3name" maxlength="24" autocomplete="given-name" autocapitalize="words" enterkeyhint="next" placeholder="' + L("Your name", "你的名字") + '" value="' + esc(ST.name) + '">' +
      '<div class="ob3say">' + (av ? '<img src="' + esc(av) + '" alt="">' : '') + '<div class="b">' + (c ? '<small>' + esc(cname(c)) + '</small>' : '') + '<span id="ob3sayT">' + sayText() + '</span></div></div></div>' +
      '<div class="ob3foot"><button type="button" class="ob3age' + (ST.age ? " on" : "") + '" id="ob3age"><span class="ck">' + (ST.age ? "✓" : "") + '</span><span>' + L("I’m 18 or older. Every character is a fictional adult.", "我已年满 18 岁。所有角色都是虚构的成年人。") + '</span></button>' +
      '<button type="button" class="ob3cta" id="ob3go1">' + L("That’s me", "就是我") + ' →</button>' + dots(1) +
      (!ST.dry && !logged() ? '<button type="button" class="ob3lnk" data-acct69="login">' + L("I already have an account", "我已经有账号") + '</button>' : '') + '</div></div></div>';
  }
  function s2() {
    const art = tileArt();
    const ors = [["all", L("Anyone", "都可以")], ["bg", "M/F"], ["bl", "M/M"], ["gl", "F/F"]];
    return '<div class="ob3 ob3s2"><div class="ob3glow"></div><div class="ob3in">' +
      '<div class="ob3top"><button type="button" class="ob3back" data-ob3back="1" aria-label="back">‹</button>' + dots(2) + '<span style="width:36px"></span></div>' +
      '<h1 class="ob3h sm">' + L("What makes your heart race, <i>" + nm() + "</i>?", "<i>" + nm() + "</i>，什么最让你心动？") + '</h1>' +
      '<p class="ob3sub">' + L("Pick up to 3. We’ll cast your first story.", "最多选 3 个，我们为你挑第一部剧。") + '</p>' +
      '<div class="ob3grid">' + TASTES.map((x, i) => '<button type="button" class="ob3t' + (ST.picks.includes(x.k) ? " on" : "") + '" data-ob3t="' + x.k + '" style="animation-delay:' + (0.05 * i).toFixed(2) + 's">' + (art[x.k] ? '<img src="' + esc(art[x.k]) + '" alt="" loading="lazy">' : '') + '<span class="v"></span><span class="ck">✓</span><b>' + esc(lab(x)) + '</b></button>').join("") +
      '<div class="ob3or"><span>' + L("Love interests", "恋爱对象") + '</span>' + ors.map(o => '<button type="button" data-ob3or="' + o[0] + '" class="' + (ST.or === o[0] ? "on" : "") + '">' + esc(o[1]) + '</button>').join("") + '</div></div>' +
      '<div class="ob3foot"><button type="button" class="ob3cta' + (ST.picks.length ? "" : " off") + '" id="ob3go2">' + L("Find my story", "为我选剧") + ' ✨</button>' +
      '<button type="button" class="ob3lnk" id="ob3skip2">' + L("Surprise me", "随便，给我惊喜") + '</button></div></div></div>';
  }
  function s3() {
    const R = ranked(); if (!R.length) return '<div class="ob3 ob3s3"><div class="ob3glow"></div><div class="ob3in" style="justify-content:center;align-items:center;gap:16px"><h1 class="ob3h sm">' + L("You’re in, <i>" + nm() + "</i>.", "欢迎你，<i>" + nm() + "</i>。") + '</h1><button type="button" class="ob3cta" data-ob3fin="">' + L("Enter MIRU", "进入 MIRU") + ' →</button></div></div>';
    const top = R.find(r => r.w.id === ST.pick) || R[0]; ST.pick = top.w.id;
    const w = top.w, cs = castOf(w).slice(0, 3), names = cs.map(cname).filter(Boolean), hook = hookOf(w);
    const wait = names.length ? L(names.length > 1 ? names.slice(0, -1).join(", ") + " & " + names[names.length - 1] + " are waiting for you." : names[0] + " is waiting for you.", names.join("、") + " 在等你。") : "";
    const hits = top.hits.map(lab);
    const alts = R.filter(r => r.w.id !== w.id && cover(r.w)).slice(0, 3);
    return '<div class="ob3 ob3s3"><div class="ob3hero ob3rev"><img src="' + esc(cover(w)) + '" alt=""><span class="v"></span></div><div class="ob3sp">' + sparks() + '</div><div class="ob3in">' +
      '<div class="ob3top"><button type="button" class="ob3back" data-ob3back="1" aria-label="back">‹</button>' + dots(3) + '<span style="width:36px"></span></div>' +
      '<div class="ob3fill"></div>' +
      '<div class="ob3badge">✦ ' + L("Cast for you, " + nm(), nm() + "，这部为你而选") + '</div>' +
      '<h2 class="ob3title">' + esc(w.title) + '</h2>' +
      (hook ? '<p class="ob3hook">“' + esc(hook) + '”</p>' : '') +
      (hits.length ? '<div class="ob3hits">' + hits.map(x => '<em>♥ ' + esc(x) + '</em>').join("") + '</div>' : '') +
      (cs.length ? '<div class="ob3castrow"><span>♡ ' + esc(wait) + '</span></div>' : '') +
      '<button type="button" class="ob3cta beat" data-ob3fin="' + esc(w.id) + '">▶ ' + L("Start Chapter 1", "开始第 1 章") + '<small>' + L("Free to start", "免费开始") + '</small></button>' +
      (alts.length ? '<div class="ob3alts"><span>' + L("Or try", "或者试试") + '</span><div>' + alts.map(r => '<button type="button" data-ob3alt="' + esc(r.w.id) + '"><img src="' + esc(cover(r.w)) + '" alt=""><b>' + esc(r.w.title) + '</b></button>').join("") + '</div></div>' : '') +
      '<button type="button" class="ob3lnk" data-ob3fin="">' + L("Show me everything", "先逛逛全部") + '</button></div></div>';
  }
  function casting() {
    const A = ranked().slice(0, 3).map(r => cover(r.w)).filter(Boolean);
    return '<div class="ob3 ob3load"><div class="ob3glow"></div><div class="ob3in" style="justify-content:center;align-items:center"><div class="ob3orb">' + A.map((s, i) => '<img src="' + esc(s) + '" alt="" style="animation-delay:' + (-i * 0.8) + 's">').join("") + '<b>✦</b></div><p class="ob3casting">' + L("Casting your story, " + nm() + "…", "正在为 " + nm() + " 选角……") + '</p></div></div>';
  }
  let castT = null;
  function draw(noLoader) {
    css(); ST.shown = true; clearTimeout(castT);
    if (!FEED.length) loadFeed().then(F => { try { if (!F.length || !ST.shown || !document.querySelector(".ob3")) return; if (ST.step === 1) { const b = document.querySelector(".ob3s1 .ob3bg"), h = document.createElement("div"); h.innerHTML = bgHTML(); if (b && h.firstChild) b.replaceWith(h.firstChild); const sy = document.querySelector(".ob3s1 .ob3say"); if (sy && !sy.querySelector("img")) { const w = (ranked()[0] || {}).w; if (w) { sy.insertAdjacentHTML("afterbegin", '<img src="' + esc(cover(w)) + '" alt="">'); const c = castOf(w)[0], bb = sy.querySelector(".b"); if (c && bb && !bb.querySelector("small")) bb.insertAdjacentHTML("afterbegin", "<small>" + esc(c) + "</small>"); } } } else if (!document.querySelector(".ob3load")) draw(true); } catch (_) {} });
    if (ST.step === 3 && !noLoader) {
      screen("s-ob", casting()); show("s-ob");
      castT = setTimeout(() => { if (ST.step === 3 && document.querySelector(".ob3load")) draw(true); }, 1700);
      return;
    }
    screen("s-ob", ST.step === 1 ? s1() : ST.step === 2 ? s2() : s3()); show("s-ob");
    tk("ob3_view", { step: ST.step });
    if (ST.step === 1) { const i = document.querySelector("#ob3name"); if (i) { i.addEventListener("input", () => { ST.name = i.value.trim().slice(0, 24); const s = document.querySelector("#ob3sayT"); if (s) s.innerHTML = sayText(); }); i.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); i.blur(); go1(); } }); } }
  }
  function go1() {
    const i = document.querySelector("#ob3name"); if (i) ST.name = i.value.trim().slice(0, 24);
    if (!ST.name) { if (i) { i.focus(); i.classList.remove("shake"); void i.offsetWidth; i.classList.add("shake"); } return; }
    if (!ST.age) { try { toast(L("Please confirm you’re 18 or older", "请先确认你已年满 18 岁")); } catch (_) {} const a = document.querySelector("#ob3age"); if (a) { a.classList.remove("shake"); void a.offsetWidth; a.classList.add("shake"); } return; }
    try { obAge = true; } catch (_) {}
    ST.step = 2; draw();
  }
  function authStep() {
    try { renderAuth70(); } catch (_) { return; }
    try {
      const h = document.querySelector("#s-ob h1"), p = h && h.nextElementSibling;
      if (h) h.innerHTML = L("One last step, " + nm() + ".", nm() + "，最后一步。");
      if (p) p.textContent = L("Sign in to save your story and start Chapter 1.", "登录后保存你的故事，马上开始第 1 章。");
    } catch (_) {}
  }
  function enter(id) {
    try { S.ob = true; save(); } catch (_) {}
    try { startApp(); } catch (_) {}
    openWork(id);
  }
  function openWork(id) {
    if (!id) return;
    setTimeout(async () => { try { toast(L("Opening your story…", "正在打开你的剧……")); const wid = await installWork(id); if (wid) { if (typeof openStory === "function") openStory(wid); else startSheet(wid); } } catch (_) {} }, 400);
  }
  function finish(id) {
    clearTimeout(castT);
    if (ST.dry) { ST.shown = false; try { startApp(); toast(L("Preview only — nothing was saved", "这是预览，没有保存任何内容")); } catch (_) {} return; }
    try {
      const p = persona(); if (p && ST.name) p.name = ST.name;
      S.tropes = TASTES.filter(x => ST.picks.includes(x.k)).map(x => x.tag);
      S.or = ST.or; S.tasteSet = true; S.langChosen = true;
      S.ob3 = { pick: id || "", at: Date.now() }; save();
    } catch (_) {}
    tk("ob3_done", { picks: ST.picks.join(","), or: ST.or, story: id ? 1 : 0 });
    if (logged()) { enter(id); return; }
    authStep();
  }

  document.addEventListener("click", e => {
    const el = e.target.closest && e.target.closest(".ob3"); if (!el) return;
    let x;
    if (e.target.closest("#ob3age")) { ST.age = !ST.age; const i = document.querySelector("#ob3name"); if (i) ST.name = i.value.trim().slice(0, 24); const a = document.querySelector("#ob3age"); a.classList.toggle("on", ST.age); a.querySelector(".ck").textContent = ST.age ? "✓" : ""; return; }
    if (e.target.closest("#ob3go1")) { go1(); return; }
    if (e.target.closest("[data-ob3back]")) { ST.step = Math.max(1, ST.step - 1); draw(true); return; }
    if ((x = e.target.closest("[data-ob3t]"))) {
      const k = x.dataset.ob3t, i = ST.picks.indexOf(k);
      if (i >= 0) ST.picks.splice(i, 1); else { if (ST.picks.length >= 3) { const old = ST.picks.shift(), o = document.querySelector('[data-ob3t="' + old + '"]'); if (o) o.classList.remove("on"); } ST.picks.push(k); }
      x.classList.toggle("on", ST.picks.includes(k));
      const b = document.querySelector("#ob3go2"); if (b) b.classList.toggle("off", !ST.picks.length);
      return;
    }
    if ((x = e.target.closest("[data-ob3or]"))) { ST.or = x.dataset.ob3or; document.querySelectorAll("[data-ob3or]").forEach(b => b.classList.toggle("on", b === x)); return; }
    if (e.target.closest("#ob3go2")) { if (!ST.picks.length) { try { toast(L("Pick at least one — or tap “Surprise me”", "至少选一个，或者点「给我惊喜」")); } catch (_) {} return; } ST.pick = ""; ST.step = 3; draw(); return; }
    if (e.target.closest("#ob3skip2")) { ST.pick = ""; ST.step = 3; draw(); return; }
    if ((x = e.target.closest("[data-ob3alt]"))) { ST.pick = x.dataset.ob3alt; draw(true); return; }
    if ((x = e.target.closest("[data-ob3fin]"))) { finish(x.dataset.ob3fin || ""); return; }
  });
  /* 第一屏右上角换语言后，重画这一屏 */
  document.addEventListener("click", e => { if (!(e.target.closest && e.target.closest("[data-lang],[data-lgpick]"))) return; setTimeout(() => { try { const ob = document.querySelector("#s-ob"); if (ST.shown && ob && !ob.hidden && !S.ob && !(S.ob3 && S.ob3.at)) draw(true); } catch (_) {} }, 60); });

  const R0 = renderOB;
  renderOB = function () {
    try {
      if (off() || S.ob) return R0.apply(this, arguments);
      if (S.ob3 && S.ob3.at) {
        if (logged()) { enter(S.ob3.pick || ""); return; }
        ST.name = ST.name || ((persona() || {}).name || ""); authStep(); return;
      }
      if (!ST.name) { try { ST.name = (persona() || {}).name || ""; } catch (_) {} }
      draw(true); return;
    } catch (err) { try { console.warn("[ob3]", err); } catch (_) {} return R0.apply(this, arguments); }
  };

  let cssOn = false;
  function css() {
    if (cssOn) return; cssOn = true;
    const st = document.createElement("style");
    st.textContent = [
'.ob3{position:absolute;inset:0;display:flex;flex-direction:column;overflow:hidden;background:#0b0610;color:#fff;-webkit-tap-highlight-color:transparent}',
'.ob3 button{font-family:inherit;cursor:pointer}',
'.ob3bg{position:absolute;inset:0;overflow:hidden;pointer-events:none}',
'.ob3bg .c{position:absolute;top:-6%;width:36%;display:flex;flex-direction:column;gap:10px;animation:ob3up 70s linear infinite;opacity:.6;will-change:transform}',
'.ob3bg .c:nth-child(1){left:-3%}.ob3bg .c:nth-child(2){left:32%;animation-duration:92s;animation-direction:reverse}.ob3bg .c:nth-child(3){left:67%;animation-duration:80s}',
'.ob3bg .c img{width:100%;aspect-ratio:3/4;object-fit:cover;border-radius:14px;display:block}',
'.ob3bg::after{content:"";position:absolute;inset:0;background:radial-gradient(120% 55% at 50% 0%,rgba(238,111,151,.30),transparent 62%),linear-gradient(180deg,rgba(11,6,16,.30) 0%,rgba(11,6,16,.72) 34%,#0b0610 66%)}',
'.ob3glow{position:absolute;inset:0;pointer-events:none;background:radial-gradient(90% 40% at 50% -6%,rgba(238,111,151,.34),transparent 70%),radial-gradient(70% 36% at 100% 100%,rgba(240,183,126,.14),transparent 70%)}',
'.ob3sp{position:absolute;inset:0;pointer-events:none}',
'.ob3sp i{position:absolute;width:3px;height:3px;border-radius:50%;background:#ffe6c8;box-shadow:0 0 8px 2px rgba(240,183,126,.75);opacity:0;animation:ob3tw 4s ease-in-out infinite}',
'.ob3in{position:relative;z-index:1;flex:1;min-height:0;display:flex;flex-direction:column;padding:calc(env(safe-area-inset-top,0px) + 14px) max(20px,env(safe-area-inset-right,0px)) calc(env(safe-area-inset-bottom,0px) + 16px) max(20px,env(safe-area-inset-left,0px))}',
'.ob3in>*{animation:ob3in .7s cubic-bezier(.2,.8,.2,1) both}',
'.ob3in>*:nth-child(2){animation-delay:.08s}.ob3in>*:nth-child(3){animation-delay:.16s}.ob3in>*:nth-child(4){animation-delay:.24s}.ob3in>*:nth-child(5){animation-delay:.3s}.ob3in>*:nth-child(n+6){animation-delay:.36s}',
'.ob3top{display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:36px;flex:none}',
'.ob3brand{font-family:Fraunces,Georgia,serif;font-size:24px;font-weight:700;letter-spacing:.18em}.ob3brand b{color:#EE6F97;font-weight:700}',
'.ob3back{width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.07);color:#fff;font-size:22px;line-height:1;display:grid;place-items:center;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}',
'.ob3dots{display:flex;gap:6px;justify-content:center;align-items:center}',
'.ob3dots i{width:6px;height:6px;border-radius:99px;background:rgba(255,255,255,.22);transition:all .3s}.ob3dots i.done{background:rgba(240,183,126,.6)}.ob3dots i.on{width:22px;background:linear-gradient(90deg,#F6C9A0,#EE6F97)}',
'.ob3mid{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:flex-end;padding-bottom:22px}',
'.ob3ey{font-size:11.5px;letter-spacing:.2em;text-transform:uppercase;color:#F0B77E;font-weight:600;margin-bottom:12px}',
'.ob3h{font-family:Fraunces,Georgia,"Songti SC","Noto Serif KR",serif;font-size:36px;line-height:1.08;font-weight:600;letter-spacing:-.01em;margin:0;text-wrap:balance}',
'.ob3h.sm{font-size:28px;margin-top:16px}',
'.ob3h i{font-style:italic;background:linear-gradient(100deg,#F6D3AE,#EE6F97 50%,#F6D3AE);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent;animation:ob3sh 5s linear infinite;padding-right:.08em}',
'.ob3sub{margin:8px 0 0;font-size:14px;color:rgba(255,255,255,.66);line-height:1.5}',
'.ob3lab{display:block;margin-top:26px;font-size:13px;color:rgba(255,255,255,.7)}',
'.ob3name{width:100%;margin-top:6px;background:transparent;border:0;border-bottom:1.5px solid rgba(255,255,255,.28);border-radius:0;color:#fff;font-family:Fraunces,Georgia,"Songti SC",serif;font-size:28px;padding:6px 0 10px;outline:none;caret-color:#F0B77E;transition:border-color .25s,box-shadow .25s}',
'.ob3name::placeholder{color:rgba(255,255,255,.3);font-style:italic}',
'.ob3name:focus{border-bottom-color:#F0B77E;box-shadow:0 12px 18px -14px rgba(240,183,126,.9)}',
'.ob3say{display:flex;gap:10px;align-items:flex-end;margin-top:20px;min-height:58px}',
'.ob3say img{width:42px;height:42px;border-radius:50%;object-fit:cover;object-position:50% 18%;flex:none;border:1.5px solid #F0B77E;box-shadow:0 0 0 3px rgba(240,183,126,.18)}',
'.ob3say .b{background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-radius:18px 18px 18px 6px;padding:9px 14px 10px;font-size:15px;line-height:1.4;max-width:84%}',
'.ob3say .b small{display:block;font-size:11px;color:#F0B77E;letter-spacing:.04em;margin-bottom:2px}',
'.ob3foot{flex:none;display:flex;flex-direction:column;gap:12px}',
'.ob3age{display:flex;gap:10px;align-items:center;text-align:left;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:11px 12px;color:rgba(255,255,255,.72);font-size:12.5px;line-height:1.4}',
'.ob3age .ck{flex:none;width:20px;height:20px;border-radius:6px;border:1.5px solid rgba(255,255,255,.4);display:grid;place-items:center;font-size:13px;font-weight:800;color:#2a0f1c;transition:all .2s}',
'.ob3age.on{border-color:rgba(240,183,126,.5)}.ob3age.on .ck{background:linear-gradient(135deg,#F6C9A0,#EE6F97);border-color:transparent}',
'.ob3cta{position:relative;overflow:hidden;flex:none;min-height:56px;width:100%;border-radius:999px;border:0;font-weight:700;font-size:16.5px;letter-spacing:.01em;color:#2a0f1c;background:linear-gradient(95deg,#F6C9A0,#EE6F97);box-shadow:0 12px 32px rgba(238,111,151,.45),inset 0 1px 0 rgba(255,255,255,.55);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px;transition:transform .15s,opacity .2s}',
'.ob3cta small{font-size:11px;font-weight:600;opacity:.72}',
'.ob3cta::after{content:"";position:absolute;top:0;bottom:0;left:-40%;width:34%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.55),transparent);transform:skewX(-18deg);animation:ob3shine 3.6s ease-in-out infinite}',
'.ob3cta:active{transform:scale(.97)}.ob3cta.off{opacity:.45;box-shadow:none}.ob3cta.off::after{display:none}',
'.ob3cta.beat{animation:ob3in .7s cubic-bezier(.2,.8,.2,1) both,ob3beat 2.4s ease-in-out 1s infinite}',
'.ob3lnk{background:none;border:0;color:rgba(255,255,255,.62);font-size:13px;padding:6px;text-decoration:underline;text-underline-offset:3px;align-self:center}',
'.ob3grid{flex:1;min-height:0;overflow-y:auto;display:grid;grid-template-columns:1fr 1fr;grid-auto-rows:max-content;gap:10px;align-content:start;margin:16px -4px 12px;padding:4px;scrollbar-width:none}.ob3grid::-webkit-scrollbar{display:none}',
'.ob3t{position:relative;height:132px;border-radius:18px;overflow:hidden;border:1.5px solid rgba(255,255,255,.1);padding:0;background:linear-gradient(135deg,#2a1830,#150d1c);color:#fff;text-align:left;transition:transform .2s,border-color .2s,box-shadow .25s;animation:ob3pop .5s cubic-bezier(.2,.8,.2,1) both}',
'.ob3t img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 22%;transition:transform .5s}',
'.ob3t .v{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,6,16,0) 30%,rgba(11,6,16,.86) 100%)}',
'.ob3t b{position:absolute;left:12px;right:10px;bottom:10px;font-family:Fraunces,Georgia,"Songti SC",serif;font-size:17px;line-height:1.15;font-weight:600;text-shadow:0 1px 8px rgba(0,0,0,.6)}',
'.ob3t .ck{position:absolute;top:9px;right:9px;width:24px;height:24px;border-radius:50%;display:grid;place-items:center;font-size:13px;font-weight:800;color:#2a0f1c;background:linear-gradient(135deg,#F6C9A0,#EE6F97);transform:scale(0);transition:transform .25s cubic-bezier(.3,1.6,.5,1)}',
'.ob3t.on{border-color:#F0B77E;box-shadow:0 0 0 2px rgba(240,183,126,.35),0 12px 28px rgba(238,111,151,.38)}.ob3t.on img{transform:scale(1.08)}.ob3t.on .ck{transform:scale(1)}',
'.ob3or{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:6px;font-size:13px;color:rgba(255,255,255,.66)}',
'.ob3or span{width:100%}',
'.ob3or button{border-radius:999px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);color:#fff;font-size:13.5px;padding:8px 14px}',
'.ob3or button.on{border-color:#F0B77E;background:rgba(240,183,126,.16);color:#F6D3AE}',
'.ob3hero{position:absolute;inset:0;overflow:hidden}',
'.ob3hero img{width:100%;height:100%;object-fit:cover;object-position:50% 18%;animation:ob3kb 22s ease-in-out infinite alternate}',
'.ob3hero .v{position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,6,16,.5) 0%,rgba(11,6,16,0) 22%,rgba(11,6,16,.2) 42%,rgba(11,6,16,.9) 70%,#0b0610 100%)}',
'.ob3rev{animation:ob3open 1s cubic-bezier(.2,.8,.2,1) both}',
'.ob3fill{flex:1;min-height:0}',
'.ob3badge{align-self:flex-start;font-size:12px;font-weight:700;letter-spacing:.05em;color:#2a0f1c;background:linear-gradient(95deg,#F6D3AE,#F0B77E);border-radius:999px;padding:6px 12px;box-shadow:0 6px 20px rgba(240,183,126,.4)}',
'.ob3title{font-family:Fraunces,Georgia,"Songti SC","Noto Serif KR",serif;font-size:34px;line-height:1.05;font-weight:600;margin:12px 0 0;text-wrap:balance;text-shadow:0 2px 18px rgba(0,0,0,.6)}',
'.ob3hook{margin:8px 0 0;font-size:14.5px;line-height:1.5;color:rgba(255,255,255,.84);font-style:italic;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}',
'.ob3hits{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.ob3hits em{font-style:normal;font-size:12px;color:#F6D3AE;border:1px solid rgba(240,183,126,.45);background:rgba(240,183,126,.1);border-radius:999px;padding:4px 10px}',
'.ob3castrow{display:flex;align-items:center;gap:10px;margin-top:12px;font-size:13px;color:rgba(255,255,255,.8)}',
'',
'.ob3s3 .ob3cta{margin-top:16px}',
'.ob3alts{margin-top:14px}.ob3alts>span{font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.5)}',
'.ob3alts>div{display:flex;gap:8px;margin-top:8px}',
'.ob3alts button{flex:1;min-width:0;display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:6px;color:#fff;text-align:left;backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}',
'.ob3alts img{width:34px;height:44px;border-radius:8px;object-fit:cover;flex:none}.ob3alts b{font-size:11.5px;line-height:1.25;font-weight:600;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
'.ob3s3 .ob3lnk{margin-top:6px}',
'.ob3orb{position:relative;width:170px;height:170px;display:grid;place-items:center}',
'.ob3orb b{font-size:34px;color:#F0B77E;animation:ob3beat 1.2s ease-in-out infinite;text-shadow:0 0 24px rgba(240,183,126,.9)}',
'.ob3orb img{position:absolute;top:50%;left:50%;width:62px;height:62px;margin:-31px;border-radius:50%;object-fit:cover;object-position:50% 18%;border:2px solid #F0B77E;box-shadow:0 0 24px rgba(238,111,151,.6);animation:ob3orbit 2.4s linear infinite}',
'.ob3casting{margin-top:26px;font-family:Fraunces,Georgia,"Songti SC",serif;font-style:italic;font-size:19px;color:#F6D3AE;animation:ob3pulse 1.4s ease-in-out infinite}',
'.ob3 .shake{animation:ob3shake .4s}',
'@keyframes ob3up{to{transform:translateY(-50%)}}',
'@keyframes ob3tw{0%,100%{opacity:0;transform:translateY(0) scale(.6)}50%{opacity:.9;transform:translateY(-14px) scale(1)}}',
'@keyframes ob3in{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}',
'@keyframes ob3pop{from{opacity:0;transform:translateY(14px) scale(.94)}to{opacity:1;transform:none}}',
'@keyframes ob3sh{to{background-position:-200% 0}}',
'@keyframes ob3shine{0%,55%{left:-40%}100%{left:130%}}',
'@keyframes ob3beat{0%,100%{transform:scale(1)}12%{transform:scale(1.035)}24%{transform:scale(1)}36%{transform:scale(1.025)}48%{transform:scale(1)}}',
'@keyframes ob3kb{from{transform:scale(1.02)}to{transform:scale(1.14) translateY(-1.5%)}}',
'@keyframes ob3open{from{clip-path:circle(0% at 50% 62%);opacity:.4}to{clip-path:circle(140% at 50% 62%);opacity:1}}',
'@keyframes ob3orbit{from{transform:rotate(0) translateX(64px) rotate(0)}to{transform:rotate(360deg) translateX(64px) rotate(-360deg)}}',
'@keyframes ob3pulse{0%,100%{opacity:.55}50%{opacity:1}}',
'@keyframes ob3shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}',
'@media (max-height:700px){.ob3h{font-size:30px}.ob3title{font-size:28px}.ob3alts{display:none}.ob3lab{margin-top:16px}}',
'@media (prefers-reduced-motion:reduce){.ob3 *,.ob3 *::after{animation:none!important;transition:none!important}}'
].join("");
    document.head.appendChild(st);
  }

  /* 预览：?ob3=1（不保存）；?ob3=0 关闭新流程，?ob3=on 重新打开 */
  let q = ""; try { q = new URLSearchParams(location.search).get("ob3") || ""; } catch (_) {}
  try { if (q === "0") localStorage.setItem("miru_ob3_off", "1"); if (q === "on") localStorage.removeItem("miru_ob3_off"); } catch (_) {}
  function preview() { loadFeed(); ST.dry = true; ST.step = 1; ST.picks = []; ST.pick = ""; ST.age = false; ST.name = ""; draw(true); }
  window.__ob3 = { preview, state: ST };
  if (q === "1") setTimeout(preview, 1500);
  try { if (!S.ob && !off()) loadFeed(); } catch (_) {}
  /* 模块装上之前，新手页可能已经按老流程画出来了：重画一次 */
  setTimeout(() => { try { const ob = document.querySelector("#s-ob"); if (q !== "1" && !off() && !S.ob && ob && !ob.hidden && !document.querySelector(".ob3") && !document.querySelector(".sheet.on,.sheet.show")) renderOB(); } catch (_) {} }, 0);
})();
