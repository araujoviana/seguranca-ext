// Narrativa ramificada: cada escolha mostra a consequência e atualiza o prejuízo.
(function () {
  var C = window.CASO, raiz = document.getElementById("caso"), n = 0, extra = 0, erros = 0;
  function esc(t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; }
  function medidor() {
    var total = C.perda + extra;
    return '<div class="meter' + (extra ? "" : " ok") + '" aria-live="polite"><span>Prejuízo até agora</span><span>R$ ' + total + "</span></div>";
  }
  function cena() {
    if (n >= C.cenas.length) return fim();
    var c = C.cenas[n];
    raiz.innerHTML = (n === 0 ? '<div class="card"><p>' + esc(C.inicio) + "</p></div>" : "") + medidor() +
      '<div class="card"><p class="lead" style="margin-top:0">Etapa ' + (n + 1) + " de " + C.cenas.length + "</p><h2 style=\"margin-top:0;font-size:1.15rem\">" + esc(c.texto) + "</h2>" +
      '<ul class="opcoes">' + c.opcoes.map(function (o, k) {
        return '<li><button class="opcao" data-k="' + k + '"><span>' + esc(o.t) + "</span></button></li>";
      }).join("") + '</ul><div id="fb" aria-live="polite"></div></div>';
    raiz.querySelectorAll(".opcao").forEach(function (b) { b.onclick = function () { escolher(+b.dataset.k); }; });
  }
  function escolher(k) {
    var c = C.cenas[n], o = c.opcoes[k];
    extra += o.extra || 0;
    if (!o.ok) erros++;
    raiz.querySelectorAll(".opcao").forEach(function (b, i) {
      b.disabled = true;
      if (c.opcoes[i].ok) b.classList.add("certa"); else if (i === k) b.classList.add("errada");
    });
    var fb = document.getElementById("fb");
    fb.innerHTML = '<div class="fb ' + (o.ok ? "ok" : "no") + '"><b>' + (o.ok ? "Boa escolha. " : "Cuidado. ") + "</b>" + esc(o.fb) + "</div>" +
      '<div class="fb"><b>O que aprender:</b> ' + esc(c.aprende) + '</div><button class="btn" id="prox">' + (n + 1 < C.cenas.length ? "Continuar" : "Ver desfecho") + "</button>";
    raiz.querySelector(".meter").outerHTML = medidor();
    document.getElementById("prox").onclick = function () { n++; cena(); window.scrollTo(0, 0); };
    document.getElementById("prox").focus();
  }
  function fim() {
    raiz.innerHTML = medidor() + '<div class="card"><h2 style="margin-top:0">Desfecho</h2><p>' + esc(C.fim) + "</p>" +
      '<p>' + (erros ? "Você errou " + erros + (erros > 1 ? " etapas" : " etapa") + (extra ? " e o prejuízo chegou a <b>R$ " + (C.perda + extra) + "</b>" : "") + ". Tente de novo para acertar todas." : "Você acertou todas as etapas e segurou o prejuízo em <b>R$ " + C.perda + "</b>, o mínimo possível depois que as compras já tinham sido feitas.") + "</p>" +
      '<p><button class="btn" id="de-novo">Jogar de novo</button> <a class="btn sec" href="desafio.html">Ir para o desafio</a></p></div>';
    document.getElementById("de-novo").onclick = function () { n = 0; extra = 0; erros = 0; cena(); };
  }
  cena();
})();
