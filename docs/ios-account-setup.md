# MIRU 首发需要账号持有人完成的配置
Bundle：com.miru.plus.app；Team：H79A5X8935；数字 Apple ID：6834383803。

## Sign in with Apple
1. 打开 [Apple Developer → Keys](https://developer.apple.com/account/resources/authkeys/list)，点击 +，名称可填 MIRU Sign in with Apple。
2. 勾选 Sign in with Apple，Configure，选择关联 com.miru.plus.app 的 Primary App ID，保存并 Register。
3. 下载 .p8 到本机安全目录，保留好文件。仅提供文件本地路径和公开 Key ID；不要粘贴私钥到聊天或仓库。随后由部署流程安全设置 APPLE_PRIVATE_KEY / APPLE_KEY_ID。
4. 服务端令牌加密密钥已经安全生成，不需要自己创建或提供；不会覆盖轮换已有有效密钥。

这是本应用现有授权代码交换与账号删除时撤销授权所需的配置，见 [Apple 官方说明](https://developer.apple.com/help/account/capabilities/create-a-sign-in-with-apple-private-key)。

## 钻石内购
先在 [App Store Connect → Business](https://appstoreconnect.apple.com/business) 完成 Paid Apps Agreement、税务与银行资料；法定声明及银行信息需账号持有人本人确认，不发送到聊天。

然后打开 MIRU 应用 → Monetization → In-App Purchases，创建 Consumable（消耗型）。Product ID 必须与下表一致，创建前核对，不能用 Apple Pay 或订阅代替。

| Product ID | 钻石 | 首发美元参考价格 |
|---|---:|---:|
| com.miru.plus.app.gems_5 | 5 | $0.99 |
| com.miru.plus.app.gems_16 | 16 | $2.99 |
| com.miru.plus.app.gems_28 | 28 | $4.99 |
| com.miru.plus.app.gems_60 | 60 | $9.99 |
| com.miru.plus.app.gems_125 | 125 | $19.99 |
| com.miru.plus.app.gems_330 | 330 | $49.99 |
| com.miru.plus.app.gems_700 | 700 | $99.99 |

每个商品补齐本地化名称/描述、价格、可售地区和审核截图。以上为当前产品默认参考价格，真实价格按 Connect 配置并由 StoreKit 显示；首充额外奖励由服务端结算，不修改 Product ID。首发地区遵循海外范围。

创建及协议要求见 [Apple 商品创建说明](https://developer.apple.com/help/app-store-connect/manage-in-app-purchases/create-consumable-or-non-consumable-in-app-purchases) 和 [内购配置总览](https://developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/overview-for-configuring-in-app-purchases/)。
完成后再做真实 Sandbox 购买/取消/中断补发测试，不用本地模拟交易冒充 Apple 验单通过。
