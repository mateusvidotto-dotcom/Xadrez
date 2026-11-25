import { useEffect, useReducer, useState, type CSSProperties } from 'react';
import { Chess, type Move, type Square } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { engine } from './engine';
import { botMove, type Level, type Style } from './bots';
import { playFor } from './sounds';
import { btn, boardColors } from './ui';

export type Mode =
  | { kind: 'bot'; level: Level; style: Style; color: 'w' | 'b' }
  | { kind: 'free'; flip: boolean; evalBar: boolean };

const uci = (u: string) => ({ from: u.slice(0, 2), to: u.slice(2, 4), promotion: u[4] });

/** Converte uma linha UCI do motor em lances SAN legíveis. */
function line(fen: string, pv: string[]) {
  const g = new Chess(fen);
  const out: string[] = [];
  for (const u of pv.slice(0, 6)) {
    try { out.push(g.move(uci(u)).san); } catch { break; }
  }
  return out.join(' ');
}

export default function GameBoard({ mode }: { mode: Mode }) {
  const [game] = useState(() => new Chess());
  const [, bump] = useReducer((n: number) => n + 1, 0);
  const [view, setView] = useState<number | null>(null);
  const [sel, setSel] = useState<Square | null>(null);
  const [hint, setHint] = useState<[string, string] | null>(null);
  const [ev, setEv] = useState({ cp: 0, label: '0.0', best: '' });
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');

  const moves = game.history({ verbose: true });
  const fens = [new Chess().fen(), ...moves.map((m) => m.after)];
  const live = fens.length - 1;
  const idx = view ?? live;
  const isLive = idx === live;
  const fen = fens[idx];
  const turn = fen.split(' ')[1];
  const over = game.isGameOver();
  const mine = mode.kind === 'free' || game.turn() === mode.color;
  const orient = mode.kind === 'bot' ? (mode.color === 'w' ? 'white' : 'black') : mode.flip && turn === 'b' ? 'black' : 'white';

  const reply = async () => {
    if (mode.kind !== 'bot') return;
    setBusy(true);
    const before = game.fen();
    const mv = await botMove(game, mode.level, mode.style);
    setBusy(false);
    if (!mv || game.fen() !== before) return;
    playFor(game.move(mv));
    bump();
  };

  // Se o jogador escolheu as pretas, o bot abre a partida.
  useEffect(() => {
    if (mode.kind === 'bot' && mode.color === 'b') void reply();
  }, []);

  // Barra de avaliação do modo livre.
  const showEval = mode.kind === 'free' && mode.evalBar;
  useEffect(() => {
    if (!showEval) return;
    let dead = false;
    void engine.search(fen, { depth: 12 }).then((r) => {
      if (dead || !r) return;
      const cp = (r.mate !== undefined ? Math.sign(r.mate) * 10000 : (r.cp ?? 0)) * (turn === 'w' ? 1 : -1);
      const label = r.mate !== undefined ? `${cp < 0 ? '-' : ''}M${Math.abs(r.mate)}` : `${cp > 0 ? '+' : ''}${(cp / 100).toFixed(1)}`;
      setEv({ cp, label, best: line(fen, r.pv) });
    });
    return () => { dead = true; };
  }, [fen, showEval]);

  const tryMove = (from: string, to: string) => {
    if (!isLive || busy || over || !mine) return false;
    let m: Move;
    try {
      m = game.move({ from, to, promotion: 'q' }); // promoção automática para dama
    } catch {
      return false;
    }
    playFor(m);
    setHint(null);
    setSel(null);
    bump();
    if (mode.kind === 'bot' && !game.isGameOver()) void reply();
    return true;
  };

  const click = ({ square }: { square: string }) => {
    if (sel && tryMove(sel, square)) return;
    const p = game.get(square as Square);
    setSel(p && p.color === game.turn() && isLive && mine ? (square as Square) : null);
  };

  const undo = () => {
    if (busy || !moves.length) return;
    game.undo();
    if (mode.kind === 'bot' && game.turn() !== mode.color && game.history().length) game.undo();
    setHint(null);
    setSel(null);
    setView(null);
    bump();
    if (mode.kind === 'bot' && game.turn() !== mode.color && !game.isGameOver()) void reply();
  };

  const ask = async () => {
    if (!isLive || over || busy) return;
    const r = await engine.search(game.fen(), { depth: 14 });
    if (r && r.move !== '(none)') setHint([r.move.slice(0, 2), r.move.slice(2, 4)]);
    else flash('Dica indisponível: Stockfish não encontrado.');
  };

  const flash = (t: string) => { setToast(t); setTimeout(() => setToast(''), 1800); };
  const copy = (t: string) => navigator.clipboard.writeText(t).then(() => flash('Copiado!'));

  const styles: Record<string, CSSProperties> = {};
  const last = moves[idx - 1];
  if (last) for (const s of [last.from, last.to]) styles[s] = { background: 'rgba(224,165,58,.35)' };
  if (sel && isLive) {
    styles[sel] = { background: 'rgba(224,165,58,.65)' };
    for (const m of game.moves({ square: sel, verbose: true })) {
      styles[m.to] = { background: 'radial-gradient(circle, rgba(0,0,0,.35) 22%, transparent 24%)' };
    }
  }

  const status = game.isCheckmate()
    ? `Xeque-mate! ${game.turn() === 'w' ? 'Pretas' : 'Brancas'} venceram.`
    : game.isDraw() ? 'Empate.'
    : busy ? 'Bot pensando…'
    : `${game.inCheck() ? 'Xeque! ' : ''}${mode.kind === 'free' ? (game.turn() === 'w' ? 'Vez das brancas' : 'Vez das pretas') : mine ? 'Sua vez' : 'Vez do bot'}`;

  const pairs: string[][] = [];
  moves.forEach((m, i) => (i % 2 ? pairs[pairs.length - 1].push(m.san) : pairs.push([m.san])));

  const size = 'min(92vw,560px)';
  const white = 100 / (1 + Math.exp(-ev.cp / 400));

  return (
    <div className="grid justify-center gap-6 lg:grid-cols-[auto_320px]">
      <div className="flex gap-3">
        {showEval && (
          <div className="flex w-5 flex-col-reverse overflow-hidden rounded bg-ink ring-1 ring-line" style={{ height: size }} title={ev.label}>
            <div className="bg-paper transition-all duration-300" style={{ height: `${white}%` }} />
          </div>
        )}
        <div style={{ width: size }}>
          <Chessboard
            options={{
              id: 'main',
              position: fen,
              boardOrientation: orient,
              allowDragging: isLive && mine && !busy && !over,
              animationDurationInMs: 200,
              squareStyles: styles,
              arrows: hint && isLive ? [{ startSquare: hint[0], endSquare: hint[1], color: '#e0a53a' }] : [],
              ...boardColors,
              onPieceDrop: ({ sourceSquare, targetSquare }) => !!targetSquare && tryMove(sourceSquare, targetSquare),
              onSquareClick: click,
            }}
          />
        </div>
      </div>

      <aside className="flex flex-col gap-3">
        <p className="font-serif text-2xl font-semibold" aria-live="polite">{status}</p>
        {showEval && (
          <p className="text-sm text-paper/70">
            Avaliação: <b className="text-paper">{ev.label}</b>
            {ev.best && <> | melhor linha: {ev.best}</>}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <button className={btn} onClick={undo} disabled={busy || !moves.length}>Desfazer</button>
          <button className={btn} onClick={ask} disabled={!isLive || over || busy}>Dica</button>
          <button className={btn} onClick={() => copy(game.pgn())}>Copiar PGN</button>
          <button className={btn} onClick={() => copy(fen)}>Copiar FEN</button>
        </div>
        {toast && <p className="text-sm text-brass" role="status">{toast}</p>}
        <div className="flex gap-2">
          <button className={btn} onClick={() => setView(Math.max(0, idx - 1))} disabled={idx === 0} aria-label="Lance anterior">←</button>
          <button className={btn} onClick={() => setView(idx + 1 >= live ? null : idx + 1)} disabled={isLive} aria-label="Próximo lance">→</button>
        </div>
        <div className="max-h-72 overflow-y-auto rounded-xl border border-line bg-panel p-3 font-mono text-sm">
          {!pairs.length && <span className="text-paper/50">Nenhum lance ainda.</span>}
          {pairs.map((p, i) => (
            <div key={i} className="flex gap-2">
              <span className="w-8 text-paper/50">{i + 1}.</span>
              {p.map((san, j) => {
                const ply = i * 2 + j + 1;
                return (
                  <button key={ply} onClick={() => setView(ply >= live ? null : ply)} className={`rounded px-1 hover:bg-line ${idx === ply ? 'bg-line' : ''}`}>
                    {san}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
