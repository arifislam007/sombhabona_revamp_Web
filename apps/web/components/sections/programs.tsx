"use client";

import Image from "next/image";
import { BookOpen, GraduationCap, Wrench, HandHelping, Users2, Building2 } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { programs } from "@/content/programs";
import { IMGS } from "@/lib/images";

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

export function Programs({ t }: { t: Dict }) {
  return (
    <section id="programs" className="py-20 lg:py-28 bg-muted/30 dark:bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">
            {t.programs.label}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t.programs.title}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t.programs.sub}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, i) => {
            const Icon = icons[i % icons.length];
            const { color, bg } = colors[i % colors.length];
            return (
              <div
                key={program.slug}
                className="bg-card dark:bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-border hover:-translate-y-1"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={images[i % images.length]}
                    alt={program.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-4`}>
                    <Icon size={22} className={color} />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{program.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{program.shortDescription}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
