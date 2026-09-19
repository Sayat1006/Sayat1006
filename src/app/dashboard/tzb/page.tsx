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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GRADES, QUARTERS, SUBJECTS } from "@/lib/dashboard/constants";
import { buildAssessmentTasks } from "@/lib/dashboard/mock-data";
import type { AssessmentTask } from "@/lib/dashboard/types";
import { useGeneration } from "@/lib/dashboard/use-generation";

const generationSteps = [
  "Бөлімдерді талдау",
  "Оқу мақсаттарын сәйкестендіру",
  "Тапсырмалар мен дескрипторларды құрастыру",
  "Жауап кілтін дайындау",
];

interface SectionResult {
  section: string;
  tasks: AssessmentTask[];
}

export default function TzbPage() {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [quarter, setQuarter] = useState(QUARTERS[0]);
  const [sectionsText, setSectionsText] = useState("");
  const [objectives, setObjectives] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [results, setResults] = useState<SectionResult[] | null>(null);

  const { status, activeStep, start } = useGeneration(generationSteps, 550);

  function generate() {
    const sections = sectionsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const nextErrors: Record<string, string> = {};
    if (!subject) nextErrors.subject = "Пәнді таңдаңыз";
    if (!grade) nextErrors.grade = "Сыныпты таңдаңыз";
    if (sections.length === 0) nextErrors.sections = "Кемінде бір бөлім жазыңыз";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      toast.error("Міндетті өрістерді толтырыңыз");
      return;
    }

    setResults(null);
    start(() => {
      setResults(
        sections.map((section) => ({
          section,
          tasks: buildAssessmentTasks({ topic: section, count: 2 }),
        })),
      );
      toast.success("ТЖБ дайын!");
    });
  }

  const allTasks = results?.flatMap((r) => r.tasks) ?? [];
  const totalPoints = allTasks.reduce((sum, t) => sum + t.points, 0);

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="ТЖБ генераторы"
        description="Тоқсандық жиынтық бағалауға арналған кешенді материал."
      />

      <div className="rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField label="Пән" options={SUBJECTS} value={subject} onChange={setSubject} error={errors.subject} required />
          <SelectField label="Сынып" options={GRADES} value={grade} onChange={setGrade} error={errors.grade} required />
          <SelectField label="Тоқсан" options={QUARTERS} value={quarter} onChange={setQuarter} />
        </div>

        <FormField
          label="Бөлімдер"
          error={errors.sections}
          required
          hint="Тоқсан бойынша қамтылған бөлімдерді әр жолға жазыңыз"
          className="mt-4"
        >
          <Textarea
            value={sectionsText}
            onChange={(e) => setSectionsText(e.target.value)}
            placeholder={"Механика\nМолекулалық физика"}
            rows={3}
          />
        </FormField>

        <FormField label="Оқу мақсаттары" hint="Міндетті емес" className="mt-4">
          <Textarea
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            placeholder={"8.1.2.3 — ...\n8.2.1.1 — ..."}
            rows={3}
          />
        </FormField>

        <Button variant="gradient" size="lg" className="mt-6 w-full sm:w-auto" onClick={generate} disabled={status === "generating"}>
          <Sparkles className="size-4" />
          ТЖБ жасау
        </Button>

        {status === "generating" ? (
          <div className="mt-6 rounded-2xl border border-primary/8 bg-[#fbfcfe] p-5">
            <GenerationProgress steps={generationSteps} activeStep={activeStep} />
          </div>
        ) : null}
      </div>

      {status === "done" && results ? (
        <>
          <DocumentPreview
            title={`ТЖБ — ${quarter}`}
            subtitle={`${subject} · ${grade}-сынып · ${results.length} бөлім`}
          >
            <div className="mb-5 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3">
              <span className="text-sm font-semibold text-primary">Жалпы балл</span>
              <span className="font-display text-lg font-bold text-primary">{totalPoints} балл</span>
            </div>

            <div className="space-y-6">
              {results.map((result) => (
                <div key={result.section}>
                  <h3 className="font-display mb-3 text-base font-bold text-primary">
                    {result.section}
                  </h3>
                  <div className="space-y-3">
                    {result.tasks.map((task, i) => (
                      <div key={task.id} className="rounded-xl border border-primary/8 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold uppercase tracking-wide text-violet">
                            {task.criterion}
                          </span>
                          <span className="rounded-full bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
                            {task.points} балл
                          </span>
                        </div>
                        <p className="mt-2 text-sm font-medium text-primary">
                          {i + 1}-тапсырма: {task.task}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted">
                          <span className="font-semibold text-primary/70">Дескриптор: </span>
                          {task.descriptor}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-display mt-8 mb-3 text-base font-bold text-primary">Жауаптар</h3>
            <div className="overflow-hidden rounded-xl border border-primary/8">
              {allTasks.map((task, i) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between px-4 py-2.5 text-sm ${
                    i % 2 === 1 ? "bg-[#fbfcfe]" : ""
                  }`}
                >
                  <span className="text-primary/80">{i + 1}-тапсырма</span>
                  <span className="font-medium text-primary">Дескрипторға сай толық жауап</span>
                </div>
              ))}
            </div>
          </DocumentPreview>

          <ExportButtons documentName={`ТЖБ — ${quarter}`} />
        </>
      ) : null}
    </div>
  );
}
