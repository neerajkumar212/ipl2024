import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { clampInterp, EXPO, INOUT, ramp, useSec, window } from "../lib/anim";
import { C, FONT, MONO, SERIF } from "../theme";
import { Burst, center, Cite, Kinetic, shake, Title } from "../v2/kit";
import { glass, Slam } from "../v3/scenesA";
import { ClipFrame, Ecg, Eyebrow, Heart3D, Womb3D } from "./art6";
import { seg, w } from "./timing";

/* Episode 4 premium: Baby Rylan. Scenes follow the original video's story beat for beat. No beams, no flashes. */

const Abs: React.FC<{ top: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ top, children, style }) => (
  <div style={{ position: "absolute", top, ...center, ...style }}>{children}</div>
);

/** Pregnancy timeline 0→40 weeks with markers; the dot travels from `from` to `to` weeks. */
const WeekBar: React.FC<{ at: number; from: number; to: number; travel?: number; marks: [number, string, string][] }> = ({ at, from, to, travel = 1.2, marks }) => {
  const s = useSec();
  const k = ramp(s, at, at + 0.6);
  const p = from + (to - from) * clampInterp(s, [at + 0.3, at + 0.3 + travel], [0, 1], INOUT);
  const W = 860;
  const x = (wk: number) => (wk / 40) * W;
  return (
    <div style={{ position: "relative", width: W, height: 200, opacity: k }}>
      <div style={{ position: "absolute", top: 90, left: 0, width: W, height: 14, borderRadius: 10, background: "rgba(255,255,255,0.12)" }} />
      <div style={{ position: "absolute", top: 90, left: 0, width: x(p), height: 14, borderRadius: 10, background: `linear-gradient(90deg, #1B4F96, ${C.teal}, ${C.cyan})`, boxShadow: `0 0 24px ${C.cyan}88` }} />
      {[0, 10, 20, 30, 40].map((t) => (
        <div key={t} style={{ position: "absolute", left: x(t) - 30, width: 60, top: 118, textAlign: "center", fontFamily: MONO, fontSize: 20, color: C.dim }}>
          {t}
        </div>
      ))}
      {marks.map(([wk, label, col]) => {
        const on = p >= wk - 0.2 ? 1 : 0.25;
        return (
          <div key={label} style={{ position: "absolute", left: x(wk) - 90, width: 180, top: 6, textAlign: "center", opacity: on }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: col }}>{label}</div>
            <div style={{ margin: "6px auto 0", width: 4, height: 36, background: col, borderRadius: 4 }} />
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 75, left: x(p) - 22, width: 44, height: 44, borderRadius: 99, background: "white", boxShadow: `0 0 30px ${C.cyan}, 0 0 0 8px ${C.cyan}44` }} />
    </div>
  );
};

/* 1 · Cold open: a baby, a heart, a womb. Fades up from dark; no light burst. */
export const SHook6: React.FC = () => {
  const s = useSec();
  const tOpen = w("hook", "open");
  const tInside = w("hook", "inside");
  const push = 1 + 0.08 * ramp(s, 0, 4.6, INOUT);
  const art = 0.55 + 0.45 * ramp(s, 0, 0.9);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 48%, #1A0A1E 0%, #050713 60%, #02040B 100%)" }}>
      <AbsoluteFill style={{ scale: String(push), translate: shake(s, tInside, 10) }}>
        <Abs top={540} style={{ opacity: art }}>
          <Womb3D size={780} tumor={0} glow={0.35 + 0.3 * ramp(s, tInside, tInside + 0.6)} />
        </Abs>
      </AbsoluteFill>
      <Abs top={300} style={{ opacity: window(s, -1, 4.8, 0.3) }}>
        <Eyebrow color={C.teal}>TRUE STORY · FETAL SURGERY</Eyebrow>
      </Abs>
      <div style={{ position: "absolute", top: 370, left: 0, right: 0 }}>
        <Kinetic at={w("hook", "Baby") - 0.05} text="BABY RYLAN" size={70} color={C.dim} stagger={0.03} />
        <Kinetic at={tOpen - 0.05} text="OPEN HEART SURGERY" size={92} color="white" stagger={0.025} style={{ marginTop: -4 }} />
      </div>
      <div style={{ position: "absolute", top: 1255, left: 0, right: 0 }}>
        <Kinetic at={tInside} text="INSIDE THE WOMB" size={90} color={C.cyan} glow="rgba(91,231,255,0.7)" stagger={0.03} />
      </div>
    </AbsoluteFill>
  );
};

