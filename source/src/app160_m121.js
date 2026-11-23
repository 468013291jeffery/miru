/* M121 OFF CAMERA: asset slots, consent flags and missing-file placeholders.
   The shared importer still plays the script. This file only keeps this story's state. */
(function () {
  'use strict';
  if (typeof M121_RELEASE === 'undefined' || typeof createM121Engine !== 'function') return;
  const E = createM121Engine(M121_RELEASE);
  const map = M121_RELEASE.assets || {};
  function own(th) { return !!(th && wd(th.wid)?.pack?.m121); }
  function state(th) { return th.pk.m121 || (th.pk.m121 = E.initial()); }
  function applyFlags(th) {
    const s = state(th);
    const extra = E.sync(s);
    th.pk.flags = th.pk.flags || {};
    for (const id of Object.keys(E.byId)) if (E.byId[id].heat_scene) delete th.pk.flags['m121_enter_' + id];
    for (const f of extra.enter) th.pk.flags[f] = 1;
    for (const id of ['SEB', 'RYA', 'JUL', 'LUC', 'SOLO', 'OPEN']) delete th.pk.flags['m121_end_' + id];
    delete th.pk.flags.m121_end_pending;
    for (const f of extra.pending) th.pk.flags[f] = 1;
  }
  function paint(beats) {
    for (const b of beats || []) {
      if (!Array.isArray(b)) continue;
      if (b[1] === 'scene' && b[2] && b[2].bg94 && map[b[2].bg94]) {
        const key = 'm121:' + b[2].bg94;
        b[2].img = key; b[2].src94 = map[b[2].bg94];
        (window.SCENE_FILES = window.SCENE_FILES || {})[key] = map[b[2].bg94];
      }
      if ((b[1] === 'cg94' || b[1] === 'vid94') && b[2] && map[b[2].slot]) b[2].src = map[b[2].slot];
      if (b[1] === 'if' && b[2]) { paint(b[2].then); paint(b[2].else); }
      if (b[1] === 'line' && b[2] && b[2].opts) b[2].opts.forEach(o => paint(o.then));
    }
  }
  function configure(w) {
    if (!w?.pack) return;
    w.pack.m121 = 1; w.pack.nativeV2 = 1; w.pack.minRoundsPerChapter = 0;
    const id = w.community || (typeof OFF94 !== 'undefined' && OFF94.cur && OFF94.cur.id);
    if (id && typeof OFF94 !== 'undefined') OFF94.assets[id] = Object.assign({}, map, OFF94.assets[id] || {});
    for (const c of w.pack.chapters || []) { paint(c.beats && c.beats.zh); (c.choices || []).forEach(o => paint(o.then && o.then.zh)); }
  }
  if (typeof PARSE !== 'undefined') PARSE.use('m121', { build(next, doc, as) {
    const marked = JSON.stringify(doc).includes('m121_scene~');
    if (marked && typeof OFF94 !== 'undefined' && OFF94.cur && OFF94.cur.id) OFF94.assets[OFF94.cur.id] = Object.assign({}, map, OFF94.assets[OFF94.cur.id] || {});
    const r = next(doc, as), w = wd(r && (r.wid || r));
    if (marked && w) configure(w);
    return r;
  } });
  if (typeof pkSet === 'function') {
    const prev = pkSet;
    pkSet = function (th, flags) {
      const r = prev.apply(this, arguments);
      if (!own(th)) return r;
      const s = state(th);
      for (const f of (Array.isArray(flags) ? flags : [flags])) if (String(f).startsWith('m121_')) E.note(s, f);
      applyFlags(th);
      return r;
    };
  }
  document.addEventListener('error', function (ev) {
    const el = ev.target;
    if (!el || !el.dataset || el.dataset.m121ph) return;
    const src = el.currentSrc || el.src || '';
    if (!/m121-off-camera\/images\//.test(src)) return;
    el.dataset.m121ph = '1';
    const id = decodeURIComponent(src.split('/').pop().replace(/\.[a-z0-9]+$/i, ''));
    el.src = E.placeholder(id);
  }, true);
})();
