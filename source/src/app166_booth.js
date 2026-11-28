/* ===== app166 · 2026-11-28 拍贴机：排版、选人、把 AI 暧昧合照放到最显眼的位置 =====
   老板反馈：① 拍贴机的图都不够暧昧、没有性张力，上次说了没改到位；② 最上面那行说明「先选和谁拍（可以搜索），再选相框」和下面的搜索框贴得太近。
   实际看到的问题：
   · 选人那一排前面全是没有立绘的角色（系统用名字首字母画的占位图，比如「E」「Mom」「Hospital」），下面六个相框预览自然也全是字母，谈不上暧昧。
     → 只列有真实立绘的角色；当前选中的人不在筛选结果里（或没有立绘）时，自动换成第一个有立绘的。
   · 真正暧昧的是「AI 合照」（搂腰贴脸 / 差一点吻上 / 身后耳语 / 额头相抵），但按钮藏在选完相框之后的页面最下面，很多人根本没看到。
     → 选人下面加一张醒目的入口卡，点了直接进相框并开始生成（每张成功才扣钻，价格写在卡片上）。
   · 排版：说明文字、搜索行、头像行、相框区之间加了间距。
   AI 合照的提示词也加强了亲密感（在 app144_discfix.js 的 mod198b 里），尺度不变：成年人、衣着完整、不露骨。 */
(function () {
  "use strict";
  if (!window.__mod198b || typeof boothOpen !== "function" || typeof boothChars !== "function") return;
  const ZH = () => (typeof S !== "undefined" && S.lang === "zh");
  const PR = () => (typeof PRICES !== "undefined" && PRICES.img) || 2;
  const real = id => { try { const a = String(artSrc(id) || ""); return !!a && !/^data:/.test(a); } catch (_) { return false; } };
  const _bc = boothChars;
  boothChars = function () { const L = _bc(), R = L.filter(real); return R.length ? R : L; };
  function card() {
    const box = document.querySelector("#s-booth .btchars"); if (!box) return;
    const old = document.querySelector("#s-booth .bt166ai"); if (old) old.remove();
    const c = ch(BT.cid); if (!c || !real(BT.cid)) return;
    const nm = esc(first(c.n));
    box.insertAdjacentHTML("afterend", '<button type="button" class="bt166ai" data-bt166ai="1"><span class="k">✨ ' + (ZH() ? "AI 暧昧合照" : "AI COUPLE SHOTS") + '</span><b>' + (ZH() ? "和 " + nm + " 贴近拍一组" : "Get close with " + nm) + '</b><small>' +
      (ZH() ? "搂腰贴脸 · 差一点吻上 · 身后耳语 · 额头相抵　｜　4 张，每张 💎" + PR() + "，成功才扣" : "Pulled in by the waist · almost a kiss · a whisper from behind · foreheads touching — 4 shots, 💎" + PR() + " each, only if it works") + '</small></button>');
  }
  const _open = boothOpen;
  boothOpen = async function (cid) {
    try { const L = boothChars(), cur = cid || BT.cid; if (L.length && (!cur || !L.includes(cur))) cid = L[0]; } catch (_) {}
    const r = await _open(cid);
    try { card(); } catch (_) {}
    return r;
  };
  let going = false;
  document.addEventListener("click", async e => {
    if (!(e.target.closest && e.target.closest("[data-bt166ai]")) || going) return;
    going = true;
    try {
      const n = document.querySelectorAll("#s-booth [data-btf]").length, f = document.querySelector('#s-booth [data-btf="' + (n > 5 ? 5 : 0) + '"]');
      if (f) f.click();
      for (let i = 0; i < 30; i++) { await new Promise(z => setTimeout(z, 120)); const b = document.querySelector("[data-btai]"); if (b) { b.scrollIntoView({ block: "center" }); b.click(); break; } }
    } catch (_) {}
    going = false;
  });
  const st = document.createElement("style");
  st.textContent = '#s-booth .scroll>p.pad{padding:12px 16px 12px!important;font-size:13px;line-height:1.5}' +
    '#s-booth .btfind{padding:0 16px 14px!important}' +
    '#s-booth .btchars{padding:6px 16px 16px!important}' +
    '#s-booth .btgrid{margin-top:18px}' +
    '.bt166ai{display:flex;flex-direction:column;gap:4px;text-align:left;margin:2px 16px 0;width:calc(100% - 32px);padding:14px 16px;border-radius:18px;border:1px solid rgba(240,183,126,.45);background:linear-gradient(120deg,rgba(238,111,151,.30),rgba(120,40,110,.32) 60%,rgba(240,183,126,.20));color:#fff;box-shadow:0 10px 30px rgba(238,111,151,.25);cursor:pointer}' +
    '.bt166ai .k{font-size:11.5px;letter-spacing:.12em;color:#F6D3AE;font-weight:700}' +
    '.bt166ai b{font-size:17px;font-family:Fraunces,Georgia,"Songti SC",serif;font-weight:600}' +
    '.bt166ai small{font-size:12px;color:rgba(255,255,255,.78);line-height:1.5}';
  document.head.appendChild(st);
  window.__booth166 = 1;
})();

/* 2026-11-28 查出拍贴机 AI 合照（以及所有「同一张脸」改图）一直失败的原因：
   参考立绘先被缩到最长边 560px，竖版立绘（比如 941×1672）短边只剩 315px，
   阿里云 wan2.5-i2i 要求图片宽高都不小于 384px，直接报「Error validating image resolution」，所以一张都生成不出来。
   现在：最长边缩到 1024；短边不足 512 时放大到 512（最长边不超过 1600）。 */
(function () {
  "use strict";
  if (typeof qimgShrink !== "function") return;
  qimgShrink = function (src, max) {
    return new Promise(ok => {
      const im = new Image(); im.crossOrigin = "anonymous";
      im.onload = () => { try { const W = im.naturalWidth, H = im.naturalHeight; let s = Math.min(1, 1024 / Math.max(W, H)); if (Math.min(W, H) * s < 512) s = Math.min(1600 / Math.max(W, H), 512 / Math.min(W, H)); const c = document.createElement("canvas"); c.width = Math.round(W * s); c.height = Math.round(H * s); c.getContext("2d").drawImage(im, 0, 0, c.width, c.height); ok(c.toDataURL("image/jpeg", .85)); } catch (_) { ok(src); } };
      im.onerror = () => ok(src); im.src = src;
    });
  };
})();
