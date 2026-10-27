/* ================= v6.1 · App Store 1.2 (user-generated content): report · block · terms · contact =================
   · Report: a community story, its author, a library item, or an AI reply (chat menu ⋯). Goes to the admin console 「举报处理」 with a
     snapshot of the reported content; stories / library items reported by several people are hidden until reviewed (server side).
   · Block: any community author — their works disappear from the feed, Discover and search (server filters the feed; the device filters too).
   · Terms: /terms.html (zero tolerance, 17+, 24h handling); agreed to on the sign-in screen.
   · Me → 安全与举报: terms, blocked authors (unblock), contact us. */
const ZH95 = () => CL() === "zh";
const T95 = (zh, en) => ZH95() ? zh : en;
function blk95() { S.blk95 = S.blk95 || { works: [], names: [] }; return S.blk95; }
const REASONS95 = [["sex", "色情或露骨内容", "Sexual or explicit content"], ["minor", "涉及未成年人", "Involves minors"], ["hate", "仇恨、骚扰或霸凌", "Hate, harassment or bullying"],
  ["violence", "暴力或自残", "Violence or self-harm"], ["illegal", "违法、诈骗或垃圾信息", "Illegal, scam or spam"], ["ip", "侵权或泄露隐私", "Copyright or privacy"], ["other", "其他", "Something else"]];
function report95(kind, id, snap, title) {
  const zh = ZH95();
  sheet('<h2>⚑ ' + T95("举报", "Report") + (title ? ' · ' + esc(title) : '') + '</h2><p class="xs faint" style="margin:4px 0 10px">' +
    T95("我们会在 24 小时内处理。违规内容会被删除，发布者会被封禁。", "We act within 24 hours. Violating content is removed and the person who posted it is banned.") + '</p>' +
    '<div class="stack" style="gap:6px">' + REASONS95.map(r => '<label class="opt rp95"><input type="radio" name="rp95" value="' + r[0] + '"' + (r[0] === "sex" ? " checked" : "") + '> <span class="grow"><b>' + esc(zh ? r[1] : r[2]) + '</b></span></label>').join("") + '</div>' +
    '<textarea id="rp95n" rows="2" maxlength="280" placeholder="' + esc(T95("补充说明（可选）", "Anything to add? (optional)")) + '" style="width:100%;margin-top:10px;border-radius:12px;padding:10px;background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.14)"></textarea>' +
    '<button class="btn btn-p btn-block" style="margin-top:10px" id="rp95go">' + T95("提交举报", "Send report") + '</button>');
  const go = $("#rp95go"); if (!go) return;
  go.onclick = async () => {
    const r = (document.querySelector('input[name="rp95"]:checked') || {}).value || "other", n = ($("#rp95n") || {}).value || "";
    const lab = (REASONS95.find(x => x[0] === r) || [, "", ""]); go.disabled = true;
    let ok = false; try { const res = await capi("/works", { json: { op: "report", kind, id, reason: lab[1] + " / " + lab[2] + (n ? " — " + n : ""), snap: String(snap || "").slice(0, 4000) } }); ok = res.ok; } catch (_) {}
    closeSheet(); toast(ok ? T95("已收到举报，我们会在 24 小时内处理", "Report sent — we'll act within 24 hours") : T95("提交失败，请联网后再试", "Couldn't send — check your connection"));
    if (ok && kind === "message") { try { const th = S.threads[curT]; if (th) { th.msgs = th.msgs.filter(m => !m.rp95pending); save(); } } catch (_) {} }
  };
}
async function block95(workId, name) {
  if (!confirm(T95("拉黑「" + name + "」？你将不再看到 TA 的任何作品。", "Block “" + name + "”? You won't see any of their works."))) return;
  let ok = false; try { const r = await capi("/works", { json: { op: "block", id: workId } }); ok = r.ok; if (ok && r.j && r.j.name) name = r.j.name; } catch (_) {}
  const b = blk95(); if (!b.works.includes(workId)) b.works.push(workId); if (name && !b.names.includes(name)) b.names.push(name); save();
  toast(ok ? T95("已拉黑，TA 的作品不会再出现", "Blocked — their works won't appear again") : T95("已在本机拉黑；联网后会同步", "Blocked on this device; it syncs when you're online"));
  try { if (typeof go === "function") go("home"); else if (typeof renderMain === "function") renderMain(); } catch (_) {}
}
/* snapshot of what's on screen in a chat (the AI replies being reported) */
function chatSnap95(th) {
  return (th.msgs || []).slice(-10).map(m => { const w = m.who === "me" ? "[user]" : m.who === "n" || m.who === "sys" ? "[narration]" : "[" + ((ch(m.who) && first(ch(m.who).n)) || m.who) + "]";
    const t = String(m.txt || (m.parts || []).map(p => p.txt).join(" ") || "").replace(/\s+/g, " ").slice(0, 400); return t ? w + " " + t : ""; }).filter(Boolean).join("\n");
}
/* which community work (UGC, not a MIRU original) a world came from */
function ugc95(w) { return w && w.community && !w.official76 ? w : null; }
function authorName95(w) { return (w && (w.authorName || w.author)) || T95("这位作者", "this author"); }

