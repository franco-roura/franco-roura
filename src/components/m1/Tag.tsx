import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TagProps = {
  tone?: "signal" | "tint" | "outline";
  className?: string;
  children: ReactNode;
};

export const Tag = ({ tone, className, children }: TagProps) => (
  <span className={cn("m1-tag", tone && `m1-tag-${tone}`, className)}>{children}</span>
);
