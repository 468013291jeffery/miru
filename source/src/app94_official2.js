/* ================= v5.7 · OFFICIAL SCRIPTS, FULLY DRESSED =================
   Official scripts can carry ⟦…⟧ directives (one per line, parts URI-encoded) on top of the MIRU standard format:
     ⟦CHAR|name|g|age|voice|role|bio⟧   cast sheet (gender → TTS voice, age, role, bio)
     ⟦BGM|cue|tag⟧ ⟦TIME|t⟧ ⟦BG|slot|place⟧   score cue · scene time · scene background slot
     ⟦CG|slot|caption⟧ ⟦VIDEO|slot|caption⟧ art / film for this moment (shown when the asset exists)
     ⟦PHOTO|title|caption⟧              a "photo of this moment" stop (AI still, 💎)
     ⟦MG|game|what⟧                     a mini-game from the 100-game library
     ⟦FREE|question|ex1|ex2…⟧           your turn — tap a suggestion or say anything; he answers live (LLM)
     ⟦CALL|who|situation⟧ lines ⟦/CALL⟧ he calls you: a real voice call (Doubao / Qwen), the lines are only his intent
   Assets live at art/official/<work>/… and are listed in art/official/<work>.json → {slot: url}; missing ones are skipped,
   so pictures and films can be added later without republishing the script.
   Also: picking a written option whose script has nothing after it gets a live reply in character (real LLM chat). */
