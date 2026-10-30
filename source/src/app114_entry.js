/* ================= 进去的身份，永远是三条（2026-10-30）=================
   症状（Ann 报的）：「好像现在进去只有导演视角，别的视角没了」。
   实测（tools/entry-modes-probe）：内置 38 部剧每部都有三条（导演 / 扮演 X / 加入场景），
   但**这条路一直是由数据决定的** ——

       packModes(w) = [🎬 导演视角] ++ (w.pack.join || [])

   于是「谁能进去」取决于制作时有没有写 `join`：`heir` 没写「加入场景」，
   创建器做的剧只写「扮演主角」（app49/app50 都只塞一个元素），换个来源导入的又是一种。
   ⇒ 少写一条，玩家就少一条路，而且**没有任何东西会红**。

   判据（Ann 给的）：**不管对方给的是什么，三路都在**；缺的补上，并返回一条提示。

   形状：
     entryModes(w) → { modes: [ {as, t, src} ], hint }
       src = 'data'    剧本自己写的
           = 'derived' 我们按剧本人物补的（主角 = pov → love → cast[0]，且必须 ch() 认识）
           = 'always'  结构性的一条（「加入场景」/「导演」，它们不需要任何一个人物 id）
       hint           给人看的一句话；三条都来自剧本时为空串

   两条为什么这么定：
     · **补，而不是「没写就不给」**：入口不该由内容生产的完整度决定。少一条 `join`
       是制作侧的口径问题，不该变成玩家的功能缺失。
     · **补了就一定要说**：补出来的和写出来的长得一模一样 ⇒ 不说清就是我们在替剧本撒谎。
       所以 `hint` 不是装饰，是这条补齐的收据（`entry-modes-probe` 有一条臂专门盯它：
       剧本写全时必须为空，没写全时必须非空）。

   ⚠️ 不覆盖 bible98 那套（app98 的 start98 用自己的 key 体系），见文件末。
   ================================================================== */

