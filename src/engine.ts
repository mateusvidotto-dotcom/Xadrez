export interface Eval { move: string; cp?: number; mate?: number; pv: string[] }
export interface Cfg { depth?: number; skill?: number; elo?: number | null }

class Engine {
  private w?: Worker;
  private ls = new Set<(l: string) => void>();
  private q: Promise<unknown> = Promise.resolve();
  /** true quando o Stockfish carregou; false ativa o motor simples. */
  ok: Promise<boolean> = this.boot();

  private async boot() {
    try {
      const base = import.meta.env.BASE_URL;
      const { file } = await (await fetch(`${base}engine/engine.json`)).json();
      this.w = new Worker(`${base}engine/${file}`);
      this.w.onmessage = (e) => this.ls.forEach((f) => f(String(e.data)));
      this.send('uci');
      await this.wait((l) => l === 'uciok');
      this.send('isready');
      await this.wait((l) => l === 'readyok');
      return true;
    } catch {
      return false;
    }
  }

  private send(c: string) { this.w?.postMessage(c); }

  private wait(test: (l: string) => boolean, ms = 10000) {
    return new Promise<string>((res, rej) => {
      const t = setTimeout(() => { this.ls.delete(f); rej(new Error('timeout')); }, ms);
      const f = (l: string) => { if (test(l)) { clearTimeout(t); this.ls.delete(f); res(l); } };
      this.ls.add(f);
    });
  }

  search(fen: string, c: Cfg = {}): Promise<Eval | null> {
    const run = this.q.then(() => this.run(fen, c));
    this.q = run.catch(() => undefined);
    return run.catch(() => null);
  }

  private async run(fen: string, c: Cfg): Promise<Eval> {
    if (!(await this.ok)) throw new Error('sem motor');
    this.send(`setoption name UCI_LimitStrength value ${c.elo ? 'true' : 'false'}`);
    if (c.elo) this.send(`setoption name UCI_Elo value ${c.elo}`);
    this.send(`setoption name Skill Level value ${c.skill ?? 20}`);
    this.send(`position fen ${fen}`);
    this.send(`go depth ${c.depth ?? 12}`);

    let cp: number | undefined;
    let mate: number | undefined;
    let pv: string[] = [];
    const info = (l: string) => {
      const m = l.match(/score (cp|mate) (-?\d+)/);
      if (!l.startsWith('info') || !m) return;
      cp = m[1] === 'cp' ? Number(m[2]) : undefined;
      mate = m[1] === 'mate' ? Number(m[2]) : undefined;
      pv = (l.match(/ pv (.+)$/)?.[1] ?? '').split(' ').filter(Boolean);
    };
    this.ls.add(info);
    try {
      const best = await this.wait((l) => l.startsWith('bestmove'), 30000);
      return { move: best.split(' ')[1], cp, mate, pv };
    } catch (e) {
      this.send('stop');
      throw e;
    } finally {
      this.ls.delete(info);
    }
  }
}

export const engine = new Engine();
