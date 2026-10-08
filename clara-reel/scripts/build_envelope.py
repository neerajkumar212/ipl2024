"""Build a per-frame voice envelope (0..1) used to lip-sync Clara's mouth.

Usage: python3 scripts/build_envelope.py public/audio/<narration>.mp3 src/data/envelope.json
"""
import json
import subprocess
import sys

import numpy as np

FPS = 30
SR = 16000

src, out = sys.argv[1], sys.argv[2]
raw = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", str(SR),
     "-af", "highpass=f=300,lowpass=f=3400", "-f", "f32le", "-"],
    check=True, capture_output=True,
).stdout
pcm = np.frombuffer(raw, dtype=np.float32)
hop = SR // FPS
n = len(pcm) // hop
rms = np.sqrt(np.mean(pcm[: n * hop].reshape(n, hop) ** 2, axis=1) + 1e-12)
db = 20 * np.log10(rms)

# Speech sits well above the music bed: map [floor, peak] dB -> [0, 1].
floor = np.percentile(db, 25) + 4
peak = np.percentile(db, 97)
env = np.clip((db - floor) / (peak - floor), 0, 1)
# Light smoothing so the mouth doesn't jitter.
env = np.convolve(env, np.array([0.25, 0.5, 0.25]), mode="same")

with open(out, "w") as f:
    json.dump([round(float(v), 3) for v in env], f)
print(f"frames={n} seconds={n / FPS:.2f} floor={floor:.1f}dB peak={peak:.1f}dB "
      f"talking%={100 * np.mean(env > 0.15):.0f}")
