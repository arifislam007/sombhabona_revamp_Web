"use client";

import Image from "next/image";
import type { Dict } from "@/lib/i18n";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/reveal";

const photos = [
  "/gallery/journey-open-air-class.jpg",
  "/gallery/journey-community-activity.jpg",
  "/gallery/journey-winter-festival.jpg",
  "/gallery/journey-youth-speaker.jpg",
];

export function Journey({ t }: { t: Dict }) {
  return (
    <section id="journey" className="py-20 lg:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.journey.label} title={t.journey.title} description={t.journey.sub} className="mb-14" />

        <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.journey.steps.map((step, i) => (
            <li key={step.title}>
              <Reveal delay={i * 80} className="h-full">
                <article className="group h-full flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition duration-300 motion-safe:hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <Image
                      src={photos[i]}
                      alt={step.alt}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute top-3 left-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-accent-foreground bg-cta text-sm font-bold text-accent-foreground"
                    >
                      {i + 1}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
