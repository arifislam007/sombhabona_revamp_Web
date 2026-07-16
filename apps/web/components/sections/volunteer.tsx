"use client";

import { useState } from "react";
import { BookOpen, Wrench, Heart, TrendingUp, Users, CheckCircle } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { useFormSubmit } from "@/lib/use-form-submit";
import { siteConfig } from "@/content/site";
import { Reveal } from "@/components/reveal";

const ways = [
  { icon: BookOpen, title: "Teaching & Tutoring", desc: "Support children's learning in core subjects" },
  { icon: Wrench, title: "Skills Training Support", desc: "Share your professional expertise with youth" },
  { icon: Heart, title: "Community Outreach", desc: "Help organize events and welfare programs" },
  { icon: TrendingUp, title: "Fundraising & Advocacy", desc: "Expand our reach and amplify our impact" },
];

export function Volunteer({ t }: { t: Dict }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", skill: "", message: "" });
  const { status, errorMessage, submit } = useFormSubmit("/api/volunteer");

  const fieldClass =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-input-background dark:bg-muted/30 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm";

  return (
    <section id="volunteer" className="py-20 lg:py-28 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              {t.volunteer.label}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {t.volunteer.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">{t.volunteer.sub}</p>

            <div className="flex gap-6 mb-8">
              <div>
                <div className="font-display text-2xl font-bold text-primary">
                  {siteConfig.stats.activeVolunteers}+
                </div>
                <div className="text-xs text-muted-foreground">Active Volunteers</div>
              </div>
              <div className="w-px bg-border" />
              <div>
                <div className="font-display text-2xl font-bold text-secondary">
                  {siteConfig.stats.districtsReached}
                </div>
                <div className="text-xs text-muted-foreground">Districts Reached Across Bangladesh</div>
              </div>
            </div>

            <div className="space-y-4">
              {ways.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="flex gap-4 p-4 rounded-2xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors text-primary">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150} className="bg-card dark:bg-card rounded-3xl p-8 border border-border shadow-sm">
            {status === "success" ? (
              <div role="status" aria-live="polite" className="text-center py-12">
                <CheckCircle size={48} className="text-secondary mx-auto mb-4" aria-hidden="true" />
                <h3 className="font-bold text-foreground text-xl mb-2">Application Submitted!</h3>
                <p className="text-muted-foreground">Thank you for your willingness to serve. We will contact you shortly.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(form);
                }}
                className="space-y-4"
                noValidate
              >
                <div>
                  <label htmlFor="volunteer-name" className="block text-sm font-medium text-foreground mb-1.5">
                    {t.volunteer.name}
                  </label>
                  <input
                    id="volunteer-name"
                    required
                    className={fieldClass}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="volunteer-email" className="block text-sm font-medium text-foreground mb-1.5">
                    {t.volunteer.email}
                  </label>
                  <input
                    id="volunteer-email"
                    type="email"
                    required
                    className={fieldClass}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="volunteer-phone" className="block text-sm font-medium text-foreground mb-1.5">
                    {t.volunteer.phone}
                  </label>
                  <input
                    id="volunteer-phone"
                    type="tel"
                    required
                    className={fieldClass}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="volunteer-skill" className="block text-sm font-medium text-foreground mb-1.5">
                    {t.volunteer.skill}
                  </label>
                  <input
                    id="volunteer-skill"
                    required
                    className={fieldClass}
                    value={form.skill}
                    onChange={(e) => setForm({ ...form, skill: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="volunteer-message" className="block text-sm font-medium text-foreground mb-1.5">
                    {t.volunteer.msg}
                  </label>
                  <textarea
                    id="volunteer-message"
                    rows={3}
                    className={`${fieldClass} resize-none`}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <p role="status" aria-live="polite" className={status === "error" ? "text-sm text-destructive" : "sr-only"}>
                  {status === "error" ? errorMessage : ""}
                </p>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Users size={16} aria-hidden="true" /> {status === "submitting" ? "Submitting..." : t.volunteer.submit}
                </button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
