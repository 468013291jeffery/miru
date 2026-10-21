/* ================= v2.7 · MIRU 互动剧本规则 v1.0 — runtime side =================
   The creator side carries the full rule set (MIRU_GEN_RULES, app57). This file applies the rules that matter while a story is PLAYED:
   · Free talk answers what the player actually said (R41 input types, R42 knowledge limits, R12 behaviour chain). A guarded character still
     answers — the guard shows in HOW he answers, not by ignoring the words. Words that assume something that never happened are noticed,
     not played along with.  (Fix for 「能回应但自说自话」.)
   · The chapter prompt no longer claims "this chapter's choice is made" while the chapter is still in progress.
   · Character autonomy / player autonomy (R16, R17), offline never punished (R47), "don't bring it up / don't remember" respected (R48).
   · Line length follows content (R27 + 正文风格): narration may run long enough to make the situation clear.
   · Mini-games (R07, R25, rule 14): no keyword-inserted games in the opening chapter; later only when the scene is really about that
     activity (keyword in ≥2 of the last 6 lines), after the player has taken part at least once in the chapter, one every two chapters,
     with the triggering line shown on the card so it reads as part of the story.
   · Publish QA adds the v1.0 checks: character shown early, choices with real differences, no unrelated game in the opening, free path. */

/* ---------- 1 · chapter state in the prompt ---------- */
const _packPrompt71 = packPrompt;
packPrompt = function (th) {
  let s = _packPrompt71(th);
  try {
    if (th && th.pk && !th.pk.picks[th.pk.ch] && s.indexOf("This chapter's choice is made") >= 0)
      s = s.replace(/This chapter's choice is made\.[^\n]*/, "This chapter is in progress and its official choice has NOT happened yet. Stay inside the current moment: do not make that choice for anyone, do not jump to later chapters, do not resolve the chapter goal.");
  } catch (_) {}
  return s;
};

/* ---------- 2 · free talk: answer the player's actual words ---------- */
CTX.talk = [
  "{u} speaks directly to the scene, outside the scripted lines: \"{x}\".",
  "First decide (silently) what this is — an expression, a question, a guess, a request, a promise, an action attempt, or consent — and who it is addressed to.",
  "BEAT 1 MUST respond to exactly that: answer the question, react to the request or promise, or respond to the action. A character may refuse, dodge the feeling, or give a partial answer — but always with a reason he would really have, so the reply makes sense to someone who reads only {u}'s line and the reply. Never ignore the words and never just continue the scripted scene.",
  "A guarded or closed-off character still answers: the guard shows in HOW he answers (short, dry, sidestepping the feeling), not in ignoring what was said.",
  "If {u}'s words assume something that has not happened in STORY SO FAR, or that this character does not know, he notices the mismatch and reacts to it (confused, corrects them, asks what they mean). Never pretend it happened and never invent new facts, evidence, items or confessions to make it true.",
  "An action attempt is only an attempt: show how the others react; do not declare results the story has not established.",
  "Stay in this moment: keep the chapter question open, do not make the reader's official choice, reveal secrets only as far as this relationship stage allows.",
  "2–4 beats. These talk rules override any style rule below that would make him deflect instead of answering."
].join("\n");

/* ---------- 3 · rules block for every story reply ---------- */
const MIRU_PLAY_RULES = [
  "CHARACTER LOGIC (MIRU rules v1.0):",
  "- Every reaction comes from: the character's profile + what he actually knows + the pressure of this moment + the relationship stage + his arc stage. He cannot react to things he hasn't seen or been told.",
  "- Characters have their own will: they may share something, propose a plan, refuse, explain, apologize or step away — and live with the cost. The user is not the only engine of the scene.",
  "- Never decide for the user that they love, forgive, consent or accept a relationship. A character may misread the user — write it as his reading, not as fact.",
  "- Facts, items, evidence and endings only change when the script says so; you may only suggest. Real-world time away from the app is never a betrayal — no guilt-tripping about absence.",
  "- Lines are as long as the content needs: a narration beat may run up to ~60 words when it must make clear where we are, who is present and what just happened. Never cut information the reader needs to follow the story.",
].join("\n") + "\n" + MIRU_RULES.play;
const _ask71 = ask;
ask = function (prompt, opts) {
  try {
    if (typeof prompt === "string" && prompt.indexOf("You write MIRU") === 0) {
      if (prompt.indexOf("HOW TO WRITE") > 0 && prompt.indexOf("CHARACTER LOGIC (MIRU rules") < 0) prompt = prompt.replace("HOW TO WRITE", MIRU_PLAY_RULES + "\nHOW TO WRITE");
      prompt = prompt.replace(/each under 32 words/, "each a natural line (dialogue usually under 32 words; narration up to ~60 words when it must set the scene)").replace(/each under 45 words/, "each a natural line (dialogue usually under 45 words; narration up to ~70 words when it must set the scene)");
      const th = S.threads[curT];
      if (th && th.memRules && th.memRules.length) prompt = prompt.replace("STORY SO FAR:", "THE USER ASKED (respect this): " + th.memRules.slice(-6).join(" / ") + "\nSTORY SO FAR:");
    }
  } catch (_) {}
  const rest = [].slice.call(arguments, 1), story = typeof prompt === "string" && prompt.indexOf("You write MIRU") === 0;
  return _ask71.apply(this, [prompt].concat(rest)).catch(e => {
    // one quiet retry for transient failures (slow model, dropped connection) before anything falls back
    if (story && e && /^(http_5|timeout|network|upstream|bad_response|invalid_json)/.test(String(e.code || ""))) return _ask71.apply(this, [prompt].concat(rest));
    throw e;
  });
};
/* if the live reply still fails, say so honestly instead of a canned line that doesn't answer the player */
const _fallback71 = fallback;
fallback = function (th, ctx) {
  if (ctx && ctx.kind === "talk" && liveOn()) return { beats: [{ who: "n", kind: "act", text: LL("（信号断了一下，他没听清。再说一次试试？）", "(The connection dropped — he didn't catch that. Try again?)") }], status: {}, love: {}, suggest: [String(ctx.txt || "")].filter(Boolean) };
  return _fallback71.apply(this, arguments);
};

/* ---------- 4 · memory wishes (R48) ---------- */
const NOMENTION_RX = /(别再提|不要再提|别提了|不想再提|don'?t (bring (it|that) up|mention (it|that)) (again|anymore)?|stop bringing (it|that) up)/i;
const FORGET_RX = /(不要记住|别记住|忘了它|忘掉这件事|别记这个|forget (that|it|what i said)|don'?t remember (that|this))/i;
const _doSend71 = doSend;
doSend = function (txt, mode) {
  try {
    const th = S.threads[curT], s = String(txt || "");
    if (th && (NOMENTION_RX.test(s) || FORGET_RX.test(s))) {
      const prev = (th.msgs || []).slice(-8).reverse().find(m => m.who === "me" && m.txt && m.txt !== s);
      const topic = prev ? String(prev.txt).slice(0, 40) : "";
      th.memRules = (th.memRules || []).concat(FORGET_RX.test(s) ? "do not remember or bring up what they said about: " + (topic || "the last topic") : "do not bring up again: " + (topic || "the last topic")).slice(-10);
      if (FORGET_RX.test(s) && topic) {
        th.mem = (th.mem || []).filter(m => String(m).indexOf(topic.slice(0, 12)) < 0);
        if (Array.isArray(th.mem2)) th.mem2 = th.mem2.filter(m => !(m && String(m.t || m.txt || "").indexOf(topic.slice(0, 12)) >= 0));
      }
      save();
    }
  } catch (_) {}
  return _doSend71.apply(this, arguments);
};

/* ---------- 5 · mini-game placement ---------- */
const _stopResolve71 = stopResolve;
stopResolve = function (th) { try { if (th && th.pk) { const k = "c" + th.pk.ch; th.pk.acted = th.pk.acted || {}; th.pk.acted[k] = (th.pk.acted[k] || 0) + 1; } } catch (_) {} return _stopResolve71.apply(this, arguments); };
function mgRelevant71(th, G) {
  const lines = (th.msgs || []).filter(m => m.who !== "me" && m.txt).slice(-6).map(m => String(m.txt).toLowerCase());
  const kws = (G.kw || []).filter(k => k && (/[぀-鿿]/.test(k) ? k.length >= 2 : k.length >= 4)).map(k => k.toLowerCase());
  return lines.filter(l => kws.some(k => l.includes(k))).length >= 2;
}
const _pkAppend71 = pkAppend;
pkAppend = function (th, m) {
  const before = th && th.pk && Array.isArray(th.pk.q) ? th.pk.q.length : 0;
  const r = _pkAppend71.apply(this, arguments);
  try {
    if (th && th.pk && Array.isArray(th.pk.q) && th.pk.q.length > before) {
      const b = th.pk.q[0];
      if (Array.isArray(b) && b[1] === "mg" && b[2] && b[2].auto) {
        const G = MG100.find(x => x.id === b[2].id), k = "c" + th.pk.ch, acted = (th.pk.acted || {})[k] || 0, last = th.pk.mgLastCh || -9;
        const ok = G && th.pk.ch >= 2 && (th.pk.lineN || 0) >= 10 && acted >= 1 && th.pk.ch - last >= 2 && mgRelevant71(th, G);
        if (!ok) { th.pk.q.shift(); if (th.pk.mgAuto) delete th.pk.mgAuto[k]; }
        else { th.pk.mgLastCh = th.pk.ch; b[2].why = String(m && m.txt || "").slice(0, 46); }
        save();
      }
    }
  } catch (_) {}
  return r;
};
const _stopHTML71 = stopHTML;
stopHTML = function (th) {
  const h = _stopHTML71.apply(this, arguments);
  try { const b = th.pk && th.pk.stop; if (b && b[1] === "mg" && b[2] && b[2].why) return h.replace('<div class="stcard">', '<p class="mgwhy71">「' + esc(b[2].why) + '」</p><div class="stcard">'); } catch (_) {}
  return h;
};

/* ---------- 6 · scene writer (creator) follows the scene rules ---------- */
const SCENE_RULES71 = "MIRU scene rules: open by SHOWING the lead through a concrete action — how he treats the user's situation — so the reader knows who they are, where they are, what is happening and what they could do; give one core appeal and one thing worth discovering, not every secret. Each beat follows from the last (new information or obstacle → change of strategy); no fight inserted just to fill lines. Narration may be as long as needed to make the situation and stakes clear before any decision. Characters only know what they've seen or been told. Do not insert games or effects unrelated to what is happening. Pace by story_mode in the story card: strong plot = conflict may come every scene or two with aftermath; mixed = events or relationship shifts every few exchanges; everyday companionship = no forced conflict, change comes from sharing, small plans and new understanding. twist_density sets how often a clue re-frames what the reader believed (low/mid/high) — never twist without earlier clues.";
if (typeof cAsk === "function") {
  const _cAsk71 = cAsk;
  cAsk = function (prompt, ms) {
    try { if (typeof prompt === "string" && /^Write the (opening scene|chapter) of an interactive romance drama/.test(prompt)) prompt = prompt.replace(/ Rules: concrete sensory detail[^.]*\./, " " + SCENE_RULES71 + " Style: concrete sensory detail, a distinct voice for each character, no clichés, show feelings through behaviour.").replace(/(\d+)-(\d+) beats\./, "$1-$2 beats (more if the scene needs them to be clear)."); } catch (_) {}
    return _cAsk71.apply(this, arguments);
  };
}

/* story mode + twist density travel with the story card (rules 02, 08, 09) */
if (typeof cBuildWorld === "function") { const _cbw71 = cBuildWorld; cBuildWorld = function (c, picks) { try { picks = picks || {}; c.story_mode = { plot: "strong plot", mix: "mixed plot + everyday", daily: "everyday companionship" }[picks.mode || "mix"]; c.twist_density = picks.twist || "mid"; } catch (_) {} return _cbw71.apply(this, arguments); }; }
/* ---------- 7 · publish QA: v1.0 checks ---------- */
/* v2.9 · 终版: the shared MIRU_RULES.check runs on every publish too (capacity estimate, expression, autonomy, free path, repetition) */
const _miruQA74 = miruQA;
miruQA = function (w) { const R = _miruQA74.apply(this, arguments); try { const X = MIRU_RULES.check(w, { longform: !!(w && w.pack && w.pack.longform) }); const add = (src, dst) => src.forEach(m => { if (!dst.includes(m)) dst.push(m); }); add(X.err, R.err); add(X.warn, R.warn); R.estimate = X.estimate; R.rulesVersion = MIRU_RULES.version; } catch (_) {} return R; };
const _miruQA71 = miruQA;
miruQA = function (w) {
  const R = _miruQA71.apply(this, arguments);
  try {
    const P = w && w.pack, ch = P && P.chapters || [], lead = (w.cast || [])[0];
    if (ch[0]) {
      const B = qaBeats(ch[0].beats).filter(b => Array.isArray(b));
      const first = B.slice(0, 10), shown = first.some(b => b[0] && b[0] !== "n" && b[0] !== "sys" && b[0] !== "me");
      if (B.length && !shown) R.warn.push(LL("第 1 章：前 10 句里主要角色还没有出场或开口——开篇要先让玩家看到他怎么对待你（规则 04）", "Chapter 1: the lead doesn't appear in the first 10 lines — show him early (rule 04)"));
      if (first.some(b => b[0] === "sys" && b[1] === "mg")) R.warn.push(LL("第 1 章开头就插入小游戏：开篇先认识人物，小游戏放到剧情里正在做这件事的时候（规则 14）", "Chapter 1 opens with a mini-game — introduce the character first (rule 14)"));
    }
    ch.forEach((c, i) => {
      const cs = (c.choices || []);
      if (cs.length >= 2) {
        const sig = cs.map(x => JSON.stringify([x.set || null, x.need || null, x.love || null, (x.mem && (x.mem.zh || x.mem.en)) || null]));
        if (new Set(sig).size === 1) R.warn.push(LL("第 " + (i + 1) + " 章：几个选项的后果完全一样——重要选择至少要改变行为、信息、承诺或后续行动之一，并在后文读取（规则 07）", "Chapter " + (i + 1) + ": all choices have identical effects (rule 07)"));
      }
      const paidOnly = cs.length && cs.every(x => x.paid || x.need);
      if (paidOnly) R.err.push(LL("第 " + (i + 1) + " 章：所有选项都需要付费或道具——必须保留免费有效路径（规则 10）", "Chapter " + (i + 1) + ": every option is paid or needs an item — keep a free path (rule 10)"));
    });
  } catch (_) {}
  return R;
};

(function () { const st = document.createElement("style"); st.textContent = ".mgwhy71{margin:0 0 8px;font-size:12.5px;color:var(--dim);line-height:1.5}"; document.head.appendChild(st); })();
