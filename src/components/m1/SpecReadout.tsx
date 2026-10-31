import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SpecItem = {
  label: string;
  value: ReactNode;
};

export type SpecReadoutProps = {
  items: SpecItem[];
  className?: string;
};

export const SpecReadout = ({ items, className }: SpecReadoutProps) => (
  <dl className={cn("m1-spec", className)}>
    {items.map((item) => (
      <div key={item.label}>
        <dt className="m1-hud">{item.label}</dt>
        <dd>{item.value}</dd>
      </div>
    ))}
  </dl>
);
