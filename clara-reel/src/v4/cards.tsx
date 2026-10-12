import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { clampInterp, EXPO, ramp, usePop, useSec } from "../lib/anim";
import { C, FONT, MONO, SERIF } from "../theme";
import { Apple, Band, Bookmark, Brain, Check, Comment, Cross, Drop, Family, Kid, Pen, Pill, Plate, Scalpel, Shoe, Wave } from "./art4";
import { seg, w } from "./timing";

/* B-roll "media cards" for Episode 3. Each card fills the rounded panel under Clara. */

export const CARD = { x: 60, y: 1040, w: 960, h: 620 };

const Tag: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = C.teal }) => (
  <div style={{ position: "absolute", left: 40, top: 34, display: "flex", alignItems: "center", gap: 12 }}>
    <div style={{ width: 12, height: 12, borderRadius: 6, background: color, boxShadow: `0 0 12px ${color}` }} />
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 4, color }}>{children}</div>
  </div>
);

const Src: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, textAlign: "center", fontFamily: MONO, fontSize: 19, letterSpacing: 1, color: "rgba(190,210,230,0.75)" }}>
    {children}
  </div>
);

const Big: React.FC<{ children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties }> = ({ children, size = 120, color = "white", style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, lineHeight: 1, letterSpacing: -3, color, ...style }}>{children}</div>
);

const Row: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>{children}</div>
);

const pop = (k: number) => ({ scale: String(0.6 + 0.4 * k), opacity: Math.min(1, k * 1.4) });

/* ---------------------------------------------------------------- cards */

export const CPen: React.FC = () => {
  const s = useSec();
  const k = 0.35 + 0.65 * ramp(s, 0, 1.6);
  const q = usePop(w("hook", "injection?") - 0.1);
  return (
    <>
      <Tag color={C.cyan}>GLP-1 · WEIGHT-LOSS PEN</Tag>
      <Row>
        <div style={{ translate: `${(1 - k) * 120}px 0px`, rotate: `${-8 + 4 * k}deg` }}>
          <Pen size={720} dose={k} />
        </div>
      </Row>
      <div style={{ position: "absolute", right: 60, top: 70, ...pop(q) }}>
        <Big size={150} color={C.amber}>?</Big>
      </div>
      <Row style={{ alignItems: "flex-end", paddingBottom: 70 }}>
        <div style={{ display: "flex", gap: 18, alignItems: "flex-end", opacity: 0.5 + 0.5 * ramp(s, 0.6, 1.4) }}>
          <Kid size={70} color={C.dim} />
          <Kid size={56} color={C.dim} />
          <Kid size={84} color={C.dim} />
        </div>
      </Row>
    </>
  );
};

const HEADLINES: [string, string][] = [
  ["Forbes · 7 Oct", "WHO issues first global guidelines for treating childhood obesity"],
  ["Becker's · 7 Oct", "WHO issues 1st youth obesity guidelines, addresses weight-loss drugs"],
  ["UN News · Oct", "WHO releases first global guidelines on child obesity as cases surge"],
];

export const CHeadlines: React.FC = () => {
  const s = useSec();
  const t0 = seg("answer").start;
  return (
    <>
      <Tag color={C.gold}>IN THE NEWS THIS WEEK</Tag>
      <div style={{ position: "absolute", left: 40, right: 40, top: 100, display: "flex", flexDirection: "column", gap: 22 }}>
        {HEADLINES.map(([src, h], i) => {
          const k = ramp(s, t0 + 0.15 + i * 0.55, t0 + 0.75 + i * 0.55);
          return (
            <div
              key={i}
              style={{
                opacity: k,
                translate: `${(1 - k) * 90}px 0px`,
                background: "linear-gradient(180deg, #F4F7FB, #DCE5EF)",
                borderRadius: 22,
                padding: "20px 26px",
                boxShadow: "0 14px 30px rgba(0,0,0,0.45)",
                borderLeft: `8px solid ${[C.red, C.teal, C.blue][i]}`,
              }}
            >
              <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 19, letterSpacing: 2, color: "#5A6B80" }}>{src.toUpperCase()}</div>
              <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 700, fontSize: 36, lineHeight: 1.15, color: "#0B1626", marginTop: 6 }}>{h}</div>
            </div>
          );
        })}
      </div>
      <Src>Headlines as published, 7–8 Oct 2026</Src>
    </>
  );
};

