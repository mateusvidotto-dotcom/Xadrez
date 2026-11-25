export const btn =
  'rounded-lg border border-line bg-panel px-3 py-2 text-sm transition hover:border-brass disabled:opacity-40';
export const tab = (on: boolean) =>
  `rounded-lg px-4 py-2 text-sm font-medium transition ${on ? 'bg-brass text-ink' : 'border border-line bg-panel hover:border-brass'}`;
export const boardColors = {
  lightSquareStyle: { backgroundColor: '#e6d5b1' },
  darkSquareStyle: { backgroundColor: '#9b7a55' },
};
