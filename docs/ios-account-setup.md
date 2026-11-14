# MIRU 首发 Apple 账号配置状态
Bundle：com.miru.plus.app；Team：H79A5X8935；数字 Apple ID：6834383803。

## Sign in with Apple
2026-11-14 已经持有人当次确认完成创建与生产部署。公开 Key ID：P7X57ZQD3P；仅关联 com.miru.plus.app。挑战端点实际返回 200；真实授权/撤销待真机测试。无需重复创建，以下保留为维护步骤。私钥不进入仓库。

1. 打开 [Apple Developer → Keys](https://developer.apple.com/account/resources/authkeys/list)，点击 +，名称可填 MIRU Sign in with Apple。
2. 勾选 Sign in with Apple，Configure，选择关联 com.miru.plus.app 的 Primary App ID，保存并 Register。
3. 下载 .p8 到本机安全目录，保留好文件。仅提供文件本地路径和公开 Key ID；不要粘贴私钥到聊天或仓库。随后由部署流程安全设置 APPLE_PRIVATE_KEY / APPLE_KEY_ID。
4. 服务端令牌加密密钥已经安全生成，不需要自己创建或提供；不会覆盖轮换已有有效密钥。

这是本应用现有授权代码交换与账号删除时撤销授权所需的配置，见 [Apple 官方说明](https://developer.apple.com/help/account/capabilities/create-a-sign-in-with-apple-private-key)。

## 钻石内购
2026-11-14 已经持有人当次确认接受 Paid Apps Agreement，后台状态为“等待用户信息”。银行账户已在 Connect 列表登记（不等于已核验银行审核通过），W-8BEN 显示“使用中”，第 810 号令合规信息显示“有效”。仍缺 U.S. Certificate of Foreign Status of Beneficial Owner；该证明包含无美国员工及无美国境内用于 Apple 收入的自有/租用/控制设备资产声明。持有人确认 OVH 生产服务器为美国机房，需先向 Apple 核实云服务器的适用范围及正确证明路径，不能据此直接勾选；美国机房也不能单独用于判定常设机构或自动改动 W-8BEN。欧盟 DSA 交易商声明未完成；首发不在欧盟发行，相关验证延期。在 [App Store Connect → Business](https://appstoreconnect.apple.com/business) 由持有人提交真实资料，不发送到聊天。

七个 Consumable（消耗型）商品已在 Connect 实际创建并保存，均配置英语（美国）名称/描述、美元基准价格及17 个国家或地区（美国、加拿大、南美洲 12 国、日本、韩国、台湾）。Product ID 与应用映射一致。尚未提交审核，未验证真实购买。

| Product ID | 钻石 | Connect 美元基准价格 | Connect 商品 Apple ID |
|---|---:|---:|---|
| com.miru.plus.app.gems_5 | 5 | $0.99 | 6834610816 |
| com.miru.plus.app.gems_16 | 16 | $2.99 | 6834616109 |
| com.miru.plus.app.gems_28 | 28 | $4.99 | 6834616176 |
| com.miru.plus.app.gems_60 | 60 | $9.99 | 6834616795 |
| com.miru.plus.app.gems_125 | 125 | $19.99 | 6834617134 |
| com.miru.plus.app.gems_330 | 330 | $49.99 | 6834617978 |
| com.miru.plus.app.gems_700 | 700 | $99.99 | 6834618156 |

每个商品的审核截图仍待真实购买界面就绪后补齐；不上传含用户私人邮箱的反馈截图。真实价格按 Connect 配置并由 StoreKit 显示；首充额外奖励由服务端结算，不修改 Product ID。首发仅美国、加拿大、阿根廷、玻利维亚、巴西、智利、哥伦比亚、厄瓜多尔、圭亚那、巴拉圭、秘鲁、苏里南、乌拉圭、委内瑞拉、日本、韩国、台湾。其他地区及将来新增市场不自动开放。

创建及协议要求见 [Apple 商品创建说明](https://developer.apple.com/help/app-store-connect/manage-in-app-purchases/create-consumable-or-non-consumable-in-app-purchases) 和 [内购配置总览](https://developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/overview-for-configuring-in-app-purchases/)。
完成后再做真实 Sandbox 购买/取消/中断补发测试，不用本地模拟交易冒充 Apple 验单通过。

## Apple 财务咨询
2026-11-14 经持有人明确授权，已通过 Apple 官方“报告和付款 → 税务和银行设置 → 联系财务团队”提交税务信息咨询，成功页显示“感谢您与我们联系”。咨询包含美国 OVH 云服务器的使用情况，并请求确认设备资产声明适用范围、正确证明/问卷路径及是否需要修正 W-8BEN。未附身份证号、税号、银行账号或密钥；尚未收到回复，不视为 Apple 已认可任何税务处理。
