/* ================= v7.0 · 故事圣经驱动的自由模式（剧情智能体 + 角色智能体） =================
   作品资料 = 故事圣经（art/official/<作品ID>.bible.json）：世界、风格规则、玩家身份卡（A）、角色卡（B/C）、章节 → 场景锚点、选择、结局条件。
   运行：
   · 剧情智能体（导演）：只读世界、当前章节的场景锚点和玩家行为；负责进场、调度谁开口、给建议行动；不知道后面的章节和结局。
   · 角色智能体：每个角色只读自己的角色卡、自己的记忆（亲历 / 被告知）、眼前发生的事；不知道剧情走向，不知道玩家心里想什么。
   · 每个场景：进场（锚点演出）→ 自由对话（想聊多久聊多久，角色在场景里回应你）→ 你点「继续剧情」→ 场景选择（如有）→ 下一场。
     剧情只在你点「继续」或做出选择时推进 —— 不会自己跳走。
   · 电话只在作品设定里真的有电话的场景出现；小游戏默认关闭（版本 1：无玩法），作品资料里 games_on=true 才开启（版本 2）。
   · 玩家身份卡只有客观身份；玩家的性格、喜好由你的发言和选择累积（动态画像），不预设。 */
const B98 = { cache: {}, ids: {} };
const Z98 = () => CL() === "zh";
const L98 = (zh, en) => Z98() ? zh : en;
const LZ98 = o => (o && typeof o === "object") ? ((Z98() ? o.zh : o.en) || o.zh || o.en || "") : String(o || "");
async function bible98(id) {
  if (id in B98.cache) return B98.cache[id];
  let b = null; try { const r = await fetch("art/official/" + encodeURIComponent(id) + ".bible.json?v=" + Math.floor(Date.now() / 3e5)); if (r.ok) b = await r.json(); } catch (_) {}
  B98.cache[id] = b; return b;
}
function cid98(wid, key) { return "b98_" + wid.replace(/[^a-z0-9]/gi, "").slice(-10) + "_" + key; }
function bOf98(w) { return w && w.bible98 && B98.cache[w.community]; }
function cardOf98(w, cid) { const b = bOf98(w); if (!b) return null; const k = (S.mine.chars[cid] || {}).bkey; return b.cast.find(c => c.key === k) || (b.player.key === k ? Object.assign({ tier: "lead" }, b.player) : null); }
/* build / refresh the local world from the bible */
async function install98(id) {
  const b = await bible98(id); if (!b) return null;
  let A = {}; try { A = await off94Assets(id); } catch (_) {}
  const wid = "bw_" + id.replace(/[^a-z0-9]/gi, "").slice(-12), keys = new Set(b.cast.map(c => c.key)); keys.add(b.player.key);
  const all = b.cast.slice(); if (!b.cast.some(c => c.key === b.player.key)) all.unshift(Object.assign({ tier: "lead", short: b.player.name }, b.player));
  const pals = [["#C98A6B", "#1B1520"], ["#7A63C9", "#141024"], ["#5E9E96", "#13212A"], ["#B0607A", "#21131B"]];
  all.forEach((c, i) => { const id2 = cid98(wid, c.key), sh0 = c.short || c.name || { zh: c.key, en: c.key }, cut = v => String(v || "").split(/\s*[\/／]\s*/)[0].replace(/[（(].*$/, "").trim(), sh = { zh: cut(sh0.zh) || cut(sh0.en), en: cut(sh0.en) || cut(sh0.zh) };
    const x = S.mine.chars[id2] || {};
    S.mine.chars[id2] = Object.assign(x, { n: LZ98(sh), n94: { zh: sh.zh || sh.en, en: sh.en || sh.zh }, full: c.name, bkey: c.key, age: +c.age || 0, g: c.gender === "f" ? "f" : "m", w: wid, pal: pals[i % 4], a: "charm", v: x.v || { pitch: 1, rate: 1 },
      role: { zh: (c.role && (c.role.zh || c.role.en)) || "", en: (c.role && (c.role.en || c.role.zh)) || "" }, looks: { zh: c.bio || c.brief || "", en: c.bio || c.brief || "" }, vibe: { zh: (c.personality || "").slice(0, 80), en: (c.personality || "").slice(0, 80) },
      tells: { en: [], zh: [] }, twist: { en: "", zh: "" }, likes: { en: "", zh: "" }, secret: { en: "", zh: "" }, pitch: { en: "", zh: "" }, solo: { en: "…", zh: "…" }, by: "@miru" });
    const art = A["char_" + c.key] || (sh.zh && A["char_" + sh.zh]) || (c.name && c.name.zh && A["char_" + c.name.zh]); if (art) S.art[id2] = art; });
  const cast = all.map(c => cid98(wid, c.key));
  const w = S.mine.worlds[wid] || {};
  S.mine.worlds[wid] = Object.assign(w, { id: wid, kind: "story", bible98: 1, official76: 1, community: id, mine: 0, author: Z98() ? "MIRU 官方" : "MIRU Originals",
    title: { zh: b.title.zh, en: b.title.en }, hook: { zh: b.hook.zh, en: b.hook.en }, premise: { zh: b.premise.zh, en: b.premise.en },
    you: { zh: LZ98(b.player.name) + " · " + (b.player.role ? (b.player.role.zh || "") : "") , en: (b.player.name.en || "") + " · " + (b.player.role ? (b.player.role.en || "") : "") },
    warn: { zh: "", en: "" }, rel: [], openings: null, tags: (b.tags || []).slice(0, 8), or: b.orient || "bl", cast, stats: [0, 0, 0], status: { time: { zh: "", en: "" }, place: { zh: "", en: "" } }, cover: A.cover ? wid : null, calls: !!b.chapters.some(c => c.scenes.some(s => s.call)) });
  if (A.cover || A.poster) S.art[wid] = A.cover || A.poster;
  S.off76 = S.off76 || {}; S.off76[id] = Object.assign(S.off76[id] || {}, { wid, b98: 1 }); save(); return wid;
}
{ const _iw = installWork; installWork = async function (id) { try { const b = await bible98(id); if (b) return await install98(id); } catch (e) { try { console.warn("[b98]", e); } catch (_) {} } return _iw.apply(this, arguments); }; }
/* worlds loaded from a previous session need their bible back in memory */
setTimeout(() => { try { Object.values(S.mine.worlds || {}).forEach(w => { if (w && w.bible98) bible98(w.community); }); } catch (_) {} }, 0);
async function ensure98(w) { if (w && w.bible98 && !(w.community in B98.cache)) await bible98(w.community); return bOf98(w); }

/* ---------- start: pick who you are ---------- */
async function start98(wid) {
  const w = wd(wid), b = await ensure98(w); if (!b) return;
  const ex = Object.values(S.threads).filter(t => t.wid === wid && t.b98 && !t.b98.ended).sort((a, b2) => b2.at - a.at)[0];
  const opts = (b.playable && b.playable.length ? b.playable : [b.player.key]).map(k => { const c = k === b.player.key ? b.player : b.cast.find(x => x.key === k); return c ? { k, n: LZ98(c.short || c.name), r: LZ98(c.role), main: k === b.player.key } : null; }).filter(Boolean);
  sheet('<div class="eyebrow">' + L98("你想怎么玩？", "How do you want to play?") + '</div><h2 style="margin-top:4px">' + esc(LZ98(b.title)) + '</h2><p class="xs faint" style="margin-top:4px">' + esc(oriL98(b.orient)) + ' · ' + b.chapters.length + L98(" 章", " chapters") + '</p>' +
    (ex ? '<button class="btn btn-p btn-block" style="margin-top:12px" data-b98open="' + esc(ex.id) + '">▶ ' + L98("继续 · 第 " + ex.b98.ch + " 章", "Continue · chapter " + ex.b98.ch) + '</button><div class="eyebrow" style="margin-top:14px">' + L98("重新开始", "Start over") + '</div>' : '') +
    '<div class="stack" style="gap:8px;margin-top:10px">' + opts.map(o => '<button class="opt" data-b98go="' + esc(wid) + '|' + esc(o.k) + '"><span class="ic">🎭</span><span class="grow"><b>' + L98("扮演 ", "Play ") + esc(o.n) + (o.main ? L98("（主角）", " (lead)") : "") + '</b><span>' + esc(o.r) + '</span></span>›</button>').join("") + '</div>' +
    '<p class="xs faint" style="margin-top:12px;line-height:1.55">' + L98("每个角色都有自己的想法和记忆，不知道剧情会怎么走。你可以在每个场景里自由聊天，想推进时点「继续剧情」。", "Every character has their own mind and memory and doesn't know where this goes. Talk freely in each scene; tap “Continue” when you want the story to move.") + '</p>');
}
function oriL98(o) { return Z98() ? ({ bl: "男男", gl: "女女", bg: "男女" }[o] || "") : ({ bl: "BL · M/M", gl: "GL · F/F", bg: "M/F" }[o] || ""); }
function new98(wid, asKey) {
  const w = wd(wid), b = bOf98(w), now = Date.now(), you = cid98(wid, asKey);
  const cast = w.cast.filter(c => c !== you && ch(c));
  const th = { id: "b:" + wid + ":" + now, kind: "group", wid, cast, title: LZ98(b.title), msgs: [], love: {}, rounds: 0, status: { time: "", place: "", mood: {} }, tasks: {}, mem: [], created: now, at: now, setting: "", you: "",
    b98: { as: asKey, you, ch: 1, sc: 0, phase: "enter", turns: 0, sum: [], cards: {}, flags: [], profile: [], ended: false, picked: {} } };
  cast.forEach(c => { th.love[c] = 5; const card = cardOf98(w, c); th.b98.cards[c] = { mem: card && card.knows ? [L98("（初始知道）", "(known from the start) ") + String(card.knows).slice(0, 160)] : [] }; });
  th.persona = Object.assign({}, persona()); S.threads[th.id] = th; save(); return th;
}
document.addEventListener("click", e => { let x;
  if ((x = e.target.closest("[data-b98go]"))) { e.stopPropagation(); const [wid, k] = x.dataset.b98go.split("|"); const th = new98(wid, k); closeSheet(); openThread(th.id); setTimeout(() => enter98(th), 300); return; }
  if ((x = e.target.closest("[data-b98open]"))) { e.stopPropagation(); closeSheet(); openThread(x.dataset.b98open); return; }
  if ((x = e.target.closest("[data-newt],[data-pkstart]"))) { const w = wd(x.dataset.newt || x.dataset.pkstart); if (w && w.bible98) { e.preventDefault(); e.stopPropagation(); start98(w.id); } return; }
}, true);
{ const _ss = startSheet; startSheet = function (wid) { const w = wd(wid); if (w && w.bible98) return start98(wid); return _ss.apply(this, arguments); }; }

/* ---------- helpers ---------- */
function scene98(th) { const b = bOf98(wd(th.wid)), c = b && b.chapters[th.b98.ch - 1]; return { b, c, s: c && c.scenes[th.b98.sc] }; }
function byKey98(th, key) { return cid98(th.wid, key); }
function yn98(th) { const c = ch(th.b98.you); const n = c && first(c.n); if (th.b98.as === "heir" || !n || /你|You/.test(n)) { try { const p = persona(); if (p && p.name) return p.name; } catch (_) {} return L98("你", "you"); } return n; }
function line98(th, m) {
  if (m.who === "me" && m.k === "think") return ""; const x = String(m.txt || "").replace(/\s+/g, " ").slice(0, 220); if (!x || m.k === "card" || m.k === "img") return "";
  const who = m.who === "me" ? yn98(th) : m.who === "n" || m.who === "sys" ? "" : (ch(m.who) ? first(ch(m.who).n) : "");
  return who ? who + (m.k === "act" ? L98("（动作）", " (action)") : "") + ": " + x : L98("［场景］", "[scene] ") + x;
}
function tail98(th, n) { return th.msgs.slice(-(n || 16)).map(m => line98(th, m)).filter(Boolean).join("\n"); }
function present98(th, s) { return ((s && s.present) || []).map(k => byKey98(th, k)).filter(c => th.cast.includes(c)); }
function stage98(v) { return v >= 80 ? L98("深深在意", "deeply attached") : v >= 55 ? L98("心动", "drawn in") : v >= 30 ? L98("开始在意", "starting to care") : v >= 12 ? L98("有点好奇", "curious") : L98("戒备 / 不熟", "guarded / strangers"); }
function mem98(th, cids, fact) { if (!fact) return; cids.forEach(c => { const cd = th.b98.cards[c] || (th.b98.cards[c] = { mem: [] }); cd.mem.push(String(fact).slice(0, 100)); if (cd.mem.length > 36) cd.mem.splice(1, cd.mem.length - 36); }); }
const LANG98 = () => Z98() ? "Simplified Chinese" : "English";

/* ---------- the story agent (director) ---------- */
async function director98(th, mode, act) {
  const { b, c, s } = scene98(th), A = th.b98, zh = Z98(), w = wd(th.wid);
  const castL = th.cast.map(id => { const k = cardOf98(w, id); return "- id=" + id + " · " + first(ch(id).n) + "（" + LZ98(k && k.role) + "，" + (k ? k.tier : "") + "）"; }).join("\n");
  const sceneL = c.scenes.map((x, i) => (i === A.sc ? "▶ " : (i < A.sc ? "✓ " : "· ")) + (i + 1) + ". " + LZ98(x.place) + (i === A.sc ? "：" + x.beat : "")).join("\n");
  const rel = th.cast.slice(0, 8).map(id => first(ch(id).n) + " " + Math.round(th.love[id] || 0)).join("，");
  const last = A.ch === b.chapters.length && A.sc === c.scenes.length - 1;
  const task = mode === "enter" ? (zh ? "现在进入这一场。写进场旁白（第二人称，≤3 句，交代你在哪、眼前发生什么），并安排在场角色把这一场的锚点演出来（1-3 人依次开口）。" : "Enter this scene now. Write an entrance narration (second person, ≤3 sentences: where you are, what's happening) and have present characters play this scene's anchor (1-3 speak in turn).")
    : mode === "choice" ? (zh ? "玩家刚做出这一场的选择，后果见下。让在场角色真实地回应这个选择（1-2 人），旁白最多 1 句。" : "The player just made this scene's choice; its consequence is below. Have present characters respond for real (1-2), narration at most 1 sentence.")
    : mode === "exit" ? (zh ? "玩家要推进剧情：用 1 句旁白收束这一场（可不写），不要有人再长篇说话；speakers 可为空。" : "The player wants to move on: close this scene in one sentence of narration (or none); speakers may be empty.")
    : (zh ? "这是自由对话：玩家在这一场里和角色相处。不要推进到下一场，不要强行制造事件；让被对话的人或最自然的人回应（1-2 人），角色可以拒绝、沉默、反问。" : "Free talk: the player is spending time in this scene. Don't move to the next scene or force events; let whoever is addressed or most natural respond (1-2); characters may refuse, go quiet, or ask back.");
  const p = (zh ? "你是互动剧的剧情智能体（导演）。你不替任何人说话；你只安排这一刻：谁开口、他们此刻想干什么。玩家是主角。你只知道下面列出的这一章，不知道后面的章节和结局。"
                : "You are the story agent (director) of an interactive drama. You never speak for anyone; you arrange this moment: who speaks and what they want right now. The player is the protagonist. You only know this chapter, not later chapters or the ending.") +
    "\n\n" + (zh ? "世界（后台）：\n" : "World (backstage):\n") + String(b.world || "").slice(0, 1600) +
    "\n\n" + (zh ? "规则：\n" : "Rules:\n") + String(b.style || "").slice(0, 1300) +
    "\n\n" + (zh ? "玩家：" : "Player: ") + yn98(th) + "（" + LZ98((A.as === b.player.key ? b.player : cardOf98(w, A.you) || {}).role) + "）" + (A.profile.length ? (zh ? "；玩家自己表现出的样子：" : "; how the player has shown themselves: ") + A.profile.slice(-6).join("；") : "") +
    "\n" + (zh ? "角色（只有这些 id 能开口）：\n" : "Cast (only these ids may speak):\n") + castL +
    "\n" + (zh ? "他们对玩家的好感：" : "Their feeling toward the player: ") + rel +
    "\n\n" + (zh ? "第 " + A.ch + " / " + b.chapters.length + " 章「" + LZ98(c.title) + "」目标：" : "Chapter " + A.ch + " / " + b.chapters.length + " “" + LZ98(c.title) + "” goal: ") + (c.goal || "") +
    "\n" + (zh ? "本章场景（▶ 当前）：\n" : "Scenes (▶ current):\n") + sceneL +
    "\n" + (zh ? "当前场景在场：" : "Present now: ") + (present98(th, s).map(id => first(ch(id).n) + "(" + id + ")").join("、") || "—") +
    (s.ref_lines && s.ref_lines.length && mode === "enter" ? "\n" + (zh ? "锚点台词（角色可以用，可改写，不必照念）：\n" : "Anchor lines (characters may use or adapt them):\n") + s.ref_lines.map(r => (ch(byKey98(th, r.who)) ? first(ch(byKey98(th, r.who)).n) : r.who) + "：" + r.line).join("\n") : "") +
    (A.sum.length ? "\n" + (zh ? "前情：\n" : "So far:\n") + A.sum.slice(-8).join("\n") : "") +
    "\n\n" + (zh ? "刚才：\n" : "Just now:\n") + (tail98(th, 14) || (zh ? "（刚开始）" : "(just starting)")) +
    (act ? "\n\n" + (zh ? "玩家这一轮：" : "The player's move: ") + (act.mode === "think" ? (zh ? "（心里想，角色不知道）" : "(private thought — characters don't know) ") : act.mode === "act" ? (zh ? "（动作）" : "(action) ") : "") + act.txt + (act.to ? (zh ? "（对 " : " (to ") + first(ch(act.to).n) + "）" : "") : "") +
    (act && act.effect ? "\n" + (zh ? "这个选择的后果（作者设定）：" : "Consequence of this choice (by design): ") + act.effect : "") +
    "\n\n" + (zh ? "任务：" : "Task: ") + task +
    "\n" + (zh ? "绝不替玩家说话、做动作、做决定；不让所有人都围着玩家转；不安排剧本没有的电话；不剧透后面的事。options：玩家下一步可以说或做的 3 件事（各不超过 14 字，态度不同）。player_obs：玩家这一轮明确表现出的偏好或态度（没有就空）。state：本轮按作者规则的状态变化（如 Ember +2），没有就空。"
           : "Never write the player's words, actions or decisions; not everyone revolves around the player; no calls the script doesn't have; no spoilers. options: 3 different things the player could say or do next (under 8 words). player_obs: a preference or attitude the player clearly showed this turn (or empty). state: state changes per the author's rules (e.g. Ember +2), or empty.") +
    (last && mode === "exit" ? "\n" + (zh ? "这是全书最后一场。根据玩家一路的言行和下面的结局条件，选出结局 ending（填结局 id）并写 endingText（≤4 句）。\n" : "This is the final scene. From the player's whole run and the ending conditions below, choose `ending` (an id) and write endingText (≤4 sentences).\n") + (b.endings || []).map(e => e.id + " " + LZ98(e.name) + "：" + e.condition).join("\n") + "\n" + (zh ? "一路的状态：" : "State so far: ") + A.flags.slice(-30).join("，") : "") +
    '\n\nReply with ONLY JSON: {"narration":"...","speakers":[{"id":"...","intent":"..."}],"options":["...","...","..."],"player_obs":"","state":"","summary":"one line: what the player did","ending":null,"endingText":""} in ' + LANG98() + ".";
  return ask(p, { maxTokens: 900 });
}
/* ---------- a character agent ---------- */
async function actor98(th, cid, intent) {
  const w = wd(th.wid), b = bOf98(w), x = ch(cid), k = cardOf98(w, cid) || {}, cd = th.b98.cards[cid] || (th.b98.cards[cid] = { mem: [] }), zh = Z98(), { s } = scene98(th), you = yn98(th);
  const p = (zh ? "你是「" + ((k.name && LZ98(k.name)) || x.n) + "」。你是一个有自己想法的人，不是剧情工具。你只知道自己经历过或被告知的事（见你的记忆）；不知道剧情会怎么走，不知道" + you + "心里在想什么。"
                : "You are " + ((k.name && LZ98(k.name)) || x.n) + ". You're a person with your own mind, not a plot device. You only know what you lived through or were told (your memories); you don't know where the story goes or what " + you + " is thinking.") +
    "\n" + (zh ? "身份：" : "Who you are: ") + LZ98(k.role) + "，" + (k.age ? k.age + (zh ? "岁" : " y/o") : "") + "\n" + (k.bio || "") +
    (k.voice ? "\n" + (zh ? "说话方式：" : "How you talk: ") + k.voice : "") + (k.personality ? "\n" + (zh ? "性格机制：" : "Personality: ") + String(k.personality).slice(0, 600) : "") +
    (k.want ? "\n" + (zh ? "你想要：" : "You want: ") + k.want : "") + (k.fear ? "\n" + (zh ? "你害怕：" : "You fear: ") + k.fear : "") +
    (k.secret ? "\n" + (zh ? "你的秘密（不会轻易说出口）：" : "Your secret (you don't give it away easily): ") + k.secret : "") + (k.boundaries ? "\n" + (zh ? "底线：" : "Boundaries: ") + k.boundaries : "") +
    (k.toward_player ? "\n" + (zh ? "你对" + you + "的初始态度：" : "Your starting attitude toward " + you + ": ") + k.toward_player : "") + (k.hooks ? "\n" + (zh ? "你的吸引点 / 高光行为：" : "What makes you magnetic: ") + String(k.hooks).slice(0, 500) : "") +
    "\n" + (zh ? "你现在对" + you + "的感觉：" : "How you feel about " + you + " now: ") + stage98(th.love[cid] || 0) + "（" + Math.round(th.love[cid] || 0) + "/100）" +
    (cd.mem.length ? "\n" + (zh ? "你的记忆：\n" : "Your memories:\n") + cd.mem.slice(-22).map(m => "- " + m).join("\n") : "") +
    (k.sample_lines && k.sample_lines.length ? "\n" + (zh ? "你说话的样子（参考语气，不要照抄）：" : "How you sound (tone only, don't copy): ") + k.sample_lines.slice(0, 5).map(z => "「" + z + "」").join(" ") : "") +
    "\n" + (zh ? "世界里的规矩：" : "Rules of your world: ") + String(b.world || "").slice(0, 500) +
    "\n\n" + (zh ? "此刻在：" : "You're at: ") + LZ98(s && s.place) + "\n" + (zh ? "眼前：\n" : "Right here:\n") + (tail98(th, 12) || "") +
    "\n\n" + (zh ? "导演的提示（你可以有自己的主意）：" : "Director's note (you may have your own idea): ") + (intent || "") +
    "\n\n" + (zh ? "轮到你。只写你自己：可选的一个动作（第一人称「我…」，≤25 字）和一句台词（≤45 字，像真人说话，符合你的口吻）。不写别人，不写旁白，不替" + you + "决定任何事。feel：这一刻你对" + you + "的感觉变化 -5~5。remember：你会记住的一件事（≤25 字，可空）。"
           : "Your turn. Only yourself: an optional action (first person, ≤15 words) and one line (≤30 words, natural, in your voice). No one else's lines, no narration, never decide anything for " + you + ". feel: change in how you feel about " + you + ", -5..5. remember: one thing you'll remember (≤15 words, may be empty).") +
    '\nReply with ONLY JSON: {"act":"","say":"...","feel":0,"remember":""} in ' + LANG98() + ".";
  return ask(p, { maxTokens: 320 });
}
/* ---------- one beat ---------- */
async function beat98(th, mode, act) {
  const A = th.b98; if (A.ended) return; if (!liveOn()) { toast(L98("这个模式需要 AI 在线", "This mode needs the AI online")); return; }
  if (busy) return; busy = true; typing(true); const before = {}; th.cast.forEach(c => before[c] = th.love[c] || 0);
  try {
    const { s } = scene98(th), pres = present98(th, s);
    let d = null; try { d = await director98(th, mode, act); } catch (_) {}
    if (!d) { toast(L98("剧情智能体走神了，再试一次", "The story agent lost the thread — try again")); return; }
    if (d.narration) appendMsg(th, { who: "n", k: "act", txt: String(d.narration).slice(0, 320), at: Date.now() });
    if (act && act.mode !== "think") mem98(th, pres.length ? pres : th.cast, yn98(th) + (act.mode === "act" ? "：" : L98("说：", " said: ")) + String(act.txt).slice(0, 70));
    let spk = (Array.isArray(d.speakers) ? d.speakers : []).filter(x => x && th.cast.includes(x.id));
    if (act && act.to && th.cast.includes(act.to) && !spk.some(x => x.id === act.to)) spk.unshift({ id: act.to, intent: "" });
    for (const sp of spk.slice(0, mode === "talk" ? 2 : 3)) {
      let r = null; try { r = await actor98(th, sp.id, sp.intent); } catch (_) {} if (!r) continue;
      if (r.act) appendMsg(th, { who: sp.id, k: "act", txt: String(r.act).slice(0, 140), at: Date.now() });
      if (r.say) appendMsg(th, { who: sp.id, k: "say", txt: String(r.say).slice(0, 220), at: Date.now(), ai: 1 });
      const f = Math.max(-5, Math.min(5, +r.feel || 0)); th.love[sp.id] = Math.max(0, Math.min(100, (th.love[sp.id] || 0) + f * 1.6));
      if (r.remember) mem98(th, [sp.id], r.remember);
      if (r.say) mem98(th, (pres.length ? pres : th.cast).filter(c => c !== sp.id), first(ch(sp.id).n) + L98("说：", " said: ") + String(r.say).slice(0, 60));
    }
    A.turns++; th.rounds++;
    if (d.summary) { A.sum.push(L98("第" + A.ch + "章：", "Ch" + A.ch + ": ") + String(d.summary).slice(0, 90)); if (A.sum.length > 48) A.sum.splice(0, A.sum.length - 48); }
    if (d.player_obs) { A.profile.push(String(d.player_obs).slice(0, 60)); if (A.profile.length > 30) A.profile.shift(); }
    if (d.state) A.flags.push(String(d.state).slice(0, 60));
    if (Array.isArray(d.options)) setSugg(d.options.map(String).slice(0, 3));
    useUnits(aiCost() * (mode === "talk" ? 1 : 2));
    const items = []; th.cast.forEach(c => { const dd = Math.round((th.love[c] || 0) - (before[c] || 0)); if (dd) items.push([dd > 0 ? "💗" : "💔", L98(first(ch(c).n) + " 好感", first(ch(c).n) + " affection"), (dd > 0 ? "+" : "") + dd]); });
    if (items.length && typeof chg96 === "function") chg96(items);
    if (d.ending && mode === "exit") { A.ended = true; A.end = String(d.ending); const e = (bOf98(wd(th.wid)).endings || []).find(x => x.id === A.end);
      appendMsg(th, { who: "sys", k: "card", title: "🎬 " + L98("结局", "Ending") + " · " + (e ? LZ98(e.name) : A.end), txt: String(d.endingText || (e && e.text) || "").slice(0, 500), at: Date.now() }); }
    th.at = Date.now(); save();
  } finally { busy = false; typing(false); try { renderChat(); } catch (_) {} }
}
/* ---------- scene flow: enter → talk → (choice) → next ---------- */
async function enter98(th) {
  const { b, c, s } = scene98(th), A = th.b98; if (!s) return; A.phase = "enter";
  if (A.sc === 0) appendMsg(th, { who: "sys", k: "card", title: L98("第 " + A.ch + " 章 · ", "Chapter " + A.ch + " · ") + LZ98(c.title), txt: "", at: Date.now() });
  appendMsg(th, { who: "sys", k: "card", title: "📍 " + LZ98(s.place), txt: "", at: Date.now() });
  const As = OFF94.assets[wd(th.wid).community] || {};
  const bg = As["bg_" + s.id]; if (bg) { const key = "b98:" + s.id; (window.SCENE_FILES = window.SCENE_FILES || {})[key] = bg; th.status.place = LZ98(s.place); A.bg = key; try { sceneBg(th, key); } catch (_) {} }
  if (s.bgm) { A.bgm = "m_" + String(s.bgm).replace(/^m_/, ""); try { if (typeof bgmPlay === "function" && bgmOn()) bgmPlay(A.bgm, th.wid); } catch (_) {} }
  const cg = As["cg_" + s.id]; if (cg) { try { off94Show({ src: cg, cap: s.cg_cap || "" }, false); } catch (_) {} }
  if (s.social && typeof gen96 === "function") gen96(th, s.social).then(m => m && chg96(m)).catch(() => {});
  await beat98(th, "enter", null);
  A.phase = "talk"; save();
  if (s.call && callsOK97(th)) { const cid = byKey98(th, s.call.who); if (ch(cid)) appendMsg(th, { who: "sys", k: "card", title: "📞 " + L98(first(ch(cid).n) + " 来电", first(ch(cid).n) + " is calling"), txt: s.call.situation || "", call98: cid, at: Date.now() }); }
  dock98();
}
async function next98(th) {
  const { b, c, s } = scene98(th), A = th.b98; if (busy || A.ended) return;
  if (s && s.choice && s.choice.options && s.choice.options.length && !(s.id in A.picked)) { A.phase = "choice"; save(); dock98(); return; }
  const lastScene = A.sc >= c.scenes.length - 1, lastCh = A.ch >= b.chapters.length;
  await beat98(th, "exit", null); if (A.ended) { dock98(); return; }
  if (!lastScene) A.sc++;
  else if (!lastCh) { appendMsg(th, { who: "sys", k: "card", title: L98("第 " + A.ch + " 章 · 完", "Chapter " + A.ch + " · end"), txt: "", at: Date.now() });
    const ev = L98("第 " + A.ch + " 章结束，玩家这一章：", "Chapter " + A.ch + " ended. The player: ") + A.sum.slice(-3).join("；"); if (typeof gen96 === "function") gen96(th, ev).then(m => m && chg96(m)).catch(() => {});
    A.ch++; A.sc = 0; }
  else { A.ended = true; save(); dock98(); return; }
  save(); await enter98(th);
}
async function pick98(th, i) {
  const { s } = scene98(th), A = th.b98, o = s && s.choice && s.choice.options[i]; if (!o || busy) return;
  A.picked[s.id] = i; A.flags.push(s.id + ":" + String(o.t).slice(0, 24)); appendMsg(th, { who: "me", k: "act", txt: o.t, at: Date.now() }); A.phase = "talk"; save(); dock98();
  await beat98(th, "choice", { txt: o.t, mode: "act", effect: o.effect }); dock98();
}
/* sending a message in a b98 thread = free talk inside the current scene */
{ const _rp = reply; reply = function (th, ctx, silent) { if (th && th.b98) { if (ctx && (ctx.kind === "user" || ctx.kind === "dir")) return beat98(th, "talk", { txt: ctx.txt, mode: ctx.kind === "dir" ? "act" : (ctx.mode || "say"), to: th.addr && th.cast.includes(th.addr) ? th.addr : null }); return Promise.resolve(); } return _rp.apply(this, arguments); }; }

/* ---------- compact dock: 继续剧情 / scene choices (never a big window) ---------- */
function dock98() {
  const th = S.threads[curT]; const old = $("#dk98"); if (!th || !th.b98) { if (old) old.remove(); return; }
  const comp = $("#s-chat .composer"); if (!comp) return; const A = th.b98, { s } = scene98(th);
  let h = '';
  if (A.ended) h = '<div class="dk98r"><span class="dk98t">🎬 ' + L98("故事完结。可以继续和他们聊天。", "The story is complete. You can keep talking with them.") + '</span></div>';
  else if (A.phase === "choice" && s && s.choice) h = '<div class="dk98q">' + esc(s.choice.q || L98("你怎么做？", "What do you do?")) + '</div><div class="dk98o">' + s.choice.options.map((o, i) => '<button data-b98pick="' + i + '">' + esc(o.t) + '</button>').join("") + '</div><p class="dk98h">' + L98("也可以直接在下面打字说你想怎么做", "Or type what you'd do below") + '</p>';
  else if (A.phase === "talk") h = '<div class="dk98r"><span class="dk98t">💬 ' + L98("自由对话中 · ", "Talking · ") + esc(LZ98(s && s.place)) + '</span><button data-b98next="1">▶ ' + L98("继续剧情", "Continue") + '</button></div>';
  if (old) old.outerHTML = h ? '<div id="dk98">' + h + '</div>' : ''; else if (h) comp.insertAdjacentHTML("beforebegin", '<div id="dk98">' + h + '</div>');
}
{ const _rc = renderChat; renderChat = function () { const r = _rc.apply(this, arguments); try { dock98(); const th = S.threads[curT]; if (th && th.b98 && th.b98.bg && window.SCENE_FILES && !window.SCENE_FILES[th.b98.bg]) { /* bg key lost on reload */ const As = OFF94.assets[(wd(th.wid) || {}).community] || {}; const { s } = scene98(th); if (s && As["bg_" + s.id]) { window.SCENE_FILES[th.b98.bg] = As["bg_" + s.id]; sceneBg(th, th.b98.bg); } } else if (th && th.b98 && th.b98.bg) sceneBg(th, th.b98.bg); } catch (_) {} return r; }; }
document.addEventListener("click", e => { let x; const th = S.threads[curT];
  if (e.target.closest("[data-b98next]")) { if (th && th.b98) next98(th); return; }
  if ((x = e.target.closest("[data-b98pick]"))) { if (th && th.b98) pick98(th, +x.dataset.b98pick); return; }
  if ((x = e.target.closest("[data-call98]"))) { e.stopPropagation(); try { startCall(x.dataset.call98); } catch (_) {} return; }
}, true);
/* a call card gets an answer button */
{ const _mh = msgHTML; msgHTML = function (m, i, th) { const h = _mh.apply(this, arguments); if (m && m.call98) return h.replace(/<\/div>\s*$/, '<button class="btn btn-p btn-sm" style="margin-top:8px" data-call98="' + esc(m.call98) + '">📞 ' + L98("接听", "Answer") + '</button></div>'); return h; }; }
/* free mode needs its world's assets loaded on reopen */
{ const _ot = openThread; openThread = function (id) { const th = S.threads[id]; if (th && th.b98) { const w = wd(th.wid); if (w) { Promise.all([ensure98(w), off94Assets(w.community)]).then(() => { if (curT === id) renderChat(); }); } } return _ot.apply(this, arguments); }; }
/* love type + feed work here too */
{ const _d = done96; done96 = function (th) { if (th && th.b98) return Math.max(0, th.b98.ch - 1 + (th.b98.ended ? 1 : 0)); return _d.apply(this, arguments); }; }
{ const _t = total96; total96 = function (th) { if (th && th.b98) { const b = bOf98(wd(th.wid)); return (b && b.chapters.length) || 12; } return _t.apply(this, arguments); }; }
{ const _l = lp96; lp96 = async function (th) { if (th && th.b98 && !th.pk) { th.pk = { picks: {} }; try { return await _l.apply(this, arguments); } finally { delete th.pk; } } return _l.apply(this, arguments); }; }
{ const _fb = feedBtn96; feedBtn96 = function () { const th = S.threads[curT]; if (th && th.b98 && !$("#fd96b")) { const col = $("#s-chat .rcol"); if (col) { col.insertAdjacentHTML("afterbegin", '<button id="fd96b" class="histbtn" data-fd96="1"><i>🔥</i><small>' + esc(L98("热搜", "Trending")) + '</small><em></em></button>'); feedBadge96(); } return; } return _fb.apply(this, arguments); }; }
/* the old pilot free mode steps aside for works that have a bible */
{ const _ag = agOn97; agOn97 = function (w) { if (w && w.bible98) return false; return _ag.apply(this, arguments); }; }
{ const _co = callsOK97; callsOK97 = function (th) { const w = th && th.wid && wd(th.wid); if (w && w.bible98) return !!w.calls; return _co.apply(this, arguments); }; }

/* ---------- meeting fixes for the script mode (康康 4 / 5 / 6) ---------- */
/* ⑥ reading pace: lines stay on screen longer */
{ const _rm = readMs; readMs = function (m) { return Math.min(9500, Math.round(_rm.apply(this, arguments) * 1.45)); }; }
/* ⑤ no keyword-triggered mini-games inside official stories */
{ const _mm = typeof mgMatch === "function" ? mgMatch : null; if (_mm) mgMatch = function (txt) { const th = S.threads[curT], w = th && wd(th.wid); if (w && w.official76) return null; return _mm.apply(this, arguments); }; }
/* ④ the your-turn dock can fold to one line */
(function () { const st = document.createElement("style"); st.textContent = `
#dk98{flex:none;margin:0;padding:8px 12px 6px;background:rgba(12,11,16,.86);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid rgba(255,255,255,.08)}
#dk98+.composer{border-top:0}
.dk98r{display:flex;align-items:center;gap:10px;padding-right:74px}.dk98t{flex:1;font-size:12.5px;color:#BDB4C7;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dk98r button{flex:none;border:0;border-radius:999px;padding:8px 14px;font-weight:800;font-size:13px;background:linear-gradient(135deg,#F0B77E,#EE6F97);color:#1B1017}
.dk98q{font-size:13.5px;font-weight:700;color:#fff;margin:0 2px 8px}.dk98o{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:6px}.dk98o button{text-align:left;border:1px solid rgba(240,183,126,.5);background:rgba(18,16,26,.85);color:#fff;border-radius:12px;padding:8px 10px;font-size:13px;line-height:1.4}
.dk98h{margin:6px 2px 0;font-size:11px;color:#8A8194}
#pkwrap.dock97.fold97 .pkpanel>*:not(.dk97h){display:none}#pkwrap.dock97.fold97{padding-bottom:10px}.dk97h .fd97{margin-left:auto;background:none;border:0;color:#BDB4C7;font-size:12px}`; document.head.appendChild(st); })();
{ const _pr = packRefresh; packRefresh = function () { const r = _pr.apply(this, arguments); try { const h = $("#pkwrap.dock97 .dk97h"); if (h && !h.querySelector(".fd97")) h.insertAdjacentHTML("beforeend", '<button class="fd97" data-fd97="1">' + (S.fold97 ? "▴ " + L98("展开", "Show") : "▾ " + L98("收起", "Hide")) + '</button>'); const pw = $("#pkwrap"); if (pw) pw.classList.toggle("fold97", !!S.fold97); } catch (_) {} return r; }; }
document.addEventListener("click", e => { if (!e.target.closest("[data-fd97]")) return; S.fold97 = !S.fold97; save(); const th = S.threads[curT]; if (th) packRefresh(th); });
