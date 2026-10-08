import React from "react";
import { random } from "remotion";
import { C, FONT, MONO } from "../theme";

/* ---------------------------------------------------------------- Brain */

type Spot = { x: number; y: number; r: number; color: string; k: number };

const inBrain = (x: number, y: number) => {
  const cortex = (x / 300) ** 2 + ((y + 10) / 205) ** 2 < 1 && !(x > 60 && y > 120);
  const cerebellum = ((x - 175) / 95) ** 2 + ((y - 150) / 62) ** 2 < 1;
  return cortex || cerebellum;
};

const NODES = (() => {
  const pts: { x: number; y: number; ph: number }[] = [];
  let i = 0;
  while (pts.length < 150 && i < 5000) {
    const x = (random(`bx${i}`) - 0.5) * 620;
    const y = (random(`by${i}`) - 0.5) * 470;
    if (inBrain(x, y)) pts.push({ x, y, ph: random(`bp${i}`) * 6.28 });
    i++;
  }
  return pts;
})();

const EDGES = (() => {
  const e: [number, number][] = [];
  NODES.forEach((a, i) => {
    const near = NODES.map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2);
    near.forEach((n) => {
      if (n.j > i) e.push([i, n.j]);
    });
  });
  return e;
})();

const BRAIN_OUTLINE =
  "M-280,40 C-320,-60 -260,-190 -120,-212 C-40,-238 80,-236 170,-196 C270,-150 320,-50 300,40 C292,80 270,108 240,112 C262,150 250,206 190,214 C140,220 110,196 100,170 C60,180 20,178 -10,168 C-80,190 -170,170 -220,130 C-258,104 -274,76 -280,40 Z";

export const Brain: React.FC<{ s: number; size?: number; base?: number; spots?: Spot[]; color?: string; outline?: number }> = ({
  s,
  size = 900,
  base = 0.35,
  spots = [],
  color = C.blue,
  outline = 1,
}) => {
  const heat = (x: number, y: number) =>
    spots.reduce(
      (acc, sp) => {
        const d = Math.hypot(x - sp.x, y - sp.y);
        const v = Math.max(0, 1 - d / sp.r) * sp.k;
        return v > acc.v ? { v, c: sp.color } : acc;
      },
      { v: 0, c: color },
    );
  return (
    <svg width={size} height={size * 0.78} viewBox="-340 -265 680 530" style={{ overflow: "visible" }}>
      <defs>
        <filter id="br-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d={BRAIN_OUTLINE} fill="rgba(61,139,255,0.05)" stroke={`rgba(140,190,255,${0.35 * outline})`} strokeWidth="2.5" />
      <path d="M-30,-228 C-60,-150 20,-100 -20,-20 C-50,40 30,80 10,160" fill="none" stroke={`rgba(140,190,255,${0.14 * outline})`} strokeWidth="2" />
      <path d="M-10,168 C0,200 10,236 30,262" fill="none" stroke={`rgba(140,190,255,${0.3 * outline})`} strokeWidth="14" strokeLinecap="round" />
      {EDGES.map(([a, b], i) => {
        const A = NODES[a];
        const B = NODES[b];
        const h = Math.max(heat(A.x, A.y).v, heat(B.x, B.y).v);
        const hc = heat((A.x + B.x) / 2, (A.y + B.y) / 2).c;
        return (
          <line
            key={i}
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            stroke={h > 0.05 ? hc : color}
            strokeOpacity={0.12 * base + 0.75 * h}
            strokeWidth={1.2 + 2 * h}
          />
        );
      })}
      <g filter="url(#br-glow)">
        {NODES.map((n, i) => {
          const h = heat(n.x, n.y);
          const tw = 0.5 + 0.5 * Math.sin(s * 2.4 + n.ph);
          return (
            <circle
              key={i}
              cx={n.x}
              cy={n.y}
              r={2.4 + 4.5 * h.v}
              fill={h.v > 0.05 ? h.c : "#BFD8FF"}
              opacity={base * (0.45 + 0.55 * tw) + h.v}
            />
          );
        })}
      </g>
    </svg>
  );
};

/* ---------------------------------------------------------------- Neuron */

