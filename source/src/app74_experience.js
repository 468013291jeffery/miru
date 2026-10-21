/* ================= v2.9 · 试玩 = 正式版体验 =================
   Every story a user creates (AI 一步步引导, 一句话写剧, 故事编辑) is packaged exactly like an official MIRU story before it is played:
   1) Story page — cover, logline, background, what's at stake, who you are, relationships table, what's inside, director/AU ideas, endings.
   2) Character profiles — age, looks, personality, tells, contradiction, likes, locked secret, a pitch line (Profile tab like official cast).
   3) In-chat intro card — background, your role, the cast, how to play.
   4) Interactions matched by AI from MIRU's libraries, never chosen by the user: a scored BGM cue per chapter, weather/scene effects,
      inner-monologue moments, mini-games where the story is actually doing that activity (from chapter 2, at most one per two chapters);
      sound effects and short effects keep firing from keywords at runtime.
   The packaging follows MIRU_RULES (终版 §05 开篇 · §06 世界 · §07 人物 · §10 互动 · §15–17 表达 · §24 结局). Offline it is built from the
   story card. Nothing here publishes to the community. */
const EXP74 = { busy: false };
const xL = s => ({ zh: s, en: s });
function exp74Lines(c) { const b = c && c.beats; const a = Array.isArray(b) ? b : b ? (b.zh || b.en || []) : []; return (Array.isArray(a) ? a : []).filter(x => Array.isArray(x) && x[0] !== "sys" && typeof x[2] === "string"); }
function exp74Digest(w) {
  return (w.pack.chapters || []).map((c, i) => "Ch" + (i + 1) + " \"" + Lz(c.t) + "\" — goal: " + Lz(c.goal) + "\n" + exp74Lines(c).slice(0, 8).map(b => (b[0] === "n" ? "(narration) " : (ch(b[0]) ? first(ch(b[0]).n) : b[0]) + ": ") + b[2].slice(0, 140)).join("\n")).join("\n\n").slice(0, 5200);
}
async function exp74Enrich(wid) {
  const w = wd(wid); if (!w || !w.pack) return false; const P = w.pack, c = P.card || {};
  const cast = w.cast.filter(id => ch(id)).map(id => ({ id, name: ch(id).n, role: Lz(ch(id).role) }));
  let r = null;
  if (liveOn()) {
    const rules = MIRU_RULES.gen.split("\n").filter(l => /^(05|06|07|15|16|17|24) /.test(l)).join("\n");
    const prompt = ["You are MIRU's story packager. A user just created this interactive romance story; package it exactly like an official MIRU story so playing it feels the same. All characters are fictional adults (21+). No explicit content. Do not change any facts the story already has; fill gaps consistently.",
      "RULES TO FOLLOW:\n" + rules,
      "STORY CARD: " + JSON.stringify({ title: Lz(w.title), hook: Lz(w.hook), premise: Lz(w.premise), place: c.place, time: c.time, conflict: c.con, secret: c.sec, object: c.obj, player_role: (P.creator && P.creator.role) || "" }).slice(0, 1600),
      "CAST: " + JSON.stringify(cast),
      "CHAPTERS:\n" + exp74Digest(w),
      "LANGUAGE: write every text field only in " + LANG_NAME[S.lang] + ". Keep character names as they are.",
      'Reply ONLY JSON: {"logline":"one gripping sentence","premise":"2-3 sentences","warn":"what is at stake if nobody acts (1-2 sentences)","you":"who the player is, second person, 1-2 sentences","intro_bg":["3-4 short paragraphs: where and when, what is happening now, why it matters to you"],"intro_how":["2-3 short tips: choices change trust and attraction; you can type your own words or *actions*; tap 💭 to hear what he didn\'t say"],"tags":["3-5 romance tropes"],"cast":[{"id":"<cast id>","age":27,"height":"","looks":"concrete appearance","vibe":"personality in one line","tells":["2-3 concrete visible behaviours"],"twist":"his contradiction","likes":"specific likes","secret":"a secret consistent with the story","pitch":"one line he would say to you"}],"relations":[["<id or you>","<id or you>","what they are to each other, one line"]],"features":{"game":"","date":"","gift":"","photo":"","voice":"","room":""},"director":{"allowed":["3 short director moves"],"au":["2 alternate-universe ideas"]},"endings":{"A":{"t":"","txt":"","line":""},"B":{"t":"","txt":"","line":""},"C":{"t":"","txt":"","line":""}},"mono":[{"chapter":1,"who":"<cast id>","text":"one private thought he would not say aloud in that chapter"}]}'].join("\n\n");
    /* never hang the player: one try, hard cap 30s, or skip button → offline packaging */
    try { r = await Promise.race([ask(prompt, { modelTier: "complex" }), new Promise(res => setTimeout(() => res(null), 30000)), new Promise(res => { EXP74.skip = () => res(null); })]); } catch (_) { r = null; }
    EXP74.skip = null;
  }
  const zh = S.lang === "zh", L = w.cast[0], S2 = w.cast[1];
  if (!r || typeof r !== "object") r = {
    logline: Lz(w.hook) || c.hook || "", premise: Lz(w.premise) || c.con || "", warn: c.con ? (zh ? "如果没人先开口：" : "If nobody speaks first: ") + c.con : "",
    you: (P.creator && P.creator.role) ? (zh ? "你的身份：" : "You: ") + P.creator.role : (zh ? "你以自己的身份进入故事。" : "You enter as yourself."),
    intro_bg: [c.place && c.time ? c.place + "，" + c.time + "。" : "", c.con || "", c.sec ? (zh ? "有一件事还没人说破。" : "There is one thing nobody has said yet.") : ""].filter(Boolean),
    intro_how: zh ? ["你的选择会改变他对你的信任、吸引和张力。", "可以直接打字说自己的话，*星号*里写动作。", "点 💭 能听到他没说出口的那句话。"] : ["Your choices change his trust, attraction and tension.", "Type your own words; put *actions* in asterisks.", "Tap 💭 to hear what he didn't say."],
    tags: [], cast: [], relations: L && S2 ? [[L, S2, Lz(ch(S2).role) || ""], ["you", L, zh ? "命运在今晚交汇" : "Tonight your paths cross"]] : [],
    features: zh ? { game: "剧情里会出现和当下情节相关的小游戏，赢了能改变场面。", date: "关系近了以后，可以约他出去。", gift: "送他一样东西，看他怎么反应。", photo: "解锁他的照片。", voice: "听他的声音。", room: "关系确立后，有你们俩的日常。" } : { game: "Mini-games tied to what's happening — winning changes the scene.", date: "Ask him out once you're closer.", gift: "Give him something and see how he reacts.", photo: "Unlock his photos.", voice: "Hear his voice.", room: "Everyday life together once you're official." },
    director: { allowed: [], au: [] }, endings: null, mono: [],
  };
  /* apply: world + intro */
  if (r.logline) P.logline = xL(r.logline); if (r.premise) w.premise = xL(r.premise); if (r.warn) w.warn = xL(r.warn); if (r.you) w.you = xL(r.you);
  if (Array.isArray(r.tags) && r.tags.length) w.tags = r.tags.slice(0, 6).map(String);
  if (r.features && typeof r.features === "object") P.features = Object.assign({}, P.features || {}, Object.fromEntries(Object.entries(r.features).filter(([, v]) => v).map(([k, v]) => [k, xL(String(v))])));
  if (r.director) P.director = { allowed: (r.director.allowed || []).slice(0, 4).map(x => xL(String(x))), au: (r.director.au || []).slice(0, 3).map(x => xL(String(x))) };
  const okId = id => id === "you" || w.cast.includes(id);
  if (Array.isArray(r.relations)) { const rel = r.relations.filter(x => Array.isArray(x) && okId(x[0]) && okId(x[1]) && x[2]).slice(0, 8).map(x => [x[0], x[1], xL(String(x[2]))]); if (rel.length) w.rel = rel; }
  (r.cast || []).forEach(k => {
    const id = k && k.id, C = id && S.mine.chars[id]; if (!C) return;
    if (k.age) C.age = +k.age || C.age; if (k.height) C.h = String(k.height).slice(0, 20);
    ["looks", "vibe", "twist", "likes", "secret", "pitch"].forEach(f => { if (k[f]) C[f] = xL(String(k[f])); });
    if (Array.isArray(k.tells) && k.tells.length) C.tells = { zh: k.tells.slice(0, 4).map(String), en: k.tells.slice(0, 4).map(String) };
  });
  const intro = { bg: (r.intro_bg || []).map(String).filter(Boolean).slice(0, 5), you: Lz(w.you) || "", cast: w.cast.filter(id => ch(id)).map(id => [id, [Lz(ch(id).role), Lz(ch(id).vibe)].filter(Boolean).join(" · ")]), how: (r.intro_how || []).map(String).slice(0, 4) };
  if (!intro.bg.length) intro.bg = [Lz(w.premise)];
  P.intro = { zh: intro, en: JSON.parse(JSON.stringify(intro)) };
  if (r.endings && typeof r.endings === "object") ["A", "B", "C"].forEach(k => { const e = r.endings[k]; if (!e || !P.endings || !P.endings[k]) return; if (e.t) P.endings[k].t = xL(String(e.t)); if (e.txt) P.endings[k].txt = xL(String(e.txt)); if (e.line && L) P.endings[k].line = { who: L, zh: String(e.line), en: String(e.line) }; });
  EXP74.mono = Array.isArray(r.mono) ? r.mono : [];
  return true;
}
/* ---------- interactions matched from the libraries ---------- */
const MOOD74 = [["danger", /危险|枪|血|追|逃|威胁|danger|gun|blood|chase|threat/i], ["tense", /对峙|争吵|质问|冷笑|紧张|confront|argue|tense|glare/i], ["intimate", /靠近|呼吸|吻|手指|贴近|close|breath|kiss|touch/i], ["sad", /哭|眼泪|告别|离开|失去|cry|tears|goodbye|leave|lost/i], ["memory", /那年|以前|小时候|回忆|years ago|remember|used to/i], ["mystery", /秘密|真相|线索|奇怪|secret|truth|clue|strange/i], ["luxury", /香槟|晚宴|豪宅|游艇|champagne|gala|mansion|yacht/i], ["warm", /笑|阳光|早餐|温暖|smile|sunlight|breakfast|warm/i], ["night", /深夜|凌晨|月光|night|midnight|moon/i]];
function exp74Media(wid) {
  const w = wd(wid); if (!w || !w.pack) return {}; const P = w.pack; const n = { bgm: 0, fx: 0, mg: 0, mono: 0 }; let lastMg = -9;
  (P.chapters || []).forEach((c, i) => {
    const arr = Array.isArray(c.beats) ? c.beats : c.beats && c.beats.zh; if (!Array.isArray(arr)) return;
    for (let k = arr.length - 1; k >= 0; k--) if (Array.isArray(arr[k]) && arr[k][0] === "sys" && arr[k][2] && arr[k][2].x74) arr.splice(k, 1);
    const lines = exp74Lines(c), text = lines.map(b => b[2]).join("\n"); if (!lines.length) return;
    let at = arr.findIndex(b => Array.isArray(b) && b[0] === "sys" && b[1] === "scene"); at = at < 0 ? 0 : at + 1;
    /* music: a scored cue from the 100-cue library, else a mood */
    let cue = null; try { cue = typeof bgmPick === "function" ? bgmPick(Lz(c.place) + "\n" + Lz(c.t) + "\n" + text) : null; } catch (_) {}
    let mood = null; if (!cue) { let best = 0; MOOD74.forEach(([m, rx]) => { const s = (text.match(new RegExp(rx.source, "gi")) || []).length; if (s > best) { best = s; mood = m; } }); }
    arr.splice(at, 0, ["sys", "bgm", { m: cue ? cue.id : (mood || "night"), x74: 1 }]); at++; n.bgm++;
    /* scene effect (weather, light) only when the chapter really is about it */
    try { if (typeof FX100 !== "undefined") { const hits = {}; lines.forEach(b => { const f = fxMatch(FX100, b[2]); if (f) hits[f.id] = (hits[f.id] || 0) + 1; }); const top = Object.entries(hits).sort((a, b) => b[1] - a[1])[0]; if (top && top[1] >= 2) { arr.splice(at, 0, ["sys", "fx100", { id: top[0], x74: 1 }]); at++; n.fx++; } } } catch (_) {}
    /* inner monologue */
    const mo = (EXP74.mono || []).find(x => +x.chapter === i + 1 && x.text && w.cast.includes(x.who));
    if (mo) { const j = arr.findIndex((b, q) => q > arr.length / 3 && Array.isArray(b) && b[0] === mo.who); const pos = j >= 0 ? j + 1 : Math.min(arr.length, at + 4); arr.splice(pos, 0, ["sys", "mono", { t: [[mo.who, String(mo.text)]], x74: 1 }]); n.mono++; }
    /* mini-game: only where the story is doing that activity, from chapter 2, at most one per two chapters */
    try {
      if (i >= 1 && i - lastMg >= 2 && typeof mgMatch === "function") {
        let pick = null; lines.forEach(b => { if (pick) return; const G = mgMatch(b[2]); if (G) { const same = lines.filter(x => mgMatch(x[2]) === G).length; if (same >= 1) pick = { G, line: b }; } });
        if (pick) { const j = arr.indexOf(pick.line); arr.splice(j + 1, 0, ["sys", "mg", { id: pick.G.id, why: String(pick.line[2]).slice(0, 46), x74: 1 }]); lastMg = i; n.mg++; }
      }
    } catch (_) {}
    if (c.beats && !Array.isArray(c.beats)) c.beats.en = c.beats.zh;
  });
  return n;
}
function exp74Sheet(step) {
  const zh = S.lang === "zh", L4 = (a, b) => zh ? a : b;
  const items = [L4("故事背景与简介", "Background & logline"), L4("人物画像", "Character profiles"), L4("人物关系", "Relationships"), L4("匹配音乐、音效、特效和小游戏", "Matching music, sound, effects & games")];
  sheet('<div class="exp74"><h2>✨ ' + L4("正在把你的剧做成正式版", "Building the full experience") + '</h2><p class="xs faint">' + L4("和官方剧一样：先看故事页和人物，再开始玩。", "Just like an official story: story page and cast first, then play.") + '</p><div class="exp74l">' + items.map((x, k) => '<div class="' + (k < step ? "done" : k === step ? "on" : "") + '"><i>' + (k < step ? "✓" : k === step ? "…" : "") + '</i>' + esc(x) + '</div>').join("") + '</div></div>' + (EXP74.showSkip && EXP74.skip ? '<button class="btn btn-g btn-block" style="margin-top:14px" data-exp74skip="1">' + L4("先用基础版开始，不等了", "Start with the basic version") + '</button>' : '') + '');
}
async function exp74Build(wid, force) {
  const w = wd(wid); if (!w || !w.pack) return null; if (w.pack.exp74 && !force) return w.pack.exp74;
  if (EXP74.busy) return null; EXP74.busy = true;
  try {
    exp74Sheet(0);
    let k = 0; const tick = setInterval(() => { if (k < 2) exp74Sheet(++k); }, 6000);
    EXP74.showSkip = false; const sk = setTimeout(() => { EXP74.showSkip = true; exp74Sheet(k); }, 9000);
    try { await exp74Enrich(wid); } catch (e) { console.warn("exp74 enrich", e); }
    clearInterval(tick); clearTimeout(sk); EXP74.showSkip = false; exp74Sheet(3);
    let n = { bgm: 0, fx: 0, mono: 0, mg: 0 }; try { n = exp74Media(wid); } catch (e) { console.warn("exp74 media", e); }
    w.pack.exp74 = { at: Date.now(), rules: MIRU_RULES.version, media: n }; save(); closeSheet();
    const zh = S.lang === "zh";
    toast(zh ? "已按剧情自动配好：音乐 " + n.bgm + " 段 · 特效 " + n.fx + " 处 · 心声 " + n.mono + " 段 · 小游戏 " + n.mg + " 个" : "Matched for you: " + n.bgm + " music cues · " + n.fx + " effects · " + n.mono + " inner voices · " + n.mg + " games");
    return w.pack.exp74;
  } catch (e) { console.warn("exp74", e); try { closeSheet(); } catch (_) {} return null; } finally { EXP74.busy = false; }
}
document.addEventListener("click", e => { if (e.target.closest && e.target.closest("[data-exp74skip]") && EXP74.skip) { e.stopImmediatePropagation(); EXP74.skip(); } }, true);
/* every user-made story opens on its story page (like official ones) the first time; later starts go straight in */
const _packStart74 = packStart;
packStart = function (wid, as, fromCh, picks) {
  const w = wd(wid);
  if (w && w.mine && w.pack && !w.pack.exp74 && !fromCh) { exp74Build(wid).then(() => _packStart74(wid, as, fromCh, picks), () => _packStart74(wid, as, fromCh, picks)); return; }
  return _packStart74.apply(this, arguments);
};
/* the creator's 「完成创建并试玩」 / ▶ 试玩 → full experience (no community publish) */
if (window.MIRU_BRIDGE) {
  window.MIRU_BRIDGE.preview = function (story, proj, sb) {
    const wid = crPublish(story, proj, sb); const w = wd(wid); if (w && w.pack) w.pack.exp74 = null;
    crClose(true); show("s-main");
    exp74Build(wid, true).then(() => { try { openStory(wid); } catch (_) {} });
  };
  const _pub74 = window.MIRU_BRIDGE.publish;
  window.MIRU_BRIDGE.publish = function (story, proj, sb) { try { const id = S.crmap && S.crmap[proj.id]; const w = id && wd(id); if (w && w.pack) w.pack.exp74 = null; } catch (_) {} return _pub74.apply(this, arguments); };
}
(function () { const st = document.createElement("style"); st.textContent = `.exp74 h2{margin:0}.exp74l{display:flex;flex-direction:column;gap:8px;margin-top:14px}.exp74l div{display:flex;gap:10px;align-items:center;font-size:13.5px;color:var(--faint)}.exp74l i{width:20px;height:20px;border-radius:50%;border:1.5px solid var(--line);display:grid;place-items:center;font-style:normal;font-size:11px}.exp74l .done{color:var(--dim)}.exp74l .done i{background:var(--grad);border-color:transparent;color:#1B1017}.exp74l .on{color:var(--text)}.exp74l .on i{border-color:var(--gold);animation:rot 1.2s linear infinite}`; document.head.appendChild(st); })();
