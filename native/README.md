# MIRU iOS
海外首发，保留现有剧情、社区、AI 文字/语音/图片/视频、邮箱/Apple/Google 登录、钻石充值和激励广告。Bundle `com.miru.plus.app`，Team `H79A5X8935`，最低 iOS 15。开发工具需要 Node 22+ 与 Xcode 26+；本机已用 Xcode 27.2 / SDK 27.2 编译。

## 构建
在仓库根目录执行：
```sh
python3 source/build.py
npm --prefix native ci
node tools/ios-release-check.mjs
node tools/prepare-ios.mjs
cd native
node node_modules/@capacitor/cli/bin/capacitor copy ios
DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Debug -sdk iphonesimulator -destination 'generic/platform=iOS Simulator' -derivedDataPath DerivedData CODE_SIGNING_ALLOWED=NO build
```
使用 `cap copy ios`；`cap sync` 会重新生成 CapApp-SPM/Package.swift，需要保留已接入的官方 SDK 依赖。公开资源由白名单打包，禁止向 native 放入服务端密钥、p8 或浏览器会话。模拟器 App 位于 DerivedData/Build/Products/Debug-iphonesimulator/App.app。Debug 参数 `--miru-smoke` 会调用真实原生配置桥接，并将有限的启动状态写入模拟器 App 缓存 miru-smoke.json。

## 正式配置与打包
公开配置唯一来源为 ios-release.public.json。Google iOS 客户端及当前线上公开的网页客户端已配置；数字 appAppleId、admobAppId、rewardedAdUnitId 尚缺。不要填写示例值。运行：
```sh
node tools/ios-release-check.mjs --check
```
通过后在 Xcode 打开 ios/App/App.xcodeproj，选择本人的开发者团队、真实设备签名并 Archive。每次 Release 构建还会执行 validate-release.sh，拒绝缺失或测试广告 ID。Debug 使用 Google 官方测试广告；不能把 Debug 包提交审核。

StoreKit 只返回已验证的签名交易，服务端校验并发钻后才 finish；未完成交易在重新登录或回到 App 时重试。正式校验还要求服务端 IAP_APP_APPLE_ID、Production/Sandbox 配置正确，不能使用本地 Xcode 交易替代真实 Sandbox 验单。

## 提审前仍需实际完成
- 服务端部署并配置 Apple code 交换/撤销所需私密环境变量及生产存储；这些不在 App 中。
- 建立全部 consumable 商品，完成付费协议/税务/银行及 AdMob UMP 隐私设置。
- 真实 iPhone/TestFlight 验证 Apple/Google 登录、注销重试、Sandbox 内购与中断补发、真实广告关闭/奖励、AI 拒绝及撤回、麦克风拒绝。
- 更新线上隐私页；部署翻译隐私修复时清除此前 /api/i18n 缓存。不要自动公开历史翻译。
- 准备真实截图、审核专用 MIRU 账号和 App Store Connect 隐私/年龄/出口合规资料。
详见 ../docs/ios-launch-status.md 与 ../docs/ios-app-store-submission.md。编译通过不代表已通过审核、已配置生产账号或已经上传。
