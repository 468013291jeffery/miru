/* ================= v2.8 · 亲密度 · 心声 · 重新生成/编辑 · 指定对象说话 =================
   1) Affinity: a 💗 chip in every chat header (stage + points → opens the relationship path). Daily first chat with him +2.
      Chat gains capped at +15 per character per day (no farming, rule R14); never decays while you're away (R47).
      Each new stage pays out 💎 and unlocks more free 心声 per day.
   2) 心声 (inner voice): under his latest line, or from any of his lines (tap the line → 💭), read what he didn't say.
      Generated from his profile, what he knows and the moment (R12/R42); free uses grow with the relationship stage, then 💎1.
   3) Regenerate / edit: under the latest reply — ↻ 重新生成 (up to 5 versions, ‹ 2/3 › to switch back; regenerating does not
      add affinity twice), ✎ 编辑 (fix any line of his reply; edits become canon). Tap your own last message → ✎ to edit and re-ask.
   4) Multi-character scenes: 「对谁说」 chips above the input — the one you address answers first. */
const T73 = {
  regen: { zh: "重新生成", en: "Regenerate", ja: "再生成", ko: "다시 생성", es: "Regenerar" },
  edit: { zh: "编辑", en: "Edit", ja: "編集", ko: "편집", es: "Editar" },
  mind: { zh: "他在想什么", en: "What's he thinking", ja: "本音を聞く", ko: "속마음 듣기", es: "Lo que piensa" },
  mindShort: { zh: "心声", en: "Inner voice", ja: "本音", ko: "속마음", es: "Voz interior" },
  edited: { zh: "已编辑", en: "edited", ja: "編集済み", ko: "편집됨", es: "editado" },
  save: { zh: "保存", en: "Save", ja: "保存", ko: "저장", es: "Guardar" },
  saveRe: { zh: "保存并重新回复", en: "Save & get a new reply", ja: "保存して返事をもらう", ko: "저장하고 다시 답변 받기", es: "Guardar y responder de nuevo" },
  editH: { zh: "编辑这段回复", en: "Edit this reply", ja: "この返事を編集", ko: "이 답변 편집", es: "Editar esta respuesta" },
  editHint: { zh: "改过的内容会成为剧情的一部分，他会记得你改后的版本。", en: "Your edit becomes part of the story — he remembers the edited version.", ja: "編集した内容が物語の一部になります。", ko: "수정한 내용이 이야기의 일부가 돼요.", es: "Tu edición pasa a formar parte de la historia." },
  maxV: { zh: "最多保留 5 个版本，可以用 ‹ › 切回之前的", en: "Up to 5 versions — use ‹ › to switch back", ja: "最大5バージョンまで。‹ › で切り替え", ko: "최대 5개 버전까지 · ‹ › 로 전환", es: "Hasta 5 versiones; usa ‹ › para volver" },
  free: { zh: "今天还剩 {n} 次免费心声", en: "{n} free inner-voice reads left today", ja: "今日の無料：あと {n} 回", ko: "오늘 무료 {n}회 남음", es: "Te quedan {n} lecturas gratis hoy" },
  paid: { zh: "今天的免费次数用完了，这次 💎1", en: "Free reads used up today — this one is 💎1", ja: "本日の無料分は終了。今回は💎1", ko: "오늘 무료 횟수를 다 썼어요 · 이번엔 💎1", es: "Gratis agotadas hoy: esta cuesta 💎1" },
  nogems: { zh: "钻石不够了", en: "Not enough diamonds", ja: "ダイヤが足りません", ko: "다이아가 부족해요", es: "No tienes diamantes suficientes" },
  addr: { zh: "对谁说", en: "Talk to", ja: "話す相手", ko: "말할 상대", es: "Hablar con" },
  all: { zh: "所有人", en: "Everyone", ja: "全員", ko: "모두", es: "Todos" },
  daily: { zh: "今天第一次来找 {n} · 亲密度 +2", en: "First visit to {n} today · affinity +2", ja: "今日初めて {n} に会いに来た · 親密度 +2", ko: "오늘 {n}을(를) 처음 찾아왔어요 · 친밀도 +2", es: "Primera visita a {n} hoy · afinidad +2" },
  cap: { zh: "今天和 {n} 聊了很多，亲密度明天还能继续涨（不来也不会掉）", en: "You've talked a lot with {n} today — affinity can keep growing tomorrow (it never drops while you're away)", ja: "今日は {n} とたくさん話しました。親密度は明日また上がります（来なくても下がりません）", ko: "오늘 {n}와(과) 많이 얘기했어요. 친밀도는 내일 다시 올라요 (안 와도 안 떨어져요)", es: "Hoy hablaste mucho con {n}; la afinidad seguirá creciendo mañana (no baja si no vienes)" },
  rewardT: { zh: "🎁 关系升级 · {s}", en: "🎁 Relationship level up · {s}", ja: "🎁 関係レベルアップ · {s}", ko: "🎁 관계 레벨 업 · {s}", es: "🎁 Subes de nivel · {s}" },
  rewardS: { zh: "奖励 💎{g} 已到账 · 解锁每天 {m} 次免费心声", en: "💎{g} added · {m} free inner-voice reads a day unlocked", ja: "💎{g} 獲得 · 本音の無料回数が1日 {m} 回に", ko: "💎{g} 지급 · 하루 무료 속마음 {m}회 해금", es: "+💎{g} · {m} lecturas gratis al día desbloqueadas" },
  rules: { zh: "亲密度靠真实互动增长：每天来聊天（当天第一次 +2）、完成下面的任务、在剧情里做出他在乎的选择。每天聊天最多 +15；你不来的日子也不会下降。每升一级送钻石，并解锁更多免费心声。", en: "Affinity grows through real interaction: chat each day (first visit +2), do the tasks below, and make choices he cares about in the story. Chat adds up to +15 a day; it never drops on days you're away. Each level pays diamonds and unlocks more free inner-voice reads.", ja: "親密度は本当のやりとりで上がります：毎日話す（その日初回 +2）、下のタスク、彼が大切にする選択。会話での上昇は1日 +15 まで。来ない日も下がりません。", ko: "친밀도는 진짜 교류로 올라가요: 매일 대화(그날 첫 방문 +2), 아래 과제, 그가 신경 쓰는 선택. 대화로는 하루 최대 +15, 안 오는 날에도 떨어지지 않아요.", es: "La afinidad crece con interacción real: habla cada día (primera visita +2), haz las tareas y toma decisiones que le importan. El chat suma hasta +15 al día y nunca baja si no vienes." },
};
function t73(k, v) { const x = T73[k] || {}; let s = x[S.lang] || x.en || ""; Object.keys(v || {}).forEach(a => { s = s.split("{" + a + "}").join(v[a]); }); return s; }
function day73() { return new Date().toISOString().slice(0, 10); }
function lastAIStart73(th) { if (!th || !th.msgs || !th.msgs.length) return -1; let k = th.msgs.length - 1; while (k >= 0 && th.msgs[k].who !== "me" && !th.msgs[k].ai) k--; if (k < 0 || !th.msgs[k].ai) return -1; let j = k; while (j > 0 && th.msgs[j - 1].ai) j--; return j; }

