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
parts=["content_chars.js","content_worlds.js","content_extra.js","tr_merge.js","tr_ja.js","tr_ko.js","tr_es.js","content_36.js","shorts_v2.js","shorts_v3.js","i18n.js","app1_core.js","app96_tune.js","app94_replyguard.js","app95_status.js","app97_card.js","app98_emotion.js","app99_plan.js","miru_rules_full.js","miru_rules.js","app2_pages.js","app3_chat.js","app4_more.js","app5_money.js","app6_games.js","app7_rank.js","app8_i18n.js","app10_story.js","app11_memory.js","app12_beats.js","app13_rel.js","app85_guide.js","app9_ads.js","app14_pack.js","app16_story2.js","app17_custom.js","app18_promo.js","app19_bgm.js","app20_fx_booth.js","app21_dims.js","app22_fx2.js","app23_heir.js","app24_gl.js","app25_dir.js","app26_turns.js","app27_choice.js","app28_burst.js","app29_style.js","app30_fx3.js","app31_score.js","app32_myline.js","app33_recs.js","app34_hints.js","app35_pay.js","app36_live.js","app37_hooks.js","app38_gift.js","app39_compact.js","app40_sfx.js","app41_merge.js","app42_decline.js","app43_couple.js","studio_lib.js","app44_studio.js","app45_rel.js","app46_cp.js","app47_chapters.js","app48_clean.js","app49_creator.js","creator_embed.js","app50_creator2.js","app51_import.js","app52_alt.js","app53_import2.js","app54_longcat.js","app55_talk.js","app56_story3.js","app57_rules.js","app58_bgm100.js","app59_fx100.js","app60_games100.js","app61_honor.js","app62_tts.js","app63_fixes.js","app64_entry.js","app65_lib.js","app66_libup.js","app67_i18n.js","app68_cloud.js","app69_acct.js","app70_login.js","app71_narrative.js","app72_zhpure.js","app73_features.js","app74_experience.js","app75_mydock.js","app76_official.js","app77_memory2.js","app78_memsync.js","app79_ledger.js","app80_cache.js","app81_voicecall.js","app82_qwenimg.js","app83_vidu.js","app84_nosub.js","app86_voicefix.js","app87_regcode.js","app88_memcall.js","app89_offsearch.js","app90_youturn.js","app91_phone.js","app92_mustlogin.js","app93_doubao.js","app94_official2.js","app15_home.js","app92_media.js","app93_agegate.js","app100_fixes.js","app100_dialogue.js","app95_safety.js","app96_social.js","app97_agents.js","app98_story.js","app101_you.js","app99_boot.js"]
# --- MIRU final rules: one source (src/rules_final.md + src/miru_rules.js) → app, admin console, backend ---
import json as _rj
_full="var MIRU_RULES_FULL="+_rj.dumps(open("src/rules_final.md",encoding="utf8").read(),ensure_ascii=False)+";\nvar MIRU_RULES_SKILL="+_rj.dumps(open("src/rules_skill_v1.md",encoding="utf8").read(),ensure_ascii=False)+";\n"
open("src/miru_rules_full.js","w",encoding="utf8").write(_full)
_mod=open("src/miru_rules.js",encoding="utf8").read()
# the same text must reach the page (/miru_rules.js) and the functions (/api/_rules.js)
for p in (os.path.join(ROOT,"miru_rules.js"), os.path.join(ROOT,"api","_rules.js")):
    open(p,"w",encoding="utf8").write(_full+_mod)
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
_sf={}
for f in sorted(glob.glob(ART+"scenes/**/*.*",recursive=True)):
    k=_key(ART+"scenes/", f)
    if f.endswith(".mp4") or k not in _sf:_sf[k]=_url(f)
_bf={_key(ART+"bgm/", f):_url(f) for f in sorted(glob.glob(ART+"bgm/**/*.*",recursive=True)) if f.endswith((".mp3",".m4a",".ogg"))}
import glob as _g
_cf=sorted(os.path.splitext(os.path.basename(x))[0] for x in _g.glob(ART+"cut/*.webp"))
assets=("window.CUT_FILES="+_j.dumps(_cf)+";\n"+"window.SCENE_FILES="+_j.dumps(_sf)+
        ";\nwindow.BGM_FILES="+_j.dumps(_bf)+";\n")
shell=open("src/shell.html", encoding="utf8").read()

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
