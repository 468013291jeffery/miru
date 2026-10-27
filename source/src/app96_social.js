/* ================= v6.2 · 世界围着你转 — lessons from Status & Heyyyy, all paid with 💎 (no membership) =================
   ① 圈内热搜：每部剧一个剧中社交平台（营销号 / 路人 / 粉丝 / 黑粉 / 角色本人），AI 围绕剧情写帖子；你每做一个关键选择，热搜和评论跟着变。
      你可以点赞（免费）、评论（1💎）、自己发帖（1💎）——整个世界都会回应你。
   ② 语音消息：先看字幕，付 1💎 听原声（剧情里的语音、角色主动发来的语音、超级喜欢的打招呼语音）。
   ③ 你的恋爱人格：按你在剧里的选择和说过的话，分 6 个维度分析；每读完一章解锁一项，读完整部拿到完整报告和分享卡片。
   ④ 看得见的结果：每次选择后弹出变化卡片——好感 +8、上热搜第 3、粉丝 +1,204、新角色登场。
   ⑤ 让 TA 主动找你：花 💎 为某个角色打开「主动联系」（永久），之后 TA 会在你不在时发来消息或语音，最多每天 2 条。
   ⑥ 遇见：发现页的滑卡——左滑跳过、右滑开始聊天、⭐ 超级喜欢（TA 先发一条语音）。每天免费滑 30 次。 */
const P96 = { comment: 1, post: 1, voice: 1, contact: 10, superlike: 2, swipes: 2, freeSwipes: 30 };
const Z96 = () => CL() === "zh";
const L96 = (zh, en) => Z96() ? zh : en;
const now96 = () => Date.now();
const fmtN96 = n => n >= 10000 ? (Z96() ? (n / 10000).toFixed(1) + "万" : (n / 1000).toFixed(1) + "K") : String(n);
function hash96(s) { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) | 0; return Math.abs(h); }
function nameOf96(cid) { const c = ch(cid); return c ? first(c.n) : ""; }
function youName96(th) { const as = th && th.pk && th.pk.as; if (as && as !== "watch" && as !== "side" && ch(as)) return first(ch(as).n); try { const p = persona(); if (p && p.name) return p.name; } catch (_) {} return L96("你", "you"); }
function recent96(th, n) {
  return (th.msgs || []).slice(-(n || 16)).map(m => { const w = m.who === "me" ? youName96(th) : m.who === "n" || m.who === "sys" ? "" : nameOf96(m.who);
    const x = String(m.txt || (m.parts || []).map(p => p.txt).join(" ") || "").replace(/\s+/g, " ").slice(0, 160); return x ? (w ? w + ": " : "") + x : ""; }).filter(Boolean).join("\n");
}
function castLine96(th) { return (th.cast || []).filter(c => ch(c)).map(c => { const x = ch(c); return first(x.n) + (Lz(x.role) ? "（" + Lz(x.role) + "）" : ""); }).join("、"); }
async function ask96(p, max) { if (!liveOn()) throw { code: "na" }; return ask(p, { maxTokens: max || 900 }); }

/* ================= ④ 变化卡片 ================= */
function chg96(items) {
  items = (items || []).filter(Boolean).slice(0, 4); if (!items.length) return;
  const dev = $("#dev") || document.body; let box = $("#chg96"); if (!box) { box = document.createElement("div"); box.id = "chg96"; dev.appendChild(box); }
  const el = document.createElement("div"); el.className = "chg96c"; el.innerHTML = items.map(x => '<div><i>' + x[0] + '</i><span>' + esc(x[1]) + '</span>' + (x[2] ? '<b class="' + (String(x[2])[0] === "-" ? "dn" : "up") + '">' + esc(x[2]) + '</b>' : '') + '</div>').join("");
  box.appendChild(el); setTimeout(() => el.classList.add("out"), 2600); setTimeout(() => el.remove(), 3200);
}
/* love before → after around any choice */
function loveSnap96(th) { const o = {}; (th.cast || []).forEach(c => o[c] = Math.round((th.love || {})[c] || 0)); return o; }
function loveDiff96(th, before) {
  const out = []; (th.cast || []).forEach(c => { if (!ch(c) || (th.pk && c === th.pk.as)) return; const d = Math.round((th.love[c] || 0) - (before[c] || 0)); if (d) out.push([d > 0 ? "💗" : "💔", L96(nameOf96(c) + " 好感", nameOf96(c) + " affection"), (d > 0 ? "+" : "") + d]); });
  return out;
}
let PEND96 = null;
document.addEventListener("click", e => {
  if (!e.target.closest("[data-chatt],[data-pkpick],[data-stopline],[data-pkopt],[data-chq],[data-sg]")) return;
  const th = S.threads[curT]; if (!th || !th.love) return; const before = loveSnap96(th), id = th.id; clearTimeout(PEND96);
  PEND96 = setTimeout(() => { const t2 = S.threads[id]; if (t2) chg96(loveDiff96(t2, before)); }, 1800);
}, true);
/* a new face in the story */
{ const _am = appendMsg; appendMsg = function (th, m) { const r = _am.apply(this, arguments);
    try { if (th && th.pk && m && ch(m.who) && th.msgs.length > 3) { th.met96 = th.met96 || []; if (!th.met96.includes(m.who)) { const first0 = th.met96.length === 0; th.met96.push(m.who); if (!first0 && m.who !== th.pk.as && curT === th.id) chg96([["🔓", L96("新角色登场：" + nameOf96(m.who), "New character: " + nameOf96(m.who))]]); } } } catch (_) {}
    return r; }; }

