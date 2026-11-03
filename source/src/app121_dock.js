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
  if (window.UI && typeof window.UI.add === "function") { window.UI.add("dock121", dock); window.UI.add("hist121", hist); }
  else console.warn("[dock121] UI.add 不在，剧情面板不会贴住输入区");
  window.pkDock = dock;
})();
