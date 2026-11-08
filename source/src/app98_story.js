/* ================= v7.0 · 故事圣经驱动的自由模式（剧情智能体 + 角色智能体） =================
   作品资料 = 故事圣经（art/official/<作品ID>.bible.json）：世界、风格规则、玩家身份卡（A）、角色卡（B/C）、章节 → 场景锚点、选择、结局条件。
   运行：
   · 剧情智能体（导演）：只读世界、当前章节的场景锚点和玩家行为；负责进场、调度谁开口、给建议行动；不知道后面的章节和结局。
   · 角色智能体：每个角色只读自己的角色卡、自己的记忆（亲历 / 被告知）、眼前发生的事；不知道剧情走向，不知道玩家心里想什么。
   · 每个场景：进场（锚点演出）→ 自由对话（想聊多久聊多久，角色在场景里回应你）→ 聊到位后出现「下一章」按钮 → 你点了才往下走。
     剧情只在你点按钮（或明确打字说要往下走）时推进 —— 不会自己跳走。
   · 电话只在作品设定里真的有电话的场景出现；小游戏默认关闭（版本 1：无玩法），作品资料里 games_on=true 才开启（版本 2）。
   · 玩家身份卡只有客观身份；玩家的性格、喜好由你的发言和选择累积（动态画像），不预设。 */
const B98 = { cache: {}, ids: {} };
const Z98 = () => CL() === "zh";
const L98 = (zh, en) => Z98() ? zh : en;
const LZ98 = o => (o && typeof o === "object") ? ((Z98() ? o.zh : o.en) || o.zh || o.en || "") : String(o || "");
async function bible98(id) {
  if (id in B98.cache) return B98.cache[id];
  let b = null; try { const r = await fetch("art/official/" + encodeURIComponent(id) + ".bible.json?v=" + Math.floor(Date.now() / 3e5)); if (r.ok) b = await r.json(); } catch (_) {}
  if (b && typeof arcNorm98 === "function") arcNorm98(b); /* 只写了升级台阶的剧本，编译成一级一章（app134） */
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
    /* 2026-11-04：和《午夜邀约》一样 —— 只给「扮演 我自己」一个入口，名字等来自你的角色卡（不再在这里填名字、不再列其他可扮演的人） */
    '<div class="stack" style="gap:8px;margin-top:12px">' + opts.filter(o => o.main).slice(0, 1).map(o => '<button class="opt" data-b98go="' + esc(wid) + '|' + esc(o.k) + '"><span class="ic">▶</span><span class="grow"><b>' + L98("扮演 我自己", "Play as me") + '</b><span>' + L98("用你的角色卡（名字、外貌、喜好）进去，他们会把你当成你本人来回应", "Go in with your role card (name, looks, likes) — they'll answer you as you") + '</span></span>›</button>').join("") + '</div>' +
    '<button class="btn btn-g btn-block" data-editp style="margin-top:10px">🪪 ' + L98("我的角色卡：", "My role card: ") + esc((typeof persona === "function" && persona().name) || "—") + L98(" · 编辑", " · edit") + '</button>');
}
function oriL98(o) { return Z98() ? ({ bl: "男男", gl: "女女", bg: "男女" }[o] || "") : ({ bl: "BL · M/M", gl: "GL · F/F", bg: "M/F" }[o] || ""); }
function new98(wid, asKey) {
  const w = wd(wid), b = bOf98(w), now = Date.now(), you = cid98(wid, asKey);
  const cast = w.cast.filter(c => c !== you && ch(c));
  const th = { id: "b:" + wid + ":" + now, kind: "group", wid, cast, title: LZ98(b.title), msgs: [], love: {}, rounds: 0, status: { time: "", place: "", mood: {} }, tasks: {}, mem: [], created: now, at: now, setting: "", you: "",
    b98: { as: asKey, you, ch: 1, sc: 0, phase: "enter", turns: 0, sum: [], cards: {}, flags: [], profile: [], ended: false, picked: {} } };
  cast.forEach(c => { loveWrite(th, c, 0, "story98:init", {absolute:5}); const card = cardOf98(w, c); th.b98.cards[c] = { mem: card && card.knows ? [L98("（初始知道）", "(known from the start) ") + String(card.knows).slice(0, 160)] : [] }; });
  th.persona = Object.assign({}, persona()); S.threads[th.id] = th; save(); return th;
}
document.addEventListener("click", e => { let x;
  if ((x = e.target.closest("[data-b98go]"))) { e.stopPropagation(); const [wid, k] = x.dataset.b98go.split("|"); const nm = String((typeof persona === "function" && persona().name) || "").replace(/[<>"]/g, "").trim().slice(0, 16); S.b98name = nm; const th = new98(wid, k); const bb = bOf98(wd(wid)); if (nm && bb && k === bb.player.key) { th.b98.pname = nm; save(); } closeSheet(); openThread(th.id); setTimeout(() => enter98(th), 300); return; }
  if ((x = e.target.closest("[data-b98open]"))) { e.stopPropagation(); closeSheet(); openThread(x.dataset.b98open); return; }
  if ((x = e.target.closest("[data-newt],[data-pkstart]"))) { const w = wd(x.dataset.newt || x.dataset.pkstart); if (w && w.bible98) { e.preventDefault(); e.stopPropagation(); start98(w.id); } return; }
}, true);
{ const _ss = startSheet; startSheet = function (wid) { const w = wd(wid); if (w && w.bible98) return start98(wid); return _ss.apply(this, arguments); }; }

/* ---------- helpers ---------- */
function scene98(th) { const b = bOf98(wd(th.wid)), c = b && b.chapters[th.b98.ch - 1]; return { b, c, s: c && c.scenes[th.b98.sc] }; }
function byKey98(th, key) { return cid98(th.wid, key); }
function dn98(b) { const n = b && b.player && LZ98(b.player.short || b.player.name); return !n || /你|You/.test(n) ? L98("不填就叫“你”", "leave empty to be “you”") : L98("默认：", "Default: ") + n; }
function yn98(th) { if (th.b98.pname) return th.b98.pname; const c = ch(th.b98.you); const n = c && first(c.n); if (th.b98.as === "heir" || !n || /你|You/.test(n)) { try { const p = persona(); if (p && p.name) return p.name; } catch (_) {} return L98("你", "you"); } return n; }
function gx98(th) { const w = wd(th.wid), b = bOf98(w); const g = (cardOf98(w, th.b98.you) || (b && b.player) || {}).gender; return g === "f" ? L98("（女性，用“她”指代）", " (female — she/her)") : L98("（男性，用“他”指代）", " (male — he/him)"); }
function zhOK98(t) { return !Z98() || /[\u4e00-\u9fff]/.test(String(t || "")); }
function line98(th, m) {
  if (m.ph98 && ch(m.who)) return first(ch(m.who).n) + L98("发来一张照片：", " sent a photo: ") + m.ph98.what + (m.ph98.open ? L98("（玩家已经打开看了）", " (the player opened it)") : L98("（玩家还没打开）", " (not opened yet)"));
  if (m.k === "box" && m.say && ch(m.say.who)) { const nm = first(ch(m.say.who).n), a = (m.parts || []).map(p => p.txt).join(" ").replace(/\s+/g, " ").slice(0, 140); return (a ? nm + L98("（动作）", " (action)") + ": " + a + "\n" : "") + nm + ": " + String(m.say.txt || "").replace(/\s+/g, " ").slice(0, 220); }
  if (m.k === "card" && Array.isArray(m.lines98)) return m.lines98.filter(l => ch(l.who)).map(l => first(ch(l.who).n) + ": " + l.say).join("\n");
  if (m.who === "me" && m.k === "think") return ""; const x = String(m.txt || "").replace(/\s+/g, " ").slice(0, 220); if (!x || m.k === "card" || m.k === "img") return "";
  const who = m.who === "me" ? yn98(th) : m.who === "n" || m.who === "sys" ? "" : (ch(m.who) ? first(ch(m.who).n) : "");
  return who ? who + (m.k === "act" ? L98("（动作）", " (action)") : "") + ": " + x : L98("［场景］", "[scene] ") + x;
}
function tail98(th, n) { return th.msgs.slice(-(n || 16)).map(m => line98(th, m)).filter(Boolean).join("\n"); }
function present98(th, s) { return ((s && s.present) || []).map(k => byKey98(th, k)).filter(c => th.cast.includes(c)); }
/* ---------- 谁真的在场（2026-11-06 玩家：只叫了一个人跟我上楼，下一场另一个人还在）----------
   剧本的「在场人物」是作者的计划；实际站位跟着剧情走：导演每轮报 leave / arrive，离开这一场时报 with_player（谁跟玩家走）。
   进下一场时，剧本安排了、但上一场没跟来的人先不在场，由导演决定要不要、怎么让他出现（arrive 里写一句交代）。 */
/* 老剧本可能没写在场名单，那就全员都算在场（和原来一样） */
function plan98(th, s) { const p = present98(th, s); return p.length || experience98(th) ? p : th.cast.filter(c => c !== th.b98.you); }
function here98(th, s) {
  const h = th.b98.here;
  return s && h && h.scene === s.id ? h.ids.filter(c => th.cast.includes(c)) : plan98(th, s);
}
function setHere98(th, s, ids) { th.b98.here = { scene: s.id, ids: [...new Set(ids)].filter(c => th.cast.includes(c) && c !== th.b98.you) }; }
function arrive98(th, s) {
  const A = th.b98, behind = A.behind98 || [], plan = plan98(th, s);
  A.away98 = plan.filter(c => behind.includes(c));
  setHere98(th, s, plan.filter(c => !behind.includes(c)));
  A.behind98 = null;
}
function names98(ids) { return ids.filter(id => ch(id)).map(id => first(ch(id).n)).join("、"); }
/* 导演报的人员变动：arrive 先生效（来的人这一轮就能开口），leave 等他说完再走 */
function move98(th, s, d, mode) {
  const A = th.b98, ids = here98(th, s).slice(), came = [];
  const idOf = x => String(x && typeof x === "object" ? x.id : x || "");
  /* 没跟着玩家走的人（包括这一场中途离开的）都算留下了 */
  if (mode === "exit") { const go = Array.isArray(d.with_player) ? d.with_player.map(idOf).filter(c => ids.includes(c)) : ids; A.behind98 = th.cast.filter(c => !go.includes(c)); return { came, leave: [] }; }
  (Array.isArray(d.arrive) ? d.arrive : []).forEach(x => { const c = idOf(x); if (th.cast.includes(c) && c !== A.you && !ids.includes(c)) { ids.push(c); came.push({ id: c, how: String((x && x.how) || "").trim().slice(0, 80) }); } });
  if (came.length) { setHere98(th, s, ids); A.away98 = (A.away98 || []).filter(c => !ids.includes(c)); }
  return { came, leave: (Array.isArray(d.leave) ? d.leave : []).map(idOf).filter(c => ids.includes(c)) };
}
function left98(th, s, leave) {
  if (!leave.length) return;
  const A = th.b98, ids = here98(th, s).filter(c => !leave.includes(c));
  setHere98(th, s, ids); A.away98 = [...new Set((A.away98 || []).concat(leave))];
}
function presence98(th, s, zh) {
  const A = th.b98, here = names98(here98(th, s)), away = names98((A.away98 || []).filter(c => !here98(th, s).includes(c)));
  return zh
    ? "\n\n现在真正在玩家身边的人：" + (here || "没有人，玩家是一个人") + "。只有他们能开口、能被旁白写到。" +
      (away ? "\n不在这里的人：" + away + "（剧本安排过，但没有跟着玩家来，或者已经离开）。他们不能说话，也不能被写成在场。只有剧情给出合理的理由（比如过了一段时间自己找过来），才能用 arrive 让他出现，并在 how 里用一句话写出他怎么出现的；没有理由就不要出现。" : "") +
      "\nleave：这一轮有人真的离开了玩家身边（玩家让他先走、他自己走开、玩家只带别人走了）就填他的 id；只是说说、还没走不算。arrive：见上，默认空。"
    : "\n\nWho is actually with the player now: " + (here || "nobody, the player is alone") + ". Only they may speak or appear in narration." +
      (away ? "\nNot here: " + away + " (scripted, but didn't come along or already left). They can't speak or be written as present. Only with a believable reason may you bring one in via `arrive`, with one sentence in `how`." : "") +
      "\nleave: ids of anyone who really left the player this turn. arrive: see above, default empty.";
}
function withAsk98(th, s, zh) {
  return zh ? "\n\nwith_player：玩家要离开这里去下一个地方。根据刚才的对话判断谁跟着玩家一起走：玩家点名只带了谁、谁答应陪着、谁被留下或自己走了。填跟着走的人的 id 数组（一个人都不带就填 []）；对话里没有提到谁跟谁走，就填 null。"
    : "\n\nwith_player: the player is leaving for the next place. From the conversation, who goes along (whom the player chose to bring, who agreed to come, who was left behind)? An array of ids ([] if the player goes alone); null if nobody's coming or going was discussed.";
}
function stage98(v) { return v >= 80 ? L98("深深在意", "deeply attached") : v >= 55 ? L98("心动", "drawn in") : v >= 30 ? L98("开始在意", "starting to care") : v >= 12 ? L98("有点好奇", "curious") : L98("戒备 / 不熟", "guarded / strangers"); }
function mem98(th, cids, fact) { if (!fact) return; cids.forEach(c => { const cd = th.b98.cards[c] || (th.b98.cards[c] = { mem: [] }); cd.mem.push(String(fact).slice(0, 100)); if (cd.mem.length > 36) cd.mem.splice(1, cd.mem.length - 36); }); }
const LANG98 = () => Z98() ? "Simplified Chinese" : "English";


/* Opt-in experience contract. Existing works without schema=1 retain their behavior. */
function experience98(th) {
  const b = th && th.b98 && bOf98(wd(th.wid));
  return b && b.experience && b.experience.schema === 1 ? b.experience : null;
}
/* 2026-11-06 产品级：所有故事圣经进入时都显示故事背景和章节卡（原来只有写了 experience 的作品才有）。
   章节卡缺的时间、眼前的事、导语和开场对白，由开场编剧补写（opening_core.js）：
   剧本里写了就用剧本的；存量作品由 tools/opening-backfill.mjs 写进剧本；都没有才在这里临时生成，并按作品缓存在本机。 */
function introductions98(th) {
  const policy = experience98(th);
  const { b, c, s } = scene98(th), A = th.b98; if (!c || !s) return;
  const seen = A.introductions98 || (A.introductions98 = {});
  // Stable IDs also prevent duplicates when a saved thread is reopened.
  const show = (key, title, txt, extra) => {
    if (!txt || seen[key] || th.msgs.some(m => m.intro98 === key)) return;
    appendMsg(th, Object.assign({who:'sys', k:'card', title, txt, intro98:key, at:Date.now()}, extra));
    seen[key] = true;
  };
  if (policy ? policy.storyIntroduction : LZ98(b.intro)) show('story', L98('故事背景', 'Story background'), typeof arcStoryText98 === 'function' ? arcStoryText98(b) : LZ98(b.intro));
  if ((policy ? policy.chapterIntroduction : true) && A.sc === 0) {
    const key = 'chapter:' + A.ch, fresh = !seen[key];
    const intro = Object.assign({}, openingCache98(th, A.ch), c.introduction || {});
    const lines = openingLines98(th, intro, s);
    if (fresh && lines.length) lines.forEach(l => mem98(th, here98(th, s), first(ch(l.who).n) + L98('说：', ' said: ') + l.say.slice(0, 60)));
    show(key, L98('第 ' + A.ch + ' 章 · ', 'Chapter ' + A.ch + ' · ') + LZ98(c.title), chapterText98(th, intro, s), lines.length ? { lines98: lines } : null);
    /* 剧本的导语写了上一场没跟来的人：先把提到他的句子拿掉，再按实际在场的人重写这一章的开场（只改这一局，不进缓存） */
    if (fresh && awayIn98(th, intro)) opening98(th, A.ch, true);
    else if (!(intro.event && intro.text && lines.length)) opening98(th, A.ch);
  }
  save();
}
function chapterText98(th, intro, s) {
  const people = here98(th, s).map(id => first(ch(id).n)).join('、');
  const event = dropAway98(th, LZ98(intro.event)), text = dropAway98(th, LZ98(intro.text));
  /* 编剧设了环境氛围（比如暴雨），时间、导语里却没写：画面一进章就是暴雨，章节卡要跟着写出来 */
  const c = ((bOf98(wd(th.wid)) || {}).chapters || []).find(x => (x.scenes || []).includes(s)) || {}, amb = ((s.fx || c.fx || {}).ambient) || '';
  const lb = window.FXBUS && amb && amb !== 'none' && FXBUS.label(amb, L98(true, false));
  const seenTxt = [intro.time, intro.event, intro.text, s.place].map(LZ98).join(' ');
  const time = [LZ98(intro.time), lb && !FXBUS.mentioned(amb, seenTxt) ? lb : ''].filter(Boolean).join(' · ');
  return [time && L98('时间：','Time: ') + time, L98('地点：','Place: ') + LZ98(s.place), people && L98('人物：','Present: ') + people,
    event && L98('眼前的事：','Now: ') + event, text].filter(Boolean).join('\n');
}
function openingLines98(th, intro, s) {
  const here = here98(th, s); /* 没跟来的人不在开场对白里说话 */
  return (Array.isArray(intro.lines) ? intro.lines : []).map(l => ({ who: byKey98(th, l.who), say: LZ98(l.say) })).filter(l => l.say && here.includes(l.who)).slice(0, 2);
}
const OPEN98 = { busy: {} };
function openingCacheKey98(th, n) { return 'miru_opening98:' + ((wd(th.wid) || {}).community || th.wid) + ':' + n; }
function openingCache98(th, n) { try { return JSON.parse(localStorage.getItem(openingCacheKey98(th, n)) || 'null') || {}; } catch (e) { return {}; } }
function awayIn98(th, intro) {
  const away = (th.b98.away98 || []).filter(id => ch(id)).map(id => first(ch(id).n));
  return away.length && away.some(nm => (LZ98(intro.text) + LZ98(intro.event)).includes(nm)) ? away : null;
}
function dropAway98(th, txt) {
  const away = (th.b98.away98 || []).filter(id => ch(id)).map(id => first(ch(id).n)); if (!away.length) return txt;
  return (String(txt || '').match(/[^。！？!?]+[。！？!?]?/g) || []).filter(x => !away.some(nm => x.includes(nm))).join('');
}
async function opening98(th, n, fix) {
  const k = th.id + ':' + n + (fix ? ':fix' : ''); if (OPEN98.busy[k] || typeof OPENING_CORE === 'undefined' || !(typeof liveOn === 'function' && liveOn())) return;
  OPEN98.busy[k] = 1;
  try {
    const w = wd(th.wid), b = bOf98(w), c = b.chapters[n - 1], s = c.scenes[0], given = fix ? { time: (c.introduction || {}).time } : Object.assign({}, c.introduction || {});
    const away = fix ? awayIn98(th, c.introduction || {}) || [] : [], keyOf = id => (cardOf98(w, id) || {}).key;
    const o = { title: LZ98(b.title), premise: LZ98(b.premise), world: b.world, playerRole: LZ98((b.player || {}).role),
      cast: b.cast.map(x => ({ key: x.key, name: LZ98(x.short || x.name), role: LZ98(x.role), voice: x.voice, archetype: x.archetype, expression: x.expression, sample: (x.sample_lines || []).slice(0, 2).join(' / ') })),
      prev: b.chapters.slice(Math.max(0, n - 4), n - 1).map(x => LZ98(x.title) + '：' + String(x.goal || '').slice(0, 80)).concat(th.b98.sum.slice(-3)).concat(away.length ? [L98(away.join('、') + '没有跟着玩家来，这一章开头不在场，导语和对白里都不能出现', away.join(', ') + ' did not come along and is not here at the start of this chapter')] : []),
      chapter: { n, title: LZ98(c.title), place: LZ98(s.place), time: LZ98(given.time), goal: c.goal, beat: s.beat, present: fix ? here98(th, s).map(keyOf).filter(Boolean) : s.present || [], given } };
    const r = OPENING_CORE.validate(await ask(OPENING_CORE.prompt(o), { maxTokens: 900 }), o);
    const add = { time: given.time || r.time, event: given.event || r.event, text: given.text || r.text, lines: given.lines && given.lines.length ? given.lines : r.lines };
    if (!fix) try { localStorage.setItem(openingCacheKey98(th, n), JSON.stringify(add)); } catch (e) { console.warn('[opening] cache', e); }
    const m = th.msgs.find(x => x.intro98 === 'chapter:' + n); if (!m) return;
    const lines = openingLines98(th, add, s), had = !fix && Array.isArray(m.lines98) && m.lines98.length;
    m.txt = chapterText98(th, add, s); if (lines.length && !had) { m.lines98 = lines; lines.forEach(l => mem98(th, here98(th, s), first(ch(l.who).n) + L98('说：', ' said: ') + l.say.slice(0, 60))); }
    save(); if (curT === th.id) renderChat();
  } catch (e) { console.warn('[opening] write', e); }
  finally { delete OPEN98.busy[k]; }
}
/* 2026-11-05 玩家：开场和每章导语的版式写死 —— 一个不透明的框，标题 + 时间 / 地点 / 人物 / 眼前的事各占一行，全部左对齐。
   数据还是 m.title + m.txt 两个字符串（旧存档也能显示），这里只负责把它们排进固定结构；
   内容能不能放进这个版式，由 api/_stylecheck.js（node tools/script-style-check.mjs）在上传后检查。 */
const INTRO_ROW98 = /^(时间|地点|人物|眼前的事|Time|Place|Present|Now)\s*[：:]\s*(.*)$/;
function introHTML98(m, i) {
  const attr = ' data-mi="' + i + '"';
  if (m.intro98 === 'story') return '<div class="m-card entry98 entry98-story"' + attr + '><div class="e98-sh">' + esc(m.title || '') + '</div>' +
    String(m.txt || '').split(/\n/).map(x => x.trim()).filter(Boolean).map(x => { const r = typeof ARC_ROW98 !== 'undefined' && x.match(ARC_ROW98); return '<p class="e98-p">' + (r ? '<b>' + esc(r[1]) + '：</b>' + esc(r[2]) : esc(x)) + '</p>'; }).join('') + '</div>';
  const [no, ...rest] = String(m.title || '').split(' · '), rows = [], body = [];
  String(m.txt || '').split('\n').forEach(line => { const r = line.match(INTRO_ROW98); if (r) { if (r[2].trim()) rows.push(r); } else if (line.trim()) body.push(line.trim()); });
  return '<div class="m-card entry98 entry98-ch"' + attr + '><div class="e98-ch"><span>' + esc(no) + '</span><b>' + esc(rest.join(' · ')) + '</b></div>' +
    (rows.length ? '<dl class="e98-m">' + rows.map(r => '<dt>' + esc(r[1]) + '</dt><dd>' + esc(r[2].trim()) + '</dd>').join('') + '</dl>' : '') +
    body.map(x => '<p class="e98-p">' + esc(x) + '</p>').join('') +
    (Array.isArray(m.lines98) && m.lines98.length ? '<div class="e98-say">' + m.lines98.map(l => '<p><b>' + esc(ch(l.who) ? first(ch(l.who).n) : '') + '</b>' + esc(l.say) + '</p>').join('') + '</div>' : '') + '</div>';
}
/* 还没开口时停在开场卡的最上面，读完再往下；一旦聊起来就恢复「跟到最新」 */
window.holdTop98 = function (th) { return !!(th && th.b98 && experience98(th) && !th.msgs.some(m => m.who === 'me' || m.k === 'say' || m.k === 'box')); };
/* 聊天列表上半截有渐隐遮罩（越往上越淡）。开场卡和章节卡要读，进入遮罩区时把遮罩关掉，翻过去再恢复 */
function fade98() {
  const box = document.getElementById('msgs'); if (!box) return;
  const r = box.getBoundingClientRect(), limit = r.top + r.height * 0.62;
  const on = [...box.querySelectorAll('.entry98,.chapter124')].some(c => { const b = c.getBoundingClientRect(); return b.bottom > r.top && b.top < limit; });
  box.classList.toggle('nofade98', on);
}
function entry98() {
  const box = document.getElementById('msgs'); if (!box) return;
  if (!box._fade98) { box._fade98 = 1; let queued = false; box.addEventListener('scroll', () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fade98(); }); }, { passive: true }); }
  fade98();
}
if (window.UI && typeof window.UI.add === 'function') window.UI.add('entry98', entry98);
function actionView98(th, cid, txt) {
  const policy = experience98(th); if (!policy || policy.actionView !== 'thirdPerson') return txt;
  // Only the action field is normalized. Spoken first-person dialogue stays intact.
  const name = first(ch(cid).n);
  return String(txt || '').replace(/^(?:我|他|她)(?!们)/, name).replace(/^I(?=\s)/, name).replace(/^My(?=\s)/, name + "'s");
}
function guidance98(th) {
  const {s} = scene98(th);
  if (experience98(th) && s && s.interaction && Array.isArray(s.interaction.suggestions))
    setSugg(s.interaction.suggestions.slice(0, 3));
}


