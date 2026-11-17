# Animações sincronizadas com a gravação real

As pastas `aprox-*` são a versão com voz-guia sintetizada (Kokoro). As pastas `gravado-*` são as mesmas animações, mas com o relógio vindo da fala real do Matheus e do Danilo.

## Como foi feito

1. `transcribe.py`: transcreve as gravações com faster-whisper (`large-v3-turbo`, CPU) e salva os tempos de cada palavra em `transcricoes/*.json`.
2. `recorded.json`: diz em que trecho de cada gravação cada animação entra e em que palavra cai cada marca (`[#mark]`). Os tempos são absolutos no vídeo bruto.
3. `build-recorded.mjs <film>`: monta o `timeline.data.js` com o `buildTimeline` do `vm`. Cada cena começa no tempo real, e o script também gera o `script.md` com o texto falado de verdade e a `narration.wav` cortada da gravação.
4. O `vm` cuida do resto (`mix`, `master`, `qa`, `render --final`, `mux`, `qa --video`), rodando dentro do repositório do `videomaking-skill`.
5. `compose.sh`: deixa a câmera em tela cheia, coloca a animação por cima nos trechos dela com a webcam num quadro embaixo à direita, e soma o áudio da câmera com os efeitos sonoros (normalizado em -16 LUFS).

## Trechos

| Vídeo | Animação | Trecho no bruto |
|---|---|---|
| `brutos/matheus-editado.mp4` | `gravado-1-funciona` | 21,40 s a 67,20 s |
| `brutos/matheus-editado.mp4` | `gravado-2-golpe` | 67,20 s a 119,00 s |
| `brutos/danilo-original.mp4` | `gravado-3-protecao` | 14,10 s a 141,00 s |

O `matheus-editado.mp4` é o bruto do Matheus sem a repetição de "Imagina uma lanchonete cheia": foi cortado o trecho de 67,2 s a 70,6 s do original. Os brutos ficam fora do git (`brutos/` está no `.gitignore`). Os vídeos finais ficam na release do GitHub.
