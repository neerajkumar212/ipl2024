import { continueRender, delayRender, staticFile } from "remotion";

// Fonts are bundled in public/fonts (variable woff2) so renders work offline.
const FACES: [string, string, string, string][] = [
  ["Outfit", "fonts/Outfit-var.woff2", "100 900", "normal"],
  ["Fraunces", "fonts/Fraunces-italic-var.woff2", "100 900", "italic"],
  ["JetBrains Mono", "fonts/JetBrainsMono-var.woff2", "100 800", "normal"],
];

if (typeof document !== "undefined") {
  const handle = delayRender("Loading fonts");
  Promise.all(
    FACES.map(([family, file, weight, style]) => {
      const face = new FontFace(family, `url(${staticFile(file)}) format("woff2")`, { weight, style });
      document.fonts.add(face);
      return face.load();
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}

export const FONT = "Outfit, sans-serif";
export const SERIF = "Fraunces, serif";
export const MONO = "'JetBrains Mono', monospace";

export const C = {
  bg0: "#030814",
  bg1: "#071430",
  ink: "#EAF6FF",
  dim: "#8FA8C8",
  faint: "rgba(143,168,200,0.35)",
  teal: "#1FC8D6", // Dr Pharmacist brand
  cyan: "#5BE7FF",
  blue: "#3D8BFF", // optogenetic blue light
  violet: "#8B7BFF",
  gold: "#F4C76A",
  goldDeep: "#B8862F",
  green: "#53E3A6",
  red: "#FF5A5F",
  amber: "#FFB547",
  glass: "rgba(14,30,62,0.62)",
  glassEdge: "rgba(120,200,255,0.22)",
};

export const W = 1080;
export const H = 1920;
export const FPS = 30;
