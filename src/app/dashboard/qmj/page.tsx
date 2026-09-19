"use client";

import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
} from "lucide-react";
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
  LANGUAGES,
  LESSON_DURATIONS,
  LESSON_TYPES,
  SUBJECTS,
} from "@/lib/dashboard/constants";
import { lessonStages, defaultSelectedStageIds } from "@/lib/dashboard/mock-data";
import { useAiGeneration } from "@/lib/dashboard/use-ai-generation";
import { generateQmjAction } from "@/lib/actions/ai";
import { TOKEN_COSTS } from "@/lib/tokens/costs";
import type { QMJOutput, QmjLessonStage } from "@/lib/ai/generators/qmj";
import { cn } from "@/lib/utils";

const steps = ["Негізгі ақпарат", "Оқу мақсаты", "Сабақ құрылымы", "Дайын нәтиже"];
const generationSteps = [
  "Сұранысты талдау…",
  "Оқу мақсаттарын сәйкестендіру…",
  "Сабақ құрылымын жоспарлау…",
  "Тапсырмаларды құрастыру…",
  "Бағалау критерийлерін дайындау…",
  "ҚМЖ құжатын дайындау…",
];

const emptyStage: QmjLessonStage = {
  stage: "Жаңа кезең",
  duration: "5 минут",
  teacherActivity: "",
  studentActivity: "",
  assessment: "",
  resources: "",
};