const OFF94 = { cur: null, assets: {} };
const dec94 = s => { try { return decodeURIComponent(s); } catch (_) { return s; } };
function mk94(txt) { const m = /^⟦([A-Z/]+)((?:\|[^|⟧]*)*)⟧$/.exec(String(txt || "").trim()); if (!m) return null; return { k: m[1], a: m[2] ? m[2].slice(1).split("|").map(dec94) : [] }; }
async function off94Assets(id) {
  if (OFF94.assets[id]) return OFF94.assets[id];
  let map = {}; try { const r = await fetch("art/official/" + encodeURIComponent(id) + ".json?v=" + Math.floor(Date.now() / 6e5)); if (r.ok) map = await r.json(); } catch (_) {}
  OFF94.assets[id] = map || {}; return OFF94.assets[id];
}
/* ---- parse: lift directives out of the narration ---- */
function off94Parse(next, text) {
  const chars = [];
  text = String(text || "").split("\n").filter(l => { const m = mk94(l); if (m && m.k === "CHAR") { chars.push(m.a); return false; } return true; }).join("\n");
  const doc = next(text);
  doc.chars94 = chars;
  const walk = (arr, nested) => {
    const out = []; let call = null;
    /* 2026-10-29（Ann）：「留痕 / 条件」的运行时早就在了 —— app16_story2.js:27 `sys if` / :28 `sys set`，
       pkCond 支持 pick/flag/not/love/any/all。缺的只是**剧本里能写出来的语法**。这里补三种：
         ⟦SET|mem_video_kept,other⟧      打旗（落在它所处的位置：章一级 / 选项后果里都行）
         ⟦IF|flag⟧ … ⟦ELSE⟧ … ⟦/IF⟧      按旗分支（⟦IF|!flag⟧ = 没打这个旗）
       IF 可以嵌套；没闭合的 IF 会把内容**平铺**回去（宁可播出来，也不要静默吞掉后面的正文）。 */
    const stack = [];
    const sink = () => (stack.length ? (stack[stack.length - 1].alt || stack[stack.length - 1].then) : out);
    const push = b => sink().push(b);
    for (let i = 0; i < (arr || []).length; i++) {
      const b = arr[i];
      if (b && b.choice) { b.choice.opts.forEach(o => { o.then = walk(o.then, 1); }); push(b); continue; }
      if (b && b.variant) { b.variant.then = walk(b.variant.then, 1); push(b); continue; }
      const m = Array.isArray(b) && b[0] === "n" && mk94(b[2]);
      if (call) { if (m && m.k === "/CALL") { push(["@" + call.who, "call", { who94: call.who, lines: call.lines, hint: call.hint }]); call = null; continue; }
        if (Array.isArray(b) && b[0][0] === "@" && b[0] !== "@pov") call.lines.push([b[0].slice(1), b[2]]); continue; }
      if (!m) { push(b); continue; }
      const a = m.a;
      if (m.k === "SET") { push(["sys", "set", { flags: String(a[0] || "").split(/[,，]/).map(s => s.trim()).filter(Boolean) }]); continue; }
      if (m.k === "IF") { const f = String(a[0] || "").trim(); stack.push({ cond: f.charAt(0) === "!" ? { not: f.slice(1) } : { flag: f }, then: [], alt: null }); continue; }
      if (m.k === "ELSE") { const f = stack[stack.length - 1]; if (f && !f.alt) f.alt = []; continue; }
      if (m.k === "/IF") { const f = stack.pop(); if (!f) continue; const beat = ["sys", "if", { cond: f.cond, then: f.then }]; if (f.alt) beat[2].else = f.alt; push(beat); continue; }
      if (m.k === "CALL") { call = { who: a[0], hint: a[1] || "", lines: [] }; continue; }
      if (m.k === "BGM") { push(["sys", "bgm", { m: a[0] }]); continue; }
      if (m.k === "TIME" || m.k === "BG") { for (let j = out.length - 1; j >= 0; j--) { const s = out[j]; if (Array.isArray(s) && s[0] === "sys" && s[1] === "scene") { if (m.k === "TIME") s[2].time = a[0]; else s[2].bg94 = a[0]; break; } } continue; }
      if (m.k === "CG" || m.k === "VIDEO") { push(["sys", m.k === "CG" ? "cg94" : "vid94", { slot: a[0], cap: a[1] || "" }]); continue; }
      if (m.k === "PHOTO") { push(["sys", "photo94", { t: a[0], cap: a[1] || a[0] }]); continue; }
      if (m.k === "MG") { const gid = /^g_/.test(a[0]) ? a[0] : "g_" + a[0]; push(["sys", "mg", { id: gid }]); continue; }
      if (m.k === "FREE" && nested) continue;
      if (m.k === "FREE") { const ex = a.slice(1).filter(Boolean); push({ choice: { q: "\u2063" + (a[0] || ""), opts: (ex.length ? ex : ["……"]).slice(0, 3).map(t => ({ t, then: [] })) }, free94: 1 }); continue; }
    }
    /* 没闭合的 IF：内容平铺回上一层（并留一条 warn，别静默） */
    let unclosed = 0;
    while (stack.length) {
      const f = stack.pop(); unclosed++;
      sink().push.apply(sink(), f.then); if (f.alt) sink().push.apply(sink(), f.alt);
    }
    if (unclosed) (doc.warn = doc.warn || []).push("IF 没有闭合（缺 ⟦/IF⟧）：条件块已按内容平铺播出");
    return out;
  };
  (doc.chapters || []).forEach(c => {
    c.items = walk(c.items);
    /* a chapter-opening music cue goes after the first scene card */
    const fi = c.items.findIndex(y => Array.isArray(y) && y[0] === "sys" && y[1] === "scene");
    if (fi > 0 && c.items.slice(0, fi).every(y => Array.isArray(y) && y[0] === "sys")) { const sc = c.items.splice(fi, 1)[0]; c.items.unshift(sc); }
    /* a trailing "your turn" window must not become the chapter's ending decision */
    for (let j = c.items.length - 1; j >= 0; j--) { const y = c.items[j]; if (y && y.choice && y.free94) { c.items.push(["n", "act", "……"]); break; } if (y && y.choice) break; if (Array.isArray(y) && y[0] !== "sys") break; }
  });
  /* cast: everyone the sheet names comes first, in order */
  if (chars.length) { const names = chars.map(a => a[0]); doc.cast = names.filter(n => doc.sp[n]).concat((doc.cast || []).filter(n => !names.includes(n) && doc.sp[n] >= 8)).slice(0, 9); }
  return doc;
}
/* ---- build: names → ids, asset slots → urls, cast sheet → characters ---- */
function off94Build(next, doc, as) {
  const r = next(doc, as);
  try {
    const wid = r && (r.wid || r), w = wd(wid); if (!w) return r;
    const A = (OFF94.cur && OFF94.assets[OFF94.cur.id]) || {}, key = OFF94.cur ? OFF94.cur.id : wid;
    const byName = {}; w.cast.forEach(id => { const c = ch(id); if (c) byName[c.n] = id; });
    (doc.chars94 || []).forEach(a => { const id = byName[a[0]]; if (!id) return; const c = S.mine.chars[id]; if (!c) return;
      c.g = a[1] === "f" ? "f" : "m"; if (+a[2]) c.age = +a[2]; if (/^[mf]\d$/.test(a[3] || "")) c.voiceId = a[3];
      if (a[4]) c.role = { zh: a[4], en: a[4] }; if (a[5]) { c.vibe = { zh: a[5].slice(0, 60), en: a[5].slice(0, 60) }; c.looks = { zh: a[5], en: a[5] }; }
      if (A["char_" + a[0]]) S.art[id] = A["char_" + a[0]]; });
    const main = w.cast[0];
    const fix = arr => (arr || []).map(b => {
      if (!Array.isArray(b)) return b;
      if (b[1] === "call" && b[2] && b[2].who94) { const cid = byName[b[2].who94] || main; return [cid, "call", { cid, hint: b[2].hint, lines: (b[2].lines || []).map(([n, t]) => [byName[n] || cid, t]) }]; }
      if (b[0] === "sys" && b[1] === "photo94") { const d = b[2]; return [main, "photo", { cap: { zh: d.cap, en: d.cap }, prompt: d.cap + "，电影剧照，成年人，柔和光线", t: d.t }]; }
      if (b[0] === "sys" && (b[1] === "cg94" || b[1] === "vid94")) { const u = A[b[2].slot]; return ["sys", b[1], Object.assign({}, b[2], u ? { src: u } : {})]; }
      if (b[0] === "sys" && b[1] === "scene" && b[2] && b[2].bg94) { const u = A[b[2].bg94]; const k = "off94:" + key + ":" + b[2].bg94; b[2].img = k; if (u) { (window.SCENE_FILES = window.SCENE_FILES || {})[k] = u; b[2].src94 = u; } return b; }
      if (b[0] === "sys" && b[1] === "if" && b[2]) { b[2].then = fix(b[2].then); return b; }
      if (b[1] === "line" && b[2] && b[2].opts) b[2].opts.forEach(o => { o.then = fix(o.then); });
      return b;
    }).filter(Boolean);
    ((w.pack && w.pack.chapters) || []).forEach(c => { const z = fix(c.beats.zh); c.beats = { zh: z, en: z }; (c.choices || []).forEach(o => { if (o.then) { const t2 = fix(o.then.zh); o.then = { zh: t2, en: t2 }; } }); });
    if (A.cover || A.poster) S.art[wid] = A.cover || A.poster;
  } catch (e) { try { console.warn("[off94]", e); } catch (_) {} }
  return r;
}
/* scene art registered again on every load (SCENE_FILES isn't saved) */
function off94Rereg() { try { Object.values(S.mine.worlds || {}).forEach(w => { if (!w.official76 || !w.pack) return; (w.pack.chapters || []).forEach(c => (c.beats.zh || []).forEach(b => { if (Array.isArray(b) && b[1] === "scene" && b[2] && b[2].img && /^off94:/.test(b[2].img) && b[2].src94) (window.SCENE_FILES = window.SCENE_FILES || {})[b[2].img] = b[2].src94; })); }); } catch (_) {} }
function off94SceneRereg(next, doc, as) { const r = next(doc, as); try { const w = wd(r && (r.wid || r)); (w.pack.chapters || []).forEach(c => (c.beats.zh || []).forEach(b => { if (Array.isArray(b) && b[1] === "scene" && b[2] && b[2].img && /^off94:/.test(b[2].img)) b[2].src94 = window.SCENE_FILES[b[2].img]; })); } catch (_) {} return r; }
PARSE.use("app94:directives", { parse: off94Parse, build: off94Build });
PARSE.use("app94:scene-rereg", { build: off94SceneRereg });
setTimeout(off94Rereg, 0);
/* install: know which work we're building and fetch its asset list first */
const _installWork94 = installWork;
installWork = async function (id) {
  try { const h = S.off76 && S.off76[id]; if (h && !h.v94) { h.ver = -1; } } catch (_) {} OFF94.cur = { id }; try { await off94Assets(id); } catch (_) {} try { return await _installWork94.apply(this, arguments); } finally { OFF94.cur = null; } };
