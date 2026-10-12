import React from "react";
import { Video } from "@remotion/media";
import { Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { ramp, usePop, useSec } from "../lib/anim";
import { C, FONT, MONO } from "../theme";
import { Comment, Pill } from "../v4/art4";
import { seg, w } from "./timing";

/* Episode 4 cards: B-roll clips cut from the user's reference reel, plus a few info cards. */

export const CARD = { x: 90, y: 1030, w: 900, h: 648 };

const pop = (k: number) => ({ scale: String(0.6 + 0.4 * k), opacity: Math.min(1, k * 1.4) });

const Chip: React.FC<{ at: number; children: React.ReactNode; color?: string; pos?: "tl" | "bl" | "tr" }> = ({ at, children, color = C.cyan, pos = "bl" }) => {
  const k = usePop(at);
  const place: React.CSSProperties = pos === "tl" ? { left: 28, top: 28 } : pos === "tr" ? { right: 28, top: 28 } : { left: 28, bottom: 28 };
  return (
    <div style={{ position: "absolute", ...place, ...pop(k), transformOrigin: pos === "bl" ? "0% 100%" : "0% 0%" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, letterSpacing: 0.5, color: "#071018", background: color, padding: "10px 22px", borderRadius: 16, boxShadow: "0 10px 26px rgba(0,0,0,0.5)" }}>
        {children}
      </div>
    </div>
  );
};

/** A clip from the user's library, slowed slightly to fill its slot and looped if needed. */
const Clip: React.FC<{ file: string; dur: number; from: number; slot: number; offset?: number }> = ({ file, dur, from, slot, offset = 0 }) => {
  const rate = Math.max(0.6, Math.min(1, (dur - offset) / slot));
  const frame = useCurrentFrame();
  const zoom = 1.04 + 0.04 * Math.sin(frame / 90);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <Sequence from={Math.round(from * 30)} layout="none">
        <Video src={staticFile(`ep4/${file}.mp4`)} muted loop playbackRate={rate} trimBefore={Math.round(offset * 30)} style={{ width: "100%", height: "100%", objectFit: "cover", scale: String(zoom) }} />
      </Sequence>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)" }} />
    </div>
  );
};

type Slot = { from: number; to: number };
export type CardDef = Slot & { C: React.FC<Slot> };

const clip = (file: string, dur: number, chip?: (s: Slot) => React.ReactNode, offset = 0): React.FC<Slot> => {
  const Comp: React.FC<Slot> = (sl) => (
    <>
      <Clip file={file} dur={dur} from={sl.from} slot={sl.to - sl.from} offset={offset} />
      {chip ? chip(sl) : null}
    </>
  );
  return Comp;
};

export const CBaby = clip("baby", 2.03);
export const CBabyMeet = clip("baby", 2.03, () => <Chip at={w("meet", "Rylan.")}>RYLAN</Chip>);
export const CTumor = clip("tumor", 5.0, () => (
  <>
    <Chip at={w("scan", "25")} pos="tl" color={C.gold}>25 WEEKS</Chip>
    <Chip at={w("scan", "teratoma,")} color={C.red}>TERATOMA</Chip>
  </>
));
export const CTeam = clip("team", 2.43, () => (
  <>
    <Chip at={w("decide", "Cleveland")} pos="tl" color={C.cyan}>CLEVELAND CLINIC</Chip>
    <Chip at={w("decide", "26")} color={C.gold}>26 WEEKS · MAY 2021</Chip>
  </>
));
export const CIncision = clip("incision", 5.4);
export const CWomb = clip("womb", 6.93, () => <Chip at={w("back", "back")} color={C.green}>BACK INSIDE</Chip>, 3.0);
export const CIV = clip("iv", 4.5, () => <Chip at={w("pharm", "patient")} color={C.cyan}>HIS OWN IV</Chip>);
export const CChest = clip("chest", 9.33, () => (
  <>
    <Chip at={w("para", "vecuronium,")} pos="tl" color={C.violet}>VECURONIUM</Chip>
    <Chip at={w("para", "Norcuron,")} color={C.gold}>BRAND: NORCURON</Chip>
  </>
));
export const CRecovery = clip("recovery", 2.47, () => <Chip at={w("womb", "womb.")} color={C.green}>RECOVERY WOMB</Chip>);
export const CFamily = clip("family", 3.0, () => (
  <>
    <Chip at={w("born", "36")} pos="tl" color={C.gold}>BORN AT 36 WEEKS</Chip>
    <Chip at={w("born", "home")} color={C.green}>HOME WITHIN DAYS</Chip>
  </>
));
export const CBabyClose = clip("baby", 2.03);

/* ---------------------------------------------------------------- info cards */

const Panel: React.FC<{ children: React.ReactNode; tag: string; color?: string; src?: string }> = ({ children, tag, color = C.teal, src }) => (
  <>
    <div style={{ position: "absolute", left: 36, top: 32, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 12, height: 12, borderRadius: 6, background: color, boxShadow: `0 0 12px ${color}` }} />
      <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 22, letterSpacing: 4, color }}>{tag}</div>
    </div>
    {children}
    {src ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 24, textAlign: "center", fontFamily: MONO, fontSize: 19, color: "rgba(190,210,230,0.75)" }}>{src}</div> : null}
  </>
);

