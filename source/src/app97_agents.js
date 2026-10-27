/* ================= v6.3 · 自由模式（角色智能体）+ 电话开关 =================
   自由模式（先在《王不见王》试点）：
   · 每个角色是一个独立的智能体：自己的角色卡（性格、说话方式、想要什么、秘密）+ 自己的记忆。
     角色只知道自己在场时发生的事；不知道剧情走向，也不知道你心里在想什么。
   · 一个看不见的「导演」：只知道世界设定和「这一章必须发生的几件事」（锚点，取自编剧原剧本的场景），不知道结局。
     它根据你的言行决定下一场戏、谁出场、谁接话，然后把每个角色的「意图」交给角色本人去说。
   · 每一轮：你 → 导演 → 1~3 个角色依次开口（可以互相接话）→ 停下来等你。好感、记忆、结局都由你一路的言行决定。
   · 编剧写好的台词变成角色的「语气参考」，不再照念。场景背景、剧情 CG 跟着锚点出现；热搜、恋爱人格照常可用。
   电话开关：古风 / 奇幻题材不出现电话——顶部 📞 隐藏，剧本里的来电改成普通对话场景（《王冠的最后誓言》默认关闭）。 */
const AG97 = { works: ["w_scmvgzd2sneff0fa38ae"], noCall: ["w_scmvgzcvbef7c6a40707"] };
const Z97 = () => CL() === "zh";
const L97 = (zh, en) => Z97() ? zh : en;

/* ================= 电话开关 ================= */
function callsOK97(th) {
  const w = th && th.wid && wd(th.wid); if (!w) return true;
  if (w.calls === false) return false; if (AG97.noCall.includes(w.community)) return false;
  const tags = (w.tags || []).join(" "); return !/Romantasy|Fae|Fantasy|Historical|Regency|Medieval|Dragon|Royal Court|古风|奇幻/i.test(tags);
}
{ /* 2026-10-27：从「包 renderChat」搬成钩子（批量迁移）。逻辑原样，只是不再包住渲染器。 */
const __body_agents97 = function () { try { const th = S.threads[curT]; if (th && !callsOK97(th)) document.querySelectorAll("#s-chat .callbtn").forEach(b => b.remove()); } catch (_) {} };
if (window.UI && typeof window.UI.add === "function") window.UI.add("agents97", __body_agents97);
else { const _rc = renderChat; renderChat = function () { const r = _rc.apply(this, arguments); __body_agents97(); return r; }; }; }
{ const _sc = startCall; startCall = function (cid) { const th = S.threads[curT]; if (th && !callsOK97(th)) { toast(L97("这个世界没有电话。", "There are no phones in this world.")); return; } return _sc.apply(this, arguments); }; }
/* a scripted call in a no-phone world plays as an ordinary scene */
{ const _sa = stopAuto; stopAuto = function (th, b) {
    if (b && b[1] === "call" && !callsOK97(th)) { const d = b[2] || {}; const out = []; if (d.hint) out.push(["n", "act", Lz(d.hint).replace(/传声铜镜|铜镜|电话|来电/g, L97("夜色", "the night"))]);
      (d.lines || []).forEach(([cid, t]) => out.push([cid, "say", t])); return out; }
    return _sa.apply(this, arguments); }; }

