"""Compose an original ambient-cinematic music bed for the v2 reel, ducked under Clara.

Usage: python3 scripts/v2_music.py
Reads src/data/v2timing.json + public/audio/clara_v2.wav, writes public/audio/music_v2.wav.
Everything is synthesized here (additive pads, plucks, soft drums, convolution reverb).
"""
import json
import subprocess

import numpy as np
import soundfile as sf

SR = 44100
rng = np.random.default_rng(3)
timing = json.load(open("src/data/v2timing.json"))
seg = {s["id"]: s for s in timing["segments"]}
TOTAL = timing["total"] + 1.5
N = int(TOTAL * SR)
BPM = 92
BEAT = 60 / BPM
BAR = 4 * BEAT

L = np.zeros(N)
R = np.zeros(N)


def midi(n):
    return 440 * 2 ** ((n - 69) / 12)


def place(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    L[i:i + len(sig)] += sig * gain * np.sqrt(0.5 * (1 - pan))
    R[i:i + len(sig)] += sig * gain * np.sqrt(0.5 * (1 + pan))


def tt(d):
    return np.arange(int(d * SR)) / SR


# ---- sections (seconds), driven by the narration timeline
t_intro = seg["intro"]["start"]
t_pond = seg["pond"]["start"]
t_stan = seg["stanford"]["start"]
t_pat = seg["patients"]["start"]
t_notyet = seg["notyet"]["start"]
t_map = seg["map"]["start"]
t_recap = seg["recap"]["start"]
t_cta = seg["cta"]["start"]

# A minor-ish cinematic progression: Am9, Fmaj7, Cmaj7/E, G6 (two bars each)
CHORDS = [[57, 60, 64, 67, 71], [53, 57, 60, 64, 69], [52, 55, 60, 64, 67], [55, 59, 62, 64, 67]]


def energy(t):
    """0..1 arrangement intensity over time."""
    e = 0.35
    if t >= t_intro:
        e = 0.55
    if t_pond - 0.4 <= t < t_pond + 1.2:
        e = 0.2
    if t >= t_pond + 1.2:
        e = 0.6
    if t >= t_stan - 0.3:
        e = 0.85
    if t >= t_pat:
        e = 0.6
    if t_notyet <= t < t_map:
        e = 0.3
    if t >= t_map:
        e = 0.75
    if t >= t_recap:
        e = 0.95
    if t >= t_cta + 2.2:
        e = 0.3
    return e


# ---- pads: additive, detuned, slow swell per chord
bar_t = 0.0
ci = 0
while bar_t < TOTAL:
    chord = CHORDS[ci % 4]
    d = 2 * BAR + 0.6
    x = tt(d)
    env = np.minimum(1, x / 0.9) * np.minimum(1, (d - x) / 0.8)
    pad = np.zeros(len(x))
    for n in chord:
        f = midi(n)
        for h, amp in [(1, 1.0), (2, 0.35), (3, 0.18), (4, 0.08)]:
            for det in (-0.12, 0.0, 0.11):
                pad += amp * np.sin(2 * np.pi * f * h * (1 + det / 100) * x + rng.uniform(0, 6))
    pad *= env / 40
    e = energy(bar_t + 1)
    place(pad, bar_t, 0.55 + 0.25 * e, pan=-0.25)
    place(pad, bar_t + 0.013, 0.55 + 0.25 * e, pan=0.25)
    # sub root
    root = midi(chord[0] - 24)
    place(np.sin(2 * np.pi * root * x) * env * 0.16, bar_t, 0.6 + 0.4 * e)
    bar_t += 2 * BAR
    ci += 1

# ---- pluck arpeggio (8ths) with ping-pong delay, from the intro onward
t = t_intro
step = 0
while t < TOTAL - 1:
    e = energy(t)
    if e >= 0.5:
        chord = CHORDS[int(t / (2 * BAR)) % 4]
        pattern = [0, 2, 4, 1, 3, 4, 2, 1]
        n = chord[pattern[step % 8]] + 12
        x = tt(0.6)
        f = midi(n)
        pl = (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * 2 * f * x) + 0.12 * np.sin(2 * np.pi * 3 * f * x)) * np.exp(-x * 7)
        g = 0.05 * (0.6 + 0.6 * e)
        place(pl, t, g, pan=0.35 if step % 2 else -0.35)
        place(pl, t + 3 * BEAT / 4, g * 0.45, pan=-0.6 if step % 2 else 0.6)
        place(pl, t + 3 * BEAT / 2, g * 0.2, pan=0.6 if step % 2 else -0.6)
    t += BEAT / 2
    step += 1