export const CGuideline: React.FC = () => {
  const s = useSec();
  const t0 = seg("date").start;
  const k = ramp(s, t0, t0 + 0.8);
  const d = usePop(w("date", "7,"));
  const f = usePop(w("date", "first"));
  return (
    <>
      <Tag>WORLD HEALTH ORGANIZATION</Tag>
      <Row>
        <div
          style={{
            width: 420,
            height: 470,
            marginTop: 30,
            borderRadius: 18,
            background: "linear-gradient(180deg, #FFFFFF, #E2EBF4)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.55)",
            rotate: `${-6 + 6 * k}deg`,
            translate: `0px ${(1 - k) * 160}px`,
            padding: 34,
            boxSizing: "border-box",
          }}
        >
          <div style={{ height: 10, width: 110, borderRadius: 5, background: C.blue }} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, lineHeight: 1.08, color: "#0B1626", marginTop: 22 }}>Guideline on obesity in children & adolescents</div>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 10, width: `${92 - i * 9}%`, borderRadius: 5, background: "#C3D0DD", marginTop: i === 0 ? 30 : 16 }} />
          ))}
        </div>
        <div style={{ position: "absolute", right: 70, top: 120, ...pop(d), rotate: "8deg" }}>
          <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 34, color: "#0B1626", background: C.gold, padding: "12px 20px", borderRadius: 14 }}>7 OCT 2026</div>
        </div>
        <div style={{ position: "absolute", left: 60, bottom: 110, ...pop(f), rotate: "-6deg" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "white", background: C.red, padding: "10px 22px", borderRadius: 14 }}>FIRST EVER</div>
        </div>
      </Row>
    </>
  );
};

export const CScale: React.FC = () => {
  const s = useSec();
  const t0 = w("scale", "170");
  const n = Math.round(170 * clampInterp(s, [t0 - 0.2, t0 + 1.3], [0, 1], EXPO));
  const b = ramp(s, w("scale", "adolescents"), w("scale", "adolescents") + 0.6);
  return (
    <>
      <Tag>CHILDREN & TEENS WITH OBESITY · 2024</Tag>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center" }}>
        <Big size={190} color="white">
          {n}
          <span style={{ fontSize: 90, color: C.cyan }}> million</span>
        </Big>
      </div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 340, display: "flex", gap: 24, opacity: b }}>
        {[
          ["70M", "ages 5–9", C.cyan],
          ["100M", "ages 10–19", C.violet],
        ].map(([v, l, c], i) => (
          <div key={i} style={{ flex: i === 0 ? 7 : 10, borderRadius: 22, background: `${c}22`, border: `2px solid ${c}`, padding: "22px 26px", translate: `0px ${(1 - b) * 40}px` }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: c }}>{v}</div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, color: C.ink }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 300, height: 8, opacity: 1 - b }}>
        <div style={{ height: 8, borderRadius: 4, width: `${(n / 170) * 100}%`, background: C.cyan, boxShadow: `0 0 18px ${C.cyan}` }} />
      </div>
      <Src>WHO data via Forbes & fundsforNGOs, Oct 2026</Src>
    </>
  );
};

