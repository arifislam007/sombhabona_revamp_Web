"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

// Order matches t.press.items.
const clippings = [
  "/press/samakal-pushpokoli.jpg",
  "/press/daily-sun-clothes.jpg",
  "/press/bonik-barta-eid-clothes.jpg",
  "/press/kaler-kantho-eid-clothes.jpg",
];

export function Press({ t }: { t: Dict }) {
  return (
    <section id="press" className="py-20 lg:py-28 bg-muted/30 dark:bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.press.label} title={t.press.title} description={t.press.sub} className="mb-14" />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.press.items.map((item, i) => (
            <li key={item.outlet}>
              <Reveal delay={i * 80} className="h-full">
                <a
                  href={clippings[i]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition duration-300 motion-safe:hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-white">
                    <Image
                      src={clippings[i]}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain object-top"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-2 p-4">
                    <span className="font-display font-bold text-foreground">{item.outlet}</span>
                    <ExternalLink
                      size={16}
                      aria-hidden="true"
                      className="text-muted-foreground transition-colors group-hover:text-primary"
                    />
                    <span className="sr-only">{t.press.newTab}</span>
                  </div>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
