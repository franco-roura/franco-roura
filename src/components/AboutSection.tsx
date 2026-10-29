import { HudLabel, Panel, SectionHeader, Tag, type TagProps } from "./m1";

type ToolkitTier = {
  label: string;
  note: string;
  tone?: TagProps["tone"];
  items: string[];
};

const toolkit: ToolkitTier[] = [
  {
    label: "Core",
    note: "My strongest suit",
    tone: "signal",
    items: ["TypeScript", "React", "Next.js", "Python", "AWS", "Terraform", "SST", "Docker", "Postgres", "Sentry"],
  },
  {
    label: "Working knowledge",
    note: "Can find my way around",
    items: ["C#", "Kubernetes", "MongoDB", "GCP", "Azure", "Grafana stack"],
  },
  {
    label: "Learning",
    note: "Picking up because I like them",
    tone: "tint",
    items: ["Go", "Rust", "DynamoDB"],
  },
  {
    label: "Used before",
    note: "Back in the day",
    tone: "outline",
    items: ["Java", "PHP", "MySQL", "Angular", "Vue", "jQuery"],
  },
];

export const AboutSection = () => {
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
        <HudLabel code="A-02">Toolkit</HudLabel>

        <Panel bodyClassName="p-0 overflow-hidden">
          <dl className="divide-y divide-seam">
            {toolkit.map((tier) => (
              <div
                key={tier.label}
                className="grid gap-3 p-6 md:grid-cols-[220px_1fr] md:gap-8"
              >
                <dt className="flex flex-col gap-1">
                  <span className="m1-hud">{tier.label}</span>
                  <span className="text-sm text-ink-soft">{tier.note}</span>
                </dt>
                <dd className="flex flex-wrap items-start content-start gap-2">
                  {tier.items.map((item) => (
                    <Tag key={item} tone={tier.tone}>
                      {item}
                    </Tag>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </section>
  );
};
