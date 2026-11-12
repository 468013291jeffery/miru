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


def collect():
    lst = get("/api/works?limit=50&feed=featured").get("works") or []
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


def page(path, title, desc, body, lang="zh-CN", og_img=""):
    canon = SITE + "/" + path.lstrip("/")
    return f"""<!doctype html>
<html lang="{lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{E(title)}</title><meta name="description" content="{E(desc)[:300]}">
<link rel="canonical" href="{canon}"><meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(desc)[:300]}"><meta property="og:url" content="{canon}"><meta property="og:type" content="website">{('<meta property="og:image" content="' + E(og_img) + '">') if og_img else ''}
<meta name="google-adsense-account" content="{PUB}">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={PUB}" crossorigin="anonymous"></script>
<link rel="icon" href="/icons/icon-192.png"><style>{CSS}</style></head><body>
<header><div class="bar"><a class="logo" href="/stories/">MIRU</a><nav><a href="/stories/">剧目 Stories</a><a href="/about.html">关于 About</a><a href="/contact.html">联系 Contact</a></nav><a class="cta" href="/">打开 App</a></div></header>
<main>{body}</main>
<footer><div class="in"><span>© 2026 MIRU</span><a href="/stories/">剧目</a><a href="/about.html">关于我们</a><a href="/contact.html">联系我们</a><a href="/privacy.html">隐私说明</a><a href="/terms.html">用户协议</a></div></footer>
</body></html>
"""


def portrait(w, name, i):
    ci = w["ci"]
    return ci.get(name) or ci.get("c%02d" % (i + 1)) or ""


def cast_html(w, cs):
    if not cs:
        return ""
    out = []
    for i, c in enumerate(cs):
        img = portrait(w, c["n"], i)
        meta = " · ".join(x for x in [c["role"], (c["age"] + ("岁" if not w.get("_en") else "")) if c["age"] else ""] if x)
        out.append(f'<div>{("<img src=\"" + E(img) + "\" alt=\"" + E(c["n"]) + "\" loading=\"lazy\">") if img else ""}<span><h3>{E(c["n"])}</h3><p>{E(meta)}</p>{("<p>" + E(c["look"]) + "</p>") if c["look"] and c["look"] != c["role"] else ""}</span></div>')
    return '<div class="cast">' + "".join(out) + "</div>"


def paras(t):
    return "".join("<p>" + E(p) + "</p>" for p in re.split(r"\n+", str(t or "").strip()) if p.strip())


def story_page(w):
    en = w["en"] or {}
    body = f"""<p class="muted"><a href="/stories/">剧目</a> / {E(w['title'])}</p>
<h1>{E(w['title'])}{(' <span class="muted" style="font-size:18px;font-weight:500">' + E(en.get('title')) + '</span>') if en.get('title') else ''}</h1>
<p class="hook">{E(w['hook'])}</p>
{('<img class="cover" src="' + E(w['cover']) + '" alt="' + E(w['title']) + ' 封面">') if w['cover'] else ''}
<div class="tags">{''.join('<span>' + E(t) + '</span>' for t in w['tags'][:10])}</div>
<h2>故事简介</h2>{paras(w['premise'])}
{('<h2>你在故事里的身份</h2><p>' + E(w['you']) + '</p>') if w['you'] else ''}
{('<h2>主要角色</h2>' + cast_html(w, w['chars'])) if w['chars'] else ''}
{('<h2>章节（共 ' + str(len(w['ch'])) + ' 章）</h2><ol class="ch">' + ''.join('<li>' + E(c) + '</li>' for c in w['ch']) + '</ol>') if w['ch'] else ''}
<h2>怎么玩</h2><p>《{E(w['title'])}》是 MIRU 上的一部互动剧：你用自己的名字进入故事，和角色对话，在每一章做出选择。不同的选择会改变人物关系、剧情走向和最终结局。所有角色都是虚构的成年人。</p>
<p><a class="cta" href="/" style="display:inline-block">在 MIRU 里开始这部剧</a></p>"""
    if en.get("title"):
        w2 = dict(w, _en=1)
        body += f"""<section class="en" lang="en"><h2>{E(en.get('title'))}</h2><p class="hook">{E(en.get('hook'))}</p>{paras(en.get('premise'))}
{('<p><b>Your role:</b> ' + E(en.get('you')) + '</p>') if en.get('you') else ''}
{('<h2>Main characters</h2>' + cast_html(w2, w['chars_en'])) if w['chars_en'] else ''}
{('<h2>Chapters</h2><ol class="ch">' + ''.join('<li>' + E(c) + '</li>' for c in w['ch_en']) + '</ol>') if w['ch_en'] else ''}
<p>An interactive story on MIRU: you play as yourself, talk with the characters and make choices in every chapter that change relationships, the plot and the ending. All characters are fictional adults.</p></section>"""
    desc = (w["hook"] or "") + " " + re.sub(r"\s+", " ", w["premise"])[:180]
    return page("stories/" + w["slug"] + ".html", f"{w['title']}" + (f" · {en.get('title')}" if en.get("title") else "") + " | MIRU 互动剧", desc, body, og_img=w["cover"])


