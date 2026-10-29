import { Server, Cloud, Code } from "lucide-react";
import { Panel, SectionHeader } from "./m1";

export const ServicesSection = () => {
  const services = [
    {
      icon: Server,
      title: "Architecture & System Design",
      description:
        "Microservices, event-driven systems, with a focus on availability, cost-effectiveness, and scalability. You get uptime, I get peace of mind. Everyone wins.",
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      description:
        "Kubernetes, Terraform, CI/CD, telemetry, and observability. I think Vercel is cool, and I can make magic in a $5 VPC, but I won't pretend it's better than AWS.",
    },
    {
      icon: Code,
      title: "Code Craftsmanship",
      description:
        "I love Go, TypeScript, functional programming, and DX that sparks joy. I'll write Python if I must - but please keep the classes and OOP stuff away.",
    },
  ];

  return (
    <section className="flex flex-col gap-12">
      <SectionHeader
        id="services"
        code="S-02"
        label="Capabilities"
        index="02 / 05"
        title="What I do"
      />

      <div className="grid md:grid-cols-3 gap-8">
        {services.map((service, index) => {
          const Icon = service.icon;
          return (
            <Panel
              key={service.title}
              serial={`D-0${index + 1}`}
              bodyClassName="h-full flex flex-col gap-3 p-6 pt-11"
              className="h-full"
            >
              <Icon className="w-8 h-8 text-signal-ink mb-2" strokeWidth={1.25} />
              <h3 className="m1-h m1-h-sm">{service.title}</h3>
              <p className="text-ink-soft leading-[1.6]">{service.description}</p>
            </Panel>
          );
        })}
      </div>
    </section>
  );
};
