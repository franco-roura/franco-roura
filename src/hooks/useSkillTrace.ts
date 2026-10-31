import { useContext } from "react";
import { SkillTraceContext } from "@/lib/skillTrace";

export const useSkillTrace = () => {
  const trace = useContext(SkillTraceContext);
  if (!trace) throw new Error("useSkillTrace must be used inside <SkillTraceProvider>");
  return trace;
};
