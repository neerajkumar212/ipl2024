import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { Background } from "../components/Background";
import { Clara } from "../components/Clara";
import envV6 from "../data/envelope_v6.json";
import { EXPO, INOUT } from "../lib/anim";
import { C, FPS } from "../theme";
import { Cut, SceneDef, Stage } from "../v2/Stage";
import { Captions6 } from "./Captions6";
import { SClose16, SClose26, SDanger6, SDecide6, SHeal6, SHook6, SIntro6, SIV6, SOutro6, SRoom6, SRWomb6, SSecond6, SSurgery6, STumor6, SWeeks6 } from "./scenes6";
import { seg, TOTAL, w } from "./timing";

/* Episode 4 (premium): Baby Rylan, fetal heart surgery. Built on the Ep2 engine, minus every flash/beam. */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ENV = envV6 as number[];
export const V6_SECONDS = TOTAL + 1.7;

/* ------------------------------------------------------------ edit decision list */

const cutBefore = (id: string) => seg(id).start - 0.13;
const B = {
  intro: cutBefore("intro"),
  weeks: cutBefore("weeks"),
  tumor: cutBefore("tumor"),
  danger: cutBefore("danger"),
  decide: cutBefore("decide"),
  surgery: cutBefore("surgery"),
  iv: cutBefore("iv"),
  room: cutBefore("room"),
  rwomb: cutBefore("rwomb"),
  heal: cutBefore("heal"),
  second: cutBefore("second"),
  close1: cutBefore("close1"),
  close2: cutBefore("close2"),
  outro: cutBefore("cta"),
};

const SCENES: SceneDef[] = [
  { id: "hook", from: 0, to: B.intro, C: SHook6 },
  { id: "intro", from: B.intro, to: B.weeks, C: SIntro6 },
  { id: "weeks", from: B.weeks, to: B.tumor, C: SWeeks6 },
  { id: "tumor", from: B.tumor, to: B.danger, C: STumor6 },
  { id: "danger", from: B.danger, to: B.decide, C: SDanger6 },
  { id: "decide", from: B.decide, to: B.surgery, C: SDecide6 },
  { id: "surgery", from: B.surgery, to: B.iv, C: SSurgery6 },
  { id: "iv", from: B.iv, to: B.room, C: SIV6 },
  { id: "room", from: B.room, to: B.rwomb, C: SRoom6 },
  { id: "rwomb", from: B.rwomb, to: B.heal, C: SRWomb6 },
  { id: "heal", from: B.heal, to: B.second, C: SHeal6 },
  { id: "second", from: B.second, to: B.close1, C: SSecond6 },
  { id: "close1", from: B.close1, to: B.close2, C: SClose16 },
  { id: "close2", from: B.close2, to: B.outro, C: SClose26 },
  { id: "outro", from: B.outro, to: V6_SECONDS, C: SOutro6 },
];

// Only whip / zoom / iris / glitch: no "flash" and no "lightwipe" anywhere.
const CUTS: Cut[] = [
  { type: "iris", d: 0.8, cx: 540, cy: 820 },
  { type: "zoom", d: 0.7 },
  { type: "whipLeft", d: 0.55 },
  { type: "glitch", d: 0.45 },
  { type: "whipUp", d: 0.6 },
  { type: "zoom", d: 0.7 },
  { type: "whipLeft", d: 0.55 },
  { type: "glitch", d: 0.45 },
  { type: "whipRight", d: 0.55 },
  { type: "iris", d: 0.8, cx: 540, cy: 900 },
  { type: "zoom", d: 0.7 },
  { type: "whipLeft", d: 0.55 },
  { type: "whipUp", d: 0.6 },
  { type: "zoom", d: 0.7 },
];

const MOODS: [number, string][] = [
  [0, "200,90,130"],
  [B.intro, "31,200,214"],
  [B.tumor, "139,123,255"],
  [B.danger, "255,90,95"],
  [B.decide, "244,199,106"],
  [B.surgery, "31,200,214"],
  [B.room, "255,181,71"],
  [B.rwomb, "83,227,166"],
  [B.second, "244,199,106"],
  [B.close1, "31,200,214"],
  [B.outro, "31,200,214"],
];

/* ------------------------------------------------------------ sound design */

const cutSfx: Record<Cut["type"], [string, number, number][]> = {
  flash: [],
  lightwipe: [],
  zoom: [["rev", -1.1, 0.35], ["whoosh", -0.35, 0.55]],
  iris: [["whoosh", -0.4, 0.5], ["shimmer", -0.1, 0.4]],
  glitch: [["glitch", -0.2, 0.55]],
  whipLeft: [["whoosh_fast", -0.25, 0.6]],
  whipRight: [["whoosh_fast", -0.25, 0.6]],
  whipUp: [["whoosh_fast", -0.25, 0.6]],
};

