import { useEffect, useState } from "react";

type ScrollReadout = {
  activeId: string | null;
  progress: number;
  marks: number[];
};

// Tracks scroll progress (0–1), which section is under the nav, and where each
// section starts along the progress track.
export const useActiveSection = (ids: string[]) => {
  const [readout, setReadout] = useState<ScrollReadout>({
    activeId: null,
    progress: 0,
    marks: [],
  });
  const key = ids.join(",");

  useEffect(() => {
    const sectionIds = key.split(",");
    let frame = 0;

    const measure = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      const threshold = window.innerHeight * 0.35;

      let activeId: string | null = null;
      const marks = sectionIds.map((id) => {
        const element = document.getElementById(id);
        if (!element) return 0;
        const rect = element.getBoundingClientRect();
        if (rect.top <= threshold) activeId = id;
        const scrollMargin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
        const start = rect.top + window.scrollY - scrollMargin;
        return scrollable > 0 ? Math.min(1, Math.max(0, start / scrollable)) : 0;
      });
      if (progress > 0.995) activeId = sectionIds[sectionIds.length - 1];

      setReadout((previous) =>
        previous.activeId === activeId &&
        previous.progress === progress &&
        previous.marks.join() === marks.join()
          ? previous
          : { activeId, progress, marks }
      );
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [key]);

  return readout;
};
