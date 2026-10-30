// Narrativa ramificada: cada escolha mostra a consequência e atualiza o prejuízo. Diagramas em SVG.
(function () {
  var C = window.CASO, I = window.ICONES, L = "abcd", raiz = document.getElementById("caso"), n = 0, extra = 0, erros = 0;
  function esc(t) { var d = document.createElement("div"); d.textContent = t; return d.innerHTML; }
  function rs(v) { return "R$ " + v; }

  // Diagrama 1: as quatro compras, cada uma abaixo do limite sem senha
  function dCompras() {
    var esc200 = 240 / C.limite, x0 = 62, topo = 30, h = 34, linhas = "";
    C.compras.forEach(function (v, k) {
      var y = topo + k * h;
      linhas += '<text class="t" x="0" y="' + (y + 17) + '">' + rs(v) + '</text><rect class="barra barra-anim" style="animation-delay:' + (k * 90) + 'ms" x="' + x0 + '" y="' + (y + 3) + '" width="' + (v * esc200) + '" height="20" rx="3"/>';
    });
    var fimY = topo + C.compras.length * h;
    return '<figure class="diagrama"><svg class="dg" viewBox="0 0 360 ' + (fimY + 36) + '" role="img" aria-label="Gráfico de barras: as quatro compras da madrugada, de ' + C.compras.map(rs).join(", ") + ', todas abaixo do limite sem senha de ' + rs(C.limite) + '. Total: ' + rs(C.perda) + '.">' +
      '<text class="p" x="' + (x0 + C.limite * esc200) + '" y="10" text-anchor="end">limite sem senha, em geral ' + rs(C.limite) + '</text>' +
      '<line class="trace" x1="' + (x0 + C.limite * esc200) + '" y1="18" x2="' + (x0 + C.limite * esc200) + '" y2="' + (fimY) + '"/>' +
      linhas + '<line class="linha" x1="0" y1="' + (fimY + 6) + '" x2="360" y2="' + (fimY + 6) + '"/>' +
      '<text class="p" x="0" y="' + (fimY + 28) + '">Total das quatro</text><text class="g" x="360" y="' + (fimY + 30) + '" text-anchor="end">' + rs(C.perda) + "</text></svg>" +
      "<figcaption>Nenhuma compra passou do limite, então nenhuma pediu senha. Quem tem o cartão na mão só precisa aproximar, e por isso o gasto vem dividido em compras pequenas.</figcaption></figure>";
  }

  // Diagrama 2: a ordem certa depois de perceber o problema
  function dOrdem() {
    var passos = [["Bloquear o cartão no app", "feito"], ["Ligar para o banco", ""], ["Contestar as compras que não reconhece", ""], ["Guardar prints e comprovantes", ""]];
    var h = 54, g = 22, out = "";
    passos.forEach(function (p, k) {
      var y = k * (h + g), feito = k === 0;
      out += '<rect class="caixa' + (feito ? " cheia" : "") + '" x="1" y="' + (y + 1) + '" width="358" height="' + h + '" rx="12"/>' +
        '<text class="g" x="22" y="' + (y + h / 2 + 8) + '" style="' + (feito ? "fill:var(--papel)" : "") + '">' + (k + 1) + "</text>" +
        '<text class="t" x="52" y="' + (y + h / 2 + 5) + '"' + (feito ? ' style="fill:var(--papel)"' : "") + ">" + esc(p[0]) + "</text>" +
        (feito ? '<text class="p" x="346" y="' + (y + h / 2 + 5) + '" text-anchor="end" style="fill:var(--papel)">feito</text>' : "");
      if (k < passos.length - 1) {
        var ya = y + h + 1, yb = y + h + g + 1;
        out += '<line class="linha" x1="180" y1="' + ya + '" x2="180" y2="' + (yb - 6) + '"/><path class="seta" d="M174 ' + (yb - 7) + "L180 " + (yb - 1) + "L186 " + (yb - 7) + 'Z"/>';
      }
    });
    var alt = passos.length * (h + g) - g + 2;
    return '<figure class="diagrama"><svg class="dg" viewBox="0 0 360 ' + alt + '" role="img" aria-label="Ordem de ação: 1 bloquear o cartão no app, já feito; 2 ligar para o banco; 3 contestar as compras; 4 guardar prints e comprovantes.">' + out + "</svg>" +
      "<figcaption>A ordem importa: cada minuto com o cartão ativo é uma chance de nova compra.</figcaption></figure>";
  }

  // Diagrama 3: a mesma noite, com e sem notificação
  function dAviso() {
    var xs = [30, 120, 210, 300], c = C.compras, linha1 = 70, linha2 = 168, o = "";
    o += '<text class="t" x="0" y="40">Sem notificação</text><text class="g" x="360" y="42" text-anchor="end">' + rs(C.perda) + '</text><line class="linha" x1="0" y1="' + linha1 + '" x2="360" y2="' + linha1 + '"/>';
    xs.forEach(function (x, k) { o += '<circle class="ponto" cx="' + x + '" cy="' + linha1 + '" r="6"/><text class="p" x="' + x + '" y="' + (linha1 + 26) + '" text-anchor="middle">' + rs(c[k]) + "</text>"; });
    o += '<text class="t" x="0" y="138">Com notificação</text><text class="g" x="360" y="140" text-anchor="end">' + rs(c[0]) + '</text><line class="linha" x1="0" y1="' + linha2 + '" x2="360" y2="' + linha2 + '"/>';
    xs.forEach(function (x, k) {
      o += '<circle class="ponto' + (k ? " v" : "") + '" cx="' + x + '" cy="' + linha2 + '" r="6"/><text class="' + (k ? "p" : "t") + '" x="' + x + '" y="' + (linha2 + 26) + '" text-anchor="middle">' + rs(c[k]) + "</text>";
    });
    o += '<line class="trace" x1="72" y1="' + (linha2 - 22) + '" x2="72" y2="' + (linha2 + 12) + '"/><text class="p" x="78" y="' + (linha2 - 10) + '">aviso e bloqueio</text>';
    return '<figure class="diagrama"><svg class="dg" viewBox="0 0 360 214" role="img" aria-label="Comparação da mesma noite. Sem notificação, as quatro compras passam e o prejuízo é de ' + rs(C.perda) + '. Com notificação, o aviso da primeira compra permite bloquear o cartão e o prejuízo fica em ' + rs(c[0]) + '.">' + o + "</svg>" +
      "<figcaption>Pontos cheios são compras que aconteceram; pontos vazios são compras evitadas pelo bloqueio.</figcaption></figure>";
  }

  function medidor() {
    var total = C.perda + extra, sobe = extra > 0;
    return '<div class="medidor' + (sobe ? " sobe" : "") + '" id="med" role="status"><span class="r">Prejuízo até agora' + (sobe ? ", e subiu" : "") + '</span><span class="v">' + rs(total) + "</span></div>";
  }
  function segs() {
    return '<div class="seg" aria-hidden="true">' + C.cenas.map(function (_, k) { return '<i class="' + (k < n ? "f" : k === n ? "a" : "") + '"></i>'; }).join("") + "</div>";
  }

  function cena() {
    if (n >= C.cenas.length) return fim();
    var c = C.cenas[n];
    raiz.innerHTML = medidor() + (n === 0 ? '<p class="historia">' + esc(C.inicio) + "</p>" + dCompras() : "") + (n === 1 ? dOrdem() : "") +
      '<section class="etapa" aria-labelledby="q">' + segs() + '<p class="etapa-n">Etapa ' + (n + 1) + " de " + C.cenas.length + '</p><h2 id="q" tabindex="-1">' + esc(c.texto) + "</h2>" +
      '<ul class="opcoes">' + c.opcoes.map(function (o, k) {
        return '<li><button class="opcao" type="button" data-k="' + k + '"><span class="l">' + L[k] + "</span><span>" + esc(o.t) + '</span><span class="sinal"></span></button></li>';
      }).join("") + '</ul><div id="fb" aria-live="polite"></div></section>';
    raiz.querySelectorAll(".opcao").forEach(function (b) { b.onclick = function () { escolher(+b.dataset.k); }; });
    if (n > 0) raiz.querySelector("h2").focus({ preventScroll: true });
  }

  function escolher(k) {
    var c = C.cenas[n], o = c.opcoes[k];
    extra += o.extra || 0;
    if (!o.ok) erros++;
    raiz.querySelectorAll(".opcao").forEach(function (b, i) {
      b.disabled = true;
      if (c.opcoes[i].ok) { b.classList.add("certa"); b.querySelector(".sinal").innerHTML = I.ok; }
      else if (i === k) { b.classList.add("errada"); b.querySelector(".sinal").innerHTML = I.no; }
      else b.classList.add("fora");
    });
    document.getElementById("fb").innerHTML =
      '<p class="nota-r ' + (o.ok ? "cert" : "erra") + '"><b>' + (o.ok ? I.ok + "Boa escolha. " : I.no + "Cuidado. ") + "</b>" + esc(o.fb) + (o.extra ? " <b>+ " + rs(o.extra) + ".</b>" : "") + "</p>" +
      '<p class="nota-r apr"><b>O que aprender. </b>' + esc(c.aprende) + '</p><p class="passo-final"><button class="btn" id="prox" type="button">' + (n + 1 < C.cenas.length ? "Continuar" : "Ver desfecho") + I.seta + "</button></p>";
    document.getElementById("med").outerHTML = medidor();
    var p = document.getElementById("prox");
    p.onclick = function () { n++; cena(); window.scrollTo(0, 0); };
    p.focus({ preventScroll: true });
    p.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  function fim() {
    raiz.innerHTML = medidor() + dAviso() + '<h2 tabindex="-1" id="desfecho" style="margin-top:0">Desfecho</h2><p class="historia">' + esc(C.fim) + "</p>" +
      "<p>" + (erros ? "Você errou " + erros + (erros > 1 ? " etapas" : " etapa") + (extra ? " e o prejuízo chegou a <b>" + rs(C.perda + extra) + "</b>" : "") + ". Tente de novo para acertar todas."
        : "Você acertou todas as etapas e segurou o prejuízo em <b>" + rs(C.perda) + "</b>, o mínimo possível depois que as compras já tinham sido feitas.") + "</p>" +
      '<p class="acoes"><button class="btn sec" id="de-novo" type="button">Jogar de novo</button></p>';
    document.getElementById("de-novo").onclick = function () { n = 0; extra = 0; erros = 0; cena(); window.scrollTo(0, 0); };
    document.getElementById("desfecho").focus({ preventScroll: true });
  }
  cena();
})();
