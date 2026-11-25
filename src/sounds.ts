let ctx: AudioContext | undefined;

function beep(f: number, d: number, type: OscillatorType = 'sine', v = 0.12, at = 0) {
  try {
    ctx ??= new AudioContext();
    void ctx.resume();
    const s = ctx.currentTime + at;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = f;
    g.gain.setValueAtTime(v, s);
    g.gain.exponentialRampToValueAtTime(0.0001, s + d);
    o.connect(g).connect(ctx.destination);
    o.start(s);
    o.stop(s + d);
  } catch {
    /* áudio indisponível */
  }
}

export const sfx = {
  move: () => beep(520, 0.08, 'triangle'),
  capture: () => beep(180, 0.13, 'sawtooth', 0.15),
  check: () => { beep(880, 0.12); beep(660, 0.18, 'sine', 0.12, 0.12); },
  end: () => { beep(330, 0.2); beep(260, 0.35, 'sine', 0.12, 0.2); },
};

export const playFor = (m: { captured?: string; san: string }) =>
  m.san.includes('#') ? sfx.end() : m.san.includes('+') ? sfx.check() : m.captured ? sfx.capture() : sfx.move();
