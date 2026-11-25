import { useEffect, useMemo, useState } from 'react';
import GameBoard, { type Mode } from './GameBoard';
import Learn from './Learn';
import { engine } from './engine';
import { LEVELS, STYLES, type Style } from './bots';
import { btn, tab } from './ui';

type Tab = 'bot' | 'free' | 'learn';

export default function App() {
  const [current, setCurrent] = useState<Tab>('bot');
  const [levelId, setLevelId] = useState('800');
  const [style, setStyle] = useState<Style>('padrao');
  const [color, setColor] = useState<'w' | 'b'>('w');
  const [flip, setFlip] = useState(false);
  const [evalBar, setEvalBar] = useState(true);
  const [game, setGame] = useState(0);
  const [sf, setSf] = useState<boolean | null>(null);

  useEffect(() => { void engine.ok.then(setSf); }, []);

  const level = LEVELS.find((l) => l.id === levelId)!;
  const mode: Mode = useMemo(
    () => (current === 'free' ? { kind: 'free', flip, evalBar } : { kind: 'bot', level, style, color }),
    [current, flip, evalBar, level, style, color],
  );

  return (
    <div className="min-h-dvh p-4 md:p-8">
      <header className="mx-auto mb-6 flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold">Chess Coach</h1>
        <nav className="flex gap-2">
          {([['bot', 'Contra o bot'], ['free', 'Livre e análise'], ['learn', 'Aprender']] as const).map(([t, label]) => (
            <button key={t} className={tab(current === t)} onClick={() => setCurrent(t)}>{label}</button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl">
        {sf === false && (
          <p className="mb-4 rounded-lg border border-brass/40 bg-panel p-3 text-sm">
            Stockfish não encontrado em <code>public/engine</code>. O app usa um motor simples; rode <code>npm run engine</code> e recarregue a página.
          </p>
        )}

        {current !== 'learn' && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {current === 'bot' ? (
              <>
                <select className={btn} aria-label="Nível" value={levelId} onChange={(e) => setLevelId(e.target.value)}>
                  {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
                <select className={btn} aria-label="Estilo" value={style} onChange={(e) => setStyle(e.target.value as Style)}>
                  {Object.entries(STYLES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <button className={btn} onClick={() => setColor((c) => (c === 'w' ? 'b' : 'w'))}>
                  Jogando de {color === 'w' ? 'brancas' : 'pretas'}
                </button>
              </>
            ) : (
              <>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={flip} onChange={(e) => setFlip(e.target.checked)} />
                  Girar o tabuleiro a cada lance
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={evalBar} onChange={(e) => setEvalBar(e.target.checked)} />
                  Barra de avaliação
                </label>
              </>
            )}
            <button className={btn} onClick={() => setGame((n) => n + 1)}>Nova partida</button>
          </div>
        )}

        {current === 'learn' ? (
          <Learn />
        ) : (
          <GameBoard key={`${current}-${game}-${current === 'bot' ? levelId + style + color : ''}`} mode={mode} />
        )}
      </main>
    </div>
  );
}