export const CTrend: React.FC = () => {
  const s = useSec();
  const t0 = w("trend", "1990,");
  const k = ramp(s, t0, w("trend", "8") + 0.3);
  const q = usePop(w("trend", "quadrupled,"));
  const X0 = 110;
  const X1 = 850;
  const Y = (p: number) => 520 - (p / 9) * 380;
  const x = X0 + (X1 - X0) * k;
  const y = Y(2 + 6 * Math.pow(k, 1.6));
  const pts = Array.from({ length: 40 }, (_, i) => {
    const t = (i / 39) * k;
    return `${X0 + (X1 - X0) * t},${Y(2 + 6 * Math.pow(t, 1.6))}`;
  }).join(" ");
  return (
    <>
      <Tag>SHARE OF 5–19 YEAR OLDS WITH OBESITY</Tag>
      <svg width={CARD.w} height={CARD.h} style={{ position: "absolute", inset: 0 }}>
        {[2, 4, 6, 8].map((p) => (
          <g key={p}>
            <line x1={X0} x2={X1} y1={Y(p)} y2={Y(p)} stroke="rgba(143,168,200,0.18)" strokeWidth="2" />
            <text x={X0 - 18} y={Y(p) + 9} textAnchor="end" fill={C.dim} fontFamily="JetBrains Mono" fontSize="24">
              {p}%
            </text>
          </g>
        ))}
        <polyline points={pts} fill="none" stroke={C.amber} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={X0} cy={Y(2)} r="12" fill={C.amber} />
        <circle cx={x} cy={y} r={14} fill={C.amber} stroke="white" strokeWidth="4" />
        <text x={X0} y={Y(0) + 34} fill={C.ink} fontFamily="Outfit" fontWeight="700" fontSize="32" textAnchor="middle">
          1990
        </text>
        <text x={X1} y={Y(0) + 34} fill={C.ink} fontFamily="Outfit" fontWeight="700" fontSize="32" textAnchor="middle" opacity={k}>
          2024
        </text>
      </svg>
      <div style={{ position: "absolute", left: 150, top: 110, ...pop(q) }}>
        <Big size={150} color={C.amber}>
          4×
        </Big>
      </div>
      <Src>~2% (1990) → ~8% (2024) · WHO, Oct 2026</Src>
    </>
  );
};

const Gate: React.FC<{ icon: React.ReactNode; label: string; at: number; show: number }> = ({ icon, label, at, show }) => {
  const s = useSec();
  const p = usePop(show);
  const x = ramp(s, at, at + 0.35);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, ...pop(p) }}>
      <div style={{ position: "relative", width: 190, height: 190, borderRadius: 40, background: "rgba(255,90,95,0.12)", border: `3px solid rgba(255,90,95,${0.3 + 0.6 * x})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
        <div style={{ position: "absolute", inset: 18 }}>
          <Cross size={154} k={x} />
        </div>
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 32, color: C.ink }}>{label}</div>
    </div>
  );
};

export const CUnder10: React.FC = () => (
  <>
    <Tag color={C.red}>AGES 0–9 · NOT RECOMMENDED</Tag>
    <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center" }}>
      <Big size={110} color={C.red}>
        UNDER 10
      </Big>
    </div>
    <Row style={{ top: 120, gap: 34 }}>
      <Gate show={seg("under10").start - 0.05 + 0 * 0.18} at={w("under10", "medicines.")} label="Medicines" icon={<Pill size={130} />} />
      <Gate show={seg("under10").start - 0.05 + 1 * 0.18} at={w("under10", "surgery,")} label="Surgery" icon={<Scalpel size={130} />} />
      <Gate show={seg("under10").start - 0.05 + 2 * 0.18} at={w("under10", "devices.")} label="Devices" icon={<Band size={130} />} />
    </Row>
    <Src>WHO child & adolescent obesity guideline, 2026</Src>
  </>
);

export const CTeens: React.FC = () => {
  const s = useSec();
  const a = usePop(seg("teens").start);
  const meds = ramp(s, w("teens", "GLP-1"), w("teens", "GLP-1") + 0.5);
  const only = usePop(w("only", "only"));
  const life = ramp(s, w("only", "supervised"), w("only", "supervised") + 0.5);
  const fail = ramp(s, w("only", "hasn't"), w("only", "worked.") + 0.2);
  return (
    <>
      <Tag color={C.amber}>AGES 10–19 · MAY BE CONSIDERED</Tag>
      <div style={{ position: "absolute", left: 0, right: 0, top: 92, textAlign: "center", ...pop(a) }}>
        <Big size={110} color={C.amber}>
          10 – 19
        </Big>
      </div>
      <div style={{ position: "absolute", left: 50, right: 50, top: 250, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ flex: 1, height: 230, borderRadius: 28, background: `rgba(83,227,166,${0.08 + 0.1 * life})`, border: `3px solid ${C.green}`, opacity: 0.35 + 0.65 * life, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <Apple size={74} />
            <Shoe size={74} />
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.ink, textAlign: "center" }}>1. Supervised lifestyle programme</div>
          <div style={{ fontFamily: MONO, fontSize: 22, color: C.amber, opacity: fail }}>not enough? ↓</div>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: C.amber, opacity: Math.max(meds, fail) }}>→</div>
        <div style={{ flex: 1, height: 230, borderRadius: 28, background: "rgba(255,181,71,0.1)", border: `3px solid ${C.amber}`, opacity: 0.3 + 0.7 * meds, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <Pen size={300} dose={0.6} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: C.ink, textAlign: "center" }}>2. Then: approved medicines</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 510, display: "flex", justifyContent: "center", ...pop(only) }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#0B1626", background: C.amber, padding: "8px 26px", borderRadius: 999 }}>ONLY AFTER LIFESTYLE CARE</div>
      </div>
    </>
  );
};

export const CSurgery: React.FC = () => {
  const s = useSec();
  const p = usePop(seg("surgery").start);
  const a = ramp(s, w("surgery", "severe"), w("surgery", "severe") + 0.4);
  const b = ramp(s, w("surgery", "strict"), w("surgery", "strict") + 0.4);
  return (
    <>
      <Tag color={C.violet}>BARIATRIC SURGERY · AGES 10–19</Tag>
      <Row style={{ top: -40 }}>
        <div style={{ ...pop(p), width: 230, height: 230, borderRadius: 999, background: "rgba(139,123,255,0.15)", border: `3px solid ${C.violet}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Scalpel size={170} />
        </div>
      </Row>
      <div style={{ position: "absolute", left: 60, right: 60, top: 400, display: "flex", gap: 20 }}>
        {[
          ["Severe obesity only", a],
          ["Strict conditions", b],
        ].map(([t, k], i) => (
          <div key={i} style={{ flex: 1, opacity: k as number, translate: `0px ${(1 - (k as number)) * 30}px`, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.ink, padding: "18px 10px", borderRadius: 20, background: "rgba(139,123,255,0.14)", border: `2px solid ${C.violet}` }}>
            {t as string}
          </div>
        ))}
      </div>
    </>
  );
};

