import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { Clara } from "../components/Clara";
import envV2 from "../data/envelope_v2.json";
import { EXPO, INOUT } from "../lib/anim";
import { C, FPS } from "../theme";
import { Captions2 } from "./Captions2";
import { SHook, SNeurons, SNobel, SOpto, SWatch } from "./scenesA";
import { SFound, SFuture, SGate, SMice, SOutro, SPatients, SPond, SProving, SStanford } from "./scenesB";
import { Cut, SceneDef, Stage } from "./Stage";
import { seg, TOTAL, w } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ENV = envV2 as number[];
export const V2_SECONDS = TOTAL + 1.0;

/* ------------------------------------------------------------ edit decision list */

const cutBefore = (id: string) => seg(id).start - 0.13;
const B = {
  nobel: cutBefore("intro"),
  opto: cutBefore("name"),
  neurons: cutBefore("neurons"),
  watch: cutBefore("watch"),
  proving: cutBefore("proving"),
  pond: cutBefore("unexpected"),
  found: cutBefore("found"),
  gate: cutBefore("gate"),
  stanford: cutBefore("stanford"),
  mice: cutBefore("mice"),
  patients: cutBefore("patients"),
  future: cutBefore("notyet"),
  outro: cutBefore("recap"),
};

const SCENES: SceneDef[] = [
  { id: "hook", from: 0, to: B.nobel, C: SHook },
  { id: "nobel", from: B.nobel, to: B.opto, C: SNobel },
  { id: "opto", from: B.opto, to: B.neurons, C: SOpto },
  { id: "neurons", from: B.neurons, to: B.watch, C: SNeurons },
  { id: "watch", from: B.watch, to: B.proving, C: SWatch },
  { id: "proving", from: B.proving, to: B.pond, C: SProving },
  { id: "pond", from: B.pond, to: B.found, C: SPond },
  { id: "found", from: B.found, to: B.gate, C: SFound },
  { id: "gate", from: B.gate, to: B.stanford, C: SGate },
  { id: "stanford", from: B.stanford, to: B.mice, C: SStanford },
  { id: "mice", from: B.mice, to: B.patients, C: SMice },
  { id: "patients", from: B.patients, to: B.future, C: SPatients },
  { id: "future", from: B.future, to: B.outro, C: SFuture },
  { id: "outro", from: B.outro, to: V2_SECONDS, C: SOutro },
];

const CUTS: Cut[] = [
  { type: "flash", d: 0.5 },
  { type: "zoom", d: 0.7 },
  { type: "iris", d: 0.8, cx: 540, cy: 960 },
  { type: "lightwipe", d: 0.7 },
  { type: "glitch", d: 0.45 },
  { type: "whipLeft", d: 0.55 },
  { type: "iris", d: 0.8, cx: 540, cy: 950 },
  { type: "zoom", d: 0.7 },
  { type: "flash", d: 0.5 },
  { type: "whipLeft", d: 0.55 },
  { type: "lightwipe", d: 0.7 },
  { type: "whipUp", d: 0.6 },
  { type: "zoom", d: 0.7 },
];

const MOODS: [number, string][] = [
  [0, "61,139,255"],
  [B.nobel, "244,199,106"],
  [B.opto, "91,231,255"],
  [B.neurons, "61,139,255"],
  [B.watch, "255,150,80"],
  [B.pond, "83,227,166"],
  [B.gate, "61,139,255"],
  [B.stanford, "139,123,255"],
  [B.patients, "31,200,214"],
  [B.future, "139,123,255"],
  [B.outro, "31,200,214"],
];

/* ------------------------------------------------------------ sound design */

const cutSfx: Record<Cut["type"], [string, number, number][]> = {
  flash: [["rev", -1.25, 0.5], ["boom", 0, 0.75], ["impact", 0, 0.4]],
  zoom: [["rev", -1.1, 0.4], ["whoosh", -0.35, 0.55]],
  iris: [["whoosh", -0.4, 0.5], ["shimmer", -0.1, 0.4]],
  lightwipe: [["whoosh", -0.35, 0.5], ["beam", -0.2, 0.35]],
  glitch: [["glitch", -0.2, 0.6]],
  whipLeft: [["whoosh_fast", -0.25, 0.6]],
  whipRight: [["whoosh_fast", -0.25, 0.6]],
  whipUp: [["whoosh_fast", -0.25, 0.6]],
};

