#!/usr/bin/env bash
# Gera os PDFs de entrega a partir dos .md desta pasta.
# Uso: ./gerar-pdfs.sh   (requer pandoc + xelatex)
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
    -V geometry:margin=2.2cm \
    -V colorlinks=true -V urlcolor=blue
  echo "ok  $out"
done

cp -f "Infográfico de segurança em pagamentos por aproximação.pdf" pdf/8-infografico.pdf
echo "ok  pdf/8-infografico.pdf"