const Heart: React.FC<{ beat: number; fail: number }> = ({ beat, fail }) => (
  <svg width={300} height={280} viewBox="0 0 100 92" style={{ scale: String(1 + 0.06 * beat) }}>
    <path d="M50 88 C20 66 4 50 4 30 C4 14 16 4 30 4 C40 4 46 10 50 16 C54 10 60 4 70 4 C84 4 96 14 96 30 C96 50 80 66 50 88 Z" fill={fail > 0.5 ? "#C2414A" : "#FF5A5F"} />
    <ellipse cx="30" cy="26" rx="9" ry="6" fill="rgba(255,255,255,0.35)" />
  </svg>
);

export const CFailing: React.FC<Slot> = () => {
  const s = useSec();
  const frame = useCurrentFrame();
  const fluid = ramp(s, w("failing", "Fluid"), w("failing", "up.") + 0.4);
  const fail = ramp(s, w("failing", "fail."), w("failing", "fail.") + 0.4);
  const rate = 1 - 0.5 * fail;
  const beat = Math.pow(Math.max(0, Math.sin((frame / 30) * Math.PI * 2 * 1.6 * rate)), 6);
  return (
    <Panel tag="FETAL HYDROPS" color={C.red} src="Cleveland Clinic, 2021">
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, display: "flex", justifyContent: "center" }}>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: `radial-gradient(closest-side, rgba(61,139,255,${0.45 * fluid}), transparent)` }} />
          <Heart beat={beat} fail={fail} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 420, display: "flex", gap: 20 }}>
        {[
          ["Fluid building up", fluid, C.blue],
          ["Heart starting to fail", fail, C.red],
        ].map(([t, k, c], i) => (
          <div key={i} style={{ flex: 1, opacity: k as number, translate: `0px ${(1 - (k as number)) * 30}px`, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "white", padding: "18px 10px", borderRadius: 20, background: `${c}26`, border: `2px solid ${c}` }}>
            {t as string}
          </div>
        ))}
      </div>
    </Panel>
  );
};

export const CRare: React.FC<Slot> = () => {
  const s = useSec();
  const t0 = w("rare", "100,000");
  const n = Math.round(100000 * ramp(s, t0 - 0.7, t0 + 0.25));
  const big = usePop(w("rare", "1"));
  return (
    <Panel tag="HOW RARE?" color={C.gold} src="Dr Darrell Cass, Cleveland Clinic">
      <div style={{ position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", ...pop(big) }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: C.dim }}>fewer than</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 170, lineHeight: 1, letterSpacing: -4, color: "white" }}>
          1 <span style={{ fontSize: 90, color: C.gold }}>in</span> {n.toLocaleString("en-US")}
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 48, color: C.gold, marginTop: 14 }}>pregnancies</div>
      </div>
    </Panel>
  );
};

export const CMeds: React.FC<Slot> = () => {
  const p = usePop(seg("meds").start + 0.1);
  const q = usePop(seg("meds").start + 0.6);
  return (
    <Panel tag="💊 PHARMACY CORNER" color={C.gold}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "white", ...pop(p) }}>
        The baby gets his own medicines
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 280, display: "flex", alignItems: "center", gap: 30, padding: "26px 30px", borderRadius: 28, background: "rgba(244,199,106,0.1)", border: `2px solid ${C.gold}`, ...pop(q) }}>
        <Pill size={150} color={C.gold} />
        <div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "white" }}>Pain relief</div>
          <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 32, color: C.dim }}>a strong opioid</div>
        </div>
      </div>
    </Panel>
  );
};

export const CSecond: React.FC<Slot> = () => {
  const s = useSec();
  const big = usePop(seg("second").start + 0.1);
  const k = ramp(s, w("second", "world"), w("second", "world") + 0.6);
  return (
    <Panel tag="CLEVELAND CLINIC" color={C.cyan} src="Cleveland Clinic patient story, 2021">
      <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", ...pop(big) }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 230, lineHeight: 1, color: C.cyan, letterSpacing: -6 }}>
          2<span style={{ fontSize: 110 }}>nd</span>
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 380, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 44, lineHeight: 1.15, color: "white", opacity: k }}>
        academic center in the world to succeed with this fetal heart surgery
      </div>
    </Panel>
  );
};

export const CPoll: React.FC<Slot> = () => {
  const s = useSec();
  const t0 = seg("cta").start;
  const a = usePop(t0 + 0.2);
  const b = usePop(t0 + 0.45);
  const c = ramp(s, w("cta", "comments."), w("cta", "comments.") + 0.4);
  const frame = useCurrentFrame();
  return (
    <Panel tag="YOUR TAKE" color={C.cyan}>
      <div style={{ position: "absolute", left: 50, right: 50, top: 100, fontFamily: FONT, fontWeight: 900, fontSize: 54, lineHeight: 1.08, color: "white", textAlign: "center" }}>Would you trust surgery before birth?</div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 290, display: "flex", gap: 30 }}>
        <div style={{ flex: 1, height: 130, borderRadius: 30, background: C.green, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "#0B1626", ...pop(a) }}>YES</div>
        <div style={{ flex: 1, height: 130, borderRadius: 30, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 60, color: "white", ...pop(b) }}>NO</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", justifyContent: "center", alignItems: "center", gap: 18, opacity: c, translate: `0px ${-Math.abs(Math.sin(frame / 7)) * 10 * c}px` }}>
        <Comment size={70} />
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 38, color: C.ink }}>Tell me in the comments</div>
      </div>
    </Panel>
  );
};

export const EndCard: React.FC = () => {
  const s = useSec();
  const l = ramp(s, seg("outro").start, seg("outro").start + 0.7);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1360, display: "flex", justifyContent: "center", opacity: l, translate: `0px ${(1 - l) * 30}px` }}>
      <Img src={staticFile("brand/logo_on_dark.png")} style={{ height: 170 }} />
    </div>
  );
};
