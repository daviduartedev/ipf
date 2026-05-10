/**
 * One-off: replace object key `album` with `titulo` in src/services/data.js RAW_DB_DATA.
 * Run from repo root: node scripts/rename-album-to-titulo-in-data.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const path = join(__dirname, '..', 'src', 'services', 'data.js');
let s = readFileSync(path, 'utf8');
const before = s;
s = s.replace(/(\{\s*)album\s*:/g, '$1titulo:');
if (s === before) {
  console.error('No replacements made; check file format.');
  process.exit(1);
}
writeFileSync(path, s);
console.log('Updated album: keys to titulo: in', path);
