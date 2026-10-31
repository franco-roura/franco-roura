import { experience, type Job } from "@/data/experience";

// Normalizes skill names so the Toolkit and the experience tags match:
// "Next.js" = "NextJS", "Grafana stack" = "Grafana Stack", "C#" stays distinct from "C".
export const skillKey = (name: string) =>
  name.toLowerCase().replace(/#/g, "sharp").replace(/[\s.]/g, "");

export const jobsUsing = (skill: string): Job[] => {
  const key = skillKey(skill);
  return experience.filter((job) => job.tech.some((tech) => skillKey(tech) === key));
};

// "TERRAFORM · 2018–NOW · 4 ROLES", or "RUST · LEARNING" for a skill no job lists
export const skillReadout = (skill: string, tier: string) => {
  const jobs = jobsUsing(skill);
  const name = skill.toUpperCase();
  if (jobs.length === 0) return `${name} · ${tier.toUpperCase()}`;

  const start = Math.min(...jobs.map((job) => Number(job.start)));
  const current = jobs.some((job) => !job.end);
  const end = current ? "NOW" : String(Math.max(...jobs.map((job) => Number(job.end))));
  const span = String(start) === end ? end : `${start}–${end}`;
  const roles = `${jobs.length} ${jobs.length === 1 ? "ROLE" : "ROLES"}`;
  return `${name} · ${span} · ${roles}`;
};
