# Respostas para o formulário da Etapa 2 (prazo 30/10/2026)

Formulário: https://forms.cloud.microsoft/r/uVDmUEdFre. Um bloco por campo, na ordem do formulário, respeitando os limites de linhas das perguntas 4 e 5.

Antes de enviar: ative o GitHub Pages (Settings → Pages → `main` / `docs`), dê `git push` e abra o link da pergunta 8 para ver se funciona.

## 1. Nome completo do(a) responsável pelo preenchimento

Matheus Gabriel Viana Araujo (RA 10420444)

## 2. Nomes dos demais integrantes do grupo

Danilo Oliveira Santos (RA 10410905)

## 3. Qual a sub-área escolhida pelo grupo

Grupo 31: segurança em pagamentos por aproximação (NFC, cartões contactless, carteiras digitais no celular e maquininhas), com foco em engenharia social e fraude.

## 4. Proposta completa do grupo (até 8 linhas)

Vamos montar uma trilha para a plataforma MackSeguro sobre como pagar por aproximação sem cair em golpe. A tecnologia em si é bem protegida: o NFC só funciona a poucos centímetros e cada compra gera um código próprio. O problema aparece no uso. Compras de até cerca de R$ 200 passam sem senha, então um cartão esquecido vira dinheiro solto. E existe o golpe da maquininha "quebrada": o golpista diz que a aproximação não funciona, olha a senha sendo digitada e troca o cartão na hora de devolver. Isso conecta com três pontos da segurança da informação: proteção de senha e cartão, autenticação (a carteira digital pede biometria, o cartão físico não pede nada) e engenharia social. A trilha tem texto, vídeo, caso prático, desafio, quiz, checklist, infográfico e teste final, todos girando em torno de sete hábitos de proteção. Pix por aproximação ficou de fora.

## 5. Impacto social/comunitário (3 a 5 linhas)

Todo mundo que usa cartão ou celular para pagar está exposto a isso, e quase ninguém aprende a se proteger. Para um estudante que paga o aluguel com o saldo da conta, perder R$ 440 numa madrugada pesa muito, e foi esse o caso que usamos como exemplo. O material ensina a evitar a fraude e, se ela acontecer, o que fazer na ordem certa: bloquear o cartão, avisar o banco e contestar. Também serve para atendentes e pequenos comerciantes, que aprendem a reconhecer os sinais do golpe e a não entregar o cartão do cliente.

## 6. Como o material pode ser usado como recurso educativo ou prático

Quem não entende do assunto abre o site no celular, sem cadastro, e faz a trilha: lê o texto, decide o que fazer no caso do cartão esquecido no bar, procura os cinco erros da cena do show lotado e responde ao quiz. O checklist serve para olhar antes de sair de casa (ou imprimir), e o infográfico em PDF e PNG dá para mandar em grupo de WhatsApp ou colar em mural. O caso e o desafio também funcionam em sala ou oficina, com o gabarito discutido em grupo. Dentro do MackSeguro, as 15 questões já estão no formato do `mock.ts`, e badge e certificado saem da própria plataforma.

## 7. Ferramentas e tecnologias utilizadas

- Páginas interativas: HTML, CSS e JavaScript sem framework, publicadas no GitHub Pages.
- Conteúdo: Markdown, convertido com Pandoc e XeLaTeX para PDF. O PDF e o PNG do infográfico saem do Chromium em modo headless.
- Dados: um script em Python (com uv) tira o quiz e o teste dos arquivos de texto e gera JSON, JavaScript e TypeScript no formato da plataforma (React e TypeScript).
- Vídeo: Manim (Python) nas animações de apoio. A gravação será com câmera e celular, e a edição ainda vamos definir.
- Design: o infográfico da primeira versão foi feito no Canva. A versão atual está em HTML e CSS.
- Versionamento: Git e GitHub.
- IA generativa: Claude (Anthropic), como apoio nos rascunhos, na organização do conteúdo, na checagem de fontes, no código das páginas e nas animações. Tema, escolha dos objetos, gravação e revisão final são nossos, e o uso de IA está declarado em cada material.

## 8. Entrega parcial do grupo (link ou descrição do que já foi produzido)

Site com todos os objetos: https://araujoviana.github.io/seguranca-ext/
Repositório com fontes, PDFs e PNG: https://github.com/araujoviana/seguranca-ext

O que já está pronto e funcionando:
- Texto "Encostou, pagou", com fontes (`texto.html`).
- Caso prático "O cartão esquecido no bar", interativo: cada escolha mostra a consequência e o prejuízo na tela (`caso-pratico.html`).
- Desafio "Encontre os 5 erros", interativo, com trechos-isca que não são erro e gabarito comentado (`desafio.html`).
- Quiz de 5 questões e teste final de 10, com explicação de todas as alternativas (`quiz.html`, `teste-final.html`).
- Checklist com caixas de marcar e versão para imprimir (`checklist.html`).
- Infográfico de página única em PDF e PNG (`infografico.html`).
- Roteiro cronometrado do vídeo e 3 animações prontas (`video.html`).
- `PLANO_PROGRESSO.md` no repositório, com o checklist do que falta.

Escolhemos o GitHub Pages para que o professor teste tudo com um clique, sem instalar nada. Os mesmos conteúdos existem em PDF e Markdown, para a banca e para a plataforma. O vídeo autoral de 5 minutos, com nós dois na câmera, ainda não foi gravado. O roteiro está pronto e a entrega será até 12/11.

## 9. Próximos passos do grupo

1. Nós dois lermos todo o material e fazermos a revisão final.
2. Gravar as telas do celular (notificações, carteira digital, bloqueio do cartão) com dados fictícios e arrumar dois cartões de mentira para a demonstração da troca.
3. Gravar o vídeo de 5 minutos, editar com as animações e publicar no YouTube como não listado, até 12/11.
4. Trocar as fontes de 2020 sobre o limite sem senha por alguma de 2024 a 2026.
5. Conversar com quem cuida da plataforma para entrar o conteúdo na trilha, por pull request no `src/data/mock.ts` do MackSeguro.
