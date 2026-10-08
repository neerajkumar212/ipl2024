import React from "react";
import { AbsoluteFill, Img, random, staticFile } from "remotion";
import { Alga, Brain, DNA, Eye, Flame, Helmet, Membrane, Mouse, Neuron, Toggle } from "../components/art";
import { clampInterp, EXPO, INOUT, ramp, useSec, window } from "../lib/anim";
import { C, FONT, MONO, SERIF } from "../theme";
import { Beam, Burst, center, Cite, Flash, Kinetic, Portrait, shake, Title } from "./kit";
import { seg, w } from "./timing";

const glass: React.CSSProperties = {
  position: "absolute",
  borderRadius: 40,
  background: "linear-gradient(160deg, rgba(24,48,96,0.66), rgba(8,18,42,0.78))",
  border: "1.5px solid rgba(120,200,255,0.22)",
  boxShadow: "0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
  overflow: "hidden",
};

/* F · Watching isn't proving + firefighters */
export const SProving: React.FC = () => {
  const s = useSec();
  const tW = w("proving", "watching");
  const tP = w("proving", "proving.");
  const big = window(s, tW - 0.1, seg("fire").start + 0.1, 0.25);
  const cards = ramp(s, seg("fire").start, seg("fire").start + 0.4);
  const tFire = w("fire", "fire.");
  const tStarted = w("fire", "started");
  const arrow = ramp(s, w("fire", "mean"), w("fire", "mean") + 0.5);
  const cross = ramp(s, tStarted + 0.1, tStarted + 0.3);
  return (
    <AbsoluteFill style={{ translate: shake(s, tP, 16) }}>
      <AbsoluteFill style={{ opacity: big, justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "absolute", top: 640, left: 0, right: 0 }}>
          <Kinetic at={tW} text="WATCHING" size={150} color="white" />
          <div style={{ display: "flex", justifyContent: "center", opacity: ramp(s, w("proving", "isn't"), w("proving", "isn't") + 0.15) }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 170, color: C.red, lineHeight: 1, scale: String(1.8 - 0.8 * ramp(s, w("proving", "isn't"), w("proving", "isn't") + 0.25)), textShadow: `0 0 40px ${C.red}` }}>≠</div>
          </div>
          <Kinetic at={tP} text="PROVING" size={150} color={C.cyan} glow="rgba(91,231,255,0.6)" />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: cards }}>
        <Title at={seg("fire").start} eyebrow="An analogy" title="Firefighters & fires" sub="always together. one doesn't cause the other" color={C.amber} />
        <div style={{ ...glass, left: 70, top: 560, width: 440, height: 520, opacity: ramp(s, seg("fire").start, seg("fire").start + 0.5), translate: `${(1 - ramp(s, seg("fire").start, seg("fire").start + 0.6)) * -200}px 0px` }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 80, gap: 36 }}>
            <Helmet size={270} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: "white" }}>Firefighters</div>
          </div>
        </div>
        <div style={{ ...glass, left: 570, top: 560, width: 440, height: 520, border: "1.5px solid rgba(255,140,80,0.5)", opacity: ramp(s, tFire - 0.2, tFire + 0.3), translate: `${(1 - ramp(s, tFire - 0.2, tFire + 0.4)) * 200}px 0px` }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 45%, rgba(255,120,40,${0.25 + 0.1 * Math.sin(s * 9)}), transparent 60%)` }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 50, gap: 24 }}>
            <Flame s={s} size={280} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: "white" }}>Fire</div>
          </div>
        </div>
        <svg width={1080} height={300} style={{ position: "absolute", left: 0, top: 1110, opacity: arrow }}>
          <text x={540} y={46} textAnchor="middle" fill={C.amber} fontFamily={MONO} fontWeight={700} fontSize={30} letterSpacing={4}>STARTED IT?</text>
          <line x1={300} y1={110} x2={300 + 480 * arrow} y2={110} stroke="white" strokeWidth={9} strokeLinecap="round" />
          <path d="M748,82 L790,110 L748,138" stroke="white" strokeWidth={9} fill="none" strokeLinecap="round" opacity={arrow} />
          <line x1={470} y1={190} x2={470 + 140 * cross} y2={190 - 160 * cross} stroke={C.red} strokeWidth={16} strokeLinecap="round" />
          <line x1={610} y1={190} x2={610 - 140 * cross} y2={190 - 160 * cross} stroke={C.red} strokeWidth={16} strokeLinecap="round" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* G · Pond scum → Chlamydomonas */
export const SPond: React.FC = () => {
  const s = useSec();
  const tPond = w("pond", "Pond");
  const open = clampInterp(s, [tPond - 0.15, tPond + 0.45], [0, 1], EXPO);
  const zoom = ramp(s, seg("alga").start, seg("alga").start + 1.2, INOUT);
  const tSwim = w("alga", "swims");
  const swim = ramp(s, tSwim, tSwim + 2.2, INOUT);
  const tProt = w("alga", "light-sensing");
  const prot = ramp(s, tProt, tProt + 0.6);
  const cells = new Array(16).fill(0).map((_, i) => ({ x: 140 + random(`px${i}`) * 540, y: 140 + random(`py${i}`) * 540, sz: 70 + random(`ps${i}`) * 70, ph: random(`pp${i}`) * 6 }));
  return (
    <AbsoluteFill style={{ translate: shake(s, tPond, 14) }}>
      <Title at={seg("unexpected").start} eyebrow="The breakthrough" title={s < tPond ? "The last place you'd expect" : "Pond scum."} sub={s > seg("alga").start ? "a single-celled green alga" : undefined} color={C.green} />
      {/* microscope lens */}
      <div style={{ position: "absolute", left: 540 - 410, top: 540, width: 820, height: 820, borderRadius: 999, overflow: "hidden", border: "16px solid #16243E", boxShadow: `0 0 0 4px ${C.green}55, 0 40px 120px rgba(0,0,0,0.65), inset 0 0 140px rgba(0,0,0,0.75)`, background: "radial-gradient(circle at 40% 35%, #1E5A3A, #071A10 72%)", opacity: 1 - zoom }}>
        <div style={{ position: "absolute", inset: 0, filter: `blur(${(1 - open) * 22}px)` }}>
          {cells.map((c, i) => (
            <div key={i} style={{ position: "absolute", left: c.x - c.sz / 2 + Math.sin(s + c.ph) * 22, top: c.y - c.sz / 2 + Math.cos(s * 0.8 + c.ph) * 22, rotate: `${c.ph * 40 + s * 12}deg` }}>
              <Alga s={s + c.ph} size={c.sz} />
            </div>
          ))}
        </div>
        {/* iris blades closing the view until "Pond scum" */}
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle, transparent ${open * 72}%, #050A14 ${open * 72 + 1}%)` }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", fontFamily: FONT, fontWeight: 900, fontSize: 240, color: "white", opacity: (1 - open) * (0.5 + 0.3 * Math.sin(s * 5)) }}>?</div>
        {/* crosshair reticle */}
        <svg width={788} height={788} style={{ position: "absolute", left: 0, top: 0, opacity: 0.35 }}>
          <line x1={394} y1={0} x2={394} y2={788} stroke={C.green} strokeWidth={1.5} />
          <line x1={0} y1={394} x2={788} y2={394} stroke={C.green} strokeWidth={1.5} />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <line key={i} x1={394 - 8} y1={94 + i * 60} x2={394 + 8} y2={94 + i * 60} stroke={C.green} strokeWidth={1.5} />
          ))}
        </svg>
      </div>
      <div style={{ position: "absolute", top: 1230, ...center, opacity: window(s, tPond, seg("alga").start + 0.6, 0.15), scale: String(2 - ramp(s, tPond, tPond + 0.2)), rotate: "-5deg" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, letterSpacing: 3, color: C.green, border: `8px solid ${C.green}`, borderRadius: 22, padding: "4px 30px", textShadow: `0 0 30px ${C.green}88`, boxShadow: `0 0 50px ${C.green}44` }}>POND SCUM!</div>
      </div>
      {/* zoomed alga swimming toward light */}
      <AbsoluteFill style={{ opacity: zoom }}>
        <div style={{ position: "absolute", right: -200, top: 380, width: 760, height: 760, borderRadius: 999, background: `radial-gradient(circle, rgba(255,240,180,${0.55 + 0.2 * Math.sin(s * 3)}), transparent 65%)` }} />
        <div style={{ position: "absolute", left: 120 + 380 * swim, top: 980 - 300 * swim, rotate: "38deg", scale: String(0.6 + 0.4 * zoom) }}>
          <Alga s={s} size={480} protein={prot} />
        </div>
        <div style={{ position: "absolute", left: 80, top: 560, opacity: ramp(s, w("alga", "Chlamydomonas"), w("alga", "Chlamydomonas") + 0.5) }}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 54, color: C.green }}>Chlamydomonas</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 54, color: C.green, opacity: 0.7, marginTop: -6 }}>reinhardtii</div>
        </div>
        <div style={{ position: "absolute", left: 80, top: 1240, opacity: ramp(s, tProt, tProt + 0.4), display: "flex", gap: 14, alignItems: "center", fontFamily: FONT, fontWeight: 700, fontSize: 34, color: C.blue, padding: "12px 24px", borderRadius: 999, border: `1.5px solid ${C.blue}88`, background: `${C.blue}22` }}>
          ● light-sensing protein in the eyespot
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* H · Hegemann & Nagel find channelrhodopsin */
export const SFound: React.FC = () => {
  const s = useSec();
  const tC = w("found", "channelrhodopsin.");
  const line = ramp(s, seg("found").start, w("found", "Peter"), INOUT);
  const named = ramp(s, tC, tC + 0.5);
  return (
    <AbsoluteFill>
      <Title at={seg("found").start} eyebrow="Early 2000s · Germany" title="The discovery" color={C.green} out={tC + 0.1} />
      {/* timeline */}
      <div style={{ position: "absolute", left: 120, top: 470, width: 840, opacity: 1 - named }}>
        <div style={{ height: 4, width: 840 * line, background: `linear-gradient(90deg, ${C.green}, ${C.cyan})`, borderRadius: 4 }} />
        {["2002", "2003"].map((y, i) => (
          <div key={y} style={{ position: "absolute", left: 200 + i * 440, top: -16, opacity: ramp(s, seg("found").start + 0.3 + i * 0.3, seg("found").start + 0.7 + i * 0.3) }}>
            <div style={{ width: 36, height: 36, borderRadius: 99, background: C.green, boxShadow: `0 0 20px ${C.green}` }} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: "white", marginTop: 8, marginLeft: -20 }}>{y}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 46, opacity: 1 - 0.85 * named, scale: String(1 - 0.25 * named), translate: `0px ${-60 * named}px` }}>
        <Portrait at={w("found", "Peter")} file="laureates/hegemann.png" name="Peter Hegemann" org="Humboldt University Berlin" from="left" size={400} />
        <Portrait at={w("found", "Georg")} file="laureates/nagel.png" name="Georg Nagel" org="University of Würzburg" from="right" size={400} />
      </div>
      <AbsoluteFill style={{ opacity: named }}>
        <div style={{ position: "absolute", top: 820, left: 0, right: 0 }}>
          <Kinetic at={tC} text="CHANNEL" size={128} color={C.blue} glow="rgba(61,139,255,0.7)" stagger={0.025} />
          <Kinetic at={tC + 0.15} text="RHODOPSIN" size={128} color="white" stagger={0.025} style={{ marginTop: -18 }} />
        </div>
        <Burst at={tC + 0.1} x={540} y={960} color={C.blue} dist={520} n={40} />
      </AbsoluteFill>
      <Cite at={w("found", "Georg") + 0.4}>Nagel et al., Science 2002 · PNAS 2003</Cite>
      <Cite at={w("found", "Georg") + 0.4} top={1385}>Ill. Niklas Elmehed © Nobel Prize Outreach</Cite>
    </AbsoluteFill>
  );
};