/* ---- runtime: pictures / films that were added after the story was installed ---- */
async function off94Ensure(w) {
  if (!w || !w.official76 || !w.community) return {}; const A = await off94Assets(w.community); const SF = (window.SCENE_FILES = window.SCENE_FILES || {});
  (w.pack.chapters || []).forEach(c => ["zh", "en"].forEach(l => ((c.beats && c.beats[l]) || []).forEach(b => { if (Array.isArray(b) && b[1] === "scene" && b[2] && b[2].bg94 && A[b[2].bg94]) { b[2].img = b[2].img || "off94:" + w.community + ":" + b[2].bg94; SF[b[2].img] = A[b[2].bg94]; } })));
  (w.cast || []).forEach(id => { const c = ch(id); const nm = c && (c.n94 ? c.n94.zh : c.n); if (nm && A["char_" + nm]) S.art[id] = A["char_" + nm]; });
  if (A.cover || A.poster) S.art[w.id] = A.cover || A.poster; return A;
}
const _packStart94 = packStart;
packStart = function (wid) { const w = wd(wid), args = arguments, self = this; if (w && w.official76) { off94Ensure(w).then(() => _packStart94.apply(self, args), () => _packStart94.apply(self, args)); return; } return _packStart94.apply(this, arguments); };
setTimeout(() => { try { Object.values(S.mine.worlds || {}).forEach(w => { if (w && w.official76) off94Ensure(w); }); } catch (_) {} }, 1500);
/* ---- runtime: CG / film moments ---- */
function off94Show(d, vid) {
  const host = (typeof fxLayer === "function" ? fxLayer() : null) || $("#s-chat") || document.body; const o = document.createElement("div"); o.className = "cg94";
  o.innerHTML = (vid ? '<video src="' + esc(d.src) + '" autoplay playsinline muted></video>' : '<img src="' + esc(d.src) + '" alt="">') + (d.cap ? '<p>' + esc(d.cap) + '</p>' : '') + '<small>' + (CL() === "zh" ? "点一下继续" : "Tap to continue") + '</small>';
  host.appendChild(o); requestAnimationFrame(() => o.classList.add("on")); const bye = () => { o.classList.remove("on"); setTimeout(() => o.remove(), 400); }; o.addEventListener("click", bye);
  if (vid) { const v = o.querySelector("video"); try { v.muted = false; v.play().catch(() => { v.muted = true; v.play().catch(() => {}); }); } catch (_) {} v.addEventListener("ended", () => setTimeout(bye, 400)); setTimeout(bye, 20000); } else setTimeout(bye, 4200);
}
PKREG.add("app94_official2.js", function(th, b, next){
  if (Array.isArray(b) && b[0] === "sys" && (b[1] === "cg94" || b[1] === "vid94")) {
    th.pk.q.shift(); const d0 = b[2] || {}, w = wd(th.wid), A = (w && OFF94.assets[w.community]) || {}, d = Object.assign({}, d0, { src: d0.src || A[d0.slot] });
    /* the opening film already played in the feed / story page — don't show it again once you're inside */
    if (b[1] === "vid94" && d0.slot === "vid_open") { save(); return true; }
    if (b[1] === "cg94" && d.src) th.pk.lastCg98 = d.src;
    if (d.src && !PKSKIP[th.id]) { if (curT === th.id) off94Show(d, b[1] === "vid94");
      if (b[1] === "cg94") { const aid = "a" + Date.now(); S.album.unshift({ id: aid, cid: mainOf(th), src: mediaWrap("album:"+aid, d.src), at: Date.now() }); if (S.album.length > 24) S.album.length = 24; appendMsg(th, { who: "n", k: "img", aid, at: Date.now() }); } }
    save(); return true;
  }
  return next.apply(this, arguments);
});;
/* ---- a written option with nothing scripted after it → he answers it live ---- */
window.addEventListener("click", e => {
  const x = e.target.closest("[data-stopline]"); if (!x) return; const th = S.threads[curT];
  if (!th || !th.pk || !th.pk.stop || th.pk.stop[1] !== "line") return; const d = th.pk.stop[2], o = d.opts[+x.dataset.stopline];
  if (!o || (o.then && o.then.length) || typeof liveOn !== "function" || !liveOn()) return;
  const isFree = /^\u2063/.test(String(Lz(d.hint) || "")), nx = (th.pk.q || [])[1];
  if (!isFree && Array.isArray(nx) && nx[0] !== "n" && nx[0] !== "sys" && (nx[1] === "say" || nx[1] === "act")) return; /* the script answers this line itself */
  if (typeof aiGate === "function" && !aiGate()) return;
  e.stopImmediatePropagation(); e.preventDefault();
  const txt = Lz(o.t); appendMsg(th, { who: "me", k: o.k || "say", txt, at: Date.now() }); th.rounds++; try { pkSet(th, o.set); } catch (_) {}
  Promise.resolve(reply(th, { kind: "user", txt, mode: o.k || "say" })).then(() => stopResolve(th, d.free || []));
}, true);
(function () { const st = document.createElement("style"); st.textContent = `.cg94{position:absolute;inset:0;z-index:60;background:#000d;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;opacity:0;transition:opacity .4s;cursor:pointer;padding:18px}
.cg94.on{opacity:1}.cg94 img,.cg94 video{max-width:100%;max-height:72%;border-radius:14px;box-shadow:0 10px 40px #0009}.cg94 p{color:#F6E7D6;font-size:14px;line-height:1.55;text-align:center;max-width:420px;margin:0}.cg94 small{color:#fff8;font-size:11px}`; document.head.appendChild(st); })();
/* second-person stories: "your turn" without an empty "you're …" */
(function () { const _t94 = t; t = function (k, o) { if (k === "st.yourTurn" && o && !o.n) return CL() === "zh" ? "轮到你了" : "Your turn"; return _t94.apply(this, arguments); }; })();
/* ================= English edition: pack.script_en is built the same way and merged in as the "en" side =================
   Same structure line for line, so chapter i / beat j match. Character names switch with the app language. */
