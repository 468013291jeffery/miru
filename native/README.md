# MIRU iOS
海外首发保留剧情、社区、AI、邮箱/Apple/Google 登录和钻石内购；按用户决定，首版无广告。Bundle com.miru.plus.app，Team H79A5X8935，Apple ID 6834383803，最低 iOS 15。

## 当前候选
1.0（Build 3）：Archives/AppStoreExport-Build3/App.ipa。实际 Release 真机签名构建、覆盖安装、签名 Archive 和 App Store 分发导出成功。包内核验确认规范 API、登录等待和充值加载修复、App Store profile 及无 GMA/UMP。未上传；手机锁屏时自动启动失败，需解锁后手动打开复测。旧 Build 1/2 不作为当前候选。

用户已确认邮箱和 Google 登录成功。剧本 AI 原生 CORS 已上线，公网真实模型测试 200。Apple Sign in Key 和 Connect 商品/协议/税务/银行仍需账号持有人完成；不能把分发导出或服务端商品映射当成真实购买通过。见 ../docs/ios-account-setup.md。

## 构建
Node 22+，Xcode 26+。从仓库根目录：
```sh
python3 source/build.py
npm --prefix native ci
node tools/ios-release-check.mjs --check
cd native
node node_modules/@capacitor/cli/bin/capacitor copy ios
DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release -destination 'generic/platform=iOS' -derivedDataPath DerivedDataNoAds -archivePath Archives/MIRU-Build3.xcarchive -allowProvisioningUpdates archive
```
归档路径已存在时请在 Xcode Organizer 使用现成归档，或为新构建选择新路径。使用 cap copy ios 保留自定义 SPM 依赖；cap sync 可能重生成 Package.swift。

公开配置唯一来源 ios-release.public.json；私钥和环境文件不能打包或提交。服务端 IAP 默认使用登记的数字 Apple ID，显式错误配置仍拒绝。Debug --miru-smoke 只输出有限桥接状态。

## 首版无广告
SPM 和构建中没有 AdMob/UMP，无广告初始化、奖励任务或广告隐私入口。网页和 Android 原有广告行为保留。仓库广告源码位于 MIRU_ADS 条件内，未来恢复需重新集成依赖、配置并发布新版本，不能远程开启本版广告。

## 服务端与提审
必要登录/钱包后端已单独部署并保留生产 DML 运行账号和 owner 迁移流程；生产合成测试账号通过钱包元数据和注销检查。其他内容、隐私和语音候选变更尚需核对部署，真实 Sandbox 内购、Apple 授权撤销、麦克风与 AI 许可/撤回仍需实测。
完整状态和剩余门槛见 ../docs/ios-launch-status.md，提交材料见 ../docs/ios-app-store-submission.md。不包含服务器环境文件或私钥的本地构建包，也不等于 Apple 已接收或通过审核。
