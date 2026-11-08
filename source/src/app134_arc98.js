/* ================= 故事卡升级 · 台阶、戏点和感官层（2026-11-07）=================
   方案：《MIRU 故事卡全面升级方案》https://claude.ai/artifact/2LZ1xeJsbrJqbZPvevM1r9
   用户：剧本还是按章节写也照收，但整个运行逻辑按新方案走。所以这里不另起一套引擎：
   · 一章 = 一级台阶。导演看得到整条升级路线（只看标题和目标，不剧透细节），知道下一级往哪升。
   · 只写了【升级台阶】、没写章节的剧本，进来时编译成一级一章（arcNorm98），后面照常跑。
   · 导演每轮挑一个戏点；连续 3 轮没推进，下一轮必须推进（事件、泄密、危机、反转、小游戏）。
   · 秘密、事件、小游戏、换音乐都由导演提议，代码按条件和冷却放行（和特效同一个思路）。
   · 角色按所在台阶演、知道自己怎么看在场的其他人；最后开口的人留一个钩子。
   所有函数都由 app98_story.js 的调用点直接调用，不改写别人的函数。 */

const ARC98 = {
  BEATS: ["试探", "靠近", "打断", "较劲", "危机", "泄密", "反转", "事件", "小游戏", "收束"],
  PUSH: ["危机", "泄密", "反转", "事件", "小游戏"],
  /* 戏点没指定瞬间特效时的默认搭配（id 都在 FXBUS.MOMENT 白名单里，限流照旧） */
  FX: { 靠近: "heartbeat", 较劲: "zoom", 泄密: "spotlight", 危机: "breath_hold", 反转: "shock" },
  /* 导演只说情绪，代码换成曲库里的曲子（app58 BGM100 的 id） */
  MOOD: { 暧昧: "heartbeat_close", 慢热: "slow_burn", 吃醋: "jealousy", 危险: "standoff", 紧张: "interrogation", 冷战: "boardroom",
    秘密: "secret", 悬疑: "clue", 背叛: "betrayal", 告白: "confession", 心碎: "heartbreak", 道歉: "apology", 接吻: "the_kiss",
    枪火: "gunfire", 黑帮: "the_don", 往事: "memory_lane", 日常: "sunday_kitchen", 温柔: "fever_care", 天亮: "dawn", 终章: "finale", 静默: "hush_still" },
  /* 没写小游戏的剧本，导演只能从这几个通用的里挑（按剧情用途），不合适就不选 */
  GAMES: { 推进悬疑: ["find_clue", "code_safe", "order_clue", "quiz_case"], 考验亲密: ["quiz_heart", "quiz_date", "simon_song"],
    暧昧时刻: ["beat_heart", "hold_hand"], 危机: ["hold_hide", "hold_breath", "wire_alarm"], 较劲: ["dice_truth", "dice_bet", "dice_drink"] },
  EVENT_GAP: 8, GAME_GAP: 10, BGM_GAP: 90e3, SECRET_CARD: true
};

/* ---------- 剧本统一：只写了升级台阶的，编译成一级一章 ---------- */
function arcNorm98(b) {
  if (!b || b.arc98done) return b;
  b.arc98done = true;
  const arc = Array.isArray(b.arc) ? b.arc : [];
  if ((!b.chapters || !b.chapters.length) && arc.length) {
    const all = (b.cast || []).map(c => c.key);
    b.chapters = arc.map((st, i) => ({
      n: i + 1, title: st.title || { zh: "第 " + (i + 1) + " 级", en: "Stage " + (i + 1) }, goal: [st.change, st.next && "进入下一级：" + st.next].filter(Boolean).join("；"),
      introduction: st.introduction || (i === 0 && b.opening) || {}, behavior: st.behavior, bgm: st.bgm, game: st.game, events: st.events,
      scenes: [{ id: "st" + String(i + 1).padStart(2, "0"), place: st.place || b.place || { zh: "", en: "" }, present: st.present || all, beat: st.scene || st.change || "",
        actor_payload: st.actor_payload || {}, interaction: st.interaction || { invitation: "", suggestions: [] }, fx: st.ambient ? { ambient: st.ambient } : undefined, highlights: st.highlights }]
    }));
  }
  return b;
}
function arcOn98(th) { return !!(th && th.b98 && bOf98(wd(th.wid))); }
function arcStage98(th) { const { b, c } = scene98(th); return { b, c, n: th.b98.ch, total: (b && b.chapters || []).length }; }

