#!/usr/bin/env python3
"""MIRU · 给搜索引擎和 AdSense 审核看的静态页面（2026-11-12）

miru.plus 本身是一个单页 App，爬虫打开只看到一大段脚本，AdSense 因此判「内容不足」。
这个脚本在 GitHub Action 里跑：从线上 /api/works 读官方剧（标题、简介、角色、章节、封面），
生成：
  stories/index.html          剧目总览
  stories/<slug>.html         每部剧一页（中文 + English）
  about.html / contact.html   关于、联系
  robots.txt / sitemap.xml
每页都带 AdSense 代码（自动广告），有正常的导航和页脚。
成人向（adult）作品不生成公开页面。拉取失败时什么都不改（exit 0），保留上一版页面。
"""
import html, json, os, re, sys, urllib.request, datetime

SITE = "https://miru.plus"
PUB = "ca-pub-1779576119248059"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {"User-Agent": "MIRU-seo-builder/1.0"}
E = lambda s: html.escape(str(s or ""), quote=True)


def get(path, timeout=25):
    req = urllib.request.Request(SITE + path, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def absu(u):
    if not u:
        return ""
    u = str(u)
    if u.startswith("http"):
        return u
    return SITE + "/" + u.lstrip("/")


CHAR_RE = re.compile(r"⟦CHAR\|([^|⟧]*)\|([mf]?)\|(\d*)\|[^|]*\|([^|⟧]*)\|?([^⟧]*)⟧")
CH_RE = re.compile(r"^#\s*CHAPTER\s*\d+\s*[｜|:：-]\s*(.+)$", re.I | re.M)


def chars(script):
    out, seen = [], set()
    for m in CHAR_RE.finditer(str(script or "")):
        n = m.group(1).strip()
        if not n or n in seen or n in ("你", "You"):
            continue
        seen.add(n)
        out.append({"n": n, "g": m.group(2), "age": m.group(3), "role": m.group(4).strip(), "look": m.group(5).strip()})
    return out[:8]


def chapters(script):
    return [c.strip() for c in CH_RE.findall(str(script or ""))][:40]


def slugify(s, fallback):
    s = re.sub(r"[^a-z0-9]+", "-", str(s or "").lower()).strip("-")
    return s[:60] or fallback


def live_list():
    """所有在线作品：featured + new 翻页（每页 50）。"""
    seen, out = set(), []
    for x in (get("/api/works?limit=50&feed=featured&alllang=1").get("works") or []):
        if x.get("id") not in seen:
            seen.add(x.get("id")); out.append(x)
    before = ""
    for _ in range(10):
        page_ = get("/api/works?limit=50&feed=new&alllang=1" + ("&before=" + before if before else "")).get("works") or []
        for x in page_:
            if x.get("id") not in seen:
                seen.add(x.get("id")); out.append(x)
        if len(page_) < 50:
            break
        try:
            before = str(int(datetime.datetime.fromisoformat(str(page_[-1].get("created_at")).replace("Z", "+00:00")).timestamp() * 1000))
        except Exception:
            break
    return out


def collect():
    lst = live_list()
    works = []
    for x in lst:
        wid = x.get("id")
        try:
            d = get("/api/works?id=" + wid)
        except Exception as e:
            print("skip", wid, e, file=sys.stderr)
            continue
        W = d.get("work", d)
        pk = W.get("pack") or {}
        if not pk:
            continue
        m = pk.get("meta") or {}
        if W.get("adult") or m.get("adult"):
            continue
        en = m.get("en") or {}
        try:
            art = get("/art/official/" + wid + ".json", 15)
        except Exception:
            art = {}
        ci = {k[5:]: absu(v) for k, v in art.items() if k.startswith("char_")}
        works.append({
            "id": wid,
            "slug": slugify(en.get("title"), wid),
            "title": m.get("title") or W.get("title"),
            "hook": m.get("hook") or W.get("hook"),
            "premise": m.get("premise") or "",
            "you": m.get("you") or "",
            "tags": [t for t in (m.get("tags") or W.get("tags") or []) if not re.search(r"[攻受]$", t)],
            "en": en,
            "chars": chars(pk.get("script")),
            "chars_en": chars(pk.get("script_en")),
            "ch": chapters(pk.get("script")),
            "ch_en": chapters(pk.get("script_en")),
            "cover": absu(art.get("cover") or art.get("poster")),
            "ci": ci,
            "date": str(x.get("created_at") or "")[:10],
            "langs": m.get("langs") or ["zh", "en"],
        })
    # slug 去重
    seen = {}
    for w in works:
        if w["slug"] in seen:
            w["slug"] = w["slug"] + "-" + w["id"][-6:]
        seen[w["slug"]] = 1
    return works


CSS = """
:root{color-scheme:dark;--bg:#0C0B10;--panel:#16141C;--line:#2A2531;--text:#F1ECF3;--dim:#AAA1B0;--gold:#F0B77E;--rose:#EE6F97}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:16px/1.75 -apple-system,BlinkMacSystemFont,"PingFang SC","Hiragino Sans","Segoe UI",sans-serif}
a{color:var(--gold)}header{border-bottom:1px solid var(--line);background:#0C0B10f2;position:sticky;top:0;z-index:5}
.bar,main,footer .in{max-width:860px;margin:0 auto;padding-left:max(18px,env(safe-area-inset-left));padding-right:max(18px,env(safe-area-inset-right))}
.bar{display:flex;align-items:center;gap:16px;min-height:56px;flex-wrap:wrap}.bar .logo{font-weight:800;letter-spacing:.12em;color:var(--text);text-decoration:none;font-size:18px}
.bar nav{display:flex;gap:14px;flex-wrap:wrap;font-size:14px}.bar nav a{color:var(--dim);text-decoration:none}.bar nav a:hover{color:var(--text)}
.cta{margin-left:auto;background:linear-gradient(135deg,#F0B77E,#EE6F97);color:#1a0f08;text-decoration:none;font-weight:700;border-radius:999px;padding:7px 16px;font-size:14px}
main{padding-block:28px 60px}h1{font-size:28px;line-height:1.3;margin:0 0 8px}h2{font-size:20px;margin:36px 0 10px;color:#F6D3AE}h3{font-size:16px;margin:0}
.hook{font-size:18px;color:#F6D3AE;margin:0 0 18px}.muted{color:var(--dim);font-size:14px}
.cover{width:100%;max-height:440px;object-fit:cover;border-radius:16px;border:1px solid var(--line);background:var(--panel)}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0}.tags span{border:1px solid var(--line);border-radius:999px;padding:2px 10px;font-size:13px;color:var(--dim)}
.cast{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}.cast div{display:flex;gap:12px;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px}
.cast img{width:64px;height:64px;border-radius:12px;object-fit:cover;flex:none}.cast p{margin:4px 0 0;font-size:14px;color:var(--dim);line-height:1.55}
ol.ch{padding-left:22px;columns:2;column-gap:28px}ol.ch li{break-inside:avoid;font-size:15px}@media(max-width:560px){ol.ch{columns:1}}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:16px}.card{background:var(--panel);border:1px solid var(--line);border-radius:16px;overflow:hidden;text-decoration:none;color:var(--text);display:flex;flex-direction:column}
.card img{width:100%;aspect-ratio:3/4;object-fit:cover;background:#1d1a25}.card .t{padding:12px 14px 16px}.card b{display:block;font-size:17px}.card small{display:block;color:var(--dim);font-size:13.5px;line-height:1.55;margin-top:6px}
.en{border-top:1px solid var(--line);margin-top:44px;padding-top:8px}footer{border-top:1px solid var(--line);color:var(--dim);font-size:14px}footer .in{padding-block:22px;display:flex;gap:16px;flex-wrap:wrap}footer a{color:var(--dim)}
"""


def jsonld(obj):
    return '<script type="application/ld+json">' + json.dumps(obj, ensure_ascii=False).replace("</", "<\\/") + "</script>"


ORG = {"@type": "Organization", "name": "MIRU", "url": SITE + "/", "logo": SITE + "/icons/icon-512.png"}


def page(path, title, desc, body, lang="en", og_img="", ld=None):
    canon = SITE + "/" + path.lstrip("/")
    lds = "".join(jsonld(x) for x in (ld or []))
    return f"""<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{E(title)}</title><meta name="description" content="{E(desc)[:300]}">
<link rel="canonical" href="{canon}"><meta property="og:site_name" content="MIRU"><meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(desc)[:300]}"><meta property="og:url" content="{canon}"><meta property="og:type" content="website">{('<meta property="og:image" content="' + E(og_img) + '">') if og_img else ''}
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{E(title)}"><meta name="twitter:description" content="{E(desc)[:200]}">{('<meta name="twitter:image" content="' + E(og_img) + '">') if og_img else ''}
<meta name="google-adsense-account" content="{PUB}">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={PUB}" crossorigin="anonymous"></script>
<link rel="icon" href="/icons/icon-192.png"><style>{CSS}</style>{lds}</head><body>
<header><div class="bar"><a class="logo" href="/stories/">MIRU</a><nav><a href="/stories/">Stories</a><a href="/about.html">About</a><a href="/contact.html">Contact</a></nav><a class="cta" href="/">Play free</a></div></header>
<main>{body}</main>
<footer><div class="in"><span>© 2026 MIRU</span><a href="/stories/">Stories</a><a href="/about.html">About</a><a href="/contact.html">Contact</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a><a href="/llms.txt">llms.txt</a></div></footer>
</body></html>
"""


def portrait(w, name, i):
    ci = w["ci"]
    return ci.get(name) or ci.get("c%02d" % (i + 1)) or ""


def cast_html(w, cs, zh_names=None):
    if not cs:
        return ""
    out = []
    for i, c in enumerate(cs):
        key = (zh_names[i] if zh_names and i < len(zh_names) else c["n"])
        img = portrait(w, key, i) or portrait(w, c["n"], i)
        meta = " · ".join(x for x in [c["role"], (c["age"] + ("岁" if not w.get("_en") else "")) if c["age"] else ""] if x)
        out.append(f'<div>{("<img src=\"" + E(img) + "\" alt=\"" + E(c["n"]) + "\" loading=\"lazy\">") if img else ""}<span><h3>{E(c["n"])}</h3><p>{E(meta)}</p>{("<p>" + E(c["look"]) + "</p>") if c["look"] and c["look"] != c["role"] else ""}</span></div>')
    return '<div class="cast">' + "".join(out) + "</div>"


def paras(t):
    return "".join("<p>" + E(p) + "</p>" for p in re.split(r"\n+", str(t or "").strip()) if p.strip())


LANG_NAMES = {"en": "English", "zh": "Chinese", "ja": "Japanese", "ko": "Korean", "es": "Spanish"}


def story_page(w):
    en = w["en"] or {}
    t_en = en.get("title") or w["title"]
    hook_en = en.get("hook") or ""
    url = SITE + "/stories/" + w["slug"] + ".html"
    cast_en = w["chars_en"] or []
    zh_names = [c["n"] for c in w["chars"]]
    langs = [LANG_NAMES.get(x, x) for x in w.get("langs") or ["en"]]
    faq = [
        ("What is " + t_en + "?", (hook_en + " " if hook_en else "") + t_en + " is an interactive romance story on MIRU: you play as yourself, talk with the characters and make choices in every chapter that change relationships, the plot and the ending."),
        ("How do I play " + t_en + "?", "Open MIRU at miru.plus in any browser on your phone or computer, pick " + t_en + " and start the first chapter. No download is needed."),
        ("Is " + t_en + " free?", "Yes. You can start the story for free; some extra choices and scenes use in-app diamonds, which you can also earn by playing."),
        ("Which languages is " + t_en + " available in?", ", ".join(langs) + "."),
    ]
    if cast_en:
        faq.append(("Who are the main characters in " + t_en + "?", "; ".join(c["n"] + (" — " + c["role"] if c["role"] else "") for c in cast_en[:6]) + "."))
    ld = [
        {"@context": "https://schema.org", "@type": "CreativeWork", "name": t_en, "alternateName": w["title"] if w["title"] != t_en else None,
         "headline": hook_en or w["hook"], "description": re.sub(r"\s+", " ", en.get("premise") or w["premise"] or "")[:500],
         "genre": w["tags"][:10], "inLanguage": w.get("langs") or ["en"], "image": w["cover"] or None, "url": url,
         "author": ORG, "publisher": ORG, "datePublished": w["date"] or None, "isAccessibleForFree": True,
         "character": [{"@type": "Person", "name": c["n"], "description": c["role"]} for c in cast_en[:8]] or None,
         "potentialAction": {"@type": "ReadAction", "target": SITE + "/"}},
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Stories", "item": SITE + "/stories/"},
            {"@type": "ListItem", "position": 2, "name": t_en, "item": url}]},
        {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]},
    ]
    for o in ld:
        for k in [k for k, v in o.items() if v is None]:
            del o[k]
    w2 = dict(w, _en=1)
    body = f"""<p class="muted"><a href="/stories/">Stories</a> / {E(t_en)}</p>
<h1>{E(t_en)}{(' <span class="muted" style="font-size:18px;font-weight:500" lang="zh">' + E(w['title']) + '</span>') if w['title'] != t_en else ''}</h1>
<p class="hook">{E(hook_en or w['hook'])}</p>
{('<img class="cover" src="' + E(w['cover']) + '" alt="' + E(t_en) + ' cover art">') if w['cover'] else ''}
<div class="tags">{''.join('<span>' + E(t) + '</span>' for t in w['tags'][:10])}</div>
<h2>Story</h2>{paras(en.get('premise') or w['premise'])}
{('<h2>Your role</h2><p>' + E(en.get('you')) + '</p>') if en.get('you') else ''}
{('<h2>Main characters</h2>' + cast_html(w2, cast_en, zh_names)) if cast_en else ''}
{('<h2>Chapters (' + str(len(w['ch_en'])) + ')</h2><ol class="ch">' + ''.join('<li>' + E(c) + '</li>' for c in w['ch_en']) + '</ol>') if w['ch_en'] else ''}
<h2>How to play</h2><p>{E(t_en)} is an interactive story on MIRU. You play as yourself, talk with the characters and make a choice in every chapter — different choices change relationships, the plot and the ending. All characters are fictional adults. Available in {E(', '.join(langs))}.</p>
<p><a class="cta" href="/" style="display:inline-block">Play {E(t_en)} free on MIRU</a></p>
<h2>FAQ</h2>{''.join('<h3>' + E(q) + '</h3><p>' + E(a) + '</p>' for q, a in faq)}"""
    if w["title"] and w["premise"]:
        body += f"""<section class="en" lang="zh"><h2>{E(w['title'])}（中文）</h2><p class="hook">{E(w['hook'])}</p>{paras(w['premise'])}
{('<p><b>你在故事里的身份：</b>' + E(w['you']) + '</p>') if w['you'] else ''}
{('<h2>主要角色</h2>' + cast_html(w, w['chars'])) if w['chars'] else ''}
<p>《{E(w['title'])}》是 MIRU 上的一部互动剧：你用自己的名字进入故事，和角色对话，在每一章做出选择。所有角色都是虚构的成年人。</p></section>"""
    desc = (hook_en or w["hook"] or "") + " " + re.sub(r"\s+", " ", en.get("premise") or w["premise"] or "")[:200]
    return page("stories/" + w["slug"] + ".html", t_en + " — Interactive Romance Story | MIRU", desc, body, og_img=w["cover"], ld=ld)