# ---- drums: soft kick on 1 & 3, shaker 8ths, only at higher energy
t = t_intro
beat = 0
kick = np.sin(2 * np.pi * np.cumsum(np.geomspace(130, 42, int(0.45 * SR))) / SR) * np.exp(-tt(0.45) * 9)
hat_noise = rng.standard_normal(int(0.07 * SR))
hat = (hat_noise - np.convolve(hat_noise, np.ones(8) / 8, mode="same")) * np.exp(-tt(0.07) * 60)
while t < TOTAL - 1.5:
    e = energy(t)
    if e >= 0.55 and beat % 2 == 0:
        place(kick, t, 0.32 * e)
    if e >= 0.75:
        place(hat, t + BEAT / 2, 0.05 * e, pan=0.3)
    if e >= 0.85:
        place(hat, t, 0.035, pan=-0.3)
    t += BEAT
    beat += 1

# ---- transitions: reverse-swell into big moments
for at in [t_intro, t_stan, t_recap]:
    x = tt(1.6)
    sw = rng.standard_normal(len(x))
    sw = np.convolve(sw, np.ones(30) / 30, mode="same") * (x / x[-1]) ** 3
    place(sw, at - 1.6, 0.35)

# ---- convolution reverb (FFT)
ir_t = tt(2.8)
ir = rng.standard_normal(len(ir_t)) * np.exp(-ir_t * 2.4)
ir[0] = 0
size = 1 << int(np.ceil(np.log2(N + len(ir))))
IR = np.fft.rfft(ir, size)
wetL = np.fft.irfft(np.fft.rfft(L, size) * IR, size)[:N]
wetR = np.fft.irfft(np.fft.rfft(R, size) * np.roll(IR, 0), size)[:N]
wet_gain = 0.6 * np.max(np.abs(L)) / (np.max(np.abs(wetL)) + 1e-9)
L = L + wetL * wet_gain * 0.35
R = R + wetR * wet_gain * 0.35

# ---- duck under the voice
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", "public/audio/clara_v2.wav", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
v = np.frombuffer(raw, np.float32)
v = np.pad(v, (0, max(0, N - len(v))))[:N]
hop = 441
env = np.sqrt(np.convolve(v ** 2, np.ones(hop * 6) / (hop * 6), mode="same"))
env = env / (np.percentile(env, 98) + 1e-9)
env = np.clip(env * 1.6, 0, 1)
# smooth attack/release with a one-pole on a decimated envelope
dec = env[::hop]
sm = np.zeros_like(dec)
for i in range(1, len(dec)):
    a = 0.5 if dec[i] > sm[i - 1] else 0.06
    sm[i] = sm[i - 1] + a * (dec[i] - sm[i - 1])
duck = 1 - 0.5 * np.repeat(sm, hop)[:N]

fade = np.ones(N)
fade[:int(0.4 * SR)] = np.linspace(0, 1, int(0.4 * SR))
fade[-int(2.0 * SR):] = np.linspace(1, 0, int(2.0 * SR))
mix = np.stack([L, R], axis=1) * (duck * fade)[:, None]
mix = mix / (np.max(np.abs(mix)) + 1e-9) * 0.8
sf.write("public/audio/music_v2.wav", mix.astype(np.float32), SR)
print(f"music {TOTAL:.1f}s written")
