"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { DashboardHeader } from "@/components/dashboard/header";
import { StepIndicator } from "@/components/dashboard/step-indicator";
import { SelectField } from "@/components/dashboard/select-field";
import { FormField } from "@/components/dashboard/form-field";
import { GenerationProgress } from "@/components/dashboard/generation-progress";
import { DocumentPreview } from "@/components/dashboard/document-preview";
import { ExportButtons } from "@/components/dashboard/export-buttons";
import { SaveMaterialButton } from "@/components/dashboard/save-material-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  GRADES,
  LESSON_DURATIONS,
  LESSON_TYPES,
  SUBJECTS,
} from "@/lib/dashboard/constants";
import { buildQmjContent, lessonStages, defaultSelectedStageIds } from "@/lib/dashboard/mock-data";
import type { QmjContent } from "@/lib/dashboard/types";
import { useGeneration } from "@/lib/dashboard/use-generation";
import { chargeForGenerationAction, refundGenerationAction } from "@/lib/actions/tokens";
import { TOKEN_COSTS } from "@/lib/tokens/costs";
import { cn } from "@/lib/utils";

const steps = ["Негізгі ақпарат", "Оқу мақсаты", "Сабақ құрылымы", "Дайын нәтиже"];
const generationSteps = [
  "Тақырыпты талдау",
  "Оқу мақсатын сәйкестендіру",
  "Сабақ кезеңдерін құрастыру",
  "ҚМЖ құжатын дайындау",
];

interface Step1 {
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  lessonType: string;
}

interface Step2 {
  objective: string;
  goal: string;
  criteria: string;
}

