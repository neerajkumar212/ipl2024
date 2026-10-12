import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, interpolate, random, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import { Clara } from "../components/Clara";
import envV4 from "../data/envelope_v4.json";
import { C, FONT, FPS } from "../theme";
import { CARD, CGuideline, CHeadlines, CPen, CPillars, CPoll, CQuote, CRuler, CScale, CStat, CSurgery, CTeens, CTip, CTrend, CTrial, CUnder10, CYounger, EndCard } from "./cards";
import { SEGS, seg, TOTAL, TWord, w } from "./timing";

/*
 * Episode 3: WHO's first child & adolescent obesity guideline.
 * Edit style follows the user's reference reel: a "talking head" (Clara) on a dark studio backdrop,
 * hard jump-cut punch-ins, bold uppercase captions, and rounded B-roll cards popping in underneath.
 * No flashes or light beams anywhere (user request): every cut is a hard cut or a card pop.
 */

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ENV = envV4 as number[];
export const V4_SECONDS = TOTAL + 1.2;

/* ------------------------------------------------------------ edit list */

type CardDef = { from: number; to: number; C: React.FC };
const at = (id: string) => seg(id).start - 0.08;

const CARDS: CardDef[] = [
  { from: 0, to: at("answer"), C: CPen },
  { from: at("answer"), to: at("intro"), C: CHeadlines },
  { from: at("date"), to: at("scale"), C: CGuideline },
  { from: at("scale"), to: at("trend"), C: CScale },
  { from: at("trend"), to: at("rule"), C: CTrend },
  { from: at("under10"), to: at("teens"), C: CUnder10 },
  { from: at("teens"), to: at("surgery"), C: CTeens },
  { from: at("surgery"), to: at("why"), C: CSurgery },
  { from: at("why"), to: at("trial"), C: CYounger },
  { from: at("trial"), to: at("caveat"), C: CTrial },
  { from: at("caveat"), to: at("found"), C: CRuler },
  { from: at("found"), to: at("pillars"), C: CQuote },
  { from: at("pillars"), to: at("tip"), C: CPillars },
  { from: at("tip"), to: at("stat"), C: CTip },
  { from: at("stat"), to: at("cta"), C: CStat },
  { from: at("cta"), to: at("outro"), C: CPoll },
];

const cardAt = (s: number) => CARDS.find((c) => s >= c.from && s < c.to);

// Camera "shots" on Clara: hard jump cuts between framings, like a two-camera interview.
type Shot = { t: number; scale: number; dx: number; dy: number };
const SHOTS: Shot[] = [
  { t: 0, scale: 1, dx: 0, dy: 0 },
  { t: at("answer"), scale: 1.18, dx: -40, dy: 30 },
  { t: at("intro"), scale: 1, dx: 0, dy: 0 },
  { t: at("date"), scale: 1, dx: 0, dy: 0 },
  { t: at("scale"), scale: 1.2, dx: 50, dy: 30 },
  { t: at("trend"), scale: 1, dx: 0, dy: 0 },
  { t: at("rule"), scale: 1.28, dx: 0, dy: 60 },
  { t: at("under10"), scale: 1, dx: 0, dy: 0 },
  { t: at("teens"), scale: 1.16, dx: -50, dy: 24 },
  { t: at("surgery"), scale: 1, dx: 0, dy: 0 },
  { t: at("why"), scale: 1.2, dx: 40, dy: 30 },
  { t: at("trial"), scale: 1, dx: 0, dy: 0 },
  { t: at("caveat"), scale: 1.22, dx: -40, dy: 30 },
  { t: at("found"), scale: 1, dx: 0, dy: 0 },
  { t: at("pillars"), scale: 1.15, dx: 40, dy: 20 },
  { t: at("tip"), scale: 1, dx: 0, dy: 0 },
  { t: at("stat"), scale: 1.18, dx: -40, dy: 26 },
  { t: at("cta"), scale: 1, dx: 0, dy: 0 },
  { t: at("outro"), scale: 1, dx: 0, dy: 0 },
];
const shotAt = (s: number) => [...SHOTS].reverse().find((x) => s >= x.t) ?? SHOTS[0];