/* ================= ① 圈内热搜 ================= */
function feed96(th) { th.feed96 = th.feed96 || { posts: [], trends: [], fans: 1000 + (hash96(th.id) % 9000), unread: 0, platform: "" }; return th.feed96; }
function platform96(w) { const s = (Lz(w && w.title) || "") + (Lz(w && w.premise) || ""); if (/王冠|王国|王储|Crown|kingdom/i.test(s)) return L96("王城传声板", "The Crier's Board"); if (/冰|hockey|球队|校园|campus/i.test(s)) return L96("校园圈", "Campus Buzz"); return L96("热搜", "Trending"); }
async function gen96(th, event) {
  const w = wd(th.wid); if (!w) return null; const F = feed96(th), zh = Z96();
  const p = (zh ? "你是一个互动剧里的「剧中社交平台」编辑。为这部剧的世界生成一轮新的社交媒体内容，围绕玩家刚刚发生的剧情。玩家是主角，整个世界都在关注他/她。"
               : "You write the in-world social feed for an interactive drama. Generate a fresh round of posts reacting to what just happened. The player is the protagonist; the whole world is watching them.")
    + "\n\n" + (zh ? "剧名：" : "Story: ") + Lz(w.title) + "\n" + (zh ? "简介：" : "Premise: ") + (Lz(w.premise) || Lz(w.hook) || "") + "\n" + (zh ? "角色：" : "Cast: ") + castLine96(th) + "\n" + (zh ? "玩家扮演：" : "Player plays: ") + youName96(th)
    + "\n" + (zh ? "刚刚发生：" : "Just happened: ") + (event || (zh ? "故事开篇" : "the story begins")) + "\n\n" + (zh ? "最近剧情：\n" : "Recent scene:\n") + recent96(th, 14)
    + "\n\n" + (zh ? "要求：平台风格贴合世界观（现代娱乐圈像微博、校园像校园论坛、奇幻王国像王城告示板）。账号类型混合：media（营销号/媒体）、fan（粉丝/CP粉）、anti（黑粉/唯粉）、passerby（路人）、char（剧中角色本人，用角色真名，语气要像本人且话里有话）。每条不超过 60 字，口语、有梗、有情绪。至少一条提到玩家。热搜词 4 个，第一个最热。rankMe 是关于玩家的热搜排名（1-4），没有就 null。"
           : "Rules: the platform fits the world (celebrity Weibo/X for modern showbiz, a campus forum for college, a town crier board for a fantasy kingdom). Mix account kinds: media, fan, anti, passerby, char (a cast member by their real name, in their voice, with subtext). Each post under 40 words, punchy, emotional. At least one post is about the player. 4 trending tags, hottest first. rankMe = rank (1-4) of the tag about the player, or null.")
    + '\n\nReply with ONLY JSON: {"trends":["..."],"rankMe":2,"posts":[{"kind":"media|fan|anti|passerby|char","name":"display name","handle":"@id","text":"..."}]} — 5 to 7 posts, in ' + (zh ? "Simplified Chinese" : "English") + ".";
  let r = null; try { r = await ask96(p, 1100); } catch (_) { return null; }
  if (!r || !Array.isArray(r.posts)) return null;
  const byName = {}; (th.cast || []).forEach(c => { if (ch(c)) { byName[first(ch(c).n)] = c; byName[ch(c).n] = c; } });
  const posts = r.posts.slice(0, 7).map((x, i) => ({ id: "p" + now96() + i, kind: String(x.kind || "passerby"), name: String(x.name || "").slice(0, 24), handle: String(x.handle || "").slice(0, 24),
    cid: x.kind === "char" ? (byName[x.name] || byName[first(x.name || "")] || null) : null, text: String(x.text || "").slice(0, 240), likes: 30 + (hash96(x.text) % (x.kind === "media" ? 90000 : 9000)), cm: [], at: now96() }));
  F.posts = posts.concat(F.posts).slice(0, 60); if (Array.isArray(r.trends) && r.trends.length) F.trends = r.trends.slice(0, 4).map(String);
  F.platform = F.platform || platform96(w); F.unread = (F.unread || 0) + posts.length;
  const gain = 200 + (hash96(event || "") % 3000); F.fans += gain; save(); feedBadge96();
  const rank = +r.rankMe; const items = [];
  if (rank >= 1 && rank <= 4) items.push(["🔥", L96("你上了热搜第 " + rank, "You're trending #" + rank)]);
  items.push(["👥", L96("粉丝", "Followers"), "+" + fmtN96(gain)]);
  return items;
}
/* the chapter's key choice → the world reacts */
{ const _pap = packAfterPick; packAfterPick = function (th, k) { const before = loveSnap96(th); const r = _pap.apply(this, arguments);
    try { const w = wd(th.wid), n = th.pk.ch, c = w && w.pack.chapters[n - 1], x = c && (c.choices || []).find(y => y.k === k);
      const items = loveDiff96(th, before); clearTimeout(PEND96);
      const ev = (Z96() ? "第 " + n + " 章，玩家的关键选择：" : "Chapter " + n + ", the player's key choice: ") + (x ? Lz(x.t) : k);
      gen96(th, ev).then(more => { chg96(items.concat(more || [])); }).catch(() => chg96(items)); } catch (_) {}
    return r; }; }
