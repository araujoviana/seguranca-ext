# Finds pauses in a cleaned voice track and proposes cuts that shrink each to ~0.3 s.
# usage: pauses.py voice.wav trans.json thr_db out.json [t_first_keep t_last_keep]
import wave, json, sys, numpy as np
wav, trans, thr, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
w = wave.open(wav); sr = w.getframerate()
x = np.frombuffer(w.readframes(w.getnframes()), np.int16) / 32768
dur = len(x) / sr
H = int(sr * 0.02); n = len(x) // H
e = 20 * np.log10(np.sqrt((x[:n*H].reshape(n, H) ** 2).mean(1)) + 1e-9)
words = [y for s in json.load(open(trans)) for y in s['words']]
loud = e > thr
# silent runs
runs = []; i = 0
while i < n:
    if not loud[i]:
        j = i
        while j < n and not loud[j]: j += 1
        runs.append((i * 0.02, j * 0.02)); i = j
    else: i += 1
PAD, MIN = 0.15, 0.42
cuts = []
first, last = words[0]['s'], words[-1]['e']
for a, b in runs:
    if b - a < MIN: continue
    ca, cb = a + PAD, b - PAD
    if a <= 0.01: ca = 0.0; cb = min(b, first) - 0.35          # head: keep 0.35 s before first word
    if b >= dur - 0.03: ca = max(a, last) + 0.7; cb = dur        # tail: keep 0.7 s after last word
    if cb - ca < 0.1: continue
    hit = [y for y in words if ca + 0.05 < y['s'] < cb - 0.05]
    if hit:  # a word start inside: keep the part before it only (whisper often starts words early/late)
        cb = min(y['s'] for y in hit) - 0.12
        if cb - ca < 0.12: print(f"skip {a:.2f}-{b:.2f} word {hit[0]['w']!r}"); continue
    cuts.append([round(ca, 3), round(cb, 3)])
keep = []; t = 0.0
for a, b in cuts:
    if a > t: keep.append([t, a])
    t = b
if t < dur: keep.append([t, round(dur, 3)])
removed = sum(b - a for a, b in cuts)
json.dump({"duration": dur, "cuts": cuts, "keep": keep}, open(out, 'w'), indent=1)
for a, b in cuts: print(f"cut {a:7.2f}-{b:7.2f} ({b-a:4.2f})")
print(f"{len(cuts)} cuts, removed {removed:.1f}s of {dur:.1f}s -> {dur-removed:.1f}s")
