import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Brain, DNA, Neuron } from "../components/art";
import { clampInterp, EXPO, INOUT, ramp, useSec, window } from "../lib/anim";
import { C, FONT, MONO, SERIF } from "../theme";
import { Beam, Burst, center, Cite, Flash, Kinetic, shake, Title } from "./kit";
import { seg, w } from "./timing";

/* A · Cold open — a single neuron, switched on by light */
export const SHook: React.FC = () => {
  const s = useSec();
  const tFlash = w("hook", "flash");
  const tLight = w("hook", "light?");
  const lit = ramp(s, w("hook", "single"), w("hook", "cell…") + 0.3);
  const beam = clampInterp(s, [tFlash - 0.25, tFlash, tFlash + 0.6], [0, 1, 0.7]);
  const fire = clampInterp(s, [tFlash, tFlash + 0.1, tFlash + 1.0], [0, 1, 0.5]);
  const pulse = s > tFlash ? Math.min(1, (s - tFlash) / 0.8) : -1;
  const push = 1 + 0.12 * ramp(s, 0, 4, INOUT);
  return (
    <AbsoluteFill style={{ background: "#01040C" }}>
      <AbsoluteFill style={{ scale: String(push), translate: shake(s, tFlash, 22) }}>
        <div style={{ position: "absolute", left: 540 - 450, top: 760, width: 900, height: 600, background: `radial-gradient(ellipse, rgba(61,139,255,${0.12 + 0.35 * fire}), transparent 65%)` }} />
        <div style={{ position: "absolute", left: 130, top: 830, opacity: 0.25 + 0.75 * lit }}>
          <Neuron s={s} pulse={pulse} fire={fire} glowSoma={lit * 0.4} />
        </div>
        <Beam x={345} y0={0} y1={1040} k={beam} w={300} />
        <Burst at={tFlash + 0.02} x={345} y={1040} color={C.cyan} dist={420} n={34} />
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 330, ...center, opacity: window(s, 0.3, 3.9, 0.3) }}>
        <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: 8, color: C.gold }}>NOBEL PRIZE · MEDICINE · 2026</div>
      </div>
      <div style={{ position: "absolute", top: 430, left: 0, right: 0 }}>
        <Kinetic at={w("hook", "switch")} text="SWITCH ON" size={120} color="white" stagger={0.035} />
        <Kinetic at={w("hook", "single")} text="A BRAIN CELL" size={92} color={C.dim} stagger={0.03} style={{ marginTop: -8 }} />
      </div>
      <div style={{ position: "absolute", top: 1240, left: 0, right: 0 }}>
        <Kinetic at={tLight} text="WITH LIGHT." size={130} color={C.cyan} glow="rgba(91,231,255,0.8)" stagger={0.04} />
      </div>
      <Flash at={tFlash} peak={0.55} dur={0.5} />
    </AbsoluteFill>
  );
};

