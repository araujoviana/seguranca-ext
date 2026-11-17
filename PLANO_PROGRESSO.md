# Plano e progresso: Grupo 31, segurança em pagamentos por aproximação

Entrega parcial (Etapa 2): **30/10/2026**. Entrega final: **12/11/2026**. O vídeo autoral só é gravado e entregue na final; hoje entram o roteiro e as animações de apoio.

## Formato de cada entregável e por quê

O professor não fixou formatos. A regra que usamos: **quem avalia precisa testar com um clique, e a plataforma MackSeguro precisa conseguir aproveitar o material depois.** Por isso cada objeto existe em até três formas: página web (GitHub Pages, sem login nem instalação), PDF (para anexar ou imprimir) e Markdown/dados (fonte editável e importável).

| Entregável | Formato escolhido | Justificativa |
|---|---|---|
| Texto | Página web + PDF + `.md` | Lê bem no celular, sem baixar nada. O PDF serve para a banca e para imprimir. |
| Caso prático | Narrativa interativa com escolhas e contador de prejuízo | O caso pede decisão ("o que você faz agora?"). Errar a ordem custa dinheiro na tela, o que ensina mais que um gabarito no fim. |
| Desafio | Cena em que o usuário toca nos trechos de risco, com iscas que não são erro | Identificar sinais é o objetivo. As iscas evitam que a pessoa marque tudo. |
| Quiz (5) | Página interativa com explicação de cada alternativa + PDF | Teste direto pelo link. O mesmo dado gera o trecho TypeScript para a plataforma. |
| Checklist | Página com caixas de marcar (salvas só no navegador) + PDF para imprimir | Uso real é no celular antes de sair de casa ou na porta do bar. |
| Infográfico | PDF de página única + PNG em alta resolução | PDF para a banca, PNG para compartilhar em redes e grupos. Fonte em HTML para revisão. |
| Teste final (10) | Igual ao quiz, com aprovação em 70% | Cobre toda a trilha; mesmo formato do quiz, que já é o da plataforma. |
| Vídeo (5 min) | Roteiro em PDF/`.md` + 3 animações Manim prontas | A gravação fica para 12/11. As animações e o roteiro cronometrado mostram o avanço e reduzem o risco de atraso. |
| Badge e certificado | Automáticos na plataforma | Não são entregues por nós. |

**Fonte única.** `quiz` e `teste` são extraídos dos `.md` por `versao1/gerar-dados.py` para `docs/data/*.json` (site) e `mackseguro/questoes-pagamentos-aproximacao.ts` (formato `Questao` do `src/data/mock.ts` da plataforma). Editou o `.md`, rode `versao1/gerar-site.sh` e as três saídas se atualizam.

**Integração com a MackSeguro.** A plataforma é um app React que guarda todo o conteúdo em `src/data/mock.ts` e recebe contribuições por pull request (branch `content/...`). O arquivo em `mackseguro/` está pronto para colar. Não abrimos PR no repositório do Kenzo sem alinhar antes.

## Checklist

### Entrega parcial (30/10)

- [x] Auditoria do repositório e dos 8 entregáveis
- [x] Texto informativo com fontes e nota de uso de IA
- [x] Caso prático (versão `.md`/PDF)
- [x] Caso prático interativo (`docs/caso-pratico.html`)
- [x] Desafio (versão `.md`/PDF)
- [x] Desafio interativo (`docs/desafio.html`)
- [x] Quiz de 5 questões com explicação de todas as alternativas (`.md`, PDF, página interativa)
- [x] Checklist (`.md`, PDF, página com caixas de marcar)
- [x] Infográfico revisado: PDF de página única e PNG (`docs/downloads/`)
- [x] Teste final de 10 questões (`.md`, PDF, página interativa)
- [x] Roteiro do vídeo cronometrado, dividido entre os dois integrantes
- [x] 3 animações Manim renderizadas para o vídeo
- [x] Correção de viés no teste final (alternativa correta da Q2 deixou de ser a mais longa)
- [x] Prazo final unificado em 12/11
- [x] Site no GitHub Pages (`docs/`), hub navegável
- [x] Trecho TypeScript das questões para a plataforma
- [x] `RESPOSTAS_FORMS_ETAPA2.md` com os textos do formulário
- [x] README reescrito como hub
- [ ] **Ativar o GitHub Pages** (Settings → Pages → branch `main`, pasta `/docs`) e dar `git push`
- [ ] Abrir o link do Pages e testar uma vez no celular antes de enviar o formulário
- [ ] Enviar o formulário: https://forms.cloud.microsoft/r/uVDmUEdFre

### Entrega final (12/11)

- [ ] Os dois integrantes lerem todos os `.md` e confirmarem o conteúdo (a nota de IA afirma que a revisão final é deles)
- [x] Equilibrar o roteiro: Matheus ~340 palavras, Danilo ~280
- [ ] Preparar dois cartões de mentira para a demonstração da troca
- [ ] Gravar as telas do celular (notificações, carteira digital, bloquear cartão) com dados fictícios
- [x] Gravar o vídeo (os dois na câmera) e editar com as animações (`versao1/video/vm/`, 4min16, com legenda)
- [ ] Subir no YouTube como não listado, com a nota de IA e o aviso de cartões de mentira na descrição
- [ ] Trocar as fontes de 2020 sobre o limite de R$ 200 por uma de 2024 a 2026 (a busca de hoje não achou fonte mais recente; o texto já avisa que o limite varia por emissor)
- [x] Vídeo na página `docs/video.html` e no README (falta o link do YouTube)
- [ ] Alinhar com o Kenzo a entrada do conteúdo na plataforma (PR em `src/data/mock.ts`)
- [x] Conferir os formatos pedidos no formulário final: respostas em `RESPOSTAS_FORMS_FINAL.md`
- [ ] Enviar o formulário final até 18/11: https://forms.cloud.microsoft/r/ReU8N9UWbe

## Sobre o formulário

O formulário real (PDF salvo em 30/10) tem 9 campos: responsável, demais integrantes, sub-área, proposta (até 8 linhas), impacto (3 a 5 linhas), uso prático pela comunidade, ferramentas, entrega parcial (link ou descrição) e próximos passos. `RESPOSTAS_FORMS_ETAPA2.md` tem um bloco pronto para cada um, na mesma ordem.