/* ---------- 故事背景卡：卖点、你是谁、你的处境、你藏着的事、故事背景、核心问题 ---------- */
function arcStoryText98(b) {
  const p = b.player || {}, pitch = LZ98(b.pitch), who = LZ98(p.identity || p.role), press = LZ98(p.pressure), hide = LZ98(p.secret), q = LZ98(b.question);
  const rows = [pitch, who && L98("你是谁：", "Who you are: ") + who, press && L98("你的处境：", "Your situation: ") + press, hide && L98("你藏着的事：", "What you hide: ") + hide].filter(Boolean);
  return [rows.join("\n"), LZ98(b.intro), q && L98("核心问题：", "The question: ") + q].filter(Boolean).join("\n\n");
}
const ARC_ROW98 = /^(你是谁|你的处境|你藏着的事|核心问题|Who you are|Your situation|What you hide|The question)[：:]\s*(.*)$/;

/* ---------- 导演：升级路线 + 戏点 + 秘密 / 事件 / 小游戏 / 音乐 ---------- */
function arcRoute98(th, zh) {
  const { b, n } = arcStage98(th), chs = (b && b.chapters) || []; if (chs.length < 2) return "";
  const line = (c, i) => (i + 1 === n ? "▶ " : i + 1 < n ? "✓ " : "· ") + (i + 1) + ". " + LZ98(c.title) + (i + 1 === n || i + 1 === n + 1 ? "：" + String(c.goal || "").slice(0, 70) : "");
  return (zh ? "\n\n升级路线（一章就是一级台阶；只用来判断往哪推，不要提前演后面台阶的事，不要剧透）：\n" : "\n\nEscalation route (one chapter = one stage; use it only to know where to push, never play later stages early or spoil them):\n") +
    chs.map(line).join("\n") + (zh ? "\n现在在第 " + n + " / " + chs.length + " 级：关系和局势只能停在这一级的程度，最多为下一级埋一点伏笔。" : "\nNow at stage " + n + " / " + chs.length + ": keep the relationship at this stage's level, at most seed the next.");
}
function arcStall98(th) { return th.b98.stall98 || 0; }
function arcSecrets98(th) {
  const w = wd(th.wid), b = bOf98(w), A = th.b98, out = [], done = A.secrets98 || {};
  (b.cast || []).forEach(k => (Array.isArray(k.secrets) ? k.secrets : []).forEach((s, i) => {
    const id = k.key + ":" + (s.id || "s" + (i + 1)), cid = byKey98(th, k.key), u = s.unlock || {};
    if (done[id] || !ch(cid)) return;
    out.push({ id, cid, key: k.key, s, ok: (th.love[cid] || 0) >= (+u.love || 0) && A.ch >= (+u.stage || 1) });
  }));
  return out;
}
function arcEvents98(th) {
  const { b, c } = scene98(th), A = th.b98, used = A.events98 || {}, n = A.ch;
  if (A.turns - (A.evAt == null ? -99 : A.evAt) < ARC98.EVENT_GAP) return [];
  if ((A.evCh || {})[n] >= 2) return [];
  const pool = [].concat(c.events || [], (b.events || []).filter(e => { const f = +e.from || 1, t = +e.to || 99; return n >= f && n <= t; }));
  return pool.map((e, i) => Object.assign({ id: e.id || "c" + n + "e" + (i + 1) }, e)).filter(e => !(e.once !== false && used[e.id]));
}
function arcGames98(th, mode) {
  const { b, c, s } = scene98(th), A = th.b98;
  if (b.games_on && s.game && !Array.isArray(s.game) && s.game.outcomes) return null; /* authored receipt flow */
  if (!(mode === "talk" || mode === "more") || !window.MG100 && typeof MG100 === "undefined") return null;
  if (b.games98 === false || (A.gamesCh98 || {})[A.ch]) return null;
  if (A.turns - (A.gameAt == null ? -99 : A.gameAt) < ARC98.GAME_GAP || exch98(th) < 4) return null;
  const authored = [].concat(s.game || [], c.game || []).filter(g => g && g.id);
  if (authored.length) return { authored };
  return { library: ARC98.GAMES };
}
function arcGameOf98(id) { const L = typeof MG100 !== "undefined" ? MG100 : []; const g = String(id || "").replace(/^g_/, ""); return L.find(x => x.id === "g_" + g) || null; }
function arcAsk98(th, mode, act, zh) {
  if (!arcOn98(th) || mode === "exit") return "";
  const stall = arcStall98(th), push = stall >= 3, A = th.b98;
  let p = arcRoute98(th, zh);
  p += zh ? "\n\n戏点：这一轮挑一个 beat（" + ARC98.BEATS.join("、") + "），按它安排谁开口、想干什么。被点名的人先正面回答，不能为了戏点不回应玩家。" +
      "\n- 最后开口的那个人，用一个问题或一个停在半空的动作收尾，给玩家留个钩子。" +
      "\n- new_info：这一轮有没有出现新的信息、新的动作或关系变化（true / false）。" +
      (push ? "\n- 已经连续 " + stall + " 轮原地打转：这一轮 beat 必须是 " + ARC98.PUSH.join("、") + " 之一，真的推一步。" : "")
    : "\n\nBeat: pick one beat this turn (" + ARC98.BEATS.join(", ") + ") and arrange who speaks around it. The addressed person still answers first." +
      "\n- The last speaker ends on a question or a half-finished gesture: leave the player a hook." +
      "\n- new_info: did anything new happen this turn — information, an action, a shift in the relationship (true / false)." +
      (push ? "\n- " + stall + " turns in a row without progress: this beat must be one of " + ARC98.PUSH.join(", ") + "." : "");
  const sec = arcSecrets98(th);
  if (sec.length) {
    const ok = sec.filter(x => x.ok);
    p += zh ? "\n\n秘密（只给标题，内容在角色自己那里）：" + (ok.length ? "\n现在可以放行：" + ok.map(x => x.id + "「" + LZ98(x.s.title || "") + "」（" + first(ch(x.cid).n) + "）").join("；") + "\n剧情真的走到这一步（被逼问、被感动、局势所迫），才在 reveal 里填 id，并把那个人排进 speakers；否则留空。一轮最多一个。" : "") +
        (sec.length - ok.length ? "\n还有 " + (sec.length - ok.length) + " 个秘密没到时候，不要让任何人主动说出来；玩家直接问到，按角色自己的规矩回答。" : "")
      : "\n\nSecrets: " + (ok.length ? "may be revealed now: " + ok.map(x => x.id).join(", ") + ". Put one id in `reveal` only when the story truly gets there, and include that person in speakers." : "") + (sec.length - ok.length ? " " + (sec.length - ok.length) + " more are not due yet." : "");
  }
  const ev = arcEvents98(th);
  if (ev.length && mode !== "enter") p += zh ? "\n\n可以发生的事件（冷场、需要推进或正好合适时才用，填 event = id；发生了就让角色对它作出反应）：\n" + ev.map(e => e.id + "：" + LZ98(e.text) + (e.when ? "（" + e.when + "）" : "")).join("\n")
    : "\n\nEvents you may trigger (`event` = id, only when it fits):\n" + ev.map(e => e.id + ": " + LZ98(e.text)).join("\n");
  const gm = arcGames98(th, mode);
  if (gm) {
    p += zh ? "\n\n小游戏（beat=小游戏 时填 game）：由一个角色当场提出来（比如“敢不敢跟我赌一把”），玩家可以拒绝。告白、哭、吵到最激烈时不出游戏。" +
        (gm.authored ? "\n剧本写好的：" + gm.authored.map(g => g.id + "（" + (g.purpose || "") + "，" + (g.when || "") + "）").join("；") + "\ngame 填 {\"id\":\"…\"}，赌注按剧本写的。" :
          "\n可选（按剧情用途，都不合适就不选）：" + Object.entries(gm.library).map(([k, ids]) => k + "：" + ids.map(i => { const g = arcGameOf98(i); return g ? i + " " + g.zh : ""; }).filter(Boolean).join("、")).join("；") +
          "\ngame 填 {\"id\":\"…\",\"from\":\"提议的角色 id\",\"stakes\":\"这一局赌什么（≤20字）\",\"win\":\"赢了剧情怎么走\",\"lose\":\"输了怎么走（不能是死路，要另有戏）\",\"skip\":\"玩家不玩怎么走\"}。")
      : "\n\nMini-game (when beat = 小游戏): one character proposes it in-scene; the player may decline. Never during a confession, tears or the peak of a fight. game = {\"id\",\"from\",\"stakes\",\"win\",\"lose\",\"skip\"}.";
  }
  if (typeof bgmOn === "function" && bgmOn()) p += zh ? "\n\n音乐：只有升级、事件、危机、泄密、反转或情绪明显转向时，才在 bgm 里填一个情绪（" + Object.keys(ARC98.MOOD).join("、") + "）；平时留空。" : "\n\nMusic: only on an escalation, event, crisis, reveal, twist or clear mood turn, set `bgm` to one mood (" + Object.keys(ARC98.MOOD).join(", ") + "); otherwise null.";
  return p;
}
function arcJson98(th, mode) {
  if (!arcOn98(th) || mode === "exit") return "";
  return '"beat":"","new_info":true,"reveal":null,"event":null,' + (arcGames98(th, mode) ? '"game":null,' : "") + '"bgm":null,';
}