def index_page(works):
    cards = "".join(f'<a class="card" href="/stories/{E(w["slug"])}.html">{("<img src=\"" + E(w["cover"]) + "\" alt=\"" + E(w["title"]) + "\" loading=\"lazy\">") if w["cover"] else ""}<span class="t"><b>{E(w["title"])}</b>{("<span class=\"muted\">" + E(w["en"].get("title")) + "</span>") if (w["en"] or {}).get("title") else ""}<small>{E(w["hook"])}</small></span></a>' for w in works)
    body = f"""<h1>MIRU 互动剧目</h1>
<p class="hook">你来做主角的互动故事：和角色对话，做出选择，走向属于你的结局。</p>
<p>这里是 MIRU 官方原创互动剧的介绍页。每部剧都有完整的故事简介、主要角色和章节列表。题材包括奇幻言情、悬疑反转、末日求生、王室与豪门等，每一部都有多个结局，你说的话和做的选择都会改变故事。</p>
<p class="muted">MIRU original interactive stories — read the premise, meet the characters and see every chapter before you play.</p>
<div class="grid" style="margin-top:22px">{cards}</div>"""
    return page("stories/", "MIRU 互动剧目 · Interactive Stories", "MIRU 官方原创互动剧：奇幻言情、悬疑、末日求生、王室豪门。你来做主角，每个选择都会改变结局。", body)


ABOUT = """<h1>关于 MIRU</h1>
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
<section class="en" lang="en"><h2>About MIRU</h2>
<p>MIRU is an interactive drama and AI character chat app. Every story is written by our team — world, characters, chapters and multiple endings — and you play as yourself: talk to the characters and make choices that change relationships, the plot and the ending. Characters' live replies are generated by AI within each story's written personalities and safety rules. All characters are fictional adults. No sexually explicit content; zero tolerance for harassment, hate or illegal content.</p></section>"""

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
    W("about.html", page("about.html", "关于 MIRU · About", "MIRU 是一款互动剧与 AI 角色对话应用：你来做主角，每个选择都会改变故事。", ABOUT))
    W("contact.html", page("contact.html", "联系我们 · Contact | MIRU", "联系 MIRU 团队：电子邮件、App 内反馈、账号与数据请求。", CONTACT))
    today = datetime.date.today().isoformat()
    urls = [("", "daily"), ("stories/", "daily"), ("about.html", "monthly"), ("contact.html", "monthly"), ("privacy.html", "monthly"), ("terms.html", "monthly")] + [("stories/" + w["slug"] + ".html", "weekly") for w in works]
    W("sitemap.xml", '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(f"<url><loc>{SITE}/{u}</loc><lastmod>{today}</lastmod><changefreq>{c}</changefreq></url>\n" for u, c in urls) + "</urlset>\n")
    W("robots.txt", "User-agent: *\nAllow: /\nDisallow: /admin.html\nDisallow: /probe\n\nUser-agent: Mediapartners-Google\nAllow: /\n\nSitemap: " + SITE + "/sitemap.xml\n")
    print("gen_seo: %d story pages" % len(works))
    return 0


if __name__ == "__main__":
    sys.exit(main())
