# Chess Coach

Treinador de xadrez em português, feito com React, TypeScript e Vite. Jogue contra bots de diferentes níveis e estilos, analise posições e pratique em uma trilha progressiva de lições e exercícios.

## O que está incluído

- **Partidas contra bots:** seis faixas de força anunciadas (400 a 3000+), com estilos padrão, agressivo, posicional, caótico e humano simulado.
- **Modo livre:** tabuleiro para jogar dos dois lados, navegar pelo histórico, consultar avaliação e pedir uma sugestão de lance.
- **Ferramentas de estudo:** desfazer, histórico em notação algébrica, copiar PGN e FEN, indicação de xeque e sons de partida.
- **Trilha de aprendizagem:** módulos do nível zero ao avançado, com explicações e exercícios interativos.
- **Motor de xadrez:** integração com Stockfish em Web Worker; um motor simplificado é usado como alternativa quando o Stockfish não está disponível.

## Executar localmente

Requer Node.js 22.12+ (ou 20.19+).

```bash
npm install
npm run dev
```

Para validar e gerar a versão de produção:

```bash
npm run typecheck
npm run build
npm run preview
```

O script `postinstall` tenta copiar automaticamente o build single-thread do Stockfish para `public/engine`. Caso o motor não seja encontrado, execute:

```bash
npm run engine
```

O aplicativo continua utilizável sem Stockfish, mas a força dos bots, as dicas e a avaliação ficam limitadas pelo motor de reserva.

## Publicação no GitHub Pages

**Ativação inicial necessária:** no GitHub, abra **Settings → Pages** do repositório e, em **Build and deployment**, selecione **GitHub Actions** como fonte. A permissão da automação conectada não permite criar a configuração inicial de Pages por API; depois dessa seleção, o workflow poderá publicar normalmente.

O workflow `.github/workflows/deploy.yml` instala as dependências, verifica os tipos, compila e publica o conteúdo de `dist/` quando há um push em `main` ou uma execução manual do workflow.

O endereço esperado do projeto é:

`https://mateusvidotto-dotcom.github.io/Xadrez/`

A configuração do Vite usa `/Xadrez/` somente durante a compilação do GitHub Pages; localmente, a aplicação continua usando `/`.

## Estrutura

```text
src/
  App.tsx          Navegação e configuração da partida
  GameBoard.tsx    Tabuleiro, histórico, análise e controles
  Learn.tsx        Interface das lições e exercícios
  curriculum.ts    Conteúdo da trilha de aprendizagem
  bots.ts          Níveis e personalidades dos bots
  engine.ts        Comunicação UCI com Stockfish
  sounds.ts        Efeitos sonoros sintetizados
  ui.ts            Classes e cores compartilhadas
scripts/
  copy-engine.mjs  Localiza e copia o build do Stockfish
.github/
  workflows/
    deploy.yml     Verificação e publicação automática
```

## Limitações conhecidas

- A promoção do peão é automática para dama; a escolha entre dama, torre, bispo e cavalo ainda não está disponível.
- Os níveis 400, 800 e 1200 são aproximações baseadas em habilidade, profundidade e variação de lances, não uma calibração oficial de rating.
- Os níveis 1600 e 2200 usam o limite de força do Stockfish; o nível 3000+ usa o motor sem limite de rating e com profundidade maior. O desempenho real varia com o dispositivo e a versão do motor.
- O modo de reserva sem Stockfish prioriza capturas, promoções e xeques; ele não substitui um motor completo.

## Stack

React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · chess.js · react-chessboard · Stockfish