const SFX: [number, string, number][] = [
  // hook
  [0.15, "heart", 0.55], [1.25, "heart", 0.45], [w("hook", "switch"), "switch", 0.6], [w("hook", "flash") - 1.0, "riser", 0.35],
  [w("hook", "flash"), "boom", 0.8], [w("hook", "flash"), "zap", 0.55], [w("hook", "flash"), "beam", 0.5], [w("hook", "light?"), "shimmer", 0.5],
  // nobel
  [seg("intro").start - 0.05, "pop", 0.55], [seg("intro").start, "shimmer", 0.45], [seg("nobel").start, "whoosh", 0.5],
  [w("nobel", "2026"), "impact", 0.5], [w("nobel", "Nobel"), "ding", 0.45], [w("nobel", "Nobel") + 0.05, "shimmer", 0.4],
  // opto
  [w("name", "optogenetics.") - 0.1, "whoosh_fast", 0.5], [w("split", "Opto,"), "beam", 0.5], [w("split", "light."), "pop", 0.4], [w("split", "genes."), "blip", 0.45],
  // neurons
  [w("neurons", "86") - 1.3, "riser", 0.3], [w("neurons", "86"), "impact", 0.45], [w("neurons", "neurons,"), "ding", 0.4],
  [w("neurons", "tiny"), "zap", 0.35], [w("neurons", "sparks."), "zap", 0.45],
  // watch
  [w("watch", "sparks"), "blip", 0.4], [w("watch", "sparks") + 0.25, "blip", 0.35], [w("watch", "sparks") + 0.5, "blip", 0.35], [w("watch", "sparks") + 0.75, "blip", 0.3],
  // proving + fire
  [w("proving", "watching"), "whoosh_fast", 0.45], [w("proving", "isn't"), "stamp", 0.7], [w("proving", "proving."), "impact", 0.6],
  [seg("fire").start, "pop", 0.5], [w("fire", "fire."), "whoosh_fast", 0.4], [w("fire", "fire.") + 0.05, "pop", 0.5],
  [w("fire", "mean"), "tick", 0.6], [w("fire", "started") + 0.1, "stamp", 0.7],
  // pond
  [w("pond", "Pond") - 1.3, "rev", 0.45], [w("pond", "Pond"), "impact", 0.65], [w("pond", "Pond"), "bubbles", 0.55], [w("pond", "Pond") + 0.1, "stamp", 0.5],
  [seg("alga").start, "whoosh", 0.45], [w("alga", "swims"), "bubbles", 0.45], [w("alga", "light-sensing"), "shimmer", 0.45],
  // found
  [w("found", "Peter") - 0.1, "whoosh_fast", 0.5], [w("found", "Peter") + 0.2, "pop", 0.45], [w("found", "Georg") - 0.1, "whoosh_fast", 0.5], [w("found", "Georg") + 0.2, "pop", 0.45],
  [w("found", "channelrhodopsin."), "boom", 0.45], [w("found", "channelrhodopsin.") + 0.05, "shimmer", 0.5],
  // gate
  [w("gate", "gate"), "tick", 0.6], [w("gate", "Blue"), "beam", 0.6], [w("gate", "opens,"), "switch", 0.7], [w("gate", "charged"), "whoosh_fast", 0.4],
  [w("gate", "charged") + 0.1, "bubbles", 0.4], [w("gate", "fires."), "zap", 0.6], [w("gate", "fires."), "impact", 0.5],
  // stanford
  [w("stanford", "2005,") - 1.4, "riser", 0.35], [w("stanford", "2005,"), "impact", 0.6], [w("stanford", "Karl") - 0.1, "whoosh", 0.45], [w("stanford", "Karl") + 0.2, "pop", 0.5],
  [w("stanford", "put"), "whoosh_fast", 0.4], [w("stanford", "neurons.") + 0.2, "pop", 0.45],
  [w("flash", "flash"), "beam", 0.6], [w("flash", "flash"), "boom", 0.6], [w("flash", "fired,"), "zap", 0.6], [w("flash", "milliseconds."), "tick", 0.6],
  [w("flash", "milliseconds.") + 0.2, "tick", 0.5], [w("remote", "remote"), "whoosh_fast", 0.45], [w("remote", "control"), "tick", 0.8], [w("remote", "control") + 0.75, "zap", 0.5],
  // mice
  [w("mice", "flipping"), "switch", 0.75], [w("mice", "fear."), "glitch", 0.35], [w("mice", "fear."), "heart", 0.6], [w("mice", "Another"), "switch", 0.75],
  [w("mice", "move."), "whoosh_fast", 0.45], [seg("cause").start, "swoosh_down", 0.4], [w("cause", "cause,"), "stamp", 0.8], [w("cause", "cause,"), "impact", 0.5],
  [w("cause", "correlation."), "tick", 0.6],
  // patients
  [seg("patients").start, "shimmer", 0.45], [w("sahel", "2021,"), "whoosh", 0.45], [w("sahel", "2021,") + 0.1, "ding", 0.4], [w("sahel", "regained"), "shimmer", 0.45],
  [w("fda", "FDA") - 0.3, "whoosh_fast", 0.45], [w("fda", "FDA"), "pop", 0.5], [w("fda", "retinitis"), "swoosh_down", 0.35],
  // future
  [seg("notyet").start, "blip", 0.6], [seg("notyet").start, "swoosh_down", 0.35], [seg("map").start, "whoosh", 0.4],
  [w("map", "Parkinson's,"), "pop", 0.5], [w("map", "depression"), "pop", 0.5], [w("map", "addiction,"), "pop", 0.5],
  [w("map", "medicines"), "whoosh_fast", 0.45], [w("map", "target."), "ding", 0.55], [w("map", "target."), "impact", 0.45],
  // outro
  [w("recap", "Three"), "pop", 0.55], [w("recap", "One"), "pop", 0.55], [w("recap", "light"), "pop", 0.55], [w("recap", "switch"), "switch", 0.7], [w("recap", "brain."), "shimmer", 0.5],
  [seg("cta").start - 1.25, "rev", 0.5], [seg("cta").start, "boom", 0.7], [seg("cta").start + 0.6, "shimmer", 0.55],
  [w("cta", "Follow") + 1.25, "tick", 0.9], [w("cta", "Follow") + 1.3, "blip", 0.7], [w("cta", "made"), "ding", 0.5],
  ...CUTS.flatMap((c, i) => cutSfx[c.type].map(([f, dt, v]) => [SCENES[i].to + dt, f, v] as [number, string, number])),
];

