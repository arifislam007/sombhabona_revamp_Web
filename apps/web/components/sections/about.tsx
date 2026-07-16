"use client";

import Image from "next/image";
import { Shield, Star, CheckCircle, UserRound, Quote as QuoteIcon } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { siteConfig } from "@/content/site";
import { founder, team, type TeamMember } from "@/content/team";
import { Reveal } from "@/components/reveal";

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

function Avatar({ member, size }: { member: TeamMember; size: number }) {
  if (member.photo) {
    return (
      <Image
        src={member.photo}
        alt={member.name}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="shrink-0 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {initialsOf(member.name)}
    </div>
  );
}

export function About({ t }: { t: Dict }) {
  return (
    <section id="about" className="py-20 lg:py-28 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <Reveal>
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              {t.about.label}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {t.about.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{t.about.body}</p>

            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {[
                { icon: Shield, title: t.about.mission, text: t.about.missionText, color: "text-primary" },
                { icon: Star, title: t.about.vision, text: t.about.visionText, color: "text-secondary" },
              ].map(({ icon: Icon, title, text, color }) => (
                <div key={title} className="p-5 rounded-2xl bg-muted/50 dark:bg-muted/20 border border-border">
                  <Icon size={22} className={`${color} mb-3`} />
                  <h3 className="font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-3">{t.about.values}</h3>
              <div className="flex flex-wrap gap-2">
                {siteConfig.focusAreas.map((v) => (
                  <span
                    key={v}
                    className="flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium"
                  >
                    <CheckCircle size={12} /> {v}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 dark:from-primary/10 dark:to-secondary/10 rounded-3xl p-6 border border-primary/10">
              <span className="inline-block text-accent font-semibold text-xs uppercase tracking-widest mb-4">
                {t.about.founder}
              </span>
              <QuoteIcon size={24} className="text-accent mb-3" />
              <p className="font-display text-lg italic text-foreground leading-relaxed mb-4">
                &ldquo;{t.about.founderQuote}&rdquo;
              </p>
              <div className="flex items-center gap-3 mb-4">
                <Avatar member={founder} size={48} />
                <div>
                  <div className="font-semibold text-foreground">{founder.name}</div>
                  <div className="text-xs text-muted-foreground">{founder.role}</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t.about.founderText}</p>
            </div>

            <div className="mt-8 rounded-2xl border border-border p-6">
              <h3 className="flex items-center gap-2 font-bold text-foreground mb-4">
                <UserRound size={18} className="text-primary" /> {t.about.team}
              </h3>
              <ul className="space-y-3">
                {team.map((member) => (
                  <li key={member.name} className="flex items-center gap-3">
                    <Avatar member={member} size={36} />
                    <div>
                      <div className="text-sm font-medium text-foreground">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 rounded-2xl border border-border p-6">
              <h3 className="font-bold text-foreground mb-4">Contact</h3>
              <dl className="space-y-2 text-sm text-muted-foreground">
                <div>{siteConfig.contact.address}</div>
                <div>{siteConfig.contact.phones.join(" · ")}</div>
                <div>{siteConfig.contact.emails.join(" · ")}</div>
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