/* ---- story page: report / block ---- */
{ const _os = openStory; openStory = function (id) { const r = _os.apply(this, arguments);
    try { const w = wd(id), sc = $("#s-story"); if (!w || !sc || sc.querySelector(".sf95")) return r;
      const u = ugc95(w), host = sc.querySelector(".scroll") || sc;
      host.insertAdjacentHTML("beforeend", '<div class="sf95"><button data-rp95w="' + esc(id) + '">⚑ ' + T95("举报这部作品", "Report this story") + '</button>' +
        (u ? '<button data-bk95w="' + esc(id) + '">🚫 ' + T95("拉黑作者", "Block author") + '</button>' : '') + '</div>'); } catch (_) {}
    return r; }; }
/* ---- chat menu ⋯: report AI replies / this story · block author ---- */
/* 2026-10-27：从「包一层 menuSheet」搬成登记一块。HTML 一字未改；守卫从 `!st` 变成不需要
   （注册表只在 stack 存在时才渲染），`!th` 保留为返回空串。 */
SHEET.add("menu", "app95_safety.js", "bottom", function () {
  const th = S.threads[curT]; if (!th) return '';
  const w = th.wid && wd(th.wid), u = ugc95(w);
  return '<button class="opt" data-rp95c="1"><span class="ic">⚑</span><span class="grow"><b>' + T95("举报 AI 回复", "Report an AI reply") + '</b><span>' + T95("内容不当？告诉我们，24 小时内处理", "Something inappropriate? We act within 24 hours") + '</span></span></button>' +
    (u ? '<button class="opt" data-bk95w="' + esc(w.id) + '"><span class="ic">🚫</span><span class="grow"><b>' + T95("拉黑这部作品的作者", "Block this story's author") + '</b></span></button>' : '');
});
document.addEventListener("click", e => {
  let x;
  if ((x = e.target.closest("[data-rp95w]"))) { e.preventDefault(); e.stopPropagation(); const w = wd(x.dataset.rp95w); report95("work", (w && w.community) || x.dataset.rp95w, w ? Lz(w.title) + "\n" + Lz(w.hook || "") : "", w && Lz(w.title)); return; }
  if ((x = e.target.closest("[data-bk95w]"))) { e.preventDefault(); e.stopPropagation(); const w = wd(x.dataset.bk95w); if (w && w.community) { closeSheet(); block95(w.community, authorName95(w)); } return; }
  if ((x = e.target.closest("[data-rp95c]"))) { e.preventDefault(); e.stopPropagation(); const th = S.threads[curT]; if (!th) return; closeSheet(); const w = th.wid && wd(th.wid);
    setTimeout(() => report95("message", (w && w.community) || th.id, chatSnap95(th), T95("AI 回复", "AI reply")), 150); return; }
  if ((x = e.target.closest("[data-rp95a]"))) { e.preventDefault(); e.stopPropagation(); report95("asset", x.dataset.rp95a, x.dataset.n || "", x.dataset.n); return; }
}, true);

/* ---- library: community items (🌐) can be reported ---- */
{ const _rl = typeof renderLib === "function" ? renderLib : null;
  function libMark95() { document.querySelectorAll(".lib65i[data-libtry]").forEach(b => { const n = (b.querySelector("b") || {}).textContent || ""; if (!/^🌐/.test(n) || b.querySelector("[data-rp95a]")) return;
    b.insertAdjacentHTML("beforeend", '<span class="lb95" role="button" data-rp95a="' + esc(b.dataset.libtry) + '" data-n="' + esc(n.replace(/^🌐\s*/, "")) + '" aria-label="report">⚑</span>'); }); }
  new MutationObserver(() => { if (document.querySelector(".lib65list")) libMark95(); }).observe(document.body, { childList: true, subtree: true }); }

/* ---- blocked authors never show up (server filters the feed for signed-in users; this covers cached lists) ---- */
{ const _ca = capi; capi = async function (path) { const r = await _ca.apply(this, arguments);
    try { if (typeof path === "string" && /^\/works/.test(path) && r && r.j && Array.isArray(r.j.works)) { const b = blk95(); if (b.works.length || b.names.length) r.j.works = r.j.works.filter(w => !b.works.includes(w.id) && !(w.author && b.names.includes(w.author) && w.author !== "MIRU 官方")); } } catch (_) {}
    return r; }; }

/* ---- sign-in screen: terms + zero tolerance ---- */
function terms95Link(t) { return '<a href="terms.html' + (ZH95() ? "" : "#en") + '" target="_blank" rel="noopener" style="color:#F0B77E">' + t + '</a>'; }
{ const _ra = renderAuth70; renderAuth70 = function () { const r = _ra.apply(this, arguments);
    try { const b = document.querySelector("#s-ob .au70b"); if (b && !document.querySelector(".tm95")) b.insertAdjacentHTML("afterend", '<p class="tm95">' +
      (ZH95() ? "继续即表示你已年满 17 周岁，并同意" + terms95Link("《用户协议与社区规范》") + "。MIRU 对违规内容和辱骂行为零容忍。"
              : "By continuing you confirm you're 17+ and agree to the " + terms95Link("Terms & Community Guidelines") + ". MIRU has zero tolerance for objectionable content and abusive users.") + '</p>'); } catch (_) {}
    return r; }; }