function feedBadge96() { const th = S.threads[curT], b = $("#fd96b"); if (!b || !th) return; const n = (th.feed96 && th.feed96.unread) || 0; const em = b.querySelector("em"); if (em) em.textContent = n ? (n > 99 ? "99+" : n) : ""; }
function feedBtn96() { const th = S.threads[curT]; if (!th || !th.pk || !th.wid) return; const col = $("#s-chat .rcol"); if (!col || $("#fd96b")) return;
  col.insertAdjacentHTML("afterbegin", '<button id="fd96b" class="histbtn" data-fd96="1"><i>🔥</i><small>' + esc(L96("热搜", "Trending")) + '</small><em></em></button>'); feedBadge96(); }
{ /* 2026-10-27：从「包 renderChat」搬成钩子（批量迁移）。逻辑原样，只是不再包住渲染器。 */
const __body_social96 = function () { try { feedBtn96(); } catch (_) {} };
if (window.UI && typeof window.UI.add === "function") window.UI.add("social96", __body_social96);
else { const _rc = renderChat; renderChat = function () { const r = _rc.apply(this, arguments); __body_social96(); return r; }; }; }
function postHTML96(p, th) {
  const kindL = { media: L96("媒体", "Media"), fan: L96("粉丝", "Fan"), anti: L96("黑粉", "Hater"), passerby: L96("路人", "Passerby"), char: L96("本人", "Cast"), me: L96("你", "You") }[p.kind] || "";
  const av = p.cid ? '<img src="' + esc(artSrc(p.cid)) + '" alt="">' : '<span style="background:hsl(' + (hash96(p.name) % 360) + ' 45% 38%)">' + esc((p.name || "?").slice(0, 1)) + '</span>';
  return '<div class="fp96" data-pid="' + p.id + '"><div class="fa96">' + av + '</div><div class="grow"><div class="fh96"><b>' + esc(p.name) + '</b>' + (p.kind === "char" || p.kind === "me" ? '<i class="vf96">✓</i>' : '') + '<small>' + esc(p.handle || "") + '</small><em class="k-' + esc(p.kind) + '">' + esc(kindL) + '</em></div>' +
    '<p>' + esc(p.text) + '</p>' + (p.cm && p.cm.length ? '<div class="fc96">' + p.cm.map(c => '<div><b>' + esc(c.name) + '：</b>' + esc(c.text) + '</div>').join("") + '</div>' : '') +
    '<div class="fx96"><button data-fl96="' + p.id + '" class="' + (p.liked ? "on" : "") + '">♥ ' + fmtN96(p.likes + (p.liked ? 1 : 0)) + '</button><button data-fcm96="' + p.id + '">💬 ' + (p.cm ? p.cm.length : 0) + ' · ' + P96.comment + '💎</button></div></div></div>';
}
function openFeed96() {
  const th = S.threads[curT]; if (!th) return; const F = feed96(th), w = wd(th.wid); F.platform = F.platform || platform96(w); F.unread = 0; save(); feedBadge96();
  let el = $("#fd96"); if (!el) { el = document.createElement("div"); el.id = "fd96"; ($("#dev") || document.body).appendChild(el); }
  el.innerHTML = '<div class="fdh96"><button data-fdx96="1" aria-label="close">✕</button><div class="grow"><b>' + esc(F.platform) + '</b><small>' + esc(Lz(w && w.title) || "") + ' · ' + L96("你的粉丝 ", "Your followers ") + fmtN96(F.fans) + '</small></div><button data-fdr96="1" class="fdr96">↻</button></div>' +
    '<div class="fds96">' + (F.trends.length ? '<div class="ft96"><div class="ftt96">🔥 ' + L96("热搜榜", "Trending now") + '</div>' + F.trends.map((x, i) => '<div><i>' + (i + 1) + '</i><span>' + esc(x) + '</span>' + (i === 0 ? '<em>' + L96("爆", "HOT") + '</em>' : '') + '</div>').join("") + '</div>' : '') +
    '<div class="fw96"><textarea id="fdt96" rows="2" maxlength="140" placeholder="' + esc(L96("以 " + youName96(th) + " 的身份发一条…全世界都会看到", "Post as " + youName96(th) + "… the whole world will see it")) + '"></textarea><button data-fdp96="1">' + L96("发布", "Post") + ' · ' + P96.post + '💎</button></div>' +
    '<div id="fdl96">' + (F.posts.length ? F.posts.map(p => postHTML96(p, th)).join("") : '<p class="fe96">' + L96("世界还在醒来……", "The world is waking up…") + '</p>') + '</div></div>';
  el.hidden = false;
  if (!F.posts.length) refreshFeed96(L96("故事开篇，玩家刚刚登场", "The story begins; the player just arrived"));
}
async function refreshFeed96(ev) {
  const th = S.threads[curT]; if (!th) return; const L = $("#fdl96"); if (L) L.insertAdjacentHTML("afterbegin", '<p class="fe96" id="fdw96">✨ ' + L96("正在刷新……", "Refreshing…") + '</p>');
  const items = await gen96(th, ev || L96("玩家打开了社交平台，看看大家在聊什么", "The player opened the app to see what everyone's saying"));
  const wv = $("#fdw96"); if (wv) wv.remove(); if (!items) { toast(L96("AI 现在不可用，稍后再试", "AI isn't available right now")); return; }
  if ($("#fd96") && !$("#fd96").hidden) openFeed96(); chg96(items);
}
async function postFeed96() {
  const th = S.threads[curT], ta = $("#fdt96"); if (!th || !ta) return; const txt = ta.value.trim(); if (txt.length < 2) return; if (!spend(P96.post, "card")) return;
  const F = feed96(th); const p = { id: "m" + now96(), kind: "me", name: youName96(th), handle: "@" + L96("我", "me"), text: txt, likes: 0, cm: [], at: now96() };
  F.posts.unshift(p); save(); openFeed96(); const items = await gen96(th, L96("玩家亲自发了一条动态：「" + txt + "」——大家都在回应这条", "The player posted: “" + txt + "” — everyone reacts to it"));
  p.likes = 300 + (hash96(txt) % 20000); save(); if ($("#fd96") && !$("#fd96").hidden) openFeed96(); chg96([["❤️", L96("你的动态", "Your post"), "+" + fmtN96(p.likes)]].concat(items || []));
}
async function commentFeed96(pid) {
  const th = S.threads[curT]; if (!th) return; const F = feed96(th), p = F.posts.find(x => x.id === pid); if (!p) return;
  const txt = prompt(L96("回复 " + p.name + "：", "Reply to " + p.name + ":")); if (!txt || !txt.trim()) return; if (!spend(P96.comment, "card")) return;
  p.cm = p.cm || []; p.cm.push({ name: youName96(th), text: txt.trim().slice(0, 140) }); save(); openFeed96();
  try { const r = await ask96((Z96() ? "剧中社交平台。帖子：" : "In-world social feed. Post: ") + p.name + ": " + p.text + "\n" + (Z96() ? "玩家（" + youName96(th) + "）回复：" : "The player (" + youName96(th) + ") replied: ") + txt +
      "\n" + (Z96() ? "角色：" : "Cast: ") + castLine96(th) + "\n" + (Z96() ? "写 2 条别人对玩家回复的回复（可以是原帖作者、粉丝或剧中角色），每条不超过 40 字。" : "Write 2 replies to the player's reply (the poster, a fan, or a cast member), each under 25 words.") +
      '\nReply with ONLY JSON: {"replies":[{"name":"...","text":"..."}]} in ' + (Z96() ? "Simplified Chinese" : "English") + ".", 400);
    (r && r.replies || []).slice(0, 2).forEach(x => p.cm.push({ name: String(x.name || "").slice(0, 24), text: String(x.text || "").slice(0, 160) })); p.likes += 50; save(); if ($("#fd96") && !$("#fd96").hidden) openFeed96(); } catch (_) {}
}
document.addEventListener("click", e => { let x;
  if (e.target.closest("[data-fd96]")) { e.stopPropagation(); openFeed96(); return; }
  if (e.target.closest("[data-fdx96]")) { const el = $("#fd96"); if (el) el.hidden = true; return; }
  if (e.target.closest("[data-fdr96]")) { refreshFeed96(); return; }
  if (e.target.closest("[data-fdp96]")) { postFeed96(); return; }
  if ((x = e.target.closest("[data-fl96]"))) { const th = S.threads[curT]; const p = th && feed96(th).posts.find(y => y.id === x.dataset.fl96); if (p) { p.liked = !p.liked; save(); x.classList.toggle("on", p.liked); x.textContent = "♥ " + fmtN96(p.likes + (p.liked ? 1 : 0)); } return; }
  if ((x = e.target.closest("[data-fcm96]"))) { commentFeed96(x.dataset.fcm96); return; }
}, true);

/* ================= ② 语音消息：先看字幕，付 💎 听原声 ================= */
function vnHTML96(m, i) {
  const dur = Math.max(3, Math.min(59, Math.round(String(m.txt || "").length / (Z96() ? 4.5 : 14))));
  return '<div class="msg vn96' + (m.paid ? " paid" : "") + '">' + avatar(m.who, 32) + '<div class="vb96"><button data-vn96="' + i + '"><i>' + (m.paid ? "▶" : "🔒") + '</i><span class="wv96">' + "<s></s>".repeat(14) + '</span><em>' + dur + '″</em></button>' +
    '<p>' + esc(m.txt || "") + '</p>' + (m.paid ? '' : '<small>' + L96("听 " + nameOf96(m.who) + " 的原声 · " + P96.voice + "💎", "Hear " + nameOf96(m.who) + "'s voice · " + P96.voice + "💎") + '</small>') + '</div></div>';
}
{ MSGKIND.inline("app96_social.js", ["vn96"], function(m, i, th, next){ if (m && m.k === "vn96") return vnHTML96(m, i); return next.apply(this, arguments); });; }
document.addEventListener("click", e => { const x = e.target.closest("[data-vn96]"); if (!x) return; e.stopPropagation();
  const th = S.threads[curT]; const m = th && th.msgs[+x.dataset.vn96]; if (!m) return;
  if (!m.paid) { if (!spend(P96.voice, "line")) return; m.paid = true; save(); try { renderChat(); } catch (_) {} }
  try { speak(m.txt, m.who); } catch (_) {} }, true);
/* the story's own voice moments: show the words first, the voice costs 💎 */
STOP_PRICE.voice = P96.voice;
{ const _sh = stopHTML; stopHTML = function (th) { let h = _sh.apply(this, arguments);
    try { const b = th.pk.stop; if (b && b[1] === "voice" && b[2] && b[2].txt) h = h.replace('<div class="stwave">', '<p class="vt96">“' + esc(Lz(b[2].txt)) + '”</p><div class="stwave">'); } catch (_) {} return h; }; }