/* 2 · Clara introduces herself (centre stage) */
export const SIntro6: React.FC = () => {
  const s = useSec();
  const k = window(s, seg("intro").start - 0.1, seg("intro").end + 0.6, 0.3);
  return (
    <AbsoluteFill>
      <Abs top={1180} style={{ opacity: k, translate: `0px ${(1 - ramp(s, seg("intro").start, seg("intro").start + 0.6)) * 40}px` }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 112, color: "white", letterSpacing: -3, textShadow: "0 0 40px rgba(91,231,255,0.5)" }}>Clara</div>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 40, color: C.cyan, marginTop: -6 }}>your health companion</div>
        </div>
      </Abs>
    </AbsoluteFill>
  );
};

/* 3 · Only 26 weeks along */
export const SWeeks6: React.FC = () => {
  const s = useSec();
  const t = seg("weeks").start;
  const num = Math.round(clampInterp(s, [w("weeks", "26"), w("weeks", "26") + 0.7], [0, 26], EXPO));
  return (
    <AbsoluteFill>
      <Title at={t} eyebrow="Where it began" title="26 weeks along" sub="about six months pregnant" color={C.teal} />
      <Abs top={560} style={{ opacity: ramp(s, t, t + 0.6) }}>
        <Womb3D size={520} grow={0.6} glow={0.25} />
      </Abs>
      <Abs top={830}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: "white", opacity: ramp(s, w("weeks", "26") - 0.1, w("weeks", "26") + 0.2), textShadow: `0 0 40px ${C.cyan}88, 0 10px 40px rgba(0,0,0,0.8)` }}>
          {num}
          <span style={{ fontSize: 56, color: C.cyan, marginLeft: 12 }}>wks</span>
        </div>
      </Abs>
      <Abs top={1110}>
        <WeekBar at={t + 0.2} from={0} to={26} travel={1.4} marks={[[26, "26 wks", C.cyan], [40, "full term", C.dim]]} />
      </Abs>
    </AbsoluteFill>
  );
};

/* 4 · A teratoma growing on his heart */
export const STumor6: React.FC = () => {
  const s = useSec();
  const tT = w("tumor", "teratoma");
  const grow = clampInterp(s, [w("tumor", "growing") - 0.2, seg("tumor").end + 0.3], [0.25, 1], EXPO);
  const tag = clampInterp(s, [tT, tT + 0.4], [0, 1], EXPO);
  return (
    <AbsoluteFill>
      <Title at={seg("tumor").start} eyebrow="The scan showed" title="A tumor on his heart" sub="called a teratoma" color={C.violet} />
      <Abs top={540} style={{ opacity: ramp(s, seg("tumor").start - 0.1, seg("tumor").start + 0.5) }}>
        <Heart3D size={640} tumor={grow} />
      </Abs>
      <div style={{ position: "absolute", left: 640, top: 600, opacity: tag, scale: String(0.6 + 0.4 * tag), transformOrigin: "0% 100%" }}>
        <div style={{ ...glass, position: "relative", padding: "16px 26px", borderRadius: 22, border: `2px solid ${C.violet}88` }}>
          <div style={{ fontFamily: MONO, fontSize: 20, letterSpacing: 3, color: C.violet }}>MASS</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 44, color: "white" }}>teratoma</div>
        </div>
      </div>
      <Abs top={1220}>
        <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: 4, color: C.dim, opacity: ramp(s, w("tumor", "growing"), w("tumor", "growing") + 0.5) }}>PRESSING ON THE HEART</div>
      </Abs>
    </AbsoluteFill>
  );
};

/* 5 · Without help: 1 to 2 weeks */
export const SDanger6: React.FC = () => {
  const s = useSec();
  const t = seg("danger").start;
  const weak = clampInterp(s, [t + 0.3, seg("danger").end], [0, 0.85]);
  const tW = w("danger", "1");
  return (
    <AbsoluteFill>
      <Title at={t} eyebrow="Without surgery" title="Time was running out" color={C.red} />
      <Abs top={560} style={{ opacity: ramp(s, t, t + 0.5) }}>
        <Heart3D size={430} tumor={1} weak={weak} />
      </Abs>
      <Abs top={980} style={{ opacity: ramp(s, t + 0.2, t + 0.7) }}>
        <Ecg width={900} weak={weak} color={C.red} />
      </Abs>
      <Abs top={1190} style={{ translate: shake(s, tW, 14) }}>
        <Slam at={tW} text="1–2 WEEKS" color={C.red} size={84} rotate={-4} />
      </Abs>
    </AbsoluteFill>
  );
};

