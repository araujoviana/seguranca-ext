// O pandoc já gera as caixas de seleção; aqui só guardamos as marcações neste navegador.
(function () {
  var chave = "aprox-checklist", salvo = {}, caixas = document.querySelectorAll("main li input[type=checkbox]");
  try { salvo = JSON.parse(localStorage.getItem(chave) || "{}"); } catch (e) {}
  caixas.forEach(function (c, n) {
    c.disabled = false;
    c.checked = !!salvo[n];
    c.parentNode.parentNode.parentNode.classList.add("checklist");
    c.insertAdjacentHTML("afterend", "<span></span>");
    var s = c.nextSibling, t = s.nextSibling;
    while (t) { var prox = t.nextSibling; s.appendChild(t); t = prox; }
    c.onchange = function () {
      salvo[n] = c.checked;
      try { localStorage.setItem(chave, JSON.stringify(salvo)); } catch (x) {}
    };
  });
  var b = document.createElement("p");
  b.innerHTML = '<button class="btn sec" type="button">Limpar marcações</button> <button class="btn" type="button">Imprimir</button>';
  b.children[0].onclick = function () {
    caixas.forEach(function (c) { c.checked = false; });
    try { localStorage.removeItem(chave); } catch (e) {}
  };
  b.children[1].onclick = function () { window.print(); };
  document.getElementById("conteudo").insertBefore(b, document.querySelector("main h2"));
})();
