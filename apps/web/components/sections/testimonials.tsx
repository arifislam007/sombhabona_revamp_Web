"use client";

import { Star } from "lucide-react";
import type { Dict } from "@/lib/i18n";

const items = [
  {
    role: "Community Volunteer, Dhaka",
    text: "The commitment of the local team and the resilience of the children they support is what keeps me coming back to volunteer.",
    stars: 5,
  },
  {
    role: "Parent of a Pushpokoli School Student",
    text: "My child looks forward to school every day now. The teachers are patient and genuinely invested in the students.",
    stars: 5,
  },
  {
    role: "Onindito Naree Program Participant",
    text: "The skill training gave me a way to earn an income and support my family, while still being close to home.",
    stars: 5,
  },
  {
    role: "Local Community Partner",
    text: "Sombhabona's programs reach families that often have no other access to education or support in our area.",
    stars: 5,
  },
];

export function Testimonials({ t }: { t: Dict }) {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#f0f7ff] to-[#f0fdf4] dark:from-muted/5 dark:to-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">
            {t.testimonials.label}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">{t.testimonials.title}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ role, text, stars }) => (
            <div key={role} className="bg-card dark:bg-card rounded-3xl p-6 border border-border hover:shadow-lg transition-shadow">
              <div className="flex mb-4">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-foreground text-sm leading-relaxed italic">&ldquo;{text}&rdquo;</p>
              <div className="mt-5 text-xs font-semibold text-muted-foreground">{role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
