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
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links: [string, string][] = [
    ["about", t.nav.about],
    ["impact", t.nav.impact],
    ["programs", t.nav.programs],
    ["gallery", t.nav.gallery],
    ["volunteer", t.nav.volunteer],
    ["contact", t.nav.contact],
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Image
            src="/logo.png"
            alt="Sombhabona"
            width={656}
            height={194}
            // The green logo needs a light backing while the header is transparent over the dark hero photo.
            className={`h-10 lg:h-12 w-auto object-contain transition-all ${scrolled ? "" : "rounded-xl bg-[#FBF8EF] px-3 py-1.5 h-12 lg:h-14"}`}
            priority
          />

          <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-6 xl:gap-8">
            {links.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                className={`text-sm font-medium transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  scrolled ? "text-foreground hover:text-primary" : "text-white hover:text-accent"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLang(lang === "en" ? "bn" : "en")}
              aria-label={lang === "en" ? "Switch to Bengali" : "Switch to English"}
              className={`flex items-center gap-1 text-xs font-medium px-3 min-h-[36px] rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                scrolled ? "border-border text-foreground" : "border-white/40 text-white"
              }`}
            >
              <Globe size={12} aria-hidden="true" /> {lang === "en" ? "বাং" : "EN"}
            </button>
            <button
              onClick={() => setDark(!dark)}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              aria-pressed={dark}
              className={`p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                scrolled ? "text-foreground hover:bg-muted" : "text-white hover:bg-white/20"
              }`}
            >
              {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            </button>
            <a
              href="#donation"
              className="hidden lg:flex items-center gap-1.5 border-2 border-accent-foreground bg-cta text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold hover:bg-cta-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Heart size={14} aria-hidden="true" /> {t.nav.donate}
            </a>
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className={`lg:hidden p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md ${scrolled ? "text-foreground" : "text-white"}`}
            >
              {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile navigation" className="lg:hidden bg-background border-t border-border shadow-lg">
          {links.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setOpen(false)}
              className="block w-full text-left px-6 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors border-b border-border last:border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
            >
              {label}
            </a>
          ))}
          <div className="px-6 py-4">
            <a
              href="#donation"
              onClick={() => setOpen(false)}
              className="w-full flex items-center justify-center gap-2 border-2 border-accent-foreground bg-cta hover:bg-cta-hover text-accent-foreground py-2.5 rounded-full text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Heart size={14} aria-hidden="true" /> {t.nav.donate}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
