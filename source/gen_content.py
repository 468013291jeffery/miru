#!/usr/bin/env python3
"""content/out/sNN.json (36 story packs) + content/art_looks_*.json  →  src/content_36.js
Runs before build.py. The generated file mutates C / W / TAGS / TAG_ZH so the rest of the app sees one catalog."""
import json, glob, os, hashlib, sys

# Windows: the console / default text encoding is the OEM code page (GBK here), not UTF-8.
# Every read and write below is explicitly UTF-8 so that a Windows build == a Linux build, byte for byte.
if (sys.stdout.encoding or "").lower() not in ("utf-8", "utf8"):
    try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception: pass
RD = lambda p: open(p, encoding="utf8")
def WR(p, s):
    with open(p, "w", encoding="utf8", newline="\n") as f: f.write(s)

HERE = os.path.dirname(os.path.abspath(__file__))
P = lambda *a: os.path.join(HERE, *a)
packs = [json.load(RD(f)) for f in sorted(glob.glob(P("content/out/s*.json")))]
assert len(packs) == 37, len(packs)
looks = {}
for f in glob.glob(P("content/art_looks_*.json")):
    looks.update(json.load(RD(f)))
exist = json.load(RD(P("content/existing_chars.json")))
# story rewrites: content/deep/<wid>_story.json overrides the pack's metadata before the deep chapters are applied
for d in packs:
    fp = P("content/deep", d["wid"] + "_story.json")
    if not os.path.exists(fp): continue
    o = json.load(RD(fp))
    for k in ("title", "hook", "logline", "premise", "you", "stakes", "intro", "ready", "endings", "tags", "place", "time", "rel", "love", "dims"):
        if k not in o: continue
        if k in ("title", "hook", "logline", "premise", "you", "stakes", "place", "time") and isinstance(d.get(k), dict):
            d[k] = {**d[k], **o[k]}  # zh/en rewritten; other languages keep their old text until re-translated
        elif k == "endings":
            for ek, ev in o[k].items(): d[k][ek] = {**d[k].get(ek, {}), **{kk: ({**d[k].get(ek, {}).get(kk, {}), **vv} if isinstance(vv, dict) else vv) for kk, vv in ev.items()}}
        else: d[k] = o[k]
    for c in d["cast"]:
        if c["id"] in o.get("au_role", {}): c["au_role"] = {**c.get("au_role", {}), **o["au_role"][c["id"]]}
    for i, oc in enumerate(o.get("chapters", [])):
        c = d["chapters"][i]
        for k in ("t", "goal", "place", "time", "ask", "beats"):
            if k in oc: c[k] = oc[k]
        for x in oc.get("choices", []):
            y = next(z for z in c["choices"] if z["k"] == x["k"])
            for k in ("t", "mem", "then", "set"):
                if k in x: y[k] = x[k]
# deep chapters: content/deep/<wid>_ch<N>.json replaces a chapter's opening beats and each choice's "then", per language
for d in packs:
    for i, c in enumerate(d["chapters"]):
        fp = P("content/deep", "%s_ch%d.json" % (d["wid"], i + 1))
        if not os.path.exists(fp): continue
        dp = json.load(RD(fp))
        c["beats"].update(dp.get("beats", {}))
        for x in c["choices"]:
            if x["k"] in dp.get("then", {}): x["then"].update(dp["then"][x["k"]])
REUSE = {"ada": "sasha", "riley": "marisol", "mara": "nora", "finn": "callum", "lena": "dakota"}
RETIRED = ["sasha", "marisol", "nora", "callum", "dakota"]

def h(s): return int(hashlib.md5(s.encode()).hexdigest()[:8], 16)
# art lives at the repo root, one level up. build.sh used to symlink ../art into source/ for this;
# we point at it directly instead, so the build works on Windows too (no symlink/junction needed).
ROOT_ART = os.path.normpath(os.path.join(HERE, "..", "art"))
def has_art(name): return os.path.exists(os.path.join(ROOT_ART, name + ".jpg"))

# ---- home/discover shelves ("moods"). For You and Hot are computed at runtime. ----
MOOD = {
 "sweet": "pact roomies night dog crush float laundry secondset recipe openhouse lastplate landing forecast lastjam".split(),
 "rivals": "ice pole fourth split gala offbook openhouse lastplate heroics float".split(),
 "dark": "crimson made bratva masque pack unseelie".split(),
 "fantasy": "crimson unseelie pack market dragon heroics forecast august twominutes recipe".split(),
 "second": "lowseason turn rewind light split ice market fourth august".split(),
 "ensemble": "pack afterhours masque gala market".split(),
}
GENRE_EXTRA = {"Cozy", "Sci-Fi", "Mystery", "Bittersweet"}
TROPE_EXTRA = {"Found Family", "Neighbors", "Coworkers", "Long Distance", "Friends to Lovers", "Pet Romance", "Life Change"}