/* ---------- 1 · affinity ---------- */
const AF_CAP = MIRU_TUNE.affinity.cap, AF_MIND = MIRU_TUNE.affinity.mind, AF_GEMS = MIRU_TUNE.affinity.gems;
const _playBeats73 = playBeats;
playBeats = async function (th, r, ctx, silent) {
  const before = JSON.parse(JSON.stringify(th.love || {})), st0 = {};
  try { (th.cast || []).forEach(c => { st0[c] = stageOf(th, c); }); } catch (_) {}
  const out = await _playBeats73.apply(this, arguments);
  try {
    const d = day73(); if (!th.afDay || th.afDay.d !== d) th.afDay = { d, g: {}, told: {} };
    Object.keys(th.love || {}).forEach(cid => {
      const gain = (th.love[cid] || 0) - (before[cid] || 0); if (gain <= 0) return;
      const used = th.afDay.g[cid] || 0, allow = Math.max(0, AF_CAP - used);
      if (gain > allow) { loveWrite(th, cid, 0, "af:cap", { absolute: (before[cid] || 0) + allow }); if (!th.afDay.told[cid] && ch(cid)) { th.afDay.told[cid] = 1; setTimeout(() => toast(t73("cap", { n: first(ch(cid).n) })), 1200); } }
      th.afDay.g[cid] = used + Math.min(gain, allow);
    });
    af73Rewards(th, st0);
    save(); if (curT === th.id && !silent) renderChat();
  } catch (_) {}
  return out;
};
function af73Rewards(th, st0) {
  th.afRew = th.afRew || {};
  (th.cast || []).forEach(cid => {
    const c = ch(cid); if (!c) return; const s = stageOf(th, cid), got = th.afRew[cid] || 0;
    if (s > got && s > (st0[cid] || 0)) {
      th.afRew[cid] = s; const g = AF_GEMS[s] || 0; if (g) { S.keys = (S.keys || 0) + g; }
      appendMsg(th, { who: "sys", k: "card", title: t73("rewardT", { s: first(c.n) + " · " + t("stage." + s) }), txt: t73("rewardS", { g, m: AF_MIND[s] }), at: Date.now() });
    }
  });
}
const _doSend73 = doSend;
doSend = function (txt, mode) {
  try {
    const th = S.threads[curT];
    if (th && String(txt || "").trim()) {
      delete th.vers;
      const cid = th.addr && ch(th.addr) ? th.addr : mainOf(th), c = ch(cid), d = day73();
      if (c && th.love && th.love[cid] != null && (th.afBonus || {})[cid] !== d && mode !== "dir") {
        th.afBonus = th.afBonus || {}; th.afBonus[cid] = d; loveWrite(th, cid, 2, "af:bonus"); save();
        setTimeout(() => toast(t73("daily", { n: first(c.n) })), 300);
      }
    }
  } catch (_) {}
  return _doSend73.apply(this, arguments);
};
const _usSheet73 = usSheet;
usSheet = function () { const r = _usSheet73.apply(this, arguments); try { const sh = document.querySelector(".sheet .sheet-card") || document.querySelector(".sheet"); if (sh && !sh.querySelector(".af73rules")) sh.insertAdjacentHTML("beforeend", '<p class="af73rules">💗 ' + esc(t73("rules")) + '</p>'); } catch (_) {} return r; };

