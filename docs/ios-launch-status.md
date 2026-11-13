# MIRU iOS 首发状态
更新时间：2026-11-13。工作分支 codex/ios-app-store。目标是尽快通过海外首次审核；用户最新决定 iOS 首版不接广告，其余已有功能保留。未执行生产部署或 App Store 上传。

## 已完成的候选代码
- 钱包原子发放与 Apple 签名交易校验；并发/重复/重试防重复发钻，服务端交付后完成 StoreKit 交易。
- 原生 Apple/Google 登录、授权撤销、可重试注销、已登记个人文件和本地资料清理。
- 举报内容留存、作者屏蔽、原生成人标记作品排除和语音/文字模型请求安全指令。
- iOS 首版移除 AdMob/UMP 构建依赖、初始化、广告奖励入口和广告隐私入口；不调用广告 SDK、不模拟奖励。网页和 Android 广告行为保留。
- AI 明确许可、拒绝后浏览、撤回许可、自定义接收地址确认及实时语音停止。
- 自动译文与公开词典分离，避免私聊、记忆和草稿进入匿名词典。历史词条默认不公开。
- 现有页面和媒体白名单打包，MIRU 图标、权限、Apple capability、正式配置拦截和 CI。
- 商品、元数据及审核说明草案见 [提交材料](ios-app-store-submission.md)。

## 公开配置
| 配置 | 状态 |
|---|---|
| Apple Team H79A5X8935 | 已配置 |
| Bundle com.miru.plus.app | 已配置 |
| Connect 注册名称 MIRU IOS Production | 已登记 |
| 数字 Apple ID 6834383803 | 已配置，正式验单默认使用此值 |
| Google iOS 客户端 | 已配置 |
| Google 网页/服务端客户端 | 从现有线上公开配置读取并保留 |
| AdMob ID | 首版不接广告，无需提供 |

私密 Apple p8、Key ID、令牌加密密钥及生产存储通过服务器安全环境配置，实际配置尚未核验；不要发送私钥或密码到聊天。IAP 商品、付费协议/银行税务也需核验。旧 LongCat 凭据的撤销/轮换未核验，绝不测试或打印旧密钥。

## 验证证据
- 钱包 23/23；本次 Apple 签名交易 33/33；此前实际 PostgreSQL 登录与注销 20/20。
- 本次无广告桥接、正式配置拦截、AI 许可自测通过；显式空的正式验单 ID 仍失败，不会默默回退。
- 此前译文隐私、原生内容、语音安全请求、资源打包、release-contract、目录与角色列表检查通过。
- Xcode 27.2 / iOS SDK 27.2 实际无广告 Debug 模拟器编译成功。
- 无广告版实际 iPhone 模拟器 WebKit→Swift 调用返回 platform=ios、adsEnabled=false、googleConfigured=true；前端和 AI 许可模块已加载，页面状态 complete。
- 实际 iPhoneOS Release 未签名 Archive 成功。Simulator 与 Release 的实际 App 包均通过广告排除检查：无 GMA/UMP 框架或链接、无广告 Info 配置、无静态网页广告脚本。
- 打包包含 2,398 个公开资源，不包含后端、私钥、浏览器会话或本地报告。
- 先前主分支 4f58fa9 已合入，保留新双语剧情、配音与页内注销确认；后续 main 37a5be2 仅重生成 index.html。
- 本次无广告改动独立源码审查未发现明确 P0；此前候选 CI 通过。本次新增 Release Archive 与广告排除 CI，推送后另行核验。上述检查不代表 Apple 审核结果。

## 正式签名的实际阻断
用户已在 Xcode 配置账号。重新执行带 -allowProvisioningUpdates 的正式 Archive，Apple 返回团队没有可用于生成描述文件的已注册设备，以及未找到 com.miru.plus.app 的 iOS App Development profile。签名 Archive 失败（exit 65）；现有 MIRU-NoAds.xcarchive 为未签名构建核验产物，不能直接上传。

下一步连接并信任真实 iPhone，在 Xcode 选择设备并完成注册及 Developer Mode，再继续签名和真机测试。App Store 分发描述文件不依赖测试设备注册，另可采用分发证书及 App Store profile；当前未验证该路径的证书可用性。不要把开发描述文件缺失描述为 App Store 本身强制要求注册设备。

## 提交前必须完成
1. 完成实际签名；核验 Apple/Google Console capability、商品、付费协议/税务/银行。
2. 安全部署后端和隐私页，核对服务器适配器；清除旧 /api/i18n CDN 缓存，验证私密译文不可公开。历史数据未在生产清理。
3. 核验生产持久录音卷、Blob 权限、实际启用的 AI 接收方与服务器私密配置。
4. 真实 iPhone/TestFlight 验证登录、AI 拒绝/撤回、剧情、麦克风拒绝、内购取消/中断补发和账号注销。
5. 完成真实产品截图、审核专用 MIRU 账号、年龄/隐私/出口合规和联系人资料，再签名上传并提交。

## 明确延期
广告接入、历史无归属录音与孤立对象盘点、极端上传/注销并发治理、独立测试经济系统、广泛重构、性能与 UI 优化均延期。模型指令不保证全部输出安全；仍需真实模型与运营处理验证。完整首发检查以用户的最新范围为准，不把上述工程改良列为苹果明文强制项。
