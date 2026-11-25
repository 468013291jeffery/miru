#!/usr/bin/env python3
"""MIRU · 程序化 SEO / GEO 页面（2026-11-26）

在 gen_seo.py（作品页、剧目总览、about、robots、sitemap、llms.txt）之后跑，补上：
  characters/<slug>.html        每个主要角色一页（Chat with …）——角色页是搜索入口
  boyfriends/<type>.html        男主身份：mafia / billionaire / vampire / werewolf / k-pop / royal / professor …
  romance/<trope>.html          恋爱套路：enemies-to-lovers / second-chance / love-triangle / forbidden …
  ai-boyfriend.html             虚拟男友总入口
  bl.html / gl.html             BL / GL 专区
  what-is-miru.html             给 AI 搜索引用的官方说明（是什么、怎么玩、免费吗、平台、语言、更新时间）
  compare.html                  MIRU 和通用 AI 聊天 App 的区别（只写 MIRU 自己可核实的事实）
并且：在每个作品页里加上角色页、分类页的内部链接；重写 sitemap.xml / llms.txt / llms-full.txt，把新页面都放进去。
原则：只用线上真实作品的数据；某个分类一部作品都没有就不生成（不做空页面）；成人向作品不出现。
"""
import os, re, sys, json, datetime
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import gen_seo as G

SITE, E, page, ROOT = G.SITE, G.E, G.page, G.ROOT
_cache = {}
_get0 = G.get
def _get(path, timeout=25):
    if path not in _cache:
        _cache[path] = _get0(path, timeout)
    return _cache[path]
G.get = _get

BOYFRIENDS = [
    ("mafia", "Mafia Boyfriend", r"mafia|mob boss|gang|cartel|godfather|don\b|黑帮|教父"),
    ("billionaire", "Billionaire & CEO Boyfriend", r"billionaire|ceo\b|tycoon|heir|rich|富豪|总裁|亿万|继承人"),
    ("vampire", "Vampire Boyfriend", r"vampire|blood|吸血鬼"),
    ("werewolf", "Werewolf Boyfriend", r"werewolf|wolf|alpha|lycan|狼"),
    ("kpop", "K-pop Idol Boyfriend", r"k-?pop|idol|boy ?band|trainee|偶像|男团|娱"),
    ("royal", "Prince & Royal Boyfriend", r"prince|royal|king|crown|throne|王子|王储|皇|王冠"),
    ("athlete", "Hockey & Athlete Boyfriend", r"hockey|athlete|team captain|player|冰球|运动员"),
    ("demon", "Demon & Villain Boyfriend", r"demon|devil|villain|dark lord|魔王|恶魔|反派"),
    ("professor", "Professor & Teacher Boyfriend", r"professor|teacher|lecturer|教授|老师"),
    ("bodyguard", "Bodyguard Boyfriend", r"bodyguard|guard|protector|保镖"),
    ("celebrity", "Celebrity Boyfriend", r"celebrity|actor|star\b|streamer|singer|明星|演员|歌手"),
    ("dragon", "Dragon & Fantasy Boyfriend", r"dragon|fae|fairy|elf|god\b|gods|龙|神"),
]
TROPES = [
    ("enemies-to-lovers", "Enemies to Lovers", r"enem(y|ies)|rival|hate|宿敌|死对头|冤家"),
    ("second-chance", "Second Chance Romance", r"second chance|ex-|ex\b|former|reunion|years ago|旧爱|破镜|前任|重逢"),
    ("love-triangle", "Love Triangle & Reverse Harem", r"love triangle|triangle|three men|two men|reverse harem|three of them|both of them|三角|修罗场|多男"),
    ("forbidden-romance", "Forbidden Romance", r"forbidden|secret|taboo|professor|禁忌|秘密"),
    ("fake-dating", "Fake Dating & Contract Romance", r"fake|contract|pretend|arranged|marriage|wedding|bride|husband|假|契约|婚"),
    ("slow-burn", "Slow Burn Romance", r"slow burn|slow-burn|friends to lovers|慢热"),
    ("dark-romance", "Dark Romance", r"dark|danger|obsess|possessive|revenge|murder|killer|暗黑|复仇|凶手"),
    ("fantasy-romance", "Fantasy Romance", r"fantasy|magic|curse|kingdom|realm|奇幻|魔法|诅咒"),
    ("workplace-romance", "Office & Workplace Romance", r"office|boss|workplace|ceo|company|colleague|上司|职场|公司"),
]

