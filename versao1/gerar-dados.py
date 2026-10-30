"""Extrai quiz e teste final dos .md para docs/data/*.json e *.js (fonte única do site).
Uso: python3 -I gerar-dados.py"""
import json, re, sys
from pathlib import Path

AQUI = Path(__file__).resolve().parent
SAIDA = AQUI.parent / "docs" / "data"


def limpar(t):
    return re.sub(r"\*\*|\*", "", t).strip()


def parse(md):
    questoes = []
    for bloco in re.split(r"^## Questão \d+\s*$", md, flags=re.M)[1:]:
        bloco = bloco.split("\n---\n")[0]
        linhas = [l for l in bloco.strip().splitlines()]
        pergunta = limpar(linhas[0])
        opcoes = {m.group(1): m.group(2).strip() for l in linhas
                  if (m := re.match(r"^([a-d])\) (.+)$", l))}
        correta = re.search(r"Resposta correta: ([a-d])", bloco).group(1)
        expl = {m.group(1): limpar(m.group(3)) for l in linhas
                if (m := re.match(r"^- \*\*([a-d])\) (Correta|Incorreta)\.\*\* (.+)$", l))}
        assert list(opcoes) == list("abcd") and list(expl) == list("abcd"), pergunta
        questoes.append({
            "id": len(questoes) + 1,
            "pergunta": pergunta,
            "opcoes": [opcoes[k] for k in "abcd"],
            "correta": "abcd".index(correta),
            "explicacoes": [expl[k] for k in "abcd"],
        })
    return questoes


def ts(nome, q):
    """Questões no formato `Questao` do mackseguro (src/data/mock.ts)."""
    itens = ",\n".join(
        "  { id: %d, pergunta: %s, opcoes: %s, respostaCorreta: %d }"
        % (x["id"], json.dumps(x["pergunta"], ensure_ascii=False),
           json.dumps(x["opcoes"], ensure_ascii=False), x["correta"]) for x in q)
    return f"export const questoes{nome.capitalize()}: Questao[] = [\n{itens},\n];\n"


TS = ["// Gerado por versao1/gerar-dados.py. Colar em src/data/mock.ts (tipo Questao já existe lá).\n"]
for nome, arq, n in (("quiz", "5-quiz.md", 5), ("teste", "7-teste-final.md", 10)):
    q = parse((AQUI / arq).read_text(encoding="utf-8"))
    assert len(q) == n, (nome, len(q))
    SAIDA.mkdir(parents=True, exist_ok=True)
    (SAIDA / f"{nome}.json").write_text(json.dumps(q, ensure_ascii=False, indent=1), encoding="utf-8")
    (SAIDA / f"{nome}.js").write_text(
        "window.DADOS = " + json.dumps(q, ensure_ascii=False) + ";\n", encoding="utf-8")  # carrega também via file://
    TS.append(ts(nome, q))
    gab = "".join("abcd"[x["correta"]] for x in q)
    longa = [x["id"] for x in q if max(range(4), key=lambda i: len(x["opcoes"][i])) == x["correta"]]
    print(f"{nome}: {len(q)} questões, gabarito {gab}, correta é a mais longa em: {longa}")

destino = AQUI.parent / "mackseguro"
destino.mkdir(exist_ok=True)
(destino / "questoes-pagamentos-aproximacao.ts").write_text("\n".join(TS), encoding="utf-8")
