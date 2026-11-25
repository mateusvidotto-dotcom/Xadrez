import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const root = 'node_modules/stockfish';
const out = 'public/engine';
const walk = (d) =>
  readdirSync(d).flatMap((f) => {
    const p = join(d, f);
    return statSync(p).isDirectory() ? (f === 'node_modules' ? [] : walk(p)) : [p];
  });

if (!existsSync(root)) {
  console.warn('[engine] pacote stockfish não encontrado; o app usará o motor simples.');
  process.exit(0);
}

const files = walk(root);
const score = (n) => (n.includes('lite') ? 4 : 0) + (n.includes('single') ? 2 : 0) - (n.includes('asm') ? 1 : 0);
const best = files
  .filter((p) => p.endsWith('.js') && /stockfish/i.test(basename(p)) && !/worker|node|test|index|loader|example/i.test(basename(p)))
  .filter((p) => files.includes(p.replace(/\.js$/, '.wasm')) || /asm/.test(basename(p)))
  .sort((a, b) => score(basename(b)) - score(basename(a)))[0];

if (!best) {
  console.warn('[engine] nenhum build do Stockfish encontrado; o app usará o motor simples.');
  process.exit(0);
}

mkdirSync(out, { recursive: true });
const stem = best.replace(/\.js$/, '');
for (const f of files.filter((f) => f.startsWith(stem))) cpSync(f, join(out, basename(f)));
writeFileSync(join(out, 'engine.json'), JSON.stringify({ file: basename(best) }));
console.log('[engine] usando', basename(best));