def blob(w):
    en = w.get("en") or {}
    parts = [en.get("title"), en.get("hook"), en.get("premise"), " ".join(w.get("tags") or []), " ".join(c.get("role", "") for c in (w.get("chars_en") or []))]
    return " ".join(str(x or "") for x in parts).lower()

def leads_of(w):
    """主要角色：优先用作品包里的人物卡（pack.meta.leads，有英文名、身份、立绘），没有就用剧本 ⟦CHAR⟧。"""
    try:
        d = _get("/api/works?id=" + w["id"])
    except Exception:
        d = {}
    W = d.get("work", d) or {}
    pk = W.get("pack") or {}
    m = pk.get("meta") or {}
    A = pk.get("assets") or {}
    out = []
    for x in (m.get("leads") or [])[:8]:
        n = x.get("n") or {}
        nm = n.get("en") if isinstance(n, dict) else n
        if not nm or CJK.search(nm):
            continue
        L = lambda k: en_only((x.get(k) or {}).get("en") if isinstance(x.get(k), dict) else (x.get(k) or ""))
        out.append({"n": nm, "role": L("role"), "vibe": L("vibe") or L("pitch"), "line": L("solo"), "age": x.get("age"), "g": x.get("g"),
                    "img": G.absu(x.get("art") or A.get("char_" + str(x.get("key") or "")) or "")})
    if not out:
        for i, c in enumerate(w.get("chars_en") or []):
            out.append({"n": c["n"], "role": c.get("role", ""), "vibe": c.get("look", ""), "line": "", "age": c.get("age"), "g": c.get("g"),
                        "img": G.portrait(w, (w.get("chars") or [{}] * 9)[i].get("n", c["n"]) if i < len(w.get("chars") or []) else c["n"], i)})
    w["orient"] = W.get("orient") or w.get("orient") or ""
    if not w.get("cover"):
        w["cover"] = G.absu(A.get("cover") or A.get("poster") or "")
    for c in out:
        c["role"], c["vibe"] = en_only(c.get("role")), en_only(c.get("vibe"))
    return [c for c in out if c["n"] and not CJK.search(c["n"]) and not re.search(r"%[0-9A-Fa-f]{2}", c["n"]) and c["n"] not in ("You", "你")]

CJK = re.compile(r"[\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]")
def en_only(s):
    s = str(s or "")
    return "" if CJK.search(s) or re.search(r"%[0-9A-Fa-f]{2}", s) else s

def tt(w):
    return (w.get("en") or {}).get("title") or w["title"]

def card(w):
    img = ('<img src="' + E(w["cover"]) + '" alt="' + E(tt(w)) + '" loading="lazy">') if w.get("cover") else ""
    return '<a class="card" href="/stories/' + E(w["slug"]) + '.html">' + img + '<span class="t"><b>' + E(tt(w)) + '</b><small>' + E((w.get("en") or {}).get("hook") or w["hook"]) + "</small></span></a>"

def char_card(c):
    img = ('<img src="' + E(c["img"]) + '" alt="' + E(c["n"]) + '" loading="lazy">') if c.get("img") else ""
    return '<div>' + img + '<span><h3><a href="/characters/' + E(c["slug"]) + '.html">' + E(c["n"]) + '</a></h3><p>' + E(c.get("role") or "") + "</p></span></div>"

def crumbs(items):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + u} for i, (n, u) in enumerate(items)]}

def faq_ld(faq):
    return {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]}

