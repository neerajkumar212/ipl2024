# Dr Pharmacist · Clara reel — Nobel Prize 2026: Optogenetics

A 114-second, 1080×1920 Instagram reel built with Remotion. Clara, Dr Pharmacist's health
companion, explains the 2026 Nobel Prize in Physiology or Medicine (Hegemann, Nagel, Deisseroth,
for light-gated ion channels and optogenetics).

## What's inside

| Path | What it is |
| --- | --- |
| `src/ClaraReel.tsx` | Main composition: background, 13 scenes, Clara host, captions, light-leak flares, SFX cue sheet |
| `src/components/Clara.tsx` | Clara as an SVG character, lip-synced to the narration, with blinking, idle float and a wave |
| `src/components/Captions.tsx` | Word-by-word captions: the spoken word sits on a glowing pill, key terms in cyan |
| `src/components/art.tsx` | Illustrations: brain constellation, neuron, ion channel + membrane, alga, eye, medal, mouse… |
| `src/scenes/*.tsx` | The 13 scenes, each timed to the narration in global seconds |
| `src/data/script.ts` | Clara's script with phrase timings (source of truth for captions) |
| `src/data/envelope.json` | Per-frame voice loudness used for lip-sync |
| `public/audio/` | Narration: Clara (af_heart) from Ep2 |
| `public/sfx/` | 17 sound effects synthesized by `scripts/make_sfx.py` (no samples, no licensing) |
| `public/fonts/` | Outfit, Fraunces italic and JetBrains Mono (variable woff2, bundled for offline renders) |

## Commands

```console
npm i
npm run dev                                              # Remotion Studio preview
npx remotion render ClaraOptogenetics out/reel.mp4 --crf=17
```

If Remotion can't download its own Chrome, point it at a local Chromium:
`REMOTION_CHROME=/path/to/chrome npx remotion render …`.

Other scripts:

```console
python3 scripts/make_sfx.py public/sfx                   # rebuild the SFX pack
python3 scripts/build_envelope.py <narration> src/data/envelope.json
python3 scripts/generate_voice.py                        # clean af_heart take (run locally, needs `kokoro`)
node scripts/stills.mjs out/qa 10 20.5 61                # QA stills at given seconds
```

## Known limitation: narration track

The cloud sandbox couldn't download the Kokoro model, so the narration is Clara's af_heart take
taken from the Ep2 reel, and it has Ep2's music bed mixed in. To get a voice-only master, run
`scripts/generate_voice.py` on your own machine, check or re-time `src/data/script.ts`, rebuild
the envelope, and change the `narration` default prop in `src/Root.tsx`.

## Fact check (October 2026)

- Nobel Prize in Physiology or Medicine 2026: Karl Deisseroth, Peter Hegemann, Georg Nagel,
  "for their discoveries concerning light-gated ion channels and optogenetics" (announced 5 Oct 2026).
- FDA accepted Nanoscope's BLA for MCO-010 (Mogenry, sonpiretigene isteparvovec), an optogenetic
  intravitreal gene therapy for retinitis pigmentosa, in September 2026. It is under review, not
  approved, and the reel says so on screen.
