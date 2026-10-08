import React from "react";
import { AbsoluteFill } from "remotion";
import { Brain, DNA, Medal, Neuron, Toggle } from "../components/art";
import { Chip, FadeUp, Header, PersonCard, Pop, Shell, Stamp } from "../components/ui";
import { clampInterp, EXPO, ramp, useSec, window } from "../lib/anim";
import { C, FONT, MONO, SERIF } from "../theme";

const center: React.CSSProperties = { left: 0, right: 0, display: "flex", justifyContent: "center" };

/* S1 · Hook — 0 → 9.6 */
export const S1Hook: React.FC = () => {
  const s = useSec();
  const medal = window(s, 1.0, 3.7, 0.3);
  const cards = window(s, 3.7, 5.5, 0.3);
  const brain = window(s, 5.45, 9.6, 0.4);
  const lit = s >= 6.75 && s < 7.15 ? 1 : s >= 7.5 ? clampInterp(s, [7.5, 7.8], [0, 1]) : 0;
  const fiber = ramp(s, 5.6, 6.3);
  return (
    <Shell from={0} to={9.6}>
      <FadeUp at={0.35} style={{ ...center, top: 1180 }}>
        <div style={{ opacity: window(s, 0.35, 1.1, 0.2), textAlign: "center" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 96, color: C.ink, letterSpacing: -2 }}>Clara</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: C.cyan }}>your health companion</div>
        </div>
      </FadeUp>

      {s > 1.1 ? <Header at={1.3} eyebrow="Nobel Prize · 2026" title="Physiology or Medicine" sub="explained in 2 minutes" color={C.gold} /> : null}

      {/* Medal with rotating god-rays */}
      <AbsoluteFill style={{ opacity: medal, scale: String(0.85 + 0.15 * ramp(s, 1.0, 1.6)) }}>
        <div
          style={{
            position: "absolute",
            left: 540 - 520,
            top: 930 - 520,
            width: 1040,
            height: 1040,
            borderRadius: 999,
            background: `repeating-conic-gradient(from ${s * 14}deg, rgba(244,199,106,0.16) 0deg 8deg, transparent 8deg 22deg)`,
            maskImage: "radial-gradient(circle, black 20%, transparent 68%)",
          }}
        />
        <Pop at={1.05} style={{ ...center, top: 560 }}>
          <Medal s={s} size={460} />
        </Pop>
      </AbsoluteFill>

      {/* Three laureates */}
      <AbsoluteFill style={{ opacity: cards }}>
        <div style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 28 }}>
          {[
            { n: "Peter Hegemann", o: "Humboldt Univ. Berlin", i: "PH", t: "#4B7BE8" },
            { n: "Georg Nagel", o: "Univ. of Würzburg", i: "GN", t: "#2FB59B" },
            { n: "Karl Deisseroth", o: "Stanford · HHMI", i: "KD", t: "#8B6BFF" },
          ].map((p, k) => (
            <Pop key={p.n} at={3.75 + k * 0.2} style={{ position: "relative" }}>
              <PersonCard name={p.n} org={p.o} initials={p.i} tint={p.t} />
            </Pop>
          ))}
        </div>
        <FadeUp at={4.4} style={{ ...center, top: 1110 }}>
          <Chip color={C.gold}>“for light-gated ion channels & optogenetics”</Chip>
        </FadeUp>
      </AbsoluteFill>

      {/* Brain switched on/off with light */}
      <AbsoluteFill style={{ opacity: brain }}>
        <div
          style={{
            position: "absolute",
            left: 538,
            top: 470,
            width: 4,
            height: 300 * fiber,
            background: `linear-gradient(${C.cyan}, ${C.blue})`,
            boxShadow: `0 0 20px ${C.blue}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 540 - 160,
            top: 760,
            width: 320,
            height: 260,
            background: `radial-gradient(ellipse at 50% 0%, rgba(91,170,255,${0.75 * lit}), transparent 70%)`,
            clipPath: "polygon(45% 0, 55% 0, 100% 100%, 0 100%)",
          }}
        />
        <div style={{ position: "absolute", left: 90, top: 640 }}>
          <Brain s={s} size={900} base={0.45} spots={[{ x: 10, y: -40, r: 170, color: C.cyan, k: lit }]} />
        </div>
        <FadeUp at={6.2} style={{ ...center, top: 1250, gap: 26, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 26, alignItems: "center" }}>
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: lit > 0.5 ? C.dim : C.ink }}>OFF</span>
            <Toggle on={lit} size={170} />
            <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, color: lit > 0.5 ? C.cyan : C.dim }}>ON</span>
          </div>
        </FadeUp>
      </AbsoluteFill>
    </Shell>
  );
};

/* S2 · Sci-fi → Optogenetics — 9.6 → 17.1 */
export const S2SciFi: React.FC = () => {
  const s = useSec();
  const sci = window(s, 9.7, 12.7, 0.3);
  const jitter = s < 11.5 ? Math.sin(s * 90) * 6 * (Math.sin(s * 7) > 0.6 ? 1 : 0.15) : 0;
  const word = "OPTOGENETICS";
  const big = window(s, 12.8, 17.1, 0.3);
  const optoB = ramp(s, 14.0, 14.5);
  const genB = ramp(s, 15.25, 15.75);
  return (
    <Shell from={9.6} to={17.1}>
      {s > 12.9 ? <Header at={13.0} eyebrow="The big idea" title="Light + genes" sub="a light switch for brain cells" /> : null}

      <AbsoluteFill style={{ opacity: sci, justifyContent: "center", alignItems: "center", top: -120 }}>
        <div style={{ position: "relative", opacity: s > 11.5 ? 0.25 : 1 }}>
          {[C.red, C.cyan, C.ink].map((col, i) => (
            <div
              key={col}
              style={{
                position: i === 2 ? "relative" : "absolute",
                inset: 0,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 210,
                letterSpacing: -6,
                color: col,
                mixBlendMode: i === 2 ? "normal" : "screen",
                translate: `${(i - 1) * jitter}px ${(i - 1) * jitter * 0.4}px`,
                opacity: i === 2 ? 1 : 0.7,
              }}
            >
              SCI-FI?
            </div>
          ))}
        </div>
        <Stamp at={11.5} text="IT'S REAL" color={C.green} style={{ top: 960, left: 250 }} />
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: big }}>
        <div style={{ position: "absolute", top: 720, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          {word.split("").map((ch, i) => {
            const k = ramp(s, 13.0 + i * 0.035, 13.45 + i * 0.035);
            const isOpto = i < 4;
            return (
              <span
                key={i}
                style={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: 118,
                  letterSpacing: -3,
                  color: isOpto ? (optoB > 0.3 ? C.blue : C.ink) : genB > 0.3 ? C.violet : C.ink,
                  textShadow: isOpto && optoB > 0.3 ? `0 0 40px ${C.blue}` : !isOpto && genB > 0.3 ? `0 0 40px ${C.violet}` : "none",
                  opacity: k,
                  translate: `0px ${(1 - k) * 80}px`,
                  display: "inline-block",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        {/* OPTO bracket */}
        <div style={{ position: "absolute", left: 58, top: 890, width: 300, opacity: optoB }}>
          <div style={{ height: 22, borderLeft: `4px solid ${C.blue}`, borderRight: `4px solid ${C.blue}`, borderBottom: `4px solid ${C.blue}`, borderRadius: "0 0 10px 10px" }} />
          <div style={{ textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 58, color: C.blue, marginTop: 10 }}>light</div>
          <div style={{ position: "relative", height: 300, marginTop: 10 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 150 - 4 + (i - 2) * 46,
                  top: 0,
                  width: 6,
                  height: 260 * optoB,
                  borderRadius: 4,
                  background: `linear-gradient(${C.cyan}, transparent)`,
                  rotate: `${(i - 2) * 12}deg`,
                  transformOrigin: "top center",
                  opacity: 0.5 + 0.5 * Math.sin(s * 6 + i),
                }}
              />
            ))}
          </div>
        </div>
        {/* GENETICS bracket */}
        <div style={{ position: "absolute", left: 380, top: 890, width: 640, opacity: genB }}>
          <div style={{ height: 22, borderLeft: `4px solid ${C.violet}`, borderRight: `4px solid ${C.violet}`, borderBottom: `4px solid ${C.violet}`, borderRadius: "0 0 10px 10px" }} />
          <div style={{ textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 58, color: C.violet, marginTop: 10 }}>genes</div>
          <div style={{ display: "flex", justifyContent: "center", marginTop: 0, rotate: "90deg", translate: "0px -40px" }}>
            <DNA s={s} height={380} />
          </div>
        </div>
      </AbsoluteFill>
    </Shell>
  );
};

/* S3 · Basics — 17.1 → 24.1 */
export const S3Basics: React.FC = () => {
  const s = useSec();
  const brainK = window(s, 17.2, 21.6, 0.4);
  const count = Math.round(clampInterp(s, [19.5, 20.6], [0, 86], EXPO));
  const neuronK = window(s, 21.2, 24.1, 0.35);
  const pulse = s >= 22.0 ? ((s - 22.0) / 1.1) % 1.3 : -1;
  const fire = clampInterp(s, [23.25, 23.4, 24.0], [0, 1, 0.3]);
  return (
    <Shell from={17.1} to={24.1}>
      <Header at={17.35} eyebrow="Quick basics" title="Your brain" sub="cells that talk in electricity" />
      <AbsoluteFill style={{ opacity: brainK }}>
        <div style={{ position: "absolute", left: 90, top: 560, scale: String(1 + 0.04 * ramp(s, 19.5, 21)) }}>
          <Brain s={s} size={900} base={0.35 + 0.65 * ramp(s, 19.5, 20.6)} />
        </div>
        <FadeUp at={19.45} style={{ ...center, top: 1110, flexDirection: "column", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 170, color: C.ink, lineHeight: 1, letterSpacing: -4 }}>
              {count}
              <span style={{ color: C.cyan }}> billion</span>
            </div>
            <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: C.dim, marginTop: 8 }}>NEURONS IN YOUR HEAD</div>
          </div>
        </FadeUp>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: neuronK }}>
        <div style={{ position: "absolute", left: 130, top: 640 }}>
          <Neuron s={s} pulse={pulse} fire={fire} />
        </div>
        <FadeUp at={22.0} style={{ ...center, top: 1130 }}>
          <svg width="820" height="150" viewBox="0 0 820 150">
            <polyline
              points="0,90 300,90 330,90 350,15 372,118 392,82 410,90 820,90"
              fill="none"
              stroke={C.cyan}
              strokeWidth="5"
              strokeLinejoin="round"
              strokeDasharray="1100"
              strokeDashoffset={1100 - 1100 * ramp(s, 22.0, 23.4)}
              style={{ filter: `drop-shadow(0 0 10px ${C.cyan})` }}
            />
            <text x="0" y="146" fill={C.dim} fontFamily={MONO} fontSize="22" letterSpacing="3">ELECTRICAL SIGNAL · ~1 ms</text>
          </svg>
        </FadeUp>
      </AbsoluteFill>
    </Shell>
  );
};
