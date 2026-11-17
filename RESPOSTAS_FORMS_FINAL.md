# Respostas para o formulário final (prazo 18/11/2026)

Formulário: https://forms.cloud.microsoft/r/ReU8N9UWbe. São 9 campos de texto, sem anexo. Os campos 5 a 9 são obrigatórios. Um bloco por campo, na ordem do formulário.

Antes de enviar:
- [ ] Subir `video-completo.mp4` (release `video-v2`) no YouTube como **não listado** e colar o link no campo 6. Foi o que o professor pediu na reunião. O vídeo também está no site, mas o link do YouTube é o esperado.
- [ ] O repositório é **privado**, então o professor não abre o link dele. Ou deixar o repositório público, ou dar acesso ao professor.
- [ ] O campo 6 pede que "o documento do word preenchido que foi enviado por email" esteja no repositório. Achar esse `.docx` no email, preencher e commitar (sugestão: pasta `entrega/`).
- [ ] Os dois lerem os campos 8 e 9, que falam da experiência de vocês.

## 1. Responsável pelo envio

Matheus Gabriel Viana Araujo (RA 10420444)

## 2. Nome do grupo

Grupo 31: Pagamento por aproximação sem cair em golpe

## 3. Integrantes (nomes completos e RAs)

Matheus Gabriel Viana Araujo (RA 10420444) e Danilo Oliveira Santos (RA 10410905)

## 4. Área de atuação

Segurança da Informação aplicada a pagamentos por aproximação (NFC, cartões contactless e carteiras digitais), com foco em engenharia social e fraude. O formato é uma trilha educativa com vídeo, atividades interativas e avaliação.

## 5. Descrição da solução desenvolvida

Montamos uma trilha para a plataforma MackSeguro que ensina a pagar por aproximação sem cair em golpe. A tecnologia é segura: o NFC só funciona a poucos centímetros e cada compra gera um código único. O risco está no uso. Compras de até cerca de R$ 200 passam sem senha, e no golpe da maquininha "quebrada" o golpista vê a senha sendo digitada e troca o cartão na hora de devolver.

A trilha tem oito objetos, todos ligados aos mesmos sete hábitos de proteção:
- texto explicativo com fontes;
- vídeo de 4 minutos com nós dois na câmera e animações sincronizadas com a fala, com legenda;
- caso prático interativo ("O cartão esquecido no bar"), em que cada escolha mostra o prejuízo;
- desafio "Encontre os 5 erros", com gabarito comentado;
- quiz de 5 questões e teste final de 10, com a explicação de cada alternativa;
- checklist para marcar no celular ou imprimir;
- infográfico em PDF e PNG.

O site abre no celular, sem cadastro. Todo o conteúdo também existe em PDF e Markdown, e as 15 questões já estão no formato TypeScript da plataforma.

Tecnologias: HTML, CSS e JavaScript publicados no GitHub Pages; Markdown, Pandoc e XeLaTeX para os PDFs; Python (com uv) para gerar os dados do quiz em JSON e TypeScript. No vídeo, as animações foram programadas e renderizadas com ffmpeg, a fala foi transcrita com faster-whisper para sincronizar as animações e o áudio passou por redução de ruído e equalização. Usamos IA generativa (Claude) como apoio nos rascunhos, no código e na edição. O tema, o roteiro final, a gravação e a revisão são nossos, e o uso de IA está declarado no material.

## 6. Entregáveis

Repositório: https://github.com/araujoviana/seguranca-ext
Site com a trilha completa: https://araujoviana.github.io/seguranca-ext/
Vídeo no YouTube (não listado): COLAR O LINK AQUI
Vídeo no site, com legenda: https://araujoviana.github.io/seguranca-ext/video.html
Infográfico: https://araujoviana.github.io/seguranca-ext/infografico.html

Os PDFs de todos os objetos estão em `docs/downloads/` no repositório. O documento do Word preenchido está em `entrega/` (CONFERIR O CAMINHO).

## 7. Impacto e aplicabilidade

Pagar por aproximação virou rotina, mas pouca gente sabe o que fazer quando a maquininha "não funciona" ou quando o cartão some. Para um estudante que paga o aluguel com o saldo da conta, perder algumas centenas de reais numa madrugada faz diferença. Por isso usamos esse caso como exemplo. A trilha ensina a evitar a fraude e, se ela acontecer, a agir na ordem certa: bloquear o cartão, avisar o banco e contestar a compra.

O impacto é educacional e social. O material é gratuito e abre no celular sem cadastro. O infográfico foi feito para circular em grupos de WhatsApp e em murais. Atendentes e pequenos comerciantes também podem usar o material para reconhecer o golpe e não entregar o cartão do cliente a outra pessoa. O caso prático e o desafio funcionam em sala de aula ou em oficinas.

A ligação com a extensão está em pegar o que estudamos na faculdade sobre autenticação e engenharia social e transformar isso em algo que qualquer pessoa usa sozinha, no dia a dia.

## 8. Aprendizado e experiência

Aprendemos como o pagamento por aproximação funciona por dentro: o alcance do NFC, a tokenização, o código gerado a cada compra e o limite sem senha. Também ficou claro que o ponto fraco quase nunca é a tecnologia, e sim o momento em que alguém distrai a pessoa. Escrever para quem não é da área foi outro aprendizado. Tivemos que cortar jargão, manter um exemplo do começo ao fim e cuidar até de detalhes do quiz, como não deixar a alternativa certa ser sempre a mais longa.

O maior desafio foi o vídeo. Gravamos separados, com equipamentos diferentes, e um dos áudios chegou baixo e abafado. Tratamos o som, cortamos as pausas longas e sincronizamos as animações com a nossa fala real, transcrita palavra por palavra. Também precisamos ajustar o roteiro para que os dois falassem partes de tamanho parecido.

Ter uma trilha só nos ajudou a manter o foco. Como os oito objetos tratam do mesmo tema, um reforça o outro em vez de cada um ir para um lado. Dividimos as partes do vídeo e revisamos o conteúdo juntos.

## 9. Sugestões e feedback

O que mais gostamos foi transformar um assunto técnico em algo que a pessoa usa no dia seguinte, principalmente no caso prático interativo e no vídeo.

Duas sugestões para as próximas edições. A primeira é divulgar logo no começo os formatos aceitos para cada objeto, com um exemplo de entrega pronta, porque isso evitaria retrabalho. A segunda é a plataforma MackSeguro receber o conteúdo dos grupos ainda durante o semestre, para testarmos a trilha no ambiente real antes da entrega. Também seria útil fazer uma rodada de teste com pessoas de fora da universidade, para ver se o material realmente ajuda quem não é da área.
