/* ===== app167 · 2026-11-28 角色语音：只要发音就收费（点一句 🔊 也算） =====
   老板：「只要是角色有发音就要收费，点一下也要收费；按阿里云成本的 5 倍收。」
   成本：qwen3-tts-flash 新加坡区 ¥0.733924 / 万字符，北京区 ¥0.8 / 万字符（阿里云百炼官方价，2026-11-28 查）。
   定价：沿用 💎1 = 2000 字（约 60 句）。2000 字成本约 ¥0.15–0.16；
         1 💎 用户实付最低约 $0.15（最大礼包），扣掉商店 15% 抽成约 ¥0.9 ⇒ 约 5.7–6 倍；按小包算约 8 倍，都不低于 5 倍。
   以前有两套计费叠在一起：ttsBill（每合成 2500 字扣 1 💎，点读也在里面）和自动朗读的字数额度（每 2000 字扣 1 💎），
   自动朗读的句子会被两边各扣一次；而界面上又写着「点 🔊 免费」。现在统一成一套：
     · 所有角色发音（自动朗读、点某一句 🔊）都从同一个字数额度里扣，额度用完时扣 💎1 换 2000 字；
     · 剧里预先录好的配音不扣；
     · 宝石不够：不播放，弹出充值。
   语音通话另有按分钟的价格，不在这里。 */
(function () {
  "use strict";
  if (typeof speak !== "function") return;
  const CHARS = 2000;
  const zh = () => { try { return CL() === "zh"; } catch (_) { return false; } };
  /* 旧的「每合成 2500 字扣 1 💎」停掉，避免重复扣 */
  try { if (typeof ttsBill === "function") ttsBill = function () {}; } catch (_) {}

  let auto = false;
  if (typeof voiceCount === "function") { const vc = voiceCount; voiceCount = function () { auto = true; return vc.apply(this, arguments); }; }
  const len = t => String(t || "").replace(/[*()（）\s]/g, "").replace(/^📞/, "").length;
  function chip() { try { const k = document.querySelector(".topbar .chip.num"); if (k) k.textContent = "💎 " + S.keys; if (typeof keysChip === "function") keysChip(); } catch (_) {} }
  function charge(n) {
    if ((S.vcred157 || 0) >= n) { S.vcred157 -= n; save(); return true; }
    if ((S.keys || 0) < 1) return false;
    S.keys -= 1; S.vcred157 = (S.vcred157 || 0) + CHARS - n; if (S.vcred157 < 0) S.vcred157 = 0; save(); chip();
    try { toast(zh() ? "角色语音 · 💎1（约 60 句）· 剩 " + S.keys : "Character voice · 💎1 (~60 lines) · " + S.keys + " left"); } catch (_) {}
    try { if (typeof track === "function") track("voice_gem", { n: CHARS }); } catch (_) {}
    return true;
  }
  const sp = speak;
  speak = function (text, who, onend) {
    const isAuto = auto; auto = false;
    if (isAuto) return sp.apply(this, arguments); /* 自动朗读：沿用原来那一层按字数扣（同一个额度） */
    try {
      const n = len(text);
      const rec = typeof recorded === "function" && recorded(text, who);
      if (n && !rec && !charge(n)) {
        try { toast(zh() ? "宝石不够了，角色语音要 💎1 ≈ 60 句" : "Out of 💎 — character voice is 💎1 per ~60 lines"); } catch (_) {}
        try { if (typeof paySheet === "function") paySheet(); } catch (_) {}
        try { if (onend) onend(); } catch (_) {}
        return;
      }
    } catch (_) {}
    return sp.apply(this, arguments);
  };
  try {
    Object.assign(I18N.zh, { "vp.note": "角色语音按字数扣宝石：💎1 ≈ 2000 字 ≈ 60 句。自动朗读和单独点某一句的 🔊 都从这里扣；剧里预先录好的配音不扣。" });
    Object.assign(I18N.en, { "vp.note": "Character voice uses 💎 by length: 💎1 ≈ 60 lines. Auto read-aloud and tapping 🔊 on a line both use it; pre-recorded voice in stories is free." });
  } catch (_) {}
  window.__voice167 = 1;
})();
