"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle } from "lucide-react";
import type { Dict } from "@/lib/i18n";
import { useFormSubmit } from "@/lib/use-form-submit";
import { siteConfig } from "@/content/site";
import { FacebookIcon } from "@/components/icons/facebook-icon";
import { SectionHeading } from "@/components/section-heading";

export function Contact({ t }: { t: Dict }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const { status, errorMessage, submit } = useFormSubmit("/api/contact");

  const fieldClass =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-input-background dark:bg-muted/30 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm";

  const infoItems = [
    { icon: MapPin, label: "Office Address", value: siteConfig.contact.address, color: "text-primary" },
    { icon: Phone, label: "Phone", value: siteConfig.contact.phones.join(" · "), color: "text-secondary" },
    { icon: Mail, label: "Email", value: siteConfig.contact.emails.join(" · "), color: "text-accent" },
    { icon: MessageCircle, label: "WhatsApp", value: siteConfig.contact.whatsapp.replace("https://wa.me/", "+"), color: "text-purple-500" },
  ];

  return (
    <section id="contact" className="py-20 lg:py-28 bg-white dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.contact.label} title={t.contact.title} size="sm" className="mb-14" />

        <div className="grid lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {infoItems.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex gap-4 p-4 rounded-2xl border border-border hover:bg-muted/30 transition-colors">
                <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 ${color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground mb-0.5">{label}</div>
                  <div className="text-sm text-foreground">{value}</div>
                </div>
              </div>
            ))}

            <div className="flex gap-3 pt-2">
              <a
                href={siteConfig.contact.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sombhabona on Facebook (opens in a new tab)"
                className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-blue-600 hover:text-white transition-colors border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <FacebookIcon size={16} />
              </a>
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Sombhabona on WhatsApp (opens in a new tab)"
                className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-green-500 hover:text-white transition-colors border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <MessageCircle size={16} aria-hidden="true" />
              </a>
            </div>

            <div className="rounded-2xl overflow-hidden border border-border h-44">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.254219099804!2d90.34915789999999!3d23.806823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c14c8baaaaa1%3A0x3f1f9b5e8d2c9b0c!2sMirpur%2C%20Dhaka%2C%20Bangladesh!5e0!3m2!1sen!2sus!4v1700000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Sombhabona Office Location"
              />
            </div>
          </div>

          <div className="lg:col-span-3 bg-card dark:bg-card rounded-3xl p-8 border border-border shadow-sm">
            {status === "success" ? (
              <div role="status" aria-live="polite" className="text-center py-16">
                <CheckCircle size={48} className="text-secondary mx-auto mb-4" aria-hidden="true" />
                <h3 className="font-bold text-foreground text-xl mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">Thank you for reaching out. We will respond as soon as possible.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(form);
                }}
                className="space-y-5"
                noValidate
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-foreground mb-1.5">
                      {t.contact.name}
                    </label>
                    <input
                      id="contact-name"
                      required
                      className={fieldClass}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-foreground mb-1.5">
                      {t.contact.email}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      className={fieldClass}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium text-foreground mb-1.5">
                    {t.contact.subject}
                  </label>
                  <input
                    id="contact-subject"
                    required
                    className={fieldClass}
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-foreground mb-1.5">
                    {t.contact.msg}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={6}
                    required
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
                  className="flex items-center gap-2 bg-primary hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-colors disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Send size={16} aria-hidden="true" /> {status === "submitting" ? "Sending..." : t.contact.send}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
