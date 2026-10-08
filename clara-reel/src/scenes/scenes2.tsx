import React from "react";
import { AbsoluteFill, random } from "remotion";
import { Alga, Brain, Flame, Helmet, Membrane, Mouse } from "../components/art";
import { Chip, FadeUp, Glass, Header, PersonCard, Pop, Shell, Stamp } from "../components/ui";
import { clampInterp, ramp, useSec, window } from "../lib/anim";
import { C, FONT, MONO, SERIF } from "../theme";

const center: React.CSSProperties = { left: 0, right: 0, display: "flex", justifyContent: "center" };

/* S4a · We could only watch — 24.1 → 29.1 */
export const S4Watch: React.FC = () => {
  const s = useSec();
  const scan = window(s, 24.2, 28.0, 0.35);
  const spots = [
    { x: -150, y: -60, at: 25.8, color: C.amber },
    { x: 120, y: -120, at: 26.3, color: C.red },
    { x: 40, y: 60, at: 26.9, color: C.amber },
    { x: 200, y: 140, at: 27.3, color: C.red },
  ].map((p) => ({ x: p.x, y: p.y, r: 120, color: p.color, k: ramp(s, p.at, p.at + 0.4) * (0.75 + 0.25 * Math.sin(s * 5 + p.x)) }));
  const catchK = window(s, 27.7, 29.4, 0.2);
  const shake = s > 28.5 && s < 28.75 ? Math.sin(s * 120) * 14 : 0;
  return (
    <Shell from={24.1} to={29.4}>
      <Header at={24.3} eyebrow="For years" title="We could only watch" sub="which brain areas lit up" />
      <AbsoluteFill style={{ opacity: scan }}>
        <Glass style={{ left: 70, top: 540, width: 940, height: 820 }}>
          <div style={{ position: "absolute", left: 30, top: 26, display: "flex", gap: 14, alignItems: "center" }}>
            <div style={{ width: 18, height: 18, borderRadius: 99, background: C.red, opacity: Math.sin(s * 8) > 0 ? 1 : 0.2 }} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: C.ink }}>BRAIN SCAN · OBSERVE ONLY</span>
          </div>
          <div style={{ position: "absolute", left: 20, top: 100 }}>
            <Brain s={s} size={900} base={0.3} spots={spots} color="#7FA6D9" />
          </div>
          {/* scanning line */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 120 + ((s * 300) % 680), height: 3, background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`, opacity: 0.7 }} />
          {/* corner brackets */}
          {[[24, 70], [876, 70], [24, 756], [876, 756]].map(([x, y], i) => (
            <div key={i} style={{ position: "absolute", left: x, top: y, width: 40, height: 40, borderColor: C.cyan, borderStyle: "solid", borderWidth: `${i < 2 ? 4 : 0}px ${i % 2 ? 4 : 0}px ${i >= 2 ? 4 : 0}px ${i % 2 ? 0 : 4}px`, opacity: 0.7 }} />
          ))}
        </Glass>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: catchK, justifyContent: "center", alignItems: "center", translate: `${shake}px 0px` }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(3,8,20,0.6)" }} />
        <Pop at={28.45} style={{ top: 640, ...center }}>
          <svg width="260" height="230" viewBox="0 0 260 230">
            <path d="M130,10 L250,220 L10,220 Z" fill={C.amber} stroke="#FFE2A8" strokeWidth="6" strokeLinejoin="round" />
            <rect x="120" y="80" width="20" height="80" rx="8" fill="#3A2400" />
            <circle cx="130" cy="188" r="12" fill="#3A2400" />
          </svg>
        </Pop>
        <div style={{ position: "absolute", top: 930, fontFamily: FONT, fontWeight: 900, fontSize: 150, letterSpacing: -4, color: C.amber, textShadow: `0 0 50px ${C.amber}88`, opacity: ramp(s, 28.5, 28.7) }}>
          THE CATCH
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

/* S4b · Firefighters — 29.1 → 33.9 */
export const S4Fire: React.FC = () => {
  const s = useSec();
  const arrow = ramp(s, 32.0, 32.6);
  const cross = ramp(s, 32.85, 33.1);
  return (
    <Shell from={29.3} to={33.9}>
      <Header at={29.25} eyebrow="The big problem" title="Watching isn't proving" sub="correlation vs cause" color={C.amber} />
      <Pop at={29.6} style={{ left: 90, top: 640 }}>
        <Glass style={{ position: "relative", width: 400, height: 470 } as React.CSSProperties}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 70, gap: 30 }}>
            <Helmet size={250} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.ink }}>Firefighters</div>
          </div>
        </Glass>
      </Pop>
      <Pop at={31.75} style={{ left: 590, top: 640 }}>
        <Glass style={{ position: "relative", width: 400, height: 470 } as React.CSSProperties} edge="rgba(255,140,80,0.5)">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40, gap: 20 }}>
            <Flame s={s} size={250} />
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: C.ink }}>Fire</div>
          </div>
        </Glass>
      </Pop>
      <FadeUp at={31.9} style={{ ...center, top: 1150 }}>
        <Chip color={C.amber}>Always seen together</Chip>
      </FadeUp>
      {/* "causes?" arrow, then crossed out */}
      <div style={{ position: "absolute", left: 360, top: 1240, width: 360, opacity: arrow }}>
        <svg width="360" height="120" viewBox="0 0 360 120">
          <line x1="10" y1="60" x2={10 + 320 * arrow} y2="60" stroke={C.ink} strokeWidth="8" strokeLinecap="round" />
          <path d="M320,36 L350,60 L320,84" stroke={C.ink} strokeWidth="8" fill="none" strokeLinecap="round" opacity={arrow} />
          <text x="180" y="30" textAnchor="middle" fill={C.dim} fontFamily={MONO} fontSize="24" letterSpacing="3">CAUSES?</text>
          <line x1="110" y1="110" x2={110 + 140 * cross} y2={110 - 100 * cross} stroke={C.red} strokeWidth="14" strokeLinecap="round" />
          <line x1="250" y1="110" x2={250 - 140 * cross} y2={110 - 100 * cross} stroke={C.red} strokeWidth="14" strokeLinecap="round" />
        </svg>
      </div>
    </Shell>
  );
};

/* S4c · Correlation ≠ Causation — 33.9 → 39.8 */
export const S4Corr: React.FC = () => {
  const s = useSec();
  const sync = s > 35.25 && s < 37.6 ? 0.5 + 0.5 * Math.sin((s - 35.25) * 9) : 0;
  return (
    <Shell from={33.9} to={39.8}>
      <Header at={34.05} eyebrow="Same with the brain" title="Firing together ≠ cause" />
      <FadeUp at={34.6} style={{ left: 40, top: 560 }}>
        <Brain s={s} size={560} base={0.4} spots={[{ x: -60, y: -40, r: 160, color: C.cyan, k: sync }]} />
      </FadeUp>
      <FadeUp at={35.25} style={{ left: 620, top: 600 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <Mouse size={340} s={s} shake={sync * 0.5} />
          <Chip color={C.cyan}>behaviour</Chip>
        </div>
      </FadeUp>
      <FadeUp at={35.6} style={{ left: 520, top: 690 }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, color: C.cyan, opacity: 0.4 + 0.6 * sync }}>⇄</div>
      </FadeUp>
      <div style={{ position: "absolute", top: 1040, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 110, color: C.ink, letterSpacing: -3, opacity: ramp(s, 36.9, 37.3), translate: `0px ${(1 - ramp(s, 36.9, 37.4)) * 40}px` }}>
          Correlation
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: C.red, lineHeight: 0.9, opacity: ramp(s, 37.75, 37.9), scale: String(1.8 - 0.8 * ramp(s, 37.75, 38.0)) }}>≠</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 110, color: C.cyan, letterSpacing: -3, opacity: ramp(s, 38.7, 39.0), translate: `0px ${(1 - ramp(s, 38.7, 39.1)) * 40}px`, textShadow: `0 0 40px ${C.cyan}66` }}>
          Causation
        </div>
      </div>
    </Shell>
  );
};

/* S5 · Pond scum → alga → Hegemann & Nagel — 39.8 → 53.1 */
export const S5Pond: React.FC = () => {
  const s = useSec();
  const lens = window(s, 39.9, 43.9, 0.35);
  const focus = ramp(s, 42.6, 43.1);
  const swim = window(s, 43.7, 46.6, 0.35);
  const people = window(s, 46.4, 50.4, 0.35);
  const prot = window(s, 50.2, 53.1, 0.35);
  const swimK = ramp(s, 43.8, 46.4);
  const cells = new Array(14).fill(0).map((_, i) => ({
    x: 130 + random(`px${i}`) * 560,
    y: 130 + random(`py${i}`) * 560,
    sz: 70 + random(`ps${i}`) * 70,
    ph: random(`pp${i}`) * 6,
  }));
  return (
    <Shell from={39.8} to={53.1}>
      {s < 46.4 ? (
        <Header at={40.0} eyebrow="The answer came from" title={s < 42.7 ? "A weird place…" : "Pond scum!"} sub={s > 43.7 ? "a tiny green alga" : undefined} color={C.green} />
      ) : (
        <Header at={46.5} eyebrow="Early 2000s · Germany" title="The light sensor" sub="found inside the alga" color={C.green} />
      )}

      {/* Microscope lens */}
      <AbsoluteFill style={{ opacity: lens }}>
        <div
          style={{
            position: "absolute",
            left: 130,
            top: 520,
            width: 820,
            height: 820,
            borderRadius: 999,
            overflow: "hidden",
            background: "radial-gradient(circle at 40% 35%, #1E5A3A, #0A2416 70%)",
            border: "14px solid #1B2A44",
            boxShadow: `0 0 0 4px ${C.green}55, 0 40px 100px rgba(0,0,0,0.6), inset 0 0 120px rgba(0,0,0,0.7)`,
          }}
        >
          <div style={{ position: "absolute", inset: 0, filter: `blur(${(1 - focus) * 18}px)` }}>
            {cells.map((c, i) => (
              <div key={i} style={{ position: "absolute", left: c.x - c.sz / 2 + Math.sin(s + c.ph) * 20, top: c.y - c.sz / 2 + Math.cos(s * 0.8 + c.ph) * 20, rotate: `${c.ph * 40 + s * 10}deg` }}>
                <Alga s={s + c.ph} size={c.sz} />
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "center", alignItems: "center", fontFamily: FONT, fontWeight: 900, fontSize: 260, color: "white", opacity: (1 - focus) * (0.6 + 0.3 * Math.sin(s * 5)) }}>?</div>
        </div>
        <Stamp at={42.75} text="POND SCUM!" color={C.green} rotate={-6} style={{ left: 190, top: 1240 }} />
      </AbsoluteFill>

      {/* Alga swimming to light */}
      <AbsoluteFill style={{ opacity: swim }}>
        <div style={{ position: "absolute", right: -140, top: 360, width: 600, height: 600, borderRadius: 999, background: `radial-gradient(circle, rgba(255,240,180,${0.6 + 0.2 * Math.sin(s * 3)}), transparent 65%)` }} />
        <div style={{ position: "absolute", left: 140 + 420 * swimK, top: 1000 - 300 * swimK, rotate: "40deg" }}>
          <Alga s={s} size={380} />
        </div>
        <FadeUp at={44.4} style={{ left: 90, top: 560 }}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 46, color: C.green }}>Chlamydomonas reinhardtii</div>
        </FadeUp>
        <FadeUp at={45.5} style={{ left: 90, top: 1260 }}>
          <Chip color={C.gold}>☀ swims towards light</Chip>
        </FadeUp>
      </AbsoluteFill>

      {/* Hegemann & Nagel */}
      <AbsoluteFill style={{ opacity: people }}>
        <FadeUp at={46.5} style={{ ...center, top: 470 }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: C.green, letterSpacing: -4, opacity: 0.22 }}>2002–2003</div>
        </FadeUp>
        <div style={{ position: "absolute", top: 700, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 60, scale: "1.2" }}>
          <Pop at={48.0} style={{ position: "relative" }}>
            <PersonCard name="Peter Hegemann" org="Humboldt Univ. Berlin" initials="PH" tint="#4B7BE8" tag="BIOPHYSICIST" />
          </Pop>
          <Pop at={49.25} style={{ position: "relative" }}>
            <PersonCard name="Georg Nagel" org="Univ. of Würzburg" initials="GN" tint="#2FB59B" tag="BIOPHYSICIST" />
          </Pop>
        </div>
      </AbsoluteFill>

      {/* Protein glow */}
      <AbsoluteFill style={{ opacity: prot }}>
        <div style={{ position: "absolute", left: 540 - 60, top: 470, width: 120, height: 420, background: `linear-gradient(rgba(91,170,255,0), rgba(91,170,255,${0.7 * ramp(s, 52.2, 52.5)}))`, clipPath: "polygon(35% 0, 65% 0, 100% 100%, 0 100%)" }} />
        <div style={{ position: "absolute", left: 540 - 230, top: 760 }}>
          <Alga s={s} size={460} protein={ramp(s, 51.0, 52.4)} />
        </div>
        <FadeUp at={51.2} style={{ left: 640, top: 760 }}>
          <Chip color={C.blue}>light-sensing protein</Chip>
        </FadeUp>
      </AbsoluteFill>
    </Shell>
  );
};

/* S6 · Channelrhodopsin — 53.1 → 61.3 */
export const S6Channel: React.FC = () => {
  const s = useSec();
  const open = ramp(s, 57.2, 57.6);
  const beam = ramp(s, 56.5, 56.9);
  const flow = clampInterp(s, [57.75, 59.6], [0, 1]);
  const spike = ramp(s, 60.0, 60.7);
  return (
    <Shell from={53.1} to={61.3}>
      <Header at={53.3} eyebrow="The light switch" title="Channelrhodopsin" sub="a protein that works like a door" color={C.blue} />
      <FadeUp at={53.7} style={{ left: 90, top: 560 }}>
        <Membrane s={s} open={open} beam={beam} flow={flow} />
      </FadeUp>
      <Pop at={55.5} style={{ left: 640, top: 480 }}>
        <Chip color={open > 0.5 ? C.green : C.dim} style={{ fontFamily: MONO, fontSize: 26 }}>
          DOOR: {open > 0.5 ? "OPEN" : "CLOSED"}
        </Chip>
      </Pop>
      <Pop at={56.5} style={{ left: 120, top: 480 }}>
        <Chip color={C.blue} style={{ fontFamily: MONO, fontSize: 26 }}>BLUE LIGHT</Chip>
      </Pop>
      <FadeUp at={59.9} style={{ ...center, top: 1180 }}>
        <svg width="860" height="200" viewBox="0 0 860 200">
          <polyline
            points="0,150 380,150 400,150 420,30 446,180 470,140 490,150 860,150"
            fill="none"
            stroke={C.gold}
            strokeWidth="6"
            strokeLinejoin="round"
            strokeDasharray="1200"
            strokeDashoffset={1200 - 1200 * spike}
            style={{ filter: `drop-shadow(0 0 12px ${C.gold})` }}
          />
          <text x="520" y="60" fill={C.gold} fontFamily={FONT} fontWeight="800" fontSize="44" opacity={ramp(s, 60.3, 60.6)}>
            SIGNAL!
          </text>
        </svg>
      </FadeUp>
    </Shell>
  );
};
