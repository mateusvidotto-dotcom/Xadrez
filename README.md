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

O workflow `.github/workflows/deploy.yml` instala as dependências, verifica os tipos e compila o aplicativo com a base `/Xadrez/`. Em seguida, sincroniza o conteúdo compilado de `dist/` com a raiz do branch `main`, que é a origem atualmente utilizada pelo GitHub Pages.

**Importante:** `app-source.html` é a entrada HTML usada pelo Vite. O `index.html` da raiz é o arquivo gerado para o site publicado; não o edite manualmente. Faça alterações na interface em `src/` e em `app-source.html`.

O arquivo `.nojekyll` impede que o GitHub Pages processe os assets do Vite como conteúdo Jekyll.

## Estrutura principal

```text
app-source.html    Entrada HTML do Vite
src/               Aplicação React e conteúdo de aprendizagem
scripts/           Preparação do Stockfish
public/            Arquivos estáticos copiados para a compilação
.github/workflows/ Compilação e publicação
index.html         Saída gerada para GitHub Pages
assets/            JavaScript e CSS compilados
engine/            Stockfish compilado para o navegador
```

## Limitações conhecidas

- A promoção do peão é automática para dama; a escolha de outra peça ainda não está disponível.
- Os níveis de bot são aproximações de força, não calibrações oficiais de rating.
- Sem Stockfish, as análises e os bots ficam limitados pelo motor de reserva.

## Stack

React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · chess.js · react-chessboard · Stockfish
