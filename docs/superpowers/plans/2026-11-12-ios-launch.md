# MIRU iOS Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Fix the audited money/security/privacy problems and deliver a buildable overseas iOS client with purchases and rewarded ads.
**Architecture:** Existing Web UI, new Capacitor iOS native bridge, existing Vercel backend with scoped fixes. Sandbox transactions are accurately marked; operationally separate review/test accounts share the existing wallet. Retain all existing features and entrances, and defer a separate test-economy architecture.
**Tech Stack:** JavaScript/Node, PostgreSQL/Neon, Python build tools, Swift/StoreKit 2/AuthenticationServices, Capacitor, Google Mobile Ads and UMP.
**Spec:** docs/superpowers/specs/2026-11-12-ios-launch-design.md

## Global Constraints
- Minimum iOS 15; bundle candidate com.miru.plus.app; backend https://www.miru.plus/api.
- Keep Web and Android working; preserve miru.plus origins and protected build parts.
- Both diamond purchases and rewarded ads are required; Google test ads only in development.
- No secrets in source; no main merge/deployment/App Store submission in this implementation.
- Team ID, production ad IDs and provider-side key rotation remain external until supplied and verified.

### Task 1: Atomic wallet and verified Apple purchase delivery
**Files:** api/wallet.js; api/_iap.js; new api/_wallet.js if needed; api/_lib.js schema only if needed; tools/wallet-selftest.cjs; tools/iap-selftest.mjs; package.json dev test dependencies; .github/workflows/wallet-tests.yml.
**Interfaces:** Preserve apply(sql,uid,delta,reason,key) for api/_board.js. GET /wallet adds iap:{appAccountToken,environment,productIds,test}; POST op:iap returns current gems, transactionId, environment, dup and test.
- [ ] Write regression tests for parallel identical receipt, ledger-write failure/retry, duplicate after spending, cross-account receipt replay, invalid quantity/type/product, genuine Sandbox review purchase and accurate test/environment marking.
- [ ] Run the new test and record failing balances/statuses against the base source.
- [ ] Implement SQL atomic delivery with a real PostgreSQL-compatible engine test. Lock the user's balance and reserve the unique receipt before crediting; order/bonus cannot be outside the atomic boundary.
- [ ] Enforce stable account token, exact SKUs and environment policy; genuine Sandbox purchases work for App Review without an internal whitelist; record test/environment and document separate review-account operation.
- [ ] Run wallet/iap tests and affected board API tests. Add PostgreSQL CI multi-connection race verification. Commit this task only.

### Task 2: Apple authorization lifecycle, credential hygiene and native server policy
**Files:** api/auth.js; new api/_apple.js; api/_lib.js; api/works.js; api/longcat.js; api/tts.js as required; source/mk_local.py; tools/apple-auth-selftest.cjs; tools/native-policy-selftest.cjs.
**Interfaces:** Implement apple_challenge and authorizationCode exchange from the spec. Exact allowed native origin capacitor://localhost, preserve existing origins. Native requests use X-Miru-Client:ios plus platform stored by server for content policy.
- [ ] Add failing tests for nonce mismatch/reuse/expiry, wrong native audience, missing code, token revocation failure, repeated deletion, native feed/direct-work explicit-content exclusion and CORS retention.
- [ ] Implement token exchange with encrypted refresh-token storage; keep existing email/Google functionality; deletion removes/anonymizes documented personal content and retries safely.
- [ ] Replace local hardcoded preset with environment lookup and fail clearly when absent. Document provider-side rotation as outstanding.
- [ ] Enforce iOS content policy on server independently of UI filtering; preserve existing backend access.
- [ ] Run the targeted tests, syntax checks and existing auth-related checks; commit this task only.

### Task 3: Buildable native iOS app and native service bridge
**Files:** native/package.json; native/capacitor.config.json; native/ios/App project and Swift sources; native/README.md; tools/prepare-ios.mjs; tools/ios-release-check.mjs; native Web bootstrap; tests for packaging and StoreKit transaction processing.
**Interfaces:** Implement exactly window.MIRU_NATIVE methods from the spec. App resources load from bundled UI. Native purchase returns JWS and does not finish until explicitly acknowledged. Apple login returns identity token + authorization code. Ad callback resolves rewarded only from real SDK reward callback.
- [ ] Add behavior tests for deterministic resource packaging/exclusions and failed release validation with test identifiers.
- [ ] Create Capacitor project with native Apple/StoreKit/AdMob/UMP implementations, icon/permissions/privacy manifests and Debug StoreKit configuration.
- [ ] Use official Google test App ID ca-app-pub-3940256099942544~1458002511 and reward ID ca-app-pub-3940256099942544/1712485313 in Debug only.
- [ ] Provide Release configuration inputs and reject test IDs/missing Team ID before archive. Do not fabricate developer values.
- [ ] Resolve actual dependencies and build iOS Simulator with CODE_SIGNING_ALLOWED=NO. Correct compiler errors, run native tests and commit.

### Task 4: iOS frontend integration, explicit AI consent and privacy disclosures
**Files:** source/src/app148_ios.js; source/src/app149_privacy.js; source/build.py; source/src/app70_login.js; source/src/app128_adsense.js; affected AI/voice/image boundaries; privacy.html; terms.html; tools/ios-bridge-selftest.cjs; tools/privacy-browser.cjs.
**Interfaces:** Consume MIRU_NATIVE and wallet iap configuration. Apple challenge/auth follow Task 2. iOS purchase bypasses legacy local purchase/earn code; backend acknowledgement precedes native finish. Native advertising bypasses web/simulated ads.
- [ ] Write failing browser/runtime tests: no AI user data before consent; refusal and withdrawal; no native AdSense; cancel/pending purchase grants nothing; successful delivery grants once; failure retains pending transaction; native ad dismissal without reward grants nothing.
- [ ] Implement native purchase/auth/reward UI integrations and pending transaction recovery; real localized prices and visible test-wallet status.
- [ ] Add clear consent request and settings withdrawal, gate all third-party user-data AI paths, update actual data/provider/retention disclosures.
- [ ] Rebuild index.html while retaining all protected parts; run targeted runtime/browser tests and release-contract/catalogue/role-list/deploy-guard checks; commit.

### Task 5: Integrated verification and release handoff
**Files:** docs/ios-launch-status.md; native/README.md; .github/workflows/ios.yml; relevant fixes identified by review.
**Interfaces:** Use actual build scripts and all four task outputs. External secrets are environment configuration and account-owner actions.
- [ ] Run focused backend and frontend tests plus actual simulator build; verify release validation rejects missing production configuration.
- [ ] Review whole branch for spec compliance and quality. Resolve load-bearing findings and re-review fixes.
- [ ] Write exact account setup steps for Apple IDs/IAP products/AdMob/Vercel variables and key rotation, marking each as configured or pending with evidence.
- [ ] Prepare a reviewable branch/draft PR if possible. Keep main/production untouched until the completed result is approved.
