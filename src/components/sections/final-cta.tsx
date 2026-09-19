"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

function FinalCta() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-16 text-center sm:px-12 sm:py-20"
        >
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.06]" />
          <div className="pointer-events-none absolute -top-20 left-1/2 h-[320px] w-[560px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(53,201,255,0.25),transparent)]" />

          <div className="relative">
            <h2 className="font-display mx-auto max-w-2xl text-3xl font-bold text-white sm:text-4xl md:text-[2.75rem]">
              Келесі сабағыңызды бірге дайындайық.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/65">
              Бір тақырыптан бастаңыз — қалғанын S-AI толықтырады.
            </p>
            <div className="mt-9 flex justify-center">
              <Button variant="gradient" size="lg" asChild>
                <Link href="/dashboard">
                  <Sparkles className="size-4" />
                  S-AI-ды бастау
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export { FinalCta };