export default function QmjPage() {
  const [step, setStep] = useState(1);
  const [step1, setStep1] = useState<Step1>({
    subject: "",
    grade: "",
    topic: "",
    duration: LESSON_DURATIONS[1],
    lessonType: LESSON_TYPES[0],
  });
  const [step2, setStep2] = useState<Step2>({ objective: "", goal: "", criteria: "" });
  const [stageIds, setStageIds] = useState<string[]>(defaultSelectedStageIds);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [content, setContent] = useState<QmjContent | null>(null);
  const [editing, setEditing] = useState(false);
  const [charging, setCharging] = useState(false);

  const { status, activeStep, start } = useGeneration(generationSteps, 500);

  function toggleStage(id: string) {
    setStageIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  async function goNext() {
    if (step === 1) {
      const nextErrors: Record<string, string> = {};
      if (!step1.subject) nextErrors.subject = "Пәнді таңдаңыз";
      if (!step1.grade) nextErrors.grade = "Сыныпты таңдаңыз";
      if (!step1.topic.trim()) nextErrors.topic = "Тақырыпты жазыңыз";
      if (Object.keys(nextErrors).length) {
        setErrors(nextErrors);
        toast.error("Міндетті өрістерді толтырыңыз");
        return;
      }
    }
    if (step === 2) {
      const nextErrors: Record<string, string> = {};
      if (!step2.objective.trim()) nextErrors.objective = "Оқу мақсатын жазыңыз";
      if (!step2.goal.trim()) nextErrors.goal = "Сабақ мақсатын жазыңыз";
      if (Object.keys(nextErrors).length) {
        setErrors(nextErrors);
        toast.error("Міндетті өрістерді толтырыңыз");
        return;
      }
    }
    if (step === 3) {
      if (stageIds.length === 0) {
        toast.error("Кемінде бір сабақ кезеңін таңдаңыз");
        return;
      }

      setCharging(true);
      const charge = await chargeForGenerationAction("qmj");
      setCharging(false);

      if (!charge.success) {
        toast.error(charge.error ?? "Токенді есептен шығару мүмкін болмады.");
        return;
      }

      setStep(4);
      start(() => {
        try {
          const stageLabels = lessonStages
            .filter((s) => stageIds.includes(s.id))
            .map((s) => s.label);
          setContent(
            buildQmjContent({
              subject: step1.subject,
              grade: step1.grade,
              topic: step1.topic,
              objective: step2.objective,
              goal: step2.goal,
              stageLabels,
            }),
          );
          toast.success(`ҚМЖ дайын! −${TOKEN_COSTS.qmj} S-Token`);
        } catch {
          void refundGenerationAction("qmj", charge.transactionId);
          toast.error("Дайындау кезінде қате пайда болды. Токен қайтарылды.");
        }
      });
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, 4));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  const copyText = content
    ? [
        `Сабақтың тақырыбы: ${content.topic}`,
        `Оқу мақсаты: ${content.learningObjective}`,
        `Сабақ мақсаты: ${content.lessonGoal}`,
        "",
        "Сабақтың барысы:",
        ...content.rows.map(
          (r) => `${r.stage} — ${r.teacherAction} / ${r.studentAction} / ${r.assessment} / ${r.resources}`,
        ),
      ].join("\n")
    : "";

  return (
    <div className="space-y-8">
      <DashboardHeader title="ҚМЖ генераторы" description="Қысқа мерзімді жоспарды 4 қадамда дайындаңыз." />

      <StepIndicator steps={steps} current={step} />

      {step === 1 ? (
        <div className="rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-7">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="Пән"
              options={SUBJECTS}
              value={step1.subject}
              onChange={(v) => setStep1((s) => ({ ...s, subject: v }))}
              error={errors.subject}
              required
            />
            <SelectField
              label="Сынып"
              options={GRADES}
              value={step1.grade}
              onChange={(v) => setStep1((s) => ({ ...s, grade: v }))}
              error={errors.grade}
              required
            />
            <FormField label="Тақырып" error={errors.topic} required className="sm:col-span-2">
              <Input
                value={step1.topic}
                onChange={(e) => setStep1((s) => ({ ...s, topic: e.target.value }))}
                placeholder="Мысалы: Жылу құбылыстары"
                aria-invalid={Boolean(errors.topic)}
              />
            </FormField>
            <SelectField
              label="Сабақ ұзақтығы"
              options={LESSON_DURATIONS}
              value={step1.duration}
              onChange={(v) => setStep1((s) => ({ ...s, duration: v }))}
            />
            <SelectField
              label="Сабақ түрі"
              options={LESSON_TYPES}
              value={step1.lessonType}
              onChange={(v) => setStep1((s) => ({ ...s, lessonType: v }))}
            />
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-4 rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-7">
          <FormField label="Оқу мақсаты" error={errors.objective} required>
            <Textarea
              value={step2.objective}
              onChange={(e) => setStep2((s) => ({ ...s, objective: e.target.value }))}
              placeholder="Мысалы: 8.4.3.5 — жылу берілу түрлерін ажырата білу"
              rows={3}
              aria-invalid={Boolean(errors.objective)}
            />
          </FormField>
          <FormField label="Сабақ мақсаты" error={errors.goal} required>
            <Textarea
              value={step2.goal}
              onChange={(e) => setStep2((s) => ({ ...s, goal: e.target.value }))}
              placeholder="Сабақ соңында оқушылар не істей алады?"
              rows={3}
              aria-invalid={Boolean(errors.goal)}
            />
          </FormField>
          <FormField label="Бағалау критерийлері" hint="Әр критерийді жаңа жолдан жазыңыз (міндетті емес)">
            <Textarea
              value={step2.criteria}
              onChange={(e) => setStep2((s) => ({ ...s, criteria: e.target.value }))}
              placeholder={"Негізгі терминдерді атайды\nҚұбылысты мысалмен түсіндіреді"}
              rows={4}
            />
          </FormField>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-7">
          <p className="mb-4 text-sm text-muted">
            Сабақ құрылымына қосу керек кезеңдерді таңдаңыз.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {lessonStages.map((stage) => {
              const selected = stageIds.includes(stage.id);
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => toggleStage(stage.id)}
                  aria-pressed={selected}
                  className={cn(
                    "flex items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors",
                    selected
                      ? "border-cyan/40 bg-cyan/5"
                      : "border-primary/10 bg-[#fbfcfe] hover:border-primary/20",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border",
                      selected ? "border-cyan bg-cyan text-white" : "border-primary/20",
                    )}
                  >
                    {selected ? <Check className="size-3.5" /> : null}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-primary">{stage.label}</span>
                    <span className="mt-0.5 block text-xs text-muted">{stage.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-6">
          {status !== "done" ? (
            <div className="rounded-2xl border border-primary/10 bg-surface p-6 shadow-soft sm:p-8">
              <GenerationProgress steps={generationSteps} activeStep={activeStep} />
            </div>
          ) : content ? (
            <>
              <DocumentPreview title="Сабақтың тақырыбы" subtitle={content.topic}>
                <dl className="space-y-5">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Оқу мақсаты</dt>
                    <dd className="mt-1.5 text-sm text-primary/85">
                      {editing ? (
                        <Textarea
                          value={content.learningObjective}
                          onChange={(e) =>
                            setContent((c) => (c ? { ...c, learningObjective: e.target.value } : c))
                          }
                          rows={2}
                        />
                      ) : (
                        content.learningObjective
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Сабақ мақсаты</dt>
                    <dd className="mt-1.5 text-sm text-primary/85">
                      {editing ? (
                        <Textarea
                          value={content.lessonGoal}
                          onChange={(e) =>
                            setContent((c) => (c ? { ...c, lessonGoal: e.target.value } : c))
                          }
                          rows={2}
                        />
                      ) : (
                        content.lessonGoal
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Жетістік критерийлері
                    </dt>
                    <dd className="mt-1.5">
                      <ul className="list-disc space-y-1 pl-5 text-sm text-primary/85">
                        {content.successCriteria.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                </dl>

                <h3 className="font-display mt-8 mb-3 text-base font-bold text-primary">
                  Сабақтың барысы
                </h3>
                <div className="overflow-x-auto rounded-xl border border-primary/8">
                  <table className="w-full min-w-[720px] border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#fbfcfe] text-left text-xs font-semibold uppercase tracking-wide text-muted">
                        <th className="border-b border-primary/8 px-4 py-3">Кезең</th>
                        <th className="border-b border-primary/8 px-4 py-3">Мұғалім әрекеті</th>
                        <th className="border-b border-primary/8 px-4 py-3">Оқушы әрекеті</th>
                        <th className="border-b border-primary/8 px-4 py-3">Бағалау</th>
                        <th className="border-b border-primary/8 px-4 py-3">Ресурстар</th>
                      </tr>
                    </thead>
                    <tbody>
                      {content.rows.map((row, i) => (
                        <tr key={row.stage} className={i % 2 === 1 ? "bg-[#fbfcfe]/60" : undefined}>
                          <td className="border-b border-primary/6 px-4 py-3 font-semibold text-primary align-top">
                            {row.stage}
                          </td>
                          {(["teacherAction", "studentAction", "assessment", "resources"] as const).map(
                            (field) => (
                              <td key={field} className="border-b border-primary/6 px-4 py-3 align-top text-primary/80">
                                {editing ? (
                                  <textarea
                                    value={row[field]}
                                    onChange={(e) =>
                                      setContent((c) => {
                                        if (!c) return c;
                                        const rows = [...c.rows];
                                        rows[i] = { ...rows[i], [field]: e.target.value };
                                        return { ...c, rows };
                                      })
                                    }
                                    className="w-full resize-y rounded-lg border border-primary/10 bg-surface p-2 text-xs outline-none focus:border-cyan/40"
                                    rows={2}
                                  />
                                ) : (
                                  row[field]
                                )}
                              </td>
                            ),
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DocumentPreview>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <ExportButtons
                  editing={editing}
                  onToggleEdit={() => setEditing((v) => !v)}
                  copyText={copyText}
                  documentName={`ҚМЖ — ${content.topic}`}
                />
                <SaveMaterialButton
                  type="qmj"
                  title={content.topic}
                  subject={step1.subject}
                  grade={step1.grade}
                  content={{ ...content }}
                  metadata={{ duration: step1.duration, lessonType: step1.lessonType }}
                />
              </div>
            </>
          ) : null}
        </div>
      ) : null}

      {step < 4 ? (
        <div className="flex items-center justify-between border-t border-primary/8 pt-6">
          <Button variant="ghost" onClick={goBack} disabled={step === 1}>
            <ArrowLeft className="size-4" />
            Артқа
          </Button>
          <Button variant="gradient" onClick={goNext} disabled={charging}>
            {step === 3 ? (
              <>
                <Sparkles className="size-4" />
                {charging ? "Тексерілуде..." : "ҚМЖ жасау"}
              </>
            ) : (
              <>
                Келесі
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
