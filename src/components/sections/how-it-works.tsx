"use client";

import { motion } from "framer-motion";

import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { stepItems } from "@/lib/data/steps";

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Қалай жұмыс істейді"
          title="Төрт қадам — дайын материал"
          description="Күрделі баптаусыз, қарапайым әрі жылдам процесс."
        />

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-linear-to-r from-transparent via-primary/12 to-transparent lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {stepItems.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className="relative"
              >
                <div className="relative z-10 inline-flex size-12 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-white shadow-lifted">
                  {step.number}
                </div>
                <h3 className="font-display mt-5 text-lg font-semibold text-primary">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export { HowItWorks };