const SFX: [number, string, number][] = [
  // hook: heartbeat under a slow swell, no impact flash
  [0.1, "heart", 0.55], [1.0, "heart", 0.5], [1.9, "heart", 0.45], [0.2, "swell", 0.35], [w("hook", "open") - 0.1, "whoosh", 0.45], [w("hook", "inside") - 0.8, "riser", 0.3], [w("hook", "inside"), "impact", 0.45],
  // intro
  [seg("intro").start - 0.05, "pop", 0.5], [seg("intro").start, "shimmer", 0.4],
  // weeks
  [w("weeks", "26"), "tick", 0.55], [w("weeks", "26") + 0.3, "ding", 0.4],
  // tumor
  [w("tumor", "teratoma"), "pop", 0.5], [w("tumor", "growing"), "swell", 0.35], [w("tumor", "heart."), "heart", 0.55],
  // danger
  [seg("danger").start + 0.3, "heart", 0.5], [seg("danger").start + 1.2, "heart", 0.4], [w("danger", "1"), "stamp", 0.7], [w("danger", "1"), "impact", 0.45], [w("danger", "weeks."), "swoosh_down", 0.35],
  // decide / operate
  [w("decide", "bold") - 0.1, "riser", 0.3], [seg("operate").start, "whoosh", 0.45], [w("operate", "womb."), "stamp", 0.65], [w("operate", "womb."), "shimmer", 0.4],
  // surgery
  [seg("surgery").start + 0.4, "pop", 0.45], [w("surgery", "removed") - 0.2, "whoosh_fast", 0.45], [w("surgery", "removed") + 0.2, "pop", 0.5], [w("surgery", "tiny"), "shimmer", 0.35],
  // iv
  [w("iv", "hand,"), "pop", 0.5], [w("iv", "keep") - 0.2, "whoosh_fast", 0.4], [w("iv", "keep") + 0.2, "pop", 0.45],
  // room
  [w("room", "No"), "impact", 0.5], [w("room", "No") + 0.05, "swoosh_down", 0.4],
  // recovery womb
  [w("rwomb", "recovery"), "shimmer", 0.5], [w("rwomb", "recovery") + 0.1, "ding", 0.35],
  // heal
  [seg("heal").start + 0.4, "tick", 0.45], [seg("heal").start + 1.2, "tick", 0.42], [seg("heal").start + 2.0, "tick", 0.42], [w("heal", "born") - 0.6, "riser", 0.3], [w("heal", "born"), "ding", 0.55], [w("heal", "born") + 0.1, "shimmer", 0.45],
  // second
  [w("second", "second") - 0.1, "boom", 0.5], [w("second", "second"), "impact", 0.4], [w("second", "world.") - 0.1, "whoosh", 0.4],
  // close
  [w("close1", "patient."), "stamp", 0.6], [w("close2", "person,") - 0.1, "swell", 0.4], [w("close2", "small."), "shimmer", 0.45],
  // outro: logo sting + follow press
  [seg("cta").start - 0.15, "whoosh", 0.5], [seg("cta").start + 0.1, "shimmer", 0.5], [seg("cta").end + 0.1, "tick", 0.9], [seg("cta").end + 0.15, "blip", 0.7], [seg("cta").end + 0.25, "ding", 0.45],
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
  const toDock = interpolate(s, [seg("weeks").start - 0.25, seg("weeks").start + 0.4], [0, 1], { ...clamp, easing: INOUT });
  const toEnd = interpolate(s, [seg("cta").start - 0.5, seg("cta").start + 0.3], [0, 1], { ...clamp, easing: EXPO });
  let x = STAGE.x + (DOCK.x - STAGE.x) * toDock;
  let y = STAGE.y + (DOCK.y - STAGE.y) * toDock;
  let size = STAGE.size + (DOCK.size - STAGE.size) * toDock;
  x += (END.x - x) * toEnd;
  y += (END.y - y) * toEnd;
  size += (END.size - size) * toEnd;
  const enter = spring({ frame: frame - tIn * FPS, fps: FPS, config: { damping: 11, stiffness: 120 } });
  const wave = interpolate(s, [tIn, tIn + 0.2, seg("intro").end, seg("intro").end + 0.3], [0, 1, 1, 0], clamp) + interpolate(s, [seg("cta").start, seg("cta").start + 0.3], [0, 1], clamp);
  const hop = [w("operate", "womb."), w("heal", "born"), w("second", "second")].reduce((a, t) => a + Math.max(0, Math.sin(Math.min(1, Math.max(0, (s - t) / 0.35)) * Math.PI)) * 14, 0);
  return (
    <div style={{ position: "absolute", left: x - size / 2, top: y - size * 0.6 - hop, scale: String(enter), zIndex: 8 }}>
      <Clara frame={frame} size={size} env={ENV} mood={s > seg("cta").end ? "happy" : "talk"} wave={wave} glow={1 - 0.5 * toDock * (1 - toEnd)} />
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
      <div style={{ width: `${(100 * frame) / (V6_SECONDS * FPS)}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, #1B4F96, ${C.teal}, ${C.cyan})` }} />
    </div>
  );
};

export const ReelV6: React.FC = () => {
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
      <AbsoluteFill style={{ zIndex: 10 }}>{s < seg("cta").start - 0.1 ? <Captions6 /> : null}</AbsoluteFill>
      <AbsoluteFill style={{ opacity: 0.05, zIndex: 11, backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 0.6px, transparent 0.8px)", backgroundSize: "3px 3px", backgroundPosition: `${frame % 3}px ${(frame * 2) % 3}px`, pointerEvents: "none" }} />

      <Audio src={staticFile("audio/clara_v6.wav")} volume={1} />
      <Audio src={staticFile("audio/music_v6.wav")} volume={0.3} />
      {SFX.filter(([t]) => t >= 0).map(([t, name, vol], i) => (
        <Sequence key={i} from={Math.round(t * FPS)} layout="none" name={`sfx ${name}`}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * 0.85} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