/* ------------------------------------------------------------ Clara host */

const DOCK = { x: 150, y: 335, size: 230 };
const STAGE = { x: 540, y: 820, size: 560 };
const END = { x: 540, y: 640, size: 440 };

const ClaraHost: React.FC = () => {
  const frame = useCurrentFrame();
  const s = frame / FPS;
  const tIn = seg("intro").start - 0.1;
  if (s < tIn - 0.05) return null;
  const toDock = interpolate(s, [seg("nobel").start - 0.2, seg("nobel").start + 0.45], [0, 1], { ...clamp, easing: INOUT });
  const toEnd = interpolate(s, [seg("cta").start - 0.5, seg("cta").start + 0.3], [0, 1], { ...clamp, easing: EXPO });
  let x = STAGE.x + (DOCK.x - STAGE.x) * toDock;
  let y = STAGE.y + (DOCK.y - STAGE.y) * toDock;
  let size = STAGE.size + (DOCK.size - STAGE.size) * toDock;
  x += (END.x - x) * toEnd;
  y += (END.y - y) * toEnd;
  size += (END.size - size) * toEnd;
  const enter = spring({ frame: frame - tIn * FPS, fps: FPS, config: { damping: 11, stiffness: 120 } });
  const wave = interpolate(s, [tIn, tIn + 0.2, seg("intro").end, seg("intro").end + 0.3], [0, 1, 1, 0], clamp) + interpolate(s, [seg("cta").start, seg("cta").start + 0.3], [0, 1], clamp);
  // tiny excited hop on big beats
  const hop = [w("nobel", "Nobel"), w("pond", "Pond"), w("cause", "cause,"), w("map", "target.")].reduce((a, t) => a + Math.max(0, Math.sin(Math.min(1, Math.max(0, (s - t) / 0.35)) * Math.PI)) * 14, 0);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size * 0.6 - hop, scale: String(enter), zIndex: 8 }}>
      <Clara frame={frame} size={size} env={ENV} mood={s > w("cta", "Follow") + 1.3 ? "happy" : "talk"} wave={wave} glow={1 - 0.5 * toDock * (1 - toEnd)} />
    </div>
  );
};

/* ------------------------------------------------------------ chrome */

const Bug: React.FC = () => {
  const frame = useCurrentFrame();
  const s = frame / FPS;
  const k = interpolate(s, [seg("intro").start, seg("intro").start + 0.6, seg("cta").start - 0.4, seg("cta").start], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 82, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: k, zIndex: 9 }}>
      <Img src={staticFile("brand/logo_on_dark.png")} style={{ height: 78, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }} />
    </div>
  );
};

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 34, left: 60, right: 60, height: 5, borderRadius: 6, background: "rgba(255,255,255,0.12)", zIndex: 9 }}>
      <div style={{ width: `${(100 * frame) / (V2_SECONDS * FPS)}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, #1B4F96, ${C.teal}, ${C.cyan})` }} />
    </div>
  );
};

export const ReelV2: React.FC = () => {
  const frame = useCurrentFrame();
  const s = frame / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background moods={MOODS} />
      <Stage scenes={SCENES} cuts={CUTS} />
      {/* caption legibility band */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 68%, rgba(1,4,12,0.75) 82%, rgba(1,4,12,0.85) 100%)", pointerEvents: "none", zIndex: 6 }} />
      <ClaraHost />
      <Bug />
      <Progress />
      <AbsoluteFill style={{ zIndex: 10 }}>{s < seg("cta").start - 0.1 ? <Captions2 /> : null}</AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.05, zIndex: 11, backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 0.6px, transparent 0.8px)", backgroundSize: "3px 3px", backgroundPosition: `${frame % 3}px ${(frame * 2) % 3}px`, pointerEvents: "none" }} />

      <Audio src={staticFile("audio/clara_v2.wav")} volume={1} />
      <Audio src={staticFile("audio/music_v2.wav")} volume={0.3} />
      {SFX.filter(([t]) => t >= 0).map(([t, name, vol], i) => (
        <Sequence key={i} from={Math.round(t * FPS)} layout="none" name={`sfx ${name}`}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * 0.85} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
