"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Wrench, HandHelping, Users2, Building2 } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { programs, type Pillar } from "@/content/programs";
import { IMGS } from "@/lib/images";
import { SectionHeading } from "@/components/section-heading";

const icons = [BookOpen, GraduationCap, Wrench, HandHelping, Users2, Building2] as const;
const colors = [
  { color: "text-primary", bg: "bg-primary/10" },
  { color: "text-accent", bg: "bg-accent/10" },
  { color: "text-secondary", bg: "bg-secondary/10" },
  { color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-500/10" },
  { color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-500/10" },
  { color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-500/10" },
];
const images = [IMGS.volunteer1, IMGS.volunteer2, IMGS.community1, IMGS.community2, IMGS.relief1, IMGS.volunteer3];

const pillarLabels: Record<Pillar, string> = {
  education: "Education",
  "skill-development": "Skill Development",
};

export function Programs({ t }: { t: Dict }) {
  const [filter, setFilter] = useState<Pillar | "all">("all");
  const filtered = filter === "all" ? programs : programs.filter((p) => p.pillar === filter);

  return (
    <section id="programs" className="py-20 lg:py-28 bg-muted/30 dark:bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.programs.label} title={t.programs.title} description={t.programs.sub} className="mb-10" />

        <div role="group" aria-label="Filter programs by pillar" className="flex flex-wrap justify-center gap-2 mb-10">
          {(["all", "education", "skill-development"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                filter === key
                  ? "bg-primary text-white"
                  : "bg-card text-muted-foreground border border-border hover:border-primary hover:text-primary"
              }`}
            >
              {key === "all" ? "All Programs" : pillarLabels[key]}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((program, idx) => {
            const i = programs.indexOf(program);
            const Icon = icons[i % icons.length];
            const { color, bg } = colors[i % colors.length];
            return (
              <motion.div
                key={program.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                whileHover={{ y: -8 }}
                className="bg-card dark:bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group border border-border"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={images[i % images.length]}
                    alt={program.name}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-foreground">
                    {pillarLabels[program.pillar]}
                  </span>
                </div>
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
                    <Icon size={22} className={color} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{program.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{program.shortDescription}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
