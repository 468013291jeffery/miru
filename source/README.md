# MIRU 源码说明（协作者先看这里）

仓库根目录就是线上站点（Vercel 自动部署 `main` 分支）。

> 构建怎么跑、判据是什么 → 仓库根 `BUILD.md` · 什么该放本地什么该放线上 → `ARCHITECTURE.md` · 还耦合着什么 → `DECOUPLING.md`

| 位置 | 是什么 | 改了之后 |
|---|---|---|
| `source/src/*.js` | App 前端源码，按模块拆分（`app1_core.js` … `app94_official2.js`），顺序见 `source/build.py` 里的 `parts` | 跑 `python source/build.py`，生成仓库根的 `index.html` |
| `source/src/shell.html` | 页面外壳（head / CSS 入口） | 同上 |
| `source/content/` | 37 部内置剧本数据，`gen_content.py` 生成 `src/content_36.js` | 同上 |
| `api/*.js` | 后端（Vercel Serverless Functions）：登录、钱包、作品、TTS、翻译、管理后台接口 | 直接改，push 即部署 |
| `admin.html` | 管理后台页面（/admin.html） | 直接改，push 即部署 |
| `art/ audio/ video/` | 图片、音乐、视频素材；官方剧素材在 `art/official/<作品ID>/`，映射表 `art/official/<作品ID>.json` | 直接改 |
| `source/doubao-relay/worker.js` | 豆包实时语音中转（Cloudflare Worker `miru-doubao`），不在 Vercel 上 | 到 Cloudflare 控制台部署 |
| `source/conv/*.py` | 把编剧给的剧本转换成 MIRU 剧本格式的脚本（三部官方剧用过） | 本地运行 |

## 规则

- **不要提交任何密钥。** 所有 Key 只放在 Vercel / Cloudflare 的环境变量里（`ADMIN_KEY`、`AUTH_SECRET`、各家 AI Key、Brevo、`DOUBAO_*` 等）。仓库是公开的。
- **只改 `source/src`，不要直接改根目录的 `index.html`**——它是构建产物，下次构建会被覆盖。改完 `src` 记得运行 `build.sh` 并把新的 `index.html` 一起提交。
- 两个人同时改，建议各开分支、用 Pull Request 合并到 `main`；`main` 一合并就会上线。
- 官方剧剧本在数据库里，通过管理后台「剧本生产」编辑和上线，不在仓库里。

## 本地预览

```bash
python source/build.py        # Windows / macOS / Linux 都一样（详见仓库根 BUILD.md）
python -m http.server 8080    # 打开 http://localhost:8080/index.html（后端接口需要线上环境）
```

构建的判据是「产物与已提交的 blob 完全一致」：

```bash
git hash-object index.html && git rev-parse HEAD:index.html   # 两行必须相同
```
