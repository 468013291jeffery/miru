import assert from 'node:assert/strict';import{spawnSync}from'node:child_process';import{validate}from'./ios-release-check.mjs';
const c={teamId:'H79A5X8935',bundleId:'com.miru.plus.app',appAppleId:'6834383803',adsEnabled:false,googleIOSClientId:'123-fixture.apps.googleusercontent.com',googleServerClientId:'123-server.apps.googleusercontent.com'};
assert.deepEqual(validate(c),[]);assert(validate({...c,adsEnabled:true}).length);assert(validate({...c,adsEnabled:undefined}).length);assert(validate({...c,appAppleId:''}).length);assert(validate({...c,googleIOSClientId:'placeholder'}).length);
const env={...process.env,CONFIGURATION:'Release',DEVELOPMENT_TEAM:c.teamId,PRODUCT_BUNDLE_IDENTIFIER:c.bundleId,MIRU_APP_APPLE_ID:c.appAppleId,MIRU_ADS_DISABLED:'YES',MIRU_GOOGLE_IOS_CLIENT_ID:c.googleIOSClientId,MIRU_GOOGLE_SERVER_CLIENT_ID:c.googleServerClientId,MIRU_GOOGLE_REVERSED_CLIENT_ID:'com.googleusercontent.apps.123-fixture'};
assert.equal(spawnSync('sh',['native/validate-release.sh'],{env}).status,0);
assert.notEqual(spawnSync('sh',['native/validate-release.sh'],{env:{...env,MIRU_ADS_DISABLED:'NO'}}).status,0);
assert.notEqual(spawnSync('sh',['native/validate-release.sh'],{env:{...env,SWIFT_ACTIVE_COMPILATION_CONDITIONS:'MIRU_ADS'}}).status,0);
console.log('PASS no-ad Release needs no AdMob identifiers and rejects advertising builds');
