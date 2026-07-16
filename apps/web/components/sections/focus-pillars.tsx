"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { HandHelping, GraduationCap, Wrench, ArrowRight, CheckCircle2 } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { siteConfig } from "@/content/site";
import { IMGS } from "@/lib/images";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

type PillarKey = "volunteering" | "education" | "skillDevelopment";

export function FocusPillars({ t }: { t: Dict }) {
  const [active, setActive] = useState<PillarKey>("volunteering");

  const pillars: Record<
    PillarKey,
    {
      icon: typeof HandHelping;
      color: string;
      bg: string;
      title: string;
      description: string;
      points: string[];
      stat: [string, string];
      cta: string;
      target: string;
      image: string;
    }
  > = {
    volunteering: {
      icon: HandHelping,
      color: "text-secondary",
      bg: "bg-secondary/10",
      title: t.pillars.volunteering,
      description:
        "Sombhabona runs on the time and energy of dedicated volunteers, teaching classes, running events, and reaching communities across Bangladesh.",
      points: [
        `${siteConfig.stats.activeVolunteers}+ active volunteers`,
        "Active in communities across Bangladesh",
        "Roles in teaching, mentoring, and outreach",
      ],
      stat: [`${siteConfig.stats.activeVolunteers}+`, "Active Volunteers"],
      cta: t.hero.cta2,
      target: "volunteer",
      image: IMGS.volunteer1,
    },
    education: {
      icon: GraduationCap,
      color: "text-primary",
      bg: "bg-primary/10",
      title: t.pillars.education,
      description:
        "Pushpokoli School provides free, NCTB-curriculum education across 4 locations — with books, uniforms, and meals — so no child is turned away for lack of means.",
      points: [
        `${siteConfig.stats.studentsEducated.toLocaleString()}+ students educated`,
        "4 free school locations",
        "Sponsorship available from 1,500৳/month",
      ],
      stat: [`${siteConfig.stats.studentsEducated.toLocaleString()}+`, "Students Educated"],
      cta: "Sponsor a Child",
      target: "donation",
      image: IMGS.volunteer2,
    },
    skillDevelopment: {
      icon: Wrench,
      color: "text-accent",
      bg: "bg-accent/10",
      title: t.pillars.skillDevelopment,
      description:
        "From Onindito Naree's tailoring workshop to Sombhabona ICT's digital training, we equip underprivileged youth and women with skills that lead directly to income.",
      points: [
        `${siteConfig.stats.womenTrainedTailoring}+ women trained in tailoring & crafts`,
        "100+ graduates employed on-site",
        "ICT training for the digital economy",
      ],
      stat: [`${siteConfig.stats.womenTrainedTailoring}+`, "Women Trained"],
      cta: "Explore Programs",
      target: "programs",
      image: IMGS.relief1,
    },
  };

  const current = pillars[active];
  const Icon = current.icon;

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="py-20 lg:py-28 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.pillars.label} title={t.pillars.title} description={t.pillars.sub} className="mb-10" />

        <Reveal delay={100} className="flex flex-wrap justify-center gap-3 mb-10">
          <div role="tablist" aria-label="Focus pillars" className="flex flex-wrap justify-center gap-3">
            {(Object.keys(pillars) as PillarKey[]).map((key) => {
              const p = pillars[key];
              const PIcon = p.icon;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={active === key}
                  onClick={() => setActive(key)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    active === key
                      ? "bg-primary text-white border-primary"
                      : "text-foreground border-border hover:border-primary hover:text-primary"
                  }`}
                >
                  <PIcon size={16} aria-hidden="true" />
                  {p.title}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div
          role="tabpanel"
          aria-label={`${current.title} details`}
          className="grid lg:grid-cols-2 gap-10 items-center rounded-3xl border border-border overflow-hidden"
        >
          <div className="relative h-72 lg:h-full min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="p-8 lg:p-10">
            <div className={`inline-flex w-12 h-12 rounded-2xl ${current.bg} items-center justify-center mb-5`}>
              <Icon size={24} className={current.color} aria-hidden="true" />
            </div>
            <h3 className="font-display text-2xl font-bold text-foreground mb-3">{current.title}</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">{current.description}</p>
            <ul className="space-y-2 mb-6">
              {current.points.map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle2 size={16} className={`${current.color} mt-0.5 shrink-0`} aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => scrollTo(current.target)}
                className="flex items-center gap-2 bg-primary hover:bg-blue-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {current.cta} <ArrowRight size={14} aria-hidden="true" />
              </motion.button>
              <div className="text-sm">
                <span className="font-bold text-foreground">{current.stat[0]}</span>{" "}
                <span className="text-muted-foreground">{current.stat[1]}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
