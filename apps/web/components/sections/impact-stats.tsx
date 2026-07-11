"use client";

import { useEffect, useRef, useState } from "react";
import { GraduationCap, Heart, MapPin, Calendar } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { useCounter } from "@/lib/use-counter";
import { siteConfig } from "@/content/site";

export function ImpactStats({ t }: { t: Dict }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setActive(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const students = useCounter(siteConfig.stats.studentsEducated, active);
  const beneficiaries = useCounter(siteConfig.stats.totalBeneficiaries, active);
  const districts = useCounter(siteConfig.stats.districtsReached, active);
  const years = useCounter(new Date().getFullYear() - siteConfig.foundedYear, active);

  const stats = [
    { value: students, suffix: "+", label: t.stats.students, icon: GraduationCap, color: "text-primary", bg: "bg-primary/10" },
    { value: beneficiaries, suffix: "+", label: t.stats.beneficiaries, icon: Heart, color: "text-accent", bg: "bg-accent/10" },
    { value: districts, suffix: "", label: t.stats.districts, icon: MapPin, color: "text-secondary", bg: "bg-secondary/10" },
    { value: years, suffix: "+", label: t.stats.years, icon: Calendar, color: "text-yellow-500", bg: "bg-yellow-100 dark:bg-yellow-500/10" },
  ];

  return (
    <section
      id="impact"
      ref={ref}
      className="py-20 lg:py-28 bg-gradient-to-br from-primary to-[#1a327a] dark:from-gray-900 dark:to-gray-800 text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block text-orange-300 font-semibold text-sm uppercase tracking-widest mb-3">
            {t.stats.label}
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">{t.stats.title}</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ value, suffix, label, icon: Icon, color, bg }) => (
            <div key={label} className="text-center group">
              <div
                className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
              >
                <Icon size={26} className={color} />
              </div>
              <div className="font-display text-3xl font-bold mb-1">
                {value.toLocaleString()}
                {suffix}
              </div>
              <div className="text-white/70 text-xs leading-snug">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
