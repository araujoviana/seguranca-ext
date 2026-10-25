# Projeto de Extensão: segurança em pagamentos por aproximação

Objetos de aprendizagem do projeto de extensão (Mackenzie, 2º sem. 2026). Grupo 31: Matheus Gabriel Viana Araujo e Danilo Oliveira Santos.

## Prazos

| Data | Entrega |
|---|---|
| 30/10 | Entrega parcial: escopo e conteúdo pretendido (formulário 1). Texto pronto em `formulario-1-escopo.md` |
| 18/11 | Entrega final: arquivos de cada objeto + link do vídeo no YouTube (não listado) |

## Estrutura

- `versao1/*.md`: fonte de cada objeto (texto, roteiro do vídeo, caso prático, desafio, quiz, checklist, teste final)
- `versao1/pdf/`: PDFs prontos para o formulário (A4; o infográfico é uma página única)
- `versao1/infografico/infografico.html`: fonte do infográfico
- `versao1/gerar-pdfs.sh`: regenera os PDFs depois de editar os `.md` ou o HTML (requer `pandoc`, `xelatex` e `chromium`)
- `versao1/video/manim/script.py`: animações de apoio do vídeo (3 cenas). Vídeos prontos em `versao1/video/saida/`. Para renderizar de novo: `cd versao1/video && uv run manim -qh manim/script.py Cena1_Aproximacao Cena2_Golpe Cena3_Protecao`
- `versao1/original/`: primeira versão (06/10), inclusive o infográfico feito no Canva
- `.claude/skills/manim-video/`: skill de animação com Manim, copiada de `NousResearch/hermes-agent` (MIT)
- `transcricao_reuniao_entregaveis.txt`: transcrição da reunião de 02/10 sobre os entregáveis

## TODO

Para combinar com o Danilo (segunda):

- [ ] Os dois lerem os `.md` uma vez e conferirem se concordam. A nota de uso de IA afirma que a revisão final é dos integrantes.
- [ ] Equilibrar o roteiro: Matheus tem ~340 palavras e Danilo ~280. Decidir se passa um trecho de um para o outro.
- [ ] Gravar o vídeo (um bloco cada, 5 min, os dois na câmera) e subir no YouTube como não listado. Colar a nota de IA na descrição.
- [ ] Gravar as telas do celular que o roteiro pede (notificações, carteira digital, bloquear cartão), com dados fictícios.
- [ ] Comprar ou imprimir dois cartões de mentira para a demonstração da troca de cartão.
- [ ] Escolher onde cada animação do Manim entra na edição (`versao1/video/saida/`).

Prazos e formulários:

- [ ] Preencher o formulário 1 até 30/10 com `formulario-1-escopo.md`.
- [ ] Confirmar o prazo final: o e-mail do professor cita 12/11 para finalizar, e a reunião falou em 18/11. Na dúvida, mire em 12/11.
- [ ] Quando o formulário final chegar, confirmar os formatos pedidos por objeto (só o quiz foi citado como PDF na reunião).

Conteúdo (opcional, se sobrar tempo):

- [ ] Trocar as fontes de 2020 (Tecnoblog e Canaltech) por uma fonte de 2024 a 2026 sobre o teto de R$ 200 sem senha.
- [ ] Rever o texto de tamanho das alternativas do teste final (a correta é a mais longa na Q2).