def index_page(works):
    def tt(w):
        return (w["en"] or {}).get("title") or w["title"]
    cards = "".join(f'<a class="card" href="/stories/{E(w["slug"])}.html">{("<img src=\"" + E(w["cover"]) + "\" alt=\"" + E(tt(w)) + "\" loading=\"lazy\">") if w["cover"] else ""}<span class="t"><b>{E(tt(w))}</b>{("<span class=\"muted\" lang=\"zh\">" + E(w["title"]) + "</span>") if w["title"] != tt(w) else ""}<small>{E((w["en"] or {}).get("hook") or w["hook"])}</small></span></a>' for w in works)
    ld = [{"@context": "https://schema.org", "@type": "ItemList", "name": "MIRU interactive stories", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "url": SITE + "/stories/" + w["slug"] + ".html", "name": tt(w)} for i, w in enumerate(works)]},
        dict({"@context": "https://schema.org"}, **ORG)]
    body = f"""<h1>MIRU Interactive Stories</h1>
<p class="hook">Interactive romance stories where you are the main character: talk to the characters, make choices and reach your own ending.</p>
<p>Browse every MIRU original story — read the premise, meet the characters and see the chapters before you play. Genres include fantasy romance, mystery and twists, survival, royals and billionaires, vampires and werewolves. Every story has multiple endings, and what you say and choose changes the story. Play free in your browser on phone or computer at miru.plus.</p>
<p class="muted" lang="zh">MIRU 原创互动剧：你来做主角，和角色对话，做出选择，走向属于你的结局。</p>
<div class="grid" style="margin-top:22px">{cards}</div>"""
    return page("stories/", "MIRU Interactive Stories — Romance, Fantasy & Mystery You Play", "Interactive romance stories you play as yourself: fantasy, mystery, royals, vampires and more. Talk to the characters, make choices, change the ending. Free on miru.plus.", body, ld=ld)