/* ---- Me → 安全与举报 ---- */
async function blockedSheet95() {
  let L = []; try { const r = await capi("/works?blocked=1"); if (r.ok) L = r.j.blocked || []; } catch (_) {}
  sheet('<h2>🚫 ' + T95("已拉黑的作者", "Blocked authors") + '</h2>' + (L.length ? '<div class="stack" style="gap:6px;margin-top:10px">' + L.map(a => '<div class="opt"><span class="grow"><b>' + esc(a.author_name || a.author_id) + '</b></span><button class="btn btn-sm" data-ub95="' + esc(a.author_id) + '">' + T95("解除", "Unblock") + '</button></div>').join("") + '</div>'
    : '<p class="dim" style="margin-top:10px">' + T95("还没有拉黑任何人。", "You haven't blocked anyone.") + '</p>'));
}
function contactSheet95() {
  sheet('<h2>✉️ ' + T95("联系我们", "Contact us") + '</h2><p class="xs faint" style="margin:4px 0 10px">' + T95("问题、建议、申诉都可以，我们会在 24 小时内回复到你的注册邮箱。", "Questions, feedback or appeals — we reply to your sign-in email within 24 hours.") + '</p>' +
    '<textarea id="ct95" rows="5" maxlength="1500" style="width:100%;border-radius:12px;padding:10px;background:rgba(255,255,255,.06);color:#fff;border:1px solid rgba(255,255,255,.14)"></textarea><button class="btn btn-p btn-block" style="margin-top:10px" id="ct95go">' + T95("发送", "Send") + '</button>');
  const b = $("#ct95go"); if (b) b.onclick = async () => { const v = ($("#ct95") || {}).value || ""; if (v.trim().length < 2) return; b.disabled = true; let ok = false;
    try { const r = await capi("/works", { json: { op: "report", kind: "other", id: "contact", reason: T95("联系我们", "Contact us"), snap: v } }); ok = r.ok; } catch (_) {}
    closeSheet(); toast(ok ? T95("已发送，我们会尽快回复", "Sent — we'll get back to you soon") : T95("发送失败，请联网后再试", "Couldn't send — check your connection")); };
}
document.addEventListener("click", async e => { let x;
  if ((x = e.target.closest("[data-ub95]"))) { const id = x.dataset.ub95; try { await capi("/works", { json: { op: "unblock", author: id } }); } catch (_) {} const b = blk95(); b.works = []; b.names = []; save(); toast(T95("已解除拉黑", "Unblocked")); blockedSheet95(); return; }
  if (e.target.closest("[data-sf95b]")) { blockedSheet95(); return; }
  if (e.target.closest("[data-sf95c]")) { contactSheet95(); return; }
});
{ const _rm = renderMe; renderMe = function (v) { const r = _rm.apply(this, arguments);
    try { const host = (v && v.querySelector && (v.querySelector(".scroll") || v)) || $("#tabv"); if (host && !host.querySelector(".me95")) host.insertAdjacentHTML("beforeend",
      '<div class="card me95"><div class="eyebrow">🛡 ' + T95("安全与举报", "Safety & reporting") + '</div>' +
      '<a class="opt" href="terms.html' + (ZH95() ? "" : "#en") + '" target="_blank" rel="noopener"><span class="ic">📜</span><span class="grow"><b>' + T95("用户协议与社区规范", "Terms & Community Guidelines") + '</b><span>' + T95("零容忍 · 24 小时处理举报", "Zero tolerance · reports handled within 24h") + '</span></span></a>' +
      '<button class="opt" data-sf95b="1"><span class="ic">🚫</span><span class="grow"><b>' + T95("已拉黑的作者", "Blocked authors") + '</b></span></button>' +
      '<button class="opt" data-sf95c="1"><span class="ic">✉️</span><span class="grow"><b>' + T95("联系我们", "Contact us") + '</b></span></button></div>'); } catch (_) {}
    return r; }; }

(function () { const st = document.createElement("style"); st.textContent = `
.sf95{display:flex;gap:8px;justify-content:center;margin:18px 0 8px}.sf95 button{border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);color:#C9C1D2;border-radius:999px;padding:7px 14px;font-size:12px}
.tm95{font-size:11.5px;line-height:1.55;color:#9C93A6;text-align:center;margin:4px 6px 0}
.me95{margin-top:14px;display:grid;gap:6px}.me95 a.opt{text-decoration:none;color:inherit}
.rp95 input{accent-color:#EE6F97}
.lb95{margin-left:auto;padding:4px 8px;font-size:13px;color:#9C93A6;align-self:center}`; document.head.appendChild(st); })();
