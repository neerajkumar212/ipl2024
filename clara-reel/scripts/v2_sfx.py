"""Extra cinematic SFX for v2: boom, reverse swell, heartbeat. Usage: python3 scripts/v2_sfx.py public/sfx"""
import os
import sys
import wave

import numpy as np

SR = 48000
OUT = sys.argv[1]
rng = np.random.default_rng(11)


def t(d):
    return np.arange(int(SR * d)) / SR


def save(name, x, gain_db=-3):
    x = x / (np.max(np.abs(x)) + 1e-9) * 10 ** (gain_db / 20)
    st = np.stack([x, x], 1)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(st, -1, 1) * 32767).astype(np.int16).tobytes())


def verb(x, secs=2.2, mix=0.35):
    ir = rng.standard_normal(int(SR * secs)) * np.exp(-t(secs) * 3)
    n = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    wet = np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[: len(x) + len(ir)]
    dry = np.pad(x, (0, len(ir)))
    return dry + wet / (np.max(np.abs(wet)) + 1e-9) * np.max(np.abs(x)) * mix


# Boom: deep cinematic hit with a tail
x = t(2.5)
sub = np.sin(2 * np.pi * np.cumsum(np.geomspace(70, 28, len(x))) / SR) * np.exp(-x * 1.6)
body = np.convolve(rng.standard_normal(len(x)), np.ones(40) / 40, "same") * np.exp(-x * 6)
save("boom", verb(sub + 0.8 * body, 2.5, 0.25), -1)

# Reverse swell (into a cut)
x = t(1.3)
n = np.convolve(rng.standard_normal(len(x)), np.ones(6) / 6, "same")
tone = sum(np.sin(2 * np.pi * f * x) for f in (220, 330, 440, 660))
s = (0.6 * n + 0.2 * tone) * (x / x[-1]) ** 3
save("rev", s, -6)

# Heartbeat (lub-dub)
x = np.zeros(int(SR * 0.9))
for off, f in ((0, 60), (0.22, 52)):
    k = t(0.25)
    i = int(off * SR)
    x[i:i + len(k)] += np.sin(2 * np.pi * f * k) * np.exp(-k * 18)
save("heart", x, -4)
print("ok")
