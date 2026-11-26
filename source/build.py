#!/usr/bin/env python3
"""MIRU build — source/ → repo root.

    python  source/build.py        (Windows / any machine with `python`)
    python3 source/build.py        (Linux / macOS)

Reads  source/src/*.js + source/content/ + ../art/, writes  index.html  (repo root),
plus the two copies of miru_rules.js that the page and the API need.
It chdir()s to its own directory first, so it can be run from anywhere.
No symlinks, no `python3` assumption (that alias does not exist on Windows).
"""
import os
import re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
os.chdir(HERE)

# 1) story packs: content/out/sNN.json + content/deep/ → src/content_36.js
#    (same interpreter as this script: `python3` is not on PATH on Windows)
subprocess.run([sys.executable, 'gen_content.py'], check=True)

# PDFJS_EAGER_SKIP: pdfjs 1.4MB 不再塞进 index.html —— 它只在「导入 PDF」时才需要。
# 单独写一份到仓库根，页面按需求才加载（见 app53_import2.js 的 imPdfLib）。
import shutil as _sh
_sh.copyfile(os.path.join(HERE,"src","pdfjs_embed.js"), os.path.join(ROOT,"pdfjs_embed.js"))
parts=["content_chars.js","content_worlds.js","content_extra.js","tr_merge.js","tr_ja.js","tr_ko.js","tr_es.js","content_36.js","shorts_v2.js","shorts_v3.js","i18n.js","app105_save.js","app106_ui.js","app103_turn.js","app104_pkstate.js","app1_core.js","app112_sheet.js","app96_tune.js","app94_replyguard.js","app95_status.js","app97_card.js","app98_emotion.js","app99_plan.js","miru_rules_full.js","miru_rules.js","app2_pages.js","app3_chat.js","app4_more.js","app5_money.js","app6_games.js","app7_rank.js","app8_i18n.js","app10_story.js","app11_memory.js","app12_beats.js","app13_rel.js","app85_guide.js","app9_ads.js","app14_pack.js","app110_pkreg.js","app111_msgkind.js","app16_story2.js","app17_custom.js","app18_promo.js","app19_bgm.js","app20_fx_booth.js","app21_dims.js","app22_fx2.js","app23_heir.js","app24_gl.js","app25_dir.js","app26_turns.js","app27_choice.js","app28_burst.js","app29_style.js","app30_fx3.js","app31_score.js","app32_myline.js","app33_recs.js","app34_hints.js","app35_pay.js","app36_live.js","app37_hooks.js","app38_gift.js","app39_compact.js","app40_sfx.js","app41_merge.js","app42_decline.js","app43_couple.js","studio_lib.js","app44_studio.js","app45_rel.js","app46_cp.js","app47_chapters.js","app48_clean.js","app49_creator.js","creator_embed.js","app50_creator2.js","app51_import.js","app52_alt.js","app53_import2.js","app54_longcat.js","app55_talk.js","app56_story3.js","app57_rules.js","app58_bgm100.js","app59_fx100.js","app60_games100.js","app61_honor.js","app62_tts.js","app63_fixes.js","app64_entry.js","app65_lib.js","app66_libup.js","app67_i18n.js","app68_cloud.js","app69_acct.js","app70_login.js","app71_narrative.js","app72_zhpure.js","app73_features.js","app74_experience.js","app75_mydock.js","app76_official.js","app77_memory2.js","app78_memsync.js","app79_ledger.js","app80_cache.js","app81_voicecall.js","app82_qwenimg.js","app83_vidu.js","app84_nosub.js","app86_voicefix.js","app87_regcode.js","app88_memcall.js","app89_offsearch.js","app90_youturn.js","app91_phone.js","app92_mustlogin.js","app93_doubao.js","app94_official2.js","app100_dialogue.js","app15_home.js","app92_media.js","app93_agegate.js","app100_fixes.js","app95_safety.js","app96_social.js","app97_agents.js","opening_core.js","app98_story.js","app101_you.js","app99_boot.js","app102_pipeline.js","app107_health.js","app108_errlog.js","app109_pkdirect.js","app103_turn.js","app113_content.js","app114_entry.js","m102engine.js","app115_m102data.js","app115_m102.js","app116_reading.js","app117_lore.js","app118_turnorder.js","app119_branch.js","app120_cardio.js","app121_dock.js","app122_react.js","app123_alt.js","app125_fresh.js","app126_leads.js","app127_play.js","app128_adsense.js","app124_experience.js","app128_fxlib.js"]
# --- MIRU final rules: one source (src/rules_final.md + src/miru_rules.js) → app, admin console, backend ---
import json as _rj
_full="var MIRU_RULES_FULL="+_rj.dumps(open("src/rules_final.md",encoding="utf8").read(),ensure_ascii=False)+";\nvar MIRU_RULES_SKILL="+_rj.dumps(open("src/rules_skill_v1.md",encoding="utf8").read(),ensure_ascii=False)+";\n"
open("src/miru_rules_full.js","w",encoding="utf8").write(_full)
_mod=open("src/miru_rules.js",encoding="utf8").read()
# the same text must reach the page (/miru_rules.js) and the functions (/api/_rules.js)
for p in (os.path.join(ROOT,"miru_rules.js"), os.path.join(ROOT,"api","_rules.js")):
    open(p,"w",encoding="utf8").write(_full+_mod)