def faq_html(faq):
    return "<h2>FAQ</h2>" + "".join("<h3>" + E(q) + "</h3><p>" + E(a) + "</p>" for q, a in faq)

def char_page(c):
    w = c["w"]; t = tt(w)
    lead = c["n"] + (", " + str(c["age"]) if c.get("age") else "") + (" — " + c["role"] if c.get("role") else "")
    faq = [("Can I chat with " + c["n"] + "?", "Yes. " + c["n"] + " is a character in " + t + " on MIRU. Start the story at miru.plus and talk to " + c["n"] + " in your own words; your choices change how the relationship develops."),
           ("Who is " + c["n"] + "?", lead + ". " + (c.get("vibe") or "")),
           ("Is " + c["n"] + " a real person?", "No. " + c["n"] + " is a fictional adult character written by the MIRU team; replies in chat are generated by AI within the character's written personality and boundaries.")]
    body = ('<p class="muted"><a href="/stories/">Stories</a> / <a href="/stories/' + E(w["slug"]) + '.html">' + E(t) + "</a> / " + E(c["n"]) + "</p>"
            + "<h1>Chat with " + E(c["n"]) + "</h1><p class=\"hook\">" + E(c.get("role") or "") + "</p>"
            + (('<img class="cover" src="' + E(c["img"]) + '" alt="' + E(c["n"]) + ' portrait" style="max-height:560px">') if c.get("img") else "")
            + ("<h2>Personality</h2><p>" + E(c["vibe"]) + "</p>" if c.get("vibe") else "")
            + ("<h2>In their own words</h2><p><i>" + E(c["line"]) + "</i></p>" if c.get("line") else "")
            + "<h2>Story</h2><p>" + E(c["n"]) + " appears in <a href=\"/stories/" + E(w["slug"]) + ".html\">" + E(t) + "</a>: " + E((w.get("en") or {}).get("hook") or w["hook"]) + "</p>"
            + ("<h2>Also in " + E(t) + "</h2><div class=\"cast\">" + "".join(char_card(x) for x in c["others"]) + "</div>" if c["others"] else "")
            + ("<p class=\"muted\">Categories: " + " · ".join('<a href="' + u + '">' + E(n) + "</a>" for n, u in c["cats"]) + "</p>" if c["cats"] else "")
            + '<p><a class="cta" href="/" style="display:inline-block">Talk to ' + E(c["n"]) + " free on MIRU</a></p>" + faq_html(faq))
    ld = [{"@context": "https://schema.org", "@type": "Person", "name": c["n"], "description": lead, "image": c.get("img") or None, "url": SITE + "/characters/" + c["slug"] + ".html",
           "subjectOf": {"@type": "CreativeWork", "name": t, "url": SITE + "/stories/" + w["slug"] + ".html"}},
          crumbs([("Stories", "/stories/"), (t, "/stories/" + w["slug"] + ".html"), (c["n"], "/characters/" + c["slug"] + ".html")]), faq_ld(faq)]
    for o in ld:
        for k in [k for k, v in o.items() if v is None]:
            del o[k]
    return page("characters/" + c["slug"] + ".html", "Chat with " + c["n"] + " — " + (c.get("role") or t)[:60] + " | MIRU", lead + ". Talk to " + c["n"] + " in the interactive romance story " + t + " on MIRU — your choices change the ending.", body, og_img=c.get("img") or w.get("cover"), ld=ld)

