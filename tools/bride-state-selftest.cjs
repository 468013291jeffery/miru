const fs=require('fs'),assert=require('assert/strict'),crypto=require('crypto');
const R=JSON.parse(fs.readFileSync('content/official/brides-reckoning-v1/release.json')),E=require('../source/src/app161_bride_state.js')(R);
let s=E.initial();assert.equal(E.apply(s,'allow_veil').issue.includes('邀请'),true);assert.equal(E.apply(s,'risk_ack').state.riskAcknowledged,false);
s.scene='SCN_1404';let x=E.apply(s,'allow_veil');assert(x.state.consent.veil);assert(!x.state.faceShown);E.commit(x.state,x.event);assert(x.state.faceShown);s=E.apply(x.state,'decline_veil').state;assert(!s.consent.veil);
s.scene='SCN_1504';s.methodFinal='witness';s.noInnocents=true;for(const key of ['lock_record','register_false','location'])s.evidence[key]={verified:true};s.evidence.lock_record.verified=false;assert(E.apply(s,'perform_witness').issue);s.evidence.lock_record.verified=true;x=E.apply(s,'perform_witness');assert.equal(x.state.resolution,null);E.commit(x.state,'gate');assert.equal(x.state.resolution,null);E.commit(x.state,'witness');assert.equal(x.state.bell,13);E.commit(x.state,'witness');assert.equal(x.state.bell,13);
s=E.initial();s.scene='SCN_0204';assert(E.apply(s,'safe_place').issue);assert(!E.apply(s,'safe_place').state.goals[2]);
const saved=JSON.stringify(s);assert.equal(JSON.stringify(E.apply(s,'unknown').state),saved);for(const chapter of R.chapters)assert.equal(new Set(chapter.scenes.map(s=>s.id)).size,4);
const md=fs.readFileSync('content/official/brides-reckoning-v1/script.md','utf8');assert(require('../api/_dslqa').dslQA(md).ok);assert.equal(R.cast.length,6);assert(R.cast.every(c=>!c.romanceable));
for(const f of JSON.parse(fs.readFileSync('content/official/brides-reckoning-v1/media-hashes.json'))){const b=fs.readFileSync(f.path);assert.equal(crypto.createHash('sha256').update(b).digest('hex'),f.sha256);}
for(const c of R.chapters)for(const s of c.scenes){assert(R.assets[s.bg]);assert(s.baseline.every(l=>!/^隐藏分支|^回应空间|^CHO_|^作者卡|若已承认/.test(l)));}
console.log('Bride provenance, verified prerequisites, permission revocation, terminal event receipts, 68 image hashes, DSL and unchanged scene IDs passed.');