/* ------------------------------------------------------------ sound design (no booms on the open) */

const SFX: [number, string, number][] = [
  [0.1, "heart", 0.45], [1.05, "heart", 0.4], [0.2, "swell", 0.3],
  [w("hook", "injection?") - 0.1, "pop", 0.45],
  [w("answer", "World") - 0.25, "whoosh", 0.4], [w("answer", "answered.") , "stamp", 0.6],
  [seg("intro").start, "shimmer", 0.4],
  [w("date", "7,"), "stamp", 0.6], [w("date", "first"), "impact", 0.4],
  [w("scale", "170") - 0.1, "riser", 0.3], [w("scale", "170") + 1.2, "ding", 0.4], [w("scale", "adolescents"), "pop", 0.4],
  [w("trend", "quadrupled,"), "impact", 0.45], [w("trend", "8"), "ding", 0.4],
  [seg("rule").start, "whoosh_fast", 0.35],
  [w("under10", "medicines."), "glitch", 0.25], [w("under10", "surgery,"), "glitch", 0.25], [w("under10", "devices."), "glitch", 0.25],
  [w("teens", "GLP-1"), "pop", 0.45], [w("only", "only"), "stamp", 0.55], [w("only", "supervised"), "shimmer", 0.35],
  [w("surgery", "severe"), "pop", 0.4], [w("surgery", "strict"), "pop", 0.4],
  [w("why", "moving"), "riser", 0.3], [w("why", "fast."), "whoosh_fast", 0.45],
  [w("trial", "2"), "impact", 0.45], [w("trial", "2") + 0.3, "blip", 0.45], [w("trial", "2") + 0.55, "blip", 0.45],
  [w("caveat", "long-term"), "tick", 0.5], [w("caveat", "answers."), "tick", 0.45],
  [w("found", "foundation"), "shimmer", 0.4], [w("found", "not"), "stamp", 0.45],
  [w("pillars", "healthy"), "pop", 0.4], [w("pillars", "activity,"), "pop", 0.4], [w("pillars", "behavior"), "pop", 0.4], [w("pillars", "mental"), "pop", 0.4], [w("pillars", "family."), "ding", 0.4],
  [seg("tip").start, "ding", 0.5], [w("tip2", "nausea,") + 0.1, "tick", 0.45], [w("tip2", "hydration") + 0.1, "tick", 0.45], [w("tip2", "nutrition.") + 0.1, "tick", 0.45],
  [w("stat", "1"), "impact", 0.45], [w("stat", "1") + 0.3, "blip", 0.45],
  [seg("cta").start + 0.2, "pop", 0.45], [seg("cta").start + 0.45, "pop", 0.45], [w("cta", "comments."), "ding", 0.4],
  [seg("outro").start + 0.1, "pop", 0.45], [w("outro", "I'm") , "shimmer", 0.45],
  // a soft whoosh under every card change
  ...CARDS.slice(1).map((c) => [c.from - 0.12, "whoosh_fast", 0.22] as [number, string, number]),
];

/* ------------------------------------------------------------ studio backdrop (like the reference: charcoal, soft vignette) */

