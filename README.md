# Chess Coach

Treinador de xadrez em português, feito com React, TypeScript e Vite. Jogue contra bots de diferentes níveis e estilos, analise posições e pratique em uma trilha progressiva de lições e exercícios.

## Recursos

- Partidas contra bots e cinco estilos de adversário.
- Modo livre para jogar dos dois lados, navegar pelo histórico e analisar posições.
- Sugestão de lances, avaliação, PGN e FEN.
- Trilha de aprendizagem com lições e exercícios.
- Stockfish executado em Web Worker, com motor simples de reserva.

## Executar localmente

Requer Node.js 22.12+ (ou 20.19+).

```bash
npm install
npm run dev
```

Validar e compilar:

```bash
npm run typecheck
npm run build
npm run preview
```

O `postinstall` localiza o build single-thread do Stockfish e o copia para `public/engine`. Se o motor não estiver disponível, o aplicativo usa uma alternativa simplificada.

## GitHub Pages

O projeto é publicado em:

https://mateusvidotto-dotcom.github.io/Xadrez/

O workflow `.github/workflows/deploy.yml` instala as dependências, verifica os tipos e compila com a base `/Xadrez/`. Em seguida, transforma o HTML de entrada em `index.html` e sincroniza os arquivos compilados com a raiz do branch `main`, origem atualmente utilizada pelo GitHub Pages.

**Importante:** `src/site-template.html` é a entrada HTML do Vite. O `index.html` da raiz é saída gerada e não deve ser editado manualmente. Faça alterações da interface em `src/`.

O arquivo `.nojekyll` impede o processamento dos assets pelo Jekyll.

## Estrutura principal

```text
src/
  site-template.html Entrada HTML do Vite
  App.tsx            Navegação e configuração da partida
  GameBoard.tsx      Tabuleiro, histórico e análise
  Learn.tsx          Lições e exercícios
  curriculum.ts      Conteúdo da trilha
  bots.ts            Níveis e personalidades dos bots
  engine.ts          Comunicação UCI com Stockfish
scripts/             Preparação do Stockfish
public/              Arquivos estáticos
.github/workflows/   Compilação e publicação
index.html           Saída gerada para GitHub Pages
assets/              JavaScript e CSS compilados
engine/              Stockfish para o navegador
```

## Limitações conhecidas

- A promoção do peão é automática para dama; a escolha de outra peça ainda não está disponível.
- Os níveis de bot são aproximações de força, não calibrações oficiais de rating.
- Sem Stockfish, as análises e os bots ficam limitados pelo motor de reserva.

## Stack

React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · chess.js · react-chessboard · Stockfish
