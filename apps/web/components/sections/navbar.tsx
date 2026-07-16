"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X, Heart, Globe, Moon, Sun } from "lucide-react";
import type { Dict, Lang } from "@/lib/i18n";

export function Navbar({
  lang,
  setLang,
  dark,
  setDark,
  t,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  dark: boolean;
  setDark: (d: boolean) => void;
  t: Dict;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links: [string, string][] = [
    ["about", t.nav.about],
    ["impact", t.nav.impact],
    ["programs", t.nav.programs],
    ["gallery", t.nav.gallery],
    ["volunteer", t.nav.volunteer],
    ["contact", t.nav.contact],
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white dark:bg-gray-900 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Image src="/logo.png" alt="Sombhabona" width={656} height={194} className="h-10 lg:h-12 w-auto object-contain" priority />

          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6 xl:gap-8">
            {links.map(([id, label]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`text-sm font-medium transition-colors hover:text-accent rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                  scrolled ? "text-foreground" : "text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              aria-label={lang === "en" ? "Switch to Bengali" : "Switch to English"}
              className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                scrolled ? "border-border text-foreground" : "border-white/40 text-white"
              }`}
            >
              <Globe size={12} aria-hidden="true" /> {lang === "en" ? "বাং" : "EN"}
            </button>
            <button
              onClick={() => setDark(!dark)}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={dark}
              className={`p-1.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
                scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/20"
              }`}
            >
              {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            </button>
            <button
              onClick={() => scrollTo("donation")}
              className="hidden lg:flex items-center gap-1.5 bg-accent text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <Heart size={14} aria-hidden="true" /> {t.nav.donate}
            </button>
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className={`lg:hidden p-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-md ${scrolled ? "text-foreground" : "text-white"}`}
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile navigation" className="lg:hidden bg-white dark:bg-gray-900 border-t border-border shadow-lg">
          {links.map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="block w-full text-left px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors border-b border-border last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
            >
              {label}
            </button>
          ))}
          <div className="px-6 py-4">
            <button
              onClick={() => scrollTo("donation")}
              className="w-full flex items-center justify-center gap-2 bg-accent text-white py-2.5 rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              <Heart size={14} aria-hidden="true" /> {t.nav.donate}
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}