/* ================= ⑤ 让 TA 主动找你（💎，永久） ================= */
function pc96() { S.pc96 = S.pc96 || {}; return S.pc96; }
function contactSheet96(cids) {
  cids = (cids || []).filter(c => ch(c)); if (!cids.length) return;
  sheet('<h2>💌 ' + L96("让 TA 主动找你", "Let them reach out") + '</h2><p class="xs faint" style="margin:4px 0 12px">' + L96("打开后，你不在的时候 TA 会主动发消息或语音给你（每天最多 2 条）。一次付费，永久有效。", "Once on, they'll message or send voice notes while you're away (up to 2 a day). Pay once, keep it forever.") + '</p><div class="stack" style="gap:8px">' +
    cids.map(c => { const on = pc96()[c]; return '<div class="opt">' + avatar(c, 40) + '<span class="grow"><b>' + esc(nameOf96(c)) + '</b><span>' + esc(Lz(ch(c).role) || "") + '</span></span>' + (on ? '<span class="pill96">✓ ' + L96("已开启", "On") + '</span>' : '<button class="btn btn-p btn-sm" data-pc96="' + c + '">' + P96.contact + '💎</button>') + '</div>'; }).join("") + '</div>');
}
document.addEventListener("click", e => { const x = e.target.closest("[data-pc96]"); if (!x) return; const c = x.dataset.pc96; if (!spend(P96.contact, "card")) return;
  pc96()[c] = { on: 1, since: now96(), last: 0, day: "", n: 0 }; save(); closeSheet(); chg96([["💌", L96(nameOf96(c) + " 会主动找你了", nameOf96(c) + " will reach out to you")]]); setTimeout(() => reach96(c, true), 4000); });
function dmThread96(cid) { return S.threads["c:" + cid] || newThread("solo", cid); }
async function reach96(cid, force) {
  const o = pc96()[cid]; if (!o || !ch(cid)) return; const day = new Date().toDateString(); if (o.day !== day) { o.day = day; o.n = 0; }
  if (!force && (o.n >= 2 || now96() - (o.last || 0) < 3 * 3600e3)) return;
  const c = ch(cid), zh = Z96(), src = Object.values(S.threads).filter(t => (t.cast || []).includes(cid)).sort((a, b) => (b.at || 0) - (a.at || 0))[0];
  let r = null; try { r = await ask96((zh ? "你是「" + c.n + "」，" + (Lz(c.role) || "") + "。" + (Lz(c.vibe) || Lz(c.looks) || "") + "\n你和对方最近的经历：\n" + (src ? recent96(src, 12) : "（刚认识）") +
      "\n\n现在对方不在线，你主动给对方发一条消息：像真人一样自然、贴合人设、带一点想念或钩子，不超过 50 字。选择用文字还是语音（语音更亲密）。"
    : "You are " + c.n + ", " + (Lz(c.role) || "") + ". " + (Lz(c.vibe) || Lz(c.looks) || "") + "\nWhat happened between you recently:\n" + (src ? recent96(src, 12) : "(you just met)") +
      "\n\nThey're offline. Reach out first: natural, in character, a little longing or a hook, under 35 words. Choose text or a voice note (voice is more intimate).") +
    '\nReply with ONLY JSON: {"kind":"text|voice","text":"..."} in ' + (zh ? "Simplified Chinese" : "English") + ".", 300); } catch (_) {}
  const text = (r && r.text) || (zh ? ["在干嘛？", "刚刚路过那个地方，想起你了。", "今天的事……你还好吗？"] : ["What are you up to?", "Walked past that place and thought of you.", "About today… you okay?"])[hash96(cid + day) % 3];
  const th = dmThread96(cid); const voice = r ? r.kind === "voice" : (hash96(text) % 2 === 0);
  th.msgs.push(voice ? { who: cid, k: "vn96", txt: String(text).slice(0, 200), at: now96() } : { who: cid, k: "say", txt: String(text).slice(0, 200), at: now96() });
  th.unread = true; th.at = now96(); o.last = now96(); o.n++; save();
  banner96(cid, voice ? L96(nameOf96(cid) + " 给你发来一条语音", nameOf96(cid) + " sent you a voice note") : L96(nameOf96(cid) + "：" + text, nameOf96(cid) + ": " + text));
}
function banner96(cid, txt) {
  const dev = $("#dev") || document.body; const b = document.createElement("button"); b.className = "bn96"; b.innerHTML = avatar(cid, 34) + '<span>' + esc(String(txt).slice(0, 60)) + '</span>';
  b.onclick = () => { b.remove(); try { openThread("c:" + cid); } catch (_) {} }; dev.appendChild(b); setTimeout(() => b.classList.add("in"), 30); setTimeout(() => b.remove(), 7000);
}
function tick96() { try { Object.keys(pc96()).forEach((c, i) => setTimeout(() => reach96(c), 2500 + i * 4000)); } catch (_) {} }
setTimeout(tick96, 6000); document.addEventListener("visibilitychange", () => { if (!document.hidden) tick96(); }); setInterval(tick96, 20 * 60e3);