function off94Names() { try { const zh = CL() === "zh"; Object.values(S.mine.chars || {}).forEach(c => { if (c && c.n94) c.n = (zh ? c.n94.zh : c.n94.en) || c.n94.zh; }); } catch (_) {} }
let OFF94_LANG = null; setInterval(() => { try { const l = CL(); if (l !== OFF94_LANG) { OFF94_LANG = l; off94Names(); } } catch (_) {} }, 1500);
function off94MergeEn(wid, P) {
  const wz = wd(wid); if (!wz || !P || !P.script_en) return;
  const lang0 = S.lang; let tmp = null;
  try {
    S.lang = "en";
    const docE = imParse(P.script_en); if (!docE.chapters.length) return;
    tmp = imBuild(docE, (P.meta || {}).as || docE.pov); const we = wd(tmp && (tmp.wid || tmp)); if (!we) return;
    /* temp ids → real ids, matched by the speaker key (same Chinese key in both scripts) */
    const key = id => { const c = ch(id); return c && c.n94 ? c.n94.zh : c && c.n; };
    const zid = {}; wz.cast.forEach(id => { zid[key(id)] = id; });
    let js = JSON.stringify(we.pack.chapters);
    we.cast.forEach(id => { const z = zid[key(id)]; if (z) js = js.split('"' + id + '"').join('"' + z + '"'); });
    const ce = JSON.parse(js);
    if (ce.length === wz.pack.chapters.length) wz.pack.chapters.forEach((c, i) => {
      const e = ce[i]; c.beats.en = e.beats.zh; ["t", "goal", "ask", "place"].forEach(k => { if (c[k] && e[k]) c[k].en = e[k].zh || e[k].en; });
      (c.choices || []).forEach((o, j) => { const oe = (e.choices || [])[j]; if (!oe) return; o.t.en = oe.t.zh || oe.t.en; if (o.then && oe.then) o.then.en = oe.then.zh; if (o.mem && oe.mem) o.mem.en = oe.mem.zh || oe.mem.en; });
    });
    /* names, roles, bios in English */
    (docE.chars94 || []).forEach(a => { const id = zid[a[0]]; const c = id && S.mine.chars[id]; if (!c) return;
      c.n94 = { zh: a[0], en: a[6] || a[0] }; if (a[4]) c.role = { zh: Lz(c.role) || "", en: a[4] }; if (a[5]) { c.looks = { zh: (c.looks && c.looks.zh) || "", en: a[5] }; c.vibe = { zh: (c.vibe && c.vibe.zh) || "", en: a[5].slice(0, 80) }; } });
    const m = (P.meta || {}).en || {};
    const bi = (o, v) => ({ zh: (o && (o.zh || o.en)) || "", en: v || (o && o.en) || "" });
    if (m.title) wz.title = bi(wz.title, m.title); if (m.hook) wz.hook = bi(wz.hook, m.hook); if (m.premise) wz.premise = bi(wz.premise, m.premise); if (m.you) wz.you = bi(wz.you, m.you);
    wz.en94 = 1;
  } catch (e) { try { console.warn("[off94 en]", e); } catch (_) {} }
  finally {
    S.lang = lang0;
    try { if (tmp) { const we = wd(tmp.wid || tmp); if (we) { (we.cast || []).forEach(id => { delete S.mine.chars[id]; delete S.art[id]; }); delete S.mine.worlds[we.id]; } S.works = (S.works || []).filter(x => x.id !== (tmp.wid || tmp)); } } catch (_) {}
    off94Names(); save();
  }
}
/* grab the play response so the English script can be merged after the Chinese build */
const _capi94 = capi;
capi = async function (path, o) {
  const r = await _capi94.apply(this, arguments);
  try {
    if (typeof path === "string" && /^\/works/.test(path) && r && r.j) {
      const loc = w => { if (!w) return; Object.keys(w).forEach(k => { if (typeof w[k] === "string" && /^MIRU (官方|Originals)$/.test(w[k])) w[k] = CL() === "zh" ? "MIRU 官方" : "MIRU Originals"; }); if (w.en && CL() !== "zh") { if (w.en.title) w.title = w.en.title; if (w.en.hook) w.hook = w.en.hook; } else if (CL() === "zh" && typeof w.title === "string") w.title = zh94(w.title); };
      (r.j.works || []).forEach(loc);
      if (/play=1/.test(path)) { const m = /id=([^&]+)/.exec(path); if (m) (OFF94.play = OFF94.play || {})[decodeURIComponent(m[1])] = r; }
    }
  } catch (_) {}
  return r;
};
const _installWork94en = installWork;
installWork = async function (id) {
  const wid = await _installWork94en.apply(this, arguments);
  try { if (S.off76 && S.off76[id]) { S.off76[id].v94 = 1; save(); } } catch (_) {}
  try { const r = (OFF94.play || {})[id], P = r && r.j && r.j.pack, w = wid && wd(wid);
    if (P && P.script_en && w && !w.en94) { OFF94.cur = { id }; try { await off94Assets(id); off94MergeEn(wid, P); } finally { OFF94.cur = null; } }
    if (OFF94.play) delete OFF94.play[id]; } catch (_) {}
  return wid;
};
/* searching by name finds a story even if it's outside your BL / BG / GL preference */
(function () { const _orOK94 = orOK; orOK = function (w) { try { if (typeof disc !== "undefined" && disc.mode === "stories" && (disc.q || "").trim() && $("#discRes")) return true; } catch (_) {} return _orOK94.apply(this, arguments); }; })();

