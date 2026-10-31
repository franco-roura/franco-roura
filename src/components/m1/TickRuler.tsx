import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

export type TickRulerProps = {
  labels?: string[];
  className?: string;
};

export const TickRuler = ({ labels, className }: TickRulerProps) => {
  const { ref, inView } = useInView<HTMLDivElement>({ once: true });

  return (
    <div ref={ref} className={cn("m1-rulerwrap", inView && "is-drawn", className)} aria-hidden="true">
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
};