parts.extend(["app129_catalog.js", "app130_princes.js", "app131_m105.js", "app132_m105experience.js", "app133_unread.js", "app134_arc98.js", "app134_m107.js", "app135_context.js", "app135_narration.js", "app136_spp.js", "app137_m108.js", "app138_catalog.js", "app139_voice.js", "app140_meetchars.js", "app141_creator3.js", "app142_m109.js", "app143_m110.js", "app144_discfix.js"])
parts.extend(["app142_authored.js", "app145_narration.js", "app147_empress.js", "app148_authored_contract.js", "app149_native_v2.js", "app150_catalogrefresh.js", "app148_svf.js", "app151_hockey_v2.js"])
parts.extend(["app151_onlyme.js"])
parts.extend(["app152_readability.js"])
parts.extend(["app153_fantasy_v6.js"])
parts.extend(["app154_dream_v2.js"])
parts.extend(["app155_moonlit_v2.js"])
parts.extend(["app156_dangerous_v2.js"])
parts.extend(["app158_story_copy.js"])
parts.extend(["app159_song_data.js", "wtsr_state.js", "app159_song.js"])
# 2026-11-21 性能：首页列表请求合并 + 媒体按需加载。必须排在所有包装 off94Feed 的模块之后（见文件头说明）。
parts.extend(["app157_perf.js"])
parts.extend(["app153_m119.js"])
parts.extend(["app160_m121_data.js", "app160_m121_engine.js", "app160_m121.js"])
parts.extend(["app161_bride_state.js", "app161_bride_data.js", "app161_bride.js"])
parts.extend(["app162_ashes_state.js", "app162_ashes_data.js", "app162_ashes.js"])
# 阅读节奏最后接管等待，兼容主线新剧及性能模块。
parts.extend(["app157_reply_pace.js"])
def block(names): return "\n".join(open("src/"+p, encoding="utf8").read() for p in names)
js=block(parts)
open("all.js","w",encoding="utf8",newline="\n").write(js)
import glob,os,json as _j
# art lives at the repo root, one level up (build.sh used to symlink it into source/):
# we glob ../art directly, so a symlink/junction is not needed on any platform.
ART=os.path.join(ROOT,"art")+os.sep
# keys are always forward-slash relative paths, and the VALUES are repo-relative URLs
# (`art/scenes/<a>/<b>.jpg`), not the builder's absolute paths: the page loads these values as URLs,
# and a build that embeds C:\... or /home/... is neither deployable nor reproducible.
def _key(base, f):
    return os.path.splitext(f[len(base):])[0].replace(os.sep, "/")
def _url(f):
    return os.path.relpath(f, ROOT).replace(os.sep, "/")
# Sparse checkouts omit media bytes, but their tracked URLs must remain in the bundle.
# Only skip-worktree entries are restored here; intentional local deletions stay deleted.
import subprocess, fnmatch
_sparse_art=[]
try:
    _entries=subprocess.check_output(["git","ls-files","-t","-z","--","art/scenes","art/bgm","art/cut"],cwd=ROOT).decode("utf-8").split("\0")
    _sparse_art=[os.path.join(ROOT,x[2:].replace("/",os.sep)) for x in _entries if x.startswith("S ")]
except (OSError, subprocess.CalledProcessError):
    pass
def _media_glob(pattern, recursive=False):
    return sorted(set(glob.glob(pattern,recursive=recursive)) | {f for f in _sparse_art if fnmatch.fnmatch(f,pattern)})