/* official cards in search: real cover if there is one, otherwise the opening film plays as a silent preview */
function off94Cards(root) {
  (root || document).querySelectorAll("[data-cwork] .off89ph").forEach(ph => {
    const id = ph.closest("[data-cwork]").dataset.cwork; if (ph.dataset.h94) return; ph.dataset.h94 = 1;
    off94Assets(id).then(A => { if (!ph.isConnected) return; const art = ph.parentNode;
      if (A.cover) { ph.outerHTML = '<img src="' + esc(A.cover) + '" alt="">'; return; }
      if (A.vid_open) { ph.outerHTML = '<video class="v94" src="' + esc(A.vid_open) + '"' + (A.poster ? ' poster="' + esc(A.poster) + '"' : '') + ' muted autoplay loop playsinline preload="metadata"></video>';
        const v = art.querySelector("video.v94"); if (v) { v.muted = true; v.play().catch(() => {}); } return; }
      if (A.poster) ph.outerHTML = '<img src="' + esc(A.poster) + '" alt="">'; });
  });
}
new MutationObserver(() => { try { if (document.querySelector("[data-cwork] .off89ph:not([data-h94])")) off94Cards(); } catch (_) {} }).observe(document.body, { childList: true, subtree: true });
(function () { const st = document.createElement("style"); st.textContent = `[data-cwork] .art video.v94,[data-cwork] .art img{width:100%;height:100%;object-fit:cover;display:block}`; document.head.appendChild(st); })();
/* ================= new official stories at the very front: home short-drama feed + Discover ================= */
const OFFF94 = { list: null, at: 0 };
async function off94Feed() {
  if (OFFF94.list && Date.now() - OFFF94.at < 120000) return OFFF94.list;
  let L = []; try { L = await off89Load(); } catch (_) {}
  if (!L || !L.length) { try { const r = await capi("/works?feed=featured&limit=50"); L = ((r && r.j && r.j.works) || []).filter(w => w.featured); } catch (_) {} }
  const out = [];
  for (const w of (L || [])) { try { const A = await off94Assets(w.id); if (A.vid_open || A.cover || A.poster) out.push(Object.assign({}, w, { A })); } catch (_) {} }
  OFFF94.list = out; OFFF94.at = Date.now(); return out;
}
/* a Chinese title must not carry its English name ("冰场之外 Off the Ice" → "冰场之外") */
function zh94(s) { s = String(s || ""); return /[\u4e00-\u9fff]/.test(s) ? s.replace(/\s+[A-Za-z][A-Za-z0-9'’:&,!?. -]*$/, "").replace(/^[A-Za-z][A-Za-z0-9'’:&,!?. -]*\s+(?=[\u4e00-\u9fff])/, "").trim() : s; }
function off94Title(w) { const zh = CL() === "zh"; return zh ? zh94(w.title || "") : ((w.en && w.en.title) || w.title || ""); }
function off94Hook(w) { const zh = CL() === "zh"; return (!zh && w.en && w.en.hook) || w.hook || ""; }
function off94FCard(w) {
  const A = w.A, pos = A.cover || A.poster || "";
  const bg = A.vid_open ? '<video class="fvid" loop playsinline preload="none"' + (pos ? ' poster="' + esc(pos) + '"' : '') + ' data-src="' + esc(A.vid_open) + '"></video>' : '<img class="fimg" src="' + esc(pos) + '" alt="">';
  return '<section class="fcard off94" data-off94="' + esc(w.id) + '">' + bg + '<div class="fveil"></div>' +
    '<div class="finfo fmin"><span class="fp or ' + esc(w.orient || "bg") + '">' + (CL() === "zh" ? (w.orient === "bl" ? "男男" : w.orient === "gl" ? "女女" : "男女") : (w.orient === "bl" ? "BL" : w.orient === "gl" ? "GL" : "M/F")) + '</span> <span class="fp new94">✦ MIRU ' + (CL() === "zh" ? "新剧" : "New") + '</span>' +
    '<div class="frow"><button class="ftitle" data-off94="' + esc(w.id) + '">' + esc(off94Title(w)) + '<small> ›</small></button></div><p class="fhook94">' + esc(off94Hook(w)) + '</p>' +
    '<button class="btn btn-p btn-sm fplay94" data-off94="' + esc(w.id) + '">▶ ' + (CL() === "zh" ? "开始看" : "Play") + '</button></div></section>';
}
const _renderHome94 = renderHome;
renderHome = function (v) {
  const r = _renderHome94.apply(this, arguments);
  try {
    const put = L => { const feed = $("#feed"); if (!feed || feed.querySelector(".off94") || !L.length) return; feed.insertAdjacentHTML("afterbegin", L.map(off94FCard).join("")); const em = feed.querySelector(".empty"); if (em) em.remove(); feedWire(); };
    if (OFFF94.list) put(OFFF94.list); else off94Feed().then(put);
  } catch (_) {}
  return r;
};
function off94RCard(w) {
  const A = w.A, pos = A.cover || A.poster || "";
  return '<button class="rcard" data-off94="' + esc(w.id) + '"><div class="rart">' + (A.vid_open ? '<video src="' + esc(A.vid_open) + '"' + (pos ? ' poster="' + esc(pos) + '"' : '') + ' muted autoplay loop playsinline preload="metadata"></video>' : '<img src="' + esc(pos) + '" alt="">') +
    '<span class="rbadge">✦ ' + (CL() === "zh" ? "新剧" : "New") + '</span></div><b>' + esc(off94Title(w)) + '</b><span>' + esc(off94Hook(w)).slice(0, 40) + '</span></button>';
}
const _discMain94 = discMain;
discMain = function () {
  let h = _discMain94.apply(this, arguments);
  const L = OFFF94.list;
  if (L && L.length) { const sh = '<div class="shelf off94s"><div class="shd"><h3>✦ ' + (CL() === "zh" ? "MIRU 新剧" : "New from MIRU") + '</h3></div><div class="rail2">' + L.map(off94RCard).join("") + '</div></div>';
    const i = h.indexOf('<div class="shelf'); h = i >= 0 ? h.slice(0, i) + sh + h.slice(i) : sh + h; }
  else off94Feed().then(L2 => { if (L2.length && $("#htabBody") && !$(".off94s") && typeof discChip !== "undefined" && discChip === "main") { const b = $("#htabBody"); b.innerHTML = discBody(); } });
  return h;
};
document.addEventListener("click", async e => {
  const x = e.target.closest("[data-off94]"); if (!x) return; e.preventDefault(); e.stopPropagation();
  if (x.dataset.busy) return; x.dataset.busy = 1;
  try { const wid = await installWork(x.dataset.off94); if (wid) { try { if (typeof openStory === "function") openStory(wid); else startSheet(wid); } catch (_) { try { startSheet(wid); } catch (__) {} } } } finally { delete x.dataset.busy; }
}, true);
(function () { const st = document.createElement("style"); st.textContent = `.fcard.off94 .fimg{object-fit:cover}.fp.new94{background:var(--gold,#F0B77E);color:#241a10}.fhook94{margin:6px 0 10px;font-size:13.5px;line-height:1.5;color:#fffd;max-width:88%;text-shadow:0 1px 6px #000a}.fplay94{pointer-events:auto}
.off94s .rart video{width:100%;height:100%;object-fit:cover;display:block}`; document.head.appendChild(st); })();
setTimeout(() => { off94Feed().then(L => { try { if (L.length && S.lastTab === "home" && $("#feed") && !$("#feed .off94")) renderHome($("#tabv")); } catch (_) {} }); }, 2500);

/* The app ships its own languages. Stop the browser's page translator from rewriting the UI
   (it translated the tabs to English while new cards stayed Chinese, mixing the two). */
function noXlate94() { const h = document.documentElement; h.setAttribute("translate", "no"); h.classList.add("notranslate"); const l = (typeof S !== "undefined" && S.lang) || "en"; h.lang = l === "zh" ? "zh-CN" : l; }
noXlate94();
{ const _rh = renderHome; renderHome = function () { noXlate94(); return _rh.apply(this, arguments); }; }

/* ================= v5.9.4 · play any role =================
   The official scripts are written in second person: "你" is the scripted protagonist (the rookie / the scribe / Gu Zhao).
   The importer used to guess the reader's role from who speaks after choices, so the sheet offered only "Play Evan".
   Now: the protagonist is a real character (default role, owns the choices), and every named character can be played —
   their lines become your turns (say the written line or improvise; the cast answers live). */
