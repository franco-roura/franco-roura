import { Zap, Shield, TestTube } from "lucide-react";
import { Panel, SectionHeader } from "./m1";

export const WorkingStyleSection = () => {
  const principles = [
    {
      icon: Zap,
      text: "I value simplicity, automation, and fun (in code and in life).",
    },
    {
      icon: Shield,
      text: "I move fast, but never break things I can model properly first.",
    },
    {
      icon: TestTube,
      text: "I write tests because future-me deserves kindness.",
    },
  ];

  return (
    <section className="flex flex-col gap-12">
      <SectionHeader
        id="approach"
        code="S-03"
        label="Principles"
        index="03 / 05"
        title="How I work"
      />

      <Panel serial="H-00">
        <ul className="divide-y divide-seam">
          {principles.map((principle, index) => {
            const Icon = principle.icon;
            return (
              <li
                key={principle.text}
                className="flex flex-col items-start gap-3 py-5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="flex items-center gap-4 shrink-0">
                  <span className="m1-hud m1-hudlabel-code">H-0{index + 1}</span>
                  <Icon className="w-6 h-6" strokeWidth={1.25} />
                </div>
                <p className="text-[17px] sm:text-[19px] leading-[1.55]">
                  {principle.text}
                </p>
              </li>
            );
          })}
        </ul>
      </Panel>
    </section>
  );
};