/* ================= ③ 你的恋爱人格 ================= */
const DIMS96 = [["move", "主动出击", "Making the move"], ["true", "真实本色", "Being yourself"], ["line", "边界感", "Boundaries"], ["feel", "共情力", "Empathy"], ["dream", "浪漫想象", "Romantic imagination"], ["safe", "安全感", "Security"]];
function done96(th) { const w = wd(th.wid); if (!w || !w.pack) return 0; const n = Object.keys((th.pk && th.pk.picks) || {}).length; return Math.min(n, (w.pack.chapters || []).length); }
function total96(th) { const w = wd(th.wid); return (w && w.pack && w.pack.chapters.length) || 1; }
async function lp96(th) {
  const w = wd(th.wid), n = done96(th); if (!w || !n) return null; th.lp96 = th.lp96 || {}; if (th.lp96.n === n && th.lp96.dims) return th.lp96;
  const picks = Object.entries(th.pk.picks || {}).map(([k, v]) => { const c = w.pack.chapters[k - 1], x = c && (c.choices || []).find(y => y.k === v); return (Z96() ? "第" + k + "章：" : "Ch" + k + ": ") + (x ? Lz(x.t) : v); }).join("\n");
  const said = (th.msgs || []).filter(m => m.who === "me" && m.txt).slice(-25).map(m => "- " + String(m.txt).slice(0, 100)).join("\n");
  const zh = Z96(); let r = null;
  try { r = await ask96((zh ? "根据一位读者在互动恋爱剧《" + Lz(w.title) + "》里的选择和亲口说的话，分析 TA 在亲密关系里是怎样的人。温暖、具体、像懂 TA 的朋友，不要说教，不要做心理诊断。"
                            : "From a reader's choices and own words in the interactive romance “" + Lz(w.title) + "”, describe who they are in love. Warm, specific, like a friend who gets them — no lecturing, no diagnosis.") +
    "\n\n" + (zh ? "关键选择：\n" : "Key choices:\n") + picks + "\n\n" + (zh ? "TA 说过的话：\n" : "Things they said:\n") + (said || (zh ? "（很少打字）" : "(rarely typed)")) +
    "\n\n" + (zh ? "6 个维度，每个给 0-100 分和一句 30 字以内的解读：" : "Six dimensions, each a 0-100 score and a reading under 20 words: ") + DIMS96.map(d => d[0] + "=" + (zh ? d[1] : d[2])).join(", ") +
    '\nAlso a 4-character (or 2-3 word) love-type name and a one-line tagline.\nReply with ONLY JSON: {"type":"...","tagline":"...","dims":{"move":{"score":70,"text":"..."},...}} in ' + (zh ? "Simplified Chinese" : "English") + ".", 900); } catch (_) { return th.lp96.dims ? th.lp96 : null; }
  if (!r || !r.dims) return th.lp96.dims ? th.lp96 : null;
  th.lp96 = { n, type: String(r.type || "").slice(0, 20), tagline: String(r.tagline || "").slice(0, 80), dims: DIMS96.map(d => ({ k: d[0], score: Math.max(0, Math.min(100, +((r.dims[d[0]] || {}).score) || 50)), text: String((r.dims[d[0]] || {}).text || "").slice(0, 80) })) }; save(); return th.lp96;
}
async function lpSheet96(tid) {
  const th = S.threads[tid]; if (!th) return; const w = wd(th.wid), n = done96(th), tot = total96(th), open = Math.min(6, Math.max(n, n >= tot ? 6 : 0) || n), full = n >= tot;
  if (!n) { sheet('<h2>💘 ' + L96("你的恋爱人格", "Your love type") + '</h2><p class="dim" style="margin-top:8px">' + L96("读完第 1 章就能解锁第一项分析。", "Finish chapter 1 to unlock the first reading.") + '</p>'); return; }
  sheet('<h2>💘 ' + L96("你的恋爱人格", "Your love type") + '</h2><p class="xs faint">' + esc(Lz(w.title)) + '</p><p class="fe96" id="lpw96">✨ ' + L96("正在读懂你……", "Reading you…") + '</p>');
  const r = await lp96(th); const box = $(".sheet"); if (!box) return;
  if (!r) { const x = $("#lpw96"); if (x) x.textContent = L96("AI 现在不可用，稍后再试", "AI isn't available right now"); return; }
  const shown = Math.min(6, Math.max(1, Math.round(6 * n / tot)));
  box.querySelector("#lpw96").outerHTML = (full ? '<div class="lpt96"><b>' + esc(r.type) + '</b><span>' + esc(r.tagline) + '</span></div>' : '<div class="lpt96 lk"><b>？？？？</b><span>' + L96("读完整部剧揭晓你的恋爱人格", "Finish the story to reveal your type") + '</span></div>') +
    '<div class="lpd96">' + r.dims.map((d, i) => { const dn = DIMS96[i]; const ok = i < shown; return '<div class="' + (ok ? "" : "lk") + '"><div class="lph96"><b>' + esc(Z96() ? dn[1] : dn[2]) + '</b><em>' + (ok ? d.score : "🔒") + '</em></div><div class="lpb96"><i style="width:' + (ok ? d.score : 30) + '%"></i></div><p>' + (ok ? esc(d.text) : L96("再读 " + Math.ceil((i + 1) * tot / 6 - n) + " 章解锁", "Unlocks in " + Math.ceil((i + 1) * tot / 6 - n) + " more chapters")) + '</p></div>'; }).join("") + '</div>' +
    (full ? '<button class="btn btn-p btn-block" data-lpshare96="' + esc(tid) + '">📤 ' + L96("生成分享卡片", "Make a share card") + '</button>' : '<p class="xs faint" style="text-align:center;margin-top:8px">' + L96("已读 " + n + " / " + tot + " 章 · 解锁 " + shown + " / 6 项", n + " / " + tot + " chapters · " + shown + " / 6 unlocked") + '</p>');
}
async function lpShare96(tid) {
  const th = S.threads[tid], r = th && th.lp96, w = th && wd(th.wid); if (!r) return;
  const cv = document.createElement("canvas"); cv.width = 1080; cv.height = 1440; const g = cv.getContext("2d");
  const gr = g.createLinearGradient(0, 0, 1080, 1440); gr.addColorStop(0, "#2A1530"); gr.addColorStop(1, "#0C0B10"); g.fillStyle = gr; g.fillRect(0, 0, 1080, 1440);
  try { const im = new Image(); im.crossOrigin = "anonymous"; im.src = artSrc(mainOf(th)); await new Promise(res => { im.onload = res; im.onerror = res; setTimeout(res, 2500); }); if (im.width) { g.globalAlpha = .35; g.drawImage(im, 0, 0, 1080, 1080 * im.height / im.width); g.globalAlpha = 1; } } catch (_) {}
  const F = "-apple-system,'PingFang SC',sans-serif"; g.fillStyle = "#F6D3AE"; g.font = "600 40px " + F; g.fillText(L96("我的恋爱人格", "My love type"), 80, 140);
  g.fillStyle = "#fff"; g.font = "800 110px " + F; g.fillText(r.type, 80, 280); g.font = "400 40px " + F; g.fillStyle = "#E9E4EE"; g.fillText(r.tagline.slice(0, 26), 80, 350);
  r.dims.forEach((d, i) => { const y = 470 + i * 140; g.fillStyle = "#fff"; g.font = "700 42px " + F; g.fillText(Z96() ? DIMS96[i][1] : DIMS96[i][2], 80, y); g.fillText(String(d.score), 920, y);
    g.fillStyle = "rgba(255,255,255,.15)"; g.fillRect(80, y + 22, 920, 18); const bg = g.createLinearGradient(80, 0, 1000, 0); bg.addColorStop(0, "#F0B77E"); bg.addColorStop(1, "#EE6F97"); g.fillStyle = bg; g.fillRect(80, y + 22, 920 * d.score / 100, 18); });
  g.fillStyle = "#9C93A6"; g.font = "400 34px " + F; g.fillText(L96("来自《" + Lz(w.title) + "》· MIRU", "From “" + Lz(w.title) + "” · MIRU"), 80, 1370);
  const url = cv.toDataURL("image/png");
  try { const blob = await (await fetch(url)).blob(); const file = new File([blob], "miru-love-type.png", { type: "image/png" }); if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: "MIRU" }); return; } } catch (_) {}
  sheet('<h2>📤 ' + L96("长按图片保存或分享", "Long-press to save or share") + '</h2><img src="' + url + '" style="width:100%;border-radius:16px;margin-top:10px" alt=""><a class="btn btn-p btn-block" style="margin-top:10px" download="miru-love-type.png" href="' + url + '">' + L96("保存图片", "Save image") + '</a>');
}
function lpList96() {
  const L = Object.values(S.threads).filter(t => t.pk && t.wid && wd(t.wid)).sort((a, b) => (b.at || 0) - (a.at || 0));
  sheet('<h2>💘 ' + L96("你的恋爱人格", "Your love type") + '</h2><p class="xs faint" style="margin:4px 0 10px">' + L96("每读完一章解锁一项，读完整部剧拿到完整报告。", "Each chapter unlocks a reading; finish a story for the full report.") + '</p><div class="stack" style="gap:8px">' +
    (L.length ? L.map(t => '<button class="opt" data-lp96="' + esc(t.id) + '"><span class="ic">📖</span><span class="grow"><b>' + esc(Lz(wd(t.wid).title)) + '</b><span>' + done96(t) + ' / ' + total96(t) + L96(" 章", " chapters") + (t.lp96 && t.lp96.type && done96(t) >= total96(t) ? ' · ' + esc(t.lp96.type) : '') + '</span></span>›</button>').join("") : '<p class="dim">' + L96("先去读一部剧吧。", "Start a story first.") + '</p>') + '</div>');
}
document.addEventListener("click", e => { let x;
  if ((x = e.target.closest("[data-lp96]"))) { lpSheet96(x.dataset.lp96); return; }
  if ((x = e.target.closest("[data-lpshare96]"))) { lpShare96(x.dataset.lpshare96); return; }
  if (e.target.closest("[data-lplist96]")) { lpList96(); return; }
  if ((x = e.target.closest("[data-pcs96]"))) { const th = S.threads[curT]; closeSheet(); setTimeout(() => contactSheet96(th ? th.cast.filter(c => !(th.pk && c === th.pk.as)) : [x.dataset.pcs96]), 150); return; }
});
/* chapter finished → a nudge to the reading */
{ const _ap = packAfterPick; packAfterPick = function (th) { const r = _ap.apply(this, arguments); try { const n = done96(th); if (n && curT === th.id) setTimeout(() => chg96([["💘", L96("恋爱人格解锁新一项", "A new love-type reading unlocked")]]), 3400); } catch (_) {} return r; }; }
/* chat menu ⋯: love type · let them reach out */
{ const _ms = menuSheet; menuSheet = function () { const r = _ms.apply(this, arguments);
    try { const th = S.threads[curT], st = $(".sheet .stack"); if (!th || !st) return r;
      st.insertAdjacentHTML("afterbegin", (th.pk ? '<button class="opt" data-lp96="' + esc(th.id) + '"><span class="ic">💘</span><span class="grow"><b>' + L96("我的恋爱人格", "My love type") + '</b><span>' + L96("根据你在这部剧里的选择分析", "Based on your choices in this story") + '</span></span></button>' : '') +
        '<button class="opt" data-pcs96="' + esc(mainOf(th)) + '"><span class="ic">💌</span><span class="grow"><b>' + L96("让 TA 主动找你", "Let them reach out") + '</b><span>' + P96.contact + '💎 · ' + L96("永久", "forever") + '</span></span></button>'); } catch (_) {}
    return r; }; }
