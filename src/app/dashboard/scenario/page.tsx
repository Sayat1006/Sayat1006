"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { DashboardHeader } from "@/components/dashboard/header";
import { SelectField } from "@/components/dashboard/select-field";
import { FormField } from "@/components/dashboard/form-field";
import { GenerationProgress } from "@/components/dashboard/generation-progress";
import { DocumentPreview } from "@/components/dashboard/document-preview";
import { ExportButtons } from "@/components/dashboard/export-buttons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GRADES, LESSON_DURATIONS, LESSON_TYPES, SUBJECTS } from "@/lib/dashboard/constants";
import { buildScenarioSections } from "@/lib/dashboard/mock-data";
import type { ScenarioSection } from "@/lib/dashboard/types";
import { useGeneration } from "@/lib/dashboard/use-generation";

const generationSteps = [
  "Сабақ құрылымын жоспарлау",
  "Сұрақтар мен әрекеттерді құрастыру",
  "Сценарийді реттеу",
];

export default function ScenarioPage() {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState(LESSON_DURATIONS[1]);
  const [lessonType, setLessonType] = useState(LESSON_TYPES[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sections, setSections] = useState<ScenarioSection[] | null>(null);

  const { status, activeStep, start } = useGeneration(generationSteps, 550);

  function generate() {
    const nextErrors: Record<string, string> = {};
    if (!subject) nextErrors.subject = "Пәнді таңдаңыз";
    if (!grade) nextErrors.grade = "Сыныпты таңдаңыз";
    if (!topic.trim()) nextErrors.topic = "Тақырыпты жазыңыз";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      toast.error("Міндетті өрістерді толтырыңыз");
      return;
    }

    setSections(null);
    start(() => {
      setSections(buildScenarioSections({ topic }));
      toast.success("Сабақ сценарийі дайын!");
    });
  }

  return (
    <div className="space-y-8">
      <DashboardHeader title="Сабақ сценарийі" description="Сабақтың толық сценарийін қадам-қадаммен алыңыз." />

      <div className="rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField label="Пән" options={SUBJECTS} value={subject} onChange={setSubject} error={errors.subject} required />
          <SelectField label="Сынып" options={GRADES} value={grade} onChange={setGrade} error={errors.grade} required />
          <SelectField label="Сабақ ұзақтығы" options={LESSON_DURATIONS} value={duration} onChange={setDuration} />
          <SelectField label="Сабақ түрі" options={LESSON_TYPES} value={lessonType} onChange={setLessonType} />
          <FormField label="Тақырып" error={errors.topic} required className="lg:col-span-4">
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Мысалы: Оптика: жарық сыну" />
          </FormField>
        </div>

        <Button variant="gradient" size="lg" className="mt-6 w-full sm:w-auto" onClick={generate} disabled={status === "generating"}>
          <Sparkles className="size-4" />
          Сценарий жасау
        </Button>

        {status === "generating" ? (
          <div className="mt-6 rounded-2xl border border-primary/8 bg-[#fbfcfe] p-5">
            <GenerationProgress steps={generationSteps} activeStep={activeStep} />
          </div>
        ) : null}
      </div>

      {status === "done" && sections ? (
        <>
          <DocumentPreview title={`Сабақ сценарийі — ${topic}`} subtitle={`${subject} · ${grade}-сынып · ${duration}`}>
            <div className="space-y-6">
              {sections.map((section, i) => (
                <div key={section.id} className="flex gap-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/6 font-display text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-primary">{section.title}</h3>
                    <ul className="mt-1.5 space-y-1.5 text-sm leading-relaxed text-primary/80">
                      {section.content.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </DocumentPreview>

          <ExportButtons documentName={`Сценарий — ${topic}`} />
        </>
      ) : null}
    </div>
  );
}
