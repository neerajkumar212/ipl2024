import React from "react";
import { AbsoluteFill, Easing, interpolate, random, useCurrentFrame } from "remotion";
import { H, W } from "../theme";

export type TType = "whipLeft" | "whipRight" | "whipUp" | "zoom" | "iris" | "lightwipe" | "glitch" | "flash";
export type SceneDef = { id: string; from: number; to: number; C: React.FC };
export type Cut = { type: TType; d: number; cx?: number; cy?: number };

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const WHIP = Easing.bezier(0.75, 0, 0.25, 1);
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const IN = Easing.bezier(0.7, 0, 0.84, 0);

type Look = { style: React.CSSProperties; blur?: [number, number]; z?: number };

const enterLook = (c: Cut, p: number, frame: number): Look => {
  const e = WHIP(p);
  switch (c.type) {
    case "whipLeft":
      return { style: { translate: `${W * (1 - e)}px 0px` }, blur: [90 * Math.sin(Math.PI * p), 0], z: 2 };
    case "whipRight":
      return { style: { translate: `${-W * (1 - e)}px 0px` }, blur: [90 * Math.sin(Math.PI * p), 0], z: 2 };
    case "whipUp":
      return { style: { translate: `0px ${H * (1 - e)}px` }, blur: [0, 90 * Math.sin(Math.PI * p)], z: 2 };
    case "zoom": {
      const k = OUT(interpolate(p, [0.35, 1], [0, 1], clamp));
      return { style: { scale: String(0.45 + 0.55 * k), opacity: interpolate(p, [0.35, 0.6], [0, 1], clamp) }, blur: [24 * (1 - k), 24 * (1 - k)], z: 2 };
    }
    case "iris": {
      const r = 1400 * Easing.bezier(0.65, 0, 0.35, 1)(p);
      return { style: { clipPath: `circle(${r}px at ${c.cx ?? W / 2}px ${c.cy ?? H / 2}px)` }, z: 2 };
    }
    case "lightwipe": {
      const x = -700 + (W + 1400) * Easing.bezier(0.65, 0, 0.35, 1)(p);
      return { style: { clipPath: `polygon(0 0, ${x + 350}px 0, ${x - 350}px ${H}px, 0 ${H}px)` }, z: 2 };
    }
    case "glitch": {
      // Flicker between the two scenes, showing the new one through random horizontal slices.
      const r1 = random(`ga${frame}`);
      const r2 = random(`gb${frame}`);
      const full = random(`gc${frame}`) < p * p;
      const top = Math.min(r1, r2) * 100;
      const bottom = 100 - Math.max(r1, r2) * 100 * (0.6 + 0.4 * p);
      const jitter = (random(`gj${frame}`) - 0.5) * 70 * Math.sin(Math.PI * p);
      return {
        style: { clipPath: p >= 0.97 || full ? undefined : `inset(${top}% 0 ${Math.max(0, bottom)}% 0)`, translate: `${jitter}px 0px` },
        z: 2,
      };
    }
    case "flash": {
      const k = OUT(interpolate(p, [0.5, 1], [0, 1], clamp));
      return { style: { opacity: p >= 0.5 ? 1 : 0, scale: String(1.18 - 0.18 * k) }, z: 2 };
    }
  }
};

const exitLook = (c: Cut, p: number, frame: number): Look => {
  const e = WHIP(p);
  switch (c.type) {
    case "whipLeft":
      return { style: { translate: `${-W * e}px 0px` }, blur: [90 * Math.sin(Math.PI * p), 0] };
    case "whipRight":
      return { style: { translate: `${W * e}px 0px` }, blur: [90 * Math.sin(Math.PI * p), 0] };
    case "whipUp":
      return { style: { translate: `0px ${-H * e}px` }, blur: [0, 90 * Math.sin(Math.PI * p)] };
    case "zoom": {
      const k = IN(interpolate(p, [0, 0.65], [0, 1], clamp));
      return { style: { scale: String(1 + 2.6 * k), opacity: interpolate(p, [0.3, 0.6], [1, 0], clamp) }, blur: [20 * k, 20 * k] };
    }
    case "iris":
    case "lightwipe":
      return { style: { scale: String(1 + 0.06 * p), filter: `brightness(${1 - 0.4 * p})` } };
    case "glitch": {
      const jitter = (random(`gx${frame}`) - 0.5) * 80 * Math.sin(Math.PI * p);
      return { style: { translate: `${jitter}px 0px` } };
    }
    case "flash":
      return { style: { opacity: p < 0.5 ? 1 : 0, scale: String(1 + 0.25 * IN(Math.min(1, p * 2))) } };
  }
};

