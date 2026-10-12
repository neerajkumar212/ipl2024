import React from "react";
import { C } from "../theme";

/* Flat, rounded icon set for Episode 3 (all SVG so cards stay crisp at any size). */

type P = { size?: number; color?: string; style?: React.CSSProperties };

export const Pill: React.FC<P> = ({ size = 120, color = C.cyan, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <g transform="rotate(-35 50 50)">
      <rect x="18" y="36" width="64" height="28" rx="14" fill="#EAF6FF" />
      <path d="M50 36 h18 a14 14 0 0 1 0 28 h-18 z" fill={color} />
      <rect x="24" y="40" width="20" height="5" rx="2.5" fill="rgba(255,255,255,0.8)" />
    </g>
  </svg>
);

export const Scalpel: React.FC<P> = ({ size = 120, color = "#DDE7F2", style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <g transform="rotate(-40 50 50)">
      <rect x="10" y="46" width="46" height="9" rx="4.5" fill="#8FA8C8" />
      <path d="M56 44 C76 40 88 46 92 52 L56 56 Z" fill={color} />
      <rect x="14" y="48" width="30" height="2.5" rx="1.2" fill="rgba(255,255,255,0.5)" />
    </g>
  </svg>
);

export const Band: React.FC<P> = ({ size = 120, color = C.teal, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <rect x="36" y="6" width="28" height="88" rx="12" fill="#2B3E55" />
    <rect x="26" y="30" width="48" height="40" rx="12" fill="#0E1C2E" stroke={color} strokeWidth="3" />
    <polyline points="33,52 42,52 46,43 52,60 56,48 60,52 67,52" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Pen: React.FC<P & { dose?: number }> = ({ size = 360, color = C.cyan, style, dose = 1 }) => (
  <svg width={size} height={size * 0.3} viewBox="0 0 400 120" style={style}>
    <defs>
      <linearGradient id="pen-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F7FBFF" />
        <stop offset="60%" stopColor="#D6E3F0" />
        <stop offset="100%" stopColor="#9FB5CC" />
      </linearGradient>
    </defs>
    <rect x="10" y="40" width="70" height="40" rx="14" fill={color} />
    <rect x="70" y="34" width="250" height="52" rx="22" fill="url(#pen-body)" />
    <rect x="180" y="46" width="70" height="28" rx="8" fill="#0E1C2E" />
    <rect x="186" y="52" width={58 * dose} height="16" rx="4" fill={color} opacity="0.9" />
    <rect x="320" y="44" width="40" height="32" rx="10" fill="#8FA8C8" />
    <rect x="360" y="56" width="26" height="8" rx="3" fill="#C9D6E3" />
    <rect x="90" y="42" width="80" height="6" rx="3" fill="rgba(255,255,255,0.8)" />
  </svg>
);

export const Kid: React.FC<P & { lit?: boolean }> = ({ size = 90, color = C.cyan, lit = true, style }) => (
  <svg width={size} height={size * 1.4} viewBox="0 0 60 84" style={style}>
    <circle cx="30" cy="16" r="12" fill={lit ? color : "rgba(143,168,200,0.28)"} />
    <path d="M12 44 a18 18 0 0 1 36 0 v16 h-8 v20 h-20 v-20 h-8 z" fill={lit ? color : "rgba(143,168,200,0.28)"} />
  </svg>
);

export const Cross: React.FC<{ size: number; k: number }> = ({ size, k }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
    <line x1="14" y1="14" x2="86" y2="86" stroke={C.red} strokeWidth="9" strokeLinecap="round" strokeDasharray="102" strokeDashoffset={102 * (1 - k)} />
    <line x1="86" y1="14" x2="14" y2="86" stroke={C.red} strokeWidth="9" strokeLinecap="round" strokeDasharray="102" strokeDashoffset={102 * (1 - Math.max(0, k * 1.6 - 0.6))} />
  </svg>
);

export const Check: React.FC<{ size: number; k: number; color?: string }> = ({ size, k, color = C.green }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="44" fill="none" stroke={color} strokeWidth="7" opacity={0.35 + 0.65 * k} />
    <polyline points="30,52 45,66 72,36" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="70" strokeDashoffset={70 * (1 - k)} />
  </svg>
);

export const Apple: React.FC<P> = ({ size = 120, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path d="M50 30 C30 18 12 32 16 56 C20 80 38 92 50 84 C62 92 80 80 84 56 C88 32 70 18 50 30 Z" fill="#FF6B6B" />
    <path d="M50 30 C50 20 54 12 60 8" stroke="#7A4A2A" strokeWidth="5" fill="none" strokeLinecap="round" />
    <path d="M56 18 C66 8 80 12 80 12 C76 24 64 26 56 18 Z" fill={C.green} />
    <ellipse cx="32" cy="46" rx="6" ry="10" fill="rgba(255,255,255,0.45)" />
  </svg>
);

export const Shoe: React.FC<P> = ({ size = 120, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path d="M10 64 C10 50 16 34 26 34 C34 34 36 44 46 46 C60 50 82 52 88 62 C92 70 88 76 80 76 H18 C12 76 10 70 10 64 Z" fill={C.cyan} />
    <rect x="10" y="72" width="80" height="8" rx="4" fill="#EAF6FF" />
    <line x1="34" y1="44" x2="42" y2="38" stroke="#0E1C2E" strokeWidth="3" strokeLinecap="round" />
    <line x1="42" y1="48" x2="50" y2="42" stroke="#0E1C2E" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const Brain: React.FC<P> = ({ size = 120, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path d="M50 18 C40 10 22 14 20 30 C8 34 8 54 18 60 C16 76 34 86 46 78 L50 80 L54 78 C66 86 84 76 82 60 C92 54 92 34 80 30 C78 14 60 10 50 18 Z" fill={C.violet} />
    <path d="M50 20 V78 M34 34 C40 38 40 46 34 50 M66 34 C60 38 60 46 66 50 M30 62 C36 60 42 64 42 70 M70 62 C64 60 58 64 58 70" stroke="rgba(255,255,255,0.55)" strokeWidth="3.5" fill="none" strokeLinecap="round" />
  </svg>
);

export const Family: React.FC<P> = ({ size = 120, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <circle cx="28" cy="26" r="10" fill={C.gold} />
    <path d="M14 70 V50 a14 14 0 0 1 28 0 V70 z" fill={C.gold} />
    <circle cx="72" cy="26" r="10" fill={C.gold} />
    <path d="M58 70 V50 a14 14 0 0 1 28 0 V70 z" fill={C.gold} />
    <circle cx="50" cy="48" r="8" fill={C.amber} />
    <path d="M39 86 V70 a11 11 0 0 1 22 0 V86 z" fill={C.amber} />
  </svg>
);

export const Drop: React.FC<P> = ({ size = 120, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path d="M50 10 C62 30 78 46 78 62 a28 28 0 0 1 -56 0 C22 46 38 30 50 10 Z" fill={C.blue} />
    <ellipse cx="40" cy="60" rx="6" ry="11" fill="rgba(255,255,255,0.45)" />
  </svg>
);

export const Wave: React.FC<P> = ({ size = 120, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <circle cx="50" cy="50" r="38" fill={C.green} opacity="0.25" />
    <path d="M22 44 C30 36 38 52 46 44 C54 36 62 52 70 44 C74 40 78 42 80 44" stroke={C.green} strokeWidth="6" fill="none" strokeLinecap="round" />
    <path d="M22 60 C30 52 38 68 46 60 C54 52 62 68 70 60 C74 56 78 58 80 60" stroke={C.green} strokeWidth="6" fill="none" strokeLinecap="round" />
  </svg>
);

export const Plate: React.FC<P> = ({ size = 120, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <circle cx="50" cy="50" r="40" fill="#EAF6FF" />
    <circle cx="50" cy="50" r="30" fill="#D4E2EF" />
    <path d="M50 50 L50 20 A30 30 0 0 1 76 64 Z" fill={C.green} />
    <path d="M50 50 L76 64 A30 30 0 0 1 24 64 Z" fill={C.amber} />
    <path d="M50 50 L24 64 A30 30 0 0 1 50 20 Z" fill="#FF6B6B" />
  </svg>
);

export const Comment: React.FC<P> = ({ size = 120, color = "#FFFFFF", style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path d="M50 14 C26 14 10 28 10 46 C10 56 15 64 24 70 L20 88 L40 76 C43 77 47 78 50 78 C74 78 90 64 90 46 C90 28 74 14 50 14 Z" fill="none" stroke={color} strokeWidth="7" strokeLinejoin="round" />
  </svg>
);

export const Bookmark: React.FC<P> = ({ size = 120, color = "#FFFFFF", style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path d="M26 12 H74 V88 L50 70 L26 88 Z" fill="none" stroke={color} strokeWidth="7" strokeLinejoin="round" />
  </svg>
);
