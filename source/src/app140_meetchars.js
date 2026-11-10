/* ================= 「角色」页 = 遇见（2026-11-11）=================
   以前：发现页「故事」里挂一条「遇见」横幅，点开是全屏滑卡；「角色」页是一格一格的角色列表，点了直接聊。
   现在：角色只能通过匹配来玩 ——「角色」页就是遇见的滑卡（右滑喜欢、互相喜欢才开聊），
        上面一排是已经配对成功的人（点头像继续聊）。「故事」页不再有遇见横幅。
        想找某个具体的人，用右上角的搜索。
   做法：不改 app96_social.js 的逻辑，只是把它的 #sw96 画在「角色」页里（原来是盖在整个屏幕上的浮层）。 */
(function () {
  "use strict";
  if (typeof renderDiscover !== "function" || typeof renderSwipe96 !== "function") return;
  const zh = () => (typeof CL === "function" ? CL() === "zh" : S.lang === "zh");
  function matched() {
    return Object.values(S.threads || {}).filter(th => th && th.kind === "solo" && th.m96 && th.cast && ch(th.cast[0])).sort((a, b) => (b.at || 0) - (a.at || 0)).slice(0, 12);
  }
  function matchRow() {
    const L = matched(); if (!L.length) return "";
    return '<div class="mm140"><small>' + (zh() ? "已配对" : "Matches") + '</small><div class="hs">' + L.map(th => { const id = th.cast[0];
      return '<button data-mm140="' + esc(id) + '">' + avatar(id, 46) + (th.unread ? '<i></i>' : '') + '<span>' + esc(first(ch(id).n)) + '</span></button>'; }).join("") + '</div></div>';
  }
  function mount() {
    const v = $("#tabv"); if (!v || disc.mode !== "chars" || (typeof discSearch !== "undefined" && discSearch)) return;
    const sc = v.querySelector("#discScroll"); if (!sc) return;
    document.querySelectorAll("#sw96").forEach(x => x.remove());           /* 旧的全屏浮层不要了 */
    const box = document.createElement("div"); box.className = "meet140"; box.innerHTML = matchRow() + '<div id="sw96" class="in140"></div>';
    try { todayDeck96(); if (ALL) box.insertAdjacentHTML("afterbegin", '<p class="xs" style="padding:4px 16px 0;color:var(--gold)">' + (zh() ? "当前分类下还没有角色，先给你看全部。" : "No one in this category yet — showing everyone.") + '</p>'); } catch (_) {}
    sc.replaceWith(box);
    try { DECK96 = todayDeck96(); renderSwipe96(); if (typeof track === "function") track("meet_open", { n: DECK96.length, tab: 1 }); } catch (e) { console.warn("[meet140]", e); }
    /* 刚打开 App 就点进来时，男主卡（leads.json）可能还没加载完，牌是空的：每 1.5 秒再看一次，最多 6 次 */
    if (!DECK96.length) { let n = 0; const t = setInterval(() => {
      n++; const host = document.querySelector("#sw96.in140");
      if (!host || disc.mode !== "chars" || n > 6) { clearInterval(t); return; }
      try { const d = todayDeck96(); if (d.length) { DECK96 = d; renderSwipe96(); clearInterval(t); } } catch (_) { clearInterval(t); }
    }, 1500); }
  }
  const R0 = renderDiscover;
  renderDiscover = function () { const r = R0.apply(this, arguments); try { mount(); } catch (e) { console.warn("[meet140] mount", e); } return r; };
  /* 所有「打开遇见」的入口（通知、任务、老横幅）都改成跳到「角色」页 */
  openSwipe96 = function () { disc.mode = "chars"; disc.q = ""; try { discSearch = false; } catch (_) {} renderTab("discover"); show("s-main"); };
  /* 「故事」页去掉遇见横幅 */
  if (typeof discMain === "function") { const D0 = discMain; discMain = function () { return String(D0.apply(this, arguments)).replace(/<button class="sw96e"[\s\S]*?<\/button>/, ""); }; }
  document.addEventListener("click", e => {
    const x = e.target.closest("[data-mm140]"); if (!x) return; e.preventDefault(); e.stopPropagation();
    try { openThread("c:" + x.dataset.mm140); } catch (_) {}
  }, true);
  /* 选了某个取向（比如「女女」）但这个取向下还没有角色时：先给全部角色，不给空牌（不改你的设置） */
  let ALL = false;
  if (typeof eligible96 === "function" && typeof todayDeck96 === "function") {
    const E0 = eligible96, T0 = todayDeck96;
    eligible96 = function () { if (!ALL) return E0.apply(this, arguments); const o = S.or; S.or = "all"; try { return E0.apply(this, arguments); } finally { S.or = o; } };
    todayDeck96 = function () {
      ALL = false;
      try { if (S.or && S.or !== "all") { const st = sw96(); if (!allChars().some(id => E0(id, st))) { ALL = true; if (Array.isArray(st.deck) && !st.deck.length) st.deck = null; } } } catch (_) {}
      return T0.apply(this, arguments);
    };
  }
  /* 配对成功后点「回复 TA」会把 #sw96 藏起来；回到角色页时重新画 */
  const st = document.createElement("style");
  st.textContent = ".meet140{flex:1;min-height:0;display:flex;flex-direction:column}" +
    "#sw96.in140{position:relative;inset:auto;z-index:auto;background:transparent;flex:1;min-height:420px}" +
    "#sw96.in140 .swh96{padding:6px 16px 4px}#sw96.in140 .swh96 [data-swx96]{display:none}" +
    "#sw96.in140 .swb96{padding:10px 0 12px}" +
    ".mm140{padding:4px 16px 2px}.mm140 small{color:#9C93A6;font-size:12px}.mm140 .hs{display:flex;gap:12px;overflow-x:auto;padding:6px 0 4px;scrollbar-width:none}" +
    ".mm140 button{position:relative;flex:none;display:grid;justify-items:center;gap:3px;background:none;border:0;color:#fff;font-size:11.5px;width:54px}" +
    ".mm140 button span{max-width:54px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.mm140 button i{position:absolute;top:0;right:4px;width:10px;height:10px;border-radius:50%;background:var(--rose,#EE6F97);border:2px solid #0C0B10}";
  document.head.appendChild(st);
})();
