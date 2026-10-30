// Cada trecho clicável: e = número do erro (1 a 5) ou 0 para trecho correto (isca).
window.DESAFIO = {
  cena: [
    [["Sábado à noite, show lotado. Júlia leva ", 0], ["o cartão de crédito solto no bolso de trás da calça", 2, "Bolso de trás é fácil de furtar, e com a aproximação ativa quem pegar o cartão compra até o limite sem senha."], [", com ", 0], ["a aproximação ativada \"para pagar mais rápido\"", 1, "Em aglomeração, a Febraban recomenda desativar a aproximação por um tempo ou deixar só a carteira digital."], [".", 0]],
    [["O celular dela fica no bolso da frente, ", 0], ["com o mesmo cartão cadastrado na carteira digital", -1, "Não é erro: a carteira digital é a opção mais segura, porque o celular exige biometria ou senha."], [" e ", 0], ["sem bloqueio de tela, \"porque é chato digitar senha toda hora\"", 5, "A segurança da carteira digital depende de biometria ou senha. Sem bloqueio, quem pegar o celular paga como se fosse ela."], [".", 0]],
    [["Na fila do bar, ", 0], ["o visor da maquininha está rachado e quase não dá para ler, mas ela aproxima o cartão mesmo assim", 3, "Sem ler o valor, ela não sabe quanto paga. Visor ilegível é motivo para recusar a máquina."], [". Mais tarde, para economizar bateria, ", 0], ["desliga as notificações do app do banco", 4, "Sem o aviso de cada compra, só se descobre o problema horas ou dias depois, quando outras já foram feitas."], [".", 0]],
    [["Ao sair do show, o cartão físico já não está mais no bolso: foi furtado no meio da multidão. O celular continua com ela. No domingo, Júlia abre o app e percebe que pagou R$ 98 por uma água que custava R$ 8 e que há três compras que ela não fez.", 0]]
  ],
  erros: {
    1: "Aproximação ativa em lugar lotado", 2: "Cartão solto no bolso de trás", 3: "Pagar com o visor ilegível",
    4: "Notificações desligadas", 5: "Celular sem bloqueio de tela"
  },
  tarde: { certa: 4, texto: "As notificações desligadas (erro 4) fizeram Júlia descobrir tarde. Com elas ativas, saberia da primeira compra estranha na hora e bloquearia o cartão antes das demais. Os erros 1 e 2 aumentam a chance de o cartão ser usado; a notificação é o que permite reagir rápido." }
};