const bez = (p0: number[], p1: number[], p2: number[], p3: number[], t: number) => {
  const u = 1 - t;
  return [0, 1].map((k) => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k]);
};
const AXON = [[-170, 0], [-40, -90], [80, 90], [250, 0]];

export const Neuron: React.FC<{ s: number; pulse?: number; fire?: number; color?: string; glowSoma?: number; width?: number }> = ({
  s,
  pulse = -1,
  fire = 0,
  color = C.cyan,
  glowSoma = 0,
  width = 820,
}) => {
  const pts = new Array(41).fill(0).map((_, i) => bez(AXON[0], AXON[1], AXON[2], AXON[3], i / 40));
  const d = "M" + pts.map((p) => p.join(",")).join(" L");
  const pp = pulse >= 0 && pulse <= 1 ? bez(AXON[0], AXON[1], AXON[2], AXON[3], pulse) : null;
  const dendrites = [
    "M-210,0 L-280,-70 L-320,-80",
    "M-280,-70 L-300,-120",
    "M-215,10 L-300,40 L-330,90",
    "M-300,40 L-345,30",
    "M-200,-20 L-230,-110 L-210,-160",
    "M-205,20 L-240,110",
  ];
  const terminals = ["M250,0 L300,-40 L330,-46", "M250,0 L310,10 L340,30", "M250,0 L290,50 L300,80"];
  return (
    <svg width={width} height={width * 0.5} viewBox="-360 -180 720 360" style={{ overflow: "visible" }}>
      <defs>
        <filter id="nr-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="nr-soma">
          <stop offset="0%" stopColor="#DFF6FF" />
          <stop offset="60%" stopColor={color} />
          <stop offset="100%" stopColor="#1B4C8C" />
        </radialGradient>
      </defs>
      <g stroke={`rgba(160,210,255,${0.55 + 0.45 * fire})`} strokeWidth="5" fill="none" strokeLinecap="round">
        {dendrites.map((p, i) => (
          <path key={i} d={p} />
        ))}
        {terminals.map((p, i) => (
          <path key={i} d={p} />
        ))}
        <path d={d} strokeWidth="8" />
        {/* myelin sheath segments */}
        {[0.2, 0.36, 0.52, 0.68, 0.84].map((t, i) => {
          const a = bez(AXON[0], AXON[1], AXON[2], AXON[3], t - 0.05);
          const b = bez(AXON[0], AXON[1], AXON[2], AXON[3], t + 0.05);
          return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke="rgba(120,170,240,0.5)" strokeWidth="20" />;
        })}
      </g>
      <g filter="url(#nr-glow)">
        <circle cx="-195" cy="0" r={46 + 6 * fire} fill="url(#nr-soma)" opacity={0.75 + 0.25 * Math.max(fire, glowSoma)} />
        <circle cx="-195" cy="0" r="16" fill="white" opacity={0.5 + 0.5 * fire} />
        {pp ? (
          <>
            <circle cx={pp[0]} cy={pp[1]} r="17" fill={color} />
            <circle cx={pp[0]} cy={pp[1]} r="8" fill="white" />
          </>
        ) : null}
        {fire > 0.01
          ? [0, 1, 2].map((i) => {
              const ang = (i / 3) * 6.28 + s * 3;
              return (
                <circle key={i} cx={325 + Math.cos(ang) * 22 * fire} cy={Math.sin(ang) * 22 * fire} r={6 * fire} fill={C.gold} />
              );
            })
          : null}
      </g>
    </svg>
  );
};

/* ---------------------------------------------------------------- Membrane + channel */