/* B · Clara intro + Nobel reveal with the laureate illustration */
export const SNobel: React.FC = () => {
  const s = useSec();
  const t2026 = w("nobel", "2026");
  const tPrize = w("nobel", "Nobel");
  const card = ramp(s, seg("nobel").start + 0.1, seg("nobel").start + 1.1);
  const tilt = 14 * (1 - card) + Math.sin(s * 0.8) * 1.5;
  const intro = window(s, 4.1, seg("intro").end + 0.25, 0.3);
  return (
    <AbsoluteFill>
      {/* Clara's name plate while she greets (Clara herself lives in the host layer) */}
      <div style={{ position: "absolute", top: 1190, ...center, opacity: intro, translate: `0px ${(1 - ramp(s, 4.3, 4.9)) * 40}px` }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 112, color: "white", letterSpacing: -3, textShadow: "0 0 40px rgba(91,231,255,0.5)" }}>Clara</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: C.cyan, marginTop: -6 }}>your health companion</div>
        </div>
      </div>
      {s > seg("nobel").start - 0.2 ? (
        <>
          <Title at={seg("nobel").start} eyebrow="Announced · 5 Oct 2026" title="Nobel Prize in Medicine" sub="Physiology or Medicine, 2026" color={C.gold} />
          {/* gold year behind */}
          <div style={{ position: "absolute", top: 470, ...center, opacity: 0.16 * ramp(s, t2026, t2026 + 0.6) }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 330, color: C.gold, letterSpacing: -12, translate: `${(1 - ramp(s, t2026, t2026 + 1.2)) * 120}px 0px` }}>2026</div>
          </div>
          {/* rotating rays */}
          <div
            style={{
              position: "absolute",
              left: 540 - 650,
              top: 930 - 650,
              width: 1300,
              height: 1300,
              opacity: 0.8 * card,
              background: `repeating-conic-gradient(from ${s * 10}deg, rgba(244,199,106,0.13) 0deg 7deg, transparent 7deg 20deg)`,
              maskImage: "radial-gradient(circle, black 15%, transparent 62%)",
            }}
          />
          {/* the illustration as a paper card in 3D */}
          <div style={{ position: "absolute", top: 610, ...center, perspective: 1400 }}>
            <div
              style={{
                width: 940,
                borderRadius: 26,
                overflow: "hidden",
                background: "#F1ECE2",
                boxShadow: `0 50px 120px rgba(0,0,0,0.65), 0 0 90px rgba(244,199,106,${0.3 * card})`,
                border: `3px solid ${C.gold}`,
                opacity: card,
                transform: `rotateX(${tilt}deg) translateY(${(1 - card) * 160}px) scale(${0.9 + 0.1 * card})`,
              }}
            >
              <Img src={staticFile("laureates/banner.png")} style={{ width: "100%", display: "block" }} />
              {/* gold sheen sweep */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(105deg, transparent ${-30 + ((s - tPrize) * 70) % 200}%, rgba(255,240,200,0.55) ${-20 + ((s - tPrize) * 70) % 200}%, transparent ${-10 + ((s - tPrize) * 70) % 200}%)`,
                  mixBlendMode: "screen",
                }}
              />
            </div>
          </div>
          <div style={{ position: "absolute", top: 1270, ...center, gap: 22, opacity: ramp(s, tPrize, tPrize + 0.6) }}>
            {["Karl Deisseroth", "Peter Hegemann", "Georg Nagel"].map((n, i) => (
              <div key={n} style={{ fontFamily: FONT, fontWeight: 700, fontSize: 30, color: "white", opacity: ramp(s, tPrize + i * 0.15, tPrize + i * 0.15 + 0.4) }}>
                {n}
                {i < 2 ? <span style={{ color: C.gold }}> ·</span> : null}
              </div>
            ))}
          </div>
          <Cite at={tPrize + 0.3} top={1335}>Ill. Niklas Elmehed © Nobel Prize Outreach</Cite>
        </>
      ) : null}
    </AbsoluteFill>
  );
};

/* C · Optogenetics = light + genes */
export const SOpto: React.FC = () => {
  const s = useSec();
  const tWord = w("name", "optogenetics.");
  const tOpto = w("split", "Opto,");
  const tLight = w("split", "light.");
  const tGenes = w("split", "genes.");
  const split = ramp(s, tOpto, tOpto + 0.6, EXPO);
  return (
    <AbsoluteFill>
      <Title at={seg("name").start} eyebrow="The big idea" title="A light switch for cells" color={C.cyan} />
      {/* light rays behind OPTO */}
      <div style={{ position: "absolute", left: 0, top: 520, width: 1080, height: 620, opacity: ramp(s, tLight, tLight + 0.4) }}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 300 + (i - 3) * 30,
              top: 0,
              width: 10,
              height: 620,
              borderRadius: 8,
              background: `linear-gradient(${C.cyan}, transparent)`,
              rotate: `${(i - 3) * 9}deg`,
              transformOrigin: "top center",
              opacity: 0.35 + 0.35 * Math.sin(s * 5 + i),
            }}
          />
        ))}
      </div>
      <div style={{ position: "absolute", top: 820, left: 0, right: 0, translate: `${-315 + 135 * split}px ${-170 * split}px`, scale: String(1 + 0.2 * split) }}>
        <Kinetic at={tWord} text="OPTO" size={120} color={split > 0.2 ? C.cyan : "white"} glow={split > 0.2 ? "rgba(91,231,255,0.7)" : undefined} />
      </div>
      <div style={{ position: "absolute", top: 820, left: 0, right: 0, translate: `${163 - 123 * split}px ${170 * split}px`, scale: String(1 + 0.1 * split) }}>
        <Kinetic at={tWord + 0.12} text="GENETICS" size={120} color={split > 0.2 ? C.violet : "white"} glow={split > 0.2 ? "rgba(139,123,255,0.7)" : undefined} />
      </div>
      <div style={{ position: "absolute", left: 640, top: 690, opacity: ramp(s, tLight, tLight + 0.4) }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: C.cyan }}>= light</div>
      </div>
      <div style={{ position: "absolute", left: 250, top: 1160, opacity: ramp(s, tGenes, tGenes + 0.4), display: "flex", alignItems: "center", gap: 30 }}>
        <div style={{ rotate: "90deg", translate: "0px 0px" }}>
          <DNA s={s} height={300} />
        </div>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 64, color: C.violet }}>= genes</div>
      </div>
    </AbsoluteFill>
  );
};

/* D · 86 billion neurons talking in sparks */
export const SNeurons: React.FC = () => {
  const s = useSec();
  const t86 = w("neurons", "86");
  const n = Math.round(clampInterp(s, [t86 - 0.1, w("neurons", "neurons,")], [0, 86], EXPO));
  const tSparks = w("neurons", "tiny");
  const sparks = [0, 1, 2, 3, 4, 5].map((i) => ({
    x: -260 + ((i * 97) % 520),
    y: -150 + ((i * 61) % 300),
    r: 70,
    color: C.cyan,
    k: s > tSparks ? Math.max(0, Math.sin((s - tSparks) * 7 + i * 1.7)) : 0,
  }));
  const zoom = 1.35 - 0.3 * ramp(s, seg("neurons").start - 0.4, t86 + 0.6, EXPO);
  return (
    <AbsoluteFill>
      <Title at={seg("neurons").start} eyebrow="Quick basics" title="Your brain" sub="a galaxy of cells that talk in electricity" />
      <div style={{ position: "absolute", left: 40, top: 520, scale: String(zoom) }}>
        <Brain s={s} size={1000} base={0.35 + 0.65 * ramp(s, t86, t86 + 1)} spots={sparks} />
      </div>
      <div style={{ position: "absolute", top: 1110, ...center, opacity: ramp(s, t86 - 0.1, t86 + 0.3) }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 200, lineHeight: 1, letterSpacing: -6, color: "white", textShadow: "0 0 50px rgba(91,231,255,0.45)" }}>
            {n}
            <span style={{ color: C.cyan, fontSize: 110, letterSpacing: -3 }}> billion</span>
          </div>
          <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: 8, color: C.dim, marginTop: 6 }}>NEURONS IN YOUR BRAIN</div>
        </div>
      </div>
      <Cite at={t86 + 0.8}>Azevedo et al., J Comp Neurol 2009</Cite>
    </AbsoluteFill>
  );
};

/* E · For decades we could only watch */
export const SWatch: React.FC = () => {
  const s = useSec();
  const tSparks = w("watch", "sparks");
  const spots = [
    { x: -150, y: -60, d: 0, c: C.amber },
    { x: 120, y: -120, d: 0.25, c: C.red },
    { x: 40, y: 60, d: 0.5, c: C.amber },
    { x: 200, y: 140, d: 0.75, c: C.red },
  ].map((p) => ({ x: p.x, y: p.y, r: 120, color: p.c, k: ramp(s, tSparks + p.d, tSparks + p.d + 0.4) * (0.75 + 0.25 * Math.sin(s * 5 + p.x)) }));
  return (
    <AbsoluteFill>
      <Title at={seg("watch").start} eyebrow="For decades" title="We could only watch" sub="brain scans show activity, not cause" color={C.amber} />
      <div style={{ position: "absolute", left: 70, top: 540, width: 940, height: 800, borderRadius: 40, background: "linear-gradient(160deg, rgba(24,48,96,0.6), rgba(6,14,34,0.8))", border: "1.5px solid rgba(120,200,255,0.22)", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }}>
        <div style={{ position: "absolute", left: 30, top: 26, display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 18, height: 18, borderRadius: 99, background: C.red, opacity: Math.sin(s * 8) > 0 ? 1 : 0.2 }} />
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: "white" }}>fMRI · OBSERVE ONLY</span>
        </div>
        <div style={{ position: "absolute", right: 30, top: 26, fontFamily: MONO, fontSize: 24, color: C.dim }}>{(s * 1000).toFixed(0).padStart(6, "0")} ms</div>
        <div style={{ position: "absolute", left: 20, top: 90 }}>
          <Brain s={s} size={900} base={0.3} spots={spots} color="#7FA6D9" />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 100 + ((s * 320) % 680), height: 3, background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`, opacity: 0.7 }} />
      </div>
    </AbsoluteFill>
  );
};
