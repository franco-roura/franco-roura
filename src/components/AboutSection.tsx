import { HudLabel, Panel, SectionHeader } from "./m1";

const toolkit = [
  { label: "Languages", items: ["Go", "TypeScript", "Python"] },
  { label: "Cloud", items: ["AWS", "GCP"] },
  { label: "Infrastructure", items: ["Terraform", "Kubernetes", "CI/CD"] },
  { label: "Observability", items: ["OpenTelemetry", "Grafana stack"] },
  { label: "Frontend", items: ["React", "Next.js"] },
  { label: "Architecture", items: ["Microservices", "Event-driven systems", "GraphQL APIs"] },
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
          <dl className="grid sm:grid-cols-2 md:grid-cols-3 gap-px bg-seam">
            {toolkit.map((group) => (
              <div key={group.label} className="flex flex-col gap-3 bg-shell p-6">
                <dt className="m1-hud text-ink-soft">{group.label}</dt>
                <dd>
                  <ul className="flex flex-col gap-1">
                    {group.items.map((item) => (
                      <li key={item} className="font-semibold">
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>
    </section>
  );
};
