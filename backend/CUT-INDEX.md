# 让 `index.html` 退出 git 跟踪（切换步骤）

> **为什么**：`index.html` 是 `source/build.py` 生成的**单文件产物**（9.85 MB）。
> 两边每次构建都会改它 ⇒ **每次合并都在它上面冲突**，而它占了冲突体量的九成。
>
> **谁能做**：Vercel 项目设置只有姜老师那边有权限。**这一步必须他动手**，下面是他需要的全部信息。

---

## ⚠️ 先看这条（2026-10-30 实测，原方案已作废）

**原写的「在 Vercel 里配 `buildCommand: python3 source/build.py`」—— 实测行不通。**

我在分支 `ann/vercel-build` 上试了（`vercel.json` 加 `buildCommand`），**preview 部署 failure**。原因：

```
source/build.py 要调 source/gen_content.py
              要读 source/content/out/（40 项）
              要读 source/src/*.js（151 个文件）
而 .vercelignore 里写着 `source/`  ⇒ Vercel 的构建上下文里根本没有这个目录
```

⇒ 想在 Vercel 里构建，必须**同时**改三处：`.vercelignore` 去掉 `source/`（**会让剧本源码公网可下载**）、
`build.py` 的输出路径、`vercel.json`。**代价大于收益，不建议。**

## ✅ 改用 GitHub Action（推荐）

**思路**：不用 Vercel 构建，改用 CI 构建。谁 push `source/**`，Action 自动跑 `build.py` 并把 `index.html` 提交回去。

**好处**：
- 两边都**不用手动**构建
- `source/` 不需要暴露给公网（`.vercelignore` 保持原样）
- Vercel 继续做纯静态发布，**零配置改动**
- 实测 `build.py` 本地只需 **0.6 秒**，Action 上毫无压力

### 你需要做的：新建一个文件

GitHub 网页 → 仓库根 → **Add file → Create new file** → 文件名填：

```
.github/workflows/build-index.yml
```

内容**整段复制**下面这个（也可从 `backend/build-index.yml` 复制）：

```yaml
name: build-index

on:
  push:
    branches: [main]
    paths:
      - 'source/**'
      - 'art/**'
      - 'audio/**'
  workflow_dispatch:

permissions:
  contents: write

concurrency:
  group: build-index
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: build
        run: |
          python3 --version
          python3 source/build.py
          ls -l index.html content_36.js

      - name: commit if changed
        run: |
          git config user.name  "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add index.html content_36.js
          if git diff --staged --quiet; then
            echo "no change"
            exit 0
          fi
          git commit -m "build: 重新生成 index.html + content_36.js（由 source/** 触发，自动）"
          for i in 1 2 3; do
            git pull --rebase --autostash origin main && git push && break
            echo "retry $i"; sleep 5
          done
```

> ⚠️ 我这边**推不了**这个文件 —— token 缺 `workflow` scope（`refusing to allow a Personal Access Token to create or update workflow`）。
> 所以必须你上传，或者给一个有 `workflow` 权限的 token。

### 生效后要验的三条

```bash
# ① Action 跑成功了没：GitHub → Actions 标签页，看 build-index 最新一次是绿的
# ② 线上还是好的
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" https://miru.plus/
#   期望 200 + 约 9.8 MB
# ③ 改一句台词，等一下，看 index.html 有没有被 Action 自动提交
```

### 然后（可选，收益最大的一步）

Action 稳定跑过几次之后，才把 `index.html` 移出 git —— 那时它已经由 Action 自动维护，冲突就消失了：

```bash
git rm --cached index.html
printf '\n# 由 GitHub Action 自动构建（见 backend/CUT-INDEX.md）\n' >> .gitignore
```

---

## 原方案（已作废，留档）

### 甲方案：让 Vercel 自己构建 —— ❌ 实测失败

见上面「先看这条」。`vercel.json` 加 `buildCommand` 会让 preview 构建失败，因为 `source/` 被 `.vercelignore` 排除。

### 乙方案（不改配置，靠约定）

`index.html` 继续跟着 git 走，但**约定只有 Ann 构建后提交**：
姜改完 `source/src/**` 后说一声，由 Ann 跑 `python source/build.py` + 提交。

零配置，代价是靠记性。**在 Action 落地之前，先按这个来。**

---

## 顺便：测试服也要对一下

`154.12.91.48` 是从**固定提交的源码归档**装的，`index.html` 就在包里。

⇒ 走甲之后，那边部署时要自己构建一次：

```bash
cd /opt/miru && python3 source/build.py      # 生成 index.html
cp index.html /var/www/miru/index.html       # 发布到静态目录
systemctl restart miru                        # 后端也重启一下（api 改动时）
```

⚠️ 注意 `/opt/miru` 里有 `source/build.py`，但**它是给前端打包用的**，需要 python3。
**这一句没在测试服上验过** —— 谁执行请顺手把输出贴回来，我补进这份文档。
