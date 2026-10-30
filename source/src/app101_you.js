/* ================= v8.5 · 2026-10-27 用户反馈第二轮 =================
   1 所有指向玩家的称呼一律显示为「你」：你扮演的角色的名字（全名、名、中文名）在剧情、气泡标签、旁白、地点、介绍里都替换成「你」。
   3 特效：只在「进入新场景」时按场景描写切换，剧情事件（标题/提示卡）不再临时触发天气；切换时淡出淡入，不再突然出现。
   4 道具：剧本里写 ⟦ITEM|名称|说明|图标⟧，剧情会停在一张道具卡上，你点一下才「拿起来看」，卡片翻开后收进随身物品，剧情继续。
   5 进入作品前：作品页「介绍」只保留作品简介和男主头像；剧情开头的介绍卡只保留封面、简介和男主头像。
     人物关系图（跟着你的选择变化）移到作品页「角色」标签最上面。 */
(function () {
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  /* ---------- 1 · 玩家 = 你 ---------- */
  function povOf(th, w) {
    let as = th && th.pk && th.pk.as;
    if (!as || as === "watch" || as === "side") as = w && w.pack && w.pack.pov;
    return as && ch(as) ? as : null;
  }
  function namesOf(cid) {
    const c = ch(cid); if (!c) return [];
    const L = new Set();
    const add = v => { if (!v) return; if (typeof v === "object") { add(v.zh); add(v.en); return; } v = String(v).trim(); if (v.length >= 2 && v !== "你") { L.add(v); const f = v.split(/[\s·・]/)[0]; if (f && f.length >= 2 && f !== v) L.add(f); } };
    add(c.n); add(c.n94); add(c.full); add(c.studio && c.studio.name);
    return [...L].sort((a, b) => b.length - a.length);
  }
  function youify(s, names) {
    if (!s || !names.length) return s;
    let o = s;
    names.forEach(n => {
      const e = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      o = o.replace(new RegExp("你是" + e + "[，,、]", "g"), "你，").replace(new RegExp("你——" + e + "[^，,—]*[，,]", "g"), "你，").replace(new RegExp("你扮演" + e, "g"), "你扮演的是你自己");
      o = o.replace(new RegExp(e + "(?![A-Za-z])", "g"), "你");
    });
    return o.replace(/你你/g, "你").replace(/轮到你说话时/g, "轮到你说话时");
  }
  window.miruYouify = youify;
  function walkText(root, names) {
    if (!root || !names.length) return;
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: n => { const p = n.parentElement; if (!p || /^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(p.tagName) || p.closest("[contenteditable]")) return NodeFilter.FILTER_REJECT; return NodeFilter.FILTER_ACCEPT; } });
    const L = []; while (tw.nextNode()) L.push(tw.currentNode);
    L.forEach(n => { const v = youify(n.nodeValue, names); if (v !== n.nodeValue) n.nodeValue = v; });
  }
  let YOU_BUSY = false;
  function youPass() {
    if (YOU_BUSY) return; YOU_BUSY = true;
    try {
      const chat = $("#s-chat"); const th = curT && S.threads[curT];
      if (chat && !chat.hidden && th) { const p = povOf(th, wd(th.wid)); if (p) walkText(chat, namesOf(p)); }
      const st = $("#s-story"); if (st && !st.hidden && typeof curStory !== "undefined" && curStory) { const w = wd(curStory); const run = typeof lastRun === "function" ? lastRun(curStory) : null; const p = povOf(run, w); if (p) walkText(st, namesOf(p)); }
    } catch (_) {} finally { YOU_BUSY = false; }
  }
  const mo = new MutationObserver(() => { if (!YOU_BUSY) requestAnimationFrame(youPass); });
  setTimeout(() => { try { mo.observe(document.body, { childList: true, subtree: true, characterData: true }); } catch (_) {} youPass(); }, 0);


  /* ---------- 2026-10-27 · 剧情默认「点一下才继续」（没手动选过自动播放的人都按这个） ---------- */
  const tapMode = () => S.pkTap101 !== false || S.pkSpd === 0;
  if (typeof pkWait === "function") {
    const _pw = pkWait;
    pkWait = function (th, prev, spd, ms) {
      // Enter the scene and let the cast speak before asking the player to tap/type.
      // The first real interaction ends this opening; an explicit Pause still wins.
      if (th.pk && th.pk.opening && !S.pkPaused) return _pw.call(this, th, prev, spd || 1, Math.min(ms, 5000));
      if (!tapMode()) return _pw.apply(this, arguments);
      const av = S.autoVoice; S.autoVoice = false;
      let p; try { p = _pw.call(this, th, prev, 1, 864e5); } finally { S.autoVoice = av; }
      if (av && prev && typeof speakLine === "function") { try { speakLine(prev, () => {}); } catch (_) {} }
      return p;
    };
  }
  document.addEventListener("click", e => { if (e.target.closest("[data-pkspd],[data-spdcyc],[data-spd]")) { S.pkTap101 = false; save(); } }, true);
  /* ---------- 3 · 特效：只跟场景走，淡入淡出 ---------- */
  if (typeof pkDirective === "function") {
    PKREG.add("app101_you.js", function(th, b, next){
      const evt = Array.isArray(b) && b[0] === "sys" && (b[1] === "event" || b[1] === "bg");
      if (evt) window.__noFx101 = 1;
      try { return next.apply(this, arguments); } finally { window.__noFx101 = 0; }
    });;
  }
  if (typeof fxSet === "function") {
    const _fs = fxSet;
    fxSet = function (th, k) { if (window.__noFx101 && k !== "none") return; return _fs.apply(this, arguments); };
  }
  if (typeof fxRun === "function") {
    const _fr = fxRun;
    let cur = null, tm = 0;
    fxRun = function (kind) {
      const cv = $("#cbFx"); if (!cv || kind === cur) return _fr.apply(this, arguments);
      const args = arguments, self = this; cur = kind;
      cv.style.transition = "opacity .7s ease"; cv.style.opacity = "0"; clearTimeout(tm);
      tm = setTimeout(() => { try { _fr.apply(self, args); } catch (_) {} requestAnimationFrame(() => { cv.style.opacity = kind === "none" ? "0" : "1"; }); }, 700);
    };
  }

  /* ---------- 4 · 交互道具 ⟦ITEM|名称|说明|图标⟧ ---------- */
  const IMARK = "⁤ITEM|";
  PARSE.use("app101:item", { parse: function (next, text) {
    text = String(text || "").split("\n").map(l => { const m = /^\s*⟦ITEM((?:\|[^|⟧]*)*)⟧\s*$/.exec(l); return m ? "旁白：" + IMARK + m[1].slice(1) : l; }).join("\n");
    return next(text);
  } });
  const dec = s => { try { return decodeURIComponent(s); } catch (_) { return s; } };
  if (typeof pkDirective === "function") {
    PKREG.add("app101_you.js", function(th, b, next){
      if (Array.isArray(b) && typeof b[2] === "string" && b[2].indexOf(IMARK) === 0) {
        const a = b[2].slice(IMARK.length).split("|").map(dec);
        th.pk.q.shift();
        const m = { who: "sys", k: "item101", n: a[0] || "", d: a[1] || "", ic: a[2] || "📦", open: 0, at: Date.now() };
        th.msgs.push(m); save();
        if (typeof PKPAUSE !== "undefined") PKPAUSE[th.id] = "item";
        if (curT === th.id) { renderChat(); try { scrollChat(); } catch (_) {} }
        return true;
      }
      return next.apply(this, arguments);
    });;
  }
  if (window.MSGKIND) {
    /* 2026-10-27：msgHTML 包装 → MSGKIND 登记（认领 item101）。渲染逻辑逐字未改。 */
    MSGKIND.inline("app101_you.js", ["item101"], function (m, i, th, next) {
      if (!m || m.k !== "item101") return next(m, i, th);
      return '<div class="it101' + (m.open ? " open" : "") + '" data-mi="' + i + '"><button class="it101c" data-it101="' + i + '">' +
        '<span class="it101f"><i>' + esc(m.ic) + '</i><b>' + esc(zh() ? "你发现了：" : "You found: ") + esc(m.n) + '</b><small>' + esc(zh() ? "点一下，拿起来看看" : "Tap to pick it up") + '</small></span>' +
        '<span class="it101b"><i>' + esc(m.ic) + '</i><b>' + esc(m.n) + '</b><em>' + esc(m.d) + '</em><small>' + esc(zh() ? "✓ 已收进随身物品" : "✓ Added to your things") + '</small></span></button></div>';
    });
  }
  document.addEventListener("click", e => {
    const x = e.target.closest("[data-it101]"); if (!x) return;
    const th = S.threads[curT]; if (!th) return; const m = th.msgs[+x.dataset.it101]; if (!m || m.k !== "item101" || m.open) return;
    m.open = 1; try { if (typeof pkItems === "function" && th.pk) pkItems(th)[m.n] = (pkItems(th)[m.n] || 0) + 1; } catch (_) {}
    save(); x.parentElement.classList.add("open"); try { navigator.vibrate && navigator.vibrate(20); } catch (_) {}
    setTimeout(() => { if (typeof PKPAUSE !== "undefined" && PKPAUSE[th.id] === "item") delete PKPAUSE[th.id]; }, 900);
  });

  /* ---------- 5 · 进入作品前只留简介和男主 ---------- */
  function leadsOf(w) {
    if (!w || !Array.isArray(w.cast)) return [];
    const run = typeof lastRun === "function" ? lastRun(w.id) : null, pov = povOf(run, w);
    let L = w.cast.filter(id => id !== pov && ch(id) && ch(id).g === "m");
    const top = w.cast.slice(0, 4); const near = L.filter(id => top.includes(id)); if (near.length) L = near;
    return L.slice(0, 4);
  }
  function leadsHTML(w) {
    const L = leadsOf(w); if (!L.length) return "";
    return '<div class="ld101"><div class="eyebrow">' + (zh() ? "男主" : "The leads") + '</div><div class="ld101r">' + L.map(id => '<div class="ld101c"><img src="' + esc(artSrc(id)) + '" alt=""><b>' + esc(first(ch(id).n)) + '</b></div>').join("") + '</div></div>';
  }
  function simplifyStory() {
    const st = $("#s-story"); if (!st || st.hidden || typeof curStory === "undefined") return;
    const w = wd(curStory); if (!w) return;
    const sc = st.querySelector(".scroll"); if (!sc) return;
    const pad = sc.querySelector(":scope > .pad:not(.stack)"); if (pad) pad.style.display = "none";
    const tabs = sc.querySelector(".tabs"); const body = tabs && tabs.nextElementSibling; if (!body) return;
    const on = tabs.querySelector("button.on"); const k = on && on.dataset.stab;
    if (k === "intro") {
      if (body.dataset.s101) return; body.dataset.s101 = 1;
      const kids = [...body.children]; const syn = kids.find(c => c.tagName === "P");
      kids.forEach(c => { if (c !== syn) c.style.display = "none"; });
      body.insertAdjacentHTML("beforeend", leadsHTML(w));
    } else if (k === "cast") {
      if (body.dataset.g101) return; body.dataset.g101 = 1;
      try { const g = relGraph(w); if (g) body.insertAdjacentHTML("afterbegin", g); } catch (_) {}
    }
  }
  function simplifyIntro() {
    const m = document.querySelector("#msgs .m-intro"); if (!m || m.dataset.s101) return;
    const th = curT && S.threads[curT]; const w = th && wd(th.wid); if (!w) return;
    m.dataset.s101 = 1;
    const secs = [...m.querySelectorAll(".mi-sec")];
    secs.forEach((s, i) => { if (i > 0) s.style.display = "none"; });
    const first0 = secs[0];
    if (first0) { const ps = [...first0.querySelectorAll("p")]; ps.forEach((p, i) => { if (i > 0) p.style.display = "none"; });
      if (ps.length > 1) first0.insertAdjacentHTML("beforeend", '<button class="mi101more" data-mi101more="1">' + (zh() ? "展开全部背景 ⌄" : "Show the full background ⌄") + '</button>'); }
    (first0 || m).insertAdjacentHTML("afterend", leadsHTML(w));
  }
  document.addEventListener("click", e => { const x = e.target.closest("[data-mi101more]"); if (!x) return; const s = x.closest(".mi-sec"); if (s) s.querySelectorAll("p").forEach(p => p.style.display = ""); x.remove(); });
  const mo2 = new MutationObserver(() => requestAnimationFrame(() => { try { simplifyStory(); simplifyIntro(); } catch (_) {} }));
  setTimeout(() => { try { mo2.observe(document.body, { childList: true, subtree: true }); } catch (_) {} }, 0);

  const stl = document.createElement("style");
  stl.textContent = `
.it101{display:flex;justify-content:center;margin:10px 0;perspective:900px}
.it101c{position:relative;width:min(78%,300px);height:170px;border:0;background:none;padding:0;cursor:pointer;transform-style:preserve-3d;transition:transform .8s cubic-bezier(.2,.7,.2,1)}
.it101.open .it101c{transform:rotateY(180deg);cursor:default}
.it101f,.it101b{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border-radius:16px;backface-visibility:hidden;-webkit-backface-visibility:hidden;padding:14px;text-align:center;box-shadow:0 10px 30px #0008}
.it101f{background:linear-gradient(160deg,#3a2a3f,#1b1420);border:1px solid #F0B77E66;animation:it101p 1.8s ease-in-out infinite}
.it101b{background:linear-gradient(160deg,#F7E7D2,#E9CFB0);color:#2a1d14;transform:rotateY(180deg)}
.it101f i,.it101b i{font-size:34px;font-style:normal}.it101f b{color:#F0B77E;font-size:15px}.it101f small{color:#fffa;font-size:12px}
.it101b b{font-size:15px}.it101b em{font-style:normal;font-size:13px;line-height:1.5;opacity:.85}.it101b small{font-size:11px;opacity:.6}
@keyframes it101p{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
.ld101{margin-top:12px}.ld101r{display:flex;gap:14px;flex-wrap:wrap;margin-top:8px}
.ld101c{display:flex;flex-direction:column;align-items:center;gap:6px;width:76px}.ld101c img{width:68px;height:68px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 2px #F0B77E88}
.ld101c b{font-size:13px;text-align:center}
.m-intro .ld101{padding:0 14px 12px}
.mi101more{margin-top:6px;background:none;border:0;color:var(--gold,#F0B77E);font-size:13px;padding:0}`;
  document.head.appendChild(stl);
})();

