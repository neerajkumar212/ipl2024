import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LINES } from "../data/script";
import { C, FONT } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Word-by-word karaoke captions: words pop in on time, the spoken word sits on a glowing pill. */
export const Captions: React.FC<{ hideFrom?: number }> = ({ hideFrom = 1e9 }) => {
  const frame = useCurrentFrame();
  const s = frame / 30;
  // Latest line that has started; it lingers 0.15 s past its end before fading.
  const line = [...LINES].reverse().find((l) => s >= l.start);
  if (line && s >= line.end + 0.15) return null;
  if (!line || s > hideFrom) return null;

  const enter = interpolate(s, [line.start, line.start + 0.14], [0, 1], clamp);
  const leave = interpolate(s, [line.end - 0.05, line.end + 0.15], [1, 0], clamp);

  return (
    <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "center", top: 1430, pointerEvents: "none" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "6px 14px",
          maxWidth: 900,
          padding: "18px 30px",
          borderRadius: 34,
          background: "rgba(6,14,34,0.55)",
          border: `1.5px solid ${C.glassEdge}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
          opacity: enter * leave,
          translate: `0px ${(1 - enter) * 24}px`,
          scale: String(0.94 + 0.06 * enter),
        }}
      >
        {line.words.map((w, i) => {
          const shown = interpolate(s, [w.start - 0.02, w.start + 0.1], [0, 1], clamp);
          const active = s >= w.start && s < w.end + 0.08;
          const pill = interpolate(s, [w.start, w.start + 0.08, w.end + 0.02, w.end + 0.12], [0, 1, 1, 0], clamp);
          return (
            <span
              key={i}
              style={{
                position: "relative",
                isolation: "isolate",
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 64,
                lineHeight: 1.12,
                letterSpacing: -0.5,
                color: active ? "#03142A" : w.key ? C.cyan : C.ink,
                opacity: 0.25 + 0.75 * shown,
                translate: `0px ${(1 - shown) * 10}px`,
                scale: String(active ? 1 + 0.06 * pill : 1),
                padding: "0 10px",
                textShadow: active ? "none" : "0 4px 18px rgba(0,0,0,0.6)",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: "4px 0 2px 0",
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${C.cyan}, ${C.teal})`,
                  boxShadow: `0 0 28px rgba(91,231,255,0.65)`,
                  opacity: pill,
                  zIndex: -1,
                }}
              />
              {w.text}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
