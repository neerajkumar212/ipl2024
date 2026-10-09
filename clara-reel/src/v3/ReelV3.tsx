import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { Clara } from "../components/Clara";
import envV3 from "../data/envelope_v3.json";
import { EXPO, INOUT } from "../lib/anim";
import { C, FPS } from "../theme";
import { Cut, SceneDef, Stage } from "../v2/Stage";
import { Captions3 } from "./Captions3";
import { SApproved, SCells, SHook, SName, SPartial, SSwitches } from "./scenesA";
import { SAddon, SCaveat, SOutro, SSafety, STip, STitrate, STrials } from "./scenesB";
import { seg, TOTAL, w } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ENV = envV3 as number[];
export const V3_SECONDS = TOTAL + 1.0;

/* ------------------------------------------------------------ edit decision list */

const cutBefore = (id: string) => seg(id).start - 0.13;
const B = {
  name: cutBefore("intro"),
  approved: cutBefore("approved"),
  cells: cutBefore("cells"),
  switches: cutBefore("switches"),
  partial: cutBefore("partial"),
  trials: cutBefore("trials"),
  addon: cutBefore("addon"),
  safety: cutBefore("side"),
  tip: cutBefore("tip"),
  titrate: cutBefore("titrate"),
  caveat: cutBefore("caveat"),
  outro: cutBefore("recap"),
};

const SCENES: SceneDef[] = [
  { id: "hook", from: 0, to: B.name, C: SHook },
  { id: "name", from: B.name, to: B.approved, C: SName },
  { id: "approved", from: B.approved, to: B.cells, C: SApproved },
  { id: "cells", from: B.cells, to: B.switches, C: SCells },
  { id: "switches", from: B.switches, to: B.partial, C: SSwitches },
  { id: "partial", from: B.partial, to: B.trials, C: SPartial },
  { id: "trials", from: B.trials, to: B.addon, C: STrials },
  { id: "addon", from: B.addon, to: B.safety, C: SAddon },
  { id: "safety", from: B.safety, to: B.tip, C: SSafety },
  { id: "tip", from: B.tip, to: B.titrate, C: STip },
  { id: "titrate", from: B.titrate, to: B.caveat, C: STitrate },
  { id: "caveat", from: B.caveat, to: B.outro, C: SCaveat },
  { id: "outro", from: B.outro, to: V3_SECONDS, C: SOutro },
];

const CUTS: Cut[] = [
  { type: "flash", d: 0.5 },
  { type: "iris", d: 0.8, cx: 540, cy: 900 },
  { type: "glitch", d: 0.45 },
  { type: "lightwipe", d: 0.7 },
  { type: "zoom", d: 0.7 },
  { type: "whipLeft", d: 0.55 },
  { type: "whipUp", d: 0.6 },
  { type: "glitch", d: 0.45 },
  { type: "flash", d: 0.5 },
  { type: "whipLeft", d: 0.55 },
  { type: "lightwipe", d: 0.7 },
  { type: "zoom", d: 0.7 },
];