def hub_page(path, h1, intro, ws, chars, faq, title, desc, extra=""):
    body = ('<p class="muted"><a href="/stories/">Stories</a> / ' + E(h1) + "</p><h1>" + E(h1) + "</h1><p class=\"hook\">" + E(intro[0]) + "</p>"
            + "".join("<p>" + E(p) + "</p>" for p in intro[1:]) + extra
            + ("<h2>Stories (" + str(len(ws)) + ")</h2><div class=\"grid\">" + "".join(card(w) for w in ws) + "</div>" if ws else "")
            + ("<h2>Characters you can talk to</h2><div class=\"cast\">" + "".join(char_card(c) for c in chars[:24]) + "</div>" if chars else "")
            + '<p style="margin-top:22px"><a class="cta" href="/" style="display:inline-block">Play free on MIRU</a></p>' + faq_html(faq))
    ld = [{"@context": "https://schema.org", "@type": "CollectionPage", "name": h1, "description": desc, "url": SITE + "/" + path,
           "mainEntity": {"@type": "ItemList", "itemListElement": [{"@type": "ListItem", "position": i + 1, "url": SITE + "/stories/" + w["slug"] + ".html", "name": tt(w)} for i, w in enumerate(ws)]}},
          crumbs([("Stories", "/stories/"), (h1, "/" + path)]), faq_ld(faq)]
    return page(path, title, desc, body, og_img=(ws[0].get("cover") if ws else ""), ld=ld)

GEN_FAQ = [("Is MIRU free?", "Yes. Every story can be started for free in your browser; optional extra scenes use diamonds, which you can also earn by playing."),
           ("Do I need to download anything?", "No. MIRU runs at miru.plus in any modern browser on phone or computer."),
           ("Are the characters real?", "No. All characters are fictional adults written by the MIRU team. Their live replies are generated by AI within each character's written personality and boundaries.")]

