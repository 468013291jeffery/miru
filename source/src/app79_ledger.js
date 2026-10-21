/* ================= v3.2 · 记忆系统 第三阶段：剧情账本（程序裁决，模型只读） =================
   一个故事的「正史」统一放在 th.led，由程序维护：
   · 约定 P#：来自「约定」类记忆（你说的 / 他记下的）。状态 open → kept / broken。
       改状态：你在账本里点；或模型在回复里「提议」，程序按规则校验后才提交（只允许 open→kept/broken、每轮最多 1 条、id 必须存在）。
   · 未修复冲突 C#：程序根据关系变化自动开启（信任一次掉很多、旧恨上涨、导演事件「揭开秘密/制造冲突」），
       信任回升到开启前 +8 且旧恨回落时自动和解。模型不能宣布和解（R34：真相不自动带来原谅）。
   · 秘密 S#：每个角色资料里的秘密。关系到第 3 阶段或剧情旗标解锁后才算揭开；未揭开的只告诉对应角色「不能直说，只能暗示」。
   · 正史：已做的章节选择、旗标、持有道具、各对关系阶段（不给数字）。
   全部写进提示词的「STORY LEDGER」段落，并要求模型不得与之矛盾；「剧情账本」页面让玩家随时看到。 */
const LED = { lastChange: null };
const LED_STOP = new Set("you your me my i we our us the a an to of and for in on at with will would be is are was it that this he she they his her their said promise promised promises next".split(" "));
function ledWords(t) { const s = String(t || "").toLowerCase(); const en = s.match(/[a-z']{3,}/g) || []; const zh = (s.match(/[\u4e00-\u9fff]/g) || []).join(""); const w = new Set(en.filter(x => !LED_STOP.has(x))); for (let i = 0; i < zh.length - 1; i++) w.add(zh.slice(i, i + 2)); return w; }
function ledSame(a, b) { const A = ledWords(a), B = ledWords(b); if (!A.size || !B.size) return false; let n = 0; A.forEach(x => { if (B.has(x)) n++; }); return n / Math.min(A.size, B.size) >= 0.5; }
function led(th) {
  if (!th) return null;
  th.led = th.led || { p: [], c: [], n: { p: 0, c: 0 } };
  // promises come from structured memories (type promise)
  try { (typeof m2 === "function" ? m2(th) : []).filter(x => x.type === "promise" && !x.del).forEach(x => { if (!th.led.p.some(p => p.mem === x.id || (p.st === "open" && ledSame(p.t, x.t)))) th.led.p.push({ id: "P" + (++th.led.n.p), t: x.t, mem: x.id, st: "open", at: x.at || Date.now(), by: x.src }); }); } catch (_) {}
  return th.led;
}
function ledSecrets(th) {
  const F = (th.pk && th.pk.flags) || {};
  return (th.cast || []).filter(id => ch(id) && Lz(ch(id).secret)).map((id, i) => {
    const open = stageOf(th, id) >= 3 || F["secret_" + id] || F["reveal_" + id] || (th.led && th.led.rev && th.led.rev[id]);
    return { id: "S" + (i + 1), cid: id, t: Lz(ch(id).secret), open: !!open };
  });
}
/* conflicts: opened/closed by the program from relationship changes */
function ledConflictCheck(th, key, delta, why) {
  const L = led(th); if (!L || !th.rdv || !th.rdv[key]) return;
  const r = th.rdv[key], dt = (delta.tru || 0), dg = (delta.gru || 0);
  const open = L.c.find(c => c.k === key && c.st === "open");
  if (!open && (dt <= -4 || dg >= 4 || /secret|fight|揭开秘密|制造冲突/i.test(why || ""))) {
    L.c.push({ id: "C" + (++L.n.c), k: key, why: String(why || "").slice(0, 120) || LL("关系出现裂痕", "Something broke between them"), st: "open", at: Date.now(), base: { tru: Math.max(0, r.tru - dt), gru: Math.max(0, r.gru - dg) } });
    LED.lastChange = Date.now();
  } else if (open) {
    if (dt < 0 || dg > 0) { if (why && !open.why.includes(why)) open.why = (open.why + " · " + why).slice(0, 200); }
    if (r.tru >= Math.min(100, open.base.tru + 8) && r.gru <= open.base.gru + 2) { open.st = "resolved"; open.end = Date.now(); LED.lastChange = Date.now(); }
  }
}
if (typeof dimAdd === "function") {
  dimAdd = (function (orig) { return function (th, k, d, why) {
    const key = typeof dimFind === "function" ? dimFind(th, k) : null; const before = key && th.rdv && th.rdv[key] ? Object.assign({}, th.rdv[key]) : null;
    const r = orig.apply(this, arguments);
    try { if (key && before) { const now = th.rdv[key], delta = {}; ["tru", "gru"].forEach(x => { if (now[x] !== before[x]) delta[x] = now[x] - before[x]; }); if (Object.keys(delta).length) ledConflictCheck(th, key, delta, why); } } catch (_) {}
    return r;
  }; })(dimAdd);
}
/* the ledger block the model reads (canon, read-only) */
function ledBlock(th) {
  const L = led(th); if (!L) return "";
  const out = [], name = id => id === "me" ? "the user" : (ch(id) ? first(ch(id).n) : id);
  try {
    if (th.pk && th.pk.picks) { const w = wd(th.wid), P = w && w.pack; const picks = Object.entries(th.pk.picks).map(([n, k]) => { const c = P && P.chapters[n - 1]; const o = c && c.choices.find(x => x.k === k); return o ? "Ch" + n + ": " + (Lz(o.t) || k) : ""; }).filter(Boolean); if (picks.length) out.push("CHOICES ALREADY MADE (canon): " + picks.join(" | ")); }
    const F = Object.keys((th.pk && th.pk.flags) || {}); if (F.length) out.push("STORY FLAGS (true): " + F.slice(-20).join(", "));
    if (th.pk && th.pk.items) { const I = Object.entries(th.pk.items).filter(([, v]) => v).map(([id]) => typeof itemName === "function" ? itemName(th, id) : id); if (I.length) out.push("ITEMS THE USER HOLDS: " + I.join(", ")); }
    if (th.rdv) { const st = Object.entries(th.rdv).map(([k, r]) => { const [a, b] = k.split("|"); return name(a) + " & " + name(b) + ": " + (typeof dimStage === "function" ? dimStage(r) : ""); }); if (st.length) out.push("RELATIONSHIP STAGES (behave consistently; never mention numbers): " + st.join(" · ")); }
  } catch (_) {}
  const op = L.p.filter(p => p.st === "open").slice(-8), done = L.p.filter(p => p.st !== "open").slice(-4);
  if (op.length) out.push("OPEN PROMISES (unfulfilled — remember them; you may keep or break one only through what happens in the scene):\n" + op.map(p => "- " + p.id + ": " + p.t).join("\n"));
  if (done.length) out.push("SETTLED PROMISES: " + done.map(p => p.id + " " + (p.st === "kept" ? "kept" : "broken") + " — " + p.t).join(" | "));
  const oc = L.c.filter(c => c.st === "open");
  if (oc.length) out.push("UNRESOLVED CONFLICTS (still hurting — do NOT act as if they're forgiven; repair needs real actions over time, an apology alone is not enough):\n" + oc.map(c => { const [a, b] = c.k.split("|"); return "- " + c.id + ": " + name(a) + " & " + name(b) + " — " + c.why; }).join("\n"));
  const S2 = ledSecrets(th); const sealed = S2.filter(s => !s.open), shown = S2.filter(s => s.open);
  if (sealed.length) out.push("SECRETS NOT YET REVEALED (only the owner knows; the owner may hint through behavior but must NOT say it outright; nobody else may mention it):\n" + sealed.map(s => "- " + name(s.cid) + "'s secret: " + s.t).join("\n"));
  if (shown.length) out.push("SECRETS THE USER ALREADY KNOWS: " + shown.map(s => name(s.cid) + " — " + s.t).join(" | "));
  if (!out.length) return "";
  return "STORY LEDGER (kept by the app — this is canon. You cannot change it and must never contradict it):\n" + out.join("\n");
}
memBlock = (function (orig) { return function (th) { const a = orig.apply(this, arguments); let b = ""; try { b = ledBlock(th); } catch (_) {} return [b, a].filter(Boolean).join("\n\n"); }; })(memBlock);
/* model proposals → program validation → commit */
/* second, independent check before anything is committed: did it actually happen in this reply (not just get planned)? */
async function ledVerify(th, props, userTxt, replyTxt) {
  try {
    const L = led(th); if (!th || !L) return;
    let pr = props.filter(Boolean)[0]; if (typeof pr === "string") { const m = pr.match(/^\s*(keep|break)\s*[:：]\s*(P\d+)/i); if (!m) return; pr = { op: m[1].toLowerCase(), id: m[2].toUpperCase() }; }
    const p = L.p.find(x => x.id === String(pr && pr.id)); if (!p || p.st !== "open") return;
    if (typeof SAMPLE === "undefined" || !SAMPLE || !SAMPLE.json) return;
    let v = null; try { v = await SAMPLE.json(["You audit a story's ledger. Decide strictly from the text below.",
      "PROMISE: " + p.t, "PROPOSED: the promise was " + (pr.op === "keep" ? "FULFILLED" : "BROKEN") + " in this scene.",
      "USER'S LAST MESSAGE: " + userTxt.slice(0, 800), "THE SCENE THAT WAS JUST WRITTEN:\n" + replyTxt,
      "Answer yes only if the scene itself clearly shows it already happened (being there / doing it / refusing it) — not if it is still being planned, discussed or asked about.",
      'Reply JSON only: {"yes":true|false,"why":"short reason"}'].join("\n\n"), { modelTier: "quick", cache: false }); } catch (_) { v = null; }
    if (!v || v.yes !== true) { (L.rej = L.rej || []).push({ id: p.id, op: pr.op, why: v && v.why || "unverified", at: Date.now() }); L.rej = L.rej.slice(-20); save(); return; }
    const ok = ledApply(th, [pr]);
    if (ok) { appendMsg(th, { who: "sys", k: "card", title: (ok.op === "kept" ? "🤝 " + LL("约定兑现", "Promise kept") : "💔 " + LL("约定落空", "Promise broken")), txt: ok.p.t, at: Date.now() }); save(); if (curT === th.id) renderChat(); }
  } catch (_) {}
}
function ledApply(th, props) {
  const L = led(th); if (!L || !Array.isArray(props)) return null;
  for (let pr of props.filter(Boolean).slice(0, 2)) {
    if (typeof pr === "string") { const m = pr.match(/^\s*(keep|break)\s*[:：]\s*(P\d+)/i); if (!m) continue; pr = { op: m[1].toLowerCase(), id: m[2].toUpperCase() }; }
    const p = L.p.find(x => x.id === String(pr && pr.id)); if (!p || p.st !== "open") continue;
    const op = pr.op === "keep" ? "kept" : pr.op === "break" ? "broken" : null; if (!op) continue;
    p.st = op; p.end = Date.now(); p.byAI = 1; LED.lastChange = Date.now(); save();
    return { p, op };
  }
  return null;
}
ask = (function (orig) { return async function (prompt, opts) {
  try { const th0 = S.threads[curT]; if (typeof prompt === "string" && prompt.indexOf("You write MIRU") === 0 && th0) { const op = led(th0).p.filter(p => p.st === "open"); if (op.length) prompt = prompt + "\n\nLEDGER CHECK (required): open promises are " + op.map(p => p.id + " = " + p.t).join("; ") + ". If what happens in THIS reply clearly fulfils or clearly breaks one of them, add \"ledger\":[{\"op\":\"keep\" or \"break\",\"id\":\"P#\"}] to your JSON (at most one). If not, leave it out."; prompt = prompt.replace('"goals":[<indexes of quest goals completed in this reply>]}', '"goals":[<indexes of quest goals completed in this reply>],"ledger":[<"keep:P#" or "break:P#" when THIS reply clearly fulfils or breaks an open promise; otherwise leave the list empty>]}'); arguments[0] = prompt; } } catch (_) {}
  const r = await orig.apply(this, arguments);
  try { // R14: ordinary warmth can't paper over an open conflict — the app caps affinity gains while it's unresolved
    const th1 = S.threads[curT]; if (typeof prompt === "string" && prompt.indexOf("You write MIRU") === 0 && th1 && r && r.love) { const oc = led(th1).c.filter(c => c.st === "open"); for (const cid in r.love) { if (oc.some(c => c.k.split("|").includes(cid)) && +r.love[cid] > 1) r.love[cid] = 1; } }
  } catch (_) {}
  try {
    if (typeof prompt === "string" && prompt.indexOf("You write MIRU") === 0 && r && Array.isArray(r.ledger) && r.ledger.length) {
      const th = S.threads[curT], props = r.ledger.slice(), beats = (r.beats || []).map(b => (b.who === "n" ? "" : (ch(b.who) ? first(ch(b.who).n) + ": " : "")) + (b.text || "")).join("\n").slice(0, 2500);
      const lastU = th && [...th.msgs].reverse().find(m => m.who === "me" && m.txt);
      setTimeout(() => ledVerify(th, props, (lastU && lastU.txt) || "", beats), 300);
      delete r.ledger;
    }
  } catch (_) {}
  return r;
}; })(ask);
/* ---------- 「剧情账本」页面 ---------- */
function ledSheet(tab) {
  const th = S.threads[curT]; if (!th) return; const L = led(th), zh = S.lang === "zh", L2 = (a, b) => zh ? a : b; tab = tab || "p";
  const name = id => id === "me" ? L2("你", "You") : (ch(id) ? first(ch(id).n) : id);
  const S2 = ledSecrets(th);
  const tabs = [["p", "🤝 " + L2("约定", "Promises"), L.p.filter(p => p.st === "open").length], ["c", "⚡ " + L2("未解决", "Conflicts"), L.c.filter(c => c.st === "open").length], ["s", "🔐 " + L2("秘密", "Secrets"), S2.filter(s => s.open).length + "/" + S2.length], ["k", "📜 " + L2("正史", "Canon"), ""]];
  let body = "";
  if (tab === "p") body = L.p.length ? L.p.slice().reverse().map(p => '<div class="ldi ' + p.st + '"><p>' + esc(p.t) + '<small>' + p.id + ' · ' + ({ open: L2("进行中", "open"), kept: L2("已兑现", "kept"), broken: L2("落空了", "broken") }[p.st]) + (p.byAI ? L2(" · 剧情里发生", " · happened in the story") : "") + '</small></p>' + (p.st === "open" ? '<div class="ldb"><button data-ldp="' + p.id + '|kept">' + L2("兑现了", "Kept") + '</button><button data-ldp="' + p.id + '|broken">' + L2("落空了", "Broken") + '</button></div>' : '<div class="ldb"><button data-ldp="' + p.id + '|open">' + L2("改回进行中", "Reopen") + '</button></div>') + '</div>').join("") : '<p class="xs faint ldempty">' + L2("还没有约定。你们说好的事会自动记在这里。", "No promises yet. Plans you make together show up here.") + '</p>';
  if (tab === "c") body = L.c.length ? L.c.slice().reverse().map(c => { const [a, b] = c.k.split("|"); return '<div class="ldi ' + (c.st === "open" ? "open" : "kept") + '"><p>' + esc(name(a) + " & " + name(b)) + '：' + esc(c.why) + '<small>' + c.id + ' · ' + (c.st === "open" ? L2("还没和解——一句道歉不够，要用行动修复", "Not repaired yet — it takes actions, not one apology") : L2("已经和解", "Repaired")) + '</small></p></div>'; }).join("") : '<p class="xs faint ldempty">' + L2("目前没有未解决的冲突。", "No unresolved conflicts.") + '</p>';
  if (tab === "s") body = S2.length ? S2.map(s => '<div class="ldi ' + (s.open ? "kept" : "open") + '"><p>' + (s.open ? esc(name(s.cid) + "：" + s.t) : '🔒 ' + esc(L2(name(s.cid) + " 还有一个秘密没告诉你", name(s.cid) + " is keeping something from you"))) + '<small>' + (s.open ? L2("你已经知道了", "You know this now") : L2("关系更近之后才会揭开", "Opens up as you get closer")) + '</small></p></div>').join("") : '<p class="xs faint ldempty">' + L2("这个故事里还没有秘密。", "No secrets in this story yet.") + '</p>';
  if (tab === "k") { const lines = []; try { if (th.pk && th.pk.picks) { const w = wd(th.wid), P = w && w.pack; Object.entries(th.pk.picks).forEach(([n, k]) => { const c = P && P.chapters[n - 1], o = c && c.choices.find(x => x.k === k); if (o) lines.push(L2("第 " + n + " 章：", "Ch " + n + ": ") + Lz(o.t)); }); } if (th.pk && th.pk.items) Object.entries(th.pk.items).filter(([, v]) => v).forEach(([id]) => lines.push(L2("持有：", "Holding: ") + itemName(th, id))); if (th.rdv) Object.entries(th.rdv).forEach(([k, r]) => { const [a, b] = k.split("|"); lines.push(name(a) + " & " + name(b) + "：" + (typeof t === "function" ? t("dm.s." + dimStage(r)) : dimStage(r))); }); } catch (_) {}
    body = lines.length ? lines.map(x => '<div class="ldi kept"><p>' + esc(x) + '</p></div>').join("") : '<p class="xs faint ldempty">' + L2("故事刚开始。", "The story has just begun.") + '</p>'; }
  sheet('<div class="lds"><div class="eyebrow" style="color:var(--gold)">' + L2("剧情账本", "STORY LEDGER") + '</div><b style="font-size:17px">' + esc(th.title || "") + '</b><p class="xs faint" style="margin:2px 0 0">' + L2("这里记的是这个故事的「正史」。角色必须照着它来，AI 不能自己改。", "This is the story's canon. Characters must stay true to it — the AI can't rewrite it.") + '</p>' +
    '<div class="m2tabs">' + tabs.map(([k, l, n]) => '<button class="' + (tab === k ? "on" : "") + '" data-ldt="' + k + '">' + l + (n !== "" ? " " + n : "") + '</button>').join("") + '</div><div class="ldl">' + body + '</div>' +
    '<button class="lnk" data-m2open="1" style="display:block;margin:6px auto 0">📖 ' + L2("他记得的事", "What he remembers") + '</button></div>');
}
document.addEventListener("click", e => {
  let x; const th = S.threads[curT]; if (!th) return;
  if (x = e.target.closest("[data-ledopen]")) { e.stopImmediatePropagation(); ledSheet(); return; }
  if (x = e.target.closest("[data-ldt]")) { ledSheet(x.dataset.ldt); return; }
  if (x = e.target.closest("[data-ldp]")) { const [id, st] = x.dataset.ldp.split("|"); const p = led(th).p.find(y => y.id === id); if (p) { p.st = st; p.byAI = 0; p.end = st === "open" ? null : Date.now(); save(); toast(st === "kept" ? LL("记下了：约定兑现", "Marked as kept") : st === "broken" ? LL("记下了：约定落空", "Marked as broken") : LL("已改回进行中", "Reopened")); } ledSheet("p"); return; }
}, true);
menuSheet = (function (orig) { return function () { orig.apply(this, arguments); try { const s = document.querySelector(".sheet .stack"); if (s && !s.querySelector("[data-ledopen]")) { const th = S.threads[curT]; const L = led(th), n = L ? L.p.filter(p => p.st === "open").length + L.c.filter(c => c.st === "open").length : 0; s.insertAdjacentHTML("afterbegin", '<button class="opt" data-ledopen="1"><span class="ic">📜</span><span class="grow"><b>' + LL("剧情账本", "Story ledger") + (n ? ' · ' + n : '') + '</b><span>' + LL("约定、未解决的冲突、秘密、已做的选择", "Promises, open conflicts, secrets, choices made") + '</span></span></button>'); } } catch (_) {} }; })(menuSheet);
m2Sheet = (function (orig) { return function () { orig.apply(this, arguments); try { const b = document.querySelector(".m2s"); if (b && !b.querySelector("[data-ledopen]")) b.insertAdjacentHTML("beforeend", '<button class="lnk" data-ledopen="1" style="display:block;margin:2px auto 0">📜 ' + LL("剧情账本", "Story ledger") + '</button>'); } catch (_) {} }; })(m2Sheet);
(function () { const st = document.createElement("style"); st.textContent = `
.lds{display:flex;flex-direction:column;gap:10px}.ldl{display:flex;flex-direction:column;gap:8px;max-height:52vh;overflow:auto}
.ldi{border:1px solid var(--line);border-radius:12px;padding:9px 11px;background:var(--panel2)}.ldi p{margin:0;font-size:13.5px;line-height:1.45}.ldi small{display:block;font-size:10.5px;color:var(--faint);margin-top:3px}
.ldi.open{border-color:rgba(240,183,126,.45)}.ldi.broken{opacity:.6}.ldb{display:flex;gap:6px;justify-content:flex-end;margin-top:7px}.ldb button{font-size:11px;font-weight:700;color:var(--dim);border:1px solid var(--line2);background:none;border-radius:999px;padding:3px 10px}
.ldempty{text-align:center;padding:14px 0}`; document.head.appendChild(st); })();