const YOU94 = [["埃文", "新队员", "The Rookie", "m"], ["凯兰", "记录员", "The Scribe", "f"], ["陆识野", "顾昭", "Gu Zhao", "f"]];
function you94Of(doc) { const names = (doc.chars94 || []).map(a => a[0]); return YOU94.find(y => names.includes(y[0])) || ["", "主角", "The Lead", "f"]; }
function off94You94Parse(next, text) {
  const doc = next(text);
  if ((doc.chars94 || []).length) { doc.you94 = 1; doc.sp["你"] = Math.max(doc.sp["你"] || 0, 1); doc.cast = (doc.cast || []).filter(n => n !== "你").concat(["你"]); doc.pov = "你"; }
  return doc;
}
function off94You94Build(next, doc, as) {
  const r = next(doc, doc && doc.you94 ? "你" : as);
  try {
    if (!doc || !doc.you94) return r;
    const w = wd(r && (r.wid || r)); if (!w) return r;
    const yid = w.cast.find(id => ch(id) && ch(id).n === "你"); if (!yid) return r;
    const Y = you94Of(doc), c = S.mine.chars[yid];
    c.n = Y[1]; c.n94 = { zh: Y[1], en: Y[2] }; c.g = Y[3]; c.you94 = 1; c.role = { zh: "主角 · 你", en: "Lead · you" };
    w.you94 = yid; w.pack.pov = yid;
    const zh = s => ({ zh: s, en: s });
    const others = w.cast.filter(id => id !== yid && ch(id) && !["医院"].includes(ch(id).n) && (doc.chars94 || []).some(a => a[0] === (ch(id).n94 ? ch(id).n94.zh : ch(id).n)));
    w.pack.join = [{ as: yid, t: { zh: "剧本原定的主角视角：每个关键选择都由你来做", en: "The story's own lead: every key choice is yours" } }]
      .concat(others.map(id => { const n = ch(id).n; return { as: id, t: { zh: "轮到" + n + "时由你来说——照剧本说，或者自由发挥，其他人会接着你演", en: "When it's " + n + "'s turn, you speak — follow the script or improvise; the cast plays off you" } }; }));
    w.cast = w.cast.filter(id => id !== yid).concat([yid]);
  } catch (e) { try { console.warn("[off96]", e); } catch (_) {} }
  return r;
}
PARSE.use("app94:you94", { parse: off94You94Parse, build: off94You94Build });
/* names for "扮演 X" on the sheet follow the app language */
(function () { const _pan = packAsName; packAsName = function (w, as) { try { off94Names(); } catch (_) {}
  const c = w && w.official76 && as && as !== "watch" && as !== "side" && ch(as); if (c) return t("pk.as", { n: c.n }); return _pan.apply(this, arguments); }; })();
/* playing someone other than the lead: second-person narration is about the lead, so name her/him */
function you94Swap(th, txt) {
  try {
    const w = th && wd(th.wid); if (!w || !w.you94 || !th.pk || th.pk.as === w.you94 || typeof txt !== "string") return txt;
    const c = ch(w.you94); if (!c) return txt; const zh = /[一-鿿]/.test(txt);
    if (zh) { const n = (c.n94 && c.n94.zh) || c.n; return txt.replace(/你们/g, "他们").replace(/你/g, n); }
    const n = (c.n94 && c.n94.en) || c.n;
    return txt.replace(/\bYou're\b/g, n + " is").replace(/\byou're\b/g, n + " is").replace(/\bYour\b/g, n + "'s").replace(/\byour\b/g, n + "'s").replace(/\bYou\b/g, n).replace(/\byou\b/g, n);
  } catch (_) { return txt; }
}
(function () { /* 2026-10-27：msgHTML 包装 → MSGKIND 登记（wrap 类：换入参再交给内层）。逻辑逐字未改。 */
  MSGKIND.wrap("app94_official2.js", function (m, i, th) {
  if (m && th && th.pk && (m.who === "n" || m.k === "act") && typeof m.txt === "string") { const s = you94Swap(th, m.txt); if (s !== m.txt) m = Object.assign({}, m, { txt: s }); }
  if (m && th && th.pk && m.k === "box" && Array.isArray(m.parts)) { const P = m.parts.map(p => p && typeof p.txt === "string" && (!p.who || p.who === "n") ? Object.assign({}, p, { txt: you94Swap(th, p.txt) }) : p); m = Object.assign({}, m, { parts: P }); }
  return m; }); })();
/* installs made before v5.9.4 are rebuilt once so they get the new roles */
const _installWork96 = installWork;
installWork = async function (id) {
  try { const h = S.off76 && S.off76[id]; if (h && !h.v96) { h.ver = -1; } } catch (_) {}
  const wid = await _installWork96.apply(this, arguments);
  try { if (S.off76 && S.off76[id]) { S.off76[id].v96 = 1; save(); } } catch (_) {}
  return wid;
};

/* installed official stories: Chinese side of the title/hook has no English tail */
{ const _iw97 = installWork; installWork = async function () { const wid = await _iw97.apply(this, arguments);
  try { const w = wid && wd(wid); if (w && w.official76) ["title", "hook", "premise"].forEach(k => { if (w[k] && typeof w[k] === "object" && w[k].zh) w[k].zh = zh94(w[k].zh); }); } catch (_) {} return wid; }; }

/* stories installed before v5.9.5 keep "冰场之外 Off the Ice" in their Chinese title — clean them once on load */
setTimeout(() => { try { let n = 0; Object.values(S.mine.worlds || {}).forEach(w => { if (!w || !w.official76) return; ["title", "hook", "premise"].forEach(k => { if (w[k] && typeof w[k] === "object" && w[k].zh) { const v = zh94(w[k].zh); if (v !== w[k].zh) { w[k].zh = v; n++; } } }); }); if (n) save(); } catch (_) {} }, 0);

/* ================= v5.9.5 · one language per screen =================
   Chinese UI: no English except people's names. English UI: no Chinese. */
(function () { const _me = me; me = function () { try { const p = persona(); if (p && p.name) return p.name; } catch (_) {} return ({ zh: "你", ja: "あなた", ko: "나", es: "Tú" })[S.lang] || "You"; }; })();
const OFF94_EN = { "陆识野": "Lu Shiye", "方叙": "Fang Xu", "林小满": "Lin Xiaoman", "老周": "Director Zhou", "顾母": "Mom", "医院": "Hospital", "顾昭": "Gu Zhao",
  "凯兰": "Caelan", "罗温": "Rowan", "埃莉拉": "Elira", "马雷克": "Marek", "埃文": "Evan", "马特奥": "Mateo", "丹娜": "Dana", "哈珀": "Harper", "梅森": "Mason",
  "新队员": "The Rookie", "记录员": "The Scribe" };
(function () { const _on = off94Names; off94Names = function () {
  try { Object.values(S.mine.chars || {}).forEach(c => { if (c && !c.n94 && OFF94_EN[c.n]) c.n94 = { zh: c.n, en: OFF94_EN[c.n] }; }); } catch (_) {}
  try { const zh = CL() === "zh"; Object.values(S.mine.worlds || {}).forEach(w => { if (w && w.official76) w.author = zh ? "MIRU 官方" : "MIRU Originals"; }); } catch (_) {}
  return _on.apply(this, arguments); }; off94Names(); })();