const MOODS: [number, string][] = [
  [0, "31,200,214"],
  [B.approved, "83,227,166"],
  [B.cells, "255,150,80"],
  [B.switches, "139,123,255"],
  [B.partial, "139,123,255"],
  [B.trials, "244,199,106"],
  [B.addon, "83,227,166"],
  [B.safety, "255,90,95"],
  [B.tip, "244,199,106"],
  [B.titrate, "31,200,214"],
  [B.caveat, "255,181,71"],
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
  [0.15, "heart", 0.55], [1.2, "heart", 0.45], [0.3, "swell", 0.4], [w("hook", "pill") - 0.2, "whoosh", 0.5], [w("hook", "pill") + 0.2, "shimmer", 0.45],
  [w("hook", "FDA"), "stamp", 0.75], [w("hook", "FDA"), "impact", 0.45], [w("hook", "first") - 1.0, "riser", 0.35], [w("hook", "first"), "boom", 0.7], [w("hook", "first"), "beam", 0.45],
  // name
  [seg("intro").start - 0.05, "pop", 0.55], [seg("intro").start, "shimmer", 0.45], [w("name", "tavapadon,") - 0.15, "whoosh", 0.5], [w("name", "tavapadon,"), "shimmer", 0.45],
  [w("name", "Juvmo."), "pop", 0.55], [w("name", "Juvmo.") + 0.05, "ding", 0.4],
  // approved
  [w("approved", "September"), "tick", 0.6], [w("approved", "September") + 0.1, "stamp", 0.75], [w("approved", "September") + 0.1, "impact", 0.45],
  [w("approved", "adults") - 0.2, "whoosh_fast", 0.45], [w("approved", "disease.") , "ding", 0.35],
  // cells
  [w("cells", "cells"), "shimmer", 0.35], [w("cells", "die.") - 0.3, "swoosh_down", 0.5], [w("cells", "die."), "heart", 0.55],
  [w("symptoms", "slow"), "pop", 0.45], [w("symptoms", "stiffness"), "pop", 0.45], [w("symptoms", "tremor."), "glitch", 0.3], [w("symptoms", "tremor."), "pop", 0.45],
  // switches
  [w("switches", "receptors."), "blip", 0.45], [w("switches", "switches."), "switch", 0.6],
  [w("old", "pramipexole"), "pop", 0.45], [w("old", "ropinirole"), "pop", 0.45], [w("old", "D2"), "switch", 0.7], [w("old", "D3."), "switch", 0.7],
  [w("new", "Tavapadon") - 0.15, "whoosh_fast", 0.5], [w("new", "D1"), "switch", 0.8], [w("new", "D1"), "zap", 0.45], [w("new", "D5."), "switch", 0.8], [w("new", "D5."), "zap", 0.45],
  // partial
  [w("partial", "partial"), "whoosh", 0.4], [w("partial", "gentler"), "swell", 0.4], [w("partial", "half-life"), "tick", 0.55], [w("partial", "half-life") + 0.5, "tick", 0.5],
  [w("partial", "half-life") + 1.0, "tick", 0.5], [w("partial", "day.") , "ding", 0.45], [w("once", "one") - 0.1, "whoosh_fast", 0.45], [w("once", "once"), "impact", 0.5], [w("once", "daily."), "shimmer", 0.45],
  // trials
  [seg("trials").start + 0.6, "pop", 0.45], [seg("trials").start + 0.85, "pop", 0.45], [seg("trials").start + 1.1, "pop", 0.45], [w("trials", "TEMPO."), "stamp", 0.7],
  [w("alone", "improved") - 0.1, "riser", 0.3], [w("alone", "improved"), "whoosh", 0.45], [w("alone", "10"), "impact", 0.5], [w("alone", "placebo"), "blip", 0.5], [w("alone", "worse."), "swoosh_down", 0.35],
  // addon
  [w("addon", "levodopa,"), "pop", 0.5], [w("addon", "patients"), "pop", 0.45], [w("addon", "hour") - 0.8, "riser", 0.35], [w("addon", "hour"), "boom", 0.55], [w("addon", "hour") + 0.1, "shimmer", 0.5],
  [w("addon", "dyskinesia."), "ding", 0.4],
  // safety
  [w("side", "Nausea."), "impact", 0.5], [w("side", "Nausea.") + 0.05, "pop", 0.5], [w("side", "headache"), "pop", 0.45], [w("side", "dizziness."), "pop", 0.45],
  [seg("warn").start, "blip", 0.5], [w("warn", "dizziness") - 0.1, "whoosh_fast", 0.45], [w("warn", "hallucinations,") - 0.1, "whoosh_fast", 0.45], [w("warn", "unusual") - 0.1, "whoosh_fast", 0.45],
  // tip
  [seg("tip").start, "ding", 0.55], [seg("tip").start + 0.05, "shimmer", 0.45], [w("tip", "CYP3A"), "pop", 0.5], [w("inter", "itraconazole") - 0.1, "whoosh_fast", 0.45],
  [w("inter", "raise"), "zap", 0.4], [w("inter", "Carbamazepine") - 0.1, "whoosh_fast", 0.45], [w("inter", "lowers"), "swoosh_down", 0.45],
  // titrate
  [w("titrate", "low:"), "tick", 0.5], [w("titrate", "low:") + 0.6, "tick", 0.45], [w("titrate", "low:") + 1.2, "tick", 0.45], [w("titrate", "low:") + 1.8, "tick", 0.45],
  [w("titrate", "low:") + 2.4, "tick", 0.45], [w("titrate", "six"), "ding", 0.4], [w("titrate", "5"), "impact", 0.5], [w("titrate", "5"), "shimmer", 0.45],
  // caveat
  [seg("caveat").start + 0.2, "whoosh_fast", 0.45], [seg("caveat").start + 0.5, "impact", 0.4], [w("caveat", "yet.") - 0.1, "stamp", 0.75],
  [w("option", "new"), "whoosh", 0.45], [w("option", "not"), "glitch", 0.3], [w("option", "cure."), "impact", 0.55],
  // outro
  [w("recap", "New"), "pop", 0.55], [w("recap", "One"), "pop", 0.55], [w("recap", "More"), "pop", 0.55], [w("recap", "choice"), "switch", 0.7], [w("recap", "Parkinson's."), "shimmer", 0.5],
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
  const toDock = interpolate(s, [seg("name").start - 0.2, seg("name").start + 0.45], [0, 1], { ...clamp, easing: INOUT });
  const toEnd = interpolate(s, [seg("cta").start - 0.5, seg("cta").start + 0.3], [0, 1], { ...clamp, easing: EXPO });
  let x = STAGE.x + (DOCK.x - STAGE.x) * toDock;
  let y = STAGE.y + (DOCK.y - STAGE.y) * toDock;
  let size = STAGE.size + (DOCK.size - STAGE.size) * toDock;
  x += (END.x - x) * toEnd;
  y += (END.y - y) * toEnd;
  size += (END.size - size) * toEnd;
  const enter = spring({ frame: frame - tIn * FPS, fps: FPS, config: { damping: 11, stiffness: 120 } });
  const wave = interpolate(s, [tIn, tIn + 0.2, seg("intro").end, seg("intro").end + 0.3], [0, 1, 1, 0], clamp) + interpolate(s, [seg("cta").start, seg("cta").start + 0.3], [0, 1], clamp);
  const hop = [w("approved", "September") + 0.1, w("new", "D1"), w("addon", "hour"), seg("tip").start].reduce((a, t) => a + Math.max(0, Math.sin(Math.min(1, Math.max(0, (s - t) / 0.35)) * Math.PI)) * 14, 0);
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
      <div style={{ width: `${(100 * frame) / (V3_SECONDS * FPS)}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, #1B4F96, ${C.teal}, ${C.cyan})` }} />
    </div>
  );
};

export const ReelV3: React.FC = () => {
  const frame = useCurrentFrame();
  const s = frame / FPS;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background moods={MOODS} />
      <Stage scenes={SCENES} cuts={CUTS} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 68%, rgba(1,4,12,0.75) 82%, rgba(1,4,12,0.85) 100%)", pointerEvents: "none", zIndex: 6 }} />
      <ClaraHost />
      <Bug />
      <Progress />
      <AbsoluteFill style={{ zIndex: 10 }}>{s < seg("cta").start - 0.1 ? <Captions3 /> : null}</AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.05, zIndex: 11, backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 0.6px, transparent 0.8px)", backgroundSize: "3px 3px", backgroundPosition: `${frame % 3}px ${(frame * 2) % 3}px`, pointerEvents: "none" }} />

      <Audio src={staticFile("audio/clara_v3.wav")} volume={1} />
      <Audio src={staticFile("audio/music_v3.wav")} volume={0.3} />
      {SFX.filter(([t]) => t >= 0).map(([t, name, vol], i) => (
        <Sequence key={i} from={Math.round(t * FPS)} layout="none" name={`sfx ${name}`}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * 0.85} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
