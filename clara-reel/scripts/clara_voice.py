"""Synthesize Clara's v2 narration (Kokoro af_heart) and per-word timings.

Usage:
  python3 scripts/clara_voice.py <kokoro.onnx> <voices.npz> <script.json> <out.wav> <timing.json>

Generic version of v2_voice.py: any episode script, with number/abbreviation readings in "spoken".
Names are given explicit IPA (see "ipa" in the script) so Clara says them correctly, and
years are written out in "say" so she reads 2005 as "two thousand five".
"""
import json
import re
import sys

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

SR = 24000

model, voices, SCRIPT, OUT_WAV, OUT_JSON = sys.argv[1:6]
cfg = json.load(open(SCRIPT, encoding="utf-8"))
k = Kokoro(model, voices)
ph = lambda t: k.tokenizer.phonemize(t, "en-us")  # noqa: E731

# Map each overridden word's default phonemes -> corrected IPA.
overrides = {ph(w).strip(): ipa for w, ipa in cfg["ipa"].items()}


def phonemes_for(text: str) -> str:
    out = ph(text)
    for wrong, right in sorted(overrides.items(), key=lambda kv: -len(kv[0])):
        out = out.replace(wrong, right)
    return out


def trim(a: np.ndarray, thr=0.012, pad=0.04):
    idx = np.where(np.abs(a) > thr)[0]
    if len(idx) == 0:
        return a
    s = max(0, idx[0] - int(pad * SR))
    e = min(len(a), idx[-1] + int(pad * SR))
    return a[s:e]


SPOKEN = cfg.get("spoken", {})


def weight(word: str) -> float:
    bare = word.strip(".,:?!…")
    w = cfg["ipa"].get(bare, None)
    core = w if w else ph(SPOKEN.get(bare, bare)) or word
    n = len(re.sub(r"[ˈˌː\s]", "", core))
    if word.endswith((",", ":")):
        n += 3
    if word.endswith((".", "?", "!", "…")):
        n += 4
    return max(2, n)


audio = [np.zeros(int(cfg["lead_in"] * SR), dtype=np.float32)]
cursor = cfg["lead_in"]
segments = []
for seg in cfg["segments"]:
    say = seg.get("say", seg["text"])
    phon = phonemes_for(say)
    wav, _ = k.create(phon, voice=cfg["voice"], speed=cfg["speed"], is_phonemes=True)
    wav = trim(np.asarray(wav, dtype=np.float32))
    dur = len(wav) / SR
    words = seg["text"].split()
    ws = [weight(w) for w in words]
    tot = sum(ws)
    t = cursor
    wt = []
    for w, x in zip(words, ws):
        d = dur * x / tot
        wt.append({"text": w, "start": round(t, 3), "end": round(t + d, 3)})
        t += d
    segments.append({"id": seg["id"], "start": round(cursor, 3), "end": round(cursor + dur, 3), "words": wt, "phonemes": phon})
    audio += [wav, np.zeros(int(seg["pause"] * SR), dtype=np.float32)]
    cursor += dur + seg["pause"]
    print(f"{seg['id']:11s} {segments[-1]['start']:7.2f} → {segments[-1]['end']:7.2f}  {phon}")

full = np.concatenate(audio)
full = full / (np.max(np.abs(full)) + 1e-9) * 0.89
sf.write(OUT_WAV, full, SR)
json.dump({"total": round(cursor, 3), "segments": segments}, open(OUT_JSON, "w"), ensure_ascii=False, indent=1)
print(f"total {cursor:.2f}s")