/* ================= 自由模式 ================= */
const CARD97 = {
  "陆识野": { zh: { voice: "话少，句子短，能用动作就不用嘴；从不叫她的名字；被逼急了反而更安静。", want: "让这部电影成为两个人都站得住的作品，而不是谁压谁。", fear: "被说成靠资本压人；在人前失控。", secret: "那块慢十二分钟的旧表，是他刻意不调的。他不会主动解释。" },
             en: { voice: "Few words, short sentences, acts instead of talking; never says her name; gets quieter when pushed.", want: "A film both leads can stand on, not one where somebody wins.", fear: "Being called the one who bought his way to the top; losing control in public.", secret: "He keeps the old watch twelve minutes slow on purpose. He won't explain it unasked." } },
  "方叙": { zh: { voice: "语速快，句句在算账，电话不离手，笑着说狠话。", want: "话题、票房，番位之争对他是流量。", fear: "项目黄掉。", secret: "他给两边团队都留了退路，谁赢他都不亏。" },
           en: { voice: "Fast, always doing the math, phone glued to his ear, says harsh things with a smile.", want: "Buzz and box office; the billing fight is free publicity to him.", fear: "The project collapsing.", secret: "He left both camps a way out; whoever wins, he doesn't lose." } },
  "林小满": { zh: { voice: "急性子、护短，句尾爱带吐槽，紧张时语速更快。", want: "护住你，不让你被欺负，也不让你冲动。", fear: "你在镜头前吃亏。", secret: "她手里有一份对方团队的黑稿，一直压着没用。" },
             en: { voice: "Quick-tempered, fiercely protective, ends sentences with a jab, talks faster when nervous.", want: "To shield you — from them, and from your own temper.", fear: "You getting burned on camera.", secret: "She's sitting on a hit piece about the other team and hasn't used it." } },
  "老周": { zh: { voice: "慢，惜字如金，口头禅是「再来一条」，偶尔一句话点破所有人。", want: "拍出真东西，不管谁在海报上面。", fear: "演员在戏里撒谎。", secret: "他选你们俩，是因为多年前看过一段你们各自的试镜录像。" },
           en: { voice: "Slow, economical, “one more take” is his catchphrase; now and then one line cuts through everyone.", want: "Something true on film, whoever tops the poster.", fear: "Actors lying on camera.", secret: "He cast you both because of two old audition tapes he watched years ago." } },
  "顾母": { zh: { voice: "话不多，关心都藏在唠叨里，总在新闻之后才打电话。", want: "你别受委屈。", fear: "你一个人扛。", secret: "她其实每部戏都看了三遍。" },
           en: { voice: "Says little; her care hides inside nagging; only calls after the news breaks.", want: "For you not to get hurt.", fear: "You carrying everything alone.", secret: "She has watched every one of your films three times." } }
};
function key97(c) { return (c && c.n94 && c.n94.zh) || (c && c.n) || ""; }
function card97(cid) { const c = ch(cid); const k = CARD97[key97(c)]; return k ? (Z97() ? k.zh : k.en) : null; }
function agOn97(w) { return w && (AG97.works.includes(w.community) || w.agent97); }
function yid97(w) { return w && w.you94; }
function anchors97(w, n) {
  const c = w.pack.chapters[n - 1]; if (!c) return [];
  const out = []; let cur = null;
  (c.beats.zh || []).forEach((b, i) => { if (!Array.isArray(b)) return; const en = (c.beats.en || [])[i];
    if (b[0] === "sys" && b[1] === "scene") { cur = { place: (Z97() || !en ? b[2].place : (en[2] || {}).place) || b[2].place || "", img: b[2].img || "", bgm: null, cap: "", idx: out.length + 1 }; out.push(cur); return; }
    if (!cur) return;
    if (b[0] === "sys" && b[1] === "bgm" && !cur.bgm) cur.bgm = (b[2] || {}).m;
    if (b[0] === "sys" && b[1] === "cg94") { cur.cg = b[2].slot; cur.cap = (Z97() || !en ? b[2].cap : (en[2] || {}).cap) || b[2].cap || ""; }
  });
  return out;
}
function voiceRef97(w, n, cid) {
  const c = w.pack.chapters[n - 1]; if (!c) return []; const side = Z97() ? c.beats.zh : (c.beats.en || c.beats.zh);
  return (side || []).filter(b => Array.isArray(b) && b[0] === cid && b[1] === "say" && typeof b[2] === "string").map(b => b[2]).slice(0, 5);
}
function newAgentThread97(wid) {
  const w = wd(wid), now = Date.now(), you = yid97(w);
  const cast = w.cast.filter(c => c !== you && ch(c) && !/^(医院|Hospital)$/.test(key97(ch(c))));
  const th = { id: "a:" + wid + ":" + now, kind: "group", wid, cast, title: Lz(w.title), msgs: [], love: {}, rounds: 0, status: { time: "", place: "", mood: {} }, tasks: {}, mem: [], created: now, at: now,
    setting: "", you: Lz(w.you) || "", agent97: { ch: 1, turns: 0, hit: [], cards: {}, sum: [], ended: false } };
  cast.forEach(c => { loveWrite(th, c, 0, "agent97:init", {absolute:5}); th.agent97.cards[c] = { mem: [] }; });
  th.persona = Object.assign({}, persona()); S.threads[th.id] = th; save(); return th;
}
function youName97(th) { const w = wd(th.wid), y = yid97(w); return (y && ch(y) && first(ch(y).n)) || L97("你", "you"); }
function line97(th, m) {
  const who = m.who === "me" ? youName97(th) : m.who === "n" || m.who === "sys" ? "" : (ch(m.who) ? first(ch(m.who).n) : "");
  if (m.who === "me" && m.k === "think") return ""; /* your thoughts are yours */
  const x = String(m.txt || "").replace(/\s+/g, " ").slice(0, 200); if (!x || m.k === "card" || m.k === "img") return "";
  return who ? who + (m.k === "act" ? L97("（动作）", " (action)") : "") + ": " + x : L97("［场景］", "[scene] ") + x;
}
function tail97(th, n) { return th.msgs.slice(-(n || 18)).map(m => line97(th, m)).filter(Boolean).join("\n"); }
function stageWord97(v) { return v >= 80 ? L97("深深在意", "deeply attached") : v >= 55 ? L97("心动", "drawn in") : v >= 30 ? L97("开始在意", "starting to care") : v >= 12 ? L97("有点好奇", "curious") : L97("戒备 / 不熟", "guarded / strangers"); }

