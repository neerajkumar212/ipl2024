"""Regenerate Clara's narration with Kokoro (af_heart) — run this on your own machine.

The cloud sandbox this reel was built in could not download the Kokoro weights, so the
reel currently reuses the narration track from Dr Pharmacist Ep2 (which has a music bed
mixed in). Run this locally to get a clean, voice-only take of the same script.

    pip install kokoro soundfile          # also needs espeak-ng installed on the system
    python3 scripts/generate_voice.py public/audio/clara_af_heart_clean.wav

The phrase timings in src/data/script.ts match the Ep2 take. Kokoro's pacing is close but
not identical, so after regenerating, check the timings in Remotion Studio (or re-time
script.ts), then point the composition's `narration` prop at the new file and rebuild the
lip-sync envelope:

    python3 scripts/build_envelope.py public/audio/clara_af_heart_clean.wav src/data/envelope.json
"""
import re
import sys

import numpy as np
import soundfile as sf
from kokoro import KPipeline

SCRIPT_TS = "src/data/script.ts"
SR = 24000

src = open(SCRIPT_TS, encoding="utf-8").read()
phrases = re.findall(r'\{ t: ([\d.]+), text: "([^"]+)"(?:, end: ([\d.]+))? \}', src)

# Rebuild sentences from the phrase list; keep a short pause wherever the script marks one.
paragraphs, current = [], []
for _, text, end in phrases:
    current.append(text)
    if end:
        paragraphs.append(" ".join(current))
        current = []
if current:
    paragraphs.append(" ".join(current))

pipeline = KPipeline(lang_code="a")  # American English
chunks = []
for para in paragraphs:
    for result in pipeline(para, voice="af_heart", speed=1.0):
        chunks.append(result.audio.numpy())
    chunks.append(np.zeros(int(SR * 0.35), dtype=np.float32))

out = sys.argv[1] if len(sys.argv) > 1 else "public/audio/clara_af_heart_clean.wav"
sf.write(out, np.concatenate(chunks), SR)
print(f"wrote {out}")
