"""Synthesize the reel's sound-effect pack (no samples, no licensing issues).

Usage: python3 scripts/make_sfx.py public/sfx
"""
import os
import sys
import wave

import numpy as np

SR = 48000
rng = np.random.default_rng(7)
OUT = sys.argv[1]
os.makedirs(OUT, exist_ok=True)


def t(sec):
    return np.arange(int(SR * sec)) / SR


def biquad_bp(x, f, q):
    """Band-pass with per-sample centre frequency f (array or scalar)."""
    f = np.broadcast_to(np.asarray(f, dtype=float), x.shape)
    y = np.zeros_like(x)
    x1 = x2 = y1 = y2 = 0.0
    for i in range(len(x)):
        w = 2 * np.pi * f[i] / SR
        alpha = np.sin(w) / (2 * q)
        a0 = 1 + alpha
        b0, b2 = alpha / a0, -alpha / a0
        a1, a2 = -2 * np.cos(w) / a0, (1 - alpha) / a0
        yi = b0 * x[i] + b2 * x2 - a1 * y1 - a2 * y2
        x2, x1, y2, y1 = x1, x[i], y1, yi
        y[i] = yi
    return y


def lowpass(x, k):
    return np.convolve(x, np.ones(k) / k, mode="same")


def env_ad(n, attack, decay_pow=2.0):
    a = int(n * attack)
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a) ** 1.5
    e[a:] = np.linspace(1, 0, n - a) ** decay_pow
    return e


def save(name, mono, pan_lfo=0.0, gain_db=-3.0):
    x = mono / (np.max(np.abs(mono)) + 1e-9) * 10 ** (gain_db / 20)
    n = len(x)
    if pan_lfo:
        p = 0.5 + 0.5 * np.sin(np.linspace(-np.pi / 2, np.pi / 2, n)) * pan_lfo
    else:
        p = np.full(n, 0.5)
    st = np.stack([x * np.cos(p * np.pi / 2), x * np.sin(p * np.pi / 2)], axis=1) * 1.41
    pcm = (np.clip(st, -1, 1) * 32767).astype(np.int16)
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# Whooshes: noise through a sweeping band-pass, swelling then fading.
for name, dur, f0, f1, att in [("whoosh", 0.7, 300, 3200, 0.55), ("whoosh_fast", 0.38, 600, 5000, 0.6),
                               ("swoosh_down", 0.6, 4000, 250, 0.35)]:
    n = int(SR * dur)
    sweep = np.geomspace(f0, f1, n)
    x = biquad_bp(rng.standard_normal(n), sweep, 1.4) * env_ad(n, att, 2.5)
    save(name, x, pan_lfo=0.8, gain_db=-4)

# Pop: quick pitch-dropping sine blip.
tt = t(0.12)
save("pop", np.sin(2 * np.pi * np.cumsum(np.linspace(900, 300, len(tt))) / SR) * np.exp(-tt * 40), gain_db=-5)

# Tick / UI click.
tt = t(0.04)
save("tick", biquad_bp(rng.standard_normal(len(tt)), 3500, 3) * np.exp(-tt * 160), gain_db=-8)

# Switch: two mechanical clicks.
tt = t(0.16)
x = np.zeros(len(tt))
for off in (0, int(0.055 * SR)):
    k = len(tt) - off
    x[off:] += biquad_bp(rng.standard_normal(k), 2200, 4) * np.exp(-t(k / SR) * 120)
save("switch", x, gain_db=-4)

# Riser: noise + rising tone into a cut.
tt = t(1.6)
f = np.geomspace(180, 1400, len(tt))
x = 0.6 * np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.5 * biquad_bp(rng.standard_normal(len(tt)), f * 2, 2)
save("riser", x * (tt / tt[-1]) ** 2.2, gain_db=-7)

