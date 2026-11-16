---
title: "Roteiro do vídeo: como funciona o golpe da maquininha \"quebrada\""
subtitle: "Vídeo | Segurança em pagamentos por aproximação"
---

**Projeto de Extensão | Mackenzie**
**Integrantes:** Matheus Gabriel Viana Araujo (RA 10420444) e Danilo Oliveira Santos (RA 10410905)

**Título sugerido no YouTube:** Como funciona o golpe da maquininha "quebrada" (pagamento por aproximação)
**Duração:** cerca de 5 minutos, em dois blocos. O Matheus fala a primeira metade e o Danilo, a segunda. Cada um aparece na câmera falando durante o seu bloco; as animações entram em tela cheia por uns 15 segundos cada, com a voz continuando por cima.
Falem com as próprias palavras. O texto abaixo é só a base (cerca de 620 palavras, ou uns 4 min 15 s de fala; o restante vem das demonstrações e das pausas).
**Publicação:** subir no YouTube como **não listado**.

Legenda: **[CÂMERA]** é o apresentador falando de frente. **[ANIMAÇÃO n]** é um trecho feito no Manim (código em `video/manim/script.py`, vídeos prontos em `video/saida/`), exibido enquanto a voz continua.

# BLOCO 1: MATHEUS (0:00 a 2:40)

## [0:00 a 0:25] Abertura **[CÂMERA]**

**MATHEUS:** Você já pagou uma compra só encostando o cartão na maquininha? É rápido, mas e se alguém pegar o seu cartão? Ou se a maquininha "parar de funcionar" bem na sua vez? Eu sou o Matheus e, junto com o Danilo, vou mostrar como funciona o golpe da maquininha "quebrada". Eu explico o golpe, e o Danilo fala de como se proteger.

## [0:25 a 1:25] Como o pagamento funciona **[CÂMERA]** + **[ANIMAÇÃO 1]**

*(ANIMAÇÃO 1 entra no começo deste trecho: cartão encosta na maquininha, aparece o código único e o limite "R$ 200 sem senha")*

**MATHEUS:** O cartão tem um chip ligado a uma antena. Quando você encosta, a maquininha cria um campo de rádio de poucos centímetros, o chip acorda com essa energia e responde só com os dados daquela compra, incluindo um código gerado na hora. Se alguém copiasse esse código, ele não serviria para outra compra.

Por isso aquela história de "clonar o cartão passando do lado" é muito difícil na prática. Em 2020 a Abecs, que reúne as empresas de cartões, disse que não encontrou problema significativo de segurança.

O ponto fraco é outro. Compras de até R$ 200 podem passar sem senha. Esse teto é da Abecs, mas cada banco decide o seu, então confira no app. Se o cartão cair na mão errada, ele funciona quase como dinheiro. *(mostrar um cartão sobre a mesa)*

## [1:25 a 2:40] O golpe da maquininha "quebrada" **[CÂMERA]** + **[ANIMAÇÃO 2]**

**MATHEUS:** Imagina uma lanchonete cheia. O atendente diz: "a aproximação está fora do ar, insere o cartão e digita a senha aqui". Você digita, e ele olha de perto para o teclado. Às vezes nem precisa olhar: segundo o Itaú, há casos em que a própria máquina foi adulterada para registrar a senha. Na hora de devolver, ele se vira de costas por um instante e entrega um cartão parecido com o seu. *(demonstrar com dois cartões de mentira: um é guardado na mão e o outro é devolvido)* Você guarda sem olhar. *(ANIMAÇÃO 2: os quatro passos do golpe em sequência)*

Repara nos sinais: a aproximação "fora do ar", o olhar no teclado e o cartão saindo da sua vista. A Febraban alerta justamente para a troca de cartão. O golpista fica com o seu cartão verdadeiro e com a sua senha, e então não fica preso ao limite sem senha: pode fazer compras grandes e até sacar dinheiro. E, se as notificações do banco estiverem desligadas, você só descobre horas ou dias depois. Agora o Danilo mostra como evitar isso.

# BLOCO 2: DANILO (2:40 a 5:00)

## [2:40 a 2:50] Passagem **[CÂMERA]**

