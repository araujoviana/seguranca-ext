(function () {
  var D = window.DESAFIO, I = window.ICONES, cena = document.getElementById("cena"), sel = {}, feito = false, id = 0;
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
    document.getElementById("legenda").hidden = false;
    var achados = {}, falsos = 0, notas = [];
    cena.querySelectorAll(".alvo").forEach(function (b) {
      var e = +b.dataset.e, marcado = b.getAttribute("aria-pressed") === "true", rot, tit;
      b.removeAttribute("role"); b.removeAttribute("tabindex");
      if (e > 0 && marcado) { b.classList.add("acerto"); achados[e] = 1; rot = I.ok + "Você achou"; tit = "Erro: " + D.erros[e]; }
      else if (e > 0) { b.classList.add("perdeu"); rot = I.no + "Ficou de fora"; tit = "Erro: " + D.erros[e]; }
      else if (marcado) { b.classList.add("falso"); falsos++; rot = I.no + "Não era erro"; tit = "Trecho correto"; }
      else { b.classList.add("neutro"); return; }
      notas.push('<li><span class="rot">' + rot + "</span><span><b>" + esc(tit) + ".</b> " + b.dataset.why + "</span></li>");
    });
    var n = Object.keys(achados).length;
    document.getElementById("resultado").innerHTML =
      '<h2 class="resumo-d" tabindex="-1" id="res" style="margin-top:1.4em">Você achou ' + n + " dos 5 erros" + (falsos ? ", marcando " + falsos + (falsos > 1 ? " trechos" : " trecho") + " a mais" : "") + ".</h2>" +
      '<ul class="achados">' + notas.join("") + "</ul>" +
      '<h3 style="margin-top:1.6em">Qual erro fez Júlia descobrir tarde?</h3><p>' + esc(D.tarde.texto) + "</p>" +
      '<p class="acoes"><a class="btn sec" href="desafio.html">Refazer</a></p>';
    document.getElementById("painel").hidden = true;
    var r = document.getElementById("res"); r.focus({ preventScroll: true }); r.scrollIntoView({ behavior: "smooth", block: "start" });
  };
})();