/* I · The light-gated door */
export const SGate: React.FC = () => {
  const s = useSec();
  const tBlue = w("gate", "Blue");
  const open = ramp(s, w("gate", "opens,"), w("gate", "opens,") + 0.35);
  const flow = clampInterp(s, [w("gate", "charged"), w("gate", "in,") + 0.4], [0, 1]);
  const tFires = w("gate", "fires.");
  const spike = ramp(s, tFires, tFires + 0.6);
  return (
    <AbsoluteFill style={{ translate: shake(s, tFires, 14) }}>
      <Title at={seg("gate").start} eyebrow="How it works" title="A gate that opens to light" sub="channelrhodopsin in the cell membrane" color={C.blue} />
      <div style={{ position: "absolute", left: 90, top: 560 }}>
        <Membrane s={s} open={open} beam={ramp(s, tBlue, tBlue + 0.3)} flow={flow} />
      </div>
      <div style={{ position: "absolute", left: 120, top: 480, display: "flex", gap: 16, opacity: ramp(s, tBlue, tBlue + 0.3) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: C.blue, padding: "10px 20px", borderRadius: 999, border: `1.5px solid ${C.blue}`, background: `${C.blue}22` }}>BLUE LIGHT 470 nm</div>
      </div>
      <div style={{ position: "absolute", right: 90, top: 480, opacity: ramp(s, w("gate", "gate"), w("gate", "gate") + 0.3) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, color: open > 0.5 ? C.green : C.dim, padding: "10px 20px", borderRadius: 999, border: `1.5px solid ${open > 0.5 ? C.green : C.dim}`, background: open > 0.5 ? `${C.green}22` : "transparent" }}>
          GATE: {open > 0.5 ? "OPEN" : "CLOSED"}
        </div>
      </div>
      <svg width={900} height={220} style={{ position: "absolute", left: 90, top: 1150, overflow: "visible" }}>
        <polyline points="0,160 400,160 420,160 445,20 475,200 500,150 520,160 900,160" fill="none" stroke={C.gold} strokeWidth={7} strokeLinejoin="round" strokeDasharray={1300} strokeDashoffset={1300 - 1300 * spike} style={{ filter: `drop-shadow(0 0 12px ${C.gold})` }} />
        <text x={540} y={60} fill={C.gold} fontFamily={FONT} fontWeight={900} fontSize={56} opacity={ramp(s, tFires + 0.2, tFires + 0.4)}>FIRES!</text>
      </svg>
      <Flash at={tFires + 0.1} color="244,199,106" peak={0.35} dur={0.4} />
    </AbsoluteFill>
  );
};