/* ---------- 导演回来以后：把关 + 落地 ---------- */
function arcAfter98(th, d, mode, act) {
  const out = { reveal: null, game: null }; if (!arcOn98(th) || !d || mode === "exit") return out;
  const A = th.b98, beat = ARC98.BEATS.includes(String(d.beat || "").trim()) ? String(d.beat).trim() : "";
  /* 冷场计数：没有新东西、玩家只回了几个字、或者只是点屏幕 */
  const short = act && act.mode !== "think" && String(act.txt || "").replace(/\s/g, "").length < 5;
  if (ARC98.PUSH.includes(beat) || d.event || d.reveal || d.game) A.stall98 = 0;
  else if (d.new_info === false || d.new_info === "false" || short || mode === "more") A.stall98 = (A.stall98 || 0) + 1;
  else A.stall98 = 0;
  A.beat98 = beat;
  /* 默认特效：戏点有搭配、导演又没写瞬间特效 */
  if (beat && ARC98.FX[beat] && !(d.fx && d.fx.moment)) d.fx = Object.assign({}, d.fx || {}, { moment: ARC98.FX[beat] });
  /* 秘密 */
  if (d.reveal) { const x = arcSecrets98(th).find(z => z.id === String(d.reveal).trim() && z.ok); if (x) out.reveal = x; }
  /* 事件 */
  if (d.event && mode !== "enter") {
    const e = arcEvents98(th).find(z => z.id === String(d.event).trim());
    if (e) {
      (A.events98 = A.events98 || {})[e.id] = 1; A.evAt = A.turns; (A.evCh = A.evCh || {})[A.ch] = ((A.evCh || {})[A.ch] || 0) + 1;
      appendMsg(th, { who: "n", k: "act", txt: LZ98(e.text).slice(0, 200), ev98: e.id, at: Date.now() });
      if (e.fx && !(d.fx && d.fx.moment)) d.fx = Object.assign({}, d.fx || {}, { moment: e.fx });
      if (e.bgm) d.bgm = e.bgm;
      mem98(th, here98(th, scene98(th).s), L98("发生了：", "Happened: ") + LZ98(e.text).slice(0, 60));
    }
  }
  /* 小游戏：先记下，等角色把邀请说出口再出卡片 */
  if (d.game && beat === "小游戏") { const gm = arcGames98(th, mode), g = typeof d.game === "string" ? { id: d.game } : d.game, G = g && arcGameOf98(g.id);
    if (gm && G) { const au = gm.authored && gm.authored.find(x => String(x.id).replace(/^g_/, "") === G.id.slice(2));
      if (gm.authored ? au : Object.values(gm.library).some(l => l.includes(G.id.slice(2)))) out.game = Object.assign({}, au || {}, g, { id: G.id, name: L98(G.zh, G.en) }); } }
  /* 音乐 */
  arcBgm98(th, d.bgm, beat || (d.event ? "事件" : ""));
  return out;
}
function arcBgm98(th, mood, beat) {
  if (!mood || typeof bgmPlay !== "function" || typeof bgmOn !== "function" || !bgmOn()) return;
  const A = th.b98, key = ARC98.MOOD[String(mood).trim()] || String(mood).trim().replace(/^m_/, "");
  if (typeof BGM100 !== "undefined" && !BGM100.some(x => x.id === "m_" + key)) return;
  const cue = "m_" + key; if (A.bgm === cue || Date.now() - (A.bgmAt98 || 0) < ARC98.BGM_GAP) return;
  if (!(ARC98.PUSH.includes(beat) || beat === "升级")) return;
  A.bgm = cue; A.bgmAt98 = Date.now();
  /* 泄密、危机、反转：音乐先断掉，安静一下再进新曲 */
  if (["危机", "泄密", "反转"].includes(beat) && typeof bgmStop === "function") { try { bgmStop(true); } catch (e) { console.warn("[arc98]", e); } setTimeout(() => { try { if (bgmOn()) bgmPlay(cue, th.wid); } catch (e) { console.warn("[arc98]", e); } }, 1500); }
  else { try { bgmPlay(cue, th.wid); } catch (e) { console.warn("[arc98]", e); } }
}

