/* ================= 台词守门（他们 v8.2.3 的「角色台词检查」）=================
   玩家最痛的一条是「角色全知」：角色说出了本章他还不该知道的事。

   我们原先只做了**半边**——不把秘密写进他的提示词（castCardPublic）。那挡不住模型自己编：
   它仍然可能从上下文里推出一个还没揭露的秘密，然后说出口。

   这里补另外半边，三步（对应他们清单里的「先让模型重写一次；还不对，就换成保守的回答」）：
     ① 干净 → 原样用
     ② 命中禁区词 → **带约束重写一次**（告诉模型不能说哪些词）
     ③ 重写仍命中 → **换成保守句**（一句话，不推进剧情），并记一次事件

   禁区词从哪来：`MIRU_MARKS[wid].chapters` 里**尚未到达**的章节的 reveals/breaks，
   加上该角色卡片上还没揭露的 secret / twist。
   注意口径：只有当章已经发生过的事**不**进禁区——那正是"他现在知道了"。

   为什么要注入 ask 而不是自己调：这样整套能在 Node 里用假 ask 跑真函数（见 tools/replyguard-selftest.mjs）。
*/

/** 取某个世界、某一章的禁区词。ch 是 1-based 章节号。 */
function marksForbidden(wid, ch) {
  const out = [];
  try {
    if (typeof MIRU_MARKS === "undefined" || !MIRU_MARKS) return out;
    const w = MIRU_MARKS[wid];
    if (!w || !w.chapters) return out;
    const cur = Math.max(1, Number(ch) || 1);
    for (const k of Object.keys(w.chapters)) {
      const at = Number(k);
      if (!(at > cur)) continue;               // 只有"未来"的事才是禁区
      const box = w.chapters[k] || {};
      const add = (o) => {
        if (!o || typeof o !== "object") return;
        for (const who of Object.keys(o)) {
          const v = o[who];
          if (typeof v === "string") { out.push({ t: v, who }); continue }
          if (v && typeof v === "object") {
            for (const kk of Object.keys(v)) out.push({ t: kk, who });   // breaks: {noor:{promised:1}}
          }
        }
      };
      add(box.reveals); add(box.breaks);
    }
  } catch (_) {}
  return out;
}

/** 卡片上的 secret / twist —— 还没揭露时也不许说出口。 */
function cardForbidden(th, ids) {
  const out = [];
  try {
    if (typeof ch !== "function") return out;
    for (const id of (ids || [])) {
      const c = ch(id);
      if (!c) continue;
      for (const f of ["secret", "twist"]) {
        const v = c[f];
        const t = v && (typeof v === "string" ? v : (v.zh || v.en));
        if (t) out.push({ t: String(t), who: id });
      }
    }
  } catch (_) {}
  return out;
}

/** 回复里命中了哪些禁区词。返回命中的词（去重）。 */
function leakHits(text, words) {
  const s = String(text || "");
  if (!s) return [];
  const hit = new Set();
  for (const w of (words || [])) {
    const t = String((w && w.t) || "").trim();
    if (t.length < 3) continue;              // 太短的词会误伤（"球"这种）
    if (s.indexOf(t) >= 0) hit.add(t);
  }
  return Array.from(hit);
}

/** 把回复里所有 beat 的 text 拼起来（守门只看台词）。 */
function beatsText(rep) {
  try {
    return (rep && Array.isArray(rep.beats) ? rep.beats : []).map(b => String((b && b.text) || "")).join("\n");
  } catch (_) { return "" }
}

/**
 * 守门主函数。
 * @param {object} o
 * @param {object} o.reply      第一次的回复（可能为 null）
 * @param {string[]} o.words    禁区词
 * @param {function} o.ask      重写用：(extraPrompt) => Promise<reply|null>
 * @param {function} o.fallback 保守回复：() => reply
 * @returns {Promise<{reply, retried:boolean, leaked:string[], fellBack:boolean}>}
 */
async function guardReply(o) {
  const opts = o || {};
  const words = opts.words || [];
  const first = opts.reply;
  const hits1 = leakHits(beatsText(first), words);
  if (!first || !hits1.length) return { reply: first, retried: false, leaked: [], fellBack: false };

  let second = null;
  if (typeof opts.ask === "function") {
    try {
      second = await opts.ask(
        "REWRITE. Your previous reply mentioned something this character does not know yet: " +
        hits1.join(" / ") + ". Rewrite the SAME moment without any of those words or ideas. " +
        "If the moment depends on them, have the character circle the subject, guess wrong, or say nothing about it. " +
        "Keep everything else identical."
      );
    } catch (_) { second = null }
  }
  const hits2 = leakHits(beatsText(second), words);
  if (second && Array.isArray(second.beats) && second.beats.length && !hits2.length) {
    return { reply: second, retried: true, leaked: hits1, fellBack: false };
  }

  // 两次都漏 ⇒ 保守句（不推进剧情，也不透露）
  const safe = (typeof opts.fallback === "function") ? opts.fallback() : null;
  return { reply: safe, retried: true, leaked: hits1.concat(hits2), fellBack: true };
}