/* J · 2005, Stanford: Deisseroth → remote control */
export const SStanford: React.FC = () => {
  const s = useSec();
  const tY = w("stanford", "2005,");
  const year = Math.round(clampInterp(s, [tY - 0.1, tY + 0.8], [1995, 2005], EXPO));
  const tKarl = w("stanford", "Karl");
  const tPut = w("stanford", "put");
  const intro = window(s, seg("stanford").start - 0.2, tPut + 0.3, 0.3);
  const deliver = clampInterp(s, [tPut, w("stanford", "neurons.") + 0.3], [0, 1], INOUT);
  const neuronK = ramp(s, tPut - 0.2, tPut + 0.3);
  const tFlash = w("flash", "flash");
  const tFired = w("flash", "fired,");
  const pulse = s >= tFlash + 0.1 && s < tFired + 0.1 ? (s - tFlash - 0.1) / (tFired - tFlash) : s >= w("remote", "control") && s < w("remote", "control") + 0.7 ? (s - w("remote", "control")) / 0.7 : -1;
  const fire = clampInterp(s, [tFired, tFired + 0.1, tFired + 0.8], [0, 1, 0.2]) + clampInterp(s, [w("remote", "control") + 0.7, w("remote", "control") + 0.8, w("remote", "brain.") + 0.6], [0, 1, 0.3]);
  const tMs = w("flash", "milliseconds.");
  const ms = clampInterp(s, [tMs, tMs + 0.6], [0, 1]);
  const remote = ramp(s, w("remote", "remote"), w("remote", "remote") + 0.5);
  const press = s > w("remote", "control") - 0.05 && s < w("remote", "control") + 0.2 ? 1 : 0;
  return (
    <AbsoluteFill style={{ translate: shake(s, tFlash, 20) }}>
      <Title at={seg("stanford").start} eyebrow="2005 · Stanford University" title="Into nerve cells" sub="light becomes a remote control" color={C.violet} />
      <AbsoluteFill style={{ opacity: intro }}>
        <div style={{ position: "absolute", top: 470, ...center }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 250, letterSpacing: -8, color: "white", opacity: 0.95 - 0.8 * ramp(s, tKarl - 0.2, tKarl + 0.2), textShadow: "0 0 60px rgba(139,123,255,0.5)" }}>{year}</div>
        </div>
        <div style={{ position: "absolute", top: 560, ...center }}>
          <Portrait at={tKarl} file="laureates/deisseroth.png" name="Karl Deisseroth" org="Stanford University · HHMI" size={430} tag="PSYCHIATRIST & BIOENGINEER" />
        </div>
        <Cite at={tKarl + 0.5}>Boyden, Zhang, Bamberg, Nagel & Deisseroth, Nat Neurosci 2005</Cite>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: neuronK }}>
        <div style={{ position: "absolute", left: 130, top: 760 }}>
          <Neuron s={s} pulse={pulse} fire={Math.min(1, fire)} glowSoma={deliver} color={deliver > 0.95 ? C.blue : C.cyan} />
        </div>
        <div style={{ position: "absolute", left: 900 - (900 - 290) * deliver, top: 520 + (960 - 520) * deliver, opacity: deliver < 1 ? 1 : 0, scale: String(1 - 0.5 * deliver), rotate: "90deg" }}>
          <DNA s={s} height={150} color={C.blue} />
        </div>
        <div style={{ position: "absolute", left: 560, top: 560, fontFamily: SERIF, fontStyle: "italic", fontSize: 36, color: C.blue, opacity: window(s, tPut, tFlash, 0.3) }}>channelrhodopsin gene →</div>
        <Beam x={345} y0={470} y1={960} k={clampInterp(s, [tFlash - 0.05, tFlash, tFlash + 0.8], [0, 1, 0])} w={260} />
        <Burst at={tFired} x={980} y={960} color={C.gold} dist={260} />
        <div style={{ position: "absolute", top: 1170, left: 110, opacity: ms }}>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 64, color: C.gold }}>
            Δt = {(0.001 + 0.004 * (1 - ms)).toFixed(3)} s
          </div>
        </div>
        <div style={{ position: "absolute", left: 770, top: 1080 + (1 - remote) * 260, opacity: remote, rotate: "-14deg" }}>
          <div style={{ width: 170, height: 320, borderRadius: 50, background: "linear-gradient(160deg,#2A3B5E,#0D1830)", border: "2px solid rgba(255,255,255,0.15)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40, gap: 26 }}>
            <div style={{ width: 92, height: 92, borderRadius: 99, background: C.blue, boxShadow: `0 0 ${30 + press * 60}px ${C.blue}`, scale: String(1 - press * 0.12) }} />
            <div style={{ width: 60, height: 14, borderRadius: 8, background: "rgba(255,255,255,0.2)" }} />
            <div style={{ width: 60, height: 14, borderRadius: 8, background: "rgba(255,255,255,0.2)" }} />
          </div>
        </div>
      </AbsoluteFill>
      <Flash at={tFlash} />
    </AbsoluteFill>
  );
};

