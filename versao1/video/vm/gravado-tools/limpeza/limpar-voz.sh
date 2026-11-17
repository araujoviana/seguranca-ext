#!/usr/bin/env bash
# Voice cleanup used before cutting pauses. Models: gh repo clone richardpl/arnndn-models rnn
# usage: limpar-voz.sh <bruto.mp4> <danilo|matheus> <out.wav>
set -euo pipefail
POST="highpass=f=80,equalizer=f=250:t=q:w=1:g=-2,equalizer=f=3200:t=q:w=1.2:g=3,acompressor=threshold=-24dB:ratio=3:attack=8:release=150:makeup=2,alimiter=limit=0.9"
case "$2" in
  # WhatsApp audio at -42 LUFS, muffled (+18 dB bass, -13 dB at 2-4 kHz vs Matheus, nothing above 7 kHz).
  # +16 dB, RNNoise at 50 % (100 % hurt intelligibility), matching EQ = 75 % of the band difference to
  # Matheus clamped to [-14, +12] dB (danilo.eq.txt), exciter to rebuild some 3.5-11 kHz, de-esser, compressor.
  danilo) AF="highpass=f=120,volume=16dB,arnndn=m=rnn/std.rnnn:mix=0.5,firequalizer=gain_entry='$(cat "$(dirname "$0")/danilo.eq.txt")',equalizer=f=300:t=q:w=1.2:g=-4,aexciter=level_in=1:level_out=1:amount=2:drive=6:blend=0:freq=3500:ceil=11000,deesser=i=0.4,acompressor=threshold=-24dB:ratio=3:attack=8:release=150:makeup=2,alimiter=limit=0.9" ;;
  matheus) AF="highpass=f=80,afftdn=nr=8:nf=-70:tn=1,equalizer=f=3000:t=q:w=1.2:g=1.5,acompressor=threshold=-22dB:ratio=2.5:attack=8:release=120:makeup=2,alimiter=limit=0.9" ;;
esac
ffmpeg -v error -y -i "$1" -vn -ac 1 -ar 48000 -af "$AF" "$3"