def llms_txt(works, full=False):
    def tt(w):
        return (w["en"] or {}).get("title") or w["title"]
    lines = ["# MIRU", "",
             "> MIRU (https://miru.plus) is an interactive romance-story and AI character chat app. Readers play as themselves, talk with the characters and make choices in every chapter that change relationships, the plot and the ending. Stories are written by the MIRU team; characters' live replies are generated by AI within each story's written personalities and safety rules. All characters are fictional adults. Free to start, in the browser on phone or computer; available in English, Chinese, Japanese, Korean and Spanish.", "",
             "## Key pages", "",
             "- [Home / play](" + SITE + "/): the app itself",
             "- [All stories](" + SITE + "/stories/): catalog with premise, characters and chapters for every story",
             "- [About](" + SITE + "/about.html)", "- [Contact](" + SITE + "/contact.html)",
             "- [Privacy](" + SITE + "/privacy.html)", "- [Terms](" + SITE + "/terms.html)", "",
             "## Stories", ""]
    for w in works:
        en = w["en"] or {}
        lines.append("- [" + tt(w) + "](" + SITE + "/stories/" + w["slug"] + ".html): " + re.sub(r"\s+", " ", en.get("hook") or w["hook"] or "").strip())
        if full:
            pr = re.sub(r"\s+", " ", en.get("premise") or "").strip()
            if pr:
                lines.append("  - Premise: " + pr[:900])
            if w["chars_en"]:
                lines.append("  - Characters: " + "; ".join(c["n"] + (" (" + c["role"] + ")" if c["role"] else "") for c in w["chars_en"][:8]))
            if w["tags"]:
                lines.append("  - Tags: " + ", ".join(w["tags"][:10]))
    lines += ["", "## FAQ", "",
              "- Is MIRU free? Yes, every story can be started for free; optional extra scenes use diamonds that can also be earned by playing.",
              "- Do I need to download an app? No. MIRU runs in any modern browser at https://miru.plus on phones and computers.",
              "- Is the content explicit? No sexually explicit content; all characters are fictional adults (17+ audience)."]
    return "\n".join(lines) + "\n"