**DANILO:** Valeu, Matheus. Eu sou o Danilo e vou falar do que dá para fazer para não cair nisso.

## [2:50 a 4:35] Como se proteger **[CÂMERA]** + **[ANIMAÇÃO 3]** + demonstração de tela

**DANILO:** Vou dividir em três momentos e, no fim, falo do que fazer se algo der errado. *(ANIMAÇÃO 3: linha do tempo "antes, na hora, depois")*

**Antes de sair de casa:** ative as notificações de compra no app do banco, porque cada compra gera um aviso na hora. *(mostrar na tela do celular onde fica essa opção no app)* Se você vai a um lugar cheio, como bloco ou show, a Febraban recomenda desabilitar a aproximação por um tempo e pagar só inserindo o cartão. Alguns bancos permitem fazer isso pelo app, então veja se o seu tem essa opção.

Tem gente que acha que pagar com o celular é mais arriscado, mas em geral é o contrário: a carteira digital pede biometria ou senha antes de liberar o pagamento e manda um número substituto no lugar do número real do cartão. *(mostrar um pagamento por carteira digital, com a biometria)*

**Na hora de pagar:** olhe o valor no visor antes de aproximar, e não pague em maquininha com visor quebrado. Você mesmo insere e passa o cartão, e ele não sai da sua vista. Se disserem que a aproximação está fora do ar, desconfie e pague de outro jeito. Se mesmo assim precisar digitar a senha, cubra o teclado e confira se o visor mostra só asteriscos.

**Depois de pagar:** confira se o cartão devolvido é mesmo o seu, e olhe a notificação para ver se o valor está certo.

**E se der errado:** perdeu o cartão ou viu uma cobrança estranha? Bloqueie no app, ligue para o banco e conteste logo, porque quanto antes o banco for avisado, menor tende a ser o prejuízo. Não espere a fatura chegar. *(mostrar o botão de bloquear cartão no app)*

## [4:35 a 5:00] Fechamento **[CÂMERA]**

**DANILO:** Pagar por aproximação continua sendo uma boa ideia. Só precisa olhar o visor e ler a notificação. Manda esse vídeo para alguém que usa cartão. Valeu!

## Antes de apertar o REC

- [ ] Dois cartões de mentira (podem ser cartões de fidelidade ou papelão impresso) para a troca.
- [ ] Telas do celular gravadas antes: onde ativar as notificações, pagamento com biometria na carteira digital, botão de bloquear cartão. Esconder saldo, nome e número.
- [ ] Os três vídeos de `video/saida/` (Cena1, Cena2, Cena3) já baixados no editor.
- [ ] Celular em modo avião, para não tocar no meio da gravação.

## Dicas de gravação

- Gravem na horizontal, com boa luz e áudio limpo. Gravem cada trecho do roteiro separado: fica mais fácil refazer só o que deu errado.
- Ensaiem a demonstração da troca de cartão (Matheus, 1:25 a 2:40). É a parte que mais prende a atenção.
- Se passar de 5 minutos, cortem primeiro a frase do Itaú (Matheus) e depois a parte "Depois de pagar" (Danilo), deixando essa só na legenda.
- Avisem no vídeo (ou na descrição) que a demonstração usa cartões de mentira.
- Coloquem na descrição do YouTube a nota de uso de IA abaixo.

## Descrição para o YouTube

> Como funciona o golpe da maquininha "quebrada" e como se proteger ao pagar por aproximação. Vídeo do projeto de extensão do Mackenzie (Matheus Gabriel Viana Araujo e Danilo Oliveira Santos). A demonstração da troca usa cartões de mentira. Fontes: Febraban, Abecs e Itaú (via Estado de Minas). Material completo: [link do site]
>
> Uso de IA: o roteiro e as animações foram feitos com apoio de IA generativa (Claude, da Anthropic). A gravação, a demonstração e a apresentação são dos integrantes.

---

*Uso de IA: este roteiro foi redigido com apoio de IA generativa (Claude, da Anthropic), que ajudou a escrever os rascunhos e as animações. A gravação, a demonstração e a apresentação são dos integrantes.*
