"use client";

import type { Dict } from "@/lib/i18n";
import { SectionHeading } from "@/components/section-heading";
import { motion } from "framer-motion";

export function SupportNetwork({ t }: { t: Dict }) {
  return (
    <section className="py-16 bg-white dark:bg-background border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow={t.network.label} title={t.network.title} size="sm" className="mb-10" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {t.network.categories.map((category, i) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              whileHover={{ y: -3 }}
              className="flex items-center justify-center h-16 px-3 rounded-xl bg-muted/50 dark:bg-muted/20 border border-border hover:border-primary/30 hover:bg-primary/5 transition-colors"
            >
              <div className="text-xs font-semibold text-muted-foreground text-center leading-tight">{category}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
