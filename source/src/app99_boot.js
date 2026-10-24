/* ---- BOOT (keep last) ---- */
/* 媒体库先跑：开 IndexedDB → 把老存档里的 base64 迁出去（保命：迁不成功就保留原值）→ 再启动。
   库打不开（隐私模式 / 旧浏览器）也照常启动 —— mediaBoot 内部对失败是吞掉的，页面按老路径走。
   1.5 秒兜底：迁移不能把白屏拖出来。 */
(function boot(){
  function go(){ try{ if(S.ob)startApp();else renderOB(); }catch(e){ try{console.error(e)}catch(_){} } }
  try{
    if(typeof mediaBoot==="function"){
      var t=setTimeout(go,1500);
      mediaBoot().then(function(m){
        try{ if(t)clearTimeout(t) }catch(_){}
        try{ if(m&&m.stats&&(m.stats.migrated||m.stats.failed)) track&&track("media_migrate",{ok:m.stats.migrated,fail:m.stats.failed,bytes:m.stats.bytes}) }catch(_){}
        go();
      },function(){ try{ if(t)clearTimeout(t) }catch(_){} go(); });
      return;
    }
  }catch(_){}
  go();
})();
