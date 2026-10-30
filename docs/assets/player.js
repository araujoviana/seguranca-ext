// Player de questões de múltipla escolha. Dados em window.DADOS (data/quiz.js ou data/teste.js).
(function () {
  var Q = window.DADOS, L = "abcd", i = 0, acertos = 0, respostas = [];
  var raiz = document.getElementById("player"), meta = raiz.dataset;
  function esc(t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; }

  function tela() {
    if (i >= Q.length) return fim();
    var q = Q[i];
    raiz.innerHTML =
      '<p class="lead" aria-live="polite">Questão ' + (i + 1) + " de " + Q.length + "</p>" +
      '<div class="prog" role="progressbar" aria-valuemin="0" aria-valuemax="' + Q.length + '" aria-valuenow="' + i + '"><i style="width:' + (i / Q.length * 100) + '%"></i></div>' +
      '<div class="card"><h2 style="margin-top:0">' + esc(q.pergunta) + "</h2>" +
      '<ul class="opcoes">' + q.opcoes.map(function (o, k) {
        return '<li><button class="opcao" data-k="' + k + '"><span class="l">' + L[k] + ")</span><span>" + esc(o) + "</span></button></li>";
      }).join("") + '</ul><div id="fb" aria-live="polite"></div><button class="btn" id="prox" hidden></button></div>';
    raiz.querySelectorAll(".opcao").forEach(function (b) { b.onclick = function () { responder(+b.dataset.k); }; });
    var h = raiz.querySelector("h2"); h.tabIndex = -1; h.focus({ preventScroll: true });
  }

  function responder(k) {
    var q = Q[i], ok = k === q.correta;
    if (ok) acertos++;
    respostas.push(ok);
    raiz.querySelectorAll(".opcao").forEach(function (b, n) {
      b.disabled = true;
      if (n === q.correta) b.classList.add("certa");
      else if (n === k) b.classList.add("errada");
      var li = b.parentNode, e = document.createElement("p");
      e.className = "expl";
      e.innerHTML = "<b>" + (n === q.correta ? "Correta. " : "Incorreta. ") + "</b>" + esc(q.explicacoes[n].replace(/^(Correta|Incorreta)\.\s*/, ""));
      li.appendChild(e);
    });
    document.getElementById("fb").innerHTML = '<div class="fb ' + (ok ? "ok" : "no") + '"><b>' + (ok ? "Você acertou." : "Não foi dessa vez.") + "</b> A resposta certa é a letra " + L[q.correta] + ".</div>";
    var p = document.getElementById("prox");
    p.hidden = false; p.textContent = i + 1 < Q.length ? "Próxima questão" : "Ver resultado";
    p.onclick = function () { i++; tela(); window.scrollTo(0, 0); };
    p.focus();
  }

  function fim() {
    var pct = Math.round(acertos / Q.length * 100), aprov = pct >= (+meta.minimo || 70);
    raiz.innerHTML = '<div class="card placar"><div class="n">' + acertos + "/" + Q.length + "</div>" +
      "<p><b>" + pct + "% de acertos.</b> " + (aprov ? meta.msgOk : meta.msgNo) + "</p>" +
      '<p><button class="btn" id="de-novo">Refazer</button></p></div>' +
      '<div class="card"><h2 style="margin-top:0">Revisão</h2><ol>' + Q.map(function (q, n) {
        return "<li>" + (respostas[n] ? "✔ " : "✘ ") + esc(q.pergunta) + " <i>(certa: " + L[q.correta] + ")</i></li>";
      }).join("") + "</ol></div>";
    document.getElementById("de-novo").onclick = function () { i = 0; acertos = 0; respostas = []; tela(); };
    try { localStorage.setItem("aprox-" + meta.chave, JSON.stringify({ acertos: acertos, total: Q.length })); } catch (e) {}
  }
  tela();
})();
