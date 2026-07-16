"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import type { Dict } from "@/lib/i18n";
import { SectionHeading } from "@/components/section-heading";

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
        <SectionHeading eyebrow={t.testimonials.label} title={t.testimonials.title} size="sm" className="mb-14" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ role, text, stars }, i) => (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" }}
              className="bg-card dark:bg-card rounded-3xl p-6 border border-border"
            >
              <div className="flex mb-4" aria-hidden="true">
                {Array.from({ length: stars }).map((_, i) => (
                  <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="sr-only">{stars} out of 5 stars.</p>
              <p className="text-foreground text-sm leading-relaxed italic">&ldquo;{text}&rdquo;</p>
              <div className="mt-5 text-xs font-semibold text-muted-foreground">{role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
