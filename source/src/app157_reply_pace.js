/* ===== app157 · 阅读节奏（2026-11-21）=====
   玩家：「剧本的文字回复太快，而且太乱，来不及阅读。」

   先把「快多少」量出来（本仓库 536 条台词 / 209 段旁白，见 tools/reading-pace-report.mjs）：
     · 台词中位数 17 字、p90 29 字、最长 68 字；
     · 旁白中位数 41 字、p90 64 字、最长 164 字；
     · 旁白连续段中位数 1 句、p90 2 句、最长 5 句。
   旧行为（app144 · 2026-11-14）：每条按 `700ms + 70ms×字数` 自动放行，封顶 5 秒 ——
     17 字只给 1.9 秒（按 6 字/秒要 2.8 秒），41 字给 3.5 秒（要 6.8 秒），
     5 句并成的一块（≈200 字）也只给 5 秒（要 33 秒）。
   而且换人说话、换场景都不多留一拍，并块还把 5 句旁白压成一个没有换行的段落。
   ⇒ 读不完就被顶走，屏幕上同时在动的东西太多，就是「太快 + 太乱」。

   竞品（PolyBuzz / Tipsy / Character.AI）的共同做法，也是这一版照做的五条：
     ① 一次只推进一个「注意单位」；
     ② 读者永远掌握时钟（点一下立刻生效，任何模式下都有效）；
     ③ 自动播放只是兜底，而且按**阅读时长**算，不按固定延时；
     ④ 长文按句子分页，不把一整墙文字一次推上来；
     ⑤ 回头翻记录时不被拽回底部，也不在后台偷偷往下演。

   本模块只做这五件事，替换 app144 里那个计时器（那里现在只留一行指针）。
   开关与滑钮在 MIRU_TUNE.reading（见 TUNING.md）。 */
