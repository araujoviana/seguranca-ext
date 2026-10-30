# Design

Derivado do site publicado em `docs/` (`assets/style.css`, `assets/nav.js`). Modo: Read (texto, vídeo, infográfico) com objetos interativos em modo Operate (quiz, caso, desafio, checklist).

## Mundo visual

Papel e tinta. Um único eixo de cinzas quentes, sem cor de acento e sem modo escuro (`color-scheme: light`). A hierarquia vem de tamanho, peso, filetes finos e inversão (fundo de tinta com texto de papel), nunca de cor.

Certo e errado não dependem de cor: certo = borda cheia de 2px, marca preenchida e ícone de check; errado = borda tracejada de 2px e ícone X; não escolhido = opacidade reduzida. Todo estado também tem texto.

## Tokens

| Token | Valor | Uso |
|---|---|---|
| `--papel` / `--papel-2` / `--papel-3` | `#f6f4ef` / `#ece9e2` / `#e1ddd4` | fundo, blocos, hover |
| `--tinta` / `--tinta-2` / `--tinta-3` | `#161513` / `#46433d` / `#6b675f` | texto, texto secundário, apoio (≥4,5:1 sobre o papel) |
| `--fio` / `--fio-2` | `#cdc9bf` / `#9d988d` | filetes, bordas |
| `--medida` / `--larga` | 40rem / 62rem | coluna de leitura / início e vídeo |

## Tipografia

- Títulos e números: **Newsreader** (serifada com tamanho óptico), 500, tracking negativo nos tamanhos grandes (-0.025em no h1), `text-wrap: balance`.
- Corpo e interface: **Inter**, 400/500/600, 17px / 1.65.
- Escala: h1 `clamp(2.25rem, 7vw, 3.5rem)`; capa até 4.75rem; h2 1.75rem; corpo 1.0625rem; apoio 0.8125–0.9375rem.
- Números tabulares nos contadores, no medidor de prejuízo e na numeração.

## Componentes

- **Cabeçalho:** 56px, translúcido (`backdrop-filter`), marca à esquerda, passo "n de 8" e menu "Trilha" (disclosure com 8 itens).
- **Lista da trilha:** linhas separadas por filete, número serifado, título, uma linha de descrição, seta; hover desloca a seta.
- **Opção de resposta:** botão de 56px+, letra em círculo, estados `certa` / `errada` / `fora`. Resposta sem relatório de todas as alternativas: só a marcada e a correta.
- **Medidor de prejuízo:** barra fixa; inverte (tinta cheia) quando o prejuízo sobe.
- **Diagramas SVG** (caso prático): barras com linha tracejada do limite sem senha; fluxo vertical da ordem de ação; linhas do tempo "sem/com notificação". Traço único de 1,5px, rótulos em Inter/Newsreader, `role="img"` com descrição.
- **Marcações do desafio:** sublinhado pontilhado; selecionado = tinta cheia; acerto = tinta cheia; perdeu = contorno tracejado; falso = riscado.
- **Checklist:** linhas de 56px, caixa personalizada 28px, contagem e impressão.
- **Navegação anterior/próximo** no fim de cada objeto; **rodapé único** com autoria e nota de IA.

## Movimento

Uma entrada do conteúdo (subida de 8px, 500ms, ease-out exponencial) e retorno de feedback no mesmo tom. Pressionar reduz a escala (0.97–0.985) na hora do toque. Barras do diagrama crescem uma vez. `prefers-reduced-motion` zera durações; `prefers-reduced-transparency` e `prefers-contrast` ajustam o cabeçalho e os filetes.

## Regras

- Sem emoji nem glifos Unicode como ícone: ícones são SVG de traço 1,75px (`window.ICONES` em `nav.js`).
- Sem cards aninhados, sem sombras além do menu, sem eyebrows, sem gradiente (exceto o esmaecimento do painel fixo do desafio).
- Mudar texto das páginas `texto` e `checklist` pelo `.md` e rodar `versao1/gerar-site.sh`; o filtro `site-filtro.lua` remove autoria/nota de IA, recolhe as fontes e monta os blocos de mito.
