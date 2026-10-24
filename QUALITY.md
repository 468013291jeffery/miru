# 质量闸（QUALITY）

> **一句话**：改完跑 `node tools/check-all.mjs`。十一套、215 个用例，全绿才提交。
> 这一页是给**接手这个仓库的人**看的：哪条闸在管什么、它怎么变红、你改哪里会踩到它。

## 一条命令

```bash
node tools/check-all.mjs          # 八套全跑
```

单独跑某一套（排查时用）：

| 套 | 用例 | 一条命令 | 它回答的问题 |
|---|---|---|---|
| `ledger-selftest` | 43 | `node tools/ledger-selftest.mjs` | 账本的 CSV / 汇总 / 留存口径对不对（分母、空值、跨天） |
| `events-selftest` | 11 | `node tools/events-selftest.mjs index.html` | 埋点队列与刷写（满 20 条、15 秒、失败重试） |
| `events-contract` | 13 | `node tools/events-contract.mjs index.html --selftest` | **产物里**那五个事件还在不在、字段齐不齐、`chapter_open` 有没有去重 |
| `pack-flow-selftest` | 15 | `node tools/pack-flow-selftest.mjs index.html` | 剧本从进章到结局的流程（选项、付费墙、结局判定） |
| `flush-e2e` | 8 | `node tools/flush-e2e.mjs` | 埋点真的能发到 `/api/events` 并落库（**需要 `node tools/fake-api.mjs` 在 8130**） |
| `status-contract` | 14 | `node tools/status-contract.mjs --selftest` | 好感/五维**只有一个写入口**；模型提议有在场验证 |
| `tune-selftest` | 37 | `node tools/tune-selftest.mjs` | 可调参数（滑钮）默认值、覆盖生效、拼错被忽略 |
| `cache-split-contract` | 17 | `node tools/cache-split-contract.mjs --selftest` | prompt 的 system/user 切分还在正确工作（**坏了会静默烧钱**） |
| `stage-report` | 4 | `node tools/stage-report.mjs --selftest` | 关系阶段是派生的，**升降两条路都要出声**（降级原来完全无声） |
| `castcard-selftest` | 10 | `node tools/castcard-selftest.mjs --selftest` | 角色卡分面：只有这一拍上场的人带秘密，其余人一个字不漏 |
| `card-selftest` | 47 | `node tools/card-selftest.mjs --selftest` | **每章一份角色卡**：可变折叠 · 只增不回退 · 立场只加码 · 揭示不改秘密 · 可回放 |

## 四条红线（不变量）

改动时只要破一条，对应的闸就会红：

1. **`th.love[...] = …` 直接赋值 0 处。** 所有好感改动走 `loveWrite(th, id, delta, reason, opts)`。
2. **`th.rdv`（五维）只在 `app21_dims.js` 里被改**，入口是 `dimAdd`。
3. **能影响玩法的数字只在 `source/src/app96_tune.js` 的 `DEFAULTS` 里**，调用处读 `MIRU_TUNE.<段>.<键>`，覆盖写 `tune.js`。
4. **`app3_chat.js` 里那 6 个标题串（`You write MIRU` / `HOW TO WRITE` / `HEAT CEILING` / `CAST (` / `- id=` / `NOW:`）+ `app79_ledger.js` 的 `LEDGER CHECK` 不能改名**——`app80_cache.js` 靠它们切分 prompt。

## 「我改了这个，哪条会红」

| 你动的东西 | 会红的闸 | 为什么 |
|---|---|---|
| 加一个状态写入（`th.love[x] = …`） | `status-contract` | 基线是 0，多一处就红 |
| 改 prompt 里的标题（比如把 `HOW TO WRITE` 改成中文） | `cache-split-contract` | 切分会静默降级成一条消息 ⇒ 缓存全废、账单翻倍 |
| 在代码里写一个魔法数字（价格、上限、窗口） | `tune-selftest` | 那几个老位置的字面量已经被清走 |
| 改埋点名字（`choice_pick` → `choose_pick`） | `events-contract` | 产物里找不到那个字符串 |
| 改剧本流程（进章 / 选项 / 结局） | `pack-flow-selftest` | 它是把真函数切出来跑的 |
| 改账本口径（分母、留存、空值） | `ledger-selftest` | 43 条，含「空值必须是 null 不是 0」 |
| 改关系阶段的判定或提示 | `stage-report` | 它会检查降级分支和去重还在不在 |
| 改角色卡 / CAST 组装 | `castcard-selftest` | 它会把三张卡切出来真跑，断言公开面不含秘密 |
| 改埋点刷写时机 | `events-selftest` / `flush-e2e` | 队列满/超时/失败重试三条路 |

## 为什么这些闸里有一半带 `--selftest`

**不会失败的检查不是检查。** 所以每道契约闸都有一个「红臂」：它会**故意把东西弄坏一次**，然后断言自己抓到了。

```bash
node tools/status-contract.mjs --selftest     # · 变异（多写一处）：已抓住 ✓
node tools/tune-selftest.mjs                  # · 变异（把字面量塞回去）：已抓住 ✓
node tools/cache-split-contract.mjs --selftest# · 变异（把 HOW TO WRITE 改名）：已抓住 ✓
node tools/events-contract.mjs index.html --selftest  # · mutation (choice_pick -> choose_pick): caught ✓
```

红臂的价值不在它会红，在它**第一次没红**的时候——那说明闸自己有个洞。

## 已知没覆盖的（诚实清单）

- **浏览器里的真实点击**：所有自检都是在 Node 里把函数切出来跑，不驱动真页面。10 MB 的单页在浏览器里评测会卡住（实测 70–230 秒），所以这条路被放弃了。
- **服务端 SQL**：`api/*.js` 的查询只在 `fake-api` 的假实现上跑过，没连过真库。
- **支付回调 / 订单**：`api/wallet.js` 的 SKU 与订单落库没有自检。
- **40 多个 UI 交互**：礼物、约会、小游戏这些入口点的**值**被闸盯住了，但「点下去有没有反应」没人盯。
- **缓存命中率**：`cache-split-contract` 只保证切分正确，不保证命中率高——那是账单上的事，不是代码里的。

## 前置条件

- 除了 `flush-e2e`，其余只需要仓库根有 `index.html`（`python source/build.py` 生成）。
- `flush-e2e` 需要假接口：`node tools/fake-api.mjs`（监听 8130，**故意不连生产环境**，否则会把测试数据写进真实账本）。
- 改了 `source/src/*.js` 之后**必须先重建**，否则闸检的是旧产物：`python source/build.py`。
