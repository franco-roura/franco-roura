import { useState } from "react";
import { Server, Cloud, Code, type LucideIcon } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useTilt } from "@/hooks/useTilt";
import { DrawIcon } from "./DrawIcon";
import { ServiceDiagram, type ServiceDiagramKind } from "./ServiceDiagram";
import { Panel, SectionHeader } from "./m1";

type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  diagram: ServiceDiagramKind;
};

const services: Service[] = [
  {
    icon: Server,
    title: "Architecture & System Design",
    description:
      "Microservices, event-driven systems, with a focus on availability, cost-effectiveness, and scalability. You get uptime, I get peace of mind. Everyone wins.",
    diagram: "architecture",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps",
    description:
      "Kubernetes, Terraform, CI/CD, telemetry, and observability. I think Vercel is cool, and I can make magic in a $5 VPC, but I won't pretend it's better than AWS.",
    diagram: "cloud",
  },
  {
    icon: Code,
    title: "Code Craftsmanship",
    description:
      "I love Go, TypeScript, functional programming, and DX that sparks joy. I'll write Python if I must - but please keep the classes and OOP stuff away.",
    diagram: "code",
  },
];

const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
  const finePointer = useMediaQuery("(pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const tiltRef = useTilt<HTMLDivElement>(finePointer && !reducedMotion);
  const { ref: viewRef, inView } = useInView<HTMLDivElement>({ threshold: 0.5 });
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={viewRef}
      className="h-full"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <Panel
        ref={tiltRef}
        serial={`D-0${index + 1}`}
        bodyClassName="h-full flex flex-col gap-3 p-6 pt-11"
        className="h-full"
      >
        <DrawIcon icon={service.icon} className="w-8 h-8 text-signal-ink mb-2" />
        <h3 className="m1-h m1-h-sm">{service.title}</h3>
        <p className="text-ink-soft leading-[1.6]">{service.description}</p>
        <ServiceDiagram kind={service.diagram} active={finePointer ? hovered : inView} />
      </Panel>
    </div>
  );
};

export const ServicesSection = () => {
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
        {services.map((service, index) => (
          <ServiceCard key={service.title} service={service} index={index} />
        ))}
      </div>
    </section>
  );
};
