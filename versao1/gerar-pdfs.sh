#!/usr/bin/env bash
# Gera os PDFs de entrega a partir dos .md desta pasta.
# Uso: ./gerar-pdfs.sh   (requer pandoc + xelatex + chromium)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p pdf

for md in [0-9]-*.md; do
  out="pdf/${md%.md}.pdf"
  pandoc "$md" -o "$out" \
    -f markdown+hard_line_breaks \
    --pdf-engine=xelatex \
    -V lang=pt-BR \
    -V mainfont="DejaVu Sans" \
    -V fontsize=11pt \
    -V papersize=a4 -V geometry:margin=2.2cm \
    -V colorlinks=true -V urlcolor=blue
  echo "ok  $out"
done

chromium --headless --disable-gpu --no-sandbox --no-pdf-header-footer \
  --print-to-pdf=pdf/8-infografico.pdf "file://$PWD/infografico/infografico.html" >/dev/null 2>&1
echo "ok  pdf/8-infografico.pdf"

# Infográfico em PNG (2x) e cópia dos entregáveis para a pasta de downloads do site (docs/)
chromium --headless --disable-gpu --no-sandbox --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=900,1960 --screenshot=pdf/8-infografico.png "file://$PWD/infografico/infografico.html" >/dev/null 2>&1
echo "ok  pdf/8-infografico.png"
mkdir -p ../docs/downloads
cp pdf/*.pdf pdf/8-infografico.png ../docs/downloads/
echo "ok  docs/downloads"
