# Segurança em pagamentos por aproximação

Projeto de extensão (Mackenzie, 2º sem. 2026), Grupo 31: Matheus Gabriel Viana Araujo (RA 10420444) e Danilo Oliveira Santos (RA 10410905). Material para a plataforma [MackSeguro](https://mackseguro.vercel.app/).

**Site (GitHub Pages):** https://araujoviana.github.io/seguranca-ext/ (depois de ativar Settings → Pages → `main` / `docs`)

| Prazo | Entrega |
|---|---|
| 30/10 | Entrega parcial (Etapa 2): ideia, impacto e protótipo. Textos prontos em [`RESPOSTAS_FORMS_ETAPA2.md`](RESPOSTAS_FORMS_ETAPA2.md) |
| 12/11 | Entrega final: todos os objetos + vídeo autoral de 5 min |

Plano, justificativa dos formatos e checklist do que falta: [`PLANO_PROGRESSO.md`](PLANO_PROGRESSO.md).

## Entregáveis

| # | Objeto | Ver no site | PDF | Fonte |
|---|---|---|---|---|
| 1 | Texto: "Encostou, pagou" | [texto](docs/texto.html) | [PDF](docs/downloads/1-texto.pdf) | [`versao1/1-texto.md`](versao1/1-texto.md) |
| 2 | Vídeo: "Como funciona o golpe" (gravação em 12/11) | [vídeo](docs/video.html) | [roteiro](docs/downloads/2-roteiro-video.pdf) | [`versao1/2-roteiro-video.md`](versao1/2-roteiro-video.md) |
| 3 | Caso prático: o cartão esquecido no bar | [interativo](docs/caso-pratico.html) | [PDF](docs/downloads/3-caso-pratico.pdf) | [`versao1/3-caso-pratico.md`](versao1/3-caso-pratico.md) |
| 4 | Desafio: encontre os 5 erros | [interativo](docs/desafio.html) | [PDF](docs/downloads/4-desafio.pdf) | [`versao1/4-desafio.md`](versao1/4-desafio.md) |
| 5 | Quiz (5 questões) | [interativo](docs/quiz.html) | [PDF](docs/downloads/5-quiz.pdf) | [`versao1/5-quiz.md`](versao1/5-quiz.md) |
| 6 | Checklist | [página](docs/checklist.html) | [PDF](docs/downloads/6-checklist.pdf) | [`versao1/6-checklist.md`](versao1/6-checklist.md) |
| 7 | Infográfico | [página](docs/infografico.html) | [PDF](docs/downloads/8-infografico.pdf) · [PNG](docs/downloads/8-infografico.png) | [`versao1/infografico/infografico.html`](versao1/infografico/infografico.html) |
| 8 | Teste final (10 questões) | [interativo](docs/teste-final.html) | [PDF](docs/downloads/7-teste-final.pdf) | [`versao1/7-teste-final.md`](versao1/7-teste-final.md) |

Badge e certificado são gerados pela plataforma.

## Estrutura

- `docs/`: site estático (HTML/CSS/JS sem build) servido pelo GitHub Pages. `docs/data/` tem os dados de quiz e teste; `docs/downloads/` tem PDFs e PNG.
- `versao1/*.md`: fonte de cada objeto. `versao1/infografico/`: fonte do infográfico. `versao1/video/manim/script.py`: animações do vídeo (prontas em `versao1/video/saida/`). `versao1/original/`: primeira versão (06/10).
- `mackseguro/questoes-pagamentos-aproximacao.ts`: as 15 questões no formato `Questao` do `src/data/mock.ts` da plataforma.
- `formulario-1-escopo.md`: texto do primeiro formulário (escopo). `transcricao_reuniao_entregaveis.txt`: reunião de 02/10.
- `.claude/skills/manim-video/`: skill de animação com Manim, de `NousResearch/hermes-agent` (MIT).

## Como regenerar

Depois de editar os `.md` ou o HTML do infográfico:

```sh
cd versao1
./gerar-site.sh   # dados de quiz/teste (JSON, JS e TypeScript) + páginas texto e checklist (pandoc, uv)
./gerar-pdfs.sh   # PDFs, PNG do infográfico e cópia para docs/downloads (pandoc, xelatex, chromium)
```

Para testar o site localmente: `python3 -m http.server -d docs` e abrir `http://localhost:8000`.
Para renderizar as animações de novo: `cd versao1/video && uv run manim -qh manim/script.py Cena1_Aproximacao Cena2_Golpe Cena3_Protecao`.

## Pendências

Veja o checklist completo em [`PLANO_PROGRESSO.md`](PLANO_PROGRESSO.md). Principais: revisão final dos dois integrantes, gravação e publicação do vídeo (até 12/11) e uma fonte de 2024 a 2026 sobre o limite sem senha.

## Uso de IA

O material foi redigido com apoio de IA generativa (Claude, da Anthropic): rascunhos, organização, checagem de fontes, código das páginas e animações. Tema, escolha dos objetos, gravação e revisão final são dos integrantes.
