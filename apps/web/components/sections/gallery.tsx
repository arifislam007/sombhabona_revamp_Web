"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Dict } from "@/lib/i18n";
import { SectionHeading } from "@/components/section-heading";

export function Gallery({ t }: { t: Dict }) {
  const [cat, setCat] = useState(0);
  const allImgs = [
    { src: "/gallery/education-new-books.jpg", alt: "Students holding up their new Bangla textbooks in a classroom", cat: 1, span: "row-span-2" },
    { src: "/gallery/training-ict-program.jpg", alt: "Trainees working at computers in a Sombhabona ICT class", cat: 2, span: "" },
    { src: "/gallery/relief-eid-clothes.jpg", alt: "Three boys in new Eid panjabis on a Mirpur street", cat: 4, span: "" },
    { src: "/gallery/community-pohela-boishakh.jpg", alt: "Girls in festive dress at a Pohela Boishakh celebration", cat: 3, span: "row-span-2" },
    { src: "/gallery/relief-elderly-blanket.jpg", alt: "A volunteer wrapping a blanket around an elderly man sleeping on the street at night", cat: 4, span: "" },
    { src: "/gallery/community-victory-day.jpg", alt: "Children and teachers holding the national flag at a Victory Day event", cat: 3, span: "" },
    { src: "/gallery/education-scholarship-award.jpg", alt: "A schoolgirl receiving a scholarship award trophy from a guest", cat: 1, span: "" },
    { src: "/gallery/hero-winter-distribution.jpg", alt: "A large crowd of smiling children at a winter clothes distribution", cat: 4, span: "col-span-2" },
    { src: "/gallery/training-ict-graduation.jpg", alt: "ICT course graduates holding their certificates", cat: 2, span: "" },
    { src: "/gallery/education-study-tour.jpg", alt: "Students and teachers on a study tour among historic brick buildings", cat: 1, span: "" },
    { src: "/gallery/community-winter-festival.jpg", alt: "Young children making peace signs at the Pushpokoli Winter Festival", cat: 3, span: "" },
    { src: "/gallery/relief-food-package.jpg", alt: "A volunteer handing a meal box to a woman at her doorway", cat: 4, span: "" },
    { src: "/gallery/training-innovation-project.jpg", alt: "A student showing a paper-craft football pitch and origami flower pots", cat: 2, span: "row-span-2" },
    { src: "/gallery/community-patron-visit.jpg", alt: "Children welcoming guests with flowers at the Innovation Hub inauguration", cat: 3, span: "" },
    { src: "/gallery/relief-iftar-distribution.jpg", alt: "Volunteers handing out iftar meals to women in a queue", cat: 4, span: "" },
    { src: "/gallery/community-eid-circle.jpg", alt: "Volunteers and children joining hands in a circle during an Eid celebration", cat: 3, span: "col-span-2" },
    { src: "/gallery/community-eid-gathering.jpg", alt: "Children sitting on a mat and smiling at an Eid gathering", cat: 3, span: "" },
    { src: "/gallery/relief-blanket-handover.jpg", alt: "A guest handing a folded blanket to a young volunteer at the winter festival", cat: 4, span: "" },
    { src: "/gallery/community-pitha-queue.jpg", alt: "Children queuing under bunting at the Pushpokoli winter festival", cat: 3, span: "" },
    { src: "/gallery/relief-winter-blankets-1.jpg", alt: "Children holding folded orange blankets at a winter festival", cat: 4, span: "" },
    { src: "/gallery/community-long-table.jpg", alt: "Children seated along a long table at a winter festival", cat: 3, span: "col-span-2" },
    { src: "/gallery/community-eid-yellow.jpg", alt: "Children in yellow Eid outfits gathered outdoors", cat: 3, span: "" },
    { src: "/gallery/volunteers-poster.jpg", alt: "Two volunteers in green shirts pointing at a Sombhabona poster", cat: 1, span: "" },
    { src: "/gallery/community-swing.jpg", alt: "Children crowding onto a colourful swing at a community fair", cat: 3, span: "" },
    { src: "/gallery/community-victory-day-street.jpg", alt: "Two children holding the national flag on a street painted with alpona", cat: 3, span: "" },
  ];
  const cats = t.gallery.cats;
  const filtered = cat === 0 ? allImgs : allImgs.filter((i) => i.cat === cat);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-muted/60 dark:bg-muted/20">
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
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-muted-foreground border border-border hover:border-primary hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </SectionHeading>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px]">
          {filtered.map(({ src, alt, span }, i) => (
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
                alt={alt}
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
