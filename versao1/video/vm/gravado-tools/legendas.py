"""Gera a legenda WebVTT do vídeo completo a partir das transcrições remapeadas.

Uso: uv run python -I legendas.py recorded.json matheus-cut.json danilo-cut.json OFFSET saida.vtt
OFFSET = duração do trecho do Matheus (o do Danilo começa logo depois).
Aplica as mesmas correções de nome do recorded.json ("firma ban" -> "Febraban").
Cada legenda tem no máximo 2 linhas de 42 caracteres e 6 s, e quebra em fim de frase.
"""
import json
import sys

MAX_LINHA, MAX_DUR = 42, 6.0


def palavras(path, fixes, off):
    out = []
    for seg in json.load(open(path, encoding="utf-8")):
        for w in seg["words"]:
            t = w["w"].strip()
            if t in fixes:
                if fixes[t] is None:
                    out[-1]["e"] = w["e"] + off
                    continue
                t = fixes[t]
            out.append({"t": t, "s": w["s"] + off, "e": w["e"] + off})
    return out


def linhas(texto):
    ls, cur = [], ""
    for p in texto.split():
        if cur and len(cur) + 1 + len(p) > MAX_LINHA:
            ls.append(cur)
            cur = p
        else:
            cur = f"{cur} {p}".strip()
    return ls + [cur] if cur else ls


def blocos(ws):
    out, cur = [], []
    for w in ws:
        cand = " ".join(x["t"] for x in cur + [w])
        if cur and (len(linhas(cand)) > 2 or w["e"] - cur[0]["s"] > MAX_DUR):
            out.append(cur)
            cur = []
        cur.append(w)
        if w["t"][-1] in ".?!":
            out.append(cur)
            cur = []
    return out + [cur] if cur else out


def ts(x):
    h, r = divmod(x, 3600)
    m, s = divmod(r, 60)
    return f"{int(h):02d}:{int(m):02d}:{s:06.3f}"


def main():
    spec, tm, td, off, saida = sys.argv[1:]
    fixes = json.load(open(spec, encoding="utf-8"))["fixes"]
    ws = palavras(tm, fixes, 0) + palavras(td, fixes, float(off))
    bs = blocos(ws)
    out = ["WEBVTT", ""]
    for i, b in enumerate(bs):
        fim = b[-1]["e"] + 0.3
        if i + 1 < len(bs):
            fim = min(fim, bs[i + 1][0]["s"])
        out += [ts(b[0]["s"]), ""]
        out[-2] = f"{ts(b[0]['s'])} --> {ts(fim)}"
        out[-1:] = linhas(" ".join(w["t"] for w in b)) + [""]
    open(saida, "w", encoding="utf-8").write("\n".join(out))
    print(f"{len(bs)} legendas, {len(ws)} palavras")


main()
