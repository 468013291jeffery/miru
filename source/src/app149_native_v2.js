/* Native v2 metadata/media compatibility. Plot execution, intent matching, live
   replies, scene waits, DONE progress and saves remain the shared Claude engine.
   Opt-in requires an explicit native_v2 marker in the imported manuscript. */
(function () {
  const native = th => !!(th && wd(th.wid)?.pack?.nativeV2);
  const assets = w => (w && OFF94.assets[w.community]) || (OFF94.cur && OFF94.assets[OFF94.cur.id]) || {};
  function configure(w) {
    if (!w?.pack?.nativeV2) return;
    const A = assets(w);
    if (A.endings) w.pack.endings = A.endings;
    if (A.cover || A.poster) { w.cover = A.cover || A.poster; S.art[w.id] = A.cover || A.poster; }
    if (w.hook) w.pack.logline = { ...w.hook };
    for (const lang of ['zh','en']) if (w.pack.intro?.[lang]) {
      w.pack.intro[lang].bg = String(w.premise?.[lang] || '').split('\n\n').filter(Boolean);
      w.pack.intro[lang].you = w.you?.[lang] || '';
    }
    const ids = names => (names || []).map(name => (w.cast || []).find(id => {
      const c = ch(id); return c && (c.n94?.zh === name || c.n === name);
    })).filter(Boolean);
    if (A.leads) w.leads = ids(A.leads);
    w.pack.minRoundsPerChapter = 0;
    const you = w.you94 && ch(w.you94);
    if (you) { you.n = CL() === 'zh' ? '你' : 'You'; you.n94 = { zh: '你', en: 'You' }; }
    (w.pack.chapters || []).forEach(c => {
      for (const lang of ['zh', 'en']) {
        const first = (c.beats[lang] || []).find(b => b?.[0] === 'sys' && b[1] === 'scene');
        if (first) { c.time[lang] = first[2].time || ''; c.place[lang] = first[2].place || ''; }
        for (const b of c.beats[lang] || []) if (b?.[0] === 'sys' && b[1] === 'scene' && A.scene_present?.[b[2].bg94]) b[2].nativePresent = ids(A.scene_present[b[2].bg94]);
        if (first?.[2].nativePresent) c.present = first[2].nativePresent;
      }
    });
  }
  PARSE.use('native-v2:metadata', { build(next, doc, as) {
    const r = next(doc, as), w = wd(r && (r.wid || r));
    if (w && JSON.stringify(doc).includes('native_v2')) {
      w.pack.nativeV2 = 1; configure(w);
    }
    return r;
  }});
  const set = pkSet;
  pkSet = function (th, flags) {
    const r = set.apply(this, arguments);
    if (native(th)) th.pk.nativeV2 = 1;
    return r;
  };
  PKREG.add('native-v2:presence', function(th,b,next) {
    const r = next.apply(this, arguments);
    if (native(th) && b?.[0] === 'sys' && b[1] === 'scene' && b[2].nativePresent && !(th.pk.q || []).includes(b)) {
      th.present = b[2].nativePresent.slice();
      if (th.addr && !th.present.includes(th.addr)) th.addr = null;
      th.pk.nativeScene = { place: b[2].place, time: b[2].time, present: th.present };
    }
    return r;
  });
  const speakers = speakersOf;
  speakersOf = function(th) { return native(th) && Array.isArray(th.present) ? th.present.filter(id => id !== th.pk.as) : speakers.apply(this,arguments); };
  const prompt = packPrompt;
  packPrompt = function(th) {
    const s = prompt.apply(this, arguments);
    if (!native(th)) return s;
    return s + '\nCURRENT VERIFIED SCENE (overrides chapter location): ' + JSON.stringify(th.pk.nativeScene || {}) +
      '\nOnly present actors may act or answer in person. An empty list means the player is alone; do not invent an arriving character. Use only evidence already shown. Do not invent player speech, feelings, consent, injuries, or obtained evidence. Do not turn a cooperation choice into romance. In-scene people speak face to face, never by phone.\n' +
      (CL() === 'zh' ? '本轮仅用自然简体中文，角色使用中文名；不要输出英文摘要或后台说明。' : 'Use natural English only. Never print backstage instructions or Chinese summaries.');
  };
  const love = packLove, need = EN;
  packLove = function (th) { if (!native(th)) return love.apply(this, arguments); };
  EN = function (th) { return native(th) ? 0 : need.apply(this, arguments); };
  const pick = packPick, pending = new Set();
  packPick = function(k) {
    const th = S.threads[curT], last = th?.msgs?.[th.msgs.length-1];
    if (!native(th) || last?.who !== 'me' || th.pk.st !== 'choose' || typeof reply !== 'function') return pick.apply(this,arguments);
    if (pending.has(th.id)) return;
    pending.add(th.id);
    const args = arguments, self = this;
    return (async () => {
      try {
        await reply(th,{kind:'user',txt:last.txt,mode:last.k || 'say'});
        if (S.threads[curT] === th && th.pk.st === 'choose') return pick.apply(self,args);
      } catch(e) { console.warn('[native-v2] live ending reply',e); }
      finally { pending.delete(th.id); }
    })();
  };

  const merge = off94MergeEn;
  off94MergeEn = function (wid, P) {
    const r = merge.apply(this, arguments), w = wd(wid);
    if (!w?.pack?.nativeV2 || !P?.script_en) return r;
    const english = imParse(P.script_en), pairs = [];
    function pair(a, b) {
      if (typeof a === 'string' && typeof b === 'string' && a !== b && a.length > 2 && b.length > 2) { pairs.push([a,b]); return; }
      if (Array.isArray(a) && Array.isArray(b)) { a.forEach((x,i) => pair(x,b[i])); return; }
      if (a && b && typeof a === 'object' && typeof b === 'object') Object.keys(a).forEach(k => pair(a[k],b[k]));
    }
    w.pack.chapters.forEach((c,i) => {
      c.done163Locales = { zh: c.done163 || [], en: english.done163?.[i] || [] };
      pair(c.beats.zh,c.beats.en); pair(c.t.zh,c.t.en);
      (c.choices || []).forEach(o => { pair(o.then.zh,o.then.en); pair(o.t.zh,o.t.en); });
    });
    for (const k of ['title','hook','premise','you']) if (P.meta?.[k] && P.meta.en?.[k]) pair(P.meta[k],P.meta.en[k]);
    (w.cast || []).forEach(id => { const c = ch(id); if (c?.n94 && c.n94.zh !== c.n94.en) pairs.push([c.n94.zh,c.n94.en]); });
    w.pack.authoredLanguages = pairs;
    configure(w); save(); return r;
  };
  function translate(th, value) { return typeof value === 'string' ? authoredText(th,value) : value; }
  function fields(th,o) {
    if (!o || typeof o !== 'object') return;
    for (const k of ['txt','title','place','time','last','premise','summary','name','n','t','present','hint','q','cap']) if (typeof o[k] === 'string') o[k] = translate(th,o[k]);
    for (const [k,v] of Object.entries(o)) if (v && typeof v === 'object' && k !== 'authoredLanguages') (Array.isArray(v) ? v : [v]).forEach(x => fields(th,x));
  }
  function queue(th, rows) {
    for (const b of rows || []) {
      if (!Array.isArray(b)) continue;
      if (b[0] !== 'sys' && typeof b[2] === 'string') b[2] = translate(th,b[2]);
      else if (b[2] && typeof b[2] === 'object') { fields(th,b[2]); queue(th,b[2].then); queue(th,b[2].else); for (const o of b[2].opts || []) queue(th,o.then); }
    }
  }
  const render = renderChat;
  renderChat = function () {
    const th = S.threads[curT], w = th && wd(th.wid);
    if (native(th)) {
      configure(w); th.pk.nativeV2 = 1;
      (th.msgs || []).filter(m => m.who !== 'me').forEach(m => fields(th,m));
      queue(th,th.pk.q); if (th.pk.stop) queue(th,[th.pk.stop]);
      const intro = Lz(w.pack.intro);
      if (intro && typeof intro === 'object') { intro.bg = String(Lz(w.premise) || '').split('\n\n'); intro.you = Lz(w.you); }
      (th.msgs || []).filter(m => m.k === 'chap').forEach(m => { const c = w.pack.chapters[m.n-1]; if (c) { m.title = Lz(c.t); m.brief124 = EXPERIENCE124.brief(th,c,m.n); } });
    }
    return render.apply(this, arguments);
  };
  const recording = recorded;
  recorded = function (text, id) {
    const c = ch(id), w = c && wd(c.w), A = assets(w), lang = CL() === 'zh' ? 'zh' : 'en';
    if (w?.pack?.nativeV2) {
      const u = A.voices?.[lang]?.[c.voiceId]?.[String(text).replace(/[*()（）]/g,'').trim()];
      if (u) return u;
    }
    return recording.apply(this, arguments);
  };
})();