def main():
    try:
        works = G.collect()
    except Exception as e:
        print("gen_pseo: fetch failed:", e, file=sys.stderr); return 0
    if len(works) < 3:
        return 0
    today = datetime.date.today().isoformat()
    allc, slugs = [], set()
    for w in works:
        cs = leads_of(w)
        for c in cs:
            s = G.slugify(c["n"], "c") + "-" + w["slug"][:40]
            s = re.sub(r"-+", "-", s).strip("-")
            while s in slugs:
                s += "-2"
            slugs.add(s); c["slug"] = s; c["w"] = w
        w["_cs"] = cs
        allc += cs
    for w in works:
        for c in w["_cs"]:
            c["others"] = [x for x in w["_cs"] if x is not c]
    # 分类
    cats = []  # (path, name, works)
    def mk(prefix, rows):
        for key, name, rx in rows:
            ws = [w for w in works if re.search(rx, blob(w), re.I)]
            if ws:
                cats.append((prefix + key + ".html", name, ws))
    mk("boyfriends/", BOYFRIENDS); mk("romance/", TROPES)
    for w in works:
        w["_cats"] = [(n, "/" + p) for p, n, ws in cats if w in ws]
        for c in w["_cs"]:
            c["cats"] = w["_cats"][:6]
    W = lambda rel, s: (os.makedirs(os.path.dirname(os.path.join(ROOT, rel)) or ROOT, exist_ok=True), open(os.path.join(ROOT, rel), "w", encoding="utf-8").write(s))
    for d in ("characters", "boyfriends", "romance"):
        p = os.path.join(ROOT, d)
        if os.path.isdir(p):
            for f in os.listdir(p):
                if f.endswith(".html"):
                    os.remove(os.path.join(p, f))
    for c in allc:
        W("characters/" + c["slug"] + ".html", char_page(c))
    for path, name, ws in cats:
        chars = [c for w in ws for c in w["_cs"]]
        kind = "boyfriend" if path.startswith("boyfriends/") else "romance"
        intro = ([name + " stories you play as yourself on MIRU.", "Each story is an interactive romance: you talk to the characters in your own words and make a choice in every chapter that changes the relationship, the plot and the ending. Every love interest is a fictional adult who asks before getting close and stops when you say no."]
                 if kind == "boyfriend" else
                 [name + " — interactive stories where you choose how it ends.", "Read the premise, meet the characters, then play free in your browser. Your choices decide who you trust, who you fall for, or whether you choose anyone at all."])
        faq = [("What are the best " + name.lower() + " stories on MIRU?", ", ".join(tt(w) for w in ws[:6]) + "."),
               ("Can I chat with the characters?", "Yes. Every story lets you talk to the characters in your own words; " + ", ".join(c["n"] for c in chars[:6]) + (" and others are" if len(chars) > 6 else " are") + " waiting.")] + GEN_FAQ[:2]
        W(path, hub_page(path, name, intro, ws, chars, faq, name + " — Interactive Romance Stories | MIRU", intro[0] + " " + str(len(ws)) + " stories, free to play at miru.plus."))
    # 虚拟男友总入口、BL、GL
    mf = [w for w in works if w.get("orient") in ("bg", "bl", "")]
    bf_links = "<p class=\"tags\">" + "".join('<a href="/' + p + '"><span>' + E(n) + "</span></a>" for p, n, ws in cats if p.startswith("boyfriends/")) + "</p>"
    tr_links = "<p class=\"tags\">" + "".join('<a href="/' + p + '"><span>' + E(n) + "</span></a>" for p, n, ws in cats if p.startswith("romance/")) + "</p>"
    W("ai-boyfriend.html", hub_page("ai-boyfriend.html", "AI Boyfriend & Virtual Boyfriend Stories",
        ["Meet a boyfriend who remembers your story — mafia heirs, vampires, professors, idols and more.", "On MIRU you don't just chat: you live an interactive romance. Every boyfriend belongs to a written story with a world, a conflict and multiple endings, and what you say changes how he feels about you. Choose one, keep it slow, or choose no one."],
        mf, [c for w in mf for c in w["_cs"] if c.get("g") in ("m", None, "")],
        [("What is an AI boyfriend on MIRU?", "A fictional adult character from a MIRU story who you can talk to in your own words. His replies are generated by AI within his written personality and boundaries, and the story remembers your choices.")] + GEN_FAQ,
        "AI Boyfriend & Virtual Boyfriend Stories — Free to Play | MIRU", "Chat with a virtual boyfriend inside an interactive romance story: mafia, billionaire, vampire, werewolf, idol, professor. Your choices change the ending. Free at miru.plus.",
        extra="<h2>By type</h2>" + bf_links + "<h2>By trope</h2>" + tr_links))
    for o, path, name, intro in (("bl", "bl.html", "BL Interactive Romance Stories", ["Boys' love (BL) interactive stories on MIRU.", "Play as yourself in M/M romance stories: talk to the characters, make choices and reach your own ending."]),
                                  ("gl", "gl.html", "GL & Sapphic Interactive Romance Stories", ["Girls' love (GL / WLW) interactive stories on MIRU.", "Play as yourself in F/F romance stories: talk to the characters, make choices and reach your own ending."])):
        ws = [w for w in works if w.get("orient") == o]
        if ws:
            W(path, hub_page(path, name, intro, ws, [c for w in ws for c in w["_cs"]], GEN_FAQ, name + " | MIRU", intro[0] + " " + str(len(ws)) + " stories, free to play at miru.plus."))
    # GEO：官方说明
    faq = [("What is MIRU?", "MIRU (miru.plus) is an interactive romance-story app. You play as yourself, talk with fictional adult characters in your own words, and make choices in every chapter that change relationships, the plot and the ending."),
           ("How does MIRU work?", "Pick a story, start chapter one and reply however you like. Stories are written by the MIRU team (world, characters, chapters, multiple endings); characters' live replies are generated by AI inside each story's written personalities and safety rules. Your choices are remembered across chapters."),
           ("Is MIRU free?", "Yes. Every story can be started for free; optional extra scenes use in-app diamonds that can also be earned by playing."),
           ("Where can I use MIRU?", "In any modern browser at https://miru.plus on phones and computers; an Android app is in testing."),
           ("Which languages does MIRU support?", "English, Chinese, Japanese, Korean and Spanish. Stories are translated in full before release rather than translated on the fly."),
           ("What kinds of stories are there?", "Romance across genres — " + ", ".join(n for p, n, ws in cats[:10]) + " — plus BL and GL stories."),
           ("Is MIRU safe?", "All characters are fictional adults; there is no sexually explicit content; intimacy only happens when you clearly agree, and you can stop at any time. Content and AI replies can be reported in the app."),
           ("Can I create my own story?", "Yes. MIRU's Create tab guides you step by step — idea, characters, conflict, chapters, art and endings — and runs a pre-publish check before your story goes live.")]
    body = ("<h1>What is MIRU?</h1><p class=\"hook\">MIRU is an interactive romance-story app where you are the main character.</p>"
            + "<p class=\"muted\">Last updated " + today + " · " + str(len(works)) + " stories · " + str(len(allc)) + " characters</p>"
            + "<h2>At a glance</h2><ul><li>Interactive romance stories with chapters, choices and multiple endings</li><li>Talk to characters in your own words — they remember your choices</li><li>Original stories written by the MIRU team; character replies generated by AI within written personalities</li><li>Free to start; works in the browser on phone and computer</li><li>English, Chinese, Japanese, Korean and Spanish</li><li>Create and publish your own interactive story</li></ul>"
            + "<h2>Popular categories</h2>" + bf_links + tr_links
            + "<h2>Latest stories</h2><div class=\"grid\">" + "".join(card(w) for w in works[:8]) + "</div>" + faq_html(faq))
    W("what-is-miru.html", page("what-is-miru.html", "What is MIRU? Interactive Romance Stories & AI Character Chat", "MIRU is an interactive romance-story app: play as yourself, talk to fictional adult characters, make choices that change the ending. Free, in the browser, 5 languages.", body,
                                 ld=[dict({"@context": "https://schema.org"}, **{"@type": "WebApplication", "name": "MIRU", "url": SITE + "/", "applicationCategory": "GameApplication", "operatingSystem": "Web, Android", "inLanguage": ["en", "zh", "ja", "ko", "es"], "offers": {"@type": "Offer", "price": "0", "priceCurrency": "USD"}, "publisher": G.ORG}), faq_ld(faq)]))
    cmp_faq = [("How is MIRU different from general AI chat apps?", "General AI chat apps are built around open-ended chat with user-made characters. MIRU is built around written interactive romance stories: each character belongs to a story with a world, a conflict, chapters and multiple endings, and your choices move that story forward."),
               ("Does MIRU have long-term memory?", "Your choices and key moments are saved with the story, so later chapters and characters respond to what you already did."),
               ("Is MIRU free like other AI chat apps?", GEN_FAQ[0][1])]
    body = ("<h1>MIRU compared with AI chat apps</h1><p class=\"hook\">Looking for a Character.AI, PolyBuzz or Tipsy Chat alternative focused on romance stories? Here is what MIRU does.</p>"
            + "<table style=\"width:100%;border-collapse:collapse\">" + "".join("<tr><td style=\"padding:8px;border-bottom:1px solid #2A2531\"><b>" + E(a) + "</b></td><td style=\"padding:8px;border-bottom:1px solid #2A2531\">" + E(b) + "</td></tr>" for a, b in [
                ("Format", "Interactive romance stories with chapters, choices and multiple endings"), ("Characters", str(len(allc)) + " written characters across " + str(len(works)) + " stories, all fictional adults"),
                ("Chat", "Talk in your own words; AI replies stay inside each character's written personality"), ("Memory", "Your choices carry across chapters"),
                ("Languages", "English, Chinese, Japanese, Korean, Spanish — fully translated"), ("Price", "Free to start; optional diamonds"), ("Platforms", "Browser on phone and computer; Android app in testing"),
                ("Create", "Step-by-step story creator with a pre-publish check")]) + "</table>"
            + "<p class=\"muted\">This page only describes MIRU. For other apps, check their own sites for current features and pricing.</p>"
            + "<h2>Start here</h2><p><a href=\"/ai-boyfriend.html\">AI boyfriend stories</a> · <a href=\"/stories/\">All stories</a> · <a href=\"/what-is-miru.html\">What is MIRU?</a></p>" + faq_html(cmp_faq))
    W("compare.html", page("compare.html", "MIRU vs AI Chat Apps — A Romance-Story Alternative | MIRU", "How MIRU differs from general AI chat apps: written interactive romance stories with choices, memory and multiple endings. Free in the browser.", body, ld=[faq_ld(cmp_faq)]))
    # 作品页加内部链接（角色页、分类页）
    for w in works:
        fp = os.path.join(ROOT, "stories", w["slug"] + ".html")
        if not os.path.exists(fp):
            continue
        h = open(fp, encoding="utf-8").read()
        if "data-pseo" in h:
            continue
        links = ""
        if w["_cs"]:
            links += "<h2>Talk to the characters</h2><p>" + " · ".join('<a href="/characters/' + E(c["slug"]) + '.html">Chat with ' + E(c["n"]) + "</a>" for c in w["_cs"]) + "</p>"
        if w["_cats"]:
            links += "<p class=\"muted\">More like this: " + " · ".join('<a href="' + u + '">' + E(n) + "</a>" for n, u in w["_cats"][:8]) + "</p>"
        if links:
            h = h.replace("<h2>FAQ</h2>", '<div data-pseo="1">' + links + "</div><h2>FAQ</h2>", 1)
            open(fp, "w", encoding="utf-8").write(h)
    # 导航：所有静态页加分类入口
    nav_old = '<nav><a href="/stories/">Stories</a>'
    nav_new = '<nav><a href="/stories/">Stories</a><a href="/ai-boyfriend.html">AI Boyfriend</a><a href="/what-is-miru.html">What is MIRU</a>'
    for d in ("", "stories", "characters", "boyfriends", "romance"):
        base = os.path.join(ROOT, d)
        for f in os.listdir(base):
            if f.endswith(".html") and (d or f in ("about.html", "contact.html", "ai-boyfriend.html", "bl.html", "gl.html", "what-is-miru.html", "compare.html")):
                fp = os.path.join(base, f); h = open(fp, encoding="utf-8").read()
                if nav_old in h and nav_new not in h:
                    open(fp, "w", encoding="utf-8").write(h.replace(nav_old, nav_new, 1))
    # sitemap + llms
    urls = [("", "daily"), ("stories/", "daily"), ("ai-boyfriend.html", "daily"), ("what-is-miru.html", "weekly"), ("compare.html", "monthly"), ("about.html", "monthly"), ("contact.html", "monthly"), ("privacy.html", "monthly"), ("terms.html", "monthly"), ("llms.txt", "weekly")]
    urls += [(p, "weekly") for p in ("bl.html", "gl.html") if os.path.exists(os.path.join(ROOT, p))]
    urls += [(p, "weekly") for p, n, ws in cats] + [("stories/" + w["slug"] + ".html", "weekly") for w in works] + [("characters/" + c["slug"] + ".html", "weekly") for c in allc]
    W("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"<url><loc>{SITE}/{u}</loc><lastmod>{today}</lastmod><changefreq>{c}</changefreq></url>\n" for u, c in urls) + "</urlset>\n")
    extra = ["", "## Guides", "", "- [What is MIRU?](" + SITE + "/what-is-miru.html): what it is, how it works, price, platforms, languages, safety",
             "- [AI boyfriend stories](" + SITE + "/ai-boyfriend.html)", "- [MIRU compared with AI chat apps](" + SITE + "/compare.html)", "", "## Categories", ""]
    extra += ["- [" + n + "](" + SITE + "/" + p + "): " + ", ".join(tt(w) for w in ws[:6]) for p, n, ws in cats]
    extra += ["", "## Characters", ""] + ["- [" + c["n"] + "](" + SITE + "/characters/" + c["slug"] + ".html): " + (c.get("role") or "") + " — in " + tt(c["w"]) for c in allc]
    for name, full in (("llms.txt", False), ("llms-full.txt", True)):
        base = G.llms_txt(works, full=full)
        W(name, base.rstrip("\n") + "\n" + "\n".join(extra) + "\n")
    print("gen_pseo: %d characters, %d categories" % (len(allc), len(cats)))
    return 0

if __name__ == "__main__":
    sys.exit(main())
