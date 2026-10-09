import React from "react";
import { AbsoluteFill, random } from "remotion";
import { Brain, Toggle } from "../components/art";
import { clampInterp, EXPO, INOUT, ramp, useSec, window } from "../lib/anim";
import { C, FONT, MONO, SERIF } from "../theme";
import { Beam, Burst, center, Cite, Flash, Kinetic, shake, Title } from "../v2/kit";
import { seg, w } from "./timing";

export const glass: React.CSSProperties = {
  position: "absolute",
  borderRadius: 40,
  background: "linear-gradient(160deg, rgba(24,48,96,0.66), rgba(8,18,42,0.78))",
  border: "1.5px solid rgba(120,200,255,0.22)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
  overflow: "hidden",
};

/** A glossy two-tone capsule, rotating slowly in 3D. */
export const Capsule: React.FC<{ s: number; size?: number; a?: string; b?: string; spin?: number }> = ({ s, size = 420, a = C.teal, b = "#F4F8FF", spin = 1 }) => {
  const rot = -28 + Math.sin(s * 0.9 * spin) * 10;
  const h = size * 0.38;
  return (
    <div style={{ width: size, height: h, rotate: `${rot}deg`, display: "flex", filter: `drop-shadow(0 30px 60px rgba(0,0,0,0.55)) drop-shadow(0 0 40px ${a}66)` }}>
      <div style={{ width: size / 2, height: h, borderRadius: `${h}px 0 0 ${h}px`, background: `linear-gradient(180deg, ${a} 0%, ${a} 45%, rgba(0,0,0,0.35) 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: h * 0.3, top: h * 0.14, width: size * 0.32, height: h * 0.16, borderRadius: 99, background: "rgba(255,255,255,0.55)", filter: "blur(2px)" }} />
      </div>
      <div style={{ width: size / 2, height: h, borderRadius: `0 ${h}px ${h}px 0`, background: `linear-gradient(180deg, ${b} 0%, #DCE6F2 50%, #8FA3BE 100%)`, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 10, top: h * 0.14, width: size * 0.3, height: h * 0.16, borderRadius: 99, background: "rgba(255,255,255,0.8)", filter: "blur(2px)" }} />
      </div>
    </div>
  );
};

/** Rubber-stamp text that slams in. */
export const Slam: React.FC<{ at: number; text: string; color: string; size?: number; rotate?: number }> = ({ at, text, color, size = 64, rotate = -8 }) => {
  const s = useSec();
  const k = clampInterp(s, [at, at + 0.18], [0, 1], EXPO);
  if (s < at) return null;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 4,
        color,
        border: `6px solid ${color}`,
        borderRadius: 18,
        padding: "6px 28px",
        rotate: `${rotate}deg`,
        scale: String(2.2 - 1.2 * k),
        opacity: k,
        textShadow: `0 0 24px ${color}88`,
        boxShadow: `0 0 40px ${color}55, inset 0 0 30px ${color}33`,
        background: "rgba(3,8,20,0.55)",
      }}
    >
      {text}
    </div>
  );
};