/* ---------- 角色：按台阶演、看得见其他人、秘密放行、留钩子、接住小游戏结果 ---------- */
function arcActor98(th, cid, turn, zh) {
  if (!arcOn98(th)) return "";
  const w = wd(th.wid), b = bOf98(w), { c, s } = scene98(th), k = cardOf98(w, cid) || {}, A = th.b98, total = (b.chapters || []).length;
  let p = "";
  const beh = c.behavior && (c.behavior[k.key] || c.behavior[first(ch(cid).n)]);
  if (total > 1) p += zh ? "\n\n你现在在第 " + A.ch + " / " + total + " 级「" + LZ98(c.title) + "」。" + (beh ? "这一级你会这样表现：" + LZ98(beh) : "这一级要发生的变化：" + String(c.goal || "").slice(0, 80)) + "\n按这一级的关系程度演，不要提前到后面才会有的亲密、坦白或决裂。"
    : "\n\nYou're at stage " + A.ch + " / " + total + " “" + LZ98(c.title) + "”. " + (beh ? "At this stage you behave like this: " + LZ98(beh) : "") + " Don't jump ahead to later intimacy, confessions or breaks.";
  const others = here98(th, s).filter(x => x !== cid).map(x => { const ok = cardOf98(w, x) || {}; const t = (k.others && (k.others[ok.key] || k.others[first(ch(x).n)])) || ((b.relations || []).find(r => (r.a === k.key && r.b === ok.key) || (r.b === k.key && r.a === ok.key)) || {}).text; return t ? first(ch(x).n) + "：" + LZ98(t) : ""; }).filter(Boolean);
  if (others.length) p += (zh ? "\n你怎么看在场的其他人：" : "\nHow you see the others here: ") + others.join("；");
  const mine = arcSecrets98(th).filter(x => x.cid === cid);
  if (turn && turn.reveal) p += zh ? "\n这一轮你决定说出一个藏着的事：" + LZ98(turn.reveal.s.text) + (turn.reveal.s.reveal ? "。说出口的样子：" + LZ98(turn.reveal.s.reveal) : "") + "。用你自己的方式说，可以艰难、可以只说一半，但这件事要说出来。" : "\nThis turn you decide to tell: " + LZ98(turn.reveal.s.text);
  else if (mine.length) p += zh ? "\n你还有不想说的事：" + mine.map(x => LZ98(x.s.text)).join("；") + "。现在不主动提；被直接问到，按你的底线回答。" : "\nThings you're not ready to tell: " + mine.map(x => LZ98(x.s.text)).join("; ") + ". Don't volunteer them.";
  if (turn && turn.game) p += zh ? "\n这一轮你当场向玩家提出一个小游戏：" + turn.game.name + (turn.game.stakes ? "，赌注是：" + turn.game.stakes : "") + "。用你的口吻把邀请说出来（比如“敢不敢跟我赌一把”），玩家可以拒绝。" : "\nThis turn you propose a mini-game: " + turn.game.name + ".";
  if (turn && turn.hook) p += zh ? "\n你是这一轮最后开口的人：结尾留一个钩子——一个问题，或者一个停在半空的动作。" : "\nYou speak last this turn: end on a hook — a question or a half-finished gesture.";
  return p;
}