export const CYounger: React.FC = () => {
  const s = useSec();
  const t0 = w("why", "moving");
  const k = ramp(s, t0 - 0.2, t0 + 1.6);
  const ages = [18, 15, 12, 9, 6];
  return (
    <>
      <Tag color={C.amber}>GLP-1 USE IS MOVING YOUNGER</Tag>
      <div style={{ position: "absolute", left: 60, right: 60, top: 150, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        {ages.map((a, i) => {
          const on = k * ages.length > i;
          return (
            <div key={a} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, opacity: on ? 1 : 0.25 }}>
              <Kid size={130 - i * 16} color={on ? C.amber : C.dim} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: on ? C.ink : C.dim }}>{a}</div>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 470, height: 8, borderRadius: 4, background: "rgba(143,168,200,0.2)" }}>
        <div style={{ width: `${k * 100}%`, height: 8, borderRadius: 4, background: C.amber }} />
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 490, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 22, color: C.dim }}>
        <span>OLDER</span>
        <span>YOUNGER →</span>
      </div>
      <Src>Illustrative: trials now include children under 12</Src>
    </>
  );
};

export const CTrial: React.FC = () => {
  const s = useSec();
  const t2 = w("trial", "2");
  const big = usePop(t2);
  return (
    <>
      <Tag color={C.cyan}>WEGOVY TRIAL · CHILDREN UNDER 12</Tag>
      <div style={{ position: "absolute", left: 0, right: 0, top: 96, textAlign: "center", ...pop(big) }}>
        <Big size={150} color={C.cyan}>
          2 <span style={{ color: "white", fontSize: 90 }}>in</span> 5
        </Big>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 290, display: "flex", justifyContent: "center", gap: 34 }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const lit = i < 2 && s > t2 + 0.3 + i * 0.25;
          const k = ramp(s, seg("trial").start + 0.2 + i * 0.12, seg("trial").start + 0.6 + i * 0.12);
          return (
            <div key={i} style={{ opacity: k, filter: lit ? `drop-shadow(0 0 18px ${C.cyan})` : undefined }}>
              <Kid size={110} lit={lit} color={C.cyan} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 480, textAlign: "center", fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.ink, opacity: ramp(s, w("trial", "longer"), w("trial", "longer") + 0.4) }}>
        no longer classified as having obesity
      </div>
      <Src>Novo Nordisk trial data, Sept 2026 · via Becker's</Src>
    </>
  );
};

