/* ================= 剧本台词「换个说法」（2026-11-03）=================
   玩家：希望剧本台词也能滑出别的说法 —— 剧本原句永远是第 1 版，往左滑让 AI 用同样的意思换一种说法，剧情走向不变。
   规则：
     · 只对剧本写好的角色台词（不是 AI 即兴的那几句，那些走 app73 的重新生成）。
     · 第 1 版永远是剧本原句（m.alt[0]）；往左滑 = 下一版，已经是最后一版就让 AI 换一种说法（同一个人、同样的意思、同样的事实）。
       往右滑 = 上一版。最多 4 版。电脑上点气泡角上的「⇄」，或气泡下面的 ‹ 2/3 ›。
     · 只换字，不动剧情：不改选项、不改好感、不改进度。之后 AI 看到的是你正在看的那一版（意思一样）。
     · 计费和 ↻ 重新生成共用：每天 3 次免费，之后每次 💎1；切回已有的版本不收钱。 */
(function () {
  "use strict";
  const MAX = 4, FREE = 3;
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);
  const L2 = (a, b) => zh() ? a : b;
  const spk = (m, th) => {
    if (!m || m.ai || typeof ch !== "function") return null;
    const me = th && th.pk && th.pk.as;
    if (m.k === "say" && m.who && m.who !== "me" && m.who !== "n" && ch(m.who) && m.who !== me) return m.who;
    if (m.k === "box" && m.say && ch(m.say.who) && m.say.who !== me) return m.say.who;
    return null;
  };
  const getTxt = m => (m.k === "box" && m.say ? m.say.txt : m.txt) || "";
  function setTxt(m, s) { if (m.k === "box" && m.say) { m.say.txt = s; if (typeof m.txt === "string") m.txt = s; } else m.txt = s; }
  const okAt = (th, i) => !!(th && th.msgs && spk(th.msgs[i], th) && getTxt(th.msgs[i]).trim());
  let BUSY = false;

  function rerender(th) {
    const box = document.getElementById("msgs"), top = box ? box.scrollTop : 0;
    save(); if (curT === th.id) { renderChat(); const b2 = document.getElementById("msgs"); if (b2) b2.scrollTop = top; }
  }
  function show(th, i, n) {
    const m = th.msgs[i]; if (!m || !m.alt || n < 0 || n >= m.alt.length) return false;
    m.altI = n; setTxt(m, m.alt[n]); rerender(th); return true;
  }
  function pay() {
    const d = new Date().toISOString().slice(0, 10);
    S.rgDay = S.rgDay && S.rgDay.d === d ? S.rgDay : { d: d, n: 0 };
    if (S.rgDay.n < FREE) { S.rgDay.n++; save(); toast(L2("⇄ 换个说法 · 今天还剩 " + (FREE - S.rgDay.n) + " 次免费", "⇄ Rephrasing · " + (FREE - S.rgDay.n) + " free left today")); return true; }
    return typeof spend === "function" ? spend((typeof PRICES !== "undefined" && PRICES.retry) || 1, "retry") : true;
  }
  async function more(th, i) {
    if (BUSY) return; const m = th.msgs[i]; if (!okAt(th, i)) return;
    if (!m.alt) { m.alt = [getTxt(m)]; m.altI = 0; }
    if (m.altI < m.alt.length - 1) { show(th, i, m.altI + 1); return; }
    if (m.alt.length >= MAX) { toast(L2("最多 " + MAX + " 个说法，可以往右滑切回去", "Up to " + MAX + " versions — swipe right to go back")); return; }
    if (!(typeof liveOn === "function" && liveOn())) { toast(L2("现在连不上 AI，过会儿再试", "AI isn't available right now")); return; }
    if (!pay()) return;
    BUSY = true;
    const el = document.querySelector('#msgs [data-mi="' + i + '"]'); if (el) el.classList.add("alt123busy");
    let line = "";
    try {
      const who = spk(m, th), c = ch(who);
      const ctx = th.msgs.slice(Math.max(0, i - 6), i).map(x => { const s = spk(x, th) || (x.k === "say" && x.who) || ""; const n = s && ch(s) ? first(ch(s).n) : x.who === "me" ? "You" : ""; const tx = getTxt(x); return tx ? (n ? n + ": " : "") + tx : ""; }).filter(Boolean).join("\n");
      const p = ["You rephrase ONE scripted line in MIRU, an interactive romance story for adults. All characters are fictional adults.",
        "SPEAKER: " + c.n + (c.vibe ? " — " + Lz(c.vibe) : ""),
        ctx ? "THE SCENE SO FAR:\n" + ctx : "",
        "THE ORIGINAL LINE: \"" + m.alt[0] + "\"",
        "ALREADY USED (do not repeat these): " + m.alt.map(s => "\"" + s + "\"").join(" / "),
        "Write the same line again in different words: same speaker, same meaning, same facts, same intent, same level of warmth or tension. Keep every name, number and promise. Do not add new information, actions or plot. Similar length. Spoken, natural, in character.",
        "LANGUAGE: the same language as the original line.",
        'Reply with ONLY JSON {"line":"..."}'].filter(Boolean).join("\n");
      const r = await ask(p, { modelTier: "quick" });
      line = String((r && (r.line || r.text || r.say)) || (typeof r === "string" ? r : "")).trim().replace(/^["“「]|["”」]$/g, "");
    } catch (e) { console.warn("[alt123] ask", e); }
    finally { BUSY = false; if (el) el.classList.remove("alt123busy"); }
    if (!line || m.alt.some(s => s === line)) { toast(L2("这次没换出新说法，再试一次", "Couldn't find a new wording — try again")); return; }
    m.alt.push(line.slice(0, 300));
    try { if (typeof track === "function") track("line_rephrase", { wid: th.wid || "", n: m.alt.length }); } catch (e) { console.warn("[alt123] track", e); }
    show(th, i, m.alt.length - 1);
  }

  /* 气泡下面的 ‹ 2/3 ›（有第 2 版以后才出现） */
  if (typeof MSGKIND !== "undefined" && MSGKIND.post) {
    MSGKIND.post("app123_alt.js", function (h, m, i, th) {
      if (!m || !m.alt || m.alt.length < 2 || !spk(m, th)) return h;
      const n = m.altI || 0;
      return h + '<div class="alt123"><button data-alt123="' + i + '|-1"' + (n ? '' : ' disabled') + '>‹</button><span>' + (n ? "" : L2("原句 ", "Script ")) + (n + 1) + '/' + m.alt.length + '</span><button data-alt123="' + i + '|1">›</button></div>';
    });
  }
  /* 气泡角上那排 ☺ 🔊 🖼 再加一个 ⇄（app86 的 bt86Btns 会问这里） */
  window.altOK = function (i) { const th = S.threads[curT]; return okAt(th, i); };

  document.addEventListener("click", function (e) {
    const x = e.target && e.target.closest && e.target.closest("[data-alt123]"); if (!x) return;
    e.preventDefault(); e.stopImmediatePropagation();
    const th = S.threads[curT]; if (!th) return;
    const [i, d] = x.dataset.alt123.split("|").map(Number);
    if (d < 0) { const m = th.msgs[i]; if (m && m.alt) show(th, i, (m.altI || 0) - 1); }
    else more(th, i);
  }, true);

  /* 手机：在剧本台词的气泡上左右滑（app73 只管最后那段 AI 回复，这里只管剧本台词，两边不重叠） */
  let sx = 0, sy = 0, si = -1;
  document.addEventListener("touchstart", function (e) {
    si = -1; const t = e.touches && e.touches[0]; if (!t) return;
    const el = e.target && e.target.closest && e.target.closest("#msgs [data-mi]"); if (!el) return;
    const th = S.threads[curT]; const i = +el.dataset.mi; if (!okAt(th, i)) return;
    si = i; sx = t.clientX; sy = t.clientY;
  }, { passive: true });
  document.addEventListener("touchend", function (e) {
    if (si < 0) return; const i = si; si = -1; const t = e.changedTouches && e.changedTouches[0]; if (!t) return;
    const dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.6) return;
    const th = S.threads[curT]; if (!th) return;
    if (dx > 0) { const m = th.msgs[i]; if (m && m.alt) show(th, i, (m.altI || 0) - 1); }
    else more(th, i);
  }, { passive: true });

  window.altMore = more; window.altShow = show;
})();
