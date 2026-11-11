/* ================= 聊天框语音输入（2026-11-10）=================
   输入框旁边加一个 🎙：点一下开始听，说的话实时写进输入框（灰字是还没确定的部分），再点一下或停顿一会儿就结束。
   不会自动发送 —— 说完你可以改一改，再点发送。
   用的是手机 / 浏览器自带的语音识别（Web Speech API：Android Chrome、iOS Safari 14.5+ 都有），免费、不经过我们服务器。
   语言跟着 App 语言走（英文 en-US，中文 zh-CN）。不支持的浏览器不显示这个按钮。 */
(function () {
  "use strict";
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  const zh = () => (typeof CL === "function" ? CL() === "zh" : S.lang === "zh");
  const LANG = { zh: "zh-CN", en: "en-US", ja: "ja-JP", ko: "ko-KR", es: "es-ES" };
  let rec = null, base = "", btn = null;
  const ta = () => document.getElementById("cin");
  function setText(v) { const t = ta(); if (!t) return; t.value = v; t.dispatchEvent(new Event("input", { bubbles: true })); t.scrollTop = t.scrollHeight; }
  function ui(on) { const b = document.querySelector("[data-mic139]"); if (!b) return; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); b.title = on ? (zh() ? "点一下停止" : "Tap to stop") : (zh() ? "语音输入" : "Voice input"); }
  function stop() { try { rec && rec.stop(); } catch (_) {} }
  function start() {
    const t = ta(); if (!t) return;
    const body=playerInput146(t.value,cmode).text; base = body ? body.replace(/\s+$/, "") + (zh() ? "" : " ") : "";
    rec = new SR();
    rec.lang = LANG[(typeof S !== "undefined" && S.lang) || "en"] || "en-US";
    rec.interimResults = true; rec.continuous = false; /* Android 上 continuous 会重复结果：一次说一句，停顿就结束 */ rec.maxAlternatives = 1;
    let finalTxt = "";
    rec.onresult = ev => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) { const r = ev.results[i]; if (r.isFinal) finalTxt += r[0].transcript; else interim += r[0].transcript; }
      setText(base + finalTxt + interim);
    };
    rec.onerror = ev => {
      const e = ev && ev.error;
      if (e === "not-allowed" || e === "service-not-allowed") toast(zh() ? "需要麦克风权限：请在系统设置里允许 MIRU 使用麦克风" : "MIRU needs microphone access — allow it in your phone settings");
      else if (e === "no-speech") toast(zh() ? "没听到声音，再试一次" : "Didn't hear anything — try again");
      else if (e !== "aborted") toast(zh() ? "语音识别暂时不可用，可以直接打字" : "Voice input isn't available right now — you can type instead");
    };
    rec.onend = () => { rec = null; ui(false); const t2 = ta(); if (t2 && t2.value) { setText(t2.value.replace(/\s+$/, "")); t2.focus(); } };
    try { rec.start(); ui(true); if (navigator.vibrate) navigator.vibrate(15); } catch (_) { rec = null; ui(false); }
  }
  function inject() {
    const ir = document.querySelector(".composer .inrow"); if (!ir || ir.querySelector("[data-mic139]") || !ir.querySelector("#cin")) return;
    const at = ir.querySelector("[data-emo]") || ir.querySelector("[data-send]"); if (!at) return;
    at.insertAdjacentHTML("beforebegin", '<button class="mic139" data-mic139="1" aria-label="' + (zh() ? "语音输入" : "Voice input") + '" aria-pressed="false"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg></button>');
    if (rec) ui(true);
  }
  if (window.UI && typeof window.UI.add === "function") window.UI.add("voice139", inject);
  setInterval(inject, 800);
  document.addEventListener("click", e => {
    if (!e.target.closest("[data-mic139]")) { if (rec && e.target.closest("[data-send]")) { rec.onresult = null; stop(); } return; }
    e.preventDefault(); e.stopPropagation();
    if (rec) stop(); else start();
  }, true);
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
  const st = document.createElement("style");
  st.textContent = ".mic139{width:38px;height:38px;flex:none;display:grid;place-items:center;border-radius:50%;color:var(--fg,#fff);opacity:.8;background:transparent}" +
    ".mic139.on{opacity:1;color:#fff;background:var(--rose,#EE6F97);animation:mic139 1.2s ease-in-out infinite}" +
    "@keyframes mic139{0%,100%{box-shadow:0 0 0 0 rgba(238,111,151,.55)}50%{box-shadow:0 0 0 8px rgba(238,111,151,0)}}";
  document.head.appendChild(st);
})();
