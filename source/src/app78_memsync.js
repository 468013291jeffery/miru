/* ---- v3.1 · 记忆系统 第二阶段：记忆存进云端数据库 + 按意思召回 ----
   登录用户：记忆增删改 3 秒内同步到服务器（/api/state?r=mem）。每次回复前，用你刚说的话去召回最相关的记忆——
   有向量接口就按向量相似度，没有就让免费的 Flash 模型按意思挑；最多等 2.5 秒，超时就用本机的第一阶段算法，不拖慢回复。
   会员档位还会召回同一角色在其他故事里的相关记忆。删除记忆（忘掉）会同步删除服务器上的那一条。 */
const M78 = { t: {}, busy: {} };
const m78on = () => typeof CL0 !== "undefined" && CL0.on && typeof capi === "function" && !S.m2off;
const m78h = x => [x.t, x.type, x.imp, x.pin ? 1 : 0, x.hush ? 1 : 0, (x.who || []).join(",")].join("|");
async function m78sync(th) {
  if (!m78on() || !th || M78.busy[th.id]) return; M78.busy[th.id] = 1;
  try {
    const items = m2(th).filter(x => !x.del && x._h !== m78h(x)).slice(0, 150);
    const gone = (th._m2gone || []).slice(0, 300);
    if (!items.length && !gone.length) return;
    const r = await capi("/state?r=mem", { json: { op: "sync", thread: th.id, cast: th.cast || [], items: items.map(x => ({ id: x.id, t: x.t, type: x.type, imp: x.imp, who: x.who, src: x.src, pin: !!x.pin, hush: !!x.hush, at: x.at })), gone } });
    if (r && r.ok) { items.forEach(x => { x._h = m78h(x); }); th._m2gone = (th._m2gone || []).filter(id => !gone.includes(id)); save(); }
  } catch (_) {} finally { M78.busy[th.id] = 0; }
}
function m78soon(th) { if (!m78on() || !th) return; clearTimeout(M78.t[th.id]); M78.t[th.id] = setTimeout(() => m78sync(th), 3000); }
async function m78recall(th) {
  if (!m78on() || !th) return;
  const u = [...th.msgs].reverse().find(m => m.who === "me" && m.txt); if (!u) return;
  if (th._m2rec && th._m2rec.q === u.txt) return;
  const tier = typeof memTier === "function" ? memTier(th) : "free";
  try {
    m78sync(th); // don't wait: recall answers from what the server already has
    const r = await Promise.race([capi("/state?r=mem", { json: { op: "recall", thread: th.id, cast: th.cast || [], query: String(u.txt).slice(0, 600), k: (MEMT[tier] || MEMT.free).mem + 4, cross: tier !== "free" } }), new Promise(res => setTimeout(() => res(null), 3000))]);
    if (r && r.ok && r.j) {
      const items = r.j.items || [];
      th._m2rec = { q: u.txt, mode: r.j.mode, ids: items.filter(x => x.thread === th.id).map(x => x.id), cross: items.filter(x => x.thread !== th.id).slice(0, tier === "deep" ? 8 : 3).map(x => x.t), at: Date.now() };
    }
  } catch (_) {}
}
/* every reply waits (≤2.5 s) for recall so the prompt carries the right memories */
reply = (function (orig) { return async function (th, ctx, silent) { try { if (!silent) await m78recall(th); } catch (_) {} return orig.apply(this, arguments); }; })(reply);
/* sync after memories change */
appendMsg = (function (orig) { return function (th) { const r = orig.apply(this, arguments); try { m78soon(th); } catch (_) {} return r; }; })(appendMsg);
document.addEventListener("click", e => { if (e.target.closest && e.target.closest("[data-m2pin],[data-m2hush],[data-m2del],[data-m2addgo]")) { const th = S.threads[curT]; setTimeout(() => m78soon(th), 50); } });
/* first sign-in on this device: push every thread's memories once */
setTimeout(() => { try { if (!m78on() || S.m78init) return; S.m78init = 1; save(); Object.values(S.threads || {}).forEach((th, i) => setTimeout(() => m78sync(th), 800 * i)); } catch (_) {} }, 6000);
/* the memory page shows where memories live and how recall works now */
m2Sheet = (function (orig) { return function () { orig.apply(this, arguments); try { const th = S.threads[curT]; const box = document.querySelector(".m2s .m2off"); if (!box || document.querySelector(".m78st")) return;
  const on = m78on(), R = th && th._m2rec, mode = R && R.mode;
  box.insertAdjacentHTML("beforebegin", '<p class="m78st xs faint">' + (on ? "☁️ " + LL("记忆已保存到你的账号，换手机也在。", "Saved to your account — follows you to any device.") + (mode ? " · " + LL("上次按", "Last recall: ") + ({ vector: LL("语义向量", "meaning (vectors)"), model: LL("AI 按意思挑选", "meaning (AI pick)"), empty: LL("暂无可召回", "nothing yet"), none: "—", error: LL("本机", "on device") }[mode] || mode) + LL("召回", "") : "") : "📱 " + LL("登录后，记忆会保存到账号，并按意思召回。", "Sign in to keep memories in your account and recall them by meaning.")) + '</p>'); } catch (_) {} }; })(m2Sheet);
