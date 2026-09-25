"use client";

import Image from "next/image";
import { HandHelping, CheckCircle } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { Reveal } from "@/components/reveal";

export function ReliefAid({ t }: { t: Dict }) {
  const galleryImgs = [
    { src: "/gallery/relief-winter-blankets-1.jpg", alt: "Children in green sweatshirts holding folded orange blankets at a winter festival" },
    { src: "/gallery/relief-elderly-blanket.jpg", alt: "A volunteer wrapping a blanket around an elderly man sleeping on the street at night" },
    { src: "/gallery/relief-food-package.jpg", alt: "A volunteer handing a meal box to a woman at her doorway" },
    { src: "/gallery/relief-winter-blankets-2.jpg", alt: "Children smiling with new blankets during a winter clothing distribution" },
    { src: "/gallery/relief-winter-meal.jpg", alt: "Children eating a shared meal at a winter festival" },
    { src: "/gallery/relief-eid-clothes.jpg", alt: "Three boys in new Eid panjabis on a Mirpur street" },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#0B6E4F] to-[#0E2A22] text-[#FBF8EF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <HandHelping size={14} className="text-accent" aria-hidden="true" /> {t.relief.label}
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6 leading-tight">{t.relief.title}</h2>
            <p className="text-white/80 leading-relaxed mb-8 text-lg">{t.relief.sub}</p>
            <ul className="space-y-3">
              {t.relief.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-white/85">
                  <CheckCircle size={18} className="text-accent mt-0.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="grid grid-cols-3 gap-3">
            {galleryImgs.map(({ src, alt }, i) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-2xl ${i === 0 || i === 5 ? "col-span-2 row-span-1" : ""}`}
                style={{ aspectRatio: i === 0 || i === 5 ? "2/1.3" : "1/1.2" }}
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