/* ---------- 秘密说出来了 ---------- */
function arcRevealed98(th, x) {
  const A = th.b98; (A.secrets98 = A.secrets98 || {})[x.id] = Date.now();
  const all = (cardOf98(wd(th.wid), x.cid) || {}).secrets || [], n = all.filter((s, i) => A.secrets98[x.key + ":" + (s.id || "s" + (i + 1))]).length;
  mem98(th, here98(th, scene98(th).s), first(ch(x.cid).n) + L98("说出了：", " revealed: ") + LZ98(x.s.text).slice(0, 60));
  arcKeep98(th, first(ch(x.cid).n) + L98("说出了秘密：", " revealed: ") + LZ98(x.s.title || x.s.text));
  appendMsg(th, { who: "sys", k: "card", title: "🔓 " + L98("你知道了" + first(ch(x.cid).n) + "的一个秘密（" + n + "/" + all.length + "）", "You learned one of " + first(ch(x.cid).n) + "'s secrets (" + n + "/" + all.length + ")"), txt: LZ98(x.s.title || ""), sec98: x.id, at: Date.now() });
}

/* ---------- 小游戏：邀请卡 → 游戏 → 结果回到剧情 ---------- */
function arcGameCard98(th, g) {
  const A = th.b98; A.gameAt = A.turns; (A.gamesCh98 = A.gamesCh98 || {})[A.ch] = 1;
  appendMsg(th, { who: "sys", k: "card", title: "🎮 " + g.name, txt: g.stakes ? L98("赌注：", "Stakes: ") + g.stakes : "", game98: { id: g.id, ch: A.ch, sc: A.sc, from: g.from || "", stakes: g.stakes || "", win: g.win || "", lose: g.lose || "", skip: g.skip || "" }, at: Date.now() });
}
function arcGameValid98(th, m) {
  return !!(th && th.b98 && !th.b98.ended && S.threads[curT] === th && !busy && m && th.msgs.includes(m) &&
    m.game98 && !m.game98.done && m.game98.ch === th.b98.ch && m.game98.sc === th.b98.sc);
}
function arcGameHTML98(h, m) {
  if (m.game98.done) return h.replace(/<\/div>\s*$/, '<div class="xs dim" style="margin-top:6px">' + esc({ win: L98("赢了", "Won"), lose: L98("输了", "Lost"), skip: L98("没玩", "Skipped") }[m.game98.done] || "") + "</div></div>");
  return h.replace(/<\/div>\s*$/, '<div style="display:flex;gap:8px;margin-top:8px"><button class="btn btn-p btn-sm" data-game98="' + esc(String(m.at)) + '">' + L98("接受", "Play") + '</button><button class="btn btn-sm" data-game98no="' + esc(String(m.at)) + '">' + L98("不了", "Not now") + "</button></div></div>");
}
function arcGameDone98(th, m, r) {
  if (!arcGameValid98(th, m)) return;
  r = ["win", "lose", "skip"].includes(r) ? r : "skip";
  m.game98.done = r; save();
  const g = m.game98, G = arcGameOf98(g.id), name = G ? L98(G.zh, G.en) : "";
  const txt = r === "win" ? L98("（" + name + "：赢了）", "(" + name + ": won)") : r === "lose" ? L98("（" + name + "：输了）", "(" + name + ": lost)") : L98("（没玩" + name + "）", "(passed on " + name + ")");
  appendMsg(th, { who: "me", k: "act", txt, at: Date.now() }); arcKeep98(th, txt);
  const effect = (r === "win" ? g.win : r === "lose" ? g.lose : g.skip) || (r === "skip" ? L98("玩家没接这一局，提议的人有自己的反应", "The player passed; the proposer reacts") : L98("角色对这个结果作出反应", "Characters react to the result"));
  try { renderChat(); } catch (e) { console.warn("[arc98]", e); }
  beat98(th, "choice", { txt, mode: "act", effect: L98("小游戏结果：", "Mini-game result: ") + effect, to: g.from && ch(g.from) ? g.from : undefined });
}
document.addEventListener("click", e => {
  const x = e.target.closest("[data-game98],[data-game98no]"); if (!x) return;
  e.stopPropagation(); const th = S.threads[curT]; if (!th || !th.b98 || busy) return;
  const at = +(x.dataset.game98 || x.dataset.game98no), m = th.msgs.find(z => z.game98 && z.at === at); if (!arcGameValid98(th, m)) return;
  if (x.dataset.game98no) { arcGameDone98(th, m, "skip"); return; }
  if (typeof mgOpen !== "function") { arcGameDone98(th, m, "skip"); return; }
  mgOpen(m.game98.id, r => arcGameDone98(th, m, r || "skip"));
}, true);

