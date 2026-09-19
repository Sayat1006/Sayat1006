"use client";

import { useState } from "react";
import { Copy, Plus, RotateCcw, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { DashboardHeader } from "@/components/dashboard/header";
import { SelectField } from "@/components/dashboard/select-field";
import { FormField } from "@/components/dashboard/form-field";
import { GenerationProgress } from "@/components/dashboard/generation-progress";
import { ExportButtons } from "@/components/dashboard/export-buttons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DIFFICULTIES,
  GRADES,
  QUESTION_TYPE_OPTIONS,
  SUBJECTS,
} from "@/lib/dashboard/constants";
import { buildTestQuestions } from "@/lib/dashboard/mock-data";
import type { TestQuestion } from "@/lib/dashboard/types";
import { useGeneration } from "@/lib/dashboard/use-generation";
import { cn } from "@/lib/utils";

const QUESTION_COUNTS = ["5", "10", "15", "20"];
const generationSteps = ["Тақырыпты талдау", "Сұрақтарды құрастыру", "Жауап кілттерін дайындау"];

let qCounter = 0;
function nextQId() {
  qCounter += 1;
  return `custom-${Date.now()}-${qCounter}`;
}

export default function TestPage() {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(QUESTION_COUNTS[1]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["single", "boolean", "short"]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [questions, setQuestions] = useState<TestQuestion[] | null>(null);

  const { status, activeStep, start } = useGeneration(generationSteps, 550);

  function toggleType(value: string) {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
    );
  }

  function generate() {
    const nextErrors: Record<string, string> = {};
    if (!subject) nextErrors.subject = "Пәнді таңдаңыз";
    if (!grade) nextErrors.grade = "Сыныпты таңдаңыз";
    if (!topic.trim()) nextErrors.topic = "Тақырыпты жазыңыз";
    if (selectedTypes.length === 0) nextErrors.types = "Кемінде бір сұрақ түрін таңдаңыз";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      toast.error("Міндетті өрістерді толтырыңыз");
      return;
    }

    setQuestions(null);
    start(() => {
      setQuestions(buildTestQuestions({ topic, count: Number(count), types: selectedTypes }));
      toast.success("Тест дайын!");
    });
  }

  function updateQuestion(id: string, patch: Partial<TestQuestion>) {
    setQuestions((prev) => prev?.map((q) => (q.id === id ? { ...q, ...patch } : q)) ?? prev);
  }

  function addQuestion() {
    const blank: TestQuestion = {
      id: nextQId(),
      type: "single",
      question: "Жаңа сұрақты осында жазыңыз",
      options: ["1-нұсқа", "2-нұсқа", "3-нұсқа", "4-нұсқа"],
      correctAnswer: "1-нұсқа",
      points: 2,
    };
    setQuestions((prev) => (prev ? [...prev, blank] : [blank]));
  }

  function removeQuestion(id: string) {
    setQuestions((prev) => prev?.filter((q) => q.id !== id) ?? prev);
  }

  async function copyAll() {
    if (!questions) return;
    const text = questions
      .map((q, i) => `${i + 1}. ${q.question}${q.options ? `\n   ${q.options.join(" | ")}` : ""}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Тест көшірілді");
    } catch {
      toast.error("Көшіру мүмкін болмады");
    }
  }

  return (
    <div className="space-y-8">
      <DashboardHeader title="Тест генераторы" description="Тақырып пен сұрақ түрлерін таңдап, тест құрастырыңыз." />

      <div className="rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField label="Пән" options={SUBJECTS} value={subject} onChange={setSubject} error={errors.subject} required />
          <SelectField label="Сынып" options={GRADES} value={grade} onChange={setGrade} error={errors.grade} required />
          <SelectField label="Сұрақ саны" options={QUESTION_COUNTS} value={count} onChange={setCount} />
          <SelectField label="Қиындық деңгейі" options={DIFFICULTIES} value={difficulty} onChange={setDifficulty} />
          <FormField label="Тақырып" error={errors.topic} required className="lg:col-span-2">
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Мысалы: Ньютон заңдары" />
          </FormField>
        </div>

        <FormField label="Сұрақ түрлері" error={errors.types} required className="mt-4">
          <div className="flex flex-wrap gap-2">
            {QUESTION_TYPE_OPTIONS.map((opt) => {
              const active = selectedTypes.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleType(opt.value)}
                  className={cn(
                    "rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "border-cyan/40 bg-cyan/10 text-[#0b7ea8]"
                      : "border-primary/10 bg-[#fbfcfe] text-primary/70 hover:border-primary/20",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </FormField>

        <Button variant="gradient" size="lg" className="mt-6 w-full sm:w-auto" onClick={generate} disabled={status === "generating"}>
          <Sparkles className="size-4" />
          Тест жасау
        </Button>

        {status === "generating" ? (
          <div className="mt-6 rounded-2xl border border-primary/8 bg-[#fbfcfe] p-5">
            <GenerationProgress steps={generationSteps} activeStep={activeStep} />
          </div>
        ) : null}
      </div>

      {status === "done" && questions ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-lg font-bold text-primary">
              Сұрақтар ({questions.length})
            </h2>
            <div className="flex flex-wrap gap-2.5">
              <Button variant="secondary" size="sm" onClick={addQuestion}>
                <Plus className="size-3.5" />
                Жаңа сұрақ
              </Button>
              <Button variant="secondary" size="sm" onClick={generate}>
                <RotateCcw className="size-3.5" />
                Қайта жасау
              </Button>
              <Button variant="secondary" size="sm" onClick={copyAll}>
                <Copy className="size-3.5" />
                Көшіру
              </Button>
              <ExportButtons actions={["docx"]} documentName={`Тест — ${topic}`} />
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((q, index) => (
              <div key={q.id} className="rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex items-center gap-2">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/6 font-display text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <Badge variant={q.type === "short" ? "violet" : "cyan"}>
                      {QUESTION_TYPE_OPTIONS.find((t) => t.value === q.type)?.label}
                    </Badge>
                    <span className="text-xs text-muted">{q.points} балл</span>
                  </span>
                  <button
                    type="button"
                    aria-label="Сұрақты жою"
                    onClick={() => removeQuestion(q.id)}
                    className="inline-flex size-8 items-center justify-center rounded-full text-danger/60 transition-colors hover:bg-danger/8"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <Input
                  value={q.question}
                  onChange={(e) => updateQuestion(q.id, { question: e.target.value })}
                  className="mt-3 font-medium"
                />

                {q.options ? (
                  <div className="mt-3 space-y-2">
                    {q.options.map((option, optIndex) => {
                      const isCorrect =
                        q.type === "multiple"
                          ? Array.isArray(q.correctAnswer) && q.correctAnswer.includes(option)
                          : q.correctAnswer === option;

                      return (
                        <div key={optIndex} className="flex items-center gap-2.5">
                          {q.type === "matching" ? null : (
                            <button
                              type="button"
                              aria-pressed={isCorrect}
                              aria-label="Дұрыс жауап деп белгілеу"
                              onClick={() => {
                                if (q.type === "multiple") {
                                  const current = Array.isArray(q.correctAnswer) ? q.correctAnswer : [];
                                  const next = current.includes(option)
                                    ? current.filter((o) => o !== option)
                                    : [...current, option];
                                  updateQuestion(q.id, { correctAnswer: next });
                                } else {
                                  updateQuestion(q.id, { correctAnswer: option });
                                }
                              }}
                              className={cn(
                                "flex size-5 shrink-0 items-center justify-center rounded-md border text-[10px] font-bold",
                                q.type === "boolean" ? "rounded-full" : "",
                                isCorrect
                                  ? "border-success bg-success text-white"
                                  : "border-primary/20 text-transparent",
                              )}
                            >
                              ✓
                            </button>
                          )}
                          <Input
                            value={option}
                            onChange={(e) => {
                              const nextOptions = [...(q.options ?? [])];
                              nextOptions[optIndex] = e.target.value;
                              updateQuestion(q.id, { options: nextOptions });
                            }}
                            className="h-9 text-sm"
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
