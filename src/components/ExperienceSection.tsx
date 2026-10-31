import { useEffect, useRef } from "react";
import { experience } from "@/data/experience";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSkillTrace } from "@/hooks/useSkillTrace";
import { cn } from "@/lib/utils";
import { skillKey, skillReadout } from "@/lib/skills";
import { toolkit } from "@/data/toolkit";
import { ExperienceEntry, SectionHeader, Tag } from "./m1";

const tierOf = (skill: string) =>
  toolkit.find((tier) => tier.items.some((item) => skillKey(item) === skillKey(skill)))?.label ?? "Skill";

// Fills each entry's track as a line at 55% of the viewport passes through it
const useTimelineFill = (reducedMotion: boolean) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const entries = Array.from(list.querySelectorAll<HTMLElement>(".m1-exp"));
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.55;
      for (const entry of entries) {
        const rect = entry.getBoundingClientRect();
        const fill = reducedMotion ? 1 : Math.min(1, Math.max(0, (line - rect.top) / rect.height));
        entry.style.setProperty("--fill", fill.toFixed(3));
        entry.classList.toggle("is-reached", fill > 0.02);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return listRef;
};

export const ExperienceSection = () => {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const listRef = useTimelineFill(reducedMotion);
  const { active, pinned, setHovered, setPinned } = useSkillTrace();
  const activeKey = active ? skillKey(active) : null;

  return (
    <section className="flex flex-col gap-12">
      <SectionHeader
        id="experience"
        code="S-04"
        label="Timeline"
        index="04 / 05"
        title="Experience"
        aside={
          pinned && (
            <button
              type="button"
              className="m1-trace-chip m1-hud"
              onClick={() => setPinned(null)}
              aria-label={`Stop tracing ${pinned}`}
            >
              Tracing {skillReadout(pinned, tierOf(pinned))}
              <span aria-hidden="true">×</span>
            </button>
          )
        }
      />

      <div ref={listRef}>
        {/* Codes follow chronology (E-01 is the first job); newest is listed first */}
        {experience
          .map((company, index) => ({ ...company, code: `E-0${index + 1}` }))
          .reverse()
          .map((company) => {
            const uses = activeKey !== null && company.tech.some((tech) => skillKey(tech) === activeKey);
            return (
              <ExperienceEntry
                key={company.name}
                className={cn(activeKey && (uses ? "is-traced" : "is-dimmed"))}
                code={company.code}
                role={company.role}
                org={
                  <a
                    href={company.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-signal-ink font-semibold hover:underline"
                  >
                    {company.name}
                  </a>
                }
                start={company.start}
                end={company.end}
                current={!company.end}
                points={[company.description]}
                tags={company.tech}
                renderTag={(tag) => {
                  const key = skillKey(tag);
                  return (
                    <Tag
                      interactive
                      tone={key === activeKey ? "signal" : undefined}
                      pressed={pinned !== null && skillKey(pinned) === key}
                      onPointerEnter={() => setHovered(tag)}
                      onPointerLeave={() => setHovered(null)}
                      onFocus={() => setHovered(tag)}
                      onBlur={() => setHovered(null)}
                      onClick={() => setPinned(pinned !== null && skillKey(pinned) === key ? null : tag)}
                    >
                      {tag}
                    </Tag>
                  );
                }}
              />
            );
          })}
      </div>
    </section>
  );
};
