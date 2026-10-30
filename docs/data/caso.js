window.CASO = {
  inicio: "Lucas, 22 anos, comemora o aniversário de um amigo num bar perto da faculdade. Paga a primeira rodada aproximando o cartão de débito, deixa o cartão em cima da mesa e esquece. Vai embora às 23h. Semanas atrás, desligou as notificações do app do banco porque \"o celular apitava demais\".",
  perda: 440,
  cenas: [
    {
      texto: "Na manhã seguinte, Lucas abre o app para fazer um Pix e vê quatro compras por aproximação feitas na madrugada: R$ 45, R$ 120, R$ 180 e R$ 95, em lojas e postos que ele nunca visitou. O saldo que ia pagar o aluguel ficou R$ 440 menor. Ele ainda nem percebeu que o cartão sumiu. Qual é o primeiro passo?",
      opcoes: [
        { t: "Bloquear o cartão pelo app", ok: true, fb: "Cada minuto com o cartão ativo é uma chance de nova compra. O bloqueio vem antes de qualquer outra coisa.", extra: 0 },
        { t: "Esperar a fatura fechar para contestar tudo junto", ok: false, fb: "Enquanto o cartão não for bloqueado, novas compras continuam passando. Às 9h30 entra mais uma de R$ 150.", extra: 150 },
        { t: "Ir até os postos e lojas pedir o estorno", ok: false, fb: "A contestação é feita com o banco, não com as lojas. E o cartão segue ativo durante a ida: entra mais uma compra de R$ 150.", extra: 150 },
        { t: "Registrar o boletim de ocorrência antes de falar com o banco", ok: false, fb: "O boletim ajuda na contestação, mas vem depois do bloqueio. Na fila da delegacia entra mais uma compra de R$ 150.", extra: 150 }
      ],
      aprende: "Por que alguém comprou sem saber a senha? Todas as compras ficaram abaixo do limite sem senha, que em geral chega a R$ 200 por transação (o do seu banco pode ser diferente). Com o cartão na mão, basta aproximar. Por isso o golpista dividiu o gasto em várias compras pequenas."
    },
    {
      texto: "O cartão está bloqueado. Qual é a sequência certa a partir daqui?",
      opcoes: [
        { t: "Ligar para o banco, contestar as quatro compras, guardar prints e comprovantes e registrar boletim de ocorrência", ok: true, fb: "Quanto antes o banco for avisado, menor tende a ser o prejuízo. Prints, comprovantes e o boletim ajudam na contestação.", extra: 0 },
        { t: "Não fazer mais nada: o bloqueio já resolve", ok: false, fb: "O bloqueio impede novas compras, mas as quatro já feitas só voltam com a contestação junto ao banco.", extra: 0 },
        { t: "Apagar as notificações e os prints para não se confundir", ok: false, fb: "Esses registros são a prova da contestação. Apagar enfraquece o pedido.", extra: 0 }
      ],
      aprende: "A ordem é: bloquear, ligar para o banco, contestar e guardar comprovantes (com boletim de ocorrência se houve furto)."
    },
    {
      texto: "Resolvido o problema, Lucas ainda quer pagar por aproximação. O que reduz mais o risco de acontecer de novo?",
      opcoes: [
        { t: "Cadastrar o cartão na carteira digital do celular e desativar a aproximação no cartão físico", ok: true, fb: "O pagamento só é liberado depois de biometria ou senha. Um cartão esquecido na mesa não serve para comprar por aproximação.", extra: 0 },
        { t: "Pedir ao banco para aumentar o limite sem senha", ok: false, fb: "Aumentar o limite aumenta o prejuízo possível se o cartão for perdido de novo.", extra: 0 },
        { t: "Continuar como antes, mas deixar o cartão no bolso de trás", ok: false, fb: "O bolso de trás é fácil de furtar, e o cartão físico com aproximação ativa continua pagando sem senha.", extra: 0 }
      ],
      aprende: "Prevenir é fechar a porta: carteira digital e aproximação desativada no físico."
    }
  ],
  fim: "Qual hábito teria feito Lucas descobrir o problema ainda naquela noite? As notificações de compra ativadas. O primeiro aviso, de R$ 45, chegaria na hora, e ele poderia bloquear o cartão antes das outras três compras, evitando a maior parte do prejuízo."
};
