import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Toggle } from "../components/art";
import { clampInterp, EXPO, INOUT, ramp, useSec, window } from "../lib/anim";
import { C, FONT, MONO, SERIF } from "../theme";
import { Burst, center, Cite, Flash, Kinetic, shake, Title } from "../v2/kit";
import { Capsule, glass, Slam } from "./scenesA";
import { seg, w } from "./timing";

/* 7 · TEMPO trials, monotherapy result (TEMPO-1) */
export const STrials: React.FC = () => {
  const s = useSec();
  const t0 = seg("trials").start;
  const tTempo = w("trials", "TEMPO.");
  const tAlone = seg("alone").start;
  const chips = window(s, t0 - 0.2, tAlone + 0.2, 0.3);
  const chart = ramp(s, tAlone - 0.1, tAlone + 0.5);
  const grow = (at: number) => clampInterp(s, [at, at + 0.9], [0, 1], EXPO);
  const tImp = w("alone", "improved");
  const tPla = w("alone", "placebo");
  const bars: [string, number, string, number][] = [
    ["Placebo", +1.8, C.red, tPla],
    ["5 mg", -9.7, C.cyan, tImp],
    ["15 mg", -10.2, C.teal, tImp + 0.25],
  ];
  const ZERO = 300; // y of zero line inside the chart svg
  const SCALE = 30; // px per point
  return (
    <AbsoluteFill>
      <Title at={t0} eyebrow="The evidence" title="Phase 3: TEMPO" sub={s < tAlone ? "three placebo-controlled trials" : "TEMPO-1 · early Parkinson's, no levodopa"} color={C.gold} />
      <AbsoluteFill style={{ opacity: chips }}>
        <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          {[
            ["TEMPO-1", "alone · early PD"],
            ["TEMPO-2", "alone · early PD"],
            ["TEMPO-3", "+ levodopa · \"OFF\" episodes"],
          ].map(([n, d], i) => {
            const k = clampInterp(s, [t0 + 0.6 + i * 0.25, t0 + 1.0 + i * 0.25], [0, 1], EXPO);
            return (
              <div key={n} style={{ ...glass, position: "relative", width: 820, height: 140, display: "flex", alignItems: "center", gap: 34, padding: "0 44px", boxSizing: "border-box", opacity: k, translate: `${(1 - k) * 260}px 0px`, border: `1.5px solid ${C.gold}55` }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: C.gold, whiteSpace: "nowrap" }}>{n}</div>
                <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 32, color: "white" }}>{d}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", top: 1180, ...center, opacity: ramp(s, tTempo, tTempo + 0.4) }}>
          <Slam at={tTempo} text="PHASE 3" color={C.gold} size={58} rotate={-4} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: chart }}>
        <div style={{ position: "absolute", left: 80, top: 520, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 2, color: C.dim }}>MOVEMENT SCORE CHANGE · WEEK 26</div>
        <div style={{ position: "absolute", left: 80, top: 556, fontFamily: SERIF, fontStyle: "italic", fontSize: 30, color: C.dim }}>MDS-UPDRS II+III · lower is better</div>
        <svg width={1080} height={820} style={{ position: "absolute", left: 0, top: 560 }}>
          <line x1={110} y1={ZERO} x2={990} y2={ZERO} stroke="rgba(255,255,255,0.35)" strokeWidth={3} />
          <text x={100} y={ZERO + 10} textAnchor="end" fill={C.dim} fontFamily={MONO} fontSize={26}>0</text>
          {bars.map(([label, v, col, at], i) => {
            const k = grow(at);
            const x = 190 + i * 270;
            const h = Math.abs(v) * SCALE * k;
            const y = v > 0 ? ZERO - h : ZERO;
            return (
              <g key={label}>
                <rect x={x} y={y} width={170} height={h} rx={16} fill={col} opacity={0.92} style={{ filter: `drop-shadow(0 0 18px ${col})` }} />
                <text x={x + 85} y={v > 0 ? y - 22 : y + h + 62} textAnchor="middle" fill="white" fontFamily={FONT} fontWeight={900} fontSize={58} opacity={k}>
                  {v > 0 ? "+" : "−"}
                  {Math.abs(v * k).toFixed(1)}
                </text>
                <text x={x + 85} y={v > 0 ? ZERO + 50 : ZERO - 24} textAnchor="middle" fill={col} fontFamily={FONT} fontWeight={800} fontSize={38}>
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
        <div style={{ position: "absolute", top: 940, left: 160, opacity: ramp(s, tPla + 0.3, tPla + 0.7) }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, color: C.red }}>↑ slightly worse</div>
        </div>
      </AbsoluteFill>
      <Cite at={tImp + 0.4} top={1340}>TEMPO-1 · n=529 · 26 weeks · p&lt;0.001 vs placebo</Cite>
    </AbsoluteFill>
  );
};

/* 8 · TEMPO-3: add-on to levodopa → +1.1 h good ON time */
export const SAddon: React.FC = () => {
  const s = useSec();
  const t0 = seg("addon").start;
  const tLevo = w("addon", "levodopa,");
  const tHour = w("addon", "hour");
  const tDys = w("addon", "dyskinesia.");
  const bar = ramp(s, t0, t0 + 0.6);
  const extra = clampInterp(s, [tHour - 0.1, tHour + 0.9], [0, 1], EXPO);
  const hours = 1.1 * extra;
  return (
    <AbsoluteFill style={{ translate: shake(s, tHour, 12) }}>
      <Title at={t0} eyebrow="TEMPO-3 · with levodopa" title="More good ON time" sub="ON time without troublesome dyskinesia" color={C.green} />
      <div style={{ position: "absolute", top: 600, ...center, gap: 26, opacity: ramp(s, tLevo - 0.2, tLevo + 0.4) }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: "white", padding: "12px 34px", borderRadius: 999, border: "2px solid rgba(255,255,255,0.35)" }}>levodopa</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.green }}>+</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: "#03142A", padding: "12px 34px", borderRadius: 999, background: `linear-gradient(135deg, ${C.cyan}, ${C.teal})` }}>tavapadon</div>
      </div>
      {/* 24 h day bar */}
      <div style={{ position: "absolute", left: 90, top: 790, width: 900, opacity: bar }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 24, color: C.dim, marginBottom: 12 }}>
          <span>00:00</span>
          <span>A DAY</span>
          <span>24:00</span>
        </div>
        <div style={{ height: 110, borderRadius: 26, background: "rgba(255,255,255,0.07)", border: "1.5px solid rgba(255,255,255,0.18)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(100 * 9) / 24}%`, background: `linear-gradient(90deg, ${C.green}33, ${C.green}88)` }} />
          <div style={{ position: "absolute", left: `${(100 * 9) / 24}%`, top: 0, bottom: 0, width: `${(100 * 1.1 * extra) / 24}%`, background: C.green, boxShadow: `0 0 40px ${C.green}` }} />
        </div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 28, color: C.dim, marginTop: 12 }}>illustrative day</div>
      </div>
      <div style={{ position: "absolute", top: 1020, ...center, alignItems: "baseline", gap: 18, opacity: extra }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 200, color: C.green, letterSpacing: -6, textShadow: `0 0 50px ${C.green}88` }}>+{hours.toFixed(1)}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: "white" }}>h / day</div>
      </div>
      <div style={{ position: "absolute", top: 1260, ...center, opacity: ramp(s, tDys - 0.2, tDys + 0.3) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.dim }}>vs placebo · OFF time also fell ≈0.9 h</div>
      </div>
      <Burst at={tHour + 0.2} x={540} y={1120} color={C.green} dist={300} />
      <Cite at={tDys + 0.2} top={1330}>TEMPO-3 · n=507 · 27 weeks · p&lt;0.001</Cite>
    </AbsoluteFill>
  );
};

