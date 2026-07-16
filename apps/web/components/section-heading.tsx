import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

export function SectionHeading({
  eyebrow,
  title,
  description,
  size = "default",
  light = false,
  className = "",
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  size?: "default" | "sm";
  light?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Reveal className={`text-center ${className}`}>
      <span
        className={`inline-block font-semibold text-sm uppercase tracking-widest mb-3 ${
          light ? "text-orange-300" : "text-accent"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`font-display font-bold ${light ? "text-white" : "text-foreground"} ${
          size === "sm" ? "text-2xl" : "text-3xl sm:text-4xl lg:text-5xl"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 max-w-xl mx-auto ${light ? "text-white/80" : "text-muted-foreground"}`}>
          {description}
        </p>
      )}
      {children}
    </Reveal>
  );
}
