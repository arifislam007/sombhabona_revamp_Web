"use client";

import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { events } from "@/content/events";
import { stories } from "@/content/stories";
import { IMGS } from "@/lib/images";

const posts = [
  {
    date: events[0].date,
    cat: "Upcoming",
    title: events[0].title,
    desc: events[0].description,
    img: IMGS.relief2,
  },
  {
    date: stories[0].date,
    cat: "News",
    title: stories[0].title,
    desc: stories[0].excerpt,
    img: IMGS.volunteer1,
  },
  {
    date: new Date().toISOString().slice(0, 10),
    cat: "Event",
    title: "Follow Our Progress",
    desc: "New program updates and community events are shared here as they happen — check back soon.",
    img: IMGS.community1,
  },
];

const catColors: Record<string, string> = {
  Upcoming: "bg-accent/10 text-accent",
  News: "bg-primary/10 text-primary",
  Event: "bg-secondary/10 text-secondary",
};

export function News({ t }: { t: Dict }) {
  return (
    <section id="news" className="py-20 lg:py-28 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">
            {t.news.label}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">{t.news.title}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(({ date, cat, title, desc, img }) => (
            <article
              key={title}
              className="bg-card dark:bg-card rounded-3xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <Image src={img} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
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
                <button className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-accent transition-colors group-hover:gap-3">
                  {t.news.readMore} <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
