"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { GenerationProgress } from "@/components/dashboard/generation-progress";
import { GenerationResult } from "@/components/dashboard/generation-result";
import { SelectField } from "@/components/dashboard/select-field";
import { FormField } from "@/components/dashboard/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  DIFFICULTIES,
  GRADES,
  LANGUAGES,
  LESSON_DURATIONS,
  SUBJECTS,
} from "@/lib/dashboard/constants";
import { useGeneration } from "@/lib/dashboard/use-generation";

const generationSteps = [
  "Тақырыпты талдау…",
  "Оқу мақсатын сәйкестендіру…",
  "Тапсырмаларды құрастыру…",
  "Бағалау критерийлерін дайындау…",
  "Материалдарды жинақтау…",
];

const resultItems = ["ҚМЖ", "Презентация жоспары", "Тест", "Жұмыс парағы", "Үй тапсырмасы"];

interface FormState {
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  objective: string;
  language: string;
  difficulty: string;
}

const initialForm: FormState = {
  subject: "",
  grade: "",
  topic: "",
  duration: LESSON_DURATIONS[1],
  objective: "",
  language: LANGUAGES[0],
  difficulty: DIFFICULTIES[0],
};

function QuickLessonCreator() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const { status, activeStep, start, reset } = useGeneration(generationSteps, 550);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleGenerate() {
    const nextErrors: Partial<Record<keyof FormState, string>> = {};
    if (!form.subject) nextErrors.subject = "Пәнді таңдаңыз";
    if (!form.grade) nextErrors.grade = "Сыныпты таңдаңыз";
    if (!form.topic.trim()) nextErrors.topic = "Тақырыпты жазыңыз";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error("Формада қателер бар", { description: "Міндетті өрістерді толтырыңыз." });
      return;
    }

    start(() => {
      toast.success("Сабақ пакеті дайын!");
    });
  }

  return (
    <section
      id="quick-lesson"
      className="scroll-mt-24 rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-7"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-primary">Жаңа сабақ</h2>
          <p className="mt-1 text-sm text-muted">
            Параметрлерді толтырыңыз — S-AI толық сабақ пакетін дайындайды.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          label="Пән"
          options={SUBJECTS}
          value={form.subject}
          onChange={(v) => updateField("subject", v)}
          error={errors.subject}
          required
        />
        <SelectField
          label="Сынып"
          options={GRADES}
          value={form.grade}
          onChange={(v) => updateField("grade", v)}
          error={errors.grade}
          required
        />
        <FormField label="Тақырып" error={errors.topic} required className="sm:col-span-2">
          <Input
            value={form.topic}
            onChange={(e) => updateField("topic", e.target.value)}
            placeholder="Мысалы: Жылу құбылыстары"
            aria-invalid={Boolean(errors.topic)}
          />
        </FormField>
        <SelectField
          label="Сабақ ұзақтығы"
          options={LESSON_DURATIONS}
          value={form.duration}
          onChange={(v) => updateField("duration", v)}
        />
        <SelectField
          label="Тіл"
          options={LANGUAGES}
          value={form.language}
          onChange={(v) => updateField("language", v)}
        />
        <FormField label="Оқу мақсаты" className="sm:col-span-2">
          <Textarea
            value={form.objective}
            onChange={(e) => updateField("objective", e.target.value)}
            placeholder="Оқу мақсатын жазыңыз (міндетті емес)"
            rows={3}
          />
        </FormField>
        <SelectField
          label="Күрделілік"
          options={DIFFICULTIES}
          value={form.difficulty}
          onChange={(v) => updateField("difficulty", v)}
          className="sm:col-span-2"
        />
      </div>

      <div className="mt-6">
        <Button
          variant="gradient"
          size="lg"
          onClick={handleGenerate}
          disabled={status === "generating"}
          className="w-full sm:w-auto"
        >
          <Sparkles className="size-4" />
          Сабақ пакетін жасау
        </Button>
      </div>

      {status !== "idle" ? (
        <div className="mt-6 rounded-2xl border border-primary/8 bg-[#fbfcfe] p-5 sm:p-6">
          {status === "generating" ? (
            <GenerationProgress steps={generationSteps} activeStep={activeStep} />
          ) : (
            <div>
              <p className="font-display mb-4 text-base font-bold text-success">Сабақ пакеті дайын!</p>
              <GenerationResult items={resultItems} />
              <Button variant="ghost" size="sm" className="mt-4" onClick={reset}>
                Жаңа сабақ бастау
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </section>
  );
}

export { QuickLessonCreator };