/* 9 · Side effects and warnings */
export const SSafety: React.FC = () => {
  const s = useSec();
  const t0 = seg("side").start;
  const tN = w("side", "Nausea.");
  const tW = seg("warn").start;
  const side = window(s, t0 - 0.2, tW + 0.1, 0.3);
  const warns: [string, string, number][] = [
    ["Low BP on standing", "rise slowly", w("warn", "dizziness")],
    ["Hallucinations", "report them", w("warn", "hallucinations,")],
    ["Unusual urges", "gambling, shopping, eating", w("warn", "unusual")],
  ];
  return (
    <AbsoluteFill>
      <Title at={t0} eyebrow="Safety" title={s < tW ? "Side effects" : "Watch for"} sub={s < tW ? "most were mild to moderate" : "warnings on the label"} color={s < tW ? C.amber : C.red} />
      <AbsoluteFill style={{ opacity: side }}>
        <div style={{ position: "absolute", top: 600, ...center, opacity: ramp(s, tN - 0.1, tN + 0.3), scale: String(1.25 - 0.25 * clampInterp(s, [tN - 0.1, tN + 0.4], [0, 1], EXPO)) }}>
          <div style={{ ...glass, position: "relative", width: 760, height: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: `2px solid ${C.amber}88` }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: C.amber, textShadow: `0 0 40px ${C.amber}88` }}>Nausea</div>
            <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 40, color: "white" }}>about 1 in 4 on tavapadon alone</div>
          </div>
        </div>
        <div style={{ position: "absolute", top: 980, ...center, gap: 24 }}>
          {[
            ["Headache", w("side", "headache")],
            ["Dizziness", w("side", "dizziness.")],
          ].map(([t, at]) => (
            <div key={t as string} style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: "white", padding: "16px 44px", borderRadius: 999, border: `2px solid ${C.amber}66`, background: `${C.amber}14`, opacity: ramp(s, at as number, (at as number) + 0.3), translate: `0px ${(1 - ramp(s, at as number, (at as number) + 0.4)) * 50}px` }}>
              {t as string}
            </div>
          ))}
        </div>
        <Cite at={tN + 0.6} top={1250}>TEMPO-1: nausea 25%, headache 17%, dizziness 13%</Cite>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: ramp(s, tW - 0.1, tW + 0.3) }}>
        <div style={{ position: "absolute", top: 580, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          {warns.map(([t, d, at], i) => {
            const k = clampInterp(s, [at - 0.15, at + 0.35], [0, 1], EXPO);
            return (
              <div key={t} style={{ ...glass, position: "relative", width: 900, height: 200, display: "flex", alignItems: "center", gap: 36, padding: "0 46px", boxSizing: "border-box", opacity: k, translate: `${(1 - k) * (i % 2 ? 300 : -300)}px 0px`, border: `2px solid ${C.red}77` }}>
                <div style={{ width: 96, height: 96, borderRadius: 24, background: `${C.red}26`, border: `3px solid ${C.red}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.red }}>!</div>
                <div>
                  <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52, color: "white" }}>{t}</div>
                  <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: C.dim }}>{d}</div>
                </div>
              </div>
            );
          })}
        </div>
        <Cite at={w("warn", "shopping.")} top={1270}>Juvmo prescribing information · warnings &amp; precautions</Cite>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 10 · Pharmacist tip: CYP3A */
export const STip: React.FC = () => {
  const s = useSec();
  const t0 = seg("tip").start;
  const tCyp = w("tip", "CYP3A");
  const tItra = w("inter", "itraconazole");
  const tRaise = w("inter", "raise");
  const tCarb = w("inter", "Carbamazepine");
  const tLow = w("inter", "lowers");
  const badge = clampInterp(s, [t0 - 0.1, t0 + 0.4], [0, 1], EXPO);
  const enz = ramp(s, tCyp - 0.1, tCyp + 0.5);
  // tavapadon level meter: baseline 0.5, up with inhibitor, down with inducer
  const level = 0.5 + 0.35 * ramp(s, tRaise, tRaise + 0.6) - 0.35 * ramp(s, tCarb - 0.4, tCarb) - 0.35 * ramp(s, tLow, tLow + 0.6);
  const lvlColor = level > 0.7 ? C.red : level < 0.3 ? C.amber : C.cyan;
  return (
    <AbsoluteFill style={{ translate: shake(s, t0 + 0.05, 10) }}>
      <div style={{ position: "absolute", top: 250, left: 296, opacity: badge, scale: String(1.3 - 0.3 * badge) }}>
        <div style={{ fontFamily: MONO, fontWeight: 800, fontSize: 30, letterSpacing: 6, color: "#03142A", background: `linear-gradient(135deg, ${C.gold}, ${C.amber})`, padding: "12px 28px", borderRadius: 14, boxShadow: `0 0 40px ${C.gold}88`, display: "inline-block" }}>PHARMACIST TIP</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: "white", marginTop: 16, letterSpacing: -1.5 }}>Check CYP3A</div>
      </div>
      {/* enzyme */}
      <div style={{ position: "absolute", top: 560, ...center, opacity: enz }}>
        <div style={{ width: 300, height: 300, borderRadius: 999, background: `radial-gradient(circle at 40% 35%, ${C.violet}, #2A1E6B)`, boxShadow: `0 0 80px ${C.violet}88`, display: "flex", alignItems: "center", justifyContent: "center", rotate: `${Math.sin(s * 1.2) * 6}deg` }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 76, color: "white" }}>CYP3A</div>
        </div>
      </div>
      {/* interacting drugs */}
      <div style={{ position: "absolute", left: 60, top: 920, width: 440, opacity: ramp(s, tItra - 0.2, tItra + 0.3), translate: `${(1 - ramp(s, tItra - 0.2, tItra + 0.4)) * -200}px 0px` }}>
        <div style={{ ...glass, position: "relative", padding: "26px 30px", border: `2px solid ${C.red}88` }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.red }}>INHIBITOR</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: "white" }}>itraconazole</div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: C.red, opacity: ramp(s, tRaise, tRaise + 0.3) }}>levels ↑</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 580, top: 920, width: 440, opacity: ramp(s, tCarb - 0.2, tCarb + 0.3), translate: `${(1 - ramp(s, tCarb - 0.2, tCarb + 0.4)) * 200}px 0px` }}>
        <div style={{ ...glass, position: "relative", padding: "26px 30px", border: `2px solid ${C.amber}88` }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.amber }}>INDUCER</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: "white" }}>carbamazepine</div>
          <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 36, color: C.amber, opacity: ramp(s, tLow, tLow + 0.3) }}>levels ↓</div>
        </div>
      </div>
      {/* level meter */}
      <div style={{ position: "absolute", left: 140, top: 1200, width: 800, opacity: ramp(s, tItra, tItra + 0.4) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 3, color: C.dim, marginBottom: 10 }}>TAVAPADON BLOOD LEVEL</div>
        <div style={{ height: 40, borderRadius: 99, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
          <div style={{ width: `${100 * level}%`, height: "100%", borderRadius: 99, background: lvlColor, boxShadow: `0 0 26px ${lvlColor}` }} />
        </div>
      </div>
      <Cite at={tLow + 0.4} top={1300}>Avoid strong inducers · adjust dosing with strong/moderate inhibitors</Cite>
    </AbsoluteFill>
  );
};

