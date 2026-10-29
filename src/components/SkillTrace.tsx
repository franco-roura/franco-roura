import { useMemo, useState, type ReactNode } from "react";
import { SkillTraceContext } from "@/lib/skillTrace";

export const SkillTraceProvider = ({ children }: { children: ReactNode }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);

  const value = useMemo(
    () => ({ active: hovered ?? pinned, pinned, setHovered, setPinned }),
    [hovered, pinned]
  );

  return <SkillTraceContext.Provider value={value}>{children}</SkillTraceContext.Provider>;
};
