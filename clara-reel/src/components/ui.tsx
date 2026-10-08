import React from "react";
import { AbsoluteFill } from "remotion";
import { clampInterp, EXPO, ramp, useSec, usePop } from "../lib/anim";
import { C, FONT, MONO, SERIF } from "../theme";

/** Scene title that sits beside docked Clara. */
export const Header: React.FC<{ eyebrow: string; title: string; sub?: string; at?: number; color?: string }> = ({
  eyebrow,
  title,
  sub,
  at = 0,
  color = C.teal,
}) => {
  const s = useSec();
  const a = ramp(s, at, at + 0.5);
  const b = ramp(s, at + 0.1, at + 0.7);
  const c = ramp(s, at + 0.25, at + 0.85);
  return (
    <div style={{ position: "absolute", left: 300, top: 248, width: 720 }}>
      <div
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 6,
          color,
          opacity: a,
          translate: `${(1 - a) * -30}px 0px`,
        }}
      >
        {eyebrow.toUpperCase()}
      </div>
      <div style={{ overflow: "hidden", paddingBottom: 6 }}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 66,
            lineHeight: 1.04,
            color: C.ink,
            letterSpacing: -1.5,
            translate: `0px ${(1 - b) * 90}px`,
          }}
        >
          {title}
        </div>
      </div>
      {sub ? (
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: C.dim, opacity: c, marginTop: 4 }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
};

export const Glass: React.FC<{ style?: React.CSSProperties; children?: React.ReactNode; edge?: string }> = ({
  style,
  children,
  edge = C.glassEdge,
}) => (
  <div
    style={{
      position: "absolute",
      borderRadius: 40,
      background: `linear-gradient(160deg, rgba(24,48,96,0.66), rgba(8,18,42,0.72))`,
      border: `1.5px solid ${edge}`,
      boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * Scene wrapper, active between global seconds `from` and `to`: soft zoom/blur in,
 * slow camera push while on screen, fade/zoom out. Renders nothing outside its window.
 */
export const Shell: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const s = useSec();
  if (s < from - 0.01 || s > to + 0.01) return null;
  const inK = ramp(s, from, from + 0.55);
  const outK = ramp(s, to - 0.3, to, EXPO);
  const push = (s - from) / Math.max(1, to - from);
  const blur = (1 - inK) * 14 + outK * 10;
  return (
    <AbsoluteFill
      style={{
        opacity: inK * (1 - outK),
        scale: String(1.05 - 0.05 * inK + 0.06 * outK + 0.025 * push),
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

export const Pop: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: number }> = ({
  at,
  children,
  style,
  from = 0.4,
}) => {
  const p = usePop(at);
  return (
    <div style={{ position: "absolute", ...style, opacity: Math.min(1, p * 1.5), scale: String(from + (1 - from) * p) }}>
      {children}
    </div>
  );
};

export const FadeUp: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; dist?: number }> = ({
  at,
  children,
  style,
  dist = 50,
}) => {
  const s = useSec();
  const k = ramp(s, at, at + 0.6);
  return <div style={{ position: "absolute", ...style, opacity: k, translate: `0px ${(1 - k) * dist}px` }}>{children}</div>;
};

/** Person card (monogram avatar; no photos needed). */
export const PersonCard: React.FC<{ name: string; org: string; initials: string; tint: string; tag?: string }> = ({
  name,
  org,
  initials,
  tint,
  tag,
}) => (
  <div
    style={{
      width: 300,
      padding: "34px 20px 28px",
      borderRadius: 36,
      background: "linear-gradient(170deg, rgba(30,56,108,0.75), rgba(10,20,46,0.85))",
      border: `1.5px solid ${C.glassEdge}`,
      boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
    }}
  >
    <div
      style={{
        width: 132,
        height: 132,
        borderRadius: 999,
        background: `radial-gradient(circle at 35% 30%, ${tint}, rgba(0,0,0,0.2) 75%)`,
        border: `3px solid ${C.gold}`,
        boxShadow: `0 0 40px ${tint}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 52,
        color: "white",
      }}
    >
      {initials}
    </div>
    <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: C.ink, textAlign: "center", lineHeight: 1.1 }}>
      {name}
    </div>
    <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 23, color: C.dim, textAlign: "center" }}>{org}</div>
    {tag ? (
      <div
        style={{
          fontFamily: MONO,
          fontSize: 20,
          fontWeight: 700,
          color: C.gold,
          letterSpacing: 2,
          border: `1px solid ${C.gold}66`,
          padding: "6px 14px",
          borderRadius: 999,
        }}
      >
        {tag}
      </div>
    ) : null}
  </div>
);

export const Chip: React.FC<{ children: React.ReactNode; color?: string; style?: React.CSSProperties }> = ({
  children,
  color = C.teal,
  style,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 10,
      padding: "12px 24px",
      borderRadius: 999,
      background: `${color}22`,
      border: `1.5px solid ${color}88`,
      color,
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 30,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Rubber-stamp style verdict. */
export const Stamp: React.FC<{ at: number; text: string; color: string; rotate?: number; style?: React.CSSProperties }> = ({
  at,
  text,
  color,
  rotate = -8,
  style,
}) => {
  const s = useSec();
  const k = clampInterp(s, [at, at + 0.18], [0, 1], EXPO);
  return (
    <div
      style={{
        position: "absolute",
        ...style,
        opacity: k,
        scale: String(2.2 - 1.2 * k),
        rotate: `${rotate}deg`,
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 92,
        letterSpacing: 4,
        color,
        border: `8px solid ${color}`,
        borderRadius: 24,
        padding: "6px 30px",
        textShadow: `0 0 30px ${color}88`,
        boxShadow: `0 0 50px ${color}44, inset 0 0 30px ${color}33`,
      }}
    >
      {text}
    </div>
  );
};