/* ---------- 进入新一级：升级特效 + 这一级的音乐 ---------- */
function arcEnter98(th) {
  const { c, s } = scene98(th), A = th.b98; if (!c || !s || A.sc !== 0) return;
  A.stall98 = 0; A.fast98n = 0;
  if (A.ch > 1 && A.keepCh98 !== A.ch) { A.keepCh98 = A.ch; arcKeep98(th, L98("进入第 " + A.ch + " 级「", "Reached stage " + A.ch + " “") + LZ98(c.title) + L98("」", "”")); }
  if (A.ch > 1 && window.FXBUS && A.arcFx98 !== A.ch) { A.arcFx98 = A.ch; try { setTimeout(() => FXBUS.agent(th, { moment: "cinema" })(), 600); } catch (e) { console.warn("[arc98]", e); } }
  if (!s.bgm && c.bgm) { A.bgmAt98 = 0; arcBgm98(th, c.bgm, "升级"); }
}

/* ================= 长聊天记忆压缩（2026-11-07）=================
   原来导演只看最近 14 条 + 最近 8 句前情，角色记忆只留 36 条，聊上百轮前面的事就忘了。
   现在每 20 轮用一次便宜的调用，把这段对话压成 3～5 句「到目前为止」，同时给每个在场主角压一句「你记得的要点」。
   升级、秘密、小游戏结果这类关键事件单独记在 A.keep98，永远不压缩、不丢。压缩在回复发出去之后后台跑，不拖慢这一轮。 */