export const CRuler: React.FC = () => {
  const s = useSec();
  const t0 = seg("caveat").start;
  const k = ramp(s, t0, t0 + 2.2);
  const q = usePop(w("caveat", "long-term"));
  return (
    <>
      <Tag color={C.amber}>WHAT WE STILL NEED</Tag>
      <div style={{ position: "absolute", left: 140, top: 90, width: 90, height: 480, borderRadius: 14, background: "linear-gradient(90deg, #F4C76A, #B8862F)" }}>
        {Array.from({ length: 13 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: 0, top: 18 + i * 36, width: i % 2 ? 26 : 46, height: 4, background: "#3A2A10" }} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 270, bottom: 70, display: "flex", alignItems: "flex-end" }}>
        <div style={{ transformOrigin: "bottom center", scale: String(0.55 + 0.45 * k) }}>
          <Kid size={220} color={C.cyan} />
        </div>
      </div>
      <div style={{ position: "absolute", right: 70, top: 150, textAlign: "center", ...pop(q) }}>
        <Big size={200} color={C.amber}>
          ?
        </Big>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.ink, marginTop: 10 }}>Long-term data</div>
        <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 30, color: C.dim }}>in growing bodies</div>
      </div>
    </>
  );
};

export const CQuote: React.FC = () => {
  const s = useSec();
  const t0 = seg("found").start;
  const k = ramp(s, t0, t0 + 0.8);
  const n = ramp(s, w("found", "not"), w("found", "surgery.") + 0.3);
  return (
    <>
      <Tag>WHO · DEPT OF NUTRITION & FOOD SAFETY</Tag>
      <div style={{ position: "absolute", left: 60, right: 60, top: 110 }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 150, lineHeight: 0.6, color: C.teal, opacity: k }}>“</div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 52, lineHeight: 1.18, color: "white", opacity: k, translate: `0px ${(1 - k) * 30}px` }}>
          The foundation of obesity care for children and adolescents is <span style={{ color: C.amber, opacity: 0.4 + 0.6 * n }}>not medicine or surgery.</span>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 28, color: C.dim, marginTop: 28, opacity: n }}>Dr Luz María De Regil, WHO</div>
      </div>
      <Src>Quoted in Forbes, 7 Oct 2026</Src>
    </>
  );
};

export const CPillars: React.FC = () => {
  const items: [React.ReactNode, string, string][] = [
    [<Plate key="p" size={110} />, "Healthy food", "healthy"],
    [<Shoe key="s" size={110} />, "Activity", "activity,"],
    [<Wave key="w" size={110} />, "Behavior change", "behavior"],
    [<Brain key="b" size={110} />, "Mental health", "mental"],
  ];
  const fam = usePop(w("pillars", "family."));
  return (
    <>
      <Tag color={C.green}>THE FOUNDATION OF CARE</Tag>
      <div style={{ position: "absolute", left: 50, right: 50, top: 92, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {items.map(([icon, label, word], i) => (
          <PillarTile key={i} at={w("pillars", word)} icon={icon} label={label} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, display: "flex", justifyContent: "center", alignItems: "center", gap: 14, ...pop(fam) }}>
        <Family size={70} />
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.gold }}>for the whole family</div>
      </div>
    </>
  );
};

const PillarTile: React.FC<{ at: number; icon: React.ReactNode; label: string }> = ({ at, icon, label }) => {
  const p = usePop(at - 0.08);
  return (
    <div style={{ height: 190, borderRadius: 26, background: "rgba(83,227,166,0.08)", border: "2px solid rgba(83,227,166,0.45)", display: "flex", alignItems: "center", gap: 18, padding: "0 24px", ...pop(p) }}>
      {icon}
      <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 36, color: C.ink, lineHeight: 1.05 }}>{label}</div>
    </div>
  );
};

