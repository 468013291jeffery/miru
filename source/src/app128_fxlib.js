/* ================= 特效基础层：特效库 · 统一入口 · 开关（2026-11-05）=================
   玩家：特效要跟着剧情走，不是看到字就放。原来有 4 套特效各自触发，主要靠关键词匹配 ⇒
   「今晚不会下雨」下雨、「雷蒙」打雷；官方自由模式几乎走不到其他触发。

   ## 谁决定放什么
     作者   ⟦FX|id⟧ / bible 的 scene.fx、chapter.fx          优先级最高，不限次数
     智能体 剧情智能体（导演）的 fx 字段；单模型回复也是同一份指令   冷却 + 每章上限
     关键词 只看剧本旁白，且只认明确发生的物理事件                 兜底，额度最少
   选导演而不是角色：只有它同时知道场景、玩家这一轮和本轮安排；角色只知道自己，让每个角色选会互相抢。
   不多调一次模型：fx 跟着导演这一轮的 JSON 一起回来。

   ## 特效库
   AMBIENT = 持续氛围（环境变了才换）；MOMENT = 一次性瞬间。这两张表是发给智能体的白名单，
   按「故事里会发生什么」分类，保证每类情境都有可选的；同义和纯装饰的不进表。
   FX100 里其余效果照常保留：老作品的指令、特效库页面、作者 ⟦FX|id⟧ 都还能用。
   表一改要同步 api/_stylecheck.js 的 FX_IDS（tools/fx-selftest.mjs 会对账）。

   ## 开关
   顶栏一个按钮，点开是音乐、语音、特效三个开关。「特效」是总开关，同时管画面、音效、震动（玩家：这三个合成一个）；
   代码里仍是 S.fxOff / S.sfxOff / S.vibOff 三个状态，分别拦在各自的出口。 */
