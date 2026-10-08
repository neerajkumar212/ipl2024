import React from "react";
import { AbsoluteFill } from "remotion";
import { Brain, DNA, Eye, Mouse, Neuron, Toggle } from "../components/art";
import { Chip, FadeUp, Glass, Header, PersonCard, Pop, Shell, Stamp } from "../components/ui";
import { clampInterp, EXPO, INOUT, ramp, useSec, window } from "../lib/anim";
import { C, FONT, MONO, SERIF } from "../theme";

const center: React.CSSProperties = { left: 0, right: 0, display: "flex", justifyContent: "center" };

/* S7 · 2005, Stanford → remote control — 61.3 → 71.6 */
export const S7Stanford: React.FC = () => {
  const s = useSec();
  const year = Math.round(clampInterp(s, [61.5, 62.4], [1990, 2005], EXPO));
  const intro = window(s, 61.4, 65.1, 0.35);
  const deliver = clampInterp(s, [65.0, 66.3], [0, 1], INOUT);
  const neuronK = ramp(s, 64.9, 65.4);
  const flash = clampInterp(s, [67.0, 67.08, 67.6], [0, 1, 0]) + clampInterp(s, [70.5, 70.58, 71.0], [0, 0.8, 0]);
  const pulse = s >= 68.25 && s < 69.3 ? (s - 68.25) / 1.0 : s >= 70.5 && s < 71.4 ? (s - 70.5) / 0.9 : -1;
  const fire = clampInterp(s, [69.2, 69.35, 70.0], [0, 1, 0.2]) + clampInterp(s, [71.35, 71.45, 71.6], [0, 1, 0.5]);
  const remote = ramp(s, 69.7, 70.2);
  const press = s > 70.45 && s < 70.65 ? 1 : 0;
  return (
    <Shell from={61.3} to={71.6}>
      <Header at={61.5} eyebrow="2005 · Stanford" title="Into nerve cells" sub="light becomes a remote control" color={C.violet} />
      <AbsoluteFill style={{ opacity: intro }}>
        <div style={{ position: "absolute", top: 520, left: 0, right: 0, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 220, letterSpacing: -6, color: C.ink, opacity: 0.95 - 0.8 * ramp(s, 62.8, 63.2) }}>
          {year}
        </div>
        <Pop at={63.0} style={{ ...center, top: 640 }} from={0.5}>
          <div style={{ scale: "1.35", transformOrigin: "top center" }}>
          <PersonCard name="Karl Deisseroth" org="Stanford University · HHMI" initials="KD" tint="#8B6BFF" tag="PSYCHIATRIST & BIOENGINEER" />
          </div>
        </Pop>
        <FadeUp at={64.0} style={{ ...center, top: 1210 }}>
          <Chip color={C.violet}>Deisseroth Lab · Stanford</Chip>
        </FadeUp>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: neuronK }}>
        <div style={{ position: "absolute", left: 130, top: 700 }}>
          <Neuron s={s} pulse={pulse} fire={Math.min(1, fire)} glowSoma={deliver} color={deliver > 0.95 ? C.blue : C.cyan} />
        </div>
        {/* gene capsule flying into the soma */}
        <div
          style={{
            position: "absolute",
            left: 900 - (900 - 290) * deliver,
            top: 520 + (900 - 520) * deliver,
            opacity: deliver < 1 ? 1 : 0,
            scale: String(1 - 0.5 * deliver),
            rotate: "90deg",
          }}
        >
          <DNA s={s} height={150} color={C.blue} />
        </div>
        <FadeUp at={65.3} style={{ left: 600, top: 520 }}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 34, color: C.blue, opacity: 1 - ramp(s, 66.3, 66.8) }}>channelrhodopsin gene →</div>
        </FadeUp>
        {/* remote control */}
        <div style={{ position: "absolute", left: 760, top: 1060 + (1 - remote) * 200, opacity: remote, rotate: "-12deg" }}>
          <div style={{ width: 170, height: 320, borderRadius: 50, background: "linear-gradient(160deg,#2A3B5E,#0D1830)", border: "2px solid rgba(255,255,255,0.15)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40, gap: 26 }}>
            <div style={{ width: 92, height: 92, borderRadius: 99, background: C.blue, boxShadow: `0 0 ${30 + press * 50}px ${C.blue}`, scale: String(1 - press * 0.12) }} />
            <div style={{ width: 60, height: 14, borderRadius: 8, background: "rgba(255,255,255,0.2)" }} />
            <div style={{ width: 60, height: 14, borderRadius: 8, background: "rgba(255,255,255,0.2)" }} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgba(110,170,255,${0.75 * flash}), rgba(61,139,255,${0.35 * flash}) 60%)`, pointerEvents: "none" }} />
    </Shell>
  );
};

/* S8 · In mice — 71.6 → 81.5 */
export const S8Mice: React.FC = () => {
  const s = useSec();
  const panels = window(s, 71.7, 78.0, 0.35);
  const on1 = ramp(s, 72.5, 72.7);
  const on2 = ramp(s, 75.25, 75.45);
  const fear = ramp(s, 74.25, 74.5);
  const moveK = ramp(s, 77.0, 77.8);
  const verdict = window(s, 77.8, 81.5, 0.35);
  const Panel: React.FC<{ top: number; label: string; on: number; children: React.ReactNode; result?: React.ReactNode }> = ({ top, label, on, children, result }) => (
    <Glass style={{ left: 70, top, width: 940, height: 330 }}>
      <div style={{ position: "absolute", left: 36, top: 28, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: C.dim }}>{label}</div>
      <div style={{ position: "absolute", left: 40, top: 130 }}>
        <Toggle on={on} size={170} />
      </div>
      <div style={{ position: "absolute", left: 300, top: 40, width: 4, height: 250, background: `linear-gradient(transparent, ${C.blue}, transparent)`, opacity: on }} />
      <div style={{ position: "absolute", left: 360, top: 90 }}>{children}</div>
      <div style={{ position: "absolute", right: 36, top: 26 }}>{result}</div>
    </Glass>
  );
  return (
    <Shell from={71.6} to={81.5}>
      <Header at={71.8} eyebrow="In mice" title="Flip a switch…" sub="…and watch behaviour change" color={C.violet} />
      <AbsoluteFill style={{ opacity: panels }}>
        <FadeUp at={72.0} style={{ left: 0, top: 0, width: 1080, height: 1920 }}>
          <Panel top={540} label="NEURON SET 1" on={on1} result={fear > 0.01 ? <Chip color={C.red} style={{ opacity: fear }}>😨 Fear: freezes</Chip> : null}>
            <Mouse size={330} s={s} shake={fear} />
          </Panel>
        </FadeUp>
        <FadeUp at={75.1} style={{ left: 0, top: 0, width: 1080, height: 1920 }}>
          <Panel top={910} label="NEURON SET 2" on={on2} result={moveK > 0.01 ? <Chip color={C.green} style={{ opacity: moveK }}>🏃 Movement changes</Chip> : null}>
            <div style={{ translate: `${Math.sin(moveK * 9) * 30 * moveK + moveK * 200}px 0px`, rotate: `${Math.sin(s * 10) * 6 * moveK}deg` }}>
              <Mouse size={330} s={s} />
            </div>
          </Panel>
        </FadeUp>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: verdict }}>
        <div style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 60 }}>
          <div style={{ position: "relative", fontFamily: FONT, fontWeight: 900, fontSize: 120, color: C.dim, letterSpacing: -2, opacity: 0.4 + 0.6 * ramp(s, 78.0, 78.4) }}>
            JUST WATCH
            <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 14, borderRadius: 8, background: C.red, scale: `${ramp(s, 80.0, 80.3)} 1`, transformOrigin: "left center" }} />
          </div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 54, color: C.dim, opacity: ramp(s, 78.3, 78.7) }}>finally, scientists could…</div>
        </div>
        <Stamp at={79.25} text="PROVE CAUSE ✓" color={C.green} rotate={-5} style={{ left: 110, top: 1010 }} />
      </AbsoluteFill>
    </Shell>
  );
};

/* S9 · Reaching patients — 81.5 → 92.1 */
export const S9Patients: React.FC = () => {
  const s = useSec();
  const eyeK = ramp(s, 82.6, 83.2);
  const card = window(s, 84.1, 86.6, 0.3);
  const inject = clampInterp(s, [86.5, 87.25], [0, 1], INOUT);
  const restore = ramp(s, 88.8, 91.0, INOUT);
  const chartBlur = 16 * (1 - restore);
  return (
    <Shell from={81.5} to={92.1}>
      <Header at={81.7} eyebrow="Reaching patients" title="Restoring sight?" sub="an optogenetic eye therapy" color={C.teal} />
      <div style={{ position: "absolute", left: 540 - 300, top: 560, opacity: eyeK, scale: String(0.8 + 0.2 * eyeK) }}>
        <Eye s={s} size={600} beam={ramp(s, 87.2, 87.6) * (0.6 + 0.4 * Math.sin(s * 6))} restore={restore} />
      </div>
      {/* syringe */}
      <div style={{ position: "absolute", left: 860 - 180 * inject, top: 520 + 120 * inject, rotate: "-35deg", opacity: window(s, 86.4, 88.4, 0.25) }}>
        <svg width="220" height="60" viewBox="0 0 220 60">
          <rect x="40" y="16" width="130" height="28" rx="8" fill="rgba(220,240,255,0.85)" />
          <rect x="60" y="20" width={90 * (1 - inject)} height="20" rx="5" fill={C.blue} />
          <rect x="170" y="22" width="40" height="16" rx="4" fill="#9FB4CC" />
          <rect x="0" y="27" width="40" height="6" fill="#C9D9EA" />
        </svg>
      </div>
      {/* FDA card */}
      <div style={{ position: "absolute", left: 90, top: 980, width: 900, opacity: card, translate: `0px ${(1 - ramp(s, 84.1, 84.6)) * 60}px` }}>
        <div style={{ borderRadius: 30, background: "#F4F8FF", padding: "30px 36px", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: "#5A6E8C", letterSpacing: 3 }}>NEWS · SEPTEMBER 2026</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: "#0A1A3A", lineHeight: 1.12, marginTop: 10 }}>
            FDA accepts Nanoscope’s application for MCO-010 (Mogenry)
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 28, color: "#3A4E6C", marginTop: 12 }}>Optogenetic gene therapy · retinitis pigmentosa · one-time eye injection</div>
        </div>
        <Stamp at={84.7} text="ACCEPTED" color={C.green} rotate={-8} style={{ right: 10, top: -140, fontSize: 52, padding: "4px 18px", border: `6px solid ${C.green}` } as React.CSSProperties} />
      </div>
      {/* vision chart sharpening */}
      <FadeUp at={88.0} style={{ ...center, top: 1000 }}>
        <Glass style={{ position: "relative", width: 560, height: 330 } as React.CSSProperties}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 34, filter: `blur(${chartBlur}px)`, fontFamily: FONT, fontWeight: 800, color: C.ink, lineHeight: 1.1 }}>
            <div style={{ fontSize: 110 }}>E</div>
            <div style={{ fontSize: 64, letterSpacing: 16 }}>F P</div>
            <div style={{ fontSize: 42, letterSpacing: 14 }}>T O Z</div>
          </div>
        </Glass>
      </FadeUp>
      <FadeUp at={89.8} style={{ ...center, top: 1350 }}>
        <div style={{ fontFamily: MONO, fontSize: 22, color: C.dim, letterSpacing: 2 }}>UNDER FDA REVIEW · NOT YET APPROVED</div>
      </FadeUp>
    </Shell>
  );
};

/* S10 · Brain disorders — 92.1 → 103.5 */
export const S10Circuits: React.FC = () => {
  const s = useSec();
  const warn = window(s, 92.25, 95.2, 0.3);
  const map = ramp(s, 95.0, 95.6);
  const spots = [
    { x: 40, y: 40, at: 97.5, color: C.amber, label: "Parkinson’s", lx: 700, ly: 820 },
    { x: -210, y: -60, at: 98.5, color: C.violet, label: "Depression", lx: 60, ly: 740 },
    { x: -40, y: 110, at: 99.3, color: C.red, label: "Schizophrenia", lx: 110, ly: 1270 },
  ];
  const target = ramp(s, 101.9, 102.3);
  const pillK = clampInterp(s, [100.25, 101.8], [0, 1], INOUT);
  return (
    <Shell from={92.1} to={103.5}>
      <Header at={95.0} eyebrow="Why it matters" title="Mapping faulty circuits" sub="so medicines hit the right spot" color={C.violet} />
      <AbsoluteFill style={{ opacity: warn, justifyContent: "center", alignItems: "center" }}>
        <Pop at={92.3} style={{ top: 640, ...center }}>
          <div style={{ width: 880, borderRadius: 36, padding: "40px 44px", background: "rgba(255,181,71,0.12)", border: `3px solid ${C.amber}`, boxShadow: `0 0 60px ${C.amber}33`, textAlign: "center" }}>
            <div style={{ fontSize: 90 }}>⚠️</div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.amber, lineHeight: 1.1, marginTop: 10 }}>Not a treatment for brain disorders</div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 54, color: C.ink, marginTop: 14 }}>in people — yet.</div>
          </div>
        </Pop>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: map * (s > 92 ? 1 : 0) }}>
        <div style={{ position: "absolute", left: 90, top: 640 }}>
          <Brain s={s} size={900} base={0.35} spots={spots.map((p) => ({ x: p.x, y: p.y, r: 130, color: p.color, k: ramp(s, p.at, p.at + 0.4) }))} />
        </div>
        {spots.map((p) => (
          <FadeUp key={p.label} at={p.at} style={{ left: p.lx, top: p.ly }} dist={20}>
            <Chip color={p.color}>{p.label}</Chip>
          </FadeUp>
        ))}
        {/* pill → crosshair */}
        <div style={{ position: "absolute", left: 900 - (900 - 548) * pillK, top: 1300 - (1300 - 1024) * pillK, opacity: window(s, 100.2, 102.4, 0.2), rotate: `${pillK * 360}deg` }}>
          <div style={{ width: 90, height: 40, borderRadius: 99, background: `linear-gradient(90deg, ${C.teal} 50%, #F4F8FF 50%)`, boxShadow: `0 0 24px ${C.teal}` }} />
        </div>
        <div style={{ position: "absolute", left: 593 - 90, top: 1044 - 90, width: 180, height: 180, opacity: target, scale: String(1.6 - 0.6 * target), rotate: `${s * 40}deg` }}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="70" fill="none" stroke={C.green} strokeWidth="6" />
            <circle cx="90" cy="90" r="30" fill="none" stroke={C.green} strokeWidth="5" />
            {[0, 90, 180, 270].map((a) => (
              <line key={a} x1="90" y1="4" x2="90" y2="40" stroke={C.green} strokeWidth="6" transform={`rotate(${a} 90 90)`} />
            ))}
          </svg>
        </div>
        <FadeUp at={102.1} style={{ left: 700, top: 1250 }}>
          <Chip color={C.green}>✓ right spot</Chip>
        </FadeUp>
      </AbsoluteFill>
    </Shell>
  );
};

