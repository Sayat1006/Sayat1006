"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface GenerationResultProps {
  title?: string;
  items: string[];
  className?: string;
}

function GenerationResult({ title = "Дайын", items, className }: GenerationResultProps) {
  return (
    <div className={cn("rounded-2xl border border-cyan/20 bg-cyan/5 p-5", className)}>
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#0b7ea8]">
        <Sparkles className="size-3.5" />
        {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <motion.span
            key={item}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3.5 py-1.5 text-sm font-medium text-primary shadow-soft"
          >
            <CheckCircle2 className="size-4 text-success" />
            {item}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export { GenerationResult };
