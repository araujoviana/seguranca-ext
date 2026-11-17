# Cuts pauses out of a raw recording: video from the raw file, audio = the cleaned voice,
# both trimmed to the same frame-aligned segments. Writes <name>-cut.mp4 and a time map,
# and remaps the whisper transcript through it.
# usage: cutvideo.py raw.mp4 voice.wav cuts.json trans.json out.mp4 map.json trans-out.json
import json, sys, subprocess
raw, voice, cutsf, transf, out, mapf, transout = sys.argv[1:8]
FPS = 30
snap = lambda t: round(round(t * FPS) / FPS, 6)
keep = [[snap(a), snap(b)] for a, b in json.load(open(cutsf))['keep']]
keep = [k for k in keep if k[1] - k[0] >= 1 / FPS]
segs = []; t = 0.0
for a, b in keep:
    segs.append({"a": a, "b": b, "at": round(t, 6)}); t += b - a
total = t
def remap(x):
    for s in segs:
        if x < s['a']: return s['at']
        if x <= s['b']: return s['at'] + x - s['a']
    return total
json.dump({"src": raw, "fps": FPS, "duration": total, "segments": segs}, open(mapf, 'w'), indent=1)
tr = json.load(open(transf))
for s in tr:
    for w in s['words']: w['s'], w['e'] = round(remap(w['s']), 3), round(remap(w['e']), 3)
    s['start'], s['end'] = round(remap(s['start']), 3), round(remap(s['end']), 3)
json.dump(tr, open(transout, 'w'), ensure_ascii=False, indent=1)
sel = '+'.join(f"between(n,{round(a * FPS)},{round(b * FPS) - 1})" for a, b in keep)
asel = '+'.join(f"between(t,{a},{b})" for a, b in keep)
# voice: cut, then 2-pass loudnorm to -19 LUFS mono (= -16 once duplicated to stereo)
cutv = out.replace('.mp4', '.voice.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', voice, '-af', f"aselect='{asel}',asetpts=N/SR/TB", '-ac', '1', '-ar', '48000', cutv], check=True)
m = subprocess.run(['ffmpeg', '-hide_banner', '-i', cutv, '-af', 'loudnorm=I=-19:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
j = json.loads(m[m.rindex('{'):m.rindex('}') + 1])
ln = (f"loudnorm=I=-19:TP=-1.5:LRA=11:measured_I={j['input_i']}:measured_TP={j['input_tp']}:measured_LRA={j['input_lra']}"
      f":measured_thresh={j['input_thresh']}:offset={j['target_offset']}:linear=true")
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-i', cutv, '-filter_complex',
    f"[0:v]fps={FPS},select='{sel}',setpts=N/{FPS}/TB[v];[1:a]{ln},aresample=48000,pan=stereo|c0=c0|c1=c0[a]",
    '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', out], check=True)
print(out, 'expected', round(total, 3))