/* Me page entry */
{ const _rm = renderMe; renderMe = function (v) { const r = _rm.apply(this, arguments);
    try { const host = (v && v.querySelector && (v.querySelector(".scroll") || v)) || $("#tabv"); if (host && !host.querySelector(".lp96me")) { const at = host.querySelector(".me95"); const h = '<button class="card lp96me" data-lplist96="1"><span style="font-size:26px">💘</span><span class="grow"><b>' + L96("你的恋爱人格", "Your love type") + '</b><span class="xs dim">' + L96("从你在剧里的每个选择，看见你是怎样爱人的", "See how you love, from every choice you've made") + '</span></span>›</button>'; if (at) at.insertAdjacentHTML("beforebegin", h); else host.insertAdjacentHTML("beforeend", h); } } catch (_) {}
    return r; }; }

/* ================= ⑥ 遇见：滑卡 ================= */
function sw96() { S.sw96 = S.sw96 || { day: "", used: 0, extra: 0, seen: [], liked: [] }; const d = new Date().toDateString(); if (S.sw96.day !== d) { S.sw96.day = d; S.sw96.used = 0; S.sw96.extra = 0; } return S.sw96; }
function deck96() {
  const st = sw96(), pool = allChars().filter(id => { const c = ch(id); if (!c || !artSrc(id)) return false; const w = wd(c.w); if (w && typeof orOK === "function" && !orOK(w)) return false; return !st.seen.includes(id); });
  if (!pool.length) { st.seen = []; save(); return allChars().filter(id => ch(id)).slice(0, 40); }
  return pool.sort((a, b) => hash96(a + st.day) - hash96(b + st.day)).slice(0, 40);
}
function cardHTML96(id) {
  const c = ch(id), w = wd(c.w), tags = ((w && w.tags) || []).slice(0, 3);
  return '<div class="sc96" data-sc96="' + esc(id) + '"><img src="' + esc(artSrc(id)) + '" alt="" draggable="false"><div class="sci96"><b>' + esc(first(c.n)) + (c.age ? '<small>' + c.age + '</small>' : '') + '</b><span>' + esc(Lz(c.role) || "") + '</span><p>' + esc((Lz(c.pitch) || Lz(c.vibe) || "").slice(0, 70)) + '</p><div>' + tags.map(x => '<i>' + esc(typeof TAG_ZH !== "undefined" && Z96() && TAG_ZH[x] ? TAG_ZH[x] : x) + '</i>').join("") + '</div></div><em class="lk96">LIKE</em><em class="np96">NOPE</em></div>';
}
let DECK96 = [];
function openSwipe96() {
  DECK96 = deck96(); let el = $("#sw96"); if (!el) { el = document.createElement("div"); el.id = "sw96"; ($("#dev") || document.body).appendChild(el); }
  el.hidden = false; renderSwipe96();
}
function swLeft96() { const st = sw96(); return Math.max(0, P96.freeSwipes + st.extra - st.used); }
function renderSwipe96() {
  const el = $("#sw96"); if (!el) return; const left = swLeft96();
  el.innerHTML = '<div class="swh96"><button data-swx96="1">✕</button><b>💘 ' + L96("遇见", "Meet") + '</b><small>' + L96("今日剩余 ", "Left today ") + left + '</small></div><div class="swd96">' +
    (left <= 0 ? '<div class="swo96"><p>' + L96("今天的免费滑动用完了", "You're out of swipes for today") + '</p><button class="btn btn-p" data-swmore96="1">' + L96("再滑 30 次 · ", "30 more swipes · ") + P96.swipes + '💎</button></div>'
      : DECK96.slice(0, 2).reverse().map(cardHTML96).join("")) + '</div>' +
    '<div class="swb96"><button data-swn96="1" class="n">✕</button><button data-sws96="1" class="s">⭐<small>' + P96.superlike + '💎</small></button><button data-swy96="1" class="y">♥</button></div>';
  wireSwipe96();
}
function wireSwipe96() {
  const top = $("#sw96 .sc96:last-child"); if (!top) return; let x0 = 0, dx = 0, on = false;
  top.onpointerdown = e => { on = true; x0 = e.clientX; top.setPointerCapture(e.pointerId); top.style.transition = "none"; };
  top.onpointermove = e => { if (!on) return; dx = e.clientX - x0; top.style.transform = "translateX(" + dx + "px) rotate(" + dx / 18 + "deg)"; top.classList.toggle("l", dx > 40); top.classList.toggle("r", dx < -40); };
  top.onpointerup = () => { if (!on) return; on = false; top.style.transition = ""; if (dx > 110) swipe96("like"); else if (dx < -110) swipe96("nope"); else { top.style.transform = ""; top.classList.remove("l", "r"); } dx = 0; };
}
async function swipe96(kind) {
  const id = DECK96[0]; if (!id) return; if (swLeft96() <= 0) { renderSwipe96(); return; }
  if (kind === "super" && !spend(P96.superlike, "card")) return;
  const st = sw96(); st.used++; st.seen.push(id); if (st.seen.length > 400) st.seen = st.seen.slice(-200); save();
  const top = $("#sw96 .sc96:last-child"); if (top) { top.style.transform = "translateX(" + (kind === "nope" ? -600 : 600) + "px) rotate(" + (kind === "nope" ? -25 : 25) + "deg)"; top.style.opacity = "0"; }
  DECK96.shift(); if (!DECK96.length) DECK96 = deck96();
  if (kind === "nope") { setTimeout(renderSwipe96, 260); return; }
  st.liked.push(id); save(); const th = dmThread96(id); th.love = th.love || {}; loveWrite(th, id, 0, "social96:like", {absolute:kind === "super" ? 18 : 8, floor:true});
  if (kind === "super") { const c = ch(id); const op = (th.msgs.find(m => m.who === id && m.txt) || {}).txt || L96("你好。", "Hey."); th.msgs.push({ who: id, k: "vn96", txt: L96("听说你给了我超级喜欢……", "Heard you super-liked me…") + " " + String(op).replace(/\*[^*]*\*/g, "").trim().slice(0, 80), at: now96() }); th.unread = true; save(); }
  setTimeout(() => matchSheet96(id, kind === "super"), 280);
}
function matchSheet96(id, sup) {
  const el = $("#sw96 .swd96"); if (!el) return;
  el.innerHTML = '<div class="mt96"><b>' + (sup ? "⭐ " : "") + L96("匹配成功！", "It's a match!") + '</b><div class="mta96">' + meAv(84) + avatar(id, 84) + '</div><p>' + L96(nameOf96(id) + " 也在等你开口。", nameOf96(id) + " is waiting for you to say something.") + '</p><button class="btn btn-p btn-block" data-swchat96="' + esc(id) + '">💬 ' + L96("开始聊天", "Say hi") + '</button><button class="lnk" data-swgo96="1">' + L96("继续滑", "Keep swiping") + '</button></div>';
}
document.addEventListener("click", e => { let x;
  if (e.target.closest("[data-swopen96]")) { openSwipe96(); return; }
  if (e.target.closest("[data-swx96]")) { const el = $("#sw96"); if (el) el.hidden = true; return; }
  if (e.target.closest("[data-swn96]")) { swipe96("nope"); return; }
  if (e.target.closest("[data-swy96]")) { swipe96("like"); return; }
  if (e.target.closest("[data-sws96]")) { swipe96("super"); return; }
  if (e.target.closest("[data-swgo96]")) { renderSwipe96(); return; }
  if (e.target.closest("[data-swmore96]")) { if (!spend(P96.swipes, "card")) return; sw96().extra += 30; save(); renderSwipe96(); return; }
  if ((x = e.target.closest("[data-swchat96]"))) { const id = x.dataset.swchat96; const el = $("#sw96"); if (el) el.hidden = true; dmThread96(id); try { openThread("c:" + id); } catch (_) {} return; }
}, true);
/* Discover: entry banner */
{ const _dm = discMain; discMain = function () { let h = _dm.apply(this, arguments);
    try { h = '<button class="sw96e" data-swopen96="1"><span class="sw96ea">' + allChars().filter(id => ch(id)).slice(0, 3).map(id => '<img src="' + esc(artSrc(id)) + '" alt="">').join("") + '</span><span class="grow"><b>💘 ' + L96("遇见", "Meet someone") + '</b><span>' + L96("左滑跳过，右滑开始聊天", "Swipe left to pass, right to start chatting") + '</span></span>›</button>' + h; } catch (_) {}
    return h; }; }

