# MIRU iOS 首发状态
更新时间：2026-11-14。分支 codex/ios-app-store，海外首发，无广告，保留现有剧情、社区及 AI 功能。尚未上传 App Store Connect 或提交审核。

## 当前结果
- 邮箱与 Google 登录已由用户在真实 iPhone 上确认成功。Google 登录后等待：首页原本额外等待余额请求；Build 3 使用登录接口的权威余额先进入，再后台刷新。跨账号云进度恢复仍先完成，实际改善幅度待真机复测。
- 剧本 AI 的线上接口原先拒绝 capacitor://localhost 与 X-Miru-Client。已单独部署已审查的 longcat 接口及原生安全指令，公网无个人数据的测试返回 HTTP 200 和真实模型文本。手机剧情实测待确认。
- Apple 登录旧后端把 apple_challenge 当成邮箱请求，误报邮箱无效。已接入新挑战/授权/撤销与注销模块；目前正确返回 configure_apple，因为用户尚未创建 .p8 / Key ID。令牌加密密钥已在服务器安全生成并持久保存，未输出或进入 Git。
- 内购服务端已接入签名交易校验和原子钱包。生产隔离测试账号的钱包返回 200、7 个映射及账户绑定信息，注销成功。用户确认 Connect 商品和付费协议/税务/银行尚未完成；真实购买尚未可验证。Build 3 的商品和后端只读加载有 20 秒截止时间，不再无限停留在连接中。此超时不包围付款或交付操作。
- Build 3（1.0 / 3）实际 Release 真机签名构建、覆盖安装及签名归档成功，保留本机数据。自动启动被手机锁屏拒绝，待解锁手动打开。App Store 分发导出成功；实际 IPA 核验包含登录等待/充值超时修复及正确规范 API、App Store profile 和无 GMA/UMP。路径 native/Archives/AppStoreExport-Build3/App.ipa，908,006,866 字节。旧 Build 1/2 不作为最新候选。

## 已登记的公开配置
Team H79A5X8935；Bundle com.miru.plus.app；Connect 数字 Apple ID 6834383803；注册名称 MIRU IOS Production。Google iOS 和网页/服务端客户端均已配置，生产网页客户端已按布尔匹配核验。首版无 AdMob/UMP SDK，不再需要广告账号或 ID。

## 本轮服务端实际变更
- 保留动态更新中的线上剧情、媒体和网站。准备时两次因发布目录变化中止，均未写入；逐项重新核验哈希后继续。
- 当前已核验基线 /opt/miru/releases/43f4f04。只接入 _lib、_apple、_wallet、_iap、_voice、auth、wallet 七个必要模块，公开 iOS 配置及依赖清单；同步持久 overrides。AI longcat 先独立部署。
- 保留运行账号 miru_ovh_20261104 的无 DDL 模式；owner 在一个事务中安装新增表/列/函数、最小权限及缺失商品映射。没有给运行账号开放建表权限，没有真实购买或变更现有用户余额。
- 独立依赖目录 /opt/miru/shared/ios-native-api-aa8b25a；生产 @apple/app-store-server-library 指向该目录，版本 3.1.0，及其依赖均隔离安装。
- 备份：shared/backups/ios-cors-20261113T153359Z、ios-ai-20261113T161433Z、ios-native-api-20261113T163841Z、ios-apple-token-key-20261113T164143Z。包含环境备份的目录为服务器私密文件，不应下载或打印。
- 这不是整分支生产部署：原生社区内容筛选/屏蔽、译文隐私、完整语音处理和网页隐私材料等其他候选变更仍需逐项核对后上线。旧翻译 CDN 缓存清除与旧提供方凭据撤销仍未核验，不把当前核心接口接通当成提审就绪。

## 验证证据
- 钱包 23/23；此前 Apple 签名交易 33/33、实际 PostgreSQL 授权/注销 20/20。
- 本轮受限数据库运行、充值加载超时、原生登录不等待余额三项新回归通过，并经只读独立复核。
- 网络规范域名、AI 许可与原生安全策略回归通过。
- 已合入主分支 1a797bb 的最新剧情与 authored contract，保留 app100_fixes / app101_you / app100_dialogue；完整 JS 语法、最新剧情与 authored runtime 测试通过。
- Build 1/2 此前分发成功及旧 CI 通过，不能替代本轮 Build 3 检查。完整 API 部署流程先隔离准备、再审查、后执行；合成账号验证不使用用户密码、令牌或个人内容。

## 提交前必须完成
1. 用户完成 [Apple 账号配置](ios-account-setup.md)：Sign in with Apple Key、七个消耗型商品、付费协议/税务/银行；私钥只通过本机安全文件接入服务器。
2. 真实 iPhone/TestFlight 验证 Apple/Google 登录、进度恢复、AI 许可/撤回与剧情回复、麦克风拒绝、真实 Sandbox 内购取消/中断/补发、账号注销。
3. 核对并部署仍未上线的首发隐私、内容与语音规则，核验生产录音持久存储、Blob 权限与实际 AI 接收方；清除旧译文缓存并核验旧凭据撤销。
4. 完成真实截图、审核专用 MIRU 账号、年龄/隐私/出口合规和联系人资料；完成 App Store 服务端包验证后再提交。

## 延期
广告、历史孤立对象盘点、极端并发治理、独立测试经济系统、广泛重构、UI/性能优化均延期。模型指令不能保证所有输出安全，仍需真实场景及运营处理验证。
