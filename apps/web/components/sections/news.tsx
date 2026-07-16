"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { events } from "@/content/events";
import { IMGS } from "@/lib/images";
import { SectionHeading } from "@/components/section-heading";

const posts = [
  {
    date: events[0].date,
    cat: "Event",
    title: events[0].title,
    desc: events[0].description,
    img: IMGS.relief2,
  },
  {
    date: events[1].date,
    cat: "Event",
    title: events[1].title,
    desc: events[1].description,
    img: IMGS.community1,
  },
].sort((a, b) => (a.date < b.date ? 1 : -1));

const catColors: Record<string, string> = {
  News: "bg-primary/10 text-primary",
  Event: "bg-secondary/10 text-secondary",
};

export function News({ t }: { t: Dict }) {
  return (
    <section id="news" className="py-20 lg:py-28 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.news.label} title={t.news.title} size="sm" className="mb-14" />
        <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {posts.map(({ date, cat, title, desc, img }, i) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8 }}
              className="bg-card dark:bg-card rounded-3xl overflow-hidden border border-border hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={img}
                  alt={title}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${catColors[cat]}`}>{cat}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar size={11} />{" "}
                    {new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-2 leading-snug">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{desc}</p>
                <button className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors group-hover:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm">
                  {t.news.readMore} <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
