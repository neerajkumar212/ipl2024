import React from "react";
import { Video } from "@remotion/media";
import { Sequence, staticFile, useCurrentFrame } from "remotion";
import { clampInterp, EXPO, useSec } from "../lib/anim";
import { C, FONT, MONO } from "../theme";

/* Episode 4 (premium) art: clip frames for the user's library footage, and new "3D-style" SVG renders. */

/** One of the user's library clips in a glossy, slightly tilted glass frame. Starts playing at `at` (global seconds). */
export const ClipFrame: React.FC<{
  file: string;
  at: number;
  slot: number;
  dur: number;
  w?: number;
  tilt?: number;
  offset?: number;
  label?: string;
  labelAt?: number;
  labelColor?: string;
}> = ({ file, at, slot, dur, w = 900, tilt = 0, offset = 0, label, labelAt = 0, labelColor = C.cyan }) => {
  const s = useSec();
  const frame = useCurrentFrame();
  const h = w * 0.72;
  const k = clampInterp(s, [at - 0.05, at + 0.7], [0, 1], EXPO);
  const rate = Math.max(0.55, Math.min(1, (dur - offset) / Math.max(0.1, slot)));
  const drift = Math.sin(frame / 70) * 2.2;
  const lk = clampInterp(s, [labelAt, labelAt + 0.35], [0, 1], EXPO);
  return (
    <div style={{ perspective: 1600 }}>
      <div
        style={{
          position: "relative",
          width: w,
          height: h,
          borderRadius: 42,
          overflow: "hidden",
          border: "2px solid rgba(140,215,255,0.35)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.6), 0 0 60px rgba(31,200,214,0.18), inset 0 1px 0 rgba(255,255,255,0.15)",
          transform: `rotateY(${tilt * (1 - k) * 2 + drift * Math.sign(tilt || 1) * 0.5}deg) rotateX(${(1 - k) * 12}deg)`,
          scale: String(0.82 + 0.18 * k),
          opacity: k,
          background: "#02060F",
        }}
      >
        <Sequence from={Math.round(at * 30)} layout="none">
          <Video src={staticFile(`ep4/${file}.mp4`)} muted loop playbackRate={rate} trimBefore={Math.round(offset * 30)} objectFit="cover" style={{ width: "100%", height: "100%", scale: String(1.03 + 0.03 * Math.sin(frame / 80)) }} />
        </Sequence>
        {/* glass sheen + vignette */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg, rgba(255,255,255,0.10) 0%, transparent 28%, transparent 70%, rgba(0,0,0,0.35) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, boxShadow: "inset 0 0 120px rgba(0,0,0,0.45)" }} />
        {label ? (
          <div style={{ position: "absolute", left: 26, bottom: 26, opacity: lk, scale: String(0.7 + 0.3 * lk), transformOrigin: "0% 100%" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#04121C", background: labelColor, padding: "10px 24px", borderRadius: 16, boxShadow: `0 0 30px ${labelColor}88` }}>{label}</div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

/** A fetus curled in the womb, lit like a soft 3D render. Not a copy of the reference animation: our own stylised design. */
export const Womb3D: React.FC<{ size?: number; heart?: number; tumor?: number; glow?: number; grow?: number }> = ({ size = 760, heart = 1, tumor = 0, glow = 0, grow = 1 }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * 2.2)), 8);
  const float = Math.sin(t * 0.9) * 6;
  const rot = Math.sin(t * 0.5) * 3;
  return (
    <svg width={size} height={size} viewBox="0 0 400 400" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="w6-sac" cx="42%" cy="38%" r="65%">
          <stop offset="0%" stopColor="#FFD7CF" />
          <stop offset="45%" stopColor="#E98C8C" />
          <stop offset="85%" stopColor="#8E2F45" />
          <stop offset="100%" stopColor="#4A1024" />
        </radialGradient>
        <radialGradient id="w6-fluid" cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="rgba(255,236,226,0.95)" />
          <stop offset="70%" stopColor="rgba(250,190,180,0.55)" />
          <stop offset="100%" stopColor="rgba(200,110,120,0.2)" />
        </radialGradient>
        <radialGradient id="w6-skin" cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFF1E8" />
          <stop offset="55%" stopColor="#F2C7B3" />
          <stop offset="100%" stopColor="#C98B78" />
        </radialGradient>
        <radialGradient id="w6-heart" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FF9A9A" />
          <stop offset="60%" stopColor="#E0283C" />
          <stop offset="100%" stopColor="#7A0A1C" />
        </radialGradient>
        <radialGradient id="w6-tumor" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#E8D9F2" />
          <stop offset="60%" stopColor="#9C7BB8" />
          <stop offset="100%" stopColor="#4C3266" />
        </radialGradient>
        <radialGradient id="w6-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(91,231,255,0.55)" />
          <stop offset="100%" stopColor="rgba(91,231,255,0)" />
        </radialGradient>
        <filter id="w6-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.2" />
        </filter>
      </defs>
      <circle cx="200" cy="200" r="210" fill="url(#w6-glow)" opacity={glow} />
      <g transform={`translate(0 ${float}) rotate(${rot} 200 200)`}>
        {/* uterus wall + amniotic sac */}
        <ellipse cx="200" cy="205" rx="168" ry="176" fill="url(#w6-sac)" />
        <ellipse cx="200" cy="205" rx="146" ry="154" fill="url(#w6-fluid)" />
        {/* umbilical cord */}
        <path d="M222 238 C262 270 300 250 318 205" stroke="#E7A9B4" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M222 238 C262 270 300 250 318 205" stroke="rgba(255,255,255,0.35)" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* fetus (curled), scaled by growth */}
        <g transform={`translate(200 210) scale(${0.78 + 0.22 * grow}) translate(-200 -210)`}>
          <path d="M150 230 C130 180 150 130 200 125 C250 122 275 165 262 215 C252 255 222 280 190 276 C168 272 156 254 150 230 Z" fill="url(#w6-skin)" />
          <circle cx="188" cy="112" r="50" fill="url(#w6-skin)" />
          <ellipse cx="172" cy="100" rx="16" ry="11" fill="rgba(255,255,255,0.45)" filter="url(#w6-soft)" />
          {/* closed eye + ear */}
          <path d="M160 116 Q168 121 176 116" stroke="#A0645A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <ellipse cx="208" cy="114" rx="8" ry="11" fill="#E3A994" />
          {/* arm + knees */}
          <path d="M176 172 C160 192 162 214 186 220" stroke="#E9B39F" strokeWidth="17" fill="none" strokeLinecap="round" />
          <ellipse cx="236" cy="246" rx="34" ry="24" fill="url(#w6-skin)" transform="rotate(-20 236 246)" />
          <path d="M214 266 C206 286 186 292 170 286" stroke="#E9B39F" strokeWidth="15" fill="none" strokeLinecap="round" />
          {/* heart (visible through the chest) + tumor */}
          <g opacity={heart} transform={`translate(212 190) scale(${1 + 0.12 * beat}) translate(-212 -190)`}>
            <path d="M212 206 C196 196 190 188 190 180 C190 172 196 168 202 168 C206 168 210 171 212 174 C214 171 218 168 222 168 C228 168 234 172 234 180 C234 188 228 196 212 206 Z" fill="url(#w6-heart)" />
          </g>
          {tumor > 0.01 ? (
            <g transform={`translate(236 176) scale(${tumor * (1 + 0.04 * beat)}) translate(-236 -176)`}>
              <circle cx="236" cy="176" r="17" fill="url(#w6-tumor)" />
              <circle cx="246" cy="186" r="9" fill="url(#w6-tumor)" />
              <ellipse cx="231" cy="170" rx="5" ry="3" fill="rgba(255,255,255,0.5)" />
            </g>
          ) : null}
        </g>
        {/* rim light */}
        <ellipse cx="200" cy="205" rx="166" ry="174" fill="none" stroke="rgba(255,220,220,0.35)" strokeWidth="3" />
      </g>
    </svg>
  );
};

/** A beating heart rendered with soft 3D shading, with an optional mass pressing on it. */
export const Heart3D: React.FC<{ size?: number; tumor?: number; weak?: number }> = ({ size = 560, tumor = 1, weak = 0 }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const rate = 1.7 - 0.6 * weak;
  const beat = Math.pow(Math.max(0, Math.sin(t * Math.PI * 2 * rate)), 6) * (1 - 0.5 * weak);
  return (
    <svg width={size} height={size} viewBox="0 0 300 300" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="h6-body" cx="38%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFB3B3" />
          <stop offset="45%" stopColor="#E3364A" />
          <stop offset="100%" stopColor="#5E0716" />
        </radialGradient>
        <radialGradient id="h6-mass" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#F1E6FA" />
          <stop offset="55%" stopColor="#A486C4" />
          <stop offset="100%" stopColor="#3F2958" />
        </radialGradient>
        <radialGradient id="h6-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,90,95,0.45)" />
          <stop offset="100%" stopColor="rgba(255,90,95,0)" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="150" r="150" fill="url(#h6-halo)" opacity={0.5 + 0.5 * beat} />
      <g transform={`translate(140 160) scale(${1 + 0.08 * beat}) translate(-140 -160)`}>
        {/* vessels */}
        <path d="M120 80 C118 50 130 34 150 30" stroke="#B3243A" strokeWidth="18" fill="none" strokeLinecap="round" />
        <path d="M160 82 C166 56 184 46 204 50" stroke="#3D6BD6" strokeWidth="15" fill="none" strokeLinecap="round" />
        <path d="M140 250 C96 222 62 190 62 146 C62 112 86 90 112 90 C126 90 136 98 142 108 C148 98 160 90 174 90 C202 90 222 114 220 148 C218 190 184 222 140 250 Z" fill="url(#h6-body)" />
        <path d="M142 112 C134 150 136 196 142 236" stroke="rgba(90,10,25,0.45)" strokeWidth="4" fill="none" />
        <ellipse cx="96" cy="124" rx="18" ry="11" fill="rgba(255,255,255,0.35)" transform="rotate(-30 96 124)" />
      </g>
      {tumor > 0.01 ? (
        <g transform={`translate(222 130) scale(${tumor}) translate(-222 -130)`}>
          <circle cx="222" cy="130" r="44" fill="url(#h6-mass)" />
          <circle cx="252" cy="164" r="24" fill="url(#h6-mass)" />
          <circle cx="200" cy="96" r="18" fill="url(#h6-mass)" />
          <ellipse cx="208" cy="114" rx="12" ry="7" fill="rgba(255,255,255,0.45)" />
        </g>
      ) : null}
    </svg>
  );
};

/** ECG trace that flattens as `weak` rises. */
export const Ecg: React.FC<{ width?: number; weak?: number; color?: string }> = ({ width = 900, weak = 0, color = C.red }) => {
  const frame = useCurrentFrame();
  const pts: string[] = [];
  for (let x = 0; x <= width; x += 6) {
    const ph = ((x + frame * 9) % 300) / 300;
    let y = 0;
    if (ph > 0.42 && ph < 0.46) y = -18;
    else if (ph > 0.46 && ph < 0.5) y = 90 * (1 - weak);
    else if (ph > 0.5 && ph < 0.54) y = -120 * (1 - 0.8 * weak);
    else if (ph > 0.54 && ph < 0.58) y = 30;
    pts.push(`${x},${100 - y * 0.5}`);
  }
  return (
    <svg width={width} height={200} style={{ overflow: "visible" }}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="6" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
    </svg>
  );
};

export const Eyebrow: React.FC<{ children: React.ReactNode; color?: string; k?: number }> = ({ children, color = C.teal, k = 1 }) => (
  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 8, color, opacity: k }}>{children}</div>
);
