import React from "react";
import { C } from "../theme";
import envelope from "../data/envelope.json";

const ENV = envelope as number[];

export type ClaraMood = "talk" | "happy";

/**
 * Clara — Dr Pharmacist's health companion. Pure SVG so she renders crisp at any size.
 * Mouth is lip-synced to the narration envelope; eyes blink on a fixed rhythm.
 */
export const Clara: React.FC<{
  frame: number; // global frame (for lip-sync + idle motion)
  size: number;
  mood?: ClaraMood;
  wave?: number; // 0..1 how much the right arm waves
  glow?: number;
}> = ({ frame, size, mood = "talk", wave = 0, glow = 1 }) => {
  const s = frame / 30;
  const env = ENV[Math.min(frame, ENV.length - 1)] ?? 0;
  const mouthH = 5 + env * 30;
  const mouthW = 40 + env * 14;

  // Blink: 4 frames, every ~3.4 s with a little jitter.
  const cycle = frame % 102;
  const blink = cycle > 96 ? 0.12 : 1;
  const bob = Math.sin(s * 2.1) * 8;
  const tilt = Math.sin(s * 0.9) * 3 + env * 3;
  const armWave = Math.sin(s * 11) * 22 * wave - 70 * wave;
  const pulse = 0.55 + 0.45 * Math.sin(s * 4);
  const happy = mood === "happy";

  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 400 480" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="cl-aura" cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor={C.cyan} stopOpacity={0.45 * glow} />
          <stop offset="100%" stopColor={C.cyan} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="cl-shell" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="55%" stopColor="#E3EEF9" />
          <stop offset="100%" stopColor="#B9CCE2" />
        </linearGradient>
        <linearGradient id="cl-visor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#13285A" />
          <stop offset="100%" stopColor="#060E26" />
        </linearGradient>
        <filter id="cl-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="200" cy="250" rx="210" ry="230" fill="url(#cl-aura)" />
      <ellipse cx="200" cy="462" rx={95 - bob} ry="12" fill="rgba(0,0,0,0.35)" />

      <g transform={`translate(0 ${bob})`}>
        {/* body */}
        <g>
          <ellipse cx="88" cy="372" rx="26" ry="44" fill="url(#cl-shell)" transform="rotate(18 88 372)" />
          <g transform={`rotate(${armWave} 312 340)`}>
            <ellipse cx="312" cy="372" rx="26" ry="44" fill="url(#cl-shell)" transform="rotate(-18 312 372)" />
          </g>
          <rect x="112" y="300" width="176" height="146" rx="70" fill="url(#cl-shell)" />
          <rect x="146" y="330" width="108" height="72" rx="22" fill="url(#cl-visor)" />
          {/* heartbeat on chest screen */}
          <polyline
            points="156,368 176,368 184,352 194,384 204,358 212,368 244,368"
            fill="none"
            stroke={C.teal}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#cl-glow)"
            strokeDasharray="140"
            strokeDashoffset={140 - ((s * 90) % 140)}
          />
          <g transform="translate(200 424)">
            <rect x="-5" y="-13" width="10" height="26" rx="3" fill={C.teal} />
            <rect x="-13" y="-5" width="26" height="10" rx="3" fill={C.teal} />
          </g>
        </g>

        {/* head */}
        <g transform={`rotate(${tilt} 200 200)`}>
          <line x1="200" y1="70" x2="200" y2="34" stroke="#C9D9EA" strokeWidth="7" strokeLinecap="round" />
          <circle cx="200" cy="28" r="13" fill={C.cyan} opacity={0.5 + 0.5 * pulse} filter="url(#cl-glow)" />
          <circle cx="58" cy="190" r="30" fill="url(#cl-shell)" />
          <circle cx="58" cy="190" r="15" fill="none" stroke={C.teal} strokeWidth="6" opacity={0.6 + 0.4 * pulse} />
          <circle cx="342" cy="190" r="30" fill="url(#cl-shell)" />
          <circle cx="342" cy="190" r="15" fill="none" stroke={C.teal} strokeWidth="6" opacity={0.6 + 0.4 * pulse} />
          <rect x="62" y="66" width="276" height="244" rx="112" fill="url(#cl-shell)" />
          <path d="M110 92 Q200 66 290 92" stroke="white" strokeWidth="10" strokeLinecap="round" opacity="0.8" fill="none" />
          <rect x="94" y="118" width="212" height="152" rx="70" fill="url(#cl-visor)" />
          <rect x="94" y="118" width="212" height="152" rx="70" fill="none" stroke="rgba(91,231,255,0.35)" strokeWidth="3" />

          {/* eyes */}
          <g filter="url(#cl-glow)">
            {happy ? (
              <>
                <path d="M146 192 Q164 166 182 192" stroke={C.cyan} strokeWidth="11" strokeLinecap="round" fill="none" />
                <path d="M218 192 Q236 166 254 192" stroke={C.cyan} strokeWidth="11" strokeLinecap="round" fill="none" />
              </>
            ) : (
              <>
                <rect x="148" y={180 - 22 * blink} width="32" height={44 * blink} rx="16" fill={C.cyan} />
                <rect x="220" y={180 - 22 * blink} width="32" height={44 * blink} rx="16" fill={C.cyan} />
                <circle cx="171" cy={170} r={blink > 0.5 ? 5 : 0} fill="white" opacity="0.9" />
                <circle cx="243" cy={170} r={blink > 0.5 ? 5 : 0} fill="white" opacity="0.9" />
              </>
            )}
            <rect
              x={200 - mouthW / 2}
              y={228 - mouthH / 2}
              width={mouthW}
              height={mouthH}
              rx={Math.min(mouthH, mouthW) / 2}
              fill={C.cyan}
            />
          </g>
          <ellipse cx="128" cy="232" rx="16" ry="9" fill="#FF7FA8" opacity="0.35" />
          <ellipse cx="272" cy="232" rx="16" ry="9" fill="#FF7FA8" opacity="0.35" />
        </g>
      </g>
    </svg>
  );
};