/* 2026-10-31（从 app100 搬来，自测里 document 是桩）：联想回复的「换一批」—— 丢掉这一轮的缓存，按眼前的对话重新想 3 条，避开刚才那几条 */
document.addEventListener('click', async e => {
  const btn = e.target.closest('[data-sgmore]'); if (!btn) return;
  e.preventDefault(); e.stopPropagation();
  const th = S.threads[curT]; if (!th || btn.disabled) return;
  const before = (th.sugg || []).slice(), zh = CL() === 'zh';
  btn.disabled = true; btn.textContent = zh ? '正在想…' : 'Thinking…';
  try {
    DIALOGUE_IDEAS.delete(th); DIALOGUE_AVOID.set(th, before);
    let items; try { items = await dialogueGetIdeas(th); } finally { DIALOGUE_AVOID.delete(th); }
        if (curT !== th.id) return;
    if (items.length) setSugg(items); else if (btn.isConnected) toast(zh ? '暂时想不出新的，直接打字也可以' : 'No new ideas right now — just type');
  } catch (err) { console.warn('[sgmore]', err); }
  finally { if (btn.isConnected) { btn.disabled = false; btn.textContent = '↻ ' + (zh ? '换一批' : 'More ideas'); } }
}, true);
(() => { try { const st = document.createElement('style'); st.textContent = '#sugg .sgmore{flex:none;opacity:.85;border-style:dashed!important;white-space:nowrap}'; document.head.appendChild(st); } catch (e) { console.debug('[sgmore] style', e); } })();

