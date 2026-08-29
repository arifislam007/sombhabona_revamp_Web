"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Dict } from "@/lib/i18n";
import { SectionHeading } from "@/components/section-heading";

export function Gallery({ t }: { t: Dict }) {
  const [cat, setCat] = useState(0);
  const allImgs = [
    { src: "/gallery/education-new-books.jpg", cat: 1, span: "row-span-2" },
    { src: "/gallery/training-ict-program.jpg", cat: 2, span: "" },
    { src: "/gallery/relief-eid-clothes.jpg", cat: 4, span: "" },
    { src: "/gallery/community-pohela-boishakh.jpg", cat: 3, span: "row-span-2" },
    { src: "/gallery/relief-elderly-blanket.jpg", cat: 4, span: "" },
    { src: "/gallery/community-victory-day.jpg", cat: 3, span: "" },
    { src: "/gallery/education-scholarship-award.jpg", cat: 1, span: "" },
    { src: "/gallery/hero-winter-distribution.jpg", cat: 4, span: "col-span-2" },
    { src: "/gallery/training-ict-graduation.jpg", cat: 2, span: "" },
    { src: "/gallery/education-study-tour.jpg", cat: 1, span: "" },
    { src: "/gallery/community-winter-festival.jpg", cat: 3, span: "" },
    { src: "/gallery/relief-food-package.jpg", cat: 4, span: "" },
    { src: "/gallery/training-innovation-project.jpg", cat: 2, span: "row-span-2" },
    { src: "/gallery/community-patron-visit.jpg", cat: 3, span: "" },
    { src: "/gallery/relief-iftar-distribution.jpg", cat: 4, span: "" },
    { src: "/gallery/community-victory-day-street.jpg", cat: 3, span: "" },
  ];
  const cats = t.gallery.cats;
  const filtered = cat === 0 ? allImgs : allImgs.filter((i) => i.cat === cat);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-muted/30 dark:bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.gallery.label} title={t.gallery.title} className="mb-10">
          <div role="group" aria-label="Filter gallery by category" className="mt-6 flex flex-wrap justify-center gap-2">
            {cats.map((c, i) => (
              <button
                key={c}
                onClick={() => setCat(i)}
                aria-pressed={cat === i}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  cat === i
                    ? "bg-primary text-white"
                    : "bg-card text-muted-foreground border border-border hover:border-primary hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </SectionHeading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px]">
          {filtered.map(({ src, span }, i) => (
            <motion.div
              key={src}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
              whileHover={{ scale: 0.98 }}
              className={`relative ${span} overflow-hidden rounded-2xl bg-muted`}
            >
              <Image
                src={src}
                alt="Sombhabona program activity"
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
