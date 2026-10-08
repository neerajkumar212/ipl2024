// Clara's narration (af_heart voice, Dr Pharmacist Ep2), transcribed with phrase
// onsets in seconds. `end` marks a phrase followed by a pause.
export type Phrase = { t: number; text: string; end?: number };

export const PHRASES: Phrase[] = [
  { t: 0.0, text: "Hi," },
  { t: 0.25, text: "I'm Clara!" },
  { t: 1.0, text: "This year's Nobel" },
  { t: 2.0, text: "Prize in Medicine" },
  { t: 3.0, text: "went to three" },
  { t: 3.75, text: "scientists who found" },
  { t: 5.0, text: "a way to" },
  { t: 5.5, text: "switch brain cells" },
  { t: 6.75, text: "on and off," },
  { t: 7.5, text: "with light.", end: 9.4 },
  { t: 9.75, text: "Sounds like sci-fi," },
  { t: 11.0, text: "right?" },
  { t: 11.5, text: "It's real," },
  { t: 12.25, text: "and it's called" },
  { t: 13.0, text: "optogenetics." },
  { t: 14.0, text: "Opto means light," },
  { t: 15.25, text: "genetics means genes.", end: 16.75 },
  { t: 17.25, text: "Okay," },
  { t: 17.75, text: "quick basics." },
  { t: 18.5, text: "You have about" },
  { t: 19.5, text: "86 billion neurons," },
  { t: 21.25, text: "and they talk" },
  { t: 22.0, text: "using tiny electrical" },
  { t: 23.25, text: "signals." },
  { t: 24.25, text: "For years," },
  { t: 25.0, text: "scientists could" },
  { t: 25.75, text: "only watch which" },
  { t: 26.75, text: "brain areas lit" },
  { t: 27.5, text: "up." },
  { t: 27.75, text: "But here's the" },
  { t: 28.5, text: "catch." },
  { t: 29.25, text: "Think about firefighters." },
  { t: 30.5, text: "You always see" },
  { t: 31.25, text: "them at a" },
  { t: 31.75, text: "fire," },
  { t: 32.0, text: "but they don't" },
  { t: 32.75, text: "cause the fire.", end: 33.75 },
  { t: 34.0, text: "Same with the" },
  { t: 34.75, text: "brain." },
  { t: 35.25, text: "Cells firing at" },
  { t: 36.0, text: "the same time" },
  { t: 36.75, text: "as a behaviour" },
  { t: 37.75, text: "doesn't prove they" },
  { t: 38.75, text: "caused it.", end: 39.6 },
  { t: 40.0, text: "So the answer" },
  { t: 40.75, text: "came from a" },
  { t: 41.5, text: "really weird place." },
  { t: 42.75, text: "Pond scum!", end: 43.5 },
  { t: 43.75, text: "A tiny green" },
  { t: 44.5, text: "alga that swims" },
  { t: 45.5, text: "towards light." },
  { t: 46.5, text: "In the early" },
  { t: 47.25, text: "2000s," },
  { t: 48.0, text: "Peter Hegemann and" },
  { t: 49.25, text: "Georg Nagel found" },
  { t: 50.25, text: "the protein that" },
  { t: 51.25, text: "lets it sense" },
  { t: 52.25, text: "light.", end: 53.0 },
  { t: 53.25, text: "It's called channelrhodopsin," },
  { t: 55.0, text: "and it works" },
  { t: 55.5, text: "like a door." },
  { t: 56.5, text: "Blue light opens" },
  { t: 57.25, text: "it," },
  { t: 57.75, text: "charged particles" },
  { t: 58.5, text: "rush in," },
  { t: 59.25, text: "and the cell" },
  { t: 60.0, text: "gets a signal.", end: 61.0 },
  { t: 61.5, text: "Then in 2005," },
  { t: 63.0, text: "Karl Deisseroth's" },
  { t: 64.0, text: "lab at Stanford" },
  { t: 65.0, text: "put that protein" },
  { t: 66.0, text: "into nerve cells." },
  { t: 67.0, text: "Flash blue light," },
  { t: 68.25, text: "and the neuron" },
  { t: 69.25, text: "fires." },
  { t: 69.75, text: "Like a remote" },
  { t: 70.5, text: "control!", end: 71.5 },
  { t: 71.75, text: "In mice," },
  { t: 72.5, text: "flipping one set" },
  { t: 73.25, text: "of neurons could" },
  { t: 74.25, text: "trigger fear." },
  { t: 75.25, text: "Flipping another" },
  { t: 76.0, text: "could change how" },
  { t: 77.0, text: "they move." },
  { t: 77.75, text: "Finally," },
  { t: 78.25, text: "scientists could" },
  { t: 79.25, text: "prove cause," },
  { t: 80.0, text: "not just watch.", end: 81.25 },
  { t: 81.75, text: "And it's reaching" },
  { t: 82.75, text: "patients." },
  { t: 83.5, text: "Last month," },
  { t: 84.25, text: "the FDA accepted" },
  { t: 85.25, text: "an application for" },
  { t: 86.5, text: "an optogenetic eye" },
  { t: 87.25, text: "injection," },
  { t: 88.0, text: "for people losing" },
  { t: 89.75, text: "sight to retinitis" },
  { t: 90.75, text: "pigmentosa.", end: 92.0 },
  { t: 92.25, text: "It's not treating" },
  { t: 93.25, text: "brain disorders" },
  { t: 94.25, text: "in people yet." },
  { t: 95.0, text: "But it helps" },
  { t: 95.75, text: "researchers map" },
  { t: 96.75, text: "faulty circuits" },
  { t: 97.5, text: "in Parkinson's," },
  { t: 98.5, text: "depression and schizophrenia," },
  { t: 100.25, text: "so new medicines" },
  { t: 101.25, text: "can target the" },
  { t: 102.0, text: "right spot.", end: 103.25 },
  { t: 103.75, text: "Three scientists," },
  { t: 104.75, text: "one tiny alga," },
  { t: 105.75, text: "and a brand" },
  { t: 106.25, text: "new way to" },
  { t: 107.0, text: "understand the brain.", end: 108.0 },
  { t: 109.0, text: "Follow Dr Pharmacist" },
  { t: 110.25, text: "for more science," },
  { t: 111.0, text: "made simple!", end: 112.2 },
];

