/* ================= v3.0 · 记忆系统 第一阶段 =================
   ② 滚动摘要：旧对话滑出窗口前先压缩进「到目前为止」，不再整段丢失。
   ③ 结构化记忆：每条记忆有 类型（事实/你说过/喜好/约定/边界/他的猜测/发生过的事）、谁知道、重要度、来源、时间。
      写入：所有旧的 th.mem 事件自动并入；用户消息里的喜好/边界/自述当场记下（规则）；每 6 轮用便宜模型在后台抽取一次（不阻塞回复）。
      召回：边界和约定永远带上；其余按 重要度 + 和当前话题的相关度 + 新近程度 排序，条数按会员档位（MEMT）。
      知识权限：只给「知道这件事」的角色看（规则 R42）；自述标为自述、猜测标为猜测（R45）。
   ⑦ 用户可控：「他记得的事」页面——查看、置顶、别再提（R48）、忘掉、手动告诉他、关闭自动记忆。 */
const M2T = {
  boundary: { ic: "🚧", zh: "边界", en: "Boundaries", p: "BOUNDARIES THE USER SET — always respect these" },
  promise: { ic: "🤝", zh: "约定", en: "Promises", p: "PROMISES / PLANS between you" },
  pref: { ic: "💛", zh: "喜好", en: "Likes & dislikes", p: "WHAT THE USER LIKES / DISLIKES (self-reported)" },
  self: { ic: "🗣", zh: "你说过", en: "Things you told him", p: "THINGS THE USER SAID ABOUT THEMSELVES (self-reported — may not be literally true; never treat as proven)" },
  fact: { ic: "📌", zh: "事实", en: "Facts", p: "ESTABLISHED FACTS IN THIS STORY" },
  event: { ic: "✨", zh: "发生过的事", en: "Moments", p: "THINGS THAT HAVE HAPPENED" },
  guess: { ic: "❔", zh: "他的猜测", en: "His guesses", p: "YOUR OWN GUESSES ABOUT THE USER (unconfirmed — do not state them as fact)" },
};
const M2 = { busy: {}, sumBusy: {} };
const m2id = () => "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const m2norm = s => String(s || "").toLowerCase().replace(/[\s，。！？、,.!?"“”'‘’：:；;（）()…—-]/g, "");
function m2same(a, b) { a = m2norm(a); b = m2norm(b); if (!a || !b) return false; if (a === b) return true; const s = a.length < b.length ? a : b, l = a.length < b.length ? b : a; return s.length >= 6 && l.includes(s); }
function m2add(th, o) {
  th.mem2 = th.mem2 || [];
  const t = String(o.t || "").trim().slice(0, 240); if (!t || t.length < 2) return null;
  const dup = th.mem2.find(x => !x.del && m2same(x.t, t));
  if (dup) { if ((o.imp || 0) > (dup.imp || 0)) dup.imp = o.imp; if (o.type && o.type !== "event" && dup.type === "event") dup.type = o.type; dup.at2 = Date.now(); return dup; }
  const x = { id: m2id(), t, type: M2T[o.type] ? o.type : "event", imp: Math.max(1, Math.min(3, o.imp || 2)), who: Array.isArray(o.who) && o.who.length ? o.who : (th.cast || []).slice(), src: o.src || "chat", at: Date.now() };
  th.mem2.push(x);
  if (th.mem2.length > 400) { const keep = th.mem2.filter(y => y.pin || y.type === "boundary" || y.type === "promise"); const rest = th.mem2.filter(y => !keep.includes(y)).sort((a, b) => (b.imp - a.imp) || (b.at - a.at)).slice(0, 400 - keep.length); th.mem2 = keep.concat(rest).sort((a, b) => a.at - b.at); }
  return x;
}
/* every older th.mem.push(...) in the app becomes a structured "event" memory automatically */
function m2(th) {
  if (!th) return [];
  th.mem2 = th.mem2 || []; const raw = th.mem || [];
  if (th._m2n == null) th._m2n = 0;
  if (th._m2n > raw.length) { th.mem2 = th.mem2.filter(x => x.src !== "story"); th._m2n = 0; } // story restarted
  for (; th._m2n < raw.length; th._m2n++) { const s = String(raw[th._m2n] || "").trim(); if (s) m2add(th, { t: s, type: "event", imp: 2, src: "story" }); }
  return th.mem2;
}
/* ---------- instant, rule-based capture from what the user types ---------- */
const M2_RULES = [
  [/(?:^|[，。！？\s])((?:你)?(?:别|不要|不许|不准|请不要)(?:再)?(?:叫我|提|说|碰|问|开)[^。！？!?\n]{1,24})/, "boundary", 3],
  [/\b((?:please )?(?:don't|do not|never|stop) (?:call me|mention|bring up|touch|ask (?:me )?about|talk about)[^.!?\n]{1,40})/i, "boundary", 3],
  [/(我(?:最)?(?:喜欢|爱吃|爱喝|爱听|讨厌|不喜欢|怕|害怕|受不了|过敏)[^。！？!?\n，,]{1,24})/, "pref", 2],
  [/\b(I(?:'m| am) (?:really |so |super |kind of )?(?:terrified|afraid|scared|allergic|obsessed|sick) (?:of|to|with)[^.!?\n,;]{1,40})/i, "pref", 2],
  [/\b(I (?:really |honestly )?(?:love|like|hate|adore|can't stand|cannot stand|fear|dread)(?!\s+(?:that|it|this|you|him|her|them)\b)[^.!?\n,;]{1,40})/i, "pref", 2],
  [/(我(?:叫|的名字是)[^。！？!?，,\s]{1,10}|我?今年\s*\d{1,2}\s*岁|我在[^。！？，,]{1,10}(?:工作|上班|上学|读书|住)|我是(?:一名|一个)[^。！？，,]{1,12}|我养了[^。！？，,]{1,10})/, "self", 2],
  [/\b((?:my name(?:'s| is)|(?<!(?:n't|not|never|stop) )call me|I'm \d{2}\b|I am \d{2}\b|I work (?:as|at|in|for)|I study|I live in|I grew up in|I have an? (?:dog|cat|sister|brother|little sister|little brother|kid|daughter|son))[^.!?\n,;]{0,40})/i, "self", 2],
  [/(?:^|[.!?]\s*|,\s*)(I'm ([A-Z][a-z]{1,15}))(?=[,.!?]|\s+by the way|\s*$)/, "self", 2],
  [/((?:我们|咱们)?(?:说好了|约好了|答应你|你答应我|下次|改天)[^。！？!?\n]{2,24})/, "promise", 2],
  [/\b((?:promise me|I promise|let's|next time we)[^.!?\n]{2,40})/i, "promise", 2],
];
function m2quick(th, txt) {
  if (S.m2off || !txt) return 0; let n = 0; const zh = S.lang === "zh";
  for (const [re, type, imp] of M2_RULES) { const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g"); for (const m of String(txt).matchAll(g)) { if (!m[1]) continue; const body = m[1].trim(); const t = (zh ? "你说：" : "You said: ") + "“" + body + "”"; if (m2add(th, { t, type, imp, src: "you", who: (th.cast || []).slice() })) n++; } }
  return n;
}
/* ---------- quiet model calls (never toast, never block a reply) ---------- */
async function m2ask(prompt) {
  if (!(typeof liveOn === "function" && liveOn()) || typeof SAMPLE === "undefined" || !SAMPLE) return null;
  try { let r; try { r = await SAMPLE.json(prompt, { modelTier: "quick", cache: false }); } catch (e0) { r = typeof jsonLoose === "function" ? jsonLoose(e0 && e0.text) : null; } return r; } catch (_) { return null; }
}
const m2line = m => { const w = m.who === "me" ? (typeof me === "function" ? me() : "User") : m.who === "n" || m.who === "sys" ? "" : ((typeof ch === "function" && ch(m.who)) ? first(ch(m.who).n) : m.who); const t = String(m.txt || m.title || "").replace(/\s+/g, " ").slice(0, 300); return t ? (w ? w + ": " : "") + t : ""; };
async function m2extract(th) {
  if (S.m2off || M2.busy[th.id]) return; M2.busy[th.id] = 1;
  try {
    const recent = th.msgs.slice(-14).map(m2line).filter(Boolean).join("\n"); if (!recent) return;
    const have = m2(th).filter(x => !x.del).slice(-30).map(x => "- " + x.t).join("\n");
    const names = (th.cast || []).map(id => (ch(id) ? first(ch(id).n) : id));
    const r = await m2ask(["You maintain the long-term memory of characters in an interactive romance story. Extract at most 5 NEW things worth remembering from the recent conversation (skip small talk and anything already remembered).",
      "Types: fact (something that happened, or something a CHARACTER said about himself), self (the USER said it about themselves — self-reported), pref (the USER's like/dislike), promise (a promise or plan between the user and a character), boundary (ONLY something the USER asked a character not to do or mention — never a character's own limits), guess (a character's unconfirmed inference about the user). Never store the same thing twice in different words.",
      "Write each memory as one short sentence in " + (S.lang === "zh" ? "Chinese" : "English") + ", concrete (names, objects, places). Importance 1–3 (3 = will matter later).",
      "known_by: which characters actually witnessed or were told it (choose from: " + names.join(", ") + ").",
      "ALREADY REMEMBERED:\n" + (have || "(nothing)"), "RECENT CONVERSATION:\n" + recent,
      'Reply JSON only: {"memories":[{"t":"…","type":"self","imp":2,"known_by":["' + (names[0] || "") + '"]}]}'].join("\n\n"));
    const list = r && Array.isArray(r.memories) ? r.memories.slice(0, 5) : [];
    let n = 0;
    for (const o of list) {
      const who = (o.known_by || []).map(nm => (th.cast || []).find(id => ch(id) && (first(ch(id).n).toLowerCase() === String(nm).toLowerCase() || ch(id).n.toLowerCase() === String(nm).toLowerCase()))).filter(Boolean);
      if (m2add(th, { t: o.t, type: o.type, imp: o.imp, who: who.length ? who : null, src: "ai" })) n++;
    }
    if (n) save();
  } finally { M2.busy[th.id] = 0; }
}
/* ② rolling summary: what slides out of the window gets folded into "the story so far" */
async function m2summary(th) {
  if (M2.sumBusy[th.id]) return; const T = MEMT[memTier(th)], upto = (th.sum && th.sum.upto) || 0, cut = th.msgs.length - T.msgs;
  if (cut - upto < 16) return; M2.sumBusy[th.id] = 1;
  try {
    const chunk = th.msgs.slice(upto, cut).map(m2line).filter(Boolean).join("\n").slice(-9000); if (!chunk) { th.sum = { t: (th.sum && th.sum.t) || "", upto: cut }; return; }
    const lim = { free: 350, plus: 900, deep: 1600 }[memTier(th)] || 350;
    const r = await m2ask(["Update the running summary of an interactive romance story so the characters never lose the thread. Keep: who said/did what that matters, promises, secrets revealed, how the relationship changed, open conflicts. Drop small talk. Past tense, " + (S.lang === "zh" ? "Chinese" : "English") + ", at most " + lim + " characters.",
      "SUMMARY SO FAR:\n" + ((th.sum && th.sum.t) || "(none)"), "NEW PART TO FOLD IN:\n" + chunk, 'Reply JSON only: {"summary":"…"}'].join("\n\n"));
    if (r && r.summary) { th.sum = { t: String(r.summary).slice(0, lim + 200), upto: cut, at: Date.now() }; save(); }
  } finally { M2.sumBusy[th.id] = 0; }
}
/* ---------- recall: what goes into the prompt ---------- */
function m2pick(th, n) {
  const all = m2(th).filter(x => !x.del && !x.hush);
  const cast = th.cast || [];
  const vis = all.filter(x => !x.who || !x.who.length || x.who.some(id => cast.includes(id))); // knowledge permission (R42)
  const lastU = [...th.msgs].reverse().find(m => m.who === "me" && m.txt); const q = m2norm(lastU && lastU.txt);
  const grams = new Set(); for (let i = 0; i < q.length - 1; i++) grams.add(q.slice(i, i + 2));
  const rel = t => { const s = m2norm(t); let h = 0; for (let i = 0; i < s.length - 1; i++) if (grams.has(s.slice(i, i + 2))) h++; return Math.min(1, h / 6); };
  const L = vis.length || 1;
  const must = vis.filter(x => x.type === "boundary" || x.type === "promise" || x.pin).slice(-12);
  const R = th._m2rec && th._m2rec.q === (lastU && lastU.txt) ? th._m2rec : null, rs = id => { if (!R) return 0; const k = R.ids.indexOf(id); return k < 0 ? 0 : 5 - k * 0.3; };
  const rest = vis.filter(x => !must.includes(x)).map((x, i) => ({ x, s: x.imp * 1.2 + (R ? rs(x.id) : rel(x.t) * 3) + (i / L) * 1.5 })).sort((a, b) => b.s - a.s).slice(0, Math.max(0, n - must.length)).map(o => o.x);
  return must.concat(rest);
}
memBlock = function (th) {
  const tier = memTier(th), T = MEMT[tier]; const pick = m2pick(th, T.mem + 3);
  const out = [];
  if (th.sum && th.sum.t) out.push("THE STORY SO FAR (earlier conversation, summarized — refer back to it naturally):\n" + th.sum.t);
  for (const k of Object.keys(M2T)) { const g = pick.filter(x => x.type === k); if (g.length) out.push(M2T[k].p + ":\n" + g.map(x => "- " + x.t).join("\n")); }
  const R = th._m2rec; if (R && R.cross && R.cross.length) out.push("YOU ALSO REMEMBER (from your other stories with the user — relevant right now):\n" + R.cross.map(x => "- " + x).join("\n"));
  const hush = m2(th).filter(x => x.hush && !x.del).slice(-8);
  if (hush.length) out.push("THE USER ASKED YOU NOT TO BRING THESE UP AGAIN (only respond if the user raises it first):\n" + hush.map(x => "- " + x.t).join("\n"));
  if (tier !== "free") { // long memory: the same characters remember other stories too
    const other = Object.values(S.threads).filter(o => o !== th && (o.cast || []).some(c => (th.cast || []).includes(c))).flatMap(o => (o.mem2 || []).filter(x => !x.del && !x.hush && x.imp >= 2 && x.type !== "event").slice(-(tier === "deep" ? 10 : 4)).map(x => "(from " + o.title + ") " + x.t)).slice(-(tier === "deep" ? 24 : 8));
    if (other.length) out.push("FROM YOUR OTHER STORIES WITH THE USER:\n" + other.map(x => "- " + x).join("\n"));
  }
  return out.join("\n\n");
};
/* hooks: capture on every user line; every 6 replies extract + summarize in the background */
appendMsg = (function (orig) { return function (th, m) {
  const r = orig.apply(this, arguments);
  try {
    if (th && m) {
      m2(th);
      if (m.who === "me" && m.k === "say" && m.txt) { if (m2quick(th, m.txt)) save(); }
      else if (m.who !== "me" && m.who !== "sys" && m.who !== "n" && m.k === "say") {
        th._m2c = (th._m2c || 0) + 1;
        if (th._m2c >= 6) { th._m2c = 0; const t0 = th; setTimeout(() => { m2extract(t0); m2summary(t0); }, 1800); }
      }
    }
  } catch (_) {}
  return r;
}; })(appendMsg);
/* ---------- ⑦ 「他记得的事」 ---------- */
function m2Sheet(filter) {
  const th = S.threads[curT]; if (!th) return; const zh = S.lang === "zh", L2 = (a, b) => zh ? a : b;
  const all = m2(th).filter(x => !x.del), c = ch(mainOf(th)), nm = c ? first(c.n) : th.title;
  const f = filter || "all";
  const shown = (f === "all" ? all : f === "hush" ? all.filter(x => x.hush) : all.filter(x => x.type === f)).slice().reverse();
  const cnt = k => all.filter(x => x.type === k).length;
  const ago = t => { const d = (Date.now() - t) / 864e5; return d < 1 ? L2("今天", "today") : d < 2 ? L2("昨天", "yesterday") : Math.floor(d) + L2(" 天前", "d ago"); };
  const srcL = { you: L2("你说的", "you said it"), ai: L2("他记下的", "he noted it"), story: L2("剧情", "story"), manual: L2("你告诉他的", "you told him"), chat: L2("聊天", "chat") };
  sheet('<div class="m2s"><div class="row" style="gap:10px">' + avatar(mainOf(th), 40) + '<div class="grow"><div class="eyebrow" style="color:var(--gold)">' + L2("记忆", "MEMORY") + '</div><b style="font-size:17px">' + esc(L2(nm + " 记得的事", "What " + nm + " remembers")) + '</b></div><span class="xs faint">' + all.length + L2(" 条", "") + '</span></div>' +
    (th.sum && th.sum.t ? '<div class="m2sum"><b>📖 ' + L2("到目前为止", "The story so far") + '</b><p>' + esc(th.sum.t) + '</p></div>' : '') +
    '<div class="m2tabs"><button class="' + (f === "all" ? "on" : "") + '" data-m2f="all">' + L2("全部", "All") + '</button>' + Object.keys(M2T).filter(k => cnt(k)).map(k => '<button class="' + (f === k ? "on" : "") + '" data-m2f="' + k + '">' + M2T[k].ic + ' ' + (zh ? M2T[k].zh : M2T[k].en) + ' ' + cnt(k) + '</button>').join("") + (all.some(x => x.hush) ? '<button class="' + (f === "hush" ? "on" : "") + '" data-m2f="hush">🤐 ' + L2("别再提", "Muted") + '</button>' : '') + '</div>' +
    '<div class="m2list">' + (shown.length ? shown.slice(0, 120).map(x => '<div class="m2i' + (x.hush ? " hush" : "") + '"><div class="m2t"><span>' + M2T[x.type].ic + '</span><p>' + esc(x.t) + '<small>' + (zh ? M2T[x.type].zh : M2T[x.type].en) + ' · ' + (srcL[x.src] || "") + ' · ' + ago(x.at) + (x.pin ? ' · 📌' : '') + (x.imp >= 3 ? ' · ★' : '') + '</small></p></div><div class="m2b"><button data-m2pin="' + x.id + '">' + (x.pin ? L2("取消置顶", "Unpin") : L2("置顶", "Pin")) + '</button><button data-m2hush="' + x.id + '">' + (x.hush ? L2("可以提了", "Unmute") : L2("别再提", "Don't bring up")) + '</button><button data-m2del="' + x.id + '" class="del">' + L2("忘掉", "Forget") + '</button></div></div>').join("") : '<p class="xs faint" style="padding:14px 0;text-align:center">' + L2("还没有。多聊几句，他会记住你说过的事。", "Nothing yet. Talk a little — he'll remember what you tell him.") + '</p>') + '</div>' +
    '<div class="m2add"><select id="m2type"><option value="self">🗣 ' + L2("关于我", "About me") + '</option><option value="pref">💛 ' + L2("我喜欢 / 不喜欢", "I like / dislike") + '</option><option value="boundary">🚧 ' + L2("请别…", "Please don't…") + '</option><option value="promise">🤝 ' + L2("我们的约定", "Our plan") + '</option></select><input id="m2txt" maxlength="120" placeholder="' + esc(L2("告诉他一件要记住的事…", "Tell him something to remember…")) + '"><button class="btn btn-p" data-m2addgo="1">' + L2("记住", "Save") + '</button></div>' +
    '<label class="m2off"><input type="checkbox" data-m2off="1"' + (S.m2off ? "" : " checked") + '> ' + L2("让角色自动记住我在聊天里说的事", "Let characters remember what I say in chat") + '</label>' +
    '<button class="lnk" data-memsheet="1" style="display:block;margin:6px auto 0">🧠 ' + L2("记忆空间与档位", "Memory space & tiers") + '</button></div>');
}
document.addEventListener("click", e => {
  let x; const th = S.threads[curT]; if (!th) return;
  if (x = e.target.closest("[data-m2open]")) { e.stopImmediatePropagation(); m2Sheet(); return; }
  if (x = e.target.closest("[data-m2f]")) { m2Sheet(x.dataset.m2f); return; }
  const cur = () => { const on = document.querySelector(".m2tabs .on"); return on ? on.dataset.m2f : "all"; };
  const find = id => (th.mem2 || []).find(y => y.id === id);
  if (x = e.target.closest("[data-m2pin]")) { const m = find(x.dataset.m2pin); if (m) { m.pin = !m.pin; save(); m2Sheet(cur()); } return; }
  if (x = e.target.closest("[data-m2hush]")) { const m = find(x.dataset.m2hush); if (m) { m.hush = !m.hush; save(); toast(m.hush ? LL("好，他不会再主动提这件事", "Got it — he won't bring this up") : LL("已恢复", "Unmuted")); m2Sheet(cur()); } return; }
  if (x = e.target.closest("[data-m2del]")) { const m = find(x.dataset.m2del); if (m) { th.mem2 = th.mem2.filter(y => y !== m); (th._m2gone = th._m2gone || []).push(m.id); const raw = th.mem || []; const i = raw.findIndex(s => m2same(s, m.t)); if (i >= 0) { raw.splice(i, 1); if (th._m2n > i) th._m2n--; } save(); toast(LL("已忘掉，不会再出现在他的记忆里", "Forgotten — it's gone from his memory")); m2Sheet(cur()); } return; }
  if (x = e.target.closest("[data-m2addgo]")) { const v = ($("#m2txt") || {}).value, ty = ($("#m2type") || {}).value || "self"; if (!v || !v.trim()) return; m2add(th, { t: (S.lang === "zh" ? "你说：" : "You said: ") + "“" + v.trim() + "”", type: ty, imp: 3, src: "manual" }); save(); toast(LL("他记住了", "He'll remember")); m2Sheet(); return; }
}, true);
document.addEventListener("change", e => { const x = e.target.closest && e.target.closest("[data-m2off]"); if (!x) return; S.m2off = !x.checked; save(); toast(S.m2off ? LL("已关闭自动记忆（已记下的仍保留，可以手动删）", "Auto-memory off (saved ones stay; you can delete them)") : LL("已开启自动记忆", "Auto-memory on")); });
/* entry points: memory-space sheet gets a "what he remembers" button; menu gets a row */
memSheet = (function (orig) { return function () { orig.apply(this, arguments); try { const th = S.threads[curT]; if (!th) return; const n = m2(th).filter(x => !x.del).length; const s = document.querySelector(".sheet .memlay"); if (s && !document.querySelector("[data-m2open]")) s.insertAdjacentHTML("afterend", '<button class="btn btn-g btn-block" style="margin-top:10px" data-m2open="1">📖 ' + LL("他记得的事 · " + n + " 条（可查看、删除）", "What he remembers · " + n + " (view & delete)") + '</button>'); } catch (_) {} }; })(memSheet);
menuSheet = (function (orig) { return function () { orig.apply(this, arguments); try { const s = document.querySelector(".sheet .stack"); if (s && !s.querySelector("[data-m2open]")) s.insertAdjacentHTML("afterbegin", '<button class="opt" data-m2open="1"><span class="ic">📖</span><span class="grow"><b>' + LL("他记得的事", "What he remembers") + '</b><span>' + LL("查看、置顶、别再提、忘掉", "View, pin, mute or forget") + '</span></span></button>'); } catch (_) {} }; })(menuSheet);
(function () { const st = document.createElement("style"); st.textContent = `
.m2s{display:flex;flex-direction:column;gap:10px}
.m2sum{background:rgba(240,183,126,.08);border:1px solid rgba(240,183,126,.3);border-radius:14px;padding:10px 12px}.m2sum b{font-size:12.5px;color:var(--gold)}.m2sum p{margin:4px 0 0;font-size:13px;line-height:1.55;color:var(--text)}
.m2tabs{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}.m2tabs button{flex:none;font-size:12px;font-weight:700;padding:5px 10px;border-radius:999px;border:1px solid var(--line2);color:var(--dim);background:none}.m2tabs .on{background:var(--grad);color:#1B1017;border-color:transparent}
.m2list{display:flex;flex-direction:column;gap:8px;max-height:46vh;overflow:auto}
.m2i{border:1px solid var(--line);border-radius:12px;padding:9px 10px;background:var(--panel2)}.m2i.hush{opacity:.55}
.m2t{display:flex;gap:8px}.m2t span{flex:none}.m2t p{margin:0;font-size:13.5px;line-height:1.45}.m2t small{display:block;font-size:10.5px;color:var(--faint);margin-top:3px}
.m2b{display:flex;gap:6px;margin-top:7px;justify-content:flex-end}.m2b button{font-size:11px;font-weight:700;color:var(--dim);border:1px solid var(--line2);background:none;border-radius:999px;padding:3px 9px}.m2b .del{color:#F28B9B;border-color:rgba(242,139,155,.4)}
.m2add{display:flex;gap:6px}.m2add select{flex:none;max-width:118px;background:var(--panel2);border:1px solid var(--line);border-radius:10px;color:var(--text);font-size:12px;padding:0 6px}.m2add input{flex:1;min-width:0;background:var(--panel2);border:1px solid var(--line);border-radius:10px;padding:9px 10px;color:var(--text);font-size:13px}.m2add .btn{flex:none;padding:0 14px}
.m2off{font-size:12px;color:var(--dim);display:flex;gap:6px;align-items:center}`; document.head.appendChild(st); })();