_sf={}
for f in sorted(_media_glob(ART+"scenes/**/*.*",recursive=True)):
    k=_key(ART+"scenes/", f)
    if f.endswith(".mp4") or k not in _sf:_sf[k]=_url(f)
_bf={_key(ART+"bgm/", f):_url(f) for f in sorted(_media_glob(ART+"bgm/**/*.*",recursive=True)) if f.endswith((".mp3",".m4a",".ogg"))}
import glob as _g
_cf=sorted(os.path.splitext(os.path.basename(x))[0] for x in _media_glob(ART+"cut/*.webp"))
assets=("window.CUT_FILES="+_j.dumps(_cf)+";\n"+"window.SCENE_FILES="+_j.dumps(_sf)+
        ";\nwindow.BGM_FILES="+_j.dumps(_bf)+";\n")
shell=open("src/shell.html", encoding="utf8").read()
# 2026-11-12 · AdSense / 搜索引擎：页面源码里直接带 AdSense 代码、描述、canonical；www / http 自动跳到 https://miru.plus；
#              不开脚本时给一段说明和剧目、关于、联系等页面的链接（这些页面由 source/gen_seo.py 生成）。
_WWW = '<script>try{if(/^www\\./i.test(location.hostname)||(location.protocol==="http:"&&/miru\\.plus$/i.test(location.hostname)))location.replace("https://miru.plus"+location.pathname+location.search+location.hash)}catch(e){}</script>'
if "adsbygoogle.js?client" not in shell:
    shell = shell.replace('<meta charset="utf-8">', '<meta charset="utf-8">\n' + _WWW, 1)
    shell = shell.replace('<title>MIRU</title>', '<title>MIRU — Interactive Romance Stories & AI Character Chat</title>\n<meta name="description" content="Play interactive romance stories as yourself: talk to the characters, make choices and change the ending. Fantasy, mystery, royals, vampires and more. Free in your browser on phone or computer.">\n<meta property="og:site_name" content="MIRU">\n<meta property="og:title" content="MIRU — Interactive Romance Stories & AI Character Chat">\n<meta property="og:description" content="Play interactive romance stories as yourself: make choices and change the ending. Free on miru.plus.">\n<meta property="og:url" content="https://miru.plus/">\n<meta property="og:type" content="website">\n<meta property="og:image" content="https://miru.plus/icons/play-feature-1024x500.png">\n<meta name="twitter:card" content="summary_large_image">\n<script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"WebSite","name":"MIRU","alternateName":["MIRU+","miru.plus","MIRU Stories","MIRU Interactive Romance"],"url":"https://miru.plus/","inLanguage":["en","zh","ja","ko","es"]},{"@type":"Organization","name":"MIRU","alternateName":"miru.plus","url":"https://miru.plus/","logo":"https://miru.plus/icons/icon-512.png"},{"@type":"WebApplication","name":"MIRU","url":"https://miru.plus/","applicationCategory":"GameApplication","operatingSystem":"Any (web browser), Android","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"description":"Interactive romance stories and AI character chat: play as yourself, make choices and change the ending."}]}</script>\n<link rel="canonical" href="https://miru.plus/">\n<meta name="google-site-verification" content="fUdSSFltv3Rs7NRFvhCfDWzUKEUGtw982sR1SE_mSOU">\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1779576119248059" crossorigin="anonymous"></script>', 1)
    shell = shell.replace('<div class="app"><div class="device" id="dev"></div></div>', '<div class="app"><div class="device" id="dev"></div></div>\n<noscript><div style="max-width:720px;margin:0 auto;padding:24px 18px;color:#F1ECF3;font:16px/1.7 sans-serif"><h1>MIRU — Interactive Romance Stories</h1><p>Play as yourself, talk with the characters and make choices that change the ending. Free in your browser on phone or computer.</p><p>MIRU 是一款互动剧应用：你用自己的名字进入故事，和剧中角色对话，在每一章做出选择，不同的选择会改变人物关系和结局。所有角色都是虚构的成年人。</p><p>MIRU is an interactive story app: play as yourself, talk with the characters and make choices that change the ending.</p><p><a href="/stories/" style="color:#F0B77E">浏览全部剧目 Stories</a> · <a href="/about.html" style="color:#F0B77E">关于 About</a> · <a href="/contact.html" style="color:#F0B77E">联系 Contact</a> · <a href="/privacy.html" style="color:#F0B77E">隐私 Privacy</a> · <a href="/terms.html" style="color:#F0B77E">条款 Terms</a></p></div></noscript>', 1)

