/* ---- v141 · relationship values live inside the header as one slim strip (tap for details) ---- */
const _dimSync39=dimSync;
dimSync=function(th){_dimSync39(th);try{const r=$(".dimrow"),h=$(".chatscreen .chead");if(r&&h&&r.parentNode!==h){h.appendChild(r)}if(r)r.classList.add("dimslim")}catch(_){}};
(function(){const st=document.createElement("style");st.textContent=`
.chead .dimrow.dimslim{display:block;margin:6px 0 0;padding:0;overflow:visible;background:none!important;border:0!important}
.dimslim .dimc:not(.main){display:none}
.dimslim .dimc.main{width:100%!important;max-width:none!important;min-width:0;background:rgba(255,255,255,.05)!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:12px;padding:5px 8px!important;backdrop-filter:none!important;gap:0}
.dimslim .dimh{display:none!important}
.dimslim .dimm{display:grid!important;grid-template-columns:repeat(5,1fr);gap:8px}
.dimslim .dimm>span{display:flex;flex-direction:column;gap:3px;min-width:0}
.dimslim .dimm small{display:flex;align-items:center;justify-content:space-between;gap:2px;font-size:11px!important;white-space:nowrap;overflow:hidden}
.dimslim .dimm small b{font-size:11.5px}
.dimslim .dimm i{height:3px!important}
@media (max-width:360px){.dimslim .dimm small{font-size:10px!important}}`;document.head.appendChild(st)})();
/* hide the label words, keep icon + number, so the 5 values fit one line on a phone */
const _dimBar39=dimBarHTML;dimBarHTML=function(th){return _dimBar39(th).replace(/<small>([^ <]+) ([^<]+?) <b class="num">/g,'<small><span class="dmi" title="$2">$1</span><b class="num">')};
(function(){const st=document.createElement("style");st.textContent=`.sheet p:has(+ .cctv){font-size:13px!important;line-height:1.6;color:#FFE2C4!important;background:rgba(240,183,126,.1);border-left:3px solid #F0B77E;padding:8px 10px;border-radius:0 10px 10px 0;opacity:1!important}`;document.head.appendChild(st)})();