async function director97(th, act) {
  const w = wd(th.wid), A = th.agent97, n = A.ch, tot = w.pack.chapters.length, an = anchors97(w, n), c = w.pack.chapters[n - 1], zh = Z97();
  const castL = th.cast.map(id => { const x = ch(id), k = card97(id); return "- id=" + id + " · " + first(x.n) + "（" + (Lz(x.role) || "") + "）" + (Lz(x.looks) ? "：" + Lz(x.looks).slice(0, 80) : "") + (k ? (zh ? " 想要：" : " Wants: ") + k.want : ""); }).join("\n");
  const anL = an.map(a => a.idx + ". " + a.place + (a.cap ? " — " + a.cap.slice(0, 50) : "") + (A.hit.includes(a.idx) ? (zh ? "（已发生）" : " (done)") : "")).join("\n");
  const rel = th.cast.map(id => first(ch(id).n) + " " + Math.round(th.love[id] || 0) + "/100").join("，");
  const last = n === tot;
  const p = (zh ? "你是互动剧的隐形导演。你不替任何人说话，只安排下一刻：在哪、谁在场、谁开口、他们此刻想干什么。玩家是主角，世界围着玩家的言行转。你不知道结局，也不预设剧情走向；玩家的选择必须真的改变接下来发生的事。"
                : "You are the invisible director of an interactive drama. You never speak for anyone; you only decide the next moment: where, who's present, who speaks, what they want right now. The player is the protagonist and the world turns on what they do. You don't know the ending and don't pre-plan it; the player's choices must genuinely change what happens next.") +
    "\n\n" + (zh ? "故事：" : "Story: ") + Lz(w.title) + " — " + (Lz(w.premise) || "") +
    "\n" + (zh ? "玩家扮演：" : "The player is: ") + youName97(th) + (Lz(w.you) ? "（" + Lz(w.you) + "）" : "") +
    "\n" + (zh ? "角色（只有这些 id 能开口）：\n" : "Cast (only these ids may speak):\n") + castL +
    "\n" + (zh ? "玩家和他们的关系：" : "How they feel about the player: ") + rel +
    "\n\n" + (zh ? "第 " + n + " / " + tot + " 章「" + Lz(c.t) + "」。这一章要发生的几件事（顺序和方式由玩家的言行决定，可以改写细节，但不要跳到后面的章节）：\n"
                  : "Chapter " + n + " / " + tot + " “" + Lz(c.t) + "”. Things that happen this chapter (order and manner follow the player; adapt details, never jump ahead):\n") + anL +
    "\n" + (zh ? "本章已进行 " + A.turns + " 轮。节奏：每 2~4 轮推进到一件新的事；全部发生或超过 20 轮时 chapterDone=true。" : "Turns so far this chapter: " + A.turns + ". Pace: move to a new thing every 2-4 turns; set chapterDone=true when all have happened or after 20 turns.") +
    (A.sum.length ? "\n" + (zh ? "前情（玩家做过的事）：\n" : "Earlier (what the player did):\n") + A.sum.slice(-6).join("\n") : "") +
    "\n\n" + (zh ? "刚才：\n" : "Just now:\n") + (tail97(th, 16) || (zh ? "（故事刚开始）" : "(the story is just starting)")) +
    (act ? "\n\n" + (zh ? "玩家这一轮：" : "The player's move: ") + (act.mode === "think" ? (zh ? "（心里想，角色们不知道）" : "(a private thought — the characters don't know) ") : act.mode === "act" ? (zh ? "（动作）" : "(action) ") : "") + act.txt : "") +
    "\n\n" + (zh ? "规则：绝不替玩家说话、做动作、做决定；角色可以拒绝、可以互相冲突、可以误会；不要让所有人都围着玩家献殷勤；没有电话就不要安排来电。narration 用第二人称写给玩家，最多 2 句，不含对白。options 给玩家 3 个下一步可以做的事（各不超过 14 字，态度不同）。"
           : "Rules: never write the player's words, actions or decisions; characters may refuse, clash and misread each other; not everyone fawns over the player. narration is second person to the player, max 2 sentences, no dialogue. options: 3 different things the player might do next (under 8 words each).") +
    (last ? (zh ? "\n这是最后一章。chapterDone=true 时给出 ending：A=两人并肩（关系好、彼此信任）/ B=各自安好 / C=反目，取决于玩家一路的言行；并写 endingText（3 句以内）。" : "\nThis is the last chapter. When chapterDone=true also give ending: A = side by side / B = apart and okay / C = enemies, earned by the player's whole run, plus endingText (max 3 sentences).") : "") +
    '\n\nReply with ONLY JSON: {"present":["id"],"anchor":2,"narration":"...","speakers":[{"id":"...","intent":"..."}],"options":["...","...","..."],"chapterDone":false,"summary":"one line: what the player did this turn","ending":null,"endingText":""} in ' + (zh ? "Simplified Chinese" : "English") + ".";
  return ask(p, { maxTokens: 900 });
}
async function actor97(th, cid, intent, act) {
  const w = wd(th.wid), A = th.agent97, x = ch(cid), k = card97(cid), cd = A.cards[cid] || (A.cards[cid] = { mem: [] }), zh = Z97();
  const ref = voiceRef97(w, A.ch, cid);
  const p = (zh ? "你是「" + x.n + "」，" + (Lz(x.role) || "") + "。你是一个有自己想法的人，不是剧情的工具。你只知道你亲身经历过的事（下面的记忆）；你不知道剧情会怎么发展，也不知道" + youName97(th) + "心里在想什么。"
                : "You are " + x.n + ", " + (Lz(x.role) || "") + ". You are a person with your own mind, not a plot device. You only know what you lived through (your memories below); you don't know where the story goes or what " + youName97(th) + " is thinking.") +
    "\n" + (zh ? "你是谁：" : "Who you are: ") + (Lz(x.looks) || "") +
    (k ? "\n" + (zh ? "说话方式：" : "How you talk: ") + k.voice + "\n" + (zh ? "你想要：" : "You want: ") + k.want + "\n" + (zh ? "你害怕：" : "You fear: ") + k.fear + "\n" + (zh ? "你的秘密（不会轻易说出口）：" : "Your secret (you don't give it away easily): ") + k.secret : "") +
    "\n" + (zh ? "你对" + youName97(th) + "的感觉：" : "How you feel about " + youName97(th) + ": ") + stageWord97(th.love[cid] || 0) + "（" + Math.round(th.love[cid] || 0) + "/100）" +
    (cd.mem.length ? "\n" + (zh ? "你的记忆：\n" : "Your memories:\n") + cd.mem.slice(-20).map(m => "- " + m).join("\n") : "") +
    (ref.length ? "\n" + (zh ? "你平时说话的样子（参考语气，不要照抄）：\n" : "How you usually sound (tone reference, don't copy):\n") + ref.map(s => "「" + s + "」").join("\n") : "") +
    "\n\n" + (zh ? "眼前：\n" : "Right here:\n") + (tail97(th, 12) || "") +
    "\n\n" + (zh ? "导演的提示（你可以不完全照做，你有自己的主意）：" : "Director's note (you may not follow it exactly; you have your own mind): ") + (intent || "") +
    "\n\n" + (zh ? "现在轮到你。只写你自己：一个可选的动作（第一人称，不超过 25 字）和一句台词（不超过 45 字）。不要替别人说话，不要旁白。feel：这一刻你对" + youName97(th) + "的感觉变化 -5~5。remember：你会记住的一件事（不超过 25 字，可为空）。"
           : "Your turn. Write only yourself: an optional action (first person, under 15 words) and one line (under 30 words). Nobody else's lines, no narration. feel: how this moment changed your feeling toward " + youName97(th) + ", -5..5. remember: one thing you'll remember (under 15 words, may be empty).") +
    '\nReply with ONLY JSON: {"act":"","say":"...","feel":0,"remember":""} in ' + (zh ? "Simplified Chinese" : "English") + ".";
  return ask(p, { maxTokens: 300 });
}
function remember97(th, cids, fact) { if (!fact) return; cids.forEach(c => { const cd = th.agent97.cards[c] || (th.agent97.cards[c] = { mem: [] }); cd.mem.push(String(fact).slice(0, 90)); if (cd.mem.length > 30) cd.mem.splice(0, cd.mem.length - 30); }); }
async function agentTurn97(th, act) {
  const A = th.agent97, w = wd(th.wid); if (!w || A.ended) return;
  if (!liveOn()) { toast(L97("自由模式需要 AI 在线", "Free mode needs the AI to be online")); return; }
  busy = true; typing(true); const before = {}; th.cast.forEach(c => before[c] = th.love[c] || 0);
  try {
    let d = null; try { d = await director97(th, act); } catch (e) { d = null; }
    if (!d) { toast(L97("导演走神了，再说一次试试", "The director lost the thread — try again")); return; }
    const present = (Array.isArray(d.present) ? d.present : []).filter(c => th.cast.includes(c));
    /* the scene moves */
    const an = anchors97(w, A.ch), aIdx = +d.anchor, a = an.find(x => x.idx === aIdx);
    if (a && !A.hit.includes(aIdx)) { A.hit.push(aIdx);
      if (a.img) { th.status.place = a.place; try { sceneBg(th, a.img); } catch (_) {} }
      appendMsg(th, { who: "sys", k: "card", title: "📍 " + a.place, txt: "", at: Date.now() });
      if (a.bgm) { try { if (typeof bgmFollow === "function") bgmFollow({ id: th.id, wid: th.wid, pk: { bgm: a.bgm } }, true); } catch (_) {} }
      if (a.cg) { const As = OFF94.assets[w.community] || {}; const src = As[a.cg]; if (src) { try { off94Show({ src, cap: a.cap }, false); } catch (_) {} const aid = "a" + Date.now(); S.album.unshift({ id: aid, cid: th.cast[0], src, at: Date.now() }); if (S.album.length > 24) S.album.length = 24; appendMsg(th, { who: "n", k: "img", aid, at: Date.now() }); } } }
    if (d.narration) appendMsg(th, { who: "n", k: "act", txt: String(d.narration).slice(0, 300), at: Date.now() });
    /* the player's public move is witnessed by whoever is in the room */
    if (act && act.mode !== "think") remember97(th, present.length ? present : th.cast, youName97(th) + (act.mode === "act" ? "：" : L97("说：", " said: ")) + String(act.txt).slice(0, 60));
    /* characters, one by one — each sees what the one before just said */
    for (const sp of (Array.isArray(d.speakers) ? d.speakers : []).slice(0, 3)) {
      const cid = sp && sp.id; if (!th.cast.includes(cid)) continue;
      let r = null; try { r = await actor97(th, cid, sp.intent, act); } catch (_) { r = null; } if (!r) continue;
      if (r.act) appendMsg(th, { who: cid, k: "act", txt: String(r.act).slice(0, 120), at: Date.now() });
      if (r.say) appendMsg(th, { who: cid, k: "say", txt: String(r.say).slice(0, 200), at: Date.now(), ai: 1 });
      const f = Math.max(-5, Math.min(5, +r.feel || 0)); if (loveAllowed(th, cid)) loveWrite(th, cid, f * 1.6, "agent97:model");
      if (r.remember) remember97(th, [cid], r.remember);
      if (r.say) remember97(th, (present.length ? present : th.cast).filter(c => c !== cid), first(ch(cid).n) + L97("说：", " said: ") + String(r.say).slice(0, 50));
    }
    A.turns++; th.rounds++; if (d.summary) A.sum.push((Z97() ? "第" + A.ch + "章：" : "Ch" + A.ch + ": ") + String(d.summary).slice(0, 80)); if (A.sum.length > 40) A.sum.splice(0, A.sum.length - 40);
    if (Array.isArray(d.options)) setSugg(d.options.map(String).slice(0, 3));
    useUnits(aiCost() * 2);
    /* changes the player can see */
    const items = []; th.cast.forEach(c => { const dd = Math.round((th.love[c] || 0) - (before[c] || 0)); if (dd) items.push([dd > 0 ? "💗" : "💔", L97(first(ch(c).n) + " 好感", first(ch(c).n) + " affection"), (dd > 0 ? "+" : "") + dd]); });
    if (items.length && typeof chg96 === "function") chg96(items);
    /* chapter / ending */
    if (d.chapterDone) {
      const tot = w.pack.chapters.length;
      if (A.ch >= tot) { A.ended = true; const main = th.cast[0], lv = th.love[main] || 0; const e = /^[ABC]$/.test(d.ending) ? d.ending : lv >= 70 ? "A" : lv >= 40 ? "B" : "C";
        appendMsg(th, { who: "sys", k: "card", title: "🎬 " + L97("结局 ", "Ending ") + e, txt: String(d.endingText || "").slice(0, 400), at: Date.now() }); A.end = e; }
      else { appendMsg(th, { who: "sys", k: "card", title: L97("第 " + A.ch + " 章 · 完", "Chapter " + A.ch + " · end"), txt: L97("下一章：", "Next: ") + Lz(w.pack.chapters[A.ch].t), at: Date.now() });
        const ev = L97("第 " + A.ch + " 章结束。玩家这一章：", "Chapter " + A.ch + " ended. What the player did: ") + A.sum.slice(-3).join("；");
        A.ch++; A.turns = 0; A.hit = []; if (typeof gen96 === "function") gen96(th, ev).then(m => m && chg96(m)).catch(() => {}); }
    }
    th.at = Date.now(); save();
  } finally { busy = false; typing(false); try { renderChat(); } catch (_) {} }
}
/* sending in a free-mode thread goes to the director, not the one-shot writer */
{ const _rp = reply; reply = function (th, ctx, silent) { if (th && th.agent97) { if (ctx && ctx.kind === "user") return agentTurn97(th, { txt: ctx.txt, mode: ctx.mode || "say" }); if (ctx && ctx.kind === "dir") return agentTurn97(th, { txt: L97("（导演建议）", "(stage note) ") + ctx.txt, mode: "act" }); return agentTurn97(th, null); } return _rp.apply(this, arguments); }; }
/* love type & feed work in free mode too */
{ const _d = done96; done96 = function (th) { if (th && th.agent97) return Math.max(0, th.agent97.ch - 1 + (th.agent97.ended ? 1 : 0)); return _d.apply(this, arguments); }; }
{ const _l = lp96; lp96 = async function (th) { if (th && th.agent97 && !(th.pk && th.pk.picks)) { th.pk = { picks: {} }; const r = await _l.apply(this, arguments); delete th.pk; return r; } return _l.apply(this, arguments); }; }
{ const _fb = feedBtn96; feedBtn96 = function () { const th = S.threads[curT]; if (th && th.agent97 && !$("#fd96b")) { const col = $("#s-chat .rcol"); if (col) { col.insertAdjacentHTML("afterbegin", '<button id="fd96b" class="histbtn" data-fd96="1"><i>🔥</i><small>' + esc(L97("热搜", "Trending")) + '</small><em></em></button>'); feedBadge96(); } return; } return _fb.apply(this, arguments); }; }

