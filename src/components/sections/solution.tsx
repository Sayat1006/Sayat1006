"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { solutionItems } from "@/lib/data/solutions";

function Solution() {
  return (
    <section id="solution" className="relative overflow-hidden bg-primary py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.06] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
      <div className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.22),transparent)]" />

      <Container className="relative">
        <SectionHeading
          light
          eyebrow="Шешім"
          title="Бір тақырып — толық сабақ пакеті"
          description="Тақырыпты енгізіңіз — S-AI оны сабаққа қажетті барлық материалға айналдырады."
        />

        <div className="mt-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-white shadow-glow-violet"
          >
            <Sparkles className="size-5 text-cyan" />
            <span className="font-display text-base font-semibold sm:text-lg">
              Жылу құбылыстары
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="my-4 text-white/30"
          >
            <ArrowDown className="size-6 animate-pulse-slow" />
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            transition={{ staggerChildren: 0.08, delayChildren: 0.15 }}
          >
            {solutionItems.map((item) => (
              <motion.div
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 16, scale: 0.92 },
                  show: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ duration: 0.4 }}
                className="glass-dark flex w-32 flex-col items-center gap-2.5 rounded-2xl px-4 py-5 text-center sm:w-36"
              >
                <span className="inline-flex size-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-cyan),var(--color-violet))] text-white">
                  <item.icon className="size-5" />
                </span>
                <span className="text-sm font-semibold text-white">
                  {item.title}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export { Solution };