# Impact: sub thump + short noise crack.
tt = t(1.4)
sub = np.sin(2 * np.pi * np.cumsum(np.geomspace(90, 38, len(tt))) / SR) * np.exp(-tt * 3.2)
crack = lowpass(rng.standard_normal(len(tt)), 6) * np.exp(-tt * 30)
save("impact", sub + 0.35 * crack, gain_db=-2)

# Shimmer: sparkling high partials with tremolo (magic / discovery moments).
tt = t(1.8)
x = sum(np.sin(2 * np.pi * fr * tt + rng.uniform(0, 6)) * (1 + 0.6 * np.sin(2 * np.pi * (7 + i) * tt))
        for i, fr in enumerate([1760, 2217, 2637, 3520, 4434]))
save("shimmer", x * env_ad(len(tt), 0.08, 1.6), pan_lfo=0.6, gain_db=-12)

# Ding: bell with inharmonic partials.
tt = t(1.6)
x = sum(a * np.sin(2 * np.pi * 1318 * r * tt) * np.exp(-tt * d)
        for a, r, d in [(1, 1, 3), (0.5, 2.76, 5), (0.25, 5.4, 8), (0.15, 8.9, 12)])
save("ding", x, gain_db=-8)

# Glitch: bit-crushed, gated noise bursts.
tt = t(0.45)
g = (np.sin(2 * np.pi * 23 * tt) > 0.2).astype(float)
x = np.round(rng.standard_normal(len(tt)) * 3) / 3 * g + 0.4 * np.sign(np.sin(2 * np.pi * 180 * tt)) * g
save("glitch", lowpass(x, 3) * env_ad(len(tt), 0.02, 1), gain_db=-9)

# Zap: electric discharge (neuron firing).
tt = t(0.5)
f = 220 + 160 * np.sin(2 * np.pi * 37 * tt)
saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
x = saw * (0.6 + 0.4 * rng.standard_normal(len(tt))) * np.exp(-tt * 7)
save("zap", lowpass(x, 4), gain_db=-8)

# Bubbles: short upward sine chirps (pond scenes).
x = np.zeros(int(SR * 1.2))
for s in rng.uniform(0, 1.0, 9):
    d = rng.uniform(0.04, 0.09)
    tt = t(d)
    f = np.linspace(rng.uniform(400, 700), rng.uniform(1100, 1800), len(tt))
    i = int(s * SR)
    x[i:i + len(tt)] += np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * tt / d)
save("bubbles", x, pan_lfo=0.7, gain_db=-10)

# Stamp: thud + paper slap.
tt = t(0.5)
x = np.sin(2 * np.pi * 70 * tt) * np.exp(-tt * 14) + 0.6 * biquad_bp(rng.standard_normal(len(tt)), 1200, 1.2) * np.exp(-tt * 45)
save("stamp", x, gain_db=-3)

# Blip: friendly UI confirm (two-note).
x = np.concatenate([np.sin(2 * np.pi * 880 * t(0.07)) * np.exp(-t(0.07) * 25),
                    np.sin(2 * np.pi * 1320 * t(0.14)) * np.exp(-t(0.14) * 18)])
save("blip", x, gain_db=-9)

# Swell: warm pad chord fade-in for the outro.
tt = t(3.0)
x = sum(np.sin(2 * np.pi * fr * tt) + 0.3 * np.sin(2 * np.pi * fr * 2.003 * tt) for fr in [220, 277.2, 329.6, 440])
save("swell", x * np.sin(np.pi * tt / 3.0) ** 1.5, gain_db=-12)

# Light beam: airy sine sweep with breath noise (blue light flashes).
tt = t(0.9)
x = np.sin(2 * np.pi * np.cumsum(np.geomspace(600, 2400, len(tt))) / SR) * 0.4 + biquad_bp(rng.standard_normal(len(tt)), 5000, 1) * 0.6
save("beam", x * env_ad(len(tt), 0.25, 2), gain_db=-10)

print(sorted(os.listdir(OUT)))