const Studio: React.FC = () => {
  const frame = useCurrentFrame();
  const s = frame / FPS;
  const sway = Math.sin(s * 0.25) * 40;
  return (
    <AbsoluteFill style={{ background: "#0A1114" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 1100px at ${560 + sway}px 640px, #2A3A3F 0%, #18252A 38%, #0C1417 70%, #070C0E 100%)`,
        }}
      />
      {/* muslin texture: very low-contrast mottling */}
      <AbsoluteFill
        style={{
          opacity: 0.18,
          background:
            "radial-gradient(420px 300px at 22% 30%, rgba(120,150,150,0.35), transparent 70%), radial-gradient(380px 420px at 80% 22%, rgba(90,120,120,0.3), transparent 70%), radial-gradient(500px 400px at 70% 70%, rgba(110,140,140,0.25), transparent 70%)",
        }}
      />
      <AbsoluteFill style={{ boxShadow: "inset 0 0 260px 80px rgba(0,0,0,0.75)" }} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ Clara host */

const ClaraHost: React.FC = () => {
  const frame = useCurrentFrame();
  const s = frame / FPS;
  const hasCard = !!cardAt(s);
  const shot = shotAt(s);
  // two layouts: small above a card, or big and centred (no card)
  const size = hasCard ? 470 : 690;
  const cy = hasCard ? 560 : 820;
  const wave = interpolate(s, [seg("intro").start, seg("intro").start + 0.2, seg("intro").end, seg("intro").end + 0.3], [0, 1, 1, 0], clamp) +
    interpolate(s, [w("outro", "Stay") - 0.2, w("outro", "Stay")], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ scale: String(shot.scale), translate: `${shot.dx}px ${shot.dy}px`, transformOrigin: `540px ${cy - 120}px` }}>
      {/* soft floor shadow / rim so she sits in the studio */}
      <div style={{ position: "absolute", left: 540 - size * 0.55, top: cy - size * 0.75, width: size * 1.1, height: size * 1.3, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(91,231,255,0.10), transparent)" }} />
      <div style={{ position: "absolute", left: 540 - size / 2, top: cy - size * 0.62, }}>
        <Clara frame={frame} size={size} env={ENV} mood={s > w("outro", "Stay") ? "happy" : "talk"} wave={wave} glow={0.55} />
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------ media card */

const CardLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const s = frame / FPS;
  const card = cardAt(s);
  if (!card) return null;
  const k = card.from === 0 ? 1 : spring({ frame: frame - card.from * FPS, fps: FPS, config: { damping: 13, stiffness: 170, mass: 0.7 } });
  const out = interpolate(s, [card.to - 0.12, card.to], [1, 0], clamp);
  const Body = card.C;
  return (
    <div
      style={{
        position: "absolute",
        left: CARD.x,
        top: CARD.y,
        width: CARD.w,
        height: CARD.h,
        borderRadius: 44,
        overflow: "hidden",
        background: "linear-gradient(165deg, #142632 0%, #0C1822 55%, #08121A 100%)",
        border: "2px solid rgba(160,210,230,0.18)",
        boxShadow: "0 40px 90px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.08)",
        scale: String((0.86 + 0.14 * k) * (0.96 + 0.04 * out)),
        translate: `0px ${(1 - k) * 70}px`,
        opacity: Math.min(1, k * 1.5) * out,
        zIndex: 5,
      }}
    >
      <Body />
    </div>
  );
};

/* ------------------------------------------------------------ captions: bold uppercase, 1–3 words, like the reference */

const KEY = new Set(
  "weight-loss injection? world health organization first guideline obesity 170 million quadrupled 2 8 percent under 10 no medicines surgery devices glp-1 only supervised lifestyle severe strict careful younger fast wegovy 12 5 promising long-term not medicine food activity behavior mental family pharmacist tip nausea hydration nutrition 1 6 deficiency comments save clara healthy".split(
    " ",
  ),
);
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9'?-]/g, "").replace(/[?]$/, "");
const isKey = (t: string) => KEY.has(norm(t)) || KEY.has(t.toLowerCase().replace(/[.,:!]$/, ""));

type Chunk = { words: TWord[]; start: number; end: number };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  SEGS.forEach((sg) => {
    let cur: TWord[] = [];
    sg.words.forEach((wd, i) => {
      cur.push(wd);
      const last = i === sg.words.length - 1;
      const len = cur.reduce((a, x) => a + x.text.length, 0);
      if (last || /[.,?!:]$/.test(wd.text) || cur.length >= 3 || len > 14) {
        out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
        cur = [];
      }
    });
  });
  return out.map((c, i) => {
    const next = out[i + 1];
    const end = next && next.start - c.end < 0.5 ? next.start : c.end + 0.2;
    // the hook caption is on screen from frame 0 so the first frame works as a thumbnail
    return { ...c, start: i === 0 ? 0 : c.start, end };
  });
})();