/* ---------- 2 · regenerate (with versions), 3 · edit, 4 · address ---------- */
let ADDR73 = null, REDO73 = false;
const _reply73 = reply;
reply = async function (th, ctx, silent) {
  try {
    if (ctx && ctx.kind !== "redo" && !REDO73) { th._pre73 = { love: JSON.parse(JSON.stringify(th.love || {})), g: JSON.parse(JSON.stringify((th.afDay || {}).g || {})) }; th._ctx73 = Object.assign({}, ctx); }
    if (ctx && (ctx.kind === "user" || ctx.kind === "talk") && th.addr && ch(th.addr) && (th.cast || []).includes(th.addr)) { ctx = Object.assign({}, ctx, { cid: th.addr }); ADDR73 = th.addr; }
  } catch (_) {}
  try { return await _reply73.call(this, th, ctx, silent); } finally { ADDR73 = null; if (!silent && th && curT === th.id && !REDO73) setTimeout(() => { try { if (!busy) { renderChat(); scrollChat(); } } catch (_) {} }, 0); }
};
const _ask73 = ask;
ask = function (prompt, opts) {
  try {
    if (typeof prompt === "string" && prompt.indexOf("You write MIRU") === 0) {
      if (ADDR73 && ch(ADDR73)) prompt = prompt.replace("\nNOW:", "\nADDRESSED TO: " + ch(ADDR73).n + " — the user is speaking to him. He answers first; others react only if it's natural.\nNOW:");
      if (REDO73) prompt = prompt.replace("\nNOW:", "\nREGENERATE: the user asked for a different version of this reply. Take a clearly different angle — a different first line and a different move — while staying in character and answering the same input.\nNOW:");
    }
  } catch (_) {}
  return _ask73.apply(this, arguments);
};
async function rg73(th) {
  if (busy) return; const j = lastAIStart73(th); if (j < 0) return;
  const cur = th.msgs.slice(j);
  if (!th.vers || th.vers.at !== j) th.vers = { at: j, list: [cur], cur: 0 }; else th.vers.list[th.vers.cur] = cur;
  if (th.vers.list.length >= 5) { toast(t73("maxV")); return; }
  if (th._pre73) { th.love = JSON.parse(JSON.stringify(th._pre73.love)); if (th.afDay) th.afDay.g = JSON.parse(JSON.stringify(th._pre73.g)); }
  th.msgs = th.msgs.slice(0, j); save(); renderChat();
  const ctx = Object.assign({}, th._ctx73 || { kind: "user" });
  REDO73 = true;
  try { await reply(th, ctx); } finally { REDO73 = false; }
  const neu = th.msgs.slice(j);
  if (neu.length) { th.vers.list.push(neu); th.vers.cur = th.vers.list.length - 1; }
  else { th.msgs = th.msgs.slice(0, j).concat(cur); }
  save(); renderChat(); scrollChat();
}
function vswitch73(th, dir) {
  const V = th.vers; if (!V) return; const n = V.cur + dir; if (n < 0 || n >= V.list.length) return;
  V.list[V.cur] = th.msgs.slice(V.at); V.cur = n; th.msgs = th.msgs.slice(0, V.at).concat(V.list[n]); save(); renderChat(); scrollChat();
}
function edit73(th, idxs, isMe) {
  const rows = idxs.map(i => { const m = th.msgs[i]; const who = m.who === "me" ? (me() || "You") : m.who === "n" ? "—" : (ch(m.who) ? first(ch(m.who).n) : ""); return '<label class="ed73r"><span>' + esc(who) + (m.k === "act" ? " · *" : m.k === "think" ? " · 💭" : "") + '</span><textarea data-ed73i="' + i + '" rows="2">' + esc(m.txt || "") + '</textarea></label>'; }).join("");
  sheet('<div class="ed73s"><h2>✎ ' + esc(t73("editH")) + '</h2><p class="xs faint">' + esc(t73("editHint")) + '</p>' + rows +
    '<button class="btn btn-p btn-block" data-ed73save="' + (isMe ? "re" : "1") + '">' + esc(t73(isMe ? "saveRe" : "save")) + '</button></div>');
}
document.addEventListener("click", async e => {
  let x; const th = S.threads[curT]; if (!th) return;
  if ((x = e.target.closest("[data-rg73]"))) { e.stopImmediatePropagation(); rg73(th); return; }
  if ((x = e.target.closest("[data-vs73]"))) { e.stopImmediatePropagation(); vswitch73(th, +x.dataset.vs73); return; }
  if ((x = e.target.closest("[data-edg73]"))) { e.stopImmediatePropagation(); const j = lastAIStart73(th); if (j < 0) return; const idx = []; for (let k = j; k < th.msgs.length; k++) if (th.msgs[k].txt && th.msgs[k].who !== "sys") idx.push(k); edit73(th, idx, false); return; }
  if ((x = e.target.closest("[data-ed73]"))) { e.stopImmediatePropagation(); const i = +x.dataset.ed73, m = th.msgs[i]; if (!m) return; const isMe = m.who === "me" && th.msgs.slice(i + 1).every(y => y.ai); edit73(th, [i], isMe); return; }
  if ((x = e.target.closest("[data-ed73save]"))) {
    e.stopImmediatePropagation(); let lastMe = -1;
    $$("[data-ed73i]").forEach(ta => { const i = +ta.dataset.ed73i, m = th.msgs[i], v = ta.value.trim(); if (m && v && v !== m.txt) { m.txt = v; m.edited = 1; if (m.who === "me") lastMe = i; } });
    closeSheet(); save();
    if (x.dataset.ed73save === "re" && lastMe >= 0) { th.msgs = th.msgs.slice(0, lastMe + 1); delete th.vers; if (th._pre73) th.love = JSON.parse(JSON.stringify(th._pre73.love)); save(); renderChat(); const ctx = Object.assign({}, th._ctx73 || { kind: "user" }, { txt: th.msgs[lastMe].txt }); reply(th, ctx); return; }
    renderChat(); return;
  }
  if ((x = e.target.closest("[data-mind73]"))) { e.stopImmediatePropagation(); mind73(th, +x.dataset.mind73); return; }
  if ((x = e.target.closest("[data-addr73]"))) { e.stopImmediatePropagation(); th.addr = x.dataset.addr73 || null; save(); $$("[data-addr73]").forEach(b => b.classList.toggle("on", b === x)); return; }
}, true);

