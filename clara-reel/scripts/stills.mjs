// Render QA stills at given seconds: node scripts/stills.mjs out/qa 0.5 2.5 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const [outDir, ...secs] = process.argv.slice(2);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = process.env.REMOTION_CHROME ?? null;
const composition = await selectComposition({ serveUrl, id: process.env.COMP ?? "ClaraOptogeneticsV2", browserExecutable });
for (const s of secs) {
  const frame = Math.round(Number(s) * 30);
  await renderStill({ serveUrl, composition, frame, output: `${outDir}/t${String(s).padStart(6, "0")}.jpg`, imageFormat: "jpeg", jpegQuality: 70, browserExecutable });
  process.stdout.write(`${s} `);
}
