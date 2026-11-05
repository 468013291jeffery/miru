/* ================= 剧情面板贴住输入区（2026-11-03）=================
   玩家反馈（截图）：「轮到你了 · 你想怎么回他？」那一块和下面「对谁说 + 输入框」是两个框，要融成一块。
   原来 app16_story2 把 #pkwrap 塞进对话流末尾（.inl），它跟着消息滚动，和输入区之间总隔着一段，
   CSS 怎么改都合不上。这里在每次渲染后把它挪回输入区正上方（加 .dock），shell.html 里把两块画成一张卡。
   .inl 的样式（选项像回复气泡、不显示章节头）保留，只换位置。
   appendMsg 的逻辑不受影响：#pkwrap 不在 #msgs 里时，新消息照常追加到 #msgs 末尾。 */
(function () {
  "use strict";
  function dock() {
    const pw = document.getElementById("pkwrap"), comp = document.querySelector("#s-chat .composer, .chatscreen .composer");
    if (!pw || !comp || !comp.parentNode) return;
    if (pw.nextElementSibling !== comp) comp.parentNode.insertBefore(pw, comp);
    pw.classList.add("dock");
  }
  /* 2026-11-03（玩家：「历史很常用，建议在主页面上有显示」）
     原来的「🕘 历史」藏在右侧浮动列（.rcol，已隐藏）和「+ 更多」里。现在在聊天页顶栏常驻一个「🕘 历史」，
     角标 = 收起了几条旧消息；点一下展开 / 收起（沿用 app48 的 [data-hist] 处理，不另写逻辑）。 */
  function histSync() {
    const b = document.querySelector(".chead .hist121"); if (!b) return;
    const src = document.getElementById("histBtn");
    const n = src && src.querySelector("em") ? src.querySelector("em").textContent : "";
    const open = !!(src && src.classList.contains("on"));
    const zh = (typeof CL === "function" ? CL() === "zh" : true);
    b.querySelector("span").textContent = open ? (zh ? "收起" : "Hide") : (zh ? "历史" : "History");
    const em = b.querySelector("em"); em.textContent = open ? "" : (n || "");
    b.classList.toggle("on", open);
  }
  function hist() {
    const scr = document.getElementById("s-chat"); if (!scr) return;
    const clean = (typeof cleanOn === "function") ? cleanOn() : true;
    let b = scr.querySelector(".chead .hist121");
    if (!clean) { if (b) b.remove(); return; }
    if (!b) {
      const anchor = scr.querySelector(".chead .vtog") || scr.querySelector(".chead [data-cmenu]");
      if (!anchor) return;
      anchor.insertAdjacentHTML("beforebegin", '<button class="hist121" data-hist="1" aria-label="history"><i>🕘</i><span></span><em></em></button>');
    }
    histSync();
  }
  document.addEventListener("click", function (e) { if (e.target && e.target.closest && e.target.closest("[data-hist]")) setTimeout(histSync, 0); });
  /* 2026-11-04（玩家：「历史」没必要了 —— 聊天记录现在一直在，往上翻就能看）⇒ 不再加顶栏「🕘 历史」，以前加过的也拿掉。 */
  function noHist() { document.querySelectorAll(".chead .hist121").forEach(b => b.remove()); }
  void hist;
  if (window.UI && typeof window.UI.add === "function") { window.UI.add("dock121", dock); window.UI.add("hist121", noHist); }
  else console.warn("[dock121] UI.add 不在，剧情面板不会贴住输入区");
  window.pkDock = dock;
  /* 2026-11-03 第三版：横排小气泡里点剧本那句 = 直接说出去（不再进「换个态度 / 加个动作」那一步）。
     做法和 app27 的「就这么说」一样：造一个隐藏的 [data-stopline] 按钮点一下，走原来的剧本选项流程。 */
  document.addEventListener("click", function (e) {
    const x = e.target && e.target.closest && e.target.closest("#pkwrap.dock [data-chatt]"); if (!x) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const b = document.createElement("button"); b.dataset.stopline = x.dataset.chatt; b.hidden = true; document.body.appendChild(b);
    try { b.click(); } finally { b.remove(); }
  }, true);
  /* 「AI 帮我想」出过一批之后改叫「↻ 换一批」（再点就是重新想三句） */
  function relabel() {
    const btn = document.querySelector("#pkwrap.dock [data-ai97]"), box = document.getElementById("ai97o"); if (!btn || btn.disabled) return;
    const zh = (typeof CL === "function" ? CL() === "zh" : true), has = !!(box && box.querySelector("button"));
    const want = has ? (zh ? "↻ 换一批" : "↻ New ideas") : (zh ? "✨ AI 帮我想" : "✨ Help me say it");
    if (btn.textContent !== want) btn.textContent = want;
  }
  try { new MutationObserver(relabel).observe(document.body, { childList: true, subtree: true }); } catch (e) { console.warn("[dock121] observer", e); }
  /* 2026-11-04（玩家：新弹出来的那句下面被挡住了，要往上调）
     原因：新消息先滚到底，随后 app86 才往气泡里补 ☺🔊🖼 那一排 ⇒ 气泡变高、底部被挤到可视区外。
     做法：#msgs 内容一变（新消息、补按钮、贴表情），只要你本来就在底部附近（没在往上翻历史），就再滚到底一次。 */
  let atBottom = true;
  document.addEventListener("scroll", function (e) { const m = e.target; if (m && m.id === "msgs") atBottom = m.scrollHeight - m.scrollTop - m.clientHeight < 140; }, true);
  try {
    new MutationObserver(function () {
      const m = document.getElementById("msgs"); if (!m || !atBottom || (window.holdTop98 && holdTop98(S.threads[curT]))) return;
      requestAnimationFrame(function () { m.scrollTop = m.scrollHeight; });
      setTimeout(function () { if (atBottom) m.scrollTop = m.scrollHeight; }, 60);
    }).observe(document.body, { childList: true, subtree: true });
  } catch (e) { console.warn("[dock121] stick-bottom", e); }
})();
