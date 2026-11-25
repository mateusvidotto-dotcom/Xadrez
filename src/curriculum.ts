export interface Puzzle { fen: string; goal: string; hint: string; ok?: string[]; mate?: boolean }
export interface Lesson { title: string; text: string; puzzles: Puzzle[] }
export interface Module { title: string; desc: string; lessons: Lesson[] }

export const MODULES: Module[] = [
  {
    title: 'Módulo 1: Zero',
    desc: 'Tabuleiro, peças, xeque e regras especiais.',
    lessons: [
      {
        title: 'Como as peças se movem',
        text: 'Torre: em linha reta. Bispo: na diagonal. Dama: torre e bispo juntos. Rei: uma casa em qualquer direção. Cavalo: em "L", e é o único que pula peças. Peão: avança uma casa (duas no primeiro lance) e captura na diagonal. Regras especiais: roque (rei e torre trocam de lugar se ainda não se moveram, o caminho está livre e o rei não passa por casa atacada), en passant (captura de um peão que acabou de avançar duas casas) e promoção (peão na última fileira vira outra peça).',
        puzzles: [],
      },
      {
        title: 'Xeque e xeque-mate',
        text: 'Xeque é a ameaça direta ao rei. Xeque-mate é quando ele não pode escapar, capturar a peça que ataca nem se proteger. Aqui o rei preto está preso atrás dos próprios peões.',
        puzzles: [{ fen: '6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1', goal: 'As brancas jogam e dão xeque-mate.', hint: 'A torre pode chegar à oitava fileira.', mate: true }],
      },
      {
        title: 'Promoção do peão',
        text: 'Ao chegar à última fileira, o peão vira outra peça, quase sempre uma dama.',
        puzzles: [{ fen: '8/4P3/8/8/8/8/k7/4K3 w - - 0 1', goal: 'Promova o peão.', hint: 'Avance o peão da coluna e.', ok: ['e8=Q', 'e8=Q+'] }],
      },
    ],
  },
  {
    title: 'Módulo 2: Iniciante',
    desc: 'Valor das peças, mates básicos e princípios de abertura.',
    lessons: [
      {
        title: 'Valor das peças',
        text: 'Peão vale 1, cavalo e bispo 3, torre 5, dama 9. Antes de capturar, confira se a peça está protegida.',
        puzzles: [{ fen: '4k3/8/8/3q4/8/8/8/3QK3 w - - 0 1', goal: 'Capture a dama preta, que está sem proteção.', hint: 'As duas damas estão na mesma coluna.', ok: ['Qxd5'] }],
      },
      {
        title: 'Mate com duas torres',
        text: 'Uma torre corta o rei numa fileira e a outra dá o xeque na fileira seguinte.',
        puzzles: [{ fen: '7k/1R6/8/8/8/8/8/R3K3 w - - 0 1', goal: 'As brancas dão mate em 1.', hint: 'A torre de a1 sobe até a oitava fileira.', mate: true }],
      },
      {
        title: 'Princípios de abertura',
        text: 'Controle o centro com peões, desenvolva cavalos e bispos, faça o roque cedo e não mova a dama muito cedo.',
        puzzles: [],
      },
    ],
  },
  {
    title: 'Módulo 3: Intermediário',
    desc: 'Garfo, cravada, espeto e ataque descoberto.',
    lessons: [
      {
        title: 'Garfo',
        text: 'Um único lance ataca duas peças ao mesmo tempo. O cavalo é o mestre do garfo.',
        puzzles: [{ fen: 'r3k3/8/8/3N4/8/8/8/4K3 w - - 0 1', goal: 'Ataque o rei e a torre ao mesmo tempo.', hint: 'Existe uma casa de onde o cavalo vê e8 e a8.', ok: ['Nc7+'] }],
      },
      {
        title: 'Cravada, espeto e ataque descoberto',
        text: 'Cravada: a peça atacada não pode sair porque expõe outra mais valiosa. Espeto: a peça valiosa é forçada a sair e revela a peça atrás dela. Ataque descoberto: ao mover uma peça, você libera o ataque de outra.',
        puzzles: [],
      },
    ],
  },
  {
    title: 'Módulo 4: Avançado',
    desc: 'Estratégia, estrutura de peões, finais teóricos e aberturas.',
    lessons: [
      {
        title: 'Mate de dama e rei',
        text: 'O rei fica perto para proteger a dama. Atenção ao afogamento: não deixe o rei adversário sem lances quando ele não está em xeque.',
        puzzles: [{ fen: '7k/5Q2/6K1/8/8/8/8/8 w - - 0 1', goal: 'As brancas dão xeque-mate.', hint: 'A dama precisa dar xeque protegida pelo rei.', mate: true }],
      },
      {
        title: 'Finais: oposição e regra do quadrado',
        text: 'Oposição: os reis ficam frente a frente com uma casa entre eles, e quem NÃO tem o lance cede terreno. Regra do quadrado: desenhe um quadrado da casa do peão até a última fileira; se o rei adversário entra nele, alcança o peão.',
        puzzles: [],
      },
      {
        title: 'Estratégia e aberturas famosas',
        text: 'Peões dobrados e isolados são fraquezas; peões passados e casas fortes para cavalos são trunfos. Aberturas para estudar: Italiana (1.e4 e5 2.Cf3 Cc6 3.Bc4), Ruy Lopez (3.Bb5), Siciliana (1.e4 c5), Gambito da Dama (1.d4 d5 2.c4) e Índia do Rei (1.d4 Cf6 2.c4 g6).',
        puzzles: [],
      },
    ],
  },
];
