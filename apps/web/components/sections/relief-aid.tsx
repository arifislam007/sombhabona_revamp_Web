"use client";

import Image from "next/image";
import { HandHelping, CheckCircle } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { IMGS } from "@/lib/images";
import { Reveal } from "@/components/reveal";

export function ReliefAid({ t }: { t: Dict }) {
  const galleryImgs = [IMGS.relief1, IMGS.relief2, IMGS.community1, IMGS.community2, IMGS.volunteer1, IMGS.volunteer2];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-[#0c2461] to-[#1E3A8A] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <HandHelping size={14} className="text-cyan-300" aria-hidden="true" /> {t.relief.label}
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-6 leading-tight">{t.relief.title}</h2>
            <p className="text-white/80 leading-relaxed mb-8 text-lg">{t.relief.sub}</p>
            <ul className="space-y-3">
              {t.relief.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-white/85">
                  <CheckCircle size={18} className="text-cyan-300 mt-0.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <div className="grid grid-cols-3 gap-3">
            {galleryImgs.map((src, i) => (
              <div
                key={src}
                className={`relative overflow-hidden rounded-2xl ${i === 0 || i === 5 ? "col-span-2 row-span-1" : ""}`}
                style={{ aspectRatio: i === 0 || i === 5 ? "2/1.3" : "1/1.2" }}
              >
                <Image
                  src={src}
                  alt="Sombhabona relief aid activities"
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