/* ================= v5.9.9 · “AI 帮我想”: real in-context reply ideas on your turn ================= */
async function aiIdeas97(th) {
  const zh = CL() === "zh";
  const as = th.pk && th.pk.as, c = as && ch(as), who = c ? first(c.n) : (me() || (zh ? "你" : "You"));
  const st = th.pk && th.pk.stop, hint = st && st[2] && (Lz(st[2].hint) || st[2].q || "");
  const line = m => { const w = m.who === "me" ? who : m.who === "n" || m.who === "sys" ? "" : (ch(m.who) ? first(ch(m.who).n) : ""); const t = String(m.txt || (m.parts || []).map(p => p.txt).join(" ") || "").replace(/\s+/g, " ").slice(0, 200); return t ? (w ? w + ": " : "") + t : ""; };
  const hist = (th.msgs || []).slice(-14).map(line).filter(Boolean).join("\n");
  const p = (zh ? "你在帮一位读者玩互动剧。读者现在扮演「" + who + "」。根据最近的剧情，替读者想 3 句此刻可以说的话：符合人物、口语、每句不超过 30 字，三句态度要不同（比如一句强硬、一句试探、一句柔软）。不要替别人说话，不要旁白。"
                : "You help a reader play an interactive drama. The reader is playing \"" + who + "\". From the recent scene, write 3 things they could say right now: in character, spoken, under 20 words each, three different attitudes (firm / probing / soft). No narration, nobody else's lines.")
    + (hint ? (zh ? "\n此刻的问题：" : "\nThe moment: ") + hint : "") + "\n\n" + hist
    + '\n\nReply with ONLY JSON: {"replies":["...","...","..."]} in ' + (zh ? "Simplified Chinese" : "English") + ".";
  const r = await ask(p, { maxTokens: 300 });
  return ((r && r.replies) || []).map(s => String(s).trim()).filter(Boolean).slice(0, 3);
}
async function aiIdeasGo97(btn) {
  const th = S.threads[curT]; if (!th) return; const zh = CL() === "zh";
  if (btn) { btn.disabled = true; btn.dataset.t0 = btn.textContent; btn.textContent = zh ? "✨ 正在想…" : "✨ Thinking…"; }
  try { const L = await aiIdeas97(th); if (L.length) { setSugg(L); const box = $("#ai97o"); if (box) box.innerHTML = L.map(x => (typeof objGuard70 === "function" ? objGuard70(x) : String(x))).filter(Boolean).map(x => '<button data-sg="' + esc(x) + '">' + esc(x) + '</button>').join(""); } else toast(zh ? "没想出来，再点一次试试" : "Nothing came up — try again"); }
  catch (e) { toast(zh ? (e && e.code === "na" ? "AI 现在不可用" : "没想出来，再点一次试试") : (e && e.code === "na" ? "AI isn't available right now" : "Nothing came up — try again")); }
  finally { if (btn && btn.isConnected) { btn.disabled = false; btn.textContent = btn.dataset.t0; } }
}
(function () {
  const _sh = stopHTML;
  stopHTML = function (th) {
    const h = _sh.apply(this, arguments);
    try { const b = th && th.pk && th.pk.stop; if (!b || !h) return h;
      const k = b[1], mine = k === "myline" || (k === "line" && th.pk.as && th.pk.as === (ch(b[0]) ? b[0] : null)) || th.pk.talk || (b[2] && typeof Lz(b[2].hint) === "string" && Lz(b[2].hint).indexOf("⁣") === 0);
      if (!mine && k !== "line") return h; const zh = CL() === "zh";
      /* 2026-10-27 Ann：按钮挪到标题行右上角（原来在最下面，和「就这么说」挤在一起）。
   标题行是 <div class="chh">…</div>，把按钮塞到它闭合之前；结果气泡框 #ai97o 仍留在面板末尾。 */
 const BTN = '<span class="ai97h"><button data-ai97="1">✨ ' + (zh ? "AI 帮我想" : "Help me say it") + '</button></span>';
 let out = h;
 if (/<div class="chh">[\s\S]*?<\/div>/.test(out)) out = out.replace(/(<div class="chh">[\s\S]*?)<\/div>/, '$1' + BTN + '</div>');
 else out = out + BTN;
 /* 2026-10-27 Ann：候选句放上面。插在「用你自己的话说」那一段之前。 */
 const AIBOX = '<div class="ai97o" id="ai97o"></div>';
 const wordsMark = out.indexOf('ch27.words');
 if (wordsMark > 0) {
  const pStart = out.lastIndexOf('<p class="chl">', wordsMark);
  if (pStart > 0) return out.slice(0, pStart) + AIBOX + out.slice(pStart);
 }
 return out + AIBOX;
    } catch (_) { return h; } };
  document.addEventListener("click", e => { const b = e.target.closest("[data-ai97]"); if (b) { e.stopPropagation(); aiIdeasGo97(b); } }, true);
  /* the ✦ ideas tool asks the AI too instead of canned lines */
  document.addEventListener("click", e => { const b = e.target.closest("[data-ideas]"); if (!b) return; const th = S.threads[curT]; if (!th || !th.pk) return; e.stopPropagation(); aiIdeasGo97(null); }, true);
  const st = document.createElement("style"); st.textContent = `.chh{display:flex;align-items:center;gap:8px}.chh .chback{order:1}.chh b{order:2;margin-left:auto}.chh .ai97h{order:3;margin-left:0}.ai97h{display:flex;align-items:center}.ai97h>button{border:1px solid rgba(240,183,126,.55);background:rgba(240,183,126,.12);color:#F6D3AE;border-radius:999px;padding:5px 11px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap}.ai97{margin:10px 0 0;text-align:center}.ai97>button{border:1px solid rgba(240,183,126,.55);background:rgba(240,183,126,.12);color:#F6D3AE;border-radius:999px;padding:8px 16px;font-weight:700;font-size:13px}.ai97>button:disabled{opacity:.6}.ai97o{display:flex;flex-direction:column;gap:6px;margin-top:8px}.ai97o button{text-align:left;border:1px solid rgba(255,255,255,.14);background:rgba(255,255,255,.06);color:#fff;border-radius:12px;padding:9px 12px;font-size:14px}`; document.head.appendChild(st);
})();

/* ================= v6.0 · your-turn dock =================
   When it's your turn, the choice card and the input bar become one panel at the bottom:
   one header line (who you are + the question), compact options, preview / AI-help as small chips, then the input. */