/** Glow / flare drawn on top of a cut. */
const CutOverlay: React.FC<{ c: Cut; p: number }> = ({ c, p }) => {
  if (c.type === "flash") {
    const k = Math.exp(-((p - 0.5) ** 2) / 0.012);
    return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgba(255,255,255,${k}), rgba(150,210,255,${0.85 * k}) 70%)` }} />;
  }
  if (c.type === "iris") {
    const r = 1400 * Easing.bezier(0.65, 0, 0.35, 1)(p);
    return (
      <svg width={W} height={H} style={{ position: "absolute", opacity: Math.sin(Math.PI * p) }}>
        <circle cx={c.cx ?? W / 2} cy={c.cy ?? H / 2} r={r} fill="none" stroke="rgba(120,220,255,0.9)" strokeWidth={10} style={{ filter: "blur(4px)" }} />
        <circle cx={c.cx ?? W / 2} cy={c.cy ?? H / 2} r={r} fill="none" stroke="white" strokeWidth={3} />
      </svg>
    );
  }
  if (c.type === "lightwipe") {
    const x = -700 + (W + 1400) * Easing.bezier(0.65, 0, 0.35, 1)(p);
    return (
      <svg width={W} height={H} style={{ position: "absolute", opacity: Math.sin(Math.PI * p) }}>
        <line x1={x + 350} y1={0} x2={x - 350} y2={H} stroke="rgba(91,231,255,0.8)" strokeWidth={60} style={{ filter: "blur(30px)" }} />
        <line x1={x + 350} y1={0} x2={x - 350} y2={H} stroke="white" strokeWidth={5} />
      </svg>
    );
  }
  if (c.type === "glitch") {
    const k = Math.sin(Math.PI * p);
    return (
      <AbsoluteFill style={{ mixBlendMode: "screen", opacity: k * 0.5, background: "repeating-linear-gradient(0deg, rgba(255,0,80,0.25) 0 3px, transparent 3px 9px)" }} />
    );
  }
  if (c.type.startsWith("whip")) {
    const k = Math.sin(Math.PI * p);
    return <AbsoluteFill style={{ background: `rgba(140,200,255,${0.12 * k})` }} />;
  }
  return null;
};

export const Stage: React.FC<{ scenes: SceneDef[]; cuts: Cut[] }> = ({ scenes, cuts }) => {
  const frame = useCurrentFrame();
  const s = frame / 30;
  return (
    <AbsoluteFill>
      {scenes.map((sc, i) => {
        const cin = i > 0 ? cuts[i - 1] : null;
        const cout = i < scenes.length - 1 ? cuts[i] : null;
        const a = sc.from - (cin ? cin.d / 2 : 0);
        const b = sc.to + (cout ? cout.d / 2 : 0);
        if (s < a || s > b) return null;
        let look: Look = { style: {} };
        if (cin && s < sc.from + cin.d / 2) look = enterLook(cin, (s - (sc.from - cin.d / 2)) / cin.d, frame);
        else if (cout && s > sc.to - cout.d / 2) look = exitLook(cout, (s - (sc.to - cout.d / 2)) / cout.d, frame);
        const blur = look.blur && (look.blur[0] > 0.5 || look.blur[1] > 0.5) ? look.blur : null;
        return (
          <AbsoluteFill key={sc.id} style={{ zIndex: look.z ?? 1 }}>
            {blur ? (
              <svg width={0} height={0} style={{ position: "absolute" }}>
                <filter id={`mb-${sc.id}`} x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation={`${blur[0].toFixed(1)} ${blur[1].toFixed(1)}`} />
                </filter>
              </svg>
            ) : null}
            <AbsoluteFill style={{ ...look.style, filter: [look.style.filter, blur ? `url(#mb-${sc.id})` : null].filter(Boolean).join(" ") || undefined }}>
              <sc.C />
            </AbsoluteFill>
          </AbsoluteFill>
        );
      })}
      {cuts.map((c, i) => {
        const t = scenes[i].to;
        const p = (s - (t - c.d / 2)) / c.d;
        if (p < 0 || p > 1) return null;
        return (
          <AbsoluteFill key={`ov${i}`} style={{ zIndex: 5, pointerEvents: "none" }}>
            <CutOverlay c={c} p={p} />
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
