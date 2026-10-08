import timing from "../data/v2timing.json";

export type TWord = { text: string; start: number; end: number };
export type TSeg = { id: string; start: number; end: number; words: TWord[] };

export const SEGS = (timing as { total: number; segments: TSeg[] }).segments;
export const TOTAL = (timing as { total: number }).total;

const byId = Object.fromEntries(SEGS.map((s) => [s.id, s]));

/** Segment by id (throws early if the script and code drift apart). */
export const seg = (id: string): TSeg => {
  const s = byId[id];
  if (!s) throw new Error(`Unknown segment ${id}`);
  return s;
};

/** Start time of the n-th word of a segment that matches `word` (case/punct-insensitive). */
export const w = (id: string, word: string, nth = 0): number => {
  const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9']/g, "");
  // Exact text (incl. punctuation) first, so "in," doesn't match an earlier "in".
  const exact = seg(id).words.filter((x) => x.text === word);
  const hits = exact.length ? exact : seg(id).words.filter((x) => norm(x.text) === norm(word));
  const hit = hits[nth];
  if (!hit) throw new Error(`Word "${word}" not in ${id}`);
  return hit.start;
};
