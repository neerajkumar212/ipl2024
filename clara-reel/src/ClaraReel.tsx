import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Sequence, interpolate, spring, staticFile, useCurrentFrame } from "remotion";
import { Background } from "./components/Background";
import { Captions } from "./components/Captions";
import { Clara } from "./components/Clara";
import { EXPO, INOUT } from "./lib/anim";
import { S1Hook, S2SciFi, S3Basics } from "./scenes/scenes1";
import { S4Corr, S4Fire, S4Watch, S5Pond, S6Channel } from "./scenes/scenes2";
import { S10Circuits, S11Outro, S7Stanford, S8Mice, S9Patients } from "./scenes/scenes3";
import { C, FONT, FPS } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ------------------------------------------------------------ sound design */

// [second, file, volume]
const SFX: [number, string, number][] = [
  [0.0, "shimmer", 0.6], [0.05, "pop", 0.6],
  [0.95, "whoosh", 0.5], [1.05, "impact", 0.7], [1.2, "shimmer", 0.45],
  [3.65, "whoosh_fast", 0.5], [3.75, "pop", 0.5], [3.95, "pop", 0.5], [4.15, "pop", 0.5], [4.4, "ding", 0.35],
  [5.4, "whoosh", 0.5], [5.6, "beam", 0.6], [6.75, "switch", 0.8], [7.15, "switch", 0.8], [7.5, "beam", 0.7], [7.55, "zap", 0.45],
  [9.5, "whoosh", 0.55], [9.8, "glitch", 0.6], [10.6, "glitch", 0.35], [11.5, "stamp", 0.8], [11.5, "impact", 0.5],
  [12.9, "whoosh_fast", 0.5], [13.0, "shimmer", 0.45], [14.0, "beam", 0.55], [15.25, "pop", 0.55],
  [17.05, "whoosh", 0.5], [19.5, "riser", 0.35], [20.6, "ding", 0.5], [21.2, "whoosh_fast", 0.45], [22.0, "zap", 0.45], [23.25, "zap", 0.6],
  [24.05, "whoosh", 0.5], [25.8, "blip", 0.4], [26.3, "blip", 0.4], [26.9, "blip", 0.4], [27.7, "swoosh_down", 0.45], [28.45, "glitch", 0.6], [28.5, "impact", 0.8],
  [29.25, "whoosh", 0.5], [29.6, "pop", 0.55], [31.75, "pop", 0.55], [31.8, "impact", 0.3], [32.0, "whoosh_fast", 0.35], [32.85, "stamp", 0.7],
  [33.85, "whoosh", 0.5], [35.25, "zap", 0.4], [36.9, "tick", 0.7], [37.75, "stamp", 0.7], [38.7, "impact", 0.55],
  [39.75, "whoosh", 0.55], [40.2, "bubbles", 0.45], [42.75, "pop", 0.7], [42.75, "stamp", 0.6], [42.9, "bubbles", 0.55],
  [43.65, "whoosh_fast", 0.5], [45.5, "shimmer", 0.45], [46.4, "whoosh", 0.5], [48.0, "pop", 0.55], [49.25, "pop", 0.55],
  [50.2, "whoosh_fast", 0.45], [51.2, "blip", 0.4], [52.25, "beam", 0.6], [52.3, "ding", 0.45],
  [53.05, "whoosh", 0.55], [55.5, "tick", 0.7], [56.5, "beam", 0.7], [57.2, "switch", 0.8], [57.75, "whoosh_fast", 0.45], [58.5, "bubbles", 0.45], [60.0, "zap", 0.65], [60.3, "ding", 0.45],
  [61.25, "whoosh", 0.55], [61.5, "riser", 0.25], [63.0, "pop", 0.6], [63.05, "shimmer", 0.35], [65.0, "whoosh_fast", 0.5], [66.3, "pop", 0.5],
  [67.0, "beam", 0.7], [67.0, "impact", 0.55], [69.25, "zap", 0.65], [70.45, "tick", 0.9], [70.5, "beam", 0.55], [71.35, "zap", 0.5],
  [71.55, "whoosh", 0.55], [72.5, "switch", 0.8], [74.25, "impact", 0.45], [74.3, "glitch", 0.35], [75.25, "switch", 0.8], [77.0, "whoosh_fast", 0.45],
  [77.8, "swoosh_down", 0.4], [79.25, "stamp", 0.8], [79.3, "ding", 0.4], [80.0, "tick", 0.7],
  [81.45, "whoosh", 0.55], [82.7, "shimmer", 0.45], [84.1, "whoosh_fast", 0.4], [84.7, "stamp", 0.7], [86.5, "whoosh_fast", 0.4], [87.25, "tick", 0.6], [87.3, "beam", 0.5], [89.0, "riser", 0.3], [90.75, "ding", 0.5],
  [92.05, "whoosh", 0.55], [92.3, "blip", 0.6], [95.0, "whoosh", 0.45], [97.5, "pop", 0.55], [98.5, "pop", 0.55], [99.3, "pop", 0.55],
  [100.25, "whoosh_fast", 0.45], [101.95, "ding", 0.55], [102.0, "impact", 0.45],
  [103.45, "whoosh", 0.55], [103.75, "pop", 0.6], [104.75, "pop", 0.6], [105.75, "pop", 0.6], [107.0, "shimmer", 0.5],
  [107.95, "swoosh_down", 0.5], [108.3, "swell", 0.7], [108.7, "pop", 0.5], [109.3, "tick", 0.9], [109.4, "blip", 0.7], [111.0, "shimmer", 0.55], [111.05, "ding", 0.45],
];

