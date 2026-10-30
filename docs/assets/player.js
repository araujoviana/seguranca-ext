// Player de questões de múltipla escolha. Dados em window.DADOS (data/quiz.js ou data/teste.js).
// Uma questão por tela; depois da resposta mostra só a alternativa escolhida e a correta.
(function () {
  var Q = window.DADOS, L = "abcd", I = window.ICONES, i = 0, acertos = 0, respostas = [];
  var raiz = document.getElementById("player"), meta = raiz.dataset;
  function esc(t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; }
  function limpa(t) { return esc(t.replace(/^(Correta|Incorreta)\.\s*/, "")); }

  function segmentos(fim) {
    return '<div class="seg" role="progressbar" aria-label="Progresso" aria-valuemin="0" aria-valuemax="' + Q.length + '" aria-valuenow="' + (fim ? Q.length : i) + '">' +
      Q.map(function (_, n) { return '<i class="' + (n < i || fim ? "f" : n === i ? "a" : "") + '"></i>'; }).join("") + "</div>";
  }

  function tela() {
    if (i >= Q.length) return fim();
    var q = Q[i];
    raiz.innerHTML = segmentos() + '<p class="contagem">Questão ' + (i + 1) + " de " + Q.length + "</p>" +
      '<h2 class="pergunta" tabindex="-1">' + esc(q.pergunta) + "</h2>" +
      '<ul class="opcoes">' + q.opcoes.map(function (o, k) {
        return '<li><button class="opcao" type="button" data-k="' + k + '"><span class="l">' + L[k] + "</span><span>" + esc(o) + '</span><span class="sinal"></span></button></li>';
      }).join("") + '</ul><div id="retorno" aria-live="polite"></div>';
    raiz.querySelectorAll(".opcao").forEach(function (b) { b.onclick = function () { responder(+b.dataset.k); }; });
    raiz.querySelector(".pergunta").focus({ preventScroll: true });
  }

  function responder(k) {
    var q = Q[i], ok = k === q.correta;
    if (ok) acertos++;
    respostas.push(k);
    raiz.querySelectorAll(".opcao").forEach(function (b, n) {
      b.disabled = true;
      if (n === q.correta) { b.classList.add("certa"); b.querySelector(".sinal").innerHTML = I.ok; }
      else if (n === k) { b.classList.add("errada"); b.querySelector(".sinal").innerHTML = I.no; }
      else b.classList.add("fora");
    });
    var blocos = "";
    if (!ok) blocos += "<dt>Você marcou a letra " + L[k] + "</dt><dd>" + limpa(q.explicacoes[k]) + "</dd>";
    blocos += "<dt>" + (ok ? "Por que a letra " + L[k] + " está certa" : "Resposta certa: letra " + L[q.correta]) + "</dt><dd>" + limpa(q.explicacoes[q.correta]) + "</dd>";
    var ultima = i + 1 >= Q.length;
    document.getElementById("retorno").innerHTML = '<div class="retorno"><p class="tit">' + (ok ? I.ok + "Você acertou." : I.no + "Não foi dessa vez.") + "</p><dl>" + blocos + "</dl>" +
      '<p class="passo-final"><button class="btn" type="button" id="prox">' + (ultima ? "Ver resultado" : "Próxima questão") + I.seta + "</button></p></div>";
    var p = document.getElementById("prox");
    p.onclick = function () { i++; tela(); window.scrollTo(0, 0); };
    p.focus({ preventScroll: true });
    p.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function fim() {
    var pct = Math.round(acertos / Q.length * 100), aprov = pct >= (+meta.minimo || 70);
    raiz.innerHTML = segmentos(true) + '<div class="placar"><div class="n">' + acertos + "<small>/" + Q.length + "</small></div>" +
      '<p class="res" tabindex="-1">' + (aprov ? meta.msgOk : meta.msgNo) + "</p><p>" + pct + "% de acertos. Mínimo para aprovação: " + (+meta.minimo || 70) + "%.</p>" +
      '<p class="acoes"><button class="btn" type="button" id="de-novo">Refazer</button></p></div>' +
      '<ol class="revisao" aria-label="Revisão">' + Q.map(function (q, n) {
        var ok = respostas[n] === q.correta;
        return '<li class="' + (ok ? "o" : "e") + '">' + (ok ? I.ok : I.no) + "<span>" + esc(q.pergunta) + "<small>" + (ok ? "Você acertou (letra " + L[q.correta] + ")." : "Certa: letra " + L[q.correta] + ". Você marcou " + L[respostas[n]] + ".") + "</small></span></li>";
      }).join("") + "</ol>";
    document.getElementById("de-novo").onclick = function () { i = 0; acertos = 0; respostas = []; tela(); window.scrollTo(0, 0); };
    raiz.querySelector(".res").focus({ preventScroll: true });
    try { localStorage.setItem("aprox-" + meta.chave, JSON.stringify({ acertos: acertos, total: Q.length })); } catch (e) {}
  }

  document.addEventListener("keydown", function (e) {
    var k = L.indexOf(e.key.toLowerCase()), b = raiz.querySelectorAll(".opcao");
    if (k >= 0 && b[k] && !b[k].disabled && !e.metaKey && !e.ctrlKey && !e.altKey) b[k].click();
  });
  tela();
})();
