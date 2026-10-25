/* ================= 场景计划层（文档 §05 Plot98 的最小可用部分）=================
   文档 01.2 的两条路径里，Slow Path 是「新场景无计划 / 重大变化 / 真正停滞 / 主线耗尽
   → Plot98 按需生成候选 → Validator 核验 → 缓存场景计划 → 并入下一轮」。

   这一层只做**判断**与**缓存**，不做生成：
     T17  已有计划   ⇒ 不再调用（call:false）          —— 防"普通对话每轮都问导演"
     T18  新场景无计划 ⇒ 只触发一次（call:true 一次，之后 call:false）
     T25  计划层挂了   ⇒ 返回 {call:false, why:'error'}，**绝不阻断正常对话**
     T16/T19 需要"生成 + 核验 + 发布"，依赖一个真正的计划生成器 —— 不在这里假装有

   为什么先做这一层：它把"要不要花一次调用"变成可测的布尔量，零模型成本；
   而生成器一旦接上，缓存与去重已经就位。 */

/** 同一份计划的键：作品 + 章节（自由聊天没有 pk 就用 th.ch，都没有当第 1 章）。 */
function planKey(th) {
  try {
    const wid = (th && th.wid) || "?";
    const n = Number((th && th.pk && th.pk.ch) || (th && th.ch) || 1);
    return wid + "#" + n;
  } catch (_) { return "?#1" }
}

/** 当前场景有没有可用的计划（有 ⇒ 直接用，不再调用）。 */
function planGet(th) {
  try {
    const c = (th && th.planCache) || {};
    const p = c[planKey(th)] || null;
    if (!p) return null;
    // T16：计划里带的剧本版本与当前不一致 ⇒ 当作没有（旧计划不许覆盖新剧本）
    try {
      const cur = (typeof MIRU_REV !== "undefined" && th && th.wid) ? MIRU_REV[th.wid] : null;
      if (cur && p.rev && p.rev !== cur) { delete c[planKey(th)]; return null; }
    } catch (_) {}
    return p;
  } catch (_) { return null }
}

/**
 * 要不要为这个场景触发一次计划生成。
 * @returns {{call:boolean, why:string, key:string}}
 */
function planDecide(th) {
  const key = planKey(th);
  try {
    if (!th) return { call: false, why: "no-thread", key: key };
    const have = (th.planCache || {})[key];
    if (have) return { call: false, why: "reuse", key: key };         // T17
    th.planTry = th.planTry || {};
    if (th.planTry[key]) return { call: false, why: "already-tried", key: key }; // T18：只试一次
    return { call: true, why: "no-plan", key: key };
  } catch (_) {
    return { call: false, why: "error", key: key };                    // T25：出错就不调用，对话照常
  }
}

/** **计划层的入口（2026-10-25 Ann 拍：留个入口位置，先不动玩家看得见的东西）**
 *
 *  这是"以后要接生成器"的唯一接口。今天它**只观测**：
 *    · 调 planDecide 判断这一场本来会不会需要续写；
 *    · 需要就记一条 `plot_would_continue` 事件；
 *    · **不生成、不改写、不影响这一场怎么写**（返回值目前无人消费）。
 *
 *  为什么要有它（而不是留着四个没人调的函数）：死代码和"还没接的接口"在 grep 里长得一样，
 *  而 `tools/wiring-check.mjs` 只认调用点。有了这个入口，计划层就是**接上线但不产生行为**，
 *  闸能看着它；等 Ann 要 B（真生成）时，改这里一处即可。
 */
function plotGate(th) {
  try {
    if (typeof MIRU_TUNE !== "undefined" && MIRU_TUNE.chat && MIRU_TUNE.chat.planGate === false) {
      return { ok: false, skipped: true, call: false, why: "tune-off" };
    }
    const d = planDecide(th);
    const call = !!(d && d.call);
    if (call) {
      try {
        track && track("plot_would_continue", {
          wid: (th && th.wid) || "",
          ch: (th && th.pk && th.pk.ch) || 0,
          key: (d && d.key) || "",
        });
      } catch (_) {}
    }
    return { ok: true, call: call, why: (d && d.why) || "", key: (d && d.key) || "" };
  } catch (_) { return { ok: false, call: false, why: "error" } }
}

/** 记一次尝试（无论成功失败），保证同一场景不会被反复触发。 */
function planTried(th, ok) {
  try {
    const key = planKey(th);
    th.planTry = th.planTry || {};
    th.planTry[key] = ok ? "ok" : "failed";
    return key;
  } catch (_) { return "" }
}

/** 收到候选计划后写入缓存（校验是调用方的事；这里只接受对象）。 */
function planSet(th, plan) {
  try {
    if (!plan || typeof plan !== "object") return false;
    const key = planKey(th);
    th.planCache = th.planCache || {};
    // T16：写的时候记下当前剧本版本，取用时（planGet）比对
    try {
      const cur = (typeof MIRU_REV !== "undefined" && th && th.wid) ? MIRU_REV[th.wid] : null;
      if (cur && !plan.rev) plan = Object.assign({}, plan, { rev: cur });
    } catch (_) {}
    th.planCache[key] = plan;
    return true;
  } catch (_) { return false }
}
