import { Server, Cloud, Code } from "lucide-react";

export const ServicesSection = () => {
  const services = [
    {
      icon: Server,
      title: "Architecture & System Design",
      description:
        "Microservices, event-driven systems, with a focus on availability, cost-effectiveness, and scalability.",
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      description:
        "Kubernetes, Terraform, CI/CD, telemetry, and observability. I think Vercel is cool, and I can work with a $5 VPC, but I prefer AWS.",
    },
    {
      icon: Code,
      title: "Code Craftsmanship",
      description:
        "I love Go, TypeScript, functional programming, and good developer experience. I'm okay with Python, but please no OOP.",
    },
  ];

  return (
    <section className="py-20 px-6 bg-slate-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <span className="text-2xl">⚙️</span>
            What I Do
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-emerald-400/30 hover:transform hover:scale-105 transition-all duration-300 group"
              >
                <div className="mb-4">
                  <Icon className="w-8 h-8 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-100">
                  {service.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
