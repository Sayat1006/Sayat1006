"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { lessonPackageItems } from "@/lib/data/lesson-package";

function FullLessonPackage() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Нәтиже"
          title="Бір тақырыптан — толық сабақ"
          description="Барлық қажетті материал бір процесте, бір-бірімен үйлесімді дайындалады."
        />

        <div className="mt-14 flex flex-col items-center gap-3">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-1 rounded-2xl border border-primary/8 bg-surface px-8 py-5 text-center shadow-soft"
          >
            <span className="font-display text-lg font-bold text-primary">Физика</span>
            <span className="text-sm text-muted">8-сынып · Жылу құбылыстары</span>
          </motion.div>

          <ArrowDown className="size-5 text-primary/25" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(90deg,var(--color-cyan),var(--color-violet))] px-6 py-3 text-white shadow-glow-violet"
          >
            <Sparkles className="size-4" />
            <span className="font-display text-sm font-bold">S-AI</span>
          </motion.div>

          <ArrowDown className="size-5 text-primary/25" />

          <div className="mt-2 grid w-full grid-cols-2 gap-3 sm:grid-cols-5 sm:gap-4">
            {lessonPackageItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="flex flex-col items-center gap-2.5 rounded-2xl border border-primary/8 bg-surface px-4 py-6 text-center shadow-soft"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/5 text-primary">
                  <item.icon className="size-5" />
                </span>
                <span className="text-sm font-semibold text-primary">
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export { FullLessonPackage };
