"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Users } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { IMGS } from "@/lib/images";
import { siteConfig } from "@/content/site";

export function Hero({ t }: { t: Dict }) {
  const years = new Date().getFullYear() - siteConfig.foundedYear;

  const miniStats: [string, string][] = [
    [`${siteConfig.stats.studentsEducated.toLocaleString()}+`, t.stats.students],
    [`${siteConfig.stats.districtsReached}`, t.stats.districts],
    [`${years}+`, t.stats.years],
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <Image
        src={IMGS.hero}
        alt="Children and volunteers at a Sombhabona winter clothing distribution"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[60%_30%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f1f52]/95 via-[#0f1f52]/70 to-[#0f1f52]/10" />
      <div className="absolute inset-0 bg-[#0f1f52]/40 lg:hidden" />
      <motion.div
        initial={{ y: 16 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white pt-24 pb-16"
      >
        <p className="mb-6 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-orange-200">
          <span aria-hidden="true" className="h-px w-8 bg-orange-300" />
          {t.hero.since}
        </p>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6 max-w-3xl text-balance">
          {t.hero.headline}
        </h1>
        <p className="text-lg sm:text-xl text-white/90 max-w-xl mb-10 leading-relaxed">{t.hero.sub}</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <motion.a
            href="#donation"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 bg-cta hover:bg-cta-hover text-white px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg shadow-orange-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <Heart size={20} aria-hidden="true" /> {t.hero.cta1}
          </motion.a>
          <motion.a
            href="#volunteer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm border-2 border-white/40 text-white px-8 py-4 rounded-full font-bold text-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <Users size={20} aria-hidden="true" /> {t.hero.cta2}
          </motion.a>
        </div>
        <div className="mt-14 grid grid-cols-3 max-w-xl divide-x divide-white/25 border-t border-white/25 pt-6">
          {miniStats.map(([n, l]) => (
            <div key={l} className="px-3 sm:px-6 first:pl-0">
              <div className="text-2xl sm:text-3xl font-bold font-display">{n}</div>
              <div className="text-xs sm:text-sm text-white/90 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </motion.div>
          </section>
  );
}
