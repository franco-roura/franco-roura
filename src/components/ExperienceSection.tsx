import { ExperienceEntry, SectionHeader } from "./m1";

export const ExperienceSection = () => {
  const companies = [
    {
      name: "Globant",
      role: "Test Automation Engineer",
      start: "2016",
      end: "2017",
      description:
        "My first year in college, and also the year I landed my first job in the industry! I was able to work in the Disney team and learnt a lot about best practices for software development.",
      tech: ["Python", "Selenium", "BDD"],
      link: "https://www.globant.com/",
    },
    {
      name: "3XM",
      role: "Full Stack Developer - Cloud Practicioner",
      start: "2018",
      end: "2019",
      description:
        "AWS started positioning itself as the cloud of choice for the industry, and as the curious guy I was, I was hyped about it. 3XM allowed me to get a bunch of hands-on experience with it.",
      tech: ["C#", "Angular", "Python", "AWS", "Terraform"],
      link: "https://www.linkedin.com/company/3xm-group",
    },
    {
      name: "BairesDev",
      role: "Software Engineer",
      start: "2019",
      end: "2020",
      description:
        "I was lucky enough to land my first remote job a few months before the pandemic hit, and even luckier to end up in the AdRoll team. I had always been obsessed with performance, and the folks at AdRoll taught me how to handle TONS of distributed data FAST. When you're processing millions of ad impressions in real-time, you quickly learn that performance isn't just nice to have, it's everything.",
      tech: ["React", "Python", "Go", "Terraform", "Typescript", "GraphQL"],
      link: "https://www.bairesdev.com/",
    },
    {
      name: "Capicua",
      role: "Software Architect & Tech Lead",
      start: "2020",
      end: "2025",
      description:
        "My longest stint so far! I got to wear many hats here - from architecting cloud-native solutions to mentoring devs and even doing some people management. I basically became the go-to person for anything tech-related, from system design to CI/CD pipelines. The best part? I got to make my coworkers' lives easier by improving DX and making them happier at work.",
      tech: ["AWS", "NextJS", "Typescript", "Terraform", "GraphQL"],
      link: "https://www.capicua.com/",
    },
    {
      name: "White Prompt",
      role: "Software Architect",
      start: "2025",
      description:
        "Ah, the era of AI agents and LLMs. I started out building a BI tool with LLM integrations, mostly on the Telemetry and infrastructure side of things. Once we shipped it, I moved on to a HIPAA compliant EHR for mental health, built with C# and React on Azure. Fun fact, I also used LLMs to build this website during this period.",
      tech: [
        "C#",
        "React",
        "Azure",
        "Terraform",
        "OTEL",
        "Kubernetes",
        "Grafana Stack",
        "GCP",
        "Python",
        "Typescript",
      ],
      link: "https://www.whiteprompt.com/",
    },
  ];

  return (
    <section className="flex flex-col gap-12">
      <SectionHeader
        id="experience"
        code="S-04"
        label="Timeline"
        index="04 / 05"
        title="Experience"
      />

      <div>
        {/* Codes follow chronology (E-01 is the first job); newest is listed first */}
        {companies
          .map((company, index) => ({ ...company, code: `E-0${index + 1}` }))
          .reverse()
          .map((company) => (
            <ExperienceEntry
              key={company.name}
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
            />
          ))}
      </div>
    </section>
  );
};
