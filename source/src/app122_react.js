/* ================= 消息表情回应（2026-11-03 · 像 WhatsApp / iMessage 那样）=================
   玩家建议：对角色的某一句话点个赞 / 回个表情，美国用户很习惯。
   操作：
     · 双击（手机双点）角色的气泡 → ❤️（再双击取消）
     · 长按（电脑右键）气泡，或点气泡角上的 ☺ → 弹出一排表情：❤️ 😂 😮 😢 🔥 👍，点同一个 = 取消
   显示：表情贴在气泡左下角（m.react）。
   角色看得见：下一次回复的提示词里带一段「PLAYER REACTIONS」——他知道你给哪句话回了什么表情，
   可以自然地接（不强制提，不数数）。不加好感度，免得点表情刷分。 */
(function () {
  "use strict";
  const EMO = ["❤️", "😂", "😮", "😢", "🔥", "👍"];
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  /* 谁说的这句：普通台词看 m.who；剧本里「动作 + 一句话」的块（k:box）看 m.say.who */
  const spk = m => { if (!m || typeof ch !== "function") return null; if (m.who && m.who !== "me" && m.who !== "n" && m.who !== "sys" && ch(m.who)) return m.who; if (m.k === "box" && m.say && ch(m.say.who)) return m.say.who; return null; };
  const lineOf = m => (m && (m.k === "box" && m.say ? m.say.txt : m.txt)) || "";
  /* 2026-11-04：自己说的话也能贴表情（玩家：我的气泡也要有 ☺）；只是不告诉角色（见 reactBlock） */
  const mine = m => !!(m && m.who === "me" && m.txt && m.k !== "think" && m.k !== "dir");
  const ok = m => !!(m && (mine(m) || (spk(m) && lineOf(m))) && m.k !== "card" && m.k !== "img");

  /* 渲染：角上的 ☺ + 已回应的表情（一层 post，新消息 appendMsg 时也走 msgHTML，所以都带得上） */
  if (typeof MSGKIND !== "undefined" && MSGKIND.post) {
    MSGKIND.post("app122_react.js", function (h, m, i, th) {
      if (!ok(m)) return h;
      let out = h;
      if (m.react) out += '<div class="rx122b' + (m.who === "me" ? " me" : "") + '" data-rx122="' + i + '">' + esc(m.react) + '</div>';
      return out;
    });
  }

  function setReact(i, e) {
    const th = S.threads[curT]; if (!th) return; const m = th.msgs[i]; if (!ok(m)) return;
    m.react = m.react === e ? null : e; m.reactAt = m.react ? Date.now() : 0;
    save();
    try { if (typeof track === "function" && m.react) track("msg_react", { e: e, wid: th.wid || "" }); } catch (er) { console.warn("[react] track", er); }
    const el = document.querySelector('#msgs [data-mi="' + i + '"]');
    if (el) {
      let host = el; while (host.nextElementSibling && host.nextElementSibling.classList.contains("mquick")) host = host.nextElementSibling;
      const old = host.parentNode && host.parentNode.querySelector('.rx122b[data-rx122="' + i + '"]');
      if (old) old.remove();
      if (m.react) { host.insertAdjacentHTML("afterend", '<div class="rx122b pop' + (m.who === "me" ? " me" : "") + '" data-rx122="' + i + '">' + esc(m.react) + '</div>'); }
    }
    closePicker();
  }

  let pick = null;
  function closePicker() { if (pick) { pick.remove(); pick = null; } }
  function openPicker(i, anchor) {
    closePicker();
    const th = S.threads[curT]; if (!th || !ok(th.msgs[i])) return;
    const cur = th.msgs[i].react;
    pick = document.createElement("div"); pick.className = "rx122p";
    pick.innerHTML = EMO.map(e => '<button data-rx122e="' + e + '" data-rx122i="' + i + '" class="' + (cur === e ? "on" : "") + '">' + e + '</button>').join("");
    document.body.appendChild(pick);
    const r = (anchor || document.body).getBoundingClientRect(), pw = pick.offsetWidth, ph = pick.offsetHeight;
    const x = Math.max(8, Math.min(window.innerWidth - pw - 8, r.left + 12));
    const y = r.top - ph - 8 > 8 ? r.top - ph - 8 : Math.min(window.innerHeight - ph - 8, r.bottom + 8);
    pick.style.left = x + "px"; pick.style.top = y + "px";
  }
  const idxOf = el => { const x = el && el.closest && el.closest("#msgs [data-mi]"); return x ? +x.dataset.mi : -1; };

  document.addEventListener("click", function (e) {
    const t = e.target; if (!t || !t.closest) return;
    const pe = t.closest("[data-rx122e]");
    if (pe) { e.stopImmediatePropagation(); setReact(+pe.dataset.rx122i, pe.dataset.rx122e); return; }
    const b = t.closest("[data-rx122]");
    if (b) { e.stopImmediatePropagation(); const i = +b.dataset.rx122; const el = document.querySelector('#msgs [data-mi="' + i + '"]'); openPicker(i, el || b); return; }
    if (pick && !t.closest(".rx122p")) closePicker();
  }, true);
  document.addEventListener("dblclick", function (e) {
    const i = idxOf(e.target); if (i < 0) return;
    const th = S.threads[curT]; if (!th || !ok(th.msgs[i])) return;
    e.preventDefault(); setReact(i, "❤️");
  });
  document.addEventListener("contextmenu", function (e) {
    const i = idxOf(e.target); if (i < 0) return;
    const th = S.threads[curT]; if (!th || !ok(th.msgs[i])) return;
    e.preventDefault(); openPicker(i, e.target.closest("[data-mi]"));
  });
  /* 手机：长按 450ms 弹表情；手指一动就算滚动，不弹 */
  let lt = null, lx = 0, ly = 0;
  document.addEventListener("touchstart", function (e) {
    const i = idxOf(e.target); if (i < 0) return; const t0 = e.touches && e.touches[0]; if (!t0) return;
    lx = t0.clientX; ly = t0.clientY; const el = e.target.closest("[data-mi]");
    clearTimeout(lt); lt = setTimeout(() => { lt = null; const th = S.threads[curT]; if (th && ok(th.msgs[i])) openPicker(i, el); }, 450);
  }, { passive: true });
  document.addEventListener("touchmove", function (e) { const t0 = e.touches && e.touches[0]; if (lt && t0 && (Math.abs(t0.clientX - lx) > 8 || Math.abs(t0.clientY - ly) > 8)) { clearTimeout(lt); lt = null; } }, { passive: true });
  document.addEventListener("touchend", function () { if (lt) { clearTimeout(lt); lt = null; } }, { passive: true });

  /* 给模型：上次回复之后玩家回了哪些表情（app3_chat 的回复提示词里调用；带过一次就不再带） */
  window.reactBlock = function (th) {
    try {
      if (!th || !th.msgs) return "";
      const since = th.rx122seen || 0;
      const rows = [];
      th.msgs.forEach(m => { if (m && m.react && (m.reactAt || 0) > since && ok(m) && !mine(m)) rows.push("- " + m.react + " on " + first(ch(spk(m)).n) + "'s line: \"" + String(lineOf(m)).slice(0, 60) + "\""); });
      th.rx122seen = Date.now();
      if (!rows.length) return "";
      return "PLAYER REACTIONS (the player tapped an emoji on these lines since your last reply — like a chat reaction; let it color the moment naturally if it fits, never count or list them):\n" + rows.slice(-4).join("\n");
    } catch (e) { console.warn("[react] block", e); return ""; }
  };
  window.msgReact = setReact;
  /* 气泡角上那排 🔊 🖼（app86 的 bt86Btns）前面加一个 ☺ —— 只给角色说的话 */
  window.reactOK = function (i) { const th = S.threads[curT]; return !!(th && ok(th.msgs[i])); };
})();
