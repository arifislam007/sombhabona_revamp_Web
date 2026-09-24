"use client";

import { useEffect, useState } from "react";
import { MotionConfig } from "framer-motion";
import { T, type Lang } from "@/lib/i18n";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { FocusPillars } from "@/components/sections/focus-pillars";
import { About } from "@/components/sections/about";
import { Journey } from "@/components/sections/journey";
import { ImpactStats } from "@/components/sections/impact-stats";
import { Programs } from "@/components/sections/programs";
import { ReliefAid } from "@/components/sections/relief-aid";
import { Stories } from "@/components/sections/stories";
import { Gallery } from "@/components/sections/gallery";
import { Volunteer } from "@/components/sections/volunteer";
import { Donation } from "@/components/sections/donation";
import { SupportNetwork } from "@/components/sections/support-network";
import { News } from "@/components/sections/news";
import { Press } from "@/components/sections/press";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { MobileDonateBar } from "@/components/mobile-donate-bar";

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [dark, setDark] = useState(false);
  const t = T[lang];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <MotionConfig reducedMotion="user">
    <div className={`bg-background text-foreground ${lang === "bn" ? "font-bengali" : "font-sans"}`}>
      <Navbar lang={lang} setLang={setLang} dark={dark} setDark={setDark} t={t} />
      <main id="main-content">
        <Hero t={t} />
        <FocusPillars t={t} />
        <About t={t} />
        <Journey t={t} />
        <ImpactStats t={t} />
        <Programs t={t} />
        <ReliefAid t={t} />
        <Stories t={t} />
        <Gallery t={t} />
        <Volunteer t={t} />
        <Donation t={t} />
        <SupportNetwork t={t} />
        <News t={t} />
        <Press t={t} />
        <Testimonials t={t} />
        <Contact t={t} />
      </main>
      <Footer t={t} />
      <MobileDonateBar t={t} />
    </div>
    </MotionConfig>
  );
}
