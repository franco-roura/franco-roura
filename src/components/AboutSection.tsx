import { useState } from "react";
import { toolkit } from "@/data/toolkit";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useSkillTrace } from "@/hooks/useSkillTrace";
import { skillKey, skillReadout } from "@/lib/skills";
import { cn } from "@/lib/utils";
import { HudLabel, Panel, SectionHeader, Tag } from "./m1";

export const AboutSection = () => {
  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const { pinned, setPinned } = useSkillTrace();
  const [focused, setFocused] = useState<string | null>(null);

  // Pin the skill and jump to the timeline, where the trace is visible
  const trace = (skill: string) => {
    const alreadyPinned = pinned !== null && skillKey(pinned) === skillKey(skill);
    setPinned(alreadyPinned ? null : skill);
    if (!alreadyPinned) {
      document.getElementById("experience")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  };

  return (
    <section className="flex flex-col gap-12">
      <SectionHeader
        id="about"
        code="S-01"
        label="Profile"
        index="01 / 05"
        title="About"
      />

      <Panel serial="A-01">
        <p className="text-[19px] leading-[1.55] max-w-[44em]">
          I'm a software architect who thrives on solving complex problems
          with simple, scalable solutions. I speak fluent backend, dabble in
          DevOps, and can make frontend behave. When I'm not writing code, I'm
          probably redesigning it in my head. I do enjoy playing video games
          every once in a while, but I always end up reverse engineering them.
        </p>
      </Panel>

      <div className="flex flex-col gap-4">
        <HudLabel code="A-02" end={finePointer ? "Hover a key · click to trace" : "Tap a key to trace"}>
          Toolkit
        </HudLabel>

        <Panel bodyClassName="p-0 overflow-hidden">
          <dl className="divide-y divide-seam">
            {toolkit.map((tier, tierIndex) => {
              const readoutId = `toolkit-readout-${tierIndex}`;
              const focusedHere = focused !== null && tier.items.includes(focused);
              return (
                <div
                  key={tier.label}
                  className="grid gap-3 p-6 md:grid-cols-[220px_1fr] md:gap-8"
                >
                  <dt className="flex flex-col gap-1">
                    <span className="m1-hud">{tier.label}</span>
                    <span className="text-sm text-ink-soft">{tier.note}</span>
                    <span id={readoutId} className={cn("m1-readout m1-micro", focusedHere && "is-on")}>
                      {focusedHere ? skillReadout(focused, tier.label) : ""}
                    </span>
                  </dt>
                  <dd className="flex flex-wrap items-start content-start gap-2">
                    {tier.items.map((item) => (
                      <Tag
                        key={item}
                        interactive
                        tone={tier.tone}
                        className="m1-key"
                        pressed={pinned !== null && skillKey(pinned) === skillKey(item)}
                        aria-describedby={focused === item ? readoutId : undefined}
                        onPointerEnter={() => setFocused(item)}
                        onPointerLeave={() => setFocused(null)}
                        onFocus={() => setFocused(item)}
                        onBlur={() => setFocused(null)}
                        onClick={() => trace(item)}
                      >
                        {item}
                      </Tag>
                    ))}
                  </dd>
                </div>
              );
            })}
          </dl>
        </Panel>
      </div>
    </section>
  );
};
