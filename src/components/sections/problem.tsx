"use client";

import { motion } from "framer-motion";

import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { problemItems } from "@/lib/data/problems";

function Problem() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Мәселе"
          title="Мұғалімнің уақыты қайда кетеді?"
          description="Аптасына бірнеше сағат қайталанатын дайындық жұмысына жұмсалады — сабақ берудің өзіне емес."
        />

        <div className="relative mt-16">
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-linear-to-b from-transparent via-primary/10 to-transparent lg:block" />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {problemItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: (index % 3) * 0.08 }}
                className="group relative rounded-2xl border border-primary/8 bg-surface p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lifted"
              >
                <span className="absolute right-5 top-5 font-display text-3xl font-bold text-primary/5 transition-colors group-hover:text-cyan/15">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="inline-flex size-12 items-center justify-center rounded-xl bg-danger/8 text-danger">
                  <item.icon className="size-6" />
                </div>
                <h3 className="font-display mt-5 text-lg font-semibold text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export { Problem };
