/* ================= 情绪合同（文档 §14.1 T01–T04）=================
   「heat」与「情绪标签」在代码里原本各说各的：heat 是包上的一个字符串（fluff/slow/steamy/mature），
   情绪只在**创作表单**里有个 max:2 的勾选（cozy/romcom/angst/dark/thrill），
   运行时既不校验、也不补默认、也不去重。这一层把四件事做成纯函数：

     T01 什么都没有 → 缺省 heat=steamy、emotions=['angst']
     T02 fluff/cozy（暖）不得与 steamy/angst（烈）混用
     T03 多标签去重，主/辅顺序稳定（先出现的在前）
     T04 非法 heat / 超过两个情绪 / 暖烈冲突 → 返回明确错误，不静默吞掉

   为什么默认值写成「steamy + angst」而不是更保守的：那是文档明确要求的缺省（§14.1 T01），
   而且**只在完全没写的时候生效** —— 现有 37 部剧本都写了 heat（slow 29 / fluff 6 / steamy 2），
   所以加这一层对它们一个字节都不改。 */

const EMO_HEAT = ["fluff", "slow", "steamy", "mature"];
const EMO_KEYS = ["cozy", "romcom", "angst", "dark", "thrill"];
const EMO_WARM = ["cozy", "romcom"];      // 暖
const EMO_HOT = ["angst", "dark", "thrill"]; // 烈（与暖冲突）

/** @returns {{heat:string, emotions:string[], errors:string[], notes:string[]}} */
function emotionNorm(input) {
  const inObj = (input && typeof input === "object") ? input : {};
  const errors = [], notes = [];

  // ---- heat ----
  let heat = String(inObj.heat == null ? "" : inObj.heat).trim().toLowerCase();
  if (!heat) {
    heat = "steamy";
    notes.push("heat 缺省为 steamy");
  } else if (EMO_HEAT.indexOf(heat) < 0) {
    errors.push("heat 非法：" + heat + "（只接受 " + EMO_HEAT.join(" / ") + "）");
    heat = "steamy";
  }

  // ---- emotions：去重 + 白名单 + 上限 2 + 顺序稳定 ----
  const raw = Array.isArray(inObj.emotions) ? inObj.emotions
    : (typeof inObj.emotions === "string" ? String(inObj.emotions).split(/[,，\s]+/) : []);
  let emotions = [];
  for (const e of raw) {
    const k = String(e == null ? "" : e).trim().toLowerCase();
    if (!k) continue;
    if (EMO_KEYS.indexOf(k) < 0) { errors.push("情绪标签非法：" + k); continue; }
    if (emotions.indexOf(k) >= 0) continue;             // 去重
    emotions.push(k);
  }
  if (!emotions.length) { emotions = ["angst"]; notes.push("emotions 缺省为 [angst]"); }
  if (emotions.length > 2) {
    errors.push("情绪标签最多两个，收到 " + emotions.length + " 个：" + emotions.join(","));
    emotions = emotions.slice(0, 2);
  }

  // ---- 暖 / 烈 冲突（T02）----
  const warm = emotions.filter(x => EMO_WARM.indexOf(x) >= 0);
  const hot = emotions.filter(x => EMO_HOT.indexOf(x) >= 0);
  if (warm.length && hot.length) {
    errors.push("暖与烈混用：" + warm.join(",") + " + " + hot.join(","));
  }
  if (heat === "fluff" && hot.length) {
    errors.push("heat=fluff 却带了烈性情绪：" + hot.join(","));
  }

  return { heat: heat, emotions: emotions, errors: errors, notes: notes };
}

/** 一句话摘要（给 prompt 用；没有任何情绪时返回空串，不污染上下文）。 */
function emotionLine(input) {
  const r = emotionNorm(input);
  const bits = [];
  if (r.emotions.length) bits.push("tone: " + r.emotions.join(" + "));
  if (r.notes.length) bits.push("");
  return bits.filter(Boolean).join(" · ");
}

/** 年龄门（文档 §14.1 T08）：未确认成年时，把 heat 上限压到 slow。
 *  开关是 MIRU_TUNE.tools.ageGate，**默认关** —— 要不要对现有用户强制确认，是产品决定，
 *  不是我能替他定的。开着的时候，没确认（S.ageOk !== true）就压到 slow。 */
function ageAllowed() {
  try {
    if (typeof MIRU_TUNE === "undefined" || !MIRU_TUNE.tools || !MIRU_TUNE.tools.ageGate) return true; // 开关没开 ⇒ 不限制
    if (typeof S === "undefined") return true;
    return S.ageOk === true;
  } catch (_) { return true }
}

/** 按年龄门把 heat 降级：未确认 ⇒ steamy/mature 一律回到 slow（fluff 不动，它本来就不露骨）。 */
function heatGated(heat) {
  try {
    const h = String(heat || "steamy").toLowerCase();
    if (ageAllowed()) return h;
    return (h === "steamy" || h === "mature") ? "slow" : h;
  } catch (_) { return "slow" }
}
