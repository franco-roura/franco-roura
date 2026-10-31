import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Crosshair } from "../m1";
import { TvCanvas } from "./TvCanvas";
import { usePointerTilt } from "./usePointerTilt";
import { useTestPattern } from "./useScreenTexture";

// The hero TV, tuned to a test pattern: used on the 404 page
export default function NotFoundTV() {
  const [ready, setReady] = useState(false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaQuery("(pointer: fine)");
  const { ref, inView } = useInView<HTMLDivElement>();
  const { pointer } = usePointerTilt(finePointer);
  const pattern = useTestPattern();
  const handleLoaded = useCallback(() => setReady(true), []);

  return (
    <div className="m1-hero-media">
      <div ref={ref} className={cn("m1-hero-tv", ready && "is-ready")}>
        <div className="m1-hero-tv-canvas">
          <TvCanvas
            inView={inView}
            exploded={false}
            reducedMotion={reducedMotion}
            finePointer={finePointer}
            pointer={pointer}
            screen={pattern}
            onLoaded={handleLoaded}
          />
        </div>
        <Crosshair className="m1-hero-tv-cross is-tl" />
        <Crosshair className="m1-hero-tv-cross is-br" />
      </div>
    </div>
  );
}
