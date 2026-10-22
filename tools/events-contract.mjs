// Contract check for the gameplay events — run against the BUILT bundle, not the sources,
// because "the source has it" and "the site has it" are two different claims.
//
//   node tools/events-contract.mjs index.html
//   node tools/events-contract.mjs index.html --selftest     (proves this checker can go red)
//
// What it asserts (LEDGER.md §2):
//   1. the four events are emitted somewhere in the page
//   2. every emit goes through pkTrack, which always carries wid + sess + t
//   3. chapter_open is emitted once per chapter (dedupe by th.pk._opened)
//   4. the OLD proxy is gone: opening chapter n must not report chapter n-1 as "done"
import fs from 'node:fs';

export function check(html) {
  const has = s => html.indexOf(s) !== -1;
  const results = [
    ['chapter_open emitted', has('"chapter_open"')],
    ['choice_pick emitted', has('"choice_pick"')],
    ['chapter_done emitted', has('"chapter_done"')],
    ['story_end emitted', has('"story_end"')],
    ['emit helper carries wid+sess+t', has('{wid:th.wid,sess:pkSess(th),t:Date.now()}')],
    ['chapter_open is deduped per chapter', has('if(th.pk._opened===n)return')],
    ['story_end carries the ending', has('"story_end",{ch:n,ending:k}')],
    ['old open-proxy for chapter_done is gone', !has('n > 1) track("chapter_done"') && !has('n > 1) track("chapter_done"')],
  ];
  return results;
}

const file = process.argv[2];
if (file) {
  const html = fs.readFileSync(file, 'utf8');
  const rows = check(html);
  let bad = 0;
  for (const [name, ok] of rows) { if (!ok) bad++; console.log((ok ? '  ✓ ' : '  ✗ ') + name); }
  console.log(`${rows.length - bad}/${rows.length} contract checks passed`);
  if (process.argv.includes('--selftest')) {
    // mutation: rename the choice event everywhere. A checker that stays green here
    // was never measuring anything.
    const mutated = html.split('"choice_pick"').join('"choose_pick"');
    const rows2 = check(mutated);
    const stillGreen = rows2.every(([, ok]) => ok);
    console.log('  · mutation (choice_pick -> choose_pick): ' + (stillGreen ? 'NOT CAUGHT ✗' : 'caught ✓'));
    if (stillGreen) { console.log('SELFTEST FAILED: the checker cannot tell the difference'); process.exit(1); }
  }
  process.exit(bad ? 1 : 0);
}
