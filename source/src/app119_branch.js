/* ================= 对话分支和存档点（v9 · 第十八批 · 2026-11-03）=================
   借鉴 SillyTavern 的 checkpoint / branch：从某一步「重来」，开一条新分支，旧的原样保留。

   存档点：玩家每说一句话（doSend）、每做一次剧本选择（[data-pkpick] 章末 / [data-stopline] 场内）之前，
           自动记一份「那一刻」的状态。线程上只留最近 10 个（th.cps），对话本身不复制，只记位置 mi。
           状态 = 线程里除对话、存档点、版本以外的全部（好感、剧情进度、关系、旗、状态栏…）；
           记忆只记条数和那一刻的记忆 id，分叉时按这两样截断，不重复存。
   重来：  任意一条消息的工具条里「⑂ 从这一步重来」→ 回到它之前最近的那个存档点，复制成一条新线程
           （对话截到那一步，状态还原），直接打开；原来那条一个字不动。
   分支表：开始弹层里列出这部剧的所有分支（第几章、走到了哪个结局），点一下继续；顶上是结局收集。
   读数：控制台 __branch() 看当前线程的存档点。 */
(function () {
  "use strict";
  const KEEP = 10;
  /* persona 里可能有头像（data URL，几十 KB）⇒ 不进存档点，分叉时直接沿用原线程的 */
  const SKIP = { msgs: 1, cps: 1, mem: 1, mem2: 1, vers: 1, _pre73: 1, _ctx73: 1, persona: 1 };
  const zh = () => (typeof CL === "function" ? CL() === "zh" : S.lang === "zh");
  const L2 = (a, b) => zh() ? a : b;

  function snap(th) {
    const st = {};
    Object.keys(th).forEach(k => { if (!SKIP[k]) st[k] = th[k]; });
    return JSON.parse(JSON.stringify(st));
  }
  function checkpoint(th, kind, label) {
    try {
      if (!th || !th.msgs) return;
      const mi = th.msgs.length;
      th.cps = (th.cps || []).filter(c => c.mi < mi);           // 同一位置只留最新的
      th.cps.push({ mi: mi, at: Date.now(), kind: kind, label: String(label || "").slice(0, 40), memN: (th.mem || []).length, m2ids: (th.mem2 || []).map(x => x.id), st: snap(th) });
      if (th.cps.length > KEEP) th.cps = th.cps.slice(-KEEP);
    } catch (e) { console.warn("[branch] checkpoint", e); }
  }

  /* 玩家说话之前 */
  if (typeof doSend === "function") {
    const _ds = doSend;
    doSend = function (txt) {
      const th = S.threads[curT];
      if (th && String(txt || "").trim()) checkpoint(th, "say", txt);
      return _ds.apply(this, arguments);
    };
  }
  /* 剧本选择之前（捕获阶段，先于真正的处理） */
  document.addEventListener("click", function (e) {
    const x = e.target && e.target.closest && e.target.closest("[data-pkpick],[data-stopline]");
    if (!x) return;
    const th = S.threads[curT]; if (!th) return;
    checkpoint(th, "choice", (x.innerText || "").replace(/\s+/g, " ").trim());
  }, true);

  function cpFor(th, i) {
    const L = (th.cps || []).filter(c => c.mi <= i);
    return L.length ? L[L.length - 1] : null;
  }
  function branchNo(th) {
    const all = Object.values(S.threads).filter(o => o.wid === th.wid && o.wid);
    return all.length + 1;
  }
  function fork(th, cp) {
    const n = th.wid ? branchNo(th) : 2;
    const nt = JSON.parse(JSON.stringify(cp.st));
    const id = (String(th.id).split(":").slice(0, -1).join(":") || "t") + ":" + Date.now();
    nt.id = id;
    nt.msgs = JSON.parse(JSON.stringify(th.msgs.slice(0, cp.mi)));
    if (th.persona) nt.persona = JSON.parse(JSON.stringify(th.persona));
    nt.mem = (th.mem || []).slice(0, cp.memN);
    const keepIds = new Set(cp.m2ids || []);
    nt.mem2 = JSON.parse(JSON.stringify((th.mem2 || []).filter(x => cp.m2ids ? keepIds.has(x.id) : (x.at || 0) <= cp.at)));
    nt._m2n = Math.min(nt._m2n || 0, nt.mem.length);
    nt.cps = JSON.parse(JSON.stringify((th.cps || []).filter(c => c.mi <= cp.mi)));
    nt.branchOf = th.id; nt.branchN = n; nt.at = Date.now(); nt.unread = false;
    if (nt.title) nt.title = String(nt.title).replace(/ · 分支 \d+$| · Branch \d+$/, "") + L2(" · 分支 ", " · Branch ") + n;
    S.threads[id] = nt; save();
    try { if (typeof track === "function") track("branch_fork", { wid: th.wid || "", at: cp.mi, kind: cp.kind }); } catch (e) { console.warn("[branch] track", e); }
    openThread(id);
    toast(L2("⑂ 开了一条新分支，原来那条还在", "⑂ New branch — the old one is kept"));
    return nt;
  }

  /* 消息工具条：「⑂ 从这一步重来」 */
  if (typeof MSGKIND !== "undefined" && MSGKIND.post) {
    MSGKIND.post("app119_branch.js", function (h, m, i, th) {
      if (typeof openTools === "undefined" || openTools !== i || h.indexOf('<div class="mtools">') < 0 || !th) return h;
      const cp = cpFor(th, i); if (!cp) return h;
      return h.replace('<div class="mtools">', '<div class="mtools"><button data-fork94="' + i + '">⑂ ' + esc(L2("从这一步重来", "Redo from here")) + '</button>');
    });
  }
  document.addEventListener("click", function (e) {
    const x = e.target && e.target.closest && e.target.closest("[data-fork94]");
    if (!x) return;
    e.stopImmediatePropagation();
    const th = S.threads[curT]; if (!th) return;
    const cp = cpFor(th, +x.dataset.fork94); if (!cp) { toast(L2("这一步之前没有存档点", "No save point before this")); return; }
    fork(th, cp);
  }, true);

  /* 开始弹层里的分支表 + 结局收集（app114 的 startSheet 包装里调用） */
  window.branchListHTML = function (wid) {
    try {
      const w = wd(wid); if (!w || !w.pack) return "";
      const ths = Object.values(S.threads).filter(o => o.wid === wid && o.pk).sort((a, b) => (b.at || 0) - (a.at || 0));
      if (ths.length < 2) return "";
      const ends = w.pack.endings ? Object.keys(w.pack.endings) : [];
      const got = (typeof endingsFound === "function") ? endingsFound(wid) : 0;
      const endName = th => { const e = w.pack.endings && w.pack.endings[th.pk.end]; return e ? Lz(e.t) : th.pk.end === "complete" ? L2("已完结", "complete") : ""; };
      return '<div class="br94"><div class="eyebrow">⑂ ' + esc(L2("我的分支", "My branches")) + (got ? ' · ' + esc(L2("已解锁结局 ", "Endings found: ")) + got : '') + '</div>' +
        ths.slice(0, 8).map(th => '<button class="br94i" data-open="' + esc(th.id) + '"><b>' + esc(th.branchN ? L2("分支 ", "Branch ") + th.branchN : L2("主线", "Main")) + '</b><span>' +
          esc(L2("第 " + (th.pk.ch || 1) + " 章", "Ch. " + (th.pk.ch || 1))) + (th.pk.end ? ' · 🏁 ' + esc(endName(th)) : '') + '</span></button>').join("") + '</div>';
    } catch (e) { console.warn("[branch] list", e); return ""; }
  };

  window.__branch = function () {
    const th = S.threads[curT]; if (!th) return { err: "no thread" };
    return { id: th.id, branchOf: th.branchOf || null, cps: (th.cps || []).map(c => ({ mi: c.mi, kind: c.kind, label: c.label })) };
  };
  window.branchFork = fork; window.branchCheckpoint = checkpoint;

  (function () {
    const st = document.createElement("style");
    st.textContent = ".br94{margin-top:12px;display:flex;flex-direction:column;gap:6px}.br94i{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:9px 12px;border-radius:12px;border:1px solid var(--line);background:var(--panel2);color:var(--text);font-size:13px;text-align:left}.br94i span{color:var(--dim);font-size:12px}";
    document.head.appendChild(st);
  })();
})();