/* ---------- 2 · 心声 ---------- */
function mindLeft73(th, cid) { const d = day73(); S.mind73 = S.mind73 && S.mind73.d === d ? S.mind73 : { d, n: 0 }; let st = 0; try { st = Math.max(...(th.cast || [cid]).map(c => stageOf(th, c))); } catch (_) {} return Math.max(0, (AF_MIND[st] || 1) - S.mind73.n); }
const MIND_FB = {
  zh: ["他说得轻描淡写，其实这句话在心里排练了好几遍。", "别让他看出来——我比表现出来的更在意。", "他想问的不是这个，可话到嘴边又换了。", "要是你再靠近一步，他不确定自己还能装多久。"],
  en: ["He said it lightly. He'd rehearsed it more than once.", "Don't let it show — I care more than I'm letting on.", "That wasn't the question he wanted to ask. He swapped it at the last second.", "One more step closer and he isn't sure how long he can keep pretending."],
};
async function mind73(th, i) {
  const m = th.msgs[i]; if (!m || !ch(m.who) || m.who === "me") return;
  if (th.msgs[i + 1] && th.msgs[i + 1].mind) { toast("💭"); return; }
  const left = mindLeft73(th, m.who);
  if (left <= 0) { if (!spend(1, "mind")) { toast(t73("nogems")); return; } toast(t73("paid")); } else { S.mind73.n++; save(); toast(t73("free", { n: left - 1 })); }
  let txt = null;
  if (liveOn()) {
    try {
      const p = ["You write one private inner thought for a character in MIRU, an interactive romance story app for adults. All characters are fictional adults (21+).",
        "CHARACTER:\n" + castCard(th, m.who), "STORY SO FAR (latest lines):\n" + transcript(th).split("\n").slice(-14).join("\n"),
        "HIS LINE: \"" + m.txt + "\"",
        "Write what he is thinking but did NOT say at that moment — the feeling or motive under the line. First person, 1–2 sentences, under 45 words. Consistent with his profile, what he actually knows and the current relationship stage. No new plot facts; a secret he protects can only be hinted at.",
        "LANGUAGE: write only in " + LANG_NAME[S.lang] + ".", 'Reply with ONLY JSON {"thought":"..."}'].join("\n");
      const r = await ask(p, { modelTier: "quick" }); txt = r && r.thought;
    } catch (_) {}
  }
  if (!txt) { const pool = MIND_FB[S.lang === "zh" ? "zh" : "en"]; txt = pool[(th.msgs.length + i) % pool.length]; }
  th.msgs.splice(i + 1, 0, { who: m.who, k: "think", txt: String(txt).slice(0, 300), at: Date.now(), ai: 1, mind: 1 });
  save(); renderChat();
}

