/* Keep an already-open homepage current when official stories or their trailers
   are published. Preserve the current story/scroll; never restart a chat. */
(function () {
  let syncing=false, refreshing=null, lastRefresh=0, rendered='', deepFocused=false;
  const deep=new URLSearchParams(location.search).get('story');
  const target=deep && /^w_[a-z0-9]+$/i.test(deep) ? deep : null;
  const positions=new Map();
  function remember(feed) {
    if(!feed)return;
    const top=feed.getBoundingClientRect().top,cards=[...feed.querySelectorAll('.fcard')];
    const c=cards.sort((a,b)=>Math.abs(a.getBoundingClientRect().top-top)-Math.abs(b.getBoundingClientRect().top-top))[0];
    if(c)positions.set(feedTab,{id:c.dataset.off94||c.dataset.fw,offset:c.getBoundingClientRect().top-top,scroll:feed.scrollTop});
  }
  function restore(feed,p) {
    if(!feed||!p)return;
    const c=[...feed.querySelectorAll('.fcard')].find(x=>(x.dataset.off94||x.dataset.fw)===p.id);
    if(c)feed.scrollTop+=c.getBoundingClientRect().top-feed.getBoundingClientRect().top-p.offset;
  }
  // Other shared UI refreshes may replace s-main before renderHome is called.
  // Remember the visible card while the original scroller still exists.
  document.addEventListener('scroll',e=>{if(!syncing && e.target===document.getElementById('feed') && S.lastTab==='home')remember(e.target);},true);
  function signature(list) {
    return JSON.stringify([CL(),typeof feedTab==='undefined'?'':feedTab,(list||[]).map(w=>[w.id,off94Title(w),off94Hook(w),w.orient,off94PreviewSrc(w),w.A?.cover,w.A?.poster])]);
  }
  function sync(list) {
    if(syncing || S.lastTab!=='home' || document.getElementById('s-main')?.hidden || !document.getElementById('feed') || !list?.length) return;
    const focus=target && !deepFocused && list.some(w=>w.id===target);
    if(focus && typeof feedTab!=='undefined') {
      feedTab='foryou';
      document.querySelectorAll('#ftabsc [data-ftab]').forEach(b=>b.classList.toggle('on',b.dataset.ftab==='foryou'));
    }
    const sig=signature(list),before=document.getElementById('feed');
    if(!focus && rendered===sig) return;
    const top=before.getBoundingClientRect().top;
    const cards=[...before.querySelectorAll('.fcard')];
    const active=cards.sort((a,b)=>Math.abs(a.getBoundingClientRect().top-top)-Math.abs(b.getBoundingClientRect().top-top))[0];
    const anchor=active?.dataset.off94 || active?.dataset.fw,offset=active ? active.getBoundingClientRect().top-top : 0,oldScroll=before.scrollTop;
    rendered=sig;syncing=true;
    try {
      // Reconcile cards inside the existing scroller. Replacing the whole feed
      // resets its snap position and interrupts a trailer that is already playing.
      const feed=before,existing=new Map([...feed.querySelectorAll('.fcard.off94')].map(c=>[c.dataset.off94,c]));
      const pin=feed.querySelector('.home-showcase.off94')?.dataset.off94 || OFF94_SHOWCASE;
      const first=list.find(w=>w.id===pin),ordered=first?[first,...list.filter(w=>w.id!==pin)]:list;
      const wanted=new Set();let cursor=feed.firstChild;
      for(const w of ordered) {
        let html=off94FCard(w);if(!html)continue;
        wanted.add(w.id);
        if(w.id===pin)html=html.replace('class="fcard off94"','class="fcard off94 home-showcase" data-home-showcase="1"');
        let node=existing.get(w.id);const video=node?.querySelector('video'),preview=off94PreviewSrc(w),poster=w.A?.cover||w.A?.poster||'';
        const same=node && (node.querySelector('.ftitle')?.textContent||'').replace(/\s*›\s*$/,'')===off94Title(w) && node.querySelector('.fhook94')?.textContent===off94Hook(w) &&
          (preview ? video?.dataset.src===preview && video.getAttribute('poster')===poster : !video && node.querySelector('.fimg')?.getAttribute('src')===poster);
        if(!same){const t=document.createElement('template');t.innerHTML=html;const replacement=t.content.firstElementChild;if(node){if(cursor===node)cursor=replacement;node.replaceWith(replacement);}node=replacement;}
        if(node!==cursor)feed.insertBefore(node,cursor);
        cursor=node.nextSibling;
      }
      feed.querySelectorAll('.fcard.off94').forEach(c=>{if(!wanted.has(c.dataset.off94))c.remove();});
      if(wanted.size){feed.querySelector('.home-showcase:not(.off94)')?.remove();feed.querySelectorAll('.empty').forEach(e=>e.remove());}
      const match=[...feed.querySelectorAll('.fcard')].find(c=>focus ? c.dataset.off94===target : (c.dataset.off94||c.dataset.fw)===anchor);
      if(match)feed.scrollTop+=match.getBoundingClientRect().top-feed.getBoundingClientRect().top-(focus?0:offset);
      else feed.scrollTop=oldScroll;
      if(focus && match)deepFocused=true;
      remember(feed);
      feedWire();
    } finally { syncing=false; }
  }
  const load=off94Feed;
  off94Feed=async function () { const list=await load.apply(this,arguments);queueMicrotask(()=>sync(list));return list; };
  async function refresh(force) {
    if(refreshing) return refreshing;
    if(document.hidden || S.lastTab!=='home' || document.getElementById('s-main')?.hidden || !document.getElementById('feed')) return;
    if(Date.now()-lastRefresh<(force?10000:60000)) return;
    lastRefresh=Date.now();OFF89.at=0;OFFF94.at=0;
    refreshing=off94Feed().finally(()=>{refreshing=null;});return refreshing;
  }
  const home=renderHome;
  renderHome=function () {const position=positions.get(feedTab);const r=home.apply(this,arguments);restore(document.getElementById('feed'),position);if(!syncing){rendered='';queueMicrotask(()=>{sync(OFFF94.list);refresh(true);});}return r;};
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh(true);});
  window.addEventListener('focus',()=>refresh(true));
  setInterval(()=>refresh(false),60000);
  window.CATALOG150={refresh,sync};
})();
