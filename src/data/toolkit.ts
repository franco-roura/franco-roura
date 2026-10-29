import type { TagProps } from "@/components/m1";

export type ToolkitTier = {
  label: string;
  note: string;
  tone?: TagProps["tone"];
  items: string[];
};

export const toolkit: ToolkitTier[] = [
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
