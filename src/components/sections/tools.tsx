"use client";

import { motion } from "framer-motion";

import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { toolItems } from "@/lib/data/tools";
import { cn } from "@/lib/utils";

function Tools() {
  return (
    <section id="tools" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Құралдар"
          title="Сабаққа қажеттінің бәрі — бір жерде"
          description="Әр құрал жеке тапсырма үшін жасалған, бірақ бір тақырыптан бірге іске қосылады."
        />

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {toolItems.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: (index % 4) * 0.06 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-2xl border border-primary/8 bg-surface p-6 shadow-soft transition-shadow hover:shadow-lifted"
            >
              <div
                className={cn(
                  "pointer-events-none absolute -right-8 -top-8 size-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100",
                  tool.accent === "cyan" ? "bg-cyan/25" : "bg-violet/25",
                )}
              />
              <motion.div
                whileHover={{ rotate: -8, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className={cn(
                  "relative inline-flex size-12 items-center justify-center rounded-xl text-white",
                  tool.accent === "cyan"
                    ? "bg-[linear-gradient(135deg,var(--color-cyan),#1f9fd6)]"
                    : "bg-[linear-gradient(135deg,var(--color-violet),#5a3fd6)]",
                )}
              >
                <tool.icon className="size-6" />
              </motion.div>
              <h3 className="font-display relative mt-5 text-base font-semibold text-primary">
                {tool.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted">
                {tool.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export { Tools };
