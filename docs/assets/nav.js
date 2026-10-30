// Cabeçalho comum a todas as páginas
(function () {
  var links = [["index.html", "Início"], ["texto.html", "Texto"], ["caso-pratico.html", "Caso prático"],
    ["desafio.html", "Desafio"], ["quiz.html", "Quiz"], ["checklist.html", "Checklist"],
    ["teste-final.html", "Teste final"], ["infografico.html", "Infográfico"], ["video.html", "Vídeo"]];
  var atual = location.pathname.split("/").pop() || "index.html";
  var nav = links.map(function (l) {
    return '<a href="' + l[0] + '"' + (l[0] === atual ? ' aria-current="page"' : "") + ">" + l[1] + "</a>";
  }).join("");
  var el = document.getElementById("topo");
  if (el) el.innerHTML = '<div class="in"><a class="marca" href="index.html">Pagamento por aproximação</a><nav aria-label="Principal">' + nav + "</nav></div>";
})();
