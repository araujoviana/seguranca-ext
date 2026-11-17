# /// script
# dependencies = ["faster-whisper", "numpy"]
# ///
import sys, json, wave, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel("large-v3-turbo", device="cpu", compute_type="int8", cpu_threads=12)
for wav in sys.argv[1:]:
    segs, _ = m.transcribe(np.frombuffer(wave.open(wav).readframes(10**9), np.int16).astype(np.float32)/32768, language="pt", word_timestamps=True)
    ws = [w for s in segs for w in s.words]
    p = np.array([w.probability for w in ws])
    json.dump([{"w": w.word, "s": w.start, "e": w.end, "p": w.probability} for w in ws], open(wav + ".words.json", "w"), ensure_ascii=False)
    print(wav, "words", len(ws), "mean p %.3f" % p.mean(), "p<0.5: %d" % (p < 0.5).sum(), flush=True)
