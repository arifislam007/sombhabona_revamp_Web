"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote as QuoteIcon } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { IMGS } from "@/lib/images";

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
        <div className="text-center mb-6">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">
            {t.stories.label}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">{t.stories.title}</h2>
        </div>
        <p className="text-center text-xs text-muted-foreground mb-8">{t.stories.note}</p>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-border">
            <div className="relative h-72 md:h-auto overflow-hidden">
              <Image src={story.img} alt={story.tag} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${story.color} bg-white/90`}>
                  {story.tag}
                </span>
              </div>
            </div>
            <div className="bg-card dark:bg-card p-8 lg:p-10 flex flex-col justify-center">
              <QuoteIcon size={32} className="text-accent mb-4" />
              <p className="font-display text-lg italic text-foreground leading-relaxed">&ldquo;{story.quote}&rdquo;</p>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => setIdx((idx - 1 + stories.length) % stories.length)}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors text-foreground"
            >
              <ChevronLeft size={18} />
            </button>
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${i === idx ? "bg-primary w-6" : "bg-border"}`}
              />
            ))}
            <button
              onClick={() => setIdx((idx + 1) % stories.length)}
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-colors text-foreground"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
