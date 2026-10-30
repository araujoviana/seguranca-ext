#!/usr/bin/env bash
# Gera as páginas estáticas de docs/ (GitHub Pages) a partir dos .md e dos dados do quiz/teste.
# Uso: ./gerar-site.sh   (requer pandoc; python via uv)
set -euo pipefail
cd "$(dirname "$0")"
uv run python -I gerar-dados.py

pagina() { # md saida classe [checklist]
  local extra=()
  [ "${4:-}" = checklist ] && extra=(-V checklist=1)
  pandoc "$1" -o "../docs/$2" -f markdown -t html5 --standalone --template=site-template.html --lua-filter=site-filtro.lua \
    -V classe="$3" "${extra[@]}" --wrap=none
  echo "ok  docs/$2"
}
pagina 1-texto.md texto.html texto
pagina 6-checklist.md checklist.html checklist checklist