(function () {
  'use strict';
  if (typeof window === 'undefined' || window.__MIRU_PACE157) return;
  window.__MIRU_PACE157 = 1;

  var R = window.READING;
  if (!R || typeof R.wait !== 'function') return;

  var T = (typeof MIRU_TUNE !== 'undefined' && MIRU_TUNE.reading) || {};
  function num(v, d) { return (typeof v === 'number' && isFinite(v)) ? v : d; }
  var CFG = {
    base: num(T.baseMs, 900),              // 每条至少停留
    cjk: num(T.cjkMsPerChar, 130),         // 中文 ≈ 7.7 字/秒
    latin: num(T.latinMsPerChar, 40),      // 拉丁 ≈ 25 字符/秒
    min: num(T.minMs, 1800),
    max: num(T.maxMs, 12000),
    tail: num(T.voiceTailMs, 700),         // 朗读结束后再留这么久
    speakerGap: num(T.speakerGapMs, 400),  // 换人说话多留一拍
    sceneGap: num(T.sceneGapMs, 600),      // 换场景/旁白段多留一拍
    boxCjk: num(T.boxCjk, 100),            // 旁白并块的字数上限
    boxLatin: num(T.boxLatin, 300),
    pageCjk: num(T.pageCjk, 120),          // 单条最长字数，超过按句分页
    pageLatin: num(T.pageLatin, 320),
    slow: num(T.slowFactor, 1.35),
    fast: num(T.fastFactor, 0.75)
  };

  var CJK = /[぀-ヿ㐀-鿿가-힯]/;
  var MODES = ['slow', 'normal', 'fast', 'tap'];
  var RATES = { slow: CFG.slow, normal: 1, fast: CFG.fast, tap: 0 };

  function isCjk(s) { return CJK.test(String(s || '')); }
  /* 这一条要占多长：只认「读者实际要读的字」，不算空白 */
  function visibleLen(s) { return String(s || '').replace(/\s/g, '').length; }
  function pageLimit(s) { return isCjk(s) ? CFG.pageCjk : CFG.pageLatin; }
  function boxLimit(s) { return isCjk(s) ? CFG.boxCjk : CFG.boxLatin; }

  function mode() {
    var v = (typeof S !== 'undefined' && S && S.pace157) || 'normal';
    return MODES.indexOf(v) >= 0 ? v : 'normal';
  }
  function setMode(v) {
    try { S.pace157 = v; save(); } catch (_) {}
    paintButton();
  }
  function label(v) {
    v = v || mode();
    var zh = (typeof CL === 'function' ? CL() : 'zh') === 'zh';
    if (zh) return { slow: '慢速', normal: '标准', fast: '快速', tap: '点一下才走' }[v];
    return { slow: 'Slow', normal: 'Normal', fast: 'Fast', tap: 'Tap' }[v];
  }

  /* ---------- 1. 一条消息要停多久 ---------- */
  function speakerKey(m) {
    if (!m) return '';
    if (m.who === 'me') return 'me';
    if (m.k === 'box' || m.who === 'n' || m.k === 'act' || m.k === 'think') return '';   // 旁白/动作
    return String(m.who || '');
  }
  function textOf(m) {
    if (!m) return '';
    if (typeof m.txt === 'string' && m.txt.trim()) return m.txt;
    if (typeof m.title === 'string' && m.title.trim()) return m.title;
    if (m.say && typeof m.say.txt === 'string') return m.say.txt;
    return '';
  }
  function dwellFor(m, prev) {
    var t = textOf(m), len = visibleLen(t);
    if (!len) return CFG.min;
    var ms = CFG.base + len * (isCjk(t) ? CFG.cjk : CFG.latin);
    /* 先兜住「读完这一条」的下限，再叠加换人/换场景的那一拍 ——
       否则一条两个字台词的下限会把换人的 400ms 吞掉。 */
    ms = Math.max(CFG.min, ms);
    if (prev) {
      var a = speakerKey(prev), b = speakerKey(m);
      if (a && b && a !== b) ms += CFG.speakerGap;
      if (!b) ms += CFG.sceneGap;
    }
    ms = Math.min(CFG.max, ms);
    var rate = RATES[mode()] || 0;
    return rate ? Math.round(ms * rate) : 0;   // 0 = 只等你点
  }

  /* ---------- 2. 不抢读者的地方：后台标签页、往上翻记录 ---------- */
  var stuck = true;   // 读者是否还在底部
  function readingUp() { return !stuck; }
  try {
    document.addEventListener('scroll', function (ev) {
      var box = ev.target;
      if (!box || box.id !== 'msgs') return;
      stuck = (box.scrollHeight - box.scrollTop - box.clientHeight) < 120;
    }, true);
    document.addEventListener('visibilitychange', function () { stuck = true; });
  } catch (_) {}

  /* ---------- 3. 一次推进一条，按阅读时长（tap 时永不自动推进） ---------- */
  var CLOCKS = new Map();   // entry -> {timer,left,last}
  function stopClock(entry) {
    var c = CLOCKS.get(entry);
    if (c && c.timer) clearTimeout(c.timer);
    CLOCKS.delete(entry);
  }
  function voiceBusy() {
    try { return !!(R.voice && typeof R.voice.busy === 'function' && R.voice.busy()); } catch (_) { return false; }
  }
  function startClock(th, entry, message, prev) {
    stopClock(entry);
    var total = dwellFor(message, prev);
    if (!total) return;
    var c = { left: total, last: Date.now(), timer: 0, wasBusy: false };
    CLOCKS.set(entry, c);
    var step = function () {
      if (R.pending.get(th.id) !== entry) { stopClock(entry); return; }
      var now = Date.now();
      /* 这一句正在朗读：它就是在替读者读。时钟停住，读完只留一小段尾音，
         而不是读完还要再等一遍整条阅读时长（那是把同一句读了两遍）。 */
      if (voiceBusy()) {
        c.wasBusy = true; c.last = now;
        c.timer = setTimeout(step, 250);
        return;
      }
      if (c.wasBusy) { c.wasBusy = false; c.left = Math.min(c.left, CFG.tail); c.last = now; }
      /* 后台标签页 / 正在往上翻记录：时钟不走，也不抢进度 */
      if ((typeof document !== 'undefined' && document.hidden) || readingUp()) {
        c.last = now;
        c.timer = setTimeout(step, 250);
        return;
      }
      c.left -= now - c.last; c.last = now;
      if (c.left <= 0) { stopClock(entry); entry.finish(); return; }
      c.timer = setTimeout(step, Math.max(80, Math.min(250, c.left)));
    };
    c.timer = setTimeout(step, Math.min(250, c.left));
  }

  var baseWait = R.wait;
  R.wait = function (th, message, kind) {
    /* 「上一条」必须排除这一条自己：AI 回复是先 appendMsg 再 wait，
       剧本是 wait 完才 append —— 两种顺序都要拿到真正的上一条，否则换人那一拍永远不触发。 */
    var list = (th && th.msgs) || [];
    var prev = list.length ? list[list.length - 1] : null;
    if (prev === message) prev = list[list.length - 2] || null;
    var p = baseWait.apply(this, arguments);
    try {
      var entry = th && R.pending.get(th.id);
      if (!entry || entry._pace157) return p;
      entry._pace157 = 1;
      var real = entry.finish;
      entry.finish = function () { stopClock(entry); return real.apply(this, arguments); };
      startClock(th, entry, message, prev);
      paintButton();
    } catch (e) {
      if (typeof console !== 'undefined' && console.warn) console.warn('[pace157] wait', e);
    }
    return p;
  };

  /* ---------- 4. 长文按句分页 ---------- */
  function sentences(s) {
    var out = [], cur = '', i, ch;
    for (i = 0; i < s.length; i++) {
      ch = s[i]; cur += ch;
      if ('。！？!?…'.indexOf(ch) >= 0 || ch === '\n') {
        /* 吃掉紧跟的收尾引号/括号，别让「。」和「”」分到两条 */
        while (i + 1 < s.length && '”’」』）)"\''.indexOf(s[i + 1]) >= 0) { cur += s[++i]; }
        out.push(cur); cur = '';
      }
    }
    if (cur.trim()) out.push(cur);
    return out;
  }
  function hardSplit(piece, max) {
    var out = [], rest = piece;
    while (visibleLen(rest) > max) {
      var k = Math.max(rest.lastIndexOf('，', max), rest.lastIndexOf(',', max),
                       rest.lastIndexOf('；', max), rest.lastIndexOf(';', max));
      if (k < max * 0.35) k = rest.lastIndexOf(' ', max);
      if (k < max * 0.35) k = max - 1;
      out.push(rest.slice(0, k + 1).trim());
      rest = rest.slice(k + 1).trim();
    }
    if (rest) out.push(rest);
    return out;
  }
  function splitPages(text, max) {
    var s = String(text == null ? '' : text).trim();
    if (!s) return [s];
    max = max || pageLimit(s);
    if (visibleLen(s) <= max) return [s];
    var parts = sentences(s), pages = [], buf = '';
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (visibleLen(p) > max) {
        if (buf.trim()) { pages.push(buf.trim()); buf = ''; }
        hardSplit(p, max).forEach(function (x) { pages.push(x); });
        continue;
      }
      if (visibleLen(buf + p) > max && buf.trim()) { pages.push(buf.trim()); buf = ''; }
      buf += p;
    }
    if (buf.trim()) pages.push(buf.trim());
    return pages.length ? pages : [s];
  }

  /* ---------- 5. 剧本：长台词分页；旁白并块按字数封顶（别压成一墙） ---------- */
  if (typeof pkAppend === 'function') {
    var baseAppend = pkAppend;
    pkAppend = function (th, m) {
      try {
        if (th && th.pk && m) {
          /* 旁白并块：超过一屏（或已经三句）就另起一块 —— 每块各自按字数计时 */
          if (typeof isNarr === 'function' && isNarr(m)) {
            var L = th.msgs[th.msgs.length - 1];
            if (L && L.k === 'box' && L.pk && !L.say && Array.isArray(L.parts)) {
              var total = String(L.txt || '').length + String(m.txt || '').length + 1;
              if (L.parts.length >= 3 || total > boxLimit(m.txt)) th._brk = 1;
            }
          }
          /* 单条台词太长：第一页现在显示，其余按顺序塞回队列（每条各自计时、各自朗读） */
          if (m.k === 'say' && m.who !== 'n' && m.who !== 'sys' && Array.isArray(th.pk.q)) {
            var pages = splitPages(m.txt, pageLimit(m.txt));
            if (pages.length > 1) {
              m.txt = pages[0];
              th.pk.q.unshift.apply(th.pk.q, pages.slice(1).map(function (t) { return [m.who, 'say', t]; }));
            }
          }
        }
      } catch (e) {
        if (typeof console !== 'undefined' && console.warn) console.warn('[pace157] append', e);
      }
      return baseAppend.apply(this, arguments);
    };
  }

  /* ---------- 6. 滚动：读者往上翻时不拽回底部 ---------- */
  if (typeof scrollChat === 'function') {
    var baseScroll = scrollChat;
    scrollChat = function () {
      if (readingUp()) return;
      return baseScroll.apply(this, arguments);
    };
  }

  /* ---------- 7. 节奏开关（故事顶栏 · 与 🔊 并排） ---------- */
  function paintButton() {
    try {
      var head = document.querySelector('.chead');
      if (!head) return;
      var th = (typeof S !== 'undefined' && S.threads) ? S.threads[curT] : null;
      var b = head.querySelector('[data-pace157]');
      if (!th || !th.pk) { if (b) b.remove(); return; }
      if (!b) {
        b = document.createElement('button');
        b.className = 'ibtn pace157';
        b.setAttribute('data-pace157', '1');
        /* 2026-11-28 聊天页顶部「⏱ 标准」在窄屏上被挤成两行：不许换行、不许被压缩 */
        b.style.whiteSpace = 'nowrap'; b.style.flex = '0 0 auto';
        var vt = head.querySelector('.vtog') || head.querySelector('[data-cmenu]');
        if (vt && vt.parentNode) vt.parentNode.insertBefore(b, vt);
        else head.appendChild(b);
      }
      b.textContent = '⏱ ' + label();
      b.setAttribute('aria-label', label());
      b.title = label();
      b.classList.toggle('on', mode() !== 'tap');
    } catch (_) {}
  }
  try {
    document.addEventListener('click', function (ev) {
      var b = ev.target && ev.target.closest && ev.target.closest('[data-pace157]');
      if (!b) return;
      ev.preventDefault(); ev.stopImmediatePropagation();
      var next = MODES[(MODES.indexOf(mode()) + 1) % MODES.length];
      setMode(next);
      try { toast('⏱ ' + label(next)); } catch (_) {}
      /* 当前这一条按新节奏重新计时（点按模式下就是停下等你） */
      try {
        var th = S.threads[curT], entry = th && R.pending.get(th.id);
        if (entry) startClock(th, entry, entry.message, th.msgs[th.msgs.length - 1]);
      } catch (_) {}
    }, true);
  } catch (_) {}

  if (window.UI && typeof window.UI.add === 'function') window.UI.add('pace157', paintButton);
  try {
    var rc = renderChat;
    renderChat = function () { var r = rc.apply(this, arguments); paintButton(); return r; };
  } catch (_) {}

  /* 自检与开发读数（tools/reading-pace-selftest.cjs） */
  window.PACE157 = {
    cfg: CFG, dwellFor: dwellFor, splitPages: splitPages, sentences: sentences,
    speakerKey: speakerKey, visibleLen: visibleLen, mode: mode, setMode: setMode,
    stopClock: stopClock, clocks: CLOCKS, startClock: startClock, isCjk: isCjk
  };
})();


