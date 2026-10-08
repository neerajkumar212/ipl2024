# Dr Pharmacist · Clara reel — Nobel Prize 2026: Optogenetics

## V2 (current): `ClaraOptogeneticsV2`

A rebuilt reel (≈109 s, 1080×1920): new script, a fresh Clara voiceover (Kokoro **af_heart**), an
original music bed, 14 scenes and a custom transitions engine.

```console
npx remotion render ClaraOptogeneticsV2 out/v2.mp4 --crf=16
```

| Path | What it is |
| --- | --- |
| `src/data/v2script.json` | Script: caption text, what Clara says (`say`), pauses, and IPA overrides for names |
| `scripts/v2_voice.py` | Synthesizes `public/audio/clara_v2.wav` and per-word timings in `src/data/v2timing.json` |
| `scripts/v2_music.py` | Composes `public/audio/music_v2.wav` (pads, plucks, soft drums, reverb), ducked under Clara |
| `scripts/v2_sfx.py` | Extra cinematic SFX (boom, reverse swell, heartbeat) |
| `scripts/brand_assets.py` | Cuts the Dr Pharmacist logo into transparent / on-dark / D and P layers |
| `src/v2/Stage.tsx` | Transitions: whip-pans with directional motion blur, zoom-through, iris, light-wipe, glitch, flash |
| `src/v2/scenesA.tsx`, `scenesB.tsx` | The 14 scenes; every animation is keyed to the word Clara is saying |
| `src/v2/ReelV2.tsx` | Edit list, cut types, ~150 SFX cues, Clara host, logo bug, captions |

Pronunciation: Deisseroth = DICE-er-roth, Hegemann = HAY-geh-mahn, Georg Nagel = GAY-org NAH-gel,
channelrhodopsin = channel-ro-DOP-sin. Years are spoken naturally ("two thousand five").

Credits on screen: laureate illustrations "Ill. Niklas Elmehed © Nobel Prize Outreach"; sources
Nagel et al. Science 2002 / PNAS 2003, Boyden et al. Nat Neurosci 2005, Liu et al. Nature 2012,
Kravitz et al. Nature 2010, Sahel et al. Nat Med 2021, Azevedo et al. J Comp Neurol 2009.

To regenerate the voice you need the Kokoro v1.0 ONNX model and the af_heart style vector:
`python3 scripts/v2_voice.py kokoro.onnx voices.npz`, then `python3 scripts/v2_music.py` and
`python3 scripts/build_envelope.py public/audio/clara_v2.wav src/data/envelope_v2.json`.

## V1: `ClaraOptogenetics`

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