/* 2026-10-31：开场引导。刚进故事、还没开过口时，输入框上方挂一条「轮到你了」提示（只是界面，不进聊天记录、不进记忆），
   并给出 3 条可以开口的建议。你说出第一句后它就消失。 */
const __body_open100 = function () { try {
  const th = S.threads[curT], old = $('#open100'); const kill = () => { if (old) old.remove(); };
  if (!th || !th.pk) return kill();
  if ((th.msgs || []).some(m => m && m.who === 'me')) return kill();
  const st = th.pk.stop, playing = typeof PKPLAY !== 'undefined' && PKPLAY[th.id];
  const myTurn = (st && st[1] === 'line') || ((!th.pk.q || !th.pk.q.length) && !playing);
  if (!myTurn || (st && st[1] === 'start') || !(th.msgs || []).some(m => m && ch(m.who))) return kill();
  const zh = CL() === 'zh', c = ch(mainOf(th)) || {}, nm = first(c.n || '') || (zh ? '他' : 'them');
  const html = '<b>' + (zh ? '💬 轮到你了' : '💬 Your turn') + '</b> ' + esc(zh ? ('直接打字跟' + nm + '说话——问问题、表态，或用 *星号* 写动作都行。不知道说什么？点下面的建议。') : ('Type to talk to ' + nm + ' — ask, react, or *do something*. Stuck? Tap a suggestion.'));
  const comp = $('#s-chat .composer'); if (!comp) return;
  if (!old) comp.insertAdjacentHTML('beforebegin', '<div id="open100" class="open100">' + html + '</div>');
  if (!th.open100 && !busy) { th.open100 = 1; save(); setTimeout(() => { try { aiIdeasGo97($('#s-chat [data-ai97]')); } catch (e) { console.warn('[open100] ideas', e); } }, 300); }
} catch (e) { console.warn('[open100]', e); } };
(() => { try { const st = document.createElement('style'); st.textContent = '.open100{margin:0 10px 6px;padding:8px 12px;border-radius:12px;background:rgba(10,8,14,.7);backdrop-filter:blur(6px);color:#F6F1EC;font-size:13px;line-height:1.5}.open100 b{color:var(--gold,#F0B77E)}'; document.head.appendChild(st); } catch (e) { console.debug('[open100] style', e); } })();
if (window.UI && typeof window.UI.add === 'function') window.UI.add('open100', __body_open100);
