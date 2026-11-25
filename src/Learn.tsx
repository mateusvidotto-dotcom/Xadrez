import { useState } from 'react';
import { Chess, type Move } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { MODULES, type Puzzle } from './curriculum';
import { sfx } from './sounds';
import { btn, boardColors } from './ui';

function Trainer({ p, id }: { p: Puzzle; id: string }) {
  const [fen, setFen] = useState(p.fen);
  const [msg, setMsg] = useState(p.goal);
  const [done, setDone] = useState(false);

  const drop = (from: string, to: string) => {
    if (done) return false;
    const g = new Chess(fen);
    let m: Move;
    try {
      m = g.move({ from, to, promotion: 'q' });
    } catch {
      return false;
    }
    const good = p.mate ? g.isCheckmate() : !!p.ok?.includes(m.san);
    if (!good) {
      setMsg('Esse não é o lance. Tente de novo.');
      return false;
    }
    sfx.end();
    setFen(g.fen());
    setDone(true);
    setMsg('Correto!');
    return true;
  };

  return (
    <div className="grid items-start gap-4 md:grid-cols-[minmax(0,420px)_1fr]">
      <Chessboard
        options={{
          id,
          position: fen,
          allowDragging: !done,
          ...boardColors,
          onPieceDrop: ({ sourceSquare, targetSquare }) => !!targetSquare && drop(sourceSquare, targetSquare),
        }}
      />
      <div className="flex flex-col gap-3">
        <p aria-live="polite">{msg}</p>
        <div className="flex gap-2">
          <button className={btn} onClick={() => setMsg(`Dica: ${p.hint}`)}>Dica</button>
          <button className={btn} onClick={() => { setFen(p.fen); setMsg(p.goal); setDone(false); }}>Reiniciar</button>
        </div>
      </div>
    </div>
  );
}

export default function Learn() {
  return (
    <div className="flex flex-col gap-12">
      {MODULES.map((mod, mi) => (
        <section key={mod.title} className="flex flex-col gap-4">
          <header>
            <h2 className="font-serif text-3xl font-semibold">{mod.title}</h2>
            <p className="text-paper/60">{mod.desc}</p>
          </header>
          {mod.lessons.map((lesson, li) => (
            <article key={lesson.title} className="flex flex-col gap-4 rounded-xl border border-line bg-panel p-5">
              <h3 className="font-serif text-xl font-semibold">{lesson.title}</h3>
              <p className="max-w-prose font-serif text-lg leading-relaxed text-paper/85">{lesson.text}</p>
              {lesson.puzzles.map((p, pi) => (
                <Trainer key={p.fen} p={p} id={`puzzle-${mi}-${li}-${pi}`} />
              ))}
            </article>
          ))}
        </section>
      ))}
    </div>
  );
}
