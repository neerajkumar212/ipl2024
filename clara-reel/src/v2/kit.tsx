import React from "react";
import { AbsoluteFill, Img, random, staticFile } from "remotion";
import { clampInterp, EXPO, ramp, useSec } from "../lib/anim";
import { C, FONT, MONO, SERIF } from "../theme";

export const center: React.CSSProperties = { left: 0, right: 0, display: "flex", justifyContent: "center" };

/** Scene title beside docked Clara: eyebrow line + masked title reveal. */
export const Title: React.FC<{ at: number; eyebrow: string; title: string; sub?: string; color?: string; out?: number }> = ({
  at,
  eyebrow,
  title,
  sub,
  color = C.teal,
  out = 1e9,
}) => {
  const s = useSec();
  const a = ramp(s, at, at + 0.5);
  const b = ramp(s, at + 0.08, at + 0.7);
  const c = ramp(s, at + 0.3, at + 0.9);
  const o = 1 - ramp(s, out - 0.3, out);
  return (
    <div style={{ position: "absolute", left: 296, top: 238, width: 740, opacity: o }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, opacity: a }}>
        <div style={{ width: 46 * a, height: 4, borderRadius: 4, background: color, boxShadow: `0 0 14px ${color}` }} />
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 25, letterSpacing: 6, color }}>{eyebrow.toUpperCase()}</div>
      </div>
      <div style={{ overflow: "hidden", paddingBottom: 8, marginTop: 4 }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: 1.04, color: "white", letterSpacing: -1.5, translate: `0px ${(1 - b) * 100}px` }}>
          {title}
        </div>
      </div>
      {sub ? <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: C.dim, opacity: c }}>{sub}</div> : null}
    </div>
  );
};

/** Source line, documentary style. */
export const Cite: React.FC<{ at: number; children: React.ReactNode; top?: number; until?: number }> = ({ at, children, top = 1340, until = 1e9 }) => {
  const s = useSec();
  const k = ramp(s, at, at + 0.6) * (1 - ramp(s, until - 0.3, until));
  return (
    <div style={{ position: "absolute", top, ...center, opacity: 0.85 * k }}>
      <div style={{ fontFamily: MONO, fontWeight: 500, fontSize: 21, letterSpacing: 1.5, color: C.dim, padding: "8px 18px", borderRadius: 999, background: "rgba(5,12,30,0.55)", border: "1px solid rgba(143,168,200,0.25)" }}>
        {children}
      </div>
    </div>
  );
};