/* K · Mice: fear & movement → cause, not correlation */
export const SMice: React.FC = () => {
  const s = useSec();
  const on1 = ramp(s, w("mice", "flipping"), w("mice", "flipping") + 0.2);
  const fear = ramp(s, w("mice", "fear."), w("mice", "fear.") + 0.3);
  const on2 = ramp(s, w("mice", "Another"), w("mice", "Another") + 0.2);
  const move = ramp(s, w("mice", "move."), w("mice", "move.") + 0.9);
  const panels = window(s, seg("mice").start - 0.2, seg("cause").start + 0.3, 0.3);
  const tCause = w("cause", "cause,");
  const tCorr = w("cause", "correlation.");
  const Panel: React.FC<{ top: number; label: string; on: number; res: React.ReactNode; children: React.ReactNode }> = ({ top, label, on, res, children }) => (
    <div style={{ ...glass, left: 70, top, width: 940, height: 340 }}>
      <div style={{ position: "absolute", left: 36, top: 28, fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: C.dim }}>{label}</div>
      <div style={{ position: "absolute", left: 40, top: 140 }}>
        <Toggle on={on} size={170} />
      </div>
      <div style={{ position: "absolute", left: 300, top: 40, width: 4, height: 260, background: `linear-gradient(transparent, ${C.blue}, transparent)`, opacity: on }} />
      <div style={{ position: "absolute", left: 360, top: 100 }}>{children}</div>
      <div style={{ position: "absolute", right: 30, top: 24 }}>{res}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Title at={seg("mice").start} eyebrow="In mice" title="Flip a circuit…" sub="…and behaviour changes instantly" color={C.violet} out={seg("cause").start + 0.2} />
      <AbsoluteFill style={{ opacity: panels }}>
        <Panel top={540} label="CIRCUIT 1 · AMYGDALA" on={on1} res={<div style={{ opacity: fear, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.red, padding: "8px 20px", borderRadius: 999, background: `${C.red}22`, border: `1.5px solid ${C.red}` }}>FEAR · freezes</div>}>
          <Mouse size={340} s={s} shake={fear} />
        </Panel>
        <Panel top={920} label="CIRCUIT 2 · MOTOR" on={on2} res={<div style={{ opacity: move, fontFamily: FONT, fontWeight: 800, fontSize: 34, color: C.green, padding: "8px 20px", borderRadius: 999, background: `${C.green}22`, border: `1.5px solid ${C.green}` }}>MOVEMENT · changes</div>}>
          <div style={{ translate: `${move * 230}px 0px`, rotate: `${Math.sin(s * 12) * 7 * move}deg` }}>
            <Mouse size={340} s={s} />
          </div>
        </Panel>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: ramp(s, seg("cause").start, seg("cause").start + 0.4) }}>
        <Title at={seg("cause").start} eyebrow="For the first time" title="Cause, not correlation" color={C.green} />
        <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 70 }}>
          <div style={{ position: "relative", fontFamily: FONT, fontWeight: 900, fontSize: 112, color: C.dim, letterSpacing: -2, opacity: ramp(s, seg("cause").start + 0.2, seg("cause").start + 0.6) }}>
            CORRELATION
            <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 14, borderRadius: 8, background: C.red, scale: `${ramp(s, tCorr, tCorr + 0.3)} 1`, transformOrigin: "left center" }} />
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: C.green, letterSpacing: -2, opacity: ramp(s, tCause, tCause + 0.12), scale: String(1.9 - 0.9 * ramp(s, tCause, tCause + 0.2)), rotate: "-4deg", border: `9px solid ${C.green}`, borderRadius: 28, padding: "0 36px", textShadow: `0 0 40px ${C.green}88` }}>
            CAUSE ✓
          </div>
        </div>
        <Cite at={tCause + 0.4}>e.g. Liu et al., Nature 2012 · Kravitz et al., Nature 2010</Cite>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* L · Reaching patients: 2021 vision case + FDA BLA (Sept 2026) */
