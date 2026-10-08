import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
export const INOUT = Easing.bezier(0.65, 0, 0.35, 1);

/** Seconds elapsed in the current Sequence. */
export const useSec = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** 0→1 ramp between two times (seconds), eased. */
export const ramp = (s: number, a: number, b: number, ease = EXPO) =>
  interpolate(s, [a, b], [0, 1], { ...clamp, easing: ease });

/** In at `a`, out at `b`, with fade length `f`. */
export const window = (s: number, a: number, b: number, f = 0.35) =>
  interpolate(s, [a, a + f, b - f, b], [0, 1, 1, 0], clamp);

/** Overshooting pop-in (spring) starting at time `a`. */
export const usePop = (a: number, damping = 11, stiffness = 140) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - a * fps, fps, config: { damping, stiffness, mass: 0.8 } });
};

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const clampInterp = (s: number, i: number[], o: number[], ease?: (t: number) => number) =>
  interpolate(s, i, o, { ...clamp, easing: ease });
