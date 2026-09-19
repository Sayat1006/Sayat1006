"use client";

import { motion } from "framer-motion";
import { Bot, Send, Sparkles, User } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { assistantPrompts } from "@/lib/data/assistant";

function AiAssistant() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            eyebrow="AI Көмекші"
            title="Сабаққа қатысты кез келген сұраққа — жауап дайын"
            description="S-AI Көмекші сабақ мазмұнын түсінеді, сондықтан сұранысқа сай нақты ұсыныс береді."
            className="max-w-none"
          />

          <div className="mt-8 flex flex-col gap-3">
            {assistantPrompts.map((prompt, i) => (
              <motion.div
                key={prompt.text}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-2.5 rounded-2xl border border-primary/8 bg-surface px-4 py-3.5 text-sm text-primary/80 shadow-soft"
              >
                <Sparkles className="mt-0.5 size-4 shrink-0 text-violet" />
                {prompt.text}
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-3xl border border-primary/10 bg-surface shadow-lifted"
        >
          <div className="flex items-center gap-2.5 border-b border-primary/5 bg-[#fbfcfe] px-5 py-4">
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-cyan),var(--color-violet))] text-white">
              <Bot className="size-4.5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-primary">S-AI Көмекші</p>
              <p className="text-xs text-success">Желіде</p>
            </div>
          </div>

          <div className="space-y-4 p-5 sm:p-6">
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-white">
                8-сынып физикасына жылу құбылыстары бойынша тәжірибе ұсын.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-[#0b7ea8]">
                <Bot className="size-3.5" />
              </span>
              <div className="max-w-[85%] space-y-2 rounded-2xl rounded-tl-sm bg-[#fbfcfe] px-4 py-3 text-sm leading-relaxed text-primary/85">
                <p>Ұсыныс: &laquo;Металл мен судың жылуын салыстыру&raquo; тәжірибесі.</p>
                <p>Қажетті құрал: термометр, ыстық су, суық су, металл ұнтақ.</p>
              </div>
            </div>

            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-4 py-2.5 text-sm text-white">
                Осы сабаққа саралау тапсырмаларын жаса.
              </div>
            </div>

            <div className="flex items-start gap-2">
              <span className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-cyan/15 text-[#0b7ea8]">
                <Bot className="size-3.5" />
              </span>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-[#fbfcfe] px-4 py-3">
                {[0, 1, 2].map((dot) => (
                  <motion.span
                    key={dot}
                    className="size-1.5 rounded-full bg-primary/30"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      delay: dot * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-primary/5 p-4">
            <div className="flex h-11 flex-1 items-center rounded-full border border-primary/10 bg-[#fbfcfe] px-4 text-sm text-muted">
              <User className="mr-2 size-4 text-primary/30" />
              Сұрағыңызды жазыңыз...
            </div>
            <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(90deg,var(--color-cyan),var(--color-violet))] text-white shadow-glow-cyan">
              <Send className="size-4" />
            </span>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export { AiAssistant };