ARC98.COMPRESS_EVERY = 20;
const ARC_COMPRESSING98 = new WeakSet();
function arcKeep98(th, fact) { const A = th.b98; if (!fact) return; (A.keep98 = A.keep98 || []).push(String(fact).slice(0, 80)); if (A.keep98.length > 40) A.keep98.splice(0, A.keep98.length - 40); }
function arcRecap98(th, zh) {
  const A = th.b98, keep = (A.keep98 || []).slice(-12), sum = A.sum.slice(A.recap98 ? -4 : -8);
  return (A.recap98 ? "\n" + (zh ? "到目前为止（压缩后的前情）：" : "So far (condensed): ") + A.recap98 : "") +
    (keep.length ? "\n" + (zh ? "一直要记得的事：" : "Always remember: ") + keep.join("；") : "") +
    (sum.length ? "\n" + (zh ? "最近：\n" : "Recently:\n") + sum.join("\n") : "");
}
async function arcCompress98(th) {
  const A = th && th.b98; if (!A || A.ended || ARC_COMPRESSING98.has(th)) return;
  if (A.turns - (A.compAt98 || 0) < ARC98.COMPRESS_EVERY || typeof ask !== "function") return;
  ARC_COMPRESSING98.add(th); const at = A.turns, zh = Z98(), w = wd(th.wid), b = bOf98(w), leads = th.cast.filter(c => { const k = cardOf98(w, c); return k && k.tier === "lead"; });
  try {
    const p = (zh ? "把下面这段互动剧的对话压缩成记忆。只写真的发生过的事，不编。" : "Condense this interactive-drama conversation into memory. Only what really happened.") +
      "\n\n" + (zh ? "之前的记忆：" : "Earlier memory: ") + (A.recap98 || (zh ? "（无）" : "(none)")) +
      "\n" + (zh ? "这一段：\n" : "This stretch:\n") + (tail98(th, 40) || "") +
      "\n\n" + (zh ? "recap：3～5 句，合并之前的记忆和这一段：发生了什么、玩家表现出什么态度、关系变成什么样、还有什么悬着。≤220 字。\nchars：每个主角一句他自己记得的要点（≤40 字），key 用下面的 id：" : "recap: 3-5 sentences merging earlier memory and this stretch. chars: one line per lead of what they remember, keyed by id: ") +
      leads.map(c => c + "=" + first(ch(c).n)).join("，") +
      '\nReply with ONLY JSON: {"recap":"...","chars":{"id":"..."}} in ' + LANG98() + ".";
    const r = await ask(p, { maxTokens: 500 });
    if (r && r.recap && th.b98 === A && !A.ended) {
      A.recap98 = String(r.recap).slice(0, 400); A.compAt98 = at;
      Object.entries(r.chars || {}).forEach(([id, txt]) => { const cd = A.cards[id]; if (!cd || !txt) return;
        const head = cd.mem.length && /初始知道|known from the start/.test(cd.mem[0]) ? [cd.mem[0]] : [];
        const rest = cd.mem.slice(head.length).filter(m => !/^（之前的事）|^\(earlier\)/.test(m)).slice(-12);
        cd.mem = head.concat([L98("（之前的事）", "(earlier) ") + String(txt).slice(0, 80)], rest); });
      save();
    }
  } catch (e) { console.warn("[arc98]", e); } finally { ARC_COMPRESSING98.delete(th); }
}