# ---- artifact shape -------------------------------------------------------------------------
# default: one self-contained index.html (what is committed / deployed today).
# --split: the 37 story packs (~6.5 MB of the 10.8 MB page) go to their own file, so a content
#          change never rewrites the app bundle and the browser caches the two separately.
#          Writes index.split.html + content_36.js, and leaves index.html alone.
SPLIT = "--split" in sys.argv
if SPLIT:
    CUT = parts.index("content_36.js")
    open(os.path.join(ROOT,"content_36.js"),"w",encoding="utf8",newline="\n").write(block(["content_36.js"]))
    html=(shell+"\n<script>\n"+assets+block(parts[:CUT])+"\n</script>\n"
          +'<script src="content_36.js"></script>\n<script>\n'+block(parts[CUT+1:])+"\n</script>\n")
    out=os.path.join(ROOT,"index.split.html")
else:
    html=shell+"\n<script>\n"+assets+js+"\n</script>\n"
    # 构建指纹（2026-10-25）：没有它，就永远无法回答「线上跑的是哪一版」。
# 指纹 = 页面内容（不含指纹本身）的 sha256 前 12 位 + UTC 构建时间；
# tools/live-check.mjs 会把线上那一页取回来、剥掉指纹、重算 sha256 对一遍 —— 可验证，不是自说自话。
# 构建指纹（2026-10-26 修正）：**不要再往 HTML 的 </head> 里插**。
# 教训：window.CREATOR_HTML 那个字符串里自带一段 </head>，replace(...,1) 命中的是**字符串内部**那个，
# 结果指纹里的 </script> 把真正的脚本块提前截断 ⇒ 第 10497 行 SyntaxError ⇒ 应用起不来（黑框）。
# 现在改成：先算出页面内容的 sha256，再把它作为**JS 第一行**塞进 bundle —— 不碰任何 HTML 结构。
import hashlib, datetime
_h = hashlib.sha256(html.encode("utf-8")).hexdigest()[:12]
_ts = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
JS_STAMP = 'window.MIRU_BUILD="' + _h + " " + _ts + '";'
# 指纹作为脚本第一行（在 <script> 之后），不改变文档结构
_si = html.find("<script>")
if _si >= 0:
    html = html[:_si + len("<script>")] + "\n" + JS_STAMP + html[_si + len("<script>"):]
out=os.path.join(ROOT,"index.html")
open(out,"w",encoding="utf8",newline="\n").write(html)
print(len(html), "chars ->", out, "| split" if SPLIT else "| single file")

