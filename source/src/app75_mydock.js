/* ---- v2.9 · 「轮到你说」卡片并入底部输入框：提示、换一句、自动说都在同一个框里 ---- */
function myDock75() {
  try {
    const sc = $(".chatscreen"), comp = document.querySelector(".composer");
    const old = comp && comp.querySelector(".my75");
    if (!sc || !comp || !(typeof myMode === "function" && myMode())) { if (old) old.remove(); sc && sc.classList.remove("dock75"); return; }
    const panel = document.querySelector(".pkpanel.stop");
    const parts = panel ? [".sttag.you", ".mycue", ".mysug", ".altrow", ".myauto"].map(s => panel.querySelector(s)).filter(Boolean) : [];
    if (!parts.length) { if (old) sc.classList.add("dock75"); return; }
    if (old) old.remove();
    const d = document.createElement("div"); d.className = "my75";
    const hd = document.createElement("div"); hd.className = "my75h";
    parts.forEach(el => { if (el.matches(".sttag,.mycue,.myauto")) hd.appendChild(el); else d.appendChild(el); });
    d.insertBefore(hd, d.firstChild);
    comp.insertBefore(d, comp.firstChild);
    sc.classList.add("dock75");
  } catch (_) {}
  try { const rc = document.querySelector("#s-chat .rcol"), comp = document.querySelector(".composer"), on = !!document.querySelector(".dock75");
    if (rc) rc.style.bottom = on && comp ? (comp.offsetHeight + 10) + "px" : ""; } catch (_) {}
}
const _packRefresh75 = packRefresh; packRefresh = function (th) { const r = _packRefresh75.apply(this, arguments); myDock75(); return r; };
const _renderChat75 = renderChat; renderChat = function () { const r = _renderChat75.apply(this, arguments); myDock75(); return r; };
Object.assign(I18N.zh, { "my.auto": "让 {n} 自动说" });
Object.assign(I18N.en, { "my.auto": "Auto-speak {n}" });
(function () {
  const st = document.createElement("style");
  st.textContent = `
.dock75 .pkpanel.stop{display:none!important}
.dock75 .addr73,.dock75 .composer .qchips,.dock75 .qrow{display:none!important}
.dock75 .composer,#s-chat.dock75 .composer,#s-chat.clean.dock75 .composer,#s-chat .dock75 .composer{background:rgba(16,14,22,.92)!important;border:1px solid rgba(240,183,126,.45)!important;border-radius:20px 20px 0 0!important;padding:10px 10px 12px!important;box-shadow:0 -8px 24px rgba(0,0,0,.45)}
.my75{display:flex;flex-direction:column;gap:7px;margin-bottom:8px}
.my75h{display:flex;align-items:center;gap:8px;min-width:0}
.my75h .sttag{margin:0!important;flex:none;font-size:11px!important;padding:3px 9px!important}
.my75h .mycue{margin:0!important;flex:1;min-width:0;font-size:11.5px;color:var(--dim);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.my75h .mycue b{color:#fff;font-weight:700}
.my75h .myauto{margin:0!important;flex:none;font-size:10.5px!important;color:var(--faint);display:flex;align-items:center;gap:4px;white-space:nowrap}
.my75h .myauto input{width:13px;height:13px;margin:0}
.my75 .mysug{margin:0!important;gap:6px!important;flex-wrap:nowrap!important}
.my75 .mysug [data-myhint]{padding:7px 10px!important;font-size:13.5px!important}
.my75 .mysug .myai{padding:6px 10px!important;font-size:12px!important}
.my75 .altrow{flex-direction:row!important;overflow-x:auto;gap:6px!important;margin:0!important;scrollbar-width:none}
.my75 .altrow small{display:none}
.my75 .altrow button{flex:none;max-width:78%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`;
  document.head.appendChild(st);
})();
