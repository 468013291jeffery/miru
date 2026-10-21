/* ---- v3.3 · 文字主力切到 DeepSeek：让提示词能吃到「缓存命中」价 ----
   DeepSeek 按前缀自动缓存（命中价约为未命中的 1/50）。原来的回复提示词是「剧情 + 记忆 + 对话 → 写作规则 + 输出格式」，
   前面每轮都在变，所以几乎命中不了。这里把不变的部分（开头身份句 + 写作规则 + 输出格式）挪到 system 消息放在最前，
   变化的剧情、记忆、账本、对话放在后面的 user 消息里——内容一字不少，只是换了位置。其他调用保持原样。 */
lcMsgs = (function (orig) { return function (input) {
  try {
    if (typeof input === "string" && input.indexOf("You write MIRU") === 0) {
      const a = input.indexOf("HOW TO WRITE");
      if (a > 0) {
        const nl = input.indexOf("\n"), head = input.slice(0, nl), mid = input.slice(nl + 1, a);
        let tail = input.slice(a), dyn = "";
        const lc = tail.indexOf("\n\nLEDGER CHECK"); if (lc >= 0) { dyn = tail.slice(lc); tail = tail.slice(0, lc); }
        // per-turn bits inside the rules (heat line, language) are few fixed variants, so the cache still hits
        const L = mid.split("\n"), iNow = L.findIndex(l => /^NOW:/.test(l)), iHeat = L.findIndex((l, i) => i > iNow && /^HEAT CEILING/.test(l));
        if (iNow > 0 && iHeat > iNow) {
          const rules = L.slice(iHeat).join("\n"), story = [], live = [], now = []; let inCast = false;
          L.slice(0, iNow + 1).forEach(l => {
            if (/^CAST \(/.test(l)) { inCast = true; story.push(l); return; }
            if (inCast && /^- id=/.test(l)) { const k = l.indexOf(" · Closeness to "); if (k > 0) { story.push(l.slice(0, k)); const id = (l.match(/^- id=([^\s·]+)/) || [])[1] || ""; now.push("- " + id + " right now:" + l.slice(k + 2)); } else story.push(l); return; }
            inCast = false;
            if (/^(STORY|SCENE|THE USER'S ROLE|WHAT'S AT STAKE): |^THE USER: /.test(l)) story.push(l); else live.push(l);
          });
          // system = identity + writing rules + output format + this story's fixed cast (stable for the whole thread → cache hits);
          // user = what changes every turn (status, ledger, memory, transcript, the instruction for this turn)
          return [{ role: "system", content: head + "\n\n" + rules + "\n" + tail + "\n\nTHIS STORY:\n" + story.join("\n") }, { role: "user", content: (now.length ? "CAST RIGHT NOW (closeness and mood change every turn):\n" + now.join("\n") + "\n" : "") + live.join("\n").trim() + dyn }];
        }
        return [{ role: "system", content: head + "\n\n" + tail }, { role: "user", content: mid.trim() + dyn }];
      }
    }
  } catch (_) {}
  return orig.apply(this, arguments);
}; })(lcMsgs);