export const CTip: React.FC = () => {
  const s = useSec();
  const b = usePop(seg("tip").start);
  const rows: [React.ReactNode, string, string][] = [
    [<Wave key="n" size={84} />, "Nausea", "nausea,"],
    [<Drop key="d" size={84} />, "Hydration", "hydration"],
    [<Apple key="a" size={84} />, "Nutrition", "nutrition."],
  ];
  return (
    <>
      <div style={{ position: "absolute", left: 40, top: 34, ...pop(b) }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: "#0B1626", background: C.gold, padding: "8px 18px", borderRadius: 12 }}>💊 PHARMACIST TIP</div>
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 130, fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.ink, opacity: ramp(s, seg("tip2").start, seg("tip2").start + 0.4) }}>
        Teen starting a GLP-1? Ask about:
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 210, display: "flex", flexDirection: "column", gap: 18 }}>
        {rows.map(([icon, label, word], i) => {
          const t = w("tip2", word);
          const k = ramp(s, t - 0.15, t + 0.25);
          const c = ramp(s, t + 0.1, t + 0.5);
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: 100, borderRadius: 22, background: "rgba(255,255,255,0.05)", padding: "0 22px", opacity: 0.25 + 0.75 * k, translate: `${(1 - k) * 60}px 0px` }}>
              {icon}
              <div style={{ flex: 1, fontFamily: FONT, fontWeight: 800, fontSize: 44, color: "white" }}>{label}</div>
              <Check size={70} k={c} />
            </div>
          );
        })}
      </div>
    </>
  );
};

export const CStat: React.FC = () => {
  const s = useSec();
  const t0 = w("stat", "1");
  const big = usePop(t0);
  const def = ramp(s, w("stat", "deficiency."), w("stat", "deficiency.") + 0.4);
  return (
    <>
      <Tag color={C.amber}>KIDS ON GLP-1s</Tag>
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", ...pop(big) }}>
        <Big size={140} color={C.amber}>
          ~1 <span style={{ color: "white", fontSize: 84 }}>in</span> 6
        </Big>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 270, display: "flex", justifyContent: "center", gap: 26 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const k = ramp(s, seg("stat").start + 0.3 + i * 0.1, seg("stat").start + 0.7 + i * 0.1);
          const lit = i === 5 && s > t0 + 0.3;
          return (
            <div key={i} style={{ opacity: k, filter: lit ? `drop-shadow(0 0 18px ${C.amber})` : undefined }}>
              <Kid size={96} lit={lit} color={C.amber} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 460, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 40, color: C.ink, opacity: def }}>
        had a nutritional deficiency
      </div>
      <Src>Drug Topics, 1 Oct 2026</Src>
    </>
  );
};

export const CPoll: React.FC = () => {
  const s = useSec();
  const t0 = seg("cta").start;
  const a = usePop(t0 + 0.2);
  const b = usePop(t0 + 0.45);
  const c = ramp(s, w("cta", "comments."), w("cta", "comments.") + 0.4);
  const frame = useCurrentFrame();
  const bounce = Math.abs(Math.sin(frame / 7)) * 10 * c;
  return (
    <>
      <Tag color={C.cyan}>YOUR TAKE</Tag>
      <div style={{ position: "absolute", left: 60, right: 60, top: 100, fontFamily: FONT, fontWeight: 900, fontSize: 52, lineHeight: 1.08, color: "white", textAlign: "center" }}>
        Weight-loss drugs for teens?
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 270, display: "flex", gap: 30 }}>
        <div style={{ flex: 1, height: 130, borderRadius: 30, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#0B1626", ...pop(a) }}>YES</div>
        <div style={{ flex: 1, height: 130, borderRadius: 30, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "white", ...pop(b) }}>NO</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 450, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: c, translate: `0px ${-bounce}px` }}>
        <Comment size={70} />
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.ink }}>Tell me in the comments</div>
      </div>
    </>
  );
};

/* ---------------------------------------------------------------- end card (full frame) */

export const EndCard: React.FC = () => {
  const s = useSec();
  const t0 = seg("outro").start;
  const a = usePop(t0 + 0.1);
  const l = ramp(s, w("outro", "I'm") - 0.2, w("outro", "I'm") + 0.6);
  return (
    <>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, display: "flex", justifyContent: "center", gap: 26, ...pop(a) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 30px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "2px solid rgba(255,255,255,0.25)" }}>
          <Bookmark size={60} />
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "white" }}>Save for your pharmacy visit</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1390, display: "flex", justifyContent: "center", opacity: l, translate: `0px ${(1 - l) * 30}px` }}>
        <Img src={staticFile("brand/logo_on_dark.png")} style={{ height: 150 }} />
      </div>
    </>
  );
};
