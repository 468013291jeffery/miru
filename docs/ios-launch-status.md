# MIRU iOS 首发状态
更新时间：2026-11-14。分支 codex/ios-app-store。海外首发，无广告，保留剧情、社区和 AI。Build 4 和最终候选 Build 5 已通过 Xcode 上传到 App Store Connect；尚未提交审核。

## 已完成
- 真实 iPhone：用户确认邮箱、Apple、Google 登录成功，剧本 AI 收到完整回复，关闭后台重开后登录、剧情进度和对话保留。Google 授权后约 3–10 秒进入首页；继续延期性能优化。
- Apple 专用 Sign in with Apple Key 已经持有人当次确认创建并安全部署；服务端令牌加密密钥持久保存，未进入 Git。
- 合并当前 main 05db359，merge commit 5378563，保留最新剧情和播放器修复。语音删除等待服务器成功后再清理本机引用；失败保留重试状态。参考音频和自定义克隆结果改为 private, no-store；普通预设缓存不变。
- Build 5（1.0 / 5）实际 Release 签名归档与 App Store 分发导出成功。IPA：native/Archives/AppStoreExport-Build5/App.ipa，917,377,546 字节。已核验 Bundle、Team、版本、最终资源、概率披露与抽取实现、分发 profile 和无 GMA/UMP。Xcode 显示 App 1.0 (5) uploaded；仍须在 Connect 核对处理状态并选择构建，不等于审核通过。Build 4 先前验证和上传成功，现由 Build 5 取代作为提审候选。
- 专用普通权限审核账号已创建，真实邮箱密码登录 HTTP 200；随机密码仅存本机受限文件和 Connect 私密审核字段，不写入仓库。用户名和密码填写后保存按钮已禁用。
- Connect 已保存英文描述、关键词、审核说明、技术支持 URL、英文副标题及隐私政策 URL；主分类“娱乐”。联系人由持有人填写。重新查看时版权栏为空，已请持有人给出准确版权文字。
- 隐私标签 17 类已根据自有代码和实际 GoogleSignIn 隐私清单填写用途、账号关联及不追踪；持有人确认最终合规承诺后发布，Connect 显示发布成功。年龄问卷按持有人确认的内容频率填写，普通暴力与持续残酷细节区分，已保存覆盖为 18+；如韩国要求额外编号仍须按实际后台条件处理。
- 发现可购买钻石参与的心跳扭蛋缺少购买前概率披露。按 Apple 3.1.1 仅补中英说明，三种奖励改为等概率抽取，与角色各 1/2 的原选择一致；价格和免费次数保留。8 项回归通过，独立审查通过，最终 IPA 已包含。
- Build 5 模拟器实际专用账号登录、故事目录加载和英文多角色 AI 回复已观察；iPhone 18 Pro 原始截图已保存。其 1206×2622 是中屏规格，不能代替大屏必需截图；正以原生大屏与 iPad 采集，不拉伸伪造。
- App 和七个消耗型钻石商品均保存 17 个销售地区：美国、加拿大、南美洲 12 国、日本、韩国、台湾。无广告、无订阅。

## 生产部署与验证
当前生产基线 /opt/miru/releases/05db359；核心 _lib、_apple、_wallet、_iap、_voice、auth、longcat 已逐项匹配候选。保留 miru_ovh_20261104 DML 运行角色，未授予 DDL。
本轮六文件 api/works.js、api/tts.js、api/i18n.js、api/translate.js、privacy.html、terms.html 已同步 current 和 shared/overrides；备份 shared/backups/ios-closeout-20261114T032755Z。
语音持久目录为 /opt/miru/shared/voices，store ID 保留旧默认语义。首次验收暴露 ProtectSystem=strict 阻止写入，部署已自动回滚；补充仅此目录的 ReadWritePaths 后再次上线成功。该必要存储权限在 API 回滚时保留，避免新录音无法删除；其他文件系统保护保留。

线上 22 项隔离验收全部通过：云进度存取、七商品映射、原生成人内容隔离、普通作品读取、屏蔽/解除/列表、举报快照、私有翻译不公开、录音上传与归属、持久注册、参考音频 no-store、跨账号删除拒绝、本人删除、注销清理、注销后访问拒绝、重试幂等。合成账号及内容清理核验通过；没有使用真实用户内容或支付。
apex/www 两域名原始五语言 i18n URL 共 10 项均 HTTP 200 / Cache-Control: no-store。未发现已配置的 CDN/proxy cache；新客户端删除旧翻译缓存并换用 private_v2。不能据此声称已擦除远端旧浏览器里的历史字节。

## 验证边界
- 当前变更回归：voice-delete 9/9、voice-privacy 2/2、AI consent、translation privacy、生产公开配置检查均通过。合并后完整 release-contract 和 narrative145 22 项此前通过。
- 既有钱包 23/23、Apple 授权/注销 PostgreSQL 20/20、签名交易夹具 33/33；夹具不是实际 Apple Sandbox 购买。
- 用户实测撤回 AI 许可后无回复，重新允许后恢复；未出现关闭提示。无提示体验延期；无真机网络抓包，不将“无回复”当作没有传输的独立证据。
- Apple 真机授权撤销/注销、麦克风拒绝和真实内购取消/购买/交付/重试尚未完成。

## 提交前剩余必要项
1. 按用户要求暂搁置的税务证明：美国 OVH 机房与 Foreign Status Certificate 中设备资产声明的适用性，已授权提交 Apple 财务咨询，待回复。最近确认付费协议“等待用户信息”；W-8BEN“使用中”，810 信息“有效”，银行已登记。不把登记当作付款资料审核通过。
2. 完成真实 Sandbox 内购与交付验收；补七商品审核截图，并随首版关联提交。映射正常不等于 StoreKit 商品实际可买。
3. 从最终候选取得 Apple 要求的大屏 iPhone/iPad 产品截图并上传；Build 5 已上传，待 Apple 处理后选择该构建并核对出口合规。
4. 年龄 18+ 和 App Privacy 已完成；内容权利声明及版权文字仍待持有人准确提供，不替持有人猜测合法权利归属。
5. 核验历史已泄露提供方凭据已撤销；不读取、测试或提交旧密钥。确认审核期间举报处理和服务可用。

## 保持延期
广告、Google 登录性能、AI 撤回提示体验、广泛重构、历史孤立对象全面盘点、极端并发和独立测试经济系统。不将这些工程优化增加为首次上架前置。