/* 6 · A bold choice: operate in the womb */
export const SDecide6: React.FC = () => {
  const tOp = seg("operate").start;
  return (
    <AbsoluteFill>
      <Title at={seg("decide").start} eyebrow="Doctors + parents" title="A bold choice" color={C.gold} out={tOp + 0.1} />
      <Title at={tOp} eyebrow="The plan" title="Operate in the womb" color={C.cyan} />
      <Abs top={590}>
        <ClipFrame file="team" at={seg("decide").start - 0.2} slot={tOp - seg("decide").start + 0.4} dur={2.43} tilt={-8} w={900} />
      </Abs>
      <Abs top={1250}>
        <Slam at={w("operate", "womb.")} text="BEFORE BIRTH" color={C.cyan} size={66} rotate={-5} />
      </Abs>
      <Burst at={w("operate", "womb.")} x={540} y={1290} color={C.cyan} dist={300} />
    </AbsoluteFill>
  );
};

/* 7 · Surgeons opened the womb and removed the tumor */
export const SSurgery6: React.FC = () => {
  const s = useSec();
  const t = seg("surgery").start;
  const tRem = w("surgery", "removed");
  const swap = ramp(s, tRem - 0.25, tRem + 0.25);
  return (
    <AbsoluteFill>
      <Title at={t} eyebrow="Step by step" title={s < tRem - 0.1 ? "Opening the womb" : "Removing the tumor"} color={C.teal} />
      <Abs top={590} style={{ opacity: 1 - swap }}>
        <ClipFrame file="incision" at={t - 0.2} slot={tRem - t + 0.2} dur={5.4} tilt={8} label="1 · OPEN" labelAt={t + 0.4} />
      </Abs>
      <Abs top={590} style={{ opacity: swap, scale: String(0.94 + 0.06 * swap) }}>
        <ClipFrame file="chest" at={tRem - 0.25} slot={seg("surgery").end - tRem + 0.5} dur={9.33} offset={1.5} tilt={-6} label="2 · REMOVE TUMOR" labelAt={tRem + 0.2} labelColor={C.green} />
      </Abs>
    </AbsoluteFill>
  );
};

/* 8 · His own IV, in his hand */
export const SIV6: React.FC = () => {
  const s = useSec();
  const t = seg("iv").start;
  const tHand = w("iv", "hand,");
  const swap = ramp(s, w("iv", "keep") - 0.2, w("iv", "keep") + 0.3);
  return (
    <AbsoluteFill>
      <Title at={t} eyebrow="Tiny patient" title="His own IV line" sub="to keep him comfortable and still" color={C.cyan} />
      <Abs top={600} style={{ opacity: 1 - swap }}>
        <ClipFrame file="iv" at={t - 0.2} slot={w("iv", "keep") - t + 0.3} dur={4.5} tilt={-8} label="IV IN HIS HAND" labelAt={tHand} />
      </Abs>
      <Abs top={600} style={{ opacity: swap, scale: String(0.94 + 0.06 * swap) }}>
        <ClipFrame file="recovery" at={w("iv", "keep") - 0.2} slot={seg("iv").end - w("iv", "keep") + 0.6} dur={2.47} tilt={6} label="REAL PHOTO" labelAt={w("iv", "keep") + 0.2} labelColor={C.gold} />
      </Abs>
    </AbsoluteFill>
  );
};

/* 9 · No recovery room */
export const SRoom6: React.FC = () => {
  const s = useSec();
  const tNo = w("room", "No");
  const strike = clampInterp(s, [tNo, tNo + 0.4], [0, 1], EXPO);
  return (
    <AbsoluteFill>
      <Title at={seg("room").start} eyebrow="After surgery" title="Recovery?" color={C.amber} />
      <Abs top={590}>
        <ClipFrame file="room" at={seg("room").start - 0.2} slot={2.6} dur={1.9} tilt={8} />
      </Abs>
      <Abs top={1250}>
        <div style={{ position: "relative", fontFamily: FONT, fontWeight: 900, fontSize: 84, color: "white", opacity: ramp(s, tNo - 0.2, tNo + 0.1), textShadow: "0 8px 30px rgba(0,0,0,0.8)" }}>
          RECOVERY ROOM
          <div style={{ position: "absolute", left: -10, top: "52%", height: 12, width: `${strike * 106}%`, background: C.red, borderRadius: 8, boxShadow: `0 0 20px ${C.red}`, rotate: "-3deg" }} />
        </div>
      </Abs>
    </AbsoluteFill>
  );
};

