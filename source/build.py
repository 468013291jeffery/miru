import os
import re,subprocess
subprocess.run(['python3','gen_content.py'],check=True)
parts=["content_chars.js","content_worlds.js","content_extra.js","tr_merge.js","tr_ja.js","tr_ko.js","tr_es.js","content_36.js","shorts_v2.js","shorts_v3.js","i18n.js","app1_core.js","miru_rules_full.js","miru_rules.js","app2_pages.js","app3_chat.js","app4_more.js","app5_money.js","app6_games.js","app7_rank.js","app8_i18n.js","app10_story.js","app11_memory.js","app12_beats.js","app13_rel.js","app85_guide.js","app9_ads.js","app14_pack.js","app16_story2.js","app17_custom.js","app18_promo.js","app19_bgm.js","app20_fx_booth.js","app21_dims.js","app22_fx2.js","app23_heir.js","app24_gl.js","app25_dir.js","app26_turns.js","app27_choice.js","app28_burst.js","app29_style.js","app30_fx3.js","app31_score.js","app32_myline.js","app33_recs.js","app34_hints.js","app35_pay.js","app36_live.js","app37_hooks.js","app38_gift.js","app39_compact.js","app40_sfx.js","app41_merge.js","app42_decline.js","app43_couple.js","studio_lib.js","app44_studio.js","app45_rel.js","app46_cp.js","app47_chapters.js","app48_clean.js","app49_creator.js","creator_embed.js","app50_creator2.js","app51_import.js","app52_alt.js","pdfjs_embed.js","app53_import2.js","app54_longcat.js","app55_talk.js","app56_story3.js","app57_rules.js","app58_bgm100.js","app59_fx100.js","app60_games100.js","app61_honor.js","app62_tts.js","app63_fixes.js","app64_entry.js","app65_lib.js","app66_libup.js","app67_i18n.js","app68_cloud.js","app69_acct.js","app70_login.js","app71_narrative.js","app72_zhpure.js","app73_features.js","app74_experience.js","app75_mydock.js","app76_official.js","app77_memory2.js","app78_memsync.js","app79_ledger.js","app80_cache.js","app81_voicecall.js","app82_qwenimg.js","app83_vidu.js","app84_nosub.js","app86_voicefix.js","app87_regcode.js","app88_memcall.js","app89_offsearch.js","app90_youturn.js","app91_phone.js","app92_mustlogin.js","app93_doubao.js","app94_official2.js","app95_safety.js","app96_social.js","app97_agents.js","app15_home.js","app99_boot.js"]
# --- MIRU final rules: one source (src/rules_final.md + src/miru_rules.js) → app, admin console, backend ---
import json as _rj
_full="var MIRU_RULES_FULL="+_rj.dumps(open("src/rules_final.md",encoding="utf8").read(),ensure_ascii=False)+";\nvar MIRU_RULES_SKILL="+_rj.dumps(open("src/rules_skill_v1.md",encoding="utf8").read(),ensure_ascii=False)+";\n"
open("src/miru_rules_full.js","w",encoding="utf8").write(_full)
_mod=open("src/miru_rules.js",encoding="utf8").read()
os.makedirs("deploy/api",exist_ok=True)
open("deploy/miru_rules.js","w",encoding="utf8").write(_full+_mod)
open("deploy/api/_rules.js","w",encoding="utf8").write(_full+_mod)
js="\n".join(open("src/"+p).read() for p in parts)
open("all.js","w").write(js)
import glob,os,json as _j
_sf={}
for f in sorted(glob.glob("art/scenes/**/*.*",recursive=True)):
    k=os.path.splitext(f[len("art/scenes/"):])[0]
    if f.endswith(".mp4") or k not in _sf:_sf[k]=f
_bf={os.path.splitext(f[len("art/bgm/"):])[0].replace(os.sep,"/"):f for f in sorted(glob.glob("art/bgm/**/*.*",recursive=True)) if f.endswith((".mp3",".m4a",".ogg"))}
import glob as _g
_cf=sorted(x.split("/")[-1][:-5] for x in _g.glob("art/cut/*.webp"))
js="window.CUT_FILES="+_j.dumps(_cf)+";\n"+"window.SCENE_FILES="+_j.dumps(_sf)+";\nwindow.BGM_FILES="+_j.dumps(_bf)+";\n"+js
html=open("src/shell.html").read()+"\n<script>\n"+js+"\n</script>\n"
open("index.html","w").write(html)
print(len(html))
