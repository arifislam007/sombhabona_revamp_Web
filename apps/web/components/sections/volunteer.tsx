"use client";

import { useState } from "react";
import { BookOpen, Wrench, Heart, TrendingUp, Users, CheckCircle } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { useFormSubmit } from "@/lib/use-form-submit";

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
          <div>
            <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-3">
              {t.volunteer.label}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              {t.volunteer.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">{t.volunteer.sub}</p>

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
          </div>

          <div className="bg-card dark:bg-card rounded-3xl p-8 border border-border shadow-sm">
            {status === "success" ? (
              <div className="text-center py-12">
                <CheckCircle size={48} className="text-secondary mx-auto mb-4" />
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
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t.volunteer.name}</label>
                  <input
                    required
                    className={fieldClass}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t.volunteer.email}</label>
                  <input
                    type="email"
                    required
                    className={fieldClass}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t.volunteer.phone}</label>
                  <input
                    type="tel"
                    required
                    className={fieldClass}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t.volunteer.skill}</label>
                  <input
                    required
                    className={fieldClass}
                    value={form.skill}
                    onChange={(e) => setForm({ ...form, skill: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">{t.volunteer.msg}</label>
                  <textarea
                    rows={3}
                    className={`${fieldClass} resize-none`}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                {status === "error" && <p className="text-sm text-destructive">{errorMessage}</p>}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-60"
                >
                  <Users size={16} /> {status === "submitting" ? "Submitting..." : t.volunteer.submit}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
