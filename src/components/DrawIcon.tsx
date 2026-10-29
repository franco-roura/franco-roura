import type { LucideIcon } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

type DrawIconProps = {
  icon: LucideIcon;
  className?: string;
};

// A line icon that traces its strokes: on hover of its panel or row (CSS), or once when it
// scrolls into view on touch screens, where there's no hover.
export const DrawIcon = ({ icon: Icon, className }: DrawIconProps) => {
  const coarse = useMediaQuery("(pointer: coarse)");
  const { ref, inView } = useInView<SVGSVGElement>({ once: true, threshold: 0.6 });

  return (
    <Icon
      ref={ref}
      className={cn("m1-draw-icon", coarse && inView && "is-drawing", className)}
      strokeWidth={1.25}
      aria-hidden="true"
    />
  );
};
