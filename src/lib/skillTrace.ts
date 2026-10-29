import { createContext } from "react";

export type SkillTrace = {
  // What the timeline is highlighting: a hovered tag wins over a pinned one
  active: string | null;
  pinned: string | null;
  setHovered: (skill: string | null) => void;
  setPinned: (skill: string | null) => void;
};

export const SkillTraceContext = createContext<SkillTrace | null>(null);