C_out, W_out, tag_zh, new_tags = {}, [], {}, {"genre": [], "setting": [], "trope": [], "char": []}
for d in packs:
    wid = d["wid"]
    tag_zh.update(d.get("tag_zh", {}))
    pov = d.get("pov") or next(c["id"] for c in d["cast"] if c.get("pov"))
    ens = d["kind"] == "ensemble" and d["or"] == "all"
    cast = [c["id"] for c in d["cast"]]
    au = {}
    if ens:
        au = {c["id"]: c["au_role"] for c in d["cast"]}
    else:
        for c in d["cast"]:
            cid = c["id"]
            src = exist.get(cid) or exist.get(REUSE.get(cid, ""))
            lk = c.get("looks") or (looks.get(cid) or {}).get("looks") or (src or {}).get("looks")
            pal = (looks.get(cid) or {}).get("pal")
            if not pal:
                import colorsys
                hh = (h(cid) % 360) / 360
                pal = ["#%02x%02x%02x" % tuple(int(x * 255) for x in colorsys.hls_to_rgb(hh, .62, .55)), "#%02x%02x%02x" % tuple(int(x * 255) for x in colorsys.hls_to_rgb(hh, .1, .3))]
            art = cid if has_art(cid) else (REUSE.get(cid) if REUSE.get(cid) and has_art(REUSE[cid]) else None)
            if cid in exist and not has_art(cid): art = exist[cid].get("art")
            hx = h(cid)
            v = {"pitch": round((0.84 + (hx % 14) / 100) if c["g"] == "m" else (1.08 + (hx % 14) / 100), 2), "rate": round(0.94 + (hx % 9) / 100, 2)}
            C_out[cid] = {k: c[k] for k in ("n", "age", "g", "a", "role", "vibe", "tells", "twist", "likes", "secret", "pitch", "solo", "want", "fear", "boundary")}
            C_out[cid].update({"w": wid, "looks": lk, "_pal": pal, "_art": art, "_v": v, "_new": cid not in exist})
    tabs = [k for k, L in MOOD.items() if wid in L]
    if "Slow Burn" in d["tags"] and d["heat"] in ("slow", "steamy") and wid not in MOOD["dark"]: tabs.append("slow")
    if "Second Chance" in d["tags"] and "second" not in tabs: tabs.append("second")
    for t in d["tags"]:
        if t in GENRE_EXTRA: new_tags["genre"].append(t)
        elif t in TROPE_EXTRA: new_tags["trope"].append(t)
        else: new_tags["setting"].append(t)
    pk = {k: d[k] for k in ("chapters", "endings", "bonus", "polaroid", "features", "director", "join", "logline")}
    for k in ("intro", "ready", "love", "dims"):
        if d.get(k) is not None: pk[k] = d[k]
    pk.update({"n": d["n"], "pov": pov, "au": au})
    hx = h(wid)
    W_out.append({"id": wid, "or": d["or"], "kind": d["kind"], "heat": d["heat"], "cast": cast, "tags": d["tags"], "tabs": tabs,
                  "title": d["title"], "hook": d["hook"], "premise": d["premise"], "you": d["you"], "warn": d["stakes"],
                  "status": {"time": d["time"], "place": d["place"]}, "rel": d["rel"], "pack": pk,
                  "_cover": wid if has_art(wid) else None,
                  "_stats": [180000 + hx % 760000, 9000 + hx % 52000, 600 + hx % 7400]})