interface Step1 {
  subject: string;
  grade: string;
  topic: string;
  duration: string;
  lessonType: string;
  language: string;
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
    language: LANGUAGES[0],
  });
  const [step2, setStep2] = useState<Step2>({ objective: "", goal: "", criteria: "" });
  const [stageIds, setStageIds] = useState<string[]>(defaultSelectedStageIds);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [qmj, setQmj] = useState<QMJOutput | null>(null);
  const [editing, setEditing] = useState(false);

  const { status, activeStep, run } = useAiGeneration(generationSteps, 900);
  // A ref (not state) so a double-click can never fire two generations —
  // state updates aren't synchronous, but this guard is.
  const busyRef = useRef(false);

  function toggleStage(id: string) {
    setStageIds((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  async function requestGeneration(): Promise<boolean> {
    if (busyRef.current) return false;
    busyRef.current = true;

    const stageLabels = lessonStages.filter((s) => stageIds.includes(s.id)).map((s) => s.label);

    try {
      const result = await run(() =>
        generateQmjAction({
          subject: step1.subject,
          grade: step1.grade,
          topic: step1.topic,
          duration: step1.duration,
          lessonType: step1.lessonType,
          language: step1.language,
          learningObjective: step2.objective,
          lessonGoal: step2.goal,
          assessmentCriteria: step2.criteria,
          stageLabels,
        }),
      );

      if (!result.success || !result.data) {
        throw new Error(result.error ?? "ҚМЖ жасау кезінде қате пайда болды.");
      }

      setQmj(result.data);
      toast.success(`ҚМЖ дайын! 🎉 −${TOKEN_COSTS.qmj} S-Token`);
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ҚМЖ жасау кезінде қате пайда болды.");
      return false;
    } finally {
      busyRef.current = false;
    }
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

      setStep(4);
      const ok = await requestGeneration();
      if (!ok) setStep(3);
      return;
    }
    setErrors({});
    setStep((s) => Math.min(s + 1, 4));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  async function regenerate() {
    if (status === "generating") return;
    await requestGeneration();
  }

  function updateField<K extends keyof QMJOutput>(key: K, value: QMJOutput[K]) {
    setQmj((c) => (c ? { ...c, [key]: value } : c));
  }

  function updateListField(key: "learningObjectives" | "lessonObjectives" | "assessmentCriteria", text: string) {
    updateField(key, text.split("\n"));
  }

  function updateStage(index: number, patch: Partial<QmjLessonStage>) {
    setQmj((c) => {
      if (!c) return c;
      const lessonStages = [...c.lessonStages];
      lessonStages[index] = { ...lessonStages[index], ...patch };
      return { ...c, lessonStages };
    });
  }

  function addStage() {
    setQmj((c) => (c ? { ...c, lessonStages: [...c.lessonStages, { ...emptyStage }] } : c));
  }

  function removeStage(index: number) {
    setQmj((c) => {
      if (!c) return c;
      if (c.lessonStages.length <= 1) {
        toast.error("Кемінде бір кезең қалуы керек");
        return c;
      }
      return { ...c, lessonStages: c.lessonStages.filter((_, i) => i !== index) };
    });
  }

  function moveStage(index: number, direction: -1 | 1) {
    setQmj((c) => {
      if (!c) return c;
      const target = index + direction;
      if (target < 0 || target >= c.lessonStages.length) return c;
      const lessonStages = [...c.lessonStages];
      [lessonStages[index], lessonStages[target]] = [lessonStages[target], lessonStages[index]];
      return { ...c, lessonStages };
    });
  }

  const copyText = qmj
    ? [
        `Сабақтың тақырыбы: ${qmj.title}`,
        `Пән: ${qmj.subject} · Сынып: ${qmj.grade} · Ұзақтығы: ${qmj.duration}`,
        "",
        "Оқу мақсаты:",
        ...qmj.learningObjectives.map((o) => `- ${o}`),
        "",
        "Сабақ мақсаты:",
        ...qmj.lessonObjectives.map((o) => `- ${o}`),
        "",
        "Бағалау критерийлері:",
        ...qmj.assessmentCriteria.map((c) => `- ${c}`),
        "",
        "Сабақтың барысы:",
        ...qmj.lessonStages.map(
          (r) =>
            `${r.stage} (${r.duration}) — ${r.teacherActivity} / ${r.studentActivity} / ${r.assessment} / ${r.resources}`,
        ),
        "",
        `Саралау: ${qmj.differentiation}`,
        `Қауіпсіздік: ${qmj.safety}`,
        `Рефлексия: ${qmj.reflection}`,
        `Үй тапсырмасы: ${qmj.homework}`,
      ].join("\n")
    : "";

  return (
    <div className="space-y-8">
      <DashboardHeader title="ҚМЖ генераторы" description="Қысқа мерзімді жоспарды AI көмегімен 4 қадамда дайындаңыз." />

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
            <SelectField
              label="Тіл"
              options={LANGUAGES}
              value={step1.language}
              onChange={(v) => setStep1((s) => ({ ...s, language: v }))}
              className="sm:col-span-2"
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
          {status === "generating" ? (
            <div className="rounded-2xl border border-primary/10 bg-surface p-6 shadow-soft sm:p-8">
              <GenerationProgress steps={generationSteps} activeStep={activeStep} />
            </div>
          ) : qmj ? (
            <>
              <DocumentPreview
                title="Сабақтың тақырыбы"
                subtitle={`${qmj.subject} · ${qmj.grade}-сынып · ${qmj.duration}`}
              >
                <dl className="space-y-5">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Сабақ тақырыбы</dt>
                    <dd className="mt-1.5 text-sm font-semibold text-primary">
                      {editing ? (
                        <Input value={qmj.title} onChange={(e) => updateField("title", e.target.value)} />
                      ) : (
                        qmj.title
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Оқу мақсаты</dt>
                    <dd className="mt-1.5 text-sm text-primary/85">
                      {editing ? (
                        <Textarea
                          value={qmj.learningObjectives.join("\n")}
                          onChange={(e) => updateListField("learningObjectives", e.target.value)}
                          rows={3}
                        />
                      ) : (
                        <ul className="list-disc space-y-1 pl-5">
                          {qmj.learningObjectives.map((o, i) => (
                            <li key={i}>{o}</li>
                          ))}
                        </ul>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Сабақ мақсаты</dt>
                    <dd className="mt-1.5 text-sm text-primary/85">
                      {editing ? (
                        <Textarea
                          value={qmj.lessonObjectives.join("\n")}
                          onChange={(e) => updateListField("lessonObjectives", e.target.value)}
                          rows={3}
                        />
                      ) : (
                        <ul className="list-disc space-y-1 pl-5">
                          {qmj.lessonObjectives.map((o, i) => (
                            <li key={i}>{o}</li>
                          ))}
                        </ul>
                      )}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted">
                      Бағалау критерийлері
                    </dt>
                    <dd className="mt-1.5 text-sm text-primary/85">
                      {editing ? (
                        <Textarea
                          value={qmj.assessmentCriteria.join("\n")}
                          onChange={(e) => updateListField("assessmentCriteria", e.target.value)}
                          rows={3}
                        />
                      ) : (
                        <ul className="list-disc space-y-1 pl-5">
                          {qmj.assessmentCriteria.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="mt-8 mb-3 flex items-center justify-between">
                  <h3 className="font-display text-base font-bold text-primary">Сабақтың барысы</h3>
                  {editing ? (
                    <Button variant="secondary" size="sm" onClick={addStage}>
                      <Plus className="size-3.5" />
                      Кезең қосу
                    </Button>
                  ) : null}
                </div>
                <div className="overflow-x-auto rounded-xl border border-primary/8">
                  <table className="w-full min-w-[820px] border-collapse text-sm">
                    <thead>
                      <tr className="bg-[#fbfcfe] text-left text-xs font-semibold uppercase tracking-wide text-muted">
                        <th className="border-b border-primary/8 px-4 py-3">Кезең</th>
                        <th className="border-b border-primary/8 px-4 py-3">Уақыты</th>
                        <th className="border-b border-primary/8 px-4 py-3">Мұғалім әрекеті</th>
                        <th className="border-b border-primary/8 px-4 py-3">Оқушы әрекеті</th>
                        <th className="border-b border-primary/8 px-4 py-3">Бағалау</th>
                        <th className="border-b border-primary/8 px-4 py-3">Ресурстар</th>
                        {editing ? <th className="border-b border-primary/8 px-2 py-3" /> : null}
                      </tr>
                    </thead>
                    <tbody>
                      {qmj.lessonStages.map((row, i) => (
                        <tr key={i} className={i % 2 === 1 ? "bg-[#fbfcfe]/60" : undefined}>
                          <td className="border-b border-primary/6 px-4 py-3 align-top font-semibold text-primary">
                            {editing ? (
                              <input
                                value={row.stage}
                                onChange={(e) => updateStage(i, { stage: e.target.value })}
                                className="w-full rounded-lg border border-primary/10 bg-surface p-2 text-xs font-semibold outline-none focus:border-cyan/40"
                              />
                            ) : (
                              row.stage
                            )}
                          </td>
                          <td className="border-b border-primary/6 px-4 py-3 align-top text-primary/80">
                            {editing ? (
                              <input
                                value={row.duration}
                                onChange={(e) => updateStage(i, { duration: e.target.value })}
                                className="w-full rounded-lg border border-primary/10 bg-surface p-2 text-xs outline-none focus:border-cyan/40"
                              />
                            ) : (
                              row.duration
                            )}
                          </td>
                          {(["teacherActivity", "studentActivity", "assessment", "resources"] as const).map(
                            (field) => (
                              <td key={field} className="border-b border-primary/6 px-4 py-3 align-top text-primary/80">
                                {editing ? (
                                  <textarea
                                    value={row[field]}
                                    onChange={(e) => updateStage(i, { [field]: e.target.value })}
                                    className="w-full resize-y rounded-lg border border-primary/10 bg-surface p-2 text-xs outline-none focus:border-cyan/40"
                                    rows={2}
                                  />
                                ) : (
                                  row[field]
                                )}
                              </td>
                            ),
                          )}
                          {editing ? (
                            <td className="border-b border-primary/6 px-2 py-3 align-top">
                              <div className="flex flex-col items-center gap-1">
                                <button
                                  type="button"
                                  aria-label="Жоғары жылжыту"
                                  disabled={i === 0}
                                  onClick={() => moveStage(i, -1)}
                                  className="inline-flex size-6 items-center justify-center rounded-full text-muted hover:bg-primary/5 disabled:opacity-30"
                                >
                                  <ArrowUp className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  aria-label="Төмен жылжыту"
                                  disabled={i === qmj.lessonStages.length - 1}
                                  onClick={() => moveStage(i, 1)}
                                  className="inline-flex size-6 items-center justify-center rounded-full text-muted hover:bg-primary/5 disabled:opacity-30"
                                >
                                  <ArrowDown className="size-3.5" />
                                </button>
                                <button
                                  type="button"
                                  aria-label="Кезеңді жою"
                                  onClick={() => removeStage(i)}
                                  className="inline-flex size-6 items-center justify-center rounded-full text-danger/70 hover:bg-danger/10"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </td>
                          ) : null}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">Саралау</h4>
                    <div className="mt-1.5 text-sm text-primary/85">
                      {editing ? (
                        <Textarea value={qmj.differentiation} onChange={(e) => updateField("differentiation", e.target.value)} rows={3} />
                      ) : (
                        qmj.differentiation
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">Қауіпсіздік</h4>
                    <div className="mt-1.5 text-sm text-primary/85">
                      {editing ? (
                        <Textarea value={qmj.safety} onChange={(e) => updateField("safety", e.target.value)} rows={3} />
                      ) : (
                        qmj.safety
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">Рефлексия</h4>
                    <div className="mt-1.5 text-sm text-primary/85">
                      {editing ? (
                        <Textarea value={qmj.reflection} onChange={(e) => updateField("reflection", e.target.value)} rows={3} />
                      ) : (
                        qmj.reflection
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">Үй тапсырмасы</h4>
                    <div className="mt-1.5 text-sm text-primary/85">
                      {editing ? (
                        <Textarea value={qmj.homework} onChange={(e) => updateField("homework", e.target.value)} rows={3} />
                      ) : (
                        qmj.homework
                      )}
                    </div>
                  </div>
                </div>
              </DocumentPreview>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <ExportButtons
                    editing={editing}
                    onToggleEdit={() => setEditing((v) => !v)}
                    copyText={copyText}
                    copyToastMessage="ҚМЖ көшірілді."
                    documentName={`ҚМЖ — ${qmj.title}`}
                  />
                  <Button variant="secondary" size="sm" onClick={regenerate}>
                    <RotateCcw className="size-3.5" />
                    Қайта жасау
                  </Button>
                </div>
                <SaveMaterialButton
                  type="qmj"
                  title={qmj.title}
                  subject={qmj.subject || step1.subject}
                  grade={qmj.grade || step1.grade}
                  content={{ ...qmj }}
                  metadata={{ duration: step1.duration, lessonType: step1.lessonType, language: step1.language }}
                  savedMessage="ҚМЖ материалдарыңызға сақталды."
                  viewLinkLabel="Менің материалдарыма өту"
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
          <Button variant="gradient" onClick={goNext}>
            {step === 3 ? (
              <>
                <Sparkles className="size-4" />
                ҚМЖ жасау
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