# ---- 2026-11-24 · 按需加载：36 部老剧（已全部下架）的完整剧本不再塞进首页 ----------------------------------
# content_36.js 约 6.5 MB，其中 PACK_W 里每部剧的 pack（全部章节）占了绝大部分。老剧已经不在首页、发现页出现，
# 只有老用户打开以前玩过的存档才用得到。做法：
#   · PACK_W 里去掉 pack，另写一个 content36_packs.js（window.PACK36_FULL = {剧id: pack}）放仓库根目录；
#   · 页面里 w.pack / w.openings 变成「第一次用到才加载」的属性：页面空闲时先后台预取，真用到还没取到就同步取一次，
#     所以任何读 w.pack 的老代码都照常工作，只是不再拖慢首屏。
# 先输出 index.lazy.html 线上验证；验证没问题后把 LAZY_DEFAULT 改成 True，index.html 就用这一版。
LAZY_DEFAULT = True  # 2026-11-24 线上验证通过（首页下载 5.0MB → 2.8MB，启动时不再同步加载老剧），转为默认
def _lazy36(text):
    import json as _lj, hashlib as _lh
    L = text.split("\n")
    i = next(k for k, s in enumerate(L) if s.startswith("const PACK_W="))
    W = _lj.loads(L[i][len("const PACK_W="):].rstrip().rstrip(";"))
    full = {}
    for w in W:
        p = w.pop("pack", None)
        if p is None: continue
        full[w["id"]] = p
        ch = p.get("chapters") or []
        w["_q"] = [(c or {}).get("goal") for c in ch[:3]]
    packs_js = "window.PACK36_FULL=" + _lj.dumps(full, ensure_ascii=False, separators=(",", ":")) + ";\n"
    rev = _lh.sha256(packs_js.encode("utf-8")).hexdigest()[:10]
    L[i] = "const PACK_W=" + _lj.dumps(W, ensure_ascii=False, separators=(",", ":")) + ";"
    loader = ('function PK36(){if(window.PACK36_FULL)return window.PACK36_FULL;'
              'try{var x=new XMLHttpRequest();x.open("GET","content36_packs.js?v=' + rev + '",false);x.send(null);'
              'if(x.status===200)(0,eval)(x.responseText);}catch(e){console.warn("[pk36]",e)}'
              'if(!window.PACK36_FULL)window.PACK36_FULL={};window.__pk36sync=(window.__pk36sync||0)+1;try{window.__pk36why=String(new Error().stack).slice(0,1200)}catch(_){}return window.PACK36_FULL}\n'
              'function PK36lazy(w,key,make){var cache,real=function(){if(cache===undefined){cache=make();Object.defineProperty(w,key,{value:cache,writable:true,configurable:true,enumerable:true})}return cache};'
              'Object.defineProperty(w,key,{configurable:true,enumerable:true,'
              'get:function(){if(window.PACK36_FULL||key!=="pack")return real();'
              'return new Proxy({},{get:function(t,k){var v=real();return v==null?undefined:v[k]},has:function(t,k){var v=real();return v!=null&&(k in v)},'
              'ownKeys:function(){var v=real();return v?Reflect.ownKeys(v):[]},getOwnPropertyDescriptor:function(t,k){var v=real();if(!v)return undefined;var d=Object.getOwnPropertyDescriptor(v,k);if(d)d.configurable=true;return d},'
              'set:function(t,k,val){var v=real();if(v)v[k]=val;return true}})},'
              'set:function(v){Object.defineProperty(w,key,{value:v,writable:true,configurable:true,enumerable:true})}})}\n'
              '(function(){var go=function(){if(window.PACK36_FULL)return;var s=document.createElement("script");s.src="content36_packs.js?v=' + rev + '";s.async=true;document.head.appendChild(s)};'
              'var later=function(){(window.requestIdleCallback||setTimeout)(go,{timeout:20000})};'
              'if(document.readyState==="complete")setTimeout(later,8000);else addEventListener("load",function(){setTimeout(later,8000)})})();')
    out = "\n".join(L)
    a = '["or","kind","heat","cast","tags","tabs","title","hook","premise","you","warn","status","rel","pack"].forEach(k=>w[k]=p[k]);'
    b = '["or","kind","heat","cast","tags","tabs","title","hook","premise","you","warn","status","rel"].forEach(k=>w[k]=p[k]);PK36lazy(w,"pack",()=>PK36()[p.id]);'
    c = 'w.openings=[{id:"ch1",t:w.pack.chapters[0].t,beats:w.pack.chapters[0].beats}];'
    d = 'PK36lazy(w,"openings",()=>{const c0=w.pack.chapters[0];return [{id:"ch1",t:c0.t,beats:c0.beats}]});'
    e = 'if(w.quest){const c=w.pack.chapters,ttl=w.title;w.quest={turns:20,goals:[c[0].goal,c[1].goal],hidden:c[2].goal,'
    f = 'if(w.quest){const c=(p._q||[]).map(g=>({goal:g})),ttl=w.title;w.quest={turns:20,goals:[c[0].goal,c[1].goal],hidden:c[2].goal,'
    for x, y in ((a, b), (c, d), (e, f)):
        if x not in out: raise SystemExit("lazy36: pattern not found: " + x[:60])
        out = out.replace(x, y, 1)
    return loader + "\n" + out, packs_js

_c36 = block(["content_36.js"])
_c36_lazy, _packs_js = _lazy36(_c36)
open(os.path.join(ROOT, "content36_packs.js"), "w", encoding="utf8", newline="\n").write(_packs_js)
_js_lazy = js.replace(_c36, _c36_lazy, 1)
_html_lazy = shell + "\n<script>\n" + assets + _js_lazy + "\n</script>\n"
# 2026-11-26 · 内联大图拆出去：脚本里 >3KB 的 base64 图片（剧本工坊素材库、个别老剧立绘）写成 art/inline/<内容哈希>.<扩展名> 静态文件，
# 页面里只留网址——图片由浏览器单独缓存，首页少下约 330KB。只动后面紧跟引号/括号的完整字符串，SVG 不动。
def _unb64(text):
    import base64 as _b, re as _re
    d = os.path.join(ROOT, "art", "inline"); os.makedirs(d, exist_ok=True)
    EXT = {"jpeg": "jpg"}
    n = [0, 0]
    def rep(m):
        sub, data = m.group(1), m.group(2)
        nxt = m.string[m.end():m.end() + 1]
        if len(data) < 3000 or sub == "svg+xml" or nxt not in ("\"", "'", "`", ")"): return m.group(0)
        try: raw = _b.b64decode(data, validate=True)
        except Exception: return m.group(0)
        fn = hashlib.sha256(raw).hexdigest()[:16] + "." + EXT.get(sub, sub)
        p = os.path.join(d, fn)
        if not os.path.exists(p):
            with open(p, "wb") as f: f.write(raw)
        n[0] += 1; n[1] += len(m.group(0))
        return "/art/inline/" + fn
    out = _re.sub(r"data:image/([a-z0-9+.-]+);base64,([A-Za-z0-9+/=]+)", rep, text)
    print("unb64:", n[0], "images,", n[1], "chars moved to art/inline/")
    return out
