/* Eight Princes authored mainline. Follow-ups are character cards, not standalone routes. */
(function () {
  const MAIN = 'w_scmw2calg4a57f5c1974';
  const isMain = w => w && w.community === MAIN;
  function configure(w) {
    if (!isMain(w) || !w.pack) return;
    w.pack.exp74 = 1;
    w.pack.minRoundsPerChapter = 0;
    const last = (w.pack.chapters || []).slice(-1)[0];
    (last && last.choices || []).forEach(o => {
      w.pack.endings = w.pack.endings || {};
      w.pack.endings[o.k] = {t:o.t,txt:{zh:'',en:''},line:{zh:'',en:''}};
    });
  }
  const install = installWork;
  installWork = async function () { const id = await install.apply(this,arguments); configure(id && wd(id)); return id; };
  Object.values(S.mine.worlds || {}).forEach(configure);
  const endingNeed = EN;
  EN = function(th) { return isMain(th && wd(th.wid)) ? 0 : endingNeed.apply(this,arguments); };
  const love = packLove;
  packLove = function(th) { if (!isMain(th && wd(th.wid))) return love.apply(this,arguments); };
  const write = loveWrite;
  loveWrite = function(th,cid,delta,reason) { if (isMain(th && wd(th.wid)) && reason === 'ending:A') return; return write.apply(this,arguments); };
})();