/** Big kinetic word: letters rise with stagger and glow. */
export const Kinetic: React.FC<{ at: number; text: string; size: number; color?: string; glow?: string; stagger?: number; style?: React.CSSProperties; weight?: number }> = ({
  at,
  text,
  size,
  color = "white",
  glow,
  stagger = 0.03,
  style,
  weight = 900,
}) => {
  const s = useSec();
  return (
    <div style={{ display: "flex", justifyContent: "center", ...style }}>
      {text.split("").map((ch, i) => {
        const k = ramp(s, at + i * stagger, at + i * stagger + 0.5);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              fontFamily: FONT,
              fontWeight: weight,
              fontSize: size,
              letterSpacing: -size * 0.02,
              color,
              opacity: k,
              translate: `0px ${(1 - k) * size * 0.6}px`,
              scale: String(0.7 + 0.3 * k),
              filter: k < 0.98 ? `blur(${(1 - k) * 10}px)` : undefined,
              textShadow: glow ? `0 0 ${size * 0.35}px ${glow}` : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/** Laureate portrait: Nobel illustration in a gold-ringed frame with a name plate. */
export const Portrait: React.FC<{ at: number; file: string; name: string; org: string; size?: number; from?: "left" | "right" | "up"; tag?: string }> = ({
  at,
  file,
  name,
  org,
  size = 380,
  from = "up",
  tag,
}) => {
  const s = useSec();
  const k = clampInterp(s, [at, at + 0.7], [0, 1], EXPO);
  const dx = from === "left" ? -300 : from === "right" ? 300 : 0;
  const dy = from === "up" ? 120 : 0;
  const plate = ramp(s, at + 0.35, at + 0.9);
  const kb = 1.06 + 0.06 * Math.min(1, Math.max(0, (s - at) / 6));
  return (
    <div style={{ width: size, opacity: k, translate: `${dx * (1 - k)}px ${dy * (1 - k)}px`, rotate: `${(1 - k) * (from === "left" ? -6 : from === "right" ? 6 : 0)}deg` }}>
      <div
        style={{
          width: size,
          height: size * 1.2,
          borderRadius: 34,
          overflow: "hidden",
          border: `3px solid ${C.gold}`,
          boxShadow: `0 30px 80px rgba(0,0,0,0.55), 0 0 60px rgba(244,199,106,${0.25 * k})`,
          background: "#F1ECE2",
          position: "relative",
        }}
      >
        <Img src={staticFile(file)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(kb), objectPosition: "50% 30%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 55%, rgba(8,16,36,0.85))" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 18, textAlign: "center", opacity: plate, translate: `0px ${(1 - plate) * 20}px` }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: size * 0.105, color: "white" }}>{name}</div>
          <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: size * 0.06, color: C.gold }}>{org}</div>
        </div>
      </div>
      {tag ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 14, opacity: plate }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: C.gold, border: `1px solid ${C.gold}88`, borderRadius: 999, padding: "6px 14px" }}>{tag}</div>
        </div>
      ) : null}
    </div>
  );
};

/** Radial particle burst at a moment (sparks, celebrations). */
export const Burst: React.FC<{ at: number; x: number; y: number; color?: string; n?: number; dist?: number; dur?: number }> = ({
  at,
  x,
  y,
  color = C.cyan,
  n = 26,
  dist = 320,
  dur = 0.9,
}) => {
  const s = useSec();
  const p = (s - at) / dur;
  if (p < 0 || p > 1) return null;
  const e = 1 - (1 - p) ** 3;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      {new Array(n).fill(0).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + random(`ba${i}${at}`) * 0.4;
        const d = dist * (0.5 + 0.5 * random(`bd${i}${at}`)) * e;
        return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={(1 - p) * (3 + 4 * random(`br${i}${at}`))} fill={color} opacity={1 - p} />;
      })}
      <circle cx={x} cy={y} r={dist * 0.9 * e} fill="none" stroke={color} strokeWidth={6 * (1 - p)} opacity={0.8 * (1 - p)} />
    </svg>
  );
};

/** Soft volumetric beam of light from the top. */
export const Beam: React.FC<{ x: number; y0: number; y1: number; k: number; w?: number; color?: string }> = ({ x, y0, y1, k, w = 260, color = "110,175,255" }) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top: y0,
      width: w,
      height: y1 - y0,
      background: `linear-gradient(180deg, rgba(${color},0) 0%, rgba(${color},${0.55 * k}) 70%, rgba(220,240,255,${0.9 * k}) 100%)`,
      clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)",
      filter: "blur(6px)",
      mixBlendMode: "screen",
    }}
  />
);

/** Full-frame flash. */
export const Flash: React.FC<{ at: number; color?: string; dur?: number; peak?: number }> = ({ at, color = "160,210,255", dur = 0.6, peak = 0.85 }) => {
  const s = useSec();
  const k = clampInterp(s, [at - 0.04, at, at + dur], [0, peak, 0]);
  if (k <= 0) return null;
  return <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgba(255,255,255,${k}), rgba(${color},${k * 0.7}) 65%)`, pointerEvents: "none" }} />;
};

/** Camera shake offset for impacts. */
export const shake = (s: number, at: number, amp = 18, dur = 0.35) => {
  const p = (s - at) / dur;
  if (p < 0 || p > 1) return "0px 0px";
  const a = amp * (1 - p) ** 2;
  return `${Math.sin(s * 95) * a}px ${Math.cos(s * 83) * a}px`;
};