(function () {
  "use strict";
  const zh = () => (typeof CL === "function" ? CL() === "zh" : true);

  /* [id, 什么时候用, when to use] */
  const AMBIENT = [
    ["rain", "下雨", "rain"], ["storm", "暴雨雷电", "thunderstorm"], ["wind", "大风", "strong wind"],
    ["snowfall", "下雪", "snow"], ["blizzard", "暴风雪", "blizzard"], ["ice", "结冰的严寒", "freezing ice"],
    ["candle", "烛光", "candlelight"], ["embers", "炉火、篝火", "fireplace or campfire"], ["inferno", "火灾现场", "a fire"],
    ["blackout", "停电", "power cut"], ["drip", "地下室、漏水", "cellar or leaking water"],
    ["bokeh", "城市夜景灯光", "city lights at night"], ["neon", "霓虹夜店", "neon nightclub"],
    ["godrays", "暖阳光束", "warm sunbeams"], ["dust", "安静室内的浮尘", "dust in a quiet room"],
    ["fireflies", "夏夜萤火虫", "fireflies"], ["aurora", "极光", "aurora"], ["galaxy", "星空", "starry sky"],
    ["petals", "飘落的花瓣", "falling petals"], ["hearts", "持续的甜蜜氛围", "lingering sweetness"],
  ];
  const MOMENT = {
    "恋爱|romance": [
      ["heartbeat", "心跳失控的距离", "heart racing, very close"], ["bloom", "拥抱或释然的暖意", "an embrace, warm relief"],
      ["longing", "克制的思念", "restrained longing"], ["blush", "害羞脸红", "blushing"],
      ["hearts_rise", "明确心动的轻快一刻", "a light moment of falling"], ["heart_burst", "告白说出口", "a confession spoken"],
      ["kiss_mark", "真的接吻", "an actual kiss"], ["ring", "求婚", "a proposal"],
    ],
    "情绪|emotion": [
      ["ink", "内心翻涌", "inner turmoil"], ["shock", "重大反转或冲突爆发", "a major twist or clash"],
      ["tears", "有人真的哭了", "someone actually cries"], ["breath_hold", "屏息的紧张", "held breath"],
      ["dizzy", "醉了、头晕", "drunk or dizzy"], ["flashback", "进入回忆", "entering a memory"], ["dreamy", "梦境、恍惚", "a dream or daze"],
    ],
    "镜头|camera": [
      ["cinema", "电影感的定格", "a cinematic freeze"], ["spotlight", "全场目光聚焦", "everyone looks here"],
      ["zoom", "死死对视", "a locked stare"], ["slowmo", "时间像停住了", "time seems to stop"],
      ["sparkle", "惊艳亮相", "a stunning entrance"], ["flash_white", "拍照、闪光灯", "a camera flash"],
      ["fade_black", "昏迷或黑场", "passing out, fade to black"], ["fade_white", "苏醒、白光", "waking up, white light"],
    ],
    "庆祝|celebration": [
      ["confetti", "庆祝、派对", "a celebration"], ["fireworks", "放烟花", "fireworks"],
      ["shooting_star", "流星", "a shooting star"], ["lanterns", "放灯", "sky lanterns"],
    ],
    "自然|nature": [
      ["lightning", "一道闪电", "a lightning strike"], ["fog", "起雾", "fog rolls in"], ["rainbow", "雨后彩虹", "a rainbow"],
      ["leaves", "落叶", "falling leaves"], ["moonlight", "月光洒下", "moonlight"], ["sunset", "夕阳晚霞", "sunset"],
      ["sun_rays", "阳光照进来", "sunlight breaks through"], ["ripple", "水面涟漪", "ripples on water"],
      ["underwater", "落水、潜水", "underwater"], ["frost", "瞬间结霜", "a sudden frost"],
    ],
    "危险|danger": [
      ["shake", "撞击、摔倒", "an impact or fall"], ["quake", "地震、剧烈摇晃", "an earthquake"], ["explosion", "爆炸", "an explosion"],
      ["flash_red", "受伤、中弹", "wounded or shot"], ["glass_crack", "玻璃碎裂", "glass shatters"], ["blaze", "突然起火", "fire breaks out"],
      ["police", "警车赶到", "police arrive"], ["ambulance", "救护车", "an ambulance"], ["danger", "致命威胁", "a lethal threat"],
      ["watched", "被暗中盯着", "being watched"], ["speed", "飞奔、追逐", "a sprint or chase"], ["clock", "倒计时", "a countdown"],
    ],
    "科技|tech": [
      ["phone_buzz", "手机震动", "a phone buzzes"], ["notify", "收到关键消息", "a key message arrives"],
      ["glitch", "系统、信号故障", "a system glitch"], ["static", "监控画面", "CCTV footage"], ["hologram", "全息投影", "a hologram"], ["warp", "超光速跃迁", "a warp jump"],
    ],
    "奇幻|fantasy": [
      ["magic_circle", "施法、法阵", "casting a spell"], ["enchant", "魔法变化", "an enchantment"], ["wings", "显出翅膀", "wings appear"],
      ["blood_moon", "血月", "a blood moon"], ["wolf_eyes", "兽瞳发光", "glowing eyes"], ["fangs", "露出獠牙", "fangs"],
      ["bats", "蝙蝠群", "bats"], ["crows", "乌鸦群", "crows"], ["butterflies", "蝴蝶", "butterflies"],
    ],
  };
  const AMB = new Set(AMBIENT.map(x => x[0])), MOM = new Set(Object.values(MOMENT).flat().map(x => x[0]));
  const EMO = new Set(["heartbeat", "bloom", "longing", "ink", "shock"]);
  /* 模型或作者写了同义词时归到表里那一个 */
  const ALIAS = { snow: "snowfall", downpour: "storm", thunder: "lightning", frozen: "ice", kiss: "kiss_mark", hug: "bloom", sakura: "petals", rose_petals: "petals", stars: "galaxy", starry: "galaxy", city_bokeh: "bokeh", sunlight: "sun_rays" };
  const COOL = { agent: 6000, script: 20000 }, CAP = { agent: 4, script: 2 };
  const LAST = { at: 0 };

  function resolve(id) {
    id = String(id || "").trim(); if (!id || id === "null") return null;
    if (id === "none") return { type: "ambient", id };
    if (AMB.has(id)) return { type: "ambient", id };
    if (MOM.has(id)) return { type: "moment", id };
    if (ALIAS[id]) return resolve(ALIAS[id]);
    if (typeof FX100 !== "undefined" && FX100.some(x => x.id === id)) return { type: "moment", id, legacy: 1 };
    return null;
  }
  function chapterKey(th) { return th.b98 ? "b" + th.b98.ch : th.pk ? "p" + th.pk.ch : "f" + Math.floor((th.rounds || 0) / 12); }
  function spend(th, src) {
    if (src === "author") return true;
    const now = Date.now(), key = chapterKey(th), b = th.fxB && th.fxB.k === key ? th.fxB : (th.fxB = { k: key, agent: 0, script: 0 });
    if (now - LAST.at < COOL[src] || b[src] >= CAP[src]) return false;
    LAST.at = now; b[src]++; return true;
  }
  function moment(th, id, src) {
    src = src || "author";
    const r = resolve(id); if (!r) return false;
    if (r.type === "ambient") return ambient(th, r.id, src);
    if (!th || th.id !== curT || (typeof PKSKIP !== "undefined" && PKSKIP[th.id])) return false;
    if (window.EXPERIENCE124 && EXPERIENCE124.readingHistory()) return false; /* 在往上翻聊天记录，不打扰 */
    if (!spend(th, src)) return false;
    document.querySelectorAll(".fx100").forEach(el => el.remove()); /* 一次只有一个瞬间特效 */
    if (EMO.has(r.id)) { if (!S.fxOff && window.emoFx) emoFx(r.id); return true; }
    if (typeof fx100 === "function") fx100(r.id);
    return true;
  }
  function ambient(th, id, src) {
    const r = resolve(id); if (!th || !r || r.type !== "ambient") return false;
    if (typeof fxKeyOf === "function" && fxKeyOf(th) === r.id) return false;
    if (typeof fxSet === "function") fxSet(th, r.id);
    return true;
  }
  /* 智能体返回的 fx：环境马上换；瞬间特效交回一个函数，等第一句台词出现时再放，画面和文字同步 */
  function agent(th, fx) {
    fx = fx && typeof fx === "object" ? fx : {};
    if (fx.ambient) { const a = resolve(fx.ambient); if (a && a.type === "ambient") ambient(th, a.id, "agent"); }
    let done = !fx.moment;
    return function () { if (done) return; done = true; moment(th, fx.moment, "agent"); };
  }
  function authored(th, fx) {
    if (!fx || typeof fx !== "object") return;
    if (fx.ambient) ambient(th, fx.ambient, "author");
    if (fx.moment) moment(th, fx.moment, "author");
  }

  /* ---------- 给智能体的指令（表是单一来源，加特效不用改提示词）---------- */
  function promptBlock(th, wantZh) {
    const list = rows => rows.map(r => r[0] + " " + r[wantZh ? 1 : 2]).join(wantZh ? "｜" : " | ");
    const groups = Object.entries(MOMENT).map(([k, rows]) => k.split("|")[wantZh ? 0 : 1] + (wantZh ? "：" : ": ") + list(rows)).join("\n  ");
    const cur = (th && typeof fxKeyOf === "function" && fxKeyOf(th)) || "none";
    return wantZh
      ? "\n\nfx：这一轮要不要特效。默认两项都是 null，大多数回合都不该有特效，特效太多就不特别了。只为这一刻真实发生、玩家能感知到的事选；比喻、否定、假设、回忆、闲聊里提到的词，还有人名地名，都不算（“今晚不会下雨”“雷蒙”“心里像被撞了一下”都填 null）。还没发生、角色可能拒绝的事也不算。" +
        "\n- ambient：环境真的变了才填，一直持续到下次改变；环境没变就填 null，不要重复当前值。当前环境：" + cur + "。可选：" + list(AMBIENT) + "；none 恢复平静。" +
        "\n- moment：这一轮最关键的一个瞬间才填，每章最多两三次。可选：\n  " + groups +
        "\n恋爱和情绪类只在关系真的前进时用，普通暧昧不用。"
      : "\n\nfx: whether this turn gets an effect. Both default to null; most turns should have none, or effects stop feeling special. Choose only for something really happening now that the player can perceive; metaphors, negations, hypotheticals, memories, words merely mentioned in chat, and names are not events (\"it won't rain tonight\", a man named Storm: null). Nothing that hasn't happened yet or that a character might refuse." +
        "\n- ambient: only when the environment really changes; it lasts until the next change. If nothing changed use null, don't repeat the current value. Current: " + cur + ". Options: " + list(AMBIENT) + "; none returns to calm." +
        "\n- moment: only the single most important beat of this turn, at most two or three per chapter. Options:\n  " + groups +
        "\nRomance and emotion effects only when the relationship really moves forward, not for ordinary flirting.";
  }

  /* ---------- 环境和文字对得上（2026-11-06 玩家：一进《黑港》就下暴雨，剧情里一个雨字都没有）----------
     持续氛围是玩家看得见的事实：导演和角色都要知道现在画面上是什么，章节卡也要写出来。
     MENTION = 文字里出现这些字，就算已经写到了这个环境（api/_stylecheck.js 有同一份，审查时用） */
  const MENTION = { rain: /雨/, storm: /雨|雷(?:声|电|鸣|暴)|打雷|闪电/, wind: /(?:大|狂|寒|海|夜|冷|晚)风|风(?:声|很大|吹|刮|灌)/, snowfall: /雪/, blizzard: /雪/, ice: /冰|冻|严寒/, candle: /烛/, embers: /炉火|篝火|壁炉/, inferno: /火灾|着火|火光|大火|火势/,
    blackout: /停电|断电|灯.{0,4}(?:灭|黑)|应急灯|黑暗/, drip: /漏水|滴水|地下室/, neon: /霓虹|夜店/, godrays: /阳光|日光|光束|晨光/, dust: /灰尘|浮尘|尘埃/, fireflies: /萤火/, aurora: /极光/, galaxy: /星空|星星|银河/, petals: /花瓣/ };
  function label(id, wantZh) { const r = AMBIENT.find(x => x[0] === id); return r ? r[wantZh ? 1 : 2] : ""; }
  function mentioned(id, text) { const re = MENTION[id]; return !re || re.test(String(text || "")); }
  function envLine(th, wantZh) {
    const cur = th && typeof fxKeyOf === "function" && fxKeyOf(th); const lb = cur && cur !== "none" && label(cur, wantZh);
    if (!lb || (typeof S !== "undefined" && S.fxOff)) return "";
    return wantZh ? "\n画面上正在显示的环境：" + lb + "（玩家看得见）。旁白和台词要和它一致，可以顺带写到，不能写成没有这回事；剧情里环境真的变了才在 fx.ambient 里换。"
      : "\nThe screen is currently showing: " + lb + " (the player can see it). Keep narration and dialogue consistent with it; mention it naturally if relevant, never contradict it. Change fx.ambient only if the environment really changes.";
  }

  /* ---------- 剧本旁白的兜底（AI 台词不走这里，由智能体判断）---------- */
  const SCRIPT_RULES = [
    [/爆炸声?|炸弹炸|explosion/i, "explosion"], [/枪响|枪声|开了一枪|中弹|gunshot/i, "flash_red"], [/玻璃(?:碎|炸|裂)|碎了一地|shattered/i, "glass_crack"],
    [/发生地震|地震了|地面(?:剧烈)?(?:震动|摇晃)|earthquake/i, "quake"], [/闪电|惊雷|雷声|打雷|lightning/i, "lightning"], [/着火了|火海|火光冲天|caught fire|burst into flames/i, "blaze"],
    [/警笛|警车|police car|sirens/i, "police"], [/救护车|ambulance/i, "ambulance"], [/放烟花|烟花(?:炸|升|绽)|fireworks/i, "fireworks"],
    [/吻了|吻住|吻上|接吻|kissed/i, "bloom"], [/晕倒|昏迷|失去意识|fainted|passed out/i, "fade_black"], [/落泪|流泪|泪水|哭了|in tears/i, "tears"],
    [/手机(?:突然|又)?(?:震|响)|phone buzzed/i, "phone_buzz"], [/快门|闪光灯|camera flash|shutter clicked/i, "flash_white"], [/求婚|proposed to|down on one knee/i, "ring"], [/表白|告白|confessed (?:his|her|their|my) love/i, "heart_burst"],
    [/心跳(?:加速|得很快|如鼓|漏了一拍)|心脏狂跳|heart pounding/i, "heartbeat"],
    [/踹开|摔门|砸碎|狠狠撞|重重摔|slammed/i, "shake"], [/警报(?:响|声)|alarm/i, "danger"], [/停电了|突然断电|灯(?:突然)?全灭|power cut/i, "blackout"],
    [/下起(?:了)?(?:大|小|暴)?雨|开始下雨|started raining/i, "rain"], [/下起(?:了)?(?:大|小)?雪|开始下雪|started snowing/i, "snowfall"], [/起雾了|大雾弥漫/, "fog"],
    [/月光(?:洒|落|照|铺)|moonlight fell/i, "moonlight"], [/阳光(?:洒|照|透|落|铺)|sunlight (?:fell|poured)/i, "sun_rays"], [/夕阳(?:西下|落)|晚霞/, "sunset"], [/抱住|抱紧|拥抱了|embraced/i, "bloom"],
  ];
  /* 一个分句里出现否定、假设、比喻或回忆，就不算真的发生 */
  const NOT_REAL = /[不没未别无]|如果|假如|要是|万一|也许|可能|会不会|怕|像|仿佛|好像|似的|一样|以为|记得|当年|那年|n't|\bnot\b|\bno\b|\bnever\b|\bif\b|\blike\b|\bas if\b/i;
  const NOT_NEG = /忍不住|不由|不禁|不及|不知不觉|不停|没想到|别人|无声/g; /* 这些带否定字，但事情确实发生了 */
  function happened(re, text) {
    return String(text || "").split(/[。！？!?；;，,\n…—]+/).some(c => re.test(c) && !NOT_REAL.test(c.replace(NOT_NEG, "")));
  }
  function fromScript(th, text) {
    if (!th || th.id !== curT || S.autoFx === false) return false;
    const hit = SCRIPT_RULES.find(([re]) => happened(re, text));
    return hit ? moment(th, hit[1], "script") : false;
  }

  /* ---------- 开关：一个按钮，点开选 ---------- */
  const realVibrate = navigator.vibrate ? navigator.vibrate.bind(navigator) : null;
  if (realVibrate) { try { navigator.vibrate = p => (typeof S !== "undefined" && S.vibOff ? false : realVibrate(p)); } catch (e) { console.warn("[fx] vibrate", e); } }
  const ICON = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 6h7M14 6h3M3 14h3M10 14h7"/><circle cx="12" cy="6" r="2"/><circle cx="8" cy="14" r="2"/></svg>';
  const ROWS = () => [
    ["bgm", zh() ? "音乐" : "Music", typeof bgmOn === "function" ? bgmOn() : true],
    ["voice", zh() ? "语音" : "Voice", !!S.autoVoice],
    ["fx", zh() ? "特效" : "Effects", !S.fxOff, zh() ? "画面、音效、震动" : "Visuals, sound, vibration"],
  ];
  let open = false;
  function panelHTML() {
    return ROWS().map(([k, label, on, note]) => '<button role="switch" aria-checked="' + on + '" data-fxt128="' + k + '"><span>' + esc(label) + (note ? '<small>' + esc(note) + '</small>' : '') + '</span><i></i></button>').join("");
  }
  function place() {
    const btn = document.querySelector(".chead .fx128"), panel = document.getElementById("fxp128"), scr = document.getElementById("s-chat");
    if (!panel) return;
    if (!open || !btn || !scr) { panel.remove(); return; }
    const a = btn.getBoundingClientRect(), s = scr.getBoundingClientRect();
    panel.style.top = (a.bottom - s.top + 6) + "px"; panel.style.right = (s.right - a.right) + "px";
    panel.innerHTML = panelHTML();
  }
  function toggleOpen(v) {
    open = v;
    let panel = document.getElementById("fxp128"); const scr = document.getElementById("s-chat"), btn = document.querySelector(".chead .fx128");
    if (btn) btn.setAttribute("aria-expanded", String(open));
    if (open && !panel && scr) { panel = document.createElement("div"); panel.id = "fxp128"; panel.setAttribute("role", "group"); scr.appendChild(panel); }
    place();
  }
  /* 现在的状态同步给正在跑的画面和声音，开关立刻生效 */
  function apply() {
    const th = S.threads[curT];
    document.body.classList.toggle("fx-off", !!S.fxOff);
    if (S.fxOff) document.querySelectorAll(".fx100").forEach(el => el.remove());
    if (S.sfxOff && typeof sfxStop === "function") { sfxStop(); if (typeof SFX !== "undefined") SFX.cur = null; }
    if (th && typeof chatFx === "function") chatFx(th);
  }
  function header() {
    const r = document.querySelector("#s-chat .chead .row"), anchor = r && r.querySelector("[data-cmenu]"); if (!anchor) return;
    if (!r.querySelector(".fx128")) anchor.insertAdjacentHTML("beforebegin", '<button class="ibtn fx128" data-fxp128="1" aria-haspopup="true" aria-expanded="' + open + '" aria-label="' + (zh() ? "声音与特效" : "Sound and effects") + '">' + ICON + '</button>');
    document.body.classList.toggle("fx-off", !!S.fxOff);
    if (open) { const scr = document.getElementById("s-chat"); if (scr && !document.getElementById("fxp128")) toggleOpen(true); else place(); }
  }
  document.addEventListener("click", e => {
    if (e.target.closest("[data-fxp128]")) { e.preventDefault(); e.stopImmediatePropagation(); toggleOpen(!open); return; }
    const row = e.target.closest("[data-fxt128]");
    if (row) {
      e.preventDefault(); e.stopImmediatePropagation();
      const k = row.dataset.fxt128;
      if (k === "bgm") { const b = document.querySelector(".chead .bgmtog"); if (b) b.click(); if (typeof SFX !== "undefined") SFX.cur = null; apply(); }
      else if (k === "voice") { const b = document.querySelector(".chead .vtog"); if (b) b.click(); }
      else { const off = !S.fxOff; S.fxOff = S.sfxOff = S.vibOff = off; save(); apply(); if (!off) { if (realVibrate) realVibrate(30); if (typeof sfx100 === "function") sfx100("pop", .5); } }
      place();
      return;
    }
    if (open && !e.target.closest("#fxp128,[data-bgm],[data-vtog]")) toggleOpen(false);
  }, true);
  if (window.UI && typeof window.UI.add === "function") window.UI.add("fx128", header);
  else console.warn("[fx] UI.add 不在，声音与特效按钮不会显示");

  window.FXBUS = { AMBIENT, MOMENT, MENTION, resolve, moment, ambient, agent, authored, promptBlock, happened, fromScript, label, mentioned, envLine };
})();
