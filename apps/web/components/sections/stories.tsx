"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote as QuoteIcon } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { IMGS } from "@/lib/images";
import { SectionHeading } from "@/components/section-heading";

const stories = [
  {
    tag: "Pushpokoli School Student",
    quote:
      "Before joining Pushpokoli School, I had never held a book of my own. Now I look forward to learning something new every day.",
    color: "bg-primary/10 text-primary",
    img: IMGS.volunteer2,
  },
  {
    tag: "Sombhabona ICT Graduate",
    quote:
      "The ICT training gave me practical computer skills I never had access to before, and the confidence to look for work in the field.",
    color: "bg-secondary/10 text-secondary",
    img: IMGS.volunteer1,
  },
  {
    tag: "Onindito Naree Participant",
    quote:
      "The skill training program gave me a way to support my family and a sense of independence I hadn't felt before.",
    color: "bg-accent/10 text-accent",
    img: IMGS.relief1,
  },
  {
    tag: "Community Volunteer",
    quote:
      "Volunteering with Sombhabona showed me how much difference consistent, local support can make for a family.",
    color: "bg-purple-100 dark:bg-purple-500/10 text-purple-600",
    img: IMGS.community1,
  },
];

export function Stories({ t }: { t: Dict }) {
  const [idx, setIdx] = useState(0);
  const story = stories[idx];

  return (
    <section id="stories" className="py-20 lg:py-28 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.stories.label} title={t.stories.title} className="mb-6" />
        <p className="text-center text-xs text-muted-foreground mb-8">{t.stories.note}</p>
        <div className="max-w-5xl mx-auto">
          <div
            className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-border"
            role="group"
            aria-label={`Story ${idx + 1} of ${stories.length}`}
          >
            <div className="relative h-72 md:h-auto overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={story.img}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image src={story.img} alt={story.tag} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${story.color} bg-white/90`}>
                  {story.tag}
                </span>
              </div>
            </div>
            <div className="bg-card dark:bg-card p-8 lg:p-10 flex flex-col justify-center min-h-[220px]">
              <QuoteIcon size={32} className="text-accent mb-4" aria-hidden="true" />
              <AnimatePresence mode="wait">
                <motion.p
                  key={story.quote}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="font-display text-lg italic text-foreground leading-relaxed"
                >
                  &ldquo;{story.quote}&rdquo;
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setIdx((idx - 1 + stories.length) % stories.length)}
              aria-label="Previous story"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>
            {stories.map((s, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Show story ${i + 1}: ${s.tag}`}
                aria-current={i === idx}
                className={`w-2.5 h-2.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  i === idx ? "bg-primary w-6" : "bg-border"
                }`}
              />
            ))}
            <button
              onClick={() => setIdx((idx + 1) % stories.length)}
              aria-label="Next story"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
