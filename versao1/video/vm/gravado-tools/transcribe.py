# /// script
# dependencies = ["faster-whisper", "numpy"]
# ///
import sys, json, wave, numpy as np
from faster_whisper import WhisperModel
m = WhisperModel("large-v3-turbo", device="cpu", compute_type="int8", cpu_threads=12)
for wav in sys.argv[1:]:
    segs, info = m.transcribe(np.frombuffer(wave.open(wav).readframes(10**9), np.int16).astype(np.float32)/32768, language="pt", word_timestamps=True, vad_filter=False)
    out = []
    for s in segs:
        out.append({"start": s.start, "end": s.end, "text": s.text,
                    "words": [{"w": w.word, "s": w.start, "e": w.end} for w in s.words]})
        print(f"[{s.start:7.2f}-{s.end:7.2f}]{s.text}", flush=True)
    json.dump(out, open(wav.replace("/audio/", "/trans/").replace(".wav", ".json"), "w"), ensure_ascii=False, indent=1)
    print("=== done", wav, flush=True)