/* 11 · Titration staircase */
const STEPS: [number, number][] = [
  [1, 0.25],
  [5, 0.5],
  [9, 0.75],
  [13, 1],
  [17, 1.5],
  [21, 2.25],
  [25, 3],
  [41, 5],
];

export const STitrate: React.FC = () => {
  const s = useSec();
  const t0 = seg("titrate").start;
  const tLow = w("titrate", "low:");
  const tSix = w("titrate", "six");
  const t5 = w("titrate", "5");
  const draw = clampInterp(s, [tLow, t5 + 0.2], [0, 1], INOUT);
  const X = (d: number) => 120 + (d / 48) * 840;
  const Y = (mg: number) => 1180 - (mg / 5) * 560;
  const pts = STEPS.flatMap(([d, mg], i) => {
    const next = STEPS[i + 1]?.[0] ?? 48;
    return [`${X(d)},${Y(mg)}`, `${X(next)},${Y(mg)}`];
  }).join(" ");
  const total = 2600;
  return (
    <AbsoluteFill>
      <Title at={t0} eyebrow="Dosing" title="Start low, go slow" sub="titration pack, then 5 mg once daily (max 15 mg)" color={C.teal} />
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={X(0)} y1={Y(0)} x2={X(48)} y2={Y(0)} stroke="rgba(255,255,255,0.3)" strokeWidth={3} />
        {[0, 1, 2, 3, 4, 5].map((mg) => (
          <g key={mg}>
            <line x1={X(0)} y1={Y(mg)} x2={X(48)} y2={Y(mg)} stroke="rgba(255,255,255,0.07)" strokeWidth={2} />
            <text x={X(0) - 18} y={Y(mg) + 9} textAnchor="end" fill={C.dim} fontFamily={MONO} fontSize={26}>
              {mg}
            </text>
          </g>
        ))}
        <text x={X(0) - 18} y={Y(5) - 40} textAnchor="start" fill={C.dim} fontFamily={MONO} fontSize={24}>mg/day</text>
        {[0, 14, 28, 42].map((d) => (
          <text key={d} x={X(d)} y={Y(0) + 48} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontSize={26}>
            {d === 0 ? "day 1" : `wk ${d / 7}`}
          </text>
        ))}
        <polyline points={pts} fill="none" stroke={C.teal} strokeWidth={12} strokeLinejoin="round" strokeLinecap="round" strokeDasharray={total} strokeDashoffset={total * (1 - draw)} style={{ filter: `drop-shadow(0 0 14px ${C.teal})` }} />
        <g opacity={ramp(s, tSix, tSix + 0.4)}>
          <line x1={X(41)} y1={Y(0)} x2={X(41)} y2={Y(5)} stroke={C.gold} strokeWidth={4} strokeDasharray="10 10" />
          <text x={X(41)} y={Y(0) - 20} textAnchor="end" fill={C.gold} fontFamily={FONT} fontWeight={800} fontSize={40}>
            day 41 ≈ 6 weeks →
          </text>
        </g>
      </svg>
      <div style={{ position: "absolute", left: X(41) - 110, top: Y(5) - 150, opacity: ramp(s, t5, t5 + 0.3), scale: String(1.3 - 0.3 * clampInterp(s, [t5, t5 + 0.4], [0, 1], EXPO)) }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 72, color: C.teal, textShadow: `0 0 30px ${C.teal}` }}>5 mg</div>
      </div>
      <Burst at={t5} x={X(41)} y={Y(5)} color={C.teal} dist={180} n={18} />
      <Cite at={t5 + 0.3} top={1310}>0.25 mg → 5 mg over 41 days · Juvmo label</Cite>
    </AbsoluteFill>
  );
};