/* 10 · Back to the recovery womb */
export const SRWomb6: React.FC = () => {
  const t = seg("rwomb").start;
  const tW = w("rwomb", "recovery");
  return (
    <AbsoluteFill>
      <Title at={t} eyebrow="Placed back inside" title="The recovery womb" color={C.green} />
      <Abs top={590}>
        <ClipFrame file="womb" at={t - 0.2} slot={2.6} dur={6.93} offset={2.5} tilt={-8} />
      </Abs>
      <Abs top={1250}>
        <Kinetic at={tW} text="RECOVERY WOMB" size={84} color={C.green} glow="rgba(83,227,166,0.6)" stagger={0.03} />
      </Abs>
    </AbsoluteFill>
  );
};

/* 11 · 10 more weeks; born at 36 */
export const SHeal6: React.FC = () => {
  const s = useSec();
  const t = seg("heal").start;
  const tBorn = w("heal", "born");
  const baby = clampInterp(s, [tBorn - 0.2, tBorn + 0.5], [0, 1], EXPO);
  return (
    <AbsoluteFill>
      <Title at={t} eyebrow="Healing inside" title={s < tBorn - 0.1 ? "10 more weeks" : "Born at 36 weeks"} color={C.green} />
      <Abs top={540} style={{ opacity: 1 - baby }}>
        <Womb3D size={560} grow={clampInterp(s, [t, tBorn], [0.6, 1])} glow={0.5} />
      </Abs>
      <Abs top={600} style={{ opacity: baby }}>
        <ClipFrame file="baby" at={tBorn - 0.2} slot={seg("heal").end - tBorn + 0.6} dur={2.03} tilt={6} label="RYLAN" labelAt={tBorn + 0.3} labelColor={C.green} />
      </Abs>
      <Abs top={1130} style={{ opacity: 1 - baby }}>
        <WeekBar at={t} from={26} to={36} travel={tBorn - t - 0.3} marks={[[26, "surgery", C.amber], [36, "born", C.green]]} />
      </Abs>
      <Burst at={tBorn + 0.1} x={540} y={830} color={C.green} dist={420} />
    </AbsoluteFill>
  );
};

/* 12 · Only the second success of its kind */
export const SSecond6: React.FC = () => {
  const s = useSec();
  const t = seg("second").start;
  const t2 = w("second", "second");
  const k = clampInterp(s, [t2 - 0.1, t2 + 0.5], [0, 1], EXPO);
  const spin = s * 18;
  return (
    <AbsoluteFill>
      <Title at={t} eyebrow="Medical history" title="Only the 2nd ever" sub="success of its kind in the world" color={C.gold} />
      <Abs top={560}>
        <div style={{ position: "relative", width: 640, height: 640 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                inset: i * 40,
                borderRadius: 999,
                border: `${3 - i}px solid rgba(244,199,106,${0.55 - i * 0.12})`,
                transform: `rotateX(${62 + i * 6}deg) rotateZ(${spin * (i % 2 ? -1 : 1)}deg)`,
                opacity: ramp(s, t + i * 0.15, t + 0.5 + i * 0.15),
              }}
            />
          ))}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 300, lineHeight: 1, color: C.gold, opacity: k, scale: String(0.5 + 0.5 * k), textShadow: "0 0 60px rgba(244,199,106,0.6), 0 20px 50px rgba(0,0,0,0.7)" }}>
              2<span style={{ fontSize: 120 }}>nd</span>
            </div>
          </div>
        </div>
      </Abs>
      <Burst at={t2 + 0.05} x={540} y={880} color={C.gold} dist={380} />
      <Abs top={1250}>
        <Kinetic at={w("second", "world.") - 0.1} text="IN THE WORLD" size={76} color="white" stagger={0.03} />
      </Abs>
    </AbsoluteFill>
  );
};

/* 13 · That baby is a patient */
export const SClose16: React.FC = () => {
  const t = seg("close1").start;
  const tP = w("close1", "patient.");
  return (
    <AbsoluteFill>
      <Title at={t} eyebrow="The big idea" title="A patient before birth" color={C.cyan} />
      <Abs top={590}>
        <ClipFrame file="family" at={t - 0.2} slot={seg("close1").end - t + 0.5} dur={3.0} tilt={-6} />
      </Abs>
      <Abs top={1250}>
        <Slam at={tP} text="A PATIENT" color={C.cyan} size={78} rotate={-4} />
      </Abs>
    </AbsoluteFill>
  );
};

