import type { Chess, Move } from 'chess.js';
import { engine } from './engine';

export type Style = 'padrao' | 'agressivo' | 'posicional' | 'caotico' | 'humano';
export interface Level { id: string; name: string; elo: number | null; skill: number; depth: number; err: number }

export const LEVELS: Level[] = [
  { id: '400', name: 'Iniciante absoluto (400)', elo: null, skill: 0, depth: 1, err: 0.5 },
  { id: '800', name: 'Casual (800)', elo: null, skill: 3, depth: 3, err: 0.3 },
  { id: '1200', name: 'Intermediário (1200)', elo: null, skill: 8, depth: 6, err: 0.12 },
  { id: '1600', name: 'Clube (1600)', elo: 1600, skill: 20, depth: 12, err: 0.03 },
  { id: '2200', name: 'Mestre (2200)', elo: 2200, skill: 20, depth: 14, err: 0 },
  { id: '3000', name: 'Grão-mestre / Stockfish máximo (3000+)', elo: null, skill: 20, depth: 18, err: 0 },
];

export const STYLES: Record<Style, string> = {
  padrao: 'Padrão',
  agressivo: 'Agressivo',
  posicional: 'Posicional / sólido',
  caotico: 'Caótico',
  humano: 'Humano (simulado)',
};

const V: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Pontua um lance de acordo com a personalidade do bot. */
function flavor(m: Move, s: Style) {
  let x = 0;
  if (s === 'agressivo') {
    x += m.captured ? 2 + V[m.captured] : 0;
    x += m.san.endsWith('+') || m.san.endsWith('#') ? 4 : 0;
  }
  if (s === 'posicional') {
    x += ['d4', 'd5', 'e4', 'e5'].includes(m.to) ? 2 : 0;
    x += (m.piece === 'n' || m.piece === 'b') && m.from[1] === (m.color === 'w' ? '1' : '8') ? 2 : 0;
    x -= m.piece === 'q' ? 1 : 0;
  }
  return x;
}

/** Motor de reserva (sem Stockfish): prefere capturas, promoções e xeques. */
function simple(legal: Move[]) {
  const sc = (m: Move) => (m.captured ? V[m.captured] * 3 : 0) + (m.promotion ? 8 : 0) + (m.san.includes('+') ? 2 : 0) + Math.random();
  return legal.reduce((a, b) => (sc(b) > sc(a) ? b : a));
}

export async function botMove(g: Chess, lv: Level, st: Style): Promise<{ from: string; to: string; promotion?: string } | null> {
  const legal = g.moves({ verbose: true });
  if (!legal.length) return null;
  if (st === 'humano') await wait(500 + Math.random() * 1800);

  const err = lv.err + (st === 'caotico' ? 0.35 : 0) + (st === 'humano' ? 0.08 : 0);
  if (Math.random() < err) return pick(legal);

  const r = await engine.search(g.fen(), { depth: lv.depth, skill: lv.skill, elo: lv.elo });
  if (!r || r.move === '(none)') return simple(legal);

  if ((st === 'agressivo' || st === 'posicional') && Math.random() < 0.4) {
    const b = legal.reduce((a, c) => (flavor(c, st) > flavor(a, st) ? c : a));
    if (flavor(b, st) > 0) return b;
  }
  return { from: r.move.slice(0, 2), to: r.move.slice(2, 4), promotion: r.move[4] };
}
