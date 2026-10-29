import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HudLabel } from "./HudLabel";
import { TickRuler } from "./TickRuler";

export type SectionHeaderProps = {
  title: ReactNode;
  id?: string;
  code?: string;
  label?: ReactNode;
  index?: string;
  aside?: ReactNode;
  ruler?: boolean;
  as?: "h1" | "h2" | "h3";
  className?: string;
};

export const SectionHeader = ({
  title,
  id,
  code,
  label,
  index,
  aside,
  ruler = true,
  as: Heading = "h2",
  className,
}: SectionHeaderProps) => (
  <header id={id} className={cn("m1-section", className)}>
    <HudLabel code={code} end={index}>
      {label ?? title}
    </HudLabel>
    <div className="m1-section-top">
      <Heading className="m1-h m1-h-lg">{title}</Heading>
      {aside && <div>{aside}</div>}
    </div>
    {ruler && <TickRuler />}
  </header>
);
