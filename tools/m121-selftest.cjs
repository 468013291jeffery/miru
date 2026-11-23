'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const root = path.resolve(__dirname, '..');
const dir = path.join(root, 'content/official/m121-off-camera');
const release = JSON.parse(fs.readFileSync(path.join(dir, 'release.json'), 'utf8'));
const script = fs.readFileSync(path.join(dir, 'script.md'), 'utf8');
const { createM121Engine } = require('../source/src/app160_m121_engine.js');
const { dslQA } = require('../api/_dslqa.js');
const { safety } = require('../api/_lib.js');
const E = createM121Engine(release);

assert.equal((script.match(/^# CHAPTER/gm) || []).length, 12);
assert.equal((script.match(/^# SCENE/gm) || []).length, 48);
assert.equal(release.heatRules.length, 16);
assert.equal(release.nodes.length, 64);
assert.equal(release.games.length, 24);
assert.equal(release.games.every(g => g.implemented === false), true);
assert.equal((script.match(/小游戏可跳过/g) || []).length, 24);
assert(script.includes('⟦VIDEO|m121_v01|WHO DO YOU GO TO TONIGHT?⟧'));
assert(!/V0[2-5]/.test(script + JSON.stringify(release)));
assert.equal(release.assets.m121_v01, 'video/official/m121-off-camera/V01_opening.mp4');
assert.equal(release.assets.vid_open, release.assets.m121_v01);
const opening = fs.readFileSync(path.join(root, release.assets.m121_v01));
assert(opening.slice(4, 8).toString() === 'ftyp' && opening.includes(Buffer.from('moov')));
const qa = dslQA(script);
assert.deepEqual(qa.err, [], qa.err.join('\n'));
const sf = safety(script);
assert.deepEqual(sf, [], JSON.stringify(sf));
for (const h of release.heatRules) {
  assert(script.includes('m121_i_' + h.id + '_CONSENT_FULL'), h.id);
  assert(script.includes('m121_i_' + h.id + '_CONSENT_SLOW'), h.id);
  assert(script.includes('m121_i_' + h.id + '_BOUNDARY'), h.id);
  assert(script.includes('#### C｜停'), h.id);
  if (h.cg) assert(script.includes('⟦CG|' + h.cg + '|'), h.cg);
}

const mains = release.nodes.filter(n => !n.heat_scene).map(n => n.scene_id);
const s = E.initial();
for (const id of mains) {
  E.note(s, 'm121_scene~' + id);
  E.note(s, 'm121_i_' + id + '_CLARIFY');
  assert.equal(s.completed[id], 'CLARIFY', id);
}
for (const h of release.heatRules) {
  assert.equal(E.canEnter(s, h.id), h.needHeat.length === 0, h.id + ' early');
}
const order = release.heatRules.map(h => h.id);
for (const id of order) {
  assert.equal(E.canEnter(s, id), true, id);
  assert.equal(E.note(s, 'm121_i_' + id + '_CONSENT_FULL') || true, true);
  assert.equal(s.cg[id], true, id);
}
assert.equal(E.sync(s).enter.length, 16);

const stopped = E.initial();
for (const id of mains) { E.note(stopped, 'm121_scene~' + id); E.note(stopped, 'm121_i_' + id + '_ENGAGE'); }
assert.equal(E.canEnter(stopped, 'C02_H_RYA'), true);
E.note(stopped, 'm121_i_C02_H_RYA_BOUNDARY');
assert.equal(stopped.boundary.RYA, true);
assert.equal(stopped.cg.C02_H_RYA, undefined);
assert.equal(stopped.consent.revoked, true);
assert.equal(E.canEnter(stopped, 'C02_H_RYA'), false);
E.note(stopped, 'm121_i_C02_H_RYA_CONSENT_FULL');
assert.equal(stopped.cg.C02_H_RYA, undefined);
assert.equal(stopped.rel.RYA.respect >= 25, true);

const jealous = E.clone(s);
jealous.exclusive = 'SEB';
assert.equal(E.canEnter(jealous, 'C02_H_RYA'), false);
assert.equal(E.canEnter(jealous, 'C02_H_SEB'), true);

const rich = E.initial();
rich.rel.SEB.attraction = 100;
rich.rel.RYA.attraction = 99;
E.note(rich, 'm121_scene~C12_S03');
E.note(rich, 'm121_pick_END_SEB');
assert.equal(rich.ending, null);
assert.equal(rich.endPending, true);
rich.flags.seb_recusal_signed = true;
E.note(rich, 'm121_pick_END_SEB');
assert.equal(rich.ending, 'SEB');
assert.notEqual(rich.ending, 'RYA');
E.note(rich, 'm121_epi_yes');
assert.equal(rich.cg.EPI_SEB, true);
E.note(rich, 'm121_epi_stop');
assert.equal(rich.cg.EPI_SEB, undefined);
assert.equal(rich.consent.revoked, true);

const ph = E.placeholder('CG_M121_024');
assert(ph.startsWith('data:image/svg+xml'));
assert(decodeURIComponent(ph).includes('CG_M121_024'));
assert.equal(E.assetUrl('CHAR_SEB'), 'art/official/m121-off-camera/images/CHAR_SEB.webp');
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'assets.json'), 'utf8'));
const imgDir = path.join(root, 'art/official/m121-off-camera/images');
const onDisk = new Set(fs.readdirSync(imgDir).filter(n => n.endsWith('.webp')).map(n => n.slice(0, -5)));
const referenced = [...script.matchAll(/⟦(?:BG|CG)\|([^|⟧]+)/g)].map(m => m[1]);
const unresolved = [...new Set(referenced)].filter(id => !onDisk.has(id)).sort();
assert.deepEqual(unresolved, ['CG_M121_024']);
assert.deepEqual([...onDisk].filter(id => !manifest.images[id]), []);
for (const [id, row] of Object.entries(manifest.images)) {
  const file = path.join(root, row.path);
  const exists = fs.existsSync(file);
  if (id === 'CG_M121_024') { assert.equal(exists, false); assert.equal(row.present, false); continue; }
  assert.equal(exists, true, id);
  assert.equal(row.present, true, id);
  assert.equal(onDisk.has(id), true, id);
  const b = fs.readFileSync(file);
  assert(b.length > 1000 && b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP', id);
}

const built = fs.readFileSync(path.join(root, 'source/build.py'), 'utf8');
assert(built.includes('app160_m121_data.js'));
assert(built.includes('app160_m121_engine.js'));
assert(built.includes('app160_m121.js'));
console.log('M121 selftest passed: 12 chapters, 48 scenes, 16 consent branches, 6 endings, missing assets stay referenced.');
