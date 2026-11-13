# MIRU iOS
海外首发保留现有剧情、社区、AI 文字/语音/图片/视频、邮箱/Apple/Google 登录和钻石内购。根据账号持有人的最新决定，iOS 首版不接广告。Bundle `com.miru.plus.app`，Team `H79A5X8935`，数字 Apple ID `6834383803`，最低 iOS 15。

## 构建
需要 Node 22+ 与 Xcode 26+。在仓库根目录执行：
```sh
python3 source/build.py
npm --prefix native ci
node tools/ios-release-check.mjs --check
cd native
node node_modules/@capacitor/cli/bin/capacitor copy ios
DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release -sdk iphoneos -destination 'generic/platform=iOS' -derivedDataPath DerivedDataNoAds -archivePath Archives/MIRU-NoAds.xcarchive CODE_SIGNING_ALLOWED=NO archive
cd ..
python3 tools/ios-no-ads-artifact.py native/Archives/MIRU-NoAds.xcarchive/Products/Applications/App.app
```
这个未签名归档用于构建核验，不能直接上传 App Store。实际签名和导出仍需本人的 Apple 开发者账号、证书与 provisioning profile。已完成真实 iPhone 的开发签名 Release 构建、安装、启动及 MIRU-Signed.xcarchive 归档；已成功导出 App Store 分发 IPA（Archives/AppStoreExport/App.ipa），尚未上传。未导出任何私钥。

公开配置唯一来源为 ios-release.public.json。Team、Bundle、数字 Apple ID 与两个 Google 客户端均已提供。Release 检查要求首版广告关闭，不再要求任何 AdMob ID。服务端正式验单默认使用公开登记的 appAppleId；若显式配置 IAP_APP_APPLE_ID，必须使用实际数字 ID，空值仍会失败。

使用 `cap copy ios` 保留自定义 SPM 依赖；`cap sync` 可能重生成 CapApp-SPM/Package.swift。公开资源由白名单打包，禁止放入服务端密钥、p8 或浏览器会话。Debug 参数 `--miru-smoke` 可输出有限的真实原生桥接状态。

## 首发无广告
AdMob/UMP 已从 SPM 依赖和本次 App 构建中移除，不初始化广告或同意 SDK，不显示广告奖励任务或广告隐私入口。网页和 Android 原实现保持不变。原生广告源码仅在仓库 `#if MIRU_ADS` 条件内保留；今后恢复需要在新版本中恢复依赖、编译条件、配置及对应审查，不能远程打开首版广告功能。

## 提审前仍需完成
- 开发签名及真机安装启动已完成；App Store 分发导出也已成功，继续完成服务端上传验证与完整真机功能测试。
- 安全部署已审查后端与隐私页，核验 Apple 授权交换/撤销私密配置、生产存储和实际 AI 接收方；清除旧翻译 CDN 缓存。
- 创建全部 consumable 商品，完成付费协议、税务和银行资料。
- 在真实 iPhone/TestFlight 验证 Apple/Google 登录、注销重试、Sandbox 内购/中断补发、AI 拒绝及撤回、麦克风拒绝。
- 准备真实产品截图、审核专用 MIRU 账号和 Connect 年龄/隐私/出口资料。

StoreKit 交易仅在服务端校验到账后完成；本地 Xcode 交易不能替代真实 Sandbox 验单。详见 ../docs/ios-launch-status.md 与 ../docs/ios-app-store-submission.md。编译或未签名归档通过不代表已正式签名、上传或通过审核。