/* ===== mod210 · 2026-11-28 自由输入框 =====
   1) AI 回复生成时，聊天页会整页重画（renderChat），输入框被换成新的空框 —— 用户正在打的字「打不到屏幕上」。
      现在重画前记下输入框里的字、光标位置和是否在输入，重画后原样放回去。
   2) 输入框会自己变成两行高：发送后清空了文字，但上次按内容撑开的高度还留着。现在清空 / 发送 / 重画后都按实际内容重算高度。 */
(function () {
  "use strict";
  if (typeof document === "undefined") return;
  function fit(el) {
    if (!el) return;
    el.style.height = "";
    if (el.value) { el.style.height = "auto"; el.style.height = Math.min(120, el.scrollHeight) + "px"; }
  }
  try {
    if (typeof renderChat === "function") {
      const rc = renderChat;
      renderChat = function () {
        const ta = document.getElementById("cin");
        let v = "", ss = 0, se = 0, foc = false;
        if (ta) { v = ta.value; ss = ta.selectionStart || 0; se = ta.selectionEnd || 0; foc = document.activeElement === ta; }
        const r = rc.apply(this, arguments);
        try {
          const nt = document.getElementById("cin");
          if (nt && nt !== ta && v && !nt.value && !nt.disabled) {
            nt.value = v;
            if (foc) { try { nt.focus({ preventScroll: true }); nt.setSelectionRange(ss, se); } catch (_) {} }
          }
          fit(nt);
        } catch (_) {}
        return r;
      };
    }
  } catch (_) {}
  const later = () => setTimeout(() => fit(document.getElementById("cin")), 0);
  document.addEventListener("input", e => { if (e.target && e.target.id === "cin" && !e.target.value) fit(e.target); });
  document.addEventListener("keydown", e => { if (e.target && e.target.id === "cin" && e.key === "Enter" && !e.shiftKey) later(); });
  document.addEventListener("click", e => { if (e.target && e.target.closest && e.target.closest("[data-send]")) later(); });
  window.__mod210 = 1;
})();
