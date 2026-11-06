/* ================= 开场编剧（2026-11-06 · 产品级）=================
   每个故事进入后都要有：故事背景、本章的时间 / 地点 / 人物 / 眼前的事 / 导语、两句引导对白。
   剧本没写的，由这里补写。谁写的优先级：编剧 > 上传时补写（tools/opening-backfill.mjs，存进剧本）> 游戏中兜底（app98 的 opening98）。

   这一份只有提示词和结果校验，不碰页面也不碰网络：浏览器和命令行用的是同一份，规则只写一次。
   只给它当前这一章和之前的内容，不给后面的章节和结局，补写出来的东西就不会剧透。 */
var OPENING_CORE = (function () {
  "use strict";
  var LIMIT = { time: 18, event: 40, text: 120, say: 45 };
  var cut = function (s, n) { s = String(s == null ? "" : s).replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n) : s; };

  /* o = { title, premise, world, playerRole, cast:[{key,name,role,voice,archetype,expression,sample}], prev:[文本],
          chapter:{ n, title, place, time, goal, beat, present:[key], given:{time,event,text} } } */
  function prompt(o) {
    var c = o.chapter || {}, present = (o.cast || []).filter(function (x) { return (c.present || []).indexOf(x.key) >= 0; });
    var people = (present.length ? present : (o.cast || []).slice(0, 2)).map(function (x) {
      return "- key=" + x.key + "｜" + x.name + "｜" + (x.role || "") + (x.archetype ? "｜人设：" + x.archetype : "") + (x.expression ? "｜嘴上和心里：" + x.expression : "") + (x.voice ? "｜说话方式：" + x.voice : "") + (x.sample ? "｜说话的样子：" + x.sample : "");
    }).join("\n");
    var given = c.given || {};
    return "你是互动恋爱剧的开场编剧。玩家马上要进入第 " + c.n + " 章，你要写章节卡片上的内容：让玩家一看就知道现在在哪、发生什么，并且知道可以怎么接话。" +
      "\n\n作品：" + (o.title || "") + "\n简介：" + cut(o.premise, 300) + "\n世界：" + cut(o.world, 500) + "\n玩家：" + cut(o.playerRole, 80) + "（玩家就是“你”）" +
      "\n\n本章在场的人物（只能让他们说话）：\n" + people +
      "\n\n第 " + c.n + " 章「" + (c.title || "") + "」" +
      (c.place ? "\n地点：" + c.place : "") + (c.time ? "\n作者写的时间：" + c.time : "") +
      (c.goal ? "\n本章要发生的事：" + cut(c.goal, 300) : "") + (c.beat ? "\n本章安排：" + cut(c.beat, 600) : "") +
      (o.prev && o.prev.length ? "\n\n之前发生过的事：\n" + o.prev.slice(-4).map(function (x) { return "- " + cut(x, 120); }).join("\n") : "") +
      "\n\n要写的内容：" +
      (given.time ? "" : "\n- time：时间，" + LIMIT.time + " 字内，如“首映礼前·初次见面”。") +
      (given.event ? "" : "\n- event：眼前的事，一句话，" + LIMIT.event + " 字内，说清此刻发生什么。") +
      (given.text ? "" : "\n- text：章节导语，两三句眼前的画面，" + LIMIT.text + " 字内，第二人称“你”。") +
      "\n- lines：两句开场对白，通常两个在场人物各一句（只有一个人在场就一句）。每句 " + LIMIT.say + " 字内，要有这个人物的人设味道，最后留一个钩子：一个问题、一个邀请或一句等玩家接的话。" +
      "\n\n规则：只写这一章开头的情境，不剧透后面的事；不替玩家说话、做动作或做决定，不写玩家的感受；不写“第几章”；不加引号、标签、表情符号；全部用简体中文。" +
      '\n\n只回复 JSON：{"time":"","event":"","text":"","lines":[{"who":"人物 key","say":"台词"}]}';
  }

  /* 把模型的结果收紧到版式能放下的样子；不合格的项直接丢掉，不让坏内容上卡片 */
  function validate(r, o) {
    r = r && typeof r === "object" ? r : {};
    var c = (o && o.chapter) || {}, keys = (c.present && c.present.length ? c.present : ((o && o.cast) || []).map(function (x) { return x.key; }));
    var clean = function (s, n) { return cut(String(s || "").replace(/^[“"「『]+|[”"」』]+$/g, "").replace(/^(时间|地点|眼前的事|导语)[：:]/, ""), n); };
    var out = { time: clean(r.time, LIMIT.time), event: clean(r.event, LIMIT.event), text: clean(r.text, LIMIT.text), lines: [] };
    (Array.isArray(r.lines) ? r.lines : []).forEach(function (l) {
      if (!l || out.lines.length >= 2) return;
      var who = String(l.who || "").trim(), say = clean(l.say, LIMIT.say + 10);
      if (keys.indexOf(who) < 0 || !say || say.length > LIMIT.say + 10) return;
      if (out.lines.some(function (x) { return x.who === who; }) && keys.length > 1) return;
      out.lines.push({ who: who, say: say });
    });
    return out;
  }
  return { prompt: prompt, validate: validate, LIMIT: LIMIT };
})();
if (typeof module !== "undefined" && module.exports) module.exports = OPENING_CORE;