// Cuts that get a light-leak flare: [second, hue]
const FLARES: [number, string][] = [
  [9.6, "139,123,255"], [17.1, "91,231,255"], [29.35, "255,150,80"], [39.8, "83,227,166"], [53.1, "61,139,255"],
  [61.3, "139,123,255"], [71.6, "139,123,255"], [81.5, "31,200,214"], [92.1, "255,181,71"], [103.5, "244,199,106"], [108.0, "91,231,255"],
];

const Flare: React.FC<{ at: number; rgb: string }> = ({ at, rgb }) => {
  const frame = useCurrentFrame();
  const s = frame / FPS;
  const k = interpolate(s, [at - 0.35, at, at + 0.6], [0, 1, 0], clamp);
  if (k <= 0) return null;
  const x = interpolate(s, [at - 0.35, at + 0.6], [-200, 1300], clamp);
  return (
    <AbsoluteFill
      style={{
        mixBlendMode: "screen",
        opacity: k,
        background: `radial-gradient(700px 1400px at ${x}px 700px, rgba(${rgb},0.55), transparent 70%),
          radial-gradient(400px 900px at ${x - 260}px 1300px, rgba(255,230,190,0.35), transparent 70%)`,
      }}
    />
  );
};

/* ------------------------------------------------------------ Clara host */

const DOCK = { x: 150, y: 335, size: 230 };
const STAGE = { x: 540, y: 760, size: 540 };

const ClaraHost: React.FC = () => {
  const frame = useCurrentFrame();
  const s = frame / FPS;
  const toDock = interpolate(s, [0.95, 1.6], [0, 1], { ...clamp, easing: INOUT });
  const toStage = interpolate(s, [107.9, 108.7], [0, 1], { ...clamp, easing: EXPO });
  const k = toDock * (1 - toStage);
  const x = STAGE.x + (DOCK.x - STAGE.x) * k;
  const y = STAGE.y + (DOCK.y - STAGE.y) * k;
  const size = STAGE.size + (DOCK.size - STAGE.size) * k;
  const enter = spring({ frame, fps: FPS, config: { damping: 12, stiffness: 120 } });
  const wave = interpolate(s, [0, 0.2, 1.0, 1.3], [0, 1, 1, 0], clamp) + interpolate(s, [108.4, 108.8, 113.6, 114], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size * 0.6, scale: String(0.3 + 0.7 * enter) }}>
      <Clara frame={frame} size={size} mood={s > 109.4 ? "happy" : "talk"} wave={wave} glow={1 - 0.5 * k} />
    </div>
  );
};

/* ------------------------------------------------------------ chrome */

const Brand: React.FC = () => (
  <div style={{ position: "absolute", top: 88, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 24px 10px 12px", borderRadius: 999, background: "rgba(8,18,42,0.6)", border: `1.5px solid ${C.glassEdge}` }}>
      <div style={{ width: 46, height: 46, borderRadius: 14, background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 22, color: "white" }}>
        DP
      </div>
      <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: C.ink }}>Dr Pharmacist</span>
    </div>
  </div>
);

const Progress: React.FC<{ total: number }> = ({ total }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 40, left: 60, right: 60, height: 6, borderRadius: 6, background: "rgba(255,255,255,0.12)" }}>
      <div style={{ width: `${(100 * frame) / total}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, ${C.teal}, ${C.cyan})` }} />
    </div>
  );
};

/* ------------------------------------------------------------ composition */

export const ClaraReel: React.FC<{ narration: string }> = ({ narration }) => {
  const frame = useCurrentFrame();
  const total = Math.round(114.3 * FPS);
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0 }}>
      <Background />
      <S1Hook />
      <S2SciFi />
      <S3Basics />
      <S4Watch />
      <S4Fire />
      <S4Corr />
      <S5Pond />
      <S6Channel />
      <S7Stanford />
      <S8Mice />
      <S9Patients />
      <S10Circuits />
      <S11Outro />
      <ClaraHost />
      <Brand />
      <Progress total={total} />
      <Captions />
      {FLARES.map(([t, rgb]) => (
        <Flare key={t} at={t} rgb={rgb} />
      ))}
      {/* film grain-ish shimmer to keep gradients from banding */}
      <AbsoluteFill style={{ opacity: 0.05, backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 0.6px, transparent 0.8px)", backgroundSize: "3px 3px", backgroundPosition: `${frame % 3}px ${(frame * 2) % 3}px` }} />

      <Audio src={staticFile(narration)} volume={1} />
      {SFX.map(([t, name, vol], i) => (
        <Sequence key={i} from={Math.round(t * FPS)} layout="none" name={`sfx ${name}`}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