export const Membrane: React.FC<{ s: number; open: number; beam: number; flow: number; width?: number }> = ({
  s,
  open,
  beam,
  flow,
  width = 900,
}) => {
  const heads = new Array(30).fill(0).map((_, i) => -435 + i * 30);
  const gap = 20 + 34 * open;
  const ions = new Array(26).fill(0).map((_, i) => {
    const bx = (random(`ix${i}`) - 0.5) * 760;
    const by = -250 + random(`iy${i}`) * 130;
    const delay = random(`id${i}`) * 1.2;
    const k = Math.max(0, Math.min(1, (flow * 2.2 - delay) / 1));
    const toX = (random(`it${i}`) - 0.5) * 70;
    const midX = bx + (toX - bx) * Math.min(1, k * 1.6);
    const y = k < 0.6 ? by + (0 - by) * (k / 0.6) : 0 + (k - 0.6) / 0.4 * (170 + random(`iz${i}`) * 80);
    const x = k < 0.6 ? midX : toX * (1 + (k - 0.6) * 6);
    return { x: x + Math.sin(s * 3 + i) * 4, y: y + Math.cos(s * 2.5 + i) * 4 };
  });
  return (
    <svg width={width} height={width * 0.62} viewBox="-450 -280 900 560" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="mb-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.blue} stopOpacity="0" />
          <stop offset="70%" stopColor={C.blue} stopOpacity="0.8" />
          <stop offset="100%" stopColor="#BFE2FF" stopOpacity="1" />
        </linearGradient>
        <filter id="mb-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <text x="-430" y="-238" fill={C.dim} fontFamily={MONO} fontSize="20" letterSpacing="3">OUTSIDE THE CELL</text>
      <text x="-430" y="262" fill={C.dim} fontFamily={MONO} fontSize="20" letterSpacing="3">INSIDE THE CELL</text>
      <polygon points={`-90,-280 90,-280 ${30 + gap},-40 ${-30 - gap},-40`} fill="url(#mb-beam)" opacity={beam * 0.85} />
      {heads.map((x, i) =>
        Math.abs(x) < 60 ? null : (
          <g key={i}>
            <line x1={x} y1="-36" x2={x - 4} y2="-6" stroke="rgba(255,214,120,0.45)" strokeWidth="3" />
            <line x1={x} y1="36" x2={x + 4} y2="6" stroke="rgba(255,214,120,0.45)" strokeWidth="3" />
            <circle cx={x} cy="-40" r="12" fill="#E9B85C" />
            <circle cx={x} cy="40" r="12" fill="#E9B85C" />
          </g>
        ),
      )}
      <g filter="url(#mb-glow)">
        <rect x={-gap - 40} y="-70" width="40" height="140" rx="18" fill={open > 0.3 ? C.blue : "#3F6FB8"} />
        <rect x={gap} y="-70" width="40" height="140" rx="18" fill={open > 0.3 ? C.blue : "#3F6FB8"} />
      </g>
      <g filter="url(#mb-glow)">
        {ions.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="11" fill={C.gold} />
            <text x={p.x} y={p.y + 6} textAnchor="middle" fontFamily={FONT} fontWeight="800" fontSize="16" fill="#5A3A00">
              +
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

/* ---------------------------------------------------------------- Alga */

export const Alga: React.FC<{ s: number; size?: number; protein?: number }> = ({ s, size = 300, protein = 0 }) => {
  const w = Math.sin(s * 14) * 18;
  return (
    <svg width={size} height={size} viewBox="-150 -150 300 300" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="al-body" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#B8FFB0" />
          <stop offset="55%" stopColor="#3FBF5A" />
          <stop offset="100%" stopColor="#1C6B33" />
        </radialGradient>
        <filter id="al-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path d={`M-20,-70 Q${-60 + w},-120 ${-40 - w},-150`} stroke="#9FE6A8" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d={`M20,-70 Q${60 - w},-120 ${40 + w},-150`} stroke="#9FE6A8" strokeWidth="5" fill="none" strokeLinecap="round" />
      <ellipse cx="0" cy="10" rx="70" ry="88" fill="url(#al-body)" />
      <ellipse cx="0" cy="40" rx="40" ry="38" fill="rgba(20,80,40,0.35)" />
      <ellipse cx="-30" cy="-20" rx="20" ry="14" fill="rgba(255,255,255,0.35)" />
      <g filter="url(#al-glow)">
        <circle cx="46" cy="-10" r={13 + 6 * protein} fill={protein > 0.2 ? C.blue : "#FF4D4D"} />
        <circle cx="46" cy="-10" r={30 * protein} fill="none" stroke={C.cyan} strokeWidth="3" opacity={protein * (0.5 + 0.5 * Math.sin(s * 8))} />
      </g>
    </svg>
  );
};

/* ---------------------------------------------------------------- Eye */

export const Eye: React.FC<{ s: number; size?: number; beam?: number; restore?: number }> = ({ s, size = 520, beam = 0, restore = 0 }) => (
  <svg width={size} height={size * 0.6} viewBox="-260 -156 520 312" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="ey-iris">
        <stop offset="0%" stopColor="#0A1A3A" />
        <stop offset="35%" stopColor="#0A1A3A" />
        <stop offset="40%" stopColor={C.teal} />
        <stop offset="80%" stopColor="#1D5FA8" />
        <stop offset="100%" stopColor="#0B2450" />
      </radialGradient>
      <filter id="ey-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="8" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path d="M-240,0 Q0,-190 240,0 Q0,190 -240,0 Z" fill="#F3F8FF" stroke={C.cyan} strokeWidth="5" />
    <circle cx={Math.sin(s * 0.8) * 14} cy="0" r="92" fill="url(#ey-iris)" />
    <circle cx={Math.sin(s * 0.8) * 14 - 28} cy="-30" r="18" fill="white" opacity="0.85" />
    <g filter="url(#ey-glow)" opacity={beam}>
      <path d="M-240,0 Q0,-190 240,0 Q0,190 -240,0 Z" fill="none" stroke={C.blue} strokeWidth="8" />
    </g>
    <g opacity={restore}>
      {new Array(10).fill(0).map((_, i) => {
        const a = (i / 10) * 6.28 + s;
        return <line key={i} x1={Math.cos(a) * 112} y1={Math.sin(a) * 112} x2={Math.cos(a) * 128} y2={Math.sin(a) * 128} stroke={C.gold} strokeWidth="5" strokeLinecap="round" />;
      })}
    </g>
  </svg>
);

/* ---------------------------------------------------------------- Mouse */

export const Mouse: React.FC<{ size?: number; color?: string; shake?: number; s?: number }> = ({ size = 260, color = "#DCE8F5", shake = 0, s = 0 }) => (
  <svg width={size} height={size * 0.6} viewBox="0 0 260 156" style={{ overflow: "visible", translate: `${Math.sin(s * 60) * 4 * shake}px 0px` }}>
    <path d="M40,120 C20,70 70,30 130,34 C190,38 220,80 214,118 Z" fill={color} />
    <circle cx="212" cy="96" r="30" fill={color} />
    <circle cx="200" cy="58" r="20" fill={color} />
    <circle cx="200" cy="58" r="11" fill="#FFB3C6" />
    <circle cx="226" cy="92" r="5" fill="#0A1A3A" />
    <circle cx="242" cy="104" r="5" fill="#FF8FAB" />
    <path d="M40,116 C0,120 -10,90 10,70" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
    <ellipse cx="90" cy="124" rx="14" ry="6" fill="#B9C9DA" />
    <ellipse cx="170" cy="124" rx="14" ry="6" fill="#B9C9DA" />
  </svg>
);

/* ---------------------------------------------------------------- Firefighter + flame */

export const Helmet: React.FC<{ size?: number }> = ({ size = 240 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 240 192">
    <path d="M30,140 C30,60 80,24 120,24 C160,24 210,60 210,140 Z" fill="#E5484D" />
    <path d="M110,24 h20 v116 h-20 z" fill="#B3262B" />
    <rect x="98" y="60" width="44" height="54" rx="10" fill={C.gold} />
    <path d="M6,140 h228 a10,10 0 0 1 0,20 h-228 a10,10 0 0 1 0,-20 z" fill="#B3262B" />
    <path d="M60,60 C70,44 86,36 100,32" stroke="rgba(255,255,255,0.4)" strokeWidth="8" strokeLinecap="round" fill="none" />
  </svg>
);

export const Flame: React.FC<{ size?: number; s: number }> = ({ size = 220, s }) => {
  const f = Math.sin(s * 9) * 6;
  return (
    <svg width={size} height={size} viewBox="0 0 220 220" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="fl-g" cx="50%" cy="75%" r="70%">
          <stop offset="0%" stopColor="#FFF3B0" />
          <stop offset="45%" stopColor="#FFB547" />
          <stop offset="100%" stopColor="#FF4D2E" />
        </radialGradient>
      </defs>
      <path d={`M110,${10 + f} C150,60 190,90 180,150 C172,196 140,214 110,214 C80,214 44,196 40,150 C34,104 70,90 80,40 C96,70 100,80 110,${10 + f} Z`} fill="url(#fl-g)" />
      <path d={`M110,${110 - f} C130,140 140,160 130,186 C124,200 96,200 90,186 C80,160 96,140 110,${110 - f} Z`} fill="#FFF7D6" />
    </svg>
  );
};

/* ---------------------------------------------------------------- Medal */

export const Medal: React.FC<{ size?: number; s: number }> = ({ size = 420, s }) => (
  <svg width={size} height={size * 1.25} viewBox="-210 -300 420 525" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="md-g" cx="35%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#FFF1C2" />
        <stop offset="45%" stopColor={C.gold} />
        <stop offset="100%" stopColor={C.goldDeep} />
      </radialGradient>
      <linearGradient id="md-sheen" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="white" stopOpacity="0" />
        <stop offset="50%" stopColor="white" stopOpacity="0.55" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <clipPath id="md-clip">
        <circle cx="0" cy="40" r="170" />
      </clipPath>
    </defs>
    <path d="M-110,-300 L-30,-60 L30,-60 L-50,-300 Z" fill="#1F4FA8" />
    <path d="M110,-300 L30,-60 L-30,-60 L50,-300 Z" fill="#2E6FE0" />
    <circle cx="0" cy="40" r="182" fill={C.goldDeep} />
    <circle cx="0" cy="40" r="170" fill="url(#md-g)" />
    <circle cx="0" cy="40" r="140" fill="none" stroke="rgba(120,80,10,0.45)" strokeWidth="3" />
    {new Array(9).fill(0).map((_, i) => (
      <g key={i}>
        <ellipse cx={-118 + i * 6} cy={110 - i * 18} rx="16" ry="7" fill="rgba(120,80,10,0.45)" transform={`rotate(${-50 + i * 8} ${-118 + i * 6} ${110 - i * 18})`} />
        <ellipse cx={118 - i * 6} cy={110 - i * 18} rx="16" ry="7" fill="rgba(120,80,10,0.45)" transform={`rotate(${50 - i * 8} ${118 - i * 6} ${110 - i * 18})`} />
      </g>
    ))}
    <text x="0" y="20" textAnchor="middle" fontFamily={MONO} fontWeight="700" fontSize="26" letterSpacing="6" fill="#6B4A0E">NOBEL PRIZE</text>
    <text x="0" y="96" textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize="76" fill="#5A3C08">2026</text>
    <rect x={-400 + ((s * 260) % 900)} y="-140" width="120" height="360" fill="url(#md-sheen)" transform="rotate(20)" clipPath="url(#md-clip)" />
  </svg>
);

/* ---------------------------------------------------------------- DNA */

export const DNA: React.FC<{ s: number; height?: number; color?: string }> = ({ s, height = 520, color = C.violet }) => {
  const n = 18;
  return (
    <svg width={160} height={height} viewBox={`-80 0 160 ${height}`} style={{ overflow: "visible" }}>
      {new Array(n).fill(0).map((_, i) => {
        const y = (i / (n - 1)) * height;
        const ph = s * 2.4 + i * 0.55;
        const x1 = Math.sin(ph) * 60;
        const x2 = -x1;
        const front = Math.cos(ph) > 0;
        return (
          <g key={i}>
            <line x1={x1} y1={y} x2={x2} y2={y} stroke="rgba(200,190,255,0.35)" strokeWidth="4" />
            <circle cx={x1} cy={y} r={front ? 10 : 7} fill={color} opacity={front ? 1 : 0.55} />
            <circle cx={x2} cy={y} r={front ? 7 : 10} fill={C.cyan} opacity={front ? 0.55 : 1} />
          </g>
        );
      })}
    </svg>
  );
};

/* ---------------------------------------------------------------- Toggle switch */

export const Toggle: React.FC<{ on: number; color?: string; size?: number }> = ({ on, color = C.blue, size = 200 }) => (
  <div
    style={{
      width: size,
      height: size * 0.5,
      borderRadius: 999,
      background: on > 0.5 ? color : "rgba(120,140,170,0.35)",
      boxShadow: on > 0.5 ? `0 0 40px ${color}` : "none",
      position: "relative",
      border: "2px solid rgba(255,255,255,0.15)",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: size * 0.05,
        left: size * 0.05 + on * size * 0.5,
        width: size * 0.4,
        height: size * 0.4,
        borderRadius: 999,
        background: "white",
        boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
      }}
    />
  </div>
);