/* 12 · Caveat: not head-to-head; an option, not a cure */
export const SCaveat: React.FC = () => {
  const s = useSec();
  const t0 = seg("caveat").start;
  const tYet = w("caveat", "yet.");
  const tOpt = seg("option").start;
  const vs = window(s, t0 - 0.2, tOpt + 0.1, 0.3);
  const fight = ramp(s, t0 + 0.2, t0 + 0.9);
  return (
    <AbsoluteFill style={{ translate: shake(s, w("option", "cure."), 12) }}>
      <Title at={t0} eyebrow="Keep it real" title={s < tOpt ? "Head-to-head?" : "An option, not a cure"} sub={s < tOpt ? "no direct trial vs older agonists yet" : "it treats symptoms; it doesn't stop Parkinson's"} color={C.amber} />
      <AbsoluteFill style={{ opacity: vs }}>
        <div style={{ position: "absolute", top: 680, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
          <div style={{ translate: `${(1 - fight) * -300}px 0px`, opacity: fight }}>
            <Capsule s={s} size={300} />
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 110, color: C.amber, opacity: fight, textShadow: `0 0 40px ${C.amber}` }}>VS</div>
          <div style={{ translate: `${(1 - fight) * 300}px 0px`, opacity: fight }}>
            <Capsule s={s + 1.3} size={300} a={C.amber} />
          </div>
        </div>
        <div style={{ position: "absolute", top: 940, left: 0, right: 0, display: "flex", justifyContent: "space-around", fontFamily: FONT, fontWeight: 700, fontSize: 38, color: C.dim, opacity: fight }}>
          <span>tavapadon</span>
          <span>older agonists</span>
        </div>
        <div style={{ position: "absolute", top: 1080, ...center }}>
          <Slam at={tYet - 0.1} text="NOT TESTED YET" color={C.amber} size={66} rotate={-5} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: ramp(s, tOpt - 0.1, tOpt + 0.3) }}>
        <div style={{ position: "absolute", top: 650, left: 0, right: 0 }}>
          <Kinetic at={w("option", "new")} text="NEW OPTION" size={130} color={C.cyan} glow="rgba(91,231,255,0.6)" />
        </div>
        <div style={{ position: "absolute", top: 880, ...center, opacity: ramp(s, w("option", "not"), w("option", "not") + 0.2) }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: C.red, lineHeight: 1, textShadow: `0 0 40px ${C.red}` }}>≠</div>
        </div>
        <div style={{ position: "absolute", top: 1060, left: 0, right: 0 }}>
          <Kinetic at={w("option", "cure.")} text="A CURE" size={130} color="white" />
        </div>
      </AbsoluteFill>
      <Flash at={w("option", "cure.")} peak={0.3} dur={0.4} color="255,180,71" />
    </AbsoluteFill>
  );
};