/* 14 · A patient is a person, no matter how small */
export const SClose26: React.FC = () => {
  const s = useSec();
  const t = seg("close2").start;
  return (
    <AbsoluteFill>
      <Abs top={470} style={{ opacity: ramp(s, t, t + 0.6) }}>
        <Womb3D size={620} grow={1} glow={0.6} />
      </Abs>
      <div style={{ position: "absolute", top: 1040, left: 0, right: 0 }}>
        <Kinetic at={w("close2", "person,") - 0.05} text="A PERSON," size={110} color="white" stagger={0.035} />
        <Kinetic at={w("close2", "no") - 0.05} text="NO MATTER HOW SMALL" size={72} color={C.cyan} glow="rgba(91,231,255,0.6)" stagger={0.025} style={{ marginTop: 6 }} />
      </div>
      <Cite at={t + 0.4} top={1700}>Story: Cleveland Clinic Fetal Care Center · 2021</Cite>
    </AbsoluteFill>
  );
};

/* 15 · Minimal ending: logo animation + Follow for more content */
export const SOutro6: React.FC = () => {
  const s = useSec();
  const tCta = seg("cta").start;
  const sting = ramp(s, tCta - 0.2, tCta + 0.5, EXPO);
  const dIn = ramp(s, tCta - 0.1, tCta + 0.55, EXPO);
  const pIn = ramp(s, tCta + 0.1, tCta + 0.75, EXPO);
  const word = ramp(s, tCta + 0.6, tCta + 1.2);
  const sweep = ((s - tCta - 0.7) / 1.0) * 160 - 30;
  const tBtn = w("cta", "more") - 0.2;
  const tPress = seg("cta").end + 0.15;
  const pressed = s > tPress;
  return (
    <AbsoluteFill style={{ opacity: sting }}>
      <div style={{ position: "absolute", left: 540 - 210, top: 990, width: 420, height: 300 }}>
        <Img src={staticFile("brand/mark_D.png")} style={{ position: "absolute", left: 0, top: 0, width: 420, translate: `${(1 - dIn) * -420}px 0px`, opacity: dIn, filter: `drop-shadow(0 0 ${20 * (1 - dIn) + 8}px rgba(255,255,255,0.3))` }} />
        <Img src={staticFile("brand/mark_P.png")} style={{ position: "absolute", left: 0, top: 0, width: 420, translate: `${(1 - pIn) * 420}px 0px`, opacity: pIn, filter: `drop-shadow(0 0 ${20 * (1 - pIn) + 12}px rgba(47,196,214,0.6))` }} />
        <div style={{ position: "absolute", inset: -20, background: `linear-gradient(105deg, transparent ${sweep}%, rgba(255,255,255,0.5) ${sweep + 8}%, transparent ${sweep + 16}%)`, mixBlendMode: "overlay", maskImage: `url(${staticFile("brand/mark_color.png")})`, maskSize: "420px auto", maskRepeat: "no-repeat", maskPosition: "20px 20px" }} />
      </div>
      <Abs top={1318} style={{ opacity: word, translate: `0px ${(1 - word) * 30}px` }}>
        <Img src={staticFile("brand/wordmark_on_dark.png")} style={{ width: 600 }} />
      </Abs>
      <Abs top={1450} style={{ opacity: ramp(s, w("cta", "Follow"), w("cta", "Follow") + 0.4), alignItems: "center" }}>
        <div style={{ padding: "18px 64px", borderRadius: 999, fontFamily: FONT, fontWeight: 800, fontSize: 44, color: pressed ? C.teal : "#03142A", background: pressed ? "transparent" : `linear-gradient(135deg, ${C.cyan}, ${C.teal})`, border: `3px solid ${C.teal}`, scale: String(s > tPress - 0.1 && s < tPress + 0.1 ? 0.9 : 1), boxShadow: pressed ? "none" : `0 0 40px ${C.teal}88` }}>
          {pressed ? "✓ Following" : "Follow"}
        </div>
      </Abs>
      <Abs top={1580} style={{ opacity: ramp(s, tBtn, tBtn + 0.5) }}>
        <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 46, color: C.cyan }}>for more content like this</div>
      </Abs>
      <Burst at={tPress} x={540} y={1490} color={C.teal} dist={260} />
    </AbsoluteFill>
  );
};
