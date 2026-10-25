/* ================= 年龄门（T08）· 首启一次确认 =================
   开关：MIRU_TUNE.tools.ageGate（默认 true）。
   未确认（S.ageOk 不是 true）时，heat 上限被 heatGated() 压到 slow —— 那是 app98_emotion.js 的活。
   这里只负责**问一次**，并把答案存进状态。

   为什么默认开：文档 §14.1 T08 要求「未确认成年 ⇒ 保守表达」，而确认本身就是我们的免责声明。
   代价是所有现有用户下次启动会看到这一问 —— 这是 Ann 2026-10-25 明确拍的。 */
function ageGateOn() {
  try { return !!(typeof MIRU_TUNE !== "undefined" && MIRU_TUNE.tools && MIRU_TUNE.tools.ageGate) } catch (_) { return false }
}

function ageGateAsk() {
  if (!ageGateOn()) return;
  try {
    if (S.ageOk === true || S.ageOk === false) return;   // 问过了（无论答什么）就不问了
    sheet(
      '<h2>' + t("ag.h") + '</h2>' +
      '<p class="sm" style="margin-top:10px;line-height:1.7">' + t("ag.p") + '</p>' +
      '<div class="stack" style="margin-top:14px">' +
      '  <button class="btn btn-p" data-agok="1">' + t("ag.yes") + '</button>' +
      '  <button class="btn" data-agno="1">' + t("ag.no") + '</button>' +
      '</div>' +
      '<p class="xs faint" style="margin-top:10px">' + t("ag.note") + '</p>'
    );
  } catch (_) {}
}

document.addEventListener("click", function (e) {
  try {
    if (e.target.closest("[data-agok]")) {
      S.ageOk = true; closeSheet(); save();
      if (typeof toast === "function") toast(t("ag.saved"));
      return;
    }
    if (e.target.closest("[data-agno]")) {
      S.ageOk = false; closeSheet(); save();
      if (typeof toast === "function") toast(t("ag.minor"));
    }
  } catch (_) {}
});

/* 启动后问一次（boot 之后再挂，避免和开机动画抢） */
setTimeout(function () { try { ageGateAsk() } catch (_) {} }, 1200);