(function () {
  'use strict';
  const soft = (typeof window !== 'undefined' && typeof window.soft === 'function')
    ? window.soft
    : function (n, f) {
      try { return f() } catch (e) {
        if (typeof console !== 'undefined' && console.warn) console.warn('[114] ' + n + ': ' + (e && e.message));
      }
    };

  /* 文案：`t` 里没有的两条，落在这里（与 app24 给 pk.watch 改名是同一个做法） */
  soft('app114:i18n', function () {
    if (typeof I18N === 'undefined') return;
    Object.assign(I18N.en, {
      'pk.way.lead': 'Say his lines, make his choices',
      'pk.way.side': "Walk in as yourself — they'll answer you",
      'pk.wayHint': "This story didn't list every way in — {n} was filled in from its cast."
    });
    Object.assign(I18N.zh, {
      'pk.way.lead': '你说他的台词，替他做选择',
      'pk.way.side': '以你自己的身份进去，他们会回应你',
      'pk.wayHint': '这份剧本没写全身份，{n} 是按人物补齐的。'
    });
  });

  /* 之前那一份 packModes（app24 的文案 + app97 的排序都还在里面）——
     我们只借用它的「导演」那一行的描述，不重写文案。 */
  const PREV = (typeof packModes === 'function') ? packModes : function () { return [] };

  function watchEntry(w) {
    let t0 = null;
    try { const m = (PREV(w) || []).filter(function (x) { return x && x.as === 'watch' })[0]; if (m) t0 = m.t } catch (e) { t0 = null }
    if (!t0) t0 = T('Watch them — direct from outside the scene', '旁观——在场外当导演');
    return t0;
  }

  /* 主角是谁：剧本写了 pov 就 pov，否则 love，否则第一个角色。
     只认 ch() 认识的 id —— 认不出来的 id 会把「扮演 X」渲染成没有名字的一行，
     那比没有这一行更糟（玩家点了不知道在演谁）。 */
  function leadOf(w) {
    const P = (w && w.pack) || {};
    const cand = [P.pov, P.love].concat((w && w.cast) || []);
    for (let i = 0; i < cand.length; i++) {
      const x = cand[i];
      if (!x || x === 'watch' || x === 'side') continue;
      let known = null; try { known = ch(x) } catch (e) { known = null }
      if (known) return x;
    }
    return null;
  }

  function entryModes(w) {
    const P = (w && w.pack) || {};
    const J = Array.isArray(P.join) ? P.join : [];
    const out = [], seen = {};
    J.forEach(function (j) {
      if (!j || !j.as || seen[j.as]) return;
      seen[j.as] = 1;
      out.push({ as: j.as, t: j.t, src: 'data' });
    });

    const hasPlayable = out.some(function (m) { return m.as !== 'watch' && m.as !== 'side' });
    if (!hasPlayable) {
      const lead = leadOf(w);
      if (lead && !seen[lead]) { seen[lead] = 1; out.push({ as: lead, t: null, src: 'derived' }) }
    }
    if (!seen.side) { seen.side = 1; out.push({ as: 'side', t: null, src: 'derived' }) }

    const wt = watchEntry(w);
    out.push({ as: 'watch', t: wt, src: 'always' });

    /* 描述：剧本给了就用剧本的；补出来的给一句标准描述（不编人物细节） */
    out.forEach(function (m) {
      if (m.t) return;
      if (m.as === 'side') m.t = t('pk.way.side');
      else {
        let nm = '';
        try { nm = first(ch(m.as).n) } catch (e) { nm = '' }
        m.t = t('pk.way.lead') + (nm ? ' · ' + nm : '');
      }
    });

    const filled = out.filter(function (m) { return m.src === 'derived' });
    let hint = '';
    if (filled.length) {
      let names = '';
      try { names = filled.map(function (m) { return packAsName(w, m.as) }).join(' / ') } catch (e) { names = '' }
      hint = t('pk.wayHint', { n: names });
    }
    return { modes: out, hint: hint };
  }

  /* 唯一的出口：全仓 packModes 的所有调用点（开始弹层 / 故事页「怎么玩」/ 换身份 / 章节目录）
     都从这里拿，所以「三路都在」只要在这一个地方成立就够了。 */
  packModes = function (w) { return entryModes(w).modes };

  /* 开始弹层上把「收据」印出来（只在有补的时候） */
  soft('app114:startSheet', function () {
    const _ss = (typeof startSheet === 'function') ? startSheet : null;
    if (!_ss) return;
    startSheet = function (wid) {
      const r = _ss.apply(this, arguments);
      soft('app114:startSheet.hint', function () {
        const w = wd(wid);
        if (!w || !w.pack || w.bible98) return;          /* b98 有自己的入口，见文件末 */
        const hint = entryModes(w).hint;
        if (!hint) return;
        const st = document.querySelector('.sheet .stack');
        if (st && !document.querySelector('[data-emhint]')) {
          st.insertAdjacentHTML('afterend', '<p class="xs faint" data-emhint style="margin-top:10px;line-height:1.5">' + esc(hint) + '</p>');
        }
      });
      return r;
    };
  });

  /* 首屏那三条（hookRoles）也走同一份清单 —— 它原来自己拼，而且「🙋 我自己走进这场戏」
     在没有 side 的时候会**退成扮演主角**（标签说是我自己，演的却是他）⇒ 现在 side 永远在，那个谎没了。 */
  soft('app114:hookRoles', function () {
    if (typeof hookRoles !== 'function') return;
    const zh = function () { try { return CL() === 'zh' } catch (e) { return false } };
    hookRoles = function (w) {
      const out = [];
      entryModes(w).modes.forEach(function (m) {
        if (m.as === 'watch') out.push([m.as, '🎬 ' + (zh() ? '我来导演' : 'Direct it'), zh() ? '旁观，随时插手改戏' : 'Watch, and step in to change the scene anytime']);
        else if (m.as === 'side') out.push([m.as, '🙋 ' + (zh() ? '我自己走进这场戏' : 'Walk in as yourself'), zh() ? '以你自己的身份，他们会回应你' : "As you — they'll answer you"]);
        else {
          let nm = '';
          try { nm = first(ch(m.as).n) } catch (e) { nm = '' }
          out.push([m.as, '🎭 ' + (zh() ? '成为 ' : 'Be ') + nm, zh() ? '你说他的台词，替他做选择' : 'Say his lines, make his choices']);
        }
      });
      return out;
    };
  });

  window.entryModes = entryModes;

  /* 读数：__entry() 一次看全 —— 每部剧给了几条、哪几条是补的 */
  window.__entry = function () {
    const rows = [];
    try {
      (packWorlds() || []).forEach(function (w) {
        const e = entryModes(w);
        rows.push({
          id: w.id,
          modes: e.modes.map(function (m) { return m.as + ':' + m.src }),
          hint: e.hint
        });
      });
    } catch (e) { rows.push({ id: 'ERR', modes: [], hint: String(e && e.message) }) }
    return rows;
  };
})();

/* ---------- 没有覆盖到的地方（写下来，别装作没有）----------
   · bible98（app98 的 start98）：它用 key 体系选身份，没有「导演 / 加入场景」这两条，
     也**不支持** `watch`。要在那儿也凑三路，得先给 b98 引擎一条 watch 语义 ——
     那是产品决定，不是这一刀能顺手带的。
   · 创建器（app49/app50）仍然只往 `join` 里写主角一个元素。这不再是 bug（入口会补），
     但制作侧少一条数据这件事还在；要不要让创建器也写 side，等 Ann 决定。 */