(function () { const st = document.createElement("style"); st.textContent = `
#chg96{position:absolute;left:0;right:0;top:86px;z-index:80;display:flex;flex-direction:column;align-items:center;gap:6px;pointer-events:none}
.chg96c{background:rgba(20,16,26,.92);border:1px solid rgba(240,183,126,.45);border-radius:16px;padding:8px 14px;box-shadow:0 10px 30px #0008;animation:chg96 .35s ease;display:grid;gap:4px;min-width:200px;transition:opacity .5s,transform .5s}
.chg96c.out{opacity:0;transform:translateY(-10px)}.chg96c div{display:flex;align-items:center;gap:8px;font-size:13.5px;color:#fff}.chg96c i{font-style:normal}.chg96c span{flex:1}.chg96c b.up{color:#7FE0A8}.chg96c b.dn{color:#FF8A8A}
@keyframes chg96{from{opacity:0;transform:translateY(-14px) scale(.96)}}
#fd96,#sw96{position:absolute;inset:0;z-index:70;background:#0C0B10;display:flex;flex-direction:column}#fd96[hidden],#sw96[hidden]{display:none}
.fdh96{display:flex;align-items:center;gap:10px;padding:calc(10px + env(safe-area-inset-top,0px)) 12px 10px;border-bottom:1px solid rgba(255,255,255,.08)}.fdh96 button{background:none;border:0;color:#fff;font-size:20px;width:36px}.fdh96 b{display:block;font-size:16px}.fdh96 small{color:#9C93A6;font-size:12px}
.fds96{flex:1;overflow-y:auto;padding:10px 12px 30px}.ft96{background:rgba(255,255,255,.05);border-radius:14px;padding:10px 12px;margin-bottom:10px}.ftt96{font-weight:800;font-size:13px;color:#FF9A6B;margin-bottom:6px}
.ft96>div:not(.ftt96){display:flex;gap:10px;align-items:center;padding:5px 0;font-size:14px}.ft96 i{font-style:normal;color:#F0B77E;font-weight:800;width:16px}.ft96 span{flex:1}.ft96 em{font-style:normal;font-size:10px;background:#EE4F6F;color:#fff;border-radius:4px;padding:1px 4px}
.fw96{display:flex;gap:8px;align-items:flex-end;margin-bottom:10px}.fw96 textarea{flex:1;border-radius:12px;padding:9px 10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:#fff;font-size:14px;resize:none}.fw96 button{border:0;border-radius:999px;padding:9px 14px;font-weight:800;background:linear-gradient(135deg,#F0B77E,#EE6F97);color:#1B1017;font-size:13px}
.fp96{display:flex;gap:10px;padding:12px 2px;border-bottom:1px solid rgba(255,255,255,.06)}.fa96 img,.fa96 span{width:40px;height:40px;border-radius:50%;object-fit:cover;display:grid;place-items:center;color:#fff;font-weight:800}
.fh96{display:flex;align-items:center;gap:5px;flex-wrap:wrap}.fh96 b{font-size:14px}.fh96 small{color:#8A8194;font-size:12px}.fh96 em{font-style:normal;font-size:10px;padding:1px 6px;border-radius:999px;background:rgba(255,255,255,.08);color:#C9C1D2;margin-left:auto}.fh96 em.k-char,.fh96 em.k-me{background:rgba(240,183,126,.2);color:#F6D3AE}.fh96 em.k-anti{background:rgba(255,90,90,.15);color:#FF9C9C}.vf96{font-style:normal;color:#6FB6FF;font-size:12px}
.fp96 p{margin:4px 0 6px;font-size:14.5px;line-height:1.5;color:#EDE8F2}.fc96{background:rgba(255,255,255,.04);border-radius:10px;padding:6px 9px;font-size:13px;color:#CFC7D8;display:grid;gap:3px;margin-bottom:6px}.fc96 b{color:#fff}
.fx96{display:flex;gap:16px}.fx96 button{background:none;border:0;color:#9C93A6;font-size:12.5px;padding:0}.fx96 button.on{color:#FF6F91}.fe96{color:#9C93A6;text-align:center;font-size:13px;margin:16px 0}
.vn96{display:flex;gap:8px;align-items:flex-start;margin:6px 0}.vb96{max-width:76%;background:rgba(24,20,32,.88);border-radius:16px;padding:9px 12px;border:1px solid rgba(255,255,255,.08)}.vb96 button{display:flex;align-items:center;gap:8px;background:none;border:0;color:#fff;padding:0;width:100%}
.vb96 button i{font-style:normal;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,#F0B77E,#EE6F97);color:#1B1017;font-size:12px}.wv96{display:flex;gap:2px;align-items:center;flex:1}.wv96 s{display:block;width:3px;border-radius:2px;background:#F6D3AE;height:8px}.wv96 s:nth-child(3n){height:16px}.wv96 s:nth-child(4n){height:11px}.vb96 em{font-style:normal;font-size:12px;color:#9C93A6}
.vb96 p{margin:6px 0 0;font-size:13.5px;color:#D7CFE0;line-height:1.5}.vb96 small{display:block;margin-top:4px;color:#F0B77E;font-size:11.5px}.vt96{margin:0 0 6px;font-size:14px;color:#fff;line-height:1.5}
.bn96{position:absolute;left:12px;right:12px;top:-80px;z-index:90;display:flex;gap:10px;align-items:center;padding:10px 12px;border-radius:16px;background:rgba(28,22,36,.96);border:1px solid rgba(240,183,126,.4);color:#fff;text-align:left;font-size:14px;transition:top .35s;box-shadow:0 10px 30px #0009}.bn96.in{top:calc(10px + env(safe-area-inset-top,0px))}
.pill96{font-size:12px;color:#7FE0A8}
.lpt96{text-align:center;margin:14px 0 6px}.lpt96 b{display:block;font-size:30px;background:linear-gradient(135deg,#F0B77E,#EE6F97);-webkit-background-clip:text;color:transparent}.lpt96 span{color:#CFC7D8;font-size:13px}.lpt96.lk b{color:#6B6375;background:none}
.lpd96{display:grid;gap:12px;margin:14px 0}.lpd96 .lk{opacity:.55}.lph96{display:flex;justify-content:space-between;font-size:14px}.lph96 em{font-style:normal;color:#F6D3AE;font-weight:800}.lpb96{height:8px;background:rgba(255,255,255,.1);border-radius:6px;margin:5px 0}.lpb96 i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#F0B77E,#EE6F97)}.lpd96 .lk .lpb96 i{background:rgba(255,255,255,.18)}.lpd96 p{margin:0;font-size:12.5px;color:#BDB4C7}
.lp96me{display:flex;gap:12px;align-items:center;width:100%;text-align:left;margin-top:14px}.lp96me b{display:block}
.sw96e{display:flex;gap:12px;align-items:center;width:100%;text-align:left;margin:0 0 14px;padding:12px 14px;border-radius:18px;border:1px solid rgba(238,111,151,.35);background:linear-gradient(135deg,rgba(238,111,151,.16),rgba(240,183,126,.10));color:#fff}.sw96e b{display:block;font-size:15px}.sw96e .grow span{font-size:12px;color:#CFC7D8}.sw96ea{display:flex}.sw96ea img{width:34px;height:34px;border-radius:50%;object-fit:cover;border:2px solid #0C0B10;margin-left:-10px}.sw96ea img:first-child{margin-left:0}
.swh96{display:flex;align-items:center;gap:10px;padding:calc(10px + env(safe-area-inset-top,0px)) 14px 8px}.swh96 button{background:none;border:0;color:#fff;font-size:20px}.swh96 b{flex:1;font-size:16px}.swh96 small{color:#9C93A6}
.swd96{flex:1;position:relative;margin:4px 14px}.sc96{position:absolute;inset:0;border-radius:22px;overflow:hidden;background:#1A1622;touch-action:none;transition:transform .3s,opacity .3s;box-shadow:0 14px 40px #0009}.sc96 img{width:100%;height:100%;object-fit:cover;pointer-events:none}
.sci96{position:absolute;left:0;right:0;bottom:0;padding:60px 18px 18px;background:linear-gradient(transparent,rgba(0,0,0,.85))}.sci96 b{font-size:28px;display:flex;align-items:baseline;gap:8px}.sci96 b small{font-size:20px;font-weight:400}.sci96 span{display:block;color:#F6D3AE;font-size:14px}.sci96 p{margin:6px 0 8px;font-size:14px;color:#E9E4EE;line-height:1.45}.sci96 i{font-style:normal;font-size:11.5px;padding:3px 9px;border-radius:999px;background:rgba(255,255,255,.14);margin-right:5px}
.lk96,.np96{position:absolute;top:28px;font-style:normal;font-weight:900;font-size:30px;padding:4px 12px;border:4px solid;border-radius:10px;opacity:0;transition:opacity .15s}.lk96{left:20px;color:#7FE0A8;transform:rotate(-14deg)}.np96{right:20px;color:#FF6F7F;transform:rotate(14deg)}.sc96.l .lk96,.sc96.r .np96{opacity:1}
.swb96{display:flex;justify-content:center;gap:22px;padding:14px 0 calc(16px + env(safe-area-inset-bottom,0px))}.swb96 button{width:62px;height:62px;border-radius:50%;border:0;font-size:26px;display:grid;place-items:center;background:#1E1A26;color:#fff;box-shadow:0 6px 18px #0008}.swb96 .n{color:#FF6F7F}.swb96 .y{color:#7FE0A8}.swb96 .s{color:#6FB6FF;width:52px;height:52px;align-self:center;font-size:20px;line-height:1}.swb96 .s small{font-size:10px;color:#9C93A6}
.swo96,.mt96{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:20px}.mt96 b{font-size:30px;background:linear-gradient(135deg,#F0B77E,#EE6F97);-webkit-background-clip:text;color:transparent}.mta96{display:flex;gap:-10px}.mta96 .av{margin:0 -8px;border:3px solid #0C0B10}.mt96 p{color:#CFC7D8}.mt96 .btn{max-width:260px}.mt96 .lnk{background:none;border:0;color:#9C93A6}`; document.head.appendChild(st); })();
