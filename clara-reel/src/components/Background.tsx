import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C, H, W } from "../theme";

// Scene mood keyed by global time: [second, rgb of the glow]
const MOODS: [number, string][] = [
  [0, "61,139,255"],
  [9.5, "139,123,255"],
  [17, "61,139,255"],
  [28.8, "255,120,70"],
  [33.8, "61,139,255"],
  [39.8, "83,227,166"],
  [53.1, "61,139,255"],
  [71.6, "139,123,255"],
  [81.5, "31,200,214"],
  [92.1, "139,123,255"],
  [103.5, "244,199,106"],
];

const mix = (a: string, b: string, k: number) => {
  const pa = a.split(",").map(Number);
  const pb = b.split(",").map(Number);
  return pa.map((v, i) => Math.round(v + (pb[i] - v) * k)).join(",");
};

const moodAt = (s: number) => {
  let i = 0;
  while (i < MOODS.length - 1 && MOODS[i + 1][0] <= s) i++;
  const next = MOODS[i + 1];
  if (!next) return MOODS[i][1];
  const k = interpolate(s, [next[0] - 0.8, next[0]], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return mix(MOODS[i][1], next[1], k);
};

const DUST = new Array(70).fill(0).map((_, i) => ({
  x: random(`dx${i}`) * W,
  y: random(`dy${i}`) * H,
  r: 1 + random(`dr${i}`) * 2.6,
  v: 6 + random(`dv${i}`) * 22,
  tw: random(`dt${i}`) * Math.PI * 2,
}));

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const s = frame / 30;
  const mood = moodAt(s);
  const driftX = Math.sin(s * 0.21) * 120;
  const driftY = Math.cos(s * 0.17) * 160;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg0, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1100px 1300px at ${540 + driftX}px ${720 + driftY}px, rgba(${mood},0.30), transparent 60%),
            radial-gradient(900px 900px at ${880 - driftX}px ${1650 - driftY * 0.5}px, rgba(${mood},0.16), transparent 65%),
            linear-gradient(180deg, ${C.bg1} 0%, ${C.bg0} 70%)`,
        }}
      />
      {/* dot grid */}
      <AbsoluteFill
        style={{
          backgroundImage: "radial-gradient(rgba(150,190,255,0.10) 1.4px, transparent 1.6px)",
          backgroundSize: "44px 44px",
          backgroundPosition: `0px ${(s * 6) % 44}px`,
          maskImage: "radial-gradient(ellipse 70% 55% at 50% 45%, black 20%, transparent 80%)",
        }}
      />
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {DUST.map((d, i) => {
          const y = (((d.y - s * d.v) % H) + H) % H;
          const o = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(s * 2 + d.tw));
          return <circle key={i} cx={d.x + Math.sin(s * 0.5 + d.tw) * 14} cy={y} r={d.r} fill={`rgba(${mood},${o})`} />;
        })}
      </svg>
      {/* vignette */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 70% at 50% 45%, transparent 55%, rgba(0,0,0,0.65) 100%)" }} />
    </AbsoluteFill>
  );
};
