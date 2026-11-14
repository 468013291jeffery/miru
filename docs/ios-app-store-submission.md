# MIRU 首次提交材料（草案）
尚未上传、尚未提交审核。以下资料应在真实候选包与线上环境验证后填写，不能用开发截图或测试通过代替实际结果。

## 已确认身份
- Bundle：com.miru.plus.app；Team：H79A5X8935。
- App Store Connect 注册名称：MIRU IOS Production。商店实际显示名称 MIRU Interactive Stories。
- 数字 Apple ID：6834383803。
- iOS 首版不接广告；广告源码保留在仓库，但不编译或初始化广告 SDK。
- 首发海外；具体国家列表由账号持有人在可售范围中确认，暂不包含中国大陆。

## 英文元数据草案
Name: MIRU Interactive Stories
Subtitle: Your choices shape the story
Keywords: romance,choices,fiction,characters,roleplay,drama,chat,creative,community
Support URL: https://miru.plus/contact.html
Privacy URL: https://miru.plus/privacy.html

以上字段已在 Connect 保存。专用审核账号已填写私密登录字段；密码仅存本机受限文件，不进入本文。英文描述和审核备注也已保存，最终文字以 Connect 草稿为准。年龄分级、版权、隐私标签、截图、构建选择与实际 Sandbox 内购仍未完成。

Description:
Enter interactive stories, meet original characters, and choose how your journey unfolds.

Read authored dramas, shape conversations and relationships through your choices, and explore different routes and endings. AI features let you continue character conversations and create text, images, voice and video when you choose to use them.

Create your own stories and discover community works. Use in-app reporting and author blocking to manage what you see.

Optional diamond purchases support paid features. The first iOS release contains no advertising. Diamonds and synced progress are linked to your MIRU account. AI features require permission before data is shared with AI providers. You can decline or withdraw permission and continue browsing.

Intended for adults aged 18 and above. An internet connection is required for account, cloud and AI features.
此文案仅描述现有功能。最终截图、可用 provider 与实际商品状态须一致，不写“保证安全”“无限免费”等未经验证的承诺。

## 商品
全部为消耗型钻石商品，商品 ID 必须与实际服务端 config.skus 的 apple 字段完全一致。当前默认：
com.miru.plus.app.gems_5
com.miru.plus.app.gems_16
com.miru.plus.app.gems_28
com.miru.plus.app.gems_60
com.miru.plus.app.gems_125
com.miru.plus.app.gems_330
com.miru.plus.app.gems_700

在 Connect 创建本地化名称、说明、价格与审核截图，并随首个版本提交。App 中价格来自 StoreKit，本地美元示例不能替代真实价格。核验首充奖励与产品描述一致。首次发布前确认付费协议、银行和税务生效。

## 审核说明草案
MIRU offers interactive fiction and character conversations, with optional AI creation tools. Native iOS authentication uses Sign in with Apple and Google Sign-In; email sign-in is also available. Consumable diamonds use StoreKit. This iOS release does not display ads or include the AdMob/UMP SDKs.

To inspect purchases, open the diamond top-up sheet. “Sync purchases and balance” retries unfinished transactions and refreshes the account balance. Consumables already delivered are reflected in the account balance.

To review AI privacy, open an AI conversation or creation feature. The app requests permission before sharing user inputs with AI providers. Decline to keep browsing; permission can be changed in Me. Me also contains content reporting, author blocking and account deletion.

Explicit adult-marked community works are excluded in the native iOS client.
审核专用 MIRU 账号及密码直接填写 Connect 的私密审核字段，不提交到仓库。账号应可访问完整功能，不依赖审核员接收邮件验证码。提供可联系的审核联系人。真实外部服务及商品必须在审核期间可用。

## 年龄、隐私与截图
- 按内容和能力如实完成当前年龄问卷，覆盖 UGC、AI、恋爱暗示、暴力/悬疑等实际内容；iOS 首版不含广告。产品最低年龄统一为 18；如计算等级低于使用条款要求，应在后台调高。不要因排除露骨内容而漏报其他内容。依据：[Apple 年龄问卷](https://developer.apple.com/help/app-store-connect/manage-app-information/set-an-app-age-rating/)。
- 隐私标签需要覆盖 MIRU 和登录/AI SDK（iOS 首版不含广告 SDK） 的实际收集：账号标识/联系资料、用户内容、音频/图片/视频、购买与使用记录。账户关联、用途与 tracking 分别核对，不能勾选“不收集数据”。依据：[Apple App Privacy](https://developer.apple.com/app-store/app-privacy-details/)。
- 从最终候选 App 获取真实使用截图：剧情目录、剧情/选择、对话、创作或安全设置；登录页截图只作启动证据，不能替代产品展示。支持 iPad 时还需 iPad 13 英寸截图。具体尺寸以当前 Connect 要求为准：[Apple 截图规格](https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications)。
- 图标已使用现有 MIRU 标志，1024×1024，无 alpha。出口合规声明须与实际 App 加密用途一致；当前客户端仅标准网络与系统 SDK，不含服务端的 Apple 私密加密密钥。

## 发布顺序
1. 核验已提供的 Apple ID 6834383803、Apple/Google 登录与 IAP 商品；无须注册或配置 AdMob。
2. 在安全环境配置服务端私密变量，发布已审查后端和隐私页；清除旧翻译 CDN 缓存并验证公开词典。
3. 验证真实账号、存储与接口，在 TestFlight 完整走一遍核心流程及失败/重试流程。
4. 完成截图、隐私/年龄/出口问卷、审核账号和商品资料。
5. Release 检查通过后签名 Archive、上传 Connect，选择构建和商品，提交首次审核。通过后按选定发布方式上线。
