(function () {
  var D = window.DESAFIO, cena = document.getElementById("cena"), sel = {}, feito = false, id = 0;
  function esc(t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; }
  cena.innerHTML = D.cena.map(function (p) {
    return "<p>" + p.map(function (s) {
      if (s[1] === 0) return esc(s[0]);
      var k = id++;
      return '<span role="button" tabindex="0" class="alvo" aria-pressed="false" data-k="' + k + '" data-e="' + s[1] + '" data-why="' + esc(s[2]).replace(/"/g, "&quot;") + '">' + esc(s[0]) + "</span>";
    }).join("") + "</p>";
  }).join("");
  var contador = document.getElementById("conta"), botao = document.getElementById("verificar");
  cena.querySelectorAll(".alvo").forEach(function (b) {
    b.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); b.click(); } };
    b.onclick = function () {
      if (feito) return;
      var on = b.getAttribute("aria-pressed") !== "true";
      b.setAttribute("aria-pressed", on);
      sel[b.dataset.k] = on;
      contador.textContent = Object.keys(sel).filter(function (k) { return sel[k]; }).length;
    };
  });
  botao.onclick = function () {
    feito = true; botao.disabled = true;
    var achados = {}, falsos = 0, notas = [];
    cena.querySelectorAll(".alvo").forEach(function (b) {
      var e = +b.dataset.e, marcado = b.getAttribute("aria-pressed") === "true";
      if (e > 0 && marcado) { b.classList.add("acerto"); achados[e] = 1; }
      else if (e > 0) b.classList.add("perdeu");
      else if (marcado) { b.classList.add("falso"); falsos++; }
      if (e > 0 || marcado) notas.push('<div class="fb ' + (e > 0 ? (marcado ? "ok" : "") : "no") + '"><b>' + (e > 0 ? "Erro " + e + ": " + esc(D.erros[e]) : "Trecho correto") + "</b>. " + b.dataset.why + "</div>");
    });
    var n = Object.keys(achados).length;
    document.getElementById("resultado").innerHTML =
      '<div class="card"><h2 style="margin-top:0">Você achou ' + n + " dos 5 erros" + (falsos ? ", com " + falsos + " marcação(ões) a mais" : "") + ".</h2>" +
      (n < 5 ? "<p>Os trechos em amarelo são erros que ficaram de fora.</p>" : "<p>Muito bem.</p>") + notas.join("") +
      '<div class="fb"><b>Qual erro fez Júlia descobrir tarde?</b> ' + esc(D.tarde.texto) + "</div>" +
      '<p><a class="btn" href="desafio.html">Refazer</a> <a class="btn sec" href="quiz.html">Fazer o quiz</a></p></div>';
    document.getElementById("resultado").scrollIntoView({ behavior: "smooth" });
  };
})();