const GENERIC97 = /^(轮到你说|你怎么做？?|你想怎么回他？?|Your turn|What do you do\??|How do you answer\??)$/i;
function dock97() {
  try {
    const pw = $("#pkwrap"), comp = $(".composer"), box = $("#msgs"); if (!pw || !comp || !box) return;
    const panel = pw.querySelector(".pkpanel.stop");
    /* 2026-10-27 Ann：对话框样式没套上 —— 原来要求同时有「态度选项」和「你的回合标签」，
       缺一个就不 dock。现在只要面板里有玩家输入框或 AI 按钮，就按「轮到你了」处理。 */
 const mine = panel && (panel.querySelector("#chTxt") || panel.querySelector("[data-ai97]") || panel.querySelector(".chatt") || panel.querySelector(".pkopts")) && (panel.querySelector(".sttag.you") || panel.querySelector("[data-ai97]") || panel.querySelector("#chTxt"));
    const sg = $("#sugg");
    if (!mine) { if (pw.classList.contains("dock97")) { pw.classList.remove("dock97"); box.appendChild(pw); } if (sg) sg.style.display = ""; return; }
    if (pw.nextElementSibling !== comp) comp.parentNode.insertBefore(pw, comp);
    pw.classList.add("dock97"); if (sg) sg.style.display = "none";
    if (panel.dataset.d97) return; panel.dataset.d97 = "1";
    /* one header line */
    const tag = panel.querySelector(".sttag.you"), ask = panel.querySelector(".pkask"), chq = panel.querySelector(".chq");
    let q = ask && !GENERIC97.test(ask.textContent.trim()) ? ask.textContent.trim() : (chq ? chq.textContent.trim() : (ask ? ask.textContent.trim() : ""));
    const hd = document.createElement("div"); hd.className = "dk97h";
    hd.innerHTML = (tag ? '<span class="dk97who">' + tag.innerHTML + '</span>' : '') + (q ? '<b>' + esc(q) + '</b>' : '');
    [tag, ask, chq].forEach(x => x && x.remove());
    panel.insertBefore(hd, panel.firstChild);
    panel.querySelectorAll(".pkhint").forEach(x => x.remove());
    /* preview + AI help side by side */
    const pv = panel.querySelector(".paybtn.pv"), ai = panel.querySelector(".ai97"), aib = ai && ai.querySelector("[data-ai97]");
    if (pv || aib) { const row = document.createElement("div"); row.className = "dk97row"; if (pv) row.appendChild(pv); if (aib) row.appendChild(aib); (ai || panel).parentNode === panel && ai ? panel.insertBefore(row, ai) : panel.appendChild(row); }
  } catch (e) { try { console.warn("[dock97]", e); } catch (_) {} }
}
/* 2026-10-27：从「包 renderChat」搬成钩子（第二个样板）。
   packRefresh 那一层仍保留包装 —— 钩子只在渲染后跑，刷新后也要跑的东西还得另说。 */
{ if (window.UI && typeof window.UI.add === "function") window.UI.add("dock97", dock97);
  else { const _rc = renderChat; renderChat = function () { const r = _rc.apply(this, arguments); dock97(); return r; }; }
  const _pr = packRefresh; packRefresh = function () { const r = _pr.apply(this, arguments); dock97(); return r; }; }
(function () { const st = document.createElement("style"); st.textContent = `
#pkwrap.dock97{flex:none;align-self:stretch;margin:0;max-height:48vh;overflow-y:auto;background:rgba(12,11,16,.86);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid rgba(255,255,255,.08);border-radius:20px 20px 0 0;padding:12px 12px 6px}
#pkwrap.dock97+.composer{border-top:0;padding-top:4px;background:rgba(12,11,16,.86)}
#pkwrap.dock97 .pkpanel{margin:0;padding:0;background:transparent;border:0;box-shadow:none;backdrop-filter:none}
#pkwrap.dock97 .pkhd{display:none}
.dk97h{display:flex;flex-wrap:wrap;align-items:center;gap:6px 8px;margin:0 2px 10px;font-size:14px;line-height:1.4}
.dk97h .dk97who{flex:none;font-size:11px;font-weight:800;padding:3px 9px;border-radius:999px;background:linear-gradient(135deg,#F0B77E,#EE6F97);color:#1B1017}
.dk97h b{color:#fff;font-weight:700}
#pkwrap.dock97 .chatt{grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}
#pkwrap.dock97 .chatt button{padding:9px 11px;border-radius:14px}
#pkwrap.dock97 .chatt button span{font-size:13px;line-height:1.4}
#pkwrap.dock97 .pkopts{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px;margin:0}
#pkwrap.dock97 .pkopt{margin:0;padding:9px 11px;font-size:13px}
.dk97row{display:flex;gap:8px;margin:10px 0 2px;padding-right:76px;overflow-x:auto;scrollbar-width:none}
.dk97row [data-ai97]{border:1px solid rgba(240,183,126,.55);background:rgba(240,183,126,.12);color:#F6D3AE;font-weight:700}
.dk97row>button{flex:1 1 0;min-width:max-content;margin:0!important;padding:7px 12px!important;font-size:12px!important;border-radius:999px!important}
#pkwrap.dock97 .ai97{margin:0}#pkwrap.dock97 .ai97o:empty{display:none}#pkwrap.dock97 .ai97o{margin-top:8px}
#pkwrap.dock97 .ai97o button{font-size:13px;padding:8px 11px}`; document.head.appendChild(st); })();

/* ================= v6.0.2 · games + photos in the official stories =================
   · game ids in the scripts are bare ("find_clue"); the 100-game library keys them "g_find_clue" — normalise, so every game actually opens
   · a "photo" moment uses the story's own art for that moment (the CG just shown, else the next one, else the scene) instead of a portrait collage */
function photoSrc98(th) {
  const w = th && wd(th.wid); if (!w || !w.official76) return null;
  if (th.pk.lastCg98) return th.pk.lastCg98;
  const A = OFF94.assets[w.community] || {};
  const nx = (th.pk.q || []).find(b => Array.isArray(b) && b[0] === "sys" && b[1] === "cg94"); if (nx) { const u = nx[2].src || A[nx[2].slot]; if (u) return u; }
  const sc = th.pk.bg && window.SCENE_FILES && window.SCENE_FILES[th.pk.bg]; return sc || null;
}
{ const _sp = stopPhoto; stopPhoto = async function (th, d) {
    const src = photoSrc98(th); if (!src) return _sp.apply(this, arguments);
    const who = stopWho(th, d), aid = "a" + Date.now(); S.album.unshift({ id: aid, cid: who, src: mediaWrap("album:"+aid, src), at: Date.now() }); if (S.album.length > 24) S.album.length = 24;
    appendMsg(th, { who: ch(who) && who !== th.pk.as ? who : "me", k: "img", aid, at: Date.now() }); save(); }; }
{ const _hp = stopHTML; stopHTML = function (th) { let h = _hp.apply(this, arguments);
    try { const b = th.pk.stop; if (b && b[1] === "photo") { const u = photoSrc98(th); if (u) h = h.replace(/(class="stthumb" style="background-image:url\()[^)]*\)/, '$1' + u + ')'); } } catch (_) {} return h; }; }
/* rebuild once so installed copies pick up the game ids */
{ const _iw98 = installWork; installWork = async function (id) { try { const h = S.off76 && S.off76[id]; if (h && !h.v98) h.ver = -1; } catch (_) {} const wid = await _iw98.apply(this, arguments); try { if (S.off76 && S.off76[id]) { S.off76[id].v98 = 1; save(); } } catch (_) {} return wid; }; }
