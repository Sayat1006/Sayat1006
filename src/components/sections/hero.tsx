"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroWorkspace } from "@/components/sections/hero-workspace";

function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-16 pb-20 sm:pt-20 sm:pb-28 lg:pt-24">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(53,201,255,0.16),transparent)]" />
      <div className="pointer-events-none absolute top-40 right-0 h-[380px] w-[380px] rounded-full bg-[radial-gradient(closest-side,rgba(124,92,255,0.14),transparent)]" />

      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-surface px-4 py-1.5 text-xs font-semibold text-primary/70 shadow-soft">
              <Sparkles className="size-3.5 text-violet" />
              Мұғалімге арналған AI жұмыс кеңістігі
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="font-display mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-primary sm:text-5xl md:text-[3.4rem]"
          >
            Ойыңыз — сабаққа.
            <br />
            Қалғанын{" "}
            <span className="text-gradient">S-AI</span> жасайды.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-6 text-lg leading-relaxed text-muted"
          >
            ҚМЖ, презентация, тест, БЖБ/ТЖБ және жұмыс парағын бір тақырыптан
            дайындаңыз.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Button variant="gradient" size="lg" className="w-full sm:w-auto" asChild>
              <Link href="/dashboard">
                <Sparkles className="size-4" />
                Сабақ жасау
              </Link>
            </Button>
            <a
              href="#how-it-works"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold text-primary transition-colors hover:bg-primary/5 sm:w-auto"
            >
              Қалай жұмыс істейді
              <ArrowRight className="size-4" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <HeroWorkspace />
        </motion.div>
      </Container>
    </section>
  );
}

export { Hero };