/* ---------- UI: tools on any message, bar under the latest reply, header chip, address chips ---------- */
const _msgHTML73 = msgHTML;
msgHTML = function (m, i, th) {
  let h = _msgHTML73.apply(this, arguments);
  try {
    if (typeof openTools !== "undefined" && openTools === i && h.indexOf('<div class="mtools">') >= 0 && m.txt && m.k !== "card") {
      let add = "";
      if (m.ai || m.who === "me") add += '<button data-ed73="' + i + '">✎ ' + esc(t73("edit")) + '</button>';
      if (ch(m.who) && m.k === "say" && m.who !== (th.pk && th.pk.as)) add += '<button data-mind73="' + i + '">💭 ' + esc(t73("mindShort")) + '</button>';
      h = h.replace('<div class="mtools">', '<div class="mtools">' + add);
    }
    if (m.edited) h += '<div class="ed73tag' + (m.who === "me" ? " me" : "") + '">✎ ' + esc(t73("edited")) + '</div>';
    if (m.mind) h = h.replace(/(class="m-think[^"]*")/, '$1 data-mind="1"');
  } catch (_) {}
  return h;
};
const _renderChat73 = renderChat;
renderChat = function () {
  const r = _renderChat73.apply(this, arguments);
  try {
    const th = S.threads[curT]; if (!th) return r;
    /* header chip */
    const cid = mainOf(th), c = ch(cid), hd = document.querySelector(".chead .grow[data-us]");
    if (c && th.love && th.love[cid] != null && hd && !hd.querySelector(".af73")) {
      const st = stageOf(th, cid), lv = Math.round(th.love[cid] || 0), nx = STAGE_MIN[st + 1];
      hd.insertAdjacentHTML("beforeend", '<span class="af73">💗 ' + esc(t("stage." + st)) + ' · ' + lv + (nx != null ? '/' + nx : '') + '<i style="width:' + (nx != null ? Math.min(100, (lv - STAGE_MIN[st]) / (nx - STAGE_MIN[st]) * 100) : 100) + '%"></i></span>');
    }
    /* bar under the latest AI reply */
    const j = lastAIStart73(th), box = $("#msgs");
    if (j >= 0 && box && !busy && !box.querySelector(".rg73")) {
      const lastSay = (() => { for (let k = th.msgs.length - 1; k >= j; k--) { const m = th.msgs[k]; if (ch(m.who) && m.k === "say" && m.who !== (th.pk && th.pk.as) && !(th.msgs[k + 1] && th.msgs[k + 1].mind)) return k; } return -1; })();
      const V = th.vers && th.vers.at === j ? th.vers : null;
      box.insertAdjacentHTML("beforeend", '<div class="rg73">' +
        (V && V.list.length > 1 ? '<span class="vs73"><button data-vs73="-1"' + (V.cur ? '' : ' disabled') + '>‹</button>' + (V.cur + 1) + '/' + V.list.length + '<button data-vs73="1"' + (V.cur < V.list.length - 1 ? '' : ' disabled') + '>›</button></span>' : '') +
        '<button data-rg73="1">↻ ' + esc(t73("regen")) + '</button><button data-edg73="1">✎ ' + esc(t73("edit")) + '</button>' +
        (lastSay >= 0 ? '<button data-mind73="' + lastSay + '">💭 ' + esc(t73("mind")) + '</button>' : '') + '</div>');
    }
    /* address chips in multi-character scenes */
    const sp = speakersOf(th).filter(id => ch(id)), comp = document.querySelector(".composer");
    if (comp && sp.length > 1 && !(th.pk && th.pk.as === "watch") && !comp.querySelector(".addr73")) {
      if (th.addr && !sp.includes(th.addr)) th.addr = null;
      comp.insertAdjacentHTML("afterbegin", '<div class="addr73"><span>' + esc(t73("addr")) + '</span><button class="' + (th.addr ? "" : "on") + '" data-addr73="">' + esc(t73("all")) + '</button>' + sp.map(id => '<button class="' + (th.addr === id ? "on" : "") + '" data-addr73="' + id + '">' + esc(first(ch(id).n)) + '</button>').join("") + '</div>');
    }
  } catch (_) {}
  return r;
};

(function () {
  const st = document.createElement("style");
  st.textContent = `
.af73{display:inline-flex;align-items:center;gap:4px;margin-top:3px;font-size:11px;font-weight:700;color:#F6B4C9;position:relative;padding-bottom:3px}
.af73 i{position:absolute;left:0;bottom:0;height:2px;border-radius:2px;background:var(--grad);max-width:100%}
.rg73{display:flex;width:max-content;max-width:calc(100% - 46px);align-items:stretch;margin:-2px 0 8px 38px;border:1px solid var(--line2);background:rgba(22,20,28,.72);border-radius:4px 4px 14px 14px;overflow:hidden}
.rg73>button,.rg73>.vs73{font-size:11.5px;font-weight:700;color:var(--dim);background:none;border:0;border-radius:0;padding:6px 11px;white-space:nowrap}
.rg73>*+*{border-left:1px solid var(--line2)!important}
.rg73>button:active{background:rgba(255,255,255,.06)}
.rg73 button[data-mind73]{color:#D7C6F5}
.vs73{display:inline-flex;align-items:center;gap:4px;font-size:11.5px;color:var(--dim);font-weight:700}.vs73 button{padding:0 4px!important;background:none;border:0;color:inherit}.vs73 button[disabled]{opacity:.35}
.ed73tag{font-size:10px;color:var(--faint);margin:-4px 0 2px 40px}.ed73tag.me{text-align:right;margin:-4px 6px 2px 0}
.ed73s{display:flex;flex-direction:column;gap:10px}.ed73s h2{margin:0}.ed73r{display:flex;flex-direction:column;gap:4px}.ed73r span{font-size:11px;color:var(--faint);font-weight:700}
.ed73r textarea{background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:10px 12px;font-size:14px;line-height:1.5;outline:none;resize:vertical;width:100%}
.addr73{display:flex;gap:6px;align-items:center;overflow-x:auto;margin-bottom:6px;scrollbar-width:none}.addr73::-webkit-scrollbar{display:none}
.addr73 span{font-size:11px;color:var(--faint);font-weight:700;flex:none}
.addr73 button{flex:none;font-size:12px;font-weight:700;padding:5px 11px;border-radius:999px;border:1px solid var(--line);color:var(--dim)}.addr73 button.on{color:var(--text);border-color:rgba(238,111,151,.6);background:rgba(238,111,151,.14)}
.m-think[data-mind]{border-left-color:#C9B8FF;background:rgba(156,132,224,.12)!important}
.af73rules{font-size:12px;line-height:1.6;color:var(--dim);margin-top:14px;padding:10px 12px;border-radius:12px;background:var(--panel2)}`;
  document.head.appendChild(st);
})();
