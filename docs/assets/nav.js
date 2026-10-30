// Casca comum a todas as páginas: cabeçalho, menu da trilha, navegação anterior/próximo e rodapé.
(function () {
  function svg(d, extra) {
    return '<svg class="ic" viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || "") + ">" + d + "</svg>";
  }
  // Ícones desenhados no mesmo traço; usados também pelos players.
  window.ICONES = {
    ok: svg('<path d="M4.5 10.5l3.5 3.5 7.5-8"/>'),
    no: svg('<path d="M5.5 5.5l9 9M14.5 5.5l-9 9"/>'),
    seta: svg('<path d="M4 10h11M11 5.5l4.5 4.5-4.5 4.5"/>'),
    volta: svg('<path d="M16 10H5M9 5.5L4.5 10 9 14.5"/>'),
    baixar: svg('<path d="M10 3.5v9M6 9l4 4 4-4M4 16.5h12"/>'),
    menu: svg('<path d="M3.5 6.5h13M3.5 13.5h13"/>')
  };

  var trilha = [
    ["texto.html", "Texto"], ["video.html", "Vídeo", "off"], ["caso-pratico.html", "Caso prático"],
    ["desafio.html", "Desafio"], ["quiz.html", "Quiz"], ["checklist.html", "Checklist"],
    ["infografico.html", "Infográfico"], ["teste-final.html", "Teste final"]
  ];
  window.TRILHA = trilha;
  var atual = location.pathname.split("/").pop() || "index.html";
  var pos = trilha.findIndex(function (l) { return l[0] === atual; });

  var topo = document.getElementById("topo");
  if (topo) {
    var itens = trilha.map(function (l, n) {
      if (l[2]) return '<li><span class="off" aria-disabled="true"><span class="n">' + (n + 1) + "</span><span>" + l[1] + "<small>Na entrega final, 12/11</small></span></span></li>";
      return "<li><a href=\"" + l[0] + "\"" + (n === pos ? ' aria-current="page"' : "") + '><span class="n">' + (n + 1) + "</span>" + l[1] + "</a></li>";
    }).join("");
    topo.innerHTML = '<div class="in"><a class="marca" href="index.html">Pagamento por aproximação</a>' +
      (pos >= 0 ? '<span class="passo" aria-hidden="true">' + (pos + 1) + " de " + trilha.length + "</span>" : "") +
      '<details class="menu"><summary>' + window.ICONES.menu + '<span>Trilha</span></summary><nav aria-label="Trilha"><ol>' + itens + "</ol></nav></details></div>";
    var det = topo.querySelector("details");
    document.addEventListener("click", function (e) { if (det.open && !det.contains(e.target)) det.open = false; });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && det.open) { det.open = false; det.querySelector("summary").focus(); } });
  }

  var main = document.querySelector("main");
  if (main && pos >= 0) {
    var ativos = trilha.filter(function (l) { return !l[2]; }), k = ativos.indexOf(trilha[pos]);
    var ant = ativos[k - 1], prox = ativos[k + 1];
    var p = document.createElement("nav");
    p.className = "pager";
    p.setAttribute("aria-label", "Navegar pela trilha");
    p.innerHTML = (ant ? '<a class="ant" href="' + ant[0] + '">' + window.ICONES.volta + "<span><small>Anterior</small>" + ant[1] + "</span></a>" : "<span></span>") +
      (prox ? '<a class="prox" href="' + prox[0] + '"><span><small>Próximo</small>' + prox[1] + "</span>" + window.ICONES.seta + "</a>"
        : '<a class="prox" href="index.html"><span><small>Fim da trilha</small>Voltar ao início</span>' + window.ICONES.seta + "</a>");
    main.appendChild(p);
  }

  var rodape = document.createElement("footer");
  rodape.id = "rodape";
  rodape.innerHTML = '<div class="in"><p>Matheus Gabriel Viana Araujo (RA 10420444) e Danilo Oliveira Santos (RA 10410905). Projeto de Extensão, Mackenzie, 2º semestre de 2026, Grupo 31. Feito para a plataforma <a href="https://mackseguro.vercel.app/">MackSeguro</a>, que gera o badge e o certificado.</p>' +
    '<p>Uso de IA: o material foi redigido com apoio de IA generativa (Claude, da Anthropic). O tema, a escolha dos objetos e a revisão final são dos integrantes. <a href="https://github.com/araujoviana/seguranca-ext">Código-fonte e PDFs</a>.</p></div>';
  document.body.appendChild(rodape);
})();
