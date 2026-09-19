"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "done";

const resultChips = ["ҚМЖ", "Презентация", "Тест", "Жұмыс парағы"];

function HeroWorkspace() {
  const [status, setStatus] = useState<Status>("idle");

  function handleGenerate() {
    if (status === "loading") return;
    setStatus("loading");
    window.setTimeout(() => setStatus("done"), 1600);
  }

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-[linear-gradient(135deg,rgba(53,201,255,0.18),rgba(124,92,255,0.14))] blur-2xl" />

      <div className="animate-float overflow-hidden rounded-3xl border border-primary/10 bg-surface shadow-lifted">
        <div className="flex items-center gap-2 border-b border-primary/5 bg-[#fbfcfe] px-5 py-3.5">
          <span className="size-2.5 rounded-full bg-danger/70" />
          <span className="size-2.5 rounded-full bg-[#f5b942]/80" />
          <span className="size-2.5 rounded-full bg-success/70" />
          <span className="ml-3 text-xs font-medium text-muted">
            S-AI жұмыс кеңістігі
          </span>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <Field label="Пән" value="Физика" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Сынып" value="8" />
            <Field label="Тіл" value="Қазақ" />
          </div>
          <Field label="Тақырып" value="Жылу құбылыстары" />

          <button
            type="button"
            onClick={handleGenerate}
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(90deg,var(--color-cyan),var(--color-violet))] py-3.5 text-sm font-semibold text-white shadow-glow-cyan transition-transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Жасалуда...
              </>
            ) : (
              <>
                Жасау
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>

          <AnimatePresence mode="wait">
            {status === "done" ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border border-cyan/20 bg-cyan/5 p-4">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[#0b7ea8]">
                    <Sparkles className="size-3.5" />
                    Дайын сабақ пакеті
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resultChips.map((chip, i) => (
                      <motion.span
                        key={chip}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-primary shadow-soft"
                      >
                        <CheckCircle2 className="size-3.5 text-success" />
                        {chip}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : status === "loading" ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2 rounded-2xl border border-primary/5 bg-[#fbfcfe] p-4"
              >
                {[100, 85, 92].map((w, i) => (
                  <div
                    key={i}
                    className="h-2.5 animate-pulse rounded-full bg-primary/10"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn("rounded-2xl border border-primary/8 bg-[#fbfcfe] px-4 py-3")}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-primary">{value}</p>
    </div>
  );
}

export { HeroWorkspace };
