// O pandoc já gera as caixas de seleção; aqui guardamos as marcações neste navegador e mostramos a contagem.
(function () {
  var chave = "aprox-checklist", salvo = {}, caixas = document.querySelectorAll("main li input[type=checkbox]");
  try { salvo = JSON.parse(localStorage.getItem(chave) || "{}"); } catch (e) {}
  var barra = document.createElement("div");
  barra.className = "acoes";
  barra.innerHTML = '<span class="contagem" id="cont" aria-live="polite" style="align-self:center;margin-right:auto"></span>' +
    '<button class="btn sec" type="button">Limpar</button><button class="btn" type="button">Imprimir</button>';
  var cont = barra.querySelector("#cont");
  function conta() {
    var m = 0; caixas.forEach(function (c) { if (c.checked) m++; });
    cont.textContent = m + " de " + caixas.length + " marcados";
  }
  caixas.forEach(function (c, n) {
    c.disabled = false;
    c.checked = !!salvo[n];
    c.closest("ul").classList.add("itens");
    c.insertAdjacentHTML("afterend", "<span></span>");
    var s = c.nextSibling, t = s.nextSibling;
    while (t) { var prox = t.nextSibling; s.appendChild(t); t = prox; }
    c.onchange = function () {
      salvo[n] = c.checked; conta();
      try { localStorage.setItem(chave, JSON.stringify(salvo)); } catch (x) {}
    };
  });
  barra.children[1].onclick = function () {
    caixas.forEach(function (c) { c.checked = false; }); conta();
    try { localStorage.removeItem(chave); } catch (e) {}
  };
  barra.children[2].onclick = function () { window.print(); };
  var h = document.querySelector("main h1");
  h.parentNode.insertBefore(barra, document.querySelector("main h2"));
  conta();
})();
