// The TV's parts as they appear in the exploded view: how far each moves, where its
// balloon sits (in the part's own space), and the bill-of-materials line it stands for.
export type TvPartId = "shell" | "screen" | "trim" | "base" | "io";

export type TvPart = {
  id: TvPartId;
  code: string;
  name: string;
  value: string;
  explode: [number, number, number];
  balloon: [number, number, number];
};

export const tvParts: TvPart[] = [
  {
    id: "shell",
    code: "X-01",
    name: "Shell",
    value: "React 19 + TypeScript",
    explode: [0, 0, -0.9],
    balloon: [-1.05, 0.55, 0],
  },
  {
    id: "screen",
    code: "X-02",
    name: "Screen",
    value: "Three.js + React Three Fiber",
    explode: [-0.15, 0.05, 0.9],
    balloon: [-0.2, -0.62, 0.55],
  },
  {
    id: "trim",
    code: "X-03",
    name: "Trim",
    value: "Module/01 tokens + Tailwind v4",
    explode: [0, 0.45, 0.1],
    balloon: [0.15, 0.95, 0],
  },
  {
    id: "base",
    code: "X-04",
    name: "Base",
    value: "Vite + Bun",
    explode: [0, -0.5, 0],
    balloon: [0.55, -1.25, 0],
  },
  {
    id: "io",
    code: "X-05",
    name: "I/O",
    value: "JSON-LD for the robots",
    explode: [0.55, -0.05, 0.55],
    balloon: [0.75, -0.45, 0.55],
  },
];
