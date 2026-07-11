"use client";

import { useEffect, useState } from "react";
import { T, type Lang } from "@/lib/i18n";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { ImpactStats } from "@/components/sections/impact-stats";
import { Programs } from "@/components/sections/programs";
import { ReliefAid } from "@/components/sections/relief-aid";
import { Stories } from "@/components/sections/stories";
import { Gallery } from "@/components/sections/gallery";
import { Volunteer } from "@/components/sections/volunteer";
import { Donation } from "@/components/sections/donation";
import { SupportNetwork } from "@/components/sections/support-network";
import { News } from "@/components/sections/news";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [dark, setDark] = useState(false);
  const t = T[lang];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className={`bg-background text-foreground ${lang === "bn" ? "font-bengali" : "font-sans"}`}>
      <Navbar lang={lang} setLang={setLang} dark={dark} setDark={setDark} t={t} />
      <Hero t={t} />
      <About t={t} />
      <ImpactStats t={t} />
      <Programs t={t} />
      <ReliefAid t={t} />
      <Stories t={t} />
      <Gallery t={t} />
      <Volunteer t={t} />
      <Donation t={t} />
      <SupportNetwork t={t} />
      <News t={t} />
      <Testimonials t={t} />
      <Contact t={t} />
      <Footer t={t} />
    </div>
  );
}
