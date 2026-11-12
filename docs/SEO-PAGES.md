# 部署说明（2026-11-12）

服务器上的 /tmp/d.sh 已把 about.html、contact.html、robots.txt、sitemap.xml 和 stories/ 加进 public 目录清单。
这些页面由 source/gen_seo.py 在 GitHub Action 里每天生成（AdSense 审核用的静态内容页）。