js = ["/* ================= 36 STORY PACKS (generated by gen_content.py — do not edit by hand) =================",
      "   Each story: 8 chapters · scripted beats · A/B/C choices with consequences · 3 endings. Chapters 1–2 free; 3–8 in the Story Pack. */",
      "const PACK_C=" + json.dumps(C_out, ensure_ascii=False, separators=(",", ":")) + ";",
      "const PACK_W=" + json.dumps(W_out, ensure_ascii=False, separators=(",", ":")) + ";",
# 每部剧本的内容版本号（T06）：口径 = 规范化 JSON（键排序、不含空白）的 sha1 前 12 位。
# 为什么用规范化 JSON 而不是文件字节：换行/缩进变化不该让缓存失效，**内容变了**才该。
# 它会进 prompt 的固定段（PACK 那一行），所以内容一改，固定段就变、缓存自然失效。
      "const MIRU_REV=" + json.dumps({
          w["id"]: __import__("hashlib").sha1(
              json.dumps(w, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode("utf8")
          ).hexdigest()[:12] for w in W_out
      }, ensure_ascii=False, sort_keys=True) + ";",
      "const PACK_TAGZH=" + json.dumps(tag_zh, ensure_ascii=False) + ";",
      "const PACK_NEWTAGS=" + json.dumps({k: sorted(set(v)) for k, v in new_tags.items()}) + ";",
      "const RETIRED=" + json.dumps(RETIRED) + ";",
      r"""(function(){
 Object.keys(PACK_C).forEach(id=>{const p=PACK_C[id],o=C[id]||{};
  const c=Object.assign(o,{n:p.n,age:p.age,g:p.g,a:p.a,w:p.w,role:p.role,vibe:p.vibe,tells:p.tells,twist:p.twist,likes:p.likes,secret:p.secret,pitch:p.pitch,solo:p.solo,want:p.want,fear:p.fear,boundary:p.boundary});
  if(p.looks)c.looks=p.looks;if(p._art)c.art=p._art;if(!c.pal)c.pal=p._pal;if(!c.v)c.v=p._v;if(!c.h)c.h="";C[id]=c});
 RETIRED.forEach(id=>{if(C[id])C[id].retired=true});
 /* the 36 packs rewrite these stories, so the old ja/ko/es translations no longer match: those languages fall back to English */
 ["ja","ko","es"].forEach(l=>{const X=typeof TX!=="undefined"&&TX[l];if(!X)return;Object.keys(PACK_C).forEach(id=>{if(X.c)delete X.c[id]});PACK_W.forEach(p=>{if(X.w)delete X.w[p.id]})});
 PACK_W.forEach(p=>{let w=W.find(x=>x.id===p.id);
  if(!w){w={id:p.id,author:"@miru",official:true,stats:p._stats,pal:(C[p.cast[0]]||{}).pal||["#C7A25C","#15131A"],isNew:true};W.push(w)}
  ["or","kind","heat","cast","tags","tabs","title","hook","premise","you","warn","status","rel","pack"].forEach(k=>w[k]=p[k]);
  if(p._cover)w.cover=p._cover;if(w.kind!=="ensemble")delete w.kind;
  w.openings=[{id:"ch1",t:w.pack.chapters[0].t,beats:w.pack.chapters[0].beats}];
  /* Story Challenges (free-play goals scored by the AI) keep running on the worlds that had them, rebuilt from the new chapters */
  if(w.quest){const c=w.pack.chapters,ttl=w.title;w.quest={turns:20,goals:[c[0].goal,c[1].goal],hidden:c[2].goal,qtitle:{en:"Challenge · "+ttl.en,zh:"挑战 · "+ttl.zh}}}
  delete w.short;});
 Object.keys(PACK_NEWTAGS).forEach(k=>PACK_NEWTAGS[k].forEach(t=>{if(!Object.values(TAGS).some(L=>L.includes(t)))TAGS[k].push(t)}));
 Object.assign(TAG_ZH,PACK_TAGZH);Object.assign(TAG_ZH,{"Cozy":"治愈","Sci-Fi":"科幻","Mystery":"悬疑","Bittersweet":"苦乐参半","Found Family":"家人般的伙伴","Neighbors":"邻居","Coworkers":"同事","Long Distance":"异地","Friends to Lovers":"朋友变恋人","Bakery":"面包店","Kitchen":"后厨","Jazz Club":"爵士俱乐部","Radio":"电台","Roller Derby":"轮滑德比","Dragons":"龙","Ghosts":"幽灵","Space Station":"空间站","Road Trip":"公路旅行","Apartment Life":"公寓生活"});
})();"""]
js.append("const ALT_LINES=" + json.dumps({c: json.load(RD(P("content/out/alt_"+c+".json"))) for c in ("adrianv","roman") if os.path.exists(P("content/out/alt_"+c+".json"))}, ensure_ascii=False) + ";")
js.append("const TROPE_MAP=" + json.dumps(json.load(RD(P("content/out/trope_map.json"))) if os.path.exists(P("content/out/trope_map.json")) else {}, ensure_ascii=False) + ";")
# 每幕在场名单（03.6 知情）：写在 content/present/<wid>.json 的旁档里，pack 正文一个字不动。
# 没有旁档的剧本 => 不注入 => 运行时退回 th.cast（行为与现在完全一致）。
_pres = {}
_pdir = P("content/present")
if os.path.isdir(_pdir):
    for _f in sorted(glob.glob(os.path.join(_pdir, "*.json"))):
        try:
            _d = json.load(RD(_f))
            if _d.get("wid") and isinstance(_d.get("chapters"), list):
                _pres[_d["wid"]] = _d["chapters"]
        except Exception as _e:
            print("!! present sidecar skipped:", _f, _e)
js.append("const MIRU_PRESENT=" + json.dumps(_pres, ensure_ascii=False) + ";")
# 内容标记（④立场 / ⑤揭示）：和在场名单一样走旁档，pack 正文不动
_marks = {}
_mdir = P("content/marks")
if os.path.isdir(_mdir):
    for _f in sorted(glob.glob(os.path.join(_mdir, "*.json"))):
        try:
            _d = json.load(RD(_f))
            if _d.get("wid"):
                _marks[_d["wid"]] = _d
        except Exception as _e:
            print("!! marks sidecar skipped:", _f, _e)
js.append("const MIRU_MARKS=" + json.dumps(_marks, ensure_ascii=False) + ";")
WR(P("src/content_36.js"), "\n".join(js) + "\n")
print("content_36.js", sum(len(x) for x in js), "bytes ·", len(W_out), "worlds ·", len(C_out), "characters ·",
      sum(1 for c in C_out.values() if c["_art"]), "with portraits ·", sum(1 for w in W_out if w["_cover"]), "with covers")