const CHOICE98 = new WeakMap(); // Never persist an in-flight request into a saved thread.
function experienceState98(th) {
  const state = th.b98.experienceState || (th.b98.experienceState = {romanceMode:'open', focus:'both', choices:[]});
  return state;
}
function experienceContext98(th) {
  if (!experience98(th)) return '';
  const {s} = scene98(th), pending = CHOICE98.get(th);
  const option = pending && pending.scene === s.id && s.choice.options[pending.index];
  const state = Object.assign({}, experienceState98(th), option && option.state);
  return '\n当前互动状态：' + JSON.stringify({romanceMode:state.romanceMode, focus:state.focus}) +
    (state.romanceMode==='friends' ? '\n用户已要求友伴：停止追求、争宠和暧昧，把邀请改成普通陪伴；不能靠换章恢复。' : '\n允许自然试探，不代表已经相爱或同意接触。') +
    '\n当前地点以本章场景为准；接受陪同先确认安排，只有用户点「下一章」按钮才正式转场。只把实际发生的事记成共同经历。' +
    '\n现在真正在场的只有：' + (names98(here98(th,s)) || '玩家一个人') + '。在场的人不能写成没跟过来或仍在上一地点；不在场的人不能出现或开口。' +
    /* 只有作品写了 rainFromChapter 才有这条：《今晚，偏爱失控》第 7 章才下雨 */
    (experience98(th).rainFromChapter && th.b98.ch<experience98(th).rainFromChapter ? '\n雨夜事件尚未发生，不写下雨、雨后或衣服被雨打湿。' : '');
}
function updateSpeaking98(th,act) {
  if (!experience98(th) || !act || act.mode==='think') return;
  const {s}=scene98(th), state=experienceState98(th);
  const quiet=state.quietScene===s.id ? (state.quiet||[]) : [];
  state.quietScene=s.id;
  for (const id of here98(th,s)) {
    const name=first(ch(id).n), position=String(act.txt||'').indexOf(name);
    if(position<0)continue;
    const after=String(act.txt).slice(position+name.length);
    if(/^[，,、\s]*(?:先)?(?:别|不要|不用|不必)(?:再)?(?:抢话|说话|接话|插话)/.test(after)) {
      if(!quiet.includes(id))quiet.push(id);
    } else if(/^[，,、\s]*(?:你(?:先)?说|说说|你觉得|陪我|来回答)/.test(after)) {
      const i=quiet.indexOf(id);if(i>=0)quiet.splice(i,1);
    }
  }
  if(act.to){const i=quiet.indexOf(act.to);if(i>=0)quiet.splice(i,1);}
  state.quiet=quiet;save();
}
function allowedSpeakers98(th,s) {
  const present=here98(th,s),state=experienceState98(th);
  return state.quietScene===s.id ? present.filter(id=>!(state.quiet||[]).includes(id)) : present;
}
function applyChoiceState98(th, option) {
  const state = experienceState98(th), value = option.state || {};
  if (['open','friends'].includes(value.romanceMode)) state.romanceMode=value.romanceMode;
  if (value.focus && (value.focus==='both' || th.cast.includes(byKey98(th,value.focus)))) state.focus=value.focus;
  const {s} = scene98(th);
  if (!state.choices.some(x=>x.scene===s.id)) state.choices.push({chapter:th.b98.ch,scene:s.id,text:String(option.t).slice(0,120)});
  if (state.choices.length>40) state.choices.shift();
  save();
  if (value.ending) finishExperience98(th,value.ending);
}
function finishExperience98(th, id) {
  if (th.b98.ended) return;
  const {b}=scene98(th), ending=(b.endings||[]).find(e=>e.id===id);if(!ending)return;
  th.b98.ended=true;th.b98.end=id;
  appendMsg(th,{who:'sys',k:'card',title:'🎬 '+L98('结局','Ending')+' · '+LZ98(ending.name),txt:LZ98(ending.text),at:Date.now()});
  save();try{renderChat();}catch(_){} dock98();
}
function explicitPreference98(th, text) {
  const x=String(text||'').trim().replace(/[。！!]+$/,'');
  const state=experienceState98(th);
  if (/^(?:我们)?(?:先做朋友|只做朋友|别再追我|不要追我|停止追求|不要调情|先别调情)$/.test(x)) {state.romanceMode='friends';save();}
  if (/^(?:你们|你)?(?:可以继续追我|恢复暧昧|可以调情了)$/.test(x)) {state.romanceMode='open';save();}
}
function matchingChoice98(th, text) {
  const {s}=scene98(th);if(!s||!s.choice||s.id in th.b98.picked)return -1;
  const norm=x=>String(x||'').trim().replace(/^(?:我选(?:择)?|选(?:择)?)\s*[:：]?\s*/,'').replace(/[\s，,。.!！“”"'‘’]/g,'');
  const x=norm(text);
  return s.choice.options.findIndex((o,i)=>norm(o.t)===x||x===String(o.key||String.fromCharCode(65+i)));
}

/* ---------- the story agent (director) ---------- */
async function director98(th, mode, act) {
  const { b, c, s } = scene98(th), A = th.b98, zh = Z98(), w = wd(th.wid);
  const policy = experience98(th);
  const castL = allowedSpeakers98(th, s).map(id => { const k = cardOf98(w, id); return "- id=" + id + " · " + first(ch(id).n) + "（" + LZ98(k && k.role) + "，" + (k ? k.tier : "") + "）"; }).join("\n");
  const sceneL = c.scenes.map((x, i) => (i === A.sc ? "▶ " : (i < A.sc ? "✓ " : "· ")) + (i + 1) + ". " + LZ98(x.place) + (i === A.sc ? "：" + x.beat : "")).join("\n");
  const rel = th.cast.slice(0, 8).map(id => first(ch(id).n) + " " + Math.round(th.love[id] || 0)).join("，");
  const last = A.ch === b.chapters.length && A.sc === c.scenes.length - 1, judging = mode === "talk" || mode === "choice";
  let task = mode === "enter" ? (zh ? "现在进入这一场。写进场旁白（第二人称，≤3 句，交代你在哪、眼前发生什么），并安排在场角色把这一场的锚点演出来（1-3 人依次开口）。" : "Enter this scene now. Write an entrance narration (second person, ≤3 sentences: where you are, what's happening) and have present characters play this scene's anchor (1-3 speak in turn).")
    : mode === "choice" ? (zh ? "玩家刚做出这一场的选择，后果见下。让在场角色真实地回应这个选择（1-2 人），旁白最多 1 句。" : "The player just made this scene's choice; its consequence is below. Have present characters respond for real (1-2), narration at most 1 sentence.")
    : mode === "exit" ? (zh ? "玩家要推进剧情：用 1 句旁白收束这一场（可不写），不要有人再长篇说话；speakers 可为空。" : "The player wants to move on: close this scene in one sentence of narration (or none); speakers may be empty.")
    : (zh ? "这是自由对话：玩家在这一场里和角色相处。不要推进到下一场，不要强行制造事件；让被对话的人或最自然的人回应（1-2 人），角色可以拒绝、沉默、反问。" : "Free talk: the player is spending time in this scene. Don't move to the next scene or force events; let whoever is addressed or most natural respond (1-2); characters may refuse, go quiet, or ask back.");
  if (policy && mode === "talk") task = zh
    ? "先接住用户刚说的内容或情绪，再安排一位角色提出一个当前场景内能参与的小行动；其他在场的人只在有具体新意或被点名时回应。用户明确疲惫、想安静或不想应酬时，默认只安排被点名或最合适的一人回应，不追加选择题。短回复不等于冷淡：降低负担，用具体示范或可选邀请承接。一次最多一个问题；不替用户接受邀请，不因聊天轮数自动转场。"
    : "Respond to the player's words or expressed emotion, then offer one small activity in this scene. Others present add something distinct only when relevant. Keep short replies low-effort; one question at most. Never accept an invitation for the player or change scenes on a timer.";
  if (mode === "more") task = more98(th, zh);
  if (mode === "talk") task += responders98(th, act, zh);
  const p = (zh ? "你是互动剧的剧情智能体（导演）。你不替任何人说话；你只安排这一刻：谁开口、他们此刻想干什么。玩家是主角。你只知道下面列出的这一章，不知道后面的章节和结局。"
                : "You are the story agent (director) of an interactive drama. You never speak for anyone; you arrange this moment: who speaks and what they want right now. The player is the protagonist. You only know this chapter, not later chapters or the ending.") +
    "\n\n" + (zh ? "世界（后台）：\n" : "World (backstage):\n") + String(b.world || "").slice(0, 1600) +
    "\n\n" + (zh ? "规则：\n" : "Rules:\n") + String(b.style || "").slice(0, 1300) +
    "\n\n" + (zh ? "玩家：" : "Player: ") + yn98(th) + gx98(th) + "（" + LZ98((A.as === b.player.key ? b.player : cardOf98(w, A.you) || {}).role) + "）" + (A.profile.length ? (zh ? "；玩家自己表现出的样子：" : "; how the player has shown themselves: ") + A.profile.slice(-6).join("；") : "") +
    "\n" + (zh ? "角色（只有这些 id 能开口）：\n" : "Cast (only these ids may speak):\n") + castL +
    "\n" + (zh ? "他们对玩家的好感：" : "Their feeling toward the player: ") + rel +
    "\n\n" + (zh ? "第 " + A.ch + " / " + b.chapters.length + " 章「" + LZ98(c.title) + "」目标：" : "Chapter " + A.ch + " / " + b.chapters.length + " “" + LZ98(c.title) + "” goal: ") + (c.goal || "") +
    "\n" + (zh ? "本章场景（▶ 当前）：\n" : "Scenes (▶ current):\n") + sceneL +
    "\n" + (zh ? "当前场景在场：" : "Present now: ") + (here98(th, s).map(id => first(ch(id).n) + "(" + id + ")").join("、") || "—") +
    (s.ref_lines && s.ref_lines.length && mode === "enter" ? "\n" + (zh ? "锚点台词（角色可以用，可改写，不必照念）：\n" : "Anchor lines (characters may use or adapt them):\n") + s.ref_lines.map(r => (ch(byKey98(th, r.who)) ? first(ch(byKey98(th, r.who)).n) : r.who) + "：" + r.line).join("\n") : "") +
    (typeof arcRecap98 === "function" ? arcRecap98(th, zh) : (A.sum.length ? "\n" + (zh ? "前情：\n" : "So far:\n") + A.sum.slice(-8).join("\n") : "")) +
    "\n\n" + (zh ? "刚才：\n" : "Just now:\n") + (tail98(th, 14) || (zh ? "（刚开始）" : "(just starting)")) +
    (act ? "\n\n" + (zh ? "玩家这一轮：" : "The player's move: ") + (act.mode === "think" ? (zh ? "（心里想，角色不知道）" : "(private thought — characters don't know) ") : act.mode === "act" ? (zh ? "（动作）" : "(action) ") : "") + act.txt + (act.to ? (zh ? "（对 " : " (to ") + first(ch(act.to).n) + "）" : "") : "") +
    (act && act.effect ? "\n" + (zh ? "这个选择的后果（作者设定）：" : "Consequence of this choice (by design): ") + act.effect : "") +
    experienceContext98(th) + authoredDirector98(th,s) + (window.FXBUS ? FXBUS.envLine(th, zh) : "") +
    (policy && s.interaction ? "\n当前可玩的桥段（邀请不是已完成）：" + JSON.stringify(s.interaction) : "") +
    (policy && mode === "enter" ? "\n故事背景和本章导语已由界面显示，旁白不要重述背景；直接从眼前的小事件开始。" : "") +
    "\n\n" + (zh ? "任务：" : "Task: ") + task +
    "\n" + (zh ? "旁白只写画面和动作，绝不包含任何人说的话（旁白里不能出现引号和对白）；自由对话和选择后的旁白最多 1 句，收束旁白最多 1 句。人名一律用上面角色表里的中文名。所有文字用简体中文（专有名词可保留英文）。" : "Narration is only what can be seen — never anyone's spoken words (no quotes or dialogue in narration); in talk/choice/exit modes at most one sentence. ") + (zh ? "绝不替玩家说话、做动作、做决定；" + (policy && policy.focus === "player" ? "主角们的本场注意力围绕用户的最新表达，各有自己的方式；不互聊支线，不强迫争宠，不要求用户安抚；" : "不让所有人都围着玩家转；") + "不安排剧本没有的电话；不剧透后面的事。options：玩家下一步可以说或做的 3 件事（各不超过 14 字，态度不同）。player_obs：玩家这一轮明确表现出的偏好或态度（没有就空）。state：本轮按作者规则的状态变化（如 Ember +2），没有就空。"
           : "Never write the player's words, actions or decisions; " + (policy && policy.focus === "player" ? "the leads focus on the player in distinct ways, without side conversations or demanding reassurance;" : "not everyone revolves around the player;") + " no calls the script doesn't have; no spoilers. options: 3 different things the player could say or do next (under 8 words). player_obs: a preference or attitude the player clearly showed this turn (or empty). state: state changes per the author's rules (e.g. Ember +2), or empty.") +
    (last && mode === "exit" ? "\n" + (zh ? "这是全书最后一场。根据玩家一路的言行和下面的结局条件，选出结局 ending（填结局 id）并写 endingText（≤4 句）。\n" : "This is the final scene. From the player's whole run and the ending conditions below, choose `ending` (an id) and write endingText (≤4 sentences).\n") + (b.endings || []).map(e => e.id + " " + LZ98(e.name) + "：" + e.condition).join("\n") + "\n" + (zh ? "一路的状态：" : "State so far: ") + A.flags.slice(-30).join("，") : "") +
    heat98(th, zh, "director") + (senseOK98(th, mode) ? senseAsk98(th, zh) : "") +
    (mode === "exit" ? withAsk98(th, s, zh) : presence98(th, s, zh)) +
    (mode === "talk" || mode === "more" ? photoAsk98(th, act, zh) : "") +
    (judging ? gateAsk98(th) : "") +
    (window.FXBUS ? FXBUS.promptBlock(th, zh) : "") + (typeof arcAsk98 === "function" ? arcAsk98(th, mode, act, zh) : "") + stagedAsk98(th, s, zh) + redo98(zh) +
    '\n\nReply with ONLY JSON: {"narration":"...","speakers":[{"id":"...","intent":"...","why":""}],"options":["...","...","..."],"player_obs":"","state":"","fx":{"ambient":null,"moment":null},"bg":null,' +
    (mode === "exit" ? '"with_player":null,' : '"leave":[],"arrive":[],') + (mode === "talk" || mode === "more" ? '"photo":null,' : '') +
    (judging ? '"ready":true or false,"wants_next":true or false,' : '') + (senseOK98(th, mode) ? '"sense":"",' : '') + (typeof arcJson98 === "function" ? arcJson98(th, mode) : '') + (s.game && !Array.isArray(s.game) && s.game.outcomes ? '"game":false,' : '') + '"summary":"one line: what the player did","ending":null,"endingText":""} in ' + LANG98() + ".";
  return ask(p, { maxTokens: 900 });
}
/* ---------- a character agent ---------- */
async function actor98(th, cid, intent, turn) {
  turn = turn || {};
  const w = wd(th.wid), b = bOf98(w), x = ch(cid), k = cardOf98(w, cid) || {}, cd = th.b98.cards[cid] || (th.b98.cards[cid] = { mem: [] }), zh = Z98(), { s } = scene98(th), you = yn98(th);
  const policy = experience98(th);
  const ownPayload = policy && s && s.actor_payload && s.actor_payload[k.key];
  const pending = CHOICE98.get(th), picked = pending && pending.scene === s.id && s.choice.options[pending.index];
  const choicePayload = policy && picked && picked.actor_payload && picked.actor_payload[k.key];
  const p = (zh ? "你是「" + ((k.name && LZ98(k.name)) || x.n) + "」。你是一个有自己想法的人，不是剧情工具。你只知道自己经历过或被告知的事（见你的记忆）；不知道剧情会怎么走，不知道" + you + "心里在想什么。"
                : "You are " + ((k.name && LZ98(k.name)) || x.n) + ". You're a person with your own mind, not a plot device. You only know what you lived through or were told (your memories); you don't know where the story goes or what " + you + " is thinking.") +
    "\n" + (zh ? "身份：" : "Who you are: ") + LZ98(k.role) + "，" + (k.age ? k.age + (zh ? "岁" : " y/o") : "") + "\n" + (k.bio || "") +
    (policy ? "\n你本人是" + (k.gender === "f" ? "女性" : "男性") + "。act只写你自己的动作，主语用角色姓名或省略，不用我、他、她；玩家的性别不是你的性别。" : "") +
    (k.voice ? "\n" + (zh ? "说话方式：" : "How you talk: ") + k.voice : "") + (k.personality ? "\n" + (zh ? "性格机制：" : "Personality: ") + String(k.personality).slice(0, 600) : "") +
    (k.want ? "\n" + (zh ? "你想要：" : "You want: ") + k.want : "") + (k.fear ? "\n" + (zh ? "你害怕：" : "You fear: ") + k.fear : "") +
    ((!k.unlockableSecrets || (k.unlockableSecrets||[]).some(x=>th.b98.ch>=x.from&&(th.love[cid]||0)>=x.minLove)) && k.secret ? "\n" + (zh ? "你的秘密（不会轻易说出口）：" : "Your secret (you don't give it away easily): ") + k.secret : "") + (k.boundaries ? "\n" + (zh ? "底线：" : "Boundaries: ") + k.boundaries : "") +
    (k.toward_player ? "\n" + (zh ? "你对" + you + "的初始态度：" : "Your starting attitude toward " + you + ": ") + k.toward_player : "") + (k.hooks ? "\n" + (zh ? "你的吸引点 / 高光行为：" : "What makes you magnetic: ") + String(k.hooks).slice(0, 500) : "") +
    persona98(k, you, zh) + authoredActor98(th,cid,k) +
    /* 2026-11-06 玩家：回复像客服。原来好感低于 12 时写的是「保持礼貌关照」，等于让角色客气；现在初见也按人设主动，只有玩家拒绝时才收住 */
    "\n" + (zh ? "你现在对" + you + "的感觉：" : "How you feel about " + you + " now: ") + (policy && (th.love[cid] || 0) < 12 ? L98("刚认识，但你已经被吸引了；按你的人设去靠近，不用客气。玩家拒绝或想做朋友就收住", "you just met, but you're already drawn in; approach in your own way, no politeness act. If the player declines or wants friendship, pull back") : stage98(th.love[cid] || 0)) + "（" + Math.round(th.love[cid] || 0) + "/100）" +
    (cd.mem.length ? "\n" + (zh ? "你的记忆：\n" : "Your memories:\n") + cd.mem.slice(-22).map(m => "- " + m).join("\n") : "") +
    (k.sample_lines && k.sample_lines.length ? "\n" + (zh ? "你说话的样子（参考语气，不要照抄）：" : "How you sound (tone only, don't copy): ") + k.sample_lines.slice(0, 5).map(z => "「" + z + "」").join(" ") : "") +
    "\n" + (zh ? "世界里的规矩：" : "Rules of your world: ") + String(b.world || "").slice(0, 500) +
    (policy ? "\n陪伴与表现规则：" + LZ98(policy.companionRules) + experienceContext98(th) : "") +
    (window.FXBUS ? FXBUS.envLine(th, zh) : "") +
    (ownPayload ? "\n只给你的本场任务：" + LZ98(ownPayload) : "") +
    (choicePayload ? "\n用户本次选择，只给你的回应任务：" + LZ98(choicePayload) : "") +
    (policy && s && s.interaction ? "\n眼前可参与的事（没有用户选择就尚未发生）：" + LZ98(s.interaction.invitation) : "") +
    "\n\n" + (zh ? "此刻在：" : "You're at: ") + LZ98(s && s.place) + "\n" + (zh ? "眼前：\n" : "Right here:\n") + (tail98(th, 12) || "") +
    "\n\n" + (zh ? "导演的提示（你可以有自己的主意）：" : "Director's note (you may have your own idea): ") + (intent || "") +
    stance98(th, cid, turn, you, zh) + feeling98(zh) + heat98(th, zh, "actor") + photoSay98(turn, zh) + (typeof arcActor98 === "function" ? arcActor98(th, cid, turn, zh) : "") +
    (policy ? "\n本轮硬约束：你此刻就在" + LZ98(s.place) + "，身边只有" + (names98(here98(th, s).filter(c => c !== cid)) || "玩家") + "和玩家。不能把自己或用户写到吧台、门外等新地点，不能说在场人没跟过来，也不能和不在场的人说话。这里只回应或提出邀请，不完成跨场移动。动作只写你自己的眼前动作。" + experienceContext98(th) : "") +
    redo98(zh) +
    "\n\n" + (zh ? "（" + you + gx98(th) + "）台词必须用简体中文——不管参考台词是什么语言；只有人名、地名、专有名词可以保留英文。不要重复你刚说过的话。" : "(" + you + gx98(th) + ") Speak English. Don't repeat what you just said. ") + (zh ? "轮到你。只写你自己：可选的一个动作（" + (policy ? "用第三人称姓名或省略主语，不用‘我抬手／我靠近’；只写有意义、眼前可见的动作，没有就空" : "第一人称「我…」") + "，≤25 字）和一句台词（≤45 字，像真人说话，符合你的口吻）。不写别人，不写旁白，不替" + you + "决定任何事。feel：这一刻你对" + you + "的感觉变化 -5~5。remember：你会记住的一件事（≤25 字，可空）。"
           : "Your turn. Only yourself: an optional action (" + (policy ? "third person or no subject, visible meaningful gesture only, otherwise empty" : "first person") + ", ≤15 words) and one line (≤30 words, natural, in your voice). No one else's lines, no narration, never decide anything for " + you + ". feel: change in how you feel about " + you + ", -5..5. remember: one thing you'll remember (≤15 words, may be empty).") +
    '\nReply with ONLY JSON: {"act":"","say":"...","feel":0,"remember":""} in ' + LANG98() + ".";
  return ask(p, { maxTokens: 320 });
}
/* ---------- 玩家的感官反应（2026-11-07 用户拍板放开）----------
   旁白原来一律不写玩家；现在允许导演另给一句「不由自主的身体反应」：心跳、呼吸、脸发烫、没有往后退。
   不能写玩家说的话、能选择的动作、决定和感情结论。剧本 experience.playerSenses=true 才打开（先在黑港试）。
   频率由代码管：进场那一刻可以写；其余至少隔 3 轮才再问导演要一句。 */
function senses98(th) { const b = bOf98(wd(th.wid)); return !!(b && ((b.experience || {}).playerSenses || b.playerSenses)); }
function senseOK98(th, mode) { if (!senses98(th) || S.senses98Off) return false; const A = th.b98; return mode === "enter" || (mode !== "exit" && A.turns - (A.senseAt == null ? -99 : A.senseAt) >= 3); }
function senseAsk98(th, zh) {
  return zh ? "\n\nsense（可空）：写一句玩家此刻不由自主的身体反应或感知，第二人称，≤30 字，只在这一刻真的被触动时才写（靠近、对视、被说中、危险逼近、秘密揭开），普通的一轮就留空。" +
      "\n- 可以写：心跳、呼吸、脸发烫、手指收紧、闻到或注意到什么、某个没发生的动作（“你没有往后退”）。" +
      "\n- 不能写：玩家说的话、玩家主动做的动作（“你抱住他”）、玩家的决定（“你决定相信他”）、感情结论（“你爱上了他”）。" +
      "\n- 方向要和玩家自己表现出的样子一致：玩家冷淡、抗拒或不喜欢这个人时，只写紧张、警惕、不自在这类反应，不写心动。"
    : "\n\nsense (may be empty): one involuntary bodily reaction or perception of the player right now, second person, under 20 words, only when this moment truly lands (closeness, eye contact, being seen through, danger, a secret revealed); leave empty on an ordinary turn." +
      "\n- Allowed: heartbeat, breath, flushed face, fingers tightening, noticing a scent or a look, a non-action (\"you don't step back\")." +
      "\n- Never: the player's words, chosen actions (\"you hug him\"), decisions or emotional conclusions." +
      "\n- Match how the player has shown themselves: if they're cold, resistant or dislike this person, only tension, wariness or unease — never attraction.";
}
function senseClean98(v) {
  const x = String(v || "").trim(); if (!x || /[「」“”"]/.test(x)) return ""; /* 带引号就是台词，不要 */
  if (/你(?:说|问|回答|喊|决定|选择|答应|拒绝|伸手|抱|吻|亲|走向|站起|转身离开)|你(?:爱上|喜欢上)了|\byou (?:say|said|ask|decide|choose|hug|kiss|reach|walk|fall in love)/i.test(x)) return "";
  return x.slice(0, 60);
}
/* ---------- one beat ---------- */
async function beat98(th, mode, act) {
  const A = th.b98; if (A.ended) return; if (!liveOn()) { toast(L98("这个模式需要 AI 在线", "This mode needs the AI online")); return; }
  if (busy) return; busy = true; if (act && window.EXPERIENCE124) EXPERIENCE124.positions.delete(th.id); typing(true); if (experience98(th)) dock98(); const before = {}; th.cast.forEach(c => before[c] = th.love[c] || 0);
  try {
    const { s } = scene98(th), pres = here98(th, s), start = th.msgs.length;
    /* 重新生成要的「这一轮之前」：玩家那句已经在列表里，从这里往后都是这一轮的回复（app73 的 rg73 会回到这里重跑） */
    const redo = typeof REDO73 !== "undefined" && REDO73, pre = (mode === "talk" || mode === "more") && !redo && typeof snap73 === "function" ? snap73(th) : null;
    updateSpeaking98(th,act);
    const declinedAuthoredGame98 = authoredDecline98(th,act);
    let d = typeof arcFast98 === "function" ? arcFast98(th, mode, act) : null; /* 点名且聊得顺时不调导演（app134） */
    if (!d) try { d = await director98(th, mode, act); } catch (e) { console.warn("[story98] director", e); }
    if (!d) { toast(L98("剧情智能体走神了，再试一次", "The story agent lost the thread — try again")); return; }
    if (d.narration) { const n0 = String(d.narration).trim(); }
    if (act && act.mode !== "think") mem98(th, pres, yn98(th) + (act.mode === "act" ? "：" : L98("说：", " said: ")) + String(act.txt).slice(0, 70));
    const policy = experience98(th);
    if (!d.photo && mode === "talk" && act && act.mode !== "think" && PHOTO_ASK98.test(String(act.txt || ""))) d.photo = await photoOnly98(th, act);
    const mv = move98(th, s, d, mode);
    mv.came.forEach(x => appendMsg(th, { who: "n", k: "act", txt: x.how || L98(first(ch(x.id).n) + "走了过来。", first(ch(x.id).n) + " joins you."), at: Date.now() }));
    const arc98 = typeof arcAfter98 === "function" ? arcAfter98(th, d, mode, act) : {}; /* 戏点、秘密、事件、小游戏、音乐（app134） */
    let spk = (Array.isArray(d.speakers) ? d.speakers : []).filter(x => x && allowedSpeakers98(th, s).includes(x.id)); if (policy) spk = spk.filter((x,i,all) => all.findIndex(y => y.id === x.id) === i); if (mode === "exit") spk = policy ? [] : spk.slice(0, 1);
    if (policy && act && /累|想安静|不想应酬/.test(String(act.txt||"")) && !/你们都|两个人都/.test(String(act.txt||""))) spk = spk.slice(0,1);
    let nar = policy ? "" : String(d.narration || "").trim(); if (mode !== "enter" && /[「」“”"]/.test(nar)) nar = nar.split(/[「“"]/)[0].trim(); if (mode !== "enter" && nar.length > 140) nar = nar.slice(0, nar.search(/[。！？.!?]/) + 1 || 140);
    if (nar) appendMsg(th, { who: "n", k: "act", txt: nar.slice(0, 320), at: Date.now() });
    if (act && act.to && allowedSpeakers98(th, s).includes(act.to) && !spk.some(x => x.id === act.to)) spk.unshift({ id: act.to, intent: "" });
    if (mode === "talk" || mode === "more") spk = pickSpeakers98(th, act, spk);
    if (arc98.reveal && !spk.some(x => x.id === arc98.reveal.cid) && allowedSpeakers98(th, s).includes(arc98.reveal.cid)) spk.unshift({ id: arc98.reveal.cid, intent: "" });
    if (arc98.game && !spk.some(x => x.id === arc98.game.from)) arc98.game.from = spk[0] ? spk[0].id : "";
    const ph = photoPlan98(th, d, mode, spk);
    let delivered98 = 0; const fx98a = window.FXBUS ? FXBUS.agent(th, d.fx) : () => {};
    const fx98 = () => { fx98a(); highlight98(th, d.bg); d.bg = null; };
    const spk98 = spk.slice(0, mode === "talk" || mode === "more" ? 2 : 3);
    for (const sp of spk98) {
      const turn98 = { role: sp.role || "main", why: sp.why || "", think: !!(act && act.mode === "think"), to: act && act.to, more: mode === "more", photo: ph && ph.from === sp.id ? ph : null,
        reveal: arc98.reveal && arc98.reveal.cid === sp.id ? arc98.reveal : null, game: arc98.game && arc98.game.from === sp.id ? arc98.game : null, hook: mode !== "exit" && sp === spk98[spk98.length - 1] };
      let r = null; try { r = await actor98(th, sp.id, sp.intent, turn98); if (r && r.say && !zhOK98(r.say)) { const r2 = await actor98(th, sp.id, (sp.intent || "") + L98("（这次务必用简体中文说）", ""), turn98); if (r2 && r2.say) r = r2; } } catch (_) {}
      if (!r && turn98.photo) r = { say: ph.cap };
      if (!r) continue;
      r.act = String(r.act || "").trim(); r.say = String(r.say || "").trim(); if (!r.act && !r.say && turn98.photo) r.say = ph.cap; if (!r.act && !r.say) continue;
      delivered98++;
      /* 2026-11-04 玩家：「为什么要分开」—— 和《午夜邀约》一样，同一个人的动作 + 台词放进同一个框（k:box：上面动作、下面台词） */
      const act98 = r.act ? actionView98(th, sp.id, r.act).slice(0, 140) : "", say98 = r.say ? String(r.say).slice(0, 220) : "";
      if (act98 && say98) appendMsg(th, { who: "n", k: "box", pk: 1, parts: [{ who: sp.id, k: "act", txt: act98 }], txt: act98, last: say98, lastWho: sp.id, say: { who: sp.id, txt: say98 }, at: Date.now(), ai: 1 });
      else if (act98) appendMsg(th, { who: sp.id, k: "act", txt: act98, at: Date.now() });
      else if (say98) appendMsg(th, { who: sp.id, k: "say", txt: say98, at: Date.now(), ai: 1 });
      if (turn98.photo) photoSend98(th, ph);
      if (turn98.reveal) { arcRevealed98(th, turn98.reveal); arc98.reveal = null; }
      fx98();
      const f = Math.max(declinedAuthoredGame98 ? 0 : -5, Math.min(5, +r.feel || 0)); if (loveAllowed(th, sp.id)) loveWrite(th, sp.id, f * 1.6, "story98:model");
      if (r.remember) mem98(th, [sp.id], r.remember);
      if (r.say) mem98(th, here98(th, s).filter(c => c !== sp.id), first(ch(sp.id).n) + L98("说：", " said: ") + String(r.say).slice(0, 60));
    }
    if (arc98.game && delivered98) arcGameCard98(th, arc98.game);
    if (policy && mode === "choice" && !delivered98) { toast(L98("角色回复未完成，选择尚未提交，可以重试", "The character response failed; the choice was not submitted. Try again.")); return false; }
    if (senseOK98(th, mode)) { const sn = senseClean98(d.sense); if (sn) { appendMsg(th, { who: "n", k: "act", txt: sn, sense98: 1, at: Date.now() }); A.senseAt = A.turns; } }
    left98(th, s, mv.leave);
    fx98(); A.turns++; th.rounds++; A.more98n = mode === "more" ? (A.more98n || 0) + 1 : 0;
    if (mode === "talk" || mode === "choice") gate98(th, d);
    if (d.summary) { A.sum.push(L98("第" + A.ch + "章：", "Ch" + A.ch + ": ") + String(d.summary).slice(0, 90)); if (A.sum.length > 48) A.sum.splice(0, A.sum.length - 48); }
    if (d.player_obs) { A.profile.push(String(d.player_obs).slice(0, 60)); if (A.profile.length > 30) A.profile.shift(); }
    if (d.state) A.flags.push(String(d.state).slice(0, 60));
    if (s.game && d.game === true) (A.gameReady98 || (A.gameReady98 = {}))[s.id] = true;
    if (Array.isArray(d.options)) setSugg(d.options.map(String).slice(0, 3));
    useUnits(aiCost() * (mode === "talk" || mode === "more" ? 1 : 2));
    const items = []; th.cast.forEach(c => { const dd = Math.round((th.love[c] || 0) - (before[c] || 0)); if (dd) items.push([dd > 0 ? "💗" : "💔", L98(first(ch(c).n) + " 好感", first(ch(c).n) + " affection"), (dd > 0 ? "+" : "") + dd]); });
    if (items.length && typeof chg96 === "function") chg96(items);
    if (d.ending && mode === "exit") { A.ended = true; A.end = String(d.ending); const e = (bOf98(wd(th.wid)).endings || []).find(x => x.id === A.end);
      appendMsg(th, { who: "sys", k: "card", title: "🎬 " + L98("结局", "Ending") + " · " + (e ? LZ98(e.name) : A.end), txt: String(d.endingText || (e && e.text) || "").slice(0, 500), at: Date.now() }); }
    turn98(th, start, pre, mode, act);
    th.at = Date.now(); save();
    if (typeof arcCompress98 === "function") setTimeout(() => arcCompress98(th), 0); /* 每 20 轮压缩一次记忆，后台跑 */
    return true;
  } finally { busy = false; typing(false); try { renderChat(); } catch (_) {} }
}
/* ---------- scene flow: enter → talk → (choice) → next ---------- */
async function enter98(th) {
  const { b, c, s } = scene98(th), A = th.b98; if (!s) return; A.phase = "enter";
  arrive98(th, s);
  introductions98(th);
  /* 章节卡里已经有「地点」一行；一章里换场时才补一张地点卡 */
  if (A.sc > 0) appendMsg(th, { who: "sys", k: "card", title: "📍 " + LZ98(s.place), txt: "", at: Date.now() });
  const As = OFF94.assets[wd(th.wid).community] || {};
  const bg = As["bg_" + s.id]; if (bg) { const key = "b98:" + s.id; (window.SCENE_FILES = window.SCENE_FILES || {})[key] = bg; th.status.place = LZ98(s.place); A.bg = key; A.bgHl = null; try { sceneBg(th, key); } catch (_) {} }
  preload98(th, s, As);
 if (window.FXBUS) FXBUS.authored(th, s.fx || (A.sc === 0 && c.fx));
  if (typeof arcEnter98 === "function") arcEnter98(th); /* 新一级：升级特效 + 这一级的音乐 */
  if (s.bgm) { A.bgm = "m_" + String(s.bgm).replace(/^m_/, ""); try { if (typeof bgmPlay === "function" && bgmOn()) bgmPlay(A.bgm, th.wid); } catch (_) {} }
  const cg = As["cg_" + s.id]; if (cg) { try { off94Show({ src: cg, cap: s.cg_cap || "" }, false); } catch (_) {} }
  if (s.social && typeof gen96 === "function") gen96(th, s.social).then(m => m && chg96(m)).catch(() => {});
  guidance98(th); try { renderChat(); } catch (_) {}
  await beat98(th, "enter", null);
  A.phase = "talk"; save();
  if (s.call && callsOK97(th)) { const cid = byKey98(th, s.call.who); if (ch(cid)) appendMsg(th, { who: "sys", k: "card", title: "📞 " + L98(first(ch(cid).n) + " 来电", first(ch(cid).n) + " is calling"), txt: "", call98: cid, at: Date.now() }); }
  dock98();
}
async function next98(th) {
  const { b, c, s } = scene98(th), A = th.b98; if (busy || A.ended) return;
  if (!(experience98(th) && experience98(th).allowFreeContinue) && s && s.choice && s.choice.options && s.choice.options.length && !(s.id in A.picked)) { A.phase = "choice"; save(); dock98(); return; }
  const lastScene = A.sc >= c.scenes.length - 1, lastCh = A.ch >= b.chapters.length, ready98 = A.ready98;
  A.ready98 = null; dock98(); /* 收掉按钮，防止连点 */
  const exited98 = await beat98(th, "exit", null); if (experience98(th) && !exited98) { A.ready98 = ready98; dock98(); return; } if (A.ended) { dock98(); return; }
  if (!lastScene) A.sc++;
  else if (!lastCh) { appendMsg(th, { who: "sys", k: "card", title: L98("第 " + A.ch + " 章 · 完", "Chapter " + A.ch + " · end"), txt: "", at: Date.now() });
    const ev = L98("第 " + A.ch + " 章结束，玩家这一章：", "Chapter " + A.ch + " ended. The player: ") + A.sum.slice(-3).join("；"); if (typeof gen96 === "function") gen96(th, ev).then(m => m && chg96(m)).catch(() => {});
    A.ch++; A.sc = 0; }
  else { A.ended = true; save(); dock98(); return; }
  save(); await enter98(th);
}
async function pick98(th, i, echoed) {
  const { s } = scene98(th), A = th.b98, o = s && s.choice && s.choice.options[i]; if (!o || busy || A.ended) return;
  const policy = experience98(th);
  if (policy && s.id in A.picked) return;
  if (policy && o.state && o.state.ending === 'leave') {
    if (!echoed) appendMsg(th,{who:'me',k:'act',txt:o.t,at:Date.now()});
    A.picked[s.id]=i;applyChoiceState98(th,o);return;
  }
  if (policy && typeof aiGate === 'function' && !aiGate()) return;
  if (policy && !liveOn()) { toast(L98("AI 暂未连接，选择尚未提交，可以稍后重试", "AI is offline; the choice was not submitted. Try again later.")); return; }
  if (!policy) { A.picked[s.id] = i; A.flags.push(s.id + ":" + String(o.t).slice(0, 24)); }
  if (!echoed) appendMsg(th, { who: "me", k: "act", txt: o.t, at: Date.now() }); A.phase = "talk"; save(); dock98();
  if (policy) CHOICE98.set(th,{scene:s.id,index:i});
  let ok;
  try { ok = await beat98(th, "choice", { txt: o.t, mode: "act", effect: o.effect }); }
  finally { CHOICE98.delete(th); }
  if (policy && ok) { A.picked[s.id] = i; A.flags.push(s.id + ":" + String(o.t).slice(0, 24)); applyChoiceState98(th,o); save(); }
  /* 没有固定开场的老作品每场都要选一次，选完这一场就算演到位；《今晚，偏爱失控》这类作者写明「选完当前章继续」的，仍按轮数和智能体判断 */
  if (!policy) { A.ready98 = A.ch + ":" + A.sc; save(); }
  dock98();
}
/* 2026-11-05 玩家：「第一章聊了两句就到第二章了」—— 选完选项 2.5 秒、或聊满 2 句就自动换章，这条路去掉了。
   现在换章只有两种触发：点「下一章」按钮，或者明确打字说「下一章」。按钮什么时候出现（gate98）：
   · 剧情智能体判断这一场演到位（ready），且聊够了作者定的最少轮数（experience.pacing.minExchanges）；
   · 玩家明确说想往下走（wants_next），不看轮数；
   · 聊满目标轮数（targetExchanges）还没等到 ready，也给按钮，免得卡住 —— 给了也可以不点，接着聊。
   没写 pacing 的老作品：一章一场的按 6 / 12 轮，一章多场的是场景级推进，按 2 / 6 轮。 */
function pacing98(th) {
  const { c } = scene98(th), p = (experience98(th) || {}).pacing || {}, one = !c || c.scenes.length <= 1;
  return { min: +p.minExchanges || (one ? 6 : 2), target: +p.targetExchanges || (one ? 12 : 6) };
}
function gate98(th, d) {
  const A = th.b98, at = A.ch + ":" + A.sc; if (A.tkAt !== at) { A.tkAt = at; A.tkN = 0; } A.tkN++;
  const yes = v => v === true || v === "true", { min, target } = pacing98(th);
  if (A.ready98 !== at && (yes(d && d.wants_next) || (yes(d && d.ready) && A.tkN >= min) || A.tkN >= target)) A.ready98 = at;
}
/* 模型默认很保守（剧本里又写着「玩家可无限继续」），混在规则里问它几乎永远答 false。
   所以单独问，并讲明这只是一个可以不点的按钮、告诉它已经聊了几轮（2026-11-05 用线上模型逐句试出来的写法）。 */
function gateAsk98(th) {
  const A = th.b98, at = A.ch + ":" + A.sc, n = (A.tkAt === at ? A.tkN || 0 : 0) + 1, { min } = pacing98(th);
  return Z98() ? "\n\n最后单独判断两件事，写进 ready 和 wants_next。它们只是给界面的信号：玩家会看到一个可以不点的小按钮，剧情不会因此前进，角色照常回应，所以不用保守。" +
    "\n- wants_next：只看玩家这一轮说的话。玩家表示想换地方、想走、想往下、想看接下来发生什么（如“换个地方吧”“我们走吧”“接下来呢”“下一段”）就是 true；只是问别人想不想走、或还在聊当前话题就是 false。" +
    "\n- ready：本章已聊 " + n + " 轮，作者建议至少 " + min + " 轮。对照上面的本章目标：目标的核心已经在对话里发生，并且玩家这一轮没有抛出新问题（表态、收下、总结、一句“挺好的”都算话题告一段落）就是 true；玩家刚问了新问题、话题还开着就是 false。"
    : "\n\nFinally, judge two things separately for `ready` and `wants_next`. They are only UI signals: the player sees a small optional button, the story does not move and characters respond as usual, so don't be conservative." +
    "\n- wants_next: look only at the player's latest words. True if they want to go elsewhere, leave, move on, or see what happens next; false if they only ask someone else whether they want to leave, or are still on the current topic." +
    "\n- ready: this chapter has run " + n + " exchanges; the author suggests at least " + min + ". True if the core of the chapter goal has happened in the conversation and the player didn't open a new question this turn (a statement, acceptance, summing up, or a simple \"that's nice\" all count as winding down); false if they just asked something new.";
}
/* ---------- 编剧写的带条件特效和高光图 ----------
   导演只负责判断「条件是否真的发生」；高光图不按好感数值或轮数换，否则画面和正在聊的内容会对不上。
   《今晚，偏爱失控》早期的高光图记在 authorArtwork 里，这里一并认。 */
function highlights98(s) {
  if (!s) return [];
  if (Array.isArray(s.highlights)) return s.highlights;
  const old = s.authorArtwork && s.authorArtwork.conditional;
  return Array.isArray(old) ? old.map(x => ({ id: x.id, name: x.moment || "", when: x.trigger || "" })) : [];
}
function stagedAsk98(th, s, zh) {
  const A = th.b98, seen = A.hlSeen || {}, As = (OFF94.assets[wd(th.wid).community] || {});
  const hl = highlights98(s).filter(h => h.when && As[h.id] && !seen[h.id]);
  const fx = (s && s.fxPlan && s.fxPlan.moments) || [];
  return (fx.length ? (zh ? "\n本场预留的特效。只有玩家或角色这一轮的言行已经满足括号里的条件才选它，默认不选；只是闲聊、提到、可能发生都不算：" : "\nEffects reserved for this scene. Choose one only if what the player or a character did this turn already meets the condition in brackets; by default choose none. Small talk, mentions and possibilities don't count: ") + fx.map(m => m.id + "（" + m.when + "）").join(zh ? "；" : "; ") : "") +
    (hl.length ? (zh ? "\n\nbg：要不要切换背景图，默认 null。下面的条件这一刻真的发生了才填对应的 id；只是聊到、可能发生、还没发生都填 null：" : "\n\nbg: whether to switch the background, default null. Fill an id only if its condition has really happened at this moment: ") + hl.map(h => h.id + "（" + h.when + "）").join(zh ? "；" : "; ") : "");
}
function highlight98(th, id) {
  if (!id) return false;
  const { s } = scene98(th), A = th.b98, As = OFF94.assets[wd(th.wid).community] || {};
  const h = highlights98(s).find(x => x.id === id); A.hlSeen = A.hlSeen || {};
  if (!h || !As[id] || A.hlSeen[id]) return false;
  A.hlSeen[id] = 1;
  const key = "b98:" + id; (window.SCENE_FILES = window.SCENE_FILES || {})[key] = As[id];
  A.bg = key; A.bgHl = id; save();
  /* 先把图解码好再换，慢网时不出现空背景；失败就留在原图 */
  const img = new Image(); img.src = As[id];
  const go = () => { try { if (curT === th.id && A.bgHl === id) sceneBg(th, key); } catch (e) { console.warn("[b98] highlight", e); } };
  if (img.decode) img.decode().then(go).catch(e => { console.warn("[b98] highlight decode", e); }); else img.addEventListener("load", go, { once: true });
  return true;
}
/* 提前加载本场的高光图和下一场的主场景图，切换时不用等 */
function preload98(th, s, As) {
  try {
    const { b } = scene98(th), A = th.b98, c = b.chapters[A.ch - 1], next = c.scenes[A.sc + 1] || (b.chapters[A.ch] && b.chapters[A.ch].scenes[0]);
    const urls = highlights98(s).map(h => As[h.id]).concat(next ? [As["bg_" + next.id]] : []).filter(Boolean).slice(0, 3);
    urls.forEach(u => { const i = new Image(); i.src = u; });
  } catch (e) { console.warn("[b98] preload", e); }
}
/* ---------- 谁来回应（2026-11-06 玩家：每说一句所有主角都回，「对谁说」也没联动）----------
   导演按情境选人；程序再兜底：被点名的人一定先回答；默认一人；第二个人必须写明为什么插话，并且不能连续两轮都两个人说；心声最多一人。 */
function responders98(th, act, zh) {
  const to = act && act.to && ch(act.to) ? first(ch(act.to).n) : "", think = act && act.mode === "think";
  return zh
    ? "\n\n谁来回应（按情境选，不是每个人都要说话）：" +
      (to ? "\n- 玩家这句是对" + to + "说的：speakers 第一个必须是" + to + "，由他正面回答。" : "\n- 选此刻最该接话的那一个人：被提到的、被动作碰到的、和这件事最有关的。") +
      "\n- 默认只安排一个人。另一个人只有真的另有立场时才加一句：想附和加码、想唱反调、想趁机争取、吃醋，或有对玩家有用的补充。这时在他的 why 里写清理由，没有理由就不要加。" +
      "\n- 两个人都说时，第二个人可以冲着玩家，也可以回敬第一个人，但不能重复第一个人的意思。" +
      (think ? "\n- 这一轮是玩家的心声，在场的人听不到。最多安排一个人，只能对玩家看得见的表情或沉默有反应，不能回应心声的内容；也可以没人开口。" : "") +
      "\n- 不要连续几轮都是两个人说话。"
    : "\n\nWho responds (by situation; not everyone speaks):" +
      (to ? "\n- The player addressed " + to + ": speakers must start with " + to + "." : "\n- Pick the one person who most naturally answers: the one named, touched, or most involved.") +
      "\n- One speaker by default. Add a second only if they truly have their own angle (backing it up, disagreeing, competing, jealousy, something useful), and say why in their `why`." +
      "\n- A second speaker may address the player or answer the first, never repeat them." +
      (think ? "\n- This is the player's private thought; nobody hears it. At most one person reacts to visible expression or silence, never to the thought itself; zero is fine." : "") +
      "\n- Don't have two people speak several turns in a row.";
}
const BROAD98 = /你们|大家|两位|你俩|都(?:想|要|会|觉得|喜欢|来|说)|everyone|both of you|you two|you all/i;
function pickSpeakers98(th, act, spk) {
  const A = th.b98, to = act && act.to;
  let list = spk.slice();
  if (to) { const i = list.findIndex(x => x.id === to); const main = i >= 0 ? list.splice(i, 1)[0] : { id: to, intent: "" }; list.unshift(main); }
  list = list.slice(0, 2);
  const broad = !to && act && BROAD98.test(String(act.txt || ""));
  if (act && act.mode === "think") list = list.slice(0, 1);
  else if (list[1] && !(String(list[1].why || "").trim() && (broad || !A.pair98))) list = list.slice(0, 1);
  list.forEach((x, i) => { x.role = i ? "aside" : "main"; });
  A.pair98 = list.length > 1;
  return list;
}
function stance98(th, cid, turn, you, zh) {
  const to = turn.to && ch(turn.to) ? first(ch(turn.to).n) : "";
  if (turn.more) return zh ? "\n这一轮" + you + "没有开口，只是在等你们说下去。顺着你刚才的话或眼前的事继续：把没说完的心里话说出来、补一个动作、或者把话题往前推一步。不要重复说过的话，不要问“你怎么不说话”。" : "\n" + you + " said nothing; they're waiting for you to go on. Continue from your last words or what's in front of you; don't repeat yourself or ask why they're quiet.";
  if (turn.think) return zh ? "\n这一轮" + you + "没有说话，只是在想事情。你听不到别人心里的话，只能对看得见的表情、沉默或小动作作出反应。" : "\n" + you + " said nothing this turn; you can't hear thoughts, only react to what you can see.";
  if (turn.role === "aside") return zh ? "\n" + you + "这句话" + (to ? "是对" + to + "说的，" : "") + "不是冲你来的，前面已经有人接了。你只是插一句：可以附和加码、唱反调、趁机争取或者吃醋，理由是：" + (turn.why || "你另有立场") + "。短一点，可以冲着" + you + "，也可以回敬对方，不要重复他的意思。" : "\nThat line wasn't aimed at you and someone already answered. Just add your own angle (" + (turn.why || "") + "), briefly; don't repeat them.";
  return zh ? "\n" + you + "这句话" + (to === first(ch(cid).n) ? "是直接对你说的" : "最该由你来接") + "，正面回应。" : "\nThis line is yours to answer; respond directly.";
}
/* 人设：让每个人说话有鲜明的样子。这些栏目是 2026-11-06 加的，老剧本没有就跳过 */
function persona98(k, you, zh) {
  const f = [["archetype", "你的人设类型", "Your type"], ["expression", "你嘴上和心里的差别", "What you say vs. what you feel"], ["flirt", "你怎么调情", "How you flirt"], ["jealousy", "你怎么吃醋", "How you get jealous"], ["when_asked", you + "向你提要求时，你会怎么做", "When " + you + " asks you for something"]];
  return f.filter(([key]) => k[key]).map(([key, z, e]) => "\n" + (zh ? z : e) + "：" + String(k[key]).slice(0, 200)).join("");
}
function feeling98(zh) {
  return zh
    ? "\n说话要像一个有欲望、有情绪的活人：先想清楚这一刻你想从" + "对方那里得到什么，再决定嘴上说几分、藏几分。按你的人设来，嘴硬的就嘴硬，热烈的就热烈，让人一听就知道是你。可以调情、挑逗、试探、吃醋、示弱，话里要有潜台词。不要说客服式的“好的”“没问题”“听你的”，不要每句都提问，玩家没接的问题不要连着追问，换个方式靠近；不要解释自己的情绪。前提是尊重玩家当下的意愿。"
    : "\nSpeak like a living person with desire and feelings: know what you want from them right now, then decide how much to say and how much to hide. Stay true to your type so you're recognizable. Flirt, tease, test, get jealous, show weakness; leave subtext. No customer-service lines, not every line a question, don't keep pressing a question they ignored, don't explain your feelings. Always respect what the player wants right now.";
}
/* ---------- 点屏继续（2026-11-06 玩家：有时候想让他们多说两句，不想每句都自己接）----------
   玩家没开口，只点了一下屏幕：剧情往前走一小步，不换场。连着点了几次，就把话头交回给玩家。 */
function more98(th, zh) {
  const n = th.b98.more98n || 0;
  return (zh ? "玩家没有说话，只是轻点屏幕，想让你们接着说下去。顺着刚才的话头往前走一小步：刚才那个人可以把没说完的心里话说出来、补一个动作，另一个人可以接茬、较劲或吃醋，也可以眼前发生一件小事。仍然围绕玩家，不推进到下一场，不替玩家说话、做动作或做决定。默认一个人开口，最多两个人。不要问玩家为什么不说话。"
             : "The player said nothing; they tapped to let you keep going. Move one small step forward from where the talk left off: finish an unsaid thought, add a gesture, let someone else chime in, compete or get jealous, or let a small thing happen here. Stay centred on the player; don't move scenes; never speak or decide for the player. One speaker by default, two at most. Don't ask why the player is quiet.") +
    (n >= 2 ? (zh ? "玩家已经连着点了 " + (n + 1) + " 次：这一次要把一个具体的问题或邀请交给玩家，让他接话。" : " They've tapped " + (n + 1) + " times in a row: this time hand them a concrete question or invitation.") : "");
}
/* ---------- 尺度跟随（2026-11-06 玩家：往深了聊、说得露骨时，角色不跟同样的深度）----------
   作品尺度（剧本 heat / 后台作品标签）× 玩家自己选的口味 × 年龄确认，算出这部作品此刻的上限（和单人聊天同一套 dialogueHeat）。
   上限以内：玩家多直白，角色就多直白，不装傻、不岔开、不说教。超过上限：不出戏、不拒绝玩家这个人，用人设接住（吊着、反将一军、放慢），
   或者在最紧的那一刻切走（灯灭了、门关上了），之后用暗示接回来。 */
function heatOf98(th) {
  try { if (typeof dialogueHeat === "function") return dialogueHeat(th); } catch (e) { console.warn("[b98] heat", e); }
  return "slow";
}
const HEAT98 = {
  fluff: ["温柔甜：心动、拌嘴、差一点碰到，不写亲热。", "warm and sweet: crushes, banter, almost-touching; no making out"],
  slow: ["慢热：可以暧昧、拉扯、靠近，感情到了可以牵手、拥抱、一个吻；不写亲热的过程。", "slow burn: tension, closeness; when earned a hand, a hug, a kiss; no intimate scenes"],
  steamy: ["火热：可以直白地调情、说想要对方、亲吻和身体的贴近都可以写；再往下就在最紧的那一刻切走。", "steamy: direct flirting, saying you want them, kissing and closeness; beyond that, cut away at the tightest moment"],
  mature: ["成人：成年人的欲望和亲密可以正面写，不用回避；只是不写性器官和性行为的细节过程。", "mature: adult desire and intimacy written head-on; no explicit anatomy or step-by-step sex"],
  explicit: ["成人露骨（玩家已确认成年）：玩家说什么尺度，角色就用同样的尺度直接回应，有欲望、有身体、有张力；双方随时可以放慢或说不。", "explicit (player confirmed 18+): match the player's intensity directly, with desire, bodies and tension; either side may slow down or say no"]
};
function heat98(th, zh, who) {
  const h = heatOf98(th), rule = HEAT98[h] || HEAT98.slow, top = h === "explicit";
  if (who === "director") return zh
    ? "\n\n尺度：本作品此刻的上限是「" + rule[0] + "」玩家往深处聊、说得越来越大胆时，给角色的 intent 要跟上同样的温度，不要安排装傻、岔开话题或说教。" + (top ? "" : "玩家要的超过上限时，安排角色用人设接住（吊着、反将一军、放慢节奏），或者在最紧的那一刻用旁白切走，之后用暗示接回来；不要安排冷冰冰的拒绝。")
    : "\n\nHeat: this story's ceiling right now is: " + rule[1] + ". When the player goes deeper or bolder, give characters intents at the same temperature; never plan playing dumb, changing the subject or lecturing." + (top ? "" : " If they ask for more than the ceiling, have the character catch it in character (tease, turn it back, slow it down) or cut away at the tightest moment and come back with implication; never a cold refusal.");
  return zh
    ? "\n尺度跟着玩家走：玩家这一句有多直白、多大胆，你就用同样的温度回应，可以更撩，但不要比他退得更远；不装傻、不岔开话题、不说教、不像客服一样拒绝。本作品的上限是「" + rule[0] + "」" + (top ? "" : "玩家要的超过这个上限时，不出戏、不拒绝他这个人：用你的人设接住（吊着他、反将一军、把节奏放慢、说“剩下的留到……”），或者停在最紧的那一刻。")
    : "\nMatch the player's heat: as direct and bold as their line, never colder; no playing dumb, changing the subject, lecturing or customer-service refusals. This story's ceiling: " + rule[1] + "." + (top ? "" : " If they ask past it, stay in character and don't reject them: tease, turn it back, slow down, promise the rest for later, or stop at the tightest moment.");
}
/* 重新生成：换一个角度，而不是把原话换个说法 */
function redo98(zh) {
  return typeof REDO73 !== "undefined" && REDO73 ? (zh ? "\n\n重新生成：玩家想看这一轮的另一个版本。换一个明显不同的走向：换一个人开口或换一种态度、换一个动作和第一句话，但仍然回应玩家同一句话、仍然符合人设。" : "\n\nREGENERATE: the player wants another version of this turn. Take a clearly different direction (another speaker or attitude, a different first move and line) while answering the same input in character.") : "";
}
/* 一轮成功后：给这一轮的回复打上同一个轮次号（app73 靠它找「最新一轮」），并留下重新生成要用的快照 */
function turn98(th, start, pre, mode, act) {
  const id = Date.now().toString(36) + ":" + start;
  if (pre) {
    th.msgs.slice(start).forEach(m => { if (m.who !== "me" && m.who !== "sys") { m.ai = 1; m.turn73 = id; } });
    th._pre73 = pre; th._ctx73 = { kind: "b98", mode, act: act ? Object.assign({}, act) : null };
  } else if (!(typeof REDO73 !== "undefined" && REDO73)) { delete th._pre73; delete th._ctx73; }
}

/* ---------- 照片（2026-11-06 玩家：说“我想看看…”时，对方应该发来一张要解锁的、符合剧情的照片）----------
   谁决定：导演。它看得到玩家这句话和眼前的剧情，决定由谁发、拍的是什么（photo 字段）；发照片的人用自己的台词把照片递过来。
   两种时机：玩家要看（“我想看看…”“给我看看…”“拍给我看”）；或者连着两章（experience.photoEvery 可改）没发过，就在本章最高光的那一刻主动发一张。
   图从哪来：剧本给了照片图（scene.photos + 资源 id）就用；没有就按角色立绘生成同一张脸的照片；生成不了而照片拍的是他本人，就用他的立绘。
   照片先模糊着，玩家花 💎 解锁（MIRU+ 免费），解锁后存进相册。照片尺度永远不过线：衣着完整，最多擦边。 */
const PHOTO98 = /(?:想|要|让我|给我|能不能|可以|让我们)(?:再)?(?:看看|看一下|看下|瞧瞧|瞧一眼|看一眼)|拍(?:给我|一张|张|个)|发(?:我)?(?:张|个|一张|几张)?(?:照片|自拍|相片)|(?:照片|自拍|相片)|show me|send (?:me )?(?:a )?(?:photo|pic|selfie)|picture of/i;
function exch98(th) { const A = th.b98; return A.tkAt === A.ch + ":" + A.sc ? A.tkN || 0 : 0; }
/* 玩家明说要照片、导演却没安排时，单独问一次（混在导演的一大堆规则里，模型常常漏掉） */
const PHOTO_ASK98 = /照片|相片|自拍|拍(?:给我|一张|张|下来)|发(?:我)?(?:一张|张|几张)|给我看看|想看看|show me|photo|pic|selfie/i;
async function photoOnly98(th, act) {
  const { s } = scene98(th), zh = Z98(), block = photoAsk98(th, act, zh); if (!block) return null;
  try {
    const r = await ask((zh ? "你是互动恋爱剧的导演，只负责一件事：玩家想看东西时，安排谁发一张照片给他。" : "You are the director of an interactive romance; your only job: when the player wants to see something, arrange who sends a photo.") +
      "\n" + (zh ? "地点：" : "Place: ") + LZ98(s && s.place) + "\n" + (zh ? "在场（id）：" : "Present (ids): ") + here98(th, s).map(id => first(ch(id).n) + "=" + id).join("，") +
      "\n\n" + (zh ? "刚才：\n" : "Just now:\n") + tail98(th, 8) + "\n\n" + (zh ? "玩家这一轮：" : "Player: ") + act.txt + (act.to && ch(act.to) ? (zh ? "（对 " : " (to ") + first(ch(act.to).n) + "）" : "") +
      block + '\n\nReply with ONLY JSON: {"photo":null} in ' + LANG98() + ".", { maxTokens: 300 });
    return r && r.photo && typeof r.photo === "object" ? r.photo : null;
  } catch (e) { console.warn("[b98] photo ask", e); return null; }
}
function photoDue98(th) { const A = th.b98, every = +((experience98(th) || {}).photoEvery) || 2; return A.ch - (A.photoCh || 0) >= every && A.photoAutoCh !== A.ch; }
function photoCap98(th, zh) {
  const hot = ["steamy", "mature", "explicit"].includes(heatOf98(th));
  return zh ? (hot ? "可以性感、暧昧（领口敞开、湿发、近距离、镜子里的背影），但不露点、不裸体、没有性行为" : "日常、好看、有氛围，衣着完整") : (hot ? "sensual and suggestive (open collar, wet hair, close-up, mirror shot) but no nudity or sex" : "everyday, attractive, atmospheric, fully clothed");
}
function photoAsk98(th, act, zh) {
  const A = th.b98, asked = !!(act && act.mode !== "think" && PHOTO98.test(String(act.txt || ""))), due = photoDue98(th);
  const n = (A.photoN98 && A.photoN98.ch === A.ch) ? A.photoN98.n : 0;
  if ((!asked && !due) || n >= 4) return "";
  const { s } = scene98(th), list = ((s && s.photos) || []).filter(p => p.id && (OFF94.assets[wd(th.wid).community] || {})[p.id]);
  return zh
    ? "\n\n照片 photo，默认 null。" +
      (asked ? "\n- 玩家这一轮想看东西。照片是玩家真正能看到画面的唯一方式，所以只要他想看的是一样东西、一个人或一段过去（不是“看看你怎么说”这种比喻），就必须填 photo：由被要的人（没点名就由最合适的在场者）发一张。当面也一样：把手机里的照片发给他，或者当场拍下来发给他。照片要和眼下的剧情对得上。" : "") +
      (due ? "\n- 已经两章没给玩家发过照片了，这一章要在最高光的那一刻主动发一张：情绪到了最高点、暧昧最浓、刚刚发生了只属于你们的事，或者分开前想让对方记住的一刻（比如一张刚拍的合照、一张只给玩家看的自拍）。" + (exch98(th) >= pacing98(th).min ? "本章已经聊了 " + exch98(th) + " 轮，这一轮只要气氛对了就发，不要再等。" : "平平常常的时候填 null。") : "") +
      (list.length ? "\n- 剧本给这一场备了照片，合适就直接用（写进 asset）：" + list.map(p => p.id + "（" + (p.name || "") + (p.when ? "；" + p.when : "") + "）").join("；") : "") +
      '\n写成 {"from":"发照片的人的 id","what":"照片画面，30 字内：谁、在做什么、穿着、光线、角度，像手机随手拍的","cap":"他发照片时说的一句话，20 字内，按他的人设","asset":null}。' +
      "照片里出现的人必须都是成年人：玩家想看他小时候、学生时代的样子，不拍小孩，改发一张成年后的旧照或一件旧物，由他用一句话带过。尺度：" + photoCap98(th, zh) + "。玩家要看的超过这个尺度（比如让他脱衣服）时，照片不越线，由他按人设接住：发一张擦边但不露的，配一句吊胃口的话。"
    : "\n\nphoto, default null." +
      (asked ? "\n- The player seems to want to see something. If they really mean a thing or a person (not a figure of speech), the person asked (or the most fitting one present) takes a photo of what they can really shoot here and now, true to the current scene." : "") +
      (due ? "\n- No photo in two chapters. Send one only at a true high point (peak emotion, strongest tension, a moment just for the two of you). Otherwise null." : "") +
      (list.length ? "\n- Prepared photos for this scene (put the id in asset if one fits): " + list.map(p => p.id + " (" + (p.name || "") + ")").join("; ") : "") +
      '\nFormat {"from":"sender id","what":"what the photo shows, under 25 words, like a phone snapshot","cap":"one short line he sends with it, in his voice","asset":null}. Everyone in it must be an adult: if asked for a childhood photo, send an adult-era photo or an old keepsake instead. Limit: ' + photoCap98(th, zh) + ". If asked for more than that (e.g. to undress), the photo stays within it and he plays it in character with a teasing line.";
}
function photoSay98(turn, zh) {
  if (!turn.photo) return "";
  return zh ? "\n你这一轮给玩家发了一张照片，拍的是：" + turn.photo.what + "。你的台词就是发照片时说的那句话（可以参考：" + (turn.photo.cap || "") + "），不要描述照片里有什么，让他自己打开看。"
            : "\nThis turn you send the player a photo of: " + turn.photo.what + ". Your line is what you say as you send it (e.g. " + (turn.photo.cap || "") + "); don't describe the photo.";
}
/* 导演给的 photo 收紧成能用的样子；发照片的人这一轮一定开口 */
const MINOR98 = /小时候|童年|男孩|女孩|小孩|孩子|儿童|婴儿|宝宝|少年|少女|小学|初中|高中|中学|未成年|(?:^|[^\d])(?:[1-9]|1[0-7])\s*岁|[一二三四五六七八九十]{1,3}岁|\b(?:child|kid|boy|girl|teen|baby|school ?boy|school ?girl)\b/i;
function photoPlan98(th, d, mode, spk) {
  const p = d && d.photo; if (!p || typeof p !== "object" || (mode !== "talk" && mode !== "more")) return null;
  const { s } = scene98(th), from = String(p.from || ""), what = String(p.what || "").trim().slice(0, 80);
  /* 照片里只能有成年人：导演写成了小时候的照片就不发（图片生成也不接受） */
  if (!allowedSpeakers98(th, s).includes(from) || !what || MINOR98.test(what)) return null;
  if (!spk.some(x => x.id === from)) { if (spk.length >= 2) spk.pop(); spk.push({ id: from, intent: "", role: spk.length ? "aside" : "main", why: L98("给玩家发照片", "sending a photo") }); }
  const As = OFF94.assets[wd(th.wid).community] || {}, asset = p.asset && As[p.asset] && ((s && s.photos) || []).some(x => x.id === p.asset) ? String(p.asset) : null;
  return { from, what, cap: String(p.cap || "").trim().slice(0, 40), asset, auto: !PHOTO98.test(String((th.msgs.filter(m => m.who === "me").slice(-1)[0] || {}).txt || "")) };
}
function photoSend98(th, ph) {
  const A = th.b98, id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  A.photoCh = A.ch; if (ph.auto) A.photoAutoCh = A.ch;
  A.photoN98 = A.photoN98 && A.photoN98.ch === A.ch ? { ch: A.ch, n: A.photoN98.n + 1 } : { ch: A.ch, n: 1 };
  const m = { who: ph.from, k: "card", txt: ph.cap || L98("一张照片", "A photo"), ph98: { id, what: ph.what, cap: ph.cap, asset: ph.asset, st: "gen" }, at: Date.now() };
  appendMsg(th, m); m.ai = 1;
  photoGen98(th, m);
}
const PH98 = { busy: {} };
function photoPaint98(th, m) {
  if (curT !== th.id) return; const i = th.msgs.indexOf(m), el = document.querySelector('.ph98row[data-ph98row="' + m.ph98.id + '"]');
  if (el && i >= 0) el.outerHTML = photoHTML98(m, i);
}
async function photoGen98(th, m) {
  const p = m.ph98; if (!p || PH98.busy[p.id]) return;
  PH98.busy[p.id] = 1; p.st = "gen"; photoPaint98(th, m);
  try {
    const As = OFF94.assets[wd(th.wid).community] || {};
    let url = p.asset && As[p.asset];
    if (!url) url = await photoImage98(th, m);
    p.src = /^data:/.test(url) ? mediaWrap("ph98:" + p.id, await shrink98(url)) : url;
    p.st = p.open ? "open" : "locked";
  } catch (e) { console.warn("[b98] photo", e); p.st = "fail"; }
  finally { delete PH98.busy[p.id]; save(); photoPaint98(th, m); }
}
async function photoImage98(th, m) {
  const w = wd(th.wid), c = ch(m.who), k = cardOf98(w, m.who) || {}, { s } = scene98(th), p = m.ph98;
  let spec = null;
  try {
    spec = await ask("Turn this into ONE English prompt (max 60 words) for a photoreal smartphone photo that " + (c ? c.n : "a man") + " (" + (k.age || 30) + ", " + (k.gender === "f" ? "woman" : "man") + "; looks: " + String(k.bio || Lz(c && c.looks) || "").slice(0, 200) + ") just took and sent in a romance chat.\nWhat the photo shows: " + p.what + "\nWhere: " + LZ98(s && s.place) +
      "\nRules: vertical phone photo, natural light, candid, adults only, " + photoCap98(th, false) + ", no text, no watermark. person = true if he himself is in the photo.\nReply with ONLY JSON: {\"prompt\":\"...\",\"person\":true}", { maxTokens: 300 });
  } catch (e) { console.warn("[b98] photo prompt", e); }
  const prompt = String((spec && spec.prompt) || p.what).slice(0, 600), person = !spec || spec.person !== false, ref = typeof aiRefUrl === "function" ? aiRefUrl(m.who) : null;
  if (MINOR98.test(prompt)) throw new Error("adults only");
  if (typeof AIG !== "undefined" && AIG.mcp) {
    try {
      /* 拍他本人：只用「同一张脸」的改图，试两次；换成凭空生成会是另一张脸，宁可用立绘 */
      if (person && ref) {
        for (let t = 0; t < 2; t++) { try { const src = aiImgFrom(await AIG.mcp.callTool(AIG.srv, AIG.edit, { input_image: ref, prompt: "Keep this exact person's face, hair and build unchanged. " + prompt, steps: 20, guidance_scale: 2.5, randomize_seed: true }, { cache: false })); if (src) return src; } catch (e) { console.warn("[b98] photo edit", e); } }
      } else {
        const src = aiImgFrom(await AIG.mcp.callTool(AIG.srv, AIG.tool, { prompt, width: 576, height: 1024, num_inference_steps: 24, randomize_seed: true }, { cache: false })); if (src) return src;
      }
    } catch (e) { console.warn("[b98] photo gen", e); }
  }
  /* 生成不了：拍的是他本人，就发他的立绘；拍的是别的东西，宁可失败也不发一张对不上的图 */
  const art = person && typeof artSrc === "function" ? artSrc(m.who) : "";
  if (art && !/^data:image\/svg/.test(art)) return art;
  throw new Error("no image");
}
function shrink98(src) {
  return new Promise(ok => { const im = new Image(); im.addEventListener("load", () => { try { const r = Math.min(1, 720 / Math.max(im.naturalWidth, im.naturalHeight)), cv = document.createElement("canvas"); cv.width = Math.round(im.naturalWidth * r); cv.height = Math.round(im.naturalHeight * r); cv.getContext("2d").drawImage(im, 0, 0, cv.width, cv.height); ok(cv.toDataURL("image/jpeg", 0.82)); } catch (e) { ok(src); } }, { once: true }); im.addEventListener("error", () => ok(src), { once: true }); im.src = src; });
}
function photoHTML98(m, i) {
  const p = m.ph98, c = ch(m.who), nm = c ? first(c.n) : "", src = p.src ? albumSrc({ id: "ph98" + p.id, src: p.src }) : "";
  const over = p.st === "open" ? "" : p.st === "locked"
    ? '<div class="ph98lk"><i>🔒</i><b>' + esc(L98(nm + " 发来一张照片", nm + " sent you a photo")) + '</b><button data-ph98open="' + p.id + '">' + (S.plus ? L98("打开看看", "Open") : L98("解锁看看", "Unlock") + " · 💎 " + PRICES.pic) + '</button></div>'
    : p.st === "fail" ? '<div class="ph98lk"><b>' + L98("照片没发出来", "The photo didn't come through") + '</b><button data-ph98retry="' + p.id + '">' + L98("重新发送", "Try again") + '</button></div>'
    : '<div class="ph98lk"><span class="ph98spin"></span><b>' + esc(L98(nm + " 正在发照片…", nm + " is sending a photo…")) + '</b></div>';
  return '<div class="m-row ph98row" data-ph98row="' + p.id + '"><div class="av" style="width:30px;height:30px"><img src="' + artSrc(m.who) + '" alt=""></div><div class="ph98col"><div class="m-who" style="color:' + (c ? c.pal[0] : "") + '">' + esc(nm) + '</div>' +
    '<div class="ph98 ph98-' + p.st + '" data-ph98="' + p.id + '">' + (src ? '<img data-amid="ph98' + p.id + '" src="' + esc(src) + '" alt="">' : '<span class="ph98ph"></span>') + over + '</div></div></div>';
}
function photoOpen98(th, id) {
  const m = th.msgs.find(x => x.ph98 && x.ph98.id === id); if (!m || m.ph98.st !== "locked") return;
  if (!spend(PRICES.pic, "pic")) return;
  const p = m.ph98; p.st = "open"; p.open = 1;
  const aid = "a" + Date.now(); S.album.unshift({ id: aid, cid: m.who, src: p.src, at: Date.now() }); if (S.album.length > 24) S.album.length = 24;
  mem98(th, [m.who], L98(yn98(th) + "打开了你发的照片：" + p.what, yn98(th) + " opened your photo: " + p.what));
  if (typeof loveAllowed === "function" && loveAllowed(th, m.who)) loveWrite(th, m.who, 2, "story98:photo");
  save(); photoPaint98(th, m);
}
/* ---------- 点屏继续：点聊天区的空白（或者点一句话，等一下确认不是双击回 ❤️）---------- */
function tapOK98(th) {
  const A = th && th.b98;
  return !!(A && !A.ended && !busy && A.phase === "talk" && !(typeof RG_PENDING73 !== "undefined" && RG_PENDING73) && Date.now() - (A.tap98at || 0) > 1500 &&
    th.msgs.some(m => m.ai && m.who !== "me") && !(window.getSelection && String(window.getSelection())));
}
function cont98(th) { if (!tapOK98(th)) return; th.b98.tap98at = Date.now(); S.tap98n = (S.tap98n || 0) + 1; th.rounds++; return beat98(th, "more", null); }
let TAP98 = null;
document.addEventListener("click", e => {
  const th = S.threads[curT]; if (!th || !th.b98) return; let x;
  if ((x = e.target.closest("[data-ph98open]"))) { e.stopImmediatePropagation(); photoOpen98(th, x.dataset.ph98open); return; }
  if ((x = e.target.closest("[data-ph98retry]"))) { e.stopImmediatePropagation(); const m = th.msgs.find(y => y.ph98 && y.ph98.id === x.dataset.ph98retry); if (m) photoGen98(th, m); return; }
  if ((x = e.target.closest(".ph98-open[data-ph98]"))) { const im = x.querySelector("img"); if (im && typeof off94Show === "function") { try { off94Show({ src: im.src, cap: "" }, false); } catch (err) { console.warn("[b98] photo view", err); } } return; }
  if (!e.target.closest("#msgs") || e.target.closest("button,a,input,textarea,select,label,img,video,.ph98,.rx122p,.bt86,.rg73,.entry98,[data-unmsg]") || !tapOK98(th)) return;
  if (e.target.closest("[data-mi]")) { if (TAP98) { clearTimeout(TAP98); TAP98 = null; return; } TAP98 = setTimeout(() => { TAP98 = null; cont98(th); }, 260); return; }
  cont98(th);
});
function nextLabel98(th) {
  const { b, c } = scene98(th), A = th.b98;
  return A.sc < c.scenes.length - 1 ? L98("继续", "Continue") : A.ch < b.chapters.length ? L98("下一章", "Next chapter") : L98("走向结局", "To the ending");
}
/* sending a message in a b98 thread = free talk inside the current scene */
{ const _rp = reply; reply = function (th, ctx, silent) {
  if (th && th.b98) {
    /* 重新生成 / 改了自己那句再发：回到那一轮之前的状态，用同一句话重跑（快照见 turn98） */
    if (ctx && ctx.kind === 'b98') {
      if (!REDO73 && ctx.txt != null && th._pre73) restore73(th, th._pre73);
      const act = ctx.act ? Object.assign({}, ctx.act, ctx.txt != null ? { txt: ctx.txt } : {}) : null;
      return Promise.resolve(beat98(th, ctx.mode || 'talk', act));
    }
    /* 点屏 / ⏩ 继续：玩家不说话，让他们接着说 */
    if (ctx && ctx.kind === 'cont') return Promise.resolve(beat98(th, 'more', null));
    if (ctx && (ctx.kind === 'user' || ctx.kind === 'dir')) {
      if (experience98(th) && !busy && !th.b98.ended && ctx.kind === 'user' && ctx.mode !== 'think') {
        explicitPreference98(th,ctx.txt);
        const x=String(ctx.txt||'').trim().replace(/[。！!]+$/,'');
        if (/^(?:我想|我要)?(?:结束今晚|结束故事|离开影院|离开这里)$/.test(x)) {finishExperience98(th,'leave');return Promise.resolve();}
        if (/^(?:继续剧情|下一章|进入下一章)$/.test(x)) return next98(th);
        const index=matchingChoice98(th,x);if(index>=0)return pick98(th,index,true);
      }
      return Promise.resolve(beat98(th,'talk',{txt:ctx.txt,mode:ctx.kind==='dir'?'act':(ctx.mode||'say'),to:th.addr&&th.cast.includes(th.addr)?th.addr:null}));
    }
    return Promise.resolve();
  }
  return _rp.apply(this,arguments);
}; }

/* ---------- compact dock: 下一章 / scene choices (never a big window) ---------- */
function dock98() {
  const th = S.threads[curT]; const old = $("#dk98"); if (!th || !th.b98) { if (old) old.remove(); return; }
  const comp = $("#s-chat .composer"); if (!comp) return; const A = th.b98, { s } = scene98(th);
  let h = '';
  if (A.ended) h = '<div class="dk98r"><span class="dk98t">🎬 ' + (experience98(th) ? L98("故事已收束，可重新开始。", "The story has ended. You can start again.") : L98("故事完结。可以继续和他们聊天。", "The story is complete. You can keep talking with them.")) + '</span></div>';
  else if (experience98(th) && A.phase !== 'enter' && s && s.choice && experience98(th).choiceDock === 'always') {
    const picked = s.id in A.picked;
    h = picked ? '' : '<div class="dk98q">' + esc(cq98(s.choice.q)) + '</div><div class="dk98o">' + s.choice.options.map((o,i) => '<button data-b98pick="' + i + '"' + (busy ? ' disabled' : '') + '>' + esc(cq98(o.t)) + '</button>').join('') + '</div>';
  }
  else if (A.phase === "choice" && s && s.choice) h = '<div class="dk98q">' + esc(cq98(s.choice.q) || L98("你怎么做？", "What do you do?")) + '</div><div class="dk98o">' + s.choice.options.map((o, i) => '<button data-b98pick="' + i + '">' + esc(cq98(o.t)) + '</button>').join("") + '</div><p class="dk98h">' + L98("也可以直接在下面打字说你想怎么做", "Or type what you'd do below") + '</p>';
  else if (A.phase === "talk" && s && s.choice && s.choice.options && s.choice.options.length && !(s.id in A.picked)) h = '<div class="dk98o">' + s.choice.options.map((o, i) => '<button data-b98pick="' + i + '"' + (busy ? ' disabled' : '') + '>' + esc(cq98(o.t)) + '</button>').join("") + '</div>';
  const mustPick98 = s && s.choice && s.choice.options && s.choice.options.length && !(s.id in A.picked) && !(experience98(th) && experience98(th).allowFreeContinue);
  if (!A.ended && !busy && A.phase === 'talk' && !mustPick98 && A.ready98 === A.ch + ":" + A.sc) h += '<div class="dk98r"><button data-b98next="1">' + esc(nextLabel98(th)) + ' ›</button></div>';
  /* 点屏继续的提示：前三次用过就不再出现 */
  if (!A.ended && !busy && A.phase === 'talk' && (S.tap98n || 0) < 3 && th.msgs.some(m => m.ai && m.who !== 'me')) h += '<p class="tap98">' + L98('轻点空白处，让他们接着说', 'Tap the empty space to let them keep talking') + '</p>';
  if (old) old.outerHTML = h ? '<div id="dk98">' + h + '</div>' : ''; else if (h) comp.insertAdjacentHTML("beforebegin", '<div id="dk98">' + h + '</div>');
}
{ /* 2026-10-27：从「包 renderChat」搬成钩子（收尾批次）。逻辑原样。 */
const __body_story98 = function () { try { dock98(); const th = S.threads[curT]; if (th && th.b98 && th.b98.bg && window.SCENE_FILES && !window.SCENE_FILES[th.b98.bg]) { /* bg key lost on reload */ const As = OFF94.assets[(wd(th.wid) || {}).community] || {}; const { s } = scene98(th); const src = (th.b98.bgHl && As[th.b98.bgHl]) || (s && As["bg_" + s.id]); if (src) { window.SCENE_FILES[th.b98.bg] = src; sceneBg(th, th.b98.bg); } } else if (th && th.b98 && th.b98.bg) sceneBg(th, th.b98.bg); } catch (_) {} };
if (window.UI && typeof window.UI.add === "function") window.UI.add("story98", __body_story98);
else { const _rc = renderChat; renderChat = function () { const r = _rc.apply(this, arguments); __body_story98(); return r; }; }; }
document.addEventListener("click", e => { let x; const th = S.threads[curT];
  if (e.target.closest("[data-b98next]")) { if (th && th.b98) next98(th); return; }
  if ((x = e.target.closest("[data-b98pick]"))) { if (th && th.b98) pick98(th, +x.dataset.b98pick); return; }
  if ((x = e.target.closest("[data-call98]"))) { e.stopPropagation(); try { startCall(x.dataset.call98); } catch (_) {} return; }
}, true);
/* a call card gets an answer button */
MSGKIND.post("app98_story.js", function (h, m, i, th) { if (m && m.intro98) return introHTML98(m, i); if (m && m.game98 && typeof arcGameHTML98 === "function") return arcGameHTML98(h, m); if (m && m.ph98) return photoHTML98(m, i); if (m && m.call98) return h.replace(/<\/div>\s*$/, '<button class="btn btn-p btn-sm" style="margin-top:8px" data-call98="' + esc(m.call98) + '">📞 ' + L98("接听", "Answer") + '</button></div>'); });
/* free mode needs its world's assets loaded on reopen */
{ const _ot = openThread; openThread = function (id) { const th = S.threads[id]; if (th && th.b98) { const w = wd(th.wid); if (w) { Promise.all([ensure98(w), off94Assets(w.community)]).then(() => { if (curT === id) { introductions98(th); renderChat(); } }); } } return _ot.apply(this, arguments); }; }
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
#dk98{max-height:42vh;overflow:auto;flex:none;margin:0;padding:8px 12px 6px;background:rgba(12,11,16,.86);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border-top:1px solid rgba(255,255,255,.08)}
#dk98+.composer{border-top:0}
.dk98r{display:flex;align-items:center;gap:10px;padding-right:74px}.dk98t{flex:1;font-size:12.5px;color:#BDB4C7;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dk98r button{flex:none;border:0;border-radius:999px;padding:8px 14px;font-weight:800;font-size:13px;background:linear-gradient(135deg,#F0B77E,#EE6F97);color:#1B1017}
.dk98q{font-size:13.5px;font-weight:700;color:#fff;margin:0 2px 8px}.dk98o{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:6px}.dk98o button{text-align:left;border:1px solid rgba(240,183,126,.5);background:rgba(18,16,26,.85);color:#fff;border-radius:12px;padding:8px 10px;font-size:13px;line-height:1.4}
.dk98o button:disabled,.dk98r button:disabled{opacity:.55;cursor:wait}.dk98h{margin:6px 2px 0;font-size:11px;color:#8A8194}
#pkwrap.dock97.fold97 .pkpanel>*:not(.dk97h){display:none}#pkwrap.dock97.fold97{padding-bottom:10px}.dk97h .fd97{margin-left:auto;background:none;border:0;color:#BDB4C7;font-size:12px}`; document.head.appendChild(st); })();
{ const _pr = packRefresh; packRefresh = function () { const r = _pr.apply(this, arguments); try { const h = $("#pkwrap.dock97 .dk97h"); if (h && !h.querySelector(".fd97")) h.insertAdjacentHTML("beforeend", '<button class="fd97" data-fd97="1">' + (S.fold97 ? "▴ " + L98("展开", "Show") : "▾ " + L98("收起", "Hide")) + '</button>'); const pw = $("#pkwrap"); if (pw) pw.classList.toggle("fold97", !!S.fold97); } catch (_) {} return r; }; }
document.addEventListener("click", e => { if (!e.target.closest("[data-fd97]")) return; S.fold97 = !S.fold97; save(); const th = S.threads[curT]; if (th) packRefresh(th); });

function cq98(t){return String(t||'').replace(/[（(][^）)]*(?:N\d+|窗口|自由输入|备注|注：)[^）)]*[）)]/g,'').replace(/\s+$/,'').trim();}

/* 2026-11-04 玩家：底下两排小按钮重复了 —— 和《午夜邀约》一样只留一排。
   做法：自由模式剧的「下一章」按钮和剧情选项，搬进上面那排回复建议（#sugg）的最前面，原来的 #dk98 那排藏起来。
   按钮是复制过去的（data-b98pick / data-b98next 的点击是 document 上统一接的，在哪都能点）。
   没有 #sugg 的时候，#dk98 照常显示，不会丢掉推进剧情的按钮。 */
(function merge98() {
  let busy = false;
  function sync() {
    if (busy) return; busy = true;
    try {
      const scr = document.getElementById("s-chat"), dk = document.getElementById("dk98"), sg = document.getElementById("sugg");
      const btns = dk ? [...dk.querySelectorAll("button[data-b98pick],button[data-b98next]")] : [];
      const on = !!(sg && btns.length);
      if (scr) scr.classList.toggle("m98on", on);
      if (sg) {
        const sig = on ? btns.map(b => b.outerHTML).join("") : "";
        const has = sg.querySelector(".m98");
        if ((sg.dataset.m98 || "") !== sig || (on && !has)) {
          sg.querySelectorAll(".m98").forEach(b => b.remove());
          if (on) {
            const nx = btns.filter(b => b.dataset.b98next), pk = btns.filter(b => b.dataset.b98pick);
            [...nx, ...pk].reverse().forEach(b => { const c = b.cloneNode(true); c.classList.add("m98"); if (b.dataset.b98next) c.classList.add("m98n"); sg.prepend(c); });
          }
          sg.dataset.m98 = sig;
        }
      }
    } catch (e) { console.warn("[merge98]", e); }
    busy = false;
  }
  const go = () => { sync(); const scr = document.getElementById("s-chat"); if (!scr) return setTimeout(go, 500); let t = 0; new MutationObserver(() => { if (!busy) { clearTimeout(t); t = setTimeout(sync, 0); } }).observe(scr, { childList: true, subtree: true }); };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go); else go();
  try { const st = document.createElement("style"); st.textContent = "#s-chat.m98on #dk98{display:none!important}#sugg .m98{flex:none;max-width:72vw}"; document.head.appendChild(st); } catch (e) { console.warn("[merge98] style", e); }
})();


/* Authored manuscript capabilities; enabled only when the manuscript declares them. */
function authoredActor98(th,cid,k) {
  const {s}=scene98(th),love=Number(th.love[cid])||0;
  const eligible=(k.unlockableSecrets||[]).filter(x=>th.b98.ch>=x.from&&love>=x.minLove);
  return (s.growth&&s.growth[k.key]?'\n本章你的成长方向（只通过实际行动表现）：'+s.growth[k.key]:'')+
    (k.other_views?'\n你对其他人的看法（仅供本人，不是对方知道的事实）：'+k.other_views:'')+
    (k.arc?'\n你本人的长期成长方向，不能直接宣布已经完成：'+k.arc:'')+
    (k.unlockableSecrets?'\n未到条件的私人秘密不可透露，也不可根据导演提示补全。当前可自然谈及的私人秘密：'+(eligible.map(x=>x.name+'：'+x.text+'；表现：'+x.expression).join('\n')||'无'):'');
}
function authoredDirector98(th,s) {
  const records=th.b98.gameResults||{},g=s.game,done=g&&records[g.id];
  return (s.events&&s.events.length?'\n本章预留事件（只在括号条件确实满足时推进，不重复触发）：'+s.events.join('\n'):'')+
    (g?'\n本章小游戏：'+g.name+'；出现条件：'+g.when+'。只有该条件已经实际发生才返回 game:true，其他情况 game:false。只提供可选入口，不能替玩家开玩、判断输赢、宣称已完成或先兑现奖励。'+
      (done?'\n真实游戏回执：'+JSON.stringify(done)+'。只使用这条回执。':'\n游戏尚未完成，没有共同游戏记忆，也没有奖励。'):'');
}
function authoredGameCommit98(th,s,g,result,ids) {
  if(!['WIN','LOSE','SKIP'].includes(result)||!g||!th.b98||scene98(th).s.id!==s.id)return false;
  const records=th.b98.gameResults||(th.b98.gameResults={});if(records[g.id])return false;
  const participants=[...new Set(ids||[])].filter(id=>here98(th,s).includes(id));
  const receipt={result,chapter:th.b98.ch,scene:s.id,participants,at:Date.now()};
  records[g.id]=receipt;
  // The callback is the only source of game facts. Refusal and losses never subtract affection.
  if(result!=='SKIP'){
    const fact=g.name+'：'+(result==='WIN'?'成功':'未成功')+'。后续回应提示（尚未实际发生）：'+g.outcomes[result];
    mem98(th,participants,fact);
    for(const id of participants)if(result==='WIN'&&loveAllowed(th,id))loveWrite(th,id,2,'story98:game:'+g.id);
    th.b98.flags.push(g.id+':'+result);
  }
  th.b98.sum.push('小游戏 '+g.name+'：'+result+'；后续回应依据：'+g.outcomes[result]);
  appendMsg(th,{who:'sys',k:'card',title:g.name+' · '+({WIN:'成功',LOSE:'未成功',SKIP:'已跳过'})[result],
    txt:result==='SKIP'?g.outcomes.SKIP:'结果已记录。接下来：'+g.outcomes[result],at:Date.now()});
  save();authoredGameDock98(th);return true;
}
function authoredGameDock98(th){
  const old=document.getElementById('authored-game98');if(old)old.remove();
  const {b,s}=scene98(th),g=s&&s.game;
  if(!b.games_on||!g||th.b98.ended||busy||!th.b98.gameReady98||!th.b98.gameReady98[s.id]||(th.b98.gameResults||{})[g.id])return;
  const comp=document.querySelector('#s-chat .composer');if(!comp)return;
  comp.insertAdjacentHTML('beforebegin','<div id="authored-game98" class="dk98r"><button data-authored-game98="play">🎲 '+esc(g.name)+'</button><button data-authored-game98="skip">先不玩</button></div>');
}
function authoredGameOpen98(th){
  const {s}=scene98(th),g=s&&s.game;if(!g||busy||(th.b98.gameResults||{})[g.id]||!(th.b98.gameReady98||{})[s.id])return;
  const candidates=here98(th,s).filter(id=>{const k=cardOf98(wd(th.wid),id)||{};return g.kind==='bet'?k.key==='c07':g.kind==='melody'?k.key==='c03':g.kind==='clue'?k.key==='c04':g.kind==='timeline'?['c02','c04','c07'].includes(k.key):g.kind==='rapport'?k.romanceable:k.key!=='c06';});
  sheet('<h2>'+esc(g.name)+'</h2><p>'+esc(g.when)+'</p><p>'+esc(g.stake)+'。输了或不玩都能继续。</p><p>想和谁一起？</p>'+candidates.map(id=>'<button class="btn btn-block" data-authored-player98="'+esc(id)+'">'+esc(first(ch(id).n))+'</button>').join('')+'<button class="btn btn-g btn-block" data-authored-game98="skip">这次不玩</button>');
}
function authoredGameStart98(th,id){
  const {s}=scene98(th),g=s&&s.game;if(!g||!here98(th,s).includes(id)||(th.b98.gameResults||{})[g.id]||busy)return;
  closeSheet();
  const gid='g_authored_'+g.kind;
  let def=MG100.find(x=>x.id===gid);
  if(!def){
    const templates={truth:['dice','3','三局两胜'],bet:['dice','3','三局两胜'],melody:['simon','5','记住刚才的音节顺序'],clue:['find','⭐','✨🌙🪐☄💫🔭'],timeline:['order','核对账本/对照原记录/标记缺页/公开校验','-'],rapport:['authored_rapport','-','-']};
    const a=templates[g.kind];if(!a)return;
    def={id:gid,zh:g.name,en:g.name,tpl:a[0],a:a[1],b:a[2],kw:[]};MG100.push(def);
  }
  // A personal preference only becomes known after the player actually shares it.
  if(g.kind==='rapport')MG_T.authored_rapport=function(area,G,sub,done,T){
    sub.textContent='先说一个你愿意分享的小偏好，再选出对方记对的那一项。';
    area.innerHTML='<label>我喜欢……<input id="authored-pref98" maxlength="45" autocomplete="off"></label><button class="btn" id="authored-prefgo98">告诉对方</button>';
    area.querySelector('#authored-prefgo98').onclick=()=>{
      const value=area.querySelector('input').value.trim();if(!value)return;
      appendMsg(th,{who:'me',k:'say',txt:'我喜欢'+value,at:Date.now()});
      mem98(th,[id],yn98(th)+'亲口说喜欢'+value);save();
      const options=shuf([{t:value,ok:true},{t:'我还没说过这个偏好',ok:false}]);
      sub.textContent='哪一句准确记住了你刚说的话？';
      area.innerHTML=options.map((x,i)=>'<button class="btn btn-block" data-p="'+i+'">'+esc(x.t)+'</button>').join('');
      area.onclick=e=>{const b=e.target.closest('[data-p]');if(b)done(options[Number(b.dataset.p)].ok?'win':'lose');};
    };
  };
  mgOpen(gid,r=>{const result={win:'WIN',lose:'LOSE',skip:'SKIP'}[r];if(authoredGameCommit98(th,s,g,result,[id])){try{renderChat();}catch(_){}if(result!=='SKIP'&&curT===th.id&&!busy)beat98(th,'talk',{mode:'act',txt:'刚才'+g.name+'的真实结果为'+result+'。请回应这个结果，别把尚未兑现的奖励说成已经完成。'});}});
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-authored-game98]'),p=e.target.closest('[data-authored-player98]');if(!b&&!p)return;
  const th=S.threads[curT];if(!th||!th.b98)return;e.preventDefault();e.stopPropagation();
  const {s}=scene98(th);if(p)return authoredGameStart98(th,p.dataset.authoredPlayer98);
  if(b.dataset.authoredGame98==='play')return authoredGameOpen98(th);
  if(s.game&&!busy){closeSheet();authoredGameCommit98(th,s,s.game,'SKIP',[]);renderChat();}
});
{const enter=enter98;enter98=async function(th){
  const {s}=scene98(th),as=OFF94.assets[wd(th.wid).community]||{};
  if(s&&s.bgm&&as['bgm_'+s.id]){window.BGM_FILES=window.BGM_FILES||{};window.BGM_FILES['m_'+s.bgm]=as['bgm_'+s.id];}
  return enter.apply(this,arguments);
};}
{const dock=dock98;dock98=function(){const r=dock.apply(this,arguments),th=S.threads[curT];if(th&&th.b98)authoredGameDock98(th);return r;};}

function authoredDecline98(th,act){
  const {s}=scene98(th);
  if(!s.game||!act||act.mode==='think'||!/(?:不想|不愿|不|别|不要)(?:再)?(?:玩|赌)|跳过(?:这个)?(?:游戏)?/.test(String(act.txt||'')))return false;
  authoredGameCommit98(th,s,s.game,'SKIP',[]);return true;
}
