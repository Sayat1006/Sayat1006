"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { DashboardHeader } from "@/components/dashboard/header";
import { SelectField } from "@/components/dashboard/select-field";
import { FormField } from "@/components/dashboard/form-field";
import { GenerationProgress } from "@/components/dashboard/generation-progress";
import { ExportButtons } from "@/components/dashboard/export-buttons";
import { SaveMaterialButton } from "@/components/dashboard/save-material-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GRADES, SUBJECTS, WORKSHEET_LEVELS } from "@/lib/dashboard/constants";
import { buildWorksheetTasks } from "@/lib/dashboard/mock-data";
import type { WorksheetTask } from "@/lib/dashboard/types";
import { useGeneration } from "@/lib/dashboard/use-generation";
import { chargeForGenerationAction, refundGenerationAction } from "@/lib/actions/tokens";
import { TOKEN_COSTS } from "@/lib/tokens/costs";

const TASK_COUNTS = ["4", "6", "8"];
const generationSteps = ["Тақырыпты талдау", "Тапсырмаларды құрастыру", "Парақ форматын дайындау"];

export default function WorksheetPage() {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [taskCount, setTaskCount] = useState(TASK_COUNTS[1]);
  const [level, setLevel] = useState(WORKSHEET_LEVELS[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [tasks, setTasks] = useState<WorksheetTask[] | null>(null);
  const [editing, setEditing] = useState(false);

  const [charging, setCharging] = useState(false);
  const { status, activeStep, start } = useGeneration(generationSteps, 500);

  async function generate() {
    const nextErrors: Record<string, string> = {};
    if (!subject) nextErrors.subject = "Пәнді таңдаңыз";
    if (!grade) nextErrors.grade = "Сыныпты таңдаңыз";
    if (!topic.trim()) nextErrors.topic = "Тақырыпты жазыңыз";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      toast.error("Міндетті өрістерді толтырыңыз");
      return;
    }

    setCharging(true);
    const charge = await chargeForGenerationAction("worksheet");
    setCharging(false);

    if (!charge.success) {
      toast.error(charge.error ?? "Токенді есептен шығару мүмкін болмады.");
      return;
    }

    setTasks(null);
    start(() => {
      try {
        setTasks(buildWorksheetTasks({ topic, count: Number(taskCount) }));
        toast.success(`Жұмыс парағы дайын! −${TOKEN_COSTS.worksheet} S-Token`);
      } catch {
        void refundGenerationAction("worksheet", charge.transactionId);
        toast.error("Дайындау кезінде қате пайда болды. Токен қайтарылды.");
      }
    });
  }

  return (
    <div className="space-y-8">
      <DashboardHeader title="Жұмыс парағы генераторы" description="Баспаға дайын A4 форматындағы тапсырма парағы." />

      <div className="rounded-2xl border border-primary/10 bg-surface p-5 shadow-soft sm:p-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SelectField label="Пән" options={SUBJECTS} value={subject} onChange={setSubject} error={errors.subject} required />
          <SelectField label="Сынып" options={GRADES} value={grade} onChange={setGrade} error={errors.grade} required />
          <SelectField label="Тапсырма саны" options={TASK_COUNTS} value={taskCount} onChange={setTaskCount} />
          <SelectField label="Деңгей" options={WORKSHEET_LEVELS} value={level} onChange={setLevel} />
          <FormField label="Тақырып" error={errors.topic} required className="lg:col-span-4">
            <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Мысалы: Қысым және оның бірліктері" />
          </FormField>
        </div>

        <Button
          variant="gradient"
          size="lg"
          className="mt-6 w-full sm:w-auto"
          onClick={generate}
          disabled={status === "generating" || charging}
        >
          <Sparkles className="size-4" />
          {charging ? "Тексерілуде..." : "Жұмыс парағын жасау"}
        </Button>

        {status === "generating" ? (
          <div className="mt-6 rounded-2xl border border-primary/8 bg-[#fbfcfe] p-5">
            <GenerationProgress steps={generationSteps} activeStep={activeStep} />
          </div>
        ) : null}
      </div>

      {status === "done" && tasks ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            <ExportButtons
              actions={["edit", "print", "pdf"]}
              editing={editing}
              onToggleEdit={() => setEditing((v) => !v)}
              documentName={`Жұмыс парағы — ${topic}`}
            />
            <SaveMaterialButton
              type="worksheet"
              title={topic}
              subject={subject}
              grade={grade}
              content={{ tasks }}
              metadata={{ level }}
            />
          </div>

          <div className="flex justify-center overflow-x-auto rounded-2xl bg-[#e7ebf1] p-4 sm:p-10">
            <div
              className="w-full max-w-[720px] shrink-0 bg-white px-8 py-10 shadow-lifted sm:px-12 sm:py-14"
              style={{ aspectRatio: "210 / 297" }}
            >
              <div className="flex items-start justify-between border-b border-primary/10 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Жұмыс парағы</p>
                  <h2 className="font-display mt-1 text-xl font-bold text-primary">{topic}</h2>
                  <p className="mt-1 text-xs text-muted">
                    {subject} · {grade}-сынып · {level} деңгей
                  </p>
                </div>
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-[linear-gradient(135deg,var(--color-cyan),var(--color-violet))] text-xs font-black text-white">
                  S
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm text-primary/70">
                <span>Аты-жөні: <span className="inline-block w-40 border-b border-primary/30">&nbsp;</span></span>
                <span>Сынып: <span className="inline-block w-16 border-b border-primary/30">&nbsp;</span></span>
                <span>Күні: <span className="inline-block w-24 border-b border-primary/30">&nbsp;</span></span>
              </div>

              <div className="mt-7 space-y-6">
                {tasks.map((task, i) => (
                  <div key={task.id}>
                    {editing ? (
                      <textarea
                        value={task.instruction}
                        onChange={(e) =>
                          setTasks((prev) =>
                            prev?.map((t) => (t.id === task.id ? { ...t, instruction: e.target.value } : t)) ?? prev,
                          )
                        }
                        className="w-full resize-y rounded-lg border border-primary/15 p-2 text-sm text-primary/85 outline-none focus:border-cyan/40"
                        rows={2}
                      />
                    ) : (
                      <p className="text-sm font-medium text-primary/85">{task.instruction}</p>
                    )}

                    {task.type === "choice" ? (
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-primary/70">
                        {["А", "Ә", "Б", "В"].map((letter) => (
                          <span key={letter} className="inline-flex items-center gap-1.5">
                            <span className="inline-block size-4 rounded-full border border-primary/30" />
                            {letter}) ...........
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-2 space-y-2.5">
                        <div className="h-px w-full bg-primary/15" />
                        <div className="h-px w-full bg-primary/15" />
                        {i % 3 === 0 ? <div className="h-px w-full bg-primary/15" /> : null}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-10 rounded-lg border border-dashed border-primary/25 p-3 text-xs text-muted">
                <span className="font-semibold text-primary/60">Мұғалім бөлімі:</span> Балл ______ /{" "}
                {tasks.length * 2} · Пікір: ..............................................
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
