# 让 `index.html` 退出 git 跟踪（切换步骤）

> **为什么**：`index.html` 是 `source/build.py` 生成的**单文件产物**（9.85 MB）。
> 两边每次构建都会改它 ⇒ **每次合并都在它上面冲突**，而它占了冲突体量的九成。
>
> **谁能做**：Vercel 项目设置只有姜老师那边有权限。**这一步必须他动手**，下面是他需要的全部信息。

---

## ⚠️ 先看这条

**半途改会直接让线上挂。** 因为 `miru.plus` 现在发布的就是 git 里的 `index.html`。
必须**先让 Vercel 会自己构建**，**再**把 `index.html` 从 git 里移除。顺序反了 = 站点 404。

---

## 甲方案（推荐）：让 Vercel 自己构建

### 第 1 步 · 在 Vercel 项目里加构建配置

Vercel 后台 → 项目 `miru` → **Settings → Build & Development Settings**：

| 项 | 填什么 |
|---|---|
| Framework Preset | **Other** |
| **Build Command** | `python source/build.py` |
| **Output Directory** | `.`（点号，表示仓库根） |
| Install Command | 留空（这个项目没有 node 依赖要装） |

> 如果 Vercel 的构建镜像里没有 `python`，把 Build Command 改成 `python3 source/build.py`。
> 有没有 python 看构建日志第一段（`Build image` 那行会列可用运行时）。

### 第 2 步 · 在**预览部署**上验一次（不要直接上 Production）

推一个无关紧要的提交（比如改个 README），看 Vercel 会不会自动构建出 `index.html`。

**判据（缺一条都不算过）**：

```bash
# 预览部署的域名
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" https://<预览域名>/
# 期望：200，且大小接近 9.8 MB（不是几百字节的目录列表）

curl -s -o /dev/null -w "%{http_code}\n" https://<预览域名>/api/works
# 期望：200

curl -s -o /dev/null -w "%{http_code}\n" https://<预览域名>/admin.html
# 期望：200
```

### 第 3 步 · 验过了，才把 `index.html` 移出 git

```bash
cd /path/to/miru
git rm --cached index.html          # 只从 git 移除，本地文件保留
printf '\n# 构建产物，由 Vercel 自动生成（见 backend/CUT-INDEX.md）\nindex.html\n' >> .gitignore
git add .gitignore
git commit -m "index.html 退出 git 跟踪：改由 Vercel 构建（build.py），避免每次合并冲突"
```

> `git rm --cached` 而不是 `git rm` —— **本地那份要留着**，本机构建和 `tools/serve.mjs` 还要用它。

### 第 4 步 · 上线后立刻验（3 条）

```bash
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" https://miru.plus/
curl -s -o /dev/null -w "%{http_code}\n" https://miru.plus/api/works
curl -s -o /dev/null -w "%{http_code}\n" https://miru.plus/admin.html
```

期望：`200` + 约 9.8 MB、`200`、`200`。**任何一条不对，立刻回滚**（见下）。

---

## 回滚（30 秒）

出问题就把 `index.html` 放回 git：

```bash
git add -f index.html
git commit -m "rollback: index.html 回到 git 跟踪"
```

（`.gitignore` 里那行留着不影响 —— `-f` 会强制加。）

---

## 乙方案（不改配置，靠约定）

`index.html` 继续跟着 git 走，但**约定只有 Ann 构建后提交**：
姜改完 `source/src/**` 后说一声，由 Ann 跑 `python source/build.py` + 提交。

零配置，代价是靠记性。**先跑一段时间看冲突还会不会发生，再决定要不要走甲。**

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
