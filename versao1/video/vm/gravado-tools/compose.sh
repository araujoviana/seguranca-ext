#!/usr/bin/env bash
# Final cut: camera full screen, animation full screen during its window with the
# webcam as a picture-in-picture bottom-right (the films keep that corner free).
# Input is the pause-cut raw (brutos/*-cut.mp4, made by clean/cutvideo.py), whose voice is
# already cleaned and at -16 LUFS. Audio = that voice + the animations' SFX stems at their
# offsets (SFX sit ~13 dB under the voice, as vm mixes them under a narration), plus a quiet
# music bed (comp/bed.wav: vm's make_bed.py, synthesized here, no third-party licence, ~20 dB
# under the voice). One continuous bed: Danilo's part picks up where Matheus's ends.
# Window times come from recorded.json (seconds in the cut raw).
set -euo pipefail
R=/mnt/data/Projetos/ai-projs/videomaking-skill/out
B=/mnt/data/Projetos/mack-projs/2sem2026-codigos/seguranca-ext/versao1/video/brutos
C=/mnt/data/videomaking/seguranca-ext/comp
S=/mnt/data/videomaking/seguranca-ext/scripts/recorded.json
PIP="scale=480:270,setsar=1,pad=488:278:4:4:color=0x1c1c1c,format=yuva420p"
ENC=(-c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -r 30 -c:a aac -b:a 192k -ar 48000 -movflags +faststart)
t(){ jq -r ".films[\"$1\"].$2" "$S"; }
ms(){ awk "BEGIN{printf \"%d\", $1*1000}"; }
F=0.4
DM=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$B/matheus-cut.mp4")
DD=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$B/danilo-cut.mp4")

if [ "${1:-all}" != danilo ]; then
A0=$(t gravado-1-funciona t0); A1=$(t gravado-1-funciona t1); B1=$(t gravado-2-golpe t1)
OUT=$(awk "BEGIN{print $B1-$F}")
ffmpeg -v error -y \
  -i "$B/matheus-cut.mp4" -i "$R/gravado-1-funciona/silent.mp4" -i "$R/gravado-2-golpe/silent.mp4" \
  -i "$C/gravado-1-funciona-sfx.wav" -i "$C/gravado-2-golpe-sfx.wav" -i "$C/bed.wav" \
  -filter_complex "
    [0:v]fps=30,scale=1920:1080,setsar=1,split[bg][p0];
    [p0]$PIP,fade=in:st=$A0:d=$F:alpha=1,fade=out:st=$OUT:d=$F:alpha=1[pip];
    [1:v]format=yuva420p,setpts=PTS-STARTPTS+$A0/TB,fade=in:st=$A0:d=$F:alpha=1[f1];
    [2:v]format=yuva420p,setpts=PTS-STARTPTS+$A1/TB,fade=out:st=$OUT:d=$F:alpha=1[f2];
    [bg][f1]overlay=enable='between(t,$A0,$A1)':eof_action=pass[b1];
    [b1][f2]overlay=enable='between(t,$A1,$B1)':eof_action=pass[b2];
    [b2][pip]overlay=x=W-w-40:y=H-h-40:enable='between(t,$A0,$B1)'[v];
    [3:a]adelay=$(ms $A0):all=1[s1];[4:a]adelay=$(ms $A1):all=1[s2];
    [5:a]atrim=0:$DM,asetpts=PTS-STARTPTS,afade=in:d=2[m];
    [0:a][s1][s2][m]amix=inputs=4:normalize=0:duration=first[a]" \
  -map "[v]" -map "[a]" "${ENC[@]}" "$C/matheus-final.mp4"
fi

if [ "${1:-all}" != matheus ]; then
D0=$(t gravado-3-protecao t0); D1=$(t gravado-3-protecao t1)
OUT=$(awk "BEGIN{print $D1-$F}")
ffmpeg -v error -y \
  -i "$B/danilo-cut.mp4" -i "$R/gravado-3-protecao/silent.mp4" -i "$C/gravado-3-protecao-sfx.wav" -i "$C/bed.wav" \
  -filter_complex "
    [0:v]fps=30,scale=1920:1080,setsar=1,split[bg][p0];
    [p0]$PIP,fade=in:st=$D0:d=$F:alpha=1,fade=out:st=$OUT:d=$F:alpha=1[pip];
    [1:v]format=yuva420p,setpts=PTS-STARTPTS+$D0/TB,fade=in:st=$D0:d=$F:alpha=1,fade=out:st=$OUT:d=$F:alpha=1[f3];
    [bg][f3]overlay=enable='between(t,$D0,$D1)':eof_action=pass[b1];
    [b1][pip]overlay=x=W-w-40:y=H-h-40:enable='between(t,$D0,$D1)'[v];
    [2:a]adelay=$(ms $D0):all=1[s3];
    [3:a]atrim=$DM:$(awk "BEGIN{print $DM+$DD}"),asetpts=PTS-STARTPTS,afade=out:st=$(awk "BEGIN{print $DD-3}"):d=3[m];
    [0:a][s3][m]amix=inputs=3:normalize=0:duration=first[a]" \
  -map "[v]" -map "[a]" "${ENC[@]}" "$C/danilo-final.mp4"
fi

# Final loudness pass (measured, linear) + true-peak-safe limiter.
for f in matheus-final danilo-final; do
  [ -f "$C/$f.mp4" ] || continue
  m=$(ffmpeg -v info -i "$C/$f.mp4" -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  val(){ echo "$m" | grep "\"$1\"" | sed 's/.*: "\(.*\)".*/\1/'; }
  AF="loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=$(val input_i):measured_TP=$(val input_tp):measured_LRA=$(val input_lra):measured_thresh=$(val input_thresh):offset=$(val target_offset):linear=true,aresample=192000,alimiter=limit=0.82:level=false:attack=2:release=50,aresample=48000"
  ffmpeg -v error -y -i "$C/$f.mp4" -c:v copy -af "$AF" -c:a aac -b:a 192k -movflags +faststart "$C/$f.tmp.mp4" && mv "$C/$f.tmp.mp4" "$C/$f.mp4"
  echo "$f $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$C/$f.mp4")s"
done