ABOUT = """<h1>About MIRU</h1>
<p>MIRU is an interactive drama and AI character chat app. Every story is written by our team — world, characters, chapters and multiple endings — and you play as yourself: talk to the characters and make choices that change relationships, the plot and the ending. Characters' live replies are generated by AI within each story's written personalities and safety rules. All characters are fictional adults. No sexually explicit content; zero tolerance for harassment, hate or illegal content.</p>
<section class="en" lang="zh"><h1>关于 MIRU</h1>
<p class="hook">MIRU 是一款互动剧与 AI 角色对话应用。在这里，你不是看故事的人，而是故事的主角。</p>
<h2>我们在做什么</h2>
<p>每部 MIRU 互动剧都由编剧团队完成世界观、人物、分章剧情和多个结局。进入故事后，你可以用自己的名字和形象参与，和剧中角色对话；每一章结尾的选择、以及你在对话里说的话，都会影响人物关系和剧情走向。</p>
<p>角色的即时回复由人工智能生成，但它们必须遵守剧本里写好的人物性格、世界规则和安全规范。所有角色都是虚构的成年人。</p>
<h2>内容原则</h2>
<ul><li>尊重玩家的选择：没有人能替你决定爱谁、原谅谁，亲密接触一定以你的同意为前提。</li>
<li>不提供露骨色情内容，不涉及未成年人。</li>
<li>对骚扰、仇恨、违法内容零容忍，作品和 AI 回复都可以举报，24 小时内处理。</li></ul>
<h2>谁在使用 MIRU</h2>
<p>喜欢言情小说、互动游戏和角色扮演的成年读者（17 岁以上）。MIRU 支持中文、English、日本語、한국어 和 Español。</p>
<p><a href="/stories/">浏览全部剧目 →</a></p>
</section>"""

