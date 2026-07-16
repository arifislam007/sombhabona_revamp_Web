"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, ArrowRight, Send, Heart } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { siteConfig } from "@/content/site";
import { useFormSubmit } from "@/lib/use-form-submit";
import { FacebookIcon } from "@/components/icons/facebook-icon";

export function Footer({ t }: { t: Dict }) {
  const [email, setEmail] = useState("");
  const { status, submit } = useFormSubmit("/api/newsletter");
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const quickLinks: [string, string][] = [
    ["about", t.nav.about],
    ["programs", t.nav.programs],
    ["gallery", t.nav.gallery],
    ["volunteer", t.nav.volunteer],
    ["contact", t.nav.contact],
  ];

  return (
    <footer className="bg-[#0c1f4a] dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div className="lg:col-span-2">
            <Image src="/logo.png" alt="Sombhabona" width={656} height={194} className="h-12 w-auto object-contain mb-4 brightness-0 invert" />
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-6">{t.footer.tagline}</p>
            <div className="flex gap-3">
              <a
                href={siteConfig.contact.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sombhabona on Facebook (opens in a new tab)"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <FacebookIcon size={15} />
              </a>
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Sombhabona on WhatsApp (opens in a new tab)"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-accent flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <MessageCircle size={15} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <div className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/80">{t.footer.quickLinks}</div>
            <ul className="space-y-2.5">
              {quickLinks.map(([id, label]) => (
                <li key={id}>
                  <button onClick={() => scrollTo(id)} className="text-white/60 hover:text-accent text-sm transition-colors flex items-center gap-1.5">
                    <ArrowRight size={11} /> {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <label htmlFor="footer-newsletter-email" className="font-semibold text-sm uppercase tracking-wider mb-4 text-white/80 block">
              {t.footer.newsletter}
            </label>
            {status === "success" ? (
              <p role="status" aria-live="polite" className="text-sm text-emerald-300">
                Thanks for subscribing!
              </p>
            ) : (
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit({ email });
                }}
              >
                <input
                  id="footer-newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  aria-label="Email address"
                  className="flex-1 px-3 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  aria-label="Subscribe"
                  className="bg-accent hover:bg-orange-600 text-white px-3 py-2.5 rounded-xl transition-colors text-sm font-medium disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <Send size={14} aria-hidden="true" />
                </button>
              </form>
            )}
            <div className="mt-6">
              <button
                onClick={() => scrollTo("donation")}
                className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-orange-600 text-white py-3 rounded-xl font-semibold text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Heart size={14} aria-hidden="true" /> {t.nav.donate}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} {siteConfig.name}. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