/* S11 · Recap + follow — 103.5 → 114.3 */
export const S11Outro: React.FC = () => {
  const s = useSec();
  const tiles = window(s, 103.6, 108.2, 0.35);
  const pressed = s > 109.4;
  const follow = ramp(s, 108.7, 109.2);
  return (
    <Shell from={103.5} to={114.3}>
      {s < 108.2 ? <Header at={103.7} eyebrow="Recap" title="Light rewired neuroscience" color={C.gold} /> : null}
      <AbsoluteFill style={{ opacity: tiles }}>
        <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 28 }}>
          {[
            { n: "3", l: "scientists", at: 103.75, c: C.gold },
            { n: "1", l: "tiny alga", at: 104.75, c: C.green },
            { n: "∞", l: "brain insights", at: 105.75, c: C.cyan },
          ].map((t) => (
            <Pop key={t.l} at={t.at} style={{ position: "relative" }}>
              <div style={{ width: 300, height: 300, borderRadius: 40, background: "linear-gradient(170deg, rgba(30,56,108,0.75), rgba(10,20,46,0.85))", border: `2px solid ${t.c}66`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 50px ${t.c}22` }}>
                <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: t.c, lineHeight: 1 }}>{t.n}</div>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: C.ink, marginTop: 6 }}>{t.l}</div>
              </div>
            </Pop>
          ))}
        </div>
        <div style={{ position: "absolute", left: 190, top: 880, opacity: ramp(s, 106.8, 107.3) }}>
          <Brain s={s} size={700} base={0.4 + 0.6 * ramp(s, 107.0, 107.8)} color={C.gold} spots={[{ x: -300 + 700 * ramp(s, 107.0, 108.0), y: 0, r: 200, color: C.gold, k: 1 }]} />
        </div>
      </AbsoluteFill>

      {/* Follow CTA (Clara is centred above, in the main layer) */}
      <div style={{ position: "absolute", top: 1180, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: follow, translate: `0px ${(1 - follow) * 60}px` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 84, height: 84, borderRadius: 24, background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "white" }}>DP</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, color: C.ink }}>Dr Pharmacist</div>
        </div>
        <div
          style={{
            padding: "22px 70px",
            borderRadius: 999,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 48,
            color: pressed ? C.teal : "#03142A",
            background: pressed ? "transparent" : `linear-gradient(135deg, ${C.cyan}, ${C.teal})`,
            border: `3px solid ${C.teal}`,
            scale: String(s > 109.25 && s < 109.45 ? 0.92 : 1),
            boxShadow: pressed ? "none" : `0 0 40px ${C.teal}88`,
          }}
        >
          {pressed ? "✓ Following" : "Follow"}
        </div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 44, color: C.cyan, opacity: ramp(s, 111.0, 111.5) }}>science, made simple.</div>
      </div>
      {/* heart burst on follow */}
      {pressed
        ? new Array(10).fill(0).map((_, i) => {
            const k = ramp(s, 109.4, 110.6);
            const a = (i / 10) * Math.PI * 2;
            return (
              <div key={i} style={{ position: "absolute", left: 540 + Math.cos(a) * 260 * k - 20, top: 1330 + Math.sin(a) * 140 * k - 20, fontSize: 40, opacity: 1 - k, color: i % 2 ? C.red : C.cyan }}>
                ♥
              </div>
            );
          })
        : null}
    </Shell>
  );
};
