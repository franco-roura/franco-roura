import { cn } from "@/lib/utils";

export type TickRulerProps = {
  labels?: string[];
  className?: string;
};

export const TickRuler = ({ labels, className }: TickRulerProps) => (
  <div className={cn("m1-rulerwrap", className)} aria-hidden="true">
    <div className="m1-ruler" />
    {labels && (
      <div className="m1-ruler-labels m1-micro">
        {labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    )}
  </div>
);