/* ================= 导演按需调用（2026-11-07）=================
   每轮都先调导演再调角色，一轮 15～17 秒。玩家用「对谁说」点了名、聊得正顺（没冷场）、没有该检查的事时，
   直接让被点名的人回应，不调导演；每跳过 2 轮至少调 1 次，保证升级、秘密、事件、小游戏、音乐照常有人管。
   不跳过的情况：进场 / 选项 / 收束、心声、要照片、想往下走、冷场、该压缩判断的时刻、导演上一轮刚说可以下一章。 */
ARC98.FAST_MAX = 2;
const ARC_NEXT98 = /下一章|下一段|接下来|换个地方|我们走|走吧|结束|next|move on|leave/i;
function arcFast98(th, mode, act) {
  const A = th.b98; if (!arcOn98(th) || S.fast98Off) return null;
  if (mode !== "talk" || !act || !act.to || act.mode === "think" || !ch(act.to)) { A.fast98n = 0; return null; }
  const t = String(act.txt || "");
  if ((A.fast98n || 0) >= ARC98.FAST_MAX || (A.stall98 || 0) >= 2 || PHOTO_ASK98.test(t) || ARC_NEXT98.test(t) || t.replace(/\s/g, "").length < 5) { A.fast98n = 0; return null; }
  const { s } = scene98(th); if (!allowedSpeakers98(th, s).includes(act.to)) { A.fast98n = 0; return null; }
  if (arcEvents98(th).length && (A.stall98 || 0) >= 1) { A.fast98n = 0; return null; }
  A.fast98n = (A.fast98n || 0) + 1;
  return { fast98: 1, narration: "", speakers: [{ id: act.to, intent: "" }], fx: {}, new_info: true, summary: L98("对", "to ") + first(ch(act.to).n) + L98("说：", ": ") + t.slice(0, 40) };
}
