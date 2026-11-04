# MIRU 上架 Google Play（2026-11-05）

App 形式：**TWA 可信网页壳**。安卓 App 打开的就是线上的 https://www.miru.plus ——
网站一更新，App 里立刻是新版（自动更新）；只有改了 android/ 目录（图标、包名、权限）才需要重新出包上传。

- 包名：`com.miru.plus.app`
- 应用名：MIRU
- 充值：Google Play 结算（App 里点钻石包 → Google 付款 → 服务器验单发钻 → 消耗）。网页版不受影响。
- 成人作品：App 里不显示（Google Play 不允许露骨内容）。网页版照常。

## 一、服务器（OVH）要做的 4 件事 —— 交给管服务器的人

1. **部署**：拉 GitHub main 的最新代码（这次新增 `manifest.webmanifest`、`sw.js`、`icons/`、`.well-known/assetlinks.json`、`api/_play.js`，改了 `api/wallet.js`）。
2. **nginx 放行 `/.well-known/`**（现在返回 403）。例：
   ```nginx
   location ^~ /.well-known/ { root /网站根目录; default_type application/json; allow all; }
   ```
   验证：`curl -i https://www.miru.plus/.well-known/assetlinks.json` 要 200 且是 JSON。
   这个文件对不上，App 顶部会多出一条浏览器地址栏。
3. **环境变量**（API 进程，改完重启）：
   - `GOOGLE_SERVICE_ACCOUNT` = 服务账号 JSON 整段（或它的 base64）—— 见下面第三节第 5 步
   - `PLAY_PACKAGE=com.miru.plus.app`
4. `manifest.webmanifest` 的类型：`application/manifest+json`（nginx 不认识就加一行 `types { application/manifest+json webmanifest; }`）。

## 二、出包（GitHub Actions，不用装 Android Studio）

1. 仓库 Settings → Secrets and variables → Actions → New repository secret，加 4 个（值在单独发给你的 secrets.txt / .base64.txt 里，**不要传到仓库**）：
   `ANDROID_KEYSTORE_BASE64` · `ANDROID_KEYSTORE_PASSWORD` · `ANDROID_KEY_ALIAS` · `ANDROID_KEY_PASSWORD`
2. Actions → **Android App** → Run workflow。跑完（约 5 分钟）在运行页面底部下载 `miru-release-aab`，解压得到 `app-release.aab`。
3. 上传密钥 `miru-upload.jks` 和密码请自己另外保存好（丢了要找 Google 重置上传密钥）。

## 三、Play Console

1. 创建应用：名称 MIRU · 应用 · 免费（含应用内购买）· 默认语言 中文（简体）或 English。
2. **测试 → 内部测试** → 创建版本 → 上传 `app-release.aab`（第一次上传时选「由 Google 管理应用签名」）。
3. 上传后：**设置 → 应用完整性 → 应用签名**，复制「应用签名密钥证书」的 **SHA-256**，发给我 → 我加进 `.well-known/assetlinks.json`。
4. **创利 → 商品 → 应用内商品**（一次性 · 消耗型），ID 必须一字不差：
   | 商品 ID | 价格 | 钻石 |
   |---|---|---|
   | gems_5 | $0.99 | 5 |
   | gems_16 | $2.99 | 15 + 1 |
   | gems_28 | $4.99 | 25 + 3 |
   | gems_60 | $9.99 | 50 + 10 |
   | gems_125 | $19.99 | 100 + 25 |
   | gems_330 | $49.99 | 250 + 80 |
   | gems_700 | $99.99 | 500 + 200 |
5. **服务账号**：Google Cloud 里建一个服务账号 → 下载 JSON 密钥 → Play Console「用户和权限」邀请这个服务账号邮箱，给「查看财务数据、管理订单」权限 → JSON 交给管服务器的人填进 `GOOGLE_SERVICE_ACCOUNT`。
6. **商店信息**：图标 `icons/icon-512.png`；置顶大图 `icons/play-feature-1024x500.png`；手机截图 2–8 张（在手机上截）；简介文案见下。
7. **政策**：
   - 隐私政策网址：https://www.miru.plus/privacy.html
   - 内容分级问卷：如实填写 —— 有恋爱题材、无露骨性内容（App 已隐藏成人作品）、用户之间不能互相聊天、有 AI 生成内容。
   - 目标受众：18 岁以上。
   - 数据安全：收集邮箱（账号）、购买记录、应用内操作；传输加密；可申请删除账号。
   - **AI 生成内容**：App 内能举报（作品页「⚑ 举报这部作品」已有）。
8. 内部测试通过后：**正式版 → 创建版本 → 从内部测试提升 → 发送审核**。

## 商店文案（可直接用）

- 简短说明（80 字内）：和他们，演一场只属于你的故事。每个选择都会被记住。
- 完整说明：
  MIRU 是互动恋爱故事 App。你就是故事里的「你」：和角色对话、做选择，他们会记住你说过的话，剧情随你的选择走向不同结局。
  · 官方精品剧：豪门、悬疑、校园、奇幻……每部都有完整章节和多个结局
  · 自由对话：不想按选项走？直接打字，角色会接住你的每一句
  · 角色单聊：喜欢的角色可以单独聊天
  · 你的角色卡：名字、外貌、喜好由你决定
  钻石用于解锁章节和 AI 功能，可在 App 内用 Google Play 购买。