CONTACT = """<h1>联系我们</h1>
<p>有问题、建议、合作或版权事宜，欢迎联系 MIRU 团队。</p>
<h2>电子邮件</h2><p><b>468013291jeffery@gmail.com</b></p><p class="muted">我们一般在 24 小时内回复。</p>
<h2>在 App 内反馈</h2><p>打开 MIRU →「我的」→「安全与举报」→「联系我们」，也可以在作品页、聊天菜单（⋯）里直接举报作品或 AI 回复。</p>
<h2>账号与数据</h2><p>如需访问、更正或删除你的账号数据，请参阅 <a href="/privacy.html">隐私说明</a>，或在 App 的账号页面注销账号。</p>
<section class="en" lang="en"><h2>Contact</h2><p>Email: <b>468013291jeffery@gmail.com</b> — we usually reply within 24 hours. In the app: Me → Safety &amp; reporting → Contact us. See our <a href="/privacy.html">privacy notice</a> for account and data requests.</p></section>"""


def main():
    try:
        works = collect()
    except Exception as e:
        print("gen_seo: fetch failed, keeping previous pages:", e, file=sys.stderr)
        return 0
    if len(works) < 3:
        print("gen_seo: too few works (%d), keeping previous pages" % len(works), file=sys.stderr)
        return 0
    os.makedirs(os.path.join(ROOT, "stories"), exist_ok=True)
    W = lambda rel, s: open(os.path.join(ROOT, rel), "w", encoding="utf-8").write(s)
    keep = set()
    for w in works:
        W("stories/" + w["slug"] + ".html", story_page(w)); keep.add(w["slug"] + ".html")
    for f in os.listdir(os.path.join(ROOT, "stories")):
        if f.endswith(".html") and f != "index.html" and f not in keep:
            os.remove(os.path.join(ROOT, "stories", f))
    W("stories/index.html", index_page(works))
    W("about.html", page("about.html", "About MIRU — Interactive Romance Stories", "MIRU 是一款互动剧与 AI 角色对话应用：你来做主角，每个选择都会改变故事。", ABOUT))
    W("contact.html", page("contact.html", "Contact MIRU", "联系 MIRU 团队：电子邮件、App 内反馈、账号与数据请求。", CONTACT))
    today = datetime.date.today().isoformat()
    urls = [("", "daily"), ("stories/", "daily"), ("about.html", "monthly"), ("contact.html", "monthly"), ("privacy.html", "monthly"), ("terms.html", "monthly"), ("llms.txt", "weekly")] + [("stories/" + w["slug"] + ".html", "weekly") for w in works]
    W("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"<url><loc>{SITE}/{u}</loc><lastmod>{today}</lastmod><changefreq>{c}</changefreq></url>\n" for u, c in urls) + "</urlset>\n")
    W("llms.txt", llms_txt(works))
    W("llms-full.txt", llms_txt(works, full=True))
    bots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot"]
    W("robots.txt", "User-agent: *\nAllow: /\nDisallow: /admin.html\nDisallow: /probe\nDisallow: /api/\n\n" + "".join("User-agent: " + b + "\nAllow: /\nDisallow: /admin.html\nDisallow: /api/\n\n" for b in bots) + "User-agent: Mediapartners-Google\nAllow: /\n\nSitemap: " + SITE + "/sitemap.xml\n")
    print("gen_seo: %d story pages" % len(works))
    return 0


if __name__ == "__main__":
    sys.exit(main())
