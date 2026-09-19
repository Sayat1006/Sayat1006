"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Circle, Loader2, Sparkles } from "lucide-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  demoComplexities,
  demoDurations,
  demoGrades,
  demoLanguages,
  demoOutputPreview,
  demoSubjects,
} from "@/lib/data/demo";
import { cn } from "@/lib/utils";

type Status = "idle" | "generating" | "done";

const generationSteps = [
  "Тақырыпты талдау",
  "Оқу мақсатын сәйкестендіру",
  "Материал құрылымын құру",
  "Дайындау аяқталды",
];

function SelectField({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl border border-primary/12 bg-surface px-3.5 text-sm font-medium text-primary outline-none transition-colors focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 rounded-xl border border-primary/12 bg-surface px-3.5 text-sm font-medium text-primary outline-none transition-colors placeholder:text-muted/60 focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20"
      />
    </label>
  );
}

function AiDemo() {
  const [subject, setSubject] = useState(demoSubjects[0]);
  const [grade, setGrade] = useState(demoGrades[3]);
  const [topic, setTopic] = useState("Жылу құбылыстары");
  const [duration, setDuration] = useState(demoDurations[1]);
  const [goal, setGoal] = useState("Жылу берілу түрлерін ажырата білу");
  const [language, setLanguage] = useState(demoLanguages[0]);
  const [complexity, setComplexity] = useState(demoComplexities[1]);

  const [status, setStatus] = useState<Status>("idle");
  const [activeStep, setActiveStep] = useState(-1);
  const timeouts = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeouts.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  function handleGenerate() {
    timeouts.current.forEach((t) => window.clearTimeout(t));
    timeouts.current = [];
    setStatus("generating");
    setActiveStep(0);

    generationSteps.forEach((_, index) => {
      const id = window.setTimeout(() => {
        setActiveStep(index);
        if (index === generationSteps.length - 1) {
          const doneId = window.setTimeout(() => setStatus("done"), 500);
          timeouts.current.push(doneId);
        }
      }, index * 650);
      timeouts.current.push(id);
    });
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Демо"
          title="AI генерациясын өзіңіз көріңіз"
          description="Параметрлерді таңдап, S-AI материалды қалай құрастыратынын байқаңыз."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
          <div className="rounded-3xl border border-primary/8 bg-surface p-6 shadow-soft sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectField label="Пән" options={demoSubjects} value={subject} onChange={setSubject} />
              <SelectField label="Сынып" options={demoGrades} value={grade} onChange={setGrade} />
              <TextField label="Тақырып" value={topic} onChange={setTopic} placeholder="Мысалы: Жылу құбылыстары" />
              <SelectField label="Сабақ ұзақтығы" options={demoDurations} value={duration} onChange={setDuration} />
              <TextField
                label="Оқу мақсаты"
                value={goal}
                onChange={setGoal}
                placeholder="Оқу мақсатын жазыңыз"
              />
              <SelectField label="Тіл" options={demoLanguages} value={language} onChange={setLanguage} />
              <SelectField
                label="Күрделілік"
                options={demoComplexities}
                value={complexity}
                onChange={setComplexity}
              />
            </div>

            <Button
              variant="gradient"
              size="lg"
              className="mt-6 w-full"
              onClick={handleGenerate}
              disabled={status === "generating"}
            >
              {status === "generating" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              Материал жасау
            </Button>
          </div>

          <div className="relative min-h-[420px] overflow-hidden rounded-3xl border border-primary/8 bg-[#fbfcfe] p-6 shadow-soft sm:p-8">
            <AnimatePresence mode="wait">
              {status === "idle" ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-[360px] flex-col items-center justify-center text-center"
                >
                  <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/5 text-primary/40">
                    <Sparkles className="size-7" />
                  </div>
                  <p className="mt-4 max-w-xs text-sm text-muted">
                    Параметрлерді толтырып, «Материал жасау» батырмасын басыңыз
                  </p>
                </motion.div>
              ) : status === "generating" ? (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex h-full min-h-[360px] flex-col justify-center gap-4"
                >
                  {generationSteps.map((step, index) => (
                    <div key={step} className="flex items-center gap-3">
                      {index < activeStep ||
                      (index === activeStep && index === generationSteps.length - 1) ? (
                        <CheckCircle2 className="size-5 shrink-0 text-success" />
                      ) : index === activeStep ? (
                        <Loader2 className="size-5 shrink-0 animate-spin text-cyan" />
                      ) : (
                        <Circle className="size-5 shrink-0 text-primary/15" />
                      )}
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          index <= activeStep ? "text-primary" : "text-muted",
                        )}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                      <CheckCircle2 className="size-3.5" />
                      Дайын
                    </span>
                    <span className="text-xs text-muted">{subject} · {grade}-сынып</span>
                  </div>

                  <h3 className="font-display mt-4 text-lg font-bold text-primary">
                    {topic}
                  </h3>
                  <p className="mt-1 text-sm text-muted">
                    Ұзақтығы: {duration} · Тіл: {language} · Күрделілік: {complexity}
                  </p>

                  <ul className="mt-5 space-y-3">
                    {demoOutputPreview.map((line, i) => (
                      <motion.li
                        key={line}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-2.5 rounded-xl bg-surface px-4 py-3 text-sm text-primary shadow-soft"
                      >
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan" />
                        {line}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}

export { AiDemo };