const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const s = frame / FPS;
  const chunk = CHUNKS.find((c) => s >= c.start - 0.03 && s < c.end);
  if (!chunk) return null;
  const bottom = 1920 - (cardAt(s) ? 1018 : 1440);
  const k = spring({ frame: frame - chunk.start * FPS, fps: FPS, config: { damping: 12, stiffness: 220, mass: 0.6 } });
  return (
    <div style={{ position: "absolute", left: 40, right: 40, bottom, display: "flex", justifyContent: "center", alignContent: "flex-end", flexWrap: "wrap", zIndex: 7, transformOrigin: "50% 100%", scale: String(0.9 + 0.1 * k) }}>
      {chunk.words.map((wd, i) => {
        const active = s >= wd.start - 0.02;
        const key = isKey(wd.text);
        return (
          <span
            key={i}
            style={{
              fontFamily: FONT,
              fontWeight: 900,
              fontSize: 82,
              lineHeight: 1.05,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              padding: "0 13px",
              color: key && active ? C.cyan : "#FFFFFF",
              WebkitTextStroke: "2px rgba(0,0,0,0.35)",
              textShadow: "0 5px 0 rgba(0,0,0,0.55), 0 10px 28px rgba(0,0,0,0.85)",
            }}
          >
            {wd.text.replace(/[,:]$/, "")}
          </span>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------ chrome */

const Bug: React.FC = () => (
  <div style={{ position: "absolute", top: 72, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 9, opacity: 0.95 }}>
    <Img src={staticFile("brand/logo_on_dark.png")} style={{ height: 64, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.6))" }} />
  </div>
);

const Progress: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", top: 34, left: 60, right: 60, height: 5, borderRadius: 6, background: "rgba(255,255,255,0.12)", zIndex: 9 }}>
      <div style={{ width: `${(100 * frame) / (V4_SECONDS * FPS)}%`, height: "100%", borderRadius: 6, background: `linear-gradient(90deg, #1B4F96, ${C.teal}, ${C.cyan})` }} />
    </div>
  );
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: 0.06,
        zIndex: 11,
        pointerEvents: "none",
        backgroundImage: "radial-gradient(rgba(255,255,255,0.8) 0.6px, transparent 0.8px)",
        backgroundSize: "3px 3px",
        backgroundPosition: `${Math.floor(random(`g${frame}`) * 3)}px ${Math.floor(random(`h${frame}`) * 3)}px`,
      }}
    />
  );
};

export const ReelV4: React.FC = () => {
  const frame = useCurrentFrame();
  const s = frame / FPS;
  // no fade or flash on the open (frame 0 doubles as the thumbnail); soft fade to black at the end
  const fadeOut = interpolate(s, [V4_SECONDS - 0.6, V4_SECONDS], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ backgroundColor: "#070C0E" }}>
      <Studio />
      <ClaraHost />
      <CardLayer />
      {s >= seg("outro").start ? <EndCard /> : null}
      {s < seg("outro").start ? <Captions /> : null}
      <Bug />
      <Progress />
      <Grain />
      <AbsoluteFill style={{ background: "black", opacity: fadeOut, zIndex: 12 }} />

      <Audio src={staticFile("audio/clara_v4.wav")} volume={1} />
      <Audio src={staticFile("audio/music_v4.wav")} volume={0.28} />
      {SFX.filter(([t]) => t >= 0).map(([t, name, vol], i) => (
        <Sequence key={i} from={Math.round(t * FPS)} layout="none" name={`sfx ${name}`}>
          <Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * 0.8} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
