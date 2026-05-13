/**
 * Normaliza chaves do título no catálogo: `album` / `"album"` → `titulo` / `"titulo"` em src/services/data.js.
 * Idempotente: pode correr várias vezes.
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
s = s.replace(/"album":/g, '"titulo":');
if (s === before) {
  console.log('No album: keys left to rename (already normalized).');
} else {
  writeFileSync(path, s);
  console.log('Renamed album keys → titulo in', path);
}
