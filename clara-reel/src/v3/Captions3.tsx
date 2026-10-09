import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, FONT } from "../theme";
import { SEGS, TWord } from "./timing";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const KEY = new Set(
  "parkinson's pill fda approval first tavapadon juvmo dopamine die tremor stiffness switches receptors d1 d2 d3 d5 pramipexole ropinirole partial agonist half-life daily once tablet tempo 10 placebo levodopa hour dyskinesia nausea headache dizziness hallucinations gambling shopping pharmacist cyp3a itraconazole carbamazepine raise lowers titration six weeks 5 mg head-to-head option cure target choice clara medicine simple".split(
    " ",
  ),
);
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9']/g, "");

type Chunk = { words: TWord[]; start: number; end: number };

// Group words into short, punchy chunks (≤4 words, break on punctuation).
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  SEGS.forEach((sg) => {
    let cur: TWord[] = [];
    sg.words.forEach((wd, i) => {
      cur.push(wd);
      const last = i === sg.words.length - 1;
      if (last || /[.,?!:…]$/.test(wd.text) || cur.length >= 4) {
        out.push({ words: cur, start: cur[0].start, end: cur[cur.length - 1].end });
        cur = [];
      }
    });
  });
  return out.map((c, i) => {
    const next = out[i + 1];
    const end = next && next.start - c.end < 0.6 ? next.start : c.end + 0.25;
    return { ...c, end };
  });
})();

export const Captions3: React.FC = () => {
  const frame = useCurrentFrame();
  const s = frame / 30;
  const chunk = CHUNKS.find((c) => s >= c.start - 0.04 && s < c.end);
  if (!chunk) return null;
  const outK = interpolate(s, [chunk.end - 0.08, chunk.end], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ top: 1415, height: 260, alignItems: "center", justifyContent: "flex-start", pointerEvents: "none" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0px 0px", maxWidth: 960, opacity: outK }}>
        {chunk.words.map((wd, i) => {
          const k = interpolate(s, [wd.start - 0.06, wd.start + 0.1], [0, 1], clamp);
          const active = s >= wd.start - 0.02 && s < wd.end + 0.05;
          const key = KEY.has(norm(wd.text));
          return (
            <span
              key={i}
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 74,
                lineHeight: 1.12,
                letterSpacing: -1,
                padding: "0 15px",
                display: "inline-block",
                opacity: 0.35 + 0.65 * k,
                translate: `0px ${(1 - k) * 18}px`,
                scale: String(active ? 1.04 : 1),
                color: active ? C.cyan : key ? "#9DEBFF" : "#FFFFFF",
                textShadow: active
                  ? `0 0 26px rgba(91,231,255,0.85), 0 6px 22px rgba(0,0,0,0.85)`
                  : "0 6px 22px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.9)",
              }}
            >
              {wd.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
