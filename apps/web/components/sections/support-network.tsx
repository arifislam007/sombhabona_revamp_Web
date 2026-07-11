"use client";

import type { Dict } from "@/lib/i18n";

export function SupportNetwork({ t }: { t: Dict }) {
  return (
    <section className="py-16 bg-white dark:bg-background border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-block text-accent font-semibold text-sm uppercase tracking-widest mb-2">
            {t.network.label}
          </span>
          <h2 className="font-display text-2xl font-bold text-foreground">{t.network.title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {t.network.categories.map((category) => (
            <div
              key={category}
              className="flex items-center justify-center h-16 px-3 rounded-xl bg-muted/50 dark:bg-muted/20 border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors"
            >
              <div className="text-xs font-semibold text-muted-foreground text-center leading-tight">{category}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
