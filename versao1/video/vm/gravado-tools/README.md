# Animações sincronizadas com a gravação real

As pastas `aprox-*` são a versão com voz-guia sintetizada (Kokoro). As pastas `gravado-*` são as mesmas animações, mas com o relógio vindo da fala real do Matheus e do Danilo.

## Como foi feito

1. `transcribe.py`: transcreve as gravações com faster-whisper (`large-v3-turbo`, CPU) e salva o tempo de cada palavra.
2. **Tratamento da voz** (`limpeza/`). O bruto do Danilo veio do WhatsApp muito baixo (-42 LUFS) e com ruído de fundo a uns 22 dB da voz.
   - A voz dele também soava abafada. Em relação à do Matheus, tinha uns 18 dB a mais de grave e uns 13 dB a menos entre 2 e 4 kHz, e não tinha nada acima de 7 kHz.
   - Cadeia de filtros (`limpeza/limpar-voz.sh`):
     - ganho de +16 dB;
     - RNNoise (`arnndn`, modelo `std`) a 50%;
     - EQ de casamento, que aplica 75% da diferença banda a banda em relação à voz do Matheus, limitada entre -14 e +12 dB (`danilo.eq.txt`);
     - exciter para recriar um pouco de brilho entre 3,5 e 11 kHz;
     - de-esser e compressor.
   - Com o RNNoise a 100%, a confiança do Whisper caiu de 0,93 para 0,84, porque o filtro come a fala. A 50%, ficou em 0,94, ou seja, não piora a inteligibilidade.
   - O Matheus só recebeu redução de ruído leve, EQ e compressor.
3. **Corte das pausas.**
   - `pauses.py` acha os silêncios de 0,42 s ou mais na voz tratada e propõe encurtar cada um para cerca de 0,3 s. O corte é pulado quando o Whisper marca o início de uma palavra dentro dele.
   - Também foram feitos à mão dois cortes no Danilo: o "E..." hesitante antes do "Bom," e o final, depois do "Obrigado".
   - `cutvideo.py` aplica os cortes alinhados a quadros de 1/30 s, para que vídeo e áudio tenham exatamente a mesma duração. Ele normaliza a voz em -16 LUFS e gera `brutos/*-cut.mp4`, um mapa de tempo e a transcrição remapeada.
   - Resultado: o Matheus passou de 125,0 s para 115,6 s, e o Danilo de 161,9 s para 141,1 s.
   - Conferência: comparei a transcrição remapeada com uma transcrição nova do bruto cortado. A diferença mediana é de 0,02 s no Matheus e 0,05 s no Danilo.
4. `recorded.json` diz em que trecho de cada gravação cortada cada animação entra e em que palavra cai cada marca (`[#mark]`). O `recorded-raw.json` tem os mesmos dados nos tempos do bruto sem corte.
5. `build-recorded.mjs <film>` monta o `timeline.data.js` com o `buildTimeline` do `vm`. Cada cena começa no tempo real.
6. O `vm` cuida de `mix`, `master`, `qa`, `render --final`, `mux` e `qa --video`, rodando dentro do repositório do `videomaking-skill`.
7. `compose.sh` monta o vídeo final:
   - A câmera fica em tela cheia fora dos trechos de animação.
   - Nos trechos de animação, a animação fica por cima e a webcam aparece num quadro no canto inferior direito.
   - O áudio é a voz tratada, com os efeitos sonoros por baixo, a uns 13 dB da voz.
   - Por baixo de tudo há uma trilha baixinha, uns 20 dB abaixo da voz. Ela é gerada pelo `make_bed.py` do `vm`, sintetizada localmente, então não usa licença de terceiros. É uma faixa contínua: o trecho do Danilo continua de onde termina o do Matheus.
   - Tudo é normalizado em -16 LUFS.

## Trechos (tempos no bruto cortado)

| Vídeo | Animação | Trecho |
|---|---|---|
| `brutos/matheus-cut.mp4` | `gravado-1-funciona` | 19,60 s a 64,03 s |
| `brutos/matheus-cut.mp4` | `gravado-2-golpe` | 64,03 s a 111,43 s |
| `brutos/danilo-cut.mp4` | `gravado-3-protecao` | 12,20 s a 131,00 s |

O `matheus-editado.mp4` é o bruto do Matheus sem a repetição de "Imagina uma lanchonete cheia" (foi cortado o trecho de 67,2 s a 70,6 s do original). Os brutos ficam fora do git, porque `brutos/` está no `.gitignore`. Os vídeos finais ficam na release do GitHub.
