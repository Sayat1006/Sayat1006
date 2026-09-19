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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { GRADES, QUARTERS, SUBJECTS } from "@/lib/dashboard/constants";
import { buildAssessmentTasks } from "@/lib/dashboard/mock-data";
import type { AssessmentTask } from "@/lib/dashboard/types";
import { useGeneration } from "@/lib/dashboard/use-generation";

const generationSteps = [
  "Оқу мақсаттарын талдау",
  "Бағалау критерийлерін дайындау",
  "Тапсырмаларды құрастыру",
  "Дескрипторлар мен балл схемасын жасау",
];

export default function BzbPage() {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [quarter, setQuarter] = useState(QUARTERS[0]);
  const [section, setSection] = useState("");
  const [objectives, setObjectives] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tasks, setTasks] = useState<AssessmentTask[] | null>(null);

  const { status, activeStep, start } = useGeneration(generationSteps, 550);

  function generate() {
    const nextErrors: Record<string, string> = {};
    if (!subject) nextErrors.subject = "Пәнді таңдаңыз";
    if (!grade) nextErrors.grade = "Сыныпты таңдаңыз";
    if (!section.trim()) nextErrors.section = "Бөлімді жазыңыз";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      toast.error("Міндетті өрістерді толтырыңыз");
      return;
    }

    setTasks(null);
    start(() => {
      setTasks(buildAssessmentTasks({ topic: section, count: 4 }));
      toast.success("БЖБ дайын!");
    });
  }

  const totalPoints = tasks?.reduce((sum, t) => sum + t.points, 0) ?? 0;

  return (
    <div className="space-y-8">
      <DashboardHeader title="БЖБ генераторы" description="Бөлім бойынша жиынтық бағалау материалын дайындаңыз." />

      <div className="rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SelectField label="Пән" options={SUBJECTS} value={subject} onChange={setSubject} error={errors.subject} required />
          <SelectField label="Сынып" options={GRADES} value={grade} onChange={setGrade} error={errors.grade} required />
          <SelectField label="Тоқсан" options={QUARTERS} value={quarter} onChange={setQuarter} />
          <FormField label="Бөлім" error={errors.section} required className="lg:col-span-3">
            <Input value={section} onChange={(e) => setSection(e.target.value)} placeholder="Мысалы: Механика негіздері" />
          </FormField>
          <FormField label="Оқу мақсаттары" hint="Әр мақсатты жаңа жолдан жазыңыз (міндетті емес)" className="lg:col-span-3">
            <Textarea
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              placeholder={"8.1.2.3 — ...\n8.1.2.4 — ..."}
              rows={3}
            />
          </FormField>
        </div>

        <Button variant="gradient" size="lg" className="mt-6 w-full sm:w-auto" onClick={generate} disabled={status === "generating"}>
          <Sparkles className="size-4" />
          БЖБ жасау
        </Button>

        {status === "generating" ? (
          <div className="mt-6 rounded-2xl border border-primary/8 bg-[#fbfcfe] p-5">
            <GenerationProgress steps={generationSteps} activeStep={activeStep} />
          </div>
        ) : null}
      </div>

      {status === "done" && tasks ? (
        <>
          <DocumentPreview
            title={`БЖБ — ${section}`}
            subtitle={`${subject} · ${grade}-сынып · ${quarter}`}
          >
            <div className="mb-5 flex items-center justify-between rounded-xl bg-primary/5 px-4 py-3">
              <span className="text-sm font-semibold text-primary">Жалпы балл</span>
              <span className="font-display text-lg font-bold text-primary">{totalPoints} балл</span>
            </div>

            <div className="space-y-4">
              {tasks.map((task, i) => (
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
          </DocumentPreview>

          <ExportButtons documentName={`БЖБ — ${section}`} />
        </>
      ) : null}
    </div>
  );
}