/* entry: the start sheet offers free mode for pilot works */
function startFree97(wid) {
  const ex = Object.values(S.threads).filter(t => t.wid === wid && t.agent97 && !t.agent97.ended).sort((a, b) => b.at - a.at)[0];
  const th = ex || newAgentThread97(wid); closeSheet(); openThread(th.id);
  if (!ex) { appendMsg(th, { who: "sys", k: "card", title: "🎭 " + L97("自由模式", "Free mode"), txt: L97("每个角色都有自己的想法和记忆，不知道剧情会怎么走。你说什么、做什么，世界就怎么变。", "Every character has their own mind and memory and doesn't know where this goes. What you say and do changes the world."), at: Date.now() });
    setTimeout(() => agentTurn97(th, null), 300); }
}
{ const _ss = startSheet; startSheet = function (wid) { const r = _ss.apply(this, arguments);
    try { const w = wd(wid), st = document.querySelector(".sheet .stack"); if (agOn97(w) && st && !st.querySelector("[data-free97]")) {
      const ex = Object.values(S.threads).some(t => t.wid === wid && t.agent97 && !t.agent97.ended);
      st.insertAdjacentHTML("afterbegin", '<button class="opt fr97" data-free97="' + esc(wid) + '"><span class="ic">🎭</span><span class="grow"><b>' + (ex ? L97("继续自由模式", "Continue free mode") : L97("自由模式（测试版）", "Free mode (beta)")) + '</b><span>' + L97("角色各有想法、不知道剧情，故事围着你的选择走", "Characters have their own minds and don't know the plot — the story follows you") + '</span></span><span class="tg97">' + L97("新", "New") + '</span></button>'); } } catch (_) {}
    return r; }; }
