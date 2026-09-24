"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import type { Dict } from "@/lib/i18n";

// Persistent call-to-action on small screens, where the nav Donate button is hidden.
export function MobileDonateBar({ t }: { t: Dict }) {
  const [pastHero, setPastHero] = useState(false);
  const [donationVisible, setDonationVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const target = document.getElementById("donation");
    const observer = target
      ? new IntersectionObserver(([entry]) => setDonationVisible(entry.isIntersecting), { threshold: 0.1 })
      : null;
    if (target) observer?.observe(target);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const visible = pastHero && !donationVisible;

  return (
    <div
      className={`lg:hidden fixed inset-x-0 bottom-0 z-40 p-3 bg-background/95 backdrop-blur border-t border-border transition-transform duration-300 motion-reduce:transition-none ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      // Keep the hidden bar out of the tab order and the accessibility tree.
      inert={!visible}
    >
      <a
        href="#donation"
        className="flex items-center justify-center gap-2 w-full bg-cta hover:bg-cta-hover text-white py-3 rounded-full font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2"
      >
        <Heart size={18} aria-hidden="true" /> {t.nav.donate}
      </a>
    </div>
  );
}
