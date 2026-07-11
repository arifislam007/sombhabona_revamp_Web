"use client";

import Image from "next/image";
import { Heart, Users, Sparkles } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { IMGS } from "@/lib/images";
import { siteConfig } from "@/content/site";

export function Hero({ t }: { t: Dict }) {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const years = new Date().getFullYear() - siteConfig.foundedYear;

  const miniStats: [string, string][] = [
    [`${siteConfig.stats.studentsEducated.toLocaleString()}+`, t.stats.students],
    [`${siteConfig.stats.districtsReached}`, t.stats.districts],
    [`${years}+`, t.stats.years],
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <Image src={IMGS.hero} alt="Children learning at a Sombhabona program" fill priority className="object-cover object-top" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A8A]/90 via-[#1E3A8A]/70 to-[#16A34A]/40" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center text-white pt-20">
        <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8">
          <Sparkles size={14} className="text-yellow-300" />
          <span>{years}+ Years of Transforming Lives in Bangladesh</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-6 whitespace-pre-line">
          {t.hero.headline}
        </h1>
        <p className="text-lg sm:text-xl text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed">{t.hero.sub}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => scrollTo("donation")}
            className="flex items-center justify-center gap-2 bg-accent hover:bg-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-lg shadow-orange-500/30"
          >
            <Heart size={20} /> {t.hero.cta1}
          </button>
          <button
            onClick={() => scrollTo("volunteer")}
            className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border-2 border-white/40 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
          >
            <Users size={20} /> {t.hero.cta2}
          </button>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto">
          {miniStats.map(([n, l]) => (
            <div key={l} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold font-display">{n}</div>
              <div className="text-xs sm:text-sm text-white/70 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-white/70 rounded-full" />
        </div>
      </div>
    </section>
  );
}