/* 1 · Cold open: a new pill in a beam of light */
export const SHook: React.FC = () => {
  const s = useSec();
  const tPill = w("hook", "pill");
  const tFda = w("hook", "FDA");
  const tFirst = w("hook", "first");
  const beam = clampInterp(s, [0.2, 1.0, 4.5], [0, 1, 0.75]);
  const pill = clampInterp(s, [tPill - 0.4, tPill + 0.5], [0, 1], EXPO);
  const push = 1 + 0.1 * ramp(s, 0, 5.5, INOUT);
  return (
    <AbsoluteFill style={{ background: "#01040C" }}>
      <AbsoluteFill style={{ scale: String(push), translate: shake(s, tFirst, 20) }}>
        <div style={{ position: "absolute", left: 540 - 520, top: 640, width: 1040, height: 700, background: `radial-gradient(ellipse, rgba(31,200,214,${0.1 + 0.3 * beam}), transparent 65%)` }} />
        <Beam x={540} y0={0} y1={1000} k={beam} w={380} color="120,230,240" />
        <div style={{ position: "absolute", top: 900 - 80 + (1 - pill) * 200, ...center, opacity: pill, scale: String(0.6 + 0.4 * pill) }}>
          <Capsule s={s} size={460} />
        </div>
        <Burst at={tFirst} x={540} y={900} color={C.cyan} dist={460} n={36} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 330, ...center, opacity: window(s, 0.3, 5.6, 0.3) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: C.teal }}>NEW DRUG · PARKINSON&apos;S · 2026</div>
      </div>
      <div style={{ position: "absolute", top: 420, left: 0, right: 0 }}>
        <Kinetic at={w("hook", "brand-new")} text="A NEW" size={110} color={C.dim} stagger={0.035} />
        <Kinetic at={w("hook", "Parkinson's")} text="PARKINSON'S PILL" size={104} color="white" stagger={0.028} style={{ marginTop: -6 }} />
      </div>
      <div style={{ position: "absolute", top: 1130, ...center }}>
        <Slam at={tFda} text="FDA APPROVED" color={C.green} size={70} />
      </div>
      <div style={{ position: "absolute", top: 1280, left: 0, right: 0 }}>
        <Kinetic at={tFirst} text="FIRST OF ITS KIND" size={84} color={C.cyan} glow="rgba(91,231,255,0.8)" stagger={0.03} />
      </div>
      <Flash at={tFirst} peak={0.45} dur={0.45} color="120,230,240" />
    </AbsoluteFill>
  );
};

/* 2 · Clara intro, then the drug's name */
export const SName: React.FC = () => {
  const s = useSec();
  const intro = window(s, seg("intro").start - 0.1, seg("intro").end + 0.25, 0.3);
  const tName = w("name", "tavapadon,");
  const tBrand = w("name", "Juvmo.");
  const name = ramp(s, tName - 0.1, tName + 0.6);
  const brand = clampInterp(s, [tBrand - 0.1, tBrand + 0.35], [0, 1], EXPO);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 1190, ...center, opacity: intro, translate: `0px ${(1 - ramp(s, seg("intro").start, seg("intro").start + 0.6)) * 40}px` }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 112, color: "white", letterSpacing: -3, textShadow: "0 0 40px rgba(91,231,255,0.5)" }}>Clara</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: C.cyan, marginTop: -6 }}>your health companion</div>
        </div>
      </div>
      {s > seg("name").start - 0.3 ? (
        <>
          <Title at={seg("name").start} eyebrow="Meet the new drug" title="Tavapadon" sub="generic name" color={C.teal} />
          <div style={{ position: "absolute", top: 600, ...center, opacity: name }}>
            <div style={{ ...glass, position: "relative", width: 900, height: 600, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 40%, rgba(31,200,214,${0.25 * name}), transparent 60%)` }} />
              <div style={{ position: "absolute", top: 70, opacity: 0.9 }}>
                <Capsule s={s} size={300} spin={0.6} />
              </div>
              <div style={{ marginTop: 170, fontFamily: FONT, fontWeight: 900, fontSize: 118, letterSpacing: -3, color: "white", textShadow: "0 0 50px rgba(91,231,255,0.45)" }}>
                {"tavapadon".split("").map((ch, i) => (
                  <span key={i} style={{ display: "inline-block", opacity: ramp(s, tName + i * 0.04, tName + i * 0.04 + 0.3), translate: `0px ${(1 - ramp(s, tName + i * 0.04, tName + i * 0.04 + 0.4)) * 40}px` }}>
                    {ch}
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 18, display: "flex", gap: 18, alignItems: "center", opacity: brand, scale: String(1.4 - 0.4 * brand) }}>
                <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: C.dim }}>BRAND</div>
                <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.teal, padding: "4px 30px", borderRadius: 999, border: `3px solid ${C.teal}`, background: `${C.teal}1A`, boxShadow: `0 0 40px ${C.teal}55` }}>JUVMO™</div>
              </div>
            </div>
          </div>
          <Cite at={tBrand + 0.2} top={1250}>AbbVie · once-daily oral tablet</Cite>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/* 3 · FDA approval card */
export const SApproved: React.FC = () => {
  const s = useSec();
  const tSep = w("approved", "September");
  const tYear = w("approved", "2026,");
  const tAdults = w("approved", "adults");
  const card = clampInterp(s, [seg("approved").start - 0.1, seg("approved").start + 0.7], [0, 1], EXPO);
  const flip = ramp(s, tSep, tSep + 0.5);
  return (
    <AbsoluteFill style={{ translate: shake(s, seg("approved").start + 0.05, 14) }}>
      <Title at={seg("approved").start} eyebrow="Regulatory" title="FDA approved" sub="25 September 2026" color={C.green} />
      <div style={{ position: "absolute", top: 560, ...center, gap: 40, perspective: 1200 }}>
        {/* calendar */}
        <div style={{ width: 360, height: 400, borderRadius: 36, overflow: "hidden", background: "#F4F8FF", boxShadow: "0 40px 90px rgba(0,0,0,0.55)", opacity: card, transform: `rotateY(${(1 - card) * -40}deg) translateY(${(1 - card) * 80}px)` }}>
          <div style={{ height: 110, background: `linear-gradient(135deg, ${C.green}, ${C.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 52, letterSpacing: 6, color: "#03142A" }}>
            {flip > 0.5 ? "SEP" : "AUG"}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 290, transform: `rotateX(${Math.sin(Math.PI * flip) * 70}deg)` }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 170, color: "#0B1B3A", lineHeight: 1 }}>{flip > 0.5 ? 25 : 1}</div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 44, color: "#3A5378", opacity: ramp(s, tYear, tYear + 0.4) }}>2026</div>
          </div>
        </div>
        {/* indication */}
        <div style={{ ...glass, position: "relative", width: 480, height: 400, padding: 40, boxSizing: "border-box", opacity: ramp(s, tAdults - 0.3, tAdults + 0.3), translate: `${(1 - ramp(s, tAdults - 0.3, tAdults + 0.4)) * 120}px 0px` }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 4, color: C.green }}>INDICATION</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 54, lineHeight: 1.1, color: "white", marginTop: 16 }}>Adults with Parkinson&apos;s disease</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 32, color: C.dim, marginTop: 18 }}>alone or with levodopa</div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1030, ...center }}>
        <Slam at={tSep + 0.1} text="APPROVED" color={C.green} size={86} rotate={-6} />
      </div>
      <Cite at={tAdults + 0.4} top={1250}>US launch expected October 2026 · AbbVie</Cite>
    </AbsoluteFill>
  );
};