export const SPatients: React.FC = () => {
  const s = useSec();
  const tPat = w("patients", "patients.");
  const t21 = w("sahel", "2021,");
  const tFda = w("fda", "FDA");
  const tRP = w("fda", "retinitis");
  const eye = ramp(s, seg("patients").start, tPat + 0.4);
  const card21 = window(s, t21 - 0.1, seg("fda").start + 0.3, 0.3);
  const fda = ramp(s, tFda - 0.3, tFda + 0.3);
  const tunnel = clampInterp(s, [tRP, tRP + 0.6, seg("fda").end + 0.2], [0, 1, 0.2]);
  return (
    <AbsoluteFill>
      <Title at={seg("patients").start} eyebrow="From lab to clinic" title="Reaching patients" sub="optogenetic therapy for blindness" color={C.teal} />
      <div style={{ position: "absolute", left: 540 - 320, top: 520, opacity: eye, scale: String(0.8 + 0.2 * eye) }}>
        <Eye s={s} size={640} beam={ramp(s, t21, t21 + 0.5) * (0.6 + 0.4 * Math.sin(s * 6))} restore={ramp(s, w("sahel", "regained"), w("sahel", "regained") + 1)} />
      </div>
      {/* 2021 case */}
      <div style={{ ...glass, left: 90, top: 940, width: 900, height: 330, opacity: card21, translate: `0px ${(1 - ramp(s, t21, t21 + 0.5)) * 80}px` }}>
        <div style={{ position: "absolute", left: 36, top: 30, fontFamily: FONT, fontWeight: 900, fontSize: 96, color: C.teal, lineHeight: 1 }}>2021</div>
        <div style={{ position: "absolute", left: 300, top: 36, right: 30, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "white", lineHeight: 1.15 }}>
          A blind man partly regained sight with optogenetics
        </div>
        <div style={{ position: "absolute", left: 300, top: 190, right: 30, fontFamily: FONT, fontWeight: 500, fontSize: 28, color: C.dim }}>
          Light-sensitive protein in retinal cells + special goggles → he could locate and count objects
        </div>
      </div>
      <Cite at={t21 + 0.6} top={1300} until={seg("fda").start}>Sahel et al., Nature Medicine 2021</Cite>
      {/* FDA news card */}
      <div style={{ position: "absolute", left: 90, top: 940, width: 900, opacity: fda, translate: `0px ${(1 - fda) * 80}px` }}>
        <div style={{ borderRadius: 30, background: "#F4F8FF", padding: "30px 36px", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, color: "#5A6E8C", letterSpacing: 3 }}>NEWS · SEPTEMBER 2026</div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 20, color: "#B26B00", background: "#FFF1D6", border: "1.5px solid #E8A33D", padding: "6px 14px", borderRadius: 999 }}>UNDER FDA REVIEW</div>
          </div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 46, color: "#0A1A3A", lineHeight: 1.12, marginTop: 14 }}>FDA accepts application for MCO-010 (Mogenry)</div>
          <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 29, color: "#3A4E6C", marginTop: 12 }}>Optogenetic gene therapy · one eye injection · retinitis pigmentosa</div>
        </div>
      </div>
      {/* tunnel-vision vignette for RP */}
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 38%, transparent ${70 - 40 * tunnel}%, rgba(1,4,12,${0.92 * tunnel}) ${78 - 30 * tunnel}%)`, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 1300, ...center, opacity: ramp(s, tRP, tRP + 0.4) }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: C.dim }}>retinitis pigmentosa: vision narrows to a tunnel</div>
      </div>
    </AbsoluteFill>
  );
};

/* M · Not yet — but mapping faulty circuits */
export const SFuture: React.FC = () => {
  const s = useSec();
  const warn = window(s, seg("notyet").start - 0.2, seg("map").start + 0.3, 0.3);
  const map = ramp(s, seg("map").start, seg("map").start + 0.6);
  const spots = [
    { x: 40, y: 40, at: w("map", "Parkinson's,"), color: C.amber, label: "Parkinson's", lx: 690, ly: 820 },
    { x: -210, y: -60, at: w("map", "depression"), color: C.violet, label: "Depression", lx: 60, ly: 740 },
    { x: -60, y: 100, at: w("map", "addiction,"), color: C.red, label: "Addiction", lx: 120, ly: 1250 },
  ];
  const tMed = w("map", "medicines");
  const tTarget = w("map", "target.");
  const pill = clampInterp(s, [tMed, tTarget], [0, 1], INOUT);
  const lock = ramp(s, tTarget - 0.05, tTarget + 0.3);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: warn }}>
        <div style={{ position: "absolute", top: 640, ...center }}>
          <div style={{ width: 900, borderRadius: 40, padding: "46px 44px", background: "rgba(255,181,71,0.12)", border: `3px solid ${C.amber}`, boxShadow: `0 0 70px ${C.amber}33`, textAlign: "center", scale: String(0.9 + 0.1 * ramp(s, seg("notyet").start, seg("notyet").start + 0.4)) }}>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 6, color: C.amber }}>REALITY CHECK</div>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: "white", lineHeight: 1.08, marginTop: 14 }}>Not a treatment for brain disorders</div>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 58, color: C.amber, marginTop: 10 }}>in people — yet.</div>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: map }}>
        <Title at={seg("map").start} eyebrow="Why it matters" title="Mapping faulty circuits" sub="so medicines can hit the right target" color={C.violet} />
        <div style={{ position: "absolute", left: 90, top: 640 }}>
          <Brain s={s} size={900} base={0.35} spots={spots.map((p) => ({ x: p.x, y: p.y, r: 130, color: p.color, k: ramp(s, p.at, p.at + 0.4) }))} />
        </div>
        {spots.map((p) => (
          <div key={p.label} style={{ position: "absolute", left: p.lx, top: p.ly, opacity: ramp(s, p.at, p.at + 0.3), translate: `0px ${(1 - ramp(s, p.at, p.at + 0.4)) * 20}px`, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: p.color, padding: "10px 22px", borderRadius: 999, border: `1.5px solid ${p.color}`, background: `${p.color}22` }}>
            {p.label}
          </div>
        ))}
        <div style={{ position: "absolute", left: 940 - (940 - 548) * pill, top: 1360 - (1360 - 1024) * pill, opacity: window(s, tMed - 0.1, tTarget + 0.4, 0.2), rotate: `${pill * 360}deg` }}>
          <div style={{ width: 100, height: 44, borderRadius: 99, background: `linear-gradient(90deg, ${C.teal} 50%, #F4F8FF 50%)`, boxShadow: `0 0 26px ${C.teal}` }} />
        </div>
        <div style={{ position: "absolute", left: 593 - 100, top: 1044 - 100, width: 200, height: 200, opacity: lock, scale: String(1.7 - 0.7 * lock), rotate: `${s * 40}deg` }}>
          <svg width={200} height={200} viewBox="0 0 200 200">
            <circle cx={100} cy={100} r={80} fill="none" stroke={C.green} strokeWidth={6} />
            <circle cx={100} cy={100} r={34} fill="none" stroke={C.green} strokeWidth={5} />
            {[0, 90, 180, 270].map((a) => (
              <line key={a} x1={100} y1={6} x2={100} y2={46} stroke={C.green} strokeWidth={6} transform={`rotate(${a} 100 100)`} />
            ))}
          </svg>
        </div>
        <Burst at={tTarget + 0.15} x={593} y={1044} color={C.green} dist={220} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* N · Recap + logo sting + follow */
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
  const tile = (n: string, l: string, at: number, c: string, icon?: React.ReactNode) => (
    <div style={{ width: 300, height: 320, borderRadius: 40, background: "linear-gradient(170deg, rgba(30,56,108,0.75), rgba(10,20,46,0.85))", border: `2px solid ${c}66`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: `0 0 60px ${c}22`, opacity: ramp(s, at, at + 0.3), scale: String(0.6 + 0.4 * clampInterp(s, [at, at + 0.4], [0, 1], EXPO)) }}>
      {icon ?? <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 160, color: c, lineHeight: 1 }}>{n}</div>}
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 34, color: "white", marginTop: 10 }}>{l}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: tiles }}>
        <Title at={seg("recap").start} eyebrow="In one line" title="Light rewired neuroscience" color={C.gold} />
        <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 28 }}>
          {tile("3", "scientists", w("recap", "Three"), C.gold)}
          {tile("1", "tiny alga", w("recap", "One"), C.green)}
          {tile("", "light switch", w("recap", "light"), C.cyan, <div style={{ marginBottom: 20 }}><Toggle on={ramp(s, w("recap", "switch"), w("recap", "switch") + 0.2)} size={190} color={C.cyan} /></div>)}
        </div>
        <div style={{ position: "absolute", left: 240, top: 1010, opacity: ramp(s, w("recap", "brain."), w("recap", "brain.") + 0.5) }}>
          <Brain s={s} size={600} base={0.9} color={C.cyan} spots={[{ x: 0, y: 0, r: 400, color: C.cyan, k: ramp(s, w("recap", "brain."), w("recap", "brain.") + 0.6) }]} />
        </div>
      </AbsoluteFill>
      {/* logo sting (Clara stands above it in the host layer) */}
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
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 46, color: C.cyan }}>science, made simple.</div>
        </div>
        <Burst at={tFollow + 1.3} x={540} y={1490} color={C.teal} dist={300} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
