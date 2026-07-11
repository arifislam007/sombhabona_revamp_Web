"use client";

import { useState } from "react";
import Image from "next/image";
import type { Dict } from "@/lib/i18n";
import { IMGS } from "@/lib/images";

export function Gallery({ t }: { t: Dict }) {
  const [cat, setCat] = useState(0);
  const allImgs = [
    { src: IMGS.volunteer1, cat: 1, span: "row-span-2" },
    { src: IMGS.volunteer2, cat: 2, span: "" },
    { src: IMGS.relief1, cat: 4, span: "" },
    { src: IMGS.community1, cat: 3, span: "row-span-2" },
    { src: IMGS.relief2, cat: 4, span: "" },
    { src: IMGS.community2, cat: 3, span: "" },
    { src: IMGS.volunteer3, cat: 1, span: "" },
    { src: IMGS.hero, cat: 2, span: "col-span-2" },
  ];
  const cats = t.gallery.cats;
  const filtered = cat === 0 ? allImgs : allImgs.filter((i) => i.cat === cat);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-muted/30 dark:bg-muted/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">
            {t.gallery.label}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-6">{t.gallery.title}</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {cats.map((c, i) => (
              <button
                key={c}
                onClick={() => setCat(i)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  cat === i
                    ? "bg-primary text-white"
                    : "bg-card text-muted-foreground border border-border hover:border-primary hover:text-primary"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px]">
          {filtered.map(({ src, span }, i) => (
            <div key={i} className={`relative ${span} overflow-hidden rounded-2xl bg-muted group`}>
              <Image src={src} alt="Sombhabona program activity" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