/* 4 · Dopamine cells die → symptoms */
const DOTS = new Array(46).fill(0).map((_, i) => ({ a: random(`na${i}`) * Math.PI * 2, r: 30 + random(`nr${i}`) * 120, die: random(`nd${i}`) }));

export const SCells: React.FC = () => {
  const s = useSec();
  const tCells = w("cells", "cells");
  const tDie = w("cells", "die.");
  const loss = clampInterp(s, [tDie - 0.6, tDie + 1.2], [0, 0.8], INOUT);
  const sym = seg("symptoms").start;
  const zoom = ramp(s, tCells - 0.2, tCells + 0.8);
  const chips: [string, number][] = [
    ["Slow movement", w("symptoms", "slow")],
    ["Stiffness", w("symptoms", "stiffness")],
    ["Tremor", w("symptoms", "tremor.")],
  ];
  return (
    <AbsoluteFill>
      <Title at={seg("cells").start} eyebrow="The disease" title="Dopamine cells fade" sub="in a deep brain area: the substantia nigra" color={C.amber} />
      <div style={{ position: "absolute", left: 540 - 380, top: 600, opacity: 1 - 0.55 * ramp(s, sym, sym + 0.5), scale: String(1 - 0.12 * ramp(s, sym, sym + 0.6)) }}>
        <Brain s={s} size={760} base={0.75} color={C.blue} spots={[{ x: 30, y: 80, r: 140, color: C.amber, k: (0.9 - loss) * zoom }]} />
      </div>
      {/* dopamine neurons as glowing dots, dying out */}
      <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
        {DOTS.map((d, i) => {
          const alive = d.die > loss * 1.15;
          const k = alive ? 1 : Math.max(0, 1 - (loss * 1.15 - d.die) * 6);
          const x = 560 + Math.cos(d.a) * d.r * zoom;
          const y = 900 + Math.sin(d.a) * d.r * 0.7 * zoom;
          return <circle key={i} cx={x} cy={y} r={6 + 3 * Math.sin(s * 3 + i)} fill={C.gold} opacity={zoom * k * (1 - 0.6 * ramp(s, sym, sym + 0.5))} style={{ filter: `drop-shadow(0 0 8px ${C.gold})` }} />;
        })}
      </svg>
      <div style={{ position: "absolute", top: 1140, ...center, opacity: window(s, tDie - 0.4, sym + 0.3, 0.3) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 40, color: C.amber }}>DOPAMINE ↓</div>
      </div>
      <div style={{ position: "absolute", top: 800, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        {chips.map(([t, at], i) => {
          const k = clampInterp(s, [at - 0.1, at + 0.35], [0, 1], EXPO);
          const trem = t === "Tremor" ? Math.sin(s * 40) * 6 * k : 0;
          return (
            <div key={t} style={{ ...glass, position: "relative", width: 640, height: 130, display: "flex", alignItems: "center", gap: 30, padding: "0 40px", boxSizing: "border-box", opacity: k, translate: `${(1 - k) * (i % 2 ? 300 : -300) + trem}px 0px`, border: `1.5px solid ${C.amber}66` }}>
              <div style={{ width: 22, height: 22, borderRadius: 99, background: C.amber, boxShadow: `0 0 18px ${C.amber}` }} />
              <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 58, color: "white" }}>{t}</div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* 5 · Receptors as switches: old agonists (D2/D3) vs tavapadon (D1/D5) */
export const SSwitches: React.FC = () => {
  const s = useSec();
  const tOld = w("old", "D2");
  const tNew = w("new", "D1");
  const t5 = w("new", "D5.");
  const panel = ramp(s, seg("switches").start, seg("switches").start + 0.6);
  const oldOn = (r: string) => (r === "D2" ? ramp(s, tOld, tOld + 0.25) : r === "D3" ? ramp(s, w("old", "D3."), w("old", "D3.") + 0.25) : 0) * (1 - ramp(s, seg("new").start, seg("new").start + 0.3));
  const newOn = (r: string) => (r === "D1" ? ramp(s, tNew, tNew + 0.25) : r === "D5" ? ramp(s, t5, t5 + 0.25) : 0);
  const recs = ["D1", "D2", "D3", "D4", "D5"];
  const drugsOld = ramp(s, w("old", "pramipexole"), w("old", "pramipexole") + 0.4);
  const drugNew = ramp(s, w("new", "Tavapadon"), w("new", "Tavapadon") + 0.4);
  const isNew = s > seg("new").start;
  return (
    <AbsoluteFill style={{ translate: shake(s, tNew, 10) }}>
      <Title
        at={seg("switches").start}
        eyebrow="How it works"
        title={isNew ? "A different switch" : "Dopamine receptors"}
        sub={isNew ? "D1 and D5: first approved drug to target them selectively" : "five types, D1 to D5"}
        color={isNew ? C.cyan : C.violet}
      />
      <div style={{ position: "absolute", top: 560, ...center, opacity: panel }}>
        <div style={{ ...glass, position: "relative", width: 940, height: 480, padding: "60px 50px", boxSizing: "border-box" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {recs.map((r, i) => {
              const o = oldOn(r);
              const n = newOn(r);
              const on = Math.max(o, n);
              const col = n > 0 ? C.cyan : C.amber;
              const k = ramp(s, seg("switches").start + i * 0.08, seg("switches").start + i * 0.08 + 0.4);
              return (
                <div key={r} style={{ width: 150, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: k, translate: `0px ${(1 - k) * 60}px` }}>
                  <div style={{ width: 150, height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ rotate: "-90deg" }}>
                      <Toggle on={on} size={220} color={col} />
                    </div>
                  </div>
                  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: on > 0.5 ? col : "rgba(255,255,255,0.75)", textShadow: on > 0.5 ? `0 0 26px ${col}` : "none" }}>{r}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* who presses what */}
      <div style={{ position: "absolute", top: 1150, ...center, gap: 18, opacity: drugsOld * (1 - ramp(s, seg("new").start - 0.1, seg("new").start + 0.2)) }}>
        {["pramipexole", "ropinirole"].map((d) => (
          <div key={d} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: C.amber, padding: "10px 28px", borderRadius: 999, border: `2px solid ${C.amber}88`, background: `${C.amber}14` }}>{d}</div>
        ))}
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: C.dim, alignSelf: "center" }}>→ D2 · D3</div>
      </div>
      <div style={{ position: "absolute", top: 1150, ...center, gap: 18, opacity: drugNew }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: "#03142A", padding: "10px 34px", borderRadius: 999, background: `linear-gradient(135deg, ${C.cyan}, ${C.teal})`, boxShadow: `0 0 40px ${C.teal}88`, scale: String(1.3 - 0.3 * drugNew) }}>tavapadon</div>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: C.cyan, alignSelf: "center" }}>→ D1 · D5</div>
      </div>
      <Burst at={tNew} x={540 - 355} y={740} color={C.cyan} dist={200} n={20} />
      <Burst at={t5} x={540 + 355} y={740} color={C.cyan} dist={200} n={20} />
    </AbsoluteFill>
  );
};

/* 6 · Partial agonist + long half-life → once daily */
export const SPartial: React.FC = () => {
  const s = useSec();
  const tPartial = w("partial", "partial");
  const tGentle = w("partial", "gentler");
  const tHalf = w("partial", "half-life");
  const tOnce = seg("once").start;
  const fullBar = ramp(s, tPartial, tPartial + 0.6);
  const partBar = ramp(s, tGentle - 0.1, tGentle + 0.9, INOUT) * 0.55;
  const clock = clampInterp(s, [tHalf, tHalf + 1.4], [0, 25.5 / 24], INOUT);
  const gauges = window(s, seg("partial").start - 0.2, tHalf + 0.1, 0.3);
  const clockK = window(s, tHalf - 0.2, tOnce + 0.2, 0.3);
  const once = ramp(s, tOnce, tOnce + 0.5);
  const R = 200;
  const circ = 2 * Math.PI * R;
  return (
    <AbsoluteFill>
      <Title at={seg("partial").start} eyebrow="Pharmacology" title="Partial agonist" sub="a gentler push on the receptor" color={C.violet} />
      <AbsoluteFill style={{ opacity: gauges }}>
        {[
          ["Full agonist", fullBar, C.amber, 620],
          ["Tavapadon (partial)", partBar, C.cyan, 860],
        ].map(([label, k, col, top]) => (
          <div key={label as string} style={{ position: "absolute", left: 110, top: top as number, width: 860 }}>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 42, color: "white", marginBottom: 16 }}>{label as string}</div>
            <div style={{ height: 70, borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(255,255,255,0.15)", overflow: "hidden" }}>
              <div style={{ width: `${100 * (k as number)}%`, height: "100%", borderRadius: 999, background: `linear-gradient(90deg, ${col}55, ${col as string})`, boxShadow: `0 0 30px ${col as string}` }} />
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", top: 1080, ...center, opacity: ramp(s, tGentle + 0.4, tGentle + 0.8) }}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 38, color: C.dim }}>illustrative, not to scale</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: clockK }}>
        <svg width={1080} height={700} style={{ position: "absolute", left: 0, top: 540 }}>
          <circle cx={540} cy={300} r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={34} />
          <circle cx={540} cy={300} r={R} fill="none" stroke={C.violet} strokeWidth={34} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - Math.min(1, clock))} transform="rotate(-90 540 300)" style={{ filter: `drop-shadow(0 0 16px ${C.violet})` }} />
          <text x={540} y={300} textAnchor="middle" fill="white" fontFamily={FONT} fontWeight={900} fontSize={110}>
            {(clock * 24).toFixed(1)}
          </text>
          <text x={540} y={360} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontWeight={700} fontSize={30} letterSpacing={4}>
            HOURS
          </text>
          <text x={540} y={590} textAnchor="middle" fill={C.violet} fontFamily={MONO} fontWeight={700} fontSize={30} letterSpacing={4}>
            HALF-LIFE ≈ 25.5 h
          </text>
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: once }}>
        <div style={{ position: "absolute", top: 640, ...center, translate: `0px ${(1 - once) * 80}px` }}>
          <Capsule s={s} size={420} />
        </div>
        <div style={{ position: "absolute", top: 900, left: 0, right: 0 }}>
          <Kinetic at={w("once", "once")} text="1× DAILY" size={170} color={C.cyan} glow="rgba(91,231,255,0.6)" stagger={0.04} />
        </div>
      </AbsoluteFill>
      <Cite at={tHalf + 0.4} until={tOnce} top={1250}>Juvmo prescribing information, 2026</Cite>
    </AbsoluteFill>
  );
};

