# MIRU iOS
海外首发保留剧情、社区、AI、邮箱/Apple/Google 登录和钻石内购；首版无广告、无订阅。Bundle com.miru.plus.app，Team H79A5X8935，Apple ID 6834383803，最低 iOS 15。

## 当前候选
1.0（Build 4）：Archives/AppStoreExport-Build4/App.ipa（917,377,381 字节）。实际 Release 签名归档及 App Store 分发导出成功；包标识、最终资源、分发 profile 和无 GMA/UMP 已核验。尚未上传或提交审核。
用户已确认真机邮箱/Apple/Google 登录、剧本 AI、重启后登录和进度对话保留。真实 Sandbox 内购、Apple 授权撤销与注销仍待验证。服务端隐私、社区屏蔽举报、录音归属删除已部署并通过 22 项线上隔离验收。详见 ../docs/ios-launch-status.md。

## 构建
Node 22+，Xcode 26+。仓库根目录：
```sh
python3 source/build.py
node tools/prepare-ios.mjs
node tools/ios-release-check.mjs --check
cd native
node node_modules/@capacitor/cli/bin/capacitor copy ios
DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer xcodebuild -project ios/App/App.xcodeproj -scheme App -configuration Release -destination 'generic/platform=iOS' -derivedDataPath DerivedDataNoAds -archivePath Archives/MIRU-Build4.xcarchive -allowProvisioningUpdates archive
```
归档已存在时用 Xcode Organizer 中现成归档，或为下一构建使用新路径。使用 cap copy ios 保留自定义 SPM；cap sync 可能重生成 Package.swift。公开配置唯一来源 ios-release.public.json；私钥、生产环境和审核密码不得打包或提交。

## 无广告
SPM 不含 AdMob/UMP，无广告初始化、奖励任务或广告隐私入口。网页/Android 原有行为保留，广告源码留在 MIRU_ADS 条件内；本版不能远程开启广告。

## 提交
账号资料见 ../docs/ios-account-setup.md；材料见 ../docs/ios-app-store-submission.md。税务证明按用户决定暂搁置，其余截图、隐私/年龄、真实内购和上传继续完成。导出 IPA 不代表 Apple 已接收或通过审核。