document.addEventListener("click", e => { const x = e.target.closest("[data-free97]"); if (!x) return; e.stopPropagation(); startFree97(x.dataset.free97); }, true);
(function () { const st = document.createElement("style"); st.textContent = `.fr97{border-color:rgba(238,111,151,.55)!important;background:linear-gradient(135deg,rgba(238,111,151,.16),rgba(240,183,126,.08))!important}.tg97{font-size:10px;font-weight:800;padding:2px 7px;border-radius:999px;background:#EE6F97;color:#1B1017}`; document.head.appendChild(st); })();

/* ================= v6.3.1 · old copies after a story update =================
   When a published story is updated, the app rebuilds it under a new id. Threads started on the old copy pointed at a world that
   no longer exists — no backgrounds, no music, and the role list fell back to 「导演视角」. Now: remember old → new, and opening an
   old thread sends you to the new copy's start sheet (free-mode threads are carried over, characters matched by name). */
{ const _iw = installWork; installWork = async function (id) {
    const old = S.off76 && S.off76[id] && S.off76[id].wid; const wid = await _iw.apply(this, arguments);
    try { if (old && wid && old !== wid) { S.wmap97 = S.wmap97 || {}; S.wmap97[old] = wid; save(); } } catch (_) {} return wid; }; }
function newWid97(wid) { let w = wid, n = 0; const M = S.wmap97 || {}; while (M[w] && n++ < 10) w = M[w]; return w !== wid && wd(w) ? w : null; }
function carryAgent97(th, nw) {
  const w = wd(nw), byName = {}; w.cast.forEach(c => { const x = ch(c); if (x) byName[key97(x)] = c; });
  const map = {}; th.cast.forEach(c => { const x = ch(c); const n = x && byName[key97(x)]; if (n) map[c] = n; });
  const sw = id => map[id] || id;
  th.wid = nw; th.cast = th.cast.map(sw); const L = {}; Object.keys(th.love).forEach(k => L[sw(k)] = th.love[k]); th.love = L;
  const C = {}; Object.keys(th.agent97.cards).forEach(k => C[sw(k)] = th.agent97.cards[k]); th.agent97.cards = C;
  th.msgs.forEach(m => { if (map[m.who]) m.who = map[m.who]; }); save();
}
{ const _ot = openThread; openThread = function (id) {
    const th = S.threads[id];
    if (th && th.wid && !wd(th.wid)) { const nw = newWid97(th.wid);
      if (nw && th.agent97) { carryAgent97(th, nw); return _ot.apply(this, arguments); }
      if (nw) { delete S.threads[id]; save(); toast(L97("这部剧更新了新版本，请重新选择怎么玩", "This story was updated — pick how you want to play")); try { startSheet(nw); } catch (_) {} return; }
      delete S.threads[id]; save(); toast(L97("这部剧已更新，请从故事页重新开始", "This story was updated — start again from its page")); return; }
    return _ot.apply(this, arguments); }; }