// Words that get the accent colour in captions.
export const KEYWORDS = new Set(
  [
    "clara", "nobel", "medicine", "light", "sci-fi", "real", "optogenetics", "opto", "genetics", "genes",
    "86", "billion", "neurons", "electrical", "watch", "catch", "firefighters", "fire", "cause", "caused",
    "brain", "behaviour", "prove", "pond", "scum", "alga", "hegemann", "nagel", "protein",
    "channelrhodopsin", "door", "blue", "signal", "2005", "deisseroth's", "stanford", "fires", "remote",
    "control", "fear", "move", "patients", "fda", "optogenetic", "eye", "injection", "sight",
    "retinitis", "pigmentosa", "not", "parkinson's", "depression", "schizophrenia", "medicines",
    "target", "spot", "three", "understand", "pharmacist", "science", "simple",
  ],
);

export type Word = { text: string; start: number; end: number; key: boolean };
export type Line = { start: number; end: number; words: Word[] };

const clean = (w: string) => w.toLowerCase().replace(/[^a-z0-9'-]/g, "");

// Spread each phrase's words across its time slot, weighted by length.
export const LINES: Line[] = PHRASES.map((p, i) => {
  const next = PHRASES[i + 1];
  const slotEnd = p.end ?? (next ? next.t : p.t + 1.2);
  const speechEnd = Math.min(slotEnd, p.t + 0.42 * p.text.split(" ").length + 0.35);
  const parts = p.text.split(" ");
  const weights = parts.map((w) => Math.max(2, w.length) + 1.5);
  const total = weights.reduce((a, b) => a + b, 0);
  let cursor = p.t;
  const words = parts.map((w, j) => {
    const d = ((speechEnd - p.t) * weights[j]) / total;
    const word = { text: w, start: cursor, end: cursor + d, key: KEYWORDS.has(clean(w)) };
    cursor += d;
    return word;
  });
  return { start: p.t, end: slotEnd, words };
});

export const TOTAL_SECONDS = 114.3;
