import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';import{fileURLToPath}from'node:url';
const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function validate(c){
 const errors=[];
 if(c.teamId!=='H79A5X8935')errors.push('Confirmed Apple Team ID is required');
 if(c.bundleId!=='com.miru.plus.app')errors.push('Confirmed Bundle ID is required');
 if(!/^[1-9][0-9]+$/.test(String(c.appAppleId||'')))errors.push('Numeric App Store Apple ID is missing');
 for(const k of ['googleIOSClientId','googleServerClientId'])if(!/^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$/.test(c[k]||''))errors.push(k+' is missing or invalid');
 if(c.adsEnabled!==false)errors.push('First iOS release must disable advertising');
 return errors;
}
export async function configure(root=ROOT){
 const c=JSON.parse(await readFile(path.join(root,'native/ios-release.public.json'),'utf8'));
 const values={MIRU_GOOGLE_IOS_CLIENT_ID:c.googleIOSClientId||'',MIRU_GOOGLE_SERVER_CLIENT_ID:c.googleServerClientId||'',MIRU_GOOGLE_REVERSED_CLIENT_ID:c.googleIOSClientId?c.googleIOSClientId.split('.').reverse().join('.'):'',MIRU_APP_APPLE_ID:String(c.appAppleId||''),MIRU_ADS_DISABLED:c.adsEnabled===false?'YES':'NO'};
 for(const v of Object.values(values))if(!/^[a-zA-Z0-9_.~\/-]*$/.test(v))throw new Error('Invalid public configuration characters');
 await writeFile(path.join(root,'native/ios/release.public.xcconfig'),Object.entries(values).map(([k,v])=>k+' = '+v).join('\n')+'\n');
 return c;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const c=await configure();
 if(process.argv.includes('--check')){const errors=validate(c);if(errors.length){console.error(errors.join('\n'));process.exitCode=1}else console.log('Production public configuration validated')}
 else console.log('Configured public iOS identifiers');
}