/* free mode right on the story page, next to 开始故事 */
{ const _os = openStory; openStory = function (id) { const r = _os.apply(this, arguments);
    try { const w = wd(id), b = document.querySelector('#s-story [data-pkstart]'); if (agOn97(w) && b && !document.querySelector('#s-story [data-free97]'))
      b.insertAdjacentHTML("beforebegin", '<button class="btn btn-block fr97b" data-free97="' + esc(id) + '">🎭 ' + L97("自由模式（测试版）· 角色各有想法，剧情围着你走", "Free mode (beta) · the story follows you") + '</button>'); } catch (_) {}
    return r; }; }
(function () { const st = document.createElement("style"); st.textContent = `.fr97b{margin:0 0 8px;border:1px solid rgba(238,111,151,.6);background:linear-gradient(135deg,rgba(238,111,151,.22),rgba(240,183,126,.12));color:#fff;font-weight:700;font-size:13.5px}`; document.head.appendChild(st); })();
/* the lead first, director's view last — so nobody lands in 导演视角 by accident */
{ const _pm = packModes; packModes = function (w) { const L = _pm.apply(this, arguments); if (!w || !w.official76) return L; const watch = L.filter(m => m.as === "watch"); return L.filter(m => m.as !== "watch").concat(watch); }; }
