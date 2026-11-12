# MIRU overseas iOS launch design

Approved scope: the user instructed us to fix the audit findings, confirmed an Apple developer account, chose overseas launch, and requires both diamond purchases and advertising. Retain the existing Web UI with a Capacitor iOS app, native Apple sign-in, StoreKit 2, and AdMob rewarded ads. Minimum iOS 15; exact bundle candidate com.miru.plus.app. Team ID and registered bundle remain user configuration. AdMob is not registered: only official Google test ads in development, never in Release.

## Boundaries
Work only in this isolated branch. Preserve existing Web/Android behavior and all miru.plus CORS origins. Preserve app100_fixes.js, app101_you.js and app100_dialogue.js in source/build.py. Use the real backend at https://www.miru.plus/api. No server keys enter the app. No merge, deployment or App Store submission until changes and external configuration are reviewable.

## Money
Make wallet balance updates, receipt deduplication, first-purchase bonus and order recording atomic. Duplicate requests must return the current balance, including after later spending. Never grant twice under parallel callbacks or retry after an interrupted write. Use server-issued, stable UUID appAccountToken for Apple account ownership. Validate signed transaction bundle, exact product, Consumable type, quantity, revocation and environment. Sandbox must not create production spending power: dedicated server-allowlisted test accounts are acceptable if they reject Production transactions and cannot influence public rankings with test money; other accounts reject Sandbox. Test orders are accurately marked. No fake purchase path outside development.

## Native bridge
window.MIRU_NATIVE provides platform='ios', configuration(), products({ids}), purchase({productId,appAccountToken}), pendingTransactions(), finish({transactionId}), signInWithApple({nonce}), showRewardedAd(), and privacyOptions(). All methods except platform return promises. Product returns productId/displayPrice; purchases return transactionId/jws/environment. Pending and cancelled purchases do not grant currency. Finish only after backend delivery. Unfinished transactions are retried after login. Display real localized StoreKit prices. Account sync restores consumable balances.

Apple auth uses POST /auth {op:'apple_challenge'} -> {nonce,challenge}; native or web Apple sign-in sends {op:'apple',idToken,authorizationCode,challenge,name}. The backend verifies a one-time expiring nonce and exchanges/encrypts provider refresh tokens. Account deletion revokes Apple authorization before removing binding and remains retryable on service failure. Never store raw refresh tokens in a public state response.

## Privacy and content
Disclose current AI providers and sent data before sending the first user input; require explicit consent; refusal permits non-AI browsing; settings support withdrawal. Guard dialogue, voice and image paths. No web AdSense initialization inside native iOS. AdMob uses UMP consent and real reward completion with no simulated reward fallback. Adult explicit content is excluded for the native client at feed and direct-work reads on the backend, independent of UI hiding. Keep report/block/contact flows. Update privacy text to actual providers and data retention.

Remove the committed local preset key and read LONGCAT_API_KEY from the environment. Never validate or print the old credential. Its provider-side revocation needs the account owner and remains external until verified.

## Build and evidence
Bundle the built UI, public legal pages and required media; exclude source, backend, saved browser states, backups and credentials. Make packaging deterministic and validate resource references. Include icon assets, Info.plist permissions, entitlements, SDK privacy manifests and StoreKit testing configuration. Release validation must reject missing Apple Team ID, test AdMob IDs and missing product/production configuration. Compile the actual simulator app and run relevant browser/self-tests. Signed archiving, real StoreKit and production ads need external account configuration and must not be falsely reported as complete.
