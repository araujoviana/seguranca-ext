#!/usr/bin/env bash
# Final cut: camera full screen, animation full screen during its window with the
# webcam as a picture-in-picture bottom-right (the films keep that corner free).
# Audio = the camera's own voice the whole way + the animations' SFX at their offsets.
set -euo pipefail
R=/mnt/data/Projetos/ai-projs/videomaking-skill/out
B=/mnt/data/Projetos/mack-projs/2sem2026-codigos/seguranca-ext/versao1/video/brutos
C=/mnt/data/videomaking/seguranca-ext/comp
PIP="scale=480:270,setsar=1,pad=488:278:4:4:color=0x1c1c1c,format=yuva420p"
ENC=(-c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -ar 48000 -movflags +faststart)
AUD="loudnorm=I=-16:TP=-1.5:LRA=11"

if [ "${1:-all}" != danilo ]; then
# Matheus: film 1 at 21.40-67.20, film 2 at 67.20-119.00 (back to back).
ffmpeg -v error -y \
  -i "$B/matheus-editado.mp4" -i "$R/gravado-1-funciona/silent.mp4" -i "$R/gravado-2-golpe/silent.mp4" \
  -i "$C/gravado-1-funciona-sfx.wav" -i "$C/gravado-2-golpe-sfx.wav" \
  -filter_complex "
    [0:v]fps=30,scale=1920:1080,setsar=1,split[bg][p0];
    [p0]$PIP,fade=in:st=21.4:d=0.4:alpha=1,fade=out:st=118.6:d=0.4:alpha=1[pip];
    [1:v]format=yuva420p,setpts=PTS-STARTPTS+21.4/TB,fade=in:st=21.4:d=0.4:alpha=1[f1];
    [2:v]format=yuva420p,setpts=PTS-STARTPTS+67.2/TB,fade=out:st=118.6:d=0.4:alpha=1[f2];
    [bg][f1]overlay=enable='between(t,21.4,67.2)':eof_action=pass[b1];
    [b1][f2]overlay=enable='between(t,67.2,119.0)':eof_action=pass[b2];
    [b2][pip]overlay=x=W-w-40:y=H-h-40:enable='between(t,21.4,119.0)'[v];
    [3:a]adelay=21400:all=1[s1];[4:a]adelay=67200:all=1[s2];
    [0:a][s1][s2]amix=inputs=3:normalize=0:duration=first,$AUD[a]" \
  -map "[v]" -map "[a]" "${ENC[@]}" "$C/matheus-final.mp4"

fi
if [ "${1:-all}" != matheus ]; then
# Danilo: film 3 at 14.10-141.00. Source is variable frame rate (WhatsApp), so force 30 fps.
ffmpeg -v error -y \
  -i "$B/danilo-original.mp4" -i "$R/gravado-3-protecao/silent.mp4" -i "$C/gravado-3-protecao-sfx.wav" \
  -filter_complex "
    [0:v]fps=30,scale=1920:1080,setsar=1,split[bg][p0];
    [p0]$PIP,fade=in:st=14.1:d=0.4:alpha=1,fade=out:st=140.6:d=0.4:alpha=1[pip];
    [1:v]format=yuva420p,setpts=PTS-STARTPTS+14.1/TB,fade=in:st=14.1:d=0.4:alpha=1,fade=out:st=140.6:d=0.4:alpha=1[f3];
    [bg][f3]overlay=enable='between(t,14.1,141.0)':eof_action=pass[b1];
    [b1][pip]overlay=x=W-w-40:y=H-h-40:enable='between(t,14.1,141.0)'[v];
    [2:a]adelay=14100:all=1[s3];
    [0:a][s3]amix=inputs=2:normalize=0:duration=first,$AUD[a]" \
  -map "[v]" -map "[a]" "${ENC[@]}" "$C/danilo-final.mp4"

fi
for f in matheus-final danilo-final; do
  [ -f "$C/$f.mp4" ] || continue
  echo "$f $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$C/$f.mp4")s"
done

# Second loudness pass (measured, linear): single-pass loudnorm left Danilo at -18 LUFS.
for f in matheus-final danilo-final; do
  [ -f "$C/$f.mp4" ] || continue
  m=$(ffmpeg -v info -i "$C/$f.mp4" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  val(){ echo "$m" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
  AF="loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(val input_i):measured_TP=$(val input_tp):measured_LRA=$(val input_lra):measured_thresh=$(val input_thresh):offset=$(val target_offset):linear=true,aresample=192000,alimiter=limit=0.82:level=false:attack=2:release=50,aresample=48000"
  ffmpeg -v error -y -i "$C/$f.mp4" -c:v copy -af "$AF" -c:a aac -b:a 192k -movflags +faststart "$C/$f.tmp.mp4" && mv "$C/$f.tmp.mp4" "$C/$f.mp4"
done