/* 13 · Recap + logo sting */
export const SOutro: React.FC = () => {
  const s = useSec();
  const tiles = window(s, seg("recap").start - 0.2, seg("cta").start + 0.2, 0.3);
  const tCta = seg("cta").start;
  const sting = ramp(s, tCta - 0.1, tCta + 0.7, EXPO);
  const dIn = ramp(s, tCta - 0.1, tCta + 0.55, EXPO);
  const pIn = ramp(s, tCta + 0.1, tCta + 0.75, EXPO);
  const word = ramp(s, tCta + 0.6, tCta + 1.2);
  const sweep = ((s - tCta - 0.7) / 1.0) * 160 - 30;
  const tFollow = w("cta", "Follow");
  const pressed = s > tFollow + 1.3;
  const tile = (n: React.ReactNode, l: string, at: number, c: string) => (
    <div style={{ width: 300, height: 320, borderRadius: 40, background: "linear-gradient(170deg, rgba(30,56,108,0.75), rgba(10,20,46,0.85))", border: `2px solid ${c}66`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${c}22`, opacity: ramp(s, at, at + 0.3), scale: String(0.6 + 0.4 * clampInterp(s, [at, at + 0.4], [0, 1], EXPO)) }}>
      {n}
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: "white", marginTop: 14, textAlign: "center" }}>{l}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: tiles }}>
        <Title at={seg("recap").start} eyebrow="In one line" title="Tavapadon (Juvmo)" sub="a new D1/D5 option for Parkinson's" color={C.teal} />
        <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 28 }}>
          {tile(<div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 110, color: C.cyan, lineHeight: 1 }}>D1/5</div>, "new target", w("recap", "New"), C.cyan)}
          {tile(<Capsule s={s} size={220} />, "1 tablet a day", w("recap", "One"), C.teal)}
          {tile(<div style={{ marginBottom: 10 }}><Toggle on={ramp(s, w("recap", "choice"), w("recap", "choice") + 0.2)} size={170} color={C.green} /></div>, "more choice", w("recap", "More"), C.green)}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: sting }}>
        <div style={{ position: "absolute", left: 540 - 210, top: 990, width: 420, height: 300 }}>
          <Img src={staticFile("brand/mark_D.png")} style={{ position: "absolute", left: 0, top: 0, width: 420, translate: `${(1 - dIn) * -420}px 0px`, opacity: dIn, filter: `drop-shadow(0 0 ${30 * (1 - dIn) + 10}px rgba(255,255,255,0.4))` }} />
          <Img src={staticFile("brand/mark_P.png")} style={{ position: "absolute", left: 0, top: 0, width: 420, translate: `${(1 - pIn) * 420}px 0px`, opacity: pIn, filter: `drop-shadow(0 0 ${30 * (1 - pIn) + 14}px rgba(47,196,214,0.7))` }} />
          <div style={{ position: "absolute", inset: -20, background: `linear-gradient(105deg, transparent ${sweep}%, rgba(255,255,255,0.65) ${sweep + 8}%, transparent ${sweep + 16}%)`, mixBlendMode: "overlay", maskImage: `url(${staticFile("brand/mark_color.png")})`, maskSize: "420px auto", maskRepeat: "no-repeat", maskPosition: "20px 20px" }} />
        </div>
        <div style={{ position: "absolute", top: 1318, ...center, opacity: word, translate: `0px ${(1 - word) * 30}px` }}>
          <Img src={staticFile("brand/wordmark_on_dark.png")} style={{ width: 600 }} />
        </div>
        <div style={{ position: "absolute", top: 1450, ...center, gap: 22, alignItems: "center", opacity: ramp(s, tFollow + 0.6, tFollow + 1.0) }}>
          <div style={{ padding: "18px 64px", borderRadius: 999, fontFamily: FONT, fontWeight: 800, fontSize: 44, color: pressed ? C.teal : "#03142A", background: pressed ? "transparent" : `linear-gradient(135deg, ${C.cyan}, ${C.teal})`, border: `3px solid ${C.teal}`, scale: String(s > tFollow + 1.2 && s < tFollow + 1.4 ? 0.9 : 1), boxShadow: pressed ? "none" : `0 0 40px ${C.teal}88` }}>
            {pressed ? "✓ Following" : "Follow"}
          </div>
        </div>
        <div style={{ position: "absolute", top: 1590, ...center, opacity: ramp(s, w("cta", "made"), w("cta", "made") + 0.5) }}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 46, color: C.cyan }}>medicine, made simple.</div>
        </div>
        <div style={{ position: "absolute", top: 1700, ...center, opacity: 0.7 * word }}>
          <div style={{ fontFamily: MONO, fontSize: 20, color: C.dim }}>Educational only · not medical advice · ask your doctor or pharmacist</div>
        </div>
        <Burst at={tFollow + 1.3} x={540} y={1490} color={C.teal} dist={300} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
