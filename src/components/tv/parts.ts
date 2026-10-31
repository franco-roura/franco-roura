// The TV's parts as they appear in the exploded view. Each id is a group node in
// /models/tv.glb (built in Blender); its children move by `explode` unless `nodeExplode`
// gives them their own offset. `balloon` is where the part's code sits once exploded.
export type Vec3 = [number, number, number];
export type TvPartId = "shell" | "screen" | "trim" | "base" | "io";

export type TvPart = {
  id: TvPartId;
  code: string;
  name: string;
  value: string;
  explode: Vec3;
  balloon: Vec3;
};

export const tvParts: TvPart[] = [
  {
    id: "shell",
    code: "X-01",
    name: "Shell",
    value: "React 19 + TypeScript",
    explode: [0, 0, -0.9],
    balloon: [-0.9, 0.72, -0.9],
  },
  {
    id: "screen",
    code: "X-02",
    name: "Screen",
    value: "Three.js + React Three Fiber",
    explode: [-0.1, 0.05, 1.0],
    balloon: [-0.3, -0.5, 1.05],
  },
  {
    id: "trim",
    code: "X-03",
    name: "Trim",
    value: "Module/01 tokens + Tailwind v4",
    explode: [0, 0.4, 0],
    balloon: [1.6, 0.45, 0],
  },
  {
    id: "base",
    code: "X-04",
    name: "Base",
    value: "Vite + Bun",
    explode: [0, -0.55, 0],
    balloon: [0.72, -1.62, 0],
  },
  {
    id: "io",
    code: "X-05",
    name: "I/O",
    value: "JSON-LD for the robots",
    explode: [0.25, 0, 0.65],
    balloon: [1.08, -0.62, 1.1],
  },
];

// Parts of a group that fly apart in their own direction: the side pods outward,
// the top grille upward.
export const nodeExplode: Record<string, Vec3> = {
  trim_pod_left: [-0.45, 0, 0],
  trim_pod_right: [0.45, 0, 0],
  trim_gasket_left: [-0.2, 0, 0],
  trim_gasket_right: [0.2, 0, 0],
  io_top_grille: [0, 0.5, 0],
};