_html_lazy = _unb64(_html_lazy)
_hl = hashlib.sha256(_html_lazy.encode("utf-8")).hexdigest()[:12]
_si2 = _html_lazy.find("<script>")
_html_lazy = _html_lazy[:_si2 + 8] + "\n" + 'window.MIRU_BUILD="' + _hl + " " + _ts + ' lazy36";' + _html_lazy[_si2 + 8:]
# 2026-11-27 · 首屏提速：主脚本（约 5MB）写成带内容哈希的独立文件 app.<哈希>.js，页面里只留一个 <script src>。
#   · 页面本身只剩几百 KB，手机上马上能画出下面的开屏页，不再长时间黑屏；
#   · 外部脚本浏览器会单独缓存，Chrome 还会缓存编译结果，第二次起打开明显更快；
#   · 文件名带哈希，内容一变就是新文件，不会读到旧缓存。旧的 app.*.js 只保留最近 3 个。
BOOT_SPLASH = ('<div id="boot-splash" style="position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;background:#07060A;color:#F1ECF3;font:600 13px/1.4 -apple-system,BlinkMacSystemFont,sans-serif;letter-spacing:.32em;transition:opacity .3s">'
               '<img src="/icons/icon-192.png" width="88" height="88" alt="" style="border-radius:22px;box-shadow:0 8px 30px rgba(240,183,126,.25)">'
               '<div>MIRU</div><div style="width:120px;height:3px;border-radius:2px;background:rgba(255,255,255,.12);overflow:hidden"><i style="display:block;width:40%;height:100%;background:#F0B77E;animation:bootbar 1.1s ease-in-out infinite"></i></div>'
               '<style>@keyframes bootbar{0%{transform:translateX(-100%)}100%{transform:translateX(250%)}}</style></div>')
BOOT_DONE = '<script>(function(){var s=document.getElementById("boot-splash");if(!s)return;s.style.opacity="0";setTimeout(function(){s.remove()},320)})();</script>'
def _externalize(html):
    b = html.rfind("\n</script>\n")
    a = html.rfind("\n<script>\n", 0, b) + 1
    if a < 0 or b <= a: raise SystemExit("externalize: main script block not found")
    js_body = html[a + len("<script>\n"):b]
    tag = hashlib.sha256(js_body.encode("utf-8")).hexdigest()[:12]
    name = "app." + tag + ".js"
    open(os.path.join(ROOT, name), "w", encoding="utf8", newline="\n").write(js_body + "\n")
    olds = sorted((f for f in os.listdir(ROOT) if f.startswith("app.") and f.endswith(".js") and f != name), key=lambda f: os.path.getmtime(os.path.join(ROOT, f)), reverse=True)
    for f in olds[2:]:
        try: os.remove(os.path.join(ROOT, f))
        except OSError: pass
    page = html[:a] + '<script src="/' + name + '"></script>\n' + BOOT_DONE + html[b + len("\n</script>"):]
    i = page.find('<div class="app"><div class="device" id="dev"></div></div>')
    if i < 0: raise SystemExit("externalize: #dev not found")
    page = page[:i] + BOOT_SPLASH + "\n" + page[i:]
    print("externalize:", name, len(js_body), "chars; page", len(page), "chars")
    return page
open(os.path.join(ROOT, "index.lazy.html"), "w", encoding="utf8", newline="\n").write(_html_lazy)
if LAZY_DEFAULT and not SPLIT:
    open(out, "w", encoding="utf8", newline="\n").write(_externalize(_html_lazy))
print(len(_html_lazy), "chars -> index.lazy.html", "(default)" if LAZY_DEFAULT else "", "| packs", len(_packs_js))
