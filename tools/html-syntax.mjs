// Extract inline <script> blocks from a single-file HTML page and syntax-check each one.
//   node tools/html-syntax.mjs admin.html
// Prints one line per block: size + OK/FAIL. Exit 1 if any block fails to parse.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';

const file = process.argv[2];
if (!file) { console.error('usage: node tools/html-syntax.mjs <file.html>'); process.exit(2); }
const html = fs.readFileSync(file, 'utf8');
const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let m, i = 0, bad = 0, checked = 0;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'htmlsyn-'));
while ((m = re.exec(html))) {
  const attrs = m[1] || '', body = m[2] || '';
  if (/\bsrc\s*=/.test(attrs)) continue;          // external: nothing to parse here
  const type = (attrs.match(/\btype\s*=\s*["']([^"']+)["']/i) || [])[1];
  if (type && !/^(module|text\/javascript|application\/javascript)$/i.test(type)) continue; // x-template etc.
  if (!body.trim()) continue;
  i++;
  const p = path.join(tmp, 'block' + i + '.mjs');
  fs.writeFileSync(p, body, 'utf8');
  try {
    execFileSync(process.execPath, ['--check', p], { stdio: 'pipe' });
    checked++;
    console.log(`  block ${i}: ${body.length} chars  OK`);
  } catch (e) {
    bad++;
    const msg = String(e.stderr || e.message).split('\n').slice(0, 6).join('\n');
    console.log(`  block ${i}: ${body.length} chars  FAIL\n${msg}`);
  }
}
console.log(`${checked} block(s) parsed, ${bad} failed`);
process.exit(bad ? 1 : 0);
